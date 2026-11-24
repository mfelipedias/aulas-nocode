import { C, badge, doc, line, rect, selo, text } from '../lib.mjs';
import { MK, grade, moduloMake } from './_comum.mjs';

// S33 (direita): History do cenário no Make — a execução do Davi chegou e os três módulos ficaram verdes.
// Quadro pequeno no slide (≈ 636 px de largura): texto grande de propósito.
const W = 960;
const H = 600;

const corpo = [
  rect(0, 0, W, 76, { fill: C.panel }),
  line(0, 76, W, 76),
  rect(24, 20, 36, 36, { r: 9, fill: MK.roxo }),
  text(42, 46, 'M', { size: 22, weight: 800, fill: '#FFFFFF', anchor: 'middle' }),
  text(80, 49, 'Diagram', { size: 26, fill: C.ink3 }),
  text(206, 49, 'History', { size: 26, weight: 650, fill: MK.roxo }),
  rect(196, 72, 116, 4, { fill: MK.roxo }),
  // execução mais recente
  rect(16, 92, W - 32, 74, { r: 10, fill: MK.roxoBg, stroke: MK.roxo, sw: 2 }),
  text(36, 138, '26/10 19:41', { size: 24, mono: true, fill: C.ink2 }),
  badge(230, 110, 'Success', { size: 20, fill: C.green, ink: '#FFFFFF', icone: 'Check' }),
  text(400, 138, '3 operações', { size: 24, weight: 600 }),
  text(W - 40, 138, '1,2 s', { size: 24, fill: C.ink2, anchor: 'end' }),
  // diagrama da execução
  grade(16, 182, W - 32, 400, { id: 'gh' }),
  ...[
    [190, MK.webhook, 'Webhook', 'Webhook'],
    [480, MK.sheets, 'Table2', 'Sheets'],
    [770, MK.gmail, 'Mail', 'Gmail'],
  ].map(([x, cor, ic, t], i, a) =>
    (i < a.length - 1 ? line(x + 62, 330, a[i + 1][0] - 62, 330, { stroke: '#BFC3CF', sw: 6, dash: '0.1 12' }) : '') +
    moduloMake(x, 330, 62, { cor, icone: ic, titulo: t, ok: true, size: 28 }),
  ),
  text(W / 2, 500, 'Bundle: Davi Amostra · trilha IA', { size: 24, fill: C.ink2, anchor: 'middle' }),
  selo(W, H),
].join('\n');

export default { arquivo: 'media/aula-03/tela-make-history.svg', svg: doc(W, H, corpo, { fundo: C.panel }) };
