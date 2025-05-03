import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { ApiResponse } from "../../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";

// GET /api/workflows/count - Get workflow counts
export const GET = withTracing(async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    // Get total workflow count
    const totalCount = await traceDbOperation(
      () => prisma.workflow.count(),
      'workflow.count'
    );

    // Get count of workflows created by current user
    const userCount = await traceDbOperation(
      () => prisma.workflow.count({
        where: { createdBy: session.user.id }
      }),
      'workflow.countByUser'
    );

    // Get count of workflows by version
    const versionCounts = await traceDbOperation(
      () => prisma.workflow.groupBy({
        by: ['version'],
        _count: {
          id: true
        }
      }),
      'workflow.countByVersion'
    );

    // Format version counts
    const versionCountsFormatted = versionCounts.reduce((acc, curr) => {
      acc[`v${curr.version}`] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        total: totalCount,
        user: userCount,
        versions: versionCountsFormatted
      }
    });
  } catch (error) {
    console.error("Error fetching workflow counts:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to fetch workflow counts",
    }, { status: 500 });
  }
}, 'workflows.count');
