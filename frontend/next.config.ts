import type { NextConfig } from "next";

const validation: any = {
  NEXT_PUBLIC_PUSHER_APP_KEY: /^[a-f0-9]{20}$/,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: /\.apps\.googleusercontent\.com$/,
};

const invalid_keys = Object.entries(validation)
  .filter(([key, pattern]: any) => !pattern.test(process.env[key] || ""))
  .map(([k]) => k);

if (invalid_keys.length > 0) {
  console.error("\x1b[41m\x1b[37m%s\x1b[0m", `⚠️ CẢNH BÁO: Cấu hình sai: ${invalid_keys.join(", ")}. Hãy kiểm tra trình duyệt để xem chi tiết.`);
}

const nextConfig: any = {
  /* config options here */
  experimental: {
    allowedDevOrigins: [
      "shopdee.io.vn",
      "api.shopdee.io.vn",
      "*.preview.devprod.cloudflare.dev",
      "*.trycloudflare.com"
    ],
  },
};

export default nextConfig;
