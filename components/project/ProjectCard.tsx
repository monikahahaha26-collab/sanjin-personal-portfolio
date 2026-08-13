"use client";

import Link from "next/link";
import Image from "next/image";
import { Tag } from "@/components/ui/Tag";
import type { ProjectFrontmatter } from "@/lib/content";

interface ProjectCardProps {
  slug: string;
  frontmatter: ProjectFrontmatter;
  featured?: boolean;
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function ProjectCard({ slug, frontmatter, featured = false }: ProjectCardProps) {
  const coverUrl = frontmatter.cover
    ? `${frontmatter.cover.startsWith("/") ? BASE : ""}${frontmatter.cover}`
    : undefined;

  const hasDemo = frontmatter.links?.demo;
  const hasRepo = frontmatter.links?.repo;

  return (
    <div
      style={{
        borderRadius: featured ? "var(--radius-xl)" : "var(--radius-lg)",
        overflow: "hidden",
        backgroundColor: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border)",
        transition:
          "transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out), border-color var(--duration-normal) var(--ease-out)",
      }}
      className="project-card"
    >
      {/* Cover Image — clickable to detail page */}
      <Link
        href={`/projects/${slug}`}
        style={{
          display: "block",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div
          className="project-card-media"
          style={{
            width: "100%",
            aspectRatio: featured ? "16 / 9" : "16 / 10",
            backgroundColor: "var(--color-bg-tertiary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {coverUrl && (
            <Image
              src={coverUrl}
              alt={`${frontmatter.title} 项目封面`}
              fill
              sizes={featured ? "(max-width: 820px) 100vw, 1200px" : "(max-width: 820px) 100vw, 50vw"}
              priority={featured}
              loading={featured ? undefined : "lazy"}
              fetchPriority={featured ? "high" : "auto"}
              style={{ objectFit: "cover" }}
            />
          )}
          {!frontmatter.cover && (
            <span
              style={{
                fontSize: featured ? "3rem" : "2rem",
                color: "var(--color-text-muted)",
              }}
              aria-hidden="true"
            >
              📁
            </span>
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)",
              opacity: 0,
              transition: "opacity var(--duration-normal) var(--ease-out)",
            }}
            className="card-overlay"
          />
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: featured ? "var(--space-6)" : "var(--space-5)" }}>
        {/* Role & Period */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            marginBottom: "var(--space-3)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
          }}
        >
          <Tag size="sm">{frontmatter.role}</Tag>
          <span>{frontmatter.period}</span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: featured ? "var(--text-xl)" : "var(--text-lg)",
            fontWeight: 700,
            color: "var(--color-text-primary)",
            margin: "0 0 var(--space-3) 0",
            lineHeight: "var(--leading-tight)",
          }}
        >
          {frontmatter.title}
        </h3>

        {/* Summary */}
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-secondary)",
            lineHeight: "var(--leading-normal)",
            margin: "0 0 var(--space-4) 0",
            display: featured ? "-webkit-box" : undefined,
            WebkitLineClamp: featured ? 3 : undefined,
            WebkitBoxOrient: featured ? "vertical" as const : undefined,
            overflow: featured ? "hidden" : undefined,
          }}
        >
          {frontmatter.summary}
        </p>

        {/* Tech Tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-2)",
            marginBottom: hasDemo || hasRepo ? "var(--space-4)" : "0",
          }}
        >
          {frontmatter.tags.slice(0, 4).map((tag) => (
            <Tag key={tag} variant="outline" size="sm">
              {tag}
            </Tag>
          ))}
          {frontmatter.tags.length > 4 && (
            <Tag variant="outline" size="sm">
              {`+${frontmatter.tags.length - 4}`}
            </Tag>
          )}
        </div>

        {/* Action Links: Demo + GitHub */}
        {(hasDemo || hasRepo) && (
          <div
            style={{
              display: "flex",
              gap: "var(--space-2)",
              paddingTop: "var(--space-3)",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            {hasDemo && (
              <a
                href={`${frontmatter.links!.demo!.startsWith("/") ? BASE : ""}${frontmatter.links!.demo!}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  color: "#fff",
                  background: "var(--color-accent)",
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "var(--color-accent-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    "var(--color-accent)")
                }
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                体验链接
              </a>
            )}
            {hasRepo && (
              <a
                href={frontmatter.links!.repo!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  background: "var(--color-bg-tertiary)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  transition: "border-color 0.15s ease, background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-accent)";
                  e.currentTarget.style.background =
                    "var(--color-accent-subtle)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-border)";
                  e.currentTarget.style.background =
                    "var(--color-bg-tertiary)";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825.255.825-.55 0-.18-.005-.66-.015-1.995 2.82-.68 3.78-1.355 3.78-3.04 0-.66-.225-1.23-.585-1.71 1.26-.155 2.59-.63 2.59-2.81 0-.62-.22-1.12-.585-1.51.13-.32.56-1.61.07-3.24-.57-.065-1.17-.28-1.59-.53-.65.69-1.04 1.67-1.04 2.85 0 .42.16.79.43 1.09.08-.08.36-.155.6-.46 1.47.115 1.83.62 1.83 2.73 0 2.07-1.305 3.75-3.03 3.91.24.195.45.57.45 1.16v2.88c0 .3.195.54.48.54C18.9 22.5 24 17.72 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
