import { Component, createSignal, createMemo, For, Show } from "solid-js";

const ACCENT = "#f97316";

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

const Slider: Component<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onInput: (v: number) => void;
  unit?: string;
  color?: string;
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
        background: `linear-gradient(to right, ${p.color ?? ACCENT} ${((p.value - p.min) / (p.max - p.min)) * 100}%, var(--border) ${((p.value - p.min) / (p.max - p.min)) * 100}%)`,
      }}
    />
  </label>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// O1LensSystem — thin-lens equation, principal rays, real/virtual images.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const O1LensSystem: Component = () => {
  const W = 480, H = 260;
  const cx = W / 2;
  const axisY = H / 2;

  const [f, setF] = createSignal(80);        // focal length (px). Positive = convex.
  const [objDist, setObjDist] = createSignal(140); // object distance from lens (px)
  const [objHeight, setObjHeight] = createSignal(40); // object height (px)

  const image = createMemo(() => {
    const doVal = objDist();
    const fVal = f();
    // thin-lens: 1/do + 1/di = 1/f  =>  di = f*do/(do - f)
    const denom = doVal - fVal;
    const di = Math.abs(denom) < 0.01 ? Infinity : (fVal * doVal) / denom;
    const m = -di / doVal; // magnification (negative means inverted)
    const hi = m * objHeight();
    return { di, m, hi, real: di > 0 };
  });

  // lens position: at cx. Object to the left at cx - objDist. Image at cx + di.
  const objX = () => cx - objDist();
  const objTopY = () => axisY - objHeight();
  const imgX = () => {
    const di = image().di;
    return Number.isFinite(di) ? cx + di : cx + 1000;
  };
  const imgTopY = () => axisY - image().hi;

  // principal rays (real object, paraxial approx). Extend rays so they reach
  // the image point — even if it's on the object side (virtual image), rays
  // appear to diverge from there.
  const rays = () => {
    const F = f();
    const oX = objX(), oY = objTopY();
    const iX = imgX(), iY = imgTopY();
    // Ray 1: parallel to axis, then through far focal point (cx+F)
    // Ray 2: through lens center (straight)
    // Ray 3: through near focal point (cx-F), then parallel
    const EXT = 3; // extend beyond image for visibility
    const extend = (x0: number, y0: number, x1: number, y1: number, tExt = EXT) => {
      return { x0, y0, x1: x0 + (x1 - x0) * tExt, y1: y0 + (y1 - y0) * tExt };
    };
    const r1 = [
      { x0: oX, y0: oY, x1: cx, y1: oY },
      extend(cx, oY, cx + F, axisY, image().real ? 1 : 0),
    ];
    // Virtual extension for virtual images: dashed back to image
    const r1v = !image().real ? { x0: cx, y0: oY, x1: iX, y1: iY } : null;
    const r2 = [{ x0: oX, y0: oY, x1: cx + (cx - oX) * EXT, y1: oY + (axisY - oY) * EXT }];
    const r2Real = [{ x0: oX, y0: oY, x1: iX, y1: iY }];
    const r3 = [
      { x0: oX, y0: oY, x1: cx, y1: axisY + ((oY - axisY) * (cx - oX) / ((cx - F) - oX)) },
    ];
    // Just compute ray 3 direction and extend:
    const slope3 = (axisY - oY) / ((cx - F) - oX);
    const yAtLens3 = oY + slope3 * (cx - oX);
    const r3Lens = { x0: oX, y0: oY, x1: cx, y1: yAtLens3 };
    const r3After = { x0: cx, y0: yAtLens3, x1: cx + 1000, y1: yAtLens3 };
    return { r1, r1v, r2, r2Real, r3Lens, r3After };
  };

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Slider label="Focal length f" value={f()} min={30} max={150} step={1} unit="mm" onInput={setF} />
        <Slider label="Object distance" value={objDist()} min={30} max={220} step={1} unit="mm" onInput={setObjDist} />
        <Slider label="Object height" value={objHeight()} min={15} max={80} step={1} unit="mm" onInput={setObjHeight} />
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "320px" }}>
        {/* Optical axis */}
        <line x1="10" y1={axisY} x2={W - 10} y2={axisY} stroke="var(--border)" stroke-dasharray="3 3" />
        {/* Focal points */}
        <circle cx={cx - f()} cy={axisY} r="3" fill={ACCENT} />
        <circle cx={cx + f()} cy={axisY} r="3" fill={ACCENT} />
        <text x={cx - f()} y={axisY + 14} text-anchor="middle" font-size="9" fill="var(--text-muted)">F</text>
        <text x={cx + f()} y={axisY + 14} text-anchor="middle" font-size="9" fill="var(--text-muted)">F'</text>
        {/* Lens */}
        <ellipse cx={cx} cy={axisY} rx="6" ry={H / 2 - 10} fill={`${ACCENT}20`} stroke={ACCENT} stroke-width="2" />
        {/* Object (upright arrow) */}
        <line x1={objX()} y1={axisY} x2={objX()} y2={objTopY()} stroke="#06b6d4" stroke-width="2.5" />
        <polygon points={`${objX()},${objTopY() - 6} ${objX() - 4},${objTopY() + 2} ${objX() + 4},${objTopY() + 2}`} fill="#06b6d4" />
        {/* Rays */}
        <For each={rays().r1}>
          {(r) => <line x1={r.x0} y1={r.y0} x2={r.x1} y2={r.y1} stroke="#8b5cf6" stroke-width="1.2" opacity="0.9" />}
        </For>
        <Show when={rays().r1v}>
          {(seg) => (
            <line x1={seg().x0} y1={seg().y0} x2={seg().x1} y2={seg().y1} stroke="#8b5cf6" stroke-width="1" stroke-dasharray="3 3" opacity="0.6" />
          )}
        </Show>
        {/* Ray 2 */}
        <Show
          when={image().real}
          fallback={
            <line x1={objX()} y1={objTopY()} x2={cx + 500} y2={objTopY() + ((axisY - objTopY()) / (cx - objX())) * 500} stroke="#ec4899" stroke-width="1.2" />
          }
        >
          <line x1={objX()} y1={objTopY()} x2={imgX()} y2={imgTopY()} stroke="#ec4899" stroke-width="1.2" />
          <line x1={imgX()} y1={imgTopY()} x2={W - 10} y2={imgTopY() + ((imgTopY() - objTopY()) / (imgX() - objX())) * (W - 10 - imgX())} stroke="#ec4899" stroke-width="1" opacity="0.5" />
        </Show>
        {/* Ray 3 */}
        <line x1={rays().r3Lens.x0} y1={rays().r3Lens.y0} x2={rays().r3Lens.x1} y2={rays().r3Lens.y1} stroke="#10b981" stroke-width="1.2" />
        <line x1={rays().r3After.x0} y1={rays().r3After.y0} x2={rays().r3After.x1} y2={rays().r3After.y1} stroke="#10b981" stroke-width="1.2" />
        {/* Image (arrow) — dashed if virtual */}
        <Show when={Number.isFinite(image().di) && Math.abs(image().di) < 500}>
          <line
            x1={imgX()} y1={axisY} x2={imgX()} y2={imgTopY()}
            stroke={image().real ? "#22c55e" : "#a855f7"}
            stroke-width="2.5"
            stroke-dasharray={image().real ? "" : "4 3"}
          />
          <polygon
            points={`${imgX()},${imgTopY() + (image().hi > 0 ? -6 : 6)} ${imgX() - 4},${imgTopY() + (image().hi > 0 ? 2 : -2)} ${imgX() + 4},${imgTopY() + (image().hi > 0 ? 2 : -2)}`}
            fill={image().real ? "#22c55e" : "#a855f7"}
            opacity={image().real ? 1 : 0.7}
          />
        </Show>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="Image dist di" value={Number.isFinite(image().di) ? `${image().di.toFixed(1)} mm` : "\u221E"} color={ACCENT} />
        <StatCard label="Magnification m" value={image().m.toFixed(2)} color={ACCENT} />
        <StatCard label="Image height" value={`${image().hi.toFixed(1)} mm`} color={ACCENT} />
        <StatCard label="Type" value={image().real ? "Real, inverted" : "Virtual, upright"} color={ACCENT} />
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// O1Polarization — Malus's law, sequential polarizers, and a wave plate.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const O1Polarization: Component = () => {
  const [ang1, setAng1] = createSignal(0);    // first polarizer angle (deg)
  const [ang2, setAng2] = createSignal(45);   // second polarizer angle
  const [useMiddle, setUseMiddle] = createSignal(false);
  const [angM, setAngM] = createSignal(45);   // middle polarizer

  // Initial unpolarized light: I0. After first polarizer: I1 = I0/2.
  // After second (Malus): I2 = I1 * cos^2(ang2 - ang1).
  // With middle polarizer: I1 * cos^2(angM - ang1) * cos^2(ang2 - angM).
  const intensities = createMemo(() => {
    const I0 = 1;
    const I1 = I0 / 2;
    const dRad = (a: number, b: number) => ((b - a) * Math.PI) / 180;
    if (useMiddle()) {
      const Im = I1 * Math.cos(dRad(ang1(), angM())) ** 2;
      const I2 = Im * Math.cos(dRad(angM(), ang2())) ** 2;
      return { I0, I1, Im, I2 };
    }
    const I2 = I1 * Math.cos(dRad(ang1(), ang2())) ** 2;
    return { I0, I1, Im: null as number | null, I2 };
  });

  const W = 480, H = 160;
  const beamY = H / 2;

  const Polarizer: Component<{ x: number; angle: number; label: string }> = (p) => (
    <>
      <circle cx={p.x} cy={beamY} r="32" fill="none" stroke="var(--border)" stroke-width="1.5" />
      <line
        x1={p.x + 28 * Math.cos((p.angle * Math.PI) / 180)}
        y1={beamY - 28 * Math.sin((p.angle * Math.PI) / 180)}
        x2={p.x - 28 * Math.cos((p.angle * Math.PI) / 180)}
        y2={beamY + 28 * Math.sin((p.angle * Math.PI) / 180)}
        stroke={ACCENT}
        stroke-width="3"
      />
      <text x={p.x} y={beamY + 54} text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-secondary)">
        {p.label}: {p.angle.toFixed(0)}°
      </text>
    </>
  );

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Slider label="Polarizer 1 angle" value={ang1()} min={-90} max={90} step={1} unit="°" onInput={setAng1} />
        <Slider label="Polarizer 2 angle" value={ang2()} min={-90} max={90} step={1} unit="°" onInput={setAng2} />
        <Show when={useMiddle()}>
          <Slider label="Middle polarizer" value={angM()} min={-90} max={90} step={1} unit="°" onInput={setAngM} />
        </Show>
        <label class="flex items-center gap-2 text-xs cursor-pointer" style={{ color: "var(--text-secondary)" }}>
          <input type="checkbox" checked={useMiddle()} onChange={(e) => setUseMiddle(e.currentTarget.checked)} />
          Insert middle polarizer (the "three polarizer paradox")
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} class="w-full rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "200px" }}>
        {/* Beam */}
        <line x1="10" y1={beamY} x2={W - 10} y2={beamY} stroke={`${ACCENT}30`} stroke-width={Math.max(3, 12 * intensities().I0)} />
        <Show when={useMiddle()}>
          <Polarizer x={110} angle={ang1()} label="P1" />
          <Polarizer x={240} angle={angM()} label="Pm" />
          <Polarizer x={370} angle={ang2()} label="P2" />
        </Show>
        <Show when={!useMiddle()}>
          <Polarizer x={150} angle={ang1()} label="P1" />
          <Polarizer x={330} angle={ang2()} label="P2" />
        </Show>
        {/* Emerging beam intensity bar */}
        <rect x={W - 40} y={beamY - 30} width="8" height="60" fill="var(--border)" />
        <rect x={W - 40} y={beamY + 30 - 60 * intensities().I2} width="8" height={60 * intensities().I2} fill={ACCENT} />
        <text x={W - 36} y={beamY + 48} text-anchor="middle" font-size="9" fill="var(--text-muted)">
          I/I₀ = {intensities().I2.toFixed(3)}
        </text>
      </svg>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="I₀ (unpol)" value={intensities().I0.toFixed(2)} sub="incident" color={ACCENT} />
        <StatCard label="After P1" value={intensities().I1.toFixed(3)} sub="= I₀/2" color={ACCENT} />
        <Show when={useMiddle()} fallback={<div />}>
          <StatCard label="After Pm" value={(intensities().Im ?? 0).toFixed(3)} sub="Malus" color={ACCENT} />
        </Show>
        <StatCard label="Final I" value={intensities().I2.toFixed(3)} sub={useMiddle() ? "3× Malus" : "Malus"} color={ACCENT} />
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        Malus's law: I = I₁ cos²(Δθ). With two crossed polarizers (Δθ=90°) the output is zero.
        Insert a middle polarizer at 45° and the output becomes I₀/8 — classical intuition says inserting more absorbers should only lower intensity, but projection onto the middle axis restores a component that can pass P2.
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// O1ThinFilm — interference in a thin film (soap bubble) as a function of
// thickness d and wavelength λ. Normal incidence; both reflections pick up
// π phase from air→film (higher n), so path-length criterion: constructive
// at 2nd = (m + 1/2)λ after the phase shift, equivalent to 2nd = mλ in
// wavelength-in-film terms. We use reflectance R ∝ sin²(2πnd/λ).
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const O1ThinFilm: Component = () => {
  const [d, setD] = createSignal(300);  // film thickness (nm)
  const [n, setN] = createSignal(1.33); // film refractive index

  // Sample reflectance across visible spectrum (nm).
  const samples = createMemo(() => {
    const arr: { lam: number; R: number; rgb: string }[] = [];
    for (let lam = 380; lam <= 750; lam += 5) {
      const phase = (2 * Math.PI * n() * d()) / lam;
      // Fresnel reflectance for thin film (simplified, ignoring absorption):
      const R = Math.sin(phase) ** 2;
      arr.push({ lam, R, rgb: wavelengthToRGB(lam) });
    }
    return arr;
  });

  // Perceived reflected color: weighted sum over spectrum.
  const perceived = createMemo(() => {
    let r = 0, g = 0, b = 0, w = 0;
    for (const s of samples()) {
      const c = parseRgb(s.rgb);
      r += c.r * s.R;
      g += c.g * s.R;
      b += c.b * s.R;
      w += s.R;
    }
    if (w < 0.01) return "rgb(20,20,20)";
    return `rgb(${Math.round(r / w)},${Math.round(g / w)},${Math.round(b / w)})`;
  });

  const W = 440, H = 200;
  const padL = 30, padR = 10, padT = 10, padB = 28;
  const plotW = W - padL - padR, plotH = H - padT - padB;

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Slider label="Film thickness d" value={d()} min={50} max={800} step={5} unit="nm" onInput={setD} />
        <Slider label="Refractive index n" value={n()} min={1.0} max={2.5} step={0.01} onInput={setN} />
      </div>

      <div class="flex items-center gap-4 flex-wrap">
        <div class="flex-shrink-0 text-center">
          <div
            class="w-20 h-20 rounded-full border-4"
            style={{ background: perceived(), "border-color": "var(--border)" }}
          />
          <div class="text-[10px] mt-1 font-semibold" style={{ color: "var(--text-muted)" }}>
            Reflected color
          </div>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} class="flex-1 min-w-0 rounded-lg" style={{ background: "var(--bg-secondary)", "max-height": "220px" }}>
          {/* axis */}
          <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="var(--border)" />
          <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="var(--border)" />
          <text x={padL - 4} y={padT + 6} text-anchor="end" font-size="9" fill="var(--text-muted)">R</text>
          <text x={padL - 4} y={H - padB} text-anchor="end" font-size="9" fill="var(--text-muted)">0</text>
          <text x={padL - 4} y={padT + (plotH / 2) + 3} text-anchor="end" font-size="9" fill="var(--text-muted)">0.5</text>
          <text x={W / 2} y={H - 8} text-anchor="middle" font-size="10" fill="var(--text-muted)">wavelength λ (nm)</text>
          {/* ticks at 400/500/600/700 */}
          <For each={[400, 500, 600, 700]}>
            {(lam) => {
              const x = padL + ((lam - 380) / (750 - 380)) * plotW;
              return (
                <>
                  <line x1={x} y1={H - padB} x2={x} y2={H - padB + 3} stroke="var(--border)" />
                  <text x={x} y={H - padB + 12} text-anchor="middle" font-size="8" fill="var(--text-muted)">{lam}</text>
                </>
              );
            }}
          </For>
          {/* spectrum strip */}
          <For each={samples()}>
            {(s, i) => {
              const x = padL + (i() / (samples().length - 1)) * plotW;
              const w = plotW / samples().length + 0.5;
              return <rect x={x} y={H - padB + 14} width={w} height="6" fill={s.rgb} />;
            }}
          </For>
          {/* R(λ) curve */}
          <polyline
            fill="none"
            stroke={ACCENT}
            stroke-width="2"
            points={samples().map((s, i) => {
              const x = padL + (i / (samples().length - 1)) * plotW;
              const y = H - padB - s.R * plotH;
              return `${x},${y}`;
            }).join(" ")}
          />
        </svg>
      </div>

      <div class="text-[11px] rounded-lg p-3" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", "border-left": `3px solid ${ACCENT}` }}>
        Bright fringes occur where 2nd = (m + ½)λ (destructive at reflection cancels, constructive at other λ). As d grows, the reflectance peaks scan through the visible spectrum — the reason a spreading soap film runs through a repeating rainbow just before it pops (at d ≈ 0 reflection vanishes because of the extra π phase shift on one surface).
      </div>
    </div>
  );
};

function wavelengthToRGB(lam: number): string {
  let r = 0, g = 0, b = 0;
  if (lam >= 380 && lam < 440) { r = -(lam - 440) / (440 - 380); g = 0; b = 1; }
  else if (lam < 490) { r = 0; g = (lam - 440) / (490 - 440); b = 1; }
  else if (lam < 510) { r = 0; g = 1; b = -(lam - 510) / (510 - 490); }
  else if (lam < 580) { r = (lam - 510) / (580 - 510); g = 1; b = 0; }
  else if (lam < 645) { r = 1; g = -(lam - 645) / (645 - 580); b = 0; }
  else if (lam <= 750) { r = 1; g = 0; b = 0; }
  // intensity falloff at edges
  let factor = 1;
  if (lam < 420) factor = 0.3 + 0.7 * (lam - 380) / (420 - 380);
  else if (lam > 700) factor = 0.3 + 0.7 * (750 - lam) / (750 - 700);
  const enc = (c: number) => clamp(Math.round(255 * Math.pow(c * factor, 0.8)), 0, 255);
  return `rgb(${enc(r)},${enc(g)},${enc(b)})`;
}

function parseRgb(s: string): { r: number; g: number; b: number } {
  const m = s.match(/rgb\((\d+),(\d+),(\d+)\)/);
  return m ? { r: +m[1], g: +m[2], b: +m[3] } : { r: 0, g: 0, b: 0 };
}
