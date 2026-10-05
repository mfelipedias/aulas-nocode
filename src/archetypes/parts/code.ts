import { h } from '../../engine/dom';

/**
 * Realce de sintaxe próprio (sem dependência), pensado para trechos curtos de slide.
 * Linguagens: json, js, ts, html, css, http, sql, bash, texto.
 */
export type Linguagem = 'json' | 'js' | 'ts' | 'html' | 'css' | 'http' | 'sql' | 'bash' | 'texto';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const span = (cls: string, s: string) => `<span class="tk-${cls}">${esc(s)}</span>`;

type Rule = [RegExp, string | ((m: RegExpExecArray) => string)];

function run(line: string, rules: Rule[]): string {
  let out = '';
  let i = 0;
  outer: while (i < line.length) {
    for (const [re, cls] of rules) {
      re.lastIndex = i;
      const m = re.exec(line);
      if (m && m.index === i && m[0].length > 0) {
        out += typeof cls === 'string' ? span(cls, m[0]) : cls(m);
        i += m[0].length;
        continue outer;
      }
    }
    out += esc(line[i]);
    i++;
  }
  return out;
}

const y = (src: string) => new RegExp(src, 'y');

const JSON_RULES: Rule[] = [
  [y(String.raw`"(?:\\.|[^"\\])*"(?=\s*:)`), 'key'],
  [y(String.raw`"(?:\\.|[^"\\])*"`), 'str'],
  [y(String.raw`-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?`), 'num'],
  [y(String.raw`\b(?:true|false|null)\b`), 'kw'],
  [y(String.raw`[{}\[\],:]`), 'pun'],
];

const JS_KW =
  'const|let|var|function|return|if|else|for|while|await|async|new|import|from|export|default|class|extends|try|catch|throw|of|in|typeof|interface|type|true|false|null|undefined|this';
const JS_RULES: Rule[] = [
  [y(String.raw`\/\/.*`), 'com'],
  [y(String.raw`\/\*.*?\*\/`), 'com'],
  [y(String.raw`'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\x60(?:\\.|[^\x60\\])*\x60`), 'str'],
  [y(String.raw`\b(?:${JS_KW})\b`), 'kw'],
  [y(String.raw`\b\d+(?:\.\d+)?\b`), 'num'],
  [y(String.raw`[A-Za-z_$][\w$]*(?=\s*\()`), 'fn'],
  [y(String.raw`[A-Za-z_$][\w$]*(?=\s*:)`), 'key'],
  [y(String.raw`[{}\[\]();,.:=<>+\-*/!?&|]+`), 'pun'],
];

const HTML_RULES: Rule[] = [
  [y(String.raw`<!--.*?-->`), 'com'],
  [y(String.raw`<\/?[A-Za-z][\w-]*`), 'tag'],
  [y(String.raw`\/?>`), 'tag'],
  [y(String.raw`[A-Za-z-:@]+(?==)`), 'attr'],
  [y(String.raw`"[^"]*"|'[^']*'`), 'str'],
];

const CSS_RULES: Rule[] = [
  [y(String.raw`\/\*.*?\*\/`), 'com'],
  [y(String.raw`[\w-]+(?=\s*:)`), 'key'],
  [y(String.raw`#[0-9a-fA-F]{3,8}\b`), 'num'],
  [y(String.raw`-?\d+(?:\.\d+)?(?:px|rem|em|%|s|ms|vh|vw)?`), 'num'],
  [y(String.raw`"[^"]*"|'[^']*'`), 'str'],
  [y(String.raw`[.#]?[A-Za-z_][\w-]*(?=[^;{}]*\{)`), 'tag'],
  [y(String.raw`[{}();:,]`), 'pun'],
];

const SQL_KW =
  'SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|PRIMARY|KEY|FOREIGN|REFERENCES|JOIN|LEFT|RIGHT|INNER|ON|AND|OR|NOT|NULL|ORDER|BY|GROUP|LIMIT|AS|INT|INTEGER|TEXT|VARCHAR|BOOLEAN|DATE|TIMESTAMP|DEFAULT|COUNT|DISTINCT';
const SQL_RULES: Rule[] = [
  [y(String.raw`--.*`), 'com'],
  [new RegExp(String.raw`\b(?:${SQL_KW})\b`, 'iy'), 'kw'],
  [y(String.raw`'(?:''|[^'])*'`), 'str'],
  [y(String.raw`\b\d+(?:\.\d+)?\b`), 'num'],
  [y(String.raw`[(),;*=<>.]`), 'pun'],
];

const BASH_RULES: Rule[] = [
  [y(String.raw`#.*`), 'com'],
  [y(String.raw`"(?:\\.|[^"\\])*"|'[^']*'`), 'str'],
  [y(String.raw`\$\{?[\w]+\}?`), 'key'],
  [y(String.raw`(?<=^\s*)[\w.-]+`), 'fn'],
  [y(String.raw`\s--?[\w-]+`), 'kw'],
  [y(String.raw`[|&;><]+`), 'pun'],
];

function highlightHttp(lines: string[]): string[] {
  let body = false;
  return lines.map((line, i) => {
    if (body) return run(line, JSON_RULES);
    if (line.trim() === '') {
      body = true;
      return '';
    }
    if (i === 0) {
      const req = /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)(\s+)(\S+)(.*)$/.exec(line);
      if (req) return span('kw', req[1]) + req[2] + span('str', req[3]) + span('com', req[4]);
      const res = /^(HTTP\/[\d.]+)(\s+)(\d{3})(.*)$/.exec(line);
      if (res) return span('com', res[1]) + res[2] + span('num', res[3]) + span('kw', res[4]);
    }
    const hdr = /^([\w-]+)(:)(.*)$/.exec(line);
    if (hdr) return span('key', hdr[1]) + span('pun', hdr[2]) + esc(hdr[3]);
    return esc(line);
  });
}

/** Devolve o HTML realçado de cada linha. */
export function highlight(code: string, lang: Linguagem): string[] {
  const lines = code.replace(/\t/g, '  ').split('\n');
  switch (lang) {
    case 'json':
      return lines.map((l) => run(l, JSON_RULES));
    case 'js':
    case 'ts':
      return lines.map((l) => run(l, JS_RULES));
    case 'html':
      return lines.map((l) => run(l, HTML_RULES));
    case 'css':
      return lines.map((l) => run(l, CSS_RULES));
    case 'sql':
      return lines.map((l) => run(l, SQL_RULES));
    case 'bash':
      return lines.map((l) => run(l, BASH_RULES));
    case 'http':
      return highlightHttp(lines);
    default:
      return lines.map(esc);
  }
}

/** Remove a indentação comum (permite escrever o código indentado dentro do template string). */
export function dedent(code: string): string {
  const lines = code.replace(/^\n+|\s+$/g, '').split('\n');
  const ind = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length));
  return lines.map((l) => l.slice(ind)).join('\n');
}

/** "3-5" | "3,7" | [3, 4] -> conjunto de números de linha (1-based). */
export function parseLines(spec: string | number | number[] | undefined): Set<number> {
  const out = new Set<number>();
  if (spec === undefined) return out;
  if (typeof spec === 'number') return out.add(spec);
  if (Array.isArray(spec)) {
    spec.forEach((n) => out.add(n));
    return out;
  }
  for (const part of spec.split(',')) {
    const [a, b] = part.split('-').map((x) => Number(x.trim()));
    if (!Number.isFinite(a)) continue;
    for (let n = a; n <= (Number.isFinite(b) ? b : a); n++) out.add(n);
  }
  return out;
}

export interface CodePanel {
  el: HTMLElement;
  lines: HTMLElement[];
  /** null = todas as linhas normais; conjunto = essas em destaque e o resto esmaecido. */
  focus(lines: Set<number> | null): void;
}

export function codePanel(opts: {
  codigo: string;
  linguagem: Linguagem;
  arquivo?: string;
  /** 'normal' = 28 px (arquétipo código); 'compacto' = 24 px (painéis menores). */
  tamanho?: 'normal' | 'compacto';
  numeros?: boolean;
}): CodePanel {
  const src = dedent(opts.codigo);
  const html = highlight(src, opts.linguagem);
  const showNums = opts.numeros !== false;
  const lines = html.map((l, i) =>
    h('div.code-line', { 'data-n': i + 1 }, showNums ? h('span.code-n', String(i + 1)) : null, h('span.code-text', { html: l || ' ' })),
  );
  const el = h(
    `div.code-panel.is-${opts.tamanho ?? 'normal'}`,
    opts.arquivo
      ? h('div.code-bar', h('span.browser-dots', h('i'), h('i'), h('i')), h('span.code-file', opts.arquivo), opts.linguagem !== 'texto' ? h('span.code-lang', opts.linguagem.toUpperCase()) : null)
      : null,
    h('div.code-body', ...lines),
  );
  return {
    el,
    lines,
    focus(set) {
      el.classList.toggle('has-focus', Boolean(set && set.size));
      lines.forEach((ln, i) => ln.classList.toggle('is-on', Boolean(set?.has(i + 1))));
    },
  };
}
