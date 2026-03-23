#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{webview::NewWindowResponse, WebviewUrl, WebviewWindowBuilder};
use url::Url;

const APP_TITLE: &str = "Misskey Isolated Browser";
const MISSKEY_URL: &str = "https://misskey.io";
const MISSKEY_HOST: &str = "misskey.io";

fn is_external_link(url: &Url) -> bool {
    matches!(url.scheme(), "http" | "https") && url.host_str() != Some(MISSKEY_HOST)
}

fn open_external_in_browser(url: &Url) {
    if let Err(error) = open::that(url.as_str()) {
        eprintln!("failed to open external url in browser: {url} ({error})");
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let misskey_url = Url::parse(MISSKEY_URL).expect("misskey.io URL must be valid");

            WebviewWindowBuilder::new(app, "main", WebviewUrl::External(misskey_url))
                .title(APP_TITLE)
                .inner_size(1320.0, 860.0)
                .min_inner_size(920.0, 640.0)
                .resizable(true)
                .on_document_title_changed(|window, title| {
                    let trimmed = title.trim();
                    let next_title = if trimmed.is_empty() {
                        APP_TITLE.to_string()
                    } else {
                        trimmed.to_string()
                    };

                    if let Err(error) = window.set_title(&next_title) {
                        eprintln!("failed to update window title: {error}");
                    }
                })
                .on_navigation(|url| {
                    if is_external_link(url) {
                        open_external_in_browser(url);
                        false
                    } else {
                        true
                    }
                })
                .on_new_window(|url, _features| {
                    if is_external_link(&url) {
                        open_external_in_browser(&url);
                        NewWindowResponse::Deny
                    } else {
                        NewWindowResponse::Allow
                    }
                })
                .build()?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
