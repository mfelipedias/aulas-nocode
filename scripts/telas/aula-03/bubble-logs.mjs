import { C, badge, doc, icon, line, rect, selo, text } from '../lib.mjs';

// S33 (esquerda): Server logs do Bubble depois da inscrição do Davi — a chamada ao Make saiu e voltou "Accepted".
// Quadro pequeno no slide (≈ 636 px de largura): texto grande de propósito.
const W = 960;
const H = 600;

const linhas = [
  ['19:41:07', 'Button "Quero minha vaga" clicked', null],
  ['19:41:07', 'Create a new Inscricao', null],
  ['19:41:08', 'Make - nova_inscricao (POST)', 'ok'],
  ['19:41:08', 'Workflow completed', null],
];

const corpo = [
  rect(0, 0, W, 76, { fill: C.panel }),
  line(0, 76, W, 76),
  rect(24, 20, 36, 36, { r: 9, fill: '#0C29AB' }),
  text(42, 47, 'b', { size: 25, weight: 700, fill: '#FFFFFF', anchor: 'middle' }),
  text(80, 49, 'Logs', { size: 28, weight: 700 }),
  text(170, 49, 'Server logs', { size: 26, weight: 650, fill: C.blue }),
  rect(160, 72, 168, 4, { fill: C.blue }),
  text(366, 49, 'App data', { size: 26, fill: C.ink3 }),
  // cabeçalho da lista
  text(32, 124, 'Hora', { size: 22, weight: 650, fill: C.ink3 }),
  text(180, 124, 'Evento', { size: 22, weight: 650, fill: C.ink3 }),
  ...linhas.map(([h, t, ok], i) => {
    const y = 144 + i * 84;
    return [
      ok ? rect(12, y + 4, W - 24, 76, { r: 10, fill: C.greenBg, stroke: C.green, sw: 2 }) : line(24, y + 84, W - 24, y + 84),
      text(32, y + 52, h, { size: 24, mono: true, fill: C.ink2 }),
      ok ? icon('Send', 180, y + 28, 26, C.green) : '',
      text(ok ? 218 : 180, y + 52, t, { size: 26, weight: ok ? 650 : 400 }),
      ok ? badge(W - 210, y + 22, '200 Accepted', { size: 20, fill: C.green, ink: '#FFFFFF' }) : '',
    ].join('');
  }),
  selo(W, H),
].join('\n');

export default { arquivo: 'media/aula-03/tela-bubble-logs.svg', svg: doc(W, H, corpo, { fundo: C.panel }) };
