import { describe, it, expect } from 'vitest';
import { parseAngka, formatAngka, formatRupiah } from '../lib/angka.js';

const kandidat = (s) => parseAngka(s).kandidat;

describe('parseAngka', () => {
  it('bilangan bulat', () => {
    expect(kandidat('2992')).toEqual([2992]);
    expect(kandidat(' 748 ')).toEqual([748]);
  });

  it('koma sebagai desimal', () => {
    expect(kandidat('11,88')).toEqual([11.88]);
    expect(kandidat('2992,0')).toEqual([2992]);
    expect(kandidat('1.130,4')).toEqual([1130.4]);
  });

  it('titik dengan 1–2 digit = desimal', () => {
    expect(kandidat('11.88')).toEqual([11.88]);
    expect(kandidat('346.5')).toEqual([346.5]);
    expect(kandidat('1234.567')).toEqual([1234.567]);
  });

  it('satu titik + 3 digit = ambigu (ribuan atau desimal)', () => {
    expect(kandidat('2.992')).toEqual([2992, 2.992]);
  });

  it('beberapa titik = pemisah ribuan', () => {
    expect(kandidat('1.234.567')).toEqual([1234567]);
  });

  it('Rp dan spasi diabaikan', () => {
    expect(kandidat('Rp297.000')).toEqual([297000, 297]);
    expect(kandidat('rp 297000')).toEqual([297000]);
    expect(kandidat('29 700')).toEqual([29700]);
  });

  it('bukan angka ditolak dengan pesan ramah', () => {
    for (const s of ['', '   ', 'abc', '12,3,4', '1.2.3', '7cm', ',5', '5,', null]) {
      const hasil = parseAngka(s);
      expect(hasil.ok, `masukan: ${s}`).toBe(false);
      expect(hasil.pesan).toMatch(/angka/);
    }
  });
});

describe('formatAngka', () => {
  it('format Indonesia', () => {
    expect(formatAngka(2992)).toBe('2.992');
    expect(formatAngka(11.88)).toBe('11,88');
    expect(formatAngka(1130.4)).toBe('1.130,4');
    expect(formatAngka(748)).toBe('748');
  });

  it('rupiah', () => {
    expect(formatRupiah(297000)).toBe('Rp297.000');
  });
});
