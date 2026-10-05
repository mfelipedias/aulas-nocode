import { h } from '../../engine/dom';
import { logoTile } from '../../engine/logos';
import type { SlideCtx } from '../../engine/types';
import { platform } from '../../content/platforms';
import { codePanel, parseLines, type Linguagem } from './code';
import { renderFlow, type FlowData } from './diagram';
import { mediaView, type Midia, type Regiao } from './media';

/**
 * Visual reutilizável (coluna direita do twoColumn e similares).
 * Cada variante sabe reagir a um "foco" vindo do tópico ativo.
 */
export type Visual =
  | {
      tipo: 'midia';
      midia: Midia;
      /** 'nenhuma' = sem moldura, sem borda e com fundo transparente (esquemas SVG próprios). */
      moldura?: Moldura;
      url?: string;
      /** Proporção do quadro (CSS aspect-ratio), ex.: '4 / 3'. Padrão: 16 / 10. */
      proporcao?: string;
    }
  | ({ tipo: 'fluxo' } & FlowData)
  | { tipo: 'codigo'; codigo: string; linguagem: Linguagem; arquivo?: string }
  | { tipo: 'logos'; ids: string[] }
  | { tipo: 'numero'; valor: string; rotulo: string; fonte?: string };

/** Foco que um tópico pode pedir ao visual. */
export interface VisualFoco {
  /** midia: região a ampliar. */
  zoom?: Regiao;
  /** fluxo: ids dos nós em destaque. logos: ids em destaque. */
  realce?: string[];
  /** codigo: linhas em destaque ("3-5"). */
  linhas?: string;
}

export interface VisualView {
  el: HTMLElement;
  focus(f: VisualFoco | null, animate: boolean): void;
}

export type Moldura = 'navegador' | 'celular' | 'nenhuma';

/**
 * Moldura de navegador ou celular em volta de qualquer conteúdo.
 * 'nenhuma' = quadro sem borda nem fundo, com proporção própria (padrão 16:10), para esquemas e gráficos.
 */
export function frame(kind: Moldura, content: HTMLElement, url?: string, proporcao?: string): HTMLElement {
  if (kind === 'celular') return h('div.phone', h('div.phone-screen', content), h('span.phone-notch'));
  const ratio = proporcao ? `aspect-ratio:${proporcao}` : undefined;
  if (kind === 'nenhuma') return h('div.bare-frame', { style: ratio }, content);
  return h(
    'div.browser.is-flat',
    h('div.browser-bar', h('span.browser-dots', h('i'), h('i'), h('i')), url ? h('span.browser-url', url) : h('span.browser-url.is-empty')),
    h('div.browser-view', { style: ratio }, content),
  );
}

export function renderVisual(v: Visual, ctx: SlideCtx, box: { w: number; h: number }): VisualView {
  switch (v.tipo) {
    case 'midia': {
      const mv = mediaView(v.midia, ctx);
      const el = h(`div.visual.visual-midia.is-${v.moldura ?? 'navegador'}`, frame(v.moldura ?? 'navegador', mv.el, v.url, v.proporcao));
      return { el, focus: (f, a) => mv.zoomTo(f?.zoom ?? null, a) };
    }
    case 'fluxo': {
      const fv = renderFlow(v, box, { compact: true, stepOf: () => 0 });
      fv.setStep(0, 0);
      return { el: h('div.visual.visual-fluxo', fv.el), focus: (f) => fv.highlight(f?.realce ?? null) };
    }
    case 'codigo': {
      const cp = codePanel({ ...v, tamanho: 'compacto' });
      return { el: h('div.visual.visual-codigo', cp.el), focus: (f) => cp.focus(f?.linhas ? parseLines(f.linhas) : null) };
    }
    case 'logos': {
      const tiles = v.ids.map((id) => logoTile(platform(id), 56));
      const el = h('div.visual.visual-logos', ...tiles);
      return {
        el,
        focus(f) {
          const set = f?.realce ? new Set(f.realce) : null;
          el.classList.toggle('has-focus', Boolean(set));
          tiles.forEach((t, i) => t.classList.toggle('is-focus', Boolean(set?.has(v.ids[i]))));
        },
      };
    }
    case 'numero': {
      const todo = v.fonte && /TODO-fonte/i.test(v.fonte);
      const el = h(
        'div.visual.visual-numero',
        h('p.vnum-value', v.valor),
        h('p.vnum-label', v.rotulo),
        v.fonte ? h(`p.vnum-source${todo ? '.is-todo' : ''}`, v.fonte) : null,
      );
      return { el, focus: () => undefined };
    }
  }
}
