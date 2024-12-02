use crate::models::todo::Todo;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use sqlx::SqlitePool;
use std::sync::Arc;

pub async fn list_todos(
    State(pool): State<Arc<SqlitePool>>,
) -> Result<Json<Vec<Todo>>, StatusCode> {
    let todos = sqlx::query_as!(Todo, "SELECT id, title, completed FROM todos")
        .fetch_all(&*pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(todos))
}

pub async fn create_todo(
    State(pool): State<Arc<SqlitePool>>,
    Json(todo): Json<Todo>,
) -> Result<Json<Todo>, StatusCode> {
    let todo = sqlx::query_as!(
        Todo,
        r#"
        INSERT INTO todos (title, completed) 
        VALUES (?, ?)
        RETURNING id, title, completed
        "#,
        todo.title,
        todo.completed
    )
    .fetch_one(&*pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(todo))
}

pub async fn get_todo(
    Path(id): Path<i64>,
    State(pool): State<Arc<SqlitePool>>,
) -> Result<Json<Todo>, StatusCode> {
    let todo = sqlx::query_as!(
        Todo,
        "SELECT id, title, completed FROM todos WHERE id = ?",
        id
    )
    .fetch_optional(&*pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    .ok_or(StatusCode::NOT_FOUND)?;
    Ok(Json(todo))
}

pub async fn update_todo(
    Path(id): Path<i64>,
    State(pool): State<Arc<SqlitePool>>,
    Json(todo): Json<Todo>,
) -> Result<Json<Todo>, StatusCode> {
    let todo = sqlx::query_as!(
        Todo,
        r#"
        UPDATE todos 
        SET title = ?, completed = ? 
        WHERE id = ?
        RETURNING id, title, completed
        "#,
        todo.title,
        todo.completed,
        id
    )
    .fetch_optional(&*pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    .ok_or(StatusCode::NOT_FOUND)?;
    Ok(Json(todo))
}

pub async fn delete_todo(
    Path(id): Path<i64>,
    State(pool): State<Arc<SqlitePool>>,
) -> Result<StatusCode, StatusCode> {
    sqlx::query!("DELETE FROM todos WHERE id = ?", id)
        .execute(&*pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(StatusCode::NO_CONTENT)
}
