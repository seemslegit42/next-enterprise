import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../../../lib/auth";
import { ApiResponse } from "../../../types/api";
import { withTracing, traceDbOperation } from "@/lib/tracing";
import agentService from "@/lib/services/agentService";

// Schema for agent creation/update validation
const agentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  provider: z.enum(["SuperAGI", "AutoGen", "OpenAI_Assistant", "Custom"]),
  config: z.record(z.any()),
});

// GET /api/agents - Get all agents
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
    const provider = searchParams.get("provider");
    const createdBy = searchParams.get("createdBy");

    // Prepare filters
    const filters: { provider?: string; createdBy?: string } = {};
    if (provider) {
      filters.provider = provider;
    }
    if (createdBy) {
      filters.createdBy = createdBy;
    }

    const agents = await traceDbOperation(
      () => agentService.getAgents(filters),
      'agentService.getAgents'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: agents,
    });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to fetch agents",
    }, { status: 500 });
  }
}, 'agents')

// POST /api/agents - Create a new agent
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
    const validationResult = agentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: "Validation error",
        data: validationResult.error.format(),
      }, { status: 400 });
    }

    const { name, description, provider, config } = validationResult.data;

    const agent = await traceDbOperation(
      () => agentService.createAgent({
        name,
        description,
        provider,
        config,
        createdBy: session.user.id,
      }),
      'agentService.createAgent'
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: agent,
      message: "Agent created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: "Failed to create agent",
    }, { status: 500 });
  }
}, 'agents.create')
