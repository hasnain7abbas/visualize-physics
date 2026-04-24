import { Component, createSignal, createMemo, For, Show } from "solid-js";

const ACCENT = "#14b8a6";

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
// M1PhasePortrait — 2D dynamical system: choose preset, plot direction
// field + one trajectory from a clicked initial condition. Runge-Kutta 4.
// Presets: Van der Pol, predator-prey (Lotka-Volterra), damped pendulum.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
type DynSys = {
  name: string;
  f: (x: number, y: number) => number;
  g: (x: number, y: number) => number;
  xRange: [number, number];
  yRange: [number, number];
  description: string;
};

const PRESETS: Record<string, DynSys> = {
  "van-der-pol": {
    name: "Van der Pol (μ=1)",
    f: (x, y) => y,
    g: (x, y) => (1 - x * x) * y - x,
    xRange: [-3, 3],
    yRange: [-3, 3],
    description: "Self-excited oscillator with a stable limit cycle. Originated in early vacuum-tube circuits.",
  },
  "lotka-volterra": {
    name: "Lotka-Volterra",
    f: (x, y) => 1.5 * x - x * y,
    g: (x, y) => x * y - 1.5 * y,
    xRange: [0, 4],
    yRange: [0, 4],
    description: "Predator (y) / prey (x) population cycles. Closed curves around the coexistence equilibrium.",
  },
  "pendulum": {
    name: "Damped Pendulum",
    f: (x, y) => y,
    g: (x, y) => -0.25 * y - Math.sin(x),
    xRange: [-Math.PI, 2 * Math.PI],
    yRange: [-3, 3],
    description: "θ̇ = ω, ω̇ = −γω − sin θ. Fixed points at (nπ, 0) — spiral stable at even n, saddle at odd n.",
  },
  "duffing": {
    name: "Duffing (unforced)",
    f: (x, y) => y,
    g: (x, y) => x - x * x * x - 0.2 * y,
    xRange: [-2, 2],
    yRange: [-2, 2],
    description: "Double-well oscillator. Two stable spiral points at x=±1 and an unstable saddle at the origin.",
  },
};

export const M1PhasePortrait: Component = () => {
  const [presetKey, setPresetKey] = createSignal<keyof typeof PRESETS>("van-der-pol");
  const sys = () => PRESETS[presetKey()];
  const [traj, setTraj] = createSignal<{ x: number; y: number }[]>([]);

  const W = 460, H = 300;
  const padL = 36, padR = 12, padT = 16, padB = 28;
  const plotW = W - padL - padR, plotH = H - padT - padB;

  const xToSvg = (x: number) => padL + ((x - sys().xRange[0]) / (sys().xRange[1] - sys().xRange[0])) * plotW;
  const yToSvg = (y: number) => padT + plotH - ((y - sys().yRange[0]) / (sys().yRange[1] - sys().yRange[0])) * plotH;

  // Build a direction field
  const arrows = createMemo(() => {
    const s = sys();
    const arrs: { x: number; y: number; ax: number; ay: number; mag: number }[] = [];
    const nx = 18, ny = 12;
    for (let i = 0; i <= nx; i++) {
      for (let j = 0; j <= ny; j++) {
        const x = s.xRange[0] + (i / nx) * (s.xRange[1] - s.xRange[0]);
        const y = s.yRange[0] + (j / ny) * (s.yRange[1] - s.yRange[0]);
        const fx = s.f(x, y);
        const fy = s.g(x, y);
        const mag = Math.sqrt(fx * fx + fy * fy);
        arrs.push({ x, y, ax: fx, ay: fy, mag });
      }
    }
    return arrs;
  });

  const onClick = (e: MouseEvent & { currentTarget: SVGElement; target: Element }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const py = ((e.clientY - rect.top) / rect.height) * H;
    const s = sys();
    const x0 = s.xRange[0] + ((px - padL) / plotW) * (s.xRange[1] - s.xRange[0]);
    const y0 = s.yRange[1] - ((py - padT) / plotH) * (s.yRange[1] - s.yRange[0]);

    // Integrate with RK4
    const pts: { x: number; y: number }[] = [{ x: x0, y: y0 }];
    let x = x0, y = y0;
    const dt = 0.02;
    for (let n = 0; n < 3000; n++) {
      const k1x = s.f(x, y), k1y = s.g(x, y);
      const k2x = s.f(x + 0.5 * dt * k1x, y + 0.5 * dt * k1y);
      const k2y = s.g(x + 0.5 * dt * k1x, y + 0.5 * dt * k1y);
      const k3x = s.f(x + 0.5 * dt * k2x, y + 0.5 * dt * k2y);
      const k3y = s.g(x + 0.5 * dt * k2x, y + 0.5 * dt * k2y);
      const k4x = s.f(x + dt * k3x, y + dt * k3y);
      const k4y = s.g(x + dt * k3x, y + dt * k3y);
      x += (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
      y += (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);
      if (!isFinite(x) || !isFinite(y)) break;
      if (x < s.xRange[0] - 1 || x > s.xRange[1] + 1 || y < s.yRange[0] - 1 || y > s.yRange[1] + 1) break;
      pts.push({ x, y });
    }
    setTraj(pts);
  };

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <For each={Object.entries(PRESETS)}>
          {([key, p]) => (
            <button
              onClick={() => { setPresetKey(key as keyof typeof PRESETS); setTraj([]); }}
              class="px-3 py-1.5 rounded-lg text-[11px] font-semibold"
              style={{
                background: presetKey() === key ? ACCENT : "var(--bg-secondary)",
                color: presetKey() === key ? "white" : "var(--text-secondary)",
                border: `1px solid ${presetKey() === key ? ACCENT : "var(--border)"}`,
              }}
            >
              {p.name}
            </button>
          )}
        </For>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        class="w-full rounded-lg cursor-crosshair"
        style={{ background: "var(--bg-secondary)", "max-height": "360px" }}
        onClick={onClick}
      >
        {/* axes */}
        <line x1={padL} y1={yToSvg(0)} x2={W - padR} y2={yToSvg(0)} stroke="var(--border)" />
        <line x1={xToSvg(0)} y1={padT} x2={xToSvg(0)} y2={H - padB} stroke="var(--border)" />
        <text x={W - padR - 2} y={yToSvg(0) - 4} text-anchor="end" font-size="9" fill="var(--text-muted)">x</text>
        <text x={xToSvg(0) + 4} y={padT + 8} font-size="9" fill="var(--text-muted)">y</text>

        {/* Direction field */}
        <For each={arrows()}>
          {(a) => {
            const sx = xToSvg(a.x), sy = yToSvg(a.y);
            const norm = Math.max(a.mag, 0.001);
            const len = Math.min(10, 8 * Math.log1p(a.mag));
            const dx = (a.ax / norm) * len;
            const dy = -(a.ay / norm) * len;
            return (
              <>
                <line x1={sx - dx / 2} y1={sy - dy / 2} x2={sx + dx / 2} y2={sy + dy / 2} stroke={ACCENT} stroke-width="1" opacity="0.5" />
                <circle cx={sx + dx / 2} cy={sy + dy / 2} r="1.2" fill={ACCENT} opacity="0.7" />
              </>
            );
          }}
        </For>

        {/* Trajectory */}
        <Show when={traj().length > 1}>
          <polyline
            fill="none"
            stroke="#f59e0b"
            stroke-width="1.8"
            points={traj().map((p) => `${xToSvg(p.x)},${yToSvg(p.y)}`).join(" ")}
          />
          <circle cx={xToSvg(traj()[0].x)} cy={yToSvg(traj()[0].y)} r="4" fill="#f59e0b" stroke="white" stroke-width="1" />
        </Show>

        <text x={W / 2} y={H - 8} text-anchor="middle" font-size="10" fill="var(--text-muted)">Click anywhere to trace a trajectory</text>
      </svg>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        {sys().description}
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// M1SpecialFunctions — plot Bessel J_n, Legendre P_l, and Hermite H_n.
// Computes via stable recurrences.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Bessel J_n(x) via Miller's downward recurrence (stable for moderate x).
function besselJ(n: number, x: number): number {
  if (x === 0) return n === 0 ? 1 : 0;
  const N = Math.max(2 * n, 20);
  const arr = new Array(N + 2).fill(0);
  arr[N + 1] = 0; arr[N] = 1;
  for (let k = N; k >= 1; k--) {
    arr[k - 1] = (2 * k / x) * arr[k] - arr[k + 1];
  }
  // Normalize: sum_{k=0..N/2} (-1)^k * (2k,k)... actually use J_0 + 2 sum J_{2k} = 1
  let sum = arr[0];
  for (let k = 2; k <= N; k += 2) sum += 2 * arr[k];
  const norm = arr[n] / sum;
  return norm;
}

// Legendre polynomial P_l(x) via recurrence (l+1)P_{l+1} = (2l+1) x P_l - l P_{l-1}.
function legendreP(l: number, x: number): number {
  if (l === 0) return 1;
  if (l === 1) return x;
  let p0 = 1, p1 = x;
  for (let k = 1; k < l; k++) {
    const pk1 = ((2 * k + 1) * x * p1 - k * p0) / (k + 1);
    p0 = p1; p1 = pk1;
  }
  return p1;
}

// "Physicists" Hermite H_n(x) via H_{n+1} = 2x H_n - 2n H_{n-1}, H_0=1, H_1=2x.
function hermiteH(n: number, x: number): number {
  if (n === 0) return 1;
  if (n === 1) return 2 * x;
  let h0 = 1, h1 = 2 * x;
  for (let k = 1; k < n; k++) {
    const hk1 = 2 * x * h1 - 2 * k * h0;
    h0 = h1; h1 = hk1;
  }
  return h1;
}

type FamilyKey = "bessel" | "legendre" | "hermite";
const FAMILIES: { key: FamilyKey; name: string; xMin: number; xMax: number; yClamp: number; eval: (n: number, x: number) => number }[] = [
  { key: "bessel", name: "Bessel J_n", xMin: 0, xMax: 16, yClamp: 1.1, eval: besselJ },
  { key: "legendre", name: "Legendre P_ℓ", xMin: -1, xMax: 1, yClamp: 1.2, eval: legendreP },
  { key: "hermite", name: "Hermite H_n", xMin: -3.5, xMax: 3.5, yClamp: 30, eval: (n, x) => hermiteH(n, x) / Math.pow(2, n) },
];

export const M1SpecialFunctions: Component = () => {
  const [family, setFamily] = createSignal<FamilyKey>("bessel");
  const [maxOrder, setMaxOrder] = createSignal(4);

  const W = 460, H = 260;
  const padL = 34, padR = 12, padT = 16, padB = 30;
  const plotW = W - padL - padR, plotH = H - padT - padB;

  const curFamily = () => FAMILIES.find((f) => f.key === family())!;

  const curves = createMemo(() => {
    const f = curFamily();
    const n = maxOrder();
    const res: { n: number; pts: { x: number; y: number }[] }[] = [];
    const STEPS = 200;
    for (let order = 0; order <= n; order++) {
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i <= STEPS; i++) {
        const x = f.xMin + (i / STEPS) * (f.xMax - f.xMin);
        const y = f.eval(order, x);
        pts.push({ x, y: Math.max(-f.yClamp, Math.min(f.yClamp, y)) });
      }
      res.push({ n: order, pts });
    }
    return res;
  });

  const xToSvg = (x: number) => padL + ((x - curFamily().xMin) / (curFamily().xMax - curFamily().xMin)) * plotW;
  const yToSvg = (y: number) => padT + plotH / 2 - (y / curFamily().yClamp) * (plotH / 2);

  const colors = ["#ef4444", "#f59e0b", "#22c55e", "#06b6d4", "#8b5cf6", "#ec4899", "#14b8a6", "#fbbf24"];

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <For each={FAMILIES}>
          {(f) => (
            <button
              onClick={() => setFamily(f.key)}
              class="px-3 py-1.5 rounded-lg text-[11px] font-semibold"
              style={{
                background: family() === f.key ? ACCENT : "var(--bg-secondary)",
                color: family() === f.key ? "white" : "var(--text-secondary)",
                border: `1px solid ${family() === f.key ? ACCENT : "var(--border)"}`,
              }}
            >
              {f.name}
            </button>
          )}
        </For>
      </div>

      <Slider label="Max order" value={maxOrder()} min={0} max={6} step={1} onInput={setMaxOrder} />

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "320px" }}>
        {/* axes */}
        <line x1={padL} y1={yToSvg(0)} x2={W - padR} y2={yToSvg(0)} stroke="var(--border)" />
        <line x1={xToSvg(0)} y1={padT} x2={xToSvg(0)} y2={H - padB} stroke="var(--border)" />
        <text x={padL - 2} y={padT + 6} text-anchor="end" font-size="8" fill="var(--text-muted)">+</text>
        <text x={padL - 2} y={H - padB} text-anchor="end" font-size="8" fill="var(--text-muted)">−</text>
        <text x={W / 2} y={H - 8} text-anchor="middle" font-size="10" fill="var(--text-muted)">x</text>
        {/* x-ticks */}
        <For each={[curFamily().xMin, (curFamily().xMin + curFamily().xMax) / 2, curFamily().xMax]}>
          {(xv) => (
            <text x={xToSvg(xv)} y={yToSvg(0) + 14} text-anchor="middle" font-size="9" fill="var(--text-muted)">
              {xv.toFixed(family() === "legendre" ? 1 : 0)}
            </text>
          )}
        </For>

        {/* Curves */}
        <For each={curves()}>
          {(c, i) => (
            <polyline
              fill="none"
              stroke={colors[i() % colors.length]}
              stroke-width="1.8"
              points={c.pts.map((p) => `${xToSvg(p.x)},${yToSvg(p.y)}`).join(" ")}
            />
          )}
        </For>

        {/* legend */}
        <g transform={`translate(${padL + 8}, ${padT + 8})`} font-size="9">
          <For each={curves()}>
            {(c, i) => (
              <>
                <line x1={i() * 44} y1="0" x2={i() * 44 + 12} y2="0" stroke={colors[i() % colors.length]} stroke-width="2" />
                <text x={i() * 44 + 16} y="3" fill="var(--text-secondary)">n={c.n}</text>
              </>
            )}
          </For>
        </g>
      </svg>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        <Show when={family() === "bessel"}>
          {"Bessel functions $J_n(x)$ solve $x^2 y'' + x y' + (x^2 - n^2) y = 0$. They describe vibrations of circular membranes, optical fiber modes, and scattering amplitudes. Zeros of $J_0$ give the drum's fundamental frequencies."}
        </Show>
        <Show when={family() === "legendre"}>
          {"Legendre polynomials $P_\\ell(x)$ are orthogonal on $[-1,1]$: $\\int P_m P_\\ell\\, dx = \\frac{2}{2\\ell+1}\\delta_{m\\ell}$. They appear in multipole expansions, spherical harmonics, and Gauss-Legendre quadrature."}
        </Show>
        <Show when={family() === "hermite"}>
          {"Hermite polynomials $H_n(x)$ (here shown scaled by $2^{-n}$) multiplied by $e^{-x^2/2}$ give the eigenfunctions of the quantum harmonic oscillator. Orthogonal under the Gaussian weight — the basis of Gauss-Hermite quadrature."}
        </Show>
      </div>
    </div>
  );
};
