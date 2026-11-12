from fastapi import APIRouter

from app.config import VERSI

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "versi": VERSI}
