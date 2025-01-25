import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jestPlugin from 'eslint-plugin-jest';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'jest': jestPlugin,
    },
    rules: {
      'constructor-super': 'error',
      'no-const-assign': 'error',
      'no-this-before-super': 'error',
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-unused-vars': 'warn',
      'no-use-before-define': 'error',
      'valid-typeof': 'error',
    },
  },
  {
    files: ['**/*.{test,spec}.{js,mjs,cjs,ts}'],
    plugins: {
      'jest': jestPlugin,
    },
    languageOptions: {
      globals: jestPlugin.environments.globals.globals,
    },
  },
];