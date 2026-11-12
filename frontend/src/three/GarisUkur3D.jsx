import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { Quaternion, Vector3 } from 'three';

const SUMBU_Y = new Vector3(0, 1, 0);

/**
 * Garis ukur (r atau t) + area ketuk tak terlihat yang lebih tebal,
 * karena garis tipis sulit diketuk jari (target sentuh, docs/DESAIN.md §6).
 */
export default function GarisUkur3D({ dari, ke, warna, tebal = 3, tebalKetuk, onKetuk }) {
  const { tengah, putaran, panjang } = useMemo(() => {
    const a = new Vector3(...dari);
    const b = new Vector3(...ke);
    const arah = b.clone().sub(a);
    return {
      tengah: a.clone().add(b).multiplyScalar(0.5),
      putaran: new Quaternion().setFromUnitVectors(SUMBU_Y, arah.clone().normalize()),
      panjang: arah.length(),
    };
  }, [dari, ke]);

  return (
    <group>
      <Line points={[dari, ke]} color={warna} lineWidth={tebal} />
      {onKetuk && (
        <mesh position={tengah} quaternion={putaran} onClick={onKetuk}>
          <cylinderGeometry args={[tebalKetuk, tebalKetuk, panjang, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
