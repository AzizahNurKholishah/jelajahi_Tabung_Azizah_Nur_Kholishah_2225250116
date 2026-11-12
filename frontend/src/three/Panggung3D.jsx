import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import { hitungPosisiKamera } from '../lib/geometriTabung.js';
import { kurangiGerak } from '../state/gerak.js';
import css from './Panggung3D.module.css';

const FOV = 40;

/**
 * Menggerakkan kamera dengan halus bila arah/target/jarak berubah atau tombol reset ditekan.
 * Jika hanya ukuran (jarak) yang berubah, arah pandang siswa dipertahankan.
 */
function PengaturKamera({ target, jarak, arah, reset }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  const invalidate = useThree((s) => s.invalidate);
  const tujuan = useRef(null);
  const sebelum = useRef(null);

  const kunciArah = `${arah.join(',')}|${reset}`;
  const kunciTarget = target.join(',');

  useEffect(() => {
    if (!controls) return;
    const tgt = new Vector3(...target);
    const arahBerubah = !sebelum.current || sebelum.current !== kunciArah;
    let arahPakai = arah;
    if (!arahBerubah) {
      const d = camera.position.clone().sub(controls.target);
      arahPakai = [d.x, d.y, d.z];
    }
    const posisi = new Vector3(...hitungPosisiKamera(target, jarak, arahPakai));
    const pertama = sebelum.current === null;
    sebelum.current = kunciArah;

    if (pertama || kurangiGerak()) {
      camera.position.copy(posisi);
      controls.target.copy(tgt);
      controls.update();
      tujuan.current = null;
    } else {
      tujuan.current = { posisi, tgt };
    }
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls, kunciArah, kunciTarget, jarak]);

  useFrame(() => {
    const tj = tujuan.current;
    if (!tj || !controls) return;
    camera.position.lerp(tj.posisi, 0.18);
    controls.target.lerp(tj.tgt, 0.18);
    if (camera.position.distanceTo(tj.posisi) < jarak * 0.002) {
      camera.position.copy(tj.posisi);
      controls.target.copy(tj.tgt);
      tujuan.current = null;
    }
    controls.update();
    invalidate();
  });

  return null;
}

/**
 * Kanvas 3D: kamera, cahaya sederhana, kontrol putar terbatas, dan tombol "posisi awal".
 * Aturan desain: tanpa auto-rotate, tanpa geser, sudut & zoom dibatasi (docs/DESAIN.md §2.5).
 */
export default function Panggung3D({ ukuran, target, arah, labelAria, children }) {
  const [reset, setReset] = useState(0);
  const jarak = (ukuran / 2 / Math.tan(((FOV / 2) * Math.PI) / 180)) * 1.1;
  const posisiAwal = useRef(hitungPosisiKamera(target, jarak, arah)).current;

  return (
    <div className={css.wadah}>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'low-power' }}
        camera={{ position: posisiAwal, fov: FOV, near: 0.1, far: 5000 }}
        role="img"
        aria-label={labelAria}
        className={css.kanvas}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 6, 5]} intensity={1.6} />
        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping={false}
          minPolarAngle={0.35}
          maxPolarAngle={1.9}
          minDistance={jarak * 0.6}
          maxDistance={jarak * 1.6}
        />
        <PengaturKamera target={target} jarak={jarak} arah={arah} reset={reset} />
        {children}
      </Canvas>
      <button
        type="button"
        className={css.reset}
        onClick={() => setReset((n) => n + 1)}
        aria-label="Kembalikan tabung ke posisi awal"
        title="Posisi awal"
      >
        ↺
      </button>
    </div>
  );
}
