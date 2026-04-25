import { Component, For, Show } from "solid-js";
import { A, useLocation, useNavigate } from "@solidjs/router";
import { CatLogo } from "./CatLogo";
import { theme, toggleTheme } from "../lib/theme";
import { chapterGroups, getChapter } from "../lib/chapters-data";
import { sidebarOpen, setSidebarOpen } from "./Layout";
import { bookmarkedChapters, recentChapters } from "../lib/bookmarks";
import { setPaletteOpen } from "./CommandPalette";

export const Sidebar: Component = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const goTo = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <aside
      class="fixed top-0 left-0 h-screen flex flex-col border-r z-50 transition-transform duration-300"
      classList={{
        "-translate-x-full lg:translate-x-0": !sidebarOpen(),
        "translate-x-0": sidebarOpen(),
      }}
      style={{
        width: "var(--sidebar-width)",
        background: "var(--bg-sidebar)",
        "border-color": "var(--border)",
      }}
    >
      {/* Logo */}
      <div
        class="flex items-center gap-3 px-4 sm:px-5 py-4 border-b cursor-pointer transition-colors hover:opacity-80"
        style={{ "border-color": "var(--border-light)" }}
        onClick={() => goTo("/")}
      >
        <div class="animate-float">
          <CatLogo size={34} />
        </div>
        <div>
          <div class="font-bold text-sm tracking-tight" style={{ color: "var(--text-primary)" }}>
            Visualize Physics
          </div>
          <div class="text-[10px] font-medium tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
            Interactive Lab
          </div>
        </div>
        {/* Close button on mobile */}
        <button
          class="ml-auto lg:hidden w-7 h-7 flex items-center justify-center rounded-lg"
          style={{ background: "var(--bg-secondary)" }}
          onClick={(e) => { e.stopPropagation(); setSidebarOpen(false); }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Search trigger */}
      <div class="px-2 sm:px-3 pt-2 sm:pt-3">
        <button
          onClick={() => setPaletteOpen(true)}
          class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all hover:opacity-90"
          style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", border: "1px solid var(--border-light)" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>Search…</span>
          <span class="ml-auto flex items-center gap-0.5">
            <kbd class="text-[9px] px-1 py-0.5 rounded font-mono" style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}>
              {typeof navigator !== "undefined" && navigator.platform.toLowerCase().includes("mac") ? "\u2318" : "Ctrl"}
            </kbd>
            <kbd class="text-[9px] px-1 py-0.5 rounded font-mono" style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}>K</kbd>
          </span>
        </button>
      </div>

      {/* Chapter groups */}
      <nav class="flex-1 overflow-y-auto py-2 px-2 sm:px-3">
        {/* Pinned chapters */}
        <Show when={bookmarkedChapters().length > 0}>
          <div class="mb-2 sm:mb-3">
            <div class="px-2 pt-2 sm:pt-3 pb-1 sm:pb-1.5 flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <div class="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                Pinned
              </div>
            </div>
            <For each={bookmarkedChapters()}>
              {(id) => {
                const ch = getChapter(id);
                if (!ch) return null;
                const isActive = () => location.pathname === `/chapter/${ch.id}`;
                return (
                  <div
                    class="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg mb-0.5 transition-all group cursor-pointer"
                    style={{
                      background: isActive() ? `${ch.color}12` : "transparent",
                      "border-left": isActive() ? `3px solid ${ch.color}` : "3px solid transparent",
                    }}
                    onClick={() => goTo(`/chapter/${ch.id}`)}
                  >
                    <span class="text-xs flex-shrink-0">{ch.icon}</span>
                    <span class="text-[9px] font-bold tracking-wide" style={{ color: ch.color, opacity: 0.7 }}>{ch.num}</span>
                    <span class="text-[12px] font-medium truncate" style={{ color: isActive() ? ch.color : "var(--text-primary)" }}>{ch.title}</span>
                  </div>
                );
              }}
            </For>
          </div>
        </Show>

        {/* Recently visited */}
        <Show when={recentChapters().length > 1}>
          <div class="mb-2 sm:mb-3">
            <div class="px-2 pt-2 sm:pt-3 pb-1 sm:pb-1.5">
              <div class="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                Recently visited
              </div>
            </div>
            <For each={recentChapters().slice(0, 5)}>
              {(id) => {
                const ch = getChapter(id);
                if (!ch) return null;
                const isActive = () => location.pathname === `/chapter/${ch.id}`;
                return (
                  <div
                    class="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg mb-0.5 transition-all cursor-pointer"
                    style={{
                      background: isActive() ? `${ch.color}12` : "transparent",
                      "border-left": isActive() ? `3px solid ${ch.color}` : "3px solid transparent",
                    }}
                    onClick={() => goTo(`/chapter/${ch.id}`)}
                  >
                    <span class="text-xs flex-shrink-0 opacity-70">{ch.icon}</span>
                    <span class="text-[9px] font-bold tracking-wide" style={{ color: ch.color, opacity: 0.6 }}>{ch.num}</span>
                    <span class="text-[12px] truncate" style={{ color: "var(--text-secondary)" }}>{ch.title}</span>
                  </div>
                );
              }}
            </For>
          </div>
        </Show>

        <For each={chapterGroups}>
          {(group) => (
            <div class="mb-2 sm:mb-3">
              <div class="px-2 pt-2 sm:pt-3 pb-1 sm:pb-1.5">
                <div class="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  {group.title}
                </div>
                <div class="text-[9px] mt-0.5 hidden sm:block" style={{ color: "var(--text-muted)", opacity: 0.6 }}>
                  {group.subtitle}
                </div>
              </div>

              <For each={group.chapters}>
                {(ch) => {
                  const isActive = () => location.pathname === `/chapter/${ch.id}`;
                  return (
                    <div
                      class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 transition-all group cursor-pointer"
                      style={{
                        background: isActive() ? `${ch.color}12` : "transparent",
                        "border-left": isActive() ? `3px solid ${ch.color}` : "3px solid transparent",
                      }}
                      onClick={() => goTo(`/chapter/${ch.id}`)}
                    >
                      <span
                        class="w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 transition-transform group-hover:scale-110"
                        style={{ background: `${ch.color}15` }}
                      >
                        {ch.icon}
                      </span>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-1.5">
                          <span class="text-[9px] font-bold tracking-wide" style={{ color: ch.color, opacity: 0.7 }}>
                            {ch.num}
                          </span>
                          <span
                            class="text-[12px] font-medium truncate"
                            style={{ color: isActive() ? ch.color : "var(--text-primary)" }}
                          >
                            {ch.title}
                          </span>
                        </div>
                        <div class="text-[9px] truncate" style={{ color: "var(--text-muted)" }}>
                          {ch.shortDesc}
                        </div>
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>
          )}
        </For>
      </nav>

      {/* Theme toggle */}
      <div class="px-3 py-3 border-t" style={{ "border-color": "var(--border-light)" }}>
        <button
          onClick={toggleTheme}
          class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
        >
          <span class="text-sm">{theme() === "light" ? "\u{1F319}" : "\u{2600}\u{FE0F}"}</span>
          {theme() === "light" ? "Dark mode" : "Light mode"}
        </button>
      </div>
    </aside>
  );
};
