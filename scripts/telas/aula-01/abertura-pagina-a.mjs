import { C, button, circle, doc, field, icon, rect, selo, text } from '../lib.mjs';

// S01 e S02: página A, gerada a partir de "Crie uma landing page para um evento."
// Tudo genérico: título, botão "Saiba mais", menu, números e local inventados, campos que não pedimos.
const W = 1280;
const H = 800;
const roxo = '#6D3BEA';

const svg = [
  `<defs><linearGradient id="ga" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7B2FF7"/><stop offset="1" stop-color="#E0479E"/></linearGradient></defs>`,
  rect(0, 0, W, 470, { fill: 'url(#ga)' }),
  // menu completo (a página tem vários objetivos)
  icon('Zap', 56, 30, 26, '#FFFFFF'),
  text(92, 52, 'EventoX', { size: 24, weight: 750, fill: '#FFFFFF' }),
  ...[['Início', 470], ['Sobre', 558], ['Palestrantes', 652], ['Ingressos', 798], ['Contato', 922]].map(([t, x]) => text(x, 51, t, { size: 18, fill: '#F1E8FF' })),
  rect(1064, 26, 168, 42, { r: 21, fill: '#FFFFFF' }),
  text(1148, 53, 'Comprar ingresso', { size: 17, weight: 600, fill: roxo, anchor: 'middle' }),
  // herói genérico
  rect(440, 112, 400, 38, { r: 19, fill: '#FFFFFF', fo: 0.18 }),
  text(640, 138, '15 a 17 de março · São Paulo', { size: 18, fill: '#FFFFFF', anchor: 'middle' }),
  text(640, 220, 'O Maior Evento de', { size: 56, weight: 780, fill: '#FFFFFF', anchor: 'middle' }),
  text(640, 288, 'Inovação do Ano', { size: 56, weight: 780, fill: '#FFFFFF', anchor: 'middle' }),
  text(640, 340, 'Conecte-se com líderes, aprenda com especialistas e transforme sua carreira.', { size: 21, fill: '#F1E8FF', anchor: 'middle' }),
  rect(460, 376, 170, 54, { r: 27, fill: '#FFFFFF' }),
  text(545, 410, 'Saiba mais', { size: 20, weight: 650, fill: roxo, anchor: 'middle' }),
  rect(650, 376, 170, 54, { r: 27, stroke: '#FFFFFF', sw: 2 }),
  text(735, 410, 'Ver agenda', { size: 20, weight: 600, fill: '#FFFFFF', anchor: 'middle' }),
  // números inventados
  ...[
    ['+10.000', 'participantes'],
    ['50', 'palestrantes'],
    ['3 dias', 'de conteúdo'],
  ].map(([n, r], i) => text(260 + i * 380, 540, n, { size: 40, weight: 760, fill: roxo, anchor: 'middle' }) + text(260 + i * 380, 572, r, { size: 18, fill: C.ink2, anchor: 'middle' })),
  // formulário que não pedimos
  rect(56, 610, W - 112, 160, { r: 16, fill: '#F4EEFF' }),
  text(96, 660, 'Fique por dentro', { size: 26, weight: 700 }),
  text(96, 694, 'Receba novidades do evento.', { size: 18, fill: C.ink2 }),
  field(470, 646, 250, '', '', { placeholder: 'Empresa', size: 18, h: 50 }),
  field(736, 646, 250, '', '', { placeholder: 'Cargo', size: 18, h: 50 }),
  button(1002, 646, 'Enviar', { size: 18, h: 50, w: 180, cor: roxo }),
  selo(W, H),
].join('\n');

export default { arquivo: 'media/aula-01/tela-abertura-pagina-a.svg', svg: doc(W, H, svg, { fundo: '#FFFFFF' }) };
