import { Component, createSignal, createMemo, onCleanup, For } from "solid-js";

const ACCENT = "#dc2626";

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
// N1BindingEnergy — semi-empirical mass formula (Bethe-Weizsäcker).
// B(A,Z) = a_v A - a_s A^(2/3) - a_c Z(Z-1)/A^(1/3) - a_a (A-2Z)^2/A ± δ
// Plot B/A vs A for Z = Z_opt(A) and visualize the curve with the iron
// peak at A ≈ 56.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const N1BindingEnergy: Component = () => {
  // Bethe-Weizsäcker coefficients (MeV)
  const a_v = 15.8, a_s = 18.3, a_c = 0.714, a_a = 23.2, a_p = 12.0;

  const [A, setA] = createSignal(56); // mass number
  // For a given A, optimal Z (minimize BE wrt Z ignoring pairing):
  // dB/dZ = 0 -> Z_opt = (a_a A + a_c A^{2/3}/2) / (2 a_a / A + a_c A^{-1/3})  (approx.)
  const Zopt = (Aval: number) => {
    // Simplified formula from standard textbooks:
    return Aval / (1.98 + 0.015 * Math.pow(Aval, 2 / 3));
  };

  const semfBoverA = (Aval: number, Zval: number) => {
    if (Aval <= 0) return 0;
    const pairing = (Aval % 2 === 1 ? 0 :
      ((Zval % 2 === 0) && ((Aval - Zval) % 2 === 0) ? +a_p : -a_p)) / Math.sqrt(Aval);
    const B = a_v * Aval
      - a_s * Math.pow(Aval, 2 / 3)
      - a_c * Zval * (Zval - 1) / Math.pow(Aval, 1 / 3)
      - a_a * Math.pow(Aval - 2 * Zval, 2) / Aval
      + pairing;
    return B / Aval;
  };

  // Curve data
  const curve = createMemo(() => {
    const pts: { A: number; boverA: number }[] = [];
    for (let a = 1; a <= 260; a++) {
      const z = Math.round(Zopt(a));
      pts.push({ A: a, boverA: semfBoverA(a, z) });
    }
    return pts;
  });

  const currentZ = () => Math.round(Zopt(A()));
  const currentBA = () => semfBoverA(A(), currentZ());

  const W = 460, H = 260;
  const padL = 38, padR = 12, padT = 16, padB = 32;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const B_MAX = 9;
  const aToX = (a: number) => padL + (a / 260) * plotW;
  const bToY = (b: number) => padT + plotH - Math.min(Math.max(b, 0), B_MAX) / B_MAX * plotH;

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Slider label="Mass number A" value={A()} min={1} max={260} step={1} onInput={setA} />
        <div class="text-[11px] flex items-end" style={{ color: "var(--text-muted)" }}>
          Z_opt(A) = {currentZ()} — the valley of stability
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "320px" }}>
        {/* axes */}
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--border)" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
        <text x={padL - 4} y={padT + 6} text-anchor="end" font-size="9" fill="var(--text-muted)">{B_MAX}</text>
        <text x={padL - 4} y={H - padB} text-anchor="end" font-size="9" fill="var(--text-muted)">0</text>
        <text x={padL - 20} y={padT + plotH / 2 + 4} text-anchor="middle" font-size="9" fill="var(--text-muted)" transform={`rotate(-90 ${padL - 20} ${padT + plotH / 2 + 4})`}>
          B/A (MeV)
        </text>
        <text x={W / 2} y={H - 8} text-anchor="middle" font-size="10" fill="var(--text-muted)">Mass number A</text>
        <For each={[50, 100, 150, 200, 250]}>
          {(a) => (
            <>
              <line x1={aToX(a)} y1={H - padB} x2={aToX(a)} y2={H - padB + 3} stroke="var(--border)" />
              <text x={aToX(a)} y={H - padB + 12} text-anchor="middle" font-size="8" fill="var(--text-muted)">{a}</text>
            </>
          )}
        </For>
        {/* iron peak marker */}
        <line x1={aToX(56)} y1={padT} x2={aToX(56)} y2={H - padB} stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 3" opacity="0.5" />
        <text x={aToX(56)} y={padT + 10} text-anchor="middle" font-size="9" fill="#f59e0b">⁵⁶Fe</text>
        {/* curve */}
        <polyline
          fill="none"
          stroke={ACCENT}
          stroke-width="2"
          points={curve().map((p) => `${aToX(p.A)},${bToY(p.boverA)}`).join(" ")}
        />
        {/* Selected */}
        <circle cx={aToX(A())} cy={bToY(currentBA())} r="5" fill={ACCENT} stroke="white" stroke-width="1.5" />
        {/* Fusion / fission arrows */}
        <g font-size="9" fill="var(--text-muted)">
          <text x={aToX(20)} y={padT + 24} text-anchor="middle">← fusion</text>
          <text x={aToX(200)} y={padT + 24} text-anchor="middle">fission →</text>
        </g>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="A" value={A().toString()} color={ACCENT} />
        <StatCard label="Z_opt" value={currentZ().toString()} sub="valley of β-stability" color={ACCENT} />
        <StatCard label="B / A" value={`${currentBA().toFixed(2)} MeV`} color={ACCENT} />
        <StatCard label="Total B" value={`${(currentBA() * A()).toFixed(0)} MeV`} color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        The SEMF $B/A = a_v - a_s/A^{1/3} - a_c\,Z(Z-1)/A^{4/3} - a_a(A-2Z)^2/A^2$ balances a short-range attractive bulk term against a surface-tension correction and growing Coulomb repulsion. The peak at $A \approx 56$ (iron) is why fusion releases energy for light nuclei and fission releases energy for heavy ones.
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// N1RadioactiveDecay — simulate a population of decaying nuclei and plot
// N(t) = N₀ e^(-λt) along with a parent-daughter Bateman chain.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const N1RadioactiveDecay: Component = () => {
  const [halfLifeP, setHalfLifeP] = createSignal(5); // parent half-life (s)
  const [halfLifeD, setHalfLifeD] = createSignal(15); // daughter half-life (s)
  const [t, setT] = createSignal(0);
  const [running, setRunning] = createSignal(false);

  const N0 = 1000;
  const lambdaP = () => Math.LN2 / halfLifeP();
  const lambdaD = () => Math.LN2 / halfLifeD();

  // Analytical Bateman:
  // N_P(t) = N0 * exp(-lambdaP t)
  // N_D(t) = N0 * lambdaP/(lambdaD - lambdaP) * (exp(-lambdaP t) - exp(-lambdaD t))
  // stable granddaughter: N_S(t) = N0 - N_P(t) - N_D(t)
  const Np = () => N0 * Math.exp(-lambdaP() * t());
  const Nd = () => {
    if (Math.abs(lambdaD() - lambdaP()) < 1e-6) {
      return N0 * lambdaP() * t() * Math.exp(-lambdaP() * t());
    }
    return N0 * lambdaP() / (lambdaD() - lambdaP()) * (Math.exp(-lambdaP() * t()) - Math.exp(-lambdaD() * t()));
  };
  const Ns = () => N0 - Np() - Nd();

  // History
  const [history, setHistory] = createSignal<{ t: number; p: number; d: number; s: number }[]>([{ t: 0, p: N0, d: 0, s: 0 }]);

  let raf: number | undefined;
  let lastTick = performance.now();
  const tick = (now: number) => {
    const dt = Math.min((now - lastTick) / 1000, 0.1);
    lastTick = now;
    if (running()) {
      const newT = t() + dt * 2; // speed factor
      setT(newT);
      setHistory((h) => {
        const next = [...h, { t: newT, p: Np(), d: Nd(), s: Ns() }];
        if (next.length > 500) next.shift();
        return next;
      });
    }
    raf = requestAnimationFrame(tick);
  };

  const toggle = () => {
    if (running()) {
      setRunning(false);
    } else {
      setRunning(true);
      lastTick = performance.now();
    }
  };
  const reset = () => {
    setRunning(false);
    setT(0);
    setHistory([{ t: 0, p: N0, d: 0, s: 0 }]);
  };

  raf = requestAnimationFrame(tick);
  onCleanup(() => { if (raf) cancelAnimationFrame(raf); });

  const W = 460, H = 240;
  const padL = 40, padR = 12, padT = 16, padB = 28;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const T_MAX = 60;
  const tToX = (tv: number) => padL + (Math.min(tv, T_MAX) / T_MAX) * plotW;
  const nToY = (n: number) => padT + plotH - (n / N0) * plotH;

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Slider label="Parent half-life" value={halfLifeP()} min={1} max={30} step={0.5} unit="s" onInput={(v) => { setHalfLifeP(v); reset(); }} />
        <Slider label="Daughter half-life" value={halfLifeD()} min={1} max={30} step={0.5} unit="s" onInput={(v) => { setHalfLifeD(v); reset(); }} />
      </div>

      <div class="flex gap-2">
        <button onClick={toggle} class="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: ACCENT, color: "white" }}>
          {running() ? "Pause" : "Play"}
        </button>
        <button onClick={reset} class="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
          Reset
        </button>
        <div class="text-[11px] self-center" style={{ color: "var(--text-muted)" }}>
          t = {t().toFixed(1)} s
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "300px" }}>
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--border)" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
        <text x={padL - 4} y={padT + 6} text-anchor="end" font-size="9" fill="var(--text-muted)">{N0}</text>
        <text x={padL - 4} y={H - padB} text-anchor="end" font-size="9" fill="var(--text-muted)">0</text>
        <text x={W / 2} y={H - 6} text-anchor="middle" font-size="10" fill="var(--text-muted)">time (s)</text>
        <For each={[10, 20, 30, 40, 50]}>
          {(tv) => (
            <>
              <line x1={tToX(tv)} y1={H - padB} x2={tToX(tv)} y2={H - padB + 3} stroke="var(--border)" />
              <text x={tToX(tv)} y={H - padB + 12} text-anchor="middle" font-size="8" fill="var(--text-muted)">{tv}</text>
            </>
          )}
        </For>
        {/* Parent */}
        <polyline fill="none" stroke={ACCENT} stroke-width="2"
          points={history().map((h) => `${tToX(h.t)},${nToY(h.p)}`).join(" ")} />
        {/* Daughter */}
        <polyline fill="none" stroke="#f59e0b" stroke-width="2"
          points={history().map((h) => `${tToX(h.t)},${nToY(h.d)}`).join(" ")} />
        {/* Stable */}
        <polyline fill="none" stroke="#22c55e" stroke-width="2"
          points={history().map((h) => `${tToX(h.t)},${nToY(h.s)}`).join(" ")} />
        {/* Legend */}
        <g transform={`translate(${padL + 12}, ${padT + 10})`} font-size="10">
          <rect x="0" y="-8" width="10" height="2" fill={ACCENT} />
          <text x="14" y="-4" fill="var(--text-secondary)">Parent</text>
          <rect x="70" y="-8" width="10" height="2" fill="#f59e0b" />
          <text x="84" y="-4" fill="var(--text-secondary)">Daughter</text>
          <rect x="150" y="-8" width="10" height="2" fill="#22c55e" />
          <text x="164" y="-4" fill="var(--text-secondary)">Stable</text>
        </g>
      </svg>

      <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <StatCard label="N parent" value={Np().toFixed(0)} color={ACCENT} />
        <StatCard label="N daughter" value={Nd().toFixed(0)} color="#f59e0b" />
        <StatCard label="N stable" value={Ns().toFixed(0)} color="#22c55e" />
        <StatCard label="λ_P" value={lambdaP().toFixed(3)} sub="s⁻¹" color={ACCENT} />
        <StatCard label="λ_D" value={lambdaD().toFixed(3)} sub="s⁻¹" color="#f59e0b" />
        <StatCard label="Activity" value={(lambdaP() * Np()).toFixed(0)} sub="decays/s" color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        Set the daughter half-life much shorter than the parent to see **secular equilibrium** (daughter activity ≈ parent activity). Set them close and watch the daughter build up and decay almost in lockstep — **transient equilibrium**.
      </div>
    </div>
  );
};
