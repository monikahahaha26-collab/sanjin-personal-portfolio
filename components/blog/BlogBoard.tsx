"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { store, uid, type StoredPost } from "@/lib/store";
import { Modal } from "@/components/ui/Modal";
import { Tag } from "@/components/ui/Tag";
import { renderMarkdown } from "@/lib/markdown";
import { CAN_MANAGE_CONTENT } from "@/lib/site-mode";

const MAX_IMAGE_BYTES = 1024 * 1024;

/** MDX 文章（server 传入） */
export interface MdxPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

const emptyForm = (): StoredPost => ({
  id: "",
  title: "",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "",
  tags: [],
  body: "",
});

export function BlogBoard({ mdxPosts }: { mdxPosts: MdxPostMeta[] }) {
  const [posts, setPosts] = useState<StoredPost[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<StoredPost | null>(null);
  const [form, setForm] = useState<StoredPost>(emptyForm());
  const [viewing, setViewing] = useState<StoredPost | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [editMode, setEditMode] = useState(false); // ?edit=1 管理模式
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditMode(
      CAN_MANAGE_CONTENT &&
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("edit") === "1"
    );
    setPosts(CAN_MANAGE_CONTENT ? store.getPosts() : []);
    setLoaded(true);
  }, []);

  const refresh = () => setPosts(store.getPosts());

  const all = useMemo(() => {
    const local = posts.map((p) => ({ ...p, id: `local:${p.id}` }));
    const mdx = mdxPosts.map((m) => ({
      id: `mdx:${m.slug}`,
      title: m.title,
      date: m.date,
      excerpt: m.excerpt,
      tags: m.tags,
    }));
    return [...local, ...mdx].sort((a, b) => b.date.localeCompare(a.date));
  }, [posts, mdxPosts]);

  const isMdx = (id: string) => id.startsWith("mdx:");

  const openNew = () => {
    setForm(emptyForm());
    setTagInput("");
    setEditing({ ...emptyForm(), id: "new" });
  };
  const openEdit = (p: StoredPost) => {
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

  const onImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      alert("图片不能超过 1MB，请压缩后再上传。");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const alt = file.name.replace(/\.[^.]+$/, "");
      const el = bodyRef.current;
      const insert = `\n\n![${alt}](${dataUrl})\n\n`;
      if (el) {
        const start = el.selectionStart ?? form.body.length;
        const end = el.selectionEnd ?? form.body.length;
        setForm((current) => ({
          ...current,
          body: current.body.slice(0, start) + insert + current.body.slice(end),
        }));
      } else {
        setForm((current) => ({ ...current, body: current.body + insert }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const save = () => {
    if (!CAN_MANAGE_CONTENT) return;
    if (!form.title.trim()) return;
    const rec: StoredPost = {
      ...form,
      id: editing?.id && editing.id !== "new" ? editing.id : uid(),
    };
    if (!store.savePost(rec)) {
      alert("保存失败：浏览器本地存储空间不足。请压缩图片或删除部分本地内容后重试。");
      return;
    }
    refresh();
    closeEdit();
  };

  const remove = (id: string) => {
    if (!CAN_MANAGE_CONTENT) return;
    const realId = id.replace(/^local:/, "");
    if (confirm("确定删除这篇文章？")) {
      store.deletePost(realId);
      refresh();
    }
  };

  return (
    <>
      <div className="section-bar" style={{ marginBottom: "var(--space-8)" }}>
        <div>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: 0 }}>
            共 <b style={{ color: "var(--color-accent-hover)" }}>{all.length}</b> 篇 · 按时间倒序更新
            {editMode && (
              <span> · 随笔 <b style={{ color: "var(--color-accent-hover)" }}>{posts.length}</b> 篇（管理模式）</span>
            )}
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <Link className="btn btn-outline btn-sm" href="/">← 首页</Link>
          {CAN_MANAGE_CONTENT && <button className="btn btn-primary" onClick={openNew}>✍️ 写随笔</button>}
        </div>
      </div>

      {loaded && all.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--space-16)", color: "var(--color-text-muted)" }}>
          <p style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-4)" }}>还没有文章 ✍️</p>
          {editMode && <p>点击右上角「写随笔」开始记录</p>}
        </div>
      ) : (
        <div className="blog-grid">
          {all.map((post) =>
            isMdx(post.id) ? (
              <Link key={post.id} href={`/blog/${post.id.replace("mdx:", "")}`} className="blog-card">
                <span className="blog-card-date">{post.date}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="blog-tags" style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                  {post.tags.map((t) => (
                    <Tag key={t} variant="outline" size="sm">{t}</Tag>
                  ))}
                </div>
              </Link>
            ) : (
              <article key={post.id} className="blog-card" style={{ paddingBottom: "var(--space-4)" }}>
                <button
                  type="button"
                  onClick={() => setViewing(posts.find((p) => `local:${p.id}` === post.id) ?? null)}
                  style={{ border: "none", background: "none", padding: 0, cursor: "pointer", textAlign: "left", display: "block", width: "100%" }}
                >
                  <span className="blog-card-date" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {post.date}
                    {editMode && <Tag size="sm" variant="accent">随笔</Tag>}
                  </span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt || (post as StoredPost).body?.slice(0, 80)}</p>
                </button>
                <div className="blog-tags" style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
                  {post.tags.map((t) => (
                    <Tag key={t} variant="outline" size="sm">{t}</Tag>
                  ))}
                </div>
                {editMode && (
                  <div style={{ display: "flex", gap: "var(--space-2)", paddingTop: "var(--space-3)", borderTop: "1px solid var(--color-border)" }}>
                    <button className="btn btn-outline" style={{ flex: 1, minHeight: 30, padding: "0 var(--space-3)", fontSize: "var(--text-xs)" }} onClick={() => openEdit(posts.find((p) => `local:${p.id}` === post.id) ?? form)}>
                      编辑
                    </button>
                    <button className="btn btn-ghost" style={{ flex: 1, minHeight: 30, padding: "0 var(--space-3)", fontSize: "var(--text-xs)", color: "var(--color-error)" }} onClick={() => remove(post.id)}>
                      删除
                    </button>
                  </div>
                )}
              </article>
            )
          )}
        </div>
      )}

      {/* 详情 modal */}
      <Modal open={viewing !== null} onClose={() => setViewing(null)} title={viewing?.title ?? ""} wide>
        {viewing && (
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-accent-hover)", margin: "0 0 var(--space-4)" }}>
              {viewing.date}
            </p>
            <div className="blog-content">{renderMarkdown(viewing.body)}</div>
          </div>
        )}
      </Modal>

      {/* 编辑 modal */}
      <Modal open={editing !== null} onClose={closeEdit} title={editing?.id === "new" ? "写随笔" : "编辑随笔"} wide>
        <div className="form-grid">
          <label className="field field-full">
            <span>标题 *</span>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="随笔标题" />
          </label>
          <label className="field field-full">
            <span>摘要</span>
            <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="一句话摘要（列表页展示）" />
          </label>
          <label className="field">
            <span>日期</span>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </label>
          <label className="field field-full">
            <span>标签（回车添加）</span>
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
            <span>
              正文（支持 Markdown 图文混排）
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ marginLeft: "var(--space-3)" }}
                onClick={() => imgRef.current?.click()}
              >
                🖼️ 上传图片插入正文
              </button>
            </span>
            <input ref={imgRef} type="file" accept="image/*" hidden onChange={onImage} />
            <textarea
              ref={bodyRef}
              rows={12}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder={"今天是…\n\n## 小标题\n\n正文内容，支持 **加粗**、列表、`代码`，图片会插入到光标处。\n\n> 引用\n\n```\n代码块\n```"}
              style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}
            />
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", margin: "var(--space-2) 0 0" }}>
              提示：图片以 base64 存入本地，过大图片请压缩后再上传（建议 &lt; 500KB）。
            </p>
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
