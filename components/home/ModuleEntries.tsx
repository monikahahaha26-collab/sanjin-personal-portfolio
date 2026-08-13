import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";

/**
 * ModuleEntries — 首页模块跳转入口（博客 / 项目 / 魔方）
 * 以内容卡片作为跳转入口（非顶部导航栏），路由切换式跳转。
 */

const MODULES = [
  {
    href: "/blog",
    title: "博客 · 随笔",
    desc: "日记与随笔：记录技术实践和日常思考，支持图文混排并按时间倒序展示。",
    icon: "📝",
    bg: "var(--color-accent-subtle)",
    glow: "rgba(194, 65, 12, 0.12)",
    tags: ["随笔", "图文混排"],
  },
  {
    href: "/projects",
    title: "项目",
    desc: "个人项目与课程设计作品集，记录可验证的项目背景、实现内容与技术学习过程。",
    icon: "🧩",
    bg: "var(--color-bg-secondary)",
    glow: "rgba(37, 99, 235, 0.1)",
    tags: ["数据分析", "AI 应用", "课程设计"],
  },
  {
    href: "/hobbies",
    title: "兴趣爱好",
    desc: "魔方工坊、游戏存档室、读书与影视记录 —— 代码之外的日常。",
    icon: "🎲",
    bg: "var(--color-accent-subtle)",
    glow: "rgba(22, 163, 74, 0.1)",
    tags: ["魔方", "游戏", "读书", "影视"],
  },
];

export function ModuleEntries() {
  return (
    <section className="band-tint" style={{ padding: "var(--space-20) 0" }} aria-label="模块入口">
      <div className="container">
        <div className="reveal">
          <SectionHeading
            align="center"
            subtitle="一个站点，三个方向：技术随笔、项目实践与个人爱好。点击卡片即可切换。"
          >
            探索模块
          </SectionHeading>
        </div>

        <div className="module-grid">
          {MODULES.map((m) => (
            <Link key={m.href} href={m.href} className="module-card module-entry-card reveal" style={{ ["--card-glow" as string]: m.glow }}>
              <div className="module-card-top">
                <span className="module-icon" style={{ background: m.bg }} aria-hidden="true">
                  {m.icon}
                </span>
                <span className="module-go" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
              <div className="module-meta">
                {m.tags.map((t) => (
                  <Tag key={t} variant="outline" size="sm">
                    {t}
                  </Tag>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
