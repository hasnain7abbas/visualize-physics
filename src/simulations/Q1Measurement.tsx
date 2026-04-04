import { Component, createSignal } from "solid-js";

export const Q1Measurement: Component = () => {
  const [trials, setTrials] = createSignal(0);
  const [z1Up, setZ1Up] = createSignal(0);
  const [z2Up, setZ2Up] = createSignal(0);
  const [z2Total, setZ2Total] = createSignal(0);
  const [lastResult, setLastResult] = createSignal<string | null>(null);

  const runTrial = () => {
    const z1 = Math.random() < 0.5;
    setTrials((t) => t + 1);
    if (z1) setZ1Up((c) => c + 1);

    if (z1) {
      // X measurement (50/50)
      const _x = Math.random() < 0.5;
      // Z2 measurement after X — always 50/50
      const z2 = Math.random() < 0.5;
      setZ2Total((t) => t + 1);
      if (z2) setZ2Up((c) => c + 1);
      setLastResult(z2 ? "↑" : "↓");
    } else {
      setLastResult("filtered (Z1=↓)");
    }
  };

  const runMany = (n: number) => {
    for (let i = 0; i < n; i++) {
      const z1 = Math.random() < 0.5;
      setTrials((t) => t + 1);
      if (z1) {
        setZ1Up((c) => c + 1);
        const _x = Math.random() < 0.5;
        const z2 = Math.random() < 0.5;
        setZ2Total((t) => t + 1);
        if (z2) setZ2Up((c) => c + 1);
      }
    }
    setLastResult(null);
  };

  const reset = () => {
    setTrials(0);
    setZ1Up(0);
    setZ2Up(0);
    setZ2Total(0);
    setLastResult(null);
  };

  return (
    <div class="space-y-5">
      {/* SG chain diagram */}
      <svg width="100%" height="120" viewBox="0 0 500 120" class="mx-auto">
        {/* Beam source */}
        <rect x="10" y="45" width="50" height="30" rx="4" fill="var(--bg-secondary)" stroke="var(--border)" stroke-width="1.5" />
        <text x="35" y="64" text-anchor="middle" font-size="9" fill="var(--text-muted)">Source</text>

        {/* Arrow */}
        <line x1="60" y1="60" x2="100" y2="60" stroke="var(--text-muted)" stroke-width="1.5" marker-end="url(#arrow)" />

        {/* SG-Z */}
        <rect x="100" y="35" width="80" height="50" rx="6" fill="#06b6d420" stroke="#06b6d4" stroke-width="1.5" />
        <text x="140" y="55" text-anchor="middle" font-size="10" font-weight="600" fill="#06b6d4">SG-Z</text>
        <text x="140" y="72" text-anchor="middle" font-size="8" fill="var(--text-muted)">Filter ↑</text>

        {/* Arrow with filter indication */}
        <line x1="180" y1="60" x2="220" y2="60" stroke="#06b6d4" stroke-width="1.5" marker-end="url(#arrow2)" />
        <text x="200" y="52" text-anchor="middle" font-size="8" fill="#06b6d4">↑ only</text>

        {/* SG-X */}
        <rect x="220" y="35" width="80" height="50" rx="6" fill="#ec489920" stroke="#ec4899" stroke-width="1.5" />
        <text x="260" y="55" text-anchor="middle" font-size="10" font-weight="600" fill="#ec4899">SG-X</text>
        <text x="260" y="72" text-anchor="middle" font-size="8" fill="var(--text-muted)">Destroys Z</text>

        {/* Arrow */}
        <line x1="300" y1="60" x2="340" y2="60" stroke="#ec4899" stroke-width="1.5" marker-end="url(#arrow3)" />

        {/* SG-Z again */}
        <rect x="340" y="35" width="80" height="50" rx="6" fill="#f59e0b20" stroke="#f59e0b" stroke-width="1.5" />
        <text x="380" y="55" text-anchor="middle" font-size="10" font-weight="600" fill="#f59e0b">SG-Z</text>
        <text x="380" y="72" text-anchor="middle" font-size="8" fill="var(--text-muted)">50/50!</text>

        {/* Result */}
        <text x="450" y="64" text-anchor="middle" font-size="16" fill="var(--text-primary)">
          {lastResult() ?? "?"}
        </text>

        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--text-muted)" />
          </marker>
          <marker id="arrow2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#06b6d4" />
          </marker>
          <marker id="arrow3" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#ec4899" />
          </marker>
        </defs>
      </svg>

      {/* Buttons */}
      <div class="flex justify-center gap-2">
        <button onClick={runTrial} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#06b6d4", color: "white" }}>
          Run 1 Trial
        </button>
        <button onClick={() => runMany(100)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#0e7490", color: "white" }}>
          Run ×100
        </button>
        <button onClick={() => runMany(1000)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#164e63", color: "white" }}>
          Run ×1000
        </button>
        <button onClick={reset} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Reset
        </button>
      </div>

      {/* Statistics */}
      <div class="grid grid-cols-2 gap-4">
        <div class="card p-4 text-center">
          <div class="text-[10px] uppercase tracking-widest mb-1" style={{ color: "#06b6d4" }}>First Z Measurement</div>
          <div class="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {trials() > 0 ? (z1Up() / trials()).toFixed(3) : "—"}
          </div>
          <div class="text-[10px]" style={{ color: "var(--text-muted)" }}>P(↑) ≈ 0.500 expected</div>
        </div>
        <div class="card p-4 text-center">
          <div class="text-[10px] uppercase tracking-widest mb-1" style={{ color: "#f59e0b" }}>Second Z (after X)</div>
          <div class="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {z2Total() > 0 ? (z2Up() / z2Total()).toFixed(3) : "—"}
          </div>
          <div class="text-[10px]" style={{ color: "var(--text-muted)" }}>P(↑) ≈ 0.500 — X destroyed Z info!</div>
        </div>
      </div>
      <div class="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        Total trials: {trials()} | Through filter: {z2Total()}
      </div>
    </div>
  );
};
