import { createLogStore, type LogMethod } from '@chronotrace/core';

// Global singleton core store for the browser session
export const logStore = createLogStore();

let isIntercepted = false;
const SUPPORTED_METHODS: LogMethod[] = ['log', 'group', 'groupCollapsed', 'groupEnd'];

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
        });
        Reflect.apply(original, console, args);
      };
      console[method as keyof Console] = interceptor;
    }
  });
}
