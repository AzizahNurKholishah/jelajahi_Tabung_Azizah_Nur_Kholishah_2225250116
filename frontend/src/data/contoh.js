// Contoh terurai dengan fading (F4) — docs/KONTEN.md §3 M4.
// Contoh 1 lengkap → Contoh 2 sebagian kosong → Contoh 3 diisi sendiri.
// `isian` = kotak yang harus diisi siswa (kunci diuji di contoh.test.js).

export const CONTOH = [
  {
    id: 'C1',
    jenis: 'lengkap',
    judul: 'Contoh 1 — lengkap',
    teks: 'Sebuah kaleng tertutup memiliki jari-jari 7 cm dan tinggi 10 cm. Hitung luas permukaannya. (π = 22/7)',
    gambar: { r: 7, t: 10, tampilkan: { alas: true, tutup: true, selimut: true } },
    data: { r: 7, t: 10, pi: '22/7', bagian: ['alas', 'tutup', 'selimut'] },
    langkah: [
      { judul: '① Diketahui', isi: 'r = 7 cm, t = 10 cm' },
      { judul: '② Bagian', isi: 'Kaleng tertutup → alas + tutup + selimut', sorot: ['alas', 'tutup', 'selimut'] },
      {
        judul: '③ Hitung',
        isi: 'Alas = tutup = 22/7 × 7 × 7 = 154 cm². Selimut = 2 × 22/7 × 7 × 10 = 440 cm².',
      },
      { judul: '④ Jumlah', isi: 'L = 154 + 154 + 440 = 748 cm². Cek: 2πr(r + t) = 44 × 17 = 748 ✓' },
    ],
  },
  {
    id: 'C2',
    jenis: 'sebagian',
    judul: 'Contoh 2 — lengkapi',
    teks: 'Sebuah gelas tanpa tutup berdiameter 14 cm dan tinggi 12 cm. Hitung luas permukaan luarnya. (π = 22/7)',
    gambar: { r: 7, t: 12, tampilkan: { alas: true, tutup: false, selimut: true } },
    data: { d: 14, t: 12, pi: '22/7', bagian: ['alas', 'selimut'] },
    langkah: [
      { judul: '① Diketahui', isi: 'd = 14 cm, t = 12 cm.', isian: { label: 'r = 14 ÷ 2 =', kunci: 7, satuan: 'cm', petunjuk: 'Jari-jari = diameter ÷ 2.' } },
      { judul: '② Bagian', isi: 'Gelas tanpa tutup → alas + selimut', sorot: ['alas', 'selimut'] },
      {
        judul: '③ Hitung',
        isi: 'Alas = 22/7 × 7 × 7 = 154 cm².',
        isian: { label: 'Selimut = 2 × 22/7 × 7 × 12 =', kunci: 528, satuan: 'cm²', petunjuk: '2 × 22/7 × 7 = 44, lalu 44 × 12.' },
      },
      { judul: '④ Jumlah', isi: 'L = 154 + 528 = 682 cm²' },
    ],
    perbandingan: {
      tanya: 'Apa yang berbeda dari Contoh 1?',
      pilihan: [
        'Gelas tidak punya tutup, dan yang diketahui diameternya',
        'Rumusnya sama persis dengan Contoh 1',
        'Tidak ada bedanya',
      ],
      tepat: 0,
    },
  },
  {
    id: 'C3',
    jenis: 'mandiri',
    judul: 'Contoh 3 — coba sendiri',
    teks: 'Sebuah tempat pensil berbentuk tabung tanpa tutup, jari-jari 3,5 cm dan tinggi 14 cm. Hitung luas permukaan luarnya. (π = 22/7)',
    gambar: { r: 3.5, t: 14, tampilkan: { alas: true, tutup: false, selimut: true } },
    data: { r: 3.5, t: 14, pi: '22/7', bagian: ['alas', 'selimut'] },
    langkah: [
      { judul: '① Diketahui', isi: 'r = 3,5 cm, t = 14 cm' },
      { judul: '② Bagian', isi: 'Tanpa tutup → alas + selimut', sorot: ['alas', 'selimut'] },
      {
        judul: '③ Hitung alas',
        isian: { label: 'Alas = πr² =', kunci: 38.5, satuan: 'cm²', petunjuk: '22/7 × 3,5 × 3,5' },
      },
      {
        judul: '③ Hitung selimut',
        isian: { label: 'Selimut = 2πrt =', kunci: 308, satuan: 'cm²', petunjuk: '2 × 22/7 × 3,5 × 14 = 22 × 14' },
      },
      {
        judul: '④ Jumlah',
        isian: { label: 'L =', kunci: 346.5, satuan: 'cm²', petunjuk: 'Jumlahkan alas dan selimut.' },
      },
    ],
    perbandingan: {
      tanya: 'Apa yang sama dengan Contoh 2?',
      pilihan: [
        'Sama-sama tanpa tutup: hitung alas + selimut',
        'Sama-sama punya tutup',
        'Sama-sama diketahui diameternya',
      ],
      tepat: 0,
    },
  },
];
