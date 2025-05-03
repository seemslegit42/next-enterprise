import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../../../lib/auth";
import { ApiResponse } from "../../../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";
import workflowLogService from "@/lib/services/workflowLogService";

// GET /api/workflows/logs/[id] - Get a specific workflow execution log
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

    // Get the log
    const log = await traceDbOperation(
      () => workflowLogService.getLogById(params.id),
      'workflowLogService.getLogById'
    );

    if (!log) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Workflow execution log not found",
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error("Error getting workflow execution log:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to get workflow execution log",
    }, { status: 500 });
  }
}, 'workflows.logs.getById');
