import { Component, createSignal, createMemo, For, onCleanup } from "solid-js";

export const S3EntropyMixing: Component = () => {
  const [mixed, setMixed] = createSignal(false);
  const [mixFraction, setMixFraction] = createSignal(0.5);
  const [particles, setParticles] = createSignal(generateParticles(false, 0.5));
  let animFrame: number | undefined;

  function generateParticles(isMixed: boolean, frac: number) {
    const pts: { x: number; y: number; vx: number; vy: number; type: "A" | "B" }[] = [];
    const n = 60;
    for (let i = 0; i < n; i++) {
      const isA = i < n * frac;
      const x = isMixed
        ? Math.random() * 380 + 10
        : isA
          ? Math.random() * 180 + 10
          : Math.random() * 180 + 210;
      const y = Math.random() * 150 + 10;
      pts.push({
        x, y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        type: isA ? "A" : "B",
      });
    }
    return pts;
  }

  const startAnimation = () => {
    const step = () => {
      setParticles((pts) =>
        pts.map((p) => {
          let { x, y, vx, vy } = p;
          x += vx;
          y += vy;
          if (x < 5 || x > 395) vx = -vx;
          if (y < 5 || y > 165) vy = -vy;
          x = Math.max(5, Math.min(395, x));
          y = Math.max(5, Math.min(165, y));
          return { ...p, x, y, vx, vy };
        })
      );
      animFrame = requestAnimationFrame(step);
    };
    animFrame = requestAnimationFrame(step);
  };

  startAnimation();
  onCleanup(() => animFrame && cancelAnimationFrame(animFrame));

  const toggleMix = () => {
    const newMixed = !mixed();
    setMixed(newMixed);
    setParticles(generateParticles(newMixed, mixFraction()));
  };

  const entropy = createMemo(() => {
    const x = mixFraction();
    if (x <= 0 || x >= 1) return 0;
    return -(x * Math.log(x) + (1 - x) * Math.log(1 - x));
  });

  return (
    <div class="space-y-5">
      <div class="flex items-center gap-4">
        <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "50px" }}>x_A = {mixFraction().toFixed(2)}</label>
        <input type="range" min="0.05" max="0.95" step="0.01" value={mixFraction()} onInput={(e) => {
          setMixFraction(parseFloat(e.currentTarget.value));
          setParticles(generateParticles(mixed(), parseFloat(e.currentTarget.value)));
        }}
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #10b981 ${mixFraction() * 100}%, var(--border) ${mixFraction() * 100}%)` }}
        />
      </div>

      <svg width="100%" height="170" viewBox="0 0 400 170" class="mx-auto" style={{ background: "var(--bg-secondary)", "border-radius": "10px" }}>
        {/* Partition */}
        {!mixed() && (
          <line x1="200" y1="0" x2="200" y2="170" stroke="var(--text-primary)" stroke-width="2" stroke-dasharray="4 4" />
        )}

        {/* Particles */}
        <For each={particles()}>
          {(p) => (
            <circle cx={p.x} cy={p.y} r="4"
              fill={p.type === "A" ? "#06b6d4" : "#ec4899"}
              opacity="0.7"
            />
          )}
        </For>

        {/* Labels */}
        {!mixed() && (
          <>
            <text x="100" y="165" text-anchor="middle" font-size="10" fill="#06b6d4" font-weight="600">Gas A</text>
            <text x="300" y="165" text-anchor="middle" font-size="10" fill="#ec4899" font-weight="600">Gas B</text>
          </>
        )}
      </svg>

      <div class="flex justify-center gap-3">
        <button onClick={toggleMix} class="px-5 py-2.5 rounded-lg text-xs font-medium hover:scale-105 transition-all"
          style={{ background: mixed() ? "#ef4444" : "#10b981", color: "white" }}>
          {mixed() ? "Replace Partition" : "Remove Partition (Mix!)"}
        </button>
      </div>

      <div class="grid grid-cols-2 gap-3 text-center">
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>ΔS_mix / Nk_B</div>
          <div class="text-lg font-bold" style={{ color: "#10b981" }}>
            {mixed() ? entropy().toFixed(4) : "0.000 (separated)"}
          </div>
        </div>
        <div class="card p-3">
          <div class="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>State</div>
          <div class="text-lg font-bold" style={{ color: mixed() ? "#10b981" : "#f59e0b" }}>
            {mixed() ? "Mixed (higher S)" : "Separated (lower S)"}
          </div>
        </div>
      </div>
    </div>
  );
};
