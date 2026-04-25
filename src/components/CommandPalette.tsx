import { Component, For, Show, createSignal, createMemo, onCleanup, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { allChapters } from "../lib/chapters-data";

// Build a search index over chapters and their sections.
type Entry = {
  kind: "chapter" | "section";
  chapterId: string;
  sectionId?: string;
  num: string;
  title: string;
  description: string;
  color: string;
  icon: string;
};

function buildIndex(): Entry[] {
  const out: Entry[] = [];
  for (const ch of allChapters) {
    out.push({
      kind: "chapter",
      chapterId: ch.id,
      num: ch.num,
      title: ch.title,
      description: ch.shortDesc ?? ch.description ?? "",
      color: ch.color,
      icon: ch.icon,
    });
    for (const s of ch.sections) {
      out.push({
        kind: "section",
        chapterId: ch.id,
        sectionId: s.id,
        num: ch.num,
        title: s.title,
        description: ch.title,
        color: ch.color,
        icon: ch.icon,
      });
    }
  }
  return out;
}

// Cheap fuzzy match: each query word must appear (case-insensitive) somewhere
// in title + description + chapter num. Score = sum of inverse positions, with
// a big bonus for matches inside the title.
function score(entry: Entry, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const haystackTitle = (entry.num + " " + entry.title).toLowerCase();
  const haystackAll = (entry.num + " " + entry.title + " " + entry.description).toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  let total = 0;
  for (const w of words) {
    const tIdx = haystackTitle.indexOf(w);
    const aIdx = haystackAll.indexOf(w);
    if (aIdx === -1) return -1;
    total += tIdx >= 0 ? 100 - tIdx : 25 - Math.min(20, aIdx);
  }
  // Prefer chapters slightly over sections at equal score so the chapter
  // header bubbles up when its title matches.
  if (entry.kind === "chapter") total += 1;
  return total;
}

const [paletteOpen, setPaletteOpen] = createSignal(false);
export { paletteOpen, setPaletteOpen };

export const CommandPalette: Component = () => {
  const navigate = useNavigate();
  const [query, setQuery] = createSignal("");
  const [highlight, setHighlight] = createSignal(0);
  let inputEl: HTMLInputElement | undefined;

  const index = buildIndex();

  const results = createMemo(() => {
    const q = query();
    if (!q.trim()) {
      // Empty query: show first 12 chapters (alphabetical-ish — by chapter num)
      return index.filter((e) => e.kind === "chapter").slice(0, 12);
    }
    const ranked = index
      .map((e) => ({ entry: e, s: score(e, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 25)
      .map((x) => x.entry);
    return ranked;
  });

  const close = () => {
    setPaletteOpen(false);
    setQuery("");
    setHighlight(0);
  };

  const open = (entry: Entry) => {
    if (entry.kind === "chapter") {
      navigate(`/chapter/${entry.chapterId}`);
    } else {
      navigate(`/chapter/${entry.chapterId}`);
      // Section selection isn't deep-linked yet; chapter page resets to index 0.
    }
    close();
  };

  const onKey = (e: KeyboardEvent) => {
    // Open with Cmd/Ctrl+K from anywhere
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setPaletteOpen(true);
      setTimeout(() => inputEl?.focus(), 30);
      return;
    }
    if (!paletteOpen()) return;
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const r = results();
      if (r.length) setHighlight((h) => (h + 1) % r.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const r = results();
      if (r.length) setHighlight((h) => (h - 1 + r.length) % r.length);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const r = results();
      if (r[highlight()]) open(r[highlight()]);
      return;
    }
  };

  onMount(() => {
    window.addEventListener("keydown", onKey);
    onCleanup(() => window.removeEventListener("keydown", onKey));
  });

  return (
    <Show when={paletteOpen()}>
      <div
        class="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4"
        style={{ "background-color": "rgba(0,0,0,0.55)", "backdrop-filter": "blur(4px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <div
          class="w-full max-w-xl rounded-2xl overflow-hidden"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", "box-shadow": "0 20px 60px rgba(0,0,0,0.4)" }}
        >
          {/* Search input */}
          <div class="flex items-center gap-2 px-4 py-3 border-b" style={{ "border-color": "var(--border-light)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputEl}
              type="text"
              autofocus
              placeholder="Search chapters and simulations…"
              value={query()}
              onInput={(e) => { setQuery(e.currentTarget.value); setHighlight(0); }}
              class="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "var(--text-primary)" }}
            />
            <kbd class="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>Esc</kbd>
          </div>

          {/* Results */}
          <div class="max-h-[50vh] overflow-y-auto">
            <Show
              when={results().length > 0}
              fallback={
                <div class="px-4 py-8 text-sm text-center" style={{ color: "var(--text-muted)" }}>
                  No matches.
                </div>
              }
            >
              <For each={results()}>
                {(r, i) => (
                  <button
                    onClick={() => open(r)}
                    onMouseEnter={() => setHighlight(i())}
                    class="w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors"
                    style={{
                      background: highlight() === i() ? `${r.color}15` : "transparent",
                      "border-left": highlight() === i() ? `3px solid ${r.color}` : "3px solid transparent",
                    }}
                  >
                    <span class="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: `${r.color}20` }}>
                      {r.icon}
                    </span>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <span class="text-[9px] font-bold tracking-wide" style={{ color: r.color }}>{r.num}</span>
                        <span class="text-[12px] font-medium truncate" style={{ color: "var(--text-primary)" }}>{r.title}</span>
                        <Show when={r.kind === "section"}>
                          <span class="text-[9px] uppercase tracking-widest font-semibold ml-auto" style={{ color: "var(--text-muted)" }}>section</span>
                        </Show>
                      </div>
                      <div class="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>{r.description}</div>
                    </div>
                  </button>
                )}
              </For>
            </Show>
          </div>

          {/* Footer hint */}
          <div class="flex items-center gap-3 px-4 py-2 border-t text-[10px]" style={{ "border-color": "var(--border-light)", color: "var(--text-muted)" }}>
            <span><kbd class="font-mono px-1 rounded" style={{ background: "var(--bg-secondary)" }}>↑↓</kbd> navigate</span>
            <span><kbd class="font-mono px-1 rounded" style={{ background: "var(--bg-secondary)" }}>↵</kbd> open</span>
            <span class="ml-auto"><kbd class="font-mono px-1 rounded" style={{ background: "var(--bg-secondary)" }}>{navigator.platform.toLowerCase().includes("mac") ? "⌘" : "Ctrl"}+K</kbd> toggle</span>
          </div>
        </div>
      </div>
    </Show>
  );
};
