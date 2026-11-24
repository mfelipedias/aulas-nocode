import { C, doc, icon, rect, selo, text } from '../lib.mjs';
import { etiqueta, topo, trilho } from './_comum.mjs';

// S26 (moldura 1002x678) e S27 (636x398, corta o rodapé): a página index no editor, aba Design.
// Inputs renomeados, dropdown Trilha ligado ao option set, botão e texto de confirmação oculto.
// Na S27 o marcador 2 fica em (50%, 55%) e o 3 em (50%, 85%) da área visível (960x600): botão ~ y 510.
const W = 960;
const H = 650;
const RAIL = 64;

const x0 = RAIL + 40;
const fw = 440;
const linha = (y, nome, ph, seta = false) =>
  [
    rect(x0, y, fw, 46, { r: 8, stroke: C.lineStrong, fill: C.panel }),
    text(x0 + 16, y + 31, ph, { size: 21, fill: C.ink3 }),
    seta ? icon('ChevronDown', x0 + fw - 38, y + 12, 22, C.ink2) : '',
    etiqueta(x0, y - 2, nome, 15),
  ].join('');

const pagina = [
  rect(RAIL + 16, 72, W - RAIL - 32, H - 88, { r: 4, fill: C.panel, stroke: C.line }),
  text(x0, 136, 'Hackathon No-Code 2026', { size: 36, weight: 750 }),
  text(x0, 176, '15 a 17 de novembro · 120 vagas', { size: 21, fill: C.ink2 }),
  linha(228, 'Input Nome', 'Nome completo'),
  linha(304, 'Input E-mail', 'E-mail'),
  linha(380, 'Input Telefone', 'Telefone'),
  linha(456, 'Dropdown Trilha', 'Escolha a trilha', true),
  rect(x0, 520, fw, 56, { r: 10, fill: C.blue }),
  text(x0 + fw / 2, 557, 'Quero minha vaga', { size: 23, weight: 650, fill: '#FFFFFF', anchor: 'middle' }),
  // texto de confirmação, oculto ao carregar (Visible on page load desligado)
  rect(x0, 596, fw, 36, { r: 6, stroke: C.ink3, dash: '5 4' }),
  icon('EyeOff', x0 + 10, 604, 20, C.ink3),
  text(x0 + 40, 621, 'Texto confirmacao (oculto)', { size: 18, fill: C.ink3 }),
  // imagem do evento
  rect(x0 + fw + 36, 228, W - RAIL - 32 - 40 - fw - 36 - 24, 348, { r: 14, fill: '#E8EDFF' }),
  icon('Image', x0 + fw + 36 + 92, 375, 48, '#8EA2E8'),
];

export default {
  arquivo: 'media/aula-02/tela-bubble-index-design.svg',
  svg: doc(W, H, [rect(0, 0, W, H, { fill: '#EEF0F4' }), ...pagina, trilho(H, 'Design', { y0: 52, w: RAIL, passo: 64, primeiro: 40, rotulos: false, ic: 24, ate: 5 }), topo(W, { h: 52, s: 17 }), selo(W, H)].join('\n')),
};
