use epub::doc::EpubDoc;
use std::{fs, path::PathBuf};

pub fn get_epub_metadata(file_path: &PathBuf) -> (String, String, String, String, String, String) {
    let doc = EpubDoc::new(&file_path);
    assert!(doc.is_ok());
    let epub_file = doc.unwrap();
    let epub_title = epub_file.mdata("title").unwrap();
    let epub_creator = epub_file.mdata("creator").unwrap();
    let epub_language = epub_file.mdata("language").unwrap();
    let epub_publisher = epub_file.mdata("publisher").unwrap();
    let epub_identifier = epub_file.mdata("identifier").unwrap();
    let epub_pubdate: String = epub_file.mdata("date").unwrap();

    (
        epub_title,
        epub_identifier,
        epub_creator,
        epub_language,
        epub_publisher,
        epub_pubdate,
    )
}

pub fn create_epub_cover(epub_file_path: &PathBuf, epub_cover_name: String) {
    let doc = EpubDoc::new(&epub_file_path);
    assert!(doc.is_ok());
    let mut epub_file = doc.unwrap();

    let cover_image = epub_file.get_cover().unwrap();
    println!("Saving cover image to: {}", epub_cover_name);

    let _ = match fs::write(epub_cover_name, cover_image) {
        Ok(path) => {
            println!("Cover image saved to: {:#?}", path);
            path
        }
        Err(e) => {
            println!("failed to write file: {}", e);
        }
    };
}
