import { Component, createSignal, createMemo, onCleanup, For } from "solid-js";

// ─── Shared physics helpers ──────────────────────────────────────────────────

type Potential = "Harmonic" | "Pendulum" | "Double Well" | "Quartic" | "Morse";

const potentials: Record<Potential, { V: (q: number) => number; dV: (q: number) => number; ddV: (q: number) => number; qRange: [number, number]; pRange: [number, number] }> = {
  Harmonic:     { V: q => 0.5 * q * q,           dV: q => q,                        ddV: () => 1,                       qRange: [-4, 4],      pRange: [-4, 4] },
  Pendulum:     { V: q => -Math.cos(q),           dV: q => Math.sin(q),              ddV: q => Math.cos(q),              qRange: [-Math.PI * 1.5, Math.PI * 1.5], pRange: [-3, 3] },
  "Double Well":{ V: q => (q * q - 1) ** 2,       dV: q => 4 * q * (q * q - 1),     ddV: q => 12 * q * q - 4,           qRange: [-2.2, 2.2],  pRange: [-4, 4] },
  Quartic:      { V: q => 0.25 * q ** 4,          dV: q => q ** 3,                   ddV: q => 3 * q * q,                qRange: [-3, 3],      pRange: [-4, 4] },
  Morse:        { V: q => (1 - Math.exp(-q)) ** 2,dV: q => 2 * (1 - Math.exp(-q)) * Math.exp(-q), ddV: q => 2 * Math.exp(-2 * q) - 2 * (1 - Math.exp(-q)) * Math.exp(-q) * (-1), qRange: [-2, 5], pRange: [-3, 3] },
};

// Fix Morse ddV properly: d/dq[2(1 - e^-q)e^-q] = 2[e^-q * e^-q + (1 - e^-q)(-e^-q)] = 2[e^-2q - e^-q + e^-2q] = 2[2e^-2q - e^-q]
potentials.Morse.ddV = (q: number) => 2 * (2 * Math.exp(-2 * q) - Math.exp(-q));

function hamiltonian(pot: Potential, q: number, p: number): number {
  return 0.5 * p * p + potentials[pot].V(q);
}

function rk4Step(dV: (q: number) => number, q: number, p: number, dt: number): [number, number] {
  const dq = (_q: number, _p: number) => _p;
  const dp = (_q: number, _p: number) => -dV(_q);

  const k1q = dq(q, p);
  const k1p = dp(q, p);
  const k2q = dq(q + 0.5 * dt * k1q, p + 0.5 * dt * k1p);
  const k2p = dp(q + 0.5 * dt * k1q, p + 0.5 * dt * k1p);
  const k3q = dq(q + 0.5 * dt * k2q, p + 0.5 * dt * k2p);
  const k3p = dp(q + 0.5 * dt * k2q, p + 0.5 * dt * k2p);
  const k4q = dq(q + dt * k3q, p + dt * k3p);
  const k4p = dp(q + dt * k3q, p + dt * k3p);

  return [
    q + (dt / 6) * (k1q + 2 * k2q + 2 * k3q + k4q),
    p + (dt / 6) * (k1p + 2 * k2p + 2 * k3p + k4p),
  ];
}

const TRAJ_COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];

function toSVG(q: number, p: number, qRange: [number, number], pRange: [number, number], w: number, h: number, margin: number): [number, number] {
  const px = margin + ((q - qRange[0]) / (qRange[1] - qRange[0])) * (w - 2 * margin);
  const py = margin + ((pRange[1] - p) / (pRange[1] - pRange[0])) * (h - 2 * margin);
  return [px, py];
}

function fromSVG(sx: number, sy: number, qRange: [number, number], pRange: [number, number], w: number, h: number, margin: number): [number, number] {
  const q = qRange[0] + ((sx - margin) / (w - 2 * margin)) * (qRange[1] - qRange[0]);
  const p = pRange[1] - ((sy - margin) / (h - 2 * margin)) * (pRange[1] - pRange[0]);
  return [q, p];
}

// ─── C7PhasePortraits ────────────────────────────────────────────────────────

export const C7PhasePortraits: Component = () => {
  const W = 420, H = 350, M = 40;
  const [pot, setPot] = createSignal<Potential>("Harmonic");
  const [trajectories, setTrajectories] = createSignal<{ pts: [number, number][]; color: string; H: number }[]>([]);
  const [animating, setAnimating] = createSignal(false);

  let animId = 0;

  onCleanup(() => cancelAnimationFrame(animId));

  const contourPaths = createMemo(() => {
    const p = pot();
    const { V, qRange, pRange } = potentials[p];
    const paths: { d: string; energy: number }[] = [];
    const nq = 80, np = 60;
    const dq = (qRange[1] - qRange[0]) / nq;
    const dp = (pRange[1] - pRange[0]) / np;

    // Compute H grid
    const grid: number[][] = [];
    for (let j = 0; j <= np; j++) {
      grid[j] = [];
      for (let i = 0; i <= nq; i++) {
        const q = qRange[0] + i * dq;
        const pv = pRange[0] + j * dp;
        grid[j][i] = 0.5 * pv * pv + V(q);
      }
    }

    // Determine energy levels for contours
    let minH = Infinity, maxH = -Infinity;
    for (let j = 0; j <= np; j++)
      for (let i = 0; i <= nq; i++) {
        if (grid[j][i] < minH) minH = grid[j][i];
        if (grid[j][i] > maxH) maxH = grid[j][i];
      }
    maxH = Math.min(maxH, minH + 20);
    const nLevels = 12;
    const levels: number[] = [];
    for (let k = 1; k <= nLevels; k++) levels.push(minH + (k / (nLevels + 1)) * (maxH - minH));

    // Marching squares (simplified: just collect line segments per level)
    for (const level of levels) {
      let d = "";
      for (let j = 0; j < np; j++) {
        for (let i = 0; i < nq; i++) {
          const v00 = grid[j][i], v10 = grid[j][i + 1], v01 = grid[j + 1][i], v11 = grid[j + 1][i + 1];
          const c00 = v00 >= level ? 1 : 0, c10 = v10 >= level ? 1 : 0, c01 = v01 >= level ? 1 : 0, c11 = v11 >= level ? 1 : 0;
          const idx = c00 | (c10 << 1) | (c01 << 2) | (c11 << 3);
          if (idx === 0 || idx === 15) continue;

          const lerp = (a: number, b: number) => { const t = (level - a) / (b - a); return Math.max(0, Math.min(1, t)); };
          const x0 = qRange[0] + i * dq, x1 = x0 + dq;
          const y0 = pRange[0] + j * dp, y1 = y0 + dp;

          const top = x0 + lerp(v00, v10) * dq;
          const bottom = x0 + lerp(v01, v11) * dq;
          const left = y0 + lerp(v00, v01) * dp;
          const right = y0 + lerp(v10, v11) * dp;

          const segments: [number, number, number, number][] = [];
          const addSeg = (q1: number, p1: number, q2: number, p2: number) => segments.push([q1, p1, q2, p2]);

          if (idx === 1 || idx === 14) addSeg(top, y0, x0, left);
          else if (idx === 2 || idx === 13) addSeg(top, y0, x1, right);
          else if (idx === 3 || idx === 12) addSeg(x0, left, x1, right);
          else if (idx === 4 || idx === 11) addSeg(x0, left, bottom, y1);
          else if (idx === 5 || idx === 10) { addSeg(top, y0, x1, right); addSeg(x0, left, bottom, y1); }
          else if (idx === 6 || idx === 9) addSeg(top, y0, bottom, y1);
          else if (idx === 7 || idx === 8) addSeg(x1, right, bottom, y1);

          for (const [sq1, sp1, sq2, sp2] of segments) {
            const [sx1, sy1] = toSVG(sq1, sp1, qRange, pRange, W, H, M);
            const [sx2, sy2] = toSVG(sq2, sp2, qRange, pRange, W, H, M);
            d += `M${sx1.toFixed(1)},${sy1.toFixed(1)}L${sx2.toFixed(1)},${sy2.toFixed(1)}`;
          }
        }
      }
      if (d) paths.push({ d, energy: level });
    }
    return paths;
  });

  const handleClick = (e: MouseEvent) => {
    const svg = e.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    const sx = (e.clientX - rect.left) * (W / rect.width);
    const sy = (e.clientY - rect.top) * (H / rect.height);
    const { qRange, pRange, dV } = potentials[pot()];
    const [q0, p0] = fromSVG(sx, sy, qRange, pRange, W, H, M);

    if (q0 < qRange[0] || q0 > qRange[1] || p0 < pRange[0] || p0 > pRange[1]) return;

    const curTrajs = trajectories();
    if (curTrajs.length >= 8) return;

    const color = TRAJ_COLORS[curTrajs.length % TRAJ_COLORS.length];
    const h = hamiltonian(pot(), q0, p0);
    const newTraj = { pts: [[q0, p0]] as [number, number][], color, H: h };
    setTrajectories([...curTrajs, newTraj]);

    // Animate this trajectory
    let q = q0, p = p0;
    let steps = 0;
    const maxSteps = 800;
    const stepsPerFrame = 4;
    const dt = 0.02;

    const animate = () => {
      const currentDV = potentials[pot()].dV;
      for (let s = 0; s < stepsPerFrame; s++) {
        [q, p] = rk4Step(currentDV, q, p, dt);
        steps++;
      }
      setTrajectories(prev => {
        const updated = [...prev];
        const idx = updated.indexOf(newTraj);
        if (idx >= 0) {
          const clone = { ...updated[idx], pts: [...updated[idx].pts, [q, p] as [number, number]] };
          updated[idx] = clone;
        }
        return updated;
      });
      if (steps < maxSteps) {
        animId = requestAnimationFrame(animate);
      }
    };
    animId = requestAnimationFrame(animate);
  };

  const latestH = createMemo(() => {
    const ts = trajectories();
    return ts.length > 0 ? ts[ts.length - 1].H : null;
  });

  return (
    <div class="space-y-5">
      <div class="flex flex-wrap gap-2">
        <For each={Object.keys(potentials) as Potential[]}>
          {(name) => (
            <button
              class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
              style={{ background: pot() === name ? "#3B82F6" : "var(--bg-secondary)", color: pot() === name ? "white" : "var(--text-primary)", border: pot() === name ? "none" : "1px solid var(--border)" }}
              onClick={() => { setPot(name); setTrajectories([]); }}
            >{name}</button>
          )}
        </For>
      </div>

      <svg width="100%" height="350" viewBox={`0 0 ${W} ${H}`} class="mx-auto" style={{ cursor: "crosshair" }} onClick={handleClick}>
        <rect x="0" y="0" width={W} height={H} fill="var(--bg-secondary)" rx="8" />

        {/* Grid lines */}
        {(() => {
          const { qRange, pRange } = potentials[pot()];
          const lines: any[] = [];
          for (let q = Math.ceil(qRange[0]); q <= Math.floor(qRange[1]); q++) {
            const [sx] = toSVG(q, 0, qRange, pRange, W, H, M);
            lines.push(<line x1={sx} y1={M} x2={sx} y2={H - M} stroke="var(--border)" stroke-width="0.5" opacity="0.4" />);
            if (q !== 0) lines.push(<text x={sx} y={H - M + 14} text-anchor="middle" font-size="8" fill="var(--text-muted)">{q}</text>);
          }
          for (let p = Math.ceil(pRange[0]); p <= Math.floor(pRange[1]); p++) {
            const [, sy] = toSVG(0, p, qRange, pRange, W, H, M);
            lines.push(<line x1={M} y1={sy} x2={W - M} y2={sy} stroke="var(--border)" stroke-width="0.5" opacity="0.4" />);
            if (p !== 0) lines.push(<text x={M - 6} y={sy + 3} text-anchor="end" font-size="8" fill="var(--text-muted)">{p}</text>);
          }
          return lines;
        })()}

        {/* Axes */}
        {(() => {
          const { qRange, pRange } = potentials[pot()];
          const [ax1] = toSVG(qRange[0], 0, qRange, pRange, W, H, M);
          const [ax2] = toSVG(qRange[1], 0, qRange, pRange, W, H, M);
          const [, ay1] = toSVG(0, pRange[0], qRange, pRange, W, H, M);
          const [, ay2] = toSVG(0, pRange[1], qRange, pRange, W, H, M);
          const [ox, oy] = toSVG(0, 0, qRange, pRange, W, H, M);
          return (
            <>
              <line x1={M} y1={oy} x2={W - M} y2={oy} stroke="var(--text-muted)" stroke-width="1" />
              <line x1={ox} y1={M} x2={ox} y2={H - M} stroke="var(--text-muted)" stroke-width="1" />
              <text x={W - M + 5} y={oy + 4} font-size="10" font-weight="600" fill="var(--text-muted)">q</text>
              <text x={ox + 6} y={M - 5} font-size="10" font-weight="600" fill="var(--text-muted)">p</text>
            </>
          );
        })()}

        {/* Energy contours */}
        <For each={contourPaths()}>
          {(c) => <path d={c.d} fill="none" stroke="var(--text-muted)" stroke-width="0.6" opacity="0.25" />}
        </For>

        {/* Trajectories */}
        <For each={trajectories()}>
          {(traj) => {
            const { qRange, pRange } = potentials[pot()];
            const d = () => traj.pts.map((pt, i) => {
              const [sx, sy] = toSVG(pt[0], pt[1], qRange, pRange, W, H, M);
              return `${i === 0 ? "M" : "L"}${sx.toFixed(1)},${sy.toFixed(1)}`;
            }).join("");
            const lastPt = () => {
              const pt = traj.pts[traj.pts.length - 1];
              return toSVG(pt[0], pt[1], qRange, pRange, W, H, M);
            };
            return (
              <>
                <path d={d()} fill="none" stroke={traj.color} stroke-width="1.5" opacity="0.85" />
                <circle cx={lastPt()[0]} cy={lastPt()[1]} r="3" fill={traj.color} />
              </>
            );
          }}
        </For>
      </svg>

      <div class="flex items-center gap-4">
        <button
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#3B82F6", color: "white" }}
          onClick={() => setTrajectories([])}
        >Clear All</button>
        <span class="text-xs" style={{ color: "var(--text-muted)" }}>Click in the phase space to launch trajectories (max 8)</span>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div class="card p-3 text-center">
          <div class="text-xs" style={{ color: "var(--text-muted)" }}>Potential</div>
          <div class="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{pot()}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs" style={{ color: "var(--text-muted)" }}>Trajectories</div>
          <div class="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{trajectories().length}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs" style={{ color: "var(--text-muted)" }}>H (latest)</div>
          <div class="font-bold text-sm" style={{ color: "#3B82F6" }}>{latestH() !== null ? latestH()!.toFixed(3) : "—"}</div>
        </div>
      </div>
    </div>
  );
};

// ─── C7Liouville ─────────────────────────────────────────────────────────────

export const C7Liouville: Component = () => {
  const W = 420, H = 350, M = 40;
  const qRange: [number, number] = [-Math.PI * 1.5, Math.PI * 1.5];
  const pRange: [number, number] = [-3, 3];
  const dV = (q: number) => Math.sin(q); // pendulum

  const [points, setPoints] = createSignal<[number, number][]>([]);
  const [initialArea, setInitialArea] = createSignal(0);
  const [currentArea, setCurrentArea] = createSignal(0);
  const [running, setRunning] = createSignal(false);
  const [step, setStep] = createSignal(0);
  const [clickPos, setClickPos] = createSignal<[number, number]>([0.5, 1.5]);

  let animId = 0;
  onCleanup(() => cancelAnimationFrame(animId));

  const createCloud = (qc: number, pc: number): [number, number][] => {
    const pts: [number, number][] = [];
    const r = 0.25;
    for (let i = 0; i < 50; i++) {
      const angle = (2 * Math.PI * i) / 50;
      const rr = r * Math.sqrt(Math.random() * 0.4 + 0.6);
      pts.push([qc + rr * Math.cos(angle), pc + rr * Math.sin(angle)]);
    }
    return pts;
  };

  const convexHullArea = (pts: [number, number][]): number => {
    if (pts.length < 3) return 0;
    // Graham scan
    const sorted = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (O: [number, number], A: [number, number], B: [number, number]) =>
      (A[0] - O[0]) * (B[1] - O[1]) - (A[1] - O[1]) * (B[0] - O[0]);

    const lower: [number, number][] = [];
    for (const p of sorted) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
      lower.push(p);
    }
    const upper: [number, number][] = [];
    for (let i = sorted.length - 1; i >= 0; i--) {
      const p = sorted[i];
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
      upper.push(p);
    }
    upper.pop();
    lower.pop();
    const hull = lower.concat(upper);

    // Shoelace
    let area = 0;
    for (let i = 0; i < hull.length; i++) {
      const j = (i + 1) % hull.length;
      area += hull[i][0] * hull[j][1] - hull[j][0] * hull[i][1];
    }
    return Math.abs(area) / 2;
  };

  const handleClick = (e: MouseEvent) => {
    if (running()) return;
    const svg = e.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    const sx = (e.clientX - rect.left) * (W / rect.width);
    const sy = (e.clientY - rect.top) * (H / rect.height);
    const [q, p] = fromSVG(sx, sy, qRange, pRange, W, H, M);
    setClickPos([q, p]);
  };

  const launchCloud = () => {
    const [qc, pc] = clickPos();
    const cloud = createCloud(qc, pc);
    setPoints(cloud);
    const a0 = convexHullArea(cloud);
    setInitialArea(a0);
    setCurrentArea(a0);
    setStep(0);
    setRunning(true);

    let pts = cloud.map(p => [...p] as [number, number]);
    let count = 0;
    const dt = 0.02;
    const stepsPerFrame = 3;

    const animate = () => {
      for (let s = 0; s < stepsPerFrame; s++) {
        pts = pts.map(([q, p]) => rk4Step(dV, q, p, dt));
        count++;
      }
      setPoints([...pts]);
      setCurrentArea(convexHullArea(pts));
      setStep(count);

      if (count < 1500) {
        animId = requestAnimationFrame(animate);
      } else {
        setRunning(false);
      }
    };
    animId = requestAnimationFrame(animate);
  };

  const reset = () => {
    cancelAnimationFrame(animId);
    setRunning(false);
    setPoints([]);
    setStep(0);
    setInitialArea(0);
    setCurrentArea(0);
  };

  const ratio = createMemo(() => initialArea() > 0 ? currentArea() / initialArea() : 0);

  return (
    <div class="space-y-5">
      <svg width="100%" height="350" viewBox={`0 0 ${W} ${H}`} class="mx-auto" style={{ cursor: running() ? "default" : "crosshair" }} onClick={handleClick}>
        <rect x="0" y="0" width={W} height={H} fill="var(--bg-secondary)" rx="8" />

        {/* Grid */}
        {(() => {
          const lines: any[] = [];
          for (let q = Math.ceil(qRange[0]); q <= Math.floor(qRange[1]); q++) {
            const [sx] = toSVG(q, 0, qRange, pRange, W, H, M);
            lines.push(<line x1={sx} y1={M} x2={sx} y2={H - M} stroke="var(--border)" stroke-width="0.5" opacity="0.4" />);
            lines.push(<text x={sx} y={H - M + 14} text-anchor="middle" font-size="8" fill="var(--text-muted)">{q.toFixed(0)}</text>);
          }
          for (let p = Math.ceil(pRange[0]); p <= Math.floor(pRange[1]); p++) {
            const [, sy] = toSVG(0, p, qRange, pRange, W, H, M);
            lines.push(<line x1={M} y1={sy} x2={W - M} y2={sy} stroke="var(--border)" stroke-width="0.5" opacity="0.4" />);
            if (p !== 0) lines.push(<text x={M - 6} y={sy + 3} text-anchor="end" font-size="8" fill="var(--text-muted)">{p}</text>);
          }
          return lines;
        })()}

        {/* Axes */}
        {(() => {
          const [ox, oy] = toSVG(0, 0, qRange, pRange, W, H, M);
          return (
            <>
              <line x1={M} y1={oy} x2={W - M} y2={oy} stroke="var(--text-muted)" stroke-width="1" />
              <line x1={ox} y1={M} x2={ox} y2={H - M} stroke="var(--text-muted)" stroke-width="1" />
              <text x={W - M + 5} y={oy + 4} font-size="10" font-weight="600" fill="var(--text-muted)">q</text>
              <text x={ox + 6} y={M - 5} font-size="10" font-weight="600" fill="var(--text-muted)">p</text>
            </>
          );
        })()}

        {/* Click indicator (when not running and no points) */}
        {points().length === 0 && (() => {
          const [qc, pc] = clickPos();
          const [sx, sy] = toSVG(qc, pc, qRange, pRange, W, H, M);
          return <circle cx={sx} cy={sy} r="5" fill="none" stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="3 3" />;
        })()}

        {/* Phase space points */}
        <For each={points()}>
          {(pt) => {
            const [sx, sy] = toSVG(pt[0], pt[1], qRange, pRange, W, H, M);
            return <circle cx={sx} cy={sy} r="3" fill="#3B82F6" opacity="0.5" />;
          }}
        </For>
      </svg>

      <div class="flex items-center gap-3">
        <button
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#3B82F6", color: "white" }}
          onClick={launchCloud}
          disabled={running()}
        >Launch Cloud</button>
        <button
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          onClick={reset}
        >Reset</button>
        <span class="text-xs" style={{ color: "var(--text-muted)" }}>
          {points().length === 0 ? "Click to set cloud center, then Launch" : `Step: ${step()}`}
        </span>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div class="card p-3 text-center">
          <div class="text-xs" style={{ color: "var(--text-muted)" }}>Initial Area</div>
          <div class="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{initialArea() > 0 ? initialArea().toFixed(4) : "—"}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs" style={{ color: "var(--text-muted)" }}>Current Area</div>
          <div class="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{currentArea() > 0 ? currentArea().toFixed(4) : "—"}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs" style={{ color: "var(--text-muted)" }}>Area Ratio</div>
          <div class="font-bold text-sm" style={{ color: ratio() > 0.9 && ratio() < 1.1 ? "#10B981" : "#EF4444" }}>
            {initialArea() > 0 ? ratio().toFixed(3) : "—"}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── C7FixedPoints ───────────────────────────────────────────────────────────

export const C7FixedPoints: Component = () => {
  const W = 420, H = 350, M = 40;
  const [pot, setPot] = createSignal<Potential>("Pendulum");

  type FixedPoint = { q: number; p: number; type: "center" | "saddle" };

  const fixedPointsData = createMemo((): FixedPoint[] => {
    const p = pot();
    switch (p) {
      case "Harmonic":
        return [{ q: 0, p: 0, type: "center" }];
      case "Pendulum":
        return [
          { q: 0, p: 0, type: "center" },
          { q: -Math.PI, p: 0, type: "saddle" },
          { q: Math.PI, p: 0, type: "saddle" },
        ];
      case "Double Well":
        return [
          { q: -1, p: 0, type: "center" },
          { q: 1, p: 0, type: "center" },
          { q: 0, p: 0, type: "saddle" },
        ];
      case "Quartic":
        return [{ q: 0, p: 0, type: "center" }];
      case "Morse":
        return [{ q: 0, p: 0, type: "center" }];
      default:
        return [];
    }
  });

  const separatrixPaths = createMemo(() => {
    const p = pot();
    const { V, dV, qRange, pRange } = potentials[p];
    const paths: string[] = [];

    // Find saddle points and trace separatrices through them
    const saddles = fixedPointsData().filter(fp => fp.type === "saddle");
    if (saddles.length === 0) return paths;

    for (const saddle of saddles) {
      const Esaddle = hamiltonian(p, saddle.q, 0);

      // Trace the separatrix as the energy contour H = Esaddle
      // For each q, solve p from p^2/2 + V(q) = Esaddle => p = +-sqrt(2(Esaddle - V(q)))
      const nPts = 300;
      const upperPts: [number, number][] = [];
      const lowerPts: [number, number][] = [];

      for (let i = 0; i <= nPts; i++) {
        const q = qRange[0] + (i / nPts) * (qRange[1] - qRange[0]);
        const pSq = 2 * (Esaddle - V(q));
        if (pSq >= 0) {
          const pv = Math.sqrt(pSq);
          upperPts.push([q, pv]);
          lowerPts.push([q, -pv]);
        }
      }

      // Build path strings, breaking at gaps
      const buildPath = (pts: [number, number][]): string => {
        if (pts.length < 2) return "";
        let d = "";
        let started = false;
        for (let i = 0; i < pts.length; i++) {
          const [sx, sy] = toSVG(pts[i][0], pts[i][1], qRange, pRange, W, H, M);
          if (sx < M || sx > W - M || sy < M || sy > H - M) {
            started = false;
            continue;
          }
          if (!started) {
            d += `M${sx.toFixed(1)},${sy.toFixed(1)}`;
            started = true;
          } else {
            // Break if jump too large
            const [prevSx, prevSy] = toSVG(pts[i - 1][0], pts[i - 1][1], qRange, pRange, W, H, M);
            if (Math.abs(sx - prevSx) > 30 || Math.abs(sy - prevSy) > 30) {
              d += `M${sx.toFixed(1)},${sy.toFixed(1)}`;
            } else {
              d += `L${sx.toFixed(1)},${sy.toFixed(1)}`;
            }
          }
        }
        return d;
      };

      const up = buildPath(upperPts);
      const lo = buildPath(lowerPts);
      if (up) paths.push(up);
      if (lo) paths.push(lo);
    }

    return paths;
  });

  const flowTrajectories = createMemo(() => {
    const p = pot();
    const { V, dV, qRange, pRange } = potentials[p];
    const paths: string[] = [];

    // Generate a grid of initial conditions and trace short trajectories
    const nq = 7, np = 5;
    const dt = 0.02;
    const steps = 400;

    for (let iq = 1; iq <= nq; iq++) {
      for (let ip = 1; ip <= np; ip++) {
        const q0 = qRange[0] + (iq / (nq + 1)) * (qRange[1] - qRange[0]);
        const p0 = pRange[0] + (ip / (np + 1)) * (pRange[1] - pRange[0]);

        // Skip points too close to fixed points
        const tooClose = fixedPointsData().some(fp => Math.abs(q0 - fp.q) < 0.3 && Math.abs(p0 - fp.p) < 0.3);
        if (tooClose) continue;

        let q = q0, pv = p0;
        let d = "";
        for (let s = 0; s <= steps; s++) {
          const [sx, sy] = toSVG(q, pv, qRange, pRange, W, H, M);
          if (sx < M - 5 || sx > W - M + 5 || sy < M - 5 || sy > H - M + 5) break;
          d += s === 0 ? `M${sx.toFixed(1)},${sy.toFixed(1)}` : `L${sx.toFixed(1)},${sy.toFixed(1)}`;
          [q, pv] = rk4Step(dV, q, pv, dt);
        }
        if (d.length > 5) paths.push(d);
      }
    }
    return paths;
  });

  return (
    <div class="space-y-5">
      <div class="flex flex-wrap gap-2">
        <For each={Object.keys(potentials) as Potential[]}>
          {(name) => (
            <button
              class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
              style={{ background: pot() === name ? "#3B82F6" : "var(--bg-secondary)", color: pot() === name ? "white" : "var(--text-primary)", border: pot() === name ? "none" : "1px solid var(--border)" }}
              onClick={() => setPot(name)}
            >{name}</button>
          )}
        </For>
      </div>

      <svg width="100%" height="350" viewBox={`0 0 ${W} ${H}`} class="mx-auto">
        <rect x="0" y="0" width={W} height={H} fill="var(--bg-secondary)" rx="8" />

        {/* Grid */}
        {(() => {
          const { qRange, pRange } = potentials[pot()];
          const lines: any[] = [];
          for (let q = Math.ceil(qRange[0]); q <= Math.floor(qRange[1]); q++) {
            const [sx] = toSVG(q, 0, qRange, pRange, W, H, M);
            lines.push(<line x1={sx} y1={M} x2={sx} y2={H - M} stroke="var(--border)" stroke-width="0.5" opacity="0.4" />);
            if (q !== 0) lines.push(<text x={sx} y={H - M + 14} text-anchor="middle" font-size="8" fill="var(--text-muted)">{q}</text>);
          }
          for (let p = Math.ceil(pRange[0]); p <= Math.floor(pRange[1]); p++) {
            const [, sy] = toSVG(0, p, qRange, pRange, W, H, M);
            lines.push(<line x1={M} y1={sy} x2={W - M} y2={sy} stroke="var(--border)" stroke-width="0.5" opacity="0.4" />);
            if (p !== 0) lines.push(<text x={M - 6} y={sy + 3} text-anchor="end" font-size="8" fill="var(--text-muted)">{p}</text>);
          }
          return lines;
        })()}

        {/* Axes */}
        {(() => {
          const { qRange, pRange } = potentials[pot()];
          const [ox, oy] = toSVG(0, 0, qRange, pRange, W, H, M);
          return (
            <>
              <line x1={M} y1={oy} x2={W - M} y2={oy} stroke="var(--text-muted)" stroke-width="1" />
              <line x1={ox} y1={M} x2={ox} y2={H - M} stroke="var(--text-muted)" stroke-width="1" />
              <text x={W - M + 5} y={oy + 4} font-size="10" font-weight="600" fill="var(--text-muted)">q</text>
              <text x={ox + 6} y={M - 5} font-size="10" font-weight="600" fill="var(--text-muted)">p</text>
            </>
          );
        })()}

        {/* Flow trajectories (thin blue) */}
        <For each={flowTrajectories()}>
          {(d) => <path d={d} fill="none" stroke="#3B82F6" stroke-width="1" opacity="0.35" />}
        </For>

        {/* Separatrices (thick dashed red) */}
        <For each={separatrixPaths()}>
          {(d) => <path d={d} fill="none" stroke="#EF4444" stroke-width="2.5" stroke-dasharray="6 4" opacity="0.85" />}
        </For>

        {/* Fixed points */}
        <For each={fixedPointsData()}>
          {(fp) => {
            const { qRange, pRange } = potentials[pot()];
            const [sx, sy] = toSVG(fp.q, fp.p, qRange, pRange, W, H, M);
            const color = fp.type === "center" ? "#10B981" : "#EF4444";
            return (
              <>
                <circle cx={sx} cy={sy} r="6" fill={color} stroke="white" stroke-width="1.5" />
                <text x={sx} y={sy - 10} text-anchor="middle" font-size="8" font-weight="600" fill={color}>{fp.type}</text>
              </>
            );
          }}
        </For>
      </svg>

      <div class="grid grid-cols-2 gap-3">
        <div class="card p-3 text-center">
          <div class="text-xs" style={{ color: "var(--text-muted)" }}>Centers</div>
          <div class="font-bold text-sm" style={{ color: "#10B981" }}>{fixedPointsData().filter(f => f.type === "center").length}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-xs" style={{ color: "var(--text-muted)" }}>Saddle Points</div>
          <div class="font-bold text-sm" style={{ color: "#EF4444" }}>{fixedPointsData().filter(f => f.type === "saddle").length}</div>
        </div>
      </div>

      <div class="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
        <strong style={{ color: "var(--text-primary)" }}>Fixed Points:</strong>{" "}
        <For each={fixedPointsData()}>
          {(fp, i) => (
            <span>
              {i() > 0 ? ", " : ""}
              <span style={{ color: fp.type === "center" ? "#10B981" : "#EF4444" }}>
                q={fp.q.toFixed(2)} ({fp.type})
              </span>
            </span>
          )}
        </For>
      </div>
    </div>
  );
};
