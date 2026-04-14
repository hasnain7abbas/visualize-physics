import { Component, createSignal, createMemo, For } from "solid-js";

export const S3Microstates: Component = () => {
  const [nCoins, setNCoins] = createSignal(10);
  const [trials, setTrials] = createSignal(0);
  const [histogram, setHistogram] = createSignal<number[]>([]);

  const theory = createMemo(() => {
    const N = nCoins();
    const dist: { k: number; omega: number; prob: number }[] = [];
    const total = Math.pow(2, N);
    for (let k = 0; k <= N; k++) {
      const omega = comb(N, k);
      dist.push({ k, omega, prob: omega / total });
    }
    return dist;
  });

  const maxProb = createMemo(() => Math.max(...theory().map((d) => d.prob)));

  const simulate = (n: number) => {
    const N = nCoins();
    const hist = [...(histogram().length === N + 1 ? histogram() : Array(N + 1).fill(0))];
    for (let t = 0; t < n; t++) {
      let heads = 0;
      for (let i = 0; i < N; i++) if (Math.random() < 0.5) heads++;
      hist[heads]++;
    }
    setHistogram([...hist]);
    setTrials((prev) => prev + n);
  };

  const reset = () => { setTrials(0); setHistogram([]); };

  const entropy = createMemo(() => {
    const dist = theory();
    return -dist.reduce((s, d) => s + (d.prob > 0 ? d.prob * Math.log(d.prob) : 0), 0);
  });

  // Reactive accessors for observed data per bar
  const obsDensity = (k: number) => {
    const h = histogram();
    const t = trials();
    if (t === 0 || h.length <= k) return 0;
    return h[k] / t;
  };

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4 flex-wrap">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>N = {nCoins()} coins</label>
        <input type="range" min="2" max="20" step="1" value={nCoins()} onInput={(e) => { setNCoins(parseInt(e.currentTarget.value)); reset(); }}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer sim-slider"
          style={{ background: `linear-gradient(to right, #10b981 ${((nCoins() - 2) / 18) * 100}%, var(--border) ${((nCoins() - 2) / 18) * 100}%)` }}
        />
      </div>

      <svg width="100%" height="220" viewBox="0 0 420 220" preserveAspectRatio="xMidYMid meet" class="mx-auto">
        <line x1="30" y1="190" x2="400" y2="190" stroke="var(--border)" stroke-width="1" />
        <text x="215" y="215" text-anchor="middle" font-size="10" fill="var(--text-muted)">Number of heads (macrostate k)</text>

        <For each={theory()}>
          {(d) => {
            const N = () => nCoins();
            const barW = () => Math.max(340 / (N() + 1) - 2, 4);
            const px = () => 35 + (d.k / N()) * 360;
            const hTheory = () => (d.prob / maxProb()) * 160;
            const hObs = () => (obsDensity(d.k) / maxProb()) * 160;

            return (
              <>
                {/* Theory bar */}
                <rect x={px() - barW() / 2} y={190 - hTheory()} width={barW()} height={Math.max(hTheory(), 0)} rx="2" fill="#10b981" opacity="0.25" />

                {/* Observed bar */}
                {trials() > 0 && (
                  <rect x={px() - barW() / 4} y={190 - hObs()} width={barW() / 2} height={Math.max(hObs(), 0)} rx="1" fill="#10b981" opacity="0.7" />
                )}

                {/* Label */}
                {N() <= 12 && (
                  <text x={px()} y="203" text-anchor="middle" font-size="8" fill="var(--text-muted)">{d.k}</text>
                )}
              </>
            );
          }}
        </For>

        <text x="350" y="25" text-anchor="middle" font-size="9" fill="var(--text-muted)">
          Light = theory | Dark = observed
        </text>
      </svg>

      <div class="flex justify-center gap-2 flex-wrap">
        <button onClick={() => simulate(100)} class="px-3 sm:px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#10b981", color: "white" }}>Flip ×100</button>
        <button onClick={() => simulate(1000)} class="px-3 sm:px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#059669", color: "white" }}>Flip ×1000</button>
        <button onClick={() => simulate(10000)} class="px-3 sm:px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#065f46", color: "white" }}>Flip ×10000</button>
        <button onClick={reset} class="px-3 sm:px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>

      <div class="grid grid-cols-3 gap-2 sm:gap-3 text-center">
        <div class="card p-2 sm:p-3">
          <div class="text-[9px] sm:text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Total Microstates</div>
          <div class="text-sm sm:text-lg font-bold" style={{ color: "#10b981" }}>2<sup>{nCoins()}</sup> = {Math.pow(2, nCoins()).toLocaleString()}</div>
        </div>
        <div class="card p-2 sm:p-3">
          <div class="text-[9px] sm:text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>S / k_B</div>
          <div class="text-sm sm:text-lg font-bold" style={{ color: "#06b6d4" }}>{entropy().toFixed(3)}</div>
        </div>
        <div class="card p-2 sm:p-3">
          <div class="text-[9px] sm:text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Trials</div>
          <div class="text-sm sm:text-lg font-bold" style={{ color: "var(--text-primary)" }}>{trials().toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

function comb(n: number, k: number): number {
  if (k > n || k < 0) return 0;
  if (k === 0 || k === n) return 1;
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
}
