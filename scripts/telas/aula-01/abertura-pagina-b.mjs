import { doc } from '../lib.mjs';
import { paginaBDesktop, seloEscuro } from './_comum.mjs';

// S01 (par) e S61: página B, gerada com o prompt planejado + wireframe.
// Marcadores de S61 (em %): Acertou (20,30) título/apoio; Inventou (70,55) números; Esqueceu (30,80) pé do formulário.
const W = 1280;
const H = 800;

export default {
  arquivo: 'media/aula-01/tela-abertura-pagina-b.svg',
  svg: doc(W, H, [paginaBDesktop(0, 0, W, H), seloEscuro(W, H)].join('\n')),
};
