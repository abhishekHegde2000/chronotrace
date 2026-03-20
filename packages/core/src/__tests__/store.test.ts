import { createLogStore } from '../store';
import type { LogEntryInput } from '../types';

describe('LogStore', () => {
  it('should initialize empty', () => {
    const store = createLogStore();
    expect(store.getLogs()).toEqual([]);
  });

  it('should append logs in order and attach monotonic sequence', () => {
    const store = createLogStore();
    const entry1: LogEntryInput = { timestamp: 100, method: 'log', payload: ['test 1'] };
    const entry2: LogEntryInput = { timestamp: 101, method: 'error', payload: ['test 2'] };

    store.appendLog(entry1);
    store.appendLog(entry2);

    const logs = store.getLogs();
    expect(logs).toHaveLength(2);
    expect(logs[0]).toEqual({ ...entry1, order: 0 });
    expect(logs[1]).toEqual({ ...entry2, order: 1 });
  });

  it('should clear logs and reset sequence', () => {
    const store = createLogStore();
    const entry: LogEntryInput = { timestamp: 100, method: 'info', payload: ['test'] };

    store.appendLog(entry);
    expect(store.getLogs()).toHaveLength(1);

    store.clearLogs();
    expect(store.getLogs()).toHaveLength(0);

    store.appendLog(entry);
    const logs = store.getLogs();
    expect(logs[0].order).toBe(0); // Sequence should reset
  });
});
