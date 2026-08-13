import type { Metadata } from "next";
import "@/styles/tokens.css";
import "@/styles/global.css";
import { Footer } from "@/components/layout/Footer";
import { FloatingHome } from "@/components/layout/FloatingHome";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

export const metadata: Metadata = {
  title: { default: "YOUR NAME | AI 应用与嵌入式作品集", template: "%s | YOUR NAME" },
  description: "电子信息工程背景，面向 AI 应用开发与嵌入式岗位的个人作品集。",
  keywords: ["AI 应用开发", "嵌入式", "电子信息工程", "portfolio"],
  authors: [{ name: "YOUR NAME" }],
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><ScrollProgress /><a href="#main-content" className="skip-link">跳到主要内容</a><main id="main-content">{children}</main><FloatingHome /><Footer /></body></html>;
}
