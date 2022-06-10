module.exports = {
  'extends': [
    'eslint:recommended',
    'plugin:cypress/recommended'
  ],
  'env': {
    'es6': true,
    'browser': true,
    'node': true
  },
  'rules': {
    'no-unused-vars': 2,
    'no-undef': 2,
    'cypress/no-unnecessary-waiting': 'off'
  },
  'parser': '@babel/eslint-parser',
  'parserOptions': {
    'requireConfigFile': false,
    'sourceType': 'module',
    'ecmaFeatures': {
      'modules': true,
      'spread': true,
      'restParams': true
    }
  },
  'globals': {
    'Tag': 'readonly'
  },
  'ignorePatterns': [
    'cypress/support/index.d.ts'
  ]
};
