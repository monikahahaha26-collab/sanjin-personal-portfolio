import { Metadata } from "next";
import { BlogBoard, type MdxPostMeta } from "@/components/blog/BlogBoard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "博客",
  description: "日记 / 随笔性质的技术笔记与日常记录。",
};

export default function BlogPage() {
  const posts = getAllPosts();

  const mdxPosts: MdxPostMeta[] = posts.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    date: p.frontmatter.date,
    excerpt: p.frontmatter.excerpt,
    tags: p.frontmatter.tags,
  }));

  return (
    <section
      style={{
        padding: "var(--space-16) var(--space-6)",
        minHeight: "60vh",
      }}
      aria-label="博客列表"
    >
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
        <SectionHeading
          subtitle="记录技术实践与日常思考：从像素视觉、静态站点到设计系统的心得，按时间倒序更新。"
        >
          博客 · 随笔
        </SectionHeading>

        <BlogBoard mdxPosts={mdxPosts} />
      </div>
    </section>
  );
}
