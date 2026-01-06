import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable React Server Components to prevent RSC file loading errors
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Ensure proper routing for static export
  trailingSlash: false,
};

export default nextConfig;
