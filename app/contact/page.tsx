"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { personalInfo } from "@/data/about";

export default function ContactPage() {
  return (
    <section
      style={{
        padding: "var(--space-16) var(--space-6)",
        minHeight: "60vh",
      }}
      aria-label="联系方式"
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <SectionHeading align="center" subtitle="项目源码与公开作品统一在 GitHub 展示。">
          联系我
        </SectionHeading>

        {/* Contact Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-5)",
            marginTop: "var(--space-10)",
          }}
        >
          {/* GitHub */}
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-5)",
              padding: "var(--space-6)",
              backgroundColor: "var(--color-bg-elevated)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              textDecoration: "none",
              color: "inherit",
              transition:
                "border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)",
            }}
            className="contact-card"
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-bg-tertiary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              🐙
            </div>
            <div>
              <h3
                style={{
                  fontSize: "var(--text-base)",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  margin: `0 0 var(--space-1) 0`,
                }}
              >
                GitHub
              </h3>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                  margin: 0,
                }}
              >
                查看我的开源项目和代码贡献
              </p>
            </div>
          </a>

        </div>

        {/* Note about static site */}
        <div
          style={{
            marginTop: "var(--space-12)",
            padding: "var(--space-6)",
            backgroundColor: "var(--color-bg-secondary)",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
          }}
        >
          <p style={{ margin: 0 }}>
            这是一个纯静态网站（部署在 GitHub Pages）。
            <br />
            如需留言板等功能，可后续接入第三方服务（如 Formspree、Netlify Forms）。
          </p>
        </div>
      </div>
    </section>
  );
}
