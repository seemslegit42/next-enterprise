import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { ApiResponse } from "../../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";

// GET /api/logs/[id] - Get a specific log
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

    const log = await traceDbOperation(
      () => prisma.processLog.findUnique({
        where: { id: params.id },
      }),
      'processLog.findUnique'
    );

    if (!log) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Log not found",
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error("Error fetching log:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to fetch log",
    }, { status: 500 });
  }
}, 'logs.get')

// DELETE /api/logs/[id] - Delete a log
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

    // Check if log exists
    const existingLog = await traceDbOperation(
      () => prisma.processLog.findUnique({
        where: { id: params.id },
      }),
      'processLog.findUnique.forDelete'
    );

    if (!existingLog) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Log not found",
      }, { status: 404 });
    }

    await traceDbOperation(
      () => prisma.processLog.delete({
        where: { id: params.id },
      }),
      'processLog.delete'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Log deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting log:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to delete log",
    }, { status: 500 });
  }
}, 'logs.delete')
