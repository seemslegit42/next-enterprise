import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../../../../lib/auth";
import prisma from "../../../../../../lib/prisma";
import { ApiResponse } from "../../../../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";
import logger from "@/lib/logger";

// GET /api/workflows/logs/entries/[id] - Get a specific log entry
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

    // Get the log entry
    const entry = await traceDbOperation(
      () => prisma.logEntry.findUnique({
        where: { id: params.id },
      }),
      'logEntry.findUnique'
    );

    if (!entry) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Log entry not found",
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error("Error getting log entry:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to get log entry",
    }, { status: 500 });
  }
}, 'workflows.logs.entries.getById');

// DELETE /api/workflows/logs/entries/[id] - Delete a log entry
export const DELETE = withTracing(async (
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

    // Check if the log entry exists
    const entry = await traceDbOperation(
      () => prisma.logEntry.findUnique({
        where: { id: params.id },
      }),
      'logEntry.findUnique.forDelete'
    );

    if (!entry) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Log entry not found",
      }, { status: 404 });
    }

    // Delete the log entry
    await traceDbOperation(
      () => prisma.logEntry.delete({
        where: { id: params.id },
      }),
      'logEntry.delete'
    );

    // Log the deletion
    await logger.info({
      processName: "workflowLogEntry.api",
      message: `Log entry ${params.id} deleted`,
      metadata: { entryId: params.id },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Log entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting log entry:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to delete log entry",
    }, { status: 500 });
  }
}, 'workflows.logs.entries.delete');
