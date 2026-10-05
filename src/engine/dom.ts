type Attrs = Record<string, string | number | boolean | undefined | null>;
type Child = Node | string | number | null | undefined | false;

/** Cria elemento HTML: h('div.classe.outra', { 'data-step': 1 }, filhos...) */
export function h(tag: string, attrs?: Attrs | Child, ...children: Child[]): HTMLElement {
  const [name, ...classes] = tag.split('.');
  const el = document.createElement(name || 'div');
  if (classes.length) el.className = classes.join(' ');
  let kids = children;
  if (attrs instanceof Node || typeof attrs !== 'object' || attrs === null) {
    kids = [attrs as Child, ...children];
  } else {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k === 'class') el.className += (el.className ? ' ' : '') + String(v);
      else if (k === 'html') el.innerHTML = String(v);
      else if (k === 'style') el.setAttribute('style', String(v));
      else el.setAttribute(k, v === true ? '' : String(v));
    }
  }
  for (const c of kids) {
    if (c === null || c === undefined || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

/** Divide um texto em linhas explícitas (\n) envolvidas por máscara para revelação linha a linha. */
export function maskedLines(text: string, cls = ''): HTMLElement[] {
  return text.split('\n').map((line) =>
    h('span.line-mask', h(`span.line${cls ? '.' + cls : ''}`, line)),
  );
}

export function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}
