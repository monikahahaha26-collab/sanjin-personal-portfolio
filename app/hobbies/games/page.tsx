"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { GAME_SEED_VERSION, seedGames } from "@/data/library";
import { store, uid, type GamePlatform, type GameStatus, type StoredGame } from "@/lib/store";
import { decodeShareData, getShareParam } from "@/lib/share";
import { Modal } from "@/components/ui/Modal";
import { ShareExportBar } from "@/components/ui/ShareExportBar";
import { StarRating } from "@/components/ui/StarRating";
import { Tag } from "@/components/ui/Tag";
import { CAN_MANAGE_CONTENT } from "@/lib/site-mode";
import { withBasePath } from "@/lib/public-path";

const PLATFORMS: GamePlatform[] = ["Steam", "手机游戏", "主机游戏"];
const STATUSES: GameStatus[] = ["想玩", "在玩", "已通关", "暂时搁置"];
const PLATFORM_LABEL: Record<GamePlatform, string> = { Steam: "PC LIBRARY", 手机游戏: "MOBILE", 主机游戏: "CONSOLE & HANDHELD" };
const STATUS_COLOR: Record<GameStatus, "outline" | "accent" | "default"> = { 想玩: "outline", 在玩: "accent", 已通关: "default", 暂时搁置: "outline" };
const MAX_IMAGE_BYTES = 1024 * 1024;

const emptyForm = (): StoredGame => ({ id: "", title: "", platform: "Steam", device: "PC · Steam", status: "想玩", rating: 0, note: "", intro: "", reflection: "", category: "", year: "", date: new Date().toISOString().slice(0, 10) });

function GameCover({ item, large = false }: { item: StoredGame; large?: boolean }) {
  const src = item.coverDataUrl || withBasePath(item.cover);
  return <div className={`media-poster game-cover${large ? " media-poster-large" : ""}`}>{src ? <Image src={src} alt={`${item.title} 游戏封面`} fill sizes={large ? "300px" : "(max-width: 640px) 44vw, 190px"} unoptimized={src.startsWith("data:")} /> : <div className="media-poster-placeholder game-cover-placeholder"><span>PLAYER 01</span><strong>{item.title.slice(0, 2)}</strong></div>}<span className="media-poster-glow" aria-hidden="true" /></div>;
}

export default function GamesPage() {
  const [games, setGames] = useState<StoredGame[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<StoredGame | null>(null);
  const [editing, setEditing] = useState<StoredGame | null>(null);
  const [form, setForm] = useState<StoredGame>(emptyForm());
  const [shared, setShared] = useState<StoredGame[] | null>(null);
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<"全部" | GamePlatform>("全部");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const share = getShareParam();
    if (share) { const data = decodeShareData<StoredGame[]>(share); if (Array.isArray(data)) setShared(data); }
    if (CAN_MANAGE_CONTENT) {
      store.seedGames(seedGames, GAME_SEED_VERSION);
      setGames(store.getGames());
    } else {
      setGames(seedGames);
    }
    setLoaded(true);
  }, []);

  const visibleGames = shared ?? games;
  const filtered = useMemo(() => visibleGames.filter((game) => {
    const haystack = `${game.title} ${game.platform} ${game.device ?? ""} ${game.category ?? ""}`.toLowerCase();
    return (platform === "全部" || game.platform === platform) && (!query.trim() || haystack.includes(query.trim().toLowerCase()));
  }), [platform, query, visibleGames]);
  const groups = useMemo(() => PLATFORMS.map((group) => [group, filtered.filter((game) => game.platform === group)] as const).filter(([, items]) => items.length), [filtered]);
  const stats = { total: games.length, playing: games.filter((game) => game.status === "在玩").length, finished: games.filter((game) => game.status === "已通关").length };

  const refresh = () => setGames(store.getGames());
  const openNew = () => { setForm(emptyForm()); setEditing({ ...emptyForm(), id: "new" }); };
  const openEdit = (game: StoredGame) => { setSelected(null); setForm({ ...game, reflection: game.reflection ?? game.note, intro: game.intro ?? "" }); setEditing(game); };
  const closeEdit = () => setEditing(null);
  const choosePlatform = (next: GamePlatform) => setForm({ ...form, platform: next, device: next === "Steam" ? "PC · Steam" : next === "手机游戏" ? "iOS · Android" : "Nintendo Switch" });
  const onCover = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) { alert("图片不能超过 1MB，请压缩后再上传。"); event.target.value = ""; return; }
    const reader = new FileReader(); reader.onload = () => setForm((current) => ({ ...current, coverDataUrl: String(reader.result) })); reader.readAsDataURL(file); event.target.value = "";
  };
  const save = () => {
    if (!CAN_MANAGE_CONTENT) return;
    if (!form.title.trim()) return;
    const record: StoredGame = { ...form, title: form.title.trim(), id: editing?.id && editing.id !== "new" ? editing.id : uid(), note: form.note || form.reflection || "" };
    if (!store.saveGame(record)) { alert("保存失败：浏览器本地存储空间不足。请压缩图片或删除部分本地内容后重试。"); return; }
    refresh(); closeEdit();
  };
  const remove = (id: string) => { if (!CAN_MANAGE_CONTENT) return; if (confirm("确定从游戏库移除这款游戏？")) { store.deleteGame(id); refresh(); setSelected(null); } };
  const onImport = (data: unknown) => {
    if (!CAN_MANAGE_CONTENT) return;
    if (!Array.isArray(data)) { alert("备份格式不正确"); return; }
    data.filter((item) => item && typeof item === "object" && "title" in item && "platform" in item).forEach((item) => store.saveGame(item as StoredGame)); refresh();
  };

  return <section className="library-page games-page" aria-label="游戏收藏库"><div className="library-shell">
    <header className="library-header games-header"><div><Link className="library-back" href="/hobbies">← 兴趣爱好</Link><p className="library-kicker">PERSONAL GAME ARCHIVE · 03</p><h1>游戏存档室</h1><p className="library-lede">从键鼠到掌机，把走过的世界、赢下的对局和没舍得删的存档留在这里。</p><div className="library-stats"><span><b>{loaded ? stats.total : "—"}</b> 款收藏</span><span><b>{loaded ? stats.playing : "—"}</b> 正在玩</span><span><b>{loaded ? stats.finished : "—"}</b> 已通关</span></div></div>{CAN_MANAGE_CONTENT && <div className="library-actions"><ShareExportBar data={games} basePath="/hobbies/games" filename="games-backup.json" onImport={onImport} title="游戏分享与备份" /><button className="btn btn-primary" onClick={openNew}>＋ 添加游戏</button></div>}</header>
    {shared && <div className="share-banner">这是他人分享的只读游戏库（{shared.length} 款），不含图片。<Link href="/hobbies/games">返回我的游戏库</Link></div>}
    <div className="library-toolbar games-toolbar reveal"><label className="library-search"><span className="sr-only">搜索游戏或设备</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索游戏、类型或设备" /><span aria-hidden="true">⌕</span></label><div className="library-filters" role="group" aria-label="游戏平台">{["全部", ...PLATFORMS].map((value) => <button key={value} className={platform === value ? "active" : ""} onClick={() => setPlatform(value as typeof platform)}>{value}</button>)}</div></div>
    {loaded && !filtered.length ? <div className="library-empty"><span>＋</span><h2>{games.length ? "没有找到这款游戏" : "游戏库还没有存档"}</h2><p>{games.length ? "换一个关键词或平台试试。" : "添加第一张封面，记录下一段游玩经历。"}</p></div> : <div className="media-groups games-groups">{groups.map(([groupName, items], groupIndex) => <section className="media-series reveal" key={groupName} style={{ ["--reveal-delay" as string]: `${groupIndex * 90}ms` }}><div className="media-series-head games-group-head"><div><span>{PLATFORM_LABEL[groupName]}</span><h2>{groupName}</h2></div><b>{String(items.length).padStart(2, "0")}</b></div><div className="media-grid games-grid">{items.map((game) => <article className="media-card game-card" key={game.id}><button className="media-poster-button" onClick={() => setSelected(game)} aria-label={`查看《${game.title}》详情`}><GameCover item={game} /><span className="game-open" aria-hidden="true">OPEN</span></button><div className="media-card-copy"><div><button className="media-card-title" onClick={() => setSelected(game)}>{game.title}</button><p>{game.device || game.platform} · {game.year || "年份未知"}</p></div><Tag size="sm" variant={STATUS_COLOR[game.status]}>{game.status}</Tag></div></article>)}</div></section>)}</div>}
  </div>

  <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.title ?? ""} wide>{selected && <div className="library-detail media-detail game-detail"><div className="library-detail-cover"><GameCover item={selected} large /></div><div className="library-detail-copy"><div className="library-detail-meta"><Tag variant={STATUS_COLOR[selected.status]}>{selected.status}</Tag><span>{selected.platform}</span>{selected.device && <span>{selected.device}</span>}{selected.year && <span>{selected.year}</span>}</div><p className="library-detail-author">{selected.category || "未分类"}</p><section><h4>游戏简介</h4><p>{selected.intro || "这款游戏还没有简介。"}</p></section><section><h4>游玩感受</h4><p>{selected.reflection || selected.note || "还没有写下游玩感受。"}</p></section><div className="library-detail-rating"><StarRating value={selected.rating} readOnly /><span>{selected.rating ? `${selected.rating}/5` : "暂未评分"}</span></div>{CAN_MANAGE_CONTENT && !shared && <div className="modal-actions library-detail-actions"><button className="btn btn-outline" onClick={() => openEdit(selected)}>编辑这款游戏</button><button className="btn btn-ghost" style={{ color: "var(--color-error)" }} onClick={() => remove(selected.id)}>移出游戏库</button></div>}</div></div>}</Modal>

  <Modal open={editing !== null} onClose={closeEdit} title={editing?.id === "new" ? "添加一款游戏" : "编辑游戏存档"} wide><div className="form-grid"><label className="field field-full"><span>游戏封面</span><div className="library-upload"><button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>▧ 上传封面</button><input ref={fileRef} type="file" accept="image/*" hidden onChange={onCover} />{form.coverDataUrl && <Image src={form.coverDataUrl} alt="封面预览" width={64} height={92} unoptimized />}</div></label><label className="field field-full"><span>游戏名称 *</span><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="填写完整游戏名称" /></label><label className="field field-full"><span>平台 *</span><div className="chip-row">{PLATFORMS.map((value) => <button key={value} type="button" className={`chip-btn${form.platform === value ? " chip-btn-active" : ""}`} onClick={() => choosePlatform(value)}>{value}</button>)}</div></label><label className="field"><span>设备 / 商店</span><input value={form.device ?? ""} onChange={(event) => setForm({ ...form, device: event.target.value })} placeholder="如：Nintendo Switch、3DS" /></label><label className="field"><span>类型</span><input value={form.category ?? ""} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="如：动作角色扮演" /></label><label className="field"><span>发行年份</span><input value={form.year ?? ""} onChange={(event) => setForm({ ...form, year: event.target.value })} placeholder="年份" /></label><label className="field"><span>游玩状态</span><div className="chip-row">{STATUSES.map((status) => <button key={status} type="button" className={`chip-btn${form.status === status ? " chip-btn-active" : ""}`} onClick={() => setForm({ ...form, status })}>{status}</button>)}</div></label><label className="field"><span>评分</span><StarRating value={form.rating} onChange={(value) => setForm({ ...form, rating: value })} /></label><label className="field field-full"><span>游戏简介</span><textarea rows={4} value={form.intro ?? ""} onChange={(event) => setForm({ ...form, intro: event.target.value })} placeholder="简单介绍玩法、世界和故事…" /></label><label className="field field-full"><span>游玩感受</span><textarea rows={6} value={form.reflection ?? ""} onChange={(event) => setForm({ ...form, reflection: event.target.value })} placeholder="写下最难忘的机制、角色或瞬间…" /></label><label className="field field-full"><span>一句话摘记</span><input value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="可选" /></label></div><div className="modal-actions"><button className="btn btn-outline" onClick={closeEdit}>取消</button><button className="btn btn-primary" disabled={!form.title.trim()} onClick={save}>保存到游戏库</button></div></Modal>
  </section>;
}
