import { C, badge, button, doc, icon, line, rect, selo, text } from '../lib.mjs';
import { lovableTopo } from './_comum.mjs';

// S45: Lovable Cloud no projeto de ensaio: políticas RLS da tabela inscricoes, repositório no GitHub
// e a revisão de segurança. Os marcadores do slide (anotacoes x/y em %) apontam para esses três pontos.
const W = 1036;
const H = 648;
const sideW = 220;

const lateral = [
  rect(0, 52, sideW, H - 52, { fill: C.panel }),
  line(sideW, 52, sideW, H),
  text(20, 86, 'CLOUD', { size: 13, weight: 600, fill: C.ink3, ls: 1 }),
  ...[
    ['LayoutDashboard', 'Visão geral'],
    ['Database', 'Banco de dados'],
    ['Users', 'Usuários'],
    ['HardDrive', 'Arquivos'],
    ['KeyRound', 'Secrets'],
    ['ShieldCheck', 'Segurança'],
  ].map(([ic, t], i) => {
    const on = i === 1;
    const y = 100 + i * 38;
    return (on ? rect(10, y, sideW - 20, 36, { r: 8, fill: C.hover }) : '') + icon(ic, 22, y + 9, 18, on ? C.ink : C.ink3) + text(50, y + 24, t, { size: 16, weight: on ? 600 : 400, fill: on ? C.ink : C.ink2 });
  }),
  // repositório (anotação 1)
  rect(12, 400, sideW - 24, 104, { r: 10, fill: C.bg, stroke: C.line }),
  icon('GitBranch', 26, 416, 18, C.ink),
  text(52, 431, 'Código no GitHub', { size: 15, weight: 600 }),
  text(26, 458, 'seunome/hackathon', { size: 15, fill: C.ink2, mono: true }),
  icon('RefreshCw', 26, 472, 14, C.green),
  text(46, 485, 'Sincronizado', { size: 14, fill: C.green, weight: 500 }),
].join('\n');

// área principal: políticas
const mx = sideW + 28;
const mw = W - sideW - 56;
const politica = (y, nome, op, quem, regra, cor) =>
  [
    rect(mx, y, mw, 92, { r: 10, fill: C.panel, stroke: C.line }),
    rect(mx, y, 5, 92, { fill: cor }),
    text(mx + 22, y + 32, nome, { size: 18, weight: 600 }),
    badge(mx + 22, y + 46, op, { size: 13, fill: cor === C.green ? C.greenBg : '#E8EEFF', ink: cor === C.green ? C.green : C.blue }),
    text(mx + 22 + op.length * 8 + 34, y + 66, quem, { size: 15, fill: C.ink2 }),
    text(mx + mw - 20, y + 66, regra, { size: 15, mono: true, fill: C.ink, anchor: 'end' }),
  ].join('\n');

const principal = [
  text(mx, 92, 'Banco de dados  ›  inscricoes', { size: 15, fill: C.ink3 }),
  text(mx, 126, 'Políticas de acesso (RLS)', { size: 24, weight: 700 }),
  badge(mx + 330, 106, 'RLS ativada', { size: 14, fill: C.greenBg, ink: C.green, icone: 'Lock' }),
  politica(152, 'Visitante pode se inscrever', 'INSERT', 'para: anon', 'with check (true)', C.green),
  politica(258, 'Só organizador lê as inscrições', 'SELECT', 'para: authenticated', 'using (is_organizador())', C.blue),
  rect(mx, 364, mw, 52, { r: 10, fill: C.bg, stroke: C.line, dash: '5 4' }),
  icon('Ban', mx + 20, 381, 18, C.ink3),
  text(mx + 48, 396, 'UPDATE e DELETE: sem política, ninguém altera nem apaga.', { size: 15, fill: C.ink2 }),
].join('\n');

// revisão de segurança (anotação 3)
const sx = mx + mw - 420;
const sy = 444;
const scan = [
  rect(sx, sy, 420, 168, { r: 12, fill: C.panel, stroke: C.line }),
  icon('ShieldCheck', sx + 20, sy + 20, 22, C.blue),
  text(sx + 52, sy + 38, 'Revisão de segurança', { size: 18, weight: 600 }),
  icon('CircleCheck', sx + 20, sy + 62, 18, C.green),
  text(sx + 46, sy + 77, '2 tabelas com RLS ativada', { size: 15 }),
  icon('TriangleAlert', sx + 20, sy + 92, 18, C.amber),
  text(sx + 46, sy + 107, 'Confira se cada regra faz o que deve', { size: 15 }),
  button(sx + 20, sy + 120, 'Rodar de novo', { tipo: 'secundario', size: 15, h: 36, icone: 'RefreshCw' }),
].join('\n');

export default {
  arquivo: 'media/aula-04/tela-lovable-rls-policies.svg',
  svg: doc(W, H, [lovableTopo(W, { aba: 'Cloud', github: true }), lateral, principal, scan, selo(W, H)].join('\n')),
};
