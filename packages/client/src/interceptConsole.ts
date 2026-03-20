import { createLogStore, type LogMethod, type SourceMetadata } from '@chronotrace/core';

// Global singleton core store for the browser session
export const logStore = createLogStore();

let isIntercepted = false;
const SUPPORTED_METHODS: LogMethod[] = ['log', 'group', 'groupCollapsed', 'groupEnd'];

function getSourceMetadata(): SourceMetadata | undefined {
  const err = new Error();
  if (!err.stack) return undefined;

  const lines = err.stack.split('\n');

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    // Exclude our own capturing logic frames
    if (line.includes('interceptConsole') || line.includes('logStore')) {
      continue;
    }

    const match = line.match(/(?:http|https|file):\/\/[^\s)]+|[\w.-]+:\d+:\d+/);
    // Standardized regex without useless escapes inside character class
    if (match) {
      const parts = match[0].split(':');
      if (parts.length >= 3) {
        const col = parseInt(parts.pop() || '', 10);
        const lineNum = parseInt(parts.pop() || '', 10);
        const file = parts.join(':');

        const filename = file.split('/').pop() || file;

        return {
          file: filename,
          line: Number.isNaN(lineNum) ? undefined : lineNum,
          column: Number.isNaN(col) ? undefined : col,
        };
      }
    }
  }
  return undefined;
}

export function initConsoleInterception(): void {
  if (isIntercepted) return;
  isIntercepted = true;

  SUPPORTED_METHODS.forEach((method) => {
    const original = console[method as keyof Console];
    if (typeof original === 'function') {
      const interceptor = (...args: unknown[]) => {
        logStore.appendLog({
          timestamp: Date.now(),
          method,
          payload: args,
          metadata: getSourceMetadata(),
        });
        Reflect.apply(original, console, args);
      };
      console[method as keyof Console] = interceptor;
    }
  });
}
