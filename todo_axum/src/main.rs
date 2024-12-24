mod cors;
mod handlers;
mod init_db;
mod models;
mod router_builder;

use axum::{routing::get, Router};
use cors::create_cors_layer;
use handlers::todo::{create_todo, delete_todo, get_todo, list_todos, update_todo};
use init_db::init_db;
use std::sync::Arc;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    dotenv::dotenv().ok();

    let pool = init_db().await;
    let cors = create_cors_layer();

    let app = Router::new()
        .route("/todos", get(list_todos).post(create_todo))
        .route(
            "/todos/:id",
            get(get_todo).put(update_todo).delete(delete_todo),
        )
        .layer(cors)
        .with_state(Arc::new(pool));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .expect("Failed to bind");

    println!("Server running on http://127.0.0.1:3000");

    axum::serve(listener, app)
        .await
        .expect("Failed to start server");
}
