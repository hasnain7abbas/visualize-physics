import { Component, createSignal, createMemo } from "solid-js";

export const S2FermiDirac: Component = () => {
  const [temp, setTemp] = createSignal(0.5);
  const [mu, setMu] = createSignal(5.0);

  const fdCurve = createMemo(() => {
    const pts: { E: number; f: number }[] = [];
    for (let i = 0; i <= 200; i++) {
      const E = (i / 200) * 10;
      const f = temp() < 0.01 ? (E <= mu() ? 1 : 0) : 1 / (Math.exp((E - mu()) / temp()) + 1);
      pts.push({ E, f });
    }
    return pts;
  });

  const beCurve = createMemo(() => {
    const pts: { E: number; f: number }[] = [];
    for (let i = 0; i <= 200; i++) {
      const E = (i / 200) * 10;
      if (E <= mu() + 0.01) { pts.push({ E, f: 0 }); continue; }
      const f = 1 / (Math.exp((E - mu()) / temp()) - 1);
      pts.push({ E, f: Math.min(f, 10) });
    }
    return pts;
  });

  return (
    <div class="space-y-5">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "50px" }}>kT = {temp().toFixed(2)}</label>
          <input type="range" min="0.01" max="3" step="0.01" value={temp()} onInput={(e) => setTemp(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #6366f1 ${(temp() / 3) * 100}%, var(--border) ${(temp() / 3) * 100}%)` }}
          />
        </div>
        <div class="flex items-center gap-3">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "50px" }}>μ = {mu().toFixed(1)}</label>
          <input type="range" min="1" max="9" step="0.1" value={mu()} onInput={(e) => setMu(parseFloat(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #ec4899 ${((mu() - 1) / 8) * 100}%, var(--border) ${((mu() - 1) / 8) * 100}%)` }}
          />
        </div>
      </div>

      <svg width="100%" height="240" viewBox="0 0 420 240" class="mx-auto">
        <line x1="50" y1="200" x2="400" y2="200" stroke="var(--border)" stroke-width="1" />
        <line x1="50" y1="200" x2="50" y2="20" stroke="var(--border)" stroke-width="1" />
        <text x="220" y="225" text-anchor="middle" font-size="10" fill="var(--text-muted)">Energy E</text>
        <text x="15" y="110" text-anchor="middle" font-size="10" fill="var(--text-muted)" transform="rotate(-90 15 110)">⟨n⟩</text>

        {/* f=1 line */}
        <line x1="50" y1={200 - 170} x2="400" y2={200 - 170} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
        <text x="405" y={204 - 170} font-size="8" fill="var(--text-muted)">1</text>

        {/* f=0.5 line */}
        <line x1="50" y1={200 - 85} x2="400" y2={200 - 85} stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3 3" />
        <text x="405" y={204 - 85} font-size="8" fill="var(--text-muted)">0.5</text>

        {/* Chemical potential line */}
        <line x1={50 + (mu() / 10) * 350} y1="20" x2={50 + (mu() / 10) * 350} y2="200"
          stroke="#ec4899" stroke-width="1" stroke-dasharray="4 3" />
        <text x={50 + (mu() / 10) * 350} y="15" text-anchor="middle" font-size="9" fill="#ec4899" font-weight="600">μ</text>

        {/* FD curve */}
        <path
          d={fdCurve().map((p, i) => {
            const px = 50 + (p.E / 10) * 350;
            const py = 200 - p.f * 170;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ")}
          fill="none" stroke="#6366f1" stroke-width="2.5"
        />
        <path
          d={fdCurve().map((p, i) => {
            const px = 50 + (p.E / 10) * 350;
            const py = 200 - p.f * 170;
            return `${i === 0 ? "M" : "L"}${px},${py}`;
          }).join(" ") + " L400,200 L50,200 Z"}
          fill="#6366f1" opacity="0.08"
        />

        {/* Legend */}
        <line x1="290" y1="38" x2="310" y2="38" stroke="#6366f1" stroke-width="2.5" />
        <text x="315" y="42" font-size="9" fill="var(--text-secondary)">Fermi-Dirac</text>

        {/* T→0 step for reference */}
        {temp() > 0.1 && (
          <>
            <path d={`M50,${200 - 170} L${50 + (mu() / 10) * 350},${200 - 170} L${50 + (mu() / 10) * 350},200`}
              fill="none" stroke="#6366f1" stroke-width="1" stroke-dasharray="3 3" opacity="0.3" />
            <text x="290" y="55" font-size="8" fill="var(--text-muted)">- - - T=0 limit</text>
          </>
        )}
      </svg>

      <div class="card p-4 text-center">
        <span class="text-sm" style={{ color: "var(--text-secondary)" }}>
          f(E) = 1/(e<sup>(E−μ)/kT</sup> + 1). At T→0 it becomes a sharp step at E=μ.
          Width of transition region ≈ 4kT = {(4 * temp()).toFixed(2)}.
        </span>
      </div>
    </div>
  );
};
