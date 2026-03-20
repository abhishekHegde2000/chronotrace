import { downloadLogs } from './downloadLogs';
import { initConsoleInterception } from './interceptConsole';
import { initKeyboardShortcut } from './keyboardShortcut';

export * from './types';
export { downloadLogs, initConsoleInterception, initKeyboardShortcut };

export function initChronoTrace(): void {
  initConsoleInterception();
  initKeyboardShortcut();
}
