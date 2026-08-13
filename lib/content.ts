import fs from "fs";
import path from "path";
import matter from "gray-matter";
import repoCache from "@/data/github-repos.json";
import { portfolioConfig, projectOverrides, type ProjectCategory } from "@/data/project-overrides";

const contentDir = path.join(process.cwd(), "content/projects");
const extRegex = new RegExp("\\.(mdx|md)$");

export interface ProjectFrontmatter {
  title: string; summary: string; cover?: string; date: string; tags: string[]; role: string; period: string;
  features: string[]; challenges: string[]; links: { demo?: string | null; repo?: string | null }; priority?: number; demo?: boolean; screenshots?: string[];
}
export interface Project { slug: string; frontmatter: ProjectFrontmatter; content: string }
export interface PortfolioProject extends Project {
  repoName: string; githubUrl: string; language?: string | null; topics: string[]; updatedAt: string; category: ProjectCategory; featured?: number; homepage?: string;
}
type CachedRepo = { name: string; description?: string | null; html_url: string; language?: string | null; topics?: string[]; updated_at: string; homepage?: string | null };

function readMdxProjects(): Project[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs.readdirSync(contentDir).filter((file) => extRegex.test(file)).map((filename) => {
    const { data, content } = matter(fs.readFileSync(path.join(contentDir, filename), "utf-8"));
    return { slug: filename.replace(extRegex, ""), frontmatter: data as ProjectFrontmatter, content };
  });
}

function categoryFromRepo(repo: CachedRepo): ProjectCategory {
  const signal = `${repo.name} ${repo.description ?? ""} ${(repo.topics ?? []).join(" ")}`.toLowerCase();
  if (/ai|agent|rag|gout/.test(signal)) return "AI 应用";
  if (/data|analytics|sentiment/.test(signal)) return "数据";
  if (/game|ember|archive/.test(signal)) return "创意";
  return "全栈";
}

export function getAllProjects(): PortfolioProject[] {
  const mdx = readMdxProjects();
  const bySlug = new Map(mdx.map((item) => [item.slug, item]));
  const caches = repoCache as CachedRepo[];
  const repos = caches.filter((repo) => !portfolioConfig.excludedRepos.includes(repo.name));
  return repos.map((repo) => {
    const override = projectOverrides[repo.name];
    const enhanced = override?.mdxSlug ? bySlug.get(override.mdxSlug) : undefined;
    const fallback: ProjectFrontmatter = {
      title: repo.name, summary: repo.description || "暂无仓库描述。", cover: undefined, date: repo.updated_at.slice(0, 7), tags: [repo.language, ...(repo.topics ?? [])].filter(Boolean) as string[], role: "独立开发", period: repo.updated_at.slice(0, 7), features: [], challenges: [], links: { repo: repo.html_url, demo: repo.homepage || undefined },
    };
    return { slug: override?.mdxSlug ?? repo.name, frontmatter: enhanced?.frontmatter ?? fallback, content: enhanced?.content ?? "", repoName: repo.name, githubUrl: repo.html_url, language: repo.language, topics: repo.topics ?? [], updatedAt: repo.updated_at, category: override?.category ?? categoryFromRepo(repo), featured: override?.featured, homepage: override?.demo ?? repo.homepage ?? undefined };
  }).sort((a, b) => (a.featured ?? 999) - (b.featured ?? 999) || b.updatedAt.localeCompare(a.updatedAt));
}

export function getFeaturedProjects() { return getAllProjects().filter((project) => project.featured).slice(0, 4); }
export function getProjectBySlug(slug: string) { return getAllProjects().find((project) => project.slug === slug || project.repoName === slug); }
export function getAllProjectSlugs() { return getAllProjects().map((project) => project.slug); }
