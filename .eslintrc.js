module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.d.ts', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src'],
      },
    },
    react: {
      version: 'detect',
    },
  },
  extends: [
    'plugin:jest/recommended', 
    'plugin:react/recommended', 
    'prettier'
  ],
  plugins: [
    '@typescript-eslint', 
    'immutable',
    'import', 
    'jest', 
    'no-relative-import-paths',
    'react', 
  ],
  overrides: [
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    'immutable/no-mutation': 'warn',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/prefer-default-export': 'off',
    'no-case-declarations': 'off',
    'no-console': 'warn',
    'no-else-return': 'error',
    'no-relative-import-paths/no-relative-import-paths': ['error', { 'rootDir': 'src' }],
    'no-unused-vars': 'off',
    'object-shorthand': 'error',
    'prefer-const': 'error',
    'react/display-name': 'off',
    'react/jsx-curly-brace-presence': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'spaced-comment': 'error',
    'react/destructuring-assignment': 'error'
  },
  ignorePatterns: [
    '.eslintrc.js',
  ],
}
