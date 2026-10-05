import { h } from '../engine/dom';
import type { CommonFields } from '../engine/types';
import { define, header, instance, shell, sourceLine } from './base';
import { codePanel, parseLines, type Linguagem } from './parts/code';

export interface CodeStep {
  /** Linhas em destaque neste passo: "3-5", "2,7", 4 ou [4, 6]. */
  linhas: string | number | number[];
  /** Anotação do passo (até ~110 caracteres). */
  nota: string;
}

export interface CodeData extends CommonFields {
  titulo: string;
  subtitulo?: string;
  /** Código (12–18 linhas no máximo, até ~52 caracteres por linha). A indentação comum é removida. */
  codigo: string;
  linguagem: Linguagem;
  /** Nome do arquivo ou endpoint na barra do editor (ex.: "inscricao.json", "POST /webhook"). */
  arquivo?: string;
  /** 2 a 4 passos: linhas destacadas + anotação ao lado. Sem passos = só o código. */
  passos?: CodeStep[];
  /** Fonte (veículo e data), no pé do slide, na mesma posição do stat. "TODO-fonte" aparece em âmbar. */
  fonte?: string;
}

/** Arquétipo 8 — Código / JSON com realce de sintaxe e destaque de linhas por passo. */
export function code(data: CodeData) {
  return define('code', data, data.titulo, (d) => {
    const panel = codePanel({ codigo: d.codigo, linguagem: d.linguagem, arquivo: d.arquivo });
    const passos = d.passos ?? [];
    const notes = passos.map((p, i) => {
      const set = [...parseLines(p.linhas)].sort((a, b) => a - b);
      const range = set.length > 1 && set[set.length - 1] - set[0] === set.length - 1 ? `Linhas ${set[0]} a ${set[set.length - 1]}` : set.length > 1 ? `Linhas ${set.join(', ')}` : `Linha ${set[0]}`;
      return h('li.code-note', { 'data-step': i + 1 }, h('span.code-note-range', range), h('p.code-note-text', p.nota));
    });
    const el = shell(
      'code',
      header(d.titulo, d.subtitulo),
      h(`div.code-stage${passos.length ? '' : '.is-solo'}`, h('div.code-wrap', { 'data-step': 0, 'data-delay': 0.3 }, panel.el), passos.length ? h('ol.code-notes', ...notes) : null),
      sourceLine(d.fonte, 0, 'source-foot'),
    );
    if (d.fonte) el.classList.add('has-source');
    return instance(el, {
      scene: d.scene ?? { key: 'ambient', params: { focus: [0.62, 0.9], intensity: 0.5, dust: 0.35 } },
      onStep(step) {
        panel.focus(step > 0 && passos[step - 1] ? parseLines(passos[step - 1].linhas) : null);
        notes.forEach((n, i) => {
          n.classList.toggle('is-current', i + 1 === step);
          n.classList.toggle('is-past', i + 1 < step);
        });
      },
    });
  });
}
