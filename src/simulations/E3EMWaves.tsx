import { Component, createSignal, createMemo, onCleanup, For } from "solid-js";

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCENT = "#06b6d4";
const E_COLOR = "#f97316"; // orange for E field
const B_COLOR = "#3b82f6"; // blue for B field
const S_COLOR = "#10b981"; // green for Poynting vector
const c = 3e8; // speed of light m/s
const mu0 = 4 * Math.PI * 1e-7;
const eps0 = 8.854e-12;

// ─── E3PlaneWave ──────────────────────────────────────────────────────────────
// Animated electromagnetic plane wave propagation in 3D-style perspective view
export const E3PlaneWave: Component = () => {
  const [wavelength, setWavelength] = createSignal(120); // px units for visualization
  const [amplitude, setAmplitude] = createSignal(50);
  const [speed, setSpeed] = createSignal(1.0);
  const [playing, setPlaying] = createSignal(true);
  const [time, setTime] = createSignal(0);

  const k = createMemo(() => (2 * Math.PI) / wavelength());
  const omega = createMemo(() => k() * speed() * 60); // scaled for animation
  const frequency = createMemo(() => omega() / (2 * Math.PI));

  let animFrame: number | undefined;
  let lastTs: number | undefined;

  const step = (ts: number) => {
    if (lastTs === undefined) lastTs = ts;
    if (playing()) {
      const dt = (ts - lastTs) / 1000;
      setTime((t) => t + dt * speed());
    }
    lastTs = ts;
    animFrame = requestAnimationFrame(step);
  };
  animFrame = requestAnimationFrame(step);
  onCleanup(() => { if (animFrame !== undefined) cancelAnimationFrame(animFrame); });

  const reset = () => { setTime(0); lastTs = undefined; };

  // SVG dimensions
  const W = 420, H = 340;
  const axisY = 170; // center line (propagation axis z)
  const axisXStart = 30, axisXEnd = 400;
  const perspectiveScale = 0.45; // how much B field is foreshortened for depth effect

  // Generate wave points for E field (vertical oscillation)
  const eWavePoints = createMemo(() => {
    const pts: { z: number; val: number }[] = [];
    const t = time();
    const kv = k();
    const w = omega();
    const amp = amplitude();
    for (let px = axisXStart; px <= axisXEnd; px += 2) {
      const z = px - axisXStart;
      const val = amp * Math.sin(kv * z - w * t);
      pts.push({ z: px, val });
    }
    return pts;
  });

  // Generate wave points for B field (horizontal/depth oscillation)
  const bWavePoints = createMemo(() => {
    const pts: { z: number; val: number }[] = [];
    const t = time();
    const kv = k();
    const w = omega();
    const amp = amplitude() * perspectiveScale;
    for (let px = axisXStart; px <= axisXEnd; px += 2) {
      const z = px - axisXStart;
      const val = amp * Math.sin(kv * z - w * t);
      pts.push({ z: px, val });
    }
    return pts;
  });

  // Path string for E wave
  const eWavePath = createMemo(() => {
    const pts = eWavePoints();
    if (pts.length === 0) return "";
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.z.toFixed(1)},${(axisY - p.val).toFixed(1)}`).join(" ");
  });

  // Path string for B wave (perspective: oscillates along a diagonal to simulate depth)
  const bWavePath = createMemo(() => {
    const pts = bWavePoints();
    if (pts.length === 0) return "";
    // B oscillates "into/out of screen" - we simulate by moving along a 45-deg perspective axis
    return pts.map((p, i) => {
      const bx = p.z + p.val * 0.5; // slight horizontal shift for depth
      const by = axisY + p.val * 0.7; // slight vertical shift for depth
      return `${i === 0 ? "M" : "L"}${bx.toFixed(1)},${by.toFixed(1)}`;
    }).join(" ");
  });

  // Arrow markers at discrete points along the waves
  const arrowPoints = createMemo(() => {
    const t = time();
    const kv = k();
    const w = omega();
    const amp = amplitude();
    const bAmp = amplitude() * perspectiveScale;
    const arrows: { z: number; eVal: number; bVal: number }[] = [];
    const spacing = wavelength() / 6;
    for (let px = axisXStart; px <= axisXEnd; px += Math.max(spacing, 15)) {
      const z = px - axisXStart;
      const eVal = amp * Math.sin(kv * z - w * t);
      const bVal = bAmp * Math.sin(kv * z - w * t);
      arrows.push({ z: px, eVal, bVal });
    }
    return arrows;
  });

  const wlPct = () => ((wavelength() - 40) / 200) * 100;
  const ampPct = () => ((amplitude() - 15) / 65) * 100;
  const spdPct = () => ((speed() - 0.2) / 2.8) * 100;

  // Physical wavelength (map slider to nm for display)
  const physicalLambda = createMemo(() => (wavelength() / 120 * 500).toFixed(0));
  const physicalFreq = createMemo(() => (c / (parseFloat(physicalLambda()) * 1e-9) / 1e12).toFixed(1));

  return (
    <div class="space-y-5">
      {/* Sliders */}
      <div class="grid grid-cols-1 gap-3">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "90px" }}>{"\u03BB"} = {wavelength().toFixed(0)} px</label>
          <input type="range" min="40" max="240" step="1" value={wavelength()} onInput={(e) => setWavelength(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${wlPct()}%, var(--border) ${wlPct()}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "90px" }}>Amplitude = {amplitude().toFixed(0)}</label>
          <input type="range" min="15" max="80" step="1" value={amplitude()} onInput={(e) => setAmplitude(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${ampPct()}%, var(--border) ${ampPct()}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "90px" }}>Speed = {speed().toFixed(1)}x</label>
          <input type="range" min="0.2" max="3.0" step="0.1" value={speed()} onInput={(e) => setSpeed(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${spdPct()}%, var(--border) ${spdPct()}%)` }} />
        </div>
      </div>

      {/* SVG visualization */}
      <svg width="100%" height="340" viewBox={`0 0 ${W} ${H}`} class="mx-auto">
        <defs>
          <marker id="eArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={E_COLOR} />
          </marker>
          <marker id="bArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={B_COLOR} />
          </marker>
        </defs>

        {/* Title */}
        <text x={W / 2} y="16" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Electromagnetic Plane Wave: E = E{"\u2080"} sin(kz - {"\u03C9"}t)
        </text>

        {/* Propagation axis (z) */}
        <line x1={axisXStart - 5} y1={axisY} x2={axisXEnd + 10} y2={axisY} stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="4 3" opacity="0.5" />
        <text x={axisXEnd + 14} y={axisY + 4} font-size="9" fill="var(--text-muted)" font-weight="600">z</text>

        {/* B wave (draw first so E is on top) */}
        <path d={bWavePath()} fill="none" stroke={B_COLOR} stroke-width="2" opacity="0.7" />

        {/* B field arrows */}
        <For each={arrowPoints()}>
          {(pt) => {
            const bx = pt.z + pt.bVal * 0.5;
            const by = axisY + pt.bVal * 0.7;
            const len = Math.sqrt((bx - pt.z) ** 2 + (by - axisY) ** 2);
            return len > 3 ? (
              <line x1={pt.z} y1={axisY} x2={bx} y2={by}
                stroke={B_COLOR} stroke-width="1.2" opacity="0.6" marker-end="url(#bArrow)" />
            ) : null;
          }}
        </For>

        {/* E wave */}
        <path d={eWavePath()} fill="none" stroke={E_COLOR} stroke-width="2.5" />

        {/* E field arrows */}
        <For each={arrowPoints()}>
          {(pt) => {
            const ey = axisY - pt.eVal;
            const len = Math.abs(pt.eVal);
            return len > 3 ? (
              <line x1={pt.z} y1={axisY} x2={pt.z} y2={ey}
                stroke={E_COLOR} stroke-width="1.2" opacity="0.7" marker-end="url(#eArrow)" />
            ) : null;
          }}
        </For>

        {/* Axis labels */}
        <text x={axisXStart - 8} y={axisY - amplitude() - 8} font-size="9" fill={E_COLOR} font-weight="600" text-anchor="middle">E</text>
        <text x={axisXStart + amplitude() * perspectiveScale * 0.5 + 10} y={axisY + amplitude() * perspectiveScale * 0.7 + 14} font-size="9" fill={B_COLOR} font-weight="600" text-anchor="middle">B</text>

        {/* Legend */}
        <line x1="30" y1={H - 30} x2="50" y2={H - 30} stroke={E_COLOR} stroke-width="2.5" />
        <text x="55" y={H - 27} font-size="8" fill="var(--text-muted)">E field (vertical)</text>
        <line x1="160" y1={H - 30} x2="180" y2={H - 30} stroke={B_COLOR} stroke-width="2" opacity="0.7" />
        <text x="185" y={H - 27} font-size="8" fill="var(--text-muted)">B field (depth)</text>

        {/* Propagation arrow */}
        <line x1={W / 2 - 20} y1={H - 14} x2={W / 2 + 20} y2={H - 14} stroke={ACCENT} stroke-width="1.5" marker-end="url(#propArrow)" />
        <defs>
          <marker id="propArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={ACCENT} />
          </marker>
        </defs>
        <text x={W / 2 + 30} y={H - 11} font-size="8" fill={ACCENT} font-weight="600">propagation</text>
      </svg>

      {/* Controls */}
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
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Wavelength</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{physicalLambda()} nm</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Frequency</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{physicalFreq()} THz</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Wave Speed</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>c</div>
        </div>
      </div>
    </div>
  );
};

// ─── E3Polarization ───────────────────────────────────────────────────────────
// Visualization of different polarization states of EM waves
export const E3Polarization: Component = () => {
  type PolMode = "Linear" | "Circular (R)" | "Circular (L)" | "Elliptical";
  const [mode, setMode] = createSignal<PolMode>("Linear");
  const [exAmp, setExAmp] = createSignal(1.0);
  const [eyAmp, setEyAmp] = createSignal(1.0);
  const [phaseDiff, setPhaseDiff] = createSignal(0); // degrees
  const [linearAngle, setLinearAngle] = createSignal(45); // degrees
  const [playing, setPlaying] = createSignal(true);
  const [time, setTime] = createSignal(0);

  const modes: PolMode[] = ["Linear", "Circular (R)", "Circular (L)", "Elliptical"];

  // Derived parameters based on mode
  const effectiveEx = createMemo(() => {
    const m = mode();
    if (m === "Linear") return 1.0;
    if (m === "Circular (R)" || m === "Circular (L)") return 1.0;
    return exAmp();
  });

  const effectiveEy = createMemo(() => {
    const m = mode();
    if (m === "Linear") return 1.0;
    if (m === "Circular (R)" || m === "Circular (L)") return 1.0;
    return eyAmp();
  });

  const effectiveDelta = createMemo(() => {
    const m = mode();
    if (m === "Linear") return 0;
    if (m === "Circular (R)") return -90;
    if (m === "Circular (L)") return 90;
    return phaseDiff();
  });

  const deltaRad = createMemo(() => (effectiveDelta() * Math.PI) / 180);
  const angleRad = createMemo(() => (linearAngle() * Math.PI) / 180);

  // Compute E vector at given time
  const eVector = createMemo(() => {
    const t = time();
    const omega = 2.0;
    const m = mode();
    if (m === "Linear") {
      const val = Math.cos(omega * t);
      return { x: val * Math.cos(angleRad()), y: val * Math.sin(angleRad()) };
    }
    const ex = effectiveEx() * Math.cos(omega * t);
    const ey = effectiveEy() * Math.cos(omega * t + deltaRad());
    return { x: ex, y: ey };
  });

  // Trail of recent positions
  const trailLength = 120;
  const [trail, setTrail] = createSignal<{ x: number; y: number }[]>([]);

  let animFrame: number | undefined;
  let lastTs: number | undefined;

  const step = (ts: number) => {
    if (lastTs === undefined) lastTs = ts;
    if (playing()) {
      const dt = (ts - lastTs) / 1000;
      setTime((t) => t + dt * 2.5);
      const ev = eVector();
      setTrail((prev) => {
        const next = [...prev, { x: ev.x, y: ev.y }];
        if (next.length > trailLength) return next.slice(next.length - trailLength);
        return next;
      });
    }
    lastTs = ts;
    animFrame = requestAnimationFrame(step);
  };
  animFrame = requestAnimationFrame(step);
  onCleanup(() => { if (animFrame !== undefined) cancelAnimationFrame(animFrame); });

  const resetAnim = () => { setTime(0); setTrail([]); lastTs = undefined; };

  // SVG dimensions for head-on view
  const W = 420, hTop = 220, hBot = 130;
  const cx = 140, cy = 110; // center of head-on view
  const scale = 70; // px per unit amplitude

  // Side view wave parameters
  const sideY = hTop + 65;
  const sideXStart = 30, sideXEnd = 400;
  const sideAmp = 40;

  // Side-view wave path
  const sideWavePath = createMemo(() => {
    const t = time();
    const omega = 2.0;
    const m = mode();
    const pts: string[] = [];
    for (let px = sideXStart; px <= sideXEnd; px += 2) {
      const z = (px - sideXStart) / 40;
      let val: number;
      if (m === "Linear") {
        val = Math.cos(2 * z - omega * t) * Math.sin(angleRad());
      } else {
        // Show Ey component for side view
        val = effectiveEy() * Math.cos(2 * z - omega * t + deltaRad());
      }
      pts.push(`${px === sideXStart ? "M" : "L"}${px},${(sideY - val * sideAmp).toFixed(1)}`);
    }
    return pts.join(" ");
  });

  // Side-view second component (Ex) path
  const sideWavePath2 = createMemo(() => {
    const t = time();
    const omega = 2.0;
    const m = mode();
    const pts: string[] = [];
    for (let px = sideXStart; px <= sideXEnd; px += 2) {
      const z = (px - sideXStart) / 40;
      let val: number;
      if (m === "Linear") {
        val = Math.cos(2 * z - omega * t) * Math.cos(angleRad());
      } else {
        val = effectiveEx() * Math.cos(2 * z - omega * t);
      }
      pts.push(`${px === sideXStart ? "M" : "L"}${px},${(sideY - val * sideAmp).toFixed(1)}`);
    }
    return pts.join(" ");
  });

  // Trail path for head-on view
  const trailPath = createMemo(() => {
    const tr = trail();
    if (tr.length < 2) return "";
    return tr.map((p, i) => `${i === 0 ? "M" : "L"}${(cx + p.x * scale).toFixed(1)},${(cy - p.y * scale).toFixed(1)}`).join(" ");
  });

  // Axis ratio for stat card
  const axisRatio = createMemo(() => {
    const m = mode();
    if (m === "Linear") return "\u221E";
    if (m === "Circular (R)" || m === "Circular (L)") return "1.00";
    const a = effectiveEx();
    const b = effectiveEy();
    if (Math.min(a, b) < 0.01) return "\u221E";
    return (Math.max(a, b) / Math.min(a, b)).toFixed(2);
  });

  const polLabel = createMemo(() => {
    const m = mode();
    if (m === "Linear") return `Linear ${linearAngle()}\u00B0`;
    return m;
  });

  const exPct = () => ((exAmp() - 0.1) / 1.9) * 100;
  const eyPct = () => ((eyAmp() - 0.1) / 1.9) * 100;
  const deltaPct = () => ((phaseDiff() + 180) / 360) * 100;
  const angPct = () => (linearAngle() / 180) * 100;

  return (
    <div class="space-y-5">
      {/* Mode selector */}
      <div class="flex items-center gap-2 flex-wrap">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Polarization:</label>
        <For each={modes}>
          {(m) => (
            <button onClick={() => { setMode(m); resetAnim(); }}
              class="px-3 py-1.5 rounded-lg text-xs font-medium hover:scale-105 transition-all"
              style={{ background: mode() === m ? ACCENT : "var(--bg-secondary)", color: mode() === m ? "white" : "var(--text-secondary)" }}>
              {m}
            </button>
          )}
        </For>
      </div>

      {/* Conditional sliders */}
      {mode() === "Linear" && (
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "90px" }}>Angle = {linearAngle()}{"\u00B0"}</label>
          <input type="range" min="0" max="180" step="1" value={linearAngle()} onInput={(e) => { setLinearAngle(parseInt(e.currentTarget.value)); resetAnim(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${angPct()}%, var(--border) ${angPct()}%)` }} />
        </div>
      )}

      {mode() === "Elliptical" && (
        <div class="grid grid-cols-1 gap-3">
          <div class="flex items-center gap-3">
            <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "90px" }}>E{"\u2080\u2093"} = {exAmp().toFixed(2)}</label>
            <input type="range" min="0.1" max="2.0" step="0.01" value={exAmp()} onInput={(e) => { setExAmp(parseFloat(e.currentTarget.value)); resetAnim(); }}
              class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, ${ACCENT} ${exPct()}%, var(--border) ${exPct()}%)` }} />
          </div>
          <div class="flex items-center gap-3">
            <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "90px" }}>E{"\u2080\u1D67"} = {eyAmp().toFixed(2)}</label>
            <input type="range" min="0.1" max="2.0" step="0.01" value={eyAmp()} onInput={(e) => { setEyAmp(parseFloat(e.currentTarget.value)); resetAnim(); }}
              class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, ${ACCENT} ${eyPct()}%, var(--border) ${eyPct()}%)` }} />
          </div>
          <div class="flex items-center gap-3">
            <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "90px" }}>{"\u03B4"} = {phaseDiff()}{"\u00B0"}</label>
            <input type="range" min="-180" max="180" step="1" value={phaseDiff()} onInput={(e) => { setPhaseDiff(parseInt(e.currentTarget.value)); resetAnim(); }}
              class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, ${ACCENT} ${deltaPct()}%, var(--border) ${deltaPct()}%)` }} />
          </div>
        </div>
      )}

      {/* Head-on view + side view SVG */}
      <svg width="100%" height={hTop + hBot + 20} viewBox={`0 0 ${W} ${hTop + hBot + 20}`} class="mx-auto">
        {/* Head-on view title */}
        <text x={cx} y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Head-On View (looking along z)
        </text>

        {/* Crosshair axes */}
        <line x1={cx - 90} y1={cy} x2={cx + 90} y2={cy} stroke="var(--border)" stroke-width="0.5" />
        <line x1={cx} y1={cy - 90} x2={cx} y2={cy + 90} stroke="var(--border)" stroke-width="0.5" />
        <text x={cx + 93} y={cy + 4} font-size="8" fill="var(--text-muted)">E{"\u2093"}</text>
        <text x={cx + 3} y={cy - 92} font-size="8" fill="var(--text-muted)">E{"\u1D67"}</text>

        {/* Amplitude circles for reference */}
        <circle cx={cx} cy={cy} r={scale} fill="none" stroke="var(--border)" stroke-width="0.3" stroke-dasharray="3 3" />
        {effectiveEx() !== effectiveEy() && (
          <ellipse cx={cx} cy={cy} rx={effectiveEx() * scale} ry={effectiveEy() * scale} fill="none" stroke="var(--border)" stroke-width="0.3" stroke-dasharray="3 3" />
        )}

        {/* Trail */}
        {trailPath() && (
          <path d={trailPath()} fill="none" stroke={ACCENT} stroke-width="1.5" opacity="0.4" />
        )}

        {/* Current E vector */}
        {(() => {
          const ev = eVector();
          const tipX = cx + ev.x * scale;
          const tipY = cy - ev.y * scale;
          const len = Math.sqrt(ev.x * ev.x + ev.y * ev.y);
          return (
            <>
              {len > 0.02 && (
                <line x1={cx} y1={cy} x2={tipX} y2={tipY}
                  stroke={E_COLOR} stroke-width="2.5" marker-end="url(#polEArrow)" />
              )}
              <circle cx={tipX} cy={tipY} r="4" fill={E_COLOR} />
              <circle cx={cx} cy={cy} r="2.5" fill="var(--text-muted)" />
            </>
          );
        })()}

        <defs>
          <marker id="polEArrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill={E_COLOR} />
          </marker>
        </defs>

        {/* Polarization type label on the right side of head-on view */}
        <text x="310" y="50" text-anchor="middle" font-size="11" font-weight="700" fill={ACCENT}>{polLabel()}</text>
        <text x="310" y="68" text-anchor="middle" font-size="8" fill="var(--text-muted)">
          E{"\u2093"} = E{"\u2080\u2093"} cos({"\u03C9"}t)
        </text>
        <text x="310" y="82" text-anchor="middle" font-size="8" fill="var(--text-muted)">
          E{"\u1D67"} = E{"\u2080\u1D67"} cos({"\u03C9"}t + {"\u03B4"})
        </text>
        <text x="310" y="100" text-anchor="middle" font-size="8" fill="var(--text-muted)">
          {"\u03B4"} = {effectiveDelta()}{"\u00B0"}
        </text>

        {/* Separator */}
        <line x1="20" y1={hTop} x2={W - 20} y2={hTop} stroke="var(--border)" stroke-width="0.5" />

        {/* Side view title */}
        <text x={W / 2} y={hTop + 16} text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Side View (wave propagation)
        </text>

        {/* Side view axis */}
        <line x1={sideXStart} y1={sideY} x2={sideXEnd} y2={sideY} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="4 3" />
        <text x={sideXEnd + 6} y={sideY + 3} font-size="8" fill="var(--text-muted)">z</text>

        {/* Side view E_y component */}
        <path d={sideWavePath()} fill="none" stroke={E_COLOR} stroke-width="2" opacity="0.8" />

        {/* Side view E_x component */}
        <path d={sideWavePath2()} fill="none" stroke={B_COLOR} stroke-width="1.5" opacity="0.5" stroke-dasharray="4 2" />

        {/* Side view legend */}
        <line x1={sideXStart} y1={hTop + hBot + 8} x2={sideXStart + 20} y2={hTop + hBot + 8} stroke={E_COLOR} stroke-width="2" />
        <text x={sideXStart + 25} y={hTop + hBot + 11} font-size="7" fill="var(--text-muted)">E{"\u1D67"}</text>
        <line x1={sideXStart + 55} y1={hTop + hBot + 8} x2={sideXStart + 75} y2={hTop + hBot + 8} stroke={B_COLOR} stroke-width="1.5" stroke-dasharray="4 2" opacity="0.5" />
        <text x={sideXStart + 80} y={hTop + hBot + 11} font-size="7" fill="var(--text-muted)">E{"\u2093"}</text>
      </svg>

      {/* Controls */}
      <div class="flex justify-center gap-2">
        <button onClick={() => setPlaying(!playing())}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: ACCENT, color: "white" }}>
          {playing() ? "Pause" : "Play"}
        </button>
        <button onClick={() => { resetAnim(); setPlaying(false); }}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Reset
        </button>
      </div>

      {/* Stat cards */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Polarization</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{mode()}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Phase Diff {"\u03B4"}</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{effectiveDelta()}{"\u00B0"}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Axis Ratio</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{axisRatio()}</div>
        </div>
      </div>
    </div>
  );
};

// ─── E3PoyntingVector ─────────────────────────────────────────────────────────
// Energy flow in electromagnetic waves via the Poynting vector S = E x B
export const E3PoyntingVector: Component = () => {
  const [e0, setE0] = createSignal(1.0); // normalized E0 amplitude
  const [playing, setPlaying] = createSignal(true);
  const [time, setTime] = createSignal(0);

  const W = 420, H = 360;
  const axisY = 120;
  const axisXStart = 40, axisXEnd = 390;
  const fieldAmp = 55;
  const numPoints = 12;

  // Derived quantities
  const b0 = createMemo(() => e0() / c); // B0 = E0/c
  const peakS = createMemo(() => (e0() * e0()) / mu0); // S_peak = E0^2 / mu0  (normalized)
  const avgS = createMemo(() => peakS() / 2); // <S> = E0^2 / (2 mu0)

  let animFrame: number | undefined;
  let lastTs: number | undefined;

  const step = (ts: number) => {
    if (lastTs === undefined) lastTs = ts;
    if (playing()) {
      const dt = (ts - lastTs) / 1000;
      setTime((t) => t + dt * 1.5);
    }
    lastTs = ts;
    animFrame = requestAnimationFrame(step);
  };
  animFrame = requestAnimationFrame(step);
  onCleanup(() => { if (animFrame !== undefined) cancelAnimationFrame(animFrame); });

  const reset = () => { setTime(0); lastTs = undefined; };

  // Field values at discrete sample points
  const fieldPoints = createMemo(() => {
    const t = time();
    const omega = 3.0;
    const k = 0.08;
    const amp = fieldAmp * e0();
    const pts: { z: number; eVal: number; bVal: number; sVal: number; sinSq: number }[] = [];
    const spacing = (axisXEnd - axisXStart) / (numPoints - 1);
    for (let i = 0; i < numPoints; i++) {
      const zPx = axisXStart + i * spacing;
      const z = (zPx - axisXStart) * k;
      const sinVal = Math.sin(z - omega * t);
      const eVal = amp * sinVal;
      const bVal = amp * 0.4 * sinVal; // scaled for visual
      const sinSq = sinVal * sinVal;
      const sVal = sinSq; // normalized 0-1
      pts.push({ z: zPx, eVal, bVal, sVal, sinSq });
    }
    return pts;
  });

  // Instantaneous S at first point (for display)
  const instantS = createMemo(() => {
    const pts = fieldPoints();
    if (pts.length === 0) return 0;
    // Average of all points
    const avg = pts.reduce((sum, p) => sum + p.sVal, 0) / pts.length;
    return avg;
  });

  // Energy density at each point: u = eps0 * E^2 (simplified/normalized)
  const avgEnergyDensity = createMemo(() => {
    const pts = fieldPoints();
    if (pts.length === 0) return 0;
    const avg = pts.reduce((sum, p) => sum + p.sinSq, 0) / pts.length;
    return avg * e0() * e0();
  });

  // Bar chart Y region
  const barY = 240, barH = 80;

  const e0Pct = () => ((e0() - 0.2) / 1.8) * 100;

  // Display values with proper units
  const displayPeakS = createMemo(() => {
    const val = e0() * e0();
    if (val < 0.01) return "0.00";
    return val.toFixed(2);
  });
  const displayAvgS = createMemo(() => {
    const val = e0() * e0() / 2;
    return val.toFixed(2);
  });
  const displayU = createMemo(() => avgEnergyDensity().toFixed(2));

  return (
    <div class="space-y-5">
      {/* E0 slider */}
      <div class="flex items-center gap-3">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "90px" }}>E{"\u2080"} = {e0().toFixed(2)}</label>
        <input type="range" min="0.2" max="2.0" step="0.01" value={e0()} onInput={(e) => setE0(parseFloat(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${ACCENT} ${e0Pct()}%, var(--border) ${e0Pct()}%)` }} />
      </div>

      {/* SVG visualization */}
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} class="mx-auto">
        <defs>
          <marker id="pEArr" markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" fill={E_COLOR} />
          </marker>
          <marker id="pBArr" markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" fill={B_COLOR} />
          </marker>
          <marker id="pSArr" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={S_COLOR} />
          </marker>
        </defs>

        {/* Title */}
        <text x={W / 2} y="16" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Poynting Vector: S = (1/{"\u03BC\u2080"})(E {"\u00D7"} B)
        </text>

        {/* Propagation axis */}
        <line x1={axisXStart - 5} y1={axisY} x2={axisXEnd + 5} y2={axisY} stroke="var(--text-muted)" stroke-width="0.7" stroke-dasharray="4 3" opacity="0.4" />
        <text x={axisXEnd + 10} y={axisY + 3} font-size="8" fill="var(--text-muted)">z</text>

        {/* Field arrows at each sample point */}
        <For each={fieldPoints()}>
          {(pt) => {
            const eEndY = axisY - pt.eVal;
            const eLen = Math.abs(pt.eVal);

            // B field arrows (horizontal-ish, perspective)
            const bEndX = pt.z + pt.bVal;
            const bLen = Math.abs(pt.bVal);

            // Poynting vector arrow (pointing right, magnitude proportional to S)
            const sLen = pt.sVal * 30 * e0() * e0();

            return (
              <>
                {/* E arrow (vertical, orange) */}
                {eLen > 2 && (
                  <line x1={pt.z} y1={axisY} x2={pt.z} y2={eEndY}
                    stroke={E_COLOR} stroke-width="1.5" marker-end="url(#pEArr)" opacity="0.8" />
                )}

                {/* B arrow (horizontal, blue) */}
                {bLen > 1 && (
                  <line x1={pt.z} y1={axisY} x2={bEndX} y2={axisY}
                    stroke={B_COLOR} stroke-width="1.5" marker-end="url(#pBArr)" opacity="0.6" />
                )}

                {/* S arrow (propagation direction, green) - drawn below axis */}
                {sLen > 1 && (
                  <line x1={pt.z - sLen / 2} y1={axisY + 25} x2={pt.z + sLen / 2} y2={axisY + 25}
                    stroke={S_COLOR} stroke-width="2" marker-end="url(#pSArr)" opacity="0.9" />
                )}

                {/* S magnitude bar at each point */}
                <rect x={pt.z - 3} y={axisY + 35} width="6" height={pt.sVal * 30 * e0() * e0()}
                  fill={S_COLOR} opacity="0.3" rx="1" />
              </>
            );
          }}
        </For>

        {/* Labels */}
        <text x={axisXStart - 15} y={axisY - fieldAmp * e0() - 5} font-size="8" fill={E_COLOR} font-weight="600">E</text>
        <text x={axisXStart - 15} y={axisY + 4} font-size="8" fill={B_COLOR} font-weight="600">B</text>
        <text x={axisXStart - 15} y={axisY + 28} font-size="8" fill={S_COLOR} font-weight="600">S</text>

        {/* Average S line */}
        <line x1={axisXStart} y1={axisY + 35 + 15 * e0() * e0()} x2={axisXEnd} y2={axisY + 35 + 15 * e0() * e0()}
          stroke={S_COLOR} stroke-width="1" stroke-dasharray="5 3" opacity="0.6" />
        <text x={axisXEnd + 4} y={axisY + 35 + 15 * e0() * e0() + 3} font-size="7" fill={S_COLOR}>{"\u27E8"}S{"\u27E9"}</text>

        {/* Legend */}
        <line x1="30" y1={axisY + 80} x2="50" y2={axisY + 80} stroke={E_COLOR} stroke-width="2" />
        <text x="55" y={axisY + 83} font-size="7" fill="var(--text-muted)">E field</text>
        <line x1="110" y1={axisY + 80} x2="130" y2={axisY + 80} stroke={B_COLOR} stroke-width="2" />
        <text x="135" y={axisY + 83} font-size="7" fill="var(--text-muted)">B field</text>
        <line x1="190" y1={axisY + 80} x2="210" y2={axisY + 80} stroke={S_COLOR} stroke-width="2" />
        <text x="215" y={axisY + 83} font-size="7" fill="var(--text-muted)">S = E{"\u00D7"}B/{"\u03BC\u2080"}</text>

        {/* Energy flow bar chart */}
        <text x={W / 2} y={barY - 5} text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Energy Flow Comparison
        </text>

        {/* Instantaneous S bar */}
        {(() => {
          const instW = instantS() * e0() * e0() * 150;
          return (
            <>
              <text x={axisXStart + 5} y={barY + 15} font-size="8" fill="var(--text-muted)">Instant |S|</text>
              <rect x={axisXStart + 70} y={barY + 5} width={Math.max(instW, 1)} height="16" rx="3" fill={S_COLOR} opacity="0.7" />
              <text x={axisXStart + 75 + instW} y={barY + 17} font-size="8" fill={S_COLOR} font-weight="600">
                {(instantS() * e0() * e0()).toFixed(2)}
              </text>
            </>
          );
        })()}

        {/* Average S bar */}
        {(() => {
          const avgW = 0.5 * e0() * e0() * 150;
          return (
            <>
              <text x={axisXStart + 5} y={barY + 42} font-size="8" fill="var(--text-muted)">{"\u27E8"}S{"\u27E9"} avg</text>
              <rect x={axisXStart + 70} y={barY + 32} width={Math.max(avgW, 1)} height="16" rx="3" fill={S_COLOR} opacity="0.4" />
              <rect x={axisXStart + 70} y={barY + 32} width={Math.max(avgW, 1)} height="16" rx="3" fill="none" stroke={S_COLOR} stroke-width="1" stroke-dasharray="3 2" />
              <text x={axisXStart + 75 + avgW} y={barY + 44} font-size="8" fill={S_COLOR} font-weight="600">
                {(0.5 * e0() * e0()).toFixed(2)}
              </text>
            </>
          );
        })()}

        {/* Energy density bar */}
        {(() => {
          const uW = avgEnergyDensity() * 150;
          return (
            <>
              <text x={axisXStart + 5} y={barY + 69} font-size="8" fill="var(--text-muted)">u (density)</text>
              <rect x={axisXStart + 70} y={barY + 59} width={Math.max(uW, 1)} height="16" rx="3" fill={ACCENT} opacity="0.5" />
              <text x={axisXStart + 75 + uW} y={barY + 71} font-size="8" fill={ACCENT} font-weight="600">
                {displayU()}
              </text>
            </>
          );
        })()}

        {/* Scale reference */}
        <rect x={axisXStart + 70} y={barY + 80} width="150" height="1" fill="var(--border)" opacity="0.4" />
        <text x={axisXStart + 70 + 150} y={barY + 88} font-size="6" fill="var(--text-muted)">max</text>
      </svg>

      {/* Controls */}
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
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Peak S</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{displayPeakS()}</div>
          <div class="text-[9px]" style={{ color: "var(--text-muted)" }}>E{"\u2080"}{"\u00B2"}/{"\u03BC\u2080"}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Average S</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{displayAvgS()}</div>
          <div class="text-[9px]" style={{ color: "var(--text-muted)" }}>E{"\u2080"}{"\u00B2"}/2{"\u03BC\u2080"}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Energy Density</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{displayU()}</div>
          <div class="text-[9px]" style={{ color: "var(--text-muted)" }}>{"\u00BD"}({"\u03B5\u2080"}E{"\u00B2"} + B{"\u00B2"}/{"\u03BC\u2080"})</div>
        </div>
      </div>
    </div>
  );
};
