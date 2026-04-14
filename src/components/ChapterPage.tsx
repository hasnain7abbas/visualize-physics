import { Component, For, Show, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useParams, A } from "@solidjs/router";
import { getChapter, type Chapter, type Section, type StatTool } from "../lib/chapters-data";
import { MathBlock } from "./MathBlock";
import { InlineMathText } from "./InlineMath";
import { ToolMiniSim } from "./ToolMiniSim";
import { getSimulation } from "../simulations";

// ─── Interactive tool item ───────────────────────────────────────────

const ToolItem: Component<{ tool: StatTool; color: string }> = (props) => {
  const [expanded, setExpanded] = createSignal(false);

  return (
    <button
      class="w-full text-left rounded-lg px-2 sm:px-3 py-2 transition-all cursor-pointer"
      style={{
        background: expanded() ? `${props.color}08` : "transparent",
        border: expanded() ? `1px solid ${props.color}20` : "1px solid transparent",
      }}
      onClick={() => setExpanded(!expanded())}
    >
      <div class="flex items-start gap-2">
        <span
          class="mt-1.5 w-2 h-2 rounded-full flex-shrink-0 transition-transform"
          style={{
            background: props.color,
            transform: expanded() ? "scale(1.3)" : "scale(1)",
          }}
        />
        <div class="flex-1 min-w-0">
          <div
            class="text-xs font-medium"
            style={{ color: expanded() ? props.color : "var(--text-secondary)" }}
          >
            {props.tool.name}
          </div>
          {expanded() && (
            <>
              <div
                class="text-[11px] mt-1.5 leading-relaxed animate-fade-in tool-math-desc"
                style={{ color: "var(--text-muted)" }}
              >
                <InlineMathText text={props.tool.desc} />
              </div>
              <ToolMiniSim toolName={props.tool.name} />
            </>
          )}
        </div>
        <span
          class="text-[10px] mt-0.5 flex-shrink-0 transition-transform"
          style={{
            color: "var(--text-muted)",
            transform: expanded() ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          {"\u25B6"}
        </span>
      </div>
    </button>
  );
};

// ─── Section content ─────────────────────────────────────────────────

const SectionContent: Component<{
  section: Section;
  chapter: Chapter;
}> = (props) => {
  const SimComponent = () => getSimulation(props.chapter.id, props.section.id);
  const [showTools, setShowTools] = createSignal(false);

  return (
    <div class="animate-fade-in">
      {/* Section header */}
      <div class="mb-4 sm:mb-6">
        <h2
          class="text-lg sm:text-xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {props.section.title}
        </h2>
        <p
          class="text-xs sm:text-sm leading-relaxed max-w-2xl"
          style={{ color: "var(--text-secondary)" }}
        >
          {props.section.description}
        </p>
      </div>

      {/* Mobile: tools toggle button */}
      <div class="lg:hidden mb-4">
        <button
          onClick={() => setShowTools(!showTools())}
          class="w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-medium"
          style={{
            background: `${props.chapter.color}10`,
            color: props.chapter.color,
            border: `1px solid ${props.chapter.color}25`,
          }}
        >
          <span>{showTools() ? "Hide" : "Show"} Statistical Tools ({props.section.statisticalTools.length})</span>
          <span style={{ transform: showTools() ? "rotate(90deg)" : "rotate(0deg)" }} class="transition-transform">▶</span>
        </button>

        {/* Mobile tools panel */}
        {showTools() && (
          <div class="card p-3 mt-2 animate-fade-in">
            <div class="space-y-0.5">
              <For each={props.section.statisticalTools}>
                {(tool) => <ToolItem tool={tool} color={props.chapter.color} />}
              </For>
            </div>
          </div>
        )}
      </div>

      {/* Layout: stacks on mobile, side-by-side on desktop */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left: simulation + equations */}
        <div class="lg:col-span-2 space-y-4 sm:space-y-5">
          {/* Definition / What is this? card */}
          <div
            class="card p-3 sm:p-5 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${props.chapter.color}08, ${props.chapter.color}03)`,
              "border-left": `3px solid ${props.chapter.color}`,
            }}
          >
            <div class="flex items-start gap-2 sm:gap-3">
              <div
                class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm sm:text-base mt-0.5"
                style={{ background: `${props.chapter.color}15` }}
              >
                {props.chapter.icon}
              </div>
              <div class="min-w-0">
                <div
                  class="text-[10px] font-semibold uppercase tracking-widest mb-1"
                  style={{ color: props.chapter.color }}
                >
                  What you're exploring
                </div>
                <p class="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {props.section.description}
                </p>
              </div>
            </div>
          </div>

          {/* Simulation */}
          <div
            class="card p-3 sm:p-5 overflow-hidden"
            style={{ "border-top": `3px solid ${props.chapter.color}` }}
          >
            <div
              class="text-[10px] font-semibold uppercase tracking-widest mb-3 sm:mb-4"
              style={{ color: props.chapter.color }}
            >
              Interactive Simulation
            </div>
            <Show
              when={SimComponent()}
              fallback={
                <div class="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>
                  Simulation loading...
                </div>
              }
            >
              <Dynamic component={SimComponent()!} />
            </Show>
          </div>

          {/* Concept summary */}
          <div
            class="card p-3 sm:p-5"
            style={{ "border-left": `3px solid ${props.chapter.color}` }}
          >
            <div
              class="text-[10px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: props.chapter.color }}
            >
              What to observe
            </div>
            <p class="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {props.section.conceptSummary}
            </p>
          </div>

          {/* Key equations with KaTeX */}
          <div class="card p-3 sm:p-5">
            <div
              class="text-[10px] font-semibold uppercase tracking-widest mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Key Equations
            </div>
            <div class="space-y-2 sm:space-y-3">
              <For each={props.section.keyEquations}>
                {(eq) => (
                  <div
                    class="px-3 sm:px-4 py-2 sm:py-3 rounded-lg overflow-x-auto"
                    style={{ background: "var(--bg-secondary)" }}
                  >
                    <MathBlock tex={eq} display={true} />
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>

        {/* Right: statistical tools — hidden on mobile (shown via toggle above) */}
        <div class="hidden lg:block">
          <div class="card p-4 sticky top-6">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 rounded-full" style={{ background: props.chapter.color }} />
              <div class="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                Statistical Tools
              </div>
            </div>
            <p class="text-[10px] mb-3" style={{ color: "var(--text-muted)" }}>
              Click any tool to see its description and interactive demo.
            </p>
            <div class="space-y-0.5">
              <For each={props.section.statisticalTools}>
                {(tool) => <ToolItem tool={tool} color={props.chapter.color} />}
              </For>
            </div>
            <div class="mt-3 pt-3 border-t text-center" style={{ "border-color": "var(--border-light)" }}>
              <span class="text-[10px] font-bold" style={{ color: props.chapter.color }}>
                {props.section.statisticalTools.length}
              </span>
              <span class="text-[10px] ml-1" style={{ color: "var(--text-muted)" }}>tools</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Chapter page ────────────────────────────────────────────────────

export const ChapterPage: Component = () => {
  const params = useParams<{ id: string }>();
  const chapter = () => getChapter(params.id);
  const [activeSection, setActiveSection] = createSignal(0);

  return (
    <Show
      when={chapter()}
      fallback={
        <div class="flex items-center justify-center h-screen" style={{ background: "var(--bg-primary)" }}>
          <div class="text-center">
            <div class="text-4xl mb-4 opacity-30">{"\u{1F50D}"}</div>
            <p style={{ color: "var(--text-muted)" }}>Chapter not found</p>
            <A href="/" class="text-sm mt-2 inline-block" style={{ color: "var(--accent)" }}>Back to home</A>
          </div>
        </div>
      }
    >
      {(ch) => (
        <div class="min-h-screen" style={{ background: "var(--bg-primary)" }}>
          {/* Chapter header */}
          <div class="border-b" style={{ "border-color": "var(--border)", "border-top": `3px solid ${ch().color}` }}>
            <div class="max-w-6xl mx-auto px-4 sm:px-8 pt-4 sm:pt-6 pb-0">
              <div class="flex items-center gap-2 text-xs mb-2 sm:mb-3">
                <A href="/" class="transition-colors hover:opacity-70" style={{ color: "var(--text-muted)" }}>Home</A>
                <span style={{ color: "var(--text-muted)" }}>/</span>
                <span style={{ color: ch().color }} class="font-medium">{ch().num}: {ch().title}</span>
              </div>

              <div class="flex items-center gap-3 sm:gap-4 mb-2">
                <span class="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-xl" style={{ background: `${ch().color}15` }}>
                  {ch().icon}
                </span>
                <div>
                  <div class="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest" style={{ color: ch().color }}>Chapter {ch().num}</div>
                  <h1 class="text-base sm:text-xl font-bold" style={{ color: "var(--text-primary)" }}>{ch().title}</h1>
                </div>
              </div>

              <p class="text-xs sm:text-sm max-w-2xl mb-3 sm:mb-5 hidden sm:block" style={{ color: "var(--text-secondary)" }}>
                {ch().description}
              </p>

              {/* Section tabs — scrollable on mobile */}
              <div class="flex gap-1 overflow-x-auto pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                <For each={ch().sections}>
                  {(section, i) => (
                    <button
                      onClick={() => setActiveSection(i())}
                      class="px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-medium rounded-t-lg transition-all whitespace-nowrap flex-shrink-0"
                      style={{
                        background: activeSection() === i() ? "var(--bg-primary)" : "transparent",
                        color: activeSection() === i() ? ch().color : "var(--text-muted)",
                        "border-bottom": activeSection() === i() ? `2px solid ${ch().color}` : "2px solid transparent",
                      }}
                    >
                      <span class="opacity-50 mr-1">{i() + 1}.</span>
                      {section.title}
                    </button>
                  )}
                </For>
              </div>
            </div>
          </div>

          {/* Section content */}
          <div class="max-w-6xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
            <Show when={ch().sections[activeSection()]}>
              {(section) => <SectionContent section={section()} chapter={ch()} />}
            </Show>
          </div>
        </div>
      )}
    </Show>
  );
};
