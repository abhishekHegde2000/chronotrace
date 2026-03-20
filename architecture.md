# ChronoTrace Coding Architecture (v1 Contract)

## Goal

ChronoTrace captures browser console activity, stores it in a normalized internal model, and downloads it as a formatted `.txt` file with clear spacing and timestamps.

## Core Behavior

- **`downloadLogs()` (default)**: Captures and includes only the default console methods (`log`, `group`, `groupCollapsed`, `groupEnd`).
- **`downloadLogs({ only })`**: Replaces the default capture set entirely with the provided methods. Defaults are removed unless explicitly included.
- **`downloadLogs({ extend })`**: Creates a union of the default set plus the provided methods.

## Module Boundaries

Tight responsibilities to ensure each package has exactly one job:

### `packages/core` (Data Model & Store)

- Defines log entry types and log level/method types (including timestamp and source metadata).
- Defines in-memory log storage returning stable ordered snapshots.
- **Contract**: Zero browser APIs. Must remain strictly environment-agnostic.

### `packages/client` (Browser Integration)

- Intercepts supported console calls (idempotently, preserving original args) and normalizes them into core log entries with source metadata.
- Exposes `downloadLogs()` as the primary runtime entry point triggering file download.
- Registers keyboard shortcut support (`Ctrl+L+P` / `Cmd+L+P`).
- **Contract**: Zero formatting logic. Uses only baseline methods unless overridden.

### `packages/exporter-text` (Export Generation)

- Filters logs based on `only` / `extend` rules.
- Formats logs into readable plain text with clear spacing, file boundaries, and timestamps for every entry.
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

The filter pipeline is a standalone, deterministic pure function resolved via `resolveFilter(defaultSet, options) -> finalSet`.

- Selection strictly happens _before_ formatting.
- `only` takes precedence over default behavior.
- `extend` merges with default behavior.
- Do not mix filtering logic into formatting logic.

## Formatting Rules

The text exporter renders logs strictly for human readability:

- **Timestamps**: One visible timestamp per entry block.
- **Spacing**: Separate files and log groups with clear spacing boundaries.
- **Normalization**: Normalize excessive and repeated empty lines into a single readable boundary so the output stays compact.
- **Order**: Preserve original log order exactly.

## Download Behavior & Keyboard Shortcut

- Browser download produces a `.txt` file mirroring the current in-memory log store (post-filtering and formatting).
- Browser shortcut `Ctrl+L+P` (Windows/Linux) or `Cmd+L+P` (macOS) triggers download without interfering with normal browser navigation.
