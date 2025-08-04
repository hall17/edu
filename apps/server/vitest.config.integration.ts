import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/tests/**/*.test.ts'],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    setupFiles: ['src/tests/helpers/setup.ts'],
    globalSetup: 'src/tests/helpers/globalSetup.ts',
    testTimeout: 30000,
  },
  plugins: [tsconfigPaths()],
});
