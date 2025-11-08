import baseConfig from '@edusama/eslint/base';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    name: 'ignores',
    ignores: ['*TsRest*.ts', 'src/prisma/generated/**'],
  },
  ...baseConfig,
];
