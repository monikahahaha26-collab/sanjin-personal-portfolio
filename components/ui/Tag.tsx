interface TagProps {
  children: string;
  variant?: "default" | "accent" | "outline";
  size?: "sm" | "md";
}

/**
 * 对比度校验（WCAG AA 小字 ≥ 4.5:1）
 * default: #52525B on #F5F5F4 → 7.4:1  ✓
 * accent:  #9A3412 on #FFEDD5 → 6.6:1  ✓
 * outline: #52525B on #FFFFFF → 8.0:1  ✓
 */
const variants: Record<string, React.CSSProperties> = {
  default: {
    background: "var(--color-bg-tertiary)",
    color: "var(--color-text-secondary)",
    border: "1px solid transparent",
  },
  accent: {
    background: "var(--color-accent-subtle)",
    color: "var(--color-accent-hover)",
    border: "1px solid var(--color-accent-light)",
  },
  outline: {
    background: "transparent",
    color: "var(--color-text-secondary)",
    border: "1px solid var(--color-border)",
  },
};

const sizes: Record<string, React.CSSProperties> = {
  sm: { padding: "3px 10px", fontSize: "var(--text-xs)" },
  md: { padding: "5px 13px", fontSize: "var(--text-sm)" },
};

export function Tag({ children, variant = "default", size = "sm" }: TagProps) {
  return (
    <span
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: "var(--radius-full)",
        fontWeight: 500,
        letterSpacing: "var(--tracking-tight)",
        display: "inline-flex",
        alignItems: "center",
        whiteSpace: "nowrap",
        lineHeight: 1.5,
      }}
    >
      {children}
    </span>
  );
}
