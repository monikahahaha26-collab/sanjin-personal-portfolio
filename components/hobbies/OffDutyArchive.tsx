"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { withBasePath } from "@/lib/public-path";

type Anime = { id: string; title: string; cover: string; href: string; kind: string; progress: string; episodes: number; score: number | null; tags: string; status: string };
type Game = { id: string; appId: number; title: string; cover: string; href: string; playtimeMinutes: number; recentMinutes: number };

export function OffDutyArchive({ anime, games, sources, syncedAt, warnings }: { anime: Anime[]; games: Game[]; sources: { bilibili: string; steam: string }; syncedAt: string; warnings?: string[] }) {
  const [tab, setTab] = useState<"anime" | "games">("anime");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(24);
  const records = tab === "anime" ? anime : games;
  const filtered = useMemo(() => records.filter((item) => item.title.toLowerCase().includes(query.trim().toLowerCase())), [records, query]);
  const source = tab === "anime" ? sources.bilibili : sources.steam;

  const switchTab = (next: "anime" | "games") => { setTab(next); setQuery(""); setVisible(24); };
  return <section className="media-archive" aria-label="追番与游戏档案">
    <div className="archive-topline"><span><i /> LIVE ARCHIVE / {syncedAt ? new Date(syncedAt).toLocaleDateString("zh-CN") : "CACHE"}</span><a href={source} target="_blank" rel="noreferrer">打开 {tab === "anime" ? "Bilibili 追番" : "Steam 主页"} ↗</a></div>
    <header className="media-archive-head"><div><p>OFF DUTY / PERSONAL INPUTS</p><h1>我的另一组<br /><em>长期数据。</em></h1><span>不是装饰性的兴趣标签。这里保留所有公开追番与游戏条目，并直接回到来源平台。</span></div><div className="archive-stat-stack"><b>{anime.length}</b><small>FOLLOWED ANIME</small><b>{games.length}</b><small>STEAM GAMES</small></div></header>
    <div className="archive-controls"><div className="archive-tabs" role="tablist" aria-label="兴趣档案分类"><button className={tab === "anime" ? "active" : ""} onClick={() => switchTab("anime")} role="tab" aria-selected={tab === "anime"}>ANIME ARCHIVE <b>{anime.length}</b></button><button className={tab === "games" ? "active" : ""} onClick={() => switchTab("games")} role="tab" aria-selected={tab === "games"}>GAME SAVE FILES <b>{games.length}</b></button></div><label className="archive-search"><span>SEARCH</span><input value={query} onChange={(event) => { setQuery(event.target.value); setVisible(24); }} placeholder={tab === "anime" ? "搜索 365 部追番" : "搜索 Steam 游戏"} /></label></div>
    {warnings?.length ? <p className="archive-warning">同步状态：{warnings.join(" · ")}。将保留上次成功缓存。</p> : null}
    <div className="cover-wall">{filtered.slice(0, visible).map((item) => <a className="cover-card" key={item.id} href={item.href} target="_blank" rel="noreferrer"><div className="cover-image">{item.cover ? <Image src={withBasePath(item.cover) ?? item.cover} alt={`${item.title} 封面`} fill sizes="(max-width: 640px) 46vw, (max-width: 1000px) 22vw, 15vw" unoptimized /> : <span>NO COVER</span>}<i /></div><div className="cover-copy"><h2>{item.title}</h2>{tab === "anime" ? <p>{(item as Anime).kind} · {(item as Anime).progress}</p> : <p>{Math.round((item as Game).playtimeMinutes / 60)}h PLAYTIME</p>}</div></a>)}</div>
    {!filtered.length ? <div className="archive-empty">当前没有可展示的公开记录。请确认对应平台的资料库为公开状态。</div> : null}
    {visible < filtered.length ? <button className="load-more" onClick={() => setVisible((current) => current + 36)}>LOAD MORE / {filtered.length - visible} REMAINING</button> : <p className="archive-complete">END OF ARCHIVE / {filtered.length} RECORDS</p>}
  </section>;
}
