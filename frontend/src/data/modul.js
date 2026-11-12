// Urutan belajar: gambar → contoh → latihan sendiri (GL01). Lihat docs/PRD.md §6.
export const DAFTAR_MODUL = [
  { id: 'cek-kesiapan', no: 0, judul: 'Cek Kesiapan', ringkas: 'Ingat lagi jari-jari dan lingkaran' },
  { id: 'kenali-tabung', no: 1, judul: 'Kenali Tabung', ringkas: 'Putar dan ketuk bagian-bagian tabung' },
  { id: 'buka-tabung', no: 2, judul: 'Buka Tabung', ringkas: 'Lihat tabung menjadi jaring-jaring' },
  { id: 'laboratorium', no: '2b', judul: 'Laboratorium Tabung', ringkas: 'Ubah r dan t, lihat luasnya berubah' },
  { id: 'asal-rumus', no: 3, judul: 'Asal Rumus', ringkas: 'Dari mana datangnya angka 2?' },
  { id: 'contoh', no: 4, judul: 'Contoh Soal', ringkas: 'Ikuti langkah demi langkah' },
  { id: 'arena', no: 5, judul: 'Arena Latihan', ringkas: 'Kumpulkan bintang di 3 level' },
  { id: 'rangkuman', no: 6, judul: 'Rangkuman', ringkas: 'Semua rumus dalam satu layar' },
];

export function cariModul(id) {
  return DAFTAR_MODUL.find((m) => m.id === id);
}
