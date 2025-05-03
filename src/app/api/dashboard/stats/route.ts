import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { ApiResponse } from "../../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";
import workflowLogService from "@/lib/services/workflowLogService";

// GET /api/dashboard/stats - Get dashboard statistics
export const GET = withTracing(async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    // Get counts for various entities
    const [
      activeTasks,
      completedTasks,
      totalWorkflows,
      recentLogs,
      workflowStats
    ] = await Promise.all([
      // Active tasks (pending or running)
      traceDbOperation(
        () => prisma.task.count({
          where: {
            status: {
              in: ["pending", "running"]
            }
          }
        }),
        'task.countActive'
      ),
      
      // Completed tasks
      traceDbOperation(
        () => prisma.task.count({
          where: {
            status: "completed"
          }
        }),
        'task.countCompleted'
      ),
      
      // Total workflows
      traceDbOperation(
        () => prisma.workflow.count(),
        'workflow.count'
      ),
      
      // Recent logs
      traceDbOperation(
        () => prisma.processLog.findMany({
          take: 5,
          orderBy: {
            timestamp: "desc"
          }
        }),
        'processLog.findRecent'
      ),
      
      // Workflow execution stats
      traceDbOperation(
        () => workflowLogService.getLogStats(),
        'workflowLogService.getLogStats'
      )
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        tasks: {
          active: activeTasks,
          completed: completedTasks,
          total: activeTasks + completedTasks
        },
        workflows: {
          total: totalWorkflows
        },
        workflowExecutions: {
          running: workflowStats.runningCount,
          completed: workflowStats.completedCount,
          failed: workflowStats.failedCount,
          total: workflowStats.totalCount,
          recent: workflowStats.recentLogs
        },
        recentLogs
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to fetch dashboard statistics",
    }, { status: 500 });
  }
}, 'dashboard.stats');
