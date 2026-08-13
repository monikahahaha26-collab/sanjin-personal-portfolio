"use client";

import Link from "next/link";
import { useRef, type CSSProperties, type PointerEvent } from "react";
import { PixelWord } from "./PixelWord";
import { PaintedCube } from "./PaintedCube";

/**
 * HomeHero — 新首页首屏
 * 像素风 SANJIN 点阵标识 + 页面四周彩绘魔方装饰（废弃原 Agent 屏幕方案）。
 * 跳转入口为内容中的按钮（非顶部导航栏），与「模块跳转」交互模式一致。
 */

const CUBE_DECOS = [
  { palette: "classic" as const, order: 2, size: 64, top: "7%", left: "4%", tilt: -18, floatDelay: "0s", spin: false, opacity: 0.5, depth: -0.55 },
  { palette: "sunset" as const, order: 3, size: 46, top: "16%", right: "6%", tilt: 22, floatDelay: "0.8s", spin: false, opacity: 0.45, depth: 0.35 },
  { palette: "galaxy" as const, order: 4, size: 54, top: "48%", left: "2.5%", tilt: 30, floatDelay: "1.6s", spin: false, opacity: 0.4, depth: -0.3 },
  { palette: "sunset" as const, order: 5, size: 40, top: "58%", right: "3%", tilt: -24, floatDelay: "2.2s", spin: false, opacity: 0.4, depth: 0.5 },
  { palette: "galaxy" as const, order: 6, size: 62, bottom: "4%", left: "7%", tilt: 14, floatDelay: "0.4s", spin: true, opacity: 0.45, depth: -0.4 },
  { palette: "classic" as const, order: 7, size: 50, bottom: "6%", right: "8%", tilt: -14, floatDelay: "1.2s", spin: true, opacity: 0.5, depth: 0.3 },
];

export function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (
      event.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 22;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
    event.currentTarget.style.setProperty("--pointer-x", `${x}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${y}px`);
  };

  const resetPointer = () => {
    heroRef.current?.style.setProperty("--pointer-x", "0px");
    heroRef.current?.style.setProperty("--pointer-y", "0px");
  };

  return (
    <section
      ref={heroRef}
      className="home-hero"
      aria-label="站点标识"
      onPointerMove={onPointerMove}
      onPointerLeave={resetPointer}
    >
      {/* 四周彩绘魔方装饰 */}
      {CUBE_DECOS.map((d, i) => {
        const style: CSSProperties = {
          opacity: d.opacity,
          ["--depth" as string]: d.depth,
        };
        if (d.top !== undefined) style.top = d.top;
        if (d.bottom !== undefined) style.bottom = d.bottom;
        if (d.left !== undefined) style.left = d.left;
        if (d.right !== undefined) style.right = d.right;
        return (
          <div
            key={i}
            className={`cube-deco${d.left !== undefined ? " cube-deco-l" : ""}`}
            style={style}
          >
            <div
              className={d.spin ? "cube-float-spin" : "cube-float"}
              style={{
                animationDelay: d.floatDelay,
                ["--tilt" as string]: `${d.tilt}deg`,
              }}
            >
          <PaintedCube palette={d.palette} order={d.order as 2 | 3 | 4 | 5 | 6 | 7} size={d.size} />
            </div>
          </div>
        );
      })}

      <div className="home-hero-inner">
        <p className="hero-eyebrow-pixel">
          <span className="hero-eyebrow-dot" aria-hidden="true" />
          SANJIN · Personal Portfolio
        </p>

        <h1 className="sr-only">SANJIN 个人作品集</h1>
        <PixelWord text="SANJIN" />

        <p className="hero-pixel-title">站点归属 · SANJIN</p>

        <p className="hero-sub">
          你好，我是 <strong>SANJIN</strong>，一名<strong>应届毕业生</strong>。
          这里整合了我的 <strong>博客</strong>、<strong>作品项目</strong> 与{" "}
          <strong>兴趣爱好</strong> 三个模块 —— 点击下方入口，随时切换探索。
        </p>

        <div className="hero-actions">
          <Link className="btn btn-primary" href="/projects">
            浏览项目
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link className="btn btn-outline" href="/blog">
            阅读博客
          </Link>
          <Link className="btn btn-ghost" href="/hobbies">
            兴趣爱好
          </Link>
        </div>

        <p className="hero-hint">SCROLL · 三个模块等你去探索</p>
      </div>
    </section>
  );
}
