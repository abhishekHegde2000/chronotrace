import type { LogMethod } from '@chronotrace/core';

export interface DownloadOptions {
  only?: LogMethod[];
  extend?: LogMethod[];
}
