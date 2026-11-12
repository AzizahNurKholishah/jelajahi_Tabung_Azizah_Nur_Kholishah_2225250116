# KONTEN — Materi, Bank Soal, dan Umpan Balik
## Jelajah Tabung

Sumber kebenaran isi aplikasi. Kode dalam `frontend/src/data/` harus sesuai dengan dokumen ini. Semua kunci jawaban diverifikasi oleh uji otomatis Vitest (`frontend/src/__tests__/soal.test.js`).

---

## 1. Kompetensi & Indikator

**Capaian (Kurikulum Merdeka, Fase D):** peserta didik dapat menentukan luas permukaan bangun ruang (termasuk tabung) dan menyelesaikan masalah kontekstual yang berkaitan.

| Kode | Indikator | Modul |
|---|---|---|
| I1 | Mengidentifikasi unsur tabung (alas, tutup, selimut, r, d, t) | M1 |
| I2 | Menggambarkan/mengenali jaring-jaring tabung | M2 |
| I3 | Menurunkan rumus luas permukaan tabung dari jaring-jaring | M3 |
| I4 | Menghitung luas permukaan tabung tertutup | M4, L1 |
| I5 | Menghitung luas permukaan tabung tanpa tutup dan luas selimut | M3, L2 |
| I6 | Menyelesaikan masalah kontekstual yang berkaitan dengan luas permukaan tabung (literasi) | L3 |

## 2. Ringkasan Rumus

| Kasus | Rumus | Bagian |
|---|---|---|
| Tabung tertutup | L = 2πr² + 2πrt = 2πr(r + t) | alas + tutup + selimut |
| Tanpa tutup (ember, gelas, kaleng terbuka) | L = πr² + 2πrt | alas + selimut |
| Hanya selimut (label kaleng, pipa) | L = 2πrt | selimut |

- r = d ÷ 2
- π = 22/7 bila r atau d kelipatan 7; selain itu π = 3,14 (soal selalu menyebutkan π yang dipakai).
- Satuan luas: cm², m² (satuan panjang dikuadratkan).

**Dua angka 2 yang berbeda:**
1. **2**πr² → ada **dua** lingkaran (alas dan tutup).
2. **2**πr → keliling lingkaran; menjadi panjang persegi panjang selimut.

## 3. Naskah Layar Materi

### M1 — Kenali Tabung
1. "Ini tabung. Ketuk bagian-bagiannya!"
2. Alas: "**Alas** — lingkaran di bawah."
3. Tutup: "**Tutup** — lingkaran di atas. Ukurannya sama dengan alas."
4. Selimut: "**Selimut** — bagian lengkung yang mengelilingi tabung."
5. r: "**Jari-jari (r)** — dari titik pusat ke tepi lingkaran."
6. t: "**Tinggi (t)** — jarak alas ke tutup."
7. Contoh: "Kaleng susu: punya alas, tutup, selimut. Ember: tidak punya tutup."

### M2 — Buka Tabung
1. "Geser untuk membuka tabung."
2. (100%) "Tabung terbuka menjadi **2 lingkaran** dan **1 persegi panjang**."
3. "Panjang persegi panjang = keliling alas = **2πr**. Lebarnya = **t**."

### M3 — Asal Rumus
(lihat DESAIN.md §4 M3, 7 langkah)

### M4 — Contoh Terurai

**Contoh 1 (lengkap)** — Sebuah kaleng tertutup memiliki jari-jari 7 cm dan tinggi 10 cm. Hitung luas permukaannya. (π = 22/7)
1. Diketahui: r = 7 cm, t = 10 cm.
2. Bagian: alas + tutup + selimut (tertutup).
3. Alas = tutup = 22/7 × 7 × 7 = 154 cm². Selimut = 2 × 22/7 × 7 × 10 = 440 cm².
4. L = 154 + 154 + 440 = **748 cm²**. Cek: 2πr(r + t) = 44 × 17 = 748 ✓

**Contoh 2 (sebagian)** — Sebuah gelas tanpa tutup berdiameter 14 cm dan tinggi 12 cm. (π = 22/7)
1. d = 14 → r = [__] (7)
2. Bagian: alas + selimut
3. Alas = 154; Selimut = [__] (2 × 22/7 × 7 × 12 = 528)
4. L = 154 + 528 = **682 cm²**

**Contoh 3 (mandiri)** — Sebuah tempat pensil berbentuk tabung tanpa tutup, jari-jari 3,5 cm, tinggi 14 cm. (π = 22/7)
- Alas = 22/7 × 3,5 × 3,5 = 38,5 cm²; Selimut = 2 × 22/7 × 3,5 × 14 = 308 cm²; **L = 346,5 cm²**

## 4. Bank Soal Arena

Format id: `L{level}-{nomor}`. Semua satuan cm kecuali disebutkan.

### Cek Kesiapan (S1)
| id | Soal | Pilihan | Kunci |
|---|---|---|---|
| P1 | Diameter lingkaran 14 cm. Jari-jarinya? | 7 / 14 / 28 / 3,5 | 7 cm |
| P2 | Luas lingkaran r = 7 cm (π = 22/7)? | 44 / 154 / 22 / 308 | 154 cm² |
| P3 | Keliling lingkaran r = 7 cm (π = 22/7)? | 44 / 154 / 22 / 49 | 44 cm |
| P4 | Luas lingkaran r = 10 cm (π = 3,14)? | 31,4 / 62,8 / 314 / 628 | 314 cm² |

### Level 1 — Mudah (tertutup, r diketahui; konteks minimal)
| id | Soal | π | Bagian | Kunci |
|---|---|---|---|---|
| L1-1 | Tabung tertutup r = 7, t = 10. Luas permukaan? | 22/7 | A+T+S | **748 cm²** |
| L1-2 | Tabung tertutup r = 14, t = 20. Luas permukaan? | 22/7 | A+T+S | **2.992 cm²** |
| L1-3 | Tabung tertutup r = 10, t = 5. Luas permukaan? | 3,14 | A+T+S | **942 cm²** |
| L1-4 | Tabung r = 7, t = 12. Luas **selimut**? | 22/7 | S | **528 cm²** |

### Level 2 — Sedang (diameter / tanpa tutup)
| id | Soal | π | Bagian | Kunci |
|---|---|---|---|---|
| L2-1 | Tabung tertutup **d = 14**, t = 10. Luas permukaan? | 22/7 | A+T+S | **748 cm²** |
| L2-2 | Tabung **tanpa tutup** r = 7, t = 15. Luas permukaan? | 22/7 | A+S | 154 + 660 = **814 cm²** |
| L2-3 | Tabung **tanpa tutup d = 20**, t = 30. Luas permukaan? | 3,14 | A+S | 314 + 1.884 = **2.198 cm²** |
| L2-4 | Tabung tertutup **d = 28**, t = 10. Luas permukaan? | 22/7 | A+T+S | **2.112 cm²** |

### Level 3 — Sulit (soal cerita, literasi matematika)
Struktur literasi: **merumuskan** (situasi → model tabung), **menerapkan** (menghitung), **menafsirkan** (mengaitkan hasil dengan konteks).

| id | Soal | π | Bagian | Kunci |
|---|---|---|---|---|
| L3-1 | Sebuah kaleng susu berdiameter 7 cm dan tinggi 10 cm. Seluruh bagian lengkung kaleng ditutupi label kertas. Berapa luas kertas label yang diperlukan? | 22/7 | S | 2 × 22/7 × 3,5 × 10 = **220 cm²** |
| L3-2 | Dina ingin mengecat bagian luar sebuah ember tanpa tutup berdiameter 28 cm dan tinggi 30 cm. Berapa luas bagian yang dicat? | 22/7 | A+S | 616 + 2.640 = **3.256 cm²** |
| L3-3 | Sebuah tangki air tertutup berjari-jari 0,7 m dan tinggi 2 m akan dicat seluruh permukaan luarnya. Biaya cat Rp25.000 per m². Berapa biaya yang diperlukan? | 22/7 | A+T+S | L = 2 × 22/7 × 0,7 × 2,7 = 11,88 m² → **Rp297.000** |
| L3-4 | Pak Budi membuat 50 kaleng tanpa tutup dari lembaran seng. Tiap kaleng berjari-jari 7 cm dan tinggi 10 cm. Berapa luas seng minimal yang diperlukan? | 22/7 | A+S | (154 + 440) × 50 = 594 × 50 = **29.700 cm²** |
| L3-5 (cadangan) | Kaleng biskuit tertutup berdiameter 20 cm dan tinggi 8 cm dibungkus kertas kado seluruhnya. Berapa luas kertas kado minimal? | 3,14 | A+T+S | 2 × 3,14 × 10 × 18 = **1.130,4 cm²** |

Untuk L3-3 langkah ④ dipecah menjadi: luas (m²) → biaya (Rp). Untuk L3-4: luas satu kaleng → dikali 50.

## 5. Pola Miskonsepsi & Umpan Balik

Pemeriksa jawaban mencocokkan jawaban siswa dengan nilai-nilai berikut sebelum menampilkan umpan balik umum.

| Kode | Miskonsepsi | Cara mendeteksi | Umpan balik |
|---|---|---|---|
| MK1 | Diameter dipakai sebagai jari-jari | jawaban = rumus benar dengan r = d | "Sepertinya kamu memakai diameter sebagai jari-jari. Ingat: r = d ÷ 2." |
| MK2 | Tutup ikut dihitung pada tabung tanpa tutup | jawaban = 2πr² + 2πrt | "Benda ini tidak punya tutup. Lingkaran mana saja yang perlu dihitung?" |
| MK3 | Lupa alas/tutup (hanya selimut) | jawaban = 2πrt | "Itu baru luas selimut. Apakah alas dan tutupnya juga perlu dihitung?" |
| MK4 | Hanya satu lingkaran pada tabung tertutup | jawaban = πr² + 2πrt | "Tabung tertutup punya 2 lingkaran: alas **dan** tutup." |
| MK5 | Selimut memakai πr, bukan 2πr | jawaban = 2πr² + πrt atau πr² + πrt | "Panjang selimut = keliling alas = **2**πr. Coba lihat lagi jaring-jaringnya." |
| MK6 | Memakai rumus volume | jawaban = πr²t | "Itu rumus volume (isi tabung). Yang ditanya adalah luas kulit luarnya." |
| MK7 | Satuan salah (cm, cm³) | angka benar, satuan salah | "Angkanya sudah tepat! Luas memakai satuan persegi (cm²)." |
| MK8 | Belum mengalikan dengan banyak benda / harga (L3) | jawaban = luas satu benda | "Itu luas untuk satu benda. Soal menanyakan untuk berapa benda?" |

Contoh nilai untuk L2-1 (d = 14, t = 10): benar 748; MK1 (r = 14) → 2 × 22/7 × 14 × 24 = 2.112; MK3 → 440; MK4 → 594; MK6 → 1.540.

## 6. Petunjuk Bertingkat per Langkah

| Langkah | Petunjuk 1 (konsep) | Petunjuk 2 (langkah) |
|---|---|---|
| ① r dan t | "Cari angka jari-jari atau diameter, lalu tinggi." | "d = 14 → r = 14 ÷ 2 = 7" |
| ② bagian | "Bayangkan bendanya. Bagian mana yang ada?" + gambar | "Ember: alas ✓ selimut ✓ tutup ✗" |
| ③ hitung | "Luas lingkaran = πr². Luas selimut = 2πrt." | substitusi angka lengkap |
| ④ jumlah | "Jumlahkan semua bagian yang kamu centang." | "154 + 660 = 814" |

## 7. Pertanyaan Refleksi (F9)

| Setelah soal | Pertanyaan | Pilihan (✓ = alasan tepat) |
|---|---|---|
| L1-1 | Mengapa ada 2πr²? | ✓ Karena ada dua lingkaran: alas dan tutup / Karena rumusnya memang begitu / Karena r dikuadratkan dua kali |
| L1-4 | Mengapa selimut = 2πrt? | ✓ Panjang selimut sama dengan keliling alas (2πr), lebarnya t / Karena selimut ada dua / Karena sama dengan luas alas |
| L2-2 | Mengapa luas lingkaran hanya dihitung satu kali? | ✓ Tabung tidak punya tutup / Karena r-nya kecil / Karena lupa |
| L3-1 | Mengapa label hanya dihitung luas selimutnya? | ✓ Label hanya menutupi bagian lengkung / Karena kaleng tidak punya alas / Karena soalnya pendek |
| L3-3 | Mengapa jawaban dihitung dalam m², bukan cm²? | ✓ Ukuran tangki dalam meter dan harga cat per m² / Karena tangki besar / Bebas saja |

## 8. Catatan Penulisan Angka
- Tampilan: ribuan memakai titik (2.992), desimal memakai koma (11,88).
- Input: menerima `2992`, `2.992`, `2992,0`, `11,88`, `11.88`. Aturan parsing di ARSITEKTUR.md §6.
