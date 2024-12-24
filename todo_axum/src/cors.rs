use http::header::{AUTHORIZATION, CONTENT_TYPE};
use http::Method;
use tower_http::cors::{Any, CorsLayer};

pub fn create_cors_layer() -> CorsLayer {
    // (Any) this is only for dev env ;; in prod you shold change this to explicit values - TODO
    CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([CONTENT_TYPE, AUTHORIZATION])
}
