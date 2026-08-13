"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * CubeTimer — 魔方速拧计时器（cstimer 风格，含 WCA 观察阶段）
 * 支持 2×2×2 ~ 7×7×7 全部 WCA 正阶：
 * 2(20步) / 3(25步) / 4(40步+宽转) / 5(60步+宽转) / 6(80步+宽转) / 7(100步+宽转+3宽转)
 * 交互（空格键与鼠标一致）：按→观察(15s倒计时) / 松开→计时 / 再按→停止，观察超时标记 +2
 * 历史与统计按当前阶数过滤，localStorage 持久化。
 */

const INSPECTION_LIMIT = 15000; // 观察上限 15s
const MIN_HOLD = 250; // 防误触：至少按住 250ms 才开始
const LS_KEY = "sanjin:solves";

interface SolveRecord {
  t: number; // 还原用时 ms
  s: string; // 打乱序列
  i: number; // 观察时长 ms
  size: number; // 阶数 2~7
  penalty?: "+2" | "DNF";
}

type Phase = "idle" | "inspecting" | "running" | "stopped";

/** WCA 各阶打乱配置：步数 / 可用面 / 是否宽转 / 是否 3 宽转 */
const CFG: Record<number, { moves: number; faces: string[]; wide: boolean; triple: boolean }> = {
  2: { moves: 20, faces: ["U", "R", "F"], wide: false, triple: false },
  3: { moves: 25, faces: ["U", "D", "L", "R", "F", "B"], wide: false, triple: false },
  4: { moves: 40, faces: ["U", "D", "L", "R", "F", "B"], wide: true, triple: false },
  5: { moves: 60, faces: ["U", "D", "L", "R", "F", "B"], wide: true, triple: false },
  6: { moves: 80, faces: ["U", "D", "L", "R", "F", "B"], wide: true, triple: true },
  7: { moves: 100, faces: ["U", "D", "L", "R", "F", "B"], wide: true, triple: true },
};

const AXIS: Record<string, string> = {
  U: "y", D: "y", L: "x", R: "x", F: "z", B: "z",
  Uw: "y", Dw: "y", Lw: "x", Rw: "x", Fw: "z", Bw: "z",
  "3Uw": "y", "3Dw": "y", "3Lw": "x", "3Rw": "x", "3Fw": "z", "3Bw": "z",
};
const SUFFIX = ["", "'", "2"] as const;

function generateScramble(size: number): string {
  const cfg = CFG[size];
  const pool = [...cfg.faces];
  if (cfg.wide) pool.push("Uw", "Dw", "Lw", "Rw", "Fw", "Bw");
  if (cfg.triple) pool.push("3Uw", "3Dw", "3Lw", "3Rw", "3Fw", "3Bw");
  const moves: string[] = [];
  let prevMove = "";
  let prevAxis = "";
  for (let i = 0; i < cfg.moves; i++) {
    let move = "";
    while (true) {
      move = pool[Math.floor(Math.random() * pool.length)];
      if (move === prevMove) continue;
      if (AXIS[move] === prevAxis) continue;
      break;
    }
    moves.push(move + SUFFIX[Math.floor(Math.random() * SUFFIX.length)]);
    prevMove = move;
    prevAxis = AXIS[move];
  }
  return moves.join(" ");
}

function formatTime(ms: number): string {
  if (ms < 0) return "0.00";
  const s = ms / 1000;
  if (s < 60) return s.toFixed(2);
  const m = Math.floor(s / 60);
  return `${m}:${(s - m * 60).toFixed(2).padStart(5, "0")}`;
}

function formatInspection(ms: number, penalty?: string): string {
  return penalty ?? `${(ms / 1000).toFixed(1)}s`;
}

function trimmedAvg(times: number[]): number | null {
  if (times.length < 3) return null;
  const sorted = [...times].sort((a, b) => a - b);
  const inner = sorted.slice(1, -1);
  return inner.reduce((a, b) => a + b, 0) / inner.length;
}

function stdev(times: number[]): number | null {
  if (times.length < 2) return null;
  const mean = times.reduce((a, b) => a + b, 0) / times.length;
  const sq = times.reduce((a, b) => a + (b - mean) ** 2, 0) / times.length;
  return Math.sqrt(sq);
}

function readHistory(): SolveRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SolveRecord[];
    return Array.isArray(parsed)
      ? parsed.filter((x) => typeof x?.t === "number").map((x) => ({ ...x, size: x.size || 3 }))
      : [];
  } catch {
    return [];
  }
}
function writeHistory(recs: SolveRecord[]) {
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(recs));
  } catch {
    /* ignore */
  }
}

const SIZES = [2, 3, 4, 5, 6, 7];

export function CubeTimer() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [inspectionMs, setInspectionMs] = useState(0);
  const [size, setSize] = useState(3);
  const [scramble, setScramble] = useState<string>(() => generateScramble(3));
  const [history, setHistory] = useState<SolveRecord[]>([]);

  const phaseRef = useRef<Phase>("idle");
  const pressStartRef = useRef<number | null>(null);
  const inspectionStartRef = useRef<number | null>(null);
  const solveStartRef = useRef<number | null>(null);
  const rafRef = useRef(0);

  const setPhaseBoth = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = performance.now();
      if (phaseRef.current === "inspecting" && inspectionStartRef.current !== null) {
        setInspectionMs(now - inspectionStartRef.current);
      } else if (phaseRef.current === "running" && solveStartRef.current !== null) {
        setElapsed(now - solveStartRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const stop = () => {
    if (solveStartRef.current === null) return;
    const now = performance.now();
    const t = now - solveStartRef.current;
    const i = inspectionStartRef.current !== null ? now - inspectionStartRef.current : 0;
    const penalty = i > INSPECTION_LIMIT ? ("+2" as const) : undefined;
    solveStartRef.current = null;
    inspectionStartRef.current = null;
    pressStartRef.current = null;
    setElapsed(t);
    setPhaseBoth("stopped");
    const rec: SolveRecord = { t, s: scramble, i, size, penalty };
    const next = [rec, ...history];
    setHistory(next);
    writeHistory(next);
    setScramble(generateScramble(size));
  };

  const startInspection = () => {
    const now = performance.now();
    inspectionStartRef.current = now;
    pressStartRef.current = now;
    setInspectionMs(0);
    setPhaseBoth("inspecting");
  };

  const beginSolve = () => {
    const now = performance.now();
    if (pressStartRef.current !== null && now - pressStartRef.current < MIN_HOLD) {
      pressStartRef.current = null;
      return;
    }
    solveStartRef.current = now;
    setElapsed(0);
    setPhaseBoth("running");
  };

  const onDown = () => {
    const p = phaseRef.current;
    if (p === "idle" || p === "stopped") {
      startInspection();
    } else if (p === "inspecting") {
      pressStartRef.current = performance.now();
    } else if (p === "running") {
      stop();
    }
  };
  const onUp = () => {
    if (phaseRef.current === "inspecting") beginSolve();
  };

  const onPointerDown = () => onDown();
  const onPointerUp = () => onUp();
  const onPointerLeave = () => {
    if (phaseRef.current === "inspecting") onUp();
    else pressStartRef.current = null;
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      e.preventDefault();
      onDown();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      onUp();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, scramble, size]);

  const switchSize = (s: number) => {
    if (s === size) return;
    setSize(s);
    setScramble(generateScramble(s));
    setPhaseBoth("idle");
    setElapsed(0);
    setInspectionMs(0);
  };

  const sizeHistory = useMemo(() => history.filter((h) => h.size === size), [history, size]);

  const stats = useMemo(() => {
    const times = sizeHistory.map((h) => h.t);
    const best = times.length ? Math.min(...times) : null;
    const worst = times.length ? Math.max(...times) : null;
    const avg5 = times.length >= 3 ? trimmedAvg(times.slice(0, 5)) : null;
    const avg12 = times.length >= 3 ? trimmedAvg(times.slice(0, 12)) : null;
    return { best, worst, avg5, avg12, sd: stdev(times), count: times.length };
  }, [sizeHistory]);

  const clearAll = () => {
    if (confirm("确定清空当前阶数的历史记录？")) {
      const next = history.filter((h) => h.size !== size);
      setHistory(next);
      writeHistory(next);
    }
  };
  const removeOne = (idx: number) => {
    const real = sizeHistory[idx];
    const next = history.filter((h) => h !== real);
    setHistory(next);
    writeHistory(next);
  };

  const running = phase === "running";
  const inspecting = phase === "inspecting";
  const penaltyHit = inspecting && inspectionMs > INSPECTION_LIMIT;

  const bigText = inspecting
    ? penaltyHit
      ? "+2"
      : `${Math.max(0, INSPECTION_LIMIT / 1000 - inspectionMs / 1000).toFixed(1)}`
    : formatTime(elapsed);

  const hint =
    phase === "inspecting"
      ? penaltyHit
        ? "观察超时！将标记 +2 罚时"
        : "观察中 —— 松开空格 / 松开鼠标开始还原"
      : phase === "running"
        ? "还原中 —— 按空格 / 点击停止"
        : "按空格或点击：进入观察 → 松开开始计时";

  return (
    <div className="timer-stage">
      {/* 阶数选择（WCA 正阶 2~7） */}
      <div className="timer-sizes" role="group" aria-label="选择魔方阶数">
        {SIZES.map((s) => (
          <button
            key={s}
            type="button"
            className={`chip-btn${size === s ? " chip-btn-active" : ""}`}
            onClick={() => switchSize(s)}
            aria-pressed={size === s}
          >
            {s}×{s}×{s}
          </button>
        ))}
      </div>

      {/* 打乱区 */}
      <div className="timer-scramble">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
          <span className="timer-label">
            打乱序列 · {size}×{size}×{size}（WCA {CFG[size].moves} 步）
          </span>
          <button className="btn btn-outline btn-sm" onClick={() => setScramble(generateScramble(size))} aria-label="生成新打乱">
            ↻ 新打乱
          </button>
        </div>
        <p className="timer-scramble-text" aria-live="polite">
          {scramble}
        </p>
      </div>

      {/* 计时器主体 */}
      <button
        type="button"
        className={`timer-display${running ? " is-running" : ""}${inspecting ? " is-inspecting" : ""}${penaltyHit ? " is-penalty" : ""}`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
        aria-label="按空格或点击控制计时"
      >
        <span className="timer-time">{bigText}</span>
        <span className="timer-hint">{hint}</span>
      </button>

      {/* 统计行 */}
      <div className="timer-stats">
        <div className="timer-stat"><b>{stats.count}</b><span>{size}×{size}×{size} 次数</span></div>
        <div className="timer-stat"><b>{stats.best !== null ? formatTime(stats.best) : "—"}</b><span>最快</span></div>
        <div className="timer-stat"><b>{stats.avg5 !== null ? formatTime(stats.avg5) : "—"}</b><span>Avg5</span></div>
        <div className="timer-stat"><b>{stats.avg12 !== null ? formatTime(stats.avg12) : "—"}</b><span>Avg12</span></div>
        <div className="timer-stat"><b>{stats.worst !== null ? formatTime(stats.worst) : "—"}</b><span>最慢</span></div>
        <div className="timer-stat"><b>{stats.sd !== null ? formatTime(stats.sd) : "—"}</b><span>标准差</span></div>
      </div>

      {/* 历史列表 */}
      <div className="timer-history">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
          <span className="timer-label">历史记录（{size}×{size}×{size} · {sizeHistory.length}）</span>
          {sizeHistory.length > 0 && (
            <button className="btn btn-ghost btn-sm" style={{ color: "var(--color-error)" }} onClick={clearAll}>
              清空
            </button>
          )}
        </div>
        {sizeHistory.length === 0 ? (
          <p className="timer-empty">还没有记录 —— 按空格或点击计时器开始第一次速拧 🧊</p>
        ) : (
          <ol className="timer-list">
            {sizeHistory.map((rec, i) => (
              <li key={i}>
                <span className="timer-list-index">#{sizeHistory.length - i}</span>
                <span className="timer-list-time">
                  {formatTime(rec.t)}
                  {rec.penalty && <em className="timer-list-penalty">{rec.penalty}</em>}
                </span>
                <span className="timer-list-insp" title={`观察 ${formatInspection(rec.i, rec.penalty)}`}>
                  观察 {formatInspection(rec.i, rec.penalty)}
                </span>
                <span className="timer-list-scramble" title={rec.s}>
                  {rec.s}
                </span>
                <button
                  type="button"
                  className="timer-list-del"
                  onClick={() => removeOne(i)}
                  aria-label="删除这条记录"
                >
                  ✕
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
