import { defineConfig } from 'eslint-define-config';

export default defineConfig({
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier', // Add Prettier here to disable conflicting rules
  ],
  plugins: ['react', '@typescript-eslint', 'prettier'], // Add the Prettier plugin
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'prettier/prettier': 'error', // Show Prettier issues as ESLint errors
    'react/prop-types': 'off', // Example of a React-specific rule you may want to disable
    '@typescript-eslint/no-unused-vars': ['warn'], // Example TypeScript rule
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
});
