import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { SOAL, soalPerLevel } from '../data/soal.js';
import { catatLog } from './logger.js';

// Progres siswa di perangkat (docs/ARSITEKTUR.md §4.2). Tanpa akun, tanpa nama.
const KUNCI = 'jelajahTabung.v1';

export const PROGRES_AWAL = Object.freeze({
  versi: 1,
  modulSelesai: [],
  cekKesiapan: null, // { skor, total }
  arena: {}, // { [idSoal]: { selesai, bintang, petunjuk } }
  salahSatuan: false,
  peneliti: { kodeSiswa: '', kodeKelas: '' },
});

function muat() {
  try {
    const tersimpan = JSON.parse(localStorage.getItem(KUNCI));
    if (tersimpan?.versi === 1) return { ...PROGRES_AWAL, ...tersimpan };
  } catch {
    // data rusak / localStorage diblokir → mulai baru
  }
  return PROGRES_AWAL;
}

function reducer(state, aksi) {
  switch (aksi.type) {
    case 'selesaiModul':
      return state.modulSelesai.includes(aksi.id) ? state : { ...state, modulSelesai: [...state.modulSelesai, aksi.id] };
    case 'cekKesiapan':
      return { ...state, cekKesiapan: { skor: aksi.skor, total: aksi.total } };
    case 'simpanSoal': {
      const lama = state.arena[aksi.id];
      if (lama && lama.bintang >= aksi.bintang) return state; // simpan hasil terbaik
      return { ...state, arena: { ...state.arena, [aksi.id]: { selesai: true, bintang: aksi.bintang, petunjuk: aksi.petunjuk } } };
    }
    case 'salahSatuan':
      return state.salahSatuan ? state : { ...state, salahSatuan: true };
    case 'peneliti':
      return { ...state, peneliti: { kodeSiswa: aksi.kodeSiswa, kodeKelas: aksi.kodeKelas } };
    case 'reset':
      return { ...PROGRES_AWAL, peneliti: state.peneliti };
    default:
      return state;
  }
}

/** Lencana (docs/DESAIN.md §4 M6) dihitung dari progres, tidak disimpan terpisah. */
export function hitungLencana(state) {
  const lencana = [];
  const materi = ['kenali-tabung', 'buka-tabung', 'asal-rumus', 'contoh'];
  if (materi.every((m) => state.modulSelesai.includes(m))) {
    lencana.push({ id: 'penjelajah', nama: 'Penjelajah Tabung', alasan: 'Menyelesaikan semua materi' });
  }
  const semuaSoalSelesai = SOAL.every((s) => state.arena[s.id]?.selesai);
  if (semuaSoalSelesai && !state.salahSatuan) {
    lencana.push({ id: 'teliti', nama: 'Teliti', alasan: 'Semua soal selesai tanpa salah satuan' });
  }
  const level3 = soalPerLevel(3);
  const petunjukLevel3 = level3.reduce((s, x) => s + (state.arena[x.id]?.petunjuk ?? 0), 0);
  if (level3.every((s) => state.arena[s.id]?.selesai) && petunjukLevel3 <= 2) {
    lencana.push({ id: 'mandiri', nama: 'Mandiri', alasan: 'Level 3 selesai dengan paling banyak 2 petunjuk' });
  }
  return lencana;
}

const ProgresCtx = createContext(null);

export function ProgresProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, muat);

  useEffect(() => {
    try {
      localStorage.setItem(KUNCI, JSON.stringify(state));
    } catch {
      // abaikan: progres tetap ada selama halaman terbuka
    }
  }, [state]);

  const { kodeSiswa, kodeKelas } = state.peneliti;

  /** Log hanya dicatat bila kode siswa sudah diisi lewat Mode Peneliti (persetujuan sudah ada). */
  const catat = useCallback(
    (event) => {
      if (!kodeSiswa) return;
      catatLog({ ...event, kodeSiswa, kodeKelas });
    },
    [kodeSiswa, kodeKelas],
  );

  const nilai = useMemo(
    () => ({
      progres: state,
      lencana: hitungLencana(state),
      catat,
      selesaiModul: (id) => {
        if (!state.modulSelesai.includes(id)) catat({ layar: id, aksi: 'selesai_modul' });
        dispatch({ type: 'selesaiModul', id });
      },
      simpanCekKesiapan: (skor, total) => dispatch({ type: 'cekKesiapan', skor, total }),
      simpanSoal: (id, bintang, petunjuk) => dispatch({ type: 'simpanSoal', id, bintang, petunjuk }),
      tandaiSalahSatuan: () => dispatch({ type: 'salahSatuan' }),
      setPeneliti: (kodeSiswaBaru, kodeKelasBaru) =>
        dispatch({ type: 'peneliti', kodeSiswa: kodeSiswaBaru, kodeKelas: kodeKelasBaru }),
      resetProgres: () => dispatch({ type: 'reset' }),
    }),
    [state, catat],
  );

  return <ProgresCtx.Provider value={nilai}>{children}</ProgresCtx.Provider>;
}

export function useProgres() {
  const ctx = useContext(ProgresCtx);
  if (!ctx) throw new Error('useProgres harus dipakai di dalam <ProgresProvider>');
  return ctx;
}
