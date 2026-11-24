import { C, doc, icon, rect, selo, text } from '../lib.mjs';
import { balaoUsuario, editorLovable, marcaLovable, paginaBCelular } from './_comum.mjs';

// S58, passo 3: preview em modo celular depois do ajuste pontual (prompt C).
const W = 1200;
const H = 812;

const u = balaoUsuario(88, ['No celular, coloque o formulário', 'logo depois do título e deixe o', 'botão na largura toda. Não mude', 'mais nada.']);
const ay = 88 + u.h + 30;
const msgs = [
  u.svg,
  rect(20, ay, 26, 26, { r: 7, fill: 'url(#lvg)' }),
  text(58, ay + 19, 'Pronto. Mudei só a ordem no', { size: 17 }),
  text(58, ay + 43, 'celular e a largura do botão.', { size: 17 }),
  icon('CircleCheck', 58, ay + 70, 20, C.green),
  text(88, ay + 86, 'Ajuste aplicado · 1 crédito', { size: 16, fill: C.ink2 }),
];

const ed = editorLovable(W, H, { celular: true, mensagens: msgs, creditos: '2 de 5' });
const k = 0.8;
const cx = ed.px + ed.pw / 2 - (390 * k) / 2;
const cy = ed.py + 20;
const prev = [
  rect(cx - 10, cy - 6, 390 * k + 20, 888 * k + 12, { r: 28, fill: '#0E1014' }),
  `<g transform="translate(${cx} ${cy}) scale(${k})">${paginaBCelular()}</g>`,
];

export default {
  arquivo: 'media/aula-01/tela-lovable-preview-mobile.svg',
  svg: doc(W, H, [marcaLovable(-100, -100), ed.svg, ...prev, selo(W, H)].join('\n'), { fundo: C.panel }),
};
