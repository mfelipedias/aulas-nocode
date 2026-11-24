import { C, circle, doc, icon, line, rect, selo, text } from '../lib.mjs';

// S53: terminal com o agente de código no projeto hackathon-lovable. Em cima, as permissões do
// .claude/settings.json (allow e deny); embaixo, o agente esbarrando no deny e pedindo aprovação
// para um comando fora da lista allow. Sem banner nem logo da ferramenta.
const W = 1002;
const H = 678;
const fs = 18;
const lh = 28;

const verde = '#4ADE80';
const vermelho = '#F87171';
const ambar = '#FBBF24';
const azul = '#7DB4FF';
const cinza = C.dInk3;
const claro = C.dInk;

/** Uma linha de terminal feita de pedaços [texto, cor, peso?]. */
function linha(x, y, partes) {
  let cx = x;
  return partes
    .map(([t, cor, peso]) => {
      const out = text(cx, y, t.replace(/ /g, '\u00A0'), { size: fs, mono: true, fill: cor, weight: peso ?? 400 });
      cx += t.length * fs * 0.6;
      return out;
    })
    .join('');
}

const x0 = 28;
let y = 44;
const L = (partes, bola) => {
  const s = (bola ? circle(x0 + 5, y - 6, 5, { fill: bola }) : '') + linha(x0, y, partes);
  y += lh;
  return s;
};
const gap = (n = 0.5) => {
  y += lh * n;
  return '';
};

const corpo = [
  L([['~/hackathon-lovable', azul], [' $ ', cinza], ['cat .claude/settings.json', claro]]),
  L([['{ "permissions": {', claro]]),
  L([['    "allow": [', claro], ['"Bash(npm test)"', verde], [', ', claro], ['"Bash(git diff *)"', verde], [',', claro]]),
  L([['              ', claro], ['"Bash(git commit *)"', verde], ['],', claro]]),
  L([['    "deny":  [', claro], ['"Bash(git push *)"', vermelho], [', ', claro], ['"Bash(supabase *)"', vermelho], [',', claro]]),
  L([['              ', claro], ['"Read(./.env)"', vermelho], ['] } }', claro]]),
  gap(0.6),
];
const ySep = y - lh * 0.55;
y += lh * 0.4;
const sessao = [
  L([['> ', cinza], ['Impedir inscrição duplicada por e-mail.', claro, 600]]),
  gap(0.4),
  L([['  ', verde], ['Bash', claro, 600], ['(npm test)', claro], ['   permitido pela lista allow', verde]], verde),
  L([['  └ 3 testes passaram', cinza]]),
  gap(0.4),
  L([['  ', vermelho], ['Bash', claro, 600], ['(supabase db push)', claro]], vermelho),
  L([['  └ ', cinza], ['Bloqueado pela regra deny: Bash(supabase *)', vermelho]]),
  gap(0.4),
  L([['  ', ambar], ['Bash', claro, 600], ['(npm install validator)', claro]], ambar),
];

// caixa de aprovação
const by = y + 4;
const caixa = [
  rect(x0 - 6, by, W - 2 * x0 + 12, 158, { r: 8, stroke: ambar, sw: 1.5, fill: '#1E1A10' }),
  icon('ShieldAlert', x0 + 10, by + 16, 20, ambar),
  text(x0 + 40, by + 33, 'Fora da lista allow: permitir este comando?', { size: fs, mono: true, fill: ambar, weight: 600 }),
  rect(x0 + 6, by + 49, 300, 32, { r: 4, fill: '#2B3242' }),
  linha(x0 + 14, by + 69, [['> 1. Sim, só desta vez', claro, 600]]),
  linha(x0 + 14, by + 104, [['  2. Sim, e não perguntar de novo', C.dInk2]]),
  linha(x0 + 14, by + 137, [['  3. Não, e dizer o que fazer em vez disso', C.dInk2]]),
].join('\n');

export default {
  arquivo: 'media/aula-04/tela-agente-permissoes.svg',
  svg: doc(
    W,
    H,
    [...corpo, line(0, ySep, W, ySep, { stroke: C.dLine }), ...sessao, caixa, selo(W, H)].join('\n'),
    { fundo: '#0F1218' },
  ),
};
