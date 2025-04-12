type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  message: string;
  level: LogLevel;
  error?: unknown;
  context?: Record<string, unknown>;
  timestamp: string;
}

const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
  private static formatError(error: unknown): string {
    if (error instanceof Error) {
      return `${error.name}: ${error.message}\n${error.stack || ''}`;
    }
    return String(error);
  }

  private static log(level: LogLevel, message: string, error?: unknown, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      error: error ? this.formatError(error) : undefined,
      context
    };

    if (isDevelopment) {
      const logMessage = `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`;
      if (entry.error) {
        // eslint-disable-next-line no-console
        console.error(logMessage, entry.error);
      } else {
        // eslint-disable-next-line no-console
        console.log(logMessage);
      }
      if (entry.context) {
        // eslint-disable-next-line no-console
        console.log('Context:', entry.context);
      }
    } else {
      // In production, send logs to a logging service
      // TODO: Implement logging service integration
    }
  }

  static logWithLevel(level: LogLevel, message: string, error?: unknown, context?: Record<string, unknown>): void {
    this.log(level, message, error, context);
  }

  static error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    this.log('error', message, error, context);
  }

  static warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, undefined, context);
  }

  static info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, undefined, context);
  }

  static debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, undefined, context);
  }
}

export default Logger;