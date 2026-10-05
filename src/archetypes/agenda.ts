import { Check } from 'lucide';
import { h } from '../engine/dom';
import { icon } from '../engine/icons';
import type { CommonFields } from '../engine/types';
import { define, header, instance, shell } from './base';

export interface AgendaData extends CommonFields {
  titulo?: string;
  /**
   * 3 a 10 blocos da aula (até ~40 caracteres cada) + duração opcional ("15 min").
   * Com 8 ou mais, o layout fica compacto (itens de 62 px, título 32 px) e ainda cabe com o título do slide.
   */
  secoes: Array<{ titulo: string; duracao?: string }>;
  /** Índice (0-based) do bloco atual. -1 = visão geral, nenhum em destaque. Padrão: -1. */
  atual?: number;
}

/**
 * Roteiro da aula com o bloco atual em destaque. Repita o slide (com `atual` diferente) na entrada de
 * cada bloco: quem assiste à gravação sabe onde está.
 */
export function agenda(data: AgendaData) {
  const titulo = data.titulo ?? 'Roteiro da aula';
  const atual = data.atual ?? -1;
  return define('agenda', data, atual >= 0 ? `${titulo}: ${data.secoes[atual]?.titulo ?? ''}` : titulo, (d) => {
    const n = d.secoes.length;
    const items = d.secoes.map((s, i) => {
      const state = atual < 0 ? '' : i < atual ? '.is-done' : i === atual ? '.is-current' : '.is-next';
      return h(
        `li.ag-item${state}`,
        { 'data-step': 0, 'data-delay': 0.25 + i * 0.07 },
        h('span.ag-dot', i < atual ? icon(Check, 32, 'icon ag-check') : h('span.ag-n', String(i + 1).padStart(2, '0'))),
        h('span.ag-title', s.titulo),
        s.duracao ? h('span.ag-dur', s.duracao) : null,
      );
    });
    const fill = atual >= 0 ? (atual + 0.5) / n : 0;
    const el = shell(
      'agenda',
      header(titulo),
      h(`div.ag-wrap${n >= 8 ? '.is-dense' : ''}`, { style: `--n:${n}` }, h('span.ag-rail', h('span.ag-rail-fill', { style: `transform:scaleY(${fill})` })), h('ol.ag-list', ...items)),
    );
    return instance(el, { scene: d.scene ?? { key: 'ambient', params: { focus: [0.8, 0.5], intensity: 0.7 } } });
  });
}
