import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../../../lib/auth";
import { ApiResponse } from "../../../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";
import workflowLogService from "@/lib/services/workflowLogService";

// GET /api/workflows/logs/stats - Get workflow execution log statistics
export const GET = withTracing(async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    // Get the log stats
    const stats = await traceDbOperation(
      () => workflowLogService.getLogStats(),
      'workflowLogService.getLogStats'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error getting workflow execution log stats:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to get workflow execution log statistics",
    }, { status: 500 });
  }
}, 'workflows.logs.getStats');
