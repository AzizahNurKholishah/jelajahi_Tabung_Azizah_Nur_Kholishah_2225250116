# CLAUDE.md — Panduan untuk Claude Code

Proyek: **Jelajah Tabung**, aplikasi web PWA belajar *Luas Permukaan Tabung* (Matematika SMP kelas VIII), dikembangkan dengan model ADDIE berdasarkan analisis beban kognitif (Cognitive Load Theory). Penelitian skripsi S1 Pendidikan Matematika.

## Baca dulu
- `docs/PRD.md` — apa yang dibangun dan mengapa (temuan wawancara → fitur)
- `docs/DESAIN.md` — prinsip desain, warna, tata letak, rancangan tiap modul
- `docs/KONTEN.md` — naskah materi, bank soal, kunci, miskonsepsi, petunjuk (**sumber kebenaran isi**)
- `docs/ARSITEKTUR.md` — stack, struktur folder, model data, API
- `docs/ROADMAP.md` — urutan sprint; kerjakan sesuai urutan

## Stack
- **frontend/**: React 18 + Vite (JavaScript/JSX), `react-router-dom` (HashRouter), `vite-plugin-pwa`, `idb-keyval`, CSS Modules + `tokens.css`, Vitest.
- **3D**: `three` + `@react-three/fiber` + `@react-three/drei`. Semua kode 3D hanya di `frontend/src/three/` dan di-lazy-load.
- **backend/**: Python 3.11+, FastAPI, SQLModel + SQLite, pytest.
- **Dilarang** menambah dependensi di luar daftar ARSITEKTUR.md §2 (mis. Tailwind, MUI, Redux, framer-motion, react-spring, @react-three/postprocessing, KaTeX, axios, font web) tanpa persetujuan pengguna.
- Gunakan JavaScript, bukan TypeScript, kecuali pengguna meminta.

## Perintah (Windows / PowerShell)
```powershell
# frontend
cd frontend; npm install; npm run dev -- --host   # http://localhost:5173
cd frontend; npm test                             # vitest run
cd frontend; npm run build; npm run preview       # uji PWA/offline
# backend
cd backend; .venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --port 8000
cd backend; pytest
```
Kedua rangkaian tes wajib hijau sebelum menyatakan pekerjaan selesai.

## Prinsip arsitektur
- **Offline-first:** semua materi, soal, dan pemeriksaan jawaban berjalan di frontend. Backend hanya untuk log penelitian. Aplikasi tidak boleh macet atau menampilkan error ke siswa bila backend mati.
- Logika murni di `frontend/src/lib/` (tanpa React/DOM) dan wajib diuji.
- Komponen sebagai fungsi + hooks; state global hanya `ProgresContext`. Hindari prop drilling lebih dari 2 tingkat.
- Pengiriman log hanya lewat `state/logger.js` (antrean IndexedDB, idempoten dengan `id` uuid).
- Backend: router tipis; validasi dengan Pydantic; endpoint peneliti wajib `X-Peneliti-Token`.

## Aturan isi (matematika)
- Jangan mengetik kunci jawaban secara manual; kunci dihitung `lib/rumus.js` dan dicek `soal.test.js` terhadap angka di `docs/KONTEN.md`.
- Ubah `frontend/src/data/soal.js` ⇄ `docs/KONTEN.md` secara bersamaan.
- Rumus: tertutup `2πr(r+t)`; tanpa tutup `πr² + 2πrt`; selimut `2πrt`; `r = d ÷ 2`. π hanya `22/7` atau `3,14` sesuai soal.
- Tampilan angka format Indonesia (`2.992`, `11,88`); input menerima koma maupun titik (ARSITEKTUR.md §6).

## Aturan desain (mengurangi beban kognitif)
- Satu ide per layar; teks layar materi ≤ 40 kata; tanpa scroll di 360×640.
- Label menempel pada gambar (kedekatan spasial).
- Warna bagian tabung tetap: alas biru, tutup hijau, selimut oranye, r/d magenta, t ungu — selalu lewat CSS variable dari `tokens.css`, jangan hex langsung di komponen.
- Warna tidak boleh menjadi satu-satunya penanda (selalu ada label teks/ikon).
- Tanpa animasi dekoratif, maskot, musik, timer, nyawa, atau leaderboard. Hormati `prefers-reduced-motion`.
- Navigasi materi: Kembali / Ulangi / Lanjut; tanpa auto-advance.
- Target sentuh ≥ 48px; tombol aksi di zona jempol (bawah).

## Aturan 3D (three.js) — lihat DESAIN.md §2.5 dan ARSITEKTUR.md §7
- Matte dan polos: tanpa tekstur, bayangan, environment map, post-processing, atau model `.glb`. Geometri dibuat dari kode (Circle/Plane/BufferGeometry).
- Tanpa auto-rotate; OrbitControls tanpa pan, sudut dan zoom dibatasi; tombol "Posisi awal" wajib ada.
- `<Canvas frameloop="demand" dpr={[1, 1.5]}>`; dispose geometri/materi saat unmount.
- Matematika animasi (lentur selimut, engsel) ada di `lib/geometriTabung.js` dan wajib diuji; panjang busur selimut harus selalu 2πr.
- `Tabung3D` dan `Tabung` (SVG) memakai props yang sama; setiap fitur 3D harus punya fallback 2D.
- Label memakai drei `<Html>` yang menempel pada objek; selalu sediakan `<PemilihBagian>` (tombol HTML) sebagai alternatif ketuk.
- Arena tidak memakai 3D.

## Aturan bahasa UI
- Bahasa Indonesia, sapaan "kamu", kalimat pendek dan aktif; ikuti glosarium DESAIN.md §7.
- Umpan balik salah bersifat membangun; jangan memakai "SALAH!" besar.
- Jangan pernah memakai istilah *intrinsic/extraneous/germane load* di UI siswa.

## Privasi & etika penelitian
- Tidak ada nama siswa di kode, data contoh, commit, log, atau database; hanya kode informan (S01) dan kode kelas.
- Log hanya dikirim bila kode siswa diisi lewat Mode Peneliti (berarti sudah ada persetujuan).
- Tanpa analytics/pelacak pihak ketiga; jangan menyimpan IP atau user-agent lengkap.
- `.env`, `data.db`, dan token tidak boleh di-commit.

## Gaya kode
- Nama domain boleh berbahasa Indonesia (`luasSelimut`, `jariJari`, `luas_selimut`), konsisten per file.
- Python: type hints, format `ruff format`/PEP 8.
- Komentar hanya untuk alasan yang tidak jelas, terutama alasan pedagogis (mis. `// fading: level 3 hanya wajib langkah 2 dan 4 (GL05)`).

## Definisi selesai (per fitur)
1. `npm test` dan `pytest` hijau.
2. Dicek di DevTools mode perangkat 360×640 dan, bila memungkinkan, di HP Android.
3. Sesuai checklist DESAIN.md §8.
4. Centang tugas di `docs/ROADMAP.md`; catat keputusan penting di Jejak Keputusan.
