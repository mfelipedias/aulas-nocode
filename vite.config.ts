import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Páginas: o deck (index.html), a visão do apresentador (presenter.html) e as dos alunos:
// mural da turma (mural.html), feedback das aulas (feedback.html) e quiz ao vivo (quiz.html), mais a área do professor (professor.html).
// Todas falam com a API em /api/.
// base './' permite servir o build de qualquer pasta (pendrive, servidor local).
export default defineConfig({
  base: './',
  // Em desenvolvimento, /api vai para a API local (cd server && node server.mjs, com DADOS=./dados).
  server: { port: 5180, strictPort: true, proxy: { '/api': 'http://localhost:3000' } },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        presenter: resolve(import.meta.dirname, 'presenter.html'),
        mural: resolve(import.meta.dirname, 'mural.html'),
        feedback: resolve(import.meta.dirname, 'feedback.html'),
        professor: resolve(import.meta.dirname, 'professor.html'),
        quiz: resolve(import.meta.dirname, 'quiz.html'),
      },
    },
  },
});
