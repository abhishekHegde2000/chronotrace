# ChronoTrace Coding Architecture (v1 Contract)

## Goal

ChronoTrace captures browser console activity, stores it in a normalized internal model, and downloads it as a formatted `.txt` file.

## Core Behavior

- **`downloadLogs()` (default)**: Includes only the default console methods (`log`, `group`, `groupCollapsed`, `groupEnd`).
- **`downloadLogs({ only })`**: Replaces the default set entirely with the provided methods. Defaults are removed unless explicitly included.
- **`downloadLogs({ extend })`**: Creates a union of the default set plus the provided methods.

## Module Boundaries

Tight responsibilities to ensure each package has exactly one job:

### `packages/core` (Data Model & Store)

- Defines log entry types and log level/method types.
- Defines in-memory log storage.
- **Contract**: Zero browser APIs. Must remain strictly environment-agnostic.

### `packages/client` (Browser Integration)

- Intercepts supported console calls and normalizes them into core log entries.
- Exposes `downloadLogs()` as the primary runtime entry point.
- Registers keyboard shortcut support (`Ctrl+L+P` / `Cmd+L+P`).
- **Contract**: Zero formatting logic.

### `packages/exporter-text` (Export Generation)

- Filters logs based on `only` / `extend` rules.
- Formats logs into readable plain text.
- Generates the string payload.
- **Contract**: Zero DOM or download execution logic beyond producing the output payload.

## Log Model

Each captured log entry must retain:

- **Timestamp**: Required on every entry.
- **Method/Level**: The captured console method.
- **Payload**: The logged message parameters.
- **Source Metadata**: File name and line number when available.
- **Order**: Insertion order must be strictly preserved across all files.

## Filtering Rules

The filter pipeline is a standalone contract resolved via the final export set (`default` + `extend` OR `only`).

- Selection strictly happens _before_ formatting.
- Resolve the selection set first.
- Do not mix filtering logic into formatting logic.

## Formatting Rules

The text exporter renders logs strictly for human readability:

- **Timestamps**: One visible timestamp per entry.
- **Spacing**: Separate files and groups with clear spacing boundaries.
- **Normalization**: Normalize excessive and repeated empty lines into a single readable boundary so the output stays compact.

## Download Behavior & Keyboard Shortcut

- Browser download produces a `.txt` file mirroring the current in-memory log store (post-filtering and formatting).
- Browser shortcut `Ctrl+L+P` (Windows/Linux) or `Cmd+L+P` (macOS) triggers download without interfering with normal browser navigation.
