/**
 * Peças comuns das telas da Aula 3 (Make, Bubble, n8n). Formas genéricas, sem logos reais.
 * O gerar.mjs importa todo .mjs da pasta: este arquivo exporta `default = []` (não gera tela).
 */
import { C, button, circle, icon, line, rect, text, toggle } from '../lib.mjs';

/** Cores do Make (roxo de destaque) e dos módulos (genéricas). */
export const MK = {
  roxo: '#6D2BD9',
  roxoBg: '#F1EAFF',
  canvas: '#F4F3F8',
  ponto: '#D5D2E0',
  webhook: '#E8457A',
  sheets: '#1E9E5A',
  gmail: '#D9483B',
  ia: '#7C5CFF',
  filtro: '#9AA1B0',
};

/** Fundo com grade de pontos (canvas de Make/n8n). */
export function grade(x, y, w, h, { fundo = MK.canvas, ponto = MK.ponto, passo = 24, id = 'grade' } = {}) {
  return `<defs><pattern id="${id}" width="${passo}" height="${passo}" patternUnits="userSpaceOnUse" x="${x}" y="${y}"><circle cx="2" cy="2" r="1.6" fill="${ponto}"/></pattern></defs>
${rect(x, y, w, h, { fill: fundo })}
<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/>`;
}

/**
 * Módulo do Make: bolha redonda colorida com ícone, rótulo e sub-rótulo embaixo.
 * `num` desenha o selo com o número do módulo; `ok` desenha o visto verde de execução.
 */
export function moduloMake(cx, cy, r, { cor, icone, titulo, sub, num, ok, size = 20, apagado = false, gatilho = false }) {
  const out = [];
  if (gatilho) {
    // relógio do agendamento, colado à esquerda do gatilho
    const gx = cx - r - r * 0.42;
    out.push(line(gx, cy, cx - r, cy, { stroke: MK.roxo, sw: 3 }));
    out.push(circle(gx, cy, r * 0.3, { fill: C.panel, stroke: MK.roxo, sw: 3 }));
    out.push(icon('Clock', gx - r * 0.19, cy - r * 0.19, r * 0.38, MK.roxo, 2.4));
  }
  out.push(circle(cx, cy + 4, r, { fill: '#000', fo: 0.08 }));
  out.push(circle(cx, cy, r, { fill: apagado ? '#C9CED6' : cor }));
  out.push(icon(icone, cx - r * 0.45, cy - r * 0.45, r * 0.9, '#FFFFFF', 2.2));
  if (num !== undefined) {
    out.push(circle(cx + r * 0.72, cy - r * 0.72, r * 0.26, { fill: C.panel, stroke: C.lineStrong, sw: 1.5 }));
    out.push(text(cx + r * 0.72, cy - r * 0.72 + r * 0.1, String(num), { size: r * 0.28, weight: 700, anchor: 'middle', fill: C.ink2 }));
  }
  if (ok) {
    out.push(circle(cx + r * 0.72, cy + r * 0.72, r * 0.28, { fill: C.green, stroke: C.panel, sw: 3 }));
    out.push(icon('Check', cx + r * 0.72 - r * 0.17, cy + r * 0.72 - r * 0.17, r * 0.34, '#FFFFFF', 3));
  }
  if (titulo) out.push(text(cx, cy + r + size * 1.5, titulo, { size, weight: 650, anchor: 'middle' }));
  if (sub) out.push(text(cx, cy + r + size * 2.75, sub, { size: size * 0.85, anchor: 'middle', fill: C.ink2 }));
  return out.join('\n');
}

/** Ligação entre módulos do Make (linha grossa cinza; `filtro` desenha o funil no meio). */
export function ligacaoMake(x1, x2, y, { filtro, rotuloFiltro, size = 16 } = {}) {
  const out = [line(x1, y, x2, y, { stroke: '#BFC3CF', sw: 6, dash: '0.1 12' })];
  if (filtro) {
    const mx = (x1 + x2) / 2;
    out.push(circle(mx, y, 22, { fill: C.panel, stroke: '#BFC3CF', sw: 2 }));
    out.push(icon('Filter', mx - 11, y - 11, 22, C.ink2, 2.2));
    if (rotuloFiltro) out.push(text(mx, y - 36, rotuloFiltro, { size, weight: 560, anchor: 'middle', fill: C.ink2 }));
  }
  return out.join('\n');
}

/** Barra superior do editor de cenários do Make. */
export function topoMake(w, nome, { size = 18, h = 60 } = {}) {
  return [
    rect(0, 0, w, h, { fill: C.panel }),
    line(0, h, w, h),
    icon('ArrowLeft', 20, h / 2 - 11, 22, C.ink2),
    rect(58, h / 2 - 16, 32, 32, { r: 8, fill: MK.roxo }),
    text(74, h / 2 + 7, 'M', { size: 18, weight: 800, fill: '#FFFFFF', anchor: 'middle' }),
    text(102, h / 2 + size * 0.36, nome, { size, weight: 650 }),
  ].join('\n');
}

/** Barra inferior do Make: Run once + agendamento. */
export function rodapeMake(w, h, { ligado = true, size = 17, alt = 76, agenda = 'Immediately as data arrives' } = {}) {
  const y = h - alt;
  const bw = Math.round(size * 7.4);
  const tx = 20 + bw + 28;
  const cx = tx + 46 + size * 2.6;
  return [
    rect(0, y, w, alt, { fill: C.panel }),
    line(0, y, w, y),
    button(20, y + (alt - 46) / 2, 'Run once', { icone: 'Play', cor: MK.roxo, size, h: 46, w: bw }),
    toggle(tx, y + alt / 2 - 10, ligado, { cor: MK.roxo }),
    text(tx + 46, y + alt / 2 + size * 0.36, ligado ? 'ON' : 'OFF', { size, weight: 650, fill: ligado ? MK.roxo : C.ink3 }),
    icon('Clock', cx, y + alt / 2 - size * 0.55, size * 1.1, C.ink2),
    text(cx + size * 1.6, y + alt / 2 + size * 0.36, agenda, { size, fill: C.ink2 }),
  ].join('\n');
}

/** "Pílula" de campo mapeado do Make (ex.: 1. ideia). */
export function pilula(x, y, num, campo, { size = 17, cor = MK.webhook } = {}) {
  const w = Math.round((String(num).length + campo.length + 2) * size * 0.6 + 20);
  const h = Math.round(size * 1.7);
  return [
    rect(x, y, w, h, { r: h / 2, fill: cor }),
    text(x + w / 2, y + h / 2 + size * 0.36, `${num}. ${campo}`, { size, weight: 600, fill: '#FFFFFF', anchor: 'middle' }),
  ].join('');
}

/** Barra superior do editor do Bubble (mesmo visual da tela da Aula 4). */
export function topoBubble(w, app, { aba = 'Plugins', size = 15, h = 60 } = {}) {
  const abas = ['Design', 'Workflow', 'Data', 'Styles', 'Plugins', 'Settings', 'Logs'];
  return [
    rect(0, 0, w, h, { fill: C.panel }),
    line(0, h, w, h),
    rect(18, h / 2 - 16, 32, 32, { r: 8, fill: '#0C29AB' }),
    text(34, h / 2 + 8, 'b', { size: 22, weight: 700, fill: '#FFFFFF', anchor: 'middle' }),
    text(62, h / 2 + 6, app, { size: size + 1, weight: 600 }),
    ...abas.map((t, i) => {
      const x = 260 + abas.slice(0, i).reduce((a, b) => a + b.length * size * 0.6 + 34, 0);
      const on = t === aba;
      return (
        (on ? rect(x - 12, h - 4, t.length * size * 0.6 + 24, 4, { fill: C.blue }) : '') +
        text(x, h / 2 + 6, t, { size, fill: on ? C.blue : C.ink2, weight: on ? 650 : 500 })
      );
    }),
  ].join('\n');
}

export default [];
