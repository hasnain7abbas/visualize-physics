import { Component, createSignal, createMemo, onCleanup, For } from "solid-js";

const ACCENT = "#22d3ee";
const PARTICLE_COLOR = "#06b6d4";
const HOT_COLOR = "#ef4444";
const COLD_COLOR = "#3b82f6";

// ─── Lennard-Jones Particle Engine ───────────────────────────────────────────
// Shared physics for 2D Lennard-Jones particles with velocity-Verlet integration.
function createLJSimulation(N: number, boxSize: number, initialTemp: number) {
  const epsilon = 1.0; // LJ well depth
  const sigma = 1.0;   // LJ zero-crossing distance
  const dt = 0.002;     // timestep
  const cutoff = 2.5 * sigma;
  const cutoff2 = cutoff * cutoff;

  // State arrays
  const x = new Float64Array(N);
  const y = new Float64Array(N);
  const vx = new Float64Array(N);
  const vy = new Float64Array(N);
  const fx = new Float64Array(N);
  const fy = new Float64Array(N);

  // Initialize on a grid
  const gridN = Math.ceil(Math.sqrt(N));
  const spacing = boxSize / gridN;
  for (let i = 0; i < N; i++) {
    x[i] = (i % gridN + 0.5) * spacing;
    y[i] = (Math.floor(i / gridN) + 0.5) * spacing;
    // Random velocities from Maxwell-Boltzmann
    const speed = Math.sqrt(initialTemp) * 2;
    const angle = Math.random() * 2 * Math.PI;
    vx[i] = speed * Math.cos(angle) * (Math.random() * 0.5 + 0.75);
    vy[i] = speed * Math.sin(angle) * (Math.random() * 0.5 + 0.75);
  }

  // Remove center-of-mass velocity
  let vxSum = 0, vySum = 0;
  for (let i = 0; i < N; i++) { vxSum += vx[i]; vySum += vy[i]; }
  for (let i = 0; i < N; i++) { vx[i] -= vxSum / N; vy[i] -= vySum / N; }

  let potentialEnergy = 0;

  function computeForces() {
    fx.fill(0);
    fy.fill(0);
    potentialEnergy = 0;

    for (let i = 0; i < N - 1; i++) {
      for (let j = i + 1; j < N; j++) {
        let dx = x[i] - x[j];
        let dy = y[i] - y[j];
        // Periodic boundary conditions
        if (dx > boxSize / 2) dx -= boxSize;
        if (dx < -boxSize / 2) dx += boxSize;
        if (dy > boxSize / 2) dy -= boxSize;
        if (dy < -boxSize / 2) dy += boxSize;

        const r2 = dx * dx + dy * dy;
        if (r2 < cutoff2 && r2 > 0.01) {
          const r2inv = sigma * sigma / r2;
          const r6inv = r2inv * r2inv * r2inv;
          const r12inv = r6inv * r6inv;
          const fMag = 24 * epsilon * (2 * r12inv - r6inv) / r2;
          fx[i] += fMag * dx;
          fy[i] += fMag * dy;
          fx[j] -= fMag * dx;
          fy[j] -= fMag * dy;
          potentialEnergy += 4 * epsilon * (r12inv - r6inv);
        }
      }
    }
  }

  function step() {
    // Velocity-Verlet: half-step velocity
    for (let i = 0; i < N; i++) {
      vx[i] += 0.5 * fx[i] * dt;
      vy[i] += 0.5 * fy[i] * dt;
      x[i] += vx[i] * dt;
      y[i] += vy[i] * dt;
      // Periodic boundaries
      x[i] = ((x[i] % boxSize) + boxSize) % boxSize;
      y[i] = ((y[i] % boxSize) + boxSize) % boxSize;
    }
    computeForces();
    // Complete velocity step
    for (let i = 0; i < N; i++) {
      vx[i] += 0.5 * fx[i] * dt;
      vy[i] += 0.5 * fy[i] * dt;
    }
  }

  // Rescale velocities to target temperature
  function rescaleTemp(targetT: number) {
    let ke = 0;
    for (let i = 0; i < N; i++) ke += vx[i] * vx[i] + vy[i] * vy[i];
    const currentT = ke / (2 * N);
    if (currentT > 0.001) {
      const scale = Math.sqrt(targetT / currentT);
      for (let i = 0; i < N; i++) { vx[i] *= scale; vy[i] *= scale; }
    }
  }

  function getKE() {
    let ke = 0;
    for (let i = 0; i < N; i++) ke += 0.5 * (vx[i] * vx[i] + vy[i] * vy[i]);
    return ke;
  }

  function getTemperature() {
    let ke = 0;
    for (let i = 0; i < N; i++) ke += vx[i] * vx[i] + vy[i] * vy[i];
    return ke / (2 * N);
  }

  function getSpeeds() {
    const speeds: number[] = [];
    for (let i = 0; i < N; i++) speeds.push(Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i]));
    return speeds;
  }

  function getPositions() {
    const pos: { x: number; y: number; speed: number }[] = [];
    for (let i = 0; i < N; i++) {
      pos.push({ x: x[i], y: y[i], speed: Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i]) });
    }
    return pos;
  }

  computeForces();

  return { step, rescaleTemp, getKE, getPE: () => potentialEnergy, getTemperature, getSpeeds, getPositions, N, boxSize };
}

// ─── S12LennardJones ─────────────────────────────────────────────────────────
// 2D Lennard-Jones molecular dynamics with real-time particle visualization.
export const S12LennardJones: Component = () => {
  const NUM_PARTICLES = 64;
  const BOX = 12;
  const [temperature, setTemperature] = createSignal(1.5);
  const [running, setRunning] = createSignal(true);
  const [positions, setPositions] = createSignal<{ x: number; y: number; speed: number }[]>([]);
  const [ke, setKE] = createSignal(0);
  const [pe, setPE] = createSignal(0);
  const [simTemp, setSimTemp] = createSignal(0);
  const [stepCount, setStepCount] = createSignal(0);

  const sim = createLJSimulation(NUM_PARTICLES, BOX, temperature());

  let animFrame: number | undefined;
  let lastTs: number | undefined;
  const stepsPerFrame = 8;

  const animate = (ts: number) => {
    if (lastTs === undefined) lastTs = ts;
    if (running()) {
      // Thermostat: gently rescale every 50 steps
      for (let s = 0; s < stepsPerFrame; s++) {
        sim.step();
        setStepCount(c => c + 1);
        if (stepCount() % 50 === 0) sim.rescaleTemp(temperature());
      }
      setPositions(sim.getPositions());
      setKE(sim.getKE());
      setPE(sim.getPE());
      setSimTemp(sim.getTemperature());
    }
    lastTs = ts;
    animFrame = requestAnimationFrame(animate);
  };
  animFrame = requestAnimationFrame(animate);
  onCleanup(() => { if (animFrame !== undefined) cancelAnimationFrame(animFrame); });

  const W = 340, H = 340;
  const scale = W / BOX;

  const tPct = () => ((temperature() - 0.3) / 4.7) * 100;

  // Color particles by speed
  const speedColor = (speed: number) => {
    const maxSpeed = Math.sqrt(temperature()) * 4;
    const ratio = Math.min(speed / maxSpeed, 1);
    const r = Math.round(6 + (239 - 6) * ratio);
    const g = Math.round(182 + (68 - 182) * ratio);
    const b = Math.round(212 + (68 - 212) * ratio);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-3 flex-wrap">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "170px" }}>Temperature T* = {temperature().toFixed(1)}</label>
        <input type="range" min="0.3" max="5.0" step="0.1" value={temperature()} onInput={(e) => setTemperature(parseFloat(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${COLD_COLOR} 0%, ${ACCENT} 50%, ${HOT_COLOR} 100%)` }} />
      </div>

      <div class="flex items-center gap-3">
        <button onClick={() => setRunning(!running())}
          class="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
          style={{ background: running() ? "var(--bg-secondary)" : ACCENT, color: running() ? "var(--text-secondary)" : "white" }}>
          {running() ? "\u23F8 Pause" : "\u25B6 Run"}
        </button>
        <span class="text-[10px]" style={{ color: "var(--text-muted)" }}>{NUM_PARTICLES} particles | Step: {stepCount()}</span>
      </div>

      {/* Particle box */}
      <div class="flex justify-center">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ "max-width": "340px", "aspect-ratio": "1 / 1", background: "var(--bg-secondary)", "border-radius": "12px", border: "1px solid var(--border)" }}>
          {/* Box border */}
          <rect x="1" y="1" width={W - 2} height={H - 2} fill="none" stroke="var(--border)" stroke-width="2" rx="10" />

          {/* Particles */}
          <For each={positions()}>
            {(p) => (
              <circle
                cx={(p.x / BOX) * W}
                cy={(p.y / BOX) * H}
                r="5"
                fill={speedColor(p.speed)}
                opacity="0.9"
              >
                <animate attributeName="r" values="5;6;5" dur="0.8s" repeatCount="indefinite" />
              </circle>
            )}
          </For>
        </svg>
      </div>

      {/* Stats */}
      <div class="grid grid-cols-4 gap-2 text-center">
        <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-sm font-bold" style={{ color: ACCENT }}>{simTemp().toFixed(2)}</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>T (measured)</div>
        </div>
        <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-sm font-bold" style={{ color: HOT_COLOR }}>{ke().toFixed(1)}</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>KE</div>
        </div>
        <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-sm font-bold" style={{ color: COLD_COLOR }}>{pe().toFixed(1)}</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>PE</div>
        </div>
        <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-sm font-bold" style={{ color: "var(--accent)" }}>{(ke() + pe()).toFixed(1)}</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Total E</div>
        </div>
      </div>
    </div>
  );
};

// ─── S12VelocityDistribution ─────────────────────────────────────────────────
// Histogram of particle speeds compared with Maxwell-Boltzmann distribution.
export const S12VelocityDistribution: Component = () => {
  const NUM_PARTICLES = 100;
  const BOX = 14;
  const [temperature, setTemperature] = createSignal(2.0);
  const [running, setRunning] = createSignal(true);
  const [histogram, setHistogram] = createSignal<number[]>(new Array(20).fill(0));
  const [sampleCount, setSampleCount] = createSignal(0);

  const sim = createLJSimulation(NUM_PARTICLES, BOX, temperature());

  const NBINS = 20;
  const maxSpeed = 8;
  const binWidth = maxSpeed / NBINS;
  const accum = new Float64Array(NBINS);
  let totalSamples = 0;

  let animFrame: number | undefined;
  const stepsPerFrame = 10;

  const animate = () => {
    if (running()) {
      for (let s = 0; s < stepsPerFrame; s++) {
        sim.step();
        if (totalSamples % 5 === 0) sim.rescaleTemp(temperature());
      }
      // Sample speeds into histogram
      const speeds = sim.getSpeeds();
      for (const sp of speeds) {
        const bin = Math.min(Math.floor(sp / binWidth), NBINS - 1);
        if (bin >= 0) accum[bin]++;
      }
      totalSamples += speeds.length;
      setSampleCount(totalSamples);

      // Normalize histogram
      const hist: number[] = [];
      for (let i = 0; i < NBINS; i++) {
        hist.push(accum[i] / (totalSamples * binWidth));
      }
      setHistogram(hist);
    }
    animFrame = requestAnimationFrame(animate);
  };
  animFrame = requestAnimationFrame(animate);
  onCleanup(() => { if (animFrame !== undefined) cancelAnimationFrame(animFrame); });

  // Maxwell-Boltzmann 2D: f(v) = (v/T) * exp(-v²/(2T))
  const mbCurve = createMemo(() => {
    const T = temperature();
    const pts: { v: number; f: number }[] = [];
    for (let i = 0; i <= 100; i++) {
      const v = (i / 100) * maxSpeed;
      const f = (v / T) * Math.exp(-v * v / (2 * T));
      pts.push({ v, f });
    }
    return pts;
  });

  const W = 440, H = 220;
  const pad = { l: 50, r: 15, t: 25, b: 35 };

  const maxF = createMemo(() => {
    const histMax = Math.max(...histogram(), 0.01);
    const mbMax = Math.max(...mbCurve().map(p => p.f), 0.01);
    return Math.max(histMax, mbMax) * 1.15;
  });

  const toSVG = (v: number, f: number) => ({
    x: pad.l + (v / maxSpeed) * (W - pad.l - pad.r),
    y: pad.t + ((maxF() - f) / maxF()) * (H - pad.t - pad.b),
  });

  const reset = () => {
    accum.fill(0);
    totalSamples = 0;
    setSampleCount(0);
    setHistogram(new Array(NBINS).fill(0));
  };

  const tPct = () => ((temperature() - 0.5) / 4.5) * 100;

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-3">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "130px" }}>T* = {temperature().toFixed(1)}</label>
        <input type="range" min="0.5" max="5.0" step="0.1" value={temperature()} onInput={(e) => { setTemperature(parseFloat(e.currentTarget.value)); reset(); }}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${ACCENT} ${tPct()}%, var(--border) ${tPct()}%)` }} />
      </div>

      <div class="flex items-center gap-3">
        <button onClick={() => setRunning(!running())}
          class="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
          style={{ background: running() ? "var(--bg-secondary)" : ACCENT, color: running() ? "var(--text-secondary)" : "white" }}>
          {running() ? "\u23F8 Pause" : "\u25B6 Run"}
        </button>
        <button onClick={reset}
          class="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          {"\u21BA"} Reset
        </button>
        <span class="text-[10px]" style={{ color: "var(--text-muted)" }}>Samples: {sampleCount().toLocaleString()}</span>
      </div>

      <svg width="100%" height="220" viewBox={`0 0 ${W} ${H}`} class="mx-auto">
        <text x={W / 2} y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Speed Distribution vs Maxwell-Boltzmann (2D)
        </text>

        {/* Axes */}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke="var(--text-muted)" stroke-width="1" />
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke="var(--text-muted)" stroke-width="1" />
        <text x={(pad.l + W - pad.r) / 2} y={H - 8} text-anchor="middle" font-size="10" fill="var(--text-muted)">Speed v</text>
        <text x={pad.l - 8} y={(pad.t + H - pad.b) / 2} text-anchor="middle" font-size="10" fill="var(--text-muted)" transform={`rotate(-90,${pad.l - 8},${(pad.t + H - pad.b) / 2})`}>f(v)</text>

        {/* Histogram bars */}
        <For each={histogram()}>
          {(val, i) => {
            const x1 = pad.l + (i() * binWidth / maxSpeed) * (W - pad.l - pad.r);
            const x2 = pad.l + ((i() + 1) * binWidth / maxSpeed) * (W - pad.l - pad.r);
            const barH = (val / maxF()) * (H - pad.t - pad.b);
            return (
              <rect x={x1 + 1} y={H - pad.b - barH} width={x2 - x1 - 2} height={barH}
                rx="2" fill={ACCENT} opacity="0.6" />
            );
          }}
        </For>

        {/* Maxwell-Boltzmann curve */}
        <path
          d={mbCurve().map((p, i) => {
            const { x, y } = toSVG(p.v, p.f);
            return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(" ")}
          fill="none" stroke={HOT_COLOR} stroke-width="2.5" stroke-linecap="round"
        />

        {/* Legend */}
        <rect x={W - 160} y={pad.t + 4} width={10} height={10} rx="2" fill={ACCENT} opacity="0.6" />
        <text x={W - 146} y={pad.t + 13} font-size="9" fill="var(--text-secondary)">Simulation</text>
        <line x1={W - 160} y1={pad.t + 22} x2={W - 150} y2={pad.t + 22} stroke={HOT_COLOR} stroke-width="2" />
        <text x={W - 146} y={pad.t + 25} font-size="9" fill="var(--text-secondary)">Maxwell-Boltzmann</text>
      </svg>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-sm font-bold" style={{ color: ACCENT }}>{Math.sqrt(2 * temperature()).toFixed(2)}</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>v_most probable</div>
        </div>
        <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-sm font-bold" style={{ color: HOT_COLOR }}>{(Math.sqrt(Math.PI * temperature() / 2)).toFixed(2)}</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>v_mean</div>
        </div>
        <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-sm font-bold" style={{ color: COLD_COLOR }}>{Math.sqrt(2 * temperature()).toFixed(2)}</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>v_rms</div>
        </div>
      </div>
    </div>
  );
};

// ─── S12RadialDistribution ───────────────────────────────────────────────────
// Radial distribution function g(r) from molecular dynamics.
export const S12RadialDistribution: Component = () => {
  const NUM_PARTICLES = 80;
  const BOX = 13;
  const [temperature, setTemperature] = createSignal(1.5);
  const [running, setRunning] = createSignal(true);
  const [gofr, setGofr] = createSignal<number[]>(new Array(50).fill(0));
  const [sampleCount, setSampleCount] = createSignal(0);

  const sim = createLJSimulation(NUM_PARTICLES, BOX, temperature());

  const NBINS = 50;
  const rMax = BOX / 2;
  const dr = rMax / NBINS;
  const gAccum = new Float64Array(NBINS);
  let nSamples = 0;

  let animFrame: number | undefined;

  const sampleGofR = () => {
    const pos = sim.getPositions();
    for (let i = 0; i < pos.length - 1; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        let dx = pos[i].x - pos[j].x;
        let dy = pos[i].y - pos[j].y;
        if (dx > BOX / 2) dx -= BOX;
        if (dx < -BOX / 2) dx += BOX;
        if (dy > BOX / 2) dy -= BOX;
        if (dy < -BOX / 2) dy += BOX;
        const r = Math.sqrt(dx * dx + dy * dy);
        if (r < rMax) {
          const bin = Math.floor(r / dr);
          if (bin < NBINS) gAccum[bin]++;
        }
      }
    }
    nSamples++;
  };

  const computeGofR = () => {
    if (nSamples === 0) return new Array(NBINS).fill(0);
    const density = NUM_PARTICLES / (BOX * BOX);
    const result: number[] = [];
    for (let i = 0; i < NBINS; i++) {
      const rInner = i * dr;
      const rOuter = (i + 1) * dr;
      const shellArea = Math.PI * (rOuter * rOuter - rInner * rInner);
      const idealCount = density * shellArea * NUM_PARTICLES / 2;
      result.push(gAccum[i] / (nSamples * idealCount));
    }
    return result;
  };

  const animate = () => {
    if (running()) {
      for (let s = 0; s < 10; s++) {
        sim.step();
        if (s % 5 === 0) sim.rescaleTemp(temperature());
      }
      sampleGofR();
      setSampleCount(nSamples);
      if (nSamples % 3 === 0) setGofr(computeGofR());
    }
    animFrame = requestAnimationFrame(animate);
  };
  animFrame = requestAnimationFrame(animate);
  onCleanup(() => { if (animFrame !== undefined) cancelAnimationFrame(animFrame); });

  const reset = () => {
    gAccum.fill(0);
    nSamples = 0;
    setSampleCount(0);
    setGofr(new Array(NBINS).fill(0));
  };

  const W = 440, H = 220;
  const pad = { l: 50, r: 15, t: 25, b: 35 };

  const maxG = createMemo(() => Math.max(...gofr(), 2));

  const toSVG = (r: number, g: number) => ({
    x: pad.l + (r / rMax) * (W - pad.l - pad.r),
    y: pad.t + ((maxG() - g) / maxG()) * (H - pad.t - pad.b),
  });

  const tPct = () => ((temperature() - 0.3) / 4.7) * 100;

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-3">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "130px" }}>T* = {temperature().toFixed(1)}</label>
        <input type="range" min="0.3" max="5.0" step="0.1" value={temperature()} onInput={(e) => { setTemperature(parseFloat(e.currentTarget.value)); reset(); }}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${ACCENT} ${tPct()}%, var(--border) ${tPct()}%)` }} />
      </div>

      <div class="flex items-center gap-3">
        <button onClick={() => setRunning(!running())}
          class="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
          style={{ background: running() ? "var(--bg-secondary)" : ACCENT, color: running() ? "var(--text-secondary)" : "white" }}>
          {running() ? "\u23F8 Pause" : "\u25B6 Run"}
        </button>
        <button onClick={reset}
          class="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          {"\u21BA"} Reset
        </button>
        <span class="text-[10px]" style={{ color: "var(--text-muted)" }}>Frames: {sampleCount()}</span>
      </div>

      <svg width="100%" height="220" viewBox={`0 0 ${W} ${H}`} class="mx-auto">
        <text x={W / 2} y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Radial Distribution Function g(r)
        </text>

        {/* Axes */}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke="var(--text-muted)" stroke-width="1" />
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke="var(--text-muted)" stroke-width="1" />
        <text x={(pad.l + W - pad.r) / 2} y={H - 8} text-anchor="middle" font-size="10" fill="var(--text-muted)">r / {"\u03C3"}</text>
        <text x={pad.l - 8} y={(pad.t + H - pad.b) / 2} text-anchor="middle" font-size="10" fill="var(--text-muted)" transform={`rotate(-90,${pad.l - 8},${(pad.t + H - pad.b) / 2})`}>g(r)</text>

        {/* g(r) = 1 reference line */}
        {(() => {
          const { y } = toSVG(0, 1);
          return (
            <>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="var(--text-muted)" stroke-width="0.8" stroke-dasharray="4 3" opacity="0.5" />
              <text x={pad.l + 4} y={y - 4} font-size="8" fill="var(--text-muted)">g=1</text>
            </>
          );
        })()}

        {/* g(r) curve with filled area */}
        {(() => {
          const pts = gofr();
          const pathData = pts.map((g, i) => {
            const r = (i + 0.5) * dr;
            const { x, y } = toSVG(r, g);
            return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(" ");
          const baseY = pad.t + (H - pad.t - pad.b);
          const fillPath = pathData + ` L${(W - pad.r).toFixed(1)},${baseY} L${pad.l},${baseY} Z`;
          return (
            <>
              <path d={fillPath} fill={`${ACCENT}20`} />
              <path d={pathData} fill="none" stroke={ACCENT} stroke-width="2.5" stroke-linecap="round" />
            </>
          );
        })()}
      </svg>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-sm font-bold" style={{ color: ACCENT }}>
            {(() => {
              const g = gofr();
              const maxIdx = g.indexOf(Math.max(...g));
              return ((maxIdx + 0.5) * dr).toFixed(2);
            })()}
          </div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>1st peak r/{"\u03C3"}</div>
        </div>
        <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-sm font-bold" style={{ color: HOT_COLOR }}>{Math.max(...gofr()).toFixed(2)}</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>g(r) peak</div>
        </div>
        <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-sm font-bold" style={{ color: COLD_COLOR }}>{(NUM_PARTICLES / (BOX * BOX)).toFixed(3)}</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>density {"\u03C1"}</div>
        </div>
      </div>
    </div>
  );
};
