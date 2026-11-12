import { useEffect, useState } from 'react';
import LayarModul from '../components/LayarModul.jsx';
import { useProgres } from '../state/ProgresContext.jsx';
import { ambilRiwayat, jumlahAntrean, kirimAntrean } from '../state/logger.js';
import sc from '../components/Soal.module.css';
import css from './materi.module.css';

// Tentang + Mode Peneliti (F12, FR-11). Kode siswa diisi peneliti setelah ada persetujuan.
const PIN = import.meta.env.VITE_PIN_PENELITI ?? '2026';
const POLA_KODE = /^S\d{2,3}$/;
const POLA_KELAS = /^[A-Za-z0-9-]{0,20}$/;

function ModePeneliti() {
  const { progres, setPeneliti } = useProgres();
  const [kodeSiswa, setKodeSiswa] = useState(progres.peneliti.kodeSiswa);
  const [kodeKelas, setKodeKelas] = useState(progres.peneliti.kodeKelas);
  const [pesan, setPesan] = useState(null);
  const [antrean, setAntrean] = useState(null);

  const segarkan = () => jumlahAntrean().then(setAntrean);
  useEffect(() => {
    segarkan();
  }, []);

  const simpan = () => {
    const ks = kodeSiswa.trim().toUpperCase();
    const kk = kodeKelas.trim();
    if (ks && !POLA_KODE.test(ks)) return setPesan('Kode siswa harus seperti S01 atau S012 (tanpa nama).');
    if (!POLA_KELAS.test(kk)) return setPesan('Kode kelas hanya huruf, angka, dan tanda hubung.');
    setPeneliti(ks, kk);
    setKodeSiswa(ks);
    setPesan(ks ? `Tersimpan. Log untuk ${ks} mulai dicatat.` : 'Kode dihapus. Log tidak dicatat.');
  };

  const kirim = async () => {
    setPesan('Mengirim…');
    const h = await kirimAntrean();
    setAntrean(h.sisa);
    setPesan(h.galat ? `Belum terkirim (${h.galat}). Data aman di perangkat dan akan dicoba lagi.` : `${h.terkirim} catatan terkirim.`);
  };

  const unduh = async () => {
    const data = await ambilRiwayat();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `log-jelajah-tabung-${progres.peneliti.kodeSiswa || 'tanpa-kode'}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <section className={css.kartuInfo}>
      <h2 className={sc.judulLangkah}>Mode Peneliti</h2>
      <p className={css.petunjuk}>Isi hanya kode informan (mis. S01), jangan nama. Isi setelah ada persetujuan orang tua/wali dan siswa.</p>
      <label className={sc.barisIsian}>
        <span className={sc.labelIsian}>Kode siswa</span>
        <input className={sc.input} style={{ textAlign: 'left' }} value={kodeSiswa} onChange={(e) => setKodeSiswa(e.target.value)} placeholder="S01" />
      </label>
      <label className={sc.barisIsian}>
        <span className={sc.labelIsian}>Kode kelas</span>
        <input className={sc.input} style={{ textAlign: 'left' }} value={kodeKelas} onChange={(e) => setKodeKelas(e.target.value)} placeholder="VIII-A" />
      </label>
      <div className={sc.barisAksi}>
        <button type="button" className="tombol" onClick={simpan}>
          Simpan kode
        </button>
      </div>
      <p className={css.petunjuk}>Catatan yang belum terkirim: {antrean ?? '…'}</p>
      <div className={sc.barisAksi}>
        <button type="button" className="tombol tombol--sekunder" onClick={kirim}>
          Kirim sekarang
        </button>
        <button type="button" className="tombol tombol--sekunder" onClick={unduh}>
          Unduh log (JSON)
        </button>
      </div>
      {pesan && (
        <p className={sc.umpanInfo} aria-live="polite">
          {pesan}
        </p>
      )}
    </section>
  );
}

export default function Tentang() {
  const { resetProgres } = useProgres();
  const [pin, setPin] = useState('');
  const [masuk, setMasuk] = useState(false);
  const [pesanReset, setPesanReset] = useState(null);

  return (
    <LayarModul judul="Tentang">
      <p className={css.teks}>
        <strong>Jelajah Tabung</strong> membantu siswa SMP kelas VIII memahami luas permukaan tabung: lihat tabungnya, buka
        jaring-jaringnya, pahami asal rumusnya, lalu berlatih langkah demi langkah.
      </p>
      <p className={css.petunjuk}>
        Dikembangkan dengan model ADDIE oleh Azizah Nur Kholishah (Pendidikan Matematika). Aplikasi tidak meminta nama dan
        tidak memakai pelacak.
      </p>

      <div className={css.kartuInfo}>
        <strong>Cara pakai di HP:</strong> buka menu ⋮ di Chrome → "Tambahkan ke layar utama". Setelah dibuka sekali,
        aplikasi bisa dipakai tanpa internet.
      </div>

      <div className={sc.barisAksi}>
        <button
          type="button"
          className="tombol tombol--sekunder"
          onClick={() => {
            if (window.confirm('Hapus semua progres dan bintang di perangkat ini?')) {
              resetProgres();
              setPesanReset('Progres sudah dihapus.');
            }
          }}
        >
          Mulai ulang progres
        </button>
      </div>
      {pesanReset && <p className={sc.umpanInfo}>{pesanReset}</p>}

      {masuk ? (
        <ModePeneliti />
      ) : (
        <form
          className={css.kartuInfo}
          onSubmit={(e) => {
            e.preventDefault();
            setMasuk(pin === PIN);
          }}
        >
          <label className={sc.barisIsian}>
            <span className={sc.labelIsian}>PIN peneliti</span>
            <input className={sc.input} type="password" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value)} />
          </label>
          <button type="submit" className={sc.tombolKecil}>
            Masuk
          </button>
        </form>
      )}
    </LayarModul>
  );
}
