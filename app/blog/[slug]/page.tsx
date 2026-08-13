import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPostSlugs } from "@/lib/blog";
import { renderMarkdown } from "@/lib/markdown";
import { Tag } from "@/components/ui/Tag";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    openGraph: {
      title: `${post.frontmatter.title} | SANJIN`,
      description: post.frontmatter.excerpt,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;

  return (
    <article
      style={{
        padding: "var(--space-16) var(--space-6)",
        minHeight: "60vh",
      }}
      aria-label={`文章：${frontmatter.title}`}
    >
      <div style={{ maxWidth: "var(--container-narrow)", margin: "0 auto" }}>
        {/* 返回（跳转模式） */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            marginBottom: "var(--space-10)",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
              textDecoration: "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            返回博客
          </Link>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              fontSize: "var(--text-sm)",
              color: "var(--color-text-muted)",
              textDecoration: "none",
            }}
          >
            返回首页
          </Link>
        </div>

        {/* Header */}
        <header style={{ marginBottom: "var(--space-10)" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "var(--tracking-wide)",
              color: "var(--color-accent-hover)",
              margin: "0 0 var(--space-3)",
            }}
          >
            {frontmatter.date}
          </p>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, var(--text-4xl))",
              fontWeight: 800,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: "var(--leading-tight)",
              margin: "0 0 var(--space-5)",
            }}
          >
            {frontmatter.title}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
            {frontmatter.tags.map((t) => (
              <Tag key={t} variant="accent">
                {t}
              </Tag>
            ))}
          </div>
        </header>

        {/* Body */}
        <div className="blog-content">{renderMarkdown(content)}</div>

        {/* 底部：返回 + 其他模块入口（跳转模式） */}
        <div
          style={{
            marginTop: "var(--space-12)",
            paddingTop: "var(--space-8)",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/blog"
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--color-accent-hover)",
              textDecoration: "none",
            }}
          >
            ← 更多文章
          </Link>
          <div style={{ display: "flex", gap: "var(--space-4)" }}>
            <Link href="/projects" style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", textDecoration: "none" }}>
              项目
            </Link>
            <Link href="/cube" style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", textDecoration: "none" }}>
              魔方
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
