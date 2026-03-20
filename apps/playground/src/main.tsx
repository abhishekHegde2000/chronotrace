import { initChronoTrace, downloadLogs } from '@chronotrace/client';

// Initialize console log interception and register keyboard shortcuts
initChronoTrace();

console.log('ChronoTrace Playground initialized.');
console.group('Initialization');
console.log('Testing a log inside a group.');
console.log('This is line 2 inside the group.');
console.groupCollapsed('Nested Configs');
console.log('featureA: enabled');
console.groupEnd();
console.groupEnd();
console.log('Done testing logs.');

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.display = 'flex';
    container.style.gap = '16px';
    container.style.fontFamily = 'monospace';

    // Default download button
    const defaultBtn = document.createElement('button');
    defaultBtn.textContent = 'Download Logs (Default)';
    defaultBtn.onclick = () => downloadLogs();
    container.appendChild(defaultBtn);

    // Filtered download button
    const filteredBtn = document.createElement('button');
    filteredBtn.textContent = 'Download Logs (only: log)';
    filteredBtn.onclick = () => downloadLogs({ only: ['log'] });
    container.appendChild(filteredBtn);

    const helperText = document.createElement('p');
    helperText.textContent =
      'Check the console for traces. Press Ctrl/Cmd + L + P to trigger download via shortcut.';

    document.body.appendChild(container);
    document.body.appendChild(helperText);
  });
}
