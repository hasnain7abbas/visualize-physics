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
