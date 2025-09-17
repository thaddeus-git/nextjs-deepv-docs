import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Enable static optimization
  trailingSlash: false,
  
  // Configure webpack for better memory usage
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    if (config.cache && !dev) {
      config.cache = Object.freeze({
        type: 'memory',
      })
    }
    return config
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@mdx-js/react', 'gray-matter'],
  },
  
  // Memory optimization for large projects
  eslint: {
    // Don't run ESLint during build to save memory (run in CI instead)
    ignoreDuringBuilds: false,
  },
  
  // Configure image optimization
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
};

export default nextConfig;
