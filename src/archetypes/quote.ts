import { h } from '../engine/dom';
import type { CommonFields } from '../engine/types';
import { define, instance, shell } from './base';

export interface QuoteData extends CommonFields {
  /** A citação, sem aspas (o slide coloca aspas tipográficas). Até ~180 caracteres. */
  texto: string;
  /** Quem disse. */
  autor: string;
  /** Obra, cargo ou contexto + ano (ex.: "A Startup Enxuta, 2011"). */
  obra?: string;
  /** Tradução livre? Mostra "Tradução livre" junto da obra. */
  traducao?: boolean;
}

/** Arquétipo 12 — Citação. Instrument Serif, centralizada, dissolve lento. */
export function quote(data: QuoteData) {
  return define('quote', data, `Citação: ${data.autor}`, (d) => {
    const long = d.texto.length > 120;
    const el = shell(
      'quote',
      h(
        'figure.quote-body',
        h(
          `blockquote.quote-text${long ? '.is-long' : ''}`,
          { 'data-step': 0, 'data-reveal': 'fade', 'data-delay': 0.3 },
          h('span.quote-mark', '“'),
          d.texto,
          h('span.quote-mark', '”'),
        ),
        h(
          'figcaption.quote-by',
          { 'data-step': 0, 'data-reveal': 'fade', 'data-delay': 1.1 },
          h('span.quote-rule'),
          h('span.quote-author', d.autor),
          d.obra || d.traducao ? h('span.quote-work', [d.obra, d.traducao ? 'tradução livre' : ''].filter(Boolean).join(', ')) : null,
        ),
      ),
    );
    return instance(el, { scene: d.scene ?? { key: 'ambient', params: { focus: [0.5, 0.5], intensity: 0.75, dust: 0.6 } } });
  });
}
