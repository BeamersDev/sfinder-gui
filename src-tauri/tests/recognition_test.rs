use std::path::Path;

/// Test recognition of a known tetr.io board
/// This test loads a screenshot and verifies the fumen output matches expected
#[test]
fn test_recognize_tetr_io_board() {
    let manifest_dir = env!("CARGO_MANIFEST_DIR");
    
    // Test cases: (image_path, expected_fumen_substring, description)
    // We use substrings because exact fumen depends on exact board dimensions
    let test_cases: &[(&str, &[&str], &str)] = &[
        (
            "tests/fixtures/tetr_io_test1.png",
            &[
                "IIIIIIIIII",  // or check specific piece positions
            ],
            "tetr.io standard board",
        ),
    ];
    
    for (img_path, expected_substrings, desc) in test_cases {
        let path = Path::new(manifest_dir).join(img_path);
        if !path.exists() {
            println!("Skipping test: {} (image not found at {:?})", desc, path);
            continue;
        }
        
        let result = sfinder_gui_lib::recognition::recognize_field_from_file(
            path.to_str().unwrap()
        );
        
        match result {
            Ok(field) => {
                println!("Recognition result for '{}':\n{}", desc, field);
                let field_trimmed = field.trim();
                for expected in expected_substrings.iter() {
                    assert!(
                        field_trimmed.contains(expected),
                        "Expected '{}' in recognition result for '{}'. Got:\n{}",
                        expected, desc, field_trimmed
                    );
                }
            }
            Err(e) => {
                panic!("Recognition failed for '{}': {}", desc, e);
            }
        }
    }
}

/// Test empty board handling with a synthetic 10x10 all-black image
#[test]
fn test_recognize_all_black_board() {
    let img = image::RgbImage::from_fn(10, 10, |_, _| image::Rgb([18u8, 18, 18]));
    let result = sfinder_gui_lib::recognition::recognize_field(&img);
    // All-dark should either error or be all underscores
    match result {
        Ok(field) => {
            assert!(
                field.chars().all(|c| c == '_' || c == '\n'),
                "All-black board should return only underscores, got: {}",
                field
            );
        }
        Err(_) => {}
    }
}

/// Test color matching against known tetr.io palette
#[test]
fn test_tetr_io_color_matching() {
    // Direct color matching tests with actual tetr.io RGB values
    // These come from sampling real screenshots
    use sfinder_gui_lib::recognition::*;
    
    // Note: these tests assume match_piece_color is exported or accessible
    // If not, we test via recognize_field_from_file with synthetic images
    
    // Test cases: (R, G, B, expected_piece)
    let color_tests: &[(u8, u8, u8, char)] = &[
        (57, 197, 177, 'I'),   // cyan
        (239, 219, 91, 'O'),   // yellow  
        (118, 79, 159, 'T'),   // purple
        (174, 216, 73, 'S'),   // green
        (211, 67, 67, 'Z'),    // red
        (89, 119, 199, 'J'),   // blue
        (239, 159, 79, 'L'),   // orange
    ];
    
    for (r, g, b, expected) in color_tests {
        // Create a 10x10 solid color image and test recognition
        let mut img = image::RgbImage::new(10, 10);
        for y in 0..10 {
            for x in 0..10 {
                img.put_pixel(x, y, image::Rgb([*r, *g, *b]));
            }
        }
        
        let result = recognize_field(&img);
        match result {
            Ok(field) => {
                let first_char = field.chars().next().unwrap();
                assert_eq!(
                    first_char, *expected,
                    "Color ({},{},{}) should map to '{}', got '{}'",
                    r, g, b, expected, first_char
                );
            }
            Err(e) => {
                panic!(
                    "Recognition failed for color ({},{},{}) → '{}': {}",
                    r, g, b, expected, e
                );
            }
        }
    }
}
