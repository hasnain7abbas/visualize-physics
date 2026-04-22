import { Component, createSignal, createMemo, onCleanup, For, Show } from "solid-js";

// ─── Shared helpers ──────────────────────────────────────────────────
const ACCENT = "#22c55e";

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// F1Vectors — Two draggable arrows; live components, magnitude,
// resultant, and toggle between head-to-tail and parallelogram views.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const F1Vectors: Component = () => {
  const svgW = 460, svgH = 320;
  const ox = svgW / 2, oy = svgH / 2;
  const pxPerUnit = 25; // 1 grid square = 1 unit

  const [a, setA] = createSignal({ x: 4, y: 2 });
  const [b, setB] = createSignal({ x: 1, y: -3 });
  const [drag, setDrag] = createSignal<"a" | "b" | null>(null);
  const [mode, setMode] = createSignal<"head" | "para">("head");

  const toSvg = (v: { x: number; y: number }) => ({
    x: ox + v.x * pxPerUnit,
    y: oy - v.y * pxPerUnit,
  });
  const toUnits = (sx: number, sy: number) => ({
    x: (sx - ox) / pxPerUnit,
    y: -(sy - oy) / pxPerUnit,
  });

  const r = createMemo(() => ({ x: a().x + b().x, y: a().y + b().y }));
  const magA = createMemo(() => Math.hypot(a().x, a().y));
  const magB = createMemo(() => Math.hypot(b().x, b().y));
  const magR = createMemo(() => Math.hypot(r().x, r().y));
  const angA = createMemo(() => (Math.atan2(a().y, a().x) * 180) / Math.PI);
  const angB = createMemo(() => (Math.atan2(b().y, b().x) * 180) / Math.PI);
  const angR = createMemo(() => (Math.atan2(r().y, r().x) * 180) / Math.PI);
  const dot = createMemo(() => a().x * b().x + a().y * b().y);
  const between = createMemo(() => {
    const denom = magA() * magB();
    if (denom < 1e-9) return 0;
    return (Math.acos(clamp(dot() / denom, -1, 1)) * 180) / Math.PI;
  });

  const onMove = (e: PointerEvent) => {
    const which = drag();
    if (!which) return;
    const svg = (e.currentTarget as SVGElement).closest("svg");
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * svgW;
    const sy = ((e.clientY - rect.top) / rect.height) * svgH;
    const u = toUnits(sx, sy);
    const snap = (n: number) => Math.round(n * 2) / 2; // half-unit snap
    const v = { x: clamp(snap(u.x), -8, 8), y: clamp(snap(u.y), -5, 5) };
    if (which === "a") setA(v);
    else setB(v);
  };
  const onUp = () => setDrag(null);

  const arrow = (from: { x: number; y: number }, to: { x: number; y: number }, color: string, label: string) => {
    const f = toSvg(from);
    const t = toSvg(to);
    const dx = t.x - f.x, dy = t.y - f.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const head = 9;
    const lx = t.x - ux * head, ly = t.y - uy * head;
    const px = -uy, py = ux;
    return (
      <g>
        <line x1={f.x} y1={f.y} x2={lx} y2={ly} stroke={color} stroke-width="2.5" />
        <polygon
          points={`${t.x},${t.y} ${lx + px * 4},${ly + py * 4} ${lx - px * 4},${ly - py * 4}`}
          fill={color}
        />
        <text
          x={(f.x + t.x) / 2 + 8}
          y={(f.y + t.y) / 2 - 6}
          fill={color}
          font-size="12"
          font-weight="bold"
          font-family="JetBrains Mono, monospace"
        >
          {label}
        </text>
      </g>
    );
  };

  return (
    <div class="space-y-3">
      <div class="flex items-center gap-2 flex-wrap">
        <button
          class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: mode() === "head" ? ACCENT : "var(--bg-secondary)",
            color: mode() === "head" ? "white" : "var(--text-secondary)",
          }}
          onClick={() => setMode("head")}
        >
          Head-to-tail
        </button>
        <button
          class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: mode() === "para" ? ACCENT : "var(--bg-secondary)",
            color: mode() === "para" ? "white" : "var(--text-secondary)",
          }}
          onClick={() => setMode("para")}
        >
          Parallelogram
        </button>
        <span class="text-[11px]" style={{ color: "var(--text-muted)" }}>
          Drag the arrowheads
        </span>
      </div>

      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        class="w-full rounded-lg"
        style={{ background: "var(--bg-secondary)", "max-height": "360px", "touch-action": "none" }}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        {/* Grid */}
        <For each={Array.from({ length: 21 }, (_, i) => i - 10)}>
          {(g) => (
            <>
              <line
                x1={ox + g * pxPerUnit}
                y1={0}
                x2={ox + g * pxPerUnit}
                y2={svgH}
                stroke="var(--border-light)"
                stroke-width={g === 0 ? 1.2 : 0.4}
              />
              <line
                x1={0}
                y1={oy + g * pxPerUnit}
                x2={svgW}
                y2={oy + g * pxPerUnit}
                stroke="var(--border-light)"
                stroke-width={g === 0 ? 1.2 : 0.4}
              />
            </>
          )}
        </For>

        {/* Resultant */}
        {arrow({ x: 0, y: 0 }, r(), ACCENT, "R")}

        {/* Vectors */}
        {mode() === "head" ? (
          <>
            {arrow({ x: 0, y: 0 }, a(), "#3b82f6", "A")}
            {arrow(a(), r(), "#ec4899", "B")}
          </>
        ) : (
          <>
            {arrow({ x: 0, y: 0 }, a(), "#3b82f6", "A")}
            {arrow({ x: 0, y: 0 }, b(), "#ec4899", "B")}
            <line
              x1={toSvg(a()).x} y1={toSvg(a()).y}
              x2={toSvg(r()).x} y2={toSvg(r()).y}
              stroke="#ec4899" stroke-width="1" stroke-dasharray="3,3" opacity="0.55"
            />
            <line
              x1={toSvg(b()).x} y1={toSvg(b()).y}
              x2={toSvg(r()).x} y2={toSvg(r()).y}
              stroke="#3b82f6" stroke-width="1" stroke-dasharray="3,3" opacity="0.55"
            />
          </>
        )}

        {/* Component dashed lines for A */}
        <line x1={toSvg({ x: 0, y: 0 }).x} y1={toSvg({ x: 0, y: 0 }).y} x2={toSvg({ x: a().x, y: 0 }).x} y2={toSvg({ x: a().x, y: 0 }).y} stroke="#3b82f6" stroke-width="0.8" stroke-dasharray="2,3" opacity="0.5" />
        <line x1={toSvg({ x: a().x, y: 0 }).x} y1={toSvg({ x: a().x, y: 0 }).y} x2={toSvg(a()).x} y2={toSvg(a()).y} stroke="#3b82f6" stroke-width="0.8" stroke-dasharray="2,3" opacity="0.5" />

        {/* Drag handles */}
        <circle cx={toSvg(a()).x} cy={toSvg(a()).y} r="9" fill="#3b82f6" stroke="white" stroke-width="2" style={{ cursor: "grab" }}
          onPointerDown={(e) => { (e.target as SVGElement).setPointerCapture(e.pointerId); setDrag("a"); }} />
        <circle cx={mode() === "head" ? toSvg(r()).x : toSvg(b()).x} cy={mode() === "head" ? toSvg(r()).y : toSvg(b()).y} r="9" fill="#ec4899" stroke="white" stroke-width="2" style={{ cursor: "grab" }}
          onPointerDown={(e) => { (e.target as SVGElement).setPointerCapture(e.pointerId); setDrag("b"); }} />
      </svg>

      {/* Stat cards */}
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <StatCard label="A" value={`(${a().x.toFixed(1)}, ${a().y.toFixed(1)})`} sub={`|A| = ${magA().toFixed(2)}, ${angA().toFixed(0)}°`} color="#3b82f6" />
        <StatCard label="B" value={`(${b().x.toFixed(1)}, ${b().y.toFixed(1)})`} sub={`|B| = ${magB().toFixed(2)}, ${angB().toFixed(0)}°`} color="#ec4899" />
        <StatCard label="R = A + B" value={`(${r().x.toFixed(1)}, ${r().y.toFixed(1)})`} sub={`|R| = ${magR().toFixed(2)}, ${angR().toFixed(0)}°`} color={ACCENT} />
        <StatCard label="A · B" value={dot().toFixed(2)} sub="dot product" color="#a855f7" />
        <StatCard label="Angle (A,B)" value={`${between().toFixed(0)}°`} sub="from arccos(A·B/|A||B|)" color="#06b6d4" />
        <StatCard label="|A| + |B|" value={(magA() + magB()).toFixed(2)} sub={`vs |R| = ${magR().toFixed(2)}`} color="#f59e0b" />
      </div>
    </div>
  );
};

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
// F1Velocity — Object on a track; live position-time and velocity-time
// graphs build up as time advances.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const F1Velocity: Component = () => {
  const [v, setV] = createSignal(2); // m/s, can be negative
  const [running, setRunning] = createSignal(false);
  const [t, setT] = createSignal(0);
  const [x, setX] = createSignal(0);
  const [trail, setTrail] = createSignal<{ t: number; x: number; v: number }[]>([{ t: 0, x: 0, v: 2 }]);

  const tMax = 10; // seconds visible
  const xMax = 12; // meters visible

  let raf: number | undefined;
  let last = 0;
  const step = (now: number) => {
    if (!last) last = now;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (running()) {
      const newT = t() + dt;
      const newX = x() + v() * dt;
      setT(newT);
      setX(newX);
      setTrail((prev) => {
        const next = [...prev, { t: newT, x: newX, v: v() }];
        return next.length > 800 ? next.slice(-800) : next;
      });
      if (newT >= tMax) {
        setRunning(false);
      }
    }
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  onCleanup(() => raf && cancelAnimationFrame(raf));

  const reset = () => {
    setRunning(false);
    setT(0);
    setX(0);
    setTrail([{ t: 0, x: 0, v: v() }]);
    last = 0;
  };

  // Track view
  const trackW = 460, trackH = 70;
  const objX = () => clamp(20 + ((x() + xMax) / (2 * xMax)) * (trackW - 40), 5, trackW - 5);

  // Graphs
  const gW = 220, gH = 130;
  const padL = 30, padB = 22, padT = 8, padR = 10;
  const xToGx = (tt: number) => padL + (tt / tMax) * (gW - padL - padR);
  const xToGy = (xx: number) => gH - padB - ((xx + xMax) / (2 * xMax)) * (gH - padT - padB);
  const vToGy = (vv: number) => gH - padB - ((vv + 5) / 10) * (gH - padT - padB);

  const xPath = createMemo(() =>
    trail().map((p, i) => `${i === 0 ? "M" : "L"}${xToGx(p.t).toFixed(1)},${xToGy(p.x).toFixed(1)}`).join(" ")
  );
  const vPath = createMemo(() =>
    trail().map((p, i) => `${i === 0 ? "M" : "L"}${xToGx(p.t).toFixed(1)},${vToGy(p.v).toFixed(1)}`).join(" ")
  );

  return (
    <div class="space-y-3">
      <div class="flex flex-wrap items-center gap-3">
        <label class="text-xs flex-1 min-w-[180px]">
          <span style={{ color: "var(--text-secondary)" }}>Velocity v: <strong>{v().toFixed(1)} m/s</strong></span>
          <input type="range" min={-5} max={5} step={0.1} value={v()} onInput={(e) => setV(parseFloat(e.currentTarget.value))} class="w-full" />
        </label>
        <button onClick={() => setRunning(!running())} class="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: ACCENT, color: "white" }}>
          {running() ? "Pause" : "Start"}
        </button>
        <button onClick={reset} class="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Reset
        </button>
      </div>

      {/* Track */}
      <svg viewBox={`0 0 ${trackW} ${trackH}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "90px" }}>
        <line x1={20} y1={trackH / 2} x2={trackW - 20} y2={trackH / 2} stroke="var(--border)" stroke-width="2" />
        <For each={Array.from({ length: 13 }, (_, i) => i - 6)}>
          {(m) => {
            const px = 20 + ((m + xMax) / (2 * xMax)) * (trackW - 40);
            return (
              <>
                <line x1={px} y1={trackH / 2 - 5} x2={px} y2={trackH / 2 + 5} stroke="var(--border)" stroke-width="1" />
                <text x={px} y={trackH - 4} text-anchor="middle" font-size="9" fill="var(--text-muted)">{m}</text>
              </>
            );
          }}
        </For>
        <circle cx={objX()} cy={trackH / 2} r="9" fill={ACCENT} stroke="white" stroke-width="2" />
        {/* Velocity arrow */}
        <Show when={Math.abs(v()) > 0.01}>
          <line x1={objX()} y1={trackH / 2 - 14} x2={objX() + Math.sign(v()) * 22 * Math.min(1, Math.abs(v()) / 3)} y2={trackH / 2 - 14} stroke="#3b82f6" stroke-width="2" />
          <polygon
            points={`${objX() + Math.sign(v()) * 22 * Math.min(1, Math.abs(v()) / 3)},${trackH / 2 - 14} ${objX() + Math.sign(v()) * 18 * Math.min(1, Math.abs(v()) / 3)},${trackH / 2 - 17} ${objX() + Math.sign(v()) * 18 * Math.min(1, Math.abs(v()) / 3)},${trackH / 2 - 11}`}
            fill="#3b82f6"
          />
        </Show>
      </svg>

      {/* Graphs side by side */}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Graph title="Position x(t)" gW={gW} gH={gH} padL={padL} padR={padR} padT={padT} padB={padB}>
          <line x1={padL} y1={xToGy(0)} x2={gW - padR} y2={xToGy(0)} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="2,2" />
          <text x={4} y={xToGy(xMax) + 4} font-size="9" fill="var(--text-muted)">+{xMax}</text>
          <text x={4} y={xToGy(0) + 3} font-size="9" fill="var(--text-muted)">0</text>
          <text x={4} y={xToGy(-xMax) + 4} font-size="9" fill="var(--text-muted)">−{xMax}</text>
          <path d={xPath()} stroke="#3b82f6" stroke-width="2" fill="none" />
        </Graph>
        <Graph title="Velocity v(t)" gW={gW} gH={gH} padL={padL} padR={padR} padT={padT} padB={padB}>
          <line x1={padL} y1={vToGy(0)} x2={gW - padR} y2={vToGy(0)} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="2,2" />
          <text x={4} y={vToGy(5) + 4} font-size="9" fill="var(--text-muted)">+5</text>
          <text x={4} y={vToGy(0) + 3} font-size="9" fill="var(--text-muted)">0</text>
          <text x={4} y={vToGy(-5) + 4} font-size="9" fill="var(--text-muted)">−5</text>
          <path d={vPath()} stroke="#ec4899" stroke-width="2" fill="none" />
        </Graph>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <StatCard label="Time" value={`${t().toFixed(2)} s`} color={ACCENT} />
        <StatCard label="Position" value={`${x().toFixed(2)} m`} color="#3b82f6" />
        <StatCard label="Speed" value={`${Math.abs(v()).toFixed(2)} m/s`} color="#ec4899" />
      </div>
    </div>
  );
};

const Graph: Component<{ title: string; gW: number; gH: number; padL: number; padR: number; padT: number; padB: number; children: any }> = (p) => (
  <div class="rounded-lg p-2" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
    <div class="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
      {p.title}
    </div>
    <svg viewBox={`0 0 ${p.gW} ${p.gH}`} class="w-full" style={{ "max-height": "150px" }}>
      <rect x={p.padL} y={p.padT} width={p.gW - p.padL - p.padR} height={p.gH - p.padT - p.padB} fill="none" stroke="var(--border)" stroke-width="0.5" />
      {p.children}
      <line x1={p.padL} y1={p.gH - p.padB} x2={p.gW - p.padR} y2={p.gH - p.padB} stroke="var(--text-muted)" stroke-width="0.6" />
      <line x1={p.padL} y1={p.padT} x2={p.padL} y2={p.gH - p.padB} stroke="var(--text-muted)" stroke-width="0.6" />
      <text x={p.gW - p.padR} y={p.gH - 4} text-anchor="end" font-size="9" fill="var(--text-muted)">t (s)</text>
    </svg>
  </div>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// F1Acceleration — Constant acceleration kinematics with x, v, a graphs.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const F1Acceleration: Component = () => {
  const [v0, setV0] = createSignal(0);
  const [a, setA] = createSignal(2);
  const [running, setRunning] = createSignal(false);
  const [t, setT] = createSignal(0);

  const tMax = 6;
  let raf: number | undefined;
  let last = 0;
  const step = (now: number) => {
    if (!last) last = now;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (running()) {
      setT((prev) => {
        const next = prev + dt;
        if (next >= tMax) { setRunning(false); return tMax; }
        return next;
      });
    }
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  onCleanup(() => raf && cancelAnimationFrame(raf));

  const reset = () => { setT(0); setRunning(false); last = 0; };

  const x = () => v0() * t() + 0.5 * a() * t() * t();
  const v = () => v0() + a() * t();

  // Graph dims
  const gW = 460, gH = 200;
  const padL = 36, padB = 26, padT = 10, padR = 12;
  const xMaxG = Math.max(20, Math.abs(v0() * tMax + 0.5 * a() * tMax * tMax) * 1.1);
  const vMaxG = Math.max(8, Math.abs(v0() + a() * tMax) * 1.2);
  const aMaxG = Math.max(3, Math.abs(a()) * 1.5);
  const tToGx = (tt: number) => padL + (tt / tMax) * (gW - padL - padR);
  const xToGy = (xx: number) => gH - padB - ((xx + xMaxG) / (2 * xMaxG)) * (gH - padT - padB);
  const vToGy = (vv: number) => gH - padB - ((vv + vMaxG) / (2 * vMaxG)) * (gH - padT - padB);
  const aToGy = (aa: number) => gH - padB - ((aa + aMaxG) / (2 * aMaxG)) * (gH - padT - padB);

  const xPath = createMemo(() => {
    const N = 80;
    let d = "";
    for (let i = 0; i <= N; i++) {
      const tt = (i / N) * t();
      const xx = v0() * tt + 0.5 * a() * tt * tt;
      d += `${i === 0 ? "M" : "L"}${tToGx(tt).toFixed(1)},${xToGy(xx).toFixed(1)} `;
    }
    return d;
  });
  const vPath = createMemo(() => `M${tToGx(0)},${vToGy(v0())} L${tToGx(t())},${vToGy(v())}`);
  const aPath = createMemo(() => `M${tToGx(0)},${aToGy(a())} L${tToGx(t())},${aToGy(a())}`);

  return (
    <div class="space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Initial velocity v₀: <strong>{v0().toFixed(1)} m/s</strong></span>
          <input type="range" min={-8} max={8} step={0.5} value={v0()} onInput={(e) => { setV0(parseFloat(e.currentTarget.value)); reset(); }} class="w-full" />
        </label>
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Acceleration a: <strong>{a().toFixed(1)} m/s²</strong></span>
          <input type="range" min={-4} max={4} step={0.1} value={a()} onInput={(e) => { setA(parseFloat(e.currentTarget.value)); reset(); }} class="w-full" />
        </label>
      </div>

      <div class="flex gap-2">
        <button onClick={() => setRunning(!running())} class="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: ACCENT, color: "white" }}>
          {running() ? "Pause" : "Start"}
        </button>
        <button onClick={reset} class="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Reset
        </button>
      </div>

      {/* Combined graphs */}
      <div class="rounded-lg p-2" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}>
        <div class="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-widest mb-1">
          <span style={{ color: "#3b82f6" }}>● x(t)</span>
          <span style={{ color: "#ec4899" }}>● v(t)</span>
          <span style={{ color: "#f59e0b" }}>● a(t)</span>
        </div>
        <svg viewBox={`0 0 ${gW} ${gH}`} class="w-full" style={{ "max-height": "240px" }}>
          <rect x={padL} y={padT} width={gW - padL - padR} height={gH - padT - padB} fill="none" stroke="var(--border)" stroke-width="0.5" />
          <line x1={padL} y1={(padT + gH - padB) / 2} x2={gW - padR} y2={(padT + gH - padB) / 2} stroke="var(--border)" stroke-width="0.4" stroke-dasharray="3,3" />
          <path d={xPath()} stroke="#3b82f6" stroke-width="2" fill="none" />
          <path d={vPath()} stroke="#ec4899" stroke-width="2" fill="none" />
          <path d={aPath()} stroke="#f59e0b" stroke-width="2" fill="none" />
          <text x={gW - padR} y={gH - 5} text-anchor="end" font-size="10" fill="var(--text-muted)">t (s)</text>
        </svg>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="t" value={`${t().toFixed(2)} s`} color={ACCENT} />
        <StatCard label="x(t)" value={`${x().toFixed(2)} m`} color="#3b82f6" />
        <StatCard label="v(t)" value={`${v().toFixed(2)} m/s`} color="#ec4899" />
        <StatCard label="a(t)" value={`${a().toFixed(2)} m/s²`} color="#f59e0b" />
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// F1Forces — Block on a surface; apply force, watch resulting acceleration.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const F1Forces: Component = () => {
  const g = 9.81;
  const [F, setF] = createSignal(15); // applied N (horizontal)
  const [m, setM] = createSignal(2); // kg
  const [mu, setMu] = createSignal(0.2); // friction coefficient
  const [running, setRunning] = createSignal(false);
  const [t, setT] = createSignal(0);
  const [v, setV] = createSignal(0);
  const [pos, setPos] = createSignal(0);

  const N = createMemo(() => m() * g); // normal force
  const fkMax = createMemo(() => mu() * N()); // max friction
  const fric = createMemo(() => {
    if (Math.abs(v()) > 0.05) return -Math.sign(v()) * fkMax();
    // static
    return Math.abs(F()) <= fkMax() ? -F() : -Math.sign(F()) * fkMax();
  });
  const Fnet = createMemo(() => F() + fric());
  const a = createMemo(() => Fnet() / m());

  let raf: number | undefined;
  let last = 0;
  const step = (now: number) => {
    if (!last) last = now;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (running()) {
      setT((p) => p + dt);
      setV((vv) => vv + a() * dt);
      setPos((px) => clamp(px + v() * dt, -8, 8));
    }
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  onCleanup(() => raf && cancelAnimationFrame(raf));

  const reset = () => { setT(0); setV(0); setPos(0); setRunning(false); last = 0; };

  // Display
  const sceneW = 460, sceneH = 200;
  const ground = 150;
  const blockSize = 26 + 8 * Math.sqrt(m()); // grow with mass
  const blockX = () => sceneW / 2 + pos() * 22;
  const blockY = () => ground - blockSize;

  return (
    <div class="space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Applied force F: <strong>{F().toFixed(1)} N</strong></span>
          <input type="range" min={-30} max={30} step={0.5} value={F()} onInput={(e) => setF(parseFloat(e.currentTarget.value))} class="w-full" />
        </label>
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Mass m: <strong>{m().toFixed(1)} kg</strong></span>
          <input type="range" min={0.5} max={10} step={0.1} value={m()} onInput={(e) => { setM(parseFloat(e.currentTarget.value)); reset(); }} class="w-full" />
        </label>
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Friction μ: <strong>{mu().toFixed(2)}</strong></span>
          <input type="range" min={0} max={0.8} step={0.01} value={mu()} onInput={(e) => setMu(parseFloat(e.currentTarget.value))} class="w-full" />
        </label>
      </div>

      <div class="flex gap-2">
        <button onClick={() => setRunning(!running())} class="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: ACCENT, color: "white" }}>
          {running() ? "Pause" : "Start"}
        </button>
        <button onClick={reset} class="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
          Reset
        </button>
      </div>

      <svg viewBox={`0 0 ${sceneW} ${sceneH}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "260px" }}>
        {/* Ground */}
        <line x1={0} y1={ground} x2={sceneW} y2={ground} stroke="var(--text-muted)" stroke-width="1.5" />
        <For each={Array.from({ length: 12 }, (_, i) => i)}>
          {(i) => <line x1={i * (sceneW / 12)} y1={ground} x2={i * (sceneW / 12) + 8} y2={ground + 6} stroke="var(--text-muted)" stroke-width="0.6" />}
        </For>

        {/* Block */}
        <rect x={blockX() - blockSize / 2} y={blockY()} width={blockSize} height={blockSize} fill={ACCENT} opacity="0.85" stroke="var(--text-primary)" stroke-width="1" rx="3" />
        <text x={blockX()} y={blockY() + blockSize / 2 + 4} text-anchor="middle" font-size="11" font-weight="bold" fill="white">{m().toFixed(1)} kg</text>

        {/* Force arrows */}
        <Show when={Math.abs(F()) > 0.1}>
          {(() => {
            const len = clamp(Math.abs(F()) * 2.2, 10, 100);
            const sgn = Math.sign(F());
            const startX = blockX() + sgn * blockSize / 2;
            return (
              <g>
                <line x1={startX} y1={blockY() + blockSize / 2} x2={startX + sgn * len} y2={blockY() + blockSize / 2} stroke="#3b82f6" stroke-width="3" />
                <polygon points={`${startX + sgn * len},${blockY() + blockSize / 2} ${startX + sgn * (len - 7)},${blockY() + blockSize / 2 - 5} ${startX + sgn * (len - 7)},${blockY() + blockSize / 2 + 5}`} fill="#3b82f6" />
                <text x={startX + sgn * len + sgn * 6} y={blockY() + blockSize / 2 + 4} text-anchor={sgn > 0 ? "start" : "end"} font-size="11" font-weight="bold" fill="#3b82f6">F</text>
              </g>
            );
          })()}
        </Show>

        {/* Friction arrow */}
        <Show when={Math.abs(fric()) > 0.1}>
          {(() => {
            const len = clamp(Math.abs(fric()) * 2.2, 10, 100);
            const sgn = Math.sign(fric());
            return (
              <g>
                <line x1={blockX()} y1={ground - 4} x2={blockX() + sgn * len} y2={ground - 4} stroke="#ef4444" stroke-width="2.5" />
                <polygon points={`${blockX() + sgn * len},${ground - 4} ${blockX() + sgn * (len - 7)},${ground - 9} ${blockX() + sgn * (len - 7)},${ground + 1}`} fill="#ef4444" />
                <text x={blockX() + sgn * len + sgn * 6} y={ground + 8} text-anchor={sgn > 0 ? "start" : "end"} font-size="10" fill="#ef4444">f</text>
              </g>
            );
          })()}
        </Show>

        {/* Weight & Normal */}
        <line x1={blockX() - 10} y1={blockY() + blockSize / 2} x2={blockX() - 10} y2={blockY() + blockSize / 2 + 30} stroke="#a855f7" stroke-width="2" />
        <polygon points={`${blockX() - 10},${blockY() + blockSize / 2 + 30} ${blockX() - 14},${blockY() + blockSize / 2 + 24} ${blockX() - 6},${blockY() + blockSize / 2 + 24}`} fill="#a855f7" />
        <text x={blockX() - 16} y={blockY() + blockSize / 2 + 28} text-anchor="end" font-size="9" fill="#a855f7">W</text>
        <line x1={blockX() + 10} y1={blockY() + blockSize / 2} x2={blockX() + 10} y2={blockY() + blockSize / 2 - 30} stroke="#06b6d4" stroke-width="2" />
        <polygon points={`${blockX() + 10},${blockY() + blockSize / 2 - 30} ${blockX() + 6},${blockY() + blockSize / 2 - 24} ${blockX() + 14},${blockY() + blockSize / 2 - 24}`} fill="#06b6d4" />
        <text x={blockX() + 16} y={blockY() + blockSize / 2 - 25} font-size="9" fill="#06b6d4">N</text>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="F net" value={`${Fnet().toFixed(1)} N`} color="#3b82f6" />
        <StatCard label="a = F/m" value={`${a().toFixed(2)} m/s²`} color={ACCENT} />
        <StatCard label="v" value={`${v().toFixed(2)} m/s`} color="#ec4899" />
        <StatCard label="W = mg" value={`${(m() * g).toFixed(1)} N`} color="#a855f7" />
      </div>
      <Show when={Math.abs(F()) <= fkMax() && Math.abs(v()) < 0.05}>
        <div class="rounded-lg p-2 text-xs text-center" style={{ background: "#fef3c7", color: "#92400e" }}>
          Static friction balances the applied force. Block stays at rest until F exceeds μN = {fkMax().toFixed(2)} N.
        </div>
      </Show>
    </div>
  );
};
