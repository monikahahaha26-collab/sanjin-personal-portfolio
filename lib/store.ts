"use client";

/**
 * 本地数据持久化层（localStorage）
 * 覆盖：作者新增的项目 / 博客文章 / 读书 / 影视 / 游戏五类数据。
 * 纯前端方案：兼容静态导出与 GitHub Pages，刷新不丢失。
 */

export interface StoredProject {
  id: string;
  title: string;
  summary: string;
  date: string; // YYYY-MM
  tags: string[];
  role: string;
  period: string;
  body: string; // markdown
  coverDataUrl?: string; // base64 图片
  demo?: string;
  repo?: string;
}

export interface StoredPost {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  excerpt: string;
  tags: string[];
  body: string; // markdown，可含 base64 图片
  coverDataUrl?: string;
}

export type BookStatus = "想读" | "在读" | "已读";
export interface StoredBook {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  rating: number; // 1-5
  note: string; // 兼容旧数据的短评
  intro?: string; // 作品简介
  reflection?: string; // 读后感
  category?: string;
  year?: string;
  cover?: string; // 内置封面路径
  date: string; // 记录日期
  coverDataUrl?: string; // 封面图片（base64）
}

export type MovieStatus = "想看" | "在看" | "已看";
export type MovieKind = "电影" | "电视剧";
export interface StoredMovie {
  id: string;
  title: string;
  status: MovieStatus;
  rating: number; // 1-5
  note: string; // 兼容旧数据的短评
  intro?: string; // 作品简介
  reflection?: string; // 观后感
  kind?: MovieKind;
  category?: string;
  series?: string;
  year?: string;
  cover?: string; // 内置海报路径
  date: string;
  coverDataUrl?: string; // 封面图片（base64）
}

export type GameStatus = "想玩" | "在玩" | "已通关" | "暂时搁置";
export type GamePlatform = "Steam" | "手机游戏" | "主机游戏";
export interface StoredGame {
  id: string;
  title: string;
  platform: GamePlatform;
  device?: string;
  status: GameStatus;
  rating: number;
  note: string;
  intro?: string;
  reflection?: string;
  category?: string;
  year?: string;
  cover?: string;
  date: string;
  coverDataUrl?: string;
}

const KEYS = {
  projects: "sanjin:projects",
  posts: "sanjin:posts",
  books: "sanjin:books",
  movies: "sanjin:movies",
  librarySeed: "sanjin:library-seed",
  games: "sanjin:games",
  gameSeed: "sanjin:game-seed",
} as const;

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
    return true;
  } catch {
    console.warn(`[store] 保存失败：${key} 可能超出 localStorage 容量`);
    return false;
  }
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const store = {
  seedLibrary: (books: StoredBook[], movies: StoredMovie[], version: string) => {
    if (typeof window === "undefined" || window.localStorage.getItem(KEYS.librarySeed) === version) return;
    const currentBooks = read<StoredBook>(KEYS.books);
    const currentMovies = read<StoredMovie>(KEYS.movies);
    const bookIds = new Set(currentBooks.map((book) => book.id));
    const movieIds = new Set(currentMovies.map((movie) => movie.id));
    const missingBooks = books.filter((book) => !bookIds.has(book.id));
    const missingMovies = movies.filter((movie) => !movieIds.has(movie.id));
    write(KEYS.books, [...missingBooks, ...currentBooks]);
    write(KEYS.movies, [...missingMovies, ...currentMovies]);
    window.localStorage.setItem(KEYS.librarySeed, version);
  },
  seedGames: (games: StoredGame[], version: string) => {
    if (typeof window === "undefined" || window.localStorage.getItem(KEYS.gameSeed) === version) return;
    const currentGames = read<StoredGame>(KEYS.games);
    const customGames = currentGames.filter((game) => !game.id.startsWith("seed-game-"));
    write(KEYS.games, [...games, ...customGames]);
    window.localStorage.setItem(KEYS.gameSeed, version);
  },
  // ── 项目 ──
  getProjects: () => read<StoredProject>(KEYS.projects),
  saveProject: (p: StoredProject) => {
    const list = read<StoredProject>(KEYS.projects);
    const i = list.findIndex((x) => x.id === p.id);
    if (i >= 0) list[i] = p;
    else list.unshift(p);
    return write(KEYS.projects, list);
  },
  deleteProject: (id: string) => write(KEYS.projects, read<StoredProject>(KEYS.projects).filter((x) => x.id !== id)),

  // ── 博客文章 ──
  getPosts: () => read<StoredPost>(KEYS.posts),
  savePost: (p: StoredPost) => {
    const list = read<StoredPost>(KEYS.posts);
    const i = list.findIndex((x) => x.id === p.id);
    if (i >= 0) list[i] = p;
    else list.unshift(p);
    return write(KEYS.posts, list);
  },
  deletePost: (id: string) => write(KEYS.posts, read<StoredPost>(KEYS.posts).filter((x) => x.id !== id)),

  // ── 读书 ──
  getBooks: () => read<StoredBook>(KEYS.books),
  saveBook: (b: StoredBook) => {
    const list = read<StoredBook>(KEYS.books);
    const i = list.findIndex((x) => x.id === b.id);
    if (i >= 0) list[i] = b;
    else list.unshift(b);
    return write(KEYS.books, list);
  },
  deleteBook: (id: string) => write(KEYS.books, read<StoredBook>(KEYS.books).filter((x) => x.id !== id)),

  // ── 影视 ──
  getMovies: () => read<StoredMovie>(KEYS.movies),
  saveMovie: (m: StoredMovie) => {
    const list = read<StoredMovie>(KEYS.movies);
    const i = list.findIndex((x) => x.id === m.id);
    if (i >= 0) list[i] = m;
    else list.unshift(m);
    return write(KEYS.movies, list);
  },
  deleteMovie: (id: string) => write(KEYS.movies, read<StoredMovie>(KEYS.movies).filter((x) => x.id !== id)),

  // ── 游戏 ──
  getGames: () => read<StoredGame>(KEYS.games),
  saveGame: (g: StoredGame) => {
    const list = read<StoredGame>(KEYS.games);
    const i = list.findIndex((x) => x.id === g.id);
    if (i >= 0) list[i] = g;
    else list.unshift(g);
    return write(KEYS.games, list);
  },
  deleteGame: (id: string) => write(KEYS.games, read<StoredGame>(KEYS.games).filter((x) => x.id !== id)),
};
