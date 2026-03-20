import type { LogEntry, LogEntryInput } from './types';

export interface LogStore {
  appendLog(entry: LogEntryInput): void;
  getLogs(): LogEntry[];
  clearLogs(): void;
}

export function createLogStore(): LogStore {
  let logs: LogEntry[] = [];
  let sequence = 0;

  return {
    appendLog(entry: LogEntryInput): void {
      logs.push({
        ...entry,
        order: sequence++,
      });
    },
    getLogs(): LogEntry[] {
      return [...logs];
    },
    clearLogs(): void {
      logs = [];
      sequence = 0;
    },
  };
}
