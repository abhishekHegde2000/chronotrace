# Architecture Plan: chronotrace (Monorepo Package)

> STRICT IMPLEMENTATION SPEC — DO NOT DEVIATE

---

## 0. Execution Rules (CRITICAL)

* Do NOT change folder structure
* Do NOT rename files
* Do NOT introduce additional dependencies unless absolutely required
* All code must be TypeScript
* Must compile with `tsup` without errors
* Must work in both:

  * React (Client Components)
  * Next.js App Router (Server + Client)

---

## 1. Project Overview

`chronotrace` is a dev-only logging utility that:

1. Intercepts console methods on:

   * Browser (client)
   * Node.js (server)

2. Stores logs in memory with:

   * Unix timestamps (`Date.now()`)
   * Execution environment (CLIENT / SERVER)
   * Group nesting depth

3. Exposes:

```ts
window.downloadLogs(options?: DownloadOptions): Promise<void>
```

4. Downloads a `.txt` file containing:

   * Chronologically sorted logs
   * Clean formatting
   * Proper indentation

---

## 2. Directory Structure

```
packages/chronotrace/
├── src/
│   ├── client/
│   │   ├── index.ts
│   │   └── provider.tsx
│   ├── server/
│   │   └── index.ts
│   └── shared/
│       ├── types.ts
│       └── utils.ts
├── package.json
├── tsconfig.json
├── tsup.config.ts
```

---

## 3. Shared Types (`src/shared/types.ts`)

```ts
export type LogLevel =
  | 'log'
  | 'warn'
  | 'error'
  | 'group'
  | 'groupCollapsed'
  | 'groupEnd';

export type LogSource = 'client' | 'server' | 'all';

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  environment: 'CLIENT' | 'SERVER';
  depth: number;
  message: string;
}

export interface DownloadOptions {
  levels?: LogLevel[];
  source?: LogSource;
}
```

---

## 4. Shared Utilities (`src/shared/utils.ts`)

### 4.1 sanitizeArgs

```ts
export function sanitizeArgs(args: any[]): any[];
```

**Behavior:**

* Detect `%c` tokens in first argument (string)
* Count occurrences of `%c`
* Remove:

  * `%c` tokens from string
  * Corresponding style arguments

**Example:**

```ts
console.log("%cHello %cWorld", "color:red", "color:blue");
```

Becomes:

```
Hello World
```

---

### 4.2 formatMessage

```ts
export function formatMessage(args: any[]): string;
```

**Behavior:**

* Convert all args into a single string
* Objects → `JSON.stringify`
* Handle circular references safely
* Fallback: `[Unserializable Object]`

---

## 5. Client Module (`src/client/index.ts`)

### 5.1 Internal State

```ts
let clientLogs: LogEntry[] = [];
let currentDepth = 0;
const MAX_LOGS = 2000;
```

---

### 5.2 Initialization

```ts
export function initClientLogger(): void;
```

* Must run only once
* Monkey patch console methods:

  * log
  * warn
  * error
  * group
  * groupCollapsed
  * groupEnd

---

### 5.3 Interception Logic

For each console call:

**Before logging:**

* If `groupEnd` → decrease depth (min 0)

**Process:**

* sanitizeArgs
* formatMessage

**Store:**

```ts
clientLogs.push({
  timestamp: Date.now(),
  level,
  environment: 'CLIENT',
  depth: currentDepth,
  message
});
```

**Limit memory:**

```ts
if (clientLogs.length > MAX_LOGS) {
  clientLogs.shift();
}
```

**After:**

* If `group` or `groupCollapsed` → increase depth

**Always:**

* Call original console method

---

### 5.4 Global API

```ts
declare global {
  interface Window {
    downloadLogs: (options?: DownloadOptions) => Promise<void>;
  }
}
```

---

### 5.5 downloadLogs Implementation

```ts
window.downloadLogs = async (options) => {}
```

**Default Options:**

```ts
{
  source: 'client',
  levels: ['log', 'warn', 'error', 'group']
}
```

---

### Steps:

#### 1. Get Client Logs

Already in memory

#### 2. Fetch Server Logs (if needed)

```ts
await fetch('/api/download-logs')
```

* Must NOT crash if fails
* Fallback: empty array

---

#### 3. Merge Logs

```ts
let logs = [...clientLogs, ...serverLogs]
```

---

#### 4. Filter

```ts
logs.filter(log => options.levels.includes(log.level))
```

---

#### 5. Sort

```ts
logs.sort((a, b) => a.timestamp - b.timestamp)
```

---

#### 6. Format Output

Rules:

* Add newline BEFORE every `group` (except first)
* Indentation:

```ts
'    '.repeat(log.depth)
```

* Time format:

```ts
new Date(timestamp).toLocaleTimeString()
```

* Final format:

```
[CLIENT] [10:32:12 AM] Message
```

---

#### 7. Download File

* Use Blob
* File name:

```
chronotrace-logs.txt
```

---

## 6. Server Module (`src/server/index.ts`)

### 6.1 Global State

```ts
const globalKey = '__CHRONOTRACE_SERVER_LOGS__';
(globalThis as any)[globalKey] ||= [];
```

---

### 6.2 Initialization

```ts
export function initServerLogger(): void;
```

* Patch console methods (same as client)
* environment = 'SERVER'

---

### 6.3 API Handler

```ts
export function nextApiLogHandler(): Response;
```

**Behavior:**

```ts
return Response.json({
  logs: globalLogs
});
```

---

## 7. React Provider (`src/client/provider.tsx`)

**Must include at top:**

```ts
"use client";
```

**Implementation:**

```tsx
export function ChronotraceProvider() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      initClientLogger();
    }
  }, []);

  return null;
}
```

---

## 8. Build Configuration (`tsup.config.ts`)

**Requirements:**

* Entry points:

```ts
{
  client: 'src/client/index.ts',
  server: 'src/server/index.ts'
}
```

* Output: `dist/`
* Format:

  * ESM
  * CJS
* Generate types (`dts: true`)
* Preserve `"use client"`

---

## 9. TypeScript Config (`tsconfig.json`)

**Must Support:**

* DOM (client)
* Node (server)
* Strict mode ON

---

## 10. Non-Functional Constraints

* No memory leaks
* No breaking native console behavior
* No runtime crashes if server API fails
* Must work with Next.js Fast Refresh

---

## 11. Future Extensions (DO NOT IMPLEMENT)

* Chrome Extension UI
* VSCode Plugin
* Remote log streaming
* Log persistence

---

## FINAL INSTRUCTION

Generate:

* `tsconfig.json`
* `tsup.config.ts`
* All source files

STRICTLY following this document.

---
