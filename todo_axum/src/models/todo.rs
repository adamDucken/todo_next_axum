use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Todo {
    pub id: Option<i64>,
    pub title: String,
    pub completed: bool,
}
