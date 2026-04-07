export interface StatTool {
  name: string;
  desc: string;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  statisticalTools: StatTool[];
  keyEquations: string[];
  conceptSummary: string;
}

export interface Chapter {
  id: string;
  num: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  shortDesc: string;
  sections: Section[];
}

export interface ChapterGroup {
  id: string;
  title: string;
  subtitle: string;
  chapters: Chapter[];
}

// ─── QUANTUM PHYSICS ────────────────────────────────────────────────

const quantumPhysics: Chapter[] = [
  {
    id: "q1",
    num: "Q1",
    title: "Quantum Probability",
    description:
      "Quantum mechanics is fundamentally probabilistic. Unlike classical randomness, quantum probability arises from superposition of states, and measurement actively changes the system.",
    color: "#06b6d4",
    icon: "\u{1F431}",
    shortDesc: "Superposition & collapse",
    sections: [
      {
        id: "superposition",
        title: "Superposition & State Vectors",
        description:
          "A quantum system exists in a superposition of states until measured. The state vector encodes all possible outcomes with complex amplitudes whose squared magnitudes give probabilities.",
        statisticalTools: [
          { name: "Probability Axioms (Kolmogorov)", desc: "The three foundational rules: P(E) \u2265 0, P(\u03A9)=1, and additivity for disjoint events. Quantum probabilities satisfy these but arise from amplitudes." },
          { name: "Sample Space & Event Algebra", desc: "The set of all possible measurement outcomes. In quantum mechanics, this is the set of eigenvalues of the observable being measured." },
          { name: "Normalization Constraint", desc: "Total probability must equal 1. For quantum states: the sum of |amplitude|\u00B2 over all basis states equals 1." },
          { name: "Born Rule", desc: "The bridge between quantum amplitudes and classical probabilities: P(outcome) = |amplitude|\u00B2. The most important rule in quantum mechanics." },
          { name: "Discrete Probability Distributions", desc: "Assigns probabilities to a countable set of outcomes. Qubit measurements produce discrete distributions over eigenvalues." },
          { name: "Law of Large Numbers", desc: "Sample averages converge to expected values as sample size grows. Explains why repeated quantum measurements reveal the underlying probabilities." },
          { name: "Histogram Convergence", desc: "The empirical frequency histogram approaches the true distribution as the number of trials increases." },
          { name: "Bernoulli Trials", desc: "Independent experiments with two outcomes (success/failure). Each qubit measurement is a Bernoulli trial with p = |\u03B1|\u00B2." },
          { name: "Binomial Distribution", desc: "The distribution of successes in n independent Bernoulli trials. Describes the statistics of repeated quantum measurements." },
          { name: "Frequentist Interpretation", desc: "Probability as the limiting frequency of outcomes in repeated experiments. Quantum mechanics makes this precise through the Born rule." },
        ],
        keyEquations: [
          "\\ket{\\psi} = \\alpha\\ket{0} + \\beta\\ket{1}",
          "|\\alpha|^2 + |\\beta|^2 = 1",
          "P(0) = |\\alpha|^2,\\quad P(1) = |\\beta|^2",
        ],
        conceptSummary:
          "Adjust amplitude ratios and watch measurement outcomes converge to Born rule predictions over many trials.",
      },
      {
        id: "measurement",
        title: "Measurement & Collapse",
        description:
          "Measuring a quantum system in a particular basis collapses it to an eigenstate. Measuring in a different basis randomizes the result \u2014 information is destroyed.",
        statisticalTools: [
          { name: "Conditional Probability P(A|B)", desc: "The probability of A given B has occurred. In quantum mechanics, measurement outcome probabilities are conditioned on the chosen measurement basis." },
          { name: "Bayes' Theorem & State Update", desc: "Describes how to update beliefs given new evidence. Quantum measurement is a non-classical analog: the state itself changes, not just our knowledge." },
          { name: "Joint Probability Distributions", desc: "The probability of multiple events occurring together. Non-commuting quantum observables don't have well-defined joint distributions." },
          { name: "Marginal Distributions", desc: "Obtained by summing/integrating a joint distribution over one variable. Used when focusing on one observable while ignoring another." },
          { name: "Independence vs Incompatibility", desc: "Classical independence means P(A\u2229B) = P(A)P(B). Quantum incompatibility is stronger: no joint distribution exists at all." },
          { name: "Markov Chains", desc: "Stochastic processes where the future depends only on the present. Sequential quantum measurements form a quantum Markov chain." },
          { name: "Projection Operators", desc: "Mathematical objects that extract components of a state vector. Measurement is modeled as applying a projection operator to the state." },
          { name: "Stochastic Processes", desc: "Collections of random variables indexed by time. Sequences of quantum measurements generate stochastic trajectories." },
          { name: "Transition Matrices", desc: "Matrices whose entries are transition probabilities between states. Connect different measurement bases in quantum mechanics." },
          { name: "Information Loss", desc: "Quantum measurement is irreversible \u2014 the pre-measurement state cannot be recovered. Analogous to lossy data compression." },
        ],
        keyEquations: [
          "P(z_2{=}\\!\\uparrow \\mid x\\text{ measured}) = \\tfrac{1}{2}",
          "\\hat{P} = \\ket{n}\\!\\bra{n}",
          "\\ket{\\psi'} = \\frac{\\hat{P}\\ket{\\psi}}{\\|\\hat{P}\\ket{\\psi}\\|}",
        ],
        conceptSummary:
          "Compare a classical coin under a cup with a quantum coin. See how an intermediate X-measurement destroys Z-information.",
      },
      {
        id: "amplitudes",
        title: "Probability Amplitudes",
        description:
          "Unlike classical probabilities that add, quantum amplitudes are complex numbers that interfere. Two paths to the same outcome can cancel or reinforce.",
        statisticalTools: [
          { name: "Complex Numbers & Polar Form", desc: "Amplitudes are complex: A = |A|e^{i\u03C6}. Magnitude gives probability contribution, phase determines interference." },
          { name: "Constructive Interference", desc: "When two amplitudes have similar phases, they add up to a larger total amplitude, increasing the probability." },
          { name: "Destructive Interference", desc: "When two amplitudes have opposite phases, they cancel partially or fully, reducing the probability \u2014 even to zero." },
          { name: "Amplitude Addition Rule", desc: "For indistinguishable paths: add amplitudes first, then square. This is the fundamental difference from classical probability." },
          { name: "Cross Terms (Interference)", desc: "|A\u2081+A\u2082|\u00B2 = |A\u2081|\u00B2 + |A\u2082|\u00B2 + 2Re(A\u2081*A\u2082). The cross term is the quantum interference, absent classically." },
          { name: "Phasor Diagrams", desc: "Visual representation of complex amplitudes as rotating arrows. The resultant arrow's length squared gives the probability." },
          { name: "Double-Slit Distribution", desc: "The probability pattern from two slits shows interference fringes \u2014 bright and dark bands \u2014 that cannot be explained classically." },
          { name: "Ensemble Averaging", desc: "Averaging over many identically prepared systems. Individual results are random, but the ensemble reveals the interference pattern." },
          { name: "Correlation Functions", desc: "Measure how outcomes at different positions/times relate. G\u00B2 correlation reveals quantum statistics (bunching/antibunching)." },
          { name: "Visibility / Fringe Contrast", desc: "Quantifies how pronounced interference fringes are: V = (I_max - I_min)/(I_max + I_min). Perfect coherence gives V=1." },
        ],
        keyEquations: [
          "P = |A_1 + A_2|^2 \\neq |A_1|^2 + |A_2|^2",
          "A = |A|\\,e^{i\\varphi}",
          "\\text{Interference:}\\; 2\\,\\text{Re}(A_1^* A_2)",
        ],
        conceptSummary:
          "Toggle between classical (add probabilities) and quantum (add amplitudes) to see interference fringes emerge.",
      },
    ],
  },
  {
    id: "q2",
    num: "Q2",
    title: "Spin & Stern-Gerlach",
    description:
      "The Stern-Gerlach experiment reveals that angular momentum is quantized. Sequential measurements in different bases demonstrate the heart of quantum measurement theory.",
    color: "#ec4899",
    icon: "\u{1F9F2}",
    shortDesc: "Spin measurements",
    sections: [
      {
        id: "single-sg",
        title: "Single SG Apparatus",
        description:
          "A beam of silver atoms passes through an inhomogeneous magnetic field and splits into exactly two beams \u2014 spin up and spin down.",
        statisticalTools: [
          { name: "Bernoulli Random Variable", desc: "Takes value 1 (spin up) or 0 (spin down) with probabilities p and 1-p. Each SG measurement is a Bernoulli trial." },
          { name: "Binomial Distribution B(n,p)", desc: "Counts the number of spin-up results in n measurements. Mean = np, variance = np(1-p)." },
          { name: "Maximum Likelihood Estimation", desc: "The MLE of the spin-up probability is the observed fraction of spin-up outcomes. Converges to the true probability." },
          { name: "Confidence Intervals", desc: "A range of values likely to contain the true parameter. For spin-up probability: p\u0302 \u00B1 z\u221A(p\u0302(1-p\u0302)/n)." },
          { name: "Hypothesis Testing", desc: "Test H\u2080: p = 0.5 (unpolarized beam) against alternatives. The SG experiment rejects this for polarized inputs." },
          { name: "Chi-Squared Goodness-of-Fit", desc: "Tests whether observed frequencies match theoretical predictions. Used to verify Born rule predictions from SG experiments." },
          { name: "Standard Error", desc: "SE = \u221A(p(1-p)/n). Measures the precision of the estimated spin-up probability. Decreases as \u221An." },
          { name: "Central Limit Theorem", desc: "The sample mean of spin measurements is approximately normal for large n, regardless of the underlying Bernoulli distribution." },
          { name: "Normal Approximation", desc: "For large n, B(n,p) \u2248 N(np, np(1-p)). Enables z-tests on spin measurement data." },
          { name: "Point Estimation", desc: "Using sample data to estimate a population parameter. The sample proportion p\u0302 = k/n estimates the true spin-up probability." },
        ],
        keyEquations: [
          "P(\\!\\uparrow) = \\cos^2\\!\\frac{\\theta}{2},\\quad P(\\!\\downarrow) = \\sin^2\\!\\frac{\\theta}{2}",
          "\\langle S_z \\rangle = \\frac{\\hbar}{2}\\cos\\theta",
          "\\text{Var}(S_z) = \\frac{\\hbar^2}{4}\\sin^2\\!\\theta",
        ],
        conceptSummary:
          "Send particles through a single SG apparatus. Rotate the field angle and watch the split probabilities change according to cos\u00B2(\u03B8/2).",
      },
      {
        id: "sequential-sg",
        title: "Sequential SG Experiments",
        description:
          "Chain multiple SG apparatuses. Filtering spin-up in Z, then measuring X, then Z again gives 50/50 \u2014 the X measurement erased the Z information.",
        statisticalTools: [
          { name: "Conditional Probability Chains", desc: "P(C|A) = \u03A3 P(C|B)P(B|A). The total probability through intermediate measurements uses chain rule decomposition." },
          { name: "Law of Total Probability", desc: "P(A) = \u03A3 P(A|B\u1D62)P(B\u1D62). Summing over all possible intermediate outcomes gives the total outcome probability." },
          { name: "Bayesian Updating", desc: "After observing a measurement outcome, update the state (posterior) using the projection postulate. Quantum analog of Bayes' rule." },
          { name: "Markov Property", desc: "Future measurement outcomes depend only on the current state, not the history of how that state was prepared." },
          { name: "Transition Probability Matrices", desc: "T\u1D62\u2C7C = |<i|j>|\u00B2. Matrix of probabilities for transitioning between eigenstates of different measurement bases." },
          { name: "Joint & Marginal Distributions", desc: "Joint distribution of sequential measurement outcomes. Marginalizing over intermediate results changes the final statistics." },
          { name: "Statistical Independence Tests", desc: "Sequential measurements in the same basis are correlated (deterministic). In different bases, outcomes appear independent." },
          { name: "Mutual Information", desc: "I(X;Y) measures how much knowing one measurement tells about another. Zero for incompatible observables after intermediate measurement." },
          { name: "Data Processing Inequality", desc: "Information about the initial state can only decrease through a chain of measurements: I(initial;final) \u2264 I(initial;intermediate)." },
          { name: "Sequential Analysis", desc: "Statistical methods for data that arrives in sequence. Each SG measurement provides incremental information about the spin state." },
        ],
        keyEquations: [
          "P(z_2{=}\\!\\uparrow \\mid z_1{=}\\!\\uparrow,\\, x\\text{ measured}) = \\frac{1}{2}",
          "\\ket{+z} = \\frac{1}{\\sqrt{2}}(\\ket{+x} + \\ket{-x})",
          "P(A{\\cap}B{\\cap}C) = P(A)\\,P(B|A)\\,P(C|A{\\cap}B)",
        ],
        conceptSummary:
          "Build chains of SG filters and see how information flows and is destroyed through measurement sequences.",
      },
      {
        id: "spin-expectation",
        title: "Expectation Values & Uncertainty",
        description:
          "The expectation value gives the average spin. The variance reveals irreducible quantum uncertainty \u2014 not measurement error.",
        statisticalTools: [
          { name: "Expectation Value E[X]", desc: "The average outcome weighted by probability. In QM: \u27E8A\u27E9 = \u27E8\u03C8|A|\u03C8\u27E9. Computed from the state vector and operator." },
          { name: "Variance Var(X)", desc: "Var(X) = E[X\u00B2] - E[X]\u00B2. Measures the spread of measurement outcomes. Non-zero even for pure quantum states." },
          { name: "Standard Deviation \u03C3", desc: "Square root of variance. Gives the \u0394 in uncertainty relations: \u0394A = \u221AVar(A)." },
          { name: "Covariance Cov(X,Y)", desc: "Measures how two variables vary together. For non-commuting observables, covariance is related to the commutator." },
          { name: "Uncertainty Relations", desc: "\u0394A\u00B7\u0394B \u2265 |\u27E8[A,B]\u27E9|/2. A fundamental lower bound on the product of uncertainties of incompatible observables." },
          { name: "Chebyshev's Inequality", desc: "P(|X-\u03BC| \u2265 k\u03C3) \u2264 1/k\u00B2. Bounds how far measurements can deviate from the mean, valid for any distribution." },
          { name: "Moment Generating Functions", desc: "M(t) = E[e^{tX}]. Encodes all moments of a distribution. Related to the characteristic function of the quantum state." },
          { name: "Higher Moments", desc: "Skewness (\u03B3\u2081) and kurtosis (\u03B3\u2082) describe asymmetry and tail weight of the measurement outcome distribution." },
          { name: "Propagation of Uncertainty", desc: "How uncertainties in input variables propagate through functions: \u0394f \u2248 |df/dx|\u0394x. Applied to computed quantum quantities." },
          { name: "Error Analysis", desc: "Systematic study of measurement uncertainties. Distinguishes quantum uncertainty (fundamental) from experimental error (reducible)." },
          { name: "Robertson Uncertainty Relation", desc: "The generalized form: \u03C3\u2090\u03C3\u2091 \u2265 |\u27E8[A,B]\u27E9|/2. Tighter than Heisenberg's original for specific states." },
        ],
        keyEquations: [
          "\\langle A \\rangle = \\bra{\\psi} A \\ket{\\psi}",
          "\\Delta A \\cdot \\Delta B \\geq \\frac{|\\langle [A,B] \\rangle|}{2}",
          "\\Delta S_x \\cdot \\Delta S_z \\geq \\frac{\\hbar}{2}|\\langle S_y \\rangle|",
        ],
        conceptSummary:
          "Visualize how expectation values and variances of spin components are constrained by the uncertainty relation.",
      },
    ],
  },
  {
    id: "q3",
    num: "Q3",
    title: "Wavefunctions & Uncertainty",
    description:
      "Wavefunctions are probability amplitude fields in space. The Heisenberg uncertainty principle emerges from the Fourier relationship between position and momentum.",
    color: "#14b8a6",
    icon: "\u{1F30A}",
    shortDesc: "Wavefunctions & Heisenberg",
    sections: [
      {
        id: "particle-in-box",
        title: "Particle in a Box",
        description:
          "A particle confined between two walls. Energy is quantized, and the probability density shows standing wave patterns with n\u22121 nodes.",
        statisticalTools: [
          { name: "Probability Density Function (PDF)", desc: "|\u03C8(x)|\u00B2 gives the probability per unit length of finding the particle at position x. Must integrate to 1 over the box." },
          { name: "Cumulative Distribution Function", desc: "P(x \u2264 a) = \u222B\u2080\u1D43 |\u03C8(x)|\u00B2dx. The probability of finding the particle in the range [0, a]." },
          { name: "Normalization of PDFs", desc: "\u222B|\u03C8|\u00B2dx = 1. The total probability of finding the particle somewhere in the box must be 1." },
          { name: "Position Expectation \u27E8x\u27E9", desc: "The average position: \u27E8x\u27E9 = \u222B x|\u03C8(x)|\u00B2dx. For symmetric wavefunctions, this equals L/2 (center of box)." },
          { name: "Momentum Expectation \u27E8p\u27E9", desc: "\u27E8p\u27E9 = \u222B \u03C8*(x)(-i\u0127 d/dx)\u03C8(x)dx. Zero for real wavefunctions (particle equally likely moving left or right)." },
          { name: "Position Variance \u0394x\u00B2", desc: "Measures the spread of the position distribution. Depends on the quantum number n and decreases for higher energy states." },
          { name: "Momentum Variance \u0394p\u00B2", desc: "Increases with quantum number n. Together with \u0394x, always satisfies \u0394x\u0394p \u2265 \u0127/2." },
          { name: "Quantile Functions", desc: "The inverse CDF: finds the position x where the particle has a given cumulative probability. Useful for median position." },
          { name: "Mode, Median, Mean", desc: "For ground state: mode (most likely position) = L/2 = mean = median. For excited states these diverge." },
          { name: "Superposition of Distributions", desc: "A superposition \u03C8 = c\u2081\u03C8\u2081 + c\u2082\u03C8\u2082 gives a distribution with interference terms, not a simple mixture." },
          { name: "Orthogonality", desc: "\u222B\u03C8\u2098*(x)\u03C8\u2099(x)dx = \u03B4\u2098\u2099. Energy eigenstates are statistically independent \u2014 zero overlap integral." },
        ],
        keyEquations: [
          "\\psi_n(x) = \\sqrt{\\frac{2}{L}}\\sin\\!\\left(\\frac{n\\pi x}{L}\\right)",
          "E_n = \\frac{n^2 \\pi^2 \\hbar^2}{2mL^2}",
          "P(a \\leq x \\leq b) = \\int_a^b |\\psi(x)|^2\\,dx",
        ],
        conceptSummary:
          "Select energy levels and see the probability density. Superpose states and watch interference patterns form.",
      },
      {
        id: "wavepackets",
        title: "Gaussian Wavepackets",
        description:
          "A Gaussian wavepacket is the minimum-uncertainty state. Narrowing it in position space widens it in momentum space and vice versa.",
        statisticalTools: [
          { name: "Gaussian (Normal) Distribution", desc: "N(\u03BC, \u03C3\u00B2): the bell curve. The Gaussian wavepacket has |\u03C8(x)|\u00B2 that is exactly Gaussian in both position and momentum space." },
          { name: "Standard Normal & Z-Scores", desc: "Z = (x-\u03BC)/\u03C3. Standardizing positions in terms of the wavepacket width makes the uncertainty principle dimensionless." },
          { name: "Fourier Transform Pairs", desc: "Position and momentum wavefunctions are Fourier transforms of each other. Narrow in one domain means wide in the other." },
          { name: "Convolution Theorem", desc: "Convolution in position space equals multiplication in momentum space. Governs how wavepackets spread over time." },
          { name: "Characteristic Function", desc: "The Fourier transform of the PDF. For Gaussians, the characteristic function is also Gaussian \u2014 a unique self-dual property." },
          { name: "Moment Generating Function", desc: "M(t) = E[e^{tX}] = exp(\u03BCt + \u03C3\u00B2t\u00B2/2) for Gaussians. All moments derived by differentiation." },
          { name: "Width-Bandwidth Product", desc: "\u03C3\u2093\u00B7\u03C3\u2096 \u2265 1/2. The Gaussian achieves equality \u2014 it is the minimum uncertainty state." },
          { name: "Time-Frequency Uncertainty", desc: "The same math applies to time-energy: \u0394E\u0394t \u2265 \u0127/2. Short-lived states have broad energy distributions." },
          { name: "Gaussian Integrals", desc: "\u222Bexp(-ax\u00B2)dx = \u221A(\u03C0/a). The fundamental integral underlying all Gaussian wavepacket calculations." },
          { name: "Error Function erf(x)", desc: "erf(x) = (2/\u221A\u03C0)\u222B\u2080\u02E3 exp(-t\u00B2)dt. Gives the CDF of the Gaussian distribution. Used for probability-in-region calculations." },
          { name: "Wigner Distribution", desc: "A quasi-probability distribution in phase space (x,p). Can be negative \u2014 a signature of quantum behavior." },
          { name: "Marginal Distributions", desc: "Integrating the Wigner function over p gives |\u03C8(x)|\u00B2; over x gives |\u03C6(p)|\u00B2. Consistent marginals from a quasi-distribution." },
        ],
        keyEquations: [
          "\\psi(x) = \\left(\\frac{1}{2\\pi\\sigma^2}\\right)^{\\!1/4} e^{-x^2/4\\sigma^2 + ik_0 x}",
          "\\phi(k) = \\left(\\frac{1}{2\\pi\\sigma_k^2}\\right)^{\\!1/4} e^{-(k-k_0)^2/4\\sigma_k^2}",
          "\\sigma_x \\cdot \\sigma_k = \\frac{1}{2}",
        ],
        conceptSummary:
          "Squeeze a Gaussian in position space and watch it spread in momentum space. See the minimum uncertainty product in action.",
      },
      {
        id: "uncertainty",
        title: "Heisenberg Uncertainty Principle",
        description:
          "\u0394x\u0394p \u2265 \u0127/2 is not about measurement disturbance \u2014 it's a fundamental property of conjugate distributions connected by Fourier transforms.",
        statisticalTools: [
          { name: "Product of Standard Deviations", desc: "\u0394x\u00B7\u0394p is always bounded below. This is a mathematical theorem about Fourier-conjugate distributions, not a limitation of apparatus." },
          { name: "Fourier Uncertainty Principle", desc: "Any function and its Fourier transform cannot both be sharply peaked. This pure math result IS the Heisenberg principle." },
          { name: "Cauchy-Schwarz Inequality", desc: "|\u27E8f|g\u27E9|\u00B2 \u2264 \u27E8f|f\u27E9\u27E8g|g\u27E9. The mathematical backbone of all uncertainty relations in quantum mechanics." },
          { name: "Robertson-Schr\u00F6dinger Relation", desc: "The tightest general uncertainty relation, includes both the commutator and anticommutator of the observables." },
          { name: "Entropic Uncertainty Relations", desc: "H(X) + H(P) \u2265 log(\u03C0e\u0127). Uncertainty expressed via Shannon entropy rather than standard deviation. Basis-independent." },
          { name: "Fisher Information", desc: "I(\u03B8) = E[(d/d\u03B8 log f)\u00B2]. Measures how much information a measurement carries about a parameter. Connects to quantum metrology." },
          { name: "Cram\u00E9r-Rao Bound", desc: "Var(\u03B8\u0302) \u2265 1/I(\u03B8). The minimum variance of any unbiased estimator. Quantum version sets ultimate measurement precision." },
          { name: "Bandwidth Theorem", desc: "\u0394t\u00B7\u0394\u03C9 \u2265 1/2 in signal processing. Mathematically identical to the Heisenberg principle \u2014 both are Fourier theorems." },
          { name: "Squeezed States", desc: "States where one variable has uncertainty below the vacuum level at the cost of increased uncertainty in the conjugate. Used in gravitational wave detection." },
          { name: "Minimum Uncertainty States", desc: "States that saturate the uncertainty bound: \u0394x\u0394p = \u0127/2. Only Gaussian wavepackets achieve this." },
          { name: "Trade-off Curves", desc: "Plotting \u0394x vs \u0394p for various states shows all allowed points lie above the hyperbola \u0394x\u0394p = \u0127/2." },
        ],
        keyEquations: [
          "\\Delta x \\cdot \\Delta p \\geq \\frac{\\hbar}{2}",
          "\\Delta E \\cdot \\Delta t \\geq \\frac{\\hbar}{2}",
          "\\sigma_A \\sigma_B \\geq \\frac{|\\langle [A,B] \\rangle|}{2}",
        ],
        conceptSummary:
          "Tune wavefunctions and watch position and momentum uncertainties trade off, always respecting the \u0127/2 bound.",
      },
    ],
  },
  {
    id: "q4",
    num: "Q4",
    title: "Quantum Tunneling",
    description: "Particles can penetrate classically forbidden barriers. This purely quantum effect explains alpha decay, scanning tunneling microscopes, and nuclear fusion in stars.",
    color: "#f97316",
    icon: "\u{1F6A7}",
    shortDesc: "Barrier penetration",
    sections: [
      {
        id: "tunneling",
        title: "Tunneling Through a Barrier",
        description: "A quantum particle encountering a potential barrier has a nonzero probability of appearing on the other side, even when its energy is less than the barrier height.",
        statisticalTools: [
          { name: "Exponential Decay (in barrier)", desc: "Inside the barrier, the wavefunction decays as e^{-\u03BAx} where \u03BA = \u221A(2m(V-E))/\u0127. The decay rate sets the transmission probability." },
          { name: "Transmission Coefficient T", desc: "T = |transmitted amplitude|^2 / |incident amplitude|^2. For a rectangular barrier: T \u2248 e^{-2\u03BAL}. Exponentially sensitive to barrier width L." },
          { name: "Probability Current", desc: "j = (\u0127/2mi)(\u03C8*d\u03C8/dx - \u03C8 d\u03C8*/dx). Conservation of probability current gives T + R = 1." },
          { name: "WKB Approximation", desc: "T \u2248 exp(-2\u222B\u03BA(x)dx) for smoothly varying barriers. Connects quantum tunneling to classical action integrals." },
          { name: "Complex Probability Amplitudes", desc: "Tunneling amplitudes are complex. Phase matters for interference between multiple paths through barriers." },
          { name: "Sensitivity Analysis", desc: "T depends exponentially on barrier parameters. Small changes in V or L cause huge changes in transmission \u2014 ultrasensitive." },
          { name: "Monte Carlo Tunneling Rates", desc: "For complex barriers, compute T by sampling over barrier configurations. Used in chemistry for reaction rates." },
          { name: "Gamow Factor", desc: "The Gamow factor e^{-2G} where G = \u222B\u03BA(r)dr gives nuclear decay rates. Connects tunneling probability to half-life." },
        ],
        keyEquations: [
          "T \\approx e^{-2\\kappa L},\\quad \\kappa = \\frac{\\sqrt{2m(V_0 - E)}}{\\hbar}",
          "T + R = 1",
          "\\psi(x) \\propto e^{-\\kappa x} \\;\\text{inside barrier}",
        ],
        conceptSummary: "Adjust barrier height and width. Watch the wavefunction decay exponentially inside and see what fraction tunnels through.",
      },
      {
        id: "alpha-decay",
        title: "Alpha Decay as Tunneling",
        description: "Alpha particles are trapped inside a nucleus by the nuclear potential. They tunnel through the Coulomb barrier, with half-lives ranging from microseconds to billions of years.",
        statisticalTools: [
          { name: "Radioactive Decay Law", desc: "N(t) = N\u2080 e^{-\u03BBt}. The number of undecayed nuclei decreases exponentially. \u03BB is the decay constant." },
          { name: "Half-Life t\u00BD", desc: "t\u00BD = ln(2)/\u03BB. Time for half the nuclei to decay. Ranges from 10^{-7}s to 10^{17}s depending on the Gamow factor." },
          { name: "Poisson Process", desc: "Nuclear decays are a Poisson process: the number of decays in time t follows Poisson(\u03BBNt). Each decay is independent." },
          { name: "Exponential Distribution", desc: "The time between successive decays follows an exponential distribution with rate \u03BBN. Memoryless property." },
          { name: "Geiger-Nuttall Law", desc: "log(t\u00BD) \u221D 1/\u221AE\u03B1. Empirical law connecting half-life to alpha particle energy. Explained by Gamow's tunneling theory." },
          { name: "Survival Analysis", desc: "The survival function S(t) = e^{-\u03BBt} gives the probability that a nucleus hasn't decayed by time t." },
          { name: "Hazard Rate", desc: "h(t) = \u03BB (constant). The instantaneous rate of decay. Constant hazard = memoryless = exponential distribution." },
          { name: "Maximum Likelihood for \u03BB", desc: "Given observed decay times, MLE gives \u03BB\u0302 = n/\u03A3t\u1D62. The best estimate of the decay rate from data." },
        ],
        keyEquations: [
          "N(t) = N_0\\, e^{-\\lambda t}",
          "t_{1/2} = \\frac{\\ln 2}{\\lambda}",
          "\\lambda \\propto e^{-2G},\\quad G = \\int \\kappa(r)\\,dr",
        ],
        conceptSummary: "Watch nuclei decay via tunneling. Adjust nuclear charge to see how dramatically the half-life changes.",
      },
      {
        id: "resonant-tunneling",
        title: "Resonant Tunneling",
        description: "Two barriers with a well between them create resonance: at specific energies, transmission jumps to 100% even though each barrier alone would reflect most particles.",
        statisticalTools: [
          { name: "Resonance Peaks", desc: "T(E) shows sharp peaks at resonant energies E_n. At these energies, constructive interference in the well creates perfect transmission." },
          { name: "Breit-Wigner Distribution", desc: "Near a resonance: T(E) = \u0393\u00B2/4 / [(E-E_r)\u00B2 + \u0393\u00B2/4]. A Lorentzian peak centered at E_r with width \u0393." },
          { name: "Lorentzian Distribution", desc: "The resonance lineshape is Lorentzian, not Gaussian. Heavy tails, no finite variance. Appears in all resonance phenomena." },
          { name: "Quality Factor Q", desc: "Q = E_r/\u0393. Measures how sharp the resonance is. High Q = narrow peak = long lifetime of the quasi-bound state." },
          { name: "Fabry-P\u00E9rot Analogy", desc: "Resonant tunneling is the quantum analog of an optical Fabry-P\u00E9rot interferometer. Both use constructive interference between multiple reflections." },
          { name: "Transfer Matrix Method", desc: "Multiply 2\u00D72 transfer matrices for each barrier/well segment. The total T comes from the matrix product. Systematic and exact." },
          { name: "Lifetime from Width", desc: "\u03C4 = \u0127/\u0393. The uncertainty relation connects resonance width to quasi-bound state lifetime. Narrow peak = long lifetime." },
        ],
        keyEquations: [
          "T(E) = \\frac{\\Gamma^2/4}{(E - E_r)^2 + \\Gamma^2/4}",
          "Q = \\frac{E_r}{\\Gamma}",
          "\\tau = \\frac{\\hbar}{\\Gamma}",
        ],
        conceptSummary: "Tune the energy and watch transmission spike at resonance. Adjust well width to shift resonant energies.",
      },
    ],
  },
  {
    id: "q5",
    num: "Q5",
    title: "Quantum Harmonic Oscillator",
    description: "The harmonic oscillator is the most important model in physics. Its equally spaced energy levels explain everything from molecular vibrations to quantum field theory.",
    color: "#a855f7",
    icon: "\u{1F4C8}",
    shortDesc: "Quantized vibrations",
    sections: [
      {
        id: "energy-levels",
        title: "Energy Levels & Wavefunctions",
        description: "E_n = (n + 1/2)\u0127\u03C9. Energy levels are perfectly equally spaced. Wavefunctions are Hermite polynomials times a Gaussian envelope.",
        statisticalTools: [
          { name: "Hermite Polynomials", desc: "H_n(x) are orthogonal polynomials that shape the wavefunctions. H_0=1, H_1=2x, H_2=4x\u00B2-2. Number of nodes = n." },
          { name: "Gaussian Envelope", desc: "\u03C8_n \u221D H_n(x)e^{-x\u00B2/2}. The Gaussian ensures normalization. All wavefunctions decay as Gaussians far from the origin." },
          { name: "Orthogonality Relations", desc: "\u222B\u03C8_m*\u03C8_n dx = \u03B4_mn. Different energy eigenstates are orthogonal \u2014 zero overlap. Basis for Fourier-like expansions." },
          { name: "Discrete Uniform Spacing", desc: "\u0394E = \u0127\u03C9 for all transitions. Unlike hydrogen, all gaps are equal. This is unique to the harmonic potential." },
          { name: "Probability Density |ψₙ|²", desc: "For low n: concentrated near the center. For high n: concentrated near the classical turning points. Approaches classical limit." },
          { name: "Nodes and Quantum Numbers", desc: "\u03C8_n has exactly n nodes (zeros). More nodes = more wiggles = higher energy = higher momentum." },
          { name: "Planck Distribution Connection", desc: "A thermal harmonic oscillator has \u27E8n\u27E9 = 1/(e^{\u0127\u03C9/kT}-1). This IS the Planck/Bose-Einstein distribution." },
          { name: "Partition Function (QHO)", desc: "Z = e^{-\u03B2\u0127\u03C9/2}/(1-e^{-\u03B2\u0127\u03C9}). A geometric series. All thermodynamics of vibrations follow from this." },
        ],
        keyEquations: [
          "E_n = \\left(n + \\frac{1}{2}\\right)\\hbar\\omega",
          "\\psi_n(x) = \\frac{1}{\\sqrt{2^n n!}} \\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4} H_n(\\xi)\\, e^{-\\xi^2/2}",
          "\\langle n \\rangle = \\frac{1}{e^{\\hbar\\omega/k_BT} - 1}",
        ],
        conceptSummary: "Click energy levels to see wavefunctions and probability densities. Count nodes and watch the pattern.",
      },
      {
        id: "coherent-states",
        title: "Coherent States",
        description: "Coherent states are the most classical-like quantum states. They are Gaussian wavepackets that oscillate back and forth without spreading — the quantum analog of a classical oscillator.",
        statisticalTools: [
          { name: "Poisson Distribution", desc: "In a coherent state |\u03B1\u27E9, the photon number distribution is Poisson: P(n) = e^{-|\u03B1|\u00B2}|\u03B1|^{2n}/n! with \u27E8n\u27E9 = |\u03B1|\u00B2." },
          { name: "Minimum Uncertainty States", desc: "Coherent states satisfy \u0394x\u0394p = \u0127/2 at all times. They are minimum uncertainty Gaussians that stay minimum uncertainty." },
          { name: "Displacement Operator", desc: "|\u03B1\u27E9 = D(\u03B1)|0\u27E9 where D(\u03B1) = exp(\u03B1a\u2020 - \u03B1*a). Displaces the vacuum state in phase space by \u03B1." },
          { name: "Classical Correspondence", desc: "As |\u03B1| \u2192 \u221E, the coherent state becomes indistinguishable from a classical oscillator. The quantum-classical boundary." },
          { name: "Photon Statistics", desc: "Poisson statistics: \u0394n = \u221A\u27E8n\u27E9. Shot noise level. Coherent laser light follows this exactly." },
          { name: "Phase Space Distribution", desc: "The Wigner function of a coherent state is a Gaussian blob centered at (Re\u03B1, Im\u03B1) in phase space." },
        ],
        keyEquations: [
          "|\\alpha\\rangle = e^{-|\\alpha|^2/2} \\sum_n \\frac{\\alpha^n}{\\sqrt{n!}} |n\\rangle",
          "P(n) = \\frac{e^{-|\\alpha|^2} |\\alpha|^{2n}}{n!}",
          "\\langle x(t) \\rangle = \\sqrt{\\frac{2\\hbar}{m\\omega}}\\,|\\alpha|\\cos(\\omega t - \\phi)",
        ],
        conceptSummary: "Watch a coherent state oscillate like a classical particle. Adjust amplitude and see the Poisson photon distribution.",
      },
      {
        id: "zero-point",
        title: "Zero-Point Energy",
        description: "Even in its ground state (n=0), the oscillator has energy \u0127\u03C9/2. This zero-point energy is a direct consequence of the uncertainty principle.",
        statisticalTools: [
          { name: "Ground State Distribution", desc: "|\u03C8_0(x)|\u00B2 is a Gaussian centered at x=0. The particle is most likely at the equilibrium position but has nonzero spread." },
          { name: "Classical vs Quantum PDF", desc: "Classical: P(x) \u221D 1/v(x), peaks at turning points where the particle is slowest. Quantum ground state: Gaussian, peaks at center. Opposite!" },
          { name: "Uncertainty Principle Origin", desc: "Confining the particle (\u0394x small) requires large \u0394p, which means kinetic energy. Minimizing total energy gives E_0 = \u0127\u03C9/2." },
          { name: "Comparison of Distributions", desc: "For large n, quantum \u2192 classical. The quantum distribution develops more peaks that average to the classical envelope." },
          { name: "Casimir Effect", desc: "Zero-point energy of the electromagnetic field between two plates creates a measurable attractive force. Vacuum fluctuations are real." },
          { name: "Variance of Position", desc: "\u27E8x\u00B2\u27E9_0 = \u0127/(2m\u03C9). The ground state position variance is set by \u0127, m, and \u03C9. Larger for lighter particles." },
        ],
        keyEquations: [
          "E_0 = \\frac{1}{2}\\hbar\\omega",
          "\\psi_0(x) = \\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4} e^{-m\\omega x^2/2\\hbar}",
          "\\Delta x = \\sqrt{\\frac{\\hbar}{2m\\omega}},\\quad \\Delta p = \\sqrt{\\frac{m\\omega\\hbar}{2}}",
        ],
        conceptSummary: "Compare quantum ground state (Gaussian at center) with classical distribution (peaks at edges). Toggle the classical overlay.",
      },
    ],
  },
];

// ─── STATISTICAL PHYSICS ────────────────────────────────────────────

const statisticalPhysics: Chapter[] = [
  {
    id: "s1",
    num: "S1",
    title: "The Boltzmann World",
    description:
      "Energy distributes itself across particles following universal statistical laws. The Boltzmann factor e^{\u2212E/kT} is the most important formula in statistical physics.",
    color: "#f59e0b",
    icon: "\u{1F525}",
    shortDesc: "Thermal distributions",
    sections: [
      {
        id: "maxwell-boltzmann",
        title: "Maxwell-Boltzmann Speed Distribution",
        description:
          "Gas molecules move at different speeds. The MB distribution gives the probability of finding a molecule at a given speed, emerging purely from statistical mechanics.",
        statisticalTools: [
          { name: "Maxwell-Boltzmann Distribution", desc: "f(v) \u221D v\u00B2 exp(-mv\u00B2/2kT). The speed distribution of ideal gas molecules. Derived from assuming random 3D velocities." },
          { name: "Chi Distribution", desc: "Speed from 3D velocity: if v_x, v_y, v_z are Gaussian, then |v| follows a Chi distribution with 3 degrees of freedom." },
          { name: "Chi-Squared Distribution", desc: "Energy E = mv\u00B2/2 follows a Chi-squared distribution with 3 DoF. Connects kinetic energy statistics to speed statistics." },
          { name: "Gamma Distribution", desc: "Generalizes the Chi-squared. The energy distribution in a gas is \u0393(3/2, kT), giving the exponential tail." },
          { name: "Rayleigh Distribution", desc: "The 2D speed distribution. If confined to a plane, molecular speeds follow a Rayleigh distribution instead of MB." },
          { name: "Mean, Most Probable, RMS Speed", desc: "Three characteristic speeds: v_mp = \u221A(2kT/m) < v_mean = \u221A(8kT/\u03C0m) < v_rms = \u221A(3kT/m). Their ordering reflects the distribution's right skew." },
          { name: "Mode vs Mean vs Median", desc: "For right-skewed distributions like MB: mode < median < mean. The peak (most probable speed) is not the average speed." },
          { name: "Moment Calculations", desc: "\u27E8v\u207F\u27E9 = \u222Bv\u207Ff(v)dv. Each moment reveals physical quantities: n=1 (mean speed), n=2 (energy), n=-1 (collision rate)." },
          { name: "Change of Variables", desc: "Transforming f(v)dv to g(E)dE requires the Jacobian |dv/dE|. Connects speed and energy distributions." },
          { name: "Monte Carlo Sampling", desc: "Generate random speeds from the MB distribution by sampling 3 Gaussian velocity components and computing magnitude." },
          { name: "Kernel Density Estimation", desc: "Smooth a histogram of sampled speeds using Gaussian kernels. Reveals the continuous distribution from discrete samples." },
          { name: "Histogram Binning Strategies", desc: "Choosing bin widths affects the visual approximation of the underlying distribution: Sturges, Scott, Freedman-Diaconis rules." },
        ],
        keyEquations: [
          "f(v) = 4\\pi\\left(\\frac{m}{2\\pi k_B T}\\right)^{\\!3/2} v^2\\, e^{-mv^2/2k_B T}",
          "v_{\\text{mp}} = \\sqrt{\\frac{2k_BT}{m}},\\quad v_{\\text{rms}} = \\sqrt{\\frac{3k_BT}{m}}",
          "\\langle E \\rangle = \\tfrac{3}{2}k_B T",
        ],
        conceptSummary:
          "Simulate a gas of particles. Adjust temperature and watch the speed histogram converge to the Maxwell-Boltzmann curve.",
      },
      {
        id: "boltzmann-energy",
        title: "Boltzmann Energy Distribution",
        description:
          "The probability of a system being in a state with energy E is proportional to e^{\u2212E/kT}. This exponential governs an enormous range of phenomena.",
        statisticalTools: [
          { name: "Exponential Distribution", desc: "P(E) \u221D e^{-\u03B2E} for a continuous spectrum. The Boltzmann factor is an exponential distribution in energy with rate \u03B2 = 1/kT." },
          { name: "Boltzmann Factor", desc: "e^{-E/kT}: the relative probability weight of a state with energy E. Higher energy states are exponentially suppressed." },
          { name: "Geometric Distribution", desc: "The discrete analog: for equally spaced energy levels, occupation follows a geometric distribution with ratio e^{-\u03B2\u0394E}." },
          { name: "Canonical Ensemble", desc: "A statistical ensemble at fixed temperature T. The system exchanges energy with a heat bath, and states are weighted by Boltzmann factors." },
          { name: "Gibbs Measure", desc: "P(state i) = e^{-\u03B2E\u1D62}/Z. The probability distribution over microstates in the canonical ensemble." },
          { name: "Importance Sampling", desc: "Sampling states weighted by the Boltzmann factor rather than uniformly. Far more efficient for computing thermal averages." },
          { name: "Metropolis-Hastings Algorithm", desc: "Accept new state with probability min(1, e^{-\u03B2\u0394E}). The foundational Monte Carlo method for sampling Boltzmann distributions." },
          { name: "Detailed Balance", desc: "P(i)W(i\u2192j) = P(j)W(j\u2192i). Ensures the Markov chain converges to the correct equilibrium distribution." },
          { name: "Acceptance-Rejection Sampling", desc: "Generate candidate states uniformly and accept proportionally to the Boltzmann weight. Simpler than Metropolis but less efficient." },
          { name: "Maximum Entropy Distributions", desc: "The Boltzmann distribution maximizes entropy subject to a fixed average energy. It is the least biased distribution consistent with \u27E8E\u27E9." },
          { name: "Lagrange Multipliers", desc: "The temperature 1/kT emerges as the Lagrange multiplier enforcing the energy constraint in the MaxEnt derivation." },
          { name: "Sufficient Statistics", desc: "The sample mean energy \u27E8E\u27E9 is a sufficient statistic for \u03B2. No other information from the data improves the estimate of temperature." },
        ],
        keyEquations: [
          "P(E) \\propto g(E) \\cdot e^{-E/k_B T}",
          "\\langle E \\rangle = -\\frac{\\partial \\ln Z}{\\partial \\beta}",
          "\\beta = \\frac{1}{k_B T}",
        ],
        conceptSummary:
          "Place energy levels and watch thermal populations redistribute as temperature changes. See exponential suppression at high energies.",
      },
      {
        id: "partition-function",
        title: "Partition Functions & Thermodynamics",
        description:
          "The partition function Z is the Rosetta Stone of statistical mechanics \u2014 every thermodynamic quantity is a derivative of ln Z.",
        statisticalTools: [
          { name: "Partition Function (Normalizing Constant)", desc: "Z = \u03A3 e^{-\u03B2E\u1D62}. Ensures probabilities sum to 1. All of thermodynamics is encoded in this single function." },
          { name: "Probability Generating Functions", desc: "G(s) = E[s\u1D30]. For discrete energy levels, Z is a generating function in the variable e^{-\u03B2}." },
          { name: "Cumulant Generating Function", desc: "K(t) = ln M(t). Cumulants (connected moments) give energy fluctuations: K'' = Var(E) = kT\u00B2C\u1D65." },
          { name: "Legendre Transforms", desc: "Switch between thermodynamic potentials: F(T) \u2194 E(S) via Legendre transform. Each potential is natural for different constraints." },
          { name: "Log-Partition Function", desc: "ln Z is the free energy (up to -kT). Its derivatives give all thermodynamic quantities: \u27E8E\u27E9, S, C\u1D65, pressure." },
          { name: "Saddle Point Approximation", desc: "For large N, Z \u2248 e^{-\u03B2F} where F is the free energy minimum. Thermodynamics emerges from the dominant term in a sum." },
          { name: "Free Energy Variational Principle", desc: "F = min\u209A [E - TS]. The equilibrium distribution minimizes the free energy. Equivalent to maximizing entropy at fixed \u27E8E\u27E9." },
          { name: "Thermodynamic Potentials", desc: "F (Helmholtz), G (Gibbs), H (enthalpy), \u03A6 (grand potential). Each is a Legendre transform of the energy, suited to different ensembles." },
          { name: "Response Functions", desc: "Heat capacity C\u1D65 = -T\u2202\u00B2F/\u2202T\u00B2, susceptibility \u03C7 = -\u2202\u00B2F/\u2202h\u00B2. Second derivatives of potentials measure the system's response." },
          { name: "Fluctuation-Dissipation Theorem", desc: "C\u1D65 = \u27E8(\u0394E)\u00B2\u27E9/kT\u00B2. Energy fluctuations (a statistical quantity) equal heat capacity (a thermodynamic quantity)." },
          { name: "Equipartition Theorem", desc: "Each quadratic degree of freedom contributes kT/2 to the average energy. Fails at low T where quantum effects dominate." },
        ],
        keyEquations: [
          "Z = \\sum_i e^{-\\beta E_i}",
          "F = -k_B T \\ln Z",
          "S = k_B\\!\\left(\\ln Z + \\beta\\langle E \\rangle\\right)",
          "C_v = k_B \\beta^2 \\langle (\\Delta E)^2 \\rangle",
        ],
        conceptSummary:
          "Build energy levels and compute Z. Watch all thermodynamic quantities update live as you change temperature.",
      },
    ],
  },
  {
    id: "s2",
    num: "S2",
    title: "Quantum Statistics",
    description:
      "Identical particles follow different statistics based on spin. Fermions obey Pauli exclusion; bosons bunch together. This distinction shapes all of matter.",
    color: "#6366f1",
    icon: "\u{2699}\u{FE0F}",
    shortDesc: "Fermions & bosons",
    sections: [
      {
        id: "fermions-bosons",
        title: "Fermions vs Bosons",
        description:
          "Fermions can't share a quantum state; bosons can pile into the same state. This single rule creates chemistry and lasers.",
        statisticalTools: [
          { name: "Combinatorics: Permutations", desc: "n! ways to arrange n distinguishable objects. For identical particles, we divide by n! \u2014 this is the Gibbs correction." },
          { name: "Combinations C(n,k)", desc: "n!/(k!(n-k)!) ways to choose k items from n. For fermions: C(g, n) ways to place n fermions in g states." },
          { name: "Multinomial Coefficients", desc: "N!/(n\u2081!n\u2082!...n\u2096!) counts arrangements of particles across energy levels. Different for each statistics type." },
          { name: "Stars and Bars Counting", desc: "C(n+g-1, n) ways to place n indistinguishable bosons in g states. The fundamental Bose-Einstein counting formula." },
          { name: "Symmetry Groups", desc: "Bosonic states are symmetric under particle exchange; fermionic states are antisymmetric. This determines which microstates are physically allowed." },
          { name: "Occupation Number Representation", desc: "Specify a state by listing how many particles are in each energy level: {n\u2081, n\u2082, ...}. n\u1D62 \u2264 1 for fermions, unlimited for bosons." },
          { name: "Generating Functions for Counting", desc: "Fermion: \u220F(1+x\u1D62), Boson: \u220F1/(1-x\u1D62). Coefficients give the number of microstates." },
          { name: "Stirling's Approximation", desc: "ln(N!) \u2248 N ln N - N. Essential for computing entropy of large systems. Accuracy improves with N." },
          { name: "Poisson Distribution", desc: "The distribution of boson occupation numbers in the classical limit. Bosons exhibit super-Poissonian fluctuations." },
          { name: "Sub-Poissonian Statistics", desc: "Fermion number fluctuations are smaller than Poisson. The Pauli principle suppresses fluctuations." },
          { name: "Bunching vs Antibunching", desc: "Bosons tend to cluster (bunching); fermions tend to avoid each other (antibunching). Observable in photon correlation experiments." },
        ],
        keyEquations: [
          "\\Omega_{\\text{MB}} = N! \\prod_i \\frac{g_i^{n_i}}{n_i!}",
          "\\Omega_{\\text{BE}} = \\prod_i \\binom{n_i + g_i - 1}{n_i}",
          "\\Omega_{\\text{FD}} = \\prod_i \\binom{g_i}{n_i}",
        ],
        conceptSummary:
          "Place particles into energy levels under MB, FD, and BE rules. See how the microstate count and distributions differ.",
      },
      {
        id: "fermi-dirac",
        title: "Fermi-Dirac Distribution",
        description:
          "At T=0, fermions fill every state up to the Fermi energy. At finite T, the sharp step softens into a sigmoid.",
        statisticalTools: [
          { name: "Fermi-Dirac Distribution", desc: "f(E) = 1/(e^{(E-\u03BC)/kT} + 1). Gives the average occupation of a fermion state at energy E. Always between 0 and 1." },
          { name: "Logistic / Sigmoid Function", desc: "The FD distribution is a logistic sigmoid centered at \u03BC with width ~kT. Same function used in machine learning." },
          { name: "Heaviside Step Function", desc: "At T=0, f(E) = \u03B8(\u03BC-E): a perfect step. All states below \u03BC filled, all above empty." },
          { name: "Chemical Potential \u03BC", desc: "The energy at which occupation is exactly 1/2. At T=0, equals the Fermi energy E_F. Adjusts with temperature." },
          { name: "Sommerfeld Expansion", desc: "Low-T expansion: corrections to T=0 quantities go as (kT/E_F)\u00B2. Explains why metals have small heat capacity." },
          { name: "Density of States g(E)", desc: "g(E) \u221D \u221AE in 3D. The number of available quantum states per unit energy. Shapes all thermodynamic integrals." },
          { name: "Fermi Integrals", desc: "F_n(\u03B7) = \u222B\u2080^\u221E x\u207F/(e^{x-\u03B7}+1)dx. Standard integrals that appear in all Fermi gas calculations." },
          { name: "Low-Temperature Expansions", desc: "At T \u226A T_F, only states near \u03BC contribute. Leading correction is \u221D T\u00B2 for energy, \u221D T for entropy." },
          { name: "Degenerate vs Non-degenerate", desc: "Degenerate: kT \u226A E_F (metals at room T). Non-degenerate: kT \u226B E_F (semiconductors). Very different behavior." },
          { name: "Electron Gas Model", desc: "Free electrons in a metal form a degenerate Fermi gas. Explains electrical conductivity, heat capacity, and magnetic susceptibility." },
          { name: "Fermi Gas Heat Capacity", desc: "C\u1D65 = (\u03C0\u00B2/3)Nk_B(T/T_F). Linear in T, much smaller than the classical 3Nk_B/2. Only electrons near E_F contribute." },
        ],
        keyEquations: [
          "f(E) = \\frac{1}{e^{(E-\\mu)/k_BT} + 1}",
          "\\langle n \\rangle = \\int_0^\\infty g(E)\\,f(E)\\,dE",
          "C_v \\propto T \\;\\text{(Fermi gas at low T)}",
        ],
        conceptSummary:
          "Watch the Fermi-Dirac distribution sharpen into a step function as T\u21920. Adjust chemical potential and temperature interactively.",
      },
      {
        id: "bose-einstein",
        title: "Bose-Einstein Distribution & Condensation",
        description:
          "Bosons pile into the lowest energy state at low temperatures, forming a Bose-Einstein condensate \u2014 a macroscopic quantum state.",
        statisticalTools: [
          { name: "Bose-Einstein Distribution", desc: "f(E) = 1/(e^{(E-\u03BC)/kT} - 1). The minus sign (vs FD's plus) allows unlimited occupation. Diverges as E\u2192\u03BC." },
          { name: "Planck Distribution", desc: "For photons: \u27E8n\u27E9 = 1/(e^{\u0127\u03C9/kT} - 1). Gives blackbody radiation spectrum. \u03BC=0 because photon number isn't conserved." },
          { name: "Polylogarithm Functions", desc: "Li_n(z) = \u03A3 z\u1D4F/k\u207F. Appear in all BE thermodynamic integrals. Li_{3/2}(1) = \u03B6(3/2) sets the critical temperature." },
          { name: "Riemann Zeta Function", desc: "\u03B6(s) = \u03A3 1/k\u02E2. \u03B6(3/2) \u2248 2.612 determines the BEC critical temperature. \u03B6(3) appears in photon energy density." },
          { name: "Critical Temperature", desc: "T_c below which macroscopic occupation of the ground state occurs. A sharp phase transition for large N." },
          { name: "Order Parameters", desc: "The condensate fraction N\u2080/N serves as an order parameter: zero above T_c, nonzero below. Indicates the phase." },
          { name: "Spontaneous Symmetry Breaking", desc: "Below T_c, the condensate picks a definite phase, breaking the U(1) symmetry. Connects to superconductivity and superfluidity." },
          { name: "Occupation Number Fluctuations", desc: "\u27E8(\u0394n)\u00B2\u27E9 = \u27E8n\u27E9(\u27E8n\u27E9+1) for bosons vs \u27E8n\u27E9(1-\u27E8n\u27E9) for fermions. Bosons fluctuate much more." },
          { name: "Grand Canonical Ensemble", desc: "Fixed T and \u03BC (not N). Natural for quantum statistics because particle number can fluctuate between system and reservoir." },
          { name: "Fugacity z = e^{\u03BC/kT}", desc: "Controls the average particle number. z\u21921 signals the onset of BEC. z > 1 is physically forbidden." },
          { name: "Bose Function g_n(z)", desc: "g_n(z) = Li_n(z)/\u0393(n). Standardized integrals for BE thermodynamics. g_{3/2}(1) = \u03B6(3/2) is the critical value." },
          { name: "Condensate Fraction", desc: "N\u2080/N = 1 - (T/T_c)^{3/2} for T < T_c. The macroscopic ground-state occupation grows as temperature drops." },
        ],
        keyEquations: [
          "f(E) = \\frac{1}{e^{(E-\\mu)/k_BT} - 1}",
          "T_c = \\frac{2\\pi\\hbar^2}{mk_B}\\left(\\frac{n}{\\zeta(3/2)}\\right)^{\\!2/3}",
          "\\frac{N_0}{N} = 1 - \\left(\\frac{T}{T_c}\\right)^{\\!3/2}",
        ],
        conceptSummary:
          "Cool a boson gas through the critical temperature and watch macroscopic occupation of the ground state emerge.",
      },
    ],
  },
  {
    id: "s3",
    num: "S3",
    title: "Entropy & Information",
    description:
      "Entropy connects the microscopic to the macroscopic. It's also the foundation of information theory. Boltzmann and Shannon discovered the same formula independently.",
    color: "#10b981",
    icon: "\u{1F500}",
    shortDesc: "Disorder & information",
    sections: [
      {
        id: "microstates",
        title: "Microstates & Macrostates",
        description:
          "A macrostate is what you measure. A microstate is the exact configuration. Entropy counts how many microstates correspond to a macrostate.",
        statisticalTools: [
          { name: "Combinatorics C(N,k)", desc: "The number of ways to choose k items from N. Counts microstates: how many ways can energy quanta be distributed among particles." },
          { name: "Multinomial Distribution", desc: "N!/(n\u2081!n\u2082!...n\u2096!) for distributing N items into k categories. Each distinct arrangement is one microstate." },
          { name: "Stirling's Approximation", desc: "ln(N!) \u2248 N ln N - N. Makes entropy calculations tractable for large N. Accuracy: relative error ~ 1/(12N)." },
          { name: "Microcanonical Ensemble", desc: "All microstates with the same total energy are equally probable. The most fundamental statistical ensemble." },
          { name: "Equal A Priori Probability", desc: "The foundational postulate: every accessible microstate is equally likely. All of statistical mechanics follows from this." },
          { name: "Multiplicity Function \u03A9(E)", desc: "The number of microstates with energy E. Entropy S = k_B ln \u03A9. A sharply peaked function for large systems." },
          { name: "Ergodic Hypothesis", desc: "Time averages equal ensemble averages. Justifies using statistical mechanics: a system visits all microstates over time." },
          { name: "Law of Large Numbers", desc: "For large N, the observed macrostate is overwhelmingly likely to be the most probable one. Fluctuations become negligible." },
          { name: "Typical Sequences", desc: "Most individual microstates are \"typical\" \u2014 they look random and encode the macrostate. Atypical sequences have measure zero." },
          { name: "Asymptotic Equipartition", desc: "For large N, there are ~2^{NH} typical microstates, each with probability ~2^{-NH}. H is the entropy rate." },
          { name: "Random Walk & Diffusion", desc: "Particles performing random walks explore microstates. Diffusion is entropy increasing toward the most probable macrostate." },
          { name: "Central Limit Theorem", desc: "Macroscopic observables are sums of many microscopic contributions. CLT explains why they have Gaussian fluctuations." },
        ],
        keyEquations: [
          "S = k_B \\ln \\Omega",
          "\\Omega = \\frac{N!}{n_1!\\, n_2!\\, \\cdots\\, n_k!}",
          "\\frac{1}{T} = \\frac{\\partial S}{\\partial E}",
        ],
        conceptSummary:
          "Distribute coins into boxes and count configurations. See that the most probable macrostate dominates overwhelmingly for large N.",
      },
      {
        id: "entropy-mixing",
        title: "Entropy of Mixing",
        description:
          "When two gases mix, entropy increases even without energy exchange. Pure combinatorial probability: more arrangements become available.",
        statisticalTools: [
          { name: "Entropy of Mixing Formula", desc: "\u0394S = -Nk_B \u03A3 x\u1D62 ln x\u1D62. Always positive since each x\u1D62 < 1 and ln x\u1D62 < 0. Maximal when all fractions equal." },
          { name: "Gibbs Paradox & Resolution", desc: "Mixing identical gases should give \u0394S=0. Resolved by recognizing identical particles are truly indistinguishable \u2014 the N! correction." },
          { name: "Multinomial Entropy", desc: "S/k_B = ln(N!/(n\u2081!...n\u2096!)) \u2248 -N\u03A3 x\u1D62 ln x\u1D62 via Stirling's. The entropy of a multinomial distribution." },
          { name: "Jensen's Inequality", desc: "E[f(X)] \u2265 f(E[X]) for convex f. Proves that mixing always increases entropy (using the concavity of ln)." },
          { name: "Concavity of Entropy", desc: "S is a concave function of the macrostate. Mixing two systems always gives more entropy than the average of the parts." },
          { name: "Ideal Gas Mixing", desc: "For ideal gases, mixing is purely entropic (no enthalpy change). \u0394G_mix = NkT \u03A3 x\u1D62 ln x\u1D62 < 0 always." },
          { name: "Gibbs Free Energy of Mixing", desc: "\u0394G = \u0394H - T\u0394S. For ideal mixing, \u0394H=0, so \u0394G = -T\u0394S < 0. Mixing is spontaneous." },
          { name: "Chemical Potential", desc: "\u03BC\u1D62 = \u03BC\u1D62\u00B0 + kT ln x\u1D62. The chemical potential decreases upon mixing, driving the process forward until equalized." },
          { name: "Osmotic Pressure", desc: "\u03A0 = nkT/V (dilute limit). Arises from the entropy of mixing. Drives solvent across a semipermeable membrane." },
          { name: "Colligative Properties", desc: "Boiling point elevation, freezing point depression, vapor pressure lowering. All caused by the entropy of mixing with a solute." },
          { name: "Binary Phase Diagrams", desc: "The entropy of mixing determines miscibility gaps and eutectic points in two-component phase diagrams." },
          { name: "Activity Coefficients", desc: "\u03B3\u1D62 corrects for non-ideal mixing: \u03BC\u1D62 = \u03BC\u1D62\u00B0 + kT ln(\u03B3\u1D62x\u1D62). Deviations from ideal mixing entropy." },
        ],
        keyEquations: [
          "\\Delta S_{\\text{mix}} = -Nk_B \\sum_i x_i \\ln x_i",
          "\\Delta G_{\\text{mix}} = Nk_BT \\sum_i x_i \\ln x_i",
          "x_i = N_i / N",
        ],
        conceptSummary:
          "Remove a partition between two gases and watch entropy increase in real time as particles interdiffuse.",
      },
      {
        id: "shannon-entropy",
        title: "Shannon / Gibbs Entropy & Information",
        description:
          "Shannon entropy measures information content. Gibbs entropy in physics is the same formula. This unifies thermodynamics and information theory.",
        statisticalTools: [
          { name: "Shannon Entropy H", desc: "H = -\u03A3 p\u1D62 log\u2082 p\u1D62 (bits). The average surprise of a message. Maximum when all outcomes are equally likely." },
          { name: "Gibbs Entropy S", desc: "S = -k_B \u03A3 p\u1D62 ln p\u1D62. The same formula as Shannon with different units. Connects microscopic probabilities to thermodynamics." },
          { name: "KL Divergence D_KL(P||Q)", desc: "D_KL = \u03A3 p\u1D62 ln(p\u1D62/q\u1D62). Measures how different distribution P is from reference Q. Always \u2265 0, zero iff P=Q." },
          { name: "Cross-Entropy H(P,Q)", desc: "H(P,Q) = -\u03A3 p\u1D62 log q\u1D62. The average bits needed to encode data from P using a code optimized for Q." },
          { name: "Mutual Information I(X;Y)", desc: "I(X;Y) = H(X) - H(X|Y). How much knowing Y reduces uncertainty about X. Zero for independent variables." },
          { name: "Conditional Entropy H(X|Y)", desc: "H(X|Y) = H(X,Y) - H(Y). The remaining uncertainty about X after observing Y. Always \u2264 H(X)." },
          { name: "Joint Entropy H(X,Y)", desc: "H(X,Y) = -\u03A3\u03A3 p(x,y) log p(x,y). Total uncertainty in the joint system. H(X,Y) \u2264 H(X) + H(Y)." },
          { name: "Maximum Entropy Principle", desc: "Among all distributions matching known constraints, choose the one with maximum entropy. Produces Boltzmann, Gaussian, etc." },
          { name: "Data Compression (Source Coding)", desc: "Shannon's source coding theorem: data from source X can be compressed to ~H(X) bits per symbol, no fewer." },
          { name: "Channel Capacity", desc: "C = max I(X;Y) over input distributions. The maximum rate of reliable communication through a noisy channel." },
          { name: "Fisher Information", desc: "I(\u03B8) = E[(d/d\u03B8 ln f)\u00B2]. Quantifies how much a measurement tells about a parameter. Connects to quantum metrology." },
          { name: "Cram\u00E9r-Rao Bound", desc: "Var(\u03B8\u0302) \u2265 1/I(\u03B8). The minimum achievable variance of any unbiased estimator. The quantum version sets ultimate limits." },
          { name: "Boltzmann's H-Theorem", desc: "H(t) = \u03A3 f ln f decreases monotonically. Proves that entropy increases toward equilibrium. The arrow of time." },
          { name: "Landauer's Principle", desc: "Erasing 1 bit of information dissipates at least kT ln 2 of heat. Information is physical." },
          { name: "Maxwell's Demon", desc: "A thought experiment resolved by Landauer's principle: the demon must erase information, which costs entropy. No free lunch." },
        ],
        keyEquations: [
          "H(X) = -\\sum_i p_i \\log_2 p_i \\;\\text{(bits)}",
          "S = -k_B \\sum_i p_i \\ln p_i",
          "D_{KL}(P\\|Q) = \\sum_i p_i \\ln\\!\\frac{p_i}{q_i}",
          "I(X;Y) = H(X) - H(X|Y)",
        ],
        conceptSummary:
          "Adjust a probability distribution and watch Shannon entropy, KL divergence, and mutual information update in real time.",
      },
    ],
  },
  {
    id: "s4",
    num: "S4",
    title: "Random Walks & Diffusion",
    description: "Random walks are the simplest stochastic process and the backbone of diffusion, Brownian motion, financial modeling, and polymer physics.",
    color: "#e11d48",
    icon: "\u{1F9ED}",
    shortDesc: "Stochastic motion",
    sections: [
      {
        id: "1d-walk",
        title: "1D Random Walk",
        description: "At each step, move left or right with equal probability. After N steps, displacement is \u221AN on average \u2014 not N.",
        statisticalTools: [
          { name: "Bernoulli Random Walk", desc: "Each step is +1 or -1 with probability 1/2. The position after N steps is X_N = \u03A3 s_i where s_i are iid Bernoulli(\u00B11)." },
          { name: "Central Limit Theorem", desc: "For large N, X_N/\u221AN \u2192 N(0,1). The displacement distribution converges to a Gaussian regardless of step distribution." },
          { name: "Root Mean Square Displacement", desc: "\u27E8X_N\u00B2\u27E9 = N. RMS displacement grows as \u221AN, not N. This defines diffusive behavior." },
          { name: "Diffusion Coefficient", desc: "D = lim_{t\u2192\u221E} \u27E8X\u00B2\u27E9/2t. Connects the microscopic random walk to the macroscopic diffusion equation." },
          { name: "Return Probability", desc: "In 1D and 2D, a random walk returns to the origin with probability 1. In 3D, only about 34%. P\u00F3lya's recurrence theorem." },
          { name: "Gambler's Ruin", desc: "A random walk with absorbing boundaries. The probability of reaching one boundary before the other is a linear function of starting position." },
          { name: "Martingale Property", desc: "E[X_{n+1}|X_n] = X_n. The expected future position equals the current position. The walk has no drift." },
          { name: "Reflection Principle", desc: "P(max X_k \u2265 a) = 2P(X_N \u2265 a). Relates the maximum of a walk to the endpoint distribution. Used in barrier pricing." },
        ],
        keyEquations: [
          "\\langle X_N^2 \\rangle = N",
          "P(X_N = k) = \\binom{N}{(N+k)/2} \\frac{1}{2^N}",
          "X_N / \\sqrt{N} \\xrightarrow{d} \\mathcal{N}(0,1)",
        ],
        conceptSummary: "Launch multiple 1D walkers and watch their spread grow as \u221AN. The distribution of endpoints converges to a Gaussian.",
      },
      {
        id: "2d-walk",
        title: "2D Random Walk & Brownian Motion",
        description: "In 2D, random walks model Brownian motion of pollen grains, polymer conformations, and animal foraging. The walker always returns to the origin (eventually).",
        statisticalTools: [
          { name: "2D Gaussian Distribution", desc: "After N steps, position (x,y) is approximately N(0,N) in each coordinate independently. The joint distribution is a 2D Gaussian." },
          { name: "Rayleigh Distribution", desc: "The distance from origin R = \u221A(x\u00B2+y\u00B2) follows a Rayleigh distribution. P(R) = R/\u03C3\u00B2 exp(-R\u00B2/2\u03C3\u00B2)." },
          { name: "Brownian Motion (Wiener Process)", desc: "The continuous limit of random walks. B(t) has independent Gaussian increments with variance t. The fundamental stochastic process." },
          { name: "Self-Avoiding Walk", desc: "A random walk that cannot visit the same site twice. Models polymer chains. Much harder to analyze than ordinary walks." },
          { name: "Mean Squared Displacement", desc: "\u27E8R\u00B2\u27E9 = 2dDt for d-dimensional diffusion. The factor of 2d counts the independent directions." },
          { name: "L\u00E9vy Flights", desc: "Random walks with heavy-tailed step distributions. Occasional long jumps. Model animal foraging and anomalous diffusion." },
        ],
        keyEquations: [
          "\\langle R^2 \\rangle = 2dDt",
          "P(\\vec{r}, t) = \\frac{1}{(4\\pi Dt)^{d/2}} e^{-r^2/4Dt}",
          "B(t) - B(s) \\sim \\mathcal{N}(0, t-s)",
        ],
        conceptSummary: "Watch 2D walkers spread from the origin. The \u221AN circle envelope shows the diffusive scaling.",
      },
      {
        id: "diffusion",
        title: "The Diffusion Equation",
        description: "The diffusion equation \u2202c/\u2202t = D\u2207\u00B2c connects the microscopic random walk to macroscopic concentration evolution. Entropy always increases.",
        statisticalTools: [
          { name: "Gaussian Solution", desc: "A delta function initial condition evolves into a Gaussian: c(x,t) = (4\u03C0Dt)^{-1/2} exp(-x\u00B2/4Dt). Width grows as \u221At." },
          { name: "Fick's Laws", desc: "J = -D\u2207c (flux proportional to concentration gradient). \u2202c/\u2202t = D\u2207\u00B2c. Conservation + constitutive = PDE." },
          { name: "Green's Function", desc: "The Gaussian is the Green's function: any initial condition c\u2080(x) evolves as c(x,t) = \u222Bc\u2080(x')G(x-x',t)dx'." },
          { name: "Heat Equation", desc: "Diffusion of heat follows the same equation: \u2202T/\u2202t = \u03B1\u2207\u00B2T. Temperature plays the role of concentration." },
          { name: "Entropy Production", desc: "S(t) = -\u222Bc ln c dx increases monotonically. The diffusion equation is nature's entropy maximizer." },
          { name: "Einstein Relation", desc: "D = k_BT/\u03B3. Connects the diffusion coefficient to temperature and friction. Fluctuation-dissipation in action." },
        ],
        keyEquations: [
          "\\frac{\\partial c}{\\partial t} = D \\nabla^2 c",
          "c(x,t) = \\frac{1}{\\sqrt{4\\pi D t}}\\, e^{-x^2/4Dt}",
          "D = \\frac{k_B T}{\\gamma}",
        ],
        conceptSummary: "Watch a concentration pulse spread over time via diffusion. Adjust D and time to see the Gaussian widen.",
      },
    ],
  },
  {
    id: "s5",
    num: "S5",
    title: "Ising Model & Phase Transitions",
    description: "The 2D Ising model is the simplest system showing a phase transition. Spins on a lattice interact with neighbors, creating competition between order and thermal disorder.",
    color: "#dc2626",
    icon: "\u{1F9F2}",
    shortDesc: "Order vs disorder",
    sections: [
      {
        id: "ising-2d",
        title: "2D Ising Model",
        description: "Spins on a square lattice, each +1 or -1, interact with nearest neighbors. Energy favors alignment. Temperature favors randomness. The battle produces a phase transition.",
        statisticalTools: [
          { name: "Metropolis Algorithm", desc: "Flip a random spin. Accept if \u0394E < 0; otherwise accept with probability e^{-\u0394E/kT}. Converges to the Boltzmann distribution." },
          { name: "Boltzmann Distribution", desc: "P(config) \u221D e^{-E/kT}. At low T, low-energy (ordered) configs dominate. At high T, all configs equally likely." },
          { name: "Magnetization Order Parameter", desc: "M = (1/N)\u03A3s_i. M \u2248 \u00B11 (ordered) below T_c, M \u2248 0 (disordered) above T_c." },
          { name: "Energy Per Site", desc: "E/N = -(J/N)\u03A3s_is_j. Measures the degree of alignment. Low energy = high order." },
          { name: "Detailed Balance", desc: "The Metropolis acceptance rule ensures detailed balance: P(A\u2192B)P(A) = P(B\u2192A)P(B). Guarantees convergence to equilibrium." },
          { name: "Autocorrelation Time", desc: "The number of MC steps before consecutive samples are independent. Diverges near T_c (critical slowing down)." },
          { name: "Finite-Size Effects", desc: "True phase transitions only occur for N\u2192\u221E. Finite systems show rounded transitions. Width scales as N^{-1/\u03BD}." },
          { name: "Onsager Solution", desc: "T_c = 2J/[k_B ln(1+\u221A2)] \u2248 2.269J/k_B. Lars Onsager solved the 2D Ising model exactly in 1944." },
        ],
        keyEquations: [
          "E = -J \\sum_{\\langle i,j \\rangle} s_i s_j",
          "P(\\text{flip}) = \\min(1,\\, e^{-\\Delta E / k_B T})",
          "T_c = \\frac{2J}{k_B \\ln(1 + \\sqrt{2})} \\approx 2.269\\,\\frac{J}{k_B}",
        ],
        conceptSummary: "Run the Metropolis algorithm on a spin lattice. Adjust temperature and watch order emerge below T_c.",
      },
      {
        id: "phase-transition",
        title: "Phase Transition & Critical Temperature",
        description: "At T_c \u2248 2.269 J/k_B, the system transitions from ordered (ferromagnet) to disordered (paramagnet). This is a continuous (second-order) phase transition.",
        statisticalTools: [
          { name: "Order Parameter vs Temperature", desc: "|M|(T) drops continuously to zero at T_c. Below: spontaneous magnetization. Above: zero average magnetization." },
          { name: "Critical Exponents", desc: "Near T_c: M \u221D (T_c-T)^\u03B2 with \u03B2=1/8, C \u221D |T-T_c|^{-\u03B1} with \u03B1=0 (log), \u03C7 \u221D |T-T_c|^{-\u03B3} with \u03B3=7/4." },
          { name: "Universality", desc: "Critical exponents depend only on dimensionality and symmetry, not microscopic details. The Ising universality class." },
          { name: "Susceptibility Divergence", desc: "\u03C7 = \u2202M/\u2202h \u221D |T-T_c|^{-7/4}. The system becomes infinitely responsive to external fields at T_c." },
          { name: "Specific Heat", desc: "C_v = \u2202\u27E8E\u27E9/\u2202T has a logarithmic divergence at T_c. Energy fluctuations are maximal at the transition." },
          { name: "Spontaneous Symmetry Breaking", desc: "Below T_c, the system chooses M > 0 or M < 0, breaking the up-down symmetry. The Hamiltonian is symmetric but the ground state is not." },
          { name: "Fluctuation-Dissipation", desc: "\u03C7 = \u03B2\u27E8(\u0394M)\u00B2\u27E9. Susceptibility (response) equals magnetization fluctuations (spontaneous). A deep connection." },
        ],
        keyEquations: [
          "M \\propto (T_c - T)^{\\beta},\\quad \\beta = \\frac{1}{8}",
          "\\chi \\propto |T - T_c|^{-\\gamma},\\quad \\gamma = \\frac{7}{4}",
          "\\xi \\propto |T - T_c|^{-\\nu},\\quad \\nu = 1",
        ],
        conceptSummary: "Plot magnetization vs temperature and see the phase transition. Compare simulation data to the exact Onsager solution.",
      },
      {
        id: "critical",
        title: "Critical Phenomena & Correlation",
        description: "At T_c, correlations extend to infinity. The system looks the same at every scale \u2014 it's fractal. This scale invariance is the hallmark of criticality.",
        statisticalTools: [
          { name: "Correlation Function C(r)", desc: "C(r) = \u27E8s_0 s_r\u27E9 - \u27E8s\u27E9\u00B2. Measures how much spins at distance r are correlated. Decays exponentially away from T_c." },
          { name: "Correlation Length \u03BE", desc: "C(r) \u221D e^{-r/\u03BE}. \u03BE is the typical size of correlated domains. \u03BE \u2192 \u221E at T_c." },
          { name: "Power-Law Decay at T_c", desc: "Exactly at T_c: C(r) \u221D r^{-(d-2+\u03B7)} with \u03B7=1/4 in 2D. No characteristic length scale \u2014 scale invariance." },
          { name: "Scaling Relations", desc: "Critical exponents are not independent: \u03B1+2\u03B2+\u03B3=2, \u03B3=\u03BD(2-\u03B7), etc. Only 2 are independent." },
          { name: "Renormalization Group", desc: "Wilson's RG explains universality: coarse-graining flows in parameter space converge to fixed points that determine critical exponents." },
          { name: "Finite-Size Scaling", desc: "For system size L: M \u221D L^{-\u03B2/\u03BD} f((T-T_c)L^{1/\u03BD}). Collapses data from different L onto a single curve." },
          { name: "Domain Structure", desc: "Below T_c: large aligned domains. At T_c: domains of all sizes (fractal). Above T_c: no domains, random." },
        ],
        keyEquations: [
          "C(r) \\sim e^{-r/\\xi}\\;\\text{(away from }T_c\\text{)}",
          "C(r) \\sim r^{-(d-2+\\eta)}\\;\\text{(at }T_c\\text{)}",
          "\\xi \\propto |T - T_c|^{-\\nu}",
        ],
        conceptSummary: "Watch correlation length diverge as you approach T_c. See the fractal domain structure emerge at criticality.",
      },
    ],
  },
  {
    id: "s6",
    num: "S6",
    title: "Monte Carlo Methods",
    description: "Monte Carlo methods use random sampling to solve problems that are deterministic in principle. From estimating \u03C0 to simulating quantum systems, randomness is a computational tool.",
    color: "#7c3aed",
    icon: "\u{1F3B2}",
    shortDesc: "Randomness as a tool",
    sections: [
      {
        id: "pi-estimation",
        title: "Estimating \u03C0 with Random Darts",
        description: "Throw darts uniformly at a unit square. The fraction landing inside the inscribed circle approximates \u03C0/4. The simplest Monte Carlo demonstration.",
        statisticalTools: [
          { name: "Uniform Random Sampling", desc: "Draw (x,y) uniformly from [0,1]\u00B2. Each point is equally likely. The foundation of rejection sampling." },
          { name: "Convergence Rate 1/\u221AN", desc: "MC error \u221D 1/\u221AN regardless of dimension. 100\u00D7 more samples gives 10\u00D7 better precision. Slow but dimension-independent." },
          { name: "Acceptance-Rejection Method", desc: "Accept if x\u00B2+y\u00B2 \u2264 1 (inside circle), reject otherwise. Acceptance rate = \u03C0/4. General method for sampling from complex distributions." },
          { name: "Confidence Intervals", desc: "95% CI: \u03C0\u0302 \u00B1 1.96\u221A(p(1-p)/N) where p = accepted/total. Quantifies uncertainty in the estimate." },
          { name: "Variance Reduction", desc: "Stratified sampling, antithetic variables, control variates \u2014 techniques to improve MC precision without more samples." },
          { name: "Law of Large Numbers", desc: "The fraction inside converges to \u03C0/4 almost surely as N\u2192\u221E. Mathematical guarantee that MC works." },
          { name: "Central Limit Theorem", desc: "The MC estimate is approximately Gaussian for large N. Enables error bars and hypothesis tests on MC results." },
        ],
        keyEquations: [
          "\\hat{\\pi} = 4 \\cdot \\frac{\\text{inside circle}}{\\text{total darts}}",
          "\\text{Error} \\propto \\frac{1}{\\sqrt{N}}",
          "P(\\text{inside}) = \\frac{\\pi r^2}{(2r)^2} = \\frac{\\pi}{4}",
        ],
        conceptSummary: "Throw random darts and watch your estimate of \u03C0 converge. See the 1/\u221AN convergence rate in action.",
      },
      {
        id: "integration",
        title: "Monte Carlo Integration",
        description: "Estimate any integral by sampling: \u222Bf(x)dx \u2248 (b-a) \u00D7 average of f at random points. Works in any dimension \u2014 the curse of dimensionality is tamed.",
        statisticalTools: [
          { name: "Sample Mean Estimator", desc: "\u222Bf(x)dx \u2248 (b-a)/N \u03A3f(x_i). The average of f at random points, scaled by the volume. Unbiased estimator." },
          { name: "Variance of Estimator", desc: "Var(\u00CE) = (b-a)\u00B2 Var(f)/N. Higher variance in f means slower convergence. Variance reduction helps." },
          { name: "Importance Sampling", desc: "Sample from g(x) \u221D f(x) instead of uniform. Reduces variance dramatically. Use: \u222B f dx = \u222B (f/g) g dx." },
          { name: "Stratified Sampling", desc: "Divide domain into strata, sample proportionally from each. Guarantees coverage. Reduces variance from O(1/N) to O(1/N\u00B2) for smooth f." },
          { name: "Curse of Dimensionality", desc: "Grid methods need N^d points in d dimensions. MC always needs N points for 1/\u221AN accuracy. MC wins above d \u2248 4-5." },
          { name: "Error Estimation", desc: "Standard error SE = s/\u221AN where s is sample standard deviation. Gives error bars on the integral estimate." },
        ],
        keyEquations: [
          "\\int_a^b f(x)\\,dx \\approx \\frac{b-a}{N} \\sum_{i=1}^N f(x_i)",
          "\\text{SE} = \\frac{s}{\\sqrt{N}}",
          "\\text{Convergence: } O(N^{-1/2}) \\text{ in ANY dimension}",
        ],
        conceptSummary: "Sample random points to estimate the area under a curve. Compare the MC estimate to the exact integral.",
      },
      {
        id: "mcmc",
        title: "Markov Chain Monte Carlo",
        description: "MCMC generates samples from complex distributions by constructing a Markov chain whose stationary distribution is the target. The workhorse of modern Bayesian statistics.",
        statisticalTools: [
          { name: "Metropolis-Hastings Algorithm", desc: "Propose x' from q(x'|x). Accept with probability min(1, p(x')q(x|x')/p(x)q(x'|x)). Converges to target p(x)." },
          { name: "Detailed Balance Condition", desc: "P(x)T(x\u2192x') = P(x')T(x'\u2192x). Ensures the chain converges to the correct stationary distribution." },
          { name: "Burn-In Period", desc: "Initial samples before the chain reaches stationarity. Discard these. Length depends on starting point and mixing rate." },
          { name: "Mixing Time", desc: "How many steps before the chain \u201Cforgets\u201D its starting point. Short mixing = fast convergence. Long mixing = slow, correlated samples." },
          { name: "Acceptance Rate", desc: "Optimal acceptance rate is ~23% for Gaussian proposals in high dimensions (Roberts-Rosenthal). Too high or too low = poor mixing." },
          { name: "Autocorrelation", desc: "Consecutive MCMC samples are correlated. Effective sample size = N/(1+2\u03A3\u03C1_k). Thinning: keep every k-th sample." },
          { name: "Gibbs Sampling", desc: "A special case of MCMC: update each variable from its conditional distribution. Requires knowing conditionals but no tuning." },
          { name: "Convergence Diagnostics", desc: "R\u0302 (Gelman-Rubin), trace plots, effective sample size. Multiple chains starting from different points should converge." },
        ],
        keyEquations: [
          "\\alpha(x \\to x') = \\min\\!\\left(1,\\, \\frac{p(x')\\, q(x|x')}{p(x)\\, q(x'|x)}\\right)",
          "\\pi(x) T(x{\\to}x') = \\pi(x') T(x'{\\to}x)",
          "N_{\\text{eff}} = \\frac{N}{1 + 2\\sum_{k=1}^\\infty \\rho_k}",
        ],
        conceptSummary: "Watch a Metropolis-Hastings chain explore a target distribution. Adjust step size and see how it affects mixing.",
      },
    ],
  },
  {
    id: "s7",
    num: "S7",
    title: "Ideal Gas & Equipartition",
    description:
      "The ideal gas is the cornerstone of statistical physics. PV = NkT connects microscopic particle motion to macroscopic pressure. The equipartition theorem assigns kT/2 of energy to each degree of freedom.",
    color: "#0891b2",
    icon: "\u{1F4A8}",
    shortDesc: "PV = NkT & degrees of freedom",
    sections: [
      {
        id: "ideal-gas-law",
        title: "The Ideal Gas Law",
        description:
          "Pressure is simply the result of countless molecular collisions with the container walls. PV = NkT emerges from averaging over the chaotic motion of all particles.",
        statisticalTools: [
          { name: "Kinetic Theory", desc: "P = (1/3) n m \u27E8v\u00B2\u27E9. Pressure from averaging molecular impacts on the walls. Connects microscopic motion to macroscopic pressure." },
          { name: "Law of Large Numbers", desc: "With ~10\u00B2\u00B3 molecules, fluctuations in P are negligible. The average pressure is essentially exact \u2014 thermodynamics emerges from statistics." },
          { name: "Equation of State", desc: "PV = NkT. The simplest equation of state. Relates pressure, volume, and temperature for non-interacting particles." },
          { name: "Avogadro's Number", desc: "N_A = 6.022\u00D710\u00B2\u00B3. The bridge between molecular (k_B) and molar (R = N_A k_B) descriptions of the same physics." },
          { name: "Pressure Fluctuations", desc: "\u0394P/P ~ 1/\u221AN. With N ~ 10\u00B2\u00B3, fluctuations are ~ 10\u207B\u00B9\u00B2. Pressure is deterministic for all practical purposes." },
          { name: "Root Mean Square Speed", desc: "v_rms = \u221A(3kT/m). Directly from \u27E8mv\u00B2/2\u27E9 = 3kT/2. Faster for lighter molecules and higher temperatures." },
          { name: "Dalton's Law", desc: "Total pressure = sum of partial pressures. Each species contributes independently: P_total = \u03A3 n_i kT." },
          { name: "Boyle's and Charles's Laws", desc: "Special cases of PV = NkT: P \u221D 1/V at fixed T (Boyle), V \u221D T at fixed P (Charles). Historical precursors to the full gas law." },
          { name: "Mean Free Path", desc: "\u03BB = 1/(n\u03C3). Average distance between collisions. At STP: \u03BB \u2248 70 nm for air. Sets the scale for transport phenomena." },
          { name: "Collision Frequency", desc: "f = n\u03C3 v_mean. Number of collisions per unit time. Determines rates of chemical reactions and transport." },
        ],
        keyEquations: [
          "PV = Nk_BT",
          "P = \\frac{1}{3} n m \\langle v^2 \\rangle",
          "\\langle E_{\\text{kin}} \\rangle = \\frac{3}{2} Nk_BT",
        ],
        conceptSummary:
          "Watch gas particles bounce inside a container. Adjust N, T, and V to see pressure change according to PV = NkT.",
      },
      {
        id: "equipartition",
        title: "The Equipartition Theorem",
        description:
          "Each quadratic degree of freedom contributes exactly kT/2 to the average energy. Translations, rotations, vibrations \u2014 each gets its fair share.",
        statisticalTools: [
          { name: "Degrees of Freedom", desc: "Monatomic: 3 translational. Diatomic: 3 translational + 2 rotational (+ 2 vibrational at high T). Each contributes kT/2." },
          { name: "Quadratic Contribution", desc: "For any energy term \u03B1q\u00B2 in the Hamiltonian: \u27E8\u03B1q\u00B2\u27E9 = kT/2. Applies to kinetic (mv\u00B2/2) and potential (kx\u00B2/2) terms alike." },
          { name: "Heat Capacity Prediction", desc: "C_v = (f/2)Nk_B where f = number of active DOF. Monatomic: 3Nk/2. Diatomic: 5Nk/2 (room T)." },
          { name: "Frozen Degrees of Freedom", desc: "Quantum mechanics freezes DOF when kT \u226A \u0127\u03C9. Vibrations freeze first (\u03B8_vib ~ 1000K), then rotations (\u03B8_rot ~ 10K)." },
          { name: "Adiabatic Index \u03B3", desc: "\u03B3 = C_p/C_v = (f+2)/f. Monatomic: 5/3, diatomic: 7/5. Determines speed of sound and adiabatic processes." },
          { name: "Dulong-Petit Law", desc: "C_v = 3Nk_B for solids (6 quadratic DOF per atom: 3 kinetic + 3 potential). Works well at high T but fails at low T." },
          { name: "Classical vs Quantum Regime", desc: "Equipartition is a high-temperature (classical) result. Fails when kT \u226A energy level spacing \u0394E." },
          { name: "Virial Theorem", desc: "For power-law potentials V \u221D r\u207F: \u27E8T\u27E9 = (n/2)\u27E8V\u27E9. Equipartition is the n=2 case." },
        ],
        keyEquations: [
          "\\langle E \\rangle = \\frac{f}{2} Nk_BT",
          "C_v = \\frac{f}{2} Nk_B",
          "\\gamma = \\frac{f+2}{f}",
        ],
        conceptSummary:
          "Switch between monatomic, diatomic, and polyatomic molecules. See how energy distributes equally across all active degrees of freedom.",
      },
      {
        id: "heat-capacity",
        title: "Heat Capacity: Einstein & Debye Models",
        description:
          "Classical theory predicts C_v = 3Nk always. But experiments show C_v vanishes at low T. Einstein and Debye explained this by quantizing vibrations.",
        statisticalTools: [
          { name: "Einstein Model", desc: "All atoms vibrate at the same frequency \u03C9_E. C_v = 3Nk_B (\u03B8_E/T)\u00B2 e^{\u03B8_E/T}/(e^{\u03B8_E/T}-1)\u00B2. Captures the quantum freeze-out." },
          { name: "Debye Model", desc: "Vibration frequencies range from 0 to \u03C9_D (Debye cutoff). C_v \u221D T\u00B3 at low T (Debye T\u00B3 law). More realistic than Einstein." },
          { name: "Einstein Temperature \u03B8_E", desc: "\u03B8_E = \u0127\u03C9_E/k_B. When T \u226A \u03B8_E, vibrations freeze and C_v \u2192 0 exponentially. Typically \u03B8_E ~ 200-400 K for solids." },
          { name: "Debye Temperature \u03B8_D", desc: "\u03B8_D = \u0127\u03C9_D/k_B. The temperature scale separating quantum (T \u226A \u03B8_D) from classical (T \u226B \u03B8_D) behavior." },
          { name: "Debye T\u00B3 Law", desc: "At low T: C_v = (12\u03C0\u2074/5)Nk_B(T/\u03B8_D)\u00B3. Matches experiment beautifully. The cubic power law comes from the phonon density of states." },
          { name: "Phonon Density of States", desc: "g(\u03C9) \u221D \u03C9\u00B2 in the Debye model (3D). This quadratic density of states gives the T\u00B3 low-temperature behavior." },
          { name: "Classical Limit", desc: "For T \u226B \u03B8_D (or \u03B8_E): C_v \u2192 3Nk_B. The Dulong-Petit value. All quantum effects washed out by thermal energy." },
          { name: "Quantum Harmonic Oscillator", desc: "\u27E8E\u27E9 = \u0127\u03C9/(e^{\u0127\u03C9/kT}-1) + \u0127\u03C9/2. The building block of both Einstein and Debye models." },
        ],
        keyEquations: [
          "C_v^{\\text{Ein}} = 3Nk_B \\left(\\frac{\\theta_E}{T}\\right)^{\\!2} \\frac{e^{\\theta_E/T}}{(e^{\\theta_E/T}-1)^2}",
          "C_v^{\\text{Debye}} \\sim \\frac{12\\pi^4}{5} Nk_B \\left(\\frac{T}{\\theta_D}\\right)^{\\!3} \\;(T \\ll \\theta_D)",
          "C_v \\to 3Nk_B \\;\\text{(classical limit)}",
        ],
        conceptSummary:
          "Compare Einstein and Debye heat capacity curves. See how both approach the classical Dulong-Petit limit at high T, but differ at low T.",
      },
    ],
  },
  {
    id: "s8",
    num: "S8",
    title: "Heat Engines & Carnot Cycle",
    description:
      "Heat engines convert thermal energy into work. The Carnot cycle sets the ultimate limit on efficiency. The second law of thermodynamics says entropy always increases.",
    color: "#ea580c",
    icon: "\u{2699}\u{FE0F}",
    shortDesc: "Thermodynamic cycles & efficiency",
    sections: [
      {
        id: "carnot-cycle",
        title: "The Carnot Cycle",
        description:
          "The most efficient possible heat engine uses two isotherms and two adiabats. Sadi Carnot proved that no engine operating between Th and Tc can beat \u03B7 = 1 - Tc/Th.",
        statisticalTools: [
          { name: "Isothermal Process", desc: "At constant T: \u0394E = 0 (ideal gas), so Q = W = NkT ln(V_f/V_i). All heat absorbed becomes work." },
          { name: "Adiabatic Process", desc: "No heat exchange: Q = 0, so \u0394E = -W. Temperature changes as TV^{\u03B3-1} = const. Faster than isothermal." },
          { name: "PV Diagram", desc: "The area enclosed by the cycle in the PV plane equals the net work output. Larger area = more work per cycle." },
          { name: "Carnot Efficiency", desc: "\u03B7 = 1 - T_c/T_h. Depends only on reservoir temperatures. Independent of working substance. The theoretical maximum." },
          { name: "Reversibility", desc: "The Carnot cycle is reversible: run it backward and it becomes a heat pump. Irreversible engines always have \u03B7 < \u03B7_Carnot." },
          { name: "Entropy is a State Function", desc: "\u222E dS = 0 for the Carnot cycle. Q_h/T_h = Q_c/T_c. This is what makes entropy well-defined." },
          { name: "Work = Area in PV Plane", desc: "W = \u222E P dV. The enclosed area of any closed cycle gives the net work. Visualize work as geometric area." },
          { name: "Clausius Inequality", desc: "\u222E \u03B4Q/T \u2264 0, with equality for reversible processes. The mathematical statement of the second law." },
        ],
        keyEquations: [
          "\\eta_{\\text{Carnot}} = 1 - \\frac{T_c}{T_h}",
          "W = Q_h - Q_c = Q_h\\left(1 - \\frac{T_c}{T_h}\\right)",
          "\\frac{Q_h}{T_h} = \\frac{Q_c}{T_c}",
        ],
        conceptSummary:
          "Adjust hot and cold reservoir temperatures and trace the Carnot cycle on a PV diagram. See efficiency change in real time.",
      },
      {
        id: "heat-engine",
        title: "Heat Engine Efficiency",
        description:
          "A heat engine absorbs heat Q_h from a hot reservoir, does work W, and dumps waste heat Q_c to a cold reservoir. Energy conservation: Q_h = W + Q_c.",
        statisticalTools: [
          { name: "First Law (Energy Conservation)", desc: "Q_h = W + Q_c. Energy in = work out + waste heat. No engine can output more work than heat absorbed." },
          { name: "Thermal Efficiency", desc: "\u03B7 = W/Q_h = 1 - Q_c/Q_h. The fraction of absorbed heat converted to work. Always less than 1." },
          { name: "Carnot Bound", desc: "\u03B7 \u2264 1 - T_c/T_h for any engine. Achieving equality requires reversible operation (infinitely slow)." },
          { name: "Coefficient of Performance", desc: "For a heat pump: COP = Q_h/W. For a refrigerator: COP = Q_c/W. Can be greater than 1!" },
          { name: "Entropy Production", desc: "\u0394S_total = Q_c/T_c - Q_h/T_h \u2265 0. Equality only for reversible engines. Real engines always produce entropy." },
          { name: "Kelvin-Planck Statement", desc: "No engine operating in a cycle can convert heat completely into work. Some waste heat Q_c is always required." },
          { name: "Clausius Statement", desc: "Heat cannot spontaneously flow from cold to hot. A refrigerator requires work input." },
          { name: "Endoreversible Engine", desc: "\u03B7 = 1 - \u221A(T_c/T_h) (Curzon-Ahlborn). A more realistic efficiency limit accounting for finite heat transfer rates." },
        ],
        keyEquations: [
          "\\eta = \\frac{W}{Q_h} = 1 - \\frac{Q_c}{Q_h}",
          "\\eta \\leq 1 - \\frac{T_c}{T_h}",
          "\\Delta S_{\\text{total}} = \\frac{Q_c}{T_c} - \\frac{Q_h}{T_h} \\geq 0",
        ],
        conceptSummary:
          "Adjust efficiency and see energy flow through a heat engine. Watch what happens when you try to exceed the Carnot limit.",
      },
      {
        id: "second-law",
        title: "The Second Law & Entropy Increase",
        description:
          "Entropy of an isolated system never decreases. Heat flows from hot to cold, never the reverse. This arrow of time emerges from statistics: there are overwhelmingly more disordered states.",
        statisticalTools: [
          { name: "Clausius Inequality", desc: "\u0394S \u2265 Q/T. For irreversible processes, entropy increases by more than Q/T. Equality only for reversible processes." },
          { name: "Entropy Production Rate", desc: "\u03C3 = dS_total/dt \u2265 0. The rate of entropy production is always non-negative. Zero at equilibrium." },
          { name: "Thermal Equilibrium", desc: "Two systems in thermal contact reach T_a = T_b, maximizing total entropy. dS/dE = 1/T defines temperature." },
          { name: "Statistical Arrow of Time", desc: "Entropy increase is overwhelmingly probable for macroscopic systems. The probability of a decrease ~ e^{-N}. Essentially impossible." },
          { name: "Heat Death", desc: "Maximum entropy state: uniform temperature everywhere. No gradients = no work possible. The ultimate equilibrium." },
          { name: "Gibbs' H-Theorem", desc: "H = \u03A3 p_i ln p_i decreases (entropy increases) until the distribution is Boltzmann. Mathematical proof of equilibration." },
          { name: "Irreversibility", desc: "Real processes always produce entropy: friction, mixing, heat conduction across \u0394T. Reversible processes are idealizations." },
          { name: "Loschmidt Paradox", desc: "How does irreversibility emerge from time-reversible microscopic laws? Resolution: initial conditions break time symmetry." },
        ],
        keyEquations: [
          "\\Delta S_{\\text{total}} \\geq 0",
          "\\Delta S = \\frac{Q_{\\text{cold}}}{T_{\\text{cold}}} - \\frac{Q_{\\text{hot}}}{T_{\\text{hot}}} > 0",
          "\\frac{1}{T} = \\frac{\\partial S}{\\partial E}",
        ],
        conceptSummary:
          "Watch two systems at different temperatures exchange heat. Entropy always increases until equilibrium is reached.",
      },
    ],
  },
  {
    id: "s9",
    num: "S9",
    title: "Free Energy & Phase Equilibria",
    description:
      "Free energy F = E - TS determines equilibrium at fixed temperature. The van der Waals equation captures the liquid-gas transition. Phase diagrams map the states of matter.",
    color: "#059669",
    icon: "\u{1F9EA}",
    shortDesc: "Thermodynamic potentials & phases",
    sections: [
      {
        id: "helmholtz",
        title: "Helmholtz Free Energy",
        description:
          "At constant temperature, nature minimizes the Helmholtz free energy F = E - TS. At low T, energy dominates. At high T, entropy wins.",
        statisticalTools: [
          { name: "Helmholtz Free Energy F", desc: "F = E - TS = -kT ln Z. The natural potential for fixed T and V. Minimum at equilibrium." },
          { name: "Competition: E vs TS", desc: "At low T: F \u2248 E (energy dominates, ordered states win). At high T: F \u2248 -TS (entropy dominates, disordered states win)." },
          { name: "Gibbs Free Energy G", desc: "G = F + PV = H - TS. Natural for fixed T and P (most lab conditions). Phase transitions occur where G is minimized." },
          { name: "Maxwell Relations", desc: "Cross-derivatives of potentials are equal: (\u2202S/\u2202V)_T = (\u2202P/\u2202T)_V, etc. Connect measurable quantities." },
          { name: "Legendre Transforms", desc: "F(T,V) from E(S,V) by replacing S with T. G(T,P) from F(T,V) by replacing V with P. Systematic construction." },
          { name: "Variational Principle", desc: "F is minimized by the Boltzmann distribution. Any other distribution gives F' > F. Proves uniqueness of equilibrium." },
          { name: "Work and Free Energy", desc: "Maximum work extractable at constant T: W_max = -\u0394F. Free energy is \u201Cfree\u201D to do work." },
          { name: "Fluctuation Formula", desc: "F = -kT ln Z. Since Z = \u03A3 e^{-\u03B2E_i}, free energy packages all thermodynamic information." },
        ],
        keyEquations: [
          "F = E - TS = -k_BT \\ln Z",
          "dF = -S\\,dT - P\\,dV",
          "G = F + PV = -k_BT \\ln Z + PV",
        ],
        conceptSummary:
          "Watch E, TS, and F compete as temperature changes. See which dominates and how it determines the equilibrium state.",
      },
      {
        id: "van-der-waals",
        title: "Van der Waals Gas",
        description:
          "Real gases have attractive interactions and finite molecular volume. The van der Waals equation (P + a/V\u00B2)(V - b) = NkT predicts the liquid-gas transition.",
        statisticalTools: [
          { name: "Van der Waals Equation", desc: "(P + a/V\u00B2)(V - b) = NkT. Parameter a: attractive interactions. Parameter b: excluded volume. Reduces to ideal gas when a=b=0." },
          { name: "Critical Point", desc: "T_c = 8a/(27bk), P_c = a/(27b\u00B2), V_c = 3Nb. The point where liquid and gas become indistinguishable." },
          { name: "Reduced Variables", desc: "P* = P/P_c, V* = V/V_c, T* = T/T_c. Law of corresponding states: all VdW gases look the same in reduced variables." },
          { name: "Van der Waals Loop", desc: "Below T_c, the isotherm has an unphysical region where dP/dV > 0. Real system phase-separates instead." },
          { name: "Maxwell Construction", desc: "Replace the loop with a horizontal line at P where equal areas are cut above and below. Gives the true coexistence pressure." },
          { name: "Spinodal and Binodal", desc: "Binodal: coexistence curve (equilibrium boundary). Spinodal: limit of metastability (dP/dV = 0). Between them: metastable." },
          { name: "Lever Rule", desc: "In the two-phase region, the fraction of liquid vs gas is determined by the lever rule on the horizontal tie line." },
          { name: "Virial Expansion", desc: "P = nkT(1 + B_2/V + B_3/V\u00B2 + ...). VdW gives B_2 = b - a/kT. Systematic expansion in density." },
        ],
        keyEquations: [
          "\\left(P + \\frac{a}{V^2}\\right)(V - b) = Nk_BT",
          "T_c = \\frac{8a}{27bk_B},\\quad P_c = \\frac{a}{27b^2}",
          "P^* = \\frac{8T^*}{3V^* - 1} - \\frac{3}{V^{*2}}",
        ],
        conceptSummary:
          "Explore van der Waals isotherms. Below Tc, see the unphysical loop and the Maxwell construction that replaces it.",
      },
      {
        id: "phase-diagram",
        title: "Phase Diagrams",
        description:
          "A phase diagram maps which state of matter (solid, liquid, gas) is stable at each (T, P). Boundaries mark phase transitions; special points mark where phases merge.",
        statisticalTools: [
          { name: "Triple Point", desc: "The unique (T,P) where solid, liquid, and gas coexist simultaneously. For water: 273.16 K, 611.7 Pa. Defines the Kelvin scale." },
          { name: "Critical Point", desc: "The endpoint of the liquid-gas boundary. Above T_c, no distinction between liquid and gas: only a supercritical fluid." },
          { name: "Clausius-Clapeyron Equation", desc: "dP/dT = \u0394H/(T\u0394V). Slope of phase boundaries. Steep for solid-liquid (small \u0394V), gentle for liquid-gas (large \u0394V)." },
          { name: "First-Order Transitions", desc: "Latent heat, discontinuous density change, entropy change. The liquid-gas and solid-liquid lines are first-order." },
          { name: "Second-Order Transitions", desc: "No latent heat, continuous density, but discontinuous heat capacity. The critical point is second-order." },
          { name: "Supercritical Fluid", desc: "Above T_c and P_c: a state with liquid-like density but gas-like viscosity. No phase boundary to cross." },
          { name: "Phase Rule (Gibbs)", desc: "F = C - P + 2. Degrees of freedom F for C components and P phases. At the triple point: F = 0 (fixed)." },
          { name: "Latent Heat", desc: "L = T\u0394S = T(S_gas - S_liquid). Energy absorbed during the phase transition at constant T and P." },
        ],
        keyEquations: [
          "\\frac{dP}{dT} = \\frac{\\Delta H}{T\\,\\Delta V}",
          "F = C - P + 2 \\;\\text{(Gibbs phase rule)}",
          "L = T\\,\\Delta S",
        ],
        conceptSummary:
          "Navigate a PT phase diagram. Move the state point across boundaries and see the phase transition happen.",
      },
    ],
  },
  {
    id: "s10",
    num: "S10",
    title: "Fluctuations & Response",
    description:
      "Thermodynamic quantities fluctuate. These fluctuations are not noise \u2014 they encode response functions. The fluctuation-dissipation theorem unifies spontaneous fluctuations with system response.",
    color: "#7c3aed",
    icon: "\u{1F4CA}",
    shortDesc: "Noise, response & Brownian motion",
    sections: [
      {
        id: "energy-fluctuations",
        title: "Energy Fluctuations & Heat Capacity",
        description:
          "The variance of energy in the canonical ensemble equals kT\u00B2 C_v. Larger systems have relatively smaller fluctuations: \u0394E/E ~ 1/\u221AN.",
        statisticalTools: [
          { name: "Canonical Fluctuations", desc: "\u27E8(\u0394E)\u00B2\u27E9 = kT\u00B2 C_v = -\u2202\u00B2 ln Z/\u2202\u03B2\u00B2. Energy fluctuations directly give heat capacity." },
          { name: "Relative Fluctuations", desc: "\u0394E/\u27E8E\u27E9 ~ 1/\u221AN. For 10\u00B2\u00B3 particles, fluctuations are ~ 10\u207B\u00B9\u00B2. Thermodynamics is exact in the thermodynamic limit." },
          { name: "Gamma Distribution", desc: "For N independent oscillators, total energy E ~ \u0393(N, kT). Approaches Gaussian for large N by CLT." },
          { name: "Central Limit Theorem", desc: "Sum of N independent energies has Gaussian fluctuations. Variance = N \u00D7 single-particle variance. Width ~ \u221AN." },
          { name: "Thermodynamic Limit", desc: "N \u2192 \u221E with N/V fixed. Extensive quantities grow as N, fluctuations as \u221AN. Intensive quantities become sharp." },
          { name: "Specific Heat from Fluctuations", desc: "C_v = \u27E8(\u0394E)\u00B2\u27E9/kT\u00B2. Measuring energy fluctuations = measuring heat capacity. Two routes to the same quantity." },
          { name: "Negative Heat Capacity", desc: "In gravitational systems (stars), C_v < 0. Adding energy makes the system expand and cool. Not extensive systems." },
          { name: "Higher Cumulants", desc: "Third cumulant = skewness. Fourth = kurtosis. Each connects to a higher derivative of ln Z. All vanish relative to N." },
        ],
        keyEquations: [
          "\\langle (\\Delta E)^2 \\rangle = k_BT^2 C_v",
          "\\frac{\\Delta E}{\\langle E \\rangle} \\sim \\frac{1}{\\sqrt{N}}",
          "C_v = -\\frac{\\partial^2 \\ln Z}{\\partial \\beta^2}",
        ],
        conceptSummary:
          "Sample energies from a canonical ensemble. Watch fluctuations shrink as N grows, confirming \u0394E/E ~ 1/\u221AN.",
      },
      {
        id: "fluctuation-dissipation",
        title: "Fluctuation-Dissipation Theorem",
        description:
          "The fluctuation-dissipation theorem says that spontaneous thermal fluctuations (noise) and the system\u2019s response to an external perturbation (dissipation) are two sides of the same coin.",
        statisticalTools: [
          { name: "Magnetic Susceptibility", desc: "\u03C7 = \u2202\u27E8M\u27E9/\u2202h = \u03B2\u27E8(\u0394M)\u00B2\u27E9. Response to a field equals magnetization fluctuations times \u03B2. The FDT." },
          { name: "Compressibility", desc: "\u03BA_T = -V\u207B\u00B9\u2202V/\u2202P = \u27E8(\u0394N)\u00B2\u27E9/(n\u00B2kTV). Density fluctuations give compressibility." },
          { name: "Noise and Dissipation", desc: "Systems that dissipate energy (friction, resistance) also generate noise (Brownian motion, Johnson noise)." },
          { name: "Johnson-Nyquist Noise", desc: "\u27E8V\u00B2\u27E9 = 4k_BTR\u0394f. Voltage noise across a resistor R. Thermal fluctuations drive electrical noise." },
          { name: "Einstein Relation", desc: "D = k_BT/\u03B3. Diffusion (fluctuation) and friction (dissipation) are linked by temperature." },
          { name: "Onsager Reciprocal Relations", desc: "L_ij = L_ji. Cross-transport coefficients are symmetric. A consequence of microscopic time-reversibility." },
          { name: "Green-Kubo Relations", desc: "Transport coefficients from autocorrelation functions: D = \u222B\u27E8v(0)v(t)\u27E9 dt. Fluctuations determine transport." },
          { name: "Linear Response Theory", desc: "\u27E8A(t)\u27E9 = \u27E8A\u27E9_0 + \u222B \u03C7(t-t') F(t') dt'. Response is proportional to perturbation for small forces." },
        ],
        keyEquations: [
          "\\chi = \\beta \\langle (\\Delta M)^2 \\rangle",
          "D = \\frac{k_BT}{\\gamma}",
          "C_v = \\frac{\\langle (\\Delta E)^2 \\rangle}{k_BT^2}",
        ],
        conceptSummary:
          "Measure magnetization fluctuations and susceptibility independently \u2014 then verify they agree via the fluctuation-dissipation theorem.",
      },
      {
        id: "brownian",
        title: "Brownian Motion & Langevin Equation",
        description:
          "A dust grain buffeted by invisible molecules traces a random path. The Langevin equation mdv/dt = -\u03B3v + F_random captures this: friction competes with thermal kicks.",
        statisticalTools: [
          { name: "Langevin Equation", desc: "mdv/dt = -\u03B3v + \u03B7(t). Deterministic friction plus random force. The prototype stochastic differential equation." },
          { name: "Einstein Relation", desc: "D = k_BT/\u03B3. Connects microscopic fluctuations (D) to macroscopic friction (\u03B3). Temperature mediates." },
          { name: "Mean Squared Displacement", desc: "\u27E8r\u00B2(t)\u27E9 = 2dDt for long times. Ballistic (\u221D t\u00B2) at short times, diffusive (\u221D t) at long times. Crossover at t ~ m/\u03B3." },
          { name: "Velocity Autocorrelation", desc: "\u27E8v(0)v(t)\u27E9 = (kT/m)e^{-\u03B3t/m}. Exponential decay with time constant \u03C4 = m/\u03B3." },
          { name: "Stokes Drag", desc: "\u03B3 = 6\u03C0\u03B7R for a sphere of radius R in fluid of viscosity \u03B7. Connects particle size to diffusion." },
          { name: "Ornstein-Uhlenbeck Process", desc: "The velocity of a Brownian particle. Gaussian, stationary, Markov. The most analytically tractable stochastic process." },
          { name: "Euler-Maruyama Method", desc: "x_{n+1} = x_n + a(x_n)\u0394t + b(x_n)\u221A\u0394t \u03BE_n. Numerical integration of stochastic differential equations." },
          { name: "Diffusion Coefficient", desc: "D = lim_{t\u2192\u221E} \u27E8r\u00B2\u27E9/(2dt). Extract D from trajectory data by fitting MSD vs time." },
        ],
        keyEquations: [
          "m\\frac{dv}{dt} = -\\gamma v + \\sqrt{2\\gamma k_BT}\\;\\xi(t)",
          "\\langle r^2(t) \\rangle = 2dDt",
          "D = \\frac{k_BT}{\\gamma}",
        ],
        conceptSummary:
          "Watch a Brownian particle wander through 2D space. Adjust friction and temperature to see how the trajectory and MSD change.",
      },
    ],
  },
];

// ─── CLASSICAL MECHANICS ────────────────────────────────────────────

const classicalMechanics: Chapter[] = [
  {
    id: "c1",
    num: "C1",
    title: "Projectile Motion",
    description:
      "Beyond the ideal parabola — real projectiles experience air drag, wind, and on a rotating Earth, the Coriolis force. Comparing ideal vs realistic trajectories reveals the power and limits of simple models.",
    color: "#E07A5F",
    icon: "🎯",
    shortDesc: "Drag, wind & Coriolis",
    sections: [
      {
        id: "ideal-projectile",
        title: "Ideal Parabolic Trajectory",
        description:
          "In a uniform gravitational field with no air resistance, the trajectory is a perfect parabola. Decomposing motion into independent horizontal and vertical components gives exact analytic solutions.",
        statisticalTools: [
          { name: "Kinematic Equations", desc: "x(t) = v₀ cos θ · t, y(t) = v₀ sin θ · t − ½gt². The foundation of projectile motion — constant velocity horizontally, constant acceleration vertically." },
          { name: "Range Formula", desc: "R = v₀² sin 2θ / g. Maximum range at θ = 45°. Symmetric about 45° — complementary angles give equal range." },
          { name: "Maximum Height", desc: "H = v₀² sin²θ / 2g. Reached at t = v₀ sin θ / g, exactly half the total flight time." },
          { name: "Flight Time", desc: "T = 2v₀ sin θ / g. Time-symmetric trajectory — the ascent and descent mirror each other in the ideal case." },
          { name: "Trajectory Equation", desc: "y(x) = x tan θ − gx²/(2v₀² cos²θ). Eliminates time to give the parabolic path directly." },
          { name: "Galilean Decomposition", desc: "Horizontal and vertical motions are independent. This decomposition is the key insight that makes projectile motion exactly solvable." },
          { name: "Energy Conservation", desc: "½mv² + mgy = const. The projectile trades kinetic for potential energy and back, total mechanical energy is conserved." },
          { name: "Envelope of Trajectories", desc: "The parabola of safety: y = v₀²/2g − gx²/2v₀². No projectile with speed v₀ can reach points beyond this curve." },
          { name: "Impact Velocity", desc: "The speed at impact equals the launch speed (same height). The angle changes but |v| is conserved by energy." },
          { name: "Parametric Curves", desc: "The trajectory (x(t), y(t)) is a parametric curve. Varying the launch angle sweeps out a family of parabolas." },
        ],
        keyEquations: [
          "x(t) = v_0 \\cos\\theta \\cdot t",
          "y(t) = v_0 \\sin\\theta \\cdot t - \\tfrac{1}{2}g t^2",
          "R = \\frac{v_0^2 \\sin 2\\theta}{g}",
        ],
        conceptSummary:
          "Launch a projectile and watch the ideal parabolic trajectory. Vary angle and speed to find maximum range at 45°.",
      },
      {
        id: "drag-effects",
        title: "Air Resistance & Drag",
        description:
          "Real projectiles experience drag proportional to velocity squared. This breaks the parabolic symmetry — the descent is steeper than the ascent, range is reduced, and optimal angle drops below 45°.",
        statisticalTools: [
          { name: "Quadratic Drag Force", desc: "F_drag = −½ρCᴅA|v|v. Proportional to v² and opposing motion. Dominates at high Reynolds number (turbulent flow)." },
          { name: "Drag Coefficient", desc: "Cᴅ depends on shape: ~0.47 for a sphere, ~0.04 for a streamlined body. Dimensionless measure of aerodynamic resistance." },
          { name: "Terminal Velocity", desc: "v_term = √(2mg/ρCᴅA). When drag equals gravity, acceleration ceases. Reached asymptotically during free fall." },
          { name: "Reynolds Number", desc: "Re = ρvL/μ. Determines flow regime: laminar (Re < 2000) vs turbulent (Re > 4000). Most projectiles are turbulent." },
          { name: "Asymmetric Trajectory", desc: "With drag, the descent is steeper than the ascent. The projectile spends more time falling because it has lost kinetic energy." },
          { name: "Optimal Launch Angle", desc: "With drag, the optimal angle drops below 45° (typically 38°–42° for balls). Drag penalizes height more than horizontal distance." },
          { name: "RK4 Integration", desc: "4th-order Runge-Kutta solves the coupled ODEs numerically. Four evaluations per step give O(h⁴) accuracy." },
          { name: "Velocity-Dependent Forces", desc: "When force depends on velocity, the ODE is nonlinear. No closed-form solution exists — numerical methods are essential." },
          { name: "Energy Dissipation", desc: "Drag converts kinetic energy to heat. Total mechanical energy decreases monotonically. Impact speed < launch speed." },
          { name: "Stokes Drag (Linear)", desc: "F = −6πμRv. Valid at low Reynolds number (small, slow objects). Gives exponential velocity decay." },
        ],
        keyEquations: [
          "m\\mathbf{a} = -mg\\,\\hat{y} - \\tfrac{1}{2}\\rho C_D A |\\mathbf{v}|\\,\\mathbf{v}",
          "v_{\\text{term}} = \\sqrt{\\frac{2mg}{\\rho C_D A}}",
          "\\theta_{\\text{opt}} < 45^\\circ \\text{ with drag}",
        ],
        conceptSummary:
          "Toggle drag on/off to compare ideal vs realistic trajectories. See the parabolic symmetry break and range decrease.",
      },
      {
        id: "coriolis-wind",
        title: "Coriolis Effect & Wind",
        description:
          "On a rotating Earth, projectiles deflect sideways — rightward in the northern hemisphere. Add wind and the trajectory becomes a fully 3D problem requiring numerical solution.",
        statisticalTools: [
          { name: "Coriolis Force", desc: "F_Cor = −2m(Ω × v). An inertial force in the rotating frame. Deflects moving objects perpendicular to their velocity." },
          { name: "Earth's Angular Velocity", desc: "Ω = 7.292 × 10⁻⁵ rad/s. One full rotation per sidereal day (23h 56m 4s)." },
          { name: "Latitude Dependence", desc: "Vertical component of Coriolis: 2Ωv sin φ. Maximum at poles (φ = 90°), zero at equator. φ is the latitude." },
          { name: "Foucault Pendulum", desc: "Precesses at rate Ω sin φ. Demonstrates Earth's rotation. The rotation plane appears to turn due to Coriolis force." },
          { name: "Wind Force", desc: "F_wind = ½ρCᴅA|v_rel|v_rel where v_rel = v − v_wind. Drag is relative to the air, not the ground." },
          { name: "Crosswind Deflection", desc: "Side wind causes lateral drift proportional to wind speed and flight time. Critical for long-range projectiles and sports." },
          { name: "Headwind vs Tailwind", desc: "Headwind reduces range (higher relative speed → more drag). Tailwind extends range. Asymmetric effect due to v² drag." },
          { name: "Magnus Effect", desc: "Spinning projectiles experience a lateral force: F ∝ ω × v. Explains curved balls in sports (spin bowling, curveballs)." },
          { name: "Rotating Reference Frames", desc: "In a non-inertial frame, fictitious forces appear: Coriolis (−2mΩ×v) and centrifugal (−mΩ×(Ω×r))." },
          { name: "Eötvös Effect", desc: "Moving east → lighter (centrifugal increases). Moving west → heavier. Measurable correction for precise gravimetry." },
        ],
        keyEquations: [
          "\\mathbf{F}_{\\text{Cor}} = -2m(\\boldsymbol{\\Omega} \\times \\mathbf{v})",
          "\\delta x \\approx \\frac{1}{3}\\Omega \\cos\\phi \\cdot g t^3",
          "\\mathbf{v}_{\\text{rel}} = \\mathbf{v} - \\mathbf{v}_{\\text{wind}}",
        ],
        conceptSummary:
          "Enable Coriolis and wind effects to see the full complexity of real-world projectile motion. Watch the sideways deflection grow with latitude.",
      },
    ],
  },
  {
    id: "c2",
    num: "C2",
    title: "Double Pendulum",
    description:
      "Two pendulums linked end-to-end create one of the simplest systems exhibiting deterministic chaos. Tiny changes in initial conditions lead to wildly different trajectories — the hallmark of sensitive dependence.",
    color: "#8B5CF6",
    icon: "🔗",
    shortDesc: "Chaos & sensitivity",
    sections: [
      {
        id: "pendulum-dynamics",
        title: "Double Pendulum Dynamics",
        description:
          "The double pendulum has two degrees of freedom (θ₁, θ₂) and its equations of motion are derived from the Lagrangian. At small angles it's well-behaved; at large angles, chaos emerges.",
        statisticalTools: [
          { name: "Lagrangian Formulation", desc: "L = T − V. For the double pendulum, T includes coupled kinetic terms and V is the sum of gravitational potential energies." },
          { name: "Euler-Lagrange Equations", desc: "d/dt(∂L/∂θ̇ᵢ) − ∂L/∂θᵢ = 0. Yields two coupled second-order ODEs for θ₁(t) and θ₂(t)." },
          { name: "Generalized Coordinates", desc: "θ₁ and θ₂ are natural generalized coordinates — they describe the configuration completely with no constraints to enforce." },
          { name: "Equations of Motion", desc: "The full EOMs involve (m₁+m₂), m₂, L₁, L₂, and coupling terms m₂L₁L₂cos(θ₁−θ₂). Highly nonlinear." },
          { name: "Small-Angle Approximation", desc: "For small θ, sin θ ≈ θ and cos θ ≈ 1. The EOMs linearize to coupled harmonic oscillators with normal modes." },
          { name: "Energy Conservation", desc: "E = T + V = const (no friction). The total energy is a first integral of motion — a useful check on numerical accuracy." },
          { name: "Kinetic Energy (Coupled)", desc: "T = ½(m₁+m₂)L₁²θ̇₁² + ½m₂L₂²θ̇₂² + m₂L₁L₂θ̇₁θ̇₂cos(θ₁−θ₂). The cross-term couples the two pendulums." },
          { name: "Potential Energy", desc: "V = −(m₁+m₂)gL₁cos θ₁ − m₂gL₂cos θ₂. Measured from the pivot point downward." },
          { name: "Mass Matrix", desc: "The kinetic energy defines a position-dependent mass matrix M(θ). The EOMs become M(θ)θ̈ = f(θ, θ̇)." },
          { name: "Numerical Integration (RK4)", desc: "Convert to 4 first-order ODEs (θ₁, θ₂, ω₁, ω₂) and integrate with 4th-order Runge-Kutta for accuracy." },
        ],
        keyEquations: [
          "L = \\tfrac{1}{2}(m_1{+}m_2)L_1^2\\dot{\\theta}_1^2 + \\tfrac{1}{2}m_2 L_2^2\\dot{\\theta}_2^2 + m_2 L_1 L_2 \\dot{\\theta}_1\\dot{\\theta}_2\\cos(\\theta_1{-}\\theta_2) + (m_1{+}m_2)gL_1\\cos\\theta_1 + m_2 g L_2\\cos\\theta_2",
          "\\frac{d}{dt}\\frac{\\partial L}{\\partial \\dot{\\theta}_i} - \\frac{\\partial L}{\\partial \\theta_i} = 0",
          "E = T + V = \\text{const}",
        ],
        conceptSummary:
          "Watch the double pendulum swing with trailing paths. Adjust masses and lengths to see the transition from regular to chaotic motion.",
      },
      {
        id: "phase-space",
        title: "Phase Space & Poincaré Sections",
        description:
          "Phase space (θ vs θ̇) reveals the structure hidden in chaotic motion. Regular orbits trace closed curves; chaotic orbits fill regions ergodically. Poincaré sections slice through this structure.",
        statisticalTools: [
          { name: "Phase Space", desc: "The space of all possible states (θ₁, θ₂, ω₁, ω₂). The double pendulum lives in a 4D phase space." },
          { name: "Phase Portrait", desc: "A plot of θ vs ω (or θ̇). Trajectories never cross in phase space — the flow is deterministic." },
          { name: "Poincaré Section", desc: "Sample the trajectory each time it crosses a chosen plane (e.g., θ₂ = 0, ω₂ > 0). Regular motion → discrete points; chaos → scattered dots." },
          { name: "Torus Structure", desc: "At low energy, phase-space trajectories lie on 2D tori in the 4D space. Poincaré sections reveal these as closed curves." },
          { name: "KAM Theorem", desc: "Kolmogorov-Arnold-Moser: most invariant tori survive small perturbations. They break up only when the perturbation exceeds a threshold." },
          { name: "Ergodicity", desc: "In chaotic regions, a single trajectory eventually visits every accessible region of phase space. Time averages equal phase-space averages." },
          { name: "Liouville's Theorem", desc: "Phase-space volume is conserved under Hamiltonian flow. A cloud of initial conditions deforms but never shrinks or expands." },
          { name: "Recurrence (Poincaré)", desc: "A bounded Hamiltonian system returns arbitrarily close to its initial state — but the recurrence time can be astronomically long." },
          { name: "Action-Angle Variables", desc: "For integrable systems, the phase space can be parameterized by actions Jᵢ (conserved) and angles φᵢ (evolving linearly in time)." },
          { name: "Stroboscopic Map", desc: "Sample the state at fixed time intervals. For a periodically driven system, this reduces continuous dynamics to a discrete map." },
        ],
        keyEquations: [
          "\\text{Poincar\\'{e} section: } \\theta_2 = 0,\\; \\dot{\\theta}_2 > 0",
          "\\oint \\mathbf{p} \\cdot d\\mathbf{q} = \\text{const (action)}",
          "\\frac{d}{dt}\\rho(\\mathbf{q},\\mathbf{p}) = 0 \\;\\text{(Liouville)}",
        ],
        conceptSummary:
          "View the phase-space trajectory of θ₁ vs ω₁. At low energy see regular loops; at high energy see the chaotic sea fill in.",
      },
      {
        id: "chaos-lyapunov",
        title: "Chaos & Lyapunov Exponents",
        description:
          "Chaos means exponential sensitivity to initial conditions. Two pendulums started with a tiny difference in angle diverge exponentially — the Lyapunov exponent quantifies how fast.",
        statisticalTools: [
          { name: "Sensitive Dependence", desc: "The hallmark of chaos: nearby trajectories separate exponentially. A difference of 0.001° grows to macroscopic divergence." },
          { name: "Lyapunov Exponent", desc: "λ = lim(t→∞) (1/t) ln|δ(t)/δ(0)|. Positive λ means chaos. Measures the average exponential rate of divergence." },
          { name: "Butterfly Effect", desc: "A poetic description of sensitive dependence. Small perturbations get amplified into large-scale unpredictability." },
          { name: "Deterministic Chaos", desc: "The system is fully deterministic (no randomness), yet long-term prediction is impossible because errors grow exponentially." },
          { name: "Prediction Horizon", desc: "t_pred ≈ (1/λ) ln(Δ_tol/δ₀). Beyond this time, the trajectory is effectively unpredictable for a given initial uncertainty δ₀." },
          { name: "Kolmogorov-Sinai Entropy", desc: "h_KS = Σλᵢ (sum over positive Lyapunov exponents). Measures the rate of information production by the chaotic system." },
          { name: "Fractal Dimension", desc: "Strange attractors (in dissipative systems) have non-integer dimension. For the double pendulum (Hamiltonian), the phase space is filled." },
          { name: "Mixing", desc: "Chaotic systems mix phase-space regions like stirring cream into coffee. Any initial region gets stretched and folded throughout the space." },
          { name: "Lyapunov Spectrum", desc: "A system with n degrees of freedom has 2n Lyapunov exponents. For Hamiltonian systems, they come in ±pairs (sum = 0)." },
          { name: "Numerical Divergence Test", desc: "Run two simulations with Δθ = 10⁻³° and plot |Δθ(t)|. Exponential growth on a log plot gives the Lyapunov exponent as the slope." },
        ],
        keyEquations: [
          "|\\delta(t)| \\approx |\\delta_0|\\, e^{\\lambda t}",
          "\\lambda = \\lim_{t\\to\\infty} \\frac{1}{t} \\ln\\frac{|\\delta(t)|}{|\\delta(0)|}",
          "t_{\\text{pred}} \\approx \\frac{1}{\\lambda}\\ln\\frac{\\Delta_{\\text{tol}}}{\\delta_0}",
        ],
        conceptSummary:
          "Run two pendulums side by side with a 0.001° difference. Watch them diverge and estimate the Lyapunov exponent from the divergence rate.",
      },
    ],
  },
  {
    id: "c3",
    num: "C3",
    title: "Central Force Orbits",
    description:
      "The Kepler problem — motion under an inverse-square force — produces ellipses, parabolas, and hyperbolas. Modifying the force law reveals precessing orbits and the deep structure of Bertrand's theorem.",
    color: "#0EA5E9",
    icon: "🪐",
    shortDesc: "Kepler & beyond",
    sections: [
      {
        id: "kepler-orbits",
        title: "Kepler Orbits & Conic Sections",
        description:
          "Under Newtonian gravity (F ∝ 1/r²), bound orbits are ellipses. The eccentricity determines the shape: circles, ellipses, parabolas, or hyperbolas — all conic sections.",
        statisticalTools: [
          { name: "Newton's Law of Gravitation", desc: "F = −GMm/r². The inverse-square law produces closed elliptical orbits — one of nature's remarkable mathematical facts." },
          { name: "Kepler's First Law", desc: "Orbits are conic sections with the force center at one focus. Bound orbits (E < 0) are ellipses." },
          { name: "Kepler's Second Law", desc: "Equal areas in equal times: dA/dt = L/2m = const. A direct consequence of angular momentum conservation." },
          { name: "Kepler's Third Law", desc: "T² ∝ a³. The orbital period squared is proportional to the semi-major axis cubed. T² = 4π²a³/GM." },
          { name: "Orbital Elements", desc: "Six parameters define an orbit: semi-major axis a, eccentricity e, inclination i, argument of periapse ω, longitude of node Ω, true anomaly ν." },
          { name: "Eccentricity", desc: "e = 0 (circle), 0 < e < 1 (ellipse), e = 1 (parabola), e > 1 (hyperbola). Determines the orbit's shape." },
          { name: "Vis-Viva Equation", desc: "v² = GM(2/r − 1/a). Relates speed to position for any point on the orbit. The energy-orbit connection." },
          { name: "Specific Orbital Energy", desc: "ε = −GM/2a. Negative for bound orbits, zero for parabolic escape, positive for hyperbolic trajectories." },
          { name: "Angular Momentum", desc: "L = r × p = mr²θ̇. Conserved for any central force. Determines the orbit's shape and orientation." },
          { name: "Velocity-Verlet Integration", desc: "Symplectic integrator: x(t+dt) = x + v·dt + ½a·dt², v(t+dt) = v + ½(a_old + a_new)·dt. Conserves energy long-term." },
        ],
        keyEquations: [
          "r(\\theta) = \\frac{a(1-e^2)}{1 + e\\cos\\theta}",
          "v^2 = GM\\left(\\frac{2}{r} - \\frac{1}{a}\\right)",
          "T^2 = \\frac{4\\pi^2}{GM}\\,a^3",
        ],
        conceptSummary:
          "Launch an orbiting body and watch it trace an ellipse. Vary initial velocity to see circles, ellipses, parabolas, and hyperbolas.",
      },
      {
        id: "effective-potential",
        title: "Effective Potential & Orbit Classification",
        description:
          "Reducing the 2D orbit problem to 1D radial motion using an effective potential V_eff(r). Energy diagrams classify orbits by their turning points.",
        statisticalTools: [
          { name: "Effective Potential", desc: "V_eff(r) = V(r) + L²/2mr². The centrifugal barrier L²/2mr² prevents the orbiting body from reaching r = 0 (for L ≠ 0)." },
          { name: "Centrifugal Barrier", desc: "L²/2mr² → ∞ as r → 0. Angular momentum creates an effective repulsion at short range, stabilizing orbits." },
          { name: "Turning Points", desc: "Where E = V_eff(r). The radial velocity vanishes — the orbit reaches perihelion (closest) or aphelion (farthest)." },
          { name: "Circular Orbit Condition", desc: "dV_eff/dr = 0 at r = r_c. The radius where centrifugal and gravitational forces exactly balance." },
          { name: "Orbit Stability", desc: "d²V_eff/dr² > 0 at r_c means stable circular orbit. Small perturbations cause radial oscillations (slightly elliptical orbit)." },
          { name: "Energy Diagram", desc: "Plot E and V_eff(r) together. The allowed region is where E ≥ V_eff. The orbit oscillates between the turning points." },
          { name: "Radial Equation", desc: "½mṙ² + V_eff(r) = E. The 2D orbit reduces to 1D radial motion in an effective potential — an enormous simplification." },
          { name: "Apsidal Angle", desc: "The angle swept between successive perihelion passages. For 1/r² force: exactly π (closed orbit). Otherwise the orbit precesses." },
          { name: "Orbit Equation", desc: "u(θ) = 1/r(θ) satisfies the Binet equation: d²u/dθ² + u = −(m/L²)(1/u²)F(1/u)." },
          { name: "Escape Energy", desc: "E ≥ 0 for escape. The minimum velocity to escape from radius r: v_esc = √(2GM/r)." },
        ],
        keyEquations: [
          "V_{\\text{eff}}(r) = -\\frac{GMm}{r} + \\frac{L^2}{2mr^2}",
          "E = \\tfrac{1}{2}m\\dot{r}^2 + V_{\\text{eff}}(r)",
          "v_{\\text{esc}} = \\sqrt{\\frac{2GM}{r}}",
        ],
        conceptSummary:
          "See V_eff(r) plotted alongside the total energy line. Turning points mark perihelion and aphelion. Change L to reshape the potential.",
      },
      {
        id: "force-law-variation",
        title: "Non-Newtonian Force Laws",
        description:
          "What if gravity were not 1/r²? Bertrand's theorem says only 1/r² and r (harmonic) produce closed orbits. Other power laws create fascinating precessing rosette patterns.",
        statisticalTools: [
          { name: "Bertrand's Theorem", desc: "Only F ∝ 1/r² and F ∝ r yield closed orbits for all bound initial conditions. Every other power law produces precession." },
          { name: "Power-Law Forces", desc: "F ∝ 1/rⁿ for general n. n = 2 (gravity), n = 3 (inverse cube — critical case), n = 1 (2D gravity), n = −1 (harmonic)." },
          { name: "Orbital Precession", desc: "For near-circular orbits with F ∝ 1/rⁿ, the apsidal angle is π/√(3−n). Deviations from n = 2 cause the orbit to precess." },
          { name: "Rosette Orbits", desc: "Non-closed orbits trace beautiful rosette patterns. The orbit precesses, and the pattern depends on the force law exponent." },
          { name: "Mercury's Precession", desc: "43 arcsec/century unexplained by Newtonian gravity. General relativity adds an effective 1/r⁴ correction to the potential." },
          { name: "Yukawa Potential", desc: "V(r) = −(k/r)e^{−r/a}. Screened Coulomb potential — arises in nuclear physics and plasma physics. Produces precessing orbits." },
          { name: "Logarithmic Potential", desc: "V(r) = k ln(r). Produces flat rotation curves — relevant to galaxy dynamics and the dark matter problem." },
          { name: "Inverse Cube Force", desc: "F ∝ 1/r³. The critical case — orbits spiral inward or outward. No stable circular orbits exist." },
          { name: "Homogeneity & Virial Theorem", desc: "For F ∝ rⁿ: ⟨T⟩ = (n+1)/2 ⟨V⟩. The virial theorem connects time-averaged kinetic and potential energies." },
          { name: "Laplace-Runge-Lenz Vector", desc: "A = p × L − mkr̂. Conserved only for 1/r² force. Its conservation is why Kepler orbits close — extra symmetry beyond angular momentum." },
        ],
        keyEquations: [
          "\\text{Bertrand: closed orbits only for } F \\propto 1/r^2 \\text{ and } F \\propto r",
          "\\Delta\\phi = \\frac{\\pi}{\\sqrt{3-n}} \\;\\text{(apsidal angle for } F \\propto r^{-n}\\text{)}",
          "\\mathbf{A} = \\mathbf{p} \\times \\mathbf{L} - mk\\hat{\\mathbf{r}}",
        ],
        conceptSummary:
          "Change the force-law exponent and watch orbits precess into rosettes. Only n = 2 and n = −1 give closed paths — Bertrand's theorem in action.",
      },
    ],
  },
  {
    id: "c4",
    num: "C4",
    title: "Rigid Body Rotation",
    description:
      "A spinning rigid body obeys Euler's equations — three coupled nonlinear ODEs for angular velocity. The surprising tennis racket theorem shows that rotation about the intermediate axis is unstable.",
    color: "#D946EF",
    icon: "🎲",
    shortDesc: "Euler's equations & stability",
    sections: [
      {
        id: "euler-equations",
        title: "Euler's Equations of Motion",
        description:
          "In the body-fixed frame, torque-free rotation is governed by Euler's equations. The angular velocity vector traces curves on the energy and angular momentum ellipsoids.",
        statisticalTools: [
          { name: "Euler's Equations", desc: "I₁ω̇₁ = (I₂−I₃)ω₂ω₃, and cyclic permutations. Torque-free rotation in the body frame — nonlinear coupling between axes." },
          { name: "Principal Moments of Inertia", desc: "I₁, I₂, I₃ are the eigenvalues of the inertia tensor. Diagonalizing I gives the body's natural rotation axes." },
          { name: "Inertia Tensor", desc: "Iᵢⱼ = Σm_k(r²δᵢⱼ − xᵢxⱼ). A 3×3 symmetric matrix encoding the mass distribution's resistance to rotation." },
          { name: "Body-Fixed Frame", desc: "A coordinate system that rotates with the body. Euler's equations are simplest here — the inertia tensor is constant." },
          { name: "Angular Momentum Vector", desc: "L = Iω. In the body frame, L precesses (its components change). In the lab frame, L is conserved (torque-free)." },
          { name: "Rotational Kinetic Energy", desc: "T = ½ω·I·ω = ½(I₁ω₁² + I₂ω₂² + I₃ω₃²). Conserved for torque-free rotation — defines the energy ellipsoid." },
          { name: "Euler Angles", desc: "Three angles (φ, θ, ψ) relating body frame to lab frame. Precession (φ̇), nutation (θ̇), and spin (ψ̇)." },
          { name: "Symmetric Top", desc: "I₁ = I₂ ≠ I₃. Euler's equations simplify: ω₃ = const, and ω₁, ω₂ undergo uniform precession about the symmetry axis." },
          { name: "Asymmetric Top", desc: "I₁ ≠ I₂ ≠ I₃. The general case — solutions involve Jacobi elliptic functions. Rich dynamical behavior." },
          { name: "Conservation Laws", desc: "Two conserved quantities: energy T = const and angular momentum magnitude |L| = const. These define two ellipsoids in ω-space." },
        ],
        keyEquations: [
          "I_1\\dot{\\omega}_1 = (I_2 - I_3)\\omega_2 \\omega_3",
          "I_2\\dot{\\omega}_2 = (I_3 - I_1)\\omega_3 \\omega_1",
          "I_3\\dot{\\omega}_3 = (I_1 - I_2)\\omega_1 \\omega_2",
        ],
        conceptSummary:
          "Set the principal moments I₁, I₂, I₃ and initial angular velocity. Watch the 3D body rotate and the angular velocity evolve.",
      },
      {
        id: "polhode",
        title: "Polhode & Energy Ellipsoid",
        description:
          "The angular velocity vector traces a curve (polhode) on the intersection of the energy ellipsoid and the angular momentum sphere. This geometric picture reveals all possible motions.",
        statisticalTools: [
          { name: "Polhode", desc: "The path of ω(t) on the energy ellipsoid in the body frame. Determined by the intersection of the energy and L² surfaces." },
          { name: "Herpolhode", desc: "The path of ω(t) in the lab (space) frame. More complex — the body-fixed polhode is 'rolled' on the invariable plane." },
          { name: "Energy Ellipsoid", desc: "I₁ω₁² + I₂ω₂² + I₃ω₃² = 2T. All states with a given energy lie on this ellipsoid in ω-space." },
          { name: "Angular Momentum Sphere", desc: "I₁²ω₁² + I₂²ω₂² + I₃²ω₃² = L². All states with a given |L| lie on this sphere." },
          { name: "Intersection Curves", desc: "The polhode is the intersection of the energy ellipsoid and L² sphere. Different energy/L ratios give different topology." },
          { name: "Separatrix", desc: "The critical polhode through the unstable (intermediate axis) fixed points. Separates qualitatively different types of motion." },
          { name: "Jacobi Elliptic Functions", desc: "The exact solution of Euler's equations: ω₁(t) = A·cn(Ωt, k), etc. Periodic functions generalizing sin and cos." },
          { name: "Precession Rate", desc: "For a symmetric top (I₁ = I₂): Ω_prec = (I₃ − I₁)ω₃/I₁. The rate at which ω₁, ω₂ rotate around the symmetry axis." },
          { name: "Nutation", desc: "Oscillation of the symmetry axis about the precession direction. The 'wobble' superimposed on steady precession." },
          { name: "Free Precession of Earth", desc: "Earth is an oblate spheroid: Chandler wobble ≈ 433 days. Euler predicted 305 days — the difference is due to Earth's elasticity." },
        ],
        keyEquations: [
          "I_1 \\omega_1^2 + I_2 \\omega_2^2 + I_3 \\omega_3^2 = 2T",
          "I_1^2 \\omega_1^2 + I_2^2 \\omega_2^2 + I_3^2 \\omega_3^2 = L^2",
          "\\Omega_{\\text{prec}} = \\frac{(I_3-I_1)\\omega_3}{I_1}",
        ],
        conceptSummary:
          "Visualize the polhode curve on the energy ellipsoid. See how angular velocity traces closed paths whose topology changes at the separatrix.",
      },
      {
        id: "tennis-racket",
        title: "Tennis Racket Theorem",
        description:
          "Rotation about the axis with the intermediate moment of inertia is unstable. A spinning book or phone flips unexpectedly — the Dzhanibekov effect, proven by the intermediate axis theorem.",
        statisticalTools: [
          { name: "Intermediate Axis Theorem", desc: "For I₁ < I₂ < I₃: rotation about axis 2 is unstable. Small perturbations grow exponentially — the axis flips 180°." },
          { name: "Linear Stability Analysis", desc: "Linearize Euler's equations around steady rotation. Eigenvalues of the Jacobian: real (unstable) for intermediate axis, imaginary (stable) for major/minor." },
          { name: "Dzhanibekov Effect", desc: "A wing nut in zero gravity spontaneously flips while spinning about its intermediate axis. Demonstrated on the ISS — dramatic visual proof." },
          { name: "Fixed Points of Euler's Equations", desc: "Steady rotation about any principal axis (ω along ê₁, ê₂, or ê₃). Two are stable (max/min I), one is unstable (intermediate I)." },
          { name: "Saddle Point Dynamics", desc: "The intermediate axis is a saddle point in phase space. Trajectories approach along one direction and recede along another." },
          { name: "Flip Period", desc: "The time between flips depends on how close the initial condition is to pure intermediate-axis rotation. Closer → longer period." },
          { name: "Phase Portrait", desc: "Plot ω₁ vs ω₂ (or ω₂ vs ω₃) to see the saddle structure. Separatrices divide stable and flipping regions." },
          { name: "Heteroclinic Orbit", desc: "The separatrix connects the two saddle points (±ê₂ rotation). The system approaches one asymptotically but never reaches it." },
          { name: "Energy-Momentum Classification", desc: "The ratio T/L² determines which axes can be rotation axes. The intermediate axis is always a saddle in this ratio." },
          { name: "Real-World Examples", desc: "Spinning phones, tennis rackets, books, T-handles. Any object with three distinct principal moments exhibits this instability." },
        ],
        keyEquations: [
          "I_1 < I_2 < I_3 \\Rightarrow \\hat{e}_2 \\text{ rotation unstable}",
          "\\delta\\omega \\sim e^{\\pm\\gamma t},\\; \\gamma = \\omega_2\\sqrt{\\frac{(I_2-I_1)(I_3-I_2)}{I_1 I_3}}",
          "\\text{Stable: } \\hat{e}_1 \\text{ (max I) and } \\hat{e}_3 \\text{ (min I)}",
        ],
        conceptSummary:
          "Spin the rigid body about each axis. See stable precession for max/min axes and dramatic flipping for the intermediate axis.",
      },
    ],
  },
  {
    id: "c5",
    num: "C5",
    title: "Coupled Oscillators",
    description:
      "Masses connected by springs oscillate in coordinated patterns called normal modes. Each mode vibrates at a single frequency, and any motion is a superposition of these fundamental patterns.",
    color: "#14B8A6",
    icon: "🔔",
    shortDesc: "Normal modes & dispersion",
    sections: [
      {
        id: "normal-modes",
        title: "Normal Modes & Eigenfrequencies",
        description:
          "The normal modes of N coupled oscillators are found by diagonalizing the dynamical matrix. Each mode is a collective motion where all masses oscillate at the same frequency with fixed amplitude ratios.",
        statisticalTools: [
          { name: "Dynamical Matrix", desc: "Kx = ω²Mx, where K is the stiffness matrix and M is the mass matrix. The eigenvalues ω² give normal mode frequencies." },
          { name: "Eigenvalue Problem", desc: "det(K − ω²M) = 0. Solving this characteristic equation yields N normal mode frequencies for N coupled oscillators." },
          { name: "Eigenvectors", desc: "Each eigenvalue ω² has an eigenvector giving the relative amplitudes of each mass in that mode. These are the mode shapes." },
          { name: "Two Coupled Pendulums", desc: "The simplest case: symmetric mode (in-phase, ω₋) and antisymmetric mode (out-of-phase, ω₊). Beat frequency = ω₊ − ω₋." },
          { name: "Beat Phenomenon", desc: "Exciting a single pendulum creates beats: energy oscillates between the two pendulums at the beat frequency Δω = ω₊ − ω₋." },
          { name: "Orthogonality of Modes", desc: "Normal modes are orthogonal with respect to both K and M. Any motion can be decomposed into a unique sum of modes." },
          { name: "Modal Decomposition", desc: "x(t) = Σ Aₙ cos(ωₙt + φₙ) × (mode shape)ₙ. Each normal mode evolves independently — the power of the normal mode basis." },
          { name: "Spring Constant Matrix", desc: "For identical springs k: K is tridiagonal with 2k on diagonal and −k on off-diagonals (fixed endpoints)." },
          { name: "Boundary Conditions", desc: "Fixed endpoints: modes are sin(nπx/L). Free endpoints: modes are cos(nπx/L). The boundary conditions select the allowed modes." },
          { name: "Degeneracy", desc: "When two modes have the same frequency (e.g., due to symmetry), any linear combination is also a normal mode." },
        ],
        keyEquations: [
          "(K - \\omega^2 M)\\mathbf{x} = 0",
          "\\omega_\\pm^2 = \\frac{k}{m} \\pm \\frac{k_c}{m} \\;\\text{(two oscillators)}",
          "\\mathbf{x}(t) = \\sum_n A_n \\cos(\\omega_n t + \\phi_n)\\,\\mathbf{e}_n",
        ],
        conceptSummary:
          "Watch N masses on springs vibrate. Click each normal mode to see it individually, or combine modes to create complex motion.",
      },
      {
        id: "mode-superposition",
        title: "Superposition & Energy Transfer",
        description:
          "Any motion of the coupled system is a superposition of normal modes. Displacing a single mass excites multiple modes, creating beats and energy transfer between masses.",
        statisticalTools: [
          { name: "Principle of Superposition", desc: "For linear systems, the sum of solutions is also a solution. Normal modes form a complete basis for all possible motions." },
          { name: "Fourier Decomposition", desc: "Decompose any initial condition into normal mode amplitudes by projecting onto the mode shapes. The inverse of modal synthesis." },
          { name: "Energy in Each Mode", desc: "Eₙ = ½mωₙ²Aₙ². Each normal mode carries a fixed fraction of the total energy — modes don't exchange energy." },
          { name: "Energy Transfer (Beats)", desc: "When a single mass is displaced, energy sloshes between masses at the beat frequency. This is superposition of modes." },
          { name: "Recurrence Time", desc: "If all ωₙ are commensurate (rational ratios), the motion is periodic. Otherwise, it's quasiperiodic — never exactly repeats." },
          { name: "Initial Condition Decomposition", desc: "Given x(0) and ẋ(0), find mode amplitudes Aₙ and phases φₙ by solving a linear system using mode orthogonality." },
          { name: "Amplitude Modulation", desc: "Superposing two close frequencies creates amplitude modulation (beats). The envelope oscillates at (ω₊ − ω₋)/2." },
          { name: "Phase Velocity", desc: "v_ph = ω/k. The speed at which a single frequency wave crest moves. Different from group velocity for dispersive systems." },
          { name: "Group Velocity", desc: "v_g = dω/dk. The speed at which a wave packet (energy) propagates. Equals phase velocity only for non-dispersive systems." },
          { name: "FFT Spectrum", desc: "Fast Fourier Transform of the motion reveals peaks at the normal mode frequencies. A computational tool for mode identification." },
        ],
        keyEquations: [
          "A_n = \\frac{\\mathbf{e}_n \\cdot M \\cdot \\mathbf{x}(0)}{\\mathbf{e}_n \\cdot M \\cdot \\mathbf{e}_n}",
          "\\Delta\\omega = \\omega_+ - \\omega_- \\;\\text{(beat frequency)}",
          "E_n = \\tfrac{1}{2}m\\omega_n^2 A_n^2",
        ],
        conceptSummary:
          "Displace one mass and watch energy bounce between them. Use sliders to mix normal mode amplitudes and phases.",
      },
      {
        id: "dispersion-relation",
        title: "Dispersion Relation & Continuum Limit",
        description:
          "For a chain of N oscillators, the normal mode frequencies follow a dispersion relation ω(k). As N → ∞, this becomes the dispersion relation of a continuous string or lattice.",
        statisticalTools: [
          { name: "Dispersion Relation", desc: "ω(k) = 2√(k/m)|sin(ka/2)|. For a monatomic chain with spacing a. Relates frequency to wavevector." },
          { name: "Brillouin Zone", desc: "−π/a < k ≤ π/a. The range of distinct wavevectors. Modes outside this zone are aliases of modes inside." },
          { name: "First Brillouin Zone", desc: "Due to the discrete lattice, wavelengths shorter than 2a are indistinguishable from longer ones. k is periodic with period 2π/a." },
          { name: "Acoustic Branch", desc: "ω → 0 as k → 0. Low-frequency modes where adjacent atoms move in phase — sound waves. ω ≈ v_s|k| for small k." },
          { name: "Optical Branch", desc: "Appears in diatomic chains. High-frequency modes where adjacent atoms move out of phase. Gap between acoustic and optical branches." },
          { name: "Speed of Sound", desc: "v_s = dω/dk|_{k=0} = a√(k/m). The slope of the dispersion curve at k = 0 gives the long-wavelength sound speed." },
          { name: "Continuum Limit", desc: "As a → 0 and N → ∞ (with Na = L fixed), the discrete chain becomes a continuous string with wave equation ∂²y/∂t² = c²∂²y/∂x²." },
          { name: "Phonons", desc: "Quantized lattice vibrations. Each normal mode k has energy ℏω(k)(n + ½). The quantum version of classical normal modes." },
          { name: "Density of States", desc: "g(ω) = dN/dω. The number of modes per unit frequency. Diverges at the band edge (Van Hove singularity)." },
          { name: "Band Gap", desc: "Frequency range with no propagating modes. Occurs between acoustic and optical branches in diatomic chains." },
        ],
        keyEquations: [
          "\\omega(k) = 2\\sqrt{\\frac{\\kappa}{m}}\\left|\\sin\\frac{ka}{2}\\right|",
          "v_s = a\\sqrt{\\frac{\\kappa}{m}} \\;\\text{(speed of sound)}",
          "-\\frac{\\pi}{a} < k \\leq \\frac{\\pi}{a} \\;\\text{(Brillouin zone)}",
        ],
        conceptSummary:
          "Increase N from 2 to 20 and watch the dispersion curve ω(k) take shape. See how discrete modes approach the continuous limit.",
      },
    ],
  },
  {
    id: "c6",
    num: "C6",
    title: "Lagrangian Mechanics",
    description:
      "The Lagrangian L = T − V reformulates mechanics in terms of energies and generalized coordinates. It handles constraints naturally and reveals deep connections between symmetries and conservation laws.",
    color: "#F59E0B",
    icon: "📐",
    shortDesc: "Generalized coordinates & constraints",
    sections: [
      {
        id: "atwood-machine",
        title: "Atwood Machine",
        description:
          "Two masses connected by a string over a pulley — a constrained system with one degree of freedom. The Lagrangian approach handles the constraint effortlessly.",
        statisticalTools: [
          { name: "Generalized Coordinates", desc: "Choose one variable q (e.g., the height of mass m₁). The constraint (string length) determines the other mass's position automatically." },
          { name: "Constraint Forces Eliminated", desc: "The Lagrangian method never needs the tension T. It's a constraint force that does no virtual work — eliminated by construction." },
          { name: "Lagrangian", desc: "L = T − V = ½(m₁+m₂)q̇² − (m₁−m₂)gq. A single variable, single equation of motion." },
          { name: "Equation of Motion", desc: "q̈ = (m₁−m₂)g/(m₁+m₂). Uniform acceleration — the Atwood machine 'dilutes' gravity by the factor (m₁−m₂)/(m₁+m₂)." },
          { name: "Effective Mass", desc: "m_eff = m₁ + m₂. Both masses contribute to inertia because the string couples their motion." },
          { name: "Virtual Work Principle", desc: "Constraint forces do no work in virtual displacements consistent with constraints. This is why they drop out of the Lagrangian." },
          { name: "Newtonian Comparison", desc: "The Newtonian approach requires two free-body diagrams and eliminating the tension T. The Lagrangian does it in one equation." },
          { name: "Energy Conservation", desc: "E = ½(m₁+m₂)q̇² + (m₁−m₂)gq = const. Total energy is conserved — the system is conservative." },
          { name: "Generalized Momentum", desc: "p = ∂L/∂q̇ = (m₁+m₂)q̇. The canonical momentum conjugate to q." },
          { name: "D'Alembert's Principle", desc: "Σ(Fᵢ − mᵢaᵢ)·δrᵢ = 0. The bridge between Newton's laws and the Lagrangian formulation." },
        ],
        keyEquations: [
          "L = \\tfrac{1}{2}(m_1+m_2)\\dot{q}^2 - (m_1-m_2)gq",
          "\\ddot{q} = \\frac{(m_1-m_2)}{(m_1+m_2)}\\,g",
          "p = (m_1+m_2)\\dot{q}",
        ],
        conceptSummary:
          "Watch the Atwood machine accelerate. Compare the Lagrangian (one equation) vs Newtonian (two FBDs + tension) approaches side by side.",
      },
      {
        id: "bead-on-hoop",
        title: "Bead on a Rotating Hoop",
        description:
          "A bead slides on a circular hoop rotating about its vertical axis. Above a critical angular velocity, the bottom becomes unstable and the bead rises to a new equilibrium — a pitchfork bifurcation.",
        statisticalTools: [
          { name: "Rotating Frame Lagrangian", desc: "L = ½m(R²θ̇² + R²ω²sin²θ) − mgR(1−cosθ). The hoop's rotation adds a centrifugal potential term." },
          { name: "Effective Potential", desc: "V_eff(θ) = −½mR²ω²sin²θ + mgR(1−cosθ). Competition between gravity (pulls down) and centrifugal force (pushes out)." },
          { name: "Critical Angular Velocity", desc: "ω_c = √(g/R). Below ω_c: one stable equilibrium at θ = 0 (bottom). Above ω_c: bottom becomes unstable, two new equilibria appear." },
          { name: "Pitchfork Bifurcation", desc: "At ω = ω_c, the system undergoes a supercritical pitchfork bifurcation. The single fixed point splits into three (one unstable, two stable)." },
          { name: "Equilibrium Angle", desc: "cos θ_eq = g/(Rω²) for ω > ω_c. The bead rises to an angle that balances gravity against centrifugal force." },
          { name: "Small Oscillation Frequency", desc: "About the stable equilibrium, the bead oscillates at a frequency determined by d²V_eff/dθ² at the equilibrium point." },
          { name: "Equation of Motion", desc: "mR²θ̈ = mRω²sinθ cosθ − mgsinθ. Gravity vs centrifugal force, both modulated by geometry." },
          { name: "Phase Portrait", desc: "Plot θ vs θ̇ for different ω. Below ω_c: a center at θ = 0. Above ω_c: two centers flanking a saddle at θ = 0." },
          { name: "Symmetry Breaking", desc: "Above ω_c, the bead must choose left or right — the Z₂ symmetry θ ↔ −θ is spontaneously broken." },
          { name: "Analogy to Phase Transitions", desc: "Mathematically identical to a second-order phase transition. ω is the control parameter, θ_eq is the order parameter." },
        ],
        keyEquations: [
          "V_{\\text{eff}}(\\theta) = -\\tfrac{1}{2}mR^2\\omega^2\\sin^2\\!\\theta + mgR(1-\\cos\\theta)",
          "\\omega_c = \\sqrt{g/R}",
          "\\cos\\theta_{\\text{eq}} = \\frac{g}{R\\omega^2}\\;(\\omega > \\omega_c)",
        ],
        conceptSummary:
          "Increase the hoop's angular velocity past ω_c and watch the bead rise from the bottom to a new equilibrium. A beautiful bifurcation.",
      },
      {
        id: "sliding-wedge",
        title: "Block on a Sliding Wedge",
        description:
          "A block slides down a frictionless wedge that itself slides on a frictionless surface. Two degrees of freedom, one constraint — the Lagrangian handles this coupled motion elegantly.",
        statisticalTools: [
          { name: "Two Generalized Coordinates", desc: "X (wedge position on table) and s (block position along the wedge slope). Two degrees of freedom for two moving objects." },
          { name: "Coupled Lagrangian", desc: "L includes cross terms because the block's velocity in the lab frame depends on both Ẋ and ṡ. The wedge and block are dynamically coupled." },
          { name: "Constraint: Block on Wedge", desc: "The block stays on the wedge surface — this geometric constraint is automatically satisfied by choosing s as a coordinate." },
          { name: "Momentum Conservation", desc: "No external horizontal force → total horizontal momentum P_x = (M+m)Ẋ + mṡcosα = const. A first integral of the motion." },
          { name: "Reduced Mass", desc: "μ = Mm/(M+m). Appears in the equation of motion for the relative coordinate. The effective mass of the coupled system." },
          { name: "Wedge Acceleration", desc: "The wedge recoils as the block slides down. Heavier wedge (M >> m) → less recoil. Equal masses → significant coupling." },
          { name: "Block Acceleration", desc: "The block's acceleration down the slope depends on both gravity and the wedge's recoil. It's less than g sinα due to the wedge's freedom." },
          { name: "Normal Force (from Lagrange multipliers)", desc: "If needed, add the constraint with a Lagrange multiplier λ to find the normal force N = λ between block and wedge." },
          { name: "Energy Conservation", desc: "E = ½(M+m)Ẋ² + ½m(ṡ² + 2ṡẊcosα) + mgs sinα = const. Total mechanical energy is conserved." },
          { name: "Comparison: Newtonian vs Lagrangian", desc: "Newtonian: 4 equations with N and friction to eliminate. Lagrangian: 2 equations directly. The power of generalized coordinates." },
        ],
        keyEquations: [
          "L = \\tfrac{1}{2}(M+m)\\dot{X}^2 + \\tfrac{1}{2}m\\dot{s}^2 + m\\dot{s}\\dot{X}\\cos\\alpha - mgs\\sin\\alpha",
          "(M+m)\\ddot{X} + m\\ddot{s}\\cos\\alpha = 0",
          "m\\ddot{s} + m\\ddot{X}\\cos\\alpha = mg\\sin\\alpha",
        ],
        conceptSummary:
          "Watch a block slide down a wedge that slides on a table. See momentum conservation as the wedge recoils. Vary the mass ratio.",
      },
    ],
  },
  {
    id: "c7",
    num: "C7",
    title: "Hamiltonian Phase Space",
    description:
      "Hamilton's equations reformulate mechanics in phase space (q, p). The phase portrait reveals fixed points, separatrices, and the topology of motion. Liouville's theorem ensures the phase-space flow is incompressible.",
    color: "#3B82F6",
    icon: "🌀",
    shortDesc: "Phase portraits & Liouville",
    sections: [
      {
        id: "phase-portraits",
        title: "Phase Portraits & Hamilton's Equations",
        description:
          "The Hamiltonian H(q,p) generates time evolution via q̇ = ∂H/∂p and ṗ = −∂H/∂q. Contour lines of H are the trajectories in phase space.",
        statisticalTools: [
          { name: "Hamilton's Equations", desc: "q̇ = ∂H/∂p, ṗ = −∂H/∂q. Two first-order ODEs replacing Newton's single second-order equation. Phase space is the natural setting." },
          { name: "Hamiltonian", desc: "H(q,p) = T + V = p²/2m + V(q). For natural systems, H equals the total energy and is conserved." },
          { name: "Phase Space", desc: "The space of (q, p) pairs. Each point represents a complete state of the system — position AND momentum." },
          { name: "Phase Portrait", desc: "The family of trajectories H(q,p) = E for all E. Contour lines of H form the phase portrait." },
          { name: "Harmonic Oscillator", desc: "H = p²/2m + ½kq². Phase portrait: concentric ellipses centered at origin. All orbits are periodic with the same frequency." },
          { name: "Simple Pendulum", desc: "H = p²/2mL² − mgL cos q. Librational orbits (oscillation) near bottom, rotational orbits (going over top) at high energy." },
          { name: "Morse Potential", desc: "V(q) = D(1 − e^{−αq})². Models molecular bonds. Finite number of bound states, dissociation at high energy." },
          { name: "Quartic Potential", desc: "V(q) = ¼λq⁴. No harmonic term — purely anharmonic. The double-well V(q) = −½μq² + ¼λq⁴ has two minima." },
          { name: "Double Well Potential", desc: "V(q) = λ(q² − a²)². Two stable equilibria at q = ±a separated by a barrier. Rich phase portrait with figure-eight separatrix." },
          { name: "Canonical Transformations", desc: "Coordinate changes (q,p) → (Q,P) that preserve Hamilton's equations. The Hamiltonian framework is invariant under these." },
        ],
        keyEquations: [
          "\\dot{q} = \\frac{\\partial H}{\\partial p},\\quad \\dot{p} = -\\frac{\\partial H}{\\partial q}",
          "H(q,p) = \\frac{p^2}{2m} + V(q) = E",
          "\\{f,H\\} = \\dot{f}\\;\\text{(Poisson bracket)}",
        ],
        conceptSummary:
          "Choose a potential V(q) and see the phase portrait fill in. Click anywhere in phase space to launch a trajectory following Hamilton's equations.",
      },
      {
        id: "liouville",
        title: "Liouville's Theorem",
        description:
          "A cloud of initial conditions in phase space evolves like an incompressible fluid — it deforms but its volume is preserved. This is Liouville's theorem, the foundation of statistical mechanics.",
        statisticalTools: [
          { name: "Liouville's Theorem", desc: "dρ/dt = 0 along trajectories. Phase-space density is conserved. Equivalently, ∇·(ρv) = 0 — the flow is divergence-free." },
          { name: "Phase Space Volume", desc: "∫dq dp over a region of initial conditions. Liouville: this volume is constant as the region evolves under Hamiltonian flow." },
          { name: "Incompressible Flow", desc: "∂q̇/∂q + ∂ṗ/∂p = ∂²H/∂q∂p − ∂²H/∂p∂q = 0. Hamilton's equations automatically make the flow divergence-free." },
          { name: "Filamentation", desc: "While volume is preserved, the shape can deform wildly. The cloud stretches into thin filaments — information is 'lost' in practice." },
          { name: "Coarse Graining", desc: "Dividing phase space into finite cells. Fine filaments fill cells uniformly → apparent increase in entropy. The origin of irreversibility." },
          { name: "Gibbs Entropy", desc: "S = −k∫ρ ln ρ dq dp. Constant under Hamiltonian evolution (Liouville). Increases only under coarse-graining." },
          { name: "Statistical Mechanics Connection", desc: "Liouville's theorem justifies the microcanonical ensemble: all accessible microstates are equally likely at equilibrium." },
          { name: "Poincaré Recurrence", desc: "A bounded Hamiltonian system returns arbitrarily close to its initial state. But the recurrence time grows exponentially with system size." },
          { name: "Symplectic Structure", desc: "Hamiltonian flow preserves the symplectic 2-form ω = dq ∧ dp. Liouville's theorem is a consequence of this deeper structure." },
          { name: "Numerical Test", desc: "Evolve a grid of points and compute the convex hull area. It should remain constant — a test of the integrator's symplecticity." },
        ],
        keyEquations: [
          "\\frac{d\\rho}{dt} = \\frac{\\partial\\rho}{\\partial t} + \\{\\rho, H\\} = 0",
          "\\frac{\\partial \\dot{q}}{\\partial q} + \\frac{\\partial \\dot{p}}{\\partial p} = 0",
          "\\int dq\\,dp = \\text{const}",
        ],
        conceptSummary:
          "Watch a cloud of phase-space points evolve. The cloud stretches and deforms but its area is conserved — Liouville's theorem in action.",
      },
      {
        id: "fixed-points",
        title: "Fixed Points & Separatrices",
        description:
          "Fixed points of the Hamiltonian flow are equilibria. Stable equilibria are centers (elliptic), unstable ones are saddles (hyperbolic). Separatrices divide phase space into qualitatively different regions.",
        statisticalTools: [
          { name: "Fixed Points", desc: "Where q̇ = 0 and ṗ = 0 simultaneously. For H = p²/2m + V(q): p = 0 and V'(q) = 0. Equilibria of the potential." },
          { name: "Center (Elliptic)", desc: "At a local minimum of V(q). Phase-space trajectories are closed loops — stable oscillation. Eigenvalues are purely imaginary: ±iω." },
          { name: "Saddle (Hyperbolic)", desc: "At a local maximum of V(q). Trajectories approach along one direction, recede along another. Eigenvalues are real: ±γ." },
          { name: "Separatrix", desc: "The trajectory through a saddle point. Divides phase space into regions with qualitatively different dynamics (e.g., oscillation vs rotation)." },
          { name: "Pendulum Separatrix", desc: "For the pendulum, the separatrix is at E = mgL. Below: oscillation (libration). Above: full rotation. On it: asymptotic approach to top." },
          { name: "Homoclinic Orbit", desc: "A separatrix that starts and ends at the same saddle point. Forms a loop — infinite period orbit." },
          { name: "Heteroclinic Orbit", desc: "A separatrix connecting two different saddle points. Traversed in infinite time in both directions." },
          { name: "Linear Stability Analysis", desc: "Linearize Hamilton's equations near a fixed point. The Jacobian eigenvalues determine stability type." },
          { name: "Bifurcation", desc: "As a parameter changes, fixed points can appear, disappear, or change stability. The qualitative phase portrait changes at bifurcation values." },
          { name: "Index Theory", desc: "The topological index of a fixed point: +1 for centers and saddles, characterizes the winding of the flow around the point." },
        ],
        keyEquations: [
          "V'(q_0) = 0 \\;\\Rightarrow\\; \\text{fixed point at } (q_0, 0)",
          "V''(q_0) > 0 \\;\\Rightarrow\\; \\text{center},\\quad V''(q_0) < 0 \\;\\Rightarrow\\; \\text{saddle}",
          "\\omega = \\sqrt{V''(q_0)/m} \\;\\text{(oscillation frequency near center)}",
        ],
        conceptSummary:
          "Identify fixed points and separatrices in the phase portrait. See how the topology changes when you deform the potential.",
      },
    ],
  },
  {
    id: "c8",
    num: "C8",
    title: "Noether's Theorem",
    description:
      "Every continuous symmetry of the Lagrangian corresponds to a conserved quantity. Time translation → energy, space translation → momentum, rotation → angular momentum. The deepest theorem in classical mechanics.",
    color: "#10B981",
    icon: "💎",
    shortDesc: "Symmetry & conservation",
    sections: [
      {
        id: "time-energy",
        title: "Time Translation → Energy Conservation",
        description:
          "If the Lagrangian doesn't depend explicitly on time (∂L/∂t = 0), then energy is conserved. Time-translation symmetry is the origin of energy conservation.",
        statisticalTools: [
          { name: "Noether's Theorem", desc: "For every continuous symmetry of the action S = ∫L dt, there is a conserved quantity. The most profound result in theoretical physics." },
          { name: "Time Translation Symmetry", desc: "If L has no explicit time dependence, the physics is the same today as tomorrow. The Lagrangian is invariant under t → t + ε." },
          { name: "Energy (Hamiltonian)", desc: "H = Σpᵢq̇ᵢ − L. The conserved quantity from time-translation symmetry. Equals T + V for natural systems." },
          { name: "dH/dt = −∂L/∂t", desc: "If ∂L/∂t = 0 then dH/dt = 0 and energy is conserved. Explicitly time-dependent forces (e.g., parametric driving) break this." },
          { name: "Action Principle", desc: "δS = 0 where S = ∫L dt. The equations of motion extremize the action. Noether's theorem connects symmetries of S to conservation laws." },
          { name: "Explicit vs Implicit Time Dependence", desc: "A swinging pendulum has implicit t-dependence (through θ(t)), but L has no explicit t. Energy is still conserved." },
          { name: "Parametric Oscillator", desc: "L = ½m(q̇² − ω(t)²q²). The time-varying frequency ω(t) breaks time symmetry → energy is NOT conserved (parametric amplification)." },
          { name: "Dissipative Systems", desc: "Friction breaks time-reversal symmetry (not exactly the same as time-translation). Energy decreases — no conservation law from Noether." },
          { name: "Conserved Current", desc: "Noether's theorem also applies to field theories: ∂_μ j^μ = 0. The conserved 'charge' is Q = ∫j⁰ d³x." },
          { name: "First Integral", desc: "A conserved quantity is also called a first integral of the equations of motion. It reduces the dimensionality of the problem by one." },
        ],
        keyEquations: [
          "\\frac{\\partial L}{\\partial t} = 0 \\;\\Rightarrow\\; H = \\sum p_i \\dot{q}_i - L = \\text{const}",
          "\\frac{dH}{dt} = -\\frac{\\partial L}{\\partial t}",
          "\\delta S = 0 \\;\\Rightarrow\\; \\text{Euler-Lagrange equations}",
        ],
        conceptSummary:
          "See a system evolve and watch the energy stay constant. Then break time symmetry with a time-dependent parameter and watch energy change.",
      },
      {
        id: "space-momentum",
        title: "Space Translation → Momentum Conservation",
        description:
          "If the Lagrangian doesn't depend on position (∂L/∂x = 0), then linear momentum is conserved. Homogeneity of space guarantees momentum conservation.",
        statisticalTools: [
          { name: "Spatial Homogeneity", desc: "If L is unchanged when the entire system is shifted by Δx, there's no preferred position. Space translation is a symmetry." },
          { name: "Generalized Momentum", desc: "pᵢ = ∂L/∂q̇ᵢ. The canonical momentum conjugate to qᵢ. If L doesn't depend on qᵢ, then ṗᵢ = 0 (conserved)." },
          { name: "Cyclic Coordinate", desc: "If ∂L/∂qᵢ = 0, qᵢ is called cyclic (or ignorable). Its conjugate momentum pᵢ is automatically conserved." },
          { name: "Linear Momentum", desc: "p = mv for a free particle. For a system, P_total = Σmᵢvᵢ. Conserved when there's no external force (space-translation symmetry)." },
          { name: "Center of Mass", desc: "R_cm = Σmᵢrᵢ/M_total. Moves at constant velocity when momentum is conserved: Ṙ_cm = P/M = const." },
          { name: "Newton's Third Law", desc: "Internal forces cancel in pairs → total momentum is conserved. This is the Newtonian manifestation of spatial homogeneity." },
          { name: "Collision Problems", desc: "Momentum conservation simplifies collision analysis. In the CM frame, the problem reduces to a single-body scattering problem." },
          { name: "Translational vs Internal Degrees of Freedom", desc: "Separate q_cm and relative coordinates. The CM moves freely; internal dynamics depend only on relative separations." },
          { name: "Gauge Momentum", desc: "In EM: pᵢ = mq̇ᵢ + qAᵢ. The canonical momentum includes the vector potential contribution — not just mechanical momentum." },
          { name: "Broken Translation Symmetry", desc: "An external potential V(x) breaks spatial homogeneity → momentum is NOT conserved. The force F = −dV/dx changes momentum." },
        ],
        keyEquations: [
          "\\frac{\\partial L}{\\partial x} = 0 \\;\\Rightarrow\\; p_x = \\frac{\\partial L}{\\partial \\dot{x}} = \\text{const}",
          "\\dot{p}_i = \\frac{\\partial L}{\\partial q_i}",
          "\\mathbf{P}_{\\text{total}} = \\sum_i m_i \\mathbf{v}_i = \\text{const}",
        ],
        conceptSummary:
          "Move a system through space and see that physics doesn't change. Then add a potential to break the symmetry and watch momentum change.",
      },
      {
        id: "rotation-angular",
        title: "Rotation → Angular Momentum Conservation",
        description:
          "If the Lagrangian is invariant under rotations (isotropy of space), angular momentum is conserved. This is why planets maintain their orbital planes and why spinning tops stay upright.",
        statisticalTools: [
          { name: "Rotational Symmetry", desc: "L is unchanged when the entire system is rotated by angle δφ. Isotropy of space — no preferred direction." },
          { name: "Angular Momentum", desc: "L = r × p. The conserved quantity associated with rotational symmetry. Vector quantity — magnitude AND direction are conserved." },
          { name: "Cyclic Angle", desc: "If ∂L/∂φ = 0 (L doesn't depend on the azimuthal angle), then L_z = ∂L/∂φ̇ is conserved. The φ coordinate is cyclic." },
          { name: "Central Force", desc: "V(r) depends only on |r|, not direction. Full rotational symmetry → all three components of L are conserved." },
          { name: "Axial Symmetry", desc: "V depends on r and θ but not φ. Only L_z (component along symmetry axis) is conserved." },
          { name: "Orbital vs Spin Angular Momentum", desc: "L_orbital = r × p (motion around a center). L_spin = Iω (intrinsic rotation). Both separately conserved if no torque." },
          { name: "Torque and Angular Momentum", desc: "τ = dL/dt. If the external torque is zero (rotational symmetry), angular momentum is conserved." },
          { name: "Kepler's Second Law Revisited", desc: "dA/dt = L/2m = const is angular momentum conservation in disguise. Equal areas in equal times." },
          { name: "Precession of a Top", desc: "With a torque (gravity), L changes direction but not magnitude. The top precesses — L traces a cone." },
          { name: "Conservation in Collisions", desc: "Angular momentum is conserved in all collisions (about any point). Combined with energy and linear momentum for full solution." },
        ],
        keyEquations: [
          "\\frac{\\partial L}{\\partial \\phi} = 0 \\;\\Rightarrow\\; L_z = mr^2\\dot{\\phi} = \\text{const}",
          "\\mathbf{L} = \\mathbf{r} \\times \\mathbf{p} = \\text{const}",
          "\\boldsymbol{\\tau} = \\frac{d\\mathbf{L}}{dt}",
        ],
        conceptSummary:
          "Rotate a central-force system and see that physics is unchanged. Watch angular momentum L stay constant as the orbit evolves.",
      },
    ],
  },
];

// ─── ELECTRODYNAMICS ───────────────────────────────────────────────

const electrodynamics: Chapter[] = [
  {
    id: "e1",
    num: "E1",
    title: "Electric Fields & Coulomb's Law",
    description:
      "Electric charges create fields that permeate space. The electric field E at any point is the superposition of contributions from all charges, each following Coulomb's inverse-square law. Visualizing these fields reveals the elegant geometry of electrostatics.",
    color: "#3b82f6",
    icon: "⚡",
    shortDesc: "Charges, fields & potentials",
    sections: [
      {
        id: "point-charges",
        title: "Point Charges & Field Arrows",
        description:
          "Place charges in space and watch the electric field emerge. Each charge contributes E = kq r̂/r² and the total field is the vector sum — the superposition principle in action.",
        statisticalTools: [
          { name: "Coulomb's Law", desc: "\\mathbf{F} = k_e \\frac{q_1 q_2}{r^2}\\hat{r}. The fundamental force law between point charges. Like charges repel, opposites attract, with inverse-square dependence." },
          { name: "Electric Field Definition", desc: "\\mathbf{E} = \\mathbf{F}/q_{\\text{test}}. The field is force per unit test charge — it exists at every point in space whether or not a test charge is present." },
          { name: "Superposition Principle", desc: "\\mathbf{E}_{\\text{total}} = \\sum_i \\mathbf{E}_i. Fields from multiple charges add as vectors. This linearity is one of the most powerful features of electrostatics." },
          { name: "Coulomb Constant", desc: "k_e = 8.99 \\times 10^9 \\text{ N·m}^2/\\text{C}^2 = 1/(4\\pi\\varepsilon_0). Sets the strength scale of electrostatic interactions." },
          { name: "Electric Dipole", desc: "Two equal and opposite charges separated by distance d. The dipole moment \\mathbf{p} = q\\mathbf{d} characterizes the system. Far away, the field falls as 1/r³." },
          { name: "Field Visualization (Quiver Plot)", desc: "Arrows at grid points show field direction and magnitude. Arrow length/color encodes |E|. Reveals the vector nature of the electric field." },
          { name: "Inverse-Square Law", desc: "Field strength falls as 1/r². Doubling distance quarters the field. This is a consequence of Gauss's law and 3D geometry." },
          { name: "Point Charge Symmetry", desc: "A single point charge has spherical symmetry — the field is purely radial and equal at all points equidistant from the charge." },
          { name: "Charge Conservation", desc: "Electric charge is conserved in all processes. Charges can be transferred but never created or destroyed." },
          { name: "Test Charge Concept", desc: "A vanishingly small positive charge used to probe the field without disturbing the source charges. The field exists independently of the probe." },
        ],
        keyEquations: [
          "\\mathbf{E} = k_e \\frac{q}{r^2}\\hat{r}",
          "\\mathbf{E}_{\\text{total}} = \\sum_i k_e \\frac{q_i}{r_i^2}\\hat{r}_i",
          "k_e = \\frac{1}{4\\pi\\varepsilon_0} = 8.99 \\times 10^9 \\text{ N·m}^2/\\text{C}^2",
        ],
        conceptSummary:
          "Drag charges around and watch the electric field arrows update in real-time. Try dipole and quadrupole presets to see classic field patterns.",
      },
      {
        id: "field-lines",
        title: "Electric Field Lines",
        description:
          "Field lines are curves tangent to the electric field at every point. They start on positive charges and end on negative charges (or extend to infinity). Their density encodes field strength.",
        statisticalTools: [
          { name: "Field Line Rules", desc: "Lines originate on +q and terminate on −q. They never cross (the field has a unique direction at each point). Density of lines ∝ |E|." },
          { name: "Streamline Integration", desc: "Trace a field line by taking small steps along \\mathbf{E}: \\mathbf{r}_{n+1} = \\mathbf{r}_n + \\hat{E}\\,\\Delta s. Euler integration of the field direction." },
          { name: "Dipole Field Lines", desc: "Lines curve from + to − charge, forming characteristic loops. Far from the dipole, the pattern resembles a single higher-order source." },
          { name: "Line Density & Field Strength", desc: "More lines per unit area means stronger field. This is why lines crowd near charges and spread apart at large distances." },
          { name: "Gauss's Law Connection", desc: "The number of field lines through a closed surface ∝ enclosed charge. This is the geometric content of \\oint \\mathbf{E}\\cdot d\\mathbf{A} = Q_{\\text{enc}}/\\varepsilon_0." },
          { name: "Field Line Topology", desc: "Field lines partition space into regions. The topology changes at critical points (saddle points) where E = 0 between like charges." },
          { name: "Seed Point Selection", desc: "Lines are seeded uniformly in angle around each positive charge. The number of seeds per charge is proportional to |q| for accurate representation." },
          { name: "No Closed Field Lines (Electrostatics)", desc: "Electrostatic field lines never form closed loops. This is because \\nabla \\times \\mathbf{E} = 0 — the field is conservative." },
          { name: "Symmetry in Field Patterns", desc: "A charge configuration's symmetry is reflected in its field line pattern. Dipoles have mirror symmetry; quadrupoles have 4-fold symmetry." },
          { name: "Far-Field Behavior", desc: "Far from any bounded charge distribution, the field looks like that of a point charge Q = \\sum q_i. Higher multipole terms decay faster." },
        ],
        keyEquations: [
          "\\frac{d\\mathbf{r}}{ds} = \\hat{E}(\\mathbf{r})",
          "\\oint \\mathbf{E} \\cdot d\\mathbf{A} = \\frac{Q_{\\text{enc}}}{\\varepsilon_0}",
          "\\text{Line density} \\propto |\\mathbf{E}|",
        ],
        conceptSummary:
          "Watch field lines stream from positive to negative charges. Increase lines per charge to see the field structure in finer detail.",
      },
      {
        id: "equipotentials",
        title: "Equipotential Contours",
        description:
          "Equipotential lines connect points of equal electric potential V. They are always perpendicular to field lines. No work is done moving a charge along an equipotential — it's the electrostatic analog of a contour map.",
        statisticalTools: [
          { name: "Electric Potential", desc: "V = k_e q/r. A scalar field — easier to compute than the vector field E. The potential from multiple charges simply adds: V = \\sum k_e q_i/r_i." },
          { name: "Gradient Relation", desc: "\\mathbf{E} = -\\nabla V. The field points from high to low potential, perpendicular to equipotential surfaces. Magnitude: |E| = |dV/dr|." },
          { name: "Equipotential Perpendicularity", desc: "Field lines cross equipotentials at right angles everywhere. This is because E = −∇V, and the gradient is always perpendicular to level sets." },
          { name: "Marching Squares Algorithm", desc: "A grid-based contour extraction method. Each cell's corners are classified as above/below the contour level, determining line segment placement." },
          { name: "Potential Energy", desc: "U = qV. A charge q in a potential V has potential energy qV. Positive charges roll downhill in potential; negative charges roll uphill." },
          { name: "Superposition of Potentials", desc: "V_{\\text{total}} = \\sum V_i. Scalar addition is simpler than vector addition of fields. Compute V first, then take −∇V to get E." },
          { name: "Conductor Equipotentials", desc: "The surface of a conductor is an equipotential. In equilibrium, E is perpendicular to the surface and zero inside." },
          { name: "Potential of a Dipole", desc: "V = k_e p \\cos\\theta / r^2. Falls as 1/r² (faster than monopole 1/r). Equipotentials are not spheres but distorted surfaces." },
          { name: "Work & Path Independence", desc: "W = −q\\Delta V. Work depends only on endpoints, not path. This is because \\nabla \\times \\mathbf{E} = 0 (conservative field)." },
          { name: "Logarithmic Contour Spacing", desc: "Near a point charge, V ∝ 1/r. Equal spacing in V gives logarithmically spaced contours — they crowd near the charge." },
        ],
        keyEquations: [
          "V = \\sum_i k_e \\frac{q_i}{r_i}",
          "\\mathbf{E} = -\\nabla V",
          "W_{A \\to B} = -q(V_B - V_A)",
        ],
        conceptSummary:
          "See equipotential contours perpendicular to field lines. Red contours mark positive potential, blue marks negative. Move charges to reshape the landscape.",
      },
    ],
  },
  {
    id: "e2",
    num: "E2",
    title: "Magnetic Fields & Biot-Savart",
    description:
      "Moving charges and currents create magnetic fields. The Biot-Savart law gives the field from any current distribution, while Ampère's law provides elegant shortcuts for symmetric geometries. Magnetic fields form closed loops — there are no magnetic monopoles.",
    color: "#8b5cf6",
    icon: "🧲",
    shortDesc: "Currents, coils & Ampère's law",
    sections: [
      {
        id: "wire-field",
        title: "Field of a Current-Carrying Wire",
        description:
          "An infinite straight wire carrying current I produces circular magnetic field lines centered on the wire. The field strength decreases as 1/r — the simplest application of the Biot-Savart law.",
        statisticalTools: [
          { name: "Biot-Savart Law", desc: "d\\mathbf{B} = \\frac{\\mu_0}{4\\pi} \\frac{I\\,d\\mathbf{l} \\times \\hat{r}}{r^2}. The fundamental law for computing B from any current distribution. Analogous to Coulomb's law for E." },
          { name: "Infinite Wire Result", desc: "B = \\mu_0 I / (2\\pi r). Derived by integrating Biot-Savart along the full wire. Field is purely azimuthal (tangent to circles around the wire)." },
          { name: "Right-Hand Rule", desc: "Curl the fingers of your right hand in the direction of B; your thumb points along the current. Determines the circulation direction of field lines." },
          { name: "Permeability of Free Space", desc: "\\mu_0 = 4\\pi \\times 10^{-7} \\text{ T·m/A}. The magnetic constant, analogous to \\varepsilon_0 for electric fields." },
          { name: "1/r Decay", desc: "Unlike electric fields (1/r²), the wire's field falls as 1/r. This is because the wire is one-dimensional — one fewer dimension to spread over." },
          { name: "Magnetic Field Units", desc: "Tesla (T) = kg/(A·s²). Earth's field ≈ 50 μT. An MRI machine ≈ 1.5–3 T. A wire at 1 m carrying 1 A produces 0.2 μT." },
          { name: "Current Direction Convention", desc: "Dot (⊙) means current out of the page. Cross (⊗) means current into the page. The field circulates accordingly via the right-hand rule." },
          { name: "Superposition of Wire Fields", desc: "Fields from multiple wires add as vectors. Parallel currents attract; antiparallel currents repel (basis of the SI ampere definition)." },
          { name: "Force Between Parallel Wires", desc: "F/L = \\mu_0 I_1 I_2 / (2\\pi d). Two parallel wires carrying current in the same direction attract. This defined the ampere before 2019." },
          { name: "Cylindrical Symmetry", desc: "The wire has translational and rotational symmetry about its axis. By symmetry, B has only an azimuthal component and depends only on r." },
        ],
        keyEquations: [
          "B = \\frac{\\mu_0 I}{2\\pi r}",
          "d\\mathbf{B} = \\frac{\\mu_0}{4\\pi} \\frac{I\\,d\\mathbf{l} \\times \\hat{r}}{r^2}",
          "\\mu_0 = 4\\pi \\times 10^{-7} \\text{ T·m/A}",
        ],
        conceptSummary:
          "Toggle current direction and adjust magnitude. Watch the circular field pattern and how B decreases with distance from the wire.",
      },
      {
        id: "helmholtz-coils",
        title: "Helmholtz Coils",
        description:
          "Two identical coils separated by one radius create a remarkably uniform magnetic field in the central region. This Helmholtz configuration is the standard technique for producing uniform fields in laboratories.",
        statisticalTools: [
          { name: "On-Axis Field of a Loop", desc: "B(z) = \\frac{\\mu_0 I R^2}{2(R^2 + z^2)^{3/2}}. The field on the axis of a circular loop. Maximum at the center, falling off as 1/z³ far away." },
          { name: "Helmholtz Condition", desc: "Separation d = R (one radius). At this spacing, the second derivative d²B/dz² vanishes at the midpoint, giving maximum uniformity." },
          { name: "Superposition of Two Loops", desc: "B_{\\text{total}}(z) = B_1(z - d/2) + B_2(z + d/2). Each coil contributes; the sum has a flat region between the coils when d = R." },
          { name: "Field Uniformity", desc: "At d = R, the field varies less than 1% over a central region ~R/4 in extent. Crucial for NMR, particle beam steering, and calibration." },
          { name: "Anti-Helmholtz Configuration", desc: "Same geometry but opposite currents. Produces a linear field gradient dB/dz at the center. Used in magneto-optical traps (MOTs)." },
          { name: "Taylor Expansion of B(z)", desc: "B(z) = B_0 + B''z²/2 + \\cdots. Helmholtz condition sets B'' = 0. The next nonzero term is B'''' — giving 4th-order uniformity." },
          { name: "Practical Coil Design", desc: "Real Helmholtz coils have finite wire thickness, multiple turns, and resistance. The ideal single-turn result is corrected by winding geometry." },
          { name: "Magnetic Flux", desc: "\\Phi_B = \\int \\mathbf{B} \\cdot d\\mathbf{A}. Total flux through a surface. For a loop, Φ = BA when B is uniform and perpendicular." },
          { name: "Inductance", desc: "A coil's inductance L relates current to flux: \\Phi = LI. Energy stored: U = LI²/2. Helmholtz pairs have mutual inductance." },
          { name: "Biot-Savart for Loops", desc: "Integrate dB contributions around the loop circumference. On-axis: all components cancel except along the axis by symmetry." },
        ],
        keyEquations: [
          "B(z) = \\frac{\\mu_0 I R^2}{2(R^2 + z^2)^{3/2}}",
          "d = R \\quad \\text{(Helmholtz condition)}",
          "B_{\\text{center}} = \\left(\\frac{4}{5}\\right)^{3/2} \\frac{\\mu_0 I}{R}",
        ],
        conceptSummary:
          "Adjust coil separation and watch the field profile. At d = R the central field becomes remarkably uniform — the Helmholtz sweet spot.",
      },
      {
        id: "amperes-law",
        title: "Ampère's Law",
        description:
          "The line integral of B around any closed path equals μ₀ times the enclosed current. This powerful law lets you compute fields for symmetric configurations without doing a full Biot-Savart integration.",
        statisticalTools: [
          { name: "Ampère's Law (Integral Form)", desc: "\\oint \\mathbf{B} \\cdot d\\mathbf{l} = \\mu_0 I_{\\text{enc}}. The circulation of B around a closed path depends only on the total current threading the loop." },
          { name: "Amperian Loop", desc: "A mathematical closed curve chosen to exploit symmetry. For a wire: a circle centered on the wire. B is constant and tangent on this path." },
          { name: "Enclosed vs External Currents", desc: "Only currents passing through the loop contribute to \\oint B·dl. External currents create fields but their contributions cancel around the loop." },
          { name: "Sign Convention", desc: "Use the right-hand rule: curl fingers along the integration path; thumb points in the positive current direction. Currents opposing this are negative." },
          { name: "Line Integral Computation", desc: "\\oint \\mathbf{B} \\cdot d\\mathbf{l} \\approx \\sum_i \\mathbf{B}(\\mathbf{r}_i) \\cdot \\Delta\\mathbf{l}_i. Numerically: sample B at points around the path and sum dot products." },
          { name: "Solenoid Application", desc: "For an ideal solenoid: B = \\mu_0 n I inside, B = 0 outside. Apply Ampère's law to a rectangular path crossing the solenoid wall." },
          { name: "Toroid Application", desc: "For a toroid: B = \\mu_0 N I / (2\\pi r) inside the torus, zero outside. N = total turns, r = distance from center." },
          { name: "Differential Form", desc: "\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J}. The curl of B at a point equals μ₀ times the current density there. Local version of Ampère's law." },
          { name: "Maxwell's Correction", desc: "\\oint \\mathbf{B} \\cdot d\\mathbf{l} = \\mu_0(I_{\\text{enc}} + \\varepsilon_0 \\frac{d\\Phi_E}{dt}). The displacement current term completes the law for time-varying fields." },
          { name: "Path Independence of Circulation", desc: "The value of \\oint B·dl is the same for all paths enclosing the same current. You can deform the path freely without changing the integral." },
        ],
        keyEquations: [
          "\\oint \\mathbf{B} \\cdot d\\mathbf{l} = \\mu_0 I_{\\text{enc}}",
          "\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J}",
          "B_{\\text{solenoid}} = \\mu_0 n I",
        ],
        conceptSummary:
          "Draw an Amperian loop around current-carrying wires. Watch the line integral equal μ₀I_enclosed — regardless of loop shape or size.",
      },
    ],
  },
  {
    id: "e3",
    num: "E3",
    title: "Electromagnetic Waves",
    description:
      "Maxwell's equations predict that oscillating electric and magnetic fields propagate through space as waves at the speed of light. These electromagnetic waves carry energy and momentum, and their polarization describes the geometry of the oscillating fields.",
    color: "#06b6d4",
    icon: "🌊",
    shortDesc: "Propagation, polarization & energy",
    sections: [
      {
        id: "plane-wave",
        title: "Plane Wave Propagation",
        description:
          "A plane electromagnetic wave has E and B oscillating perpendicular to each other and to the direction of propagation. The wave travels at c = 1/√(μ₀ε₀) — the speed of light.",
        statisticalTools: [
          { name: "Wave Equation", desc: "\\nabla^2 \\mathbf{E} = \\mu_0 \\varepsilon_0 \\frac{\\partial^2 \\mathbf{E}}{\\partial t^2}. Derived from Maxwell's equations. Solutions are waves traveling at c = 1/\\sqrt{\\mu_0 \\varepsilon_0}." },
          { name: "Plane Wave Solution", desc: "\\mathbf{E} = E_0 \\sin(kz - \\omega t)\\,\\hat{x}. A wave propagating in z with E oscillating in x. The simplest solution to the wave equation." },
          { name: "Wave Speed", desc: "c = \\lambda f = \\omega/k = 1/\\sqrt{\\mu_0\\varepsilon_0} \\approx 3 \\times 10^8 \\text{ m/s}. The speed of light emerges naturally from electromagnetic theory." },
          { name: "Dispersion Relation", desc: "\\omega = ck. In vacuum, all frequencies travel at the same speed. In a medium, c → c/n where n is the refractive index." },
          { name: "E-B Relationship", desc: "|E| = c|B|. The electric and magnetic fields oscillate in phase with a fixed ratio. In SI units, E is much larger than cB numerically." },
          { name: "Transverse Nature", desc: "Both E and B are perpendicular to the propagation direction k̂. EM waves are transverse waves — there is no longitudinal component in vacuum." },
          { name: "Wavelength-Frequency Relation", desc: "\\lambda = c/f. Radio waves: λ ~ meters. Visible light: λ ~ 400-700 nm. X-rays: λ ~ 0.01-10 nm." },
          { name: "Maxwell's Equations", desc: "The four laws (Gauss E, Gauss B, Faraday, Ampère-Maxwell) together predict EM waves. The displacement current term is essential." },
          { name: "Wave Number & Angular Frequency", desc: "k = 2\\pi/\\lambda, \\omega = 2\\pi f. The spatial and temporal periodicities of the wave. Phase velocity: v_p = ω/k." },
          { name: "Superposition of Waves", desc: "EM waves satisfy a linear equation, so any sum of solutions is also a solution. This leads to interference, diffraction, and beating." },
        ],
        keyEquations: [
          "\\mathbf{E} = E_0 \\sin(kz - \\omega t)\\,\\hat{x}",
          "\\mathbf{B} = \\frac{E_0}{c} \\sin(kz - \\omega t)\\,\\hat{y}",
          "c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}} \\approx 3 \\times 10^8 \\text{ m/s}",
        ],
        conceptSummary:
          "Watch E (orange) and B (blue) oscillate perpendicular to each other as the wave propagates. Adjust wavelength and amplitude to see different wave regimes.",
      },
      {
        id: "polarization",
        title: "Polarization States",
        description:
          "The polarization of an EM wave describes how the electric field vector traces a pattern in the plane perpendicular to propagation. Linear, circular, and elliptical polarizations arise from different amplitude ratios and phase differences between orthogonal components.",
        statisticalTools: [
          { name: "Linear Polarization", desc: "E oscillates along a fixed line: \\mathbf{E} = E_0 \\cos(\\omega t)\\,\\hat{n}. The simplest polarization. Produced by antennas and many lasers." },
          { name: "Circular Polarization", desc: "E_x = E_0\\cos(\\omega t),\\; E_y = E_0\\cos(\\omega t \\pm \\pi/2). The tip of E traces a circle. Right-circular: clockwise when viewed head-on; left-circular: counterclockwise." },
          { name: "Elliptical Polarization", desc: "E_x = E_{0x}\\cos(\\omega t),\\; E_y = E_{0y}\\cos(\\omega t + \\delta). General case: the tip traces an ellipse. Linear and circular are special cases." },
          { name: "Phase Difference δ", desc: "\\delta = 0 → linear. \\delta = \\pi/2,\\; E_{0x} = E_{0y} → circular. Other values → elliptical. δ controls the 'openness' of the ellipse." },
          { name: "Jones Vector", desc: "\\mathbf{J} = \\begin{pmatrix} E_{0x} \\\\ E_{0y} e^{i\\delta} \\end{pmatrix}. A compact complex representation of the polarization state." },
          { name: "Polarization by Reflection", desc: "At Brewster's angle \\theta_B = \\arctan(n_2/n_1), the reflected wave is perfectly linearly polarized. Used in polarizing optics." },
          { name: "Quarter-Wave Plate", desc: "Introduces a π/2 phase shift between orthogonal components. Converts linear to circular polarization and vice versa." },
          { name: "Malus's Law", desc: "I = I_0 \\cos^2\\theta. Intensity transmitted through a polarizer tilted at angle θ to the polarization direction." },
          { name: "Axis Ratio", desc: "The ratio of semi-minor to semi-major axis of the polarization ellipse. 0 = linear, 1 = circular, between = elliptical." },
          { name: "Stokes Parameters", desc: "S_0, S_1, S_2, S_3 describe polarization including partial polarization. Measurable quantities, unlike the Jones vector which requires coherence." },
        ],
        keyEquations: [
          "E_x = E_{0x}\\cos(\\omega t),\\quad E_y = E_{0y}\\cos(\\omega t + \\delta)",
          "\\text{Circular: } \\delta = \\pm\\pi/2,\\; E_{0x} = E_{0y}",
          "I = I_0 \\cos^2\\theta \\quad \\text{(Malus's law)}",
        ],
        conceptSummary:
          "Switch between polarization modes and watch the E-field vector trace lines, circles, or ellipses. Adjust the phase difference δ to morph between states.",
      },
      {
        id: "poynting-vector",
        title: "Poynting Vector & Energy Flow",
        description:
          "Electromagnetic waves carry energy. The Poynting vector S = (1/μ₀)(E × B) gives the power flow per unit area. The time-averaged intensity is what we measure as the brightness of light.",
        statisticalTools: [
          { name: "Poynting Vector", desc: "\\mathbf{S} = \\frac{1}{\\mu_0}(\\mathbf{E} \\times \\mathbf{B}). Gives the power per unit area (W/m²) flowing through space. Direction = energy propagation direction." },
          { name: "Instantaneous Intensity", desc: "S = \\frac{E_0^2}{\\mu_0 c}\\sin^2(kz - \\omega t). Oscillates between 0 and a maximum at twice the wave frequency." },
          { name: "Time-Averaged Intensity", desc: "\\langle S \\rangle = \\frac{E_0^2}{2\\mu_0 c} = \\frac{1}{2}c\\varepsilon_0 E_0^2. The average power flow — what detectors measure over many cycles." },
          { name: "Energy Density", desc: "u = \\frac{1}{2}\\varepsilon_0 E^2 + \\frac{1}{2\\mu_0}B^2. Electric and magnetic contributions are equal in a plane wave: u_E = u_B." },
          { name: "Energy Conservation", desc: "\\frac{\\partial u}{\\partial t} + \\nabla \\cdot \\mathbf{S} = 0. Energy density decreases where the Poynting flux diverges (energy flows away)." },
          { name: "Radiation Pressure", desc: "P = S/c (absorbed) or 2S/c (reflected). Light carries momentum p = U/c. This is the basis of solar sails." },
          { name: "Inverse-Square Law for Intensity", desc: "I \\propto 1/r^2 for a point source. Total power P = 4\\pi r^2 I is conserved as the wave spreads spherically." },
          { name: "E-B Equipartition", desc: "In an EM wave, the electric and magnetic energy densities are always equal: ½ε₀E² = B²/(2μ₀). Energy is shared equally." },
          { name: "Electromagnetic Momentum", desc: "\\mathbf{g} = \\mathbf{S}/c^2 = \\varepsilon_0(\\mathbf{E} \\times \\mathbf{B}). EM fields carry momentum density, exerting radiation pressure on surfaces." },
          { name: "Power Transmitted", desc: "P = \\int \\mathbf{S} \\cdot d\\mathbf{A}. Integrate Poynting vector over a surface to get total power crossing it." },
        ],
        keyEquations: [
          "\\mathbf{S} = \\frac{1}{\\mu_0}(\\mathbf{E} \\times \\mathbf{B})",
          "\\langle S \\rangle = \\frac{E_0^2}{2\\mu_0 c}",
          "u = \\frac{1}{2}\\varepsilon_0 E^2 + \\frac{B^2}{2\\mu_0}",
        ],
        conceptSummary:
          "See the Poynting vector pulsate with the wave. Energy flows in the propagation direction, oscillating at twice the wave frequency. Compare instantaneous and time-averaged intensity.",
      },
    ],
  },
];

// ─── EXPORTS ────────────────────────────────────────────────────────

export const chapterGroups: ChapterGroup[] = [
  {
    id: "quantum",
    title: "Quantum Physics",
    subtitle: "Probability at the quantum scale",
    chapters: quantumPhysics,
  },
  {
    id: "statistical",
    title: "Statistical Physics",
    subtitle: "From particles to thermodynamics",
    chapters: statisticalPhysics,
  },
  {
    id: "classical",
    title: "Classical Mechanics",
    subtitle: "From Newton to Lagrange and Hamilton",
    chapters: classicalMechanics,
  },
  {
    id: "electrodynamics",
    title: "Electrodynamics",
    subtitle: "Fields, forces & electromagnetic waves",
    chapters: electrodynamics,
  },
];

export const allChapters: Chapter[] = [
  ...quantumPhysics,
  ...statisticalPhysics,
  ...classicalMechanics,
  ...electrodynamics,
];

export function getChapter(id: string): Chapter | undefined {
  return allChapters.find((ch) => ch.id === id);
}

export function getSection(
  chapterId: string,
  sectionId: string
): Section | undefined {
  const ch = getChapter(chapterId);
  return ch?.sections.find((s) => s.id === sectionId);
}
