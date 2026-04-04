import { Component, createSignal, createMemo, For } from "solid-js";

export const S3ShannonEntropy: Component = () => {
  const [probs, setProbs] = createSignal([0.25, 0.25, 0.25, 0.25]);
  const [nOutcomes, setNOutcomes] = createSignal(4);

  const normalize = (arr: number[]) => {
    const sum = arr.reduce((s, v) => s + v, 0);
    return sum > 0 ? arr.map((v) => v / sum) : arr.map(() => 1 / arr.length);
  };

  const updateProb = (idx: number, val: number) => {
    const newProbs = [...probs()];
    newProbs[idx] = val;
    setProbs(normalize(newProbs));
  };

  const shannonH = createMemo(() => {
    return -probs().reduce((s, p) => s + (p > 1e-10 ? p * Math.log2(p) : 0), 0);
  });

  const maxEntropy = () => Math.log2(nOutcomes());

  // KL divergence from uniform
  const klDiv = createMemo(() => {
    const q = 1 / nOutcomes();
    return probs().reduce((s, p) => s + (p > 1e-10 ? p * Math.log2(p / q) : 0), 0);
  });

  const setUniform = () => setProbs(Array(nOutcomes()).fill(1 / nOutcomes()));
  const setSkewed = () => {
    const arr = Array(nOutcomes()).fill(0.01);
    arr[0] = 1;
    setProbs(normalize(arr));
  };

  const colors = ["#06b6d4", "#ec4899", "#f59e0b", "#10b981", "#6366f1", "#ef4444", "#8b5cf6", "#14b8a6"];

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Outcomes: {nOutcomes()}</label>
        <input type="range" min="2" max="8" step="1" value={nOutcomes()} onInput={(e) => {
          const n = parseInt(e.currentTarget.value);
          setNOutcomes(n);
          setProbs(Array(n).fill(1 / n));
        }} class="w-24 h-2 rounded-full appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
        <button onClick={setUniform} class="px-3 py-1.5 rounded-lg text-[10px] font-medium" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Uniform</button>
        <button onClick={setSkewed} class="px-3 py-1.5 rounded-lg text-[10px] font-medium" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Skewed</button>
      </div>

      {/* Probability sliders */}
      <div class="grid grid-cols-2 gap-x-4 gap-y-2">
        <For each={probs()}>
          {(p, i) => (
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" style={{ background: colors[i() % colors.length] }} />
              <span class="text-[11px] font-mono w-10" style={{ color: "var(--text-secondary)" }}>p{i() + 1}={p.toFixed(3)}</span>
              <input type="range" min="0.001" max="1" step="0.001" value={p} onInput={(e) => updateProb(i(), parseFloat(e.currentTarget.value))}
                class="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, ${colors[i() % colors.length]} ${p * 100}%, var(--border) ${p * 100}%)` }}
              />
            </div>
          )}
        </For>
      </div>

      {/* Distribution bar chart */}
      <svg width="100%" height="120" viewBox="0 0 420 120" class="mx-auto">
        <For each={probs()}>
          {(p, i) => {
            const barW = 350 / nOutcomes() - 4;
            const px = 40 + (i() / nOutcomes()) * 350;
            const h = p * 100;
            return (
              <>
                <rect x={px} y={110 - h} width={barW} height={h} rx="3" fill={colors[i() % colors.length]} opacity="0.6" />
                <text x={px + barW / 2} y={107 - h} text-anchor="middle" font-size="8" fill={colors[i() % colors.length]}>{(p * 100).toFixed(1)}%</text>
              </>
            );
          }}
        </For>
        <line x1="35" y1="110" x2="400" y2="110" stroke="var(--border)" stroke-width="1" />
      </svg>

      {/* Entropy metrics */}
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>H (bits)</div>
          <div class="text-lg font-bold" style={{ color: "#10b981" }}>{shannonH().toFixed(4)}</div>
          <div class="text-[9px]" style={{ color: "var(--text-muted)" }}>max = {maxEntropy().toFixed(3)}</div>
          {/* Mini progress bar */}
          <div class="w-full h-1.5 rounded-full mt-2" style={{ background: "var(--bg-secondary)" }}>
            <div class="h-full rounded-full" style={{ width: `${(shannonH() / maxEntropy()) * 100}%`, background: "#10b981" }} />
          </div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>D_KL (bits)</div>
          <div class="text-lg font-bold" style={{ color: "#ec4899" }}>{klDiv().toFixed(4)}</div>
          <div class="text-[9px]" style={{ color: "var(--text-muted)" }}>divergence from uniform</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Efficiency</div>
          <div class="text-lg font-bold" style={{ color: "#06b6d4" }}>{((shannonH() / maxEntropy()) * 100).toFixed(1)}%</div>
          <div class="text-[9px]" style={{ color: "var(--text-muted)" }}>H / H_max</div>
        </div>
      </div>
    </div>
  );
};
