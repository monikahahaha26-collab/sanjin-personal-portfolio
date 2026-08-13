"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { store, uid, type StoredProject } from "@/lib/store";
import { Modal } from "@/components/ui/Modal";
import { Tag } from "@/components/ui/Tag";
import { renderMarkdown } from "@/lib/markdown";
import { CAN_MANAGE_CONTENT } from "@/lib/site-mode";

/** MDX 项目（server 传入） */
export interface MdxProjectMeta {
  slug: string;
  title: string;
  summary: string;
  cover?: string;
  date: string;
  tags: string[];
  role: string;
  period: string;
  demo?: string | null;
  repo?: string | null;
  /** 展示优先级（越小越靠前）；demo 项目排最后 */
  priority?: number;
  isDemo?: boolean;
}

/** 统一展示项：MDX 或本地 */
interface BoardItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  role: string;
  period: string;
  cover?: string; // MDX 封面路径 or 本地 base64
  demo?: string | null;
  repo?: string | null;
  body?: string;
  slug?: string | null; // MDX slug
  local: boolean;
  priority?: number;
  isDemo?: boolean;
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const MAX_IMAGE_BYTES = 1024 * 1024;

const emptyForm = (): StoredProject => ({
  id: "",
  title: "",
  summary: "",
  date: new Date().toISOString().slice(0, 7),
  tags: [],
  role: "独立开发",
  period: "",
  body: "",
  demo: "",
  repo: "",
});

export function ProjectsBoard({ mdxProjects }: { mdxProjects: MdxProjectMeta[] }) {
  const [localProjects, setLocalProjects] = useState<StoredProject[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<StoredProject | null>(null);
  const [form, setForm] = useState<StoredProject>(emptyForm());
  const [viewing, setViewing] = useState<StoredProject | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [editMode, setEditMode] = useState(false); // ?edit=1 开启管理模式
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 本地开发时可通过 ?edit=1 进入作者管理；生产构建始终只读。
    setEditMode(
      CAN_MANAGE_CONTENT &&
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("edit") === "1"
    );
    setLocalProjects(CAN_MANAGE_CONTENT ? store.getProjects() : []);
    setLoaded(true);
  }, []);

  const refresh = () => setLocalProjects(store.getProjects());

  const all: BoardItem[] = useMemo(() => {
    const local: BoardItem[] = localProjects.map((p) => ({
      id: p.id,
      title: p.title,
      summary: p.summary,
      date: p.date,
      tags: p.tags,
      role: p.role,
      period: p.period,
      cover: p.coverDataUrl,
      demo: p.demo,
      repo: p.repo,
      body: p.body,
      slug: null,
      local: true,
    }));
    const mdx: BoardItem[] = mdxProjects.map((m) => ({
      id: `mdx:${m.slug}`,
      title: m.title,
      summary: m.summary,
      date: m.date,
      tags: m.tags,
      role: m.role,
      period: m.period,
      cover: m.cover,
      demo: m.demo,
      repo: m.repo,
      slug: m.slug,
      local: false,
      priority: m.priority,
      isDemo: m.isDemo,
    }));
    // 排序：非 demo 优先 → priority 升序 → 无 priority 按 date 倒序；本地项目排最后
    return [...local, ...mdx].sort((a, b) => {
      const da = a.isDemo ? 1 : 0;
      const db = b.isDemo ? 1 : 0;
      if (da !== db) return da - db;
      if (a.priority !== undefined && b.priority !== undefined) return a.priority - b.priority;
      if (a.priority !== undefined) return -1;
      if (b.priority !== undefined) return 1;
      return b.date.localeCompare(a.date);
    });
  }, [localProjects, mdxProjects]);

  const openNew = () => {
    setForm(emptyForm());
    setTagInput("");
    setEditing({ ...emptyForm(), id: "new" });
  };
  const openEdit = (p: StoredProject) => {
    setForm({ ...p });
    setTagInput("");
    setEditing(p);
  };
  const closeEdit = () => setEditing(null);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm({ ...form, tags: [...form.tags, t] });
    setTagInput("");
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      alert("图片不能超过 1MB，请压缩后再上传。");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, coverDataUrl: String(reader.result) }));
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const save = () => {
    if (!CAN_MANAGE_CONTENT) return;
    if (!form.title.trim()) return;
    const rec: StoredProject = {
      ...form,
      id: editing?.id && editing.id !== "new" ? editing.id : uid(),
      demo: form.demo?.trim() || undefined,
      repo: form.repo?.trim() || undefined,
    };
    if (!store.saveProject(rec)) {
      alert("保存失败：浏览器本地存储空间不足。请压缩图片或删除部分本地内容后重试。");
      return;
    }
    refresh();
    closeEdit();
  };

  const remove = (id: string) => {
    if (!CAN_MANAGE_CONTENT) return;
    if (confirm("确定删除这个本地项目？")) {
      store.deleteProject(id);
      refresh();
    }
  };

  const coverUrl = (cover?: string) =>
    cover
      ? cover.startsWith("/")
        ? `${BASE}${cover}`
        : cover
      : undefined;

  return (
    <>
      <div className="section-bar" style={{ marginBottom: "var(--space-8)" }}>
        <div>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: 0 }}>
            共 <b style={{ color: "var(--color-accent-hover)" }}>{all.length}</b> 个项目 · 按技术难度与功能完整性排序
            {editMode && (
              <span> · 本地 <b style={{ color: "var(--color-accent-hover)" }}>{localProjects.length}</b>（管理模式）</span>
            )}
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <Link className="btn btn-outline btn-sm" href="/">← 首页</Link>
          {CAN_MANAGE_CONTENT && <button className="btn btn-primary" onClick={openNew}>+ 添加项目</button>}
        </div>
      </div>

      {loaded && all.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--space-16)", color: "var(--color-text-muted)" }}>
          <p style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-4)" }}>暂无项目 🧩</p>
          <p>点击右上角「+ 添加项目」开始收录</p>
        </div>
      ) : (
        <div className="projects-grid">
          {all.map((item) =>
            item.local ? (
              <div
                key={item.id}
                className="reveal project-card"
                style={{ display: "flex", flexDirection: "column", borderRadius: "var(--radius-lg)", overflow: "hidden", backgroundColor: "var(--color-bg-elevated)", border: "1px solid var(--color-border)" }}
              >
                <button
                  type="button"
                  onClick={() => setViewing(localProjects.find((p) => p.id === item.id) ?? null)}
                  style={{ border: "none", padding: 0, background: "none", cursor: "pointer", textAlign: "left", display: "block", width: "100%" }}
                >
                  <div
                    className="project-card-media"
                    style={{
                      width: "100%",
                      aspectRatio: "16 / 9",
                      backgroundColor: "var(--color-bg-tertiary)",
                      backgroundImage: item.cover ? `url(${item.cover})` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {!item.cover && <span style={{ fontSize: "2rem", color: "var(--color-text-muted)" }}>📁</span>}
                  </div>
                  <div style={{ padding: "var(--space-5)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
                      <Tag size="sm">{item.role}</Tag>
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{item.period || item.date}</span>
                      {editMode && <Tag size="sm" variant="accent">本地</Tag>}
                    </div>
                    <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, margin: "0 0 var(--space-3)", lineHeight: "var(--leading-tight)" }}>{item.title}</h3>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", margin: "0 0 var(--space-4)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{item.summary}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                      {item.tags.slice(0, 4).map((t) => (
                        <Tag key={t} variant="outline" size="sm">{t}</Tag>
                      ))}
                    </div>
                  </div>
                </button>
                {editMode && (
                  <div style={{ display: "flex", gap: "var(--space-2)", padding: "0 var(--space-5) var(--space-4)" }}>
                    <button className="btn btn-outline" style={{ flex: 1, minHeight: 32, padding: "0 var(--space-3)", fontSize: "var(--text-xs)" }} onClick={() => setViewing(localProjects.find((p) => p.id === item.id) ?? null)}>
                      查看
                    </button>
                    <button className="btn btn-outline" style={{ flex: 1, minHeight: 32, padding: "0 var(--space-3)", fontSize: "var(--text-xs)" }} onClick={() => openEdit(localProjects.find((p) => p.id === item.id) ?? emptyForm())}>
                      编辑
                    </button>
                    <button className="btn btn-ghost" style={{ flex: 1, minHeight: 32, padding: "0 var(--space-3)", fontSize: "var(--text-xs)", color: "var(--color-error)" }} onClick={() => remove(item.id)}>
                      删除
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div key={item.id} className="reveal" style={{ display: "contents" }}>
                <Link href={`/projects/${item.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="project-card" style={{ height: "100%", borderRadius: "var(--radius-lg)", overflow: "hidden", backgroundColor: "var(--color-bg-elevated)", border: "1px solid var(--color-border)" }}>
                    <div
                      className="project-card-media"
                    style={{
                      width: "100%",
                      aspectRatio: "16 / 9",
                      backgroundColor: "var(--color-bg-tertiary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {coverUrl(item.cover) && (
                      <Image
                        src={coverUrl(item.cover)!}
                        alt={`${item.title} 项目封面`}
                        fill
                        sizes="(max-width: 820px) 100vw, 50vw"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                    {!item.cover && <span style={{ fontSize: "2rem", color: "var(--color-text-muted)" }}>📁</span>}
                    </div>
                    <div style={{ padding: "var(--space-5)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
                        <Tag size="sm">{item.role}</Tag>
                        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{item.period}</span>
                      </div>
                      <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, margin: "0 0 var(--space-3)", lineHeight: "var(--leading-tight)" }}>{item.title}</h3>
                      <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", margin: "0 0 var(--space-4)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{item.summary}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                        {item.tags.slice(0, 4).map((t) => (
                          <Tag key={t} variant="outline" size="sm">{t}</Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          )}
        </div>
      )}

      {/* 详情 modal（本地项目） */}
      <Modal open={viewing !== null} onClose={() => setViewing(null)} title={viewing?.title ?? ""} wide>
        {viewing && (
          <div>
            {viewing.coverDataUrl && (
              <Image
                src={viewing.coverDataUrl}
                alt={viewing.title}
                width={1200}
                height={675}
                unoptimized
                style={{ width: "100%", height: "auto", borderRadius: "var(--radius-lg)", marginBottom: "var(--space-5)" }}
              />
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
              <Tag variant="accent">{viewing.role}</Tag>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>{viewing.period || viewing.date}</span>
              {viewing.tags.map((t) => (
                <Tag key={t} variant="outline">{t}</Tag>
              ))}
            </div>
            <p style={{ fontSize: "var(--text-base)", color: "var(--color-text-secondary)", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-5)" }}>
              {viewing.summary}
            </p>
            {(viewing.demo || viewing.repo) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
                {viewing.demo && (
                  <a className="btn btn-primary btn-sm" href={viewing.demo} target="_blank" rel="noopener noreferrer">🌐 在线演示</a>
                )}
                {viewing.repo && (
                  <a className="btn btn-outline btn-sm" href={viewing.repo} target="_blank" rel="noopener noreferrer">GitHub 仓库</a>
                )}
              </div>
            )}
            {viewing.body && <div className="blog-content">{renderMarkdown(viewing.body)}</div>}
          </div>
        )}
      </Modal>

      {/* 编辑 modal */}
      <Modal open={editing !== null} onClose={closeEdit} title={editing?.id === "new" ? "添加项目" : "编辑项目"} wide>
        <div className="form-grid">
          <label className="field field-full">
            <span>项目名称 *</span>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="项目名称" />
          </label>
          <label className="field field-full">
            <span>简介</span>
            <textarea rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="一句话介绍项目" />
          </label>
          <label className="field">
            <span>角色</span>
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="独立开发 / 核心开发" />
          </label>
          <label className="field">
            <span>时间</span>
            <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="2026.01 – 2026.03" />
          </label>
          <label className="field">
            <span>日期（排序用）</span>
            <input type="month" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </label>
          <label className="field field-full">
            <span>技术栈标签（回车添加）</span>
            <div className="chip-row" style={{ marginBottom: "var(--space-2)" }}>
              {form.tags.map((t) => (
                <span key={t} className="chip-tag">
                  {t}
                  <button type="button" onClick={() => setForm({ ...form, tags: form.tags.filter((x) => x !== t) })} aria-label={`移除 ${t}`}>×</button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="输入后回车"
              />
              <button type="button" className="btn btn-outline btn-sm" onClick={addTag}>添加</button>
            </div>
          </label>
          <label className="field field-full">
            <span>封面图</span>
            <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>
                📷 上传图片
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
              {form.coverDataUrl && (
                <Image
                  src={form.coverDataUrl}
                  alt="封面预览"
                  width={120}
                  height={68}
                  unoptimized
                  style={{ objectFit: "cover", borderRadius: "var(--radius-md)" }}
                />
              )}
              {form.coverDataUrl && (
                <button type="button" className="btn btn-ghost btn-sm" style={{ color: "var(--color-error)" }} onClick={() => setForm({ ...form, coverDataUrl: undefined })}>移除</button>
              )}
            </div>
          </label>
          <label className="field">
            <span>体验链接</span>
            <input value={form.demo ?? ""} onChange={(e) => setForm({ ...form, demo: e.target.value })} placeholder="https://…" />
          </label>
          <label className="field">
            <span>GitHub 仓库</span>
            <input value={form.repo ?? ""} onChange={(e) => setForm({ ...form, repo: e.target.value })} placeholder="https://github.com/…" />
          </label>
          <label className="field field-full">
            <span>正文（支持 Markdown）</span>
            <textarea
              rows={6}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder={"## 项目概述\n\n写点什么…\n\n## 核心实现\n\n- 要点 1\n- 要点 2"}
              style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}
            />
          </label>
        </div>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={closeEdit}>取消</button>
          <button className="btn btn-primary" disabled={!form.title.trim()} onClick={save}>保存</button>
        </div>
      </Modal>
    </>
  );
}
