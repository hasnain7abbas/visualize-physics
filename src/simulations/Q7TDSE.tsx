import { Component, createSignal, createMemo, onCleanup, For, Show } from "solid-js";

const ACCENT = "#6366f1";

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
// Q7WavepacketScattering — 1D TDSE with a potential barrier/well,
// evolved via leapfrog of Re/Im parts on a spatial grid.
// Units: ℏ = 1, m = 1. Grid: x ∈ [-20, 20].
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const Q7WavepacketScattering: Component = () => {
  const [x0, setX0] = createSignal(-10);
  const [sigma, setSigma] = createSignal(1.5);
  const [k0, setK0] = createSignal(4);
  const [V0, setV0] = createSignal(4);
  const [barrierWidth, setBarrierWidth] = createSignal(2.0);
  const [running, setRunning] = createSignal(false);
  const [t, setT] = createSignal(0);

  const N = 400; // grid points
  const L_HALF = 20;
  const dx = (2 * L_HALF) / N;
  const xs = () => Array.from({ length: N }, (_, i) => -L_HALF + i * dx);

  // Potential: rectangular barrier centered at 0
  const V = (x: number) => (Math.abs(x) < barrierWidth() / 2 ? V0() : 0);

  // State: complex ψ = psiRe + i psiIm
  const [psiRe, setPsiRe] = createSignal<Float64Array>(new Float64Array(N));
  const [psiIm, setPsiIm] = createSignal<Float64Array>(new Float64Array(N));

  const reset = () => {
    const re = new Float64Array(N);
    const im = new Float64Array(N);
    const xarr = xs();
    for (let i = 0; i < N; i++) {
      const x = xarr[i];
      const envelope = Math.pow(2 * Math.PI * sigma() * sigma(), -0.25) * Math.exp(-((x - x0()) ** 2) / (4 * sigma() * sigma()));
      re[i] = envelope * Math.cos(k0() * x);
      im[i] = envelope * Math.sin(k0() * x);
    }
    // Normalize
    let norm = 0;
    for (let i = 0; i < N; i++) norm += re[i] * re[i] + im[i] * im[i];
    norm = Math.sqrt(norm * dx);
    for (let i = 0; i < N; i++) { re[i] /= norm; im[i] /= norm; }
    setPsiRe(re); setPsiIm(im);
    setT(0);
  };
  reset();

  // Leapfrog: dψ_R/dt = -H ψ_I / ℏ ; dψ_I/dt = H ψ_R / ℏ
  // H ψ = -(1/2) ψ'' + V ψ. Use central differences.
  const dt = 0.001;
  const applyH = (psi: Float64Array, result: Float64Array, xarr: number[]) => {
    for (let i = 0; i < N; i++) {
      const left = i > 0 ? psi[i - 1] : 0;
      const right = i < N - 1 ? psi[i + 1] : 0;
      const kin = -0.5 * (right - 2 * psi[i] + left) / (dx * dx);
      result[i] = kin + V(xarr[i]) * psi[i];
    }
  };

  let raf: number | undefined;
  let lastT = performance.now();
  const tick = (now: number) => {
    const dtRef = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;
    if (running()) {
      const STEPS = 40;
      const xarr = xs();
      let re = psiRe(); let im = psiIm();
      re = re.slice(); im = im.slice();
      const Hre = new Float64Array(N);
      const Him = new Float64Array(N);
      for (let s = 0; s < STEPS; s++) {
        applyH(re, Hre, xarr);
        // im += Hre * dt
        for (let i = 0; i < N; i++) im[i] += Hre[i] * dt;
        applyH(im, Him, xarr);
        // re -= Him * dt
        for (let i = 0; i < N; i++) re[i] -= Him[i] * dt;
      }
      setPsiRe(re); setPsiIm(im);
      setT(t() + STEPS * dt);
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  onCleanup(() => { if (raf) cancelAnimationFrame(raf); });

  // Plot |ψ|², Re ψ, potential
  const W = 480, H = 260;
  const padL = 30, padR = 10, padT = 14, padB = 26;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const xToSX = (xv: number) => padL + ((xv + L_HALF) / (2 * L_HALF)) * plotW;
  const probYMax = 1.2;
  const probToSY = (p: number) => padT + plotH - Math.min(p / probYMax, 1) * plotH;

  // Transmission: |ψ|² integrated to right of barrier
  const transmission = () => {
    const re = psiRe(); const im = psiIm(); const xarr = xs();
    let T = 0;
    for (let i = 0; i < N; i++) {
      if (xarr[i] > barrierWidth() / 2) T += (re[i] * re[i] + im[i] * im[i]) * dx;
    }
    return T;
  };

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Slider label="Initial x₀" value={x0()} min={-18} max={-4} step={0.5} onInput={(v) => { setX0(v); reset(); }} />
        <Slider label="Width σ" value={sigma()} min={0.5} max={3.0} step={0.1} onInput={(v) => { setSigma(v); reset(); }} />
        <Slider label="Momentum k₀" value={k0()} min={1} max={8} step={0.2} onInput={(v) => { setK0(v); reset(); }} />
        <Slider label="Barrier V₀" value={V0()} min={-10} max={20} step={0.5} onInput={(v) => { setV0(v); reset(); }} />
        <Slider label="Barrier width" value={barrierWidth()} min={0.5} max={6} step={0.25} onInput={(v) => { setBarrierWidth(v); reset(); }} />
      </div>

      <div class="flex gap-2">
        <button onClick={() => setRunning(!running())} class="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: ACCENT, color: "white" }}>
          {running() ? "Pause" : "Play"}
        </button>
        <button onClick={reset} class="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
          Reset
        </button>
        <div class="text-[11px] self-center" style={{ color: "var(--text-muted)" }}>
          t = {t().toFixed(2)}, E = k₀²/2 = {(k0() * k0() / 2).toFixed(2)}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "320px" }}>
        {/* axes */}
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--border)" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
        <text x={W / 2} y={H - 6} text-anchor="middle" font-size="9" fill="var(--text-muted)">position x</text>
        {/* Potential */}
        <rect x={xToSX(-barrierWidth() / 2)} y={V0() > 0 ? probToSY(V0() / 20) : padT + plotH / 2}
          width={xToSX(barrierWidth() / 2) - xToSX(-barrierWidth() / 2)}
          height={Math.abs(V0()) / 20 * plotH / 2}
          fill="#f59e0b" opacity="0.2" />
        <rect x={xToSX(-barrierWidth() / 2)} y={V0() > 0 ? probToSY(V0() / 20) : padT + plotH / 2}
          width={xToSX(barrierWidth() / 2) - xToSX(-barrierWidth() / 2)}
          height="2"
          fill="#f59e0b" />
        {/* |psi|² */}
        <polyline fill="none" stroke={ACCENT} stroke-width="1.8"
          points={(() => {
            const re = psiRe(), im = psiIm(), xarr = xs();
            const pts: string[] = [];
            for (let i = 0; i < N; i++) {
              pts.push(`${xToSX(xarr[i])},${probToSY(re[i] * re[i] + im[i] * im[i])}`);
            }
            return pts.join(" ");
          })()} />
        {/* Re psi */}
        <polyline fill="none" stroke="#ec4899" stroke-width="1" opacity="0.6"
          points={(() => {
            const re = psiRe(), xarr = xs();
            const pts: string[] = [];
            for (let i = 0; i < N; i++) {
              pts.push(`${xToSX(xarr[i])},${padT + plotH / 2 - re[i] * plotH / 3}`);
            }
            return pts.join(" ");
          })()} />
        {/* Legend */}
        <g transform={`translate(${padL + 8}, ${padT + 4})`} font-size="9">
          <line x1="0" y1="0" x2="12" y2="0" stroke={ACCENT} stroke-width="2" />
          <text x="16" y="3" fill="var(--text-secondary)">|ψ|²</text>
          <line x1="46" y1="0" x2="58" y2="0" stroke="#ec4899" stroke-width="2" />
          <text x="62" y="3" fill="var(--text-secondary)">Re ψ</text>
          <rect x="110" y="-5" width="12" height="6" fill="#f59e0b" opacity="0.5" />
          <text x="126" y="3" fill="var(--text-secondary)">V(x)</text>
        </g>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="Energy E" value={(k0() * k0() / 2).toFixed(2)} sub="ℏ²k₀²/2m" color={ACCENT} />
        <StatCard label="Barrier V₀" value={V0().toFixed(2)} color="#f59e0b" />
        <StatCard label="E vs V₀" value={k0() * k0() / 2 > V0() ? "E > V₀ (classical)" : "E < V₀ (tunnel)"} color={ACCENT} />
        <StatCard label="Transmission" value={transmission().toFixed(3)} sub="∫|ψ|² right of barrier" color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        {"Press Play and the Gaussian wavepacket moves right with momentum $k_0$. When it hits the barrier, part reflects and part transmits — even when the energy $E = k_0^2/2$ is **less** than $V_0$ (tunneling). Narrow the packet to see clearer interference between incident and reflected amplitudes; widen it and the momentum spread shows."}
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Q7PerturbationTheory — infinite square well + linear perturbation
// V'(x) = λ·(x - L/2). Compare exact (numerical diagonalization) vs 1st +
// 2nd order perturbation theory.
// H0 eigenstates: ψ_n(x) = √(2/L) sin(nπx/L), E_n^(0) = n²π²/(2L²) (ℏ=m=1)
// V' = λ (x - L/2) is odd about L/2 → <n|V'|n> = 0
// Second order: E_n^(2) = Σ_{m≠n} |<m|V'|n>|² / (E_n - E_m)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const Q7PerturbationTheory: Component = () => {
  const L = 1;
  const [lambda, setLambda] = createSignal(5.0);

  // Matrix element <m|V'|n> = λ ∫₀^L √(2/L) sin(mπx/L) (x-L/2) √(2/L) sin(nπx/L) dx
  // Standard integral: for m ≠ n:
  // ∫ sin(mπx/L)(x-L/2)sin(nπx/L)dx — gives -4L² m n /π² /(m²-n²)² if m-n odd, 0 if m-n even (for m≠n)
  // Actually the full result is known; let's compute numerically for clarity.
  const Vprime_mn = (m: number, n: number) => {
    // Numerical integration (Simpson's)
    const NSIMP = 200;
    const dx = L / NSIMP;
    let sum = 0;
    for (let i = 0; i <= NSIMP; i++) {
      const x = i * dx;
      const f = (2 / L) * Math.sin(m * Math.PI * x / L) * (x - L / 2) * Math.sin(n * Math.PI * x / L);
      const w = (i === 0 || i === NSIMP) ? 1 : (i % 2 === 1) ? 4 : 2;
      sum += w * f;
    }
    return sum * dx / 3;
  };

  const E0 = (n: number) => (n * n * Math.PI * Math.PI) / (2 * L * L);

  const levels = createMemo(() => {
    // For each unperturbed level n = 1..5, compute E^(1) and E^(2)
    const result: { n: number; E0: number; E1: number; E2: number; Eexact: number }[] = [];
    for (let n = 1; n <= 5; n++) {
      const e0 = E0(n);
      const e1 = lambda() * Vprime_mn(n, n);
      let e2 = 0;
      for (let m = 1; m <= 20; m++) {
        if (m === n) continue;
        const v_mn = lambda() * Vprime_mn(m, n);
        e2 += (v_mn * v_mn) / (e0 - E0(m));
      }
      // Exact: diagonalize truncated Hamiltonian in the n=1..20 basis
      const DIM = 20;
      const H: number[][] = Array.from({ length: DIM }, () => Array(DIM).fill(0));
      for (let i = 0; i < DIM; i++) {
        H[i][i] = E0(i + 1);
        for (let j = 0; j < DIM; j++) {
          if (i !== j) H[i][j] = lambda() * Vprime_mn(i + 1, j + 1);
        }
      }
      const eigs = jacobiEigs(H).sort((a, b) => a - b);
      const eexact = eigs[n - 1];
      result.push({ n, E0: e0, E1: e0 + e1, E2: e0 + e1 + e2, Eexact: eexact });
    }
    return result;
  });

  const W = 480, H = 260;
  const padL = 40, padR = 12, padT = 16, padB = 30;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const E_MAX = 140;
  const eToSY = (e: number) => padT + plotH - Math.min(e, E_MAX) / E_MAX * plotH;

  return (
    <div class="space-y-4">
      <Slider label="Perturbation strength λ" value={lambda()} min={-15} max={15} step={0.5} onInput={setLambda} />

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "320px" }}>
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--border)" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
        <text x={padL - 22} y={padT + plotH / 2} text-anchor="middle" font-size="9" fill="var(--text-muted)" transform={`rotate(-90 ${padL - 22} ${padT + plotH / 2})`}>
          Energy E
        </text>
        <text x={W / 2} y={H - 8} text-anchor="middle" font-size="10" fill="var(--text-muted)">Level n (labels 1..5)</text>
        {/* For each level, four markers: E⁰ (blue), E¹ (orange), E² (green), Eexact (red) */}
        <For each={levels()}>
          {(lvl, i) => {
            const x = padL + ((i() + 1) / 6) * plotW;
            return (
              <>
                <text x={x} y={H - padB + 14} text-anchor="middle" font-size="9" fill="var(--text-muted)">{lvl.n}</text>
                <line x1={x - 14} y1={eToSY(lvl.E0)} x2={x - 8} y2={eToSY(lvl.E0)} stroke="#06b6d4" stroke-width="2" />
                <line x1={x - 6} y1={eToSY(lvl.E1)} x2={x} y2={eToSY(lvl.E1)} stroke="#f59e0b" stroke-width="2" />
                <line x1={x + 2} y1={eToSY(lvl.E2)} x2={x + 8} y2={eToSY(lvl.E2)} stroke="#22c55e" stroke-width="2" />
                <line x1={x + 10} y1={eToSY(lvl.Eexact)} x2={x + 16} y2={eToSY(lvl.Eexact)} stroke="#ef4444" stroke-width="2.5" />
              </>
            );
          }}
        </For>
        {/* Legend */}
        <g transform={`translate(${padL + 8}, ${padT + 4})`} font-size="9">
          <line x1="0" y1="0" x2="10" y2="0" stroke="#06b6d4" stroke-width="2" /><text x="14" y="3" fill="var(--text-secondary)">E⁽⁰⁾</text>
          <line x1="40" y1="0" x2="50" y2="0" stroke="#f59e0b" stroke-width="2" /><text x="54" y="3" fill="var(--text-secondary)">1st ord</text>
          <line x1="90" y1="0" x2="100" y2="0" stroke="#22c55e" stroke-width="2" /><text x="104" y="3" fill="var(--text-secondary)">2nd ord</text>
          <line x1="140" y1="0" x2="150" y2="0" stroke="#ef4444" stroke-width="2.5" /><text x="154" y="3" fill="var(--text-secondary)">exact</text>
        </g>
      </svg>

      <div class="grid grid-cols-1 sm:grid-cols-5 gap-2">
        <For each={levels()}>
          {(lvl) => (
            <div class="rounded-lg p-2" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
              <div class="text-[10px] font-bold" style={{ color: ACCENT }}>n = {lvl.n}</div>
              <div class="text-[10px] font-mono mt-1" style={{ color: "var(--text-muted)" }}>E⁰: {lvl.E0.toFixed(2)}</div>
              <div class="text-[10px] font-mono" style={{ color: "#22c55e" }}>E²: {lvl.E2.toFixed(2)}</div>
              <div class="text-[10px] font-mono" style={{ color: "#ef4444" }}>exact: {lvl.Eexact.toFixed(2)}</div>
              <div class="text-[9px] mt-1" style={{ color: "var(--text-muted)" }}>Δ: {((lvl.E2 - lvl.Eexact) / lvl.Eexact * 100).toFixed(2)}%</div>
            </div>
          )}
        </For>
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        {"Unperturbed system: infinite square well on $[0,1]$. Perturbation: $V'(x) = \\lambda (x - 1/2)$. Because $V'$ is odd about $x=1/2$, the first-order correction $E_n^{(1)} = \\langle n|V'|n\\rangle$ vanishes for every $n$, and the leading shift is **second order**: $E_n^{(2)} = \\sum_{m \\neq n} |V'_{mn}|^2/(E_n^{(0)} - E_m^{(0)})$. Compare the green (2nd-order) markers with the red (exact) to see where perturbation theory breaks down — try $|\\lambda| > 10$ and the approximation drifts for high $n$."}
      </div>
    </div>
  );
};

// Jacobi eigenvalue algorithm for symmetric matrices
function jacobiEigs(A: number[][]): number[] {
  const n = A.length;
  const M: number[][] = A.map((row) => row.slice());
  const MAX_ITER = 300;
  for (let iter = 0; iter < MAX_ITER; iter++) {
    let p = 0, q = 1, max = 0;
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(M[i][j]) > max) { max = Math.abs(M[i][j]); p = i; q = j; }
      }
    }
    if (max < 1e-10) break;
    const theta = (M[q][q] - M[p][p]) / (2 * M[p][q]);
    const t = Math.sign(theta) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
    const c = 1 / Math.sqrt(t * t + 1);
    const s = t * c;
    const Mpp = M[p][p], Mqq = M[q][q], Mpq = M[p][q];
    M[p][p] = c * c * Mpp - 2 * s * c * Mpq + s * s * Mqq;
    M[q][q] = s * s * Mpp + 2 * s * c * Mpq + c * c * Mqq;
    M[p][q] = M[q][p] = 0;
    for (let i = 0; i < n; i++) {
      if (i !== p && i !== q) {
        const Mip = M[i][p], Miq = M[i][q];
        M[i][p] = M[p][i] = c * Mip - s * Miq;
        M[i][q] = M[q][i] = s * Mip + c * Miq;
      }
    }
  }
  return M.map((row, i) => row[i]);
}
