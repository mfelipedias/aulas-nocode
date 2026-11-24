import { C, badge, button, doc, icon, line, rect, selo, text } from '../lib.mjs';

// S11: Bubble (plano Free) ao clicar em "Deploy to live": o editor pede upgrade.
const W = 1920;
const H = 1080;

const topo = [
  rect(0, 0, W, 64, { fill: C.panel }),
  line(0, 64, W, 64),
  rect(20, 16, 32, 32, { r: 8, fill: '#0C29AB' }),
  text(36, 40, 'b', { size: 22, weight: 700, fill: '#FFFFFF', anchor: 'middle' }),
  text(68, 40, 'hackathon-nocode-2026', { size: 17, weight: 600 }),
  badge(290, 20, 'Free', { size: 12, fill: C.amberBg, ink: C.amber }),
  text(380, 40, 'Page: index', { size: 15, fill: C.ink2 }),
  icon('ChevronDown', 470, 30, 14, C.ink3),
  ...['Design', 'Workflow', 'Data', 'Styles', 'Plugins', 'Settings', 'Logs'].map((t, i) =>
    text(560 + i * 104, 40, t, { size: 15, fill: C.ink2, weight: 500 }),
  ),
  button(1520, 14, 'Preview', { tipo: 'secundario', icone: 'Eye', h: 36 }),
  button(1650, 14, 'Development', { tipo: 'secundario', icone: 'ChevronDown', h: 36, w: 150 }),
  rect(1646, 10, 158, 44, { r: 10, stroke: C.blue, sw: 2 }),
].join('\n');

// editor ao fundo (esmaecido)
const editor = [
  rect(0, 64, 260, H - 64, { fill: C.panel }),
  line(260, 64, 260, H),
  ...['Text', 'Button', 'Icon', 'Image', 'Input', 'Dropdown', 'Checkbox', 'Repeating Group'].map((t, i) =>
    text(28, 116 + i * 40, t, { size: 15, fill: C.ink2 }),
  ),
  rect(380, 120, 1160, 860, { r: 4, fill: C.panel, stroke: C.line }),
  text(440, 210, 'Hackathon No-Code 2026', { size: 40, weight: 700 }),
  rect(440, 260, 520, 14, { r: 7, fill: C.hover }),
  rect(440, 290, 380, 14, { r: 7, fill: C.hover }),
  ...[0, 1, 2].map((i) => rect(440, 360 + i * 80, 520, 52, { r: 8, stroke: C.lineStrong, fill: C.panel })),
  rect(440, 610, 220, 56, { r: 8, fill: C.blue }),
  rect(1040, 340, 420, 320, { r: 12, fill: C.hover }),
  rect(0, 64, W, H - 64, { fill: '#0B0E14', fo: 0.55 }),
].join('\n');

// menu de versões aberto
const menu = [
  rect(1560, 60, 300, 140, { r: 10, fill: C.panel, stroke: C.line }),
  text(1580, 96, 'Development', { size: 15, weight: 600 }),
  icon('Check', 1826, 82, 16, C.blue),
  line(1560, 116, 1860, 116),
  icon('Rocket', 1580, 140, 18, C.ink3),
  text(1608, 155, 'Deploy to live', { size: 15, fill: C.ink3 }),
  icon('Lock', 1826, 141, 16, C.ink3),
].join('\n');

// diálogo de upgrade
const dx = 610;
const dy = 300;
const dialogo = [
  rect(dx, dy, 700, 460, { r: 16, fill: C.panel }),
  rect(dx + 40, dy + 44, 56, 56, { r: 14, fill: C.amberBg }),
  icon('Rocket', dx + 54, dy + 58, 28, C.amber),
  text(dx + 40, dy + 150, 'Faça upgrade para publicar', { size: 32, weight: 700 }),
  text(dx + 40, dy + 196, 'O plano Free é para projetos em construção.\nPara colocar o app no ar, escolha um plano pago.', { size: 19, fill: C.ink2, lh: 28 }),
  ...[
    ['X', 'Deploy to live (versão pública)'],
    ['X', 'Domínio próprio'],
    ['X', 'Publicar nas lojas de apps'],
  ].map(([, t], i) => icon('CircleX', dx + 40, dy + 270 + i * 36, 20, C.red) + text(dx + 72, dy + 286 + i * 36, t, { size: 18 })),
  button(dx + 40, dy + 384, 'Agora não', { tipo: 'secundario', size: 17, h: 48, w: 160 }),
  button(dx + 440, dy + 384, 'Ver planos', { size: 17, h: 48, w: 220 }),
].join('\n');

export default {
  arquivo: 'media/aula-04/tela-bubble-deploy-bloqueado.svg',
  svg: doc(W, H, [topo, editor, menu, dialogo, selo(W, H)].join('\n')),
};
