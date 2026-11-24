import { C, badge, doc, icon, line, rect, selo, text } from '../lib.mjs';
import { topo, trilho } from './_comum.mjs';

// S38 (moldura 1002x678): aba Workflow com o evento do botão, a condição Only when
// ("crie uma inscrição só se o e-mail não existir") e os três passos.
const W = 1280;
const H = 866;
const RAIL = 96;
const LX = 330;
const PX = 862;

const lista = [
  rect(RAIL, 56, LX - RAIL, H - 56, { fill: C.panel }),
  line(LX, 56, LX, H),
  text(RAIL + 18, 96, 'EVENTOS', { size: 14, weight: 650, fill: C.ink3, ls: 0.5 }),
  rect(RAIL + 8, 112, LX - RAIL - 16, 76, { r: 8, fill: '#E8EDFF' }),
  icon('MousePointerClick', RAIL + 18, 124, 20, C.blue),
  text(RAIL + 46, 140, 'Button Quero minha\nvaga is clicked', { size: 17, weight: 600, fill: C.blue, lh: 24 }),
  icon('Monitor', RAIL + 18, 212, 20, C.ink2),
  text(RAIL + 46, 228, 'Page is loaded', { size: 17, fill: C.ink2 }),
  icon('Plus', RAIL + 18, 266, 20, C.ink3),
  text(RAIL + 46, 282, 'Click here to add\nan event...', { size: 17, fill: C.ink3, lh: 24 }),
];

const cx = 362;
const cw = 470;
const seta = (y) => line(cx + 40, y, cx + 40, y + 26, { stroke: C.lineStrong, sw: 2 });
const passo = (y, h, n, titulo, linhas = []) =>
  [
    rect(cx, y, cw, h, { r: 12, fill: C.panel, stroke: C.lineStrong }),
    rect(cx, y, 6, h, { r: 3, fill: C.blue }),
    text(cx + 24, y + 34, `Step ${n}`, { size: 16, weight: 650, fill: C.blue }),
    text(cx + 92, y + 34, titulo, { size: 20, weight: 650 }),
    ...linhas.map((l, i) => text(cx + 24, y + 70 + i * 28, l, { size: 16, mono: true, fill: C.ink2 })),
  ].join('');

const fluxo = [
  // evento
  rect(cx, 92, cw, 120, { r: 12, fill: C.amberBg, stroke: '#F0C766', sw: 1.5 }),
  icon('MousePointerClick', cx + 22, 112, 24, C.amber),
  text(cx + 58, 132, 'When Button Quero minha vaga\nis clicked', { size: 20, weight: 700, lh: 28 }),
  badge(cx + 22, 172, 'Only when', { size: 15, fill: '#EFEBFF', ink: '#6B46E5', icone: 'Filter' }),
  seta(212),
  passo(238, 204, 1, 'Create a new thing', [
    'Type: Inscricao',
    "nome = Input Nome's value",
    "email = Input E-mail's value",
    "telefone = Input Telefone's value",
    "trilha = Dropdown Trilha's value",
  ]),
  seta(442),
  passo(468, 56, 2, 'Reset relevant inputs'),
  seta(524),
  passo(550, 56, 3, 'Show Texto confirmacao'),
  rect(cx, 636, cw, 52, { r: 12, stroke: C.lineStrong, dash: '6 5' }),
  icon('Plus', cx + 22, 650, 22, C.ink3),
  text(cx + 54, 669, 'Click here to add an action...', { size: 18, fill: C.ink3 }),
];

// painel do evento: a condição
const pw = W - PX - 16;
const painel = [
  rect(PX, 76, pw, 490, { r: 12, fill: C.panel, stroke: C.lineStrong }),
  text(PX + 20, 112, 'Button Quero minha vaga', { size: 19, weight: 650 }),
  text(PX + 20, 138, 'is clicked', { size: 17, fill: C.ink2 }),
  line(PX, 156, PX + pw, 156),
  text(PX + 20, 192, 'Element', { size: 16, weight: 560, fill: C.ink2 }),
  rect(PX + 20, 204, pw - 40, 42, { r: 7, stroke: C.lineStrong, fill: C.field }),
  text(PX + 34, 231, 'Button Quero minha vaga', { size: 17 }),
  text(PX + 20, 286, 'Only when', { size: 16, weight: 650, fill: '#6B46E5' }),
  rect(PX + 20, 298, pw - 40, 236, { r: 8, stroke: '#6B46E5', sw: 2, fill: '#FAF8FF' }),
  text(PX + 34, 332, "Input E-mail's value\nis not empty\nand Do a search for\n  Inscricaos\n  (email = Input\n  E-mail's value)\n  :count is 0", { size: 17, mono: true, lh: 28 }),
];

export default {
  arquivo: 'media/aula-02/tela-bubble-workflow-inscricao.svg',
  svg: doc(W, H, [rect(0, 0, W, H, { fill: '#EEF0F4' }), ...lista, ...fluxo, ...painel, trilho(H, 'Workflow', { y0: 56, w: RAIL, passo: 80, primeiro: 72 }), topo(W), selo(W, H)].join('\n')),
};
