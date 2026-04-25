import { Component, createSignal, createMemo, For, Show } from "solid-js";

const ACCENT = "#0d9488";

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
// SS3XrayDiffraction — Bragg's law: 2d sinθ = nλ. Show the geometry +
// list which (h, k) reflections are active. Powder pattern as a 1D
// intensity-vs-2θ chart.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SS3XrayDiffraction: Component = () => {
  const [a, setA] = createSignal(0.4); // lattice constant (nm)
  const [lambda, setLambda] = createSignal(0.154); // Cu Kα = 0.154 nm
  const [latticeType, setLatticeType] = createSignal<"sc" | "bcc" | "fcc">("sc");

  // For (h,k,l) reflection:
  //   d_{hkl} = a / sqrt(h² + k² + l²)
  //   Bragg: nλ = 2d sinθ → 2θ = 2 arcsin(nλ/2d)
  // Selection rules:
  //   SC: all (h,k,l) allowed
  //   BCC: h+k+l even
  //   FCC: h,k,l all even or all odd
  type Reflection = { hkl: [number, number, number]; d: number; theta: number; intensity: number };

  const reflections = createMemo<Reflection[]>(() => {
    const list: Reflection[] = [];
    const seen = new Set<number>();
    const lt = latticeType();
    for (let h = 0; h <= 4; h++) {
      for (let k = 0; k <= 4; k++) {
        for (let l = 0; l <= 4; l++) {
          if (h === 0 && k === 0 && l === 0) continue;
          const sum = h + k + l;
          // Selection rules
          if (lt === "bcc" && sum % 2 !== 0) continue;
          if (lt === "fcc") {
            const allEven = h % 2 === 0 && k % 2 === 0 && l % 2 === 0;
            const allOdd = h % 2 === 1 && k % 2 === 1 && l % 2 === 1;
            if (!(allEven || allOdd)) continue;
          }
          const m = h * h + k * k + l * l;
          if (seen.has(m)) continue; // skip degenerate (only show one per |G|)
          seen.add(m);
          const d = a() / Math.sqrt(m);
          const sinTheta = lambda() / (2 * d);
          if (sinTheta > 1) continue;
          const theta = Math.asin(sinTheta);
          // Multiplicity (rough): count permutations
          const mult = countPermutations(h, k, l);
          // Intensity ~ multiplicity * Lorentz-polarization
          const lp = (1 + Math.cos(2 * theta) ** 2) / (Math.sin(theta) ** 2 * Math.cos(theta));
          const intensity = mult * lp;
          list.push({ hkl: [h, k, l], d, theta, intensity });
        }
      }
    }
    // Normalize intensity to max
    const maxI = Math.max(...list.map(r => r.intensity), 1);
    return list.map(r => ({ ...r, intensity: r.intensity / maxI })).sort((a, b) => a.theta - b.theta);
  });

  const countPermutations = (h: number, k: number, l: number) => {
    const arr = [h, k, l].sort();
    if (arr[0] === arr[2]) return 6; // (h,h,h)
    if (arr[0] === arr[1] || arr[1] === arr[2]) return 24;
    return 48;
  };

  const W = 480, H = 220;
  const padL = 36, padR = 12, padT = 16, padB = 30;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const TWO_THETA_MAX = Math.PI; // up to 180°
  const tToX = (t: number) => padL + (t / TWO_THETA_MAX) * plotW;
  const iToY = (i: number) => padT + plotH - i * plotH;

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <For each={["sc", "bcc", "fcc"] as const}>
          {(k) => (
            <button
              onClick={() => setLatticeType(k)}
              class="px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase"
              style={{
                background: latticeType() === k ? ACCENT : "var(--bg-secondary)",
                color: latticeType() === k ? "white" : "var(--text-secondary)",
                border: `1px solid ${latticeType() === k ? ACCENT : "var(--border)"}`,
              }}
            >
              {k}
            </button>
          )}
        </For>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Slider label="Lattice constant a" value={a()} min={0.2} max={1.0} step={0.01} unit="nm" onInput={setA} />
        <Slider label="Wavelength λ" value={lambda()} min={0.05} max={0.3} step={0.005} unit="nm" onInput={setLambda} />
      </div>

      {/* Powder pattern */}
      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "260px" }}>
        <text x={W / 2} y={12} text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-secondary)">
          Powder pattern: intensity vs 2θ
        </text>
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--border)" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
        <text x={W / 2} y={H - 6} text-anchor="middle" font-size="10" fill="var(--text-muted)">2θ (degrees)</text>
        <For each={[30, 60, 90, 120, 150]}>
          {(deg) => (
            <>
              <line x1={tToX(deg * Math.PI / 180)} y1={H - padB} x2={tToX(deg * Math.PI / 180)} y2={H - padB + 3} stroke="var(--border)" />
              <text x={tToX(deg * Math.PI / 180)} y={H - padB + 12} text-anchor="middle" font-size="8" fill="var(--text-muted)">{deg}</text>
            </>
          )}
        </For>
        <For each={reflections()}>
          {(r) => (
            <>
              <line x1={tToX(2 * r.theta)} y1={iToY(r.intensity)} x2={tToX(2 * r.theta)} y2={H - padB} stroke={ACCENT} stroke-width="1.5" />
              <text x={tToX(2 * r.theta)} y={iToY(r.intensity) - 4} text-anchor="middle" font-size="7" fill={ACCENT}>
                ({r.hkl[0]}{r.hkl[1]}{r.hkl[2]})
              </text>
            </>
          )}
        </For>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="λ / 2a" value={(lambda() / (2 * a())).toFixed(3)} sub="< 1 for any reflection" color={ACCENT} />
        <StatCard label="# reflections" value={String(reflections().length)} color={ACCENT} />
        <StatCard label="First peak 2θ" value={reflections().length > 0 ? `${(2 * reflections()[0].theta * 180 / Math.PI).toFixed(1)}°` : "—"} color={ACCENT} />
        <StatCard label="d_min" value={`${(lambda() / 2).toFixed(3)} nm`} sub="resolvable spacing" color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        {"**Bragg's law** $n\\lambda = 2d_{hkl}\\sin\\theta$ predicts diffraction peaks when the path difference between scattering off adjacent lattice planes is an integer wavelength. The **structure factor** of the basis kills certain reflections: BCC requires $h+k+l$ even, FCC requires $h, k, l$ all even or all odd. Switching between SC, BCC, FCC removes peaks one by one — the chemical signature in real powder diffraction patterns."}
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SS3FermiGas — 3D free electron gas. Plot Fermi-Dirac occupation,
// chemical potential μ(T), and the Sommerfeld T² heat-capacity law.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const SS3FermiGas: Component = () => {
  const [TF, setTF] = createSignal(1.0); // Fermi temperature scale (kT_F = E_F = 1 in our units)
  const [T, setT] = createSignal(0.05); // T in T_F units
  const [view, setView] = createSignal<"distribution" | "specific-heat">("distribution");

  // Use natural units: E_F = 1, k_B = 1, so T is in units of T_F.
  // Density of states for 3D free electron gas: g(E) ∝ √E
  // f(E, T) = 1/(exp((E - μ)/T) + 1)
  // For T ≪ T_F, μ ≈ E_F · (1 - π²/12 · (T/T_F)²)

  const fFermi = (E: number, mu: number, T: number) => {
    if (T < 1e-4) return E < mu ? 1 : 0;
    return 1 / (Math.exp((E - mu) / T) + 1);
  };

  const muT = createMemo(() => {
    // Sommerfeld: μ(T) ≈ E_F (1 - π²/12 (T/T_F)²)
    return 1 - (Math.PI * Math.PI / 12) * Math.pow(T() / TF(), 2);
  });

  // Specific heat: C_v = π²/2 · N k_B (T/T_F)
  // Plot C_v vs T. Linear in T at low T (universal Fermi-gas result).
  const heatCurve = createMemo(() => {
    const pts: { T: number; cv: number }[] = [];
    for (let i = 0; i <= 100; i++) {
      const tt = (i / 100) * 0.5; // up to T = 0.5 T_F
      const cv = Math.PI * Math.PI / 2 * tt;
      // Above T_F: classical 3/2 limit
      const cvHigh = 1.5;
      const interp = cv / Math.sqrt(1 + Math.pow(cv / cvHigh, 4));
      pts.push({ T: tt, cv: interp });
    }
    return pts;
  });

  const W = 480, H = 240;
  const padL = 38, padR = 12, padT = 18, padB = 30;
  const plotW = W - padL - padR, plotH = H - padT - padB;

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <For each={["distribution", "specific-heat"] as const}>
          {(k) => (
            <button
              onClick={() => setView(k)}
              class="px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize"
              style={{
                background: view() === k ? ACCENT : "var(--bg-secondary)",
                color: view() === k ? "white" : "var(--text-secondary)",
                border: `1px solid ${view() === k ? ACCENT : "var(--border)"}`,
              }}
            >
              {k.replace("-", " ")}
            </button>
          )}
        </For>
      </div>

      <Slider label="Temperature T / T_F" value={T()} min={0.01} max={0.5} step={0.01} onInput={setT} />

      <Show when={view() === "distribution"}>
        <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "300px" }}>
          <text x={W / 2} y={12} text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-secondary)">
            Fermi-Dirac occupation f(E, T)
          </text>
          <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--border)" />
          <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
          <text x={padL - 4} y={padT + 6} text-anchor="end" font-size="9" fill="var(--text-muted)">1</text>
          <text x={padL - 4} y={H - padB} text-anchor="end" font-size="9" fill="var(--text-muted)">0</text>
          <text x={W / 2} y={H - 6} text-anchor="middle" font-size="10" fill="var(--text-muted)">E / E_F</text>
          <For each={[0, 0.5, 1.0, 1.5, 2.0]}>
            {(e) => (
              <>
                <line x1={padL + (e / 2) * plotW} y1={H - padB} x2={padL + (e / 2) * plotW} y2={H - padB + 3} stroke="var(--border)" />
                <text x={padL + (e / 2) * plotW} y={H - padB + 12} text-anchor="middle" font-size="8" fill="var(--text-muted)">{e}</text>
              </>
            )}
          </For>
          {/* μ marker */}
          <line x1={padL + (muT() / 2) * plotW} y1={padT} x2={padL + (muT() / 2) * plotW} y2={H - padB} stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 3" opacity="0.6" />
          <text x={padL + (muT() / 2) * plotW + 4} y={padT + 12} font-size="9" fill="#f59e0b">μ = {muT().toFixed(3)}</text>
          {/* T = 0 step (reference) */}
          <line x1={padL} y1={padT} x2={padL + 0.5 * plotW} y2={padT} stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="2 3" opacity="0.5" />
          <line x1={padL + 0.5 * plotW} y1={padT} x2={padL + 0.5 * plotW} y2={H - padB} stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="2 3" opacity="0.5" />
          <line x1={padL + 0.5 * plotW} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="2 3" opacity="0.5" />
          {/* Curve */}
          <polyline fill="none" stroke={ACCENT} stroke-width="2"
            points={Array.from({ length: 200 }, (_, i) => {
              const E = (i / 199) * 2;
              const f = fFermi(E, muT(), T());
              return `${padL + (E / 2) * plotW},${padT + plotH - f * plotH}`;
            }).join(" ")}
          />
        </svg>
      </Show>

      <Show when={view() === "specific-heat"}>
        <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "300px" }}>
          <text x={W / 2} y={12} text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-secondary)">
            Heat capacity C_v(T) — Sommerfeld linear law
          </text>
          <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--border)" />
          <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
          <text x={padL - 4} y={padT + 6} text-anchor="end" font-size="9" fill="var(--text-muted)">3/2 N k_B</text>
          <text x={padL - 4} y={H - padB} text-anchor="end" font-size="9" fill="var(--text-muted)">0</text>
          <text x={W / 2} y={H - 6} text-anchor="middle" font-size="10" fill="var(--text-muted)">T / T_F</text>
          <For each={[0.1, 0.2, 0.3, 0.4, 0.5]}>
            {(t) => (
              <>
                <line x1={padL + (t / 0.5) * plotW} y1={H - padB} x2={padL + (t / 0.5) * plotW} y2={H - padB + 3} stroke="var(--border)" />
                <text x={padL + (t / 0.5) * plotW} y={H - padB + 12} text-anchor="middle" font-size="8" fill="var(--text-muted)">{t}</text>
              </>
            )}
          </For>
          <polyline fill="none" stroke={ACCENT} stroke-width="2"
            points={heatCurve().map(p => `${padL + (p.T / 0.5) * plotW},${padT + plotH - (p.cv / 1.5) * plotH}`).join(" ")} />
          {/* Classical limit reference line */}
          <line x1={padL} y1={padT + plotH - (1.5 / 1.5) * plotH} x2={W - padR} y2={padT + plotH - (1.5 / 1.5) * plotH} stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="3 3" opacity="0.5" />
          <text x={W - padR - 4} y={padT + 14} text-anchor="end" font-size="8" fill="var(--text-muted)">classical 3/2 N k_B</text>
          {/* Current T */}
          <circle cx={padL + (T() / 0.5) * plotW}
            cy={padT + plotH - (Math.PI * Math.PI / 2 * T() / Math.sqrt(1 + Math.pow(Math.PI * Math.PI / 2 * T() / 1.5, 4)) / 1.5) * plotH}
            r="5" fill={ACCENT} stroke="white" stroke-width="1.5" />
        </svg>
      </Show>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="T / T_F" value={T().toFixed(3)} color={ACCENT} />
        <StatCard label="μ(T) / E_F" value={muT().toFixed(4)} sub="Sommerfeld correction" color={ACCENT} />
        <StatCard label="C_v / N k_B" value={(Math.PI * Math.PI / 2 * T()).toFixed(3)} sub="∝ T at low T" color={ACCENT} />
        <StatCard label="Width of step" value={`~ ${(2 * T()).toFixed(3)} E_F`} sub="thermal smear" color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        At $T = 0$ the **Fermi-Dirac distribution** is a perfect step at $E_F$. At finite $T \ll T_F$ the step softens over an energy width $\sim k_BT$ — only those electrons within $k_BT$ of $E_F$ can be excited. This is why metals have a **linear specific heat** $C_v \propto T$ rather than the classical $3Nk_B/2$: only a tiny fraction $\sim T/T_F$ of electrons participates. For copper $T_F \approx 8 \times 10^4$ K, so at room temperature the electronic $C_v$ is only ~1% of the classical value.
      </div>
    </div>
  );
};
