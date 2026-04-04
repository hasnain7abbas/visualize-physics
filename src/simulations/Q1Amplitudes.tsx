import { Component, createSignal, createMemo } from "solid-js";

export const Q1Amplitudes: Component = () => {
  const [phase, setPhase] = createSignal(0);
  const [mode, setMode] = createSignal<"quantum" | "classical">("quantum");

  const points = createMemo(() => {
    const pts: { x: number; pClassical: number; pQuantum: number }[] = [];
    const numSlits = 2;
    const d = 1.0; // slit separation
    const wavelength = 0.5;

    for (let i = 0; i <= 200; i++) {
      const x = (i / 200) * 8 - 4;
      const a1Mag = Math.exp(-((x - d / 2) ** 2) / 1.5);
      const a2Mag = Math.exp(-((x + d / 2) ** 2) / 1.5);

      const pClassical = a1Mag ** 2 + a2Mag ** 2;

      const phi = ((2 * Math.PI) / wavelength) * d * (x / 4) + phase();
      const realPart = a1Mag + a2Mag * Math.cos(phi);
      const imagPart = a2Mag * Math.sin(phi);
      const pQuantum = realPart ** 2 + imagPart ** 2;

      pts.push({ x, pClassical, pQuantum });
    }
    return pts;
  });

  const maxP = createMemo(() => {
    const pts = points();
    return Math.max(...pts.map((p) => Math.max(p.pClassical, p.pQuantum)), 0.01);
  });

  return (
    <div class="space-y-5">
      {/* Mode toggle */}
      <div class="flex justify-center gap-2">
        <button
          onClick={() => setMode("classical")}
          class="px-4 py-2 rounded-lg text-xs font-medium transition-all"
          style={{
            background: mode() === "classical" ? "#f59e0b" : "var(--bg-secondary)",
            color: mode() === "classical" ? "white" : "var(--text-secondary)",
          }}
        >
          Classical (add probabilities)
        </button>
        <button
          onClick={() => setMode("quantum")}
          class="px-4 py-2 rounded-lg text-xs font-medium transition-all"
          style={{
            background: mode() === "quantum" ? "#06b6d4" : "var(--bg-secondary)",
            color: mode() === "quantum" ? "white" : "var(--text-secondary)",
          }}
        >
          Quantum (add amplitudes)
        </button>
      </div>

      {/* Phase control */}
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
          Phase diff: {(phase() / Math.PI).toFixed(2)}π
        </label>
        <input
          type="range"
          min="0"
          max={2 * Math.PI}
          step="0.01"
          value={phase()}
          onInput={(e) => setPhase(parseFloat(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #06b6d4 ${(phase() / (2 * Math.PI)) * 100}%, var(--border) ${(phase() / (2 * Math.PI)) * 100}%)` }}
        />
      </div>

      {/* Plot */}
      <svg width="100%" height="220" viewBox="0 0 420 220" class="mx-auto">
        {/* Axes */}
        <line x1="40" y1="190" x2="400" y2="190" stroke="var(--border)" stroke-width="1" />
        <line x1="40" y1="190" x2="40" y2="20" stroke="var(--border)" stroke-width="1" />
        <text x="220" y="215" text-anchor="middle" font-size="10" fill="var(--text-muted)">Position x</text>
        <text x="15" y="110" text-anchor="middle" font-size="10" fill="var(--text-muted)" transform="rotate(-90 15 110)">P(x)</text>

        {/* Classical curve (gray dashed) */}
        <path
          d={points()
            .map((p, i) => {
              const px = 40 + ((p.x + 4) / 8) * 360;
              const py = 190 - (p.pClassical / maxP()) * 160;
              return `${i === 0 ? "M" : "L"}${px},${py}`;
            })
            .join(" ")}
          fill="none"
          stroke={mode() === "classical" ? "#f59e0b" : "var(--border)"}
          stroke-width={mode() === "classical" ? "2.5" : "1"}
          stroke-dasharray={mode() === "classical" ? "none" : "4 3"}
          opacity={mode() === "classical" ? 1 : 0.5}
        />

        {/* Quantum curve */}
        <path
          d={points()
            .map((p, i) => {
              const px = 40 + ((p.x + 4) / 8) * 360;
              const py = 190 - (p.pQuantum / maxP()) * 160;
              return `${i === 0 ? "M" : "L"}${px},${py}`;
            })
            .join(" ")}
          fill="none"
          stroke={mode() === "quantum" ? "#06b6d4" : "var(--border)"}
          stroke-width={mode() === "quantum" ? "2.5" : "1"}
          stroke-dasharray={mode() === "quantum" ? "none" : "4 3"}
          opacity={mode() === "quantum" ? 1 : 0.5}
        />

        {/* Fill under active curve */}
        <path
          d={points()
            .map((p, i) => {
              const px = 40 + ((p.x + 4) / 8) * 360;
              const val = mode() === "quantum" ? p.pQuantum : p.pClassical;
              const py = 190 - (val / maxP()) * 160;
              return `${i === 0 ? "M" : "L"}${px},${py}`;
            })
            .join(" ") + " L400,190 L40,190 Z"}
          fill={mode() === "quantum" ? "#06b6d4" : "#f59e0b"}
          opacity="0.08"
        />

        {/* Legend */}
        <line x1="300" y1="30" x2="320" y2="30" stroke="#f59e0b" stroke-width="2" stroke-dasharray={mode() === "classical" ? "none" : "4 3"} />
        <text x="325" y="34" font-size="9" fill="var(--text-muted)">Classical</text>
        <line x1="300" y1="46" x2="320" y2="46" stroke="#06b6d4" stroke-width="2" stroke-dasharray={mode() === "quantum" ? "none" : "4 3"} />
        <text x="325" y="50" font-size="9" fill="var(--text-muted)">Quantum</text>
      </svg>

      <div class="text-center text-[11px]" style={{ color: "var(--text-muted)" }}>
        {mode() === "quantum"
          ? "Interference fringes appear! P = |A₁ + A₂|² ≠ |A₁|² + |A₂|²"
          : "No fringes — classical probabilities just add: P = P₁ + P₂"}
      </div>
    </div>
  );
};
