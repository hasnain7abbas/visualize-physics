import { Component, createSignal, createMemo, onCleanup, For } from "solid-js";

// ─── S7IdealGasLaw ──────────────────────────────────────────────────────────
// PV = NkT with animated particles bouncing in a variable-size container
export const S7IdealGasLaw: Component = () => {
  const [numParticles, setNumParticles] = createSignal(60);
  const [temperature, setTemperature] = createSignal(400);
  const [volume, setVolume] = createSignal(300); // container width in SVG units

  const kB = 1.381e-23;

  // Particle state: positions + velocities
  const [particles, setParticles] = createSignal<
    { x: number; y: number; vx: number; vy: number }[]
  >([]);

  const containerHeight = 180;
  const containerY = 15;

  // Pressure: P = NkT/V (display in arbitrary but consistent units)
  const pressure = createMemo(() => {
    const N = numParticles();
    const T = temperature();
    const V = volume();
    return (N * kB * T) / (V * 1e-24); // scale V to ~physical volume
  });

  // Speed scale proportional to sqrt(T)
  const speedScale = createMemo(() => Math.sqrt(temperature() / 300) * 1.5);

  function initParticles(n: number) {
    const V = volume();
    const sp = speedScale();
    const pts: { x: number; y: number; vx: number; vy: number }[] = [];
    for (let i = 0; i < n; i++) {
      pts.push({
        x: 50 + Math.random() * (V - 10),
        y: containerY + 5 + Math.random() * (containerHeight - 10),
        vx: (Math.random() - 0.5) * 2 * sp,
        vy: (Math.random() - 0.5) * 2 * sp,
      });
    }
    return pts;
  }

  // Re-init when N or V changes
  const resetParticles = () => setParticles(initParticles(numParticles()));
  resetParticles();

  // Animation loop
  let animFrame: number | undefined;

  const animate = () => {
    const step = () => {
      const V = volume();
      const sp = speedScale();
      setParticles((pts) =>
        pts.map((p) => {
          let { x, y, vx, vy } = p;
          // Scale velocity magnitudes to current temperature
          const mag = Math.sqrt(vx * vx + vy * vy);
          if (mag > 0) {
            vx = (vx / mag) * sp;
            vy = (vy / mag) * sp;
          }
          x += vx;
          y += vy;
          const xMin = 50;
          const xMax = 50 + V;
          const yMin = containerY;
          const yMax = containerY + containerHeight;
          if (x < xMin) { x = xMin; vx = Math.abs(vx); }
          if (x > xMax) { x = xMax; vx = -Math.abs(vx); }
          if (y < yMin) { y = yMin; vy = Math.abs(vy); }
          if (y > yMax) { y = yMax; vy = -Math.abs(vy); }
          return { x, y, vx, vy };
        })
      );
      animFrame = requestAnimationFrame(step);
    };
    animFrame = requestAnimationFrame(step);
  };

  animate();
  onCleanup(() => animFrame && cancelAnimationFrame(animFrame));

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-3 gap-4">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "50px" }}>N = {numParticles()}</label>
          <input type="range" min="10" max="200" step="5" value={numParticles()}
            onInput={(e) => { setNumParticles(parseInt(e.currentTarget.value)); resetParticles(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #0891b2 ${((numParticles() - 10) / 190) * 100}%, var(--border) ${((numParticles() - 10) / 190) * 100}%)` }}
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>T = {temperature()} K</label>
          <input type="range" min="100" max="1000" step="10" value={temperature()}
            onInput={(e) => setTemperature(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #0891b2 ${((temperature() - 100) / 900) * 100}%, var(--border) ${((temperature() - 100) / 900) * 100}%)` }}
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>V ~ {volume()}</label>
          <input type="range" min="120" max="340" step="5" value={volume()}
            onInput={(e) => { setVolume(parseInt(e.currentTarget.value)); resetParticles(); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #0891b2 ${((volume() - 120) / 220) * 100}%, var(--border) ${((volume() - 120) / 220) * 100}%)` }}
          />
        </div>
      </div>

      <svg width="100%" height="230" viewBox="0 0 420 230" class="mx-auto">
        {/* Container box */}
        <rect x="50" y={containerY} width={volume()} height={containerHeight}
          fill="none" stroke="#0891b2" stroke-width="2" rx="3" />

        {/* Piston-like right wall highlight */}
        <rect x={50 + volume() - 3} y={containerY} width="6" height={containerHeight}
          fill="#0891b2" opacity="0.3" rx="2" />

        {/* Particles */}
        <For each={particles()}>
          {(p) => (
            <circle cx={p.x} cy={p.y} r="3"
              fill="#0891b2" opacity="0.7" />
          )}
        </For>

        {/* Labels */}
        <text x="210" y="215" text-anchor="middle" font-size="10" fill="var(--text-muted)">
          PV = NkT | Ideal Gas in a Box
        </text>
      </svg>

      <div class="flex justify-center gap-2">
        <button onClick={resetParticles}
          class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: "#0891b2", color: "white" }}>
          Reinitialize
        </button>
      </div>

      <div class="grid grid-cols-4 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>N</div>
          <div class="text-lg font-bold" style={{ color: "#0891b2" }}>{numParticles()}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>T (K)</div>
          <div class="text-lg font-bold" style={{ color: "#0891b2" }}>{temperature()}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>V (arb)</div>
          <div class="text-lg font-bold" style={{ color: "#0891b2" }}>{volume()}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>P (arb)</div>
          <div class="text-lg font-bold" style={{ color: "#0891b2" }}>{pressure().toExponential(2)}</div>
        </div>
      </div>
    </div>
  );
};

// ─── S7Equipartition ────────────────────────────────────────────────────────
// Equipartition theorem: each quadratic DOF contributes kT/2
export const S7Equipartition: Component = () => {
  const [temperature, setTemperature] = createSignal(3.0); // in kT units
  const [moleculeType, setMoleculeType] = createSignal<"monatomic" | "diatomic" | "polyatomic">("diatomic");

  // Degrees of freedom by type
  const dofBreakdown = createMemo(() => {
    const T = temperature();
    const type = moleculeType();
    const trans = [
      { label: "Trans x", color: "#06b6d4", energy: T / 2 },
      { label: "Trans y", color: "#06b6d4", energy: T / 2 },
      { label: "Trans z", color: "#06b6d4", energy: T / 2 },
    ];
    if (type === "monatomic") return trans;

    const rot = type === "diatomic"
      ? [
          { label: "Rot 1", color: "#f59e0b", energy: T / 2 },
          { label: "Rot 2", color: "#f59e0b", energy: T / 2 },
        ]
      : [
          { label: "Rot 1", color: "#f59e0b", energy: T / 2 },
          { label: "Rot 2", color: "#f59e0b", energy: T / 2 },
          { label: "Rot 3", color: "#f59e0b", energy: T / 2 },
        ];

    // Vibration: for diatomic, "activate" at higher T (T > 4 kT ~ high T regime)
    // For polyatomic, always show some vibrational modes
    const vib: { label: string; color: string; energy: number }[] = [];
    if (type === "diatomic" && T > 4) {
      vib.push(
        { label: "Vib KE", color: "#f43f5e", energy: T / 2 },
        { label: "Vib PE", color: "#f43f5e", energy: T / 2 },
      );
    }
    if (type === "polyatomic") {
      // Nonlinear triatomic: 3 vibration modes x 2 quadratic terms = up to 6 DOF
      vib.push(
        { label: "Vib 1 KE", color: "#f43f5e", energy: T / 2 },
        { label: "Vib 1 PE", color: "#f43f5e", energy: T / 2 },
        { label: "Vib 2 KE", color: "#f43f5e", energy: T / 2 },
        { label: "Vib 2 PE", color: "#f43f5e", energy: T / 2 },
      );
    }

    return [...trans, ...rot, ...vib];
  });

  const totalDOF = createMemo(() => dofBreakdown().length);
  const totalEnergy = createMemo(() => dofBreakdown().reduce((s, d) => s + d.energy, 0));
  const heatCapacity = createMemo(() => totalDOF() / 2); // Cv / k = f/2

  // Chart dimensions
  const chartLeft = 45;
  const chartRight = 390;
  const chartTop = 30;
  const chartBottom = 175;
  const chartH = chartBottom - chartTop;

  const maxBarEnergy = createMemo(() => Math.max(...dofBreakdown().map((d) => d.energy), 1));

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>T = {temperature().toFixed(1)} kT</label>
        <input type="range" min="0.5" max="10" step="0.1" value={temperature()}
          onInput={(e) => setTemperature(parseFloat(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #0891b2 ${((temperature() - 0.5) / 9.5) * 100}%, var(--border) ${((temperature() - 0.5) / 9.5) * 100}%)` }}
        />
      </div>

      <div class="flex justify-center gap-2">
        {(["monatomic", "diatomic", "polyatomic"] as const).map((type) => (
          <button
            onClick={() => setMoleculeType(type)}
            class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all capitalize"
            style={{
              background: moleculeType() === type ? "#0891b2" : "var(--bg-secondary)",
              color: moleculeType() === type ? "white" : "var(--text-secondary)",
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <svg width="100%" height="220" viewBox="0 0 420 220" class="mx-auto">
        {/* Axes */}
        <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} stroke="var(--border)" stroke-width="1" />
        <line x1={chartLeft} y1={chartBottom} x2={chartLeft} y2={chartTop} stroke="var(--border)" stroke-width="1" />
        <text x="15" y={((chartTop + chartBottom) / 2)} text-anchor="middle" font-size="9" fill="var(--text-muted)"
          transform={`rotate(-90 15 ${(chartTop + chartBottom) / 2})`}>Energy (kT)</text>

        {/* kT/2 reference line */}
        {(() => {
          const yRef = chartBottom - (temperature() / 2 / maxBarEnergy()) * chartH;
          return (
            <>
              <line x1={chartLeft} y1={yRef} x2={chartRight} y2={yRef}
                stroke="var(--text-muted)" stroke-width="0.7" stroke-dasharray="3 3" />
              <text x={chartRight + 2} y={yRef + 3} font-size="7" fill="var(--text-muted)">kT/2</text>
            </>
          );
        })()}

        {/* Bars */}
        {dofBreakdown().map((dof, i) => {
          const n = dofBreakdown().length;
          const barWidth = Math.min(30, (chartRight - chartLeft - 10) / n - 4);
          const gap = (chartRight - chartLeft - n * barWidth) / (n + 1);
          const bx = chartLeft + gap + i * (barWidth + gap);
          const barH = (dof.energy / maxBarEnergy()) * chartH;
          return (
            <>
              <rect x={bx} y={chartBottom - barH} width={barWidth} height={barH}
                fill={dof.color} opacity="0.75" rx="2" />
              <text x={bx + barWidth / 2} y={chartBottom + 12} text-anchor="middle"
                font-size="7" fill="var(--text-muted)"
                transform={`rotate(-30 ${bx + barWidth / 2} ${chartBottom + 12})`}>
                {dof.label}
              </text>
              <text x={bx + barWidth / 2} y={chartBottom - barH - 4} text-anchor="middle"
                font-size="7" fill={dof.color} font-weight="600">
                {dof.energy.toFixed(2)}
              </text>
            </>
          );
        })}

        {/* Legend */}
        <rect x="300" y="5" width="8" height="8" fill="#06b6d4" rx="1" />
        <text x="312" y="12" font-size="8" fill="var(--text-muted)">Translation</text>
        <rect x="300" y="17" width="8" height="8" fill="#f59e0b" rx="1" />
        <text x="312" y="24" font-size="8" fill="var(--text-muted)">Rotation</text>
        <rect x="300" y="29" width="8" height="8" fill="#f43f5e" rx="1" />
        <text x="312" y="36" font-size="8" fill="var(--text-muted)">Vibration</text>
      </svg>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>DOF (f)</div>
          <div class="text-lg font-bold" style={{ color: "#0891b2" }}>{totalDOF()}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>E = (f/2)kT</div>
          <div class="text-lg font-bold" style={{ color: "#0891b2" }}>{totalEnergy().toFixed(2)} kT</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Cv / k</div>
          <div class="text-lg font-bold" style={{ color: "#0891b2" }}>{heatCapacity().toFixed(1)}</div>
        </div>
      </div>

      <div class="text-center text-[11px]" style={{ color: "var(--text-muted)" }}>
        Each bar = kT/2 per quadratic degree of freedom |
        {moleculeType() === "diatomic" && temperature() <= 4 ? " Vibrations frozen out at low T" : ""}
        {moleculeType() === "diatomic" && temperature() > 4 ? " Vibrations activated at high T" : ""}
        {moleculeType() === "monatomic" ? " Point particle: translation only" : ""}
        {moleculeType() === "polyatomic" ? " Nonlinear molecule: 3 rot + vibrations" : ""}
      </div>
    </div>
  );
};

// ─── S7HeatCapacity ─────────────────────────────────────────────────────────
// Einstein & Debye models of solid heat capacity vs temperature
export const S7HeatCapacity: Component = () => {
  const [thetaE, setThetaE] = createSignal(300); // Einstein temperature
  const [currentT, setCurrentT] = createSignal(1.5); // T / thetaE ratio

  // Einstein model: Cv/3Nk = (thetaE/T)^2 * exp(thetaE/T) / (exp(thetaE/T)-1)^2
  const einsteinCurve = createMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 1; i <= 200; i++) {
      const ratio = (i / 200) * 5; // T/thetaE from 0 to 5
      if (ratio < 0.01) { pts.push({ x: ratio, y: 0 }); continue; }
      const u = 1 / ratio; // thetaE / T
      const eu = Math.exp(u);
      const cv = u * u * eu / ((eu - 1) * (eu - 1));
      pts.push({ x: ratio, y: Math.min(cv, 1.2) });
    }
    return pts;
  });

  // Debye model: Cv/3Nk = 9(T/thetaD)^3 * integral_0^(thetaD/T) x^4 * e^x / (e^x - 1)^2 dx
  const debyeCurve = createMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 1; i <= 200; i++) {
      const ratio = (i / 200) * 5; // T/thetaD
      if (ratio < 0.01) { pts.push({ x: ratio, y: 0 }); continue; }
      const upper = 1 / ratio; // thetaD / T
      const nSteps = 100;
      const dx = upper / nSteps;
      let integral = 0;
      for (let j = 1; j <= nSteps; j++) {
        const x = j * dx;
        if (x > 500) break; // avoid overflow
        const ex = Math.exp(Math.min(x, 500));
        const integrand = x * x * x * x * ex / ((ex - 1) * (ex - 1));
        integral += integrand * dx;
      }
      const cv = 9 * ratio * ratio * ratio * integral;
      pts.push({ x: ratio, y: Math.min(cv, 1.2) });
    }
    return pts;
  });

  // Chart layout
  const pLeft = 55;
  const pRight = 395;
  const pTop = 25;
  const pBottom = 195;
  const pW = pRight - pLeft;
  const pH = pBottom - pTop;

  const toSvgX = (ratio: number) => pLeft + (ratio / 5) * pW;
  const toSvgY = (cv: number) => pBottom - (cv / 1.2) * pH;

  // Current Einstein Cv value
  const currentEinsteinCv = createMemo(() => {
    const ratio = currentT();
    if (ratio < 0.01) return 0;
    const u = 1 / ratio;
    const eu = Math.exp(u);
    return u * u * eu / ((eu - 1) * (eu - 1));
  });

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>
            {"\u03B8"}E = {thetaE()} K
          </label>
          <input type="range" min="100" max="1000" step="10" value={thetaE()}
            onInput={(e) => setThetaE(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #0891b2 ${((thetaE() - 100) / 900) * 100}%, var(--border) ${((thetaE() - 100) / 900) * 100}%)` }}
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "75px" }}>
            T/{"\u03B8"}E = {currentT().toFixed(2)}
          </label>
          <input type="range" min="0.05" max="5" step="0.05" value={currentT()}
            onInput={(e) => setCurrentT(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #0891b2 ${((currentT() - 0.05) / 4.95) * 100}%, var(--border) ${((currentT() - 0.05) / 4.95) * 100}%)` }}
          />
        </div>
      </div>

      <svg width="100%" height="240" viewBox="0 0 420 240" class="mx-auto">
        {/* Axes */}
        <line x1={pLeft} y1={pBottom} x2={pRight} y2={pBottom} stroke="var(--border)" stroke-width="1" />
        <line x1={pLeft} y1={pBottom} x2={pLeft} y2={pTop} stroke="var(--border)" stroke-width="1" />
        <text x={(pLeft + pRight) / 2} y={pBottom + 20} text-anchor="middle" font-size="9" fill="var(--text-muted)">
          T / {"\u03B8"} (Einstein or Debye)
        </text>
        <text x="18" y={(pTop + pBottom) / 2} text-anchor="middle" font-size="9" fill="var(--text-muted)"
          transform={`rotate(-90 18 ${(pTop + pBottom) / 2})`}>
          Cv / 3Nk
        </text>

        {/* X-axis ticks */}
        {[0, 1, 2, 3, 4, 5].map((v) => (
          <>
            <line x1={toSvgX(v)} y1={pBottom} x2={toSvgX(v)} y2={pBottom + 4} stroke="var(--border)" stroke-width="1" />
            <text x={toSvgX(v)} y={pBottom + 13} text-anchor="middle" font-size="8" fill="var(--text-muted)">{v}</text>
          </>
        ))}

        {/* Y-axis ticks */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((v) => (
          <>
            <line x1={pLeft - 4} y1={toSvgY(v)} x2={pLeft} y2={toSvgY(v)} stroke="var(--border)" stroke-width="1" />
            <text x={pLeft - 7} y={toSvgY(v) + 3} text-anchor="end" font-size="7" fill="var(--text-muted)">{v.toFixed(2)}</text>
          </>
        ))}

        {/* Classical limit (Dulong-Petit): Cv/3Nk = 1 */}
        <line x1={pLeft} y1={toSvgY(1)} x2={pRight} y2={toSvgY(1)}
          stroke="#10b981" stroke-width="1.5" stroke-dasharray="2 4" />
        <text x={pRight + 3} y={toSvgY(1) + 3} font-size="7" fill="#10b981">3Nk</text>

        {/* Einstein curve (solid) */}
        <path d={einsteinCurve().map((p, i) => {
          const px = toSvgX(p.x);
          const py = toSvgY(p.y);
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ")} fill="none" stroke="#0891b2" stroke-width="2.5" />

        {/* Einstein fill */}
        <path d={einsteinCurve().map((p, i) => {
          const px = toSvgX(p.x);
          const py = toSvgY(p.y);
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ") + ` L${pRight},${pBottom} L${pLeft},${pBottom} Z`}
          fill="#0891b2" opacity="0.06" />

        {/* Debye curve (dashed) */}
        <path d={debyeCurve().map((p, i) => {
          const px = toSvgX(p.x);
          const py = toSvgY(p.y);
          return `${i === 0 ? "M" : "L"}${px},${py}`;
        }).join(" ")} fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 3" />

        {/* Current temperature indicator */}
        <line x1={toSvgX(currentT())} y1={pTop} x2={toSvgX(currentT())} y2={pBottom}
          stroke="#ec4899" stroke-width="1.5" stroke-dasharray="3 3" />
        <circle cx={toSvgX(currentT())} cy={toSvgY(currentEinsteinCv())}
          r="5" fill="#0891b2" stroke="white" stroke-width="1.5" />
        <text x={toSvgX(currentT())} y={pTop - 5} text-anchor="middle" font-size="8" fill="#ec4899" font-weight="600">
          T = {(currentT() * thetaE()).toFixed(0)} K
        </text>

        {/* Legend */}
        <line x1="280" y1="35" x2="300" y2="35" stroke="#0891b2" stroke-width="2" />
        <text x="304" y="38" font-size="8" fill="var(--text-muted)">Einstein</text>
        <line x1="280" y1="48" x2="300" y2="48" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5 3" />
        <text x="304" y="51" font-size="8" fill="var(--text-muted)">Debye</text>
        <line x1="280" y1="61" x2="300" y2="61" stroke="#10b981" stroke-width="1.5" stroke-dasharray="2 4" />
        <text x="304" y="64" font-size="8" fill="var(--text-muted)">Classical (3Nk)</text>
      </svg>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{"\u03B8"}E</div>
          <div class="text-lg font-bold" style={{ color: "#0891b2" }}>{thetaE()} K</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>T</div>
          <div class="text-lg font-bold" style={{ color: "#ec4899" }}>{(currentT() * thetaE()).toFixed(0)} K</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Cv / 3Nk</div>
          <div class="text-lg font-bold" style={{ color: "#0891b2" }}>{currentEinsteinCv().toFixed(3)}</div>
        </div>
      </div>

      <div class="text-center text-[11px]" style={{ color: "var(--text-muted)" }}>
        {currentT() < 0.3 ? "Quantum freeze-out: modes frozen, Cv ~ 0" :
         currentT() > 3 ? "Classical limit: Cv approaches 3Nk (Dulong-Petit)" :
         "Intermediate regime: quantum effects partially suppress Cv"}
      </div>
    </div>
  );
};
