import { Component, createSignal, createMemo, onCleanup } from "solid-js";

// ─── C3KeplerOrbits ────────────────────────────────────────────────────────────
// Orbital motion under inverse-square gravity via Velocity-Verlet integration
export const C3KeplerOrbits: Component = () => {
  const GM = 1000;
  const dt = 0.05;
  const stepsPerFrame = 5;
  const maxTrail = 500;
  const cx = 210, cy = 175;
  const scale = 0.85;

  const [r0, setR0] = createSignal(160);
  const [v0, setV0] = createSignal(2.5);
  const [playing, setPlaying] = createSignal(false);

  // State arrays (mutable for perf; signals trigger renders)
  let posX = r0(), posY = 0;
  let velX = 0, velY = v0();
  let trail: { x: number; y: number }[] = [{ x: posX, y: posY }];

  const [trailPts, setTrailPts] = createSignal<{ x: number; y: number }[]>([{ x: posX, y: posY }]);
  const [curPos, setCurPos] = createSignal({ x: posX, y: posY });

  function accel(px: number, py: number) {
    const r2 = px * px + py * py;
    const r = Math.sqrt(r2);
    const a = -GM / (r2 * r); // -GM/r^3 * component = -GM/r^2 * rhat
    return { ax: a * px, ay: a * py };
  }

  function stepVerlet() {
    let { ax, ay } = accel(posX, posY);
    posX += velX * dt + 0.5 * ax * dt * dt;
    posY += velY * dt + 0.5 * ay * dt * dt;
    const newA = accel(posX, posY);
    velX += 0.5 * (ax + newA.ax) * dt;
    velY += 0.5 * (ay + newA.ay) * dt;
  }

  // Orbital elements (reactive)
  const orbitalElements = createMemo(() => {
    const x = curPos().x, y = curPos().y;
    const r = Math.sqrt(x * x + y * y);
    const v2 = velX * velX + velY * velY;
    const E = 0.5 * v2 - GM / r;                 // specific energy
    const L = Math.abs(x * velY - y * velX);      // specific angular momentum
    const a = -GM / (2 * E);                       // semi-major axis
    const ecc = Math.sqrt(Math.max(0, 1 + 2 * E * L * L / (GM * GM)));
    const T = 2 * Math.PI * Math.pow(Math.abs(a), 1.5) / Math.sqrt(GM);
    return { a: Math.abs(a), e: ecc, T, E, L };
  });

  function resetSim() {
    posX = r0(); posY = 0;
    velX = 0; velY = v0();
    trail = [{ x: posX, y: posY }];
    setTrailPts([...trail]);
    setCurPos({ x: posX, y: posY });
  }

  let animFrame: number | undefined;
  const animate = () => {
    const loop = () => {
      if (!playing()) return;
      for (let i = 0; i < stepsPerFrame; i++) stepVerlet();
      trail.push({ x: posX, y: posY });
      if (trail.length > maxTrail) trail.shift();
      setTrailPts([...trail]);
      setCurPos({ x: posX, y: posY });
      animFrame = requestAnimationFrame(loop);
    };
    animFrame = requestAnimationFrame(loop);
  };

  const togglePlay = () => {
    setPlaying(!playing());
    if (playing()) animate();
  };

  onCleanup(() => animFrame && cancelAnimationFrame(animFrame));

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "65px" }}>r₀ = {r0()}</label>
          <input type="range" min="100" max="250" step="5" value={r0()} onInput={(e) => setR0(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #0EA5E9 ${((r0() - 100) / 150) * 100}%, var(--border) ${((r0() - 100) / 150) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "65px" }}>v₀ = {v0().toFixed(1)}</label>
          <input type="range" min="0.5" max="4" step="0.1" value={v0()} onInput={(e) => setV0(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #0EA5E9 ${((v0() - 0.5) / 3.5) * 100}%, var(--border) ${((v0() - 0.5) / 3.5) * 100}%)` }} />
        </div>
      </div>

      <div class="flex gap-2 justify-center">
        <button class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#0EA5E9", color: "white" }}
          onClick={togglePlay}>{playing() ? "Pause" : "Play"}</button>
        <button class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#0EA5E9", color: "white" }}
          onClick={() => { setPlaying(false); resetSim(); }}>Reset</button>
      </div>

      <svg width="100%" height="350" viewBox="0 0 420 350" class="mx-auto">
        <rect x="0" y="0" width="420" height="350" fill="none" />
        <text x="210" y="16" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Kepler Orbit — Top-Down View</text>

        {/* Central body */}
        <circle cx={cx} cy={cy} r="8" fill="#facc15" stroke="#eab308" stroke-width="1.5" />

        {/* Orbit trail with fading opacity */}
        {trailPts().length > 1 && (
          <polyline
            points={trailPts().map(p => `${cx + p.x * scale},${cy - p.y * scale}`).join(" ")}
            fill="none" stroke="#0EA5E9" stroke-width="1.5" opacity="0.5"
          />
        )}

        {/* Orbiting body */}
        <circle cx={cx + curPos().x * scale} cy={cy - curPos().y * scale} r="5" fill="#0EA5E9" stroke="#0284c7" stroke-width="1" />

        {/* Axes */}
        <line x1="15" y1={cy} x2="405" y2={cy} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
        <line x1={cx} y1="25" x2={cx} y2="340" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
      </svg>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Semi-major a</div>
          <div class="text-lg font-bold" style={{ color: "#0EA5E9" }}>{orbitalElements().a.toFixed(1)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Eccentricity e</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>{orbitalElements().e.toFixed(3)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Period T</div>
          <div class="text-lg font-bold" style={{ color: "#10b981" }}>{isFinite(orbitalElements().T) ? orbitalElements().T.toFixed(1) : "---"}</div>
        </div>
      </div>
    </div>
  );
};


// ─── C3EffectivePotential ──────────────────────────────────────────────────────
// V_eff(r) energy diagram with turning points and circular orbit radius
export const C3EffectivePotential: Component = () => {
  const GM = 1000;

  const [angL, setAngL] = createSignal(120);
  const [energy, setEnergy] = createSignal(-1.5);

  const rMin = 5, rMax = 400, nPts = 500;
  const svgW = 420, svgH = 280;
  const padL = 45, padR = 15, padT = 25, padB = 35;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const vEff = (r: number, L: number) => -GM / r + (L * L) / (2 * r * r);

  const curveData = createMemo(() => {
    const L = angL();
    const pts: { r: number; v: number }[] = [];
    for (let i = 0; i < nPts; i++) {
      const r = rMin + (i / (nPts - 1)) * (rMax - rMin);
      pts.push({ r, v: vEff(r, L) });
    }
    return pts;
  });

  const vRange = createMemo(() => {
    const data = curveData();
    let minV = Infinity, maxV = -Infinity;
    for (const p of data) {
      if (isFinite(p.v)) {
        if (p.v < minV) minV = p.v;
        if (p.v > maxV) maxV = p.v;
      }
    }
    // Clamp to a sensible display range
    minV = Math.max(minV, -10);
    maxV = Math.min(maxV, 5);
    const margin = (maxV - minV) * 0.1;
    return { min: minV - margin, max: maxV + margin };
  });

  const toSvgX = (r: number) => padL + ((r - rMin) / (rMax - rMin)) * plotW;
  const toSvgY = (v: number) => {
    const { min, max } = vRange();
    return padT + (1 - (v - min) / (max - min)) * plotH;
  };

  const curvePath = createMemo(() => {
    const data = curveData();
    const { min, max } = vRange();
    return data
      .filter(p => isFinite(p.v) && p.v >= min && p.v <= max)
      .map((p, i) => `${i === 0 ? "M" : "L"}${toSvgX(p.r).toFixed(1)},${toSvgY(p.v).toFixed(1)}`)
      .join(" ");
  });

  // Circular orbit radius: dV_eff/dr = 0 => r_c = L²/(GM)
  const rCircular = createMemo(() => (angL() * angL()) / GM);
  const vAtCircular = createMemo(() => vEff(rCircular(), angL()));

  // Turning points: where E = V_eff(r)
  const turningPoints = createMemo(() => {
    const E = energy();
    const L = angL();
    const pts: number[] = [];
    let prev = vEff(rMin, L) - E;
    for (let i = 1; i < nPts; i++) {
      const r = rMin + (i / (nPts - 1)) * (rMax - rMin);
      const cur = vEff(r, L) - E;
      if (prev * cur < 0) {
        // Linear interpolation for crossing
        const rPrev = rMin + ((i - 1) / (nPts - 1)) * (rMax - rMin);
        const t = Math.abs(prev) / (Math.abs(prev) + Math.abs(cur));
        pts.push(rPrev + t * (r - rPrev));
      }
      prev = cur;
    }
    return pts;
  });

  // Forbidden region path (where E < V_eff)
  const forbiddenPath = createMemo(() => {
    const E = energy();
    const L = angL();
    const { min, max } = vRange();
    const ey = toSvgY(E);
    // Collect segments where V_eff > E and V_eff is within range
    let segments: string[] = [];
    let inRegion = false;
    let segPts: string[] = [];
    for (let i = 0; i < nPts; i++) {
      const r = rMin + (i / (nPts - 1)) * (rMax - rMin);
      const v = vEff(r, L);
      if (v > E && v >= min && v <= max) {
        const sx = toSvgX(r).toFixed(1);
        const sy = toSvgY(v).toFixed(1);
        if (!inRegion) {
          segPts = [`M${sx},${ey.toFixed(1)}`, `L${sx},${sy}`];
          inRegion = true;
        } else {
          segPts.push(`L${sx},${sy}`);
        }
      } else if (inRegion) {
        const rPrev = rMin + (((i - 1)) / (nPts - 1)) * (rMax - rMin);
        segPts.push(`L${toSvgX(rPrev).toFixed(1)},${ey.toFixed(1)} Z`);
        segments.push(segPts.join(" "));
        inRegion = false;
      }
    }
    if (inRegion) {
      const rLast = rMax;
      segPts.push(`L${toSvgX(rLast).toFixed(1)},${ey.toFixed(1)} Z`);
      segments.push(segPts.join(" "));
    }
    return segments;
  });

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "65px" }}>L = {angL()}</label>
          <input type="range" min="40" max="250" step="5" value={angL()} onInput={(e) => setAngL(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #0EA5E9 ${((angL() - 40) / 210) * 100}%, var(--border) ${((angL() - 40) / 210) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "75px" }}>E = {energy().toFixed(2)}</label>
          <input type="range" min="-5" max="1" step="0.05" value={energy()} onInput={(e) => setEnergy(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #0EA5E9 ${((energy() + 5) / 6) * 100}%, var(--border) ${((energy() + 5) / 6) * 100}%)` }} />
        </div>
      </div>

      <svg width="100%" height="280" viewBox={`0 0 ${svgW} ${svgH}`} class="mx-auto">
        <text x={svgW / 2} y="16" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Effective Potential V_eff(r)</text>

        {/* Axes */}
        <line x1={padL} y1={padT} x2={padL} y2={svgH - padB} stroke="var(--border)" stroke-width="1" />
        <line x1={padL} y1={svgH - padB} x2={svgW - padR} y2={svgH - padB} stroke="var(--border)" stroke-width="1" />
        <text x={svgW / 2} y={svgH - 5} text-anchor="middle" font-size="9" fill="var(--text-muted)">r</text>
        <text x="12" y={svgH / 2} text-anchor="middle" font-size="9" fill="var(--text-muted)" transform={`rotate(-90,12,${svgH / 2})`}>V_eff</text>

        {/* Zero line */}
        {vRange().min < 0 && vRange().max > 0 && (
          <line x1={padL} y1={toSvgY(0)} x2={svgW - padR} y2={toSvgY(0)} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
        )}

        {/* Forbidden region shading */}
        {forbiddenPath().map(d => (
          <path d={d} fill="#ef4444" opacity="0.12" />
        ))}

        {/* V_eff curve */}
        <path d={curvePath()} fill="none" stroke="#0EA5E9" stroke-width="2" />

        {/* Energy line */}
        <line x1={padL} y1={toSvgY(energy())} x2={svgW - padR} y2={toSvgY(energy())} stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="5 3" />
        <text x={svgW - padR + 2} y={toSvgY(energy()) + 3} font-size="8" fill="#f59e0b">E</text>

        {/* Turning points */}
        {turningPoints().map(r => (
          <circle cx={toSvgX(r)} cy={toSvgY(energy())} r="4" fill="#ef4444" stroke="white" stroke-width="1" />
        ))}

        {/* Circular orbit marker */}
        {rCircular() > rMin && rCircular() < rMax && (
          <>
            <line x1={toSvgX(rCircular())} y1={padT} x2={toSvgX(rCircular())} y2={svgH - padB}
              stroke="#10b981" stroke-width="1" stroke-dasharray="3 3" opacity="0.6" />
            <circle cx={toSvgX(rCircular())} cy={toSvgY(vAtCircular())} r="5" fill="none" stroke="#10b981" stroke-width="2" />
            <text x={toSvgX(rCircular())} y={svgH - padB + 12} text-anchor="middle" font-size="7" fill="#10b981">r_c</text>
          </>
        )}
      </svg>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>r_min</div>
          <div class="text-lg font-bold" style={{ color: "#ef4444" }}>
            {turningPoints().length >= 1 ? turningPoints()[0].toFixed(1) : "---"}
          </div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>r_max</div>
          <div class="text-lg font-bold" style={{ color: "#ef4444" }}>
            {turningPoints().length >= 2 ? turningPoints()[1].toFixed(1) : "---"}
          </div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>r_circular</div>
          <div class="text-lg font-bold" style={{ color: "#10b981" }}>{rCircular().toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
};


// ─── C3ForceLawVariation ───────────────────────────────────────────────────────
// Orbits with variable force-law exponent n: F proportional to -1/r^n
export const C3ForceLawVariation: Component = () => {
  const GM = 1000;
  const dt = 0.05;
  const stepsPerFrame = 5;
  const maxTrail = 1000;
  const cx = 210, cy = 175;
  const scale = 0.85;

  const [nExp, setNExp] = createSignal(2.0);
  const [v0, setV0] = createSignal(2.5);
  const [playing, setPlaying] = createSignal(false);

  const initR = 160;
  let posX = initR, posY = 0;
  let velX = 0, velY = v0();
  let trail: { x: number; y: number }[] = [{ x: posX, y: posY }];

  const [trailPts, setTrailPts] = createSignal<{ x: number; y: number }[]>([{ x: posX, y: posY }]);
  const [curPos, setCurPos] = createSignal({ x: posX, y: posY });

  function accelN(px: number, py: number, n: number) {
    const r2 = px * px + py * py;
    const r = Math.sqrt(r2);
    // F = -GM/r^n => a_component = -GM * px / r^(n+1)
    const rn1 = Math.pow(r, n + 1);
    const a = -GM / rn1;
    return { ax: a * px, ay: a * py };
  }

  function stepVerlet() {
    const n = nExp();
    let { ax, ay } = accelN(posX, posY, n);
    posX += velX * dt + 0.5 * ax * dt * dt;
    posY += velY * dt + 0.5 * ay * dt * dt;
    const newA = accelN(posX, posY, n);
    velX += 0.5 * (ax + newA.ax) * dt;
    velY += 0.5 * (ay + newA.ay) * dt;
  }

  // Orbital properties
  const orbitInfo = createMemo(() => {
    const x = curPos().x, y = curPos().y;
    const r = Math.sqrt(x * x + y * y);
    const v2 = velX * velX + velY * velY;
    const L = Math.abs(x * velY - y * velX);
    const n = nExp();
    const closes = Math.abs(n - 2) < 0.001;
    return { r, v: Math.sqrt(v2), L, closes };
  });

  function resetSim() {
    posX = initR; posY = 0;
    velX = 0; velY = v0();
    trail = [{ x: posX, y: posY }];
    setTrailPts([...trail]);
    setCurPos({ x: posX, y: posY });
  }

  let animFrame: number | undefined;
  const animate = () => {
    const loop = () => {
      if (!playing()) return;
      for (let i = 0; i < stepsPerFrame; i++) stepVerlet();
      trail.push({ x: posX, y: posY });
      if (trail.length > maxTrail) trail.shift();
      setTrailPts([...trail]);
      setCurPos({ x: posX, y: posY });
      animFrame = requestAnimationFrame(loop);
    };
    animFrame = requestAnimationFrame(loop);
  };

  const togglePlay = () => {
    setPlaying(!playing());
    if (playing()) animate();
  };

  onCleanup(() => animFrame && cancelAnimationFrame(animFrame));

  // Trail with segment-level fading for rosette visibility
  const trailPath = createMemo(() => {
    const pts = trailPts();
    if (pts.length < 2) return "";
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${(cx + p.x * scale).toFixed(1)},${(cy - p.y * scale).toFixed(1)}`).join(" ");
  });

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "65px" }}>n = {nExp().toFixed(1)}</label>
          <input type="range" min="1" max="4" step="0.1" value={nExp()} onInput={(e) => setNExp(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #0EA5E9 ${((nExp() - 1) / 3) * 100}%, var(--border) ${((nExp() - 1) / 3) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "65px" }}>v₀ = {v0().toFixed(1)}</label>
          <input type="range" min="0.5" max="4" step="0.1" value={v0()} onInput={(e) => setV0(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #0EA5E9 ${((v0() - 0.5) / 3.5) * 100}%, var(--border) ${((v0() - 0.5) / 3.5) * 100}%)` }} />
        </div>
      </div>

      <div class="flex gap-2 justify-center">
        <button class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#0EA5E9", color: "white" }}
          onClick={togglePlay}>{playing() ? "Pause" : "Play"}</button>
        <button class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#0EA5E9", color: "white" }}
          onClick={() => { setPlaying(false); resetSim(); }}>Reset</button>
      </div>

      <svg width="100%" height="350" viewBox="0 0 420 350" class="mx-auto">
        <rect x="0" y="0" width="420" height="350" fill="none" />
        <text x="210" y="16" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          {"F \u221D 1/r"}
          <tspan baseline-shift="super" font-size="7">{nExp().toFixed(1)}</tspan>
          {" — "}
          {Math.abs(nExp() - 2) < 0.001 ? "Closed Orbit (Kepler)" : "Rosette / Precessing Orbit"}
        </text>

        {/* Central body */}
        <circle cx={cx} cy={cy} r="8" fill="#facc15" stroke="#eab308" stroke-width="1.5" />

        {/* Orbit trail */}
        {trailPts().length > 1 && (
          <path d={trailPath()} fill="none" stroke="#0EA5E9" stroke-width="1.2" opacity="0.45" />
        )}

        {/* Orbiting body */}
        <circle cx={cx + curPos().x * scale} cy={cy - curPos().y * scale} r="5" fill="#0EA5E9" stroke="#0284c7" stroke-width="1" />

        {/* Axes */}
        <line x1="15" y1={cy} x2="405" y2={cy} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
        <line x1={cx} y1="25" x2={cx} y2="340" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
      </svg>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Radius r</div>
          <div class="text-lg font-bold" style={{ color: "#0EA5E9" }}>{orbitInfo().r.toFixed(1)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Speed |v|</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>{orbitInfo().v.toFixed(3)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Closed Orbit?</div>
          <div class="text-lg font-bold" style={{ color: orbitInfo().closes ? "#10b981" : "#ef4444" }}>
            {orbitInfo().closes ? "Yes (Bertrand)" : "No"}
          </div>
        </div>
      </div>
    </div>
  );
};
