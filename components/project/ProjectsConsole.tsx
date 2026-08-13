"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PortfolioProject } from "@/lib/content";

const categories = ["全部", "AI 应用", "嵌入式", "全栈", "数据", "创意"];

export function ProjectsConsole({ projects }: { projects: PortfolioProject[] }) {
  const [category, setCategory] = useState("全部");
  const [tech, setTech] = useState("全部技术");
  const technologies = useMemo(() => ["全部技术", ...Array.from(new Set(projects.flatMap((project) => project.frontmatter.tags))).slice(0, 16)], [projects]);
  const visible = projects.filter((project) => (category === "全部" || project.category === category) && (tech === "全部技术" || project.frontmatter.tags.includes(tech)));
  return <div className="projects-console">
    <div className="filter-row"><div className="filter-group" aria-label="项目类别">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={category === item ? "selected" : ""}>{item}</button>)}</div><label className="tech-select">TECH STACK<select value={tech} onChange={(event) => setTech(event.target.value)}>{technologies.map((item) => <option key={item}>{item}</option>)}</select></label></div>
    <p className="data-count">DISPLAYING {String(visible.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} REPOSITORIES</p>
    <div className="project-console-grid">{visible.map((project) => <article key={project.repoName} className="repo-card">
      <div className="repo-card-top"><span className="category-mark">{project.category}</span><span>{project.updatedAt.slice(0, 10)}</span></div>
      <h2>{project.frontmatter.title}</h2><p>{project.frontmatter.summary}</p>
      <div className="repo-tags">{project.frontmatter.tags.slice(0, 5).map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="repo-card-bottom"><span>{project.language || "Source"}</span><Link href={`/projects/${project.slug}`}>打开档案 <b>+</b></Link></div>
    </article>)}</div>
    {!visible.length && <div className="empty-console">没有匹配的项目。请切换过滤条件。</div>}
  </div>;
}
