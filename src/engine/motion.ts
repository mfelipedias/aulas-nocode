import { gsap } from 'gsap';

/** Tokens de movimento (espelham 00-DIRECAO-DE-ARTE.md, seção 8). */
export const M = {
  micro: 0.2,
  reveal: 0.7,
  stagger: 0.07,
  slide: 0.5,
  count: 2.0,
  camera: 2.2,
  assemble: 2.8,
  easeOut: 'expo.out',
  easeInOut: 'power2.inOut',
} as const;

const KEY = 'nocode-deck:reduced-motion';

function initialReduced(): boolean {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved !== null) return saved === '1';
  } catch {
    /* armazenamento indisponível */
  }
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

type Listener = (reduced: boolean) => void;
const listeners = new Set<Listener>();

export const motion = {
  reduced: initialReduced(),
  set(v: boolean) {
    this.reduced = v;
    try {
      localStorage.setItem(KEY, v ? '1' : '0');
    } catch {
      /* ignore */
    }
    document.documentElement.toggleAttribute('data-reduced-motion', v);
    listeners.forEach((l) => l(v));
  },
  toggle() {
    this.set(!this.reduced);
  },
  on(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};
document.documentElement.toggleAttribute('data-reduced-motion', motion.reduced);

gsap.defaults({ ease: M.easeOut, duration: M.reveal });

/**
 * Controla fragmentos: qualquer elemento com data-step="n" aparece a partir do passo n.
 * data-reveal="rise" (padrão) | "fade" | "mask" (para .line-mask > .line) | "none".
 */
export function createFragments(root: HTMLElement) {
  const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
  const max = nodes.reduce((m, n) => Math.max(m, Number(n.dataset.step) || 0), 0);
  let current = -1;

  function show(n: HTMLElement, animate: boolean, delay: number) {
    const style = n.dataset.reveal ?? 'rise';
    const inner = style === 'mask' ? n.querySelectorAll<HTMLElement>('.line') : null;
    if (!animate || motion.reduced || style === 'none') {
      gsap.killTweensOf(n);
      if (animate && motion.reduced) {
        gsap.fromTo(n, { autoAlpha: 0 }, { autoAlpha: 1, duration: M.micro, ease: 'none', delay: delay * 0.3 });
      } else gsap.set(n, { autoAlpha: 1, y: 0 });
      if (inner) gsap.set(inner, { yPercent: 0 });
      return;
    }
    if (style === 'mask' && inner) {
      gsap.set(n, { autoAlpha: 1 });
      gsap.fromTo(inner, { yPercent: 110 }, { yPercent: 0, duration: 1.0, ease: 'expo.out', stagger: 0.09, delay });
    } else if (style === 'fade') {
      gsap.fromTo(n, { autoAlpha: 0 }, { autoAlpha: 1, duration: M.reveal, ease: 'power2.out', delay });
    } else {
      gsap.fromTo(n, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: M.reveal, ease: M.easeOut, delay });
    }
  }

  function hide(n: HTMLElement, animate: boolean) {
    gsap.killTweensOf(n);
    if (animate && !motion.reduced) gsap.to(n, { autoAlpha: 0, duration: 0.25, ease: 'power2.out' });
    else gsap.set(n, { autoAlpha: 0 });
  }

  return {
    max,
    nodes,
    /** dir 0 = instantâneo (sem animação). */
    apply(step: number, dir: 1 | -1 | 0) {
      const perStep = new Map<number, number>();
      for (const n of nodes) {
        const s = Number(n.dataset.step) || 0;
        const wasVisible = current >= s;
        const visible = step >= s;
        if (visible && (!wasVisible || dir === 0)) {
          const order = perStep.get(s) ?? 0;
          perStep.set(s, order + 1);
          const base = Number(n.dataset.delay ?? 0);
          show(n, dir === 1, base + order * M.stagger);
        } else if (!visible && (wasVisible || dir === 0)) {
          hide(n, dir === -1);
        }
      }
      current = step;
    },
  };
}
