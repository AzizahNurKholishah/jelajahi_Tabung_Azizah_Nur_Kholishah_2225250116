// Matematika animasi tabung 3D (docs/ARSITEKTUR.md §7.2). Logika murni: tanpa three.js/DOM.
//
// Sistem koordinat: sumbu y ke atas, alas di y = 0, tutup di y = t, sumbu tabung melalui (0, y, 0).
// Selimut diparameterkan oleh panjang busur u ∈ [-L/2, L/2] (L = 2πr), diukur dari garis depan (0, y, r).
// Garis sambungan ("digunting di sini") ada di belakang (u = ±L/2).

const EPS = 1e-4;

export const SEGMEN_BAWAAN = 48;

const batasi = (x, min, max) => Math.min(max, Math.max(min, x));

/**
 * Posisi titik selimut dengan kelengkungan k (1 = tergulung menjadi tabung, 0 = datar).
 * Selimut dilengkungkan sebagai busur lingkaran berjari-jari R = r/k yang menyinggung bidang z = r
 * di garis depan, sehingga PANJANG BUSUR TETAP = L untuk semua k. Ini inti pedagogisnya:
 * panjang persegi panjang selimut = keliling alas.
 */
export function posisiSelimut(u, y, k, r) {
  if (k < EPS) return [u, y, r];
  const R = r / k;
  const sudut = u / R;
  return [R * Math.sin(sudut), y, r - R * (1 - Math.cos(sudut))];
}

/**
 * Membagi progres buka (0..1) menjadi fase:
 * 0–0,3  : tutup & alas membuka seperti engsel (0 → 90°), selimut masih tergulung
 * 0,3–0,9: selimut dibuka (k: 1 → 0)
 * 0,9–1  : sudah datar (kamera pindah ke tampak depan)
 */
export function fasaBuka(progres) {
  const p = batasi(progres, 0, 1);
  const sudutEngsel = (Math.min(p, 0.3) / 0.3) * (Math.PI / 2);
  let k;
  if (p <= 0.3) k = 1;
  else if (p >= 0.9) k = 0;
  else k = 1 - (p - 0.3) / 0.6;
  return { sudutEngsel, k, datar: p >= 0.9 };
}

/** Pusat tutup saat berputar pada engsel di (0, t, r). sudut 0 = mendatar di atas tabung. */
export function pusatTutup(r, t, sudut) {
  return [0, t + r * Math.sin(sudut), r - r * Math.cos(sudut)];
}

/** Pusat alas saat berputar pada engsel di (0, 0, r). */
export function pusatAlas(r, sudut) {
  return [0, -r * Math.sin(sudut), r - r * Math.cos(sudut)];
}

/**
 * Alas digelindingkan di bawah tepi bawah persegi panjang selimut (y = 0, bidang z = r),
 * dari ujung kiri (u = -L/2) ke ujung kanan. g: 0..1. Setelah g = 1 alas tepat berputar sekali,
 * jadi jejaknya = keliling = panjang selimut.
 */
export function posisiGelinding(r, g) {
  const L = 2 * Math.PI * r;
  const jarak = batasi(g, 0, 1) * L;
  return { pusat: [-L / 2 + jarak, -r, r], sudut: jarak / r, jarak };
}

/** Mengisi array posisi verteks selimut: (segmen + 1) kolom × 2 baris (y = 0 dan y = t). */
export function isiPosisiSelimut(posisi, r, t, k, segmen = SEGMEN_BAWAAN) {
  const L = 2 * Math.PI * r;
  for (let i = 0; i <= segmen; i++) {
    const u = -L / 2 + (L * i) / segmen;
    for (let j = 0; j < 2; j++) {
      const [x, y, z] = posisiSelimut(u, j * t, k, r);
      const idx = (i * 2 + j) * 3;
      posisi[idx] = x;
      posisi[idx + 1] = y;
      posisi[idx + 2] = z;
    }
  }
  return posisi;
}

export function indeksSelimut(segmen = SEGMEN_BAWAAN) {
  const indeks = [];
  for (let i = 0; i < segmen; i++) {
    const a = i * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indeks.push(a, c, b, b, c, d);
  }
  return indeks;
}

/** Posisi kamera: target + arah (dinormalkan) × jarak. */
export function hitungPosisiKamera(target, jarak, arah) {
  const panjang = Math.hypot(...arah) || 1;
  return target.map((v, i) => v + (arah[i] / panjang) * jarak);
}
