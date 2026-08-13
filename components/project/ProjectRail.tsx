import Link from "next/link";
import { getAllProjects } from "@/lib/content";

/**
 * ProjectRail — 项目详情页左侧侧边栏
 * 使用轻量编号标识、项目名与技术标签建立清晰导航，不额外下载项目封面。
 * 移动端自动折叠为横向滚动列表。
 */

export function ProjectRail({ currentSlug }: { currentSlug: string }) {
  const others = getAllProjects().filter((p) => p.slug !== currentSlug);
  const current = getAllProjects().find((p) => p.slug === currentSlug);

  return (
    <aside className="project-rail" aria-label="其他项目">
      <Link href="/projects" className="rail-back">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        返回项目全览
      </Link>

      <div className="rail-current">
        <span>正在查看</span>
        <b>{current?.frontmatter.title ?? currentSlug}</b>
      </div>

      <h4 className="rail-title">继续浏览 · {String(others.length).padStart(2, "0")}</h4>

      {others.length === 0 ? (
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: 0 }}>
          暂无其他项目
        </p>
      ) : (
        <nav className="rail-list" aria-label="跳转到其他项目">
          {others.map((p, index) => {
            return (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="rail-item"
                aria-label={p.frontmatter.title}
              >
                <span className="rail-thumb" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </span>
                <span className="rail-item-text">
                  <span className="rail-name">{p.frontmatter.title}</span>
                  <span className="rail-role">{p.frontmatter.tags.slice(0, 2).join(" · ")}</span>
                </span>
                <svg className="rail-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            );
          })}
        </nav>
      )}
    </aside>
  );
}
