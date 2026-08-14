"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const channels = [
  ["AI Applications", "模型、RAG 与可用的产品接口", "ANALOG"],
  ["Embedded Systems", "传感、控制与边缘侧软件", "DIGITAL"],
  ["Projects", "从需求到可验证的交付", "PACKET"],
  ["Off Duty", "追番与游戏，补充输入信号", "MEDIA"],
] as const;

export function HomeHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState(0);
  const [timebase, setTimebase] = useState(1);
  const [armed, setArmed] = useState(true);
  const pointerRef = useRef({ x: 0.55, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let animation = 0;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * scale);
      canvas.height = Math.floor(rect.height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const { width, height } = rect;
      const pointer = pointerRef.current;
      const clock = armed ? frame * 0.014 * timebase : 0;
      context.fillStyle = "#121410";
      context.fillRect(0, 0, width, height);
      context.strokeStyle = "rgba(244,239,218,.11)";
      context.lineWidth = 1;
      for (let x = 0; x <= width; x += 32) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
      for (let y = 0; y <= height; y += 26) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }
      context.setLineDash([3, 5]); context.strokeStyle = "rgba(232,173,48,.35)"; context.beginPath(); context.moveTo(0, height * pointer.y); context.lineTo(width, height * pointer.y); context.stroke(); context.setLineDash([]);
      const drawTrace = (offset: number, color: string, mode: number) => {
        context.strokeStyle = color; context.lineWidth = mode === 1 ? 1.8 : 2.25; context.beginPath();
        for (let x = 0; x <= width; x += 2) {
          const phase = x / width * Math.PI * (3.5 + selected * .55) * timebase + clock + pointer.x * 3;
          const digital = Math.sin(phase * 1.15) > .22 ? 1 : -1;
          const noise = Math.sin(phase * 5.3 + selected) * 4;
          const value = mode === 0 ? Math.sin(phase) * 21 + Math.sin(phase * 2.3) * 8 + noise : digital * 16 + noise * .12;
          const y = height * offset + value;
          if (x === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.stroke();
      };
      drawTrace(.33, "#9fcf72", 0);
      drawTrace(.64, "#e8ad30", 1);
      context.fillStyle = "#f0eee1";
      context.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
      context.fillText("A / INPUT", 10, height * .33 - 28);
      context.fillText("D / CLOCK", 10, height * .64 - 26);
      const markerX = Math.max(24, Math.min(width - 24, pointer.x * width));
      context.strokeStyle = "#e8ad30"; context.lineWidth = 1;
      context.beginPath(); context.moveTo(markerX, 0); context.lineTo(markerX, height); context.stroke();
      context.fillStyle = "#e8ad30"; context.beginPath(); context.moveTo(markerX - 6, 0); context.lineTo(markerX + 6, 0); context.lineTo(markerX, 8); context.fill();
      for (let index = 0; index < 20; index += 1) {
        const bar = 5 + Math.abs(Math.sin(clock * 1.9 + index * .52 + selected)) * 19;
        context.fillStyle = index % 4 === 0 ? "#d86145" : "#9fcf72";
        context.fillRect(width - 14 - index * 7, height - 9 - bar, 4, bar);
      }
      if (!reduced && armed) { frame += 1; animation = requestAnimationFrame(draw); }
    };
    draw();
    const resize = () => { if (reduced || !armed) draw(); };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animation); window.removeEventListener("resize", resize); };
  }, [armed, selected, timebase]);

  return <section className="signal-hero" aria-label="个人信号实验台"><div className="container signal-layout">
    <div className="signal-copy"><p className="console-label"><span className="status-light" /> CHANNEL 00 / PERSONAL PORTFOLIO</p><h1>YOUR<br /><span>SIGNAL</span><br />MATTERS.</h1><p className="signal-intro">电子信息工程专业，面向 <strong>AI 应用开发</strong> 与 <strong>嵌入式</strong> 岗位。把模型、数据和设备端信号做成真正能交付的系统。</p><div className="signal-actions"><Link className="console-button primary" href="/projects">查看项目</Link><a className="console-button" href="#contact">联系我</a></div></div>
    <div className="instrument-rack"><div className="instrument-head"><span><i className={armed ? "armed" : ""} /> LOGIC ANALYZER / M-01</span><span>{armed ? "ACQUIRING" : "HOLD"}</span></div><div className="instrument-readout"><span>CH-{String(selected + 1).padStart(2, "0")}</span><span>{channels[selected][2]}</span><span>{timebase.toFixed(1)}ms/DIV</span></div><canvas ref={canvasRef} className="signal-canvas" onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); pointerRef.current = { x: Math.max(.04, Math.min(.96, (event.clientX - rect.left) / rect.width)), y: Math.max(.1, Math.min(.9, (event.clientY - rect.top) / rect.height)) }; }} />
      <div className="instrument-controls"><button className="trigger-button" onClick={() => setArmed((current) => !current)} aria-pressed={armed}>{armed ? "▣ HOLD TRACE" : "▶ RUN TRACE"}</button><label>TIMEBASE <input type="range" min="0.6" max="1.8" step="0.1" value={timebase} onChange={(event) => setTimebase(Number(event.target.value))} /></label><output>{timebase.toFixed(1)}x</output></div>
      <div className="channel-list" role="tablist" aria-label="信号频道">{channels.map(([title, description], index) => <button key={title} className={selected === index ? "active" : ""} onClick={() => setSelected(index)} role="tab" aria-selected={selected === index}><span>{String(index + 1).padStart(2, "0")}</span><b>{title}</b><small>{description}</small></button>)}</div>
    </div>
  </div></section>;
}
