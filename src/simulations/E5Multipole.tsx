import { Component, createSignal, createMemo, onCleanup, For, Show } from "solid-js";

const ACCENT = "#ea580c";

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
// E5MultipoleExpansion — point charges + truncated multipole expansion
// of the resulting potential. Compares exact V to monopole, dipole,
// quadrupole approximations.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
type Charge = { x: number; y: number; q: number };

export const E5MultipoleExpansion: Component = () => {
  const [order, setOrder] = createSignal(0); // 0 = monopole, 1 = +dipole, 2 = +quadrupole
  const [config, setConfig] = createSignal<"dipole" | "quadrupole" | "linear" | "off-center">("dipole");

  const charges = createMemo<Charge[]>(() => {
    switch (config()) {
      case "dipole":
        return [{ x: -0.4, y: 0, q: 1 }, { x: 0.4, y: 0, q: -1 }];
      case "quadrupole":
        return [
          { x: -0.4, y: 0, q: 1 }, { x: 0.4, y: 0, q: 1 },
          { x: 0, y: -0.4, q: -1 }, { x: 0, y: 0.4, q: -1 },
        ];
      case "linear":
        return [{ x: -0.6, y: 0, q: 1 }, { x: 0, y: 0, q: -2 }, { x: 0.6, y: 0, q: 1 }];
      case "off-center":
        return [{ x: 0.3, y: 0.2, q: 2 }];
    }
  });

  // Multipole moments (about origin):
  //   monopole: Q = Σ q_i
  //   dipole:   p_x = Σ q_i x_i,  p_y = Σ q_i y_i
  //   quadrupole: Q_xx = Σ q_i (3 x_i² - r²),  Q_yy = ..., Q_xy = Σ q_i (3 x_i y_i)
  const moments = createMemo(() => {
    let Q = 0, px = 0, py = 0, Qxx = 0, Qyy = 0, Qxy = 0;
    for (const c of charges()) {
      Q += c.q;
      px += c.q * c.x;
      py += c.q * c.y;
      const r2 = c.x * c.x + c.y * c.y;
      Qxx += c.q * (3 * c.x * c.x - r2);
      Qyy += c.q * (3 * c.y * c.y - r2);
      Qxy += c.q * 3 * c.x * c.y;
    }
    return { Q, px, py, Qxx, Qyy, Qxy };
  });

  // Exact potential at (x, y): V = Σ q_i / |r - r_i|. Set k = 1/(4πε₀) = 1.
  const exactV = (x: number, y: number) => {
    let v = 0;
    for (const c of charges()) {
      const r = Math.sqrt((x - c.x) ** 2 + (y - c.y) ** 2);
      if (r > 0.05) v += c.q / r;
    }
    return v;
  };

  // Multipole approximation:
  //   V ≈ Q/r + (p · r̂)/r² + Q_ij r̂_i r̂_j / (2 r³) ...
  const approxV = (x: number, y: number, ord: number) => {
    const r = Math.sqrt(x * x + y * y);
    if (r < 0.05) return 0;
    const m = moments();
    let v = m.Q / r;
    if (ord >= 1) {
      v += (m.px * x + m.py * y) / (r * r * r);
    }
    if (ord >= 2) {
      const xh = x / r, yh = y / r;
      v += (m.Qxx * xh * xh + m.Qyy * yh * yh + 2 * m.Qxy * xh * yh) / (2 * r * r * r);
    }
    return v;
  };

  // Build heatmap data
  const W = 300, H = 300;
  const RES = 60;
  const RANGE = 2.5; // ±RANGE
  const xy = (i: number) => -RANGE + (i / RES) * 2 * RANGE;

  const heatmap = createMemo(() => {
    const data: number[] = new Array(RES * RES);
    let maxAbs = 0;
    for (let j = 0; j < RES; j++) {
      const y = xy(j);
      for (let i = 0; i < RES; i++) {
        const x = xy(i);
        const exact = exactV(x, y);
        const approx = approxV(x, y, order());
        const err = Math.abs(exact - approx);
        data[j * RES + i] = err;
        if (err > maxAbs) maxAbs = err;
      }
    }
    return { data, maxAbs };
  });

  const exactColor = (val: number, max: number) => {
    if (max < 1e-6) return "#000";
    const t = Math.min(1, Math.log10(1 + val) / Math.log10(1 + max));
    const r = Math.round(234 * t);
    const g = Math.round(88 * t);
    const b = Math.round(12 * t);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <For each={["dipole", "quadrupole", "linear", "off-center"] as const}>
          {(k) => (
            <button
              onClick={() => setConfig(k)}
              class="px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize"
              style={{
                background: config() === k ? ACCENT : "var(--bg-secondary)",
                color: config() === k ? "white" : "var(--text-secondary)",
                border: `1px solid ${config() === k ? ACCENT : "var(--border)"}`,
              }}
            >
              {k}
            </button>
          )}
        </For>
      </div>

      <Slider label="Multipole order (0=monopole, 1=+dipole, 2=+quadrupole)" value={order()} min={0} max={2} step={1} onInput={setOrder} />

      <div class="flex justify-center">
        <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-width": "320px" }}>
          {/* Heatmap of |exact - approx| */}
          <For each={Array.from({ length: RES }, (_, j) => j)}>
            {(j) => (
              <For each={Array.from({ length: RES }, (_, i) => i)}>
                {(i) => (
                  <rect
                    x={(i / RES) * W}
                    y={(j / RES) * H}
                    width={W / RES + 0.5}
                    height={H / RES + 0.5}
                    fill={exactColor(heatmap().data[j * RES + i], heatmap().maxAbs)}
                  />
                )}
              </For>
            )}
          </For>
          {/* Charges */}
          <For each={charges()}>
            {(c) => (
              <circle
                cx={W / 2 + (c.x / RANGE) * (W / 2)}
                cy={H / 2 - (c.y / RANGE) * (H / 2)}
                r="6"
                fill={c.q > 0 ? "#ec4899" : "#06b6d4"}
                stroke="white"
                stroke-width="1.5"
              />
            )}
          </For>
          {/* Origin */}
          <circle cx={W / 2} cy={H / 2} r="2" fill="white" stroke="black" stroke-width="0.5" />
          {/* Label */}
          <text x={8} y={H - 8} font-size="9" fill="white">|V_exact − V_approx|</text>
        </svg>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="Monopole Q" value={moments().Q.toFixed(2)} color={ACCENT} />
        <StatCard label="|p|" value={Math.sqrt(moments().px ** 2 + moments().py ** 2).toFixed(3)} sub={`(${moments().px.toFixed(2)}, ${moments().py.toFixed(2)})`} color={ACCENT} />
        <StatCard label="Q_xx" value={moments().Qxx.toFixed(3)} color={ACCENT} />
        <StatCard label="Max error" value={heatmap().maxAbs.toFixed(3)} sub={`order ${order()}`} color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        {"The multipole expansion gives $V(\\vec r) = \\sum_\\ell V_\\ell(\\vec r)$ with $V_\\ell \\propto 1/r^{\\ell+1}$. For a neutral pair (dipole), $Q=0$ kills the monopole and the leading term is the **dipole** falling as $1/r^2$. For a perfect quadrupole, $\\vec p = 0$ too and the leading term is **quadrupole** $\\propto 1/r^3$. The heatmap shows the absolute error after truncating at the chosen order — error always decays faster than $1/r^{\\ell+1}$ in the far field."}
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// E5LarmorRadiation — radiation pattern from an oscillating charge.
// Non-relativistic Larmor: dP/dΩ ∝ sin²θ (donut around acceleration axis).
// Relativistic boost: pattern becomes forward-beamed cone of half-angle ~1/γ.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const E5LarmorRadiation: Component = () => {
  const [beta, setBeta] = createSignal(0.0);
  const [t, setT] = createSignal(0);

  const gamma = () => 1 / Math.sqrt(1 - beta() * beta());

  let raf: number | undefined;
  const tick = () => {
    setT((v) => v + 0.02);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  onCleanup(() => { if (raf) cancelAnimationFrame(raf); });

  // Polar pattern. With charge accelerated along x-axis at velocity βc along x:
  // dP/dΩ ∝ sin²θ / (1 - β cos θ)⁵   (non-relativistic recovers sin²θ)
  // Here θ is measured from the velocity (=acceleration) direction.
  const radiation = createMemo(() => {
    const N = 100;
    const pts: { theta: number; r: number }[] = [];
    let maxR = 0;
    for (let i = 0; i <= N; i++) {
      const theta = (i / N) * 2 * Math.PI;
      const denom = Math.pow(1 - beta() * Math.cos(theta), 5);
      const r = Math.sin(theta) ** 2 / denom;
      pts.push({ theta, r });
      if (r > maxR) maxR = r;
    }
    return { pts, maxR };
  });

  // Total radiated power (Liénard formula): P = (q²/6πε₀ c³) γ⁶ |a|²
  // For our normalized case: P ∝ γ⁶
  const totalPower = () => Math.pow(gamma(), 6);

  const W = 380, H = 280;
  const cx = W / 2, cy = H / 2;
  const SCALE = 100;

  return (
    <div class="space-y-4">
      <Slider label="Charge speed β = v/c" value={beta()} min={0} max={0.95} step={0.01} onInput={setBeta} />

      <div class="flex justify-center">
        <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-width": "400px" }}>
          {/* Axes */}
          <line x1={20} y1={cy} x2={W - 20} y2={cy} stroke="var(--border)" stroke-dasharray="3 3" />
          <line x1={cx} y1={20} x2={cx} y2={H - 20} stroke="var(--border)" stroke-dasharray="3 3" />
          <text x={W - 24} y={cy - 4} text-anchor="end" font-size="9" fill="var(--text-muted)">v →</text>
          {/* Radiation pattern (polar) */}
          <polygon
            points={radiation().pts.map(p => {
              const r = p.r / radiation().maxR * SCALE;
              return `${cx + r * Math.cos(p.theta)},${cy - r * Math.sin(p.theta)}`;
            }).join(" ")}
            fill={`${ACCENT}30`}
            stroke={ACCENT}
            stroke-width="1.5"
          />
          {/* Charge */}
          <circle cx={cx} cy={cy} r="5" fill="#fbbf24" stroke="white" stroke-width="1" />
          {/* Velocity arrow */}
          <Show when={beta() > 0.01}>
            <line x1={cx} y1={cy} x2={cx + 30 * beta()} y2={cy} stroke="#06b6d4" stroke-width="2.5" />
            <polygon points={`${cx + 30 * beta()},${cy} ${cx + 30 * beta() - 5},${cy - 3} ${cx + 30 * beta() - 5},${cy + 3}`} fill="#06b6d4" />
          </Show>
          {/* Forward beam annotation when relativistic */}
          <Show when={beta() > 0.5}>
            <text x={cx + SCALE + 12} y={cy + 4} font-size="9" fill={ACCENT}>forward</text>
            <text x={cx + SCALE + 12} y={cy + 16} font-size="8" fill="var(--text-muted)">~1/γ = {(1 / gamma()).toFixed(2)} rad</text>
          </Show>
        </svg>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="β" value={beta().toFixed(2)} color={ACCENT} />
        <StatCard label="γ" value={gamma().toFixed(2)} color={ACCENT} />
        <StatCard label="Total P" value={totalPower().toFixed(2)} sub="∝ γ⁶ (Liénard)" color={ACCENT} />
        <StatCard label="Beam ½-angle" value={`≈ ${(1 / gamma()).toFixed(2)} rad`} sub={`= ${(180 / Math.PI / gamma()).toFixed(1)}°`} color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        {"At $\\beta = 0$: pure $\\sin^2\\theta$ donut — zero radiation along the acceleration direction, max perpendicular. As $\\beta \\to 1$, the pattern becomes a forward-pointing **cone of half-angle $\\sim 1/\\gamma$** and the total radiated power scales as $P \\propto \\gamma^6 |\\dot{\\vec\\beta}|^2$ — the basis of synchrotron radiation. Particle accelerators use this beaming to produce intense, tightly-collimated X-ray beams for materials science."}
      </div>
    </div>
  );
};
