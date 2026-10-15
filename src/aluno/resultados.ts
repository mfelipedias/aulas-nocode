import { Trash2 } from 'lucide';
import { h } from '../engine/dom';
import { icon } from '../engine/icons';
import { aviso, quando } from './comum';

/** Escalas do feedback (formulário e resultados) e o painel de resultados usado na área do professor. */

export const NOTAS = [
  { n: 1, emoji: '😣', rotulo: 'Ruim' },
  { n: 2, emoji: '🙁', rotulo: 'Fraca' },
  { n: 3, emoji: '😐', rotulo: 'Ok' },
  { n: 4, emoji: '🙂', rotulo: 'Boa' },
  { n: 5, emoji: '🤩', rotulo: 'Ótima' },
];
export const RITMOS = [
  { v: 'devagar', rotulo: 'Devagar demais' },
  { v: 'na-medida', rotulo: 'Na medida' },
  { v: 'rapido', rotulo: 'Rápido demais' },
] as const;
export type Ritmo = (typeof RITMOS)[number]['v'];

export interface Resposta {
  id: string;
  criadoEm: string;
  aula: string;
  nota: number;
  ritmo: Ritmo;
  ajudou: string;
  melhorar: string;
  nome: string;
  curso: string;
}

/** Painel com números, gráficos e comentários. `apagar` (opcional) mostra a lixeira em cada comentário. */
export function painelFeedback(rs: Resposta[], apagar?: (r: Resposta) => void): HTMLElement[] {
  if (!rs.length) return [h('div.al-empty', h('p.al-empty-title', 'Ainda não há respostas aqui.'), h('p', 'Mostre o QR do slide "Como foi a aula?" no fim da aula.'))];
  const media = rs.reduce((s, r) => s + r.nota, 0) / rs.length;
  const pct = (n: number) => Math.round((n / rs.length) * 100);
  const porRitmo = RITMOS.map((o) => ({ ...o, n: rs.filter((r) => r.ritmo === o.v).length }));
  const maxNota = Math.max(...NOTAS.map((o) => rs.filter((r) => r.nota === o.n).length));

  const comentarios = (campoTxt: 'ajudou' | 'melhorar', titulo: string) => {
    const lista = rs.filter((r) => r[campoTxt]);
    return h(
      'section.rs-panel',
      h('h2.rs-panel-title', titulo, h('span.al-chip-n', String(lista.length))),
      lista.length
        ? h(
            'ul.rs-comments',
            ...lista.map((r) => {
              let lixo: HTMLElement | null = null;
              if (apagar) {
                lixo = h('button.al-icon-btn.is-s', { type: 'button', 'aria-label': 'Apagar esta resposta', title: 'Apagar esta resposta' }, icon(Trash2, 16));
                lixo.addEventListener('click', () => apagar(r));
              }
              return h(
                'li.rs-comment',
                h('p', r[campoTxt]),
                h(
                  'div.rs-comment-foot',
                  h('p.rs-comment-meta', `${NOTAS[r.nota - 1].emoji}  Aula ${r.aula}  ·  ${r.nome ? `${r.nome}${r.curso ? ', ' + r.curso : ''}` : 'Anônimo'}  ·  ${quando(r.criadoEm)}`),
                  lixo,
                ),
              );
            }),
          )
        : h('p.al-hint', 'Nenhum comentário.'),
    );
  };

  return [
    h(
      'div.rs-tiles',
      h('div.rs-tile', h('span.rs-tile-n', String(rs.length)), h('span.rs-tile-l', rs.length === 1 ? 'resposta' : 'respostas')),
      h('div.rs-tile', h('span.rs-tile-n', media.toFixed(1).replace('.', ','), h('small', ' / 5')), h('span.rs-tile-l', `nota média  ${NOTAS[Math.round(media) - 1].emoji}`)),
      h('div.rs-tile', h('span.rs-tile-n', `${pct(porRitmo[1].n)}%`), h('span.rs-tile-l', 'acharam o ritmo na medida')),
    ),
    h(
      'div.rs-grid',
      h(
        'section.rs-panel',
        h('h2.rs-panel-title', 'Notas'),
        h(
          'ul.rs-bars',
          ...[...NOTAS].reverse().map((o) => {
            const n = rs.filter((r) => r.nota === o.n).length;
            return h(
              'li.rs-bar',
              h('span.rs-bar-label', `${o.emoji} ${o.rotulo}`),
              h('span.rs-bar-track', h('span.rs-bar-fill', { style: `width: ${maxNota ? (n / maxNota) * 100 : 0}%` })),
              h('span.rs-bar-n', String(n)),
            );
          }),
        ),
      ),
      h(
        'section.rs-panel',
        h('h2.rs-panel-title', 'Ritmo'),
        h('div.rs-stack', ...porRitmo.filter((o) => o.n).map((o) => h(`span.rs-stack-seg.is-${o.v}`, { style: `flex: ${o.n}`, title: `${o.rotulo}: ${o.n}` }))),
        h('ul.rs-legend', ...porRitmo.map((o) => h('li', h(`span.rs-dot.is-${o.v}`), h('span', o.rotulo), h('strong', `${pct(o.n)}%`), h('span.rs-legend-n', `(${o.n})`)))),
      ),
    ),
    h('div.rs-grid', comentarios('ajudou', 'O que mais ajudou'), comentarios('melhorar', 'O que dá para melhorar')),
  ];
}

export function baixarCsv(rs: Resposta[], arquivo = 'feedback-aulas.csv') {
  const cab = ['data', 'aula', 'nota', 'ritmo', 'ajudou', 'melhorar', 'nome', 'curso'];
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const linhas = rs.map((r) => [r.criadoEm, r.aula, r.nota, r.ritmo, r.ajudou, r.melhorar, r.nome, r.curso].map(esc).join(';'));
  const blob = new Blob(['﻿' + [cab.join(';'), ...linhas].join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = h('a', { href: URL.createObjectURL(blob), download: arquivo }) as HTMLAnchorElement;
  a.click();
  URL.revokeObjectURL(a.href);
  aviso('CSV baixado.');
}
