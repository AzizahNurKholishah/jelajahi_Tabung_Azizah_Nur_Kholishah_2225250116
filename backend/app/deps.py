import secrets
from typing import Annotated

from fastapi import Depends, Header, HTTPException, status

from app.config import Settings, get_settings


def cek_token_peneliti(
    settings: Annotated[Settings, Depends(get_settings)],
    x_peneliti_token: Annotated[str | None, Header()] = None,
) -> None:
    """Endpoint peneliti wajib memakai header X-Peneliti-Token yang cocok dengan PENELITI_TOKEN."""
    if not settings.peneliti_token:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "PENELITI_TOKEN belum diatur di server.")
    if not x_peneliti_token or not secrets.compare_digest(x_peneliti_token, settings.peneliti_token):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token peneliti salah.")
