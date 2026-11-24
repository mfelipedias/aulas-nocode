import { C, badge, button, cursor, doc, field, icon, line, rect, selo, text } from '../lib.mjs';
import { lovableTopo, wrap } from './_comum.mjs';

// S15: editor do Lovable (plano Free) com o diálogo Publish aberto e NÃO confirmado.
const W = 1002;
const H = 678;

// editor ao fundo: chat à esquerda, preview à direita
const chatW = 300;
const editor = [
  rect(0, 52, chatW, H - 52, { fill: C.panel }),
  line(chatW, 52, chatW, H),
  rect(16, 76, 268, 64, { r: 12, fill: C.hover }),
  text(30, 102, 'Troque o subtítulo por\n“Inscrições abertas até 15/11”', { size: 16, lh: 22 }),
  icon('Sparkles', 16, 164, 18, C.ink3),
  text(42, 178, 'Subtítulo atualizado.', { size: 16, fill: C.ink2 }),
  rect(16, H - 70, 268, 50, { r: 12, stroke: C.lineStrong, fill: C.panel }),
  text(30, H - 39, 'Pergunte ao Lovable…', { size: 16, fill: C.ink3 }),
  // preview do app
  rect(chatW + 24, 76, W - chatW - 48, H - 100, { r: 10, fill: C.panel, stroke: C.line }),
  text(chatW + 56, 140, 'Hackathon No-Code 2026', { size: 30, weight: 700 }),
  text(chatW + 56, 174, 'Inscrições abertas até 15/11', { size: 18, fill: C.ink2 }),
  ...[0, 1, 2].map((i) => rect(chatW + 56, 210 + i * 58, 340, 42, { r: 8, stroke: C.lineStrong, fill: C.panel })),
  rect(chatW + 56, 392, 200, 46, { r: 8, fill: '#7C3AED' }),
  rect(0, 52, W, H - 52, { fill: '#0B0E14', fo: 0.45 }),
].join('\n');

// popover do Publish, ancorado no botão
const px = W - 470;
const py = 60;
const pw = 456;
const ph = 470;
const aviso = wrap('Mudanças feitas depois NÃO vão ao ar sozinhas: é preciso publicar de novo.', 46);
const dialogo = [
  rect(px, py, pw, ph, { r: 14, fill: C.panel, stroke: C.line }),
  text(px + 24, py + 42, 'Publicar o app', { size: 22, weight: 700 }),
  icon('X', px + pw - 40, py + 24, 20, C.ink3),
  field(px + 24, py + 92, pw - 48, 'Endereço público', 'hackathon-lovable-ensaio.lovable.app', { size: 15, h: 40 }),
  text(px + 24, py + 166, 'Quem pode ver', { size: 14, weight: 520, fill: C.ink2 }),
  rect(px + 24, py + 176, pw - 48, 40, { r: 7, stroke: C.lineStrong, fill: C.panel }),
  icon('Globe', px + 36, py + 187, 18, C.ink2),
  text(px + 62, py + 202, 'Qualquer pessoa com o link', { size: 16 }),
  icon('ChevronDown', px + pw - 52, py + 188, 16, C.ink3),
  rect(px + 24, py + 236, pw - 48, 74, { r: 10, fill: C.amberBg }),
  icon('Info', px + 38, py + 250, 18, C.amber),
  text(px + 64, py + 266, aviso, { size: 15, fill: C.ink, lh: 21 }),
  icon('Lock', px + 24, py + 336, 18, C.ink3),
  text(px + 50, py + 351, 'Domínio próprio', { size: 16, fill: C.ink2 }),
  badge(px + 190, py + 334, 'Plano pago', { size: 13, fill: C.hover, ink: C.ink2 }),
  line(px, py + 384, px + pw, py + 384),
  button(px + 24, py + 404, 'Cancelar', { tipo: 'secundario', size: 16, h: 44, w: 130 }),
  button(px + pw - 184, py + 404, 'Publish', { size: 16, h: 44, w: 160, cor: C.ink, icone: 'Rocket' }),
  cursor(px + 112, py + 432),
].join('\n');

export default {
  arquivo: 'media/aula-04/tela-lovable-publish-dialog.svg',
  svg: doc(W, H, [lovableTopo(W, { publishFoco: true }), editor, dialogo, selo(W, H)].join('\n')),
};
