/**
 * Represents a process log entry in the system
 */
export interface ProcessLog {
  /**
   * Unique identifier for the log entry
   */
  id: string;
  
  /**
   * Name of the process that generated the log
   */
  processName: string;
  
  /**
   * Timestamp when the log was created
   */
  timestamp: Date;
  
  /**
   * Log level indicating severity
   */
  level: 'info' | 'warn' | 'error';
  
  /**
   * Log message content
   */
  message: string;
  
  /**
   * Additional structured data related to the log entry
   */
  metadata: Record<string, any>;
}

/**
 * Type for creating a new process log (without system-generated fields)
 */
export type CreateProcessLogInput = Omit<ProcessLog, 'id'>;

/**
 * Type for querying process logs with filters
 */
export interface ProcessLogFilters {
  processName?: string;
  level?: ProcessLog['level'];
  startDate?: Date;
  endDate?: Date;
}
