module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'operator-linebreak': 'off',
    'max-classes-per-file': 'off',
    'no-restricted-syntax': 'off',
    camelcase: 'off',
    'no-warning-comments': 'warn',
  },
};
