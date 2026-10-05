import { gsap } from 'gsap';
import { h } from './dom';
import type { DeckDef, SlideDef } from './types';
import { posterFor } from './presentation';

/* ---------- Aviso rápido ---------- */
let toastEl: HTMLElement | null = null;
export function toast(msg: string) {
  if (!toastEl) {
    toastEl = h('div.toast', { role: 'status' });
    document.body.append(toastEl);
  }
  toastEl.textContent = msg;
  gsap.killTweensOf(toastEl);
  gsap.fromTo(toastEl, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.25 });
  gsap.to(toastEl, { autoAlpha: 0, duration: 0.4, delay: 1.8 });
}

/* ---------- Visão geral (grade de miniaturas) ---------- */
export function buildThumb(deck: DeckDef, def: SlideDef, index: number, scale: number): HTMLElement {
  const frame = h('div.thumb-stage', { style: `transform: scale(${scale})` });
  const inst = def.build({ deck, index, mode: 'thumb', reduced: true, gl: null });
  inst.setStep(inst.steps, 0);
  frame.append(posterFor((inst.scene ?? def.scene)?.key), inst.el);
  return frame;
}

export function createOverview(deck: DeckDef, onPick: (i: number) => void) {
  const grid = h('div.overview-grid');
  const root = h(
    'div.overview',
    { role: 'dialog', 'aria-label': 'Visão geral dos slides' },
    h('div.overview-head', h('span.overview-title', `Aula ${deck.numero}: ${deck.titulo}`), h('span.overview-hint', 'Clique para ir ao slide. Esc fecha.')),
    grid,
  );
  document.body.append(root);
  let open = false;
  let built = false;
  const THUMB_W = 400;

  function build(current: number) {
    grid.replaceChildren();
    deck.slides.forEach((def, i) => {
      const card = h(
        `button.overview-card${i === current ? '.is-current' : ''}`,
        { type: 'button', 'aria-label': `Slide ${i + 1}: ${def.title}` },
        h('div.overview-thumb', buildThumb(deck, def, i, THUMB_W / 1920)),
        h('div.overview-meta', h('span.overview-n', String(i + 1).padStart(2, '0')), h('span.overview-name', def.title)),
      );
      card.addEventListener('click', () => {
        toggle(false);
        onPick(i);
      });
      grid.append(card);
    });
    built = true;
  }

  function toggle(force?: boolean, current = 0) {
    open = force ?? !open;
    if (open) {
      if (!built) build(current);
      grid.querySelectorAll('.overview-card').forEach((c, i) => c.classList.toggle('is-current', i === current));
      root.classList.add('is-open');
      (grid.children[current] as HTMLElement | undefined)?.scrollIntoView({ block: 'center' });
    } else root.classList.remove('is-open');
  }

  return {
    toggle,
    get open() {
      return open;
    },
  };
}

/* ---------- Vídeo de backup ---------- */
export function createVideoOverlay() {
  const video = h('video.video-el', { controls: true, playsinline: true, preload: 'metadata' }) as HTMLVideoElement;
  const msg = h('p.video-msg');
  const label = h('p.video-label');
  const root = h('div.video-overlay', { role: 'dialog', 'aria-label': 'Vídeo de backup' }, label, video, msg);
  document.body.append(root);
  let open = false;
  video.addEventListener('error', () => {
    msg.textContent = `Vídeo de backup não encontrado: public/${video.getAttribute('src')}. Grave a demo e salve neste caminho.`;
    msg.style.display = 'block';
  });
  return {
    show(src: string, title?: string) {
      msg.style.display = 'none';
      label.textContent = title ?? 'Vídeo de backup';
      video.setAttribute('src', src);
      root.classList.add('is-open');
      open = true;
      video.play().catch(() => undefined);
    },
    hide() {
      video.pause();
      root.classList.remove('is-open');
      open = false;
    },
    get open() {
      return open;
    },
  };
}

/* ---------- Ajuda de teclado ---------- */
export const SHORTCUTS: Array<[string, string]> = [
  ['Seta direita, espaço, Page Down', 'Avançar passo ou slide'],
  ['Seta esquerda, Page Up', 'Voltar'],
  ['Home / End', 'Primeiro / último slide'],
  ['Número + Enter', 'Ir para o slide'],
  ['O ou Esc', 'Visão geral'],
  ['P', 'Abrir visão do apresentador'],
  ['A', 'Voltar ao painel das aulas'],
  ['F', 'Tela cheia'],
  ['B ou ponto', 'Tela preta'],
  ['V', 'Vídeo de backup da demo'],
  ['T', 'Pausar a contagem (slide de pausa)'],
  ['M', 'Movimento reduzido'],
  ['D', 'Medidor de desempenho'],
  ['H ou ?', 'Esta ajuda'],
];

export function createHelp() {
  const root = h(
    'div.help',
    { role: 'dialog', 'aria-label': 'Atalhos de teclado' },
    h(
      'div.help-card',
      h('p.help-title', 'Atalhos'),
      h('dl.help-list', ...SHORTCUTS.flatMap(([k, v]) => [h('dt', k), h('dd', v)])),
    ),
  );
  document.body.append(root);
  let open = false;
  return {
    toggle(force?: boolean) {
      open = force ?? !open;
      root.classList.toggle('is-open', open);
    },
    get open() {
      return open;
    },
  };
}
