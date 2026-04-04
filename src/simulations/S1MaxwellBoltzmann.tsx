import { Component, createSignal, createMemo } from "solid-js";

export const S1MaxwellBoltzmann: Component = () => {
  const [temp, setTemp] = createSignal(300);
  const [mass, setMass] = createSignal(28); // N2 ~28 u
  const [samples, setSamples] = createSignal<number[]>([]);

  const kB = 1.381e-23;
  const amu = 1.661e-27;

  const mbDist = createMemo(() => {
    const T = temp();
    const m = mass() * amu;
    const pts: { v: number; f: number }[] = [];
    const vMax = Math.sqrt(8 * kB * T / (Math.PI * m)) * 3;

    for (let i = 0; i <= 150; i++) {
      const v = (i / 150) * vMax;
      const f = 4 * Math.PI * Math.pow(m / (2 * Math.PI * kB * T), 1.5) * v * v * Math.exp(-m * v * v / (2 * kB * T));
      pts.push({ v, f });
    }
    return pts;
  });

  const speeds = createMemo(() => {
    const T = temp(), m = mass() * amu;
    const vmp = Math.sqrt(2 * kB * T / m);
    const vmean = Math.sqrt(8 * kB * T / (Math.PI * m));
    const vrms = Math.sqrt(3 * kB * T / m);
    return { vmp, vmean, vrms };
  });

  const maxF = createMemo(() => Math.max(...mbDist().map((p) => p.f), 1e-10));
  const vMax = createMemo(() => mbDist()[mbDist().length - 1]?.v ?? 1);

  const sampleParticles = (n: number) => {
    const m = mass() * amu, T = temp();
    const sigma = Math.sqrt(kB * T / m);
    const newSamples: number[] = [];
    for (let i = 0; i < n; i++) {
      // Box-Muller for 3 Gaussian velocity components
      const u1 = Math.random(), u2 = Math.random(), u3 = Math.random(), u4 = Math.random();
      const vx = sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const vy = sigma * Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
      const vz = sigma * Math.sqrt(-2 * Math.log(u3)) * Math.cos(2 * Math.PI * u4);
      newSamples.push(Math.sqrt(vx ** 2 + vy ** 2 + vz ** 2));
    }
    setSamples((prev) => [...prev, ...newSamples]);
  };

  // Histogram from samples
  const histogram = createMemo(() => {
    const s = samples();
    if (s.length === 0) return [];
    const vm = vMax();
    const nBins = 30;
    const bins = Array(nBins).fill(0);
    for (const v of s) {
      const idx = Math.min(Math.floor((v / vm) * nBins), nBins - 1);
      bins[idx]++;
    }
    const binWidth = vm / nBins;
    return bins.map((count, i) => ({
      v: (i + 0.5) * binWidth,
      density: count / (s.length * binWidth),
    }));
  });

  const maxHist = createMemo(() => Math.max(...histogram().map((b) => b.density), 0));

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>T = {temp()} K</label>
          <input type="range" min="50" max="2000" step="10" value={temp()} onInput={(e) => { setTemp(parseInt(e.currentTarget.value)); setSamples([]); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #f59e0b ${((temp() - 50) / 1950) * 100}%, var(--border) ${((temp() - 50) / 1950) * 100}%)` }}
          />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "55px" }}>m = {mass()} u</label>
          <input type="range" min="2" max="200" step="1" value={mass()} onInput={(e) => { setMass(parseInt(e.currentTarget.value)); setSamples([]); }}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #6366f1 ${((mass() - 2) / 198) * 100}%, var(--border) ${((mass() - 2) / 198) * 100}%)` }}
          />
        </div>
      </div>

      <svg width="100%" height="220" viewBox="0 0 420 220" class="mx-auto">
        {/* Axes */}
        <line x1="50" y1="190" x2="400" y2="190" stroke="var(--border)" stroke-width="1" />
        <line x1="50" y1="190" x2="50" y2="20" stroke="var(--border)" stroke-width="1" />
        <text x="220" y="210" text-anchor="middle" font-size="10" fill="var(--text-muted)">Speed v (m/s)</text>
        <text x="15" y="105" text-anchor="middle" font-size="10" fill="var(--text-muted)" transform="rotate(-90 15 105)">f(v)</text>

        {/* Histogram bars */}
        {histogram().map((b) => {
          const barMax = Math.max(maxF(), maxHist());
          const px = 50 + (b.v / vMax()) * 350;
          const bw = (vMax() / 30 / vMax()) * 350;
          const h = (b.density / barMax) * 160;
          return <rect x={px - bw / 2} y={190 - h} width={bw} height={h} fill="#f59e0b" opacity="0.25" rx="1" />;
        })}

        {/* Theory curve */}
        <path
          d={mbDist().map((p, i) => {
            const px = 50 + (p.v / vMax()) * 350;
            const py = 190 - (p.f / maxF()) * 160;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")}
          fill="none" stroke="#f59e0b" stroke-width="2.5"
        />

        {/* Characteristic speeds */}
        {[
          { v: speeds().vmp, label: "v_mp", color: "#10b981" },
          { v: speeds().vmean, label: "v_mean", color: "#06b6d4" },
          { v: speeds().vrms, label: "v_rms", color: "#ec4899" },
        ].map(({ v, label, color }, idx) => {
          const px = 50 + (v / vMax()) * 350;
          return (
            <>
              <line x1={px} y1="190" x2={px} y2="25" stroke={color} stroke-width="1" stroke-dasharray="3 3" />
              <text x={px} y={38 + idx * 13} text-anchor="middle" font-size="8" fill={color} font-weight="600">{label} = {v.toFixed(0)}</text>
            </>
          );
        })}
      </svg>

      <div class="flex justify-center gap-2">
        <button onClick={() => sampleParticles(100)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#f59e0b", color: "white" }}>Sample ×100</button>
        <button onClick={() => sampleParticles(1000)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#d97706", color: "white" }}>Sample ×1000</button>
        <button onClick={() => sampleParticles(5000)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#92400e", color: "white" }}>Sample ×5000</button>
        <button onClick={() => setSamples([])} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>
      <div class="text-center text-[11px]" style={{ color: "var(--text-muted)" }}>
        {samples().length} particles sampled | Histogram converges to theory curve
      </div>
    </div>
  );
};
