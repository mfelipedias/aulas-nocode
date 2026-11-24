import { circle, doc, icon, rect, text } from '../lib.mjs';
import { seloEscuro } from './_comum.mjs';

// S52: Excalidraw aberto, tema escuro, canvas vazio, zoom 125% (ponto de partida da demo).
const W = 1200;
const H = 812;
const bg = '#121212';
const ilha = '#232329';
const ink = '#E3E3E8';
const ink2 = '#A4A4B0';
const roxo = '#A8A5FF';

const ferramentas = ['Lock', 'Hand', 'MousePointer2', 'Square', 'Diamond', 'Circle', 'ArrowRight', 'Minus', 'Pencil', 'Type', 'Image', 'Eraser'];
const tx = 336;
const barra = [
  rect(tx, 18, ferramentas.length * 44 + 12, 52, { r: 10, fill: ilha }),
  ...ferramentas.map((n, i) => {
    const x = tx + 10 + i * 44;
    const ativo = n === 'MousePointer2';
    return (ativo ? rect(x - 2, 26, 38, 36, { r: 8, fill: '#403E6A' }) : '') + icon(n, x + 8, 34, 20, ativo ? roxo : ink);
  }),
].join('');

const svg = [
  // pontos discretos da grade
  ...Array.from({ length: 11 }, (_, i) => Array.from({ length: 7 }, (_, j) => circle(60 + i * 108, 120 + j * 100, 1.4, { fill: '#2C2C33' })).join('')),
  // menu e biblioteca
  rect(18, 18, 52, 52, { r: 10, fill: ilha }),
  icon('Menu', 32, 32, 24, ink),
  barra,
  rect(W - 200, 18, 112, 52, { r: 10, fill: '#A8A5FF' }),
  text(W - 144, 51, 'Share', { size: 18, weight: 600, fill: '#121212', anchor: 'middle' }),
  rect(W - 76, 18, 58, 52, { r: 10, fill: ilha }),
  icon('BookOpen', W - 59, 32, 24, ink),
  // tela de boas-vindas (canvas vazio)
  text(W / 2, 330, 'Excalidraw', { size: 52, weight: 700, fill: roxo, anchor: 'middle' }),
  text(W / 2, 376, 'Seus desenhos ficam salvos no próprio navegador.', { size: 20, fill: ink2, anchor: 'middle' }),
  ...[
    ['FolderOpen', 'Abrir', 'Ctrl+O'],
    ['CircleHelp', 'Ajuda', '?'],
    ['Users', 'Colaboração ao vivo', ''],
  ].map(([ic, t, k], i) => {
    const y = 420 + i * 56;
    return rect(W / 2 - 200, y, 400, 46, { r: 8, fill: '#1B1B20' }) + icon(ic, W / 2 - 180, y + 13, 20, ink2) + text(W / 2 - 146, y + 30, t, { size: 18, fill: ink }) + text(W / 2 + 180, y + 30, k, { size: 16, fill: ink2, anchor: 'end' });
  }),
  // dicas
  text(tx + 60, 128, 'Escolha uma ferramenta e', { size: 19, fill: ink2, italic: true }),
  text(tx + 60, 154, 'comece a desenhar!', { size: 19, fill: ink2, italic: true }),
  `<path d="M${tx + 40} 140 q-30 -20 -16 -60" fill="none" stroke="${ink2}" stroke-width="2" stroke-linecap="round"/>`,
  // rodapé: zoom 125%, desfazer/refazer
  rect(18, H - 70, 174, 52, { r: 10, fill: ilha }),
  icon('Minus', 34, H - 54, 20, ink),
  text(105, H - 37, '125%', { size: 18, weight: 600, fill: ink, anchor: 'middle' }),
  icon('Plus', 156, H - 54, 20, ink),
  rect(206, H - 70, 104, 52, { r: 10, fill: ilha }),
  icon('Undo2', 222, H - 54, 20, ink),
  icon('Redo2', 270, H - 54, 20, '#5C5C66'),
  seloEscuro(W, H),
].join('\n');

export default { arquivo: 'media/aula-01/tela-excalidraw-vazio.svg', svg: doc(W, H, svg, { fundo: bg }) };
