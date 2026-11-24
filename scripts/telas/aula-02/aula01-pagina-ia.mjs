import { C, badge, button, circle, cursor, doc, field, icon, rect, selo, text } from '../lib.mjs';

// S01: a página de inscrição que a IA gerou na Aula 1 (a moldura do slide já mostra o navegador e a URL).
// Exporta também `paginaIA` para a variante "teste de envio" (aula01-teste-envio.mjs).
export const W = 1280;
export const H = 800;
const VIOLETA = '#6D4AFF';

export function paginaIA({ nome = '', email = '', telefone = '', clique = false } = {}) {
  const nav = [
    rect(0, 0, W, 72, { fill: '#FFFFFF' }),
    rect(0, 72, W, 1, { fill: C.line }),
    rect(48, 22, 28, 28, { r: 8, fill: VIOLETA }),
    icon('Zap', 54, 28, 16, '#FFFFFF'),
    text(88, 44, 'Hackathon No-Code 2026', { size: 20, weight: 650 }),
    ...['Trilhas', 'Agenda', 'Regulamento'].map((t, i) => text(860 + i * 130, 44, t, { size: 18, fill: C.ink2 })),
  ];
  const heroi = [
    circle(300, 560, 300, { fill: VIOLETA, fo: 0.06 }),
    badge(60, 130, '15 a 17 de novembro · online', { size: 16, fill: '#EFEBFF', ink: VIOLETA, icone: 'Calendar' }),
    text(60, 240, 'Hackathon\nNo-Code 2026', { size: 60, weight: 750, lh: 70, ls: -1 }),
    text(60, 370, '48 horas para tirar sua ideia\ndo papel, sem escrever código.', { size: 22, fill: C.ink2, lh: 32 }),
    ...[
      ['120', 'vagas'],
      ['4', 'trilhas'],
      ['48 h', 'de evento'],
    ].map(([n, r], i) => text(60 + i * 150, 490, n, { size: 36, weight: 700, fill: VIOLETA }) + text(60 + i * 150, 520, r, { size: 17, fill: C.ink2 })),
  ];
  const cx = 540;
  const cw = 690;
  const fw = cw - 80;
  const card = [
    rect(cx, 160, cw, 580, { r: 20, fill: '#FFFFFF', stroke: C.line }),
    text(cx + 40, 222, 'Garanta sua vaga', { size: 30, weight: 700 }),
    text(cx + 40, 256, 'Inscrição gratuita, vagas limitadas.', { size: 18, fill: C.ink2 }),
    field(cx + 40, 304, fw, 'Nome completo', nome, { size: 20, h: 52, placeholder: 'Seu nome' }),
    field(cx + 40, 394, fw, 'E-mail', email, { size: 20, h: 52, placeholder: 'voce@email.com' }),
    field(cx + 40, 484, fw, 'Telefone', telefone, { size: 20, h: 52, placeholder: '(11) 90000-0000' }),
    button(cx + 40, 574, 'Quero minha vaga', { size: 22, h: 64, w: fw, r: 12, cor: clique ? '#5534E0' : VIOLETA }),
    clique ? cursor(cx + 540, 612) : '',
  ];
  return [...nav, ...heroi, ...card].join('\n');
}

export default {
  arquivo: 'media/aula-02/tela-aula01-pagina-ia.svg',
  svg: doc(W, H, paginaIA() + selo(W, H), { fundo: '#FAF9FF' }),
};
