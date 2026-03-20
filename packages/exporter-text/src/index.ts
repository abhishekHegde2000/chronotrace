import type { LogMethod } from '@chronotrace/core';

export interface ExporterOptions {
  only?: LogMethod[];
  extend?: LogMethod[];
}

export { filterLogs, resolveFilter } from './filterLogs';
export { formatLogs } from './formatLogs';
export { generateTextExport } from './createTextExport';
