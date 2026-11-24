import { C, button, icon, line, rect, text } from '../lib.mjs';

/** Peças comuns às telas da aula 4 (não gera arquivo: `default` vazio para o gerar.mjs). */
export default [];

/** Quebra um texto em linhas de até `max` caracteres (por palavra). */
export function wrap(s, max) {
  const out = [];
  let cur = '';
  for (const w of s.split(' ')) {
    if (cur && (cur + ' ' + w).length > max) {
      out.push(cur);
      cur = w;
    } else cur = cur ? cur + ' ' + w : w;
  }
  if (cur) out.push(cur);
  return out.join('\n');
}

/** Marca do Lovable (letra simples, sem logo oficial). */
export const LOV = '#FF5A36';

/**
 * Barra superior do editor do Lovable. `aba`: 'Preview' | 'Code' | 'Cloud'.
 * Devolve SVG; altura 52.
 */
export function lovableTopo(W, { aba = 'Preview', publishFoco = false, github = false } = {}) {
  const tabs = ['Preview', 'Code', 'Cloud'];
  const tx = 360;
  return [
    rect(0, 0, W, 52, { fill: C.panel }),
    line(0, 52, W, 52),
    rect(14, 12, 28, 28, { r: 8, fill: LOV }),
    text(28, 32, 'L', { size: 17, weight: 700, fill: '#FFFFFF', anchor: 'middle' }),
    text(52, 32, 'hackathon-lovable-ensaio', { size: 16, weight: 600 }),
    rect(tx, 10, 252, 32, { r: 8, fill: C.hover }),
    ...tabs.map((t, i) => {
      const on = t === aba;
      return (
        (on ? rect(tx + 4 + i * 82, 14, 80, 24, { r: 6, fill: C.panel, stroke: C.line }) : '') +
        text(tx + 44 + i * 82, 31, t, { size: 15, weight: on ? 600 : 500, fill: on ? C.ink : C.ink3, anchor: 'middle' })
      );
    }),
    github
      ? icon('GitBranch', W - 286, 17, 18, C.ink2) + text(W - 262, 32, 'GitHub', { size: 15, weight: 500, fill: C.ink2 })
      : icon('GitBranch', W - 186, 17, 18, C.ink3),
    button(W - 118, 9, 'Publish', { size: 15, h: 34, w: 104, cor: C.ink }),
    publishFoco ? rect(W - 122, 5, 112, 42, { r: 10, stroke: C.blue, sw: 2 }) : '',
  ].join('\n');
}
