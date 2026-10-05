import { Check } from 'lucide';
import { h } from '../engine/dom';
import { icon } from '../engine/icons';
import type { CommonFields } from '../engine/types';
import { define, header, instance, shell } from './base';

export interface ChecklistData extends CommonFields {
  titulo: string;
  subtitulo?: string;
  /** 3 a 8 itens. Acima de 5, duas colunas. */
  itens: Array<string | { texto: string; detalhe?: string }>;
  /**
   * 'marcar' (padrão): todos os itens aparecem desmarcados e cada passo marca o próximo.
   * 'revelar': cada passo traz o próximo item já marcado.
   */
  modo?: 'marcar' | 'revelar';
}

/** Lista de verificação com caixas que marcam por passo (publicação, segurança, qualidade). */
export function checklist(data: ChecklistData) {
  return define('checklist', data, data.titulo, (d) => {
    const reveal = d.modo === 'revelar';
    const items = d.itens.map((it, i) => {
      const t = typeof it === 'string' ? { texto: it } : it;
      return h(
        'li.ck-item',
        { 'data-step': reveal ? i + 1 : 0, 'data-delay': reveal ? 0 : 0.3 + i * 0.06 },
        h('span.ck-box', icon(Check, 32, 'icon ck-check')),
        h('div.ck-copy', h('p.ck-text', t.texto), t.detalhe ? h('p.ck-detail', t.detalhe) : null),
      );
    });
    const el = shell('checklist', header(d.titulo, d.subtitulo), h(`ul.ck-list${d.itens.length > 5 ? '.is-two' : ''}`, ...items));
    return instance(el, {
      steps: d.itens.length,
      scene: d.scene ?? { key: 'ambient', params: { focus: [0.82, 0.6], intensity: 0.65, dust: 0.5 } },
      onStep(step) {
        items.forEach((it, i) => {
          it.classList.toggle('is-checked', i + 1 <= step);
          it.classList.toggle('is-current', i + 1 === step);
        });
      },
    });
  });
}
