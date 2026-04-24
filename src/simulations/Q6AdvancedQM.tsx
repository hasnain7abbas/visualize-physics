import { Component, createSignal, createMemo, For, Show } from "solid-js";

const ACCENT = "#a855f7";

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
// Q6HydrogenOrbital — visualize |psi_nlm(r,θ)|^2 in the x-z plane (phi=0)
// for hydrogen orbitals. R_nl built from associated Laguerre, Y_lm from
// associated Legendre polynomials.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Factorial (small n only)
function fact(n: number): number { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }

// Associated Laguerre L_{n-l-1}^{2l+1}(x) via explicit sum
function laguerre(n: number, alpha: number, x: number): number {
  // L_n^alpha(x) = sum_{k=0..n} (-1)^k binom(n+alpha, n-k) x^k / k!
  let sum = 0;
  for (let k = 0; k <= n; k++) {
    // binom(n+alpha, n-k) = (n+alpha)! / ((n-k)! (alpha+k)!)
    // Use gamma via exp-log for stability
    const logBinom = lgamma(n + alpha + 1) - lgamma(n - k + 1) - lgamma(alpha + k + 1);
    const term = Math.pow(-1, k) * Math.exp(logBinom) * Math.pow(x, k) / fact(k);
    sum += term;
  }
  return sum;
}

// log-gamma via Lanczos
function lgamma(x: number): number {
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  x -= 1;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  const g = 7;
  let t = c[0];
  for (let i = 1; i < g + 2; i++) t += c[i] / (x + i);
  const z = x + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(z) - z + Math.log(t);
}

// Radial function R_nl(r) (in units of Bohr radius = 1)
function R_nl(n: number, l: number, r: number): number {
  const rho = 2 * r / n;
  // Normalization
  const norm = Math.sqrt(Math.pow(2 / n, 3) * fact(n - l - 1) / (2 * n * fact(n + l)));
  return norm * Math.exp(-rho / 2) * Math.pow(rho, l) * laguerre(n - l - 1, 2 * l + 1, rho);
}

// Associated Legendre P_l^m(cos θ)
function assocLegendre(l: number, m: number, x: number): number {
  // Using recurrence
  if (m < 0) return 0;
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

// Spherical harmonic magnitude squared: |Y_l^m(θ, φ=0)|²
function Ylm2(l: number, m: number, theta: number): number {
  const mAbs = Math.abs(m);
  // norm: (2l+1)/(4π) * (l-|m|)!/(l+|m|)!
  const norm = (2 * l + 1) / (4 * Math.PI) * fact(l - mAbs) / fact(l + mAbs);
  const P = assocLegendre(l, mAbs, Math.cos(theta));
  return norm * P * P;
}

// |ψ_nlm|² in x-z plane (φ=0)
function psiDensity(n: number, l: number, m: number, x: number, z: number): number {
  const r = Math.sqrt(x * x + z * z);
  if (r < 0.01) return 0;
  const theta = Math.acos(z / r);
  const R = R_nl(n, l, r);
  const y2 = Ylm2(l, m, theta);
  return R * R * y2;
}

export const Q6HydrogenOrbital: Component = () => {
  const [n, setN] = createSignal(3);
  const [l, setL] = createSignal(2);
  const [m, setM] = createSignal(0);

  // Ensure l < n and |m| <= l
  const safeL = () => Math.min(l(), n() - 1);
  const safeM = () => Math.max(-safeL(), Math.min(safeL(), m()));

  const W = 320, H = 320;
  const GRID = 100;

  const densityGrid = createMemo(() => {
    const data: number[] = new Array(GRID * GRID);
    const range = n() * n() * 4; // Bohr radii
    let maxVal = 0;
    for (let j = 0; j < GRID; j++) {
      const z = (0.5 - j / GRID) * 2 * range;
      for (let i = 0; i < GRID; i++) {
        const x = (i / GRID - 0.5) * 2 * range;
        const v = psiDensity(n(), safeL(), safeM(), x, z);
        data[j * GRID + i] = v;
        if (v > maxVal) maxVal = v;
      }
    }
    // Normalize
    if (maxVal > 0) {
      for (let i = 0; i < data.length; i++) data[i] /= maxVal;
    }
    return { data, range };
  });

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Slider label="Principal quantum number n" value={n()} min={1} max={5} step={1} onInput={(v) => { setN(v); if (l() >= v) setL(v - 1); }} />
        <Slider label="Angular momentum l" value={safeL()} min={0} max={n() - 1} step={1} onInput={(v) => { setL(v); if (Math.abs(m()) > v) setM(0); }} />
        <Slider label="Magnetic m" value={safeM()} min={-safeL()} max={safeL()} step={1} onInput={setM} />
      </div>

      <div class="flex justify-center">
        <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "#0b0b1a", "max-width": "340px" }}>
          <For each={Array.from({ length: GRID }, (_, j) => j)}>
            {(j) => (
              <For each={Array.from({ length: GRID }, (_, i) => i)}>
                {(i) => {
                  const v = densityGrid().data[j * GRID + i];
                  const intensity = Math.pow(v, 0.4);
                  const r = Math.round(168 * intensity);
                  const g = Math.round(85 * intensity);
                  const b = Math.round(247 * intensity);
                  return <rect x={(i / GRID) * W} y={(j / GRID) * H} width={W / GRID + 0.5} height={H / GRID + 0.5} fill={`rgb(${r},${g},${b})`} />;
                }}
              </For>
            )}
          </For>
          {/* Nucleus marker */}
          <circle cx={W / 2} cy={H / 2} r="2" fill="#fbbf24" />
          {/* Axis labels */}
          <text x={W - 8} y={H / 2 - 4} text-anchor="end" font-size="10" fill="#ffffff80">x</text>
          <text x={W / 2 + 6} y={14} font-size="10" fill="#ffffff80">z</text>
          <text x={8} y={H - 8} font-size="9" fill="#ffffff80">
            {`${n()}${["s","p","d","f","g"][safeL()]}`}{safeM() !== 0 ? ` (m=${safeM()})` : ""}
          </text>
          <text x={W - 8} y={H - 8} text-anchor="end" font-size="9" fill="#ffffff80">
            ±{densityGrid().range.toFixed(0)} a₀
          </text>
        </svg>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="Orbital" value={`${n()}${["s","p","d","f","g"][safeL()]}`} color={ACCENT} />
        <StatCard label="Energy" value={`−13.6/${n() * n()}`} sub={`= ${(-13.6 / (n() * n())).toFixed(2)} eV`} color={ACCENT} />
        <StatCard label="Nodes (radial)" value={String(n() - safeL() - 1)} color={ACCENT} />
        <StatCard label="Degeneracy" value={String(n() * n())} sub="ignoring spin" color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        Shown is $|\psi_{nlm}(r,\theta,\phi=0)|^2$ in the $x$–$z$ plane. The principal quantum number $n$ sets the energy; $\ell$ sets the shape (s = spherical, p = dumbbell, d = clover, f = more lobes); $m$ selects the orientation. The familiar chemistry-textbook orbital shapes all live here.
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Q6BellInequality — CHSH test. Simulate measurements of an entangled
// state at Alice angle α and Bob angle β. Quantum: E(α,β) = -cos(α-β).
// Plot empirical E(α-β) and compare to quantum curve and classical
// LHV bound.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const Q6BellInequality: Component = () => {
  const [a, setA] = createSignal(0);
  const [aP, setAP] = createSignal(45);
  const [b, setB] = createSignal(22.5);
  const [bP, setBP] = createSignal(67.5);
  const [trials, setTrials] = createSignal(0);
  const [results, setResults] = createSignal<{ aa: number[]; ab: number[]; apa: number[]; apb: number[] }>({ aa: [0, 0, 0, 0], ab: [0, 0, 0, 0], apa: [0, 0, 0, 0], apb: [0, 0, 0, 0] });
  // For each pair: [++, +-, -+, --]

  const measure = (angA: number, angB: number): { a: 1 | -1; b: 1 | -1 } => {
    // For the singlet state |Ψ-⟩, measurement probabilities:
    //   P(a=+1, b=+1) = (1/2) sin²((α-β)/2)
    //   P(a=+1, b=-1) = (1/2) cos²((α-β)/2)
    // etc. Correlation E(α,β) = -cos(α-β)
    const d = (angA - angB) * Math.PI / 180;
    const pSame = Math.sin(d / 2) ** 2; // P(same)
    const aResult: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
    const bResult: 1 | -1 = Math.random() < pSame ? aResult : (aResult === 1 ? -1 : 1);
    return { a: aResult, b: bResult };
  };

  const runBatch = (n: number) => {
    const r = { aa: [...results().aa], ab: [...results().ab], apa: [...results().apa], apb: [...results().apb] };
    for (let i = 0; i < n; i++) {
      const pair1 = measure(a(), b());
      r.aa[classify(pair1.a, pair1.b)]++;
      const pair2 = measure(a(), bP());
      r.ab[classify(pair2.a, pair2.b)]++;
      const pair3 = measure(aP(), b());
      r.apa[classify(pair3.a, pair3.b)]++;
      const pair4 = measure(aP(), bP());
      r.apb[classify(pair4.a, pair4.b)]++;
    }
    setResults(r);
    setTrials(trials() + n);
  };

  const classify = (a: number, b: number) => a === 1 && b === 1 ? 0 : a === 1 && b === -1 ? 1 : a === -1 && b === 1 ? 2 : 3;

  const E = (counts: number[]) => {
    const total = counts.reduce((s, v) => s + v, 0);
    if (total === 0) return 0;
    return (counts[0] + counts[3] - counts[1] - counts[2]) / total;
  };

  const S = () => {
    return Math.abs(E(results().aa) - E(results().ab) + E(results().apa) + E(results().apb));
  };

  const reset = () => {
    setResults({ aa: [0, 0, 0, 0], ab: [0, 0, 0, 0], apa: [0, 0, 0, 0], apb: [0, 0, 0, 0] });
    setTrials(0);
  };

  const W = 460, H = 220;

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Slider label="Alice a" value={a()} min={0} max={180} step={1} unit="°" onInput={(v) => { setA(v); reset(); }} />
        <Slider label="Alice a'" value={aP()} min={0} max={180} step={1} unit="°" onInput={(v) => { setAP(v); reset(); }} />
        <Slider label="Bob b" value={b()} min={0} max={180} step={1} unit="°" onInput={(v) => { setB(v); reset(); }} />
        <Slider label="Bob b'" value={bP()} min={0} max={180} step={1} unit="°" onInput={(v) => { setBP(v); reset(); }} />
      </div>

      <div class="flex gap-2">
        <button onClick={() => runBatch(100)} class="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: ACCENT, color: "white" }}>
          +100 trials
        </button>
        <button onClick={() => runBatch(1000)} class="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: ACCENT, color: "white" }}>
          +1000 trials
        </button>
        <button onClick={reset} class="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
          Reset
        </button>
        <div class="text-[11px] self-center" style={{ color: "var(--text-muted)" }}>
          {trials()} trials per pair
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="E(a,b)" value={E(results().aa).toFixed(3)} sub={`QM: ${(-Math.cos((a() - b()) * Math.PI / 180)).toFixed(3)}`} color={ACCENT} />
        <StatCard label="E(a,b')" value={E(results().ab).toFixed(3)} sub={`QM: ${(-Math.cos((a() - bP()) * Math.PI / 180)).toFixed(3)}`} color={ACCENT} />
        <StatCard label="E(a',b)" value={E(results().apa).toFixed(3)} sub={`QM: ${(-Math.cos((aP() - b()) * Math.PI / 180)).toFixed(3)}`} color={ACCENT} />
        <StatCard label="E(a',b')" value={E(results().apb).toFixed(3)} sub={`QM: ${(-Math.cos((aP() - bP()) * Math.PI / 180)).toFixed(3)}`} color={ACCENT} />
      </div>

      <div class="rounded-lg p-4" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
            CHSH value S = |E(a,b) − E(a,b') + E(a',b) + E(a',b')|
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-3xl font-mono font-bold" style={{ color: S() > 2 ? "#22c55e" : "#ef4444" }}>
            {S().toFixed(3)}
          </div>
          <div class="flex-1 relative h-3 rounded-full" style={{ background: "var(--border)" }}>
            {/* Classical bound line at 2 */}
            <div class="absolute top-0 h-3 w-px" style={{ left: `${(2 / 3) * 100}%`, background: "#f59e0b" }} />
            {/* Tsirelson bound at 2√2 */}
            <div class="absolute top-0 h-3 w-px" style={{ left: `${(2 * Math.sqrt(2) / 3) * 100}%`, background: "#22c55e" }} />
            {/* Current */}
            <div class="absolute top-0 h-3 rounded-full" style={{ width: `${Math.min(S(), 3) / 3 * 100}%`, background: S() > 2 ? "#22c55e" : "#ef4444", opacity: 0.4 }} />
          </div>
          <div class="text-[10px]" style={{ color: "var(--text-muted)" }}>
            Classical ≤ 2 ← <span style={{ color: "#f59e0b" }}>|</span> ... <span style={{ color: "#22c55e" }}>|</span> → Tsirelson 2√2 ≈ 2.828
          </div>
        </div>
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        {"Use the CHSH angles (a=0°, a'=45°, b=22.5°, b'=67.5°) and run a few thousand trials — the sample $S$ converges toward $2\\sqrt{2} \\approx 2.828$, which is strictly above the classical local-hidden-variable bound of 2. This is Bell's inequality violation: no \"pre-arranged\" classical assignment of spin values can reproduce the quantum correlations."}
      </div>
    </div>
  );
};
