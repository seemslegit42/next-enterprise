import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../../lib/auth";
import { ApiResponse } from "../../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";
import workflowLogService from "@/lib/services/workflowLogService";

// Schema for log query validation
const logQuerySchema = z.object({
  workflowId: z.string().optional(),
  status: z.enum(["Running", "Completed", "Failed"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// GET /api/workflows/logs - Get all workflow execution logs
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
    const url = new URL(req.url);
    const workflowId = url.searchParams.get("workflowId") || undefined;
    const status = url.searchParams.get("status") || undefined;
    const startDate = url.searchParams.get("startDate") || undefined;
    const endDate = url.searchParams.get("endDate") || undefined;

    // Validate query parameters
    const validationResult = logQuerySchema.safeParse({
      workflowId,
      status,
      startDate,
      endDate,
    });

    if (!validationResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Invalid query parameters",
        validationErrors: validationResult.error.errors,
      }, { status: 400 });
    }

    // Build the query
    const where: any = {};

    if (workflowId) {
      where.workflowDefinitionId = workflowId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate) {
      where.startTime = {
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      where.endTime = {
        lte: new Date(endDate),
      };
    }

    // Get the logs
    const logs = await traceDbOperation(
      () => workflowLogService.getLogs({
        workflowId,
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      }),
      'workflowLogService.getLogs'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error("Error getting workflow execution logs:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to get workflow execution logs",
    }, { status: 500 });
  }
}, 'workflows.logs.getAll');
