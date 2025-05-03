import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { ApiResponse } from "../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";

// Schema for log creation validation
const logSchema = z.object({
  processName: z.string().min(1, "Process name is required"),
  level: z.enum(["info", "warn", "error"]),
  message: z.string().min(1, "Message is required"),
  metadata: z.record(z.any()).optional(),
});

// GET /api/logs - Get all logs
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
    const processName = searchParams.get("processName");
    const level = searchParams.get("level");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    // Build filter conditions
    const where: any = {};
    if (processName) {
      where.processName = processName;
    }
    if (level) {
      where.level = level;
    }

    const logs = await traceDbOperation(
      () => prisma.processLog.findMany({
        where,
        orderBy: { timestamp: "desc" },
        take: limit,
      }),
      'processLog.findMany'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to fetch logs",
    }, { status: 500 });
  }
}, 'logs')

// POST /api/logs - Create a new log
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
    const validationResult = logSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Validation error",
        data: validationResult.error.format(),
      }, { status: 400 });
    }

    const { processName, level, message, metadata = {} } = validationResult.data;

    const log = await traceDbOperation(
      () => prisma.processLog.create({
        data: {
          processName,
          level,
          message,
          metadata,
        },
      }),
      'processLog.create'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: log,
      message: "Log created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating log:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to create log",
    }, { status: 500 });
  }
}, 'logs.create')
