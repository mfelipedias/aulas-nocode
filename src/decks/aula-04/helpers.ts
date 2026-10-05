import { h } from '../../engine/dom';
import type { SlideDef, SlideInstance } from '../../engine/types';

/**
 * Ajuste local da aula 4: um passo extra de revelação (frase-síntese) em quote, bulletsRich, timeline,
 * stat e twoColumn. `fonte` e a moldura 'nenhuma' já são do motor e não precisam mais de ajuste.
 */

const M = 'media/aula-04/';
/** Caminho de mídia da aula 4 (relativo a public/). */
export const media = (arquivo: string) => `${M}${arquivo}`;

/**
 * Acrescenta um passo final que revela uma frase-síntese (mesmo estilo de `slide-conclusion`).
 * `pos` posiciona a frase (CSS absoluto); padrão: acima da linha de fonte.
 */
export function comRevelacao(def: SlideDef, texto: string, pos = 'left:120px;bottom:150px'): SlideDef {
  const build = def.build;
  return {
    ...def,
    build(ctx) {
      const inst = build(ctx);
      const el = h(
        'p.slide-conclusion.a4-revela',
        {
          style: `position:absolute;margin:0;max-width:1560px;opacity:0;visibility:hidden;transition:opacity .6s ease,visibility .6s;${pos}`,
          'aria-hidden': 'true',
        },
        texto,
      );
      inst.el.append(el);
      const total = inst.steps + 1;
      const base = inst.setStep;
      const out: SlideInstance = {
        ...inst,
        steps: total,
        setStep(step, dir) {
          base(Math.min(step, total - 1), dir);
          const on = step >= total;
          el.style.transition = dir === 0 ? 'none' : 'opacity .6s ease,visibility .6s';
          el.style.opacity = on ? '1' : '0';
          el.style.visibility = on ? 'visible' : 'hidden';
          el.setAttribute('aria-hidden', on ? 'false' : 'true');
        },
      };
      return out;
    },
  };
}
