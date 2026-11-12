from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

VERSI = "0.2.0"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    peneliti_token: str = ""
    database_url: str = "sqlite:///./data.db"
    cors_origins: str = "http://localhost:5173"

    @property
    def daftar_cors_origins(self) -> list[str]:
        return [o.strip().rstrip("/") for o in self.cors_origins.split(",") if o.strip()]

    @property
    def url_database(self) -> str:
        """Neon/Render memberi URL `postgres://` atau `postgresql://`; SQLAlchemy butuh driver psycopg 3."""
        url = self.database_url.strip()
        for awalan in ("postgres://", "postgresql://"):
            if url.startswith(awalan):
                return "postgresql+psycopg://" + url[len(awalan) :]
        return url


@lru_cache
def get_settings() -> Settings:
    return Settings()
