import { doc } from '../lib.mjs';
import { EV, paginaBCelular, seloEscuro } from './_comum.mjs';

// S59: página B no celular (prompt planejado + wireframe). O formulário vem logo depois do título.
const W = 390;
const H = 888;

export default {
  arquivo: 'media/aula-01/tela-abertura-pagina-b-celular.svg',
  svg: doc(W, H, [paginaBCelular(), seloEscuro(W, H)].join('\n'), { fundo: EV.grafite }),
};
