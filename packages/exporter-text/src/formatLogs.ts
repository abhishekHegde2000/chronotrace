import type { LogEntry } from '@chronotrace/core';

function formatTimestamp(ts: number): string {
  return new Date(ts).toISOString();
}

function stringifyPayload(payload: unknown[]): string {
  return payload
    .map((p) => {
      if (typeof p === 'object' && p !== null) {
        try {
          return JSON.stringify(p);
        } catch {
          return String(p);
        }
      }
      return String(p);
    })
    .join(' ');
}

export function formatLogs(logs: LogEntry[]): string {
  if (logs.length === 0) return '';

  const lines: string[] = [];
  let indentLevel = 0;
  let lastFile: string | undefined = undefined;

  for (const log of logs) {
    const ts = `[${formatTimestamp(log.timestamp)}]`;

    // Check file boundary
    if (log.metadata?.file && log.metadata.file !== lastFile) {
      lines.push(''); // Spacing for file boundary
      lines.push(`--- File: ${log.metadata.file} ---`);
      lastFile = log.metadata.file;
    }

    const indent = '  '.repeat(indentLevel);
    const payloadStr = stringifyPayload(log.payload);

    if (log.method === 'group' || log.method === 'groupCollapsed') {
      lines.push(''); // Spacing before group
      lines.push(`${indent}${ts} GROUP: ${payloadStr}`);
      indentLevel++;
    } else if (log.method === 'groupEnd') {
      indentLevel = Math.max(0, indentLevel - 1);
      lines.push(`${indent}${ts} GROUP END`);
      lines.push(''); // Spacing after group
    } else {
      let metaStr = '';
      if (log.metadata?.line) {
        metaStr = ` (line ${log.metadata.line})`;
      }

      lines.push(`${indent}${ts} [${log.method.toUpperCase()}] ${payloadStr}${metaStr}`);
    }
  }

  // Normalize excessive empty lines (3 or more -> 2)
  const normalizedText = lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return normalizedText + '\n';
}
