import { C, circle, doc, icon, rect, selo, text } from '../lib.mjs';

// S59: página A no celular (prompt de uma linha). Marcador em (50,22): o título genérico.
const W = 390;
const H = 888;
const roxo = '#6D3BEA';

const svg = [
  `<defs><linearGradient id="gam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7B2FF7"/><stop offset="1" stop-color="#E0479E"/></linearGradient></defs>`,
  rect(0, 0, W, 520, { fill: 'url(#gam)' }),
  icon('Zap', 22, 52, 22, '#FFFFFF'),
  text(52, 71, 'EventoX', { size: 21, weight: 750, fill: '#FFFFFF' }),
  icon('Menu', 340, 50, 26, '#FFFFFF'),
  rect(22, 112, 268, 32, { r: 16, fill: '#FFFFFF', fo: 0.18 }),
  text(156, 134, '15 a 17 de março · São Paulo', { size: 15, fill: '#FFFFFF', anchor: 'middle' }),
  text(22, 200, 'O Maior Evento', { size: 38, weight: 780, fill: '#FFFFFF' }),
  text(22, 246, 'de Inovação', { size: 38, weight: 780, fill: '#FFFFFF' }),
  text(22, 292, 'do Ano', { size: 38, weight: 780, fill: '#FFFFFF' }),
  text(22, 336, 'Conecte-se com líderes, aprenda\ncom especialistas e transforme\nsua carreira.', { size: 18, fill: '#F1E8FF', lh: 25 }),
  rect(22, 420, 346, 52, { r: 26, fill: '#FFFFFF' }),
  text(195, 453, 'Saiba mais', { size: 19, weight: 650, fill: roxo, anchor: 'middle' }),
  ...[
    ['+10.000', 'participantes'],
    ['50', 'palestrantes'],
    ['3 dias', 'de conteúdo'],
  ].map(([n, r], i) => text(22, 572 + i * 76, n, { size: 34, weight: 760, fill: roxo }) + text(22, 598 + i * 76, r, { size: 17, fill: C.ink2 })),
  rect(0, 780, W, 108, { fill: '#F4EEFF' }),
  text(22, 820, 'Fique por dentro', { size: 21, weight: 700 }),
  rect(22, 836, 346, 40, { r: 8, fill: '#FFFFFF', stroke: C.lineStrong }),
  text(36, 862, 'Empresa', { size: 16, fill: C.ink3 }),
  selo(W, H),
].join('\n');

export default { arquivo: 'media/aula-01/tela-abertura-pagina-a-celular.svg', svg: doc(W, H, svg, { fundo: '#FFFFFF' }) };
