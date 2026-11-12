import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { DoubleSide } from 'three';
import { fasaBuka, posisiGelinding, posisiSelimut, SEGMEN_BAWAAN } from '../lib/geometriTabung.js';
import { BAGIAN_TABUNG, TAMPIL_SEMUA } from '../data/bagian.js';
import { useGeometriSelimut } from './SelimutLentur.js';
import GarisUkur3D from './GarisUkur3D.jsx';
import LabelBagian from './LabelBagian.jsx';

const ABU = '#9ca3af';
const AMBANG_GESER = 6; // px: ketukan yang ternyata geseran (memutar kamera) diabaikan

function useWarnaToken() {
  return useMemo(() => {
    const gaya = getComputedStyle(document.documentElement);
    const warna = {};
    for (const [kunci, info] of Object.entries(BAGIAN_TABUNG)) {
      warna[kunci] = gaya.getPropertyValue(info.token).trim() || '#888888';
    }
    return warna;
  }, []);
}

/** Bagian yang tidak sedang dibahas dibuat abu-abu transparan (pensinyalan, docs/DESAIN.md §2.5). */
function Bahan({ warna, aktif }) {
  return (
    <meshStandardMaterial
      color={aktif ? warna : ABU}
      roughness={0.8}
      metalness={0}
      side={DoubleSide}
      transparent
      opacity={aktif ? 1 : 0.25}
      depthWrite={aktif}
    />
  );
}

/**
 * Tabung 3D: alas, tutup, selimut sebagai mesh terpisah.
 * Props sama dengan Tabung2D sehingga halaman bisa berganti 2D/3D tanpa mengubah logika.
 */
export default function Tabung3D({
  r,
  t,
  sorot = [],
  onKetuk,
  progresBuka = 0,
  tampilkan = TAMPIL_SEMUA,
  gelinding = null,
  tampilUkuran = false,
  tampilUkuranJaring = false,
  tampilLabel = true,
  segmen = SEGMEN_BAWAAN,
}) {
  const warna = useWarnaToken();
  const { sudutEngsel, k } = fasaBuka(progresBuka);
  const geoSelimut = useGeometriSelimut(r, t, k, segmen);

  const L = 2 * Math.PI * r;
  const aktif = (b) => sorot.length === 0 || sorot.includes(b);
  const berlabel = (b) => tampilLabel && sorot.includes(b);
  const ketuk = (b) =>
    onKetuk
      ? (e) => {
          if (e.delta > AMBANG_GESER) return;
          e.stopPropagation();
          onKetuk(b);
        }
      : undefined;

  const sedangGelinding = gelinding != null && k === 0 && tampilkan.alas;
  const gl = sedangGelinding ? posisiGelinding(r, gelinding) : null;
  const sedikit = r * 0.02;
  const tebalKetuk = Math.max(r, t) * 0.06;

  const uLabelSelimut = -L / 8;
  const uGarisT = L / 8;
  const atasT = posisiSelimut(uGarisT, t, k, r);
  const bawahT = posisiSelimut(uGarisT, 0, k, r);
  const geser = (p) => [p[0], p[1], p[2] + sedikit * 2];

  return (
    <group>
      {/* Selimut */}
      {tampilkan.selimut && (
        <mesh geometry={geoSelimut} onClick={ketuk('selimut')}>
          <Bahan warna={warna.selimut} aktif={aktif('selimut')} />
        </mesh>
      )}
      {berlabel('selimut') && (
        <LabelBagian position={posisiSelimut(uLabelSelimut, t / 2, k, r)} warna={warna.selimut}>
          Selimut
        </LabelBagian>
      )}

      {/* Tutup: berputar pada engsel di (0, t, r) */}
      <group position={[0, t, r]} rotation={[sudutEngsel, 0, 0]}>
        {tampilkan.tutup && (
          <mesh position={[0, 0, -r]} rotation={[-Math.PI / 2, 0, 0]} onClick={ketuk('tutup')}>
            <circleGeometry args={[r, segmen]} />
            <Bahan warna={warna.tutup} aktif={aktif('tutup')} />
          </mesh>
        )}
        {berlabel('tutup') && (
          <LabelBagian position={[0, sedikit, -r * 0.45]} warna={warna.tutup}>
            Tutup
          </LabelBagian>
        )}
        {tampilUkuran && (
          <>
            <GarisUkur3D
              dari={[0, sedikit, -r]}
              ke={[r, sedikit, -r]}
              warna={warna.r}
              tebal={aktif('r') ? 5 : 3}
              tebalKetuk={tebalKetuk}
              onKetuk={ketuk('r')}
            />
            <LabelBagian position={[r / 2, sedikit * 4, -r - r * 0.15]} warna={warna.r}>
              r
            </LabelBagian>
          </>
        )}
      </group>

      {/* Alas: berputar pada engsel di (0, 0, r), atau digelindingkan */}
      {tampilkan.alas && !sedangGelinding && (
        <group position={[0, 0, r]} rotation={[-sudutEngsel, 0, 0]}>
          <mesh position={[0, 0, -r]} rotation={[Math.PI / 2, 0, 0]} onClick={ketuk('alas')}>
            <circleGeometry args={[r, segmen]} />
            <Bahan warna={warna.alas} aktif={aktif('alas')} />
          </mesh>
          {berlabel('alas') && (
            <LabelBagian position={[0, -sedikit, -r * 0.45]} warna={warna.alas}>
              Alas
            </LabelBagian>
          )}
        </group>
      )}
      {sedangGelinding && (
        <>
          <group position={gl.pusat} rotation={[0, 0, gl.sudut]}>
            <mesh onClick={ketuk('alas')}>
              <circleGeometry args={[r, segmen]} />
              <Bahan warna={warna.alas} aktif />
            </mesh>
            {/* titik penanda di tepi alas: kembali menyentuh tepi setelah satu putaran penuh */}
            <mesh position={[0, r * 0.9, sedikit]}>
              <circleGeometry args={[r * 0.1, 16]} />
              <meshBasicMaterial color={warna.r} />
            </mesh>
          </group>
          {gl.jarak > 0 && (
            <Line
              points={[
                [-L / 2, 0, r + sedikit],
                [-L / 2 + gl.jarak, 0, r + sedikit],
              ]}
              color={warna.r}
              lineWidth={6}
            />
          )}
        </>
      )}

      {/* Garis tinggi t pada permukaan selimut */}
      {tampilUkuran && (
        <>
          <GarisUkur3D
            dari={geser(bawahT)}
            ke={geser(atasT)}
            warna={warna.t}
            tebal={aktif('t') ? 5 : 3}
            tebalKetuk={tebalKetuk}
            onKetuk={ketuk('t')}
          />
          <LabelBagian position={geser(posisiSelimut(uGarisT + r * 0.35, t / 2, k, r))} warna={warna.t}>
            t
          </LabelBagian>
        </>
      )}

      {/* Ukuran pada jaring-jaring datar */}
      {tampilUkuranJaring && k === 0 && (
        <>
          <LabelBagian position={[L / 4, -r * 0.4, r]} warna={warna.r}>
            panjang = keliling alas = 2πr
          </LabelBagian>
          <LabelBagian position={[L / 2 + r * 0.25, t / 2, r]} warna={warna.t}>
            lebar = t
          </LabelBagian>
        </>
      )}
    </group>
  );
}
