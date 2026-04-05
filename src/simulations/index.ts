import { Component, lazy } from "solid-js";

// Map of chapterId-sectionId to simulation component
const simulations: Record<string, Component> = {};

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

export function getSimulation(chapterId: string, sectionId: string): Component | undefined {
  return simulations[`${chapterId}-${sectionId}`];
}
