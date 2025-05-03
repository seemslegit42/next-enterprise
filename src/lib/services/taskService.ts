import prisma from "../prisma";
import logger from "../logger";
import { Task } from "../../interfaces";

/**
 * Service for managing tasks
 */
export const taskService = {
  /**
   * Get all tasks with optional filtering
   */
  async getTasks(filters: { status?: string; assignedTo?: string } = {}) {
    try {
      const { status, assignedTo } = filters;
      
      const where: any = {};
      if (status) {
        where.status = status;
      }
      if (assignedTo) {
        where.assignedTo = assignedTo;
      }
      
      return await prisma.task.findMany({
        where,
        orderBy: { updatedAt: "desc" },
      });
    } catch (error) {
      logger.error({
        processName: "taskService.getTasks",
        message: "Failed to fetch tasks",
        metadata: { error, filters },
      });
      throw error;
    }
  },
  
  /**
   * Get a task by ID
   */
  async getTaskById(id: string) {
    try {
      return await prisma.task.findUnique({
        where: { id },
      });
    } catch (error) {
      logger.error({
        processName: "taskService.getTaskById",
        message: "Failed to fetch task",
        metadata: { error, id },
      });
      throw error;
    }
  },
  
  /**
   * Create a new task
   */
  async createTask(data: Omit<Task, "id" | "createdAt" | "updatedAt">) {
    try {
      const task = await prisma.task.create({
        data,
      });
      
      logger.info({
        processName: "taskService.createTask",
        message: "Task created successfully",
        metadata: { taskId: task.id },
      });
      
      return task;
    } catch (error) {
      logger.error({
        processName: "taskService.createTask",
        message: "Failed to create task",
        metadata: { error, data },
      });
      throw error;
    }
  },
  
  /**
   * Update an existing task
   */
  async updateTask(id: string, data: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>) {
    try {
      const task = await prisma.task.update({
        where: { id },
        data,
      });
      
      logger.info({
        processName: "taskService.updateTask",
        message: "Task updated successfully",
        metadata: { taskId: id, updates: data },
      });
      
      return task;
    } catch (error) {
      logger.error({
        processName: "taskService.updateTask",
        message: "Failed to update task",
        metadata: { error, id, data },
      });
      throw error;
    }
  },
  
  /**
   * Delete a task
   */
  async deleteTask(id: string) {
    try {
      await prisma.task.delete({
        where: { id },
      });
      
      logger.info({
        processName: "taskService.deleteTask",
        message: "Task deleted successfully",
        metadata: { taskId: id },
      });
      
      return true;
    } catch (error) {
      logger.error({
        processName: "taskService.deleteTask",
        message: "Failed to delete task",
        metadata: { error, id },
      });
      throw error;
    }
  },
};

export default taskService;
