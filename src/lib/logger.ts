type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error | unknown;
}

class TelemetryLogger {
  private static instance: TelemetryLogger;
  private isDevelopment = import.meta.env.DEV;

  private constructor() {}

  public static getInstance(): TelemetryLogger {
    if (!TelemetryLogger.instance) {
      TelemetryLogger.instance = new TelemetryLogger();
    }
    return TelemetryLogger.instance;
  }

  private formatLog(entry: LogEntry): string {
    return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`;
  }

  private capture(level: LogLevel, message: string, context?: Record<string, unknown>, error?: unknown) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error
    };

    if (this.isDevelopment) {
      const output = this.formatLog(entry);
      switch (level) {
        case 'info': console.info(output, context || ''); break;
        case 'warn': console.warn(output, context || ''); break;
        case 'error': console.error(output, error, context || ''); break;
        case 'debug': console.debug(output, context || ''); break;
      }
    } else {
      // In production, we might want to send this to a service like Sentry, LogRocket, or a custom backend.
      // For now, we only log errors to console in production to prevent leaking sensitive info
      if (level === 'error') {
        console.error(this.formatLog(entry), error);
      }
    }
  }

  public info(message: string, context?: Record<string, unknown>) {
    this.capture('info', message, context);
  }

  public warn(message: string, context?: Record<string, unknown>) {
    this.capture('warn', message, context);
  }

  public error(message: string, error?: unknown, context?: Record<string, unknown>) {
    this.capture('error', message, context, error);
  }

  public debug(message: string, context?: Record<string, unknown>) {
    this.capture('debug', message, context);
  }
}

export const logger = TelemetryLogger.getInstance();
