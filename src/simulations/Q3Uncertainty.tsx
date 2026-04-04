import { Component, createSignal, createMemo } from "solid-js";

export const Q3Uncertainty: Component = () => {
  const [sigmaX, setSigmaX] = createSignal(1.0);
  const hbar = 1;

  const sigmaP = () => hbar / (2 * sigmaX());
  const product = () => sigmaX() * sigmaP();

  // Generate multiple non-Gaussian states for comparison
  const states = createMemo(() => {
    const sx = sigmaX();
    return [
      { name: "Gaussian", sx, sp: hbar / (2 * sx), color: "#14b8a6" },
      { name: "Box (n=1)", sx: 0.29 * 2 * Math.PI * sx, sp: hbar * Math.PI / (2 * 0.29 * 2 * Math.PI * sx), color: "#6366f1" },
      { name: "Box (n=3)", sx: 0.18 * 2 * Math.PI * sx, sp: hbar * 3 * Math.PI / (2 * 0.18 * 2 * Math.PI * sx), color: "#ec4899" },
    ];
  });

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Δx</label>
        <input type="range" min="0.2" max="4" step="0.01" value={sigmaX()} onInput={(e) => setSigmaX(parseFloat(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #14b8a6 ${((sigmaX() - 0.2) / 3.8) * 100}%, var(--border) ${((sigmaX() - 0.2) / 3.8) * 100}%)` }}
        />
      </div>

      {/* Trade-off plot */}
      <svg width="100%" height="280" viewBox="0 0 420 280" class="mx-auto">
        {/* Axes */}
        <line x1="50" y1="250" x2="400" y2="250" stroke="var(--border)" stroke-width="1" />
        <line x1="50" y1="250" x2="50" y2="20" stroke="var(--border)" stroke-width="1" />
        <text x="220" y="275" text-anchor="middle" font-size="10" fill="var(--text-muted)">Δx</text>
        <text x="15" y="135" text-anchor="middle" font-size="10" fill="var(--text-muted)" transform="rotate(-90 15 135)">Δp</text>

        {/* Forbidden region (below ℏ/2 hyperbola) */}
        <path
          d={Array.from({ length: 100 }, (_, i) => {
            const dx = 0.2 + (i / 100) * 4;
            const dp = hbar / (2 * dx);
            const px = 50 + ((dx - 0.2) / 4) * 350;
            const py = 250 - (dp / 3) * 220;
            return `${i === 0 ? "M" : "L"}${px},${Math.max(20, py)}`;
          }).join(" ") + " L400,250 L50,250 Z"}
          fill="#ef4444" opacity="0.05"
        />

        {/* ℏ/2 bound curve */}
        <path
          d={Array.from({ length: 100 }, (_, i) => {
            const dx = 0.2 + (i / 100) * 4;
            const dp = hbar / (2 * dx);
            const px = 50 + ((dx - 0.2) / 4) * 350;
            const py = 250 - (dp / 3) * 220;
            return `${i === 0 ? "M" : "L"}${px},${Math.max(20, py)}`;
          }).join(" ")}
          fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 3"
        />
        <text x="300" y="200" font-size="9" fill="#ef4444">ΔxΔp = ℏ/2 (bound)</text>
        <text x="200" y="245" font-size="9" fill="#ef4444" opacity="0.6">FORBIDDEN</text>

        {/* Current Gaussian state point */}
        <circle
          cx={50 + ((sigmaX() - 0.2) / 4) * 350}
          cy={250 - (sigmaP() / 3) * 220}
          r="6" fill="#14b8a6" stroke="white" stroke-width="2"
        />
        <text
          x={55 + ((sigmaX() - 0.2) / 4) * 350}
          y={245 - (sigmaP() / 3) * 220}
          font-size="9" font-weight="600" fill="#14b8a6"
        >
          Gaussian (min. uncertainty)
        </text>

        {/* Allowed region label */}
        <text x="300" y="60" font-size="10" font-weight="500" fill="var(--text-muted)">ALLOWED</text>

        {/* Grid lines */}
        {[1, 2, 3].map((v) => (
          <>
            <line x1="50" y1={250 - (v / 3) * 220} x2="400" y2={250 - (v / 3) * 220} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="2 4" />
            <text x="42" y={254 - (v / 3) * 220} text-anchor="end" font-size="8" fill="var(--text-muted)">{v}</text>
          </>
        ))}
      </svg>

      {/* Stats */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Δx</div>
          <div class="text-lg font-bold" style={{ color: "#14b8a6" }}>{sigmaX().toFixed(3)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Δp</div>
          <div class="text-lg font-bold" style={{ color: "#ec4899" }}>{sigmaP().toFixed(3)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Δx·Δp</div>
          <div class="text-lg font-bold" style={{ color: product() <= hbar / 2 + 0.001 ? "#10b981" : "#f59e0b" }}>
            {product().toFixed(3)} {product() <= hbar / 2 + 0.001 ? "= ℏ/2 ✓" : "> ℏ/2"}
          </div>
        </div>
      </div>
    </div>
  );
};
