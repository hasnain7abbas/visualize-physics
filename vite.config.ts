import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  base: process.env.GITHUB_PAGES ? "/visualize-physics/" : "/",
  server: {
    port: 1420,
    strictPort: true,
  },
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-solid": ["solid-js", "solid-js/web", "@solidjs/router"],
          "vendor-katex": ["katex"],
          "sim-foundations": [
            "./src/simulations/F1Foundations.tsx",
            "./src/simulations/F2MatterEnergy.tsx",
          ],
          "sim-quantum": [
            "./src/simulations/Q1Superposition.tsx",
            "./src/simulations/Q1Measurement.tsx",
            "./src/simulations/Q1Amplitudes.tsx",
            "./src/simulations/Q2SingleSG.tsx",
            "./src/simulations/Q2SequentialSG.tsx",
            "./src/simulations/Q2SpinExpectation.tsx",
            "./src/simulations/Q3ParticleInBox.tsx",
            "./src/simulations/Q3Wavepackets.tsx",
            "./src/simulations/Q3Uncertainty.tsx",
            "./src/simulations/Q4Tunneling.tsx",
            "./src/simulations/Q5HarmonicOsc.tsx",
            "./src/simulations/Q6AdvancedQM.tsx",
            "./src/simulations/Q7TDSE.tsx",
          ],
          "sim-statistical": [
            "./src/simulations/S1MaxwellBoltzmann.tsx",
            "./src/simulations/S1BoltzmannEnergy.tsx",
            "./src/simulations/S1PartitionFunction.tsx",
            "./src/simulations/S2FermionsBosons.tsx",
            "./src/simulations/S2FermiDirac.tsx",
            "./src/simulations/S2BoseEinstein.tsx",
            "./src/simulations/S3Microstates.tsx",
            "./src/simulations/S3EntropyMixing.tsx",
            "./src/simulations/S3ShannonEntropy.tsx",
            "./src/simulations/S4RandomWalks.tsx",
            "./src/simulations/S5IsingModel.tsx",
            "./src/simulations/S6MonteCarlo.tsx",
            "./src/simulations/S7IdealGas.tsx",
            "./src/simulations/S8HeatEngines.tsx",
            "./src/simulations/S9FreeEnergy.tsx",
            "./src/simulations/S10Fluctuations.tsx",
            "./src/simulations/S11PVDiagrams.tsx",
            "./src/simulations/S12MolecularDynamics.tsx",
            "./src/simulations/S13BlackbodyRadiation.tsx",
          ],
          "sim-classical": [
            "./src/simulations/C1ProjectileMotion.tsx",
            "./src/simulations/C2DoublePendulum.tsx",
            "./src/simulations/C3CentralForce.tsx",
            "./src/simulations/C4RigidBody.tsx",
            "./src/simulations/C5CoupledOscillators.tsx",
            "./src/simulations/C6Lagrangian.tsx",
            "./src/simulations/C7HamiltonianPhaseSpace.tsx",
            "./src/simulations/C8NoetherTheorem.tsx",
          ],
          "sim-electrodynamics": [
            "./src/simulations/E1ElectricField.tsx",
            "./src/simulations/E2MagneticField.tsx",
            "./src/simulations/E3EMWaves.tsx",
            "./src/simulations/E4Induction.tsx",
          ],
          "sim-waves": [
            "./src/simulations/W1WaveEquation.tsx",
            "./src/simulations/W2Interference.tsx",
            "./src/simulations/W3DopplerEffect.tsx",
            "./src/simulations/W4Resonance.tsx",
          ],
          "sim-optics": [
            "./src/simulations/O1Optics.tsx",
          ],
          "sim-relativity": [
            "./src/simulations/R1Relativity.tsx",
          ],
          "sim-nuclear": [
            "./src/simulations/N1Nuclear.tsx",
            "./src/simulations/N2Particle.tsx",
          ],
          "sim-gr": [
            "./src/simulations/G1Gravity.tsx",
            "./src/simulations/G2Cosmology.tsx",
          ],
          "sim-math": [
            "./src/simulations/M1MathMethods.tsx",
          ],
          "sim-solidstate": [
            "./src/simulations/SS1SolidState.tsx",
            "./src/simulations/SS2Phonons.tsx",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    sourcemap: false,
    assetsInlineLimit: 4096,
  },
  css: {
    devSourcemap: false,
  },
});
