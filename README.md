<div align="center">

<img src="https://img.icons8.com/3d-fluency/94/cat.png" alt="Visualize Physics Logo" width="80" />

# Visualize Physics

### A Visual Introduction to Quantum & Statistical Physics

**If you can see it, you can understand it.**

[![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/hasnain7abbas/visualize-physics/releases)
[![Tauri](https://img.shields.io/badge/Tauri-FFC131?style=for-the-badge&logo=tauri&logoColor=white)](https://tauri.app)
[![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org)
[![SolidJS](https://img.shields.io/badge/SolidJS-2C4F7C?style=for-the-badge&logo=solid&logoColor=white)](https://www.solidjs.com)

[![GitHub release](https://img.shields.io/github/v/release/hasnain7abbas/visualize-physics?style=flat-square&color=06b6d4)](https://github.com/hasnain7abbas/visualize-physics/releases)
[![License](https://img.shields.io/badge/license-MIT-10b981?style=flat-square)](LICENSE)
[![Stars](https://img.shields.io/github/stars/hasnain7abbas/visualize-physics?style=flat-square&color=f59e0b)](https://github.com/hasnain7abbas/visualize-physics/stargazers)
[![Website](https://img.shields.io/badge/Try%20Online-hasnain7abbas.github.io-8b5cf6?style=flat-square)](https://hasnain7abbas.github.io/visualize-physics/)

[Try Online](https://hasnain7abbas.github.io/visualize-physics/) · [Download](#-download) · [Features](#-features) · [Chapters](#-chapters) · [Contributing](#-contributing)

---

</div>

## ✨ Features

- 🎯 **18 Interactive Simulations** — Every section has a working, hands-on visualization
- 🧮 **200+ Statistical Tools** — Exhaustive coverage from Born rule to Shannon entropy, each with expandable explanations
- 📐 **Beautiful Math** — KaTeX-rendered equations that look like a textbook
- 🌙 **Dark & Light Mode** — Easy on the eyes, any time of day
- ⚡ **Rust-Powered Backend** — High-performance computation via Tauri
- 🖥️ **Native Desktop App** — Runs offline, no browser needed
- 🎨 **Polished UI** — Color-coded chapters, smooth animations, intuitive navigation

---

## 📚 Chapters

The app is organized into **two major sections** with **11 chapters** and **33 interactive sections**, each with **300+ statistical tools** that have their own mini-simulations:

### ⚛️ Quantum Physics

| Chapter | Topics | Statistical Tools |
|---------|--------|-------------------|
| **Q1 — Quantum Probability** | Superposition · Measurement & Collapse · Probability Amplitudes | Born Rule, Bayes' Theorem, Interference, Bernoulli Trials, Markov Chains |
| **Q2 — Spin & Stern-Gerlach** | Single SG · Sequential SG · Expectation Values & Uncertainty | Binomial Distribution, Hypothesis Testing, Uncertainty Relations, MLE |
| **Q3 — Wavefunctions** | Particle in a Box · Gaussian Wavepackets · Heisenberg Uncertainty | PDFs, CDFs, Fourier Transforms, Cramér-Rao Bound, Fisher Information |
| **Q4 — Quantum Tunneling** | Barrier Penetration · Alpha Decay · Resonant Tunneling | WKB Approximation, Gamow Factor, Breit-Wigner, Lorentzian, Survival Analysis |
| **Q5 — Harmonic Oscillator** | Energy Levels · Coherent States · Zero-Point Energy | Hermite Polynomials, Poisson Distribution, Planck Distribution, Partition Functions |

### 🔥 Statistical Physics

| Chapter | Topics | Statistical Tools |
|---------|--------|-------------------|
| **S1 — The Boltzmann World** | Maxwell-Boltzmann · Boltzmann Energy · Partition Functions | Chi/Gamma Distributions, Monte Carlo, Metropolis-Hastings, Equipartition |
| **S2 — Quantum Statistics** | Fermions vs Bosons · Fermi-Dirac · Bose-Einstein Condensation | Combinatorics, Polylogarithms, Zeta Functions, Grand Canonical Ensemble |
| **S3 — Entropy & Information** | Microstates · Entropy of Mixing · Shannon/Gibbs Entropy | KL Divergence, Mutual Information, MaxEnt, Landauer's Principle |
| **S4 — Random Walks** | 1D Walk · 2D Brownian Motion · Diffusion Equation | CLT, Wiener Process, Lévy Flights, Einstein Relation, Gambler's Ruin |
| **S5 — Ising Model** | 2D Ising · Phase Transition · Critical Phenomena | Metropolis Algorithm, Critical Exponents, Universality, Renormalization Group |
| **S6 — Monte Carlo Methods** | Estimating π · MC Integration · MCMC | Importance Sampling, Acceptance-Rejection, Gibbs Sampling, Convergence Diagnostics |

---

## 🎮 Simulations

Every section has a **fully interactive simulation**, and every statistical tool has its own **mini-simulation** when clicked:

| Simulation | Description |
|------------|-------------|
| 🎲 **Quantum Superposition** | Adjust α/β amplitudes and measure qubits — histogram converges to Born rule |
| 🧲 **Stern-Gerlach Chain** | Build Z→X→Z sequences and see information destruction |
| 🚧 **Quantum Tunneling** | Watch wavefunctions decay inside barriers, adjust height/width |
| 🧲 **2D Ising Model** | Run Metropolis on a spin lattice, watch order emerge below T_c |
| 🎯 **Monte Carlo π** | Throw random darts and estimate π with 1/√N convergence |
| 📊 **Shannon Entropy** | Drag probability sliders, see H, D_KL, mutual information live |
| 🔬 **Each Statistical Tool** | Click any tool → mini-simulation appears (distributions, random walks, Markov chains...) |

---

## 📥 Download

> **Windows only** (macOS and Linux coming soon)

| File | Description |
|------|-------------|
| [📦 `.msi` Installer](https://github.com/hasnain7abbas/visualize-physics/releases/latest) | Standard Windows installer (recommended) |
| [⚡ `.exe` Setup](https://github.com/hasnain7abbas/visualize-physics/releases/latest) | NSIS installer (smaller download) |

Or build from source:

```bash
# Prerequisites: Node.js 18+, Rust 1.70+, Tauri CLI
git clone https://github.com/hasnain7abbas/visualize-physics.git
cd visualize-physics
npm install
npm run tauri build
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Role |
|-------|-----------|------|
| **Framework** | [Tauri 2](https://tauri.app) | Native desktop shell, security, packaging |
| **Backend** | [Rust](https://rust-lang.org) | Physics computations, RNG, statistics |
| **Frontend** | [SolidJS](https://solidjs.com) | Fine-grained reactive UI |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| **Math** | [KaTeX](https://katex.org) | LaTeX equation rendering |
| **Build** | [Vite 6](https://vitejs.dev) | Sub-second HMR, fast builds |

</div>

### Key Rust Dependencies

```toml
statrs = "0.17"       # Statistical distributions
rand = "0.8"          # Random number generation
num-complex = "0.4"   # Complex numbers for wavefunctions
nalgebra = "0.33"     # Linear algebra
```

---

## 🗺️ Roadmap

- [x] 6 chapters with 18 interactive sections
- [x] 200+ statistical tools with descriptions
- [x] KaTeX math rendering
- [x] Dark/Light theme
- [x] Windows .exe and .msi installers
- [ ] D3.js advanced visualizations (scatter plots, heatmaps)
- [ ] Rust-powered Monte Carlo backends for all simulations
- [ ] macOS and Linux builds
- [ ] Bloch sphere 3D visualization
- [ ] Phase space plots
- [ ] Export simulation data as CSV
- [ ] Localization (i18n)

---

## 🤝 Contributing

Contributions are welcome! Whether it's:

- 🐛 Bug reports
- 💡 Feature suggestions
- 🎨 UI/UX improvements
- 📝 Documentation
- 🧪 New simulations

Please open an [issue](https://github.com/hasnain7abbas/visualize-physics/issues) or submit a PR.

---

## 👨‍💻 About

<div align="center">

**Made with ❤️ by [Hasnain Abbas](mailto:hsnanrzee1160@gmail.com)**

Passionate about making physics intuitive through interactive visualization.

*Inspired by [Seeing Theory](https://seeing-theory.brown.edu/) by Daniel Kunin, Brown University.*
*Non-commercial educational project.*

</div>

---

<div align="center">

If you find this useful, please consider giving it a ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=hasnain7abbas/visualize-physics&type=Date)](https://star-history.com/#hasnain7abbas/visualize-physics&Date)

</div>
