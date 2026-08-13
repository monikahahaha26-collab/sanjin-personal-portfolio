import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content/projects");
const extRegex = new RegExp("\\.(mdx|md)$");

export interface ProjectFrontmatter {
  title: string;
  summary: string;
  cover: string;
  date: string;
  tags: string[];
  role: string;
  period: string;
  features: string[];
  challenges: string[];
  links: {
    demo?: string | null;
    repo?: string | null;
  };
  /** 展示优先级（越小越靠前）。缺省时按 date 倒序。 */
  priority?: number;
  /** 是否仅为演示 Demo（不参与主推排序） */
  demo?: boolean;
  /** 多图轮切：补充截图路径数组（相对 public/ 或绝对 /projects/…） */
  screenshots?: string[];
}

export interface Project {
  slug: string;
  frontmatter: ProjectFrontmatter;
  content: string;
}

export function getAllProjects(): Project[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const projects = files.map((filename) => {
    const slug = filename.replace(extRegex, "");
    const filePath = path.join(contentDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      frontmatter: data as unknown as ProjectFrontmatter,
      content,
    };
  });

  // 排序：优先按 priority 升序；无 priority 的按 date 倒序（最新在前）；demo 项目始终靠后
  return projects.sort((a, b) => {
    const pa = a.frontmatter.priority;
    const pb = b.frontmatter.priority;
    const da = a.frontmatter.demo ? 1 : 0;
    const db = b.frontmatter.demo ? 1 : 0;
    if (da !== db) return da - db; // 非 demo 优先
    if (pa !== undefined && pb !== undefined) return pa - pb;
    if (pa !== undefined) return -1;
    if (pb !== undefined) return 1;
    return (b.frontmatter.date || "").localeCompare(a.frontmatter.date || "");
  });
}

export function getProjectBySlug(slug: string): Project | undefined {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    // Try .md extension
    const mdPath = path.join(contentDir, `${slug}.md`);
    if (!fs.existsSync(mdPath)) return undefined;
  }

  const actualPath = fs.existsSync(filePath) ? filePath : path.join(contentDir, `${slug}.md`);
  const fileContent = fs.readFileSync(actualPath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    frontmatter: data as unknown as ProjectFrontmatter,
    content,
  };
}

export function getAllProjectSlugs(): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(extRegex, ""));
}
