// Petunjuk bertingkat (F7, DS02): salah ke-1 → umpan balik saja; salah ke-2 → petunjuk konsep;
// salah ke-3 → langkah diperlihatkan. Tombol "Minta petunjuk" menaikkan tingkat langsung.

export const TINGKAT_MAKS = 2;

export function tingkatPetunjuk(jumlahSalah = 0, jumlahMinta = 0) {
  return Math.min(TINGKAT_MAKS, Math.max(jumlahSalah - 1, jumlahMinta, 0));
}

/** ★★★ tanpa petunjuk, ★★ dengan 1 petunjuk, ★ dengan ≥ 2 petunjuk (FR-09). */
export function bintangDariPetunjuk(totalPetunjuk) {
  if (totalPetunjuk <= 0) return 3;
  if (totalPetunjuk === 1) return 2;
  return 1;
}
