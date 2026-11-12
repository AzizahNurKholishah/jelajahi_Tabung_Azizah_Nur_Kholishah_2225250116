import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayarModul from '../components/LayarModul.jsx';
import NavLangkah from '../components/NavLangkah.jsx';
import TampilanTabung from '../components/TampilanTabung.jsx';
import { useGelinding } from '../state/gerak.js';
import { TAMPIL_SEMUA } from '../data/bagian.js';
import { useProgres } from '../state/ProgresContext.jsx';
import css from './materi.module.css';

// M3 — Asal Rumus (F3), 7 langkah (docs/DESAIN.md §4 M3). Indikator I3.
// Inti: dua angka 2 yang berbeda (IL01) — 2πr² (dua lingkaran) dan 2πr (keliling alas).
const R = 7;
const T = 10;

const A = ({ children }) => <span className="w-alas">{children}</span>;
const Tu = ({ children }) => <span className="w-tutup">{children}</span>;
const S = ({ children }) => <span className="w-selimut">{children}</span>;

const VARIASI = {
  'tanpa-tutup': {
    nama: 'Tanpa tutup',
    sorot: ['alas', 'selimut'],
    teks: 'Ember atau gelas tidak punya tutup. Hitung alas dan selimut saja.',
    rumus: (
      <>
        L = <A>πr²</A> + <S>2πrt</S>
      </>
    ),
  },
  selimut: {
    nama: 'Hanya selimut',
    sorot: ['selimut'],
    teks: 'Label kaleng atau pipa hanya menutupi bagian lengkung.',
    rumus: (
      <>
        L = <S>2πrt</S>
      </>
    ),
  },
};

const LANGKAH = [
  {
    sorot: ['tutup'],
    teks: 'Tutup berbentuk lingkaran.',
    rumus: (
      <>
        Luas tutup = <Tu>πr²</Tu>
      </>
    ),
  },
  {
    sorot: ['alas'],
    teks: 'Alas juga lingkaran, sama besar dengan tutup.',
    rumus: (
      <>
        Luas alas = <A>πr²</A>
      </>
    ),
  },
  {
    sorot: ['alas', 'tutup'],
    teks: (
      <>
        Ada <strong>dua</strong> lingkaran. Inilah <strong>angka 2 yang pertama</strong>.
      </>
    ),
    rumus: (
      <>
        <strong>2</strong> × πr² = <strong>2</strong>πr²
      </>
    ),
  },
  {
    sorot: ['selimut'],
    teks: 'Selimut yang dibuka berbentuk persegi panjang.',
    rumus: (
      <>
        Luas <S>selimut</S> = panjang × lebar
      </>
    ),
  },
  {
    sorot: ['selimut'],
    gelinding: true,
    teks: (
      <>
        Panjangnya = keliling alas = <span className="w-jari">2πr</span>. Lebarnya ={' '}
        <span className="w-tinggi">t</span>. Ini <strong>angka 2 yang kedua</strong>.
      </>
    ),
    rumus: (
      <>
        <S>Selimut</S> = 2πr × t = <S>2πrt</S>
      </>
    ),
  },
  {
    sorot: [],
    teks: (
      <>
        Jumlahkan semua bagian. Ingat: dua angka 2 itu <strong>berbeda</strong> — dua lingkaran, dan keliling alas.
      </>
    ),
    rumus: (
      <>
        L = <A>2πr²</A> + <S>2πrt</S> = 2πr(r + t)
      </>
    ),
  },
  { variasi: true },
];

export default function AsalRumus() {
  const navigate = useNavigate();
  const { selesaiModul } = useProgres();
  const [ke, setKe] = useState(1);
  const [variasi, setVariasi] = useState('tanpa-tutup');
  const [gelinding, mulaiGelinding, hapusGelinding] = useGelinding();

  const langkah = LANGKAH[ke - 1];
  const total = LANGKAH.length;

  // Gelinding hanya dimulai karena siswa berpindah ke langkah 5 (tindakan siswa), bukan otomatis berulang.
  useEffect(() => {
    if (langkah.gelinding) mulaiGelinding();
    else hapusGelinding();
  }, [langkah, mulaiGelinding, hapusGelinding]);

  const v = VARIASI[variasi];
  const sorot = langkah.variasi ? v.sorot : langkah.sorot;

  const ulangi = () => {
    if (langkah.gelinding) mulaiGelinding();
    if (langkah.variasi) setVariasi('tanpa-tutup');
  };

  return (
    <LayarModul
      judul="Asal Rumus"
      langkah={{ ke, total }}
      visual={
        <TampilanTabung
          r={R}
          t={T}
          mode="jaring"
          progresBuka={1}
          sorot={sorot}
          gelinding={langkah.gelinding ? gelinding : null}
          tampilUkuranJaring={langkah.gelinding}
          tampilkan={TAMPIL_SEMUA}
          labelAria="Jaring-jaring tabung"
        />
      }
      aksi={
        <NavLangkah
          ke={ke}
          total={total}
          onKembali={ke > 1 ? () => setKe((k) => k - 1) : () => navigate('/modul/laboratorium')}
          onUlangi={langkah.gelinding || langkah.variasi ? ulangi : undefined}
          labelLanjut={ke === total ? 'Contoh soal →' : 'Lanjut'}
          onLanjut={() => {
            if (ke < total) return setKe((k) => k + 1);
            selesaiModul('asal-rumus');
            navigate('/modul/contoh');
          }}
        />
      }
    >
      {langkah.variasi ? (
        <>
          <div className={css.segmen} role="group" aria-label="Pilih variasi">
            {Object.entries(VARIASI).map(([kunci, item]) => (
              <button key={kunci} type="button" aria-pressed={variasi === kunci} onClick={() => setVariasi(kunci)}>
                {item.nama}
              </button>
            ))}
          </div>
          <p className={css.teks}>{v.teks}</p>
          <p className={css.rumus}>{v.rumus}</p>
        </>
      ) : (
        <>
          <p className={css.teks}>{langkah.teks}</p>
          <p className={css.rumus}>{langkah.rumus}</p>
        </>
      )}
    </LayarModul>
  );
}
