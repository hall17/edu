import baseConfig from '@edusama/eslint-config-custom/base';
// import js from '@eslint/js';
// import { defineConfig, globalIgnores } from 'eslint/config';
// import prettierConfig from 'eslint-config-prettier';
// import importPlugin from 'eslint-plugin-import';
// import prettierPlugin from 'eslint-plugin-prettier';
// import globals from 'globals';
// import tseslint from 'typescript-eslint';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    name: 'ignores',
    ignores: ['*TsRest*.ts', 'src/prisma/generated/**'],
  },
  ...baseConfig,
];

// export default defineConfig(
// baseConfig,
// [
// globalIgnores(['node_modules', 'public/**', 'dist/**', 'build/**']),
// {
//   files: ['**/*.{js,mjs,cjs,ts}'],
// },
// {
//   plugins: { js },
//   extends: ['js/recommended'],
// },
// tseslint.configs.recommended,
// {
//   languageOptions: { globals: globals.node },
//   extends: [],
//   plugins: {
//     prettier: prettierPlugin,
//     import: importPlugin.flatConfigs.recommended.plugins.import,
//   },
//   rules: {
//     '@typescript-eslint/no-unused-vars': 'off',
//     '@typescript-eslint/no-explicit-any': 'off',
//     'prettier/prettier': 'error',
//     ...prettierConfig.rules,
//     'import/order': [
//       'warn',
//       {
//         'newlines-between': 'always',
//         alphabetize: {
//           order: 'asc',
//           caseInsensitive: true,
//         },
//         groups: [
//           'external',
//           'builtin',
//           'internal',
//           'parent',
//           'sibling',
//           'index',
//         ],
//         pathGroups: [
//           {
//             pattern: '@api/*',
//             group: 'internal',
//           },
//         ],
//       },
//     ],
//     semi: ['error', 'always'],
//     quotes: ['error', 'single'],
//     '@typescript-eslint/no-unused-vars': [
//       'warn',
//       {
//         vars: 'all',
//         args: 'after-used',
//         ignoreRestSiblings: true,
//         argsIgnorePattern: '^_',
//         varsIgnorePattern: '^_',
//         caughtErrors: 'none',
//         destructuredArrayIgnorePattern: '^_',
//       },
//     ],
//   },
// },
// ]
// );
