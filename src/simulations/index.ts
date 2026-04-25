import { Component, lazy } from "solid-js";

// Map of chapterId-sectionId to simulation component
const simulations: Record<string, Component> = {};

// F1 - Foundations: Vectors & Motion
import { F1Vectors, F1Velocity, F1Acceleration, F1Forces } from "./F1Foundations";
simulations["f1-vectors"] = F1Vectors;
simulations["f1-velocity"] = F1Velocity;
simulations["f1-acceleration"] = F1Acceleration;
simulations["f1-forces"] = F1Forces;

// F2 - Foundations: Matter, Pressure & Energy
import { F2Density, F2Pressure, F2Temperature, F2WorkEnergy } from "./F2MatterEnergy";
simulations["f2-density"] = F2Density;
simulations["f2-pressure"] = F2Pressure;
simulations["f2-temperature"] = F2Temperature;
simulations["f2-work-energy"] = F2WorkEnergy;

// F3 - Foundations: Laws of Motion & Machines
import {
  F3Inertia,
  F3Gravity,
  F3ActionReaction,
  F3BalancedForces,
  F3KineticTheory,
  F3Lever,
  F3NewtonsCradle,
} from "./F3LawsOfMotion";
simulations["f3-inertia"] = F3Inertia;
simulations["f3-gravity"] = F3Gravity;
simulations["f3-action-reaction"] = F3ActionReaction;
simulations["f3-balanced-forces"] = F3BalancedForces;
simulations["f3-kinetic-theory"] = F3KineticTheory;
simulations["f3-lever"] = F3Lever;
simulations["f3-newtons-cradle"] = F3NewtonsCradle;

// Q1 - Quantum Probability
import { Q1Superposition } from "./Q1Superposition";
import { Q1Measurement } from "./Q1Measurement";
import { Q1Amplitudes } from "./Q1Amplitudes";
simulations["q1-superposition"] = Q1Superposition;
simulations["q1-measurement"] = Q1Measurement;
simulations["q1-amplitudes"] = Q1Amplitudes;

// Q2 - Stern-Gerlach
import { Q2SingleSG } from "./Q2SingleSG";
import { Q2SequentialSG } from "./Q2SequentialSG";
import { Q2SpinExpectation } from "./Q2SpinExpectation";
simulations["q2-single-sg"] = Q2SingleSG;
simulations["q2-sequential-sg"] = Q2SequentialSG;
simulations["q2-spin-expectation"] = Q2SpinExpectation;

// Q3 - Wavefunctions
import { Q3ParticleInBox } from "./Q3ParticleInBox";
import { Q3Wavepackets } from "./Q3Wavepackets";
import { Q3Uncertainty } from "./Q3Uncertainty";
simulations["q3-particle-in-box"] = Q3ParticleInBox;
simulations["q3-wavepackets"] = Q3Wavepackets;
simulations["q3-uncertainty"] = Q3Uncertainty;

// S1 - Boltzmann
import { S1MaxwellBoltzmann } from "./S1MaxwellBoltzmann";
import { S1BoltzmannEnergy } from "./S1BoltzmannEnergy";
import { S1PartitionFunction } from "./S1PartitionFunction";
simulations["s1-maxwell-boltzmann"] = S1MaxwellBoltzmann;
simulations["s1-boltzmann-energy"] = S1BoltzmannEnergy;
simulations["s1-partition-function"] = S1PartitionFunction;

// S2 - Quantum Statistics
import { S2FermionsBosons } from "./S2FermionsBosons";
import { S2FermiDirac } from "./S2FermiDirac";
import { S2BoseEinstein } from "./S2BoseEinstein";
simulations["s2-fermions-bosons"] = S2FermionsBosons;
simulations["s2-fermi-dirac"] = S2FermiDirac;
simulations["s2-bose-einstein"] = S2BoseEinstein;

// S3 - Entropy
import { S3Microstates } from "./S3Microstates";
import { S3EntropyMixing } from "./S3EntropyMixing";
import { S3ShannonEntropy } from "./S3ShannonEntropy";
simulations["s3-microstates"] = S3Microstates;
simulations["s3-entropy-mixing"] = S3EntropyMixing;
simulations["s3-shannon-entropy"] = S3ShannonEntropy;

// Q4 - Quantum Tunneling
import { Q4Tunneling, Q4AlphaDecay, Q4ResonantTunneling } from "./Q4Tunneling";
simulations["q4-tunneling"] = Q4Tunneling;
simulations["q4-alpha-decay"] = Q4AlphaDecay;
simulations["q4-resonant-tunneling"] = Q4ResonantTunneling;

// Q5 - Quantum Harmonic Oscillator
import { Q5EnergyLevels, Q5CoherentStates, Q5ZeroPoint } from "./Q5HarmonicOsc";
simulations["q5-energy-levels"] = Q5EnergyLevels;
simulations["q5-coherent-states"] = Q5CoherentStates;
simulations["q5-zero-point"] = Q5ZeroPoint;

// S4 - Random Walks
import { S4Walk1D, S4Walk2D, S4Diffusion } from "./S4RandomWalks";
simulations["s4-1d-walk"] = S4Walk1D;
simulations["s4-2d-walk"] = S4Walk2D;
simulations["s4-diffusion"] = S4Diffusion;

// S5 - Ising Model
import { S5Ising2D, S5PhaseTransition, S5Critical } from "./S5IsingModel";
simulations["s5-ising-2d"] = S5Ising2D;
simulations["s5-phase-transition"] = S5PhaseTransition;
simulations["s5-critical"] = S5Critical;

// S6 - Monte Carlo
import { S6PiEstimation, S6Integration, S6MCMC } from "./S6MonteCarlo";
simulations["s6-pi-estimation"] = S6PiEstimation;
simulations["s6-integration"] = S6Integration;
simulations["s6-mcmc"] = S6MCMC;

// S7 - Ideal Gas & Equipartition
import { S7IdealGasLaw, S7Equipartition, S7HeatCapacity } from "./S7IdealGas";
simulations["s7-ideal-gas-law"] = S7IdealGasLaw;
simulations["s7-equipartition"] = S7Equipartition;
simulations["s7-heat-capacity"] = S7HeatCapacity;

// S8 - Heat Engines & Carnot Cycle
import { S8CarnotCycle, S8HeatEngine, S8SecondLaw } from "./S8HeatEngines";
simulations["s8-carnot-cycle"] = S8CarnotCycle;
simulations["s8-heat-engine"] = S8HeatEngine;
simulations["s8-second-law"] = S8SecondLaw;

// S9 - Free Energy & Phase Equilibria
import { S9Helmholtz, S9VanDerWaals, S9PhaseDiagram } from "./S9FreeEnergy";
simulations["s9-helmholtz"] = S9Helmholtz;
simulations["s9-van-der-waals"] = S9VanDerWaals;
simulations["s9-phase-diagram"] = S9PhaseDiagram;

// S10 - Fluctuations & Response
import { S10EnergyFluctuations, S10FluctuationDissipation, S10Brownian } from "./S10Fluctuations";
simulations["s10-energy-fluctuations"] = S10EnergyFluctuations;
simulations["s10-fluctuation-dissipation"] = S10FluctuationDissipation;
simulations["s10-brownian"] = S10Brownian;

// C1 - Projectile Motion
import { C1IdealProjectile, C1DragEffects, C1CoriolisWind } from "./C1ProjectileMotion";
simulations["c1-ideal-projectile"] = C1IdealProjectile;
simulations["c1-drag-effects"] = C1DragEffects;
simulations["c1-coriolis-wind"] = C1CoriolisWind;

// C2 - Double Pendulum
import { C2PendulumDynamics, C2PhaseSpace, C2ChaosLyapunov } from "./C2DoublePendulum";
simulations["c2-pendulum-dynamics"] = C2PendulumDynamics;
simulations["c2-phase-space"] = C2PhaseSpace;
simulations["c2-chaos-lyapunov"] = C2ChaosLyapunov;

// C3 - Central Force Orbits
import { C3KeplerOrbits, C3EffectivePotential, C3ForceLawVariation } from "./C3CentralForce";
simulations["c3-kepler-orbits"] = C3KeplerOrbits;
simulations["c3-effective-potential"] = C3EffectivePotential;
simulations["c3-force-law-variation"] = C3ForceLawVariation;

// C4 - Rigid Body Rotation
import { C4EulerEquations, C4Polhode, C4TennisRacket } from "./C4RigidBody";
simulations["c4-euler-equations"] = C4EulerEquations;
simulations["c4-polhode"] = C4Polhode;
simulations["c4-tennis-racket"] = C4TennisRacket;

// C5 - Coupled Oscillators
import { C5NormalModes, C5ModeSuperposition, C5DispersionRelation } from "./C5CoupledOscillators";
simulations["c5-normal-modes"] = C5NormalModes;
simulations["c5-mode-superposition"] = C5ModeSuperposition;
simulations["c5-dispersion-relation"] = C5DispersionRelation;

// C6 - Lagrangian Mechanics
import { C6AtwoodMachine, C6BeadOnHoop, C6SlidingWedge } from "./C6Lagrangian";
simulations["c6-atwood-machine"] = C6AtwoodMachine;
simulations["c6-bead-on-hoop"] = C6BeadOnHoop;
simulations["c6-sliding-wedge"] = C6SlidingWedge;

// C7 - Hamiltonian Phase Space
import { C7PhasePortraits, C7Liouville, C7FixedPoints } from "./C7HamiltonianPhaseSpace";
simulations["c7-phase-portraits"] = C7PhasePortraits;
simulations["c7-liouville"] = C7Liouville;
simulations["c7-fixed-points"] = C7FixedPoints;

// C8 - Noether's Theorem
import { C8TimeEnergy, C8SpaceMomentum, C8RotationAngular } from "./C8NoetherTheorem";
simulations["c8-time-energy"] = C8TimeEnergy;
simulations["c8-space-momentum"] = C8SpaceMomentum;
simulations["c8-rotation-angular"] = C8RotationAngular;

// E1 - Electric Fields & Coulomb's Law
import { E1PointCharges, E1FieldLines, E1Equipotentials } from "./E1ElectricField";
simulations["e1-point-charges"] = E1PointCharges;
simulations["e1-field-lines"] = E1FieldLines;
simulations["e1-equipotentials"] = E1Equipotentials;

// E2 - Magnetic Fields & Biot-Savart
import { E2WireField, E2HelmholtzCoils, E2AmperesLaw } from "./E2MagneticField";
simulations["e2-wire-field"] = E2WireField;
simulations["e2-helmholtz-coils"] = E2HelmholtzCoils;
simulations["e2-amperes-law"] = E2AmperesLaw;

// E3 - Electromagnetic Waves
import { E3PlaneWave, E3Polarization, E3PoyntingVector } from "./E3EMWaves";
simulations["e3-plane-wave"] = E3PlaneWave;
simulations["e3-polarization"] = E3Polarization;
simulations["e3-poynting-vector"] = E3PoyntingVector;

// E4 - Induction & Lorentz Force
import { E4Faraday, E4LorentzForce } from "./E4Induction";
simulations["e4-faraday"] = E4Faraday;
simulations["e4-lorentz-force"] = E4LorentzForce;

// E5 - Multipole + Larmor radiation
import { E5MultipoleExpansion, E5LarmorRadiation } from "./E5Multipole";
simulations["e5-multipole"] = E5MultipoleExpansion;
simulations["e5-larmor"] = E5LarmorRadiation;

// W4 - Resonance & 2D Waves
import { W4DrivenOscillator, W4MembraneModes } from "./W4Resonance";
simulations["w4-driven-oscillator"] = W4DrivenOscillator;
simulations["w4-membrane-modes"] = W4MembraneModes;

// Q7 - TDSE scattering + perturbation theory
import { Q7WavepacketScattering, Q7PerturbationTheory } from "./Q7TDSE";
simulations["q7-wavepacket-scattering"] = Q7WavepacketScattering;
simulations["q7-perturbation"] = Q7PerturbationTheory;

// SS2 - Phonons + Semiconductors
import { SS2Phonons, SS2Semiconductor } from "./SS2Phonons";
simulations["ss2-phonons"] = SS2Phonons;
simulations["ss2-semiconductor"] = SS2Semiconductor;

// SS3 - X-ray diffraction + Fermi gas
import { SS3XrayDiffraction, SS3FermiGas } from "./SS3XrayFermi";
simulations["ss3-xray-diffraction"] = SS3XrayDiffraction;
simulations["ss3-fermi-gas"] = SS3FermiGas;

// N2 - Rutherford scattering + Standard Model
import { N2RutherfordScattering, N2StandardModel } from "./N2Particle";
simulations["n2-rutherford"] = N2RutherfordScattering;
simulations["n2-standard-model"] = N2StandardModel;

// G2 - Cosmology (Friedmann + CMB)
import { G2FriedmannCosmology, G2CMBPeaks } from "./G2Cosmology";
simulations["g2-friedmann"] = G2FriedmannCosmology;
simulations["g2-cmb-peaks"] = G2CMBPeaks;

// M2 - Math tools (Heat eqn + Spherical harmonics)
import { M2HeatEquation, M2SphericalHarmonics } from "./M2MathTools";
simulations["m2-heat-equation"] = M2HeatEquation;
simulations["m2-spherical-harmonics"] = M2SphericalHarmonics;

// W1 - Wave Equation in 1D
import { W1StandingWaves, W1FourierModes, W1EnergyDensity } from "./W1WaveEquation";
simulations["w1-standing-waves"] = W1StandingWaves;
simulations["w1-fourier-modes"] = W1FourierModes;
simulations["w1-energy-density"] = W1EnergyDensity;

// W2 - Wave Interference & Diffraction
import { W2SingleSlit, W2DoubleSlit, W2DiffractionGrating } from "./W2Interference";
simulations["w2-single-slit"] = W2SingleSlit;
simulations["w2-double-slit"] = W2DoubleSlit;
simulations["w2-diffraction-grating"] = W2DiffractionGrating;

// W3 - Doppler Effect
import { W3MovingSource, W3MachCone, W3ObserverFrequency } from "./W3DopplerEffect";
simulations["w3-moving-source"] = W3MovingSource;
simulations["w3-mach-cone"] = W3MachCone;
simulations["w3-observer-frequency"] = W3ObserverFrequency;

// S11 - PV Diagrams & Thermodynamic Cycles
import { S11IsothermalAdiabatic, S11ThermodynamicCycles, S11CycleEfficiency } from "./S11PVDiagrams";
simulations["s11-isothermal-adiabatic"] = S11IsothermalAdiabatic;
simulations["s11-thermodynamic-cycles"] = S11ThermodynamicCycles;
simulations["s11-cycle-work-efficiency"] = S11CycleEfficiency;

// S12 - Molecular Dynamics
import { S12LennardJones, S12VelocityDistribution, S12RadialDistribution } from "./S12MolecularDynamics";
simulations["s12-lennard-jones"] = S12LennardJones;
simulations["s12-velocity-distribution"] = S12VelocityDistribution;
simulations["s12-radial-distribution"] = S12RadialDistribution;

// S13 - Blackbody Radiation
import { S13PlanckSpectrum, S13WienLaw, S13UVCatastrophe } from "./S13BlackbodyRadiation";
simulations["s13-planck-spectrum"] = S13PlanckSpectrum;
simulations["s13-wien-law"] = S13WienLaw;
simulations["s13-uv-catastrophe"] = S13UVCatastrophe;

// O1 - Optics: Lenses, Polarization, Thin Films
import { O1LensSystem, O1Polarization, O1ThinFilm } from "./O1Optics";
simulations["o1-lens-system"] = O1LensSystem;
simulations["o1-polarization"] = O1Polarization;
simulations["o1-thin-film"] = O1ThinFilm;

// R1 - Special Relativity
import { R1SpacetimeDiagram, R1TimeDilation, R1EnergyMomentum } from "./R1Relativity";
simulations["r1-spacetime-diagram"] = R1SpacetimeDiagram;
simulations["r1-time-dilation"] = R1TimeDilation;
simulations["r1-energy-momentum"] = R1EnergyMomentum;

// N1 - Nuclear Physics
import { N1BindingEnergy, N1RadioactiveDecay } from "./N1Nuclear";
simulations["n1-binding-energy"] = N1BindingEnergy;
simulations["n1-radioactive-decay"] = N1RadioactiveDecay;

// G1 - General Relativity
import { G1SchwarzschildOrbit, G1GravitationalLensing } from "./G1Gravity";
simulations["g1-schwarzschild-orbit"] = G1SchwarzschildOrbit;
simulations["g1-gravitational-lensing"] = G1GravitationalLensing;

// M1 - Mathematical Methods
import { M1PhasePortrait, M1SpecialFunctions } from "./M1MathMethods";
simulations["m1-phase-portrait"] = M1PhasePortrait;
simulations["m1-special-functions"] = M1SpecialFunctions;

// SS1 - Solid State Physics
import { SS1CrystalLattice, SS1BandStructure } from "./SS1SolidState";
simulations["ss1-crystal-lattice"] = SS1CrystalLattice;
simulations["ss1-band-structure"] = SS1BandStructure;

// Q6 - Advanced Quantum (hydrogen orbitals, Bell's inequality)
import { Q6HydrogenOrbital, Q6BellInequality } from "./Q6AdvancedQM";
simulations["q6-hydrogen-orbital"] = Q6HydrogenOrbital;
simulations["q6-bell-inequality"] = Q6BellInequality;

export function getSimulation(chapterId: string, sectionId: string): Component | undefined {
  return simulations[`${chapterId}-${sectionId}`];
}
