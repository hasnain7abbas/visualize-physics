import { Component, createSignal, createMemo } from "solid-js";

export const Q4Tunneling: Component = () => {
  const [barrierH, setBarrierH] = createSignal(3);
  const [barrierW, setBarrierW] = createSignal(1.5);
  const energy = 1.5;

  const kappa = createMemo(() => Math.sqrt(2 * (barrierH() - energy)));
  const transmissionT = createMemo(() => {
    const k = kappa();
    const w = barrierW();
    if (barrierH() <= energy) return 1;
    return 1 / (1 + (Math.sinh(k * w) ** 2 * barrierH() ** 2) / (4 * energy * (barrierH() - energy)));
  });

  const wavePts = createMemo(() => {
    const pts: { x: number; psi: number }[] = [];
    const bLeft = 0.35, bRight = bLeft + barrierW() / 10;
    const T = transmissionT();
    for (let i = 0; i <= 300; i++) {
      const x = i / 300;
      let psi: number;
      if (x < bLeft) {
        const k1 = Math.sqrt(2 * energy) * 8;
        psi = Math.sin(k1 * x);
      } else if (x <= bRight) {
        const decay = Math.exp(-kappa() * (x - bLeft) * 10);
        psi = Math.sin(Math.sqrt(2 * energy) * 8 * bLeft) * decay;
      } else {
        const ampOut = Math.sqrt(T);
        const k1 = Math.sqrt(2 * energy) * 8;
        psi = ampOut * Math.sin(k1 * (x - bRight) + k1 * bLeft);
      }
      pts.push({ x, psi });
    }
    return pts;
  });

  const bLeft = 0.35, bRight = () => bLeft + barrierW() / 10;

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>V₀ = {barrierH().toFixed(1)}</label>
          <input type="range" min="1.6" max="8" step="0.1" value={barrierH()} onInput={(e) => setBarrierH(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #ec4899 ${((barrierH() - 1.6) / 6.4) * 100}%, var(--border) ${((barrierH() - 1.6) / 6.4) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>w = {barrierW().toFixed(1)}</label>
          <input type="range" min="0.3" max="4" step="0.1" value={barrierW()} onInput={(e) => setBarrierW(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #6366f1 ${((barrierW() - 0.3) / 3.7) * 100}%, var(--border) ${((barrierW() - 0.3) / 3.7) * 100}%)` }} />
        </div>
      </div>

      <svg width="100%" height="240" viewBox="0 0 420 240" class="mx-auto">
        <line x1="30" y1="160" x2="400" y2="160" stroke="var(--border)" stroke-width="1" />
        <text x="215" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Quantum Tunneling Through Barrier</text>

        {/* Barrier rectangle */}
        <rect x={30 + bLeft * 370} y={160 - (barrierH() / 8) * 120} width={(bRight() - bLeft) * 370} height={(barrierH() / 8) * 120}
          fill="#ec4899" opacity="0.15" stroke="#ec4899" stroke-width="1.5" />
        <text x={30 + ((bLeft + bRight()) / 2) * 370} y={155 - (barrierH() / 8) * 120} text-anchor="middle" font-size="8" fill="#ec4899">V₀</text>

        {/* Energy level */}
        <line x1="30" y1={160 - (energy / 8) * 120} x2="400" y2={160 - (energy / 8) * 120} stroke="#f59e0b" stroke-width="1" stroke-dasharray="4 3" />
        <text x="405" y={164 - (energy / 8) * 120} font-size="8" fill="#f59e0b">E</text>

        {/* Wavefunction */}
        <path
          d={wavePts().map((p, i) => {
            const px = 30 + p.x * 370;
            const py = 160 - p.psi * 55;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")}
          fill="none" stroke="#06b6d4" stroke-width="2" />
      </svg>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Transmission T</div>
          <div class="text-lg font-bold" style={{ color: "#06b6d4" }}>{(transmissionT() * 100).toFixed(2)}%</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Decay Rate</div>
          <div class="text-lg font-bold" style={{ color: "#ec4899" }}>{kappa().toFixed(3)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>V₀/E</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>{(barrierH() / energy).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export const Q4AlphaDecay: Component = () => {
  const [nuclearZ, setNuclearZ] = createSignal(92);
  const [running, setRunning] = createSignal(false);
  const [decayed, setDecayed] = createSignal(0);
  const [total, setTotal] = createSignal(200);
  const [elapsed, setElapsed] = createSignal(0);

  const halfLife = createMemo(() => Math.exp((nuclearZ() - 82) * 0.6));
  const decayProb = createMemo(() => 1 - Math.exp(-Math.log(2) / halfLife()));

  const startDecay = () => {
    setRunning(true);
    setDecayed(0);
    setElapsed(0);
    const t = total();
    let remaining = t;
    let step = 0;
    const iv = setInterval(() => {
      step++;
      let newDecays = 0;
      for (let i = 0; i < remaining; i++) {
        if (Math.random() < decayProb()) newDecays++;
      }
      remaining -= newDecays;
      setDecayed(t - remaining);
      setElapsed(step);
      if (remaining <= 0 || step > 100) { clearInterval(iv); setRunning(false); }
    }, 120);
  };

  const remaining = () => total() - decayed();
  const fractionLeft = () => remaining() / total();

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>Z = {nuclearZ()}</label>
        <input type="range" min="84" max="100" step="1" value={nuclearZ()} onInput={(e) => setNuclearZ(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #14b8a6 ${((nuclearZ() - 84) / 16) * 100}%, var(--border) ${((nuclearZ() - 84) / 16) * 100}%)` }} />
      </div>

      <svg width="100%" height="200" viewBox="0 0 420 200" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Alpha Decay (Tunneling from Nucleus)</text>
        <line x1="50" y1="170" x2="390" y2="170" stroke="var(--border)" stroke-width="1" />
        <line x1="50" y1="170" x2="50" y2="25" stroke="var(--border)" stroke-width="1" />
        <text x="220" y="190" text-anchor="middle" font-size="9" fill="var(--text-muted)">Time Steps</text>

        {/* Theoretical decay curve */}
        {Array.from({ length: 100 }, (_, i) => {
          const t = i;
          const frac = Math.exp(-Math.log(2) * t / halfLife());
          const px = 50 + (t / 100) * 340;
          const py = 170 - frac * 135;
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ").split("").length > 0 && (
          <path d={Array.from({ length: 100 }, (_, i) => {
            const frac = Math.exp(-Math.log(2) * i / halfLife());
            const px = 50 + (i / 100) * 340;
            const py = 170 - frac * 135;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")} fill="none" stroke="#14b8a6" stroke-width="2" stroke-dasharray="4 3" />
        )}

        {/* Current marker */}
        {elapsed() > 0 && (
          <circle cx={50 + (elapsed() / 100) * 340} cy={170 - fractionLeft() * 135} r="5" fill="#ec4899" stroke="white" stroke-width="2" />
        )}

        {/* Half-life marker */}
        <line x1={50 + (halfLife() / 100) * 340} y1="25" x2={50 + (halfLife() / 100) * 340} y2="170"
          stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 3" />
        <text x={Math.min(50 + (halfLife() / 100) * 340, 370)} y="22" text-anchor="middle" font-size="8" fill="#f59e0b">t½={halfLife().toFixed(1)}</text>
      </svg>

      <div class="flex justify-center gap-2">
        <button onClick={startDecay} disabled={running()}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: running() ? "var(--bg-secondary)" : "#14b8a6", color: running() ? "var(--text-muted)" : "white" }}>
          {running() ? "Decaying..." : "Start Decay"}
        </button>
        <button onClick={() => { setDecayed(0); setElapsed(0); }}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Remaining</div>
          <div class="text-lg font-bold" style={{ color: "#14b8a6" }}>{remaining()}/{total()}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Half-Life</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>{halfLife().toFixed(1)} steps</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Elapsed</div>
          <div class="text-lg font-bold" style={{ color: "#ec4899" }}>{elapsed()}</div>
        </div>
      </div>
    </div>
  );
};

export const Q4ResonantTunneling: Component = () => {
  const [wellWidth, setWellWidth] = createSignal(2.0);
  const [barrierV, setBarrierV] = createSignal(5);

  const transmissionCurve = createMemo(() => {
    const pts: { e: number; T: number }[] = [];
    const V0 = barrierV(), w = 0.5, d = wellWidth();
    for (let i = 1; i <= 200; i++) {
      const E = (i / 200) * V0 * 1.2;
      let T: number;
      if (E >= V0) {
        T = 0.85 + 0.15 * Math.sin(Math.sqrt(2 * E) * d);
      } else {
        const kappa = Math.sqrt(2 * (V0 - E));
        const k = Math.sqrt(2 * E);
        const singleBarrier = 1 / (1 + (Math.sinh(kappa * w) ** 2 * V0 ** 2) / (4 * E * (V0 - E) + 0.001));
        const phase = k * d;
        const resonanceFactor = 1 / (1 + (1 - singleBarrier) ** 2 * Math.sin(phase) ** 2 / (4 * singleBarrier + 0.001));
        T = Math.min(singleBarrier * resonanceFactor * 4, 1);
      }
      pts.push({ e: E, T: Math.min(T, 1) });
    }
    return pts;
  });

  const resonanceEnergies = createMemo(() => {
    const d = wellWidth();
    const energies: number[] = [];
    for (let n = 1; n <= 5; n++) {
      const En = (n * Math.PI / d) ** 2 / 2;
      if (En < barrierV()) energies.push(En);
    }
    return energies;
  });

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>Well d={wellWidth().toFixed(1)}</label>
          <input type="range" min="0.5" max="5" step="0.1" value={wellWidth()} onInput={(e) => setWellWidth(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #6366f1 ${((wellWidth() - 0.5) / 4.5) * 100}%, var(--border) ${((wellWidth() - 0.5) / 4.5) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>V₀={barrierV()}</label>
          <input type="range" min="2" max="12" step="0.5" value={barrierV()} onInput={(e) => setBarrierV(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #ec4899 ${((barrierV() - 2) / 10) * 100}%, var(--border) ${((barrierV() - 2) / 10) * 100}%)` }} />
        </div>
      </div>

      <svg width="100%" height="250" viewBox="0 0 420 250" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Resonant Tunneling: T(E) vs Energy</text>
        <line x1="50" y1="210" x2="390" y2="210" stroke="var(--border)" stroke-width="1" />
        <line x1="50" y1="210" x2="50" y2="25" stroke="var(--border)" stroke-width="1" />
        <text x="220" y="240" text-anchor="middle" font-size="9" fill="var(--text-muted)">Energy E</text>
        <text x="15" y="120" text-anchor="middle" font-size="9" fill="var(--text-muted)" transform="rotate(-90 15 120)">T(E)</text>

        {/* T=1 line */}
        <line x1="50" y1={210 - 175} x2="390" y2={210 - 175} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="2 4" />
        <text x="45" y={210 - 175 + 3} text-anchor="end" font-size="7" fill="var(--text-muted)">1.0</text>

        {/* V0 marker */}
        <line x1={50 + (barrierV() / (barrierV() * 1.2)) * 340} y1="25" x2={50 + (barrierV() / (barrierV() * 1.2)) * 340} y2="210"
          stroke="#ec4899" stroke-width="1" stroke-dasharray="3 3" />
        <text x={50 + (barrierV() / (barrierV() * 1.2)) * 340} y="22" text-anchor="middle" font-size="8" fill="#ec4899">V₀</text>

        {/* Resonance energy markers */}
        {resonanceEnergies().map((en, idx) => (
          <line x1={50 + (en / (barrierV() * 1.2)) * 340} y1="25" x2={50 + (en / (barrierV() * 1.2)) * 340} y2="210"
            stroke="#f59e0b" stroke-width="0.5" stroke-dasharray="2 2" opacity="0.5" />
        ))}

        {/* Transmission curve */}
        <path
          d={transmissionCurve().map((p, i) => {
            const px = 50 + (p.e / (barrierV() * 1.2)) * 340;
            const py = 210 - p.T * 175;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")}
          fill="none" stroke="#6366f1" stroke-width="2.5" />

        {/* Fill under curve */}
        <path
          d={transmissionCurve().map((p, i) => {
            const px = 50 + (p.e / (barrierV() * 1.2)) * 340;
            const py = 210 - p.T * 175;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ") + " L390,210 L50,210 Z"}
          fill="#6366f1" opacity="0.08" />
      </svg>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Resonances</div>
          <div class="text-lg font-bold" style={{ color: "#6366f1" }}>{resonanceEnergies().length}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Well Width</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>{wellWidth().toFixed(1)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Barrier V₀</div>
          <div class="text-lg font-bold" style={{ color: "#ec4899" }}>{barrierV()}</div>
        </div>
      </div>
    </div>
  );
};
