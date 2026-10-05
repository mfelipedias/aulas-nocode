import { h, maskedLines } from '../engine/dom';
import type { CommonFields } from '../engine/types';
import { define, flat, instance, shell } from './base';

export interface ChapterData extends CommonFields {
  /** Número do bloco na aula (sequência real: 1, 2, 3...). */
  numero: number;
  /** Total de blocos da aula (mostra a trilha de segmentos). */
  total?: number;
  /** Título display, até 2 linhas (quebra com \n). Até ~32 caracteres por linha. */
  titulo: string;
  /** Uma frase de contexto (até ~90 caracteres). */
  subtitulo?: string;
}

/** Arquétipo 2 — Abertura de capítulo. Sem rodapé; fundo padrão: horizonte com a câmera avançando. */
export function chapter(data: ChapterData) {
  return define(
    'chapter',
    data,
    `Bloco ${data.numero}: ${flat(data.titulo)}`,
    (d) => {
      const n = String(d.numero).padStart(2, '0');
      const total = d.total ? String(d.total).padStart(2, '0') : null;
      const el = shell(
        'chapter',
        h(
          'div.chapter-body',
          h(
            'div.chapter-index',
            { 'data-step': 0, 'data-reveal': 'fade', 'data-delay': 0.6 },
            h('span.chapter-n', total ? `Bloco ${n} de ${total}` : `Bloco ${n}`),
            d.total
              ? h(
                  'span.chapter-track',
                  ...Array.from({ length: d.total }, (_, i) => h(`span.chapter-seg${i + 1 < d.numero ? '.is-done' : i + 1 === d.numero ? '.is-on' : ''}`)),
                )
              : null,
          ),
          h('h1.t-display.chapter-title', { 'data-step': 0, 'data-reveal': 'mask', 'data-delay': 0.9 }, ...maskedLines(d.titulo)),
          d.subtitulo ? h('p.chapter-sub', { 'data-step': 0, 'data-delay': 1.4 }, d.subtitulo) : null,
        ),
      );
      return instance(el, { scene: d.scene ?? { key: 'horizon', params: { dolly: true } } });
    },
    { chrome: false },
  );
}
