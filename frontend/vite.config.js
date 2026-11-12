import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    // PWA: bisa dipasang ke layar utama & dipakai offline (docs/ARSITEKTUR.md §8).
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Jelajah Tabung',
        short_name: 'Jelajah Tabung',
        description: 'Belajar luas permukaan tabung langkah demi langkah.',
        lang: 'id',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#2563EB',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Semua aset (termasuk chunk three.js) di-precache agar 3D tetap jalan offline.
        globPatterns: ['**/*.{js,css,html,png,svg}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/],
        // Panggilan /api tidak di-cache: log ditangani antrean IndexedDB.
      },
    }),
  ],
  build: {
    // Chunk three.js (AdeganTabung) memang besar (~870 KB mentah, ~235 KB gzip) tetapi di-lazy-load.
    // Anggaran yang dipantau adalah ukuran gzip (docs/ARSITEKTUR.md §11).
    chunkSizeWarningLimit: 1000,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,jsx}'],
    setupFiles: ['src/__tests__/setup.js'],
  },
});
