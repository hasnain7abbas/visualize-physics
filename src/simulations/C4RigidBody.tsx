import { Component, createSignal, createMemo, onCleanup } from "solid-js";

// ── Shared math utilities ──────────────────────────────────────────

type Vec3 = [number, number, number];
type Mat3 = [Vec3, Vec3, Vec3];

const identity3 = (): Mat3 => [[1,0,0],[0,1,0],[0,0,1]];

const matMul = (A: Mat3, B: Mat3): Mat3 => {
  const C: Mat3 = [[0,0,0],[0,0,0],[0,0,0]];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      for (let k = 0; k < 3; k++)
        C[i][j] += A[i][k] * B[k][j];
  return C;
};

const matVec = (A: Mat3, v: Vec3): Vec3 => [
  A[0][0]*v[0]+A[0][1]*v[1]+A[0][2]*v[2],
  A[1][0]*v[0]+A[1][1]*v[1]+A[1][2]*v[2],
  A[2][0]*v[0]+A[2][1]*v[1]+A[2][2]*v[2],
];

const matAdd = (A: Mat3, B: Mat3): Mat3 => {
  const C: Mat3 = [[0,0,0],[0,0,0],[0,0,0]];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      C[i][j] = A[i][j] + B[i][j];
  return C;
};

const matScale = (A: Mat3, s: number): Mat3 => {
  const C: Mat3 = [[0,0,0],[0,0,0],[0,0,0]];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      C[i][j] = A[i][j] * s;
  return C;
};

// Skew-symmetric matrix [omega]x
const skew = (w: Vec3): Mat3 => [
  [0, -w[2], w[1]],
  [w[2], 0, -w[0]],
  [-w[1], w[0], 0],
];

// Gram-Schmidt re-orthonormalization
const reorthonormalize = (R: Mat3): Mat3 => {
  const norm = (v: Vec3): Vec3 => {
    const n = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]) || 1;
    return [v[0]/n, v[1]/n, v[2]/n];
  };
  const dot = (a: Vec3, b: Vec3) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const sub = (a: Vec3, b: Vec3): Vec3 => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
  const scale = (a: Vec3, s: number): Vec3 => [a[0]*s, a[1]*s, a[2]*s];
  const cross = (a: Vec3, b: Vec3): Vec3 => [
    a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]
  ];
  const e1 = norm(R[0]);
  let e2 = sub(R[1], scale(e1, dot(R[1], e1)));
  e2 = norm(e2);
  const e3 = norm(cross(e1, e2));
  return [e1, e2, e3];
};

// Euler equations: torque-free rigid body
const eulerDeriv = (w: Vec3, I: Vec3): Vec3 => [
  (I[1] - I[2]) * w[1] * w[2] / I[0],
  (I[2] - I[0]) * w[2] * w[0] / I[1],
  (I[0] - I[1]) * w[0] * w[1] / I[2],
];

// RK4 step for omega
const rk4Omega = (w: Vec3, I: Vec3, dt: number): Vec3 => {
  const k1 = eulerDeriv(w, I);
  const w2: Vec3 = [w[0]+k1[0]*dt/2, w[1]+k1[1]*dt/2, w[2]+k1[2]*dt/2];
  const k2 = eulerDeriv(w2, I);
  const w3: Vec3 = [w[0]+k2[0]*dt/2, w[1]+k2[1]*dt/2, w[2]+k2[2]*dt/2];
  const k3 = eulerDeriv(w3, I);
  const w4: Vec3 = [w[0]+k3[0]*dt, w[1]+k3[1]*dt, w[2]+k3[2]*dt];
  const k4 = eulerDeriv(w4, I);
  return [
    w[0] + (k1[0]+2*k2[0]+2*k3[0]+k4[0])*dt/6,
    w[1] + (k1[1]+2*k2[1]+2*k3[1]+k4[1])*dt/6,
    w[2] + (k1[2]+2*k2[2]+2*k3[2]+k4[2])*dt/6,
  ];
};

// RK4 step for rotation matrix: dR/dt = R * skew(omega)
const rk4Rotation = (R: Mat3, w: Vec3, I: Vec3, dt: number): Mat3 => {
  // We integrate R and omega together
  const dRdt = (Rc: Mat3, wc: Vec3): Mat3 => matMul(Rc, skew(wc));

  const k1R = dRdt(R, w);
  const k1w = eulerDeriv(w, I);

  const R2 = matAdd(R, matScale(k1R, dt/2));
  const w2: Vec3 = [w[0]+k1w[0]*dt/2, w[1]+k1w[1]*dt/2, w[2]+k1w[2]*dt/2];
  const k2R = dRdt(R2, w2);
  const k2w = eulerDeriv(w2, I);

  const R3 = matAdd(R, matScale(k2R, dt/2));
  const w3: Vec3 = [w[0]+k2w[0]*dt/2, w[1]+k2w[1]*dt/2, w[2]+k2w[2]*dt/2];
  const k3R = dRdt(R3, w3);
  const k3w = eulerDeriv(w3, I);

  const R4 = matAdd(R, matScale(k3R, dt));
  const w4: Vec3 = [w[0]+k3w[0]*dt, w[1]+k3w[1]*dt, w[2]+k3w[2]*dt];
  const k4R = dRdt(R4, w4);

  const Rnew = matAdd(R, matScale(matAdd(matAdd(k1R, matScale(k2R, 2)), matAdd(matScale(k3R, 2), k4R)), dt/6));
  return reorthonormalize(Rnew);
};

// Simple perspective projection
function project(x: number, y: number, z: number, R: Mat3, cx: number, cy: number, sc: number) {
  // R is body-to-world rotation (rows are body axes in world frame)
  // We transpose to get world-from-body
  const rx = R[0][0]*x + R[1][0]*y + R[2][0]*z;
  const ry = R[0][1]*x + R[1][1]*y + R[2][1]*z;
  const rz = R[0][2]*x + R[1][2]*y + R[2][2]*z;
  const d = 400;
  const scale = d / (d + rz) * sc;
  return { px: cx + rx * scale, py: cy - ry * scale, depth: rz };
}

// Box edges: 12 edges of a rectangular prism
function getBoxEdges(hx: number, hy: number, hz: number): [Vec3, Vec3][] {
  const corners: Vec3[] = [];
  for (const sx of [-1, 1])
    for (const sy of [-1, 1])
      for (const sz of [-1, 1])
        corners.push([sx * hx, sy * hy, sz * hz]);
  // edges connect corners that differ in exactly one coordinate
  const edges: [Vec3, Vec3][] = [];
  for (let i = 0; i < 8; i++)
    for (let j = i + 1; j < 8; j++) {
      let diffs = 0;
      if (corners[i][0] !== corners[j][0]) diffs++;
      if (corners[i][1] !== corners[j][1]) diffs++;
      if (corners[i][2] !== corners[j][2]) diffs++;
      if (diffs === 1) edges.push([corners[i], corners[j]]);
    }
  return edges;
}


// ════════════════════════════════════════════════════════════════════
// C4EulerEquations
// ════════════════════════════════════════════════════════════════════

export const C4EulerEquations: Component = () => {
  const [I1, setI1] = createSignal(2);
  const [I2, setI2] = createSignal(4);
  const [I3, setI3] = createSignal(6);
  const [w1Init, setW1Init] = createSignal(3.0);
  const [w2Init, setW2Init] = createSignal(0.5);
  const [w3Init, setW3Init] = createSignal(0.2);
  const [omega, setOmega] = createSignal<Vec3>([3.0, 0.5, 0.2]);
  const [rot, setRot] = createSignal<Mat3>(identity3());
  const [running, setRunning] = createSignal(false);

  let intervalId: number | undefined;
  const dt = 0.005;
  const stepsPerFrame = 4;

  const kineticEnergy = createMemo(() => {
    const w = omega();
    return 0.5 * (I1() * w[0]*w[0] + I2() * w[1]*w[1] + I3() * w[2]*w[2]);
  });

  const angMomentumMag = createMemo(() => {
    const w = omega();
    const L1 = I1() * w[0], L2 = I2() * w[1], L3 = I3() * w[2];
    return Math.sqrt(L1*L1 + L2*L2 + L3*L3);
  });

  const step = () => {
    let w = omega();
    let R = rot();
    const I: Vec3 = [I1(), I2(), I3()];
    for (let i = 0; i < stepsPerFrame; i++) {
      R = rk4Rotation(R, w, I, dt);
      w = rk4Omega(w, I, dt);
    }
    setOmega(w);
    setRot(R);
  };

  const play = () => {
    if (running()) return;
    setRunning(true);
    intervalId = window.setInterval(step, 16);
  };

  const pause = () => {
    setRunning(false);
    if (intervalId !== undefined) { clearInterval(intervalId); intervalId = undefined; }
  };

  const reset = () => {
    pause();
    setOmega([w1Init(), w2Init(), w3Init()]);
    setRot(identity3());
  };

  onCleanup(() => { if (intervalId !== undefined) clearInterval(intervalId); });

  // Box half-dimensions proportional to 1/sqrt(I)
  const hx = createMemo(() => 60 / Math.sqrt(I1()));
  const hy = createMemo(() => 60 / Math.sqrt(I2()));
  const hz = createMemo(() => 60 / Math.sqrt(I3()));

  const edges = createMemo(() => getBoxEdges(hx(), hy(), hz()));

  const projectedEdges = createMemo(() => {
    const R = rot();
    return edges().map(([a, b]) => {
      const pa = project(a[0], a[1], a[2], R, 210, 150, 1.8);
      const pb = project(b[0], b[1], b[2], R, 210, 150, 1.8);
      const avgDepth = (pa.depth + pb.depth) / 2;
      return { x1: pa.px, y1: pa.py, x2: pb.px, y2: pb.py, depth: avgDepth };
    }).sort((a, b) => a.depth - b.depth);
  });

  // Projected body axes for visualization
  const projectedAxes = createMemo(() => {
    const R = rot();
    const len = 50;
    return [
      { ...project(len, 0, 0, R, 210, 150, 1.8), color: "#ef4444", label: "1" },
      { ...project(0, len, 0, R, 210, 150, 1.8), color: "#22c55e", label: "2" },
      { ...project(0, 0, len, R, 210, 150, 1.8), color: "#3b82f6", label: "3" },
    ];
  });

  const sliderBg = (val: number, min: number, max: number) =>
    `linear-gradient(to right, #D946EF ${((val - min) / (max - min)) * 100}%, var(--border) ${((val - min) / (max - min)) * 100}%)`;

  return (
    <div class="space-y-5">
      {/* Moment of inertia sliders */}
      <div class="grid grid-cols-3 gap-3">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "48px" }}>I₁={I1()}</label>
          <input type="range" min="1" max="10" step="0.5" value={I1()} onInput={e => setI1(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{ background: sliderBg(I1(), 1, 10) }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "48px" }}>I₂={I2()}</label>
          <input type="range" min="1" max="10" step="0.5" value={I2()} onInput={e => setI2(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{ background: sliderBg(I2(), 1, 10) }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "48px" }}>I₃={I3()}</label>
          <input type="range" min="1" max="10" step="0.5" value={I3()} onInput={e => setI3(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{ background: sliderBg(I3(), 1, 10) }} />
        </div>
      </div>

      {/* Initial omega sliders */}
      <div class="grid grid-cols-3 gap-3">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "52px" }}>w₁={w1Init().toFixed(1)}</label>
          <input type="range" min="-5" max="5" step="0.1" value={w1Init()} onInput={e => setW1Init(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{ background: sliderBg(w1Init(), -5, 5) }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "52px" }}>w₂={w2Init().toFixed(1)}</label>
          <input type="range" min="-5" max="5" step="0.1" value={w2Init()} onInput={e => setW2Init(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{ background: sliderBg(w2Init(), -5, 5) }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "52px" }}>w₃={w3Init().toFixed(1)}</label>
          <input type="range" min="-5" max="5" step="0.1" value={w3Init()} onInput={e => setW3Init(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{ background: sliderBg(w3Init(), -5, 5) }} />
        </div>
      </div>

      {/* 3D wireframe SVG */}
      <svg width="100%" height="300" viewBox="0 0 420 300" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Torque-Free Rigid Body Rotation</text>

        {/* Wireframe box edges */}
        {projectedEdges().map(e => {
          const opacity = 0.35 + 0.65 * Math.max(0, Math.min(1, (e.depth + 80) / 160));
          return (
            <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
              stroke="#D946EF" stroke-width="2" opacity={opacity} />
          );
        })}

        {/* Body axes */}
        {projectedAxes().map(a => (
          <>
            <line x1={210} y1={150} x2={a.px} y2={a.py} stroke={a.color} stroke-width="1.5" stroke-dasharray="4 3" opacity="0.7" />
            <text x={a.px} y={a.py - 5} text-anchor="middle" font-size="8" font-weight="bold" fill={a.color}>e{a.label}</text>
          </>
        ))}
      </svg>

      {/* Controls */}
      <div class="flex justify-center gap-2">
        <button onClick={play} disabled={running()}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: running() ? "var(--bg-secondary)" : "#D946EF", color: running() ? "var(--text-muted)" : "white" }}>
          Play
        </button>
        <button onClick={pause}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Pause
        </button>
        <button onClick={reset}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Reset
        </button>
      </div>

      {/* Stats */}
      <div class="grid grid-cols-5 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>w1</div>
          <div class="text-lg font-bold" style={{ color: "#ef4444" }}>{omega()[0].toFixed(2)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>w2</div>
          <div class="text-lg font-bold" style={{ color: "#22c55e" }}>{omega()[1].toFixed(2)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>w3</div>
          <div class="text-lg font-bold" style={{ color: "#3b82f6" }}>{omega()[2].toFixed(2)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Energy T</div>
          <div class="text-lg font-bold" style={{ color: "#D946EF" }}>{kineticEnergy().toFixed(3)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>|L|</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>{angMomentumMag().toFixed(3)}</div>
        </div>
      </div>
    </div>
  );
};


// ════════════════════════════════════════════════════════════════════
// C4Polhode
// ════════════════════════════════════════════════════════════════════

export const C4Polhode: Component = () => {
  const [I1, setI1] = createSignal(1);
  const [I2, setI2] = createSignal(3);
  const [I3, setI3] = createSignal(6);
  const [initTheta, setInitTheta] = createSignal(0.3);
  const [running, setRunning] = createSignal(false);
  const [trace, setTrace] = createSignal<{ x: number; y: number; t: number }[]>([]);
  const [omega, setOmega] = createSignal<Vec3>([0, 0, 0]);
  const [simTime, setSimTime] = createSignal(0);

  let intervalId: number | undefined;
  const dt = 0.002;
  const stepsPerFrame = 8;

  // Initial omega from theta angle: spin mainly around axis 1 with perturbation
  const initOmega = (): Vec3 => {
    const theta = initTheta();
    const wMag = 3;
    return [wMag * Math.cos(theta), wMag * Math.sin(theta), 0.01];
  };

  const energy = createMemo(() => {
    const w = omega();
    return 0.5 * (I1() * w[0]*w[0] + I2() * w[1]*w[1] + I3() * w[2]*w[2]);
  });

  // Compute energy ellipse (ω₁ vs ω₂ cross-section at ω₃=0)
  const energyEllipse = createMemo(() => {
    const E = energy();
    if (E <= 0) return "";
    const pts: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const angle = (i / 120) * 2 * Math.PI;
      // 2T = I1*w1^2 + I2*w2^2 => ellipse
      const a = Math.sqrt(2 * E / I1());
      const b = Math.sqrt(2 * E / I2());
      const x = a * Math.cos(angle);
      const y = b * Math.sin(angle);
      pts.push(`${i === 0 ? "M" : "L"}${toSvgX(x)},${toSvgY(y)}`);
    }
    return pts.join(" ") + " Z";
  });

  // Angular momentum ellipse (L² = I1²w1² + I2²w2²)
  const momentumEllipse = createMemo(() => {
    const w = omega();
    const L2 = (I1()*w[0])**2 + (I2()*w[1])**2 + (I3()*w[2])**2;
    if (L2 <= 0) return "";
    const pts: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const angle = (i / 120) * 2 * Math.PI;
      // L² = I1²w1² + I2²w2² => w1 = (L/I1)cos, w2 = (L/I2)sin
      const Lmag = Math.sqrt(L2);
      const a = Lmag / I1();
      const b = Lmag / I2();
      const x = a * Math.cos(angle);
      const y = b * Math.sin(angle);
      pts.push(`${i === 0 ? "M" : "L"}${toSvgX(x)},${toSvgY(y)}`);
    }
    return pts.join(" ") + " Z";
  });

  // SVG coordinate mapping: omega space to SVG pixels
  const wScale = 35; // pixels per rad/s
  const cx = 210, cy = 150;
  const toSvgX = (w1: number) => cx + w1 * wScale;
  const toSvgY = (w2: number) => cy - w2 * wScale;

  const step = () => {
    let w = omega();
    const I: Vec3 = [I1(), I2(), I3()];
    for (let s = 0; s < stepsPerFrame; s++) {
      w = rk4Omega(w, I, dt);
    }
    setOmega(w);
    setSimTime(t => t + dt * stepsPerFrame);
    setTrace(prev => {
      const next = [...prev, { x: w[0], y: w[1], t: simTime() }];
      if (next.length > 4000) return next.slice(next.length - 4000);
      return next;
    });
  };

  const play = () => {
    if (running()) return;
    setRunning(true);
    intervalId = window.setInterval(step, 16);
  };

  const pause = () => {
    setRunning(false);
    if (intervalId !== undefined) { clearInterval(intervalId); intervalId = undefined; }
  };

  const reset = () => {
    pause();
    const w0 = initOmega();
    setOmega(w0);
    setTrace([{ x: w0[0], y: w0[1], t: 0 }]);
    setSimTime(0);
  };

  onCleanup(() => { if (intervalId !== undefined) clearInterval(intervalId); });

  // Initialize on first render
  const w0 = initOmega();
  setOmega(w0);
  setTrace([{ x: w0[0], y: w0[1], t: 0 }]);

  const tracePath = createMemo(() => {
    const pts = trace();
    if (pts.length < 2) return "";
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${toSvgX(p.x)},${toSvgY(p.y)}`).join(" ");
  });

  // Color segments by time
  const traceSegments = createMemo(() => {
    const pts = trace();
    if (pts.length < 2) return [];
    const maxT = pts[pts.length - 1].t || 1;
    const segments: { d: string; color: string }[] = [];
    const chunkSize = Math.max(1, Math.floor(pts.length / 80));
    for (let i = 0; i < pts.length - 1; i += chunkSize) {
      const end = Math.min(i + chunkSize + 1, pts.length);
      const slice = pts.slice(i, end);
      const frac = pts[i].t / maxT;
      // Gradient from #D946EF (magenta) to #06b6d4 (cyan)
      const r = Math.round(217 * (1 - frac) + 6 * frac);
      const g = Math.round(70 * (1 - frac) + 182 * frac);
      const b = Math.round(239 * (1 - frac) + 212 * frac);
      const d = slice.map((p, j) => `${j === 0 ? "M" : "L"}${toSvgX(p.x)},${toSvgY(p.y)}`).join(" ");
      segments.push({ d, color: `rgb(${r},${g},${b})` });
    }
    return segments;
  });

  const sliderBg = (val: number, min: number, max: number) =>
    `linear-gradient(to right, #D946EF ${((val - min) / (max - min)) * 100}%, var(--border) ${((val - min) / (max - min)) * 100}%)`;

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-3">
        <div class="grid grid-cols-3 gap-2">
          <div class="flex items-center gap-1">
            <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "36px" }}>I₁={I1()}</label>
            <input type="range" min="1" max="8" step="0.5" value={I1()} onInput={e => { setI1(parseFloat(e.currentTarget.value)); reset(); }}
              class="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{ background: sliderBg(I1(), 1, 8) }} />
          </div>
          <div class="flex items-center gap-1">
            <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "36px" }}>I₂={I2()}</label>
            <input type="range" min="1" max="8" step="0.5" value={I2()} onInput={e => { setI2(parseFloat(e.currentTarget.value)); reset(); }}
              class="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{ background: sliderBg(I2(), 1, 8) }} />
          </div>
          <div class="flex items-center gap-1">
            <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "36px" }}>I₃={I3()}</label>
            <input type="range" min="1" max="8" step="0.5" value={I3()} onInput={e => { setI3(parseFloat(e.currentTarget.value)); reset(); }}
              class="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{ background: sliderBg(I3(), 1, 8) }} />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "70px" }}>angle={initTheta().toFixed(2)}</label>
          <input type="range" min="0.05" max="1.5" step="0.05" value={initTheta()} onInput={e => { setInitTheta(parseFloat(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{ background: sliderBg(initTheta(), 0.05, 1.5) }} />
        </div>
      </div>

      <svg width="100%" height="300" viewBox="0 0 420 300" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Polhode: w1 vs w2 Trajectory</text>

        {/* Axes */}
        <line x1="30" y1={cy} x2="390" y2={cy} stroke="var(--border)" stroke-width="0.5" />
        <line x1={cx} y1="25" x2={cx} y2="280" stroke="var(--border)" stroke-width="0.5" />
        <text x="395" y={cy + 12} font-size="8" fill="var(--text-muted)">w1</text>
        <text x={cx + 5} y="22" font-size="8" fill="var(--text-muted)">w2</text>

        {/* Energy ellipse */}
        {energyEllipse() && (
          <path d={energyEllipse()} fill="none" stroke="#D946EF" stroke-width="1" stroke-dasharray="4 3" opacity="0.4" />
        )}

        {/* Angular momentum ellipse */}
        {momentumEllipse() && (
          <path d={momentumEllipse()} fill="none" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4 3" opacity="0.3" />
        )}

        {/* Polhode trace (colored segments) */}
        {traceSegments().map(seg => (
          <path d={seg.d} fill="none" stroke={seg.color} stroke-width="2" stroke-linecap="round" />
        ))}

        {/* Current point */}
        <circle cx={toSvgX(omega()[0])} cy={toSvgY(omega()[1])} r="4" fill="#D946EF" stroke="white" stroke-width="1.5" />

        {/* Legend */}
        <line x1="30" y1="285" x2="45" y2="285" stroke="#D946EF" stroke-width="1" stroke-dasharray="4 3" />
        <text x="48" y="288" font-size="7" fill="var(--text-muted)">Energy ellipse</text>
        <line x1="130" y1="285" x2="145" y2="285" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4 3" />
        <text x="148" y="288" font-size="7" fill="var(--text-muted)">L ellipse</text>
      </svg>

      <div class="flex justify-center gap-2">
        <button onClick={play} disabled={running()}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: running() ? "var(--bg-secondary)" : "#D946EF", color: running() ? "var(--text-muted)" : "white" }}>
          Play
        </button>
        <button onClick={pause}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Pause
        </button>
        <button onClick={reset}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Reset
        </button>
      </div>

      <div class="grid grid-cols-4 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>w1</div>
          <div class="text-lg font-bold" style={{ color: "#ef4444" }}>{omega()[0].toFixed(2)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>w2</div>
          <div class="text-lg font-bold" style={{ color: "#22c55e" }}>{omega()[1].toFixed(2)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Energy</div>
          <div class="text-lg font-bold" style={{ color: "#D946EF" }}>{energy().toFixed(3)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Time</div>
          <div class="text-lg font-bold" style={{ color: "#06b6d4" }}>{simTime().toFixed(1)}s</div>
        </div>
      </div>
    </div>
  );
};


// ════════════════════════════════════════════════════════════════════
// C4TennisRacket
// ════════════════════════════════════════════════════════════════════

export const C4TennisRacket: Component = () => {
  const I: Vec3 = [1, 2, 3]; // I1 < I2 < I3, intermediate axis is e2
  const eps = 0.01;
  const wMag = 4;
  const dt = 0.003;
  const stepsPerFrame = 5;
  const maxHistory = 500;

  const [omega, setOmega] = createSignal<Vec3>([wMag, eps, eps]);
  const [rot, setRot] = createSignal<Mat3>(identity3());
  const [running, setRunning] = createSignal(false);
  const [activeAxis, setActiveAxis] = createSignal(1);
  const [stability, setStability] = createSignal<"STABLE" | "UNSTABLE">("STABLE");
  const [history, setHistory] = createSignal<{ w1: number; w2: number; w3: number; t: number }[]>([]);
  const [simTime, setSimTime] = createSignal(0);

  let intervalId: number | undefined;

  const step = () => {
    let w = omega();
    let R = rot();
    for (let i = 0; i < stepsPerFrame; i++) {
      R = rk4Rotation(R, w, I, dt);
      w = rk4Omega(w, I, dt);
    }
    setOmega(w);
    setRot(R);
    const t = simTime() + dt * stepsPerFrame;
    setSimTime(t);
    setHistory(prev => {
      const next = [...prev, { w1: w[0], w2: w[1], w3: w[2], t }];
      if (next.length > maxHistory) return next.slice(next.length - maxHistory);
      return next;
    });

    // Check stability: if the primary axis component has flipped sign or dropped significantly
    const axis = activeAxis();
    if (axis === 2) {
      const w2Ratio = Math.abs(w[1]) / wMag;
      // If the omega on axis 2 has changed sign or dropped below 50%, it's unstable behavior
      if (w2Ratio < 0.5 || (history().length > 10 && Math.sign(w[1]) !== Math.sign(history()[Math.max(0, history().length - 10)].w2))) {
        setStability("UNSTABLE");
      }
    } else {
      setStability("STABLE");
    }
  };

  const play = () => {
    if (running()) return;
    setRunning(true);
    intervalId = window.setInterval(step, 16);
  };

  const pause = () => {
    setRunning(false);
    if (intervalId !== undefined) { clearInterval(intervalId); intervalId = undefined; }
  };

  const spinAxis = (axis: number) => {
    pause();
    setActiveAxis(axis);
    setSimTime(0);
    setHistory([]);
    setRot(identity3());
    if (axis === 1) {
      setOmega([wMag, eps, eps]);
      setStability("STABLE");
    } else if (axis === 2) {
      setOmega([eps, wMag, eps]);
      setStability("UNSTABLE");
    } else {
      setOmega([eps, eps, wMag]);
      setStability("STABLE");
    }
  };

  onCleanup(() => { if (intervalId !== undefined) clearInterval(intervalId); });

  // Box: dimensions proportional to 1/sqrt(I)
  const hx = 60 / Math.sqrt(I[0]); // largest
  const hy = 60 / Math.sqrt(I[1]);
  const hz = 60 / Math.sqrt(I[2]); // smallest

  const edges = getBoxEdges(hx, hy, hz);

  const projectedEdges = createMemo(() => {
    const R = rot();
    return edges.map(([a, b]) => {
      const pa = project(a[0], a[1], a[2], R, 210, 130, 1.5);
      const pb = project(b[0], b[1], b[2], R, 210, 130, 1.5);
      const avgDepth = (pa.depth + pb.depth) / 2;
      return { x1: pa.px, y1: pa.py, x2: pb.px, y2: pb.py, depth: avgDepth };
    }).sort((a, b) => a.depth - b.depth);
  });

  // Time-series plot
  const plotW = 380, plotH = 100, plotX0 = 30, plotY0 = 10;
  const timePlot = createMemo(() => {
    const h = history();
    if (h.length < 2) return { w1: "", w2: "", w3: "" };
    const maxT = h[h.length - 1].t || 1;
    const minT = h[0].t;
    const tRange = maxT - minT || 1;
    const yScale = plotH / (wMag * 2.5);
    const yCtr = plotY0 + plotH / 2;

    const toPath = (key: "w1" | "w2" | "w3") =>
      h.map((p, i) => {
        const px = plotX0 + ((p.t - minT) / tRange) * plotW;
        const py = yCtr - p[key] * yScale;
        return `${i === 0 ? "M" : "L"}${px},${py}`;
      }).join(" ");

    return { w1: toPath("w1"), w2: toPath("w2"), w3: toPath("w3") };
  });

  return (
    <div class="space-y-5">
      {/* Axis selection buttons */}
      <div class="flex justify-center gap-2 flex-wrap">
        <button onClick={() => spinAxis(1)}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: activeAxis() === 1 ? "#D946EF" : "var(--bg-secondary)", color: activeAxis() === 1 ? "white" : "var(--text-secondary)" }}>
          Spin axis 1 (stable)
        </button>
        <button onClick={() => spinAxis(2)}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: activeAxis() === 2 ? "#ef4444" : "var(--bg-secondary)", color: activeAxis() === 2 ? "white" : "var(--text-secondary)" }}>
          Spin axis 2 (UNSTABLE)
        </button>
        <button onClick={() => spinAxis(3)}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: activeAxis() === 3 ? "#D946EF" : "var(--bg-secondary)", color: activeAxis() === 3 ? "white" : "var(--text-secondary)" }}>
          Spin axis 3 (stable)
        </button>
      </div>

      {/* 3D wireframe */}
      <svg width="100%" height="250" viewBox="0 0 420 250" class="mx-auto">
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Tennis Racket Theorem (Intermediate Axis)
        </text>

        {projectedEdges().map(e => {
          const opacity = 0.3 + 0.7 * Math.max(0, Math.min(1, (e.depth + 80) / 160));
          return (
            <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
              stroke={activeAxis() === 2 ? "#ef4444" : "#D946EF"} stroke-width="2" opacity={opacity} />
          );
        })}

        {/* Axis labels at corners */}
        {(() => {
          const R = rot();
          const axes = [
            { v: [55, 0, 0] as Vec3, c: "#ef4444", l: "e1" },
            { v: [0, 45, 0] as Vec3, c: "#22c55e", l: "e2" },
            { v: [0, 0, 40] as Vec3, c: "#3b82f6", l: "e3" },
          ];
          return axes.map(a => {
            const p = project(a.v[0], a.v[1], a.v[2], R, 210, 130, 1.5);
            return (
              <>
                <line x1={210} y1={130} x2={p.px} y2={p.py} stroke={a.c} stroke-width="1.5" stroke-dasharray="3 3" opacity="0.6" />
                <text x={p.px} y={p.py - 4} text-anchor="middle" font-size="8" font-weight="bold" fill={a.c}>{a.l}</text>
              </>
            );
          });
        })()}
      </svg>

      {/* Play/Pause */}
      <div class="flex justify-center gap-2">
        <button onClick={play} disabled={running()}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: running() ? "var(--bg-secondary)" : "#D946EF", color: running() ? "var(--text-muted)" : "white" }}>
          Play
        </button>
        <button onClick={pause}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Pause
        </button>
      </div>

      {/* Omega vs time plot */}
      <svg width="100%" height="130" viewBox={`0 0 ${plotX0 + plotW + 10} ${plotH + 30}`} class="mx-auto">
        <text x={(plotX0 + plotW) / 2} y="8" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)">Angular Velocity vs Time</text>

        {/* Zero line */}
        <line x1={plotX0} y1={plotY0 + plotH / 2} x2={plotX0 + plotW} y2={plotY0 + plotH / 2} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />

        {/* Axes */}
        <line x1={plotX0} y1={plotY0} x2={plotX0} y2={plotY0 + plotH} stroke="var(--border)" stroke-width="1" />
        <line x1={plotX0} y1={plotY0 + plotH} x2={plotX0 + plotW} y2={plotY0 + plotH} stroke="var(--border)" stroke-width="1" />
        <text x={(plotX0 + plotW) / 2} y={plotY0 + plotH + 18} text-anchor="middle" font-size="8" fill="var(--text-muted)">time</text>

        {/* w1 trace */}
        {timePlot().w1 && <path d={timePlot().w1} fill="none" stroke="#ef4444" stroke-width="1.5" opacity="0.8" />}
        {/* w2 trace */}
        {timePlot().w2 && <path d={timePlot().w2} fill="none" stroke="#22c55e" stroke-width="1.5" opacity="0.8" />}
        {/* w3 trace */}
        {timePlot().w3 && <path d={timePlot().w3} fill="none" stroke="#3b82f6" stroke-width="1.5" opacity="0.8" />}

        {/* Legend */}
        <circle cx={plotX0 + plotW - 90} cy={plotY0 + 8} r="3" fill="#ef4444" />
        <text x={plotX0 + plotW - 84} y={plotY0 + 11} font-size="7" fill="var(--text-muted)">w1</text>
        <circle cx={plotX0 + plotW - 60} cy={plotY0 + 8} r="3" fill="#22c55e" />
        <text x={plotX0 + plotW - 54} y={plotY0 + 11} font-size="7" fill="var(--text-muted)">w2</text>
        <circle cx={plotX0 + plotW - 30} cy={plotY0 + 8} r="3" fill="#3b82f6" />
        <text x={plotX0 + plotW - 24} y={plotY0 + 11} font-size="7" fill="var(--text-muted)">w3</text>
      </svg>

      {/* Stats */}
      <div class="grid grid-cols-5 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>w1</div>
          <div class="text-lg font-bold" style={{ color: "#ef4444" }}>{omega()[0].toFixed(2)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>w2</div>
          <div class="text-lg font-bold" style={{ color: "#22c55e" }}>{omega()[1].toFixed(2)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>w3</div>
          <div class="text-lg font-bold" style={{ color: "#3b82f6" }}>{omega()[2].toFixed(2)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Axis</div>
          <div class="text-lg font-bold" style={{ color: "#D946EF" }}>e{activeAxis()}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Status</div>
          <div class="text-lg font-bold" style={{ color: stability() === "STABLE" ? "#22c55e" : "#ef4444" }}>
            {stability()}
          </div>
        </div>
      </div>
    </div>
  );
};
