import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProgresProvider } from './state/ProgresContext.jsx';
import Beranda from './pages/Beranda.jsx';
import CekKesiapan from './pages/CekKesiapan.jsx';
import PengantarLingkaran from './pages/PengantarLingkaran.jsx';
import KenaliTabung from './pages/KenaliTabung.jsx';
import BukaTabung from './pages/BukaTabung.jsx';
import Laboratorium from './pages/Laboratorium.jsx';
import AsalRumus from './pages/AsalRumus.jsx';
import ContohTerurai from './pages/ContohTerurai.jsx';
import PilihLevel from './pages/arena/PilihLevel.jsx';
import Soal from './pages/arena/Soal.jsx';
import Rangkuman from './pages/Rangkuman.jsx';

// Halaman peneliti jarang dibuka siswa → dipisah dari bundle awal.
const Tentang = lazy(() => import('./pages/Tentang.jsx'));

export default function App() {
  return (
    <ProgresProvider>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/modul/cek-kesiapan" element={<CekKesiapan />} />
          <Route path="/modul/pengantar-lingkaran" element={<PengantarLingkaran />} />
          <Route path="/modul/kenali-tabung" element={<KenaliTabung />} />
          <Route path="/modul/buka-tabung" element={<BukaTabung />} />
          <Route path="/modul/laboratorium" element={<Laboratorium />} />
          <Route path="/modul/asal-rumus" element={<AsalRumus />} />
          <Route path="/modul/contoh" element={<ContohTerurai />} />
          <Route path="/modul/arena" element={<PilihLevel />} />
          <Route path="/modul/arena/:level/:no" element={<Soal />} />
          <Route path="/modul/rangkuman" element={<Rangkuman />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ProgresProvider>
  );
}
