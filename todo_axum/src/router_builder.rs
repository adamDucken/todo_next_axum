use anyhow::{Context, Result};
use axum::{
    body::Body,
    extract::State,
    http::{Response, StatusCode},
    routing::get,
    Router,
};
use std::path::{Path, PathBuf};
use std::sync::Arc;
use tokio::fs;
use tower_http::services::ServeDir;

#[derive(Debug)]
pub struct RouterBuilder {
    out_dir: PathBuf,
    handlers: Vec<(String, PathBuf)>,
}

#[derive(Clone)]
struct AppState {
    out_dir: Arc<PathBuf>,
}

impl RouterBuilder {
    pub fn new<P: AsRef<Path>>(out_dir: P) -> Result<Self> {
        let out_dir = out_dir.as_ref().to_path_buf();
        if !out_dir.exists() {
            return Err(anyhow::anyhow!("output dir does not exist: {:?}", out_dir));
        }
        if !out_dir.is_dir() {
            return Err(anyhow::anyhow!("path is not a dir: {:?}", out_dir));
        }

        Ok(Self {
            out_dir,
            handlers: Vec::new(),
        })
    }

    pub async fn scan_directory(&mut self) -> Result<()> {
        let mut entries = fs::read_dir(&self.out_dir)
            .await
            .context("failed to read output dir")?;

        while let Some(entry) = entries
            .next_entry()
            .await
            .context("failed to read dir entry")?
        {
            let path = entry.path();
            if path.is_file() && path.extension().and_then(|s| s.to_str()) == Some("html") {
                let route_name = path
                    .file_stem()
                    .and_then(|s| s.to_str())
                    .ok_or_else(|| anyhow::anyhow!("invalid file name: {:?}", path))?
                    .to_string();

                self.handlers.push((route_name, path));
            }
        }
        Ok(())
    }

    async fn serve_html(
        State(_state): State<AppState>,
        path: PathBuf,
    ) -> Result<Response<Body>, StatusCode> {
        match fs::read(path).await {
            Ok(contents) => Response::builder()
                .status(StatusCode::OK)
                .header("Content-Type", "text/html")
                .body(Body::from(contents))
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR),
            Err(_) => Err(StatusCode::NOT_FOUND),
        }
    }

    pub fn build_router(self) -> Router {
        let state = AppState {
            out_dir: Arc::new(self.out_dir.clone()),
        };

        let serve_dir = ServeDir::new(self.out_dir);

        let mut router = Router::new();

        for (route_name, file_path) in self.handlers {
            let route = format!(
                "/{}",
                if route_name == "index" {
                    ""
                } else {
                    &route_name
                }
            );
            let path = file_path.clone();
            let state_clone = state.clone();

            router = router.route(
                &route,
                get(move || {
                    let state = state_clone.clone();
                    async move { Self::serve_html(State(state), path.clone()).await }
                }),
            );
        }
        router = router.fallback_service(serve_dir);

        router
    }
}
