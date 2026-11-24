import { doc, rect, selo, text } from '../lib.mjs';
import { sArrow, sImagem, sLine, sRect } from './_comum.mjs';

// S53 (e anexo do prompt B em S57/S58): wireframe desktop no estilo Excalidraw.
// Marcadores de S53 (em %): Hierarquia (10,30) no título/apoio; Um único objetivo (40,70) junto ao botão.
const W = 1280;
const H = 800;
const ink = '#1E1E1E';
const nota = '#E03131';

const svg = [
  text(40, 46, 'Desktop', { size: 20, fill: '#6B6B6B' }),
  sRect(40, 60, 1200, 712, { seed: 1 }),
  // cabeçalho sem menu
  sRect(80, 92, 26, 26, { seed: 2 }),
  text(120, 113, 'Hackathon No-Code 2026', { size: 20, weight: 600, fill: ink }),
  sLine(60, 140, 1220, 140, { seed: 3, sw: 1.5 }),
  // título e apoio com texto real
  text(80, 212, 'Crie seu primeiro app', { size: 42, weight: 700, fill: ink }),
  text(80, 262, 'sem programar', { size: 42, weight: 700, fill: ink }),
  text(80, 304, 'Online e gratuito · 21 e 22 de novembro', { size: 22, fill: '#444' }),
  // formulário
  ...['Nome', 'E-mail', 'Telefone'].map((r, i) => text(80, 336 + i * 70, r, { size: 19, fill: ink }) + sRect(80, 346 + i * 70, 440, 42, { seed: 10 + i })),
  sRect(80, 552, 440, 58, { seed: 20, fill: '#1E1E1E' }),
  text(300, 589, 'Quero minha vaga', { size: 22, weight: 650, fill: '#FFFFFF', anchor: 'middle' }),
  // imagem e destaques
  sImagem(680, 172, 500, 290, { seed: 30 }),
  rect(842, 300, 176, 34, { fill: '#FFFFFF' }),
  text(930, 324, 'imagem do evento', { size: 18, fill: '#6B6B6B', anchor: 'middle' }),
  ...['100% online', 'Gratuito', 'Para iniciantes'].map((t, i) => sRect(680 + i * 172, 496, 156, 84, { seed: 40 + i }) + text(758 + i * 172, 545, t, { size: 18, fill: ink, anchor: 'middle' })),
  // rodapé
  sLine(60, 712, 1220, 712, { seed: 50, sw: 1.5 }),
  text(80, 748, 'Organização · contato · privacidade', { size: 17, fill: '#6B6B6B' }),
  // anotações de intenção (outra cor)
  text(700, 112, 'sem menu: um único objetivo', { size: 19, fill: nota }),
  sArrow(694, 106, 620, 108, { seed: 60, cor: nota, sw: 1.8 }),
  text(620, 592, 'diz o que a pessoa ganha', { size: 19, fill: nota }),
  sArrow(614, 586, 530, 582, { seed: 61, cor: nota, sw: 1.8, ponta: 12 }),
  text(620, 622, 'depois do clique: “Inscrição recebida!”', { size: 19, fill: nota }),
  selo(W, H),
].join('\n');

export default { arquivo: 'media/aula-01/tela-wireframe-hackathon-desktop.svg', svg: doc(W, H, svg, { fundo: '#FFFFFF' }) };
