import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // This is the key for Next.js versions before 13.5
    // outputFileTracingRoot: __dirname,
  },
  // For Next.js 13.5+
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
