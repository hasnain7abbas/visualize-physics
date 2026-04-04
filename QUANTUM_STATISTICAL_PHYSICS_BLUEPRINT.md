# Seeing Theory: Quantum & Statistical Physics Module

> **Purpose**: A complete instruction set for **Claude Code** to extend the Seeing Theory Desktop app (Tauri + Rust + SolidJS) with a new module covering the statistical tools of **Quantum Mechanics** and **Statistical Physics**.
>
> **Target audience**: Undergraduate physics, chemistry, and engineering students who struggle with the abstract, non-experiential nature of quantum and statistical mechanics.
>
> **Philosophy**: If we can make coin flips and dice rolls intuitive through visualization, we can do the same for wavefunctions, spin measurements, Boltzmann factors, and Fermi seas. Every concept here has a statistical backbone — we expose it.

---

## 1. MODULE OVERVIEW

### 1.1 Why This Module Exists

Quantum mechanics and statistical physics are built on probability, expectation values, distributions, and variance — the exact same statistical DNA as the classical probability module. Yet students hit a wall because:

- You cannot "see" a wavefunction collapse
- Boltzmann distributions feel arbitrary without watching energy distribute itself
- The Stern-Gerlach experiment is taught as a diagram, never as a live simulation
- Fermi-Dirac vs Bose-Einstein vs Maxwell-Boltzmann look like three arbitrary formulas until you watch particles fill energy levels under different rules
- The uncertainty principle feels like a philosophical statement until you see conjugate distributions sharpen and spread in real-time

This module makes every one of these concepts **interactive, visual, and playful**.

### 1.2 Module Structure — 6 Chapters, 18 Sections

| Chapter | Title | Sections |
|---|---|---|
| **Q1** | Quantum Probability | Schrödinger's Cat & Superposition · Measurement & Collapse · Probability Amplitudes vs. Probabilities |
| **Q2** | Spin & The Stern-Gerlach Experiment | Single SG Apparatus · Sequential SG Experiments · Expectation Values & Uncertainty of Spin |
| **Q3** | Wavefunctions & Uncertainty | Particle in a Box · Gaussian Wavepackets · Heisenberg Uncertainty Principle |
| **Q4** | The Boltzmann World | Maxwell-Boltzmann Speed Distribution · Boltzmann Energy Distribution · Partition Functions & Thermodynamic Quantities |
| **Q5** | Quantum Statistics | Fermions vs Bosons · Fermi-Dirac Distribution · Bose-Einstein Distribution & Condensation |
| **Q6** | Entropy & Information | Microstates & Macrostates · Entropy of Mixing · Gibbs/Shannon Entropy & Information Theory |

### 1.3 Integration with Existing App

This module lives alongside the classical probability module as a peer section. The sidebar navigation adds a new top-level group:

```
📊 Classical Probability (existing 6 chapters)
⚛️ Quantum & Statistical Physics (new 6 chapters)  ← THIS MODULE
```

Reuse existing components: `ChapterLayout`, `ControlPanel`, `MathBlock`, `RunningAverage`, `DistributionPlot`, `BarChart`. Build new visualization components specific to quantum physics.

---

## 2. NEW PROJECT FILES

### 2.1 Additional Directory Structure

```
src/
├── chapters/
│   ├── ... (existing classical probability chapters)
│   ├── q1-quantum-probability/
│   │   ├── index.tsx
│   │   ├── SchrodingerCat.tsx
│   │   ├── MeasurementCollapse.tsx
│   │   └── ProbabilityAmplitudes.tsx
│   ├── q2-stern-gerlach/
│   │   ├── index.tsx
│   │   ├── SingleSG.tsx
│   │   ├── SequentialSG.tsx
│   │   └── SpinExpectation.tsx
│   ├── q3-wavefunctions/
│   │   ├── index.tsx
│   │   ├── ParticleInBox.tsx
│   │   ├── GaussianWavepacket.tsx
│   │   └── UncertaintyPrinciple.tsx
│   ├── q4-boltzmann/
│   │   ├── index.tsx
│   │   ├── MaxwellBoltzmann.tsx
│   │   ├── BoltzmannEnergy.tsx
│   │   └── PartitionFunction.tsx
│   ├── q5-quantum-statistics/
│   │   ├── index.tsx
│   │   ├── FermionsBosons.tsx
│   │   ├── FermiDirac.tsx
│   │   └── BoseEinstein.tsx
│   └── q6-entropy/
│       ├── index.tsx
│       ├── Microstates.tsx
│       ├── EntropyMixing.tsx
│       └── ShannonEntropy.tsx
├── visualizations/
│   ├── ... (existing viz components)
│   ├── BlochSphere.tsx           # Spin state on Bloch sphere
│   ├── SternGerlach.tsx          # SG apparatus with beam splitting
│   ├── WavefunctionPlot.tsx      # |ψ(x)|² and Re/Im parts
│   ├── EnergyLevelDiagram.tsx    # Particle filling energy levels
│   ├── GasParticles.tsx          # 2D kinetic gas simulation (Canvas)
│   ├── QuantumStateViz.tsx       # Ket notation + probability bars
│   ├── PhaseSpacePlot.tsx        # (x, p) phase space distribution
│   └── OccupationPlot.tsx        # f(E) for FD/BE/MB comparison
```

### 2.2 Additional Rust Commands

```
src-tauri/src/commands/
├── ... (existing commands)
├── quantum_probability.rs       # Qubit simulation, measurement, Born rule
├── stern_gerlach.rs             # SG beam splitting, sequential experiments
├── wavefunctions.rs             # PIB eigenstates, Gaussian propagation, HUP
├── boltzmann.rs                 # MB speed dist, Boltzmann factors, partition fn
├── quantum_statistics.rs        # FD/BE/MB distributions, energy level filling
└── entropy.rs                   # Microstate counting, entropy computation
```

### 2.3 Additional Rust Dependencies (add to Cargo.toml)

```toml
num-complex = "0.4"             # Complex number support for wavefunctions
```

---

## 3. CHAPTER DETAILS — CONTENT, MATH, VISUALIZATIONS, RUST

---

### CHAPTER Q1: QUANTUM PROBABILITY

**Core message**: Quantum mechanics is fundamentally probabilistic. Unlike classical randomness (coin flips), quantum probability comes from superposition of states, and measurement actively changes the system.

---

#### Q1.1 — Schrödinger's Cat & Superposition

**Concept**: A quantum system can exist in a superposition of states. The "cat" is both alive and dead until measured. This isn't ignorance — it's the actual state of the system.

**Math**:
```
|ψ⟩ = α|alive⟩ + β|dead⟩
where |α|² + |β|² = 1
P(alive) = |α|², P(dead) = |β|²
```

**Visualization — "The Quantum Box"**:
- A box sits center-screen with a glowing superposition aura (two overlaid colors blending)
- A **slider** controls the amplitude ratio α/β (constrained to normalization)
- The box shows a **probability pie chart** that updates in real-time: portion alive vs dead
- A large **"Open the Box"** button triggers measurement:
  - The aura collapses to one solid color
  - An animated cat appears (alive = happy, bouncing cat; dead = ghost cat with X eyes)
  - A counter tracks outcomes across many measurements
  - A **running frequency bar chart** builds up, approaching |α|² and |β|² predictions
- Users can "open 100 boxes" at once (Rust batch simulation) and watch the histogram converge
- **Key insight moment**: The result of each individual box is random, but the statistics perfectly match the amplitudes

**Rust Command**:
```rust
#[derive(Serialize)]
pub struct SuperpositionResult {
    pub outcomes: Vec<bool>,           // true = state_1, false = state_2
    pub running_frequency: Vec<f64>,   // running proportion of state_1
    pub alpha_sq: f64,                 // |α|²
    pub beta_sq: f64,                  // |β|²
}

/// Simulate n measurements of a two-state superposition.
/// `alpha_sq` is P(state 1) = |α|².
#[tauri::command]
pub fn simulate_superposition(n: usize, alpha_sq: f64) -> SuperpositionResult {
    let mut rng = rand::thread_rng();
    let mut outcomes = Vec::with_capacity(n);
    let mut running_frequency = Vec::with_capacity(n);
    let mut count_1 = 0u64;

    for i in 1..=n {
        let is_state_1 = rng.gen::<f64>() < alpha_sq;
        outcomes.push(is_state_1);
        count_1 += is_state_1 as u64;
        running_frequency.push(count_1 as f64 / i as f64);
    }

    SuperpositionResult {
        outcomes,
        running_frequency,
        alpha_sq,
        beta_sq: 1.0 - alpha_sq,
    }
}
```

---

#### Q1.2 — Measurement & Collapse

**Concept**: Measuring a quantum system in a particular basis "collapses" it to an eigenstate of that basis. Measuring in a different basis gives probabilistic results again. This is NOT like revealing a hidden coin.

**Visualization — "Quantum Coin vs Classical Coin"**:
- **Left panel**: A classical coin under a cup. Reveal it — always the same answer no matter how you look. It was predetermined.
- **Right panel**: A quantum "coin" (qubit). Measure in Z-basis — get up or down. Now measure in X-basis — the Z information is destroyed! Measure Z again — it's random again!
- Visual flow: Three measurement boxes in sequence (SG-Z → SG-X → SG-Z), animating a particle beam splitting, being filtered, and splitting again
- **Key insight**: The second Z-measurement gives 50/50 even though the first Z-measurement gave a definite result. The X-measurement "reset" the Z information.
- This directly connects to the Stern-Gerlach sequential experiment (Chapter Q2), serving as a gentle preview

**Rust Command**:
```rust
#[derive(Serialize)]
pub struct MeasurementSequenceResult {
    pub outcomes_first_z: Vec<bool>,    // first Z measurement
    pub outcomes_x: Vec<bool>,          // X measurement after filtering
    pub outcomes_second_z: Vec<bool>,   // second Z measurement
    pub freq_first_z_up: f64,
    pub freq_second_z_up: f64,          // should be ~0.5 regardless!
}

/// Simulate sequential quantum measurements: Z → X → Z
/// After filtering spin-up from first Z, measure X, then Z again.
/// Demonstrates that X measurement destroys Z information.
#[tauri::command]
pub fn simulate_measurement_sequence(n: usize) -> MeasurementSequenceResult {
    let mut rng = rand::thread_rng();
    let mut outcomes_first_z = Vec::new();
    let mut outcomes_x = Vec::new();
    let mut outcomes_second_z = Vec::new();

    for _ in 0..n {
        // First Z measurement: assume unpolarized input → 50/50
        let z1 = rng.gen::<f64>() < 0.5;
        outcomes_first_z.push(z1);

        // Filter: only take spin-up from Z1
        if z1 {
            // |+z⟩ in X-basis: 50/50 chance of +x or -x
            let x = rng.gen::<f64>() < 0.5;
            outcomes_x.push(x);

            // After X measurement, Z is randomized: 50/50 regardless
            let z2 = rng.gen::<f64>() < 0.5;
            outcomes_second_z.push(z2);
        }
    }

    let freq_first_z_up = outcomes_first_z.iter().filter(|&&x| x).count() as f64 / outcomes_first_z.len() as f64;
    let freq_second_z_up = if outcomes_second_z.is_empty() { 0.0 } else {
        outcomes_second_z.iter().filter(|&&x| x).count() as f64 / outcomes_second_z.len() as f64
    };

    MeasurementSequenceResult {
        outcomes_first_z,
        outcomes_x,
        outcomes_second_z,
        freq_first_z_up,
        freq_second_z_up,
    }
}
```

---

#### Q1.3 — Probability Amplitudes vs Probabilities

**Concept**: Quantum mechanics uses complex probability amplitudes, not probabilities directly. Interference arises because amplitudes (not probabilities) add. This is the statistical heart of quantum weirdness.

**Math**:
```
Classical:  P(A or B) = P(A) + P(B)                    [no interference]
Quantum:    P = |ψ_A + ψ_B|² = |ψ_A|² + |ψ_B|² + 2Re(ψ_A*ψ_B)  [interference!]
```

**Visualization — "Double Slit in Slow Motion"**:
- A simplified 1D double-slit setup
- **Mode 1 — Classical (marbles)**: Two slits, particles go through one or the other. Detection histogram shows two humps. P = P₁ + P₂.
- **Mode 2 — Quantum (photons)**: Particles go through "both" slits. Detection histogram shows interference fringes. P = |ψ₁ + ψ₂|².
- **Amplitude view**: Below the detection screen, show the complex amplitude from each slit as rotating phasors (arrows in the complex plane). Where they align → constructive interference (bright). Where they oppose → destructive (dark).
- **Slider**: Adjust slit separation → fringes compress or expand
- **Slider**: Adjust wavelength → fringe spacing changes
- **Toggle "which path" detector**: Turning it on destroys interference! Histogram morphs from fringed to two humps. The key statistical consequence of observation.

**Rust Command**:
```rust
#[derive(Serialize)]
pub struct DoubleSlitResult {
    pub x_positions: Vec<f64>,          // detection positions
    pub classical_prob: Vec<f64>,       // P1 + P2 (no interference)
    pub quantum_prob: Vec<f64>,         // |ψ1 + ψ2|² (interference)
    pub psi1_re: Vec<f64>,             // Real part of amplitude from slit 1
    pub psi1_im: Vec<f64>,             // Imaginary part
    pub psi2_re: Vec<f64>,
    pub psi2_im: Vec<f64>,
}

/// Compute double-slit interference pattern.
/// `d` = slit separation, `lambda` = wavelength, `L` = screen distance
/// `x_range` = half-width of detection screen, `steps` = resolution
#[tauri::command]
pub fn compute_double_slit(
    d: f64,
    lambda: f64,
    l_screen: f64,
    x_range: f64,
    steps: usize,
) -> DoubleSlitResult {
    use std::f64::consts::PI;

    let k = 2.0 * PI / lambda;
    let dx = 2.0 * x_range / steps as f64;
    let mut x_positions = Vec::with_capacity(steps + 1);
    let mut classical_prob = Vec::with_capacity(steps + 1);
    let mut quantum_prob = Vec::with_capacity(steps + 1);
    let mut psi1_re = Vec::with_capacity(steps + 1);
    let mut psi1_im = Vec::with_capacity(steps + 1);
    let mut psi2_re = Vec::with_capacity(steps + 1);
    let mut psi2_im = Vec::with_capacity(steps + 1);

    for i in 0..=steps {
        let x = -x_range + i as f64 * dx;
        x_positions.push(x);

        // Path lengths from each slit to detection point
        let r1 = ((x - d / 2.0).powi(2) + l_screen.powi(2)).sqrt();
        let r2 = ((x + d / 2.0).powi(2) + l_screen.powi(2)).sqrt();

        // Amplitudes (normalized for visualization)
        let phase1 = k * r1;
        let phase2 = k * r2;
        let a1_re = phase1.cos() / r1.sqrt();
        let a1_im = phase1.sin() / r1.sqrt();
        let a2_re = phase2.cos() / r2.sqrt();
        let a2_im = phase2.sin() / r2.sqrt();

        psi1_re.push(a1_re);
        psi1_im.push(a1_im);
        psi2_re.push(a2_re);
        psi2_im.push(a2_im);

        // Classical: no interference
        classical_prob.push(a1_re * a1_re + a1_im * a1_im + a2_re * a2_re + a2_im * a2_im);

        // Quantum: interference
        let sum_re = a1_re + a2_re;
        let sum_im = a1_im + a2_im;
        quantum_prob.push(sum_re * sum_re + sum_im * sum_im);
    }

    DoubleSlitResult {
        x_positions, classical_prob, quantum_prob,
        psi1_re, psi1_im, psi2_re, psi2_im,
    }
}
```

---

### CHAPTER Q2: SPIN & THE STERN-GERLACH EXPERIMENT

**Core message**: The Stern-Gerlach experiment is the cleanest demonstration of quantum measurement, discrete outcomes, and non-commutativity. It directly connects quantum states to statistical distributions.

---

#### Q2.1 — Single Stern-Gerlach Apparatus

**Concept**: A beam of spin-½ particles enters an inhomogeneous magnetic field. Classically, we'd expect a continuous spread. Quantum mechanically, the beam splits into exactly two spots (spin-up and spin-down). This is spatial quantization.

**Visualization — "Build Your Own SG Apparatus"**:
- An animated apparatus: oven (source) → beam → magnet gap → detection screen
- **Classical mode (toggle)**: Beam spreads into a continuous smear on the screen. Gaussian distribution of deflections.
- **Quantum mode**: Beam splits into exactly 2 discrete spots. Binary histogram.
- **Orientation dial**: Rotate the SG apparatus (Z, X, Y, or arbitrary angle θ). The beam always splits into 2, but along the chosen axis.
- Particles fly one-by-one with a satisfying "ping" on the detector. Running count builds up.
- **Input state control**: User can set the input spin state |ψ⟩ = cos(θ/2)|↑⟩ + e^{iφ}sin(θ/2)|↓⟩ via a Bloch sphere widget.
- The probability of spin-up vs spin-down updates as the user rotates the Bloch sphere.

**Rust Command**:
```rust
#[derive(Serialize)]
pub struct SGResult {
    pub outcomes: Vec<bool>,            // true = spin-up, false = spin-down
    pub running_freq_up: Vec<f64>,
    pub p_up: f64,                      // theoretical P(up)
    pub p_down: f64,
}

/// Single SG measurement on spin-1/2 particle.
/// `theta` and `phi` define the input state on the Bloch sphere.
/// `measurement_axis_theta` defines the SG axis orientation.
#[tauri::command]
pub fn simulate_stern_gerlach_single(
    n: usize,
    state_theta: f64,           // polar angle of input state
    state_phi: f64,             // azimuthal angle of input state
    measurement_theta: f64,     // SG apparatus angle (0 = Z-axis)
) -> SGResult {
    use rand::Rng;

    // P(up) = cos²(Δθ/2) where Δθ is angle between state and measurement axis
    // Simplified for Z-measurement: P(up) = cos²(θ/2)
    // For general axis, use inner product of spinors
    let half_angle = (state_theta - measurement_theta) / 2.0;
    let p_up = half_angle.cos().powi(2);

    let mut rng = rand::thread_rng();
    let mut outcomes = Vec::with_capacity(n);
    let mut running_freq_up = Vec::with_capacity(n);
    let mut count_up = 0u64;

    for i in 1..=n {
        let is_up = rng.gen::<f64>() < p_up;
        outcomes.push(is_up);
        count_up += is_up as u64;
        running_freq_up.push(count_up as f64 / i as f64);
    }

    SGResult { outcomes, running_freq_up, p_up, p_down: 1.0 - p_up }
}
```

---

#### Q2.2 — Sequential Stern-Gerlach Experiments

**Concept**: Chain multiple SG apparatuses. SG-Z → filter up → SG-X → filter up → SG-Z again yields 50/50 on the final Z measurement. Measuring X "erases" the Z information. This demonstrates non-commutativity of observables.

**Visualization — "The SG Pipeline"**:
- **Drag-and-drop SG modules**: Users build a pipeline of SG apparatus blocks:
  - Each block has: an orientation dial (Z, X, Y, or custom angle), an output filter (pass up, pass down, or pass both)
  - Blocks snap together left-to-right
- Particles animate through the pipeline, splitting at each stage
- A final detection screen shows the histogram of outcomes
- **Pre-built experiments** (one-click):
  1. SG-Z → SG-Z (100% correlation)
  2. SG-Z → SG-X → SG-Z (Z information lost!)
  3. SG-Z(θ) with varying θ (smooth cos² curve)
- **Prediction mode**: Before running, users type their prediction of the probability. After running, compare prediction vs result.

**Rust Command**:
```rust
#[derive(Serialize, Deserialize)]
pub struct SGStage {
    pub angle_theta: f64,       // apparatus orientation
    pub filter: String,         // "up", "down", "both"
}

#[derive(Serialize)]
pub struct SGPipelineResult {
    pub n_input: usize,
    pub n_output: usize,
    pub final_up: usize,
    pub final_down: usize,
    pub stages_passed: Vec<usize>,  // count surviving each stage
}

/// Simulate a multi-stage Stern-Gerlach experiment.
#[tauri::command]
pub fn simulate_sg_pipeline(n: usize, stages: Vec<SGStage>) -> SGPipelineResult {
    use rand::Rng;
    let mut rng = rand::thread_rng();

    let mut stages_passed = Vec::new();
    let mut final_up = 0usize;
    let mut final_down = 0usize;
    let mut n_surviving = 0usize;

    for _ in 0..n {
        // Start with random spin (unpolarized)
        let mut current_theta = rng.gen::<f64>() * std::f64::consts::PI;
        let mut alive = true;

        for stage in &stages {
            if !alive { break; }

            let half_angle = (current_theta - stage.angle_theta) / 2.0;
            let p_up = half_angle.cos().powi(2);
            let is_up = rng.gen::<f64>() < p_up;

            match stage.filter.as_str() {
                "up" => {
                    if !is_up { alive = false; }
                    else { current_theta = stage.angle_theta; } // collapse to up along this axis
                }
                "down" => {
                    if is_up { alive = false; }
                    else { current_theta = stage.angle_theta + std::f64::consts::PI; }
                }
                "both" | _ => {
                    if is_up {
                        current_theta = stage.angle_theta;
                    } else {
                        current_theta = stage.angle_theta + std::f64::consts::PI;
                    }
                }
            }
        }

        if alive {
            n_surviving += 1;
            // Final measurement in Z basis
            let half = current_theta / 2.0;
            let p_up_final = half.cos().powi(2);
            if rng.gen::<f64>() < p_up_final {
                final_up += 1;
            } else {
                final_down += 1;
            }
        }
    }

    SGPipelineResult {
        n_input: n,
        n_output: n_surviving,
        final_up,
        final_down,
        stages_passed,
    }
}
```

---

#### Q2.3 — Expectation Values & Uncertainty of Spin

**Concept**: For a spin state |ψ⟩, the expectation value ⟨Sₖ⟩ is the average measurement along axis k, and the uncertainty ΔSₖ = √(⟨Sₖ²⟩ - ⟨Sₖ⟩²) quantifies the spread. The uncertainty principle states ΔSₓ · ΔSₖ ≥ ½|⟨Sₖ⟩|.

**Math**:
```
⟨Sz⟩ = (ℏ/2)(|α|² - |β|²)
ΔSz = (ℏ/2)√(1 - (|α|² - |β|²)²)
For |ψ⟩ = |+x⟩: ⟨Sz⟩ = 0, ΔSz = ℏ/2
```

**Visualization — "The Spin Dashboard"**:
- **Bloch sphere** (3D CSS or WebGL): Drag the state vector around the sphere
- **Three gauges** showing ⟨Sₓ⟩, ⟨Sᵧ⟩, ⟨Sₖ⟩ updating in real-time as the state moves
- **Three uncertainty bars** showing ΔSₓ, ΔSᵧ, ΔSₖ — as one shrinks, others grow
- **Uncertainty product display**: ΔSₓ · ΔSᵧ ≥ ½|⟨Sₖ⟩| shown as an inequality that turns red when violated (it never is)
- **"Simulate 1000 measurements"** button: Runs the simulation in Rust, shows a histogram of outcomes for the chosen measurement axis overlaid with theoretical prediction
- Side-by-side comparison: "What would the histogram look like for this state measured along Z? along X? along a 45° axis?"

---

### CHAPTER Q3: WAVEFUNCTIONS & UNCERTAINTY

**Core message**: The wavefunction ψ(x) encodes probability density |ψ(x)|². Confining a particle (narrowing position uncertainty) forces momentum uncertainty to increase. This isn't a measurement limitation — it's fundamental.

---

#### Q3.1 — Particle in a Box

**Concept**: The simplest quantum system. A particle confined in a box has quantized energy levels Eₙ = n²π²ℏ²/(2mL²) and wavefunctions ψₙ(x) = √(2/L)·sin(nπx/L).

**Visualization — "The Quantum Box"**:
- A "box" with walls. The wavefunction ψₙ(x) is drawn as a filled curve inside.
- **n selector** (1, 2, 3, ...10): Toggle energy level. Watch the number of nodes increase.
- **Three views** (toggle):
  1. ψ(x) — the wavefunction itself (can be negative!)
  2. |ψ(x)|² — probability density (always positive, this is what you'd measure)
  3. Both overlaid with different colors
- **"Drop a particle"** mode: Random position samples drawn from |ψₙ(x)|², shown as dots accumulating into a histogram that matches the theoretical density
- **Superposition mode**: Create ψ = c₁ψ₁ + c₂ψ₂ and watch the probability density show interference between the two states. Sliders for c₁ and c₂.
- **Energy level diagram** on the side: horizontal lines at Eₙ, with the current state highlighted

**Rust Command**:
```rust
#[derive(Serialize)]
pub struct PIBState {
    pub x: Vec<f64>,
    pub psi: Vec<f64>,              // wavefunction
    pub psi_sq: Vec<f64>,           // probability density
    pub energy: f64,                // energy in units of E₁
    pub samples: Vec<f64>,          // random position samples from |ψ|²
}

/// Compute particle-in-a-box eigenstate and generate position samples.
/// `n` = quantum number, `l` = box width, `n_points` = resolution,
/// `n_samples` = number of random position samples to generate.
#[tauri::command]
pub fn particle_in_box(
    n: u32,
    l: f64,
    n_points: usize,
    n_samples: usize,
) -> PIBState {
    use std::f64::consts::PI;
    use rand::Rng;

    let dx = l / n_points as f64;
    let norm = (2.0 / l).sqrt();
    let energy = (n as f64).powi(2); // in units of π²ℏ²/(2mL²)

    let x: Vec<f64> = (0..=n_points).map(|i| i as f64 * dx).collect();
    let psi: Vec<f64> = x.iter().map(|&xi| norm * (n as f64 * PI * xi / l).sin()).collect();
    let psi_sq: Vec<f64> = psi.iter().map(|&p| p * p).collect();

    // Rejection sampling from |ψ|²
    let mut rng = rand::thread_rng();
    let max_psi_sq = 2.0 / l; // max of |ψ|² = 2/L
    let mut samples = Vec::with_capacity(n_samples);
    while samples.len() < n_samples {
        let x_try = rng.gen::<f64>() * l;
        let psi_val = norm * (n as f64 * PI * x_try / l).sin();
        let p = psi_val * psi_val / max_psi_sq;
        if rng.gen::<f64>() < p {
            samples.push(x_try);
        }
    }

    PIBState { x, psi, psi_sq, energy, samples }
}
```

---

#### Q3.2 — Gaussian Wavepackets

**Concept**: A Gaussian wavepacket is a realistic quantum state with both position and momentum uncertainty. It has minimum uncertainty: Δx·Δp = ℏ/2. Over time, the packet spreads — position uncertainty increases.

**Visualization — "The Spreading Packet"**:
- Animated Gaussian wavepacket ψ(x,t) in real-time
- **Position space** (top): |ψ(x)|² as a bell curve that broadens over time
- **Momentum space** (bottom): |φ(p)|² stays constant width (momentum doesn't spread for free particle)
- **Play/pause** time evolution with speed control
- **Sliders**: Initial width σ₀ (narrow packet = fast spread, wide packet = slow spread)
- **Phase visualization**: Color-coded phase of ψ(x) (hue = arg(ψ)), showing the oscillating "heartbeat" of the complex wavefunction
- **Δx and Δp gauges** on the side, showing Δx·Δp ≥ ℏ/2 in real-time

**Rust Command**:
```rust
#[derive(Serialize)]
pub struct WavepacketFrame {
    pub x: Vec<f64>,
    pub prob_density: Vec<f64>,     // |ψ(x,t)|²
    pub psi_re: Vec<f64>,          // Re(ψ)
    pub psi_im: Vec<f64>,          // Im(ψ)
    pub delta_x: f64,              // position uncertainty at this time
    pub delta_p: f64,              // momentum uncertainty (constant)
    pub uncertainty_product: f64,   // Δx·Δp
}

/// Compute Gaussian wavepacket at time t.
/// sigma0 = initial width, k0 = central wavenumber, hbar = 1, m = 1.
#[tauri::command]
pub fn gaussian_wavepacket(
    sigma0: f64,
    k0: f64,
    t: f64,
    x_range: f64,
    n_points: usize,
) -> WavepacketFrame {
    use num_complex::Complex64;
    use std::f64::consts::PI;

    let dx = 2.0 * x_range / n_points as f64;
    let hbar = 1.0;
    let m = 1.0;

    // Time-dependent width
    let sigma_t_sq = sigma0 * sigma0 + (hbar * t / (2.0 * m * sigma0)).powi(2);
    let sigma_t = sigma_t_sq.sqrt();
    let delta_x = sigma_t / 2.0_f64.sqrt();
    let delta_p = hbar / (2.0 * sigma0 * 2.0_f64.sqrt());

    let mut x = Vec::with_capacity(n_points + 1);
    let mut prob_density = Vec::with_capacity(n_points + 1);
    let mut psi_re = Vec::with_capacity(n_points + 1);
    let mut psi_im = Vec::with_capacity(n_points + 1);

    let complex_sigma_sq = Complex64::new(sigma0 * sigma0, hbar * t / (2.0 * m));

    for i in 0..=n_points {
        let xi = -x_range + i as f64 * dx;
        x.push(xi);

        let x_shifted = xi - hbar * k0 * t / m;
        let exponent = Complex64::new(-x_shifted * x_shifted, 0.0) / (4.0 * complex_sigma_sq)
            + Complex64::new(0.0, k0 * xi - hbar * k0 * k0 * t / (2.0 * m));

        let norm = (2.0 * PI * complex_sigma_sq).sqrt();
        let psi = exponent.exp() / norm.sqrt();

        prob_density.push(psi.norm_sqr());
        psi_re.push(psi.re);
        psi_im.push(psi.im);
    }

    WavepacketFrame {
        x, prob_density, psi_re, psi_im,
        delta_x, delta_p,
        uncertainty_product: delta_x * delta_p,
    }
}
```

---

#### Q3.3 — Heisenberg Uncertainty Principle

**Concept**: Δx·Δp ≥ ℏ/2. This is not about measurement clumsiness. It's a fundamental property of waves: a narrow pulse in position space requires many Fourier components (wide in momentum space) and vice versa.

**Visualization — "The Uncertainty Seesaw"**:
- A single Gaussian shown simultaneously in position space (top) and momentum space (bottom) via Fourier transform
- **Drag the width** of the position-space Gaussian. Momentum space inversely scales in real-time.
- A **seesaw animation** between Δx and Δp: as one goes down, the other goes up. The product Δx·Δp shown on a gauge that never drops below ℏ/2.
- **"Try to cheat" game**: User drags both Δx and Δp sliders trying to make the product < ℏ/2. The system fights back — as one shrinks, the other automatically expands. The slider physically resists going below the limit. A cheeky message: "Nice try! Heisenberg says no."
- **Musical analogy**: Play a sound clip. Short beep = well-localized in time but spread in frequency. Long tone = precise frequency but spread in time. Same math!

---

### CHAPTER Q4: THE BOLTZMANN WORLD

**Core message**: Classical statistical physics emerges from counting microstates. The Boltzmann distribution exp(-E/kT) governs how energy distributes among particles and states, and the partition function Z encodes all thermodynamic information.

---

#### Q4.1 — Maxwell-Boltzmann Speed Distribution

**Concept**: In a gas at temperature T, particle speeds follow the Maxwell-Boltzmann distribution: f(v) ∝ v² exp(-mv²/2kT). Higher T → distribution broadens and shifts to higher speeds.

**Visualization — "Gas in a Box"**:
- **Kinetic gas simulation (Canvas)**: 200-500 particles bouncing in a 2D box with elastic collisions. Computed in Rust for performance.
- Color-coded by speed (blue = slow, red = fast)
- **Speed histogram** builds up on the right in real-time from the simulation
- **Theoretical MB curve** overlaid on the histogram. Watch the histogram converge to theory!
- **Temperature slider**: Increase T → particles speed up, distribution broadens, peak shifts right. Decrease T → particles slow down, distribution narrows, peak shifts left.
- **Mass selector**: Compare light gas (He) vs heavy gas (Xe). Light gas has broader, shifted distribution.
- **Overlay mode**: Show two different temperatures on the same plot to compare.
- **Key insight**: The most probable speed, mean speed, and rms speed are all different — mark them on the curve.

**Rust Command**:
```rust
#[derive(Serialize)]
pub struct MBDistribution {
    pub v: Vec<f64>,
    pub f_v: Vec<f64>,
    pub v_most_probable: f64,
    pub v_mean: f64,
    pub v_rms: f64,
}

/// Compute Maxwell-Boltzmann speed distribution.
/// `m` = particle mass (amu), `t` = temperature (K)
#[tauri::command]
pub fn maxwell_boltzmann_distribution(m_amu: f64, t_kelvin: f64, v_max: f64, steps: usize) -> MBDistribution {
    use std::f64::consts::PI;

    let kb = 1.380649e-23;  // J/K
    let m = m_amu * 1.66054e-27; // kg
    let a = m / (2.0 * kb * t_kelvin);
    let norm = 4.0 * PI * (a / PI).powf(1.5);

    let dv = v_max / steps as f64;
    let v: Vec<f64> = (0..=steps).map(|i| i as f64 * dv).collect();
    let f_v: Vec<f64> = v.iter().map(|&vi| norm * vi * vi * (-a * vi * vi).exp()).collect();

    let v_most_probable = (2.0 * kb * t_kelvin / m).sqrt();
    let v_mean = (8.0 * kb * t_kelvin / (PI * m)).sqrt();
    let v_rms = (3.0 * kb * t_kelvin / m).sqrt();

    MBDistribution { v, f_v, v_most_probable, v_mean, v_rms }
}

/// Run 2D kinetic gas simulation: elastic collisions in a box.
/// Returns particle positions and velocities at each frame.
#[tauri::command]
pub fn simulate_gas_particles(
    n_particles: usize,
    temperature: f64,
    mass: f64,
    box_size: f64,
    n_steps: usize,
    dt: f64,
) -> Vec<Vec<(f64, f64, f64, f64)>> {
    // Returns Vec of frames, each frame is Vec of (x, y, vx, vy)
    // Initialize velocities from MB distribution
    // Step forward with elastic wall collisions and inter-particle collisions
    todo!("Implement 2D gas simulation with Verlet integration")
}
```

---

#### Q4.2 — Boltzmann Energy Distribution

**Concept**: The probability of a system being in state with energy E is P(E) ∝ exp(-E/kT). At low T, the system clusters in low-energy states. At high T, higher energy states become accessible.

**Visualization — "Energy Level Occupation"**:
- **Energy ladder diagram**: Vertical stack of energy levels (like shelves)
- Particles (balls) distributed on the levels according to Boltzmann weights
- **Temperature slider**: 
  - T→0: All particles pile on the ground state
  - T→∞: Particles spread evenly across all levels
  - Intermediate T: Exponential decay of occupation with energy
- **Real-time bar chart** showing occupation numbers vs theoretical Boltzmann prediction
- **Drag energy levels**: Users can adjust the spacing between levels and watch the distribution change
- **Einstein solid**: An interactive version where energy quanta are distributed among oscillators. Shows how the multiplicity peaks at the most probable distribution.

**Rust Command**:
```rust
#[derive(Serialize)]
pub struct BoltzmannDistribution {
    pub energy_levels: Vec<f64>,
    pub occupation_numbers: Vec<f64>,   // theoretical
    pub simulated_occupations: Vec<usize>, // from simulation
    pub partition_function: f64,
    pub average_energy: f64,
}

/// Compute Boltzmann distribution over given energy levels.
/// Optionally simulate by distributing n_particles.
#[tauri::command]
pub fn boltzmann_distribution(
    energy_levels: Vec<f64>,
    temperature: f64,
    n_particles: usize,
) -> BoltzmannDistribution {
    let kb_t = temperature;  // in natural units where k_B = 1
    let boltzmann_factors: Vec<f64> = energy_levels.iter()
        .map(|&e| (-e / kb_t).exp())
        .collect();
    let partition_function: f64 = boltzmann_factors.iter().sum();
    let occupation_numbers: Vec<f64> = boltzmann_factors.iter()
        .map(|&bf| n_particles as f64 * bf / partition_function)
        .collect();
    let average_energy: f64 = energy_levels.iter().zip(occupation_numbers.iter())
        .map(|(&e, &n)| e * n)
        .sum::<f64>() / n_particles as f64;

    // Monte Carlo simulation
    let mut rng = rand::thread_rng();
    let probabilities: Vec<f64> = boltzmann_factors.iter()
        .map(|&bf| bf / partition_function)
        .collect();
    let mut simulated_occupations = vec![0usize; energy_levels.len()];
    for _ in 0..n_particles {
        let r: f64 = rng.gen();
        let mut cumulative = 0.0;
        for (j, &p) in probabilities.iter().enumerate() {
            cumulative += p;
            if r < cumulative {
                simulated_occupations[j] += 1;
                break;
            }
        }
    }

    BoltzmannDistribution {
        energy_levels, occupation_numbers, simulated_occupations,
        partition_function, average_energy,
    }
}
```

---

#### Q4.3 — Partition Functions & Thermodynamic Quantities

**Concept**: The partition function Z = Σ exp(-Eᵢ/kT) is the "Rosetta Stone" of statistical mechanics. From Z, you can compute everything: average energy ⟨E⟩ = -∂(ln Z)/∂β, entropy S = k(ln Z + β⟨E⟩), free energy F = -kT ln Z, and specific heat Cᵥ = ∂⟨E⟩/∂T.

**Visualization — "The Partition Function Machine"**:
- A central "Z machine" graphic: energy levels feed in, Z comes out
- **Input**: Adjustable energy levels (drag to change spacing) and temperature slider
- **Output dashboard**: Four live gauges for ⟨E⟩, S, F, Cᵥ, all updating as T changes
- **Plot**: All four quantities vs T on a multi-line chart
- **Specific heat anomaly**: For a two-level system, Cᵥ shows a Schottky peak. Interactive exploration: "Why does specific heat DECREASE at high temperature?"
- **Harmonic oscillator example**: Equally-spaced levels. Recover Einstein solid specific heat curve.

---

### CHAPTER Q5: QUANTUM STATISTICS

**Core message**: Identical quantum particles follow fundamentally different statistics depending on whether they're fermions (half-integer spin, obey Pauli exclusion) or bosons (integer spin, can pile up in same state). This has dramatic macroscopic consequences.

---

#### Q5.1 — Fermions vs Bosons: The Rules of Occupancy

**Concept**: Classical particles are distinguishable. Bosons are indistinguishable and can share states. Fermions are indistinguishable and CANNOT share states (Pauli exclusion). Same energy levels, wildly different behavior.

**Visualization — "The Particle Hotel"**:
- An "Energy Hotel" with floors (energy levels) and rooms (quantum states)
- **Three columns side by side**:
  1. **Maxwell-Boltzmann (classical)**: Labeled particles (A, B, C), any arrangement allowed. Many microstates.
  2. **Bose-Einstein**: Unlabeled particles, any number per room. Can pile into ground floor!
  3. **Fermi-Dirac**: Unlabeled particles, max ONE per room. Forced to occupy higher floors.
- **"Add particle" button**: Drop a particle into each hotel simultaneously and watch different behaviors
- **Enumerate microstates**: For small systems (2-3 particles, 3-4 states), show ALL possible arrangements as a grid. Count: MB has the most, FD has the fewest.
- **Temperature slider**: Watch how the three distributions converge at high T (classical limit) and diverge dramatically at low T

**Rust Command**:
```rust
#[derive(Serialize)]
pub struct OccupancyComparison {
    pub energy_levels: Vec<f64>,
    pub mb_occupation: Vec<f64>,
    pub fd_occupation: Vec<f64>,
    pub be_occupation: Vec<f64>,
    pub n_microstates_mb: u64,
    pub n_microstates_fd: u64,
    pub n_microstates_be: u64,
}

/// Compare MB, FD, BE occupancy for given energy levels at temperature T
/// with chemical potential mu and n_particles.
#[tauri::command]
pub fn compare_quantum_statistics(
    energy_levels: Vec<f64>,
    temperature: f64,
    mu: f64,   // chemical potential
) -> OccupancyComparison {
    let beta = 1.0 / temperature;

    let mb_occupation: Vec<f64> = energy_levels.iter()
        .map(|&e| (-(e - mu) * beta).exp())
        .collect();
    let fd_occupation: Vec<f64> = energy_levels.iter()
        .map(|&e| 1.0 / (((e - mu) * beta).exp() + 1.0))
        .collect();
    let be_occupation: Vec<f64> = energy_levels.iter()
        .map(|&e| 1.0 / (((e - mu) * beta).exp() - 1.0))
        .collect();

    OccupancyComparison {
        energy_levels, mb_occupation, fd_occupation, be_occupation,
        n_microstates_mb: 0, n_microstates_fd: 0, n_microstates_be: 0,
    }
}
```

---

#### Q5.2 — Fermi-Dirac Distribution

**Concept**: f(E) = 1/(exp((E-μ)/kT) + 1). At T=0, this is a sharp step function: all states below the Fermi energy are filled, all above are empty. At finite T, the step blurs over a width ~kT.

**Visualization — "The Fermi Sea"**:
- **Energy level diagram** (vertical): States filled with blue "electron" dots up to the Fermi level
- **Temperature slider (starting from T=0)**:
  - T=0: Perfect step function. Sharp Fermi surface. "Frozen sea."
  - Small T: Slight thermal excitation near the surface. A few electrons hop above μ.
  - Large T: Broad smearing, approaches classical behavior.
- **f(E) plot** alongside: The occupation function as a smooth curve
- **Density of states** overlay: g(E) ∝ √E for free electrons. Show how f(E)·g(E) gives the actual electron energy distribution.
- **Thermometer animation**: A thermometer rises and the Fermi surface visually "melts" at the edges
- **Real-world connection**: "This is why metals conduct — there are always electrons near the Fermi surface ready to move!"

---

#### Q5.3 — Bose-Einstein Distribution & Condensation

**Concept**: f(E) = 1/(exp((E-μ)/kT) - 1). Unlike fermions, bosons can pile up. At low enough temperature, a macroscopic fraction condenses into the ground state — Bose-Einstein Condensation (BEC).

**Visualization — "The Boson Pile-Up"**:
- Same energy level diagram, but now with GREEN boson dots
- **Temperature slider**:
  - High T: Bosons spread across levels, similar to classical
  - Low T: Bosons increasingly crowd into the ground state
  - Below T_c: Dramatic condensation — a huge blob on the ground state. The BEC!
- **Condensate fraction** plot: N₀/N vs T/Tc. Sharp transition at Tc.
- **Side-by-side**: Fermi sea (blue, orderly) vs Bose condensate (green, piled up) at the same temperature. Dramatic visual contrast.
- **Three distribution comparison chart**: Plot MB, FD, BE all on the same axes. Interactive temperature and μ. Watch them converge at high T and diverge at low T.

---

### CHAPTER Q6: ENTROPY & INFORMATION

**Core message**: Entropy counts possibilities. More microstates = more entropy = more "disorder." Shannon entropy extends this to information theory. The statistical definition of entropy S = k_B ln Ω is the bridge between the microscopic and macroscopic worlds.

---

#### Q6.1 — Microstates & Macrostates

**Concept**: A macrostate (e.g., "60 heads out of 100 flips") can be realized by many microstates (specific sequences of H and T). The macrostate with the most microstates is overwhelmingly the most probable. This is WHY entropy increases.

**Visualization — "The Microstate Counter"**:
- **Left**: A row of N toggleable coins (start with N=10, scalable to 100)
- **Right**: A histogram of macrostates (number of heads) with bar heights = number of microstates = C(N,k)
- Clicking individual coins toggles them. Current macrostate highlighted on the histogram.
- **"Shake" button**: Randomly reassign all coins. Watch the system naturally end up near the peak of the distribution (most probable macrostate).
- **Entropy meter**: S = k ln Ω displayed numerically and as a bar, where Ω is the number of microstates for the current macrostate.
- **Scale up**: Increase N from 10→50→100→1000. Watch the distribution sharpen around N/2. At N=1000, the relative fluctuation is tiny — the second law becomes virtually certain.
- **"Why does entropy increase?"**: It's not a mystery — there are just overwhelmingly more high-entropy microstates than low-entropy ones!

**Rust Command**:
```rust
#[derive(Serialize)]
pub struct MicrostateData {
    pub macrostates: Vec<u64>,          // k = 0, 1, ..., n
    pub microstate_counts: Vec<f64>,    // C(n, k) — use f64 for large n
    pub entropy_per_macrostate: Vec<f64>, // k_B * ln(C(n,k))
    pub most_probable_k: u64,
    pub total_microstates: f64,         // 2^n
}

/// Compute microstate counts for N two-state particles.
#[tauri::command]
pub fn compute_microstates(n: u64) -> MicrostateData {
    let macrostates: Vec<u64> = (0..=n).collect();
    let microstate_counts: Vec<f64> = macrostates.iter()
        .map(|&k| ln_binomial(n, k).exp())
        .collect();
    let entropy_per_macrostate: Vec<f64> = macrostates.iter()
        .map(|&k| ln_binomial(n, k))   // S/k_B = ln(Ω)
        .collect();

    MicrostateData {
        macrostates,
        microstate_counts,
        entropy_per_macrostate,
        most_probable_k: n / 2,
        total_microstates: 2.0_f64.powi(n as i32),
    }
}

fn ln_binomial(n: u64, k: u64) -> f64 {
    use statrs::function::factorial::ln_factorial;
    ln_factorial(n) - ln_factorial(k) - ln_factorial(n - k)
}
```

---

#### Q6.2 — Entropy of Mixing

**Concept**: When two ideal gases mix, entropy increases even though no energy changes. This is purely a counting effect: there are more microstates when the gases are mixed than when they're separated. The Gibbs paradox arises when the particles are identical.

**Visualization — "The Mixing Chamber"**:
- A box divided by a removable partition. Left side: red particles. Right side: blue particles.
- **"Remove partition"** button: Particles diffuse and mix. An entropy counter climbs.
- **Entropy plot**: S vs time, showing approach to equilibrium
- **Gibbs paradox toggle**: Switch particles to "identical" (same color). Now removing the partition changes nothing — no entropy increase! Visual explanation of why identical particles must be treated differently.
- **Reversibility experiment**: "Put the partition back" — can you un-mix the gases? At small N (10 particles), occasionally they spontaneously un-mix! At large N (1000), it essentially never happens. This IS the second law.

---

#### Q6.3 — Shannon Entropy & Information Theory

**Concept**: Shannon entropy H = -Σ pᵢ log₂(pᵢ) measures the information content (or surprise) of a probability distribution. Maximum entropy = maximum uncertainty = uniform distribution. It connects thermodynamic entropy to information.

**Visualization — "The Entropy Equalizer"**:
- A set of adjustable probability bars (like an audio equalizer) for a discrete distribution
- **Bars must sum to 1** (normalized) — dragging one redistributes others
- **Shannon entropy gauge**: Updates in real-time as bars change
- **Preset distributions**: Uniform (max entropy), delta (zero entropy), Gaussian-ish, bimodal
- **"Surprise meter"**: When you sample from the distribution, high-probability outcomes give low surprise, low-probability outcomes give high surprise. The entropy is the average surprise.
- **Connection to physics**: Side panel showing how H → S when you multiply by k_B and use natural log. Same formula, different units!
- **20 questions game**: Claude generates a number, user asks yes/no questions. Entropy quantifies how much information each question gives. Optimal strategy = binary search = 1 bit per question.

---

## 4. DESIGN SYSTEM EXTENSIONS

### 4.1 Quantum Module Color Palette

```css
:root {
  /* Quantum module chapter colors */
  --q1-color: #6366F1;   /* Quantum Probability — indigo */
  --q2-color: #EC4899;   /* Stern-Gerlach — pink */
  --q3-color: #06B6D4;   /* Wavefunctions — cyan */
  --q4-color: #F97316;   /* Boltzmann — orange */
  --q5-color: #8B5CF6;   /* Quantum Statistics — violet */
  --q6-color: #10B981;   /* Entropy — emerald */

  /* Physics-specific viz colors */
  --spin-up: #3B82F6;
  --spin-down: #EF4444;
  --fermion-color: #3B82F6;
  --boson-color: #22C55E;
  --classical-color: #F59E0B;
  --wavefunction-re: #6366F1;
  --wavefunction-im: #EC4899;
  --probability-density: #06B6D4;
  --energy-level: #9CA3AF;
  --fermi-level: #EF4444;
}
```

### 4.2 New Reusable Components

| Component | Purpose | Used in |
|---|---|---|
| `BlochSphere.tsx` | Interactive 3D sphere for spin-½ state visualization | Q2.1, Q2.3 |
| `SternGerlach.tsx` | SG apparatus module (draggable, connectable) | Q2.1, Q2.2 |
| `WavefunctionPlot.tsx` | ψ(x) with Re/Im/|ψ|² views, filled curves | Q3.1, Q3.2, Q3.3 |
| `EnergyLevelDiagram.tsx` | Vertical energy levels with particle dots | Q3.1, Q4.2, Q5.1-5.3 |
| `GasParticles.tsx` | 2D kinetic gas Canvas simulation | Q4.1 |
| `OccupationPlot.tsx` | f(E) for FD/BE/MB side-by-side | Q5.1, Q5.2, Q5.3 |
| `QuantumStateViz.tsx` | Ket notation display + probability bars | Q1.1, Q2.1 |
| `PhaseSpacePlot.tsx` | (x, p) joint distribution visualization | Q3.3 |
| `EntropyGauge.tsx` | Animated entropy meter (thermometer-style) | Q6.1, Q6.2, Q6.3 |
| `PhasorDiagram.tsx` | Complex amplitude as rotating arrow | Q1.3 |

---

## 5. GAMIFICATION — QUANTUM MODULE MILESTONES

| Section | Milestone Name | Trigger |
|---|---|---|
| Schrödinger's Cat | "Quantum Observer" | Open 500+ boxes across sessions |
| Measurement & Collapse | "Collapse Master" | Correctly predict measurement outcomes 10 times in a row |
| Double Slit | "Wave-Particle Duality" | Toggle between classical and quantum mode 20+ times |
| Single SG | "Spin Doctor" | Explore all Bloch sphere quadrants |
| Sequential SG | "Pipeline Architect" | Build a 4+ stage SG pipeline |
| Spin Expectation | "Uncertainty Whisperer" | Find a state with ΔSx·ΔSy exactly at the lower bound |
| Particle in Box | "Quantum Confiner" | Explore n=1 through n=10 and superposition mode |
| Gaussian Wavepacket | "Packet Surfer" | Watch a packet spread for 100+ time steps |
| Uncertainty Principle | "Heisenberg's Nemesis" | Attempt to violate ΔxΔp < ℏ/2 more than 20 times (impossible!) |
| Maxwell-Boltzmann | "Speed Demon" | Compare 3+ different gas species on the same plot |
| Boltzmann Energy | "Thermal Explorer" | Sweep temperature from near-zero to very high |
| Partition Function | "Z Master" | Derive all 4 thermodynamic quantities for 3+ systems |
| Fermions vs Bosons | "Particle Classifier" | Correctly sort 10 real particles into fermion/boson categories |
| Fermi-Dirac | "Fermi Surfer" | Explore the Fermi surface at 5+ different temperatures |
| BEC | "Condensation Witness" | Cool bosons below Tc and observe >50% condensate fraction |
| Microstates | "Entropy Counter" | Scale up to N=1000 and observe the sharpening |
| Mixing | "Gibbs' Friend" | Discover the Gibbs paradox by toggling identical particles |
| Shannon Entropy | "Information Theorist" | Achieve maximum entropy with the equalizer |

---

## 6. IMPLEMENTATION ORDER (for Claude Code)

### Phase 1 — Module Integration (Day 1)
1. Add quantum module to sidebar navigation alongside classical module
2. Set up routing for all 6 new chapters
3. Create chapter index pages with section navigation
4. Add quantum color palette to global CSS

### Phase 2 — Chapter Q1: Quantum Probability (Day 2-3)
5. Build `QuantumStateViz.tsx` (ket notation + probability bars)
6. Build Schrödinger's Cat visualization (box + measurement + histogram)
7. Build Measurement & Collapse (classical vs quantum comparison)
8. Build Double Slit (amplitude + interference + which-path toggle)
9. Implement all Q1 Rust commands

### Phase 3 — Chapter Q2: Stern-Gerlach (Day 4-5)
10. Build `BlochSphere.tsx` (3D CSS transform interactive sphere)
11. Build `SternGerlach.tsx` (apparatus module with beam animation)
12. Build single SG experiment visualization
13. Build sequential SG pipeline (drag-and-drop modules)
14. Build spin expectation dashboard
15. Implement all Q2 Rust commands

### Phase 4 — Chapter Q3: Wavefunctions (Day 6-7)
16. Build `WavefunctionPlot.tsx` (Re/Im/|ψ|² views)
17. Build Particle in Box (eigenstate viewer + sampling)
18. Build Gaussian Wavepacket (time evolution animation)
19. Build Uncertainty Principle (seesaw + Fourier dual)
20. Implement all Q3 Rust commands

### Phase 5 — Chapter Q4: Boltzmann World (Day 8-9)
21. Build `GasParticles.tsx` (Canvas 2D kinetic simulation)
22. Build Maxwell-Boltzmann speed distribution
23. Build `EnergyLevelDiagram.tsx` (reusable for Q4 and Q5)
24. Build Boltzmann energy distribution
25. Build Partition Function machine
26. Implement all Q4 Rust commands

### Phase 6 — Chapter Q5: Quantum Statistics (Day 10-11)
27. Build `OccupationPlot.tsx` (FD/BE/MB comparison)
28. Build Fermions vs Bosons hotel visualization
29. Build Fermi sea visualization with temperature control
30. Build Bose-Einstein condensation visualization
31. Implement all Q5 Rust commands

### Phase 7 — Chapter Q6: Entropy (Day 12-13)
32. Build `EntropyGauge.tsx`
33. Build Microstates counter (toggleable coins + histogram)
34. Build Mixing chamber (particles + partition removal)
35. Build Shannon entropy equalizer
36. Implement all Q6 Rust commands

### Phase 8 — Polish (Day 14+)
37. Add all gamification milestones
38. Cross-link related concepts between classical and quantum modules
39. Add keyboard shortcuts for quantum module
40. Performance test gas simulation on low-end hardware
41. Add guided walkthrough mode for each chapter

---

## 7. KEY IMPLEMENTATION NOTES FOR CLAUDE CODE

1. **Complex number math**: Use `num-complex` in Rust for all wavefunction computations. Never approximate complex arithmetic in JavaScript — always send to Rust.

2. **Canvas for particle simulations**: The 2D gas simulation (Q4.1) and double-slit photon accumulation (Q1.3) should use HTML Canvas, not SVG. Target 60fps with 500 particles via requestAnimationFrame, but compute particle physics in Rust and send position updates via Tauri events.

3. **Bloch Sphere**: Implement as CSS 3D transforms (not WebGL) for wider compatibility. Use `perspective`, `rotateX`, `rotateY` on a sphere container. The state vector arrow is a CSS-transformed `div`. Dragging uses pointer events with spherical coordinate conversion.

4. **Streaming time evolution**: For the Gaussian wavepacket (Q3.2), pre-compute N frames in Rust and send as a batch. Frontend plays them back as an animation. Don't compute frame-by-frame over IPC — the latency kills smoothness.

5. **KaTeX for all formulas**: Every section has key equations. Render them with KaTeX inline. Include both the formal math AND a plain-English tooltip explanation. Example: "⟨E⟩ = -∂(ln Z)/∂β" → tooltip: "The average energy equals the negative derivative of log(partition function) with respect to inverse temperature."

6. **Crosslinks to classical module**: Where concepts overlap (e.g., expectation value, variance, Gaussian distribution), add "See also: Chapter 1.2 — Expectation" links that navigate to the classical module. These connections reinforce that quantum stats is an extension, not a replacement, of classical stats.

7. **Physical units toggle**: Add a toggle between "natural units" (ℏ=1, kB=1, m=1) and SI units. Physics students need to see both. Default to natural units for cleaner math, with SI available for engineering students.

8. **Accessibility**: Color-blind safe palette for fermion (blue pattern) vs boson (green pattern). Use shape coding in addition to color: fermions = squares, bosons = circles. All interactive elements keyboard-navigable.

9. **Error states**: If a Rust computation fails (e.g., invalid parameters), show a friendly error in the visualization area, not a crash. Example: "Temperature must be positive! The third law says you can't reach absolute zero."

10. **Educational text**: Write all explanatory text in our own words. The mathematical formulas are factual. The text should be conversational, not textbook-dry. Use analogies. Example: "The Fermi-Dirac distribution is like a concert venue with assigned seats — once a seat is taken, no one else can sit there."

---

## 8. ATTRIBUTION

```
Quantum & Statistical Physics Module for Seeing Theory Desktop
Inspired by: QuVis (St Andrews), PhET (Colorado), Seeing Theory (Brown)
Original Seeing Theory: Daniel Kunin, Brown University (Apache 2.0)
All educational content written independently.
Non-commercial educational use only.
```
