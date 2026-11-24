import { doc, selo, text } from '../lib.mjs';
import { sArrow, sImagem, sLine, sRect } from './_comum.mjs';

// S53, passo 3: wireframe celular (ajuste 'conter'). Marcador (50,30): o formulário que sobe.
const W = 1280;
const H = 800;
const ink = '#1E1E1E';
const nota = '#E03131';
const x0 = 480;
const fw = 320;
const L = x0 + 24;
const cw = fw - 48;

const svg = [
  text(x0, 42, 'Celular', { size: 20, fill: '#6B6B6B' }),
  sRect(x0, 56, fw, 724, { seed: 5 }),
  sRect(L, 80, 20, 20, { seed: 6 }),
  text(L + 30, 97, 'Hackathon No-Code 2026', { size: 16, weight: 600, fill: ink }),
  sLine(x0 + 10, 116, x0 + fw - 10, 116, { seed: 7, sw: 1.5 }),
  text(L, 160, 'Crie seu primeiro', { size: 28, weight: 700, fill: ink }),
  text(L, 194, 'app sem programar', { size: 28, weight: 700, fill: ink }),
  text(L, 224, 'Online e gratuito · 21 e 22/11', { size: 17, fill: '#444' }),
  ...['Nome', 'E-mail', 'Telefone'].map((r, i) => text(L, 266 + i * 66, r, { size: 17, fill: ink }) + sRect(L, 274 + i * 66, cw, 36, { seed: 12 + i })),
  sRect(L, 476, cw, 50, { seed: 22, fill: '#1E1E1E' }),
  text(x0 + fw / 2, 508, 'Quero minha vaga', { size: 19, weight: 650, fill: '#FFFFFF', anchor: 'middle' }),
  sImagem(L, 552, cw, 120, { seed: 32 }),
  ...['Online', 'Grátis', 'Iniciantes'].map((t, i) => sRect(L + i * 92, 692, 84, 60, { seed: 42 + i }) + text(L + 42 + i * 92, 728, t, { size: 15, fill: ink, anchor: 'middle' })),
  // anotações
  text(110, 360, 'o formulário sobe:', { size: 21, fill: nota }),
  text(110, 388, 'a ação vem antes', { size: 21, fill: nota }),
  text(110, 416, 'da imagem', { size: 21, fill: nota }),
  sArrow(300, 380, 490, 360, { seed: 70, cor: nota, sw: 1.8 }),
  text(840, 610, 'imagem e destaques', { size: 21, fill: nota }),
  text(840, 638, 'descem', { size: 21, fill: nota }),
  sArrow(836, 620, 790, 640, { seed: 71, cor: nota, sw: 1.8, ponta: 12 }),
  text(840, 494, 'botão na largura toda', { size: 21, fill: nota }),
  sArrow(836, 488, 790, 498, { seed: 72, cor: nota, sw: 1.8, ponta: 12 }),
  selo(W, H),
].join('\n');

export default { arquivo: 'media/aula-01/tela-wireframe-hackathon-mobile.svg', svg: doc(W, H, svg, { fundo: '#FFFFFF' }) };
