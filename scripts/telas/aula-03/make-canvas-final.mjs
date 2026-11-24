import { C, badge, doc, rect, selo, text, icon } from '../lib.mjs';
import { MK, grade, ligacaoMake, moduloMake, rodapeMake, topoMake } from './_comum.mjs';

// S28: o cenário pronto no Make (versão sem IA): Custom webhook → filtro → Add a Row → Send an Email.
// Posições casam com os marcadores/zooms do slide: módulos em x = 16%, 54%, 74%; filtro em 34%; y = 46%.
const W = 1280;
const H = 800;
const y = Math.round(H * 0.46);
const r = 70;
const xs = [0.165, 0.54, 0.74].map((p) => Math.round(W * p));

const corpo = [
  grade(0, 60, W, H - 136),
  topoMake(W, 'Hackathon — inscricao', { size: 21 }),
  badge(W - 150, 16, 'Saved', { size: 15, icone: 'Check', fill: C.greenBg, ink: C.green }),
  ligacaoMake(xs[0] + r, xs[1] - r, y, { filtro: true, rotuloFiltro: 'dados minimos', size: 21 }),
  ligacaoMake(xs[1] + r, xs[2] - r, y),
  moduloMake(xs[0], y, r, { cor: MK.webhook, icone: 'Webhook', titulo: 'Webhooks', sub: 'Custom webhook', num: 1, gatilho: true, size: 24 }),
  moduloMake(xs[1], y, r, { cor: MK.sheets, icone: 'Table2', titulo: 'Google Sheets', sub: 'Add a Row', num: 2, size: 24 }),
  moduloMake(xs[2], y, r, { cor: MK.gmail, icone: 'Mail', titulo: 'Gmail', sub: 'Send an Email', num: 3, size: 24 }),
  // "+" para o próximo módulo
  `<circle cx="${xs[2] + 150}" cy="${y}" r="26" fill="none" stroke="#BFC3CF" stroke-width="2" stroke-dasharray="6 6"/>`,
  icon('Plus', xs[2] + 138, y - 12, 24, C.ink3),
  // condição do filtro, como dica abaixo da ligação
  rect(xs[0] + 92, y + 42, 268, 80, { r: 10, fill: C.panel, stroke: C.line }),
  text(xs[0] + 108, y + 74, 'nome  existe', { size: 20, fill: C.ink2 }),
  text(xs[0] + 108, y + 106, 'E  email  contém  @', { size: 20, fill: C.ink2 }),
  rodapeMake(W, H, { size: 20 }),
  selo(W, H - 76),
].join('\n');

export default { arquivo: 'media/aula-03/tela-make-canvas-final.svg', svg: doc(W, H, corpo) };
