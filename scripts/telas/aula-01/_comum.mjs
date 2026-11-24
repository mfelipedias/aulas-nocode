/**
 * Peças comuns às telas da Aula 1: traço "à mão" no estilo Excalidraw, cores do evento,
 * as duas páginas de inscrição (A: prompt de uma linha; B: prompt planejado) e a moldura do Lovable.
 * Não gera nenhum arquivo (o gerar.mjs importa todo .mjs da pasta e espera um default).
 */
import { C, badge, button, circle, icon, line, rect, text } from '../lib.mjs';

export default [];

/** Identidade do evento (S38). */
export const EV = { grafite: '#1A1D24', grafite2: '#252A34', azul: '#2F5BFF', limao: '#C6F432', claro: '#F4F6FA' };

// ------------------------------------------------------------------ traço à mão (Excalidraw)
/** Gerador pseudoaleatório determinístico (as telas saem iguais a cada geração). */
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const f = (n) => +n.toFixed(1);

/** Segmento levemente curvo de (x1,y1) a (x2,y2), com desvio `amp`. */
function seg(r, x1, y1, x2, y2, amp) {
  const j = () => (r() - 0.5) * amp;
  const mx = (x1 + x2) / 2 + j();
  const my = (y1 + y2) / 2 + j();
  return `M${f(x1 + j())} ${f(y1 + j())} Q${f(mx)} ${f(my)} ${f(x2 + j())} ${f(y2 + j())}`;
}

/** Retângulo esboçado: dois traços sobrepostos, cantos que passam um pouco do ponto. */
export function sRect(x, y, w, h, o = {}) {
  const r = rng(o.seed ?? Math.round(x * 7 + y * 13 + w));
  const amp = o.amp ?? 3;
  const cor = o.cor ?? '#1E1E1E';
  const sw = o.sw ?? 2;
  const out = [];
  if (o.fill) out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r ?? 0}" fill="${o.fill}"/>`);
  for (let k = 0; k < 2; k++) {
    const d = [seg(r, x - 2, y, x + w + 2, y, amp), seg(r, x + w, y - 2, x + w, y + h + 2, amp), seg(r, x + w + 2, y + h, x - 2, y + h, amp), seg(r, x, y + h + 2, x, y - 2, amp)].join(' ');
    out.push(`<path d="${d}" fill="none" stroke="${cor}" stroke-width="${k ? sw * 0.7 : sw}" stroke-linecap="round" opacity="${k ? 0.7 : 1}"/>`);
  }
  return out.join('');
}

/** Linha esboçada. */
export function sLine(x1, y1, x2, y2, o = {}) {
  const r = rng(o.seed ?? Math.round(x1 * 3 + y1 * 5 + x2));
  const cor = o.cor ?? '#1E1E1E';
  const sw = o.sw ?? 2;
  return [0, 1]
    .map((k) => `<path d="${seg(r, x1, y1, x2, y2, o.amp ?? 3)}" fill="none" stroke="${cor}" stroke-width="${k ? sw * 0.7 : sw}" stroke-linecap="round" opacity="${k ? 0.7 : 1}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`)
    .join('');
}

/** Seta esboçada de (x1,y1) até (x2,y2). */
export function sArrow(x1, y1, x2, y2, o = {}) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const L = o.ponta ?? 16;
  const p = (da) => [x2 - L * Math.cos(a + da), y2 - L * Math.sin(a + da)];
  const [ax, ay] = p(0.45);
  const [bx, by] = p(-0.45);
  return sLine(x1, y1, x2, y2, o) + sLine(ax, ay, x2, y2, { ...o, amp: 1 }) + sLine(bx, by, x2, y2, { ...o, amp: 1 });
}

/** Caixa de imagem esboçada (retângulo com X). */
export function sImagem(x, y, w, h, o = {}) {
  return sRect(x, y, w, h, o) + sLine(x + 6, y + 6, x + w - 6, y + h - 6, { ...o, sw: 1.5 }) + sLine(x + w - 6, y + 6, x + 6, y + h - 6, { ...o, sw: 1.5 });
}

// ------------------------------------------------------------------ página de inscrição B (prompt planejado)
/**
 * Página B em largura de desktop. Desenha a partir de (x, y) com largura `w` e altura `h` (escala `k`).
 * Grafite, botão azul, verde-limão só em detalhes. Inclui o que a IA "inventou" (+500, depoimento, patrocinadores).
 */
export function paginaBDesktop(x, y, w, h, k = 1) {
  const s = (n) => n * k;
  const L = x + s(64);
  const out = [
    rect(x, y, w, h, { fill: EV.grafite }),
    // cabeçalho mínimo, sem menu
    rect(L, y + s(30), s(14), s(14), { r: s(3), fill: EV.limao }),
    text(L + s(26), y + s(44), 'Hackathon No-Code 2026', { size: s(19), weight: 650, fill: '#FFFFFF' }),
    text(x + w - s(64), y + s(44), 'Online · gratuito', { size: s(18), fill: '#AEB6C6', anchor: 'end' }),
    // título e apoio
    text(L, y + s(150), 'Crie seu primeiro app', { size: s(50), weight: 750, fill: '#FFFFFF' }),
    text(L, y + s(208), 'sem programar.', { size: s(50), weight: 750, fill: EV.limao }),
    text(L, y + s(258), 'Hackathon online e gratuito, 21 e 22 de novembro.\nPara quem está começando em tecnologia.', {
      size: s(21),
      fill: '#C9D0DC',
      lh: s(30),
    }),
  ];
  // formulário
  const fy = y + s(320);
  const fw = s(470);
  ['Nome', 'E-mail', 'Telefone'].forEach((rot, i) => {
    const yy = fy + i * s(76);
    out.push(text(L, yy, rot, { size: s(18), weight: 560, fill: '#C9D0DC' }));
    out.push(rect(L, yy + s(12), fw, s(48), { r: s(8), fill: EV.grafite2, stroke: '#3A4150' }));
  });
  out.push(rect(L, fy + s(238), fw, s(58), { r: s(10), fill: EV.azul }));
  out.push(text(L + fw / 2, fy + s(275), 'Quero minha vaga', { size: s(21), weight: 650, fill: '#FFFFFF', anchor: 'middle' }));
  // coluna da direita: imagem + o que a IA inventou
  const R = x + w * 0.56;
  const rw = x + w - s(64) - R;
  out.push(rect(R, y + s(96), rw, s(300), { r: s(16), fill: EV.grafite2 }));
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) out.push(rect(R + s(40) + i * s(92), y + s(140) + j * s(76), s(70), s(52), { r: s(8), fill: i === 2 && j === 1 ? EV.azul : '#323946' }));
  out.push(icon('Sparkles', R + rw - s(70), y + s(116), s(36), EV.limao));
  // números inventados
  out.push(text(R, y + s(462), '+500', { size: s(42), weight: 750, fill: EV.limao }));
  out.push(text(R, y + s(492), 'participantes', { size: s(18), fill: '#AEB6C6' }));
  out.push(text(R + s(230), y + s(462), 'R$ 10 mil', { size: s(42), weight: 750, fill: EV.limao }));
  out.push(text(R + s(230), y + s(492), 'em prêmios', { size: s(18), fill: '#AEB6C6' }));
  // depoimento inventado
  out.push(rect(R, y + s(522), rw, s(110), { r: s(12), fill: EV.grafite2 }));
  out.push(circle(R + s(42), y + s(577), s(22), { fill: '#3A4150' }));
  out.push(text(R + s(80), y + s(568), '“Mudou minha carreira!”', { size: s(20), weight: 600, fill: '#FFFFFF', italic: true }));
  out.push(text(R + s(80), y + s(598), 'Juliana M., edição 2025', { size: s(17), fill: '#AEB6C6' }));
  // patrocinadores inventados
  out.push(text(R, y + s(672), 'Patrocínio', { size: s(16), fill: '#7C8494' }));
  [0, 1, 2].forEach((i) => out.push(rect(R + s(100) + i * s(110), y + s(652), s(92), s(28), { r: s(6), fill: '#323946' })));
  return out.join('\n');
}

// ------------------------------------------------------------------ Lovable (simplificado, sem logo)
/** Marca neutra do Lovable: quadrado em gradiente + nome (não é o logo real). */
export function marcaLovable(x, y, s = 1) {
  return [
    `<defs><linearGradient id="lvg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF6A3D"/><stop offset="0.5" stop-color="#FF3D8B"/><stop offset="1" stop-color="#6E5BFF"/></linearGradient></defs>`,
    rect(x, y, 30 * s, 30 * s, { r: 8 * s, fill: 'url(#lvg)' }),
    text(x + 42 * s, y + 22 * s, 'Lovable', { size: 21 * s, weight: 680 }),
  ].join('');
}

/**
 * Editor do Lovable: barra superior (projeto, Preview/Código, desktop/celular, Publicar) + chat à esquerda.
 * Devolve { svg, px, py, pw, ph } da área de preview.
 */
export function editorLovable(W, H, { celular = false, mensagens = [], creditos = '3 de 5' }) {
  const top = 64;
  const cw = 440;
  const svg = [
    rect(0, 0, W, top, { fill: C.panel }),
    line(0, top, W, top),
    rect(20, 17, 30, 30, { r: 8, fill: 'url(#lvg)' }),
    text(64, 39, 'hackathon-inscricao', { size: 19, weight: 600 }),
    icon('ChevronDown', 254, 25, 16, C.ink3),
    // Preview | Código
    rect(cw + 30, 14, 230, 36, { r: 9, fill: C.hover }),
    rect(cw + 34, 18, 112, 28, { r: 7, fill: C.panel }),
    icon('Eye', cw + 46, 24, 16, C.ink),
    text(cw + 68, 38, 'Preview', { size: 16, weight: 560 }),
    icon('Code', cw + 160, 24, 16, C.ink3),
    text(cw + 182, 38, 'Código', { size: 16, fill: C.ink3 }),
    // desktop / celular
    rect(cw + 290, 14, 84, 36, { r: 9, fill: C.hover }),
    rect(celular ? cw + 334 : cw + 294, 18, 36, 28, { r: 7, fill: C.panel }),
    icon('Monitor', cw + 302, 24, 18, celular ? C.ink3 : C.ink),
    icon('Smartphone', cw + 343, 24, 18, celular ? C.ink : C.ink3),
    // créditos e publicar
    text(W - 190, 39, `${creditos} créditos`, { size: 16, fill: C.ink2, anchor: 'end' }),
    button(W - 170, 13, 'Publicar', { size: 16, h: 38, w: 150, cor: C.ink }),
    // chat
    rect(0, top, cw, H - top, { fill: '#FBFBFC' }),
    line(cw, top, cw, H),
    ...mensagens,
    // campo do chat
    rect(20, H - 104, cw - 40, 84, { r: 14, fill: C.panel, stroke: C.lineStrong }),
    text(40, H - 68, 'Peça um ajuste ao Lovable…', { size: 17, fill: C.ink3 }),
    icon('Plus', 38, H - 50, 20, C.ink3),
    circle(cw - 54, H - 40, 16, { fill: C.lineStrong }),
    icon('ArrowUp', cw - 63, H - 49, 18, '#FFFFFF'),
    rect(cw, top, W - cw, H - top, { fill: '#ECEEF2' }),
  ].join('\n');
  return { svg, px: cw, py: top, pw: W - cw, ph: H - top };
}

/** Balão de mensagem do usuário no chat (alinhado à direita). Devolve a altura usada. */
export function balaoUsuario(y, linhas, o = {}) {
  const cw = 440;
  const lh = 25;
  const h = linhas.length * lh + 26 + (o.anexo ? 50 : 0);
  const w = o.w ?? 360;
  const x = cw - 20 - w;
  return {
    h,
    svg: [
      rect(x, y, w, h, { r: 14, fill: '#EDEFF3' }),
      text(x + 18, y + 31, linhas.join('\n'), { size: 17, lh, fill: C.ink }),
      o.anexo
        ? rect(x + 18, y + h - 54, w - 36, 38, { r: 8, fill: C.panel, stroke: C.line }) +
          icon('Image', x + 30, y + h - 44, 18, C.ink2) +
          text(x + 58, y + h - 29, o.anexo, { size: 15, fill: C.ink2 })
        : '',
    ].join(''),
  };
}

/** Selo "Tela ilustrativa" legível sobre fundo escuro. */
export const seloEscuro = (w, h, label = 'Tela ilustrativa') =>
  badge(w - Math.round(label.length * 11 * 0.6 + 18) - 12, h - 34, label, { size: 11, fill: 'rgba(255,255,255,0.16)', ink: '#E8EBF2' });

/** Página B na largura de celular (390×888), já com o formulário logo depois do título. */
export function paginaBCelular() {
  const W = 390;
  const L = 22;
  const fw = W - 2 * L;
  const out = [
    rect(0, 0, W, 888, { fill: EV.grafite }),
    rect(L, 52, 14, 14, { r: 3, fill: EV.limao }),
    text(L + 24, 66, 'Hackathon No-Code 2026', { size: 17, weight: 650, fill: '#FFFFFF' }),
    text(L, 150, 'Crie seu', { size: 38, weight: 750, fill: '#FFFFFF' }),
    text(L, 196, 'primeiro app', { size: 38, weight: 750, fill: '#FFFFFF' }),
    text(L, 242, 'sem programar.', { size: 38, weight: 750, fill: EV.limao }),
    text(L, 284, 'Online e gratuito, 21 e 22/11.\nPara quem está começando.', { size: 18, fill: '#C9D0DC', lh: 25 }),
  ];
  ['Nome', 'E-mail', 'Telefone'].forEach((rot, i) => {
    const y = 362 + i * 80;
    out.push(text(L, y, rot, { size: 16, weight: 560, fill: '#C9D0DC' }));
    out.push(rect(L, y + 10, fw, 46, { r: 8, fill: EV.grafite2, stroke: '#3A4150' }));
  });
  out.push(rect(L, 610, fw, 56, { r: 10, fill: EV.azul }));
  out.push(text(W / 2, 645, 'Quero minha vaga', { size: 20, weight: 650, fill: '#FFFFFF', anchor: 'middle' }));
  out.push(rect(L, 700, fw, 150, { r: 14, fill: EV.grafite2 }));
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) out.push(rect(L + 30 + i * 74, 726 + j * 56, 56, 40, { r: 6, fill: i === 2 && j === 0 ? EV.azul : '#323946' }));
  return out.join('\n');
}
