import type { DeckDef } from '../../engine/types';
import { bloco01 } from './bloco-0-1';
import { bloco2 } from './bloco-2';
import { bloco3 } from './bloco-3';
import { bloco4 } from './bloco-4';
import { bloco5 } from './bloco-5';
import { bloco6 } from './bloco-6';
import { bloco7 } from './bloco-7';
import { bloco89 } from './bloco-8-9';

/**
 * Aula 4 — Publicar, avaliar e o que vem depois (29/10/2026).
 * Especificação: aula-04-publicar-avaliar-e-o-que-vem-depois/storyboard.md (S01–S70, mesma numeração
 * de conteudo.md; o campo `title` de cada slide começa com o número Sxx).
 * Decisão do professor: só planos gratuitos, nada é publicado.
 * Mídias em public/media/aula-04/ (capturas e vídeos pendentes aparecem como "Captura pendente").
 */
const deck: DeckDef = {
  id: 'aula-04',
  numero: 4,
  titulo: 'Publicar, avaliar e o que vem depois',
  disciplina: 'No-Code Development Platforms',
  data: '2026-10-29',
  horario: '19h00 às 20h30, ao vivo no Google Meet',
  professor: 'Prof. Marcos',
  accent: 'aula4',
  duracaoMin: 90,
  slides: [...bloco01, ...bloco2, ...bloco3, ...bloco4, ...bloco5, ...bloco6, ...bloco7, ...bloco89],
};

export default deck;
