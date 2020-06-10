module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'sonarjs',
  ],
  extends: [
    'airbnb-typescript/base',
    'plugin:sonarjs/recommended',
  ],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    'func-style': ['error', 'expression'],
  },
};
