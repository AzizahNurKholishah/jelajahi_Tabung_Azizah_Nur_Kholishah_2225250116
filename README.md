# Jelajah Tabung

Aplikasi web (PWA, *mobile-first* untuk Android) untuk membantu siswa SMP kelas VIII memahami **Luas Permukaan Tabung** dengan desain yang mengelola beban kognitif dan menguatkan literasi matematika.

- **JavaScript** — `frontend/`: React + Vite + PWA, grafik 3D dengan three.js (React Three Fiber)
- **Python** — `backend/`: FastAPI + SQLite untuk log penelitian (Mode Peneliti)

Dikembangkan dengan model ADDIE oleh Azizah Nur Kholishah (2225250116), Pendidikan Matematika.

## Isi aplikasi
| Modul | Isi |
|---|---|
| Cek Kesiapan | 4 soal prasyarat lingkaran → saran Pengantar Lingkaran bila skor < 3 |
| Pengantar Lingkaran | r & d, keliling 2πr, luas πr² (3 layar) |
| 1 Kenali Tabung | Tabung 3D: ketuk alas/tutup/selimut/r/t, tantangan, kaleng vs ember |
| 2 Buka Tabung | Slider membuka tabung 3D menjadi jaring-jaring; alas digelindingkan (panjang selimut = 2πr) |
| 2b Laboratorium | Slider r & t, luas tiap bagian berubah langsung |
| 3 Asal Rumus | 7 langkah: dua angka 2 yang berbeda |
| 4 Contoh Soal | Contoh lengkap → sebagian → mandiri |
| 5 Arena Latihan | 12 soal, 3 level; langkah ①–⑤, petunjuk bertingkat, umpan balik miskonsepsi, bintang, refleksi |
| 6 Rangkuman | Rumus, bintang, lencana |
| Tentang | Mulai ulang progres, Mode Peneliti (PIN) |

## Dokumen perencanaan
| File | Isi |
|---|---|
| [docs/PRD.md](docs/PRD.md) | Kebutuhan produk, temuan wawancara → fitur, indikator keberhasilan |
| [docs/DESAIN.md](docs/DESAIN.md) | Desain instruksional & antarmuka |
| [docs/KONTEN.md](docs/KONTEN.md) | Materi, bank soal, kunci, miskonsepsi, petunjuk |
| [docs/ARSITEKTUR.md](docs/ARSITEKTUR.md) | Rancangan teknis (frontend, backend, API, deploy) |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Tahapan ADDIE, sprint, jejak keputusan |
| [CLAUDE.md](CLAUDE.md) | Aturan kerja untuk Claude Code saat coding |

## Menjalankan di laptop (Windows / PowerShell)
Prasyarat: Node.js ≥ 18, Python ≥ 3.11.

```powershell
# 1) Backend (Python) — terminal pertama
cd backend
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt -r requirements-dev.txt
copy .env.example .env        # lalu isi PENELITI_TOKEN dengan string acak
uvicorn app.main:app --reload --port 8000      # dokumentasi API: http://localhost:8000/docs

# 2) Frontend (JavaScript) — terminal kedua
cd frontend
npm install
npm run dev -- --host        # laptop: http://localhost:5173 ; HP (Wi-Fi sama): http://<IP-laptop>:5173
```

## Tes
```powershell
cd frontend; npm test        # Vitest: rumus, kunci jawaban, miskonsepsi, geometri 3D, alur halaman
cd backend;  pytest          # pytest: log batch, token peneliti, ringkasan, ekspor CSV
```

## Mode Peneliti
1. Di aplikasi: Beranda → "Tentang aplikasi & Mode Peneliti" → masukkan PIN (bawaan `2026`, ganti lewat `VITE_PIN_PENELITI` di `frontend/.env`).
2. Isi **kode siswa** (mis. `S01`, bukan nama) dan kode kelas **setelah ada persetujuan**. Tanpa kode, tidak ada log yang dicatat.
3. Log tersimpan dulu di HP dan dikirim otomatis ke backend saat online.
4. Ambil data: `GET /api/peneliti/ringkasan` dan `GET /api/peneliti/export.csv` dengan header `X-Peneliti-Token` (isi dari `backend/.env`). Bisa dicoba di http://localhost:8000/docs.

## Ikon PWA
```powershell
cd frontend; py scripts/buat_ikon.py   # membuat public/icons/*.png
```
