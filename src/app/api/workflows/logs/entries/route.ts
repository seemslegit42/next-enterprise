import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";
import { ApiResponse } from "../../../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";
import logger from "@/lib/logger";

// Schema for log entry query validation
const logEntryQuerySchema = z.object({
  workflowExecutionLogId: z.string().optional(),
  nodeId: z.string().optional(),
  level: z.enum(["Info", "Warn", "Error"]).optional(),
});

// GET /api/workflows/logs/entries - Get log entries with optional filtering
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
    const workflowExecutionLogId = url.searchParams.get("workflowExecutionLogId") || undefined;
    const nodeId = url.searchParams.get("nodeId") || undefined;
    const level = url.searchParams.get("level") || undefined;
    const limit = parseInt(url.searchParams.get("limit") || "100", 10);

    // Validate query parameters
    const validationResult = logEntryQuerySchema.safeParse({
      workflowExecutionLogId,
      nodeId,
      level,
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

    if (workflowExecutionLogId) {
      where.workflowExecutionLogId = workflowExecutionLogId;
    }

    if (nodeId) {
      where.nodeId = nodeId;
    }

    if (level) {
      where.level = level;
    }

    // Get the log entries
    const entries = await traceDbOperation(
      () => prisma.logEntry.findMany({
        where,
        orderBy: {
          timestamp: "desc",
        },
        take: limit,
      }),
      'logEntry.findMany'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error("Error getting log entries:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to get log entries",
    }, { status: 500 });
  }
}, 'workflows.logs.entries.getAll');

// Schema for log entry creation validation
const logEntryCreateSchema = z.object({
  workflowExecutionLogId: z.string(),
  nodeId: z.string(),
  nodeType: z.string(),
  level: z.enum(["Info", "Warn", "Error"]),
  message: z.string(),
  data: z.record(z.any()).optional(),
});

// POST /api/workflows/logs/entries - Create a new log entry
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
    const validationResult = logEntryCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Validation error",
        data: validationResult.error.format(),
      }, { status: 400 });
    }

    const { workflowExecutionLogId, nodeId, nodeType, level, message, data } = validationResult.data;

    // Check if the workflow execution log exists
    const executionLog = await traceDbOperation(
      () => prisma.workflowExecutionLog.findUnique({
        where: { id: workflowExecutionLogId },
      }),
      'workflowExecutionLog.findUnique'
    );

    if (!executionLog) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Workflow execution log not found",
      }, { status: 404 });
    }

    // Create the log entry
    const entry = await traceDbOperation(
      () => prisma.logEntry.create({
        data: {
          workflowExecutionLogId,
          nodeId,
          nodeType,
          level,
          message,
          data,
        },
      }),
      'logEntry.create'
    );

    // Log the creation
    await logger.info({
      processName: "workflowLogEntry.api",
      message: `Log entry created for workflow execution ${workflowExecutionLogId}`,
      metadata: { entryId: entry.id, nodeId, level },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: entry,
      message: "Log entry created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating log entry:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to create log entry",
    }, { status: 500 });
  }
}, 'workflows.logs.entries.create');
