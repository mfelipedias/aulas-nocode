import { h } from '../engine/dom';
import type { CommonFields } from '../engine/types';
import { define, header, instance, shell, sourceLine } from './base';
import { renderFlow, type FlowEdge, type FlowNode } from './parts/diagram';

export interface FlowData extends CommonFields {
  titulo: string;
  subtitulo?: string;
  /** Até 8 nós (5 por linha no máximo). Posições por `col`/`linha` ou em sequência. */
  nos: FlowNode[];
  ligacoes: FlowEdge[];
  /**
   * Ordem de revelação: lista de grupos de ids, um grupo por passo (o 1º grupo entra com o slide).
   * Padrão: um nó por passo, na ordem de `nos`.
   */
  passos?: string[][];
  /** Frase-síntese no último passo (até ~90 caracteres). */
  conclusao?: string;
  /** Fonte (veículo e data), no pé do slide, na mesma posição do stat. "TODO-fonte" aparece em âmbar. */
  fonte?: string;
}

/**
 * Diagrama de fluxo (gatilho -> módulos -> ação). Caixas DOM + setas SVG desenhadas a partir dos dados;
 * cada seta se desenha quando os dois nós estão visíveis, com um pulso de luz percorrendo.
 */
export function flow(data: FlowData) {
  return define('flow', data, data.titulo, (d) => {
    const groups = d.passos ?? d.nos.map((n) => [n.id]);
    const stepIndex = new Map<string, number>();
    groups.forEach((g, i) => g.forEach((id) => stepIndex.set(id, i)));
    const last = groups.length - 1;
    const view = renderFlow(d, { w: 1680, h: d.conclusao ? 560 : 640 }, { stepOf: (id) => stepIndex.get(id) ?? 0 });
    const conclStep = d.conclusao ? last + 1 : -1;
    const el = shell(
      'flow',
      header(d.titulo, d.subtitulo),
      h(`div.flow-stage${d.conclusao ? '.has-conclusion' : ''}`, view.el),
      d.conclusao ? h('p.slide-conclusion', { 'data-step': conclStep, 'data-delay': 0.2 }, d.conclusao) : null,
      sourceLine(d.fonte, 0, 'source-foot'),
    );
    if (d.fonte) el.classList.add('has-source');
    return instance(el, {
      steps: Math.max(last, conclStep),
      scene: d.scene ?? { key: 'ambient', params: { focus: [0.5, 0.9], intensity: 0.55, dust: 0.4 } },
      onStep(step, dir) {
        view.setStep(Math.min(step, last), dir);
      },
    });
  });
}
