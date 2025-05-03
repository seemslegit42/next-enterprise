import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { ApiResponse } from "../../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";

// GET /api/tasks/count - Get task counts by status
export const GET = withTracing(async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    // Get counts for each status
    const [
      pendingCount,
      runningCount,
      completedCount,
      failedCount,
      totalCount
    ] = await Promise.all([
      traceDbOperation(
        () => prisma.task.count({
          where: { status: "pending" }
        }),
        'task.countPending'
      ),
      traceDbOperation(
        () => prisma.task.count({
          where: { status: "running" }
        }),
        'task.countRunning'
      ),
      traceDbOperation(
        () => prisma.task.count({
          where: { status: "completed" }
        }),
        'task.countCompleted'
      ),
      traceDbOperation(
        () => prisma.task.count({
          where: { status: "failed" }
        }),
        'task.countFailed'
      ),
      traceDbOperation(
        () => prisma.task.count(),
        'task.countTotal'
      )
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        pending: pendingCount,
        running: runningCount,
        completed: completedCount,
        failed: failedCount,
        total: totalCount
      }
    });
  } catch (error) {
    console.error("Error fetching task counts:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to fetch task counts",
    }, { status: 500 });
  }
}, 'tasks.count');
