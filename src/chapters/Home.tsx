import { Component, For } from "solid-js";
import { A } from "@solidjs/router";
import { CatLogo } from "../components/CatLogo";
import { chapterGroups, allChapters, type Chapter } from "../lib/chapters-data";

const ChapterCard: Component<{ chapter: Chapter; index: number }> = (
  props
) => {
  const ch = props.chapter;
  const totalTools = () =>
    ch.sections.reduce((sum, s) => sum + s.statisticalTools.length, 0);

  return (
    <A
      href={`/chapter/${ch.id}`}
      class="card glow-card group p-5 cursor-pointer animate-slide-up"
      classList={{ [`stagger-${(props.index % 6) + 1}`]: true }}
    >
      {/* Color accent bar */}
      <div
        class="h-1 w-12 rounded-full mb-4 transition-all group-hover:w-20"
        style={{ background: ch.color }}
      />

      <div class="flex items-start gap-3 mb-3">
        <span
          class="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110 group-hover:rotate-3"
          style={{ background: `${ch.color}15` }}
        >
          {ch.icon}
        </span>
        <div>
          <span
            class="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: ch.color }}
          >
            {ch.num}
          </span>
          <h3
            class="text-sm font-semibold -mt-0.5"
            style={{ color: "var(--text-primary)" }}
          >
            {ch.title}
          </h3>
        </div>
      </div>

      <p
        class="text-xs leading-relaxed mb-3"
        style={{ color: "var(--text-secondary)" }}
      >
        {ch.description.length > 140
          ? ch.description.slice(0, 140) + "..."
          : ch.description}
      </p>

      {/* Section list */}
      <div class="space-y-1 mb-3">
        <For each={ch.sections}>
          {(section) => (
            <div class="flex items-center gap-2">
              <div
                class="w-1 h-1 rounded-full"
                style={{ background: ch.color }}
              />
              <span
                class="text-[11px]"
                style={{ color: "var(--text-secondary)" }}
              >
                {section.title}
              </span>
            </div>
          )}
        </For>
      </div>

      {/* Footer stats */}
      <div
        class="flex items-center gap-3 pt-3 border-t"
        style={{ "border-color": "var(--border-light)" }}
      >
        <span
          class="text-[10px] font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {ch.sections.length} sections
        </span>
        <span style={{ color: "var(--border)" }}>|</span>
        <span
          class="text-[10px] font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {totalTools()} statistical tools
        </span>
      </div>
    </A>
  );
};

export const Home: Component = () => {
  const totalSections = allChapters.reduce(
    (sum, ch) => sum + ch.sections.length,
    0
  );
  const totalTools = allChapters.reduce(
    (sum, ch) =>
      sum +
      ch.sections.reduce((s, sec) => s + sec.statisticalTools.length, 0),
    0
  );

  return (
    <div class="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Hero section */}
      <section class="relative px-8 pt-14 pb-10 overflow-hidden">
        <div
          class="absolute inset-0 opacity-[0.03]"
          style={{
            "background-image":
              "radial-gradient(circle, var(--text-primary) 1px, transparent 1px)",
            "background-size": "24px 24px",
          }}
        />

        <div class="relative max-w-4xl mx-auto text-center">
          <div class="flex justify-center mb-5 animate-float">
            <CatLogo size={72} />
          </div>

          <h1 class="text-4xl font-extrabold tracking-tight mb-3 animate-slide-up">
            <span class="gradient-text">Visualize Physics</span>
          </h1>

          <p
            class="text-base font-medium mb-2 animate-slide-up stagger-1"
            style={{ color: "var(--text-secondary)" }}
          >
            A Visual Introduction to Quantum & Statistical Physics
          </p>

          <p
            class="text-sm max-w-xl mx-auto leading-relaxed animate-slide-up stagger-2"
            style={{ color: "var(--text-muted)" }}
          >
            Interactive simulations powered by Rust. Every concept mapped to the
            statistical tools that make it work — from Born rule probabilities
            to Shannon entropy.
          </p>

          <div class="flex justify-center gap-8 mt-7 animate-slide-up stagger-3">
            <div class="text-center">
              <div class="text-2xl font-bold gradient-text">
                {allChapters.length}
              </div>
              <div
                class="text-[10px] uppercase tracking-widest font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Chapters
              </div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold gradient-text">
                {totalSections}
              </div>
              <div
                class="text-[10px] uppercase tracking-widest font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Sections
              </div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold gradient-text">{totalTools}</div>
              <div
                class="text-[10px] uppercase tracking-widest font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Statistical Tools
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter groups */}
      <For each={chapterGroups}>
        {(group) => (
          <section class="px-8 pb-10">
            <div class="max-w-5xl mx-auto">
              {/* Group header */}
              <div class="flex items-center gap-3 mb-5">
                <div
                  class="h-px flex-1"
                  style={{ background: "var(--border)" }}
                />
                <div class="text-center px-4">
                  <h2
                    class="text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {group.title}
                  </h2>
                  <p
                    class="text-[11px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {group.subtitle}
                  </p>
                </div>
                <div
                  class="h-px flex-1"
                  style={{ background: "var(--border)" }}
                />
              </div>

              {/* Chapter cards */}
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <For each={group.chapters}>
                  {(ch, i) => <ChapterCard chapter={ch} index={i()} />}
                </For>
              </div>
            </div>
          </section>
        )}
      </For>

      {/* About section */}
      <section class="px-8 pb-14">
        <div class="max-w-3xl mx-auto">
          <div
            class="card p-8 text-center"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest mb-5"
              style={{
                background: "var(--accent-light)",
                color: "var(--accent)",
              }}
            >
              About the Creator
            </div>

            <h2
              class="text-2xl font-bold mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              Hasnain Abbas
            </h2>

            <a
              href="mailto:hsnanrzee1160@gmail.com"
              class="inline-flex items-center gap-1.5 text-sm font-medium mb-4 transition-colors hover:opacity-80"
              style={{ color: "var(--accent)" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              hsnanrzee1160@gmail.com
            </a>

            <p
              class="text-sm leading-relaxed max-w-lg mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              Passionate about making physics intuitive through interactive
              visualization. This project transforms abstract quantum mechanics
              and statistical physics concepts into playful, hands-on
              simulations — because if you can see it, you can understand it.
            </p>

          </div>
        </div>
      </section>
    </div>
  );
};
