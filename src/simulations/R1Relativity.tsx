import { Component, createSignal, createMemo, For, Show } from "solid-js";

const ACCENT = "#8b5cf6";

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

const StatCard: Component<{ label: string; value: string; sub?: string; color: string }> = (p) => (
  <div class="rounded-lg p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
    <div class="text-[9px] font-bold uppercase tracking-widest" style={{ color: p.color }}>
      {p.label}
    </div>
    <div class="text-sm font-mono font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>
      {p.value}
    </div>
    {p.sub && (
      <div class="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
        {p.sub}
      </div>
    )}
  </div>
);

const Slider: Component<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onInput: (v: number) => void;
  unit?: string;
}> = (p) => (
  <label class="block">
    <div class="flex justify-between text-[11px] mb-1">
      <span style={{ color: "var(--text-secondary)" }}>{p.label}</span>
      <span style={{ color: "var(--text-primary)" }} class="font-mono">
        {p.value.toFixed(p.step && p.step < 1 ? 3 : 0)}{p.unit ? ` ${p.unit}` : ""}
      </span>
    </div>
    <input
      type="range"
      min={p.min}
      max={p.max}
      step={p.step ?? 1}
      value={p.value}
      onInput={(e) => p.onInput(parseFloat(e.currentTarget.value))}
      class="w-full h-1.5 rounded-full appearance-none cursor-pointer"
      style={{
        background: `linear-gradient(to right, ${ACCENT} ${((p.value - p.min) / (p.max - p.min)) * 100}%, var(--border) ${((p.value - p.min) / (p.max - p.min)) * 100}%)`,
      }}
    />
  </label>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// R1SpacetimeDiagram — Minkowski diagram with boost. Axes (x, ct), light
// cone, and movable events. Boost tilts primed axes by atanh(β).
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const R1SpacetimeDiagram: Component = () => {
  const W = 440, H = 380;
  const cx = W / 2, cy = H / 2;
  const scale = 30; // 1 unit = 30 px

  const [beta, setBeta] = createSignal(0.5);

  // Three preset events in lab frame (x, ct)
  const [events, setEvents] = createSignal<{ x: number; ct: number; label: string; color: string }[]>([
    { x: 2, ct: 0, label: "A", color: "#06b6d4" },
    { x: 2, ct: 3, label: "B", color: "#ec4899" },
    { x: -2, ct: 2, label: "C", color: "#22c55e" },
  ]);

  const gamma = () => 1 / Math.sqrt(1 - beta() * beta());
  const transform = (x: number, ct: number) => ({
    x: gamma() * (x - beta() * ct),
    ct: gamma() * (ct - beta() * x),
  });

  // Convert (x, ct) to SVG coords
  const toSVG = (x: number, ct: number) => ({ x: cx + x * scale, y: cy - ct * scale });

  // Primed axes: x' is the line where ct' = 0, i.e. ct = β x. ct' axis: x' = 0, i.e. x = β ct.
  const xPrimedAxis = () => {
    const end = 5;
    const a = toSVG(-end, -beta() * end);
    const b = toSVG(end, beta() * end);
    return { a, b };
  };
  const ctPrimedAxis = () => {
    const end = 5;
    const a = toSVG(-beta() * end, -end);
    const b = toSVG(beta() * end, end);
    return { a, b };
  };

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Slider label="Boost β = v/c" value={beta()} min={-0.95} max={0.95} step={0.01} onInput={setBeta} />
        <div class="flex items-end gap-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
          γ = {gamma().toFixed(3)}, tilt = {(Math.atanh(beta()) * 180 / Math.PI).toFixed(1)}° (rapidity)
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "440px" }}>
        {/* Light cone */}
        <polygon
          points={`${toSVG(0, 0).x},${toSVG(0, 0).y} ${toSVG(-6, 6).x},${toSVG(-6, 6).y} ${toSVG(6, 6).x},${toSVG(6, 6).y}`}
          fill={`${ACCENT}10`}
        />
        <polygon
          points={`${toSVG(0, 0).x},${toSVG(0, 0).y} ${toSVG(-6, -6).x},${toSVG(-6, -6).y} ${toSVG(6, -6).x},${toSVG(6, -6).y}`}
          fill={`${ACCENT}10`}
        />
        {/* Grid */}
        <For each={[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]}>
          {(i) => (
            <>
              <line x1={toSVG(i, -5).x} y1={toSVG(i, -5).y} x2={toSVG(i, 5).x} y2={toSVG(i, 5).y} stroke="var(--border)" stroke-width="0.5" opacity="0.4" />
              <line x1={toSVG(-5, i).x} y1={toSVG(-5, i).y} x2={toSVG(5, i).x} y2={toSVG(5, i).y} stroke="var(--border)" stroke-width="0.5" opacity="0.4" />
            </>
          )}
        </For>
        {/* Lab axes (x, ct) */}
        <line x1={toSVG(-6, 0).x} y1={toSVG(-6, 0).y} x2={toSVG(6, 0).x} y2={toSVG(6, 0).y} stroke="var(--text-secondary)" stroke-width="1.5" />
        <line x1={toSVG(0, -6).x} y1={toSVG(0, -6).y} x2={toSVG(0, 6).x} y2={toSVG(0, 6).y} stroke="var(--text-secondary)" stroke-width="1.5" />
        <text x={toSVG(5.5, 0).x} y={toSVG(5.5, 0).y + 14} font-size="11" fill="var(--text-secondary)">x</text>
        <text x={toSVG(0, 5.5).x + 6} y={toSVG(0, 5.5).y} font-size="11" fill="var(--text-secondary)">ct</text>
        {/* Light cone diagonals */}
        <line x1={toSVG(-6, -6).x} y1={toSVG(-6, -6).y} x2={toSVG(6, 6).x} y2={toSVG(6, 6).y} stroke={ACCENT} stroke-width="1" stroke-dasharray="4 3" opacity="0.6" />
        <line x1={toSVG(-6, 6).x} y1={toSVG(-6, 6).y} x2={toSVG(6, -6).x} y2={toSVG(6, -6).y} stroke={ACCENT} stroke-width="1" stroke-dasharray="4 3" opacity="0.6" />
        {/* Primed axes */}
        <line x1={xPrimedAxis().a.x} y1={xPrimedAxis().a.y} x2={xPrimedAxis().b.x} y2={xPrimedAxis().b.y} stroke="#f59e0b" stroke-width="1.5" />
        <line x1={ctPrimedAxis().a.x} y1={ctPrimedAxis().a.y} x2={ctPrimedAxis().b.x} y2={ctPrimedAxis().b.y} stroke="#f59e0b" stroke-width="1.5" />
        <text x={xPrimedAxis().b.x + 5} y={xPrimedAxis().b.y} font-size="10" fill="#f59e0b">x'</text>
        <text x={ctPrimedAxis().b.x + 5} y={ctPrimedAxis().b.y} font-size="10" fill="#f59e0b">ct'</text>
        {/* Events */}
        <For each={events()}>
          {(e) => {
            const p = toSVG(e.x, e.ct);
            const pp = transform(e.x, e.ct);
            return (
              <>
                <circle cx={p.x} cy={p.y} r="5" fill={e.color} stroke="white" stroke-width="1.5" />
                <text x={p.x + 8} y={p.y - 6} font-size="10" font-weight="600" fill={e.color}>
                  {e.label}: ({e.x.toFixed(1)}, {e.ct.toFixed(1)})
                </text>
                <text x={p.x + 8} y={p.y + 6} font-size="9" fill="var(--text-muted)">
                  → ({pp.x.toFixed(2)}, {pp.ct.toFixed(2)})
                </text>
              </>
            );
          }}
        </For>
      </svg>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        The orange axes are the $x', ct'$ axes of a frame moving at $\beta c$. As $\beta \to \pm 1$ they close onto the light cone. Two events on the same horizontal line (simultaneous in the lab) generally lie on different $x'$ lines — the relativity of simultaneity.
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// R1TimeDilation — Light clock in train frame and platform frame, side by
// side. Platform observer sees the light travel a longer zig-zag path,
// hence more time per "tick".
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const R1TimeDilation: Component = () => {
  const [beta, setBeta] = createSignal(0.7);
  const [t, setT] = createSignal(0);
  const [running, setRunning] = createSignal(false);

  const gamma = () => 1 / Math.sqrt(1 - beta() * beta());

  let raf: number | undefined;
  const step = () => {
    if (!running()) return;
    setT((v) => (v + 0.015) % 2.0);
    raf = requestAnimationFrame(step);
  };
  const toggle = () => {
    if (running()) {
      setRunning(false);
      if (raf) cancelAnimationFrame(raf);
    } else {
      setRunning(true);
      raf = requestAnimationFrame(step);
    }
  };
  const reset = () => {
    setRunning(false);
    if (raf) cancelAnimationFrame(raf);
    setT(0);
  };

  // Rest-frame clock tick period = 2 (photon goes up and back down)
  // Platform frame: photon zig-zags, period = 2γ
  const H_CLOCK = 80;
  const W = 480, H = 220;

  // Rest frame view: photon at (0, y), y oscillates.
  const restY = () => H_CLOCK * (1 - Math.abs((t() % 1) * 2 - 1));
  // Platform frame: ticks take 2γ. Use scaled time so visually matches.
  // Photon travels along zig-zag from (x0, 0) to (x0 + vγ·1, H) and back.
  const platformTau = () => (t() % (2 * gamma())) / gamma(); // 0..2 in proper time
  const platformY = () => H_CLOCK * (1 - Math.abs((platformTau() % 2) / 2 * 2 - 1));

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Slider label="Train velocity β" value={beta()} min={0.05} max={0.95} step={0.01} onInput={setBeta} />
        <div class="flex gap-2">
          <button
            onClick={toggle}
            class="flex-1 px-3 py-2 rounded-lg text-xs font-semibold"
            style={{ background: ACCENT, color: "white" }}
          >
            {running() ? "Pause" : "Play"}
          </button>
          <button
            onClick={reset}
            class="px-3 py-2 rounded-lg text-xs font-semibold"
            style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            Reset
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "280px" }}>
        {/* Left: train (rest) frame */}
        <text x={110} y={20} text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-secondary)">Train frame (proper time τ)</text>
        <rect x={60} y={40} width={100} height={H_CLOCK + 20} rx="4" fill="none" stroke="var(--border)" />
        <line x1={110} y1={50} x2={110} y2={50 + H_CLOCK} stroke={`${ACCENT}40`} stroke-width="1" stroke-dasharray="3 3" />
        <circle cx={110} cy={50 + restY()} r="5" fill={ACCENT} />
        <circle cx={110} cy={50 + H_CLOCK} r="3" fill="var(--text-muted)" />
        <circle cx={110} cy={50} r="3" fill="var(--text-muted)" />
        <text x={110} y={50 + H_CLOCK + 22} text-anchor="middle" font-size="10" fill="var(--text-muted)">τ = {t().toFixed(2)}</text>

        {/* Right: platform frame */}
        <text x={340} y={20} text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-secondary)">Platform frame (lab time Δt = γτ)</text>
        <line x1={200} y1={170} x2={W - 20} y2={170} stroke="var(--border)" />
        {/* Ground markers */}
        <For each={[0, 1, 2, 3, 4, 5]}>
          {(i) => <line x1={210 + i * 40} y1={170} x2={210 + i * 40} y2={175} stroke="var(--border)" />}
        </For>
        {/* Moving clock */}
        {(() => {
          const clockX = 220 + (t() * 200 * beta()) % 240;
          const y = 80 + platformY();
          return (
            <>
              <rect x={clockX - 20} y={70} width={40} height={H_CLOCK + 10} rx="3" fill="none" stroke="var(--border)" />
              <circle cx={clockX} cy={y} r="5" fill={ACCENT} />
              <circle cx={clockX} cy={70} r="3" fill="var(--text-muted)" />
              <circle cx={clockX} cy={70 + H_CLOCK} r="3" fill="var(--text-muted)" />
              {/* Arrow showing velocity */}
              <line x1={clockX + 22} y1={125} x2={clockX + 42} y2={125} stroke={ACCENT} stroke-width="2" />
              <polygon points={`${clockX + 42},${125} ${clockX + 36},${122} ${clockX + 36},${128}`} fill={ACCENT} />
              <text x={clockX + 32} y={115} font-size="9" fill={ACCENT}>v</text>
            </>
          );
        })()}
        <text x={340} y={200} text-anchor="middle" font-size="10" fill="var(--text-muted)">Δt = {(t() * gamma()).toFixed(2)} = γ·τ</text>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="β" value={beta().toFixed(3)} sub="v/c" color={ACCENT} />
        <StatCard label="γ" value={gamma().toFixed(3)} sub="1/√(1−β²)" color={ACCENT} />
        <StatCard label="Length contraction" value={(1 / gamma()).toFixed(3)} sub="L/L₀" color={ACCENT} />
        <StatCard label="Time dilation" value={gamma().toFixed(3)} sub="Δt/Δτ" color={ACCENT} />
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// R1EnergyMomentum — E² = (pc)² + (mc²)². Classical KE = ½mv² vs
// relativistic KE = (γ-1)mc² across the whole β range.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const R1EnergyMomentum: Component = () => {
  const [beta, setBeta] = createSignal(0.5);
  const [massMeV, setMassMeV] = createSignal(0.511); // electron rest mass MeV/c²

  const gamma = () => 1 / Math.sqrt(1 - beta() * beta());
  const m = () => massMeV(); // treat as MeV/c²
  const E = () => gamma() * m(); // MeV
  const p = () => gamma() * beta() * m(); // MeV/c
  const KE_rel = () => (gamma() - 1) * m();
  const KE_class = () => 0.5 * m() * beta() * beta();

  const W = 440, H = 240;
  const padL = 34, padR = 10, padT = 14, padB = 32;
  const plotW = W - padL - padR, plotH = H - padT - padB;

  // Curve: KE/mc² vs β, classical and relativistic. Max β = 0.98.
  const nPts = 100;
  const curveClass = () => {
    const pts: { b: number; ke: number }[] = [];
    for (let i = 0; i <= nPts; i++) {
      const b = (0.98 * i) / nPts;
      pts.push({ b, ke: 0.5 * b * b });
    }
    return pts;
  };
  const curveRel = () => {
    const pts: { b: number; ke: number }[] = [];
    for (let i = 0; i <= nPts; i++) {
      const b = (0.98 * i) / nPts;
      const g = 1 / Math.sqrt(1 - b * b);
      pts.push({ b, ke: g - 1 });
    }
    return pts;
  };

  const KE_MAX = 4; // y axis cap in units of mc²
  const bToX = (b: number) => padL + (b / 0.98) * plotW;
  const keToY = (ke: number) => padT + plotH - Math.min(ke, KE_MAX) / KE_MAX * plotH;

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Slider label="Velocity β" value={beta()} min={0.0} max={0.98} step={0.001} onInput={setBeta} />
        <Slider label="Rest mass (MeV/c²)" value={massMeV()} min={0.511} max={940} step={0.1} onInput={setMassMeV} />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "280px" }}>
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--border)" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
        <text x={padL - 4} y={padT + 6} text-anchor="end" font-size="9" fill="var(--text-muted)">{KE_MAX}</text>
        <text x={padL - 4} y={H - padB} text-anchor="end" font-size="9" fill="var(--text-muted)">0</text>
        <text x={padL - 14} y={padT + plotH / 2} text-anchor="middle" font-size="9" fill="var(--text-muted)" transform={`rotate(-90 ${padL - 14} ${padT + plotH / 2})`}>
          KE / mc²
        </text>
        <text x={W / 2} y={H - 8} text-anchor="middle" font-size="10" fill="var(--text-muted)">β = v/c</text>
        {/* ticks */}
        <For each={[0.2, 0.4, 0.6, 0.8]}>
          {(b) => (
            <>
              <line x1={bToX(b)} y1={H - padB} x2={bToX(b)} y2={H - padB + 3} stroke="var(--border)" />
              <text x={bToX(b)} y={H - padB + 12} text-anchor="middle" font-size="8" fill="var(--text-muted)">{b}</text>
            </>
          )}
        </For>
        {/* classical */}
        <polyline
          fill="none"
          stroke="#06b6d4"
          stroke-width="2"
          stroke-dasharray="4 3"
          points={curveClass().map((p) => `${bToX(p.b)},${keToY(p.ke)}`).join(" ")}
        />
        {/* relativistic */}
        <polyline
          fill="none"
          stroke={ACCENT}
          stroke-width="2.5"
          points={curveRel().map((p) => `${bToX(p.b)},${keToY(p.ke)}`).join(" ")}
        />
        {/* light barrier */}
        <line x1={bToX(0.98)} y1={padT} x2={bToX(0.98)} y2={H - padB} stroke="#ef4444" stroke-width="1" stroke-dasharray="4 3" opacity="0.6" />
        <text x={bToX(0.98) - 6} y={padT + 14} text-anchor="end" font-size="9" fill="#ef4444">β → 1</text>
        {/* current point */}
        <circle cx={bToX(beta())} cy={keToY(KE_rel() / m())} r="5" fill={ACCENT} stroke="white" stroke-width="1.5" />
        {/* legend */}
        <g transform={`translate(${padL + 12}, ${padT + 10})`}>
          <line x1="0" y1="0" x2="20" y2="0" stroke={ACCENT} stroke-width="2.5" />
          <text x="24" y="4" font-size="10" fill="var(--text-secondary)">Relativistic (γ−1)mc²</text>
          <line x1="0" y1="14" x2="20" y2="14" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4 3" />
          <text x="24" y="18" font-size="10" fill="var(--text-secondary)">Classical ½mv²</text>
        </g>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="γ" value={gamma().toFixed(3)} sub="Lorentz factor" color={ACCENT} />
        <StatCard label="E = γmc²" value={`${E().toFixed(2)} MeV`} sub="total energy" color={ACCENT} />
        <StatCard label="pc = γβmc²" value={`${p().toFixed(2)} MeV`} color={ACCENT} />
        <StatCard label="KE (rel)" value={`${KE_rel().toFixed(2)} MeV`} sub={`classical: ${KE_class().toFixed(2)}`} color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        At low β the two curves coincide (Newton was right for everyday speeds). The relativistic KE diverges at β=1 — why no massive particle can reach the speed of light. The energy-momentum relation $E^2 = (pc)^2 + (mc^2)^2$ holds for both massive ($m>0$) and massless ($m=0$, $E=pc$) particles.
      </div>
    </div>
  );
};
