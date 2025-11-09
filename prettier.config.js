// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

module.exports = {
  // Line length
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  
  // Semicolons and quotes
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  
  // Trailing commas (better for git diffs)
  trailingComma: 'es5',
  
  // Brackets and spacing
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  
  // Line endings
  endOfLine: 'auto',
  
  // Special formatting for specific file types
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      options: {
        printWidth: 80,
        singleQuote: true,
        trailingComma: 'es5',
      },
    },
    {
      files: ['*.json', '.prettierrc', '.eslintrc'],
      options: {
        parser: 'json',
        tabWidth: 2,
      },
    },
    {
      files: ['*.md'],
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
  ],
};
