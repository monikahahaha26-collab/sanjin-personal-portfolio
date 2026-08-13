"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/** 兼容旧入口：/cube → /hobbies/cube（自动跳转，保留原链接可用） */
export default function CubeRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/hobbies/cube");
  }, [router]);

  return (
    <section
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-4)",
        padding: "var(--space-16) var(--space-6)",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: "var(--text-lg)", color: "var(--color-text-secondary)", margin: 0 }}>
        魔方工坊已归入「兴趣爱好」模块，正在跳转…
      </p>
      <Link
        href="/hobbies/cube"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--space-2)",
          fontSize: "var(--text-sm)",
          fontWeight: 600,
          color: "var(--color-accent-hover)",
          textDecoration: "none",
        }}
      >
        立即前往
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </section>
  );
}
