import { Component, createSignal, createMemo, onCleanup, For } from "solid-js";

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCENT = "#8b5cf6";
const MU0 = 4 * Math.PI * 1e-7; // T m / A
const TWO_PI = 2 * Math.PI;

// ─── E2WireField ──────────────────────────────────────────────────────────────
// Cross-section view of B field from an infinite straight current-carrying wire
export const E2WireField: Component = () => {
  const [current, setCurrent] = createSignal(10);
  const [outOfPage, setOutOfPage] = createSignal(true);
  const [probeR, setProbeR] = createSignal(60);

  const cx = 210, cy = 150;
  const maxR = 130;

  // B field at distance r (in pixel-scaled arbitrary units for display)
  const bAt = (r: number) => {
    if (r < 8) return 0;
    return current() / (TWO_PI * r);
  };

  // B field magnitude for stat card (real units, at probeR mapped to 1-10 cm)
  const realDistance = createMemo(() => {
    // Map probeR [20..130] -> [1..10] cm
    return 1 + ((probeR() - 20) / 110) * 9;
  });

  const realB = createMemo(() => {
    const r = realDistance() * 0.01; // metres
    return (MU0 * current()) / (TWO_PI * r);
  });

  // Concentric field circles
  const fieldCircles = createMemo(() => {
    const rings: { r: number; opacity: number }[] = [];
    for (let r = 25; r <= maxR; r += 22) {
      rings.push({ r, opacity: Math.max(0.2, 1 - r / (maxR * 1.2)) });
    }
    return rings;
  });

  // Arrow grid: sample B vectors on a grid around the wire
  const arrowGrid = createMemo(() => {
    const arrows: { x: number; y: number; angle: number; mag: number }[] = [];
    const dir = outOfPage() ? 1 : -1;
    for (let gx = -2; gx <= 2; gx++) {
      for (let gy = -2; gy <= 2; gy++) {
        if (gx === 0 && gy === 0) continue;
        const px = gx * 42;
        const py = gy * 42;
        const r = Math.sqrt(px * px + py * py);
        const theta = Math.atan2(py, px);
        // B is tangential: perpendicular to radial direction
        const bAngle = theta + (dir * Math.PI) / 2;
        const mag = bAt(r);
        arrows.push({ x: cx + px, y: cy + py, angle: bAngle, mag });
      }
    }
    // Normalize magnitudes
    const maxMag = Math.max(...arrows.map(a => a.mag), 1e-10);
    return arrows.map(a => ({ ...a, mag: a.mag / maxMag }));
  });

  // Mini radial plot data
  const radialPlot = createMemo(() => {
    const pts: { r: number; b: number }[] = [];
    for (let r = 15; r <= maxR; r += 3) {
      pts.push({ r, b: bAt(r) });
    }
    return pts;
  });

  const radialMax = createMemo(() => Math.max(...radialPlot().map(p => p.b), 1e-10));

  const currentPct = () => ((current() - 1) / 19) * 100;
  const probePct = () => ((probeR() - 20) / 110) * 100;

  return (
    <div class="space-y-5">
      {/* Controls */}
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "65px" }}>I = {current()} A</label>
          <input type="range" min="1" max="20" step="1" value={current()} onInput={(e) => setCurrent(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${currentPct()}%, var(--border) ${currentPct()}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "65px" }}>r = {realDistance().toFixed(1)} cm</label>
          <input type="range" min="20" max="130" step="1" value={probeR()} onInput={(e) => setProbeR(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${probePct()}%, var(--border) ${probePct()}%)` }} />
        </div>
      </div>

      <div class="flex gap-2 justify-center">
        <button class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: ACCENT, color: "white" }}
          onClick={() => setOutOfPage(!outOfPage())}>
          Current: {outOfPage() ? "Out of Page \u2299" : "Into Page \u2297"}
        </button>
      </div>

      {/* Main SVG */}
      <svg width="100%" height="300" viewBox="0 0 420 300" class="mx-auto">
        <rect x="0" y="0" width="420" height="300" fill="none" />
        <text x="210" y="16" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          B Field Around Infinite Straight Wire (Cross-Section)
        </text>

        {/* Concentric field circles with tangential arrows */}
        <For each={fieldCircles()}>
          {(ring) => {
            const dir = outOfPage() ? 1 : -1;
            const nArrows = Math.max(4, Math.round(ring.r / 12));
            const arrowLen = 8 + 4 * ring.opacity;
            return (
              <>
                <circle cx={cx} cy={cy} r={ring.r} fill="none" stroke={ACCENT} stroke-width="0.8"
                  stroke-dasharray="4 3" opacity={ring.opacity * 0.5} />
                {Array.from({ length: nArrows }, (_, i) => {
                  const angle = (TWO_PI * i) / nArrows;
                  const px = cx + ring.r * Math.cos(angle);
                  const py = cy + ring.r * Math.sin(angle);
                  const tangent = angle + (dir * Math.PI) / 2;
                  const tipX = px + arrowLen * Math.cos(tangent);
                  const tipY = py + arrowLen * Math.sin(tangent);
                  const h1X = tipX - 4 * Math.cos(tangent - 0.4);
                  const h1Y = tipY - 4 * Math.sin(tangent - 0.4);
                  const h2X = tipX - 4 * Math.cos(tangent + 0.4);
                  const h2Y = tipY - 4 * Math.sin(tangent + 0.4);
                  return (
                    <g opacity={ring.opacity}>
                      <line x1={px} y1={py} x2={tipX} y2={tipY} stroke={ACCENT} stroke-width="1.5" />
                      <polygon points={`${tipX},${tipY} ${h1X},${h1Y} ${h2X},${h2Y}`} fill={ACCENT} />
                    </g>
                  );
                })}
              </>
            );
          }}
        </For>

        {/* Arrow grid showing vector field */}
        <For each={arrowGrid()}>
          {(a) => {
            const len = 6 + a.mag * 12;
            const tipX = a.x + len * Math.cos(a.angle);
            const tipY = a.y + len * Math.sin(a.angle);
            const h1X = tipX - 3.5 * Math.cos(a.angle - 0.5);
            const h1Y = tipY - 3.5 * Math.sin(a.angle - 0.5);
            const h2X = tipX - 3.5 * Math.cos(a.angle + 0.5);
            const h2Y = tipY - 3.5 * Math.sin(a.angle + 0.5);
            // Color by magnitude: stronger = more saturated accent
            const alpha = 0.3 + a.mag * 0.7;
            return (
              <g opacity={alpha}>
                <line x1={a.x} y1={a.y} x2={tipX} y2={tipY} stroke={ACCENT} stroke-width="1.2" />
                <polygon points={`${tipX},${tipY} ${h1X},${h1Y} ${h2X},${h2Y}`} fill={ACCENT} />
              </g>
            );
          }}
        </For>

        {/* Wire cross-section */}
        <circle cx={cx} cy={cy} r="12" fill="var(--card-bg)" stroke={ACCENT} stroke-width="2" />
        {outOfPage() ? (
          /* Dot for out of page */
          <circle cx={cx} cy={cy} r="4" fill={ACCENT} />
        ) : (
          /* X for into page */
          <>
            <line x1={cx - 5} y1={cy - 5} x2={cx + 5} y2={cy + 5} stroke={ACCENT} stroke-width="2.5" />
            <line x1={cx + 5} y1={cy - 5} x2={cx - 5} y2={cy + 5} stroke={ACCENT} stroke-width="2.5" />
          </>
        )}

        {/* Probe distance indicator */}
        <circle cx={cx + probeR()} cy={cy} r="4" fill="#f59e0b" stroke="#eab308" stroke-width="1" />
        <line x1={cx + 14} y1={cy} x2={cx + probeR() - 5} y2={cy} stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 2" />
        <text x={cx + probeR() / 2 + 7} y={cy - 6} text-anchor="middle" font-size="8" fill="#f59e0b">r</text>

        {/* Mini radial B(r) plot in bottom-right corner */}
        <rect x="300" y="200" width="110" height="85" rx="4" fill="var(--card-bg)" stroke="var(--border)" stroke-width="0.5" opacity="0.9" />
        <text x="355" y="213" text-anchor="middle" font-size="8" font-weight="600" fill="var(--text-muted)">B vs r (1/r decay)</text>
        <line x1="315" y1="275" x2="400" y2="275" stroke="var(--border)" stroke-width="0.5" />
        <line x1="315" y1="220" x2="315" y2="275" stroke="var(--border)" stroke-width="0.5" />
        <text x="358" y="284" text-anchor="middle" font-size="7" fill="var(--text-muted)">r</text>
        <text x="309" y="248" text-anchor="middle" font-size="7" fill="var(--text-muted)" transform="rotate(-90 309 248)">B</text>
        <polyline
          points={radialPlot().map(p => {
            const px = 315 + ((p.r - 15) / (maxR - 15)) * 83;
            const py = 273 - (p.b / radialMax()) * 50;
            return `${px.toFixed(1)},${py.toFixed(1)}`;
          }).join(" ")}
          fill="none" stroke={ACCENT} stroke-width="1.5" />
        {/* Mark probe position on the plot */}
        {probeR() >= 15 && probeR() <= maxR && (
          <circle
            cx={315 + ((probeR() - 15) / (maxR - 15)) * 83}
            cy={273 - (bAt(probeR()) / radialMax()) * 50}
            r="3" fill="#f59e0b" stroke="#eab308" stroke-width="0.8" />
        )}
      </svg>

      {/* Stat cards */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Current I</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{current()} A</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Distance r</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>{realDistance().toFixed(1)} cm</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>B at r</div>
          <div class="text-lg font-bold" style={{ color: "#10b981" }}>{(realB() * 1e6).toFixed(1)} {"\u00B5T"}</div>
        </div>
      </div>
    </div>
  );
};


// ─── E2HelmholtzCoils ─────────────────────────────────────────────────────────
// Side view (xz-plane) of two coils with adjustable separation, showing B on axis
export const E2HelmholtzCoils: Component = () => {
  const R = 60; // Coil radius in pixels
  const [separation, setSeparation] = createSignal(1.0); // d/R ratio
  const [current, setCurrent] = createSignal(10);

  const cx = 210, cy = 110;
  const axisLen = 180;

  // B on axis from a single loop at position z0, evaluated at z
  // B = mu0 I R^2 / (2 (R^2 + (z-z0)^2)^(3/2))
  // We work in scaled units: lengths in units of R, B in units of mu0*I/(2R)
  const bSingleCoil = (z: number, z0: number): number => {
    const dz = z - z0;
    return 1 / Math.pow(1 + dz * dz, 1.5);
  };

  // Total B on axis from both coils (same current direction)
  const bTotal = (z: number): number => {
    const d = separation();
    const z1 = -d / 2;
    const z2 = d / 2;
    return bSingleCoil(z, z1) + bSingleCoil(z, z2);
  };

  // Axis plot data (z in units of R, from -2.5R to +2.5R)
  const axisData = createMemo(() => {
    const pts: { z: number; b: number }[] = [];
    for (let i = 0; i <= 200; i++) {
      const z = -2.5 + (i / 200) * 5;
      pts.push({ z, b: bTotal(z) });
    }
    return pts;
  });

  const bMax = createMemo(() => Math.max(...axisData().map(p => p.b), 0.01));
  const bCenter = createMemo(() => bTotal(0));

  // Uniformity: % variation in central region |z| < 0.3R
  const uniformity = createMemo(() => {
    const pts = axisData().filter(p => Math.abs(p.z) < 0.3);
    if (pts.length < 2) return 0;
    const bVals = pts.map(p => p.b);
    const bMin = Math.min(...bVals);
    const bMaxLocal = Math.max(...bVals);
    const bAvg = (bMin + bMaxLocal) / 2;
    if (bAvg < 1e-10) return 0;
    return ((bMaxLocal - bMin) / bAvg) * 100;
  });

  // Real B at center (SI units)
  const realBCenter = createMemo(() => {
    const Rreal = 0.1; // 10 cm coil radius
    return (MU0 * current() / (2 * Rreal)) * bCenter();
  });

  const isHelmholtz = createMemo(() => Math.abs(separation() - 1.0) < 0.08);

  const sepPct = () => ((separation() - 0.5) / 2.5) * 100;
  const curPct = () => ((current() - 1) / 19) * 100;

  // Approximate vector field in xz plane
  const fieldVectors = createMemo(() => {
    const d = separation();
    const z1 = -d / 2;
    const z2 = d / 2;
    const vectors: { x: number; z: number; bx: number; bz: number; mag: number }[] = [];

    for (let zi = -2; zi <= 2; zi += 0.6) {
      for (let xi = -1.5; xi <= 1.5; xi += 0.6) {
        if (Math.abs(xi) < 0.15 && Math.abs(zi) < 0.15) continue;
        let bz = 0, bx = 0;
        // Approximate off-axis field using dipole-like contribution from each coil
        for (const z0 of [z1, z2]) {
          const dz = zi - z0;
          const rr = Math.sqrt(xi * xi + dz * dz);
          if (rr < 0.2) continue;
          const denom = Math.pow(1 + rr * rr, 2.5);
          // On-axis component
          bz += (1 - 1.5 * xi * xi / (1 + rr * rr)) / Math.pow(1 + dz * dz + xi * xi, 1.5);
          // Radial component (approximate)
          bx += (-1.5 * xi * dz) / Math.pow(1 + dz * dz + xi * xi, 2.5) * 2;
        }
        const mag = Math.sqrt(bx * bx + bz * bz);
        vectors.push({ x: xi, z: zi, bx, bz, mag });
      }
    }
    const maxM = Math.max(...vectors.map(v => v.mag), 1e-10);
    return vectors.map(v => ({ ...v, bx: v.bx / maxM, bz: v.bz / maxM, mag: v.mag / maxM }));
  });

  // Plot coordinate conversions for the axis plot
  const plotY0 = 200, plotH = 80, plotX0 = 40, plotW = 340;
  const toPlotX = (z: number) => plotX0 + ((z + 2.5) / 5) * plotW;
  const toPlotY = (b: number) => plotY0 + plotH - (b / bMax()) * plotH;

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "80px" }}>d/R = {separation().toFixed(2)}</label>
          <input type="range" min="0.5" max="3.0" step="0.05" value={separation()} onInput={(e) => setSeparation(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${sepPct()}%, var(--border) ${sepPct()}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "65px" }}>I = {current()} A</label>
          <input type="range" min="1" max="20" step="1" value={current()} onInput={(e) => setCurrent(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${ACCENT} ${curPct()}%, var(--border) ${curPct()}%)` }} />
        </div>
      </div>

      {isHelmholtz() && (
        <div class="text-center text-xs font-semibold py-1 px-3 rounded-lg mx-auto" style={{ color: "#10b981", background: "rgba(16,185,129,0.1)", "max-width": "fit-content" }}>
          Helmholtz Condition: d = R (uniform central field)
        </div>
      )}

      <svg width="100%" height="300" viewBox="0 0 420 300" class="mx-auto">
        <rect x="0" y="0" width="420" height="300" fill="none" />
        <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Helmholtz Coils (xz-Plane Side View)
        </text>

        {/* Axis line */}
        <line x1={cx - axisLen} y1={cy} x2={cx + axisLen} y2={cy} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="4 3" />
        <text x={cx + axisLen + 5} y={cy + 4} font-size="8" fill="var(--text-muted)">z</text>

        {/* Coil 1 (left) */}
        {(() => {
          const coilZ = cx - (separation() / 2) * R;
          return (
            <>
              <ellipse cx={coilZ} cy={cy} rx="6" ry={R} fill="none" stroke={ACCENT} stroke-width="2.5"
                opacity={isHelmholtz() ? 1 : 0.7} />
              <text x={coilZ} y={cy + R + 14} text-anchor="middle" font-size="8" fill="var(--text-muted)">Coil 1</text>
              {/* Current direction arrows */}
              <text x={coilZ + 10} y={cy - R + 4} font-size="9" fill={ACCENT}>{"\u2299"}</text>
              <text x={coilZ + 10} y={cy + R + 4} font-size="9" fill={ACCENT}>{"\u2297"}</text>
            </>
          );
        })()}

        {/* Coil 2 (right) */}
        {(() => {
          const coilZ = cx + (separation() / 2) * R;
          return (
            <>
              <ellipse cx={coilZ} cy={cy} rx="6" ry={R} fill="none" stroke={ACCENT} stroke-width="2.5"
                opacity={isHelmholtz() ? 1 : 0.7} />
              <text x={coilZ} y={cy + R + 14} text-anchor="middle" font-size="8" fill="var(--text-muted)">Coil 2</text>
              <text x={coilZ + 10} y={cy - R + 4} font-size="9" fill={ACCENT}>{"\u2299"}</text>
              <text x={coilZ + 10} y={cy + R + 4} font-size="9" fill={ACCENT}>{"\u2297"}</text>
            </>
          );
        })()}

        {/* Approximate B field vectors in xz plane */}
        <For each={fieldVectors()}>
          {(v) => {
            const svgX = cx + v.z * R;
            const svgY = cy - v.x * R;
            const len = 5 + v.mag * 12;
            const angle = Math.atan2(-v.bx, v.bz); // SVG: y is inverted
            const tipX = svgX + len * Math.cos(angle);
            const tipY = svgY - len * Math.sin(angle);
            const alpha = 0.15 + v.mag * 0.65;
            return (
              <line x1={svgX} y1={svgY} x2={tipX} y2={tipY}
                stroke={ACCENT} stroke-width="1" opacity={alpha}
                marker-end="none" />
            );
          }}
        </For>

        {/* Helmholtz highlight: uniform region box */}
        {isHelmholtz() && (
          <rect x={cx - 0.3 * R} y={cy - 0.5 * R} width={0.6 * R} height={R}
            fill="rgba(16,185,129,0.08)" stroke="#10b981" stroke-width="0.8" stroke-dasharray="3 2" rx="3" />
        )}

        {/* Separator line */}
        <line x1="20" y1="188" x2="400" y2="188" stroke="var(--border)" stroke-width="0.5" />

        {/* B field on axis plot */}
        <text x="210" y="202" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)">B-field magnitude on axis</text>
        <line x1={plotX0} y1={plotY0 + plotH} x2={plotX0 + plotW} y2={plotY0 + plotH} stroke="var(--border)" stroke-width="0.5" />
        <line x1={plotX0} y1={plotY0} x2={plotX0} y2={plotY0 + plotH} stroke="var(--border)" stroke-width="0.5" />
        <text x={plotX0 + plotW / 2} y={plotY0 + plotH + 12} text-anchor="middle" font-size="7" fill="var(--text-muted)">z / R</text>
        <text x={plotX0 - 8} y={plotY0 + plotH / 2} text-anchor="middle" font-size="7" fill="var(--text-muted)" transform={`rotate(-90 ${plotX0 - 8} ${plotY0 + plotH / 2})`}>B</text>

        {/* Tick marks */}
        {[-2, -1, 0, 1, 2].map(z => (
          <>
            <line x1={toPlotX(z)} y1={plotY0 + plotH} x2={toPlotX(z)} y2={plotY0 + plotH + 4} stroke="var(--border)" stroke-width="0.5" />
            <text x={toPlotX(z)} y={plotY0 + plotH + 11} text-anchor="middle" font-size="6" fill="var(--text-muted)">{z}</text>
          </>
        ))}

        {/* B curve */}
        <polyline
          points={axisData().map(p => `${toPlotX(p.z).toFixed(1)},${toPlotY(p.b).toFixed(1)}`).join(" ")}
          fill="none" stroke={ACCENT} stroke-width="2" />

        {/* Coil positions on plot */}
        <line x1={toPlotX(-separation() / 2)} y1={plotY0} x2={toPlotX(-separation() / 2)} y2={plotY0 + plotH}
          stroke={ACCENT} stroke-width="0.8" stroke-dasharray="2 2" opacity="0.4" />
        <line x1={toPlotX(separation() / 2)} y1={plotY0} x2={toPlotX(separation() / 2)} y2={plotY0 + plotH}
          stroke={ACCENT} stroke-width="0.8" stroke-dasharray="2 2" opacity="0.4" />

        {/* Center marker */}
        <circle cx={toPlotX(0)} cy={toPlotY(bCenter())} r="3" fill="#10b981" stroke="white" stroke-width="0.8" />
      </svg>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>B at Center</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{(realBCenter() * 1e6).toFixed(1)} {"\u00B5T"}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Uniformity</div>
          <div class="text-lg font-bold" style={{ color: uniformity() < 1 ? "#10b981" : "#f59e0b" }}>
            {uniformity() < 0.01 ? "< 0.01" : uniformity().toFixed(2)}%
          </div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>d / R</div>
          <div class="text-lg font-bold" style={{ color: isHelmholtz() ? "#10b981" : "var(--text-secondary)" }}>
            {separation().toFixed(2)} {isHelmholtz() ? "\u2713" : ""}
          </div>
        </div>
      </div>
    </div>
  );
};


// ─── E2AmperesLaw ─────────────────────────────────────────────────────────────
// Interactive Ampere's law: move Amperian loop to enclose wires, verify integral
export const E2AmperesLaw: Component = () => {
  const ACCENT2 = "#8b5cf6";
  const svgW = 420, svgH = 300;

  // Wires: positions and currents
  const [wire1, setWire1] = createSignal({ x: 140, y: 140, I: 5 });
  const [wire2, setWire2] = createSignal({ x: 280, y: 140, I: -3 });
  const [wire3, setWire3] = createSignal({ x: 210, y: 210, I: 4 });
  const [numWires, setNumWires] = createSignal(2);

  // Amperian loop: center + radius
  const [loopCx, setLoopCx] = createSignal(210);
  const [loopCy, setLoopCy] = createSignal(150);
  const [loopR, setLoopR] = createSignal(80);

  // Animation
  const [animating, setAnimating] = createSignal(false);
  const [animAngle, setAnimAngle] = createSignal(0);
  const [runningIntegral, setRunningIntegral] = createSignal(0);

  // Dragging state
  const [dragging, setDragging] = createSignal<"center" | "radius" | null>(null);
  let svgRef: SVGSVGElement | undefined;

  const wires = createMemo(() => {
    const n = numWires();
    const all = [wire1(), wire2(), wire3()];
    return all.slice(0, n);
  });

  // Which wires are enclosed
  const enclosed = createMemo(() => {
    const lcx = loopCx(), lcy = loopCy(), lr = loopR();
    return wires().map(w => {
      const dx = w.x - lcx;
      const dy = w.y - lcy;
      return Math.sqrt(dx * dx + dy * dy) < lr;
    });
  });

  const iEnclosed = createMemo(() => {
    let total = 0;
    const w = wires();
    const enc = enclosed();
    for (let i = 0; i < w.length; i++) {
      if (enc[i]) total += w[i].I;
    }
    return total;
  });

  // Numerical line integral of B dot dl around the Amperian loop
  const lineIntegral = createMemo(() => {
    const lcx = loopCx(), lcy = loopCy(), lr = loopR();
    const w = wires();
    const nSteps = 360;
    let integral = 0;
    for (let i = 0; i < nSteps; i++) {
      const theta = (TWO_PI * i) / nSteps;
      const px = lcx + lr * Math.cos(theta);
      const py = lcy + lr * Math.sin(theta);
      // dl direction (tangential, CCW)
      const dlx = -Math.sin(theta);
      const dly = Math.cos(theta);
      // B at this point from all wires (2D: B ~ I / (2 pi r), perpendicular to r)
      let bx = 0, by = 0;
      for (const wire of w) {
        const rx = px - wire.x;
        const ry = py - wire.y;
        const r2 = rx * rx + ry * ry;
        if (r2 < 1) continue;
        const r = Math.sqrt(r2);
        // B direction: tangential to r (right-hand rule)
        const bMag = wire.I / (TWO_PI * r);
        bx += bMag * (-ry / r);
        by += bMag * (rx / r);
      }
      // B dot dl * |dl|
      const dl = (TWO_PI * lr) / nSteps;
      integral += (bx * dlx + by * dly) * dl;
    }
    // Normalize: integral should equal mu0 * I_enclosed
    // In our scaled units (B = I/(2 pi r)), integral = I_enclosed
    return integral;
  });

  // mu0 * I_enclosed (in same scaled units: just I_enclosed)
  const mu0Ienc = createMemo(() => iEnclosed());

  // Animation logic
  let animFrame: number | undefined;
  let lastAnimTs: number | undefined;

  const startVerify = () => {
    setAnimating(true);
    setAnimAngle(0);
    setRunningIntegral(0);
    lastAnimTs = undefined;

    const w = wires();
    const lcx = loopCx(), lcy = loopCy(), lr = loopR();

    const animate = (ts: number) => {
      if (!lastAnimTs) lastAnimTs = ts;
      const dt = (ts - lastAnimTs) / 1000;
      lastAnimTs = ts;

      const speed = 2.5; // radians per second
      const newAngle = animAngle() + dt * speed;

      if (newAngle >= TWO_PI) {
        setAnimAngle(TWO_PI);
        setRunningIntegral(lineIntegral());
        setAnimating(false);
        return;
      }

      setAnimAngle(newAngle);

      // Compute partial integral up to newAngle
      const nSteps = Math.floor((newAngle / TWO_PI) * 360);
      let partial = 0;
      for (let i = 0; i < nSteps; i++) {
        const theta = (TWO_PI * i) / 360;
        const px = lcx + lr * Math.cos(theta);
        const py = lcy + lr * Math.sin(theta);
        const dlx = -Math.sin(theta);
        const dly = Math.cos(theta);
        let bx = 0, by = 0;
        for (const wire of w) {
          const rx = px - wire.x;
          const ry = py - wire.y;
          const r2 = rx * rx + ry * ry;
          if (r2 < 1) continue;
          const r = Math.sqrt(r2);
          const bMag = wire.I / (TWO_PI * r);
          bx += bMag * (-ry / r);
          by += bMag * (rx / r);
        }
        const dl = (TWO_PI * lr) / 360;
        partial += (bx * dlx + by * dly) * dl;
      }
      setRunningIntegral(partial);

      animFrame = requestAnimationFrame(animate);
    };

    animFrame = requestAnimationFrame(animate);
  };

  onCleanup(() => animFrame && cancelAnimationFrame(animFrame));

  // SVG coordinate helper for pointer events
  const getSvgPoint = (e: PointerEvent): { x: number; y: number } => {
    if (!svgRef) return { x: e.clientX, y: e.clientY };
    const pt = svgRef.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svgRef.getScreenCTM();
    if (!ctm) return { x: e.clientX, y: e.clientY };
    const svgPt = pt.matrixTransform(ctm.inverse());
    return { x: svgPt.x, y: svgPt.y };
  };

  const onPointerDown = (e: PointerEvent, target: "center" | "radius") => {
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    setDragging(target);
  };

  const onPointerMove = (e: PointerEvent) => {
    const d = dragging();
    if (!d) return;
    const pt = getSvgPoint(e);
    if (d === "center") {
      const nx = Math.max(20, Math.min(svgW - 20, pt.x));
      const ny = Math.max(20, Math.min(svgH - 20, pt.y));
      setLoopCx(nx);
      setLoopCy(ny);
    } else if (d === "radius") {
      const dx = pt.x - loopCx();
      const dy = pt.y - loopCy();
      const newR = Math.max(20, Math.min(150, Math.sqrt(dx * dx + dy * dy)));
      setLoopR(newR);
    }
  };

  const onPointerUp = () => {
    setDragging(null);
  };

  const wiresPct = () => ((numWires() - 1) / 2) * 100;

  // Wire current sliders
  const setWireCurrent = (idx: number, val: number) => {
    if (idx === 0) setWire1({ ...wire1(), I: val });
    else if (idx === 1) setWire2({ ...wire2(), I: val });
    else setWire3({ ...wire3(), I: val });
  };

  const wireCurrents = createMemo(() => wires().map(w => w.I));

  // Animated marker position
  const markerPos = createMemo(() => {
    const a = animAngle();
    return {
      x: loopCx() + loopR() * Math.cos(a),
      y: loopCy() + loopR() * Math.sin(a),
    };
  });

  // Traversed arc path
  const arcPath = createMemo(() => {
    const a = animAngle();
    if (a < 0.01) return "";
    const lcx = loopCx(), lcy = loopCy(), lr = loopR();
    const startX = lcx + lr;
    const startY = lcy;
    const endX = lcx + lr * Math.cos(a);
    const endY = lcy + lr * Math.sin(a);
    const largeArc = a > Math.PI ? 1 : 0;
    return `M${startX},${startY} A${lr},${lr} 0 ${largeArc} 1 ${endX.toFixed(1)},${endY.toFixed(1)}`;
  });

  return (
    <div class="space-y-5">
      {/* Controls */}
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "75px" }}>Wires: {numWires()}</label>
          <input type="range" min="1" max="3" step="1" value={numWires()} onInput={(e) => setNumWires(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${ACCENT2} ${wiresPct()}%, var(--border) ${wiresPct()}%)` }} />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "75px" }}>Loop R: {loopR().toFixed(0)}</label>
          <input type="range" min="20" max="150" step="1" value={loopR()} onInput={(e) => setLoopR(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, ${ACCENT2} ${((loopR() - 20) / 130) * 100}%, var(--border) ${((loopR() - 20) / 130) * 100}%)` }} />
        </div>
      </div>

      {/* Wire current sliders */}
      <div class="space-y-2">
        <For each={wires()}>
          {(w, idx) => {
            const pct = () => ((wireCurrents()[idx()] + 10) / 20) * 100;
            return (
              <div class="flex items-center gap-3">
                <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "90px" }}>
                  Wire {idx() + 1}: I = {w.I} A
                </label>
                <input type="range" min="-10" max="10" step="1" value={w.I} onInput={(e) => setWireCurrent(idx(), parseInt(e.currentTarget.value))}
                  class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, ${ACCENT2} ${pct()}%, var(--border) ${pct()}%)` }} />
              </div>
            );
          }}
        </For>
      </div>

      <div class="flex gap-2 justify-center">
        <button class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: ACCENT2, color: "white" }}
          onClick={startVerify} disabled={animating()}>
          {animating() ? "Verifying..." : "Verify \u222EB\u00B7dl"}
        </button>
      </div>

      {/* SVG */}
      <svg ref={svgRef} width="100%" height="300" viewBox="0 0 420 300" class="mx-auto"
        style={{ cursor: dragging() ? "grabbing" : "default", "touch-action": "none" }}
        onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
        <rect x="0" y="0" width="420" height="300" fill="none" />
        <text x="210" y="16" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          {`Amp\u00E8re's Law: \u222EB\u00B7dl = \u03BC\u2080 I_enc`}
        </text>
        <text x="210" y="28" text-anchor="middle" font-size="8" fill="var(--text-muted)">
          Drag the loop center or edge to reposition
        </text>

        {/* Amperian loop */}
        <circle cx={loopCx()} cy={loopCy()} r={loopR()} fill="none" stroke="#10b981" stroke-width="2"
          stroke-dasharray={animating() ? "none" : "6 3"} opacity="0.6" />

        {/* Traversed arc during animation */}
        {animating() && arcPath() && (
          <path d={arcPath()} fill="none" stroke="#10b981" stroke-width="3" opacity="0.9" />
        )}

        {/* Direction arrow on loop (CCW) */}
        {!animating() && (() => {
          const angle = -Math.PI / 4;
          const px = loopCx() + loopR() * Math.cos(angle);
          const py = loopCy() + loopR() * Math.sin(angle);
          const tangent = angle + Math.PI / 2;
          const tipX = px + 8 * Math.cos(tangent);
          const tipY = py + 8 * Math.sin(tangent);
          const h1X = tipX - 4 * Math.cos(tangent - 0.5);
          const h1Y = tipY - 4 * Math.sin(tangent - 0.5);
          const h2X = tipX - 4 * Math.cos(tangent + 0.5);
          const h2Y = tipY - 4 * Math.sin(tangent + 0.5);
          return (
            <polygon points={`${tipX},${tipY} ${h1X},${h1Y} ${h2X},${h2Y}`} fill="#10b981" opacity="0.8" />
          );
        })()}

        {/* Animated marker */}
        {animating() && (
          <circle cx={markerPos().x} cy={markerPos().y} r="5" fill="#facc15" stroke="#eab308" stroke-width="1.5" />
        )}

        {/* Wires */}
        <For each={wires()}>
          {(w, idx) => {
            const isEnc = () => enclosed()[idx()];
            const wireColor = () => isEnc() ? "#10b981" : "#ef4444";
            return (
              <>
                {/* Wire circle */}
                <circle cx={w.x} cy={w.y} r="14" fill="var(--card-bg)" stroke={wireColor()} stroke-width="2.5"
                  opacity={isEnc() ? 1 : 0.6} />
                {/* Current direction */}
                {w.I > 0 ? (
                  <circle cx={w.x} cy={w.y} r="4" fill={wireColor()} />
                ) : w.I < 0 ? (
                  <>
                    <line x1={w.x - 5} y1={w.y - 5} x2={w.x + 5} y2={w.y + 5} stroke={wireColor()} stroke-width="2" />
                    <line x1={w.x + 5} y1={w.y - 5} x2={w.x - 5} y2={w.y + 5} stroke={wireColor()} stroke-width="2" />
                  </>
                ) : (
                  <text x={w.x} y={w.y + 3} text-anchor="middle" font-size="8" fill="var(--text-muted)">0</text>
                )}
                {/* Label */}
                <text x={w.x} y={w.y - 18} text-anchor="middle" font-size="8" font-weight="600" fill={wireColor()}>
                  I{idx() + 1} = {w.I > 0 ? "+" : ""}{w.I} A
                </text>
                {/* Enclosed indicator */}
                {isEnc() && (
                  <text x={w.x + 17} y={w.y - 8} font-size="10" fill="#10b981">{"\u2713"}</text>
                )}
              </>
            );
          }}
        </For>

        {/* Draggable center handle */}
        <circle cx={loopCx()} cy={loopCy()} r="8" fill={ACCENT2} opacity="0.3"
          style={{ cursor: "grab" }}
          onPointerDown={(e) => onPointerDown(e, "center")} />
        <circle cx={loopCx()} cy={loopCy()} r="3" fill={ACCENT2} opacity="0.8" style={{ "pointer-events": "none" }} />

        {/* Draggable radius handle (on the right edge) */}
        <circle cx={loopCx() + loopR()} cy={loopCy()} r="7" fill="#10b981" opacity="0.4"
          style={{ cursor: "ew-resize" }}
          onPointerDown={(e) => onPointerDown(e, "radius")} />
        <circle cx={loopCx() + loopR()} cy={loopCy()} r="3" fill="#10b981" opacity="0.8" style={{ "pointer-events": "none" }} />

        {/* Running integral display */}
        {animating() && (
          <g>
            <rect x="10" y={svgH - 40} width="160" height="30" rx="4" fill="var(--card-bg)" stroke="var(--border)" stroke-width="0.5" opacity="0.95" />
            <text x="20" y={svgH - 20} font-size="9" fill="var(--text-muted)">
              {`\u222EB\u00B7dl = ${runningIntegral().toFixed(3)}`}
            </text>
          </g>
        )}
      </svg>

      {/* Stat cards */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{"\u222EB\u00B7dl (numerical)"}</div>
          <div class="text-lg font-bold" style={{ color: ACCENT2 }}>
            {animating() ? runningIntegral().toFixed(3) : lineIntegral().toFixed(3)}
          </div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{"\u03BC\u2080 \u00D7 I_enc"}</div>
          <div class="text-lg font-bold" style={{ color: "#10b981" }}>{mu0Ienc().toFixed(3)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>I enclosed</div>
          <div class="text-lg font-bold" style={{ color: iEnclosed() >= 0 ? "#f59e0b" : "#ef4444" }}>
            {iEnclosed() > 0 ? "+" : ""}{iEnclosed()} A
          </div>
        </div>
      </div>

      {/* Match indicator */}
      <div class="text-center text-xs font-medium py-1" style={{ color: Math.abs(lineIntegral() - mu0Ienc()) < 0.05 ? "#10b981" : "#ef4444" }}>
        {Math.abs(lineIntegral() - mu0Ienc()) < 0.05
          ? "\u2713 Amp\u00E8re's law verified: \u222EB\u00B7dl = \u03BC\u2080 I_enc"
          : `\u0394 = ${Math.abs(lineIntegral() - mu0Ienc()).toFixed(4)} (numerical error from discretisation)`}
      </div>
    </div>
  );
};
