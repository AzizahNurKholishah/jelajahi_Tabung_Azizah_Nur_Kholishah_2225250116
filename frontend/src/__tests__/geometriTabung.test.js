import { describe, it, expect } from 'vitest';
import {
  posisiSelimut,
  fasaBuka,
  pusatTutup,
  pusatAlas,
  posisiGelinding,
  isiPosisiSelimut,
  indeksSelimut,
  hitungPosisiKamera,
} from '../lib/geometriTabung.js';

const jarak = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/** Panjang tepi bawah selimut, diukur sebagai polyline yang sangat rapat. */
function panjangTepi(r, k, n = 4000) {
  const L = 2 * Math.PI * r;
  let total = 0;
  let sebelum = posisiSelimut(-L / 2, 0, k, r);
  for (let i = 1; i <= n; i++) {
    const titik = posisiSelimut(-L / 2 + (L * i) / n, 0, k, r);
    total += jarak(sebelum, titik);
    sebelum = titik;
  }
  return total;
}

describe('posisiSelimut', () => {
  it('k = 1: semua titik berada di permukaan tabung berjari-jari r', () => {
    const r = 7;
    for (const u of [-20, -5, 0, 3, 21.9]) {
      const [x, , z] = posisiSelimut(u, 4, 1, r);
      expect(Math.hypot(x, z)).toBeCloseTo(r, 9);
    }
  });

  it('k = 0: selimut datar di bidang z = r dengan x = u', () => {
    expect(posisiSelimut(-12, 5, 0, 7)).toEqual([-12, 5, 7]);
  });

  it('garis depan (u = 0) tidak bergerak selama dibuka', () => {
    for (const k of [1, 0.6, 0.2, 0]) {
      const [x, , z] = posisiSelimut(0, 0, k, 7);
      expect(x).toBeCloseTo(0, 9);
      expect(z).toBeCloseTo(7, 9);
    }
  });

  it('k = 1: kedua ujung bertemu di garis sambungan belakang (0, y, -r)', () => {
    const r = 7;
    const L = 2 * Math.PI * r;
    const kiri = posisiSelimut(-L / 2, 0, 1, r);
    const kanan = posisiSelimut(L / 2, 0, 1, r);
    expect(jarak(kiri, kanan)).toBeCloseTo(0, 9);
    expect(kiri[2]).toBeCloseTo(-r, 9);
  });

  it('panjang selimut selalu 2πr untuk setiap kelengkungan', () => {
    for (const r of [1, 3.5, 7]) {
      for (const k of [1, 0.75, 0.5, 0.25, 0.01, 0]) {
        expect(panjangTepi(r, k) / (2 * Math.PI * r)).toBeCloseTo(1, 4);
      }
    }
  });
});

describe('fasaBuka', () => {
  it('awal: tertutup', () => {
    expect(fasaBuka(0)).toEqual({ sudutEngsel: 0, k: 1, datar: false });
  });
  it('0,3: engsel 90°, selimut masih tergulung', () => {
    const f = fasaBuka(0.3);
    expect(f.sudutEngsel).toBeCloseTo(Math.PI / 2, 9);
    expect(f.k).toBe(1);
  });
  it('0,6: selimut setengah terbuka', () => {
    expect(fasaBuka(0.6).k).toBeCloseTo(0.5, 9);
  });
  it('≥ 0,9: datar', () => {
    expect(fasaBuka(0.9)).toMatchObject({ k: 0, datar: true });
    expect(fasaBuka(1)).toMatchObject({ k: 0, datar: true });
  });
  it('nilai di luar 0..1 dibatasi', () => {
    expect(fasaBuka(-1)).toEqual(fasaBuka(0));
    expect(fasaBuka(2)).toEqual(fasaBuka(1));
  });
});

describe('engsel tutup & alas', () => {
  const r = 7;
  const t = 10;
  it('tertutup: pusat tutup (0, t, 0) dan alas (0, 0, 0)', () => {
    expect(pusatTutup(r, t, 0)).toEqual([0, t, 0]);
    expect(pusatAlas(r, 0)).toEqual([0, -0, 0]);
  });
  it('terbuka 90°: lingkaran menyinggung persegi panjang di atas dan bawah', () => {
    const tutup = pusatTutup(r, t, Math.PI / 2);
    const alas = pusatAlas(r, Math.PI / 2);
    expect(tutup[1]).toBeCloseTo(t + r, 9);
    expect(tutup[2]).toBeCloseTo(r, 9);
    expect(alas[1]).toBeCloseTo(-r, 9);
    expect(alas[2]).toBeCloseTo(r, 9);
  });
  it('jarak pusat ke engsel selalu r (tutup tidak berubah ukuran)', () => {
    for (const a of [0, 0.4, 1.2, Math.PI / 2]) {
      expect(jarak(pusatTutup(r, t, a), [0, t, r])).toBeCloseTo(r, 9);
      expect(jarak(pusatAlas(r, a), [0, 0, r])).toBeCloseTo(r, 9);
    }
  });
});

describe('posisiGelinding', () => {
  it('setelah satu putaran penuh, alas menempuh 2πr', () => {
    const r = 7;
    const awal = posisiGelinding(r, 0);
    const akhir = posisiGelinding(r, 1);
    expect(akhir.pusat[0] - awal.pusat[0]).toBeCloseTo(2 * Math.PI * r, 9);
    expect(akhir.sudut).toBeCloseTo(2 * Math.PI, 9);
  });
});

describe('geometri selimut', () => {
  it('jumlah verteks dan segitiga', () => {
    const segmen = 8;
    const posisi = isiPosisiSelimut(new Float32Array((segmen + 1) * 2 * 3), 7, 10, 1, segmen);
    expect(posisi.length).toBe(54);
    expect(indeksSelimut(segmen).length).toBe(segmen * 6);
    expect(posisi[1]).toBe(0);
    expect(posisi[4]).toBe(10);
  });
});

describe('hitungPosisiKamera', () => {
  it('menempatkan kamera sejauh `jarak` dari target', () => {
    const pos = hitungPosisiKamera([0, 5, 0], 10, [0, 0, 2]);
    expect(pos).toEqual([0, 5, 10]);
  });
});
