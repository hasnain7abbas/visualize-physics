import { Component, createSignal, createMemo, For } from "solid-js";

export const S1BoltzmannEnergy: Component = () => {
  const [temp, setTemp] = createSignal(1.0); // kT units
  const [numLevels, setNumLevels] = createSignal(8);

  const beta = () => 1 / temp();

  const levels = createMemo(() => {
    const arr = [];
    let Z = 0;
    for (let i = 0; i < numLevels(); i++) {
      const E = i; // E = 0, 1, 2, ...
      const weight = Math.exp(-beta() * E);
      Z += weight;
      arr.push({ E, weight });
    }
    return arr.map((l) => ({ ...l, prob: l.weight / Z }));
  });

  const Z = createMemo(() => levels().reduce((s, l) => s + l.weight, 0));
  const avgE = createMemo(() => levels().reduce((s, l) => s + l.E * l.prob, 0));

  const maxProb = createMemo(() => Math.max(...levels().map((l) => l.prob)));

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "65px" }}>kT = {temp().toFixed(2)}</label>
        <input type="range" min="0.1" max="5" step="0.05" value={temp()} onInput={(e) => setTemp(parseFloat(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #f59e0b ${((temp() - 0.1) / 4.9) * 100}%, var(--border) ${((temp() - 0.1) / 4.9) * 100}%)` }}
        />
      </div>

      <svg width="100%" height="250" viewBox="0 0 420 250" class="mx-auto">
        {/* Energy levels with populations */}
        <For each={levels()}>
          {(level, i) => {
            const y = 230 - (i() / (numLevels() - 1)) * 200;
            const barW = (level.prob / maxProb()) * 250;
            return (
              <>
                {/* Energy level line */}
                <line x1="50" y1={y} x2="130" y2={y} stroke="var(--border)" stroke-width="1.5" />
                <text x="40" y={y + 4} text-anchor="end" font-size="9" fill="var(--text-muted)">E={level.E}</text>

                {/* Population bar */}
                <rect x="140" y={y - 8} width={barW} height="16" rx="3" fill="#f59e0b" opacity={0.3 + level.prob * 2} />
                <text x={145 + barW} y={y + 4} font-size="9" fill="#f59e0b" font-weight="500">{(level.prob * 100).toFixed(1)}%</text>

                {/* Particles dots */}
                {Array.from({ length: Math.round(level.prob * 30) }, (_, j) => (
                  <circle cx={65 + (j % 5) * 12} cy={y - 4} r="3" fill="#f59e0b" opacity="0.6" />
                ))}
              </>
            );
          }}
        </For>

        <text x="50" y="18" font-size="10" fill="var(--text-muted)">Energy</text>
        <text x="250" y="18" text-anchor="middle" font-size="10" fill="var(--text-muted)">Boltzmann population</text>
      </svg>

      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Z (partition fn)</div>
          <div class="text-lg font-bold" style={{ color: "#f59e0b" }}>{Z().toFixed(3)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>⟨E⟩</div>
          <div class="text-lg font-bold" style={{ color: "#06b6d4" }}>{avgE().toFixed(3)}</div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>β = 1/kT</div>
          <div class="text-lg font-bold" style={{ color: "#ec4899" }}>{beta().toFixed(3)}</div>
        </div>
      </div>
    </div>
  );
};
