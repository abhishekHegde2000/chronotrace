export type LogLevel =
  | 'log'
  | 'warn'
  | 'error'
  | 'group'
  | 'groupCollapsed'
  | 'groupEnd';

export type LogSource = 'client' | 'server' | 'all';

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  environment: 'CLIENT' | 'SERVER';
  depth: number;
  message: string;
}

export interface DownloadOptions {
  levels?: LogLevel[];
  source?: LogSource;
}
