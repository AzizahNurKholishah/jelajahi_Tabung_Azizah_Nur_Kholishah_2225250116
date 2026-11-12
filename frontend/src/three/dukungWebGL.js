// Menentukan apakah perangkat sebaiknya memakai 3D atau gambar 2D (docs/ARSITEKTUR.md §7.4).
// File ini sengaja TIDAK mengimpor three.js agar tetap ringan di bundle awal.

export function adaWebGL() {
  try {
    const kanvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (kanvas.getContext('webgl2') || kanvas.getContext('webgl')));
  } catch {
    return false;
  }
}

export function perangkatLemah() {
  const inti = navigator.hardwareConcurrency ?? 4;
  const memori = navigator.deviceMemory ?? 4; // GB; hanya tersedia di Chrome
  return inti <= 2 || memori <= 2;
}

export function modeGrafikBawaan() {
  return adaWebGL() && !perangkatLemah() ? '3d' : '2d';
}
