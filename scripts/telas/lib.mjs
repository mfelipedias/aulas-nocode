/**
 * Primitivas para desenhar telas de plataforma em SVG (no lugar de capturas de tela).
 * As telas são representações ilustrativas: mostram o que importa para a explicação, sem depender de print.
 * Fontes Geist/Geist Mono embutidas (base64), ícones Lucide; tudo vetorial e autossuficiente.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import * as lucide from 'lucide';

const require = createRequire(import.meta.url);
const font = (pkg, file) =>
  readFileSync(require.resolve(`${pkg}/files/${file}`)).toString('base64');

let fontCss;
function fonts() {
  fontCss ??= [
    `@font-face{font-family:G;src:url(data:font/woff2;base64,${font('@fontsource-variable/geist', 'geist-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}`,
    `@font-face{font-family:G;src:url(data:font/woff2;base64,${font('@fontsource-variable/geist', 'geist-latin-ext-wght-normal.woff2')}) format('woff2');font-weight:100 900;unicode-range:U+0100-02AF,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;}`,
    `@font-face{font-family:M;src:url(data:font/woff2;base64,${font('@fontsource-variable/geist-mono', 'geist-mono-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900;}`,
  ].join('\n');
  return fontCss;
}

/** Escapa texto para SVG. */
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())}="${esc(v)}"`)
    .join(' ');

/** Paleta clara (a maioria das plataformas usa interface clara) e escura (palco do deck). */
export const C = {
  bg: '#F6F7F9',
  panel: '#FFFFFF',
  line: '#E3E6EB',
  lineStrong: '#C9CED6',
  ink: '#1A1D23',
  ink2: '#4A5160',
  ink3: '#7C8494',
  field: '#FFFFFF',
  hover: '#EEF1F5',
  blue: '#2F6BFF',
  red: '#E5484D',
  redBg: '#FDECEC',
  green: '#1F9D62',
  greenBg: '#E6F6EE',
  amber: '#D98B00',
  amberBg: '#FFF4DB',
  violet: '#7C5CFF',
  // escuro
  dBg: '#0E1117',
  dPanel: '#161A22',
  dLine: '#2A303C',
  dInk: '#F2F4F9',
  dInk2: '#AAB2C4',
  dInk3: '#7A8397',
};

/** Documento SVG completo. `w`×`h` em px; proporção 16:10 combina com a moldura das demos. */
export function doc(w, h, body, { fundo = C.bg } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><style>
${fonts()}
text{font-family:G,'Segoe UI',Arial,sans-serif;}
.mono{font-family:M,Consolas,monospace;}
</style>
<rect width="${w}" height="${h}" fill="${fundo}"/>
${body}
</svg>
`;
}

export const rect = (x, y, w, h, o = {}) => `<rect ${attrs({ x, y, width: w, height: h, rx: o.r, fill: o.fill ?? 'none', stroke: o.stroke, strokeWidth: o.sw ?? (o.stroke ? 1 : undefined), strokeDasharray: o.dash, opacity: o.opacity, fillOpacity: o.fo })}/>`;

export const line = (x1, y1, x2, y2, o = {}) => `<line ${attrs({ x1, y1, x2, y2, stroke: o.stroke ?? C.line, strokeWidth: o.sw ?? 1, strokeDasharray: o.dash, strokeLinecap: 'round' })}/>`;

export const circle = (cx, cy, r, o = {}) => `<circle ${attrs({ cx, cy, r, fill: o.fill ?? 'none', stroke: o.stroke, strokeWidth: o.sw, fillOpacity: o.fo })}/>`;

/**
 * Texto. o: { size=14, weight=400, fill, anchor='start', mono, ls (letter-spacing), tspans }.
 * Aceita `\n` para várias linhas (altura de linha `lh`, padrão 1.35 × size).
 */
export function text(x, y, s, o = {}) {
  const size = o.size ?? 14;
  const lines = String(s).split('\n');
  const lh = o.lh ?? Math.round(size * 1.35);
  const a = attrs({
    x,
    y,
    fontSize: size,
    fontWeight: o.weight ?? 400,
    fill: o.fill ?? C.ink,
    textAnchor: o.anchor,
    letterSpacing: o.ls,
    class: o.mono ? 'mono' : undefined,
    fontStyle: o.italic ? 'italic' : undefined,
    textDecoration: o.under ? 'underline' : undefined,
  });
  if (lines.length === 1) return `<text ${a}>${o.raw ? s : esc(s)}</text>`;
  return `<text ${a}>${lines.map((l, i) => `<tspan x="${x}" dy="${i ? lh : 0}">${esc(l)}</tspan>`).join('')}</text>`;
}

/** Ícone Lucide pelo nome do export (ex.: 'Lock', 'Database'). Canto superior esquerdo em (x, y). */
export function icon(name, x, y, size = 16, color = C.ink2, sw = 2) {
  const node = lucide[name];
  if (!node) throw new Error(`Ícone Lucide inexistente: ${name}`);
  const s = size / 24;
  const kids = node.map(([tag, a]) => `<${tag} ${attrs(a)}/>`).join('');
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${color}" stroke-width="${+(sw / s).toFixed(3)}" stroke-linecap="round" stroke-linejoin="round">${kids}</g>`;
}

/**
 * Janela de navegador: barra de abas + endereço. Devolve { svg, x, y, w, h } da área de conteúdo.
 * `cadeado` mostra HTTPS; `aviso` troca o cadeado por um alerta.
 */
export function browser({ x = 0, y = 0, w, h, url, aba = '', escuro = false, aviso = false }) {
  const bar = 76;
  const bg = escuro ? '#1F232B' : '#E9ECF1';
  const pill = escuro ? '#2B303A' : '#FFFFFF';
  const ink = escuro ? C.dInk2 : C.ink2;
  const svg = [
    rect(x, y, w, h, { fill: escuro ? C.dBg : C.panel }),
    rect(x, y, w, bar, { fill: bg }),
    circle(x + 20, y + 18, 6, { fill: '#FF5F57' }),
    circle(x + 40, y + 18, 6, { fill: '#FEBC2E' }),
    circle(x + 60, y + 18, 6, { fill: '#28C840' }),
    aba ? rect(x + 84, y + 6, 220, 30, { r: 8, fill: pill }) + text(x + 100, y + 26, aba, { size: 13, fill: ink }) : '',
    rect(x + 14, y + 42, w - 28, 26, { r: 13, fill: pill }),
    aviso ? icon('TriangleAlert', x + 26, y + 47, 16, C.amber) : icon('Lock', x + 26, y + 47, 16, ink),
    text(x + 50, y + 60, url, { size: 14, fill: escuro ? C.dInk : C.ink, mono: false }),
    line(x, y + bar, x + w, y + bar, { stroke: escuro ? C.dLine : C.lineStrong }),
  ].join('\n');
  return { svg, x, y: y + bar, w, h: h - bar };
}

/** Botão. tipo: 'primario' | 'secundario' | 'perigo' | 'fantasma'. Devolve SVG. */
export function button(x, y, label, o = {}) {
  const size = o.size ?? 14;
  const w = o.w ?? Math.round(label.length * size * 0.58 + 32 + (o.icone ? size + 8 : 0));
  const h = o.h ?? Math.round(size * 2.4);
  const t = o.tipo ?? 'primario';
  const cor = o.cor ?? C.blue;
  const fill = t === 'primario' ? cor : t === 'perigo' ? C.red : t === 'fantasma' ? 'none' : C.panel;
  const stroke = t === 'secundario' ? C.lineStrong : t === 'fantasma' ? 'none' : undefined;
  const ink = t === 'primario' || t === 'perigo' ? '#FFFFFF' : o.ink ?? C.ink;
  const ix = x + 16;
  const tx = o.icone ? ix + size + 8 : x + w / 2;
  return [
    rect(x, y, w, h, { r: o.r ?? 8, fill, stroke }),
    o.icone ? icon(o.icone, ix, y + (h - size) / 2, size, ink) : '',
    text(tx, y + h / 2 + size * 0.36, label, { size, weight: 560, fill: ink, anchor: o.icone ? undefined : 'middle' }),
  ].join('');
}

/** Campo de formulário com rótulo acima. */
export function field(x, y, w, label, valor = '', o = {}) {
  const size = o.size ?? 14;
  const h = o.h ?? 38;
  return [
    label ? text(x, y - 8, label, { size: size - 1, weight: 520, fill: C.ink2 }) : '',
    rect(x, y, w, h, { r: 7, fill: C.field, stroke: o.foco ? C.blue : C.lineStrong, sw: o.foco ? 2 : 1 }),
    text(x + 12, y + h / 2 + size * 0.36, valor || o.placeholder || '', { size, fill: valor ? C.ink : C.ink3, mono: o.mono }),
  ].join('');
}

/** Selo/etiqueta arredondada. */
export function badge(x, y, label, o = {}) {
  const size = o.size ?? 12;
  const w = o.w ?? Math.round(label.length * size * 0.6 + 18 + (o.icone ? size + 4 : 0));
  const h = Math.round(size * 2);
  return [
    rect(x, y, w, h, { r: h / 2, fill: o.fill ?? C.hover, stroke: o.stroke }),
    o.icone ? icon(o.icone, x + 8, y + (h - size) / 2, size, o.ink ?? C.ink2) : '',
    text(o.icone ? x + 12 + size : x + w / 2, y + h / 2 + size * 0.36, label, { size, weight: 560, fill: o.ink ?? C.ink2, anchor: o.icone ? undefined : 'middle' }),
  ].join('');
}

/** Interruptor liga/desliga. */
export function toggle(x, y, on, o = {}) {
  const cor = o.cor ?? C.blue;
  return rect(x, y, 36, 20, { r: 10, fill: on ? cor : C.lineStrong }) + circle(on ? x + 26 : x + 10, y + 10, 7, { fill: '#FFFFFF' });
}

/** Caixa de seleção. */
export function checkbox(x, y, on, o = {}) {
  const cor = o.cor ?? C.blue;
  return rect(x, y, 18, 18, { r: 4, fill: on ? cor : C.panel, stroke: on ? undefined : C.lineStrong }) + (on ? icon('Check', x + 2, y + 2, 14, '#FFFFFF', 3) : '');
}

/** Tabela simples: colunas [{ titulo, w }], linhas [[...]]. Células podem ser string ou { t, fill, weight, mono }. */
export function table(x, y, cols, rows, o = {}) {
  const rh = o.rh ?? 36;
  const size = o.size ?? 13;
  const w = cols.reduce((a, c) => a + c.w, 0);
  const out = [rect(x, y, w, rh * (rows.length + 1), { r: 6, fill: C.panel, stroke: C.line }), rect(x, y, w, rh, { fill: o.cabecalho ?? C.hover })];
  let cx = x;
  cols.forEach((c) => {
    out.push(text(cx + 12, y + rh / 2 + size * 0.36, c.titulo, { size, weight: 600, fill: C.ink2 }));
    cx += c.w;
  });
  rows.forEach((r, i) => {
    const ry = y + rh * (i + 1);
    out.push(line(x, ry, x + w, ry, { stroke: C.line }));
    if (o.destaque?.includes(i)) out.push(rect(x + 1, ry + 1, w - 2, rh - 2, { fill: o.destaqueCor ?? C.redBg }));
    let cx2 = x;
    r.forEach((cell, j) => {
      const c = typeof cell === 'string' ? { t: cell } : cell;
      out.push(text(cx2 + 12, ry + rh / 2 + size * 0.36, c.t, { size, fill: c.fill ?? C.ink, weight: c.weight, mono: c.mono }));
      cx2 += cols[j].w;
    });
  });
  return out.join('\n');
}

/** Cursor de mouse (seta) apontando em (x, y). */
export const cursor = (x, y) =>
  `<path d="M${x} ${y} l0 22 l6 -6 l4 9 l4 -2 l-4 -9 l8 0 z" fill="#111" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>`;

/** Selo discreto "Tela ilustrativa" (deixa claro que não é captura real). */
export const selo = (w, h, label = 'Tela ilustrativa') =>
  badge(w - Math.round(label.length * 11 * 0.6 + 18) - 12, h - 34, label, { size: 11, fill: 'rgba(20,24,32,0.72)', ink: '#E8EBF2' });
