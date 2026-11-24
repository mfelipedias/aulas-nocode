import { C, button, doc, field, icon, line, rect, selo, text, toggle } from '../lib.mjs';
import { etiqueta, topo, trilho } from './_comum.mjs';

// S13: o mapa do editor. Trilho de abas à esquerda (Design, Workflow, Data em 16%, 26% e 36% da altura),
// paleta de elementos, a página index no centro e o property editor (Visual, Interaction, Conditional) à direita.
const W = 1280;
const H = 800;
const RAIL = 96;
const PAL = 300;
const PE = 770; // início do property editor

const paleta = [
  rect(RAIL, 56, PAL - RAIL, H - 56, { fill: C.panel }),
  line(PAL, 56, PAL, H),
  rect(RAIL + 14, 72, PAL - RAIL - 28, 36, { r: 8, fill: C.bg, stroke: C.line }),
  icon('Search', RAIL + 24, 81, 18, C.ink3),
  text(RAIL + 50, 96, 'Search elements', { size: 15, fill: C.ink3 }),
  text(RAIL + 16, 142, 'VISUAL ELEMENTS', { size: 13, weight: 650, fill: C.ink3, ls: 0.5 }),
  ...[
    ['Type', 'Text'],
    ['Square', 'Button'],
    ['Image', 'Image'],
    ['Sparkles', 'Icon'],
  ].map(([ic, t], i) => icon(ic, RAIL + 18, 160 + i * 40, 18, C.ink2) + text(RAIL + 46, 175 + i * 40, t, { size: 17, fill: C.ink })),
  text(RAIL + 16, 340, 'CONTAINERS', { size: 13, weight: 650, fill: C.ink3, ls: 0.5 }),
  ...[
    ['LayoutGrid', 'Group'],
    ['Rows3', 'Repeating Group'],
  ].map(([ic, t], i) => icon(ic, RAIL + 18, 358 + i * 40, 18, C.ink2) + text(RAIL + 46, 373 + i * 40, t, { size: 17, fill: C.ink })),
  text(RAIL + 16, 458, 'INPUT FORMS', { size: 13, weight: 650, fill: C.ink3, ls: 0.5 }),
  ...[
    ['TextCursorInput', 'Input'],
    ['ChevronDown', 'Dropdown'],
    ['Check', 'Checkbox'],
  ].map(([ic, t], i) => icon(ic, RAIL + 18, 476 + i * 40, 18, C.ink2) + text(RAIL + 46, 491 + i * 40, t, { size: 17, fill: C.ink })),
];

// página index no centro
const px = PAL + 26;
const pw = PE - PAL - 52;
const pagina = [
  rect(px, 80, pw, 690, { r: 4, fill: C.panel, stroke: C.line }),
  text(px + 28, 140, 'Hackathon No-Code 2026', { size: 26, weight: 700 }),
  rect(px + 28, 160, 300, 10, { r: 5, fill: C.hover }),
  rect(px + 28, 180, 220, 10, { r: 5, fill: C.hover }),
  ...[0, 1, 2].map((i) => rect(px + 28, 212 + i * 58, pw - 56, 44, { r: 7, stroke: C.lineStrong, fill: C.panel })),
  ...['Nome', 'E-mail', 'Telefone'].map((t, i) => text(px + 42, 240 + i * 58, t, { size: 16, fill: C.ink3 })),
  rect(px + 28, 406, pw - 56, 52, { r: 8, fill: C.blue }),
  rect(px + 24, 402, pw - 48, 60, { r: 10, stroke: C.blue, sw: 2, dash: '6 4' }),
  text(px + pw / 2, 439, 'Quero minha vaga', { size: 19, weight: 600, fill: '#FFFFFF', anchor: 'middle' }),
  etiqueta(px + 24, 398, 'Button Quero minha vaga', 13),
  rect(px + 28, 500, pw - 56, 220, { r: 10, fill: C.hover }),
  icon('Image', px + pw / 2 - 20, 590, 40, C.ink3),
];

// property editor (painel flutuante do elemento selecionado)
const ex = PE;
const ew = W - PE - 16;
const prop = [
  rect(ex, 72, ew, 650, { r: 12, fill: C.panel, stroke: C.lineStrong }),
  icon('Square', ex + 20, 94, 20, C.blue),
  text(ex + 50, 111, 'Button Quero minha vaga', { size: 18, weight: 650 }),
  line(ex, 132, ex + ew, 132),
  // abas do property editor (2026)
  ...['Visual', 'Interaction', 'Conditional'].map((t, i) => {
    const tx = ex + 20 + i * 150;
    return text(tx, 166, t, { size: 18, weight: i === 0 ? 650 : 500, fill: i === 0 ? C.blue : C.ink2 }) + (i === 0 ? rect(tx, 178, 62, 3, { r: 1.5, fill: C.blue }) : '');
  }),
  line(ex, 182, ex + ew, 182),
  field(ex + 20, 226, ew - 40, 'Text', 'Quero minha vaga', { size: 17, h: 42 }),
  field(ex + 20, 306, ew - 40, 'Style', 'Button Primary', { size: 17, h: 42 }),
  icon('ChevronDown', ex + ew - 50, 318, 18, C.ink3),
  text(ex + 20, 380, 'Background', { size: 16, weight: 520, fill: C.ink2 }),
  rect(ex + 20, 392, 36, 36, { r: 7, fill: C.blue }),
  text(ex + 68, 416, '#2F6BFF', { size: 17, mono: true }),
  text(ex + 20, 466, 'Font size', { size: 16, weight: 520, fill: C.ink2 }),
  rect(ex + 20, 478, 120, 40, { r: 7, stroke: C.lineStrong, fill: C.field }),
  text(ex + 34, 504, '18', { size: 17 }),
  text(ex + 20, 566, 'Visible on page load', { size: 17, fill: C.ink }),
  toggle(ex + ew - 64, 552, true),
  button(ex + 20, 610, 'Start/Edit workflow', { tipo: 'secundario', icone: 'Workflow', size: 16, h: 42, w: ew - 40 }),
];

export default {
  arquivo: 'media/aula-02/tela-bubble-editor-mapa.svg',
  svg: doc(W, H, [rect(0, 0, W, H, { fill: '#EEF0F4' }), ...paleta, ...pagina, ...prop, trilho(H, 'Design', { y0: 56, w: RAIL, passo: 80, primeiro: 72 }), topo(W), selo(W, H)].join('\n')),
};
