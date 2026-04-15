import { Component, createSignal, createMemo, For } from "solid-js";

const ACCENT = "#fbbf24";
const PLANCK_COLOR = "#f59e0b";
const WIEN_COLOR = "#ef4444";
const RJ_COLOR = "#3b82f6";

// Physical constants (SI)
const h = 6.626e-34;    // Planck's constant
const c = 3e8;           // speed of light
const kB = 1.381e-23;   // Boltzmann constant
const sigma_SB = 5.670e-8; // Stefan-Boltzmann constant

// CIE 1931 2-degree observer color matching (simplified 10nm intervals from 380-780nm)
const CIE_LAMBDA = [
  380,390,400,410,420,430,440,450,460,470,480,490,500,510,520,530,540,550,560,570,
  580,590,600,610,620,630,640,650,660,670,680,690,700,710,720,730,740,750,760,770,780
];
const CIE_X = [
  0.0014,0.0042,0.0143,0.0435,0.1344,0.2839,0.3483,0.3362,0.2908,0.1954,0.0956,
  0.0320,0.0049,0.0093,0.0633,0.1655,0.2904,0.4334,0.5945,0.7621,0.9163,1.0263,
  1.0622,1.0026,0.8544,0.6424,0.4479,0.2835,0.1649,0.0874,0.0468,0.0227,0.0114,
  0.0058,0.0029,0.0014,0.0007,0.0003,0.0002,0.0001,0.0000
];
const CIE_Y = [
  0.0000,0.0001,0.0004,0.0012,0.0040,0.0116,0.0230,0.0380,0.0600,0.0910,0.1390,
  0.2080,0.3230,0.5030,0.7100,0.8620,0.9540,0.9950,0.9950,0.9520,0.8700,0.7570,
  0.6310,0.5030,0.3810,0.2650,0.1750,0.1070,0.0610,0.0320,0.0170,0.0082,0.0041,
  0.0021,0.0010,0.0005,0.0003,0.0001,0.0001,0.0000,0.0000
];
const CIE_Z = [
  0.0065,0.0201,0.0679,0.2074,0.6456,1.3856,1.7471,1.7721,1.6692,1.2876,0.8130,
  0.4652,0.2720,0.1582,0.0782,0.0422,0.0203,0.0087,0.0039,0.0021,0.0017,0.0011,
  0.0008,0.0003,0.0002,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,
  0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000
];

// Convert blackbody temperature to sRGB color
function blackbodyColor(T: number): string {
  let X = 0, Y = 0, Z = 0;
  for (let i = 0; i < CIE_LAMBDA.length; i++) {
    const lambda_m = CIE_LAMBDA[i] * 1e-9;
    const exp_arg = h * c / (lambda_m * kB * T);
    if (exp_arg > 500) continue;
    const B = (2 * h * c * c) / (Math.pow(lambda_m, 5) * (Math.exp(exp_arg) - 1));
    X += B * CIE_X[i];
    Y += B * CIE_Y[i];
    Z += B * CIE_Z[i];
  }
  // Normalize
  const maxVal = Math.max(X, Y, Z, 1e-10);
  X /= maxVal; Y /= maxVal; Z /= maxVal;

  // XYZ to linear sRGB
  let r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z;
  let g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
  let b = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;

  // Clamp negatives
  const maxC = Math.max(r, g, b, 1e-10);
  if (r < 0 || g < 0 || b < 0) {
    r = Math.max(r, 0);
    g = Math.max(g, 0);
    b = Math.max(b, 0);
  }
  // Normalize to max 1
  const scale = 1 / Math.max(r, g, b, 1e-10);
  r *= scale; g *= scale; b *= scale;

  // Gamma correction (sRGB)
  const gammaCorrect = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  const R = Math.round(Math.min(255, Math.max(0, gammaCorrect(r) * 255)));
  const G = Math.round(Math.min(255, Math.max(0, gammaCorrect(g) * 255)));
  const B_val = Math.round(Math.min(255, Math.max(0, gammaCorrect(b) * 255)));

  return `rgb(${R},${G},${B_val})`;
}

// Planck spectral radiance B(lambda, T) in W/(m² sr nm)
function planckLambda(lambda_nm: number, T: number): number {
  const lambda_m = lambda_nm * 1e-9;
  const exp_arg = h * c / (lambda_m * kB * T);
  if (exp_arg > 500) return 0;
  return (2 * h * c * c) / (Math.pow(lambda_m, 5) * (Math.exp(exp_arg) - 1)) * 1e-9;
}

// Rayleigh-Jeans approximation
function rayleighJeans(lambda_nm: number, T: number): number {
  const lambda_m = lambda_nm * 1e-9;
  return (2 * c * kB * T) / Math.pow(lambda_m, 4) * 1e-9;
}

// Wien's displacement law: lambda_max = b/T
const bWien = 2.898e-3; // Wien displacement constant (m·K)

// ─── S13PlanckSpectrum ───────────────────────────────────────────────────────
// Planck's law spectral radiance as a function of wavelength at a given temperature.
export const S13PlanckSpectrum: Component = () => {
  const [temperature, setTemperature] = createSignal(5500);
  const [showWien, setShowWien] = createSignal(true);

  const lambdaMin = 50, lambdaMax = 3000; // nm
  const N = 200;

  const spectrum = createMemo(() => {
    const T = temperature();
    const pts: { lambda: number; B: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const lambda = lambdaMin + (i / N) * (lambdaMax - lambdaMin);
      pts.push({ lambda, B: planckLambda(lambda, T) });
    }
    return pts;
  });

  const peakLambda = createMemo(() => bWien / temperature() * 1e9); // nm
  const peakB = createMemo(() => planckLambda(peakLambda(), temperature()));
  const totalPower = createMemo(() => sigma_SB * Math.pow(temperature(), 4));
  const bbColor = createMemo(() => blackbodyColor(temperature()));

  const W = 440, H = 240;
  const pad = { l: 55, r: 15, t: 25, b: 40 };

  const maxB = createMemo(() => Math.max(...spectrum().map(p => p.B)) * 1.1);

  const toSVG = (lambda: number, B: number) => ({
    x: pad.l + ((lambda - lambdaMin) / (lambdaMax - lambdaMin)) * (W - pad.l - pad.r),
    y: pad.t + ((maxB() - B) / maxB()) * (H - pad.t - pad.b),
  });

  const spectrumPath = createMemo(() =>
    spectrum().map((p, i) => {
      const { x, y } = toSVG(p.lambda, p.B);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ")
  );

  // Visible spectrum gradient bar
  const visibleBar = createMemo(() => {
    const bars: { x: number; width: number; color: string }[] = [];
    for (let lambda = 380; lambda <= 780; lambda += 5) {
      const { x } = toSVG(lambda, 0);
      const { x: x2 } = toSVG(lambda + 5, 0);
      // Approximate wavelength to color
      let r = 0, g = 0, b = 0;
      if (lambda < 440) { r = -(lambda - 440) / 60; b = 1; }
      else if (lambda < 490) { g = (lambda - 440) / 50; b = 1; }
      else if (lambda < 510) { g = 1; b = -(lambda - 510) / 20; }
      else if (lambda < 580) { r = (lambda - 510) / 70; g = 1; }
      else if (lambda < 645) { r = 1; g = -(lambda - 645) / 65; }
      else { r = 1; }
      // Intensity falloff at edges
      let factor = 1;
      if (lambda < 420) factor = 0.3 + 0.7 * (lambda - 380) / 40;
      else if (lambda > 700) factor = 0.3 + 0.7 * (780 - lambda) / 80;
      bars.push({
        x, width: x2 - x,
        color: `rgb(${Math.round(r * 255 * factor)},${Math.round(g * 255 * factor)},${Math.round(b * 255 * factor)})`
      });
    }
    return bars;
  });

  const tPct = () => ((temperature() - 1000) / 19000) * 100;

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-3">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "130px" }}>T = {temperature()} K</label>
        <input type="range" min="1000" max="20000" step="100" value={temperature()} onInput={(e) => setTemperature(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #ff4444 0%, #ffaa00 30%, #ffffff 60%, #aaccff 100%)` }} />
      </div>

      <div class="flex items-center gap-3">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Wien peak:</label>
        <button onClick={() => setShowWien(!showWien())}
          class="px-3 py-1.5 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: showWien() ? ACCENT : "var(--bg-secondary)", color: showWien() ? "#1a1d23" : "var(--text-secondary)" }}>
          {showWien() ? "Showing" : "Hidden"}
        </button>

        {/* Color swatch */}
        <div class="flex items-center gap-2 ml-auto">
          <span class="text-xs" style={{ color: "var(--text-muted)" }}>Color:</span>
          <div class="w-8 h-8 rounded-full border-2 transition-all" style={{ background: bbColor(), "border-color": "var(--border)", "box-shadow": `0 0 12px ${bbColor()}` }} />
        </div>
      </div>

      <svg width="100%" height="240" viewBox={`0 0 ${W} ${H}`} class="mx-auto">
        <text x={W / 2} y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Planck's Law: Spectral Radiance B({"\u03BB"}, T)
        </text>

        {/* Visible spectrum bar */}
        <For each={visibleBar()}>
          {(bar) => (
            <rect x={bar.x} y={H - pad.b + 2} width={bar.width + 0.5} height="8" fill={bar.color} opacity="0.8" />
          )}
        </For>
        <text x={(toSVG(580, 0).x)} y={H - pad.b + 20} text-anchor="middle" font-size="7" fill="var(--text-muted)">Visible</text>

        {/* Axes */}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke="var(--text-muted)" stroke-width="1" />
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke="var(--text-muted)" stroke-width="1" />
        <text x={(pad.l + W - pad.r) / 2} y={H - 22} text-anchor="middle" font-size="10" fill="var(--text-muted)">{"\u03BB"} (nm)</text>
        <text x={pad.l - 8} y={(pad.t + H - pad.b) / 2} text-anchor="middle" font-size="9" fill="var(--text-muted)" transform={`rotate(-90,${pad.l - 8},${(pad.t + H - pad.b) / 2})`}>B({"\u03BB"},T)</text>

        {/* Wavelength ticks */}
        {[500, 1000, 1500, 2000, 2500].map(l => {
          const { x } = toSVG(l, 0);
          return (
            <>
              <line x1={x} y1={H - pad.b} x2={x} y2={H - pad.b + 4} stroke="var(--text-muted)" stroke-width="0.8" />
              <text x={x} y={H - pad.b + 12} text-anchor="middle" font-size="8" fill="var(--text-muted)">{l}</text>
            </>
          );
        })}

        {/* Spectrum filled area */}
        {(() => {
          const baseY = pad.t + (H - pad.t - pad.b);
          const fillPath = spectrumPath() + ` L${toSVG(lambdaMax, 0).x.toFixed(1)},${baseY} L${pad.l},${baseY} Z`;
          return <path d={fillPath} fill={`${ACCENT}20`} />;
        })()}

        {/* Spectrum curve */}
        <path d={spectrumPath()} fill="none" stroke={PLANCK_COLOR} stroke-width="2.5" stroke-linecap="round" />

        {/* Wien peak marker */}
        {showWien() && peakLambda() >= lambdaMin && peakLambda() <= lambdaMax && (() => {
          const { x, y } = toSVG(peakLambda(), peakB());
          return (
            <>
              <line x1={x} y1={pad.t} x2={x} y2={H - pad.b} stroke={WIEN_COLOR} stroke-width="1.5" stroke-dasharray="5 3" opacity="0.6" />
              <circle cx={x} cy={y} r="5" fill={WIEN_COLOR} stroke="white" stroke-width="1.5" />
              <text x={x + 8} y={y - 8} font-size="9" fill={WIEN_COLOR} font-weight="600">
                {"\u03BB"}max = {peakLambda().toFixed(0)} nm
              </text>
            </>
          );
        })()}
      </svg>

      {/* Stats */}
      <div class="grid grid-cols-4 gap-2 text-center">
        <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-sm font-bold" style={{ color: PLANCK_COLOR }}>{temperature()} K</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Temperature</div>
        </div>
        <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-sm font-bold" style={{ color: WIEN_COLOR }}>{peakLambda().toFixed(0)} nm</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{"\u03BB"}_max (Wien)</div>
        </div>
        <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-sm font-bold" style={{ color: ACCENT }}>{totalPower().toExponential(2)}</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Power (W/m{"\u00B2"})</div>
        </div>
        <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="w-6 h-6 rounded-full mx-auto mb-0.5" style={{ background: bbColor(), "box-shadow": `0 0 8px ${bbColor()}` }} />
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Perceived</div>
        </div>
      </div>
    </div>
  );
};

// ─── S13WienLaw ──────────────────────────────────────────────────────────────
// Wien's displacement law: how peak wavelength shifts with temperature.
// Shows multiple Planck curves at different temperatures overlaid.
export const S13WienLaw: Component = () => {
  const [temperatures, setTemperatures] = createSignal([3000, 4000, 5000, 6000, 8000]);
  const [selectedIdx, setSelectedIdx] = createSignal(2);

  const lambdaMin = 50, lambdaMax = 2500;
  const N = 150;

  const spectra = createMemo(() =>
    temperatures().map(T => {
      const pts: { lambda: number; B: number }[] = [];
      for (let i = 0; i <= N; i++) {
        const lambda = lambdaMin + (i / N) * (lambdaMax - lambdaMin);
        pts.push({ lambda, B: planckLambda(lambda, T) });
      }
      return { T, pts, peak: bWien / T * 1e9, color: blackbodyColor(T) };
    })
  );

  // Wien's law line: lambda_max vs T
  const wienLine = createMemo(() => {
    const pts: { T: number; lambda: number }[] = [];
    for (let T = 2000; T <= 12000; T += 100) {
      pts.push({ T, lambda: bWien / T * 1e9 });
    }
    return pts;
  });

  const W = 440, H = 240;
  const pad = { l: 55, r: 15, t: 25, b: 35 };

  const maxB = createMemo(() => {
    let m = 0;
    for (const s of spectra()) m = Math.max(m, ...s.pts.map(p => p.B));
    return m * 1.1;
  });

  const toSVG = (lambda: number, B: number) => ({
    x: pad.l + ((lambda - lambdaMin) / (lambdaMax - lambdaMin)) * (W - pad.l - pad.r),
    y: pad.t + ((maxB() - B) / maxB()) * (H - pad.t - pad.b),
  });

  const curvePath = (pts: { lambda: number; B: number }[]) =>
    pts.map((p, i) => {
      const { x, y } = toSVG(p.lambda, p.B);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

  const colors = ["#ef4444", "#f97316", "#fbbf24", "#a3e635", "#22d3ee"];

  return (
    <div class="space-y-5">
      {/* Temperature buttons */}
      <div class="flex items-center gap-2 flex-wrap">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Temperatures:</label>
        <For each={temperatures()}>
          {(T, i) => (
            <button onClick={() => setSelectedIdx(i())}
              class="px-3 py-1.5 rounded-lg text-xs font-medium hover:scale-105 transition-all"
              style={{
                background: selectedIdx() === i() ? colors[i()] : "var(--bg-secondary)",
                color: selectedIdx() === i() ? "white" : "var(--text-secondary)",
                "border": `2px solid ${colors[i()]}40`
              }}>
              {T} K
            </button>
          )}
        </For>
      </div>

      <svg width="100%" height="240" viewBox={`0 0 ${W} ${H}`} class="mx-auto">
        <text x={W / 2} y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Wien's Displacement Law: {"\u03BB"}_max {"\u221D"} 1/T
        </text>

        {/* Axes */}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke="var(--text-muted)" stroke-width="1" />
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke="var(--text-muted)" stroke-width="1" />
        <text x={(pad.l + W - pad.r) / 2} y={H - 8} text-anchor="middle" font-size="10" fill="var(--text-muted)">{"\u03BB"} (nm)</text>

        {/* All spectra */}
        <For each={spectra()}>
          {(s, i) => (
            <path d={curvePath(s.pts)} fill="none" stroke={colors[i()]}
              stroke-width={selectedIdx() === i() ? "2.5" : "1.5"}
              opacity={selectedIdx() === i() ? 1 : 0.5}
              stroke-linecap="round" />
          )}
        </For>

        {/* Peak markers with connecting Wien line */}
        <For each={spectra()}>
          {(s, i) => {
            const peakB = planckLambda(s.peak, s.T);
            const { x, y } = toSVG(s.peak, peakB);
            return (
              <>
                <circle cx={x} cy={y} r={selectedIdx() === i() ? "5" : "3"} fill={colors[i()]} stroke="white" stroke-width="1" />
                {selectedIdx() === i() && (
                  <text x={x + 8} y={y - 6} font-size="9" fill={colors[i()]} font-weight="600">
                    {s.peak.toFixed(0)} nm
                  </text>
                )}
              </>
            );
          }}
        </For>

        {/* Wien's law dashed line through peaks */}
        {(() => {
          const peaks = spectra().map(s => {
            const peakB = planckLambda(s.peak, s.T);
            return toSVG(s.peak, peakB);
          });
          const path = peaks.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
          return <path d={path} fill="none" stroke={WIEN_COLOR} stroke-width="1.5" stroke-dasharray="5 3" opacity="0.6" />;
        })()}
      </svg>

      {/* Selected temperature info */}
      {(() => {
        const s = spectra()[selectedIdx()];
        return (
          <div class="grid grid-cols-4 gap-2 text-center">
            <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: `1px solid ${colors[selectedIdx()]}40` }}>
              <div class="text-sm font-bold" style={{ color: colors[selectedIdx()] }}>{s.T} K</div>
              <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Temperature</div>
            </div>
            <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
              <div class="text-sm font-bold" style={{ color: WIEN_COLOR }}>{s.peak.toFixed(0)} nm</div>
              <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{"\u03BB"}_max</div>
            </div>
            <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
              <div class="text-sm font-bold" style={{ color: ACCENT }}>{(sigma_SB * Math.pow(s.T, 4)).toExponential(1)}</div>
              <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Power (W/m{"\u00B2"})</div>
            </div>
            <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
              <div class="w-6 h-6 rounded-full mx-auto mb-0.5" style={{ background: s.color, "box-shadow": `0 0 8px ${s.color}` }} />
              <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Color</div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

// ─── S13UVCatastrophe ────────────────────────────────────────────────────────
// Compare Planck's law with the classical Rayleigh-Jeans prediction to show
// the ultraviolet catastrophe and how quantum mechanics resolved it.
export const S13UVCatastrophe: Component = () => {
  const [temperature, setTemperature] = createSignal(5000);
  const [showRJ, setShowRJ] = createSignal(true);
  const [showPlanck, setShowPlanck] = createSignal(true);

  const lambdaMin = 100, lambdaMax = 3000;
  const N = 200;

  const planckSpec = createMemo(() => {
    const T = temperature();
    const pts: { lambda: number; B: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const lambda = lambdaMin + (i / N) * (lambdaMax - lambdaMin);
      pts.push({ lambda, B: planckLambda(lambda, T) });
    }
    return pts;
  });

  const rjSpec = createMemo(() => {
    const T = temperature();
    const pts: { lambda: number; B: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const lambda = lambdaMin + (i / N) * (lambdaMax - lambdaMin);
      pts.push({ lambda, B: rayleighJeans(lambda, T) });
    }
    return pts;
  });

  // Cap RJ to reasonable display range
  const maxB = createMemo(() => {
    const pMax = Math.max(...planckSpec().map(p => p.B));
    return pMax * 1.5;
  });

  const W = 440, H = 240;
  const pad = { l: 55, r: 15, t: 25, b: 35 };

  const toSVG = (lambda: number, B: number) => ({
    x: pad.l + ((lambda - lambdaMin) / (lambdaMax - lambdaMin)) * (W - pad.l - pad.r),
    y: pad.t + ((maxB() - Math.min(B, maxB())) / maxB()) * (H - pad.t - pad.b),
  });

  const curvePath = (pts: { lambda: number; B: number }[]) =>
    pts.map((p, i) => {
      const B = Math.min(p.B, maxB());
      const { x, y } = toSVG(p.lambda, B);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");

  // Find where RJ diverges significantly (ratio > 2)
  const divergencePoint = createMemo(() => {
    const T = temperature();
    for (let lambda = lambdaMax; lambda >= lambdaMin; lambda -= 10) {
      const pB = planckLambda(lambda, T);
      const rjB = rayleighJeans(lambda, T);
      if (pB > 0 && rjB / pB > 2) return lambda;
    }
    return 500;
  });

  const tPct = () => ((temperature() - 2000) / 13000) * 100;

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-3">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "120px" }}>T = {temperature()} K</label>
        <input type="range" min="2000" max="15000" step="100" value={temperature()} onInput={(e) => setTemperature(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${ACCENT} ${tPct()}%, var(--border) ${tPct()}%)` }} />
      </div>

      <div class="flex items-center gap-2">
        <button onClick={() => setShowPlanck(!showPlanck())}
          class="px-3 py-1.5 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: showPlanck() ? PLANCK_COLOR : "var(--bg-secondary)", color: showPlanck() ? "white" : "var(--text-secondary)" }}>
          Planck (quantum)
        </button>
        <button onClick={() => setShowRJ(!showRJ())}
          class="px-3 py-1.5 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: showRJ() ? RJ_COLOR : "var(--bg-secondary)", color: showRJ() ? "white" : "var(--text-secondary)" }}>
          Rayleigh-Jeans (classical)
        </button>
      </div>

      <svg width="100%" height="240" viewBox={`0 0 ${W} ${H}`} class="mx-auto">
        <text x={W / 2} y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          The Ultraviolet Catastrophe: Classical vs Quantum
        </text>

        {/* UV catastrophe zone */}
        {showRJ() && (() => {
          const { x: x1 } = toSVG(lambdaMin, 0);
          const { x: x2 } = toSVG(divergencePoint(), 0);
          return (
            <rect x={x1} y={pad.t} width={x2 - x1} height={H - pad.t - pad.b} fill="#ef444410" rx="4" />
          );
        })()}
        {showRJ() && (() => {
          const { x } = toSVG((lambdaMin + divergencePoint()) / 2, 0);
          return (
            <text x={x} y={pad.t + 14} text-anchor="middle" font-size="8" fill="#ef4444" opacity="0.7" font-weight="600">
              UV CATASTROPHE
            </text>
          );
        })()}

        {/* Axes */}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke="var(--text-muted)" stroke-width="1" />
        <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke="var(--text-muted)" stroke-width="1" />
        <text x={(pad.l + W - pad.r) / 2} y={H - 8} text-anchor="middle" font-size="10" fill="var(--text-muted)">{"\u03BB"} (nm)</text>

        {/* Rayleigh-Jeans curve */}
        {showRJ() && (
          <path d={curvePath(rjSpec())} fill="none" stroke={RJ_COLOR} stroke-width="2.5" stroke-dasharray="6 3" stroke-linecap="round" />
        )}

        {/* Planck curve */}
        {showPlanck() && (() => {
          const baseY = pad.t + (H - pad.t - pad.b);
          const fillPath = curvePath(planckSpec()) + ` L${toSVG(lambdaMax, 0).x.toFixed(1)},${baseY} L${pad.l},${baseY} Z`;
          return (
            <>
              <path d={fillPath} fill={`${PLANCK_COLOR}15`} />
              <path d={curvePath(planckSpec())} fill="none" stroke={PLANCK_COLOR} stroke-width="2.5" stroke-linecap="round" />
            </>
          );
        })()}

        {/* Arrow showing divergence */}
        {showRJ() && (() => {
          const { x, y } = toSVG(lambdaMin + 50, maxB() * 0.9);
          return (
            <>
              <line x1={x + 20} y1={y + 30} x2={x + 5} y2={y + 5} stroke="#ef4444" stroke-width="1.5" />
              <polygon points={`${x + 5},${y + 5} ${x + 12},${y + 12} ${x + 3},${y + 13}`} fill="#ef4444" />
              <text x={x + 24} y={y + 35} font-size="8" fill="#ef4444" font-weight="600">{"\u221E"} diverges!</text>
            </>
          );
        })()}

        {/* Legend */}
        <line x1={W - 180} y1={pad.t + 28} x2={W - 160} y2={pad.t + 28} stroke={PLANCK_COLOR} stroke-width="2" />
        <text x={W - 156} y={pad.t + 32} font-size="9" fill={PLANCK_COLOR}>Planck (1900)</text>
        <line x1={W - 180} y1={pad.t + 42} x2={W - 160} y2={pad.t + 42} stroke={RJ_COLOR} stroke-width="2" stroke-dasharray="4 2" />
        <text x={W - 156} y={pad.t + 46} font-size="9" fill={RJ_COLOR}>Rayleigh-Jeans</text>
      </svg>

      {/* Info */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-sm font-bold" style={{ color: PLANCK_COLOR }}>{(bWien / temperature() * 1e9).toFixed(0)} nm</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{"\u03BB"}_max (Planck)</div>
        </div>
        <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-sm font-bold" style={{ color: RJ_COLOR }}>{"\u221E"}</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>RJ total energy</div>
        </div>
        <div class="rounded-xl p-2.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
          <div class="text-sm font-bold" style={{ color: ACCENT }}>{(sigma_SB * Math.pow(temperature(), 4)).toExponential(1)}</div>
          <div class="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Planck total (W/m{"\u00B2"})</div>
        </div>
      </div>
    </div>
  );
};
