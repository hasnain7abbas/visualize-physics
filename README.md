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

[Download](#-download) · [Features](#-features) · [Chapters](#-chapters) · [Tech Stack](#-tech-stack) · [Contributing](#-contributing)

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

The app is organized into **two major sections** with **6 chapters** and **18 interactive sections**:

### ⚛️ Quantum Physics

| Chapter | Topics | Statistical Tools |
|---------|--------|-------------------|
| **Q1 — Quantum Probability** | Superposition & State Vectors · Measurement & Collapse · Probability Amplitudes | Born Rule, Bayes' Theorem, Interference, Bernoulli Trials, Markov Chains |
| **Q2 — Spin & Stern-Gerlach** | Single SG Apparatus · Sequential SG · Expectation Values & Uncertainty | Binomial Distribution, Hypothesis Testing, Uncertainty Relations, MLE |
| **Q3 — Wavefunctions & Uncertainty** | Particle in a Box · Gaussian Wavepackets · Heisenberg Uncertainty Principle | PDFs, CDFs, Fourier Transforms, Cramér-Rao Bound, Fisher Information |

### 🔥 Statistical Physics

| Chapter | Topics | Statistical Tools |
|---------|--------|-------------------|
| **S1 — The Boltzmann World** | Maxwell-Boltzmann Distribution · Boltzmann Energy · Partition Functions | Chi/Gamma Distributions, Monte Carlo, Metropolis-Hastings, Equipartition |
| **S2 — Quantum Statistics** | Fermions vs Bosons · Fermi-Dirac · Bose-Einstein Condensation | Combinatorics, Polylogarithms, Zeta Functions, Grand Canonical Ensemble |
| **S3 — Entropy & Information** | Microstates & Macrostates · Entropy of Mixing · Shannon/Gibbs Entropy | KL Divergence, Mutual Information, MaxEnt, Landauer's Principle |

---

## 🎮 Simulations Preview

Each section includes a **fully interactive simulation**. Here are some highlights:

| Simulation | Description |
|------------|-------------|
| 🎲 **Quantum Superposition** | Adjust α/β amplitudes and measure qubits — watch the histogram converge to Born rule predictions |
| 🧲 **Stern-Gerlach Chain** | Build Z→X→Z measurement sequences and see information destruction in action |
| 🌊 **Particle in a Box** | Visualize wavefunctions for different quantum numbers, superpose states |
| 🔥 **Maxwell-Boltzmann** | Sample thousands of particles and watch the speed histogram match theory |
| ❄️ **Bose-Einstein Condensation** | Cool bosons through T_c and watch ground state occupation explode |
| 📊 **Shannon Entropy** | Drag probability sliders and see H, D_KL, and mutual information update live |

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
