import { Html } from '@react-three/drei';

/** Label teks yang menempel pada objek 3D dan ikut bergerak saat diputar (kedekatan spasial). */
export default function LabelBagian({ position, warna, children }) {
  return (
    <Html position={position} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
      <span className="label-3d" style={{ borderColor: warna, color: warna }}>
        {children}
      </span>
    </Html>
  );
}
