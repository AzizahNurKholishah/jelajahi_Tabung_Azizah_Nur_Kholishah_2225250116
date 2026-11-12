import csv
import io
from collections import Counter, defaultdict
from typing import Annotated

from fastapi import APIRouter, Depends, Query, Response
from sqlmodel import Session, select

from app.db import get_session
from app.deps import cek_token_peneliti
from app.models import LogEvent
from app.schemas import Ringkasan, RingkasanSoal

router = APIRouter(prefix="/peneliti", tags=["peneliti"], dependencies=[Depends(cek_token_peneliti)])

KOLOM = [
    "id",
    "kode_siswa",
    "kode_kelas",
    "waktu",
    "layar",
    "soal",
    "langkah",
    "aksi",
    "jawaban",
    "benar",
    "miskonsepsi",
    "tingkat_petunjuk",
    "durasi_ms",
    "diterima_pada",
]

Sesi = Annotated[Session, Depends(get_session)]


def _ambil(session: Session, kode_siswa: str | None, kode_kelas: str | None) -> list[LogEvent]:
    q = select(LogEvent).order_by(LogEvent.kode_siswa, LogEvent.waktu)
    if kode_siswa:
        q = q.where(LogEvent.kode_siswa == kode_siswa)
    if kode_kelas:
        q = q.where(LogEvent.kode_kelas == kode_kelas)
    return list(session.exec(q).all())


@router.get("/log", response_model=list[LogEvent])
def daftar_log(
    session: Sesi,
    kode_siswa: Annotated[str | None, Query(pattern=r"^S\d{2,3}$")] = None,
    kode_kelas: str | None = None,
) -> list[LogEvent]:
    return _ambil(session, kode_siswa, kode_kelas)


@router.get("/export.csv")
def ekspor_csv(session: Sesi, kode_kelas: str | None = None) -> Response:
    """CSV pemisah ';' dengan BOM UTF-8 agar langsung terbuka rapi di Excel berbahasa Indonesia."""
    buf = io.StringIO()
    tulis = csv.writer(buf, delimiter=";")
    tulis.writerow(KOLOM)
    for e in _ambil(session, None, kode_kelas):
        baris = e.model_dump()
        tulis.writerow(["" if baris[k] is None else baris[k] for k in KOLOM])
    return Response(
        content="﻿" + buf.getvalue(),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": 'attachment; filename="log-jelajah-tabung.csv"'},
    )


@router.get("/ringkasan", response_model=Ringkasan)
def ringkasan(session: Sesi, kode_kelas: str | None = None) -> Ringkasan:
    """Per soal: banyak siswa, percobaan, % jawaban benar, rata-rata tingkat petunjuk, frekuensi miskonsepsi."""
    semua = _ambil(session, None, kode_kelas)
    jawab = [e for e in semua if e.aksi == "jawab" and e.layar == "arena" and e.soal]

    per_soal: dict[str, list[LogEvent]] = defaultdict(list)
    for e in jawab:
        per_soal[e.soal].append(e)

    hasil = []
    for soal, daftar in sorted(per_soal.items()):
        benar = sum(1 for e in daftar if e.benar)
        petunjuk = [e.tingkat_petunjuk for e in daftar if e.tingkat_petunjuk is not None]
        hasil.append(
            RingkasanSoal(
                soal=soal,
                jumlah_siswa=len({e.kode_siswa for e in daftar}),
                percobaan=len(daftar),
                persen_benar=round(100 * benar / len(daftar), 1),
                rata_petunjuk=round(sum(petunjuk) / len(petunjuk), 2) if petunjuk else 0.0,
                miskonsepsi=dict(Counter(e.miskonsepsi for e in daftar if e.miskonsepsi)),
            )
        )

    return Ringkasan(
        jumlah_siswa=len({e.kode_siswa for e in semua}),
        jumlah_event=len(semua),
        per_soal=hasil,
    )
