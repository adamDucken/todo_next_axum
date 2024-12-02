mod handlers;
mod models;

use axum::{routing::get, Router};
use handlers::todo::{create_todo, delete_todo, get_todo, list_todos, update_todo};
use sqlx::SqlitePool;
use std::sync::Arc;

#[tokio::main]
async fn main() {
    // Initialize logging
    tracing_subscriber::fmt::init();

    // Load environment variables
    dotenv::dotenv().ok();

    // Create SQLite pool
    let database_url =
        std::env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:todos.db".to_string());
    let pool = SqlitePool::connect(&database_url)
        .await
        .expect("Failed to create pool");

    // Initialize the database
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT 0
        )
        "#,
    )
    .execute(&pool)
    .await
    .expect("Failed to create table");

    // Create router
    let app = Router::new()
        .route("/todos", get(list_todos).post(create_todo))
        .route(
            "/todos/:id",
            get(get_todo).put(update_todo).delete(delete_todo),
        )
        .with_state(Arc::new(pool));

    // Start server
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .expect("Failed to bind");

    println!("Server running on http://127.0.0.1:3000");

    axum::serve(listener, app)
        .await
        .expect("Failed to start server");
}
