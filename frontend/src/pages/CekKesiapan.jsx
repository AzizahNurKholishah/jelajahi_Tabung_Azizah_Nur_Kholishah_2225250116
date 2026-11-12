import { useState } from 'react';
import { Link } from 'react-router-dom';
import LayarModul from '../components/LayarModul.jsx';
import PilihanGanda from '../components/PilihanGanda.jsx';
import { SKOR_SIAP, SOAL_KESIAPAN } from '../data/cekKesiapan.js';
import { useProgres } from '../state/ProgresContext.jsx';
import css from './materi.module.css';

// F0 — Cek Kesiapan: diagnostik prasyarat lingkaran (IL02, IL03). Tanpa nilai merah.
export default function CekKesiapan() {
  const { simpanCekKesiapan, selesaiModul, catat } = useProgres();
  const [ke, setKe] = useState(0);
  const [benar, setBenar] = useState([]);
  const [sudahJawab, setSudahJawab] = useState(false);

  const total = SOAL_KESIAPAN.length;
  const selesai = ke >= total;
  const skor = benar.filter(Boolean).length;

  const jawab = (i, tepat) => {
    setSudahJawab(true);
    setBenar((b) => [...b, tepat]);
    catat({ layar: 'cek-kesiapan', soal: SOAL_KESIAPAN[ke].id, aksi: 'jawab', jawaban: String(i), benar: tepat });
  };

  const lanjut = () => {
    const berikut = ke + 1;
    setKe(berikut);
    setSudahJawab(false);
    if (berikut >= total) {
      const s = benar.filter(Boolean).length;
      simpanCekKesiapan(s, total);
      selesaiModul('cek-kesiapan');
    }
  };

  if (selesai) {
    const siap = skor >= SKOR_SIAP;
    return (
      <LayarModul
        judul="Cek Kesiapan"
        aksi={
          siap ? (
            <>
              <Link to="/modul/pengantar-lingkaran" className="tombol tombol--sekunder">
                Ulas lingkaran
              </Link>
              <Link to="/modul/kenali-tabung" className="tombol">
                Mulai belajar
              </Link>
            </>
          ) : (
            <>
              <Link to="/modul/kenali-tabung" className="tombol tombol--sekunder">
                Lewati
              </Link>
              <Link to="/modul/pengantar-lingkaran" className="tombol">
                Segarkan lingkaran
              </Link>
            </>
          )
        }
      >
        <p className={css.rumus}>
          {skor} dari {total} benar
        </p>
        <p className={css.teks}>
          {siap
            ? 'Kamu siap! Kamu sudah ingat jari-jari, keliling, dan luas lingkaran.'
            : 'Yuk, segarkan dulu materi lingkaran (sekitar 3 menit). Materi ini dipakai terus saat menghitung luas tabung.'}
        </p>
      </LayarModul>
    );
  }

  const soal = SOAL_KESIAPAN[ke];
  return (
    <LayarModul
      judul="Cek Kesiapan"
      langkah={{ ke: ke + 1, total }}
      aksi={
        <button type="button" className="tombol" disabled={!sudahJawab} onClick={lanjut}>
          {ke + 1 < total ? 'Lanjut' : 'Lihat hasil'}
        </button>
      }
    >
      <p className={css.petunjuk}>Sebelum mulai, cek dulu ingatanmu tentang lingkaran.</p>
      <PilihanGanda
        key={soal.id}
        tanya={soal.tanya}
        pilihan={soal.pilihan}
        tepat={soal.tepat}
        penjelasan={soal.penjelasan}
        onJawab={jawab}
      />
    </LayarModul>
  );
}
