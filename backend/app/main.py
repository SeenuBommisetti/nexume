from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Root-level health endpoint (GET /health)
@app.get("/health", response_model=dict)
def get_root_health():
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

# Include API Router under /api/v1
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", response_model=dict)
def root():
    return {
        "message": f"Welcome to the {settings.PROJECT_NAME} backend!",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }
