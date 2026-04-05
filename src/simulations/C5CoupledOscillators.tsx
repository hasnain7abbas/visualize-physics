import { Component, createSignal, createMemo, onCleanup, For } from "solid-js";

// ─── Helper: Normal mode frequency ──────────────────────────────────────────
// omega_n = 2 * sqrt(k/m) * sin(n * pi / (2*(N+1)))
const modeFreq = (n: number, N: number, km: number = 1) =>
  2 * Math.sqrt(km) * Math.sin((n * Math.PI) / (2 * (N + 1)));

// ─── Helper: Zigzag spring path between two points ─────────────────────────
const springPath = (x1: number, y1: number, x2: number, y2: number, coils: number = 6): string => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return `M${x1},${y1}L${x2},${y2}`;
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const amp = 5;
  const margin = 8;
  const springLen = len - 2 * margin;
  let d = `M${x1},${y1} L${x1 + ux * margin},${y1 + uy * margin}`;
  for (let i = 0; i <= coils * 2; i++) {
    const t = margin + (i / (coils * 2)) * springLen;
    const side = i % 2 === 0 ? 1 : -1;
    const px = x1 + ux * t + nx * amp * side * (i > 0 && i < coils * 2 ? 1 : 0);
    const py = y1 + uy * t + ny * amp * side * (i > 0 && i < coils * 2 ? 1 : 0);
    d += ` L${px.toFixed(1)},${py.toFixed(1)}`;
  }
  d += ` L${x2},${y2}`;
  return d;
};

// ─── C5NormalModes ──────────────────────────────────────────────────────────
// N masses on springs showing individual normal modes with animation
export const C5NormalModes: Component = () => {
  const [N, setN] = createSignal(5);
  const [mode, setMode] = createSignal(1);
  const [playing, setPlaying] = createSignal(true);
  const [time, setTime] = createSignal(0);

  const omega = createMemo(() => modeFreq(mode(), N()));
  const amplitude = 30;

  let animFrame: number | undefined;
  let lastTs: number | undefined;

  const step = (ts: number) => {
    if (lastTs === undefined) lastTs = ts;
    if (playing()) {
      const dt = (ts - lastTs) / 1000;
      setTime((t) => t + dt * 3);
    }
    lastTs = ts;
    animFrame = requestAnimationFrame(step);
  };
  animFrame = requestAnimationFrame(step);
  onCleanup(() => animFrame !== undefined && cancelAnimationFrame(animFrame));

  const reset = () => { setTime(0); lastTs = undefined; };

  // Clamp mode when N changes
  const handleNChange = (v: number) => {
    setN(v);
    if (mode() > v) setMode(v);
  };

  const massPositions = createMemo(() => {
    const n = N();
    const m = mode();
    const t = time();
    const w = omega();
    const spacing = 360 / (n + 1);
    const cy = 100;
    const positions: { x: number; y: number; disp: number }[] = [];
    for (let j = 1; j <= n; j++) {
      const eq = 30 + j * spacing;
      const shape = Math.sin((m * Math.PI * j) / (n + 1));
      const disp = amplitude * shape * Math.cos(w * t);
      positions.push({ x: eq, y: cy + disp, disp });
    }
    return positions;
  });

  return (
    <div class="space-y-5">
      {/* N slider */}
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "70px" }}>Masses N = {N()}</label>
        <input type="range" min="2" max="10" step="1" value={N()} onInput={(e) => handleNChange(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #14B8A6 ${((N() - 2) / 8) * 100}%, var(--border) ${((N() - 2) / 8) * 100}%)` }} />
      </div>

      {/* Mode selector buttons */}
      <div class="flex items-center gap-2 flex-wrap">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Mode:</label>
        <For each={Array.from({ length: N() }, (_, i) => i + 1)}>
          {(n) => (
            <button onClick={() => setMode(n)}
              class="px-3 py-1.5 rounded-lg text-xs font-medium hover:scale-105 transition-all"
              style={{ background: mode() === n ? "#14B8A6" : "var(--bg-secondary)", color: mode() === n ? "white" : "var(--text-secondary)" }}>
              {n}
            </button>
          )}
        </For>
      </div>

      {/* SVG visualization */}
      <svg width="100%" height="200" viewBox="0 0 420 200" class="mx-auto">
        {/* Walls */}
        <rect x="20" y="60" width="6" height="80" rx="2" fill="var(--text-muted)" opacity="0.5" />
        <rect x="394" y="60" width="6" height="80" rx="2" fill="var(--text-muted)" opacity="0.5" />

        {/* Springs and masses */}
        {(() => {
          const pos = massPositions();
          const elements: any[] = [];
          const wallL = 26;
          const wallR = 394;
          const cy = 100;

          // Spring from left wall to first mass
          if (pos.length > 0) {
            elements.push(<path d={springPath(wallL, cy, pos[0].x, pos[0].y, 5)} fill="none" stroke="var(--text-muted)" stroke-width="1.5" />);
          }
          // Springs between masses
          for (let i = 0; i < pos.length - 1; i++) {
            elements.push(<path d={springPath(pos[i].x, pos[i].y, pos[i + 1].x, pos[i + 1].y, 5)} fill="none" stroke="var(--text-muted)" stroke-width="1.5" />);
          }
          // Spring from last mass to right wall
          if (pos.length > 0) {
            elements.push(<path d={springPath(pos[pos.length - 1].x, pos[pos.length - 1].y, wallR, cy, 5)} fill="none" stroke="var(--text-muted)" stroke-width="1.5" />);
          }

          // Masses with color by displacement
          for (let i = 0; i < pos.length; i++) {
            const d = pos[i].disp / amplitude;
            const r = Math.round(128 + 127 * Math.max(0, d));
            const b = Math.round(128 + 127 * Math.max(0, -d));
            const g = Math.round(128 - 60 * Math.abs(d));
            elements.push(
              <circle cx={pos[i].x} cy={pos[i].y} r="10"
                fill={`rgb(${r},${g},${b})`} stroke="var(--text-primary)" stroke-width="1.5" />
            );
            elements.push(
              <text x={pos[i].x} y={pos[i].y + 3.5} text-anchor="middle" font-size="8" font-weight="600" fill="white">{i + 1}</text>
            );
          }

          // Equilibrium line
          elements.push(<line x1="30" y1={cy} x2="390" y2={cy} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="4 3" />);

          return elements;
        })()}
      </svg>

      {/* Controls */}
      <div class="flex items-center gap-3">
        <button onClick={() => setPlaying(!playing())}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#14B8A6", color: "white" }}>
          {playing() ? "Pause" : "Play"}
        </button>
        <button onClick={() => { reset(); setPlaying(false); }}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Reset
        </button>
      </div>

      {/* Stats */}
      <div class="grid grid-cols-3 gap-3">
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Mode</div>
          <div class="text-lg font-bold" style={{ color: "#14B8A6" }}>n = {mode()}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Frequency</div>
          <div class="text-lg font-bold" style={{ color: "#14B8A6" }}>{omega().toFixed(3)}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Masses</div>
          <div class="text-lg font-bold" style={{ color: "#14B8A6" }}>N = {N()}</div>
        </div>
      </div>
    </div>
  );
};

// ─── C5ModeSuperposition ────────────────────────────────────────────────────
// Superposition of normal modes for N=5 with amplitude sliders
export const C5ModeSuperposition: Component = () => {
  const N = 5;
  const [amplitudes, setAmplitudes] = createSignal([0.5, 0, 0, 0, 0]);
  const [playing, setPlaying] = createSignal(true);
  const [time, setTime] = createSignal(0);

  const setAmp = (idx: number, val: number) => {
    setAmplitudes((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const freqs = createMemo(() =>
    Array.from({ length: N }, (_, i) => modeFreq(i + 1, N))
  );

  let animFrame: number | undefined;
  let lastTs: number | undefined;

  const step = (ts: number) => {
    if (lastTs === undefined) lastTs = ts;
    if (playing()) {
      const dt = (ts - lastTs) / 1000;
      setTime((t) => t + dt * 3);
    }
    lastTs = ts;
    animFrame = requestAnimationFrame(step);
  };
  animFrame = requestAnimationFrame(step);
  onCleanup(() => animFrame !== undefined && cancelAnimationFrame(animFrame));

  const reset = () => { setTime(0); lastTs = undefined; };

  // Preset: displace mass j => decompose into normal modes
  // delta_j displacement => A_n = (2/(N+1)) * sin(n*pi*j/(N+1))
  const presetDisplace = (j: number) => {
    const amps: number[] = [];
    for (let n = 1; n <= N; n++) {
      amps.push((2 / (N + 1)) * Math.sin((n * Math.PI * j) / (N + 1)));
    }
    // Normalize so max amplitude = 1
    const maxA = Math.max(...amps.map(Math.abs));
    setAmplitudes(amps.map((a) => Math.abs(a / maxA)));
    reset();
    setPlaying(true);
  };

  const massPositions = createMemo(() => {
    const t = time();
    const amps = amplitudes();
    const ws = freqs();
    const spacing = 360 / (N + 1);
    const cy = 100;
    const maxDisp = 30;
    const positions: { x: number; y: number; disp: number }[] = [];
    for (let j = 1; j <= N; j++) {
      let disp = 0;
      for (let n = 0; n < N; n++) {
        disp += amps[n] * Math.sin(((n + 1) * Math.PI * j) / (N + 1)) * Math.cos(ws[n] * t);
      }
      const eq = 30 + j * spacing;
      const clamp = Math.max(-1, Math.min(1, disp / 1.5));
      positions.push({ x: eq, y: cy + clamp * maxDisp, disp: clamp });
    }
    return positions;
  });

  return (
    <div class="space-y-5">
      {/* Amplitude sliders */}
      <div class="space-y-2">
        <For each={amplitudes()}>
          {(amp, idx) => (
            <div class="flex items-center gap-3">
              <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>
                A{idx() + 1} = {amp.toFixed(2)}
              </label>
              <input type="range" min="0" max="1" step="0.01" value={amp}
                onInput={(e) => setAmp(idx(), parseFloat(e.currentTarget.value))}
                class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #14B8A6 ${amp * 100}%, var(--border) ${amp * 100}%)` }} />
              <div class="w-3 h-3 rounded-full" style={{ background: amp > 0.01 ? "#14B8A6" : "var(--border)", opacity: amp > 0.01 ? 1 : 0.3 }} />
            </div>
          )}
        </For>
      </div>

      {/* Preset buttons */}
      <div class="flex items-center gap-3 flex-wrap">
        <button onClick={() => presetDisplace(1)}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#14B8A6", color: "white" }}>
          Displace mass 1
        </button>
        <button onClick={() => presetDisplace(3)}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#14B8A6", color: "white" }}>
          Displace mass 3
        </button>
        <button onClick={() => { setAmplitudes([0, 0, 0, 0, 0]); reset(); }}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Clear all
        </button>
        <button onClick={() => setPlaying(!playing())}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#14B8A6", color: "white" }}>
          {playing() ? "Pause" : "Play"}
        </button>
      </div>

      {/* SVG spring-mass visualization */}
      <svg width="100%" height="200" viewBox="0 0 420 200" class="mx-auto">
        <rect x="20" y="60" width="6" height="80" rx="2" fill="var(--text-muted)" opacity="0.5" />
        <rect x="394" y="60" width="6" height="80" rx="2" fill="var(--text-muted)" opacity="0.5" />

        {(() => {
          const pos = massPositions();
          const elements: any[] = [];
          const wallL = 26;
          const wallR = 394;
          const cy = 100;

          elements.push(<line x1="30" y1={cy} x2="390" y2={cy} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="4 3" />);

          if (pos.length > 0) {
            elements.push(<path d={springPath(wallL, cy, pos[0].x, pos[0].y, 5)} fill="none" stroke="var(--text-muted)" stroke-width="1.5" />);
          }
          for (let i = 0; i < pos.length - 1; i++) {
            elements.push(<path d={springPath(pos[i].x, pos[i].y, pos[i + 1].x, pos[i + 1].y, 5)} fill="none" stroke="var(--text-muted)" stroke-width="1.5" />);
          }
          if (pos.length > 0) {
            elements.push(<path d={springPath(pos[pos.length - 1].x, pos[pos.length - 1].y, wallR, cy, 5)} fill="none" stroke="var(--text-muted)" stroke-width="1.5" />);
          }

          for (let i = 0; i < pos.length; i++) {
            const d = pos[i].disp;
            const r = Math.round(128 + 127 * Math.max(0, d));
            const b = Math.round(128 + 127 * Math.max(0, -d));
            const g = Math.round(128 - 60 * Math.abs(d));
            elements.push(
              <circle cx={pos[i].x} cy={pos[i].y} r="10"
                fill={`rgb(${r},${g},${b})`} stroke="var(--text-primary)" stroke-width="1.5" />
            );
            elements.push(
              <text x={pos[i].x} y={pos[i].y + 3.5} text-anchor="middle" font-size="8" font-weight="600" fill="white">{i + 1}</text>
            );
          }
          return elements;
        })()}
      </svg>

      {/* Frequency bar chart (FFT-like) */}
      <div>
        <label class="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Mode amplitudes</label>
        <svg width="100%" height="80" viewBox="0 0 420 80" class="mx-auto">
          <For each={amplitudes()}>
            {(amp, idx) => {
              const barW = 50;
              const gap = (420 - N * barW) / (N + 1);
              const x = gap + idx() * (barW + gap);
              const barH = amp * 55;
              return (
                <>
                  <rect x={x} y={65 - barH} width={barW} height={barH} rx="3"
                    fill="#14B8A6" opacity={amp > 0.01 ? 0.8 : 0.15} />
                  <text x={x + barW / 2} y={75} text-anchor="middle" font-size="8" fill="var(--text-muted)">
                    n={idx() + 1}
                  </text>
                  <text x={x + barW / 2} y={60 - barH} text-anchor="middle" font-size="7" fill="#14B8A6">
                    {amp > 0.01 ? amp.toFixed(2) : ""}
                  </text>
                </>
              );
            }}
          </For>
          <line x1="10" y1="65" x2="410" y2="65" stroke="var(--border)" stroke-width="0.5" />
        </svg>
      </div>

      {/* Stats */}
      <div class="grid grid-cols-3 gap-3">
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Masses</div>
          <div class="text-lg font-bold" style={{ color: "#14B8A6" }}>N = {N}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Active modes</div>
          <div class="text-lg font-bold" style={{ color: "#14B8A6" }}>{amplitudes().filter((a) => a > 0.01).length}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Max freq</div>
          <div class="text-lg font-bold" style={{ color: "#14B8A6" }}>{freqs()[N - 1].toFixed(3)}</div>
        </div>
      </div>
    </div>
  );
};

// ─── C5DispersionRelation ───────────────────────────────────────────────────
// Dispersion relation omega(k) as N increases, showing convergence to continuous limit
export const C5DispersionRelation: Component = () => {
  const [N, setN] = createSignal(8);

  // lattice spacing a = 1 for simplicity, k/m = 1
  const km = 1;
  const omegaMax = 2 * Math.sqrt(km); // cutoff frequency

  // Discrete mode points: k_n = n*pi/(N+1), omega_n = 2*sqrt(k/m)*sin(k_n/2)
  const modePoints = createMemo(() => {
    const n = N();
    const pts: { k: number; omega: number }[] = [];
    for (let i = 1; i <= n; i++) {
      const kn = (i * Math.PI) / (n + 1); // wavevector for mode i
      const wn = modeFreq(i, n, km);
      pts.push({ k: kn, omega: wn });
    }
    return pts;
  });

  // Continuous dispersion curve: omega = 2*sqrt(k/m)*|sin(k*a/2)|, k from 0 to pi
  const continuousCurve = createMemo(() => {
    const pts: { k: number; omega: number }[] = [];
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const k = (i / steps) * Math.PI;
      const w = 2 * Math.sqrt(km) * Math.abs(Math.sin(k / 2));
      pts.push({ k, omega: w });
    }
    return pts;
  });

  // Speed of sound: v_s = d omega/dk at k=0 = sqrt(k/m) * a
  const speedOfSound = createMemo(() => Math.sqrt(km)); // a=1

  // Plot coordinates
  const plotLeft = 50;
  const plotRight = 400;
  const plotTop = 25;
  const plotBottom = 220;
  const plotW = plotRight - plotLeft;
  const plotH = plotBottom - plotTop;

  const toPlotX = (k: number) => plotLeft + (k / Math.PI) * plotW;
  const toPlotY = (w: number) => plotBottom - (w / (omegaMax * 1.1)) * plotH;

  // Continuous curve path
  const curvePath = createMemo(() =>
    continuousCurve().map((p, i) =>
      `${i === 0 ? "M" : "L"}${toPlotX(p.k).toFixed(1)},${toPlotY(p.omega).toFixed(1)}`
    ).join(" ")
  );

  // Sound speed tangent line: from origin, slope = v_s in (k, omega) space
  // In plot coords: goes from (0, 0) to some reasonable k
  const tangentEnd = createMemo(() => {
    const kEnd = Math.PI * 0.4; // draw tangent up to ~40% of zone
    const wEnd = speedOfSound() * kEnd;
    return { kEnd, wEnd };
  });

  return (
    <div class="space-y-5">
      {/* N slider */}
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "70px" }}>N = {N()}</label>
        <input type="range" min="2" max="20" step="1" value={N()} onInput={(e) => setN(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #14B8A6 ${((N() - 2) / 18) * 100}%, var(--border) ${((N() - 2) / 18) * 100}%)` }} />
      </div>

      {/* SVG plot */}
      <svg width="100%" height="250" viewBox="0 0 420 250" class="mx-auto">
        {/* Axes */}
        <line x1={plotLeft} y1={plotBottom} x2={plotRight} y2={plotBottom} stroke="var(--text-muted)" stroke-width="1" />
        <line x1={plotLeft} y1={plotBottom} x2={plotLeft} y2={plotTop} stroke="var(--text-muted)" stroke-width="1" />

        {/* Axis labels */}
        <text x={(plotLeft + plotRight) / 2} y={245} text-anchor="middle" font-size="10" fill="var(--text-muted)">Wavevector k</text>
        <text x={15} y={(plotTop + plotBottom) / 2} text-anchor="middle" font-size="10" fill="var(--text-muted)" transform={`rotate(-90, 15, ${(plotTop + plotBottom) / 2})`}>Frequency omega</text>

        {/* X-axis ticks */}
        <text x={plotLeft} y={plotBottom + 14} text-anchor="middle" font-size="8" fill="var(--text-muted)">0</text>
        <text x={toPlotX(Math.PI / 2)} y={plotBottom + 14} text-anchor="middle" font-size="8" fill="var(--text-muted)">pi/2</text>
        <text x={plotRight} y={plotBottom + 14} text-anchor="middle" font-size="8" fill="var(--text-muted)">pi/a</text>
        <line x1={toPlotX(Math.PI / 2)} y1={plotBottom} x2={toPlotX(Math.PI / 2)} y2={plotBottom + 4} stroke="var(--text-muted)" stroke-width="0.5" />

        {/* Y-axis ticks */}
        <text x={plotLeft - 5} y={toPlotY(omegaMax) + 3} text-anchor="end" font-size="8" fill="var(--text-muted)">{omegaMax.toFixed(1)}</text>
        <line x1={plotLeft - 3} y1={toPlotY(omegaMax)} x2={plotLeft} y2={toPlotY(omegaMax)} stroke="var(--text-muted)" stroke-width="0.5" />
        <line x1={plotLeft} y1={toPlotY(omegaMax)} x2={plotRight} y2={toPlotY(omegaMax)} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />

        {/* Continuous dispersion curve (dashed) */}
        <path d={curvePath()} fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="6 3" opacity="0.6" />

        {/* Speed of sound tangent line */}
        <line x1={toPlotX(0)} y1={toPlotY(0)} x2={toPlotX(tangentEnd().kEnd)} y2={toPlotY(tangentEnd().wEnd)}
          stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 2" />
        <text x={toPlotX(tangentEnd().kEnd) + 4} y={toPlotY(tangentEnd().wEnd) - 4} font-size="8" fill="#f59e0b">v_s</text>

        {/* Discrete mode points connected by curve */}
        {(() => {
          const pts = modePoints();
          if (pts.length === 0) return null;
          const path = pts.map((p, i) =>
            `${i === 0 ? "M" : "L"}${toPlotX(p.k).toFixed(1)},${toPlotY(p.omega).toFixed(1)}`
          ).join(" ");
          return (
            <>
              <path d={path} fill="none" stroke="#14B8A6" stroke-width="2" />
              <For each={pts}>
                {(p) => (
                  <circle cx={toPlotX(p.k)} cy={toPlotY(p.omega)} r="4" fill="#14B8A6" stroke="white" stroke-width="1.5" />
                )}
              </For>
            </>
          );
        })()}

        {/* Legend */}
        <line x1={plotRight - 120} y1={plotTop + 8} x2={plotRight - 100} y2={plotTop + 8} stroke="#14B8A6" stroke-width="2" />
        <circle cx={plotRight - 110} cy={plotTop + 8} r="3" fill="#14B8A6" />
        <text x={plotRight - 95} y={plotTop + 11} font-size="8" fill="var(--text-muted)">Discrete (N={N()})</text>

        <line x1={plotRight - 120} y1={plotTop + 22} x2={plotRight - 100} y2={plotTop + 22} stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="6 3" />
        <text x={plotRight - 95} y={plotTop + 25} font-size="8" fill="var(--text-muted)">Continuous limit</text>

        <line x1={plotRight - 120} y1={plotTop + 36} x2={plotRight - 100} y2={plotTop + 36} stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 2" />
        <text x={plotRight - 95} y={plotTop + 39} font-size="8" fill="var(--text-muted)">Sound speed</text>
      </svg>

      {/* Stats */}
      <div class="grid grid-cols-3 gap-3">
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Speed of sound</div>
          <div class="text-lg font-bold" style={{ color: "#14B8A6" }}>{speedOfSound().toFixed(3)}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Cutoff freq</div>
          <div class="text-lg font-bold" style={{ color: "#14B8A6" }}>{omegaMax.toFixed(3)}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Modes</div>
          <div class="text-lg font-bold" style={{ color: "#14B8A6" }}>N = {N()}</div>
        </div>
      </div>
    </div>
  );
};
