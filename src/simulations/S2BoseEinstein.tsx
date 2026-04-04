import { Component, createSignal, createMemo } from "solid-js";

export const S2BoseEinstein: Component = () => {
  const [tempRatio, setTempRatio] = createSignal(1.5); // T/Tc

  const condensateFraction = () => tempRatio() >= 1 ? 0 : 1 - Math.pow(tempRatio(), 1.5);
  const excitedFraction = () => 1 - condensateFraction();

  // BEC condensate fraction vs T curve
  const curve = createMemo(() => {
    const pts: { t: number; n0: number }[] = [];
    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * 2.5; // T/Tc
      const n0 = t >= 1 ? 0 : 1 - Math.pow(t, 1.5);
      pts.push({ t, n0 });
    }
    return pts;
  });

  const nParticles = 50;
  const groundState = () => Math.round(condensateFraction() * nParticles);

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "70px" }}>
          T/T_c = {tempRatio().toFixed(2)}
        </label>
        <input type="range" min="0.01" max="2.5" step="0.01" value={tempRatio()} onInput={(e) => setTempRatio(parseFloat(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #06b6d4 ${(tempRatio() / 2.5) * 100}%, var(--border) ${(tempRatio() / 2.5) * 100}%)` }}
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        {/* Condensate fraction plot */}
        <svg width="100%" height="200" viewBox="0 0 200 200">
          <text x="100" y="15" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)">Condensate Fraction N₀/N</text>
          <line x1="30" y1="175" x2="190" y2="175" stroke="var(--border)" stroke-width="1" />
          <line x1="30" y1="175" x2="30" y2="25" stroke="var(--border)" stroke-width="1" />
          <text x="110" y="195" text-anchor="middle" font-size="8" fill="var(--text-muted)">T / T_c</text>

          {/* T_c marker */}
          <line x1={30 + (1 / 2.5) * 160} y1="25" x2={30 + (1 / 2.5) * 160} y2="175"
            stroke="#ef4444" stroke-width="1" stroke-dasharray="3 3" />
          <text x={30 + (1 / 2.5) * 160} y="22" text-anchor="middle" font-size="8" fill="#ef4444">T_c</text>

          <path
            d={curve().map((p, i) => {
              const px = 30 + (p.t / 2.5) * 160;
              const py = 175 - p.n0 * 140;
              return `${i === 0 ? "M" : "L"}${px},${py}`;
            }).join(" ")}
            fill="none" stroke="#06b6d4" stroke-width="2"
          />
          <path
            d={curve().map((p, i) => {
              const px = 30 + (p.t / 2.5) * 160;
              const py = 175 - p.n0 * 140;
              return `${i === 0 ? "M" : "L"}${px},${py}`;
            }).join(" ") + " L190,175 L30,175 Z"}
            fill="#06b6d4" opacity="0.1"
          />

          {/* Current point */}
          <circle
            cx={30 + (tempRatio() / 2.5) * 160}
            cy={175 - condensateFraction() * 140}
            r="5" fill="#06b6d4" stroke="white" stroke-width="2"
          />
        </svg>

        {/* Energy level visualization */}
        <svg width="100%" height="200" viewBox="0 0 200 200">
          <text x="100" y="15" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)">Energy Level Occupation</text>

          {/* Ground state (thick) */}
          <line x1="30" y1="175" x2="170" y2="175" stroke="#06b6d4" stroke-width="3" />
          <text x="20" y="179" text-anchor="end" font-size="8" fill="var(--text-muted)">E₀</text>

          {/* Ground state particles */}
          {Array.from({ length: groundState() }, (_, i) => (
            <circle
              cx={40 + (i % 10) * 13}
              cy={170 - Math.floor(i / 10) * 12}
              r="4" fill="#06b6d4" opacity="0.7"
            />
          ))}

          {/* Excited levels */}
          {[1, 2, 3, 4].map((level) => {
            const y = 175 - level * 30;
            const excited = nParticles - groundState();
            const onLevel = level <= excited ? Math.ceil(excited / 4) : 0;
            return (
              <>
                <line x1="30" y1={y} x2="170" y2={y} stroke="var(--border)" stroke-width="1" />
                <text x="20" y={y + 4} text-anchor="end" font-size="8" fill="var(--text-muted)">E{level}</text>
                {Array.from({ length: Math.min(onLevel, 5) }, (_, j) => (
                  <circle cx={50 + j * 15} cy={y - 6} r="3.5" fill="#f59e0b" opacity="0.6" />
                ))}
              </>
            );
          })}

          <text x="100" y="195" text-anchor="middle" font-size="8" fill="#06b6d4">
            Ground: {groundState()} | Excited: {nParticles - groundState()}
          </text>
        </svg>
      </div>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>N₀/N</div>
          <div class="text-lg font-bold" style={{ color: "#06b6d4" }}>{(condensateFraction() * 100).toFixed(1)}%</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Phase</div>
          <div class="text-lg font-bold" style={{ color: tempRatio() < 1 ? "#06b6d4" : "#f59e0b" }}>
            {tempRatio() < 1 ? "BEC" : "Normal"}
          </div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>T/T_c</div>
          <div class="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{tempRatio().toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};
