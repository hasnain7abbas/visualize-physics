import { Component, createSignal, createMemo, onCleanup } from "solid-js";

/* ── Helpers ─────────────────────────────────────────────── */

// Box-Muller transform: two independent standard normals
function randn(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Gamma(shape, scale) via Marsaglia & Tsang's method
function randGamma(shape: number, scale: number): number {
  if (shape < 1) {
    return randGamma(shape + 1, scale) * Math.pow(Math.random(), 1 / shape);
  }
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    let x = randn();
    let v = Math.pow(1 + c * x, 3);
    if (v <= 0) continue;
    const u = Math.random();
    if (u < 1 - 0.0331 * x * x * x * x) return d * v * scale;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v * scale;
  }
}

// Gaussian PDF
function gaussPDF(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

/* ═══════════════════════════════════════════════════════════
   S10EnergyFluctuations
   <(dE)^2> = kT^2 Cv  for N independent harmonic oscillators
   ═══════════════════════════════════════════════════════════ */

export const S10EnergyFluctuations: Component = () => {
  const [N, setN] = createSignal(20);
  const [T, setT] = createSignal(2.0);
  const [samples, setSamples] = createSignal<number[]>([]);

  // Exact results for N classical harmonic oscillators: E ~ Gamma(N, kT)
  const meanE = createMemo(() => N() * T());
  const varE = createMemo(() => N() * T() * T()); // <(dE)^2> = N(kT)^2 = kT^2 * Cv  (Cv = N k)
  const relFluct = createMemo(() => 1 / Math.sqrt(N()));

  // Sample statistics
  const sampleMean = createMemo(() => {
    const s = samples();
    if (s.length === 0) return 0;
    return s.reduce((a, b) => a + b, 0) / s.length;
  });
  const sampleVar = createMemo(() => {
    const s = samples();
    if (s.length < 2) return 0;
    const mu = sampleMean();
    return s.reduce((a, v) => a + (v - mu) ** 2, 0) / (s.length - 1);
  });

  // Histogram
  const histogram = createMemo(() => {
    const s = samples();
    if (s.length === 0) return [];
    const mu = meanE();
    const sig = Math.sqrt(varE());
    const lo = Math.max(0, mu - 4 * sig);
    const hi = mu + 4 * sig;
    const nBins = 40;
    const bw = (hi - lo) / nBins;
    const bins = Array(nBins).fill(0);
    for (const v of s) {
      const idx = Math.floor((v - lo) / bw);
      if (idx >= 0 && idx < nBins) bins[idx]++;
    }
    return bins.map((count, i) => ({
      x: lo + (i + 0.5) * bw,
      density: count / (s.length * bw),
    }));
  });

  const maxHist = createMemo(() => Math.max(...histogram().map((b) => b.density), 0.001));

  // Gaussian fit curve
  const gaussCurve = createMemo(() => {
    const mu = meanE();
    const sig = Math.sqrt(varE());
    const lo = Math.max(0, mu - 4 * sig);
    const hi = mu + 4 * sig;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = lo + (i / 100) * (hi - lo);
      pts.push({ x, y: gaussPDF(x, mu, sig) });
    }
    return pts;
  });

  const xRange = createMemo(() => {
    const mu = meanE();
    const sig = Math.sqrt(varE());
    return { lo: Math.max(0, mu - 4 * sig), hi: mu + 4 * sig };
  });

  const plotMax = createMemo(() => {
    const gMax = Math.max(...gaussCurve().map((p) => p.y), 0.001);
    return Math.max(maxHist(), gMax);
  });

  const addSamples = (n: number) => {
    const newSamples = [...samples()];
    for (let i = 0; i < n; i++) {
      newSamples.push(randGamma(N(), T()));
    }
    setSamples(newSamples);
  };

  return (
    <div class="space-y-5">
      {/* Sliders */}
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>N = {N()}</label>
          <input type="range" min="5" max="100" step="1" value={N()} onInput={(e) => { setN(parseInt(e.currentTarget.value)); setSamples([]); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #7c3aed ${((N() - 5) / 95) * 100}%, var(--border) ${((N() - 5) / 95) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "70px" }}>T = {T().toFixed(1)} kT</label>
          <input type="range" min="0.5" max="5" step="0.1" value={T()} onInput={(e) => { setT(parseFloat(e.currentTarget.value)); setSamples([]); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #7c3aed ${((T() - 0.5) / 4.5) * 100}%, var(--border) ${((T() - 0.5) / 4.5) * 100}%)` }} />
        </div>
      </div>

      {/* Histogram SVG */}
      <svg width="100%" height="230" viewBox="0 0 420 230" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Energy Histogram (N={N()} oscillators, T={T().toFixed(1)})</text>
        <line x1="40" y1="195" x2="400" y2="195" stroke="var(--border)" stroke-width="1" />
        <line x1="40" y1="195" x2="40" y2="25" stroke="var(--border)" stroke-width="1" />
        <text x="220" y="218" text-anchor="middle" font-size="9" fill="var(--text-muted)">Total Energy E</text>

        {/* Histogram bars */}
        {histogram().map((b) => {
          const { lo, hi } = xRange();
          const px = 40 + ((b.x - lo) / (hi - lo)) * 360;
          const bw = (360 / 40);
          const h = (b.density / plotMax()) * 160;
          return <rect x={px - bw / 2} y={195 - h} width={bw} height={h} fill="#7c3aed" opacity="0.3" rx="1" />;
        })}

        {/* Gaussian fit overlay */}
        {samples().length > 0 && (
          <path d={gaussCurve().map((p, i) => {
            const { lo, hi } = xRange();
            const px = 40 + ((p.x - lo) / (hi - lo)) * 360;
            const py = 195 - (p.y / plotMax()) * 160;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")} fill="none" stroke="#c084fc" stroke-width="2.5" />
        )}

        {/* Mean line */}
        {samples().length > 0 && (() => {
          const { lo, hi } = xRange();
          const mx = 40 + ((meanE() - lo) / (hi - lo)) * 360;
          return (
            <>
              <line x1={mx} y1="25" x2={mx} y2="195" stroke="#7c3aed" stroke-width="1" stroke-dasharray="4 3" />
              <text x={mx} y="22" text-anchor="middle" font-size="7" fill="#7c3aed">{"<E>"}</text>
            </>
          );
        })()}

        <text x="380" y="38" text-anchor="end" font-size="8" fill="#c084fc">Gaussian fit</text>
        <text x="380" y="50" text-anchor="end" font-size="8" fill="#7c3aed">Samples</text>
      </svg>

      {/* Buttons */}
      <div class="flex justify-center gap-2">
        <button onClick={() => addSamples(100)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#7c3aed", color: "white" }}>Sample x100</button>
        <button onClick={() => addSamples(1000)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#6d28d9", color: "white" }}>Sample x1000</button>
        <button onClick={() => setSamples([])} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>

      {/* Stats cards */}
      <div class="grid grid-cols-2 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{"<E> exact"}</div>
          <div class="text-lg font-bold" style={{ color: "#7c3aed" }}>{meanE().toFixed(2)}</div>
          <div class="text-[10px]" style={{ color: "var(--text-muted)" }}>measured: {samples().length > 0 ? sampleMean().toFixed(2) : "--"}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{"<(dE)^2> = kT^2 Cv"}</div>
          <div class="text-lg font-bold" style={{ color: "#c084fc" }}>{varE().toFixed(2)}</div>
          <div class="text-[10px]" style={{ color: "var(--text-muted)" }}>measured: {samples().length > 1 ? sampleVar().toFixed(2) : "--"}</div>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Cv (= Nk)</div>
          <div class="text-lg font-bold" style={{ color: "#7c3aed" }}>{N()}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Rel. Fluct. 1/sqrt(N)</div>
          <div class="text-lg font-bold" style={{ color: "#a78bfa" }}>{relFluct().toFixed(3)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Samples</div>
          <div class="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{samples().length}</div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   S10FluctuationDissipation
   Fluctuation-dissipation theorem: chi = beta * <(dM)^2>
   Paramagnet: N spins in external field h
   ═══════════════════════════════════════════════════════════ */

export const S10FluctuationDissipation: Component = () => {
  const [N, setN] = createSignal(50);
  const [T, setT] = createSignal(2.0);
  const [h, setH] = createSignal(1.0);
  const [magSamples, setMagSamples] = createSignal<number[]>([]);
  const [running, setRunning] = createSignal(false);

  // P(+1) for a single spin in field h at temperature T
  const pUp = createMemo(() => {
    const beta = 1 / T();
    const bh = beta * h();
    return Math.exp(bh) / (Math.exp(bh) + Math.exp(-bh));
  });

  // Sample one magnetization
  const sampleM = () => {
    const n = N();
    const p = pUp();
    let m = 0;
    for (let i = 0; i < n; i++) {
      m += Math.random() < p ? 1 : -1;
    }
    return m;
  };

  // Run 500 samples animated
  const runSampling = () => {
    setRunning(true);
    setMagSamples([]);
    let samps: number[] = [];
    let count = 0;
    const iv = setInterval(() => {
      for (let i = 0; i < 50; i++) {
        samps.push(sampleM());
      }
      count += 50;
      setMagSamples([...samps]);
      if (count >= 500) { clearInterval(iv); setRunning(false); }
    }, 30);
  };

  // Sample statistics
  const sampleMeanM = createMemo(() => {
    const s = magSamples();
    if (s.length === 0) return 0;
    return s.reduce((a, b) => a + b, 0) / s.length;
  });
  const sampleVarM = createMemo(() => {
    const s = magSamples();
    if (s.length < 2) return 0;
    const mu = sampleMeanM();
    return s.reduce((a, v) => a + (v - mu) ** 2, 0) / (s.length - 1);
  });

  // Susceptibility from fluctuations: chi_fluct = beta * <(dM)^2>
  const chiFluct = createMemo(() => (1 / T()) * sampleVarM());

  // Susceptibility from numerical derivative: chi_num = dM/dh
  const chiNum = createMemo(() => {
    const beta = 1 / T();
    const dh = 0.01;
    const h0 = h();
    // M(h) = N * tanh(beta * h)
    const Mplus = N() * Math.tanh(beta * (h0 + dh));
    const Mminus = N() * Math.tanh(beta * (h0 - dh));
    return (Mplus - Mminus) / (2 * dh);
  });

  const ratio = createMemo(() => {
    if (chiNum() === 0) return 0;
    return chiFluct() / chiNum();
  });

  // Histogram of magnetization
  const magHistogram = createMemo(() => {
    const s = magSamples();
    if (s.length === 0) return [];
    const nBins = 30;
    const min = -N();
    const max = N();
    const bw = (max - min) / nBins;
    const bins = Array(nBins).fill(0);
    for (const v of s) {
      const idx = Math.min(Math.max(Math.floor((v - min) / bw), 0), nBins - 1);
      bins[idx]++;
    }
    return bins.map((count, i) => ({
      x: min + (i + 0.5) * bw,
      density: count / (s.length * bw),
    }));
  });

  const maxMagHist = createMemo(() => Math.max(...magHistogram().map((b) => b.density), 0.001));

  return (
    <div class="space-y-5">
      {/* Sliders */}
      <div class="space-y-3">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>N = {N()}</label>
          <input type="range" min="10" max="200" step="5" value={N()} onInput={(e) => { setN(parseInt(e.currentTarget.value)); setMagSamples([]); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #7c3aed ${((N() - 10) / 190) * 100}%, var(--border) ${((N() - 10) / 190) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>T = {T().toFixed(1)}</label>
          <input type="range" min="0.5" max="5" step="0.1" value={T()} onInput={(e) => { setT(parseFloat(e.currentTarget.value)); setMagSamples([]); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #7c3aed ${((T() - 0.5) / 4.5) * 100}%, var(--border) ${((T() - 0.5) / 4.5) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "#3b82f6", "min-width": "60px" }}>h = {h().toFixed(1)}</label>
          <input type="range" min="0" max="3" step="0.1" value={h()} onInput={(e) => { setH(parseFloat(e.currentTarget.value)); setMagSamples([]); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #3b82f6 ${(h() / 3) * 100}%, var(--border) ${(h() / 3) * 100}%)` }} />
        </div>
      </div>

      {/* Two-panel display */}
      <div class="grid grid-cols-2 gap-4">
        {/* Left: Magnetization histogram */}
        <svg width="100%" height="200" viewBox="0 0 210 200">
          <text x="105" y="14" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)">Magnetization Histogram</text>
          <line x1="25" y1="175" x2="200" y2="175" stroke="var(--border)" stroke-width="1" />
          <line x1="25" y1="175" x2="25" y2="22" stroke="var(--border)" stroke-width="1" />
          <text x="112" y="192" text-anchor="middle" font-size="7" fill="var(--text-muted)">M</text>

          {magHistogram().map((b) => {
            const px = 25 + ((b.x + N()) / (2 * N())) * 175;
            const bw = 175 / 30;
            const ht = (b.density / maxMagHist()) * 143;
            return <rect x={px - bw / 2} y={175 - ht} width={bw} height={ht} fill="#7c3aed" opacity="0.3" rx="1" />;
          })}

          {/* Mean line */}
          {magSamples().length > 0 && (() => {
            const mx = 25 + ((sampleMeanM() + N()) / (2 * N())) * 175;
            return <line x1={mx} y1="22" x2={mx} y2="175" stroke="#7c3aed" stroke-width="1" stroke-dasharray="3 2" />;
          })()}
        </svg>

        {/* Right: chi comparison bar chart */}
        <svg width="100%" height="200" viewBox="0 0 210 200">
          <text x="105" y="14" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)">Susceptibility Comparison</text>
          <line x1="25" y1="175" x2="200" y2="175" stroke="var(--border)" stroke-width="1" />

          {magSamples().length > 0 && (() => {
            const maxChi = Math.max(chiNum(), chiFluct(), 0.01);
            const barW = 50;
            // chi_num bar
            const h1 = (chiNum() / maxChi) * 130;
            // chi_fluct bar
            const h2 = (chiFluct() / maxChi) * 130;
            return (
              <>
                <rect x={55} y={175 - h1} width={barW} height={h1} fill="#3b82f6" opacity="0.6" rx="3" />
                <text x={80} y={170 - h1} text-anchor="middle" font-size="8" font-weight="600" fill="#3b82f6">{chiNum().toFixed(2)}</text>
                <text x={80} y="190" text-anchor="middle" font-size="7" fill="#3b82f6">dM/dh</text>

                <rect x={120} y={175 - h2} width={barW} height={h2} fill="#7c3aed" opacity="0.6" rx="3" />
                <text x={145} y={170 - h2} text-anchor="middle" font-size="8" font-weight="600" fill="#7c3aed">{chiFluct().toFixed(2)}</text>
                <text x={145} y="190" text-anchor="middle" font-size="7" fill="#7c3aed">{"b<(dM)^2>"}</text>
              </>
            );
          })()}

          {magSamples().length === 0 && (
            <text x="105" y="100" text-anchor="middle" font-size="10" fill="var(--text-muted)">Run sampling to compare</text>
          )}
        </svg>
      </div>

      {/* Buttons */}
      <div class="flex justify-center gap-2">
        <button onClick={runSampling} disabled={running()}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: running() ? "var(--bg-secondary)" : "#7c3aed", color: running() ? "var(--text-muted)" : "white" }}>
          {running() ? "Sampling..." : "Run 500 Samples"}
        </button>
        <button onClick={() => setMagSamples([])} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>

      {/* Stats */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>chi (dM/dh)</div>
          <div class="text-lg font-bold" style={{ color: "#3b82f6" }}>{magSamples().length > 0 ? chiNum().toFixed(2) : "--"}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{"b<(dM)^2>"}</div>
          <div class="text-lg font-bold" style={{ color: "#7c3aed" }}>{magSamples().length > 0 ? chiFluct().toFixed(2) : "--"}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Ratio (should be ~1)</div>
          <div class="text-lg font-bold" style={{ color: magSamples().length > 0 && Math.abs(ratio() - 1) < 0.2 ? "#10b981" : "#f59e0b" }}>
            {magSamples().length > 0 ? ratio().toFixed(3) : "--"}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   S10Brownian
   Langevin equation: m dv/dt = -gamma*v + F_random
   Euler-Maruyama integration in 2D
   ═══════════════════════════════════════════════════════════ */

export const S10Brownian: Component = () => {
  const [gamma, setGamma] = createSignal(1.0);
  const [T, setT] = createSignal(2.0);
  const [mass, setMass] = createSignal(1.0);
  const [running, setRunning] = createSignal(false);
  const [trajectory, setTrajectory] = createSignal<{ x: number; y: number }[]>([{ x: 0, y: 0 }]);
  const [msdData, setMsdData] = createSignal<{ t: number; msd: number }[]>([]);
  let intervalId: number | undefined;

  // State that persists across interval ticks
  let vx = 0, vy = 0;
  let px = 0, py = 0;
  let stepCount = 0;
  // For MSD: store squared displacement at intervals
  let msdAccum: { t: number; msd: number }[] = [];

  const dt = 0.02;

  const resetState = () => {
    vx = 0; vy = 0;
    px = 0; py = 0;
    stepCount = 0;
    msdAccum = [];
    setTrajectory([{ x: 0, y: 0 }]);
    setMsdData([]);
  };

  const startSim = () => {
    if (running()) return;
    resetState();
    setRunning(true);

    intervalId = window.setInterval(() => {
      const g = gamma();
      const temp = T();
      const m = mass();
      const noise = Math.sqrt(2 * g * temp / m) * Math.sqrt(dt);

      // Multiple sub-steps per frame for smoother motion
      for (let i = 0; i < 5; i++) {
        vx = vx - (g / m) * vx * dt + noise * randn();
        vy = vy - (g / m) * vy * dt + noise * randn();
        px += vx * dt;
        py += vy * dt;
        stepCount++;
      }

      setTrajectory((prev) => {
        const next = [...prev, { x: px, y: py }];
        // Keep last 1500 points for performance
        return next.length > 1500 ? next.slice(next.length - 1500) : next;
      });

      // Record MSD every 10 frames
      if (stepCount % 50 === 0) {
        const r2 = px * px + py * py;
        const t = stepCount * dt;
        msdAccum.push({ t, msd: r2 });
        setMsdData([...msdAccum]);
      }

      // Stop after ~3000 frames (~15000 steps)
      if (stepCount >= 15000) {
        stopSim();
      }
    }, 30);
  };

  const stopSim = () => {
    if (intervalId !== undefined) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
    setRunning(false);
  };

  onCleanup(() => {
    if (intervalId !== undefined) clearInterval(intervalId);
  });

  // Compute view bounds for trajectory
  const viewBounds = createMemo(() => {
    const traj = trajectory();
    if (traj.length < 2) return { xMin: -5, xMax: 5, yMin: -5, yMax: 5 };
    let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
    for (const p of traj) {
      if (p.x < xMin) xMin = p.x;
      if (p.x > xMax) xMax = p.x;
      if (p.y < yMin) yMin = p.y;
      if (p.y > yMax) yMax = p.y;
    }
    const pad = Math.max(xMax - xMin, yMax - yMin, 5) * 0.15;
    return { xMin: xMin - pad, xMax: xMax + pad, yMin: yMin - pad, yMax: yMax + pad };
  });

  // Theoretical diffusion constant: D = kT / gamma
  const diffConst = createMemo(() => T() / gamma());
  const maxMsdTime = createMemo(() => {
    const d = msdData();
    return d.length > 0 ? d[d.length - 1].t : 1;
  });
  const maxMsdVal = createMemo(() => {
    const d = msdData();
    if (d.length === 0) return 1;
    return Math.max(...d.map((p) => p.msd), 1);
  });

  // Polyline string for trajectory
  const trajectoryPolyline = createMemo(() => {
    const traj = trajectory();
    const { xMin, xMax, yMin, yMax } = viewBounds();
    const w = xMax - xMin || 1;
    const h = yMax - yMin || 1;
    return traj.map((p) => {
      const sx = 15 + ((p.x - xMin) / w) * 380;
      const sy = 15 + ((p.y - yMin) / h) * 240;
      return `${sx},${sy}`;
    }).join(" ");
  });

  return (
    <div class="space-y-5">
      {/* Sliders */}
      <div class="space-y-3">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>gamma = {gamma().toFixed(1)}</label>
          <input type="range" min="0.1" max="5" step="0.1" value={gamma()} onInput={(e) => setGamma(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #7c3aed ${((gamma() - 0.1) / 4.9) * 100}%, var(--border) ${((gamma() - 0.1) / 4.9) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>T = {T().toFixed(1)}</label>
          <input type="range" min="0.5" max="5" step="0.1" value={T()} onInput={(e) => setT(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #7c3aed ${((T() - 0.5) / 4.5) * 100}%, var(--border) ${((T() - 0.5) / 4.5) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>m = {mass().toFixed(1)}</label>
          <input type="range" min="0.5" max="3" step="0.1" value={mass()} onInput={(e) => setMass(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #7c3aed ${((mass() - 0.5) / 2.5) * 100}%, var(--border) ${((mass() - 0.5) / 2.5) * 100}%)` }} />
        </div>
      </div>

      {/* 2D Trajectory */}
      <svg width="100%" height="270" viewBox="0 0 410 270" class="mx-auto">
        <text x="205" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Brownian Motion (2D Trajectory)</text>
        <rect x="15" y="15" width="380" height="240" fill="none" stroke="var(--border)" stroke-width="1" rx="3" />

        {/* Origin marker */}
        {(() => {
          const { xMin, xMax, yMin, yMax } = viewBounds();
          const w = xMax - xMin || 1;
          const h = yMax - yMin || 1;
          const ox = 15 + ((0 - xMin) / w) * 380;
          const oy = 15 + ((0 - yMin) / h) * 240;
          return <circle cx={ox} cy={oy} r="3" fill="var(--text-muted)" opacity="0.3" />;
        })()}

        {/* Trajectory polyline */}
        <polyline points={trajectoryPolyline()} fill="none" stroke="#7c3aed" stroke-width="1.2" opacity="0.7" />

        {/* Current position */}
        {trajectory().length > 1 && (() => {
          const traj = trajectory();
          const last = traj[traj.length - 1];
          const { xMin, xMax, yMin, yMax } = viewBounds();
          const w = xMax - xMin || 1;
          const h = yMax - yMin || 1;
          const cx = 15 + ((last.x - xMin) / w) * 380;
          const cy = 15 + ((last.y - yMin) / h) * 240;
          return <circle cx={cx} cy={cy} r="5" fill="#c084fc" stroke="white" stroke-width="1.5" />;
        })()}
      </svg>

      {/* MSD vs time plot */}
      <svg width="100%" height="150" viewBox="0 0 410 150" class="mx-auto">
        <text x="205" y="14" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)">{"MSD <r^2> vs time  (D = kT/gamma = " + diffConst().toFixed(2) + ")"}</text>
        <line x1="40" y1="130" x2="390" y2="130" stroke="var(--border)" stroke-width="1" />
        <line x1="40" y1="130" x2="40" y2="22" stroke="var(--border)" stroke-width="1" />
        <text x="215" y="146" text-anchor="middle" font-size="7" fill="var(--text-muted)">time</text>
        <text x="12" y="76" text-anchor="middle" font-size="7" fill="var(--text-muted)" transform="rotate(-90 12 76)">{"<r^2>"}</text>

        {/* Theoretical line: MSD = 4Dt (2D) */}
        {msdData().length > 1 && (
          <line
            x1={40} y1={130}
            x2={390}
            y2={130 - ((4 * diffConst() * maxMsdTime()) / maxMsdVal()) * 100}
            stroke="#c084fc" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.7" />
        )}

        {/* Measured MSD points */}
        {msdData().map((p) => {
          const px = 40 + (p.t / maxMsdTime()) * 350;
          const py = 130 - (p.msd / maxMsdVal()) * 100;
          return <circle cx={px} cy={Math.max(py, 22)} r="2" fill="#7c3aed" opacity="0.6" />;
        })}

        {msdData().length > 1 && (
          <>
            <text x="370" y="36" text-anchor="end" font-size="7" fill="#c084fc">--- 4Dt theory</text>
            <text x="370" y="48" text-anchor="end" font-size="7" fill="#7c3aed">o measured</text>
          </>
        )}
      </svg>

      {/* Buttons */}
      <div class="flex justify-center gap-2">
        <button onClick={running() ? stopSim : startSim}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: running() ? "#ef4444" : "#7c3aed", color: "white" }}>
          {running() ? "Stop" : "Start"}
        </button>
        <button onClick={() => { stopSim(); resetState(); }} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>

      {/* Stats */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>D = kT/gamma</div>
          <div class="text-lg font-bold" style={{ color: "#7c3aed" }}>{diffConst().toFixed(3)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Steps</div>
          <div class="text-lg font-bold" style={{ color: "#c084fc" }}>{stepCount > 0 ? stepCount : trajectory().length - 1}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{"<r^2> current"}</div>
          <div class="text-lg font-bold" style={{ color: "#a78bfa" }}>
            {trajectory().length > 1 ? (() => {
              const last = trajectory()[trajectory().length - 1];
              return (last.x * last.x + last.y * last.y).toFixed(2);
            })() : "--"}
          </div>
        </div>
      </div>
    </div>
  );
};
