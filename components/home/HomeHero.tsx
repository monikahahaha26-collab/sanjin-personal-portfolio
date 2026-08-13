"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const channels = [
  ["AI Applications", "模型、RAG 与可用的产品接口"],
  ["Embedded Systems", "传感、控制与边缘侧软件"],
  ["Projects", "从需求到可验证的交付"],
  ["Off Duty", "追番与游戏，补充输入信号"],
] as const;

export function HomeHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState(0);
  const [pointer, setPointer] = useState(0.45);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * scale; canvas.height = rect.height * scale;
      context.scale(scale, scale);
      const { width, height } = rect;
      context.fillStyle = "#171815"; context.fillRect(0, 0, width, height);
      context.strokeStyle = "rgba(241,238,223,.12)"; context.lineWidth = 1;
      for (let x = 0; x < width; x += 28) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
      for (let y = 0; y < height; y += 28) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }
      context.strokeStyle = "#9ac66d"; context.lineWidth = 2; context.beginPath();
      for (let x = 0; x <= width; x += 3) {
        const phase = x / width * Math.PI * (4 + selected) + pointer * Math.PI * 2;
        const amplitude = 21 + selected * 6;
        const y = height * .52 + Math.sin(phase) * amplitude + Math.sin(phase * 3.1) * 7;
        if (x === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
      const markerX = pointer * width;
      context.fillStyle = "#e5aa35"; context.fillRect(markerX - 3, 12, 6, height - 24);
    };
    draw(); window.addEventListener("resize", draw); return () => window.removeEventListener("resize", draw);
  }, [pointer, selected]);

  return <section className="signal-hero" aria-label="个人信号监视器">
    <div className="container signal-layout">
      <div className="signal-copy">
        <p className="console-label"><span className="status-light" /> CHANNEL 00 / PERSONAL PORTFOLIO</p>
        <h1>YOUR<br /><span>SIGNAL</span><br />MATTERS.</h1>
        <p className="signal-intro">电子信息工程专业，面向 <strong>AI 应用开发</strong> 与 <strong>嵌入式</strong> 岗位。关注一段技术链路如何从输入、处理到稳定输出。</p>
        <div className="signal-actions"><Link className="console-button primary" href="/projects">查看项目</Link><a className="console-button" href="#contact">联系我</a></div>
      </div>
      <div className="monitor-shell">
        <div className="monitor-header"><span>Signal Monitor / Live Input</span><span>CH-{String(selected + 1).padStart(2, "0")}</span></div>
        <canvas ref={canvasRef} className="signal-canvas" onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setPointer(Math.max(.04, Math.min(.96, (event.clientX - rect.left) / rect.width))); }} />
        <div className="channel-list" role="tablist" aria-label="信号频道">
          {channels.map(([title, description], index) => <button key={title} className={selected === index ? "active" : ""} onClick={() => setSelected(index)} role="tab" aria-selected={selected === index}><span>{String(index + 1).padStart(2, "0")}</span><b>{title}</b><small>{description}</small></button>)}
        </div>
      </div>
    </div>
  </section>;
}
