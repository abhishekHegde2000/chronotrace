export type LogMethod =
  | 'log'
  | 'info'
  | 'warn'
  | 'error'
  | 'debug'
  | 'group'
  | 'groupCollapsed'
  | 'groupEnd';

export interface SourceMetadata {
  file?: string;
  line?: number;
  column?: number;
}

export interface LogEntry {
  timestamp: number;
  method: LogMethod;
  payload: unknown[];
  metadata?: SourceMetadata;
  order: number;
}

export type LogEntryInput = Omit<LogEntry, 'order'>;
