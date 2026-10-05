import { createFragments } from '../engine/motion';
import type { CommonFields, SceneRequest, SlideCtx, SlideDef, SlideInstance } from '../engine/types';
import { h } from '../engine/dom';
import { cenaRequest } from '../engine/scenes';
import { attachTimer } from './parts/timer';

/** Cria a seção raiz de um slide. */
export function shell(type: string, ...children: Array<Node | null | undefined | false>): HTMLElement {
  return h(`section.slide.s-${type}`, { 'data-type': type }, ...children);
}

interface InstanceOpts {
  scene?: SceneRequest;
  /** Força o número de passos (senão = maior data-step). */
  steps?: number;
  onStep?(step: number, dir: 1 | -1 | 0): void;
  enter?(): void;
  leave?(): void;
  destroy?(): void;
  onKey?(key: string): boolean;
}

export function instance(el: HTMLElement, opts: InstanceOpts = {}): SlideInstance & { onKey?(key: string): boolean } {
  const frags = createFragments(el);
  return {
    el,
    steps: opts.steps ?? frags.max,
    scene: opts.scene,
    setStep(step, dir) {
      frags.apply(step, dir);
      opts.onStep?.(step, dir);
    },
    enter: opts.enter,
    leave: opts.leave,
    destroy: opts.destroy,
    onKey: opts.onKey,
  };
}

/**
 * Monta um SlideDef a partir de dados do arquétipo.
 * `cena` (nome) é convertido aqui em `scene`, então dentro do build basta usar `d.scene ?? padrão`.
 */
export function define<T extends CommonFields>(
  type: string,
  data: T,
  fallbackTitle: string,
  build: (data: T, ctx: SlideCtx) => SlideInstance,
  defaults: Partial<Pick<SlideDef, 'chrome' | 'scene' | 'video'>> = {},
): SlideDef {
  const d: T = data.cena && !data.scene ? { ...data, scene: cenaRequest(data.cena) } : data;
  return {
    type,
    title: d.title ?? fallbackTitle,
    notes: d.notes,
    chrome: d.chrome ?? defaults.chrome ?? true,
    scene: d.scene ?? defaults.scene,
    video: d.video ?? defaults.video,
    media: collectMedia(d),
    build: (ctx) => (d.cronometro ? attachTimer(build(d, ctx), d.cronometro, ctx) : build(d, ctx)),
  };
}

/** Coleta todos os caminhos "media/..." citados nos dados do slide (busca profunda). */
function collectMedia(data: unknown): string[] | undefined {
  const out = new Set<string>();
  const walk = (v: unknown, depth: number) => {
    if (depth > 6 || v === null || v === undefined) return;
    if (typeof v === 'string') {
      if (/^media\//.test(v)) out.add(v);
    } else if (Array.isArray(v)) v.forEach((x) => walk(x, depth + 1));
    else if (typeof v === 'object' && Object.getPrototypeOf(v) === Object.prototype) {
      Object.values(v as Record<string, unknown>).forEach((x) => walk(x, depth + 1));
    }
  };
  walk(data, 0);
  return out.size ? [...out] : undefined;
}

/** Converte "linha 1\nlinha 2" em texto plano de uma linha (para títulos curtos). */
export const flat = (s: string) => s.replace(/\n/g, ' ');

/**
 * Cabeçalho padrão dos slides de conteúdo: título (h1) no topo à esquerda + subtítulo opcional.
 * Fica fora da zona da câmera (máx. 1240 px de largura).
 */
export function header(titulo: string, subtitulo?: string, step = 0) {
  return h(
    'header.slide-head',
    h('h1.t-h1.slide-title', { 'data-step': step, 'data-delay': 0.1 }, titulo),
    subtitulo ? h('p.slide-sub', { 'data-step': step, 'data-delay': 0.22 }, subtitulo) : null,
  );
}

/** Linha de fonte (rodapé do conteúdo). "TODO-fonte" aparece em âmbar para não ser gravado por engano. */
export function sourceLine(fonte: string | undefined, step = 0, cls = '') {
  if (!fonte) return null;
  const todo = /TODO-fonte/i.test(fonte);
  return h(`p.source-line${todo ? '.is-todo' : ''}${cls ? '.' + cls : ''}`, { 'data-step': step, 'data-delay': 0.5 }, fonte);
}
