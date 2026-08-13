/**
 * PaintedCube — 彩绘正阶魔方（等距三面视图）
 * 用于首页四周装饰：不同配色方案（彩绘 / 暮色 / 星云），
 * 可旋转放置、浮动 / 旋转动画，营造"页面四周以彩绘魔方装饰"的氛围。
 */

export type CubePaletteId = "classic" | "sunset" | "galaxy";

export const CUBE_PALETTES: Record<
  CubePaletteId,
  { name: string; top: string[]; left: string[]; right: string[] }
> = {
  classic: {
    name: "经典",
    top: ["#F8FAFC", "#FACC15", "#F8FAFC", "#EA580C", "#F8FAFC", "#F8FAFC", "#FACC15", "#F8FAFC", "#16A34A"],
    left: ["#DC2626", "#DC2626", "#EA580C", "#2563EB", "#DC2626", "#DC2626", "#DC2626", "#FACC15", "#DC2626"],
    right: ["#16A34A", "#2563EB", "#16A34A", "#16A34A", "#16A34A", "#FACC15", "#2563EB", "#16A34A", "#EA580C"],
  },
  sunset: {
    name: "暮色",
    top: ["#FEF3C7", "#FCD34D", "#FEF3C7", "#F97316", "#FEF3C7", "#FEF3C7", "#FCD34D", "#FEF3C7", "#FB923C"],
    left: ["#F43F5E", "#F43F5E", "#F97316", "#F87171", "#F43F5E", "#F43F5E", "#F43F5E", "#FCD34D", "#F43F5E"],
    right: ["#FB923C", "#F87171", "#FB923C", "#FB923C", "#FB923C", "#FCD34D", "#F87171", "#FB923C", "#F97316"],
  },
  galaxy: {
    name: "星云",
    top: ["#C7D2FE", "#A5B4FC", "#C7D2FE", "#818CF8", "#C7D2FE", "#C7D2FE", "#A5B4FC", "#C7D2FE", "#38BDF8"],
    left: ["#6366F1", "#6366F1", "#818CF8", "#E879F9", "#6366F1", "#6366F1", "#6366F1", "#A5B4FC", "#6366F1"],
    right: ["#38BDF8", "#E879F9", "#38BDF8", "#38BDF8", "#38BDF8", "#A5B4FC", "#E879F9", "#38BDF8", "#818CF8"],
  },
};

function CubeFace({ colors, shade, order }: { colors: string[]; shade: number; order: number }) {
  const unit = 60 / order;
  return (
    <g>
      {Array.from({ length: order * order }, (_, i) => {
        const col = i % order;
        const row = Math.floor(i / order);
        return (
          <rect
            key={i}
            x={col * unit + 0.7}
            y={row * unit + 0.7}
            width={unit - 1.4}
            height={unit - 1.4}
            rx={Math.max(0.8, unit * 0.12)}
            fill={colors[i % colors.length]}
          />
        );
      })}
      <rect
        x={0}
        y={0}
        width={60}
        height={60}
        fill="#000"
        opacity={shade}
        style={{ pointerEvents: "none" }}
      />
    </g>
  );
}

export function PaintedCube({
  palette = "classic",
  order = 3,
  size = 96,
}: {
  palette?: CubePaletteId;
  order?: 2 | 3 | 4 | 5 | 6 | 7;
  size?: number;
}) {
  const p = CUBE_PALETTES[palette];
  return (
    <svg
      width={size}
      height={size * 0.94}
      viewBox="0 0 120 113"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 顶面 */}
      <g transform="translate(60,0) matrix(0.866,0.5,-0.866,0.5,0,0)">
        <CubeFace colors={p.top} shade={0} order={order} />
      </g>
      {/* 左面 */}
      <g transform="translate(8,30) matrix(0.866,0.5,0,1,0,0)">
        <CubeFace colors={p.left} shade={0.14} order={order} />
      </g>
      {/* 右面 */}
      <g transform="translate(60,60) matrix(0.866,-0.5,0,1,0,0)">
        <CubeFace colors={p.right} shade={0.28} order={order} />
      </g>
      {/* 轮廓 */}
      <path
        d="M60 0 L111.96 30 L111.96 90 L60 120 L8.04 90 L8.04 30 Z M60 0 L60 60 M60 60 L111.96 30 M60 60 L8.04 30 M60 60 L60 120"
        stroke="#16161A"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}
