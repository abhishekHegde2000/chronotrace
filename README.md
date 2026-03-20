# ChronoTrace

A monorepo for ChronoTrace, a tool to intercept, trace, and export execution flows across boundaries.

## Tooling

Prettier is used for formatting and ESLint is the linting standard for the repository. Run `pnpm format` and `pnpm lint` to maintain code quality. Husky enforces these checks before allowing commits via a pre-commit hook.

## Workspace Structure

- `packages/core`: Core logic and abstractions.
- `packages/client`: Browser/client specific interception tools.
- `packages/exporter-text`: Text formatting and export capabilities.
- `apps/playground`: Local verification application consuming workspace packages.
