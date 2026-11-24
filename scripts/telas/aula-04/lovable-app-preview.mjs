import { C, badge, button, doc, field, icon, line, rect, selo, text } from '../lib.mjs';
import { lovableTopo } from './_comum.mjs';

// S44: Lovable (plano Free) com o app do Hackathon gerado a partir do planejamento da Aula 1, só no preview.
const W = 1002;
const H = 678;
const chatW = 330;

const chat = [
  rect(0, 52, chatW, H - 52, { fill: C.panel }),
  line(chatW, 52, chatW, H),
  // pedido
  rect(16, 70, 298, 112, { r: 12, fill: C.hover }),
  text(30, 96, 'App de inscrições do Hackathon\nNo-Code 2026. Persona: Camila.\nMoSCoW, wireframe, identidade e\nregra de acesso em anexo.', { size: 15, lh: 21 }),
  // resposta
  icon('Sparkles', 16, 200, 18, '#7C3AED'),
  text(42, 214, 'Pronto. O que eu criei:', { size: 16, weight: 600 }),
  ...[
    'Página com formulário e contador',
    'Tabela inscricoes no banco',
    'Login de organizador',
    'Regras de acesso (RLS)',
  ].map((t, i) => icon('CircleCheck', 20, 232 + i * 32, 18, C.green) + text(46, 247 + i * 32, t, { size: 16 })),
  rect(16, 372, 298, 72, { r: 10, fill: C.amberBg }),
  text(30, 400, 'Inserir: qualquer visitante.\nLer: só organizador.', { size: 15, fill: C.ink, lh: 21 }),
  // créditos e caixa de texto
  icon('Zap', 16, H - 122, 16, C.ink3),
  text(38, H - 108, 'Créditos restantes hoje: 4 de 5', { size: 15, fill: C.ink2 }),
  rect(16, H - 86, 298, 66, { r: 12, stroke: C.lineStrong, fill: C.panel }),
  text(30, H - 48, 'Pergunte ao Lovable…', { size: 16, fill: C.ink3 }),
].join('\n');

// preview do app gerado
const px = chatW + 20;
const pw = W - chatW - 40;
const prev = [
  rect(px, 68, pw, H - 88, { r: 10, fill: C.panel, stroke: C.line }),
  rect(px, 68, pw, 40, { r: 10, fill: C.hover }),
  rect(px, 98, pw, 10, { fill: C.hover }),
  icon('Monitor', px + 14, 79, 18, C.ink3),
  text(px + 40, 94, 'Preview', { size: 15, weight: 600, fill: C.ink2 }),
  badge(px + pw - 150, 76, 'Não publicado', { size: 13, fill: C.panel, ink: C.ink2, stroke: C.line }),
  // conteúdo do app
  text(px + 32, 158, 'Hackathon No-Code 2026', { size: 28, weight: 700 }),
  text(px + 32, 188, '21 de novembro · 48 horas · online', { size: 16, fill: C.ink2 }),
  rect(px + 32, 206, 256, 34, { r: 17, fill: '#F1EAFE' }),
  icon('Users', px + 46, 215, 16, '#7C3AED'),
  text(px + 70, 229, '119 de 120 vagas livres', { size: 16, weight: 600, fill: '#5B21B6' }),
  field(px + 32, 284, 300, 'Nome', 'Camila Persona', { size: 16, h: 40 }),
  field(px + 32, 352, 300, 'E-mail', 'camila.persona@example.com', { size: 16, h: 40 }),
  field(px + 32, 420, 300, 'Trilha', 'IA', { size: 16, h: 40 }),
  icon('ChevronDown', px + 304, 432, 16, C.ink3),
  button(px + 32, 480, 'Quero me inscrever', { size: 16, h: 44, w: 300, cor: '#7C3AED' }),
  // imagem do evento (decorativa)
  rect(px + 364, 266, 236, 238, { r: 12, fill: '#F1EAFE' }),
  icon('Image', px + 458, 360, 48, '#A78BFA', 1.5),
  // confirmação
  rect(px + 32, 546, 300, 50, { r: 10, fill: C.greenBg }),
  icon('CircleCheck', px + 46, 562, 18, C.green),
  text(px + 72, 577, 'Inscrição confirmada!', { size: 16, weight: 600, fill: C.green }),
].join('\n');

export default {
  arquivo: 'media/aula-04/tela-lovable-app-preview.svg',
  svg: doc(W, H, [lovableTopo(W), chat, prev, selo(W, H)].join('\n')),
};
