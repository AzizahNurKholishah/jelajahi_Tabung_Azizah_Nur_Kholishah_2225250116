import { Component, lazy, Suspense } from 'react';
import Tabung2D from './Tabung2D.jsx';
import { useModeGrafik } from '../state/pengaturan.js';
import css from './TampilanTabung.module.css';

// three.js hanya diunduh ketika tampilan 3D benar-benar dipakai (docs/ARSITEKTUR.md §7.4).
const AdeganTabung = lazy(() => import('../three/AdeganTabung.jsx'));

/** Bila 3D gagal (mis. WebGL hilang), tampilkan 2D alih-alih layar kosong. */
class PenangkapGalat3D extends Component {
  state = { gagal: false };

  static getDerivedStateFromError() {
    return { gagal: true };
  }

  render() {
    return this.state.gagal ? this.props.cadangan : this.props.children;
  }
}

/** Memilih tabung 3D (three.js) atau 2D (SVG) sesuai perangkat & pilihan siswa. */
export default function TampilanTabung(props) {
  const [mode, setMode] = useModeGrafik();
  const pakai3D = mode === '3d';
  const cadangan = <Tabung2D {...props} />;

  return (
    <div className={css.wadah}>
      {pakai3D ? (
        <PenangkapGalat3D cadangan={cadangan}>
          <Suspense fallback={<div className={css.memuat}>Menyiapkan tabung…</div>}>
            <AdeganTabung {...props} />
          </Suspense>
        </PenangkapGalat3D>
      ) : (
        cadangan
      )}
      <button
        type="button"
        className={css.sakelar}
        onClick={() => setMode(pakai3D ? '2d' : '3d')}
        aria-label={pakai3D ? 'Ganti ke gambar 2D' : 'Ganti ke tampilan 3D'}
      >
        {pakai3D ? '2D' : '3D'}
      </button>
    </div>
  );
}
