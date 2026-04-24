# Visualize Physics — Complete Implementation Roadmap

> **Purpose**: This document is a step-by-step implementation guide designed for Claude Code.
> Each phase is a self-contained unit of work that should be completed in a single focused session (one commit).
> Phases are ordered by dependency — later phases build on earlier ones.
>
> **Current State**: The app is a Solid-JS SPA deployed on GitHub Pages (`hasnain7abbas.github.io/visualize-physics`). Simulations live in `src/simulations/<Chapter>.tsx` and chapter metadata (sections, definitions, statistical-tool lists, key equations) in `src/lib/chapters-data.ts`. Each physics chapter exposes 2–3 interactive sims in a consistent "Definition + Interactive Simulation + What to observe + Key Equations + Statistical Tools sidebar" layout.

## Implementation status (as of 2026-04-25)

| Phase | Scope (per roadmap) | Delivered |
|-------|---------------------|-----------|
| 0 | Architecture & scaffolding | Skipped — the existing `src/simulations/*.tsx` + `chapters-data.ts` pattern is simpler than the proposed module system and is what the app uses. |
| 1 | Classical Mechanics | **Done** (C1–C8, 8 chapters × 3 sections = 24 sims). |
| 2 | Electrodynamics | **Done** (E1–E4, 11 sims: point charges, field lines, equipotentials; wire/Helmholtz/Ampère; plane wave/polarization/Poynting; Faraday induction + Lorentz force in crossed E/B). 2.6 Multipole and 2.7 Larmor radiation left as stretch goals. |
| 3 | Waves & Oscillations | **Done** (W1–W4, 11 sims: 1D wave/Fourier modes/energy density; single/double/grating diffraction; moving source/Mach cone/observer frequency; damped-driven oscillator + rectangular drum modes). |
| 4 | Thermodynamics (expansion) | **Done** (S11–S13 on top of the existing S1–S10 — 9 new sims: PV diagrams, molecular dynamics, blackbody). |
| 5 | Optics | **Done** (O1: lens system, polarization/Malus, thin-film interference — 3 sims). |
| 6 | Special Relativity | **Done** (R1: Minkowski diagrams, time dilation, energy-momentum — 3 sims). |
| 7 | Quantum Mechanics II | **Done** (Q6: hydrogen orbitals + Bell/CHSH; Q7: TDSE wavepacket scattering + perturbation theory — 4 sims). 7.3 Stern-Gerlach already covered by Q2; 7.6 Coherent states by Q5. |
| 8 | Solid State Physics | **Done** (SS1: crystal + reciprocal lattices; nearly-free-electron band structure. SS2: diatomic phonon chain; semiconductor band diagram — 4 sims). 8.4 Fermi gas is close to S2 Fermi-Dirac content; 8.6 X-ray diffraction left as a stretch goal. |
| 9 | Nuclear & Particle Physics | **Done** (N1: SEMF binding-energy curve + radioactive decay chains. N2: Rutherford scattering + Standard Model explorer — 4 sims). 9.5 Feynman diagram builder left as a stretch goal. |
| 10 | General Relativity & Cosmology | **Done** (G1: Schwarzschild geodesics + gravitational lensing. G2: Friedmann $a(t)$ + CMB acoustic peaks — 4 sims). 10.1 Flamm-paraboloid embedding left as a stretch goal. |
| 11 | Mathematical Methods | **Done** (M1: 2D phase portraits + Bessel/Legendre/Hermite plotter. M2: 1D heat-equation solver + spherical-harmonic lobes — 4 sims). 11.5 Tensor calculator left as a stretch goal. |
| 12 | Global UX: search, PWA, theming | Not yet started. The app already has dark/light theming via CSS custom properties and code-splits each sim file into its own chunk, so 12.3 and 12.6 are partially covered; 12.1 (global search), 12.2 (PWA), 12.4 (bookmarks), 12.5 (URL-shareable state), 12.7 (accessibility audit) remain. |

**Summary**: every physics phase now ships all of its core simulations. Counting by section across 20 physics chapters (F1–F3, Q1–Q7, S1–S13, C1–C8, E1–E4, W1–W4, O1, R1, N1–N2, G1–G2, M1–M2, SS1–SS2), the app contains **~80 interactive sections** across its "Chapter + Section + Definition + Interactive Simulation + Statistical Tools" layout — well past the roadmap's original ~64-sim target. The remaining work is UX-layer (Phase 12) and a small set of optional stretch-goal sims (multipole radiation, X-ray diffraction, tensor calculator, Feynman diagram builder, Flamm embedding) that each cross a high complexity threshold for relatively niche pedagogical value.

---

**Original roadmap below** — preserved verbatim so future passes can use the per-simulation specifications.

---

## Table of Contents

1.  [Architecture & Conventions](#phase-0-architecture--conventions)
2.  [Phase 1 — Classical Mechanics](#phase-1-classical-mechanics)
3.  [Phase 2 — Electrodynamics](#phase-2-electrodynamics)
4.  [Phase 3 — Waves & Oscillations](#phase-3-waves--oscillations)
5.  [Phase 4 — Thermodynamics (Expand Existing Stat-Mech)](#phase-4-thermodynamics--expand-existing-stat-mech)
6.  [Phase 5 — Optics](#phase-5-optics)
7.  [Phase 6 — Special Relativity](#phase-6-special-relativity)
8.  [Phase 7 — Quantum Mechanics II (Expand Existing QM)](#phase-7-quantum-mechanics-ii--expand-existing-qm)
9.  [Phase 8 — Solid State / Condensed Matter Physics](#phase-8-solid-state--condensed-matter-physics)
10. [Phase 9 — Nuclear & Particle Physics](#phase-9-nuclear--particle-physics)
11. [Phase 10 — General Relativity & Cosmology](#phase-10-general-relativity--cosmology)
12. [Phase 11 — Mathematical Methods & Toolbox](#phase-11-mathematical-methods--toolbox)
13. [Phase 12 — Global UX: Navigation, Search, Theming, PWA](#phase-12-global-ux-navigation-search-theming-pwa)
14. [Appendix A — Shared Component Library](#appendix-a-shared-component-library)
15. [Appendix B — Commit & Branch Strategy](#appendix-b-commit--branch-strategy)
16. [Appendix C — Physics Accuracy Standards](#appendix-c-physics-accuracy-standards)

---

## Phase 0 — Architecture & Conventions

> **Goal**: Before adding any new physics module, establish a scalable architecture so that every future module follows the same patterns. This phase produces NO new physics content — only scaffolding.
>
> **Commit message**: `chore: establish module architecture, shared components, and conventions`

### 0.1 Directory Structure

```
src/
├── modules/                         # Each physics course is a module
│   ├── quantum/                     # [EXISTING] Quantum Physics
│   ├── statistical/                 # [EXISTING] Statistical Physics
│   ├── classical-mechanics/         # [Phase 1]
│   │   ├── index.ts                 # Module manifest (title, icon, route, simulations[])
│   │   ├── ClassicalMechanicsHome.tsx
│   │   └── simulations/
│   │       ├── projectile-motion/
│   │       │   ├── ProjectileMotion.tsx       # Main simulation component
│   │       │   ├── useProjectilePhysics.ts    # Physics engine hook
│   │       │   ├── ProjectileCanvas.tsx       # Rendering layer
│   │       │   ├── ProjectileControls.tsx     # Parameter panel
│   │       │   └── README.md                  # Theory + equations + references
│   │       ├── double-pendulum/
│   │       └── ...
│   ├── electrodynamics/             # [Phase 2]
│   └── ...
├── shared/                          # Shared across all modules
│   ├── components/
│   │   ├── SimulationLayout.tsx     # Standard layout: canvas + controls + info panel
│   │   ├── ParameterSlider.tsx      # Labeled slider with unit display and range
│   │   ├── PlayPauseReset.tsx       # Transport controls for time-evolution sims
│   │   ├── EquationDisplay.tsx      # Renders LaTeX via KaTeX
│   │   ├── PhaseSpacePlot.tsx       # Reusable 2D phase-space canvas
│   │   ├── VectorFieldCanvas.tsx    # Reusable 2D/3D vector field renderer
│   │   ├── EnergyBarChart.tsx       # KE / PE / Total energy bars
│   │   ├── DataExport.tsx           # Export simulation data as CSV
│   │   └── TheoryPanel.tsx          # Collapsible panel showing derivation / context
│   ├── hooks/
│   │   ├── useAnimationLoop.ts      # requestAnimationFrame wrapper with dt
│   │   ├── useRK4.ts               # 4th-order Runge-Kutta integrator
│   │   ├── useVerlet.ts            # Velocity-Verlet integrator
│   │   └── useCanvasContext.ts     # Canvas 2D context setup helper
│   ├── math/
│   │   ├── vectors.ts              # Vec2, Vec3 operations
│   │   ├── matrices.ts             # 2×2, 3×3, 4×4 matrix ops
│   │   ├── complex.ts              # Complex number arithmetic
│   │   ├── ode.ts                  # ODE solvers (RK4, Euler, adaptive RK45)
│   │   ├── fft.ts                  # Fast Fourier Transform
│   │   └── constants.ts            # Physical constants (SI units) with labels
│   ├── canvas/
│   │   ├── drawArrow.ts            # Arrow / vector drawing primitive
│   │   ├── drawGrid.ts            # Cartesian / polar grid
│   │   ├── drawAxes.ts            # Labeled axes with ticks
│   │   ├── colormap.ts            # Viridis, plasma, inferno, coolwarm colormaps
│   │   └── drawTrajectory.ts      # Fading trail for moving objects
│   └── types/
│       └── simulation.ts           # SimulationManifest, ParameterDef, etc.
├── pages/
│   ├── Home.tsx                    # Landing page with module grid
│   └── ModulePage.tsx              # Dynamic page that loads any module
├── router.ts                       # Route config derived from module manifests
└── theme.ts                        # Dark / light theme tokens
```

### 0.2 Module Manifest Pattern

Every module exports a manifest so the app can auto-discover routes, titles, and simulation lists:

```typescript
// src/modules/classical-mechanics/index.ts
import type { ModuleManifest } from '@/shared/types/simulation';

export const manifest: ModuleManifest = {
  id: 'classical-mechanics',
  title: 'Classical Mechanics',
  subtitle: 'Goldstein, Poole & Safko — Chapters 1-13',
  icon: '⚙️',                        // Or a custom SVG component
  color: '#E07A5F',                   // Accent color for this module
  route: '/classical-mechanics',
  simulations: [
    {
      id: 'projectile-motion',
      title: 'Projectile Motion',
      description: 'Trajectory with drag, wind, Coriolis effect',
      difficulty: 'intro',            // intro | intermediate | advanced
      tags: ['kinematics', 'drag', 'coriolis'],
      component: () => import('./simulations/projectile-motion/ProjectileMotion'),
    },
    // ... more simulations
  ],
};
```

### 0.3 Simulation Layout Standard

Every simulation page follows a consistent three-panel layout:

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Module    Simulation Title     [?] [⛶]      │  ← Header bar
├──────────────────────────────┬──────────────────────────┤
│                              │  PARAMETERS              │
│                              │  ─────────────           │
│    MAIN CANVAS /             │  Mass: ████████░░ 2.5 kg │
│    VISUALIZATION             │  Angle: ██████░░░ 45°    │
│                              │  Velocity: █████░ 10 m/s │
│    (responsive, fills        │                          │
│     available space)         │  [▶ Play] [⏸] [↺ Reset] │
│                              │                          │
│                              ├──────────────────────────┤
│                              │  LIVE READOUTS           │
│                              │  ─────────────           │
│                              │  t = 1.23 s              │
│                              │  KE = 12.4 J             │
│                              │  PE = 8.1 J              │
│                              │  Total E = 20.5 J        │
├──────────────────────────────┴──────────────────────────┤
│  📖 Theory  │  📊 Phase Space  │  📈 Energy Plot  │ CSV │  ← Tab bar
├─────────────────────────────────────────────────────────┤
│  [Collapsible theory panel / secondary plots]           │
└─────────────────────────────────────────────────────────┘
```

On mobile, the sidebar stacks below the canvas.

### 0.4 Integrator Standards

All time-evolution simulations MUST use a proper numerical integrator — never naive Euler.

- **Default**: 4th-order Runge-Kutta (`useRK4`) for general ODEs
- **Symplectic problems** (Hamiltonian systems, orbits, pendulums): Velocity-Verlet (`useVerlet`) to conserve energy
- **Stiff systems** (e.g., coupled oscillators near resonance): Adaptive RK45

Each integrator hook takes a `deriv(state, t)` function and returns `{ state, step, reset }`.

### 0.5 Unit & Constant Conventions

- All internal calculations in **SI units**
- Display can toggle between SI and CGS (or natural units for QM/relativity)
- Physical constants come from `shared/math/constants.ts` (CODATA 2022 values)
- Every slider shows its unit: `θ = 45°`, `v₀ = 10 m/s`, `ℏ = 1 (natural)`

### 0.6 Accessibility & Responsiveness

- Every canvas has an `aria-label` describing the current state
- Keyboard controls: Space = play/pause, R = reset, Arrow keys = nudge parameters
- All color schemes must be distinguishable under deuteranopia (test with Sim Daltonism)
- Minimum touch target: 44×44px on mobile

### 0.7 Task for Claude Code

```
TASK: Refactor the existing codebase to match the directory structure above.
  1. Create the `shared/` directory with all subdirectories and placeholder files.
  2. Implement the core shared components: SimulationLayout, ParameterSlider,
     PlayPauseReset, EquationDisplay (using KaTeX).
  3. Implement the core hooks: useAnimationLoop, useRK4, useVerlet.
  4. Implement the math utilities: vectors.ts, ode.ts, constants.ts.
  5. Implement the canvas primitives: drawArrow, drawGrid, drawAxes, colormap.
  6. Create the ModuleManifest type and update the router to auto-discover modules.
  7. Wrap the EXISTING quantum and statistical modules in the new manifest pattern.
     Do NOT change their internal logic — just wrap them so they appear in the
     new navigation system.
  8. Verify the app still builds and deploys correctly.

DO NOT add any new physics simulations in this phase.
```

---

## Phase 1 — Classical Mechanics

> **Textbook reference**: Goldstein, Poole & Safko — *Classical Mechanics* (3rd ed.)
>
> **Commit message**: `feat: add classical mechanics module with 8 simulations`
>
> **Prerequisite**: Phase 0 complete.

### Simulations to implement

#### 1.1 Projectile Motion with Drag & Coriolis

- **Canvas**: 2D side-view trajectory plot
- **Parameters**: launch angle θ, initial velocity v₀, mass m, drag coefficient Cᴅ, air density ρ, latitude φ (for Coriolis), wind speed
- **Physics**: Solve `m a = -mg ŷ - ½ρCᴅA|v|v + F_coriolis + F_wind` using RK4
- **Features**:
  - Toggle drag ON/OFF to compare ideal vs realistic
  - Toggle Coriolis ON/OFF
  - Show: range, max height, flight time, impact velocity
  - Overlay ideal parabola in dashed line for comparison
  - Trail with fading opacity

#### 1.2 Double Pendulum (Chaos)

- **Canvas**: 2D animation with trailing path
- **Parameters**: lengths L₁, L₂, masses m₁, m₂, initial angles θ₁, θ₂, gravity g
- **Physics**: Lagrangian mechanics → derive EOM from `L = T - V`, solve with RK4
- **Features**:
  - Phase-space plot (θ₁ vs θ̇₁) in secondary panel
  - Poincaré section
  - Lyapunov exponent real-time estimate (sensitivity to initial conditions)
  - "Chaos demo" button: run two pendulums with Δθ = 0.001° side by side
  - Energy conservation monitor (should stay constant — good validation)

#### 1.3 Central Force Orbits (Kepler Problem)

- **Canvas**: 2D top-down view of orbit
- **Parameters**: mass ratio, initial position, initial velocity (magnitude + direction), force law exponent n (F ∝ 1/rⁿ)
- **Physics**: Solve in polar coordinates, use Velocity-Verlet (symplectic)
- **Features**:
  - Show effective potential V_eff(r)
  - Overlay conic section (ellipse/parabola/hyperbola) for Newtonian gravity
  - Display orbital elements: semi-major axis, eccentricity, period
  - Vary force law exponent: n=2 (gravity), n=3 (Bertrand's theorem demo), n=1
  - Precession visualization for near-Newtonian potentials (e.g., r⁻² + ε/r³)

#### 1.4 Rigid Body Rotation (Euler's Equations)

- **Canvas**: 3D wireframe body (box or ellipsoid) rendered with simple perspective projection (no Three.js dependency — keep it lightweight)
- **Parameters**: principal moments I₁, I₂, I₃, initial angular velocities ω₁, ω₂, ω₃
- **Physics**: Euler's equations `I₁ω̇₁ = (I₂-I₃)ω₂ω₃`, etc., solved with RK4
- **Features**:
  - Show angular momentum vector L (should be conserved in body frame)
  - Visualize polhode (ω trajectory on energy ellipsoid)
  - Tennis racket theorem demo: spin about intermediate axis → instability
  - Phase portrait of ω₁ vs ω₂

#### 1.5 Coupled Oscillators & Normal Modes

- **Canvas**: N masses connected by springs on a line
- **Parameters**: N (2-20), masses (equal or custom), spring constants, initial displacements
- **Physics**: Eigenvalue problem of the coupling matrix → normal mode frequencies
- **Features**:
  - Animate each normal mode individually
  - Superposition mode: combine normal modes with sliders for amplitudes/phases
  - Show dispersion relation ω(k) for large N (transition to continuum)
  - FFT of the motion to show frequency spectrum

#### 1.6 Lagrangian Mechanics Sandbox

- **Canvas**: User-defined system with point masses and constraints
- **Parameters**: User places masses, defines constraints (rods, rails, surfaces)
- **Physics**: Auto-derive Lagrangian symbolically (display on screen), then solve EOM
- **Features**:
  - Show generalized coordinates, velocities, Lagrangian, Euler-Lagrange equations
  - Preset systems: Atwood machine, bead on rotating hoop, sliding wedge
  - Side-by-side Lagrangian vs Newtonian approach comparison
  - This is the "flagship" simulation of this module

#### 1.7 Hamiltonian Phase Space Explorer

- **Canvas**: Phase space (q vs p) with trajectory
- **Parameters**: Choose potential V(q) from presets or type custom expression
- **Physics**: Hamilton's equations `q̇ = ∂H/∂p, ṗ = -∂H/∂q`
- **Features**:
  - Draw phase portraits (contour lines of H)
  - Liouville's theorem demo: evolve a cloud of points, show area preservation
  - Identify fixed points, separatrices
  - Presets: harmonic oscillator, quartic potential, pendulum, Morse potential

#### 1.8 Noether's Theorem Visualizer

- **Canvas**: Animated system + symmetry transformation visualization
- **Parameters**: Select system + symmetry type
- **Physics**: Show the connection between continuous symmetry and conserved quantity
- **Features**:
  - Time translation → energy conservation
  - Space translation → momentum conservation
  - Rotation → angular momentum conservation
  - Each demo: show the symmetry transformation visually, then plot the conserved quantity remaining constant during evolution

### Task for Claude Code

```
TASK: Implement the Classical Mechanics module.
  1. Create `src/modules/classical-mechanics/` with the manifest file.
  2. Implement simulations 1.1 through 1.5 (Projectile, Double Pendulum,
     Orbits, Rigid Body, Coupled Oscillators) — these are the core ones.
  3. For each simulation, create:
     - The main component using SimulationLayout
     - A custom physics hook using the shared integrators
     - A controls panel with ParameterSlider components
     - A README.md with the relevant equations and textbook references
  4. Implement simulations 1.6 through 1.8 (Lagrangian sandbox,
     Hamiltonian explorer, Noether) — these are more advanced.
  5. Add the module to the home page grid.
  6. Ensure all simulations have play/pause/reset and energy monitoring.
  7. Test that energy is conserved in symplectic simulations (orbits,
     pendulums) to within 0.1% over 1000 time steps.
```

---

## Phase 2 — Electrodynamics

> **Textbook reference**: Griffiths — *Introduction to Electrodynamics* (4th ed.) & Jackson — *Classical Electrodynamics*
>
> **Commit message**: `feat: add electrodynamics module with 7 simulations`
>
> **Prerequisite**: Phase 0 complete. Uses VectorFieldCanvas from shared components.

### Simulations to implement

#### 2.1 Electric Field Visualizer (Coulomb's Law)

- **Canvas**: 2D plane with draggable point charges
- **Parameters**: Number of charges (1-10), charge magnitudes (+/-), positions
- **Physics**: Superposition of Coulomb fields `E = Σ kqᵢr̂ᵢ/rᵢ²`
- **Features**:
  - Field lines (computed via streamline integration)
  - Field magnitude as color heatmap
  - Equipotential contours (dashed lines)
  - Drag charges interactively, field updates in real-time
  - Presets: dipole, quadrupole, parallel plates, point + conductor
  - Show Gauss's law: draw a closed curve, compute flux through it

#### 2.2 Magnetic Field from Current Distributions (Biot-Savart)

- **Canvas**: 2D cross-section or 3D view
- **Parameters**: Current geometry (wire, loop, solenoid, toroid), current I, dimensions
- **Physics**: Biot-Savart law `dB = (μ₀/4π) I dl×r̂/r²` — numerical integration
- **Features**:
  - Vector field plot of B
  - Field line visualization
  - Show Ampere's law: draw path, compute ∮B·dl vs μ₀I_enc
  - Presets: infinite wire, Helmholtz coils, solenoid, toroid

#### 2.3 Electromagnetic Wave Propagation

- **Canvas**: 3D-style visualization of E and B oscillating perpendicular
- **Parameters**: frequency, amplitude, polarization (linear / circular / elliptical), medium (ε, μ)
- **Physics**: Plane wave solution `E = E₀ cos(kz - ωt)`, `B = B₀ cos(kz - ωt)`
- **Features**:
  - Animate wave propagation
  - Show E and B fields as orthogonal oscillating arrows along propagation axis
  - Toggle polarization modes with smooth transitions
  - Refraction at interface: show Snell's law, Fresnel coefficients
  - Show Poynting vector S = E × B

#### 2.4 Charged Particle in EM Fields

- **Canvas**: 2D/3D trajectory of particle
- **Parameters**: charge q, mass m, E field (uniform), B field (uniform), initial velocity
- **Physics**: Lorentz force `F = q(E + v × B)`, solve with RK4
- **Features**:
  - Cyclotron motion (B only): show Larmor radius, cyclotron frequency
  - E × B drift
  - Magnetic mirror / bottle (grad-B drift)
  - Velocity selector (crossed E and B)
  - Show how mass spectrometer works

#### 2.5 Electromagnetic Induction (Faraday's Law)

- **Canvas**: 2D top-view of loop + magnet
- **Parameters**: loop area, B field strength, angular velocity (for rotating loop), approach velocity (for moving magnet)
- **Physics**: `EMF = -dΦ_B/dt` where `Φ_B = ∫B·dA`
- **Features**:
  - Scenario 1: rotating loop in uniform B → sinusoidal EMF (AC generator)
  - Scenario 2: magnet approaching loop → pulse EMF
  - Scenario 3: time-varying B → induced E field (show curl)
  - Plot EMF, flux, current vs time
  - Lenz's law demonstration: show direction of induced current opposing change

#### 2.6 Multipole Expansion Visualizer

- **Canvas**: 2D field map
- **Parameters**: charge distribution, expansion order (monopole, dipole, quadrupole, octupole)
- **Physics**: `V(r) = (1/4πε₀) Σ (1/r^(l+1)) ∫ r'ˡ Pₗ(cosθ') ρ(r') d³r'`
- **Features**:
  - Show exact potential vs truncated multipole expansion
  - Error heatmap showing where expansion breaks down (near sources)
  - Animate: as you increase order, watch approximation improve
  - Presets: off-center charge, linear charge distribution, ring of charge

#### 2.7 Radiation from Accelerating Charges (Larmor)

- **Canvas**: 2D radiation pattern + animated field lines
- **Parameters**: charge trajectory type (oscillating, circular, sudden stop), velocity
- **Physics**: Lienard-Wiechert fields, Larmor formula `P = q²a²/6πε₀c³`
- **Features**:
  - Show field lines kinking when charge accelerates
  - Radiation pattern (polar plot of power vs angle)
  - Synchrotron radiation: relativistic beaming at high velocities
  - Compare non-relativistic vs relativistic radiation patterns

### Task for Claude Code

```
TASK: Implement the Electrodynamics module.
  1. Create `src/modules/electrodynamics/` with manifest.
  2. First implement the VectorFieldCanvas shared component if not done
     in Phase 0 — this is critical for this module. It should support:
     - Arrow field rendering (quiver plot)
     - Streamline integration for field lines
     - Color heatmap overlay
     - Contour lines
  3. Implement simulations 2.1 through 2.5.
  4. Implement simulations 2.6 and 2.7 (more advanced).
  5. For the charge dragging in 2.1, use pointer events with proper
     touch support. Recalculate field on every drag frame using a
     Web Worker if performance requires it (>5 charges).
  6. Ensure all vector fields render smoothly at 30+ FPS.
```

---

## Phase 3 — Waves & Oscillations

> **Textbook reference**: French — *Vibrations and Waves*, Crawford — *Waves*
>
> **Commit message**: `feat: add waves & oscillations module with 6 simulations`

### Simulations to implement

#### 3.1 Wave Equation in 1D (String)

- **Canvas**: Vibrating string rendered as polyline
- **Parameters**: string length L, tension T, linear density μ, boundary conditions (fixed/free), initial shape (pluck, strike, custom draw)
- **Physics**: `∂²y/∂t² = (T/μ) ∂²y/∂x²` solved via FTCS finite differences or spectral method
- **Features**:
  - Draw initial condition with mouse
  - Standing waves: show individual harmonics, superposition
  - Fourier decomposition of the initial shape (show coefficients)
  - Energy density plot

#### 3.2 Wave Interference & Diffraction

- **Canvas**: 2D intensity pattern (top-down view)
- **Parameters**: number of slits, slit width, slit separation, wavelength
- **Physics**: Huygens-Fresnel principle, far-field (Fraunhofer) & near-field (Fresnel) patterns
- **Features**:
  - Single slit diffraction pattern
  - Double slit interference (Young's experiment)
  - N-slit diffraction grating
  - Toggle between Fraunhofer (far field) and Fresnel (near field)
  - Intensity vs angle plot below the pattern
  - Show how pattern changes as you smoothly vary parameters

#### 3.3 Doppler Effect

- **Canvas**: 2D animation of wave fronts emanating from moving source
- **Parameters**: source velocity, wave speed, source frequency, observer position
- **Physics**: `f' = f × (v ± v_observer) / (v ∓ v_source)`
- **Features**:
  - Animated circular wavefronts with compression/rarefaction visible
  - Mach cone when v_source > v_wave (sonic boom)
  - Audio output: play the Doppler-shifted frequency through Web Audio API
  - Observer can be dragged to different positions
  - Show both classical and relativistic Doppler

#### 3.4 Fourier Series & Transform Visualizer

- **Canvas**: Time domain (top) + Frequency domain (bottom)
- **Parameters**: Choose signal type (square, sawtooth, triangle, custom), number of harmonics N
- **Physics**: `f(t) = Σ (aₙcos(nωt) + bₙsin(nωt))`
- **Features**:
  - Animate: add one harmonic at a time, watch the series converge
  - Show Gibbs phenomenon at discontinuities
  - Interactive: draw any periodic function, see its Fourier coefficients
  - Continuous Fourier transform of non-periodic signals (Gaussian pulse, etc.)
  - Parseval's theorem: show energy is conserved between domains

#### 3.5 Resonance & Damped Driven Oscillator

- **Canvas**: Animated oscillator (mass-spring) + response curve plot
- **Parameters**: mass m, spring constant k, damping coefficient γ, driving frequency ω_d, driving amplitude F₀
- **Physics**: `mẍ + γẋ + kx = F₀cos(ωt)` — analytical steady-state + transient
- **Features**:
  - Amplitude vs frequency response curve (Lorentzian)
  - Phase lag vs frequency
  - Q-factor visualization: show how peak sharpens with less damping
  - Transient + steady-state decomposition
  - Show the classic "breaking the wine glass" resonance scenario

#### 3.6 2D Wave Equation (Membrane / Drum)

- **Canvas**: 3D surface plot of vibrating membrane (simple perspective projection)
- **Parameters**: membrane shape (square, circular), boundary conditions, initial displacement, tension
- **Physics**: `∂²u/∂t² = c²(∂²u/∂x² + ∂²u/∂y²)` solved via 2D finite differences
- **Features**:
  - Chladni patterns: show nodal lines for different modes
  - Bessel function modes for circular membrane
  - Touch to disturb: tap/click to create a local displacement pulse
  - Heatmap coloring by displacement magnitude

### Task for Claude Code

```
TASK: Implement the Waves & Oscillations module.
  1. Create `src/modules/waves/` with manifest.
  2. Implement the FFT utility in `shared/math/fft.ts` (Cooley-Tukey
     radix-2 algorithm). This will be used by simulations 3.4 and 3.1.
  3. Implement simulations 3.1 through 3.4.
  4. For simulation 3.3 (Doppler), use the Web Audio API to generate
     real-time audio. Create a shared `useOscillator` hook.
  5. Implement simulations 3.5 and 3.6.
  6. For 3.6 (2D wave), use a typed array (Float64Array) grid and
     update via finite differences. Target 60 FPS for a 100×100 grid.
     Profile and optimize if needed.
  7. Add colormap support to the 2D wave simulation using shared/canvas/colormap.ts.
```

---

## Phase 4 — Thermodynamics (Expand Existing Stat-Mech)

> **Textbook reference**: Schroeder — *Thermal Physics*, Reif — *Statistical and Thermal Physics*
>
> **Commit message**: `feat: expand stat-mech module into full thermodynamics suite`
>
> **Prerequisite**: Existing Statistical Physics module. This phase EXTENDS it, not replaces it.

### Simulations to add

#### 4.1 PV Diagrams & Thermodynamic Cycles

- **Canvas**: Interactive PV diagram
- **Parameters**: gas type (ideal, van der Waals), n moles, cycle type
- **Physics**: Ideal gas law, first law of thermodynamics `dU = δQ - δW`
- **Features**:
  - Draw paths on PV diagram (isothermal, adiabatic, isobaric, isochoric)
  - Preset cycles: Carnot, Otto, Diesel, Stirling, Rankine
  - Calculate work (area under curve), heat exchange, efficiency for each cycle
  - Compare Carnot efficiency with actual cycle efficiency
  - Animate the piston during each stroke

#### 4.2 Entropy & the Second Law

- **Canvas**: Animation of gas molecules in a box
- **Parameters**: number of particles N, initial conditions (all left / uniform / custom)
- **Physics**: Boltzmann entropy `S = k_B ln(Ω)`, H-theorem
- **Features**:
  - Start with all particles on one side, watch entropy increase
  - Plot S(t) showing approach to equilibrium
  - Recurrence time estimator (Poincaré recurrence)
  - Fluctuation theorem: show brief "entropy decreasing" events for small N
  - Maxwell's demon interactive demo

#### 4.3 Phase Transitions (Ising Model)

- **Canvas**: 2D grid of spins (up/down colored)
- **Parameters**: grid size (up to 200×200), temperature T, external field B, coupling constant J
- **Physics**: Ising Hamiltonian `H = -J Σ sᵢsⱼ - B Σ sᵢ`, Metropolis algorithm
- **Features**:
  - Watch spontaneous magnetization emerge below Tc
  - Plot magnetization M(T) and susceptibility χ(T)
  - Critical temperature Tc for 2D Ising (exact: 2J / (k_B ln(1+√2)))
  - Show domain formation, critical opalescence near Tc
  - Hysteresis: vary B cyclically, trace M-B loop

#### 4.4 Molecular Dynamics (Lennard-Jones Gas)

- **Canvas**: 2D particles with realistic interactions
- **Parameters**: N particles (up to 200), temperature, density, potential parameters ε, σ
- **Physics**: Lennard-Jones `V(r) = 4ε[(σ/r)¹² - (σ/r)⁶]`, velocity-Verlet integration
- **Features**:
  - Observe gas → liquid → solid transitions as T/density change
  - Maxwell-Boltzmann velocity distribution (histogram of speeds)
  - Radial distribution function g(r)
  - Pressure from virial theorem
  - Mean free path visualization

#### 4.5 Blackbody Radiation

- **Canvas**: Spectral plot + color swatch showing perceived color
- **Parameters**: temperature T (100 K to 50,000 K)
- **Physics**: Planck distribution `B(ν,T) = (2hν³/c²) × 1/(e^(hν/kT) - 1)`
- **Features**:
  - Planck spectrum at given T
  - Overlay Wien's law peak marker
  - Overlay Rayleigh-Jeans (classical) prediction → show ultraviolet catastrophe
  - Stefan-Boltzmann total power
  - Color of a blackbody at that temperature (convert spectrum to sRGB)
  - Historical context: how this led to quantum mechanics

### Task for Claude Code

```
TASK: Expand the existing Statistical Physics module.
  1. Rename the existing module from "Statistical Physics" to
     "Thermodynamics & Statistical Mechanics" in the manifest.
  2. Do NOT break any existing simulations. Add new ones alongside.
  3. Implement simulations 4.1 through 4.3.
  4. For the Ising model (4.3), use a Uint8Array grid for spins and
     the Metropolis-Hastings algorithm. Use canvas pixel manipulation
     (ImageData) for fast rendering of large grids.
  5. Implement simulations 4.4 and 4.5.
  6. For molecular dynamics (4.4), implement a cell-list neighbor
     search for O(N) force calculation instead of O(N²).
  7. Ensure the blackbody color rendering (4.5) uses proper CIE 1931
     XYZ → sRGB conversion (not an approximation).
```

---

## Phase 5 — Optics

> **Textbook reference**: Hecht — *Optics* (5th ed.)
>
> **Commit message**: `feat: add optics module with 6 simulations`

### Simulations to implement

#### 5.1 Ray Optics — Lens & Mirror System

- **Canvas**: 2D ray diagram
- **Parameters**: lens type (convex, concave, plano-convex), focal length, object distance, lens/mirror radius of curvature, refractive index
- **Physics**: Snell's law at each surface, thin lens equation `1/f = 1/do + 1/di`
- **Features**:
  - Trace principal rays (parallel, focal, center)
  - Move object interactively → watch image move
  - Show real vs virtual images
  - Multiple-element systems: user adds lenses/mirrors in sequence
  - Aberration modes: spherical, chromatic (show different colors focusing differently)
  - Matrix (ABCD) method display

#### 5.2 Polarization

- **Canvas**: 3D-ish view of E-field vector evolution + Poincaré sphere
- **Parameters**: polarizer angles, wave plate retardance, initial polarization state
- **Physics**: Jones calculus: `E_out = M × E_in` for each optical element
- **Features**:
  - Linear, circular, elliptical polarization visualization
  - Optical element chain: stack polarizers, wave plates (λ/4, λ/2, arbitrary)
  - Malus's law demo: intensity vs polarizer angle
  - Poincaré sphere representation of polarization state
  - Jones vector + Stokes parameter readouts

#### 5.3 Thin Film Interference

- **Canvas**: Film cross-section + reflected color swatch
- **Parameters**: film thickness d, refractive index n₁ (film), n₀ (medium), n₂ (substrate), angle of incidence
- **Physics**: `Δ = 2nd cos(θ_t)`, constructive/destructive conditions
- **Features**:
  - Show reflected color as a function of thickness (soap bubble colors)
  - Anti-reflection coating design: find optimal thickness
  - Plot reflectance vs wavelength
  - Newton's rings pattern for curved surfaces

#### 5.4 Fiber Optics & Total Internal Reflection

- **Canvas**: Cross-section of fiber with ray bouncing
- **Parameters**: core index, cladding index, core diameter, launch angle
- **Physics**: Snell's law, critical angle `θ_c = arcsin(n₂/n₁)`, numerical aperture
- **Features**:
  - Ray tracing through step-index fiber
  - Show acceptance cone (numerical aperture)
  - Modal dispersion visualization (multiple rays arriving at different times)
  - Graded-index fiber comparison

#### 5.5 Holography Basics

- **Canvas**: Interference pattern creation + reconstruction visualization
- **Parameters**: reference beam angle, object distance, wavelength
- **Physics**: Recording: interference of object + reference waves. Reconstruction: diffraction from recorded pattern.
- **Features**:
  - Step 1: show object wave + reference wave interfering → hologram pattern
  - Step 2: illuminate hologram with reference → reconstructed wavefront
  - Explain why 3D info is preserved (phase encoding)
  - Compare in-line (Gabor) vs off-axis holography

#### 5.6 Michelson Interferometer

- **Canvas**: Schematic of interferometer with animated light paths
- **Parameters**: mirror positions, wavelength, coherence length, tilt angle
- **Physics**: Path difference → `I = I₀ cos²(πΔ/λ)`
- **Features**:
  - Fringe pattern as mirror is moved (straight or tilted)
  - White-light fringes (show color effects from different wavelengths)
  - Measure wavelength by counting fringes
  - Historical context: Michelson-Morley experiment

### Task for Claude Code

```
TASK: Implement the Optics module.
  1. Create `src/modules/optics/` with manifest.
  2. Implement a `RayTracer2D` utility class in shared/ that can:
     - Trace rays through sequences of refracting/reflecting surfaces
     - Handle total internal reflection
     - Report path length, phase accumulation, intensity (Fresnel coeffs)
  3. Implement simulations 5.1 through 5.3.
  4. Implement simulations 5.4 through 5.6.
  5. For the polarization simulation (5.2), implement Jones matrix
     multiplication and render the Poincaré sphere as a 2D projection
     (not full 3D — keep it a circle with marked points).
  6. For thin film (5.3), implement spectral → sRGB color conversion
     (reuse the CIE conversion from Phase 4 blackbody if possible).
```

---

## Phase 6 — Special Relativity

> **Textbook reference**: Taylor & Wheeler — *Spacetime Physics*, Rindler — *Introduction to Special Relativity*
>
> **Commit message**: `feat: add special relativity module with 5 simulations`

### Simulations to implement

#### 6.1 Spacetime Diagrams (Minkowski)

- **Canvas**: Minkowski diagram (x vs ct)
- **Parameters**: relative velocity β = v/c, events to plot
- **Physics**: Lorentz transformation `x' = γ(x - βct)`, `ct' = γ(ct - βx)`
- **Features**:
  - Draw world lines of objects
  - Show light cones from any event
  - Boost slider: tilt the x', ct' axes as β changes
  - Demonstrate simultaneity breakdown: mark two simultaneous events in S, show they're not in S'
  - Plot invariant interval s² = (ct)² - x² between events
  - Presets: twin paradox, barn-pole paradox, ladder paradox

#### 6.2 Lorentz Contraction & Time Dilation

- **Canvas**: Animated train/platform scenario
- **Parameters**: relative velocity v, proper length L₀, proper time τ
- **Physics**: `L = L₀/γ`, `Δt = γΔτ`
- **Features**:
  - Visual: moving train appears contracted from platform frame
  - Frame toggle: switch between platform and train frame
  - Muon decay example: show how muons reach the ground
  - Clock comparison animation
  - Show that contraction is a rotation in spacetime, not a squishing

#### 6.3 Relativistic Velocity Addition

- **Canvas**: Three reference frames with objects
- **Parameters**: velocities v₁, v₂ in different frames
- **Physics**: `u' = (u - v) / (1 - uv/c²)` (collinear), full Thomas-Wigner for non-collinear
- **Features**:
  - Show that v + v ≠ 2v at relativistic speeds
  - Aberration of light (headlight effect)
  - Terrell rotation visualization (how a moving sphere actually *appears*)
  - Interactive: set two velocities, see the combined result vs classical prediction

#### 6.4 Relativistic Energy-Momentum

- **Canvas**: Energy-momentum diagram
- **Parameters**: rest mass m₀, velocity v (or kinetic energy, or momentum)
- **Physics**: `E² = (pc)² + (m₀c²)²`, `E = γm₀c²`, `p = γm₀v`
- **Features**:
  - Energy-momentum hyperbola for massive particles
  - Light-like line for photons (m=0)
  - Collisions: input particles, conserve 4-momentum, show possible outcomes
  - Threshold energy calculator (e.g., minimum energy to produce particle-antiparticle pair)
  - Compare classical KE vs relativistic KE curves

#### 6.5 Relativistic Doppler & Aberration

- **Canvas**: Star field view from a moving observer
- **Parameters**: observer velocity v, emission frequency f₀
- **Physics**: `f = f₀ √((1-β)/(1+β))` (longitudinal), transverse Doppler
- **Features**:
  - Color-shifted star field as velocity increases
  - Headlight effect: stars cluster toward forward direction
  - Transverse Doppler (pure time dilation effect)
  - Compare relativistic vs classical Doppler

### Task for Claude Code

```
TASK: Implement the Special Relativity module.
  1. Create `src/modules/special-relativity/` with manifest.
  2. Implement a `LorentzBoost` utility in shared/math that handles:
     - 1+1D boosts (x, ct)
     - 3+1D boosts (arbitrary direction)
     - Velocity addition (collinear and general)
     - 4-vector transformations
  3. Implement simulations 6.1 through 6.3.
  4. Implement simulations 6.4 and 6.5.
  5. For the Minkowski diagram (6.1), implement interactive event
     placement (click to add event) and world-line drawing.
  6. For the star field (6.5), generate ~500 random stars and apply
     aberration + Doppler color shift in real-time as v changes.
```

---

## Phase 7 — Quantum Mechanics II (Expand Existing QM)

> **Textbook reference**: Griffiths — *Introduction to Quantum Mechanics* (3rd ed.), Sakurai — *Modern Quantum Mechanics*
>
> **Commit message**: `feat: expand quantum module with advanced QM simulations`
>
> **Prerequisite**: Existing Quantum Physics module.

### Simulations to add

#### 7.1 Time-Dependent Schrödinger Equation (Wave Packet Dynamics)

- **Canvas**: ψ(x,t) probability density + real/imaginary parts
- **Parameters**: initial wave packet (Gaussian width, center, momentum), potential V(x)
- **Physics**: Split-operator FFT method for time evolution
- **Features**:
  - Watch Gaussian wave packet scatter off various potentials
  - Potentials: step, barrier (tunneling!), well, double well, harmonic, periodic (Kronig-Penney)
  - Show probability current j(x,t)
  - Tunneling: show transmitted + reflected packets, compute T and R
  - Expectation values ⟨x⟩, ⟨p⟩, Δx, Δp evolving in time
  - Ehrenfest's theorem: compare ⟨x⟩ trajectory with classical trajectory

#### 7.2 Hydrogen Atom Orbitals (3D)

- **Canvas**: 3D orbital cloud rendered as 2D cross-section or volumetric
- **Parameters**: quantum numbers n, l, m, superposition coefficients
- **Physics**: `ψ_{nlm}(r,θ,φ) = R_{nl}(r) × Y_l^m(θ,φ)`
- **Features**:
  - 2D cross-section (slice through z-axis) with probability density heatmap
  - Radial probability distribution P(r) = r²|R(r)|²
  - Angular probability Y_l^m mapped onto unit sphere
  - Superposition mode: mix orbitals and see hybrid shapes
  - Show all orbitals up to n=4 in a periodic-table-style grid
  - Energy level diagram with degeneracy

#### 7.3 Spin-1/2 & Stern-Gerlach Experiment

- **Canvas**: Stern-Gerlach apparatus schematic + Bloch sphere
- **Parameters**: initial spin state, analyzer orientations, number of sequential analyzers
- **Physics**: Spin operators `S_x, S_y, S_z`, Pauli matrices, measurement postulate
- **Features**:
  - Send spin through SG apparatus: show splitting
  - Sequential measurements: SG_z → SG_x → SG_z (show "quantum eraser" effect)
  - Bloch sphere: visualize spin state as point on sphere
  - Rotation of spin state by magnetic field
  - Expectation values ⟨Sₓ⟩, ⟨Sᵧ⟩, ⟨S_z⟩ readout

#### 7.4 Perturbation Theory Visualizer

- **Canvas**: Energy levels + wavefunctions before and after perturbation
- **Parameters**: unperturbed system (e.g., infinite well, harmonic oscillator), perturbation type and strength λ
- **Physics**: E_n^(1) = ⟨n|H'|n⟩, E_n^(2) = Σ |⟨m|H'|n⟩|²/(E_n - E_m)
- **Features**:
  - Show energy levels shifting as λ increases from 0 to 1
  - Compare: exact numerical solution vs 1st-order vs 2nd-order perturbation theory
  - Wavefunctions: show how they deform
  - Degenerate perturbation theory example (Stark effect on hydrogen)
  - Convergence radius: show where perturbation series breaks down

#### 7.5 Quantum Entanglement & Bell's Inequality

- **Canvas**: Two-party measurement setup + correlation plots
- **Parameters**: entangled state type (Bell states), measurement angles θ_A, θ_B
- **Physics**: `|Φ⁺⟩ = (|00⟩ + |11⟩)/√2`, correlation `E(a,b) = -cos(θ_A - θ_B)`
- **Features**:
  - Simulate N measurements: show individual outcomes are random, but correlated
  - Plot correlation E(a,b) vs angle difference
  - Show CHSH inequality: S ≤ 2 (classical), S = 2√2 (quantum)
  - Compare with local hidden variable model predictions
  - Interactive: choose measurement angles and see results

#### 7.6 Quantum Harmonic Oscillator (Creation/Annihilation Operators)

- **Canvas**: Energy ladder + wavefunctions
- **Parameters**: quantum number n, superposition state
- **Physics**: `â|n⟩ = √n|n-1⟩`, `â†|n⟩ = √(n+1)|n+1⟩`, coherent states `|α⟩`
- **Features**:
  - Visualize action of â and â† on ladder diagram
  - Wavefunctions for each n (Hermite-Gauss functions)
  - Coherent state: show Gaussian that oscillates like classical particle
  - Squeezed states: show uncertainty ellipse deformation
  - Number state vs coherent state: compare ΔxΔp

### Task for Claude Code

```
TASK: Expand the existing Quantum Physics module.
  1. Do NOT break existing quantum simulations. Add new ones alongside.
  2. Implement the split-operator FFT time evolution method for 7.1.
     This requires the FFT utility from Phase 3.
  3. Implement simulations 7.1 through 7.3.
  4. For hydrogen orbitals (7.2), precompute associated Laguerre
     polynomials and spherical harmonics. Render the 2D cross-section
     using ImageData pixel manipulation for performance.
  5. Implement simulations 7.4 through 7.6.
  6. For Bell's inequality (7.5), use a pseudo-random number generator
     with visible seed for reproducibility. Show both the quantum
     prediction curve and the classical bound on the same plot.
```

---

## Phase 8 — Solid State / Condensed Matter Physics

> **Textbook reference**: Kittel — *Introduction to Solid State Physics* (8th ed.), Ashcroft & Mermin
>
> **Commit message**: `feat: add solid state physics module with 6 simulations`

### Simulations to implement

#### 8.1 Crystal Lattice Viewer

- **Canvas**: 2D lattice with unit cell highlighted
- **Parameters**: lattice type (square, triangular, honeycomb, oblique), lattice constants a, b, angle γ, basis atoms
- **Physics**: Bravais lattices, Miller indices, reciprocal lattice
- **Features**:
  - Draw direct lattice with lattice vectors a₁, a₂
  - Highlight unit cell (primitive and conventional)
  - Show reciprocal lattice alongside
  - Draw Miller index planes
  - Wigner-Seitz cell construction (animated Voronoi)
  - First Brillouin zone in reciprocal space
  - Presets for all 5 2D Bravais lattices

#### 8.2 Band Structure (Nearly Free Electron Model)

- **Canvas**: E(k) dispersion plot + density of states
- **Parameters**: lattice constant a, potential strength V₀, number of bands
- **Physics**: Bloch's theorem, band gaps from Bragg reflection at zone boundaries
- **Features**:
  - Free electron parabola → band gaps opening at k = ±nπ/a
  - Reduced zone scheme, extended zone scheme, periodic zone scheme
  - Toggle between free electron and nearly-free electron
  - Density of states D(E) with Van Hove singularities
  - Fermi energy and Fermi surface visualization
  - Metal vs insulator vs semiconductor based on band filling

#### 8.3 Phonon Dispersion Relations

- **Canvas**: ω(k) dispersion curves
- **Parameters**: atom masses (monatomic or diatomic basis), spring constants, lattice constant
- **Physics**: Dynamical matrix eigenvalue problem
- **Features**:
  - Monatomic chain: single acoustic branch
  - Diatomic chain: acoustic + optical branches, band gap
  - Group velocity v_g = dω/dk visualization
  - Long-wavelength limit → speed of sound
  - Density of states D(ω)
  - Debye model vs exact: show where Debye approximation breaks down

#### 8.4 Free Electron Gas (Fermi-Dirac)

- **Canvas**: Energy distribution + k-space Fermi sphere
- **Parameters**: temperature T, electron density n, dimensionality (1D, 2D, 3D)
- **Physics**: `f(E) = 1/(e^((E-μ)/kT) + 1)`, density of states in d dimensions
- **Features**:
  - Fermi-Dirac distribution at different temperatures
  - Chemical potential μ(T) shift
  - Specific heat: compare Drude (classical) vs Sommerfeld (quantum)
  - k-space: show filled states inside Fermi sphere
  - Sommerfeld expansion: low-T properties

#### 8.5 Semiconductor Physics

- **Canvas**: Band diagram + carrier concentrations
- **Parameters**: band gap E_g, temperature T, doping type (n/p) and concentration, effective masses
- **Physics**: Intrinsic carrier concentration `n_i = √(NcNv) e^(-Eg/2kT)`, law of mass action
- **Features**:
  - Intrinsic semiconductor: show Fermi level at midgap
  - n-type doping: Fermi level shifts toward conduction band
  - p-type doping: Fermi level shifts toward valence band
  - Carrier concentration vs temperature
  - p-n junction: depletion region, built-in potential, I-V curve
  - LED: show photon emission at forward bias

#### 8.6 X-Ray Diffraction (Bragg's Law)

- **Canvas**: Crystal + incoming/outgoing beam + diffraction pattern
- **Parameters**: lattice type, lattice constant, X-ray wavelength, crystal orientation
- **Physics**: Bragg's law `2d sin(θ) = nλ`, structure factor
- **Features**:
  - Animate incoming beam scattering off crystal planes
  - Rotate crystal → scan through Bragg angles
  - Diffraction pattern (spot pattern for single crystal, rings for powder)
  - Structure factor: show which reflections are forbidden (e.g., BCC, FCC selection rules)
  - Laue condition in reciprocal space: Ewald sphere construction

### Task for Claude Code

```
TASK: Implement the Solid State Physics module.
  1. Create `src/modules/solid-state/` with manifest.
  2. Implement a `Lattice2D` utility class that generates lattice
     points, reciprocal lattice, Wigner-Seitz cell, and Brillouin zone
     for any 2D Bravais lattice.
  3. Implement simulations 8.1 through 8.3.
  4. Implement simulations 8.4 through 8.6.
  5. For band structure (8.2), use eigenvalue computation of the
     Hamiltonian matrix in the plane-wave basis (truncated to ~10
     reciprocal lattice vectors). Implement a simple eigenvalue
     solver or use a numerical library.
  6. For X-ray diffraction (8.6), use the Ewald sphere construction
     to determine which reflections are active.
```

---

## Phase 9 — Nuclear & Particle Physics

> **Textbook reference**: Griffiths — *Introduction to Elementary Particles*, Krane — *Introductory Nuclear Physics*
>
> **Commit message**: `feat: add nuclear & particle physics module with 5 simulations`

### Simulations to implement

#### 9.1 Nuclear Chart & Binding Energy

- **Canvas**: Interactive chart of nuclides (Z vs N)
- **Parameters**: Zoom level, selected nuclide, overlay type
- **Physics**: Semi-empirical mass formula (SEMF / Bethe-Weizsäcker)
- **Features**:
  - Color by: binding energy per nucleon, decay mode, half-life, spin
  - Click any nuclide → show decay chain
  - SEMF prediction vs experimental B/A
  - Magic numbers highlighted (shell closures)
  - Valley of stability visualization
  - Drip lines (proton and neutron)

#### 9.2 Radioactive Decay Chains

- **Canvas**: Animated particle population plot + decay chain diagram
- **Parameters**: parent isotope, initial quantity, decay mode
- **Physics**: `dN/dt = -λN`, Bateman equations for chains
- **Features**:
  - Single decay: exponential with half-life marker
  - Decay chains: parent → daughter → granddaughter (e.g., Uranium series)
  - Secular equilibrium, transient equilibrium
  - Activity vs time for all species in chain
  - Carbon-14 dating calculator: input measured ratio → output age

#### 9.3 Particle Physics Standard Model Explorer

- **Canvas**: Interactive Standard Model chart
- **Parameters**: Selected particle, interaction type
- **Features**:
  - Interactive chart: click any particle → show properties (mass, charge, spin, color charge, weak isospin)
  - Group particles by: generation, interaction, boson/fermion
  - Show which particles interact via which force
  - Feynman diagram gallery: basic vertices for each interaction
  - Conservation law checker: input a reaction, verify conservation of charge, lepton number, baryon number, strangeness, etc.

#### 9.4 Scattering Cross-Section Visualizer

- **Canvas**: Scattering geometry + angular distribution plot
- **Parameters**: incoming particle energy, target potential, scattering type
- **Physics**: Rutherford scattering `dσ/dΩ = (a/4)² csc⁴(θ/2)`, partial wave analysis
- **Features**:
  - Rutherford scattering: show trajectories bending around nucleus
  - Born approximation results for different potentials
  - Partial wave decomposition: show how each l contributes
  - Resonance peaks (Breit-Wigner)
  - Differential vs total cross-section

#### 9.5 Feynman Diagram Builder

- **Canvas**: Interactive diagram workspace
- **Parameters**: Particle types, vertices, propagators
- **Features**:
  - Drag-and-drop particles to build Feynman diagrams
  - Snap to valid vertices (QED: e-γ-e, QCD: q-g-q, etc.)
  - Auto-calculate diagram order (number of vertices)
  - Validate conservation laws at each vertex
  - Show corresponding matrix element expression (symbolic)
  - Gallery of famous diagrams: Compton, Bhabha, Møller, pair annihilation

### Task for Claude Code

```
TASK: Implement the Nuclear & Particle Physics module.
  1. Create `src/modules/nuclear-particle/` with manifest.
  2. For the nuclear chart (9.1), create a JSON data file with
     nuclide data (Z, N, B/A, half-life, decay mode) for all stable
     nuclides and major radioactive ones (~300 entries). Source data
     from IAEA NuDat or NNDC (public domain).
  3. Implement simulations 9.1 through 9.3.
  4. Implement simulations 9.4 and 9.5.
  5. For the Standard Model explorer (9.3), create a comprehensive
     JSON dataset of all SM particles with their properties.
  6. For the Feynman diagram builder (9.5), implement a simple
     graph data structure with vertex validation rules for QED.
```

---

## Phase 10 — General Relativity & Cosmology

> **Textbook reference**: Carroll — *Spacetime and Geometry*, Hartle — *Gravity*
>
> **Commit message**: `feat: add general relativity & cosmology module with 5 simulations`

### Simulations to implement

#### 10.1 Spacetime Curvature Visualizer (Embedding Diagrams)

- **Canvas**: 2D embedding diagram (funnel/trumpet shape) + geodesic paths
- **Parameters**: mass M (Schwarzschild), radial range
- **Physics**: Schwarzschild metric, Flamm's paraboloid embedding
- **Features**:
  - Classic "bowling ball on rubber sheet" but mathematically correct
  - Plot Flamm's paraboloid `z = 2√(r/r_s - 1)` for r > r_s
  - Geodesics on the surface (show they're not straight lines in embedding)
  - Show event horizon at r = r_s
  - Vary M and watch the funnel deepen

#### 10.2 Geodesics in Schwarzschild Spacetime

- **Canvas**: Orbital paths around black hole
- **Parameters**: initial position r₀, angular momentum L, energy E, particle mass (massive or massless)
- **Physics**: Effective potential `V_eff(r) = (1 - r_s/r)(1 + L²/r²)`, geodesic equation
- **Features**:
  - Bound orbits, unbound orbits, circular orbits (stable and unstable)
  - Innermost stable circular orbit (ISCO) at r = 6M
  - Photon sphere at r = 3M
  - Light bending around black hole (gravitational lensing)
  - Precession of perihelion (Mercury's 43 arcsec/century)
  - Effective potential plot with turning points marked

#### 10.3 Gravitational Lensing

- **Canvas**: Background image distorted by foreground mass
- **Parameters**: lens mass, source position, lens-source distance, lens-observer distance
- **Physics**: Deflection angle `α = 4GM/(c²b)`, lens equation, Einstein ring radius
- **Features**:
  - Point lens: show double images, Einstein ring (perfect alignment)
  - Move source behind lens → watch images dance
  - Magnification map
  - Simple background (grid or star field) to make distortion visible
  - Extended lens (galaxy cluster): show arcs and arclets

#### 10.4 Friedmann Cosmology (Scale Factor Evolution)

- **Canvas**: a(t) plot + cosmic timeline
- **Parameters**: Ω_matter, Ω_radiation, Ω_Λ (dark energy), Ω_k (curvature), H₀
- **Physics**: Friedmann equation `(ȧ/a)² = H₀²(Ω_r/a⁴ + Ω_m/a³ + Ω_k/a² + Ω_Λ)`
- **Features**:
  - Plot a(t) for different universe compositions
  - Presets: matter-only (Einstein-de Sitter), radiation-only, de Sitter (Λ-only), ΛCDM (our universe)
  - Cosmic timeline: Big Bang, recombination, matter-radiation equality, dark energy domination
  - Hubble parameter H(z) vs redshift
  - Distance measures: comoving, luminosity, angular diameter
  - Age of the universe calculator for given parameters

#### 10.5 Cosmic Microwave Background Power Spectrum

- **Canvas**: CMB sky map (Mollweide projection) + power spectrum Cₗ
- **Parameters**: Ω_b (baryon density), Ω_cdm (dark matter), H₀, n_s (spectral index)
- **Physics**: Acoustic oscillations in early universe → peaks in Cₗ
- **Features**:
  - Simplified CMB power spectrum (analytical approximation, not full Boltzmann code)
  - Show how peaks shift with parameter changes:
    - Ω_b → odd/even peak height ratio
    - Ω_cdm → overall peak enhancement
    - Ω_k → peak position (angular scale)
  - Annotate: first peak = curvature, second peak = baryons, etc.
  - Synthetic CMB map from the power spectrum (random Gaussian field)

### Task for Claude Code

```
TASK: Implement the General Relativity & Cosmology module.
  1. Create `src/modules/general-relativity/` with manifest.
  2. Implement a `Schwarzschild` utility module with:
     - Effective potential calculation
     - Geodesic integration (RK4 in Schwarzschild coordinates)
     - Light ray deflection calculation
  3. Implement simulations 10.1 through 10.3.
  4. Implement simulations 10.4 and 10.5.
  5. For gravitational lensing (10.3), apply the lens equation to
     distort a background grid in real-time on canvas.
  6. For the CMB (10.5), use the Hu-Sugiyama analytical fitting
     formulas for the power spectrum (NOT a full Boltzmann solver).
     Generate the synthetic map using spherical harmonic synthesis
     (approximate with 2D FFT on the projected map).
```

---

## Phase 11 — Mathematical Methods & Toolbox

> **Textbook reference**: Arfken — *Mathematical Methods for Physicists*, Boas — *Mathematical Methods in the Physical Sciences*
>
> **Commit message**: `feat: add mathematical methods toolbox module`
>
> This is a utility module — not a physics course per se, but an essential companion for grad students.

### Tools to implement

#### 11.1 ODE Phase Portrait Generator

- **Parameters**: User enters dx/dt = f(x,y) and dy/dt = g(x,y) as text expressions
- **Features**:
  - Parse expressions → evaluate on grid → draw direction field
  - Find and classify fixed points (stable node, unstable node, saddle, spiral, center)
  - Nullclines
  - Click to place initial conditions → draw trajectories
  - Presets: Lotka-Volterra, Van der Pol, Lorenz (projected), SIR model

#### 11.2 PDE Solver Playground

- **Parameters**: equation type (heat, wave, Laplace, Schrödinger), domain, BCs, ICs
- **Features**:
  - 1D heat equation: watch initial profile smooth out
  - 2D Laplace equation: set boundary values, solve for interior
  - Interactive boundary conditions (click to set)
  - Show convergence of numerical solution

#### 11.3 Special Functions Plotter

- **Parameters**: function type, parameters, range
- **Features**:
  - Bessel functions Jₙ(x), Yₙ(x): plot multiple orders
  - Legendre polynomials Pₗ(x): show orthogonality
  - Spherical harmonics Yₗₘ(θ,φ): 2D colormap on sphere projection
  - Hermite, Laguerre polynomials (QHO and hydrogen connections)
  - Gamma function Γ(z): complex plane visualization (domain coloring)

#### 11.4 Coordinate System Visualizer

- **Parameters**: coordinate system type, transformation parameters
- **Features**:
  - Cartesian ↔ cylindrical ↔ spherical
  - Show coordinate curves, scale factors, volume elements
  - Gradient, divergence, curl expressions in each system
  - Jacobian visualization: show how area/volume elements transform
  - Curvilinear coordinates: ellipsoidal, paraboloidal, toroidal

#### 11.5 Tensor Algebra Calculator

- **Parameters**: tensor components, metric, operation type
- **Features**:
  - Input metric gᵢⱼ → compute Christoffel symbols Γⁱⱼₖ
  - Compute Riemann tensor, Ricci tensor, Ricci scalar
  - Index raising/lowering
  - Tensor product, contraction
  - Presets: Schwarzschild, FRW, flat spacetime, sphere

### Task for Claude Code

```
TASK: Implement the Mathematical Methods module.
  1. Create `src/modules/math-methods/` with manifest.
  2. Implement a safe expression parser for 11.1 (ODE phase portraits).
     Use a simple recursive-descent parser — do NOT eval() user input.
     Support: x, y, t, sin, cos, exp, log, sqrt, ^, +, -, *, /.
  3. Implement tools 11.1 and 11.2.
  4. Implement tools 11.3 through 11.5.
  5. For special functions (11.3), implement numerical routines for:
     - Bessel functions (Miller's backward recurrence)
     - Legendre polynomials (recurrence relation)
     - Spherical harmonics (from associated Legendre + exp(imφ))
  6. For the tensor calculator (11.5), implement symbolic-ish
     computation of Christoffel symbols from metric components
     (numerical differentiation is fine — no need for full CAS).
```

---

## Phase 12 — Global UX: Navigation, Search, Theming, PWA

> **Commit message**: `feat: add global search, PWA support, and UX polish`
>
> **Prerequisite**: At least 3-4 physics modules implemented.
>
> This final phase ties everything together into a polished product.

### 12.1 Global Search

- **What**: Command-palette style search (Cmd/Ctrl + K) that searches across all simulations, theory topics, equations, and tags
- **Implementation**:
  - Build a search index from all module manifests at build time
  - Fuzzy matching (Levenshtein or similar)
  - Results grouped by module
  - Recent searches / bookmarks

### 12.2 Progressive Web App (PWA)

- **What**: Make the app installable and usable offline
- **Implementation**:
  - Service worker with cache-first strategy for static assets
  - App manifest with icons
  - Offline fallback page
  - "Install app" prompt on mobile

### 12.3 Dark/Light Theme Toggle

- **What**: System-aware theme with manual override
- **Implementation**:
  - CSS custom properties for all colors
  - Canvas simulations must respect the theme (light grid on dark bg and vice versa)
  - Persist preference in localStorage

### 12.4 Simulation Bookmarks & Progress Tracking

- **What**: Students can bookmark simulations and track which ones they've explored
- **Implementation**:
  - LocalStorage-based (no backend)
  - Mark simulations as "explored" when opened for >30 seconds
  - Progress bar on each module card on the home page
  - Bookmark list accessible from nav bar

### 12.5 URL-Shareable State

- **What**: Every simulation's parameter state is encoded in the URL
- **Implementation**:
  - Serialize parameters to URL query/hash
  - On load, parse URL and restore state
  - "Share" button that copies URL to clipboard
  - Enables linking to specific configurations in study groups / textbooks

### 12.6 Performance Budget & Optimization

- **Targets**:
  - Initial bundle < 200KB gzipped (code-split each module)
  - Simulation canvas: 60 FPS for particle counts ≤ 200
  - Canvas simulations: offscreen canvas or Web Worker for heavy computation
  - Lazy-load modules on route navigation
- **Implementation**:
  - React.lazy + Suspense for module loading
  - Web Workers for: Ising model, molecular dynamics, wave equation PDE solvers
  - Performance monitoring: FPS counter in dev mode

### 12.7 Accessibility Audit

- Run axe-core or Lighthouse on every page
- Ensure: color contrast ratios, focus management, screen reader descriptions for canvases
- Keyboard navigation for all controls

### Task for Claude Code

```
TASK: Implement global UX features and polish.
  1. Implement global search (12.1) with fuzzy matching.
  2. Add PWA support (12.2): service worker, manifest, icons.
  3. Implement dark/light theme toggle (12.3).
     Update ALL existing canvas simulations to use theme-aware colors.
  4. Add bookmark and progress tracking (12.4).
  5. Implement URL-shareable state (12.5) for all simulations.
  6. Code-split all modules using React.lazy (12.6).
  7. Run Lighthouse audit and fix any critical issues (12.7).
  8. Update the home page design: module cards with progress bars,
     total simulation count, "recently explored" section.
```

---

## Appendix A — Shared Component Library

This is the definitive list of shared components. Each should be built once and reused across ALL modules.

| Component | Description | Used By |
|-----------|-------------|---------|
| `SimulationLayout` | Three-panel layout (canvas + controls + info) | Every simulation |
| `ParameterSlider` | Labeled slider with unit, min/max, step, reset button | Every simulation |
| `PlayPauseReset` | Transport controls with hotkey support | Time-evolution sims |
| `EquationDisplay` | KaTeX-rendered LaTeX equation | Theory panels |
| `PhaseSpacePlot` | 2D canvas for (q, p) or (x, ẋ) plots | Mechanics, QM |
| `VectorFieldCanvas` | 2D vector field with arrows, streamlines, heatmap | EM, fluid |
| `EnergyBarChart` | Animated bar chart for KE, PE, Total | Mechanics |
| `DataExport` | Export simulation data as CSV | All |
| `TheoryPanel` | Collapsible markdown-rendered theory section | All |
| `ColorScaleBar` | Legend for heatmap / colormap visualizations | Waves, QM, EM |
| `CanvasOverlay` | HUD-style overlay for real-time readouts on canvas | All |
| `Tooltip3D` | Tooltip that appears on hover over canvas objects | 3D sims |

---

## Appendix B — Commit & Branch Strategy

```
main (production — deployed to GitHub Pages)
 │
 ├── feat/phase-0-architecture        (Phase 0)
 ├── feat/classical-mechanics          (Phase 1)
 ├── feat/electrodynamics              (Phase 2)
 ├── feat/waves-oscillations           (Phase 3)
 ├── feat/thermodynamics-expansion     (Phase 4)
 ├── feat/optics                       (Phase 5)
 ├── feat/special-relativity           (Phase 6)
 ├── feat/quantum-expansion            (Phase 7)
 ├── feat/solid-state                  (Phase 8)
 ├── feat/nuclear-particle             (Phase 9)
 ├── feat/general-relativity           (Phase 10)
 ├── feat/math-methods                 (Phase 11)
 └── feat/global-ux                    (Phase 12)
```

Each branch is merged into `main` via PR after the phase is complete and tested.

Within each phase, Claude Code should make **atomic sub-commits**:

```
feat/classical-mechanics
  ├── "add classical mechanics manifest and home page"
  ├── "implement projectile motion simulation"
  ├── "implement double pendulum with phase space"
  ├── "implement central force orbits with effective potential"
  ├── "implement rigid body rotation"
  ├── "implement coupled oscillators and normal modes"
  ├── "implement Lagrangian sandbox"
  ├── "implement Hamiltonian phase space explorer"
  └── "implement Noether's theorem visualizer"
```

---

## Appendix C — Physics Accuracy Standards

Every simulation must meet these standards:

1. **Correct equations**: All equations displayed must match the standard textbook formulation. Include a `README.md` per simulation citing the exact equation numbers from the reference textbook.

2. **Numerical accuracy**: 
   - Energy-conserving simulations (orbits, pendulums) must conserve E to within 0.1% over 10,000 time steps using appropriate integrators.
   - Wave equation simulations must satisfy the CFL condition for numerical stability.
   - Quantum simulations must preserve norm ∫|ψ|²dx = 1 to within 0.01%.

3. **Correct limits**: Every simulation should reduce to known limiting cases. E.g., relativistic → classical as v→0, quantum → classical as ℏ→0.

4. **Units**: All displayed values must include correct SI units. Internal calculations must be consistent.

5. **No "physics lies"**: Don't use visual tricks that misrepresent the physics. E.g., don't render a 3D orbital as solid when it's a probability cloud; don't show a definite trajectory for a quantum particle.

---

## Summary: Minimum Commit Plan (12 Phases)

| # | Phase | Est. Simulations | Key Dependencies |
|---|-------|-----------------|------------------|
| 0 | Architecture & Scaffolding | 0 (infrastructure) | None |
| 1 | Classical Mechanics | 8 | Phase 0 |
| 2 | Electrodynamics | 7 | Phase 0 (VectorFieldCanvas) |
| 3 | Waves & Oscillations | 6 | Phase 0 (FFT) |
| 4 | Thermodynamics Expansion | 5 | Existing Stat-Mech module |
| 5 | Optics | 6 | Phase 0 |
| 6 | Special Relativity | 5 | Phase 0 |
| 7 | Quantum Mechanics II | 6 | Existing QM module, FFT from Phase 3 |
| 8 | Solid State Physics | 6 | Phase 0 |
| 9 | Nuclear & Particle Physics | 5 | Phase 0 |
| 10 | General Relativity & Cosmology | 5 | Phase 6 (Lorentz utilities) |
| 11 | Mathematical Methods | 5 | Phase 0 |
| 12 | Global UX Polish | 0 (UX features) | Multiple phases complete |
| **TOTAL** | | **~64 simulations** | |

> **Note to Claude Code**: Each phase is designed to be completable in one focused session. If a phase is too large, split it into sub-phases (e.g., Phase 1a: simulations 1.1-1.4, Phase 1b: simulations 1.5-1.8). Always ensure the app builds and deploys after every commit. Never leave the app in a broken state.
