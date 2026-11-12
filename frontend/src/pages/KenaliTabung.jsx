import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayarModul from '../components/LayarModul.jsx';
import NavLangkah from '../components/NavLangkah.jsx';
import PemilihBagian from '../components/PemilihBagian.jsx';
import TampilanTabung from '../components/TampilanTabung.jsx';
import { BAGIAN_TABUNG, SEMUA_BAGIAN, TAMPIL_SEMUA } from '../data/bagian.js';
import { useProgres } from '../state/ProgresContext.jsx';
import css from './materi.module.css';

// M1 — Kenali Tabung (F1). Indikator I1: mengidentifikasi unsur tabung.
const R = 7;
const T = 10;
const JUMLAH_TANTANGAN = 3;

const BENDA = {
  kaleng: {
    nama: 'Kaleng susu',
    tampilkan: TAMPIL_SEMUA,
    teks: 'Kaleng susu punya alas, tutup, dan selimut.',
  },
  ember: {
    nama: 'Ember',
    tampilkan: { alas: true, tutup: false, selimut: true },
    teks: 'Ember tidak punya tutup. Hanya ada alas dan selimut.',
  },
};

function acakTantangan() {
  const salinan = [...SEMUA_BAGIAN];
  for (let i = salinan.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [salinan[i], salinan[j]] = [salinan[j], salinan[i]];
  }
  return salinan.slice(0, JUMLAH_TANTANGAN);
}

export default function KenaliTabung() {
  const navigate = useNavigate();
  const { selesaiModul } = useProgres();
  const [langkah, setLangkah] = useState(1);

  // Langkah 1: jelajah
  const [dipilih, setDipilih] = useState(null);
  const [ditemukan, setDitemukan] = useState([]);

  // Langkah 2: tantangan
  const [daftarTantangan, setDaftarTantangan] = useState(acakTantangan);
  const [nomorTantangan, setNomorTantangan] = useState(0);
  const [jawabanTantangan, setJawabanTantangan] = useState(null);

  // Langkah 3: contoh benda
  const [benda, setBenda] = useState('kaleng');

  const target = daftarTantangan[nomorTantangan];
  const tantanganBenar = jawabanTantangan === target;
  const tantanganSelesai = nomorTantangan === JUMLAH_TANTANGAN - 1 && tantanganBenar;

  const pilih = (b) => {
    if (langkah === 1) {
      setDipilih(b);
      setDitemukan((d) => (d.includes(b) ? d : [...d, b]));
    } else if (langkah === 2 && !tantanganBenar) {
      setJawabanTantangan(b);
    }
  };

  const ulangiLangkah = () => {
    if (langkah === 1) {
      setDipilih(null);
      setDitemukan([]);
    } else if (langkah === 2) {
      setDaftarTantangan(acakTantangan());
      setNomorTantangan(0);
      setJawabanTantangan(null);
    } else {
      setBenda('kaleng');
    }
  };

  const sorot = useMemo(() => {
    if (langkah === 1) return dipilih ? [dipilih] : [];
    if (langkah === 2) return jawabanTantangan ? [jawabanTantangan] : [];
    return [];
  }, [langkah, dipilih, jawabanTantangan]);

  const tampilkan = langkah === 3 ? BENDA[benda].tampilkan : TAMPIL_SEMUA;

  let isi;
  if (langkah === 1) {
    const info = dipilih && BAGIAN_TABUNG[dipilih];
    isi = (
      <>
        <PemilihBagian aktif={sorot} onPilih={pilih} sudah={ditemukan} />
        <p className={css.teks} aria-live="polite">
          {info ? (
            <>
              <strong>{info.nama}</strong> — {info.teks}
            </>
          ) : (
            'Ini tabung. Putar dengan satu jari, lalu ketuk bagian-bagiannya!'
          )}
        </p>
        <p className={css.petunjuk}>{ditemukan.length} dari 5 bagian sudah kamu temukan.</p>
      </>
    );
  } else if (langkah === 2) {
    const namaTarget = BAGIAN_TABUNG[target].nama;
    isi = (
      <>
        <PemilihBagian aktif={sorot} onPilih={pilih} />
        <p className={css.teks}>
          Tantangan {nomorTantangan + 1}/{JUMLAH_TANTANGAN}: ketuk <strong>{namaTarget}</strong>!
        </p>
        <div aria-live="polite">
          {jawabanTantangan &&
            (tantanganBenar ? (
              <p className={css.benar}>✓ Tepat!</p>
            ) : (
              <p className={css.salah}>
                Itu {BAGIAN_TABUNG[jawabanTantangan].nama.toLowerCase()}. Coba cari {namaTarget.toLowerCase()} lagi.
              </p>
            ))}
        </div>
        {tantanganBenar && !tantanganSelesai && (
          <button
            type="button"
            className={`tombol ${css.tombolPenuh}`}
            onClick={() => {
              setNomorTantangan((n) => n + 1);
              setJawabanTantangan(null);
            }}
          >
            Tantangan berikutnya
          </button>
        )}
      </>
    );
  } else {
    isi = (
      <>
        <div className={css.segmen} role="group" aria-label="Pilih benda">
          {Object.entries(BENDA).map(([kunci, b]) => (
            <button key={kunci} type="button" aria-pressed={benda === kunci} onClick={() => setBenda(kunci)}>
              {b.nama}
            </button>
          ))}
        </div>
        <p className={css.teks}>{BENDA[benda].teks}</p>
      </>
    );
  }

  const lanjutAktif = langkah === 1 ? ditemukan.length === SEMUA_BAGIAN.length : langkah === 2 ? tantanganSelesai : true;

  return (
    <LayarModul
      judul="Kenali Tabung"
      langkah={{ ke: langkah, total: 3 }}
      visual={
        <TampilanTabung
          r={R}
          t={T}
          mode="kenali"
          sorot={sorot}
          onKetuk={langkah < 3 ? pilih : undefined}
          tampilkan={tampilkan}
          tampilUkuran={langkah < 3}
          labelAria="Tabung tiga dimensi. Ketuk bagiannya atau gunakan tombol di bawah."
        />
      }
      aksi={
        <NavLangkah
          ke={langkah}
          total={3}
          onKembali={langkah > 1 ? () => setLangkah((l) => l - 1) : undefined}
          onUlangi={ulangiLangkah}
          lanjutAktif={lanjutAktif}
          labelLanjut={langkah === 3 ? 'Buka tabung →' : 'Lanjut'}
          onLanjut={() => {
            if (langkah < 3) return setLangkah((l) => l + 1);
            selesaiModul('kenali-tabung');
            navigate('/modul/buka-tabung');
          }}
        />
      }
    >
      {isi}
    </LayarModul>
  );
}
