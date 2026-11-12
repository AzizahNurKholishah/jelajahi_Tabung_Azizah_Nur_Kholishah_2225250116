import css from './Soal.module.css';

/** Satuan dipilih terpisah dari angka dan diperiksa tersendiri (FR-06). */
export default function PilihSatuan({ pilihan, nilai, onUbah, nonaktif }) {
  return (
    <div className={css.satuan} role="radiogroup" aria-label="Satuan">
      <span className={css.labelIsian}>Satuan:</span>
      {pilihan.map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={nilai === s}
          disabled={nonaktif}
          className={nilai === s ? css.satuanDipilih : ''}
          onClick={() => onUbah(s)}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
