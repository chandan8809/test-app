/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = {
  ...nextConfig,
  sentry: {
    hideSourceMaps: true,
  },
};

const sentryWebpackPluginOptions = {
  silent: true, 
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
