import { gsap } from 'gsap';
import type { DeckDef, RenderMode, SlideInstance } from './types';
import type { GLHost } from '../three/gl';
import { h } from './dom';
import { M, motion } from './motion';

export interface DeckState {
  index: number;
  step: number;
  steps: number;
  total: number;
  blackout: boolean;
  reduced: boolean;
}

type StateListener = (s: DeckState) => void;

/** Lê "#/3/1" (slide 3, passo 1; 1-based no slide). */
export function parseHash(hash: string): { index: number; step: number } | null {
  const m = hash.match(/^#\/?(\d+)(?:[/.](\d+))?/);
  if (!m) return null;
  return { index: Math.max(0, Number(m[1]) - 1), step: Number(m[2] ?? 0) };
}

/** Elemento de fundo estático usado sem WebGL (miniaturas, PDF, fallback). */
export function posterFor(key: string | undefined) {
  return h(`div.slide-poster.poster-${key ?? 'none'}`, { 'aria-hidden': 'true' });
}

/**
 * Controlador do deck: navegação por slides e passos, transições, rodapé, hash e estado.
 */
export class Presentation {
  readonly deck: DeckDef;
  readonly mode: RenderMode;
  readonly stage: HTMLElement;
  readonly gl: GLHost | null;
  index = -1;
  step = 0;
  blackout = false;
  private current: SlideInstance | null = null;
  private layer: HTMLElement;
  private poster: HTMLElement;
  private footer: HTMLElement;
  private footerCount: HTMLElement;
  private footerBar: HTMLElement;
  private blackEl: HTMLElement;
  private listeners = new Set<StateListener>();

  constructor(deck: DeckDef, stage: HTMLElement, mode: RenderMode, gl: GLHost | null) {
    this.deck = deck;
    this.stage = stage;
    this.mode = mode;
    this.gl = gl;
    this.poster = posterFor('none');
    this.layer = h('div.slides');
    this.footerCount = h('span.chrome-count');
    this.footerBar = h('span.chrome-bar-fill');
    this.footer = h(
      'footer.chrome',
      h('div.chrome-left', h('span.chrome-aula', `Aula ${deck.numero}`), h('span.chrome-title', deck.titulo)),
      h('div.chrome-right', this.footerCount, h('span.chrome-bar', this.footerBar)),
    );
    this.blackEl = h('div.blackout');
    stage.append(this.poster, this.layer, this.footer, this.blackEl);
    if (gl) this.poster.style.display = 'none';
  }

  get total() {
    return this.deck.slides.length;
  }

  get slide() {
    return this.deck.slides[this.index];
  }

  get instance() {
    return this.current;
  }

  state(): DeckState {
    return {
      index: this.index,
      step: this.step,
      steps: this.current?.steps ?? 0,
      total: this.total,
      blackout: this.blackout,
      reduced: motion.reduced,
    };
  }

  onChange(l: StateListener) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  private emit() {
    const s = this.state();
    this.listeners.forEach((l) => l(s));
  }

  goTo(index: number, step = 0, opts: { instant?: boolean } = {}) {
    index = Math.max(0, Math.min(this.total - 1, index));
    if (index === this.index) {
      this.setStep(step, opts.instant ? 0 : step > this.step ? 1 : -1);
      return;
    }
    const def = this.deck.slides[index];
    const instant = opts.instant || this.mode !== 'live';
    const prev = this.current;
    const prevIndex = this.index;
    prev?.leave?.();

    const inst = def.build({
      deck: this.deck,
      index,
      mode: this.mode,
      reduced: motion.reduced,
      gl: this.gl,
      advance: () => {
        if (this.current === inst && this.step < inst.steps) this.setStep(this.step + 1, 1);
      },
    });
    const clampedStep = Math.max(0, Math.min(inst.steps, step));
    this.current = inst;
    this.index = index;
    this.step = clampedStep;
    this.layer.append(inst.el);

    const scene = inst.scene ?? def.scene;
    this.gl?.setScene(scene, clampedStep, instant);
    this.poster.className = `slide-poster poster-${scene?.key ?? 'none'}`;
    inst.enter?.();

    const forward = index > prevIndex;
    // Entrando para frente: anima o passo inicial. Voltando ou instantâneo: mostra o estado direto.
    inst.setStep(clampedStep, instant || !forward || clampedStep > 0 ? 0 : 1);

    if (prev) {
      if (instant || motion.reduced) {
        prev.destroy?.();
        prev.el.remove();
      } else {
        gsap.to(prev.el, {
          autoAlpha: 0,
          duration: M.slide * 0.7,
          ease: 'power2.out',
          onComplete: () => {
            prev.destroy?.();
            prev.el.remove();
          },
        });
        gsap.fromTo(inst.el, { autoAlpha: 0 }, { autoAlpha: 1, duration: M.slide, ease: 'power2.out', delay: 0.1 });
      }
    }
    this.updateChrome();
    this.emit();
  }

  setStep(step: number, dir: 1 | -1 | 0) {
    if (!this.current) return;
    step = Math.max(0, Math.min(this.current.steps, step));
    if (step === this.step && dir !== 0) return;
    this.step = step;
    this.current.setStep(step, this.mode === 'live' ? dir : 0);
    this.gl?.setStep(step, dir === 0);
    this.updateChrome();
    this.emit();
  }

  next() {
    if (this.blackout) return this.toggleBlackout(false);
    if (this.current && this.step < this.current.steps) this.setStep(this.step + 1, 1);
    else if (this.index < this.total - 1) this.goTo(this.index + 1, 0);
  }

  prev() {
    if (this.blackout) return this.toggleBlackout(false);
    if (this.step > 0) this.setStep(this.step - 1, -1);
    else if (this.index > 0) this.goTo(this.index - 1, Number.MAX_SAFE_INTEGER);
  }

  toggleBlackout(force?: boolean) {
    this.blackout = force ?? !this.blackout;
    gsap.to(this.blackEl, { autoAlpha: this.blackout ? 1 : 0, duration: 0.35 });
    this.emit();
  }

  private updateChrome() {
    const def = this.slide;
    const show = def?.chrome !== false;
    this.footer.classList.toggle('is-hidden', !show);
    this.footerCount.textContent = `${String(this.index + 1).padStart(2, '0')} / ${String(this.total).padStart(2, '0')}`;
    this.footerBar.style.transform = `scaleX(${(this.index + 1) / this.total})`;
  }
}
