import { createLogStore } from '../store';
import type { LogEntry } from '../types';

describe('LogStore', () => {
  it('should initialize empty', () => {
    const store = createLogStore();
    expect(store.getLogs()).toEqual([]);
  });

  it('should append logs in order', () => {
    const store = createLogStore();
    const entry1: LogEntry = { timestamp: 1, level: 'info', message: 'test 1' };
    const entry2: LogEntry = { timestamp: 2, level: 'error', message: 'test 2' };

    store.appendLog(entry1);
    store.appendLog(entry2);

    expect(store.getLogs()).toEqual([entry1, entry2]);
  });

  it('should clear logs', () => {
    const store = createLogStore();
    const entry: LogEntry = { timestamp: 1, level: 'info', message: 'test' };

    store.appendLog(entry);
    expect(store.getLogs()).toHaveLength(1);

    store.clearLogs();
    expect(store.getLogs()).toHaveLength(0);
  });
});
