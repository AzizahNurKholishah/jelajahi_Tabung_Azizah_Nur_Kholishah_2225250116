# DESAIN — Desain Instruksional & Antarmuka
## Jelajah Tabung

Dokumen ini adalah luaran tahap **Design** ADDIE: bagaimana temuan beban kognitif diterjemahkan menjadi keputusan tampilan dan interaksi.

---

## 1. Prinsip Desain (dari Cognitive Load Theory & Mayer)

| Prinsip | Artinya di aplikasi | Mengatasi |
|---|---|---|
| **Koherensi** | Tidak ada hiasan, musik, maskot, atau animasi yang tidak menjelaskan materi | EL03, DS03 |
| **Pensinyalan (*signaling*)** | Warna tetap untuk tiap bagian tabung (alas, tutup, selimut, r, t) dipakai di gambar, rumus, dan soal | K03, IL01 |
| **Kedekatan spasial** | Label dan penjelasan menempel pada bagian gambar; rumus berada di bawah gambar dalam satu layar tanpa scroll | EL02 |
| **Segmentasi** | Satu langkah per layar; siswa yang menentukan kapan lanjut | EL04 |
| **Pra-pelatihan** | Unsur tabung dan konsep lingkaran dikenalkan sebelum rumus | IL03 |
| **Contoh terurai → fading** | Contoh lengkap, lalu sebagian kosong, lalu mandiri | GL01, GL03, GL05 |
| **Penjelasan diri (*self-explanation*)** | Pertanyaan "Mengapa…?" setelah soal | GL04 |
| **Bantuan sesuai kebutuhan** | Petunjuk bertingkat dan umpan balik berbasis miskonsepsi | DS02 |

**Aturan emas:** setiap elemen di layar harus menjawab "Apakah ini membantu siswa memahami luas permukaan tabung?" Jika tidak, hapus.

## 2. Sistem Visual

### 2.1 Warna (token CSS)

Warna bagian tabung adalah **kode makna** dan tidak boleh dipakai untuk hal lain.

| Token | Hex | Dipakai untuk |
|---|---|---|
| `--c-alas` | `#2563EB` (biru) | Alas, πr² alas |
| `--c-tutup` | `#059669` (hijau) | Tutup, πr² tutup |
| `--c-selimut` | `#EA580C` (oranye) | Selimut, 2πrt |
| `--c-jari` | `#DB2777` (magenta) | Jari-jari r, diameter d |
| `--c-tinggi` | `#7C3AED` (ungu) | Tinggi t |
| `--c-teks` | `#1F2937` | Teks utama |
| `--c-teks-2` | `#6B7280` | Teks sekunder |
| `--c-latar` | `#FFFFFF` | Latar |
| `--c-latar-2` | `#F3F4F6` | Kartu/panel |
| `--c-benar` | `#16A34A` | Umpan balik benar (selalu disertai ikon ✓ dan teks) |
| `--c-salah` | `#DC2626` | Umpan balik salah (selalu disertai ikon dan teks; tidak berkedip) |
| `--c-aksen` | `#2563EB` | Tombol utama |

- Selain warna, setiap bagian tabung selalu diberi **label teks** (aman untuk buta warna).
- Mode gelap tidak termasuk MVP (menjaga kesederhanaan).

### 2.2 Tipografi
- Font sistem: `system-ui, "Segoe UI", Roboto, sans-serif` (tanpa unduhan font, hemat kuota).
- Teks isi 18px, judul layar 22px, rumus 20–24px. Tinggi baris 1.5.
- Rumus ditulis dengan HTML+CSS biasa (mis. `2πr<sup>2</sup>`), tanpa MathJax/KaTeX.

### 2.3 Tata letak (*mobile-first*, potret 360–430 px)

```
┌────────────────────────────┐
│ ←  Judul Modul      2 / 6  │  ← bilah atas: kembali + posisi langkah
├────────────────────────────┤
│                            │
│     [ AREA VISUAL / SVG ]  │  ← ±50% tinggi layar
│     label menempel gambar  │
│                            │
├────────────────────────────┤
│ Teks penjelasan ≤ 40 kata  │
│ Rumus berwarna             │
├────────────────────────────┤
│ [Kembali] [Ulangi] [Lanjut]│  ← zona jempol, tombol ≥ 48px
└────────────────────────────┘
```

- Tidak ada scroll pada layar materi (F1–F3). Layar soal boleh scroll, tetapi tombol aksi menempel (*sticky*) di bawah.
- Jarak tepi 16px; jarak antarelemen kelipatan 8px.

### 2.4 Ikon dan gerak
- Ikon SVG inline sederhana (garis), tanpa pustaka ikon.
- Gerak hanya untuk **makna**: membuka jaring-jaring, menyorot bagian, transisi benar/salah (≤ 300 ms).
- Hormati `prefers-reduced-motion`: animasi diganti perubahan langsung.

### 2.5 Aturan grafik 3D (agar 3D membantu, bukan menambah beban)
3D dipakai karena tabung adalah bangun ruang. Siswa perlu melihat bahwa selimut melengkung lalu menjadi persegi panjang (K03, IL01, DS01). Namun 3D yang "ramai" justru menambah beban extraneous (EL03, DS03). Karena itu:

| Aturan | Alasan |
|---|---|
| Tampilan **matte dan polos**: warna token, tanpa tekstur, bayangan, pantulan, atau latar pemandangan | Koherensi; fokus pada bentuk |
| Bagian yang tidak sedang dibahas berwarna **abu-abu muda transparan** (opacity 0,25) | Pensinyalan |
| **Tanpa putar otomatis.** Siswa memutar sendiri; tombol "↺ Posisi awal" selalu ada | Kontrol oleh siswa; mudah kembali bila "tersesat" |
| Sudut putar dibatasi (tidak bisa melihat dari bawah terbalik), tanpa geser | Mencegah disorientasi |
| Label teks **menempel pada objek 3D** dan ikut bergerak saat diputar | Kedekatan spasial |
| Animasi buka tabung dikendalikan **slider**, bukan diputar otomatis | Segmentasi dan tempo dikendalikan siswa (EL04) |
| Tombol bagian (Alas/Tutup/Selimut/r/t) di bawah kanvas sebagai alternatif mengetuk objek | Target sentuh ≥ 48px; aksesibilitas |
| 3D hanya di modul **M1, M2, dan Laboratorium**; Arena memakai gambar 2D kecil | Saat menghitung, perhatian siswa ada pada soal |
| Bila HP tidak mampu, otomatis pakai 2D, dengan sakelar manual "2D/3D" | Keterjangkauan perangkat |

Tata letak layar 3D:
```
┌────────────────────────────┐
│ ←  Kenali Tabung     1 / 6 │
├────────────────────────────┤
│        ╭───╮   Tutup ←     │
│        │   │               │  ← kanvas 3D (±55% tinggi layar)
│ Selimut│   │ t             │     label menempel pada objek
│        ╰───╯   ↺           │  ← tombol posisi awal
├────────────────────────────┤
│ [Alas][Tutup][Selimut][r][t]│ ← pemilih bagian
│ Teks penjelasan ≤ 40 kata  │
├────────────────────────────┤
│ [Kembali] [Ulangi] [Lanjut]│
└────────────────────────────┘
```

## 3. Peta Layar

```
S0  Splash/Beranda ─┬─ S1 Cek Kesiapan ── S1b Pengantar Lingkaran (opsional)
                    ├─ S2 Peta Belajar (6 modul, status ✓/terkunci)
                    │     ├─ M1 Kenali Tabung
                    │     ├─ M2 Buka Tabung (+ M2b Laboratorium Tabung)
                    │     ├─ M3 Asal Rumus
                    │     ├─ M4 Contoh Terurai
                    │     ├─ M5 Arena Latihan → Pilih Level → Soal → Pembahasan → Refleksi
                    │     └─ M6 Rangkuman & Lencana
                    └─ S9 Tentang (cara pakai, kredit, Mode Peneliti)
```

## 4. Rancangan Tiap Modul

### S1 — Cek Kesiapan (F0)
- 4 soal singkat pilihan ganda: d=14 → r=?; luas lingkaran r=7; keliling lingkaran r=7; luas lingkaran r=10 (π=3,14).
- Tanpa nilai merah. Hasil: "Kamu siap!" atau "Yuk, segarkan dulu materi lingkaran (3 menit)" → S1b.
- **S1b Pengantar Lingkaran:** 3 layar — (1) r dan d dengan garis berwarna magenta, r = d ÷ 2; (2) keliling = 2πr (animasi lingkaran "digelindingkan" menjadi garis); (3) luas = πr².

### M1 — Kenali Tabung (F1) — 3D
- Tabung **3D** tegak, sedikit miring ke arah kamera (agar alas dan tutup tampak). Layar pertama: "Putar tabung dengan satu jari."
- Instruksi: "Ketuk bagian tabung." Ketukan pada alas/tutup/selimut/garis r/garis t (di objek 3D atau tombol pemilih) → bagian itu berwarna, bagian lain memudar, dan label muncul menempel padanya.
- Saat alas disorot, kamera berputar perlahan agar alas terlihat dari bawah, lalu kembali. Ini satu-satunya gerak kamera otomatis, dan dipicu oleh tindakan siswa.
- Mini-tantangan: "Ketuk **selimut**!" (3 kali, acak) — memastikan siswa bisa menunjuk bagian.
- Contoh nyata (ikon garis, bukan foto): kaleng susu, kaleng biskuit, ember. Tiap contoh disertai keterangan bagian yang tidak ada (mis. ember tidak punya tutup).

### M2 — Buka Tabung (F2) — fitur inti, 3D
- Slider 0% → 100% "Buka tabung" (siswa tetap bisa memutar kamera di setiap posisi slider):
  1. 0%: tabung 3D utuh.
  2. 30%: tutup (hijau) dan alas (biru) membuka seperti engsel pada tepi selimut.
  3. 30–90%: garis sambungan selimut tampak sebagai garis putus-putus ("digunting di sini"), lalu selimut (oranye) melengkung terbuka sampai datar. **Panjangnya tidak berubah.**
  4. 100%: kamera ke tampak depan → jaring-jaring datar: lingkaran hijau – persegi panjang oranye – lingkaran biru.
- Pada 100%: tombol "Gelindingkan alas". Lingkaran alas menggelinding sepanjang sisi panjang persegi panjang dan tepinya meninggalkan jejak magenta. Teks: "Panjang selimut = keliling alas = **2πr**". Lebar diberi tanda ungu "= t".
- Slider dapat digeser bolak-balik untuk menutup kembali.

### M2b — Laboratorium Tabung (eksplorasi bebas, 3D)
- Dua slider: **r** (1–14 cm) dan **t** (1–20 cm). Tabung 3D berubah langsung.
- Di bawahnya, tiga kartu berwarna diperbarui langsung: Alas = πr², Tutup = πr², Selimut = 2πrt, dan **L** (jumlahnya), dengan sakelar "tutup ada/tidak".
- Pertanyaan pemantik (satu per kali, tidak dinilai): "Jika r dibuat 2 kali lipat, apakah luas selimut juga 2 kali lipat? Coba!" Ini mendukung penalaran (GL) dan literasi matematika.

### M3 — Asal Rumus (F3)
Satu langkah per layar; gambar jaring-jaring selalu tampil di atas dan bagian yang sedang dibahas disorot.

| Langkah | Sorotan | Teks/rumus |
|---|---|---|
| 1 | Tutup | Luas tutup = πr² |
| 2 | Alas | Luas alas = πr² |
| 3 | Alas + tutup | Ada **2** lingkaran → 2 × πr² = **2πr²** ← *angka 2 yang pertama* |
| 4 | Selimut | Selimut = persegi panjang = panjang × lebar |
| 5 | Selimut + panah | panjang = keliling = **2πr** ← *angka 2 yang kedua*; lebar = t → 2πr × t = **2πrt** |
| 6 | Semua | L = 2πr² + 2πrt = **2πr(r + t)** |
| 7 | Variasi | Tanpa tutup: πr² + 2πrt • Hanya selimut: 2πrt (gambar bagian yang tidak dihitung dibuat abu-abu) |

Kartu "**Dua angka 2 yang berbeda**" di langkah 6 menjawab langsung kebingungan IL01.

### M4 — Contoh Terurai (F4)
- **Contoh 1 (lengkap):** semua langkah ditampilkan satu per satu (tombol Lanjut).
- **Contoh 2 (sebagian):** langkah ② dan ④ dikosongkan untuk diisi siswa.
- **Contoh 3 (mandiri dengan pendamping):** soal mirip dengan konteks berbeda; struktur langkah tetap terlihat.
- Di bawah tiap contoh: "Apa yang sama dengan contoh sebelumnya? Apa yang berbeda?" (pilihan ganda) — memfasilitasi GL05.

### M5 — Arena Latihan (F5–F10)

**Pilih Level**
```
[ Level 1 • Mudah   ★★★ 9/12 ]
[ Level 2 • Sedang  ★☆☆ 2/12 ]
[ Level 3 • Sulit   🔒 ]   ← terbuka setelah Level 2 selesai
```
Tiap level berisi 4 soal. Tanpa batas waktu, tanpa nyawa.

**Layar Soal — penyelesaian berlangkah (scaffold)**
```
Soal (kartu) — angka/kata dapat diketuk untuk ditandai (F10)
──────────────────────────────
① Apa yang diketahui?   r = [__]  t = [__]   (jika d diketahui: d = [__] → r = [__])
② Bagian yang dihitung: [ ] Alas  [ ] Tutup  [ ] Selimut   (gambar tabung ikut menyala)
③ Hitung tiap bagian:   Alas [__]  Tutup [__]  Selimut [__]
④ Jumlah:               L = [__]  satuan [cm² ▾]
                                     [ Periksa ]   [ 💡 Petunjuk ]
```
- Langkah dibuka berurutan; langkah yang sudah benar dikunci dengan tanda hijau.
- **Fading per level:** Level 1 memakai keempat langkah; Level 2 menggabungkan ③ dan ④; Level 3 hanya mewajibkan ② dan ④ (langkah lain opsional, bisa dibuka lewat "Tampilkan langkah").
- Gambar tabung kecil di pojok menyala sesuai bagian yang dicentang di ② (kedekatan spasial).

**Petunjuk bertingkat (F7)**
| Pemicu | Isi |
|---|---|
| Salah ke-1 | Umpan balik singkat/miskonsepsi: "Hmm, cek lagi: yang diketahui diameter atau jari-jari?" |
| Salah ke-2 (atau tombol 💡 pertama) | Petunjuk konsep + gambar: "Jari-jari = diameter ÷ 2" |
| Salah ke-3 (atau tombol 💡 kedua) | Langkah diperlihatkan: "r = 14 ÷ 2 = 7". Siswa tetap mengetik ulang jawabannya |

**Pembahasan & Refleksi (F9)**
- Setelah benar: ringkasan 3 baris (rumus → substitusi → hasil + satuan) dengan warna bagian.
- Satu pertanyaan refleksi, misalnya: "Mengapa luas alas hanya dihitung satu kali pada soal ember?" → pilihan alasan. Jawaban apa pun diterima; setelah itu ditampilkan alasan yang tepat (tidak dinilai, agar tidak menambah kecemasan).

**Umpan balik**
- Benar: centang hijau + "Tepat!" + bintang. Tanpa konfeti dan tanpa suara keras (efek suara opsional, mati secara bawaan).
- Salah: garis merah pada kotak jawaban + pesan yang membangun. Hindari kata "SALAH!" besar.

### M6 — Rangkuman & Lencana
- Kartu rangkuman satu layar: jaring-jaring + 3 rumus (tertutup, tanpa tutup, selimut).
- Lencana sederhana: "Penjelajah Tabung" (semua modul), "Teliti" (tanpa kesalahan satuan), "Mandiri" (Level 3 dengan ≤ 2 petunjuk).

## 5. Komponen UI

| Komponen | Spesifikasi |
|---|---|
| Tombol utama | Tinggi 52px, sudut 12px, latar `--c-aksen`, teks putih tebal |
| Tombol sekunder | Garis 2px, latar putih |
| Input angka | `inputmode="decimal"`, tinggi 48px, rata kanan, teks 20px |
| Pilihan satuan | Segmented control: `cm²` `m²` `cm` |
| Kartu soal | Latar `--c-latar-2`, padding 16px, kata yang ditandai diberi latar kuning muda + garis bawah |
| Bilah progres langkah | Titik-titik (●●○○○), bukan persentase |
| Toast umpan balik | Muncul dari bawah, tidak menutupi soal, hilang saat siswa mengetik |

## 6. Aksesibilitas
- Semua bagian SVG yang dapat diketuk memiliki `role="button"`, `aria-label`, dan dapat difokus dengan keyboard.
- Area ketuk SVG diperbesar dengan *hit area* transparan (garis r/t tipis → area 48px).
- Teks umpan balik diumumkan lewat `aria-live="polite"`.
- Tanpa informasi yang hanya disampaikan dengan warna.

## 7. Glosarium Istilah (wajib konsisten)

| Gunakan | Hindari |
|---|---|
| jari-jari (r) | radius, jari |
| diameter (d) | garis tengah (boleh disebut sekali sebagai sinonim) |
| tinggi (t) | panjang tabung |
| alas, tutup, selimut | sisi atas/bawah, badan tabung |
| luas permukaan | luas total, luas sisi (kecuali "luas selimut") |
| jaring-jaring tabung | bukaan tabung |
| π (pi) = 22/7 atau 3,14 | — |
| Desimal memakai koma: 11,88 | 11.88 (di teks tampilan) |

Nada bahasa: sapaan "kamu", kalimat pendek, kalimat aktif. Contoh: "Ketuk bagian selimut." bukan "Silakan Anda menekan bagian selimut tabung tersebut."

## 8. Checklist Uji Desain (sebelum validasi ahli media)
- [ ] Setiap layar materi tanpa scroll di 360×640.
- [ ] Teks per layar materi ≤ 40 kata.
- [ ] Warna bagian tabung sama di semua modul.
- [ ] Tidak ada animasi/gambar dekoratif.
- [ ] Semua tombol ≥ 48px dan dapat dijangkau jempol.
- [ ] Bisa dipakai offline (mode pesawat) setelah dibuka sekali.
- [ ] 3D: tanpa putar otomatis, ada tombol "Posisi awal", label menempel pada objek, ≥ 30 FPS di HP menengah.
- [ ] 3D: fallback 2D muncul otomatis bila WebGL tidak tersedia, dan sakelar 2D/3D berfungsi.
