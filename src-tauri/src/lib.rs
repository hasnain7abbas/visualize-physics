mod commands;

use commands::quantum_probability;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            quantum_probability::simulate_superposition,
            quantum_probability::simulate_measurement_sequence,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
