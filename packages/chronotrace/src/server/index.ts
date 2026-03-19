import { LogEntry } from '../shared/types';
import { sanitizeArgs, formatMessage } from '../shared/utils';

const globalKey = '__CHRONOTRACE_SERVER_LOGS__';
(globalThis as any)[globalKey] ||= [];

let currentServerDepth = 0;
const MAX_LOGS = 2000;
let isInitialized = false;

export function initServerLogger(): void {
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
        currentServerDepth = Math.max(0, currentServerDepth - 1);
      }

      const sanitized = sanitizeArgs(args);
      const message = formatMessage(sanitized);

      const logEntry: LogEntry = {
        timestamp: Date.now(),
        level,
        environment: 'SERVER',
        depth: currentServerDepth,
        message,
      };

      const logs = (globalThis as any)[globalKey];
      logs.push(logEntry);
      
      if (logs.length > MAX_LOGS) {
        logs.shift();
      }

      if (level === 'group' || level === 'groupCollapsed') {
        currentServerDepth++;
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

export function nextApiLogHandler(): Response {
  return Response.json({
    logs: (globalThis as any)[globalKey]
  });
}
