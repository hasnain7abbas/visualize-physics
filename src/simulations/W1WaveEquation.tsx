import { Component, createSignal, createMemo, onCleanup, For } from "solid-js";

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCENT = "#f59e0b"; // amber for Waves module
const KE_COLOR = "#ef4444"; // red for kinetic energy
const PE_COLOR = "#3b82f6"; // blue for potential energy

// ─── W1StandingWaves ──────────────────────────────────────────────────────────
// Vibrating string simulation showing standing wave modes with fixed endpoints.
// Physics: y(x,t) = A * sin(n*pi*x/L) * cos(omega*t), omega = n*pi*c/L
export const W1StandingWaves: Component = () => {
  const [mode, setMode] = createSignal(1); // harmonic number n = 1..8
  const [amplitude, setAmplitude] = createSignal(60); // max transverse displacement in px
  const [damping, setDamping] = createSignal(false); // toggle damping
  const [playing, setPlaying] = createSignal(true);
  const [time, setTime] = createSignal(0);

  // Physical constants (visualization units)
  const L = 360; // string length in px
  const c = 200; // wave speed px/s

  // Derived quantities
  const omega = createMemo(() => mode() * Math.PI * c / L);
  const wavelengthPx = createMemo(() => (2 * L) / mode());
  const frequencyHz = createMemo(() => omega() / (2 * Math.PI));

  // Damping coefficient (exponential decay)
  const gamma = 0.3;

  let animFrame: number | undefined;
  let lastTs: number | undefined;

  const step = (ts: number) => {
    if (lastTs === undefined) lastTs = ts;
    if (playing()) {
      const dt = (ts - lastTs) / 1000;
      setTime((t) => t + dt);
    }
    lastTs = ts;
    animFrame = requestAnimationFrame(step);
  };
  animFrame = requestAnimationFrame(step);
  onCleanup(() => { if (animFrame !== undefined) cancelAnimationFrame(animFrame); });

  const reset = () => { setTime(0); lastTs = undefined; };

  // SVG layout
  const W = 420, H = 220;
  const xStart = 30, xEnd = 390;
  const cy = 110; // center y

  // Compute the damping factor at current time
  const dampFactor = createMemo(() => damping() ? Math.exp(-gamma * time()) : 1);

  // Generate polyline points for the vibrating string
  const stringPoints = createMemo(() => {
    const n = mode();
    const t = time();
    const A = amplitude();
    const damp = dampFactor();
    const w = omega();
    const pts: string[] = [];
    const numPts = 200;
    for (let i = 0; i <= numPts; i++) {
      const xFrac = i / numPts; // 0..1
      const xPx = xStart + xFrac * L;
      const y = A * damp * Math.sin(n * Math.PI * xFrac) * Math.cos(w * t);
      pts.push(`${xPx.toFixed(1)},${(cy - y).toFixed(1)}`);
    }
    return pts.join(" ");
  });

  // Envelope (maximum amplitude shape) - dashed lines showing +/- envelope
  const envelopePosPoints = createMemo(() => {
    const n = mode();
    const A = amplitude();
    const damp = dampFactor();
    const pts: string[] = [];
    const numPts = 200;
    for (let i = 0; i <= numPts; i++) {
      const xFrac = i / numPts;
      const xPx = xStart + xFrac * L;
      const y = A * damp * Math.sin(n * Math.PI * xFrac);
      pts.push(`${xPx.toFixed(1)},${(cy - y).toFixed(1)}`);
    }
    return pts.join(" ");
  });

  const envelopeNegPoints = createMemo(() => {
    const n = mode();
    const A = amplitude();
    const damp = dampFactor();
    const pts: string[] = [];
    const numPts = 200;
    for (let i = 0; i <= numPts; i++) {
      const xFrac = i / numPts;
      const xPx = xStart + xFrac * L;
      const y = -A * damp * Math.sin(n * Math.PI * xFrac);
      pts.push(`${xPx.toFixed(1)},${(cy - y).toFixed(1)}`);
    }
    return pts.join(" ");
  });

  // Color segments based on transverse velocity
  // velocity = A * sin(n*pi*x/L) * (-omega) * sin(omega*t)
  const stringSegments = createMemo(() => {
    const n = mode();
    const t = time();
    const A = amplitude();
    const damp = dampFactor();
    const w = omega();
    const numPts = 200;
    const segments: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
    const maxVel = A * w; // maximum possible velocity magnitude

    for (let i = 0; i < numPts; i++) {
      const xFrac1 = i / numPts;
      const xFrac2 = (i + 1) / numPts;
      const xPx1 = xStart + xFrac1 * L;
      const xPx2 = xStart + xFrac2 * L;
      const y1 = A * damp * Math.sin(n * Math.PI * xFrac1) * Math.cos(w * t);
      const y2 = A * damp * Math.sin(n * Math.PI * xFrac2) * Math.cos(w * t);
      // Transverse velocity at midpoint
      const xFracMid = (xFrac1 + xFrac2) / 2;
      const vel = Math.abs(A * damp * Math.sin(n * Math.PI * xFracMid) * w * Math.sin(w * t));
      const ratio = maxVel > 0 ? Math.min(vel / maxVel, 1) : 0;
      // blue (#3b82f6) = still, amber (#f59e0b) = fast
      const r = Math.round(59 + (245 - 59) * ratio);
      const g = Math.round(130 + (158 - 130) * ratio);
      const b = Math.round(246 + (11 - 246) * ratio);
      segments.push({
        x1: xPx1, y1: cy - y1,
        x2: xPx2, y2: cy - y2,
        color: `rgb(${r},${g},${b})`
      });
    }
    return segments;
  });

  // Slider percentages for gradient styling
  const ampPct = () => ((amplitude() - 20) / 80) * 100;

  return (
    <div class="space-y-5">
      {/* Mode selector buttons */}
      <div class="flex items-center gap-2 flex-wrap">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Harmonic:</label>
        <For each={[1, 2, 3, 4, 5, 6, 7, 8]}>
          {(n) => (
            <button onClick={() => setMode(n)}
              class="px-3 py-1.5 rounded-lg text-xs font-medium hover:scale-105 transition-all"
              style={{ background: mode() === n ? ACCENT : "var(--bg-secondary)", color: mode() === n ? "white" : "var(--text-secondary)" }}>
              n={n}
            </button>
          )}
        </For>
      </div>

      {/* Amplitude slider */}
      <div class="flex items-center gap-3">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "100px" }}>Amplitude = {amplitude()}</label>
        <input type="range" min="20" max="100" step="1" value={amplitude()} onInput={(e) => setAmplitude(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${ACCENT} ${ampPct()}%, var(--border) ${ampPct()}%)` }} />
      </div>

      {/* Damping toggle */}
      <div class="flex items-center gap-3">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Damping:</label>
        <button onClick={() => { setDamping(!damping()); reset(); setPlaying(true); }}
          class="px-4 py-1.5 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: damping() ? ACCENT : "var(--bg-secondary)", color: damping() ? "white" : "var(--text-secondary)" }}>
          {damping() ? "ON" : "OFF"}
        </button>
      </div>

      {/* SVG visualization */}
      <svg width="100%" height="220" viewBox={`0 0 ${W} ${H}`} class="mx-auto">
        {/* Title */}
        <text x={W / 2} y="16" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Standing Wave: y(x,t) = A sin(n{"\u03C0"}x/L) cos({"\u03C9"}t)
        </text>

        {/* Walls (fixed endpoints) */}
        <rect x={xStart - 6} y={cy - 40} width="6" height="80" rx="2" fill="var(--text-muted)" opacity="0.5" />
        <rect x={xEnd} y={cy - 40} width="6" height="80" rx="2" fill="var(--text-muted)" opacity="0.5" />

        {/* Equilibrium line */}
        <line x1={xStart} y1={cy} x2={xEnd} y2={cy} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="4 3" />

        {/* Envelope (dashed) */}
        <polyline points={envelopePosPoints()} fill="none" stroke={ACCENT} stroke-width="1" stroke-dasharray="4 3" opacity="0.4" />
        <polyline points={envelopeNegPoints()} fill="none" stroke={ACCENT} stroke-width="1" stroke-dasharray="4 3" opacity="0.4" />

        {/* String segments colored by velocity */}
        <For each={stringSegments()}>
          {(seg) => (
            <line x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
              stroke={seg.color} stroke-width="2.5" stroke-linecap="round" />
          )}
        </For>

        {/* Node indicators */}
        <For each={Array.from({ length: mode() + 1 }, (_, i) => i)}>
          {(i) => {
            const xPos = xStart + (i / mode()) * L;
            return (
              <circle cx={xPos} cy={cy} r="3" fill="var(--text-muted)" opacity="0.6" />
            );
          }}
        </For>

        {/* Velocity color legend */}
        <rect x="30" y={H - 20} width="12" height="8" fill="#3b82f6" rx="1" />
        <text x="46" y={H - 13} font-size="7" fill="var(--text-muted)">still</text>
        <rect x="80" y={H - 20} width="12" height="8" fill={ACCENT} rx="1" />
        <text x="96" y={H - 13} font-size="7" fill="var(--text-muted)">fast</text>
      </svg>

      {/* Transport controls */}
      <div class="flex justify-center gap-2">
        <button onClick={() => setPlaying(!playing())}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: ACCENT, color: "white" }}>
          {playing() ? "Pause" : "Play"}
        </button>
        <button onClick={() => { reset(); setPlaying(false); }}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Reset
        </button>
      </div>

      {/* Stat cards */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Mode</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>n = {mode()}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Frequency</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{frequencyHz().toFixed(1)} Hz</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Wavelength</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{"\u03BB"} = {(wavelengthPx() / L * 2).toFixed(2)}L</div>
        </div>
      </div>
    </div>
  );
};

// ─── W1FourierModes ───────────────────────────────────────────────────────────
// Fourier decomposition of an initial string shape.
// Lets user select initial shape (Pluck, Strike, Square) and see how
// adding harmonics reconstructs the shape. Animates time evolution.
export const W1FourierModes: Component = () => {
  type ShapeType = "Pluck" | "Strike" | "Square";
  const [shape, setShape] = createSignal<ShapeType>("Pluck");
  const [numHarmonics, setNumHarmonics] = createSignal(5); // N = 1..20
  const [playing, setPlaying] = createSignal(false);
  const [time, setTime] = createSignal(0);

  const shapes: ShapeType[] = ["Pluck", "Strike", "Square"];

  // String parameters (visualization units)
  const L = 360; // string length in px
  const c = 200;
  const numPts = 200;

  let animFrame: number | undefined;
  let lastTs: number | undefined;

  const step = (ts: number) => {
    if (lastTs === undefined) lastTs = ts;
    if (playing()) {
      const dt = (ts - lastTs) / 1000;
      setTime((t) => t + dt);
    }
    lastTs = ts;
    animFrame = requestAnimationFrame(step);
  };
  animFrame = requestAnimationFrame(step);
  onCleanup(() => { if (animFrame !== undefined) cancelAnimationFrame(animFrame); });

  const reset = () => { setTime(0); lastTs = undefined; };

  // SVG layout
  const W = 420, H_top = 200, H_bar = 100;
  const xStart = 30, xEnd = 390;
  const cy = 100;
  const maxAmp = 60; // max displacement in px

  // Compute the initial shape function f(x) for x in [0, 1]
  const initialShape = (xFrac: number): number => {
    const s = shape();
    if (s === "Pluck") {
      // Triangle plucked at center
      return xFrac <= 0.5 ? 2 * xFrac : 2 * (1 - xFrac);
    } else if (s === "Strike") {
      // Narrow Gaussian centered at x = 0.5
      const sigma = 0.06;
      return Math.exp(-((xFrac - 0.5) ** 2) / (2 * sigma * sigma));
    } else {
      // Square pulse from 0.3 to 0.7
      return xFrac >= 0.3 && xFrac <= 0.7 ? 1 : 0;
    }
  };

  // Compute Fourier coefficients: a_n = (2/L) * integral_0^L f(x) * sin(n*pi*x/L) dx
  // Using numerical integration (trapezoidal rule)
  const fourierCoeffs = createMemo(() => {
    const maxN = 20;
    const coeffs: number[] = [];
    const integPts = 500;
    for (let n = 1; n <= maxN; n++) {
      let sum = 0;
      for (let i = 0; i <= integPts; i++) {
        const xFrac = i / integPts;
        const f = initialShape(xFrac);
        const weight = i === 0 || i === integPts ? 0.5 : 1;
        sum += weight * f * Math.sin(n * Math.PI * xFrac);
      }
      coeffs.push((2 * sum) / integPts);
    }
    return coeffs;
  });

  // Original shape polyline
  const originalPoints = createMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= numPts; i++) {
      const xFrac = i / numPts;
      const xPx = xStart + xFrac * L;
      const y = initialShape(xFrac) * maxAmp;
      pts.push(`${xPx.toFixed(1)},${(cy - y).toFixed(1)}`);
    }
    return pts.join(" ");
  });

  // Fourier reconstruction polyline (with time evolution if playing)
  const reconstructionPoints = createMemo(() => {
    const coeffs = fourierCoeffs();
    const N = numHarmonics();
    const t = time();
    const pts: string[] = [];
    for (let i = 0; i <= numPts; i++) {
      const xFrac = i / numPts;
      const xPx = xStart + xFrac * L;
      let y = 0;
      for (let n = 0; n < N; n++) {
        const omega_n = (n + 1) * Math.PI * c / L;
        y += coeffs[n] * Math.sin((n + 1) * Math.PI * xFrac) * Math.cos(omega_n * t);
      }
      pts.push(`${xPx.toFixed(1)},${(cy - y * maxAmp).toFixed(1)}`);
    }
    return pts.join(" ");
  });

  // Maximum coefficient magnitude for bar chart scaling
  const maxCoeff = createMemo(() => {
    const coeffs = fourierCoeffs();
    return Math.max(...coeffs.map(Math.abs), 0.01);
  });

  // Slider percentage
  const nPct = () => ((numHarmonics() - 1) / 19) * 100;

  return (
    <div class="space-y-5">
      {/* Shape selector */}
      <div class="flex items-center gap-2 flex-wrap">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Shape:</label>
        <For each={shapes}>
          {(s) => (
            <button onClick={() => { setShape(s); reset(); setPlaying(false); }}
              class="px-4 py-1.5 rounded-lg text-xs font-medium hover:scale-105 transition-all"
              style={{ background: shape() === s ? ACCENT : "var(--bg-secondary)", color: shape() === s ? "white" : "var(--text-secondary)" }}>
              {s}
            </button>
          )}
        </For>
      </div>

      {/* Harmonics slider */}
      <div class="flex items-center gap-3">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "110px" }}>Harmonics N = {numHarmonics()}</label>
        <input type="range" min="1" max="20" step="1" value={numHarmonics()} onInput={(e) => setNumHarmonics(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${ACCENT} ${nPct()}%, var(--border) ${nPct()}%)` }} />
      </div>

      {/* SVG: Original shape + reconstruction */}
      <svg width="100%" height="200" viewBox={`0 0 ${W} ${H_top}`} class="mx-auto">
        {/* Title */}
        <text x={W / 2} y="16" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Fourier Reconstruction ({numHarmonics()} harmonic{numHarmonics() > 1 ? "s" : ""})
        </text>

        {/* Walls */}
        <rect x={xStart - 6} y={cy - 40} width="6" height="80" rx="2" fill="var(--text-muted)" opacity="0.5" />
        <rect x={xEnd} y={cy - 40} width="6" height="80" rx="2" fill="var(--text-muted)" opacity="0.5" />

        {/* Equilibrium */}
        <line x1={xStart} y1={cy} x2={xEnd} y2={cy} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="4 3" />

        {/* Original shape (dashed, muted) */}
        <polyline points={originalPoints()} fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.5" />

        {/* Fourier reconstruction (solid amber) */}
        <polyline points={reconstructionPoints()} fill="none" stroke={ACCENT} stroke-width="2.5" />

        {/* Legend */}
        <line x1="30" y1={H_top - 18} x2="50" y2={H_top - 18} stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="5 3" opacity="0.5" />
        <text x="55" y={H_top - 14} font-size="7" fill="var(--text-muted)">Original</text>
        <line x1="120" y1={H_top - 18} x2="140" y2={H_top - 18} stroke={ACCENT} stroke-width="2.5" />
        <text x="145" y={H_top - 14} font-size="7" fill="var(--text-muted)">Reconstruction</text>
      </svg>

      {/* Bar chart of Fourier coefficients */}
      <div>
        <label class="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Fourier coefficients |a{"\u2099"}|</label>
        <svg width="100%" height="100" viewBox={`0 0 ${W} ${H_bar}`} class="mx-auto">
          {/* Bars for each coefficient */}
          <For each={fourierCoeffs().slice(0, 20)}>
            {(coeff, idx) => {
              const barW = 16;
              const gap = (W - 20 * barW) / 21;
              const x = gap + idx() * (barW + gap);
              const absVal = Math.abs(coeff);
              const barH = (absVal / maxCoeff()) * 60;
              const isActive = idx() < numHarmonics();
              return (
                <>
                  <rect x={x} y={75 - barH} width={barW} height={barH} rx="2"
                    fill={ACCENT} opacity={isActive ? 0.85 : 0.15} />
                  <text x={x + barW / 2} y={88} text-anchor="middle" font-size="6" fill="var(--text-muted)">
                    {idx() + 1}
                  </text>
                  {absVal > maxCoeff() * 0.05 && isActive ? (
                    <text x={x + barW / 2} y={70 - barH} text-anchor="middle" font-size="6" fill={ACCENT}>
                      {absVal.toFixed(2)}
                    </text>
                  ) : null}
                </>
              );
            }}
          </For>
          <line x1="5" y1="75" x2={W - 5} y2="75" stroke="var(--border)" stroke-width="0.5" />
          <text x={W / 2} y="98" text-anchor="middle" font-size="7" fill="var(--text-muted)">harmonic number n</text>
        </svg>
      </div>

      {/* Transport controls */}
      <div class="flex justify-center gap-2">
        <button onClick={() => setPlaying(!playing())}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: ACCENT, color: "white" }}>
          {playing() ? "Pause" : "Animate"}
        </button>
        <button onClick={() => { reset(); setPlaying(false); }}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Reset
        </button>
      </div>

      {/* Stat cards */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Shape</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{shape()}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Harmonics</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>N = {numHarmonics()}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Max |a{"\u2099"}|</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{maxCoeff().toFixed(3)}</div>
        </div>
      </div>
    </div>
  );
};

// ─── W1EnergyDensity ──────────────────────────────────────────────────────────
// Energy density distribution along a vibrating string.
// Shows KE density = (1/2)*mu*(dy/dt)^2 and PE density = (1/2)*T*(dy/dx)^2
// with animated string, stacked area plot, and energy partition bar.
export const W1EnergyDensity: Component = () => {
  const [mode, setMode] = createSignal(1); // harmonic n = 1..8
  const [amplitude, setAmplitude] = createSignal(60); // px amplitude
  const [playing, setPlaying] = createSignal(true);
  const [time, setTime] = createSignal(0);

  // Physical parameters (visualization units)
  const L = 360; // string length px
  const c = 200; // wave speed
  const mu = 1; // linear mass density (normalized)
  const T = mu * c * c; // tension T = mu * c^2

  // Derived
  const omega = createMemo(() => mode() * Math.PI * c / L);
  const k_n = createMemo(() => mode() * Math.PI / L);

  let animFrame: number | undefined;
  let lastTs: number | undefined;

  const step = (ts: number) => {
    if (lastTs === undefined) lastTs = ts;
    if (playing()) {
      const dt = (ts - lastTs) / 1000;
      setTime((t) => t + dt);
    }
    lastTs = ts;
    animFrame = requestAnimationFrame(step);
  };
  animFrame = requestAnimationFrame(step);
  onCleanup(() => { if (animFrame !== undefined) cancelAnimationFrame(animFrame); });

  const reset = () => { setTime(0); lastTs = undefined; };

  // SVG layout
  const W_svg = 420;
  const xStart = 30, xEnd = 390;
  const numPts = 200;

  // ── Top panel: animated string with color-coded energy ──
  const stringCy = 60;
  const H_string = 120;

  // String displacement y(x,t) = A * sin(kx) * cos(wt)
  const stringData = createMemo(() => {
    const n = mode();
    const t = time();
    const A = amplitude();
    const w = omega();
    const kn = k_n();
    const data: { xPx: number; y: number; keNorm: number; peNorm: number }[] = [];
    // Max possible energy densities for normalization
    const maxKE = 0.5 * mu * (A * w) ** 2;
    const maxPE = 0.5 * T * (A * kn) ** 2;
    const maxE = Math.max(maxKE, maxPE, 1e-10);

    for (let i = 0; i <= numPts; i++) {
      const xFrac = i / numPts;
      const xPx = xStart + xFrac * L;
      const x = xFrac * L;
      const yVal = A * Math.sin(kn * x) * Math.cos(w * t);
      // KE density: (1/2) * mu * (dy/dt)^2 = (1/2) * mu * (A*w*sin(kx)*sin(wt))^2
      const dydt = -A * w * Math.sin(kn * x) * Math.sin(w * t);
      const ke = 0.5 * mu * dydt * dydt;
      // PE density: (1/2) * T * (dy/dx)^2 = (1/2) * T * (A*k*cos(kx)*cos(wt))^2
      const dydx = A * kn * Math.cos(kn * x) * Math.cos(w * t);
      const pe = 0.5 * T * dydx * dydx;
      data.push({ xPx, y: yVal, keNorm: ke / maxE, peNorm: pe / maxE });
    }
    return data;
  });

  // String segments colored by total energy density
  const stringSegments = createMemo(() => {
    const data = stringData();
    const segs: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
    for (let i = 0; i < data.length - 1; i++) {
      const keRatio = data[i].keNorm;
      const peRatio = data[i].peNorm;
      // Mix KE (red) and PE (blue) based on relative density
      const total = keRatio + peRatio;
      const keFrac = total > 0 ? keRatio / total : 0.5;
      const r = Math.round(239 * keFrac + 59 * (1 - keFrac));
      const g = Math.round(68 * keFrac + 130 * (1 - keFrac));
      const b = Math.round(68 * keFrac + 246 * (1 - keFrac));
      const alpha = 0.4 + 0.6 * Math.min(total, 1);
      segs.push({
        x1: data[i].xPx, y1: stringCy - data[i].y,
        x2: data[i + 1].xPx, y2: stringCy - data[i + 1].y,
        color: `rgba(${r},${g},${b},${alpha})`
      });
    }
    return segs;
  });

  // ── Bottom panel: stacked area chart of KE and PE density ──
  const plotTop = 160, plotBottom = 280, plotH = plotBottom - plotTop;

  // KE area path (filled from baseline)
  const keAreaPath = createMemo(() => {
    const data = stringData();
    const maxDisplay = 0.5; // cap for display scaling
    let path = `M${xStart},${plotBottom}`;
    for (const pt of data) {
      const h = Math.min(pt.keNorm, maxDisplay) / maxDisplay * plotH * 0.9;
      path += ` L${pt.xPx.toFixed(1)},${(plotBottom - h).toFixed(1)}`;
    }
    path += ` L${xEnd},${plotBottom} Z`;
    return path;
  });

  // PE area path (stacked on top of KE)
  const peAreaPath = createMemo(() => {
    const data = stringData();
    const maxDisplay = 0.5;
    let path = "";
    // Top edge of PE (KE + PE)
    const topPts: string[] = [];
    const bottomPts: string[] = [];
    for (const pt of data) {
      const keH = Math.min(pt.keNorm, maxDisplay) / maxDisplay * plotH * 0.9;
      const peH = Math.min(pt.peNorm, maxDisplay) / maxDisplay * plotH * 0.9;
      topPts.push(`${pt.xPx.toFixed(1)},${(plotBottom - keH - peH).toFixed(1)}`);
      bottomPts.push(`${pt.xPx.toFixed(1)},${(plotBottom - keH).toFixed(1)}`);
    }
    path = `M${topPts[0]} ` + topPts.slice(1).map(p => `L${p}`).join(" ");
    // Return along the KE top edge (reversed)
    path += " " + bottomPts.reverse().map((p, i) => `${i === 0 ? "L" : "L"}${p}`).join(" ");
    path += " Z";
    return path;
  });

  // ── Energy partition (total KE vs PE) ──
  const energyPartition = createMemo(() => {
    const t = time();
    const w = omega();
    // For standing wave: total KE ~ sin^2(wt), total PE ~ cos^2(wt)
    const sin2 = Math.sin(w * t) ** 2;
    const cos2 = Math.cos(w * t) ** 2;
    return { keFrac: sin2, peFrac: cos2 };
  });

  // Slider percentage
  const ampPct = () => ((amplitude() - 20) / 80) * 100;

  return (
    <div class="space-y-5">
      {/* Mode selector */}
      <div class="flex items-center gap-2 flex-wrap">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Mode:</label>
        <For each={[1, 2, 3, 4, 5, 6, 7, 8]}>
          {(n) => (
            <button onClick={() => setMode(n)}
              class="px-3 py-1.5 rounded-lg text-xs font-medium hover:scale-105 transition-all"
              style={{ background: mode() === n ? ACCENT : "var(--bg-secondary)", color: mode() === n ? "white" : "var(--text-secondary)" }}>
              n={n}
            </button>
          )}
        </For>
      </div>

      {/* Amplitude slider */}
      <div class="flex items-center gap-3">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "100px" }}>Amplitude = {amplitude()}</label>
        <input type="range" min="20" max="100" step="1" value={amplitude()} onInput={(e) => setAmplitude(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${ACCENT} ${ampPct()}%, var(--border) ${ampPct()}%)` }} />
      </div>

      {/* Combined SVG: string + energy density plot */}
      <svg width="100%" height="300" viewBox={`0 0 ${W_svg} 300`} class="mx-auto">
        {/* ── String panel ── */}
        <text x={W_svg / 2} y="16" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Vibrating String (color = KE{"\u2009"}vs{"\u2009"}PE density)
        </text>

        {/* Walls */}
        <rect x={xStart - 6} y={stringCy - 35} width="6" height="70" rx="2" fill="var(--text-muted)" opacity="0.5" />
        <rect x={xEnd} y={stringCy - 35} width="6" height="70" rx="2" fill="var(--text-muted)" opacity="0.5" />

        {/* Equilibrium */}
        <line x1={xStart} y1={stringCy} x2={xEnd} y2={stringCy} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="4 3" />

        {/* Colored string segments */}
        <For each={stringSegments()}>
          {(seg) => (
            <line x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
              stroke={seg.color} stroke-width="2.5" stroke-linecap="round" />
          )}
        </For>

        {/* Color legend for string */}
        <rect x="30" y={H_string + 10} width="10" height="6" fill={KE_COLOR} rx="1" opacity="0.8" />
        <text x="44" y={H_string + 16} font-size="7" fill="var(--text-muted)">KE dominant</text>
        <rect x="120" y={H_string + 10} width="10" height="6" fill={PE_COLOR} rx="1" opacity="0.8" />
        <text x="134" y={H_string + 16} font-size="7" fill="var(--text-muted)">PE dominant</text>

        {/* ── Separator ── */}
        <line x1="20" y1="145" x2="400" y2="145" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />

        {/* ── Energy density stacked area plot ── */}
        <text x={W_svg / 2} y="155" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)">
          Energy Density Along String
        </text>

        {/* Axis */}
        <line x1={xStart} y1={plotBottom} x2={xEnd} y2={plotBottom} stroke="var(--text-muted)" stroke-width="0.5" />
        <text x={W_svg / 2} y={plotBottom + 14} text-anchor="middle" font-size="7" fill="var(--text-muted)">position x</text>

        {/* PE area (on top of KE) */}
        <path d={peAreaPath()} fill={PE_COLOR} opacity="0.35" />

        {/* KE area (bottom layer) */}
        <path d={keAreaPath()} fill={KE_COLOR} opacity="0.35" />

        {/* Area legend */}
        <rect x="30" y={plotBottom + 4} width="10" height="6" fill={KE_COLOR} rx="1" opacity="0.5" />
        <text x="44" y={plotBottom + 10} font-size="7" fill="var(--text-muted)">{"\u00BD"}{"\u03BC"}({"\u2202"}y/{"\u2202"}t){"\u00B2"}</text>
        <rect x="150" y={plotBottom + 4} width="10" height="6" fill={PE_COLOR} rx="1" opacity="0.5" />
        <text x="164" y={plotBottom + 10} font-size="7" fill="var(--text-muted)">{"\u00BD"}T({"\u2202"}y/{"\u2202"}x){"\u00B2"}</text>
      </svg>

      {/* Energy partition bar: KE vs PE */}
      <div>
        <label class="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Energy Partition (KE + PE = const)</label>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-[10px] font-medium" style={{ color: KE_COLOR, "min-width": "30px" }}>KE</span>
          <div class="flex-1 h-5 rounded-full overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
            <div class="h-full flex">
              <div class="h-full transition-all" style={{
                width: `${(energyPartition().keFrac * 100).toFixed(1)}%`,
                background: KE_COLOR,
                opacity: 0.7
              }} />
              <div class="h-full transition-all" style={{
                width: `${(energyPartition().peFrac * 100).toFixed(1)}%`,
                background: PE_COLOR,
                opacity: 0.7
              }} />
            </div>
          </div>
          <span class="text-[10px] font-medium" style={{ color: PE_COLOR, "min-width": "30px" }}>PE</span>
        </div>
        <div class="flex justify-between mt-1">
          <span class="text-[10px]" style={{ color: KE_COLOR }}>{(energyPartition().keFrac * 100).toFixed(0)}%</span>
          <span class="text-[10px]" style={{ color: PE_COLOR }}>{(energyPartition().peFrac * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Transport controls */}
      <div class="flex justify-center gap-2">
        <button onClick={() => setPlaying(!playing())}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: ACCENT, color: "white" }}>
          {playing() ? "Pause" : "Play"}
        </button>
        <button onClick={() => { reset(); setPlaying(false); }}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Reset
        </button>
      </div>

      {/* Stat cards */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Mode</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>n = {mode()}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>KE fraction</div>
          <div class="text-lg font-bold" style={{ color: KE_COLOR }}>{(energyPartition().keFrac * 100).toFixed(0)}%</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>PE fraction</div>
          <div class="text-lg font-bold" style={{ color: PE_COLOR }}>{(energyPartition().peFrac * 100).toFixed(0)}%</div>
        </div>
      </div>
    </div>
  );
};
