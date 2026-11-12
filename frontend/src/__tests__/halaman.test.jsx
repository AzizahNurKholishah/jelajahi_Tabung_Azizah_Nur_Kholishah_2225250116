// @vitest-environment jsdom
// Uji asap alur M1–M3 dalam mode 2D (jsdom tidak punya WebGL).
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '../App.jsx';
import { setModeGrafik } from '../state/pengaturan.js';

function buka(path) {
  return render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
}

const tombol = (nama) => screen.getByRole('button', { name: nama });

beforeEach(() => setModeGrafik('2d'));
afterEach(cleanup);

describe('Beranda', () => {
  it('menampilkan peta belajar', () => {
    buka('/');
    expect(screen.getByRole('heading', { name: 'Jelajah Tabung' })).toBeTruthy();
    expect(screen.getByText('Laboratorium Tabung')).toBeTruthy();
  });
});

describe('M1 Kenali Tabung', () => {
  it('Lanjut baru aktif setelah 5 bagian ditemukan, lalu tantangan berjalan', () => {
    buka('/modul/kenali-tabung');
    const lanjut = tombol('Lanjut');
    expect(lanjut.disabled).toBe(true);

    for (const nama of [/^Alas/, /^Tutup/, /^Selimut/, /^r/, /^t/]) {
      fireEvent.click(screen.getAllByRole('button', { name: nama }).find((b) => b.hasAttribute('aria-pressed')));
    }
    expect(screen.getByText('5 dari 5 bagian sudah kamu temukan.')).toBeTruthy();
    expect(tombol('Lanjut').disabled).toBe(false);

    fireEvent.click(tombol('Lanjut'));
    expect(screen.getByText(/Tantangan 1\/3/)).toBeTruthy();
  });

  it('jawaban tantangan yang salah diberi umpan balik membangun', () => {
    buka('/modul/kenali-tabung');
    // lewati langkah 1
    for (const nama of [/^Alas/, /^Tutup/, /^Selimut/, /^r/, /^t/]) {
      fireEvent.click(screen.getAllByRole('button', { name: nama }).find((b) => b.hasAttribute('aria-pressed')));
    }
    fireEvent.click(tombol('Lanjut'));

    const target = screen.getByText(/Tantangan 1\/3/).querySelector('strong').textContent;
    const chip = screen.getAllByRole('button').filter((b) => b.hasAttribute('aria-pressed'));
    const salah = chip.find((b) => !target.startsWith(b.textContent.trim()) && !target.includes(`(${b.textContent.trim()})`));
    fireEvent.click(salah);
    expect(screen.getByText(/Coba cari/)).toBeTruthy();
    expect(screen.queryByText(/SALAH/)).toBeNull();
  });
});

describe('M2 Buka Tabung', () => {
  it('slider mengubah penjelasan, dan tombol gelinding muncul di 100%', () => {
    buka('/modul/buka-tabung');
    expect(screen.getByText('Geser untuk membuka tabung.')).toBeTruthy();
    const slider = screen.getByRole('slider', { name: 'Buka tabung' });

    fireEvent.change(slider, { target: { value: '60' } });
    expect(screen.getByText(/panjangnya tidak berubah/)).toBeTruthy();

    fireEvent.change(slider, { target: { value: '100' } });
    expect(tombol('Gelindingkan alas')).toBeTruthy();
  });
});

describe('M2b Laboratorium', () => {
  it('luas permukaan diperbarui saat tutup dimatikan', () => {
    buka('/modul/laboratorium');
    // r = 7, t = 10, π = 3,14: 153,86 + 153,86 + 439,6 = 747,32
    expect(screen.getByText('747,32 cm²')).toBeTruthy();
    fireEvent.click(tombol('Tanpa tutup'));
    // 153,86 + 439,6 = 593,46
    expect(screen.getByText('593,46 cm²')).toBeTruthy();
  });
});

describe('M3 Asal Rumus', () => {
  it('7 langkah, dengan dua angka 2 di langkah 3 dan 5', () => {
    buka('/modul/asal-rumus');
    expect(screen.getByText('Tutup berbentuk lingkaran.')).toBeTruthy();
    fireEvent.click(tombol('Lanjut'));
    fireEvent.click(tombol('Lanjut'));
    expect(screen.getByText(/angka 2 yang pertama/)).toBeTruthy();
    fireEvent.click(tombol('Lanjut'));
    fireEvent.click(tombol('Lanjut'));
    expect(screen.getByText(/angka 2 yang kedua/)).toBeTruthy();
    fireEvent.click(tombol('Lanjut'));
    fireEvent.click(tombol('Lanjut'));
    expect(tombol('Hanya selimut')).toBeTruthy();
    expect(tombol('Contoh soal →')).toBeTruthy();
  });
});

describe('sakelar 2D/3D', () => {
  it('tersedia di setiap layar bergambar', () => {
    buka('/modul/kenali-tabung');
    expect(tombol('Ganti ke tampilan 3D')).toBeTruthy();
  });
});
