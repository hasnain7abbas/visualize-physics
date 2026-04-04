import { Component, createSignal, createMemo } from "solid-js";

export const Q3Wavepackets: Component = () => {
  const [sigmaX, setSigmaX] = createSignal(1.0);

  const sigmaK = () => 1 / (2 * sigmaX());
  const product = () => sigmaX() * sigmaK();

  const positionPts = createMemo(() => {
    const pts: { x: number; val: number }[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = (i / 200) * 10 - 5;
      const val = Math.exp(-(x ** 2) / (2 * sigmaX() ** 2)) / (sigmaX() * Math.sqrt(2 * Math.PI));
      pts.push({ x, val });
    }
    return pts;
  });

  const momentumPts = createMemo(() => {
    const pts: { k: number; val: number }[] = [];
    for (let i = 0; i <= 200; i++) {
      const k = (i / 200) * 10 - 5;
      const val = Math.exp(-(k ** 2) / (2 * sigmaK() ** 2)) / (sigmaK() * Math.sqrt(2 * Math.PI));
      pts.push({ k, val });
    }
    return pts;
  });

  const maxPos = createMemo(() => Math.max(...positionPts().map((p) => p.val)));
  const maxMom = createMemo(() => Math.max(...momentumPts().map((p) => p.val)));

  const plotPath = (pts: { val: number }[], maxV: number, yBase: number, h: number) =>
    pts.map((p, i) => {
      const px = 10 + (i / 200) * 180;
      const py = yBase - (p.val / maxV) * h;
      return `${i === 0 ? "M" : "L"}${px},${py}`;
    }).join(" ");

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>σ_x = {sigmaX().toFixed(2)}</label>
        <input type="range" min="0.2" max="3" step="0.01" value={sigmaX()} onInput={(e) => setSigmaX(parseFloat(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #14b8a6 ${((sigmaX() - 0.2) / 2.8) * 100}%, var(--border) ${((sigmaX() - 0.2) / 2.8) * 100}%)` }}
        />
        <span class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px", "text-align": "right" }}>σ_k = {sigmaK().toFixed(2)}</span>
      </div>

      <svg width="100%" height="260" viewBox="0 0 420 260" class="mx-auto">
        {/* Position space */}
        <text x="105" y="15" text-anchor="middle" font-size="11" font-weight="600" fill="#14b8a6">Position Space |ψ(x)|²</text>
        <line x1="10" y1="120" x2="190" y2="120" stroke="var(--border)" stroke-width="1" />
        <line x1="100" y1="25" x2="100" y2="120" stroke="var(--border)" stroke-width="1" stroke-dasharray="3 3" />
        <path d={plotPath(positionPts(), maxPos(), 120, 85) + " L190,120 L10,120 Z"} fill="#14b8a6" opacity="0.12" />
        <path d={plotPath(positionPts(), maxPos(), 120, 85)} fill="none" stroke="#14b8a6" stroke-width="2" />
        {/* Width indicator */}
        <line x1={100 - sigmaX() * 18} y1="125" x2={100 + sigmaX() * 18} y2="125" stroke="#14b8a6" stroke-width="2" />
        <text x="100" y="138" text-anchor="middle" font-size="9" fill="#14b8a6">σ_x = {sigmaX().toFixed(2)}</text>

        {/* Momentum space */}
        <text x="325" y="15" text-anchor="middle" font-size="11" font-weight="600" fill="#ec4899">Momentum Space |φ(k)|²</text>
        <line x1="230" y1="120" x2="410" y2="120" stroke="var(--border)" stroke-width="1" />
        <line x1="320" y1="25" x2="320" y2="120" stroke="var(--border)" stroke-width="1" stroke-dasharray="3 3" />
        <path d={momentumPts().map((p, i) => {
          const px = 230 + (i / 200) * 180;
          const py = 120 - (p.val / maxMom()) * 85;
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ") + " L410,120 L230,120 Z"} fill="#ec4899" opacity="0.12" />
        <path d={momentumPts().map((p, i) => {
          const px = 230 + (i / 200) * 180;
          const py = 120 - (p.val / maxMom()) * 85;
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ")} fill="none" stroke="#ec4899" stroke-width="2" />
        <line x1={320 - sigmaK() * 18} y1="125" x2={320 + sigmaK() * 18} y2="125" stroke="#ec4899" stroke-width="2" />
        <text x="320" y="138" text-anchor="middle" font-size="9" fill="#ec4899">σ_k = {sigmaK().toFixed(2)}</text>

        {/* Uncertainty product */}
        <rect x="110" y="170" width="200" height="70" rx="10" fill="var(--bg-card)" stroke="var(--border)" stroke-width="1" />
        <text x="210" y="195" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-primary)">
          σ_x · σ_k = {product().toFixed(3)}
        </text>
        <text x="210" y="215" text-anchor="middle" font-size="10" fill={product() <= 0.501 ? "#10b981" : "#f59e0b"}>
          {product() <= 0.501 ? "= 1/2  ✓ Minimum uncertainty!" : `> 1/2 (minimum is 0.500)`}
        </text>
        <text x="210" y="232" text-anchor="middle" font-size="9" fill="var(--text-muted)">
          Gaussian always achieves σ_x·σ_k = 1/2
        </text>
      </svg>
    </div>
  );
};
