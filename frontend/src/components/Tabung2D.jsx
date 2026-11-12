import { BAGIAN_TABUNG, TAMPIL_SEMUA } from '../data/bagian.js';
import { posisiGelinding } from '../lib/geometriTabung.js';

/**
 * Cadangan 2D (SVG) untuk perangkat tanpa WebGL / HP lemah. Props sama dengan Tabung3D.
 * Koordinat SVG dalam satuan cm, sumbu y ke bawah.
 */
export default function Tabung2D({
  r,
  t,
  mode = 'kenali',
  progresBuka = 0,
  sorot = [],
  onKetuk,
  tampilkan = TAMPIL_SEMUA,
  gelinding = null,
  tampilUkuran = false,
  tampilUkuranJaring = false,
  tampilLabel = true,
  labelAria = 'Gambar tabung',
}) {
  const L = 2 * Math.PI * r;
  const ry = r * 0.3;
  const pad = r * 0.6;
  const fs = Math.max(r, t) * 0.13;
  const jaring = mode === 'jaring';
  const sudahJaring = progresBuka >= 0.5;

  const aktif = (b) => sorot.length === 0 || sorot.includes(b);
  const isi = (b) => (aktif(b) ? `var(${BAGIAN_TABUNG[b].token})` : 'var(--c-garis)');
  const berlabel = (b) => tampilLabel && sorot.includes(b);
  const bisaKetuk = (b) =>
    onKetuk
      ? {
          onClick: () => onKetuk(b),
          onKeyDown: (e) => (e.key === 'Enter' || e.key === ' ') && onKetuk(b),
          role: 'button',
          tabIndex: 0,
          'aria-label': BAGIAN_TABUNG[b].nama,
          style: { cursor: 'pointer' },
        }
      : {};

  const viewBox = jaring
    ? [-L / 2 - r - pad, -2 * r - pad, L + 2 * r + 2 * pad, t + 4 * r + 2 * pad]
    : [-r - pad * 2, -ry - pad, 2 * r + pad * 4, t + 2 * ry + pad * 2];

  const teks = (x, y, warna, isiTeks) => (
    <text x={x} y={y} fontSize={fs} fill={warna} fontWeight="700" textAnchor="middle" dominantBaseline="middle">
      {isiTeks}
    </text>
  );

  let gambar;
  if (!jaring || !sudahJaring) {
    // Tabung utuh; pada mode jaring, tutup naik & alas turun (fase engsel).
    const angkat = jaring ? (progresBuka / 0.5) * r : 0;
    const yTutup = -angkat;
    const yAlas = t + angkat;
    gambar = (
      <g>
        {tampilkan.alas && (
          <g {...bisaKetuk('alas')}>
            <ellipse cx={0} cy={yAlas} rx={r} ry={ry} fill={isi('alas')} opacity={aktif('alas') ? 0.9 : 0.4} />
          </g>
        )}
        {tampilkan.selimut && (
          <path
            {...bisaKetuk('selimut')}
            d={`M ${-r} 0 L ${-r} ${t} A ${r} ${ry} 0 0 0 ${r} ${t} L ${r} 0 A ${r} ${ry} 0 0 1 ${-r} 0 Z`}
            fill={isi('selimut')}
            opacity={aktif('selimut') ? 1 : 0.4}
          />
        )}
        {tampilkan.tutup ? (
          <g {...bisaKetuk('tutup')}>
            <ellipse cx={0} cy={yTutup} rx={r} ry={ry} fill={isi('tutup')} opacity={aktif('tutup') ? 1 : 0.4} />
          </g>
        ) : (
          <ellipse cx={0} cy={0} rx={r} ry={ry} fill="var(--c-latar)" stroke="var(--c-teks-2)" strokeWidth={r * 0.03} />
        )}
        {tampilUkuran && (
          <>
            <g {...bisaKetuk('r')}>
              <line x1={0} y1={yTutup} x2={r} y2={yTutup} stroke="var(--c-jari)" strokeWidth={r * 0.05} />
              <line x1={0} y1={yTutup} x2={r} y2={yTutup} stroke="transparent" strokeWidth={r * 0.35} />
            </g>
            {teks(r / 2, yTutup - ry * 0.6, 'var(--c-jari)', 'r')}
            <g {...bisaKetuk('t')}>
              <line x1={r + pad * 0.6} y1={0} x2={r + pad * 0.6} y2={t} stroke="var(--c-tinggi)" strokeWidth={r * 0.05} />
              <line x1={r + pad * 0.6} y1={0} x2={r + pad * 0.6} y2={t} stroke="transparent" strokeWidth={r * 0.4} />
            </g>
            {teks(r + pad * 1.3, t / 2, 'var(--c-tinggi)', 't')}
          </>
        )}
        {berlabel('tutup') && teks(0, yTutup, 'var(--c-teks)', 'Tutup')}
        {berlabel('selimut') && teks(0, t / 2, 'var(--c-teks)', 'Selimut')}
        {berlabel('alas') && teks(0, yAlas + ry + fs, 'var(--c-alas)', 'Alas')}
      </g>
    );
  } else {
    // Jaring-jaring: persegi panjang melebar dari 2r ke 2πr.
    const f = Math.min(1, (progresBuka - 0.5) / 0.4);
    const lebar = 2 * r + (L - 2 * r) * f;
    const gl = gelinding != null && f >= 1 ? posisiGelinding(r, gelinding) : null;
    const cxAlas = gl ? gl.pusat[0] : 0;
    const penanda = gl
      ? [cxAlas - r * 0.9 * Math.sin(gl.sudut), t + r - r * 0.9 * Math.cos(gl.sudut)]
      : null;

    gambar = (
      <g>
        {tampilkan.selimut && (
          <rect
            {...bisaKetuk('selimut')}
            x={-lebar / 2}
            y={0}
            width={lebar}
            height={t}
            fill={isi('selimut')}
            opacity={aktif('selimut') ? 1 : 0.4}
          />
        )}
        {tampilkan.tutup && (
          <circle {...bisaKetuk('tutup')} cx={0} cy={-r} r={r} fill={isi('tutup')} opacity={aktif('tutup') ? 1 : 0.4} />
        )}
        {tampilkan.alas && (
          <circle
            {...bisaKetuk('alas')}
            cx={cxAlas}
            cy={t + r}
            r={r}
            fill={isi('alas')}
            opacity={aktif('alas') ? 1 : 0.4}
          />
        )}
        {gl && gl.jarak > 0 && (
          <line x1={-L / 2} y1={t} x2={-L / 2 + gl.jarak} y2={t} stroke="var(--c-jari)" strokeWidth={r * 0.08} />
        )}
        {penanda && <circle cx={penanda[0]} cy={penanda[1]} r={r * 0.1} fill="var(--c-jari)" />}
        {berlabel('tutup') && teks(0, -r, 'var(--c-latar)', 'Tutup')}
        {berlabel('selimut') && teks(-lebar / 4, t / 2, 'var(--c-latar)', 'Selimut')}
        {berlabel('alas') && teks(cxAlas, t + r, 'var(--c-latar)', 'Alas')}
        {tampilUkuranJaring && f >= 1 && (
          <>
            {teks(L / 4, t + r * 0.45, 'var(--c-jari)', 'panjang = 2πr')}
            {teks(L / 2 + r * 0.7, t / 2, 'var(--c-tinggi)', 'lebar = t')}
          </>
        )}
      </g>
    );
  }

  return (
    <svg
      viewBox={viewBox.join(' ')}
      width="100%"
      height="100%"
      role="img"
      aria-label={labelAria}
      preserveAspectRatio="xMidYMid meet"
    >
      {gambar}
    </svg>
  );
}
