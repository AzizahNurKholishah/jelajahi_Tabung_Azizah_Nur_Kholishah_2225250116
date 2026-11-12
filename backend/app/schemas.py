from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

AKSI = Literal[
    "jawab",
    "petunjuk",
    "tandai",
    "refleksi",
    "selesai_soal",
    "selesai_modul",
]


class LogEventMasuk(BaseModel):
    id: str = Field(pattern=r"^[0-9a-fA-F-]{36}$")
    kode_siswa: str = Field(pattern=r"^S\d{2,3}$")
    kode_kelas: str | None = Field(default=None, pattern=r"^[A-Za-z0-9-]{1,20}$")
    waktu: datetime
    layar: str = Field(min_length=1, max_length=40)
    soal: str | None = Field(default=None, max_length=20)
    langkah: str | None = Field(default=None, max_length=20)
    aksi: AKSI
    jawaban: str | None = Field(default=None, max_length=200)
    benar: bool | None = None
    miskonsepsi: str | None = Field(default=None, max_length=20)
    tingkat_petunjuk: int | None = Field(default=None, ge=0, le=2)
    durasi_ms: int | None = Field(default=None, ge=0)


class BatchMasuk(BaseModel):
    events: list[LogEventMasuk] = Field(max_length=200)


class BatchHasil(BaseModel):
    diterima: int
    duplikat: int


class RingkasanSoal(BaseModel):
    soal: str
    jumlah_siswa: int
    percobaan: int
    persen_benar: float
    rata_petunjuk: float
    miskonsepsi: dict[str, int]


class Ringkasan(BaseModel):
    jumlah_siswa: int
    jumlah_event: int
    per_soal: list[RingkasanSoal]
