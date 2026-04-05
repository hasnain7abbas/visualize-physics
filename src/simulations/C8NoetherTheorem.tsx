import { Component, createSignal, createMemo, onCleanup } from "solid-js";

// ─── C8TimeEnergy ──────────────────────────────────────────────────────────
// Time translation symmetry → energy conservation (SHO)
export const C8TimeEnergy: Component = () => {
  const [mass, setMass] = createSignal(2);
  const [springK, setSpringK] = createSignal(4);
  const [x0, setX0] = createSignal(1.5);
  const [broken, setBroken] = createSignal(false);
  const [playing, setPlaying] = createSignal(false);
  const [time, setTime] = createSignal(0);
  const [history, setHistory] = createSignal<{ t: number; ke: number; pe: number; te: number }[]>([]);

  let animFrame: number | undefined;
  const dt = 0.05;

  const state = { x: 0, v: 0 };

  const reset = () => {
    setTime(0);
    setHistory([]);
    state.x = x0();
    state.v = 0;
    setPlaying(false);
    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = undefined;
  };

  reset();

  const step = () => {
    const t = time();
    const m = mass();
    const k0 = springK();
    const k = broken() ? k0 * (1 + 0.3 * Math.sin(0.5 * t)) : k0;
    // Velocity-Verlet
    const a = -k * state.x / m;
    state.x += state.v * dt + 0.5 * a * dt * dt;
    const kNew = broken() ? k0 * (1 + 0.3 * Math.sin(0.5 * (t + dt))) : k0;
    const aNew = -kNew * state.x / m;
    state.v += 0.5 * (a + aNew) * dt;

    const ke = 0.5 * m * state.v * state.v;
    const pe = 0.5 * kNew * state.x * state.x;
    const te = ke + pe;
    const newT = t + dt;
    setTime(newT);
    setHistory((h) => {
      const next = [...h, { t: newT, ke, pe, te }];
      return next.length > 300 ? next.slice(next.length - 300) : next;
    });
  };

  const animate = () => {
    step();
    animFrame = requestAnimationFrame(animate);
  };

  const togglePlay = () => {
    if (playing()) {
      if (animFrame) cancelAnimationFrame(animFrame);
      animFrame = undefined;
      setPlaying(false);
    } else {
      if (time() === 0) { state.x = x0(); state.v = 0; }
      setPlaying(true);
      animate();
    }
  };

  onCleanup(() => { if (animFrame) cancelAnimationFrame(animFrame); });

  // Spring zigzag path
  const springPath = createMemo(() => {
    const anchorX = 40;
    const massX = 210 + state.x * 40;
    const coils = 12;
    const segLen = (massX - anchorX - 20) / (coils * 2);
    let d = `M${anchorX},75`;
    d += ` L${anchorX + 10},75`;
    for (let i = 0; i < coils; i++) {
      const bx = anchorX + 10 + (i * 2 + 1) * segLen;
      const bx2 = anchorX + 10 + (i * 2 + 2) * segLen;
      d += ` L${bx},${i % 2 === 0 ? 55 : 95}`;
      d += ` L${bx2},75`;
    }
    d += ` L${massX},75`;
    return d;
  });

  const massX = createMemo(() => 210 + state.x * 40);

  // Energy plot scaling
  const maxE = createMemo(() => {
    const h = history();
    if (h.length === 0) return 1;
    return Math.max(...h.map((p) => Math.max(p.ke, p.pe, p.te)), 0.1) * 1.15;
  });

  return (
    <div class="space-y-5">
      {/* Controls */}
      <div class="grid grid-cols-3 gap-3">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>m = {mass()}</label>
          <input type="range" min="1" max="5" step="0.5" value={mass()} onInput={(e) => { setMass(parseFloat(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #10B981 ${((mass() - 1) / 4) * 100}%, var(--border) ${((mass() - 1) / 4) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>k = {springK()}</label>
          <input type="range" min="1" max="10" step="0.5" value={springK()} onInput={(e) => { setSpringK(parseFloat(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #10B981 ${((springK() - 1) / 9) * 100}%, var(--border) ${((springK() - 1) / 9) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>x₀ = {x0().toFixed(1)}</label>
          <input type="range" min="0.5" max="3" step="0.1" value={x0()} onInput={(e) => { setX0(parseFloat(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #10B981 ${((x0() - 0.5) / 2.5) * 100}%, var(--border) ${((x0() - 0.5) / 2.5) * 100}%)` }} />
        </div>
      </div>

      {/* Buttons row */}
      <div class="flex items-center gap-3">
        <button onClick={togglePlay}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#10B981", color: "white" }}>
          {playing() ? "Pause" : "Play"}
        </button>
        <button onClick={reset}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
          Reset
        </button>
        <button onClick={() => setBroken(!broken())}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: broken() ? "#ef4444" : "var(--bg-secondary)", color: broken() ? "white" : "var(--text-primary)", border: broken() ? "none" : "1px solid var(--border)" }}>
          {broken() ? "Symmetry Broken" : "Break Symmetry"}
        </button>
      </div>

      {/* Spring animation SVG */}
      <svg width="100%" height="150" viewBox="0 0 420 150" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Simple Harmonic Oscillator</text>
        {/* Wall */}
        <rect x="30" y="45" width="10" height="60" fill="var(--border)" rx="2" />
        <line x1="30" y1="45" x2="30" y2="105" stroke="var(--text-muted)" stroke-width="1.5" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line x1="25" y1={48 + i * 12} x2="30" y2={54 + i * 12} stroke="var(--text-muted)" stroke-width="1" />
        ))}
        {/* Spring */}
        <path d={springPath()} fill="none" stroke="#10B981" stroke-width="2" />
        {/* Mass */}
        <circle cx={massX()} cy={75} r={12 + mass()} fill="#10B981" opacity="0.85" />
        <text x={massX()} y={79} text-anchor="middle" font-size="9" font-weight="bold" fill="white">m</text>
        {/* Ground line */}
        <line x1="30" y1="110" x2="400" y2="110" stroke="var(--border)" stroke-width="1" stroke-dasharray="4 3" />
        {/* Equilibrium marker */}
        <line x1="210" y1="105" x2="210" y2="115" stroke="var(--text-muted)" stroke-width="1" />
        <text x="210" y="128" text-anchor="middle" font-size="8" fill="var(--text-muted)">x=0</text>
        {/* Symmetry label */}
        <text x="210" y="145" text-anchor="middle" font-size="9" font-weight="600"
          fill={broken() ? "#ef4444" : "#10B981"}>
          {broken() ? "∂L/∂t ≠ 0 → E not conserved" : "∂L/∂t = 0 → E conserved"}
        </text>
      </svg>

      {/* Energy plot */}
      <svg width="100%" height="120" viewBox="0 0 420 120" class="mx-auto">
        <text x="210" y="12" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)">Energy vs Time</text>
        <rect x="35" y="18" width="375" height="85" fill="none" stroke="var(--border)" stroke-width="0.5" />
        {/* Axes */}
        <line x1="35" y1="103" x2="410" y2="103" stroke="var(--border)" stroke-width="1" />
        <line x1="35" y1="18" x2="35" y2="103" stroke="var(--border)" stroke-width="1" />
        <text x="222" y="116" text-anchor="middle" font-size="7" fill="var(--text-muted)">time</text>
        {/* KE (blue) */}
        {history().length > 1 && (
          <path d={history().map((p, i) => {
            const px = 35 + (i / 300) * 375;
            const py = 103 - (p.ke / maxE()) * 82;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")} fill="none" stroke="#3b82f6" stroke-width="1.5" />
        )}
        {/* PE (red) */}
        {history().length > 1 && (
          <path d={history().map((p, i) => {
            const px = 35 + (i / 300) * 375;
            const py = 103 - (p.pe / maxE()) * 82;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")} fill="none" stroke="#ef4444" stroke-width="1.5" />
        )}
        {/* Total E (green dashed) */}
        {history().length > 1 && (
          <path d={history().map((p, i) => {
            const px = 35 + (i / 300) * 375;
            const py = 103 - (p.te / maxE()) * 82;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")} fill="none" stroke="#10B981" stroke-width="2" stroke-dasharray="5 3" />
        )}
        {/* Legend */}
        <line x1="50" y1="26" x2="65" y2="26" stroke="#3b82f6" stroke-width="2" />
        <text x="68" y="29" font-size="7" fill="#3b82f6">KE</text>
        <line x1="95" y1="26" x2="110" y2="26" stroke="#ef4444" stroke-width="2" />
        <text x="113" y="29" font-size="7" fill="#ef4444">PE</text>
        <line x1="140" y1="26" x2="155" y2="26" stroke="#10B981" stroke-width="2" stroke-dasharray="4 2" />
        <text x="158" y="29" font-size="7" fill="#10B981">Total E</text>
      </svg>

      {/* Stats */}
      <div class="grid grid-cols-4 gap-3">
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>KE</div>
          <div class="text-sm font-bold" style={{ color: "#3b82f6" }}>
            {history().length > 0 ? history()[history().length - 1].ke.toFixed(2) : "0.00"}
          </div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>PE</div>
          <div class="text-sm font-bold" style={{ color: "#ef4444" }}>
            {history().length > 0 ? history()[history().length - 1].pe.toFixed(2) : "0.00"}
          </div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Total E</div>
          <div class="text-sm font-bold" style={{ color: "#10B981" }}>
            {history().length > 0 ? history()[history().length - 1].te.toFixed(2) : "0.00"}
          </div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>k(t)</div>
          <div class="text-sm font-bold" style={{ color: broken() ? "#ef4444" : "var(--text-primary)" }}>
            {broken() ? (springK() * (1 + 0.3 * Math.sin(0.5 * time()))).toFixed(2) : springK().toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};


// ─── C8SpaceMomentum ───────────────────────────────────────────────────────
// Space translation symmetry → momentum conservation (elastic collision)
export const C8SpaceMomentum: Component = () => {
  const [m1, setM1] = createSignal(2);
  const [m2, setM2] = createSignal(3);
  const [v1Init, setV1Init] = createSignal(3);
  const [v2Init, setV2Init] = createSignal(-2);
  const [broken, setBroken] = createSignal(false);
  const [playing, setPlaying] = createSignal(false);
  const [time, setTime] = createSignal(0);
  const [history, setHistory] = createSignal<{ t: number; p1: number; p2: number; pt: number }[]>([]);

  let animFrame: number | undefined;
  const dt = 0.3;
  const ballR = 10;
  const xMin = 30;
  const xMax = 390;
  const hillCx = 210;
  const hillW = 40;

  const state = { x1: 0, x2: 0, v1: 0, v2: 0 };

  const reset = () => {
    setTime(0);
    setHistory([]);
    state.x1 = 100;
    state.x2 = 320;
    state.v1 = v1Init();
    state.v2 = v2Init();
    setPlaying(false);
    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = undefined;
  };

  reset();

  // Potential hill force: F = -dV/dx, V = V0 * exp(-(x-cx)^2 / (2*s^2))
  const hillForce = (x: number): number => {
    if (!broken()) return 0;
    const s = hillW / 2;
    const V0 = 2.5;
    return V0 * (x - hillCx) / (s * s) * Math.exp(-((x - hillCx) ** 2) / (2 * s * s));
  };

  const step = () => {
    const t = time();
    let { x1, x2, v1, v2 } = state;
    const ma = m1();
    const mb = m2();

    // Forces from potential hill
    const f1 = hillForce(x1);
    const f2 = hillForce(x2);
    v1 += (f1 / ma) * dt;
    v2 += (f2 / mb) * dt;

    x1 += v1 * dt;
    x2 += v2 * dt;

    // Ball-ball elastic collision
    if (x2 - x1 <= 2 * ballR && v1 > v2) {
      const newV1 = ((ma - mb) * v1 + 2 * mb * v2) / (ma + mb);
      const newV2 = ((mb - ma) * v2 + 2 * ma * v1) / (ma + mb);
      v1 = newV1;
      v2 = newV2;
    }

    // Wall bounces
    if (x1 < xMin + ballR) { x1 = xMin + ballR; v1 = Math.abs(v1); }
    if (x1 > xMax - ballR) { x1 = xMax - ballR; v1 = -Math.abs(v1); }
    if (x2 < xMin + ballR) { x2 = xMin + ballR; v2 = Math.abs(v2); }
    if (x2 > xMax - ballR) { x2 = xMax - ballR; v2 = -Math.abs(v2); }

    state.x1 = x1; state.x2 = x2; state.v1 = v1; state.v2 = v2;

    const p1 = ma * v1;
    const p2 = mb * v2;
    const pt = p1 + p2;
    const newT = t + dt;
    setTime(newT);
    setHistory((h) => {
      const next = [...h, { t: newT, p1, p2, pt }];
      return next.length > 300 ? next.slice(next.length - 300) : next;
    });
  };

  const animate = () => {
    step();
    animFrame = requestAnimationFrame(animate);
  };

  const togglePlay = () => {
    if (playing()) {
      if (animFrame) cancelAnimationFrame(animFrame);
      animFrame = undefined;
      setPlaying(false);
    } else {
      if (time() === 0) {
        state.x1 = 100; state.x2 = 320;
        state.v1 = v1Init(); state.v2 = v2Init();
      }
      setPlaying(true);
      animate();
    }
  };

  onCleanup(() => { if (animFrame) cancelAnimationFrame(animFrame); });

  const pRange = createMemo(() => {
    const h = history();
    if (h.length === 0) return 10;
    let mx = 0;
    for (const p of h) {
      mx = Math.max(mx, Math.abs(p.p1), Math.abs(p.p2), Math.abs(p.pt));
    }
    return Math.max(mx * 1.2, 1);
  });

  // Potential hill SVG path
  const hillPath = createMemo(() => {
    const pts: string[] = [];
    const s = hillW / 2;
    const V0 = 40; // visual height
    for (let i = 0; i <= 60; i++) {
      const x = hillCx - 60 + (i / 60) * 120;
      const y = 70 - V0 * Math.exp(-((x - hillCx) ** 2) / (2 * s * s));
      pts.push(`${i === 0 ? "M" : "L"}${x},${y}`);
    }
    pts.push(`L${hillCx + 60},70`);
    pts.push(`L${hillCx - 60},70`);
    pts.push("Z");
    return pts.join(" ");
  });

  return (
    <div class="space-y-5">
      {/* Controls */}
      <div class="grid grid-cols-2 gap-3">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>m₁ = {m1()}</label>
          <input type="range" min="1" max="5" step="0.5" value={m1()} onInput={(e) => { setM1(parseFloat(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #10B981 ${((m1() - 1) / 4) * 100}%, var(--border) ${((m1() - 1) / 4) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>m₂ = {m2()}</label>
          <input type="range" min="1" max="5" step="0.5" value={m2()} onInput={(e) => { setM2(parseFloat(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #10B981 ${((m2() - 1) / 4) * 100}%, var(--border) ${((m2() - 1) / 4) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>v₁ = {v1Init()}</label>
          <input type="range" min="1" max="5" step="0.5" value={v1Init()} onInput={(e) => { setV1Init(parseFloat(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #10B981 ${((v1Init() - 1) / 4) * 100}%, var(--border) ${((v1Init() - 1) / 4) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>v₂ = {v2Init()}</label>
          <input type="range" min="-5" max="-1" step="0.5" value={v2Init()} onInput={(e) => { setV2Init(parseFloat(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #10B981 ${((v2Init() + 5) / 4) * 100}%, var(--border) ${((v2Init() + 5) / 4) * 100}%)` }} />
        </div>
      </div>

      {/* Buttons */}
      <div class="flex items-center gap-3">
        <button onClick={togglePlay}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#10B981", color: "white" }}>
          {playing() ? "Pause" : "Play"}
        </button>
        <button onClick={reset}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
          Reset
        </button>
        <button onClick={() => setBroken(!broken())}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: broken() ? "#ef4444" : "var(--bg-secondary)", color: broken() ? "white" : "var(--text-primary)", border: broken() ? "none" : "1px solid var(--border)" }}>
          {broken() ? "Symmetry Broken" : "Break Symmetry"}
        </button>
      </div>

      {/* Balls SVG */}
      <svg width="100%" height="120" viewBox="0 0 420 120" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Elastic Collision</text>
        {/* Track */}
        <line x1={xMin} y1="75" x2={xMax} y2="75" stroke="var(--border)" stroke-width="1" />
        {/* Walls */}
        <line x1={xMin} y1="40" x2={xMin} y2="80" stroke="var(--text-muted)" stroke-width="2" />
        <line x1={xMax} y1="40" x2={xMax} y2="80" stroke="var(--text-muted)" stroke-width="2" />
        {/* Potential hill */}
        {broken() && (
          <path d={hillPath()} fill="#9ca3af" opacity="0.35" stroke="#6b7280" stroke-width="1" />
        )}
        {broken() && (
          <text x={hillCx} y="28" text-anchor="middle" font-size="7" fill="#6b7280">V(x)</text>
        )}
        {/* Ball 1 */}
        <circle cx={state.x1} cy={65} r={ballR} fill="#3b82f6" />
        <text x={state.x1} y={69} text-anchor="middle" font-size="8" font-weight="bold" fill="white">1</text>
        {/* Ball 2 */}
        <circle cx={state.x2} cy={65} r={ballR} fill="#ef4444" />
        <text x={state.x2} y={69} text-anchor="middle" font-size="8" font-weight="bold" fill="white">2</text>
        {/* Velocity arrows */}
        <line x1={state.x1 + ballR} y1={65} x2={state.x1 + ballR + state.v1 * 6} y2={65}
          stroke="#3b82f6" stroke-width="2" marker-end="url(#arrowBlue)" />
        <line x1={state.x2 - ballR} y1={65} x2={state.x2 - ballR + state.v2 * 6} y2={65}
          stroke="#ef4444" stroke-width="2" marker-end="url(#arrowRed)" />
        <defs>
          <marker id="arrowBlue" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <path d="M0,0 L6,2 L0,4" fill="#3b82f6" />
          </marker>
          <marker id="arrowRed" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <path d="M0,0 L6,2 L0,4" fill="#ef4444" />
          </marker>
        </defs>
        {/* Symmetry label */}
        <text x="210" y="108" text-anchor="middle" font-size="9" font-weight="600"
          fill={broken() ? "#ef4444" : "#10B981"}>
          {broken() ? "∂L/∂x ≠ 0 → p not conserved" : "∂L/∂x = 0 → p conserved"}
        </text>
      </svg>

      {/* Momentum plot */}
      <svg width="100%" height="120" viewBox="0 0 420 120" class="mx-auto">
        <text x="210" y="12" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)">Momentum vs Time</text>
        <rect x="35" y="18" width="375" height="85" fill="none" stroke="var(--border)" stroke-width="0.5" />
        <line x1="35" y1="60" x2="410" y2="60" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
        <line x1="35" y1="103" x2="410" y2="103" stroke="var(--border)" stroke-width="1" />
        <line x1="35" y1="18" x2="35" y2="103" stroke="var(--border)" stroke-width="1" />
        <text x="222" y="116" text-anchor="middle" font-size="7" fill="var(--text-muted)">time</text>
        {/* p1 (blue) */}
        {history().length > 1 && (
          <path d={history().map((p, i) => {
            const px = 35 + (i / 300) * 375;
            const py = 60 - (p.p1 / pRange()) * 40;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")} fill="none" stroke="#3b82f6" stroke-width="1.5" />
        )}
        {/* p2 (red) */}
        {history().length > 1 && (
          <path d={history().map((p, i) => {
            const px = 35 + (i / 300) * 375;
            const py = 60 - (p.p2 / pRange()) * 40;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")} fill="none" stroke="#ef4444" stroke-width="1.5" />
        )}
        {/* p_total (green dashed) */}
        {history().length > 1 && (
          <path d={history().map((p, i) => {
            const px = 35 + (i / 300) * 375;
            const py = 60 - (p.pt / pRange()) * 40;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")} fill="none" stroke="#10B981" stroke-width="2" stroke-dasharray="5 3" />
        )}
        {/* Legend */}
        <line x1="50" y1="26" x2="65" y2="26" stroke="#3b82f6" stroke-width="2" />
        <text x="68" y="29" font-size="7" fill="#3b82f6">p₁</text>
        <line x1="95" y1="26" x2="110" y2="26" stroke="#ef4444" stroke-width="2" />
        <text x="113" y="29" font-size="7" fill="#ef4444">p₂</text>
        <line x1="140" y1="26" x2="155" y2="26" stroke="#10B981" stroke-width="2" stroke-dasharray="4 2" />
        <text x="158" y="29" font-size="7" fill="#10B981">p_total</text>
      </svg>

      {/* Stats */}
      <div class="grid grid-cols-3 gap-3">
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>p₁</div>
          <div class="text-sm font-bold" style={{ color: "#3b82f6" }}>
            {history().length > 0 ? history()[history().length - 1].p1.toFixed(2) : "0.00"}
          </div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>p₂</div>
          <div class="text-sm font-bold" style={{ color: "#ef4444" }}>
            {history().length > 0 ? history()[history().length - 1].p2.toFixed(2) : "0.00"}
          </div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>p_total</div>
          <div class="text-sm font-bold" style={{ color: "#10B981" }}>
            {history().length > 0 ? history()[history().length - 1].pt.toFixed(2) : "0.00"}
          </div>
        </div>
      </div>
    </div>
  );
};


// ─── C8RotationAngular ─────────────────────────────────────────────────────
// Rotational symmetry → angular momentum conservation (Kepler orbit)
export const C8RotationAngular: Component = () => {
  const [r0, setR0] = createSignal(150);
  const [v0, setV0] = createSignal(3.5);
  const [broken, setBroken] = createSignal(false);
  const [playing, setPlaying] = createSignal(false);
  const [time, setTime] = createSignal(0);
  const [trail, setTrail] = createSignal<{ x: number; y: number }[]>([]);
  const [lHistory, setLHistory] = createSignal<{ t: number; L: number }[]>([]);

  let animFrame: number | undefined;
  const GM = 5000;
  const dt = 0.15;
  const cx = 210;
  const cy = 130;
  const perturbK = 0.08;
  const mass = 1;

  const state = { x: 0, y: 0, vx: 0, vy: 0 };

  const reset = () => {
    setTime(0);
    setTrail([]);
    setLHistory([]);
    state.x = r0();
    state.y = 0;
    state.vx = 0;
    state.vy = v0();
    setPlaying(false);
    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = undefined;
  };

  reset();

  const accel = (x: number, y: number): { ax: number; ay: number } => {
    const r2 = x * x + y * y;
    const r = Math.sqrt(r2);
    const r3 = r2 * r;
    // Central gravity
    let ax = -GM * x / r3;
    let ay = -GM * y / r3;
    // Non-central perturbation: F_perturb = -k * x * x_hat (breaks rotational symmetry)
    if (broken()) {
      ax -= perturbK * x;
    }
    return { ax, ay };
  };

  const step = () => {
    const t = time();
    let { x, y, vx, vy } = state;

    // Velocity-Verlet integration
    const { ax: ax0, ay: ay0 } = accel(x, y);
    x += vx * dt + 0.5 * ax0 * dt * dt;
    y += vy * dt + 0.5 * ay0 * dt * dt;
    const { ax: ax1, ay: ay1 } = accel(x, y);
    vx += 0.5 * (ax0 + ax1) * dt;
    vy += 0.5 * (ay0 + ay1) * dt;

    state.x = x; state.y = y; state.vx = vx; state.vy = vy;

    // Angular momentum L = m * (x*vy - y*vx)
    const L = mass * (x * vy - y * vx);
    const newT = t + dt;
    setTime(newT);

    setTrail((tr) => {
      const next = [...tr, { x, y }];
      return next.length > 600 ? next.slice(next.length - 600) : next;
    });
    setLHistory((h) => {
      const next = [...h, { t: newT, L }];
      return next.length > 300 ? next.slice(next.length - 300) : next;
    });
  };

  const animate = () => {
    for (let i = 0; i < 3; i++) step(); // sub-steps for smoother orbit
    animFrame = requestAnimationFrame(animate);
  };

  const togglePlay = () => {
    if (playing()) {
      if (animFrame) cancelAnimationFrame(animFrame);
      animFrame = undefined;
      setPlaying(false);
    } else {
      if (time() === 0) {
        state.x = r0(); state.y = 0;
        state.vx = 0; state.vy = v0();
      }
      setPlaying(true);
      animate();
    }
  };

  onCleanup(() => { if (animFrame) cancelAnimationFrame(animFrame); });

  const currentL = createMemo(() => {
    const h = lHistory();
    return h.length > 0 ? h[h.length - 1].L : 0;
  });

  const lRange = createMemo(() => {
    const h = lHistory();
    if (h.length === 0) return 100;
    let mx = 0;
    for (const p of h) mx = Math.max(mx, Math.abs(p.L));
    return Math.max(mx * 1.15, 1);
  });

  // Orbit trail path
  const trailPath = createMemo(() => {
    const tr = trail();
    if (tr.length < 2) return "";
    return tr.map((p, i) => {
      const px = cx + p.x * 0.6;
      const py = cy - p.y * 0.6;
      return `${i === 0 ? "M" : "L"}${px},${py}`;
    }).join(" ");
  });

  return (
    <div class="space-y-5">
      {/* Controls */}
      <div class="grid grid-cols-2 gap-3">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>r₀ = {r0()}</label>
          <input type="range" min="100" max="200" step="5" value={r0()} onInput={(e) => { setR0(parseFloat(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #10B981 ${((r0() - 100) / 100) * 100}%, var(--border) ${((r0() - 100) / 100) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>v₀ = {v0().toFixed(1)}</label>
          <input type="range" min="2" max="5" step="0.1" value={v0()} onInput={(e) => { setV0(parseFloat(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #10B981 ${((v0() - 2) / 3) * 100}%, var(--border) ${((v0() - 2) / 3) * 100}%)` }} />
        </div>
      </div>

      {/* Buttons */}
      <div class="flex items-center gap-3">
        <button onClick={togglePlay}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#10B981", color: "white" }}>
          {playing() ? "Pause" : "Play"}
        </button>
        <button onClick={reset}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
          Reset
        </button>
        <button onClick={() => setBroken(!broken())}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: broken() ? "#ef4444" : "var(--bg-secondary)", color: broken() ? "white" : "var(--text-primary)", border: broken() ? "none" : "1px solid var(--border)" }}>
          {broken() ? "Symmetry Broken" : "Break Symmetry"}
        </button>
      </div>

      {/* Orbit SVG */}
      <svg width="100%" height="250" viewBox="0 0 420 250" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Central Force Orbit</text>
        {/* Faint circular guide */}
        <circle cx={cx} cy={cy} r={r0() * 0.6} fill="none" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="4 4" />
        {/* Trail */}
        {trail().length > 1 && (
          <path d={trailPath()} fill="none" stroke="#10B981" stroke-width="1.2" opacity="0.45" />
        )}
        {/* Central body (star) */}
        <circle cx={cx} cy={cy} r={10} fill="#f59e0b" />
        <circle cx={cx} cy={cy} r={14} fill="none" stroke="#f59e0b" stroke-width="1" opacity="0.3" />
        {/* Orbiting body */}
        <circle cx={cx + state.x * 0.6} cy={cy - state.y * 0.6} r={7} fill="#3b82f6" />
        {/* Radius vector */}
        <line x1={cx} y1={cy} x2={cx + state.x * 0.6} y2={cy - state.y * 0.6}
          stroke="var(--text-muted)" stroke-width="0.5" stroke-dasharray="3 3" opacity="0.5" />
        {/* Perturbation indicator */}
        {broken() && (
          <>
            <line x1={cx - 100} y1={cy} x2={cx + 100} y2={cy} stroke="#ef4444" stroke-width="1.5" stroke-dasharray="6 3" opacity="0.3" />
            <text x={cx + 105} y={cy + 4} font-size="7" fill="#ef4444">F_x axis</text>
          </>
        )}
        {/* Symmetry label */}
        <text x="210" y="242" text-anchor="middle" font-size="9" font-weight="600"
          fill={broken() ? "#ef4444" : "#10B981"}>
          {broken() ? "∂L/∂φ ≠ 0 → L not conserved" : "∂L/∂φ = 0 → L conserved"}
        </text>
      </svg>

      {/* Angular momentum plot */}
      <svg width="100%" height="110" viewBox="0 0 420 110" class="mx-auto">
        <text x="210" y="12" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)">Angular Momentum |L| vs Time</text>
        <rect x="35" y="18" width="375" height="75" fill="none" stroke="var(--border)" stroke-width="0.5" />
        <line x1="35" y1="93" x2="410" y2="93" stroke="var(--border)" stroke-width="1" />
        <line x1="35" y1="18" x2="35" y2="93" stroke="var(--border)" stroke-width="1" />
        <text x="222" y="106" text-anchor="middle" font-size="7" fill="var(--text-muted)">time</text>
        {/* L plot */}
        {lHistory().length > 1 && (
          <path d={lHistory().map((p, i) => {
            const px = 35 + (i / 300) * 375;
            const py = 55 - (p.L / lRange()) * 35;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")} fill="none" stroke="#10B981" stroke-width="2" />
        )}
        {/* Legend */}
        <line x1="50" y1="26" x2="65" y2="26" stroke="#10B981" stroke-width="2" />
        <text x="68" y="29" font-size="7" fill="#10B981">L = r x p</text>
      </svg>

      {/* Stats */}
      <div class="grid grid-cols-3 gap-3">
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>|L|</div>
          <div class="text-sm font-bold" style={{ color: "#10B981" }}>
            {Math.abs(currentL()).toFixed(1)}
          </div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Distance r</div>
          <div class="text-sm font-bold" style={{ color: "#3b82f6" }}>
            {Math.sqrt(state.x * state.x + state.y * state.y).toFixed(1)}
          </div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Speed |v|</div>
          <div class="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            {Math.sqrt(state.vx * state.vx + state.vy * state.vy).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};
