import { Node, Edge } from 'reactflow';

/**
 * Interface representing a workflow definition
 */
export interface WorkflowDefinition {
  /**
   * Unique identifier for the workflow
   */
  id: string;

  /**
   * Name of the workflow
   */
  name: string;

  /**
   * Optional description of the workflow
   */
  description?: string;

  /**
   * JSON object matching React Flow structure
   */
  definitionJson: {
    nodes: Node[];
    edges: Edge[];
    viewport?: {
      x: number;
      y: number;
      zoom: number;
    };
  };

  /**
   * Version number of the workflow
   * @default 1
   */
  version: number;

  /**
   * Date when the workflow was created
   */
  createdAt: Date;

  /**
   * Date when the workflow was last updated
   */
  updatedAt: Date;

  /**
   * ID of the user who created the workflow
   */
  createdBy?: string;
}

/**
 * Interface for creating a new workflow
 */
export interface CreateWorkflowDto {
  name: string;
  description?: string;
  definitionJson: WorkflowDefinition['definitionJson'];
  version?: number;
}

/**
 * Interface for updating an existing workflow
 */
export interface UpdateWorkflowDto {
  name?: string;
  description?: string;
  definitionJson?: WorkflowDefinition['definitionJson'];
  version?: number;
}

/**
 * Interface for node configuration
 */
export interface NodeConfig {
  type: string;
  label: string;
  description?: string;
  properties?: Record<string, any>;
}

/**
 * Enum for basic node types
 */
export enum NodeType {
  START = 'start',
  STOP = 'stop',
  LOG_MESSAGE = 'logMessage',
  CONDITION = 'condition',
  TASK = 'task',
  PROCESS = 'process',
  DECISION = 'decision',
  AGENT_TASK = 'agentTask',
}
