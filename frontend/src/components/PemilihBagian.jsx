import { BAGIAN_TABUNG, SEMUA_BAGIAN } from '../data/bagian.js';
import css from './PemilihBagian.module.css';

/** Tombol bagian di luar kanvas: alternatif mengetuk objek 3D (aksesibilitas, target ≥ 48px). */
export default function PemilihBagian({ pilihan = SEMUA_BAGIAN, aktif = [], onPilih, sudah = [] }) {
  return (
    <div className={css.baris} role="group" aria-label="Pilih bagian tabung">
      {pilihan.map((b) => {
        const info = BAGIAN_TABUNG[b];
        const dipilih = aktif.includes(b);
        return (
          <button
            key={b}
            type="button"
            className={`${css.chip} ${dipilih ? css.dipilih : ''}`}
            style={{ '--warna': `var(${info.token})` }}
            aria-pressed={dipilih}
            onClick={() => onPilih?.(b)}
          >
            <span className={css.titik} aria-hidden="true" />
            {info.singkat}
            {sudah.includes(b) && <span aria-label="sudah ditemukan"> ✓</span>}
          </button>
        );
      })}
    </div>
  );
}
