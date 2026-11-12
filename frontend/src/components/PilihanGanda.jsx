import { useState } from 'react';
import css from './Soal.module.css';

/**
 * Pilihan ganda.
 * mode 'dinilai'  : jawaban dinilai benar/salah (Cek Kesiapan).
 * mode 'refleksi' : semua jawaban diterima, lalu alasan yang tepat ditampilkan (tidak menambah kecemasan).
 */
export default function PilihanGanda({ tanya, pilihan, tepat, mode = 'dinilai', penjelasan, onJawab }) {
  const [dipilih, setDipilih] = useState(null);
  const sudah = dipilih !== null;

  const pilih = (i) => {
    if (sudah) return;
    setDipilih(i);
    onJawab?.(i, i === tepat);
  };

  return (
    <fieldset className={css.pg}>
      <legend className={css.tanya}>{tanya}</legend>
      {pilihan.map((p, i) => {
        let kelas = css.opsi;
        if (sudah && mode === 'dinilai') {
          if (i === tepat) kelas += ` ${css.opsiBenar}`;
          else if (i === dipilih) kelas += ` ${css.opsiSalah}`;
        } else if (sudah && i === dipilih) kelas += ` ${css.opsiDipilih}`;
        return (
          <button key={i} type="button" className={kelas} aria-pressed={i === dipilih} disabled={sudah} onClick={() => pilih(i)}>
            {p}
            {sudah && mode === 'dinilai' && i === tepat && ' ✓'}
          </button>
        );
      })}
      <div aria-live="polite">
        {sudah && mode === 'dinilai' && (
          <p className={dipilih === tepat ? css.umpanBenar : css.umpanSalah}>
            {dipilih === tepat ? '✓ Tepat! ' : 'Belum tepat. '}
            {penjelasan}
          </p>
        )}
        {sudah && mode === 'refleksi' && (
          <p className={css.umpanInfo}>
            {dipilih === tepat ? 'Alasanmu tepat! ' : 'Terima kasih sudah berpikir. '}
            Alasan yang tepat: <strong>{pilihan[tepat]}</strong>.
          </p>
        )}
      </div>
    </fieldset>
  );
}
