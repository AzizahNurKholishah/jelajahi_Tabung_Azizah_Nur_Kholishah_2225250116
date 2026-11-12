import { useMemo, useState } from 'react';
import { cekTanda, pecahKata } from '../lib/tanda.js';
import css from './Soal.module.css';

/**
 * Teks soal yang kata-katanya bisa diketuk untuk ditandai (F10, EL05).
 * Menandai tidak wajib dan tidak dinilai; "Cek tandaku" hanya memberi umpan balik.
 */
export default function KartuSoal({ teks, tanda = [], onCek }) {
  const token = useMemo(() => pecahKata(teks), [teks]);
  const [ditandai, setDitandai] = useState([]);
  const [hasil, setHasil] = useState(null);

  const alih = (i) => {
    setHasil(null);
    setDitandai((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));
  };

  const cek = () => {
    const h = cekTanda(token, ditandai, tanda);
    setHasil(h);
    onCek?.(h);
  };

  return (
    <div className={css.kartuSoal}>
      <p className={css.teksSoal}>
        {token.map((k, i) =>
          /^\s+$/.test(k) ? (
            k
          ) : (
            <span
              key={i}
              role="button"
              tabIndex={0}
              aria-pressed={ditandai.includes(i)}
              className={ditandai.includes(i) ? css.kataTanda : css.kata}
              onClick={() => alih(i)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), alih(i))}
            >
              {k}
            </span>
          ),
        )}
      </p>
      <div className={css.barisTanda}>
        <span className={css.petunjukKecil}>Ketuk kata/angka penting untuk menandainya.</span>
        {tanda.length > 0 && (
          <button type="button" className={css.tombolKecil} onClick={cek} disabled={ditandai.length === 0}>
            Cek tandaku
          </button>
        )}
      </div>
      {hasil && (
        <p className={css.petunjukKecil} aria-live="polite">
          Kamu menandai {hasil.ditemukan.length} dari {tanda.length} informasi penting.
          {hasil.terlewat.length > 0 && <> Yang terlewat: <strong>{hasil.terlewat.join('; ')}</strong>.</>}
        </p>
      )}
    </div>
  );
}
