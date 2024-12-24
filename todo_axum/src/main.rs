mod handlers;
mod init_db;
mod models;
mod router_builder;

use axum::{routing::get, Router};
use handlers::todo::{create_todo, delete_todo, get_todo, list_todos, update_todo};
use http::header::{AUTHORIZATION, CONTENT_TYPE};
use http::Method;
use init_db::init_db;
use router_builder::RouterBuilder;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    dotenv::dotenv().ok();

    let pool = init_db().await;

    // (Any) this is only for dev env ;; in prod you shold change this to explicit values - TODO
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([CONTENT_TYPE, AUTHORIZATION]);

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
