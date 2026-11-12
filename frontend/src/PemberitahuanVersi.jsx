import { useRegisterSW } from 'virtual:pwa-register/react';

// Toast "Versi baru tersedia" (docs/ARSITEKTUR.md §8). Hanya diimpor oleh main.jsx, bukan oleh tes.
export default function PemberitahuanVersi() {
  const {
    needRefresh: [perluMuatUlang, setPerluMuatUlang],
    updateServiceWorker,
  } = useRegisterSW();

  if (!perluMuatUlang) return null;

  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        left: 16,
        right: 16,
        bottom: 96,
        maxWidth: 528,
        margin: '0 auto',
        padding: '12px 16px',
        borderRadius: 12,
        background: 'var(--c-teks)',
        color: '#fff',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        zIndex: 50,
      }}
    >
      <span style={{ flex: 1 }}>Versi baru tersedia.</span>
      <button type="button" className="tombol" onClick={() => updateServiceWorker(true)}>
        Muat ulang
      </button>
      <button
        type="button"
        aria-label="Tutup pemberitahuan"
        onClick={() => setPerluMuatUlang(false)}
        style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, minWidth: 48, minHeight: 48 }}
      >
        ×
      </button>
    </div>
  );
}
