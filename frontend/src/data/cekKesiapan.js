// Cek Kesiapan (F0) — docs/KONTEN.md §4. Diagnostik prasyarat lingkaran (IL02, IL03).
export const SOAL_KESIAPAN = [
  {
    id: 'P1',
    tanya: 'Diameter sebuah lingkaran 14 cm. Berapa jari-jarinya?',
    pilihan: ['7 cm', '14 cm', '28 cm', '3,5 cm'],
    tepat: 0,
    penjelasan: 'Jari-jari = diameter ÷ 2 = 14 ÷ 2 = 7 cm.',
  },
  {
    id: 'P2',
    tanya: 'Berapa luas lingkaran dengan jari-jari 7 cm? (π = 22/7)',
    pilihan: ['44 cm²', '154 cm²', '22 cm²', '308 cm²'],
    tepat: 1,
    penjelasan: 'Luas = πr² = 22/7 × 7 × 7 = 154 cm².',
  },
  {
    id: 'P3',
    tanya: 'Berapa keliling lingkaran dengan jari-jari 7 cm? (π = 22/7)',
    pilihan: ['44 cm', '154 cm', '22 cm', '49 cm'],
    tepat: 0,
    penjelasan: 'Keliling = 2πr = 2 × 22/7 × 7 = 44 cm.',
  },
  {
    id: 'P4',
    tanya: 'Berapa luas lingkaran dengan jari-jari 10 cm? (π = 3,14)',
    pilihan: ['31,4 cm²', '62,8 cm²', '314 cm²', '628 cm²'],
    tepat: 2,
    penjelasan: 'Luas = πr² = 3,14 × 10 × 10 = 314 cm².',
  },
];

/** Skor ≥ 3 dari 4 dianggap siap; selain itu disarankan Pengantar Lingkaran. */
export const SKOR_SIAP = 3;
