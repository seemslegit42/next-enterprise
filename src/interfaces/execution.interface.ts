/**
 * Represents a workflow execution log in the system
 */
export interface WorkflowExecutionLog {
  /**
   * Unique identifier for the workflow execution log
   */
  id: string;

  /**
   * ID of the workflow definition that was executed
   */
  workflowDefinitionId: string;

  /**
   * Unique execution ID for this workflow run
   */
  executionId: string;

  /**
   * Timestamp when the workflow execution started
   */
  startTime: Date;

  /**
   * Timestamp when the workflow execution ended (if completed)
   */
  endTime?: Date;

  /**
   * Current status of the workflow execution
   */
  status: 'Running' | 'Completed' | 'Failed';

  /**
   * Collection of log entries generated during workflow execution
   */
  logEntries: LogEntry[];
}

/**
 * Represents a single log entry within a workflow execution
 */
export interface LogEntry {
  /**
   * Timestamp when the log entry was created
   */
  timestamp: Date;

  /**
   * ID of the node that generated this log entry
   */
  nodeId: string;

  /**
   * Type of the node that generated this log entry
   */
  nodeType: string;

  /**
   * Severity level of the log entry
   */
  level: 'Info' | 'Warn' | 'Error';

  /**
   * Log message content
   */
  message: string;

  /**
   * Optional additional data associated with this log entry
   */
  data?: Record<string, any>;
}
