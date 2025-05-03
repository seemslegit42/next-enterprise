import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { ApiResponse } from "../../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";

// Schema for task update validation
const taskUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "running", "completed", "failed"]).optional(),
  assignedTo: z.string().optional(),
});

// GET /api/tasks/[id] - Get a specific task
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

    const task = await traceDbOperation(
      () => prisma.task.findUnique({
        where: { id: params.id },
      }),
      'task.findUnique'
    );

    if (!task) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Task not found",
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to fetch task",
    }, { status: 500 });
  }
}, 'tasks.get')

// PATCH /api/tasks/[id] - Update a task
export const PATCH = withTracing(async (
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

    // Check if task exists
    const existingTask = await traceDbOperation(
      () => prisma.task.findUnique({
        where: { id: params.id },
      }),
      'task.findUnique.forUpdate'
    );

    if (!existingTask) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Task not found",
      }, { status: 404 });
    }

    const body = await req.json();

    // Validate request body
    const validationResult = taskUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Validation error",
        data: validationResult.error.format(),
      }, { status: 400 });
    }

    const updatedTask = await traceDbOperation(
      () => prisma.task.update({
        where: { id: params.id },
        data: validationResult.data,
      }),
      'task.update'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedTask,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to update task",
    }, { status: 500 });
  }
}, 'tasks.update')

// DELETE /api/tasks/[id] - Delete a task
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

    // Check if task exists
    const existingTask = await traceDbOperation(
      () => prisma.task.findUnique({
        where: { id: params.id },
      }),
      'task.findUnique.forDelete'
    );

    if (!existingTask) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Task not found",
      }, { status: 404 });
    }

    await traceDbOperation(
      () => prisma.task.delete({
        where: { id: params.id },
      }),
      'task.delete'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to delete task",
    }, { status: 500 });
  }
}, 'tasks.delete')
