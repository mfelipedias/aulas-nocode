import { C, circle, doc, icon, rect, selo, text } from '../lib.mjs';
import { balaoUsuario, editorLovable, marcaLovable } from './_comum.mjs';

// S58, passo 2: o Lovable gerando a página a partir do prompt planejado e do wireframe.
const W = 1200;
const H = 812;

const u = balaoUsuario(88, ['Contexto: validar o Hackathon', 'No-Code 2026, online e gratuito…', 'Público: iniciantes, no celular.'], { anexo: 'wireframe-desktop.png' });
const ay = 88 + u.h + 30;
const passos = [
  ['ok', 'Estrutura do wireframe'],
  ['ok', 'Formulário: Nome, E-mail, Telefone'],
  ['vai', 'Cores e estilos (Tailwind)'],
  ['', 'Versão para celular'],
];
const msgs = [
  u.svg,
  rect(20, ay, 26, 26, { r: 7, fill: 'url(#lvg)' }),
  text(58, ay + 19, 'Vou criar a página de inscrição', { size: 17 }),
  text(58, ay + 43, 'seguindo o wireframe anexado.', { size: 17 }),
  ...passos.map(([st, t], i) => {
    const y = ay + 80 + i * 40;
    const ic = st === 'ok' ? icon('CircleCheck', 58, y - 15, 20, C.green) : st === 'vai' ? icon('LoaderCircle', 58, y - 15, 20, C.blue) : icon('Circle', 58, y - 15, 20, C.lineStrong);
    return ic + text(88, y, t, { size: 17, fill: st ? C.ink : C.ink3 });
  }),
];

const ed = editorLovable(W, H, { mensagens: msgs, creditos: '3 de 5' });
const { px, py, pw } = ed;
// preview em construção: esqueleto da página
const sx = px + 40;
const sw = pw - 80;
const prev = [
  rect(sx, py + 36, sw, 640, { r: 12, fill: '#1A1D24' }),
  rect(sx + 36, py + 76, 260, 18, { r: 9, fill: '#3A4150' }),
  rect(sx + 36, py + 128, 320, 30, { r: 8, fill: '#4A5262' }),
  rect(sx + 36, py + 170, 250, 30, { r: 8, fill: '#C6F432', fo: 0.55 }),
  rect(sx + 36, py + 222, 290, 14, { r: 7, fill: '#3A4150' }),
  ...[0, 1, 2].map((i) => rect(sx + 36, py + 270 + i * 64, 300, 42, { r: 8, fill: '#252A34', stroke: '#3A4150' })),
  rect(sx + 36, py + 470, 300, 48, { r: 10, fill: '#2F5BFF', fo: 0.6 }),
  rect(sx + 380, py + 128, sw - 416, 250, { r: 12, fill: '#252A34' }),
  // selo "gerando"
  rect(px + pw / 2 - 150, py + 560, 300, 54, { r: 27, fill: C.panel }),
  icon('LoaderCircle', px + pw / 2 - 124, py + 575, 24, C.blue),
  text(px + pw / 2 - 88, py + 594, 'Gerando a página…', { size: 19, weight: 600 }),
];

export default {
  arquivo: 'media/aula-01/tela-lovable-gerando.svg',
  svg: doc(W, H, [marcaLovable(-100, -100), ed.svg, ...prev, selo(W, H)].join('\n'), { fundo: C.panel }),
};
