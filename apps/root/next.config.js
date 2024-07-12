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
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
    outputFileTracingIncludes: {
      '/api': ['./pages/api/*'],
    },
  },
  distDir: 'build',
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
