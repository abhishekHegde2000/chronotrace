import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/client/index.ts', 'src/client/provider.tsx'],
    format: ['esm', 'cjs'],
    dts: true,
    outDir: 'dist/client',
    clean: true,
    external: ['react'],
    esbuildOptions(options) {
      options.banner = {
        js: '"use client";',
      };
    },
  },
  {
    entry: ['src/server/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    outDir: 'dist/server',
    clean: true,
  },
  {
    entry: ['src/shared/types.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    outDir: 'dist/shared',
    clean: true,
  }
]);
