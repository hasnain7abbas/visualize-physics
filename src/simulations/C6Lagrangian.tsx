import { Component, createSignal, createMemo, onCleanup } from "solid-js";

// ─── C6AtwoodMachine ───────────────────────────────────────────────────────
// Atwood machine via Lagrangian mechanics: L = ½(m₁+m₂)q̇² − (m₁−m₂)gq
export const C6AtwoodMachine: Component = () => {
  const [m1, setM1] = createSignal(6);
  const [m2, setM2] = createSignal(3);
  const [playing, setPlaying] = createSignal(false);
  const [time, setTime] = createSignal(0);

  const g = 9.8;

  const accel = createMemo(() => ((m1() - m2()) * g) / (m1() + m2()));
  const velocity = createMemo(() => accel() * time());
  const displacement = createMemo(() => 0.5 * accel() * time() * time());

  // SVG dimensions
  const svgW = 420, svgH = 280;
  const pulleyX = svgW / 2, pulleyY = 42, pulleyR = 18;
  const restY = 160; // neutral mass Y position
  const maxDisp = 80; // max pixel displacement

  // Map displacement to pixel offset (clamped)
  const pixelDisp = createMemo(() => {
    const d = displacement();
    const scale = 3.5; // pixels per meter
    return Math.max(-maxDisp, Math.min(maxDisp, d * scale));
  });

  // Left mass (m1): positive displacement means m1 falls => y increases
  const m1Y = createMemo(() => restY + pixelDisp());
  // Right mass (m2): rises
  const m2Y = createMemo(() => restY - pixelDisp());

  const leftStringX = pulleyX - 60;
  const rightStringX = pulleyX + 60;

  let animFrame: number | undefined;

  const step = () => {
    setTime((t) => t + 0.016);
    // Stop if a mass hits boundary
    const pDisp = Math.abs(displacement() * 3.5);
    if (pDisp >= maxDisp) {
      setPlaying(false);
      return;
    }
    animFrame = requestAnimationFrame(step);
  };

  const startAnim = () => {
    if (playing()) return;
    setPlaying(true);
    animFrame = requestAnimationFrame(step);
  };

  const pauseAnim = () => {
    setPlaying(false);
    if (animFrame) cancelAnimationFrame(animFrame);
  };

  const resetAnim = () => {
    pauseAnim();
    setTime(0);
  };

  onCleanup(() => { if (animFrame) cancelAnimationFrame(animFrame); });

  // String path over pulley (left side goes up-over to right side)
  const leftTangentY = pulleyY + pulleyR;
  const rightTangentY = pulleyY + pulleyR;

  return (
    <div class="space-y-5">
      {/* Sliders */}
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "65px" }}>m₁ = {m1()} kg</label>
          <input type="range" min="1" max="10" step="0.5" value={m1()}
            onInput={(e) => { setM1(parseFloat(e.currentTarget.value)); resetAnim(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #F59E0B ${((m1() - 1) / 9) * 100}%, var(--border) ${((m1() - 1) / 9) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "65px" }}>m₂ = {m2()} kg</label>
          <input type="range" min="1" max="10" step="0.5" value={m2()}
            onInput={(e) => { setM2(parseFloat(e.currentTarget.value)); resetAnim(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #F59E0B ${((m2() - 1) / 9) * 100}%, var(--border) ${((m2() - 1) / 9) * 100}%)` }} />
        </div>
      </div>

      {/* SVG Visualization */}
      <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} class="mx-auto">
        {/* Support beam */}
        <rect x={pulleyX - 50} y="2" width="100" height="6" rx="2" fill="var(--text-muted)" opacity="0.5" />
        <line x1={pulleyX} y1="8" x2={pulleyX} y2={pulleyY - pulleyR} stroke="var(--text-muted)" stroke-width="2" />

        {/* Pulley */}
        <circle cx={pulleyX} cy={pulleyY} r={pulleyR} fill="none" stroke="#F59E0B" stroke-width="3" />
        <circle cx={pulleyX} cy={pulleyY} r="4" fill="#F59E0B" />

        {/* Left string: from m1 up to left tangent of pulley, arc over, down to m2 */}
        {/* Left vertical string */}
        <line x1={leftStringX} y1={m1Y() - 18} x2={leftStringX} y2={leftTangentY}
          stroke="var(--text-secondary)" stroke-width="1.5" />
        {/* String over pulley (arc from left tangent to right tangent) */}
        <path d={`M ${leftStringX},${leftTangentY}
                   Q ${leftStringX},${pulleyY - pulleyR * 0.3} ${pulleyX - pulleyR * 0.3},${pulleyY - pulleyR}
                   A ${pulleyR} ${pulleyR} 0 0 1 ${pulleyX + pulleyR * 0.3},${pulleyY - pulleyR}
                   Q ${rightStringX},${pulleyY - pulleyR * 0.3} ${rightStringX},${rightTangentY}`}
          fill="none" stroke="var(--text-secondary)" stroke-width="1.5" />
        {/* Right vertical string */}
        <line x1={rightStringX} y1={rightTangentY} x2={rightStringX} y2={m2Y() - 18}
          stroke="var(--text-secondary)" stroke-width="1.5" />

        {/* Mass 1 (left) */}
        <rect x={leftStringX - 22} y={m1Y() - 18} width="44" height="36" rx="4"
          fill="#F59E0B" opacity="0.85" />
        <text x={leftStringX} y={m1Y() + 4} text-anchor="middle" font-size="11" font-weight="700" fill="white">
          m₁
        </text>

        {/* Mass 2 (right) */}
        <rect x={rightStringX - 22} y={m2Y() - 18} width="44" height="36" rx="4"
          fill="#D97706" opacity="0.85" />
        <text x={rightStringX} y={m2Y() + 4} text-anchor="middle" font-size="11" font-weight="700" fill="white">
          m₂
        </text>

        {/* Lagrangian equation */}
        <text x={svgW / 2} y={svgH - 18} text-anchor="middle" font-size="9" fill="var(--text-muted)">
          L = ½(m₁+m₂)q̇² − (m₁−m₂)gq  |  a = (m₁−m₂)g / (m₁+m₂)
        </text>

        {/* Direction arrows */}
        {accel() > 0.1 && (
          <>
            <polygon points={`${leftStringX - 32},${m1Y() + 26} ${leftStringX - 38},${m1Y() + 18} ${leftStringX - 26},${m1Y() + 18}`} fill="#F59E0B" opacity="0.7" />
            <polygon points={`${rightStringX + 32},${m2Y() - 26} ${rightStringX + 38},${m2Y() - 18} ${rightStringX + 26},${m2Y() - 18}`} fill="#D97706" opacity="0.7" />
          </>
        )}
        {accel() < -0.1 && (
          <>
            <polygon points={`${leftStringX - 32},${m1Y() - 26} ${leftStringX - 38},${m1Y() - 18} ${leftStringX - 26},${m1Y() - 18}`} fill="#F59E0B" opacity="0.7" />
            <polygon points={`${rightStringX + 32},${m2Y() + 26} ${rightStringX + 38},${m2Y() + 18} ${rightStringX + 26},${m2Y() + 18}`} fill="#D97706" opacity="0.7" />
          </>
        )}
      </svg>

      {/* Controls */}
      <div class="flex justify-center gap-3">
        <button onClick={startAnim}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#F59E0B", color: "white" }}>
          Play
        </button>
        <button onClick={pauseAnim}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#F59E0B", color: "white" }}>
          Pause
        </button>
        <button onClick={resetAnim}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#F59E0B", color: "white" }}>
          Reset
        </button>
      </div>

      {/* Stat cards */}
      <div class="grid grid-cols-4 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Accel (m/s²)</div>
          <div class="text-lg font-bold" style={{ color: "#F59E0B" }}>{accel().toFixed(2)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>v(t) (m/s)</div>
          <div class="text-lg font-bold" style={{ color: "#F59E0B" }}>{velocity().toFixed(2)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>q(t) (m)</div>
          <div class="text-lg font-bold" style={{ color: "#F59E0B" }}>{displacement().toFixed(2)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Time (s)</div>
          <div class="text-lg font-bold" style={{ color: "#F59E0B" }}>{time().toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

// ─── C6BeadOnHoop ──────────────────────────────────────────────────────────
// Bead on a rotating hoop — pitchfork bifurcation at ω_c = √(g/R)
export const C6BeadOnHoop: Component = () => {
  const [omega, setOmega] = createSignal(2.0);
  const R = 1.0;
  const g = 9.8;
  const m = 1.0;

  const omegaC = Math.sqrt(g / R); // ~3.13 rad/s

  // Equilibrium angle
  const thetaEq = createMemo(() => {
    const w = omega();
    if (w <= omegaC) return 0;
    const cosVal = g / (R * w * w);
    return Math.acos(Math.max(-1, Math.min(1, cosVal)));
  });

  // Stability: stable at bottom when omega < omega_c; stable at thetaEq when omega > omega_c
  const isAboveCritical = createMemo(() => omega() > omegaC);
  const stabilityLabel = createMemo(() => {
    if (!isAboveCritical()) return "STABLE at θ=0";
    return "BIFURCATED";
  });

  // Effective potential V_eff(theta) for plotting
  // V_eff(θ) = -½mR²ω²sin²θ + mgR(1-cosθ)
  const potentialCurve = createMemo(() => {
    const w = omega();
    const pts: { theta: number; V: number }[] = [];
    for (let i = 0; i <= 100; i++) {
      const theta = (i / 100) * Math.PI - Math.PI / 2; // -π/2 to π/2
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);
      const V = -0.5 * m * R * R * w * w * sinT * sinT + m * g * R * (1 - cosT);
      pts.push({ theta, V });
    }
    return pts;
  });

  const potentialRange = createMemo(() => {
    const pts = potentialCurve();
    let minV = Infinity, maxV = -Infinity;
    for (const p of pts) {
      if (p.V < minV) minV = p.V;
      if (p.V > maxV) maxV = p.V;
    }
    const pad = (maxV - minV) * 0.1 || 1;
    return { min: minV - pad, max: maxV + pad };
  });

  // SVG layout
  const hoopCX = 150, hoopCY = 150, hoopR = 90;
  const plotX0 = 270, plotY0 = 30, plotW = 135, plotH = 200;

  // Bead position on the hoop
  const beadX = createMemo(() => hoopCX + hoopR * Math.sin(thetaEq()));
  const beadY = createMemo(() => hoopCY + hoopR * Math.cos(thetaEq()));

  // Also show the symmetric equilibrium if above critical
  const beadX2 = createMemo(() => hoopCX - hoopR * Math.sin(thetaEq()));
  const beadY2 = createMemo(() => hoopCY + hoopR * Math.cos(thetaEq()));

  // Potential plot path
  const potPath = createMemo(() => {
    const pts = potentialCurve();
    const { min, max } = potentialRange();
    return pts.map((p, i) => {
      const px = plotX0 + (i / 100) * plotW;
      const py = plotY0 + plotH - ((p.V - min) / (max - min)) * plotH;
      return `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`;
    }).join(" ");
  });

  // Mark equilibrium theta on the potential plot
  const eqPlotX = createMemo(() => {
    const th = thetaEq();
    const frac = (th + Math.PI / 2) / Math.PI;
    return plotX0 + frac * plotW;
  });

  const sliderPct = createMemo(() => (omega() / 5) * 100);
  const critPct = (omegaC / 5) * 100;

  return (
    <div class="space-y-5">
      {/* Omega slider with critical marker */}
      <div class="flex items-center gap-2">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "85px" }}>
          ω = {omega().toFixed(2)} rad/s
        </label>
        <div class="flex-1 relative">
          <input type="range" min="0" max="5" step="0.05" value={omega()}
            onInput={(e) => setOmega(parseFloat(e.currentTarget.value))}
            class="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #F59E0B ${sliderPct()}%, var(--border) ${sliderPct()}%)` }} />
          {/* Critical omega marker */}
          <div style={{
            position: "absolute", left: `${critPct}%`, top: "-14px",
            transform: "translateX(-50%)", "font-size": "8px", color: "#ef4444",
            "font-weight": "600", "white-space": "nowrap"
          }}>
            ω_c={omegaC.toFixed(2)}
          </div>
          <div style={{
            position: "absolute", left: `${critPct}%`, top: "10px",
            width: "2px", height: "8px", background: "#ef4444",
            transform: "translateX(-50%)"
          }} />
        </div>
      </div>

      {/* SVG: hoop + bead + potential plot */}
      <svg width="100%" height="300" viewBox={`0 0 420 300`} class="mx-auto">
        {/* Hoop */}
        <circle cx={hoopCX} cy={hoopCY} r={hoopR} fill="none" stroke="var(--border)" stroke-width="2.5" />
        {/* Axis line (vertical) */}
        <line x1={hoopCX} y1={hoopCY - hoopR - 15} x2={hoopCX} y2={hoopCY + hoopR + 15}
          stroke="var(--text-muted)" stroke-width="0.8" stroke-dasharray="4 3" />
        {/* Rotation arrows */}
        <path d={`M ${hoopCX - 25},${hoopCY - hoopR - 12} A 25 10 0 0 1 ${hoopCX + 25},${hoopCY - hoopR - 12}`}
          fill="none" stroke="#F59E0B" stroke-width="1.2" marker-end="url(#arrowBead)" />
        <defs>
          <marker id="arrowBead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#F59E0B" />
          </marker>
        </defs>
        <text x={hoopCX} y={hoopCY - hoopR - 18} text-anchor="middle" font-size="8" fill="#F59E0B" font-weight="600">ω</text>

        {/* Angle θ arc */}
        {thetaEq() > 0.02 && (
          <>
            <path d={`M ${hoopCX},${hoopCY + 30} A 30 30 0 0 1 ${hoopCX + 30 * Math.sin(thetaEq())},${hoopCY + 30 * Math.cos(thetaEq())}`}
              fill="none" stroke="#F59E0B" stroke-width="1" />
            <text x={hoopCX + 18} y={hoopCY + 42} font-size="9" fill="#F59E0B">θ</text>
          </>
        )}

        {/* Bead at equilibrium (primary) */}
        <circle cx={beadX()} cy={beadY()} r="9" fill="#F59E0B" stroke="white" stroke-width="2" />
        {/* Mirror bead if above critical */}
        {isAboveCritical() && thetaEq() > 0.05 && (
          <circle cx={beadX2()} cy={beadY2()} r="9" fill="#F59E0B" stroke="white" stroke-width="2" opacity="0.55" />
        )}
        {/* Bottom marker (unstable above ω_c) */}
        {isAboveCritical() && (
          <circle cx={hoopCX} cy={hoopCY + hoopR} r="5"
            fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 2" />
        )}

        {/* Potential plot area */}
        <rect x={plotX0 - 5} y={plotY0 - 5} width={plotW + 10} height={plotH + 25}
          fill="var(--bg-secondary)" rx="6" stroke="var(--border)" stroke-width="1" />
        <text x={plotX0 + plotW / 2} y={plotY0 + 8} text-anchor="middle" font-size="8" font-weight="600" fill="var(--text-muted)">
          V_eff(θ)
        </text>

        {/* Potential curve */}
        <path d={potPath()} fill="none" stroke="#F59E0B" stroke-width="1.8" />

        {/* Equilibrium marker on potential plot */}
        <circle cx={eqPlotX()} cy={(() => {
          const th = thetaEq();
          const w = omega();
          const sinT = Math.sin(th);
          const cosT = Math.cos(th);
          const V = -0.5 * m * R * R * w * w * sinT * sinT + m * g * R * (1 - cosT);
          const { min, max } = potentialRange();
          return plotY0 + plotH - ((V - min) / (max - min)) * plotH;
        })()} r="4" fill="#F59E0B" stroke="white" stroke-width="1.5" />

        {/* θ axis labels */}
        <text x={plotX0} y={plotY0 + plotH + 18} font-size="7" fill="var(--text-muted)">-π/2</text>
        <text x={plotX0 + plotW} y={plotY0 + plotH + 18} font-size="7" fill="var(--text-muted)" text-anchor="end">π/2</text>
        <text x={plotX0 + plotW / 2} y={plotY0 + plotH + 18} font-size="7" fill="var(--text-muted)" text-anchor="middle">0</text>

        {/* Stability label */}
        <rect x={hoopCX - 48} y={hoopCY + hoopR + 24} width="96" height="20" rx="10"
          fill={isAboveCritical() ? "#ef4444" : "#22c55e"} opacity="0.15" />
        <text x={hoopCX} y={hoopCY + hoopR + 38} text-anchor="middle" font-size="9" font-weight="700"
          fill={isAboveCritical() ? "#ef4444" : "#22c55e"}>
          {isAboveCritical() ? "θ=0 UNSTABLE" : "θ=0 STABLE"}
        </text>
      </svg>

      {/* Stats */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>ω / ω_c</div>
          <div class="text-lg font-bold" style={{ color: "#F59E0B" }}>{(omega() / omegaC).toFixed(2)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>θ_eq (°)</div>
          <div class="text-lg font-bold" style={{ color: "#F59E0B" }}>{((thetaEq() * 180) / Math.PI).toFixed(1)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>ω_c (rad/s)</div>
          <div class="text-lg font-bold" style={{ color: "#F59E0B" }}>{omegaC.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

// ─── C6SlidingWedge ────────────────────────────────────────────────────────
// Block sliding down a frictionless wedge that recoils on a frictionless floor
export const C6SlidingWedge: Component = () => {
  const [M, setMW] = createSignal(10);   // wedge mass
  const [mb, setMb] = createSignal(3);    // block mass
  const [alpha, setAlpha] = createSignal(40); // wedge angle in degrees
  const [playing, setPlaying] = createSignal(false);
  const [time, setTime] = createSignal(0);

  const g = 9.8;
  const alphaRad = createMemo(() => (alpha() * Math.PI) / 180);

  // Block acceleration along the slope: s̈ = g sinα / (1 - m cos²α/(M+m))
  const sAccel = createMemo(() => {
    const a = alphaRad();
    const cosA = Math.cos(a);
    const sinA = Math.sin(a);
    const denom = 1 - (mb() * cosA * cosA) / (M() + mb());
    return (g * sinA) / denom;
  });

  // Wedge acceleration: Ẍ = -m·s̈·cosα / (M+m)
  const wedgeAccel = createMemo(() => {
    return -(mb() * sAccel() * Math.cos(alphaRad())) / (M() + mb());
  });

  // Time-dependent quantities
  const sDisp = createMemo(() => 0.5 * sAccel() * time() * time());
  const wedgeDisp = createMemo(() => 0.5 * wedgeAccel() * time() * time());
  const sVel = createMemo(() => sAccel() * time());
  const wedgeVel = createMemo(() => wedgeAccel() * time());

  // Momentum check: should be ~0
  const momentum = createMemo(() => {
    return (M() + mb()) * wedgeVel() + mb() * sVel() * Math.cos(alphaRad());
  });

  // SVG
  const svgW = 420, svgH = 250;
  // Wedge geometry (triangle)
  const wedgeBaseW = 160;
  const wedgeH = createMemo(() => wedgeBaseW * Math.tan(alphaRad()));
  const clampedH = createMemo(() => Math.min(wedgeH(), 180));
  const effectiveBaseW = createMemo(() => clampedH() / Math.tan(alphaRad()));

  const floorY = 210;
  // Wedge base position (shifts with wedgeDisp)
  const pixScale = 4; // pixels per meter
  const wedgeXBase = createMemo(() => 140 + wedgeDisp() * pixScale);

  // Wedge vertices (right-angled triangle: right angle at bottom-left)
  const wX0 = createMemo(() => wedgeXBase()); // bottom-left
  const wY0 = floorY;
  const wX1 = createMemo(() => wedgeXBase() + effectiveBaseW()); // bottom-right
  const wY1 = floorY;
  const wX2 = createMemo(() => wedgeXBase()); // top-left
  const wY2 = createMemo(() => floorY - clampedH());

  // Block position along the slope
  // s is distance along slope from top. Block starts at top.
  const blockSlopePos = createMemo(() => Math.min(sDisp() * pixScale, effectiveBaseW() / Math.cos(alphaRad()) - 15));
  const blockX = createMemo(() => {
    const s = blockSlopePos();
    const a = alphaRad();
    return wX2() + s * Math.cos(a);
  });
  const blockY = createMemo(() => {
    const s = blockSlopePos();
    const a = alphaRad();
    return wY2() + s * Math.sin(a);
  });

  let animFrame: number | undefined;

  const step = () => {
    setTime((t) => t + 0.016);
    // Stop when block reaches bottom of wedge
    const sMax = effectiveBaseW() / Math.cos(alphaRad()) - 15;
    if (sDisp() * pixScale >= sMax) {
      setPlaying(false);
      return;
    }
    animFrame = requestAnimationFrame(step);
  };

  const startAnim = () => {
    if (playing()) return;
    setPlaying(true);
    animFrame = requestAnimationFrame(step);
  };

  const pauseAnim = () => {
    setPlaying(false);
    if (animFrame) cancelAnimationFrame(animFrame);
  };

  const resetAnim = () => {
    pauseAnim();
    setTime(0);
  };

  onCleanup(() => { if (animFrame) cancelAnimationFrame(animFrame); });

  return (
    <div class="space-y-5">
      {/* Sliders */}
      <div class="grid grid-cols-3 gap-3">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>M = {M()} kg</label>
          <input type="range" min="1" max="20" step="0.5" value={M()}
            onInput={(e) => { setMW(parseFloat(e.currentTarget.value)); resetAnim(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #F59E0B ${((M() - 1) / 19) * 100}%, var(--border) ${((M() - 1) / 19) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "58px" }}>m = {mb()} kg</label>
          <input type="range" min="1" max="10" step="0.5" value={mb()}
            onInput={(e) => { setMb(parseFloat(e.currentTarget.value)); resetAnim(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #F59E0B ${((mb() - 1) / 9) * 100}%, var(--border) ${((mb() - 1) / 9) * 100}%)` }} />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "52px" }}>α = {alpha()}°</label>
          <input type="range" min="15" max="75" step="1" value={alpha()}
            onInput={(e) => { setAlpha(parseInt(e.currentTarget.value)); resetAnim(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #F59E0B ${((alpha() - 15) / 60) * 100}%, var(--border) ${((alpha() - 15) / 60) * 100}%)` }} />
        </div>
      </div>

      {/* SVG */}
      <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} class="mx-auto">
        {/* Floor */}
        <line x1="0" y1={floorY} x2={svgW} y2={floorY} stroke="var(--text-muted)" stroke-width="1.5" />
        {/* Floor hatching */}
        {Array.from({ length: 21 }, (_, i) => (
          <line x1={i * 22} y1={floorY} x2={i * 22 - 8} y2={floorY + 8}
            stroke="var(--text-muted)" stroke-width="0.7" opacity="0.5" />
        ))}

        {/* Wedge (triangle) */}
        <polygon points={`${wX0()},${wY0} ${wX1()},${wY1} ${wX2()},${wY2()}`}
          fill="#F59E0B" opacity="0.18" stroke="#F59E0B" stroke-width="2" stroke-linejoin="round" />
        {/* Wedge label */}
        <text x={(wX0() + wX1() + wX2()) / 3} y={(wY0 + wY1 + wY2()) / 3 + 8}
          text-anchor="middle" font-size="11" font-weight="700" fill="#F59E0B" opacity="0.7">
          M
        </text>

        {/* Angle arc */}
        <path d={`M ${wX1() - 25},${wY1} A 25 25 0 0 0 ${wX1() - 25 * Math.cos(alphaRad())},${wY1 - 25 * Math.sin(alphaRad())}`}
          fill="none" stroke="#F59E0B" stroke-width="1" />
        <text x={wX1() - 32} y={wY1 - 6} font-size="9" fill="#F59E0B" font-weight="600">α</text>

        {/* Block on the slope */}
        <g transform={`translate(${blockX()}, ${blockY()}) rotate(${-alpha()})`}>
          <rect x="-12" y="-20" width="24" height="20" rx="3"
            fill="#D97706" stroke="#92400e" stroke-width="1" />
          <text x="0" y="-7" text-anchor="middle" font-size="8" font-weight="700" fill="white">m</text>
        </g>

        {/* Wedge recoil arrow */}
        {time() > 0.05 && (
          <>
            <line x1={wX0() + effectiveBaseW() / 2} y1={floorY + 16}
              x2={wX0() + effectiveBaseW() / 2 + wedgeDisp() * pixScale * 5} y2={floorY + 16}
              stroke="#F59E0B" stroke-width="1.5" marker-end="url(#arrowWedge)" />
            <text x={wX0() + effectiveBaseW() / 2} y={floorY + 28} text-anchor="middle" font-size="7" fill="var(--text-muted)">
              Wedge recoil
            </text>
          </>
        )}
        <defs>
          <marker id="arrowWedge" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#F59E0B" />
          </marker>
        </defs>

        {/* Lagrangian text */}
        <text x={svgW / 2} y={18} text-anchor="middle" font-size="8" fill="var(--text-muted)">
          (M+m)Ẍ + m·s̈·cosα = 0  |  m·s̈ + m·Ẍ·cosα = mg·sinα
        </text>

        {/* Momentum conservation note */}
        <text x={svgW / 2} y={svgH - 5} text-anchor="middle" font-size="8" fill="var(--text-muted)">
          P_total = (M+m)Ẋ + mṡ·cosα = 0 (conserved, started from rest)
        </text>
      </svg>

      {/* Controls */}
      <div class="flex justify-center gap-3">
        <button onClick={startAnim}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#F59E0B", color: "white" }}>
          Play
        </button>
        <button onClick={pauseAnim}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#F59E0B", color: "white" }}>
          Pause
        </button>
        <button onClick={resetAnim}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#F59E0B", color: "white" }}>
          Reset
        </button>
      </div>

      {/* Stats */}
      <div class="grid grid-cols-4 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>s̈ (m/s²)</div>
          <div class="text-lg font-bold" style={{ color: "#F59E0B" }}>{sAccel().toFixed(2)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Ẍ (m/s²)</div>
          <div class="text-lg font-bold" style={{ color: "#F59E0B" }}>{wedgeAccel().toFixed(2)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>P total</div>
          <div class="text-lg font-bold" style={{ color: "#F59E0B" }}>{momentum().toFixed(4)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Time (s)</div>
          <div class="text-lg font-bold" style={{ color: "#F59E0B" }}>{time().toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};
