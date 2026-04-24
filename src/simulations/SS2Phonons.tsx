import { Component, createSignal, createMemo, For, Show } from "solid-js";

const ACCENT = "#8b5cf6";

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
// SS2Phonons — 1D diatomic chain dispersion. Two masses m₁, m₂ alternating,
// linear spring K. Dispersion:
//   ω²± = K(1/m₁ + 1/m₂) ± K · √((1/m₁ + 1/m₂)² - 4 sin²(ka/2)/(m₁ m₂))
// Acoustic branch (−) and optical branch (+). Gap at k = π/a.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SS2Phonons: Component = () => {
  const [m1, setM1] = createSignal(1.0);
  const [m2, setM2] = createSignal(2.0);
  const [K, setK] = createSignal(1.0);

  const dispersion = createMemo(() => {
    const pts: { k: number; acoustic: number; optical: number }[] = [];
    const NK = 120;
    const mSum = 1 / m1() + 1 / m2();
    const mProd = m1() * m2();
    for (let i = 0; i <= NK; i++) {
      const k = -Math.PI + (i / NK) * 2 * Math.PI;
      const sinK = Math.sin(k / 2);
      const radicand = mSum * mSum - 4 * sinK * sinK / mProd;
      const sqrtTerm = Math.sqrt(Math.max(0, radicand));
      const omegaSqPlus = K() * (mSum + sqrtTerm);
      const omegaSqMinus = K() * (mSum - sqrtTerm);
      pts.push({
        k,
        acoustic: Math.sqrt(Math.max(0, omegaSqMinus)),
        optical: Math.sqrt(Math.max(0, omegaSqPlus)),
      });
    }
    return pts;
  });

  const mSum = () => 1 / m1() + 1 / m2();
  const omegaOpticalZone = () => Math.sqrt(K() * 2 * mSum()); // at k=0
  const omegaAcousticEdge = () => Math.sqrt(K() * 2 / Math.max(m1(), m2())); // at k=π/a: √(2K/M_big)
  const omegaOpticalEdge = () => Math.sqrt(K() * 2 / Math.min(m1(), m2()));
  const gap = () => omegaOpticalEdge() - omegaAcousticEdge();
  const soundSpeed = () => {
    // Small-k limit: ω ≈ v_s k, v_s = a √(K/(2(m1+m2))). Let a=1.
    return Math.sqrt(K() / (2 * (m1() + m2())));
  };

  const W = 460, H = 260;
  const padL = 38, padR = 12, padT = 16, padB = 30;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const OMEGA_MAX = 2.5;
  const kToX = (k: number) => padL + ((k + Math.PI) / (2 * Math.PI)) * plotW;
  const omegaToY = (w: number) => padT + plotH - Math.min(w / OMEGA_MAX, 1) * plotH;

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Slider label="Mass m₁" value={m1()} min={0.3} max={3.0} step={0.05} onInput={setM1} />
        <Slider label="Mass m₂" value={m2()} min={0.3} max={3.0} step={0.05} onInput={setM2} />
        <Slider label="Spring K" value={K()} min={0.2} max={3.0} step={0.05} onInput={setK} />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "320px" }}>
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--border)" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
        <text x={padL - 4} y={padT + 6} text-anchor="end" font-size="9" fill="var(--text-muted)">ω</text>
        <text x={W / 2} y={H - 6} text-anchor="middle" font-size="10" fill="var(--text-muted)">k · a / π</text>
        <For each={[-1, -0.5, 0, 0.5, 1]}>
          {(kv) => (
            <>
              <line x1={kToX(kv * Math.PI)} y1={H - padB} x2={kToX(kv * Math.PI)} y2={H - padB + 3} stroke="var(--border)" />
              <text x={kToX(kv * Math.PI)} y={H - padB + 12} text-anchor="middle" font-size="8" fill="var(--text-muted)">{kv}</text>
            </>
          )}
        </For>
        {/* Zone boundaries */}
        <line x1={kToX(-Math.PI)} y1={padT} x2={kToX(-Math.PI)} y2={H - padB} stroke="var(--text-muted)" stroke-dasharray="3 3" opacity="0.4" />
        <line x1={kToX(Math.PI)} y1={padT} x2={kToX(Math.PI)} y2={H - padB} stroke="var(--text-muted)" stroke-dasharray="3 3" opacity="0.4" />
        {/* Acoustic */}
        <polyline fill="none" stroke="#06b6d4" stroke-width="2"
          points={dispersion().map(p => `${kToX(p.k)},${omegaToY(p.acoustic)}`).join(" ")} />
        {/* Optical */}
        <polyline fill="none" stroke="#f59e0b" stroke-width="2"
          points={dispersion().map(p => `${kToX(p.k)},${omegaToY(p.optical)}`).join(" ")} />
        {/* Gap shading */}
        <Show when={Math.abs(m1() - m2()) > 0.05}>
          <rect x={padL} y={omegaToY(omegaOpticalEdge())}
            width={plotW} height={Math.max(0, omegaToY(omegaAcousticEdge()) - omegaToY(omegaOpticalEdge()))}
            fill={`${ACCENT}20`} />
          <text x={kToX(-Math.PI / 2)} y={(omegaToY(omegaOpticalEdge()) + omegaToY(omegaAcousticEdge())) / 2 + 4} text-anchor="middle" font-size="9" fill={ACCENT}>
            gap
          </text>
        </Show>
        {/* Legend */}
        <g transform={`translate(${padL + 8}, ${padT + 6})`} font-size="9">
          <line x1="0" y1="0" x2="12" y2="0" stroke="#06b6d4" stroke-width="2" />
          <text x="16" y="3" fill="var(--text-secondary)">acoustic</text>
          <line x1="70" y1="0" x2="82" y2="0" stroke="#f59e0b" stroke-width="2" />
          <text x="86" y="3" fill="var(--text-secondary)">optical</text>
        </g>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="Sound speed" value={soundSpeed().toFixed(3)} sub="ω/k at k→0" color="#06b6d4" />
        <StatCard label="Optical ω(k=0)" value={omegaOpticalZone().toFixed(3)} sub="√(2K(1/m₁+1/m₂))" color="#f59e0b" />
        <StatCard label="Band gap" value={gap().toFixed(3)} sub="at k=π/a" color={ACCENT} />
        <StatCard label="m₂/m₁" value={(m2() / m1()).toFixed(2)} color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        Two-atom basis gives two branches: the **acoustic** (adjacent atoms move in phase, like sound waves) and the **optical** (adjacent atoms move out of phase, like a dipole oscillation — couples strongly to light). Equal masses $m_1 = m_2$ close the gap — the diatomic chain becomes a monatomic one with half the unit cell and the two branches merge into a single folded branch.
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SS2Semiconductor — band diagram + Fermi level position, carrier
// concentrations as a function of T and doping.
// Intrinsic: n_i = √(N_c N_v) · exp(-E_g/2kT)
// n-type: n = N_D (full ionization), p = n_i²/n
// p-type: p = N_A, n = n_i²/p
// Fermi level: E_F = E_c - kT ln(N_c/n)
// Units: eV, K with kT in eV (≈ T/11604)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SS2Semiconductor: Component = () => {
  const [Eg, setEg] = createSignal(1.12); // Si: 1.12 eV; Ge 0.67; GaAs 1.42
  const [T, setT] = createSignal(300); // K
  const [dopingType, setDopingType] = createSignal<"intrinsic" | "n" | "p">("intrinsic");
  const [dopingLog, setDopingLog] = createSignal(15); // log₁₀ of impurity density (cm⁻³)

  // Effective DOS (cm⁻³) rough values near room temp
  const N_c = 2.8e19; // Si conduction band
  const N_v = 1.04e19; // Si valence band

  const kT = () => T() * 8.617e-5; // eV
  const ni = () => Math.sqrt(N_c * N_v) * Math.exp(-Eg() / (2 * kT()));
  const doping = () => Math.pow(10, dopingLog());

  const concentrations = createMemo(() => {
    const Nd = dopingType() === "n" ? doping() : 0;
    const Na = dopingType() === "p" ? doping() : 0;
    // Charge balance: n - p + Na - Nd = 0, n p = ni². Solve:
    // n = (Nd - Na)/2 + √((Nd - Na)²/4 + ni²)
    // p = n - (Nd - Na) = -(Nd-Na)/2 + √((Nd-Na)²/4 + ni²)
    const delta = Nd - Na;
    const root = Math.sqrt(delta * delta / 4 + ni() * ni());
    const n = delta / 2 + root;
    const p = -delta / 2 + root;
    return { n, p, Nd, Na };
  });

  // Fermi level relative to conduction band (E_c = 0 reference)
  const EF = () => -kT() * Math.log(N_c / concentrations().n);
  const Ev = () => -Eg();

  const W = 480, H = 240;

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Slider label="Band gap E_g" value={Eg()} min={0.3} max={3.5} step={0.01} unit="eV" onInput={setEg} />
        <Slider label="Temperature T" value={T()} min={100} max={600} step={5} unit="K" onInput={setT} />
      </div>

      <div class="flex flex-wrap gap-2">
        <For each={["intrinsic", "n", "p"] as const}>
          {(k) => (
            <button
              onClick={() => setDopingType(k)}
              class="px-3 py-1.5 rounded-lg text-[11px] font-semibold"
              style={{
                background: dopingType() === k ? ACCENT : "var(--bg-secondary)",
                color: dopingType() === k ? "white" : "var(--text-secondary)",
                border: `1px solid ${dopingType() === k ? ACCENT : "var(--border)"}`,
              }}
            >
              {k === "intrinsic" ? "Intrinsic" : k === "n" ? "n-type (donors)" : "p-type (acceptors)"}
            </button>
          )}
        </For>
        <Show when={dopingType() !== "intrinsic"}>
          <div class="flex-1 min-w-[180px]">
            <Slider label="Dopant concentration log₁₀(N)" value={dopingLog()} min={13} max={19} step={0.1} unit="cm⁻³" onInput={setDopingLog} />
          </div>
        </Show>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "300px" }}>
        {/* Band diagram */}
        {(() => {
          const eMin = Ev() - 0.3;
          const eMax = 0.3;
          const eToY = (e: number) => 30 + (1 - (e - eMin) / (eMax - eMin)) * (H - 60);
          const leftX = 40, rightX = W - 40;
          return (
            <>
              {/* Conduction band */}
              <line x1={leftX} y1={eToY(0)} x2={rightX} y2={eToY(0)} stroke="#06b6d4" stroke-width="3" />
              <text x={rightX + 4} y={eToY(0) + 4} font-size="10" fill="#06b6d4">E_c</text>
              {/* Valence band */}
              <line x1={leftX} y1={eToY(Ev())} x2={rightX} y2={eToY(Ev())} stroke="#f59e0b" stroke-width="3" />
              <text x={rightX + 4} y={eToY(Ev()) + 4} font-size="10" fill="#f59e0b">E_v</text>
              {/* Fermi level */}
              <line x1={leftX} y1={eToY(EF())} x2={rightX} y2={eToY(EF())} stroke="#ec4899" stroke-width="2" stroke-dasharray="5 3" />
              <text x={rightX + 4} y={eToY(EF()) + 4} font-size="10" fill="#ec4899">E_F</text>
              {/* Gap shading */}
              <rect x={leftX} y={eToY(0)} width={rightX - leftX} height={eToY(Ev()) - eToY(0)} fill={`${ACCENT}10`} />
              <text x={(leftX + rightX) / 2} y={(eToY(0) + eToY(Ev())) / 2 + 4} text-anchor="middle" font-size="11" fill="var(--text-muted)">
                gap E_g = {Eg().toFixed(2)} eV
              </text>
              {/* Donor / acceptor levels */}
              <Show when={dopingType() === "n"}>
                <line x1={leftX + 50} y1={eToY(-0.04)} x2={rightX - 50} y2={eToY(-0.04)} stroke="#22c55e" stroke-width="1" stroke-dasharray="3 2" />
                <text x={rightX - 46} y={eToY(-0.04) + 2} font-size="9" fill="#22c55e">E_D (donor)</text>
              </Show>
              <Show when={dopingType() === "p"}>
                <line x1={leftX + 50} y1={eToY(Ev() + 0.04)} x2={rightX - 50} y2={eToY(Ev() + 0.04)} stroke="#22c55e" stroke-width="1" stroke-dasharray="3 2" />
                <text x={rightX - 46} y={eToY(Ev() + 0.04) + 2} font-size="9" fill="#22c55e">E_A (acceptor)</text>
              </Show>
              {/* Axis labels */}
              <text x={leftX - 4} y={eToY(0) - 2} text-anchor="end" font-size="8" fill="var(--text-muted)">0</text>
              <text x={leftX - 4} y={eToY(Ev()) + 6} text-anchor="end" font-size="8" fill="var(--text-muted)">−E_g</text>
              <text x={(leftX + rightX) / 2} y={H - 8} text-anchor="middle" font-size="10" fill="var(--text-muted)">position (or slab)</text>
            </>
          );
        })()}
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="n_i (intrinsic)" value={ni().toExponential(2)} sub="cm⁻³" color={ACCENT} />
        <StatCard label="Electron n" value={concentrations().n.toExponential(2)} sub="cm⁻³" color="#06b6d4" />
        <StatCard label="Hole p" value={concentrations().p.toExponential(2)} sub="cm⁻³" color="#f59e0b" />
        <StatCard label="n·p" value={(concentrations().n * concentrations().p).toExponential(2)} sub="= n_i² (mass action)" color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        {"An **intrinsic semiconductor** has $n = p = n_i \\propto e^{-E_g/2k_BT}$ — exponentially sensitive to $T$. Adding **donors** (n-type) or **acceptors** (p-type) pushes the Fermi level up or down, but the **mass-action law** $np = n_i^2$ always holds. Tune $T$ to see the Arrhenius activation of carriers; switch between intrinsic/n/p to watch the Fermi level shift toward the conduction or valence band."}
      </div>
    </div>
  );
};
