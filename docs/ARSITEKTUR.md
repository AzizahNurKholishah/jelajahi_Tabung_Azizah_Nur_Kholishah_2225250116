# ARSITEKTUR — Rancangan Teknis
## Jelajah Tabung (React + three.js + PWA + Python)

## 1. Gambaran Umum

```
┌──────────────── HP Android (Chrome) ────────────────┐
│  Frontend: React + Vite + PWA + three.js (3D)        │
│  • Semua materi, soal, pemeriksa jawaban berjalan     │
│    di perangkat → tetap bisa dipakai OFFLINE          │
│  • Progres: localStorage                              │
│  • Antrean log: IndexedDB → dikirim saat online       │
└───────────────┬─────────────────────────────────────┘
                │ HTTPS  (JSON, /api/...)
┌───────────────▼─────────────────────────────────────┐
│  Backend: Python FastAPI + SQLite (SQLModel)          │
│  • Menerima log penggunaan (batch, idempoten)         │
│  • Dasbor & ekspor CSV untuk peneliti (pakai token)   │
└──────────────────────────────────────────────────────┘
```

Prinsip: **backend bukan syarat agar siswa bisa belajar**. Jika server mati atau HP offline, aplikasi tetap berjalan penuh dan log menunggu di antrean.

## 2. Keputusan Teknologi

| Lapisan | Pilihan | Alasan |
|---|---|---|
| UI | **React 18 + Vite** (JavaScript/JSX) | Komponen yang dapat dipakai ulang (tabung SVG, navigasi langkah); build kecil dan cepat |
| Routing | `react-router-dom` dengan **HashRouter** | Aman di GitHub Pages/Netlify tanpa konfigurasi rewrite; tombol back Android bekerja |
| State | React Context + `useReducer`, disimpan ke `localStorage` | Cukup untuk skala aplikasi ini; tanpa Redux |
| PWA | **`vite-plugin-pwa`** (Workbox) | Manifest, service worker, precache, dan prompt pembaruan otomatis |
| Antrean log offline | IndexedDB lewat pustaka kecil `idb-keyval` | Log tidak hilang saat offline |
| Grafik 3D | **three.js** lewat **`@react-three/fiber`** (R3F) + **`@react-three/drei`** (OrbitControls, Html label) | Tabung 3D yang bisa diputar, diketuk, dan dibuka menjadi jaring-jaring; R3F membuat scene three.js dapat ditulis sebagai komponen React |
| Grafik 2D | **SVG inline** | Cadangan bila WebGL tidak tersedia/HP lemah; ikon tabung kecil di Arena |
| Gaya | CSS biasa + **CSS Modules** + token di `tokens.css` | Tanpa Tailwind/UI kit agar ringan dan sesuai DESAIN.md |
| Uji frontend | **Vitest** (+ `@testing-library/react` untuk komponen penting) | Integrasi langsung dengan Vite |
| Backend | **Python 3.11+, FastAPI, Uvicorn** | API cepat, dokumentasi otomatis di `/docs` |
| Basis data | **SQLite** lewat **SQLModel** | Satu file, cukup untuk penelitian skala kelas |
| Analisis data | `pandas` (opsional, skrip di `backend/scripts/`) | Rekap log untuk bab hasil penelitian |
| Uji backend | **pytest** + `httpx` (TestClient) | Standar |
| Hosting frontend | Netlify / Vercel / GitHub Pages | Gratis, HTTPS |
| Hosting backend | Render / Railway / PythonAnywhere (paket gratis) | Catatan: paket gratis bisa "tidur", tetapi itu tidak masalah karena log memakai antrean |

**Dependensi frontend yang diizinkan:** `react`, `react-dom`, `react-router-dom`, `vite-plugin-pwa`, `idb-keyval`, `three`, `@react-three/fiber`, `@react-three/drei` (impor per fitur, jangan `import * as`); dev: `vite`, `@vitejs/plugin-react`, `vitest`, `@testing-library/react`, `jsdom`. Tambahan lain harus disetujui pengembang.

**Dependensi backend:** `fastapi`, `uvicorn[standard]`, `sqlmodel`, `pydantic-settings`; dev: `pytest`, `httpx`; opsional: `pandas`.

## 3. Struktur Folder (monorepo)

```
/
├── CLAUDE.md
├── README.md
├── docs/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js            # plugin react + VitePWA + proxy /api → :8000
│   ├── public/icons/             # icon-192.png, icon-512.png, maskable-512.png
│   └── src/
│       ├── main.jsx              # createRoot, HashRouter, registerSW
│       ├── App.jsx               # definisi rute
│       ├── styles/
│       │   ├── tokens.css        # warna & ukuran (DESAIN.md §2)
│       │   └── global.css
│       ├── lib/                  # LOGIKA MURNI — tanpa React/DOM, wajib diuji
│       │   ├── rumus.js
│       │   ├── angka.js
│       │   ├── periksa.js
│       │   ├── petunjuk.js
│       │   └── geometriTabung.js # matematika animasi buka tabung (diuji tanpa WebGL)
│       ├── data/                 # isi dari KONTEN.md
│       │   ├── materi.js
│       │   ├── contoh.js
│       │   └── soal.js
│       ├── state/
│       │   ├── ProgresContext.jsx  # progres, bintang, lencana (localStorage)
│       │   └── logger.js           # catatLog() → IndexedDB; kirimAntrean()
│       ├── api/
│       │   └── client.js         # fetch ke VITE_API_URL; timeout; tanpa throw ke UI
│       ├── three/                # SEMUA kode three.js di sini (chunk terpisah, lazy-load)
│       │   ├── Panggung3D.jsx    # <Canvas>: kamera, cahaya, OrbitControls terbatas, tombol reset
│       │   ├── Tabung3D.jsx      # alas, tutup, selimut sebagai mesh terpisah (sorot, onKetuk, progresBuka)
│       │   ├── SelimutLentur.js  # BufferGeometry selimut: lengkung ↔ datar (panjang busur tetap 2πr)
│       │   ├── GarisUkur3D.jsx   # garis r, d, t + label <Html>
│       │   ├── LabelBagian.jsx   # label teks menempel pada bagian (drei <Html>)
│       │   └── dukungWebGL.js    # deteksi WebGL & perangkat lemah → fallback 2D
│       ├── components/
│       │   ├── Tabung.jsx        # SVG 2D cadangan (prop sama dengan Tabung3D)
│       │   ├── JaringJaring.jsx  # SVG 2D cadangan animasi buka tabung
│       │   ├── PemilihBagian.jsx # tombol Alas/Tutup/Selimut/r/t di luar kanvas (alternatif ketuk 3D)
│       │   ├── SliderUkuran.jsx  # slider r dan t (Laboratorium Tabung)
│       │   ├── NavLangkah.jsx    # Kembali / Ulangi / Lanjut + titik progres
│       │   ├── InputAngka.jsx
│       │   ├── PilihSatuan.jsx
│       │   ├── KartuSoal.jsx     # kata/angka dapat ditandai (F10)
│       │   ├── Petunjuk.jsx
│       │   ├── Toast.jsx
│       │   └── LayarModul.jsx    # kerangka layar: bilah atas, area visual, teks, nav
│       ├── pages/
│       │   ├── Beranda.jsx
│       │   ├── CekKesiapan.jsx
│       │   ├── PengantarLingkaran.jsx
│       │   ├── KenaliTabung.jsx   # M1
│       │   ├── BukaTabung.jsx     # M2
│       │   ├── AsalRumus.jsx      # M3
│       │   ├── ContohTerurai.jsx  # M4
│       │   ├── arena/
│       │   │   ├── PilihLevel.jsx
│       │   │   ├── Soal.jsx       # langkah ①–④, petunjuk, miskonsepsi
│       │   │   └── Pembahasan.jsx # pembahasan + refleksi
│       │   ├── Rangkuman.jsx      # M6
│       │   └── Tentang.jsx        # + masuk Mode Peneliti (isi kode siswa)
│       └── __tests__/            # *.test.js(x) untuk Vitest
└── backend/
    ├── requirements.txt
    ├── requirements-dev.txt
    ├── .env.example              # PENELITI_TOKEN=..., DATABASE_URL=sqlite:///./data.db, CORS_ORIGINS=...
    ├── app/
    │   ├── main.py               # FastAPI(), CORS, include_router
    │   ├── config.py             # pydantic-settings
    │   ├── db.py                 # engine, get_session
    │   ├── models.py             # SQLModel: Sesi, LogEvent
    │   ├── schemas.py            # Pydantic request/response
    │   ├── deps.py               # cek token peneliti
    │   └── routers/
    │       ├── log.py            # endpoint publik (siswa)
    │       └── peneliti.py       # endpoint ber-token
    ├── scripts/
    │   └── rekap_log.py          # pandas: ringkasan per soal / per miskonsepsi
    └── tests/
        ├── test_log.py
        └── test_peneliti.py
```

## 4. Model Data

### 4.1 Soal (`frontend/src/data/soal.js`)
```js
{
  id: 'L2-2',
  level: 2,
  teks: 'Tabung tanpa tutup ...',
  tanda: ['jari-jari 7 cm', 'tinggi 15 cm', 'tanpa tutup'], // frasa penting (F10)
  diketahui: { r: 7, t: 15 },          // atau { d: 20, t: 30 }
  pi: '22/7',                          // '22/7' | '3.14'
  bagian: ['alas', 'selimut'],
  satuan: 'cm²',
  pengali: 1,                          // L3-4: 50
  hargaPerSatuan: null,                // L3-3: 25000
  langkahWajib: [1, 2, 3, 4],          // fading per level
  refleksi: { tanya: '...', pilihan: ['...'], tepat: 0 },
}
```
Kunci **tidak ditulis manual**: dihitung oleh `lib/rumus.js`. `soal.test.js` mencocokkannya dengan angka di KONTEN.md.

### 4.2 Progres (frontend, `localStorage` key `jelajahTabung.v1`)
```js
{ versi: 1, kodeSiswa: null, modulSelesai: [1,2], cekKesiapan: { skor: 3 },
  arena: { 'L1-1': { bintang: 3, selesai: true } }, lencana: [], pengaturan: { suara: false } }
```

### 4.3 Event log (frontend → backend)
```js
{ id: 'uuid-v4',               // dibuat di klien, menjadi kunci idempoten
  kodeSiswa: 'S01', kodeKelas: 'VIII-A',
  waktu: '2026-11-12T08:15:30Z',
  layar: 'arena', soal: 'L2-1', langkah: 1,
  aksi: 'jawab' | 'petunjuk' | 'ulangi' | 'refleksi' | 'selesai_modul',
  jawaban: '14', benar: false, miskonsepsi: 'MK1', tingkatPetunjuk: 0, durasiMs: 8200 }
```
Log hanya dicatat jika **kode siswa sudah diisi** di Mode Peneliti. Tanpa kode, aplikasi berjalan tanpa mengirim apa pun.

### 4.4 Tabel backend (SQLModel)
| Tabel | Kolom |
|---|---|
| `log_event` | `id` (PK, uuid dari klien), `kode_siswa`, `kode_kelas`, `waktu`, `layar`, `soal`, `langkah`, `aksi`, `jawaban`, `benar`, `miskonsepsi`, `tingkat_petunjuk`, `durasi_ms`, `diterima_pada` |

Tidak ada kolom nama, email, atau IP.

## 5. API Backend

| Metode | Path | Akses | Fungsi |
|---|---|---|---|
| GET | `/api/health` | publik | Cek server hidup |
| POST | `/api/log/batch` | publik (validasi format kode `^S\d{2,3}$`) | Terima ≤ 200 event; `INSERT OR IGNORE` berdasarkan `id` → aman dikirim ulang. Balas `{diterima, duplikat}` |
| GET | `/api/peneliti/log?kode_siswa=&kode_kelas=` | header `X-Peneliti-Token` | Daftar event |
| GET | `/api/peneliti/export.csv` | token | CSV pemisah `;`, UTF-8 BOM (terbuka benar di Excel Indonesia) |
| GET | `/api/peneliti/ringkasan` | token | Per soal: jumlah percobaan, % benar, rata-rata petunjuk, frekuensi tiap MK |

- CORS hanya untuk domain frontend (`CORS_ORIGINS`).
- Batas ukuran body ±256 KB.
- Dokumentasi interaktif otomatis: `http://localhost:8000/docs`.

## 6. Logika Inti (frontend `lib/`)

```js
// rumus.js
const PI = { '22/7': 22 / 7, '3.14': 3.14 };
export const jariJari = ({ r, d }) => r ?? d / 2;
export const luasLingkaran = (r, pi) => PI[pi] * r * r;
export const luasSelimut = (r, t, pi) => 2 * PI[pi] * r * t;
export const luasPermukaan = ({ r, t, pi, bagian }) => /* jumlah bagian yang dipilih */;
export const kunci = (soal) => /* luasPermukaan × pengali × (hargaPerSatuan ?? 1), dibulatkan 2 desimal */;
```
```js
// periksa.js
periksaJawaban(nilai, kunci)      // benar jika |nilai − kunci| ≤ max(0,01; 0,5% × kunci)
deteksiMiskonsepsi(nilai, soal)   // hitung nilai pola MK1–MK8 (KONTEN.md §5), cocokkan → 'MK1' | null
// petunjuk.js
tingkatPetunjuk(jumlahSalah, jumlahMinta) // = min(2, max(jumlahSalah − 1, jumlahMinta))
```

**Parsing angka (`angka.js`)**
1. Hapus spasi dan `Rp`.
2. Ada koma → titik = ribuan (dihapus), koma = desimal (`2.992,5` → 2992,5).
3. Tanpa koma, satu titik diikuti tepat 3 digit (`2.992`) → ambigu → kandidat `[2992, 2.992]`; dianggap benar bila salah satu cocok.
4. Tanpa koma, titik diikuti 1–2 digit (`11.88`) → desimal.
5. Selain itu → "Tulis jawaban dengan angka, ya."

Tampilan: `Intl.NumberFormat('id-ID')` → `2.992`, `11,88`.

## 7. Grafik 3D (three.js)

### 7.1 Komponen
```jsx
<Panggung3D>                               // lazy: const Panggung3D = lazy(() => import('../three/Panggung3D'))
  <Tabung3D r={7} t={10}
            sorot={['selimut']}            // bagian yang diberi warna penuh; lainnya abu-abu muda
            onKetuk={(bagian) => ...}      // raycast bawaan R3F (onPointerDown pada mesh)
            progresBuka={0..1}             // 0 = tabung utuh, 1 = jaring-jaring datar
            tampilkan={{ alas: true, tutup: false, selimut: true }} />  // mis. ember tanpa tutup
  <GarisUkur3D r t tampil={['r','t']} />
</Panggung3D>
```
Props `Tabung3D` sama dengan `Tabung` (SVG) sehingga halaman bisa memilih 3D atau 2D tanpa mengubah logika.

### 7.2 Geometri
- **Alas & tutup:** `CircleGeometry(r, 48)`, materi dua sisi.
- **Selimut (`SelimutLentur.js`):** `PlaneGeometry(2πr, t, 48, 1)` yang verteksnya dihitung ulang dari parameter `k` (1 = tergulung, 0 = datar):
  - Panjang busur `s` tiap kolom verteks tetap; jari-jari lengkung `R = r / k`; sudut `θ = s / R`.
  - Posisi: `x = R·sin θ`, `z = R·(1 − cos θ)` (relatif terhadap garis sambungan). Saat `k → 0` gunakan posisi datar `x = s, z = 0`.
  - **Panjang selimut selalu 2πr** selama animasi. Ini penting secara pedagogis: siswa melihat bahwa panjang persegi panjang = keliling alas.
- **Urutan animasi `progresBuka`:**
  - 0–0,3: tutup berputar pada engsel di tepi atas selimut, alas berputar pada engsel di tepi bawah selimut, sampai tegak lurus.
  - 0,3–0,9: selimut "dibuka" (`k` dari 1 → 0); alas dan tutup ikut bergerak menempel pada titik sambungnya.
  - 0,9–1: kamera bergerak ke tampak depan sehingga jaring-jaring terlihat datar seperti di buku.
- Fungsi interpolasi murni (`posisiVerteks(s, y, k, r)`, `sudutEngsel(p)`) ditaruh di `lib/geometriTabung.js` agar bisa diuji Vitest tanpa WebGL (mis. uji: jarak busur ujung ke ujung = 2πr untuk semua `k`).

### 7.3 Tampilan & interaksi
- Materi `MeshStandardMaterial` matte (`roughness 0.8`, `metalness 0`); warna dari token (dibaca dengan `getComputedStyle` saat mount, jangan hardcode hex).
- Cahaya: 1 `ambientLight` + 1 `directionalLight`. **Tanpa bayangan, tekstur, environment map, atau post-processing.**
- Garis tepi tipis (`EdgesGeometry`) di tepi alas/tutup agar bentuk terbaca jelas walau warnanya mirip.
- `OrbitControls`: putar dengan 1 jari, zoom dengan cubit; `enablePan=false`, `minPolarAngle` 20° dan `maxPolarAngle` 110°, zoom 0,7–1,6×; **tanpa auto-rotate**. Tombol "↺ Posisi awal" di pojok kanvas.
- Ketuk bagian → `sorot` berubah dan label muncul **menempel di bagian itu** (drei `<Html>`, teks 16px, latar putih semi-transparan).
- Animasi buka dikendalikan oleh slider (state React), bukan timeline otomatis. Transisi sorot ≤ 300 ms.
- `prefers-reduced-motion`: perubahan sorot dan kamera langsung tanpa tween; slider tetap berfungsi.

### 7.4 Kinerja & fallback
- `<Canvas frameloop="demand" dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'low-power' }}>`: render hanya saat ada perubahan, sehingga hemat baterai.
- Segmen geometri: 48 (turun ke 24 pada perangkat lemah).
- Kanvas dilepas (unmount) saat meninggalkan halaman; `dispose` geometri/materi.
- `dukungWebGL.js`: jika WebGL tidak ada, `navigator.hardwareConcurrency ≤ 2`, `deviceMemory ≤ 2`, atau FPS awal < 20 → otomatis memakai SVG 2D. Pilihan manual "Tampilan 2D/3D" disimpan di pengaturan.
- Chunk 3D di-*lazy-load* hanya di M1, M2, dan Laboratorium, tetapi tetap di-precache PWA sehingga bisa dipakai offline.
- Tampilkan kerangka (skeleton) bertuliskan "Menyiapkan tabung…" saat chunk dimuat.

### 7.5 Aksesibilitas 3D
- Kanvas diberi `role="img"` dan `aria-label` yang berubah sesuai bagian yang disorot.
- `<PemilihBagian>` (tombol HTML ≥ 48px di bawah kanvas) menjadi alternatif mengetuk objek 3D. Tombol ini juga membantu siswa yang kesulitan mengetuk garis r/t yang tipis.
- Kanvas memakai `touch-action: none`; layar materi tidak bisa di-scroll sehingga tidak ada konflik gestur.

### 7.6 SVG 2D (cadangan & Arena)
- `<Tabung>` dan `<JaringJaring>` SVG dengan API props yang sama, `viewBox` responsif, dan warna dari CSS variable.
- Arena memakai SVG 2D kecil (bukan 3D) agar fokus siswa ada pada soal dan HP tidak cepat panas.

## 8. PWA & Offline
- `vite-plugin-pwa` dengan `registerType: 'prompt'` → toast "Versi baru tersedia — muat ulang".
- Precache semua aset build. Panggilan `/api/*` **tidak** di-cache (network-only); kegagalan ditangani oleh antrean log.
- `logger.kirimAntrean()` dipanggil saat aplikasi dibuka, saat event `online`, dan setiap 60 detik ketika aplikasi aktif. Kirim per batch 100; hapus dari antrean hanya setelah server membalas 200.
- Manifest: `name: "Jelajah Tabung"`, `display: "standalone"`, `orientation: "portrait"`, `lang: "id"`, `theme_color` = `--c-aksen`.

## 9. Konfigurasi & Lingkungan
| Variabel | Lokasi | Contoh |
|---|---|---|
| `VITE_API_URL` | `frontend/.env` | `/api` (dev, lewat proxy) atau `https://jelajah-tabung-api.onrender.com/api` |
| `PENELITI_TOKEN` | `backend/.env` | string acak panjang; **jangan di-commit** |
| `DATABASE_URL` | `backend/.env` | `sqlite:///./data.db` |
| `CORS_ORIGINS` | `backend/.env` | `http://localhost:5173,https://jelajah-tabung.netlify.app` |

`.env`, `data.db`, `.venv/`, `node_modules/`, dan `dist/` masuk `.gitignore`.

## 10. Menjalankan di Windows (pengembangan)

```powershell
# Backend
cd backend
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000

# Frontend (terminal lain)
cd frontend
npm install
npm run dev -- --host      # --host agar bisa dibuka dari HP di Wi-Fi yang sama
```
Coba di HP: buka `http://<IP-laptop>:5173`. Catatan: service worker PWA hanya aktif di `localhost` atau HTTPS, jadi uji fitur "pasang/offline" lewat `npm run build && npm run preview` di laptop atau setelah deploy.

## 11. Kinerja
- Anggaran: **bundle awal** (tanpa 3D) ≤ 150 KB gzip; **chunk 3D** (three + R3F + drei) ≤ 300 KB gzip; CSS ≤ 20 KB; tanpa font web, model `.glb`, atau tekstur. Periksa dengan `npx vite-bundle-visualizer`.
- Pecah kode per rute (`React.lazy`) untuk Panggung3D, Arena, dan halaman Peneliti.
- Target 3D: ≥ 30 FPS saat diputar di HP Android menengah (RAM 3 GB); diukur dengan `r3f-perf` hanya saat pengembangan (jangan masuk build produksi).
- Uji Lighthouse (mode mobile): Performance, Accessibility, Best Practices, PWA ≥ 90.

## 12. Deploy
1. **Backend** → Render (Web Service, Python): build `pip install -r requirements.txt`, start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Isi env. Catatan: disk paket gratis bisa ter-reset; **ekspor CSV setelah setiap sesi uji coba** atau gunakan disk persisten/PythonAnywhere.
2. **Frontend** → Netlify/Vercel: base `frontend`, build `npm run build`, publish `frontend/dist`, env `VITE_API_URL`.
3. Uji di HP: buka URL → "Tambahkan ke layar utama" → mode pesawat → kerjakan soal → matikan mode pesawat → cek log masuk di `/api/peneliti/ringkasan`.
