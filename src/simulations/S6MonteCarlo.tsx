import { Component, createSignal, createMemo } from "solid-js";

export const S6PiEstimation: Component = () => {
  const [points, setPoints] = createSignal<{ x: number; y: number; inside: boolean }[]>([]);
  const [running, setRunning] = createSignal(false);

  const insideCount = createMemo(() => points().filter((p) => p.inside).length);
  const piEstimate = createMemo(() => {
    const n = points().length;
    return n > 0 ? (4 * insideCount()) / n : 0;
  });

  const throwDarts = (n: number) => {
    const newPts = [...points()];
    for (let i = 0; i < n; i++) {
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1;
      newPts.push({ x, y, inside: x * x + y * y <= 1 });
    }
    setPoints(newPts);
  };

  const animateThrow = () => {
    setRunning(true);
    setPoints([]);
    let count = 0;
    const iv = setInterval(() => {
      throwDarts(20);
      count += 20;
      if (count >= 2000) { clearInterval(iv); setRunning(false); }
    }, 30);
  };

  const maxDisplay = 1500;
  const displayPts = createMemo(() => {
    const all = points();
    return all.length > maxDisplay ? all.slice(all.length - maxDisplay) : all;
  });

  return (
    <div class="space-y-5">
      <div class="flex gap-4 justify-center">
        <svg width="100%" viewBox="-1.1 -1.1 2.2 2.2" preserveAspectRatio="xMidYMid meet" style={{ "max-width": "270px", "aspect-ratio": "1 / 1" }}>
          {/* Square boundary */}
          <rect x="-1" y="-1" width="2" height="2" fill="none" stroke="var(--border)" stroke-width="0.01" />
          {/* Circle */}
          <circle cx="0" cy="0" r="1" fill="none" stroke="#6366f1" stroke-width="0.015" opacity="0.5" />

          {/* Points */}
          {displayPts().map((p) => (
            <circle cx={p.x} cy={p.y} r="0.015" fill={p.inside ? "#10b981" : "#ec4899"} opacity="0.5" />
          ))}
        </svg>

        <div class="flex flex-col gap-3 justify-center">
          <div class="card p-3 text-center">
            <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Pi Estimate</div>
            <div class="text-xl font-bold" style={{ color: "#6366f1" }}>{piEstimate().toFixed(5)}</div>
          </div>
          <div class="card p-3 text-center">
            <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Error</div>
            <div class="text-lg font-bold" style={{ color: Math.abs(piEstimate() - Math.PI) < 0.05 ? "#10b981" : "#f59e0b" }}>
              {points().length > 0 ? (piEstimate() - Math.PI).toFixed(5) : "--"}
            </div>
          </div>
          <div class="card p-3 text-center">
            <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Darts</div>
            <div class="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{points().length}</div>
          </div>
        </div>
      </div>

      <div class="flex justify-center gap-2">
        <button onClick={animateThrow} disabled={running()}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: running() ? "var(--bg-secondary)" : "#6366f1", color: running() ? "var(--text-muted)" : "white" }}>
          {running() ? "Throwing..." : "Animate Throw"}
        </button>
        <button onClick={() => throwDarts(100)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#10b981", color: "white" }}>+100 Darts</button>
        <button onClick={() => throwDarts(1000)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#059669", color: "white" }}>+1000</button>
        <button onClick={() => setPoints([])} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>
    </div>
  );
};

export const S6Integration: Component = () => {
  const [nSamples, setNSamples] = createSignal(0);
  const [samplePts, setSamplePts] = createSignal<{ x: number; y: number; under: boolean }[]>([]);

  const f = (x: number) => Math.sin(x) * Math.sin(x) + 0.3;
  const xMin = 0, xMax = Math.PI, yMax = 1.35;
  const trueIntegral = Math.PI / 2 + 0.3 * Math.PI; // integral of sin^2(x) + 0.3 from 0 to pi

  const estimate = createMemo(() => {
    const pts = samplePts();
    if (pts.length === 0) return 0;
    const underCount = pts.filter((p) => p.under).length;
    return (underCount / pts.length) * (xMax - xMin) * yMax;
  });

  const addSamples = (n: number) => {
    const newPts = [...samplePts()];
    for (let i = 0; i < n; i++) {
      const x = xMin + Math.random() * (xMax - xMin);
      const y = Math.random() * yMax;
      newPts.push({ x, y, under: y <= f(x) });
    }
    setSamplePts(newPts);
    setNSamples(newPts.length);
  };

  const curvePts = createMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = xMin + (i / 100) * (xMax - xMin);
      pts.push({ x, y: f(x) });
    }
    return pts;
  });

  const displayPts = createMemo(() => {
    const all = samplePts();
    return all.length > 1000 ? all.slice(all.length - 1000) : all;
  });

  return (
    <div class="space-y-5">
      <svg width="100%" height="240" viewBox="0 0 420 240" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Monte Carlo Integration: integral of sin^2(x) + 0.3</text>
        <line x1="40" y1="210" x2="390" y2="210" stroke="var(--border)" stroke-width="1" />
        <line x1="40" y1="210" x2="40" y2="25" stroke="var(--border)" stroke-width="1" />

        {/* Bounding box */}
        <rect x="40" y={210 - (yMax / yMax) * 175} width="350" height={(yMax / yMax) * 175}
          fill="none" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />

        {/* Function curve */}
        <path d={curvePts().map((p, i) => {
          const px = 40 + ((p.x - xMin) / (xMax - xMin)) * 350;
          const py = 210 - (p.y / yMax) * 175;
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ")} fill="none" stroke="#f59e0b" stroke-width="2.5" />

        {/* Fill under curve */}
        <path d={curvePts().map((p, i) => {
          const px = 40 + ((p.x - xMin) / (xMax - xMin)) * 350;
          const py = 210 - (p.y / yMax) * 175;
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ") + " L390,210 L40,210 Z"} fill="#f59e0b" opacity="0.06" />

        {/* Sample points */}
        {displayPts().map((p) => {
          const px = 40 + ((p.x - xMin) / (xMax - xMin)) * 350;
          const py = 210 - (p.y / yMax) * 175;
          return <circle cx={px} cy={py} r="2" fill={p.under ? "#10b981" : "#ec4899"} opacity="0.4" />;
        })}

        <text x="380" y="38" text-anchor="end" font-size="8" fill="#10b981">Under curve</text>
        <text x="380" y="50" text-anchor="end" font-size="8" fill="#ec4899">Above curve</text>
      </svg>

      <div class="flex justify-center gap-2">
        <button onClick={() => addSamples(100)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#f59e0b", color: "white" }}>+100</button>
        <button onClick={() => addSamples(1000)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#d97706", color: "white" }}>+1000</button>
        <button onClick={() => addSamples(5000)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#92400e", color: "white" }}>+5000</button>
        <button onClick={() => { setSamplePts([]); setNSamples(0); }} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Estimate</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>{estimate().toFixed(4)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>True Value</div>
          <div class="text-lg font-bold" style={{ color: "#10b981" }}>{trueIntegral.toFixed(4)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Samples</div>
          <div class="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{nSamples()}</div>
        </div>
      </div>
    </div>
  );
};

export const S6MCMC: Component = () => {
  const [samples, setSamples] = createSignal<number[]>([]);
  const [sigma, setSigma] = createSignal(1.0);
  const [running, setRunning] = createSignal(false);

  // Target: bimodal distribution (mixture of two Gaussians)
  const target = (x: number) =>
    0.4 * Math.exp(-((x + 2) ** 2) / 2) + 0.6 * Math.exp(-((x - 2) ** 2) / (2 * 0.5));

  const targetCurve = createMemo(() => {
    const pts: { x: number; val: number }[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = (i / 200) * 12 - 6;
      pts.push({ x, val: target(x) });
    }
    return pts;
  });

  const maxTarget = createMemo(() => Math.max(...targetCurve().map((p) => p.val), 0.01));

  const runMCMC = () => {
    setRunning(true);
    setSamples([]);
    let x = 0;
    let samps: number[] = [];
    let step = 0;
    const iv = setInterval(() => {
      for (let i = 0; i < 50; i++) {
        const xProp = x + (Math.random() * 2 - 1) * sigma() * 2;
        const alpha = target(xProp) / target(x);
        if (Math.random() < alpha) x = xProp;
        samps.push(x);
      }
      step += 50;
      setSamples([...samps]);
      if (step >= 5000) { clearInterval(iv); setRunning(false); }
    }, 30);
  };

  // Histogram of samples
  const histogram = createMemo(() => {
    const s = samples();
    if (s.length === 0) return [];
    const nBins = 40;
    const bins = Array(nBins).fill(0);
    for (const v of s) {
      const idx = Math.min(Math.max(Math.floor(((v + 6) / 12) * nBins), 0), nBins - 1);
      bins[idx]++;
    }
    const binWidth = 12 / nBins;
    return bins.map((count, i) => ({
      x: -6 + (i + 0.5) * binWidth,
      density: count / (s.length * binWidth),
    }));
  });

  const maxHist = createMemo(() => Math.max(...histogram().map((b) => b.density), 0.01));
  const plotMax = createMemo(() => Math.max(maxTarget(), maxHist()));

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "70px" }}>Step size = {sigma().toFixed(1)}</label>
        <input type="range" min="0.1" max="4" step="0.1" value={sigma()} onInput={(e) => setSigma(parseFloat(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #6366f1 ${((sigma() - 0.1) / 3.9) * 100}%, var(--border) ${((sigma() - 0.1) / 3.9) * 100}%)` }} />
      </div>

      <svg width="100%" height="230" viewBox="0 0 420 230" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">MCMC: Metropolis-Hastings Sampling</text>
        <line x1="40" y1="200" x2="400" y2="200" stroke="var(--border)" stroke-width="1" />
        <line x1="40" y1="200" x2="40" y2="25" stroke="var(--border)" stroke-width="1" />
        <text x="220" y="220" text-anchor="middle" font-size="9" fill="var(--text-muted)">x</text>

        {/* Histogram bars */}
        {histogram().map((b) => {
          const px = 40 + ((b.x + 6) / 12) * 360;
          const bw = (12 / 40 / 12) * 360;
          const h = (b.density / plotMax()) * 165;
          return <rect x={px - bw / 2} y={200 - h} width={bw} height={h} fill="#6366f1" opacity="0.25" rx="1" />;
        })}

        {/* Target distribution */}
        <path d={targetCurve().map((p, i) => {
          const px = 40 + ((p.x + 6) / 12) * 360;
          const py = 200 - (p.val / plotMax()) * 165;
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ")} fill="none" stroke="#ec4899" stroke-width="2.5" />

        <text x="370" y="40" text-anchor="end" font-size="8" fill="#ec4899">Target p(x)</text>
        <text x="370" y="53" text-anchor="end" font-size="8" fill="#6366f1">MCMC samples</text>
      </svg>

      <div class="flex justify-center gap-2">
        <button onClick={runMCMC} disabled={running()}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: running() ? "var(--bg-secondary)" : "#6366f1", color: running() ? "var(--text-muted)" : "white" }}>
          {running() ? "Sampling..." : "Run MCMC"}
        </button>
        <button onClick={() => setSamples([])} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Samples</div>
          <div class="text-lg font-bold" style={{ color: "#6366f1" }}>{samples().length}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Step Size</div>
          <div class="text-lg font-bold" style={{ color: "#ec4899" }}>{sigma().toFixed(1)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Target</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>Bimodal</div>
        </div>
      </div>
    </div>
  );
};
