"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { seedBooks, seedMovies, LIBRARY_SEED_VERSION } from "@/data/library";
import { store, uid, type StoredBook, type BookStatus } from "@/lib/store";
import { getShareParam, decodeShareData } from "@/lib/share";
import { Modal } from "@/components/ui/Modal";
import { ShareExportBar } from "@/components/ui/ShareExportBar";
import { StarRating } from "@/components/ui/StarRating";
import { Tag } from "@/components/ui/Tag";
import { CAN_MANAGE_CONTENT } from "@/lib/site-mode";
import { withBasePath } from "@/lib/public-path";

const STATUSES: BookStatus[] = ["想读", "在读", "已读"];
const STATUS_COLOR: Record<BookStatus, "outline" | "accent" | "default"> = { 想读: "outline", 在读: "accent", 已读: "default" };
const MAX_IMAGE_BYTES = 1024 * 1024;

const emptyForm = (): StoredBook => ({
  id: "",
  title: "",
  author: "",
  status: "想读",
  rating: 0,
  note: "",
  intro: "",
  reflection: "",
  category: "",
  year: "",
  date: new Date().toISOString().slice(0, 10),
});

function Cover({ item, large = false }: { item: StoredBook; large?: boolean }) {
  const src = item.coverDataUrl || withBasePath(item.cover);
  return (
    <div className={`library-cover${large ? " library-cover-large" : ""}`}>
      {src ? <Image src={src} alt={`${item.title} 封面`} fill sizes={large ? "280px" : "(max-width: 640px) 44vw, 190px"} unoptimized={src.startsWith("data:")} /> : <div className="library-cover-placeholder"><span>BOOK</span><strong>{item.title.slice(0, 1)}</strong></div>}
      <span className="library-cover-shine" aria-hidden="true" />
    </div>
  );
}

export default function BooksPage() {
  const [books, setBooks] = useState<StoredBook[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<StoredBook | null>(null);
  const [editing, setEditing] = useState<StoredBook | null>(null);
  const [form, setForm] = useState<StoredBook>(emptyForm());
  const [shared, setShared] = useState<StoredBook[] | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"全部" | BookStatus>("全部");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const share = getShareParam();
    if (share) {
      const data = decodeShareData<StoredBook[]>(share);
      if (Array.isArray(data)) setShared(data);
    }
    if (CAN_MANAGE_CONTENT) {
      store.seedLibrary(seedBooks, seedMovies, LIBRARY_SEED_VERSION);
      setBooks(store.getBooks());
    } else {
      setBooks(seedBooks);
    }
    setLoaded(true);
  }, []);

  const visibleBooks = shared ?? books;
  const sorted = useMemo(() => [...visibleBooks].sort((a, b) => b.date.localeCompare(a.date)), [visibleBooks]);
  const filtered = useMemo(() => sorted.filter((book) => {
    const haystack = `${book.title} ${book.author} ${book.category ?? ""}`.toLowerCase();
    return (!query.trim() || haystack.includes(query.trim().toLowerCase())) && (filter === "全部" || book.status === filter);
  }), [filter, query, sorted]);
  const stats = { total: books.length, reading: books.filter((book) => book.status === "在读").length, done: books.filter((book) => book.status === "已读").length };

  const openNew = () => { setForm(emptyForm()); setEditing({ ...emptyForm(), id: "new" }); };
  const openEdit = (book: StoredBook) => { setSelected(null); setForm({ ...book, intro: book.intro ?? "", reflection: book.reflection ?? book.note }); setEditing(book); };
  const closeEdit = () => setEditing(null);
  const refresh = () => setBooks(store.getBooks());

  const onCover = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) { alert("图片不能超过 1MB，请压缩后再上传。"); event.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, coverDataUrl: String(reader.result) }));
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const save = () => {
    if (!CAN_MANAGE_CONTENT) return;
    if (!form.title.trim()) return;
    const record: StoredBook = { ...form, title: form.title.trim(), id: editing?.id && editing.id !== "new" ? editing.id : uid(), note: form.note || form.reflection || "" };
    if (!store.saveBook(record)) { alert("保存失败：浏览器本地存储空间不足。请压缩图片或删除部分本地内容后重试。"); return; }
    refresh(); closeEdit();
  };
  const remove = (id: string) => { if (!CAN_MANAGE_CONTENT) return; if (confirm("确定从书架移除这本书？")) { store.deleteBook(id); refresh(); setSelected(null); } };
  const onImport = (data: unknown) => {
    if (!CAN_MANAGE_CONTENT) return;
    if (!Array.isArray(data)) { alert("备份格式不正确"); return; }
    data.filter((item) => item && typeof item === "object" && "title" in item).forEach((item) => store.saveBook(item as StoredBook));
    refresh();
  };

  return (
    <section className="library-page" aria-label="读书馆藏">
      <div className="library-shell">
        <header className="library-header">
          <div>
            <Link className="library-back" href="/hobbies">← 兴趣爱好</Link>
            <p className="library-kicker">PRIVATE READING ROOM · 01</p>
            <h1>读书馆</h1>
            <p className="library-lede">把读过的故事留在书架上，也把当时的心情留在页边。</p>
            <div className="library-stats"><span><b>{loaded ? stats.total : "—"}</b> 本藏书</span><span><b>{loaded ? stats.reading : "—"}</b> 在读</span><span><b>{loaded ? stats.done : "—"}</b> 已读</span></div>
          </div>
          {CAN_MANAGE_CONTENT && <div className="library-actions">
            <ShareExportBar data={books} basePath="/hobbies/books" filename="books-backup.json" onImport={onImport} title="书单分享与备份" />
            <button className="btn btn-primary" onClick={openNew}>＋ 添加书目</button>
          </div>}
        </header>

        {shared && <div className="share-banner">🔗 这是他人分享的只读书架（{shared.length} 本），不含图片。<Link href="/hobbies/books">返回我的书架</Link></div>}
        <div className="library-toolbar reveal">
          <label className="library-search"><span className="sr-only">搜索书名、作者或类型</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索书名、作者或类型" /><span aria-hidden="true">⌕</span></label>
          <div className="library-filters" role="group" aria-label="阅读状态">
            {["全部", ...STATUSES].map((status) => <button key={status} className={filter === status ? "active" : ""} onClick={() => setFilter(status as "全部" | BookStatus)}>{status}</button>)}
          </div>
        </div>

        {loaded && filtered.length === 0 ? <div className="library-empty"><span>◌</span><h2>{books.length ? "没有匹配的书" : "书架还在等第一本书"}</h2><p>{books.length ? "换一个关键词或阅读状态试试。" : "从右上角添加一本，写下你的第一条阅读记录。"}</p></div> : <div className="library-grid">{filtered.map((book) => <article className="library-card" key={book.id}>
          <button className="library-cover-button" onClick={() => setSelected(book)} aria-label={`查看《${book.title}》详情`}><Cover item={book} /></button>
          <div className="library-card-body"><div className="library-card-meta"><span>{book.category || "未分类"}</span><Tag size="sm" variant={STATUS_COLOR[book.status]}>{book.status}</Tag></div><button className="library-card-title" onClick={() => setSelected(book)}>{book.title}</button><p className="library-card-author">{book.author || "佚名"}{book.year ? ` · ${book.year}` : ""}</p><div className="library-card-footer"><StarRating value={book.rating} readOnly size={14} /><button className="library-more" onClick={() => setSelected(book)} aria-label={`打开《${book.title}》`}>查看详情 →</button></div></div>
        </article>)}</div>}
      </div>

      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.title ?? ""} wide>{selected && <div className="library-detail"><div className="library-detail-cover"><Cover item={selected} large /></div><div className="library-detail-copy"><div className="library-detail-meta"><Tag variant={STATUS_COLOR[selected.status]}>{selected.status}</Tag><span>{selected.category || "未分类"}</span>{selected.year && <span>{selected.year}</span>}</div><p className="library-detail-author">{selected.author || "佚名"}</p><section><h4>内容简介</h4><p>{selected.intro || "这本书还没有简介。"}</p></section><section><h4>读后感</h4><p>{selected.reflection || selected.note || "还没有写下读后感。"}</p></section><div className="library-detail-rating"><StarRating value={selected.rating} readOnly /><span>{selected.rating ? `${selected.rating}/5` : "未评分"}</span></div>{CAN_MANAGE_CONTENT && !shared && <div className="modal-actions library-detail-actions"><button className="btn btn-outline" onClick={() => openEdit(selected)}>编辑这本书</button><button className="btn btn-ghost" style={{ color: "var(--color-error)" }} onClick={() => remove(selected.id)}>移出书架</button></div>}</div></div>}</Modal>

      <Modal open={editing !== null} onClose={closeEdit} title={editing?.id === "new" ? "把一本书放上书架" : "编辑馆藏"} wide><div className="form-grid"><label className="field field-full"><span>封面图</span><div className="library-upload"><button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>▧ 上传封面</button><input ref={fileRef} type="file" accept="image/*" hidden onChange={onCover} />{form.coverDataUrl && <Image src={form.coverDataUrl} alt="封面预览" width={64} height={92} unoptimized />}</div></label><label className="field"><span>书名 *</span><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="书名" /></label><label className="field"><span>作者</span><input value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} placeholder="作者" /></label><label className="field"><span>类型</span><input value={form.category ?? ""} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="如：长篇小说 · 推理" /></label><label className="field"><span>出版年份</span><input value={form.year ?? ""} onChange={(event) => setForm({ ...form, year: event.target.value })} placeholder="年份" /></label><label className="field"><span>阅读状态</span><div className="chip-row">{STATUSES.map((status) => <button key={status} type="button" className={`chip-btn${form.status === status ? " chip-btn-active" : ""}`} onClick={() => setForm({ ...form, status })}>{status}</button>)}</div></label><label className="field"><span>评分</span><StarRating value={form.rating} onChange={(value) => setForm({ ...form, rating: value })} /></label><label className="field field-full"><span>内容简介</span><textarea rows={4} value={form.intro ?? ""} onChange={(event) => setForm({ ...form, intro: event.target.value })} placeholder="写下这本书讲了什么…" /></label><label className="field field-full"><span>读后感</span><textarea rows={6} value={form.reflection ?? ""} onChange={(event) => setForm({ ...form, reflection: event.target.value })} placeholder="留下你的阅读感受…" /></label><label className="field field-full"><span>一句话摘记</span><input value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="可选，用于书架上的一句话" /></label></div><div className="modal-actions"><button className="btn btn-outline" onClick={closeEdit}>取消</button><button className="btn btn-primary" disabled={!form.title.trim()} onClick={save}>保存到书架</button></div></Modal>
    </section>
  );
}
