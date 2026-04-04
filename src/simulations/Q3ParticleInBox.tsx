import { Component, createSignal, createMemo, For } from "solid-js";

export const Q3ParticleInBox: Component = () => {
  const [n, setN] = createSignal(1);
  const [showN2, setShowN2] = createSignal(false);
  const [n2, setN2] = createSignal(2);
  const [mix, setMix] = createSignal(0.5);

  const points = createMemo(() => {
    const pts: { x: number; psi: number; prob: number }[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = i / 200;
      let psi: number;
      if (showN2()) {
        const c1 = Math.sqrt(mix());
        const c2 = Math.sqrt(1 - mix());
        psi = c1 * Math.sqrt(2) * Math.sin(n() * Math.PI * x) +
              c2 * Math.sqrt(2) * Math.sin(n2() * Math.PI * x);
      } else {
        psi = Math.sqrt(2) * Math.sin(n() * Math.PI * x);
      }
      pts.push({ x, psi, prob: psi * psi });
    }
    return pts;
  });

  const maxProb = createMemo(() => Math.max(...points().map((p) => p.prob), 0.01));

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "40px" }}>n = {n()}</label>
        <input type="range" min="1" max="8" step="1" value={n()} onInput={(e) => setN(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #14b8a6 ${((n() - 1) / 7) * 100}%, var(--border) ${((n() - 1) / 7) * 100}%)` }}
        />
      </div>

      <div class="flex items-center gap-3">
        <button onClick={() => setShowN2(!showN2())} class="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
          style={{ background: showN2() ? "#14b8a6" : "var(--bg-secondary)", color: showN2() ? "white" : "var(--text-secondary)" }}>
          {showN2() ? "Superposition ON" : "Add superposition"}
        </button>
        {showN2() && (
          <>
            <label class="text-[11px]" style={{ color: "var(--text-muted)" }}>n₂={n2()}</label>
            <input type="range" min="1" max="8" step="1" value={n2()} onInput={(e) => setN2(parseInt(e.currentTarget.value))}
              class="w-20 h-2 rounded-full appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
            <label class="text-[11px]" style={{ color: "var(--text-muted)" }}>mix={mix().toFixed(2)}</label>
            <input type="range" min="0" max="1" step="0.01" value={mix()} onInput={(e) => setMix(parseFloat(e.currentTarget.value))}
              class="w-20 h-2 rounded-full appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
          </>
        )}
      </div>

      <svg width="100%" height="250" viewBox="0 0 420 250" class="mx-auto">
        {/* Box walls */}
        <line x1="40" y1="20" x2="40" y2="230" stroke="var(--text-primary)" stroke-width="3" />
        <line x1="400" y1="20" x2="400" y2="230" stroke="var(--text-primary)" stroke-width="3" />

        {/* Axes */}
        <line x1="40" y1="125" x2="400" y2="125" stroke="var(--border)" stroke-width="1" stroke-dasharray="3 3" />
        <text x="20" y="22" font-size="9" fill="var(--text-muted)">ψ(x)</text>

        {/* Wavefunction */}
        <path
          d={points().map((p, i) => {
            const px = 40 + p.x * 360;
            const py = 125 - (p.psi / Math.sqrt(maxProb())) * 80;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")}
          fill="none" stroke="#14b8a6" stroke-width="2"
        />

        {/* Probability density |ψ|² */}
        <path
          d={points().map((p, i) => {
            const px = 40 + p.x * 360;
            const py = 230 - (p.prob / maxProb()) * 90;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ") + " L400,230 L40,230 Z"}
          fill="#14b8a6" opacity="0.15"
        />
        <path
          d={points().map((p, i) => {
            const px = 40 + p.x * 360;
            const py = 230 - (p.prob / maxProb()) * 90;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")}
          fill="none" stroke="#14b8a6" stroke-width="1.5" stroke-dasharray="4 2"
        />

        <text x="420" y="228" text-anchor="end" font-size="9" fill="var(--text-muted)">|ψ(x)|²</text>

        {/* Energy level indicator */}
        <text x="220" y="18" text-anchor="middle" font-size="11" font-weight="600" fill="#14b8a6">
          E{showN2() ? ` (superposition n=${n()},${n2()})` : `₍${n()}₎`} = {showN2() ? "mixed" : n() ** 2} × E₁
        </text>
      </svg>
    </div>
  );
};
