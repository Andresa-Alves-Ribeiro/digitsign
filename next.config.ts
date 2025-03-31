import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].filter(ext => !ext.includes('test')),
  // Exclude test files and __tests__ directory from being processed
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
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
      bodySizeLimit: '2mb'
    },
  },
};

export default nextConfig;
