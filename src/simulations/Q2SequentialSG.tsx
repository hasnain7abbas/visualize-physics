import { Component, createSignal } from "solid-js";

export const Q2SequentialSG: Component = () => {
  const [middleAxis, setMiddleAxis] = createSignal<"X" | "Y" | "none">("X");
  const [trials, setTrials] = createSignal(0);
  const [finalUp, setFinalUp] = createSignal(0);
  const [passedFilter, setPassedFilter] = createSignal(0);

  const run = (n: number) => {
    let t = trials(), fu = finalUp(), pf = passedFilter();
    for (let i = 0; i < n; i++) {
      const z1 = Math.random() < 0.5;
      t++;
      if (!z1) continue; // filtered out by first SG-Z
      pf++;
      if (middleAxis() === "none") {
        // No middle measurement: z2 is always up (same basis, filtered)
        fu++;
      } else {
        // Middle measurement in X or Y randomizes Z
        const _mid = Math.random() < 0.5;
        const z2 = Math.random() < 0.5;
        if (z2) fu++;
      }
    }
    setTrials(t); setFinalUp(fu); setPassedFilter(pf);
  };

  const reset = () => { setTrials(0); setFinalUp(0); setPassedFilter(0); };

  const pFinal = () => passedFilter() > 0 ? finalUp() / passedFilter() : 0;

  return (
    <div class="space-y-5">
      {/* Middle axis selector */}
      <div class="flex justify-center gap-2">
        {(["none", "X", "Y"] as const).map((axis) => (
          <button
            onClick={() => { setMiddleAxis(axis); reset(); }}
            class="px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              background: middleAxis() === axis ? "#ec4899" : "var(--bg-secondary)",
              color: middleAxis() === axis ? "white" : "var(--text-secondary)",
            }}
          >
            {axis === "none" ? "Z → Z (no middle)" : `Z → ${axis} → Z`}
          </button>
        ))}
      </div>

      {/* Chain diagram */}
      <svg width="100%" height="80" viewBox="0 0 460 80" class="mx-auto">
        <rect x="10" y="25" width="70" height="35" rx="6" fill="#06b6d420" stroke="#06b6d4" stroke-width="1.5" />
        <text x="45" y="47" text-anchor="middle" font-size="10" font-weight="600" fill="#06b6d4">SG-Z (↑)</text>

        <line x1="80" y1="42" x2="130" y2="42" stroke="var(--text-muted)" stroke-width="1.5" />

        {middleAxis() !== "none" ? (
          <>
            <rect x="130" y="25" width="70" height="35" rx="6" fill="#ec489920" stroke="#ec4899" stroke-width="1.5" />
            <text x="165" y="47" text-anchor="middle" font-size="10" font-weight="600" fill="#ec4899">SG-{middleAxis()}</text>
            <line x1="200" y1="42" x2="250" y2="42" stroke="var(--text-muted)" stroke-width="1.5" />
            <rect x="250" y="25" width="70" height="35" rx="6" fill="#f59e0b20" stroke="#f59e0b" stroke-width="1.5" />
            <text x="285" y="47" text-anchor="middle" font-size="10" font-weight="600" fill="#f59e0b">SG-Z</text>
            <text x="380" y="47" text-anchor="middle" font-size="12" font-weight="bold" fill={pFinal() > 0.6 ? "#06b6d4" : pFinal() < 0.4 ? "#f59e0b" : "var(--text-primary)"}>
              P(↑) = {passedFilter() > 0 ? pFinal().toFixed(3) : "?"}
            </text>
          </>
        ) : (
          <>
            <rect x="130" y="25" width="70" height="35" rx="6" fill="#f59e0b20" stroke="#f59e0b" stroke-width="1.5" />
            <text x="165" y="47" text-anchor="middle" font-size="10" font-weight="600" fill="#f59e0b">SG-Z</text>
            <text x="280" y="47" text-anchor="middle" font-size="12" font-weight="bold" fill="#06b6d4">
              P(↑) = {passedFilter() > 0 ? pFinal().toFixed(3) : "?"}
            </text>
          </>
        )}
      </svg>

      <div class="flex justify-center gap-2">
        <button onClick={() => run(1)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#ec4899", color: "white" }}>Run ×1</button>
        <button onClick={() => run(100)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#be185d", color: "white" }}>Run ×100</button>
        <button onClick={() => run(1000)} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "#831843", color: "white" }}>Run ×1000</button>
        <button onClick={reset} class="px-4 py-2 rounded-lg text-xs font-medium hover:scale-105 transition-all" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>Reset</button>
      </div>

      <div class="card p-4 text-center">
        <div class="text-sm" style={{ color: "var(--text-secondary)" }}>
          {middleAxis() === "none"
            ? "Without a middle measurement, filtered spin-up particles stay spin-up: P(↑) = 1.000"
            : `The ${middleAxis()} measurement destroys Z-information. Final P(↑) → 0.500 regardless!`}
        </div>
        <div class="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
          Trials: {trials()} | Through filter: {passedFilter()} | Final ↑: {finalUp()}
        </div>
      </div>
    </div>
  );
};
