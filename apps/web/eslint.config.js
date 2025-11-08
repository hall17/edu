import baseConfig from 'packages/eslint/base';
import viteConfig from 'packages/eslint/vite';
import pluginRouter from '@tanstack/eslint-plugin-router';

/** @type {import('typescript-eslint').Config} */
export default [
  ...baseConfig,
  ...viteConfig,
  ...pluginRouter.configs['flat/recommended'],
  {
    name: 'custom',
    rules: {
      'no-empty': [2, { allowEmptyCatch: true }],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // '@typescript-eslint/no-empty-function': [2, { "allowEmptyCatch": true }],
    },
  },
];
