export function sanitizeArgs(args: any[]): any[] {
  if (args.length === 0 || typeof args[0] !== 'string') {
    return args;
  }

  const firstArg = args[0];
  const cMatches = firstArg.match(/%c/g);
  
  if (!cMatches) {
    return args;
  }

  const cCount = cMatches.length;
  const newFirstArg = firstArg.replace(/%c/g, '');
  
  // The first arg is at index 0, styles start at index 1 and go up to cCount.
  // So the first non-style argument is at index 1 + cCount.
  const remainingArgs = args.slice(1 + cCount);

  return [newFirstArg, ...remainingArgs];
}

function safeStringify(obj: any): string {
  const cache = new Set();
  try {
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          return '[Circular]';
        }
        cache.add(value);
      }
      return value;
    });
  } catch (error) {
    return '[Unserializable Object]';
  }
}

export function formatMessage(args: any[]): string {
  if (args.length === 0) return '';
  
  return args
    .map((arg) => {
      if (typeof arg === 'string') {
        return arg;
      }
      if (arg === undefined) {
        return 'undefined';
      }
      if (typeof arg === 'object' && arg !== null) {
        return safeStringify(arg);
      }
      return String(arg);
    })
    .join(' ');
}
