/**
 * PixelWord — 像素风点阵字
 * 以「彩绘魔方」的六色拼出站点归属标识：S A N J I N
 * 每个字母为 5×7 点阵，通过 CSS Grid 渲染为小方块，逐格弹出动画。
 */

/** 5×7 点阵字模（0=空，1=实心） */
const GLYPHS: Record<string, string[]> = {
  S: ["01110", "10001", "10000", "01110", "00001", "10001", "01110"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  J: ["00111", "00001", "00001", "00001", "00001", "10001", "01110"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
};

/** 魔方六色，按字母顺序分配，字母间错落弹出 */
const CUBE_COLORS = [
  "#DC2626", // S — 红
  "#EA580C", // A — 橙
  "#FACC15", // N — 黄
  "#16A34A", // J — 绿
  "#2563EB", // I — 蓝
  "#F8FAFC", // N — 白
];

function PixelLetter({
  char,
  color,
  delay,
}: {
  char: string;
  color: string;
  delay: number;
}) {
  const glyph = GLYPHS[char] ?? GLYPHS["S"];

  return (
    <span
      className="pixel-letter"
      role="img"
      aria-label={char}
      style={{ color }}
    >
      {glyph.map((row, r) =>
        row.split("").map((cell, c) => {
          const on = cell === "1";
          return (
            <span
              key={`${r}-${c}`}
              className={`pixel-cell${on ? " on" : ""}`}
              style={{
                backgroundColor: on ? color : "transparent",
                animationDelay: `${delay + r * 45 + c * 25}ms`,
              }}
              aria-hidden={!on}
            />
          );
        })
      )}
    </span>
  );
}

export function PixelWord({ text = "SANJIN" }: { text?: string }) {
  const letters = text.split("");

  return (
    <span className="pixel-word" aria-label={text}>
      {letters.map((ch, i) => (
        <PixelLetter
          key={i}
          char={ch}
          color={CUBE_COLORS[i % CUBE_COLORS.length]}
          delay={i * 130}
        />
      ))}
    </span>
  );
}
