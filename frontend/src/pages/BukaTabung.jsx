import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayarModul from '../components/LayarModul.jsx';
import TampilanTabung from '../components/TampilanTabung.jsx';
import { useGelinding } from '../state/gerak.js';
import { useProgres } from '../state/ProgresContext.jsx';
import css from './materi.module.css';

// M2 — Buka Tabung (F2), fitur inti. Indikator I2: mengenali jaring-jaring tabung.
// Menjawab IL01/K03: panjang selimut = keliling alas (2πr).
const R = 7;
const T = 10;

function teksFase(p, gelinding) {
  if (p === 0) return 'Geser untuk membuka tabung.';
  if (p < 30) return 'Tutup dan alas dibuka seperti engsel.';
  if (p < 90) return 'Selimut digunting pada garis tegak, lalu dibuka. Perhatikan: panjangnya tidak berubah.';
  if (p < 100 || gelinding == null) return 'Tabung terbuka menjadi 2 lingkaran dan 1 persegi panjang.';
  if (gelinding < 1) return 'Alas menggelinding satu putaran penuh…';
  return null;
}

export default function BukaTabung() {
  const navigate = useNavigate();
  const { selesaiModul } = useProgres();
  const [progres, setProgres] = useState(0);
  const [gelinding, mulaiGelinding, hapusGelinding] = useGelinding();

  const ubahProgres = (e) => {
    setProgres(Number(e.target.value));
    hapusGelinding();
  };

  const teks = teksFase(progres, gelinding);

  return (
    <LayarModul
      judul="Buka Tabung"
      visual={
        <TampilanTabung
          r={R}
          t={T}
          mode="jaring"
          progresBuka={progres / 100}
          gelinding={progres === 100 ? gelinding : null}
          tampilUkuranJaring={progres >= 90}
          labelAria={`Tabung dibuka ${progres} persen`}
        />
      }
      aksi={
        <>
          <button type="button" className="tombol tombol--sekunder" onClick={() => navigate('/modul/kenali-tabung')}>
            Kembali
          </button>
          <button
            type="button"
            className="tombol"
            onClick={() => {
              selesaiModul('buka-tabung');
              navigate('/modul/laboratorium');
            }}
          >
            Lanjut
          </button>
        </>
      }
    >
      <label className={css.labelSlider} htmlFor="slider-buka">
        <span>Tertutup</span>
        <span>Terbuka</span>
      </label>
      <input
        id="slider-buka"
        className={css.slider}
        type="range"
        min="0"
        max="100"
        step="1"
        value={progres}
        onChange={ubahProgres}
        aria-label="Buka tabung"
        aria-valuetext={`${progres} persen terbuka`}
      />

      <div aria-live="polite">
        {teks ? (
          <p className={css.teks}>{teks}</p>
        ) : (
          <p className={css.teks}>
            Jejak alas = keliling alas = <span className="w-jari">2πr</span>. Jadi{' '}
            <strong>panjang selimut = 2πr</strong>, dan <span className="w-tinggi">lebarnya = t</span>.
          </p>
        )}
      </div>

      {progres === 100 && (
        <button type="button" className={`tombol tombol--sekunder ${css.tombolPenuh}`} onClick={mulaiGelinding}>
          {gelinding == null ? 'Gelindingkan alas' : 'Gelindingkan lagi'}
        </button>
      )}
    </LayarModul>
  );
}
