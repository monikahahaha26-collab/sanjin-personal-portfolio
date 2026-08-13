import { Metadata } from "next";
import { ProjectsBoard, type MdxProjectMeta } from "@/components/project/ProjectsBoard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAllProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "项目",
  description:
    "个人项目作品集：企业礼赠采购平台、销售数据分析 Agent、微博舆情分析、微信小程序、网页游戏与 Java Web 实践。",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  const mdxProjects: MdxProjectMeta[] = projects.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    summary: p.frontmatter.summary,
    cover: p.frontmatter.cover,
    date: p.frontmatter.date,
    tags: p.frontmatter.tags,
    role: p.frontmatter.role,
    period: p.frontmatter.period,
    demo: p.frontmatter.links?.demo ?? null,
    repo: p.frontmatter.links?.repo ?? null,
    priority: p.frontmatter.priority,
    isDemo: p.frontmatter.demo === true,
  }));

  return (
    <section
      style={{
        padding: "var(--space-16) var(--space-6)",
        minHeight: "60vh",
      }}
      aria-label="项目列表"
    >
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
        <SectionHeading
          subtitle="按技术难度与功能完整性排序展示，优先收录企业采购平台与 AI 数据分析 Agent；点击项目进入详情查看技术架构、业务边界与运行截图。"
        >
          全部项目
        </SectionHeading>

        <ProjectsBoard mdxProjects={mdxProjects} />
      </div>
    </section>
  );
}
