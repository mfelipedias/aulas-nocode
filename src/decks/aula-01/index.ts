import type { DeckDef } from '../../engine/types';
import { bloco01 } from './bloco-0-1';
import { bloco2 } from './bloco-2';
import { bloco34 } from './bloco-3-4';
import { bloco56 } from './bloco-5-6';
import { bloco79 } from './bloco-7-9';

/**
 * Aula 1 — Do problema ao protótipo.
 * Especificação: aula-01-do-problema-ao-prototipo/storyboard.md (S01–S69); fala em conteudo.md; tempos em roteiro.md.
 * Os títulos dos slides levam o id do storyboard ("S12 · ...") para casar com o roteiro no apresentador.
 * S01 e S59 usam a vitrine dupla (`par`): duas capturas lado a lado.
 * Fontes acessadas em 04/10/2026.
 */
const deck: DeckDef = {
  id: 'aula-01',
  numero: 1,
  titulo: 'Do problema ao protótipo',
  disciplina: 'No-Code Development Platforms',
  data: '2026-10-08',
  horario: '19h00 às 20h30, ao vivo no Google Meet',
  professor: 'Prof. Marcos',
  accent: 'aula1',
  duracaoMin: 90,
  slides: [...bloco01, ...bloco2, ...bloco34, ...bloco56, ...bloco79],
};

export default deck;
