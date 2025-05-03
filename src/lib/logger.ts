import prisma from "./prisma";

type LogLevel = "info" | "warn" | "error";

interface LogOptions {
  processName: string;
  message: string;
  metadata?: Record<string, any>;
}

/**
 * Logs a message to the database
 */
export async function log(level: LogLevel, options: LogOptions) {
  const { processName, message, metadata = {} } = options;
  
  try {
    return await prisma.processLog.create({
      data: {
        processName,
        level,
        message,
        metadata,
      },
    });
  } catch (error) {
    console.error("Failed to write log to database:", error);
    // Fallback to console logging
    console[level](`[${processName}] ${message}`, metadata);
    return null;
  }
}

/**
 * Logger utility with methods for different log levels
 */
export const logger = {
  info: (options: LogOptions) => log("info", options),
  warn: (options: LogOptions) => log("warn", options),
  error: (options: LogOptions) => log("error", options),
};

export default logger;
