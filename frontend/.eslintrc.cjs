module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:tailwindcss/recommended',
    // 'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js'],
      parser: '@typescript-eslint/parser',
    },
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    'tailwindcss',
    'import', // Ensure the import plugin is listed here
    '@typescript-eslint', // Include TypeScript plugin for TS specific rules
  ],
  rules: {
    '@typescript-eslint/no-floating-promises': 'off',
    'import/no-default-export': 'error',
    quotes: ['error', 'single'],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'never',
      },
    ],
    'tailwindcss/no-custom-classname': [
      'error',
      {
        whitelist: ['animate-fade', 'animate-killAnimation', 'shadow-custom'],
      },
    ],
  },
};
