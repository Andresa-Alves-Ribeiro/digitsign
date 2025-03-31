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
};

export default nextConfig;
