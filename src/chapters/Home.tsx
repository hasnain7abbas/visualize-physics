import { Component, For, createSignal, onMount } from "solid-js";
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

/* ─── Floating equation particle ─────────────────────────── */
const FloatingEquation: Component<{
  eq: string;
  x: number;
  y: number;
  delay: number;
  duration: number;
}> = (props) => (
  <div
    class="absolute pointer-events-none select-none"
    style={{
      left: `${props.x}%`,
      top: `${props.y}%`,
      animation: `float ${props.duration}s ease-in-out infinite`,
      "animation-delay": `${props.delay}s`,
      "font-size": "11px",
      "font-family": "'JetBrains Mono', monospace",
      color: "var(--text-muted)",
      opacity: 0.18,
    }}
  >
    {props.eq}
  </div>
);

/* ─── Welcome Hero ───────────────────────────────────────── */
const WelcomeHero: Component = () => {
  const [visible, setVisible] = createSignal(false);
  onMount(() => setTimeout(() => setVisible(true), 50));

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

  const floatingEqs = [
    { eq: "E = mc\u00B2", x: 8, y: 15, delay: 0, duration: 4.2 },
    { eq: "\u03C8 = \u03B1|0\u27E9 + \u03B2|1\u27E9", x: 78, y: 12, delay: 1.5, duration: 5.1 },
    { eq: "S = k\u0299 ln \u03A9", x: 85, y: 55, delay: 0.8, duration: 3.8 },
    { eq: "F = -kT ln Z", x: 5, y: 65, delay: 2.2, duration: 4.6 },
    { eq: "\u2202\u03C8/\u2202t = H\u03C8", x: 70, y: 75, delay: 1.0, duration: 5.5 },
    { eq: "PV = NkT", x: 15, y: 40, delay: 3.0, duration: 4.0 },
    { eq: "\u0394x\u0394p \u2265 \u0127/2", x: 60, y: 30, delay: 0.5, duration: 3.5 },
    { eq: "f(v) \u221D v\u00B2e^{-\u03B2mv\u00B2/2}", x: 88, y: 35, delay: 2.8, duration: 4.8 },
  ];

  return (
    <section
      class="relative px-4 sm:px-8 pt-8 sm:pt-12 pb-8 sm:pb-14 overflow-hidden transition-all duration-700"
      style={{ opacity: visible() ? 1 : 0, transform: visible() ? "none" : "translateY(12px)" }}
    >
      {/* Dot grid background */}
      <div
        class="absolute inset-0 opacity-[0.03]"
        style={{
          "background-image":
            "radial-gradient(circle, var(--text-primary) 1px, transparent 1px)",
          "background-size": "24px 24px",
        }}
      />

      {/* Floating equations */}
      <For each={floatingEqs}>
        {(eq) => <FloatingEquation {...eq} />}
      </For>

      {/* Gradient orbs */}
      <div
        class="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-[0.06] blur-3xl"
        style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}
      />
      <div
        class="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-[0.05] blur-3xl"
        style={{ background: "linear-gradient(135deg, #ec4899, #f59e0b)" }}
      />

      <div class="relative max-w-4xl mx-auto text-center">
        {/* Cat mascot */}
        <div class="flex justify-center mb-5 animate-float">
          <div class="relative">
            <div
              class="absolute inset-0 rounded-full blur-xl opacity-30"
              style={{ background: "var(--accent)", transform: "scale(1.5)" }}
            />
            <CatLogo size={64} />
          </div>
        </div>

        {/* Welcome badge */}
        <div
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5 animate-slide-up"
          style={{
            background: "var(--accent-light)",
            color: "var(--accent)",
            border: "1px solid var(--accent)",
            "border-color": "color-mix(in srgb, var(--accent) 25%, transparent)",
          }}
        >
          <span class="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
          Interactive Physics Lab
        </div>

        {/* Title */}
        <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3 animate-slide-up stagger-1">
          <span class="gradient-text">Visualize Physics</span>
        </h1>

        {/* Subtitle */}
        <p
          class="text-base sm:text-lg font-medium mb-3 animate-slide-up stagger-2"
          style={{ color: "var(--text-secondary)" }}
        >
          See the invisible. Feel the abstract. Understand the universe.
        </p>

        {/* Description */}
        <p
          class="text-sm max-w-2xl mx-auto leading-relaxed mb-6 animate-slide-up stagger-3"
          style={{ color: "var(--text-muted)" }}
        >
          Dive into quantum mechanics and statistical physics through
          real-time interactive simulations. From quantum superposition
          to the Boltzmann distribution, from Ising phase transitions to
          Carnot engines — every concept is alive, visual, and hands-on.
          Powered by Rust for blazing-fast computation.
        </p>

        {/* Feature highlights */}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8 animate-slide-up stagger-4">
          <div
            class="card p-4 text-center hover:scale-105 transition-transform"
            style={{ border: "1px solid var(--border)" }}
          >
            <div class="text-xl mb-1">
              {"\u{1F52C}"}
            </div>
            <div class="text-xs font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Real Simulations
            </div>
            <div class="text-[10px]" style={{ color: "var(--text-muted)" }}>
              Not animations — real physics computed in real time
            </div>
          </div>
          <div
            class="card p-4 text-center hover:scale-105 transition-transform"
            style={{ border: "1px solid var(--border)" }}
          >
            <div class="text-xl mb-1">
              {"\u{1F9EE}"}
            </div>
            <div class="text-xs font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Statistical Tools
            </div>
            <div class="text-[10px]" style={{ color: "var(--text-muted)" }}>
              {totalTools}+ tools mapped to every concept
            </div>
          </div>
          <div
            class="card p-4 text-center hover:scale-105 transition-transform"
            style={{ border: "1px solid var(--border)" }}
          >
            <div class="text-xl mb-1">
              {"\u{1F4D0}"}
            </div>
            <div class="text-xs font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              KaTeX Math
            </div>
            <div class="text-[10px]" style={{ color: "var(--text-muted)" }}>
              Beautiful equations alongside every simulation
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div class="flex justify-center gap-8 animate-slide-up stagger-5">
          <div class="text-center">
            <div class="text-2xl sm:text-3xl font-bold gradient-text">
              {allChapters.length}
            </div>
            <div
              class="text-[10px] uppercase tracking-widest font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Chapters
            </div>
          </div>
          <div
            class="w-px"
            style={{ background: "var(--border)" }}
          />
          <div class="text-center">
            <div class="text-2xl sm:text-3xl font-bold gradient-text">
              {totalSections}
            </div>
            <div
              class="text-[10px] uppercase tracking-widest font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Sections
            </div>
          </div>
          <div
            class="w-px"
            style={{ background: "var(--border)" }}
          />
          <div class="text-center">
            <div class="text-2xl sm:text-3xl font-bold gradient-text">
              {totalTools}
            </div>
            <div
              class="text-[10px] uppercase tracking-widest font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Statistical Tools
            </div>
          </div>
        </div>

        {/* CTA arrow */}
        <div class="mt-8 animate-slide-up stagger-6">
          <div
            class="text-xs font-medium mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Pick a chapter below to begin exploring
          </div>
          <div style={{ color: "var(--text-muted)", "font-size": "18px" }} class="animate-float">
            {"\u2193"}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Home Page ──────────────────────────────────────────── */
export const Home: Component = () => {
  return (
    <div class="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Welcome hero */}
      <WelcomeHero />

      {/* Chapter groups */}
      <For each={chapterGroups}>
        {(group) => (
          <section class="px-4 sm:px-8 pb-6 sm:pb-10">
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
      <section class="px-4 sm:px-8 pb-8 sm:pb-14">
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
