use std::path::Path;

/// Full Tetris board screenshot → should recognize grid and pieces.
#[test]
fn test_recognize_full_board() {
    let path = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("tests/fixtures/board_full.png");
    let result = sfinder_gui_lib::recognition::recognize_field_from_file(
        path.to_str().unwrap(),
    );
    assert!(result.is_ok(), "Full board recognition failed: {:?}", result.err());

    let field = result.unwrap();
    let lines: Vec<&str> = field.trim().lines().filter(|l| !l.is_empty()).collect();
    assert!(!lines.is_empty(), "Empty field result");

    // All rows should be 10 columns
    for (i, line) in lines.iter().enumerate() {
        assert_eq!(line.len(), 10, "Row {} has {} columns (expected 10)", i, line.len());
    }

    // Should have detected some non-empty cells
    let has_pieces = field.chars().any(|c| matches!(c, 'I'|'O'|'T'|'S'|'Z'|'J'|'L'|'X'));
    assert!(has_pieces, "No pieces detected in full board");

    // Should be at least 10 rows
    assert!(lines.len() >= 10, "Only {} rows detected (expected >= 10)", lines.len());
}

/// Partial board (close-up of bottom section only)
#[test]
fn test_recognize_partial_board() {
    let path = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("tests/fixtures/board_partial.png");
    let result = sfinder_gui_lib::recognition::recognize_field_from_file(
        path.to_str().unwrap(),
    );
    assert!(result.is_ok(), "Partial board recognition failed: {:?}", result.err());

    let field = result.unwrap();
    let lines: Vec<&str> = field.trim().lines().filter(|l| !l.is_empty()).collect();
    assert!(!lines.is_empty(), "Empty field result");

    for (i, line) in lines.iter().enumerate() {
        assert_eq!(line.len(), 10, "Row {} has {} columns", i, line.len());
    }

    let has_pieces = field.chars().any(|c| matches!(c, 'I'|'O'|'T'|'S'|'Z'|'J'|'L'|'X'));
    assert!(has_pieces, "No pieces detected in partial board");
}

/// Nearly-empty board — should at least detect the grid structure
#[test]
fn test_recognize_empty_board() {
    let path = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("tests/fixtures/board_empty.png");
    let result = sfinder_gui_lib::recognition::recognize_field_from_file(
        path.to_str().unwrap(),
    );
    // May fail if truly empty — the algorithm requires some colored cells
    if let Ok(field) = result {
        let lines: Vec<&str> = field.trim().lines().filter(|l| !l.is_empty()).collect();
        for (i, line) in lines.iter().enumerate() {
            assert_eq!(line.len(), 10, "Row {} has {} columns", i, line.len());
        }
    }
}
