"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/**
 * PageTransition — 路由切换时的淡入过渡
 * 以 pathname 为 key 重挂载内容，配合 CSS 动画实现「跳转模式」的顺滑切换感。
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    // 让新页面先挂载再播放动画，避免刷新时重复播放
    const id = requestAnimationFrame(() => setKey(pathname));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");
    let observer: IntersectionObserver | null = null;
    const timer = window.setTimeout(() => {
      const candidates = Array.from(document.querySelectorAll<HTMLElement>([
        ".page-enter .reveal",
        ".page-enter .blog-card",
        ".page-enter .project-card",
        ".page-enter .contact-card",
        ".page-enter .library-card",
        ".page-enter .media-card",
        ".page-enter .timer-stage",
        ".page-enter .profile-header",
        ".page-enter .project-layout",
        ".page-enter .blog-content > *",
      ].join(", ")));
      const elements = candidates.filter((element, index) =>
        candidates.indexOf(element) === index &&
        !candidates.some((other) => other !== element && element.contains(other))
      );
      if (!elements.length) return;

      elements.forEach((element, index) => {
        element.classList.add("motion-reveal");
        element.style.setProperty("--reveal-delay", `${Math.min(index * 70, 420)}ms`);
        if (element.matches(".module-card, .blog-card, .project-card, .contact-card, .library-card, .media-card")) {
          element.classList.add("motion-card", index % 2 ? "motion-from-right" : "motion-from-left");
        }
      });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
        elements.forEach((element) => element.classList.add("is-visible"));
        return;
      }

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
      elements.forEach((element) => observer?.observe(element));
    }, 32);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [pathname, key]);

  return (
    <div key={key} className="page-enter">
      {children}
    </div>
  );
}
