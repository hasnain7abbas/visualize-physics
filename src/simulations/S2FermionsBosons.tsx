import { Component, createSignal, createMemo, For } from "solid-js";

export const S2FermionsBosons: Component = () => {
  const [nParticles, setNParticles] = createSignal(4);
  const [mode, setMode] = createSignal<"MB" | "FD" | "BE">("FD");
  const nLevels = 6;

  const distribution = createMemo(() => {
    const N = nParticles();
    const occ = Array(nLevels).fill(0);

    if (mode() === "FD") {
      // Fermions fill from bottom, max 1 per level
      for (let i = 0; i < Math.min(N, nLevels); i++) occ[i] = 1;
    } else if (mode() === "BE") {
      // Bosons: all pile into ground state (T=0 limit)
      occ[0] = N;
    } else {
      // MB: uniform-ish spread
      for (let i = 0; i < N; i++) occ[i % nLevels]++;
    }
    return occ;
  });

  // Microstate count
  const microstates = createMemo(() => {
    const N = nParticles(), g = nLevels;
    if (mode() === "FD") {
      // C(g, N)
      return comb(g, Math.min(N, g));
    } else if (mode() === "BE") {
      // C(N+g-1, N)
      return comb(N + g - 1, N);
    } else {
      // g^N (distinguishable)
      return Math.pow(g, N);
    }
  });

  return (
    <div class="space-y-5">
      <div class="flex justify-center gap-2">
        {(["MB", "FD", "BE"] as const).map((m) => (
          <button onClick={() => setMode(m)} class="px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: mode() === m ? (m === "MB" ? "#f59e0b" : m === "FD" ? "#6366f1" : "#06b6d4") : "var(--bg-secondary)",
              color: mode() === m ? "white" : "var(--text-secondary)",
            }}>
            {m === "MB" ? "Maxwell-Boltzmann" : m === "FD" ? "Fermi-Dirac" : "Bose-Einstein"}
          </button>
        ))}
      </div>

      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Particles: {nParticles()}</label>
        <input type="range" min="1" max="6" step="1" value={nParticles()} onInput={(e) => setNParticles(parseInt(e.currentTarget.value))}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer" style={{ background: "var(--border)" }}
        />
      </div>

      <svg width="100%" height="260" viewBox="0 0 420 260" class="mx-auto">
        {/* Energy levels */}
        <For each={distribution()}>
          {(occ, i) => {
            const y = 230 - i() * 35;
            const color = mode() === "MB" ? "#f59e0b" : mode() === "FD" ? "#6366f1" : "#06b6d4";
            return (
              <>
                <line x1="80" y1={y} x2="250" y2={y} stroke="var(--border)" stroke-width="1.5" />
                <text x="60" y={y + 4} text-anchor="end" font-size="10" fill="var(--text-muted)">E{i()}</text>

                {/* Particles on this level */}
                {Array.from({ length: occ }, (_, j) => (
                  <circle
                    cx={120 + j * 25}
                    cy={y - 8}
                    r="8"
                    fill={color}
                    opacity="0.7"
                    stroke="white"
                    stroke-width="1.5"
                  />
                ))}

                {occ > 0 && (
                  <text x={120 + occ * 25 + 5} y={y - 4} font-size="9" fill={color} font-weight="600">
                    n={occ}
                  </text>
                )}
              </>
            );
          }}
        </For>

        {/* Info panel */}
        <rect x="280" y="40" width="130" height="120" rx="8" fill="var(--bg-card)" stroke="var(--border)" stroke-width="1" />
        <text x="345" y="62" text-anchor="middle" font-size="10" font-weight="600" fill="var(--text-primary)">
          {mode() === "MB" ? "Classical" : mode() === "FD" ? "Fermions" : "Bosons"}
        </text>
        <text x="345" y="82" text-anchor="middle" font-size="9" fill="var(--text-muted)">
          Max per level: {mode() === "FD" ? "1" : "∞"}
        </text>
        <text x="345" y="102" text-anchor="middle" font-size="9" fill="var(--text-muted)">
          Distinguishable: {mode() === "MB" ? "Yes" : "No"}
        </text>
        <text x="345" y="130" text-anchor="middle" font-size="10" font-weight="700" fill={mode() === "MB" ? "#f59e0b" : mode() === "FD" ? "#6366f1" : "#06b6d4"}>
          Ω = {microstates()}
        </text>
        <text x="345" y="148" text-anchor="middle" font-size="8" fill="var(--text-muted)">microstates</text>
      </svg>

      <div class="text-center text-[11px]" style={{ color: "var(--text-muted)" }}>
        {mode() === "FD" && "Fermions: Pauli exclusion — at most 1 particle per state"}
        {mode() === "BE" && "Bosons: love to bunch — all pile into ground state at T=0"}
        {mode() === "MB" && "Classical: distinguishable particles, no occupation limits"}
      </div>
    </div>
  );
};

function comb(n: number, k: number): number {
  if (k > n || k < 0) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  for (let i = 0; i < k; i++) result = (result * (n - i)) / (i + 1);
  return Math.round(result);
}
