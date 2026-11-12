import css from './NavLangkah.module.css';

/**
 * Navigasi materi: Kembali – Ulangi – Lanjut + titik progres.
 * Tidak ada perpindahan otomatis: siswa yang menentukan tempo (EL04).
 */
export default function NavLangkah({ ke, total, onKembali, onUlangi, onLanjut, lanjutAktif = true, labelLanjut = 'Lanjut' }) {
  return (
    <div className={css.nav}>
      <div className={css.titik} aria-label={`Langkah ${ke} dari ${total}`} role="img">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={i < ke ? css.penuh : undefined} />
        ))}
      </div>
      <div className={css.tombol}>
        <button type="button" className="tombol tombol--sekunder" onClick={onKembali} disabled={!onKembali}>
          Kembali
        </button>
        {onUlangi && (
          <button type="button" className="tombol tombol--sekunder" onClick={onUlangi}>
            Ulangi
          </button>
        )}
        <button type="button" className="tombol" onClick={onLanjut} disabled={!lanjutAktif}>
          {labelLanjut}
        </button>
      </div>
    </div>
  );
}
