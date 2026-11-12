# PRD — Product Requirements Document
## "Jelajah Tabung": Aplikasi Web Belajar Luas Permukaan Tabung

| Item | Isi |
|---|---|
| Nama kerja | **Jelajah Tabung** (boleh diganti) |
| Jenis produk | Aplikasi web progresif (PWA), *mobile-first*, dioptimalkan untuk browser Android (Chrome) |
| Teknologi | Frontend React + Vite + PWA, grafik 3D interaktif dengan three.js (React Three Fiber); backend Python (FastAPI + SQLite) untuk log penelitian (lihat ARSITEKTUR.md) |
| Materi | Luas Permukaan Tabung — Matematika SMP kelas VIII |
| Pengguna sasaran | Siswa SMP kelas VIII (uji coba juga dengan siswa kelas IX) |
| Model pengembangan | ADDIE — dokumen ini adalah luaran tahap **Analysis → Design** |
| Landasan teori | Cognitive Load Theory (Sweller; Leppink dkk., 2013; Klepsch dkk., 2017), prinsip multimedia Mayer, literasi matematika (PISA: *formulate – employ – interpret*) |
| Pengembang | Azizah Nur Kholishah (NIM 2225250116) |
| Versi dokumen | 0.1 — 12 November 2026 |

---

## 1. Latar Belakang

Wawancara mendalam semiterstruktur dengan informan **S01** (siswa kelas IX, 06/11/2026, ±30 menit, dengan satu soal pemicu) menunjukkan bahwa kesulitan belajar luas permukaan tabung bersumber dari tiga jenis beban kognitif:

| Jenis beban | Temuan utama (kode wawancara) |
|---|---|
| **Intrinsic (IL)** | Tidak paham asal angka **2** pada rumus, sehingga hanya menghafal (IL01). Lupa mengubah **diameter → jari-jari** (IL02). Prasyarat **lingkaran** (luas & keliling) belum kuat (IL03). Kesulitan naik pada **soal cerita**, terutama **tabung tanpa tutup** (IL04). Salah memahami soal, salah memilih rumus, salah hitung (IL05). Bingung **bagian permukaan mana yang dihitung** (K03). |
| **Extraneous (EL)** | Guru menulis rumus dan angka tanpa menjelaskan alasannya (EL01). Teks panjang, gambar kecil dan **jauh dari penjelasan** (EL02). Terlalu banyak tulisan/gambar membuat hilang fokus (EL03). Penjelasan **terlalu cepat**, beberapa langkah digabung (EL04). Sulit **menemukan informasi penting** di soal cerita (EL05). |
| **Germane (GL)** | Urutan belajar yang disukai: **gambar → contoh soal → latihan sendiri** (GL01). Memeriksa ulang rumus, hitungan, dan satuan (GL02). Terbantu **petunjuk langkah demi langkah** dan contoh soal mirip (GL03). Menjelaskan ke teman membuat ia berpikir "kenapa langkahnya begitu" (GL04). Membandingkan soal baru dengan contoh lama (GL05). |
| **Usulan siswa (DS)** | Gambar tabung **interaktif**, penjelasan rumus, latihan seperti **permainan** (DS01). Rumus dan contoh dijelaskan **perlahan**, latihan dicoba sendiri; **petunjuk muncul setelah beberapa kali salah** (DS02). Tampilan **sederhana**, tidak banyak tulisan/animasi tak relevan (DS03). |

## 2. Rumusan Masalah Produk

Siswa menghafal rumus luas permukaan tabung tanpa memahami asal-usulnya. Akibatnya mereka gagal ketika konteks soal berubah (tabung tanpa tutup, diameter diketahui, soal cerita). Media yang ada (buku paket, papan tulis) menambah beban extraneous: teks dan gambar terpisah, tempo tidak bisa diatur, dan langkah-langkah digabung.

## 3. Tujuan

### 3.1 Tujuan pembelajaran (dicapai siswa)
1. Menyebutkan dan menunjuk unsur tabung: alas, tutup, selimut, jari-jari (r), diameter (d), tinggi (t).
2. Menjelaskan bahwa jaring-jaring tabung terdiri atas 2 lingkaran dan 1 persegi panjang yang panjangnya = keliling alas (2πr) dan lebarnya = tinggi (t).
3. Menurunkan rumus L = 2πr² + 2πrt = 2πr(r + t) dan menjelaskan **dua makna angka 2** (dua lingkaran; 2πr sebagai keliling).
4. Menentukan bagian permukaan yang dihitung sesuai konteks: tertutup, tanpa tutup, hanya selimut.
5. Menyelesaikan masalah kontekstual (literasi matematika): merumuskan masalah dari situasi nyata, menghitung, lalu menafsirkan hasil (misalnya biaya cat, banyak bahan).

### 3.2 Tujuan produk (diukur peneliti)
- Menurunkan beban extraneous: siswa tidak perlu bolak-balik layar untuk mencocokkan gambar dan teks.
- Mengelola beban intrinsic: konsep dipecah per langkah dan prasyarat dicek lebih dulu.
- Mendorong beban germane: refleksi, contoh terurai yang bantuannya dikurangi bertahap, dan variasi konteks.

## 4. Persona

**Raka, 13 tahun, kelas VIII** (komposit dari temuan S01; bukan identitas informan)
- Ponsel Android kelas menengah ke bawah (layar 5,5–6,5", RAM 2–4 GB), kuota terbatas, sinyal kadang lemah.
- Ingat bentuk tabung, tetapi rumusnya "agak lupa"; sering lupa membagi diameter.
- Lebih mudah paham lewat gambar; cepat kehilangan fokus jika layar penuh tulisan.
- Suka permainan, tetapi mudah cemas kalau terus-menerus salah.

**Bu Guru (pengguna sekunder):** ingin memakai aplikasi di kelas atau sebagai tugas rumah, tanpa instalasi rumit.

**Peneliti (Azizah):** membutuhkan log penggunaan (jumlah petunjuk, kesalahan per langkah) untuk tahap Evaluation.

## 5. Ruang Lingkup

### 5.1 Termasuk (MVP)
| ID | Fitur | Dasar temuan |
|---|---|---|
| F0 | **Cek Kesiapan (diagnostik prasyarat):** jari-jari↔diameter, luas & keliling lingkaran; hasilnya menyarankan modul pengantar | IL02, IL03 |
| F1 | **Kenali Tabung (3D):** tabung 3D yang dapat diputar; ketuk bagian → bagian itu disorot dan diberi label yang menempel padanya | K03, GL01, DS01 |
| F2 | **Buka Tabung (3D):** slider yang "membuka" tabung 3D menjadi jaring-jaring secara bertahap; panjang selimut tetap = keliling alas, diperlihatkan dengan alas yang menggelinding | IL01, EL01, DS01 |
| F2b | **Laboratorium Tabung (3D):** slider r dan t mengubah tabung dan luas tiap bagian secara langsung, disertai pertanyaan pemantik | GL01, GL02, literasi |
| F2c | **Fallback 2D:** SVG otomatis dipakai bila WebGL tidak tersedia/HP lemah, dengan sakelar manual 2D/3D | NFR-06 |
| F3 | **Asal Rumus (langkah demi langkah):** 1 langkah per layar dengan tombol **Kembali – Ulangi – Lanjut**; tidak ada auto-play | IL01, EL01, EL04, DS02 |
| F4 | **Contoh Terurai (*worked example*) dengan *fading*:** contoh 1 lengkap → contoh 2 sebagian kosong → contoh 3 siswa mengisi sendiri | GL01, GL03, GL05 |
| F5 | **Arena Latihan (game):** 3 level (Mudah, Sedang, Sulit), bintang, lencana; level berikutnya terbuka setelah level sebelumnya selesai | DS01, IL04 |
| F6 | **Penyelesaian berlangkah (scaffold):** ① tandai informasi penting → ② tentukan r dan t → ③ pilih bagian yang dihitung → ④ hitung → ⑤ satuan | IL02, IL05, EL05 |
| F7 | **Petunjuk bertingkat:** salah ke-1 → umpan balik singkat; salah ke-2 → petunjuk konsep; salah ke-3 → langkah diperlihatkan. Tombol "Minta petunjuk" selalu ada | DS02, GL03 |
| F8 | **Umpan balik berbasis miskonsepsi:** jawaban salah yang khas dikenali (diameter dipakai sebagai r, tutup ikut dihitung pada tabung tanpa tutup, satuan salah) | IL02, IL04, IL05 |
| F9 | **Pembahasan & Refleksi:** setelah soal, tampilkan rumus–langkah–satuan, lalu satu pertanyaan "Mengapa…?" (pilihan alasan) | GL02, GL04 |
| F10 | **Penanda soal cerita:** siswa mengetuk kata/angka penting dalam soal untuk menandainya (r/d, t, bagian yang ditanya) | EL05 |
| F11 | **Progres & simpan lokal:** progres tersimpan di perangkat (tanpa akun siswa) | — |
| F12 | **Mode Peneliti:** di HP, peneliti mengisi kode siswa (mis. S01) dan kode kelas; log dikirim ke server Python (dengan antrean saat offline). Di server, dasbor ringkasan dan ekspor CSV dilindungi token | Evaluation ADDIE |
| F13 | **PWA offline:** bisa "Tambahkan ke layar utama" dan tetap berjalan tanpa internet setelah kunjungan pertama | Konteks pengguna |

### 5.2 Tidak termasuk (di luar MVP)
- Akun/login siswa, papan peringkat antarsiswa (dapat menimbulkan kecemasan). Server hanya dipakai untuk log penelitian, bukan untuk menjalankan materi.
- Volume tabung, bangun ruang lain (kerucut, bola).
- Animasi dekoratif, maskot berbicara, musik latar (bertentangan dengan DS03/EL03).
- Aplikasi native (APK). Bila perlu, PWA bisa dibungkus menjadi APK dengan TWA/Bubblewrap pada tahap lanjut.

## 6. Alur Belajar Utama

```
Beranda
  └─ Cek Kesiapan (F0) ── lemah? ──► Pengantar Lingkaran (mini, 3 layar)
        │
        ▼
  1. Kenali Tabung (F1)
  2. Buka Tabung (F2)
  3. Asal Rumus (F3)
  4. Contoh Terurai (F4)
  5. Arena Latihan (F5–F10)
        Level 1 Mudah  : tabung tertutup, r diketahui
        Level 2 Sedang : diameter diketahui / tanpa tutup / hanya selimut
        Level 3 Sulit  : soal cerita kontekstual (literasi), multi-langkah
  6. Rangkuman & Lencana
```

Urutan ini mengikuti preferensi S01: **gambar → contoh → latihan sendiri** (GL01). Modul boleh diulang kapan saja. Modul 1–4 terbuka bebas; Arena terkunci per level.

## 7. Kebutuhan Fungsional (ringkas)

| Kode | Kebutuhan |
|---|---|
| FR-01 | Setiap layar materi memuat **satu ide utama** dengan maksimal ±40 kata teks. |
| FR-02 | Label teks diletakkan **menempel/berdekatan** dengan bagian gambar yang dijelaskan (bukan di paragraf terpisah). |
| FR-03 | Navigasi materi: Kembali, Ulangi, Lanjut. Tidak ada perpindahan otomatis. |
| FR-04 | Input angka menerima koma maupun titik desimal (`11,88` = `11.88`). |
| FR-05 | Pemeriksa jawaban memakai toleransi pembulatan (±0,5% atau ±0,01 untuk hasil desimal) dan menerima π = 22/7 atau 3,14 bila soal tidak menentukan. |
| FR-06 | Satuan (cm², m²) dipilih terpisah dari angka dan diperiksa tersendiri. |
| FR-07 | Petunjuk bertingkat muncul otomatis setelah 2 kali salah pada langkah yang sama; tombol "Minta petunjuk" tersedia sejak awal. |
| FR-08 | Setiap jawaban salah yang cocok dengan pola miskonsepsi menampilkan umpan balik khusus (lihat KONTEN.md §5). |
| FR-09 | Bintang per soal: ★★★ tanpa petunjuk, ★★ dengan 1 petunjuk, ★ dengan ≥2 petunjuk. Tidak ada pengurangan nyawa atau batas waktu. |
| FR-10 | Progres dan bintang disimpan di `localStorage`; ada tombol "Mulai ulang progres". |
| FR-11 | Bila kode siswa diisi (Mode Peneliti), setiap aksi dicatat: kode siswa, kode kelas, waktu, id soal, langkah, jawaban, benar/salah, miskonsepsi, tingkat petunjuk, durasi. Log disimpan di antrean IndexedDB lalu dikirim ke backend Python saat online. |
| FR-12 | Aplikasi tetap berfungsi penuh offline setelah kunjungan pertama (service worker). Server mati tidak boleh mengganggu siswa. |
| FR-13 | Backend menyediakan `/api/peneliti/ringkasan` dan `/api/peneliti/export.csv` (ber-token) untuk analisis tahap Evaluation. |

## 8. Kebutuhan Non-Fungsional

| Kode | Kebutuhan | Target |
|---|---|---|
| NFR-01 | Performa | Bundle awal ≤ 150 KB gzip, chunk 3D ≤ 300 KB gzip (lazy-load + precache); interaktif < 3 detik pada 4G lambat; 3D ≥ 30 FPS di HP menengah |
| NFR-02 | Responsif | Nyaman di lebar 360–430 px (potret); tetap layak di tablet/desktop |
| NFR-03 | Aksesibilitas | Target sentuh ≥ 48×48 px; kontras teks ≥ 4.5:1; warna tidak menjadi satu-satunya penanda (selalu ada label) |
| NFR-04 | Bahasa | Bahasa Indonesia baku yang ramah siswa; istilah konsisten (lihat DESAIN.md §7) |
| NFR-05 | Privasi | Tanpa nama asli (hanya kode S01/kelas), tanpa pelacak pihak ketiga, tanpa IP; data hanya dikirim bila kode siswa diisi; HTTPS; endpoint peneliti ber-token |
| NFR-06 | Kompatibilitas | Chrome Android ≥ versi 100; Samsung Internet; WebGL 1/2 untuk 3D, dengan fallback SVG 2D bila tidak tersedia |
| NFR-07 | Ketepatan isi | Semua kunci jawaban diverifikasi dengan uji otomatis (Vitest); API diuji dengan pytest |
| NFR-08 | Ketahanan | Log tidak hilang saat offline/server tidur (antrean + pengiriman idempoten) |

## 9. Matriks Keterlacakan: Temuan → Fitur → Uji

Melengkapi Matriks H pada dokumen wawancara (baris terakhir pada dokumen asli belum memiliki keputusan fitur).

| Temuan | Jenis | Fitur | Cara menguji (Evaluation) |
|---|---|---|---|
| Bingung bagian yang dihitung dan asal angka 2 | IL | F1, F2, F3 | Siswa menunjuk bagian tabung dan menjelaskan asal rumus dengan bahasanya sendiri |
| Lupa d → r, prasyarat lingkaran lemah | IL | F0, F6 langkah ②, F8 | Skor Cek Kesiapan; frekuensi miskonsepsi "d sebagai r" di log |
| Soal cerita dan tanpa tutup sulit | IL | F5 level bertingkat, F6 langkah ③ | Ketepatan langkah ③ per level |
| Rumus ditulis tanpa alasan | EL | F3, F4 | Siswa menjelaskan alasan memilih rumus (pertanyaan refleksi F9) |
| Teks panjang, gambar jauh | EL | FR-01, FR-02 | Observasi: apakah siswa scroll/bolak-balik layar |
| Tempo terlalu cepat, langkah digabung | EL | F3 (Kembali/Ulangi/Lanjut) | Log jumlah "Ulangi"; wawancara pasca-uji |
| Sulit menemukan info penting | EL | F10, F6 langkah ① | Ketepatan penandaan informasi |
| Terbantu gambar dan contoh | GL | F1, F2, F4 | Angket respons siswa |
| Memeriksa ulang rumus dan satuan | GL | F9, FR-06 | Siswa memeriksa jawaban salah dan menunjukkan letak kesalahan |
| Terbantu petunjuk bertahap | GL | F7 | Jumlah petunjuk per soal turun dari soal ke soal |
| Menjelaskan ke teman | GL | F9 refleksi | Kualitas pilihan alasan |
| Membandingkan dengan contoh lama | GL | F4 fading, F5 variasi konteks | Ketepatan soal konteks baru di level 3 |
| Ingin latihan seperti permainan | Preferensi | F5 bintang, lencana, level | Penyelesaian level; angket |
| Ingin tampilan sederhana | EL | DESAIN.md (palet terbatas, tanpa animasi dekoratif) | Angket kepraktisan/kemudahan navigasi; uji ahli media |

## 10. Indikator Keberhasilan (tahap Evaluation)

- **Validitas:** uji ahli materi dan ahli media (skala Likert; dapat dideskripsikan dengan Aiken's V).
- **Kepraktisan:** angket respons siswa dan guru (mis. kategori "praktis" ≥ 70%).
- **Beban kognitif:** kuesioner adaptasi Klepsch dkk. (2017) atau Leppink dkk. (2013) sesudah pemakaian, dibandingkan antarkelompok bila desain penelitian memungkinkan.
- **Data log:** rata-rata petunjuk per soal menurun; kemunculan miskonsepsi "d sebagai r" menurun dari level 1 ke level 3.
- **Keefektifan (opsional):** pretest–posttest literasi matematika dengan soal yang **berbeda** dari soal pemicu wawancara.

## 11. Asumsi, Risiko, dan Catatan Metodologis

| Hal | Catatan / mitigasi |
|---|---|
| Informan baru 1 (S01), padahal pedoman meminta minimal 2 | Lakukan wawancara S02 sebelum desain final; perbarui matriks bila ada temuan berbeda (simpan kasus yang tidak cocok untuk triangulasi). |
| Pedoman wawancara belum tervalidasi | Sebutkan sebagai keterbatasan; ikuti langkah validasi bagian I pada dokumen wawancara. |
| Ponsel siswa lemah/kuota terbatas | React tanpa UI kit, pemecahan kode per rute, anggaran bundle, PWA offline. |
| 3D bisa menambah beban extraneous (bingung memutar, tampilan ramai) dan berat di HP murah | Aturan 3D di DESAIN.md §2.5 (matte, tanpa putar otomatis, tombol posisi awal, sudut dibatasi); 3D hanya di M1/M2/Lab; fallback 2D; uji FPS di HP sungguhan |
| Gamifikasi bisa menjadi beban extraneous | Tanpa timer, tanpa nyawa; efek hanya pada umpan balik benar/salah dan durasinya < 1 detik. |
| Server gratis "tidur" atau disk ter-reset | Antrean log di HP; ekspor CSV dari server setelah tiap sesi uji coba. |
| Data siswa dikirim ke server | Persetujuan orang tua/siswa sebelum mengisi kode; hanya kode, tanpa nama; token untuk akses peneliti. |

## 12. Rilis

| Rilis | Isi |
|---|---|
| v0.1 (prototipe) | F1, F2, F3, Level 1 — untuk uji keterbacaan 1–2 siswa |
| v0.5 (validasi ahli) | Semua modul MVP, bank soal lengkap |
| v1.0 (uji coba lapangan) | Perbaikan dari ahli + Mode Peneliti + backend log Python + PWA offline |
