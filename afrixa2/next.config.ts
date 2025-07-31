import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Disable server-side features for static export
  experimental: {
    appDir: true
  }
};

export default nextConfig;
