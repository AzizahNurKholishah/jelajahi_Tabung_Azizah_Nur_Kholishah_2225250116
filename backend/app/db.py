from collections.abc import Iterator
from functools import lru_cache

from sqlalchemy.engine import Engine
from sqlmodel import Session, SQLModel, create_engine

from app.config import get_settings


@lru_cache
def get_engine() -> Engine:
    url = get_settings().url_database
    if url.startswith("sqlite"):
        return create_engine(url, connect_args={"check_same_thread": False})
    # PostgreSQL (Neon): koneksi bisa diputus saat database idle → cek dulu sebelum dipakai.
    return create_engine(url, pool_pre_ping=True, pool_recycle=300)


def buat_tabel(engine: Engine | None = None) -> None:
    from app import models  # noqa: F401  (mendaftarkan tabel)

    SQLModel.metadata.create_all(engine or get_engine())


def get_session() -> Iterator[Session]:
    with Session(get_engine()) as session:
        yield session
