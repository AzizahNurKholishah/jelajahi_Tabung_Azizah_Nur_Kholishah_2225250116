from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import VERSI, get_settings
from app.db import buat_tabel
from app.routers import health, log, peneliti


@asynccontextmanager
async def lifespan(_: FastAPI):
    buat_tabel()
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="Jelajah Tabung API", version=VERSI, lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.daftar_cors_origins,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type", "X-Peneliti-Token"],
    )
    app.include_router(health.router, prefix="/api")
    app.include_router(log.router, prefix="/api")
    app.include_router(peneliti.router, prefix="/api")
    return app


app = create_app()
