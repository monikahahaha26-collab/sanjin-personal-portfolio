"use client";

/**
 * StarRating — 1-5 星评分（可交互 / 只读）
 * 交互模式点击星级评分；只读模式用于展示。
 */
export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 18,
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: number;
}) {
  return (
    <span
      className="star-rating"
      style={{ display: "inline-flex", gap: 2, alignItems: "center" }}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={readOnly ? `${value} 星` : "评分"}
    >
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(s)}
          aria-label={`${s} 星`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: size + 4,
            height: size + 4,
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: readOnly ? "default" : "pointer",
            fontSize: size,
            lineHeight: 1,
            color: s <= value ? "#F59E0B" : "var(--color-border-strong)",
            transition: "transform var(--duration-fast) var(--ease-out)",
          }}
          onMouseEnter={(e) => {
            if (!readOnly) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          ★
        </button>
      ))}
    </span>
  );
}
