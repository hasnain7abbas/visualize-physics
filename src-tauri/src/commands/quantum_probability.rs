use rand::Rng;
use serde::Serialize;

#[derive(Serialize)]
pub struct SuperpositionResult {
    pub outcomes: Vec<bool>,
    pub running_frequency: Vec<f64>,
    pub alpha_sq: f64,
    pub beta_sq: f64,
}

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

#[derive(Serialize)]
pub struct MeasurementSequenceResult {
    pub outcomes_first_z: Vec<bool>,
    pub outcomes_x: Vec<bool>,
    pub outcomes_second_z: Vec<bool>,
    pub freq_first_z_up: f64,
    pub freq_second_z_up: f64,
}

#[tauri::command]
pub fn simulate_measurement_sequence(n: usize) -> MeasurementSequenceResult {
    let mut rng = rand::thread_rng();
    let mut outcomes_first_z = Vec::new();
    let mut outcomes_x = Vec::new();
    let mut outcomes_second_z = Vec::new();

    for _ in 0..n {
        let z1 = rng.gen::<f64>() < 0.5;
        outcomes_first_z.push(z1);

        if z1 {
            let x = rng.gen::<f64>() < 0.5;
            outcomes_x.push(x);

            let z2 = rng.gen::<f64>() < 0.5;
            outcomes_second_z.push(z2);
        }
    }

    let freq_first_z_up = outcomes_first_z.iter().filter(|&&x| x).count() as f64
        / outcomes_first_z.len() as f64;
    let freq_second_z_up = if outcomes_second_z.is_empty() {
        0.0
    } else {
        outcomes_second_z.iter().filter(|&&x| x).count() as f64
            / outcomes_second_z.len() as f64
    };

    MeasurementSequenceResult {
        outcomes_first_z,
        outcomes_x,
        outcomes_second_z,
        freq_first_z_up,
        freq_second_z_up,
    }
}
