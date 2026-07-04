from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("", response_model=dict)
def get_health():
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }
