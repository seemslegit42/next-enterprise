import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { ApiResponse } from "../../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";

// GET /api/logs/count - Get log counts by level
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
    const timeframe = searchParams.get("timeframe") || "all"; // all, today, week, month
    
    // Build date filter based on timeframe
    const dateFilter: any = {};
    const now = new Date();
    
    if (timeframe === "today") {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      
      dateFilter.timestamp = {
        gte: startOfDay
      };
    } else if (timeframe === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      startOfWeek.setHours(0, 0, 0, 0);
      
      dateFilter.timestamp = {
        gte: startOfWeek
      };
    } else if (timeframe === "month") {
      const startOfMonth = new Date(now);
      startOfMonth.setDate(1); // Start of month
      startOfMonth.setHours(0, 0, 0, 0);
      
      dateFilter.timestamp = {
        gte: startOfMonth
      };
    }

    // Get counts for each level
    const [
      infoCount,
      warnCount,
      errorCount,
      totalCount
    ] = await Promise.all([
      traceDbOperation(
        () => prisma.processLog.count({
          where: { 
            level: "info",
            ...dateFilter
          }
        }),
        'processLog.countInfo'
      ),
      traceDbOperation(
        () => prisma.processLog.count({
          where: { 
            level: "warn",
            ...dateFilter
          }
        }),
        'processLog.countWarn'
      ),
      traceDbOperation(
        () => prisma.processLog.count({
          where: { 
            level: "error",
            ...dateFilter
          }
        }),
        'processLog.countError'
      ),
      traceDbOperation(
        () => prisma.processLog.count({
          where: dateFilter
        }),
        'processLog.countTotal'
      )
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        info: infoCount,
        warn: warnCount,
        error: errorCount,
        total: totalCount,
        timeframe
      }
    });
  } catch (error) {
    console.error("Error fetching log counts:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to fetch log counts",
    }, { status: 500 });
  }
}, 'logs.count');
