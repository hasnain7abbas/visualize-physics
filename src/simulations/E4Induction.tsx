import { Component, createSignal, createMemo, onCleanup, For, Show } from "solid-js";

const ACCENT = "#14b8a6";

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

const Slider: Component<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onInput: (v: number) => void;
  unit?: string;
}> = (p) => (
  <label class="block">
    <div class="flex justify-between text-[11px] mb-1">
      <span style={{ color: "var(--text-secondary)" }}>{p.label}</span>
      <span style={{ color: "var(--text-primary)" }} class="font-mono">
        {p.value.toFixed(p.step && p.step < 1 ? 2 : 0)}{p.unit ? ` ${p.unit}` : ""}
      </span>
    </div>
    <input
      type="range"
      min={p.min}
      max={p.max}
      step={p.step ?? 1}
      value={p.value}
      onInput={(e) => p.onInput(parseFloat(e.currentTarget.value))}
      class="w-full h-1.5 rounded-full appearance-none cursor-pointer"
      style={{
        background: `linear-gradient(to right, ${ACCENT} ${((p.value - p.min) / (p.max - p.min)) * 100}%, var(--border) ${((p.value - p.min) / (p.max - p.min)) * 100}%)`,
      }}
    />
  </label>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// E4Faraday — rotating loop in uniform B field → sinusoidal EMF.
// EMF = -dΦ/dt with Φ = B·A·cos(ωt).
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const E4Faraday: Component = () => {
  const [B, setB] = createSignal(1.0);        // T
  const [omega, setOmega] = createSignal(2.0); // rad/s (animated)
  const [t, setT] = createSignal(0);
  const [running, setRunning] = createSignal(true);

  const A = 1.0; // loop area (m²)

  let raf: number | undefined;
  let last = performance.now();
  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (running()) setT((v) => v + dt);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  onCleanup(() => { if (raf) cancelAnimationFrame(raf); });

  const phi = () => B() * A * Math.cos(omega() * t());
  const emf = () => B() * A * omega() * Math.sin(omega() * t());

  // History for plot
  const [history, setHistory] = createSignal<{ t: number; phi: number; emf: number }[]>([]);
  const pushHistory = () => {
    setHistory((h) => {
      const next = [...h, { t: t(), phi: phi(), emf: emf() }];
      if (next.length > 300) next.shift();
      return next;
    });
  };
  const hi = setInterval(pushHistory, 40);
  onCleanup(() => clearInterval(hi));

  const W = 480, H = 280;
  const loopCx = 110, loopCy = 140;

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Slider label="B field" value={B()} min={0.1} max={2.0} step={0.05} unit="T" onInput={setB} />
        <Slider label="Angular velocity ω" value={omega()} min={0.5} max={8} step={0.1} unit="rad/s" onInput={setOmega} />
        <div class="flex gap-2">
          <button onClick={() => setRunning(!running())} class="flex-1 px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: ACCENT, color: "white" }}>
            {running() ? "Pause" : "Play"}
          </button>
          <button onClick={() => { setT(0); setHistory([]); }} class="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
            Reset
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "340px" }}>
        {/* Left: rotating loop */}
        <text x={loopCx} y={20} text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-secondary)">
          Loop in uniform B
        </text>
        {/* B field arrows */}
        <For each={[0, 1, 2, 3, 4]}>
          {(i) => (
            <>
              <line x1={30 + i * 40} y1={50} x2={30 + i * 40} y2={230} stroke={`${ACCENT}40`} stroke-width="1" />
              <polygon points={`${30 + i * 40},230 ${27 + i * 40},225 ${33 + i * 40},225`} fill={`${ACCENT}60`} />
            </>
          )}
        </For>
        <text x={loopCx} y={248} text-anchor="middle" font-size="9" fill={ACCENT} opacity="0.6">
          B → (into plane)
        </text>
        {/* Loop (foreshortened ellipse) */}
        {(() => {
          const angle = omega() * t();
          const rx = Math.abs(50 * Math.cos(angle));
          const ry = 50;
          return (
            <>
              <ellipse cx={loopCx} cy={loopCy} rx={Math.max(rx, 2)} ry={ry} fill="none" stroke="#f59e0b" stroke-width="2.5" />
              {/* Current direction indicator (based on EMF sign) */}
              <circle cx={loopCx + Math.max(rx, 2)} cy={loopCy} r="4" fill={emf() > 0 ? "#22c55e" : "#ef4444"} />
              <circle cx={loopCx - Math.max(rx, 2)} cy={loopCy} r="4" fill={emf() > 0 ? "#ef4444" : "#22c55e"} />
            </>
          );
        })()}
        <text x={loopCx} y={loopCy + 80} text-anchor="middle" font-size="9" fill="var(--text-muted)">
          θ = {((omega() * t()) % (2 * Math.PI)).toFixed(2)} rad
        </text>

        {/* Right: EMF and flux plot */}
        {(() => {
          const padL = 240, padR = 10, padT = 20, padB = 30;
          const plotW = W - padL - padR, plotH = H - padT - padB;
          const Y_MAX = Math.max(2, B() * A * omega() * 1.2);
          const T_WINDOW = 4;
          const tNow = t();
          const tToX = (tv: number) => padL + ((tv - (tNow - T_WINDOW)) / T_WINDOW) * plotW;
          const yToSvg = (v: number) => padT + plotH / 2 - (v / Y_MAX) * (plotH / 2);
          return (
            <>
              <text x={padL + plotW / 2} y={18} text-anchor="middle" font-size="11" font-weight="600" fill="var(--text-secondary)">Flux Φ &amp; EMF vs time</text>
              <line x1={padL} y1={yToSvg(0)} x2={W - padR} y2={yToSvg(0)} stroke="var(--border)" />
              <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
              <polyline fill="none" stroke="#f59e0b" stroke-width="1.8"
                points={history().filter(h => h.t >= tNow - T_WINDOW).map(h => `${tToX(h.t)},${yToSvg(h.phi)}`).join(" ")} />
              <polyline fill="none" stroke={ACCENT} stroke-width="1.8"
                points={history().filter(h => h.t >= tNow - T_WINDOW).map(h => `${tToX(h.t)},${yToSvg(h.emf)}`).join(" ")} />
              <g font-size="9" transform={`translate(${padL + 8}, ${padT + 6})`}>
                <line x1="0" y1="0" x2="12" y2="0" stroke="#f59e0b" stroke-width="2" />
                <text x="16" y="3" fill="var(--text-secondary)">Φ (Wb)</text>
                <line x1="60" y1="0" x2="72" y2="0" stroke={ACCENT} stroke-width="2" />
                <text x="76" y="3" fill="var(--text-secondary)">EMF (V)</text>
              </g>
            </>
          );
        })()}
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="B" value={`${B().toFixed(2)} T`} color={ACCENT} />
        <StatCard label="Φ(t)" value={`${phi().toFixed(2)} Wb`} sub="B·A·cos(ωt)" color="#f59e0b" />
        <StatCard label="EMF peak" value={`${(B() * A * omega()).toFixed(2)} V`} sub="BAω" color={ACCENT} />
        <StatCard label="EMF(t)" value={`${emf().toFixed(2)} V`} sub="−dΦ/dt" color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        Faraday's law $\varepsilon = -d\Phi/dt$ turns a rotating loop in a uniform field into an AC generator: flux $\Phi(t) = BA\cos\omega t$ gives EMF $\varepsilon = BA\omega \sin\omega t$. Peak EMF scales linearly with $B$, $A$, and $\omega$. The green/red dots on the loop edges show the instantaneous sign of the induced current — flipping each half-cycle.
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// E4LorentzForce — charged particle in crossed E and B fields. Integrate
// F = q(E + v×B) with symplectic (leapfrog-like) Boris method.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const E4LorentzForce: Component = () => {
  const [Bz, setBz] = createSignal(1.0);  // Tesla (field into page = +z)
  const [Ex, setEx] = createSignal(0.0);  // V/m
  const [v0, setV0] = createSignal(2.0);  // initial speed
  const [v0Angle, setV0Angle] = createSignal(0); // degrees
  const [qOverM, setQOverM] = createSignal(1.0);
  const [running, setRunning] = createSignal(true);
  const [pos, setPos] = createSignal({ x: 0, y: 0 });
  const [vel, setVel] = createSignal({ x: 2, y: 0 });
  const [trail, setTrail] = createSignal<{ x: number; y: number }[]>([]);

  const reset = () => {
    setPos({ x: 0, y: 0 });
    const ang = (v0Angle() * Math.PI) / 180;
    setVel({ x: v0() * Math.cos(ang), y: v0() * Math.sin(ang) });
    setTrail([]);
  };
  reset();

  let raf: number | undefined;
  let last = performance.now();
  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.03);
    last = now;
    if (running()) {
      // Boris push (2D, B = Bz ẑ):
      const v = vel();
      const p = pos();
      const qm = qOverM();
      // v̂ = v + q/m E dt/2
      let vx = v.x + qm * Ex() * dt / 2;
      let vy = v.y;
      // rotation by ω_c * dt where ω_c = qB/m
      const wc = qm * Bz();
      const theta = wc * dt;
      const c = Math.cos(theta), s = Math.sin(theta);
      const nx = c * vx + s * vy;
      const ny = -s * vx + c * vy;
      // half kick from E again
      vx = nx + qm * Ex() * dt / 2;
      vy = ny;
      setVel({ x: vx, y: vy });
      setPos({ x: p.x + vx * dt, y: p.y + vy * dt });
      setTrail((tr) => {
        const next = [...tr, { x: pos().x, y: pos().y }];
        if (next.length > 600) next.shift();
        return next;
      });
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  onCleanup(() => { if (raf) cancelAnimationFrame(raf); });

  const W = 440, H = 280;
  const scale = 30; // 1 unit = 30 px
  const toSX = (x: number) => W / 2 + x * scale;
  const toSY = (y: number) => H / 2 - y * scale;

  // Larmor radius & frequency
  const speed = () => Math.sqrt(vel().x ** 2 + vel().y ** 2);
  const rL = () => speed() / Math.max(Math.abs(qOverM() * Bz()), 1e-6);
  const omegaC = () => qOverM() * Bz();
  const vDrift = () => (Math.abs(Bz()) > 0.01 ? Ex() / Bz() : 0); // E × B drift in y

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Slider label="B_z" value={Bz()} min={-2} max={2} step={0.1} unit="T" onInput={(v) => { setBz(v); reset(); }} />
        <Slider label="E_x" value={Ex()} min={-2} max={2} step={0.1} unit="V/m" onInput={(v) => { setEx(v); reset(); }} />
        <Slider label="|v₀|" value={v0()} min={0.1} max={4} step={0.1} onInput={(v) => { setV0(v); reset(); }} />
        <Slider label="v₀ angle" value={v0Angle()} min={0} max={360} step={5} unit="°" onInput={(v) => { setV0Angle(v); reset(); }} />
        <Slider label="q/m" value={qOverM()} min={-2} max={2} step={0.1} onInput={(v) => { setQOverM(v); reset(); }} />
      </div>

      <div class="flex gap-2">
        <button onClick={() => setRunning(!running())} class="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: ACCENT, color: "white" }}>
          {running() ? "Pause" : "Play"}
        </button>
        <button onClick={reset} class="px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
          Reset
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "340px" }}>
        {/* E field arrows (horizontal) */}
        <Show when={Math.abs(Ex()) > 0.05}>
          <For each={[40, 100, 160, 220, 280, 340, 400]}>
            {(x) => (
              <>
                <line x1={x} y1={H - 14} x2={x + Math.sign(Ex()) * 15} y2={H - 14} stroke="#f97316" stroke-width="1" opacity="0.6" />
                <polygon points={`${x + Math.sign(Ex()) * 15},${H - 14} ${x + Math.sign(Ex()) * 11},${H - 12} ${x + Math.sign(Ex()) * 11},${H - 16}`} fill="#f97316" opacity="0.6" />
              </>
            )}
          </For>
          <text x={W - 30} y={H - 20} text-anchor="end" font-size="9" fill="#f97316">E_x</text>
        </Show>
        {/* B symbol (dots or crosses) */}
        <For each={Array.from({ length: 6 }, (_, i) => i)}>
          {(i) => (
            <For each={Array.from({ length: 4 }, (_, j) => j)}>
              {(j) => {
                const x = 40 + i * 70, y = 40 + j * 60;
                if (Bz() > 0) {
                  // dot (out of page) — but we defined B = +z INTO page? convention: let's say B_z positive = out of page
                  return <circle cx={x} cy={y} r="2" fill={ACCENT} opacity="0.4" />;
                } else if (Bz() < 0) {
                  return <>
                    <line x1={x - 3} y1={y - 3} x2={x + 3} y2={y + 3} stroke={ACCENT} stroke-width="1" opacity="0.4" />
                    <line x1={x - 3} y1={y + 3} x2={x + 3} y2={y - 3} stroke={ACCENT} stroke-width="1" opacity="0.4" />
                  </>;
                }
                return null;
              }}
            </For>
          )}
        </For>
        <text x={W - 6} y={14} text-anchor="end" font-size="9" fill={ACCENT}>
          B_z {Bz() > 0 ? "(out)" : Bz() < 0 ? "(in)" : ""}
        </text>
        {/* Trail */}
        <polyline fill="none" stroke="#f59e0b" stroke-width="1.5"
          points={trail().map(p => `${toSX(p.x)},${toSY(p.y)}`).join(" ")} />
        {/* Particle */}
        <circle cx={toSX(pos().x)} cy={toSY(pos().y)} r="5" fill="#f59e0b" stroke="white" stroke-width="1.5" />
        {/* velocity vector */}
        <line x1={toSX(pos().x)} y1={toSY(pos().y)} x2={toSX(pos().x) + vel().x * 15} y2={toSY(pos().y) - vel().y * 15} stroke="#ec4899" stroke-width="2" />
        {/* Center crosshair */}
        <line x1={W / 2 - 4} y1={H / 2} x2={W / 2 + 4} y2={H / 2} stroke="var(--text-muted)" opacity="0.3" />
        <line x1={W / 2} y1={H / 2 - 4} x2={W / 2} y2={H / 2 + 4} stroke="var(--text-muted)" opacity="0.3" />
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="|v|" value={speed().toFixed(2)} color={ACCENT} />
        <StatCard label="Larmor radius r_L" value={rL().toFixed(2)} sub="mv/qB" color={ACCENT} />
        <StatCard label="Cyclotron ω_c" value={omegaC().toFixed(2)} sub="qB/m" color={ACCENT} />
        <StatCard label="E×B drift" value={`${vDrift().toFixed(2)} ŷ`} sub="E/B" color="#ec4899" />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        {"With only $B$ on: circular motion at the cyclotron frequency $\\omega_c = qB/m$ and radius $r_L = mv/qB$. Turn on $E_x$ as well: the orbit drifts sideways at $\\vec v_d = \\vec E \\times \\vec B/B^2$, independent of charge sign — the basis of velocity selectors and mass spectrometers."}
      </div>
    </div>
  );
};
