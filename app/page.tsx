import Link from "next/link";
import { HomeHero } from "@/components/home/HomeHero";
import { ModuleEntries } from "@/components/home/ModuleEntries";
import { ProjectCard } from "@/components/project/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { getAllProjects } from "@/lib/content";
import { personalInfo, jobPreference } from "@/data/about";

const CAPABILITIES = [
  {
    title: "企业级 Java 后端",
    desc: "围绕企业礼赠采购平台，把登录、商品、订单、审批、库存与履约拆成清晰的业务边界，使用 Java 21、Spring Boot、MyBatis、MySQL 与 Redis 完成后端实现。",
    icon: (
      <>
        <rect x="4" y="4" width="16" height="5" rx="1" />
        <rect x="4" y="15" width="16" height="5" rx="1" />
        <path d="M8 6.5h.01M8 17.5h.01M12 9v6" />
      </>
    ),
  },
  {
    title: "AI Agent 与 RAG",
    desc: "在销售数据分析 Agent 中使用 LangChain4j 工具编排，在 AegisGift 中结合 Spring AI 与 pgvector，支持规则兜底、流式回答与可追溯知识检索。",
    icon: (
      <>
        <rect x="4" y="7" width="16" height="12" rx="3" />
        <path d="M12 3v4M9 13h.01M15 13h.01M9.5 16.5h5" />
      </>
    ),
  },
  {
    title: "销售数据分析",
    desc: "把订单、产品、区域和人员数据转成排名、趋势、利润与异常信号，通过 ECharts 图表和自然语言问答帮助销售团队快速定位问题。",
    icon: (
      <>
        <path d="M3 3v18h18M8 17v-5M13 17V8M18 17v-9" />
      </>
    ),
  },
  {
    title: "Vue 全栈与工程交付",
    desc: "使用 Vue 3、Pinia、Element Plus 与 SSE 完成业务工作台交互，配合 MDX、GitHub Actions 与静态部署持续交付可验证成果。",
    icon: (
      <>
        <path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.5.4.9 1 .9 1.6V16h5v-.5c0-.6.4-1.2.9-1.6A6 6 0 0012 3z" />
      </>
    ),
  },
];

function CapIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function HomePage() {
  const projects = getAllProjects();
  const featured = projects[0];
  const rest = projects.slice(1, 3);

  return (
    <>
      <HomeHero />

      {/* ── 模块跳转入口：博客 / 项目 / 魔方 ── */}
      <ModuleEntries />

      {/* ── 精选项目 ── */}
      <section style={{ padding: "var(--space-20) 0" }} aria-label="精选项目">
        <div className="container">
          <div className="section-bar reveal">
            <SectionHeading subtitle="每个项目都标注了我的真实角色、技术难点与可验证链接。">
              精选项目
            </SectionHeading>
            <Link href="/projects" className="section-more">
              查看全部
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="projects-grid">
            {featured && (
              <div className="reveal" style={rest.length > 0 ? { gridColumn: "1 / -1" } : undefined}>
                <ProjectCard slug={featured.slug} frontmatter={featured.frontmatter} featured />
              </div>
            )}
            {rest.map((project) => (
              <div className="reveal" key={project.slug}>
                <ProjectCard slug={project.slug} frontmatter={project.frontmatter} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 能力概览 ── */}
      <section className="band-tint" style={{ padding: "var(--space-20) 0" }} aria-label="能力概览">
        <div className="container">
          <div className="reveal">
            <SectionHeading
              align="center"
              subtitle="围绕企业采购平台与销售分析 Agent，持续积累后端架构、AI 应用、数据可视化与工程交付经验。"
            >
              我能做什么
            </SectionHeading>
          </div>

          <div className="cap-grid">
            {CAPABILITIES.map((c) => (
              <article key={c.title} className="cap-card reveal">
                <span className="cap-icon">
                  <CapIcon>{c.icon}</CapIcon>
                </span>
                <h3 className="cap-title">{c.title}</h3>
                <p className="cap-desc">{c.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 结尾 CTA ── */}
      <section className="cta-band" aria-label="求职意向">
        <div className="container cta-inner reveal">
          <div>
            <p className="cta-eyebrow">{jobPreference.availability}</p>
            <h2 className="cta-title">应届求职中 · 期待加入你的团队</h2>
            <p className="cta-desc">
              求职方向：{jobPreference.targetRoles.join(" / ")} ·
              期望城市：{jobPreference.targetCities.join(" / ")}
            </p>
          </div>
          <div className="cta-actions">
            <Button href={personalInfo.resumeFile} download>
              下载简历
            </Button>
            <Button href={personalInfo.github} variant="ghost" className="btn-on-dark" external>
              GitHub
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
