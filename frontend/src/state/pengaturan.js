import { useSyncExternalStore } from 'react';
import { modeGrafikBawaan } from '../three/dukungWebGL.js';

// Pilihan tampilan 2D/3D, dibagi oleh semua layar dan diingat di perangkat.
const KUNCI = 'jelajahTabung.modeGrafik';
const pendengar = new Set();
let modeSaatIni = null;

function bacaMode() {
  if (modeSaatIni) return modeSaatIni;
  try {
    const tersimpan = localStorage.getItem(KUNCI);
    if (tersimpan === '2d' || tersimpan === '3d') {
      modeSaatIni = tersimpan;
      return modeSaatIni;
    }
  } catch {
    // localStorage bisa diblokir; pakai deteksi otomatis.
  }
  modeSaatIni = modeGrafikBawaan();
  return modeSaatIni;
}

export function setModeGrafik(mode) {
  modeSaatIni = mode;
  try {
    localStorage.setItem(KUNCI, mode);
  } catch {
    // abaikan: pilihan tetap berlaku sampai halaman ditutup
  }
  pendengar.forEach((f) => f());
}

function langganan(f) {
  pendengar.add(f);
  return () => pendengar.delete(f);
}

export function useModeGrafik() {
  const mode = useSyncExternalStore(langganan, bacaMode);
  return [mode, setModeGrafik];
}
