import { Component, createSignal, createMemo } from "solid-js";

export const Q2SpinExpectation: Component = () => {
  const [theta, setTheta] = createSignal(45);
  const [phi, setPhi] = createSignal(0);

  const rad = () => (theta() * Math.PI) / 180;

  const expectations = createMemo(() => ({
    sx: Math.sin(rad()) * Math.cos((phi() * Math.PI) / 180) / 2,
    sy: Math.sin(rad()) * Math.sin((phi() * Math.PI) / 180) / 2,
    sz: Math.cos(rad()) / 2,
  }));

  const uncertainties = createMemo(() => {
    const e = expectations();
    return {
      dsx: Math.sqrt(0.25 - e.sx ** 2),
      dsy: Math.sqrt(0.25 - e.sy ** 2),
      dsz: Math.sqrt(0.25 - e.sz ** 2),
    };
  });

  const unc = uncertainties();
  const product = () => uncertainties().dsx * uncertainties().dsz;
  const bound = () => Math.abs(expectations().sy) / 2;

  return (
    <div class="space-y-5">
      {/* Controls */}
      <div class="space-y-3">
        <div class="flex items-center gap-4">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "50px" }}>θ = {theta()}°</label>
          <input type="range" min="0" max="180" step="1" value={theta()} onInput={(e) => setTheta(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #ec4899 ${(theta() / 180) * 100}%, var(--border) ${(theta() / 180) * 100}%)` }}
          />
        </div>
        <div class="flex items-center gap-4">
          <label class="text-xs font-medium" style={{ color: "var(--text-secondary)", "min-width": "50px" }}>φ = {phi()}°</label>
          <input type="range" min="0" max="360" step="1" value={phi()} onInput={(e) => setPhi(parseInt(e.currentTarget.value))}
            class="flex-1 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #6366f1 ${(phi() / 360) * 100}%, var(--border) ${(phi() / 360) * 100}%)` }}
          />
        </div>
      </div>

      {/* Bloch sphere-ish visualization */}
      <svg width="100%" height="200" viewBox="0 0 420 200" class="mx-auto">
        {/* Axes */}
        <ellipse cx="120" cy="100" rx="80" ry="30" fill="none" stroke="var(--border)" stroke-width="1" stroke-dasharray="3 3" />
        <line x1="120" y1="30" x2="120" y2="170" stroke="var(--border)" stroke-width="1" />
        <text x="120" y="22" text-anchor="middle" font-size="10" fill="var(--text-muted)">|↑⟩</text>
        <text x="120" y="185" text-anchor="middle" font-size="10" fill="var(--text-muted)">|↓⟩</text>

        {/* State vector */}
        <line x1="120" y1="100"
          x2={120 + 60 * Math.sin(rad()) * Math.cos((phi() * Math.PI) / 180)}
          y2={100 - 60 * Math.cos(rad())}
          stroke="#ec4899" stroke-width="2.5"
        />
        <circle
          cx={120 + 60 * Math.sin(rad()) * Math.cos((phi() * Math.PI) / 180)}
          cy={100 - 60 * Math.cos(rad())}
          r="4" fill="#ec4899"
        />

        {/* Expectation value bars */}
        <g transform="translate(260, 20)">
          <text x="0" y="0" font-size="10" font-weight="600" fill="var(--text-muted)">Expectation Values (ℏ/2 units)</text>

          {/* Sx */}
          <text x="0" y="30" font-size="10" fill="#06b6d4">⟨Sx⟩</text>
          <rect x="50" y="20" width="100" height="14" rx="2" fill="var(--bg-secondary)" />
          <rect x={50 + 50} y="20" width={Math.abs(expectations().sx) * 100} height="14" rx="2" fill="#06b6d4"
            transform={expectations().sx < 0 ? `translate(${-Math.abs(expectations().sx) * 100}, 0)` : ""}
          />
          <text x="155" y="31" font-size="9" fill="var(--text-muted)">{expectations().sx.toFixed(3)}</text>

          {/* Sy */}
          <text x="0" y="55" font-size="10" fill="#f59e0b">⟨Sy⟩</text>
          <rect x="50" y="45" width="100" height="14" rx="2" fill="var(--bg-secondary)" />
          <rect x={50 + 50} y="45" width={Math.abs(expectations().sy) * 100} height="14" rx="2" fill="#f59e0b"
            transform={expectations().sy < 0 ? `translate(${-Math.abs(expectations().sy) * 100}, 0)` : ""}
          />
          <text x="155" y="56" font-size="9" fill="var(--text-muted)">{expectations().sy.toFixed(3)}</text>

          {/* Sz */}
          <text x="0" y="80" font-size="10" fill="#ec4899">⟨Sz⟩</text>
          <rect x="50" y="70" width="100" height="14" rx="2" fill="var(--bg-secondary)" />
          <rect x={50 + 50} y="70" width={Math.abs(expectations().sz) * 100} height="14" rx="2" fill="#ec4899"
            transform={expectations().sz < 0 ? `translate(${-Math.abs(expectations().sz) * 100}, 0)` : ""}
          />
          <text x="155" y="81" font-size="9" fill="var(--text-muted)">{expectations().sz.toFixed(3)}</text>

          {/* Uncertainties */}
          <text x="0" y="115" font-size="10" font-weight="600" fill="var(--text-muted)">Uncertainties</text>
          <text x="0" y="135" font-size="9" fill="var(--text-secondary)">ΔSx = {uncertainties().dsx.toFixed(3)}</text>
          <text x="0" y="150" font-size="9" fill="var(--text-secondary)">ΔSz = {uncertainties().dsz.toFixed(3)}</text>
          <text x="0" y="170" font-size="9" font-weight="600" fill="#ec4899">
            ΔSx·ΔSz = {product().toFixed(4)} ≥ {bound().toFixed(4)} = |⟨Sy⟩|/2 ✓
          </text>
        </g>
      </svg>
    </div>
  );
};
