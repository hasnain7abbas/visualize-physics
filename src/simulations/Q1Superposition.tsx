import { Component, createSignal, For, createMemo } from "solid-js";

export const Q1Superposition: Component = () => {
  const [alphaSq, setAlphaSq] = createSignal(0.5);
  const [results, setResults] = createSignal<boolean[]>([]);
  const [isRunning, setIsRunning] = createSignal(false);

  const betaSq = () => 1 - alphaSq();
  const counts = createMemo(() => {
    const r = results();
    const up = r.filter((x) => x).length;
    return { up, down: r.length - up };
  });
  const freqUp = () =>
    results().length > 0 ? counts().up / results().length : 0;

  const measure = () => {
    setResults((prev) => [...prev, Math.random() < alphaSq()]);
  };

  const measureMany = (n: number) => {
    setIsRunning(true);
    const newResults: boolean[] = [];
    for (let i = 0; i < n; i++) {
      newResults.push(Math.random() < alphaSq());
    }
    setResults((prev) => [...prev, ...newResults]);
    setIsRunning(false);
  };

  const reset = () => setResults([]);

  const maxBar = () => Math.max(counts().up, counts().down, 1);

  return (
    <div class="space-y-5">
      {/* Alpha slider */}
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px" }}>
          |α|² = {alphaSq().toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={alphaSq()}
          onInput={(e) => {
            setAlphaSq(parseFloat(e.currentTarget.value));
            reset();
          }}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #06b6d4 ${alphaSq() * 100}%, var(--border) ${alphaSq() * 100}%)` }}
        />
        <span class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "60px", "text-align": "right" }}>
          |β|² = {betaSq().toFixed(2)}
        </span>
      </div>

      {/* Quantum box visualization */}
      <div class="flex justify-center">
        <svg width="100%" height="180" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid meet" style={{ "max-width": "320px" }}>
          {/* Box */}
          <rect
            x="110" y="30" width="100" height="100" rx="12"
            fill="none"
            stroke={results().length > 0 && results()[results().length - 1] ? "#06b6d4" : results().length > 0 ? "#ec4899" : "var(--border)"}
            stroke-width="2"
            opacity={results().length > 0 ? 1 : 0.5}
          />
          {/* Superposition aura */}
          {results().length === 0 && (
            <>
              <rect x="112" y="32" width="96" height="96" rx="10" fill="#06b6d4" opacity={alphaSq() * 0.15} />
              <rect x="112" y="32" width="96" height="96" rx="10" fill="#ec4899" opacity={betaSq() * 0.15} />
            </>
          )}
          {/* State indicator */}
          <text x="160" y="85" text-anchor="middle" font-size="28" fill={
            results().length === 0 ? "var(--text-muted)" :
            results()[results().length - 1] ? "#06b6d4" : "#ec4899"
          }>
            {results().length === 0 ? "?" :
             results()[results().length - 1] ? "|0⟩" : "|1⟩"}
          </text>
          {/* Probability pie */}
          <circle cx="50" cy="80" r="30" fill="none" stroke="var(--border)" stroke-width="2" />
          <circle cx="50" cy="80" r="30" fill="none"
            stroke="#06b6d4" stroke-width="4"
            stroke-dasharray={`${alphaSq() * 188.5} ${188.5}`}
            stroke-dashoffset="47.1"
          />
          <text x="50" y="76" text-anchor="middle" font-size="8" fill="var(--text-muted)">P(|0⟩)</text>
          <text x="50" y="90" text-anchor="middle" font-size="11" font-weight="bold" fill="#06b6d4">{(alphaSq() * 100).toFixed(0)}%</text>

          {/* Trial count */}
          <text x="270" y="75" text-anchor="middle" font-size="10" fill="var(--text-muted)">Trials</text>
          <text x="270" y="95" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--text-primary)">{results().length}</text>
        </svg>
      </div>

      {/* Buttons */}
      <div class="flex justify-center gap-2">
        <button
          onClick={measure}
          class="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
          style={{ background: "#06b6d4", color: "white" }}
        >
          Measure Once
        </button>
        <button
          onClick={() => measureMany(10)}
          class="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
          style={{ background: "#0e7490", color: "white" }}
        >
          Measure ×10
        </button>
        <button
          onClick={() => measureMany(100)}
          class="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
          style={{ background: "#164e63", color: "white" }}
        >
          Measure ×100
        </button>
        <button
          onClick={reset}
          class="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
        >
          Reset
        </button>
      </div>

      {/* Histogram */}
      {results().length > 0 && (
        <div class="mt-4">
          <div class="flex items-end gap-4 justify-center h-24">
            <div class="text-center">
              <div
                class="w-20 rounded-t-md transition-all"
                style={{
                  height: `${(counts().up / maxBar()) * 80}px`,
                  background: "#06b6d4",
                  "min-height": "4px",
                }}
              />
              <div class="text-[10px] mt-1 font-medium" style={{ color: "#06b6d4" }}>|0⟩: {counts().up}</div>
            </div>
            <div class="text-center">
              <div
                class="w-20 rounded-t-md transition-all"
                style={{
                  height: `${(counts().down / maxBar()) * 80}px`,
                  background: "#ec4899",
                  "min-height": "4px",
                }}
              />
              <div class="text-[10px] mt-1 font-medium" style={{ color: "#ec4899" }}>|1⟩: {counts().down}</div>
            </div>
          </div>
          <div class="text-center mt-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
            Observed P(|0⟩) = {freqUp().toFixed(3)} | Theory = {alphaSq().toFixed(3)}
          </div>
        </div>
      )}
    </div>
  );
};
