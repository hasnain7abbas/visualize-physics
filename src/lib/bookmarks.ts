// LocalStorage-backed bookmarks + recently-visited tracking.
// Each entry is just a chapter id ("q1", "ss2", "g3", ...). The Sidebar uses
// `bookmarkedChapters` and `recentChapters` to render a "Pinned" and a
// "Recently visited" section above the static chapter list.

import { createSignal } from "solid-js";

const BM_KEY = "vphys.bookmarks";
const RC_KEY = "vphys.recent";
const RC_MAX = 8;

function load(key: string): string[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function save(key: string, value: string[]) {
  if (typeof localStorage === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}

const [bookmarks, setBookmarks] = createSignal<string[]>(load(BM_KEY));
const [recent, setRecent] = createSignal<string[]>(load(RC_KEY));

export const bookmarkedChapters = bookmarks;
export const recentChapters = recent;

export function isBookmarked(id: string): boolean {
  return bookmarks().includes(id);
}

export function toggleBookmark(id: string) {
  const cur = bookmarks();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  setBookmarks(next);
  save(BM_KEY, next);
}

/** Record a chapter visit. Most-recent first; deduped; capped at RC_MAX. */
export function recordVisit(id: string) {
  const cur = recent();
  const next = [id, ...cur.filter((x) => x !== id)].slice(0, RC_MAX);
  if (next.length === cur.length && next.every((v, i) => v === cur[i])) return;
  setRecent(next);
  save(RC_KEY, next);
}

export function clearRecent() {
  setRecent([]);
  save(RC_KEY, []);
}
