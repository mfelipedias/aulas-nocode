import type { DeckDef } from '../../engine/types';
import { cap01 } from './cap-0-1';
import { cap23 } from './cap-2-3';
import { cap45 } from './cap-4-5';
import { cap67 } from './cap-6-7';
import { cap8 } from './cap-8';

/**
 * Aula 2 — Dando vida às telas (63 slides, S01–S63 do storyboard.md).
 * Mídias em public/media/aula-02/ (a maioria ainda pendente: o motor mostra o quadro "captura pendente").
 * Conteúdo factual: aula-02-dando-vida-as-telas/conteudo.md, apêndice C (acesso em 04/10/2026).
 */
const deck: DeckDef = {
  id: 'aula-02',
  numero: 2,
  titulo: 'Dando vida às telas',
  disciplina: 'No-Code Development Platforms',
  data: '2026-10-15',
  horario: '19h00 às 20h30, ao vivo no Google Meet',
  professor: 'Prof. Marcos',
  accent: 'aula2',
  duracaoMin: 90,
  slides: [...cap01, ...cap23, ...cap45, ...cap67, ...cap8],
};

export default deck;
