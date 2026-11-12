// Membaca dan menampilkan angka dengan format Indonesia (docs/ARSITEKTUR.md §6).
// Ribuan memakai titik (2.992), desimal memakai koma (11,88); siswa boleh mengetik titik sebagai desimal.

const RIBUAN = /^\d{1,3}(\.\d{3})+$/;
const BULAT = /^\d+$/;
const DESIMAL_TITIK = /^\d+\.\d+$/;

const PESAN_BUKAN_ANGKA = 'Tulis jawaban dengan angka, ya.';

/**
 * @returns {{ ok: true, kandidat: number[] } | { ok: false, pesan: string }}
 * `kandidat` berisi 2 nilai bila penulisan ambigu (mis. "2.992" bisa 2992 atau 2,992);
 * pemeriksa jawaban menganggap benar bila salah satu kandidat cocok.
 */
export function parseAngka(masukan) {
  const teks = String(masukan ?? '')
    .replace(/rp/gi, '')
    .replace(/\s+/g, '');

  if (teks === '') return { ok: false, pesan: PESAN_BUKAN_ANGKA };

  if (teks.includes(',')) {
    const bagian = teks.split(',');
    if (bagian.length !== 2) return { ok: false, pesan: PESAN_BUKAN_ANGKA };
    const [bulat, pecahan] = bagian;
    const bulatSah = bulat.includes('.') ? RIBUAN.test(bulat) : BULAT.test(bulat);
    if (!bulatSah || !BULAT.test(pecahan)) return { ok: false, pesan: PESAN_BUKAN_ANGKA };
    return { ok: true, kandidat: [Number(`${bulat.replace(/\./g, '')}.${pecahan}`)] };
  }

  if (teks.includes('.')) {
    if (RIBUAN.test(teks)) {
      const sebagaiRibuan = Number(teks.replace(/\./g, ''));
      const satuTitik = teks.split('.').length === 2;
      return { ok: true, kandidat: satuTitik ? [sebagaiRibuan, Number(teks)] : [sebagaiRibuan] };
    }
    if (DESIMAL_TITIK.test(teks)) return { ok: true, kandidat: [Number(teks)] };
    return { ok: false, pesan: PESAN_BUKAN_ANGKA };
  }

  if (BULAT.test(teks)) return { ok: true, kandidat: [Number(teks)] };
  return { ok: false, pesan: PESAN_BUKAN_ANGKA };
}

const formatter = new Map();

/** 2992 → "2.992", 11.88 → "11,88", 1130.4 → "1.130,4" */
export function formatAngka(n, maksDesimal = 2) {
  if (!formatter.has(maksDesimal)) {
    formatter.set(maksDesimal, new Intl.NumberFormat('id-ID', { maximumFractionDigits: maksDesimal }));
  }
  return formatter.get(maksDesimal).format(n);
}

/** 297000 → "Rp297.000" */
export function formatRupiah(n) {
  return `Rp${formatAngka(n, 0)}`;
}
