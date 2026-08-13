import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/content";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { ProjectRail } from "@/components/project/ProjectRail";
import { ImageCarousel } from "@/components/ui/ImageCarousel";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.frontmatter.title,
    description: project.frontmatter.summary,
    openGraph: {
      title: `${project.frontmatter.title} | SANJIN`,
      description: project.frontmatter.summary,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const { frontmatter } = project;
  const coverUrl = frontmatter.cover
    ? `${frontmatter.cover.startsWith("/") ? BASE : ""}${frontmatter.cover}`
    : undefined;

  return (
    <article
      style={{
        padding: "var(--space-16) var(--space-6)",
        minHeight: "60vh",
      }}
      aria-label={`项目：${frontmatter.title}`}
    >
      <div
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
        }}
      >
        {/* 左侧栏（其他项目 + 返回全览） + 主内容 */}
        <div className="project-layout">
          <ProjectRail currentSlug={slug} />

          <div style={{ minWidth: 0 }}>
            {/* Header */}
            <header style={{ marginBottom: "var(--space-12)" }}>
              {/* 多图轮切（封面 + 补充截图） */}
              <div style={{ marginBottom: "var(--space-8)" }}>
                <ImageCarousel
                  images={[
                    ...(coverUrl ? [coverUrl] : []),
                    ...(frontmatter.screenshots ?? []).map((s) =>
                      s.startsWith("/") ? `${BASE}${s}` : s
                    ),
                  ]}
                  alt={frontmatter.title}
                  portrait={slug === "gout-diet-guide"}
                />
              </div>

              {/* Title & Meta */}
              <h1
                style={{
                  fontSize: "clamp(1.75rem, 4vw, var(--text-4xl))",
                  fontWeight: 800,
                  color: "var(--color-text-primary)",
                  letterSpacing: "-0.02em",
                  lineHeight: "var(--leading-tight)",
                  marginTop: 0,
                  marginBottom: "var(--space-4)",
                }}
              >
                {frontmatter.title}
              </h1>

              {/* Meta Row */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "var(--space-4)",
                  marginBottom: "var(--space-5)",
                }}
              >
                <Tag variant="accent">{frontmatter.role}</Tag>
                <span
                  style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}
                >
                  {frontmatter.period}
                </span>
                <span
                  style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}
                >
                  {frontmatter.date}
                </span>
              </div>

              {/* Tech Stack Tags */}
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}
              >
                {frontmatter.tags.map((tag) => (
                  <Tag key={tag} variant="outline">
                    {tag}
                  </Tag>
                ))}
              </div>
            </header>

            {/* Summary */}
            <p
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--color-text-secondary)",
                lineHeight: "var(--leading-relaxed)",
                maxWidth: 720,
                marginBottom: "var(--space-12)",
              }}
            >
              {frontmatter.summary}
            </p>

            {/* Links (横向放置于正文上方) */}
            {(frontmatter.links.demo || frontmatter.links.repo) && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-3)",
                  padding: "var(--space-5) var(--space-6)",
                  backgroundColor: "var(--color-bg-secondary)",
                  borderRadius: "var(--radius-lg)",
                  marginBottom: "var(--space-12)",
                }}
              >
                {frontmatter.links.demo && (
                  <Button href={frontmatter.links.demo} external size="sm">
                    🌐 在线演示
                  </Button>
                )}
                {frontmatter.links.repo && (
                  <Button href={frontmatter.links.repo} variant="outline" size="sm" external>
                    GitHub 仓库
                  </Button>
                )}
              </div>
            )}

            {/* Features Section */}
            {frontmatter.features.length > 0 && (
              <section style={{ marginBottom: "var(--space-10)" }}>
                <h2
                  style={{
                    fontSize: "var(--text-xl)",
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--space-5)",
                  }}
                >
                  ✅ 已实现功能
                </h2>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-3)",
                  }}
                >
                  {frontmatter.features.map((feature, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "var(--space-3)",
                        padding: "var(--space-4)",
                        backgroundColor: "var(--color-bg-secondary)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "var(--text-sm)",
                        lineHeight: "var(--leading-normal)",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--color-accent)",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        →
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Challenges Section */}
            {frontmatter.challenges.length > 0 && (
              <section style={{ marginBottom: "var(--space-10)" }}>
                <h2
                  style={{
                    fontSize: "var(--text-xl)",
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--space-5)",
                  }}
                >
                  🔧 技术难点与解决
                </h2>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-3)",
                  }}
                >
                  {frontmatter.challenges.map((challenge, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "var(--space-3)",
                        padding: "var(--space-4)",
                        backgroundColor: "var(--color-bg-secondary)",
                        borderRadius: "var(--radius-md)",
                        borderLeft: "3px solid var(--color-warning)",
                        fontSize: "var(--text-sm)",
                        lineHeight: "var(--leading-normal)",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--color-warning)",
                          flexShrink: 0,
                          fontWeight: 700,
                        }}
                      >
                        ⚡
                      </span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 返回首页（跳转模式，非顶部导航） */}
            <div
              style={{
                marginTop: "var(--space-12)",
                paddingTop: "var(--space-8)",
                borderTop: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-6)",
                flexWrap: "wrap",
              }}
            >
              <Button href="/projects" variant="outline" size="sm">
                ← 项目全览
              </Button>
              <Button href="/" variant="ghost" size="sm">
                返回首页
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
