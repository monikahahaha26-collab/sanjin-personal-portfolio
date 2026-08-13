"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { seedBooks, seedMovies, LIBRARY_SEED_VERSION } from "@/data/library";
import { store, uid, type StoredMovie, type MovieKind, type MovieStatus } from "@/lib/store";
import { getShareParam, decodeShareData } from "@/lib/share";
import { Modal } from "@/components/ui/Modal";
import { ShareExportBar } from "@/components/ui/ShareExportBar";
import { StarRating } from "@/components/ui/StarRating";
import { Tag } from "@/components/ui/Tag";
import { CAN_MANAGE_CONTENT } from "@/lib/site-mode";
import { withBasePath } from "@/lib/public-path";

const STATUSES: MovieStatus[] = ["想看", "在看", "已看"];
const MOVIE_KINDS: MovieKind[] = ["电影", "电视剧"];
const STATUS_COLOR: Record<MovieStatus, "outline" | "accent" | "default"> = { 想看: "outline", 在看: "accent", 已看: "default" };
const MAX_IMAGE_BYTES = 1024 * 1024;

const emptyForm = (): StoredMovie => ({ id: "", title: "", status: "想看", rating: 0, note: "", intro: "", reflection: "", kind: "电影", category: "", series: "", year: "", date: new Date().toISOString().slice(0, 10) });

const getMovieKind = (movie: StoredMovie): MovieKind => movie.kind ?? (movie.category?.startsWith("电视剧") ? "电视剧" : "电影");
const getCategoryLabel = (movie: StoredMovie): string => movie.category?.replace(/^(电影|电视剧)\s*·\s*/, "") || "未分类";

function Poster({ item, large = false }: { item: StoredMovie; large?: boolean }) {
  const src = item.coverDataUrl || withBasePath(item.cover);
  return <div className={`media-poster${large ? " media-poster-large" : ""}`}>{src ? <Image src={src} alt={`${item.title} 海报`} fill sizes={large ? "300px" : "(max-width: 640px) 44vw, 190px"} unoptimized={src.startsWith("data:")} /> : <div className="media-poster-placeholder"><span>SCREEN</span><strong>{item.title.slice(0, 2)}</strong></div>}<span className="media-poster-glow" aria-hidden="true" /></div>;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<StoredMovie[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<StoredMovie | null>(null);
  const [editing, setEditing] = useState<StoredMovie | null>(null);
  const [form, setForm] = useState<StoredMovie>(emptyForm());
  const [shared, setShared] = useState<StoredMovie[] | null>(null);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"全部" | "电影" | "电视剧">("全部");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const share = getShareParam();
    if (share) { const data = decodeShareData<StoredMovie[]>(share); if (Array.isArray(data)) setShared(data); }
    if (CAN_MANAGE_CONTENT) {
      store.seedLibrary(seedBooks, seedMovies, LIBRARY_SEED_VERSION);
      setMovies(store.getMovies());
    } else {
      setMovies(seedMovies);
    }
    setLoaded(true);
  }, []);

  const visibleMovies = shared ?? movies;
  const filtered = useMemo(() => visibleMovies.filter((movie) => {
    const haystack = `${movie.title} ${movie.series ?? ""} ${movie.category ?? ""}`.toLowerCase();
    const matchesKind = kind === "全部" || getMovieKind(movie) === kind;
    return (!query.trim() || haystack.includes(query.trim().toLowerCase())) && matchesKind;
  }), [kind, query, visibleMovies]);
  const groups = useMemo(() => MOVIE_KINDS.map((groupKind) => [groupKind, filtered.filter((movie) => getMovieKind(movie) === groupKind)] as const).filter(([, items]) => items.length > 0), [filtered]);
  const stats = { total: movies.length, watching: movies.filter((movie) => movie.status === "在看").length, done: movies.filter((movie) => movie.status === "已看").length };

  const refresh = () => setMovies(store.getMovies());
  const openNew = () => { setForm(emptyForm()); setEditing({ ...emptyForm(), id: "new" }); };
  const openEdit = (movie: StoredMovie) => { setSelected(null); setForm({ ...movie, kind: getMovieKind(movie), category: getCategoryLabel(movie) === "未分类" ? "" : getCategoryLabel(movie), intro: movie.intro ?? "", reflection: movie.reflection ?? movie.note }); setEditing(movie); };
  const closeEdit = () => setEditing(null);
  const onCover = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) { alert("图片不能超过 1MB，请压缩后再上传。"); event.target.value = ""; return; }
    const reader = new FileReader(); reader.onload = () => setForm((current) => ({ ...current, coverDataUrl: String(reader.result) })); reader.readAsDataURL(file); event.target.value = "";
  };
  const save = () => {
    if (!CAN_MANAGE_CONTENT) return;
    if (!form.title.trim()) return;
    const record: StoredMovie = { ...form, kind: form.kind ?? "电影", title: form.title.trim(), id: editing?.id && editing.id !== "new" ? editing.id : uid(), note: form.note || form.reflection || "" };
    if (!store.saveMovie(record)) { alert("保存失败：浏览器本地存储空间不足。请压缩图片或删除部分本地内容后重试。"); return; }
    refresh(); closeEdit();
  };
  const remove = (id: string) => { if (!CAN_MANAGE_CONTENT) return; if (confirm("确定从片库移除这部作品？")) { store.deleteMovie(id); refresh(); setSelected(null); } };
  const onImport = (data: unknown) => {
    if (!CAN_MANAGE_CONTENT) return;
    if (!Array.isArray(data)) { alert("备份格式不正确"); return; }
    data.filter((item) => item && typeof item === "object" && "title" in item).forEach((item) => store.saveMovie(item as StoredMovie)); refresh();
  };

  return <section className="library-page cinema-page" aria-label="影视馆藏"><div className="library-shell">
    <header className="library-header cinema-header"><div><Link className="library-back" href="/hobbies">← 兴趣爱好</Link><p className="library-kicker">PERSONAL SCREENING ROOM · 02</p><h1>光影片库</h1><p className="library-lede">收藏那些让时间暂停的银幕瞬间，也记录散场以后留下的声音。</p><div className="library-stats"><span><b>{loaded ? stats.total : "—"}</b> 部收藏</span><span><b>{loaded ? stats.watching : "—"}</b> 在看</span><span><b>{loaded ? stats.done : "—"}</b> 已看</span></div></div>{CAN_MANAGE_CONTENT && <div className="library-actions"><ShareExportBar data={movies} basePath="/hobbies/movies" filename="movies-backup.json" onImport={onImport} title="影视分享与备份" /><button className="btn btn-primary" onClick={openNew}>＋ 添加影视</button></div>}</header>
    {shared && <div className="share-banner">🔗 这是他人分享的只读片库（{shared.length} 部），不含图片。<Link href="/hobbies/movies">返回我的片库</Link></div>}
    <div className="library-toolbar cinema-toolbar"><label className="library-search"><span className="sr-only">搜索片名或系列</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索片名或系列" /><span aria-hidden="true">⌕</span></label><div className="library-filters" role="group" aria-label="作品类型">{["全部", ...MOVIE_KINDS].map((value) => <button key={value} className={kind === value ? "active" : ""} onClick={() => setKind(value as typeof kind)}>{value}</button>)}</div></div>
    {loaded && !filtered.length ? <div className="library-empty"><span>◌</span><h2>{movies.length ? "没有匹配的作品" : "片库还没有开场"}</h2><p>{movies.length ? "换一个关键词或类型试试。" : "添加第一张海报，开始记录你的观影轨迹。"}</p></div> : <div className="media-groups">{groups.map(([groupName, items]) => <section className="media-series" key={groupName}><div className="media-series-head"><div><span>{groupName === "电影" ? "FEATURE FILMS" : "TELEVISION"}</span><h2>{groupName}</h2></div><b>{String(items.length).padStart(2, "0")}</b></div><div className="media-grid">{items.map((movie) => <article className="media-card" key={movie.id}><button className="media-poster-button" onClick={() => setSelected(movie)} aria-label={`查看《${movie.title}》详情`}><Poster item={movie} /><span className="media-play" aria-hidden="true">▶</span></button><div className="media-card-copy"><div><button className="media-card-title" onClick={() => setSelected(movie)}>{movie.title}</button><p>{movie.year || "年份未知"} · {getCategoryLabel(movie)}</p></div><Tag size="sm" variant={STATUS_COLOR[movie.status]}>{movie.status}</Tag></div></article>)}</div></section>)}</div>}
  </div>

  <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.title ?? ""} wide>{selected && <div className="library-detail media-detail"><div className="library-detail-cover"><Poster item={selected} large /></div><div className="library-detail-copy"><div className="library-detail-meta"><Tag variant={STATUS_COLOR[selected.status]}>{selected.status}</Tag><span>{getMovieKind(selected)}</span><span>{getCategoryLabel(selected)}</span>{selected.year && <span>{selected.year}</span>}</div><p className="library-detail-author">{selected.series || "独立作品"}</p><section><h4>剧情简介</h4><p>{selected.intro || "这部作品还没有简介。"}</p></section><section><h4>观后感</h4><p>{selected.reflection || selected.note || "还没有写下观后感。"}</p></section><div className="library-detail-rating"><StarRating value={selected.rating} readOnly /><span>{selected.rating ? `${selected.rating}/5` : "暂未评分"}</span></div>{CAN_MANAGE_CONTENT && !shared && <div className="modal-actions library-detail-actions"><button className="btn btn-outline" onClick={() => openEdit(selected)}>编辑这部作品</button><button className="btn btn-ghost" style={{ color: "var(--color-error)" }} onClick={() => remove(selected.id)}>移出片库</button></div>}</div></div>}</Modal>

  <Modal open={editing !== null} onClose={closeEdit} title={editing?.id === "new" ? "添加一部影视作品" : "编辑片库收藏"} wide><div className="form-grid"><label className="field field-full"><span>海报图</span><div className="library-upload"><button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>▧ 上传海报</button><input ref={fileRef} type="file" accept="image/*" hidden onChange={onCover} />{form.coverDataUrl && <Image src={form.coverDataUrl} alt="海报预览" width={64} height={92} unoptimized />}</div></label><label className="field field-full"><span>名称 *</span><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="电影或电视剧名称" /></label><label className="field"><span>作品类型 *</span><div className="chip-row">{MOVIE_KINDS.map((movieKind) => <button key={movieKind} type="button" className={`chip-btn${(form.kind ?? "电影") === movieKind ? " chip-btn-active" : ""}`} onClick={() => setForm({ ...form, kind: movieKind })}>{movieKind}</button>)}</div></label><label className="field"><span>题材 / 分类</span><input value={form.category ?? ""} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="如：MCU、古装奇幻" /></label><label className="field"><span>系列（可选）</span><input value={form.series ?? ""} onChange={(event) => setForm({ ...form, series: event.target.value })} placeholder="如：复仇者联盟" /></label><label className="field"><span>年份</span><input value={form.year ?? ""} onChange={(event) => setForm({ ...form, year: event.target.value })} placeholder="年份" /></label><label className="field"><span>观看状态</span><div className="chip-row">{STATUSES.map((status) => <button key={status} type="button" className={`chip-btn${form.status === status ? " chip-btn-active" : ""}`} onClick={() => setForm({ ...form, status })}>{status}</button>)}</div></label><label className="field"><span>评分</span><StarRating value={form.rating} onChange={(value) => setForm({ ...form, rating: value })} /></label><label className="field field-full"><span>剧情简介</span><textarea rows={4} value={form.intro ?? ""} onChange={(event) => setForm({ ...form, intro: event.target.value })} placeholder="写下这部作品讲了什么…" /></label><label className="field field-full"><span>观后感</span><textarea rows={6} value={form.reflection ?? ""} onChange={(event) => setForm({ ...form, reflection: event.target.value })} placeholder="留下你的观看感受…" /></label><label className="field field-full"><span>一句话摘记</span><input value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="可选" /></label></div><div className="modal-actions"><button className="btn btn-outline" onClick={closeEdit}>取消</button><button className="btn btn-primary" disabled={!form.title.trim()} onClick={save}>保存到片库</button></div></Modal>
  </section>;
}
