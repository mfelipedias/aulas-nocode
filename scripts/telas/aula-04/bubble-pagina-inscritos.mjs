import { C, badge, doc, icon, line, rect, selo, text } from '../lib.mjs';

// S20: a página "inscritos" do app (Bubble, /version-test) aberta numa aba anônima, com o DevTools
// (aba Network) mostrando a resposta da busca msearch: a tela mostra só o primeiro nome, mas o servidor
// manda nome, e-mail e telefone de todos. Dados fictícios (example.com, DDD 00).
const W = 1002;
const H = 678;
const ROXO = '#4F46E5';

const nomes = ['Camila', 'Rafael', 'Beatriz', 'João', 'Larissa', 'Marcos', 'Ana', 'Pedro', 'Júlia', 'Diego', 'Sofia'];

const pagina = [
  rect(0, 0, W, 50, { fill: C.panel }),
  line(0, 50, W, 50),
  rect(24, 11, 28, 28, { r: 7, fill: ROXO }),
  text(38, 31, 'H', { size: 16, weight: 700, fill: '#FFFFFF', anchor: 'middle' }),
  text(62, 31, 'Hackathon No-Code 2026', { size: 17, weight: 600 }),
  badge(W - 160, 13, 'Aba anônima', { size: 13, icone: 'EyeOff', fill: C.hover, ink: C.ink2 }),
  text(24, 92, 'Quem já garantiu a vaga', { size: 24, weight: 700 }),
  text(24, 120, '20 pessoas inscritas. Falta você!', { size: 16, fill: C.ink2 }),
  ...nomes.map((n, i) => {
    const col = i % 6;
    const row = Math.floor(i / 6);
    return badge(24 + col * 120, 140 + row * 44, n, { size: 16, fill: '#EEF0FF', ink: ROXO, w: 108 });
  }),
  badge(24 + 5 * 120, 184, '+9', { size: 16, fill: C.hover, ink: C.ink2, w: 108 }),
].join('\n');

// DevTools encaixado embaixo
const dy = 244;
const DT = '#FFFFFF';
const reqW = 250;
const json = [
  ['▾ 0:', C.ink2, 0],
  ['nome: ', C.violet, 1, '"Camila Persona"', C.ink],
  ['email: ', C.violet, 1, '"camila.persona@example.com"', C.red, true],
  ['telefone: ', C.violet, 1, '"(00) 90000-0001"', C.red, true],
  ['trilha: ', C.violet, 1, '"IA"', C.ink],
  ['▸ 1: {nome: "Rafael Teste", email: "rafael…', C.ink2, 0],
  ['▸ 2: {nome: "Beatriz Teste", email: "beatr…', C.ink2, 0],
];
const jx = reqW + 20;
const devtools = [
  rect(0, dy, W, H - dy, { fill: DT }),
  line(0, dy, W, dy, { stroke: C.lineStrong, sw: 2 }),
  rect(0, dy, W, 40, { fill: C.bg }),
  ...['Elements', 'Console', 'Network', 'Application'].map((t, i) => {
    const on = t === 'Network';
    return text(20 + i * 112, dy + 26, t, { size: 15, weight: on ? 600 : 400, fill: on ? C.blue : C.ink2 }) + (on ? rect(16 + i * 112, dy + 37, 80, 3, { fill: C.blue }) : '');
  }),
  line(0, dy + 40, W, dy + 40),
  // lista de requisições
  line(reqW, dy + 40, reqW, H),
  text(16, dy + 66, 'Nome', { size: 14, weight: 600, fill: C.ink3 }),
  ...['inscritos', 'msearch', 'run.js', 'logo.svg'].map((t, i) => {
    const on = t === 'msearch';
    const y = dy + 80 + i * 36;
    return (on ? rect(0, y, reqW, 36, { fill: '#E8EEFF' }) : '') + icon(on ? 'FileJson' : 'File', 16, y + 9, 18, on ? C.blue : C.ink3) + text(42, y + 24, t, { size: 16, weight: on ? 600 : 400, fill: on ? C.ink : C.ink2 });
  }),
  // painel de resposta
  ...['Headers', 'Preview', 'Response'].map((t, i) => {
    const on = t === 'Preview';
    return text(jx + i * 96, dy + 66, t, { size: 15, weight: on ? 600 : 400, fill: on ? C.ink : C.ink3 });
  }),
  rect(jx + 96, dy + 72, 62, 2, { fill: C.blue }),
  text(jx, dy + 104, '▾ hits: Array(20)', { size: 16, mono: true, fill: C.ink }),
  ...json.map(([a, ca, ind, b, cb, alerta], i) => {
    const y = dy + 134 + i * 30;
    const x = jx + 20 + ind * 28;
    return (
      (alerta ? rect(x - 8, y - 21, 446, 28, { r: 4, fill: C.redBg }) : '') +
      text(x, y, a, { size: 16, mono: true, fill: ca }) +
      (b ? text(x + a.length * 9.6, y, b, { size: 16, mono: true, fill: cb, weight: alerta ? 600 : 400 }) : '')
    );
  }),
].join('\n');

export default {
  arquivo: 'media/aula-04/tela-bubble-pagina-inscritos.svg',
  svg: doc(W, H, [pagina, devtools, selo(W, H)].join('\n'), { fundo: C.bg }),
};
