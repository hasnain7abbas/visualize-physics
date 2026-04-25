import { Component, createSignal, createMemo, For, Show } from "solid-js";

const ACCENT = "#1d4ed8";

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
// G3FlammEmbedding — Flamm's paraboloid: a 2D slice (equatorial plane,
// fixed t) of Schwarzschild spacetime embedded in 3D Euclidean space.
// The embedding function: z(r) = 2√(r_s(r - r_s)) for r > r_s.
// Render as a profile cut + revolved surface using simple side projection.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const G3FlammEmbedding: Component = () => {
  const [M, setM] = createSignal(1.0); // mass in geometric units, r_s = 2M
  const r_s = () => 2 * M();

  // Profile: for each r, compute z(r). Plot as vertical cross-section.
  const profile = createMemo(() => {
    const pts: { r: number; z: number }[] = [];
    const rMax = 10;
    const N = 200;
    for (let i = 0; i <= N; i++) {
      const r = r_s() + (rMax - r_s()) * (i / N);
      const z = 2 * Math.sqrt(r_s() * (r - r_s()));
      pts.push({ r, z });
    }
    return pts;
  });

  const W = 480, H = 280;
  const cx = W / 2, ground = H * 0.65;
  const scaleH = 18; // vertical px per unit
  const scaleR = 22; // horizontal px per unit

  // Geodesic on Flamm: a radial null geodesic comes straight down.
  // For visual: draw a few "test particle paths" curving into the funnel.

  return (
    <div class="space-y-4">
      <Slider label="Mass M" value={M()} min={0.2} max={3.0} step={0.05} onInput={setM} />

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "320px" }}>
        {/* Asymptotic flat plane references */}
        <line x1={20} y1={ground} x2={W - 20} y2={ground} stroke="var(--border)" stroke-dasharray="3 3" opacity="0.4" />
        <text x={W - 24} y={ground - 4} text-anchor="end" font-size="9" fill="var(--text-muted)">flat reference</text>

        {/* Right-side profile (r > 0) */}
        <path
          d={
            `M ${cx + r_s() * scaleR} ${ground - 0 * scaleH} ` +
            profile().map(p => `L ${cx + p.r * scaleR} ${ground - p.z * scaleH}`).join(" ")
          }
          fill="none"
          stroke={ACCENT}
          stroke-width="2"
        />
        {/* Left-side profile (mirror) */}
        <path
          d={
            `M ${cx - r_s() * scaleR} ${ground - 0 * scaleH} ` +
            profile().map(p => `L ${cx - p.r * scaleR} ${ground - p.z * scaleH}`).join(" ")
          }
          fill="none"
          stroke={ACCENT}
          stroke-width="2"
        />
        {/* Cross-hatching to suggest a surface */}
        <For each={Array.from({ length: 8 }, (_, i) => i)}>
          {(i) => {
            const r = r_s() + (10 - r_s()) * (i + 1) / 8;
            const z = 2 * Math.sqrt(r_s() * (r - r_s()));
            return (
              <ellipse
                cx={cx} cy={ground - z * scaleH}
                rx={r * scaleR} ry={r * scaleR * 0.18}
                fill="none" stroke={`${ACCENT}50`} stroke-width="0.5"
              />
            );
          }}
        </For>
        {/* Event horizon ring */}
        <ellipse cx={cx} cy={ground} rx={r_s() * scaleR} ry={r_s() * scaleR * 0.18} fill="none" stroke="#ef4444" stroke-width="1.5" />
        <text x={cx} y={ground + 16} text-anchor="middle" font-size="9" fill="#ef4444">r = r_s = {r_s().toFixed(2)} (horizon)</text>

        {/* Asymptotic radius marks */}
        <text x={cx + 10 * scaleR + 4} y={ground - 4} font-size="9" fill="var(--text-muted)">r → ∞</text>
        <text x={cx - 10 * scaleR - 4} y={ground - 4} text-anchor="end" font-size="9" fill="var(--text-muted)">r → ∞</text>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="M" value={M().toFixed(2)} color={ACCENT} />
        <StatCard label="r_s = 2M" value={r_s().toFixed(2)} color={ACCENT} />
        <StatCard label="z(r=∞)" value="→ ∞" sub="paraboloid extends" color={ACCENT} />
        <StatCard label="z(r=2 r_s)" value={(2 * Math.sqrt(r_s() * r_s())).toFixed(2)} sub="2 r_s" color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        {"**Flamm's paraboloid** $z(r) = 2\\sqrt{r_s(r - r_s)}$ visualizes a $t = $ const equatorial slice of Schwarzschild spacetime as a 2D surface embedded in 3D Euclidean space. The geometry is **identical** to that slice of curved spacetime — proper distance along the surface equals proper distance in spacetime — but the embedding itself has no physical reality (the universe doesn't \"sit\" in a higher-dimensional flat space). Doubling the mass $M$ doubles the horizon radius $r_s$ and deepens the funnel. The familiar pop-science \"bowling ball on a rubber sheet\" image is, mathematically, this paraboloid — though gravity does **not** actually pull objects down because the embedded surface has no real third dimension."}
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// G3CosmicDistances — comoving, luminosity, angular-diameter distance
// vs redshift. For ΛCDM, integrate H(z) numerically.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const G3CosmicDistances: Component = () => {
  const [Om, setOm] = createSignal(0.315);
  const [Ol, setOl] = createSignal(0.685);
  const [H0, setH0] = createSignal(67.4); // km/s/Mpc

  const c = 299792.458; // km/s
  const dH = () => c / H0(); // Hubble distance in Mpc

  // E(z) = H(z)/H0 = sqrt(Ωm(1+z)³ + ΩΛ + Ωk(1+z)²)
  const Ok = () => 1 - Om() - Ol();
  const E = (z: number) => Math.sqrt(Om() * Math.pow(1 + z, 3) + Ol() + Ok() * Math.pow(1 + z, 2));

  // Comoving distance: integrate dH/E(z) from 0 to z
  const distances = createMemo(() => {
    const pts: { z: number; DC: number; DL: number; DA: number }[] = [];
    let DC_int = 0;
    let prevZ = 0;
    const NZ = 200;
    const zMax = 10;
    for (let i = 0; i <= NZ; i++) {
      const z = (i / NZ) * zMax;
      // Trapezoid rule
      const dz = z - prevZ;
      if (i > 0) DC_int += 0.5 * dz * (1 / E(z) + 1 / E(prevZ));
      const DC = dH() * DC_int;
      const DL = (1 + z) * DC;
      const DA = DC / (1 + z);
      pts.push({ z, DC, DL, DA });
      prevZ = z;
    }
    return pts;
  });

  const W = 480, H = 280;
  const padL = 50, padR = 12, padT = 16, padB = 30;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const Z_MAX = 10;
  const D_MAX = 80000; // Mpc
  const zToX = (z: number) => padL + (z / Z_MAX) * plotW;
  const dToY = (d: number) => padT + plotH - Math.min(d, D_MAX) / D_MAX * plotH;

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Slider label="Ω_m" value={Om()} min={0} max={1} step={0.01} onInput={setOm} />
        <Slider label="Ω_Λ" value={Ol()} min={0} max={1} step={0.01} onInput={setOl} />
        <Slider label="H₀" value={H0()} min={50} max={80} step={0.5} unit="km/s/Mpc" onInput={setH0} />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "320px" }}>
        <text x={W / 2} y={12} text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-secondary)">
          Cosmological distances vs redshift
        </text>
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--border)" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
        <text x={padL - 24} y={padT + plotH / 2} text-anchor="middle" font-size="9" fill="var(--text-muted)" transform={`rotate(-90 ${padL - 24} ${padT + plotH / 2})`}>
          distance (Mpc)
        </text>
        <text x={W / 2} y={H - 8} text-anchor="middle" font-size="10" fill="var(--text-muted)">redshift z</text>
        <text x={padL - 4} y={padT + 6} text-anchor="end" font-size="9" fill="var(--text-muted)">{(D_MAX / 1000).toFixed(0)} Gpc</text>
        <text x={padL - 4} y={H - padB} text-anchor="end" font-size="9" fill="var(--text-muted)">0</text>
        <For each={[2, 4, 6, 8, 10]}>
          {(zv) => (
            <>
              <line x1={zToX(zv)} y1={H - padB} x2={zToX(zv)} y2={H - padB + 3} stroke="var(--border)" />
              <text x={zToX(zv)} y={H - padB + 12} text-anchor="middle" font-size="8" fill="var(--text-muted)">{zv}</text>
            </>
          )}
        </For>
        {/* Curves */}
        <polyline fill="none" stroke="#06b6d4" stroke-width="2"
          points={distances().map(p => `${zToX(p.z)},${dToY(p.DC)}`).join(" ")} />
        <polyline fill="none" stroke="#f59e0b" stroke-width="2"
          points={distances().map(p => `${zToX(p.z)},${dToY(p.DL)}`).join(" ")} />
        <polyline fill="none" stroke="#22c55e" stroke-width="2"
          points={distances().map(p => `${zToX(p.z)},${dToY(p.DA)}`).join(" ")} />
        {/* Legend */}
        <g transform={`translate(${padL + 8}, ${padT + 6})`} font-size="9">
          <line x1="0" y1="0" x2="12" y2="0" stroke="#06b6d4" stroke-width="2" />
          <text x="16" y="3" fill="var(--text-secondary)">D_C (comoving)</text>
          <line x1="100" y1="0" x2="112" y2="0" stroke="#f59e0b" stroke-width="2" />
          <text x="116" y="3" fill="var(--text-secondary)">D_L (luminosity)</text>
          <line x1="190" y1="0" x2="202" y2="0" stroke="#22c55e" stroke-width="2" />
          <text x="206" y="3" fill="var(--text-secondary)">D_A (ang-diam)</text>
        </g>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="Hubble dist d_H" value={`${dH().toFixed(0)} Mpc`} sub="c/H₀" color={ACCENT} />
        <StatCard label="D_C(z=1)" value={`${distances()[20]?.DC.toFixed(0)} Mpc`} color="#06b6d4" />
        <StatCard label="D_L(z=1)" value={`${distances()[20]?.DL.toFixed(0)} Mpc`} sub="2× D_C at z=1" color="#f59e0b" />
        <StatCard label="D_A(z=1)" value={`${distances()[20]?.DA.toFixed(0)} Mpc`} sub="½ D_C at z=1" color="#22c55e" />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        Three different \"distances\" coexist in cosmology because spacetime expands. **Comoving distance** $D_C = \int_0^z c\,dz'/H(z')$ is what you'd measure on a fixed grid of galaxies; **luminosity distance** $D_L = (1+z)D_C$ is what supernovae fluxes track ($F = L/(4\pi D_L^2)$); **angular diameter distance** $D_A = D_C/(1+z)$ is what tells you how big a known-size object subtends in the sky. $D_A$ has the strange feature of *decreasing* beyond $z \sim 1.5$ — distant galaxies appear bigger because their light left when the universe was smaller.
      </div>
    </div>
  );
};
