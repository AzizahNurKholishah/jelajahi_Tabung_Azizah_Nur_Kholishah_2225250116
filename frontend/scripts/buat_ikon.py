"""Membuat ikon PWA (PNG) bergambar tabung, hanya dengan pustaka standar Python.

Jalankan dari folder frontend:  py scripts/buat_ikon.py
Hasil: public/icons/icon-192.png, icon-512.png, maskable-512.png
"""

import struct
import zlib
from pathlib import Path

LATAR = (37, 99, 235)  # --c-aksen
SELIMUT = (234, 88, 12)  # --c-selimut
TUTUP = (5, 150, 105)  # --c-tutup
ALAS_TEPI = (30, 64, 175)
SAMPEL = 3  # supersampling 3×3 agar tepi halus


def warna_titik(x: float, y: float) -> tuple[int, int, int]:
    """Koordinat dalam kanvas 512×512."""
    cx, rx, ry = 256.0, 104.0, 36.0
    atas, bawah = 150.0, 372.0
    di_elips = lambda cy: ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1.0  # noqa: E731
    if di_elips(atas):
        return TUTUP
    di_badan = cx - rx <= x <= cx + rx and atas <= y <= bawah
    if di_badan or di_elips(bawah):
        if not di_badan and y > bawah:
            return SELIMUT if ((x - cx) / rx) ** 2 + ((y - bawah) / ry) ** 2 <= 0.86 else ALAS_TEPI
        return SELIMUT
    return LATAR


def gambar(ukuran: int) -> bytes:
    skala = 512 / ukuran
    baris = bytearray()
    for py in range(ukuran):
        baris.append(0)  # filter PNG: none
        for px in range(ukuran):
            total = [0, 0, 0]
            for sy in range(SAMPEL):
                for sx in range(SAMPEL):
                    w = warna_titik((px + (sx + 0.5) / SAMPEL) * skala, (py + (sy + 0.5) / SAMPEL) * skala)
                    for i in range(3):
                        total[i] += w[i]
            baris.extend(round(c / SAMPEL**2) for c in total)
    return bytes(baris)


def tulis_png(path: Path, ukuran: int) -> None:
    def potongan(jenis: bytes, data: bytes) -> bytes:
        return struct.pack(">I", len(data)) + jenis + data + struct.pack(">I", zlib.crc32(jenis + data) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", ukuran, ukuran, 8, 2, 0, 0, 0)  # 8-bit RGB
    isi = b"\x89PNG\r\n\x1a\n" + potongan(b"IHDR", ihdr) + potongan(b"IDAT", zlib.compress(gambar(ukuran), 9))
    path.write_bytes(isi + potongan(b"IEND", b""))
    print(f"dibuat {path} ({path.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    folder = Path(__file__).resolve().parent.parent / "public" / "icons"
    folder.mkdir(parents=True, exist_ok=True)
    tulis_png(folder / "icon-192.png", 192)
    tulis_png(folder / "icon-512.png", 512)
    # Gambar berada di dalam "zona aman" 80% sehingga sama bisa dipakai sebagai ikon maskable.
    tulis_png(folder / "maskable-512.png", 512)
