import * as Sentry from '@sentry/nextjs';

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
      return `${error.name}: ${error.message}\n${error.stack ?? ''}`;
    }
    return String(error);
  }

  private static mapLogLevelToSentrySeverity(level: LogLevel): Sentry.SeverityLevel {
    switch (level) {
    case 'error':
      return 'error';
    case 'warn':
      return 'warning';
    case 'info':
      return 'info';
    case 'debug':
      return 'debug';
    default:
      return 'info';
    }
  }

  private static log(
    level: LogLevel,
    message: string,
    error?: unknown,
    context?: Record<string, unknown>
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      error: error ? this.formatError(error) : undefined,
      context,
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
    } else if (level === 'error') {
      Sentry.captureException(error ?? new Error(message), {
        level: 'error',
        extra: {
          ...context,
          timestamp: entry.timestamp,
        },
      });
    } else {
      Sentry.captureMessage(message, {
        level: this.mapLogLevelToSentrySeverity(level),
        extra: {
          ...context,
          timestamp: entry.timestamp,
        },
      });
    }
  }

  static logWithLevel(
    level: LogLevel,
    message: string,
    error?: unknown,
    context?: Record<string, unknown>
  ): void {
    this.log(level, message, error, context);
  }

  static error(
    message: string,
    error?: unknown,
    context?: Record<string, unknown>
  ): void {
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
