import type { LogEntry, LogMethod } from '@chronotrace/core';
import type { ExporterOptions } from './index';

export function resolveFilter(
  defaultMethods: LogMethod[],
  options?: ExporterOptions,
): Set<LogMethod> {
  if (options?.only && options.only.length > 0) {
    return new Set(options.only);
  }

  const finalSet = new Set(defaultMethods);
  if (options?.extend) {
    for (const m of options.extend) {
      finalSet.add(m);
    }
  }
  return finalSet;
}

export function filterLogs(
  logs: LogEntry[],
  defaultMethods: LogMethod[],
  options?: ExporterOptions,
): LogEntry[] {
  const allowedMethods = resolveFilter(defaultMethods, options);
  return logs.filter((log) => allowedMethods.has(log.method));
}
