import baseConfig from '@edusama/eslint/base';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    name: 'ignores',
    ignores: ['src/enums.ts'],
  },
  ...baseConfig,
];
