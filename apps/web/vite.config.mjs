import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import path from 'path';

const __dirname = path.resolve();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    viteReact(),
    tsconfigPaths(),
    tailwindcss(),
  ],
  // server: {
  //   allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', '.loca.lt'],
  // },
  resolve: {
    alias:
      mode !== 'development'
        ? {
            '.prisma/client/index-browser':
              '../../node_modules/.prisma/client/index-browser.js',
            // '@edusama/server': path.join(__dirname, '../server/src'),
            // '@': path.resolve(__dirname, 'src'),
            // '@api/*': path.resolve(__dirname, '../server/src/*'),
            // fix loading all icon chunks in dev mode
            // https://github.com/tabler/tabler-icons/issues/1233
            '@tabler/icons-react':
              '@tabler/icons-react/dist/esm/icons/index.mjs',
          }
        : {},
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },
}));
