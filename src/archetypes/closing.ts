import type { IconNode } from 'lucide';
import { CalendarDays, CircleCheck } from 'lucide';
import { h, maskedLines } from '../engine/dom';
import { icon } from '../engine/icons';
import type { CommonFields } from '../engine/types';
import { define, flat, instance, shell } from './base';

export interface ClosingData extends CommonFields {
  /** Frase final, até 2 linhas (\n). Até ~40 caracteres por linha. */
  frase: string;
  /** Próxima aula. Omitir na última aula. */
  proxima?: { data: string; tema: string };
  /** O que fazer até lá: 1 a 3 itens curtos (até ~60 caracteres). */
  tarefas?: Array<string | { texto: string; icone?: IconNode }>;
  /** Linha final discreta (ex.: canal de dúvidas). */
  contato?: string;
}

/** Arquétipo 15 — Encerramento. Blocos se dispersando ao fundo; sem rodapé. */
export function closing(data: ClosingData) {
  return define(
    'closing',
    data,
    flat(data.frase),
    (d) => {
      const hasNext = Boolean(d.proxima || d.tarefas?.length);
      const el = shell(
        'closing',
        h(
          'div.closing-body',
          h('h1.closing-frase', { 'data-step': 0, 'data-reveal': 'mask', 'data-delay': 0.5 }, ...maskedLines(d.frase)),
          hasNext
            ? h(
                'div.closing-grid',
                { 'data-step': 1 },
                d.proxima
                  ? h(
                      'div.closing-next',
                      h('p.closing-label', icon(CalendarDays, 32), 'Próxima aula'),
                      h('p.closing-date', d.proxima.data),
                      h('p.closing-theme', d.proxima.tema),
                    )
                  : null,
                d.tarefas?.length
                  ? h(
                      'div.closing-todo',
                      h('p.closing-label', 'Até lá'),
                      h(
                        'ul.closing-list',
                        ...d.tarefas.map((t) => {
                          const tx = typeof t === 'string' ? t : t.texto;
                          const ic = typeof t === 'string' ? CircleCheck : (t.icone ?? CircleCheck);
                          return h('li', icon(ic, 32), h('span', tx));
                        }),
                      ),
                    )
                  : null,
              )
            : null,
          d.contato ? h('p.closing-contact', { 'data-step': hasNext ? 1 : 0, 'data-delay': 0.4 }, d.contato) : null,
        ),
      );
      return instance(el, { scene: d.scene ?? { key: 'hero', params: { side: 'center', state: 'scattered' } } });
    },
    { chrome: false },
  );
}
