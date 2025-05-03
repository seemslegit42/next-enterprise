import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";
import { ApiResponse } from "../../../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";
import workflowExecutionService from "@/lib/services/workflowExecutionService";
import logger from "@/lib/logger";

// POST /api/workflows/execute/[id] - Execute a workflow
export const POST = withTracing(async (
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

    // Log the execution request
    await logger.info({
      processName: "workflowExecution.api",
      message: `Workflow execution requested for workflow ${params.id}`,
      metadata: { workflowId: params.id, userId: session.user.id },
    });

    // Fetch the workflow
    const workflow = await traceDbOperation(
      () => prisma.workflow.findUnique({
        where: { id: params.id },
      }),
      'workflow.findUnique.forExecution'
    );

    if (!workflow) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Workflow not found",
      }, { status: 404 });
    }

    // Check if the user has permission to execute this workflow
    if (workflow.createdBy !== session.user.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "You don't have permission to execute this workflow",
      }, { status: 403 });
    }

    // Execute the workflow
    const executionResult = await workflowExecutionService.executeWorkflow(
      params.id,
      session.user.id
    );

    if (!executionResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: executionResult.error || "Workflow execution failed",
      }, { status: 500 });
    }

    // Log successful execution request
    await logger.info({
      processName: "workflowExecution.api",
      message: `Workflow ${params.id} execution initiated successfully`,
      metadata: {
        workflowId: params.id,
        userId: session.user.id,
        executionId: executionResult.executionId
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        workflowId: params.id,
        executionId: executionResult.executionId,
      },
      message: "Workflow execution initiated successfully",
    });
  } catch (error) {
    // Log the error
    await logger.error({
      processName: "workflowExecution.api",
      message: `Error executing workflow ${params.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      metadata: { workflowId: params.id, error },
    });

    console.error("Error executing workflow:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to execute workflow",
    }, { status: 500 });
  }
}, 'workflows.execute');

// GET /api/workflows/execute/[id] - Get execution status
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

    // Get the execution status
    const executionResult = await workflowExecutionService.getExecutionStatus(params.id);

    if (!executionResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: executionResult.error || "Failed to get execution status",
      }, { status: 404 });
    }

    // Check if the user has permission to view this execution
    if (executionResult.data.startedBy !== session.user.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "You don't have permission to view this execution",
      }, { status: 403 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: executionResult.data,
    });
  } catch (error) {
    console.error("Error getting execution status:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to get execution status",
    }, { status: 500 });
  }
}, 'workflows.execute.status');

// DELETE /api/workflows/execute/[id] - Cancel a workflow execution
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

    // Get the execution
    const execution = await traceDbOperation(
      () => prisma.workflowExecution.findUnique({
        where: { id: params.id },
      }),
      'workflowExecution.findUnique.forCancel'
    );

    if (!execution) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Execution not found",
      }, { status: 404 });
    }

    // Check if the user has permission to cancel this execution
    if (execution.startedBy !== session.user.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "You don't have permission to cancel this execution",
      }, { status: 403 });
    }

    // Cancel the execution
    const cancelResult = await workflowExecutionService.cancelExecution(params.id);

    if (!cancelResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: cancelResult.error || "Failed to cancel execution",
      }, { status: 400 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: cancelResult.message,
    });
  } catch (error) {
    console.error("Error canceling execution:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to cancel execution",
    }, { status: 500 });
  }
}, 'workflows.execute.cancel');
