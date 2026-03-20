# ChronoTrace

A monorepo for ChronoTrace, a tool to intercept, trace, and export execution flows across boundaries.

## Tooling
Biome is the formatting and linting standard for the repository. Run `pnpm check` to automatically format, lint, and organize imports. Husky enforces these checks before allowing commits via a pre-commit hook.

## Workspace Structure
- `packages/core`: Core logic and abstractions.
- `packages/client`: Browser/client specific interception tools.
- `packages/exporter-text`: Text formatting and export capabilities.
- `apps/playground`: Local verification application consuming workspace packages.
