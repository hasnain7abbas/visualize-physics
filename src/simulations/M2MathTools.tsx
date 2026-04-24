import { Component, createSignal, createMemo, onCleanup, For, Show } from "solid-js";

const ACCENT = "#0891b2";

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
// M2HeatEquation — 1D heat equation ∂u/∂t = α ∂²u/∂x² on [0, L] with
// Dirichlet BCs u(0)=u(L)=0. FTCS scheme.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const M2HeatEquation: Component = () => {
  const N = 200;
  const L = 1;
  const dx = L / N;
  const [alpha, setAlpha] = createSignal(0.01);
  const [initialProfile, setInitialProfile] = createSignal<"gaussian" | "step" | "triangle" | "sinusoidal">("gaussian");
  const [running, setRunning] = createSignal(true);
  const [t, setT] = createSignal(0);
  const [u, setU] = createSignal<Float64Array>(new Float64Array(N));

  const initialize = () => {
    const arr = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const x = i * dx;
      switch (initialProfile()) {
        case "gaussian":
          arr[i] = Math.exp(-Math.pow((x - 0.5) / 0.08, 2));
          break;
        case "step":
          arr[i] = x > 0.3 && x < 0.7 ? 1 : 0;
          break;
        case "triangle":
          arr[i] = x < 0.5 ? 2 * x : 2 * (1 - x);
          break;
        case "sinusoidal":
          arr[i] = Math.sin(Math.PI * x) + 0.5 * Math.sin(3 * Math.PI * x);
          break;
      }
    }
    // Ensure BCs
    arr[0] = 0; arr[N - 1] = 0;
    setU(arr);
    setT(0);
  };
  initialize();

  // Time step for stability: dt < dx²/(2α)
  const dt = () => 0.4 * dx * dx / alpha();

  let raf: number | undefined;
  const tick = () => {
    if (running()) {
      const STEPS = 30;
      const uu = u().slice();
      for (let s = 0; s < STEPS; s++) {
        const newU = uu.slice();
        const r = alpha() * dt() / (dx * dx);
        for (let i = 1; i < N - 1; i++) {
          newU[i] = uu[i] + r * (uu[i + 1] - 2 * uu[i] + uu[i - 1]);
        }
        // copy back
        for (let i = 0; i < N; i++) uu[i] = newU[i];
      }
      setU(uu);
      setT(t() + STEPS * dt());
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  onCleanup(() => { if (raf) cancelAnimationFrame(raf); });

  const W = 480, H = 240;
  const padL = 30, padR = 10, padT = 14, padB = 28;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const xToSX = (xv: number) => padL + (xv / L) * plotW;
  const uToSY = (uv: number) => padT + plotH - Math.max(0, Math.min(1.2, uv)) / 1.2 * plotH;

  // Total heat (integral of u)
  const totalHeat = () => {
    let sum = 0;
    const uu = u();
    for (let i = 0; i < N; i++) sum += uu[i];
    return sum * dx;
  };

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <For each={["gaussian", "step", "triangle", "sinusoidal"] as const}>
          {(k) => (
            <button
              onClick={() => { setInitialProfile(k); initialize(); }}
              class="px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize"
              style={{
                background: initialProfile() === k ? ACCENT : "var(--bg-secondary)",
                color: initialProfile() === k ? "white" : "var(--text-secondary)",
                border: `1px solid ${initialProfile() === k ? ACCENT : "var(--border)"}`,
              }}
            >
              {k}
            </button>
          )}
        </For>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Slider label="Diffusivity α" value={alpha()} min={0.001} max={0.05} step={0.001} onInput={(v) => { setAlpha(v); }} />
        <div class="flex gap-2 items-end">
          <button onClick={() => setRunning(!running())} class="flex-1 px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: ACCENT, color: "white" }}>
            {running() ? "Pause" : "Play"}
          </button>
          <button onClick={initialize} class="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
            Reset
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "300px" }}>
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--border)" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
        <text x={W / 2} y={H - 6} text-anchor="middle" font-size="10" fill="var(--text-muted)">position x</text>
        <text x={padL - 4} y={padT + 6} text-anchor="end" font-size="9" fill="var(--text-muted)">u</text>
        {/* Profile */}
        <polyline fill="none" stroke={ACCENT} stroke-width="2"
          points={(() => {
            const uu = u();
            const pts: string[] = [];
            for (let i = 0; i < N; i++) {
              pts.push(`${xToSX(i * dx)},${uToSY(uu[i])}`);
            }
            return pts.join(" ");
          })()} />
        {/* Fill below */}
        <polyline fill={`${ACCENT}20`} stroke="none"
          points={(() => {
            const uu = u();
            const pts: string[] = [];
            pts.push(`${xToSX(0)},${uToSY(0)}`);
            for (let i = 0; i < N; i++) {
              pts.push(`${xToSX(i * dx)},${uToSY(uu[i])}`);
            }
            pts.push(`${xToSX(L)},${uToSY(0)}`);
            return pts.join(" ");
          })()} />
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="Diffusivity α" value={alpha().toFixed(4)} color={ACCENT} />
        <StatCard label="time t" value={t().toFixed(2)} sub="√(αt) smooths by" color={ACCENT} />
        <StatCard label="Smoothing length √(αt)" value={Math.sqrt(alpha() * t()).toFixed(3)} color={ACCENT} />
        <StatCard label="Total heat ∫u dx" value={totalHeat().toFixed(3)} sub="conserved (Dirichlet radiates)" color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        {"The heat equation $\\partial_t u = \\alpha\\,\\partial_x^2 u$ smooths every initial profile. Short-wavelength features decay fastest: a Fourier mode $\\sin(k\\pi x/L)$ decays as $e^{-\\alpha k^2\\pi^2 t/L^2}$. The characteristic smoothing length is $\\sqrt{\\alpha t}$ — a signature of diffusive processes. The Dirichlet BCs at the ends drain heat to the boundary, so the total integral shrinks over time."}
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// M2SphericalHarmonics — visualize |Y_l^m(θ, φ=0)|² in the θ-plane,
// showing the angular nodes.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Associated Legendre P_l^m(cos θ) — same implementation as Q6
function assocLegendre(l: number, m: number, x: number): number {
  if (m < 0) m = -m; // use |m|
  if (m > l) return 0;
  let pmm = 1;
  if (m > 0) {
    const somx2 = Math.sqrt((1 - x) * (1 + x));
    let fct = 1;
    for (let i = 1; i <= m; i++) {
      pmm *= -fct * somx2;
      fct += 2;
    }
  }
  if (l === m) return pmm;
  let pmmp1 = x * (2 * m + 1) * pmm;
  if (l === m + 1) return pmmp1;
  let pll = 0;
  for (let ll = m + 2; ll <= l; ll++) {
    pll = (x * (2 * ll - 1) * pmmp1 - (ll + m - 1) * pmm) / (ll - m);
    pmm = pmmp1; pmmp1 = pll;
  }
  return pll;
}

function fact(n: number): number { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }

function Ylm2(l: number, m: number, theta: number): number {
  const mA = Math.abs(m);
  const norm = (2 * l + 1) / (4 * Math.PI) * fact(l - mA) / fact(l + mA);
  const P = assocLegendre(l, mA, Math.cos(theta));
  return norm * P * P;
}

export const M2SphericalHarmonics: Component = () => {
  const [l, setL] = createSignal(2);
  const [m, setM] = createSignal(0);

  const safeM = () => Math.max(-l(), Math.min(l(), m()));

  const W = 360, H = 360;
  const cx = W / 2, cy = H / 2;

  // Parametric: draw a "polar lobes" plot r(θ) = |Y_l^m(θ, 0)|² scaled.
  const curve = createMemo(() => {
    const pts: { x: number; y: number; val: number }[] = [];
    const N = 200;
    // 2D cross-section: θ ∈ [0, π] for positive lobes, add φ=0 (right) and φ=π (left).
    let maxVal = 0;
    const values: { theta: number; val: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const theta = (i / N) * Math.PI;
      const val = Ylm2(l(), safeM(), theta);
      if (val > maxVal) maxVal = val;
      values.push({ theta, val });
    }
    const SCALE = 140 / Math.max(maxVal, 1e-6);
    // Right half (φ=0): x = +r sin θ; Left half (φ=π): x = -r sin θ. y = r cos θ (up positive z axis)
    for (const { theta, val } of values) {
      const r = val * SCALE;
      pts.push({ x: cx + r * Math.sin(theta), y: cy - r * Math.cos(theta), val });
    }
    // Flip for other side
    for (let i = values.length - 1; i >= 0; i--) {
      const { theta, val } = values[i];
      const r = val * SCALE;
      pts.push({ x: cx - r * Math.sin(theta), y: cy - r * Math.cos(theta), val });
    }
    return pts;
  });

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Slider label="Orbital quantum number ℓ" value={l()} min={0} max={5} step={1} onInput={(v) => { setL(v); if (Math.abs(m()) > v) setM(0); }} />
        <Slider label="Magnetic m" value={safeM()} min={-l()} max={l()} step={1} onInput={setM} />
      </div>

      <div class="flex justify-center">
        <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-width": "380px" }}>
          {/* z axis */}
          <line x1={cx} y1={20} x2={cx} y2={H - 20} stroke="var(--text-muted)" opacity="0.3" stroke-dasharray="3 3" />
          <text x={cx + 4} y={20} font-size="9" fill="var(--text-muted)">z</text>
          <line x1={20} y1={cy} x2={W - 20} y2={cy} stroke="var(--text-muted)" opacity="0.3" stroke-dasharray="3 3" />
          {/* |Y_l^m|^2 lobe */}
          <polygon
            points={curve().map(p => `${p.x},${p.y}`).join(" ")}
            fill={`${ACCENT}40`}
            stroke={ACCENT}
            stroke-width="1.5"
          />
          {/* Origin */}
          <circle cx={cx} cy={cy} r="2" fill="var(--text-primary)" />
          {/* Label */}
          <text x={10} y={H - 10} font-size="10" font-family="monospace" fill="var(--text-secondary)">
            |Y_{String(l())}^{String(safeM())}(θ,0)|²
          </text>
        </svg>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="ℓ" value={String(l())} color={ACCENT} />
        <StatCard label="m" value={String(safeM())} sub={`|m| ≤ ℓ = ${l()}`} color={ACCENT} />
        <StatCard label="Parity" value={l() % 2 === 0 ? "even" : "odd"} sub="(−1)^ℓ" color={ACCENT} />
        <StatCard label="Nodal lines" value={String(l() - Math.abs(safeM()))} sub="θ-nodes (latitudes)" color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        {"Spherical harmonics $Y_\\ell^m(\\theta, \\phi) = N_{\\ell m}\\,P_\\ell^{|m|}(\\cos\\theta)\\,e^{im\\phi}$ are the angular eigenfunctions of the Laplacian on a sphere. They have $\\ell$ total angular nodes — $\\ell - |m|$ in the polar ($\\theta$) direction and $|m|$ in the azimuthal ($\\phi$) direction. They show up everywhere spherical: the angular part of hydrogen orbitals, multipole expansions of gravity/E&M, CMB temperature maps, quantum angular momentum."}
      </div>
    </div>
  );
};
