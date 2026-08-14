import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { extname } from "node:path";

const output = new URL("../data/off-duty.json", import.meta.url);
const bilibiliProfile = "https://space.bilibili.com/384702367";
const steamProfile = "https://steamcommunity.com/profiles/76561199108776666/";
const animeMediaDir = new URL("../public/media/anime/", import.meta.url);

const headers = {
  "User-Agent": "Mozilla/5.0 (compatible; portfolio-sync/1.0)",
  Referer: bilibiliProfile,
};

async function loadCache() {
  try { return JSON.parse(await readFile(output, "utf8")); }
  catch { return { anime: [], games: [] }; }
}

async function fetchAnime() {
  const anime = [];
  let total = Infinity;
  for (let page = 1; anime.length < total; page += 1) {
    const response = await fetch(`https://api.bilibili.com/x/space/bangumi/follow/list?vmid=384702367&ps=30&pn=${page}&type=1`, { headers });
    if (!response.ok) throw new Error(`Bilibili returned ${response.status}`);
    const payload = await response.json();
    if (payload.code !== 0) throw new Error(`Bilibili API returned ${payload.code}`);
    const list = payload.data?.list ?? [];
    total = payload.data?.total ?? 0;
    anime.push(...list.map((item) => {
      const coverRemote = (item.square_cover || item.cover || "").replace(/^http:/, "https:");
      const extension = [".jpg", ".jpeg", ".png", ".webp"].includes(extname(new URL(coverRemote || "https://example.com/fallback.jpg").pathname).toLowerCase()) ? extname(new URL(coverRemote || "https://example.com/fallback.jpg").pathname).toLowerCase() : ".jpg";
      return {
      id: String(item.season_id),
      title: item.title,
      cover: `/media/anime/${item.season_id}${extension}`,
      coverRemote,
      href: item.url || `https://www.bilibili.com/bangumi/play/ss${item.season_id}`,
      kind: item.season_type_name || "番剧",
      progress: item.progress || item.new_ep?.index_show || (item.is_finish ? "已完结" : "追更中"),
      episodes: item.formal_ep_count || item.total_count || 0,
      score: item.rating?.score ?? null,
      tags: Array.isArray(item.styles) ? item.styles.join(" / ") : item.styles || "",
      status: item.follow_status === 2 ? "WATCHING" : item.is_finish ? "ARCHIVED" : "FOLLOWING",
    }; }));
    if (!list.length) break;
  }
  return anime;
}

async function cacheAnimeCovers(anime) {
  await mkdir(animeMediaDir, { recursive: true });
  const queue = [...anime];
  const worker = async () => {
    while (queue.length) {
      const item = queue.pop();
      const destination = new URL(`.${item.cover}`, new URL("../public/", import.meta.url));
      try { await access(destination); continue; }
      catch { /* Download only missing covers. */ }
      const response = await fetch(item.coverRemote, { headers: { ...headers, Referer: "https://www.bilibili.com/" } });
      if (!response.ok) throw new Error(`Cover ${item.id} returned ${response.status}`);
      await writeFile(destination, Buffer.from(await response.arrayBuffer()));
    }
  };
  await Promise.all(Array.from({ length: 8 }, worker));
}

async function fetchSteamGames() {
  const response = await fetch(`${steamProfile}games/?tab=all`, { headers: { ...headers, Referer: steamProfile } });
  if (!response.ok) throw new Error(`Steam returned ${response.status}`);
  const html = await response.text();
  const gameList = html.match(/var rgGames\s*=\s*(\[.*?\]);/s)?.[1];
  if (!gameList) throw new Error("Steam game list is unavailable. Confirm the profile and game details are public.");
  const parsed = JSON.parse(gameList);
  return parsed.map((game) => ({
    id: String(game.appid),
    appId: game.appid,
    title: game.name,
    cover: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
    href: `https://store.steampowered.com/app/${game.appid}/`,
    playtimeMinutes: game.hours_forever ? Math.round(game.hours_forever * 60) : 0,
    recentMinutes: game.hours_last_two_weeks ? Math.round(game.hours_last_two_weeks * 60) : 0,
  }));
}

const cache = await loadCache();
const warnings = [];
let anime = cache.anime;
let games = cache.games;

try { anime = await fetchAnime(); await cacheAnimeCovers(anime); }
catch (error) { warnings.push(`anime: ${error.message}`); }
try { games = await fetchSteamGames(); }
catch (error) { warnings.push(`steam: ${error.message}`); }

await writeFile(output, `${JSON.stringify({
  syncedAt: new Date().toISOString(),
  sources: { bilibili: bilibiliProfile, steam: steamProfile },
  anime,
  games,
  warnings,
}, null, 2)}\n`);

console.log(`Synced ${anime.length} anime and ${games.length} Steam games.`);
if (warnings.length) console.warn(warnings.join("\n"));
