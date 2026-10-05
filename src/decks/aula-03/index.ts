import type { DeckDef } from '../../engine/types';
import { bloco0 } from './bloco-0';
import { bloco1 } from './bloco-1';
import { bloco2 } from './bloco-2';
import { bloco3 } from './bloco-3';
import { bloco4 } from './bloco-4';
import { bloco5 } from './bloco-5';
import { bloco6 } from './bloco-6';
import { bloco7 } from './bloco-7';
import { bloco8 } from './bloco-8';

/**
 * Aula 3 — Conectando o mundo (65 slides, 9 capítulos).
 * Especificação: aula-03-conectando-o-mundo/storyboard.md; falas: conteudo.md; tempos: roteiro.md.
 * Fontes acessadas em 04/10/2026 (plano.md, seção 10). Mídias em public/media/aula-03/.
 * Abrir com index.html?aula=03 (e &rascunho=1 para ver as capturas pendentes em âmbar).
 */
const deck: DeckDef = {
  id: 'aula-03',
  numero: 3,
  titulo: 'Conectando o mundo',
  disciplina: 'No-Code Development Platforms',
  data: '2026-10-22',
  horario: '19h00 às 20h30, ao vivo no Google Meet',
  professor: 'Prof. Marcos',
  accent: 'aula3',
  duracaoMin: 90,
  slides: [...bloco0, ...bloco1, ...bloco2, ...bloco3, ...bloco4, ...bloco5, ...bloco6, ...bloco7, ...bloco8],
};

export default deck;
