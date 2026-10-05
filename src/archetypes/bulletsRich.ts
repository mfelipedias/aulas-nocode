import type { IconNode } from 'lucide';
import { h } from '../engine/dom';
import { icon } from '../engine/icons';
import type { CommonFields } from '../engine/types';
import { define, header, instance, shell, sourceLine } from './base';

export interface RichPoint {
  icone: IconNode;
  /** Até ~38 caracteres. */
  titulo: string;
  /** Até ~110 caracteres (2 linhas). */
  texto?: string;
}

export interface BulletsRichData extends CommonFields {
  titulo: string;
  subtitulo?: string;
  /** 3 a 6 pontos. Até 3: uma coluna larga; 4 a 6: duas colunas. */
  itens: RichPoint[];
  /** 'um-a-um' (padrão): um ponto por passo. 'todos': entram juntos no passo 0. */
  revelar?: 'um-a-um' | 'todos';
  fonte?: string;
}

/** Tópicos ricos: ícone + título + explicação curta, revelados um a um. */
export function bulletsRich(data: BulletsRichData) {
  return define('bulletsRich', data, data.titulo, (d) => {
    const oneByOne = d.revelar !== 'todos';
    const two = d.itens.length >= 4;
    const items = d.itens.map((p, i) =>
      h(
        'li.br-item',
        { 'data-step': oneByOne ? i + 1 : 0, 'data-delay': oneByOne ? 0 : 0.3 },
        h('span.br-icon', icon(p.icone, 40)),
        h('div.br-copy', h('p.br-title', p.titulo), p.texto ? h('p.br-text', p.texto) : null),
      ),
    );
    const el = shell(
      'bulletsRich',
      header(d.titulo, d.subtitulo),
      h(`ul.br-list${two ? '.is-two' : ''}${d.itens.length > 4 ? '.is-dense' : ''}`, ...items),
      sourceLine(d.fonte, oneByOne ? d.itens.length : 0),
    );
    return instance(el, {
      scene: d.scene ?? { key: 'ambient', params: { focus: [0.82, 0.3], intensity: 0.7, dust: 0.55 } },
      onStep(step) {
        if (!oneByOne) return;
        items.forEach((it, i) => it.classList.toggle('is-current', i + 1 === step && step < d.itens.length + 1));
      },
    });
  });
}
