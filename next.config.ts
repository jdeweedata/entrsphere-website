import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "appwrite.entrsphere.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },

  // Ensure trailing slashes are not added
  trailingSlash: false,

  // TypeScript configuration
  typescript: {
    // Allow production builds to complete even with type errors during development
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
