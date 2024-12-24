use sqlx::{sqlite::SqlitePool, Pool, Sqlite};
use std::env;

pub async fn init_db() -> Pool<Sqlite> {
    // Get the database URL or use a default one
    let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:todos.db".to_string());

    // Create the database connection pool
    let pool = SqlitePool::connect(&database_url)
        .await
        .expect("Failed to create pool");

    // Run the table creation query
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

    pool
}
