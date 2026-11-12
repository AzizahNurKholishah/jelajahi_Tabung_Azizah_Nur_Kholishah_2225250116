// Antrean log penelitian (docs/ARSITEKTUR.md §4.3, §8).
// Log disimpan dulu di IndexedDB, lalu dikirim ke backend Python saat online.
// Pengiriman idempoten (id unik dari klien), jadi aman dikirim ulang. Kegagalan TIDAK pernah mengganggu siswa.
import { get, update, del } from 'idb-keyval';

const ANTREAN = 'jelajahTabung.antreanLog';
const RIWAYAT = 'jelajahTabung.riwayatLog'; // salinan lokal untuk ekspor JSON cadangan
const MAKS = 5000;
const UKURAN_BATCH = 100;
const API = import.meta.env.VITE_API_URL || '/api';

/** UUID v4. crypto.randomUUID hanya ada di konteks aman (HTTPS/localhost), jadi sediakan cadangan. */
export function buatId() {
  if (globalThis.isSecureContext && crypto.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function keServer(e) {
  return {
    id: e.id,
    kode_siswa: e.kodeSiswa,
    kode_kelas: e.kodeKelas || null,
    waktu: e.waktu,
    layar: e.layar,
    soal: e.soal ?? null,
    langkah: e.langkah ?? null,
    aksi: e.aksi,
    jawaban: e.jawaban == null ? null : String(e.jawaban).slice(0, 200),
    benar: e.benar ?? null,
    miskonsepsi: e.miskonsepsi ?? null,
    tingkat_petunjuk: e.tingkatPetunjuk ?? null,
    durasi_ms: e.durasiMs == null ? null : Math.max(0, Math.round(e.durasiMs)),
  };
}

export async function catatLog(event) {
  const e = { id: buatId(), waktu: new Date().toISOString(), ...event };
  try {
    await update(ANTREAN, (a = []) => [...a, e].slice(-MAKS));
    await update(RIWAYAT, (a = []) => [...a, e].slice(-MAKS));
  } catch {
    return; // IndexedDB tidak tersedia (mis. mode privat): lewati saja
  }
  kirimAntrean();
}

let sedangKirim = false;

/** @returns {Promise<{terkirim: number, sisa: number, galat?: string}>} */
export async function kirimAntrean() {
  if (sedangKirim) return { terkirim: 0, sisa: await jumlahAntrean() };
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { terkirim: 0, sisa: await jumlahAntrean(), galat: 'offline' };
  }
  sedangKirim = true;
  let terkirim = 0;
  let galat;
  try {
    let antrean = (await get(ANTREAN)) ?? [];
    while (antrean.length) {
      const batch = antrean.slice(0, UKURAN_BATCH);
      const res = await fetch(`${API}/log/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: batch.map(keServer) }),
        // 30 detik: server gratis (Render) butuh ±30–50 detik untuk "bangun" setelah tidur.
        signal: AbortSignal.timeout ? AbortSignal.timeout(30000) : undefined,
      });
      if (!res.ok) {
        galat = `server ${res.status}`;
        break;
      }
      const id = new Set(batch.map((e) => e.id));
      await update(ANTREAN, (a = []) => a.filter((e) => !id.has(e.id)));
      terkirim += batch.length;
      antrean = (await get(ANTREAN)) ?? [];
    }
  } catch (e) {
    galat = e?.name === 'TimeoutError' ? 'server tidak menjawab' : 'server tidak terjangkau';
  } finally {
    sedangKirim = false;
  }
  return { terkirim, sisa: await jumlahAntrean(), galat };
}

export async function jumlahAntrean() {
  try {
    return ((await get(ANTREAN)) ?? []).length;
  } catch {
    return 0;
  }
}

export async function ambilRiwayat() {
  try {
    return (await get(RIWAYAT)) ?? [];
  } catch {
    return [];
  }
}

export async function hapusRiwayatLokal() {
  try {
    await del(RIWAYAT);
  } catch {
    // abaikan
  }
}

let sudahMulai = false;

export function mulaiPengirimOtomatis() {
  if (sudahMulai) return;
  sudahMulai = true;
  kirimAntrean();
  window.addEventListener('online', () => kirimAntrean());
  setInterval(() => {
    if (document.visibilityState === 'visible') kirimAntrean();
  }, 60_000);
}
