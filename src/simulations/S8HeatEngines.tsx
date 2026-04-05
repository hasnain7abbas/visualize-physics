import { Component, createSignal, createMemo, onCleanup } from "solid-js";

// ─── S8CarnotCycle ──────────────────────────────────────────────────────────────
export const S8CarnotCycle: Component = () => {
  const [Th, setTh] = createSignal(600);
  const [Tc, setTc] = createSignal(300);
  const [running, setRunning] = createSignal(false);
  const [cycleT, setCycleT] = createSignal(0); // 0..1 progress around cycle

  const gamma = 5 / 3;
  const nR = 1; // nR = nRT/T normalisation; treat nR as 1 for shape

  // Key volumes
  const V1 = 1;
  const V2 = 3;
  const V3 = createMemo(() => V2 * Math.pow(Th() / Tc(), 1 / (gamma - 1)));
  const V4 = createMemo(() => V1 * Math.pow(Th() / Tc(), 1 / (gamma - 1)));

  // Pressure at corners
  const P1 = createMemo(() => nR * Th() / V1);
  const P2 = createMemo(() => nR * Th() / V2);
  const P3 = createMemo(() => nR * Tc() / V3());
  const P4 = createMemo(() => nR * Tc() / V4());

  // Build curves: 50 points each
  const N = 60;

  // Isothermal expansion: 1 -> 2 (hot)
  const curveHotIso = createMemo(() => {
    const pts: { V: number; P: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const V = V1 + (i / N) * (V2 - V1);
      pts.push({ V, P: nR * Th() / V });
    }
    return pts;
  });

  // Adiabatic expansion: 2 -> 3
  const curveAdiaExp = createMemo(() => {
    const pts: { V: number; P: number }[] = [];
    const C = P2() * Math.pow(V2, gamma);
    const v3 = V3();
    for (let i = 0; i <= N; i++) {
      const V = V2 + (i / N) * (v3 - V2);
      pts.push({ V, P: C / Math.pow(V, gamma) });
    }
    return pts;
  });

  // Isothermal compression: 3 -> 4 (cold)
  const curveColdIso = createMemo(() => {
    const pts: { V: number; P: number }[] = [];
    const v3 = V3(), v4 = V4();
    for (let i = 0; i <= N; i++) {
      const V = v3 + (i / N) * (v4 - v3); // v3 > v4 so this goes left
      pts.push({ V, P: nR * Tc() / V });
    }
    return pts;
  });

  // Adiabatic compression: 4 -> 1
  const curveAdiaComp = createMemo(() => {
    const pts: { V: number; P: number }[] = [];
    const v4 = V4();
    const C = P4() * Math.pow(v4, gamma);
    for (let i = 0; i <= N; i++) {
      const V = v4 + (i / N) * (V1 - v4); // v4 > V1 so goes left
      pts.push({ V, P: C / Math.pow(V, gamma) });
    }
    return pts;
  });

  // Chart scaling
  const allPts = createMemo(() => [
    ...curveHotIso(), ...curveAdiaExp(), ...curveColdIso(), ...curveAdiaComp(),
  ]);
  const Vmin = createMemo(() => Math.min(...allPts().map((p) => p.V)) * 0.8);
  const Vmax = createMemo(() => Math.max(...allPts().map((p) => p.V)) * 1.1);
  const Pmin = createMemo(() => Math.min(...allPts().map((p) => p.P)) * 0.8);
  const Pmax = createMemo(() => Math.max(...allPts().map((p) => p.P)) * 1.1);

  const toSVG = (V: number, P: number) => {
    const x = 55 + ((V - Vmin()) / (Vmax() - Vmin())) * 340;
    const y = 195 - ((P - Pmin()) / (Pmax() - Pmin())) * 170;
    return { x, y };
  };

  const curvePath = (pts: { V: number; P: number }[]) =>
    pts.map((p, i) => {
      const { x, y } = toSVG(p.V, p.P);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

  // Thermodynamic quantities
  const efficiency = createMemo(() => 1 - Tc() / Th());
  const Qh = createMemo(() => nR * Th() * Math.log(V2 / V1));
  const Qc = createMemo(() => nR * Tc() * Math.log(V2 / V1));
  const W = createMemo(() => Qh() - Qc());

  // Animated point along cycle
  const animPoint = createMemo(() => {
    const t = cycleT();
    // 4 segments each gets 0.25 of the cycle
    let pts: { V: number; P: number }[];
    let localT: number;
    if (t < 0.25) {
      pts = curveHotIso();
      localT = t / 0.25;
    } else if (t < 0.5) {
      pts = curveAdiaExp();
      localT = (t - 0.25) / 0.25;
    } else if (t < 0.75) {
      pts = curveColdIso();
      localT = (t - 0.5) / 0.25;
    } else {
      pts = curveAdiaComp();
      localT = (t - 0.75) / 0.25;
    }
    const idx = Math.min(Math.floor(localT * (pts.length - 1)), pts.length - 2);
    const frac = localT * (pts.length - 1) - idx;
    const p = {
      V: pts[idx].V + frac * (pts[idx + 1].V - pts[idx].V),
      P: pts[idx].P + frac * (pts[idx + 1].P - pts[idx].P),
    };
    return toSVG(p.V, p.P);
  });

  let intervalId: number | undefined;

  const startCycle = () => {
    if (running()) return;
    setRunning(true);
    setCycleT(0);
    intervalId = setInterval(() => {
      setCycleT((prev) => {
        const next = prev + 0.005;
        if (next >= 1) {
          clearInterval(intervalId);
          intervalId = undefined;
          setRunning(false);
          return 0;
        }
        return next;
      });
    }, 30) as unknown as number;
  };

  onCleanup(() => {
    if (intervalId !== undefined) clearInterval(intervalId);
  });

  // Corner labels
  const corners = createMemo(() => [
    { label: "1", ...toSVG(V1, P1()) },
    { label: "2", ...toSVG(V2, P2()) },
    { label: "3", ...toSVG(V3(), P3()) },
    { label: "4", ...toSVG(V4(), P4()) },
  ]);

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "70px" }}>T_h = {Th()} K</label>
          <input type="range" min="400" max="1000" step="10" value={Th()} onInput={(e) => setTh(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #ef4444 ${((Th() - 400) / 600) * 100}%, var(--border) ${((Th() - 400) / 600) * 100}%)` }}
          />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "70px" }}>T_c = {Tc()} K</label>
          <input type="range" min="200" max="400" step="5" value={Tc()} onInput={(e) => setTc(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #3b82f6 ${((Tc() - 200) / 200) * 100}%, var(--border) ${((Tc() - 200) / 200) * 100}%)` }}
          />
        </div>
      </div>

      <svg width="100%" height="230" viewBox="0 0 420 230" class="mx-auto">
        {/* Axes */}
        <line x1="55" y1="195" x2="400" y2="195" stroke="var(--border)" stroke-width="1" />
        <line x1="55" y1="195" x2="55" y2="15" stroke="var(--border)" stroke-width="1" />
        <text x="230" y="220" text-anchor="middle" font-size="10" fill="var(--text-muted)">Volume V</text>
        <text x="18" y="105" text-anchor="middle" font-size="10" fill="var(--text-muted)" transform="rotate(-90 18 105)">Pressure P</text>

        {/* Filled area under cycle */}
        <path
          d={curvePath(curveHotIso()) + " " +
            curveAdiaExp().map((p) => { const s = toSVG(p.V, p.P); return `L${s.x.toFixed(1)},${s.y.toFixed(1)}`; }).join(" ") + " " +
            curveColdIso().map((p) => { const s = toSVG(p.V, p.P); return `L${s.x.toFixed(1)},${s.y.toFixed(1)}`; }).join(" ") + " " +
            curveAdiaComp().map((p) => { const s = toSVG(p.V, p.P); return `L${s.x.toFixed(1)},${s.y.toFixed(1)}`; }).join(" ") + " Z"}
          fill="#ea580c" opacity="0.1"
        />

        {/* Hot isotherm (1->2) red */}
        <path d={curvePath(curveHotIso())} fill="none" stroke="#ef4444" stroke-width="2.5" />
        {/* Adiabatic expansion (2->3) gray */}
        <path d={curvePath(curveAdiaExp())} fill="none" stroke="#9ca3af" stroke-width="2" stroke-dasharray="5 3" />
        {/* Cold isotherm (3->4) blue */}
        <path d={curvePath(curveColdIso())} fill="none" stroke="#3b82f6" stroke-width="2.5" />
        {/* Adiabatic compression (4->1) gray */}
        <path d={curvePath(curveAdiaComp())} fill="none" stroke="#9ca3af" stroke-width="2" stroke-dasharray="5 3" />

        {/* Corner labels */}
        {corners().map((c) => (
          <>
            <circle cx={c.x} cy={c.y} r="3" fill="#ea580c" />
            <text x={c.x + 8} y={c.y - 6} font-size="9" fill="var(--text-primary)" font-weight="600">{c.label}</text>
          </>
        ))}

        {/* Stage labels */}
        <text x={toSVG((V1 + V2) / 2, nR * Th() / ((V1 + V2) / 2)).x} y={toSVG((V1 + V2) / 2, nR * Th() / ((V1 + V2) / 2)).y - 8} text-anchor="middle" font-size="7" fill="#ef4444">Isothermal Exp.</text>
        <text x={toSVG((V2 + V3()) / 2, (P2() + P3()) / 2).x + 12} y={toSVG((V2 + V3()) / 2, (P2() + P3()) / 2).y} font-size="7" fill="#9ca3af">Adiabatic</text>
        <text x={toSVG((V3() + V4()) / 2, nR * Tc() / ((V3() + V4()) / 2)).x} y={toSVG((V3() + V4()) / 2, nR * Tc() / ((V3() + V4()) / 2)).y + 14} text-anchor="middle" font-size="7" fill="#3b82f6">Isothermal Comp.</text>
        <text x={toSVG((V4() + V1) / 2, (P4() + P1()) / 2).x - 14} y={toSVG((V4() + V1) / 2, (P4() + P1()) / 2).y} font-size="7" fill="#9ca3af">Adiabatic</text>

        {/* Legend */}
        <line x1="310" y1="25" x2="330" y2="25" stroke="#ef4444" stroke-width="2" />
        <text x="335" y="28" font-size="8" fill="var(--text-muted)">Hot isotherm</text>
        <line x1="310" y1="38" x2="330" y2="38" stroke="#3b82f6" stroke-width="2" />
        <text x="335" y="41" font-size="8" fill="var(--text-muted)">Cold isotherm</text>
        <line x1="310" y1="51" x2="330" y2="51" stroke="#9ca3af" stroke-width="2" stroke-dasharray="5 3" />
        <text x="335" y="54" font-size="8" fill="var(--text-muted)">Adiabats</text>

        {/* Animated point */}
        {running() && (
          <circle cx={animPoint().x} cy={animPoint().y} r="5" fill="#ea580c" stroke="white" stroke-width="1.5" />
        )}
      </svg>

      <div class="flex justify-center gap-2">
        <button onClick={startCycle} disabled={running()}
          class="px-5 py-2.5 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: running() ? "var(--bg-secondary)" : "#ea580c", color: running() ? "var(--text-muted)" : "white" }}>
          {running() ? "Running..." : "Run Cycle"}
        </button>
      </div>

      <div class="grid grid-cols-4 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Efficiency eta</div>
          <div class="text-lg font-bold" style={{ color: "#ea580c" }}>{(efficiency() * 100).toFixed(1)}%</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Q_h</div>
          <div class="text-lg font-bold" style={{ color: "#ef4444" }}>{Qh().toFixed(1)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Q_c</div>
          <div class="text-lg font-bold" style={{ color: "#3b82f6" }}>{Qc().toFixed(1)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Work W</div>
          <div class="text-lg font-bold" style={{ color: "#10b981" }}>{W().toFixed(1)}</div>
        </div>
      </div>

      <div class="text-center text-[11px]" style={{ color: "var(--text-muted)" }}>
        eta = 1 - T_c/T_h | gamma = 5/3 (monatomic) | V1={V1}, V2={V2}, V3={V3().toFixed(2)}, V4={V4().toFixed(2)}
      </div>
    </div>
  );
};

// ─── S8HeatEngine ───────────────────────────────────────────────────────────────
export const S8HeatEngine: Component = () => {
  const [eta, setEta] = createSignal(40); // percent
  const [ThEng, setThEng] = createSignal(600);
  const [TcEng, setTcEng] = createSignal(300);
  const [dotPhase, setDotPhase] = createSignal(0);

  const Qh = 100; // fixed energy input

  const W = createMemo(() => Qh * eta() / 100);
  const Qc = createMemo(() => Qh - W());
  const carnotEff = createMemo(() => (1 - TcEng() / ThEng()) * 100);
  const isImpossible = createMemo(() => eta() > carnotEff());

  // Animate energy flow dots
  let animId: number | undefined;
  const startAnim = () => {
    const tick = () => {
      setDotPhase((prev) => (prev + 0.02) % 1);
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
  };
  startAnim();
  onCleanup(() => { if (animId !== undefined) cancelAnimationFrame(animId); });

  // Dot positions along a path (returns array of y positions for vertical arrows, x for horizontal)
  const flowDots = (count: number, phase: number) => {
    const positions: number[] = [];
    for (let i = 0; i < count; i++) {
      positions.push(((phase + i / count) % 1));
    }
    return positions;
  };

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-3 gap-4">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>eta = {eta()}%</label>
          <input type="range" min="0" max="100" step="1" value={eta()} onInput={(e) => setEta(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${isImpossible() ? "#ef4444" : "#ea580c"} ${eta()}%, var(--border) ${eta()}%)` }}
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>T_h = {ThEng()} K</label>
          <input type="range" min="500" max="1000" step="10" value={ThEng()} onInput={(e) => setThEng(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #ef4444 ${((ThEng() - 500) / 500) * 100}%, var(--border) ${((ThEng() - 500) / 500) * 100}%)` }}
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>T_c = {TcEng()} K</label>
          <input type="range" min="200" max="400" step="5" value={TcEng()} onInput={(e) => setTcEng(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #3b82f6 ${((TcEng() - 200) / 200) * 100}%, var(--border) ${((TcEng() - 200) / 200) * 100}%)` }}
          />
        </div>
      </div>

      <svg width="100%" height="280" viewBox="0 0 420 280" class="mx-auto">
        {/* Hot reservoir */}
        <rect x="140" y="15" width="140" height="45" rx="8" fill="#ef4444" opacity="0.2" stroke="#ef4444" stroke-width="1.5" />
        <text x="210" y="35" text-anchor="middle" font-size="10" font-weight="600" fill="#ef4444">Hot Reservoir</text>
        <text x="210" y="50" text-anchor="middle" font-size="9" fill="#ef4444">T_h = {ThEng()} K</text>

        {/* Engine circle */}
        <circle cx="210" cy="140" r="40" fill="var(--bg-secondary)" stroke={isImpossible() ? "#ef4444" : "#ea580c"} stroke-width="2.5" />
        <text x="210" y="136" text-anchor="middle" font-size="11" font-weight="700" fill={isImpossible() ? "#ef4444" : "#ea580c"}>Engine</text>
        <text x="210" y="150" text-anchor="middle" font-size="8" fill="var(--text-muted)">eta = {eta()}%</text>

        {/* Cold reservoir */}
        <rect x="140" y="220" width="140" height="45" rx="8" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" stroke-width="1.5" />
        <text x="210" y="240" text-anchor="middle" font-size="10" font-weight="600" fill="#3b82f6">Cold Reservoir</text>
        <text x="210" y="255" text-anchor="middle" font-size="9" fill="#3b82f6">T_c = {TcEng()} K</text>

        {/* Qh arrow: hot -> engine */}
        <line x1="210" y1="60" x2="210" y2="98" stroke="#ef4444" stroke-width="2" />
        <polygon points="210,100 205,90 215,90" fill="#ef4444" />
        <text x="235" y="82" font-size="9" font-weight="600" fill="#ef4444">Q_h = {Qh}</text>

        {/* Animated dots for Qh */}
        {flowDots(3, dotPhase()).map((t) => (
          <circle cx={210} cy={60 + t * 38} r="3" fill="#ef4444" opacity={0.8} />
        ))}

        {/* Qc arrow: engine -> cold */}
        <line x1="210" y1="182" x2="210" y2="218" stroke="#3b82f6" stroke-width="2" />
        <polygon points="210,220 205,210 215,210" fill="#3b82f6" />
        <text x="235" y="205" font-size="9" font-weight="600" fill="#3b82f6">Q_c = {Qc().toFixed(0)}</text>

        {/* Animated dots for Qc */}
        {flowDots(Math.max(1, Math.round(3 * (1 - eta() / 100))), dotPhase()).map((t) => (
          <circle cx={210} cy={182 + t * 36} r="3" fill="#3b82f6" opacity={0.8} />
        ))}

        {/* W arrow: engine -> right */}
        <line x1="252" y1="140" x2="340" y2="140" stroke="#10b981" stroke-width="2" />
        <polygon points="342,140 332,135 332,145" fill="#10b981" />
        <text x="345" y="135" font-size="9" font-weight="600" fill="#10b981">W = {W().toFixed(0)}</text>
        <text x="345" y="148" font-size="8" fill="var(--text-muted)">(useful work)</text>

        {/* Animated dots for W */}
        {flowDots(Math.max(1, Math.round(3 * eta() / 100)), dotPhase()).map((t) => (
          <circle cx={252 + t * 88} cy={140} r="3" fill="#10b981" opacity={0.8} />
        ))}

        {/* Carnot limit line */}
        <line x1="70" y1="140" x2="70" y2="140" stroke="none" />
        <text x="50" y="16" font-size="9" fill="var(--text-muted)">Carnot limit:</text>
        <text x="50" y="30" font-size="10" font-weight="700" fill="#ea580c">{carnotEff().toFixed(1)}%</text>

        {/* Impossible warning */}
        {isImpossible() && (
          <>
            <rect x="30" y="44" width="90" height="22" rx="4" fill="#ef4444" opacity="0.15" />
            <text x="75" y="59" text-anchor="middle" font-size="9" font-weight="700" fill="#ef4444">IMPOSSIBLE!</text>
          </>
        )}

        {/* Energy conservation */}
        <text x="210" y="275" text-anchor="middle" font-size="9" fill="var(--text-muted)">
          Energy conservation: Q_h = W + Q_c = {W().toFixed(0)} + {Qc().toFixed(0)} = {Qh}
        </text>
      </svg>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Set Efficiency</div>
          <div class="text-lg font-bold" style={{ color: isImpossible() ? "#ef4444" : "#ea580c" }}>{eta()}%</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Carnot Limit</div>
          <div class="text-lg font-bold" style={{ color: "#ea580c" }}>{carnotEff().toFixed(1)}%</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Status</div>
          <div class="text-lg font-bold" style={{ color: isImpossible() ? "#ef4444" : "#10b981" }}>
            {isImpossible() ? "Violates 2nd Law" : "Allowed"}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── S8SecondLaw ─────────────────────────────────────────────────────────────────
export const S8SecondLaw: Component = () => {
  const [Ta0, setTa0] = createSignal(700);
  const [Tb0, setTb0] = createSignal(300);
  const [history, setHistory] = createSignal<{ step: number; Ta: number; Tb: number; S: number }[]>([]);
  const [running, setRunning] = createSignal(false);

  // Heat capacity (same for both systems)
  const C = 1; // arbitrary units
  const deltaQRate = 0.08; // fraction of temperature difference transferred per step

  const resetSim = () => {
    setHistory([]);
    setRunning(false);
  };

  const startExchange = () => {
    if (running()) return;
    setRunning(true);
    setHistory([]);

    let Ta = Ta0();
    let Tb = Tb0();
    let Stotal = 0;
    let step = 0;
    const data: { step: number; Ta: number; Tb: number; S: number }[] = [
      { step: 0, Ta, Tb, S: 0 },
    ];

    const iv = setInterval(() => {
      step++;
      const dQ = deltaQRate * C * (Ta - Tb); // heat flows from hot to cold
      if (Math.abs(dQ) < 0.01) {
        clearInterval(iv);
        setRunning(false);
        return;
      }
      // dS = dQ/Tcold - dQ/Thot (> 0 always when heat flows from hot to cold)
      const Thot = Ta > Tb ? Ta : Tb;
      const Tcold = Ta > Tb ? Tb : Ta;
      const dS = Math.abs(dQ) / Tcold - Math.abs(dQ) / Thot;
      Stotal += dS;

      Ta -= dQ / C; // hot loses heat
      Tb += dQ / C; // cold gains heat

      data.push({ step, Ta, Tb, S: Stotal });
      setHistory([...data]);

      if (step >= 150) {
        clearInterval(iv);
        setRunning(false);
      }
    }, 40) as unknown as number;

    onCleanup(() => clearInterval(iv));
  };

  // Latest state
  const latest = createMemo(() => {
    const h = history();
    return h.length > 0 ? h[h.length - 1] : { step: 0, Ta: Ta0(), Tb: Tb0(), S: 0 };
  });

  // Chart scaling for entropy
  const maxS = createMemo(() => {
    const h = history();
    if (h.length === 0) return 1;
    return Math.max(...h.map((d) => d.S), 0.01);
  });
  const maxStep = createMemo(() => {
    const h = history();
    if (h.length <= 1) return 1;
    return h[h.length - 1].step;
  });

  // Temperature bar heights (scaled 0-150px for 0-1000K)
  const barH = (T: number) => Math.max(4, (T / 1000) * 140);

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "70px" }}>T_A = {Ta0()} K</label>
          <input type="range" min="200" max="800" step="10" value={Ta0()} onInput={(e) => { setTa0(parseInt(e.currentTarget.value)); resetSim(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #ef4444 ${((Ta0() - 200) / 600) * 100}%, var(--border) ${((Ta0() - 200) / 600) * 100}%)` }}
          />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "70px" }}>T_B = {Tb0()} K</label>
          <input type="range" min="200" max="800" step="10" value={Tb0()} onInput={(e) => { setTb0(parseInt(e.currentTarget.value)); resetSim(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #3b82f6 ${((Tb0() - 200) / 600) * 100}%, var(--border) ${((Tb0() - 200) / 600) * 100}%)` }}
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        {/* Thermometer bars */}
        <svg width="100%" height="200" viewBox="0 0 200 200" class="mx-auto" style={{ background: "var(--bg-secondary)", "border-radius": "10px" }}>
          <text x="100" y="16" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)">Temperature</text>

          {/* System A thermometer */}
          <rect x="40" y={170 - barH(latest().Ta)} width="40" height={barH(latest().Ta)} rx="4" fill="#ef4444" opacity="0.7" />
          <rect x="40" y="30" width="40" height="140" rx="4" fill="none" stroke="var(--border)" stroke-width="1" />
          <text x="60" y="190" text-anchor="middle" font-size="8" fill="#ef4444" font-weight="600">A: {latest().Ta.toFixed(0)} K</text>

          {/* System B thermometer */}
          <rect x="120" y={170 - barH(latest().Tb)} width="40" height={barH(latest().Tb)} rx="4" fill="#3b82f6" opacity="0.7" />
          <rect x="120" y="30" width="40" height="140" rx="4" fill="none" stroke="var(--border)" stroke-width="1" />
          <text x="140" y="190" text-anchor="middle" font-size="8" fill="#3b82f6" font-weight="600">B: {latest().Tb.toFixed(0)} K</text>

          {/* Heat flow arrow when there is a temperature difference */}
          {Math.abs(latest().Ta - latest().Tb) > 1 && (
            <>
              <line x1={latest().Ta > latest().Tb ? 82 : 118} y1="100" x2={latest().Ta > latest().Tb ? 118 : 82} y2="100" stroke="#ea580c" stroke-width="2" />
              <polygon
                points={latest().Ta > latest().Tb
                  ? "118,100 110,95 110,105"
                  : "82,100 90,95 90,105"
                }
                fill="#ea580c"
              />
              <text x="100" y="90" text-anchor="middle" font-size="7" fill="#ea580c">dQ</text>
            </>
          )}

          {/* Equilibrium marker */}
          {Math.abs(latest().Ta - latest().Tb) <= 1 && history().length > 0 && (
            <text x="100" y="100" text-anchor="middle" font-size="9" font-weight="700" fill="#10b981">Equilibrium!</text>
          )}
        </svg>

        {/* Entropy vs time */}
        <svg width="100%" height="200" viewBox="0 0 220 200" class="mx-auto" style={{ background: "var(--bg-secondary)", "border-radius": "10px" }}>
          <text x="110" y="16" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)">Total Entropy vs Step</text>
          <line x1="35" y1="175" x2="205" y2="175" stroke="var(--border)" stroke-width="1" />
          <line x1="35" y1="175" x2="35" y2="25" stroke="var(--border)" stroke-width="1" />
          <text x="120" y="192" text-anchor="middle" font-size="8" fill="var(--text-muted)">Time step</text>
          <text x="10" y="100" text-anchor="middle" font-size="8" fill="var(--text-muted)" transform="rotate(-90 10 100)">S_total</text>

          {/* Entropy curve */}
          {history().length > 1 && (
            <>
              <path
                d={history().map((d, i) => {
                  const px = 35 + (d.step / maxStep()) * 170;
                  const py = 175 - (d.S / maxS()) * 140;
                  return `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`;
                }).join(" ") + ` L${(35 + 170).toFixed(1)},175 L35,175 Z`}
                fill="#ea580c" opacity="0.1"
              />
              <path
                d={history().map((d, i) => {
                  const px = 35 + (d.step / maxStep()) * 170;
                  const py = 175 - (d.S / maxS()) * 140;
                  return `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`;
                }).join(" ")}
                fill="none" stroke="#ea580c" stroke-width="2.5"
              />
            </>
          )}

          {/* "Entropy always increases" annotation */}
          {history().length > 10 && (
            <text x="120" y="40" text-anchor="middle" font-size="8" font-weight="600" fill="#ea580c">{"dS \u2265 0 always!"}</text>
          )}
        </svg>
      </div>

      <div class="flex justify-center gap-2">
        <button onClick={startExchange} disabled={running()}
          class="px-5 py-2.5 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: running() ? "var(--bg-secondary)" : "#ea580c", color: running() ? "var(--text-muted)" : "white" }}>
          {running() ? "Exchanging..." : "Exchange Heat"}
        </button>
        <button onClick={resetSim}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Reset
        </button>
      </div>

      <div class="grid grid-cols-4 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>T_A</div>
          <div class="text-lg font-bold" style={{ color: "#ef4444" }}>{latest().Ta.toFixed(0)} K</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>T_B</div>
          <div class="text-lg font-bold" style={{ color: "#3b82f6" }}>{latest().Tb.toFixed(0)} K</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>S_total</div>
          <div class="text-lg font-bold" style={{ color: "#ea580c" }}>{latest().S.toFixed(3)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Steps</div>
          <div class="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{latest().step}</div>
        </div>
      </div>

      <div class="text-center text-[11px]" style={{ color: "var(--text-muted)" }}>
        dS = dQ/T_cold - dQ/T_hot &gt; 0 | Heat flows from hot to cold | Entropy never decreases
      </div>
    </div>
  );
};
