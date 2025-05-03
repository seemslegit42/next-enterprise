import prisma from "../prisma";
import logger from "../logger";
import { AgentDefinition } from "../../interfaces";

/**
 * Service for managing agent definitions
 */
export const agentService = {
  /**
   * Get all agent definitions with optional filtering
   */
  async getAgents(filters: { provider?: string; createdBy?: string } = {}) {
    try {
      const { provider, createdBy } = filters;
      
      const where: any = {};
      if (provider) {
        where.provider = provider;
      }
      if (createdBy) {
        where.createdBy = createdBy;
      }
      
      return await prisma.agentDefinition.findMany({
        where,
        orderBy: { updatedAt: "desc" },
      });
    } catch (error) {
      logger.error({
        processName: "agentService.getAgents",
        message: "Failed to fetch agents",
        metadata: { error, filters },
      });
      throw error;
    }
  },

  /**
   * Get a single agent definition by ID
   */
  async getAgentById(id: string) {
    try {
      return await prisma.agentDefinition.findUnique({
        where: { id },
      });
    } catch (error) {
      logger.error({
        processName: "agentService.getAgentById",
        message: "Failed to fetch agent",
        metadata: { error, id },
      });
      throw error;
    }
  },

  /**
   * Create a new agent definition
   */
  async createAgent(data: {
    name: string;
    description?: string;
    provider: 'SuperAGI' | 'AutoGen' | 'OpenAI_Assistant' | 'Custom';
    config: Record<string, any>;
    createdBy: string;
  }) {
    try {
      return await prisma.agentDefinition.create({
        data,
      });
    } catch (error) {
      logger.error({
        processName: "agentService.createAgent",
        message: "Failed to create agent",
        metadata: { error, data },
      });
      throw error;
    }
  },

  /**
   * Update an existing agent definition
   */
  async updateAgent(
    id: string,
    data: Partial<{
      name: string;
      description?: string;
      provider: 'SuperAGI' | 'AutoGen' | 'OpenAI_Assistant' | 'Custom';
      config: Record<string, any>;
    }>
  ) {
    try {
      return await prisma.agentDefinition.update({
        where: { id },
        data,
      });
    } catch (error) {
      logger.error({
        processName: "agentService.updateAgent",
        message: "Failed to update agent",
        metadata: { error, id, data },
      });
      throw error;
    }
  },

  /**
   * Delete an agent definition
   */
  async deleteAgent(id: string) {
    try {
      return await prisma.agentDefinition.delete({
        where: { id },
      });
    } catch (error) {
      logger.error({
        processName: "agentService.deleteAgent",
        message: "Failed to delete agent",
        metadata: { error, id },
      });
      throw error;
    }
  },
};

export default agentService;
