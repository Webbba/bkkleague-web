/**
 * @type {import('next').NextConfig}
 */
const path = require('path');

module.exports = {
  reactStrictMode: true,
  transpilePackages: [
    'api',
    'base-components',
    'upcoming',
    'completed'
  ],
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
    outputFileTracingIncludes: {
      '/api': ['./pages/api/*'],
    },
  },
  // experimental: {
  //   outputFileTracingRoot: path.join(__dirname, '../../'),
  // },
  webpack: (config) => {
    // camelCase style names from css modules
    config.module.rules
      .find(({ oneOf }) => Boolean(oneOf))
      .oneOf.filter(({ use }) => JSON.stringify(use)?.includes('css-loader'))
      .reduce((acc, { use }) => acc.concat(use), [])
      .forEach(({ options }) => {
        if (options.modules) {
          options.modules.exportLocalsConvention = 'camelCase';
        }
      });

    return config;
  },
};
