type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
}

export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  
  private constructor() {}
  
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  
  public log(level: LogLevel, message: string, context?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context
    };
    
    this.logs.push(entry);
    
    // Print to console
    console[level](
      `[${entry.timestamp}] ${level.toUpperCase()}: ${message}`,
      context ? context : ''
    );
    
    // Keep logs manageable
    if (this.logs.length > 100) {
      this.logs.shift();
    }
  }
  
  public getRecentLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  public debug(message: string, context?: any): void {
    this.log('debug', message, context);
  }
  
  public info(message: string, context?: any): void {
    this.log('info', message, context);
  }
  
  public warn(message: string, context?: any): void {
    this.log('warn', message, context);
  }
  
  public error(message: string, context?: any): void {
    this.log('error', message, context);
  }
}

export const logger = Logger.getInstance(); 