import { Component, createSignal, createMemo, For, Show } from "solid-js";

const ACCENT = "#7c3aed";

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
// G2FriedmannCosmology — integrate a(t) under Friedmann:
// (ȧ/a)² = H₀²(Ωr/a⁴ + Ωm/a³ + Ωk/a² + ΩΛ)
// Start at a=0.001 (early universe), integrate forward.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const G2FriedmannCosmology: Component = () => {
  const [Om, setOm] = createSignal(0.3);
  const [Ol, setOl] = createSignal(0.7);
  const [preset, setPreset] = createSignal<"LCDM" | "Einstein-deSitter" | "deSitter" | "Closed">("LCDM");

  const applyPreset = (p: typeof preset extends () => infer U ? U : never) => {
    setPreset(p);
    if (p === "LCDM") { setOm(0.315); setOl(0.685); }
    else if (p === "Einstein-deSitter") { setOm(1.0); setOl(0); }
    else if (p === "deSitter") { setOm(0.0); setOl(1.0); }
    else if (p === "Closed") { setOm(1.5); setOl(0.3); } // Ωk = -0.8
  };

  // Ωr fixed tiny; Ωk from closure
  const Or = 9e-5;
  const Ok = () => 1 - Om() - Ol() - Or;

  // Integrate a(t) using RK4. Units: t in Hubble times (H₀ t).
  const evolution = createMemo(() => {
    const pts: { t: number; a: number }[] = [];
    let a = 0.001, t = 0;
    pts.push({ t, a });
    const Hsq = (ax: number) => Or / Math.pow(ax, 4) + Om() / Math.pow(ax, 3) + Ok() / Math.pow(ax, 2) + Ol();
    const dadt = (ax: number) => ax * Math.sqrt(Math.max(0, Hsq(ax)));
    const dt = 0.005;
    for (let i = 0; i < 1000; i++) {
      if (a > 5) break;
      const k1 = dadt(a);
      const k2 = dadt(a + 0.5 * dt * k1);
      const k3 = dadt(a + 0.5 * dt * k2);
      const k4 = dadt(a + dt * k3);
      a += (dt / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
      t += dt;
      if (a < 0 || !isFinite(a)) break;
      pts.push({ t, a });
    }
    return pts;
  });

  // Age at a=1 (now) — linear interpolation
  const ageNow = createMemo(() => {
    const ev = evolution();
    for (let i = 1; i < ev.length; i++) {
      if (ev[i].a >= 1 && ev[i - 1].a < 1) {
        const frac = (1 - ev[i - 1].a) / (ev[i].a - ev[i - 1].a);
        return ev[i - 1].t + frac * (ev[i].t - ev[i - 1].t);
      }
    }
    return ev[ev.length - 1].t;
  });

  // Find when dark energy dominates: when Ωm/a³ = ΩΛ → a = (Ωm/ΩΛ)^(1/3)
  const aDomEq = () => (Ol() > 0 && Om() > 0 ? Math.pow(Om() / Ol(), 1 / 3) : null);

  const W = 480, H = 260;
  const padL = 38, padR = 12, padT = 16, padB = 28;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const T_MAX = 2.5, A_MAX = 4;
  const tToX = (tv: number) => padL + (Math.min(tv, T_MAX) / T_MAX) * plotW;
  const aToY = (av: number) => padT + plotH - Math.min(av, A_MAX) / A_MAX * plotH;

  return (
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <For each={["LCDM", "Einstein-deSitter", "deSitter", "Closed"] as const}>
          {(k) => (
            <button
              onClick={() => applyPreset(k)}
              class="px-3 py-1.5 rounded-lg text-[11px] font-semibold"
              style={{
                background: preset() === k ? ACCENT : "var(--bg-secondary)",
                color: preset() === k ? "white" : "var(--text-secondary)",
                border: `1px solid ${preset() === k ? ACCENT : "var(--border)"}`,
              }}
            >
              {k === "LCDM" ? "ΛCDM (our universe)" : k === "Einstein-deSitter" ? "Matter-only (EdS)" : k === "deSitter" ? "Λ-only (de Sitter)" : "Closed"}
            </button>
          )}
        </For>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Slider label="Ω_matter" value={Om()} min={0} max={2} step={0.01} onInput={(v) => { setOm(v); setPreset("LCDM"); }} />
        <Slider label="Ω_Λ" value={Ol()} min={0} max={1.5} step={0.01} onInput={(v) => { setOl(v); setPreset("LCDM"); }} />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "320px" }}>
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--border)" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
        <text x={padL - 22} y={padT + plotH / 2} text-anchor="middle" font-size="9" fill="var(--text-muted)" transform={`rotate(-90 ${padL - 22} ${padT + plotH / 2})`}>
          scale factor a(t)
        </text>
        <text x={W / 2} y={H - 6} text-anchor="middle" font-size="10" fill="var(--text-muted)">time t (Hubble units)</text>
        <text x={padL - 4} y={padT + 4} text-anchor="end" font-size="8" fill="var(--text-muted)">{A_MAX}</text>
        <text x={padL - 4} y={H - padB} text-anchor="end" font-size="8" fill="var(--text-muted)">0</text>
        {/* "Now" line at a=1 */}
        <line x1={padL} y1={aToY(1)} x2={W - padR} y2={aToY(1)} stroke="var(--text-muted)" stroke-dasharray="3 3" opacity="0.3" />
        <text x={W - padR - 4} y={aToY(1) - 4} text-anchor="end" font-size="8" fill="var(--text-muted)">a = 1 (today)</text>
        {/* Matter-Λ equality marker */}
        <Show when={aDomEq() && aDomEq()! < A_MAX}>
          <line x1={padL} y1={aToY(aDomEq()!)} x2={W - padR} y2={aToY(aDomEq()!)} stroke="#f59e0b" stroke-width="1" stroke-dasharray="2 3" opacity="0.4" />
        </Show>
        {/* a(t) curve */}
        <polyline fill="none" stroke={ACCENT} stroke-width="2.2"
          points={evolution().map(p => `${tToX(p.t)},${aToY(p.a)}`).join(" ")} />
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="Ω_m" value={Om().toFixed(3)} color={ACCENT} />
        <StatCard label="Ω_Λ" value={Ol().toFixed(3)} color={ACCENT} />
        <StatCard label="Ω_k (curvature)" value={Ok().toFixed(3)} sub={Ok() > 0.01 ? "open" : Ok() < -0.01 ? "closed" : "flat"} color={ACCENT} />
        <StatCard label="Age at a=1" value={`${ageNow().toFixed(2)} × 1/H₀`} sub="≈ 13.8 Gyr for ΛCDM" color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        The Friedmann equation $(\dot a/a)^2 = H_0^2[\Omega_r/a^4 + \Omega_m/a^3 + \Omega_k/a^2 + \Omega_\Lambda]$ traces the history of the universe in one line. Matter-only (EdS) gives $a \propto t^{2/3}$ — the universe slows forever; adding $\Omega_\Lambda$ produces late-time *acceleration* and pushes $a(t)$ to grow exponentially. Closing $\Omega_m + \Omega_\Lambda > 1$ produces a closed universe that recollapses.
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// G2CMBPeaks — schematic angular power spectrum C_ℓ showing acoustic
// peaks. Position of the first peak encodes curvature; odd/even ratio
// depends on Ω_b; overall amplitude on total matter. We use a rough
// fitting formula for the peaks (not a full Boltzmann code).
// Approximation: C_ℓ = Σ A_n · exp(-((ℓ - ℓ_n)/σ)²) with varying heights.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const G2CMBPeaks: Component = () => {
  const [Ob, setOb] = createSignal(0.049); // baryon density
  const [Om, setOm] = createSignal(0.315);
  const [Ok, setOk] = createSignal(0.0);

  // First peak position depends on sound horizon and geometry
  // In flat ΛCDM: ℓ_1 ≈ 220. For Ω_k > 0 (open) it shifts to larger ℓ (smaller angular scale);
  // Ω_k < 0 (closed) moves it to smaller ℓ.
  const l1 = () => 220 * (1 + 0.5 * Ok()); // schematic
  const peakL = (n: number) => l1() * n;

  // Heights: A_n ∝ A_0 · exp(-n/2) · (boost for odd/even from baryons)
  // Increase baryon fraction → odd peaks boosted, even suppressed
  const peakHeight = (n: number) => {
    const base = 5000 * Math.exp(-(n - 1) * 0.25);
    // Odd/even ratio modulation
    const baryonBoost = n % 2 === 1 ? 1 + 6 * (Ob() - 0.045) : 1 - 6 * (Ob() - 0.045);
    const matterBoost = 1 + 1.5 * (Om() - 0.315);
    return base * Math.max(0.2, baryonBoost * matterBoost);
  };

  const cl = createMemo(() => {
    const pts: { l: number; c: number }[] = [];
    // Sachs-Wolfe plateau at low l
    for (let l = 2; l <= 2500; l += 5) {
      let c = 0;
      // Low-l plateau
      c += 1500 / (1 + Math.pow(l / 30, 2));
      // Acoustic peaks
      for (let n = 1; n <= 6; n++) {
        const width = 40 + 10 * n;
        const peak = peakHeight(n) * Math.exp(-Math.pow((l - peakL(n)) / width, 2));
        c += peak;
      }
      // Silk damping at high l (exponential suppression above ℓ~1500)
      c *= Math.exp(-Math.pow(l / 1400, 4));
      pts.push({ l, c });
    }
    return pts;
  });

  const W = 480, H = 260;
  const padL = 40, padR = 12, padT = 16, padB = 30;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const L_MAX = 2500;
  const C_MAX = 7000;
  const lToX = (l: number) => padL + (l / L_MAX) * plotW;
  const cToY = (c: number) => padT + plotH - Math.min(c / C_MAX, 1) * plotH;

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Slider label="Ω_b (baryons)" value={Ob()} min={0.02} max={0.08} step={0.002} onInput={setOb} />
        <Slider label="Ω_m (matter)" value={Om()} min={0.15} max={0.5} step={0.01} onInput={setOm} />
        <Slider label="Ω_k (curvature)" value={Ok()} min={-0.3} max={0.3} step={0.01} onInput={setOk} />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "320px" }}>
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--border)" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
        <text x={padL - 24} y={padT + plotH / 2} text-anchor="middle" font-size="9" fill="var(--text-muted)" transform={`rotate(-90 ${padL - 24} ${padT + plotH / 2})`}>
          ℓ(ℓ+1)C_ℓ / 2π [µK²]
        </text>
        <text x={W / 2} y={H - 8} text-anchor="middle" font-size="10" fill="var(--text-muted)">multipole ℓ (angular scale)</text>
        <For each={[500, 1000, 1500, 2000, 2500]}>
          {(lv) => (
            <>
              <line x1={lToX(lv)} y1={H - padB} x2={lToX(lv)} y2={H - padB + 3} stroke="var(--border)" />
              <text x={lToX(lv)} y={H - padB + 12} text-anchor="middle" font-size="8" fill="var(--text-muted)">{lv}</text>
            </>
          )}
        </For>
        {/* Peak markers */}
        <For each={[1, 2, 3, 4, 5]}>
          {(n) => (
            <Show when={peakL(n) < L_MAX}>
              <line x1={lToX(peakL(n))} y1={padT} x2={lToX(peakL(n))} y2={H - padB} stroke={ACCENT} stroke-width="0.5" stroke-dasharray="2 3" opacity="0.3" />
              <text x={lToX(peakL(n))} y={padT + 10} text-anchor="middle" font-size="8" fill={ACCENT}>#{n}</text>
            </Show>
          )}
        </For>
        <polyline fill="none" stroke={ACCENT} stroke-width="2"
          points={cl().map(p => `${lToX(p.l)},${cToY(p.c)}`).join(" ")} />
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="1st peak ℓ₁" value={l1().toFixed(0)} sub={Ok() > 0.02 ? "open shift" : Ok() < -0.02 ? "closed shift" : "flat ≈ 220"} color={ACCENT} />
        <StatCard label="Peak 1 amplitude" value={peakHeight(1).toFixed(0)} sub="∝ 1/odd baryon boost" color={ACCENT} />
        <StatCard label="Peak 2 / Peak 1" value={(peakHeight(2) / peakHeight(1)).toFixed(2)} sub="sensitive to Ω_b" color={ACCENT} />
        <StatCard label="Silk cutoff" value="ℓ ≈ 1400" sub="photon diffusion damping" color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        The CMB angular power spectrum encodes acoustic oscillations in the photon-baryon fluid at recombination. The **first peak position** locks in the geometry — the observed $\ell_1 \approx 220$ means the universe is spatially flat to ~1%. The **odd/even peak-height ratio** fixes the baryon density ($\Omega_b \approx 0.049$); the **overall height** fixes the total matter density (giving $\Omega_m \approx 0.315$ and hence $\Omega_\Lambda \approx 0.68$).
      </div>
    </div>
  );
};
