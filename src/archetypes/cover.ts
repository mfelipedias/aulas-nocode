import { h, maskedLines } from '../engine/dom';
import type { CommonFields } from '../engine/types';
import { define, flat, instance, shell } from './base';

export interface CoverData extends CommonFields {
  /** Título com quebras explícitas (\n). */
  titulo: string;
  subtitulo?: string;
  /** Texto da data por extenso, ex.: "Quinta, 8 de outubro de 2026". */
  dataExtenso: string;
}

/** Arquétipo 1 — Capa. Cena "blocos que montam" à direita. */
export function cover(data: CoverData) {
  return define(
    'cover',
    data,
    flat(data.titulo),
    (d, ctx) => {
      const deck = ctx.deck;
      const segments = h(
        'div.seg4',
        { 'aria-label': `Aula ${deck.numero} de 4` },
        ...[1, 2, 3, 4].map((n) => h(`span.seg${n === deck.numero ? '.is-on' : n < deck.numero ? '.is-done' : ''}`)),
      );
      const el = shell(
        'cover',
        deck.instituicao ? h('div.cover-brand', { 'data-step': 0, 'data-reveal': 'fade', 'data-delay': 1.6 }, deck.instituicao) : null,
        h(
          'div.cover-text',
          h('p.cover-discipline', { 'data-step': 0, 'data-reveal': 'fade', 'data-delay': 0.9 }, deck.disciplina),
          h('h1.t-hero.cover-title', { 'data-step': 0, 'data-reveal': 'mask', 'data-delay': 1.1 }, ...maskedLines(d.titulo)),
          d.subtitulo ? h('p.cover-sub', { 'data-step': 0, 'data-delay': 1.7 }, d.subtitulo) : null,
          h(
            'div.cover-meta',
            { 'data-step': 0, 'data-delay': 2.0 },
            h('div.meta-block', h('span.meta-label', 'Aula ao vivo'), h('span.meta-value', `${deck.numero} de 4`), segments),
            h('div.meta-block', h('span.meta-label', 'Quando'), h('span.meta-value', d.dataExtenso), h('span.meta-sub', deck.horario)),
            h('div.meta-block', h('span.meta-label', 'Professor'), h('span.meta-value', deck.professor)),
          ),
        ),
      );
      return instance(el, { scene: d.scene ?? { key: 'hero', params: { side: 'right' } } });
    },
    { chrome: false },
  );
}
