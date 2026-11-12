# ROADMAP — Tahapan ADDIE & Rencana Kerja
## Jelajah Tabung

Status: ✅ selesai · 🔄 berjalan · ⬜ belum

## A — Analysis
| Tugas | Status | Luaran |
|---|---|---|
| Wawancara S01 (06/11/2026) | ✅ | Transkrip, kode IL/EL/GL/DS |
| Wawancara S02 (minimal 2 informan sesuai pedoman) | ⬜ | Transkrip S02; perbarui matriks PRD §9 |
| Triangulasi: wawancara × soal pemicu × artefak belajar | ⬜ | Matriks konfirmasi/ketidaksesuaian |
| Analisis kurikulum (CP Fase D, buku siswa kelas VIII) | ⬜ | KONTEN.md §1 terverifikasi |
| Analisis perangkat siswa (jenis HP, browser, kuota) | ⬜ | Catatan singkat; konfirmasi NFR |

## D — Design
| Tugas | Status | Luaran |
|---|---|---|
| PRD, DESAIN, KONTEN, ARSITEKTUR | 🔄 | `docs/` |
| Storyboard/wireframe (kertas atau Figma) M1–M5 | ⬜ | Gambar wireframe |
| Kisi-kisi instrumen validasi ahli materi & ahli media | ⬜ | Lembar validasi |
| Angket respons siswa & guru; kuesioner beban kognitif (adaptasi Klepsch dkk., 2017) | ⬜ | Instrumen |

## D — Development (coding, urutan yang disarankan)

Setiap sprint diakhiri dengan pengecekan di HP Android sungguhan.

**Sprint 0 — Fondasi**
- [x] Monorepo: `frontend/` (Vite React JS) dan `backend/` (FastAPI), `.gitignore`
- [x] Frontend: `tokens.css`, HashRouter, `LayarModul`, halaman Beranda
- [x] `lib/rumus.js`, `lib/angka.js` + tes Vitest hijau (semua kunci KONTEN.md terverifikasi)
- [x] Backend: `/api/health`, struktur `app/`, pytest hijau (3 tes, Python 3.14)
- [ ] Deploy awal frontend (Netlify/Vercel) untuk memastikan alur deploy sejak awal

**Sprint 1 — Visual inti 3D (prototipe v0.1)**
- [x] `lib/geometriTabung.js` + tes (panjang busur selimut = 2πr untuk semua k; sudut engsel)
- [x] `<Panggung3D>` (Canvas, kamera, cahaya, OrbitControls terbatas, tombol posisi awal) — lazy-load
- [x] `<Tabung3D>` + `<LabelBagian>` + `<PemilihBagian>` → M1 Kenali Tabung (ketuk bagian, mini-tantangan, kaleng vs ember)
- [x] `SelimutLentur.js` + slider → M2 Buka Tabung; animasi alas menggelinding
- [x] M2b Laboratorium Tabung (slider r, t + kartu luas langsung)
- [x] `dukungWebGL.js` + SVG 2D cadangan (`Tabung2D`, satu komponen untuk tabung & jaring-jaring) + sakelar 2D/3D
- [ ] Deteksi FPS awal < 20 → otomatis 2D (belum; saat ini deteksi berdasarkan WebGL, jumlah inti CPU, dan RAM)
- [ ] Uji FPS dan suhu di 1–2 HP Android sungguhan (termasuk HP murah)
- [x] `<NavLangkah>` + M3 Asal Rumus (7 langkah)
- [ ] Uji keterbacaan dengan 1–2 siswa non-informan → catat revisi

**Sprint 2 — Latihan**
- [x] `data/soal.js` (12 soal KONTEN.md §4 + 1 cadangan) + `soal.test.js` (kunci = KONTEN.md)
- [x] `lib/periksa.js` (toleransi, miskonsepsi MK1–MK8), `lib/petunjuk.js`, `lib/langkahSoal.js` + tes
- [x] Arena: pilih level (terkunci berurutan), soal berlangkah ①–⑤ dengan fading per level, petunjuk bertingkat, bintang
- [x] `<KartuSoal>` penanda soal cerita (F10), pembahasan, refleksi

**Sprint 3 — Pelengkap (v0.5)**
- [x] Cek Kesiapan + Pengantar Lingkaran
- [x] M4 Contoh Terurai dengan fading (lengkap → sebagian → mandiri + pertanyaan perbandingan)
- [x] M6 Rangkuman & lencana
- [x] `ProgresContext` simpan progres; tombol "Mulai ulang" (di halaman Tentang)

**Sprint 4 — Backend & PWA (v1.0)**
- [x] Backend: model `LogEvent`, `POST /api/log/batch` (idempoten), endpoint peneliti ber-token, ekspor CSV, ringkasan + pytest (16 tes)
- [x] Frontend: Mode Peneliti (PIN, kode siswa/kelas), `logger.js` antrean IndexedDB + kirim ulang otomatis, unduh log JSON
- [x] `vite-plugin-pwa`: manifest, ikon (dibuat `scripts/buat_ikon.py`), prompt pembaruan
- [x] Uji ujung-ke-ujung lokal: aplikasi → proxy Vite → FastAPI → SQLite → ringkasan
- [ ] Uji mode pesawat di HP → log terkirim setelah online (perlu HTTPS/deploy agar service worker aktif)
- [ ] Deploy backend (Render/PythonAnywhere), set `CORS_ORIGINS`, `VITE_API_URL`, `VITE_PIN_PENELITI`
- [ ] (Opsional) `backend/scripts/rekap_log.py` (pandas) — saat ini rekap memakai `/api/peneliti/ringkasan` + CSV
- [ ] Audit: Lighthouse mobile ≥ 90, checklist DESAIN.md §8
- [ ] Revisi dari validasi ahli

## I — Implementation
| Tugas | Luaran |
|---|---|
| Uji coba terbatas (kelompok kecil 5–10 siswa) | Log, angket, catatan observasi |
| Uji coba lapangan (1 kelas) | Log, angket, kuesioner beban kognitif, (opsional) pre-posttest |
| Panduan singkat untuk guru (1 halaman) | PDF/halaman Tentang |

## E — Evaluation
| Jenis | Instrumen | Analisis |
|---|---|---|
| Formatif (tiap tahap) | Catatan revisi per sprint | Tabel revisi sebelum–sesudah |
| Validitas | Lembar ahli materi & media | Aiken's V / persentase (catat keterbatasan jumlah ahli) |
| Kepraktisan | Angket siswa & guru | Persentase kategori |
| Beban kognitif | Kuesioner IL/EL/GL | Deskriptif per dimensi |
| Data log | `/api/peneliti/export.csv` + `rekap_log.py` | Rata-rata petunjuk/soal, frekuensi MK per level |
| Keefektifan (opsional) | Tes literasi pre–post | N-gain / uji beda sesuai desain |

## Jejak Keputusan (Decision Log)
| Tanggal | Keputusan | Alasan/temuan |
|---|---|---|
| 2026-11-12 | Web PWA, bukan APK native | Mudah dibagikan lewat link, offline, sesuai kemampuan pengembang |
| 2026-11-12 | ~~Vanilla JS tanpa framework~~ → **React + Vite + PWA** | Permintaan pengembang; komponen (tabung, navigasi langkah) mudah dipakai ulang. Ukuran bundle tetap dijaga (≤ 150 KB gzip) |
| 2026-11-12 | **Backend Python (FastAPI + SQLite)** khusus log penelitian | Permintaan pengembang; data uji coba terkumpul terpusat untuk tahap Evaluation. Aplikasi tetap offline-first |
| 2026-11-12 | JavaScript, bukan TypeScript | Mengurangi hambatan bagi pengembang pemula |
| 2026-11-12 | **Grafik 3D interaktif dengan three.js** (React Three Fiber + drei) di M1, M2, Lab; SVG 2D sebagai fallback dan di Arena | Permintaan pengembang; DS01 "gambar tabung interaktif", IL01/K03 butuh melihat selimut → persegi panjang. Dibatasi aturan DESAIN.md §2.5 agar tidak menambah beban extraneous |
| 2026-11-12 | Jaring-jaring sebagai fitur inti | IL01, K03: bingung angka 2 dan bagian yang dihitung |
| 2026-11-12 | Tanpa timer, nyawa, leaderboard | DS03, EL03; menghindari kecemasan |
| 2026-11-12 | Petunjuk otomatis setelah 2 kali salah | DS02: "kalau salah beberapa kali, beri petunjuk" |
