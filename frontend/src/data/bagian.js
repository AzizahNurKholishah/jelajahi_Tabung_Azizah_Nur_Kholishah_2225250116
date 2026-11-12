// Nama & warna tiap bagian tabung (docs/DESAIN.md §2.1, §7). Teks dari docs/KONTEN.md §3 M1.
export const BAGIAN_TABUNG = {
  alas: { nama: 'Alas', singkat: 'Alas', token: '--c-alas', teks: 'Lingkaran di bawah.' },
  tutup: {
    nama: 'Tutup',
    singkat: 'Tutup',
    token: '--c-tutup',
    teks: 'Lingkaran di atas. Ukurannya sama dengan alas.',
  },
  selimut: {
    nama: 'Selimut',
    singkat: 'Selimut',
    token: '--c-selimut',
    teks: 'Bagian lengkung yang mengelilingi tabung.',
  },
  r: { nama: 'Jari-jari (r)', singkat: 'r', token: '--c-jari', teks: 'Dari titik pusat ke tepi lingkaran.' },
  t: { nama: 'Tinggi (t)', singkat: 't', token: '--c-tinggi', teks: 'Jarak alas ke tutup.' },
};

export const SEMUA_BAGIAN = ['alas', 'tutup', 'selimut', 'r', 't'];

export const TAMPIL_SEMUA = Object.freeze({ alas: true, tutup: true, selimut: true });
