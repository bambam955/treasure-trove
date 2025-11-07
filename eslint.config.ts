import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierConfig from 'eslint-config-prettier';

export default [
  // We don't need to lint these files.
  {
    ignores: ['backend/dist/', 'frontend/dist/', 'frontend/vite.config.js'],
  },

  // Apply browser environment globals
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // TypeScript configuration (includes eslint:recommended)
  ...tseslint.configs.recommended,

  // Configuration for the frontend source code.
  {
    files: ['frontend/**/*.{js,jsx,ts,tsx}'],
    // React recommended configuration and JSX runtime.
    ...react.configs.flat.recommended,
    ...react.configs.flat['jsx-runtime'],
    // JSX-a11y recommended configuration
    ...jsxA11y.flatConfigs.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Rule overrides
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },

  // Prettier must be last to ensure no conflicts
  prettierConfig,
];
