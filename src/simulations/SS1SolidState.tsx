import { Component, createSignal, createMemo, For, Show } from "solid-js";

const ACCENT = "#6366f1";

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
// SS1CrystalLattice — 2D Bravais lattice viewer with direct and
// reciprocal lattice side by side.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
type LatticeType = "square" | "triangular" | "rectangular" | "oblique" | "hexagonal";

export const SS1CrystalLattice: Component = () => {
  const [lattice, setLattice] = createSignal<LatticeType>("square");
  const [aSize, setASize] = createSignal(36);
  const [ratio, setRatio] = createSignal(1.4); // for rectangular & oblique
  const [angle, setAngle] = createSignal(75);  // for oblique (deg)

  const primitives = createMemo(() => {
    const a = aSize();
    switch (lattice()) {
      case "square":
        return { a1: { x: a, y: 0 }, a2: { x: 0, y: a } };
      case "triangular":
        return { a1: { x: a, y: 0 }, a2: { x: a / 2, y: -a * Math.sqrt(3) / 2 } };
      case "rectangular":
        return { a1: { x: a, y: 0 }, a2: { x: 0, y: a * ratio() } };
      case "oblique":
        return { a1: { x: a, y: 0 }, a2: { x: a * Math.cos(angle() * Math.PI / 180), y: -a * Math.sin(angle() * Math.PI / 180) } };
      case "hexagonal":
        return { a1: { x: a, y: 0 }, a2: { x: -a / 2, y: -a * Math.sqrt(3) / 2 } };
    }
  });

  // Reciprocal: b_i such that a_i · b_j = 2π δ_ij.
  const reciprocals = createMemo(() => {
    const { a1, a2 } = primitives();
    // 2D reciprocal: b1 = 2π / det * (a2y, -a2x), b2 = 2π / det * (-a1y, a1x)
    const det = a1.x * a2.y - a1.y * a2.x;
    const scale = (2 * Math.PI * 160) / (aSize() * aSize()); // scale for display
    return {
      b1: { x: (a2.y / det) * aSize() * aSize() / 2.5, y: (-a2.x / det) * aSize() * aSize() / 2.5 },
      b2: { x: (-a1.y / det) * aSize() * aSize() / 2.5, y: (a1.x / det) * aSize() * aSize() / 2.5 },
    };
  });

  const W = 480, H = 300;

  // Generate points on lattice within view
  const points = (primitive: { a1: { x: number; y: number }; a2: { x: number; y: number } }, center: { x: number; y: number }) => {
    const pts: { x: number; y: number; i: number; j: number }[] = [];
    for (let i = -5; i <= 5; i++) {
      for (let j = -5; j <= 5; j++) {
        const x = center.x + i * primitive.a1.x + j * primitive.a2.x;
        const y = center.y + i * primitive.a1.y + j * primitive.a2.y;
        if (x > -20 && x < W / 2 + 20 && y > -20 && y < H + 20) {
          pts.push({ x, y, i, j });
        }
      }
    }
    return pts;
  };

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <For each={["square", "triangular", "rectangular", "oblique", "hexagonal"] as LatticeType[]}>
          {(k) => (
            <button
              onClick={() => setLattice(k)}
              class="px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize"
              style={{
                background: lattice() === k ? ACCENT : "var(--bg-secondary)",
                color: lattice() === k ? "white" : "var(--text-secondary)",
                border: `1px solid ${lattice() === k ? ACCENT : "var(--border)"}`,
              }}
            >
              {k}
            </button>
          )}
        </For>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Slider label="Lattice constant a" value={aSize()} min={20} max={60} step={1} unit="px" onInput={setASize} />
        <Show when={lattice() === "rectangular"}>
          <Slider label="b/a ratio" value={ratio()} min={0.5} max={2.0} step={0.05} onInput={setRatio} />
        </Show>
        <Show when={lattice() === "oblique"}>
          <Slider label="Angle γ" value={angle()} min={45} max={105} step={1} unit="°" onInput={setAngle} />
        </Show>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "360px" }}>
        {/* Left: direct lattice */}
        <text x={W / 4} y={16} text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-secondary)">Direct lattice</text>
        <For each={points(primitives(), { x: W / 4, y: H / 2 })}>
          {(p) => <circle cx={p.x} cy={p.y} r="3" fill={ACCENT} opacity={p.i === 0 && p.j === 0 ? 1 : 0.8} />}
        </For>
        {/* Primitive vectors */}
        <line x1={W / 4} y1={H / 2} x2={W / 4 + primitives().a1.x} y2={H / 2 + primitives().a1.y} stroke="#f59e0b" stroke-width="2" marker-end="url(#arr1)" />
        <line x1={W / 4} y1={H / 2} x2={W / 4 + primitives().a2.x} y2={H / 2 + primitives().a2.y} stroke="#22c55e" stroke-width="2" marker-end="url(#arr2)" />
        <text x={W / 4 + primitives().a1.x + 6} y={H / 2 + primitives().a1.y + 4} font-size="10" fill="#f59e0b">a₁</text>
        <text x={W / 4 + primitives().a2.x + 6} y={H / 2 + primitives().a2.y + 4} font-size="10" fill="#22c55e">a₂</text>
        {/* Unit cell */}
        <polygon
          points={`${W / 4},${H / 2} ${W / 4 + primitives().a1.x},${H / 2 + primitives().a1.y} ${W / 4 + primitives().a1.x + primitives().a2.x},${H / 2 + primitives().a1.y + primitives().a2.y} ${W / 4 + primitives().a2.x},${H / 2 + primitives().a2.y}`}
          fill={`${ACCENT}20`}
          stroke={ACCENT}
          stroke-width="1"
          stroke-dasharray="3 3"
        />

        {/* Divider */}
        <line x1={W / 2} y1={20} x2={W / 2} y2={H - 20} stroke="var(--border)" stroke-dasharray="2 3" />

        {/* Right: reciprocal lattice */}
        <text x={(3 * W) / 4} y={16} text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-secondary)">Reciprocal lattice</text>
        <For each={points(reciprocals(), { x: (3 * W) / 4, y: H / 2 })}>
          {(p) => <circle cx={p.x} cy={p.y} r="3" fill="#ec4899" opacity={p.i === 0 && p.j === 0 ? 1 : 0.8} />}
        </For>
        <line x1={(3 * W) / 4} y1={H / 2} x2={(3 * W) / 4 + reciprocals().b1.x} y2={H / 2 + reciprocals().b1.y} stroke="#f59e0b" stroke-width="2" />
        <line x1={(3 * W) / 4} y1={H / 2} x2={(3 * W) / 4 + reciprocals().b2.x} y2={H / 2 + reciprocals().b2.y} stroke="#22c55e" stroke-width="2" />
        <text x={(3 * W) / 4 + reciprocals().b1.x + 4} y={H / 2 + reciprocals().b1.y + 4} font-size="10" fill="#f59e0b">b₁</text>
        <text x={(3 * W) / 4 + reciprocals().b2.x + 4} y={H / 2 + reciprocals().b2.y + 4} font-size="10" fill="#22c55e">b₂</text>
      </svg>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        {"The reciprocal lattice is defined by $\\vec a_i \\cdot \\vec b_j = 2\\pi\\,\\delta_{ij}$. For a square direct lattice the reciprocal is also square (rotated in some conventions); for a triangular direct lattice the reciprocal is a hexagonal lattice — the familiar first Brillouin zone of graphene."}
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SS1BandStructure — 1D nearly-free electron model: plot E(k) in the
// reduced zone scheme. V₀ opens a gap at zone boundaries k = ±π/a.
// Construct: free-electron parabola E = ℏ²k²/2m, plus perturbation to
// second order: E(k) ≈ E_k^{(0)} + |V|² / (E_k^{(0)} - E_{k-G}^{(0)}) for
// k near zone boundary.
// We'll use a truncated 2-band matrix diagonalization at each k.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SS1BandStructure: Component = () => {
  const [V0, setV0] = createSignal(1.5); // potential amplitude (natural units)

  // Reduced zone: k ∈ [-π/a, π/a], a = 1, ℏ²/2m = 1.
  // For each k, couple plane waves e^{i(k+nG)x} with n = -3..3 (G = 2π).
  // Hamiltonian matrix: diagonal (k + nG)², off-diagonal V0/2.
  const NBANDS = 5;
  const N = 7; // 2N+1 plane waves
  const G = 2 * Math.PI;

  const computeBands = (k: number) => {
    const dim = 2 * N + 1;
    const H: number[][] = Array.from({ length: dim }, () => Array(dim).fill(0));
    for (let i = 0; i < dim; i++) {
      const ki = k + (i - N) * G;
      H[i][i] = ki * ki;
      if (i > 0) { H[i][i - 1] = V0() / 2; H[i - 1][i] = V0() / 2; }
    }
    // Jacobi diagonalization (symmetric matrix)
    const eigs = jacobiEigenvalues(H);
    eigs.sort((a, b) => a - b);
    return eigs.slice(0, NBANDS);
  };

  const bands = createMemo(() => {
    const ks: number[] = [];
    const NK = 100;
    for (let i = 0; i <= NK; i++) {
      ks.push(-Math.PI + (i / NK) * 2 * Math.PI);
    }
    const result: { k: number; eigs: number[] }[] = ks.map((k) => ({ k, eigs: computeBands(k) }));
    return result;
  });

  const W = 460, H = 260;
  const padL = 38, padR = 12, padT = 16, padB = 30;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const E_MAX = 25;
  const kToX = (k: number) => padL + ((k + Math.PI) / (2 * Math.PI)) * plotW;
  const eToY = (e: number) => padT + plotH - Math.min(e, E_MAX) / E_MAX * plotH;

  const colors = ["#ef4444", "#f59e0b", "#22c55e", "#06b6d4", "#8b5cf6"];

  // Free-electron reference in reduced zone: (k + nG)² for n=-2..2
  const freeBands = createMemo(() => {
    const curves: { n: number; pts: { k: number; e: number }[] }[] = [];
    for (let n = -2; n <= 2; n++) {
      const pts: { k: number; e: number }[] = [];
      for (let i = 0; i <= 100; i++) {
        const k = -Math.PI + (i / 100) * 2 * Math.PI;
        const kg = k + n * G;
        pts.push({ k, e: kg * kg });
      }
      curves.push({ n, pts });
    }
    return curves;
  });

  return (
    <div class="space-y-4">
      <Slider label="Potential V₀ (ħ²G²/2m units)" value={V0()} min={0} max={5} step={0.1} onInput={setV0} />

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "320px" }}>
        {/* axes */}
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--border)" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
        <text x={padL - 18} y={padT + plotH / 2} text-anchor="middle" font-size="9" fill="var(--text-muted)" transform={`rotate(-90 ${padL - 18} ${padT + plotH / 2})`}>
          E (ℏ²/2m units)
        </text>
        <text x={W / 2} y={H - 6} text-anchor="middle" font-size="10" fill="var(--text-muted)">wavevector k · a/π</text>
        {/* ticks */}
        <For each={[-1, -0.5, 0, 0.5, 1]}>
          {(kv) => (
            <>
              <line x1={kToX(kv * Math.PI)} y1={H - padB} x2={kToX(kv * Math.PI)} y2={H - padB + 3} stroke="var(--border)" />
              <text x={kToX(kv * Math.PI)} y={H - padB + 12} text-anchor="middle" font-size="8" fill="var(--text-muted)">{kv}</text>
            </>
          )}
        </For>
        {/* zone boundaries */}
        <line x1={kToX(-Math.PI)} y1={padT} x2={kToX(-Math.PI)} y2={H - padB} stroke="var(--text-muted)" stroke-dasharray="3 3" opacity="0.4" />
        <line x1={kToX(Math.PI)} y1={padT} x2={kToX(Math.PI)} y2={H - padB} stroke="var(--text-muted)" stroke-dasharray="3 3" opacity="0.4" />

        {/* Free-electron dashed parabolas */}
        <For each={freeBands()}>
          {(c) => (
            <polyline
              fill="none"
              stroke="var(--text-muted)"
              stroke-width="1"
              stroke-dasharray="3 3"
              opacity="0.4"
              points={c.pts.map((p) => `${kToX(p.k)},${eToY(p.e)}`).join(" ")}
            />
          )}
        </For>

        {/* Bands */}
        <For each={Array.from({ length: NBANDS }, (_, i) => i)}>
          {(bi) => (
            <polyline
              fill="none"
              stroke={colors[bi]}
              stroke-width="2"
              points={bands().map((b) => `${kToX(b.k)},${eToY(b.eigs[bi])}`).join(" ")}
            />
          )}
        </For>
      </svg>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        {"With $V_0 = 0$ the bands are just free-electron parabolas folded into the first Brillouin zone. Turning on $V_0$ opens **band gaps** at zone boundaries $k = \\pm\\pi/a$ and at $k=0$ where the folded branches meet — the mechanism by which a periodic potential turns a metal into an insulator or semiconductor."}
      </div>
    </div>
  );
};

// Simple Jacobi eigenvalue algorithm for symmetric matrices
function jacobiEigenvalues(A: number[][]): number[] {
  const n = A.length;
  const M: number[][] = A.map((row) => row.slice());
  const MAX_ITER = 200;
  for (let iter = 0; iter < MAX_ITER; iter++) {
    // Find largest off-diagonal
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
