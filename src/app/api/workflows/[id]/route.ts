import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { ApiResponse } from "../../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";

// Schema for workflow update validation
const workflowUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  definitionJson: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
    viewport: z.object({
      x: z.number(),
      y: z.number(),
      zoom: z.number(),
    }).optional(),
  }).optional(),
  version: z.number().optional(),
});

// GET /api/workflows/[id] - Get a specific workflow
export const GET = withTracing(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    const workflow = await traceDbOperation(
      () => prisma.workflow.findUnique({
        where: { id: params.id },
      }),
      'workflow.findUnique'
    );

    if (!workflow) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Workflow not found",
      }, { status: 404 });
    }

    // Check if the user has access to this workflow
    if (workflow.createdBy !== session.user.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Unauthorized access to this workflow",
      }, { status: 403 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: workflow,
    });
  } catch (error) {
    console.error("Error fetching workflow:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to fetch workflow",
    }, { status: 500 });
  }
}, 'workflows.get')

// PATCH /api/workflows/[id] - Update a workflow
export const PATCH = withTracing(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    // Check if workflow exists and belongs to the user
    const existingWorkflow = await traceDbOperation(
      () => prisma.workflow.findUnique({
        where: { id: params.id },
      }),
      'workflow.findUnique.forUpdate'
    );

    if (!existingWorkflow) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Workflow not found",
      }, { status: 404 });
    }

    if (existingWorkflow.createdBy !== session.user.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Unauthorized access to this workflow",
      }, { status: 403 });
    }

    const body = await req.json();

    // Validate request body
    const validationResult = workflowUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Validation error",
        data: validationResult.error.format(),
      }, { status: 400 });
    }

    // Increment version if definitionJson is updated
    let version = existingWorkflow.version;
    if (validationResult.data.definitionJson) {
      version += 1;
    }

    const updatedWorkflow = await traceDbOperation(
      () => prisma.workflow.update({
        where: { id: params.id },
        data: {
          ...validationResult.data,
          version,
        },
      }),
      'workflow.update'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedWorkflow,
      message: "Workflow updated successfully",
    });
  } catch (error) {
    console.error("Error updating workflow:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to update workflow",
    }, { status: 500 });
  }
}, 'workflows.update')

// DELETE /api/workflows/[id] - Delete a workflow
export const DELETE = withTracing(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    // Check if workflow exists and belongs to the user
    const existingWorkflow = await traceDbOperation(
      () => prisma.workflow.findUnique({
        where: { id: params.id },
      }),
      'workflow.findUnique.forDelete'
    );

    if (!existingWorkflow) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Workflow not found",
      }, { status: 404 });
    }

    if (existingWorkflow.createdBy !== session.user.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Unauthorized access to this workflow",
      }, { status: 403 });
    }

    await traceDbOperation(
      () => prisma.workflow.delete({
        where: { id: params.id },
      }),
      'workflow.delete'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Workflow deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting workflow:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to delete workflow",
    }, { status: 500 });
  }
}, 'workflows.delete')
