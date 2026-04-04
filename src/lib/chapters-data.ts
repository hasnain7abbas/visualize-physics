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
];

export const allChapters: Chapter[] = [
  ...quantumPhysics,
  ...statisticalPhysics,
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
