// Penanda informasi penting pada soal cerita (F10, EL05).

export function normalKata(kata) {
  return kata.toLowerCase().replace(/[.,!?;:()"“”]/g, '');
}

/** Memecah teks menjadi token kata & spasi; indeks token dipakai untuk menandai. */
export function pecahKata(teks) {
  return teks.split(/(\s+)/).filter((x) => x !== '');
}

/**
 * Frasa dianggap ditemukan bila semua katanya ditandai siswa.
 * @param {string[]} token hasil pecahKata
 * @param {number[]} indeksDitandai
 * @param {string[]} frasaPenting
 */
export function cekTanda(token, indeksDitandai, frasaPenting) {
  const ditandai = new Set(indeksDitandai.map((i) => normalKata(token[i] ?? '')));
  const ditemukan = [];
  const terlewat = [];
  for (const frasa of frasaPenting) {
    const kata = frasa.split(/\s+/).map(normalKata);
    (kata.every((k) => ditandai.has(k)) ? ditemukan : terlewat).push(frasa);
  }
  return { ditemukan, terlewat };
}
