import { Component, createSignal, createMemo, For } from "solid-js";

export const S4Walk1D: Component = () => {
  const [nWalkers, setNWalkers] = createSignal(5);
  const [steps, setSteps] = createSignal(0);
  const [walkers, setWalkers] = createSignal<number[][]>([]);

  const startWalks = () => {
    const nw = nWalkers();
    const paths: number[][] = Array.from({ length: nw }, () => [0]);
    setWalkers(paths);
    setSteps(0);
    let step = 0;
    const iv = setInterval(() => {
      step++;
      for (const path of paths) {
        path.push(path[path.length - 1] + (Math.random() < 0.5 ? 1 : -1));
      }
      setWalkers([...paths]);
      setSteps(step);
      if (step >= 150) clearInterval(iv);
    }, 40);
  };

  const colors = ["#06b6d4", "#ec4899", "#f59e0b", "#14b8a6", "#6366f1", "#10b981", "#ef4444", "#8b5cf6"];
  const maxSteps = createMemo(() => Math.max(steps(), 1));
  const yRange = createMemo(() => {
    let minY = 0, maxY = 0;
    for (const w of walkers()) { for (const v of w) { if (v < minY) minY = v; if (v > maxY) maxY = v; } }
    return Math.max(Math.abs(minY), Math.abs(maxY), 5);
  });

  const rmsDisplacement = createMemo(() => {
    const ws = walkers();
    if (ws.length === 0) return 0;
    const finals = ws.map((w) => w[w.length - 1]);
    return Math.sqrt(finals.reduce((s, v) => s + v * v, 0) / finals.length);
  });

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "70px" }}>Walkers: {nWalkers()}</label>
        <input type="range" min="1" max="8" step="1" value={nWalkers()} onInput={(e) => setNWalkers(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #06b6d4 ${((nWalkers() - 1) / 7) * 100}%, var(--border) ${((nWalkers() - 1) / 7) * 100}%)` }} />
      </div>

      <svg width="100%" height="220" viewBox="0 0 420 220" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">1D Random Walk</text>
        <line x1="40" y1="110" x2="400" y2="110" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
        <line x1="40" y1="200" x2="400" y2="200" stroke="var(--border)" stroke-width="1" />
        <line x1="40" y1="20" x2="40" y2="200" stroke="var(--border)" stroke-width="1" />
        <text x="220" y="215" text-anchor="middle" font-size="9" fill="var(--text-muted)">Step N</text>

        {/* sqrt(N) envelope */}
        {steps() > 5 && (
          <>
            <path d={Array.from({ length: Math.min(steps(), 150) }, (_, i) => {
              const px = 40 + (i / 150) * 360;
              const py = 110 - (Math.sqrt(i) / yRange()) * 85;
              return `${i === 0 ? "M" : "L"}${px},${py}`;
            }).join(" ")} fill="none" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4 3" opacity="0.5" />
            <path d={Array.from({ length: Math.min(steps(), 150) }, (_, i) => {
              const px = 40 + (i / 150) * 360;
              const py = 110 + (Math.sqrt(i) / yRange()) * 85;
              return `${i === 0 ? "M" : "L"}${px},${py}`;
            }).join(" ")} fill="none" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4 3" opacity="0.5" />
          </>
        )}

        {/* Walker paths */}
        {walkers().map((path, wi) => (
          <path d={path.map((pos, i) => {
            const px = 40 + (i / 150) * 360;
            const py = 110 - (pos / yRange()) * 85;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")} fill="none" stroke={colors[wi % colors.length]} stroke-width="1.5" opacity="0.7" />
        ))}
      </svg>

      <div class="flex justify-center gap-2">
        <button onClick={startWalks} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#06b6d4", color: "white" }}>Start Walks</button>
        <button onClick={() => { setWalkers([]); setSteps(0); }} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Steps</div>
          <div class="text-lg font-bold" style={{ color: "#06b6d4" }}>{steps()}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>RMS Disp.</div>
          <div class="text-lg font-bold" style={{ color: "#ec4899" }}>{rmsDisplacement().toFixed(1)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>sqrt(N)</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>{Math.sqrt(steps()).toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
};

export const S4Walk2D: Component = () => {
  const [nWalkers, setNWalkers] = createSignal(10);
  const [positions, setPositions] = createSignal<{ x: number; y: number }[]>([]);
  const [step, setStep] = createSignal(0);

  const startWalk = () => {
    const init = Array.from({ length: nWalkers() }, () => ({ x: 0, y: 0 }));
    setPositions(init);
    setStep(0);
    let s = 0;
    const iv = setInterval(() => {
      s++;
      setPositions((prev) => prev.map((p) => {
        const dir = Math.floor(Math.random() * 4);
        return {
          x: p.x + (dir === 0 ? 1 : dir === 1 ? -1 : 0),
          y: p.y + (dir === 2 ? 1 : dir === 3 ? -1 : 0),
        };
      }));
      setStep(s);
      if (s >= 300) clearInterval(iv);
    }, 30);
  };

  const scale = createMemo(() => {
    const ps = positions();
    if (ps.length === 0) return 1;
    let maxR = 5;
    for (const p of ps) { const r = Math.sqrt(p.x * p.x + p.y * p.y); if (r > maxR) maxR = r; }
    return maxR * 1.3;
  });

  const colors = ["#06b6d4", "#ec4899", "#f59e0b", "#14b8a6", "#6366f1", "#10b981", "#ef4444", "#8b5cf6", "#a855f7", "#f43f5e"];

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "70px" }}>Walkers: {nWalkers()}</label>
        <input type="range" min="1" max="30" step="1" value={nWalkers()} onInput={(e) => setNWalkers(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #ec4899 ${((nWalkers() - 1) / 29) * 100}%, var(--border) ${((nWalkers() - 1) / 29) * 100}%)` }} />
      </div>

      <svg width="100%" height="280" viewBox="0 0 420 280" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">2D Random Walk</text>

        {/* Grid */}
        <line x1="30" y1="150" x2="400" y2="150" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="2 4" />
        <line x1="215" y1="20" x2="215" y2="270" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="2 4" />

        {/* sqrt(N) circle */}
        {step() > 0 && (
          <circle cx="215" cy="150" r={Math.sqrt(step()) / scale() * 180} fill="none" stroke="#f59e0b"
            stroke-width="1" stroke-dasharray="4 3" opacity="0.4" />
        )}

        {/* Walker dots */}
        {positions().map((p, i) => (
          <circle cx={215 + (p.x / scale()) * 180} cy={150 - (p.y / scale()) * 120}
            r="4" fill={colors[i % colors.length]} opacity="0.75" />
        ))}

        {/* Origin */}
        <circle cx="215" cy="150" r="3" fill="var(--text-primary)" opacity="0.3" />
      </svg>

      <div class="flex justify-center gap-2">
        <button onClick={startWalk} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#ec4899", color: "white" }}>Start Walks</button>
        <button onClick={() => { setPositions([]); setStep(0); }} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>

      <div class="grid grid-cols-2 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Steps</div>
          <div class="text-lg font-bold" style={{ color: "#ec4899" }}>{step()}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Expected r ~ sqrt(N)</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>{Math.sqrt(step()).toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
};

export const S4Diffusion: Component = () => {
  const [diffCoeff, setDiffCoeff] = createSignal(1.0);
  const [time, setTime] = createSignal(0.1);
  const [running, setRunning] = createSignal(false);

  const concentrationPts = createMemo(() => {
    const D = diffCoeff(), t = time();
    const pts: { x: number; c: number }[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = (i / 200) * 10 - 5;
      const c = (1 / Math.sqrt(4 * Math.PI * D * t)) * Math.exp(-x * x / (4 * D * t));
      pts.push({ x, c });
    }
    return pts;
  });

  const maxC = createMemo(() => Math.max(...concentrationPts().map((p) => p.c), 0.01));

  const evolve = () => {
    setRunning(true);
    setTime(0.1);
    let t = 0.1;
    const iv = setInterval(() => {
      t += 0.05;
      setTime(t);
      if (t >= 5) { clearInterval(iv); setRunning(false); }
    }, 50);
  };

  const spread = () => Math.sqrt(2 * diffCoeff() * time());

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "50px" }}>D = {diffCoeff().toFixed(1)}</label>
          <input type="range" min="0.1" max="3" step="0.1" value={diffCoeff()} onInput={(e) => setDiffCoeff(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #10b981 ${((diffCoeff() - 0.1) / 2.9) * 100}%, var(--border) ${((diffCoeff() - 0.1) / 2.9) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "50px" }}>t = {time().toFixed(2)}</label>
          <input type="range" min="0.05" max="5" step="0.05" value={time()} onInput={(e) => setTime(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #6366f1 ${((time() - 0.05) / 4.95) * 100}%, var(--border) ${((time() - 0.05) / 4.95) * 100}%)` }} />
        </div>
      </div>

      <svg width="100%" height="220" viewBox="0 0 420 220" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Diffusion: Concentration Spreading</text>
        <line x1="40" y1="190" x2="400" y2="190" stroke="var(--border)" stroke-width="1" />
        <line x1="220" y1="25" x2="220" y2="190" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="2 4" />
        <text x="220" y="208" text-anchor="middle" font-size="9" fill="var(--text-muted)">Position x</text>

        {/* Concentration profile fill */}
        <path d={concentrationPts().map((p, i) => {
          const px = 40 + ((p.x + 5) / 10) * 360;
          const py = 190 - (p.c / maxC()) * 150;
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ") + " L400,190 L40,190 Z"} fill="#10b981" opacity="0.12" />

        {/* Concentration curve */}
        <path d={concentrationPts().map((p, i) => {
          const px = 40 + ((p.x + 5) / 10) * 360;
          const py = 190 - (p.c / maxC()) * 150;
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ")} fill="none" stroke="#10b981" stroke-width="2.5" />

        {/* Spread indicators */}
        <line x1={220 - (spread() / 5) * 180} y1="195" x2={220 + (spread() / 5) * 180} y2="195" stroke="#6366f1" stroke-width="2" />
        <text x="220" y="207" text-anchor="middle" font-size="8" fill="#6366f1">sigma = {spread().toFixed(2)}</text>
      </svg>

      <div class="flex justify-center gap-2">
        <button onClick={evolve} disabled={running()}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: running() ? "var(--bg-secondary)" : "#10b981", color: running() ? "var(--text-muted)" : "white" }}>
          {running() ? "Evolving..." : "Animate Diffusion"}
        </button>
        <button onClick={() => setTime(0.1)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Spread sigma</div>
          <div class="text-lg font-bold" style={{ color: "#10b981" }}>{spread().toFixed(2)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Peak C</div>
          <div class="text-lg font-bold" style={{ color: "#6366f1" }}>{maxC().toFixed(3)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>D * t</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>{(diffCoeff() * time()).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};
