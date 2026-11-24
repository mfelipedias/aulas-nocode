import { C, button, checkbox, doc, field, icon, line, rect, selo, text } from '../lib.mjs';
import { wrap } from './_comum.mjs';

// S24: formulário de inscrição do Hackathon (Bubble, /version-test) com a caixa de aceite e o texto de
// consentimento da LGPD. A moldura do slide já desenha o navegador; aqui só o conteúdo da página.
const W = 856;
const H = 535;
const ROXO = '#4F46E5';

const aceite =
  'Li e concordo que meus dados (nome, e-mail e telefone) sejam usados pela organização do Hackathon No-Code 2026 apenas para gerenciar minha inscrição e enviar avisos sobre o evento. Eles serão excluídos até 30 dias após o evento. Posso pedir acesso, correção ou exclusão pelo e-mail privacidade@hackathon-nocode.example.';

const topo = [
  rect(0, 0, W, 56, { fill: C.panel }),
  line(0, 56, W, 56),
  rect(24, 14, 28, 28, { r: 7, fill: ROXO }),
  text(38, 34, 'H', { size: 16, weight: 700, fill: '#FFFFFF', anchor: 'middle' }),
  text(62, 34, 'Hackathon No-Code 2026', { size: 17, weight: 600 }),
].join('\n');

const form = [
  text(24, 94, 'Inscrição', { size: 24, weight: 700 }),
  field(24, 128, 320, 'Nome', 'Camila Persona', { size: 16, h: 38 }),
  field(24, 196, 320, 'E-mail', 'camila.persona@example.com', { size: 16, h: 38 }),
  field(24, 264, 320, 'Telefone', '(00) 90000-0001', { size: 16, h: 38 }),
  field(24, 332, 320, 'Trilha', 'IA', { size: 16, h: 38 }),
  icon('ChevronDown', 316, 343, 16, C.ink3),
].join('\n');

// caixa de aceite
const ax = 372;
const aw = W - ax - 24;
const caixa = [
  rect(ax, 78, aw, 318, { r: 12, fill: C.panel, stroke: ROXO, sw: 2 }),
  icon('ShieldCheck', ax + 18, 96, 20, ROXO),
  text(ax + 46, 112, 'Seus dados', { size: 17, weight: 600, fill: ROXO }),
  checkbox(ax + 18, 134, true, { cor: ROXO }),
  text(ax + 48, 149, wrap(aceite, 43), { size: 17, lh: 24.5, fill: C.ink }),
].join('\n');

const acao = [
  button(ax, 412, 'Confirmar inscrição', { size: 17, h: 46, w: aw, cor: ROXO }),
  icon('Info', ax, 474, 16, C.ink3),
  text(ax + 24, 488, 'Botão ativo só com o aceite marcado.', { size: 15, fill: C.ink2 }),
].join('\n');

export default {
  arquivo: 'media/aula-04/tela-bubble-form-aceite.svg',
  svg: doc(W, H, [topo, form, caixa, acao, selo(W, H)].join('\n')),
};
