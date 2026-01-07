import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // External packages for server components
  serverExternalPackages: [],
  // Ensure proper routing for static export
  trailingSlash: false,
};

export default nextConfig;
