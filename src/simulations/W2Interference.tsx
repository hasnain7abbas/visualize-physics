import { Component, createSignal, createMemo, onCleanup, For } from "solid-js";

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCENT = "#f59e0b"; // amber for Waves module
const ENVELOPE_COLOR = "#ef4444";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// W2SingleSlit — Fraunhofer single-slit diffraction pattern
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const W2SingleSlit: Component = () => {
  const [slitWidth, setSlitWidth] = createSignal(6); // in units of lambda
  const [playing, setPlaying] = createSignal(true);
  const [time, setTime] = createSignal(0);
  const [autoAnimate, setAutoAnimate] = createSignal(false);

  let animFrame: number | undefined;
  let lastTs: number | undefined;

  const step = (ts: number) => {
    if (lastTs === undefined) lastTs = ts;
    if (playing()) {
      const dt = (ts - lastTs) / 1000;
      setTime((t) => t + dt);
      if (autoAnimate()) {
        // Slowly oscillate slit width between 1 and 20
        const cycle = (Math.sin(time() * 0.3) + 1) / 2; // 0..1
        setSlitWidth(Math.round(1 + cycle * 19));
      }
    }
    lastTs = ts;
    animFrame = requestAnimationFrame(step);
  };
  animFrame = requestAnimationFrame(step);
  onCleanup(() => { if (animFrame !== undefined) cancelAnimationFrame(animFrame); });

  const reset = () => { setTime(0); lastTs = undefined; };

  // SVG dimensions
  const W = 420, H_TOP = 180, H_BOT = 180;
  const barrierX = 200;

  // Incident plane wave lines
  const waveLines = createMemo(() => {
    const t = time();
    const lines: { x: number; opacity: number }[] = [];
    const spacing = 20; // one wavelength = 20px
    for (let i = 0; i < 12; i++) {
      const baseX = 30 + i * spacing;
      const x = baseX - ((t * 40) % spacing); // move rightward
      if (x > 10 && x < barrierX - 5) {
        lines.push({ x, opacity: 0.3 + 0.4 * (x / barrierX) });
      }
    }
    return lines;
  });

  // Diffraction intensity I(theta) = I0 * [sin(beta)/beta]^2
  // beta = (pi * a / lambda) * sin(theta)
  const intensityCurve = createMemo(() => {
    const a = slitWidth();
    const pts: { theta: number; intensity: number; x: number; y: number }[] = [];
    const plotW = 380, plotH = 120;
    const plotX0 = 20, plotY0 = 30;
    const thetaMax = Math.PI / 3; // +-60 degrees
    const steps = 400;
    for (let i = 0; i <= steps; i++) {
      const theta = -thetaMax + (2 * thetaMax * i) / steps;
      const beta = (Math.PI * a) * Math.sin(theta);
      const sinc = Math.abs(beta) < 0.0001 ? 1 : Math.sin(beta) / beta;
      const intensity = sinc * sinc;
      const x = plotX0 + (i / steps) * plotW;
      const y = plotY0 + plotH - intensity * plotH;
      pts.push({ theta, intensity, x, y });
    }
    return pts;
  });

  // Build filled path for intensity curve
  const intensityPath = createMemo(() => {
    const pts = intensityCurve();
    if (pts.length === 0) return "";
    const plotX0 = 20, plotH = 120, plotY0 = 30;
    const baseline = plotY0 + plotH;
    let d = `M${pts[0].x.toFixed(1)},${baseline}`;
    for (const p of pts) {
      d += ` L${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }
    d += ` L${pts[pts.length - 1].x.toFixed(1)},${baseline} Z`;
    return d;
  });

  // Line path for intensity curve (stroke on top)
  const intensityLinePath = createMemo(() => {
    const pts = intensityCurve();
    if (pts.length === 0) return "";
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  });

  // First minima positions (sin(theta) = lambda/a => theta = arcsin(1/a))
  const firstMinima = createMemo(() => {
    const a = slitWidth();
    if (a < 1) return null;
    const sinVal = 1 / a;
    if (sinVal > 1) return null;
    const theta = Math.asin(sinVal);
    const thetaMax = Math.PI / 3;
    const plotW = 380, plotX0 = 20;
    const frac = (theta + thetaMax) / (2 * thetaMax);
    const fracNeg = (-theta + thetaMax) / (2 * thetaMax);
    return {
      xPos: plotX0 + frac * plotW,
      xNeg: plotX0 + fracNeg * plotW,
      thetaDeg: (theta * 180 / Math.PI).toFixed(1),
    };
  });

  // Slit half-height in SVG units
  const slitHalf = createMemo(() => Math.max(3, slitWidth() * 3.5));

  const slitPct = () => ((slitWidth() - 1) / 19) * 100;

  return (
    <div class="space-y-5">
      {/* Slit width slider */}
      <div class="flex items-center gap-3">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "100px" }}>
          Slit a = {slitWidth()}{"\u03BB"}
        </label>
        <input type="range" min="1" max="20" step="1" value={slitWidth()}
          onInput={(e) => setSlitWidth(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${ACCENT} ${slitPct()}%, var(--border) ${slitPct()}%)` }} />
      </div>

      {/* Top SVG: slit geometry */}
      <svg width="100%" height={H_TOP} viewBox={`0 0 ${W} ${H_TOP}`} class="mx-auto">
        <text x={W / 2} y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Single-Slit Geometry
        </text>

        {/* Incident plane waves */}
        <For each={waveLines()}>
          {(wl) => (
            <line x1={wl.x} y1={25} x2={wl.x} y2={H_TOP - 10} stroke={ACCENT} stroke-width="1.5" opacity={wl.opacity} />
          )}
        </For>

        {/* Arrow showing propagation direction */}
        <defs>
          <marker id="ssArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={ACCENT} />
          </marker>
        </defs>
        <line x1="60" y1={H_TOP - 18} x2="100" y2={H_TOP - 18} stroke={ACCENT} stroke-width="1.5" marker-end="url(#ssArrow)" />
        <text x="105" y={H_TOP - 15} font-size="8" fill={ACCENT} font-weight="600">k</text>

        {/* Barrier with slit */}
        <rect x={barrierX - 3} y={20} width="6" height={H_TOP / 2 - 10 - slitHalf()} rx="1" fill="var(--text-muted)" opacity="0.7" />
        <rect x={barrierX - 3} y={H_TOP / 2 + slitHalf() - 10} width="6" height={H_TOP / 2 - slitHalf()} rx="1" fill="var(--text-muted)" opacity="0.7" />

        {/* Slit width indicator */}
        <line x1={barrierX + 12} y1={H_TOP / 2 - 10 - slitHalf()} x2={barrierX + 12} y2={H_TOP / 2 + slitHalf() - 10}
          stroke={ACCENT} stroke-width="1" />
        <line x1={barrierX + 8} y1={H_TOP / 2 - 10 - slitHalf()} x2={barrierX + 16} y2={H_TOP / 2 - 10 - slitHalf()}
          stroke={ACCENT} stroke-width="1" />
        <line x1={barrierX + 8} y1={H_TOP / 2 + slitHalf() - 10} x2={barrierX + 16} y2={H_TOP / 2 + slitHalf() - 10}
          stroke={ACCENT} stroke-width="1" />
        <text x={barrierX + 20} y={H_TOP / 2 - 6} font-size="9" fill={ACCENT} font-weight="600">a = {slitWidth()}{"\u03BB"}</text>

        {/* Diffracted wavefronts (circular arcs emanating from slit) */}
        {(() => {
          const t = time();
          const cy = H_TOP / 2 - 10;
          const arcs: any[] = [];
          const numArcs = 6;
          const spacing = 25;
          for (let i = 0; i < numArcs; i++) {
            const r = ((t * 40 + i * spacing) % (spacing * numArcs));
            if (r < 5) continue;
            const opacity = Math.max(0, 0.5 - r / (spacing * numArcs));
            const spreadAngle = Math.PI / 3;
            const x1 = barrierX + r * Math.cos(spreadAngle);
            const y1 = cy - r * Math.sin(spreadAngle);
            const x2 = barrierX + r * Math.cos(spreadAngle);
            const y2 = cy + r * Math.sin(spreadAngle);
            arcs.push(
              <path d={`M${x1.toFixed(1)},${y1.toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0,1 ${x2.toFixed(1)},${y2.toFixed(1)}`}
                fill="none" stroke={ACCENT} stroke-width="1.2" opacity={opacity} />
            );
          }
          return arcs;
        })()}

        {/* Labels */}
        <text x="40" y={H_TOP / 2 - 3} font-size="9" fill="var(--text-muted)" font-weight="500">Incident</text>
        <text x="40" y={H_TOP / 2 + 8} font-size="9" fill="var(--text-muted)" font-weight="500">plane waves</text>
        <text x={barrierX + 90} y={H_TOP / 2 - 3} font-size="9" fill="var(--text-muted)" font-weight="500">Diffracted</text>
        <text x={barrierX + 90} y={H_TOP / 2 + 8} font-size="9" fill="var(--text-muted)" font-weight="500">wavefronts</text>
      </svg>

      {/* Bottom SVG: Intensity plot */}
      <svg width="100%" height={H_BOT} viewBox={`0 0 ${W} ${H_BOT}`} class="mx-auto">
        <text x={W / 2} y="18" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          I({"\u03B8"}) = I{"\u2080"} [sin({"\u03B2"})/{"\u03B2"}]{"\u00B2"}, {"\u03B2"} = ({"\u03C0"}a/{"\u03BB"})sin{"\u03B8"}
        </text>

        {/* Axes */}
        <line x1="20" y1="150" x2="400" y2="150" stroke="var(--text-muted)" stroke-width="0.5" />
        <line x1="210" y1="28" x2="210" y2="155" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
        <text x="210" y="168" text-anchor="middle" font-size="8" fill="var(--text-muted)">{"\u03B8"} = 0</text>
        <text x="20" y="168" font-size="8" fill="var(--text-muted)">-60{"\u00B0"}</text>
        <text x="393" y="168" font-size="8" fill="var(--text-muted)">+60{"\u00B0"}</text>
        <text x="8" y="35" font-size="8" fill="var(--text-muted)">I/I{"\u2080"}</text>

        {/* Filled intensity curve */}
        <path d={intensityPath()} fill={ACCENT} opacity="0.25" />
        <path d={intensityLinePath()} fill="none" stroke={ACCENT} stroke-width="2" />

        {/* Central maximum label */}
        <text x="210" y="25" text-anchor="middle" font-size="7" fill={ACCENT} font-weight="600">Central max</text>

        {/* First minima markers */}
        {(() => {
          const m = firstMinima();
          if (!m) return null;
          return (
            <>
              <line x1={m.xPos} y1="30" x2={m.xPos} y2="150" stroke={ENVELOPE_COLOR} stroke-width="0.8" stroke-dasharray="3 2" opacity="0.6" />
              <line x1={m.xNeg} y1="30" x2={m.xNeg} y2="150" stroke={ENVELOPE_COLOR} stroke-width="0.8" stroke-dasharray="3 2" opacity="0.6" />
              <text x={m.xPos + 3} y="42" font-size="7" fill={ENVELOPE_COLOR}>1st min</text>
              <text x={m.xPos + 3} y="51" font-size="7" fill={ENVELOPE_COLOR}>{"\u03B8"} = {m.thetaDeg}{"\u00B0"}</text>
              <text x={m.xNeg - 32} y="42" font-size="7" fill={ENVELOPE_COLOR}>1st min</text>
            </>
          );
        })()}
      </svg>

      {/* Controls */}
      <div class="flex items-center gap-3 flex-wrap">
        <button onClick={() => setPlaying(!playing())}
          class="px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-all"
          style={{ background: playing() ? "#ef4444" : ACCENT, color: "white" }}>
          {playing() ? "\u23F8 Pause" : "\u25B6 Play"}
        </button>
        <button onClick={() => { reset(); setPlaying(false); }}
          class="px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Reset
        </button>
        <button onClick={() => setAutoAnimate(!autoAnimate())}
          class="px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-all"
          style={{ background: autoAnimate() ? ACCENT : "var(--bg-secondary)", color: autoAnimate() ? "white" : "var(--text-secondary)" }}>
          {autoAnimate() ? "Auto: ON" : "Auto: OFF"}
        </button>
      </div>

      {/* Stats */}
      <div class="grid grid-cols-3 gap-3">
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Slit Width</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>a = {slitWidth()}{"\u03BB"}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>1st Minimum</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>
            {firstMinima() ? `\u00B1${firstMinima()!.thetaDeg}\u00B0` : "N/A"}
          </div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Central Width</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>
            {firstMinima() ? `${(2 * parseFloat(firstMinima()!.thetaDeg)).toFixed(1)}\u00B0` : "wide"}
          </div>
        </div>
      </div>
    </div>
  );
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// W2DoubleSlit — Young's double-slit interference pattern
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const W2DoubleSlit: Component = () => {
  const [slitSep, setSlitSep] = createSignal(10); // d in lambda units
  const [slitWidth, setSlitWidth] = createSignal(3); // a in lambda units
  const [showEnvelope, setShowEnvelope] = createSignal(true);
  const [playing, setPlaying] = createSignal(true);
  const [time, setTime] = createSignal(0);

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

  const W = 420, H_TOP = 200, H_BOT = 200;
  const barrierX = 150;
  const thetaMax = Math.PI / 4; // +-45 degrees

  // Slit positions in SVG
  const slitGapPx = createMemo(() => Math.max(8, slitSep() * 4));
  const slitHalfW = createMemo(() => Math.max(2, slitWidth() * 2));
  const slit1Y = createMemo(() => H_TOP / 2 - slitGapPx() / 2);
  const slit2Y = createMemo(() => H_TOP / 2 + slitGapPx() / 2);

  // Expanding circular wavefronts from each slit
  const wavefronts = createMemo(() => {
    const t = time();
    const y1 = slit1Y();
    const y2 = slit2Y();
    const circles: { cx: number; cy: number; r: number; opacity: number }[] = [];
    const numRings = 8;
    const spacing = 22;
    for (let slit = 0; slit < 2; slit++) {
      const cy = slit === 0 ? y1 : y2;
      for (let i = 0; i < numRings; i++) {
        const r = ((t * 50 + i * spacing) % (spacing * numRings));
        if (r < 3) continue;
        const opacity = Math.max(0, 0.4 - r / (spacing * numRings) * 0.5);
        circles.push({ cx: barrierX, cy, r, opacity });
      }
    }
    return circles;
  });

  // Double-slit intensity: I = I_single * cos^2(pi*d*sin(theta)/lambda)
  // I_single = [sin(beta)/beta]^2, beta = pi*a*sin(theta)/lambda
  const intensityCurve = createMemo(() => {
    const d = slitSep();
    const a = slitWidth();
    const plotW = 380, plotH = 130;
    const plotX0 = 20, plotY0 = 30;
    const steps = 500;
    const pts: { theta: number; intensity: number; envelope: number; x: number; y: number; yEnv: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const theta = -thetaMax + (2 * thetaMax * i) / steps;
      const sinT = Math.sin(theta);
      // Single-slit envelope
      const beta = Math.PI * a * sinT;
      const sinc = Math.abs(beta) < 0.0001 ? 1 : Math.sin(beta) / beta;
      const Isingle = sinc * sinc;
      // Double-slit interference
      const gamma = Math.PI * d * sinT;
      const Idouble = Isingle * Math.cos(gamma) * Math.cos(gamma);
      const x = plotX0 + (i / steps) * plotW;
      const y = plotY0 + plotH - Idouble * plotH;
      const yEnv = plotY0 + plotH - Isingle * plotH;
      pts.push({ theta, intensity: Idouble, envelope: Isingle, x, y, yEnv });
    }
    return pts;
  });

  // Path for double-slit intensity (filled)
  const intensityFillPath = createMemo(() => {
    const pts = intensityCurve();
    if (pts.length === 0) return "";
    const plotX0 = 20, plotH = 130, plotY0 = 30;
    const baseline = plotY0 + plotH;
    let d = `M${pts[0].x.toFixed(1)},${baseline}`;
    for (const p of pts) d += ` L${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    d += ` L${pts[pts.length - 1].x.toFixed(1)},${baseline} Z`;
    return d;
  });

  const intensityLinePath = createMemo(() => {
    const pts = intensityCurve();
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  });

  // Single-slit envelope path
  const envelopePath = createMemo(() => {
    const pts = intensityCurve();
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.yEnv.toFixed(1)}`).join(" ");
  });

  // Constructive interference positions (d*sin(theta) = m*lambda)
  const constructivePositions = createMemo(() => {
    const d = slitSep();
    const plotW = 380, plotX0 = 20;
    const positions: { m: number; x: number }[] = [];
    for (let m = -10; m <= 10; m++) {
      const sinT = m / d;
      if (Math.abs(sinT) > Math.sin(thetaMax)) continue;
      const theta = Math.asin(sinT);
      const frac = (theta + thetaMax) / (2 * thetaMax);
      positions.push({ m, x: plotX0 + frac * plotW });
    }
    return positions;
  });

  // Fringe spacing (angular) = lambda/d (small angle)
  const fringeSpacing = createMemo(() => {
    const d = slitSep();
    return (180 / Math.PI / d).toFixed(2);
  });

  // Number of visible fringes within central diffraction maximum
  const visibleFringes = createMemo(() => {
    const d = slitSep();
    const a = slitWidth();
    if (a < 0.01) return 0;
    return Math.floor(2 * d / a) - 1;
  });

  const sepPct = () => ((slitSep() - 2) / 28) * 100;
  const widthPct = () => ((slitWidth() - 1) / 9) * 100;

  return (
    <div class="space-y-5">
      {/* Sliders */}
      <div class="grid grid-cols-1 gap-3">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "100px" }}>
            d = {slitSep()}{"\u03BB"}
          </label>
          <input type="range" min="2" max="30" step="1" value={slitSep()}
            onInput={(e) => setSlitSep(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${sepPct()}%, var(--border) ${sepPct()}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "100px" }}>
            a = {slitWidth()}{"\u03BB"}
          </label>
          <input type="range" min="1" max="10" step="1" value={slitWidth()}
            onInput={(e) => setSlitWidth(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${widthPct()}%, var(--border) ${widthPct()}%)` }} />
        </div>
      </div>

      {/* Top SVG: Double-slit geometry with wavefronts */}
      <svg width="100%" height={H_TOP} viewBox={`0 0 ${W} ${H_TOP}`} class="mx-auto">
        <text x={W / 2} y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Double-Slit Geometry (d = {slitSep()}{"\u03BB"}, a = {slitWidth()}{"\u03BB"})
        </text>

        {/* Incident plane wave arrows */}
        <defs>
          <marker id="dsArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={ACCENT} />
          </marker>
        </defs>
        {(() => {
          const arrows: any[] = [];
          for (let y = 40; y < H_TOP - 20; y += 30) {
            arrows.push(
              <line x1="30" y1={y} x2="80" y2={y} stroke={ACCENT} stroke-width="1" opacity="0.3" marker-end="url(#dsArrow)" />
            );
          }
          return arrows;
        })()}

        {/* Barrier with two slits */}
        {(() => {
          const y1 = slit1Y();
          const y2 = slit2Y();
          const hw = slitHalfW();
          return (
            <>
              {/* Top barrier */}
              <rect x={barrierX - 3} y={20} width="6" height={y1 - hw - 20} rx="1" fill="var(--text-muted)" opacity="0.7" />
              {/* Middle barrier (between slits) */}
              <rect x={barrierX - 3} y={y1 + hw} width="6" height={y2 - hw - y1 - hw} rx="1" fill="var(--text-muted)" opacity="0.7" />
              {/* Bottom barrier */}
              <rect x={barrierX - 3} y={y2 + hw} width="6" height={H_TOP - 20 - y2 - hw} rx="1" fill="var(--text-muted)" opacity="0.7" />

              {/* Slit width markers */}
              <line x1={barrierX - 10} y1={y1 - hw} x2={barrierX - 10} y2={y1 + hw} stroke={ACCENT} stroke-width="0.8" />
              <text x={barrierX - 15} y={y1 + 2} text-anchor="end" font-size="7" fill={ACCENT}>a</text>
              <line x1={barrierX - 10} y1={y2 - hw} x2={barrierX - 10} y2={y2 + hw} stroke={ACCENT} stroke-width="0.8" />

              {/* Slit separation marker */}
              <line x1={barrierX + 12} y1={y1} x2={barrierX + 12} y2={y2} stroke="#3b82f6" stroke-width="1" />
              <line x1={barrierX + 8} y1={y1} x2={barrierX + 16} y2={y1} stroke="#3b82f6" stroke-width="0.8" />
              <line x1={barrierX + 8} y1={y2} x2={barrierX + 16} y2={y2} stroke="#3b82f6" stroke-width="0.8" />
              <text x={barrierX + 20} y={(y1 + y2) / 2 + 3} font-size="8" fill="#3b82f6" font-weight="600">d</text>
            </>
          );
        })()}

        {/* Circular wavefronts from each slit */}
        <For each={wavefronts()}>
          {(wf) => (
            <circle cx={wf.cx} cy={wf.cy} r={wf.r}
              fill="none" stroke={ACCENT} stroke-width="1" opacity={wf.opacity}
              clip-path="url(#rightHalf)" />
          )}
        </For>
        <defs>
          <clipPath id="rightHalf">
            <rect x={barrierX + 5} y="0" width={W - barrierX} height={H_TOP} />
          </clipPath>
        </defs>

        <text x="45" y={H_TOP - 12} font-size="8" fill="var(--text-muted)">Incident waves</text>
        <text x={barrierX + 60} y={H_TOP - 12} font-size="8" fill="var(--text-muted)">Interference region</text>
      </svg>

      {/* Bottom SVG: Intensity plot */}
      <svg width="100%" height={H_BOT} viewBox={`0 0 ${W} ${H_BOT}`} class="mx-auto">
        <text x={W / 2} y="16" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          I({"\u03B8"}) = I_single {"\u00B7"} cos{"\u00B2"}({"\u03C0"}d sin{"\u03B8"}/{"\u03BB"})
        </text>

        {/* Axes */}
        <line x1="20" y1="160" x2="400" y2="160" stroke="var(--text-muted)" stroke-width="0.5" />
        <line x1="210" y1="28" x2="210" y2="165" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
        <text x="210" y="178" text-anchor="middle" font-size="8" fill="var(--text-muted)">{"\u03B8"} = 0</text>
        <text x="8" y="35" font-size="8" fill="var(--text-muted)">I/I{"\u2080"}</text>

        {/* Filled intensity curve */}
        <path d={intensityFillPath()} fill={ACCENT} opacity="0.2" />
        <path d={intensityLinePath()} fill="none" stroke={ACCENT} stroke-width="1.8" />

        {/* Single-slit envelope */}
        {showEnvelope() && (
          <path d={envelopePath()} fill="none" stroke={ENVELOPE_COLOR} stroke-width="1.5" stroke-dasharray="5 3" opacity="0.7" />
        )}

        {/* Constructive interference markers */}
        <For each={constructivePositions()}>
          {(pos) => (
            <>
              <line x1={pos.x} y1="155" x2={pos.x} y2="165" stroke={ACCENT} stroke-width="1.5" />
              {Math.abs(pos.m) <= 3 && (
                <text x={pos.x} y="175" text-anchor="middle" font-size="6" fill={ACCENT}>{pos.m === 0 ? "0" : (pos.m > 0 ? `+${pos.m}` : `${pos.m}`)}</text>
              )}
            </>
          )}
        </For>

        {/* Legend */}
        <line x1="30" y1={H_BOT - 14} x2="50" y2={H_BOT - 14} stroke={ACCENT} stroke-width="2" />
        <text x="55" y={H_BOT - 11} font-size="7" fill="var(--text-muted)">Double-slit I({"\u03B8"})</text>
        {showEnvelope() && (
          <>
            <line x1="180" y1={H_BOT - 14} x2="200" y2={H_BOT - 14} stroke={ENVELOPE_COLOR} stroke-width="1.5" stroke-dasharray="4 2" />
            <text x="205" y={H_BOT - 11} font-size="7" fill="var(--text-muted)">Single-slit envelope</text>
          </>
        )}
        <text x="340" y={H_BOT - 11} font-size="7" fill="var(--text-muted)">m = order</text>
      </svg>

      {/* Controls */}
      <div class="flex items-center gap-3 flex-wrap">
        <button onClick={() => setPlaying(!playing())}
          class="px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-all"
          style={{ background: playing() ? "#ef4444" : ACCENT, color: "white" }}>
          {playing() ? "\u23F8 Pause" : "\u25B6 Play"}
        </button>
        <button onClick={() => { reset(); setPlaying(false); }}
          class="px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Reset
        </button>
        <button onClick={() => setShowEnvelope(!showEnvelope())}
          class="px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-all"
          style={{ background: showEnvelope() ? ENVELOPE_COLOR : "var(--bg-secondary)", color: showEnvelope() ? "white" : "var(--text-secondary)" }}>
          {showEnvelope() ? "Envelope: ON" : "Envelope: OFF"}
        </button>
      </div>

      {/* Stats */}
      <div class="grid grid-cols-3 gap-3">
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Fringe Spacing</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{fringeSpacing()}{"\u00B0"}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Visible Fringes</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{visibleFringes()}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>d/a Ratio</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{(slitSep() / slitWidth()).toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// W2DiffractionGrating — N-slit diffraction grating intensity pattern
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const W2DiffractionGrating: Component = () => {
  const [N, setN] = createSignal(6);
  const [slitSep, setSlitSep] = createSignal(8); // d in lambda units
  const [slitWidth, setSlitWidth] = createSignal(2); // a in lambda units
  const [showComparison, setShowComparison] = createSignal(false);
  const [playing, setPlaying] = createSignal(true);
  const [time, setTime] = createSignal(0);

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

  const W_SVG = 420, H_SVG = 340;
  const thetaMax = Math.PI / 4;
  const plotW = 380, plotH = 220;
  const plotX0 = 20, plotY0 = 50;

  // Compute grating intensity for given N slits
  // I = I_single * [sin(N*delta/2) / sin(delta/2)]^2 / N^2
  // delta = 2*pi*d*sin(theta)/lambda
  // I_single = [sin(beta)/beta]^2, beta = pi*a*sin(theta)/lambda
  const computeIntensity = (nSlits: number, d: number, a: number, theta: number): number => {
    const sinT = Math.sin(theta);
    // Single-slit factor
    const beta = Math.PI * a * sinT;
    const sinc = Math.abs(beta) < 0.0001 ? 1 : Math.sin(beta) / beta;
    const Isingle = sinc * sinc;
    // Multi-slit factor
    const halfDelta = Math.PI * d * sinT;
    let multiSlit: number;
    if (Math.abs(Math.sin(halfDelta)) < 1e-10) {
      // At principal maximum: sin(N*x)/sin(x) -> N when x -> m*pi
      multiSlit = 1;
    } else {
      const ratio = Math.sin(nSlits * halfDelta) / Math.sin(halfDelta);
      multiSlit = (ratio * ratio) / (nSlits * nSlits);
    }
    return Isingle * multiSlit;
  };

  // Main intensity curve
  const intensityCurve = createMemo(() => {
    const n = N();
    const d = slitSep();
    const a = slitWidth();
    const steps = 800;
    const pts: { x: number; y: number; intensity: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const theta = -thetaMax + (2 * thetaMax * i) / steps;
      const intensity = computeIntensity(n, d, a, theta);
      const x = plotX0 + (i / steps) * plotW;
      const y = plotY0 + plotH - intensity * plotH;
      pts.push({ x, y, intensity });
    }
    return pts;
  });

  // N=2 comparison curve
  const comparisonCurve = createMemo(() => {
    if (!showComparison()) return [];
    const d = slitSep();
    const a = slitWidth();
    const steps = 600;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const theta = -thetaMax + (2 * thetaMax * i) / steps;
      const intensity = computeIntensity(2, d, a, theta);
      const x = plotX0 + (i / steps) * plotW;
      const y = plotY0 + plotH - intensity * plotH;
      pts.push({ x, y });
    }
    return pts;
  });

  // Filled path for main intensity
  const intensityFillPath = createMemo(() => {
    const pts = intensityCurve();
    if (pts.length === 0) return "";
    const baseline = plotY0 + plotH;
    let d = `M${pts[0].x.toFixed(1)},${baseline}`;
    for (const p of pts) d += ` L${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    d += ` L${pts[pts.length - 1].x.toFixed(1)},${baseline} Z`;
    return d;
  });

  const intensityLinePath = createMemo(() => {
    const pts = intensityCurve();
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  });

  const comparisonLinePath = createMemo(() => {
    const pts = comparisonCurve();
    if (pts.length === 0) return "";
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  });

  // Principal maxima positions (d*sin(theta) = m*lambda)
  const principalMaxima = createMemo(() => {
    const d = slitSep();
    const positions: { m: number; x: number; thetaDeg: number }[] = [];
    for (let m = -10; m <= 10; m++) {
      const sinT = m / d;
      if (Math.abs(sinT) > Math.sin(thetaMax)) continue;
      const theta = Math.asin(sinT);
      const frac = (theta + thetaMax) / (2 * thetaMax);
      positions.push({
        m,
        x: plotX0 + frac * plotW,
        thetaDeg: (theta * 180) / Math.PI,
      });
    }
    return positions;
  });

  // Resolving power: R = mN (for order m)
  const resolvingPower = createMemo(() => N() * 1); // first order

  // Angular half-width of principal maximum: delta_theta ~ lambda / (N*d*cos(theta))
  // At theta=0: delta_theta ~ lambda / (N*d) radians
  const peakHalfWidth = createMemo(() => {
    const Nd = N() * slitSep();
    if (Nd < 0.01) return 0;
    return ((180 / Math.PI) / Nd).toFixed(3);
  });

  const nPct = () => ((N() - 2) / 28) * 100;
  const sepPct = () => ((slitSep() - 2) / 18) * 100;
  const widthPct = () => ((slitWidth() - 1) / 7) * 100;

  // Animated grating illustration
  const gratingSlits = createMemo(() => {
    const n = Math.min(N(), 15); // Show up to 15 slits in diagram
    const totalH = 100;
    const spacing = totalH / (n + 1);
    const slits: { y: number }[] = [];
    for (let i = 1; i <= n; i++) {
      slits.push({ y: 10 + i * spacing });
    }
    return slits;
  });

  return (
    <div class="space-y-5">
      {/* Sliders */}
      <div class="grid grid-cols-1 gap-3">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "100px" }}>
            N = {N()} slits
          </label>
          <input type="range" min="2" max="30" step="1" value={N()}
            onInput={(e) => setN(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${nPct()}%, var(--border) ${nPct()}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "100px" }}>
            d = {slitSep()}{"\u03BB"}
          </label>
          <input type="range" min="2" max="20" step="1" value={slitSep()}
            onInput={(e) => setSlitSep(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${sepPct()}%, var(--border) ${sepPct()}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "100px" }}>
            a = {slitWidth()}{"\u03BB"}
          </label>
          <input type="range" min="1" max="8" step="1" value={slitWidth()}
            onInput={(e) => setSlitWidth(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${widthPct()}%, var(--border) ${widthPct()}%)` }} />
        </div>
      </div>

      {/* SVG: Intensity plot with grating diagram */}
      <svg width="100%" height={H_SVG} viewBox={`0 0 ${W_SVG} ${H_SVG}`} class="mx-auto">
        <text x={W_SVG / 2} y="16" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          N-Slit Grating: I = I_single {"\u00B7"} [sin(N{"\u03B4"}/2) / sin({"\u03B4"}/2)]{"\u00B2"} / N{"\u00B2"}
        </text>

        {/* Mini grating diagram on the left */}
        <rect x="2" y="28" width="14" height={plotH + 24} rx="2" fill="var(--bg-secondary)" stroke="var(--border)" stroke-width="0.5" />
        {(() => {
          const slits = gratingSlits();
          const elements: any[] = [];
          const xc = 9;
          // Draw slit indicators
          for (const s of slits) {
            const sy = plotY0 + s.y * (plotH / 120);
            elements.push(
              <rect x={xc - 3} y={sy - 1.5} width="6" height="3" rx="1" fill={ACCENT} opacity="0.8" />
            );
          }
          // Animated wave phase fronts
          const t = time();
          for (const s of slits) {
            const sy = plotY0 + s.y * (plotH / 120);
            const phase = ((t * 3) % 1);
            elements.push(
              <circle cx={xc} cy={sy} r={3 + phase * 6} fill="none" stroke={ACCENT} stroke-width="0.5" opacity={0.4 * (1 - phase)} />
            );
          }
          return elements;
        })()}

        {/* Axes */}
        <line x1={plotX0} y1={plotY0 + plotH} x2={plotX0 + plotW} y2={plotY0 + plotH} stroke="var(--text-muted)" stroke-width="0.5" />
        <line x1={plotX0 + plotW / 2} y1={plotY0 - 5} x2={plotX0 + plotW / 2} y2={plotY0 + plotH + 5} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
        <text x={plotX0 + plotW / 2} y={plotY0 + plotH + 18} text-anchor="middle" font-size="8" fill="var(--text-muted)">{"\u03B8"} = 0</text>
        <text x={plotX0} y={plotY0 + plotH + 18} font-size="7" fill="var(--text-muted)">-45{"\u00B0"}</text>
        <text x={plotX0 + plotW - 10} y={plotY0 + plotH + 18} font-size="7" fill="var(--text-muted)">+45{"\u00B0"}</text>
        <text x={plotX0 - 2} y={plotY0 + 3} font-size="7" fill="var(--text-muted)">I/I{"\u2080"}</text>

        {/* Comparison curve (N=2) drawn first */}
        {showComparison() && comparisonLinePath() && (
          <path d={comparisonLinePath()} fill="none" stroke="#3b82f6" stroke-width="1.2" opacity="0.5" stroke-dasharray="4 2" />
        )}

        {/* Main intensity */}
        <path d={intensityFillPath()} fill={ACCENT} opacity="0.2" />
        <path d={intensityLinePath()} fill="none" stroke={ACCENT} stroke-width="2" />

        {/* Principal maxima markers and order labels */}
        <For each={principalMaxima()}>
          {(pm) => (
            <>
              <line x1={pm.x} y1={plotY0 + plotH - 5} x2={pm.x} y2={plotY0 + plotH + 5} stroke={ACCENT} stroke-width="1.5" />
              {Math.abs(pm.m) <= 4 && (
                <text x={pm.x} y={plotY0 + plotH + 28} text-anchor="middle" font-size="7" fill={ACCENT} font-weight="600">
                  m={pm.m}
                </text>
              )}
              {pm.m === 0 && (
                <text x={pm.x} y={plotY0 - 8} text-anchor="middle" font-size="7" fill={ACCENT} font-weight="600">
                  Central max
                </text>
              )}
            </>
          )}
        </For>

        {/* Legend */}
        <line x1={plotX0 + 10} y1={H_SVG - 12} x2={plotX0 + 30} y2={H_SVG - 12} stroke={ACCENT} stroke-width="2" />
        <text x={plotX0 + 35} y={H_SVG - 9} font-size="7" fill="var(--text-muted)">N = {N()} slits</text>
        {showComparison() && (
          <>
            <line x1={plotX0 + 130} y1={H_SVG - 12} x2={plotX0 + 150} y2={H_SVG - 12} stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4 2" />
            <text x={plotX0 + 155} y={H_SVG - 9} font-size="7" fill="var(--text-muted)">N = 2 (double-slit)</text>
          </>
        )}
        <text x={plotX0 + plotW - 60} y={H_SVG - 9} font-size="7" fill="var(--text-muted)">{"\u03B4"} = 2{"\u03C0"}d sin{"\u03B8"}/{"\u03BB"}</text>
      </svg>

      {/* Controls */}
      <div class="flex items-center gap-3 flex-wrap">
        <button onClick={() => setPlaying(!playing())}
          class="px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-all"
          style={{ background: playing() ? "#ef4444" : ACCENT, color: "white" }}>
          {playing() ? "\u23F8 Pause" : "\u25B6 Play"}
        </button>
        <button onClick={() => { reset(); setPlaying(false); }}
          class="px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Reset
        </button>
        <button onClick={() => setShowComparison(!showComparison())}
          class="px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-all"
          style={{ background: showComparison() ? "#3b82f6" : "var(--bg-secondary)", color: showComparison() ? "white" : "var(--text-secondary)" }}>
          {showComparison() ? "N=2 Compare: ON" : "N=2 Compare: OFF"}
        </button>
      </div>

      {/* Stats */}
      <div class="grid grid-cols-3 gap-3">
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Principal Orders</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{principalMaxima().length}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Peak Half-Width</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{peakHalfWidth()}{"\u00B0"}</div>
        </div>
        <div class="card p-3 text-center">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Resolving Power</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>R = {resolvingPower()}</div>
        </div>
      </div>
    </div>
  );
};
