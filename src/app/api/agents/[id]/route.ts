import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../../lib/auth";
import { ApiResponse } from "../../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";
import agentService from "@/lib/services/agentService";

// Schema for agent update validation
const agentUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  provider: z.enum(["SuperAGI", "AutoGen", "OpenAI_Assistant", "Custom"]).optional(),
  config: z.record(z.any()).optional(),
});

// GET /api/agents/[id] - Get a specific agent
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

    const agent = await traceDbOperation(
      () => agentService.getAgentById(params.id),
      'agentService.getAgentById'
    );

    if (!agent) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Agent not found",
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: agent,
    });
  } catch (error) {
    console.error("Error fetching agent:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to fetch agent",
    }, { status: 500 });
  }
}, 'agents.get')

// PATCH /api/agents/[id] - Update an agent
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

    // Check if agent exists
    const existingAgent = await traceDbOperation(
      () => agentService.getAgentById(params.id),
      'agentService.getAgentById.forUpdate'
    );

    if (!existingAgent) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Agent not found",
      }, { status: 404 });
    }

    // Check if user is the creator of the agent
    if (existingAgent.createdBy !== session.user.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Unauthorized to update this agent",
      }, { status: 403 });
    }

    const body = await req.json();

    // Validate request body
    const validationResult = agentUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Validation error",
        data: validationResult.error.format(),
      }, { status: 400 });
    }

    const updatedAgent = await traceDbOperation(
      () => agentService.updateAgent(params.id, validationResult.data),
      'agentService.updateAgent'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedAgent,
      message: "Agent updated successfully",
    });
  } catch (error) {
    console.error("Error updating agent:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to update agent",
    }, { status: 500 });
  }
}, 'agents.update')

// DELETE /api/agents/[id] - Delete an agent
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

    // Check if agent exists
    const existingAgent = await traceDbOperation(
      () => agentService.getAgentById(params.id),
      'agentService.getAgentById.forDelete'
    );

    if (!existingAgent) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Agent not found",
      }, { status: 404 });
    }

    // Check if user is the creator of the agent
    if (existingAgent.createdBy !== session.user.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Unauthorized to delete this agent",
      }, { status: 403 });
    }

    await traceDbOperation(
      () => agentService.deleteAgent(params.id),
      'agentService.deleteAgent'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Agent deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to delete agent",
    }, { status: 500 });
  }
}, 'agents.delete')
