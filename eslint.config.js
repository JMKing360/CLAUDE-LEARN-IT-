import tsParser from '@typescript-eslint/parser';

const globals = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  localStorage: 'readonly',
  fetch: 'readonly',
  URLSearchParams: 'readonly',
  Blob: 'readonly',
  URL: 'readonly',
  console: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  process: 'readonly',
};

const rules = {
  'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  'no-empty': ['error', { allowEmptyCatch: true }],
  'no-console': 'off',
  'no-irregular-whitespace': ['error', {
    skipStrings: true,
    skipComments: true,
    skipRegExps: true,
    skipTemplates: true,
  }],
};

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'reference/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '*.min.js',
    ],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals,
    },
    rules,
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals,
    },
    rules,
  },
];
