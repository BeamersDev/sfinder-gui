use std::path::Path;
use std::process::Command;

/// Helper: decode a fumen code and return the field as lines (bottom-to-top rows).
fn fumen_to_field(fumen: &str) -> Vec<String> {
    // Use node.js to decode fumen (tetris-fumen package available)
    let script = format!(
        r#"const {{ decoder }} = require('tetris-fumen');
const pages = decoder.decode("{fumen}");
const f = pages[0].field;
let rows = [];
for (let y = 0; y < 23; y++) {{
  let row = '';
  for (let x = 0; x < 10; x++) row += f.at(x, y);
  rows.push(row);
}}
// Trim trailing empty rows
while (rows.length > 0 && rows[rows.length-1].split('').every(c => c === '_')) rows.pop();
console.log(rows.reverse().join('\n'));"#,
        fumen = fumen
    );
    let output = Command::new("node")
        .arg("-e")
        .arg(&script)
        .output()
        .expect("Failed to run node script");
    let stdout = String::from_utf8_lossy(&output.stdout);
    stdout.trim().lines().map(|l| l.to_string()).collect()
}

#[test]
fn debug_compare_known_board() {
    let expected_fumen = "v115@9gRpQ4Cewhh0AtRpR4Bewhg0Btwhh0Q4Bewhg0Atgl?whywAtAewhilJeAgH";
    let expected = fumen_to_field(expected_fumen);

    let path = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("tests/fixtures/board_full.png");
    let result = sfinder_gui_lib::recognition::recognize_field_from_file(
        path.to_str().unwrap(),
    );
    assert!(result.is_ok(), "Recognition failed: {:?}", result.err());
    let recognized = result.unwrap();
    let recognized_lines: Vec<&str> = recognized.trim().lines().collect();

    println!("=== Expected field ({}) ===", expected.len());
    for (i, row) in expected.iter().enumerate() {
        println!("{:2}| {}", expected.len() - i, row);
    }
    println!();
    println!("=== Recognized field ({}) ===", recognized_lines.len());
    for (i, row) in recognized_lines.iter().enumerate() {
        println!("{:2}| {}", recognized_lines.len() - i, row);
    }
    println!();

    // Count differences
    let max_rows = expected.len().max(recognized_lines.len());
    let mut correct = 0;
    let mut total = 0;
    for ri in 0..max_rows {
        let exp_row = expected.get(ri).map(|s| s.as_str()).unwrap_or("__________");
        let rec_row = recognized_lines.get(ri).copied().unwrap_or("__________");
        for ci in 0..10 {
            let ec = exp_row.chars().nth(ci).unwrap_or('_');
            let rc = rec_row.chars().nth(ci).unwrap_or('_');
            if ec == rc { correct += 1; }
            total += 1;
        }
    }
    println!("Accuracy: {}/{} ({:.1}%)", correct, total, correct as f64 / total as f64 * 100.0);
}

#[test]
fn debug_compare_partial_board() {
    let expected_fumen = "v115@Ahi0DeglBeBtg0Q4CeglCeBtR4RphlAezhQ4RpJeAg?l";
    let expected = fumen_to_field(expected_fumen);

    let path = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("tests/fixtures/board_partial.png");
    let result = sfinder_gui_lib::recognition::recognize_field_from_file(
        path.to_str().unwrap(),
    );
    // May fail on small image
    if let Err(e) = &result {
        println!("Partial board recognition failed: {}", e);
        println!("Expected field:");
        for (i, row) in expected.iter().enumerate() {
            println!("{:2}| {}", expected.len() - i, row);
        }
        return;
    }
    let recognized = result.unwrap();
    let recognized_lines: Vec<&str> = recognized.trim().lines().collect();

    println!("=== Expected field ({}) ===", expected.len());
    for (i, row) in expected.iter().enumerate() {
        println!("{:2}| {}", expected.len() - i, row);
    }
    println!();
    println!("=== Recognized field ({}) ===", recognized_lines.len());
    for (i, row) in recognized_lines.iter().enumerate() {
        println!("{:2}| {}", recognized_lines.len() - i, row);
    }
}
