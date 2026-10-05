import { STAGE_H, STAGE_W } from './geom';

/** Mantém o palco 1920 x 1080 escalado e centralizado na janela (letterbox). */
export function fitStage(stage: HTMLElement, onScale?: (s: number) => void) {
  const apply = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const s = Math.min(vw / STAGE_W, vh / STAGE_H);
    const x = (vw - STAGE_W * s) / 2;
    const y = (vh - STAGE_H * s) / 2;
    stage.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    onScale?.(s);
  };
  apply();
  window.addEventListener('resize', apply);
  return apply;
}
