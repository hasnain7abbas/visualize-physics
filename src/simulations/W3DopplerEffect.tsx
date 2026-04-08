import { Component, createSignal, createMemo, onCleanup, For } from "solid-js";

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCENT = "#f59e0b";
const BLUE = "#3b82f6";
const RED = "#ef4444";
const CYAN = "#06b6d4";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// W3MovingSource — Classical Doppler effect with moving source wavefronts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const W3MovingSource: Component = () => {
  const W = 420, H = 280;
  const vWave = 80; // wave speed in px/s
  const emitInterval = 0.25; // seconds between wavefront emissions

  const [sourceSpeedPct, setSourceSpeedPct] = createSignal(50); // 0-90 mapped to 0..0.9
  const [playing, setPlaying] = createSignal(true);
  const [time, setTime] = createSignal(0);

  // Derived source speed as fraction of wave speed
  const speedFrac = createMemo(() => (sourceSpeedPct() / 100) * 0.9);
  const vSource = createMemo(() => speedFrac() * vWave);

  // Observed frequencies using classical Doppler formula: f' = f * v_w / (v_w -/+ v_s)
  const sourceFreq = createMemo(() => 1 / emitInterval);
  const fFront = createMemo(() => {
    const denom = vWave - vSource();
    return denom > 0 ? sourceFreq() * vWave / denom : Infinity;
  });
  const fBack = createMemo(() => sourceFreq() * vWave / (vWave + vSource()));
  const compressionRatio = createMemo(() => {
    const denom = vWave - vSource();
    return denom > 0 ? (vWave + vSource()) / denom : Infinity;
  });

  // Wavefronts: each has emitX (where emitted) and emitTime
  interface Wavefront { emitX: number; emitY: number; emitTime: number; }
  let wavefronts: Wavefront[] = [];
  let nextEmitTime = 0;

  let animFrame: number | undefined;
  let lastTs: number | undefined;

  const step = (ts: number) => {
    if (lastTs === undefined) lastTs = ts;
    if (playing()) {
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      const newTime = time() + dt;

      // Emit new wavefronts
      while (nextEmitTime <= newTime) {
        const sourceX = 40 + vSource() * nextEmitTime;
        // Wrap source position to canvas
        const wrappedX = ((sourceX - 40) % (W - 80)) + 40;
        wavefronts.push({ emitX: wrappedX, emitY: H / 2, emitTime: nextEmitTime });
        nextEmitTime += emitInterval;
      }

      // Remove wavefronts that are too old or too large (limit ~30)
      const maxAge = 5;
      wavefronts = wavefronts.filter(wf => newTime - wf.emitTime < maxAge);
      if (wavefronts.length > 30) {
        wavefronts = wavefronts.slice(wavefronts.length - 30);
      }

      setTime(newTime);
    }
    lastTs = ts;
    animFrame = requestAnimationFrame(step);
  };
  animFrame = requestAnimationFrame(step);
  onCleanup(() => { if (animFrame !== undefined) cancelAnimationFrame(animFrame); });

  const reset = () => {
    setTime(0);
    lastTs = undefined;
    wavefronts = [];
    nextEmitTime = 0;
  };

  // Source position (wrapping)
  const sourceX = createMemo(() => {
    const raw = 40 + vSource() * time();
    return ((raw - 40) % (W - 80)) + 40;
  });

  // Visible wavefronts with computed radii
  const visibleWavefronts = createMemo(() => {
    const t = time();
    return wavefronts.map(wf => ({
      cx: wf.emitX,
      cy: wf.emitY,
      r: vWave * (t - wf.emitTime),
      age: t - wf.emitTime,
    })).filter(wf => wf.r > 0 && wf.r < 500);
  });

  const spdPct = () => sourceSpeedPct();

  return (
    <div class="space-y-5">
      {/* Speed slider */}
      <div class="flex items-center gap-3">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "120px" }}>
          v{"\u209B"}/v{"\u2098"} = {speedFrac().toFixed(2)}
        </label>
        <input type="range" min="0" max="100" step="1" value={sourceSpeedPct()}
          onInput={(e) => setSourceSpeedPct(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${ACCENT} ${spdPct()}%, var(--border) ${spdPct()}%)` }} />
      </div>

      {/* SVG visualization */}
      <svg width="100%" height="280" viewBox={`0 0 ${W} ${H}`} class="mx-auto" style={{ "border-radius": "8px" }}>
        <rect width={W} height={H} fill="var(--bg-secondary)" rx="6" />

        {/* Title */}
        <text x={W / 2} y="18" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Moving Source — Classical Doppler Effect
        </text>

        {/* Wavefronts */}
        <For each={visibleWavefronts()}>
          {(wf) => (
            <circle cx={wf.cx} cy={wf.cy} r={wf.r}
              fill="none" stroke={ACCENT} stroke-width="1.2"
              opacity={Math.max(0.05, 0.6 - wf.age * 0.12)} />
          )}
        </For>

        {/* Source dot */}
        <circle cx={sourceX()} cy={H / 2} r="7" fill={ACCENT} stroke="white" stroke-width="1.5" />

        {/* Direction arrow */}
        <line x1={sourceX() + 12} y1={H / 2} x2={sourceX() + 28} y2={H / 2}
          stroke={ACCENT} stroke-width="2" marker-end="url(#srcArrow)" />
        <defs>
          <marker id="srcArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={ACCENT} />
          </marker>
        </defs>

        {/* Labels: front / back observer */}
        <text x={W - 20} y={H / 2 - 10} text-anchor="end" font-size="9" fill={BLUE} font-weight="600">
          Front (compressed)
        </text>
        <text x="20" y={H / 2 - 10} text-anchor="start" font-size="9" fill={RED} font-weight="600">
          Back (stretched)
        </text>

        {/* Speed label */}
        <text x={W / 2} y={H - 12} text-anchor="middle" font-size="8" fill="var(--text-muted)">
          Source speed: {(speedFrac() * 100).toFixed(0)}% of wave speed
        </text>
      </svg>

      {/* Transport controls */}
      <div class="flex justify-center gap-2">
        <button onClick={() => setPlaying(!playing())}
          class="px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-all"
          style={{ background: playing() ? "#ef4444" : ACCENT, color: "white" }}>
          {playing() ? "\u23F8 Pause" : "\u25B6 Play"}
        </button>
        <button onClick={() => { reset(); setPlaying(false); }}
          class="px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          \u21BA Reset
        </button>
      </div>

      {/* Stats */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>f{"\u2092\u0062\u0073"} (front)</div>
          <div class="text-lg font-bold" style={{ color: BLUE }}>
            {fFront() === Infinity ? "\u221E" : fFront().toFixed(1)} Hz
          </div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>f{"\u2092\u0062\u0073"} (back)</div>
          <div class="text-lg font-bold" style={{ color: RED }}>{fBack().toFixed(1)} Hz</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Compression</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>
            {compressionRatio() === Infinity ? "\u221E" : compressionRatio().toFixed(2) + "x"}
          </div>
        </div>
      </div>
    </div>
  );
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// W3MachCone — Supersonic source with Mach cone visualization
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const W3MachCone: Component = () => {
  const W = 420, H = 320;
  const vWave = 60; // wave speed px/s
  const emitInterval = 0.2;

  const [machSlider, setMachSlider] = createSignal(50); // maps 0..100 to 0.5..3.0
  const [playing, setPlaying] = createSignal(true);
  const [time, setTime] = createSignal(0);

  const machNumber = createMemo(() => 0.5 + (machSlider() / 100) * 2.5);
  const vSource = createMemo(() => machNumber() * vWave);
  const isSupersonic = createMemo(() => machNumber() >= 1);
  const coneHalfAngle = createMemo(() => {
    if (machNumber() < 1) return 90;
    return Math.asin(1 / machNumber()) * (180 / Math.PI);
  });

  // Regime color
  const regimeColor = createMemo(() => {
    const m = machNumber();
    if (m < 0.95) return CYAN;
    if (m < 1.05) return ACCENT;
    return "#f97316";
  });
  const regimeLabel = createMemo(() => {
    const m = machNumber();
    if (m < 0.95) return "Subsonic";
    if (m < 1.05) return "Transonic";
    return "Supersonic";
  });

  interface Wavefront { emitX: number; emitTime: number; }
  let wavefronts: Wavefront[] = [];
  let nextEmitTime = 0;

  let animFrame: number | undefined;
  let lastTs: number | undefined;

  const step = (ts: number) => {
    if (lastTs === undefined) lastTs = ts;
    if (playing()) {
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      const newTime = time() + dt;

      while (nextEmitTime <= newTime) {
        const rawX = W * 0.8 - vSource() * nextEmitTime;
        // Source moves right-to-left conceptually, but we show it moving left-to-right
        const srcX = 40 + vSource() * nextEmitTime;
        const wrappedX = ((srcX - 40) % (W - 80 > 0 ? W - 80 : 1)) + 40;
        wavefronts.push({ emitX: wrappedX, emitTime: nextEmitTime });
        nextEmitTime += emitInterval;
      }

      const maxAge = 6;
      wavefronts = wavefronts.filter(wf => newTime - wf.emitTime < maxAge);
      if (wavefronts.length > 35) wavefronts = wavefronts.slice(wavefronts.length - 35);

      setTime(newTime);
    }
    lastTs = ts;
    animFrame = requestAnimationFrame(step);
  };
  animFrame = requestAnimationFrame(step);
  onCleanup(() => { if (animFrame !== undefined) cancelAnimationFrame(animFrame); });

  const reset = () => {
    setTime(0);
    lastTs = undefined;
    wavefronts = [];
    nextEmitTime = 0;
  };

  const sourceX = createMemo(() => {
    const raw = 40 + vSource() * time();
    const span = W - 80;
    return span > 0 ? ((raw - 40) % span) + 40 : W / 2;
  });
  const sourceY = H / 2;

  const visibleWavefronts = createMemo(() => {
    const t = time();
    return wavefronts.map(wf => ({
      cx: wf.emitX,
      cy: sourceY,
      r: vWave * (t - wf.emitTime),
      age: t - wf.emitTime,
    })).filter(wf => wf.r > 0 && wf.r < 600);
  });

  // Mach cone lines (from current source position)
  const coneLines = createMemo(() => {
    if (!isSupersonic()) return null;
    const alpha = coneHalfAngle() * Math.PI / 180;
    const length = 400;
    const sx = sourceX();
    // Cone opens backward (behind the source)
    const dx = -Math.cos(alpha) * length;
    const dyUp = Math.sin(alpha) * length;
    const dyDown = -Math.sin(alpha) * length;
    return {
      x1: sx, y1: sourceY,
      topX: sx + dx, topY: sourceY + dyDown,
      botX: sx + dx, botY: sourceY + dyUp,
    };
  });

  const machPct = () => machSlider();

  return (
    <div class="space-y-5">
      {/* Mach number slider */}
      <div class="flex items-center gap-3">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "120px" }}>
          Mach = {machNumber().toFixed(2)}
        </label>
        <input type="range" min="0" max="100" step="1" value={machSlider()}
          onInput={(e) => setMachSlider(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${ACCENT} ${machPct()}%, var(--border) ${machPct()}%)` }} />
      </div>

      {/* SVG visualization */}
      <svg width="100%" height="320" viewBox={`0 0 ${W} ${H}`} class="mx-auto" style={{ "border-radius": "8px" }}>
        <rect width={W} height={H} fill="var(--bg-secondary)" rx="6" />

        {/* Title */}
        <text x={W / 2} y="18" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Mach Cone — {regimeLabel()} Regime (M = {machNumber().toFixed(2)})
        </text>

        {/* Wavefronts */}
        <For each={visibleWavefronts()}>
          {(wf) => {
            const opacity = Math.max(0.04, 0.55 - wf.age * 0.1);
            const strokeColor = isSupersonic() ? "#f97316" : CYAN;
            return (
              <circle cx={wf.cx} cy={wf.cy} r={wf.r}
                fill="none" stroke={strokeColor} stroke-width="1"
                opacity={opacity} />
            );
          }}
        </For>

        {/* Mach cone lines */}
        {coneLines() && (
          <>
            <line x1={coneLines()!.x1} y1={coneLines()!.y1}
              x2={coneLines()!.topX} y2={coneLines()!.topY}
              stroke={RED} stroke-width="2.5" opacity="0.7" stroke-dasharray="6 3" />
            <line x1={coneLines()!.x1} y1={coneLines()!.y1}
              x2={coneLines()!.botX} y2={coneLines()!.botY}
              stroke={RED} stroke-width="2.5" opacity="0.7" stroke-dasharray="6 3" />

            {/* Cone angle arc */}
            {(() => {
              const alpha = coneHalfAngle() * Math.PI / 180;
              const arcR = 40;
              const sx = sourceX();
              const arcTopX = sx - arcR * Math.cos(alpha);
              const arcTopY = sourceY - arcR * Math.sin(alpha);
              const arcBotY = sourceY + arcR * Math.sin(alpha);
              return (
                <>
                  <path
                    d={`M ${sx - arcR} ${sourceY} A ${arcR} ${arcR} 0 0 0 ${arcTopX.toFixed(1)} ${arcTopY.toFixed(1)}`}
                    fill="none" stroke={RED} stroke-width="1" opacity="0.5" />
                  <text x={sx - arcR - 6} y={sourceY - 6} text-anchor="end" font-size="8" fill={RED}>
                    {"\u03B1"}={coneHalfAngle().toFixed(1)}{"\u00B0"}
                  </text>
                </>
              );
            })()}
          </>
        )}

        {/* Source dot */}
        <circle cx={sourceX()} cy={sourceY} r="8" fill={regimeColor()} stroke="white" stroke-width="2" />

        {/* Direction arrow */}
        <line x1={sourceX() + 14} y1={sourceY} x2={sourceX() + 30} y2={sourceY}
          stroke={regimeColor()} stroke-width="2" marker-end="url(#machArrow)" />
        <defs>
          <marker id="machArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={regimeColor()} />
          </marker>
        </defs>

        {/* Regime indicator bar */}
        <rect x="15" y={H - 30} width={W - 30} height="6" rx="3" fill="var(--border)" opacity="0.3" />
        {(() => {
          const frac = (machNumber() - 0.5) / 2.5;
          const barW = (W - 30) * frac;
          return <rect x="15" y={H - 30} width={barW} height="6" rx="3" fill={regimeColor()} opacity="0.6" />;
        })()}
        <text x="15" y={H - 10} font-size="7" fill={CYAN}>M=0.5</text>
        <text x={W / 2 - 15} y={H - 10} font-size="7" fill={ACCENT}>M=1.0</text>
        <text x={W - 30} y={H - 10} font-size="7" fill="#f97316" text-anchor="end">M=3.0</text>
      </svg>

      {/* Transport controls */}
      <div class="flex justify-center gap-2">
        <button onClick={() => setPlaying(!playing())}
          class="px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-all"
          style={{ background: playing() ? "#ef4444" : ACCENT, color: "white" }}>
          {playing() ? "\u23F8 Pause" : "\u25B6 Play"}
        </button>
        <button onClick={() => { reset(); setPlaying(false); }}
          class="px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          \u21BA Reset
        </button>
      </div>

      {/* Stats */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Mach Number</div>
          <div class="text-lg font-bold" style={{ color: regimeColor() }}>M = {machNumber().toFixed(2)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Cone Half-Angle</div>
          <div class="text-lg font-bold" style={{ color: regimeColor() }}>
            {isSupersonic() ? coneHalfAngle().toFixed(1) + "\u00B0" : "N/A"}
          </div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Regime</div>
          <div class="text-lg font-bold" style={{ color: regimeColor() }}>{regimeLabel()}</div>
        </div>
      </div>
    </div>
  );
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// W3ObserverFrequency — Angular dependence of Doppler frequency shift
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const W3ObserverFrequency: Component = () => {
  const W = 420, H_TOP = 220, H_BOT = 180;
  const totalH = H_TOP + H_BOT + 10;
  const sourceFreq = 440; // Hz (A4 note)
  const vWave = 343; // m/s (speed of sound in air)

  const [speedPct, setSpeedPct] = createSignal(40); // 0..100 maps to 0..0.9 of vWave
  const [angleDeg, setAngleDeg] = createSignal(0); // 0..360
  const [playing, setPlaying] = createSignal(true);
  const [time, setTime] = createSignal(0);

  const speedFrac = createMemo(() => (speedPct() / 100) * 0.9);
  const vSource = createMemo(() => speedFrac() * vWave);

  // General Doppler formula: f' = f / (1 - (v_s/v_w) * cos(theta))
  const observedFreqAt = (thetaDeg: number) => {
    const thetaRad = thetaDeg * Math.PI / 180;
    const denom = 1 - speedFrac() * Math.cos(thetaRad);
    return denom > 0.01 ? sourceFreq / denom : sourceFreq * 100;
  };

  const observedFreq = createMemo(() => observedFreqAt(angleDeg()));
  const freqRatio = createMemo(() => observedFreq() / sourceFreq);
  const observedWavelength = createMemo(() => vWave / observedFreq());
  const percentShift = createMemo(() => ((observedFreq() - sourceFreq) / sourceFreq * 100));

  // Color based on shift: blue for higher, red for lower
  const shiftColor = createMemo(() => {
    const ratio = freqRatio();
    if (ratio > 1.02) return BLUE;
    if (ratio < 0.98) return RED;
    return ACCENT;
  });

  let animFrame: number | undefined;
  let lastTs: number | undefined;

  const step = (ts: number) => {
    if (lastTs === undefined) lastTs = ts;
    if (playing()) {
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      setTime((t) => t + dt);
    }
    lastTs = ts;
    animFrame = requestAnimationFrame(step);
  };
  animFrame = requestAnimationFrame(step);
  onCleanup(() => { if (animFrame !== undefined) cancelAnimationFrame(animFrame); });

  const reset = () => { setTime(0); lastTs = undefined; };

  // Source position in top SVG (moves right)
  const sourceCX = 210, sourceCY = 120;
  const sourceAnimX = createMemo(() => {
    const offset = Math.sin(time() * 1.5) * 40; // oscillate for visibility
    return sourceCX + offset;
  });

  // Observer position based on angle
  const obsRadius = 80;
  const observerPos = createMemo(() => {
    const rad = angleDeg() * Math.PI / 180;
    return {
      x: sourceCX + obsRadius * Math.cos(rad),
      y: sourceCY - obsRadius * Math.sin(rad),
    };
  });

  // Build plot curve: f'/f vs theta (0 to 360)
  const plotCurve = createMemo(() => {
    const plotL = 40, plotR = W - 20;
    const plotT = 20, plotB = H_BOT - 25;
    const plotW = plotR - plotL;
    const plotH = plotB - plotT;

    // Compute min/max for scaling
    let minRatio = Infinity, maxRatio = -Infinity;
    const pts: { theta: number; ratio: number }[] = [];
    for (let deg = 0; deg <= 360; deg += 2) {
      const r = observedFreqAt(deg) / sourceFreq;
      pts.push({ theta: deg, ratio: r });
      if (r < minRatio) minRatio = r;
      if (r > maxRatio) maxRatio = r;
    }
    // Add some padding
    const range = maxRatio - minRatio;
    const padMin = minRatio - range * 0.1;
    const padMax = maxRatio + range * 0.1;

    const pathParts = pts.map((p, i) => {
      const x = plotL + (p.theta / 360) * plotW;
      const y = plotB - ((p.ratio - padMin) / (padMax - padMin)) * plotH;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    });

    // Current observer point on curve
    const curRatio = observedFreq() / sourceFreq;
    const curX = plotL + (angleDeg() / 360) * plotW;
    const curY = plotB - ((curRatio - padMin) / (padMax - padMin)) * plotH;

    // Reference line at f'/f = 1
    const refY = plotB - ((1 - padMin) / (padMax - padMin)) * plotH;

    return {
      path: pathParts.join(" "),
      curX, curY,
      refY,
      plotL, plotR, plotT, plotB,
      padMin, padMax,
    };
  });

  const spdPct = () => speedPct();
  const angPct = () => (angleDeg() / 360) * 100;

  return (
    <div class="space-y-5">
      {/* Sliders */}
      <div class="grid grid-cols-1 gap-3">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "120px" }}>
            v{"\u209B"}/v = {speedFrac().toFixed(2)}
          </label>
          <input type="range" min="0" max="100" step="1" value={speedPct()}
            onInput={(e) => setSpeedPct(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${spdPct()}%, var(--border) ${spdPct()}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "120px" }}>
            {"\u03B8"} = {angleDeg()}{"\u00B0"}
          </label>
          <input type="range" min="0" max="360" step="1" value={angleDeg()}
            onInput={(e) => setAngleDeg(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${angPct()}%, var(--border) ${angPct()}%)` }} />
        </div>
      </div>

      {/* Top SVG: source + observer diagram */}
      <svg width="100%" height="220" viewBox={`0 0 ${W} ${H_TOP}`} class="mx-auto" style={{ "border-radius": "8px" }}>
        <rect width={W} height={H_TOP} fill="var(--bg-secondary)" rx="6" />

        <text x={W / 2} y="16" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Observer at Angle {"\u03B8"} — Generalized Doppler Effect
        </text>

        {/* Emitted wavefronts (simplified rings) */}
        {(() => {
          const rings = [];
          for (let i = 1; i <= 5; i++) {
            const r = i * 18 + Math.sin(time() * 3 + i) * 3;
            rings.push(
              <circle cx={sourceAnimX()} cy={sourceCY} r={r}
                fill="none" stroke={ACCENT} stroke-width="0.8"
                opacity={Math.max(0.05, 0.5 - i * 0.09)} />
            );
          }
          return rings;
        })()}

        {/* Source motion direction arrow */}
        <line x1={sourceCX - 50} y1={sourceCY} x2={sourceCX + 50} y2={sourceCY}
          stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="4 3" opacity="0.4" />
        <defs>
          <marker id="obsArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--text-muted)" />
          </marker>
        </defs>
        <line x1={sourceCX + 35} y1={sourceCY + 14} x2={sourceCX + 55} y2={sourceCY + 14}
          stroke="var(--text-muted)" stroke-width="1.2" marker-end="url(#obsArrow)" opacity="0.5" />
        <text x={sourceCX + 58} y={sourceCY + 17} font-size="7" fill="var(--text-muted)">v{"\u209B"}</text>

        {/* Source dot */}
        <circle cx={sourceAnimX()} cy={sourceCY} r="7" fill={ACCENT} stroke="white" stroke-width="1.5" />
        <text x={sourceAnimX()} y={sourceCY + 20} text-anchor="middle" font-size="8" fill={ACCENT}>Source</text>

        {/* Angle arc from source to observer */}
        {(() => {
          const arcR = 35;
          const endRad = angleDeg() * Math.PI / 180;
          const endX = sourceCX + arcR * Math.cos(endRad);
          const endY = sourceCY - arcR * Math.sin(endRad);
          const largeArc = angleDeg() > 180 ? 1 : 0;
          return (
            <>
              <path
                d={`M ${sourceCX + arcR} ${sourceCY} A ${arcR} ${arcR} 0 ${largeArc} 0 ${endX.toFixed(1)} ${endY.toFixed(1)}`}
                fill="none" stroke={shiftColor()} stroke-width="1.5" opacity="0.6" />
              <text x={sourceCX + arcR + 8} y={sourceCY - 4} font-size="8" fill={shiftColor()}>
                {"\u03B8"}
              </text>
            </>
          );
        })()}

        {/* Line from source to observer */}
        <line x1={sourceCX} y1={sourceCY} x2={observerPos().x} y2={observerPos().y}
          stroke={shiftColor()} stroke-width="1" stroke-dasharray="3 2" opacity="0.5" />

        {/* Observer dot */}
        <circle cx={observerPos().x} cy={observerPos().y} r="6" fill={shiftColor()} stroke="white" stroke-width="1.5" />
        <text x={observerPos().x} y={observerPos().y - 10} text-anchor="middle" font-size="8" fill={shiftColor()} font-weight="600">
          Observer
        </text>

        {/* Ahead / Behind labels */}
        <text x={sourceCX + obsRadius + 14} y={sourceCY + 4} font-size="7" fill={BLUE} font-weight="600">
          Ahead ({"\u03B8"}=0{"\u00B0"})
        </text>
        <text x={sourceCX - obsRadius - 14} y={sourceCY + 4} text-anchor="end" font-size="7" fill={RED} font-weight="600">
          Behind (180{"\u00B0"})
        </text>

        {/* Frequency display */}
        <text x={W / 2} y={H_TOP - 10} text-anchor="middle" font-size="11" font-weight="700" fill={shiftColor()}>
          f' = {observedFreq().toFixed(1)} Hz ({percentShift() > 0 ? "+" : ""}{percentShift().toFixed(1)}%)
        </text>
      </svg>

      {/* Bottom SVG: f'/f vs theta plot */}
      <svg width="100%" height="180" viewBox={`0 0 ${W} ${H_BOT}`} class="mx-auto" style={{ "border-radius": "8px" }}>
        <rect width={W} height={H_BOT} fill="var(--bg-secondary)" rx="6" />

        {(() => {
          const p = plotCurve();
          return (
            <>
              {/* Axes */}
              <line x1={p.plotL} y1={p.plotB} x2={p.plotR} y2={p.plotB} stroke="var(--text-muted)" stroke-width="1" opacity="0.4" />
              <line x1={p.plotL} y1={p.plotT} x2={p.plotL} y2={p.plotB} stroke="var(--text-muted)" stroke-width="1" opacity="0.4" />

              {/* Reference line at f'/f = 1 */}
              <line x1={p.plotL} y1={p.refY} x2={p.plotR} y2={p.refY}
                stroke="var(--text-muted)" stroke-width="0.7" stroke-dasharray="4 3" opacity="0.3" />
              <text x={p.plotL - 4} y={p.refY + 3} text-anchor="end" font-size="7" fill="var(--text-muted)">1.0</text>

              {/* X-axis labels */}
              <text x={p.plotL} y={p.plotB + 14} text-anchor="middle" font-size="7" fill="var(--text-muted)">0{"\u00B0"}</text>
              <text x={p.plotL + (p.plotR - p.plotL) * 0.25} y={p.plotB + 14} text-anchor="middle" font-size="7" fill="var(--text-muted)">90{"\u00B0"}</text>
              <text x={p.plotL + (p.plotR - p.plotL) * 0.5} y={p.plotB + 14} text-anchor="middle" font-size="7" fill="var(--text-muted)">180{"\u00B0"}</text>
              <text x={p.plotL + (p.plotR - p.plotL) * 0.75} y={p.plotB + 14} text-anchor="middle" font-size="7" fill="var(--text-muted)">270{"\u00B0"}</text>
              <text x={p.plotR} y={p.plotB + 14} text-anchor="middle" font-size="7" fill="var(--text-muted)">360{"\u00B0"}</text>

              {/* Y-axis label */}
              <text x="12" y={(p.plotT + p.plotB) / 2} text-anchor="middle" font-size="8" fill="var(--text-muted)"
                transform={`rotate(-90, 12, ${(p.plotT + p.plotB) / 2})`}>
                f'/f
              </text>

              {/* Y min/max labels */}
              <text x={p.plotL - 4} y={p.plotT + 4} text-anchor="end" font-size="7" fill="var(--text-muted)">{p.padMax.toFixed(1)}</text>
              <text x={p.plotL - 4} y={p.plotB + 3} text-anchor="end" font-size="7" fill="var(--text-muted)">{p.padMin.toFixed(1)}</text>

              {/* Blueshift / Redshift regions */}
              <rect x={p.plotL} y={p.plotT} width={(p.plotR - p.plotL) * 0.5} height={p.plotB - p.plotT}
                fill={BLUE} opacity="0.03" />
              <rect x={p.plotL + (p.plotR - p.plotL) * 0.5} y={p.plotT} width={(p.plotR - p.plotL) * 0.5} height={p.plotB - p.plotT}
                fill={RED} opacity="0.03" />
              <text x={p.plotL + (p.plotR - p.plotL) * 0.25} y={p.plotT + 12} text-anchor="middle" font-size="7" fill={BLUE} opacity="0.6">Blueshift</text>
              <text x={p.plotL + (p.plotR - p.plotL) * 0.75} y={p.plotT + 12} text-anchor="middle" font-size="7" fill={RED} opacity="0.6">Redshift</text>

              {/* Curve */}
              <path d={p.path} fill="none" stroke={ACCENT} stroke-width="2" />

              {/* Current angle marker */}
              <line x1={p.curX} y1={p.plotT} x2={p.curX} y2={p.plotB}
                stroke={shiftColor()} stroke-width="1" stroke-dasharray="3 2" opacity="0.4" />
              <circle cx={p.curX} cy={p.curY} r="5" fill={shiftColor()} stroke="white" stroke-width="1.5" />
            </>
          );
        })()}

        {/* X-axis title */}
        <text x={W / 2} y={H_BOT - 4} text-anchor="middle" font-size="8" fill="var(--text-muted)">
          Observer Angle {"\u03B8"} (degrees)
        </text>
      </svg>

      {/* Transport controls */}
      <div class="flex justify-center gap-2">
        <button onClick={() => setPlaying(!playing())}
          class="px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-all"
          style={{ background: playing() ? "#ef4444" : ACCENT, color: "white" }}>
          {playing() ? "\u23F8 Pause" : "\u25B6 Play"}
        </button>
        <button onClick={() => { reset(); setPlaying(false); }}
          class="px-3 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          \u21BA Reset
        </button>
      </div>

      {/* Stats */}
      <div class="grid grid-cols-4 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Observed f'</div>
          <div class="text-lg font-bold" style={{ color: shiftColor() }}>{observedFreq().toFixed(1)} Hz</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Wavelength</div>
          <div class="text-lg font-bold" style={{ color: shiftColor() }}>{(observedWavelength() * 100).toFixed(1)} cm</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Shift</div>
          <div class="text-lg font-bold" style={{ color: shiftColor() }}>
            {percentShift() > 0 ? "+" : ""}{percentShift().toFixed(1)}%
          </div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>f'/f Ratio</div>
          <div class="text-lg font-bold" style={{ color: shiftColor() }}>{freqRatio().toFixed(3)}</div>
        </div>
      </div>
    </div>
  );
};
