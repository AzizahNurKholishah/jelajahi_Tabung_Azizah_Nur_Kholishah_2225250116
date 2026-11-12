import { Link } from 'react-router-dom';
import LayarModul from '../../components/LayarModul.jsx';
import { LEVEL, levelTerbuka, soalPerLevel } from '../../data/soal.js';
import { useProgres } from '../../state/ProgresContext.jsx';
import css from './arena.module.css';

// M5 — Arena Latihan: pilih level (F5). Tanpa batas waktu, tanpa nyawa.
export default function PilihLevel() {
  const { progres } = useProgres();

  return (
    <LayarModul judul="Arena Latihan">
      <p className={css.pengantar}>Kerjakan langkah demi langkah. Tidak ada batas waktu. Kumpulkan bintang!</p>
      <ol className={css.daftarLevel}>
        {LEVEL.map((lv) => {
          const soal = soalPerLevel(lv.no);
          const hasil = soal.map((s) => progres.arena[s.id]);
          const selesai = hasil.filter((h) => h?.selesai).length;
          const bintang = hasil.reduce((n, h) => n + (h?.bintang ?? 0), 0);
          const terbuka = levelTerbuka(lv.no, progres.arena);
          const lanjutKe = Math.min(soal.length, soal.findIndex((s) => !progres.arena[s.id]?.selesai) + 1 || 1);

          const isi = (
            <>
              <span className={css.nomorLevel}>{terbuka ? lv.no : '🔒'}</span>
              <span className={css.infoLevel}>
                <strong>
                  Level {lv.no} • {lv.nama}
                </strong>
                <span>{lv.deskripsi}</span>
                <span className={css.statLevel}>
                  {'★'.repeat(Math.min(3, Math.round(bintang / soal.length)))}
                  {'☆'.repeat(3 - Math.min(3, Math.round(bintang / soal.length)))} · {selesai}/{soal.length} soal ·{' '}
                  {bintang} bintang
                </span>
                {!terbuka && <span>Selesaikan Level {lv.no - 1} dulu.</span>}
              </span>
            </>
          );

          return (
            <li key={lv.no}>
              {terbuka ? (
                <Link className={css.kartuLevel} to={`/modul/arena/${lv.no}/${lanjutKe}`}>
                  {isi}
                </Link>
              ) : (
                <div className={`${css.kartuLevel} ${css.terkunci}`} aria-disabled="true">
                  {isi}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <Link to="/modul/rangkuman" className={`tombol tombol--sekunder ${css.penuh}`}>
        Lihat rangkuman & lencana
      </Link>
    </LayarModul>
  );
}
