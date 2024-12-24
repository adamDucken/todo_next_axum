mod app;
mod cors;
mod handlers;
mod init_db;
mod models;
mod router_builder;

use app::AppBuilder;
use init_db::init_db;
use std::env;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    dotenv::dotenv().ok();

    let pool = init_db().await;
    let static_dir = env::current_dir()
        .expect("Failed to get current directory")
        .join("../todo_next/out");

    let app = AppBuilder::new(pool, static_dir).build().await;

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .expect("Failed to bind");

    println!("Server running on http://127.0.0.1:3000");
    axum::serve(listener, app)
        .await
        .expect("Failed to start server");
}
