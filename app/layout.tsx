import type { Metadata } from "next";
import "@/styles/tokens.css";
import "@/styles/global.css";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { FloatingHome } from "@/components/layout/FloatingHome";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

export const metadata: Metadata = {
  title: {
    default: "SANJIN | 个人作品集",
    template: "%s | SANJIN",
  },
  description:
    "SANJIN 的个人作品集：展示数据分析、应用开发与课程设计实践。",
  keywords: ["SANJIN", "portfolio", "数据分析", "应用开发", "博客", "作品集", "魔方"],
  authors: [{ name: "SANJIN" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "SANJIN Portfolio",
    title: "SANJIN | 个人作品集",
    description:
      "博客、作品项目与魔方工坊 —— SANJIN 的个人创作空间。",
  },
  twitter: {
    card: "summary_large_image",
    title: "SANJIN | 个人作品集",
    description: "博客、作品项目与魔方工坊 —— SANJIN 的个人创作空间。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body
        style={{
          fontFamily: "var(--font-sans)",
          color: "var(--color-text-primary)",
          backgroundColor: "var(--color-bg-primary)",
          lineHeight: "var(--leading-normal)",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <ScrollProgress />
        <a
          href="#main-content"
          className="skip-link"
          style={{
            position: "absolute",
            top: "-40px",
            left: 0,
            background: "var(--color-accent)",
            color: "var(--color-text-inverse)",
            padding: "8px 16px",
            zIndex: 100,
            textDecoration: "none",
            borderRadius: "0 0 var(--radius-sm) 0",
            fontWeight: 600,
            fontSize: "var(--text-sm)",
          }}
        >
          跳到主要内容
        </a>
        <main id="main-content" style={{ minHeight: "calc(100vh - 200px)" }}>
          <PageTransition>{children}</PageTransition>
        </main>
        <FloatingHome />
        <Footer />
      </body>
    </html>
  );
}
