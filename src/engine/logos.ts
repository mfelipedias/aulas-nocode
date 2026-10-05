import type { SimpleIcon } from 'simple-icons';
import { h } from './dom';

/**
 * Logos oficiais baixados dos kits de imprensa (ver src/assets/logos/FONTES.md).
 * Arquivo src/assets/logos/oficiais/<id>.svg (ou .png) passa a ser usado automaticamente no lugar
 * do simple-icons ou do nome em texto.
 */
// Conteúdo (só para ler a proporção do viewBox) e URL (o SVG é exibido como <img>, isolado:
// assim estilos e ids internos dos arquivos oficiais, como .cls-1, não vazam para a página).
const OFFICIAL_SVG = import.meta.glob('../assets/logos/oficiais/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const OFFICIAL_SVG_URL = import.meta.glob('../assets/logos/oficiais/*.svg', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const OFFICIAL_PNG = import.meta.glob('../assets/logos/oficiais/*.png', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const byId = <T>(map: Record<string, T>, id: string, ext: string) =>
  Object.entries(map).find(([p]) => p.endsWith(`/${id}.${ext}`))?.[1];

/** Proporção largura/altura do viewBox de um SVG (1 se não der para ler). */
function svgAspect(svg: string): number {
  const vb = /viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(svg);
  if (vb) return Number(vb[1]) / Number(vb[2]) || 1;
  const w = /\swidth\s*=\s*["']([\d.]+)/i.exec(svg);
  const hh = /\sheight\s*=\s*["']([\d.]+)/i.exec(svg);
  return w && hh ? Number(w[1]) / Number(hh[1]) || 1 : 1;
}

export interface LogoSource {
  id: string;
  name: string;
  si?: SimpleIcon;
  /** Cor da marca para a luz difusa atrás do ladrilho. */
  hex?: string;
  /**
   * Marca com uso restrito (Google, Microsoft, Anthropic, OpenAI): as diretrizes pedem permissão
   * por escrito para usar o logo. Aparece só o nome em texto; use capturas feitas pelo professor.
   */
  restrita?: boolean;
  /** O logo oficial é colorido escuro e precisa de ladrilho claro (definido após conferir o arquivo). */
  fundoClaro?: boolean;
}

export type MarkKind = 'symbol' | 'wordmark' | 'text';

/** Tipo de marca disponível: símbolo (quadrado), wordmark (logo com o nome) ou só texto. */
export function markKind(src: LogoSource): MarkKind {
  if (src.restrita) return 'text';
  const svg = byId(OFFICIAL_SVG, src.id, 'svg');
  if (svg) return svgAspect(svg) > 1.7 ? 'wordmark' : 'symbol';
  if (byId(OFFICIAL_PNG, src.id, 'png')) return 'symbol';
  return src.si ? 'symbol' : 'text';
}

/** true se a plataforma tem marca gráfica disponível (oficial ou simple-icons). */
export function hasMark(src: LogoSource) {
  return markKind(src) !== 'text';
}

/**
 * Marca da plataforma. Ordem: SVG/PNG oficial > simple-icons (branco monocromático, permitido para
 * fundo escuro pela maioria das diretrizes) > nome em texto (nunca uma imitação do logo).
 * size = altura do símbolo em px; wordmarks usam ~45% dessa altura e largura livre.
 */
export function logoMark(src: LogoSource, size = 64): HTMLElement {
  const kind = markKind(src);
  if (kind === 'text') return h('span.logo-mark.logo-wordmark', { style: `--logo-size:${size}px` }, src.name);
  const svg = byId(OFFICIAL_SVG, src.id, 'svg');
  if (svg) {
    const aspect = svgAspect(svg);
    // Wordmarks: largura-alvo ~2,4x o tamanho do símbolo, altura no máx. 0,7x (n8n pede >= 100 px).
    const hgt = kind === 'wordmark' ? Math.min(size * 0.7, (size * 2.4) / aspect) : aspect > 1 ? size / aspect : size;
    return h(
      `span.logo-mark.logo-official.is-${kind}`,
      { style: `--logo-size:${size}px` },
      h('img', { src: byId(OFFICIAL_SVG_URL, src.id, 'svg')!, alt: src.name, style: `height:${hgt.toFixed(1)}px;width:${(hgt * aspect).toFixed(1)}px`, draggable: 'false' }),
    );
  }
  const png = byId(OFFICIAL_PNG, src.id, 'png');
  if (png) {
    return h('span.logo-mark.logo-official.is-symbol', { style: `--logo-size:${size}px` }, h('img', { src: png, alt: src.name }));
  }
  const wrap = h('span.logo-mark', { style: `--logo-size:${size}px`, role: 'img', 'aria-label': src.name });
  wrap.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true"><path d="${src.si!.path}" fill="currentColor"/></svg>`;
  return wrap;
}

export function brandGlow(src: LogoSource): string {
  const hex = (src.hex ?? src.si?.hex ?? '').replace('#', '');
  // Marcas pretas/cinza-escuras (Notion, v0, Cursor...) recebem luz neutra.
  if (!hex) return 'rgb(170 178 196 / 0.28)';
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (lum < 60) return 'rgb(170 178 196 / 0.28)';
  return `rgb(${r} ${g} ${b} / 0.45)`;
}

/**
 * Ladrilho de vidro com a marca e o nome (constelação, casos, grades, nós de fluxo).
 * size: altura do símbolo (48 constelação, 56 demo, 96 destaque).
 * Wordmarks e nomes em texto alargam o ladrilho e dispensam a legenda (o nome já está no logo).
 */
export function logoTile(src: LogoSource, size = 48, opts: { nome?: boolean; cls?: string } = {}): HTMLElement {
  const kind = markKind(src);
  const showName = opts.nome !== false && kind === 'symbol';
  return h(
    `div.ltile.is-${kind}${src.fundoClaro ? '.is-light' : ''}${opts.cls ? '.' + opts.cls : ''}`,
    { style: `--glow:${brandGlow(src)};--mark:${size}px`, 'data-id': src.id },
    h('div.ltile-box', h('span.ltile-glow'), logoMark(src, size)),
    showName ? h('div.ltile-name', src.name) : null,
  );
}
