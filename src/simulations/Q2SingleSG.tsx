import { Component, createSignal, createMemo } from "solid-js";

export const Q2SingleSG: Component = () => {
  const [angle, setAngle] = createSignal(0);
  const [results, setResults] = createSignal<boolean[]>([]);

  const pUp = () => Math.cos((angle() * Math.PI) / 360) ** 2;
  const counts = createMemo(() => {
    const r = results();
    const up = r.filter((x) => x).length;
    return { up, down: r.length - up };
  });

  const measure = (n: number) => {
    const p = pUp();
    const newR: boolean[] = [];
    for (let i = 0; i < n; i++) newR.push(Math.random() < p);
    setResults((prev) => [...prev, ...newR]);
  };

  const reset = () => setResults([]);

  return (
    <div class="space-y-5">
      {/* Angle control */}
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "40px" }}>
          θ = {angle()}°
        </label>
        <input
          type="range" min="0" max="360" step="1"
          value={angle()}
          onInput={(e) => { setAngle(parseInt(e.currentTarget.value)); reset(); }}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #ec4899 ${(angle() / 360) * 100}%, var(--border) ${(angle() / 360) * 100}%)` }}
        />
      </div>

      {/* SG apparatus SVG */}
      <svg width="100%" height="180" viewBox="0 0 420 180" class="mx-auto">
        {/* Magnet */}
        <rect x="150" y="20" width="120" height="140" rx="8" fill="#ec489910" stroke="#ec4899" stroke-width="1.5" />
        <text x="210" y="50" text-anchor="middle" font-size="18" font-weight="bold" fill="#ec4899">N</text>
        <text x="210" y="150" text-anchor="middle" font-size="18" font-weight="bold" fill="#6366f1">S</text>

        {/* Field angle indicator */}
        <line
          x1="210" y1="90"
          x2={210 + 30 * Math.cos((-angle() * Math.PI) / 180)}
          y2={90 - 30 * Math.sin((-angle() * Math.PI) / 180)}
          stroke="#ec4899" stroke-width="2" marker-end="url(#sgArrow)"
        />
        <circle cx="210" cy="90" r="3" fill="#ec4899" />

        {/* Incoming beam */}
        <line x1="40" y1="90" x2="150" y2="90" stroke="var(--text-muted)" stroke-width="2" />
        <text x="95" y="82" text-anchor="middle" font-size="9" fill="var(--text-muted)">beam</text>

        {/* Outgoing beams */}
        <line x1="270" y1="90" x2="350" y2="45" stroke="#06b6d4" stroke-width="2" opacity={pUp()} />
        <text x="370" y="50" text-anchor="middle" font-size="11" font-weight="600" fill="#06b6d4">↑ {(pUp() * 100).toFixed(0)}%</text>

        <line x1="270" y1="90" x2="350" y2="135" stroke="#f59e0b" stroke-width="2" opacity={1 - pUp()} />
        <text x="370" y="140" text-anchor="middle" font-size="11" font-weight="600" fill="#f59e0b">↓ {((1 - pUp()) * 100).toFixed(0)}%</text>

        <defs>
          <marker id="sgArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#ec4899" />
          </marker>
        </defs>
      </svg>

      {/* Controls */}
      <div class="flex justify-center gap-2">
        <button onClick={() => measure(1)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#ec4899", color: "white" }}>Measure ×1</button>
        <button onClick={() => measure(100)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#be185d", color: "white" }}>Measure ×100</button>
        <button onClick={() => measure(1000)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#831843", color: "white" }}>Measure ×1000</button>
        <button onClick={reset} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>

      {/* Results */}
      {results().length > 0 && (
        <div class="grid grid-cols-3 gap-3 text-center">
          <div class="card p-3">
            <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Observed P(↑)</div>
            <div class="text-lg font-bold" style={{ color: "#06b6d4" }}>{(counts().up / results().length).toFixed(3)}</div>
          </div>
          <div class="card p-3">
            <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Theory cos²(θ/2)</div>
            <div class="text-lg font-bold" style={{ color: "#ec4899" }}>{pUp().toFixed(3)}</div>
          </div>
          <div class="card p-3">
            <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Trials</div>
            <div class="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{results().length}</div>
          </div>
        </div>
      )}
    </div>
  );
};
