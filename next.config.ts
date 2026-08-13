import type { NextConfig } from "next";

/**
 * basePath 策略：
 * - 本地 dev / build：为空，站点跑在根路径，直接 http://localhost:3000 可访问
 * - GitHub Pages 部署：由 CI 注入 NEXT_PUBLIC_BASE_PATH=/<仓库名>
 *
 * 技术红线（勿动）：
 * - 不要升级到 Next 16（cubing.js 阶段二依赖 webpack，Turbopack 不兼容）
 * - 不要在 npm scripts 里加 --turbo
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
