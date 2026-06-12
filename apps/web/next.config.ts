import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@limata/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
