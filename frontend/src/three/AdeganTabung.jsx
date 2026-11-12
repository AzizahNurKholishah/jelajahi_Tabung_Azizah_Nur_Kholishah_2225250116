import Panggung3D from './Panggung3D.jsx';
import Tabung3D from './Tabung3D.jsx';
import { perangkatLemah } from './dukungWebGL.js';

const ARAH_MIRING = [0.55, 0.5, 1];
const ARAH_DEPAN = [0, 0, 1];

/**
 * Titik masuk 3D yang di-lazy-load (chunk three.js terpisah).
 * mode 'kenali' = tabung utuh; mode 'jaring' = kamera dibingkai untuk jaring-jaring.
 */
export default function AdeganTabung({ mode = 'kenali', labelAria = 'Gambar tabung tiga dimensi', ...props }) {
  const { r, t, progresBuka = 0 } = props;
  const jaring = mode === 'jaring';
  const datar = progresBuka >= 0.9;

  const ukuran = jaring ? Math.max(2 * Math.PI * r + 2.5 * r, t + 4.8 * r) : Math.max(2.8 * r, t * 1.4);
  const target = jaring ? [0, t / 2, r] : [0, t / 2, 0];
  const arah = jaring && datar ? ARAH_DEPAN : ARAH_MIRING;

  return (
    <Panggung3D ukuran={ukuran} target={target} arah={arah} labelAria={labelAria}>
      <Tabung3D {...props} segmen={perangkatLemah() ? 24 : 48} />
    </Panggung3D>
  );
}
