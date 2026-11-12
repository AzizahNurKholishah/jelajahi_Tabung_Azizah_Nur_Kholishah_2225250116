import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { BufferAttribute, BufferGeometry } from 'three';
import { indeksSelimut, isiPosisiSelimut } from '../lib/geometriTabung.js';

/**
 * Geometri selimut yang bisa dilenturkan dari tabung (k = 1) ke persegi panjang datar (k = 0).
 * Perhitungan posisi ada di lib/geometriTabung.js (sudah diuji: panjang busur selalu 2πr).
 */
export function useGeometriSelimut(r, t, k, segmen) {
  const geometri = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array((segmen + 1) * 2 * 3), 3));
    g.setIndex(indeksSelimut(segmen));
    return g;
  }, [segmen]);

  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    const posisi = geometri.getAttribute('position');
    isiPosisiSelimut(posisi.array, r, t, k, segmen);
    posisi.needsUpdate = true;
    geometri.computeVertexNormals();
    geometri.computeBoundingSphere();
    invalidate();
  }, [geometri, r, t, k, segmen, invalidate]);

  useEffect(() => () => geometri.dispose(), [geometri]);

  return geometri;
}
