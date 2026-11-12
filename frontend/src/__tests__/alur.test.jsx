// @vitest-environment jsdom
// Uji alur: Cek Kesiapan, Arena (soal lengkap), Contoh, progres tersimpan.
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
const isi = (label, nilai) => fireEvent.change(screen.getByLabelText(label), { target: { value: nilai } });

beforeEach(() => {
  localStorage.clear();
  setModeGrafik('2d');
});
afterEach(cleanup);

describe('Cek Kesiapan', () => {
  it('4 soal lalu hasil; skor tersimpan', () => {
    buka('/modul/cek-kesiapan');
    for (const jawaban of ['7 cm', '154 cm²', '44 cm', '314 cm²']) {
      fireEvent.click(tombol(jawaban));
      expect(screen.getByText(/Tepat!/)).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: /Lanjut|Lihat hasil/ }));
    }
    expect(screen.getByText('4 dari 4 benar')).toBeTruthy();
    expect(screen.getByText(/Kamu siap!/)).toBeTruthy();
    const tersimpan = JSON.parse(localStorage.getItem('jelajahTabung.v1'));
    expect(tersimpan.cekKesiapan).toEqual({ skor: 4, total: 4 });
  });

  it('skor rendah menyarankan pengantar lingkaran', () => {
    buka('/modul/cek-kesiapan');
    for (const jawaban of ['14 cm', '44 cm²', '154 cm', '31,4 cm²']) {
      fireEvent.click(tombol(jawaban));
      expect(screen.getByText(/Belum tepat/)).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: /Lanjut|Lihat hasil/ }));
    }
    expect(screen.getByText(/segarkan dulu materi lingkaran/)).toBeTruthy();
  });
});

describe('Arena — soal L1-1 dari awal sampai selesai', () => {
  it('4 langkah, tanpa petunjuk → 3 bintang, pembahasan & refleksi muncul', () => {
    buka('/modul/arena/1/1');
    // setiap kata adalah elemen terpisah (bisa ditandai), jadi cocokkan teks paragraf utuh
    expect(screen.getByText((_, el) => el?.tagName === 'P' && /tabung tertutup memiliki jari-jari 7 cm/.test(el.textContent))).toBeTruthy();

    // ① diketahui
    isi('Jari-jari r =', '7');
    isi('Tinggi t =', '10');
    fireEvent.click(tombol('Periksa'));

    // ② bagian
    fireEvent.click(screen.getByRole('checkbox', { name: 'Alas' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Tutup' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Selimut' }));
    fireEvent.click(tombol('Periksa'));

    // ③ hitung
    isi('Luas satu lingkaran (πr²) =', '154');
    isi('Luas selimut (2πrt) =', '440');
    fireEvent.click(tombol('Periksa'));

    // ④ jumlah + satuan
    isi('L =', '748');
    fireEvent.click(screen.getByRole('radio', { name: 'cm²' }));
    fireEvent.click(tombol('Periksa'));

    expect(screen.getByLabelText('3 bintang')).toBeTruthy();
    expect(screen.getByText('Pembahasan')).toBeTruthy();
    // muncul di ringkasan langkah ④ dan di pembahasan
    expect(screen.getAllByText('L = 748 cm²')).toHaveLength(2);
    expect(screen.getByText('Mengapa pada rumus ada 2πr²?')).toBeTruthy();

    const tersimpan = JSON.parse(localStorage.getItem('jelajahTabung.v1'));
    expect(tersimpan.arena['L1-1']).toMatchObject({ selesai: true, bintang: 3 });
  });

  it('miskonsepsi: lupa tutup → umpan balik khusus; salah 2× → petunjuk muncul', () => {
    buka('/modul/arena/1/1');
    isi('Jari-jari r =', '7');
    isi('Tinggi t =', '10');
    fireEvent.click(tombol('Periksa'));

    fireEvent.click(screen.getByRole('checkbox', { name: 'Alas' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Selimut' }));
    fireEvent.click(tombol('Periksa'));
    expect(screen.getByText('Tabung tertutup punya 2 lingkaran: alas dan tutup.')).toBeTruthy();
    expect(screen.queryByText(/Petunjuk:/)).toBeNull();

    fireEvent.click(tombol('Periksa'));
    expect(screen.getByText(/Petunjuk:/)).toBeTruthy();
  });

  it('diameter dipakai sebagai jari-jari (L2-1) → MK1', () => {
    // buka level 2 langsung lewat URL (penguncian level hanya di halaman pilih level)
    buka('/modul/arena/2/1');
    isi('d = 14 cm, jadi r =', '14');
    isi('Tinggi t =', '10');
    fireEvent.click(tombol('Periksa'));
    expect(screen.getByText(/memakai diameter sebagai jari-jari/)).toBeTruthy();
  });

  it('level 2 terkunci sebelum level 1 selesai', () => {
    buka('/modul/arena');
    expect(screen.getByText('Selesaikan Level 1 dulu.')).toBeTruthy();
  });
});

describe('Contoh terurai', () => {
  it('contoh 1 dibuka langkah demi langkah', () => {
    buka('/modul/contoh');
    expect(screen.getByText('① Diketahui')).toBeTruthy();
    expect(screen.queryByText('② Bagian')).toBeNull();
    fireEvent.click(tombol('Langkah berikutnya'));
    expect(screen.getByText('② Bagian')).toBeTruthy();
  });
});

describe('Beranda', () => {
  it('menampilkan tautan Mode Peneliti dan semua modul', () => {
    buka('/');
    for (const judul of ['Cek Kesiapan', 'Kenali Tabung', 'Contoh Soal', 'Arena Latihan', 'Rangkuman']) {
      expect(screen.getByText(judul)).toBeTruthy();
    }
    expect(screen.getByText('Tentang aplikasi & Mode Peneliti')).toBeTruthy();
  });
});
