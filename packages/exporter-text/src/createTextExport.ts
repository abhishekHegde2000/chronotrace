import type { LogEntry, LogMethod } from '@chronotrace/core';
import type { ExporterOptions } from './index';
import { filterLogs } from './filterLogs';
import { formatLogs } from './formatLogs';

const DEFAULT_METHODS: LogMethod[] = ['log', 'group', 'groupCollapsed', 'groupEnd'];

export function generateTextExport(logs: LogEntry[], options?: ExporterOptions): string {
  const filtered = filterLogs(logs, DEFAULT_METHODS, options);
  return formatLogs(filtered);
}
