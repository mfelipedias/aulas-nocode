import { h } from '../engine/dom';
import type { CommonFields } from '../engine/types';
import { define, header, instance, shell } from './base';
import { renderModel, type Entidade, type Relacao } from './parts/diagram';

export interface DataModelData extends CommonFields {
  titulo: string;
  subtitulo?: string;
  /** Até 3 entidades por linha, até 7 campos cada. */
  entidades: Entidade[];
  /** Ligações campo a campo ("Inscricao.evento" -> "Evento.id") com cardinalidade. */
  relacoes?: Relacao[];
  /** Ordem de revelação por grupos de ids (padrão: uma entidade por passo). */
  passos?: string[][];
  conclusao?: string;
}

/** Modelo de dados: entidades com campos e tipos, ligadas pelas relações (Bubble data types, tabelas). */
export function dataModel(data: DataModelData) {
  return define('dataModel', data, data.titulo, (d) => {
    const groups = d.passos ?? d.entidades.map((e) => [e.id]);
    const stepIndex = new Map<string, number>();
    groups.forEach((g, i) => g.forEach((id) => stepIndex.set(id, i)));
    const last = groups.length - 1;
    const view = renderModel({ entidades: d.entidades, relacoes: d.relacoes ?? [] }, { w: 1680, h: d.conclusao ? 580 : 660 }, (id) => stepIndex.get(id) ?? 0);
    const conclStep = d.conclusao ? last + 1 : -1;
    const el = shell(
      'dataModel',
      header(d.titulo, d.subtitulo),
      h('div.model-stage', view.el),
      d.conclusao ? h('p.slide-conclusion', { 'data-step': conclStep, 'data-delay': 0.2 }, d.conclusao) : null,
    );
    return instance(el, {
      steps: Math.max(last, conclStep),
      scene: d.scene ?? { key: 'ambient', params: { focus: [0.5, 0.95], intensity: 0.5, dust: 0.35 } },
      onStep(step, dir) {
        view.setStep(Math.min(step, last), dir);
      },
    });
  });
}
