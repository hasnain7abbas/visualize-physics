import { Component, createSignal, createMemo, onCleanup } from "solid-js";

// ─── Types & Helpers ──────────────────────────────────────────────────────────
interface Charge { x: number; y: number; q: number; }
interface Vec2 { x: number; y: number; }

const ACCENT = "#3b82f6";

/** Compute electric field at (px,py) from all charges. k scaled so things look nice at pixel scale. */
function fieldAt(px: number, py: number, charges: Charge[], kScale = 5000): Vec2 {
  let Ex = 0, Ey = 0;
  for (const c of charges) {
    const dx = px - c.x;
    const dy = py - c.y;
    const r2 = dx * dx + dy * dy;
    const rMin2 = 100; // avoid singularity near charge
    const r2c = Math.max(r2, rMin2);
    const r = Math.sqrt(r2c);
    const E = kScale * c.q / r2c;
    Ex += E * dx / r;
    Ey += E * dy / r;
  }
  return { x: Ex, y: Ey };
}

/** Compute electric potential at (px,py) */
function potentialAt(px: number, py: number, charges: Charge[], kScale = 5000): number {
  let V = 0;
  for (const c of charges) {
    const dx = px - c.x;
    const dy = py - c.y;
    const r = Math.max(Math.sqrt(dx * dx + dy * dy), 8);
    V += kScale * c.q / r;
  }
  return V;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// E1PointCharges — Interactive quiver-plot of E field with draggable charges
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const E1PointCharges: Component = () => {
  const svgW = 420, svgH = 300;
  const gridSpacing = 18;

  const [charges, setCharges] = createSignal<Charge[]>([
    { x: 210, y: 150, q: 1 }
  ]);
  const [dragIdx, setDragIdx] = createSignal<number | null>(null);

  // Preset configurations
  const presets: Record<string, Charge[]> = {
    single: [{ x: 210, y: 150, q: 1 }],
    dipole: [{ x: 150, y: 150, q: 1 }, { x: 270, y: 150, q: -1 }],
    quadrupole: [
      { x: 160, y: 110, q: 1 }, { x: 260, y: 110, q: -1 },
      { x: 160, y: 190, q: -1 }, { x: 260, y: 190, q: 1 },
    ],
    "like-charges": [{ x: 150, y: 150, q: 1 }, { x: 270, y: 150, q: 1 }],
  };

  // Build grid of evaluation points
  const gridPts = createMemo(() => {
    const pts: Vec2[] = [];
    for (let gx = gridSpacing; gx < svgW; gx += gridSpacing) {
      for (let gy = gridSpacing; gy < svgH; gy += gridSpacing) {
        pts.push({ x: gx, y: gy });
      }
    }
    return pts;
  });

  // Compute field arrows
  const arrows = createMemo(() => {
    const chs = charges();
    const pts = gridPts();
    return pts.map(p => {
      const E = fieldAt(p.x, p.y, chs);
      const mag = Math.sqrt(E.x * E.x + E.y * E.y);
      // Clamp arrow length
      const maxLen = gridSpacing * 0.8;
      const len = Math.min(mag * 0.8, maxLen);
      const normMag = Math.min(mag / 15, 1); // 0..1 for color mapping
      let ux = 0, uy = 0;
      if (mag > 0.001) {
        ux = E.x / mag;
        uy = E.y / mag;
      }
      return {
        x: p.x, y: p.y,
        ex: ux * len, ey: uy * len,
        mag: normMag,
      };
    });
  });

  // Field magnitude at first charge location (for stat card)
  const fieldStats = createMemo(() => {
    const chs = charges();
    // Net field at center point between charges (if >1 charge)
    if (chs.length === 1) {
      // Field at a test point 40px from charge
      const testX = chs[0].x + 40;
      const testY = chs[0].y;
      const E = fieldAt(testX, testY, chs);
      return { mag: Math.sqrt(E.x * E.x + E.y * E.y), nCharges: 1 };
    }
    // Midpoint between first two charges
    const mx = (chs[0].x + chs[1].x) / 2;
    const my = (chs[0].y + chs[1].y) / 2;
    const E = fieldAt(mx, my, chs);
    return { mag: Math.sqrt(E.x * E.x + E.y * E.y), nCharges: chs.length };
  });

  // Drag handling
  const onPointerDown = (idx: number, e: PointerEvent) => {
    e.preventDefault();
    (e.target as SVGElement).setPointerCapture(e.pointerId);
    setDragIdx(idx);
  };
  const onPointerMove = (e: PointerEvent) => {
    const idx = dragIdx();
    if (idx === null) return;
    const svg = (e.target as SVGElement).closest("svg");
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = svgW / rect.width;
    const scaleY = svgH / rect.height;
    const nx = Math.max(15, Math.min(svgW - 15, (e.clientX - rect.left) * scaleX));
    const ny = Math.max(15, Math.min(svgH - 15, (e.clientY - rect.top) * scaleY));
    setCharges(prev => prev.map((c, i) => i === idx ? { ...c, x: nx, y: ny } : c));
  };
  const onPointerUp = () => setDragIdx(null);

  // Adjust charge value
  const adjustCharge = (idx: number, delta: number) => {
    setCharges(prev => prev.map((c, i) => {
      if (i !== idx) return c;
      let nq = c.q + delta;
      if (nq === 0) nq = delta > 0 ? 1 : -1; // skip zero
      nq = Math.max(-3, Math.min(3, nq));
      return { ...c, q: nq };
    }));
  };

  // Arrow color based on magnitude
  const arrowColor = (norm: number) => {
    // Interpolate: light blue (#93c5fd) -> dark blue (#1d4ed8) -> red (#ef4444)
    if (norm < 0.5) {
      const t = norm * 2;
      const r = Math.round(147 + (29 - 147) * t);
      const g = Math.round(197 + (78 - 197) * t);
      const b = Math.round(253 + (216 - 253) * t);
      return `rgb(${r},${g},${b})`;
    }
    const t = (norm - 0.5) * 2;
    const r = Math.round(29 + (239 - 29) * t);
    const g = Math.round(78 + (68 - 78) * t);
    const b = Math.round(216 + (68 - 216) * t);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div class="space-y-5">
      {/* Preset buttons */}
      <div class="flex flex-wrap gap-2 justify-center">
        {Object.keys(presets).map(name => (
          <button
            class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all capitalize"
            style={{ background: ACCENT, color: "white" }}
            onClick={() => setCharges(presets[name].map(c => ({ ...c })))}
          >{name}</button>
        ))}
      </div>

      {/* Charge value controls */}
      <div class="flex flex-wrap gap-3 justify-center">
        {charges().map((c, idx) => (
          <div class="flex items-center gap-1">
            <span class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              Q{idx + 1}:
            </span>
            <button
              class="w-6 h-6 rounded text-xs font-bold hover:scale-110 transition-all flex items-center justify-center"
              style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}
              onClick={() => adjustCharge(idx, -1)}
            >-</button>
            <span class="text-xs font-bold w-8 text-center" style={{ color: c.q > 0 ? "#ef4444" : ACCENT }}>
              {c.q > 0 ? "+" : ""}{c.q}
            </span>
            <button
              class="w-6 h-6 rounded text-xs font-bold hover:scale-110 transition-all flex items-center justify-center"
              style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}
              onClick={() => adjustCharge(idx, 1)}
            >+</button>
          </div>
        ))}
      </div>

      {/* SVG Visualization */}
      <svg
        width="100%" height="300" viewBox={`0 0 ${svgW} ${svgH}`}
        class="mx-auto" style={{ cursor: dragIdx() !== null ? "grabbing" : "default" }}
        onPointerMove={onPointerMove} onPointerUp={onPointerUp}
      >
        <rect x="0" y="0" width={svgW} height={svgH} fill="none" />
        <text x={svgW / 2} y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Electric Field (drag charges to move)
        </text>

        {/* Field arrows */}
        {arrows().map(a => {
          if (a.mag < 0.005) return null;
          const col = arrowColor(a.mag);
          // Arrow shaft
          const x1 = a.x - a.ex * 0.5;
          const y1 = a.y - a.ey * 0.5;
          const x2 = a.x + a.ex * 0.5;
          const y2 = a.y + a.ey * 0.5;
          // Arrowhead
          const len = Math.sqrt(a.ex * a.ex + a.ey * a.ey);
          if (len < 1) return null;
          const ux = a.ex / len, uy = a.ey / len;
          const headLen = Math.min(len * 0.35, 4);
          const hx1 = x2 - ux * headLen - uy * headLen * 0.5;
          const hy1 = y2 - uy * headLen + ux * headLen * 0.5;
          const hx2 = x2 - ux * headLen + uy * headLen * 0.5;
          const hy2 = y2 - uy * headLen - ux * headLen * 0.5;
          return (
            <g opacity={0.4 + a.mag * 0.6}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} stroke-width="1.2" />
              <polygon points={`${x2},${y2} ${hx1},${hy1} ${hx2},${hy2}`} fill={col} />
            </g>
          );
        })}

        {/* Charges */}
        {charges().map((c, idx) => (
          <g
            style={{ cursor: "grab" }}
            onPointerDown={(e: PointerEvent) => onPointerDown(idx, e)}
          >
            {/* Glow effect */}
            <circle cx={c.x} cy={c.y} r="18" fill={c.q > 0 ? "#ef4444" : ACCENT} opacity="0.15" />
            <circle cx={c.x} cy={c.y} r="12" fill={c.q > 0 ? "#ef4444" : ACCENT} opacity="0.25" />
            {/* Charge body */}
            <circle cx={c.x} cy={c.y} r="8" fill={c.q > 0 ? "#ef4444" : ACCENT}
              stroke="white" stroke-width="1.5" />
            {/* Sign label */}
            <text x={c.x} y={c.y + 1} text-anchor="middle" dominant-baseline="middle"
              font-size="10" font-weight="bold" fill="white">
              {c.q > 0 ? "+" : "\u2212"}
            </text>
          </g>
        ))}
      </svg>

      {/* Stat cards */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Charges</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{fieldStats().nCharges}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>|E| midpoint</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>{fieldStats().mag.toFixed(1)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Superposition</div>
          <div class="text-lg font-bold" style={{ color: "#10b981" }}>
            {charges().length > 1 ? "Active" : "Single"}
          </div>
        </div>
      </div>
    </div>
  );
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// E1FieldLines — Streamline field line visualization via Euler integration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const E1FieldLines: Component = () => {
  const svgW = 420, svgH = 300;
  const kScale = 5000;

  const [charges, setCharges] = createSignal<Charge[]>([
    { x: 155, y: 150, q: 1 },
    { x: 265, y: 150, q: -1 },
  ]);
  const [linesPerCharge, setLinesPerCharge] = createSignal(12);
  const [showMagnitude, setShowMagnitude] = createSignal(false);
  const [dragIdx, setDragIdx] = createSignal<number | null>(null);

  const linesPct = createMemo(() => ((linesPerCharge() - 6) / 14) * 100);

  // Presets
  const presetDipole = () => setCharges([{ x: 155, y: 150, q: 1 }, { x: 265, y: 150, q: -1 }]);
  const presetSameSign = () => setCharges([{ x: 155, y: 150, q: 1 }, { x: 265, y: 150, q: 1 }]);
  const presetThree = () => setCharges([
    { x: 130, y: 150, q: 1 }, { x: 210, y: 90, q: -1 }, { x: 290, y: 150, q: 1 },
  ]);

  // Adjust charge value
  const adjustCharge = (idx: number, delta: number) => {
    setCharges(prev => prev.map((c, i) => {
      if (i !== idx) return c;
      let nq = c.q + delta;
      if (nq === 0) nq = delta > 0 ? 1 : -1;
      nq = Math.max(-3, Math.min(3, nq));
      return { ...c, q: nq };
    }));
  };

  // Trace a single field line from a seed point via Euler integration
  function traceLine(startX: number, startY: number, chs: Charge[], direction: number): string {
    const maxSteps = 500;
    const stepSize = 3;
    const pts: Vec2[] = [{ x: startX, y: startY }];
    let cx = startX, cy = startY;

    for (let i = 0; i < maxSteps; i++) {
      const E = fieldAt(cx, cy, chs, kScale);
      const mag = Math.sqrt(E.x * E.x + E.y * E.y);
      if (mag < 0.01) break;

      const ux = direction * E.x / mag;
      const uy = direction * E.y / mag;
      cx += ux * stepSize;
      cy += uy * stepSize;

      // Stop if out of bounds
      if (cx < -10 || cx > svgW + 10 || cy < -10 || cy > svgH + 10) {
        pts.push({ x: cx, y: cy });
        break;
      }

      // Stop if too close to any charge
      let tooClose = false;
      for (const ch of chs) {
        const dx = cx - ch.x, dy = cy - ch.y;
        if (dx * dx + dy * dy < 64) { // r < 8
          tooClose = true;
          break;
        }
      }
      if (tooClose) {
        pts.push({ x: cx, y: cy });
        break;
      }

      pts.push({ x: cx, y: cy });
    }

    if (pts.length < 2) return "";
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  }

  // Generate all field lines
  const fieldLines = createMemo(() => {
    const chs = charges();
    const n = linesPerCharge();
    const paths: { d: string; from: "pos" | "neg" }[] = [];

    for (const ch of chs) {
      if (ch.q === 0) continue;
      const isPositive = ch.q > 0;
      const numLines = Math.round(n * Math.abs(ch.q));

      for (let i = 0; i < numLines; i++) {
        const angle = (2 * Math.PI * i) / numLines;
        const seedDist = 12;
        const sx = ch.x + seedDist * Math.cos(angle);
        const sy = ch.y + seedDist * Math.sin(angle);

        // From positive charges: trace in field direction (+1)
        // From negative charges: trace against field direction (-1)
        const dir = isPositive ? 1 : -1;
        const d = traceLine(sx, sy, chs, dir);
        if (d) paths.push({ d, from: isPositive ? "pos" : "neg" });
      }
    }
    return paths;
  });

  // Background magnitude heat map tiles (optional)
  const heatTiles = createMemo(() => {
    if (!showMagnitude()) return [];
    const chs = charges();
    const tileSize = 15;
    const tiles: { x: number; y: number; mag: number }[] = [];
    for (let gx = 0; gx < svgW; gx += tileSize) {
      for (let gy = 0; gy < svgH; gy += tileSize) {
        const px = gx + tileSize / 2, py = gy + tileSize / 2;
        const E = fieldAt(px, py, chs, kScale);
        const mag = Math.sqrt(E.x * E.x + E.y * E.y);
        tiles.push({ x: gx, y: gy, mag });
      }
    }
    return tiles;
  });

  const maxMag = createMemo(() => {
    const tiles = heatTiles();
    if (tiles.length === 0) return 1;
    let m = 0;
    for (const t of tiles) if (t.mag > m) m = t.mag;
    return Math.max(m, 1);
  });

  // Drag handling
  const onPointerDown = (idx: number, e: PointerEvent) => {
    e.preventDefault();
    (e.target as SVGElement).setPointerCapture(e.pointerId);
    setDragIdx(idx);
  };
  const onPointerMove = (e: PointerEvent) => {
    const idx = dragIdx();
    if (idx === null) return;
    const svg = (e.target as SVGElement).closest("svg");
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = svgW / rect.width;
    const scaleY = svgH / rect.height;
    const nx = Math.max(15, Math.min(svgW - 15, (e.clientX - rect.left) * scaleX));
    const ny = Math.max(15, Math.min(svgH - 15, (e.clientY - rect.top) * scaleY));
    setCharges(prev => prev.map((c, i) => i === idx ? { ...c, x: nx, y: ny } : c));
  };
  const onPointerUp = () => setDragIdx(null);

  // Place arrowheads along a field line path at intervals
  function pathArrowheads(d: string): { x: number; y: number; angle: number }[] {
    const parts = d.split(/[ML]/).filter(Boolean);
    const pts = parts.map(p => {
      const [x, y] = p.split(",").map(Number);
      return { x, y };
    });
    if (pts.length < 4) return [];
    const heads: { x: number; y: number; angle: number }[] = [];
    const interval = Math.max(Math.floor(pts.length / 4), 8);
    for (let i = interval; i < pts.length - 2; i += interval) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
      heads.push({ x: p1.x, y: p1.y, angle });
    }
    return heads;
  }

  return (
    <div class="space-y-5">
      {/* Controls */}
      <div class="flex items-center gap-3">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "110px" }}>
          Lines/charge = {linesPerCharge()}
        </label>
        <input type="range" min="6" max="20" step="1" value={linesPerCharge()}
          onInput={(e) => setLinesPerCharge(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${ACCENT} ${linesPct()}%, var(--border) ${linesPct()}%)` }} />
      </div>

      {/* Preset & toggle buttons */}
      <div class="flex flex-wrap gap-2 justify-center">
        <button class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: ACCENT, color: "white" }} onClick={presetDipole}>Dipole</button>
        <button class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: ACCENT, color: "white" }} onClick={presetSameSign}>Like Charges</button>
        <button class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: ACCENT, color: "white" }} onClick={presetThree}>3 Charges</button>
        <button class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: showMagnitude() ? "#f59e0b" : "var(--bg-secondary)", color: showMagnitude() ? "white" : "var(--text-secondary)" }}
          onClick={() => setShowMagnitude(!showMagnitude())}>
          {showMagnitude() ? "Hide |E|" : "Show |E|"}
        </button>
      </div>

      {/* Charge value controls */}
      <div class="flex flex-wrap gap-3 justify-center">
        {charges().map((c, idx) => (
          <div class="flex items-center gap-1">
            <span class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Q{idx + 1}:</span>
            <button class="w-6 h-6 rounded text-xs font-bold hover:scale-110 transition-all flex items-center justify-center"
              style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}
              onClick={() => adjustCharge(idx, -1)}>-</button>
            <span class="text-xs font-bold w-8 text-center" style={{ color: c.q > 0 ? "#ef4444" : ACCENT }}>
              {c.q > 0 ? "+" : ""}{c.q}
            </span>
            <button class="w-6 h-6 rounded text-xs font-bold hover:scale-110 transition-all flex items-center justify-center"
              style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}
              onClick={() => adjustCharge(idx, 1)}>+</button>
          </div>
        ))}
      </div>

      {/* SVG */}
      <svg width="100%" height="300" viewBox={`0 0 ${svgW} ${svgH}`} class="mx-auto"
        style={{ cursor: dragIdx() !== null ? "grabbing" : "default" }}
        onPointerMove={onPointerMove} onPointerUp={onPointerUp}
      >
        <rect x="0" y="0" width={svgW} height={svgH} fill="none" />
        <text x={svgW / 2} y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Electric Field Lines (drag charges)
        </text>

        {/* Arrowhead marker */}
        <defs>
          <marker id="e1-arrowhead" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto">
            <polygon points="0,0 6,2 0,4" fill={ACCENT} opacity="0.7" />
          </marker>
        </defs>

        {/* Heat map background */}
        {showMagnitude() && heatTiles().map(t => {
          const norm = Math.min(t.mag / maxMag(), 1);
          const alpha = norm * 0.25;
          return (
            <rect x={t.x} y={t.y} width="15" height="15"
              fill={ACCENT} opacity={alpha} />
          );
        })}

        {/* Field lines */}
        {fieldLines().map(fl => (
          <g>
            <path d={fl.d} fill="none" stroke={ACCENT} stroke-width="1.2" opacity="0.55"
              stroke-linecap="round" />
            {/* Arrowheads along path */}
            {pathArrowheads(fl.d).map(ah => (
              <polygon
                points="-3,-2 3,0 -3,2"
                fill={ACCENT} opacity="0.7"
                transform={`translate(${ah.x},${ah.y}) rotate(${ah.angle})`}
              />
            ))}
          </g>
        ))}

        {/* Charges */}
        {charges().map((c, idx) => (
          <g style={{ cursor: "grab" }}
            onPointerDown={(e: PointerEvent) => onPointerDown(idx, e)}>
            <circle cx={c.x} cy={c.y} r="18" fill={c.q > 0 ? "#ef4444" : ACCENT} opacity="0.12" />
            <circle cx={c.x} cy={c.y} r="10" fill={c.q > 0 ? "#ef4444" : ACCENT}
              stroke="white" stroke-width="1.5" />
            <text x={c.x} y={c.y + 1} text-anchor="middle" dominant-baseline="middle"
              font-size="11" font-weight="bold" fill="white">
              {c.q > 0 ? "+" : "\u2212"}
            </text>
          </g>
        ))}
      </svg>

      {/* Stat cards */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Field Lines</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>{fieldLines().length}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Charges</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>{charges().length}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Configuration</div>
          <div class="text-lg font-bold" style={{ color: "#10b981" }}>
            {charges().every(c => c.q > 0) ? "All +" : charges().every(c => c.q < 0) ? "All \u2212" : "Mixed"}
          </div>
        </div>
      </div>
    </div>
  );
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// E1Equipotentials — Potential contours via marching squares + field lines
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const E1Equipotentials: Component = () => {
  const svgW = 420, svgH = 300;
  const kScale = 5000;
  const gridStep = 6; // fine grid for smooth contours
  const nx = Math.ceil(svgW / gridStep);
  const ny = Math.ceil(svgH / gridStep);

  const [charges, setCharges] = createSignal<Charge[]>([
    { x: 165, y: 150, q: 1 },
    { x: 255, y: 150, q: -1 },
  ]);
  const [numContours, setNumContours] = createSignal(10);
  const [showFieldLines, setShowFieldLines] = createSignal(true);
  const [dragIdx, setDragIdx] = createSignal<number | null>(null);

  const contourPct = createMemo(() => ((numContours() - 4) / 16) * 100);

  // Presets
  const presetDipole = () => setCharges([{ x: 165, y: 150, q: 1 }, { x: 255, y: 150, q: -1 }]);
  const presetMonopole = () => setCharges([{ x: 210, y: 150, q: 1 }]);
  const presetTriangle = () => setCharges([
    { x: 210, y: 100, q: 1 }, { x: 160, y: 200, q: -1 }, { x: 260, y: 200, q: 1 },
  ]);

  // Compute potential grid
  const potGrid = createMemo(() => {
    const chs = charges();
    const vals: number[] = new Array(nx * ny);
    for (let iy = 0; iy < ny; iy++) {
      for (let ix = 0; ix < nx; ix++) {
        const px = ix * gridStep;
        const py = iy * gridStep;
        vals[iy * nx + ix] = potentialAt(px, py, chs, kScale);
      }
    }
    return vals;
  });

  // Find contour levels: symmetric around 0, log-spaced for better coverage
  const contourLevels = createMemo(() => {
    const grid = potGrid();
    let maxAbs = 0;
    for (const v of grid) {
      const a = Math.abs(v);
      // Clamp extreme values near charges
      if (a < 2000 && a > maxAbs) maxAbs = a;
    }
    if (maxAbs < 1) maxAbs = 1;

    const n = numContours();
    const levels: number[] = [];
    // Generate logarithmically-spaced positive levels, then mirror
    const half = Math.floor(n / 2);
    for (let i = 1; i <= half; i++) {
      const frac = i / (half + 1);
      // Log spacing: more contours near zero where detail matters
      const val = maxAbs * Math.pow(frac, 1.5);
      levels.push(val);
      levels.push(-val);
    }
    return levels.sort((a, b) => a - b);
  });

  // Marching squares for a single contour level
  // Returns an array of line segments
  function marchingSquares(level: number, grid: number[]): { x1: number; y1: number; x2: number; y2: number }[] {
    const segments: { x1: number; y1: number; x2: number; y2: number }[] = [];

    for (let iy = 0; iy < ny - 1; iy++) {
      for (let ix = 0; ix < nx - 1; ix++) {
        const v00 = grid[iy * nx + ix];
        const v10 = grid[iy * nx + ix + 1];
        const v01 = grid[(iy + 1) * nx + ix];
        const v11 = grid[(iy + 1) * nx + ix + 1];

        // Classify corners: 1 if above level, 0 if below
        const c = ((v00 >= level ? 8 : 0) | (v10 >= level ? 4 : 0) |
                   (v11 >= level ? 2 : 0) | (v01 >= level ? 1 : 0));

        if (c === 0 || c === 15) continue;

        // Interpolation helpers
        const x0 = ix * gridStep, y0 = iy * gridStep;
        const x1 = (ix + 1) * gridStep, y1 = (iy + 1) * gridStep;

        const lerp = (va: number, vb: number, pa: number, pb: number) => {
          const t = (level - va) / (vb - va + 1e-10);
          return pa + t * (pb - pa);
        };

        // Edge midpoints via linear interpolation
        const top = { x: lerp(v00, v10, x0, x1), y: y0 };
        const bottom = { x: lerp(v01, v11, x0, x1), y: y1 };
        const left = { x: x0, y: lerp(v00, v01, y0, y1) };
        const right = { x: x1, y: lerp(v10, v11, y0, y1) };

        // 16 cases of marching squares, add line segments
        const addSeg = (a: Vec2, b: Vec2) => segments.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });

        switch (c) {
          case 1: addSeg(left, bottom); break;
          case 2: addSeg(bottom, right); break;
          case 3: addSeg(left, right); break;
          case 4: addSeg(top, right); break;
          case 5: addSeg(top, left); addSeg(bottom, right); break;
          case 6: addSeg(top, bottom); break;
          case 7: addSeg(top, left); break;
          case 8: addSeg(top, left); break;
          case 9: addSeg(top, bottom); break;
          case 10: addSeg(top, right); addSeg(left, bottom); break;
          case 11: addSeg(top, right); break;
          case 12: addSeg(left, right); break;
          case 13: addSeg(bottom, right); break;
          case 14: addSeg(left, bottom); break;
          // 0 and 15 already handled
        }
      }
    }
    return segments;
  }

  // Chain small segments into continuous paths for smoother rendering
  function chainSegments(segs: { x1: number; y1: number; x2: number; y2: number }[]): string[] {
    if (segs.length === 0) return [];
    const used: boolean[] = Array.from({ length: segs.length }, () => false);
    const paths: string[] = [];
    const eps = gridStep * 0.6;

    for (let si = 0; si < segs.length; si++) {
      if (used[si]) continue;
      used[si] = true;
      const chain: Vec2[] = [{ x: segs[si].x1, y: segs[si].y1 }, { x: segs[si].x2, y: segs[si].y2 }];

      // Grow chain forward
      let extended = true;
      while (extended) {
        extended = false;
        const tail = chain[chain.length - 1];
        for (let j = 0; j < segs.length; j++) {
          if (used[j]) continue;
          const dx1 = tail.x - segs[j].x1, dy1 = tail.y - segs[j].y1;
          const dx2 = tail.x - segs[j].x2, dy2 = tail.y - segs[j].y2;
          if (dx1 * dx1 + dy1 * dy1 < eps * eps) {
            used[j] = true;
            chain.push({ x: segs[j].x2, y: segs[j].y2 });
            extended = true;
            break;
          }
          if (dx2 * dx2 + dy2 * dy2 < eps * eps) {
            used[j] = true;
            chain.push({ x: segs[j].x1, y: segs[j].y1 });
            extended = true;
            break;
          }
        }
      }

      if (chain.length >= 2) {
        paths.push(chain.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "));
      }
    }
    return paths;
  }

  // All contour paths
  const contourPaths = createMemo(() => {
    const grid = potGrid();
    const levels = contourLevels();
    const result: { d: string; level: number }[] = [];
    for (const level of levels) {
      const segs = marchingSquares(level, grid);
      const chains = chainSegments(segs);
      for (const d of chains) {
        result.push({ d, level });
      }
    }
    return result;
  });

  // A few field lines for overlay
  const overlayFieldLines = createMemo(() => {
    if (!showFieldLines()) return [];
    const chs = charges();
    const paths: string[] = [];
    const numOverlay = 8;

    for (const ch of chs) {
      if (ch.q <= 0) continue;
      for (let i = 0; i < numOverlay; i++) {
        const angle = (2 * Math.PI * i) / numOverlay;
        const sx = ch.x + 12 * Math.cos(angle);
        const sy = ch.y + 12 * Math.sin(angle);
        const pts: Vec2[] = [{ x: sx, y: sy }];
        let cx = sx, cy = sy;
        for (let step = 0; step < 400; step++) {
          const E = fieldAt(cx, cy, chs, kScale);
          const mag = Math.sqrt(E.x * E.x + E.y * E.y);
          if (mag < 0.01) break;
          cx += (E.x / mag) * 3;
          cy += (E.y / mag) * 3;
          if (cx < -5 || cx > svgW + 5 || cy < -5 || cy > svgH + 5) break;
          let tooClose = false;
          for (const c2 of chs) {
            if (c2.q < 0) {
              const dx = cx - c2.x, dy = cy - c2.y;
              if (dx * dx + dy * dy < 64) { tooClose = true; break; }
            }
          }
          pts.push({ x: cx, y: cy });
          if (tooClose) break;
        }
        if (pts.length >= 2) {
          paths.push(pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "));
        }
      }
    }
    return paths;
  });

  // Contour color
  const contourColor = (level: number) => {
    if (level > 0) return "#ef4444";
    if (level < 0) return ACCENT;
    return "var(--text-muted)";
  };

  const contourOpacity = (level: number) => {
    // Fainter for extreme values, bolder near zero
    const levels = contourLevels();
    const maxLev = Math.max(...levels.map(Math.abs), 1);
    return 0.3 + 0.5 * (1 - Math.abs(level) / maxLev);
  };

  // Drag handling
  const onPointerDown = (idx: number, e: PointerEvent) => {
    e.preventDefault();
    (e.target as SVGElement).setPointerCapture(e.pointerId);
    setDragIdx(idx);
  };
  const onPointerMove = (e: PointerEvent) => {
    const idx = dragIdx();
    if (idx === null) return;
    const svg = (e.target as SVGElement).closest("svg");
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = svgW / rect.width;
    const scaleY = svgH / rect.height;
    const nx2 = Math.max(20, Math.min(svgW - 20, (e.clientX - rect.left) * scaleX));
    const ny2 = Math.max(20, Math.min(svgH - 20, (e.clientY - rect.top) * scaleY));
    setCharges(prev => prev.map((c, i) => i === idx ? { ...c, x: nx2, y: ny2 } : c));
  };
  const onPointerUp = () => setDragIdx(null);

  // Stats
  const stats = createMemo(() => {
    const chs = charges();
    const totalQ = chs.reduce((s, c) => s + c.q, 0);
    // Potential at midpoint
    const mx = chs.reduce((s, c) => s + c.x, 0) / chs.length;
    const my = chs.reduce((s, c) => s + c.y, 0) / chs.length;
    const V = potentialAt(mx, my, chs, kScale);
    return { totalQ, V };
  });

  return (
    <div class="space-y-5">
      {/* Controls */}
      <div class="flex items-center gap-3">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "110px" }}>
          Contours = {numContours()}
        </label>
        <input type="range" min="4" max="20" step="1" value={numContours()}
          onInput={(e) => setNumContours(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${ACCENT} ${contourPct()}%, var(--border) ${contourPct()}%)` }} />
      </div>

      <div class="flex flex-wrap gap-2 justify-center">
        <button class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: ACCENT, color: "white" }} onClick={presetDipole}>Dipole</button>
        <button class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: ACCENT, color: "white" }} onClick={presetMonopole}>Monopole</button>
        <button class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: ACCENT, color: "white" }} onClick={presetTriangle}>Triangle</button>
        <button class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: showFieldLines() ? "#10b981" : "var(--bg-secondary)", color: showFieldLines() ? "white" : "var(--text-secondary)" }}
          onClick={() => setShowFieldLines(!showFieldLines())}>
          {showFieldLines() ? "Hide E lines" : "Show E lines"}
        </button>
      </div>

      {/* SVG */}
      <svg width="100%" height="300" viewBox={`0 0 ${svgW} ${svgH}`} class="mx-auto"
        style={{ cursor: dragIdx() !== null ? "grabbing" : "default" }}
        onPointerMove={onPointerMove} onPointerUp={onPointerUp}
      >
        <rect x="0" y="0" width={svgW} height={svgH} fill="none" />
        <text x={svgW / 2} y="14" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-muted)">
          Equipotential Lines (red = V{">"}0, blue = V{"<"}0)
        </text>

        {/* Contour lines */}
        {contourPaths().map(cp => (
          <path d={cp.d} fill="none" stroke={contourColor(cp.level)}
            stroke-width="1.2" opacity={contourOpacity(cp.level)}
            stroke-linecap="round" stroke-linejoin="round" />
        ))}

        {/* Field line overlay */}
        {showFieldLines() && overlayFieldLines().map(d => (
          <path d={d} fill="none" stroke="var(--text-muted)" stroke-width="0.8" opacity="0.35"
            stroke-dasharray="4 3" stroke-linecap="round" />
        ))}

        {/* Charges */}
        {charges().map((c, idx) => (
          <g style={{ cursor: "grab" }}
            onPointerDown={(e: PointerEvent) => onPointerDown(idx, e)}>
            <circle cx={c.x} cy={c.y} r="16" fill={c.q > 0 ? "#ef4444" : ACCENT} opacity="0.12" />
            <circle cx={c.x} cy={c.y} r="10" fill={c.q > 0 ? "#ef4444" : ACCENT}
              stroke="white" stroke-width="1.5" />
            <text x={c.x} y={c.y + 1} text-anchor="middle" dominant-baseline="middle"
              font-size="11" font-weight="bold" fill="white">
              {c.q > 0 ? "+" : "\u2212"}
            </text>
          </g>
        ))}

        {/* Legend */}
        <g transform="translate(10, 280)">
          <line x1="0" y1="0" x2="14" y2="0" stroke="#ef4444" stroke-width="1.5" />
          <text x="17" y="3" font-size="7" fill="var(--text-muted)">V{">"} 0</text>
          <line x1="48" y1="0" x2="62" y2="0" stroke={ACCENT} stroke-width="1.5" />
          <text x="65" y="3" font-size="7" fill="var(--text-muted)">V{"<"} 0</text>
          {showFieldLines() && (
            <>
              <line x1="96" y1="0" x2="110" y2="0" stroke="var(--text-muted)" stroke-width="0.8" stroke-dasharray="3 2" />
              <text x="113" y="3" font-size="7" fill="var(--text-muted)">E field</text>
            </>
          )}
        </g>
      </svg>

      {/* Stat cards */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Total Charge</div>
          <div class="text-lg font-bold" style={{ color: ACCENT }}>
            {stats().totalQ > 0 ? "+" : ""}{stats().totalQ}
          </div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>V midpoint</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>
            {Math.abs(stats().V) < 1000 ? stats().V.toFixed(1) : (stats().V > 0 ? "+\u221E" : "\u2212\u221E")}
          </div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Contour Levels</div>
          <div class="text-lg font-bold" style={{ color: "#10b981" }}>{contourLevels().length}</div>
        </div>
      </div>
    </div>
  );
};
