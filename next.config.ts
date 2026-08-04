import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typedRoutes: true,
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      {
        source: "/casa-inteligenta",
        destination: "/casa-smart",
        permanent: true,
      },
      {
        source: "/automatizare-locuinte",
        destination: "/automatizare-casa",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
