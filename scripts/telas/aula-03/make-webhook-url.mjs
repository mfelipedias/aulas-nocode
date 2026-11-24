import { C, button, doc, icon, line, rect, selo, text } from '../lib.mjs';
import { MK, grade, moduloMake, rodapeMake, topoMake } from './_comum.mjs';

// S27: primeiro passo da demo — Custom webhook "hackathon-inscricao" criado, endereço pronto para copiar
// e estrutura de dados já determinada pelo teste no navegador. O endereço aparece mascarado (nunca vai para o deck).
const W = 1200;
const H = 772;
const cy = 360;

// diálogo do módulo
const px = 360;
const py = 84;
const pw = 800;
const ph = 532;
const dialogo = [
  `<rect x="${px}" y="${py + 4}" width="${pw}" height="${ph}" rx="16" fill="#000" fill-opacity="0.05"/>`,
  rect(px, py, pw, ph, { r: 16, fill: C.panel, stroke: C.line }),
  rect(px, py, pw, 64, { r: 16, fill: MK.webhook }),
  rect(px, py + 40, pw, 24, { fill: MK.webhook }),
  icon('Webhook', px + 24, py + 18, 28, '#FFFFFF'),
  text(px + 66, py + 41, 'Webhooks', { size: 24, weight: 700, fill: '#FFFFFF' }),
  icon('X', px + pw - 46, py + 20, 24, '#FFFFFF'),
  // campo Webhook
  text(px + 32, py + 104, 'Webhook', { size: 21, weight: 650 }),
  rect(px + 32, py + 120, 560, 52, { r: 8, fill: C.field, stroke: C.lineStrong }),
  text(px + 50, py + 154, 'hackathon-inscricao', { size: 22 }),
  icon('ChevronDown', px + 556, py + 134, 24, C.ink3),
  button(px + 608, py + 120, 'Add', { tipo: 'secundario', size: 21, h: 52, w: 160 }),
  // endereço
  rect(px + 32, py + 196, pw - 64, 64, { r: 10, fill: MK.roxoBg }),
  icon('Link', px + 50, py + 216, 24, MK.roxo),
  text(px + 88, py + 237, 'https://hook.us2.make.com/••••••••••••••••', { size: 22, mono: true, fill: C.ink }),
  button(px + 32, py + 276, 'Copy address to clipboard', { icone: 'Copy', cor: MK.roxo, size: 21, h: 52, w: 360 }),
  // estado: estrutura determinada
  line(px + 32, py + 350, px + pw - 32, py + 350),
  icon('CircleCheck', px + 32, py + 368, 30, C.green),
  text(px + 76, py + 392, 'Successfully determined.', { size: 23, weight: 650, fill: C.green }),
  text(px + 76, py + 426, 'Campos aprendidos: nome, email, telefone, trilha, ideia', { size: 20, fill: C.ink2 }),
  button(px + pw - 304, py + ph - 76, 'Cancel', { tipo: 'secundario', size: 21, h: 52, w: 130 }),
  button(px + pw - 160, py + ph - 76, 'Save', { cor: MK.roxo, size: 21, h: 52, w: 128 }),
].join('\n');

const corpo = [
  grade(0, 60, W, H - 136),
  topoMake(W, 'Hackathon — inscricao', { size: 21 }),
  moduloMake(170, cy, 76, { cor: MK.webhook, icone: 'Webhook', titulo: 'Webhooks', sub: 'Custom webhook', num: 1, gatilho: true, size: 24 }),
  dialogo,
  rodapeMake(W, H, { size: 20, ligado: false }),
  selo(W, H - 76),
].join('\n');

export default { arquivo: 'media/aula-03/tela-make-webhook-url.svg', svg: doc(W, H, corpo) };
