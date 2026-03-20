import { generateTextExport } from '@chronotrace/exporter-text';
import { logStore } from './interceptConsole';
import type { DownloadOptions } from './types';

export function downloadLogs(options: DownloadOptions = {}): void {
  const logs = logStore.getLogs();

  // Delegate filtering/formatting to the exporter package
  const textPayload = generateTextExport(logs, options);

  // Return a browser-download side effect
  if (
    typeof Blob !== 'undefined' &&
    typeof URL !== 'undefined' &&
    typeof document !== 'undefined'
  ) {
    const blob = new Blob([textPayload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chronotrace-logs-${new Date().toISOString()}.txt`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }
}
