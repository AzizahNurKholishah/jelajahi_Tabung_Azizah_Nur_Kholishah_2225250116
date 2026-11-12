import uuid
from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, create_engine

from app.config import Settings, get_settings
from app.db import buat_tabel, get_session
from app.main import app

TOKEN = "token-uji-rahasia"


@pytest.fixture
def client() -> Iterator[TestClient]:
    """Basis data SQLite di memori per tes; tidak membuat file data.db."""
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    buat_tabel(engine)

    def sesi_uji() -> Iterator[Session]:
        with Session(engine) as s:
            yield s

    app.dependency_overrides[get_session] = sesi_uji
    app.dependency_overrides[get_settings] = lambda: Settings(peneliti_token=TOKEN)
    yield TestClient(app)  # tanpa `with` → lifespan (buat tabel di data.db) tidak dijalankan
    app.dependency_overrides.clear()


def buat_event(**ubah) -> dict:
    e = {
        "id": str(uuid.uuid4()),
        "kode_siswa": "S01",
        "kode_kelas": "VIII-A",
        "waktu": "2026-11-12T08:15:30Z",
        "layar": "arena",
        "soal": "L2-1",
        "langkah": "diketahui",
        "aksi": "jawab",
        "jawaban": '{"r":"14","t":"10"}',
        "benar": False,
        "miskonsepsi": "MK1",
        "tingkat_petunjuk": 0,
        "durasi_ms": 8200,
    }
    e.update(ubah)
    return e
