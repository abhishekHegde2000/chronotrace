import type { LogMethod } from '@chronotrace/core';

export interface ExporterOptions {
  only?: LogMethod[];
  extend?: LogMethod[];
}

export function generateTextExport(): string {
  // Stub for now. Filtering and formatting logic will be implemented in exporter-text properly.
  return 'Export not implemented yet';
}
