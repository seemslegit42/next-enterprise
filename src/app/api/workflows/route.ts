import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { ApiResponse } from "../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";
import { CreateWorkflowDto } from "@/interfaces/workflow.interface";

// Schema for workflow creation/update validation
const workflowSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  definitionJson: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
    viewport: z.object({
      x: z.number(),
      y: z.number(),
      zoom: z.number(),
    }).optional(),
  }),
  version: z.number().optional(),
});

// GET /api/workflows - Get all workflows
export const GET = withTracing(async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    // Build filter conditions
    const where: any = {
      createdBy: session.user.id,
    };
    
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    const workflows = await traceDbOperation(
      () => prisma.workflow.findMany({
        where,
        orderBy: { updatedAt: "desc" },
      }),
      'workflow.findMany'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: workflows,
    });
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to fetch workflows",
    }, { status: 500 });
  }
}, 'workflows')

// POST /api/workflows - Create a new workflow
export const POST = withTracing(async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    const body = await req.json();

    // Validate request body
    const validationResult = workflowSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Validation error",
        data: validationResult.error.format(),
      }, { status: 400 });
    }

    const { name, description, definitionJson, version = 1 } = validationResult.data;

    const workflow = await traceDbOperation(
      () => prisma.workflow.create({
        data: {
          name,
          description,
          definitionJson,
          version,
          createdBy: session.user.id,
        },
      }),
      'workflow.create'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: workflow,
      message: "Workflow created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating workflow:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to create workflow",
    }, { status: 500 });
  }
}, 'workflows.create')
