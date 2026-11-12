from app.config import Settings


def test_url_postgres_dari_neon_diubah_ke_driver_psycopg() -> None:
    s = Settings(database_url="postgresql://user:pw@ep-contoh.neon.tech/neondb?sslmode=require")
    assert s.url_database == "postgresql+psycopg://user:pw@ep-contoh.neon.tech/neondb?sslmode=require"
    assert Settings(database_url="postgres://u:p@h/db").url_database == "postgresql+psycopg://u:p@h/db"


def test_url_sqlite_tidak_diubah() -> None:
    assert Settings(database_url="sqlite:///./data.db").url_database == "sqlite:///./data.db"


def test_cors_origin_tanpa_garis_miring_akhir() -> None:
    s = Settings(cors_origins="https://azizahnurkholishah.github.io/, http://localhost:5173")
    assert s.daftar_cors_origins == ["https://azizahnurkholishah.github.io", "http://localhost:5173"]
