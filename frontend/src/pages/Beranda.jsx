import { Link } from 'react-router-dom';
import { DAFTAR_MODUL } from '../data/modul.js';
import { SOAL } from '../data/soal.js';
import { useProgres } from '../state/ProgresContext.jsx';
import css from './Beranda.module.css';

function IkonTabung() {
  return (
    <svg viewBox="0 0 64 80" width="56" height="70" aria-hidden="true">
      <path d="M8 16 V64 A24 8 0 0 0 56 64 V16" fill="var(--c-selimut)" opacity="0.85" />
      <ellipse cx="32" cy="64" rx="24" ry="8" fill="none" stroke="var(--c-alas)" strokeWidth="3" />
      <ellipse cx="32" cy="16" rx="24" ry="8" fill="var(--c-tutup)" />
    </svg>
  );
}

export default function Beranda() {
  const { progres, lencana } = useProgres();
  const selesai = new Set(progres.modulSelesai);
  const bintang = SOAL.reduce((n, s) => n + (progres.arena[s.id]?.bintang ?? 0), 0);
  const soalSelesai = SOAL.filter((s) => progres.arena[s.id]?.selesai).length;
  const sudahMulai = selesai.size > 0;

  // Modul berikutnya yang disarankan: yang pertama belum selesai.
  const berikut = DAFTAR_MODUL.find((m) => !selesai.has(m.id)) ?? DAFTAR_MODUL.find((m) => m.id === 'arena');

  return (
    <div className={css.beranda}>
      <header className={css.kepala}>
        <IkonTabung />
        <div>
          <h1 className={css.judul}>Jelajah Tabung</h1>
          <p className={css.sub}>Belajar luas permukaan tabung, langkah demi langkah.</p>
        </div>
      </header>

      <Link to={`/modul/${berikut.id}`} className={`tombol ${css.mulai}`}>
        {sudahMulai ? `Lanjutkan: ${berikut.judul}` : 'Mulai belajar'}
      </Link>

      {sudahMulai && (
        <p className={css.ringkasan}>
          ★ {bintang} bintang · {soalSelesai}/{SOAL.length} soal · {lencana.length} lencana
        </p>
      )}

      <h2 className={css.subjudul}>Peta belajar</h2>
      <ol className={css.daftar}>
        {DAFTAR_MODUL.map((m) => (
          <li key={m.id}>
            <Link to={`/modul/${m.id}`} className={css.kartu}>
              <span className={`${css.nomor} ${selesai.has(m.id) ? css.nomorSelesai : ''}`} aria-hidden="true">
                {selesai.has(m.id) ? '✓' : m.no === 0 ? '?' : m.no}
              </span>
              <span>
                <span className={css.namaModul}>
                  {m.judul}
                  {selesai.has(m.id) && <span className="sr-only"> (selesai)</span>}
                </span>
                <span className={css.ringkas}>{m.ringkas}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <Link to="/tentang" className={css.tautanTentang}>
        Tentang aplikasi & Mode Peneliti
      </Link>
    </div>
  );
}
