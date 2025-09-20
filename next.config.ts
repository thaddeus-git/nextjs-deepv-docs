import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Enable static optimization
  trailingSlash: false,
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@mdx-js/react', 'gray-matter'],
  },
  
  // Configure image optimization
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/thaddeus-git/nextjs-deepv-content/main/images/**',
      },
    ],
  },
};

export default nextConfig;
