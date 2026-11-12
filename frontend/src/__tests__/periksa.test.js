import { describe, it, expect } from 'vitest';
import { cocok, periksaMasukan, deteksiMiskonsepsi } from '../lib/periksa.js';
import { tingkatPetunjuk, bintangDariPetunjuk } from '../lib/petunjuk.js';
import { buatLangkah, periksaLangkah, pembahasan } from '../lib/langkahSoal.js';
import { SOAL } from '../data/soal.js';

const soal = (id) => SOAL.find((s) => s.id === id);
const langkah = (id, langkahId, opsi = { tampilSemua: true }) => buatLangkah(soal(id), opsi).find((l) => l.id === langkahId);

describe('periksaMasukan', () => {
  it('menerima format Indonesia dan π = 3,14 untuk soal π = 22/7', () => {
    expect(periksaMasukan('748', 748).status).toBe('benar');
    expect(periksaMasukan('747,32', 748).status).toBe('benar'); // dihitung dengan 3,14
    expect(periksaMasukan('2.992', 2992).status).toBe('benar');
    expect(periksaMasukan('11.88', 11.88).status).toBe('benar');
    expect(periksaMasukan('700', 748).status).toBe('salah');
    expect(periksaMasukan('tujuh', 748).status).toBe('bukan-angka');
  });

  it('toleransi minimal 0,01 untuk angka kecil', () => {
    expect(cocok(3.5, 3.5)).toBe(true);
    expect(cocok(3.6, 3.5)).toBe(false);
  });
});

describe('deteksiMiskonsepsi (KONTEN.md §5)', () => {
  it.each([
    ['L2-1', 2112, 'MK1'], // diameter dipakai sebagai jari-jari
    ['L2-1', 440, 'MK3'], // hanya selimut
    ['L2-1', 594, 'MK4'], // hanya satu lingkaran
    ['L2-1', 1540, 'MK6'], // rumus volume
    ['L2-2', 968, 'MK2'], // tutup ikut dihitung
    ['L1-1', 528, 'MK5'], // selimut memakai πrt
    ['L3-4', 594, 'MK8'], // lupa dikali 50
    ['L3-3', 11.88, 'MK8'], // lupa dikali harga
  ])('%s: jawaban %d → %s', (id, nilai, kode) => {
    expect(deteksiMiskonsepsi([nilai], soal(id))).toBe(kode);
  });

  it('jawaban benar tidak dianggap miskonsepsi', () => {
    expect(deteksiMiskonsepsi([748], soal('L2-1'))).toBeNull();
  });
});

describe('buatLangkah — fading per level', () => {
  const id = (s, opsi) => buatLangkah(soal(s), opsi).map((l) => l.id);
  it('level 1: semua langkah', () => {
    expect(id('L1-1')).toEqual(['diketahui', 'bagian', 'hitung', 'jumlah']);
  });
  it('level 2: tanpa langkah hitung', () => {
    expect(id('L2-1')).toEqual(['diketahui', 'bagian', 'jumlah']);
  });
  it('level 3: hanya bagian, jumlah, jawaban akhir', () => {
    expect(id('L3-1')).toEqual(['bagian', 'jumlah']);
    expect(id('L3-4')).toEqual(['bagian', 'jumlah', 'akhir']);
  });
  it('"tampilkan semua langkah" membuka langkah bantu', () => {
    expect(id('L3-4', { tampilSemua: true })).toEqual(['diketahui', 'bagian', 'hitung', 'jumlah', 'akhir']);
  });
  it('langkah hitung hanya menanyakan bagian yang dihitung', () => {
    expect(langkah('L1-4', 'hitung').isian.map((i) => i.kunci)).toEqual(['selimut']);
    expect(langkah('L2-2', 'hitung').isian.map((i) => i.kunci)).toEqual(['lingkaran', 'selimut']);
  });
});

describe('periksaLangkah', () => {
  it('① diameter ditulis sebagai jari-jari → MK1', () => {
    const h = periksaLangkah(langkah('L2-1', 'diketahui'), { r: '14', t: '10' }, soal('L2-1'));
    expect(h.benar).toBe(false);
    expect(h.kode).toBe('MK1');
    expect(h.perIsian).toEqual({ r: false, t: true });
  });

  it('② centang tutup pada tabung tanpa tutup → MK2', () => {
    const h = periksaLangkah(langkah('L2-2', 'bagian'), { bagian: ['alas', 'tutup', 'selimut'] }, soal('L2-2'));
    expect(h.kode).toBe('MK2');
  });

  it('② lupa tutup pada tabung tertutup → MK4', () => {
    const h = periksaLangkah(langkah('L1-1', 'bagian'), { bagian: ['alas', 'selimut'] }, soal('L1-1'));
    expect(h.kode).toBe('MK4');
  });

  it('② benar', () => {
    const h = periksaLangkah(langkah('L1-1', 'bagian'), { bagian: ['selimut', 'tutup', 'alas'] }, soal('L1-1'));
    expect(h.benar).toBe(true);
  });

  it('③ menulis keliling sebagai luas lingkaran', () => {
    const h = periksaLangkah(langkah('L1-1', 'hitung'), { lingkaran: '44', selimut: '440' }, soal('L1-1'));
    expect(h.kode).toBe('KELILING');
    expect(h.pesan).toMatch(/keliling/i);
  });

  it('④ angka benar tetapi satuan salah → MK7', () => {
    const h = periksaLangkah(langkah('L1-1', 'jumlah'), { L: '748', satuan: 'cm' }, soal('L1-1'));
    expect(h.benar).toBe(false);
    expect(h.kode).toBe('MK7');
  });

  it('④ angka benar tanpa memilih satuan → diminta memilih satuan, bukan MK7', () => {
    const h = periksaLangkah(langkah('L1-1', 'jumlah'), { L: '748' }, soal('L1-1'));
    expect(h.kode).toBeNull();
    expect(h.pesan).toMatch(/satuan/);
  });

  it('④ benar dengan satuan cm²', () => {
    expect(periksaLangkah(langkah('L1-1', 'jumlah'), { L: '748', satuan: 'cm²' }, soal('L1-1')).benar).toBe(true);
  });

  it('⑤ biaya tangki Rp297.000 (ditulis dengan titik ribuan)', () => {
    const l = langkah('L3-3', 'akhir');
    expect(periksaLangkah(l, { akhir: '297.000' }, soal('L3-3')).benar).toBe(true);
    expect(periksaLangkah(l, { akhir: '11,88' }, soal('L3-3')).kode).toBe('MK8');
  });

  it('bukan angka → pesan ramah', () => {
    const h = periksaLangkah(langkah('L1-1', 'jumlah'), { L: 'banyak', satuan: 'cm²' }, soal('L1-1'));
    expect(h.pesan).toBe('Tulis jawaban dengan angka, ya.');
  });
});

describe('petunjuk & bintang', () => {
  it('tingkat petunjuk naik setelah salah ke-2 atau saat diminta', () => {
    expect(tingkatPetunjuk(0, 0)).toBe(0);
    expect(tingkatPetunjuk(1, 0)).toBe(0);
    expect(tingkatPetunjuk(2, 0)).toBe(1);
    expect(tingkatPetunjuk(3, 0)).toBe(2);
    expect(tingkatPetunjuk(9, 0)).toBe(2);
    expect(tingkatPetunjuk(0, 1)).toBe(1);
  });
  it('bintang', () => {
    expect([0, 1, 2, 5].map(bintangDariPetunjuk)).toEqual([3, 2, 1, 1]);
  });
});

describe('pembahasan', () => {
  it('menampilkan rumus, substitusi, dan hasil bersatuan', () => {
    expect(pembahasan(soal('L2-1'))).toEqual([
      'r = 14 ÷ 2 = 7 cm',
      'L = 2πr² + 2πrt = 2πr(r + t)',
      'L = 2 × 22/7 × 7 × (7 + 10)',
      'L = 748 cm²',
    ]);
  });
  it('soal biaya menambahkan baris jawaban akhir', () => {
    expect(pembahasan(soal('L3-3')).at(-1)).toBe('Biaya = 11,88 × 25.000 = Rp297.000');
  });
});
