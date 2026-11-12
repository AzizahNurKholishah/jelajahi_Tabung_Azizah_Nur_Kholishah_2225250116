import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import LayarModul from '../../components/LayarModul.jsx';
import KartuSoal from '../../components/KartuSoal.jsx';
import InputAngka from '../../components/InputAngka.jsx';
import PilihSatuan from '../../components/PilihSatuan.jsx';
import PilihanGanda from '../../components/PilihanGanda.jsx';
import Tabung2D from '../../components/Tabung2D.jsx';
import { BAGIAN_TABUNG } from '../../data/bagian.js';
import { LEVEL, soalPerLevel } from '../../data/soal.js';
import { buatLangkah, pembahasan, periksaLangkah } from '../../lib/langkahSoal.js';
import { bintangDariPetunjuk, tingkatPetunjuk, TINGKAT_MAKS } from '../../lib/petunjuk.js';
import { useProgres } from '../../state/ProgresContext.jsx';
import sc from '../../components/Soal.module.css';
import css from './arena.module.css';

const NOMOR = ['①', '②', '③', '④', '⑤'];
const URUTAN_BAGIAN = ['alas', 'tutup', 'selimut'];

export default function Soal() {
  const { level, no } = useParams();
  const daftar = soalPerLevel(Number(level));
  const soal = daftar[Number(no) - 1];
  if (!soal) return <Navigate to="/modul/arena" replace />;
  return <SoalInti key={soal.id} soal={soal} nomor={Number(no)} jumlah={daftar.length} />;
}

/** Centang bagian (langkah ②) + gambar mini yang menyala sesuai pilihan (kedekatan spasial). */
function PilihBagianSoal({ dipilih, onUbah, nonaktif, soal }) {
  const alih = (b) => onUbah(dipilih.includes(b) ? dipilih.filter((x) => x !== b) : [...dipilih, b]);
  return (
    <div className={sc.pilihBagian}>
      <div className={sc.gambarMini} aria-hidden="true">
        <Tabung2D r={7} t={10} sorot={dipilih.length ? dipilih : ['tidak-ada']} tampilLabel={false} />
      </div>
      <div className={sc.daftarCentang} role="group" aria-label={`Bagian yang dihitung untuk soal ${soal.id}`}>
        {URUTAN_BAGIAN.map((b) => (
          <button
            key={b}
            type="button"
            role="checkbox"
            aria-checked={dipilih.includes(b)}
            disabled={nonaktif}
            className={sc.centangBagian}
            style={{ '--warna': `var(${BAGIAN_TABUNG[b].token})` }}
            onClick={() => alih(b)}
          >
            <span className={sc.kotakCentang}>{dipilih.includes(b) ? '✓' : ''}</span>
            {BAGIAN_TABUNG[b].nama}
          </button>
        ))}
      </div>
    </div>
  );
}

function ringkasJawaban(langkah, jawaban) {
  if (langkah.jenis === 'bagian') return (jawaban.bagian ?? []).map((b) => BAGIAN_TABUNG[b].nama).join(' + ');
  const isi = langkah.isian.map((i) => `${i.label} ${i.awalan ?? ''}${jawaban[i.kunci]}${i.satuan ? ` ${i.satuan}` : ''}`);
  if (langkah.pilihanSatuan) isi[isi.length - 1] += ` ${jawaban.satuan}`;
  return isi.join(' · ');
}

function KotakLangkah({ langkah, urutan, st, aktif, onUbah, onPeriksa, onMinta, soal }) {
  const tingkat = tingkatPetunjuk(st.salah, st.minta);
  const jawaban = st.jawaban;

  if (st.selesai) {
    return (
      <section className={`${sc.langkah} ${sc.langkahSelesai}`}>
        <h3 className={sc.judulLangkah}>
          {NOMOR[urutan]} {langkah.judul} ✓
        </h3>
        <p className={sc.ringkasLangkah}>{ringkasJawaban(langkah, jawaban)}</p>
      </section>
    );
  }
  if (!aktif) return null;

  return (
    <section className={`${sc.langkah} ${sc.langkahAktif}`} aria-label={`Langkah ${urutan + 1}: ${langkah.judul}`}>
      <h3 className={sc.judulLangkah}>
        {NOMOR[urutan]} {langkah.judul}
      </h3>

      {langkah.jenis === 'bagian' ? (
        <PilihBagianSoal dipilih={jawaban.bagian ?? []} onUbah={(v) => onUbah('bagian', v)} soal={soal} />
      ) : (
        <>
          {langkah.isian.map((isian) => (
            <InputAngka
              key={isian.kunci}
              label={isian.label}
              nilai={jawaban[isian.kunci]}
              awalan={isian.awalan}
              satuan={langkah.pilihanSatuan ? undefined : isian.satuan}
              status={st.hasil ? (st.hasil.perIsian[isian.kunci] ? 'benar' : 'salah') : undefined}
              onUbah={(v) => onUbah(isian.kunci, v)}
              onEnter={onPeriksa}
            />
          ))}
          {langkah.pilihanSatuan && (
            <PilihSatuan pilihan={langkah.pilihanSatuan} nilai={jawaban.satuan} onUbah={(v) => onUbah('satuan', v)} />
          )}
        </>
      )}

      <div aria-live="polite">
        {st.hasil?.pesan && <p className={sc.umpanSalah}>{st.hasil.pesan}</p>}
        {tingkat >= 1 && (
          <p className={sc.petunjuk}>
            💡 <strong>Petunjuk:</strong> {langkah.petunjuk[0]}
          </p>
        )}
        {tingkat >= 2 && (
          <p className={sc.petunjuk}>
            👣 <strong>Langkahnya:</strong> {langkah.petunjuk[1]}
          </p>
        )}
      </div>

      <div className={sc.barisAksi}>
        <button type="button" className="tombol" onClick={onPeriksa}>
          Periksa
        </button>
        <button
          type="button"
          className="tombol tombol--sekunder"
          onClick={onMinta}
          disabled={tingkat >= TINGKAT_MAKS}
          aria-label="Minta petunjuk"
        >
          💡 Petunjuk
        </button>
      </div>
    </section>
  );
}

function SoalInti({ soal, nomor, jumlah }) {
  const navigate = useNavigate();
  const { catat, simpanSoal, tandaiSalahSatuan } = useProgres();
  const [tampilSemua, setTampilSemua] = useState(false);
  const daftarLangkah = useMemo(() => buatLangkah(soal, { tampilSemua }), [soal, tampilSemua]);
  const [status, setStatus] = useState({}); // { [idLangkah]: { jawaban, salah, minta, selesai, hasil } }
  const mulaiLangkah = useRef(Date.now());
  const tersimpan = useRef(false);

  const st = (id) => status[id] ?? { jawaban: {}, salah: 0, minta: 0, selesai: false, hasil: null };
  const idxAktif = daftarLangkah.findIndex((l) => !st(l.id).selesai);
  const semuaSelesai = idxAktif === -1;
  const totalPetunjuk = Object.values(status).reduce((n, s) => n + tingkatPetunjuk(s.salah, s.minta), 0);
  const bintang = bintangDariPetunjuk(totalPetunjuk);
  const levelInfo = LEVEL.find((l) => l.no === soal.level);

  const ubahStatus = (id, fn) => setStatus((s) => ({ ...s, [id]: fn(s[id] ?? { jawaban: {}, salah: 0, minta: 0, selesai: false, hasil: null }) }));

  const ubahJawaban = (id) => (kunci, nilai) =>
    ubahStatus(id, (s) => ({ ...s, jawaban: { ...s.jawaban, [kunci]: nilai }, hasil: null }));

  const periksa = (langkah) => {
    const s = st(langkah.id);
    const hasil = periksaLangkah(langkah, s.jawaban, soal);
    const salahBaru = hasil.benar ? s.salah : s.salah + 1;
    ubahStatus(langkah.id, (x) => ({ ...x, hasil, salah: salahBaru, selesai: hasil.benar }));
    if (hasil.kode === 'MK7') tandaiSalahSatuan();
    catat({
      layar: 'arena',
      soal: soal.id,
      langkah: langkah.id,
      aksi: 'jawab',
      jawaban: JSON.stringify(s.jawaban),
      benar: hasil.benar,
      miskonsepsi: hasil.kode,
      tingkatPetunjuk: tingkatPetunjuk(salahBaru, s.minta),
      durasiMs: Date.now() - mulaiLangkah.current,
    });
    if (hasil.benar) mulaiLangkah.current = Date.now();
  };

  const minta = (langkah) => {
    const s = st(langkah.id);
    const tingkatBaru = Math.min(TINGKAT_MAKS, tingkatPetunjuk(s.salah, s.minta) + 1);
    ubahStatus(langkah.id, (x) => ({ ...x, minta: tingkatBaru }));
    catat({ layar: 'arena', soal: soal.id, langkah: langkah.id, aksi: 'petunjuk', tingkatPetunjuk: tingkatBaru });
  };

  useEffect(() => {
    if (semuaSelesai && !tersimpan.current) {
      tersimpan.current = true;
      simpanSoal(soal.id, bintang, totalPetunjuk);
      catat({ layar: 'arena', soal: soal.id, aksi: 'selesai_soal', benar: true, tingkatPetunjuk: Math.min(2, totalPetunjuk) });
    }
  }, [semuaSelesai, soal.id, bintang, totalPetunjuk, simpanSoal, catat]);

  const berikutnya = nomor < jumlah ? `/modul/arena/${soal.level}/${nomor + 1}` : '/modul/arena';
  const adaLangkahBantu = buatLangkah(soal, { tampilSemua: true }).length > buatLangkah(soal).length;

  return (
    <LayarModul
      judul={`Level ${soal.level} • Soal ${nomor}/${jumlah}`}
      kembaliKe="/modul/arena"
      aksi={
        semuaSelesai ? (
          <>
            <Link to="/modul/arena" className="tombol tombol--sekunder">
              Pilih level
            </Link>
            <button type="button" className="tombol" onClick={() => navigate(berikutnya)}>
              {nomor < jumlah ? 'Soal berikutnya' : 'Selesai level'}
            </button>
          </>
        ) : undefined
      }
    >
      <p className={sc.petunjukKecil}>
        {levelInfo.nama}: {levelInfo.deskripsi}
      </p>
      <KartuSoal
        teks={soal.teks}
        tanda={soal.tanda}
        onCek={(h) => catat({ layar: 'arena', soal: soal.id, aksi: 'tandai', jawaban: `${h.ditemukan.length}/${soal.tanda.length}` })}
      />

      {adaLangkahBantu && !semuaSelesai && (
        <label className={css.tampilSemua}>
          <input type="checkbox" checked={tampilSemua} onChange={(e) => setTampilSemua(e.target.checked)} />
          Tampilkan semua langkah bantu
        </label>
      )}

      {daftarLangkah.map((l, i) => (
        <KotakLangkah
          key={l.id}
          langkah={l}
          urutan={i}
          st={st(l.id)}
          aktif={i === idxAktif}
          soal={soal}
          onUbah={ubahJawaban(l.id)}
          onPeriksa={() => periksa(l)}
          onMinta={() => minta(l)}
        />
      ))}

      {semuaSelesai && (
        <section aria-live="polite">
          <p className={sc.bintang} aria-label={`${bintang} bintang`}>
            {'★'.repeat(bintang)}
            {'☆'.repeat(3 - bintang)}
          </p>
          <p className={sc.umpanBenar}>
            ✓ Tepat! {totalPetunjuk === 0 ? 'Kamu menyelesaikannya tanpa petunjuk.' : `Kamu memakai ${totalPetunjuk} petunjuk.`}
          </p>
          <div className={sc.pembahasan}>
            <strong>Pembahasan</strong>
            {pembahasan(soal).map((baris) => (
              <p key={baris}>{baris}</p>
            ))}
          </div>
          {soal.refleksi && (
            <PilihanGanda
              tanya={soal.refleksi.tanya}
              pilihan={soal.refleksi.pilihan}
              tepat={soal.refleksi.tepat}
              mode="refleksi"
              onJawab={(i, tepat) =>
                catat({ layar: 'arena', soal: soal.id, aksi: 'refleksi', jawaban: String(i), benar: tepat })
              }
            />
          )}
        </section>
      )}
    </LayarModul>
  );
}
