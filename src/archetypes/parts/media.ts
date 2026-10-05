import { gsap } from 'gsap';
import { Film, Image as ImageIcon } from 'lucide';
import { h } from '../../engine/dom';
import { icon } from '../../engine/icons';
import { motion } from '../../engine/motion';
import type { SlideCtx } from '../../engine/types';

/**
 * Mídia de um slide: captura de tela, imagem oficial ou vídeo, servida de public/.
 * Caminho sempre relativo a public/, ex.: 'media/aula-02/bubble-editor.png'.
 */
export interface Midia {
  src: string;
  /** O que a imagem mostra. Vira o texto alternativo e o texto do quadro "captura pendente". */
  descricao: string;
  /** Padrão: deduzido pela extensão (.mp4/.webm = vídeo). */
  tipo?: 'imagem' | 'video';
  /** Quadro inicial do vídeo (caminho em public/). */
  poster?: string;
  /** 'cobrir' (padrão) corta para preencher; 'conter' mostra a imagem inteira. */
  ajuste?: 'cobrir' | 'conter';
  /** object-position CSS (padrão 'top left' para capturas de interface). */
  posicao?: string;
}

/** Região da imagem em % (0–100) da área visível: x, y = canto superior esquerdo. */
export interface Regiao {
  x: number;
  y: number;
  w: number;
  h: number;
}

const isVideo = (m: Midia) => m.tipo === 'video' || /\.(mp4|webm|mov)$/i.test(m.src);

export interface MediaView {
  el: HTMLElement;
  /** Camada que recebe o zoom (marcadores de anotação vão aqui dentro). */
  layer: HTMLElement;
  video: HTMLVideoElement | null;
  zoomTo(r: Regiao | null, animate: boolean): void;
}

/**
 * Monta a mídia com o quadro "captura pendente" por baixo. Se o arquivo não existir, o quadro fica:
 * - no palco: discreto (ícone + descrição, parece um esquema intencional);
 * - no apresentador (?embed=1) e com ?rascunho=1: aviso em âmbar com o caminho esperado.
 */
export function mediaView(m: Midia, ctx: SlideCtx, opts: { autoplay?: boolean; loop?: boolean; muted?: boolean } = {}): MediaView {
  const video = isVideo(m);
  const placeholder = h(
    'div.media-ph',
    { 'aria-hidden': 'true' },
    h(
      'div.media-ph-inner',
      icon(video ? Film : ImageIcon, 40, 'icon media-ph-icon'),
      h('p.media-ph-desc', m.descricao),
      h('p.media-ph-flag', 'Captura pendente'),
      h('p.media-ph-path', `public/${m.src}`),
    ),
  );
  const fit = m.ajuste === 'conter' ? 'contain' : 'cover';
  const pos = m.posicao ?? 'top left';
  let vEl: HTMLVideoElement | null = null;
  let content: HTMLElement;
  const root = h('div.media', { 'data-src': m.src });

  if (video) {
    const live = ctx.mode === 'live';
    vEl = h('video.media-el', {
      src: live ? m.src : undefined,
      poster: m.poster,
      playsinline: true,
      muted: opts.muted !== false,
      loop: opts.loop,
      preload: live ? 'auto' : 'none',
      style: `object-fit:${fit};object-position:${pos}`,
      'aria-label': m.descricao,
    }) as HTMLVideoElement;
    vEl.muted = opts.muted !== false;
    if (live) {
      vEl.addEventListener('loadeddata', () => root.classList.add('is-loaded'));
      vEl.addEventListener('error', () => root.classList.add('is-missing'));
    } else if (m.poster) {
      // miniatura/apresentador/PDF: só o pôster
      const img = new Image();
      img.onload = () => root.classList.add('is-loaded');
      img.onerror = () => root.classList.add('is-missing');
      img.src = m.poster;
    } else root.classList.add('is-missing');
    content = vEl;
  } else {
    const img = h('img.media-el', {
      src: m.src,
      alt: m.descricao,
      decoding: 'async',
      style: `object-fit:${fit};object-position:${pos}`,
    }) as HTMLImageElement;
    img.addEventListener('load', () => root.classList.add('is-loaded'));
    img.addEventListener('error', () => root.classList.add('is-missing'));
    content = img;
  }
  const layer = h('div.media-layer', content);
  root.append(placeholder, layer);

  let current: Regiao | null = null;
  return {
    el: root,
    layer,
    video: vEl,
    zoomTo(r, animate) {
      if (r === current) return;
      current = r;
      const s = r ? Math.min(100 / r.w, 100 / r.h) : 1;
      const tx = r ? 50 - (r.x + r.w / 2) : 0;
      const ty = r ? 50 - (r.y + r.h / 2) : 0;
      const vars = { scale: s, xPercent: tx * s, yPercent: ty * s, '--inv': 1 / s } as gsap.TweenVars;
      gsap.killTweensOf(layer);
      if (animate && !motion.reduced) gsap.to(layer, { ...vars, duration: 1.4, ease: 'power3.inOut' });
      else gsap.set(layer, vars);
    },
  };
}

/**
 * Pilha de mídias no mesmo quadro: a primeira é a base; as outras trocam com ela por passo
 * (dissolve curto). Quem chama decide qual camada vale em cada passo com `show(i)`.
 */
export interface MediaStack {
  el: HTMLElement;
  views: MediaView[];
  /** Índice da camada visível. */
  readonly active: number;
  show(i: number, animate: boolean): void;
}

export function mediaStack(
  midias: Midia[],
  ctx: SlideCtx,
  opts: { autoplay?: boolean; loop?: boolean; muted?: boolean } = {},
): MediaStack {
  const views = midias.map((m) => mediaView(m, ctx, opts));
  const el = h(`div.media-stack${views.length > 1 ? '.is-multi' : ''}`, ...views.map((v) => v.el));
  let active = -1;
  const stack: MediaStack = {
    el,
    views,
    get active() {
      return active;
    },
    show(i, animate) {
      const idx = Math.max(0, Math.min(views.length - 1, i));
      if (idx === active) return;
      const prev = active;
      active = idx;
      views.forEach((v, k) => {
        const on = k === idx;
        v.el.classList.toggle('is-off', !on);
        gsap.killTweensOf(v.el);
        if (animate && !motion.reduced && views.length > 1 && (on || k === prev)) {
          gsap.to(v.el, { autoAlpha: on ? 1 : 0, duration: on ? 0.6 : 0.45, ease: 'power2.inOut' });
        } else gsap.set(v.el, { autoAlpha: on ? 1 : 0 });
        if (!on) v.video?.pause();
      });
      if (ctx.mode === 'live' && opts.autoplay) views[idx].video?.play().catch(() => undefined);
    },
  };
  stack.show(0, false);
  return stack;
}

