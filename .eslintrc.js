module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  root: true,
  ignorePatterns: ['bin/', 'node_modules/', '.eslintrc.js', 'prettier.config.js'],
  rules: {
    // Basic JavaScript rules (applies to all code)
    'no-var': 'error',
    'prefer-const': 'error',
    eqeqeq: 'error',
    'no-eval': 'error',
    'no-console': 'off',

    // TypeScript rules (relaxed for backward compatibility)
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  overrides: [
    {
      // Strict rules for new src/ folder (Dream11 standards)
      files: ['src/**/*.ts'],
      parserOptions: {
        project: './tsconfig.src.json',
      },
      rules: {
        // TypeScript strict rules
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
          },
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/no-misused-promises': 'error',

        // Naming conventions (Dream11 standards)
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            modifiers: ['const', 'global'],
            format: ['UPPER_CASE'],
            filter: {
              regex: '^(require|module|exports|__dirname|__filename)$',
              match: false,
            },
          },
          {
            selector: 'variable',
            modifiers: ['const'],
            format: ['camelCase', 'UPPER_CASE'],
          },
          {
            selector: 'variable',
            format: ['camelCase'],
          },
          {
            selector: 'function',
            format: ['camelCase'],
          },
          {
            selector: 'parameter',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
          {
            selector: 'enumMember',
            format: ['UPPER_CASE'],
          },
        ],

        // Code quality
        'no-duplicate-imports': 'error',
        'no-useless-rename': 'error',
        '@typescript-eslint/no-unused-expressions': 'error',
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/return-await': 'error',

        // Best practices
        'prefer-template': 'error',
        'prefer-arrow-callback': 'error',
        'no-nested-ternary': 'error',
        'no-unneeded-ternary': 'error',
      },
    },
    {
      // Relaxed rules for existing script/ folder
      files: ['script/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/naming-convention': 'off',
      },
    },
  ],
};

