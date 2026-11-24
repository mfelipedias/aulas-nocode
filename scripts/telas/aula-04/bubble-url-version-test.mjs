import { C, badge, button, doc, field, icon, line, rect, selo, text } from '../lib.mjs';

// S10: o app do Hackathon aberto em /version-test (Bubble, plano Free). A moldura do slide já desenha o
// navegador e a URL; aqui só o conteúdo da página. O zoom do passo 1 (x 0–70%, y 0–45%) cai sobre o
// formulário com a confirmação gravada no banco de teste; a barra de depuração fica embaixo (passo 2).
const W = 856;
const H = 535;
const ROXO = '#4F46E5';

const pagina = [
  rect(0, 0, W, 56, { fill: C.panel }),
  line(0, 56, W, 56),
  rect(24, 14, 28, 28, { r: 7, fill: ROXO }),
  text(38, 34, 'H', { size: 16, weight: 700, fill: '#FFFFFF', anchor: 'middle' }),
  text(62, 34, 'Hackathon No-Code 2026', { size: 17, weight: 600 }),
  text(W - 24, 34, 'Organização', { size: 16, fill: C.ink2, anchor: 'end' }),
  // formulário (zoom do passo 1)
  text(24, 92, 'Inscreva-se', { size: 24, weight: 700 }),
  field(24, 122, 270, 'Nome', 'Camila Persona', { size: 16, h: 38 }),
  field(310, 122, 270, 'E-mail', 'camila.persona@example.com', { size: 16, h: 38 }),
  button(24, 172, 'Quero minha vaga', { size: 16, h: 40, w: 170, cor: ROXO }),
  rect(206, 172, 374, 40, { r: 8, fill: C.greenBg }),
  icon('CircleCheck', 218, 183, 18, C.green),
  text(244, 198, 'Salva e enviada ao Make', { size: 16, weight: 600, fill: C.green }),
  icon('Database', 24, 216, 16, C.amber),
  text(48, 230, 'Gravada nos dados de teste (Development), não nos do Live.', { size: 15, fill: C.amber, weight: 500 }),
  // resto da página
  rect(620, 80, 212, 170, { r: 12, fill: '#EEF0FF' }),
  icon('Users', 638, 96, 20, ROXO),
  text(638, 162, '20', { size: 44, weight: 700, fill: ROXO }),
  text(638, 190, 'inscritos até agora', { size: 16, fill: C.ink2 }),
  text(638, 226, 'Vagas: 120', { size: 16, fill: C.ink2 }),
  rect(24, 290, 808, 120, { r: 12, fill: C.panel, stroke: C.line }),
  text(44, 324, 'Trilhas', { size: 18, weight: 600 }),
  ...['Web', 'Mobile', 'Automação', 'IA'].map((t, i) => badge(44 + i * 130, 342, t, { size: 15, fill: C.hover, ink: C.ink, w: 116 })),
].join('\n');

// barra de depuração do Bubble (só aparece em version-test)
const dy = H - 64;
const debug = [
  rect(0, dy, W, 64, { fill: '#2B2F3A' }),
  icon('Bug', 20, dy + 21, 22, '#FBBF24'),
  text(52, dy + 39, 'Debugger', { size: 17, weight: 600, fill: '#FFFFFF' }),
  ...['Step-by-step', 'Inspect', 'Show layout'].map((t, i) =>
    rect(160 + i * 148, dy + 14, 136, 36, { r: 6, fill: '#3A3F4D' }) + text(228 + i * 148, dy + 38, t, { size: 15, fill: '#E5E7EB', anchor: 'middle' }),
  ),
].join('\n');

export default {
  arquivo: 'media/aula-04/tela-bubble-url-version-test.svg',
  svg: doc(W, H, [pagina, debug, selo(W, H - 64)].join('\n'), { fundo: C.bg }),
};
