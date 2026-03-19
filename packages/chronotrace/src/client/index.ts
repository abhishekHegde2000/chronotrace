import { LogEntry, DownloadOptions, LogLevel } from '../shared/types';
import { sanitizeArgs, formatMessage } from '../shared/utils';

let clientLogs: LogEntry[] = [];
let currentDepth = 0;
const MAX_LOGS = 2000;
let isInitialized = false;

export function initClientLogger(): void {
  if (isInitialized) return;
  isInitialized = true;

  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    group: console.group,
    groupCollapsed: console.groupCollapsed,
    groupEnd: console.groupEnd,
  };

  const overrideMethod = (level: keyof typeof originalConsole) => {
    console[level] = (...args: any[]) => {
      if (level === 'groupEnd') {
        currentDepth = Math.max(0, currentDepth - 1);
      }

      const sanitized = sanitizeArgs(args);
      const message = formatMessage(sanitized);

      clientLogs.push({
        timestamp: Date.now(),
        level,
        environment: 'CLIENT',
        depth: currentDepth,
        message
      });

      if (clientLogs.length > MAX_LOGS) {
        clientLogs.shift();
      }

      if (level === 'group' || level === 'groupCollapsed') {
        currentDepth++;
      }

      originalConsole[level](...args);
    };
  };

  overrideMethod('log');
  overrideMethod('warn');
  overrideMethod('error');
  overrideMethod('group');
  overrideMethod('groupCollapsed');
  overrideMethod('groupEnd');
}

declare global {
  interface Window {
    downloadLogs: (options?: DownloadOptions) => Promise<void>;
  }
}

if (typeof window !== 'undefined') {
  window.downloadLogs = async (options?: DownloadOptions): Promise<void> => {
    const opts = {
      source: 'client',
      levels: ['log', 'warn', 'error', 'group'] as LogLevel[],
      ...options
    };

    let serverLogs: LogEntry[] = [];
    if (opts.source === 'server' || opts.source === 'all') {
      try {
        const response = await fetch('/api/download-logs');
        if (response.ok) {
          const data = await response.json();
          serverLogs = data.logs || [];
        }
      } catch (error) {
        console.error('Failed to fetch server logs', error);
      }
    }

    let logs = [...clientLogs, ...serverLogs];
    
    logs = logs.filter(log => opts.levels.includes(log.level));
    logs.sort((a, b) => a.timestamp - b.timestamp);

    const formattedOutput: string[] = [];
    let isFirstGroup = true;

    logs.forEach(log => {
      if (log.level === 'group' || log.level === 'groupCollapsed') {
        if (!isFirstGroup) {
          formattedOutput.push(''); // Add newline BEFORE every group (except first)
        }
        isFirstGroup = false;
      }
      
      const indent = '    '.repeat(log.depth);
      const timeStr = new Date(log.timestamp).toLocaleTimeString();
      formattedOutput.push(`${indent}[${log.environment}] [${timeStr}] ${log.message}`);
    });

    const blob = new Blob([formattedOutput.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chronotrace-logs.txt';
    a.click();
    URL.revokeObjectURL(url);
  };
}
