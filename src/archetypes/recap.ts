import { h } from '../engine/dom';
import type { CommonFields } from '../engine/types';
import { define, header, instance, shell } from './base';

export interface RecapData extends CommonFields {
  titulo?: string;
  /** 3 a 5 aprendizados, uma linha cada (até ~70 caracteres). */
  itens: string[];
}

/** Arquétipo 14 — Recapitulação. Um item por passo; o atual em destaque, os anteriores recuam. */
export function recap(data: RecapData) {
  const titulo = data.titulo ?? 'O que levamos desta aula';
  return define('recap', data, titulo, (d) => {
    const items = d.itens.map((t, i) =>
      h('li.recap-item', { 'data-step': i + 1 }, h('span.recap-n', String(i + 1).padStart(2, '0')), h('span.recap-text', t)),
    );
    const el = shell('recap', header(titulo), h('ol.recap-list', ...items));
    return instance(el, {
      scene: d.scene ?? { key: 'ambient', params: { focus: [0.8, 0.7], intensity: 0.7 } },
      onStep(step) {
        items.forEach((it, i) => {
          it.classList.toggle('is-current', i + 1 === step);
          it.classList.toggle('is-past', i + 1 < step);
        });
      },
    });
  });
}
