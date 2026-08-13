"use client";

import { useState, useRef, useCallback } from "react";
import { CAN_MANAGE_CONTENT } from "@/lib/site-mode";

interface FormData {
  slug: string;
  title: string;
  summary: string;
  date: string;
  role: string;
  period: string;
  tags: string[];
  features: string[];
  challenges: string[];
  demoUrl: string;
  repoUrl: string;
  bodyContent: string;
  coverFile: File | null;
  coverPreview: string;
}

interface PreviewData {
  title: string;
  summary: string;
  cover: string;
  tags: string[];
  role: string;
  period: string;
  links: { demo: string | null; repo: string | null };
}

const EMPTY_FORM: FormData = {
  slug: "",
  title: "",
  summary: "",
  date: new Date().toISOString().slice(0, 7),
  role: "独立开发",
  period: "",
  tags: [],
  features: [],
  challenges: [],
  demoUrl: "",
  repoUrl: "",
  bodyContent: "",
  coverFile: null,
  coverPreview: "",
};

const ROLE_OPTIONS = ["独立开发", "核心开发", "前端开发", "后端开发", "全栈开发", "参与者"];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "untitled-project";
}

export default function AddProjectPage() {
  const [form, setForm] = useState<FormData>({ ...EMPTY_FORM });
  const [tagInput, setTagInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [challengeInput, setChallengeInput] = useState("");
  const [generatedMdx, setGeneratedMdx] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Field updaters ---
  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateTitle = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  // --- Tag / list management ---
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      update("tags", [...form.tags, t]);
      setTagInput("");
    }
  };
  const removeTag = (t: string) => update("tags", form.tags.filter((x) => x !== t));

  const addFeature = () => {
    const f = featureInput.trim();
    if (f) {
      update("features", [...form.features, f]);
      setFeatureInput("");
    }
  };
  const removeFeature = (f: string) =>
    update("features", form.features.filter((x) => x !== f));

  const addChallenge = () => {
    const c = challengeInput.trim();
    if (c) {
      update("challenges", [...form.challenges, c]);
      setChallengeInput("");
    }
  };
  const removeChallenge = (c: string) =>
    update("challenges", form.challenges.filter((x) => x !== c));

  // --- Cover image ---
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件（PNG/JPG/WebP）");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        coverFile: file,
        coverPreview: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // --- Generate MDX ---
  const generateMdx = useCallback(() => {
    if (!form.title.trim()) {
      alert("请填写项目名称");
      return;
    }
    if (!form.summary.trim()) {
      alert("请填写项目简介");
      return;
    }

    const coverPath = form.slug ? `/projects/${form.slug}.png` : "";

    const frontmatter = `---
title: "${form.title.replace(/"/g, '\\"')}"
summary: "${form.summary.replace(/"/g, '\\"')}"
cover: "${coverPath}"
date: "${form.date}"
tags: [${form.tags.map((t) => `"${t}"`).join(", ")}]
role: "${form.role}"
period: "${form.period}"
${form.features.length > 0 ? `features:\n${form.features.map((f) => `  - "${f.replace(/"/g, '\\"')}"`).join("\n")}` : ""}
${form.challenges.length > 0 ? `challenges:\n${form.challenges.map((c) => `  - "${c.replace(/"/g, '\\"')}"`).join("\n")}` : ""}
links:
  demo: ${form.demoUrl ? `"${form.demoUrl}"` : "null"}
  repo: ${form.repoUrl ? `"${form.repoUrl}"` : "null"}
---

${form.bodyContent || "> 项目详情内容待补充..."}`;

    setGeneratedMdx(frontmatter);
  }, [form]);

  // --- Download MDX ---
  const downloadMdx = () => {
    if (!generatedMdx) generateMdx();
    const content = generatedMdx || "";
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.slug || "new-project"}.mdx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Download cover image ---
  const downloadCover = () => {
    if (!form.coverFile) {
      alert("请先上传封面截图");
      return;
    }
    const url = URL.createObjectURL(form.coverFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.slug || "project"}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Copy to clipboard ---
  const copyToClipboard = async () => {
    if (!generatedMdx) generateMdx();
    try {
      await navigator.clipboard.writeText(generatedMdx || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("复制失败，请手动复制");
    }
  };

  // --- Preview data ---
  const previewData: PreviewData = {
    title: form.title || "项目名称预览",
    summary: form.summary || "项目简介将显示在这里...",
    cover: form.coverPreview || "",
    tags: form.tags,
    role: form.role,
    period: form.period || "2025.01 – 至今",
    links: {
      demo: form.demoUrl || null,
      repo: form.repoUrl || null,
    },
  };

  // --- Styles (inline for self-contained page) ---
  const pageStyle: React.CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "var(--space-8) var(--space-6)",
    minHeight: "80vh",
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "var(--space-8)",
    alignItems: "start",
  };

  const fieldsetLabel: React.CSSProperties = {
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    color: "var(--color-text-primary)",
    marginBottom: "var(--space-2)",
    display: "block",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    fontSize: "var(--text-sm)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    backgroundColor: "var(--color-bg-primary)",
    color: "var(--color-text-primary)",
    outline: "none",
    transition: "border-color 0.15s ease",
    boxSizing: "border-box" as const,
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: 80,
    resize: "vertical" as const,
    fontFamily: "inherit",
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: "var(--space-6)",
  };

  const chipContainerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--space-2)",
    marginTop: "var(--space-2)",
  };

  const chipStyle = (color: string): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "4px 10px",
    fontSize: "var(--text-xs)",
    borderRadius: "9999px",
    background: color,
    color: "#fff",
  });

  const btnStyle = (
    bg: string
  ): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "10px 20px",
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    color: bg === "accent" ? "#fff" : "var(--color-text-primary)",
    background:
      bg === "accent"
        ? "var(--color-accent)"
        : bg === "subtle"
          ? "var(--color-bg-tertiary)"
          : "transparent",
    border:
      bg === "outline"
        ? "1px solid var(--color-border)"
        : "none",
    borderRadius: "var(--radius-md)",
    cursor: "pointer",
    transition: "all 0.15s ease",
    textDecoration: "none",
  });

  return (
    !CAN_MANAGE_CONTENT ? (
      <section className="container" style={{ padding: "var(--space-20) var(--space-6)", minHeight: "60vh" }}>
        <p className="library-kicker">PUBLIC READ-ONLY</p>
        <h1 style={{ marginBottom: "var(--space-4)" }}>管理功能仅在本地开放</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>线上版本只用于浏览，内容更新需要在作者本地工作区完成后重新部署。</p>
      </section>
    ) : (
    <div style={pageStyle}>
      {/* Header */}
      <div
        style={{
          marginBottom: "var(--space-8)",
          paddingBottom: "var(--space-6)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <h1
          style={{
            fontSize: "var(--text-3xl)",
            fontWeight: 800,
            color: "var(--color-text-primary)",
            margin: "0 0 var(--space-2) 0",
          }}
        >
          📝 添加新项目
        </h1>
        <p
          style={{
            fontSize: "var(--text-base)",
            color: "var(--color-text-secondary)",
            margin: 0,
            lineHeight: "var(--leading-relaxed)",
          }}
        >
          填写下方表单，实时预览卡片效果，完成后一键生成 MDX 文件和截图。
          将下载的文件放入对应目录后重新 <code>npm run build</code> 即可。
        </p>
      </div>

      {/* Main Grid */}
      <div style={gridStyle}>
        {/* Left: Form */}
        <div>
          {/* ===== Basic Info ===== */}
          <section style={sectionStyle}>
            <label style={fieldsetLabel}>项目名称 *</label>
            <input
              style={inputStyle}
              placeholder="例如：余烬尖塔 | Ember Spire"
              value={form.title}
              onChange={(e) => updateTitle(e.target.value)}
            />

            <label style={{ ...fieldsetLabel, marginTop: "var(--space-4)" }}>
              Slug（URL 标识）
            </label>
            <input
              style={{ ...inputStyle, fontFamily: "monospace" }}
              placeholder="auto-generated-from-title"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
            />

            <label style={{ ...fieldsetLabel, marginTop: "var(--space-4)" }}>
              项目简介 *（一句话描述）
            </label>
            <textarea
              style={{ ...textareaStyle, minHeight: 60 }}
              placeholder="用一句话概括这个项目做什么、解决什么问题..."
              value={form.summary}
              onChange={(e) => update("summary", e.target.value)}
            />

            <label style={{ ...fieldsetLabel, marginTop: "var(--space-4)" }}>
              封面截图
            </label>
            <div
              style={{
                display: "flex",
                gap: "var(--space-3)",
                alignItems: "center",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleCoverChange}
                style={{ display: "none" }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={btnStyle("outline")}
              >
                📷 {form.coverFile ? form.coverFile.name : "选择截图"}
              </button>
              {form.coverFile && (
                <button
                  onClick={downloadCover}
                  style={btnStyle("subtle")}
                >
                  💾 下载为 PNG
                </button>
              )}
            </div>
            {form.coverPreview && (
              <div
                style={{
                  marginTop: "var(--space-3)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  border: "1px solid var(--color-border)",
                  maxHeight: 200,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.coverPreview}
                  alt="Cover preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            )}
          </section>

          {/* ===== Meta ===== */}
          <section style={sectionStyle}>
            <label style={fieldsetLabel}>时间</label>
            <input
              style={{ ...inputStyle, maxWidth: 180 }}
              type="month"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
            />

            <label style={{ ...fieldsetLabel, marginTop: "var(--space-3)" }}>
              角色
            </label>
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
              {ROLE_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => update("role", r)}
                  style={{
                    ...btnStyle(
                      form.role === r ? "accent" : "subtle"
                    ),
                    padding: "6px 14px",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>

            <label style={{ ...fieldsetLabel, marginTop: "var(--space-3)" }}>
              时间跨度
            </label>
            <input
              style={{ ...inputStyle, maxWidth: 260 }}
              placeholder="例如：2025.06 – 2025.07"
              value={form.period}
              onChange={(e) => update("period", e.target.value)}
            />
          </section>

          {/* ===== Tags ===== */}
          <section style={sectionStyle}>
            <label style={fieldsetLabel}>技术栈标签</label>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="输入技术标签，回车添加"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <button onClick={addTag} style={btnStyle("accent")}>
                +
              </button>
            </div>
            <div style={chipContainerStyle}>
              {form.tags.map((t) => (
                <span key={t} style={chipStyle("var(--color-accent)")}>
                  {t}
                  <button
                    onClick={() => removeTag(t)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "inherit",
                      cursor: "pointer",
                      padding: 0,
                      marginLeft: 2,
                      fontSize: 14,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* ===== Links ===== */}
          <section style={sectionStyle}>
            <label style={fieldsetLabel}>体验链接（可选）</label>
            <input
              style={inputStyle}
              placeholder="https://example.pages.dev"
              value={form.demoUrl}
              onChange={(e) => update("demoUrl", e.target.value)}
            />

            <label style={{ ...fieldsetLabel, marginTop: "var(--space-3)" }}>
              GitHub 仓库（可选）
            </label>
            <input
              style={inputStyle}
              placeholder="https://github.com/user/repo"
              value={form.repoUrl}
              onChange={(e) => update("repoUrl", e.target.value)}
            />
          </section>

          {/* ===== Features ===== */}
          <section style={sectionStyle}>
            <label style={fieldsetLabel}>核心功能</label>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="输入功能点，回车添加"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
              />
              <button onClick={addFeature} style={btnStyle("outline")}>
                +
              </button>
            </div>
            <div style={chipContainerStyle}>
              {form.features.map((f) => (
                <span key={f} style={chipStyle("#374151")}>
                  ✓ {f}
                  <button
                    onClick={() => removeFeature(f)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "inherit",
                      cursor: "pointer",
                      padding: 0,
                      marginLeft: 4,
                      fontSize: 12,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* ===== Challenges ===== */}
          <section style={sectionStyle}>
            <label style={fieldsetLabel}>技术难点</label>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="输入技术难点，回车添加"
                value={challengeInput}
                onChange={(e) => setChallengeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addChallenge();
                  }
                }}
              />
              <button onClick={addChallenge} style={btnStyle("outline")}>
                +
              </button>
            </div>
            <div style={chipContainerStyle}>
              {form.challenges.map((c) => (
                <span key={c} style={chipStyle("#C2410C")}>
                  ⚡ {c}
                  <button
                    onClick={() => removeChallenge(c)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "inherit",
                      cursor: "pointer",
                      padding: 0,
                      marginLeft: 4,
                      fontSize: 12,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* ===== Body Content ===== */}
          <section style={sectionStyle}>
            <label style={fieldsetLabel}>正文内容（Markdown）</label>
            <textarea
              style={{ ...textareaStyle, minHeight: 150, fontFamily: "monospace" }}
              placeholder={"## 项目概述\n\n在这里写项目的详细说明...\n\n### 技术架构\n\n### 核心实现\n\n..."}
              value={form.bodyContent}
              onChange={(e) => update("bodyContent", e.target.value)}
            />
          </section>

          {/* ===== Actions ===== */}
          <section
            style={{
              ...sectionStyle,
              display: "flex",
              gap: "var(--space-3)",
              flexWrap: "wrap",
              paddingTop: "var(--space-4)",
              borderTop: "2px solid var(--color-border)",
            }}
          >
            <button
              onClick={generateMdx}
              style={{
                ...btnStyle("accent"),
                padding: "12px 28px",
                fontSize: "var(--text-base)",
              }}
            >
              🔍 生成预览
            </button>
            <button
              onClick={downloadMdx}
              style={{
                ...btnStyle("subtle"),
                padding: "12px 28px",
                fontSize: "var(--text-base)",
              }}
            >
              📥 下载 MDX 文件
            </button>
            <button
              onClick={copyToClipboard}
              style={{
                ...btnStyle("outline"),
                padding: "12px 28px",
                fontSize: "var(--text-base)",
              }}
            >
              {copied ? "✅ 已复制到剪贴板" : "📋 复制 MDX"}
            </button>
          </section>

          {/* Generated MDX Preview */}
          {generatedMdx && (
            <section
              style={{
                ...sectionStyle,
                background: "var(--color-bg-secondary)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-4)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "var(--space-3)",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--color-text-muted)",
                  }}
                >
                  生成的 MDX 内容预览：
                </span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {generatedMdx.split("\n").length} 行
                </span>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: "var(--space-4)",
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--text-xs)",
                  lineHeight: 1.6,
                  overflow: "auto",
                  maxHeight: 300,
                  color: "var(--color-text-secondary)",
                  fontFamily: '"SF Mono", Menlo, monospace',
                }}
              >
                {generatedMdx}
              </pre>
            </section>
          )}

          {/* Usage Guide */}
          <section
            style={{
              ...sectionStyle,
              background: "var(--color-accent-subtle)",
              border: "1px solid var(--color-accent-ring)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-5)",
            }}
          >
            <h3
              style={{
                fontSize: "var(--text-base)",
                fontWeight: 700,
                color: "var(--color-accent)",
                margin: "0 0 var(--space-3) 0",
              }}
            >
              📋 使用步骤
            </h3>
            <ol
              style={{
                margin: 0,
                paddingLeft: "20px",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
                lineHeight: "var(--leading-relaxed)",
              }}
            >
              <li>填写上方所有字段，右侧会实时预览卡片效果</li>
              <li>点击「下载 MDX 文件」，保存到 <code>content/projects/</code> 目录</li>
              <li>如有封面截图，点击「下载图片」保存到 <code>public/projects/</code></li>
              <li>在终端运行 <code>npm run build</code> 重新构建</li>
              <li>刷新页面即可看到新项目 ✨</li>
            </ol>
          </section>
        </div>

        {/* Right: Live Preview */}
        <div
          style={{
            position: "sticky",
            top: "var(--space-6)",
          }}
        >
          <div
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--color-text-muted)",
              marginBottom: "var(--space-3)",
            }}
          >
            👁 实时卡片预览
          </div>
          <div
            style={{
              border: "2px dashed var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-4)",
              background: "var(--color-bg-secondary)",
            }}
          >
            {/* Inline simplified card preview to avoid full link wrapper issues */}
            <div
              style={{
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                backgroundColor: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border)",
              }}
            >
              {/* Cover */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16 / 10",
                  backgroundColor: "var(--color-bg-tertiary)",
                  backgroundImage: previewData.cover
                    ? `url(${previewData.cover})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {!previewData.cover && (
                  <span
                    style={{ fontSize: "2rem", color: "var(--color-text-muted)" }}
                  >
                    📁
                  </span>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: "var(--space-5)" }}>
                {/* Role & Period */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    marginBottom: "var(--space-3)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <span
                    style={{
                      padding: "2px 10px",
                      background: "var(--color-accent-subtle)",
                      color: "var(--color-accent)",
                      borderRadius: "9999px",
                      fontSize: "var(--text-xs)",
                      fontWeight: 600,
                    }}
                  >
                    {previewData.role}
                  </span>
                  <span>{previewData.period}</span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: "var(--text-lg)",
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                    margin: "0 0 var(--space-3) 0",
                    lineHeight: "var(--leading-tight)",
                  }}
                >
                  {previewData.title}
                </h3>

                {/* Summary */}
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: "var(--leading-normal)",
                    margin: "0 0 var(--space-4) 0",
                  }}
                >
                  {previewData.summary}
                </p>

                {/* Tags */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--space-2)",
                  }}
                >
                  {previewData.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: "3px 10px",
                        fontSize: "var(--text-xs)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "9999px",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {previewData.tags.length > 4 && (
                    <span
                      style={{
                        padding: "3px 10px",
                        fontSize: "var(--text-xs)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "9999px",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      +{previewData.tags.length - 4}
                    </span>
                  )}
                </div>

                {/* Action buttons in preview */}
                {(previewData.links?.demo || previewData.links?.repo) && (
                  <div
                    style={{
                      display: "flex",
                      gap: "var(--space-2)",
                      marginTop: "var(--space-4)",
                      paddingTop: "var(--space-3)",
                      borderTop: "1px solid var(--color-border)",
                    }}
                  >
                    {previewData.links?.demo && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "5px 12px",
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                          color: "#fff",
                          background: "var(--color-accent)",
                          borderRadius: "var(--radius-md)",
                        }}
                      >
                        🔗 体验链接
                      </span>
                    )}
                    {previewData.links?.repo && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "5px 12px",
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                          color: "var(--color-text-primary)",
                          background: "var(--color-bg-tertiary)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius-md)",
                        }}
                      >
                        📦 GitHub
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  );
}
