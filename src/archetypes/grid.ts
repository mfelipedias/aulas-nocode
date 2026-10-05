import type { IconNode } from 'lucide';
import { h } from '../engine/dom';
import { icon } from '../engine/icons';
import { logoTile } from '../engine/logos';
import type { CommonFields } from '../engine/types';
import { platform } from '../content/platforms';
import { define, header, instance, shell, sourceLine } from './base';
import { mediaView, type Midia } from './parts/media';
import { frame, type Moldura } from './parts/visual';

export interface GridCard {
  icone?: IconNode;
  /** Logo de plataforma no lugar do ícone (id de content/platforms.ts). */
  plataforma?: string;
  /** Até ~30 caracteres. */
  titulo: string;
  /** Rótulo curto no topo do cartão (ex.: "Obrigatório", "Persona 1"). Só se informar algo. */
  tag?: string;
  /** Até ~100 caracteres. */
  texto?: string;
  /** Até 4 itens curtos (até ~36 caracteres). Use texto OU itens. */
  itens?: string[];
  /** Cartão em foco (borda na cor da aula) no último passo. */
  destaque?: boolean;
}

export interface GridData extends CommonFields {
  titulo: string;
  subtitulo?: string;
  /** 2 a 8 cartões. 4 = 2 x 2; 3, 5, 6 = 3 colunas; 7 e 8 = 4 colunas. */
  cartoes: GridCard[];
  /** Força o número de colunas. 4 colunas: cartões com título curto (~20 caracteres) e até 3 itens. */
  colunas?: 2 | 3 | 4;
  /**
   * Mídia lateral à direita (captura, esquema): os cartões ocupam a esquerda (até 4, em 2 colunas).
   * Entra com o slide.
   */
  lateral?: { midia: Midia; moldura?: Moldura; url?: string; proporcao?: string };
  /** 'um-a-um' (padrão) ou 'todos'. */
  revelar?: 'um-a-um' | 'todos';
  /** Frase no passo final (junto com o destaque). Até ~90 caracteres. */
  conclusao?: string;
  fonte?: string;
}

/** Grade de cartões 2 x 2 / 3 x 2 (MoSCoW, personas, categorias, prós e contras). */
export function grid(data: GridData) {
  return define('grid', data, data.titulo, (d, ctx) => {
    const n = d.cartoes.length;
    const cols = d.colunas ?? (d.lateral ? (n <= 2 ? 1 : 2) : n === 4 || n === 2 ? 2 : n >= 7 ? 4 : 3);
    const rows = Math.ceil(n / cols);
    const one = d.revelar !== 'todos';
    const hasFocus = d.cartoes.some((c) => c.destaque) || Boolean(d.conclusao);
    const finalStep = (one ? n : 0) + (hasFocus ? 1 : 0);
    const cards = d.cartoes.map((c, i) =>
      h(
        `article.gcard${c.itens ? '.has-list' : ''}`,
        { 'data-step': one ? i + 1 : 0, 'data-delay': one ? 0 : 0.25 + i * 0.07 },
        c.tag ? h('p.gcard-tag', c.tag) : null,
        h(
          'div.gcard-head',
          c.plataforma ? logoTile(platform(c.plataforma), 40, { nome: false, cls: 'is-small' }) : c.icone ? h('span.gcard-icon', icon(c.icone, 32)) : null,
          h('h2.gcard-title', c.titulo),
        ),
        c.texto ? h('p.gcard-text', c.texto) : null,
        c.itens ? h('ul.gcard-list', ...c.itens.map((t) => h('li', t))) : null,
      ),
    );
    const el = shell(
      'grid',
      header(d.titulo, d.subtitulo),
      d.lateral
        ? h(
            'div.grid-with-side',
            h(`div.grid-cards.cols-${cols}.rows-${rows}${d.conclusao ? '.has-conclusion' : ''}`, ...cards),
            h(
              `div.grid-side.is-${d.lateral.moldura ?? 'navegador'}`,
              { 'data-step': 0, 'data-reveal': 'fade', 'data-delay': 0.3 },
              frame(d.lateral.moldura ?? 'navegador', mediaView(d.lateral.midia, ctx).el, d.lateral.url, d.lateral.proporcao),
            ),
          )
        : h(`div.grid-cards.cols-${cols}.rows-${rows}${d.conclusao ? '.has-conclusion' : ''}`, ...cards),
      d.conclusao ? h('p.slide-conclusion', { 'data-step': finalStep, 'data-delay': 0.2 }, d.conclusao) : null,
      sourceLine(d.fonte, finalStep),
    );
    return instance(el, {
      steps: finalStep,
      scene: d.scene ?? { key: 'ambient', params: { focus: [0.5, 0.95], intensity: 0.6, dust: 0.45 } },
      onStep(step) {
        const focus = hasFocus && step >= finalStep;
        el.classList.toggle('is-focused', focus && d.cartoes.some((c) => c.destaque));
        cards.forEach((c, i) => c.classList.toggle('is-focus', focus && Boolean(d.cartoes[i].destaque)));
      },
    });
  });
}
