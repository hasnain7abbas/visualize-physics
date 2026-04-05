import { Component, createSignal, createMemo, onCleanup } from "solid-js";

// ─── RK4 Double Pendulum Engine ────────────────────────────────────────────
// State vector: [θ₁, θ₂, ω₁, ω₂]
// Uses Lagrangian-derived equations of motion

type State = [number, number, number, number];

function doublePendulumDerivs(
  s: State,
  g: number,
  m1: number,
  m2: number,
  L1: number,
  L2: number
): State {
  const [th1, th2, w1, w2] = s;
  const delta = th1 - th2;
  const sinD = Math.sin(delta);
  const cosD = Math.cos(delta);
  const M = m1 + m2;

  const denom1 = M * L1 - m2 * L1 * cosD * cosD;
  const alpha1 =
    (m2 * L1 * w1 * w1 * sinD * cosD +
      m2 * g * Math.sin(th2) * cosD +
      m2 * L2 * w2 * w2 * sinD -
      M * g * Math.sin(th1)) /
    denom1;

  const denom2 = M * L2 - m2 * L2 * cosD * cosD;
  const alpha2 =
    (-(M) * (L1 * w1 * w1 * sinD + g * Math.sin(th2)) +
      M * g * Math.sin(th1) * cosD -
      m2 * L2 * w2 * w2 * sinD * cosD) /
    denom2;

  return [w1, w2, alpha1, alpha2];
}

function rk4Step(
  s: State,
  dt: number,
  g: number,
  m1: number,
  m2: number,
  L1: number,
  L2: number
): State {
  const add = (a: State, b: State, scale: number): State => [
    a[0] + b[0] * scale,
    a[1] + b[1] * scale,
    a[2] + b[2] * scale,
    a[3] + b[3] * scale,
  ];

  const k1 = doublePendulumDerivs(s, g, m1, m2, L1, L2);
  const k2 = doublePendulumDerivs(add(s, k1, dt / 2), g, m1, m2, L1, L2);
  const k3 = doublePendulumDerivs(add(s, k2, dt / 2), g, m1, m2, L1, L2);
  const k4 = doublePendulumDerivs(add(s, k3, dt), g, m1, m2, L1, L2);

  return [
    s[0] + (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    s[1] + (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    s[2] + (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
    s[3] + (dt / 6) * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]),
  ];
}

function totalEnergy(
  s: State,
  g: number,
  m1: number,
  m2: number,
  L1: number,
  L2: number
): number {
  const [th1, th2, w1, w2] = s;
  const T =
    0.5 * (m1 + m2) * L1 * L1 * w1 * w1 +
    0.5 * m2 * L2 * L2 * w2 * w2 +
    m2 * L1 * L2 * w1 * w2 * Math.cos(th1 - th2);
  const V =
    -(m1 + m2) * g * L1 * Math.cos(th1) -
    m2 * g * L2 * Math.cos(th2);
  return T + V;
}

const DEG = Math.PI / 180;

// ─── C2PendulumDynamics ────────────────────────────────────────────────────
// Animated double pendulum with trailing path of second bob
export const C2PendulumDynamics: Component = () => {
  const [L1, setL1] = createSignal(1.0);
  const [L2, setL2] = createSignal(1.0);
  const [m1, setM1] = createSignal(1.0);
  const [m2, setM2] = createSignal(1.0);
  const [initTh1, setInitTh1] = createSignal(120);
  const [initTh2, setInitTh2] = createSignal(90);

  const [state, setState] = createSignal<State>([120 * DEG, 90 * DEG, 0, 0]);
  const [trail, setTrail] = createSignal<[number, number][]>([]);
  const [running, setRunning] = createSignal(false);

  const g = 9.81;
  const dt = 0.01;
  const stepsPerFrame = 4;
  const maxTrail = 200;

  let animFrame: number | undefined;

  const pivotX = 210;
  const pivotY = 60;
  const scale = 70; // px per unit length

  const positions = createMemo(() => {
    const [th1, th2] = state();
    const x1 = pivotX + L1() * scale * Math.sin(th1);
    const y1 = pivotY + L1() * scale * Math.cos(th1);
    const x2 = x1 + L2() * scale * Math.sin(th2);
    const y2 = y1 + L2() * scale * Math.cos(th2);
    return { x1, y1, x2, y2 };
  });

  const energy = createMemo(() =>
    totalEnergy(state(), g, m1(), m2(), L1(), L2())
  );

  const step = () => {
    let s = state();
    for (let i = 0; i < stepsPerFrame; i++) {
      s = rk4Step(s, dt, g, m1(), m2(), L1(), L2());
    }
    setState(s);

    const pos = positions();
    setTrail((prev) => {
      const next = [...prev, [pos.x2, pos.y2] as [number, number]];
      return next.length > maxTrail ? next.slice(next.length - maxTrail) : next;
    });

    animFrame = requestAnimationFrame(step);
  };

  const start = () => {
    if (running()) return;
    setRunning(true);
    animFrame = requestAnimationFrame(step);
  };

  const pause = () => {
    setRunning(false);
    if (animFrame) cancelAnimationFrame(animFrame);
  };

  const reset = () => {
    pause();
    setState([initTh1() * DEG, initTh2() * DEG, 0, 0]);
    setTrail([]);
  };

  onCleanup(() => {
    if (animFrame) cancelAnimationFrame(animFrame);
  });

  // Build trail path string
  const trailPath = createMemo(() => {
    const pts = trail();
    if (pts.length < 2) return "";
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  });

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>L1 = {L1().toFixed(1)}</label>
          <input type="range" min="0.5" max="2" step="0.1" value={L1()} onInput={(e) => setL1(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #8B5CF6 ${((L1() - 0.5) / 1.5) * 100}%, var(--border) ${((L1() - 0.5) / 1.5) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>L2 = {L2().toFixed(1)}</label>
          <input type="range" min="0.5" max="2" step="0.1" value={L2()} onInput={(e) => setL2(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #8B5CF6 ${((L2() - 0.5) / 1.5) * 100}%, var(--border) ${((L2() - 0.5) / 1.5) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>m1 = {m1().toFixed(1)}</label>
          <input type="range" min="0.5" max="3" step="0.1" value={m1()} onInput={(e) => setM1(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #8B5CF6 ${((m1() - 0.5) / 2.5) * 100}%, var(--border) ${((m1() - 0.5) / 2.5) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>m2 = {m2().toFixed(1)}</label>
          <input type="range" min="0.5" max="3" step="0.1" value={m2()} onInput={(e) => setM2(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #8B5CF6 ${((m2() - 0.5) / 2.5) * 100}%, var(--border) ${((m2() - 0.5) / 2.5) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>th1 = {initTh1()}deg</label>
          <input type="range" min="0" max="180" step="1" value={initTh1()} onInput={(e) => setInitTh1(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #8B5CF6 ${(initTh1() / 180) * 100}%, var(--border) ${(initTh1() / 180) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>th2 = {initTh2()}deg</label>
          <input type="range" min="0" max="180" step="1" value={initTh2()} onInput={(e) => setInitTh2(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #8B5CF6 ${(initTh2() / 180) * 100}%, var(--border) ${(initTh2() / 180) * 100}%)` }} />
        </div>
      </div>

      <div class="flex gap-3 justify-center">
        <button onClick={start} disabled={running()}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#8B5CF6", color: "white", opacity: running() ? 0.5 : 1 }}>
          Play
        </button>
        <button onClick={pause}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#8B5CF6", color: "white" }}>
          Pause
        </button>
        <button onClick={reset}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
          Reset
        </button>
      </div>

      <svg width="100%" height="300" viewBox="0 0 420 300" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Double Pendulum</text>

        {/* Pivot mount */}
        <circle cx={pivotX} cy={pivotY} r="4" fill="var(--text-muted)" />

        {/* Fading trail of bob 2 */}
        {trail().length >= 2 && (
          <defs>
            <linearGradient id="trailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.05" />
              <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.8" />
            </linearGradient>
          </defs>
        )}
        {trail().length >= 2 &&
          trail().map((pt, i) => {
            if (i === 0) return null;
            const prev = trail()[i - 1];
            const opacity = ((i / trail().length) * 0.8 + 0.05).toFixed(2);
            return (
              <line
                x1={prev[0]} y1={prev[1]}
                x2={pt[0]} y2={pt[1]}
                stroke="#8B5CF6"
                stroke-width="1.5"
                opacity={opacity}
              />
            );
          })
        }

        {/* Rod 1 */}
        <line x1={pivotX} y1={pivotY} x2={positions().x1} y2={positions().y1}
          stroke="var(--text-primary)" stroke-width="2.5" stroke-linecap="round" />

        {/* Rod 2 */}
        <line x1={positions().x1} y1={positions().y1} x2={positions().x2} y2={positions().y2}
          stroke="var(--text-primary)" stroke-width="2.5" stroke-linecap="round" />

        {/* Bob 1 */}
        <circle cx={positions().x1} cy={positions().y1} r={5 + m1() * 2} fill="#8B5CF6" opacity="0.9" />

        {/* Bob 2 */}
        <circle cx={positions().x2} cy={positions().y2} r={5 + m2() * 2} fill="#EC4899" opacity="0.9" />
      </svg>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>theta 1</div>
          <div class="text-lg font-bold" style={{ color: "#8B5CF6" }}>{((state()[0] / DEG) % 360).toFixed(1)}deg</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>theta 2</div>
          <div class="text-lg font-bold" style={{ color: "#EC4899" }}>{((state()[1] / DEG) % 360).toFixed(1)}deg</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Energy E</div>
          <div class="text-lg font-bold" style={{ color: "#8B5CF6" }}>{energy().toFixed(2)} J</div>
        </div>
      </div>
    </div>
  );
};

// ─── C2PhaseSpace ──────────────────────────────────────────────────────────
// Phase portrait: theta_1 vs omega_1 of the double pendulum
export const C2PhaseSpace: Component = () => {
  const [initTh1, setInitTh1] = createSignal(120);
  const [gravity, setGravity] = createSignal(9.81);

  const [trace, setTrace] = createSignal<[number, number][]>([]);
  const [running, setRunning] = createSignal(false);
  const [frameCount, setFrameCount] = createSignal(0);

  const L1 = 1.0;
  const L2 = 1.0;
  const m1 = 1.0;
  const m2 = 1.0;
  const dt = 0.01;
  const stepsPerFrame = 4;
  const maxPoints = 2000;

  let stateRef: State = [120 * DEG, 90 * DEG, 0, 0];
  let animFrame: number | undefined;

  // Phase space plot bounds
  const thRange = Math.PI; // -pi to pi
  const wRange = 12; // -12 to 12 rad/s

  const plotX = 40;
  const plotY = 20;
  const plotW = 360;
  const plotH = 230;

  const toSvg = (th: number, w: number): [number, number] => {
    const x = plotX + ((th + thRange) / (2 * thRange)) * plotW;
    const y = plotY + ((wRange - w) / (2 * wRange)) * plotH;
    return [x, y];
  };

  const step = () => {
    for (let i = 0; i < stepsPerFrame; i++) {
      stateRef = rk4Step(stateRef, dt, gravity(), m1, m2, L1, L2);
    }

    // Wrap theta_1 to [-pi, pi]
    let th1 = stateRef[0];
    th1 = ((th1 + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;

    const w1 = stateRef[2];
    const pt: [number, number] = toSvg(th1, w1);

    setTrace((prev) => {
      const next = [...prev, pt];
      return next.length > maxPoints ? next.slice(next.length - maxPoints) : next;
    });
    setFrameCount((c) => c + 1);

    animFrame = requestAnimationFrame(step);
  };

  const startRun = () => {
    if (running()) return;
    stateRef = [initTh1() * DEG, (initTh1() * 0.75) * DEG, 0, 0];
    setTrace([]);
    setFrameCount(0);
    setRunning(true);
    animFrame = requestAnimationFrame(step);
  };

  const resetTrace = () => {
    setRunning(false);
    if (animFrame) cancelAnimationFrame(animFrame);
    setTrace([]);
    setFrameCount(0);
  };

  onCleanup(() => {
    if (animFrame) cancelAnimationFrame(animFrame);
  });

  // Grid lines
  const gridLinesX = [-Math.PI, -Math.PI / 2, 0, Math.PI / 2, Math.PI];
  const gridLabelsX = ["-pi", "-pi/2", "0", "pi/2", "pi"];
  const gridLinesY = [-10, -5, 0, 5, 10];

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "70px" }}>th1 = {initTh1()}deg</label>
          <input type="range" min="10" max="175" step="1" value={initTh1()} onInput={(e) => setInitTh1(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #8B5CF6 ${((initTh1() - 10) / 165) * 100}%, var(--border) ${((initTh1() - 10) / 165) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "70px" }}>g = {gravity().toFixed(1)}</label>
          <input type="range" min="1" max="20" step="0.5" value={gravity()} onInput={(e) => setGravity(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #8B5CF6 ${((gravity() - 1) / 19) * 100}%, var(--border) ${((gravity() - 1) / 19) * 100}%)` }} />
        </div>
      </div>

      <div class="flex gap-3 justify-center">
        <button onClick={startRun}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#8B5CF6", color: "white" }}>
          Run
        </button>
        <button onClick={resetTrace}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
          Reset
        </button>
      </div>

      <svg width="100%" height="290" viewBox="0 0 420 290" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Phase Space (theta_1 vs omega_1)</text>

        {/* Background */}
        <rect x={plotX} y={plotY} width={plotW} height={plotH} fill="var(--bg-secondary)" rx="4" />

        {/* Grid lines - vertical */}
        {gridLinesX.map((th, i) => {
          const sx = plotX + ((th + thRange) / (2 * thRange)) * plotW;
          return (
            <>
              <line x1={sx} y1={plotY} x2={sx} y2={plotY + plotH}
                stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
              <text x={sx} y={plotY + plotH + 12} text-anchor="middle" font-size="7" fill="var(--text-muted)">{gridLabelsX[i]}</text>
            </>
          );
        })}

        {/* Grid lines - horizontal */}
        {gridLinesY.map((w) => {
          const sy = plotY + ((wRange - w) / (2 * wRange)) * plotH;
          return (
            <>
              <line x1={plotX} y1={sy} x2={plotX + plotW} y2={sy}
                stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
              <text x={plotX - 4} y={sy + 3} text-anchor="end" font-size="7" fill="var(--text-muted)">{w}</text>
            </>
          );
        })}

        {/* Axis labels */}
        <text x={plotX + plotW / 2} y={plotY + plotH + 24} text-anchor="middle" font-size="8" fill="var(--text-muted)">theta_1 (rad)</text>
        <text x="12" y={plotY + plotH / 2} text-anchor="middle" font-size="8" fill="var(--text-muted)"
          transform={`rotate(-90, 12, ${plotY + plotH / 2})`}>omega_1 (rad/s)</text>

        {/* Trace colored by time: segments with varying color */}
        {trace().length >= 2 &&
          trace().map((pt, i) => {
            if (i === 0) return null;
            const prev = trace()[i - 1];
            // Skip if points are far apart (wrapping artifact)
            if (Math.abs(prev[0] - pt[0]) > plotW * 0.5) return null;
            const t = i / trace().length;
            const opacity = (0.15 + t * 0.85).toFixed(2);
            // Interpolate from muted (#a78bfa) to bright (#8B5CF6)
            return (
              <line
                x1={prev[0]} y1={prev[1]}
                x2={pt[0]} y2={pt[1]}
                stroke="#8B5CF6"
                stroke-width="1.5"
                opacity={opacity}
              />
            );
          })
        }

        {/* Current position dot */}
        {trace().length > 0 && (
          <circle
            cx={trace()[trace().length - 1][0]}
            cy={trace()[trace().length - 1][1]}
            r="3" fill="#EC4899"
          />
        )}
      </svg>

      <div class="grid grid-cols-2 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Points Traced</div>
          <div class="text-lg font-bold" style={{ color: "#8B5CF6" }}>{trace().length}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Sim Time</div>
          <div class="text-lg font-bold" style={{ color: "#8B5CF6" }}>{(frameCount() * stepsPerFrame * dt).toFixed(1)} s</div>
        </div>
      </div>
    </div>
  );
};

// ─── C2ChaosLyapunov ──────────────────────────────────────────────────────
// Two pendulums side by side showing sensitivity to initial conditions
export const C2ChaosLyapunov: Component = () => {
  const [initTh1, setInitTh1] = createSignal(120);
  const [running, setRunning] = createSignal(false);
  const [time, setTime] = createSignal(0);

  const L1 = 1.0;
  const L2 = 1.0;
  const m1 = 1.0;
  const m2 = 1.0;
  const g = 9.81;
  const dt = 0.01;
  const stepsPerFrame = 4;
  const epsilon = 0.001; // rad difference

  let stateA: State = [120 * DEG, 90 * DEG, 0, 0];
  let stateB: State = [120 * DEG + epsilon, 90 * DEG, 0, 0];
  let animFrame: number | undefined;

  const [posA, setPosA] = createSignal({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const [posB, setPosB] = createSignal({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const [divergence, setDivergence] = createSignal<[number, number][]>([]);

  const pivotX = 210;
  const pivotY = 50;
  const scale = 60;

  const calcPos = (s: State) => {
    const [th1, th2] = s;
    const x1 = pivotX + L1 * scale * Math.sin(th1);
    const y1 = pivotY + L1 * scale * Math.cos(th1);
    const x2 = x1 + L2 * scale * Math.sin(th2);
    const y2 = y1 + L2 * scale * Math.cos(th2);
    return { x1, y1, x2, y2 };
  };

  const currentDivergence = createMemo(() => {
    const dth1 = Math.abs(stateA[0] - stateB[0]);
    const dth2 = Math.abs(stateA[1] - stateB[1]);
    return Math.sqrt(dth1 * dth1 + dth2 * dth2);
  });

  const step = () => {
    for (let i = 0; i < stepsPerFrame; i++) {
      stateA = rk4Step(stateA, dt, g, m1, m2, L1, L2);
      stateB = rk4Step(stateB, dt, g, m1, m2, L1, L2);
    }

    setPosA(calcPos(stateA));
    setPosB(calcPos(stateB));

    const t = time() + stepsPerFrame * dt;
    setTime(t);

    const dth1 = Math.abs(stateA[0] - stateB[0]);
    const dth2 = Math.abs(stateA[1] - stateB[1]);
    const div = Math.sqrt(dth1 * dth1 + dth2 * dth2);

    setDivergence((prev) => {
      const next = [...prev, [t, div] as [number, number]];
      return next.length > 500 ? next.slice(next.length - 500) : next;
    });

    animFrame = requestAnimationFrame(step);
  };

  const startDemo = () => {
    if (running()) return;
    const th1Rad = initTh1() * DEG;
    const th2Rad = (initTh1() * 0.75) * DEG;
    stateA = [th1Rad, th2Rad, 0, 0];
    stateB = [th1Rad + epsilon, th2Rad, 0, 0];
    setPosA(calcPos(stateA));
    setPosB(calcPos(stateB));
    setDivergence([]);
    setTime(0);
    setRunning(true);
    animFrame = requestAnimationFrame(step);
  };

  const stopDemo = () => {
    setRunning(false);
    if (animFrame) cancelAnimationFrame(animFrame);
  };

  const resetDemo = () => {
    stopDemo();
    const th1Rad = initTh1() * DEG;
    const th2Rad = (initTh1() * 0.75) * DEG;
    stateA = [th1Rad, th2Rad, 0, 0];
    stateB = [th1Rad + epsilon, th2Rad, 0, 0];
    setPosA(calcPos(stateA));
    setPosB(calcPos(stateB));
    setDivergence([]);
    setTime(0);
  };

  onCleanup(() => {
    if (animFrame) cancelAnimationFrame(animFrame);
  });

  // Initialize positions
  setPosA(calcPos(stateA));
  setPosB(calcPos(stateB));

  // Divergence plot layout
  const divPlotX = 30;
  const divPlotY = 10;
  const divPlotW = 360;
  const divPlotH = 80;

  const divPath = createMemo(() => {
    const pts = divergence();
    if (pts.length < 2) return "";
    const maxT = Math.max(pts[pts.length - 1][0], 1);
    // Log scale: map log10(div) to y. Clamp min to -6 (1e-6), max to 2 (100)
    const logMin = -4;
    const logMax = 1.5;

    return pts.map((p, i) => {
      const x = divPlotX + (p[0] / maxT) * divPlotW;
      const logVal = Math.log10(Math.max(p[1], 1e-8));
      const clamped = Math.max(logMin, Math.min(logMax, logVal));
      const y = divPlotY + divPlotH - ((clamped - logMin) / (logMax - logMin)) * divPlotH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  });

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "70px" }}>th1 = {initTh1()}deg</label>
        <input type="range" min="30" max="170" step="1" value={initTh1()} onInput={(e) => setInitTh1(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #8B5CF6 ${((initTh1() - 30) / 140) * 100}%, var(--border) ${((initTh1() - 30) / 140) * 100}%)` }} />
      </div>

      <div class="flex gap-3 justify-center">
        <button onClick={startDemo}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#8B5CF6", color: "white" }}>
          Start Chaos Demo
        </button>
        <button onClick={stopDemo}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
          Stop
        </button>
        <button onClick={resetDemo}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
          Reset
        </button>
      </div>

      {/* Both pendulums in same SVG */}
      <svg width="100%" height="220" viewBox="0 0 420 220" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Chaos: delta(theta_1) = 0.001 rad
        </text>

        {/* Pivot */}
        <circle cx={pivotX} cy={pivotY} r="4" fill="var(--text-muted)" />

        {/* Pendulum B (pink, drawn first so A overlays) */}
        <line x1={pivotX} y1={pivotY} x2={posB().x1} y2={posB().y1}
          stroke="#EC4899" stroke-width="2" stroke-linecap="round" opacity="0.7" />
        <line x1={posB().x1} y1={posB().y1} x2={posB().x2} y2={posB().y2}
          stroke="#EC4899" stroke-width="2" stroke-linecap="round" opacity="0.7" />
        <circle cx={posB().x1} cy={posB().y1} r="5" fill="#EC4899" opacity="0.6" />
        <circle cx={posB().x2} cy={posB().y2} r="5" fill="#EC4899" opacity="0.6" />

        {/* Pendulum A (purple) */}
        <line x1={pivotX} y1={pivotY} x2={posA().x1} y2={posA().y1}
          stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round" />
        <line x1={posA().x1} y1={posA().y1} x2={posA().x2} y2={posA().y2}
          stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round" />
        <circle cx={posA().x1} cy={posA().y1} r="6" fill="#8B5CF6" opacity="0.9" />
        <circle cx={posA().x2} cy={posA().y2} r="6" fill="#8B5CF6" opacity="0.9" />

        {/* Legend */}
        <circle cx="30" cy="210" r="4" fill="#8B5CF6" />
        <text x="38" y="213" font-size="8" fill="var(--text-muted)">Pendulum A</text>
        <circle cx="120" cy="210" r="4" fill="#EC4899" />
        <text x="128" y="213" font-size="8" fill="var(--text-muted)">Pendulum B (+0.001 rad)</text>
      </svg>

      {/* Divergence log plot */}
      <svg width="100%" height="110" viewBox="0 0 420 110" class="mx-auto">
        <text x="210" y="10" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)">
          |delta theta| (log scale)
        </text>

        <rect x={divPlotX} y={divPlotY} width={divPlotW} height={divPlotH} fill="var(--bg-secondary)" rx="3" />

        {/* Horizontal grid lines with log labels */}
        {[-4, -3, -2, -1, 0, 1].map((logVal) => {
          const logMin = -4;
          const logMax = 1.5;
          const y = divPlotY + divPlotH - ((logVal - logMin) / (logMax - logMin)) * divPlotH;
          return (
            <>
              <line x1={divPlotX} y1={y} x2={divPlotX + divPlotW} y2={y}
                stroke="var(--border)" stroke-width="0.5" stroke-dasharray="2 2" />
              <text x={divPlotX - 3} y={y + 3} text-anchor="end" font-size="6" fill="var(--text-muted)">
                {"1e" + logVal}
              </text>
            </>
          );
        })}

        {/* Divergence trace */}
        {divPath() && (
          <path d={divPath()} fill="none" stroke="#f59e0b" stroke-width="1.5" />
        )}

        <text x={divPlotX + divPlotW / 2} y={divPlotY + divPlotH + 12} text-anchor="middle" font-size="7" fill="var(--text-muted)">Time (s)</text>
      </svg>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Time</div>
          <div class="text-lg font-bold" style={{ color: "#8B5CF6" }}>{time().toFixed(1)} s</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>|delta theta|</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>
            {divergence().length > 0
              ? divergence()[divergence().length - 1][1].toExponential(2)
              : (0).toExponential(2)}
          </div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Initial Diff</div>
          <div class="text-lg font-bold" style={{ color: "#EC4899" }}>0.001 rad</div>
        </div>
      </div>
    </div>
  );
};
