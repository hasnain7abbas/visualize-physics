import { Component, createSignal, createMemo } from "solid-js";

export const S1PartitionFunction: Component = () => {
  const [temp, setTemp] = createSignal(1.0);
  const [gap, setGap] = createSignal(1.0); // energy gap between levels

  const beta = () => 1 / temp();
  const nLevels = 12;

  const thermo = createMemo(() => {
    let Z = 0, avgE = 0, avgE2 = 0, S = 0;
    const probs: number[] = [];

    for (let i = 0; i < nLevels; i++) {
      const E = i * gap();
      Z += Math.exp(-beta() * E);
    }

    for (let i = 0; i < nLevels; i++) {
      const E = i * gap();
      const p = Math.exp(-beta() * E) / Z;
      probs.push(p);
      avgE += p * E;
      avgE2 += p * E * E;
      if (p > 1e-15) S -= p * Math.log(p);
    }

    const Cv = (avgE2 - avgE * avgE) / (temp() ** 2);
    const F = -temp() * Math.log(Z);

    return { Z, avgE, S, Cv, F, probs };
  });

  // Plot Cv vs T
  const cvCurve = createMemo(() => {
    const pts: { T: number; Cv: number }[] = [];
    for (let i = 1; i <= 100; i++) {
      const T = (i / 100) * 5;
      const b = 1 / T;
      let Z = 0;
      for (let j = 0; j < nLevels; j++) Z += Math.exp(-b * j * gap());
      let avgE = 0, avgE2 = 0;
      for (let j = 0; j < nLevels; j++) {
        const E = j * gap();
        const p = Math.exp(-b * E) / Z;
        avgE += p * E;
        avgE2 += p * E * E;
      }
      pts.push({ T, Cv: (avgE2 - avgE ** 2) / (T ** 2) });
    }
    return pts;
  });

  const maxCv = createMemo(() => Math.max(...cvCurve().map((p) => p.Cv), 0.01));

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "50px" }}>kT = {temp().toFixed(2)}</label>
          <input type="range" min="0.1" max="5" step="0.05" value={temp()} onInput={(e) => setTemp(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #f59e0b ${((temp() - 0.1) / 4.9) * 100}%, var(--border) ${((temp() - 0.1) / 4.9) * 100}%)` }}
          />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "50px" }}>ΔE = {gap().toFixed(2)}</label>
          <input type="range" min="0.1" max="3" step="0.05" value={gap()} onInput={(e) => setGap(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #6366f1 ${((gap() - 0.1) / 2.9) * 100}%, var(--border) ${((gap() - 0.1) / 2.9) * 100}%)` }}
          />
        </div>
      </div>

      {/* Cv vs T plot */}
      <svg width="100%" height="160" viewBox="0 0 420 160" class="mx-auto">
        <text x="210" y="15" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Heat Capacity C_v vs Temperature</text>
        <line x1="50" y1="140" x2="400" y2="140" stroke="var(--border)" stroke-width="1" />
        <line x1="50" y1="140" x2="50" y2="25" stroke="var(--border)" stroke-width="1" />
        <text x="220" y="155" text-anchor="middle" font-size="9" fill="var(--text-muted)">kT</text>
        <text x="30" y="80" text-anchor="middle" font-size="9" fill="var(--text-muted)" transform="rotate(-90 30 80)">C_v</text>

        <path
          d={cvCurve().map((p, i) => {
            const px = 50 + (p.T / 5) * 350;
            const py = 140 - (p.Cv / maxCv()) * 105;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")}
          fill="none" stroke="#f59e0b" stroke-width="2"
        />

        {/* Current T marker */}
        <circle
          cx={50 + (temp() / 5) * 350}
          cy={140 - (thermo().Cv / maxCv()) * 105}
          r="5" fill="#f59e0b" stroke="white" stroke-width="2"
        />
      </svg>

      {/* Thermodynamic quantities */}
      <div class="grid grid-cols-5 gap-2 text-center">
        {[
          { label: "Z", val: thermo().Z.toFixed(3), color: "#f59e0b" },
          { label: "⟨E⟩", val: thermo().avgE.toFixed(3), color: "#06b6d4" },
          { label: "S/k_B", val: thermo().S.toFixed(3), color: "#10b981" },
          { label: "C_v", val: thermo().Cv.toFixed(3), color: "#ec4899" },
          { label: "F/kT", val: (thermo().F / temp()).toFixed(3), color: "#6366f1" },
        ].map((item) => (
          <div class="card p-2">
            <div class="text-[9px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{item.label}</div>
            <div class="text-sm font-bold" style={{ color: item.color }}>{item.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
