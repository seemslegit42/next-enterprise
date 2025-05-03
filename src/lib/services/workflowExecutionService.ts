import { Node, Edge } from 'reactflow';
import { NodeType } from '@/interfaces/workflow.interface';
import { WorkflowExecutionLog, LogEntry } from '@/interfaces/execution.interface';
import logger from '../logger';
import agentService from './agentService';
import axios from 'axios';
import prisma from '../prisma';
import { v4 as uuidv4 } from 'uuid';
import { ExecutionState } from '@prisma/client';

/**
 * Execution state of a node
 */
export enum NodeExecutionState {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

/**
 * Service for executing workflows
 */
export const workflowExecutionService = {
  /**
   * Execute a workflow based on its definition
   */
  async executeWorkflow(workflowId: string, userId: string) {
    try {
      // Create an execution record
      const executionId = uuidv4();

      // Create execution record in database
      const execution = await prisma.workflowExecution.create({
        data: {
          id: executionId,
          workflowId,
          state: ExecutionState.PENDING,
          startedAt: new Date(),
          startedBy: userId,
          variables: {},
          logs: [],
        },
      });

      // Create a WorkflowExecutionLog record
      const executionLog = await prisma.workflowExecutionLog.create({
        data: {
          workflowDefinitionId: workflowId,
          executionId: executionId,
          status: 'Running',
        },
      });

      // Start the execution asynchronously
      this.startExecution(executionId, workflowId).catch(error => {
        logger.error({
          processName: 'workflowExecutionService.executeWorkflow',
          message: `Error executing workflow ${workflowId}`,
          metadata: { error, workflowId, executionId },
        });

        // Update the WorkflowExecutionLog status to Failed
        this.updateExecutionLogStatus(executionLog.id, 'Failed');
      });

      return {
        success: true,
        executionId,
      };
    } catch (error) {
      logger.error({
        processName: 'workflowExecutionService.executeWorkflow',
        message: `Error initiating workflow execution ${workflowId}`,
        metadata: { error, workflowId },
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during workflow execution',
      };
    }
  },

  /**
   * Update the status of a WorkflowExecutionLog
   */
  async updateExecutionLogStatus(executionLogId: string, status: 'Running' | 'Completed' | 'Failed') {
    try {
      const updateData: any = { status };

      // If the status is Completed or Failed, set the endTime
      if (status === 'Completed' || status === 'Failed') {
        updateData.endTime = new Date();
      }

      await prisma.workflowExecutionLog.update({
        where: { id: executionLogId },
        data: updateData,
      });
    } catch (error) {
      logger.error({
        processName: 'workflowExecutionService.updateExecutionLogStatus',
        message: `Error updating execution log status`,
        metadata: { error, executionLogId, status },
      });
    }
  },

  /**
   * Start the execution of a workflow
   */
  async startExecution(executionId: string, workflowId: string) {
    try {
      // Update execution state to RUNNING
      await prisma.workflowExecution.update({
        where: { id: executionId },
        data: { state: ExecutionState.RUNNING },
      });

      // Get the workflow definition
      const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
      });

      if (!workflow) {
        throw new Error(`Workflow with ID ${workflowId} not found`);
      }

      // Get the WorkflowExecutionLog record
      const executionLog = await prisma.workflowExecutionLog.findUnique({
        where: { executionId },
      });

      if (!executionLog) {
        throw new Error(`WorkflowExecutionLog with executionId ${executionId} not found`);
      }

      const { nodes, edges } = workflow.definitionJson;

      // Create execution context to store variables and state
      const executionContext: Record<string, any> = {
        executionId,
        workflowId,
        executionLogId: executionLog.id,
        variables: {},
        logs: [],
        output: null,
        nodeStates: {},
      };

      // Initialize node states
      for (const node of nodes) {
        executionContext.nodeStates[node.id] = {
          state: NodeExecutionState.PENDING,
          startedAt: null,
          completedAt: null,
          error: null,
          output: null,
        };
      }

      // Find the start node
      const startNode = nodes.find(node => node.type === NodeType.START);
      if (!startNode) {
        throw new Error('Workflow must have a start node');
      }

      // Execute the workflow starting from the start node
      await this.executeNode(startNode, nodes, edges, executionContext);

      // Update execution state to COMPLETED
      await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
          state: ExecutionState.COMPLETED,
          completedAt: new Date(),
          variables: executionContext.variables,
          logs: executionContext.logs,
          output: executionContext.output,
          nodeStates: executionContext.nodeStates,
        },
      });

      // Update the WorkflowExecutionLog status to Completed
      await this.updateExecutionLogStatus(executionLog.id, 'Completed');

      return {
        success: true,
        executionContext,
      };
    } catch (error) {
      // Update execution state to FAILED
      await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
          state: ExecutionState.FAILED,
          completedAt: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      // Get the WorkflowExecutionLog record and update its status to Failed
      try {
        const executionLog = await prisma.workflowExecutionLog.findUnique({
          where: { executionId },
        });

        if (executionLog) {
          await this.updateExecutionLogStatus(executionLog.id, 'Failed');
        }
      } catch (logError) {
        logger.error({
          processName: 'workflowExecutionService.startExecution',
          message: `Error updating WorkflowExecutionLog status for failed execution`,
          metadata: { logError, workflowId, executionId },
        });
      }

      logger.error({
        processName: 'workflowExecutionService.startExecution',
        message: `Error executing workflow ${workflowId}`,
        metadata: { error, workflowId, executionId },
      });

      throw error;
    }
  },

  /**
   * Execute a single node in the workflow
   */
  async executeNode(
    currentNode: Node,
    allNodes: Node[],
    allEdges: Edge[],
    context: Record<string, any>,
    retryCount = 0
  ): Promise<any> {
    const nodeId = currentNode.id;
    const nodeState = context.nodeStates[nodeId];

    try {
      // Update node state to RUNNING
      nodeState.state = NodeExecutionState.RUNNING;
      nodeState.startedAt = new Date();

      // Persist the updated node state
      await this.persistNodeState(context.executionId, nodeId, nodeState);

      // Log node execution
      await logger.info({
        processName: 'workflowExecution',
        message: `Executing node: ${nodeId} (${currentNode.type})`,
        metadata: {
          nodeId,
          nodeType: currentNode.type,
          nodeData: currentNode.data,
          executionId: context.executionId,
          workflowId: context.workflowId,
          retryCount,
        },
      });

      // Add to execution context logs
      context.logs.push({
        nodeId,
        message: `Executing node: ${nodeId} (${currentNode.type})`,
        level: 'info',
        timestamp: new Date(),
      });

      // Create a LogEntry record
      await this.createLogEntry(context.executionLogId, {
        nodeId,
        nodeType: currentNode.type,
        level: 'Info',
        message: `Executing node: ${nodeId} (${currentNode.type})`,
        data: { nodeData: currentNode.data },
      });

      let result = null;

      // Execute node based on its type
      switch (currentNode.type) {
        case NodeType.START:
          // Start node just passes through to the next node
          result = { success: true };
          break;

        case NodeType.STOP:
          // Stop node terminates execution
          result = { success: true, message: 'Workflow execution completed' };
          context.output = currentNode.data?.output || 'Workflow completed';
          break;

        case NodeType.LOG_MESSAGE:
          // Log a message
          result = await this.executeLogMessageNode(currentNode, context);
          break;

        case NodeType.CONDITION:
          // Evaluate a condition and follow the appropriate path
          result = await this.executeConditionNode(currentNode, allNodes, allEdges, context);
          // Condition node handles its own next node execution
          return result;

        case NodeType.AGENT_TASK:
          // Execute an agent task
          result = await this.executeAgentTaskNode(currentNode, context);
          break;

        case NodeType.TASK:
          // Execute a regular task
          result = await this.executeTaskNode(currentNode, context);
          break;

        default:
          // For unknown node types, just pass through
          result = { success: true };
      }

      // Update node state to COMPLETED
      nodeState.state = NodeExecutionState.COMPLETED;
      nodeState.completedAt = new Date();
      nodeState.output = result;

      // Persist the updated node state
      await this.persistNodeState(context.executionId, nodeId, nodeState);

      // Find the next nodes to execute
      const outgoingEdges = allEdges.filter(edge => edge.source === nodeId);

      // If there are no outgoing edges, we're done with this branch
      if (outgoingEdges.length === 0) {
        return result;
      }

      // For parallel execution, we need to execute all outgoing edges
      const nextNodePromises = outgoingEdges.map(async edge => {
        const nextNodeId = edge.target;
        const nextNode = allNodes.find(node => node.id === nextNodeId);

        if (!nextNode) {
          throw new Error(`Next node with ID ${nextNodeId} not found`);
        }

        // Check if the edge has a condition
        if (edge.data?.condition) {
          // Evaluate the condition
          const conditionMet = this.evaluateCondition(edge.data.condition, context);
          if (!conditionMet) {
            // Skip this path if condition is not met
            context.nodeStates[nextNodeId].state = NodeExecutionState.SKIPPED;
            await this.persistNodeState(context.executionId, nextNodeId, context.nodeStates[nextNodeId]);
            return null;
          }
        }

        // Execute the next node
        return this.executeNode(nextNode, allNodes, allEdges, context);
      });

      // Wait for all next nodes to complete
      await Promise.all(nextNodePromises);

      return result;
    } catch (error) {
      // Log the error
      await logger.error({
        processName: 'workflowExecution',
        message: `Error executing node: ${nodeId} (${currentNode.type})`,
        metadata: {
          nodeId,
          nodeType: currentNode.type,
          error,
          executionId: context.executionId,
          workflowId: context.workflowId,
          retryCount,
        },
      });

      // Add to execution context logs
      context.logs.push({
        nodeId,
        message: `Error executing node: ${error instanceof Error ? error.message : 'Unknown error'}`,
        level: 'error',
        timestamp: new Date(),
      });

      // Create an error LogEntry record
      await this.createLogEntry(context.executionLogId, {
        nodeId,
        nodeType: currentNode.type,
        level: 'Error',
        message: `Error executing node: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: { error: error instanceof Error ? error.message : 'Unknown error' },
      });

      // Check if we should retry
      const maxRetries = currentNode.data?.retries || 0;
      if (retryCount < maxRetries) {
        // Log retry attempt
        await logger.info({
          processName: 'workflowExecution',
          message: `Retrying node: ${nodeId} (${currentNode.type}), attempt ${retryCount + 1} of ${maxRetries}`,
          metadata: {
            nodeId,
            nodeType: currentNode.type,
            executionId: context.executionId,
            workflowId: context.workflowId,
            retryCount,
          },
        });

        // Add to execution context logs
        context.logs.push({
          nodeId,
          message: `Retrying node: attempt ${retryCount + 1} of ${maxRetries}`,
          level: 'info',
          timestamp: new Date(),
        });

        // Create a retry LogEntry record
        await this.createLogEntry(context.executionLogId, {
          nodeId,
          nodeType: currentNode.type,
          level: 'Info',
          message: `Retrying node: attempt ${retryCount + 1} of ${maxRetries}`,
          data: { retryCount, maxRetries },
        });

        // Wait for backoff time if specified
        const backoffSeconds = currentNode.data?.backoffSeconds || 1;
        await new Promise(resolve => setTimeout(resolve, backoffSeconds * 1000));

        // Retry the node
        return this.executeNode(currentNode, allNodes, allEdges, context, retryCount + 1);
      }

      // Update node state to FAILED
      nodeState.state = NodeExecutionState.FAILED;
      nodeState.completedAt = new Date();
      nodeState.error = error instanceof Error ? error.message : 'Unknown error';

      // Persist the updated node state
      await this.persistNodeState(context.executionId, nodeId, nodeState);

      // Check if we should continue on failure
      if (currentNode.data?.continueOnFailure) {
        // Find the next nodes to execute
        const outgoingEdges = allEdges.filter(edge => edge.source === nodeId);

        // If there are no outgoing edges, we're done with this branch
        if (outgoingEdges.length === 0) {
          return { success: false, error: nodeState.error };
        }

        // For parallel execution, we need to execute all outgoing edges
        const nextNodePromises = outgoingEdges.map(async edge => {
          const nextNodeId = edge.target;
          const nextNode = allNodes.find(node => node.id === nextNodeId);

          if (!nextNode) {
            throw new Error(`Next node with ID ${nextNodeId} not found`);
          }

          // Execute the next node
          return this.executeNode(nextNode, allNodes, allEdges, context);
        });

        // Wait for all next nodes to complete
        await Promise.all(nextNodePromises);

        return { success: false, error: nodeState.error };
      }

      // Propagate the error
      throw error;
    }
  },

  /**
   * Persist the node state to the database
   */
  async persistNodeState(executionId: string, nodeId: string, nodeState: any) {
    try {
      await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
          nodeStates: {
            [nodeId]: nodeState,
          },
        },
      });
    } catch (error) {
      logger.error({
        processName: 'workflowExecutionService.persistNodeState',
        message: `Error persisting node state for node ${nodeId}`,
        metadata: { error, executionId, nodeId },
      });
    }
  },

  /**
   * Evaluate a condition expression
   */
  evaluateCondition(condition: string, context: Record<string, any>): boolean {
    try {
      // Create a safe evaluation context with only the variables
      const evalContext = { ...context.variables };

      // Use Function constructor to create a sandboxed evaluation
      // This is safer than eval() but still has security implications
      const evalFunction = new Function(
        ...Object.keys(evalContext),
        `return ${condition};`
      );

      return !!evalFunction(...Object.values(evalContext));
    } catch (error) {
      logger.error({
        processName: 'workflowExecutionService.evaluateCondition',
        message: `Error evaluating condition: ${condition}`,
        metadata: { error, condition, executionId: context.executionId },
      });

      return false;
    }
  },

  /**
   * Execute a log message node
   */
  async executeLogMessageNode(node: Node, context: Record<string, any>): Promise<any> {
    const { message, level = 'info' } = node.data;

    // Interpolate variables in the message
    const interpolatedMessage = this.interpolateVariables(message, context.variables);

    // Log the message
    await logger.info({
      processName: 'workflowExecution.logMessage',
      message: interpolatedMessage || 'Log message node executed',
      metadata: {
        nodeId: node.id,
        level,
        executionId: context.executionId,
        workflowId: context.workflowId
      },
    });

    // Add to execution context logs
    context.logs.push({
      nodeId: node.id,
      message: interpolatedMessage,
      level,
      timestamp: new Date(),
    });

    // Create a LogEntry record
    await this.createLogEntry(context.executionLogId, {
      nodeId: node.id,
      nodeType: 'LOG_MESSAGE',
      level: level === 'info' ? 'Info' : level === 'warn' ? 'Warn' : 'Error',
      message: interpolatedMessage,
      data: { originalMessage: message },
    });

    return { success: true, message: interpolatedMessage };
  },

  /**
   * Execute a condition node
   */
  async executeConditionNode(
    node: Node,
    allNodes: Node[],
    allEdges: Edge[],
    context: Record<string, any>
  ): Promise<any> {
    // Get the condition expression
    const conditionExpression = node.data.condition;

    if (!conditionExpression) {
      throw new Error('Condition node requires a condition expression');
    }

    // Evaluate the condition
    const conditionResult = this.evaluateCondition(conditionExpression, context);

    // Log the condition result
    await logger.info({
      processName: 'workflowExecution.condition',
      message: `Condition evaluated to: ${conditionResult}`,
      metadata: {
        nodeId: node.id,
        condition: conditionExpression,
        result: conditionResult,
        executionId: context.executionId,
        workflowId: context.workflowId
      },
    });

    // Add to execution context logs
    context.logs.push({
      nodeId: node.id,
      message: `Condition '${conditionExpression}' evaluated to: ${conditionResult}`,
      level: 'info',
      timestamp: new Date(),
    });

    // Find the appropriate edge based on the condition result
    const outgoingEdges = allEdges.filter(edge =>
      edge.source === node.id &&
      (edge.sourceHandle === (conditionResult ? 'true' : 'false') || !edge.sourceHandle)
    );

    // If there are no matching outgoing edges, we're done
    if (outgoingEdges.length === 0) {
      return { success: true, conditionResult };
    }

    // Execute all matching paths in parallel
    const nextNodePromises = outgoingEdges.map(async edge => {
      const nextNodeId = edge.target;
      const nextNode = allNodes.find(node => node.id === nextNodeId);

      if (!nextNode) {
        throw new Error(`Next node with ID ${nextNodeId} not found`);
      }

      // Execute the next node
      return this.executeNode(nextNode, allNodes, allEdges, context);
    });

    // Wait for all next nodes to complete
    await Promise.all(nextNodePromises);

    return { success: true, conditionResult };
  },

  /**
   * Execute an agent task node
   */
  async executeAgentTaskNode(node: Node, context: Record<string, any>): Promise<any> {
    const { agentId, taskPrompt, outputFormat = 'text', timeout = 60 } = node.data;

    if (!agentId) {
      throw new Error('Agent task node requires an agent ID');
    }

    if (!taskPrompt) {
      throw new Error('Agent task node requires a task prompt');
    }

    try {
      // Fetch the agent definition
      const agent = await agentService.getAgentById(agentId);

      if (!agent) {
        throw new Error(`Agent with ID ${agentId} not found`);
      }

      // Interpolate variables in the task prompt
      const interpolatedPrompt = this.interpolateVariables(taskPrompt, context.variables);

      // Log the agent task execution
      await logger.info({
        processName: 'workflowExecution.agentTask',
        message: `Executing agent task with ${agent.name}`,
        metadata: {
          nodeId: node.id,
          agentId,
          agentName: agent.name,
          provider: agent.provider,
          executionId: context.executionId,
          workflowId: context.workflowId
        },
      });

      // Add to execution context logs
      context.logs.push({
        nodeId: node.id,
        message: `Executing agent task with ${agent.name}`,
        level: 'info',
        timestamp: new Date(),
      });

      // Prepare the request payload based on the agent provider
      const payload = this.prepareAgentPayload(agent.provider, interpolatedPrompt, outputFormat, context);

      // Get the API endpoint from the agent config
      const apiEndpoint = agent.config.apiEndpoint;

      if (!apiEndpoint) {
        throw new Error(`Agent ${agent.name} does not have an API endpoint configured`);
      }

      // Create a controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout * 1000);

      try {
        // Make the API call to the agent service
        const response = await axios.post(apiEndpoint, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${agent.config.apiKey || ''}`,
          },
          signal: controller.signal,
        });

        // Clear the timeout
        clearTimeout(timeoutId);

        // Store the result in the context
        const result = response.data;

        // Store the result in the variables
        if (node.data.var) {
          context.variables[node.data.var] = result;
        } else {
          context.variables[`agent_${node.id}_result`] = result;
        }

        // Log the result
        await logger.info({
          processName: 'workflowExecution.agentTask',
          message: `Agent task completed successfully`,
          metadata: {
            nodeId: node.id,
            agentId,
            agentName: agent.name,
            responseStatus: response.status,
            executionId: context.executionId,
            workflowId: context.workflowId
          },
        });

        // Add to execution context logs
        context.logs.push({
          nodeId: node.id,
          message: `Agent task completed successfully`,
          level: 'info',
          timestamp: new Date(),
        });

        return { success: true, result };
      } catch (error) {
        // Clear the timeout
        clearTimeout(timeoutId);

        // Check if it was a timeout
        if (error.name === 'AbortError') {
          throw new Error(`Agent task timed out after ${timeout} seconds`);
        }

        throw error;
      }
    } catch (error) {
      // Log the error
      await logger.error({
        processName: 'workflowExecution.agentTask',
        message: `Error executing agent task: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metadata: {
          nodeId: node.id,
          agentId,
          error,
          executionId: context.executionId,
          workflowId: context.workflowId
        },
      });

      throw error;
    }
  },

  /**
   * Execute a task node
   */
  async executeTaskNode(node: Node, context: Record<string, any>): Promise<any> {
    const { taskName, priority = 'medium' } = node.data;

    // Log the task execution
    await logger.info({
      processName: 'workflowExecution.task',
      message: `Executing task: ${taskName || 'Unnamed task'}`,
      metadata: {
        nodeId: node.id,
        taskName,
        priority,
        executionId: context.executionId,
        workflowId: context.workflowId
      },
    });

    // Add to execution context logs
    context.logs.push({
      nodeId: node.id,
      message: `Executing task: ${taskName || 'Unnamed task'}`,
      level: 'info',
      timestamp: new Date(),
    });

    // In a real implementation, this would create or execute a task
    // For this simplified version, we'll just simulate a task execution
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store the result in the variables if a variable name is specified
    if (node.data.var) {
      context.variables[node.data.var] = {
        taskName,
        status: 'completed',
        timestamp: new Date(),
      };
    }

    return { success: true, taskName, status: 'completed' };
  },

  /**
   * Prepare the payload for the agent API call based on the provider
   */
  prepareAgentPayload(
    provider: string,
    prompt: string,
    outputFormat: string,
    context: Record<string, any>
  ): any {
    switch (provider) {
      case 'OpenAI_Assistant':
        return {
          messages: [{ role: 'user', content: prompt }],
          model: 'gpt-4',
          response_format: { type: outputFormat === 'json' ? 'json_object' : 'text' },
          workflow_execution_id: context.executionId,
          workflow_id: context.workflowId,
        };

      case 'SuperAGI':
        return {
          input: prompt,
          output_type: outputFormat,
          workflow_execution_id: context.executionId,
          workflow_id: context.workflowId,
          context_variables: context.variables,
        };

      case 'AutoGen':
        return {
          prompt,
          output_format: outputFormat,
          context_variables: context.variables,
          workflow_execution_id: context.executionId,
          workflow_id: context.workflowId,
        };

      case 'Custom':
      default:
        return {
          prompt,
          format: outputFormat,
          context: context.variables,
          workflow_execution_id: context.executionId,
          workflow_id: context.workflowId,
        };
    }
  },

  /**
   * Interpolate variables in a string
   */
  interpolateVariables(str: string, variables: Record<string, any>): string {
    if (!str) return str;

    return str.replace(/\${([^}]+)}/g, (match, key) => {
      const value = this.getNestedValue(variables, key);
      return value !== undefined ? String(value) : match;
    });
  },

  /**
   * Get a nested value from an object using dot notation
   */
  getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : undefined;
    }, obj);
  },

  /**
   * Get the execution status of a workflow
   */
  async getExecutionStatus(executionId: string) {
    try {
      const execution = await prisma.workflowExecution.findUnique({
        where: { id: executionId },
      });

      if (!execution) {
        return {
          success: false,
          error: `Execution with ID ${executionId} not found`,
        };
      }

      // Get the WorkflowExecutionLog and its LogEntries
      const executionLog = await prisma.workflowExecutionLog.findUnique({
        where: { executionId },
        include: {
          logEntries: {
            orderBy: {
              timestamp: 'asc',
            },
          },
        },
      });

      return {
        success: true,
        data: {
          ...execution,
          executionLog,
        },
      };
    } catch (error) {
      logger.error({
        processName: 'workflowExecutionService.getExecutionStatus',
        message: `Error getting execution status for ${executionId}`,
        metadata: { error, executionId },
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Create a log entry for a workflow execution
   */
  async createLogEntry(workflowExecutionLogId: string, logEntry: Omit<LogEntry, 'id' | 'timestamp' | 'workflowExecutionLogId'>) {
    try {
      await prisma.logEntry.create({
        data: {
          ...logEntry,
          workflowExecutionLogId,
        },
      });
    } catch (error) {
      logger.error({
        processName: 'workflowExecutionService.createLogEntry',
        message: `Error creating log entry`,
        metadata: { error, workflowExecutionLogId, logEntry },
      });
    }
  },

  /**
   * Cancel a workflow execution
   */
  async cancelExecution(executionId: string) {
    try {
      const execution = await prisma.workflowExecution.findUnique({
        where: { id: executionId },
      });

      if (!execution) {
        return {
          success: false,
          error: `Execution with ID ${executionId} not found`,
        };
      }

      if (execution.state === ExecutionState.COMPLETED ||
          execution.state === ExecutionState.FAILED ||
          execution.state === ExecutionState.CANCELED) {
        return {
          success: false,
          error: `Execution is already in state ${execution.state}`,
        };
      }

      await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
          state: ExecutionState.CANCELED,
          completedAt: new Date(),
        },
      });

      // Update the WorkflowExecutionLog status to Failed for canceled executions
      try {
        const executionLog = await prisma.workflowExecutionLog.findUnique({
          where: { executionId },
        });

        if (executionLog) {
          await this.updateExecutionLogStatus(executionLog.id, 'Failed');

          // Create a cancellation log entry
          await this.createLogEntry(executionLog.id, {
            nodeId: 'system',
            nodeType: 'system',
            level: 'Warn',
            message: `Workflow execution was canceled`,
            data: { reason: 'User canceled the execution' },
          });
        }
      } catch (logError) {
        logger.error({
          processName: 'workflowExecutionService.cancelExecution',
          message: `Error updating WorkflowExecutionLog status for canceled execution`,
          metadata: { logError, executionId },
        });
      }

      return {
        success: true,
        message: `Execution ${executionId} canceled`,
      };
    } catch (error) {
      logger.error({
        processName: 'workflowExecutionService.cancelExecution',
        message: `Error canceling execution ${executionId}`,
        metadata: { error, executionId },
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
};

export default workflowExecutionService;
