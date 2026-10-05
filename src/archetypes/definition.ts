import { h } from '../engine/dom';
import type { CommonFields } from '../engine/types';
import { define, instance, shell, sourceLine } from './base';

export interface DefinitionData extends CommonFields {
  /** O termo (até ~18 caracteres para caber em 1 linha a 120 px). */
  termo: string;
  /** Classe/origem curta (ex.: "sigla em inglês: Application Programming Interface"). */
  origem?: string;
  /** Definição em linguagem simples (até ~150 caracteres). */
  definicao: string;
  /** Exemplo concreto (passo 1). */
  exemplo?: { titulo?: string; texto: string };
  fonte?: string;
}

/** Definição: termo grande + definição + exemplo concreto no passo seguinte. */
export function definition(data: DefinitionData) {
  return define('definition', data, `Definição: ${data.termo}`, (d) => {
    const el = shell(
      'definition',
      h(
        'div.def-body',
        h('h1.t-display.def-term', { 'data-step': 0, 'data-reveal': 'mask', 'data-delay': 0.2 }, h('span.line-mask', h('span.line', d.termo))),
        d.origem ? h('p.def-origin', { 'data-step': 0, 'data-delay': 0.5 }, d.origem) : null,
        h('p.def-text', { 'data-step': 0, 'data-delay': 0.7 }, d.definicao),
        d.exemplo
          ? h(
              'div.def-example',
              { 'data-step': 1 },
              h('span.def-example-bar'),
              h('div', h('p.def-example-label', d.exemplo.titulo ?? 'Exemplo'), h('p.def-example-text', d.exemplo.texto)),
            )
          : null,
      ),
      sourceLine(d.fonte, d.exemplo ? 1 : 0),
    );
    return instance(el, { scene: d.scene ?? { key: 'ambient', params: { focus: [0.8, 0.35], intensity: 0.85 } } });
  });
}
