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
  async rewrites() {
    return [
      {
        source: "/r2-models/:path*",
        destination:
          "https://pub-cc6bc0ad895f4273912e59614e1effe0.r2.dev/models/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/shop-my-room",
        destination: "/shop-this-room",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
