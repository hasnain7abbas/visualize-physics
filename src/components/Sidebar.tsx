import { Component, For } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { CatLogo } from "./CatLogo";
import { theme, toggleTheme } from "../lib/theme";
import { chapterGroups } from "../lib/chapters-data";

export const Sidebar: Component = () => {
  const location = useLocation();

  return (
    <aside
      class="fixed top-0 left-0 h-screen flex flex-col border-r z-50"
      style={{
        width: "var(--sidebar-width)",
        background: "var(--bg-sidebar)",
        "border-color": "var(--border)",
      }}
    >
      {/* Logo */}
      <A
        href="/"
        class="flex items-center gap-3 px-5 py-4 border-b transition-colors hover:opacity-80"
        style={{ "border-color": "var(--border-light)" }}
      >
        <div class="animate-float">
          <CatLogo size={38} />
        </div>
        <div>
          <div
            class="font-bold text-sm tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Visualize Physics
          </div>
          <div
            class="text-[10px] font-medium tracking-widest uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            Quantum & Stats
          </div>
        </div>
      </A>

      {/* Chapter groups */}
      <nav class="flex-1 overflow-y-auto py-2 px-3">
        <For each={chapterGroups}>
          {(group) => (
            <div class="mb-3">
              {/* Group header */}
              <div class="px-2 pt-3 pb-1.5">
                <div
                  class="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  {group.title}
                </div>
                <div
                  class="text-[9px] mt-0.5"
                  style={{ color: "var(--text-muted)", opacity: 0.6 }}
                >
                  {group.subtitle}
                </div>
              </div>

              {/* Chapter links */}
              <For each={group.chapters}>
                {(ch) => {
                  const isActive = () =>
                    location.pathname === `/chapter/${ch.id}`;
                  return (
                    <A
                      href={`/chapter/${ch.id}`}
                      class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5 transition-all group"
                      style={{
                        background: isActive()
                          ? `${ch.color}12`
                          : "transparent",
                        "border-left": isActive()
                          ? `3px solid ${ch.color}`
                          : "3px solid transparent",
                      }}
                    >
                      <span
                        class="w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 transition-transform group-hover:scale-110"
                        style={{ background: `${ch.color}15` }}
                      >
                        {ch.icon}
                      </span>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-1.5">
                          <span
                            class="text-[9px] font-bold tracking-wide"
                            style={{ color: ch.color, opacity: 0.7 }}
                          >
                            {ch.num}
                          </span>
                          <span
                            class="text-[12px] font-medium truncate"
                            style={{
                              color: isActive()
                                ? ch.color
                                : "var(--text-primary)",
                            }}
                          >
                            {ch.title}
                          </span>
                        </div>
                        <div
                          class="text-[9px] truncate"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {ch.shortDesc}
                        </div>
                      </div>
                    </A>
                  );
                }}
              </For>
            </div>
          )}
        </For>
      </nav>

      {/* Theme toggle */}
      <div
        class="px-3 py-3 border-t"
        style={{ "border-color": "var(--border-light)" }}
      >
        <button
          onClick={toggleTheme}
          class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-secondary)",
          }}
        >
          <span class="text-sm">
            {theme() === "light" ? "\u{1F319}" : "\u{2600}\u{FE0F}"}
          </span>
          {theme() === "light" ? "Dark mode" : "Light mode"}
        </button>
      </div>
    </aside>
  );
};
