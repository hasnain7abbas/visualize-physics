import { Component, createSignal, createMemo, onCleanup, For, Show } from "solid-js";

const ACCENT = "#0ea5e9";

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
        {p.value.toFixed(p.step && p.step < 1 ? 2 : 0)}{p.unit ? ` ${p.unit}` : ""}
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
// G1SchwarzschildOrbit — effective potential V_eff(r) for a massive
// particle in Schwarzschild spacetime, and a numerical orbit integrated
// in Schwarzschild coordinates showing perihelion precession.
//
// Using M = 1 (geometric units, so r_s = 2). Radii in units of M.
// ISCO at r = 6M. Photon sphere at r = 3M.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const G1SchwarzschildOrbit: Component = () => {
  const M = 1;
  const r_s = 2 * M;

  // Conserved quantities (per unit rest mass)
  const [L, setL] = createSignal(3.8); // specific angular momentum (M units)
  const [E, setE] = createSignal(0.96); // specific energy (≈1 for bound)
  const [running, setRunning] = createSignal(false);
  const [trail, setTrail] = createSignal<{ x: number; y: number }[]>([]);

  // V_eff(r) = sqrt((1 - r_s/r)(1 + L^2/r^2))  (effective potential used
  // as (E-effective)^2 = 1 + 2V_NR_like;
  // Standard form: V²(r) = (1 - 2M/r)(1 + L²/r²). Compare E² to V².
  const Veff = (r: number) => Math.sqrt((1 - r_s / r) * (1 + L() * L() / (r * r)));

  // Find turning points and plot range
  const plot = createMemo(() => {
    const pts: { r: number; v: number }[] = [];
    for (let r = 2.05; r <= 30; r += 0.1) {
      pts.push({ r, v: Veff(r) });
    }
    return pts;
  });

  // Orbit in Schwarzschild coords: r(phi), numerically integrate
  // (dr/dφ)² = r⁴/L² [(E² − V²(r))] with a radial equation equivalent
  // We'll integrate in (r, phi) with dr/dphi using the standard
  // effective potential equation:  (dr/dphi)^2 = r^4/L^2 * (E^2 - V^2(r))
  const [phi, setPhi] = createSignal(0);
  const [r, setR] = createSignal(10);
  const [drdp, setDrdp] = createSignal(-0.5);
  const [orbit, setOrbit] = createSignal<{ x: number; y: number }[]>([]);

  const initOrbit = () => {
    // Start at r = 10 with phi = 0, moving inward
    const r0 = 10;
    const phi0 = 0;
    // Compute initial dr/dphi so that E,L are conserved:
    // (dr/dphi)² = r⁴/L² (E² − V²(r))
    const val = (r0 * r0 * r0 * r0) / (L() * L()) * (E() * E() - Veff(r0) ** 2);
    setR(r0);
    setPhi(phi0);
    setDrdp(val > 0 ? -Math.sqrt(val) : 0);
    setOrbit([{ x: r0, y: 0 }]);
  };

  initOrbit();

  let raf: number | undefined;
  const tick = () => {
    if (!running()) { raf = requestAnimationFrame(tick); return; }

    // Integrate forward in phi using leapfrog-like step
    const dphi = 0.01;
    let rr = r(), pp = phi(), dd = drdp();
    const STEPS = 6;
    for (let i = 0; i < STEPS; i++) {
      // rhs: d²r/dphi² = 2(dr/dphi)²/r - (r⁴/L²) * d(V²)/dr / 2
      // Easier: from conservation
      //   (dr/dphi)² = r⁴/L² (E² − V²(r))
      // We can compute dr/dphi from current r directly (consistent with E,L):
      const v2 = Veff(rr) ** 2;
      const val = (rr * rr * rr * rr) / (L() * L()) * (E() * E() - v2);
      if (val <= 0) {
        // turning point: flip sign
        dd = -Math.sign(dd) * 0.0001;
        rr = rr + dd * dphi; // nudge
      } else {
        const newD = Math.sign(dd) * Math.sqrt(val);
        dd = newD;
        rr = rr + dd * dphi;
      }
      pp = pp + dphi;
      if (rr <= r_s + 0.05) {
        // captured
        setRunning(false);
        break;
      }
      if (rr > 40) {
        // escaped
        setRunning(false);
        break;
      }
    }
    setR(rr); setPhi(pp); setDrdp(dd);
    setOrbit((o) => {
      const next = [...o, { x: rr * Math.cos(pp), y: rr * Math.sin(pp) }];
      if (next.length > 2000) next.shift();
      return next;
    });

    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
  onCleanup(() => { if (raf) cancelAnimationFrame(raf); });

  const toggle = () => setRunning(!running());
  const reset = () => {
    setRunning(false);
    initOrbit();
  };

  // SVG layout: orbit on left, V_eff plot on right
  const W = 480, H = 260;

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Slider label="Angular momentum L/M" value={L()} min={2.5} max={6} step={0.05} onInput={(v) => { setL(v); reset(); }} />
        <Slider label="Energy E (per rest mass)" value={E()} min={0.9} max={1.05} step={0.005} onInput={(v) => { setE(v); reset(); }} />
      </div>

      <div class="flex gap-2">
        <button onClick={toggle} class="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: ACCENT, color: "white" }}>
          {running() ? "Pause" : "Play"}
        </button>
        <button onClick={reset} class="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
          Reset
        </button>
        <div class="text-[11px] self-center" style={{ color: "var(--text-muted)" }}>
          r = {r().toFixed(2)} M, φ = {(phi() / Math.PI).toFixed(2)}π
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "320px" }}>
        {/* Orbit view (left half, centered on BH) */}
        {(() => {
          const cx = 120, cy = H / 2;
          const scaleLen = 10; // 1 M = 10 px => max r = ~12M fits
          const toSX = (x: number) => cx + x * scaleLen;
          const toSY = (y: number) => cy - y * scaleLen;
          return (
            <>
              <text x={cx} y={16} text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-secondary)">Orbit</text>
              {/* Event horizon */}
              <circle cx={cx} cy={cy} r={r_s * scaleLen} fill="black" stroke="#ef4444" stroke-width="1.5" />
              {/* Photon sphere ring */}
              <circle cx={cx} cy={cy} r={3 * M * scaleLen} fill="none" stroke="#fbbf24" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.6" />
              {/* ISCO ring */}
              <circle cx={cx} cy={cy} r={6 * M * scaleLen} fill="none" stroke="#22c55e" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.6" />
              {/* Trail */}
              <polyline
                fill="none"
                stroke={ACCENT}
                stroke-width="1.2"
                points={orbit().map((p) => `${toSX(p.x)},${toSY(p.y)}`).join(" ")}
              />
              {/* Particle */}
              <circle cx={toSX(r() * Math.cos(phi()))} cy={toSY(r() * Math.sin(phi()))} r="4" fill={ACCENT} stroke="white" stroke-width="1" />
              {/* Legend */}
              <g transform={`translate(${cx - 100}, ${H - 20})`} font-size="8" fill="var(--text-muted)">
                <circle cx="0" cy="0" r="2" fill="#ef4444" /><text x="6" y="3">r=2M horizon</text>
                <circle cx="0" cy="10" r="2" fill="#fbbf24" /><text x="6" y="13">r=3M photon</text>
                <circle cx="0" cy="20" r="2" fill="#22c55e" /><text x="6" y="23">r=6M ISCO</text>
              </g>
            </>
          );
        })()}

        {/* V_eff plot (right half) */}
        {(() => {
          const padL = 260, padR = 10, padT = 16, padB = 30;
          const plotW = W - padL - padR, plotH = H - padT - padB;
          const V_MAX = 1.15;
          const rMax = 25;
          const rToX = (rr: number) => padL + (Math.min(rr, rMax) / rMax) * plotW;
          const vToY = (vv: number) => padT + plotH - ((vv - 0.9) / (V_MAX - 0.9)) * plotH;
          return (
            <>
              <text x={padL + plotW / 2} y={16} text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-secondary)">V_eff(r)</text>
              <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--border)" />
              <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
              <text x={padL - 4} y={padT + 6} text-anchor="end" font-size="8" fill="var(--text-muted)">{V_MAX.toFixed(2)}</text>
              <text x={padL - 4} y={H - padB} text-anchor="end" font-size="8" fill="var(--text-muted)">0.90</text>
              <text x={padL + plotW / 2} y={H - 8} text-anchor="middle" font-size="9" fill="var(--text-muted)">r / M</text>
              {/* V_eff curve */}
              <polyline
                fill="none"
                stroke={ACCENT}
                stroke-width="1.8"
                points={plot().filter((p) => p.r <= rMax).map((p) => `${rToX(p.r)},${vToY(p.v)}`).join(" ")}
              />
              {/* Horizontal E line */}
              <line x1={padL} y1={vToY(E())} x2={W - padR} y2={vToY(E())} stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 3" />
              <text x={W - padR - 4} y={vToY(E()) - 2} text-anchor="end" font-size="8" fill="#f59e0b">E = {E().toFixed(3)}</text>
              {/* Current r marker */}
              <circle cx={rToX(r())} cy={vToY(Veff(r()))} r="3" fill={ACCENT} />
            </>
          );
        })()}
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="L / M" value={L().toFixed(2)} color={ACCENT} />
        <StatCard label="E" value={E().toFixed(3)} sub="per rest mass" color={ACCENT} />
        <StatCard label="r / M" value={r().toFixed(2)} color={ACCENT} />
        <StatCard label="ISCO" value="r = 6M" sub="inner stable" color="#22c55e" />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        {"The Schwarzschild effective potential $V^2(r) = (1-2M/r)(1+L^2/r^2)$ develops both a maximum (unstable circular orbit) and a minimum (stable circular orbit) for $L > 2\\sqrt{3}\\,M$. The **innermost stable circular orbit** sits at $r=6M$. Bound orbits with $E<1$ trace a flower-like pattern — the **precession** famously accounts for 43″/century of Mercury's perihelion."}
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// G1GravitationalLensing — point-mass lens equation: β = θ - α(θ) with
// α = θ_E² / θ (thin-lens approximation). Shows double images and the
// Einstein ring.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const G1GravitationalLensing: Component = () => {
  const [beta, setBeta] = createSignal(0.3); // source angular offset (in units of θ_E)
  const [thetaE, setThetaE] = createSignal(40); // Einstein radius (px)

  // Lens equation: β = θ - θ_E²/θ  →  θ² - βθ - θ_E² = 0
  // θ± = (β ± √(β² + 4))/2 (in θ_E units; here scale)
  const imagePositions = createMemo(() => {
    const b = beta();
    // Solutions in θ_E units:
    const plus = (b + Math.sqrt(b * b + 4)) / 2;
    const minus = (b - Math.sqrt(b * b + 4)) / 2;
    return { plus: plus * thetaE(), minus: minus * thetaE() };
  });

  const W = 480, H = 260;
  const cx = W / 2, cy = H / 2;

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Slider label="Source offset β / θ_E" value={beta()} min={-2} max={2} step={0.01} onInput={setBeta} />
        <Slider label="Einstein radius θ_E" value={thetaE()} min={15} max={80} step={1} unit="px" onInput={setThetaE} />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "320px" }}>
        {/* Background star field */}
        <For each={Array.from({ length: 80 }, (_, i) => i)}>
          {(i) => {
            const seed = Math.sin(i * 2.7) * 10000;
            const x = cx + ((seed - Math.floor(seed)) - 0.5) * (W - 60);
            const y = cy + ((Math.sin(seed * 3.1) - Math.floor(Math.sin(seed * 3.1))) - 0.5) * (H - 40);
            return <circle cx={x} cy={y} r="0.8" fill="var(--text-muted)" opacity="0.4" />;
          }}
        </For>
        {/* Einstein ring */}
        <circle cx={cx} cy={cy} r={thetaE()} fill="none" stroke={ACCENT} stroke-width="1" stroke-dasharray="3 3" opacity="0.5" />
        <text x={cx + thetaE() + 4} y={cy - 4} font-size="9" fill={ACCENT} opacity="0.8">θ_E</text>
        {/* Lens (black hole/galaxy) */}
        <circle cx={cx} cy={cy} r="8" fill="black" stroke={`${ACCENT}60`} stroke-width="2" />
        <text x={cx} y={cy + 22} text-anchor="middle" font-size="9" fill="var(--text-muted)">lens</text>
        {/* True source (faded) */}
        <circle cx={cx + beta() * thetaE()} cy={cy} r="4" fill="#f59e0b" opacity="0.4" />
        <text x={cx + beta() * thetaE()} y={cy - 8} text-anchor="middle" font-size="9" fill="#f59e0b" opacity="0.6">true source</text>
        {/* Images */}
        <circle cx={cx + imagePositions().plus} cy={cy} r="5" fill="#22c55e" />
        <text x={cx + imagePositions().plus} y={cy - 10} text-anchor="middle" font-size="9" fill="#22c55e">image +</text>
        <circle cx={cx + imagePositions().minus} cy={cy} r="5" fill="#ec4899" />
        <text x={cx + imagePositions().minus} y={cy - 10} text-anchor="middle" font-size="9" fill="#ec4899">image −</text>
        {/* Ray paths */}
        <line x1={cx + beta() * thetaE()} y1={cy - 80} x2={cx + imagePositions().plus} y2={cy} stroke="#22c55e" stroke-width="0.8" opacity="0.5" />
        <line x1={cx + imagePositions().plus} y1={cy} x2={cx + imagePositions().plus} y2={cy + 80} stroke="#22c55e" stroke-width="0.8" opacity="0.5" />
        <line x1={cx + beta() * thetaE()} y1={cy - 80} x2={cx + imagePositions().minus} y2={cy} stroke="#ec4899" stroke-width="0.8" opacity="0.5" />
        <line x1={cx + imagePositions().minus} y1={cy} x2={cx + imagePositions().minus} y2={cy + 80} stroke="#ec4899" stroke-width="0.8" opacity="0.5" />
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="β / θ_E" value={beta().toFixed(2)} color={ACCENT} />
        <StatCard label="θ_+ / θ_E" value={(imagePositions().plus / thetaE()).toFixed(2)} color="#22c55e" />
        <StatCard label="θ_− / θ_E" value={(imagePositions().minus / thetaE()).toFixed(2)} color="#ec4899" />
        <StatCard label="Magnification total" value={(() => {
          const u = Math.abs(beta());
          return ((u * u + 2) / (u * Math.sqrt(u * u + 4))).toFixed(2);
        })()} sub="A = (u²+2)/(u√(u²+4))" color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        Set $\beta = 0$ (source behind lens) and the two images merge into a full Einstein ring of radius $\theta_E$. Move the source sideways and the two images split; when $\beta \gg \theta_E$, the $+$ image approaches the source and the $-$ image fades toward the lens. Total magnification diverges at perfect alignment — the origin of microlensing brightening events.
      </div>
    </div>
  );
};
