import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayarModul from '../components/LayarModul.jsx';
import TampilanTabung from '../components/TampilanTabung.jsx';
import { bulatkan, luasTiapBagian } from '../lib/rumus.js';
import { formatAngka } from '../lib/angka.js';
import { useProgres } from '../state/ProgresContext.jsx';
import css from './materi.module.css';

// M2b — Laboratorium Tabung (F2b): eksplorasi bebas r dan t (GL, literasi matematika).
// Pertanyaan pemantik tidak dinilai.
const PERTANYAAN = [
  'Jika r dibuat 2 kali lipat, apakah luas selimut juga 2 kali lipat? Coba!',
  'Jika t dibuat 2 kali lipat, bagian mana yang luasnya berubah?',
  'Matikan tutup. Berapa luas yang berkurang?',
  'Cari r dan t yang membuat luas selimut sama dengan luas alas + tutup.',
];

const PI = '3.14';

function KartuLuas({ bagian, judul, rumus, nilai, dipilih, onPilih, redup }) {
  return (
    <button
      type="button"
      className={`${css.kartuLuas} ${redup ? css.redup : ''}`}
      style={{ '--warna': `var(--c-${bagian})` }}
      aria-pressed={dipilih}
      onClick={onPilih}
    >
      <span className={`w-${bagian}`}>{judul}</span> = {rumus}
      <strong>{redup ? '—' : `${formatAngka(bulatkan(nilai))} cm²`}</strong>
    </button>
  );
}

export default function Laboratorium() {
  const navigate = useNavigate();
  const { selesaiModul } = useProgres();
  const [r, setR] = useState(7);
  const [t, setT] = useState(10);
  const [adaTutup, setAdaTutup] = useState(true);
  const [sorot, setSorot] = useState(null);
  const [nomorTanya, setNomorTanya] = useState(0);

  const luas = luasTiapBagian({ r, t, pi: PI });
  const total = luas.alas + luas.selimut + (adaTutup ? luas.tutup : 0);
  const pilih = (b) => setSorot((s) => (s === b ? null : b));

  return (
    <LayarModul
      judul="Laboratorium Tabung"
      visual={
        <TampilanTabung
          r={r}
          t={t}
          mode="kenali"
          sorot={sorot ? [sorot] : []}
          tampilLabel={false}
          tampilUkuran
          tampilkan={{ alas: true, tutup: adaTutup, selimut: true }}
          labelAria={`Tabung dengan jari-jari ${r} cm dan tinggi ${t} cm`}
        />
      }
      aksi={
        <>
          <button type="button" className="tombol tombol--sekunder" onClick={() => navigate('/modul/buka-tabung')}>
            Kembali
          </button>
          <button
            type="button"
            className="tombol"
            onClick={() => {
              selesaiModul('laboratorium');
              navigate('/modul/asal-rumus');
            }}
          >
            Lanjut
          </button>
        </>
      }
    >
      <label className={css.labelSlider} htmlFor="slider-r">
        <span className="w-jari">Jari-jari r</span>
        <span>{formatAngka(r)} cm</span>
      </label>
      <input id="slider-r" className={css.slider} type="range" min="1" max="14" step="1" value={r} onChange={(e) => setR(Number(e.target.value))} />

      <label className={css.labelSlider} htmlFor="slider-t">
        <span className="w-tinggi">Tinggi t</span>
        <span>{formatAngka(t)} cm</span>
      </label>
      <input id="slider-t" className={css.slider} type="range" min="1" max="20" step="1" value={t} onChange={(e) => setT(Number(e.target.value))} />

      <div className={css.segmen} role="group" aria-label="Tutup tabung">
        <button type="button" aria-pressed={adaTutup} onClick={() => setAdaTutup(true)}>
          Ada tutup
        </button>
        <button type="button" aria-pressed={!adaTutup} onClick={() => setAdaTutup(false)}>
          Tanpa tutup
        </button>
      </div>

      <div className={css.grid} aria-live="polite">
        <KartuLuas bagian="alas" judul="Alas" rumus="πr²" nilai={luas.alas} dipilih={sorot === 'alas'} onPilih={() => pilih('alas')} />
        <KartuLuas
          bagian="tutup"
          judul="Tutup"
          rumus="πr²"
          nilai={luas.tutup}
          redup={!adaTutup}
          dipilih={sorot === 'tutup'}
          onPilih={() => pilih('tutup')}
        />
        <KartuLuas
          bagian="selimut"
          judul="Selimut"
          rumus="2πrt"
          nilai={luas.selimut}
          dipilih={sorot === 'selimut'}
          onPilih={() => pilih('selimut')}
        />
        <div className={`${css.kartuLuas} ${css.kartuTotal}`}>
          Luas permukaan
          <strong>{formatAngka(bulatkan(total))} cm²</strong>
        </div>
      </div>
      <p className={css.petunjuk}>π ≈ 3,14</p>

      <div className={css.kartuInfo}>
        <strong>Coba pikirkan:</strong> {PERTANYAAN[nomorTanya]}{' '}
        <button
          type="button"
          className="tombol tombol--sekunder"
          style={{ minHeight: 40, marginTop: 8 }}
          onClick={() => setNomorTanya((n) => (n + 1) % PERTANYAAN.length)}
        >
          Pertanyaan lain
        </button>
      </div>
    </LayarModul>
  );
}
