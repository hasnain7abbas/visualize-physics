export interface StatTool {
  name: string;
  desc: string;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  /** Classroom-style "What is this concept?" — accessible to both high-school and undergraduate audiences. Optional for legacy sections that haven't been backfilled yet. */
  definition?: string;
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
        definition:
          "A quantum state is a vector $|\\psi\\rangle$ in a complex Hilbert space; superposition means it can be written as a weighted sum of basis states, $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$, with complex amplitudes $\\alpha, \\beta$ obeying $|\\alpha|^2 + |\\beta|^2 = 1$. Until a measurement is made, the system genuinely occupies all branches at once — superposition is a property of the state, not just our ignorance of it. This linear structure is what makes interference, entanglement, and quantum computing possible.",
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
        definition:
          "Quantum measurement is the irreversible process of forcing a superposition $|\\psi\\rangle = \\sum_n c_n |n\\rangle$ to choose a single outcome $n$ with probability $|c_n|^2$ (the Born rule), after which the state becomes the eigenstate $|n\\rangle$. This is called wavefunction collapse, and it is fundamentally different from classical measurement: it actively changes the system, not just our knowledge of it. The choice of measurement basis matters — measuring in one basis destroys information about complementary observables.",
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
        definition:
          "A probability amplitude is a complex number $A = |A|e^{i\\varphi}$ assigned to each path or outcome of a quantum process. The probability of the outcome is $P = |A|^2$, but when several indistinguishable paths lead to the same outcome you must add the amplitudes first and only then square: $P = |A_1 + A_2|^2$. The cross term $2\\,\\text{Re}(A_1^* A_2)$ is the interference, and it is what separates quantum mechanics from classical probability theory.",
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
        definition:
          "The Stern-Gerlach apparatus uses a non-uniform magnetic field $\\nabla B$ to apply a force on a particle's magnetic moment that depends on its spin component along the field axis. Classically one would expect a continuous smear; quantum mechanically the beam splits into a discrete number of spots — for spin-1/2 particles, exactly two with $S_z = \\pm\\hbar/2$. This was the first direct evidence that angular momentum is quantized.",
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
        definition:
          "A sequential Stern-Gerlach experiment sends the output of one SG apparatus into another oriented along a different axis. Because $S_x$ and $S_z$ do not commute ($[S_x, S_z] = -i\\hbar S_y \\neq 0$), they are incompatible observables: measuring $S_x$ after selecting $S_z = +\\hbar/2$ re-randomizes the $S_z$ value. This demonstrates that in quantum mechanics, measurement is not a passive readout — it prepares a new state.",
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
        definition:
          "The expectation value of an observable $A$ in state $|\\psi\\rangle$ is $\\langle A\\rangle = \\langle\\psi|A|\\psi\\rangle$ — the mean outcome of many identically prepared measurements. Its uncertainty $\\Delta A = \\sqrt{\\langle A^2\\rangle - \\langle A\\rangle^2}$ is not experimental error but intrinsic quantum spread. For any pair of observables, the Robertson relation $\\Delta A \\cdot \\Delta B \\geq |\\langle[A,B]\\rangle|/2$ sets a lower bound that cannot be beaten by any measurement scheme.",
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
        definition:
          "The particle in a box is the simplest bound quantum system: a particle of mass $m$ trapped in a 1D region $0 \\leq x \\leq L$ with infinite potential walls. Solving the Schrödinger equation with $\\psi(0)=\\psi(L)=0$ gives a discrete ladder of standing-wave eigenstates $\\psi_n(x) = \\sqrt{2/L}\\,\\sin(n\\pi x/L)$ with energies $E_n = n^2\\pi^2\\hbar^2/(2mL^2)$ for $n=1,2,3,\\dots$. It is the canonical example of how confinement plus the Schrödinger equation produces quantization.",
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
        definition:
          "A wavepacket is a localized wavefunction built by summing plane waves with a distribution of momenta, $\\psi(x) = \\int \\phi(k)\\,e^{ikx}\\,dk/\\sqrt{2\\pi}$. The Gaussian packet, $\\psi(x) \\propto e^{-x^2/4\\sigma^2 + ik_0 x}$, is special because position and momentum widths satisfy the equality $\\sigma_x\\sigma_p = \\hbar/2$ — the minimum allowed by Heisenberg's principle. Wavepackets describe realistic quantum particles (localized in space) and they spread over time because different momentum components travel at different group velocities.",
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
        definition:
          "The Heisenberg uncertainty principle states that the product of the standard deviations of position and momentum is bounded below: $\\Delta x \\cdot \\Delta p \\geq \\hbar/2$. It is a mathematical consequence of position and momentum wavefunctions being Fourier transforms of each other — narrowing one automatically broadens the other. The principle is not about clumsy instruments disturbing the system; it is an intrinsic property of the quantum state itself, and it generalizes to any pair of non-commuting observables via $\\Delta A \\cdot \\Delta B \\geq |\\langle[A,B]\\rangle|/2$.",
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
        definition:
          "Quantum tunneling is the phenomenon where a particle with energy $E$ less than a potential barrier height $V_0$ nevertheless has a nonzero probability of being found on the far side. Inside the barrier the wavefunction decays exponentially, $\\psi(x) \\propto e^{-\\kappa x}$ with $\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar$, so for a barrier of width $L$ the transmission probability is roughly $T \\approx e^{-2\\kappa L}$. Tunneling has no classical counterpart and explains nuclear fusion, radioactive decay, and the operation of the scanning tunneling microscope.",
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
        definition:
          "Alpha decay is the nuclear process in which a heavy nucleus emits a helium-4 nucleus (two protons, two neutrons) and transitions to a lighter daughter nucleus. Gamow's 1928 theory explained it as the alpha particle quantum-mechanically tunneling through the Coulomb barrier that confines it; the decay rate is proportional to the tunneling probability $e^{-2G}$ where $G = \\int \\kappa(r)\\,dr$ is the Gamow factor. This model correctly predicts the enormous range of observed half-lives (from microseconds to $10^{17}$ years) from a small range of alpha energies.",
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
        definition:
          "Resonant tunneling occurs in a double-barrier structure (barrier-well-barrier) when the incident particle's energy matches a quasi-bound level $E_r$ of the well. At resonance, multiple internal reflections interfere constructively and the transmission coefficient jumps to $T(E_r) \\approx 1$, even when each barrier alone has $T \\ll 1$. Near a resonance the transmission has a Lorentzian (Breit-Wigner) shape of width $\\Gamma$, with the quasi-bound state's lifetime given by $\\tau = \\hbar/\\Gamma$ — the basis for resonant-tunneling diodes.",
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
        definition:
          "The quantum harmonic oscillator describes any system whose potential energy is approximately quadratic near a stable equilibrium, $V(x) = \\tfrac{1}{2}m\\omega^2 x^2$. Solving the Schrödinger equation gives equally spaced energy levels $E_n = (n + \\tfrac{1}{2})\\hbar\\omega$ for $n = 0, 1, 2, \\dots$, with eigenfunctions $\\psi_n(x) = N_n H_n(\\xi)\\,e^{-\\xi^2/2}$ where $H_n$ are Hermite polynomials and $\\xi = x\\sqrt{m\\omega/\\hbar}$. The uniform spacing $\\hbar\\omega$ between levels is what allows the same model to describe vibrating molecules, lattice phonons, and the modes of a quantum field.",
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
        definition:
          "A coherent state $|\\alpha\\rangle$ is an eigenstate of the harmonic-oscillator annihilation operator, $\\hat{a}|\\alpha\\rangle = \\alpha|\\alpha\\rangle$, parameterized by a complex number $\\alpha$. As a superposition of number states it has a Poisson photon distribution $P(n) = e^{-|\\alpha|^2}|\\alpha|^{2n}/n!$ with mean $\\langle n\\rangle = |\\alpha|^2$. Its wavepacket is a Gaussian of minimum uncertainty that oscillates rigidly in the harmonic potential without spreading, making it the closest quantum analog of a classical oscillator — and the standard description of laser light.",
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
        definition:
          "Zero-point energy is the irreducible ground-state energy of a quantum system. For a harmonic oscillator, $E_0 = \\tfrac{1}{2}\\hbar\\omega$ is nonzero because confining the particle ($\\Delta x$ small) forces momentum spread ($\\Delta p$ large) through $\\Delta x \\cdot \\Delta p \\geq \\hbar/2$, and the kinetic and potential energies cannot both vanish. This residual energy is physically real — it produces the Casimir force between conducting plates and is why helium does not solidify at atmospheric pressure even at $T = 0$.",
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
        definition:
          "The Maxwell-Boltzmann distribution gives the probability density of molecular speeds in a classical ideal gas at temperature $T$: $f(v) = 4\\pi (m/2\\pi k_B T)^{3/2}\\,v^2\\,e^{-mv^2/2k_B T}$. It emerges from assuming that each Cartesian velocity component is independently Gaussian with variance $k_B T/m$, and applies whenever the gas is dilute and quantum effects are negligible. From it follow the most-probable speed $v_{mp} = \\sqrt{2k_BT/m}$ and the mean kinetic energy $\\langle E\\rangle = \\tfrac{3}{2}k_BT$.",
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
        definition:
          "The Boltzmann distribution states that, for a system in thermal equilibrium with a bath at temperature $T$, the probability of being in a microstate with energy $E_i$ is $P_i = e^{-E_i/k_B T}/Z$, where $Z = \\sum_j e^{-E_j/k_B T}$ is the partition function. The factor $e^{-E/k_BT}$ — the Boltzmann factor — exponentially suppresses high-energy states relative to the thermal scale $k_BT$. It is the universal weighting that makes thermal equilibrium possible and underlies everything from chemical reaction rates to atmospheric density profiles.",
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
        definition:
          "The partition function is the normalization constant of the Boltzmann distribution: $Z = \\sum_i e^{-\\beta E_i}$ where $\\beta = 1/k_BT$. It is far more than a normalizer — every equilibrium thermodynamic quantity can be obtained by differentiating $\\ln Z$: the Helmholtz free energy is $F = -k_BT \\ln Z$, the mean energy is $\\langle E\\rangle = -\\partial \\ln Z/\\partial \\beta$, and the heat capacity follows from the variance of $E$. Computing $Z$ — even approximately — solves the thermodynamics of the system.",
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
        definition:
          "Identical particles in quantum mechanics come in two kinds: **fermions** (half-integer spin) have totally antisymmetric many-body wavefunctions, and **bosons** (integer spin) have totally symmetric ones. The antisymmetry of fermions implies the **Pauli exclusion principle** — no two fermions can occupy the same quantum state — while bosons have no such restriction and in fact tend to bunch together. This **spin-statistics rule** is what makes electrons fill atomic shells (giving us the periodic table) and what allows photons to form lasers and atoms to form **Bose-Einstein condensates**.",
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
        definition:
          "The Fermi-Dirac distribution gives the average occupation of a single-particle quantum state of energy $E$ in a system of non-interacting fermions at temperature $T$ and chemical potential $\\mu$: $f(E) = 1/(e^{(E-\\mu)/k_BT} + 1)$. Because of Pauli exclusion, $0 \\leq f(E) \\leq 1$. At $T = 0$ it becomes a perfect step that fills all states below the Fermi energy $E_F = \\mu(0)$ and leaves higher states empty; at finite $T$ the step softens over an energy width $\\sim k_BT$. This distribution governs electrons in metals, semiconductors, and white-dwarf stars.",
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
        definition:
          "The Bose-Einstein distribution gives the average occupation of a quantum state of energy $E$ in a system of non-interacting bosons: $f(E) = 1/(e^{(E-\\mu)/k_BT} - 1)$. Unlike fermions, this can grow arbitrarily large — and below a critical temperature $T_c \\propto (n/\\zeta(3/2))^{2/3}$ in 3D a macroscopic fraction of the bosons collapses into the single lowest-energy state, forming a Bose-Einstein condensate (BEC). In a BEC, a large number of atoms share one quantum wavefunction, producing macroscopic quantum coherence — observed first in 1995 with cooled rubidium atoms.",
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
        definition:
          "A microstate is a complete specification of every degree of freedom in a system (e.g., the position and momentum of each particle), while a macrostate is the small set of bulk variables an experimenter actually measures (energy, volume, particle number). The number of microstates compatible with a given macrostate is the multiplicity $\\Omega$, and Boltzmann's entropy $S = k_B \\ln\\Omega$ counts the logarithm of that multiplicity. The macrostate with overwhelmingly the largest $\\Omega$ is what we observe at equilibrium — making the second law a statement about combinatorics.",
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
        definition:
          "The entropy of mixing is the increase in entropy when two or more distinguishable substances are combined, even when no heat is exchanged: $\\Delta S_{\\text{mix}} = -Nk_B \\sum_i x_i \\ln x_i$, where $x_i$ is the mole fraction of species $i$. It is positive whenever there is more than one component because the system gains accessible microstates. This is what drives ideal gases to spontaneously interdiffuse and what gives rise to osmotic pressure and other colligative properties — the classic case where entropy alone, without any energy change, sets the direction of a process.",
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
        definition:
          "Shannon entropy quantifies the average uncertainty (or information content) of a probability distribution: $H(X) = -\\sum_i p_i \\log_2 p_i$ in bits. It is maximal for the uniform distribution (maximum ignorance) and zero for a distribution concentrated on a single outcome (perfect knowledge). The Gibbs entropy of statistical mechanics, $S = -k_B \\sum_i p_i \\ln p_i$, is the same formula in different units — making thermodynamic entropy literally a measure of missing microscopic information about the system.",
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
        definition:
          "A 1D random walk is a stochastic process in which a walker takes successive steps of $\\pm 1$ on the integer line, each chosen independently with probability $1/2$. After $N$ steps the position $X_N = \\sum s_i$ has zero mean and variance $\\langle X_N^2\\rangle = N$, so the typical displacement scales as $\\sqrt{N}$ rather than $N$. By the Central Limit Theorem, $X_N/\\sqrt{N}$ converges to a standard normal distribution — the simplest model of diffusion and the basis for Brownian motion.",
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
        definition:
          "A 2D random walk has the walker take independent random steps in the plane; the continuous limit is Brownian motion (the Wiener process), in which the position $\\vec{r}(t)$ has independent Gaussian increments with $\\langle r^2\\rangle = 2dDt$ in $d$ dimensions. Pólya's theorem says the walk is recurrent in 1D and 2D — the walker returns to the origin with probability 1 — but transient in 3D, where the return probability drops to about 34%. This model captures everything from pollen grains in water to coarse-grained polymer chains.",
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
        definition:
          "The diffusion equation $\\partial c/\\partial t = D\\nabla^2 c$ describes how the concentration $c(\\vec{r}, t)$ of a substance evolves under random microscopic motion, with diffusion coefficient $D$ (units m$^2$/s). It is derived by combining Fick's law $\\vec{J} = -D\\nabla c$ with conservation of mass. Its fundamental solution from a point source is the Gaussian $c(x,t) = (4\\pi Dt)^{-1/2}\\,e^{-x^2/4Dt}$ whose width grows as $\\sqrt{Dt}$ — the macroscopic signature of underlying random walks.",
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
        definition:
          "The 2D Ising model places a spin variable $s_i = \\pm 1$ on every site of a square lattice and assigns energy $E = -J\\sum_{\\langle i,j\\rangle} s_i s_j$ from interactions between nearest neighbors. With ferromagnetic coupling $J > 0$, neighboring spins prefer to align, while thermal fluctuations at temperature $T$ disorder them. Onsager (1944) showed that this system undergoes a true continuous phase transition at $k_BT_c = 2J/\\ln(1+\\sqrt{2}) \\approx 2.269\\,J$ — making the Ising model the canonical setting for studying collective order and phase transitions.",
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
        definition:
          "A phase transition is a qualitative change in the equilibrium state of a many-body system as a control parameter (typically temperature) crosses a critical value. In a continuous (second-order) transition, an order parameter such as the magnetization $M$ rises continuously from zero below $T_c$, $M \\propto (T_c - T)^\\beta$, while susceptibility and correlation length diverge. The 2D Ising transition at $T_c \\approx 2.269\\,J/k_B$ is the textbook example, marking the boundary between an ordered ferromagnetic phase and a disordered paramagnetic one.",
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
        definition:
          "A critical point is the location of a continuous phase transition, where the correlation length $\\xi$ — the typical distance over which fluctuations are correlated — diverges as $\\xi \\propto |T - T_c|^{-\\nu}$. Right at $T_c$, the system has no characteristic length scale: the spin-spin correlation function decays as a power law $C(r) \\sim r^{-(d-2+\\eta)}$ and configurations look statistically the same at every magnification, i.e. they are scale-invariant (and statistically fractal). Critical exponents like $\\beta, \\gamma, \\nu, \\eta$ are universal — they depend only on dimensionality and symmetry, not microscopic details.",
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
        definition:
          "Monte Carlo $\\pi$ estimation uses geometric probability to approximate $\\pi$. Throw $N$ uniformly random points $(x, y)$ into a unit square; the probability that any point lies inside the inscribed unit-radius quarter-circle is the area ratio $\\pi/4$. So $\\hat\\pi = 4\\,(\\text{points inside})/N$, with statistical error decreasing as $1/\\sqrt{N}$. It is the simplest illustration of how random sampling can solve a deterministic problem and reveals the slow but dimension-independent convergence rate of Monte Carlo methods.",
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
        definition:
          "Monte Carlo integration estimates a definite integral as the average of the integrand at uniformly random sample points: $\\int_a^b f(x)\\,dx \\approx \\frac{b-a}{N}\\sum_{i=1}^N f(x_i)$. The statistical error scales as $1/\\sqrt{N}$ regardless of the dimension of the integration domain — the crucial advantage over deterministic quadrature, which suffers the curse of dimensionality and needs $N^d$ grid points in $d$ dimensions. Variance can be further reduced via importance, stratified, or quasi-random sampling.",
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
        definition:
          "Markov Chain Monte Carlo (MCMC) generates samples from a complicated probability distribution $\\pi(x)$ — even one whose normalization is unknown — by constructing a Markov chain whose stationary distribution is exactly $\\pi$. In the Metropolis-Hastings algorithm, a candidate move $x \\to x'$ is proposed from $q(x'|x)$ and accepted with probability $\\alpha = \\min(1, \\pi(x')q(x|x')/(\\pi(x)q(x'|x)))$, ensuring detailed balance. MCMC underlies modern Bayesian inference, lattice QCD, Ising simulations, and most large-scale statistical computation.",
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
        definition:
          "An ideal gas is a model of $N$ point particles that do not interact except by elastic collisions. Its equation of state is $PV = Nk_BT$, where $P$ is pressure, $V$ volume, $T$ absolute temperature, and $k_B$ the Boltzmann constant. Kinetic theory shows that pressure arises from molecular momentum transfer to the walls, $P = \\tfrac{1}{3}nm\\langle v^2\\rangle$, and the average translational kinetic energy per particle is $\\tfrac{3}{2}k_BT$. The model is accurate whenever the gas is dilute and far from condensation.",
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
        definition:
          "The equipartition theorem states that, in classical thermal equilibrium at temperature $T$, every quadratic term in the system's Hamiltonian contributes exactly $\\tfrac{1}{2}k_BT$ to the average energy. So a monatomic gas (3 translational degrees of freedom) has $\\langle E\\rangle = \\tfrac{3}{2}Nk_BT$, while a diatomic gas at room temperature adds 2 rotational modes for $\\tfrac{5}{2}Nk_BT$. Equipartition fails at low temperature when $k_BT$ falls below the spacing of quantum levels — a degree of freedom \"freezes out\" — which is why heat capacities drop at low $T$.",
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
        definition:
          "The heat capacity $C_v = (\\partial E/\\partial T)_V$ measures how much energy a substance must absorb to raise its temperature by 1 K at constant volume. Classical equipartition predicts $C_v = 3Nk_B$ for a solid (the Dulong-Petit law), but experiments show $C_v \\to 0$ as $T \\to 0$. Einstein modeled the solid as $N$ quantum oscillators of one frequency, giving an exponential freeze-out, and Debye improved this with a continuous spectrum up to a cutoff $\\omega_D$, predicting the famous low-temperature law $C_v \\propto T^3$ that matches experiments.",
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
        definition:
          "The Carnot cycle is a reversible four-stroke thermodynamic cycle consisting of two isothermal steps (one at hot temperature $T_h$, one at cold $T_c$) and two adiabatic steps connecting them. Because every step is reversible, it produces zero entropy and achieves the maximum possible efficiency for any engine operating between those two reservoirs: $\\eta_{\\text{Carnot}} = 1 - T_c/T_h$. No engine, regardless of working substance, can exceed this — it is a fundamental upper bound set by the second law of thermodynamics.",
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
        definition:
          "A heat engine is any device that operates in a cycle to convert thermal energy into mechanical work by drawing heat $Q_h$ from a hot reservoir, performing work $W$, and rejecting waste heat $Q_c$ to a cold reservoir. Energy conservation requires $Q_h = W + Q_c$, and the efficiency $\\eta = W/Q_h = 1 - Q_c/Q_h$ measures the fraction converted into useful work. The second law forbids $Q_c = 0$, so $\\eta < 1$ always, and Carnot's theorem caps it at $1 - T_c/T_h$ — the reason your car engine and power plant can never be 100% efficient.",
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
        definition:
          "The second law of thermodynamics states that the total entropy of an isolated system never decreases: $\\Delta S_{\\text{total}} \\geq 0$, with equality only for reversible processes. Equivalently (Clausius), heat does not spontaneously flow from a colder body to a hotter one without external work. Statistically, this is overwhelmingly probable rather than absolutely forbidden — the law follows from the fact that disordered macrostates correspond to vastly more microstates than ordered ones — and it is the origin of the thermodynamic arrow of time.",
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
        definition:
          "The Helmholtz free energy is the thermodynamic potential $F = E - TS$, with differential $dF = -S\\,dT - P\\,dV$. It is the natural function of the variables $(T, V, N)$ and a system in thermal contact with a bath at temperature $T$ minimizes $F$ at equilibrium. Statistically it is computed from the partition function: $F = -k_BT \\ln Z$. The competition between energy $E$ (favored at low $T$) and the entropy term $-TS$ (favored at high $T$) is what selects ordered vs disordered phases.",
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
        definition:
          "The van der Waals equation of state corrects the ideal gas law to include short-range attraction and excluded molecular volume: $(P + aN^2/V^2)(V - Nb) = Nk_BT$, where $a$ measures the attractive interaction strength and $b$ is the volume excluded per molecule. Despite its simplicity it captures the essential physics of the liquid-gas transition, predicting a critical point at $T_c = 8a/(27bk_B)$ above which liquid and gas become indistinguishable. It is the founding example of how a simple two-parameter model can describe phase coexistence.",
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
        definition:
          "A phase diagram is a map of which thermodynamic phase (solid, liquid, gas, or others) is stable at each combination of intensive variables, most commonly pressure $P$ and temperature $T$. Phases are separated by coexistence curves whose slopes obey the Clausius-Clapeyron relation $dP/dT = \\Delta H/(T\\Delta V)$, and special points include the triple point (where three phases meet) and the critical point (where the liquid-gas line terminates). Phase diagrams encode all the equilibrium thermodynamics of a substance in a single picture.",
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
        definition:
          "In the canonical ensemble, a system in contact with a heat bath has a fluctuating energy whose variance is exactly $\\langle (\\Delta E)^2\\rangle = k_BT^2\\,C_v$ — a deep link between a thermodynamic response (heat capacity) and a statistical fluctuation. For a macroscopic system the relative size $\\Delta E/\\langle E\\rangle \\sim 1/\\sqrt{N}$ is tiny ($\\sim 10^{-12}$ for a mole of particles), which is why thermodynamics looks deterministic. Near critical points $C_v$ diverges, so fluctuations can become huge and visible (critical opalescence).",
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
        definition:
          "The fluctuation-dissipation theorem (FDT) states that the linear response of a system to a small external perturbation is determined by the spontaneous equilibrium fluctuations of the same observable. Familiar examples include the magnetic susceptibility $\\chi = \\beta\\langle(\\Delta M)^2\\rangle$, the compressibility $\\kappa_T \\propto \\langle(\\Delta N)^2\\rangle$, and the Einstein relation $D = k_BT/\\gamma$ between diffusion and friction. The FDT is why measuring thermal noise (Johnson noise in resistors, Brownian motion of a bead) can be used to determine response coefficients without ever applying a perturbation.",
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
        definition:
          "Brownian motion is the irregular trajectory of a small particle suspended in a fluid, caused by countless random collisions with the surrounding molecules. The Langevin equation $m\\,dv/dt = -\\gamma v + \\sqrt{2\\gamma k_BT}\\,\\xi(t)$ models it as deterministic Stokes friction $-\\gamma v$ plus a random thermal force $\\xi(t)$ with zero mean and white-noise correlations. After many friction times the particle diffuses with $\\langle r^2(t)\\rangle = 2dDt$ and Einstein's relation $D = k_BT/\\gamma$, providing the historical proof (Einstein 1905) that atoms are real.",
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
  {
    id: "s11",
    num: "S11",
    title: "PV Diagrams & Thermodynamic Cycles",
    description:
      "Pressure-volume diagrams are the roadmap of thermodynamics. Every process — isothermal, adiabatic, isobaric, isochoric — traces a distinct path on the PV plane. The area enclosed by a cyclic path equals the net work extracted, connecting abstract state functions to mechanical energy.",
    color: "#ef4444",
    icon: "\u{1F525}",
    shortDesc: "Cycles, work & efficiency",
    sections: [
      {
        id: "isothermal-adiabatic",
        title: "Isothermal & Adiabatic Processes",
        description:
          "An isothermal process keeps temperature constant (PV = nRT = const), while an adiabatic process exchanges no heat (PV\u1D5E = const). Adiabatic curves are steeper because temperature changes as the gas does work.",
        definition:
          "An isothermal process holds the temperature fixed by exchanging heat with a reservoir, so for an ideal gas $PV = $ const and the work $W = nRT\\ln(V_2/V_1)$ exactly equals the heat absorbed. An adiabatic process is one in which no heat is exchanged ($Q = 0$), so all the work comes at the expense of internal energy and the gas cools when expanding; the path obeys $PV^\\gamma = $ const with $\\gamma = C_p/C_v$. Adiabatic curves are steeper than isotherms on a $PV$ diagram, which is the geometric reason engines can extract net work by combining the two.",
        statisticalTools: [
          { name: "Ideal Gas Law", desc: "PV = nRT. The equation of state relating pressure, volume, temperature, and amount of gas. Defines the isothermal curves on a PV diagram." },
          { name: "Isothermal Process", desc: "T = \\text{const}, so PV = \\text{const}. The gas exchanges heat with a reservoir to maintain temperature. Work done: W = nRT\\ln(V_2/V_1)." },
          { name: "Adiabatic Process", desc: "Q = 0, so PV^\\gamma = \\text{const}. No heat exchange — the gas heats up when compressed and cools when expanded. Faster pressure change than isothermal." },
          { name: "Heat Capacity Ratio", desc: "\\gamma = C_p/C_v. Monatomic ideal gas: \\gamma = 5/3. Diatomic: \\gamma = 7/5. Determines the steepness of adiabatic curves." },
          { name: "Work as Area", desc: "W = \\int P\\,dV. The work done by the gas equals the area under the PV curve. Positive for expansion, negative for compression." },
          { name: "First Law of Thermodynamics", desc: "\\Delta U = Q - W. Internal energy change equals heat added minus work done. For isothermal ideal gas: \\Delta U = 0, so Q = W." },
          { name: "Adiabatic Temperature Change", desc: "TV^{\\gamma-1} = \\text{const}. Compressing a gas adiabatically raises its temperature. This is why diesel engines ignite fuel without a spark." },
          { name: "Polytropic Process", desc: "PV^n = \\text{const} with exponent n. Isothermal: n=1. Adiabatic: n=\\gamma. Isobaric: n=0. Isochoric: n=\\infty." },
          { name: "Reversibility", desc: "A quasi-static process that can be reversed without entropy increase. Real processes are irreversible — friction, turbulence, and finite temperature differences create entropy." },
          { name: "Compressibility", desc: "\\kappa_T = -\\frac{1}{V}\\frac{\\partial V}{\\partial P}\\Big|_T. Isothermal compressibility. For an ideal gas: \\kappa_T = 1/P." },
        ],
        keyEquations: [
          "PV = nRT \\quad \\text{(isothermal)}",
          "PV^\\gamma = \\text{const} \\quad \\text{(adiabatic)}",
          "W_{\\text{iso}} = nRT\\ln\\frac{V_2}{V_1}",
        ],
        conceptSummary:
          "Compare isothermal and adiabatic curves on the same PV diagram. Adjust temperature and \u03B3 to see how the curves change shape. Notice the adiabatic curve is always steeper.",
      },
      {
        id: "thermodynamic-cycles",
        title: "Thermodynamic Cycles",
        description:
          "A thermodynamic cycle returns the working substance to its initial state after a series of processes. The net work equals the enclosed area on the PV diagram. Famous cycles include Carnot (maximum theoretical efficiency), Otto (gasoline engine), Diesel, and Stirling.",
        definition:
          "A thermodynamic cycle is a sequence of processes that returns the working substance to its initial thermodynamic state, so all state functions (energy, entropy) come back to their starting values. The net work delivered per cycle is the area enclosed by the path on a $PV$ diagram, $W_{\\text{net}} = \\oint P\\,dV$ — clockwise loops are heat engines, counterclockwise loops are refrigerators or heat pumps. Important examples include the Carnot, Otto (gasoline engines), Diesel, and Stirling cycles, each built from different combinations of isothermal, adiabatic, isobaric, and isochoric segments.",
        statisticalTools: [
          { name: "Carnot Cycle", desc: "Two isothermals + two adiabats. The most efficient cycle possible between two temperatures: \\eta = 1 - T_c/T_h. No real engine can exceed this." },
          { name: "Otto Cycle", desc: "Two adiabats + two isochors. Models gasoline engines. Efficiency: \\eta = 1 - r^{1-\\gamma} where r is the compression ratio." },
          { name: "Diesel Cycle", desc: "Two adiabats + one isobar + one isochor. Models diesel engines. Higher compression ratio than Otto, so higher efficiency." },
          { name: "Stirling Cycle", desc: "Two isothermals + two isochors. Uses a regenerator to recycle heat. Theoretical efficiency equals Carnot if regeneration is perfect." },
          { name: "Net Work", desc: "W_{net} = \\oint P\\,dV = \\text{enclosed area}. Clockwise cycles are heat engines (produce work). Counterclockwise are refrigerators (consume work)." },
          { name: "Heat Engine", desc: "Absorbs Q_h from hot reservoir, rejects Q_c to cold reservoir, produces work W = Q_h - Q_c. Efficiency \\eta = W/Q_h." },
          { name: "Coefficient of Performance", desc: "COP = Q_c/W for a refrigerator. COP = Q_h/W for a heat pump. Always COP > 1 for a heat pump (you get more heat than work input)." },
          { name: "Entropy Change in a Cycle", desc: "\\oint dS = 0 for a reversible cycle. For irreversible cycles: \\oint dS > 0. The Clausius inequality." },
          { name: "Compression Ratio", desc: "r = V_{max}/V_{min}. Higher compression ratio generally means higher efficiency. Limited by pre-ignition (knock) in gasoline engines." },
          { name: "Thermal Efficiency", desc: "\\eta = 1 - |Q_c|/|Q_h| = W/Q_h. The fraction of heat input converted to useful work. Always less than 1 (Kelvin-Planck statement)." },
        ],
        keyEquations: [
          "\\eta_{\\text{Carnot}} = 1 - \\frac{T_c}{T_h}",
          "\\eta_{\\text{Otto}} = 1 - r^{1-\\gamma}",
          "W_{\\text{net}} = \\oint P\\,dV",
        ],
        conceptSummary:
          "Choose a thermodynamic cycle and watch it animate on the PV diagram. Adjust hot and cold reservoir temperatures to see how efficiency changes. The enclosed area equals the net work output.",
      },
      {
        id: "cycle-work-efficiency",
        title: "Cycle Work & Efficiency Comparison",
        description:
          "Different thermodynamic cycles have different efficiencies even between the same temperature reservoirs. The Carnot cycle sets the upper bound. Real engines fall short due to irreversibilities, but some designs approach Carnot more closely than others.",
        definition:
          "The thermal efficiency of a cycle is the ratio of net work output to heat absorbed from the hot reservoir, $\\eta = W_{\\text{net}}/Q_h = 1 - Q_c/Q_h$. Carnot's theorem caps it at $\\eta_{\\text{Carnot}} = 1 - T_c/T_h$ for reversible operation, but real cycles like Otto, Diesel, and Stirling fall short because of irreversibilities (friction, finite heat-transfer rates, mixing). A useful practical figure is the endoreversible (Curzon-Ahlborn) efficiency $\\eta_{CA} = 1 - \\sqrt{T_c/T_h}$, which gives the efficiency at maximum power output and often matches real engines more closely.",
        statisticalTools: [
          { name: "Carnot Theorem", desc: "No engine operating between two reservoirs can exceed the efficiency of a reversible (Carnot) engine. All reversible engines between the same reservoirs have the same efficiency." },
          { name: "Second Law Efficiency", desc: "\\eta_{II} = \\eta/\\eta_{Carnot}. Measures how close an engine comes to the theoretical maximum. A useful figure of merit for real engines." },
          { name: "Endoreversible Efficiency", desc: "\\eta_{CA} = 1 - \\sqrt{T_c/T_h}. The Curzon-Ahlborn efficiency for maximum power output (not maximum efficiency). Often closer to real engine efficiencies." },
          { name: "Irreversibility Sources", desc: "Friction, finite-rate heat transfer, turbulence, mixing, and unrestrained expansion all create entropy and reduce efficiency below the Carnot limit." },
          { name: "Mean Effective Pressure", desc: "MEP = W_{net}/(V_{max} - V_{min}). The constant pressure that would produce the same work over the same volume change. Used to compare engine designs." },
          { name: "Power Output", desc: "\\dot{W} = \\eta \\cdot \\dot{Q}_h. Efficiency times heat input rate. Maximum efficiency and maximum power often occur at different operating points." },
          { name: "Regeneration", desc: "Recovering waste heat to preheat the working fluid. The Stirling cycle uses a regenerator. Increases efficiency by reducing the heat that must come from the hot source." },
          { name: "Combined Cycle", desc: "Using exhaust heat from one cycle as input to another. Gas turbine + steam turbine combined cycles achieve > 60% efficiency in modern power plants." },
          { name: "Entropy Production Rate", desc: "\\dot{S}_{gen} = \\dot{Q}/T_c - \\dot{Q}/T_h > 0. The rate of entropy creation measures how far from reversibility the engine operates." },
          { name: "Exergy Analysis", desc: "Exergy = maximum useful work extractable from a system reaching equilibrium with the environment. Destroyed exergy = T_0 \\cdot S_{gen}." },
        ],
        keyEquations: [
          "\\eta_{\\text{max}} = 1 - T_c/T_h \\quad \\text{(Carnot bound)}",
          "\\eta_{II} = \\eta / \\eta_{\\text{Carnot}}",
          "\\eta_{CA} = 1 - \\sqrt{T_c/T_h}",
        ],
        conceptSummary:
          "Compare Carnot, Otto, Diesel, and Stirling efficiencies side by side. Adjust the hot reservoir temperature and compression ratio to see which cycle performs best under different conditions.",
      },
    ],
  },
  {
    id: "s12",
    num: "S12",
    title: "Molecular Dynamics",
    description:
      "Molecular dynamics simulates the motion of particles interacting via realistic potentials. By solving Newton's equations for many-body systems, we can observe emergent phenomena — from gas-liquid phase transitions to the spontaneous emergence of Maxwell-Boltzmann velocity distributions — directly from first principles.",
    color: "#22d3ee",
    icon: "\u{269B}",
    shortDesc: "Lennard-Jones particles & phases",
    sections: [
      {
        id: "lennard-jones",
        title: "Lennard-Jones Particles",
        description:
          "The Lennard-Jones potential V(r) = 4\u03B5[(\u03C3/r)\u00B9\u00B2 - (\u03C3/r)\u2076] models interatomic forces: short-range repulsion (Pauli exclusion) and long-range attraction (van der Waals). It captures the essential physics of noble gases and is the workhorse of computational chemistry.",
        definition:
          "The Lennard-Jones (12-6) potential is a simple two-parameter model of the interaction between a pair of neutral atoms: $V(r) = 4\\varepsilon[(\\sigma/r)^{12} - (\\sigma/r)^6]$. The $r^{-12}$ term gives a steep short-range repulsion (from Pauli exclusion of overlapping electron clouds), the $r^{-6}$ term gives the long-range van der Waals attraction, and the parameters $\\sigma$ (collision diameter) and $\\varepsilon$ (well depth) set the length and energy scales. Despite its simplicity it captures gas, liquid, and solid behavior of noble gases and is the standard test bed for molecular dynamics simulations.",
        statisticalTools: [
          { name: "Lennard-Jones Potential", desc: "V(r) = 4\\varepsilon\\left[\\left(\\frac{\\sigma}{r}\\right)^{12} - \\left(\\frac{\\sigma}{r}\\right)^6\\right]. The 12-6 potential: r^{-12} for repulsion, r^{-6} for attraction. Minimum at r = 2^{1/6}\\sigma." },
          { name: "Reduced Units", desc: "Length in \\sigma, energy in \\varepsilon, time in \\sigma\\sqrt{m/\\varepsilon}. Makes the simulation independent of specific atomic species. T^* = k_BT/\\varepsilon." },
          { name: "Velocity-Verlet Integrator", desc: "x(t+dt) = x(t) + v(t)dt + \\frac{1}{2}a(t)dt^2. Symplectic integrator that conserves energy over long times. Second-order accurate, time-reversible." },
          { name: "Periodic Boundary Conditions", desc: "Particles exiting one side re-enter from the opposite side. Eliminates surface effects and simulates bulk behavior with a small number of particles." },
          { name: "Minimum Image Convention", desc: "Each particle interacts with the nearest image of every other particle. Requires box size L > 2r_{cutoff}." },
          { name: "Force Cutoff", desc: "V(r) = 0 for r > r_c \\approx 2.5\\sigma. Truncating the potential at r_c saves computation. Long-range corrections can be added analytically." },
          { name: "Kinetic Energy", desc: "KE = \\sum_{i=1}^N \\frac{1}{2}m v_i^2. Related to temperature via equipartition: \\langle KE \\rangle = \\frac{d}{2}Nk_BT in d dimensions." },
          { name: "Virial Pressure", desc: "P = \\rho k_BT + \\frac{1}{dV}\\sum_{i<j} \\mathbf{r}_{ij} \\cdot \\mathbf{F}_{ij}. The kinetic (ideal) plus interaction (virial) contributions to pressure." },
          { name: "Thermostat (Velocity Rescaling)", desc: "Scale all velocities by \\sqrt{T_{target}/T_{current}} to maintain constant temperature. Simple but effective for equilibration." },
          { name: "Energy Conservation", desc: "In the microcanonical (NVE) ensemble, total energy E = KE + PE is conserved. Drift in E indicates the timestep is too large." },
        ],
        keyEquations: [
          "V(r) = 4\\varepsilon\\left[\\left(\\frac{\\sigma}{r}\\right)^{\\!12} - \\left(\\frac{\\sigma}{r}\\right)^{\\!6}\\right]",
          "F(r) = -\\frac{dV}{dr} = \\frac{24\\varepsilon}{r}\\left[2\\left(\\frac{\\sigma}{r}\\right)^{\\!12} - \\left(\\frac{\\sigma}{r}\\right)^{\\!6}\\right]",
          "T = \\frac{1}{dNk_B}\\sum_i m v_i^2",
        ],
        conceptSummary:
          "Watch 64 particles interact via the Lennard-Jones potential. Adjust temperature to see the system transition between gas-like and liquid-like behavior. Particles are colored by speed — blue is slow, red is fast.",
      },
      {
        id: "velocity-distribution",
        title: "Velocity Distribution",
        description:
          "Even though particle interactions are complex, the velocity distribution spontaneously converges to the Maxwell-Boltzmann form. This emergent behavior is a deep consequence of statistical mechanics — the most probable macrostate dominates overwhelmingly.",
        definition:
          "The velocity distribution of a classical gas at thermal equilibrium specifies how molecular velocities are spread out. Each Cartesian component is independently Gaussian, $P(v_x) \\propto e^{-mv_x^2/(2k_BT)}$, and the magnitude $v = |\\vec{v}|$ follows the Maxwell-Boltzmann distribution. Equipartition makes the average kinetic energy per degree of freedom $\\tfrac{1}{2}k_BT$, so measuring $\\langle v^2\\rangle$ is operationally equivalent to measuring temperature. Remarkably, this distribution emerges from generic interacting dynamics — a direct consequence of Boltzmann's H-theorem.",
        statisticalTools: [
          { name: "Maxwell-Boltzmann Speed Distribution (2D)", desc: "f(v) = \\frac{v}{k_BT}\\exp\\left(-\\frac{v^2}{2k_BT}\\right). In 2D, the speed distribution is a Rayleigh distribution, peaking at v_{mp} = \\sqrt{k_BT}." },
          { name: "Most Probable Speed", desc: "v_{mp} = \\sqrt{2k_BT/m}. The speed at which the distribution peaks. In 2D: v_{mp} = \\sqrt{k_BT/m}." },
          { name: "Mean Speed", desc: "\\langle v \\rangle = \\sqrt{\\pi k_BT/(2m)}. The average speed. Always greater than v_{mp} because the distribution is skewed right." },
          { name: "RMS Speed", desc: "v_{rms} = \\sqrt{\\langle v^2 \\rangle} = \\sqrt{2k_BT/m} in 2D. Related to kinetic energy: KE = \\frac{1}{2}m v_{rms}^2." },
          { name: "Equipartition Theorem", desc: "\\langle \\frac{1}{2}mv_x^2 \\rangle = \\frac{1}{2}k_BT per degree of freedom. Each velocity component carries k_BT/2 of kinetic energy." },
          { name: "Central Limit Theorem Connection", desc: "Each velocity component is the sum of many small random impulses from collisions, so by CLT it becomes Gaussian: P(v_x) \\propto e^{-mv_x^2/(2k_BT)}." },
          { name: "Speed vs Velocity", desc: "Velocity components are Gaussian (can be negative). Speed v = |\\mathbf{v}| follows the Maxwell-Boltzmann distribution (always positive)." },
          { name: "Ergodic Hypothesis", desc: "Time averages equal ensemble averages for ergodic systems. The velocity histogram converges to MB because the system explores all accessible microstates." },
          { name: "H-theorem", desc: "Boltzmann's H = \\int f \\ln f decreases monotonically until equilibrium (MB distribution). Entropy increases as the system relaxes." },
          { name: "Temperature Measurement", desc: "T = \\frac{m\\langle v^2 \\rangle}{dk_B}. Temperature is defined through the average kinetic energy per degree of freedom d." },
        ],
        keyEquations: [
          "f(v) = \\frac{v}{k_BT}\\exp\\!\\left(-\\frac{v^2}{2k_BT}\\right) \\quad \\text{(2D)}",
          "v_{mp} = \\sqrt{2k_BT/m},\\quad v_{rms} = \\sqrt{2k_BT/m}",
          "\\langle KE \\rangle = \\frac{d}{2}Nk_BT",
        ],
        conceptSummary:
          "Run a molecular dynamics simulation and watch the speed histogram build up. It converges to the Maxwell-Boltzmann prediction — the red theory curve — regardless of initial conditions.",
      },
      {
        id: "radial-distribution",
        title: "Radial Distribution Function",
        description:
          "The radial distribution function g(r) measures the probability of finding a particle at distance r from another, relative to an ideal gas. Its structure reveals the organization of matter: gases have g(r) \u2248 1 everywhere, liquids show oscillating peaks from shells of neighbors, and solids have sharp delta-like peaks at lattice spacings.",
        definition:
          "The radial distribution function $g(r)$ is the probability of finding a particle at distance $r$ from a given reference particle, normalized by what an ideal gas of the same density would give. So $g(r) = 1$ means \"no correlation\" and deviations measure structure: a gas has $g(r) \\to 1$ quickly, a liquid shows damped oscillations marking coordination shells, and a solid produces sharp peaks at lattice distances. The radial distribution function is directly measurable by X-ray and neutron scattering (via the structure factor $S(k)$) and contains essentially all of a fluid's two-body structural information.",
        statisticalTools: [
          { name: "Radial Distribution Function", desc: "g(r) = \\frac{V}{N^2}\\left\\langle \\sum_{i \\neq j} \\delta(r - |\\mathbf{r}_i - \\mathbf{r}_j|)\\right\\rangle. Normalized so g(r) \\to 1 at large r (no correlations)." },
          { name: "Pair Correlation", desc: "g(r) is the pair correlation function. g(r) > 1 means particles are more likely found at distance r than in an ideal gas. g(r) < 1 means depletion." },
          { name: "First Coordination Shell", desc: "The first peak of g(r) gives the most probable nearest-neighbor distance. For LJ: r_{nn} \\approx 2^{1/6}\\sigma \\approx 1.12\\sigma." },
          { name: "Liquid Structure", desc: "Liquids show oscillating g(r) with peaks at r \\approx \\sigma, 2\\sigma, 3\\sigma... Peaks decay exponentially — short-range order, no long-range order." },
          { name: "Gas Structure", desc: "At high T, g(r) \\to 1 quickly after a depletion zone near r < \\sigma. Particles are nearly uncorrelated — ideal gas behavior." },
          { name: "Solid Structure", desc: "In a crystal, g(r) has sharp peaks at lattice distances. The peaks don't decay — long-range order persists. Amorphous solids have broader peaks." },
          { name: "Coordination Number", desc: "n_1 = 2\\pi\\rho \\int_0^{r_{min}} g(r) r\\, dr. The average number of nearest neighbors, found by integrating g(r) to the first minimum." },
          { name: "Static Structure Factor", desc: "S(k) = 1 + \\rho \\int [g(r) - 1] e^{ikr} dr. The Fourier transform of g(r). Measured directly in X-ray and neutron scattering experiments." },
          { name: "Equation of State from g(r)", desc: "P = \\rho k_BT - \\frac{\\rho^2}{2d}\\int g(r) r V'(r) dr. The pressure can be calculated from g(r) and the pair potential." },
          { name: "Ornstein-Zernike Equation", desc: "h(r) = c(r) + \\rho \\int c(|\\mathbf{r} - \\mathbf{r}'|) h(r') d\\mathbf{r}'. Relates total correlation h = g - 1 to the direct correlation function c(r)." },
        ],
        keyEquations: [
          "g(r) = \\frac{1}{\\rho N}\\left\\langle \\sum_{i \\neq j} \\delta(r - r_{ij})\\right\\rangle \\frac{1}{2\\pi r}",
          "n_1 = 2\\pi\\rho\\int_0^{r_{\\min}} g(r)\\,r\\,dr",
          "S(k) = 1 + \\rho\\int [g(r)-1]e^{ikr}dr",
        ],
        conceptSummary:
          "Watch g(r) build up from molecular dynamics. At low temperature, sharp peaks reveal liquid-like structure with coordination shells. At high temperature, g(r) flattens toward 1 as the system becomes gas-like.",
      },
    ],
  },
  {
    id: "s13",
    num: "S13",
    title: "Blackbody Radiation",
    description:
      "A blackbody absorbs all incident radiation and emits a characteristic spectrum that depends only on temperature. Planck's law, which correctly describes this spectrum, required the revolutionary hypothesis that energy is quantized — marking the birth of quantum mechanics in 1900.",
    color: "#fbbf24",
    icon: "\u{2600}",
    shortDesc: "Planck's law & the quantum revolution",
    sections: [
      {
        id: "planck-spectrum",
        title: "Planck's Law",
        description:
          "Planck's spectral radiance formula gives the power emitted per unit area per unit wavelength per unit solid angle by a blackbody at temperature T. It peaks at shorter wavelengths for hotter objects and perfectly explains the observed spectrum.",
        definition:
          "Planck's law gives the spectral radiance of an ideal blackbody at temperature $T$: $B(\\lambda, T) = \\frac{2hc^2}{\\lambda^5}\\frac{1}{e^{hc/\\lambda k_BT} - 1}$. It is derived by combining the density of electromagnetic modes in a cavity with the average energy of a quantum oscillator, $\\langle E\\rangle = h\\nu/(e^{h\\nu/k_BT} - 1)$. Historically, the quantization assumption $E_n = nh\\nu$ that Planck introduced to fit this curve in 1900 marked the birth of quantum mechanics, and the formula correctly predicts both Wien's displacement law and the $T^4$ Stefan-Boltzmann scaling.",
        statisticalTools: [
          { name: "Planck's Law (wavelength)", desc: "B(\\lambda, T) = \\frac{2hc^2}{\\lambda^5}\\frac{1}{e^{hc/(\\lambda k_BT)} - 1}. The spectral radiance of a blackbody. The 1/(e^x - 1) factor comes from Bose-Einstein statistics for photons." },
          { name: "Planck's Law (frequency)", desc: "B(\\nu, T) = \\frac{2h\\nu^3}{c^2}\\frac{1}{e^{h\\nu/(k_BT)} - 1}. The frequency form. Note: \\lambda_{max} and \\nu_{max} correspond to different wavelengths!" },
          { name: "Energy Quantization", desc: "E_n = nh\\nu. Planck's radical hypothesis: oscillators in the cavity walls can only emit/absorb energy in discrete quanta. This suppresses the UV catastrophe." },
          { name: "Photon Statistics", desc: "\\langle n \\rangle = \\frac{1}{e^{h\\nu/(k_BT)} - 1}. Mean photon number follows Bose-Einstein distribution. At low frequency: \\langle n \\rangle \\approx k_BT/(h\\nu) \\gg 1." },
          { name: "Wien's Displacement Law", desc: "\\lambda_{max} T = b = 2.898 \\times 10^{-3}\\;\\text{m\\cdot K}. The peak wavelength scales inversely with temperature." },
          { name: "Stefan-Boltzmann Law", desc: "P = \\sigma T^4 where \\sigma = 5.670 \\times 10^{-8}\\;\\text{W/(m^2 K^4)}. Total radiated power per unit area. Derived by integrating Planck's law over all wavelengths." },
          { name: "Spectral Emissivity", desc: "Real objects emit less than a blackbody: B_{real} = \\varepsilon(\\lambda) B_{BB}. Emissivity \\varepsilon \\leq 1. Kirchhoff's law: \\varepsilon(\\lambda) = \\alpha(\\lambda) (absorptivity)." },
          { name: "Color Temperature", desc: "The temperature of a blackbody that best matches an object's color. The Sun (T = 5778 K) peaks near 500 nm (green), but appears white due to the broad spectrum." },
          { name: "Cosmic Microwave Background", desc: "The CMB is a nearly perfect blackbody at T = 2.725 K, peaking at \\lambda \\approx 1.1 mm (microwave). It's the afterglow of the Big Bang." },
          { name: "Photon Gas Thermodynamics", desc: "For a photon gas: U/V = aT^4, P = U/(3V), S = (4/3)aT^3 V. The photon gas has zero chemical potential (\\mu = 0) because photon number is not conserved." },
        ],
        keyEquations: [
          "B(\\lambda,T) = \\frac{2hc^2}{\\lambda^5}\\frac{1}{e^{hc/(\\lambda k_BT)}-1}",
          "\\lambda_{\\max} T = 2.898 \\times 10^{-3}\\;\\text{m\\cdot K}",
          "P = \\sigma T^4",
        ],
        conceptSummary:
          "Sweep the temperature slider and watch the Planck spectrum shift and grow. The color swatch shows the perceived color of the blackbody. The Wien peak marker tracks the wavelength of maximum emission.",
      },
      {
        id: "wien-law",
        title: "Wien's Displacement Law",
        description:
          "Wien's displacement law states that the peak wavelength of blackbody emission is inversely proportional to temperature. Hotter objects glow blue-white, cooler objects glow red. By overlaying spectra at different temperatures, the systematic shift of the peak becomes visually striking.",
        definition:
          "Wien's displacement law states that the wavelength at which a blackbody's spectrum peaks is inversely proportional to its absolute temperature: $\\lambda_{\\max} T = b \\approx 2.898 \\times 10^{-3}$ m$\\cdot$K. It follows directly from maximizing Planck's law with respect to wavelength and explains everyday thermal color: a room-temperature object peaks in the far infrared ($\\lambda \\sim 10\\,\\mu$m), the Sun (5778 K) peaks near 500 nm (visible green), and blue stars exceed 10,000 K. The same rule is used to estimate stellar temperatures from their colors.",
        statisticalTools: [
          { name: "Wien's Law Derivation", desc: "Set dB/d\\lambda = 0 in Planck's formula. This gives the transcendental equation (5 - x)e^x = 5 where x = hc/(\\lambda k_BT). Solution: x \\approx 4.965." },
          { name: "Wien's Constant", desc: "b = hc/(4.965 k_B) = 2.898 \\times 10^{-3}\\;\\text{m\\cdot K}. The proportionality constant in \\lambda_{max} = b/T." },
          { name: "Color-Temperature Relation", desc: "T < 3000 K: reddish (incandescent bulb). T \\approx 5500 K: white (sunlight). T > 10000 K: bluish (hot stars). The sequence R-O-Y-W-B with increasing T." },
          { name: "Stellar Classification", desc: "O stars: T > 30000 K (blue). B: 10000-30000 K. A: 7500-10000 K. F: 6000-7500 K. G (Sun): 5200-6000 K. K: 3700-5200 K. M: < 3700 K (red)." },
          { name: "Wien's Frequency Law", desc: "\\nu_{max} = 2.821 k_BT/h \\approx 5.879 \\times 10^{10} T\\;\\text{Hz/K}. The peak frequency increases linearly with T — not the inverse of \\lambda_{max}!" },
          { name: "Spectral Power Scaling", desc: "B_{max} \\propto T^5. The peak intensity scales as the fifth power of temperature. Doubling T increases peak brightness by 32x." },
          { name: "Total Power Scaling", desc: "Integrating Planck's law: P \\propto T^4 (Stefan-Boltzmann). Doubling T increases total radiation by 16x." },
          { name: "Wien's Approximation", desc: "B \\approx \\frac{2hc^2}{\\lambda^5}e^{-hc/(\\lambda k_BT)}. Valid for short wavelengths (hc/\\lambda \\gg k_BT). Accurate on the Wien (UV) side of the peak." },
          { name: "Astronomical Photometry", desc: "Measuring a star's brightness at two wavelengths gives its color index, which determines temperature via Wien's law. The B-V color index is standard." },
          { name: "Thermal Imaging", desc: "Infrared cameras detect blackbody radiation from room-temperature objects (\\lambda_{max} \\approx 10 \\mu m). Medical, military, and industrial applications." },
        ],
        keyEquations: [
          "\\lambda_{\\max} = \\frac{b}{T} = \\frac{2.898 \\times 10^{-3}}{T}\\;\\text{m}",
          "B_{\\max} \\propto T^5",
          "\\text{Sun: } T = 5778\\;\\text{K} \\Rightarrow \\lambda_{\\max} \\approx 502\\;\\text{nm}",
        ],
        conceptSummary:
          "See five Planck spectra overlaid at different temperatures. As temperature increases, the peak shifts to shorter wavelengths (blue) and the intensity grows dramatically. The dashed Wien line connects the peaks.",
      },
      {
        id: "uv-catastrophe",
        title: "The Ultraviolet Catastrophe",
        description:
          "Classical physics predicted that a blackbody should radiate infinite energy at short wavelengths — the 'ultraviolet catastrophe.' The Rayleigh-Jeans law, derived from classical equipartition, diverges as \u03BB\u207B\u2074. Planck's quantum hypothesis resolved this by showing that high-frequency modes are frozen out because the energy quantum h\u03BD exceeds thermal energy k\u0299T.",
        definition:
          "The ultraviolet catastrophe is the failure of classical electromagnetism plus equipartition to describe blackbody radiation. Counting cavity modes and assigning each energy $k_BT$ yields the Rayleigh-Jeans law $B_{RJ}(\\lambda, T) = 2ck_BT/\\lambda^4$, which correctly matches experiment at long wavelengths but diverges as $\\lambda \\to 0$, predicting infinite total radiated power. Planck resolved the paradox by postulating that each mode of frequency $\\nu$ exchanges energy only in quanta $h\\nu$; when $h\\nu \\gg k_BT$ the Boltzmann factor exponentially suppresses these modes, killing the divergence and launching the quantum revolution.",
        statisticalTools: [
          { name: "Rayleigh-Jeans Law", desc: "B_{RJ}(\\lambda, T) = \\frac{2ck_BT}{\\lambda^4}. The classical prediction: equipartition assigns k_BT energy to each mode. Valid only for long wavelengths (h\\nu \\ll k_BT)." },
          { name: "Ultraviolet Catastrophe", desc: "\\int_0^\\infty B_{RJ} d\\lambda = \\infty. The total energy diverges because the number of modes grows as \\lambda^{-4}. This was 'the most important unresolved problem in physics' (Lord Kelvin)." },
          { name: "Mode Counting", desc: "Number of modes per unit volume in d\\nu: g(\\nu) = 8\\pi\\nu^2/c^3. The density of electromagnetic modes grows quadratically with frequency." },
          { name: "Classical Equipartition", desc: "Each mode gets \\langle E \\rangle = k_BT. Classical statistical mechanics assigns the same energy regardless of frequency. This is the root of the catastrophe." },
          { name: "Planck's Fix", desc: "\\langle E \\rangle = \\frac{h\\nu}{e^{h\\nu/(k_BT)} - 1}. For h\\nu \\ll k_BT: \\langle E \\rangle \\approx k_BT (classical). For h\\nu \\gg k_BT: \\langle E \\rangle \\approx h\\nu e^{-h\\nu/(k_BT)} \\to 0." },
          { name: "Quantum Suppression", desc: "High-frequency modes require a minimum energy quantum h\\nu to be excited. When h\\nu \\gg k_BT, the Boltzmann factor e^{-h\\nu/(k_BT)} exponentially suppresses these modes." },
          { name: "Wien's Law Region", desc: "For short wavelengths where Planck and Wien agree but Rayleigh-Jeans diverges catastrophically. The quantum cutoff prevents the divergence." },
          { name: "Rayleigh-Jeans Region", desc: "For long wavelengths (h\\nu \\ll k_BT), Planck reduces to Rayleigh-Jeans. Classical physics works fine in this regime — many photons per mode." },
          { name: "Historical Significance", desc: "The UV catastrophe (1900) was one of the 'two clouds' over classical physics (Lord Kelvin). Its resolution by Planck launched the quantum revolution." },
          { name: "Energy Density", desc: "u(\\nu) = \\frac{8\\pi\\nu^2}{c^3}\\frac{h\\nu}{e^{h\\nu/(k_BT)}-1}. Planck's spectral energy density. Integrates to u = aT^4 where a = 4\\sigma/c." },
        ],
        keyEquations: [
          "B_{RJ} = \\frac{2ck_BT}{\\lambda^4} \\xrightarrow{\\lambda \\to 0} \\infty \\quad \\text{(catastrophe!)}",
          "B_{\\text{Planck}} = \\frac{2hc^2}{\\lambda^5}\\frac{1}{e^{hc/(\\lambda k_BT)}-1} \\xrightarrow{\\lambda \\to 0} 0",
          "\\langle E \\rangle = \\frac{h\\nu}{e^{h\\nu/(k_BT)}-1}",
        ],
        conceptSummary:
          "See the classical Rayleigh-Jeans curve diverge to infinity at short wavelengths while Planck's quantum curve gracefully peaks and falls. The shaded red zone highlights the UV catastrophe region where classical physics fails spectacularly.",
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
        definition:
          "Ideal projectile motion is the trajectory of a body launched into a uniform gravitational field with no air resistance and no other forces. Galileo's insight is to decompose the motion into independent horizontal (constant velocity) and vertical (constant downward acceleration $g$) components, giving $x(t) = v_0\\cos\\theta\\,t$ and $y(t) = v_0\\sin\\theta\\,t - \\tfrac{1}{2}gt^2$. The path is a parabola with range $R = v_0^2 \\sin(2\\theta)/g$ — maximum at $\\theta = 45^\\circ$ — and complementary launch angles produce equal ranges.",
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
        definition:
          "Aerodynamic drag is the force that air exerts on a moving body, opposing its velocity. For most everyday projectiles (high Reynolds number), drag is quadratic in speed: $\\vec{F}_{\\text{drag}} = -\\tfrac{1}{2}\\rho C_D A |\\vec{v}|\\,\\vec{v}$, with air density $\\rho$, drag coefficient $C_D$, and cross-section $A$. Including drag breaks the time-symmetry of the parabolic trajectory: the descent is steeper than the ascent, the range is shorter, and the optimal launch angle drops below $45^\\circ$. The resulting equations of motion are nonlinear and require numerical integration.",
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
        definition:
          "The Coriolis force is the inertial (fictitious) force that appears when describing motion in a rotating reference frame: $\\vec{F}_{\\text{Cor}} = -2m\\,\\vec{\\Omega} \\times \\vec{v}$, where $\\vec{\\Omega}$ is the frame's angular velocity. On Earth ($\\Omega \\approx 7.3 \\times 10^{-5}$ rad/s), it deflects horizontally moving objects to the right in the Northern hemisphere and to the left in the Southern, with strength proportional to $\\sin(\\text{latitude})$. Combined with wind (a relative-velocity correction to drag), it shapes the trajectories of long-range artillery, hurricanes, and ocean currents.",
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
        definition:
          "A double pendulum consists of one pendulum (mass $m_1$, length $L_1$) attached to a pivot, with a second pendulum (mass $m_2$, length $L_2$) hanging from the bob of the first. The system has two degrees of freedom $(\\theta_1, \\theta_2)$, and its equations of motion follow from the Lagrangian $L = T - V$ via the Euler-Lagrange equations, giving two coupled nonlinear second-order ODEs. At small amplitudes the system reduces to two coupled harmonic oscillators with normal modes; at large amplitudes it becomes the textbook example of deterministic chaos in a simple mechanical system.",
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
        definition:
          "**Phase space** is the abstract space whose coordinates are all the position and momentum (or velocity) variables of a dynamical system; a single point in it specifies the complete state, and the system's evolution traces a unique trajectory. **Hamiltonian flow** conserves phase-space volume (**Liouville's theorem**), so trajectories never cross. A **Poincaré section** samples the trajectory each time it crosses a chosen lower-dimensional surface, turning continuous motion into a discrete map — closed curves indicate regular (quasi-periodic) motion, scattered dots indicate chaos.",
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
        definition:
          "Deterministic chaos is the property of a fully deterministic dynamical system in which neighboring trajectories diverge exponentially fast — a tiny initial difference $|\\delta_0|$ grows as $|\\delta(t)| \\sim |\\delta_0|\\,e^{\\lambda t}$. The Lyapunov exponent $\\lambda = \\lim_{t\\to\\infty} \\tfrac{1}{t}\\ln|\\delta(t)/\\delta_0|$ quantifies this rate; positive $\\lambda$ defines chaos. Although the equations are deterministic, exponential error growth limits long-term prediction to a horizon $t_{\\text{pred}} \\sim (1/\\lambda)\\ln(\\Delta_{\\text{tol}}/\\delta_0)$ — the mechanism behind the \"butterfly effect\".",
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
        definition:
          "A Kepler orbit is the trajectory of a body moving under an attractive inverse-square central force ($F = -GMm/r^2$). Solving the equations of motion shows that the orbit is always a conic section with the force center at one focus, $r(\\theta) = a(1-e^2)/(1 + e\\cos\\theta)$, classified by eccentricity $e$: circles ($e=0$), ellipses ($0<e<1$), parabolas ($e=1$), and hyperbolas ($e>1$). Kepler's three laws — elliptical orbits, equal areas in equal times, and $T^2 \\propto a^3$ — all follow directly from this single force law and motivated Newton's discovery of gravity.",
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
        definition:
          "The effective potential reduces a 2D central-force orbit to an equivalent 1D radial problem by absorbing angular momentum into a centrifugal term: $V_{\\text{eff}}(r) = V(r) + L^2/(2mr^2)$. The radial equation becomes $\\tfrac{1}{2}m\\dot r^2 + V_{\\text{eff}}(r) = E$, so plotting $V_{\\text{eff}}$ together with the constant total energy $E$ classifies orbits at a glance: a horizontal line tangent to the minimum gives a circular orbit, intersections at two radii give a bounded (elliptical) orbit between turning points, and an unbounded $E$ line gives an escape trajectory.",
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
        definition:
          "Bertrand's theorem (1873) states that the only central-force laws for which every bounded orbit is closed are the inverse-square law ($F \\propto 1/r^2$) and the harmonic law ($F \\propto r$). For any other power-law potential, near-circular orbits precess with an apsidal angle $\\Delta\\phi = \\pi/\\sqrt{3-n}$ (for $F \\propto r^{-n}$), tracing rosette patterns rather than closing on themselves. This is why the perihelion of Mercury (which feels small relativistic deviations from pure $1/r^2$ gravity) precesses by $43''$ per century — a small breakdown of Bertrand's special case.",
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
        definition:
          "Euler's equations of motion describe the rotation of a rigid body in its own body-fixed principal axis frame: $I_1\\dot\\omega_1 = (I_2 - I_3)\\omega_2\\omega_3$ and cyclic permutations. Here $I_1, I_2, I_3$ are the principal moments of inertia (eigenvalues of the inertia tensor) and $\\vec\\omega$ is the angular velocity. Even with no external torque the equations are nonlinear and coupled, so the angular velocity components evolve in time even though the total angular momentum (in the lab frame) and rotational kinetic energy are conserved — leading to phenomena like precession, nutation, and the tennis-racket flip.",
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
        definition:
          "The polhode is the curve traced by the angular velocity vector $\\vec\\omega$ in the body-fixed frame as a torque-free rigid body rotates. Because both the kinetic energy ($\\sum I_i\\omega_i^2 = 2T$, an ellipsoid) and the squared angular momentum ($\\sum I_i^2\\omega_i^2 = L^2$, another ellipsoid) are conserved, $\\vec\\omega$ must lie on the intersection of these two surfaces — the polhode. The corresponding curve in the lab frame is called the herpolhode, and the rolling of the polhode on the invariable plane gives Poinsot's beautiful geometric construction of free rigid-body motion.",
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
        definition:
          "The tennis racket theorem (intermediate axis theorem) states that, for a rigid body with three distinct principal moments of inertia $I_1 < I_2 < I_3$, free rotation about either the smallest- or largest-inertia axis is stable, but rotation about the intermediate axis is unstable: any tiny perturbation grows exponentially with rate $\\gamma = \\omega_2\\sqrt{(I_2-I_1)(I_3-I_2)/(I_1 I_3)}$, causing the spin to flip dramatically. Linear stability analysis of Euler's equations proves it, and the famous Dzhanibekov effect filmed on the ISS shows it in action — the same reason a tossed phone tumbles when spun about its middle axis.",
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
        definition:
          "A normal mode is a collective oscillation pattern of a system of coupled oscillators in which every mass moves at the same frequency $\\omega_n$ and with a fixed amplitude ratio. They are found by solving the generalized eigenvalue problem $(K - \\omega^2 M)\\vec{x} = 0$, where $K$ is the stiffness matrix and $M$ is the mass matrix; the eigenvalues are the squared mode frequencies and the eigenvectors are the mode shapes. The normal modes form a complete orthogonal basis, so any motion of the linear system can be written as a unique sum $\\vec x(t) = \\sum_n A_n\\cos(\\omega_n t + \\phi_n)\\,\\vec e_n$.",
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
        definition:
          "Mode superposition uses the linearity of the equations of motion: any motion of a coupled-oscillator system can be expressed as a sum $\\vec x(t) = \\sum_n A_n\\cos(\\omega_n t + \\phi_n)\\,\\vec e_n$, with the amplitudes and phases set by the initial conditions. Each mode evolves independently, so energy is constant within each mode but appears to slosh between physical masses; when two close mode frequencies $\\omega_\\pm$ beat against each other, you see the periodic energy transfer characteristic of two coupled pendulums. This decomposition is the classical mechanical analog of Fourier analysis.",
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
        definition:
          "A dispersion relation is the function $\\omega(k)$ giving the frequency of a wave or normal mode in terms of its wavevector $k$. For a 1D monatomic chain of springs and masses, $\\omega(k) = 2\\sqrt{\\kappa/m}\\,|\\sin(ka/2)|$ — linear at small $k$ (sound waves with speed $v_s = a\\sqrt{\\kappa/m}$) and saturating at the Brillouin zone edge $k = \\pi/a$. The slope $d\\omega/dk$ is the group velocity at which energy and information propagate, and any deviation from a straight line means the medium is dispersive (different wavelengths travel at different speeds).",
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
        definition:
          "An Atwood machine is two masses $m_1$ and $m_2$ connected by an inextensible string passing over a frictionless pulley. The string constraint means the system has a single degree of freedom $q$ (the height of $m_1$); writing the Lagrangian $L = \\tfrac{1}{2}(m_1 + m_2)\\dot q^2 - (m_1 - m_2)gq$ and applying the Euler-Lagrange equation gives the acceleration $\\ddot q = (m_1 - m_2)g/(m_1 + m_2)$ in one step. The device is a classical demonstration that the Lagrangian formalism eliminates the need to compute constraint forces (the tension) explicitly.",
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
        definition:
          "A bead constrained to slide without friction on a circular hoop of radius $R$ rotating about its vertical diameter at angular velocity $\\omega$ illustrates how rotation modifies equilibria. The Lagrangian gives an effective potential $V_{\\text{eff}}(\\theta) = -\\tfrac{1}{2}mR^2\\omega^2\\sin^2\\theta + mgR(1-\\cos\\theta)$, and below $\\omega_c = \\sqrt{g/R}$ the only stable equilibrium is the bottom $\\theta = 0$. Above $\\omega_c$ the bottom becomes unstable and two new symmetric equilibria appear at $\\cos\\theta_{\\text{eq}} = g/(R\\omega^2)$ — a pitchfork bifurcation that is mathematically identical to a continuous symmetry-breaking phase transition.",
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
        definition:
          "A sliding wedge problem has a block of mass $m$ that descends a frictionless inclined wedge of mass $M$ which itself slides freely on a horizontal surface. With two generalized coordinates — the wedge's horizontal position $X$ and the block's distance $s$ along the slope — the Lagrangian contains a cross term $m\\dot s\\dot X\\cos\\alpha$ that couples the two motions. Conservation of horizontal momentum forces the wedge to recoil as the block slides, so the block's effective acceleration along the slope is less than $g\\sin\\alpha$ — an elegant illustration of using generalized coordinates to handle multi-body constrained dynamics.",
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
        definition:
          "A phase portrait is the geometric picture of all possible trajectories of a dynamical system in its phase space (the space of generalized coordinates and momenta). For a single conservative degree of freedom with Hamiltonian $H(q, p) = p^2/(2m) + V(q)$, Hamilton's equations $\\dot q = \\partial H/\\partial p$ and $\\dot p = -\\partial H/\\partial q$ make trajectories follow level curves of $H$. Looking at the portrait reveals at a glance the equilibria (fixed points), stable oscillations (closed loops around centers), and qualitatively different motions separated by separatrices.",
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
        definition:
          "Liouville's theorem states that the flow generated by Hamilton's equations is incompressible in phase space: a small region of initial conditions deforms over time but always retains the same phase-space volume, $\\int dq\\,dp = $ const. Equivalently, the phase-space density $\\rho$ along any trajectory satisfies $d\\rho/dt = 0$. This rigorous conservation law underpins statistical mechanics — it is what justifies treating all microstates of equal energy as equally likely (the microcanonical ensemble) — and it forces information to spread into ever-thinner filaments rather than disappear.",
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
        definition:
          "A fixed point of a dynamical system is a state where all time derivatives vanish — for a 1D Hamiltonian system, a point in phase space where $\\dot q = \\dot p = 0$, equivalent to $V'(q) = 0$ at $p = 0$. Linear stability analysis classifies them: minima of $V$ are centers (purely imaginary eigenvalues, stable closed orbits) and maxima are saddles (real eigenvalues $\\pm\\gamma$, unstable). The separatrix is the special trajectory that passes through a saddle; it divides the phase plane into regions of qualitatively different motion (e.g., a pendulum oscillating below the top vs swinging over).",
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
        definition:
          "Noether's theorem links continuous symmetries of the action to conserved quantities. Time-translation symmetry — the statement that the laws of physics do not change with time, i.e., $\\partial L/\\partial t = 0$ — implies that the Hamiltonian $H = \\sum_i p_i\\dot q_i - L$ is a conserved quantity, $dH/dt = 0$. For natural systems $H$ is just the total mechanical energy $T + V$, so energy conservation is not a separate postulate but a consequence of the homogeneity of time. Explicitly time-dependent forces (parametric driving) break the symmetry and generally fail to conserve energy.",
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
        definition:
          "Spatial-translation symmetry — the homogeneity of space — means that shifting the entire system by a constant displacement leaves the Lagrangian unchanged: $\\partial L/\\partial x_i = 0$ for some coordinate $x_i$. By the Euler-Lagrange equation this immediately implies $\\dot p_i = 0$, i.e., the canonical momentum $p_i = \\partial L/\\partial \\dot x_i$ along that direction is conserved. For a closed system with no external forces, this gives the familiar conservation of total linear momentum $\\vec P = \\sum_a m_a \\vec v_a = $ const, while an external potential breaks the symmetry and exerts a force.",
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
        definition:
          "Rotational symmetry — the isotropy of space — is the statement that rotating the entire system about any axis leaves the Lagrangian unchanged. Noether's theorem then says angular momentum $\\vec L = \\vec r \\times \\vec p$ is conserved. For partial symmetry (e.g., axial: $\\partial L/\\partial \\phi = 0$), only the corresponding component $L_z = mr^2\\dot\\phi$ is conserved. This is why a planet's orbit stays in a plane (no torque from a central force), why ice skaters spin faster as they pull in their arms, and why Kepler's equal-areas law holds.",
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
        definition:
          "A point charge is an idealized particle of charge $q$ with no spatial extent. According to Coulomb's law, it produces an electric field $\\vec E(\\vec r) = k_e q\\hat r/r^2$, with $k_e = 1/(4\\pi\\varepsilon_0) \\approx 8.99 \\times 10^9$ N$\\cdot$m$^2$/C$^2$. The field from any collection of point charges follows the superposition principle: $\\vec E_{\\text{total}} = \\sum_i \\vec E_i$ — fields add as vectors. This linearity is the workhorse of electrostatics and underlies all multipole expansions and continuous-charge calculations.",
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
        definition:
          "Electric field lines are continuous curves whose tangent at every point is in the direction of $\\vec E(\\vec r)$ at that point — formally, $d\\vec r/ds = \\hat E(\\vec r)$. By convention they originate on positive charges and terminate on negative charges (or extend to infinity), and the density of lines piercing a perpendicular area is proportional to $|\\vec E|$. Lines never cross because the field has a unique direction at each point. They are a powerful visualization tool, and the Gauss's law statement that the net flux through a closed surface equals $Q_{\\text{enc}}/\\varepsilon_0$ is just the geometric statement that field lines start and stop on charges.",
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
        definition:
          "An equipotential surface (or in 2D, an equipotential contour) is the locus of points at which the electric potential $V(\\vec r)$ has a constant value. Because the field is the negative gradient of potential, $\\vec E = -\\nabla V$, equipotentials are everywhere perpendicular to electric field lines, and the work done moving a charge between two points on the same equipotential is zero. They are the electrostatic analog of contour lines on a topographic map: closely spaced contours indicate a steep potential gradient and hence a strong field.",
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
        definition:
          "An infinite straight wire carrying steady current $I$ produces a magnetic field whose lines form concentric circles around the wire, with magnitude $B(r) = \\mu_0 I/(2\\pi r)$, where $\\mu_0 = 4\\pi \\times 10^{-7}$ T$\\cdot$m/A is the permeability of free space. The direction is given by the right-hand rule (curl the fingers along $\\vec B$, thumb along $I$). The slow $1/r$ decay (compared with $1/r^2$ for a point charge) reflects the wire's one-dimensional extent, and integrating Biot-Savart along the full wire gives the same result.",
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
        definition:
          "A pair of Helmholtz coils consists of two identical coaxial circular loops of radius $R$ carrying the same current $I$ in the same direction, separated by a distance equal to their radius. With this geometry the second derivative of the on-axis field $d^2B/dz^2$ vanishes at the midpoint between them, producing a remarkably uniform field $B = (4/5)^{3/2}\\mu_0 I/R$ over a substantial central region. Helmholtz coils are the standard tool for producing controlled, low-field, uniform magnetic environments in laboratories — for cancelling Earth's field, NMR, and beam steering.",
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
        definition:
          "Ampère's law states that the line integral of the magnetic field around any closed loop equals $\\mu_0$ times the total current enclosed by the loop: $\\oint \\vec B \\cdot d\\vec l = \\mu_0 I_{\\text{enc}}$ (in differential form, $\\nabla \\times \\vec B = \\mu_0 \\vec J$). It is one of Maxwell's equations and, by exploiting symmetry, gives quick exact answers for the fields of long wires, solenoids, and toroids that would otherwise require complicated Biot-Savart integration. Maxwell extended it with a displacement-current term $\\mu_0\\varepsilon_0\\,d\\Phi_E/dt$ to handle time-varying fields, completing the equations that predict electromagnetic waves.",
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
        definition:
          "A plane electromagnetic wave is a transverse, sinusoidal solution of the source-free Maxwell equations: $\\vec E(z, t) = E_0\\sin(kz - \\omega t)\\hat x$ with an accompanying $\\vec B = (E_0/c)\\sin(kz - \\omega t)\\hat y$. The fields are mutually perpendicular and both perpendicular to the direction of propagation $\\hat z$, with $\\vec E \\times \\vec B$ pointing along the wave's motion. The wave speed is $c = 1/\\sqrt{\\mu_0\\varepsilon_0} \\approx 3 \\times 10^8$ m/s — the speed of light, derived from purely electromagnetic constants — and dispersion is trivial in vacuum ($\\omega = ck$).",
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
        definition:
          "The polarization of an electromagnetic wave is the time-traced pattern of the electric field vector in the plane perpendicular to its direction of propagation. With orthogonal components $E_x = E_{0x}\\cos(\\omega t)$ and $E_y = E_{0y}\\cos(\\omega t + \\delta)$, three cases stand out: linear ($\\delta = 0$, $\\vec E$ oscillates along a fixed line), circular ($\\delta = \\pm\\pi/2$ with $E_{0x} = E_{0y}$, the tip traces a circle), and elliptical (everything else). Polarization controls how light interacts with materials — it underlies polarizing filters, Brewster reflection, optical isolators, and the Malus's law intensity rule $I = I_0\\cos^2\\theta$.",
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
        definition:
          "The Poynting vector $\\vec S = (1/\\mu_0)(\\vec E \\times \\vec B)$ gives the directional energy flux of an electromagnetic field — power per unit area, in W/m$^2$ — at every point in space. Its direction is the local energy flow direction (along $\\vec k$ for a plane wave) and its time average $\\langle S\\rangle = \\tfrac{1}{2}c\\varepsilon_0 E_0^2$ is the intensity that detectors measure. Local energy conservation takes the form $\\partial u/\\partial t + \\nabla \\cdot \\vec S = 0$, and dividing $\\vec S$ by $c$ gives the radiation pressure responsible for solar sails and laser cooling.",
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

// ─── WAVES & OSCILLATIONS ──────────────────────────────────────────

const wavesOscillations: Chapter[] = [
  {
    id: "w1",
    num: "W1",
    title: "Wave Equation in 1D",
    description:
      "The one-dimensional wave equation governs vibrations of strings, sound in tubes, and many other physical systems. Standing waves arise from boundary conditions, and any initial shape can be decomposed into a superposition of normal modes via Fourier analysis.",
    color: "#f59e0b",
    icon: "\u{1F3B5}",
    shortDesc: "Vibrating strings & harmonics",
    sections: [
      {
        id: "standing-waves",
        title: "Standing Waves & Normal Modes",
        description:
          "A string fixed at both ends supports only discrete standing wave modes. The nth mode has n half-wavelengths fitting in the string length, with nodes at fixed positions and antinodes where amplitude is maximum.",
        definition:
          "A standing wave is a stationary pattern of oscillation produced when two waves of the same frequency travel in opposite directions and superpose. On a string of length $L$ fixed at both ends, the boundary conditions $y(0,t) = y(L,t) = 0$ select a discrete set of normal modes $y_n(x, t) = A_n\\sin(n\\pi x/L)\\cos(\\omega_n t)$ with frequencies $f_n = (n/2L)\\sqrt{T/\\mu}$. Each mode has $n - 1$ stationary nodes between the endpoints and $n$ vibrating antinodes — the simple physics behind the harmonic series of guitars, violins, and pipe organs.",
        statisticalTools: [
          { name: "Wave Equation", desc: "\\frac{\\partial^2 y}{\\partial t^2} = c^2 \\frac{\\partial^2 y}{\\partial x^2} where c = \\sqrt{T/\\mu}. Describes transverse displacement y(x,t) of a string with tension T and linear density \\mu." },
          { name: "Normal Mode Solutions", desc: "y_n(x,t) = A_n \\sin(n\\pi x/L)\\cos(\\omega_n t). Each mode is a standing wave with n half-wavelengths in the string of length L." },
          { name: "Mode Frequencies", desc: "\\omega_n = n\\pi c/L, \\quad f_n = n f_1. Frequencies are integer multiples of the fundamental f_1 = c/(2L). This is why strings produce harmonic overtones." },
          { name: "Wavelength Quantization", desc: "\\lambda_n = 2L/n. The boundary conditions (fixed ends) allow only discrete wavelengths. This is analogous to quantum mechanical boundary conditions." },
          { name: "Nodes & Antinodes", desc: "Nodes: points where y=0 always (at x = kL/n). Antinodes: points of maximum displacement (midway between nodes). Mode n has n+1 nodes including endpoints." },
          { name: "Superposition Principle", desc: "The general solution is y(x,t) = \\sum_{n=1}^{\\infty} A_n \\sin(n\\pi x/L)\\cos(\\omega_n t + \\phi_n). Any vibration is a sum of normal modes." },
          { name: "Wave Speed", desc: "c = \\sqrt{T/\\mu}. Increasing tension raises pitch; increasing mass density lowers it. This is how musicians tune stringed instruments." },
          { name: "Boundary Conditions", desc: "Fixed ends: y(0,t) = y(L,t) = 0. Free ends: \\partial y/\\partial x = 0 at the boundary. Mixed conditions produce different mode shapes." },
          { name: "Fundamental Frequency", desc: "f_1 = c/(2L) = \\frac{1}{2L}\\sqrt{T/\\mu}. The lowest resonant frequency of the string. All higher modes are harmonics." },
          { name: "Phase Velocity", desc: "v_{ph} = \\omega/k = c. For the ideal string, all frequencies travel at the same speed — no dispersion." },
        ],
        keyEquations: [
          "\\frac{\\partial^2 y}{\\partial t^2} = c^2 \\frac{\\partial^2 y}{\\partial x^2}",
          "y_n(x,t) = A_n \\sin\\!\\left(\\frac{n\\pi x}{L}\\right)\\cos(\\omega_n t)",
          "f_n = \\frac{n}{2L}\\sqrt{\\frac{T}{\\mu}}",
        ],
        conceptSummary:
          "Select a normal mode and watch the string vibrate. Higher modes have more nodes and higher frequencies. Notice how nodes remain stationary while antinodes oscillate with maximum amplitude.",
      },
      {
        id: "fourier-modes",
        title: "Fourier Decomposition",
        description:
          "Any initial string shape can be expressed as a sum of sinusoidal normal modes. The Fourier coefficients determine how much each harmonic contributes. Adding more harmonics improves the approximation of the original shape.",
        definition:
          "Fourier decomposition expresses any function $f(x)$ on $[0, L]$ as an infinite sum of sinusoidal normal modes, $f(x) = \\sum_{n=1}^\\infty b_n\\sin(n\\pi x/L)$, with coefficients $b_n = (2/L)\\int_0^L f(x)\\sin(n\\pi x/L)\\,dx$ obtained by projecting onto each mode. Smooth shapes have rapidly decaying coefficients (few harmonics needed), while shapes with corners or jumps decay slowly and even exhibit Gibbs overshoot at discontinuities. For a vibrating string the decomposition determines the timbre — the relative weight of each harmonic — distinguishing a plucked from a struck or bowed note.",
        statisticalTools: [
          { name: "Fourier Series", desc: "f(x) = \\sum_{n=1}^{\\infty} b_n \\sin(n\\pi x/L). Any function satisfying the boundary conditions can be expanded in the sine basis of normal modes." },
          { name: "Fourier Coefficients", desc: "b_n = \\frac{2}{L}\\int_0^L f(x)\\sin(n\\pi x/L)\\,dx. The projection of the initial shape onto each normal mode. Larger |b_n| means mode n contributes more." },
          { name: "Pluck Shape (Triangle)", desc: "A string plucked at position x_0 forms a triangle. Its Fourier coefficients decay as 1/n^2, so high harmonics are suppressed — producing a mellow tone." },
          { name: "Strike Shape (Gaussian)", desc: "A narrow Gaussian impulse excites many harmonics roughly equally. Its coefficients decay as e^{-n^2}, giving a bright initial attack that quickly mellows." },
          { name: "Square Pulse", desc: "A rectangular initial shape has coefficients b_n \\propto 1/n (for odd n). The slow decay means many high harmonics — producing a harsh, buzzy sound." },
          { name: "Gibbs Phenomenon", desc: "Near a discontinuity, the Fourier series overshoots by about 9%. This ringing never disappears no matter how many terms are added — it only gets narrower." },
          { name: "Parseval's Theorem", desc: "\\frac{2}{L}\\int_0^L |f(x)|^2 dx = \\sum_{n=1}^{\\infty} |b_n|^2. Total energy is the sum of energies in each mode. Energy is conserved in Fourier space." },
          { name: "Convergence Rate", desc: "Smoother functions have faster-decaying Fourier coefficients. Discontinuities → 1/n, cusps → 1/n^2, smooth → exponential decay." },
          { name: "Orthogonality", desc: "\\int_0^L \\sin(m\\pi x/L)\\sin(n\\pi x/L)dx = \\frac{L}{2}\\delta_{mn}. The sine functions form an orthogonal basis — each mode is independent." },
          { name: "Spectral Analysis", desc: "The set of Fourier coefficients {b_n} is the frequency spectrum. Visualizing the spectrum reveals which harmonics dominate the sound of the string." },
        ],
        keyEquations: [
          "f(x) = \\sum_{n=1}^{\\infty} b_n \\sin\\!\\left(\\frac{n\\pi x}{L}\\right)",
          "b_n = \\frac{2}{L}\\int_0^L f(x)\\sin\\!\\left(\\frac{n\\pi x}{L}\\right)dx",
          "\\sum_{n=1}^{\\infty} |b_n|^2 = \\frac{2}{L}\\int_0^L |f(x)|^2\\,dx",
        ],
        conceptSummary:
          "Choose an initial shape and watch the Fourier reconstruction improve as you add more harmonics. The bar chart shows each coefficient's magnitude — notice how smoother shapes need fewer harmonics.",
      },
      {
        id: "energy-density",
        title: "Energy Distribution",
        description:
          "A vibrating string carries both kinetic and potential energy distributed along its length. The kinetic energy density depends on transverse velocity, while potential energy density depends on local curvature. In a standing wave, energy oscillates between these two forms.",
        definition:
          "The energy density of a vibrating string is the energy per unit length stored in its motion and stretching: $\\mathcal T = \\tfrac{1}{2}\\mu(\\partial y/\\partial t)^2$ (kinetic) and $\\mathcal V = \\tfrac{1}{2}T(\\partial y/\\partial x)^2$ (potential), with $\\mu$ the linear mass density and $T$ the tension. The total energy $E = \\int_0^L (\\mathcal T + \\mathcal V)\\,dx$ is conserved in the absence of damping. In a standing wave, kinetic and potential energy densities oscillate out of phase and out of position — KE peaks at antinodes when the string passes equilibrium, PE peaks at nodes where the slope is steepest — but their time averages are equal (virial theorem).",
        statisticalTools: [
          { name: "Kinetic Energy Density", desc: "\\mathcal{T} = \\frac{1}{2}\\mu\\left(\\frac{\\partial y}{\\partial t}\\right)^2. Energy per unit length due to transverse motion. Maximum at antinodes when the string passes through equilibrium." },
          { name: "Potential Energy Density", desc: "\\mathcal{V} = \\frac{1}{2}T\\left(\\frac{\\partial y}{\\partial x}\\right)^2. Energy per unit length due to stretching. Maximum at nodes where the slope is steepest." },
          { name: "Total Energy Density", desc: "\\mathcal{E} = \\mathcal{T} + \\mathcal{V}. The total energy density varies along the string and oscillates in time, but the integral over the full string is constant." },
          { name: "Energy Conservation", desc: "E_{total} = \\int_0^L (\\mathcal{T} + \\mathcal{V})\\,dx = \\text{const}. Total energy is conserved in the absence of damping. KE and PE interchange but their sum is fixed." },
          { name: "KE-PE Oscillation", desc: "In a standing wave, KE is maximum when y=0 everywhere (string flat, moving fast) and PE is maximum at maximum displacement (string stretched, momentarily at rest)." },
          { name: "Energy per Mode", desc: "E_n = \\frac{1}{4}\\mu\\omega_n^2 A_n^2 L. Each mode carries energy proportional to the square of its amplitude and frequency. Higher modes carry more energy per unit amplitude." },
          { name: "Equipartition of KE and PE", desc: "Time-averaged \\langle T \\rangle = \\langle V \\rangle = E/2. On average, kinetic and potential energies are equal — the virial theorem for harmonic systems." },
          { name: "Energy Flow (Power)", desc: "P(x,t) = -T\\frac{\\partial y}{\\partial x}\\frac{\\partial y}{\\partial t}. Power transmitted along the string. For standing waves, time-averaged power flow is zero — energy doesn't propagate." },
          { name: "Damped Energy Decay", desc: "With damping \\gamma, energy decays as E(t) = E_0 e^{-\\gamma t}. Higher modes decay faster if damping is frequency-dependent. This is why high harmonics die out first." },
          { name: "Energy Spectrum", desc: "The energy in each Fourier mode: E_n \\propto n^2|b_n|^2. Higher modes contribute more energy per unit amplitude due to the \\omega_n^2 factor." },
        ],
        keyEquations: [
          "\\mathcal{T} = \\tfrac{1}{2}\\mu\\left(\\frac{\\partial y}{\\partial t}\\right)^{\\!2}, \\quad \\mathcal{V} = \\tfrac{1}{2}T\\left(\\frac{\\partial y}{\\partial x}\\right)^{\\!2}",
          "E = \\int_0^L (\\mathcal{T} + \\mathcal{V})\\,dx = \\text{const}",
          "\\langle \\mathcal{T} \\rangle = \\langle \\mathcal{V} \\rangle = \\tfrac{1}{2}E",
        ],
        conceptSummary:
          "Watch kinetic (blue) and potential (amber) energy densities oscillate along the string. When the string is flat and moving fast, KE dominates. At maximum displacement, PE dominates. Total energy stays constant.",
      },
    ],
  },
  {
    id: "w2",
    num: "W2",
    title: "Wave Interference & Diffraction",
    description:
      "When waves pass through apertures or encounter obstacles, they spread out (diffract) and overlap (interfere). The resulting intensity patterns — from single slits to complex gratings — reveal the wave nature of light and are foundational to optics and quantum mechanics.",
    color: "#f59e0b",
    icon: "\u{1F30A}",
    shortDesc: "Slits, fringes & gratings",
    sections: [
      {
        id: "single-slit",
        title: "Single-Slit Diffraction",
        description:
          "A plane wave passing through a single narrow slit produces a characteristic diffraction pattern with a broad central maximum flanked by progressively weaker secondary maxima. The pattern width is inversely proportional to the slit width.",
        definition:
          "Single-slit diffraction is the spreading of a wave after it passes through an aperture of width $a$. In the far-field (Fraunhofer) regime the intensity pattern on a screen is $I(\\theta) = I_0(\\sin\\beta/\\beta)^2$ with $\\beta = \\pi a\\sin\\theta/\\lambda$ — a broad central maximum bracketed by minima at $a\\sin\\theta = m\\lambda$ ($m = \\pm 1, \\pm 2, \\dots$) and rapidly fading secondary peaks. The central peak's angular width $\\Delta\\theta \\approx 2\\lambda/a$ shows the inverse relation: narrower slits spread the wave more. This is the wave-mechanical reason microscopes have a finite resolution.",
        statisticalTools: [
          { name: "Huygens' Principle", desc: "Every point on a wavefront acts as a source of secondary spherical wavelets. The new wavefront is the envelope of these wavelets — the basis for understanding diffraction." },
          { name: "Fraunhofer Diffraction", desc: "Far-field approximation: screen distance D \\gg a^2/\\lambda. Rays from different parts of the slit are effectively parallel. The pattern depends only on the angle \\theta." },
          { name: "Single-Slit Intensity", desc: "I(\\theta) = I_0 \\left(\\frac{\\sin\\beta}{\\beta}\\right)^2 where \\beta = \\frac{\\pi a}{\\lambda}\\sin\\theta. The sinc-squared function gives the characteristic diffraction envelope." },
          { name: "Central Maximum Width", desc: "Angular half-width: \\sin\\theta_1 = \\lambda/a. The central peak is twice as wide as the secondary maxima. Narrower slit → wider pattern." },
          { name: "Minima Positions", desc: "a\\sin\\theta = m\\lambda, \\; m = \\pm 1, \\pm 2, \\ldots. Destructive interference occurs when the path difference across the slit equals a whole number of wavelengths." },
          { name: "Secondary Maxima", desc: "Located approximately at \\beta = (m+\\frac{1}{2})\\pi. Each secondary maximum is weaker: the first is only 4.7% of the central peak intensity." },
          { name: "Fresnel Number", desc: "N_F = a^2/(\\lambda D). When N_F \\ll 1, we're in the Fraunhofer regime. When N_F \\sim 1, near-field (Fresnel) effects appear." },
          { name: "Angular Resolution", desc: "Rayleigh criterion: \\theta_{min} = 1.22\\lambda/D (circular aperture). The diffraction limit sets the finest detail an optical system can resolve." },
          { name: "Slit Width Effect", desc: "As a → \\infty, the pattern collapses to a delta function (geometric shadow). As a → 0, the pattern broadens to uniform illumination." },
          { name: "Intensity Normalization", desc: "I_0 \\propto a^2. The central peak intensity increases with slit width squared, while the peak gets narrower — total power is conserved." },
        ],
        keyEquations: [
          "I(\\theta) = I_0 \\left(\\frac{\\sin\\beta}{\\beta}\\right)^{\\!2},\\quad \\beta = \\frac{\\pi a \\sin\\theta}{\\lambda}",
          "\\text{Minima: } a\\sin\\theta = m\\lambda,\\; m = \\pm 1, \\pm 2, \\ldots",
          "\\Delta\\theta_{\\text{central}} = \\frac{2\\lambda}{a}",
        ],
        conceptSummary:
          "Adjust the slit width and watch the diffraction pattern change. A narrower slit produces a wider central maximum. Notice the minima where destructive interference creates dark bands.",
      },
      {
        id: "double-slit",
        title: "Double-Slit Interference",
        description:
          "Young's double-slit experiment demonstrates wave interference: two coherent sources produce an intensity pattern with bright and dark fringes. The fringe spacing depends on slit separation, while the overall envelope is set by single-slit diffraction.",
        definition:
          "The double-slit experiment illuminates two narrow slits separated by distance $d$ with a coherent wave; the two transmitted wavelets interfere on a distant screen. The resulting intensity is $I \\propto \\cos^2(\\pi d\\sin\\theta/\\lambda)$ modulated by the single-slit diffraction envelope, producing bright fringes at $d\\sin\\theta = m\\lambda$ and dark fringes between them, with screen spacing $\\Delta y = \\lambda D/d$. It was Young's original demonstration of the wave nature of light and — when repeated one particle at a time with electrons or photons — remains the iconic evidence for quantum superposition.",
        statisticalTools: [
          { name: "Young's Experiment", desc: "Two narrow slits separated by distance d produce an interference pattern. Bright fringes at d\\sin\\theta = m\\lambda, dark fringes at d\\sin\\theta = (m+\\frac{1}{2})\\lambda." },
          { name: "Path Difference", desc: "\\Delta = d\\sin\\theta. The difference in distance from the two slits to a point on the screen. Constructive interference when \\Delta = m\\lambda." },
          { name: "Double-Slit Intensity", desc: "I = I_{single} \\cdot \\cos^2\\!\\left(\\frac{\\pi d \\sin\\theta}{\\lambda}\\right). The interference fringes are modulated by the single-slit diffraction envelope." },
          { name: "Fringe Spacing", desc: "\\Delta y = \\lambda D/d on the screen (small angle). Closer slits → wider fringes. Shorter wavelength → narrower fringes." },
          { name: "Constructive Interference", desc: "d\\sin\\theta = m\\lambda, \\; m = 0, \\pm 1, \\pm 2, \\ldots. Waves arrive in phase and amplitudes add. Intensity is 4× that of a single slit." },
          { name: "Destructive Interference", desc: "d\\sin\\theta = (m + \\tfrac{1}{2})\\lambda. Waves arrive exactly out of phase and cancel. Complete darkness at these angles." },
          { name: "Coherence Requirement", desc: "The two slits must be illuminated by the same wavefront (spatially coherent). Incoherent sources wash out the fringe pattern." },
          { name: "Missing Orders", desc: "When d/a is an integer, some interference maxima coincide with diffraction minima and vanish. For d = 3a, every 3rd fringe is missing." },
          { name: "Fringe Visibility", desc: "V = (I_{max} - I_{min})/(I_{max} + I_{min}). Perfect visibility V=1 for equal-amplitude slits. Partial coherence reduces V." },
          { name: "Quantum Interpretation", desc: "Even single photons/electrons show the pattern — they interfere with themselves. The pattern builds up statistically. Which-path information destroys interference." },
        ],
        keyEquations: [
          "I(\\theta) = I_0 \\cos^2\\!\\left(\\frac{\\pi d \\sin\\theta}{\\lambda}\\right)\\left(\\frac{\\sin\\beta}{\\beta}\\right)^{\\!2}",
          "\\text{Bright fringes: } d\\sin\\theta = m\\lambda",
          "\\Delta y = \\frac{\\lambda D}{d}",
        ],
        conceptSummary:
          "Watch circular wavefronts from two slits overlap to create interference fringes. Adjust slit separation to change fringe spacing. Toggle the single-slit envelope to see how diffraction modulates the pattern.",
      },
      {
        id: "diffraction-grating",
        title: "Diffraction Grating",
        description:
          "A diffraction grating with N equally spaced slits produces extremely sharp principal maxima at the same angles as the double slit, but with N² times the peak intensity. The sharpness increases with N, making gratings essential for spectroscopy.",
        definition:
          "A diffraction grating is an array of $N$ equally spaced slits (or grooves) of period $d$; coherent light passing through it produces sharp principal maxima at angles satisfying $d\\sin\\theta = m\\lambda$ for integer order $m$. The peak intensity grows as $N^2$ and the angular width shrinks as $\\sim \\lambda/(Nd)$, so larger gratings give correspondingly higher resolving power $R = mN = \\lambda/\\Delta\\lambda$. Because different wavelengths emerge at different angles, gratings are the standard dispersive element in spectrometers, replacing prisms in most modern instruments.",
        statisticalTools: [
          { name: "Grating Intensity", desc: "I = I_{single} \\cdot \\left(\\frac{\\sin(N\\delta/2)}{\\sin(\\delta/2)}\\right)^2 where \\delta = \\frac{2\\pi d \\sin\\theta}{\\lambda}. The multi-slit interference function." },
          { name: "Principal Maxima", desc: "At d\\sin\\theta = m\\lambda, all N slits interfere constructively. Peak intensity = N^2 I_{single}. These are the spectral orders m = 0, \\pm 1, \\ldots" },
          { name: "Peak Sharpening", desc: "The angular width of each principal maximum is \\Delta\\theta \\approx \\lambda/(Nd\\cos\\theta). More slits → sharper peaks → better spectral resolution." },
          { name: "Secondary Maxima", desc: "Between principal maxima there are N-2 secondary maxima and N-1 minima. Secondary peaks are much weaker — the tallest is only about 4.7% of the principal peak." },
          { name: "Resolving Power", desc: "R = mN = \\lambda/\\Delta\\lambda. A grating with N slits in order m can resolve wavelengths differing by \\Delta\\lambda = \\lambda/(mN). More slits = better resolution." },
          { name: "Free Spectral Range", desc: "\\Delta\\lambda_{FSR} = \\lambda/m. The range of wavelengths before orders overlap. Higher orders give better resolution but smaller free spectral range." },
          { name: "Blazed Gratings", desc: "Groove angle optimized to concentrate light into a particular order. The single-slit envelope is shifted so most energy goes into the desired diffraction order." },
          { name: "Grating Equation", desc: "d(\\sin\\theta_i + \\sin\\theta_m) = m\\lambda. For oblique incidence at angle \\theta_i, the diffraction angles shift. This is the general form of the grating equation." },
          { name: "Spectral Dispersion", desc: "\\frac{d\\theta}{d\\lambda} = \\frac{m}{d\\cos\\theta}. Angular dispersion increases with order m and decreases with slit spacing d." },
          { name: "Intensity Envelope", desc: "The single-slit diffraction pattern I_{single}(\\theta) acts as an envelope modulating all the sharp grating peaks. Slit width a determines envelope width." },
        ],
        keyEquations: [
          "I = I_0 \\left(\\frac{\\sin\\beta}{\\beta}\\right)^{\\!2}\\left(\\frac{\\sin(N\\delta/2)}{\\sin(\\delta/2)}\\right)^{\\!2}",
          "\\text{Principal maxima: } d\\sin\\theta = m\\lambda",
          "R = mN = \\frac{\\lambda}{\\Delta\\lambda}",
        ],
        conceptSummary:
          "Increase the number of slits and watch the principal maxima sharpen dramatically. With just 2 slits you get broad fringes; with 20+ slits the peaks become razor-sharp — this is why gratings are used in spectroscopy.",
      },
    ],
  },
  {
    id: "w3",
    num: "W3",
    title: "Doppler Effect",
    description:
      "When a wave source moves relative to an observer, the observed frequency shifts — higher when approaching, lower when receding. At supersonic speeds, a shock wave (Mach cone) forms. The Doppler effect is used in radar, medical ultrasound, and astrophysical redshift measurements.",
    color: "#f59e0b",
    icon: "\u{1F6A8}",
    shortDesc: "Frequency shifts & shock waves",
    sections: [
      {
        id: "moving-source",
        title: "Moving Source & Wavefronts",
        description:
          "A source emitting waves at frequency f while moving at speed v_s compresses wavefronts ahead and stretches them behind. An observer in front hears a higher frequency, while one behind hears a lower frequency.",
        definition:
          "When a wave source moves through the medium at speed $v_s$ while emitting at rest-frame frequency $f$, the wavefronts pile up ahead of it and spread out behind. An observer detects a Doppler-shifted frequency $f' = f\\,v_w/(v_w - v_s\\cos\\theta)$, where $v_w$ is the wave speed and $\\theta$ is the angle between the source's velocity and the line to the observer. Approaching ($\\theta = 0$) gives a higher frequency (blueshift), receding ($\\theta = \\pi$) gives a lower one (redshift) — the everyday effect of a passing siren and the principle behind radar speed guns.",
        statisticalTools: [
          { name: "Classical Doppler Formula", desc: "f' = f \\cdot \\frac{v_w}{v_w \\mp v_s}. Plus for source approaching, minus for receding. v_w = wave speed in the medium, v_s = source speed." },
          { name: "Wavefront Compression", desc: "Ahead of the source: \\lambda' = \\lambda(1 - v_s/v_w). The wavelength is shortened by the ratio (1 - M), where M = v_s/v_w is the Mach number." },
          { name: "Wavefront Stretching", desc: "Behind the source: \\lambda' = \\lambda(1 + v_s/v_w). The wavelength is lengthened. For a source at half wave speed, the rear wavelength is 1.5× the rest wavelength." },
          { name: "Frequency Shift Ratio", desc: "f'/f = 1/(1 - v_s\\cos\\theta/v_w). The general formula for arbitrary angle \\theta between source velocity and the source-observer direction." },
          { name: "Moving Observer", desc: "f' = f(1 + v_o/v_w). A moving observer encounters wavefronts at a different rate. Unlike the moving source case, this is linear in v_o." },
          { name: "Asymmetry", desc: "Moving source and moving observer give different shifts even at the same speed. This asymmetry arises from the medium's preferred frame — relativity resolves it." },
          { name: "Wavelength in Medium", desc: "\\lambda = v_w/f. The spatial period of the wave in the medium. The Doppler effect changes the effective wavelength seen by the observer." },
          { name: "Radial Velocity", desc: "Only the component of source velocity along the line of sight produces a Doppler shift. Transverse motion has no classical Doppler effect (but does relativistically)." },
          { name: "Applications: Radar", desc: "Police radar sends a microwave pulse and measures the Doppler shift of the reflected signal: v = c\\Delta f/(2f_0). Factor of 2 because the wave travels to and from the target." },
          { name: "Applications: Ultrasound", desc: "Medical Doppler ultrasound measures blood flow velocity from the frequency shift of reflected sound waves. Used to detect arterial stenosis and fetal heartbeat." },
        ],
        keyEquations: [
          "f' = f \\cdot \\frac{v_w}{v_w - v_s\\cos\\theta}",
          "\\lambda'_{\\text{front}} = \\lambda\\left(1 - \\frac{v_s}{v_w}\\right)",
          "\\lambda'_{\\text{rear}} = \\lambda\\left(1 + \\frac{v_s}{v_w}\\right)",
        ],
        conceptSummary:
          "Watch wavefronts pile up in front of the moving source and spread out behind it. Adjust the source speed to see how the compression ratio changes. The observed frequency is displayed for both front and rear observers.",
      },
      {
        id: "mach-cone",
        title: "Shock Waves & Mach Cone",
        description:
          "When a source exceeds the wave speed (Mach number > 1), it outruns its own wavefronts. The overlapping wavefronts form a conical shock wave — the Mach cone. The cone angle depends only on the ratio of wave speed to source speed.",
        definition:
          "A Mach cone is the conical shock wave produced when a source moves faster than the wave speed in the medium ($M = v_s/v_w > 1$). The source outruns its own emitted wavefronts, which constructively pile up on a cone whose half-angle satisfies $\\sin\\alpha = 1/M$. For sound, this is the surface of the sonic boom that follows a supersonic aircraft; the same geometry produces ship wakes (Kelvin wedge) and Cherenkov radiation when a charged particle exceeds the local phase speed of light in a transparent medium.",
        statisticalTools: [
          { name: "Mach Number", desc: "M = v_s/v_w. The ratio of source speed to wave speed. M < 1: subsonic. M = 1: sonic (transonic). M > 1: supersonic. M > 5: hypersonic." },
          { name: "Mach Cone Angle", desc: "\\sin\\alpha = 1/M = v_w/v_s. The half-angle of the shock cone. At M = 1: \\alpha = 90°. As M → ∞: \\alpha → 0° (cone narrows)." },
          { name: "Shock Wave Formation", desc: "When M \\geq 1, successive wavefronts overlap on a cone surface. The constructive interference creates a pressure discontinuity — the shock wave." },
          { name: "Sonic Boom", desc: "An observer on the ground hears a sudden loud bang when the Mach cone passes over them. The boom sweeps along the ground as the aircraft moves — it's not a one-time event." },
          { name: "Bow Wave", desc: "The 2D analog: a boat moving faster than water waves creates a V-shaped wake. The half-angle satisfies \\sin\\alpha = v_{wave}/v_{boat}, same as the Mach cone." },
          { name: "Cherenkov Radiation", desc: "The optical analog: a charged particle moving faster than light in a medium (v > c/n) emits blue-white radiation in a cone. Used in particle detectors." },
          { name: "Transonic Region", desc: "Near M = 1, wavefronts pile up but don't form a clean cone. This is the drag divergence regime where aerodynamic forces spike." },
          { name: "Pressure Jump", desc: "Across the shock: pressure, density, and temperature all jump discontinuously. The Rankine-Hugoniot conditions relate the jump magnitudes to M." },
          { name: "Zone of Silence", desc: "An observer outside the Mach cone hasn't yet received any wavefronts from the source — they hear nothing until the cone sweeps past." },
          { name: "Multiple Mach Cones", desc: "Complex supersonic bodies (e.g., aircraft with nose, wings, tail) can create multiple shock waves that coalesce at a distance." },
        ],
        keyEquations: [
          "M = \\frac{v_s}{v_w}, \\quad \\sin\\alpha = \\frac{1}{M}",
          "\\alpha = \\arcsin\\!\\left(\\frac{v_w}{v_s}\\right)",
          "\\text{Boom arrives at } t = \\frac{d}{v_s \\tan\\alpha}",
        ],
        conceptSummary:
          "Slide the Mach number from subsonic to supersonic and watch the shock cone form. Below M=1 the wavefronts spread normally. Above M=1, they pile up into a cone whose angle narrows with increasing speed.",
      },
      {
        id: "observer-frequency",
        title: "Angular Frequency Dependence",
        description:
          "The observed Doppler-shifted frequency depends on the angle between the source velocity and the observer direction. Directly ahead gives maximum blueshift, directly behind gives maximum redshift, and at 90° there is no classical shift (but a relativistic transverse Doppler effect exists).",
        definition:
          "The full angular Doppler formula gives the observed frequency as a function of the angle $\\theta$ between the source's velocity and the line to the observer: $f'(\\theta) = f/[1 - (v_s/v_w)\\cos\\theta]$. It interpolates smoothly between maximum blueshift at $\\theta = 0$, no shift at $\\theta = \\pi/2$, and maximum redshift at $\\theta = \\pi$ in the classical (medium-based) case. The relativistic version $f' = f/[\\gamma(1 - \\beta\\cos\\theta)]$ adds a transverse Doppler effect from time dilation, so even a source moving purely sideways is observed to be redshifted by a factor $1/\\gamma$.",
        statisticalTools: [
          { name: "General Doppler Formula", desc: "f'(\\theta) = \\frac{f}{1 - (v_s/v_w)\\cos\\theta}. The observed frequency as a function of the angle \\theta between source velocity and the source-to-observer direction." },
          { name: "Maximum Blueshift", desc: "At \\theta = 0° (source approaching head-on): f' = f/(1-M). For M = 0.5, the frequency doubles. Diverges as M → 1." },
          { name: "Maximum Redshift", desc: "At \\theta = 180° (source receding): f' = f/(1+M). For M = 0.5, frequency drops to 2/3. Always finite even at high speeds." },
          { name: "Transverse Doppler (Classical)", desc: "At \\theta = 90°: f' = f (no shift). Classically, a source moving perpendicular to the line of sight produces no frequency change." },
          { name: "Relativistic Doppler", desc: "f' = \\frac{f}{\\gamma(1 - \\beta\\cos\\theta)} where \\gamma = 1/\\sqrt{1-\\beta^2}. Includes the transverse Doppler effect: time dilation causes a redshift even at 90°." },
          { name: "Transverse Doppler (Relativistic)", desc: "At \\theta = 90°: f' = f/\\gamma = f\\sqrt{1-\\beta^2}. A purely relativistic effect due to time dilation. Confirmed experimentally by Ives-Stilwell." },
          { name: "Blueshift-Redshift Transition", desc: "The crossover angle where f' = f is \\cos\\theta_0 = 0 classically (90°), but \\cos\\theta_0 = (1-1/\\gamma)/\\beta relativistically." },
          { name: "Astrophysical Redshift", desc: "z = (\\lambda_{obs} - \\lambda_{emit})/\\lambda_{emit} = (f_{emit}/f_{obs}) - 1. Positive z = redshift (receding). The Hubble law: z \\propto distance for v \\ll c." },
          { name: "Doppler Broadening", desc: "Thermal motion of gas atoms causes a distribution of radial velocities, broadening spectral lines. The line width gives the gas temperature: \\Delta f/f = \\sqrt{2k_BT/(mc^2)}." },
          { name: "Beaming Effect", desc: "At relativistic speeds, radiation is concentrated in the forward direction (relativistic beaming). The emission cone has half-angle \\sim 1/\\gamma." },
        ],
        keyEquations: [
          "f'(\\theta) = \\frac{f}{1 - \\frac{v_s}{v_w}\\cos\\theta}",
          "f'_{\\text{rel}} = \\frac{f}{\\gamma(1 - \\beta\\cos\\theta)}",
          "z = \\frac{f_{\\text{emit}}}{f_{\\text{obs}}} - 1",
        ],
        conceptSummary:
          "Vary the observer angle from 0° (ahead) to 180° (behind) and watch the frequency shift. The polar plot shows the full angular dependence. Notice the asymmetry — blueshift ahead is larger than redshift behind.",
      },
    ],
  },
];

// ─── FOUNDATIONS ────────────────────────────────────────────────────
// Classroom-style introduction to the basic ingredients of physics.
// Designed to be approachable for high-school students and a refresher
// for undergraduates before diving into the advanced chapters.

const foundations: Chapter[] = [
  {
    id: "f1",
    num: "F1",
    title: "Vectors & Motion",
    description:
      "The grammar of physics. Before we can describe the universe in motion, we need to agree on how to measure things, point in directions, and talk about how objects move from place to place.",
    color: "#22c55e",
    icon: "\u{1F4D0}",
    shortDesc: "Quantities, vectors, kinematics",
    sections: [
      {
        id: "vectors",
        title: "Scalars & Vectors",
        description:
          "Some quantities are fully described by a single number (mass, time, temperature) — these are scalars. Others (displacement, velocity, force) need both a magnitude AND a direction — these are vectors. Vectors can be added head-to-tail, scaled, and broken into components along chosen axes.",
        definition:
          "A **scalar** is a quantity with magnitude only (like 5 kg or 30 °C). A **vector** is a quantity with both magnitude and direction (like 5 m east or 30 N upward). Vectors are written with an arrow ($\\vec{v}$) and can be added geometrically by placing arrows head-to-tail, or algebraically by adding their $(x, y)$ **components**.",
        statisticalTools: [
          { name: "Magnitude $|\\vec{v}|$", desc: "The length of a vector. For a 2D vector $\\vec{v} = (v_x, v_y)$, the magnitude is $|\\vec{v}| = \\sqrt{v_x^2 + v_y^2}$. It is always a non-negative scalar." },
          { name: "Direction (angle $\\theta$)", desc: "The angle a vector makes with a reference axis. $\\theta = \\arctan(v_y / v_x)$. Together with magnitude it specifies the vector completely." },
          { name: "Components $(v_x, v_y)$", desc: "The projections of a vector onto chosen axes. $v_x = |\\vec{v}|\\cos\\theta$, $v_y = |\\vec{v}|\\sin\\theta$. Components transform like coordinates under rotation." },
          { name: "Vector Addition (head-to-tail)", desc: "Place the tail of vector $\\vec{B}$ at the head of vector $\\vec{A}$. The resultant $\\vec{R} = \\vec{A} + \\vec{B}$ runs from $\\vec{A}$'s tail to $\\vec{B}$'s head. Equivalently: $R_x = A_x + B_x$, $R_y = A_y + B_y$." },
          { name: "Scalar Multiplication", desc: "Multiplying a vector by a positive number scales its length but keeps direction. Multiplying by a negative number flips the direction." },
          { name: "Unit Vectors $\\hat{i}, \\hat{j}, \\hat{k}$", desc: "Vectors of length 1 pointing along the $x, y, z$ axes. Any vector can be written as $\\vec{v} = v_x\\hat{i} + v_y\\hat{j} + v_z\\hat{k}$." },
          { name: "Dot Product $\\vec{A}\\cdot\\vec{B}$", desc: "A scalar: $\\vec{A}\\cdot\\vec{B} = |\\vec{A}||\\vec{B}|\\cos\\theta = A_xB_x + A_yB_y$. Measures how much one vector points along another. Zero means perpendicular." },
          { name: "Cross Product $\\vec{A}\\times\\vec{B}$", desc: "A vector perpendicular to both $\\vec{A}$ and $\\vec{B}$ with magnitude $|\\vec{A}||\\vec{B}|\\sin\\theta$. Direction follows the right-hand rule. Used for torque and angular momentum." },
          { name: "Parallelogram Rule", desc: "An equivalent way to add two vectors: place them tail-to-tail and the diagonal of the parallelogram they span is the sum." },
          { name: "Resultant Vector", desc: "The single vector that produces the same effect as several vectors combined. The 'net' force, displacement, or velocity." },
        ],
        keyEquations: [
          "\\vec{v} = v_x\\hat{i} + v_y\\hat{j}",
          "|\\vec{v}| = \\sqrt{v_x^2 + v_y^2},\\quad \\theta = \\arctan(v_y/v_x)",
          "\\vec{R} = \\vec{A} + \\vec{B} \\;\\Rightarrow\\; (R_x, R_y) = (A_x{+}B_x,\\, A_y{+}B_y)",
        ],
        conceptSummary:
          "Drag the tips of two vectors and watch their components, magnitude, angle, and resultant update live. Toggle between head-to-tail and parallelogram views to see two equivalent ways of adding vectors.",
      },
      {
        id: "velocity",
        title: "Displacement & Velocity",
        description:
          "Position tells us where something is. Displacement is how far it has moved (a vector from start to end). Velocity is how fast position is changing — and in what direction. Speed is just the magnitude of velocity, with no direction attached.",
        definition:
          "**Velocity** is the rate of change of position with respect to time. It is a vector: $\\vec{v} = \\Delta\\vec{x}/\\Delta t$. The magnitude of velocity is called **speed** (a scalar). **Average velocity** uses total displacement over total time; **instantaneous velocity** is the limit as the time interval shrinks to zero — geometrically, it is the slope of the position-vs-time graph.",
        statisticalTools: [
          { name: "Position $x(t)$", desc: "Where the object is at time $t$, measured from a chosen origin. Plotted vertically against time, it gives a position-time graph." },
          { name: "Displacement $\\Delta\\vec{x}$", desc: "The vector from initial to final position: $\\Delta\\vec{x} = \\vec{x}_f - \\vec{x}_i$. Independent of the path taken — only endpoints matter." },
          { name: "Distance Travelled", desc: "The total length of the path. A scalar that is always $\\geq |\\Delta\\vec{x}|$. A round trip has zero displacement but non-zero distance." },
          { name: "Average Velocity", desc: "Total displacement divided by total time: $\\bar{v} = \\Delta x / \\Delta t$. Slope of the secant line on a position-time graph." },
          { name: "Instantaneous Velocity", desc: "$v(t) = dx/dt$. Slope of the tangent line at a single instant. The speedometer reading at that moment." },
          { name: "Speed $|\\vec{v}|$", desc: "Magnitude of velocity — always non-negative. A car going '60 km/h' tells you speed but not direction." },
          { name: "Reference Frame", desc: "The coordinate system from which motion is measured. The same motion can look different from different frames (e.g., a passenger on a train vs. a person on the platform)." },
          { name: "Relative Velocity", desc: "Velocity of $A$ as seen by $B$: $\\vec{v}_{A/B} = \\vec{v}_A - \\vec{v}_B$. Why two cars approaching at 50 km/h each have a 100 km/h closing speed." },
          { name: "1D vs 2D Motion", desc: "1D motion happens along a single axis (signed numbers). 2D motion needs two components — projectile motion is the classic example." },
          { name: "Position-Time Graph", desc: "$x$ plotted against $t$. Slope = velocity. Straight line = constant velocity. Curved line = changing velocity." },
        ],
        keyEquations: [
          "\\vec{v}_{\\text{avg}} = \\frac{\\Delta \\vec{x}}{\\Delta t}",
          "\\vec{v}(t) = \\frac{d\\vec{x}}{dt}",
          "\\text{speed} = |\\vec{v}|",
        ],
        conceptSummary:
          "Drag the slider to move the object along a track and watch its position-time and velocity-time graphs build up in real time. Compare the slope of the x(t) curve to the velocity reading.",
      },
      {
        id: "acceleration",
        title: "Acceleration",
        description:
          "When velocity changes — whether speeding up, slowing down, or turning — there is acceleration. Acceleration is a vector that points in the direction of velocity change. Even an object moving at constant speed in a circle is accelerating, because its direction is changing.",
        definition:
          "**Acceleration** is the rate of change of velocity with respect to time: $\\vec{a} = \\Delta\\vec{v}/\\Delta t$. Its SI unit is $\\text{m}/\\text{s}^2$. Acceleration is positive when velocity grows in the chosen positive direction and negative (**deceleration**) when velocity shrinks. Importantly, a change in direction (without speed change) is also an acceleration — this is why circular motion involves **centripetal acceleration**.",
        statisticalTools: [
          { name: "Average Acceleration", desc: "$\\bar{a} = \\Delta v / \\Delta t$. The change in velocity divided by the time taken to make that change." },
          { name: "Instantaneous Acceleration", desc: "$a(t) = dv/dt = d^2x/dt^2$. The slope of the velocity-time graph; the curvature of the position-time graph." },
          { name: "Constant Acceleration", desc: "When $a$ is constant, three kinematic equations close the system: $v = v_0 + at$, $x = x_0 + v_0 t + \\tfrac{1}{2}at^2$, $v^2 = v_0^2 + 2a\\Delta x$." },
          { name: "Free Fall ($g \\approx 9.81\\,\\text{m/s}^2$)", desc: "Near Earth's surface, all objects accelerate downward at the same rate $g$, regardless of mass — Galileo's insight, ignoring air resistance." },
          { name: "Centripetal Acceleration", desc: "An object moving in a circle of radius $r$ at speed $v$ has $a_c = v^2/r$ directed toward the center. It changes direction, not speed." },
          { name: "Tangential vs Radial", desc: "Tangential acceleration changes speed; radial (centripetal) acceleration changes direction. General curved motion has both." },
          { name: "$v$–$t$ Graph Slope", desc: "Slope of the velocity-time graph equals acceleration. Area under the $v$–$t$ curve equals displacement." },
          { name: "Deceleration (Negative $a$)", desc: "When acceleration opposes velocity, the object slows down. 'Deceleration' is just informal language for acceleration in the opposite direction." },
          { name: "Jerk ($da/dt$)", desc: "The rate of change of acceleration. Why a smooth elevator stop feels different from a sudden one even at the same final speed." },
          { name: "Equations of Motion (SUVAT)", desc: "The five symbols $s$ (displacement), $u$ (initial $v$), $v$ (final $v$), $a$ (accel), $t$ (time). Any three known values let you find the rest under constant $a$." },
        ],
        keyEquations: [
          "\\vec{a} = \\frac{d\\vec{v}}{dt} = \\frac{d^2\\vec{x}}{dt^2}",
          "v = v_0 + at",
          "x = x_0 + v_0 t + \\tfrac{1}{2} a t^2",
        ],
        conceptSummary:
          "Set an initial velocity and constant acceleration, then watch position, velocity, and acceleration graphs evolve together. Try negative acceleration to see deceleration; flip the sign of v\u2080 to see motion reversing.",
      },
      {
        id: "forces",
        title: "Forces & Newton's Laws",
        description:
          "A force is a push or pull. Newton's three laws connect forces to motion: an object stays at rest or moves at constant velocity unless a net force acts on it (1st law); the net force equals mass times acceleration (2nd law); every action has an equal and opposite reaction (3rd law).",
        definition:
          "A **force** is a vector interaction that can change an object's motion. **Newton's second law** states $\\vec{F}_{\\text{net}} = m\\vec{a}$ — the net force on a body equals its mass times its acceleration. **Mass** measures **inertia** (resistance to acceleration). Force has units of **newtons** ($1\\,\\text{N} = 1\\,\\text{kg}\\cdot\\text{m}/\\text{s}^2$). When forces are balanced ($\\sum\\vec{F} = 0$), the object is in **equilibrium** and moves at constant velocity (which can be zero).",
        statisticalTools: [
          { name: "Newton's First Law (Inertia)", desc: "An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted on by a net external force." },
          { name: "Newton's Second Law", desc: "$\\vec{F}_{\\text{net}} = m\\vec{a}$. The acceleration of an object is proportional to the net force and inversely proportional to its mass." },
          { name: "Newton's Third Law", desc: "For every action there is an equal and opposite reaction. If $A$ pushes $B$ with force $\\vec{F}$, $B$ pushes $A$ with $-\\vec{F}$. Action-reaction pairs always act on different bodies." },
          { name: "Mass vs Weight", desc: "Mass (kg) is intrinsic — it measures inertia. Weight $W = mg$ (newtons) is the gravitational force on the mass and depends on local gravity." },
          { name: "Free-Body Diagram", desc: "A diagram showing only the object of interest with arrows for every external force acting on it. Essential for setting up Newton's 2nd law correctly." },
          { name: "Normal Force", desc: "The contact force perpendicular to a surface that prevents an object from passing through it. Adjusts itself to whatever is needed for equilibrium normal to the surface." },
          { name: "Friction (Static & Kinetic)", desc: "Static friction $f_s \\leq \\mu_s N$ prevents motion up to a threshold; kinetic friction $f_k = \\mu_k N$ opposes sliding motion. Usually $\\mu_k < \\mu_s$." },
          { name: "Tension", desc: "The pulling force transmitted along a rope, cable, or string. In an ideal massless rope, tension is the same throughout." },
          { name: "Net Force $\\sum\\vec{F}$", desc: "The vector sum of all forces acting on the body. Only the net force determines acceleration; individual forces may be huge yet cancel out." },
          { name: "Equilibrium", desc: "When $\\sum\\vec{F} = 0$ the object has zero acceleration. It may be at rest (static equilibrium) or moving at constant velocity (dynamic equilibrium)." },
        ],
        keyEquations: [
          "\\vec{F}_{\\text{net}} = m\\vec{a}",
          "W = mg",
          "f_k = \\mu_k N",
        ],
        conceptSummary:
          "Apply forces to a block on a surface and watch the resulting acceleration. Add friction or change the mass and see how the same applied force produces different accelerations. Try balancing forces to see equilibrium.",
      },
    ],
  },
  {
    id: "f2",
    num: "F2",
    title: "Matter, Pressure & Energy",
    description:
      "Once we understand motion and force, we can describe the bulk properties of matter — how heavy it is for its size (density), how it pushes on its surroundings (pressure), how hot it is (temperature), and how much it can do (energy).",
    color: "#f59e0b",
    icon: "\u{1F9EA}",
    shortDesc: "Density, pressure, temperature, energy",
    sections: [
      {
        id: "density",
        title: "Mass, Volume & Density",
        description:
          "Mass measures how much 'stuff' is in an object. Volume measures the space it occupies. Density is the ratio: how much mass is packed into each unit of volume. Density determines whether an object floats or sinks in a given fluid.",
        definition:
          "**Mass** measures how much matter an object contains. **Volume** is the space it occupies. **Density** ($\\rho$) is mass per unit volume: $\\rho = m/V$. Its SI unit is $\\text{kg}/\\text{m}^3$, though $\\text{g}/\\text{cm}^3$ is also common ($1\\,\\text{g}/\\text{cm}^3 = 1000\\,\\text{kg}/\\text{m}^3$). Pure water at $4\\,°\\text{C}$ has $\\rho \\approx 1000\\,\\text{kg}/\\text{m}^3$ — a useful reference. A material with constant composition has constant density, regardless of how much of it you have.",
        statisticalTools: [
          { name: "Mass m", desc: "The amount of matter in an object, measured in kilograms. Independent of location (same on Earth, the Moon, or in space)." },
          { name: "Volume V", desc: "The 3D space an object occupies, measured in m\u00B3 or liters (1 L = 10\u207B\u00B3 m\u00B3). For regular shapes V comes from geometry; for irregular shapes use water displacement." },
          { name: "Density \\rho = m/V", desc: "Mass divided by volume. An intensive property: doesn't depend on sample size. Steel and aluminum nails of the same shape have very different masses because of density." },
          { name: "Specific Gravity (Relative Density)", desc: "The ratio \\rho_{\\text{object}}/\\rho_{\\text{water}}. Dimensionless. Specific gravity > 1 means the object sinks in pure water; < 1 means it floats." },
          { name: "Buoyant Force (Archimedes)", desc: "F_b = \\rho_{\\text{fluid}} g V_{\\text{displaced}}. The upward force on a submerged or floating object equals the weight of the fluid it displaces." },
          { name: "Floating Condition", desc: "An object floats with fraction f = \\rho_{\\text{object}}/\\rho_{\\text{fluid}} submerged. Ice (\\rho \\approx 0.92) floats with about 92% submerged, ~8% above water." },
          { name: "Sinking Condition", desc: "If \\rho_{\\text{object}} > \\rho_{\\text{fluid}}, the buoyant force is less than weight and the object sinks (with apparent weight reduced by F_b)." },
          { name: "Average Density", desc: "For composite objects (a ship hull plus its air-filled interior), the relevant density is total mass divided by total external volume — that's why steel ships float." },
          { name: "Volume by Displacement", desc: "Submerge an irregular object in water and measure the volume rise. Eureka! — the technique attributed to Archimedes." },
          { name: "Temperature & Density", desc: "Most materials expand when heated, so density usually drops with temperature. Water near 4 \u00B0C is the famous exception (density maximum)." },
        ],
        keyEquations: [
          "\\rho = \\frac{m}{V}",
          "F_b = \\rho_{\\text{fluid}}\\,g\\,V_{\\text{displaced}}",
          "f_{\\text{submerged}} = \\frac{\\rho_{\\text{object}}}{\\rho_{\\text{fluid}}}",
        ],
        conceptSummary:
          "Pick a material and a fluid, then drop the object in. Watch it sink, float, or sit at neutral buoyancy depending on the density ratio. The fraction submerged is computed live.",
      },
      {
        id: "pressure",
        title: "Pressure",
        description:
          "Pressure is force spread over an area. The same push by your hand feels gentle when spread across a flat palm but sharp when concentrated on a fingertip. In fluids, pressure increases with depth and pushes equally in all directions.",
        definition:
          "**Pressure** ($P$) is force per unit area applied perpendicular to a surface: $P = F/A$. Its SI unit is the **pascal** ($1\\,\\text{Pa} = 1\\,\\text{N}/\\text{m}^2$). At a depth $h$ in a fluid of density $\\rho$, the pressure increases by $\\rho g h$ above whatever pressure exists at the surface — this is why your ears hurt deep in a swimming pool. **Atmospheric pressure** at sea level is about $101.3\\,\\text{kPa}$.",
        statisticalTools: [
          { name: "Pressure P = F/A", desc: "Force divided by the area over which it acts. A small area concentrates force — a thumbtack pierces wood because the contact area is tiny." },
          { name: "Pascal (SI Unit)", desc: "1 Pa = 1 N/m\u00B2. A pascal is a small amount of pressure; everyday quantities use kPa, MPa, or atm. 1 atm \\approx 101.3 kPa." },
          { name: "Hydrostatic Pressure", desc: "P(h) = P_0 + \\rho g h. In a static fluid, pressure increases linearly with depth. Independent of container shape." },
          { name: "Pascal's Principle", desc: "A pressure change applied to an enclosed fluid is transmitted undiminished to every part of the fluid. Basis of hydraulic systems." },
          { name: "Hydraulic Lift", desc: "A small force on a small piston produces a large force on a big piston: F_2/F_1 = A_2/A_1. Force is amplified by the area ratio." },
          { name: "Atmospheric Pressure", desc: "The weight of the air column above us, ~101.3 kPa at sea level. Drops with altitude — about half at 5.5 km." },
          { name: "Gauge vs Absolute Pressure", desc: "Gauge pressure measures excess above atmospheric (a flat tire reads 0 psi gauge but ~101 kPa absolute). Absolute pressure measures from vacuum." },
          { name: "Buoyancy from Pressure", desc: "Archimedes' principle arises because pressure at the bottom of a submerged object exceeds pressure at the top: net upward force equals weight of displaced fluid." },
          { name: "Pressure in Gases", desc: "For gases, P arises from molecular collisions. The ideal gas law PV = nRT relates P to volume, temperature, and amount of gas." },
          { name: "Surface Tension (related)", desc: "A different intermolecular phenomenon, but it also adds an effective extra pressure inside small droplets: \\Delta P = 2\\sigma/r (Young-Laplace)." },
        ],
        keyEquations: [
          "P = \\frac{F}{A}",
          "P(h) = P_0 + \\rho g h",
          "\\frac{F_1}{A_1} = \\frac{F_2}{A_2} \\quad (\\text{Pascal})",
        ],
        conceptSummary:
          "Adjust the force and contact area to see pressure update. Then dive into a fluid column and watch how pressure grows with depth. Try the hydraulic lift to see force amplification through equal pressure.",
      },
      {
        id: "temperature",
        title: "Temperature & Thermal Motion",
        description:
          "Temperature measures the average kinetic energy of the random motion of particles. Hot things have particles jiggling fast; cold things have particles barely moving. The Kelvin scale starts at absolute zero, where (classically) all motion would stop.",
        definition:
          "**Temperature** is a measure of the average translational kinetic energy of the particles in a system. For an ideal gas, the relation is exact: $\\langle \\tfrac{1}{2}mv^2\\rangle = \\tfrac{3}{2}k_B T$, where $k_B$ is **Boltzmann's constant**. Temperature is measured in **kelvin** (K), where $0\\,\\text{K}$ is **absolute zero**. Conversion: $T(\\text{K}) = T(°\\text{C}) + 273.15$. Heat flows naturally from higher to lower temperature.",
        statisticalTools: [
          { name: "Kelvin Scale", desc: "Absolute temperature scale starting at 0 K = -273.15 \u00B0C (absolute zero). All thermodynamic equations use kelvin." },
          { name: "Celsius & Fahrenheit", desc: "T(\u00B0C) = T(K) - 273.15; T(\u00B0F) = (9/5)T(\u00B0C) + 32. Celsius and Kelvin have the same step size." },
          { name: "Average Kinetic Energy", desc: "For an ideal monatomic gas: \\langle KE\\rangle = \\tfrac{3}{2}k_B T. Each translational degree of freedom contributes \\tfrac{1}{2}k_B T (equipartition)." },
          { name: "Boltzmann Constant k_B", desc: "k_B \\approx 1.38\\times10^{-23} J/K. The microscopic-to-macroscopic bridge: connects single-particle energies to bulk temperature." },
          { name: "Thermal Equilibrium", desc: "Two systems in thermal contact reach the same temperature when energy stops flowing between them. Foundation of the zeroth law of thermodynamics." },
          { name: "Heat vs Temperature", desc: "Temperature is intensive (a thimble and a swimming pool can be at the same T). Heat is energy in transit, measured in joules." },
          { name: "Specific Heat c", desc: "Energy per unit mass per kelvin: Q = mc\\Delta T. Water has an unusually high c \\approx 4186 J/(kg\u00B7K), which is why oceans moderate climate." },
          { name: "Thermal Expansion", desc: "Most materials expand when heated: \\Delta L = \\alpha L_0 \\Delta T. Bridges have expansion joints to accommodate this." },
          { name: "Maxwell-Boltzmann Distribution", desc: "At temperature T, gas molecules have a distribution of speeds peaked at v_p = \\sqrt{2k_B T/m}. Higher T broadens and shifts the peak." },
          { name: "Absolute Zero", desc: "0 K. Classically, all motion would cease; quantum mechanically, zero-point motion remains. Unreachable in finite steps (third law of thermodynamics)." },
        ],
        keyEquations: [
          "\\langle \\tfrac{1}{2}mv^2 \\rangle = \\tfrac{3}{2}k_B T",
          "Q = mc\\,\\Delta T",
          "\\Delta L = \\alpha L_0\\,\\Delta T",
        ],
        conceptSummary:
          "Slide the temperature up and down and watch the molecular speed distribution shift and broaden. The average kinetic energy gauge tracks T in real time. Try cooling toward absolute zero — motion freezes out.",
      },
      {
        id: "work-energy",
        title: "Work & Energy",
        description:
          "Work is done when a force moves something through a distance. Energy is the capacity to do work. Kinetic energy is the energy of motion; potential energy is stored energy of position or configuration. In a closed system, energy transforms between forms but the total stays constant.",
        definition:
          "**Work** ($W$) done by a constant force $\\vec{F}$ on an object that undergoes displacement $\\vec{d}$ is $W = \\vec{F}\\cdot\\vec{d} = Fd\\cos\\theta$. Its SI unit is the **joule** ($1\\,\\text{J} = 1\\,\\text{N}\\cdot\\text{m}$). **Kinetic energy** is $KE = \\tfrac{1}{2}mv^2$; **gravitational potential energy** near Earth is $PE = mgh$. The **work-energy theorem** states that the net work on an object equals its change in kinetic energy. In an isolated system with only conservative forces, total **mechanical energy** $KE + PE$ is conserved.",
        statisticalTools: [
          { name: "Work W = F\\cdot d", desc: "Force times displacement in the direction of force. Zero work if force is perpendicular to motion (like centripetal force in circular motion)." },
          { name: "Joule (SI Unit)", desc: "1 J = 1 N\u00B7m. The energy to lift a small apple (~100 g) about 1 m. Food calories are kcal = 4184 J." },
          { name: "Kinetic Energy", desc: "KE = \\tfrac{1}{2}mv\u00B2. Doubling the speed quadruples the KE — why a 60 km/h crash is far worse than a 30 km/h one." },
          { name: "Gravitational PE", desc: "Near Earth's surface: PE = mgh. The work you do lifting a mass m through height h becomes its stored PE." },
          { name: "Elastic PE (Spring)", desc: "PE_{\\text{spring}} = \\tfrac{1}{2}kx^2. Energy stored in a stretched/compressed spring of stiffness k." },
          { name: "Work-Energy Theorem", desc: "W_{\\text{net}} = \\Delta KE. The net work done on a body equals its change in kinetic energy, regardless of the type of forces involved." },
          { name: "Conservation of Energy", desc: "Energy can change form (KE \\leftrightarrow PE \\leftrightarrow heat \\leftrightarrow light) but the total in a closed system is constant. The most fundamental conservation law in physics." },
          { name: "Power P = dW/dt", desc: "Rate of doing work. SI unit: watt (1 W = 1 J/s). A 100 W bulb consumes 100 joules per second. Horsepower: 1 hp \\approx 746 W." },
          { name: "Conservative vs Non-Conservative", desc: "Conservative forces (gravity, springs) store energy reversibly; non-conservative ones (friction, drag) dissipate it as heat." },
          { name: "Mechanical Energy", desc: "E = KE + PE. Conserved when only conservative forces act. Friction reduces mechanical energy by converting it to thermal energy." },
        ],
        keyEquations: [
          "W = \\vec{F}\\cdot\\vec{d} = Fd\\cos\\theta",
          "KE = \\tfrac{1}{2}mv^2,\\quad PE = mgh",
          "W_{\\text{net}} = \\Delta KE",
        ],
        conceptSummary:
          "Watch a ball roll along a track with hills and valleys. The KE and PE bars trade height as the ball rises and falls — but their sum stays constant (until you add friction). Toggle friction on to see mechanical energy bleed away.",
      },
    ],
  },
  {
    id: "f3",
    num: "F3",
    title: "Laws of Motion & Machines",
    description:
      "Newton's three laws in action, plus the simple machines and classic demos that bring them to life. Yank a rug out, drop a feather and a bowling ball, push off on frictionless ice, and watch Newton's cradle trade energy from one ball to another.",
    color: "#ef4444",
    icon: "\u{2699}️",
    shortDesc: "Inertia, gravity, action-reaction, machines",
    sections: [
      {
        id: "inertia",
        title: "Inertia (Newton's 1st Law)",
        description:
          "An object at rest stays at rest; an object in motion stays in motion — unless a net force acts on it. Yanking a rug out from under a stack of blocks isolates the rug's motion from the blocks' motion, and you can watch inertia directly.",
        definition:
          "**Inertia** is a body's resistance to changes in its state of motion. **Newton's first law** states that an object at rest remains at rest, and an object in uniform motion continues in uniform motion in a straight line, unless acted on by a net external force. Mass is the quantitative measure of inertia — a heavier block is harder to start moving and harder to stop. When the rug slides out from under the blocks faster than friction can drag them, the blocks keep the (tiny) velocity they had and simply fall straight down under gravity once the rug is gone.",
        statisticalTools: [
          { name: "Inertia", desc: "The tendency of an object to maintain its current velocity (including zero velocity). Quantified by mass — more mass means more inertia." },
          { name: "Newton's First Law", desc: "An object's velocity is unchanged unless a net external force acts on it. A compact statement of inertia." },
          { name: "Reference Frame", desc: "An inertial frame is one in which Newton's first law holds. Frames accelerating relative to inertial ones produce fictitious forces (like the push you feel in a braking car)." },
          { name: "Static vs Kinetic Friction", desc: "Static friction $f_s \\leq \\mu_s N$ prevents relative motion up to a threshold. Once sliding begins, kinetic friction $f_k = \\mu_k N$ takes over, typically smaller than $\\mu_s N$." },
          { name: "Impulse J = F·Δt", desc: "Force acting over a short time. A quick yank applies large force briefly — enough to move the rug but too short a contact time to accelerate the heavy blocks much." },
          { name: "Momentum p = mv", desc: "Mass times velocity. Newton's first law in momentum form: $\\Delta p = 0$ when no net force acts." },
          { name: "Friction Coefficient μ", desc: "Dimensionless ratio of friction force to normal force. Low μ (polished surface) means little coupling; high μ (rough surface) means the blocks ride the rug." },
          { name: "Threshold Acceleration", desc: "The blocks can only accelerate up to $\\mu_s g$ via friction alone. If the rug accelerates faster than this, the rug slips out from under them." },
          { name: "Free-Body Analysis", desc: "Before yanking: blocks feel gravity down, normal force up, no horizontal force — so they sit still. During yank: friction tries to drag them, capped by $\\mu_s m g$." },
          { name: "Tablecloth Trick", desc: "The classic parlor demonstration. Works because impulse (F·Δt) on the plates is small when Δt is small, even if F is large." },
        ],
        keyEquations: [
          "\\vec{F}_{\\text{net}} = 0 \\;\\Rightarrow\\; \\vec{v} = \\text{const}",
          "f_{\\text{s,max}} = \\mu_s N",
          "a_{\\text{block,max}} = \\mu_s g",
        ],
        conceptSummary:
          "Yank the rug at fixed speed and watch what happens as you slide the friction μ from 0 (perfect ice) to 1 (sticky). With low μ the rug slips out and the blocks fall straight down; with high μ the blocks get dragged along for the ride.",
      },
      {
        id: "gravity",
        title: "Gravity & Free Fall",
        description:
          "In a vacuum, every object falls at the same rate — a feather and a bowling ball hit the ground together. Turn on air resistance and the feather is betrayed by its huge surface-to-mass ratio, while the ball barely notices the drag.",
        definition:
          "**Free fall** is motion under gravity alone. Near Earth's surface, every object in free fall accelerates at $g \\approx 9.81\\,\\text{m}/\\text{s}^2$ downward, regardless of its mass — this is Galileo's insight. **Air resistance** (a form of **drag force**) is an additional force, $F_d \\propto v$ at low speeds or $F_d \\propto v^2$ at high speeds, that depends on shape and cross-section. When drag balances gravity, an object reaches **terminal velocity** and stops accelerating. A feather reaches terminal velocity almost immediately; a bowling ball would only reach it from a skyscraper.",
        statisticalTools: [
          { name: "Constant g", desc: "Near Earth's surface $g \\approx 9.81\\,\\text{m}/\\text{s}^2$. Mass-independent — the same number whether you drop a pebble or a piano." },
          { name: "Equivalence Principle", desc: "Inertial mass (the $m$ in $F=ma$) equals gravitational mass (the $m$ in $F=mg$). This is why $a = g$ independent of mass." },
          { name: "Kinematic Equations", desc: "For constant $g$: $v = gt$, $y = \\tfrac{1}{2}gt^2$. Both feather and ball follow these without air." },
          { name: "Linear Drag", desc: "At very low Reynolds numbers, $F_d = bv$ (Stokes drag). Fine dust, mist, and feathers fall in this regime." },
          { name: "Quadratic Drag", desc: "At high Reynolds numbers, $F_d = \\tfrac{1}{2}\\rho C_d A v^2$. Skydivers, raindrops, and baseballs are in this regime." },
          { name: "Terminal Velocity", desc: "When drag equals weight, acceleration is zero: $v_t = mg/b$ (linear) or $\\sqrt{2mg/\\rho C_d A}$ (quadratic). Depends on mass — heavier objects have higher $v_t$." },
          { name: "Cross-Section A", desc: "The frontal area an object presents to the oncoming air. A flat feather has huge A per unit mass; a compact ball has small A per unit mass." },
          { name: "Mass-to-Area Ratio", desc: "The real distinguisher. Ball: high m/A → gravity wins. Feather: low m/A → drag catches up fast." },
          { name: "Drag Coefficient C_d", desc: "A dimensionless shape factor. Sphere ≈ 0.47, flat plate ≈ 1.1, streamlined shape ≈ 0.04. Multiplied by air density, area, and v² to get drag." },
          { name: "Galileo's Experiment", desc: "Tradition says Galileo dropped objects from the Leaning Tower of Pisa. The cleanest modern version is the Apollo 15 moon-surface demo by astronaut David Scott." },
        ],
        keyEquations: [
          "a = g \\approx 9.81\\,\\text{m}/\\text{s}^2",
          "F_{\\text{net}} = mg - bv",
          "v_t = \\frac{mg}{b}",
        ],
        conceptSummary:
          "Drop the feather and the bowling ball. Without air, they land together. Toggle air resistance on and the feather quickly reaches terminal velocity while the ball continues accelerating — the gap widens the whole way down.",
      },
      {
        id: "action-reaction",
        title: "Action & Reaction (Newton's 3rd Law)",
        description:
          "Two skaters pushing off each other on frictionless ice exert equal and opposite forces on each other. If one is lighter, that one flies back faster — because the same force produces different accelerations when divided by different masses.",
        definition:
          "**Newton's third law** states that when body A exerts a force on body B, body B simultaneously exerts an equal-magnitude, oppositely-directed force on A: $\\vec{F}_{A \\to B} = -\\vec{F}_{B \\to A}$. The two forces always act on **different bodies** (crucial — they never cancel on one object). Because $a = F/m$, a lighter body accelerates more than a heavier one from the same push. **Momentum is conserved**: if the pair started at rest, their total momentum stays zero, so $m_A \\vec{v}_A = -m_B \\vec{v}_B$ after the push.",
        statisticalTools: [
          { name: "Newton's Third Law", desc: "Action–reaction pairs are equal in magnitude, opposite in direction, and act on different bodies simultaneously." },
          { name: "Action–Reaction Pair", desc: "Two forces that share the same interaction. Rocket exhaust pushes down on gas, gas pushes up on rocket. Always same type (contact, gravitational, etc.)." },
          { name: "Impulse J = FΔt", desc: "Integral of force over the contact time. Both skaters receive the same |J| — but get different $\\Delta v$ because they have different masses." },
          { name: "Conservation of Momentum", desc: "For an isolated pair, $\\vec{p}_{\\text{total}}$ is conserved. Initially at rest → final momenta sum to zero: $m_A v_A + m_B v_B = 0$." },
          { name: "Mass-Weighted Velocity", desc: "After the push: $|v_A|/|v_B| = m_B/m_A$. Double the mass of B, and B moves half as fast as A." },
          { name: "Reference Frame Invariance", desc: "Newton's third law holds in all inertial frames. Momentum conservation is a direct consequence via Noether's theorem (translational symmetry)." },
          { name: "Rocket Propulsion", desc: "A rocket pushes exhaust gases out; the gases push the rocket forward. No ground contact needed — action-reaction is enough." },
          { name: "Recoil", desc: "A rifle kicks back because the bullet pushes back on it with the same force it exerted on the bullet. Lighter bullet × fast = heavier rifle × slow." },
          { name: "Center of Mass", desc: "For an isolated system, the center of mass has zero acceleration — a direct corollary of the third law." },
          { name: "Common Misconception", desc: "'If forces are equal and opposite, how does anything move?' Because the forces act on different bodies. Each body experiences only its own force and accelerates accordingly." },
        ],
        keyEquations: [
          "\\vec{F}_{A \\to B} = -\\vec{F}_{B \\to A}",
          "m_A \\vec{v}_A + m_B \\vec{v}_B = 0",
          "\\frac{|v_A|}{|v_B|} = \\frac{m_B}{m_A}",
        ],
        conceptSummary:
          "Set different masses for A and B, choose a push impulse, and hit 'Push off'. Watch the lighter skater fly back faster — and check that the total momentum (shown in the bottom-right) stays zero throughout.",
      },
      {
        id: "balanced-forces",
        title: "Balanced vs Unbalanced Forces",
        description:
          "A net force — the vector sum of all forces on an object — is what changes velocity. Equal and opposite forces cancel to zero net force, leaving the object to continue whatever it was doing. Any imbalance produces acceleration in the direction of the larger force.",
        definition:
          "The **net force** on a body is the vector sum of all forces acting on it: $\\vec{F}_{\\text{net}} = \\sum \\vec{F}_i$. By **Newton's second law**, $\\vec{F}_{\\text{net}} = m\\vec{a}$, so zero net force means zero acceleration — the object's velocity stays constant (which includes 'stays at rest'). This state is called **equilibrium**. When forces don't balance, the object accelerates in the direction of the net force, at $a = F_{\\text{net}}/m$.",
        statisticalTools: [
          { name: "Net Force", desc: "$\\vec{F}_{\\text{net}} = \\sum \\vec{F}_i$. All individual forces add as vectors — only the sum determines acceleration." },
          { name: "Newton's Second Law", desc: "$\\vec{F}_{\\text{net}} = m\\vec{a}$. The only equation that turns forces into motion." },
          { name: "Equilibrium", desc: "When $\\vec{F}_{\\text{net}} = 0$. Static equilibrium: object at rest. Dynamic equilibrium: object moving at constant velocity." },
          { name: "Vector Addition", desc: "Forces add head-to-tail like displacements. Two 10 N forces at right angles give a 14.1 N net force at 45°, not 20 N." },
          { name: "Components", desc: "Along a chosen axis: $F_{\\text{net},x} = \\sum F_{i,x}$. Solving by components turns vector equations into simple algebra." },
          { name: "Free-Body Diagram", desc: "Draw the object as a dot, with every external force as an arrow. Then apply $\\vec{F}_{\\text{net}} = m\\vec{a}$ component by component." },
          { name: "Tug-of-War", desc: "Classic balanced-forces demo. Rope doesn't move when both sides pull equally; slides toward the stronger side otherwise." },
          { name: "Constant Velocity ≠ No Forces", desc: "A car cruising at 60 km/h has engine thrust forward and drag backward — balanced, so velocity is constant. Remove the engine and it slows down." },
          { name: "Magnitude of Acceleration", desc: "$|a| = |F_{\\text{net}}|/m$. Double the net force → double the acceleration. Double the mass → half the acceleration." },
          { name: "Direction of Acceleration", desc: "Acceleration is in the direction of the net force, not necessarily the velocity. A car slowing down has $\\vec{a}$ opposite to $\\vec{v}$." },
        ],
        keyEquations: [
          "\\vec{F}_{\\text{net}} = \\sum \\vec{F}_i",
          "\\vec{F}_{\\text{net}} = m\\vec{a}",
          "\\vec{F}_{\\text{net}} = 0 \\;\\Leftrightarrow\\; \\vec{v} = \\text{const}",
        ],
        conceptSummary:
          "Dial up the left and right forces independently. When they match, the net-force badge turns green and the box doesn't accelerate. Tip the balance either way and watch the box accelerate in the direction of the bigger force.",
      },
      {
        id: "kinetic-theory",
        title: "Kinetic Molecular Theory",
        description:
          "Matter is made of particles in constant motion, and temperature is the average kinetic energy of that motion. Crank the temperature slider and watch particles transition from a rigid solid (small vibrations around fixed lattice sites) through a liquid (clumped under gravity, freely rearranging) to a gas (high-speed particles filling the container).",
        definition:
          "**Kinetic molecular theory** describes matter as a large number of particles in constant random motion, with **temperature** a measure of their average kinetic energy: $\\langle \\tfrac{1}{2}mv^2 \\rangle = \\tfrac{3}{2}k_B T$ for an ideal gas. At low $T$, attractive intermolecular forces dominate and hold particles near fixed lattice positions (**solid**). At medium $T$, particles escape their lattice sites but still stick together loosely (**liquid**). At high $T$, kinetic energy overwhelms attraction and particles fly freely through the container (**gas**). Collisions with walls are what we feel as **pressure**.",
        statisticalTools: [
          { name: "Average Kinetic Energy", desc: "$\\langle KE \\rangle = \\tfrac{3}{2}k_B T$ for a monatomic ideal gas. Each translational degree of freedom contributes $\\tfrac{1}{2}k_B T$ — the **equipartition theorem**." },
          { name: "Boltzmann Constant", desc: "$k_B \\approx 1.38 \\times 10^{-23}\\,\\text{J}/\\text{K}$. The conversion factor between the microscopic (single-particle energy) and macroscopic (temperature) worlds." },
          { name: "Maxwell–Boltzmann Distribution", desc: "At temperature $T$, particle speeds follow $f(v) \\propto v^2 e^{-mv^2 / 2k_B T}$. Higher $T$ broadens the distribution and shifts the peak to higher speeds." },
          { name: "Pressure from Collisions", desc: "Gas pressure arises from particle-wall collisions. $P = nk_B T / V$ for an ideal gas — the ideal gas law." },
          { name: "Elastic Collisions", desc: "In an ideal gas, particle-particle collisions conserve both momentum and kinetic energy. No energy is lost to heat within the system." },
          { name: "Phase Transitions", desc: "Solid → liquid (melting) and liquid → gas (vaporization) happen at specific temperatures where latent heat breaks intermolecular bonds." },
          { name: "Intermolecular Forces", desc: "Attractive van der Waals (or hydrogen bonding for water) glue particles together in the solid and liquid phases. Overcome by thermal energy $k_B T$." },
          { name: "Diffusion", desc: "The random motion of particles causes gases to mix. Diffusion rate $\\propto \\sqrt{T/m}$ — light molecules at high T mix fastest." },
          { name: "Equation of State", desc: "Relation between $P$, $V$, $T$, $N$. Ideal gas: $PV = Nk_BT$. Real substances deviate due to particle size and attractions (van der Waals equation)." },
          { name: "Thermal Equilibrium", desc: "When two systems are in thermal contact they exchange energy until $T_1 = T_2$. At equilibrium, average particle kinetic energies match." },
        ],
        keyEquations: [
          "\\langle \\tfrac{1}{2}mv^2 \\rangle = \\tfrac{3}{2} k_B T",
          "PV = N k_B T",
          "v_{\\text{rms}} = \\sqrt{\\tfrac{3 k_B T}{m}}",
        ],
        conceptSummary:
          "Drag the temperature slider up and down. At low T you see a crystalline lattice jitter; at medium T the lattice melts and particles clump at the bottom; at high T they fly around and fill the box like a gas. Watch the average speed scale with √T.",
      },
      {
        id: "lever",
        title: "The Lever",
        description:
          "A lever trades distance for force. A small weight far from the fulcrum can balance — or lift — a heavier weight close to it, because what matters is not the force alone but the force times its distance from the pivot. This product is called torque.",
        definition:
          "A **lever** is a rigid bar that pivots around a fixed point, the **fulcrum**. The effect of a force on the bar is measured by its **torque** (or moment): $\\tau = r \\times F$, where $r$ is the distance from the fulcrum. A lever is in **rotational equilibrium** when the clockwise torques balance the counterclockwise ones: $m_L \\cdot d_L = m_R \\cdot d_R$. This is why a child on a long lever arm can lift a heavy adult sitting close to the fulcrum — distance multiplies force. The mechanical advantage $MA = d_L/d_R$ is the force-multiplier the lever provides.",
        statisticalTools: [
          { name: "Torque τ = r × F", desc: "The rotational analog of force. A force $F$ at perpendicular distance $r$ from the pivot produces torque $\\tau = rF$ (or $rF\\sin\\theta$ for non-perpendicular). Units: N·m." },
          { name: "Fulcrum", desc: "The pivot point of the lever. Can be fixed (seesaw) or movable (wheelbarrow, where the wheel is the fulcrum)." },
          { name: "Mechanical Advantage", desc: "Ratio of output force to input force: $MA = F_{\\text{out}}/F_{\\text{in}} = d_{\\text{in}}/d_{\\text{out}}$. A lever with MA = 5 lets you lift 5× your pushing force — at the cost of moving 5× farther." },
          { name: "Rotational Equilibrium", desc: "Net torque = 0. Separate from translational equilibrium; a body can be in one without the other (a spinning top at rest horizontally, for instance)." },
          { name: "Lever Classes", desc: "1st class: fulcrum between load and effort (seesaw). 2nd class: load between fulcrum and effort (wheelbarrow). 3rd class: effort between fulcrum and load (tweezers)." },
          { name: "Conservation of Energy", desc: "No free lunch: the force gain of a lever is paid for by a distance loss. Work in = work out: $F_{\\text{in}} d_{\\text{in}} = F_{\\text{out}} d_{\\text{out}}$." },
          { name: "Angular Acceleration", desc: "When net torque ≠ 0, the bar angularly accelerates: $\\tau_{\\text{net}} = I\\alpha$, where $I$ is the moment of inertia and $\\alpha$ the angular acceleration." },
          { name: "Moment of Inertia", desc: "Rotational analog of mass: $I = \\sum m_i r_i^2$. Mass concentrated near the pivot has small $I$; mass far from it has large $I$." },
          { name: "Archimedes", desc: "'Give me a lever long enough and a fulcrum to place it, and I shall move the world.' A poetic but mathematically correct statement of mechanical advantage." },
          { name: "Everyday Levers", desc: "Scissors, bottle openers, crowbars, nutcrackers, pliers, see-saws, even your forearm (elbow = fulcrum, biceps = effort, hand = load). Ubiquitous." },
        ],
        keyEquations: [
          "\\tau = r \\cdot F",
          "m_L \\cdot d_L = m_R \\cdot d_R",
          "MA = \\frac{d_{\\text{in}}}{d_{\\text{out}}} = \\frac{F_{\\text{out}}}{F_{\\text{in}}}",
        ],
        conceptSummary:
          "Set the two masses unequal, then slide the fulcrum. When the product mass × distance matches on both sides, the bar is level (green 'balanced' status). Move the fulcrum toward the heavier weight to balance — that's the lever arm at work.",
      },
      {
        id: "newtons-cradle",
        title: "Newton's Cradle & Energy Transfer",
        description:
          "Five steel balls touching in a row. Pull the end one up and let it swing down: instead of all five jiggling, only the ball on the opposite end flies out — and with the same speed the first ball had. Momentum and kinetic energy are transmitted down the line, leaving the middle balls barely moving.",
        definition:
          "**Newton's cradle** is a classic demonstration of the conservation of **momentum** and **kinetic energy** in elastic collisions. When the lifted ball swings down and strikes the row, each ball transmits its momentum to the next essentially instantaneously through an elastic compression wave. The only way to simultaneously conserve both $\\sum m v = p$ and $\\sum \\tfrac{1}{2} m v^2 = E$ with equal-mass balls is for exactly as many balls to leave the far side as struck the near side — with the same speed. Gravitational potential energy at the top of the swing converts to kinetic energy at the bottom, then to elastic potential energy in the brief compression, then back to kinetic energy in the last ball, then back to gravitational PE as it rises.",
        statisticalTools: [
          { name: "Elastic Collision", desc: "A collision in which kinetic energy is conserved (in addition to momentum, which is always conserved). Approximated by hardened steel balls." },
          { name: "Conservation of Momentum", desc: "$\\sum m_i v_i$ before = $\\sum m_i v_i$ after. Follows from Newton's third law; holds for any isolated system regardless of internal details." },
          { name: "Conservation of KE", desc: "$\\sum \\tfrac{1}{2} m_i v_i^2$ before = $\\sum \\tfrac{1}{2} m_i v_i^2$ after, only for elastic collisions. Inelastic collisions lose KE to heat, sound, deformation." },
          { name: "Energy Conversion Chain", desc: "GPE ($mgh$) → KE ($\\tfrac{1}{2}mv^2$) → elastic PE (brief compression) → KE → GPE. Energy changes form at every stage." },
          { name: "Gravitational PE", desc: "$U = mgh$. Stored when the ball is raised, released when it falls. Relative to a chosen reference height." },
          { name: "Simple Pendulum", desc: "Each ball swings as a pendulum before collision. Period $T = 2\\pi\\sqrt{L/g}$ for small angles — independent of mass and amplitude." },
          { name: "Impulse Transmission", desc: "The compression wave through the row of balls carries the impulse. In reality, finite elastic-wave speed means the transfer isn't quite instantaneous." },
          { name: "Equal Masses Requirement", desc: "The clean '$n$ balls in, $n$ balls out' behavior only works when all balls have equal mass. Unequal masses give more complex outcomes." },
          { name: "Damping Losses", desc: "Each collision actually dissipates a tiny bit of energy as heat and sound — which is why the cradle eventually stops swinging." },
          { name: "Coefficient of Restitution", desc: "Ratio of relative velocity after to before collision. Perfect elastic = 1. Real steel balls ≈ 0.9, which is why the cradle runs for minutes, not forever." },
        ],
        keyEquations: [
          "\\sum m_i v_i = \\text{const}",
          "\\sum \\tfrac{1}{2} m_i v_i^2 = \\text{const}",
          "mgh = \\tfrac{1}{2}mv^2",
        ],
        conceptSummary:
          "Lift one end ball and release. Watch the middle balls stay still while the other end ball swings out with the same energy. Total KE stays roughly constant — any drift is the small damping built into the model.",
      },
    ],
  },
];

// ─── EXPORTS ────────────────────────────────────────────────────────

export const chapterGroups: ChapterGroup[] = [
  {
    id: "foundations",
    title: "Foundations",
    subtitle: "The basic ingredients of physics",
    chapters: foundations,
  },
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
  {
    id: "waves",
    title: "Waves & Oscillations",
    subtitle: "Vibrations, interference & the Doppler effect",
    chapters: wavesOscillations,
  },
];

export const allChapters: Chapter[] = [
  ...foundations,
  ...quantumPhysics,
  ...statisticalPhysics,
  ...classicalMechanics,
  ...electrodynamics,
  ...wavesOscillations,
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
