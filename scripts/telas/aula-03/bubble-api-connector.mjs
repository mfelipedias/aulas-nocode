import { C, button, checkbox, doc, icon, line, rect, selo, text } from '../lib.mjs';
import { topoBubble } from './_comum.mjs';

// S32: API Connector do Bubble com a chamada "nova_inscricao" (POST, JSON) para o webhook do Make.
// Endereço mascarado; parâmetros com Private desmarcado; ideia sem aspas (vai "formatted as JSON-safe").
const W = 1200;
const H = 772;

function campo(x, y, w, rotulo, valor, o = {}) {
  return [
    rotulo ? text(x, y - 10, rotulo, { size: 18, weight: 600, fill: C.ink2 }) : '',
    rect(x, y, w, 46, { r: 7, fill: C.field, stroke: C.lineStrong }),
    text(x + 12, y + 30, valor, { size: o.size ?? 20, mono: o.mono, weight: o.weight }),
    o.menu ? icon('ChevronDown', x + w - 30, y + 13, 20, C.ink3) : '',
  ].join('');
}

const lateral = [
  rect(0, 60, 230, H - 60, { fill: C.panel }),
  line(230, 60, 230, H),
  text(20, 100, 'Installed plugins', { size: 18, weight: 650, fill: C.ink3 }),
  rect(10, 116, 210, 46, { r: 8, fill: '#E8EEFF' }),
  icon('Plug', 22, 128, 22, C.blue),
  text(54, 146, 'API Connector', { size: 20, weight: 650, fill: C.blue }),
  icon('Puzzle', 22, 186, 22, C.ink3),
  text(54, 204, 'Toolbox', { size: 20, fill: C.ink2 }),
  button(20, 250, 'Add plugins', { tipo: 'secundario', icone: 'Plus', size: 18, h: 42, w: 190 }),
].join('\n');

const X = 260;
const R = 1176;
const corpo = [
  rect(0, 0, W, H, { fill: C.bg }),
  lateral,
  text(X, 96, 'API Connector', { size: 26, weight: 700 }),
  button(R - 230, 70, 'Add another API', { tipo: 'secundario', icone: 'Plus', size: 18, h: 40, w: 230 }),
  // API "Make"
  rect(X, 114, R - X, 56, { r: 10, fill: C.panel, stroke: C.line }),
  text(X + 18, 150, 'API Name', { size: 18, fill: C.ink3 }),
  text(X + 112, 150, 'Make', { size: 22, weight: 700 }),
  text(X + 230, 150, 'Authentication', { size: 18, fill: C.ink3 }),
  text(X + 364, 150, 'None or self-handled', { size: 20 }),
  // chamada
  rect(X, 184, R - X, 548, { r: 10, fill: C.panel, stroke: C.blue, sw: 2 }),
  campo(X + 20, 226, 270, 'Name', 'nova_inscricao', { weight: 650 }),
  campo(X + 310, 226, 180, 'Use as', 'Action', { menu: true }),
  campo(X + 510, 226, 170, 'Data type', 'Text', { menu: true }),
  campo(X + 700, 226, 196, 'Body type', 'JSON', { menu: true }),
  campo(X + 20, 296, 130, '', 'POST', { menu: true, weight: 700 }),
  campo(X + 160, 296, R - X - 180, '', 'https://hook.us2.make.com/••••••••••••', { mono: true }),
  // corpo JSON
  text(X + 20, 376, 'Body (JSON object)', { size: 18, weight: 600, fill: C.ink2 }),
  rect(X + 20, 388, 470, 246, { r: 8, fill: '#F8F9FB', stroke: C.lineStrong }),
  text(X + 36, 420, '{\n\u00A0\u00A0"nome": "<nome>",\n\u00A0\u00A0"email": "<email>",\n\u00A0\u00A0"telefone": "<telefone>",\n\u00A0\u00A0"trilha": "<trilha>",\n\u00A0\u00A0"ideia": <ideia>\n}', {
    size: 20,
    mono: true,
    lh: 32,
  }),
  // parâmetros
  text(X + 520, 376, 'Parameters', { size: 18, weight: 600, fill: C.ink2 }),
  ...['nome', 'email', 'telefone', 'trilha', 'ideia'].map((p, i) => {
    const y = 388 + i * 50;
    return [
      rect(X + 520, y, 200, 44, { r: 7, fill: C.field, stroke: C.line }),
      text(X + 534, y + 29, p, { size: 19, mono: true }),
      checkbox(X + 738, y + 13, false),
      text(X + 766, y + 29, 'Private', { size: 19, fill: C.ink2 }),
    ].join('');
  }),
  button(X + 20, 658, 'Initialize call', { size: 21, h: 52, w: 220 }),
  text(X + 260, 691, 'Resposta esperada: Accepted', { size: 19, fill: C.ink3 }),
  topoBubble(W, 'hackathon-aula03', { size: 16 }),
  selo(W, H),
].join('\n');

export default { arquivo: 'media/aula-03/tela-bubble-api-connector.svg', svg: doc(W, H, corpo) };
