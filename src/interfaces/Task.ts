/**
 * Represents a task in the system
 */
export interface Task {
  /**
   * Unique identifier for the task
   */
  id: string;
  
  /**
   * Short title describing the task
   */
  title: string;
  
  /**
   * Detailed description of the task
   */
  description: string;
  
  /**
   * Current status of the task
   */
  status: 'pending' | 'running' | 'completed' | 'failed';
  
  /**
   * User ID of the person assigned to the task
   */
  assignedTo: string;
  
  /**
   * Timestamp when the task was created
   */
  createdAt: Date;
  
  /**
   * Timestamp when the task was last updated
   */
  updatedAt: Date;
}

/**
 * Type for creating a new task (without system-generated fields)
 */
export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Type for updating an existing task
 */
export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;
