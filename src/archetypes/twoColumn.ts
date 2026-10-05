import type { IconNode } from 'lucide';
import { h } from '../engine/dom';
import { icon } from '../engine/icons';
import type { CommonFields } from '../engine/types';
import { define, header, instance, shell, sourceLine } from './base';
import { renderVisual, type Visual, type VisualFoco } from './parts/visual';

export interface TwoColumnTopic extends VisualFoco {
  icone?: IconNode;
  /** Até ~40 caracteres. */
  titulo: string;
  /** Até ~110 caracteres (2 linhas). */
  texto?: string;
}

export interface TwoColumnData extends CommonFields {
  /** Até ~48 caracteres (cabe em 1–2 linhas na coluna esquerda). */
  titulo: string;
  subtitulo?: string;
  /** 2 a 4 tópicos, um por passo. Cada tópico pode focar o visual (zoom, realce, linhas). */
  topicos: TwoColumnTopic[];
  /** Visual da direita: captura em moldura, fluxo, código, logos ou número. */
  visual: Visual;
  /** Coloca o visual à esquerda e o texto à direita. */
  inverter?: boolean;
  /** Fonte (veículo e data), no pé do slide, na mesma posição do stat. "TODO-fonte" aparece em âmbar. */
  fonte?: string;
}

/** Arquétipo 7 — Conceito em duas colunas. Tópicos um por passo; o visual reage ao tópico ativo. */
export function twoColumn(data: TwoColumnData) {
  return define('twoColumn', data, data.titulo, (d, ctx) => {
    const vis = renderVisual(d.visual, ctx, { w: 860, h: 620 });
    const topics = d.topicos.map((t, i) =>
      h(
        'li.tc-topic',
        { 'data-step': i + 1 },
        t.icone ? h('span.tc-icon', icon(t.icone, 32)) : h('span.tc-icon.is-num', String(i + 1)),
        h('div.tc-copy', h('p.tc-title', t.titulo), t.texto ? h('p.tc-text', t.texto) : null),
      ),
    );
    const el = shell(
      'twoColumn',
      h(
        `div.tc-grid${d.inverter ? '.is-inverted' : ''}`,
        h('div.tc-text-col', header(d.titulo, d.subtitulo), h('ul.tc-list', ...topics)),
        h('div.tc-visual-col', { 'data-step': 0, 'data-delay': 0.35 }, vis.el),
      ),
      sourceLine(d.fonte, 0, 'source-foot'),
    );
    if (d.fonte) el.classList.add('has-source');
    let last = -1;
    return instance(el, {
      scene: d.scene ?? { key: 'ambient', params: { focus: d.inverter ? [0.25, 0.5] : [0.75, 0.5], intensity: 0.7, dust: 0.5 } },
      onStep(step, dir) {
        topics.forEach((t, i) => {
          t.classList.toggle('is-current', i + 1 === step);
          t.classList.toggle('is-past', i + 1 < step);
        });
        const topic = step > 0 ? d.topicos[step - 1] : null;
        if (step !== last) vis.focus(topic && (topic.zoom || topic.realce || topic.linhas) ? topic : null, dir === 1 || dir === -1);
        last = step;
      },
    });
  });
}
