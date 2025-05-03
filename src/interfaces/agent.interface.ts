/**
 * Interface representing an agent definition in the system
 */
export interface AgentDefinition {
  /**
   * Unique identifier for the agent
   */
  id: string;
  
  /**
   * Name of the agent
   */
  name: string;
  
  /**
   * Optional description of the agent
   */
  description?: string;
  
  /**
   * Provider of the agent
   */
  provider: 'SuperAGI' | 'AutoGen' | 'OpenAI_Assistant' | 'Custom';
  
  /**
   * Configuration for the agent (API endpoint, keys, specific settings)
   */
  config: Record<string, any>;
  
  /**
   * Timestamp when the agent was created
   */
  createdAt: Date;
  
  /**
   * Timestamp when the agent was last updated
   */
  updatedAt: Date;
}

/**
 * Type for creating a new agent (without system-generated fields)
 */
export type CreateAgentInput = Omit<AgentDefinition, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Type for updating an existing agent
 */
export type UpdateAgentInput = Partial<Omit<AgentDefinition, 'id' | 'createdAt' | 'updatedAt'>>;
