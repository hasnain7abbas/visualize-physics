import { Component, createSignal, createMemo, onCleanup } from "solid-js";

// ─── C1IdealProjectile ─────────────────────────────────────────────────────
// Ideal parabolic trajectory with no air resistance
export const C1IdealProjectile: Component = () => {
  const [angle, setAngle] = createSignal(45);
  const [velocity, setVelocity] = createSignal(25);
  const [animT, setAnimT] = createSignal(0);
  const [running, setRunning] = createSignal(false);
  const g = 9.81;

  const thetaRad = createMemo(() => (angle() * Math.PI) / 180);
  const flightTime = createMemo(() => (2 * velocity() * Math.sin(thetaRad())) / g);
  const range = createMemo(() => velocity() * Math.cos(thetaRad()) * flightTime());
  const maxHeight = createMemo(() => (velocity() * Math.sin(thetaRad())) ** 2 / (2 * g));

  // Pre-compute trajectory points for drawing
  const trajectoryPts = createMemo(() => {
    const pts: { x: number; y: number }[] = [];
    const T = flightTime();
    const v0 = velocity();
    const th = thetaRad();
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * T;
      const x = v0 * Math.cos(th) * t;
      const y = v0 * Math.sin(th) * t - 0.5 * g * t * t;
      if (y < -0.01) break;
      pts.push({ x, y });
    }
    return pts;
  });

  // SVG coordinate mapping
  const svgW = 420, svgH = 250;
  const margin = { left: 35, right: 15, top: 20, bottom: 40 };
  const plotW = svgW - margin.left - margin.right;
  const plotH = svgH - margin.top - margin.bottom;

  const scale = createMemo(() => {
    const R = Math.max(range(), 1);
    const H = Math.max(maxHeight(), 1);
    const sx = plotW / R;
    const sy = plotH / H;
    return Math.min(sx, sy * 0.85);
  });

  const toSvgX = (x: number) => margin.left + x * scale();
  const toSvgY = (y: number) => svgH - margin.bottom - y * scale();

  // Current projectile position during animation
  const currentPos = createMemo(() => {
    const t = animT();
    const v0 = velocity();
    const th = thetaRad();
    const x = v0 * Math.cos(th) * t;
    const y = Math.max(0, v0 * Math.sin(th) * t - 0.5 * g * t * t);
    return { x, y };
  });

  // Visible trajectory path (up to current animation time)
  const visiblePath = createMemo(() => {
    const T = animT();
    const pts = trajectoryPts();
    const totalT = flightTime();
    if (!running() && T === 0) return "";
    const cutoff = running() ? T / totalT : 1;
    const endIdx = Math.min(Math.floor(cutoff * pts.length), pts.length);
    return pts
      .slice(0, endIdx + 1)
      .map((p, i) => `${i === 0 ? "M" : "L"}${toSvgX(p.x).toFixed(1)},${toSvgY(p.y).toFixed(1)}`)
      .join(" ");
  });

  let frameId: number | undefined;

  const launch = () => {
    setAnimT(0);
    setRunning(true);
    const startTime = performance.now();
    const T = flightTime();
    const step = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      if (elapsed >= T) {
        setAnimT(T);
        setRunning(false);
        return;
      }
      setAnimT(elapsed);
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
  };

  const reset = () => {
    if (frameId) cancelAnimationFrame(frameId);
    setAnimT(0);
    setRunning(false);
  };

  onCleanup(() => { if (frameId) cancelAnimationFrame(frameId); });

  const anglePct = () => (angle() / 90) * 100;
  const velPct = () => ((velocity() - 1) / 49) * 100;

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "65px" }}>{"\u03B8"} = {angle()}{"\u00B0"}</label>
          <input type="range" min="0" max="90" step="1" value={angle()} onInput={(e) => { setAngle(parseInt(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #E07A5F ${anglePct()}%, var(--border) ${anglePct()}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "75px" }}>v{"\u2080"} = {velocity()} m/s</label>
          <input type="range" min="1" max="50" step="1" value={velocity()} onInput={(e) => { setVelocity(parseInt(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #E07A5F ${velPct()}%, var(--border) ${velPct()}%)` }} />
        </div>
      </div>

      <svg width="100%" height="250" viewBox={`0 0 ${svgW} ${svgH}`} class="mx-auto">
        <text x={svgW / 2} y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Ideal Projectile Motion (No Drag)</text>

        {/* Ground line */}
        <line x1={margin.left} y1={svgH - margin.bottom} x2={svgW - margin.right} y2={svgH - margin.bottom} stroke="var(--border)" stroke-width="1.5" />

        {/* Launch point marker */}
        <circle cx={toSvgX(0)} cy={toSvgY(0)} r="4" fill="#E07A5F" opacity="0.5" />

        {/* Trajectory path */}
        {visiblePath() && <path d={visiblePath()} fill="none" stroke="#E07A5F" stroke-width="2" />}

        {/* Full trajectory ghost (dashed) when running */}
        {running() && (
          <path d={trajectoryPts().map((p, i) => `${i === 0 ? "M" : "L"}${toSvgX(p.x).toFixed(1)},${toSvgY(p.y).toFixed(1)}`).join(" ")}
            fill="none" stroke="#E07A5F" stroke-width="1" stroke-dasharray="4 3" opacity="0.3" />
        )}

        {/* Projectile */}
        {(running() || animT() > 0) && (
          <circle cx={toSvgX(currentPos().x)} cy={toSvgY(currentPos().y)} r="6" fill="#E07A5F" stroke="white" stroke-width="1.5" />
        )}

        {/* Max height dashed line */}
        {!running() && animT() > 0 && (
          <>
            <line x1={margin.left} y1={toSvgY(maxHeight())} x2={toSvgX(range())} y2={toSvgY(maxHeight())}
              stroke="var(--text-muted)" stroke-width="0.7" stroke-dasharray="3 3" />
            <text x={margin.left - 3} y={toSvgY(maxHeight()) + 3} text-anchor="end" font-size="7" fill="var(--text-muted)">H</text>
          </>
        )}

        {/* Range marker */}
        {!running() && animT() > 0 && (
          <text x={toSvgX(range())} y={svgH - margin.bottom + 14} text-anchor="middle" font-size="8" fill="#E07A5F">R = {range().toFixed(1)} m</text>
        )}

        {/* Velocity vector at launch */}
        {!running() && animT() === 0 && (
          <>
            <line x1={toSvgX(0)} y1={toSvgY(0)}
              x2={toSvgX(0) + 40 * Math.cos(thetaRad())} y2={toSvgY(0) - 40 * Math.sin(thetaRad())}
              stroke="#E07A5F" stroke-width="1.5" marker-end="url(#arrowIdeal)" />
            <defs>
              <marker id="arrowIdeal" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#E07A5F" />
              </marker>
            </defs>
            <text x={toSvgX(0) + 45 * Math.cos(thetaRad())} y={toSvgY(0) - 45 * Math.sin(thetaRad())}
              font-size="8" fill="#E07A5F">v{"\u2080"}</text>
          </>
        )}
      </svg>

      <div class="flex justify-center gap-2">
        <button onClick={launch} disabled={running()}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: running() ? "var(--bg-secondary)" : "#E07A5F", color: running() ? "var(--text-muted)" : "white" }}>
          {running() ? "Flying..." : "Launch"}
        </button>
        <button onClick={reset}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Range</div>
          <div class="text-lg font-bold" style={{ color: "#E07A5F" }}>{range().toFixed(1)} m</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Max Height</div>
          <div class="text-lg font-bold" style={{ color: "#E07A5F" }}>{maxHeight().toFixed(1)} m</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Flight Time</div>
          <div class="text-lg font-bold" style={{ color: "#E07A5F" }}>{flightTime().toFixed(2)} s</div>
        </div>
      </div>
    </div>
  );
};

// ─── C1DragEffects ─────────────────────────────────────────────────────────
// Projectile with quadratic air drag compared to ideal trajectory
export const C1DragEffects: Component = () => {
  const [angle, setAngle] = createSignal(45);
  const [velocity, setVelocity] = createSignal(30);
  const [dragCoeff, setDragCoeff] = createSignal(0.4);
  const [dragOn, setDragOn] = createSignal(true);
  const [animT, setAnimT] = createSignal(0);
  const [running, setRunning] = createSignal(false);
  const g = 9.81;
  const rho = 1.225;
  const A = 0.01;
  const mass = 0.5;

  const thetaRad = createMemo(() => (angle() * Math.PI) / 180);

  // RK4 integrator: state = [x, y, vx, vy]
  function derivs(s: number[], cd: number): number[] {
    const [, , vx, vy] = s;
    const speed = Math.sqrt(vx * vx + vy * vy);
    const dragFactor = (0.5 * rho * cd * A) / mass;
    return [
      vx,
      vy,
      -dragFactor * speed * vx,
      -g - dragFactor * speed * vy,
    ];
  }

  function rk4Step(s: number[], dt: number, cd: number): number[] {
    const k1 = derivs(s, cd);
    const s2 = s.map((v, i) => v + 0.5 * dt * k1[i]);
    const k2 = derivs(s2, cd);
    const s3 = s.map((v, i) => v + 0.5 * dt * k2[i]);
    const k3 = derivs(s3, cd);
    const s4 = s.map((v, i) => v + dt * k3[i]);
    const k4 = derivs(s4, cd);
    return s.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  }

  function computeTrajectory(cd: number) {
    const v0 = velocity();
    const th = thetaRad();
    let state = [0, 0, v0 * Math.cos(th), v0 * Math.sin(th)];
    const pts: { x: number; y: number }[] = [{ x: 0, y: 0 }];
    const dt = 0.01;
    for (let i = 0; i < 5000; i++) {
      state = rk4Step(state, dt, cd);
      if (state[1] < -0.01) {
        // Interpolate to ground
        const prev = pts[pts.length - 1];
        const frac = prev.y / (prev.y - state[1]);
        pts.push({ x: prev.x + frac * (state[0] - prev.x), y: 0 });
        break;
      }
      pts.push({ x: state[0], y: state[1] });
    }
    return pts;
  }

  const idealPts = createMemo(() => computeTrajectory(0));
  const dragPts = createMemo(() => computeTrajectory(dragCoeff()));

  const idealRange = createMemo(() => { const pts = idealPts(); return pts[pts.length - 1].x; });
  const dragRange = createMemo(() => { const pts = dragPts(); return pts[pts.length - 1].x; });
  const rangeReduction = createMemo(() => idealRange() > 0 ? ((1 - dragRange() / idealRange()) * 100) : 0);

  // SVG mapping
  const svgW = 420, svgH = 250;
  const margin = { left: 35, right: 15, top: 20, bottom: 40 };
  const plotW = svgW - margin.left - margin.right;
  const plotH = svgH - margin.top - margin.bottom;

  const scale = createMemo(() => {
    const allPts = [...idealPts(), ...dragPts()];
    const maxX = Math.max(...allPts.map((p) => p.x), 1);
    const maxY = Math.max(...allPts.map((p) => p.y), 1);
    const sx = plotW / maxX;
    const sy = plotH / maxY;
    return Math.min(sx, sy * 0.85);
  });

  const toSvgX = (x: number) => margin.left + x * scale();
  const toSvgY = (y: number) => svgH - margin.bottom - y * scale();

  const toPath = (pts: { x: number; y: number }[], cutoff: number) =>
    pts
      .slice(0, Math.max(Math.floor(cutoff * pts.length), 1) + 1)
      .map((p, i) => `${i === 0 ? "M" : "L"}${toSvgX(p.x).toFixed(1)},${toSvgY(p.y).toFixed(1)}`)
      .join(" ");

  const animFrac = createMemo(() => {
    if (!running()) return animT() > 0 ? 1 : 0;
    return animT();
  });

  // Current position along drag trajectory
  const currentDragPos = createMemo(() => {
    const pts = dragPts();
    const idx = Math.min(Math.floor(animFrac() * (pts.length - 1)), pts.length - 1);
    return pts[idx] || { x: 0, y: 0 };
  });

  let frameId: number | undefined;

  const launch = () => {
    setAnimT(0);
    setRunning(true);
    const startTime = performance.now();
    const duration = 2500; // ms for full animation
    const step = (now: number) => {
      const frac = (now - startTime) / duration;
      if (frac >= 1) {
        setAnimT(1);
        setRunning(false);
        return;
      }
      setAnimT(frac);
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
  };

  const reset = () => {
    if (frameId) cancelAnimationFrame(frameId);
    setAnimT(0);
    setRunning(false);
  };

  onCleanup(() => { if (frameId) cancelAnimationFrame(frameId); });

  const anglePct = () => (angle() / 90) * 100;
  const velPct = () => ((velocity() - 1) / 49) * 100;
  const cdPct = () => (dragCoeff() / 1) * 100;

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-3 gap-4">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>{"\u03B8"} = {angle()}{"\u00B0"}</label>
          <input type="range" min="5" max="85" step="1" value={angle()} onInput={(e) => { setAngle(parseInt(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #E07A5F ${anglePct()}%, var(--border) ${anglePct()}%)` }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "65px" }}>v{"\u2080"} = {velocity()}</label>
          <input type="range" min="1" max="50" step="1" value={velocity()} onInput={(e) => { setVelocity(parseInt(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #E07A5F ${velPct()}%, var(--border) ${velPct()}%)` }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "65px" }}>C{"\u1D48"} = {dragCoeff().toFixed(2)}</label>
          <input type="range" min="0" max="1" step="0.01" value={dragCoeff()} onInput={(e) => { setDragCoeff(parseFloat(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #E07A5F ${cdPct()}%, var(--border) ${cdPct()}%)` }} />
        </div>
      </div>

      <svg width="100%" height="250" viewBox={`0 0 ${svgW} ${svgH}`} class="mx-auto">
        <text x={svgW / 2} y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Drag Effects on Projectile Motion</text>

        {/* Ground */}
        <line x1={margin.left} y1={svgH - margin.bottom} x2={svgW - margin.right} y2={svgH - margin.bottom} stroke="var(--border)" stroke-width="1.5" />

        {/* Ideal trajectory (dashed gray) */}
        <path d={toPath(idealPts(), animFrac())} fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="5 3" />

        {/* Drag trajectory (solid accent) */}
        {dragOn() && <path d={toPath(dragPts(), animFrac())} fill="none" stroke="#E07A5F" stroke-width="2.5" />}

        {/* Projectile on drag path */}
        {dragOn() && (running() || animT() > 0) && (
          <circle cx={toSvgX(currentDragPos().x)} cy={toSvgY(currentDragPos().y)} r="5" fill="#E07A5F" stroke="white" stroke-width="1.5" />
        )}

        {/* Launch point */}
        <circle cx={toSvgX(0)} cy={toSvgY(0)} r="3.5" fill="#E07A5F" opacity="0.4" />

        {/* Legend */}
        <line x1="280" y1="30" x2="305" y2="30" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="5 3" />
        <text x="309" y="33" font-size="8" fill="var(--text-muted)">Ideal</text>
        <line x1="280" y1="42" x2="305" y2="42" stroke="#E07A5F" stroke-width="2.5" />
        <text x="309" y="45" font-size="8" fill="#E07A5F">With Drag</text>
      </svg>

      <div class="flex justify-center gap-2">
        <button onClick={launch} disabled={running()}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: running() ? "var(--bg-secondary)" : "#E07A5F", color: running() ? "var(--text-muted)" : "white" }}>
          {running() ? "Flying..." : "Launch"}
        </button>
        <button onClick={() => setDragOn(!dragOn())}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: dragOn() ? "#E07A5F" : "var(--bg-secondary)", color: dragOn() ? "white" : "var(--text-secondary)" }}>
          Drag {dragOn() ? "ON" : "OFF"}
        </button>
        <button onClick={reset}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Ideal Range</div>
          <div class="text-lg font-bold" style={{ color: "var(--text-secondary)" }}>{idealRange().toFixed(1)} m</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Drag Range</div>
          <div class="text-lg font-bold" style={{ color: "#E07A5F" }}>{dragRange().toFixed(1)} m</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Range Loss</div>
          <div class="text-lg font-bold" style={{ color: "#E07A5F" }}>{rangeReduction().toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
};

// ─── C1CoriolisWind ────────────────────────────────────────────────────────
// Projectile with Coriolis force and crosswind
export const C1CoriolisWind: Component = () => {
  const [angle, setAngle] = createSignal(45);
  const [velocity, setVelocity] = createSignal(40);
  const [latitude, setLatitude] = createSignal(45);
  const [windSpeed, setWindSpeed] = createSignal(0);
  const [animT, setAnimT] = createSignal(0);
  const [running, setRunning] = createSignal(false);
  const g = 9.81;
  const omega = 7.292e-5; // Earth rotation rate rad/s
  const rho = 1.225;
  const A = 0.01;
  const Cd = 0.3;
  const mass = 0.5;

  const thetaRad = createMemo(() => (angle() * Math.PI) / 180);
  const latRad = createMemo(() => (latitude() * Math.PI) / 180);

  // 3D RK4: state = [x, y, z, vx, vy, vz]
  // x = forward (range direction), y = up, z = lateral
  // Coriolis in rotating frame: F_cor = -2m(Omega x v)
  // Omega = omega * (0, sin(lat), cos(lat)) in local coords but simplified:
  // For horizontal projectile on Earth surface, main lateral deflection component
  function derivs3D(s: number[], wind: number): number[] {
    const [, , , vx, vy, vz] = s;
    const lat = latRad();
    const omegaY = omega * Math.sin(lat); // vertical component of Earth rotation
    const omegaZ = omega * Math.cos(lat); // horizontal N-S component

    // Coriolis: -2(Omega x v)
    // Omega = (0, omegaY, omegaZ) in (x-forward, y-up, z-lateral) frame
    // Actually let's use standard local frame: x=East(forward), y=Up, z=North(lateral)
    // Omega_local = omega * (0, sin(lat), cos(lat))
    // -2(Omega x v) components:
    const corX = -2 * (omegaY * vz - omegaZ * vy);
    const corY = -2 * (omegaZ * vx - 0);
    const corZ = -2 * (0 - omegaY * vx);

    // Wind adds to effective air velocity in z-direction
    const relVx = vx;
    const relVy = vy;
    const relVz = vz - wind;
    const speed = Math.sqrt(relVx * relVx + relVy * relVy + relVz * relVz);
    const dragFactor = (0.5 * rho * Cd * A) / mass;

    return [
      vx,
      vy,
      vz,
      -dragFactor * speed * relVx + corX,
      -g - dragFactor * speed * relVy + corY,
      -dragFactor * speed * relVz + corZ,
    ];
  }

  function rk4Step3D(s: number[], dt: number, wind: number): number[] {
    const k1 = derivs3D(s, wind);
    const s2 = s.map((v, i) => v + 0.5 * dt * k1[i]);
    const k2 = derivs3D(s2, wind);
    const s3 = s.map((v, i) => v + 0.5 * dt * k2[i]);
    const k3 = derivs3D(s3, wind);
    const s4 = s.map((v, i) => v + dt * k3[i]);
    const k4 = derivs3D(s4, wind);
    return s.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  }

  function computeTrajectory3D(wind: number, includeCoriolis: boolean) {
    const v0 = velocity();
    const th = thetaRad();
    const om = includeCoriolis ? 1 : 0;
    // Temporarily override omega if no coriolis
    const savedOmega = omega;
    let state = [0, 0, 0, v0 * Math.cos(th), v0 * Math.sin(th), 0];
    const pts: { x: number; y: number; z: number }[] = [{ x: 0, y: 0, z: 0 }];
    const dt = 0.01;

    function derivsLocal(s: number[]): number[] {
      const [, , , vx, vy, vz] = s;
      const lat = latRad();
      const omegaY = savedOmega * Math.sin(lat) * om;
      const omegaZ = savedOmega * Math.cos(lat) * om;

      const corX = -2 * (omegaY * vz - omegaZ * vy);
      const corY = -2 * (omegaZ * vx - 0);
      const corZ = -2 * (0 - omegaY * vx);

      const relVx = vx;
      const relVy = vy;
      const relVz = vz - wind;
      const speed = Math.sqrt(relVx * relVx + relVy * relVy + relVz * relVz);
      const dragFactor = (0.5 * rho * Cd * A) / mass;

      return [vx, vy, vz,
        -dragFactor * speed * relVx + corX,
        -g - dragFactor * speed * relVy + corY,
        -dragFactor * speed * relVz + corZ];
    }

    for (let i = 0; i < 8000; i++) {
      const k1 = derivsLocal(state);
      const s2 = state.map((v, j) => v + 0.5 * dt * k1[j]);
      const k2 = derivsLocal(s2);
      const s3 = state.map((v, j) => v + 0.5 * dt * k2[j]);
      const k3 = derivsLocal(s3);
      const s4 = state.map((v, j) => v + dt * k3[j]);
      const k4 = derivsLocal(s4);
      state = state.map((v, j) => v + (dt / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));

      if (state[1] < -0.01) {
        const prev = pts[pts.length - 1];
        const frac = prev.y / (prev.y - state[1]);
        pts.push({
          x: prev.x + frac * (state[0] - prev.x),
          y: 0,
          z: prev.z + frac * (state[2] - prev.z),
        });
        break;
      }
      pts.push({ x: state[0], y: state[1], z: state[2] });
    }
    return pts;
  }

  const coriolisPts = createMemo(() => computeTrajectory3D(windSpeed(), true));
  const noCoriPts = createMemo(() => computeTrajectory3D(windSpeed(), false));

  const coriolisRange = createMemo(() => { const pts = coriolisPts(); return pts[pts.length - 1].x; });
  const lateralDeflection = createMemo(() => { const pts = coriolisPts(); return pts[pts.length - 1].z; });
  const noCorDeflection = createMemo(() => { const pts = noCoriPts(); return pts[pts.length - 1].z; });
  const pureCoriolisDeflection = createMemo(() => lateralDeflection() - noCorDeflection());

  // SVG mapping for x-y trajectory view
  const svgW = 420, svgH = 200;
  const margin = { left: 35, right: 15, top: 20, bottom: 30 };
  const plotW = svgW - margin.left - margin.right;
  const plotH = svgH - margin.top - margin.bottom;

  const scale = createMemo(() => {
    const allPts = [...coriolisPts(), ...noCoriPts()];
    const maxX = Math.max(...allPts.map((p) => p.x), 1);
    const maxY = Math.max(...allPts.map((p) => p.y), 1);
    const sx = plotW / maxX;
    const sy = plotH / maxY;
    return Math.min(sx, sy * 0.85);
  });

  const toSvgX = (x: number) => margin.left + x * scale();
  const toSvgY = (y: number) => svgH - margin.bottom - y * scale();

  const animFrac = createMemo(() => {
    if (!running()) return animT() > 0 ? 1 : 0;
    return animT();
  });

  const toPathXY = (pts: { x: number; y: number }[], cutoff: number) =>
    pts
      .slice(0, Math.max(Math.floor(cutoff * pts.length), 1) + 1)
      .map((p, i) => `${i === 0 ? "M" : "L"}${toSvgX(p.x).toFixed(1)},${toSvgY(p.y).toFixed(1)}`)
      .join(" ");

  const currentPos = createMemo(() => {
    const pts = coriolisPts();
    const idx = Math.min(Math.floor(animFrac() * (pts.length - 1)), pts.length - 1);
    return pts[idx] || { x: 0, y: 0, z: 0 };
  });

  let frameId: number | undefined;

  const launch = () => {
    setAnimT(0);
    setRunning(true);
    const startTime = performance.now();
    const duration = 2500;
    const step = (now: number) => {
      const frac = (now - startTime) / duration;
      if (frac >= 1) {
        setAnimT(1);
        setRunning(false);
        return;
      }
      setAnimT(frac);
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
  };

  const reset = () => {
    if (frameId) cancelAnimationFrame(frameId);
    setAnimT(0);
    setRunning(false);
  };

  onCleanup(() => { if (frameId) cancelAnimationFrame(frameId); });

  const anglePct = () => (angle() / 90) * 100;
  const velPct = () => ((velocity() - 1) / 49) * 100;
  const latPct = () => (latitude() / 90) * 100;
  const windPct = () => ((windSpeed() + 10) / 20) * 100;

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>{"\u03B8"} = {angle()}{"\u00B0"}</label>
          <input type="range" min="5" max="85" step="1" value={angle()} onInput={(e) => { setAngle(parseInt(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #E07A5F ${anglePct()}%, var(--border) ${anglePct()}%)` }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "65px" }}>v{"\u2080"} = {velocity()}</label>
          <input type="range" min="1" max="50" step="1" value={velocity()} onInput={(e) => { setVelocity(parseInt(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #E07A5F ${velPct()}%, var(--border) ${velPct()}%)` }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>{"\u03C6"} = {latitude()}{"\u00B0"}</label>
          <input type="range" min="0" max="90" step="1" value={latitude()} onInput={(e) => { setLatitude(parseInt(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #E07A5F ${latPct()}%, var(--border) ${latPct()}%)` }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "75px" }}>Wind = {windSpeed().toFixed(0)} m/s</label>
          <input type="range" min="-10" max="10" step="0.5" value={windSpeed()} onInput={(e) => { setWindSpeed(parseFloat(e.currentTarget.value)); reset(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #E07A5F ${windPct()}%, var(--border) ${windPct()}%)` }} />
        </div>
      </div>

      <svg width="100%" height="200" viewBox={`0 0 ${svgW} ${svgH}`} class="mx-auto">
        <text x={svgW / 2} y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Trajectory with Coriolis + Wind (Side View)</text>

        {/* Ground */}
        <line x1={margin.left} y1={svgH - margin.bottom} x2={svgW - margin.right} y2={svgH - margin.bottom} stroke="var(--border)" stroke-width="1.5" />

        {/* No-Coriolis reference (dashed gray) */}
        <path d={toPathXY(noCoriPts(), animFrac())} fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="5 3" />

        {/* With Coriolis + wind (solid) */}
        <path d={toPathXY(coriolisPts(), animFrac())} fill="none" stroke="#E07A5F" stroke-width="2.5" />

        {/* Projectile */}
        {(running() || animT() > 0) && (
          <circle cx={toSvgX(currentPos().x)} cy={toSvgY(currentPos().y)} r="5" fill="#E07A5F" stroke="white" stroke-width="1.5" />
        )}

        {/* Launch point */}
        <circle cx={toSvgX(0)} cy={toSvgY(0)} r="3.5" fill="#E07A5F" opacity="0.4" />

        {/* Wind arrow indicator */}
        {windSpeed() !== 0 && (
          <>
            <defs>
              <marker id="arrowWind" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#3B82F6" />
              </marker>
            </defs>
            <line x1={svgW - 60} y1="50" x2={svgW - 60 + Math.sign(windSpeed()) * 25} y2="50"
              stroke="#3B82F6" stroke-width="2" marker-end="url(#arrowWind)" />
            <text x={svgW - 60} y="42" text-anchor="middle" font-size="8" fill="#3B82F6">Wind</text>
          </>
        )}

        {/* Legend */}
        <line x1="50" y1="30" x2="75" y2="30" stroke="var(--text-muted)" stroke-width="1.5" stroke-dasharray="5 3" />
        <text x="79" y="33" font-size="8" fill="var(--text-muted)">No Coriolis</text>
        <line x1="50" y1="42" x2="75" y2="42" stroke="#E07A5F" stroke-width="2.5" />
        <text x="79" y="45" font-size="8" fill="#E07A5F">With Coriolis</text>
      </svg>

      <div class="flex justify-center gap-2">
        <button onClick={launch} disabled={running()}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: running() ? "var(--bg-secondary)" : "#E07A5F", color: running() ? "var(--text-muted)" : "white" }}>
          {running() ? "Flying..." : "Launch"}
        </button>
        <button onClick={reset}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>

      <div class="grid grid-cols-4 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Range</div>
          <div class="text-lg font-bold" style={{ color: "#E07A5F" }}>{coriolisRange().toFixed(1)} m</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Lateral (Total)</div>
          <div class="text-lg font-bold" style={{ color: "#E07A5F" }}>{lateralDeflection().toFixed(3)} m</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Coriolis Only</div>
          <div class="text-lg font-bold" style={{ color: "#E07A5F" }}>{(pureCoriolisDeflection() * 100).toFixed(2)} cm</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{"\u03A9"} sin{"\u03C6"}</div>
          <div class="text-lg font-bold" style={{ color: "#E07A5F" }}>{(omega * Math.sin(latRad()) * 1e5).toFixed(2)}{"\u00D7"}10{"\u207B"}{"\u2075"}</div>
        </div>
      </div>

      <div class="text-center text-[11px]" style={{ color: "var(--text-muted)" }}>
        {latitude() === 0 ? "At the equator: no vertical Coriolis deflection" :
         latitude() > 60 ? "High latitude: Coriolis deflection is near maximum" :
         "Coriolis deflects rightward in Northern Hemisphere"}
        {windSpeed() !== 0 ? ` | Wind at ${windSpeed().toFixed(1)} m/s shifts trajectory laterally` : ""}
      </div>
    </div>
  );
};
