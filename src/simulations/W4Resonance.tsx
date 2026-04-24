import { Component, createSignal, createMemo, onCleanup, For, Show } from "solid-js";

const ACCENT = "#ec4899";

const StatCard: Component<{ label: string; value: string; sub?: string; color: string }> = (p) => (
  <div class="rounded-lg p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
    <div class="text-[9px] font-bold uppercase tracking-widest" style={{ color: p.color }}>{p.label}</div>
    <div class="text-sm font-mono font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>{p.value}</div>
    {p.sub && <div class="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{p.sub}</div>}
  </div>
);

const Slider: Component<{
  label: string; value: number; min: number; max: number; step?: number;
  onInput: (v: number) => void; unit?: string;
}> = (p) => (
  <label class="block">
    <div class="flex justify-between text-[11px] mb-1">
      <span style={{ color: "var(--text-secondary)" }}>{p.label}</span>
      <span style={{ color: "var(--text-primary)" }} class="font-mono">
        {p.value.toFixed(p.step && p.step < 1 ? 2 : 0)}{p.unit ? ` ${p.unit}` : ""}
      </span>
    </div>
    <input type="range" min={p.min} max={p.max} step={p.step ?? 1} value={p.value}
      onInput={(e) => p.onInput(parseFloat(e.currentTarget.value))}
      class="w-full h-1.5 rounded-full appearance-none cursor-pointer"
      style={{ background: `linear-gradient(to right, ${ACCENT} ${((p.value - p.min) / (p.max - p.min)) * 100}%, var(--border) ${((p.value - p.min) / (p.max - p.min)) * 100}%)` }} />
  </label>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// W4DrivenOscillator — damped driven mass-spring. Shows Lorentzian
// amplitude response curve, phase lag, and live transient + steady.
// EOM: ẍ + 2γẋ + ω₀²x = F₀ cos(ωd t)
// Steady-state amplitude: A(ω) = F₀ / sqrt((ω₀² - ω²)² + (2γω)²)
// Phase: φ(ω) = arctan(2γω / (ω₀² - ω²))
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const W4DrivenOscillator: Component = () => {
  const omega0 = 1.0; // natural frequency (rad/s) — fixed to 1 so ω_d is in units of ω₀
  const [gamma, setGamma] = createSignal(0.1);
  const [omegaD, setOmegaD] = createSignal(1.0);
  const [F0] = createSignal(1.0);
  const [t, setT] = createSignal(0);
  const [x, setX] = createSignal(0);
  const [v, setV] = createSignal(0);
  const [running, setRunning] = createSignal(true);
  const [trail, setTrail] = createSignal<{ t: number; x: number }[]>([]);

  let raf: number | undefined;
  let lastT = performance.now();
  const tick = (now: number) => {
    const dt = Math.min((now - lastT) / 1000, 0.02);
    lastT = now;
    if (running()) {
      // RK4
      const accel = (xx: number, vv: number, tt: number) =>
        -omega0 * omega0 * xx - 2 * gamma() * vv + F0() * Math.cos(omegaD() * tt);
      const STEPS = 4;
      for (let k = 0; k < STEPS; k++) {
        const h = dt / STEPS;
        const xx = x(), vv = v(), tt = t();
        const k1v = accel(xx, vv, tt);
        const k1x = vv;
        const k2v = accel(xx + 0.5 * h * k1x, vv + 0.5 * h * k1v, tt + 0.5 * h);
        const k2x = vv + 0.5 * h * k1v;
        const k3v = accel(xx + 0.5 * h * k2x, vv + 0.5 * h * k2v, tt + 0.5 * h);
        const k3x = vv + 0.5 * h * k2v;
        const k4v = accel(xx + h * k3x, vv + h * k3v, tt + h);
        const k4x = vv + h * k3v;
        setV(vv + (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v));
        setX(xx + (h / 6) * (k1x + 2 * k2x + 2 * k3x + k4x));
        setT(tt + h);
      }
      setTrail((tr) => {
        const next = [...tr, { t: t(), x: x() }];
        if (next.length > 500) next.shift();
        return next;
      });
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  onCleanup(() => { if (raf) cancelAnimationFrame(raf); });

  const reset = () => { setT(0); setX(0); setV(0); setTrail([]); };

  // Response curve: sample A(ω) and φ(ω)
  const responseCurve = createMemo(() => {
    const pts: { w: number; A: number; phi: number }[] = [];
    for (let i = 0; i <= 100; i++) {
      const w = 0.1 + (i / 100) * 2.9;
      const denom = Math.sqrt((omega0 * omega0 - w * w) ** 2 + (2 * gamma() * w) ** 2);
      const A = F0() / denom;
      const phi = Math.atan2(2 * gamma() * w, omega0 * omega0 - w * w);
      pts.push({ w, A, phi });
    }
    return pts;
  });

  const Amax = () => Math.max(...responseCurve().map(p => p.A));
  const Q = () => omega0 / (2 * gamma());

  const W = 480, H = 220;
  const padL = 34, padR = 10, padT = 16, padB = 28;
  const plotW = W - padL - padR, plotH = H - padT - padB;

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Slider label="Damping γ" value={gamma()} min={0.02} max={0.6} step={0.01} onInput={(v) => { setGamma(v); reset(); }} />
        <Slider label="Driving freq ω_d" value={omegaD()} min={0.2} max={2.5} step={0.01} onInput={(v) => { setOmegaD(v); reset(); }} />
        <div class="flex gap-2 items-end">
          <button onClick={() => setRunning(!running())} class="flex-1 px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: ACCENT, color: "white" }}>
            {running() ? "Pause" : "Play"}
          </button>
          <button onClick={reset} class="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
            Reset
          </button>
        </div>
      </div>

      {/* Response curve (amplitude vs driving frequency) */}
      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "260px" }}>
        <text x={W / 2} y={14} text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-secondary)">
          Amplitude response A(ω)
        </text>
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--border)" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
        <text x={W / 2} y={H - 6} text-anchor="middle" font-size="10" fill="var(--text-muted)">driving frequency ω/ω₀</text>
        <For each={[0.5, 1.0, 1.5, 2.0, 2.5]}>
          {(w) => (
            <>
              <line x1={padL + (w / 3) * plotW} y1={H - padB} x2={padL + (w / 3) * plotW} y2={H - padB + 3} stroke="var(--border)" />
              <text x={padL + (w / 3) * plotW} y={H - padB + 12} text-anchor="middle" font-size="8" fill="var(--text-muted)">{w}</text>
            </>
          )}
        </For>
        <line x1={padL + (omega0 / 3) * plotW} y1={padT} x2={padL + (omega0 / 3) * plotW} y2={H - padB} stroke="var(--text-muted)" stroke-dasharray="2 3" opacity="0.4" />
        <polyline fill="none" stroke={ACCENT} stroke-width="2"
          points={responseCurve().map(p => `${padL + (p.w / 3) * plotW},${H - padB - Math.min(p.A / Amax(), 1) * plotH}`).join(" ")} />
        {/* Current operating point */}
        <circle cx={padL + (omegaD() / 3) * plotW}
          cy={H - padB - Math.min(F0() / Math.sqrt((omega0 * omega0 - omegaD() ** 2) ** 2 + (2 * gamma() * omegaD()) ** 2) / Amax(), 1) * plotH}
          r="5" fill={ACCENT} stroke="white" stroke-width="1.5" />
      </svg>

      {/* Mass position display */}
      <div class="flex items-center gap-3 py-4" style={{ background: "var(--bg-secondary)", "border-radius": "8px" }}>
        <div class="text-[10px] w-16 text-center" style={{ color: "var(--text-muted)" }}>
          x(t)<br />→
        </div>
        <div class="relative flex-1 h-12" style={{ background: "var(--bg-primary)", "border-radius": "6px" }}>
          {/* Spring (zigzag) */}
          <svg viewBox="0 0 300 40" width="100%" height="100%" preserveAspectRatio="none">
            <line x1="0" y1="20" x2={150 + x() * 60} y2="20" stroke="var(--border)" stroke-dasharray="3 3" />
            <circle cx={150 + x() * 60} cy="20" r="8" fill={ACCENT} />
            <line x1="150" y1="8" x2="150" y2="32" stroke={ACCENT} stroke-width="1" stroke-dasharray="2 2" opacity="0.4" />
          </svg>
        </div>
        <div class="text-[10px] w-16 text-center font-mono" style={{ color: "var(--text-primary)" }}>
          x = {x().toFixed(2)}
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="ω_d / ω₀" value={(omegaD() / omega0).toFixed(2)} color={ACCENT} />
        <StatCard label="γ" value={gamma().toFixed(2)} color={ACCENT} />
        <StatCard label="Q factor" value={Q().toFixed(2)} sub="ω₀/(2γ)" color={ACCENT} />
        <StatCard label="Peak A" value={Amax().toFixed(2)} sub={`at ω ≈ √(ω₀²−2γ²) = ${Math.sqrt(Math.max(0, 1 - 2 * gamma() ** 2)).toFixed(2)}`} color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        Near resonance ($\omega_d \approx \omega_0$) the amplitude peaks at height $\approx 1/(2\gamma\omega_0)$ with full-width $\sim 2\gamma$ — a **Lorentzian** profile. The **Q factor** $\omega_0/(2\gamma)$ measures how sharp the peak is; higher $Q$ means more rings before the transient dies. Slide $\omega_d$ through $\omega_0$ and watch the mass's amplitude explode; increase $\gamma$ and the peak flattens.
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// W4MembraneModes — rectangular membrane mode (m, n). Displacement
// u(x, y, t) = sin(mπx/Lx) sin(nπy/Ly) cos(ω_mn t) where ω_mn = c·π·sqrt((m/Lx)²+(n/Ly)²).
// Heatmap rendering.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const W4MembraneModes: Component = () => {
  const [m, setM] = createSignal(2);
  const [n, setN] = createSignal(3);
  const [t, setT] = createSignal(0);
  const [running, setRunning] = createSignal(true);

  let raf: number | undefined;
  let lastT = performance.now();
  const tick = (now: number) => {
    const dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;
    if (running()) setT((v) => v + dt);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  onCleanup(() => { if (raf) cancelAnimationFrame(raf); });

  const c = 1; // wave speed
  const Lx = 1, Ly = 1;
  const omega_mn = () => c * Math.PI * Math.sqrt((m() / Lx) ** 2 + (n() / Ly) ** 2);

  const GRID = 32;
  const W = 320, H = 320;

  const field = createMemo(() => {
    const data: number[] = new Array(GRID * GRID);
    const cosWT = Math.cos(omega_mn() * t());
    for (let j = 0; j < GRID; j++) {
      const y = (j / (GRID - 1)) * Ly;
      for (let i = 0; i < GRID; i++) {
        const x = (i / (GRID - 1)) * Lx;
        data[j * GRID + i] = Math.sin(m() * Math.PI * x / Lx) * Math.sin(n() * Math.PI * y / Ly) * cosWT;
      }
    }
    return data;
  });

  const colorAt = (v: number) => {
    // red-white-blue divergent
    const t = Math.max(-1, Math.min(1, v));
    if (t >= 0) {
      const a = t;
      return `rgb(${255},${Math.round(255 * (1 - a))},${Math.round(255 * (1 - a))})`;
    } else {
      const a = -t;
      return `rgb(${Math.round(255 * (1 - a))},${Math.round(255 * (1 - a))},${255})`;
    }
  };

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Slider label="Mode m (x)" value={m()} min={1} max={6} step={1} onInput={(v) => { setM(v); setT(0); }} />
        <Slider label="Mode n (y)" value={n()} min={1} max={6} step={1} onInput={(v) => { setN(v); setT(0); }} />
        <div class="flex gap-2 items-end">
          <button onClick={() => setRunning(!running())} class="flex-1 px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: ACCENT, color: "white" }}>
            {running() ? "Pause" : "Play"}
          </button>
        </div>
      </div>

      <div class="flex justify-center">
        <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-width": "340px" }}>
          <For each={Array.from({ length: GRID }, (_, j) => j)}>
            {(j) => (
              <For each={Array.from({ length: GRID }, (_, i) => i)}>
                {(i) => (
                  <rect
                    x={(i / GRID) * W}
                    y={(j / GRID) * H}
                    width={W / GRID + 0.5}
                    height={H / GRID + 0.5}
                    fill={colorAt(field()[j * GRID + i])}
                  />
                )}
              </For>
            )}
          </For>
          {/* Nodal lines */}
          <For each={Array.from({ length: m() - 1 }, (_, i) => i)}>
            {(i) => {
              const x = ((i + 1) / m()) * W;
              return <line x1={x} y1="0" x2={x} y2={H} stroke="black" stroke-width="0.8" opacity="0.4" />;
            }}
          </For>
          <For each={Array.from({ length: n() - 1 }, (_, i) => i)}>
            {(i) => {
              const y = ((i + 1) / n()) * H;
              return <line x1="0" y1={y} x2={W} y2={y} stroke="black" stroke-width="0.8" opacity="0.4" />;
            }}
          </For>
          <text x={8} y={H - 8} font-size="9" fill="black">
            ({m()},{n()}) | ω = {omega_mn().toFixed(2)}
          </text>
        </svg>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="Mode (m,n)" value={`(${m()}, ${n()})`} color={ACCENT} />
        <StatCard label="Frequency ω" value={omega_mn().toFixed(2)} sub="cπ√(m²+n²)" color={ACCENT} />
        <StatCard label="Nodes" value={`${m() - 1} × ${n() - 1}`} sub="internal lines" color={ACCENT} />
        <StatCard label="Degenerate?" value={m() === n() ? "—" : (m() !== n() ? "if (n,m) exists" : "")} sub={m() !== n() ? `(${n()},${m()}) has same ω` : "self"} color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        The modes of a rectangular drum are $u_{mn}(x,y,t) = \sin(m\pi x/L_x)\sin(n\pi y/L_y)\cos(\omega_{mn} t)$ with frequency $\omega_{mn} = c\pi\sqrt{(m/L_x)^2 + (n/L_y)^2}$. Unlike a 1D string, the spectrum is **not harmonic** — overtones are irrational multiples of the fundamental, which is why drums don't play clear pitches. Black lines mark the nodal lines where the membrane stays still.
      </div>
    </div>
  );
};
