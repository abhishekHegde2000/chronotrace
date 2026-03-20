import { downloadLogs } from './downloadLogs';

let isRegistered = false;
const keysPressed = new Set<string>();

export function initKeyboardShortcut(): void {
  if (isRegistered || typeof window === 'undefined') return;
  isRegistered = true;

  window.addEventListener('keydown', (e) => {
    keysPressed.add(e.key.toLowerCase());

    const isModifier = e.ctrlKey || e.metaKey;
    if (isModifier && keysPressed.has('l') && keysPressed.has('p')) {
      e.preventDefault();
      downloadLogs();
    }
  });

  window.addEventListener('keyup', (e) => {
    keysPressed.delete(e.key.toLowerCase());
  });

  window.addEventListener('blur', () => {
    keysPressed.clear();
  });
}
