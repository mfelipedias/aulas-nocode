import { C, circle, doc, icon, rect, selo, text } from '../lib.mjs';
import { marcaLovable } from './_comum.mjs';

// S58, passos 0 e 1: tela inicial do Lovable com o prompt planejado sendo colado e o wireframe anexado.
const W = 1200;
const H = 812;
const bx = 200;
const by = 290;
const bw = 800;

const svg = [
  `<defs><radialGradient id="lh1" cx="0.25" cy="0.9" r="0.6"><stop offset="0" stop-color="#FF8A5B" stop-opacity="0.55"/><stop offset="1" stop-color="#FF8A5B" stop-opacity="0"/></radialGradient>`,
  `<radialGradient id="lh2" cx="0.8" cy="0.85" r="0.6"><stop offset="0" stop-color="#7A6BFF" stop-opacity="0.5"/><stop offset="1" stop-color="#7A6BFF" stop-opacity="0"/></radialGradient>`,
  `<radialGradient id="lh3" cx="0.5" cy="1" r="0.5"><stop offset="0" stop-color="#FF4D9A" stop-opacity="0.45"/><stop offset="1" stop-color="#FF4D9A" stop-opacity="0"/></radialGradient></defs>`,
  rect(0, 0, W, H, { fill: 'url(#lh1)' }),
  rect(0, 0, W, H, { fill: 'url(#lh2)' }),
  rect(0, 0, W, H, { fill: 'url(#lh3)' }),
  marcaLovable(32, 24),
  text(W - 110, 46, 'Comunidade', { size: 17, fill: C.ink2, anchor: 'end' }),
  circle(W - 56, 39, 20, { fill: C.ink }),
  text(W - 56, 46, 'M', { size: 18, weight: 650, fill: '#FFFFFF', anchor: 'middle' }),
  // título
  text(W / 2, 186, 'O que vamos construir hoje?', { size: 46, weight: 720, anchor: 'middle' }),
  text(W / 2, 234, 'Crie apps e sites conversando com a IA.', { size: 22, fill: C.ink2, anchor: 'middle' }),
  // caixa de prompt
  rect(bx, by, bw, 270, { r: 22, fill: C.panel, stroke: C.line }),
  text(bx + 32, by + 50, 'Contexto: validar o Hackathon No-Code 2026,\nonline e gratuito, 21 e 22 de novembro.\nPúblico: iniciantes em tecnologia, no celular.\nPersona: Camila, 22 anos, 1º semestre de ADS…', { size: 20, lh: 30 }),
  rect(bx + 32 + 438, by + 118, 2, 26, { fill: C.blue }),
  // anexo
  rect(bx + 32, by + 178, 290, 52, { r: 10, fill: C.hover, stroke: C.line }),
  rect(bx + 42, by + 186, 50, 36, { r: 4, fill: C.panel, stroke: C.lineStrong }),
  icon('Image', bx + 57, by + 194, 20, C.ink3),
  text(bx + 104, by + 211, 'wireframe-desktop.png', { size: 16, fill: C.ink2 }),
  icon('X', bx + 296, by + 196, 16, C.ink3),
  // ações
  icon('Paperclip', bx + bw - 140, by + 214, 22, C.ink2),
  circle(bx + bw - 54, by + 225, 24, { fill: C.ink }),
  icon('ArrowUp', bx + bw - 66, by + 213, 24, '#FFFFFF'),
  text(W / 2, by + 318, 'Plano gratuito · 5 de 5 créditos hoje', { size: 18, fill: C.ink2, anchor: 'middle' }),
  selo(W, H),
].join('\n');

export default { arquivo: 'media/aula-01/tela-lovable-home-prompt.svg', svg: doc(W, H, svg, { fundo: '#FBF8F6' }) };
