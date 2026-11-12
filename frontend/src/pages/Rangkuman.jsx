import { Link } from 'react-router-dom';
import LayarModul from '../components/LayarModul.jsx';
import Tabung2D from '../components/Tabung2D.jsx';
import { SOAL } from '../data/soal.js';
import { useProgres } from '../state/ProgresContext.jsx';
import css from './materi.module.css';

// M6 — Rangkuman & Lencana: satu layar berisi jaring-jaring + 3 rumus.
const SEMUA_LENCANA = [
  { id: 'penjelajah', nama: 'Penjelajah Tabung', syarat: 'Selesaikan semua materi' },
  { id: 'teliti', nama: 'Teliti', syarat: 'Selesaikan semua soal tanpa salah satuan' },
  { id: 'mandiri', nama: 'Mandiri', syarat: 'Selesaikan Level 3 dengan paling banyak 2 petunjuk' },
];

export default function Rangkuman() {
  const { progres, lencana, selesaiModul } = useProgres();
  const dimiliki = new Set(lencana.map((l) => l.id));
  const bintang = SOAL.reduce((n, s) => n + (progres.arena[s.id]?.bintang ?? 0), 0);

  return (
    <LayarModul
      judul="Rangkuman"
      visual={<Tabung2D r={7} t={10} mode="jaring" progresBuka={1} tampilLabel={false} tampilUkuranJaring />}
      visualKecil
      aksi={
        <Link to="/" className="tombol" onClick={() => selesaiModul('rangkuman')}>
          Ke beranda
        </Link>
      }
    >
      <div className={css.grid}>
        <div className={css.kartuLuas} style={{ '--warna': 'var(--c-teks)' }}>
          Tertutup
          <strong>
            L = <span className="w-alas">2πr²</span> + <span className="w-selimut">2πrt</span>
          </strong>
        </div>
        <div className={css.kartuLuas} style={{ '--warna': 'var(--c-teks)' }}>
          Tanpa tutup
          <strong>
            L = <span className="w-alas">πr²</span> + <span className="w-selimut">2πrt</span>
          </strong>
        </div>
        <div className={css.kartuLuas} style={{ '--warna': 'var(--c-teks)' }}>
          Hanya selimut
          <strong>
            L = <span className="w-selimut">2πrt</span>
          </strong>
        </div>
        <div className={css.kartuLuas} style={{ '--warna': 'var(--c-jari)' }}>
          Ingat
          <strong>
            <span className="w-jari">r = d ÷ 2</span>
          </strong>
        </div>
      </div>

      <p className={css.kartuInfo}>
        <strong>Dua angka 2 yang berbeda:</strong> <strong>2</strong>πr² karena ada dua lingkaran (alas dan tutup);
        <strong> 2</strong>πr karena panjang selimut = keliling alas.
      </p>

      <h2 className={css.rumus}>Bintang: {bintang} / {SOAL.length * 3} ★</h2>
      <ul className={css.grid} style={{ listStyle: 'none', padding: 0 }}>
        {SEMUA_LENCANA.map((l) => (
          <li
            key={l.id}
            className={`${css.kartuLuas} ${dimiliki.has(l.id) ? '' : css.redup}`}
            style={{ '--warna': dimiliki.has(l.id) ? '#f59e0b' : 'var(--c-garis)' }}
          >
            {dimiliki.has(l.id) ? '🏅' : '🔒'} {l.nama}
            <span style={{ display: 'block' }}>{l.syarat}</span>
          </li>
        ))}
      </ul>
    </LayarModul>
  );
}
