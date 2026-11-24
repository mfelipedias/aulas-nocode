import { C, badge, button, icon, line, rect, text } from '../lib.mjs';

/**
 * Peças comuns das telas ilustrativas do Bubble na Aula 2 (barra superior e trilho de abas à esquerda).
 * Mesmo visual da tela da Aula 4 (scripts/telas/aula-04/bubble-deploy-bloqueado.mjs).
 * O gerar.mjs importa todo .mjs da pasta: este arquivo não gera tela (export default vazio).
 */
export default [];

export const AZUL_BUBBLE = '#0C29AB';

/** Barra superior do editor: logo genérico, nome do app, plano, página e Preview. */
export function topo(W, { app = 'hackathon-aula02', pagina = 'index', h = 56, s = 17, varinha = false, varinhaAtiva = false } = {}) {
  const cy = h / 2;
  const logo = Math.round(h * 0.56);
  const appW = Math.round(app.length * s * 0.6);
  return [
    rect(0, 0, W, h, { fill: C.panel }),
    line(0, h, W, h),
    rect(16, cy - logo / 2, logo, logo, { r: 7, fill: AZUL_BUBBLE }),
    text(16 + logo / 2, cy + s * 0.42, 'b', { size: s + 3, weight: 700, fill: '#FFFFFF', anchor: 'middle' }),
    text(28 + logo, cy + s * 0.36, app, { size: s, weight: 600 }),
    badge(40 + logo + appW, cy - s * 0.6, 'Free', { size: s - 4, fill: C.amberBg, ink: C.amber }),
    pagina ? text(110 + logo + appW, cy + s * 0.36, `Page: ${pagina}`, { size: s - 1, fill: C.ink2 }) : '',
    pagina ? icon('ChevronDown', 116 + logo + appW + Math.round((6 + pagina.length) * (s - 1) * 0.56), cy - 6, 13, C.ink3) : '',
    varinha
      ? (varinhaAtiva ? rect(W - 210, cy - 18, 40, 36, { r: 8, fill: '#ECE7FF', stroke: C.violet, sw: 2 }) : '') +
        icon('WandSparkles', W - 200, cy - 10, 20, varinhaAtiva ? C.violet : C.ink2)
      : '',
    button(W - 150, cy - 17, 'Preview', { tipo: 'secundario', icone: 'Eye', h: 34, size: s - 3, w: 128 }),
  ].join('\n');
}

const ABAS = [
  ['Design', 'PenTool'],
  ['Workflow', 'Workflow'],
  ['Data', 'Database'],
  ['Styles', 'Paintbrush'],
  ['Plugins', 'Plug'],
  ['Settings', 'Settings'],
  ['Logs', 'ScrollText'],
];

/**
 * Trilho vertical de abas do editor (Design, Workflow, Data...).
 * `y0` = topo do trilho; o centro da aba i fica em y0 + primeiro + i * passo.
 */
export function trilho(H, ativa, { y0 = 56, w = 88, passo = 80, primeiro = 64, s = 15, ic = 24, rotulos = true, ate = ABAS.length } = {}) {
  const out = [rect(0, y0, w, H - y0, { fill: C.panel }), line(w, y0, w, H)];
  ABAS.slice(0, ate).forEach(([nome, ico], i) => {
    const cy = y0 + primeiro + i * passo;
    const on = nome === ativa;
    if (on) out.push(rect(8, cy - passo / 2 + 6, w - 16, passo - 12, { r: 10, fill: '#E8EDFF' }), rect(0, cy - passo / 2 + 10, 4, passo - 20, { r: 2, fill: C.blue }));
    const iy = rotulos ? cy - ic / 2 - s * 0.6 : cy - ic / 2;
    out.push(icon(ico, w / 2 - ic / 2, iy, ic, on ? C.blue : C.ink2));
    if (rotulos) out.push(text(w / 2, cy + ic / 2 + s * 0.55, nome, { size: s, weight: on ? 650 : 500, fill: on ? C.blue : C.ink2, anchor: 'middle' }));
  });
  return out.join('\n');
}

/** Etiqueta azul com o nome do elemento (como o editor mostra ao selecionar). */
export function etiqueta(x, y, nome, s = 13) {
  const w = Math.round(nome.length * s * 0.6 + 14);
  return rect(x, y - s - 8, w, s + 8, { r: 4, fill: C.blue }) + text(x + 7, y - 6, nome, { size: s, weight: 600, fill: '#FFFFFF' });
}
