import { useCallback, useEffect, useRef, useState } from 'react';

export function kurangiGerak() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Animasi "gelindingkan alas" (0 → 1). Hanya dimulai oleh tindakan siswa.
 * @returns {[number|null, () => void, () => void]} [nilai, mulai, hapus]
 */
export function useGelinding(durasiMs = 3000) {
  const [nilai, setNilai] = useState(null);
  const raf = useRef(0);

  const berhenti = () => cancelAnimationFrame(raf.current);

  const mulai = useCallback(() => {
    berhenti();
    if (kurangiGerak()) {
      setNilai(1);
      return;
    }
    const awal = performance.now();
    const langkah = (sekarang) => {
      const x = Math.min(1, (sekarang - awal) / durasiMs);
      setNilai(x);
      if (x < 1) raf.current = requestAnimationFrame(langkah);
    };
    setNilai(0);
    raf.current = requestAnimationFrame(langkah);
  }, [durasiMs]);

  const hapus = useCallback(() => {
    berhenti();
    setNilai(null);
  }, []);

  useEffect(() => berhenti, []);

  return [nilai, mulai, hapus];
}
