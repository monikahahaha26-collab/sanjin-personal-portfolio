import { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "兴趣爱好",
  description: "魔方工坊、游戏、读书与影视记录 —— 代码之外的日常。",
};

const ITEMS = [
  {
    href: "/hobbies/cube",
    title: "魔方工坊",
    desc: "可拖拽旋转、真实层转动打乱的 3D 魔方，支持三套配色。",
    icon: "🎲",
    bg: "var(--color-accent-subtle)",
    glow: "rgba(22, 163, 74, 0.1)",
    featured: true,
    label: "FEATURED · SPEEDCUBING",
  },
  {
    href: "/hobbies/books",
    title: "读书",
    desc: "记录在读与已读书目：书名、作者、阅读状态、评分与短评。",
    icon: "📚",
    bg: "var(--color-bg-secondary)",
    glow: "rgba(194, 65, 12, 0.1)",
    label: "PERSONAL LIBRARY",
  },
  {
    href: "/hobbies/movies",
    title: "影视",
    desc: "记录看过的电影与剧集：名称、观看状态、评分与短评。",
    icon: "🎬",
    bg: "var(--color-accent-subtle)",
    glow: "rgba(37, 99, 235, 0.1)",
    label: "SCREENING ROOM",
  },
  {
    href: "/hobbies/games",
    title: "游戏存档室",
    desc: "收纳 Steam、手机与主机游戏，记录平台、进度、评分和每一次通关后的感受。",
    icon: "🎮",
    bg: "#E8F7C7",
    glow: "rgba(163, 230, 53, 0.16)",
    label: "STEAM · MOBILE · CONSOLE",
  },
];

export default function HobbiesPage() {
  return (
    <section
      style={{ padding: "var(--space-16) var(--space-6)", minHeight: "60vh" }}
      aria-label="兴趣爱好"
    >
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
        <div
          style={{ maxWidth: "var(--container-narrow)", margin: "0 auto var(--space-8)" }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              marginBottom: "var(--space-8)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            返回首页
          </Link>
          <SectionHeading
            align="center"
            subtitle="代码之外，也热爱转动、游玩与记录 —— 四个子模块随点随到。"
          >
            🧩 兴趣爱好
          </SectionHeading>
        </div>

        <div className="module-grid hobbies-module-grid">
          {ITEMS.map((m) => (
            <Link key={m.href} href={m.href} className={`module-card hobbies-module-card reveal${m.featured ? " module-card-featured" : ""}`} style={{ ["--card-glow" as string]: m.glow }}>
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
              <span className="hobbies-module-label">{m.label}</span>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
