// Bank soal Arena Latihan — sumber: docs/KONTEN.md §4 & §7.
// Kunci jawaban TIDAK ditulis di sini: dihitung oleh lib/rumus.js (kunciJawaban) dan diuji di soal.test.js.

const TERTUTUP = ['alas', 'tutup', 'selimut'];
const TANPA_TUTUP = ['alas', 'selimut'];
const SELIMUT = ['selimut'];

export const LEVEL = [
  { no: 1, nama: 'Mudah', deskripsi: 'Tabung tertutup, jari-jari diketahui' },
  { no: 2, nama: 'Sedang', deskripsi: 'Diameter diketahui & tabung tanpa tutup' },
  { no: 3, nama: 'Sulit', deskripsi: 'Soal cerita dari kehidupan sehari-hari' },
];

export const SOAL = [
  // Level 1 — Mudah
  {
    id: 'L1-1',
    level: 1,
    teks: 'Sebuah tabung tertutup memiliki jari-jari 7 cm dan tinggi 10 cm. Hitunglah luas permukaan tabung tersebut! (π = 22/7)',
    tanda: ['jari-jari 7 cm', 'tinggi 10 cm', 'tertutup'],
    diketahui: { r: 7, t: 10 },
    pi: '22/7',
    bagian: TERTUTUP,
    refleksi: {
      tanya: 'Mengapa pada rumus ada 2πr²?',
      pilihan: ['Karena ada dua lingkaran: alas dan tutup', 'Karena rumusnya memang begitu', 'Karena r dikuadratkan dua kali'],
      tepat: 0,
    },
  },
  {
    id: 'L1-2',
    level: 1,
    teks: 'Sebuah tabung tertutup memiliki jari-jari 14 cm dan tinggi 20 cm. Hitunglah luas permukaannya! (π = 22/7)',
    tanda: ['jari-jari 14 cm', 'tinggi 20 cm', 'tertutup'],
    diketahui: { r: 14, t: 20 },
    pi: '22/7',
    bagian: TERTUTUP,
  },
  {
    id: 'L1-3',
    level: 1,
    teks: 'Sebuah tabung tertutup memiliki jari-jari 10 cm dan tinggi 5 cm. Hitunglah luas permukaannya! (π = 3,14)',
    tanda: ['jari-jari 10 cm', 'tinggi 5 cm', 'tertutup'],
    diketahui: { r: 10, t: 5 },
    pi: '3.14',
    bagian: TERTUTUP,
  },
  {
    id: 'L1-4',
    level: 1,
    teks: 'Sebuah tabung memiliki jari-jari 7 cm dan tinggi 12 cm. Berapakah luas selimutnya? (π = 22/7)',
    tanda: ['jari-jari 7 cm', 'tinggi 12 cm', 'selimutnya'],
    diketahui: { r: 7, t: 12 },
    pi: '22/7',
    bagian: SELIMUT,
    refleksi: {
      tanya: 'Mengapa luas selimut = 2πrt?',
      pilihan: [
        'Panjang selimut sama dengan keliling alas (2πr), lebarnya t',
        'Karena selimut ada dua',
        'Karena sama dengan luas alas',
      ],
      tepat: 0,
    },
  },

  // Level 2 — Sedang
  {
    id: 'L2-1',
    level: 2,
    teks: 'Sebuah tabung tertutup memiliki diameter 14 cm dan tinggi 10 cm. Hitunglah luas permukaannya! (π = 22/7)',
    tanda: ['diameter 14 cm', 'tinggi 10 cm', 'tertutup'],
    diketahui: { d: 14, t: 10 },
    pi: '22/7',
    bagian: TERTUTUP,
  },
  {
    id: 'L2-2',
    level: 2,
    teks: 'Sebuah tabung tanpa tutup memiliki jari-jari 7 cm dan tinggi 15 cm. Hitunglah luas permukaannya! (π = 22/7)',
    tanda: ['tanpa tutup', 'jari-jari 7 cm', 'tinggi 15 cm'],
    diketahui: { r: 7, t: 15 },
    pi: '22/7',
    bagian: TANPA_TUTUP,
    refleksi: {
      tanya: 'Mengapa luas lingkaran hanya dihitung satu kali?',
      pilihan: ['Karena tabung tidak punya tutup', 'Karena jari-jarinya kecil', 'Karena lupa'],
      tepat: 0,
    },
  },
  {
    id: 'L2-3',
    level: 2,
    teks: 'Sebuah tabung tanpa tutup memiliki diameter 20 cm dan tinggi 30 cm. Hitunglah luas permukaannya! (π = 3,14)',
    tanda: ['tanpa tutup', 'diameter 20 cm', 'tinggi 30 cm'],
    diketahui: { d: 20, t: 30 },
    pi: '3.14',
    bagian: TANPA_TUTUP,
  },
  {
    id: 'L2-4',
    level: 2,
    teks: 'Sebuah tabung tertutup memiliki diameter 28 cm dan tinggi 10 cm. Hitunglah luas permukaannya! (π = 22/7)',
    tanda: ['diameter 28 cm', 'tinggi 10 cm', 'tertutup'],
    diketahui: { d: 28, t: 10 },
    pi: '22/7',
    bagian: TERTUTUP,
  },

  // Level 3 — Sulit (literasi matematika: merumuskan → menerapkan → menafsirkan)
  {
    id: 'L3-1',
    level: 3,
    teks: 'Sebuah kaleng susu berdiameter 7 cm dan tinggi 10 cm. Seluruh bagian lengkung kaleng ditutupi label kertas. Berapa luas kertas label yang diperlukan? (π = 22/7)',
    tanda: ['berdiameter 7 cm', 'tinggi 10 cm', 'bagian lengkung'],
    diketahui: { d: 7, t: 10 },
    pi: '22/7',
    bagian: SELIMUT,
    refleksi: {
      tanya: 'Mengapa yang dihitung hanya luas selimutnya?',
      pilihan: ['Label hanya menutupi bagian lengkung', 'Karena kaleng tidak punya alas', 'Karena soalnya pendek'],
      tepat: 0,
    },
  },
  {
    id: 'L3-2',
    level: 3,
    teks: 'Dina ingin mengecat bagian luar sebuah ember tanpa tutup. Ember itu berdiameter 28 cm dan tingginya 30 cm. Berapa luas bagian yang dicat? (π = 22/7)',
    tanda: ['tanpa tutup', 'berdiameter 28 cm', 'tingginya 30 cm'],
    diketahui: { d: 28, t: 30 },
    pi: '22/7',
    bagian: TANPA_TUTUP,
  },
  {
    id: 'L3-3',
    level: 3,
    teks: 'Sebuah tangki air tertutup berjari-jari 0,7 m dan tinggi 2 m akan dicat seluruh permukaan luarnya. Biaya cat Rp25.000 per m². Berapa biaya yang diperlukan? (π = 22/7)',
    tanda: ['tertutup', 'berjari-jari 0,7 m', 'tinggi 2 m', 'Rp25.000 per m²'],
    diketahui: { r: 0.7, t: 2 },
    pi: '22/7',
    bagian: TERTUTUP,
    satuanPanjang: 'm',
    hargaPerSatuan: 25000,
    akhir: { label: 'Biaya =', satuan: 'Rp', petunjuk: 'Biaya = luas permukaan × harga per m² (Rp25.000).' },
    refleksi: {
      tanya: 'Mengapa luasnya dihitung dalam m², bukan cm²?',
      pilihan: ['Ukuran tangki dalam meter dan harga cat per m²', 'Karena tangki besar', 'Bebas saja'],
      tepat: 0,
    },
  },
  {
    id: 'L3-4',
    level: 3,
    teks: 'Pak Budi membuat 50 kaleng tanpa tutup dari lembaran seng. Tiap kaleng berjari-jari 7 cm dan tinggi 10 cm. Berapa luas seng minimal yang diperlukan? (π = 22/7)',
    tanda: ['50 kaleng', 'tanpa tutup', 'berjari-jari 7 cm', 'tinggi 10 cm'],
    diketahui: { r: 7, t: 10 },
    pi: '22/7',
    bagian: TANPA_TUTUP,
    pengali: 50,
    akhir: {
      label: 'Luas seng untuk 50 kaleng =',
      satuan: 'cm²',
      petunjuk: 'Kalikan luas satu kaleng dengan banyak kaleng (50).',
    },
  },
];

/** Soal cadangan (KONTEN.md L3-5), tidak tampil di Arena. */
export const SOAL_CADANGAN = [
  {
    id: 'L3-5',
    level: 3,
    teks: 'Sebuah kaleng biskuit tertutup berdiameter 20 cm dan tinggi 8 cm dibungkus kertas kado seluruhnya. Berapa luas kertas kado minimal? (π = 3,14)',
    tanda: ['tertutup', 'berdiameter 20 cm', 'tinggi 8 cm'],
    diketahui: { d: 20, t: 8 },
    pi: '3.14',
    bagian: TERTUTUP,
  },
];

export function soalPerLevel(level) {
  return SOAL.filter((s) => s.level === level);
}

/** Level 1 selalu terbuka; level berikutnya terbuka setelah semua soal level sebelumnya selesai. */
export function levelTerbuka(level, hasilArena) {
  if (level <= 1) return true;
  return soalPerLevel(level - 1).every((s) => hasilArena[s.id]?.selesai);
}
