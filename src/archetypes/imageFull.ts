import { gsap } from 'gsap';
import { h } from '../engine/dom';
import { motion } from '../engine/motion';
import type { CommonFields } from '../engine/types';
import { define, instance, shell } from './base';
import { mediaStack, mediaView, type Midia } from './parts/media';

export interface ImageFullSwap {
  /** Passo em que esta imagem substitui a anterior (1, 2, ...). */
  passo: number;
  midia: Midia;
  /** Nova legenda a partir deste passo (opcional). */
  legenda?: string;
  detalhe?: string;
}

export interface ImageFullData extends CommonFields {
  /** Imagem ou vídeo em tela cheia (1920 x 1080 ou maior). Vídeo toca mudo e em loop. */
  midia: Midia;
  /** Segunda imagem: a tela se divide em duas metades lado a lado (cada uma 960 x 1080). */
  par?: Midia;
  /** Rótulos curtos sobre cada metade quando há `par` (até ~28 caracteres cada). */
  rotulos?: [string, string];
  /** Troca a imagem principal por passo (dissolve). Cada troca é um passo. */
  trocas?: ImageFullSwap[];
  /** Legenda (até ~90 caracteres). */
  legenda?: string;
  /** Linha de apoio sob a legenda (até ~110 caracteres). */
  detalhe?: string;
  fonte?: string;
  /** Onde fica a legenda: 'baixo-esquerda' (padrão) ou 'topo-esquerda'. */
  posicao?: 'baixo-esquerda' | 'topo-esquerda';
}

/** Imagem/vídeo de tela cheia com legenda sobre um degradê escuro. Sem rodapé. */
export function imageFull(data: ImageFullData) {
  return define(
    'imageFull',
    data,
    data.legenda ?? data.midia.descricao,
    (d, ctx) => {
      const opts = { loop: true, muted: true, autoplay: true };
      const trocas = [...(d.trocas ?? [])].sort((a, b) => a.passo - b.passo);
      const stack = mediaStack(
        [d.midia, ...trocas.map((t) => t.midia)].map((m) => ({ ...m, posicao: m.posicao ?? 'center' })),
        ctx,
        opts,
      );
      const pair = d.par ? mediaView({ ...d.par, posicao: d.par.posicao ?? 'center' }, ctx, opts) : null;
      const top = d.posicao === 'topo-esquerda';
      const todo = d.fonte && /TODO-fonte/i.test(d.fonte);
      const legendEl = d.legenda ? h('p.if-legend', { 'data-step': 0, 'data-delay': 0.5 }, d.legenda) : null;
      const detailEl = d.detalhe ? h('p.if-detail', { 'data-step': 0, 'data-delay': 0.65 }, d.detalhe) : null;
      const label = (t?: string) => (t ? h('span.if-pair-label', t) : null);
      const el = shell(
        'imageFull',
        h(
          `div.if-media${pair ? '.is-pair' : ''}`,
          { 'data-step': 0, 'data-reveal': 'fade' },
          pair ? h('div.if-half', stack.el, label(d.rotulos?.[0])) : stack.el,
          pair ? h('div.if-half', { 'data-step': 0, 'data-reveal': 'fade', 'data-delay': 0.3 }, pair.el, label(d.rotulos?.[1])) : null,
        ),
        h(`div.if-scrim${top ? '.is-top' : ''}`),
        d.legenda || d.fonte
          ? h(
              `div.if-caption${top ? '.is-top' : ''}`,
              legendEl,
              detailEl,
              d.fonte ? h(`p.if-source${todo ? '.is-todo' : ''}`, { 'data-step': 0, 'data-delay': 0.8 }, d.fonte) : null,
            )
          : null,
        // marcadores invisíveis: cada troca é um passo
        ...trocas.map((t) => h('span.if-step', { 'data-step': t.passo, 'data-reveal': 'none', 'aria-hidden': 'true' })),
      );
      const layers = [stack.views[0], ...stack.views.slice(1), ...(pair ? [pair] : [])];
      return instance(el, {
        scene: d.scene ?? { key: 'none' },
        onStep(step, dir) {
          let idx = 0;
          trocas.forEach((t, i) => {
            if (step >= t.passo) idx = i + 1;
          });
          stack.show(idx, dir !== 0);
          const cur = idx > 0 ? trocas[idx - 1] : null;
          if (legendEl) legendEl.textContent = (cur?.legenda ?? d.legenda) || '';
          if (detailEl) detailEl.textContent = (cur?.detalhe ?? d.detalhe) || '';
        },
        enter() {
          if (ctx.mode !== 'live') return;
          stack.views[stack.active]?.video?.play().catch(() => undefined);
          pair?.video?.play().catch(() => undefined);
          if (!motion.reduced) gsap.fromTo(layers.map((v) => v.layer), { scale: 1.05 }, { scale: 1, duration: 6, ease: 'power2.out' });
        },
        leave() {
          layers.forEach((v) => v.video?.pause());
        },
      });
    },
    { chrome: false },
  );
}
