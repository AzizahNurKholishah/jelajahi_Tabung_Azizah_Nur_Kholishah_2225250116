import { useNavigate } from 'react-router-dom';
import css from './LayarModul.module.css';

/**
 * Kerangka satu layar modul (docs/DESAIN.md §2.3):
 * bilah atas → area visual → teks → aksi di zona jempol.
 */
export default function LayarModul({ judul, langkah, visual, visualKecil = false, children, aksi, kembaliKe = '/' }) {
  const navigate = useNavigate();

  return (
    <div className={css.layar}>
      <header className={css.atas}>
        <button
          type="button"
          className={css.kembali}
          onClick={() => navigate(kembaliKe)}
          aria-label="Kembali ke beranda"
        >
          ←
        </button>
        <h1 className={css.judul}>{judul}</h1>
        {langkah && (
          <span className={css.posisi} aria-label={`Langkah ${langkah.ke} dari ${langkah.total}`}>
            {langkah.ke} / {langkah.total}
          </span>
        )}
      </header>

      {visual && <div className={`${css.visual} ${visualKecil ? css.visualKecil : ''}`}>{visual}</div>}

      <main className={css.isi}>{children}</main>

      {aksi && <footer className={css.aksi}>{aksi}</footer>}
    </div>
  );
}
