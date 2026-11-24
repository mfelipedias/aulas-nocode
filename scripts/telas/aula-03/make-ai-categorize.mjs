import { C, button, doc, icon, line, rect, selo, text } from '../lib.mjs';
import { MK, grade, ligacaoMake, moduloMake, pilula, rodapeMake, topoMake } from './_comum.mjs';

// S46: IA dentro do fluxo — módulo Make AI Toolkit "Categorize Text" inserido entre o filtro e a planilha,
// com a ideia mapeada e as quatro trilhas como categorias. Provedor: Make's AI Provider (sem chave externa).
const W = 1200;
const H = 772;
const cy = 140;
const r = 42;
const mods = [
  { x: 86, cor: MK.webhook, icone: 'Webhook', titulo: 'Webhooks', num: 1 },
  { x: 330, cor: MK.ia, icone: 'Tags', titulo: 'Categorize Text', num: 2 },
  { x: 540, cor: MK.ia, icone: 'Sparkles', titulo: 'Simple Text Prompt', num: 3 },
  { x: 760, cor: MK.sheets, icone: 'Table2', titulo: 'Add a Row', num: 4 },
  { x: 950, cor: MK.gmail, icone: 'Mail', titulo: 'Send an Email', num: 5 },
];

const fluxo = [
  ligacaoMake(mods[0].x + r, mods[1].x - r, cy, { filtro: true }),
  ...mods.slice(1).map((m, i) => (i < mods.length - 2 ? ligacaoMake(m.x + r, mods[i + 2].x - r, cy) : '')),
  // destaque do módulo em edição
  `<circle cx="${mods[1].x}" cy="${cy}" r="${r + 10}" fill="none" stroke="${MK.ia}" stroke-width="3" stroke-dasharray="7 6"/>`,
  ...mods.map((m) => moduloMake(m.x, cy, r, { cor: m.cor, icone: m.icone, titulo: m.titulo, num: m.num, size: 20 })),
].join('\n');

const px = 40;
const py = 238;
const pw = W - 80;
const ph = 424;
const cats = [
  ['Web', 'site, página, sistema no navegador'],
  ['Mobile', 'app de celular'],
  ['Automação', 'integrar sistemas, robôs, fluxos'],
  ['IA', 'modelos, chatbots, análise com IA'],
];
const cx = px + 540;
const dialogo = [
  `<rect x="${px}" y="${py + 4}" width="${pw}" height="${ph}" rx="16" fill="#000" fill-opacity="0.05"/>`,
  rect(px, py, pw, ph, { r: 16, fill: C.panel, stroke: C.line }),
  rect(px, py, pw, 60, { r: 16, fill: MK.ia }),
  rect(px, py + 40, pw, 20, { fill: MK.ia }),
  icon('Sparkles', px + 22, py + 16, 28, '#FFFFFF'),
  text(px + 62, py + 39, 'Make AI Toolkit · Categorize Text', { size: 23, weight: 700, fill: '#FFFFFF' }),
  icon('X', px + pw - 44, py + 18, 24, '#FFFFFF'),
  // coluna da esquerda
  text(px + 28, py + 104, 'Connection', { size: 20, weight: 650 }),
  rect(px + 28, py + 118, 470, 50, { r: 8, stroke: C.lineStrong, fill: C.field }),
  text(px + 44, py + 151, "Make's AI Provider", { size: 21 }),
  icon('ChevronDown', px + 464, py + 131, 22, C.ink3),
  text(px + 28, py + 214, 'Text to categorize', { size: 20, weight: 650 }),
  rect(px + 28, py + 228, 470, 56, { r: 8, stroke: MK.ia, sw: 2, fill: C.field }),
  pilula(px + 42, py + 240, 1, 'ideia', { size: 19 }),
  text(px + 28, py + 330, 'Allow multiple categories', { size: 20, weight: 650 }),
  rect(px + 28, py + 344, 96, 44, { r: 8, fill: MK.roxo }),
  text(px + 76, py + 373, 'No', { size: 20, weight: 650, fill: '#FFFFFF', anchor: 'middle' }),
  rect(px + 124, py + 344, 96, 44, { r: 8, stroke: C.lineStrong, fill: C.panel }),
  text(px + 172, py + 373, 'Yes', { size: 20, fill: C.ink2, anchor: 'middle' }),
  // coluna da direita: categorias
  line(cx - 20, py + 84, cx - 20, py + ph - 24),
  text(cx, py + 104, 'Categories', { size: 20, weight: 650 }),
  ...cats.map(([nome, desc], i) => {
    const y = py + 112 + i * 58;
    return [
      rect(cx, y, pw - (cx - px) - 28, 50, { r: 8, stroke: C.line, fill: C.bg }),
      text(cx + 16, y + 34, nome, { size: 21, weight: 650, fill: MK.roxo }),
      text(cx + 172, y + 34, desc, { size: 19, fill: C.ink2 }),
    ].join('');
  }),
  button(px + pw - 300, py + ph - 64, 'Cancel', { tipo: 'secundario', size: 20, h: 48, w: 130 }),
  button(px + pw - 158, py + ph - 64, 'Save', { cor: MK.roxo, size: 20, h: 48, w: 130 }),
].join('\n');

const corpo = [
  grade(0, 60, W, H - 136),
  topoMake(W, 'Hackathon — inscricao', { size: 21 }),
  fluxo,
  dialogo,
  rodapeMake(W, H, { size: 20, ligado: false }),
  selo(W, H - 76),
].join('\n');

export default { arquivo: 'media/aula-03/tela-make-ai-categorize.svg', svg: doc(W, H, corpo) };
