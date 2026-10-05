import { gsap } from 'gsap';
import type { IconNode } from 'lucide';
import { h } from '../../engine/dom';
import { icon } from '../../engine/icons';
import { logoMark, markKind } from '../../engine/logos';
import { motion } from '../../engine/motion';
import { platform } from '../../content/platforms';

/* =====================================================================
   Diagramas desenhados a partir de dados: caixas (DOM nítido) + setas (SVG).
   Tudo é calculado em px do palco, sem medir o DOM: funciona igual em
   miniaturas, PDF e no apresentador.
   ===================================================================== */

const SVGNS = 'http://www.w3.org/2000/svg';
const svgEl = (tag: string, attrs: Record<string, string | number>) => {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
};

function arrowDefs(id: string) {
  const defs = svgEl('defs', {});
  for (const [suffix, cls] of [
    ['', 'arrow-head'],
    ['-on', 'arrow-head is-on'],
  ] as const) {
    const marker = svgEl('marker', {
      id: `${id}${suffix}`,
      viewBox: '0 0 12 12',
      refX: 10,
      refY: 6,
      markerWidth: 12,
      markerHeight: 12,
      markerUnits: 'userSpaceOnUse',
      orient: 'auto-start-reverse',
    });
    marker.append(svgEl('path', { d: 'M1 1.5 L10.5 6 L1 10.5 Z', class: cls }));
    defs.append(marker);
  }
  return defs;
}

let uid = 0;

/* ---------------------------- Fluxo ---------------------------- */

export interface FlowNode {
  id: string;
  rotulo: string;
  /** Linha de apoio curta (até ~28 caracteres). */
  sub?: string;
  icone?: IconNode;
  /** id de content/platforms.ts: mostra o logo no lugar do ícone. */
  plataforma?: string;
  /** Rótulo pequeno acima do nome (ex.: "Gatilho", "Módulo 2"). Use só quando informa algo. */
  tag?: string;
  /** Visual: 'gatilho' (borda na cor da aula), 'dado' (fundo afundado), 'externo' (tracejado). */
  tipo?: 'padrao' | 'gatilho' | 'dado' | 'externo';
  /** Posição na grade (coluna/linha, começando em 0). Padrão: coluna = ordem, linha = 0. */
  col?: number;
  linha?: number;
}

export interface FlowEdge {
  de: string;
  para: string;
  /** Texto curto sobre a seta (até ~18 caracteres). */
  rotulo?: string;
  tracejada?: boolean;
}

export interface FlowData {
  nos: FlowNode[];
  ligacoes: FlowEdge[];
}

export interface FlowView {
  el: HTMLElement;
  /** Mostra os nós cujo passo <= step, e as setas entre nós visíveis. */
  setStep(step: number, dir: 1 | -1 | 0): void;
  /** Destaca nós (e setas entre eles); null limpa. */
  highlight(ids: string[] | null): void;
}

export function renderFlow(
  data: FlowData,
  box: { w: number; h: number },
  opts: { nodeW?: number; nodeH?: number; stepOf?: (id: string, index: number) => number; compact?: boolean } = {},
): FlowView {
  const id = `fl${++uid}`;
  const NW = opts.nodeW ?? (opts.compact ? 250 : 340);
  const NH = opts.nodeH ?? (opts.compact ? 116 : 150);
  const nodes = data.nos.map((n, i) => ({ ...n, col: n.col ?? i, linha: n.linha ?? 0 }));
  const cols = Math.max(...nodes.map((n) => n.col)) + 1;
  const rows = Math.max(...nodes.map((n) => n.linha)) + 1;
  const pitchX = cols > 1 ? Math.min(NW + 160, (box.w - NW) / (cols - 1)) : 0;
  const pitchY = rows > 1 ? Math.min(NH + 110, (box.h - NH) / (rows - 1)) : 0;
  const totalW = (cols - 1) * pitchX + NW;
  const totalH = (rows - 1) * pitchY + NH;
  const ox = (box.w - totalW) / 2;
  const oy = (box.h - totalH) / 2;
  const pos = new Map(nodes.map((n) => [n.id, { x: ox + n.col * pitchX, y: oy + n.linha * pitchY, col: n.col, linha: n.linha }]));

  const root = h(`div.flow${opts.compact ? '.is-compact' : ''}`, { style: `width:${box.w}px;height:${box.h}px` });
  const svg = svgEl('svg', { class: 'flow-svg', width: box.w, height: box.h, viewBox: `0 0 ${box.w} ${box.h}` });
  svg.append(arrowDefs(id));
  root.append(svg);

  const stepOf = opts.stepOf ?? ((_id: string, i: number) => i);
  const nodeEls = new Map<string, { el: HTMLElement; step: number }>();
  nodes.forEach((n, i) => {
    const p = pos.get(n.id)!;
    const plat = n.plataforma ? platform(n.plataforma) : null;
    // Wordmark (logo com o nome) ou nome em texto: linha própria acima do rótulo, ~26 px de altura.
    const wide = plat ? markKind(plat) !== 'symbol' : false;
    const mark = plat
      ? logoMark(plat, wide ? (opts.compact ? 34 : 40) : opts.compact ? 36 : 44)
      : n.icone
        ? icon(n.icone, opts.compact ? 32 : 40, 'icon fnode-icon')
        : null;
    const el = h(
      `div.fnode.is-${n.tipo ?? 'padrao'}${wide ? '.has-wordmark' : ''}`,
      { style: `left:${p.x}px;top:${p.y}px;width:${NW}px;height:${NH}px` },
      mark ? h('div.fnode-mark', mark) : null,
      h('div.fnode-text', n.tag ? h('span.fnode-tag', n.tag) : null, h('span.fnode-label', n.rotulo), n.sub ? h('span.fnode-sub', n.sub) : null),
    );
    root.append(el);
    nodeEls.set(n.id, { el, step: stepOf(n.id, i) });
  });

  const edges = data.ligacoes.map((e) => {
    const a = pos.get(e.de);
    const b = pos.get(e.para);
    if (!a || !b) throw new Error(`Ligação com nó inexistente: ${e.de} -> ${e.para}`);
    let d: string;
    let mid: { x: number; y: number };
    if (b.col > a.col) {
      const x1 = a.x + NW;
      const y1 = a.y + NH / 2;
      const x2 = b.x - 4;
      const y2 = b.y + NH / 2;
      const dx = Math.max(40, (x2 - x1) * 0.5);
      d = `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}`;
      mid = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
    } else if (b.col < a.col) {
      // retorno: passa por baixo
      const x1 = a.x + NW / 2;
      const y1 = a.y + NH;
      const x2 = b.x + NW / 2;
      const y2 = b.y + NH + 4;
      const low = Math.max(y1, y2) + 70;
      d = `M${x1} ${y1} C${x1} ${low} ${x2} ${low} ${x2} ${y2}`;
      mid = { x: (x1 + x2) / 2, y: low - 18 };
    } else {
      const down = b.linha > a.linha;
      const x1 = a.x + NW / 2;
      const y1 = down ? a.y + NH : a.y;
      const x2 = b.x + NW / 2;
      const y2 = down ? b.y - 4 : b.y + NH + 4;
      d = `M${x1} ${y1} L${x2} ${y2}`;
      mid = { x: x1, y: (y1 + y2) / 2 };
    }
    const path = svgEl('path', {
      d,
      class: `flow-edge${e.tracejada ? ' is-dashed' : ''}`,
      pathLength: 1,
      'marker-end': `url(#${id})`,
    }) as SVGPathElement;
    path.dataset.marker = `url(#${id})`;
    svg.append(path);
    const label = e.rotulo ? h('span.flow-label', { style: `left:${mid.x}px;top:${mid.y}px` }, e.rotulo) : null;
    if (label) root.append(label);
    const pulse = h('span.flow-pulse', { style: `offset-path: path('${d}')` });
    root.append(pulse);
    return { e, path, label, pulse, shown: false };
  });

  const visibleAt = (nid: string, step: number) => (nodeEls.get(nid)?.step ?? 0) <= step;

  function setEdge(ed: (typeof edges)[number], show: boolean, animate: boolean) {
    const p = ed.path;
    gsap.killTweensOf([p, ed.label, ed.pulse].filter(Boolean));
    if (show && !ed.shown && animate && !motion.reduced) {
      p.removeAttribute('marker-end');
      gsap.fromTo(p, { strokeDashoffset: 1, autoAlpha: 1 }, {
        strokeDashoffset: 0,
        duration: 0.9,
        ease: 'power2.inOut',
        delay: 0.15,
        onComplete: () => p.setAttribute('marker-end', p.dataset.marker!),
      });
      if (ed.label) gsap.fromTo(ed.label, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, delay: 0.7 });
      gsap.fromTo(ed.pulse, { offsetDistance: '0%', autoAlpha: 1 }, { offsetDistance: '100%', duration: 1.0, ease: 'power1.inOut', delay: 0.35 });
      gsap.to(ed.pulse, { autoAlpha: 0, duration: 0.25, delay: 1.3 });
    } else {
      gsap.set(p, { strokeDashoffset: show ? 0 : 1, autoAlpha: show ? 1 : 0 });
      p.setAttribute('marker-end', p.dataset.marker!);
      if (ed.label) gsap.set(ed.label, { autoAlpha: show ? 1 : 0 });
      gsap.set(ed.pulse, { autoAlpha: 0 });
    }
    ed.shown = show;
  }

  let lastStep = -1;
  return {
    el: root,
    setStep(step, dir) {
      const animate = dir === 1;
      nodeEls.forEach(({ el, step: s }) => {
        const show = s <= step;
        const was = s <= lastStep;
        gsap.killTweensOf(el);
        if (show && (!was || lastStep < 0) && animate && !motion.reduced) {
          gsap.fromTo(el, { autoAlpha: 0, y: 16, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'expo.out' });
        } else gsap.set(el, { autoAlpha: show ? 1 : 0, y: 0, scale: 1 });
        el.classList.toggle('is-new', show && s === step && step > 0);
      });
      edges.forEach((ed) => setEdge(ed, visibleAt(ed.e.de, step) && visibleAt(ed.e.para, step), animate));
      lastStep = step;
    },
    highlight(ids) {
      const set = ids ? new Set(ids) : null;
      root.classList.toggle('has-focus', Boolean(set));
      nodeEls.forEach(({ el }, nid) => el.classList.toggle('is-focus', Boolean(set?.has(nid))));
      edges.forEach((ed) => {
        const on = Boolean(set?.has(ed.e.de) && set?.has(ed.e.para));
        ed.path.classList.toggle('is-on', on);
        ed.path.dataset.marker = `url(#${id}${on ? '-on' : ''})`;
        if (ed.path.hasAttribute('marker-end')) ed.path.setAttribute('marker-end', ed.path.dataset.marker);
      });
    },
  };
}

/* ---------------------------- Modelo de dados ---------------------------- */

export interface Campo {
  nome: string;
  /** Tipo do campo como aparece na ferramenta (ex.: "text", "number", "User", "date"). */
  tipo: string;
  /** 'pk' = identificador; 'fk' = referência a outra entidade. */
  chave?: 'pk' | 'fk';
}

export interface Entidade {
  id: string;
  nome: string;
  /** Até 7 campos por entidade. */
  campos: Campo[];
  col?: number;
  linha?: number;
  icone?: IconNode;
}

export interface Relacao {
  /** "Entidade.campo" (o campo da linha de onde sai a ligação). */
  de: string;
  para: string;
  /** Ex.: "1:N", "N:1", "1:1", "N:N". */
  cardinalidade: string;
  rotulo?: string;
}

export interface ModelView {
  el: HTMLElement;
  setStep(step: number, dir: 1 | -1 | 0): void;
}

export function renderModel(
  data: { entidades: Entidade[]; relacoes: Relacao[] },
  box: { w: number; h: number },
  stepOf: (id: string, i: number) => number,
): ModelView {
  const id = `md${++uid}`;
  const CW = 420;
  const HEAD = 76;
  const ROW = 54;
  const ents = data.entidades.map((e, i) => ({ ...e, col: e.col ?? i, linha: e.linha ?? 0 }));
  const cols = Math.max(...ents.map((e) => e.col)) + 1;
  const pitchX = cols > 1 ? Math.min(CW + 260, (box.w - CW) / (cols - 1)) : 0;
  const totalW = (cols - 1) * pitchX + CW;
  const ox = (box.w - totalW) / 2;
  const heights = ents.map((e) => HEAD + e.campos.length * ROW + 12);
  const rowsY = new Map<number, number>();
  // linhas da grade: altura da maior entidade da linha anterior + 64
  const maxLinha = Math.max(...ents.map((e) => e.linha));
  let yAcc = 0;
  for (let l = 0; l <= maxLinha; l++) {
    rowsY.set(l, yAcc);
    const hMax = Math.max(0, ...ents.map((e, i) => (e.linha === l ? heights[i] : 0)));
    yAcc += hMax + 64;
  }
  const totalH = yAcc - 64;
  const oy = Math.max(0, (box.h - totalH) / 2);
  const geo = new Map(ents.map((e) => [e.id, { x: ox + e.col * pitchX, y: oy + rowsY.get(e.linha)! }]));

  const root = h('div.model', { style: `width:${box.w}px;height:${box.h}px` });
  const svg = svgEl('svg', { class: 'flow-svg', width: box.w, height: box.h, viewBox: `0 0 ${box.w} ${box.h}` });
  svg.append(arrowDefs(id));
  root.append(svg);

  const cards = ents.map((e, i) => {
    const g = geo.get(e.id)!;
    const el = h(
      'div.entity',
      { style: `left:${g.x}px;top:${g.y}px;width:${CW}px` },
      h('div.entity-head', e.icone ? icon(e.icone, 32, 'icon entity-icon') : null, h('span.entity-name', e.nome)),
      h(
        'div.entity-fields',
        ...e.campos.map((c) =>
          h(
            `div.entity-field${c.chave ? '.is-' + c.chave : ''}`,
            h('span.field-name', c.nome),
            h('span.field-type', c.tipo),
          ),
        ),
      ),
    );
    root.append(el);
    return { e, el, step: stepOf(e.id, i) };
  });

  const fieldPoint = (ref: string, side: 'l' | 'r') => {
    const [en, fn] = ref.split('.');
    const e = ents.find((x) => x.id === en || x.nome === en);
    if (!e) throw new Error(`Relação com entidade inexistente: ${ref}`);
    const g = geo.get(e.id)!;
    const fi = Math.max(0, e.campos.findIndex((c) => c.nome === fn));
    return { x: side === 'r' ? g.x + CW : g.x, y: g.y + HEAD + fi * ROW + ROW / 2, e };
  };

  const rels = data.relacoes.map((r) => {
    const aL = fieldPoint(r.de, 'l');
    const bL = fieldPoint(r.para, 'l');
    const aRight = aL.x < bL.x;
    const a = aRight ? fieldPoint(r.de, 'r') : aL;
    const b = aRight ? bL : fieldPoint(r.para, 'r');
    const dx = Math.max(60, Math.abs(b.x - a.x) * 0.45) * (aRight ? 1 : -1);
    const d = `M${a.x} ${a.y} C${a.x + dx} ${a.y} ${b.x - dx} ${b.y} ${b.x + (aRight ? -4 : 4)} ${b.y}`;
    const path = svgEl('path', { d, class: 'flow-edge is-model', pathLength: 1 });
    svg.append(path);
    const [ca, cb] = r.cardinalidade.split(':');
    const off = aRight ? 18 : -18;
    const la = h('span.card-label', { style: `left:${a.x + off}px;top:${a.y - 26}px` }, ca ?? '');
    const lb = h('span.card-label', { style: `left:${b.x - off}px;top:${b.y - 26}px` }, cb ?? '');
    const mid = r.rotulo ? h('span.flow-label', { style: `left:${(a.x + b.x) / 2}px;top:${(a.y + b.y) / 2}px` }, r.rotulo) : null;
    root.append(la, lb);
    if (mid) root.append(mid);
    return { r, path, extras: [la, lb, mid].filter(Boolean) as HTMLElement[], ea: aL.e.id, eb: bL.e.id };
  });

  return {
    el: root,
    setStep(step, dir) {
      const animate = dir === 1 && !motion.reduced;
      const vis = new Set(cards.filter((c) => c.step <= step).map((c) => c.e.id));
      cards.forEach((c) => {
        const show = c.step <= step;
        gsap.killTweensOf(c.el);
        if (show && animate && c.step === step) gsap.fromTo(c.el, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'expo.out' });
        else gsap.set(c.el, { autoAlpha: show ? 1 : 0, y: 0 });
      });
      rels.forEach((rl) => {
        const show = vis.has(rl.ea) && vis.has(rl.eb);
        const wasHidden = rl.path.dataset.shown !== '1';
        gsap.killTweensOf([rl.path, ...rl.extras]);
        if (show && wasHidden && animate) {
          gsap.fromTo(rl.path, { strokeDashoffset: 1, autoAlpha: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', delay: 0.4 });
          gsap.fromTo(rl.extras, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, delay: 1.0 });
        } else {
          gsap.set(rl.path, { strokeDashoffset: show ? 0 : 1, autoAlpha: show ? 1 : 0 });
          gsap.set(rl.extras, { autoAlpha: show ? 1 : 0 });
        }
        rl.path.dataset.shown = show ? '1' : '0';
      });
    },
  };
}
