// Penyelesaian berlangkah (scaffold, F6) dan pemeriksaan per langkah.
// ① diketahui → ② bagian → ③ hitung → ④ jumlah (+ satuan) → ⑤ jawaban akhir (bila ada pengali/harga).
// Fading per level (GL05): level 2 tanpa ③, level 3 hanya ②, ④, ⑤ — langkah lain bisa dibuka siswa.
import { formatAngka } from './angka.js';
import { bulatkan, jariJari, kelilingLingkaran, kunciJawaban, luasLingkaran, luasPermukaan, luasSelimut } from './rumus.js';
import { cocok, deteksiMiskonsepsi, faktorAkhir, periksaMasukan, pesanMiskonsepsi, satuanLuas } from './periksa.js';

export const LANGKAH_WAJIB_LEVEL = {
  1: ['diketahui', 'bagian', 'hitung', 'jumlah', 'akhir'],
  2: ['diketahui', 'bagian', 'jumlah', 'akhir'],
  3: ['bagian', 'jumlah', 'akhir'],
};

const teksPi = (pi) => (pi === '22/7' ? '22/7' : '3,14');
const f = (n) => formatAngka(bulatkan(n));

export function buatLangkah(soal, { tampilSemua = false } = {}) {
  const { d, t } = soal.diketahui;
  const r = jariJari(soal.diketahui);
  const { pi } = soal;
  const sp = soal.satuanPanjang ?? 'cm';
  const sl = satuanLuas(soal);
  const ada = (b) => soal.bagian.includes(b);
  const lingkaran = luasLingkaran(r, pi);
  const selimut = luasSelimut(r, t, pi);
  const L = luasPermukaan({ r, t, pi, bagian: soal.bagian });
  const wajib = new Set(LANGKAH_WAJIB_LEVEL[soal.level]);

  const daftar = [];

  daftar.push({
    id: 'diketahui',
    judul: 'Apa yang diketahui?',
    isian: [
      { kunci: 'r', label: d != null ? `d = ${f(d)} ${sp}, jadi r =` : 'Jari-jari r =', nilai: r, satuan: sp },
      { kunci: 't', label: 'Tinggi t =', nilai: t, satuan: sp },
    ],
    petunjuk: [
      d != null
        ? 'Yang diketahui adalah diameter. Ingat: jari-jari = diameter ÷ 2.'
        : 'Cari angka jari-jari dan tinggi pada soal.',
      d != null ? `r = ${f(d)} ÷ 2 = ${f(r)} ${sp}; t = ${f(t)} ${sp}` : `r = ${f(r)} ${sp}; t = ${f(t)} ${sp}`,
    ],
  });

  daftar.push({
    id: 'bagian',
    judul: 'Bagian mana yang dihitung?',
    jenis: 'bagian',
    kunciBagian: soal.bagian,
    petunjuk: [
      'Bayangkan bendanya. Apakah ada tutupnya? Apakah bagian lengkungnya dihitung?',
      `Alas ${ada('alas') ? '✓' : '✗'} · Tutup ${ada('tutup') ? '✓' : '✗'} · Selimut ${ada('selimut') ? '✓' : '✗'}`,
    ],
  });

  const isianHitung = [];
  const caraHitung = [];
  if (ada('alas') || ada('tutup')) {
    isianHitung.push({ kunci: 'lingkaran', label: 'Luas satu lingkaran (πr²) =', nilai: bulatkan(lingkaran), satuan: sl });
    caraHitung.push(`πr² = ${teksPi(pi)} × ${f(r)} × ${f(r)} = ${f(lingkaran)}`);
  }
  if (ada('selimut')) {
    isianHitung.push({ kunci: 'selimut', label: 'Luas selimut (2πrt) =', nilai: bulatkan(selimut), satuan: sl });
    caraHitung.push(`2πrt = 2 × ${teksPi(pi)} × ${f(r)} × ${f(t)} = ${f(selimut)}`);
  }
  daftar.push({
    id: 'hitung',
    judul: 'Hitung luas tiap bagian',
    isian: isianHitung,
    petunjuk: [`Luas lingkaran = πr². Luas selimut = 2πrt. Pakai π = ${teksPi(pi)}.`, caraHitung.join(' ; ')],
  });

  const suku = [ada('alas') && f(lingkaran), ada('tutup') && f(lingkaran), ada('selimut') && f(selimut)].filter(Boolean);
  daftar.push({
    id: 'jumlah',
    judul: soal.akhir ? 'Luas permukaan satu benda' : 'Jumlahkan & tulis satuannya',
    isian: [{ kunci: 'L', label: 'L =', nilai: bulatkan(L) }],
    satuan: sl,
    pilihanSatuan: [sp, sl, `${sp}³`],
    petunjuk: [
      'Jumlahkan luas semua bagian yang kamu centang. Luas memakai satuan persegi.',
      `${suku.join(' + ')} = ${f(L)} ${sl}`,
    ],
  });

  if (soal.akhir) {
    const kunci = kunciJawaban(soal);
    const rupiah = soal.akhir.satuan === 'Rp';
    daftar.push({
      id: 'akhir',
      judul: 'Jawab pertanyaannya',
      isian: [
        {
          kunci: 'akhir',
          label: soal.akhir.label,
          nilai: kunci,
          awalan: rupiah ? 'Rp' : undefined,
          satuan: rupiah ? undefined : soal.akhir.satuan,
        },
      ],
      petunjuk: [soal.akhir.petunjuk, `${f(L)} × ${formatAngka(faktorAkhir(soal))} = ${rupiah ? 'Rp' : ''}${f(kunci)}`],
    });
  }

  return daftar.filter((l) => tampilSemua || wajib.has(l.id));
}

function periksaBagian(langkah, jawaban) {
  const pilih = new Set(jawaban.bagian ?? []);
  const kunci = new Set(langkah.kunciBagian);
  const sama = pilih.size === kunci.size && [...pilih].every((b) => kunci.has(b));
  if (sama) return { benar: true, pesan: null, kode: null };

  let pesan;
  let kode = 'BAGIAN';
  if (pilih.size === 0) pesan = 'Centang minimal satu bagian, ya.';
  else if (pilih.has('tutup') && !kunci.has('tutup') && kunci.has('alas')) {
    kode = 'MK2';
    pesan = pesanMiskonsepsi('MK2');
  } else if (kunci.has('tutup') && !pilih.has('tutup') && pilih.has('alas')) {
    kode = 'MK4';
    pesan = pesanMiskonsepsi('MK4');
  } else if (kunci.has('selimut') && !pilih.has('selimut')) pesan = 'Selimut (bagian lengkung) juga perlu dihitung.';
  else if (kunci.size === 1 && kunci.has('selimut')) pesan = 'Soal ini hanya menanyakan bagian lengkungnya (selimut).';
  else if (kunci.has('alas') && !pilih.has('alas')) pesan = 'Alasnya juga perlu dihitung.';
  else pesan = 'Coba bayangkan lagi bendanya.';
  return { benar: false, pesan, kode };
}

/** Miskonsepsi khusus per isian (selain yang dideteksi pada jawaban akhir). */
function deteksiIsian(langkahId, kunciIsian, kandidat, soal) {
  const { d, t } = soal.diketahui;
  const r = jariJari(soal.diketahui);
  const { pi } = soal;
  const sama = (nilai) => kandidat.some((n) => cocok(n, nilai));

  if (langkahId === 'diketahui' && kunciIsian === 'r' && d != null && sama(d)) return 'MK1';
  if (langkahId === 'hitung' && kunciIsian === 'lingkaran') {
    if (sama(kelilingLingkaran(r, pi))) return 'KELILING';
    if (d != null && sama(luasLingkaran(d, pi))) return 'MK1';
    if (sama(2 * luasLingkaran(r, pi))) return 'DUA_LINGKARAN';
  }
  if (langkahId === 'hitung' && kunciIsian === 'selimut') {
    if (sama(luasSelimut(r, t, pi) / 2)) return 'MK5';
    if (d != null && sama(luasSelimut(d, t, pi))) return 'MK1';
  }
  if (langkahId === 'jumlah') return deteksiMiskonsepsi(kandidat, soal, { satuBenda: true });
  if (langkahId === 'akhir') return deteksiMiskonsepsi(kandidat, soal);
  return null;
}

const PESAN_KHUSUS = {
  KELILING: 'Itu keliling lingkaran (2πr). Luas lingkaran = πr².',
  DUA_LINGKARAN: 'Itu luas dua lingkaran. Tulis luas satu lingkaran saja di sini.',
};

/**
 * @param {object} jawaban { [kunciIsian]: string, satuan?: string, bagian?: string[] }
 * @returns {{benar: boolean, pesan: string|null, kode: string|null, perIsian: Record<string, boolean>}}
 */
export function periksaLangkah(langkah, jawaban, soal) {
  if (langkah.jenis === 'bagian') return { ...periksaBagian(langkah, jawaban), perIsian: {} };

  const perIsian = {};
  let pesan = null;
  let kode = null;
  for (const isian of langkah.isian) {
    const hasil = periksaMasukan(jawaban[isian.kunci], isian.nilai);
    perIsian[isian.kunci] = hasil.status === 'benar';
    if (hasil.status === 'bukan-angka') {
      pesan ??= hasil.pesan;
    } else if (hasil.status === 'salah' && !kode) {
      const k = deteksiIsian(langkah.id, isian.kunci, hasil.kandidat, soal);
      if (k) {
        kode = k;
        pesan = PESAN_KHUSUS[k] ?? pesanMiskonsepsi(k, soal);
      }
    }
  }

  let benar = Object.values(perIsian).every(Boolean);
  if (benar && langkah.pilihanSatuan && jawaban.satuan !== langkah.satuan) {
    benar = false;
    if (jawaban.satuan) {
      kode = 'MK7';
      pesan = pesanMiskonsepsi('MK7', soal);
    } else {
      pesan = 'Angkanya sudah tepat! Sekarang pilih satuannya.';
    }
  }
  if (!benar && !pesan) pesan = 'Belum tepat. Coba periksa lagi perhitunganmu.';
  return { benar, pesan: benar ? null : pesan, kode: benar ? null : kode, perIsian };
}

/** Ringkasan pembahasan (F9): rumus → substitusi → hasil. */
export function pembahasan(soal) {
  const { t } = soal.diketahui;
  const r = jariJari(soal.diketahui);
  const sl = satuanLuas(soal);
  const ada = (b) => soal.bagian.includes(b);
  const L = luasPermukaan({ r, t, pi: soal.pi, bagian: soal.bagian });

  let rumus;
  let substitusi;
  const p = teksPi(soal.pi);
  if (ada('alas') && ada('tutup')) {
    rumus = 'L = 2πr² + 2πrt = 2πr(r + t)';
    substitusi = `L = 2 × ${p} × ${f(r)} × (${f(r)} + ${f(t)})`;
  } else if (ada('alas')) {
    rumus = 'L = πr² + 2πrt';
    substitusi = `L = ${p} × ${f(r)} × ${f(r)} + 2 × ${p} × ${f(r)} × ${f(t)}`;
  } else {
    rumus = 'L = 2πrt';
    substitusi = `L = 2 × ${p} × ${f(r)} × ${f(t)}`;
  }
  const baris = [rumus, substitusi, `L = ${f(L)} ${sl}`];
  if (soal.akhir) {
    const kunci = kunciJawaban(soal);
    const rupiah = soal.akhir.satuan === 'Rp';
    baris.push(
      `${soal.akhir.label} ${f(L)} × ${formatAngka(faktorAkhir(soal))} = ${rupiah ? 'Rp' : ''}${f(kunci)}${rupiah ? '' : ` ${soal.akhir.satuan}`}`,
    );
  }
  if (soal.diketahui.d != null) baris.unshift(`r = ${f(soal.diketahui.d)} ÷ 2 = ${f(r)} ${soal.satuanPanjang ?? 'cm'}`);
  return baris;
}
