import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { ApiResponse } from "../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";

// Schema for task creation/update validation
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  status: z.enum(["pending", "running", "completed", "failed"]),
  assignedTo: z.string().optional(),
});

// GET /api/tasks - Get all tasks
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
    const status = searchParams.get("status");
    const assignedTo = searchParams.get("assignedTo");

    // Build filter conditions
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (assignedTo) {
      where.assignedTo = assignedTo;
    }

    const tasks = await traceDbOperation(
      () => prisma.task.findMany({
        where,
        orderBy: { updatedAt: "desc" },
      }),
      'task.findMany'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to fetch tasks",
    }, { status: 500 });
  }
}, 'tasks')

// POST /api/tasks - Create a new task
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
    const validationResult = taskSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Validation error",
        data: validationResult.error.format(),
      }, { status: 400 });
    }

    const { title, description, status } = validationResult.data;
    const assignedTo = validationResult.data.assignedTo || session.user.id;

    const task = await traceDbOperation(
      () => prisma.task.create({
        data: {
          title,
          description,
          status,
          assignedTo,
        },
      }),
      'task.create'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: task,
      message: "Task created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to create task",
    }, { status: 500 });
  }
}, 'tasks.create')
