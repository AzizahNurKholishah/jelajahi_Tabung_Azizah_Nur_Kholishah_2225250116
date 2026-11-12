import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayarModul from '../components/LayarModul.jsx';
import NavLangkah from '../components/NavLangkah.jsx';
import Tabung2D from '../components/Tabung2D.jsx';
import InputAngka from '../components/InputAngka.jsx';
import PilihanGanda from '../components/PilihanGanda.jsx';
import { CONTOH } from '../data/contoh.js';
import { periksaMasukan } from '../lib/periksa.js';
import { formatAngka } from '../lib/angka.js';
import { useProgres } from '../state/ProgresContext.jsx';
import sc from '../components/Soal.module.css';
import css from './materi.module.css';

// M4 — Contoh Terurai dengan fading (F4; GL01, GL03, GL05).

/** Satu kotak isian di dalam contoh: petunjuk muncul setelah 2 kali salah (DS02). */
function IsianContoh({ isian, onBenar }) {
  const [nilai, setNilai] = useState('');
  const [hasil, setHasil] = useState(null);
  const [salah, setSalah] = useState(0);

  const periksa = () => {
    const h = periksaMasukan(nilai, isian.kunci);
    setHasil(h);
    if (h.status === 'benar') onBenar();
    else if (h.status === 'salah') setSalah((s) => s + 1);
  };

  const benar = hasil?.status === 'benar';
  return (
    <div>
      <InputAngka
        label={isian.label}
        nilai={nilai}
        satuan={isian.satuan}
        status={hasil ? (benar ? 'benar' : 'salah') : undefined}
        nonaktif={benar}
        onUbah={(v) => {
          setNilai(v);
          setHasil(null);
        }}
        onEnter={periksa}
      />
      {!benar && (
        <button type="button" className={sc.tombolKecil} onClick={periksa}>
          Periksa
        </button>
      )}
      <div aria-live="polite">
        {hasil?.status === 'bukan-angka' && <p className={sc.umpanSalah}>{hasil.pesan}</p>}
        {hasil?.status === 'salah' && <p className={sc.umpanSalah}>Belum tepat. Coba hitung lagi.</p>}
        {salah >= 2 && !benar && (
          <p className={sc.petunjuk}>
            💡 {isian.petunjuk} {salah >= 3 && <>Hasilnya {formatAngka(isian.kunci)}.</>}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ContohTerurai() {
  const navigate = useNavigate();
  const { selesaiModul, catat } = useProgres();
  const [idxContoh, setIdxContoh] = useState(0);
  const [terbuka, setTerbuka] = useState(1); // jumlah langkah yang sudah tampil
  const [isianBenar, setIsianBenar] = useState({});
  const [sudahBanding, setSudahBanding] = useState(false);
  const [putaran, setPutaran] = useState(0); // dinaikkan saat contoh diulang agar isian & pilihan kembali kosong

  const contoh = CONTOH[idxContoh];
  const langkahTampil = contoh.langkah.slice(0, terbuka);
  const langkahTerakhir = langkahTampil.at(-1);
  const isianTerakhirBelum = langkahTerakhir.isian && !isianBenar[`${contoh.id}-${terbuka - 1}`];
  const semuaTampil = terbuka >= contoh.langkah.length;
  const contohSelesai = semuaTampil && !isianTerakhirBelum && (!contoh.perbandingan || sudahBanding);
  const sorot = [...langkahTampil].reverse().find((l) => l.sorot)?.sorot ?? [];

  const pindahContoh = (i) => {
    const awalan = `${CONTOH[i].id}-`;
    setIdxContoh(i);
    setTerbuka(1);
    setSudahBanding(false);
    setIsianBenar((s) => Object.fromEntries(Object.entries(s).filter(([k]) => !k.startsWith(awalan))));
    setPutaran((n) => n + 1);
  };

  const lanjut = () => {
    if (!semuaTampil) return setTerbuka((n) => n + 1);
    if (idxContoh < CONTOH.length - 1) return pindahContoh(idxContoh + 1);
    selesaiModul('contoh');
    navigate('/modul/arena');
  };

  return (
    <LayarModul
      judul="Contoh Soal"
      langkah={{ ke: idxContoh + 1, total: CONTOH.length }}
      visual={
        <Tabung2D r={contoh.gambar.r} t={contoh.gambar.t} tampilkan={contoh.gambar.tampilkan} sorot={sorot} tampilLabel={false} />
      }
      visualKecil
      aksi={
        <NavLangkah
          ke={idxContoh + 1}
          total={CONTOH.length}
          onKembali={idxContoh > 0 ? () => pindahContoh(idxContoh - 1) : undefined}
          onUlangi={() => pindahContoh(idxContoh)}
          lanjutAktif={semuaTampil ? contohSelesai : !isianTerakhirBelum}
          labelLanjut={
            !semuaTampil ? 'Langkah berikutnya' : idxContoh < CONTOH.length - 1 ? 'Contoh berikutnya' : 'Ke Arena →'
          }
          onLanjut={lanjut}
        />
      }
    >
      <h2 className={sc.judulLangkah}>{contoh.judul}</h2>
      <div className={sc.kartuSoal}>
        <p className={sc.teksSoal}>{contoh.teks}</p>
      </div>

      {langkahTampil.map((l, i) => {
        const kunci = `${contoh.id}-${i}`;
        return (
          <section key={kunci} className={`${sc.langkah} ${l.isian && isianBenar[kunci] ? sc.langkahSelesai : ''}`}>
            <h3 className={sc.judulLangkah}>{l.judul}</h3>
            {l.isi && <p className={sc.ringkasLangkah}>{l.isi}</p>}
            {l.isian && (
              <IsianContoh
                key={`${kunci}-${putaran}`}
                isian={l.isian}
                onBenar={() => {
                  setIsianBenar((s) => ({ ...s, [kunci]: true }));
                  catat({ layar: 'contoh', soal: contoh.id, langkah: String(i), aksi: 'jawab', benar: true });
                }}
              />
            )}
          </section>
        );
      })}

      {semuaTampil && !isianTerakhirBelum && contoh.perbandingan && (
        <PilihanGanda
          key={`${contoh.id}-${putaran}`}
          tanya={contoh.perbandingan.tanya}
          pilihan={contoh.perbandingan.pilihan}
          tepat={contoh.perbandingan.tepat}
          mode="refleksi"
          onJawab={(i, tepat) => {
            setSudahBanding(true);
            catat({ layar: 'contoh', soal: contoh.id, aksi: 'refleksi', jawaban: String(i), benar: tepat });
          }}
        />
      )}
      {!semuaTampil && <p className={css.petunjuk}>Baca langkah ini, lalu tekan "Langkah berikutnya".</p>}
    </LayarModul>
  );
}
