import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: ['**/node_modules/**', '**/index.ts, ', 'vite.config.mts'],
      provider: 'v8',
    },
    globals: true,
    restoreMocks: true,
    poolOptions: {
      threads: {
        singleThread: true, // set this to true to avoid race conditions while working with prisma (database)
      },
    },
    setupFiles: ['./src/tests/setup.integration.ts'],
  },
  resolve: {
    alias: {
      // '@api': '/src',
      '@api': '/src',
    },
  },
  // plugins: [tsconfigPaths()],
});
