import type { NextConfig } from "next";

// Site 100% estático para o GitHub Pages: `next build` gera a pasta out/.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
