"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";

/**
 * ImageCarousel — 多图轮切换
 * 支持左右箭头、缩略图点选、键盘 ←→、自动计时显示。
 * 单图时隐藏箭头与缩略图。
 */
export function ImageCarousel({
  images,
  alt = "项目截图",
  portrait = false,
}: {
  images: string[];
  alt?: string;
  portrait?: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const slides = useMemo(() => Array.from(new Set(images)), [images]);
  const n = slides.length;

  const prev = useCallback(() => setCurrent((c) => (c - 1 + n) % n), [n]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % n), [n]);

  useEffect(() => {
    if (n <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n, prev, next]);

  useEffect(() => {
    if (n <= 1) return;
    const timer = window.setTimeout(() => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = slides[(current + 1) % n];
    }, 450);
    return () => window.clearTimeout(timer);
  }, [current, n, slides]);

  if (n === 0) return null;

  return (
    <div className="carousel" role="region" aria-label="项目截图轮播">
      <div className={`carousel-viewport${portrait ? " carousel-viewport-portrait" : ""}`}>
        {!loaded[slides[current]] && (
          <span className="carousel-loading" aria-live="polite">
            正在载入第 {current + 1} 张截图…
          </span>
        )}
        <Image
          key={slides[current]}
          className={`carousel-image${loaded[slides[current]] ? " is-loaded" : ""}`}
          src={slides[current]}
          alt={`${alt} · 第 ${current + 1} 张`}
          fill
          sizes="(max-width: 900px) 100vw, 1100px"
          priority={current === 0}
          loading={current === 0 ? undefined : "lazy"}
          fetchPriority={current === 0 ? "high" : "auto"}
          onLoad={() => setLoaded((value) => ({ ...value, [slides[current]]: true }))}
        />

        {n > 1 && (
          <>
            <button
              type="button"
              className="carousel-arrow carousel-prev"
              onClick={prev}
              aria-label="上一张"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className="carousel-arrow carousel-next"
              onClick={next}
              aria-label="下一张"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
            <span className="carousel-counter">
              {current + 1} / {n}
            </span>
          </>
        )}
      </div>

      {n > 1 && (
        <div className="carousel-thumbs" role="tablist" aria-label="选择截图">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`carousel-thumb${i === current ? " is-active" : ""}`}
              onClick={() => setCurrent(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`第 ${i + 1} 张`}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
