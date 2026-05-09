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
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
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
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-console': 'off',
      'no-irregular-whitespace': ['error', {
        skipStrings: true,
        skipComments: true,
        skipRegExps: true,
        skipTemplates: true,
      }],
    },
  },
];
