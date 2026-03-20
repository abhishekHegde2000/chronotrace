import type { LogEntry } from './types';

export interface LogStore {
  appendLog(entry: LogEntry): void;
  getLogs(): LogEntry[];
  clearLogs(): void;
}

export function createLogStore(): LogStore {
  let logs: LogEntry[] = [];

  return {
    appendLog(entry: LogEntry): void {
      logs.push(entry);
    },
    getLogs(): LogEntry[] {
      return [...logs];
    },
    clearLogs(): void {
      logs = [];
    },
  };
}
