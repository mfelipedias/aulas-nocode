import { C, badge, button, circle, doc, icon, line, rect, selo, text, toggle } from '../lib.mjs';
import { grade } from './_comum.mjs';

// S50: o mesmo fluxo no n8n — Webhook → Google Sheets (Append Row) → Gmail, depois de uma execução de teste.
// Nós centrados em x = 20%, 50%, 80% e y = 48% (marcadores do slide); botão "AI Agent" perto de (86%, 14%).
const W = 1280;
const H = 800;
const N = 124; // lado do nó
const y = Math.round(H * 0.48);
const xs = [0.2, 0.5, 0.8].map((p) => Math.round(W * p));
const LARANJA = '#FF6D5A';

function no(cx, { icone, cor, titulo, sub, gatilho = false }) {
  const x = cx - N / 2;
  const t = y - N / 2;
  const out = [];
  if (gatilho) {
    // nós de gatilho do n8n: lado esquerdo arredondado e um raio à esquerda
    out.push(`<path d="M${x + N / 2} ${t} H${x + N - 14} Q${x + N} ${t} ${x + N} ${t + 14} V${t + N - 14} Q${x + N} ${t + N} ${x + N - 14} ${t + N} H${x + N / 2} A${N / 2} ${N / 2} 0 0 1 ${x + N / 2} ${t} Z" fill="${C.panel}" stroke="#9AA1B0" stroke-width="2.5"/>`);
    out.push(icon('Zap', x - 34, y - 13, 26, LARANJA, 2.4));
  } else {
    out.push(rect(x, t, N, N, { r: 14, fill: C.panel, stroke: '#9AA1B0', sw: 2.5 }));
    out.push(circle(x, y, 7, { fill: '#9AA1B0' }));
  }
  out.push(circle(x + N, y, 7, { fill: '#9AA1B0' }));
  out.push(rect(cx - 34, y - 34, 68, 68, { r: 16, fill: cor, fo: 0.14 }));
  out.push(icon(icone, cx - 24, y - 24, 48, cor, 2.2));
  // executado com sucesso
  out.push(circle(x + N - 16, t + N - 16, 13, { fill: C.green }));
  out.push(icon('Check', x + N - 25, t + N - 25, 18, '#FFFFFF', 3));
  out.push(text(cx, t + N + 36, titulo, { size: 24, weight: 650, anchor: 'middle' }));
  out.push(text(cx, t + N + 64, sub, { size: 20, anchor: 'middle', fill: C.ink2 }));
  return out.join('\n');
}

function ligacao(x1, x2) {
  const m = (x1 + x2) / 2;
  return [
    line(x1, y, x2 - 10, y, { stroke: '#9AA1B0', sw: 2.5 }),
    `<path d="M${x2 - 14} ${y - 8} L${x2} ${y} L${x2 - 14} ${y + 8} Z" fill="#9AA1B0"/>`,
    text(m, y - 14, '1 item', { size: 18, weight: 560, anchor: 'middle', fill: C.green }),
  ].join('\n');
}

const topo = [
  rect(0, 0, W, 64, { fill: C.panel }),
  line(0, 64, W, 64),
  rect(18, 16, 32, 32, { r: 8, fill: '#EA4B71' }),
  text(34, 39, 'n', { size: 20, weight: 800, fill: '#FFFFFF', anchor: 'middle' }),
  text(66, 40, 'Personal  /', { size: 19, fill: C.ink3 }),
  text(178, 40, 'Hackathon — inscrição', { size: 20, weight: 650 }),
  rect(500, 14, 260, 36, { r: 8, fill: C.hover }),
  rect(504, 18, 120, 28, { r: 6, fill: C.panel }),
  text(564, 38, 'Editor', { size: 17, weight: 650, anchor: 'middle' }),
  text(692, 38, 'Executions', { size: 17, fill: C.ink2, anchor: 'middle' }),
  text(898, 40, 'Active', { size: 18, fill: C.ink2 }),
  toggle(962, 22, true, { cor: C.green }),
  button(1024, 13, 'Share', { tipo: 'secundario', size: 17, h: 38, w: 96 }),
  button(1132, 13, 'Saved', { tipo: 'secundario', size: 17, h: 38, w: 128, icone: 'Check' }),
].join('\n');

const flutuantes = [
  // botão de agentes (anotação "Próximo degrau: agentes")
  rect(1000, 88, 188, 46, { r: 23, fill: C.panel, stroke: '#C9B8FF', sw: 2 }),
  icon('Bot', 1016, 99, 24, C.violet),
  text(1050, 119, 'AI Agent', { size: 19, weight: 650, fill: C.violet }),
  icon('Sparkles', 1156, 101, 20, C.violet),
  rect(1200, 88, 46, 46, { r: 10, fill: C.panel, stroke: C.lineStrong }),
  icon('Plus', 1211, 99, 24, C.ink2),
].join('\n');

const rodape = [
  button(W / 2 - 130, H - 84, 'Execute workflow', { icone: 'FlaskConical', cor: LARANJA, size: 19, h: 48, w: 260 }),
  ...['ZoomIn', 'ZoomOut', 'Maximize'].map((n, i) => rect(24 + i * 50, H - 80, 42, 42, { r: 8, fill: C.panel, stroke: C.line }) + icon(n, 33 + i * 50, H - 71, 24, C.ink2)),
].join('\n');

const corpo = [
  grade(0, 64, W, H - 64, { fundo: '#F5F5F7', ponto: '#D2D4DA', passo: 22, id: 'g8' }),
  topo,
  flutuantes,
  ligacao(xs[0] + N / 2 + 8, xs[1] - N / 2 - 8),
  ligacao(xs[1] + N / 2 + 8, xs[2] - N / 2 - 8),
  no(xs[0], { icone: 'Webhook', cor: '#E8457A', titulo: 'Webhook', sub: 'POST · inscricao', gatilho: true }),
  no(xs[1], { icone: 'Table2', cor: '#1E9E5A', titulo: 'Google Sheets', sub: 'Append Row' }),
  no(xs[2], { icone: 'Mail', cor: '#D9483B', titulo: 'Gmail', sub: 'Send a message' }),
  rodape,
  selo(W, H),
].join('\n');

export default { arquivo: 'media/aula-03/tela-n8n-workflow.svg', svg: doc(W, H, corpo) };
