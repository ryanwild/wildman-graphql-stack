import type { NextConfig } from "next";

const { NEXT_ALLOWED_DEV_ORIGIN } = process.env;
const allowedDevOrigins = NEXT_ALLOWED_DEV_ORIGIN
  ? [NEXT_ALLOWED_DEV_ORIGIN]
  : undefined;

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg"],
  allowedDevOrigins,
  rewrites: async () => {
    return [{ source: "/health", destination: "/api/health" }];
  },
};

export default nextConfig;
