import { Component, createSignal, createMemo } from "solid-js";

export const S5Ising2D: Component = () => {
  const N = 20;
  const [temp, setTemp] = createSignal(2.27);
  const [grid, setGrid] = createSignal<number[]>(Array(N * N).fill(1));
  const [sweeps, setSweeps] = createSignal(0);
  const [running, setRunning] = createSignal(false);

  const magnetization = createMemo(() => {
    const g = grid();
    return g.reduce((s, v) => s + v, 0) / g.length;
  });

  const energy = createMemo(() => {
    const g = grid();
    let E = 0;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const s = g[i * N + j];
        const right = g[i * N + ((j + 1) % N)];
        const down = g[((i + 1) % N) * N + j];
        E -= s * right + s * down;
      }
    }
    return E / (N * N);
  });

  const metropolisSweep = (g: number[]) => {
    const T = temp();
    const newG = [...g];
    for (let s = 0; s < N * N; s++) {
      const i = Math.floor(Math.random() * N);
      const j = Math.floor(Math.random() * N);
      const idx = i * N + j;
      const spin = newG[idx];
      const neighbors = newG[i * N + ((j + 1) % N)] + newG[i * N + ((j - 1 + N) % N)]
        + newG[((i + 1) % N) * N + j] + newG[((i - 1 + N) % N) * N + j];
      const dE = 2 * spin * neighbors;
      if (dE <= 0 || Math.random() < Math.exp(-dE / T)) {
        newG[idx] = -spin;
      }
    }
    return newG;
  };

  const startSimulation = () => {
    setRunning(true);
    setSweeps(0);
    let g = [...grid()];
    let count = 0;
    const iv = setInterval(() => {
      g = metropolisSweep(g);
      count++;
      setGrid(g);
      setSweeps(count);
      if (count >= 500) { clearInterval(iv); setRunning(false); }
    }, 30);
  };

  const randomize = () => setGrid(Array.from({ length: N * N }, () => Math.random() < 0.5 ? 1 : -1));
  const cellSize = 280 / N;

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>T = {temp().toFixed(2)}</label>
        <input type="range" min="0.5" max="5" step="0.05" value={temp()} onInput={(e) => setTemp(parseFloat(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #ec4899 ${((temp() - 0.5) / 4.5) * 100}%, var(--border) ${((temp() - 0.5) / 4.5) * 100}%)` }} />
        <span class="text-[10px]" style={{ color: temp() > 2.1 && temp() < 2.5 ? "#f59e0b" : "var(--text-muted)" }}>
          {temp() > 2.1 && temp() < 2.5 ? "~Tc!" : ""}
        </span>
      </div>

      <div class="flex gap-4 justify-center">
        <svg width="280" height="280" viewBox={`0 0 ${N * cellSize} ${N * cellSize}`}>
          {grid().map((spin, idx) => {
            const i = Math.floor(idx / N), j = idx % N;
            return <rect x={j * cellSize} y={i * cellSize} width={cellSize} height={cellSize}
              fill={spin === 1 ? "#6366f1" : "#1e1b4b"} stroke="var(--bg-primary)" stroke-width="0.3" />;
          })}
        </svg>

        <div class="flex flex-col gap-3 justify-center">
          <div class="card p-3 text-center">
            <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Magnetization</div>
            <div class="text-lg font-bold" style={{ color: "#6366f1" }}>{magnetization().toFixed(3)}</div>
          </div>
          <div class="card p-3 text-center">
            <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Energy/site</div>
            <div class="text-lg font-bold" style={{ color: "#ec4899" }}>{energy().toFixed(3)}</div>
          </div>
          <div class="card p-3 text-center">
            <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Sweeps</div>
            <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>{sweeps()}</div>
          </div>
        </div>
      </div>

      <div class="flex justify-center gap-2">
        <button onClick={startSimulation} disabled={running()}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: running() ? "var(--bg-secondary)" : "#6366f1", color: running() ? "var(--text-muted)" : "white" }}>
          {running() ? "Running..." : "Run Metropolis"}
        </button>
        <button onClick={randomize} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#ec4899", color: "white" }}>Randomize</button>
        <button onClick={() => setGrid(Array(N * N).fill(1))} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>All Up</button>
      </div>
    </div>
  );
};

export const S5PhaseTransition: Component = () => {
  const [nSamples, setNSamples] = createSignal(0);
  const [magData, setMagData] = createSignal<{ T: number; m: number }[]>([]);

  const theoryCurve = createMemo(() => {
    const Tc = 2.269;
    const pts: { T: number; m: number }[] = [];
    for (let i = 1; i <= 100; i++) {
      const T = (i / 100) * 5;
      const m = T < Tc ? Math.pow(1 - Math.pow(T / Tc, 2), 0.125) : 0;
      pts.push({ T, m });
    }
    return pts;
  });

  const simulate = () => {
    const N = 12;
    const results: { T: number; m: number }[] = [];
    for (let ti = 1; ti <= 40; ti++) {
      const T = (ti / 40) * 5;
      let g = Array.from({ length: N * N }, () => 1);
      // Thermalize
      for (let sw = 0; sw < 100; sw++) {
        for (let s = 0; s < N * N; s++) {
          const i = Math.floor(Math.random() * N), j = Math.floor(Math.random() * N);
          const spin = g[i * N + j];
          const nb = g[i * N + ((j + 1) % N)] + g[i * N + ((j - 1 + N) % N)]
            + g[((i + 1) % N) * N + j] + g[((i - 1 + N) % N) * N + j];
          const dE = 2 * spin * nb;
          if (dE <= 0 || Math.random() < Math.exp(-dE / T)) g[i * N + j] = -spin;
        }
      }
      const mag = Math.abs(g.reduce((s, v) => s + v, 0) / (N * N));
      results.push({ T, m: mag });
    }
    setMagData(results);
    setNSamples(results.length);
  };

  return (
    <div class="space-y-5">
      <svg width="100%" height="250" viewBox="0 0 420 250" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Phase Transition: |M| vs Temperature</text>
        <line x1="50" y1="210" x2="390" y2="210" stroke="var(--border)" stroke-width="1" />
        <line x1="50" y1="210" x2="50" y2="25" stroke="var(--border)" stroke-width="1" />
        <text x="220" y="240" text-anchor="middle" font-size="9" fill="var(--text-muted)">Temperature T / J</text>
        <text x="15" y="120" text-anchor="middle" font-size="9" fill="var(--text-muted)" transform="rotate(-90 15 120)">|M|</text>

        {/* Tc marker */}
        <line x1={50 + (2.269 / 5) * 340} y1="25" x2={50 + (2.269 / 5) * 340} y2="210"
          stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 3" />
        <text x={50 + (2.269 / 5) * 340} y="22" text-anchor="middle" font-size="8" fill="#f59e0b">Tc=2.27</text>

        {/* Theory curve */}
        <path d={theoryCurve().map((p, i) => {
          const px = 50 + (p.T / 5) * 340;
          const py = 210 - p.m * 175;
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ")} fill="none" stroke="#14b8a6" stroke-width="2" />

        <path d={theoryCurve().map((p, i) => {
          const px = 50 + (p.T / 5) * 340;
          const py = 210 - p.m * 175;
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ") + " L390,210 L50,210 Z"} fill="#14b8a6" opacity="0.08" />

        {/* Simulation data */}
        {magData().map((d) => (
          <circle cx={50 + (d.T / 5) * 340} cy={210 - d.m * 175} r="3.5" fill="#ec4899" opacity="0.7" />
        ))}

        <text x="350" y="45" font-size="8" fill="#14b8a6">--- Theory</text>
        <text x="350" y="58" font-size="8" fill="#ec4899">o Simulation</text>
      </svg>

      <div class="flex justify-center gap-2">
        <button onClick={simulate} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#14b8a6", color: "white" }}>Run Simulation</button>
        <button onClick={() => { setMagData([]); setNSamples(0); }} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>

      <div class="grid grid-cols-2 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Data Points</div>
          <div class="text-lg font-bold" style={{ color: "#ec4899" }}>{nSamples()}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Critical Tc</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>2.269 J/kB</div>
        </div>
      </div>
    </div>
  );
};

export const S5Critical: Component = () => {
  const [temp, setTemp] = createSignal(2.27);
  const Tc = 2.269;

  const correlationLength = createMemo(() => {
    const t = Math.abs(temp() - Tc) / Tc;
    if (t < 0.005) return 100;
    return Math.min(1 / Math.pow(t, 1), 100);
  });

  const corrFunc = createMemo(() => {
    const xi = correlationLength();
    const pts: { r: number; c: number }[] = [];
    for (let i = 0; i <= 100; i++) {
      const r = (i / 100) * 20;
      const c = Math.exp(-r / xi) / Math.max(Math.sqrt(r), 0.5);
      pts.push({ r, c: Math.min(c, 1) });
    }
    return pts;
  });

  const maxCorr = createMemo(() => Math.max(...corrFunc().map((p) => p.c), 0.01));

  const tempPoints = createMemo(() => {
    const pts: { T: number; xi: number }[] = [];
    for (let i = 1; i <= 200; i++) {
      const T = 0.5 + (i / 200) * 4.5;
      const t = Math.abs(T - Tc) / Tc;
      const xi = t < 0.005 ? 100 : Math.min(1 / Math.pow(t, 1), 100);
      pts.push({ T, xi });
    }
    return pts;
  });

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>T = {temp().toFixed(2)}</label>
        <input type="range" min="0.5" max="5" step="0.01" value={temp()} onInput={(e) => setTemp(parseFloat(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #f59e0b ${((temp() - 0.5) / 4.5) * 100}%, var(--border) ${((temp() - 0.5) / 4.5) * 100}%)` }} />
      </div>

      <div class="grid grid-cols-2 gap-4">
        {/* Correlation length vs T */}
        <svg width="100%" height="200" viewBox="0 0 200 200">
          <text x="100" y="14" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)">xi(T) Divergence</text>
          <line x1="25" y1="175" x2="190" y2="175" stroke="var(--border)" stroke-width="1" />
          <line x1="25" y1="175" x2="25" y2="20" stroke="var(--border)" stroke-width="1" />

          <line x1={25 + ((Tc - 0.5) / 4.5) * 165} y1="20" x2={25 + ((Tc - 0.5) / 4.5) * 165} y2="175"
            stroke="#ef4444" stroke-width="1" stroke-dasharray="2 2" />
          <text x={25 + ((Tc - 0.5) / 4.5) * 165} y="185" text-anchor="middle" font-size="7" fill="#ef4444">Tc</text>

          <path d={tempPoints().map((p, i) => {
            const px = 25 + ((p.T - 0.5) / 4.5) * 165;
            const py = 175 - (Math.min(p.xi, 80) / 80) * 145;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")} fill="none" stroke="#f59e0b" stroke-width="2" />

          <circle cx={25 + ((temp() - 0.5) / 4.5) * 165}
            cy={175 - (Math.min(correlationLength(), 80) / 80) * 145}
            r="4" fill="#f59e0b" stroke="white" stroke-width="1.5" />
        </svg>

        {/* Correlation function */}
        <svg width="100%" height="200" viewBox="0 0 200 200">
          <text x="100" y="14" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)">C(r) Correlation</text>
          <line x1="25" y1="175" x2="190" y2="175" stroke="var(--border)" stroke-width="1" />
          <line x1="25" y1="175" x2="25" y2="20" stroke="var(--border)" stroke-width="1" />

          <path d={corrFunc().map((p, i) => {
            const px = 25 + (p.r / 20) * 165;
            const py = 175 - (p.c / maxCorr()) * 145;
            return `${i === 0 ? "M" : "L"}${px},${Math.max(py, 20)}`;
          }).join(" ") + " L190,175 L25,175 Z"} fill="#6366f1" opacity="0.1" />

          <path d={corrFunc().map((p, i) => {
            const px = 25 + (p.r / 20) * 165;
            const py = 175 - (p.c / maxCorr()) * 145;
            return `${i === 0 ? "M" : "L"}${px},${Math.max(py, 20)}`;
          }).join(" ")} fill="none" stroke="#6366f1" stroke-width="2" />

          <text x="120" y="190" text-anchor="middle" font-size="8" fill="var(--text-muted)">Distance r</text>
        </svg>
      </div>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>xi</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>{correlationLength() >= 100 ? "diverges" : correlationLength().toFixed(1)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>|T - Tc|/Tc</div>
          <div class="text-lg font-bold" style={{ color: "#6366f1" }}>{(Math.abs(temp() - Tc) / Tc).toFixed(4)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Phase</div>
          <div class="text-lg font-bold" style={{ color: temp() < Tc ? "#06b6d4" : "#ec4899" }}>
            {temp() < Tc ? "Ordered" : "Disordered"}
          </div>
        </div>
      </div>
    </div>
  );
};
