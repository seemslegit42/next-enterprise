import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { ApiResponse } from "../../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";

// GET /api/agents/count - Get agent counts by provider
export const GET = withTracing(async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    // Get total agent count
    const totalCount = await traceDbOperation(
      () => prisma.agentDefinition.count(),
      'agentDefinition.count'
    );

    // Get count of agents created by current user
    const userCount = await traceDbOperation(
      () => prisma.agentDefinition.count({
        where: { createdBy: session.user.id }
      }),
      'agentDefinition.countByUser'
    );

    // Get count of agents by provider
    const providerCounts = await traceDbOperation(
      () => prisma.agentDefinition.groupBy({
        by: ['provider'],
        _count: {
          id: true
        }
      }),
      'agentDefinition.countByProvider'
    );

    // Format provider counts
    const providerCountsFormatted = providerCounts.reduce((acc, curr) => {
      acc[curr.provider] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        total: totalCount,
        user: userCount,
        providers: providerCountsFormatted
      }
    });
  } catch (error) {
    console.error("Error fetching agent counts:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to fetch agent counts",
    }, { status: 500 });
  }
}, 'agents.count');
