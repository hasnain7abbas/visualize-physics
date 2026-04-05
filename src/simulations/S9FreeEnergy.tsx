import { Component, createSignal, createMemo, For } from "solid-js";

// ─── S9Helmholtz ───────────────────────────────────────────────────────────────
// Demonstrates F = E - TS for a two-level system
export const S9Helmholtz: Component = () => {
  const [temp, setTemp] = createSignal(1.0);
  const epsilon = 1; // energy gap

  const thermo = createMemo(() => {
    const T = temp();
    const beta = 1 / T;
    const Z = 1 + Math.exp(-beta * epsilon);
    const p1 = Math.exp(-beta * epsilon) / Z;
    const p0 = 1 / Z;
    const E = epsilon * p1;
    const S = -(p0 > 1e-15 ? p0 * Math.log(p0) : 0) - (p1 > 1e-15 ? p1 * Math.log(p1) : 0);
    const TS = T * S;
    const F = E - TS;
    return { Z, E, S, TS, F, p0, p1 };
  });

  // Curves: E, TS, F vs T
  const curves = createMemo(() => {
    const pts: { T: number; E: number; TS: number; F: number }[] = [];
    for (let i = 1; i <= 120; i++) {
      const T = (i / 120) * 5;
      const beta = 1 / T;
      const Z = 1 + Math.exp(-beta * epsilon);
      const p1 = Math.exp(-beta * epsilon) / Z;
      const p0 = 1 / Z;
      const E = epsilon * p1;
      const S = -(p0 > 1e-15 ? p0 * Math.log(p0) : 0) - (p1 > 1e-15 ? p1 * Math.log(p1) : 0);
      const TS = T * S;
      const F = E - TS;
      pts.push({ T, E, TS, F });
    }
    return pts;
  });

  // Plot range
  const plotW = 360, plotH = 150, ox = 50, oy = 170;
  const Tmax = 5;

  const yRange = createMemo(() => {
    let yMin = 0, yMax = 1;
    for (const p of curves()) {
      yMin = Math.min(yMin, p.F, p.E, p.TS);
      yMax = Math.max(yMax, p.F, p.E, p.TS);
    }
    const pad = (yMax - yMin) * 0.1 || 0.1;
    return { min: yMin - pad, max: yMax + pad };
  });

  const toX = (T: number) => ox + (T / Tmax) * plotW;
  const toY = (v: number) => oy - ((v - yRange().min) / (yRange().max - yRange().min)) * plotH;

  const makePath = (key: "E" | "TS" | "F") =>
    curves().map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.T).toFixed(1)},${toY(p[key]).toFixed(1)}`).join(" ");

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-3">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>T = {temp().toFixed(2)}</label>
        <input type="range" min="0.1" max="5" step="0.05" value={temp()} onInput={(e) => setTemp(parseFloat(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #059669 ${((temp() - 0.1) / 4.9) * 100}%, var(--border) ${((temp() - 0.1) / 4.9) * 100}%)` }}
        />
      </div>

      {/* E, TS, F vs T plot */}
      <svg width="100%" viewBox="0 0 430 200" class="mx-auto">
        <text x="215" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Helmholtz Free Energy: F = E - TS</text>

        {/* Axes */}
        <line x1={ox} y1={oy} x2={ox + plotW} y2={oy} stroke="var(--border)" stroke-width="1" />
        <line x1={ox} y1={oy} x2={ox} y2={oy - plotH} stroke="var(--border)" stroke-width="1" />
        <text x={ox + plotW / 2} y={oy + 22} text-anchor="middle" font-size="9" fill="var(--text-muted)">Temperature T</text>
        <text x={ox - 30} y={oy - plotH / 2} text-anchor="middle" font-size="9" fill="var(--text-muted)" transform={`rotate(-90 ${ox - 30} ${oy - plotH / 2})`}>Energy</text>

        {/* Zero line */}
        {yRange().min < 0 && yRange().max > 0 && (
          <line x1={ox} y1={toY(0)} x2={ox + plotW} y2={toY(0)} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
        )}

        {/* Curves */}
        <path d={makePath("E")} fill="none" stroke="#ef4444" stroke-width="2.5" />
        <path d={makePath("TS")} fill="none" stroke="#3b82f6" stroke-width="2.5" />
        <path d={makePath("F")} fill="none" stroke="#10b981" stroke-width="2.5" />

        {/* Current T markers */}
        <line x1={toX(temp())} y1={oy - plotH} x2={toX(temp())} y2={oy} stroke="var(--text-muted)" stroke-width="0.8" stroke-dasharray="2 2" />
        <circle cx={toX(temp())} cy={toY(thermo().E)} r="4" fill="#ef4444" stroke="white" stroke-width="1.5" />
        <circle cx={toX(temp())} cy={toY(thermo().TS)} r="4" fill="#3b82f6" stroke="white" stroke-width="1.5" />
        <circle cx={toX(temp())} cy={toY(thermo().F)} r="4" fill="#10b981" stroke="white" stroke-width="1.5" />

        {/* Legend */}
        <line x1="320" y1="30" x2="340" y2="30" stroke="#ef4444" stroke-width="2" />
        <text x="344" y="33" font-size="8" fill="#ef4444">E (energy)</text>
        <line x1="320" y1="42" x2="340" y2="42" stroke="#3b82f6" stroke-width="2" />
        <text x="344" y="45" font-size="8" fill="#3b82f6">TS (entropy)</text>
        <line x1="320" y1="54" x2="340" y2="54" stroke="#10b981" stroke-width="2" />
        <text x="344" y="57" font-size="8" fill="#10b981">F (free energy)</text>
      </svg>

      {/* Two-level system diagram */}
      <svg width="100%" viewBox="0 0 430 70" class="mx-auto">
        <text x="50" y="14" font-size="9" font-weight="600" fill="var(--text-muted)">Two-level system</text>
        {/* Ground state */}
        <line x1="80" y1="55" x2="160" y2="55" stroke="#3b82f6" stroke-width="2" />
        <text x="170" y="58" font-size="8" fill="var(--text-secondary)">E=0, p={thermo().p0.toFixed(3)}</text>
        {/* Excited state */}
        <line x1="80" y1="25" x2="160" y2="25" stroke="#ef4444" stroke-width="2" />
        <text x="170" y="28" font-size="8" fill="var(--text-secondary)">E=epsilon, p={thermo().p1.toFixed(3)}</text>
        {/* Arrow */}
        <line x1="120" y1="52" x2="120" y2="28" stroke="var(--text-muted)" stroke-width="1" marker-end="url(#arrowH)" />
        <defs><marker id="arrowH" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="var(--text-muted)" /></marker></defs>
        <text x="108" y="43" font-size="7" fill="var(--text-muted)">epsilon</text>
        {/* Population bars */}
        <rect x="290" y={55 - thermo().p0 * 40} width="30" height={thermo().p0 * 40} rx="2" fill="#3b82f6" opacity="0.5" />
        <rect x="330" y={55 - thermo().p1 * 40} width="30" height={thermo().p1 * 40} rx="2" fill="#ef4444" opacity="0.5" />
        <text x="305" y="64" text-anchor="middle" font-size="7" fill="var(--text-muted)">p0</text>
        <text x="345" y="64" text-anchor="middle" font-size="7" fill="var(--text-muted)">p1</text>
      </svg>

      {/* Thermodynamic values */}
      <div class="grid grid-cols-5 gap-2 text-center">
        {[
          { label: "Z", val: thermo().Z.toFixed(4), color: "#059669" },
          { label: "E", val: thermo().E.toFixed(4), color: "#ef4444" },
          { label: "S / kB", val: thermo().S.toFixed(4), color: "#8b5cf6" },
          { label: "TS", val: thermo().TS.toFixed(4), color: "#3b82f6" },
          { label: "F", val: thermo().F.toFixed(4), color: "#10b981" },
        ].map((item) => (
          <div class="card p-2">
            <div class="text-[9px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{item.label}</div>
            <div class="text-sm font-bold" style={{ color: item.color }}>{item.val}</div>
          </div>
        ))}
      </div>

      <div class="text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
        {temp() < 0.5 ? "Low T: F ~ E (energy dominates, system in ground state)" :
         temp() > 3.0 ? "High T: F ~ -TS (entropy dominates, states equally populated)" :
         "Intermediate T: competition between energy and entropy"}
      </div>
    </div>
  );
};

// ─── S9VanDerWaals ─────────────────────────────────────────────────────────────
// Van der Waals equation of state with Maxwell construction
export const S9VanDerWaals: Component = () => {
  const [tStar, setTStar] = createSignal(0.9);   // T/Tc
  const [aParam, setAParam] = createSignal(1.5);
  const [bParam, setBParam] = createSignal(0.3);

  // Reduced van der Waals: P* = 8T*/(3V*-1) - 3/V*^2
  const vdwPressure = (Vs: number, Ts: number) => {
    if (3 * Vs - 1 <= 0.01) return NaN;
    return (8 * Ts) / (3 * Vs - 1) - 3 / (Vs * Vs);
  };

  // Generate isotherm
  const makeIsotherm = (Ts: number) => {
    const pts: { V: number; P: number }[] = [];
    for (let i = 0; i <= 200; i++) {
      const V = 0.4 + (i / 200) * 5.6;
      const P = vdwPressure(V, Ts);
      if (!isNaN(P)) pts.push({ V, P });
    }
    return pts;
  };

  // Maxwell construction: find equal-area pressure for subcritical isotherms
  const maxwellConstruction = (Ts: number) => {
    if (Ts >= 1.0) return null;
    // Find the local min and max of P(V) to identify the loop
    const pts = makeIsotherm(Ts);
    let Pmin = Infinity, Pmax = -Infinity;
    let Vmin = 0, Vmax = 0;
    for (let i = 1; i < pts.length - 1; i++) {
      if (pts[i].P < pts[i - 1].P && pts[i].P < pts[i + 1].P && pts[i].V < 2) {
        Pmin = pts[i].P; Vmin = pts[i].V;
      }
      if (pts[i].P > pts[i - 1].P && pts[i].P > pts[i + 1].P && pts[i].V < 2) {
        Pmax = pts[i].P; Vmax = pts[i].V;
      }
    }
    if (Pmin >= Pmax || Vmin >= Vmax) return null;

    // Bisection to find P_maxwell where areas above and below are equal
    let Plo = Math.max(Pmin, 0), Phi = Pmax;
    let Pmx = (Plo + Phi) / 2;
    for (let iter = 0; iter < 60; iter++) {
      Pmx = (Plo + Phi) / 2;
      // Find intersections of P = Pmx with the isotherm
      const crossings: number[] = [];
      for (let i = 0; i < pts.length - 1; i++) {
        if ((pts[i].P - Pmx) * (pts[i + 1].P - Pmx) <= 0) {
          const frac = (Pmx - pts[i].P) / (pts[i + 1].P - pts[i].P);
          crossings.push(pts[i].V + frac * (pts[i + 1].V - pts[i].V));
        }
      }
      if (crossings.length < 3) break;
      const Vl = crossings[0], Vr = crossings[crossings.length - 1];
      // Integral of (P(V) - Pmx) dV from Vl to Vr should be zero
      let area = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        if (pts[i].V >= Vl && pts[i + 1].V <= Vr) {
          const dV = pts[i + 1].V - pts[i].V;
          const Pavg = (pts[i].P + pts[i + 1].P) / 2;
          area += (Pavg - Pmx) * dV;
        }
      }
      if (area > 0) Plo = Pmx; else Phi = Pmx;
    }
    // Find final crossing volumes
    const crossings: number[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      if ((pts[i].P - Pmx) * (pts[i + 1].P - Pmx) <= 0) {
        const frac = (Pmx - pts[i].P) / (pts[i + 1].P - Pmx + pts[i].P - Pmx || 1);
        crossings.push(pts[i].V + Math.abs(frac) * (pts[i + 1].V - pts[i].V));
      }
    }
    if (crossings.length >= 2) {
      return { P: Pmx, Vl: crossings[0], Vr: crossings[crossings.length - 1] };
    }
    return null;
  };

  // Isotherms to draw
  const isotherms = createMemo(() => {
    const temps = [0.8, 0.9, 1.0, 1.1, 1.2];
    // Also include the slider value if it's not close to one of these
    const t = tStar();
    let hasSlider = false;
    for (const tt of temps) if (Math.abs(tt - t) < 0.05) hasSlider = true;
    const all = hasSlider ? temps : [...temps, t].sort((a, b) => a - b);
    return all.map((Ts) => ({
      Ts,
      pts: makeIsotherm(Ts),
      maxwell: maxwellConstruction(Ts),
      isSlider: Math.abs(Ts - t) < 0.05 || Ts === t,
    }));
  });

  // Critical point values
  const criticalInfo = createMemo(() => {
    const a = aParam(), b = bParam();
    const Tc = (8 * a) / (27 * b);
    const Pc = a / (27 * b * b);
    const Vc = 3 * b;
    return { Tc: Tc.toFixed(3), Pc: Pc.toFixed(3), Vc: Vc.toFixed(3) };
  });

  // Plot dimensions
  const plotOx = 50, plotOy = 230, plotW = 360, plotH = 200;
  const Vmin = 0.4, Vmax = 6, Pmin = -0.5, Pmax = 3.5;

  const toX = (V: number) => plotOx + ((V - Vmin) / (Vmax - Vmin)) * plotW;
  const toY = (P: number) => plotOy - ((P - Pmin) / (Pmax - Pmin)) * plotH;

  const colorForT = (Ts: number) => {
    const frac = Math.max(0, Math.min(1, (Ts - 0.7) / 0.6));
    const r = Math.round(50 + frac * 200);
    const g = Math.round(100 - frac * 60);
    const b = Math.round(220 - frac * 180);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-3 gap-4">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "65px" }}>T* = {tStar().toFixed(2)}</label>
          <input type="range" min="0.5" max="2.0" step="0.01" value={tStar()} onInput={(e) => setTStar(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #059669 ${((tStar() - 0.5) / 1.5) * 100}%, var(--border) ${((tStar() - 0.5) / 1.5) * 100}%)` }}
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "50px" }}>a = {aParam().toFixed(1)}</label>
          <input type="range" min="0.5" max="3" step="0.1" value={aParam()} onInput={(e) => setAParam(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #8b5cf6 ${((aParam() - 0.5) / 2.5) * 100}%, var(--border) ${((aParam() - 0.5) / 2.5) * 100}%)` }}
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "50px" }}>b = {bParam().toFixed(2)}</label>
          <input type="range" min="0.1" max="0.5" step="0.01" value={bParam()} onInput={(e) => setBParam(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #f59e0b ${((bParam() - 0.1) / 0.4) * 100}%, var(--border) ${((bParam() - 0.1) / 0.4) * 100}%)` }}
          />
        </div>
      </div>

      {/* P-V diagram */}
      <svg width="100%" viewBox="0 0 430 260" class="mx-auto">
        <text x="215" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">Van der Waals Isotherms (Reduced Coordinates)</text>

        {/* Axes */}
        <line x1={plotOx} y1={plotOy} x2={plotOx + plotW} y2={plotOy} stroke="var(--border)" stroke-width="1" />
        <line x1={plotOx} y1={plotOy} x2={plotOx} y2={plotOy - plotH} stroke="var(--border)" stroke-width="1" />
        <text x={plotOx + plotW / 2} y={plotOy + 22} text-anchor="middle" font-size="9" fill="var(--text-muted)">V* (reduced volume)</text>
        <text x={plotOx - 30} y={plotOy - plotH / 2} text-anchor="middle" font-size="9" fill="var(--text-muted)" transform={`rotate(-90 ${plotOx - 30} ${plotOy - plotH / 2})`}>P* (reduced pressure)</text>

        {/* P=0 line */}
        <line x1={plotOx} y1={toY(0)} x2={plotOx + plotW} y2={toY(0)} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
        <text x={plotOx - 5} y={toY(0) + 3} text-anchor="end" font-size="7" fill="var(--text-muted)">0</text>

        {/* V-axis labels */}
        <For each={[1, 2, 3, 4, 5]}>
          {(v) => (
            <>
              <line x1={toX(v)} y1={plotOy} x2={toX(v)} y2={plotOy + 4} stroke="var(--border)" stroke-width="0.5" />
              <text x={toX(v)} y={plotOy + 12} text-anchor="middle" font-size="7" fill="var(--text-muted)">{v}</text>
            </>
          )}
        </For>

        {/* Isotherms */}
        <For each={isotherms()}>
          {(iso) => {
            const color = colorForT(iso.Ts);
            const pathData = iso.pts
              .filter((p) => p.P >= Pmin - 0.5 && p.P <= Pmax + 0.5)
              .map((p, i) => {
                const py = Math.max(plotOy - plotH - 5, Math.min(plotOy + 5, toY(p.P)));
                return `${i === 0 ? "M" : "L"}${toX(p.V).toFixed(1)},${py.toFixed(1)}`;
              }).join(" ");
            return (
              <>
                <path d={pathData} fill="none" stroke={color}
                  stroke-width={iso.isSlider ? "2.5" : "1.5"}
                  opacity={iso.isSlider ? "1" : "0.5"}
                />
                {/* Label */}
                <text x={toX(5.8)} y={toY(vdwPressure(5.5, iso.Ts))}
                  font-size="7" fill={color}>{iso.Ts.toFixed(1)}Tc</text>

                {/* Maxwell construction for subcritical */}
                {iso.maxwell && (
                  <>
                    {/* Horizontal tie line */}
                    <line x1={toX(iso.maxwell.Vl)} y1={toY(iso.maxwell.P)}
                      x2={toX(iso.maxwell.Vr)} y2={toY(iso.maxwell.P)}
                      stroke={color} stroke-width={iso.isSlider ? "2" : "1"}
                      stroke-dasharray="4 2" />
                    {/* Coexistence shading */}
                    {iso.isSlider && (
                      <rect x={toX(iso.maxwell.Vl)}
                        y={toY(iso.maxwell.P) - 2}
                        width={toX(iso.maxwell.Vr) - toX(iso.maxwell.Vl)}
                        height="4" rx="1"
                        fill={color} opacity="0.2" />
                    )}
                  </>
                )}
              </>
            );
          }}
        </For>

        {/* Critical point marker (V*=1, P*=1) */}
        <circle cx={toX(1)} cy={toY(1)} r="5" fill="#059669" stroke="white" stroke-width="2" />
        <text x={toX(1) + 8} y={toY(1) - 5} font-size="8" font-weight="600" fill="#059669">CP</text>
      </svg>

      {/* Critical point info */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-2">
          <div class="text-[9px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Tc = 8a/27b</div>
          <div class="text-sm font-bold" style={{ color: "#059669" }}>{criticalInfo().Tc}</div>
        </div>
        <div class="card p-2">
          <div class="text-[9px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Pc = a/27b^2</div>
          <div class="text-sm font-bold" style={{ color: "#059669" }}>{criticalInfo().Pc}</div>
        </div>
        <div class="card p-2">
          <div class="text-[9px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Vc = 3b</div>
          <div class="text-sm font-bold" style={{ color: "#059669" }}>{criticalInfo().Vc}</div>
        </div>
      </div>

      <div class="text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
        {tStar() < 1.0
          ? "Below Tc: VdW loop appears. Dashed line = Maxwell construction (liquid-gas coexistence)."
          : tStar() > 1.02
            ? "Above Tc: supercritical fluid, no phase transition."
            : "Near critical point: isotherms flatten, compressibility diverges."}
      </div>
    </div>
  );
};

// ─── S9PhaseDiagram ────────────────────────────────────────────────────────────
// Generic P-T phase diagram with solid, liquid, gas regions
export const S9PhaseDiagram: Component = () => {
  const [tempPos, setTempPos] = createSignal(0.5);   // normalized 0-1
  const [pressPos, setPressPos] = createSignal(0.5);  // normalized 0-1
  const [flashOpacity, setFlashOpacity] = createSignal(0);
  const [prevPhase, setPrevPhase] = createSignal("");

  // Key points in normalized coordinates
  const Ttr = 0.3, Ptr = 0.1;     // triple point
  const Tc = 0.75, Pc = 0.85;     // critical point

  // Phase boundary curves
  const solidGasCurve = (T: number) => Ptr * Math.exp(25 * (T / Ttr - 1));  // sublimation
  const liquidGasCurve = (T: number) => {
    // Interpolate from triple point to critical point along a curve
    if (T <= Ttr) return Ptr;
    if (T >= Tc) return Pc;
    const frac = (T - Ttr) / (Tc - Ttr);
    return Ptr + (Pc - Ptr) * (1 - Math.pow(1 - frac, 1.8));
  };
  const solidLiquidCurve = (P: number) => {
    // Nearly vertical line: T as function of P, slight positive slope
    if (P < Ptr) return Ttr;
    return Ttr + 0.03 * (P - Ptr);
  };
  // Inverse: P as function of T for solid-liquid
  const solidLiquidP = (T: number) => {
    if (T < Ttr) return 10; // off chart
    return Ptr + (T - Ttr) / 0.03;
  };

  // Determine current phase
  const currentPhase = createMemo(() => {
    const T = tempPos();
    const P = pressPos();

    // Sublimation boundary
    const Psub = solidGasCurve(T);
    // Vaporization boundary
    const Pvap = liquidGasCurve(T);
    // Fusion boundary (solid-liquid)
    const Pfus = solidLiquidP(T);

    if (T < Ttr) {
      // Left of triple point: solid above sublimation, gas below
      return P > Psub ? "Solid" : "Gas";
    }
    if (T >= Ttr && T <= Tc) {
      // Between triple and critical point
      if (P > Pfus) return "Solid";
      if (P > Pvap) return "Liquid";
      return "Gas";
    }
    // Beyond critical point
    if (P > Pfus) return "Solid";
    // Above Tc + right of CP, supercritical
    if (P > Pc) return "Supercritical";
    return "Gas";
  });

  // Flash effect on phase change
  const checkPhaseChange = () => {
    const phase = currentPhase();
    if (prevPhase() !== "" && prevPhase() !== phase) {
      setFlashOpacity(0.6);
      setTimeout(() => setFlashOpacity(0.3), 80);
      setTimeout(() => setFlashOpacity(0.1), 160);
      setTimeout(() => setFlashOpacity(0), 250);
    }
    setPrevPhase(phase);
  };

  // Plot dimensions
  const ox = 50, oy = 260, pw = 340, ph = 230;
  const toX = (T: number) => ox + T * pw;
  const toY = (P: number) => oy - P * ph;

  // Build curve paths
  const sublimationPath = createMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const T = (i / 40) * Ttr;
      const P = solidGasCurve(T);
      if (P >= 0 && P <= 1.05) pts.push(`${pts.length === 0 ? "M" : "L"}${toX(T).toFixed(1)},${toY(P).toFixed(1)}`);
    }
    return pts.join(" ");
  });

  const vaporizationPath = createMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const T = Ttr + (i / 60) * (Tc - Ttr);
      const P = liquidGasCurve(T);
      pts.push(`${pts.length === 0 ? "M" : "L"}${toX(T).toFixed(1)},${toY(P).toFixed(1)}`);
    }
    return pts.join(" ");
  });

  const fusionPath = createMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const P = Ptr + (i / 40) * (1.05 - Ptr);
      const T = solidLiquidCurve(P);
      pts.push(`${pts.length === 0 ? "M" : "L"}${toX(T).toFixed(1)},${toY(P).toFixed(1)}`);
    }
    return pts.join(" ");
  });

  // Region coloring polygons
  const gasRegion = createMemo(() => {
    // Below sublimation + vaporization curves, right side
    const pts: string[] = [];
    // Bottom-left
    pts.push(`${toX(0)},${toY(0)}`);
    // Along sublimation curve from T=0 to T=Ttr
    for (let i = 0; i <= 30; i++) {
      const T = (i / 30) * Ttr;
      const P = Math.min(solidGasCurve(T), 1.05);
      pts.push(`${toX(T).toFixed(1)},${toY(P).toFixed(1)}`);
    }
    // Along vaporization from Ttr to Tc
    for (let i = 0; i <= 30; i++) {
      const T = Ttr + (i / 30) * (Tc - Ttr);
      const P = liquidGasCurve(T);
      pts.push(`${toX(T).toFixed(1)},${toY(P).toFixed(1)}`);
    }
    // Right along bottom from Tc to 1
    pts.push(`${toX(1)},${toY(Pc)}`);
    pts.push(`${toX(1)},${toY(0)}`);
    return pts.join(" ");
  });

  const liquidRegion = createMemo(() => {
    const pts: string[] = [];
    // Triple point
    pts.push(`${toX(Ttr).toFixed(1)},${toY(Ptr).toFixed(1)}`);
    // Along vaporization curve to CP
    for (let i = 0; i <= 30; i++) {
      const T = Ttr + (i / 30) * (Tc - Ttr);
      const P = liquidGasCurve(T);
      pts.push(`${toX(T).toFixed(1)},${toY(P).toFixed(1)}`);
    }
    // Up to top at CP x
    pts.push(`${toX(Tc).toFixed(1)},${toY(1.05)}`);
    // Along top to fusion line x at top
    const Ttop = solidLiquidCurve(1.05);
    pts.push(`${toX(Ttop).toFixed(1)},${toY(1.05)}`);
    // Down fusion line to triple point
    for (let i = 30; i >= 0; i--) {
      const P = Ptr + (i / 30) * (1.05 - Ptr);
      const T = solidLiquidCurve(P);
      pts.push(`${toX(T).toFixed(1)},${toY(P).toFixed(1)}`);
    }
    return pts.join(" ");
  });

  const solidRegion = createMemo(() => {
    const pts: string[] = [];
    // Top-left corner
    pts.push(`${toX(0)},${toY(1.05)}`);
    // Down left edge
    pts.push(`${toX(0)},${toY(0)}`);
    // Along bottom to sublimation start (effectively T=0)
    // Actually: along sublimation curve upward
    for (let i = 0; i <= 30; i++) {
      const T = (i / 30) * Ttr;
      const P = Math.min(solidGasCurve(T), 1.05);
      pts.push(`${toX(T).toFixed(1)},${toY(P).toFixed(1)}`);
    }
    // Along fusion line upward
    for (let i = 0; i <= 30; i++) {
      const P = Ptr + (i / 30) * (1.05 - Ptr);
      const T = solidLiquidCurve(P);
      pts.push(`${toX(T).toFixed(1)},${toY(P).toFixed(1)}`);
    }
    // Top to top-left
    const Ttop = solidLiquidCurve(1.05);
    pts.push(`${toX(Ttop).toFixed(1)},${toY(1.05)}`);
    return pts.join(" ");
  });

  const phaseColor = () => {
    const p = currentPhase();
    if (p === "Solid") return "#60a5fa";
    if (p === "Liquid") return "#06b6d4";
    if (p === "Gas") return "#fbbf24";
    return "#a78bfa"; // supercritical
  };

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>T = {tempPos().toFixed(2)}</label>
          <input type="range" min="0.02" max="0.98" step="0.005" value={tempPos()}
            onInput={(e) => { setTempPos(parseFloat(e.currentTarget.value)); checkPhaseChange(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #059669 ${((tempPos() - 0.02) / 0.96) * 100}%, var(--border) ${((tempPos() - 0.02) / 0.96) * 100}%)` }}
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>P = {pressPos().toFixed(2)}</label>
          <input type="range" min="0.02" max="0.98" step="0.005" value={pressPos()}
            onInput={(e) => { setPressPos(parseFloat(e.currentTarget.value)); checkPhaseChange(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #059669 ${((pressPos() - 0.02) / 0.96) * 100}%, var(--border) ${((pressPos() - 0.02) / 0.96) * 100}%)` }}
          />
        </div>
      </div>

      {/* Phase diagram SVG */}
      <svg width="100%" viewBox="0 0 430 290" class="mx-auto">
        <text x="215" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">P-T Phase Diagram</text>

        {/* Axes */}
        <line x1={ox} y1={oy} x2={ox + pw} y2={oy} stroke="var(--border)" stroke-width="1" />
        <line x1={ox} y1={oy} x2={ox} y2={oy - ph} stroke="var(--border)" stroke-width="1" />
        <text x={ox + pw / 2} y={oy + 22} text-anchor="middle" font-size="9" fill="var(--text-muted)">Temperature</text>
        <text x={ox - 30} y={oy - ph / 2} text-anchor="middle" font-size="9" fill="var(--text-muted)" transform={`rotate(-90 ${ox - 30} ${oy - ph / 2})`}>Pressure</text>

        {/* Phase region fills */}
        <polygon points={solidRegion()} fill="#bfdbfe" opacity="0.25" />
        <polygon points={liquidRegion()} fill="#a5f3fc" opacity="0.25" />
        <polygon points={gasRegion()} fill="#fef9c3" opacity="0.25" />

        {/* Region labels */}
        <text x={toX(0.12)} y={toY(0.6)} text-anchor="middle" font-size="13" font-weight="700" fill="#60a5fa" opacity="0.6">Solid</text>
        <text x={toX(0.52)} y={toY(0.65)} text-anchor="middle" font-size="13" font-weight="700" fill="#06b6d4" opacity="0.6">Liquid</text>
        <text x={toX(0.65)} y={toY(0.15)} text-anchor="middle" font-size="13" font-weight="700" fill="#d97706" opacity="0.6">Gas</text>
        <text x={toX(0.88)} y={toY(0.92)} text-anchor="middle" font-size="9" font-weight="600" fill="#8b5cf6" opacity="0.5">Supercritical</text>

        {/* Phase boundary curves */}
        <path d={sublimationPath()} fill="none" stroke="#059669" stroke-width="2.5" />
        <path d={vaporizationPath()} fill="none" stroke="#059669" stroke-width="2.5" />
        <path d={fusionPath()} fill="none" stroke="#059669" stroke-width="2.5" />

        {/* Boundary labels */}
        <text x={toX(0.12)} y={toY(0.02) + 3} text-anchor="middle" font-size="7" fill="#059669" font-style="italic">Sublimation</text>
        <text x={toX(0.58)} y={toY(liquidGasCurve(0.58)) + 12} text-anchor="middle" font-size="7" fill="#059669" font-style="italic">Vaporization</text>
        <text x={toX(solidLiquidCurve(0.7)) - 14} y={toY(0.7)} text-anchor="middle" font-size="7" fill="#059669" font-style="italic"
          transform={`rotate(-85 ${toX(solidLiquidCurve(0.7)) - 14} ${toY(0.7)})`}>Fusion</text>

        {/* Triple point */}
        <circle cx={toX(Ttr)} cy={toY(Ptr)} r="5" fill="#f59e0b" stroke="white" stroke-width="2" />
        <text x={toX(Ttr) + 8} y={toY(Ptr) + 4} font-size="8" font-weight="600" fill="#f59e0b">Triple Pt</text>

        {/* Critical point */}
        <circle cx={toX(Tc)} cy={toY(Pc)} r="5" fill="#ef4444" stroke="white" stroke-width="2" />
        <text x={toX(Tc) + 8} y={toY(Pc) - 5} font-size="8" font-weight="600" fill="#ef4444">Critical Pt</text>

        {/* Flash effect on phase transition */}
        {flashOpacity() > 0 && (
          <rect x={ox} y={oy - ph} width={pw} height={ph}
            fill={phaseColor()} opacity={flashOpacity()} rx="4" />
        )}

        {/* User position dot */}
        <circle cx={toX(tempPos())} cy={toY(pressPos())} r="7"
          fill={phaseColor()} stroke="white" stroke-width="2.5" />
        <circle cx={toX(tempPos())} cy={toY(pressPos())} r="3"
          fill="white" />
      </svg>

      {/* Phase info */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Current Phase</div>
          <div class="text-lg font-bold" style={{ color: phaseColor() }}>{currentPhase()}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Triple Point</div>
          <div class="text-xs font-bold" style={{ color: "#f59e0b" }}>T={Ttr}, P={Ptr}</div>
          <div class="text-[9px]" style={{ color: "var(--text-muted)" }}>All three phases coexist</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Critical Point</div>
          <div class="text-xs font-bold" style={{ color: "#ef4444" }}>T={Tc}, P={Pc}</div>
          <div class="text-[9px]" style={{ color: "var(--text-muted)" }}>Liquid-gas distinction vanishes</div>
        </div>
      </div>

      <div class="text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
        Drag the sliders to move through the phase diagram. A flash indicates a phase transition.
      </div>
    </div>
  );
};
