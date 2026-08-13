"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * FloatingHome — 全局悬浮「回到首页」按钮
 * 除首页外所有页面右下角显示，点击直达首页。
 */
export function FloatingHome() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <Link
      href="/"
      className="floating-home"
      aria-label="回到首页"
      title="回到首页"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 10.5L12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9.5 21v-6h5v6" />
      </svg>
      <span className="floating-home-label">首页</span>
    </Link>
  );
}
