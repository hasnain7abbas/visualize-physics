import { Component, createSignal, createMemo, onCleanup, For } from "solid-js";

const ACCENT = "#ef4444";
const HOT = "#ef4444";
const COLD = "#3b82f6";
const ADIABATIC = "#a855f7";
const ISOBARIC = "#10b981";

// ─── S11IsothermalAdiabatic ──────────────────────────────────────────────────
// Interactive PV diagram showing isothermal and adiabatic processes for an ideal gas.
// Physics: Isothermal: PV = nRT (const T), Adiabatic: PV^γ = const
export const S11IsothermalAdiabatic: Component = () => {
  const [temperature, setTemperature] = createSignal(400); // K
  const [gamma, setGamma] = createSignal(1.4); // heat capacity ratio
  const [processType, setProcessType] = createSignal<"isothermal" | "adiabatic" | "both">("both");
  const [markerV, setMarkerV] = createSignal(3); // volume position for readout

  const nR = 1; // nR constant for scaling
  const Vmin = 0.8, Vmax = 8;

  // Isothermal curve: P = nRT / V
  const isoCurve = createMemo(() => {
    const T = temperature();
    const pts: { V: number; P: number }[] = [];
    for (let i = 0; i <= 120; i++) {
      const V = Vmin + (i / 120) * (Vmax - Vmin);
      pts.push({ V, P: nR * T / V });
    }
    return pts;
  });

  // Adiabatic curve: PV^γ = P₀V₀^γ, starting from V=1,T on the isothermal
  const adiaCurve = createMemo(() => {
    const T = temperature();
    const g = gamma();
    const V0 = 1.5;
    const P0 = nR * T / V0;
    const C = P0 * Math.pow(V0, g);
    const pts: { V: number; P: number }[] = [];
    for (let i = 0; i <= 120; i++) {
      const V = Vmin + (i / 120) * (Vmax - Vmin);
      pts.push({ V, P: C / Math.pow(V, g) });
    }
    return pts;
  });

  // Chart dimensions
  const W = 440, H = 240;
  const pad = { l: 55, r: 15, t: 25, b: 35 };

  const Pmax = createMemo(() => {
    const allPts = [...isoCurve(), ...adiaCurve()];
    return Math.max(...allPts.map(p => p.P)) * 1.05;
  });
  const Pmin_chart = 0;

  const toSVG = (V: number, P: number) => ({
    x: pad.l + ((V - Vmin) / (Vmax - Vmin)) * (W - pad.l - pad.r),
    y: pad.t + ((Pmax() - P) / (Pmax() - Pmin_chart)) * (H - pad.t - pad.b),
  });

  const curvePath = (pts: { V: number; P: number }[]) =>
    pts.map((p, i) => {
      const { x, y } = toSVG(p.V, p.P);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

  // Readouts at marker position
  const isoP = createMemo(() => nR * temperature() / markerV());
  const adiaP = createMemo(() => {
    const V0 = 1.5, P0 = nR * temperature() / V0;
    const C = P0 * Math.pow(V0, gamma());
    return C / Math.pow(markerV(), gamma());
  });

  // Work done (isothermal): W = nRT ln(V2/V1)
  const isoWork = createMemo(() => nR * temperature() * Math.log(markerV() / 1.5));

  const tPct = () => ((temperature() - 200) / 600) * 100;
  const gPct = () => ((gamma() - 1.1) / 0.6) * 100;
  const vPct = () => ((markerV() - 1) / 6) * 100;

  return (
    <div class="space-y-5">
      {/* Controls */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Temperature T = {temperature()} K</label>
          <input type="range" min="200" max="800" step="10" value={temperature()} onInput={(e) => setTemperature(parseInt(e.currentTarget.value))}
            class="w-full h-2 rounded-full appearance-none cursor-pointer mt-1"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${tPct()}%, var(--border) ${tPct()}%)` }} />
        </div>
        <div>
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{"\u03B3"} = {gamma().toFixed(2)}</label>
          <input type="range" min="1.1" max="1.7" step="0.05" value={gamma()} onInput={(e) => setGamma(parseFloat(e.currentTarget.value))}
            class="w-full h-2 rounded-full appearance-none cursor-pointer mt-1"
            style={{ background: `linear-gradient(to right, ${ADIABATIC} ${gPct()}%, var(--border) ${gPct()}%)` }} />
        </div>
        <div>
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Probe V = {markerV().toFixed(1)} L</label>
          <input type="range" min="1" max="7" step="0.1" value={markerV()} onInput={(e) => setMarkerV(parseFloat(e.currentTarget.value))}
            class="w-full h-2 rounded-full appearance-none cursor-pointer mt-1"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${vPct()}%, var(--border) ${vPct()}%)` }} />
        </div>
      </div>

      {/* Process toggle */}
      <div class="flex items-center gap-2">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Show:</label>
        {(["isothermal", "adiabatic", "both"] as const).map(t => (
          <button onClick={() => setProcessType(t)}
            class="px-3 py-1.5 rounded-lg text-xs font-medium hover:scale-105 transition-all"
            style={{ background: processType() === t ? ACCENT : "var(--bg-secondary)", color: processType() === t ? "white" : "var(--text-secondary)" }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* SVG PV Diagram */}
      <svg width="100%" height="240" viewBox={`0 0 ${W} ${H}`} class="mx-auto">
        <text x={W / 2} y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          PV Diagram: Isothermal vs Adiabatic
        </text>

        {/* Axes */}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke="var(--text-muted)" stroke-width="1" />
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke="var(--text-muted)" stroke-width="1" />
        <text x={pad.l - 8} y={(pad.t + H - pad.b) / 2} text-anchor="middle" font-size="10" fill="var(--text-muted)" transform={`rotate(-90,${pad.l - 8},${(pad.t + H - pad.b) / 2})`}>
          Pressure P
        </text>
        <text x={(pad.l + W - pad.r) / 2} y={H - 8} text-anchor="middle" font-size="10" fill="var(--text-muted)">
          Volume V
        </text>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(f => (
          <>
            <line x1={pad.l} y1={pad.t + f * (H - pad.t - pad.b)} x2={W - pad.r} y2={pad.t + f * (H - pad.t - pad.b)}
              stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
            <line x1={pad.l + f * (W - pad.l - pad.r)} y1={pad.t} x2={pad.l + f * (W - pad.l - pad.r)} y2={H - pad.b}
              stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
          </>
        ))}

        {/* Isothermal curve */}
        {(processType() === "isothermal" || processType() === "both") && (
          <path d={curvePath(isoCurve())} fill="none" stroke={HOT} stroke-width="2.5" stroke-linecap="round" />
        )}

        {/* Adiabatic curve */}
        {(processType() === "adiabatic" || processType() === "both") && (
          <path d={curvePath(adiaCurve())} fill="none" stroke={ADIABATIC} stroke-width="2.5" stroke-linecap="round" stroke-dasharray="6 3" />
        )}

        {/* Probe marker on isothermal */}
        {(processType() === "isothermal" || processType() === "both") && (() => {
          const { x, y } = toSVG(markerV(), isoP());
          return (
            <>
              <line x1={x} y1={H - pad.b} x2={x} y2={y} stroke={HOT} stroke-width="0.8" stroke-dasharray="3 2" opacity="0.5" />
              <circle cx={x} cy={y} r="5" fill={HOT} stroke="white" stroke-width="1.5" />
              <text x={x + 8} y={y - 6} font-size="9" fill={HOT} font-weight="600">
                P={isoP().toFixed(0)}
              </text>
            </>
          );
        })()}

        {/* Probe marker on adiabatic */}
        {(processType() === "adiabatic" || processType() === "both") && (() => {
          const { x, y } = toSVG(markerV(), adiaP());
          return (
            <>
              <circle cx={x} cy={y} r="5" fill={ADIABATIC} stroke="white" stroke-width="1.5" />
              <text x={x + 8} y={y + 12} font-size="9" fill={ADIABATIC} font-weight="600">
                P={adiaP().toFixed(0)}
              </text>
            </>
          );
        })()}

        {/* Legend */}
        <line x1={W - 150} y1={pad.t + 8} x2={W - 130} y2={pad.t + 8} stroke={HOT} stroke-width="2" />
        <text x={W - 126} y={pad.t + 12} font-size="9" fill={HOT}>Isothermal (T=const)</text>
        <line x1={W - 150} y1={pad.t + 22} x2={W - 130} y2={pad.t + 22} stroke={ADIABATIC} stroke-width="2" stroke-dasharray="4 2" />
        <text x={W - 126} y={pad.t + 26} font-size="9" fill={ADIABATIC}>Adiabatic (Q=0)</text>
      </svg>

      {/* Stats */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="rounded-xl p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-lg font-bold" style={{ color: HOT }}>{isoP().toFixed(1)}</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>P (isothermal)</div>
        </div>
        <div class="rounded-xl p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-lg font-bold" style={{ color: ADIABATIC }}>{adiaP().toFixed(1)}</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>P (adiabatic)</div>
        </div>
        <div class="rounded-xl p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{isoWork().toFixed(1)}</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>W (iso, from V₀)</div>
        </div>
      </div>
    </div>
  );
};

// ─── S11ThermodynamicCycles ──────────────────────────────────────────────────
// Animated PV diagram showing preset thermodynamic cycles (Carnot, Otto, Diesel, Stirling).
export const S11ThermodynamicCycles: Component = () => {
  const [cycleType, setCycleType] = createSignal<"carnot" | "otto" | "diesel" | "stirling">("carnot");
  const [Th, setTh] = createSignal(600);
  const [Tc, setTc] = createSignal(300);
  const [running, setRunning] = createSignal(false);
  const [cycleT, setCycleT] = createSignal(0);

  const gamma = 5 / 3;
  const nR = 1;
  const N = 60;

  let animFrame: number | undefined;
  let lastTs: number | undefined;
  const speed = 0.3; // cycles per second

  const step = (ts: number) => {
    if (lastTs === undefined) lastTs = ts;
    if (running()) {
      const dt = (ts - lastTs) / 1000;
      setCycleT(t => (t + dt * speed) % 1);
    }
    lastTs = ts;
    animFrame = requestAnimationFrame(step);
  };
  animFrame = requestAnimationFrame(step);
  onCleanup(() => { if (animFrame !== undefined) cancelAnimationFrame(animFrame); });

  // Build cycle curves based on type
  const cycleCurves = createMemo(() => {
    const th = Th(), tc = Tc();
    const curves: { pts: { V: number; P: number }[]; color: string; label: string }[] = [];

    if (cycleType() === "carnot") {
      const V1 = 1, V2 = 3;
      const V3 = V2 * Math.pow(th / tc, 1 / (gamma - 1));
      const V4 = V1 * Math.pow(th / tc, 1 / (gamma - 1));
      // Hot isothermal 1→2
      const c1: { V: number; P: number }[] = [];
      for (let i = 0; i <= N; i++) { const V = V1 + (i / N) * (V2 - V1); c1.push({ V, P: nR * th / V }); }
      curves.push({ pts: c1, color: HOT, label: "Isothermal (hot)" });
      // Adiabatic expansion 2→3
      const C2 = (nR * th / V2) * Math.pow(V2, gamma);
      const c2: { V: number; P: number }[] = [];
      for (let i = 0; i <= N; i++) { const V = V2 + (i / N) * (V3 - V2); c2.push({ V, P: C2 / Math.pow(V, gamma) }); }
      curves.push({ pts: c2, color: ADIABATIC, label: "Adiabatic exp." });
      // Cold isothermal 3→4
      const c3: { V: number; P: number }[] = [];
      for (let i = 0; i <= N; i++) { const V = V3 + (i / N) * (V4 - V3); c3.push({ V, P: nR * tc / V }); }
      curves.push({ pts: c3, color: COLD, label: "Isothermal (cold)" });
      // Adiabatic compression 4→1
      const C4 = (nR * tc / V4) * Math.pow(V4, gamma);
      const c4: { V: number; P: number }[] = [];
      for (let i = 0; i <= N; i++) { const V = V4 + (i / N) * (V1 - V4); c4.push({ V, P: C4 / Math.pow(V, gamma) }); }
      curves.push({ pts: c4, color: ADIABATIC, label: "Adiabatic comp." });
    } else if (cycleType() === "otto") {
      const V1 = 1, V2 = 4;
      const P1 = nR * tc / V1;
      // Adiabatic compression 1→2 (V2→V1)
      const C1 = P1 * Math.pow(V2, gamma);
      const c1: { V: number; P: number }[] = [];
      for (let i = 0; i <= N; i++) { const V = V2 - (i / N) * (V2 - V1); c1.push({ V, P: C1 / Math.pow(V, gamma) }); }
      curves.push({ pts: c1, color: ADIABATIC, label: "Adiabatic comp." });
      // Isochoric heating 2→3 (at V1)
      const P2 = C1 / Math.pow(V1, gamma);
      const P3 = nR * th / V1;
      const c2: { V: number; P: number }[] = [];
      for (let i = 0; i <= N; i++) { c2.push({ V: V1, P: P2 + (i / N) * (P3 - P2) }); }
      curves.push({ pts: c2, color: HOT, label: "Isochoric (heat)" });
      // Adiabatic expansion 3→4 (V1→V2)
      const C3 = P3 * Math.pow(V1, gamma);
      const c3: { V: number; P: number }[] = [];
      for (let i = 0; i <= N; i++) { const V = V1 + (i / N) * (V2 - V1); c3.push({ V, P: C3 / Math.pow(V, gamma) }); }
      curves.push({ pts: c3, color: ADIABATIC, label: "Adiabatic exp." });
      // Isochoric cooling 4→1 (at V2)
      const P4 = C3 / Math.pow(V2, gamma);
      const c4: { V: number; P: number }[] = [];
      for (let i = 0; i <= N; i++) { c4.push({ V: V2, P: P4 + (i / N) * (P1 - P4) }); }
      curves.push({ pts: c4, color: COLD, label: "Isochoric (cool)" });
    } else if (cycleType() === "diesel") {
      const V1 = 1, V3 = 5;
      const P1 = nR * tc / V3;
      // Adiabatic compression (V3→V1)
      const C1 = P1 * Math.pow(V3, gamma);
      const P2 = C1 / Math.pow(V1, gamma);
      const c1: { V: number; P: number }[] = [];
      for (let i = 0; i <= N; i++) { const V = V3 - (i / N) * (V3 - V1); c1.push({ V, P: C1 / Math.pow(V, gamma) }); }
      curves.push({ pts: c1, color: ADIABATIC, label: "Adiabatic comp." });
      // Isobaric expansion at P2
      const V2 = nR * th / P2;
      const c2: { V: number; P: number }[] = [];
      for (let i = 0; i <= N; i++) { c2.push({ V: V1 + (i / N) * (V2 - V1), P: P2 }); }
      curves.push({ pts: c2, color: HOT, label: "Isobaric (heat)" });
      // Adiabatic expansion (V2→V3)
      const C3 = P2 * Math.pow(V2, gamma);
      const c3: { V: number; P: number }[] = [];
      for (let i = 0; i <= N; i++) { const V = V2 + (i / N) * (V3 - V2); c3.push({ V, P: C3 / Math.pow(V, gamma) }); }
      curves.push({ pts: c3, color: ADIABATIC, label: "Adiabatic exp." });
      // Isochoric cooling (at V3)
      const P4 = C3 / Math.pow(V3, gamma);
      const c4: { V: number; P: number }[] = [];
      for (let i = 0; i <= N; i++) { c4.push({ V: V3, P: P4 - (i / N) * (P4 - P1) }); }
      curves.push({ pts: c4, color: COLD, label: "Isochoric (cool)" });
    } else { // stirling
      const V1 = 1, V2 = 4;
      // Isothermal expansion (hot) V1→V2
      const c1: { V: number; P: number }[] = [];
      for (let i = 0; i <= N; i++) { const V = V1 + (i / N) * (V2 - V1); c1.push({ V, P: nR * th / V }); }
      curves.push({ pts: c1, color: HOT, label: "Isothermal (hot)" });
      // Isochoric cooling at V2
      const P2 = nR * th / V2, P3 = nR * tc / V2;
      const c2: { V: number; P: number }[] = [];
      for (let i = 0; i <= N; i++) { c2.push({ V: V2, P: P2 + (i / N) * (P3 - P2) }); }
      curves.push({ pts: c2, color: COLD, label: "Isochoric (cool)" });
      // Isothermal compression (cold) V2→V1
      const c3: { V: number; P: number }[] = [];
      for (let i = 0; i <= N; i++) { const V = V2 - (i / N) * (V2 - V1); c3.push({ V, P: nR * tc / V }); }
      curves.push({ pts: c3, color: COLD, label: "Isothermal (cold)" });
      // Isochoric heating at V1
      const P4 = nR * tc / V1, P1 = nR * th / V1;
      const c4: { V: number; P: number }[] = [];
      for (let i = 0; i <= N; i++) { c4.push({ V: V1, P: P4 + (i / N) * (P1 - P4) }); }
      curves.push({ pts: c4, color: HOT, label: "Isochoric (heat)" });
    }
    return curves;
  });

  // Animated point
  const animPoint = createMemo(() => {
    const curves = cycleCurves();
    const totalPts = curves.reduce((s, c) => s + c.pts.length, 0);
    const idx = Math.floor(cycleT() * totalPts) % totalPts;
    let acc = 0;
    for (const curve of curves) {
      if (idx < acc + curve.pts.length) {
        return curve.pts[idx - acc];
      }
      acc += curve.pts.length;
    }
    return curves[0].pts[0];
  });

  // Chart scaling
  const allPts = createMemo(() => cycleCurves().flatMap(c => c.pts));
  const chartVmin = createMemo(() => Math.min(...allPts().map(p => p.V)) * 0.85);
  const chartVmax = createMemo(() => Math.max(...allPts().map(p => p.V)) * 1.1);
  const chartPmin = createMemo(() => Math.min(...allPts().map(p => p.P)) * 0.85);
  const chartPmax = createMemo(() => Math.max(...allPts().map(p => p.P)) * 1.1);

  const W = 440, H = 240;
  const pad = { l: 55, r: 15, t: 25, b: 35 };

  const toSVG = (V: number, P: number) => ({
    x: pad.l + ((V - chartVmin()) / (chartVmax() - chartVmin())) * (W - pad.l - pad.r),
    y: pad.t + ((chartPmax() - P) / (chartPmax() - chartPmin())) * (H - pad.t - pad.b),
  });

  const curvePath = (pts: { V: number; P: number }[]) =>
    pts.map((p, i) => {
      const { x, y } = toSVG(p.V, p.P);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

  // Efficiency
  const efficiency = createMemo(() => {
    const th = Th(), tc = Tc();
    if (cycleType() === "carnot" || cycleType() === "stirling") return 1 - tc / th;
    if (cycleType() === "otto") {
      const r = 4; // compression ratio
      return 1 - Math.pow(1 / r, gamma - 1);
    }
    // diesel approx
    return 1 - tc / th * 0.85;
  });

  const thPct = () => ((Th() - 400) / 600) * 100;
  const tcPct = () => ((Tc() - 200) / 400) * 100;

  return (
    <div class="space-y-5">
      {/* Cycle selector */}
      <div class="flex items-center gap-2 flex-wrap">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Cycle:</label>
        {(["carnot", "otto", "diesel", "stirling"] as const).map(c => (
          <button onClick={() => { setCycleType(c); setCycleT(0); }}
            class="px-3 py-1.5 rounded-lg text-xs font-medium hover:scale-105 transition-all"
            style={{ background: cycleType() === c ? ACCENT : "var(--bg-secondary)", color: cycleType() === c ? "white" : "var(--text-secondary)" }}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Temperature controls */}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-medium" style={{ color: HOT }}>T_hot = {Th()} K</label>
          <input type="range" min="400" max="1000" step="10" value={Th()} onInput={(e) => setTh(parseInt(e.currentTarget.value))}
            class="w-full h-2 rounded-full appearance-none cursor-pointer mt-1"
            style={{ background: `linear-gradient(to right, ${HOT} ${thPct()}%, var(--border) ${thPct()}%)` }} />
        </div>
        <div>
          <label class="text-xs font-medium" style={{ color: COLD }}>T_cold = {Tc()} K</label>
          <input type="range" min="200" max="600" step="10" value={Tc()} onInput={(e) => setTc(Math.min(parseInt(e.currentTarget.value), Th() - 50))}
            class="w-full h-2 rounded-full appearance-none cursor-pointer mt-1"
            style={{ background: `linear-gradient(to right, ${COLD} ${tcPct()}%, var(--border) ${tcPct()}%)` }} />
        </div>
      </div>

      {/* Play controls */}
      <div class="flex items-center gap-3">
        <button onClick={() => setRunning(!running())}
          class="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
          style={{ background: running() ? "var(--bg-secondary)" : ACCENT, color: running() ? "var(--text-secondary)" : "white" }}>
          {running() ? "\u23F8 Pause" : "\u25B6 Animate"}
        </button>
        <button onClick={() => { setCycleT(0); setRunning(false); }}
          class="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          {"\u21BA"} Reset
        </button>
      </div>

      {/* SVG */}
      <svg width="100%" height="240" viewBox={`0 0 ${W} ${H}`} class="mx-auto">
        <text x={W / 2} y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          {cycleType().charAt(0).toUpperCase() + cycleType().slice(1)} Cycle — PV Diagram
        </text>

        {/* Axes */}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke="var(--text-muted)" stroke-width="1" />
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke="var(--text-muted)" stroke-width="1" />
        <text x={pad.l - 8} y={(pad.t + H - pad.b) / 2} text-anchor="middle" font-size="10" fill="var(--text-muted)" transform={`rotate(-90,${pad.l - 8},${(pad.t + H - pad.b) / 2})`}>P</text>
        <text x={(pad.l + W - pad.r) / 2} y={H - 8} text-anchor="middle" font-size="10" fill="var(--text-muted)">V</text>

        {/* Filled area (work) */}
        {(() => {
          const allCurvePts = cycleCurves().flatMap(c => c.pts);
          const path = allCurvePts.map((p, i) => {
            const { x, y } = toSVG(p.V, p.P);
            return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(" ") + " Z";
          return <path d={path} fill={`${ACCENT}15`} stroke="none" />;
        })()}

        {/* Cycle curves */}
        <For each={cycleCurves()}>
          {(curve) => (
            <path d={curvePath(curve.pts)} fill="none" stroke={curve.color} stroke-width="2.5" stroke-linecap="round" />
          )}
        </For>

        {/* Direction arrows at midpoints */}
        <For each={cycleCurves()}>
          {(curve) => {
            const mid = Math.floor(curve.pts.length / 2);
            const p1 = toSVG(curve.pts[mid].V, curve.pts[mid].P);
            const p2 = toSVG(curve.pts[mid + 1].V, curve.pts[mid + 1].P);
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
            return (
              <polygon
                points="-5,-3 5,0 -5,3"
                fill={curve.color}
                transform={`translate(${p1.x},${p1.y}) rotate(${angle})`}
              />
            );
          }}
        </For>

        {/* Animated point */}
        {(() => {
          const p = animPoint();
          const { x, y } = toSVG(p.V, p.P);
          return (
            <>
              <circle cx={x} cy={y} r="7" fill={ACCENT} opacity="0.2" />
              <circle cx={x} cy={y} r="4" fill={ACCENT} stroke="white" stroke-width="1.5" />
            </>
          );
        })()}
      </svg>

      {/* Stats */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="rounded-xl p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{(efficiency() * 100).toFixed(1)}%</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Efficiency {"\u03B7"}</div>
        </div>
        <div class="rounded-xl p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-lg font-bold" style={{ color: HOT }}>{Th()} K</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>T_hot</div>
        </div>
        <div class="rounded-xl p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-lg font-bold" style={{ color: COLD }}>{Tc()} K</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>T_cold</div>
        </div>
      </div>
    </div>
  );
};

// ─── S11CycleEfficiency ──────────────────────────────────────────────────────
// Compare efficiencies of different thermodynamic cycles as a function of T_hot/T_cold.
export const S11CycleEfficiency: Component = () => {
  const [Th, setTh] = createSignal(600);
  const [compressionRatio, setCompressionRatio] = createSignal(8);

  const gamma = 1.4;
  const Tc = 300; // fixed cold reservoir

  // Efficiencies
  const carnotEff = createMemo(() => 1 - Tc / Th());
  const ottoEff = createMemo(() => 1 - Math.pow(1 / compressionRatio(), gamma - 1));
  const dieselCutoff = createMemo(() => 1 + (Th() - Tc) / (Tc * compressionRatio()));
  const dieselEff = createMemo(() => {
    const r = compressionRatio(), rc = dieselCutoff();
    return 1 - (1 / (gamma * Math.pow(r, gamma - 1))) * (Math.pow(rc, gamma) - 1) / (rc - 1);
  });
  const stirlingEff = createMemo(() => 1 - Tc / Th()); // ideal = Carnot

  // Bar chart data
  const engines = createMemo(() => [
    { name: "Carnot", eff: carnotEff(), color: "#ef4444" },
    { name: "Stirling", eff: stirlingEff(), color: "#f59e0b" },
    { name: "Otto", eff: ottoEff(), color: "#8b5cf6" },
    { name: "Diesel", eff: Math.max(0, Math.min(1, dieselEff())), color: "#3b82f6" },
  ]);

  const W = 440, H = 220;
  const pad = { l: 55, r: 15, t: 30, b: 45 };
  const barW = 50;

  const thPct = () => ((Th() - 400) / 800) * 100;
  const rPct = () => ((compressionRatio() - 4) / 16) * 100;

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>T_hot = {Th()} K (T_cold = {Tc} K fixed)</label>
          <input type="range" min="400" max="1200" step="10" value={Th()} onInput={(e) => setTh(parseInt(e.currentTarget.value))}
            class="w-full h-2 rounded-full appearance-none cursor-pointer mt-1"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${thPct()}%, var(--border) ${thPct()}%)` }} />
        </div>
        <div>
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Compression Ratio r = {compressionRatio()}</label>
          <input type="range" min="4" max="20" step="1" value={compressionRatio()} onInput={(e) => setCompressionRatio(parseInt(e.currentTarget.value))}
            class="w-full h-2 rounded-full appearance-none cursor-pointer mt-1"
            style={{ background: `linear-gradient(to right, ${ADIABATIC} ${rPct()}%, var(--border) ${rPct()}%)` }} />
        </div>
      </div>

      {/* Bar chart */}
      <svg width="100%" height="220" viewBox={`0 0 ${W} ${H}`} class="mx-auto">
        <text x={W / 2} y="16" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Cycle Efficiency Comparison
        </text>

        {/* Y axis */}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke="var(--text-muted)" stroke-width="1" />
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke="var(--text-muted)" stroke-width="1" />

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1.0].map(v => {
          const y = pad.t + (1 - v) * (H - pad.t - pad.b);
          return (
            <>
              <line x1={pad.l - 4} y1={y} x2={pad.l} y2={y} stroke="var(--text-muted)" stroke-width="1" />
              <text x={pad.l - 8} y={y + 3} text-anchor="end" font-size="9" fill="var(--text-muted)">{(v * 100).toFixed(0)}%</text>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
            </>
          );
        })}

        {/* Bars */}
        <For each={engines()}>
          {(eng, i) => {
            const chartW = W - pad.l - pad.r;
            const spacing = chartW / engines().length;
            const x = pad.l + i() * spacing + (spacing - barW) / 2;
            const barH = Math.max(0, eng.eff) * (H - pad.t - pad.b);
            const y = pad.t + (H - pad.t - pad.b) - barH;
            return (
              <>
                <rect x={x} y={y} width={barW} height={barH} rx="4" fill={eng.color} opacity="0.85">
                  <animate attributeName="height" from="0" to={barH} dur="0.6s" fill="freeze" />
                  <animate attributeName="y" from={H - pad.b} to={y} dur="0.6s" fill="freeze" />
                </rect>
                <text x={x + barW / 2} y={y - 5} text-anchor="middle" font-size="10" font-weight="700" fill={eng.color}>
                  {(eng.eff * 100).toFixed(1)}%
                </text>
                <text x={x + barW / 2} y={H - pad.b + 14} text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-secondary)">
                  {eng.name}
                </text>
              </>
            );
          }}
        </For>

        {/* Carnot limit line */}
        {(() => {
          const y = pad.t + (1 - carnotEff()) * (H - pad.t - pad.b);
          return (
            <>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke={HOT} stroke-width="1.5" stroke-dasharray="6 3" opacity="0.6" />
              <text x={W - pad.r - 2} y={y - 4} text-anchor="end" font-size="8" fill={HOT} opacity="0.8">Carnot limit</text>
            </>
          );
        })()}
      </svg>

      {/* Efficiency cards */}
      <div class="grid grid-cols-4 gap-2 text-center">
        <For each={engines()}>
          {(eng) => (
            <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: `1px solid ${eng.color}30` }}>
              <div class="text-sm font-bold" style={{ color: eng.color }}>{(eng.eff * 100).toFixed(1)}%</div>
              <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{eng.name}</div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
