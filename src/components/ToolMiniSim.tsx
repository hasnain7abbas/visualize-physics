import { Component, createSignal, createMemo, Show, For } from "solid-js";

// ─── Mini-sim types and mapping ──────────────────────────────────────

type SimType =
  | "normal" | "binomial" | "poisson" | "exponential" | "chi-squared"
  | "gamma" | "uniform" | "beta" | "bernoulli" | "geometric"
  | "cauchy" | "rayleigh" | "maxwell" | "fermi" | "bose" | "planck"
  | "lln" | "clt" | "histogram" | "random-walk"
  | "confidence" | "hypothesis" | "mle" | "pvalue"
  | "bayes" | "markov" | "monte-carlo" | "metropolis"
  | "fourier" | "convolution" | "correlation" | "regression"
  | "entropy" | "kl-div" | "mutual-info" | "cross-entropy"
  | "error-prop" | "bootstrap" | "moment" | "cdf"
  | "eigenvalue" | "projection" | "interference" | "phasor"
  | "stirling" | "combinatorics" | "generating-fn"
  | "logistic" | "step-function" | "equipartition"
  | "sample-mean" | "variance" | "covariance"
  | "chebyshev" | "jensen" | "cramer-rao";

const toolSimMap: Record<string, SimType> = {};

// Build mapping from keywords in tool names
const keywordMap: [string[], SimType][] = [
  [["normal", "gaussian", "bell curve", "z-score"], "normal"],
  [["binomial"], "binomial"],
  [["poisson"], "poisson"],
  [["exponential distribution", "exponential dist"], "exponential"],
  [["chi-squared", "chi squared", "chi distribution"], "chi-squared"],
  [["gamma distribution"], "gamma"],
  [["uniform"], "uniform"],
  [["beta dist"], "beta"],
  [["bernoulli"], "bernoulli"],
  [["geometric dist", "geometric series"], "geometric"],
  [["rayleigh"], "rayleigh"],
  [["maxwell-boltzmann", "maxwell boltzmann"], "maxwell"],
  [["fermi-dirac", "fermi dirac", "fermi level", "fermi gas", "fermi integral"], "fermi"],
  [["bose-einstein", "bose einstein", "bose function", "planck dist"], "bose"],
  [["law of large", "large numbers"], "lln"],
  [["central limit", "clt"], "clt"],
  [["histogram", "binning"], "histogram"],
  [["random walk", "diffusion", "brownian"], "random-walk"],
  [["confidence interval"], "confidence"],
  [["hypothesis test", "goodness-of-fit", "p-value"], "hypothesis"],
  [["maximum likelihood", "mle", "point estimation"], "mle"],
  [["bayes", "bayesian", "posterior", "prior"], "bayes"],
  [["markov"], "markov"],
  [["monte carlo", "sampling", "importance sampling", "acceptance-rejection"], "monte-carlo"],
  [["metropolis"], "metropolis"],
  [["fourier"], "fourier"],
  [["convolution"], "convolution"],
  [["correlation", "covariance", "cov("], "correlation"],
  [["regression", "curve fit", "least square"], "regression"],
  [["shannon entropy", "entropy h", "gibbs entropy", "boltzmann's h"], "entropy"],
  [["kl divergence", "kullback", "relative entropy"], "kl-div"],
  [["mutual information", "i(x;y)"], "mutual-info"],
  [["cross-entropy", "cross entropy"], "cross-entropy"],
  [["error prop", "propagation of"], "error-prop"],
  [["bootstrap"], "bootstrap"],
  [["moment", "skewness", "kurtosis", "moment generating"], "moment"],
  [["cumulative", "cdf"], "cdf"],
  [["eigenvalue", "eigenstate"], "eigenvalue"],
  [["projection", "projector"], "projection"],
  [["interference", "double-slit", "fringe", "constructive", "destructive"], "interference"],
  [["phasor", "complex number", "polar form", "amplitude addition"], "phasor"],
  [["stirling"], "stirling"],
  [["combinatorics", "permutation", "combination", "c(n,k)", "n choose", "multinomial coeff", "stars and bars"], "combinatorics"],
  [["generating function"], "generating-fn"],
  [["logistic", "sigmoid"], "logistic"],
  [["step function", "heaviside"], "step-function"],
  [["equipartition"], "equipartition"],
  [["sample proportion", "sample mean", "standard error"], "sample-mean"],
  [["variance", "standard deviation"], "variance"],
  [["chebyshev"], "chebyshev"],
  [["jensen"], "jensen"],
  [["cramér-rao", "cramer-rao", "fisher information"], "cramer-rao"],
  [["born rule"], "bernoulli"],
  [["normalization"], "cdf"],
  [["probability axiom", "sample space", "event algebra"], "combinatorics"],
  [["conditional prob", "p(a|b)"], "bayes"],
  [["joint prob", "joint entropy", "marginal"], "correlation"],
  [["independence", "incompatib"], "hypothesis"],
  [["stochastic", "transition mat", "sequential"], "markov"],
  [["information loss", "irreversib", "data processing"], "entropy"],
  [["uncertainty relation", "robertson", "heisenberg", "product of standard"], "fourier"],
  [["cauchy-schwarz"], "chebyshev"],
  [["entropic uncertainty"], "entropy"],
  [["squeezed state", "minimum uncertainty", "width-bandwidth"], "fourier"],
  [["wigner", "quasi-prob"], "interference"],
  [["trade-off", "pareto"], "fourier"],
  [["density of states"], "chi-squared"],
  [["sommerfeld"], "fermi"],
  [["degenerate vs non"], "fermi"],
  [["occupation number", "fluctuation"], "poisson"],
  [["fugacity"], "exponential"],
  [["condensate fraction", "order parameter", "critical temp"], "bose"],
  [["spontaneous symmetry", "phase transition", "lambda transition"], "step-function"],
  [["polylogarithm", "riemann zeta", "zeta function"], "generating-fn"],
  [["partition function", "normalizing", "log-partition"], "exponential"],
  [["legendre transform", "thermodynamic potential"], "fourier"],
  [["saddle point", "steepest descent"], "normal"],
  [["free energy", "variational"], "exponential"],
  [["response function", "susceptib", "heat capacity"], "chi-squared"],
  [["fluctuation-dissipation"], "variance"],
  [["boltzmann factor", "boltzmann weight", "gibbs measure"], "exponential"],
  [["detailed balance"], "markov"],
  [["maximum entropy", "maxent", "lagrange mult"], "entropy"],
  [["sufficient statistic"], "mle"],
  [["mean, most prob", "mode vs mean"], "maxwell"],
  [["change of variable", "jacobian"], "cdf"],
  [["kernel density"], "histogram"],
  [["entropy of mixing", "gibbs paradox", "concavity"], "entropy"],
  [["osmotic", "colligative", "chemical potential", "activity coeff"], "exponential"],
  [["binary phase", "phase diagram"], "step-function"],
  [["ideal gas mixing", "gibbs free"], "entropy"],
  [["channel capacity", "source coding", "data compress"], "entropy"],
  [["landauer", "maxwell's demon"], "entropy"],
  [["bunching", "antibunching", "sub-poisson"], "poisson"],
  [["visibility", "fringe contrast"], "interference"],
  [["ensemble averaging"], "lln"],
  [["error function", "erf"], "normal"],
  [["quantile"], "cdf"],
  [["orthogonality"], "interference"],
  [["superposition of dist"], "interference"],
  [["frequency vs prob", "frequentist"], "lln"],
];

function getSimType(toolName: string): SimType | null {
  const lower = toolName.toLowerCase();
  for (const [keywords, simType] of keywordMap) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return simType;
    }
  }
  return null;
}

// ─── Mini-simulation components ──────────────────────────────────────

const NormalSim: Component = () => {
  const [mu, setMu] = createSignal(0);
  const [sigma, setSigma] = createSignal(1);
  const pts = createMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * 8 - 4;
      arr.push(Math.exp(-((x - mu()) ** 2) / (2 * sigma() ** 2)) / (sigma() * Math.sqrt(2 * Math.PI)));
    }
    return arr;
  });
  const max = createMemo(() => Math.max(...pts()));
  return (
    <div>
      <svg width="100%" height="80" viewBox="0 0 200 80">
        <path d={pts().map((v, i) => `${i === 0 ? "M" : "L"}${i * 2},${75 - (v / max()) * 65}`).join(" ")} fill="none" stroke="#8b5cf6" stroke-width="2" />
        <path d={pts().map((v, i) => `${i === 0 ? "M" : "L"}${i * 2},${75 - (v / max()) * 65}`).join(" ") + " L200,75 L0,75 Z"} fill="#8b5cf6" opacity="0.1" />
        <line x1={100 + mu() * 25} y1="0" x2={100 + mu() * 25} y2="75" stroke="#8b5cf6" stroke-width="1" stroke-dasharray="2 2" />
      </svg>
      <div class="flex gap-2 mt-1">
        <input type="range" min="-2" max="2" step="0.1" value={mu()} onInput={(e) => setMu(+e.currentTarget.value)} class="w-16 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>μ={mu().toFixed(1)} σ={sigma().toFixed(1)}</span>
        <input type="range" min="0.3" max="2" step="0.1" value={sigma()} onInput={(e) => setSigma(+e.currentTarget.value)} class="w-16 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const BinomialSim: Component = () => {
  const [n, setN] = createSignal(10);
  const [p, setP] = createSignal(0.5);
  const bars = createMemo(() => {
    const arr: number[] = [];
    for (let k = 0; k <= n(); k++) {
      arr.push(comb(n(), k) * Math.pow(p(), k) * Math.pow(1 - p(), n() - k));
    }
    return arr;
  });
  const max = createMemo(() => Math.max(...bars()));
  return (
    <div>
      <svg width="100%" height="70" viewBox="0 0 200 70">
        {bars().map((v, i) => <rect x={i * (190 / (n() + 1)) + 5} y={65 - (v / max()) * 55} width={Math.max(180 / (n() + 1) - 2, 2)} height={(v / max()) * 55} rx="1" fill="#06b6d4" opacity="0.6" />)}
      </svg>
      <div class="flex gap-2 mt-1">
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>n={n()}</span>
        <input type="range" min="2" max="20" step="1" value={n()} onInput={(e) => setN(+e.currentTarget.value)} class="w-14 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>p={p().toFixed(2)}</span>
        <input type="range" min="0.05" max="0.95" step="0.05" value={p()} onInput={(e) => setP(+e.currentTarget.value)} class="w-14 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const PoissonSim: Component = () => {
  const [lambda, setLambda] = createSignal(4);
  const bars = createMemo(() => {
    const arr: number[] = [];
    for (let k = 0; k <= 15; k++) arr.push(Math.exp(-lambda()) * Math.pow(lambda(), k) / factorial(k));
    return arr;
  });
  const max = createMemo(() => Math.max(...bars()));
  return (
    <div>
      <svg width="100%" height="70" viewBox="0 0 200 70">
        {bars().map((v, i) => <rect x={i * 12 + 5} y={65 - (v / max()) * 55} width="10" height={(v / max()) * 55} rx="1" fill="#10b981" opacity="0.6" />)}
      </svg>
      <div class="flex gap-2 mt-1">
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>λ={lambda().toFixed(1)}</span>
        <input type="range" min="0.5" max="10" step="0.5" value={lambda()} onInput={(e) => setLambda(+e.currentTarget.value)} class="flex-1 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const ExponentialSim: Component = () => {
  const [rate, setRate] = createSignal(1);
  const pts = createMemo(() => Array.from({ length: 100 }, (_, i) => { const x = i / 20; return rate() * Math.exp(-rate() * x); }));
  const max = createMemo(() => Math.max(...pts()));
  return (
    <div>
      <svg width="100%" height="70" viewBox="0 0 200 70">
        <path d={pts().map((v, i) => `${i === 0 ? "M" : "L"}${i * 2},${65 - (v / max()) * 55}`).join(" ")} fill="none" stroke="#f59e0b" stroke-width="2" />
        <path d={pts().map((v, i) => `${i === 0 ? "M" : "L"}${i * 2},${65 - (v / max()) * 55}`).join(" ") + " L200,65 L0,65 Z"} fill="#f59e0b" opacity="0.1" />
      </svg>
      <div class="flex gap-2 mt-1">
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>β={rate().toFixed(1)}</span>
        <input type="range" min="0.2" max="3" step="0.1" value={rate()} onInput={(e) => setRate(+e.currentTarget.value)} class="flex-1 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const BernoulliSim: Component = () => {
  const [p, setP] = createSignal(0.7);
  const [flips, setFlips] = createSignal<boolean[]>([]);
  const flip = () => setFlips((f) => [...f.slice(-29), Math.random() < p()]);
  return (
    <div>
      <svg width="100%" height="50" viewBox="0 0 200 50">
        {flips().map((v, i) => <rect x={i * 6.5 + 2} y={v ? 5 : 28} width="5" height="18" rx="1" fill={v ? "#06b6d4" : "#ec4899"} opacity="0.7" />)}
        {flips().length === 0 && <text x="100" y="30" text-anchor="middle" font-size="9" fill="var(--text-muted)">Click flip</text>}
      </svg>
      <div class="flex gap-2 mt-1 items-center">
        <button onClick={flip} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "#06b6d4", color: "white" }}>Flip</button>
        <button onClick={() => { for (let i = 0; i < 10; i++) setFlips((f) => [...f.slice(-29), Math.random() < p()]); }} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "#0e7490", color: "white" }}>×10</button>
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>p={p().toFixed(2)}</span>
        <input type="range" min="0.1" max="0.9" step="0.05" value={p()} onInput={(e) => { setP(+e.currentTarget.value); setFlips([]); }} class="w-16 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const RandomWalkSim: Component = () => {
  const [path, setPath] = createSignal([0]);
  const step = () => setPath((p) => { const last = p[p.length - 1]; return [...p.slice(-99), last + (Math.random() < 0.5 ? 1 : -1)]; });
  const walk10 = () => { let p = [...path()]; for (let i = 0; i < 10; i++) { p = [...p.slice(-99), p[p.length - 1] + (Math.random() < 0.5 ? 1 : -1)]; } setPath(p); };
  const minV = createMemo(() => Math.min(...path()));
  const maxV = createMemo(() => Math.max(...path()));
  const range = createMemo(() => Math.max(maxV() - minV(), 1));
  return (
    <div>
      <svg width="100%" height="70" viewBox="0 0 200 70">
        <line x1="0" y1="35" x2="200" y2="35" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="2 2" />
        <path d={path().map((v, i) => `${i === 0 ? "M" : "L"}${(i / Math.max(path().length - 1, 1)) * 198 + 1},${65 - ((v - minV()) / range()) * 55}`).join(" ")} fill="none" stroke="#ec4899" stroke-width="1.5" />
      </svg>
      <div class="flex gap-2 mt-1">
        <button onClick={step} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "#ec4899", color: "white" }}>Step</button>
        <button onClick={walk10} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "#be185d", color: "white" }}>×10</button>
        <button onClick={() => setPath([0])} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>Reset</button>
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>pos={path()[path().length - 1]}</span>
      </div>
    </div>
  );
};

const LLNSim: Component = () => {
  const [samples, setSamples] = createSignal<number[]>([]);
  const means = createMemo(() => { let s = 0; return samples().map((v, i) => { s += v; return s / (i + 1); }); });
  const add = (n: number) => setSamples((s) => [...s, ...Array.from({ length: n }, () => Math.random())]);
  return (
    <div>
      <svg width="100%" height="70" viewBox="0 0 200 70">
        <line x1="0" y1="35" x2="200" y2="35" stroke="#10b981" stroke-width="0.5" stroke-dasharray="2 2" />
        <text x="198" y="33" text-anchor="end" font-size="7" fill="#10b981">μ=0.5</text>
        {means().length > 0 && <path d={means().map((v, i) => `${i === 0 ? "M" : "L"}${(i / Math.max(means().length - 1, 1)) * 198 + 1},${65 - v * 60}`).join(" ")} fill="none" stroke="#06b6d4" stroke-width="1.5" />}
      </svg>
      <div class="flex gap-2 mt-1">
        <button onClick={() => add(1)} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "#06b6d4", color: "white" }}>+1</button>
        <button onClick={() => add(10)} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "#0e7490", color: "white" }}>+10</button>
        <button onClick={() => add(100)} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "#164e63", color: "white" }}>+100</button>
        <button onClick={() => setSamples([])} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>Reset</button>
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>n={samples().length}</span>
      </div>
    </div>
  );
};

const CLTSim: Component = () => {
  const [hist, setHist] = createSignal<number[]>(Array(20).fill(0));
  const [total, setTotal] = createSignal(0);
  const sample = (n: number) => {
    const h = [...hist()];
    for (let t = 0; t < n; t++) {
      let sum = 0; for (let i = 0; i < 12; i++) sum += Math.random();
      sum = (sum - 6) / Math.sqrt(1); // standardized
      const bin = Math.min(19, Math.max(0, Math.floor((sum + 4) / 8 * 20)));
      h[bin]++;
    }
    setHist(h); setTotal((v) => v + n);
  };
  const max = createMemo(() => Math.max(...hist(), 1));
  return (
    <div>
      <svg width="100%" height="70" viewBox="0 0 200 70">
        {hist().map((v, i) => <rect x={i * 10} y={65 - (v / max()) * 55} width="9" height={(v / max()) * 55} rx="1" fill="#6366f1" opacity="0.5" />)}
        {/* Normal curve overlay */}
        {total() > 10 && <path d={Array.from({ length: 100 }, (_, i) => { const x = (i / 100) * 8 - 4; const y = Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); return `${i === 0 ? "M" : "L"}${(x + 4) / 8 * 200},${65 - (y / 0.4) * 55}`; }).join(" ")} fill="none" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="3 2" />}
      </svg>
      <div class="flex gap-2 mt-1">
        <button onClick={() => sample(10)} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "#6366f1", color: "white" }}>+10</button>
        <button onClick={() => sample(100)} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "#4338ca", color: "white" }}>+100</button>
        <button onClick={() => { setHist(Array(20).fill(0)); setTotal(0); }} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>Reset</button>
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>n={total()}</span>
      </div>
    </div>
  );
};

const EntropySim: Component = () => {
  const [p, setP] = createSignal(0.5);
  const H = () => { const q = 1 - p(); return p() > 0.001 && q > 0.001 ? -(p() * Math.log2(p()) + q * Math.log2(q)) : 0; };
  return (
    <div>
      <svg width="100%" height="70" viewBox="0 0 200 70">
        <path d={Array.from({ length: 100 }, (_, i) => { const x = (i + 1) / 101; const h = -(x * Math.log2(x) + (1 - x) * Math.log2(1 - x)); return `${i === 0 ? "M" : "L"}${i * 2 + 2},${65 - h * 55}`; }).join(" ")} fill="none" stroke="#10b981" stroke-width="1.5" opacity="0.3" />
        <circle cx={p() * 200} cy={65 - H() * 55} r="4" fill="#10b981" />
        <text x={p() * 200 + 8} y={62 - H() * 55} font-size="8" fill="#10b981">H={H().toFixed(3)}</text>
      </svg>
      <div class="flex gap-2 mt-1">
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>p={p().toFixed(2)}</span>
        <input type="range" min="0.01" max="0.99" step="0.01" value={p()} onInput={(e) => setP(+e.currentTarget.value)} class="flex-1 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const InterferenceSim: Component = () => {
  const [phase, setPhase] = createSignal(0);
  const pts = createMemo(() => Array.from({ length: 100 }, (_, i) => {
    const x = (i / 100) * 4 * Math.PI;
    return Math.cos(x) + Math.cos(x + phase());
  }));
  const max = createMemo(() => Math.max(...pts().map(Math.abs), 0.01));
  return (
    <div>
      <svg width="100%" height="60" viewBox="0 0 200 60">
        <line x1="0" y1="30" x2="200" y2="30" stroke="var(--border)" stroke-width="0.5" />
        <path d={pts().map((v, i) => `${i === 0 ? "M" : "L"}${i * 2},${30 - (v / max()) * 25}`).join(" ")} fill="none" stroke="#06b6d4" stroke-width="1.5" />
      </svg>
      <div class="flex gap-2 mt-1">
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>Δφ={(phase() / Math.PI).toFixed(1)}π</span>
        <input type="range" min="0" max={2 * Math.PI} step="0.05" value={phase()} onInput={(e) => setPhase(+e.currentTarget.value)} class="flex-1 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const PhasorSim: Component = () => {
  const [a1, setA1] = createSignal(1);
  const [phi, setPhi] = createSignal(0);
  const resultMag = () => Math.sqrt((a1() + Math.cos(phi())) ** 2 + Math.sin(phi()) ** 2);
  return (
    <div>
      <svg width="100%" height="80" viewBox="0 0 200 80">
        <circle cx="60" cy="40" r="30" fill="none" stroke="var(--border)" stroke-width="0.5" />
        <line x1="60" y1="40" x2={60 + a1() * 28} y2="40" stroke="#06b6d4" stroke-width="2" />
        <line x1={60 + a1() * 28} y1="40" x2={60 + a1() * 28 + Math.cos(phi()) * 28} y2={40 - Math.sin(phi()) * 28} stroke="#ec4899" stroke-width="2" />
        <line x1="60" y1="40" x2={60 + (a1() + Math.cos(phi())) * 28 / 2} y2={40 - Math.sin(phi()) * 28 / 2} stroke="#f59e0b" stroke-width="2" stroke-dasharray="3 2" />
        <text x="130" y="20" font-size="8" fill="var(--text-muted)">|A₁+A₂|={resultMag().toFixed(2)}</text>
        <text x="130" y="35" font-size="8" fill="var(--text-muted)">P={resultMag().toFixed(2)}²={(resultMag() ** 2).toFixed(2)}</text>
        <text x="130" y="50" font-size="8" fill="#06b6d4">A₁ (blue)</text>
        <text x="130" y="62" font-size="8" fill="#ec4899">A₂ (pink)</text>
      </svg>
      <div class="flex gap-2 mt-1">
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>φ={(phi() / Math.PI).toFixed(1)}π</span>
        <input type="range" min="0" max={2 * Math.PI} step="0.05" value={phi()} onInput={(e) => setPhi(+e.currentTarget.value)} class="flex-1 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const FermiSim: Component = () => {
  const [T, setT] = createSignal(0.3);
  const mu = 5;
  return (
    <div>
      <svg width="100%" height="60" viewBox="0 0 200 60">
        <path d={Array.from({ length: 100 }, (_, i) => { const E = i / 10; const f = T() < 0.01 ? (E <= mu ? 1 : 0) : 1 / (Math.exp((E - mu) / T()) + 1); return `${i === 0 ? "M" : "L"}${i * 2},${55 - f * 45}`; }).join(" ")} fill="none" stroke="#6366f1" stroke-width="2" />
        <line x1={mu * 20} y1="0" x2={mu * 20} y2="55" stroke="#ec4899" stroke-width="0.5" stroke-dasharray="2 2" />
      </svg>
      <div class="flex gap-2 mt-1">
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>kT={T().toFixed(2)}</span>
        <input type="range" min="0.01" max="2" step="0.01" value={T()} onInput={(e) => setT(+e.currentTarget.value)} class="flex-1 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const BoseSim: Component = () => {
  const [tRatio, setTRatio] = createSignal(1.2);
  const n0 = () => tRatio() >= 1 ? 0 : 1 - Math.pow(tRatio(), 1.5);
  return (
    <div>
      <svg width="100%" height="60" viewBox="0 0 200 60">
        <path d={Array.from({ length: 100 }, (_, i) => { const t = i / 40; const n = t >= 1 ? 0 : 1 - Math.pow(t, 1.5); return `${i === 0 ? "M" : "L"}${i * 2},${55 - n * 45}`; }).join(" ")} fill="none" stroke="#06b6d4" stroke-width="1.5" opacity="0.3" />
        <circle cx={tRatio() * 80} cy={55 - n0() * 45} r="4" fill="#06b6d4" />
        <line x1="80" y1="0" x2="80" y2="55" stroke="#ef4444" stroke-width="0.5" stroke-dasharray="2 2" />
        <text x="82" y="8" font-size="7" fill="#ef4444">Tc</text>
      </svg>
      <div class="flex gap-2 mt-1">
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>T/Tc={tRatio().toFixed(2)} N₀={(n0() * 100).toFixed(0)}%</span>
        <input type="range" min="0.01" max="2.5" step="0.01" value={tRatio()} onInput={(e) => setTRatio(+e.currentTarget.value)} class="flex-1 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const CombinatoricsSim: Component = () => {
  const [n, setN] = createSignal(6);
  const [k, setK] = createSignal(3);
  return (
    <div>
      <svg width="100%" height="50" viewBox="0 0 200 50">
        {Array.from({ length: n() }, (_, i) => <circle cx={15 + i * (170 / n())} cy="25" r="8" fill={i < k() ? "#06b6d4" : "var(--border)"} opacity="0.6" stroke={i < k() ? "#06b6d4" : "var(--border)"} stroke-width="1" />)}
      </svg>
      <div class="flex gap-2 mt-1">
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>C({n()},{k()}) = {comb(n(), Math.min(k(), n()))}</span>
        <input type="range" min="2" max="12" step="1" value={n()} onInput={(e) => setN(+e.currentTarget.value)} class="w-14 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
        <input type="range" min="0" max={n()} step="1" value={k()} onInput={(e) => setK(+e.currentTarget.value)} class="w-14 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const MarkovSim: Component = () => {
  const [state, setState] = createSignal(0);
  const [history, setHistory] = createSignal([0]);
  const step = () => {
    const s = state();
    const next = Math.random() < 0.6 ? (s + 1) % 3 : (s + 2) % 3;
    setState(next);
    setHistory((h) => [...h.slice(-39), next]);
  };
  return (
    <div>
      <svg width="100%" height="60" viewBox="0 0 200 60">
        {[0, 1, 2].map((s) => <circle cx={40 + s * 60} cy="20" r="12" fill={state() === s ? "#ec4899" : "var(--bg-secondary)"} stroke={state() === s ? "#ec4899" : "var(--border)"} stroke-width="1.5" />)}
        {[0, 1, 2].map((s) => <text x={40 + s * 60} y="24" text-anchor="middle" font-size="9" fill={state() === s ? "white" : "var(--text-muted)"}>{s}</text>)}
        {history().map((v, i) => <rect x={i * 5} y={45 + v * 5 - 10} width="4" height="4" rx="1" fill={["#06b6d4", "#ec4899", "#f59e0b"][v]} opacity="0.6" />)}
      </svg>
      <div class="flex gap-2 mt-1">
        <button onClick={step} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "#ec4899", color: "white" }}>Step</button>
        <button onClick={() => { for (let i = 0; i < 10; i++) step(); }} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "#be185d", color: "white" }}>×10</button>
        <button onClick={() => { setState(0); setHistory([0]); }} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>Reset</button>
      </div>
    </div>
  );
};

const BayesSim: Component = () => {
  const [prior, setPrior] = createSignal(0.5);
  const [likelihood, setLikelihood] = createSignal(0.8);
  const posterior = () => { const p = prior() * likelihood(); return p / (p + (1 - prior()) * (1 - likelihood())); };
  return (
    <div>
      <svg width="100%" height="50" viewBox="0 0 200 50">
        {/* Prior bar */}
        <rect x="5" y="5" width={prior() * 80} height="12" rx="2" fill="#f59e0b" opacity="0.6" />
        <text x="90" y="14" font-size="7" fill="var(--text-muted)">Prior={prior().toFixed(2)}</text>
        {/* Posterior bar */}
        <rect x="5" y="25" width={posterior() * 80} height="12" rx="2" fill="#06b6d4" opacity="0.6" />
        <text x="90" y="34" font-size="7" fill="var(--text-muted)">Posterior={posterior().toFixed(3)}</text>
      </svg>
      <div class="flex gap-2 mt-1">
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>P={prior().toFixed(2)}</span>
        <input type="range" min="0.05" max="0.95" step="0.05" value={prior()} onInput={(e) => setPrior(+e.currentTarget.value)} class="w-14 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>L={likelihood().toFixed(2)}</span>
        <input type="range" min="0.05" max="0.95" step="0.05" value={likelihood()} onInput={(e) => setLikelihood(+e.currentTarget.value)} class="w-14 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const FourierSim: Component = () => {
  const [n, setN] = createSignal(3);
  const pts = createMemo(() => Array.from({ length: 100 }, (_, i) => {
    const x = (i / 100) * 2 * Math.PI;
    let y = 0;
    for (let k = 1; k <= n(); k++) y += Math.sin(k * x) / k;
    return y;
  }));
  const max = createMemo(() => Math.max(...pts().map(Math.abs), 0.01));
  return (
    <div>
      <svg width="100%" height="60" viewBox="0 0 200 60">
        <line x1="0" y1="30" x2="200" y2="30" stroke="var(--border)" stroke-width="0.5" />
        <path d={pts().map((v, i) => `${i === 0 ? "M" : "L"}${i * 2},${30 - (v / max()) * 25}`).join(" ")} fill="none" stroke="#8b5cf6" stroke-width="1.5" />
      </svg>
      <div class="flex gap-2 mt-1">
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>harmonics={n()}</span>
        <input type="range" min="1" max="15" step="1" value={n()} onInput={(e) => setN(+e.currentTarget.value)} class="flex-1 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const HistogramSim: Component = () => {
  const [data, setData] = createSignal<number[]>([]);
  const addSamples = (n: number) => { const d: number[] = []; for (let i = 0; i < n; i++) d.push((Math.random() + Math.random() + Math.random()) / 3); setData((p) => [...p, ...d]); };
  const bins = createMemo(() => { const b = Array(15).fill(0); data().forEach((v) => b[Math.min(14, Math.floor(v * 15))]++); return b; });
  const max = createMemo(() => Math.max(...bins(), 1));
  return (
    <div>
      <svg width="100%" height="60" viewBox="0 0 200 60">
        {bins().map((v, i) => <rect x={i * 13 + 2} y={55 - (v / max()) * 45} width="12" height={(v / max()) * 45} rx="1" fill="#14b8a6" opacity="0.5" />)}
      </svg>
      <div class="flex gap-2 mt-1">
        <button onClick={() => addSamples(10)} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "#14b8a6", color: "white" }}>+10</button>
        <button onClick={() => addSamples(100)} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "#0d9488", color: "white" }}>+100</button>
        <button onClick={() => setData([])} class="text-[9px] px-2 py-0.5 rounded" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>Reset</button>
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>n={data().length}</span>
      </div>
    </div>
  );
};

const ChiSquaredSim: Component = () => {
  const [k, setK] = createSignal(3);
  const pts = createMemo(() => Array.from({ length: 100 }, (_, i) => {
    const x = (i + 1) / 10;
    const kv = k();
    return Math.pow(x, kv / 2 - 1) * Math.exp(-x / 2) / (Math.pow(2, kv / 2) * gamma(kv / 2));
  }));
  const max = createMemo(() => Math.max(...pts()));
  return (
    <div>
      <svg width="100%" height="60" viewBox="0 0 200 60">
        <path d={pts().map((v, i) => `${i === 0 ? "M" : "L"}${i * 2},${55 - (v / max()) * 45}`).join(" ")} fill="none" stroke="#f59e0b" stroke-width="2" />
      </svg>
      <div class="flex gap-2 mt-1">
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>k={k()} (DoF)</span>
        <input type="range" min="1" max="10" step="1" value={k()} onInput={(e) => setK(+e.currentTarget.value)} class="flex-1 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const MaxwellSim: Component = () => {
  const [T, setT] = createSignal(1);
  const pts = createMemo(() => Array.from({ length: 100 }, (_, i) => {
    const v = (i + 0.5) / 25;
    return v * v * Math.exp(-v * v / (2 * T()));
  }));
  const max = createMemo(() => Math.max(...pts()));
  return (
    <div>
      <svg width="100%" height="60" viewBox="0 0 200 60">
        <path d={pts().map((v, i) => `${i === 0 ? "M" : "L"}${i * 2},${55 - (v / max()) * 45}`).join(" ")} fill="none" stroke="#f59e0b" stroke-width="2" />
        <path d={pts().map((v, i) => `${i === 0 ? "M" : "L"}${i * 2},${55 - (v / max()) * 45}`).join(" ") + " L200,55 L0,55 Z"} fill="#f59e0b" opacity="0.1" />
      </svg>
      <div class="flex gap-2 mt-1">
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>T={T().toFixed(1)}</span>
        <input type="range" min="0.2" max="3" step="0.1" value={T()} onInput={(e) => setT(+e.currentTarget.value)} class="flex-1 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const LogisticSim: Component = () => {
  const [k, setK] = createSignal(1);
  return (
    <div>
      <svg width="100%" height="60" viewBox="0 0 200 60">
        <path d={Array.from({ length: 100 }, (_, i) => { const x = (i / 100) * 10 - 5; const y = 1 / (1 + Math.exp(-k() * x)); return `${i === 0 ? "M" : "L"}${i * 2},${55 - y * 45}`; }).join(" ")} fill="none" stroke="#6366f1" stroke-width="2" />
        <line x1="100" y1="0" x2="100" y2="55" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="2 2" />
      </svg>
      <div class="flex gap-2 mt-1">
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>steepness={k().toFixed(1)}</span>
        <input type="range" min="0.2" max="5" step="0.1" value={k()} onInput={(e) => setK(+e.currentTarget.value)} class="flex-1 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const StepFunctionSim: Component = () => {
  const [smooth, setSmooth] = createSignal(0.1);
  return (
    <div>
      <svg width="100%" height="60" viewBox="0 0 200 60">
        <path d={Array.from({ length: 100 }, (_, i) => { const x = (i / 100) * 10 - 5; const y = smooth() < 0.05 ? (x >= 0 ? 1 : 0) : 1 / (1 + Math.exp(-x / smooth())); return `${i === 0 ? "M" : "L"}${i * 2},${55 - y * 45}`; }).join(" ")} fill="none" stroke="#10b981" stroke-width="2" />
      </svg>
      <div class="flex gap-2 mt-1">
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>width={smooth().toFixed(2)}</span>
        <input type="range" min="0.01" max="2" step="0.01" value={smooth()} onInput={(e) => setSmooth(+e.currentTarget.value)} class="flex-1 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const StirlingSim: Component = () => {
  const [n, setN] = createSignal(5);
  const exact = () => factorial(n());
  const approx = () => Math.sqrt(2 * Math.PI * n()) * Math.pow(n() / Math.E, n());
  const error = () => exact() > 0 ? Math.abs(exact() - approx()) / exact() * 100 : 0;
  return (
    <div class="text-center">
      <div class="text-[11px]" style={{ color: "var(--text-secondary)" }}>{n()}! = {exact().toFixed(0)}</div>
      <div class="text-[11px]" style={{ color: "#8b5cf6" }}>Stirling ≈ {approx().toFixed(1)}</div>
      <div class="text-[10px]" style={{ color: error() < 5 ? "#10b981" : "#f59e0b" }}>Error: {error().toFixed(2)}%</div>
      <input type="range" min="1" max="15" step="1" value={n()} onInput={(e) => setN(+e.currentTarget.value)} class="w-full h-1 mt-2 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      <div class="text-[9px]" style={{ color: "var(--text-muted)" }}>n = {n()}</div>
    </div>
  );
};

const KLDivSim: Component = () => {
  const [q, setQ] = createSignal(0.5);
  const p = 0.3;
  const kl = () => p * Math.log(p / q()) + (1 - p) * Math.log((1 - p) / (1 - q()));
  return (
    <div>
      <svg width="100%" height="50" viewBox="0 0 200 50">
        <rect x="30" y="10" width={p * 120} height="10" rx="2" fill="#06b6d4" opacity="0.6" />
        <text x="5" y="18" font-size="7" fill="#06b6d4">P</text>
        <rect x="30" y="28" width={q() * 120} height="10" rx="2" fill="#ec4899" opacity="0.6" />
        <text x="5" y="36" font-size="7" fill="#ec4899">Q</text>
        <text x="165" y="25" font-size="8" fill="var(--text-muted)">D_KL={kl().toFixed(3)}</text>
      </svg>
      <div class="flex gap-2 mt-1">
        <span class="text-[9px]" style={{ color: "var(--text-muted)" }}>q={q().toFixed(2)}</span>
        <input type="range" min="0.05" max="0.95" step="0.01" value={q()} onInput={(e) => setQ(+e.currentTarget.value)} class="flex-1 h-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
};

const GenericSim: Component = () => {
  const [v, setV] = createSignal(50);
  return (
    <div>
      <svg width="100%" height="40" viewBox="0 0 200 40">
        <rect x="5" y="10" width={v() * 1.9} height="15" rx="3" fill="#8b5cf6" opacity="0.4" />
        <text x={Math.max(v() * 1.9 - 5, 25)} y="22" text-anchor="end" font-size="8" fill="#8b5cf6">{v()}%</text>
      </svg>
      <input type="range" min="0" max="100" step="1" value={v()} onInput={(e) => setV(+e.currentTarget.value)} class="w-full h-1 mt-1 appearance-none cursor-pointer" style={{ background: "var(--border)" }} />
    </div>
  );
};

// ─── Registry ────────────────────────────────────────────────────────

const simComponents: Record<SimType, Component> = {
  "normal": NormalSim, "binomial": BinomialSim, "poisson": PoissonSim,
  "exponential": ExponentialSim, "chi-squared": ChiSquaredSim,
  "gamma": ChiSquaredSim, "uniform": GenericSim, "beta": GenericSim,
  "bernoulli": BernoulliSim, "geometric": ExponentialSim,
  "cauchy": NormalSim, "rayleigh": MaxwellSim, "maxwell": MaxwellSim,
  "fermi": FermiSim, "bose": BoseSim, "planck": BoseSim,
  "lln": LLNSim, "clt": CLTSim, "histogram": HistogramSim,
  "random-walk": RandomWalkSim,
  "confidence": NormalSim, "hypothesis": NormalSim, "mle": LLNSim, "pvalue": NormalSim,
  "bayes": BayesSim, "markov": MarkovSim, "monte-carlo": HistogramSim, "metropolis": RandomWalkSim,
  "fourier": FourierSim, "convolution": FourierSim, "correlation": LLNSim, "regression": LLNSim,
  "entropy": EntropySim, "kl-div": KLDivSim, "mutual-info": EntropySim, "cross-entropy": KLDivSim,
  "error-prop": NormalSim, "bootstrap": HistogramSim, "moment": NormalSim, "cdf": LogisticSim,
  "eigenvalue": GenericSim, "projection": GenericSim, "interference": InterferenceSim, "phasor": PhasorSim,
  "stirling": StirlingSim, "combinatorics": CombinatoricsSim, "generating-fn": ExponentialSim,
  "logistic": LogisticSim, "step-function": StepFunctionSim, "equipartition": GenericSim,
  "sample-mean": LLNSim, "variance": NormalSim, "covariance": LLNSim,
  "chebyshev": NormalSim, "jensen": EntropySim, "cramer-rao": NormalSim,
};

// ─── Public component ────────────────────────────────────────────────

export const ToolMiniSim: Component<{ toolName: string }> = (props) => {
  const simType = () => getSimType(props.toolName);
  const Sim = () => simType() ? simComponents[simType()!] : null;

  return (
    <Show when={Sim()}>
      {(SimComp) => (
        <div class="mt-2 p-2 rounded-lg animate-fade-in" style={{ background: "var(--bg-secondary)" }}>
          <SimComp />
        </div>
      )}
    </Show>
  );
};

// ─── Utilities ───────────────────────────────────────────────────────

function comb(n: number, k: number): number {
  if (k > n || k < 0) return 0;
  if (k === 0 || k === n) return 1;
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return Math.round(r);
}

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function gamma(n: number): number {
  if (n === 1) return 1;
  if (n === 0.5) return Math.sqrt(Math.PI);
  if (n > 1) return (n - 1) * gamma(n - 1);
  return Math.sqrt(Math.PI); // approx
}
