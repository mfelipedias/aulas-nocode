import { Timer } from 'lucide';
import { h } from '../../engine/dom';
import { icon } from '../../engine/icons';
import type { Cronometro, SlideCtx, SlideInstance } from '../../engine/types';

export type { Cronometro };


const fmt = (s: number) => {
  const v = Math.max(0, Math.round(s));
  return `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`;
};

/** Acrescenta o cronômetro a uma instância pronta (canto inferior direito, acima do rodapé). */
export function attachTimer(inst: SlideInstance, cfg: Cronometro, ctx: SlideCtx): SlideInstance {
  const down = cfg.modo === 'regressivo';
  const total = Math.max(1, cfg.segundos ?? 300);
  const start = cfg.inicio ?? 0;
  const timeEl = h('span.st-time', fmt(down ? total : 0));
  const el = h(
    'div.slide-timer',
    { 'aria-label': down ? 'Tempo restante' : 'Tempo decorrido' },
    icon(Timer, 32, 'icon st-icon'),
    timeEl,
    cfg.rotulo ? h('span.st-label', cfg.rotulo) : null,
  );
  inst.el.append(el);
  inst.el.classList.add('has-timer');

  let elapsed = 0; // segundos acumulados
  let since = 0; // performance.now() do último início
  let running = false;
  let raf = 0;
  let started = false;

  const value = () => elapsed + (running ? (performance.now() - since) / 1000 : 0);
  const paint = () => {
    const v = value();
    const shown = down ? total - v : v;
    timeEl.textContent = fmt(shown);
    el.classList.toggle('is-over', down && shown <= 0);
    if (down && shown <= 0 && running) pause();
  };
  const loop = () => {
    paint();
    if (running) raf = requestAnimationFrame(loop);
  };
  function run() {
    if (running || ctx.mode !== 'live') return;
    if (down && value() >= total) return;
    started = true;
    running = true;
    since = performance.now();
    el.classList.add('is-running');
    el.classList.remove('is-paused');
    loop();
  }
  function pause() {
    if (!running) return;
    elapsed = value();
    running = false;
    cancelAnimationFrame(raf);
    el.classList.remove('is-running');
    el.classList.add('is-paused');
  }

  const baseStep = inst.setStep.bind(inst);
  const baseLeave = inst.leave?.bind(inst);
  const baseDestroy = inst.destroy?.bind(inst);
  const baseKey = inst.onKey?.bind(inst);
  inst.setStep = (step, dir) => {
    baseStep(step, dir);
    if (!started && step >= start && (dir === 1 || (dir === 0 && start === 0))) run();
  };
  inst.leave = () => {
    pause();
    baseLeave?.();
  };
  inst.destroy = () => {
    running = false;
    cancelAnimationFrame(raf);
    baseDestroy?.();
  };
  inst.onKey = (key) => {
    if (baseKey?.(key)) return true;
    if (key.toLowerCase() !== 't' || ctx.mode !== 'live') return false;
    if (running) pause();
    else run();
    return true;
  };
  return inst;
}
