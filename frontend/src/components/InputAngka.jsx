import { useId } from 'react';
import css from './Soal.module.css';

/** Kotak isian angka. inputMode="decimal" memunculkan keyboard angka (dengan koma) di Android. */
export default function InputAngka({ label, nilai, onUbah, awalan, satuan, status, nonaktif, onEnter }) {
  const id = useId();
  const kelas = status === 'benar' ? css.inputBenar : status === 'salah' ? css.inputSalah : '';
  return (
    <div className={css.barisIsian}>
      <label htmlFor={id} className={css.labelIsian}>
        {label}
      </label>
      <span className={css.kotak}>
        {awalan && <span className={css.imbuhan}>{awalan}</span>}
        <input
          id={id}
          className={`${css.input} ${kelas}`}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          enterKeyHint="done"
          value={nilai ?? ''}
          disabled={nonaktif}
          aria-invalid={status === 'salah'}
          onChange={(e) => onUbah(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
        />
        {satuan && <span className={css.imbuhan}>{satuan}</span>}
        {status === 'benar' && <span aria-label="benar" className={css.centang}>✓</span>}
      </span>
    </div>
  );
}
