import prisma from "../prisma";
import logger from "../logger";
import { WorkflowExecutionLog, LogEntry } from "@/interfaces/execution.interface";

/**
 * Service for managing workflow execution logs
 */
export const workflowLogService = {
  /**
   * Get all workflow execution logs with optional filtering
   */
  async getLogs(filters: {
    workflowId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}) {
    try {
      const { workflowId, status, startDate, endDate } = filters;
      
      const where: any = {};
      
      if (workflowId) {
        where.workflowDefinitionId = workflowId;
      }
      
      if (status) {
        where.status = status;
      }
      
      if (startDate) {
        where.startTime = {
          gte: startDate,
        };
      }
      
      if (endDate) {
        where.endTime = {
          lte: endDate,
        };
      }
      
      return await prisma.workflowExecutionLog.findMany({
        where,
        include: {
          logEntries: {
            orderBy: {
              timestamp: "asc",
            },
          },
          workflow: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          startTime: "desc",
        },
      });
    } catch (error) {
      logger.error({
        processName: "workflowLogService.getLogs",
        message: "Failed to fetch workflow execution logs",
        metadata: { error, filters },
      });
      throw error;
    }
  },
  
  /**
   * Get a specific workflow execution log by ID
   */
  async getLogById(id: string) {
    try {
      const log = await prisma.workflowExecutionLog.findUnique({
        where: { id },
        include: {
          logEntries: {
            orderBy: {
              timestamp: "asc",
            },
          },
          workflow: {
            select: {
              name: true,
              definitionJson: true,
            },
          },
        },
      });
      
      if (!log) {
        return null;
      }
      
      // Get the workflow execution
      const execution = await prisma.workflowExecution.findUnique({
        where: { id: log.executionId },
      });
      
      return {
        ...log,
        execution,
      };
    } catch (error) {
      logger.error({
        processName: "workflowLogService.getLogById",
        message: "Failed to fetch workflow execution log",
        metadata: { error, id },
      });
      throw error;
    }
  },
  
  /**
   * Get log entries for a specific workflow execution
   */
  async getLogEntriesByExecutionId(executionId: string) {
    try {
      const log = await prisma.workflowExecutionLog.findUnique({
        where: { executionId },
        include: {
          logEntries: {
            orderBy: {
              timestamp: "asc",
            },
          },
        },
      });
      
      return log?.logEntries || [];
    } catch (error) {
      logger.error({
        processName: "workflowLogService.getLogEntriesByExecutionId",
        message: "Failed to fetch log entries",
        metadata: { error, executionId },
      });
      throw error;
    }
  },
  
  /**
   * Get summary statistics for workflow executions
   */
  async getLogStats() {
    try {
      const [
        totalCount,
        runningCount,
        completedCount,
        failedCount,
        recentLogs
      ] = await Promise.all([
        prisma.workflowExecutionLog.count(),
        prisma.workflowExecutionLog.count({
          where: { status: "Running" },
        }),
        prisma.workflowExecutionLog.count({
          where: { status: "Completed" },
        }),
        prisma.workflowExecutionLog.count({
          where: { status: "Failed" },
        }),
        prisma.workflowExecutionLog.findMany({
          take: 5,
          orderBy: {
            startTime: "desc",
          },
          include: {
            workflow: {
              select: {
                name: true,
              },
            },
          },
        }),
      ]);
      
      return {
        totalCount,
        runningCount,
        completedCount,
        failedCount,
        recentLogs,
      };
    } catch (error) {
      logger.error({
        processName: "workflowLogService.getLogStats",
        message: "Failed to fetch log statistics",
        metadata: { error },
      });
      throw error;
    }
  },
};

export default workflowLogService;
