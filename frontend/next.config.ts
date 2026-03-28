import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cho phep truy cap tu domain public qua Cloudflare Tunnel trong dev mode
  allowedDevOrigins: [
    "shopdee.io.vn",
    "*.shopdee.io.vn",
    "*.trycloudflare.com",
  ],
};

export default nextConfig;
