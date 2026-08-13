import { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  align?: "left" | "center";
  subtitle?: string;
}

export function SectionHeading({
  children,
  align = "left",
  subtitle,
}: SectionHeadingProps) {
  return (
    <div
      className={`section-heading section-heading-${align}`}
      style={{
        marginBottom: "var(--space-12)",
        textAlign: align,
      }}
    >
      <h2
        className="section-heading-title"
        style={{
          fontSize: "var(--text-3xl)",
          fontWeight: 700,
          color: "var(--color-text-primary)",
          letterSpacing: 0,
          lineHeight: "var(--leading-tight)",
          marginBottom: subtitle ? "var(--space-3)" : 0,
        }}
      >
        {children}
      </h2>
      {subtitle && (
          <p
            className="section-heading-subtitle"
          style={{
            fontSize: "var(--text-lg)",
            color: "var(--color-text-secondary)",
            maxWidth: align === "center" ? 600 : undefined,
            margin: align === "center" ? "0 auto" : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
