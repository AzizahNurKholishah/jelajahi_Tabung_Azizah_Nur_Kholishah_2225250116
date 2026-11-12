// Rumus luas permukaan tabung. Logika murni: tanpa React/DOM.
// Sumber kebenaran isi: docs/KONTEN.md §2.

export const NILAI_PI = Object.freeze({ '22/7': 22 / 7, '3.14': 3.14 });

export const BAGIAN = Object.freeze(['alas', 'tutup', 'selimut']);

function nilaiPi(pi) {
  const nilai = NILAI_PI[pi];
  if (nilai === undefined) {
    throw new Error(`Nilai π tidak dikenal: ${pi}. Gunakan '22/7' atau '3.14'.`);
  }
  return nilai;
}

/** Membulatkan ke `desimal` angka di belakang koma; menghapus galat floating point (22/7 × 7 × 7). */
export function bulatkan(x, desimal = 2) {
  const f = 10 ** desimal;
  return Math.round((x + Number.EPSILON) * f) / f;
}

/** r diambil langsung bila ada; jika hanya diameter yang diketahui, r = d ÷ 2. */
export function jariJari({ r, d }) {
  if (r != null) return r;
  if (d != null) return d / 2;
  throw new Error('Jari-jari (r) atau diameter (d) harus diketahui.');
}

export function luasLingkaran(r, pi) {
  return nilaiPi(pi) * r * r;
}

export function kelilingLingkaran(r, pi) {
  return 2 * nilaiPi(pi) * r;
}

/** Selimut = persegi panjang: panjang = keliling alas (2πr), lebar = t. */
export function luasSelimut(r, t, pi) {
  return kelilingLingkaran(r, pi) * t;
}

export function luasTiapBagian({ r, d, t, pi }) {
  const rr = jariJari({ r, d });
  const lingkaran = luasLingkaran(rr, pi);
  return {
    alas: lingkaran,
    tutup: lingkaran,
    selimut: luasSelimut(rr, t, pi),
  };
}

/** Jumlah luas bagian yang dipilih. Bawaan: tabung tertutup (alas + tutup + selimut). */
export function luasPermukaan({ r, d, t, pi, bagian = BAGIAN }) {
  for (const b of bagian) {
    if (!BAGIAN.includes(b)) throw new Error(`Bagian tidak dikenal: ${b}`);
  }
  const luas = luasTiapBagian({ r, d, t, pi });
  return bagian.reduce((jumlah, b) => jumlah + luas[b], 0);
}

/**
 * Kunci jawaban sebuah soal (docs/ARSITEKTUR.md §4.1).
 * pengali: banyak benda (mis. 50 kaleng); hargaPerSatuan: harga per satuan luas (mis. Rp25.000/m²).
 */
export function kunciJawaban(soal) {
  const luas = luasPermukaan({ ...soal.diketahui, pi: soal.pi, bagian: soal.bagian });
  return bulatkan(luas * (soal.pengali ?? 1) * (soal.hargaPerSatuan ?? 1));
}
