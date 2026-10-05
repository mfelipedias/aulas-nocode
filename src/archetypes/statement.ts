import { h } from '../engine/dom';
import type { CommonFields } from '../engine/types';
import { define, flat, instance, shell } from './base';

export interface StatementData extends CommonFields {
  /** Partes da declaração. A parte 0 entra com o slide; cada parte seguinte é um passo. */
  partes: string[];
  /** Linha de apoio opcional, entra junto com a última parte. */
  apoio?: string;
  /** Ao revelar a parte seguinte, as anteriores recuam para cinza (padrão: true). */
  recuar?: boolean;
  /**
   * Trecho(s) pintados no tom claro da cor da aula (ex.: 'sintaxe.'). Use uma palavra ou expressão curta,
   * no máximo uma por slide (regra "a luz significa").
   */
  destaque?: string | string[];
  /** Pinta a última linha da última parte no tom da aula (alternativa a `destaque`). */
  destacarFinal?: boolean;
}

/** Quebra uma linha em trechos normais e trechos destacados. */
function tinted(line: string, terms: string[]): Array<Node | string> {
  if (!terms.length) return [line];
  const esc = terms.filter(Boolean).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!esc.length) return [line];
  const re = new RegExp(`(${esc.join('|')})`, 'g');
  return line
    .split(re)
    .filter((x) => x !== '')
    .map((chunk) => (terms.includes(chunk) ? h('span.is-tint', chunk) : chunk));
}

/** Arquétipo 3 — Declaração. */
export function statement(data: StatementData) {
  return define('statement', data, flat(data.partes.join(' ')), (d) => {
    const terms = d.destaque ? (Array.isArray(d.destaque) ? d.destaque : [d.destaque]) : [];
    const last = d.partes.length - 1;
    const parts = d.partes.map((p, i) => {
      const lines = p.split('\n');
      return h(
        'p.t-hero.statement-part',
        { 'data-step': i, 'data-reveal': 'mask', 'data-delay': i === 0 ? 0.5 : 0.05 },
        ...lines.map((line, li) => {
          const final = d.destacarFinal && i === last && li === lines.length - 1;
          return h('span.line-mask', h(`span.line${final ? '.is-tint' : ''}`, ...tinted(line, terms)));
        }),
      );
    });
    const el = shell(
      'statement',
      h('div.statement-body', ...parts, d.apoio ? h('p.statement-apoio', { 'data-step': last, 'data-delay': 0.8 }, d.apoio) : null),
    );
    return instance(el, {
      scene: d.scene ?? { key: 'ambient', params: { focus: [0.3, 0.62], intensity: 0.9 } },
      onStep(step) {
        if (d.recuar === false) return;
        parts.forEach((p, i) => p.classList.toggle('is-receded', i < step));
      },
    });
  });
}
