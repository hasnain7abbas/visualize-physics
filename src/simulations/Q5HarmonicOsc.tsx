import { Component, createSignal, createMemo } from "solid-js";

export const Q5EnergyLevels: Component = () => {
  const [selectedN, setSelectedN] = createSignal(0);
  const [omega, setOmega] = createSignal(1.0);

  const hermite = (n: number, x: number): number => {
    if (n === 0) return 1;
    if (n === 1) return 2 * x;
    let h0 = 1, h1 = 2 * x;
    for (let i = 2; i <= n; i++) {
      const h2 = 2 * x * h1 - 2 * (i - 1) * h0;
      h0 = h1; h1 = h2;
    }
    return h1;
  };

  const factorial = (n: number): number => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };

  const wavefunction = createMemo(() => {
    const n = selectedN();
    const pts: { x: number; psi: number; prob: number }[] = [];
    const norm = 1 / Math.sqrt(Math.pow(2, n) * factorial(n) * Math.sqrt(Math.PI));
    for (let i = 0; i <= 200; i++) {
      const x = (i / 200) * 10 - 5;
      const psi = norm * hermite(n, x) * Math.exp(-x * x / 2);
      pts.push({ x, psi, prob: psi * psi });
    }
    return pts;
  });

  const maxProb = createMemo(() => Math.max(...wavefunction().map((p) => p.prob), 0.01));

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>omega = {omega().toFixed(1)}</label>
        <input type="range" min="0.3" max="3" step="0.1" value={omega()} onInput={(e) => setOmega(parseFloat(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #6366f1 ${((omega() - 0.3) / 2.7) * 100}%, var(--border) ${((omega() - 0.3) / 2.7) * 100}%)` }} />
      </div>

      <svg width="100%" height="260" viewBox="0 0 420 260" class="mx-auto">
        {/* Energy levels on left */}
        <text x="60" y="14" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)">Energy Levels</text>
        {[0, 1, 2, 3, 4, 5].map((n) => {
          const en = (n + 0.5) * omega();
          const y = 240 - (en / (6 * omega())) * 210;
          return (
            <>
              <line x1="20" y1={y} x2="100" y2={y} stroke={n === selectedN() ? "#6366f1" : "var(--border)"} stroke-width={n === selectedN() ? 2.5 : 1} />
              <text x="15" y={y + 3} text-anchor="end" font-size="7" fill={n === selectedN() ? "#6366f1" : "var(--text-muted)"}>{n}</text>
              <text x="105" y={y + 3} font-size="7" fill={n === selectedN() ? "#6366f1" : "var(--text-muted)"}>{en.toFixed(1)}hw</text>
              <rect x="20" y={y - 8} width="80" height="16" fill="transparent" style={{ cursor: "pointer" }}
                onClick={() => setSelectedN(n)} />
            </>
          );
        })}
        <text x="60" y="252" text-anchor="middle" font-size="7" fill="var(--text-muted)">Click level to select</text>

        {/* Wavefunction on right */}
        <text x="280" y="14" text-anchor="middle" font-size="9" font-weight="600" fill="#6366f1">psi_{selectedN()}(x)</text>
        <line x1="140" y1="130" x2="400" y2="130" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />

        {/* Parabolic potential */}
        <path d={Array.from({ length: 100 }, (_, i) => {
          const x = (i / 100) * 260;
          const xc = x - 130;
          const py = 130 - Math.min((xc * xc) / 500, 105);
          return `${i === 0 ? "M" : "L"}${140 + x},${py}`;
        }).join(" ")} fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.4" />

        {/* Probability fill */}
        <path d={wavefunction().map((p, i) => {
          const px = 140 + ((p.x + 5) / 10) * 260;
          const py = 130 - (p.prob / maxProb()) * 90;
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ") + " L400,130 L140,130 Z"} fill="#6366f1" opacity="0.1" />

        {/* Wavefunction curve */}
        <path d={wavefunction().map((p, i) => {
          const px = 140 + ((p.x + 5) / 10) * 260;
          const py = 130 - (p.psi / Math.sqrt(maxProb())) * 80;
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ")} fill="none" stroke="#6366f1" stroke-width="2" />

        {/* Probability density */}
        <path d={wavefunction().map((p, i) => {
          const px = 140 + ((p.x + 5) / 10) * 260;
          const py = 240 - (p.prob / maxProb()) * 80;
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ")} fill="none" stroke="#ec4899" stroke-width="1.5" stroke-dasharray="4 2" />
        <text x="390" y="235" text-anchor="end" font-size="8" fill="#ec4899">|psi|^2</text>
      </svg>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Level n</div>
          <div class="text-lg font-bold" style={{ color: "#6366f1" }}>{selectedN()}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Energy</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>{((selectedN() + 0.5) * omega()).toFixed(2)} hw</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Nodes</div>
          <div class="text-lg font-bold" style={{ color: "#ec4899" }}>{selectedN()}</div>
        </div>
      </div>
    </div>
  );
};

export const Q5CoherentStates: Component = () => {
  const [alpha, setAlpha] = createSignal(2.0);
  const [time, setTime] = createSignal(0);
  const [running, setRunning] = createSignal(false);

  const startOscillation = () => {
    setRunning(true);
    let t = 0;
    const iv = setInterval(() => {
      t += 0.05;
      setTime(t);
      if (t > 4 * Math.PI) { t = 0; }
    }, 30);
    const stop = () => { clearInterval(iv); setRunning(false); };
    setTimeout(stop, 15000);
  };

  const gaussianCenter = () => alpha() * Math.cos(time());
  const gaussianPts = createMemo(() => {
    const center = gaussianCenter();
    const sigma = 0.5;
    const pts: { x: number; val: number }[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = (i / 200) * 10 - 5;
      const val = Math.exp(-((x - center) ** 2) / (2 * sigma * sigma));
      pts.push({ x, val });
    }
    return pts;
  });

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>alpha = {alpha().toFixed(1)}</label>
        <input type="range" min="0.5" max="4" step="0.1" value={alpha()} onInput={(e) => setAlpha(parseFloat(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #14b8a6 ${((alpha() - 0.5) / 3.5) * 100}%, var(--border) ${((alpha() - 0.5) / 3.5) * 100}%)` }} />
      </div>

      <svg width="100%" height="220" viewBox="0 0 420 220" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Coherent State: Oscillating Gaussian</text>

        {/* Parabolic potential */}
        <path d={Array.from({ length: 200 }, (_, i) => {
          const x = (i / 200) * 10 - 5;
          const px = 30 + ((x + 5) / 10) * 370;
          const py = 180 - Math.min(x * x * 3, 140);
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ")} fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.3" />

        <line x1="30" y1="180" x2="400" y2="180" stroke="var(--border)" stroke-width="1" />

        {/* Gaussian wavepacket fill */}
        <path d={gaussianPts().map((p, i) => {
          const px = 30 + ((p.x + 5) / 10) * 370;
          const py = 180 - p.val * 130;
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ") + " L400,180 L30,180 Z"} fill="#14b8a6" opacity="0.15" />

        {/* Gaussian wavepacket */}
        <path d={gaussianPts().map((p, i) => {
          const px = 30 + ((p.x + 5) / 10) * 370;
          const py = 180 - p.val * 130;
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ")} fill="none" stroke="#14b8a6" stroke-width="2.5" />

        {/* Center marker */}
        <circle cx={30 + ((gaussianCenter() + 5) / 10) * 370} cy={180} r="4" fill="#ec4899" />
        <line x1={30 + ((gaussianCenter() + 5) / 10) * 370} y1="180" x2={30 + ((gaussianCenter() + 5) / 10) * 370} y2={50}
          stroke="#ec4899" stroke-width="0.5" stroke-dasharray="2 3" />
      </svg>

      <div class="flex justify-center gap-2">
        <button onClick={startOscillation} disabled={running()}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: running() ? "var(--bg-secondary)" : "#14b8a6", color: running() ? "var(--text-muted)" : "white" }}>
          {running() ? "Oscillating..." : "Start Oscillation"}
        </button>
        <button onClick={() => setTime(0)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Amplitude</div>
          <div class="text-lg font-bold" style={{ color: "#14b8a6" }}>{alpha().toFixed(1)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Mean n</div>
          <div class="text-lg font-bold" style={{ color: "#6366f1" }}>{(alpha() ** 2).toFixed(1)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Position</div>
          <div class="text-lg font-bold" style={{ color: "#ec4899" }}>{gaussianCenter().toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export const Q5ZeroPoint: Component = () => {
  const [showClassical, setShowClassical] = createSignal(true);
  const [omega, setOmega] = createSignal(1.0);

  const quantumProb = createMemo(() => {
    const pts: { x: number; val: number }[] = [];
    const sigma = 1 / Math.sqrt(omega());
    for (let i = 0; i <= 200; i++) {
      const x = (i / 200) * 8 - 4;
      const val = Math.exp(-x * x * omega()) * Math.sqrt(omega() / Math.PI);
      pts.push({ x, val });
    }
    return pts;
  });

  const classicalProb = createMemo(() => {
    const A = 2.0 / Math.sqrt(omega());
    const pts: { x: number; val: number }[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = (i / 200) * 8 - 4;
      if (Math.abs(x) >= A) { pts.push({ x, val: 0 }); continue; }
      const val = 1 / (Math.PI * Math.sqrt(A * A - x * x));
      pts.push({ x, val: Math.min(val, 2) });
    }
    return pts;
  });

  const maxQ = createMemo(() => Math.max(...quantumProb().map((p) => p.val), 0.01));
  const maxC = createMemo(() => Math.max(...classicalProb().map((p) => p.val), 0.01));
  const maxAll = createMemo(() => Math.max(maxQ(), showClassical() ? maxC() : 0));

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>omega = {omega().toFixed(1)}</label>
        <input type="range" min="0.3" max="3" step="0.1" value={omega()} onInput={(e) => setOmega(parseFloat(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #10b981 ${((omega() - 0.3) / 2.7) * 100}%, var(--border) ${((omega() - 0.3) / 2.7) * 100}%)` }} />
      </div>

      <svg width="100%" height="220" viewBox="0 0 420 220" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Zero-Point Energy: Quantum vs Classical</text>
        <line x1="40" y1="190" x2="400" y2="190" stroke="var(--border)" stroke-width="1" />
        <line x1="220" y1="25" x2="220" y2="190" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="2 4" />

        {/* Quantum probability */}
        <path d={quantumProb().map((p, i) => {
          const px = 40 + ((p.x + 4) / 8) * 360;
          const py = 190 - (p.val / maxAll()) * 150;
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ") + " L400,190 L40,190 Z"} fill="#10b981" opacity="0.12" />
        <path d={quantumProb().map((p, i) => {
          const px = 40 + ((p.x + 4) / 8) * 360;
          const py = 190 - (p.val / maxAll()) * 150;
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ")} fill="none" stroke="#10b981" stroke-width="2.5" />

        {/* Classical probability */}
        {showClassical() && (
          <path d={classicalProb().map((p, i) => {
            const px = 40 + ((p.x + 4) / 8) * 360;
            const py = 190 - (p.val / maxAll()) * 150;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")} fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5 3" />
        )}

        <text x="350" y="50" font-size="9" font-weight="600" fill="#10b981">Quantum n=0</text>
        {showClassical() && <text x="350" y="65" font-size="9" font-weight="600" fill="#f59e0b">Classical</text>}
      </svg>

      <div class="flex justify-center gap-2">
        <button onClick={() => setShowClassical(!showClassical())}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: showClassical() ? "#f59e0b" : "var(--bg-secondary)", color: showClassical() ? "white" : "var(--text-secondary)" }}>
          {showClassical() ? "Classical ON" : "Show Classical"}
        </button>
      </div>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Zero-Point E</div>
          <div class="text-lg font-bold" style={{ color: "#10b981" }}>{(0.5 * omega()).toFixed(2)} hw</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Quantum Spread</div>
          <div class="text-lg font-bold" style={{ color: "#6366f1" }}>{(1 / Math.sqrt(omega())).toFixed(2)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Classical at x=0</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>0 prob</div>
        </div>
      </div>
    </div>
  );
};
