import type { IconNode } from 'lucide';
import { h } from '../engine/dom';
import { icon } from '../engine/icons';
import type { CommonFields } from '../engine/types';
import { define, instance, shell, sourceLine } from './base';

export interface ComparisonColumn {
  id: string;
  nome: string;
  icone?: IconNode;
  /** Linha curta sob o nome da coluna. */
  sub?: string;
}

/** Célula: texto curto, ou medidor de 1 a 4 com rótulo. */
export type ComparisonCell = string | { nivel: 1 | 2 | 3 | 4; rotulo: string };

export interface ComparisonRow {
  criterio: string;
  celulas: ComparisonCell[];
  /** Passo em que a linha aparece (padrão: 1). */
  passo?: number;
}

export interface ComparisonData extends CommonFields {
  titulo: string;
  colunas: ComparisonColumn[];
  linhas: ComparisonRow[];
  /** Coluna destacada no último passo (moldura na cor da aula) + frase de conclusão. */
  foco?: { coluna: string; conclusao: string };
  /** Fonte (veículo e data), no pé do slide, na mesma posição do stat. "TODO-fonte" aparece em âmbar. */
  fonte?: string;
}

/** Arquétipo 6 — Tabela comparativa com medidores. */
export function comparison(data: ComparisonData) {
  return define('comparison', data, data.titulo, (d) => {
    const nCols = d.colunas.length;
    const lastRowStep = Math.max(1, ...d.linhas.map((r) => r.passo ?? 1));
    const focusStep = lastRowStep + 1;
    const focusIdx = d.foco ? d.colunas.findIndex((c) => c.id === d.foco!.coluna) : -1;

    const cell = (c: ComparisonCell) => {
      if (typeof c === 'string') return h('div.cmp-text', c);
      return h(
        'div.cmp-meter',
        { 'data-level': c.nivel },
        h('span.meter', ...[1, 2, 3, 4].map((i) => h(`span.meter-seg${i <= c.nivel ? '.is-on' : ''}`))),
        h('span.meter-label', c.rotulo),
      );
    };

    const header = h(
      'div.cmp-row.cmp-head',
      { 'data-step': 0, 'data-delay': 0.35 },
      h('div.cmp-crit'),
      ...d.colunas.map((c) =>
        h('div.cmp-col-head', c.icone ? icon(c.icone, 40, 'icon cmp-icon') : null, h('span.cmp-col-name', c.nome), c.sub ? h('span.cmp-col-sub', c.sub) : null),
      ),
    );

    const rows = d.linhas.map((r) =>
      h(
        'div.cmp-row',
        { 'data-step': r.passo ?? 1 },
        h('div.cmp-crit', r.criterio),
        ...r.celulas.map((c) => h('div.cmp-cell', cell(c))),
      ),
    );

    const frame =
      focusIdx >= 0
        ? h('div.cmp-focus', {
            'data-step': focusStep,
            'data-reveal': 'fade',
            style: `--col-index:${focusIdx};--cols:${nCols}`,
          })
        : null;

    const el = shell(
      'comparison',
      h('h1.t-h1.cmp-title', { 'data-step': 0, 'data-delay': 0.15 }, d.titulo),
      // A conclusão vem logo abaixo da tabela (não fica solta no pé quando há poucas linhas).
      h(
        'div.cmp-body',
        h('div.cmp-table', { style: `--cols:${nCols}` }, frame, header, ...rows),
        d.foco ? h('p.cmp-conclusion', { 'data-step': focusStep, 'data-delay': 0.25 }, d.foco.conclusao) : null,
      ),
      sourceLine(d.fonte, 0, 'source-foot'),
    );
    if (d.fonte) el.classList.add('has-source');

    return instance(el, {
      scene: d.scene ?? { key: 'ambient', params: { focus: [0.5, 0.15], intensity: 0.55, dust: 0.5 } },
    });
  });
}
