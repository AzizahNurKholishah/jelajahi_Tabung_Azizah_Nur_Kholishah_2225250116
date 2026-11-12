import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayarModul from '../components/LayarModul.jsx';
import NavLangkah from '../components/NavLangkah.jsx';
import { useProgres } from '../state/ProgresContext.jsx';
import css from './materi.module.css';

// S1b — Pengantar Lingkaran (pra-pelatihan, IL03): r & d, keliling, luas. 3 layar.
const R = 7;
const KELILING = 2 * Math.PI * R;

function GambarLingkaran({ langkah }) {
  const lebar = KELILING + 4;
  return (
    <svg viewBox={`${-lebar / 2} -11 ${lebar} 26`} width="100%" height="100%" role="img" aria-label="Gambar lingkaran">
      {langkah === 3 ? (
        <circle cx={0} cy={0} r={R} fill="var(--c-alas)" opacity="0.85" />
      ) : (
        <circle cx={0} cy={0} r={R} fill="var(--c-latar)" stroke="var(--c-alas)" strokeWidth="0.5" />
      )}
      <circle cx={0} cy={0} r={0.4} fill="var(--c-teks)" />

      {langkah === 1 && (
        <>
          <line x1={-R} y1={0} x2={R} y2={0} stroke="var(--c-jari)" strokeWidth="0.25" strokeDasharray="0.8 0.5" />
          <line x1={0} y1={0} x2={R} y2={0} stroke="var(--c-jari)" strokeWidth="0.6" />
          <text x={R / 2} y={-1} fontSize="2" fill="var(--c-jari)" textAnchor="middle" fontWeight="700">
            r
          </text>
          <text x={0} y={3} fontSize="1.6" fill="var(--c-jari)" textAnchor="middle">
            d = 2r
          </text>
        </>
      )}

      {langkah === 2 && (
        <>
          <circle cx={0} cy={0} r={R} fill="none" stroke="var(--c-jari)" strokeWidth="0.6" />
          <line x1={-KELILING / 2} y1={11} x2={KELILING / 2} y2={11} stroke="var(--c-jari)" strokeWidth="0.6" />
          <text x={0} y={13.8} fontSize="1.8" fill="var(--c-jari)" textAnchor="middle" fontWeight="700">
            keliling dibentangkan = 2πr
          </text>
        </>
      )}

      {langkah === 3 && (
        <text x={0} y={0.7} fontSize="2.4" fill="#fff" textAnchor="middle" fontWeight="700">
          πr²
        </text>
      )}
    </svg>
  );
}

const LANGKAH = [
  {
    teks: 'Jari-jari (r) adalah jarak titik pusat ke tepi. Diameter (d) melewati pusat, panjangnya 2 kali jari-jari.',
    rumus: 'r = d ÷ 2',
  },
  {
    teks: 'Keliling adalah panjang tepi lingkaran. Jika tepinya dibentangkan, panjangnya 2πr.',
    rumus: 'Keliling = 2πr',
  },
  {
    teks: 'Luas adalah daerah di dalam lingkaran. π = 22/7 bila r kelipatan 7; selain itu π = 3,14.',
    rumus: 'Luas = πr²',
  },
];

export default function PengantarLingkaran() {
  const navigate = useNavigate();
  const { selesaiModul } = useProgres();
  const [ke, setKe] = useState(1);
  const l = LANGKAH[ke - 1];

  return (
    <LayarModul
      judul="Ingat Lingkaran"
      langkah={{ ke, total: LANGKAH.length }}
      visual={<GambarLingkaran langkah={ke} />}
      aksi={
        <NavLangkah
          ke={ke}
          total={LANGKAH.length}
          onKembali={ke > 1 ? () => setKe(ke - 1) : undefined}
          labelLanjut={ke === LANGKAH.length ? 'Ke tabung →' : 'Lanjut'}
          onLanjut={() => {
            if (ke < LANGKAH.length) setKe(ke + 1);
            else {
              selesaiModul('pengantar-lingkaran');
              navigate('/modul/kenali-tabung');
            }
          }}
        />
      }
    >
      <p className={css.teks}>{l.teks}</p>
      <p className={`${css.rumus} w-jari`}>{l.rumus}</p>
    </LayarModul>
  );
}
