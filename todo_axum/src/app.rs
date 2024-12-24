use crate::{
    cors::create_cors_layer,
    handlers::todo::{create_todo, delete_todo, get_todo, list_todos, update_todo},
    router_builder::RouterBuilder,
};
use axum::{routing::get, Router};
use sqlx::SqlitePool;
use std::path::PathBuf;
use std::sync::Arc;

pub struct AppBuilder {
    pool: SqlitePool,
    static_dir: PathBuf,
}

impl AppBuilder {
    pub fn new(pool: SqlitePool, static_dir: PathBuf) -> Self {
        Self { pool, static_dir }
    }

    pub async fn build(self) -> Router {
        let mut builder =
            RouterBuilder::new(self.static_dir).expect("Failed to initialize router builder");

        builder
            .scan_directory()
            .await
            .expect("Failed to scan static directory");

        let todo = Router::new()
            .route("/todos", get(list_todos).post(create_todo))
            .route(
                "/todos/:id",
                get(get_todo).put(update_todo).delete(delete_todo),
            )
            .with_state(Arc::new(self.pool));

        builder
            .build_router()
            .nest("/", todo)
            .layer(create_cors_layer())
    }
}
