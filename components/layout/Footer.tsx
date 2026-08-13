import Link from "next/link";
import { CAN_MANAGE_CONTENT } from "@/lib/site-mode";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { href: "/", label: "首页" },
    { href: "/blog", label: "博客" },
    { href: "/projects", label: "项目" },
    { href: "/hobbies", label: "兴趣爱好" },
    { href: "/about", label: "关于" },
    { href: "/contact", label: "联系" },
  ];

  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg-secondary)",
        padding: "var(--space-12) var(--space-6)",
        // 收紧与正文间距，避免内容较少的页面底部出现大片白边
        marginTop: "var(--space-12)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-6)",
        }}
      >
        {/* 模块链接 */}
        <nav
          aria-label="页脚导航"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "var(--space-4) var(--space-8)",
          }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
                textDecoration: "none",
                transition: "color var(--duration-fast) var(--ease-out)",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Copyright + 作者管理入口 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-4)",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-muted)",
              textAlign: "center",
              margin: 0,
            }}
          >
            © {currentYear} SANJIN · Built with Next.js
          </p>
          {CAN_MANAGE_CONTENT && (
            <Link
              href="/admin/add-project"
              title="添加项目（本地作者入口）"
              aria-label="添加项目（本地作者入口）"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
                textDecoration: "none",
                opacity: 0.7,
                transition: "color var(--duration-fast) var(--ease-out), opacity var(--duration-fast) var(--ease-out)",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              管理
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
