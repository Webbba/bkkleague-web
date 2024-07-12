module.exports = {
  extends: [
    'plugin:@shopify/typescript',
    'plugin:@shopify/react',
    'next',
    'turbo',
    'prettier',
  ],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/button-has-type': 'off',
    '@shopify/typescript/prefer-pascal-case-enums': 'off',
    '@shopify/typescript/prefer-singular-enums': 'off',
    'no-process-env': 'off',
    'no-console': ['warn'],
    'import/order': ['error', { groups: [['builtin', 'external', 'internal']] }],
    'import/no-extraneous-dependencies': 'off',
  },
};
