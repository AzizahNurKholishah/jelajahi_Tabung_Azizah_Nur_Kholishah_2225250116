import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import PemberitahuanVersi from './PemberitahuanVersi.jsx';
import { mulaiPengirimOtomatis } from './state/logger.js';
import './styles/tokens.css';
import './styles/global.css';

// Kirim antrean log penelitian (jika ada) saat aplikasi dibuka, saat online, dan tiap 60 detik.
mulaiPengirimOtomatis();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </HashRouter>
    <PemberitahuanVersi />
  </StrictMode>,
);
