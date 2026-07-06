from fastapi import APIRouter
from app.api.v1.endpoints import health, resume

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(resume.router, prefix="/resume", tags=["resume"])
