from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.db import get_session
from app.models import LogEvent
from app.schemas import BatchHasil, BatchMasuk

router = APIRouter(tags=["log"])


@router.post("/log/batch", response_model=BatchHasil)
def terima_batch(batch: BatchMasuk, session: Annotated[Session, Depends(get_session)]) -> BatchHasil:
    """Menerima sekumpulan log dari aplikasi. Idempoten: id yang sudah ada dilewati,
    sehingga aplikasi aman mengirim ulang antrean setelah koneksi putus."""
    id_masuk = list({e.id for e in batch.events})
    sudah_ada = set(session.exec(select(LogEvent.id).where(LogEvent.id.in_(id_masuk))).all()) if id_masuk else set()

    diterima = 0
    terlihat: set[str] = set()
    for e in batch.events:
        if e.id in sudah_ada or e.id in terlihat:
            continue
        terlihat.add(e.id)
        session.add(LogEvent(**e.model_dump()))
        diterima += 1
    session.commit()
    return BatchHasil(diterima=diterima, duplikat=len(batch.events) - diterima)
