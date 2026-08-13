import { Metadata } from "next";
import { CubeTimer } from "@/components/cube/CubeTimer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Link from "next/link";

export const metadata: Metadata = {
  title: "魔方计时器",
  description:
    "魔方速拧计时器：WCA 标准打乱算法生成、精确计时、avg5 / avg12 统计与历史记录。",
};

export default function HobbiesCubePage() {
  return (
    <section className="cube-page" aria-label="魔方计时器">
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto var(--space-8)" }}>
        <Link
          href="/hobbies"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
            textDecoration: "none",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          返回兴趣爱好
        </Link>
      </div>

      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
        <SectionHeading
          align="center"
          subtitle={'速拧计时器：生成 WCA 打乱 → 点击 / 空格开始 → 再次触发停止，自动记录成绩与统计。'}
        >
          ⏱️ 魔方计时器
        </SectionHeading>

        <CubeTimer />

        <div
          style={{
            marginTop: "var(--space-16)",
            paddingTop: "var(--space-8)",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-4)",
            flexWrap: "wrap",
          }}
        >
          <Link className="btn btn-outline" href="/hobbies/books">
            去读书
          </Link>
          <Link className="btn btn-outline" href="/hobbies/games">
            去游戏
          </Link>
          <Link className="btn btn-ghost" href="/hobbies/movies">
            去看影视
          </Link>
        </div>
      </div>
    </section>
  );
}
