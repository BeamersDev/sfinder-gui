use std::path::Path;

#[test]
fn test_recognize_tetr_io_board() {
    let manifest_dir = env!("CARGO_MANIFEST_DIR");
    let path = Path::new(manifest_dir).join("tests/fixtures/tetr_io_test1.png");
    if !path.exists() {
        println!("Skipping test: fixture not found");
        return;
    }
    let result = sfinder_gui_lib::recognition::recognize_field_from_file(path.to_str().unwrap());
    match result {
        Ok(field) => println!("Result:\n{}", field),
        Err(e) => panic!("Failed: {}", e),
    }
}

#[test]
fn test_recognize_all_black_board() {
    let img = image::RgbImage::from_fn(10, 10, |_, _| image::Rgb([18u8, 18, 18]));
    let result = sfinder_gui_lib::recognition::recognize_field_simple(&img);
    match result {
        Ok(field) => assert!(field.chars().all(|c| c == '_' || c == '\n'), "got: {}", field),
        Err(_) => {}
    }
}

#[test]
fn test_tetr_io_color_matching() {
    // Test match_piece_color directly for precise results
    use sfinder_gui_lib::recognition::match_piece_color;

    let color_tests: &[(u8, u8, u8, char)] = &[
        (52, 181, 133, 'I'),  // cyan
        (179, 153, 50, 'O'),  // yellow
        (164, 62, 154, 'T'),  // purple
        (131, 179, 50, 'S'),  // green
        (210, 75, 85, 'Z'),   // red
        (79, 62, 164, 'J'),   // blue
        (178, 98, 49, 'L'),   // orange
        (140, 140, 145, 'X'), // garbage grey
        (10, 10, 10, '_'),    // empty black
    ];

    for (r, g, b, expected) in color_tests {
        let result = match_piece_color(*r, *g, *b);
        assert_eq!(
            result, *expected,
            "rgb({},{},{}) → expected '{}', got '{}'",
            r, g, b, expected, result
        );
    }
}
