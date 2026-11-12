import { describe, it, expect } from 'vitest';
import {
  bulatkan,
  jariJari,
  luasLingkaran,
  kelilingLingkaran,
  luasSelimut,
  luasPermukaan,
  kunciJawaban,
} from '../lib/rumus.js';

const TERTUTUP = ['alas', 'tutup', 'selimut'];
const TANPA_TUTUP = ['alas', 'selimut'];
const SELIMUT = ['selimut'];

const lp = (args) => bulatkan(luasPermukaan(args));

describe('prasyarat lingkaran (Cek Kesiapan, KONTEN.md §4)', () => {
  it('r = d ÷ 2', () => {
    expect(jariJari({ d: 14 })).toBe(7);
    expect(jariJari({ r: 5, d: 99 })).toBe(5);
    expect(() => jariJari({})).toThrow();
  });

  it('luas dan keliling lingkaran', () => {
    expect(bulatkan(luasLingkaran(7, '22/7'))).toBe(154);
    expect(bulatkan(kelilingLingkaran(7, '22/7'))).toBe(44);
    expect(bulatkan(luasLingkaran(10, '3.14'))).toBe(314);
  });

  it('π yang tidak dikenal ditolak', () => {
    expect(() => luasLingkaran(7, '3')).toThrow();
  });
});

describe('luas selimut = keliling alas × t', () => {
  it('sama dengan 2πrt', () => {
    expect(bulatkan(luasSelimut(7, 10, '22/7'))).toBe(440);
    expect(bulatkan(luasSelimut(7, 12, '22/7'))).toBe(528);
  });
});

describe('contoh terurai M4 (KONTEN.md §3)', () => {
  it('contoh 1: tertutup r=7 t=10 → 748', () => {
    expect(lp({ r: 7, t: 10, pi: '22/7' })).toBe(748);
  });
  it('contoh 2: tanpa tutup d=14 t=12 → 682', () => {
    expect(lp({ d: 14, t: 12, pi: '22/7', bagian: TANPA_TUTUP })).toBe(682);
  });
  it('contoh 3: tanpa tutup r=3,5 t=14 → 346,5', () => {
    expect(lp({ r: 3.5, t: 14, pi: '22/7', bagian: TANPA_TUTUP })).toBe(346.5);
  });
});

describe('bank soal level 1–2 (KONTEN.md §4)', () => {
  it.each([
    ['L1-1', { r: 7, t: 10, pi: '22/7', bagian: TERTUTUP }, 748],
    ['L1-2', { r: 14, t: 20, pi: '22/7', bagian: TERTUTUP }, 2992],
    ['L1-3', { r: 10, t: 5, pi: '3.14', bagian: TERTUTUP }, 942],
    ['L1-4', { r: 7, t: 12, pi: '22/7', bagian: SELIMUT }, 528],
    ['L2-1', { d: 14, t: 10, pi: '22/7', bagian: TERTUTUP }, 748],
    ['L2-2', { r: 7, t: 15, pi: '22/7', bagian: TANPA_TUTUP }, 814],
    ['L2-3', { d: 20, t: 30, pi: '3.14', bagian: TANPA_TUTUP }, 2198],
    ['L2-4', { d: 28, t: 10, pi: '22/7', bagian: TERTUTUP }, 2112],
  ])('%s', (_id, args, kunci) => {
    expect(lp(args)).toBe(kunci);
  });

  it('rumus faktor 2πr(r + t) sama dengan penjumlahan bagian', () => {
    const r = 14;
    const t = 20;
    expect(lp({ r, t, pi: '22/7' })).toBe(bulatkan(2 * (22 / 7) * r * (r + t)));
  });
});

describe('kunciJawaban untuk soal cerita level 3 (KONTEN.md §4)', () => {
  it.each([
    ['L3-1 label kaleng', { diketahui: { d: 7, t: 10 }, pi: '22/7', bagian: SELIMUT }, 220],
    ['L3-2 ember', { diketahui: { d: 28, t: 30 }, pi: '22/7', bagian: TANPA_TUTUP }, 3256],
    [
      'L3-3 biaya cat tangki',
      { diketahui: { r: 0.7, t: 2 }, pi: '22/7', bagian: TERTUTUP, hargaPerSatuan: 25000 },
      297000,
    ],
    ['L3-4 50 kaleng', { diketahui: { r: 7, t: 10 }, pi: '22/7', bagian: TANPA_TUTUP, pengali: 50 }, 29700],
    ['L3-5 kaleng biskuit', { diketahui: { d: 20, t: 8 }, pi: '3.14', bagian: TERTUTUP }, 1130.4],
  ])('%s', (_id, soal, kunci) => {
    expect(kunciJawaban(soal)).toBe(kunci);
  });

  it('luas tangki L3-3 = 11,88 m²', () => {
    expect(lp({ r: 0.7, t: 2, pi: '22/7' })).toBe(11.88);
  });
});

describe('validasi masukan', () => {
  it('bagian yang tidak dikenal ditolak', () => {
    expect(() => luasPermukaan({ r: 7, t: 10, pi: '22/7', bagian: ['atap'] })).toThrow();
  });
});
