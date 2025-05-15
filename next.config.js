/** @type {import('next').NextConfig} */

// Importing the Sentry Next.js plugin
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'].filter(ext => !ext.includes('test')),
    experimental: {
        serverActions: {
            allowedOrigins: ['*'],
            bodySizeLimit: '2mb'
        },
    },
    images: {
        domains: ['localhost', 'digitsign.vercel.app'],
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    eslint: {
        ignoreDuringBuilds: false,
    },
    webpack: (config, { isServer }) => {
        // Exclude test files and __tests__ directory
        config.module.rules.push({
            test: /\.(test|spec)\.(ts|tsx|js|jsx)$/,
            loader: 'ignore-loader',
        });
        
        // Exclude __tests__ directory
        config.watchOptions = {
            ...config.watchOptions,
            ignored: Array.isArray(config.watchOptions?.ignored) 
                ? [...config.watchOptions.ignored, '**/__tests__/**']
                : ['**/__tests__/**'],
        };
        
        return config;
    },
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: process.env.NEXTAUTH_URL || 'https://digitsign.vercel.app' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
                ],
            },
        ];
    },
}

// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options
const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, configFile, stripPrefix, urlPrefix, include, ignore
    silent: true,
};

module.exports = withSentryConfig(
    nextConfig,
    sentryWebpackPluginOptions,
    { hideSourceMaps: true }
); 