import { C, badge, button, checkbox, doc, line, rect, selo, text } from '../lib.mjs';
import { topo, trilho } from './_comum.mjs';

// S46 (moldura 1036x648): Data › Privacy da Inscricao. Zoom 1 (0–55% x, 0–45% y) mostra o status
// "Publicly visible" → "Privacy rules applied"; zoom 2 (25–85%, 20–70%) a regra Organizador;
// zoom 3 (25–85%, 50–100%) as permissões de Everyone else, com o e-mail como Constraint.
const W = 1280;
const H = 800;
const RAIL = 96;
const LX = 330;

const subabas = [
  rect(RAIL, 56, W - RAIL, 46, { fill: C.panel }),
  line(RAIL, 102, W, 102),
  ...['Data types', 'Option sets', 'Privacy', 'App data'].map((t, i) => {
    const x = RAIL + 24 + i * 150;
    const on = i === 2;
    return text(x, 86, t, { size: 18, weight: on ? 650 : 500, fill: on ? C.blue : C.ink2 }) + (on ? rect(x, 98, 66, 3, { r: 1.5, fill: C.blue }) : '');
  }),
];

const lista = [
  rect(RAIL, 102, LX - RAIL, H - 102, { fill: '#FAFBFC' }),
  line(LX, 102, LX, H),
  text(RAIL + 18, 134, 'DATA TYPES', { size: 14, weight: 650, fill: C.ink3, ls: 0.5 }),
  rect(RAIL + 8, 148, LX - RAIL - 16, 104, { r: 10, fill: '#E8EDFF' }),
  text(RAIL + 20, 178, 'Inscricao', { size: 20, weight: 650, fill: C.blue }),
  text(RAIL + 20, 206, 'Publicly visible', { size: 16, fill: C.red }),
  line(RAIL + 20, 201, RAIL + 128, 201, { stroke: C.red, sw: 1.5 }),
  text(RAIL + 20, 234, 'Privacy rules applied', { size: 16, weight: 600, fill: C.green }),
  text(RAIL + 20, 296, 'User', { size: 20, fill: C.ink2 }),
  text(RAIL + 20, 322, 'Privacy rules applied', { size: 16, fill: C.ink3 }),
];

const perm = (x, y, on, rotulo) => checkbox(x, y - 15, on) + text(x + 28, y, rotulo, { size: 17, fill: on ? C.ink : C.ink3 });

const cx = 352;
const cw = 724;
const regra = [
  text(cx, 142, 'Privacy rules for Inscricao', { size: 22, weight: 700 }),
  button(cx + cw - 196, 116, 'Define a new rule', { tipo: 'secundario', icone: 'Plus', size: 15, h: 36, w: 196 }),
  // regra Organizador
  rect(cx, 166, cw, 222, { r: 12, fill: C.panel, stroke: C.lineStrong }),
  text(cx + 20, 202, 'Rule name', { size: 15, weight: 560, fill: C.ink2 }),
  rect(cx + 130, 180, 260, 36, { r: 7, stroke: C.lineStrong }),
  text(cx + 144, 204, 'Organizador', { size: 18, weight: 600 }),
  text(cx + 20, 252, 'When', { size: 15, weight: 560, fill: C.ink2 }),
  rect(cx + 130, 228, cw - 150, 38, { r: 7, stroke: '#6B46E5', sw: 1.5, fill: '#FAF8FF' }),
  text(cx + 144, 253, "Current User's organizador is yes", { size: 17, mono: true }),
  text(cx + 20, 302, 'Users who match this rule can...', { size: 15, fill: C.ink2 }),
  perm(cx + 20, 338, true, 'View all fields'),
  perm(cx + 260, 338, true, 'Find this in searches'),
  perm(cx + 20, 372, true, 'View attached files'),
  perm(cx + 260, 372, false, 'Allow auto-binding'),
  // Everyone else
  rect(cx, 410, cw, 362, { r: 12, fill: C.panel, stroke: C.lineStrong }),
  text(cx + 20, 446, 'Everyone else', { size: 20, weight: 700 }),
  text(cx + 172, 446, '(default permissions)', { size: 16, fill: C.ink2 }),
  perm(cx + 20, 490, true, 'Find this in searches'),
  perm(cx + 300, 490, false, 'View attached files'),
  perm(cx + 20, 528, false, 'View all fields'),
  line(cx + 20, 548, cx + cw - 20, 548),
  ...[
    ['nome', false],
    ['email', 'c'],
    ['telefone', false],
    ['trilha', false],
  ].map(([n, v], i) => {
    const y = 584 + i * 44;
    return (
      perm(cx + 40, y, false, n) +
      (v === 'c' ? badge(cx + 200, y - 21, 'Constraint', { size: 15, fill: C.amberBg, ink: C.amber }) + text(cx + 330, y, 'só para buscar, sem ler o valor', { size: 15, fill: C.ink2 }) : '')
    );
  }),
];

export default {
  arquivo: 'media/aula-02/tela-bubble-privacy-regra.svg',
  svg: doc(W, H, [rect(0, 0, W, H, { fill: '#EEF0F4' }), ...subabas, ...lista, ...regra, trilho(H, 'Data', { y0: 56, w: RAIL, passo: 80, primeiro: 72 }), topo(W), selo(W, H)].join('\n')),
};
