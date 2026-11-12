import { describe, it, expect } from 'vitest';
import { SOAL, SOAL_CADANGAN, soalPerLevel, levelTerbuka } from '../data/soal.js';
import { SOAL_KESIAPAN } from '../data/cekKesiapan.js';
import { CONTOH } from '../data/contoh.js';
import { kunciJawaban, luasPermukaan, bulatkan } from '../lib/rumus.js';
import { pecahKata, cekTanda, normalKata } from '../lib/tanda.js';

// Angka dari docs/KONTEN.md §4. Jika soal diubah, ubah dokumen dan tabel ini bersamaan.
const KUNCI_KONTEN = {
  'L1-1': 748,
  'L1-2': 2992,
  'L1-3': 942,
  'L1-4': 528,
  'L2-1': 748,
  'L2-2': 814,
  'L2-3': 2198,
  'L2-4': 2112,
  'L3-1': 220,
  'L3-2': 3256,
  'L3-3': 297000,
  'L3-4': 29700,
  'L3-5': 1130.4,
};

describe('bank soal = KONTEN.md', () => {
  it.each([...SOAL, ...SOAL_CADANGAN].map((s) => [s.id, s]))('%s', (id, soal) => {
    expect(kunciJawaban(soal)).toBe(KUNCI_KONTEN[id]);
  });

  it('setiap level berisi 4 soal', () => {
    for (const level of [1, 2, 3]) expect(soalPerLevel(level)).toHaveLength(4);
  });

  it('id unik', () => {
    const id = SOAL.map((s) => s.id);
    expect(new Set(id).size).toBe(id.length);
  });

  it('setiap frasa penting benar-benar ada di teks soal', () => {
    for (const soal of [...SOAL, ...SOAL_CADANGAN]) {
      const kata = new Set(pecahKata(soal.teks).map(normalKata));
      for (const frasa of soal.tanda) {
        for (const k of frasa.split(/\s+/).map(normalKata)) {
          expect(kata.has(k), `${soal.id}: "${k}"`).toBe(true);
        }
      }
    }
  });

  it('refleksi memiliki pilihan tepat yang valid', () => {
    for (const s of SOAL.filter((x) => x.refleksi)) {
      expect(s.refleksi.pilihan[s.refleksi.tepat]).toBeTruthy();
    }
  });
});

describe('levelTerbuka', () => {
  it('level 1 selalu terbuka; level 2 terbuka setelah semua soal level 1 selesai', () => {
    expect(levelTerbuka(1, {})).toBe(true);
    expect(levelTerbuka(2, {})).toBe(false);
    const hasil = Object.fromEntries(soalPerLevel(1).map((s) => [s.id, { selesai: true }]));
    expect(levelTerbuka(2, hasil)).toBe(true);
    expect(levelTerbuka(3, hasil)).toBe(false);
  });
});

describe('Cek Kesiapan', () => {
  it('kunci sesuai KONTEN.md', () => {
    const tepat = SOAL_KESIAPAN.map((s) => s.pilihan[s.tepat]);
    expect(tepat).toEqual(['7 cm', '154 cm²', '44 cm', '314 cm²']);
  });
});

describe('Contoh terurai', () => {
  it('hasil akhir tiap contoh = rumus', () => {
    expect(bulatkan(luasPermukaan(CONTOH[0].data))).toBe(748);
    expect(bulatkan(luasPermukaan(CONTOH[1].data))).toBe(682);
    expect(bulatkan(luasPermukaan(CONTOH[2].data))).toBe(346.5);
  });

  it('kunci kotak isian benar', () => {
    const isian = CONTOH.flatMap((c) => c.langkah.filter((l) => l.isian).map((l) => l.isian.kunci));
    expect(isian).toEqual([7, 528, 38.5, 308, 346.5]);
  });
});

describe('penanda soal cerita', () => {
  it('frasa ditemukan bila semua katanya ditandai', () => {
    const token = pecahKata('Ember berdiameter 28 cm dan tinggi 30 cm.');
    const idx = (kata) => token.findIndex((t) => normalKata(t) === kata);
    const hasil = cekTanda(token, [idx('tinggi'), idx('30')], ['tinggi 30 cm', 'berdiameter 28 cm']);
    expect(hasil.ditemukan).toEqual([]);
    const hasil2 = cekTanda(
      token,
      token.map((_, i) => i),
      ['tinggi 30 cm', 'berdiameter 28 cm'],
    );
    expect(hasil2.ditemukan).toHaveLength(2);
  });
});
