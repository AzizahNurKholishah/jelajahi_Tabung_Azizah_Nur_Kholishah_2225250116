from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


def sekarang() -> datetime:
    return datetime.now(timezone.utc)


class LogEvent(SQLModel, table=True):
    """Satu aksi siswa di aplikasi (docs/ARSITEKTUR.md §4.4). Tanpa nama, email, atau IP."""

    __tablename__ = "log_event"

    id: str = Field(primary_key=True, max_length=36)  # UUID dari klien → idempoten
    kode_siswa: str = Field(index=True, max_length=4)
    kode_kelas: str | None = Field(default=None, index=True, max_length=20)
    waktu: datetime
    layar: str = Field(max_length=40)
    soal: str | None = Field(default=None, index=True, max_length=20)
    langkah: str | None = Field(default=None, max_length=20)
    aksi: str = Field(max_length=20)
    jawaban: str | None = Field(default=None, max_length=200)
    benar: bool | None = None
    miskonsepsi: str | None = Field(default=None, max_length=20)
    tingkat_petunjuk: int | None = None
    durasi_ms: int | None = None
    diterima_pada: datetime = Field(default_factory=sekarang)
