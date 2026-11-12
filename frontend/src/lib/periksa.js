// Pemeriksa jawaban & pendeteksi miskonsepsi (docs/KONTEN.md §5, docs/ARSITEKTUR.md §6).
import { parseAngka } from './angka.js';
import { jariJari, kunciJawaban, luasLingkaran, luasPermukaan, luasSelimut } from './rumus.js';

/** Benar bila selisih ≤ 0,5% (minimal 0,01). Toleransi ini juga menerima π = 3,14 untuk soal ber-π 22/7. */
export function cocok(nilai, kunci) {
  return Math.abs(nilai - kunci) <= Math.max(0.01, 0.005 * Math.abs(kunci));
}

/** @returns {{status: 'benar'|'salah'|'bukan-angka', kandidat?: number[], pesan?: string}} */
export function periksaMasukan(masukan, kunci) {
  const hasil = parseAngka(masukan);
  if (!hasil.ok) return { status: 'bukan-angka', pesan: hasil.pesan };
  const benar = hasil.kandidat.some((n) => cocok(n, kunci));
  return { status: benar ? 'benar' : 'salah', kandidat: hasil.kandidat };
}

export function faktorAkhir(soal) {
  return (soal.pengali ?? 1) * (soal.hargaPerSatuan ?? 1);
}

export function satuanLuas(soal) {
  return `${soal.satuanPanjang ?? 'cm'}²`;
}

export function pesanMiskonsepsi(kode, soal) {
  switch (kode) {
    case 'MK1':
      return 'Sepertinya kamu memakai diameter sebagai jari-jari. Ingat: r = d ÷ 2.';
    case 'MK2':
      return 'Benda ini tidak punya tutup. Lingkaran mana saja yang perlu dihitung?';
    case 'MK3':
      return 'Itu baru luas selimut. Bagian lain apa yang juga perlu dihitung?';
    case 'MK4':
      return 'Tabung tertutup punya 2 lingkaran: alas dan tutup.';
    case 'MK5':
      return 'Panjang selimut = keliling alas = 2πr. Coba lihat lagi jaring-jaringnya.';
    case 'MK6':
      return 'Itu rumus volume (isi tabung). Yang ditanya adalah luas kulit luarnya.';
    case 'MK7':
      return `Angkanya sudah tepat! Luas memakai satuan persegi (${satuanLuas(soal)}).`;
    case 'MK8':
      return soal.hargaPerSatuan
        ? `Itu luasnya. Soal menanyakan biayanya: kalikan dengan harga per ${satuanLuas(soal)}.`
        : `Itu luas untuk satu benda. Soal menanyakan untuk ${soal.pengali} benda.`;
    default:
      return null;
  }
}

/** Nilai-nilai yang muncul bila siswa mengalami miskonsepsi tertentu. */
function polaMiskonsepsi(soal, { satuBenda = false } = {}) {
  const { d, t } = soal.diketahui;
  const r = jariJari(soal.diketahui);
  const { pi, bagian } = soal;
  const ada = (b) => bagian.includes(b);
  const f = satuBenda ? 1 : faktorAkhir(soal);
  const lingkaran = luasLingkaran(r, pi);
  const selimut = luasSelimut(r, t, pi);
  const luas = (rr, bb) => luasPermukaan({ r: rr, t, pi, bagian: bb });

  const pola = [];
  if (d != null) pola.push(['MK1', luas(d, bagian) * f]);
  if (ada('alas') && !ada('tutup')) pola.push(['MK2', luas(r, [...bagian, 'tutup']) * f]);
  if (!(bagian.length === 1 && ada('selimut'))) pola.push(['MK3', selimut * f]);
  if (ada('alas') && ada('tutup')) pola.push(['MK4', (lingkaran + selimut) * f]);
  if (ada('selimut')) {
    const lingkaranDihitung = (ada('alas') ? lingkaran : 0) + (ada('tutup') ? lingkaran : 0);
    pola.push(['MK5', (lingkaranDihitung + selimut / 2) * f]);
  }
  pola.push(['MK6', lingkaran * t * f]);
  if (!satuBenda && f !== 1) pola.push(['MK8', luas(r, bagian)]);
  return pola;
}

/**
 * @param {number[]} kandidat nilai jawaban siswa (lihat parseAngka)
 * @param {{satuBenda?: boolean}} opsi satuBenda = bandingkan dengan luas satu benda (langkah "jumlah")
 * @returns {string|null} kode miskonsepsi
 */
export function deteksiMiskonsepsi(kandidat, soal, opsi = {}) {
  const kunci = opsi.satuBenda
    ? luasPermukaan({ ...soal.diketahui, pi: soal.pi, bagian: soal.bagian })
    : kunciJawaban(soal);
  for (const [kode, nilai] of polaMiskonsepsi(soal, opsi)) {
    if (cocok(nilai, kunci)) continue; // pola yang kebetulan sama dengan kunci diabaikan
    if (kandidat.some((n) => cocok(n, nilai))) return kode;
  }
  return null;
}
