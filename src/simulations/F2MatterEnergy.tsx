import { Component, createSignal, createMemo, onCleanup, For, Show } from "solid-js";

const ACCENT = "#f59e0b";

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// F2Density — Drop a cube into a fluid; live buoyancy calc.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const MATERIALS: Record<string, { rho: number; color: string }> = {
  Cork: { rho: 240, color: "#d97706" },
  Wood: { rho: 700, color: "#92400e" },
  Ice: { rho: 920, color: "#bae6fd" },
  Plastic: { rho: 950, color: "#a3e635" },
  Aluminum: { rho: 2700, color: "#94a3b8" },
  Steel: { rho: 7850, color: "#475569" },
  Lead: { rho: 11340, color: "#1e293b" },
};
const FLUIDS: Record<string, { rho: number; color: string }> = {
  Oil: { rho: 850, color: "#fde68a" },
  Water: { rho: 1000, color: "#7dd3fc" },
  "Salt water": { rho: 1025, color: "#67e8f9" },
  Mercury: { rho: 13600, color: "#cbd5e1" },
};

export const F2Density: Component = () => {
  const [matName, setMatName] = createSignal("Wood");
  const [fluName, setFluName] = createSignal("Water");
  const [side, setSide] = createSignal(0.4); // m

  const mat = () => MATERIALS[matName()];
  const flu = () => FLUIDS[fluName()];
  const V = () => side() ** 3;
  const m = () => mat().rho * V();
  const W = () => m() * 9.81;
  const ratio = () => mat().rho / flu().rho;
  const fSubmerged = () => clamp(ratio(), 0, 1);
  const Fb = () => flu().rho * 9.81 * V() * fSubmerged();
  const sinks = () => ratio() > 1;

  // Visualization
  const sceneW = 460, sceneH = 320;
  const tankX = 60, tankY = 30;
  const tankW = 340, tankH = 250;
  const fluidTopY = tankY + 50; // surface
  // Cube size in pixels (proportional to side)
  const cubePx = () => 40 + 80 * side();
  const cubeX = () => tankX + tankW / 2;
  const cubeTopY = () => {
    if (sinks()) {
      // Sits on the bottom
      return tankY + tankH - cubePx();
    }
    // Floating: fraction below surface = fSubmerged
    return fluidTopY - cubePx() * (1 - fSubmerged());
  };

  return (
    <div class="space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Object material</span>
          <select value={matName()} onChange={(e) => setMatName(e.currentTarget.value)} class="w-full mt-1 rounded px-2 py-1 text-xs" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
            <For each={Object.keys(MATERIALS)}>{(n) => <option value={n}>{n} ({MATERIALS[n].rho} kg/m³)</option>}</For>
          </select>
        </label>
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Fluid</span>
          <select value={fluName()} onChange={(e) => setFluName(e.currentTarget.value)} class="w-full mt-1 rounded px-2 py-1 text-xs" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
            <For each={Object.keys(FLUIDS)}>{(n) => <option value={n}>{n} ({FLUIDS[n].rho} kg/m³)</option>}</For>
          </select>
        </label>
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Cube side: <strong>{(side() * 100).toFixed(0)} cm</strong></span>
          <input type="range" min={0.1} max={0.6} step={0.01} value={side()} onInput={(e) => setSide(parseFloat(e.currentTarget.value))} class="w-full" />
        </label>
      </div>

      <svg viewBox={`0 0 ${sceneW} ${sceneH}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "360px" }}>
        {/* Tank walls */}
        <rect x={tankX} y={tankY} width={tankW} height={tankH} fill="none" stroke="var(--text-primary)" stroke-width="2" />
        {/* Fluid */}
        <rect x={tankX} y={fluidTopY} width={tankW} height={tankY + tankH - fluidTopY} fill={flu().color} opacity="0.55" />
        {/* Surface line */}
        <line x1={tankX} y1={fluidTopY} x2={tankX + tankW} y2={fluidTopY} stroke="#0284c7" stroke-width="1.5" stroke-dasharray="4,3" />
        <text x={tankX + tankW + 6} y={fluidTopY + 4} font-size="10" fill="#0284c7">surface</text>

        {/* Cube */}
        <rect x={cubeX() - cubePx() / 2} y={cubeTopY()} width={cubePx()} height={cubePx()} fill={mat().color} stroke="var(--text-primary)" stroke-width="1.2" rx="2" />
        <text x={cubeX()} y={cubeTopY() + cubePx() / 2 + 4} text-anchor="middle" font-size="11" font-weight="bold" fill="white">{matName()}</text>

        {/* Buoyant force arrow */}
        <Show when={!sinks() || ratio() <= 1.2}>
          <line x1={cubeX() + cubePx() / 2 + 20} y1={cubeTopY() + cubePx() / 2 + 30} x2={cubeX() + cubePx() / 2 + 20} y2={cubeTopY() + cubePx() / 2 - 30} stroke="#3b82f6" stroke-width="2.5" />
          <polygon points={`${cubeX() + cubePx() / 2 + 20},${cubeTopY() + cubePx() / 2 - 30} ${cubeX() + cubePx() / 2 + 16},${cubeTopY() + cubePx() / 2 - 24} ${cubeX() + cubePx() / 2 + 24},${cubeTopY() + cubePx() / 2 - 24}`} fill="#3b82f6" />
          <text x={cubeX() + cubePx() / 2 + 28} y={cubeTopY() + cubePx() / 2 - 25} font-size="10" fill="#3b82f6">F_b</text>
        </Show>

        {/* Weight arrow */}
        <line x1={cubeX() - cubePx() / 2 - 20} y1={cubeTopY() + cubePx() / 2 - 30} x2={cubeX() - cubePx() / 2 - 20} y2={cubeTopY() + cubePx() / 2 + 30} stroke="#a855f7" stroke-width="2.5" />
        <polygon points={`${cubeX() - cubePx() / 2 - 20},${cubeTopY() + cubePx() / 2 + 30} ${cubeX() - cubePx() / 2 - 24},${cubeTopY() + cubePx() / 2 + 24} ${cubeX() - cubePx() / 2 - 16},${cubeTopY() + cubePx() / 2 + 24}`} fill="#a855f7" />
        <text x={cubeX() - cubePx() / 2 - 28} y={cubeTopY() + cubePx() / 2 + 28} text-anchor="end" font-size="10" fill="#a855f7">W</text>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="Volume" value={`${(V() * 1000).toFixed(2)} L`} sub={`${V().toFixed(4)} m³`} color={ACCENT} />
        <StatCard label="Mass" value={`${m().toFixed(2)} kg`} sub={`m = ρV`} color="#a855f7" />
        <StatCard label="Weight" value={`${W().toFixed(1)} N`} sub={`W = mg`} color="#ec4899" />
        <StatCard label="Buoyant Force" value={`${Fb().toFixed(1)} N`} sub={`ρ_f g V_sub`} color="#3b82f6" />
        <StatCard label="ρ_obj / ρ_fluid" value={ratio().toFixed(3)} sub={sinks() ? "→ sinks" : "→ floats"} color="#06b6d4" />
        <StatCard label="Fraction submerged" value={`${(fSubmerged() * 100).toFixed(1)} %`} color="#22c55e" />
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// F2Pressure — Force-on-area visualization + hydrostatic depth gauge.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const F2Pressure: Component = () => {
  const [F, setF] = createSignal(50); // N
  const [A, setA] = createSignal(20); // cm²
  const [depth, setDepth] = createSignal(2); // m underwater
  const rhoWater = 1000;
  const Patm = 101325;
  const g = 9.81;

  const P_solid = () => F() / (A() / 10000); // Pa (A from cm² to m²)
  const P_hydro = () => Patm + rhoWater * g * depth(); // absolute Pa

  // Visualization for F/A
  const sceneW = 460, sceneH = 200;
  const surfaceY = 30;

  // Pressure swatch — circle whose radius scales with √(F/A) effect
  const ringR = createMemo(() => clamp(8 + Math.sqrt(P_solid()) / 8, 12, 80));

  return (
    <div class="space-y-4">
      {/* Section 1: Pressure = F/A */}
      <div class="space-y-2">
        <div class="text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>1. Solid: P = F / A</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label class="text-xs">
            <span style={{ color: "var(--text-secondary)" }}>Force F: <strong>{F().toFixed(0)} N</strong></span>
            <input type="range" min={1} max={200} step={1} value={F()} onInput={(e) => setF(parseFloat(e.currentTarget.value))} class="w-full" />
          </label>
          <label class="text-xs">
            <span style={{ color: "var(--text-secondary)" }}>Contact area A: <strong>{A().toFixed(1)} cm²</strong></span>
            <input type="range" min={0.1} max={100} step={0.1} value={A()} onInput={(e) => setA(parseFloat(e.currentTarget.value))} class="w-full" />
          </label>
        </div>
        <svg viewBox={`0 0 ${sceneW} ${sceneH}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "210px" }}>
          {/* Ground */}
          <line x1={20} y1={150} x2={sceneW - 20} y2={150} stroke="var(--text-primary)" stroke-width="2" />
          {/* Object — width scales with sqrt(A) */}
          {(() => {
            const objW = clamp(20 + Math.sqrt(A()) * 6, 14, 120);
            const objH = 40;
            const cx = sceneW / 2;
            return (
              <>
                <rect x={cx - objW / 2} y={150 - objH} width={objW} height={objH} fill={ACCENT} opacity="0.85" stroke="var(--text-primary)" stroke-width="1" rx="2" />
                {/* Force arrow above */}
                {(() => {
                  const arrowLen = clamp(F() / 4, 14, 80);
                  return (
                    <g>
                      <line x1={cx} y1={150 - objH - arrowLen - 4} x2={cx} y2={150 - objH - 4} stroke="#3b82f6" stroke-width="3" />
                      <polygon points={`${cx},${150 - objH - 4} ${cx - 5},${150 - objH - 12} ${cx + 5},${150 - objH - 12}`} fill="#3b82f6" />
                      <text x={cx + 10} y={150 - objH - arrowLen / 2} font-size="11" fill="#3b82f6" font-weight="bold">F</text>
                    </g>
                  );
                })()}
                <text x={cx} y={150 + 18} text-anchor="middle" font-size="10" fill="var(--text-muted)">contact area = {A().toFixed(1)} cm²</text>
                {/* Pressure intensity glow */}
                <circle cx={cx} cy={150} r={ringR()} fill="#ef4444" opacity="0.18" />
              </>
            );
          })()}
        </svg>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <StatCard label="Pressure" value={`${P_solid().toFixed(0)} Pa`} sub={`= ${(P_solid() / 1000).toFixed(2)} kPa`} color={ACCENT} />
          <StatCard label="In atm" value={`${(P_solid() / Patm).toFixed(3)} atm`} color="#3b82f6" />
          <StatCard label="In psi" value={`${(P_solid() * 0.000145).toFixed(2)} psi`} color="#ec4899" />
        </div>
      </div>

      {/* Section 2: Hydrostatic */}
      <div class="space-y-2">
        <div class="text-xs font-semibold uppercase tracking-widest" style={{ color: "#3b82f6" }}>2. Fluid: P(h) = P₀ + ρgh</div>
        <label class="text-xs block">
          <span style={{ color: "var(--text-secondary)" }}>Depth below surface: <strong>{depth().toFixed(1)} m</strong></span>
          <input type="range" min={0} max={50} step={0.1} value={depth()} onInput={(e) => setDepth(parseFloat(e.currentTarget.value))} class="w-full" />
        </label>
        <svg viewBox="0 0 460 220" class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "240px" }}>
          {/* Sky */}
          <rect x={0} y={0} width={460} height={surfaceY} fill="#dbeafe" />
          <text x={230} y={20} text-anchor="middle" font-size="10" fill="#1e40af">P₀ = 101.3 kPa (atmosphere)</text>
          {/* Water */}
          <rect x={0} y={surfaceY} width={460} height={220 - surfaceY} fill="#7dd3fc" opacity="0.55" />
          <line x1={0} y1={surfaceY} x2={460} y2={surfaceY} stroke="#0284c7" stroke-width="1.5" />
          {/* Diver position */}
          {(() => {
            const dy = surfaceY + clamp(depth() * 4, 5, 220 - surfaceY - 20);
            return (
              <g>
                <circle cx={230} cy={dy} r={8} fill="#fbbf24" stroke="#92400e" stroke-width="1.5" />
                <line x1={230} y1={surfaceY} x2={230} y2={dy} stroke="var(--text-primary)" stroke-width="1" stroke-dasharray="3,3" />
                <text x={240} y={(surfaceY + dy) / 2} font-size="11" font-weight="bold" fill="var(--text-primary)">h = {depth().toFixed(1)} m</text>
              </g>
            );
          })()}
        </svg>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <StatCard label="Absolute P" value={`${(P_hydro() / 1000).toFixed(1)} kPa`} sub={`at h = ${depth().toFixed(1)} m`} color="#3b82f6" />
          <StatCard label="In atm" value={`${(P_hydro() / Patm).toFixed(2)} atm`} color="#06b6d4" />
          <StatCard label="Gauge P (above atm)" value={`${(rhoWater * g * depth() / 1000).toFixed(1)} kPa`} sub={`ρgh`} color={ACCENT} />
        </div>
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// F2Temperature — Box of jiggling particles, temp slider drives KE.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const kB = 1.380649e-23;
const m_atom = 6.6e-26; // ~argon

export const F2Temperature: Component = () => {
  const [T, setT] = createSignal(300); // K
  const N = 60;
  const W = 460, H = 240;
  const r = 4;

  type P = { x: number; y: number; vx: number; vy: number };
  const [particles, setParticles] = createSignal<P[]>(
    Array.from({ length: N }, () => ({
      x: 20 + Math.random() * (W - 40),
      y: 20 + Math.random() * (H - 40),
      vx: 0, vy: 0,
    }))
  );

  // Initialize velocities for given T (Maxwell-Boltzmann-ish via Box-Muller)
  const reseed = (Tnew: number) => {
    // We'll use display units (px / frame). Scale so visual speed scales with sqrt(T).
    // Mean speed in display: sqrt(T/300) * 1.5
    const sigma = Math.sqrt(Tnew / 300) * 1.4;
    setParticles((prev) =>
      prev.map((p) => ({
        ...p,
        vx: gauss() * sigma,
        vy: gauss() * sigma,
      }))
    );
  };
  function gauss() {
    const u1 = Math.random() || 1e-9;
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
  reseed(T());

  // Animation
  let raf: number | undefined;
  const tick = () => {
    setParticles((prev) =>
      prev.map((p) => {
        let { x, y, vx, vy } = p;
        x += vx;
        y += vy;
        if (x < r) { x = r; vx = -vx; }
        if (x > W - r) { x = W - r; vx = -vx; }
        if (y < r) { y = r; vy = -vy; }
        if (y > H - r) { y = H - r; vy = -vy; }
        return { x, y, vx, vy };
      })
    );
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  onCleanup(() => raf && cancelAnimationFrame(raf));

  // KE in physical units assuming our "1 px/frame" maps to a physical speed,
  // but we report the theoretical KE = (3/2) k_B T directly so it stays meaningful.
  const KE = () => 1.5 * kB * T();
  const v_p = () => Math.sqrt(2 * kB * T() / m_atom); // m/s
  const v_rms = () => Math.sqrt(3 * kB * T() / m_atom);

  // Histogram of current particle speeds (display speed → relative)
  const hist = createMemo(() => {
    const bins = 12;
    const buckets = new Array(bins).fill(0);
    let maxV = 0;
    for (const p of particles()) {
      const s = Math.hypot(p.vx, p.vy);
      maxV = Math.max(maxV, s);
    }
    const max = Math.max(maxV, 1);
    for (const p of particles()) {
      const s = Math.hypot(p.vx, p.vy);
      const idx = Math.min(bins - 1, Math.floor((s / max) * bins));
      buckets[idx]++;
    }
    return buckets;
  });

  return (
    <div class="space-y-3">
      <label class="text-xs block">
        <span style={{ color: "var(--text-secondary)" }}>Temperature: <strong>{T().toFixed(0)} K</strong> ({(T() - 273.15).toFixed(0)} °C)</span>
        <input type="range" min={5} max={1500} step={5} value={T()} onInput={(e) => { const v = parseFloat(e.currentTarget.value); setT(v); reseed(v); }} class="w-full" />
      </label>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "270px" }}>
        <rect x={0} y={0} width={W} height={H} fill="none" stroke="var(--text-primary)" stroke-width="1.5" />
        <For each={particles()}>
          {(p) => {
            const speed = Math.hypot(p.vx, p.vy);
            const hue = clamp(240 - speed * 60, 0, 240); // slow=blue, fast=red
            return <circle cx={p.x} cy={p.y} r={r} fill={`hsl(${hue}, 80%, 55%)`} />;
          }}
        </For>
      </svg>

      {/* Speed histogram */}
      <div class="rounded-lg p-2" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
        <div class="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
          Speed distribution (Maxwell-Boltzmann)
        </div>
        <svg viewBox="0 0 300 100" class="w-full" style={{ "max-height": "120px" }}>
          {(() => {
            const bins = hist();
            const maxC = Math.max(...bins, 1);
            const bw = 280 / bins.length;
            return bins.map((c, i) => {
              const h = (c / maxC) * 80;
              const hue = clamp(240 - i * 22, 0, 240);
              return <rect x={10 + i * bw} y={90 - h} width={bw - 2} height={h} fill={`hsl(${hue}, 80%, 55%)`} />;
            });
          })()}
          <line x1={10} y1={90} x2={290} y2={90} stroke="var(--text-muted)" stroke-width="0.6" />
          <text x={150} y={99} text-anchor="middle" font-size="8" fill="var(--text-muted)">slower → faster</text>
        </svg>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <StatCard label="⟨KE⟩ per atom" value={`${(KE() * 1e21).toFixed(2)} zJ`} sub={`(3/2) k_B T`} color={ACCENT} />
        <StatCard label="v_p (most probable)" value={`${v_p().toFixed(0)} m/s`} sub={`√(2k_BT/m), argon`} color="#3b82f6" />
        <StatCard label="v_rms" value={`${v_rms().toFixed(0)} m/s`} sub={`√(3k_BT/m)`} color="#ec4899" />
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// F2WorkEnergy — Ball on hill; KE/PE bars trade height live.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const F2WorkEnergy: Component = () => {
  const g = 9.81;
  const [m] = createSignal(1); // kg
  const [h0, setH0] = createSignal(5); // m
  const [friction, setFriction] = createSignal(false);
  const [running, setRunning] = createSignal(false);
  const [t, setT] = createSignal(0);
  const [v, setV] = createSignal(0);
  const [s, setS] = createSignal(0); // arc length along path

  // Hill profile: height as function of horizontal x in display coords.
  // We'll use a sinusoidal track.
  const trackW = 460, trackH = 220;
  const Lx = 6; // physical horizontal extent (m)
  const xMax = Lx;
  const heightAt = (x: number) => {
    // Two hills decreasing; start at h0 on left, dip in middle, small bump
    const a = h0();
    return a * 0.5 * (1 + Math.cos((Math.PI * x) / xMax)) + 0.5 * Math.sin((2 * Math.PI * x) / xMax) * 0.6;
  };

  const totalE0 = () => m() * g * heightAt(0); // start at rest

  // Numerical: ball slides along curve. We track horizontal position x.
  const [xPos, setXPos] = createSignal(0);
  const reset = () => { setT(0); setV(0); setS(0); setXPos(0); setRunning(false); last = 0; };

  // Slope at x (dh/dx)
  const slope = (x: number) => {
    const dx = 0.001;
    return (heightAt(x + dx) - heightAt(x - dx)) / (2 * dx);
  };

  let raf: number | undefined;
  let last = 0;
  const step = (now: number) => {
    if (!last) last = now;
    const dt = Math.min(0.03, (now - last) / 1000);
    last = now;
    if (running()) {
      // Use energy method: total energy minus PE → KE.
      // Apply tangential acceleration with optional friction.
      let x = xPos();
      let vv = v();
      const sl = slope(x);
      const angle = Math.atan(sl);
      // gravity component along slope (downhill = positive x means slope < 0)
      const aTang = -g * Math.sin(angle); // negative slope at start drives positive vx
      let aFric = 0;
      if (friction() && Math.abs(vv) > 0.01) {
        aFric = -Math.sign(vv) * 0.6; // simple kinetic friction approximation
      }
      vv += (aTang + aFric) * dt;
      x += vv * Math.cos(angle) * dt;
      // bounds
      if (x > xMax) { x = xMax; vv = -Math.abs(vv) * 0.4; }
      if (x < 0) { x = 0; vv = Math.abs(vv) * 0.4; }
      setXPos(x);
      setV(vv);
      setT((p) => p + dt);
      setS((p) => p + Math.abs(vv) * dt);
    }
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  onCleanup(() => raf && cancelAnimationFrame(raf));

  const KE = () => 0.5 * m() * v() * v();
  const PE = () => m() * g * heightAt(xPos());
  const totalE = () => KE() + PE();
  const heatLost = () => Math.max(0, totalE0() - totalE());

  // Path SVG
  const pathD = createMemo(() => {
    const N = 100;
    let d = "";
    const yMaxPx = trackH - 30;
    const yScale = (h: number) => trackH - 30 - (h / Math.max(h0(), 1)) * yMaxPx;
    for (let i = 0; i <= N; i++) {
      const x = (i / N) * xMax;
      const sx = 20 + (x / xMax) * (trackW - 40);
      const sy = yScale(heightAt(x));
      d += `${i === 0 ? "M" : "L"}${sx.toFixed(1)},${sy.toFixed(1)} `;
    }
    return d;
  });

  const ballSx = () => 20 + (xPos() / xMax) * (trackW - 40);
  const ballSy = () => trackH - 30 - (heightAt(xPos()) / Math.max(h0(), 1)) * (trackH - 30);

  return (
    <div class="space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Starting height h₀: <strong>{h0().toFixed(1)} m</strong></span>
          <input type="range" min={1} max={10} step={0.1} value={h0()} onInput={(e) => { setH0(parseFloat(e.currentTarget.value)); reset(); }} class="w-full" />
        </label>
        <label class="text-xs flex items-center gap-2 mt-4">
          <input type="checkbox" checked={friction()} onChange={(e) => setFriction(e.currentTarget.checked)} />
          <span style={{ color: "var(--text-secondary)" }}>Include friction (mech. energy not conserved)</span>
        </label>
      </div>

      <div class="flex gap-2">
        <button onClick={() => setRunning(!running())} class="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: ACCENT, color: "white" }}>
          {running() ? "Pause" : "Release"}
        </button>
        <button onClick={reset} class="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Reset
        </button>
      </div>

      <svg viewBox={`0 0 ${trackW} ${trackH}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "260px" }}>
        {/* h-axis ticks */}
        <For each={[0, 2, 4, 6, 8, 10]}>
          {(h) => h <= h0() && (
            <>
              <line x1={15} y1={trackH - 30 - (h / Math.max(h0(), 1)) * (trackH - 30)} x2={trackW - 15} y2={trackH - 30 - (h / Math.max(h0(), 1)) * (trackH - 30)} stroke="var(--border-light)" stroke-width="0.5" />
              <text x={4} y={trackH - 27 - (h / Math.max(h0(), 1)) * (trackH - 30)} font-size="9" fill="var(--text-muted)">{h}m</text>
            </>
          )}
        </For>
        {/* Path */}
        <path d={pathD()} stroke="var(--text-primary)" stroke-width="2" fill="none" />
        {/* Ground line */}
        <line x1={0} y1={trackH - 30} x2={trackW} y2={trackH - 30} stroke="var(--text-muted)" stroke-width="0.6" stroke-dasharray="3,3" />
        {/* Ball */}
        <circle cx={ballSx()} cy={ballSy() - 8} r={8} fill={ACCENT} stroke="white" stroke-width="2" />
      </svg>

      {/* Energy bars */}
      <div class="rounded-lg p-3" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
        <div class="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
          Energy budget
        </div>
        {(() => {
          const E0 = totalE0();
          const ke = KE(), pe = PE(), heat = heatLost();
          const denom = Math.max(E0, 1e-9);
          return (
            <div class="space-y-2">
              <EnergyBar label="Kinetic" value={ke} frac={ke / denom} color="#ec4899" />
              <EnergyBar label="Potential" value={pe} frac={pe / denom} color="#3b82f6" />
              <Show when={friction()}>
                <EnergyBar label="Heat (friction)" value={heat} frac={heat / denom} color="#ef4444" />
              </Show>
              <div class="flex justify-between text-[11px] pt-1 border-t" style={{ "border-color": "var(--border-light)" }}>
                <span style={{ color: "var(--text-muted)" }}>Total mechanical</span>
                <span style={{ color: "var(--text-primary)" }}><strong>{(ke + pe).toFixed(2)} J</strong> / start {E0.toFixed(2)} J</span>
              </div>
            </div>
          );
        })()}
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="t" value={`${t().toFixed(2)} s`} color={ACCENT} />
        <StatCard label="speed |v|" value={`${Math.abs(v()).toFixed(2)} m/s`} color="#ec4899" />
        <StatCard label="height h" value={`${heightAt(xPos()).toFixed(2)} m`} color="#3b82f6" />
        <StatCard label="m" value={`${m().toFixed(2)} kg`} color="#a855f7" />
      </div>
    </div>
  );
};

const EnergyBar: Component<{ label: string; value: number; frac: number; color: string }> = (p) => (
  <div>
    <div class="flex justify-between text-[11px] mb-0.5">
      <span style={{ color: p.color, "font-weight": "600" }}>{p.label}</span>
      <span style={{ color: "var(--text-secondary)" }}>{p.value.toFixed(2)} J</span>
    </div>
    <div class="h-3 rounded-full overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      <div
        class="h-full transition-all duration-100"
        style={{
          width: `${clamp(p.frac * 100, 0, 100)}%`,
          background: p.color,
        }}
      />
    </div>
  </div>
);
