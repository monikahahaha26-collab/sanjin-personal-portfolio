import Link from "next/link";
import { ReactNode } from "react";
import { withBasePath } from "@/lib/public-path";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  external?: boolean;
  download?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

/** variant → CSS class（样式定义在 styles/global.css，便于统一 hover / focus / 阴影） */
const VARIANT_CLASS: Record<string, string> = {
  primary: "btn-primary",
  secondary: "btn-outline",
  outline: "btn-outline",
  ghost: "btn-ghost",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  external = false,
  download = false,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  const cls = [
    "btn",
    VARIANT_CLASS[variant],
    size === "sm" ? "btn-sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const externalIcon = external ? (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  ) : null;

  if (href) {
    // 外链 / 下载链接使用原生 a，避免 next/link 的预取与路由干预
    if (external || download) {
      return (
        <a
          className={cls}
          href={external ? href : withBasePath(href)}
          download={download || undefined}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {children}
          {externalIcon}
        </a>
      );
    }
    return (
      <Link className={cls} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
