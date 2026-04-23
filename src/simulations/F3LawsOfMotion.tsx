import { Component, createSignal, createMemo, onCleanup, For, Show } from "solid-js";

const ACCENT = "#ef4444";

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
// F3Inertia — Yank a rug out from under a stack of blocks.
// Low friction: blocks stay put and fall straight down. High friction:
// blocks get dragged along with the rug.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const F3Inertia: Component = () => {
  const W = 460, H = 240;
  const GROUND_Y = H - 30;
  const RUG_W = 180, RUG_H = 10;
  const BLOCK = 26;
  const G = 900; // px/s^2

  type Block = { x: number; y: number; vx: number; vy: number };
  const RUG_X0 = (W - RUG_W) / 2;
  const initialBlocks = (): Block[] => [
    { x: RUG_X0 + RUG_W / 2 - BLOCK / 2, y: GROUND_Y - RUG_H - BLOCK, vx: 0, vy: 0 },
    { x: RUG_X0 + RUG_W / 2 - BLOCK / 2, y: GROUND_Y - RUG_H - 2 * BLOCK, vx: 0, vy: 0 },
    { x: RUG_X0 + RUG_W / 2 - BLOCK / 2, y: GROUND_Y - RUG_H - 3 * BLOCK, vx: 0, vy: 0 },
  ];

  const [rugX, setRugX] = createSignal(RUG_X0);
  const [rugVx, setRugVx] = createSignal(0);
  const [blocks, setBlocks] = createSignal<Block[]>(initialBlocks());
  const [friction, setFriction] = createSignal(0.18);
  const [running, setRunning] = createSignal(false);

  const reset = () => {
    setRunning(false);
    setRugX(RUG_X0);
    setRugVx(0);
    setBlocks(initialBlocks());
  };

  const yank = () => {
    reset();
    setRugVx(900);
    setRunning(true);
  };

  let raf: number | undefined;
  let last = performance.now();
  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    if (running()) {
      // Rug: decelerates due to ground friction
      let rv = rugVx();
      rv *= Math.pow(0.1, dt); // exponential decay so it stops naturally
      const newRugX = rugX() + rv * dt;
      setRugX(newRugX);
      setRugVx(rv);

      // Blocks
      const mu = friction();
      const maxDrag = mu * G; // px/s^2
      setBlocks((bs) =>
        bs.map((b) => {
          let { x, y, vx, vy } = b;
          const blockBottom = y + BLOCK;
          const onRug =
            blockBottom >= GROUND_Y - RUG_H - 0.5 &&
            blockBottom <= GROUND_Y - RUG_H + 2 &&
            x + BLOCK > newRugX &&
            x < newRugX + RUG_W;

          if (onRug) {
            // Friction pulls block toward rug velocity, bounded by maxDrag
            const dv = rv - vx;
            const accel = Math.sign(dv) * Math.min(Math.abs(dv) / Math.max(dt, 1e-4), maxDrag);
            vx += accel * dt;
          } else if (y + BLOCK < GROUND_Y) {
            // Falling
            vy += G * dt;
          }

          x += vx * dt;
          y += vy * dt;
          if (y + BLOCK > GROUND_Y) {
            y = GROUND_Y - BLOCK;
            vy = 0;
            vx *= 0.7; // friction with ground
            if (Math.abs(vx) < 1) vx = 0;
          }
          return { x, y, vx, vy };
        })
      );

      if (Math.abs(rv) < 5 && blocks().every((b) => Math.abs(b.vx) < 1 && Math.abs(b.vy) < 1)) {
        setRunning(false);
      }
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  onCleanup(() => raf && cancelAnimationFrame(raf));

  return (
    <div class="space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <button
          onClick={yank}
          class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-transform active:scale-95"
          style={{ background: ACCENT, color: "white" }}
        >
          ⚡ Yank the rug
        </button>
        <button
          onClick={reset}
          class="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
        >
          Reset
        </button>
        <label class="text-xs flex-1 min-w-[180px]">
          <span style={{ color: "var(--text-secondary)" }}>
            Friction μ: <strong>{friction().toFixed(2)}</strong>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={friction()}
            onInput={(e) => setFriction(parseFloat(e.currentTarget.value))}
            class="w-full"
          />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)" }}>
        {/* Ground */}
        <line x1={0} y1={GROUND_Y} x2={W} y2={GROUND_Y} stroke="var(--text-muted)" stroke-width="2" />
        {/* Rug */}
        <rect x={rugX()} y={GROUND_Y - RUG_H} width={RUG_W} height={RUG_H} fill={ACCENT} opacity="0.7" />
        <For each={Array.from({ length: 12 })}>
          {(_, i) => (
            <line
              x1={rugX() + (i() + 0.5) * (RUG_W / 12)}
              y1={GROUND_Y - RUG_H + 1}
              x2={rugX() + (i() + 0.5) * (RUG_W / 12)}
              y2={GROUND_Y - 1}
              stroke="#fff"
              stroke-width="0.8"
              opacity="0.6"
            />
          )}
        </For>
        {/* Blocks */}
        <For each={blocks()}>
          {(b, i) => (
            <rect
              x={b.x}
              y={b.y}
              width={BLOCK}
              height={BLOCK}
              fill={`hsl(${200 + i() * 40}, 65%, 55%)`}
              stroke="var(--text-primary)"
              stroke-width="1"
              rx="2"
            />
          )}
        </For>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <StatCard label="Rug speed" value={`${rugVx().toFixed(0)} px/s`} color={ACCENT} />
        <StatCard label="Friction" value={friction().toFixed(2)} sub={friction() < 0.25 ? "low — blocks stay" : friction() < 0.6 ? "medium" : "high — blocks drag"} color="#3b82f6" />
        <StatCard label="State" value={running() ? "yanking" : "at rest"} color="#8b5cf6" />
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// F3Gravity — Feather vs bowling ball. Without air: same rate.
// With air: feather is slowed by drag, ball barely cares.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const F3Gravity: Component = () => {
  const W = 460, H = 320;
  const TOP_Y = 30;
  const GROUND_Y = H - 20;
  const G_phys = 9.81; // m/s²
  const H_phys = 10; // meters drop
  const yScale = (GROUND_Y - TOP_Y) / H_phys;

  const [feather, setFeather] = createSignal({ y: 0, vy: 0 });
  const [ball, setBall] = createSignal({ y: 0, vy: 0 });
  const [t, setT] = createSignal(0);
  const [running, setRunning] = createSignal(false);
  const [airResistance, setAirResistance] = createSignal(false);

  const reset = () => {
    setRunning(false);
    setFeather({ y: 0, vy: 0 });
    setBall({ y: 0, vy: 0 });
    setT(0);
  };
  const drop = () => { reset(); setRunning(true); };

  // Drag coefficients (per unit mass, so units are 1/s):
  // Feather: tiny mass, huge drag → quickly hits terminal velocity.
  // Ball: large mass, drag is negligible.
  const C_FEATHER = 6.0;
  const C_BALL = 0.03;

  let raf: number | undefined;
  let last = performance.now();
  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    if (running()) {
      setT((v) => v + dt);
      setFeather((f) => {
        if (f.y >= H_phys) return { y: H_phys, vy: 0 };
        const drag = airResistance() ? C_FEATHER * f.vy : 0;
        const a = G_phys - drag;
        const vy = f.vy + a * dt;
        const y = Math.min(f.y + vy * dt, H_phys);
        return { y, vy };
      });
      setBall((b) => {
        if (b.y >= H_phys) return { y: H_phys, vy: 0 };
        const drag = airResistance() ? C_BALL * b.vy : 0;
        const a = G_phys - drag;
        const vy = b.vy + a * dt;
        const y = Math.min(b.y + vy * dt, H_phys);
        return { y, vy };
      });
      if (feather().y >= H_phys && ball().y >= H_phys) setRunning(false);
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  onCleanup(() => raf && cancelAnimationFrame(raf));

  const featherPx = () => TOP_Y + feather().y * yScale;
  const ballPx = () => TOP_Y + ball().y * yScale;

  return (
    <div class="space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <button
          onClick={drop}
          class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-transform active:scale-95"
          style={{ background: ACCENT, color: "white" }}
        >
          ⬇ Drop both
        </button>
        <button
          onClick={reset}
          class="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
        >
          Reset
        </button>
        <label class="text-xs flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={airResistance()} onChange={(e) => setAirResistance(e.currentTarget.checked)} />
          <span style={{ color: "var(--text-secondary)" }}>Air resistance</span>
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)" }}>
        {/* Two lanes */}
        <For each={[0.28, 0.72]}>
          {(fx) => (
            <line x1={fx * W} y1={TOP_Y} x2={fx * W} y2={GROUND_Y} stroke="var(--border-light)" stroke-width="1" stroke-dasharray="3,3" />
          )}
        </For>
        <line x1={0} y1={GROUND_Y} x2={W} y2={GROUND_Y} stroke="var(--text-muted)" stroke-width="2" />
        {/* Labels */}
        <text x={0.28 * W} y={TOP_Y - 10} text-anchor="middle" font-size="11" font-weight="bold" fill="var(--text-primary)">Feather (0.01 kg)</text>
        <text x={0.72 * W} y={TOP_Y - 10} text-anchor="middle" font-size="11" font-weight="bold" fill="var(--text-primary)">Bowling ball (6 kg)</text>
        {/* Feather */}
        <g transform={`translate(${0.28 * W},${featherPx()})`}>
          <path d="M 0 -10 Q 8 0 0 10 Q -3 0 0 -10 Z" fill="#fde68a" stroke="#92400e" stroke-width="1" />
        </g>
        {/* Ball */}
        <g transform={`translate(${0.72 * W},${ballPx()})`}>
          <circle cx={0} cy={0} r={14} fill="#1f2937" stroke="#000" stroke-width="1" />
          <circle cx={-3} cy={-3} r={3} fill="#94a3b8" opacity="0.6" />
        </g>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="Time" value={`${t().toFixed(2)} s`} color={ACCENT} />
        <StatCard label="Feather v" value={`${feather().vy.toFixed(2)} m/s`} color="#f59e0b" />
        <StatCard label="Ball v" value={`${ball().vy.toFixed(2)} m/s`} color="#3b82f6" />
        <StatCard label="Δy" value={`${(ball().y - feather().y).toFixed(2)} m`} sub="ball − feather" color="#8b5cf6" />
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// F3ActionReaction — Two skaters push off each other. Equal force,
// opposite directions; lighter skater ends up with higher speed.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const F3ActionReaction: Component = () => {
  const W = 460, H = 200;
  const ICE_Y = H - 30;

  const [mA, setMA] = createSignal(1);
  const [mB, setMB] = createSignal(3);
  const [force, setForce] = createSignal(20);
  const [posA, setPosA] = createSignal(W * 0.35);
  const [posB, setPosB] = createSignal(W * 0.65);
  const [vA, setVA] = createSignal(0);
  const [vB, setVB] = createSignal(0);
  const [running, setRunning] = createSignal(false);

  const reset = () => {
    setRunning(false);
    setPosA(W * 0.35);
    setPosB(W * 0.65);
    setVA(0);
    setVB(0);
  };
  const push = () => {
    reset();
    // Instant impulse J; equal and opposite.
    const J = force();
    setVA(-J / mA());
    setVB(J / mB());
    setRunning(true);
  };

  let raf: number | undefined;
  let last = performance.now();
  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    if (running()) {
      setPosA((x) => {
        const nx = x + vA() * dt;
        if (nx < 20) { setVA(-vA() * 0.5); return 20; }
        return nx;
      });
      setPosB((x) => {
        const nx = x + vB() * dt;
        if (nx > W - 20) { setVB(-vB() * 0.5); return W - 20; }
        return nx;
      });
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  onCleanup(() => raf && cancelAnimationFrame(raf));

  const rA = () => 10 + 3 * mA();
  const rB = () => 10 + 3 * mB();

  return (
    <div class="space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Mass A: <strong>{mA().toFixed(1)} kg</strong></span>
          <input type="range" min={0.5} max={5} step={0.1} value={mA()} onInput={(e) => setMA(parseFloat(e.currentTarget.value))} class="w-full" />
        </label>
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Mass B: <strong>{mB().toFixed(1)} kg</strong></span>
          <input type="range" min={0.5} max={5} step={0.1} value={mB()} onInput={(e) => setMB(parseFloat(e.currentTarget.value))} class="w-full" />
        </label>
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Push impulse: <strong>{force().toFixed(0)} N·s</strong></span>
          <input type="range" min={5} max={60} step={1} value={force()} onInput={(e) => setForce(parseFloat(e.currentTarget.value))} class="w-full" />
        </label>
      </div>
      <div class="flex gap-2">
        <button
          onClick={push}
          class="px-4 py-1.5 rounded-lg text-xs font-semibold"
          style={{ background: ACCENT, color: "white" }}
        >
          ⇆ Push off
        </button>
        <button
          onClick={reset}
          class="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
        >
          Reset
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)" }}>
        {/* Ice line */}
        <line x1={0} y1={ICE_Y} x2={W} y2={ICE_Y} stroke="#7dd3fc" stroke-width="2" />
        {/* Force arrows shown briefly */}
        <Show when={!running()}>
          <g opacity="0.5">
            <line x1={posA() + 15} y1={ICE_Y - 40} x2={posB() - 15} y2={ICE_Y - 40} stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="4,4" />
            <text x={(posA() + posB()) / 2} y={ICE_Y - 46} text-anchor="middle" font-size="10" fill="var(--text-muted)">F = {force()} N·s</text>
          </g>
        </Show>
        {/* Skater A */}
        <g transform={`translate(${posA()},${ICE_Y - rA()})`}>
          <circle cx={0} cy={0} r={rA()} fill="#3b82f6" stroke="var(--text-primary)" stroke-width="1.5" />
          <text x={0} y={4} text-anchor="middle" font-size="12" font-weight="bold" fill="white">A</text>
        </g>
        <Show when={running() && Math.abs(vA()) > 0.1}>
          <line
            x1={posA()}
            y1={ICE_Y - rA() - 16}
            x2={posA() + vA() * 1.5}
            y2={ICE_Y - rA() - 16}
            stroke="#3b82f6"
            stroke-width="2"
            marker-end="url(#arrL)"
          />
        </Show>
        {/* Skater B */}
        <g transform={`translate(${posB()},${ICE_Y - rB()})`}>
          <circle cx={0} cy={0} r={rB()} fill="#22c55e" stroke="var(--text-primary)" stroke-width="1.5" />
          <text x={0} y={4} text-anchor="middle" font-size="12" font-weight="bold" fill="white">B</text>
        </g>
        <Show when={running() && Math.abs(vB()) > 0.1}>
          <line
            x1={posB()}
            y1={ICE_Y - rB() - 16}
            x2={posB() + vB() * 1.5}
            y2={ICE_Y - rB() - 16}
            stroke="#22c55e"
            stroke-width="2"
            marker-end="url(#arrR)"
          />
        </Show>
        <defs>
          <marker id="arrL" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
          <marker id="arrR" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
          </marker>
        </defs>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="v_A" value={`${vA().toFixed(2)} m/s`} sub={`= −J/m_A`} color="#3b82f6" />
        <StatCard label="v_B" value={`${vB().toFixed(2)} m/s`} sub={`= J/m_B`} color="#22c55e" />
        <StatCard label="|v_A|/|v_B|" value={mA() > 0 && mB() > 0 ? (mB() / mA()).toFixed(2) : "—"} sub="= m_B/m_A" color={ACCENT} />
        <StatCard label="p_total" value={`${(mA() * vA() + mB() * vB()).toFixed(2)}`} sub="kg·m/s — conserved" color="#8b5cf6" />
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// F3BalancedForces — Tug of war. Box accelerates when F_net ≠ 0.
// Balanced forces leave it at constant velocity.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const F3BalancedForces: Component = () => {
  const W = 460, H = 200;
  const GROUND_Y = H - 30;
  const BOX = 48;

  const [fL, setFL] = createSignal(20);
  const [fR, setFR] = createSignal(20);
  const [mass, setMass] = createSignal(2);
  const [x, setX] = createSignal(W / 2 - BOX / 2);
  const [v, setV] = createSignal(0);
  const [running, setRunning] = createSignal(false);

  const fNet = () => fR() - fL();
  const a = () => fNet() / mass();

  const reset = () => { setRunning(false); setX(W / 2 - BOX / 2); setV(0); };

  let raf: number | undefined;
  let last = performance.now();
  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    if (running()) {
      setV((vv) => vv + a() * dt * 30); // scale to px/s for visibility
      setX((xx) => {
        let nx = xx + v() * dt;
        if (nx < 0) { nx = 0; setV(0); }
        if (nx > W - BOX) { nx = W - BOX; setV(0); }
        return nx;
      });
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  onCleanup(() => raf && cancelAnimationFrame(raf));

  const arrowLen = (f: number) => clamp(f * 1.5, 0, 90);
  const bx = () => x() + BOX / 2;
  const by = () => GROUND_Y - BOX / 2;

  return (
    <div class="space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Force left ←: <strong>{fL()} N</strong></span>
          <input type="range" min={0} max={60} step={1} value={fL()} onInput={(e) => setFL(parseFloat(e.currentTarget.value))} class="w-full" />
        </label>
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Force right →: <strong>{fR()} N</strong></span>
          <input type="range" min={0} max={60} step={1} value={fR()} onInput={(e) => setFR(parseFloat(e.currentTarget.value))} class="w-full" />
        </label>
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Mass: <strong>{mass().toFixed(1)} kg</strong></span>
          <input type="range" min={0.5} max={10} step={0.1} value={mass()} onInput={(e) => setMass(parseFloat(e.currentTarget.value))} class="w-full" />
        </label>
      </div>
      <div class="flex gap-2">
        <button
          onClick={() => setRunning(!running())}
          class="px-4 py-1.5 rounded-lg text-xs font-semibold"
          style={{ background: ACCENT, color: "white" }}
        >
          {running() ? "⏸ Pause" : "▶ Play"}
        </button>
        <button
          onClick={reset}
          class="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
        >
          Reset
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)" }}>
        <line x1={0} y1={GROUND_Y} x2={W} y2={GROUND_Y} stroke="var(--text-muted)" stroke-width="2" />
        {/* Box */}
        <rect x={x()} y={GROUND_Y - BOX} width={BOX} height={BOX} fill="#fbbf24" stroke="var(--text-primary)" stroke-width="1.5" rx="3" />
        <text x={bx()} y={by() + 4} text-anchor="middle" font-size="11" font-weight="bold" fill="var(--text-primary)">
          {mass().toFixed(1)} kg
        </text>
        {/* Left arrow (pointing left from box) */}
        <Show when={fL() > 0}>
          <line x1={x()} y1={by()} x2={x() - arrowLen(fL())} y2={by()} stroke="#ef4444" stroke-width="3" marker-end="url(#arrLeft)" />
          <text x={x() - arrowLen(fL()) / 2} y={by() - 8} text-anchor="middle" font-size="10" font-weight="bold" fill="#ef4444">{fL()} N</text>
        </Show>
        {/* Right arrow */}
        <Show when={fR() > 0}>
          <line x1={x() + BOX} y1={by()} x2={x() + BOX + arrowLen(fR())} y2={by()} stroke="#3b82f6" stroke-width="3" marker-end="url(#arrRight)" />
          <text x={x() + BOX + arrowLen(fR()) / 2} y={by() - 8} text-anchor="middle" font-size="10" font-weight="bold" fill="#3b82f6">{fR()} N</text>
        </Show>
        {/* Net force badge */}
        <g transform={`translate(${W / 2},20)`}>
          <rect x={-55} y={-12} width={110} height={20} rx={10}
            fill={fNet() === 0 ? "#22c55e22" : `${ACCENT}22`}
            stroke={fNet() === 0 ? "#22c55e" : ACCENT} stroke-width="1" />
          <text x={0} y={3} text-anchor="middle" font-size="11" font-weight="bold"
            fill={fNet() === 0 ? "#22c55e" : ACCENT}>
            F_net = {fNet() > 0 ? "+" : ""}{fNet()} N
          </text>
        </g>
        <defs>
          <marker id="arrLeft" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
          <marker id="arrRight" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="F_net" value={`${fNet()} N`} color={fNet() === 0 ? "#22c55e" : ACCENT} />
        <StatCard label="a = F/m" value={`${a().toFixed(2)} m/s²`} color="#3b82f6" />
        <StatCard label="Box velocity" value={`${v().toFixed(1)} px/s`} color="#8b5cf6" />
        <StatCard label="Status" value={fNet() === 0 ? "equilibrium" : "accelerating"} color={fNet() === 0 ? "#22c55e" : ACCENT} />
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// F3KineticTheory — Particles in a box. Low T → solid (jitter on lattice);
// medium T → liquid (clumped under gravity); high T → gas (free flight).
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const F3KineticTheory: Component = () => {
  const W = 460, H = 280;
  const N = 48;
  const R = 5;

  type P = { x: number; y: number; vx: number; vy: number; hx: number; hy: number };
  // hx, hy: home lattice position for solid state.
  const makeParticles = (): P[] => {
    const cols = 8, rows = 6;
    const spacing = 26;
    const x0 = (W - (cols - 1) * spacing) / 2;
    const y0 = H - 20 - (rows - 1) * spacing;
    const arr: P[] = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const hx = x0 + i * spacing, hy = y0 + j * spacing;
        arr.push({ x: hx, y: hy, vx: 0, vy: 0, hx, hy });
      }
    }
    return arr;
  };

  const [T, setT] = createSignal(50);
  const [particles, setParticles] = createSignal<P[]>(makeParticles());

  // Regime
  const regime = () => (T() < 25 ? "solid" : T() < 65 ? "liquid" : "gas");

  let raf: number | undefined;
  let last = performance.now();
  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    const Tv = T();
    const speed = Tv / 20; // px per step scale
    const r = regime();
    setParticles((arr) =>
      arr.map((p) => {
        let { x, y, vx, vy } = p;
        if (r === "solid") {
          // Spring pull toward home with thermal jitter.
          const kx = (p.hx - x) * 8;
          const ky = (p.hy - y) * 8;
          vx = (vx + kx * dt) * 0.85 + (Math.random() - 0.5) * speed * 0.6;
          vy = (vy + ky * dt) * 0.85 + (Math.random() - 0.5) * speed * 0.6;
        } else if (r === "liquid") {
          // Gravity + random thermal kicks.
          vx += (Math.random() - 0.5) * speed * 0.4;
          vy += (Math.random() - 0.5) * speed * 0.4 + 40 * dt;
          // Limit speed
          const s = Math.hypot(vx, vy);
          const max = Tv / 3;
          if (s > max) { vx *= max / s; vy *= max / s; }
        } else {
          // Gas: maintain speed, random small perturbation only when too slow.
          const s = Math.hypot(vx, vy);
          const target = Tv / 4;
          if (s < target * 0.5) {
            const ang = Math.random() * Math.PI * 2;
            vx = Math.cos(ang) * target;
            vy = Math.sin(ang) * target;
          }
        }
        x += vx * dt * 30;
        y += vy * dt * 30;
        // Walls
        if (x < R) { x = R; vx = Math.abs(vx); }
        if (x > W - R) { x = W - R; vx = -Math.abs(vx); }
        if (y < R) { y = R; vy = Math.abs(vy); }
        if (y > H - R) { y = H - R; vy = -Math.abs(vy); }
        return { x, y, vx, vy, hx: p.hx, hy: p.hy };
      })
    );
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  onCleanup(() => raf && cancelAnimationFrame(raf));

  const avgSpeed = createMemo(() => {
    const ps = particles();
    if (!ps.length) return 0;
    let s = 0;
    for (const p of ps) s += Math.hypot(p.vx, p.vy);
    return s / ps.length;
  });

  return (
    <div class="space-y-3">
      <label class="text-xs block">
        <span style={{ color: "var(--text-secondary)" }}>
          Temperature (arbitrary units): <strong>{T().toFixed(0)}</strong>
          <span class="ml-3 px-2 py-0.5 rounded" style={{
            background: regime() === "solid" ? "#3b82f622" : regime() === "liquid" ? "#22c55e22" : "#ef444422",
            color: regime() === "solid" ? "#3b82f6" : regime() === "liquid" ? "#22c55e" : "#ef4444",
            "font-weight": "bold",
          }}>
            {regime()}
          </span>
        </span>
        <input type="range" min={1} max={120} step={1} value={T()} onInput={(e) => setT(parseFloat(e.currentTarget.value))} class="w-full" />
      </label>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)" }}>
        <rect x={1} y={1} width={W - 2} height={H - 2} fill="none" stroke="var(--text-primary)" stroke-width="2" />
        <For each={particles()}>
          {(p) => (
            <circle
              cx={p.x}
              cy={p.y}
              r={R}
              fill={regime() === "solid" ? "#3b82f6" : regime() === "liquid" ? "#22c55e" : "#ef4444"}
              opacity="0.85"
            />
          )}
        </For>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="T" value={T().toFixed(0)} color={ACCENT} />
        <StatCard label="Avg |v|" value={avgSpeed().toFixed(2)} sub="∝ √T" color="#3b82f6" />
        <StatCard label="⟨KE⟩" value={(0.5 * avgSpeed() ** 2).toFixed(2)} sub="∝ T" color="#8b5cf6" />
        <StatCard label="State" value={regime()} color={regime() === "solid" ? "#3b82f6" : regime() === "liquid" ? "#22c55e" : "#ef4444"} />
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// F3Lever — Seesaw with movable fulcrum. Balance when τ_L = τ_R, i.e.
// m_L · d_L = m_R · d_R.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const F3Lever: Component = () => {
  const W = 460, H = 240;
  const PIVOT_Y = H - 70;
  const BAR_L = 360; // px

  const [fulcrum, setFulcrum] = createSignal(0.5); // fraction 0..1 along bar
  const [mL, setML] = createSignal(4);
  const [mR, setMR] = createSignal(2);

  const dL_px = () => fulcrum() * BAR_L;
  const dR_px = () => (1 - fulcrum()) * BAR_L;
  const tauL = () => mL() * dL_px();
  const tauR = () => mR() * dR_px();
  const net = () => tauR() - tauL();
  const angle = () => clamp(net() / 500, -0.35, 0.35); // radians tilt

  const pivotX = () => (W - BAR_L) / 2 + dL_px();

  const leftEnd = () => {
    const cx = pivotX() - dL_px() * Math.cos(angle());
    const cy = PIVOT_Y + dL_px() * Math.sin(angle());
    return { x: cx, y: cy };
  };
  const rightEnd = () => {
    const cx = pivotX() + dR_px() * Math.cos(angle());
    const cy = PIVOT_Y - dR_px() * Math.sin(angle());
    return { x: cx, y: cy };
  };

  return (
    <div class="space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Left weight: <strong>{mL().toFixed(1)} kg</strong></span>
          <input type="range" min={0.5} max={10} step={0.1} value={mL()} onInput={(e) => setML(parseFloat(e.currentTarget.value))} class="w-full" />
        </label>
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Right weight: <strong>{mR().toFixed(1)} kg</strong></span>
          <input type="range" min={0.5} max={10} step={0.1} value={mR()} onInput={(e) => setMR(parseFloat(e.currentTarget.value))} class="w-full" />
        </label>
        <label class="text-xs">
          <span style={{ color: "var(--text-secondary)" }}>Fulcrum position: <strong>{(fulcrum() * 100).toFixed(0)}%</strong></span>
          <input type="range" min={0.1} max={0.9} step={0.01} value={fulcrum()} onInput={(e) => setFulcrum(parseFloat(e.currentTarget.value))} class="w-full" />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)" }}>
        {/* Ground */}
        <line x1={0} y1={H - 10} x2={W} y2={H - 10} stroke="var(--text-muted)" stroke-width="2" />
        {/* Fulcrum triangle */}
        <polygon points={`${pivotX()},${PIVOT_Y} ${pivotX() - 18},${H - 10} ${pivotX() + 18},${H - 10}`} fill="#64748b" stroke="var(--text-primary)" stroke-width="1" />
        {/* Bar */}
        <line
          x1={leftEnd().x}
          y1={leftEnd().y}
          x2={rightEnd().x}
          y2={rightEnd().y}
          stroke="#8b5cf6"
          stroke-width="6"
          stroke-linecap="round"
        />
        {/* Left weight */}
        <g transform={`translate(${leftEnd().x},${leftEnd().y})`}>
          {(() => {
            const s = 8 + mL() * 3.5;
            return (
              <>
                <rect x={-s} y={-2 * s} width={2 * s} height={2 * s} fill="#ef4444" stroke="var(--text-primary)" stroke-width="1" rx="2" />
                <text x={0} y={-s + 4} text-anchor="middle" font-size="10" font-weight="bold" fill="white">{mL().toFixed(1)}</text>
              </>
            );
          })()}
        </g>
        {/* Right weight */}
        <g transform={`translate(${rightEnd().x},${rightEnd().y})`}>
          {(() => {
            const s = 8 + mR() * 3.5;
            return (
              <>
                <rect x={-s} y={-2 * s} width={2 * s} height={2 * s} fill="#3b82f6" stroke="var(--text-primary)" stroke-width="1" rx="2" />
                <text x={0} y={-s + 4} text-anchor="middle" font-size="10" font-weight="bold" fill="white">{mR().toFixed(1)}</text>
              </>
            );
          })()}
        </g>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="τ_L = m·d" value={tauL().toFixed(0)} sub={`${mL().toFixed(1)} × ${dL_px().toFixed(0)}`} color="#ef4444" />
        <StatCard label="τ_R = m·d" value={tauR().toFixed(0)} sub={`${mR().toFixed(1)} × ${dR_px().toFixed(0)}`} color="#3b82f6" />
        <StatCard label="Net torque" value={net().toFixed(0)} color={Math.abs(net()) < 5 ? "#22c55e" : ACCENT} />
        <StatCard label="Status" value={Math.abs(net()) < 5 ? "balanced" : net() > 0 ? "right side down" : "left side down"} color={Math.abs(net()) < 5 ? "#22c55e" : ACCENT} />
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// F3NewtonsCradle — Five balls hanging from strings. Pull end ball up,
// release; end-ball momentum is transferred to the opposite end.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const F3NewtonsCradle: Component = () => {
  const W = 460, H = 260;
  const N = 5;
  const BALL_R = 16;
  const SPACING = 2 * BALL_R + 1;
  const STRING_LEN = 140;
  const PIVOT_Y = 20;
  const centerX = W / 2;
  const pivotX = (i: number) => centerX + (i - (N - 1) / 2) * SPACING;

  // Pendulum angles, angular velocities.
  const [angles, setAngles] = createSignal<number[]>(new Array(N).fill(0));
  const [omegas, setOmegas] = createSignal<number[]>(new Array(N).fill(0));
  const [dragging, setDragging] = createSignal<null | "left" | "right">(null);
  const [releaseHeight, setReleaseHeight] = createSignal(0.8);

  const G_sim = 15; // tuned for nice swings at this scale

  const lift = (side: "left" | "right") => {
    const a = releaseHeight();
    const arr = new Array(N).fill(0);
    if (side === "left") arr[0] = -a; else arr[N - 1] = a;
    setAngles(arr);
    setOmegas(new Array(N).fill(0));
  };

  let raf: number | undefined;
  let last = performance.now();
  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    // Pendulum ODE for each ball: α = -(g/L) sin θ
    const L = STRING_LEN / 40; // effective length in "meters"
    const om = [...omegas()];
    const an = [...angles()];
    for (let i = 0; i < N; i++) {
      om[i] += -(G_sim / L) * Math.sin(an[i]) * dt;
      om[i] *= 0.998; // tiny damping
      an[i] += om[i] * dt;
    }
    // Collisions: adjacent balls transfer momentum when both are near their rest
    // position and moving toward each other. Classic idealized Newton's-cradle
    // approximation: swap velocities on contact.
    for (let i = 0; i < N - 1; i++) {
      const angGap = an[i + 1] - an[i]; // gap in angle-units; both near 0 at contact
      if (angGap < 0.002) {
        // Balls are touching (or interpenetrating). If they're moving toward each
        // other, swap velocities.
        if (om[i] - om[i + 1] > 0) {
          const tmp = om[i];
          om[i] = om[i + 1];
          om[i + 1] = tmp;
          an[i] = Math.min(an[i], 0);
          an[i + 1] = Math.max(an[i + 1], 0);
        }
      }
    }
    setOmegas(om);
    setAngles(an);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  onCleanup(() => raf && cancelAnimationFrame(raf));

  const ballPos = (i: number) => {
    const theta = angles()[i];
    const bx = pivotX(i) + STRING_LEN * Math.sin(theta);
    const by = PIVOT_Y + STRING_LEN * Math.cos(theta);
    return { x: bx, y: by };
  };

  const totalKE = createMemo(() => {
    let s = 0;
    for (const w of omegas()) s += 0.5 * w * w;
    return s;
  });

  return (
    <div class="space-y-3">
      <div class="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => lift("left")}
          class="px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ background: ACCENT, color: "white" }}
        >
          ↖ Lift left
        </button>
        <button
          onClick={() => lift("right")}
          class="px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ background: ACCENT, color: "white" }}
        >
          ↗ Lift right
        </button>
        <button
          onClick={() => { setAngles(new Array(N).fill(0)); setOmegas(new Array(N).fill(0)); }}
          class="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
        >
          Stop
        </button>
        <label class="text-xs flex-1 min-w-[180px]">
          <span style={{ color: "var(--text-secondary)" }}>Release angle: <strong>{(releaseHeight() * 180 / Math.PI).toFixed(0)}°</strong></span>
          <input type="range" min={0.2} max={1.2} step={0.02} value={releaseHeight()} onInput={(e) => setReleaseHeight(parseFloat(e.currentTarget.value))} class="w-full" />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)" }}>
        {/* Rail */}
        <line x1={pivotX(0) - 20} y1={PIVOT_Y} x2={pivotX(N - 1) + 20} y2={PIVOT_Y} stroke="var(--text-primary)" stroke-width="3" />
        <For each={Array.from({ length: N })}>
          {(_, i) => {
            const pos = () => ballPos(i());
            return (
              <g>
                <line x1={pivotX(i())} y1={PIVOT_Y} x2={pos().x} y2={pos().y} stroke="var(--text-muted)" stroke-width="1" />
                <circle cx={pos().x} cy={pos().y} r={BALL_R} fill="#94a3b8" stroke="var(--text-primary)" stroke-width="1.5" />
                <circle cx={pos().x - 4} cy={pos().y - 5} r={4} fill="white" opacity="0.6" />
              </g>
            );
          }}
        </For>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <StatCard label="Total KE" value={totalKE().toFixed(3)} sub="Σ ½ω² — conserved" color={ACCENT} />
        <StatCard label="Ball 1 ω" value={omegas()[0]?.toFixed(2) ?? "0"} color="#3b82f6" />
        <StatCard label={`Ball ${N} ω`} value={omegas()[N - 1]?.toFixed(2) ?? "0"} color="#22c55e" />
      </div>
    </div>
  );
};
