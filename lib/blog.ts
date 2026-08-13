import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogDir = path.join(process.cwd(), "content/blogs");

export interface BlogFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(blogDir)) return [];

  const files = fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.(mdx|md)$/, "");
    const filePath = path.join(blogDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      frontmatter: data as unknown as BlogFrontmatter,
      content,
    };
  });

  return posts.sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const mdxPath = path.join(blogDir, `${slug}.mdx`);
  const mdPath = path.join(blogDir, `${slug}.md`);
  const actualPath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;
  if (!actualPath) return undefined;

  const fileContent = fs.readFileSync(actualPath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    frontmatter: data as unknown as BlogFrontmatter,
    content,
  };
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(blogDir)) return [];
  return fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.(mdx|md)$/, ""));
}
