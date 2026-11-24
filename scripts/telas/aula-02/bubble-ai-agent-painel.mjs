import { C, badge, button, doc, icon, line, rect, selo, text } from '../lib.mjs';
import { topo, trilho } from './_comum.mjs';

// S52 (moldura 1002x678): o painel do Bubble AI Agent aberto pela varinha, no app irmão hackathon-agente.
// O agente responde ao Prompt 1 com um plano (campos e privacy rules) antes de aplicar.
// Repare: o plano não diz onde fica o limite de 4 membros (ponto para comentar na demo).
const W = 1280;
const H = 866;
const RAIL = 96;
const AX = 700; // início do painel do agente

const fundo = [
  rect(RAIL, 56, AX - RAIL, 46, { fill: C.panel }),
  line(RAIL, 102, AX, 102),
  ...['Data types', 'Option sets', 'Privacy', 'App data'].map((t, i) => {
    const x = RAIL + 24 + i * 150;
    return text(x, 86, t, { size: 18, weight: i === 0 ? 650 : 500, fill: i === 0 ? C.blue : C.ink2 }) + (i === 0 ? rect(x, 98, 92, 3, { r: 1.5, fill: C.blue }) : '');
  }),
  text(RAIL + 24, 146, 'DATA TYPES', { size: 14, weight: 650, fill: C.ink3, ls: 0.5 }),
  ...['Inscricao', 'User'].map((t, i) => rect(RAIL + 16, 162 + i * 66, 520, 54, { r: 10, fill: C.panel, stroke: C.line }) + icon('Table2', RAIL + 32, 177 + i * 66, 22, C.ink2) + text(RAIL + 66, 196 + i * 66, t, { size: 19, weight: 560 })),
  rect(RAIL + 16, 294, 520, 54, { r: 10, stroke: '#B9A8FF', dash: '6 5', sw: 1.5 }),
  icon('Sparkles', RAIL + 32, 309, 22, C.violet),
  text(RAIL + 66, 328, 'Equipe (proposto)', { size: 19, fill: C.violet }),
  text(RAIL + 24, 400, 'OPTION SETS', { size: 14, weight: 650, fill: C.ink3, ls: 0.5 }),
  rect(RAIL + 16, 416, 520, 54, { r: 10, fill: C.panel, stroke: C.line }),
  icon('Rows3', RAIL + 32, 431, 22, C.ink2),
  text(RAIL + 66, 450, 'Trilha', { size: 19, weight: 560 }),
];

// painel do agente (letras maiores: é o foco do slide)
const aw = W - AX;
const ax = AX + 24;
const linhas = (x, y, s, o) => text(x, y, s, { lh: 30, size: 20, ...o });
const agente = [
  rect(AX, 56, aw, H - 56, { fill: C.panel }),
  line(AX, 56, AX, H, { stroke: C.lineStrong }),
  icon('WandSparkles', ax, 74, 26, C.violet),
  text(ax + 36, 96, 'AI Agent', { size: 22, weight: 700 }),
  badge(ax + 140, 76, 'Beta', { size: 14, fill: '#EFEBFF', ink: C.violet }),
  icon('Plus', W - 52, 76, 24, C.ink2),
  line(AX, 120, W, 120),
  // pedido (Prompt 1, resumido)
  rect(ax + 40, 136, aw - 88, 178, { r: 14, fill: '#EEF3FF' }),
  linhas(ax + 60, 172, 'Crie um data type Equipe com\nnome (text), trilha (Trilha) e\nmembros (lista de Inscricao).\nNo máximo 4 membros. Antes\nde aplicar, explique o plano.', { fill: C.ink }),
  // resposta com o plano
  icon('Sparkles', ax, 334, 24, C.violet),
  text(ax + 34, 354, 'Plano antes de aplicar:', { size: 20, weight: 650 }),
  rect(ax, 370, aw - 48, 268, { r: 12, fill: C.bg, stroke: C.line }),
  text(ax + 20, 404, 'Data type Equipe', { size: 20, weight: 700 }),
  linhas(ax + 20, 434, '• nome · text\n• trilha · Trilha\n• membros · list of Inscricaos', { fill: C.ink2 }),
  line(ax + 20, 514, ax + aw - 68, 514),
  text(ax + 20, 548, 'Privacy rules', { size: 20, weight: 700 }),
  linhas(ax + 20, 578, '• Creator: vê e edita a equipe\n• Everyone else: só Find this in searches', { fill: C.ink2 }),
  button(ax, 658, 'Aplicar', { icone: 'Check', size: 19, h: 48, w: 160, cor: C.violet }),
  button(ax + 176, 658, 'Ajustar', { tipo: 'secundario', size: 19, h: 48, w: 140 }),
  // caixa de mensagem
  rect(ax, H - 112, aw - 48, 64, { r: 14, fill: C.panel, stroke: C.lineStrong }),
  text(ax + 20, H - 72, 'Peça algo ao agente...', { size: 19, fill: C.ink3 }),
  icon('Mic', W - 114, H - 92, 22, C.ink3),
  rect(W - 80, H - 100, 40, 40, { r: 10, fill: C.violet }),
  icon('ArrowUp', W - 70, H - 90, 20, '#FFFFFF'),
];

export default {
  arquivo: 'media/aula-02/tela-bubble-ai-agent-painel.svg',
  svg: doc(
    W,
    H,
    [rect(0, 0, W, H, { fill: '#EEF0F4' }), ...fundo, ...agente, trilho(H, 'Data', { y0: 56, w: RAIL, passo: 80, primeiro: 72 }), topo(W, { app: 'hackathon-agente', varinha: true, varinhaAtiva: true }), selo(W, H)].join('\n'),
  ),
};
