import { Component, createSignal, createMemo, onCleanup, For, Show } from "solid-js";

const ACCENT = "#f43f5e";

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
// N2RutherfordScattering — hyperbolic trajectories of alpha particles
// scattered off a Coulomb nucleus. Plot multiple trajectories at
// different impact parameters. Also show dσ/dΩ vs θ (csc⁴(θ/2)).
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const N2RutherfordScattering: Component = () => {
  const [Z1Z2, setZ1Z2] = createSignal(158); // Z_alpha * Z_nucleus = 2 * 79 (Au)
  const [E, setE] = createSignal(5.0); // MeV
  const [numRays, setNumRays] = createSignal(9);

  // Parameter a = Z₁Z₂e²/(4πε₀ E) = 1.44·Z₁Z₂/E (nm·MeV units); we'll use natural units
  const a = () => Z1Z2() * 0.00144 / E(); // "half-turn" distance (with MeV energies in fm if Z*Z*1.44)
  const d = () => 2 * a(); // closest approach at b=0

  // Hyperbolic trajectory: scattering angle θ = 2·arctan(a/b)
  const theta = (b: number) => 2 * Math.atan2(a(), b);

  const W = 480, H = 280;
  const cx = W / 2, cy = H / 2;
  const scale = 400; // 1 fm = ? px; adjust

  // For each ray, compute hyperbola in 2D. Impact param b.
  // Kinematics: incoming from far left horizontal (+y = 0, -x direction reversed).
  // Actually, let incoming travel in +x direction with offset b in y.
  // Nucleus at origin.
  const rays = createMemo(() => {
    const bMax = 0.1; // fm
    const result: { b: number; path: { x: number; y: number }[]; theta: number }[] = [];
    const N = numRays();
    for (let i = 0; i < N; i++) {
      const b = bMax * (i - (N - 1) / 2) / (N / 2); // signed impact param
      if (Math.abs(b) < 0.002) continue;
      // numerically integrate the Kepler-style orbit in 2D:
      // m r̈ = (k/r³) r, k = Z₁Z₂ e²/(4πε₀) (repulsive → +)
      // Simpler: compute hyperbola analytically
      // orbit equation in polar: r(φ) = (L²/mk)/(e cos(φ - φ₀) - 1)  (hyperbola)
      // e = √(1 + (b E / (k/2))²) = √(1 + (2bE/(Z₁Z₂e²))²)
      // For visualization, just do numerical integration.
      const path: { x: number; y: number }[] = [];
      // start far upstream
      let x = -0.3, y = b;
      let vx = 1, vy = 0; // pure speed units (arbitrary)
      const dt = 0.001;
      for (let step = 0; step < 2000; step++) {
        const r = Math.sqrt(x * x + y * y);
        if (r < 0.001) break;
        // repulsive force: F = (a/r²) * (r̂), keeping energy constant
        const ax = (a() / (r * r * r)) * x;
        const ay = (a() / (r * r * r)) * y;
        vx += ax * dt; vy += ay * dt;
        x += vx * dt; y += vy * dt;
        path.push({ x, y });
        if (x > 0.5 || Math.abs(y) > 0.4) break;
      }
      result.push({ b, path, theta: theta(Math.abs(b)) });
    }
    return result;
  });

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Slider label="Z₁·Z₂ (α on gold: 158)" value={Z1Z2()} min={20} max={400} step={2} onInput={setZ1Z2} />
        <Slider label="Incident energy E" value={E()} min={1} max={30} step={0.5} unit="MeV" onInput={setE} />
        <Slider label="# rays" value={numRays()} min={3} max={15} step={2} onInput={setNumRays} />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "320px" }}>
        {/* Axes */}
        <line x1={0} y1={cy} x2={W} y2={cy} stroke="var(--border)" stroke-dasharray="3 3" />
        {/* Nucleus */}
        <circle cx={cx} cy={cy} r="6" fill="#f59e0b" stroke="white" stroke-width="1" />
        <text x={cx} y={cy + 20} text-anchor="middle" font-size="9" fill="#f59e0b">nucleus</text>
        {/* Rays */}
        <For each={rays()}>
          {(r) => (
            <polyline fill="none" stroke={r.b > 0 ? "#06b6d4" : "#ec4899"} stroke-width="1.2" opacity="0.85"
              points={r.path.map(p => `${cx + p.x * scale},${cy - p.y * scale}`).join(" ")} />
          )}
        </For>
        {/* Incoming direction indicator */}
        <text x={20} y={cy - 8} font-size="9" fill="var(--text-muted)">α →</text>
      </svg>

      {/* Cross-section plot: dσ/dΩ ∝ csc⁴(θ/2) */}
      {(() => {
        const W2 = 460, H2 = 200;
        const padL = 40, padR = 10, padT = 14, padB = 26;
        const plotW = W2 - padL - padR, plotH = H2 - padT - padB;
        const thetaToX = (t: number) => padL + (t / Math.PI) * plotW;
        const csc4 = (t: number) => 1 / Math.pow(Math.sin(t / 2), 4);
        const LOG_MAX = 6, LOG_MIN = 0;
        const yForLog = (v: number) => {
          const l = Math.max(LOG_MIN, Math.min(LOG_MAX, Math.log10(Math.max(v, 1))));
          return padT + plotH - (l - LOG_MIN) / (LOG_MAX - LOG_MIN) * plotH;
        };
        const pts: string[] = [];
        for (let i = 1; i <= 100; i++) {
          const t = (i / 100) * Math.PI * 0.95 + 0.05;
          pts.push(`${thetaToX(t)},${yForLog(csc4(t))}`);
        }
        return (
          <svg viewBox={`0 0 ${W2} ${H2}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "220px" }}>
            <text x={W2 / 2} y={12} text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-secondary)">
              dσ/dΩ ∝ csc⁴(θ/2) — log scale
            </text>
            <line x1={padL} y1={H2 - padB} x2={W2 - padR} y2={H2 - padB} stroke="var(--border)" />
            <line x1={padL} y1={padT} x2={padL} y2={H2 - padB} stroke="var(--border)" />
            <text x={padL - 4} y={padT + 6} text-anchor="end" font-size="9" fill="var(--text-muted)">10⁶</text>
            <text x={padL - 4} y={H2 - padB} text-anchor="end" font-size="9" fill="var(--text-muted)">10⁰</text>
            <text x={W2 / 2} y={H2 - 8} text-anchor="middle" font-size="10" fill="var(--text-muted)">scattering angle θ</text>
            <For each={[30, 60, 90, 120, 150]}>
              {(deg) => (
                <>
                  <line x1={thetaToX(deg * Math.PI / 180)} y1={H2 - padB} x2={thetaToX(deg * Math.PI / 180)} y2={H2 - padB + 3} stroke="var(--border)" />
                  <text x={thetaToX(deg * Math.PI / 180)} y={H2 - padB + 12} text-anchor="middle" font-size="8" fill="var(--text-muted)">{deg}°</text>
                </>
              )}
            </For>
            <polyline fill="none" stroke={ACCENT} stroke-width="2" points={pts.join(" ")} />
          </svg>
        );
      })()}

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="Z₁Z₂" value={Z1Z2().toString()} color={ACCENT} />
        <StatCard label="E incident" value={`${E().toFixed(1)} MeV`} color={ACCENT} />
        <StatCard label="Closest approach" value={`${(d() * 1000).toFixed(2)} fm`} sub="b=0 head-on" color={ACCENT} />
        <StatCard label="a = Z₁Z₂e²/4πε₀E" value={`${(a() * 1000).toFixed(2)} fm`} color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        {"The scattering angle is $\\theta = 2\\arctan(a/b)$ where $a = Z_1 Z_2 e^2 / (4\\pi\\varepsilon_0 E)$. The differential cross-section is $d\\sigma/d\\Omega = (a/4)^2 \\csc^4(\\theta/2)$ — it diverges at small angle (soft Coulomb scattering) but predicts a tiny finite rate of large-angle backscattering. Rutherford's 1911 discovery of these backscattered alphas in gold foil demolished the plum-pudding model: the atom's positive charge had to be concentrated in a tiny nucleus."}
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// N2StandardModel — interactive chart of Standard Model particles.
// Click to display properties.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
type Particle = {
  symbol: string;
  name: string;
  kind: "quark" | "lepton" | "gauge" | "higgs";
  gen: number; // 1/2/3 for quarks & leptons, 0 for bosons
  charge: string;
  spin: string;
  mass: string;
  color: string;
  note: string;
};

const SM: Particle[] = [
  { symbol: "u", name: "up", kind: "quark", gen: 1, charge: "+2/3", spin: "1/2", mass: "~2.2 MeV", color: "#8b5cf6", note: "Proton = uud; neutron = udd. Stable." },
  { symbol: "d", name: "down", kind: "quark", gen: 1, charge: "−1/3", spin: "1/2", mass: "~4.7 MeV", color: "#8b5cf6", note: "Heavier than u → neutron decays to proton via β⁻." },
  { symbol: "c", name: "charm", kind: "quark", gen: 2, charge: "+2/3", spin: "1/2", mass: "~1.27 GeV", color: "#a855f7", note: "Discovered 1974 (J/ψ). Tied charge of +2/3 with u." },
  { symbol: "s", name: "strange", kind: "quark", gen: 2, charge: "−1/3", spin: "1/2", mass: "~93 MeV", color: "#a855f7", note: "Carries the 'strangeness' quantum number." },
  { symbol: "t", name: "top", kind: "quark", gen: 3, charge: "+2/3", spin: "1/2", mass: "~173 GeV", color: "#c084fc", note: "Heaviest known particle; decays before hadronizing." },
  { symbol: "b", name: "bottom", kind: "quark", gen: 3, charge: "−1/3", spin: "1/2", mass: "~4.18 GeV", color: "#c084fc", note: "Bottomonium states and B mesons probe CKM mixing." },
  { symbol: "e", name: "electron", kind: "lepton", gen: 1, charge: "−1", spin: "1/2", mass: "0.511 MeV", color: "#06b6d4", note: "Stable. Orbits atoms; responsible for chemistry." },
  { symbol: "ν_e", name: "electron neutrino", kind: "lepton", gen: 1, charge: "0", spin: "1/2", mass: "< 0.8 eV", color: "#06b6d4", note: "Tiny mass, weak only. Oscillates with ν_μ, ν_τ." },
  { symbol: "μ", name: "muon", kind: "lepton", gen: 2, charge: "−1", spin: "1/2", mass: "105.7 MeV", color: "#0ea5e9", note: "Like a heavy electron; τ ≈ 2.2 μs. Cosmic-ray signature." },
  { symbol: "ν_μ", name: "muon neutrino", kind: "lepton", gen: 2, charge: "0", spin: "1/2", mass: "< 0.17 MeV", color: "#0ea5e9", note: "Produced with muons in weak decays." },
  { symbol: "τ", name: "tau", kind: "lepton", gen: 3, charge: "−1", spin: "1/2", mass: "1.777 GeV", color: "#38bdf8", note: "Heaviest charged lepton; decays hadronically." },
  { symbol: "ν_τ", name: "tau neutrino", kind: "lepton", gen: 3, charge: "0", spin: "1/2", mass: "< 18.2 MeV", color: "#38bdf8", note: "Detected 2000 at Fermilab (DONUT)." },
  { symbol: "g", name: "gluon", kind: "gauge", gen: 0, charge: "0", spin: "1", mass: "0", color: "#f59e0b", note: "Mediates strong force. Eight color-octet states." },
  { symbol: "γ", name: "photon", kind: "gauge", gen: 0, charge: "0", spin: "1", mass: "0", color: "#fbbf24", note: "Mediates electromagnetism. Massless, long-range." },
  { symbol: "Z", name: "Z boson", kind: "gauge", gen: 0, charge: "0", spin: "1", mass: "91.19 GeV", color: "#ef4444", note: "Mediates neutral weak current. Heavy → short range." },
  { symbol: "W±", name: "W boson", kind: "gauge", gen: 0, charge: "±1", spin: "1", mass: "80.38 GeV", color: "#f87171", note: "Mediates charged weak current; responsible for β decay." },
  { symbol: "H", name: "Higgs boson", kind: "higgs", gen: 0, charge: "0", spin: "0", mass: "125.25 GeV", color: "#22c55e", note: "Excitation of the Higgs field that gives mass to fermions and W/Z." },
];

export const N2StandardModel: Component = () => {
  const [selected, setSelected] = createSignal<Particle | null>(SM[12]);

  const quarks = SM.filter(p => p.kind === "quark");
  const leptons = SM.filter(p => p.kind === "lepton");
  const gauge = SM.filter(p => p.kind === "gauge");
  const higgs = SM.filter(p => p.kind === "higgs");

  const Cell: Component<{ p: Particle }> = (props) => (
    <button
      onClick={() => setSelected(props.p)}
      class="rounded-lg p-2 text-center transition-all"
      style={{
        background: selected() === props.p ? props.p.color : `${props.p.color}20`,
        color: selected() === props.p ? "white" : "var(--text-primary)",
        border: `1px solid ${props.p.color}50`,
      }}
    >
      <div class="text-lg font-bold font-mono">{props.p.symbol}</div>
      <div class="text-[9px] uppercase tracking-widest mt-0.5 opacity-80">{props.p.name}</div>
      <div class="text-[10px] mt-0.5 opacity-80">{props.p.mass}</div>
    </button>
  );

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-4 gap-2">
        <For each={[1, 2, 3]}>
          {(g) => (
            <div class="col-span-1 space-y-2">
              <div class="text-[10px] font-bold uppercase text-center tracking-widest" style={{ color: "var(--text-muted)" }}>
                Gen {g}
              </div>
              <Cell p={quarks.find(q => q.gen === g && q.charge === "+2/3")!} />
              <Cell p={quarks.find(q => q.gen === g && q.charge === "−1/3")!} />
              <Cell p={leptons.find(l => l.gen === g && l.charge === "−1")!} />
              <Cell p={leptons.find(l => l.gen === g && l.charge === "0")!} />
            </div>
          )}
        </For>
        <div class="col-span-1 space-y-2">
          <div class="text-[10px] font-bold uppercase text-center tracking-widest" style={{ color: "var(--text-muted)" }}>
            Forces
          </div>
          <For each={gauge}>{(g) => <Cell p={g} />}</For>
          <Cell p={higgs[0]} />
        </div>
      </div>

      <Show when={selected()}>
        <div class="rounded-lg p-4" style={{ background: "var(--bg-secondary)", "border-left": `4px solid ${selected()!.color}` }}>
          <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl font-mono font-bold" style={{ color: selected()!.color }}>{selected()!.symbol}</span>
            <div>
              <div class="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{selected()!.name}</div>
              <div class="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {selected()!.kind} · {selected()!.gen > 0 ? `generation ${selected()!.gen}` : "force carrier"}
              </div>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-2 mt-3 text-xs">
            <div><span style={{ color: "var(--text-muted)" }}>Charge: </span><span class="font-mono">{selected()!.charge}</span></div>
            <div><span style={{ color: "var(--text-muted)" }}>Spin: </span><span class="font-mono">{selected()!.spin}</span></div>
            <div><span style={{ color: "var(--text-muted)" }}>Mass: </span><span class="font-mono">{selected()!.mass}</span></div>
          </div>
          <p class="text-[11px] mt-3" style={{ color: "var(--text-secondary)" }}>{selected()!.note}</p>
        </div>
      </Show>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        The **Standard Model** organizes matter into three generations of fermions — six quarks (up/down, charm/strange, top/bottom) and six leptons (electron/e-neutrino, muon/μ-neutrino, tau/τ-neutrino) — plus four force-carrier bosons and the Higgs. Each fermion has a heavier doppelgänger in the next generation (the "second and third generation mystery"). The **Higgs boson**, discovered in 2012 at the LHC, gives mass to fermions and to the $W$/$Z$ bosons through the Higgs mechanism.
      </div>
    </div>
  );
};
