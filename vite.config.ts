import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Duas páginas: o deck (index.html) e a visão do apresentador (presenter.html).
// base './' permite servir o build de qualquer pasta (pendrive, servidor local).
export default defineConfig({
  base: './',
  server: { port: 5180, strictPort: true },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        presenter: resolve(import.meta.dirname, 'presenter.html'),
      },
    },
  },
});
