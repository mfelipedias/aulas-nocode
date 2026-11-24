import { C, badge, doc, line, rect, selo, text } from '../lib.mjs';
import { topo, trilho } from './_comum.mjs';

// S27 (moldura 636x398): aba Data com o data type Inscricao e seus campos, e o option set Trilha.
// Tela pequena no slide: poucos elementos e letras grandes. Marcador 1 em (30%, 40%) = item Inscricao.
const W = 720;
const H = 450;
const RAIL = 52;
const LX = 262;

const subabas = [
  rect(RAIL, 44, W - RAIL, 42, { fill: C.panel }),
  line(RAIL, 86, W, 86),
  ...['Data types', 'Option sets', 'Privacy', 'App data'].map((t, i) => {
    const x = RAIL + 18 + [0, 120, 240, 330][i];
    return text(x, 72, t, { size: 17, weight: i === 0 ? 650 : 500, fill: i === 0 ? C.blue : C.ink2 }) + (i === 0 ? rect(x, 82, 92, 3, { r: 1.5, fill: C.blue }) : '');
  }),
];

const lista = [
  rect(RAIL, 86, LX - RAIL, H - 86, { fill: '#FAFBFC' }),
  line(LX, 86, LX, H),
  text(RAIL + 18, 116, 'DATA TYPES', { size: 14, weight: 650, fill: C.ink3, ls: 0.5 }),
  text(RAIL + 18, 150, 'User', { size: 20, fill: C.ink2 }),
  rect(RAIL + 8, 162, LX - RAIL - 16, 38, { r: 8, fill: '#E8EDFF' }),
  text(RAIL + 18, 188, 'Inscricao', { size: 20, weight: 650, fill: C.blue }),
  text(RAIL + 18, 242, 'OPTION SETS', { size: 14, weight: 650, fill: C.ink3, ls: 0.5 }),
  text(RAIL + 18, 276, 'Trilha', { size: 20, weight: 600, fill: '#6B46E5' }),
  text(RAIL + 18, 304, 'Web · Mobile\nAutomação · IA', { size: 17, fill: C.ink2, lh: 24 }),
];

const campos = [
  ['nome', 'text'],
  ['email', 'text'],
  ['telefone', 'text'],
  ['trilha', 'Trilha'],
];
const px = LX + 22;
const painel = [
  rect(LX, 86, W - LX, H - 86, { fill: C.panel }),
  text(px, 124, 'Inscricao', { size: 24, weight: 700 }),
  ...campos.map(([n, t], i) => {
    const y = 144 + i * 46;
    const opt = t === 'Trilha';
    return [
      rect(px, y, W - px - 22, 38, { r: 8, stroke: C.line, fill: C.panel }),
      text(px + 14, y + 26, n, { size: 20, weight: 560 }),
      badge(W - 22 - 12 - (opt ? 86 : 66), y + 5, t, { size: 14, w: opt ? 86 : 66, fill: opt ? '#EFEBFF' : C.hover, ink: opt ? '#6B46E5' : C.ink2 }),
    ].join('');
  }),
  text(px, 352, 'Automáticos', { size: 15, weight: 650, fill: C.ink3 }),
  text(px, 380, 'Created Date · date', { size: 17, fill: C.ink3 }),
  text(px, 406, 'Created By · User', { size: 17, fill: C.ink3 }),
];

export default {
  arquivo: 'media/aula-02/tela-bubble-data-types.svg',
  svg: doc(W, H, [...subabas, ...lista, ...painel, trilho(H, 'Data', { y0: 44, w: RAIL, passo: 52, primeiro: 34, rotulos: false, ic: 20, ate: 5 }), topo(W, { h: 44, s: 15, pagina: '' }), selo(W, H)].join('\n')),
};
