import { gsap } from 'gsap';
import { h } from '../engine/dom';
import { brandGlow, logoMark, markKind } from '../engine/logos';
import { motion } from '../engine/motion';
import type { CommonFields } from '../engine/types';
import { CATEGORIES, PLATFORMS, platform, type CategoryId, type Platform } from '../content/platforms';
import { GROUPS, labelOffset, makeCamera, offsetToWorld, tileOffsets } from '../three/scenes/constellation-layout';
import { add, lerp, v3, type V3 } from '../engine/geom';
import { define, instance, shell } from './base';

export interface ConstellationData extends CommonFields {
  titulo: string;
  subtitulo?: string;
  /** Último passo: esmaece o resto e destaca estas plataformas (ex.: as da ementa). */
  destaque?: { rotulo: string; ids?: string[] };
  /** Ordem/seleção de categorias (padrão: todas). */
  categorias?: CategoryId[];
  /** Plataformas exibidas (padrão: as 19 do ecossistema base, sem as marcadas como `extra`). Máx. 4 por categoria. */
  ids?: string[];
  /**
   * Grupos próprios (substituem `categorias` e `ids`): rótulo, frase curta e até 4 plataformas cada,
   * em qualquer combinação. Até 5 grupos; cada um ocupa uma posição do mapa (`posicao`, padrão na ordem
   * sites, apps, automacao, dados, ia). Um grupo por passo, na ordem da lista.
   */
  grupos?: ConstellationGroup[];
}

export interface ConstellationGroup {
  /** Nome do grupo (até ~26 caracteres). */
  rotulo: string;
  /** Frase curta sob o nome (até ~34 caracteres). */
  desc?: string;
  /** Até 4 ids de content/platforms.ts. */
  ids: string[];
  /** Posição do aglomerado no mapa (uma das 5 âncoras). */
  posicao?: CategoryId;
}

interface TileState {
  p: Platform;
  el: HTMLElement;
  world: V3;
  from: V3;
  appear: { v: number };
  dim: { v: number };
  group: number;
}

/** Arquétipo 5 — Constelação de logos por categoria. */
export function constellation(data: ConstellationData) {
  return define(
    'constellation',
    data,
    data.titulo,
    (d, ctx) => {
      // Aglomerados: grupos próprios ou categorias padrão (cada um numa âncora do mapa).
      type Cluster = { label: string; desc: string; slot: (typeof GROUPS)[number]; plats: Platform[] };
      let clusters: Cluster[];
      if (d.grupos?.length) {
        const free = GROUPS.map((g) => g.id).filter((id) => !d.grupos!.some((x) => x.posicao === id));
        clusters = d.grupos.slice(0, 5).map((g) => {
          const pos = g.posicao ?? free.shift()!;
          return { label: g.rotulo, desc: g.desc ?? '', slot: GROUPS.find((x) => x.id === pos)!, plats: g.ids.slice(0, 4).map(platform) };
        });
      } else {
        clusters = (d.categorias ?? CATEGORIES.map((c) => c.id)).map((id) => {
          const cat = CATEGORIES.find((c) => c.id === id)!;
          return {
            label: cat.label,
            desc: cat.desc,
            slot: GROUPS.find((g) => g.id === id)!,
            plats: PLATFORMS.filter((p) => p.category === id && (d.ids ? d.ids.includes(p.id) : !p.extra)),
          };
        });
      }
      const highlightIds = new Set(d.destaque?.ids ?? PLATFORMS.filter((p) => p.disciplina).map((p) => p.id));
      const N = clusters.length;
      const finalStep = d.destaque ? N + 1 : N;

      const layer = h('div.const-layer', { 'aria-hidden': 'false' });
      const tiles: TileState[] = [];
      const labels: Array<{ el: HTMLElement; world: V3; appear: { v: number } }> = [];

      clusters.forEach((cl, gi) => {
        const g = cl.slot;
        const plats = cl.plats;
        // Ladrilhos largos (wordmark ou nome em texto) pedem mais espaço entre colunas.
        const widest = Math.max(0, ...plats.map((p) => (markKind(p) === 'symbol' ? 88 : p.name.length * 13 + 44)));
        const offs = tileOffsets(g.shape, plats.length, Math.max(180, widest + 32));
        plats.forEach((p, i) => {
          const tileEl = h(
            `div.tile.is-${markKind(p)}${p.fundoClaro ? '.is-light' : ''}`,
            { 'data-id': p.id, style: `--glow:${brandGlow(p)}` },
            h('div.tile-box', h('span.tile-glow'), logoMark(p, 48)),
            h('div.tile-name', p.name),
          );
          layer.append(tileEl);
          const world = offsetToWorld(g.anchor, offs[i][0], offs[i][1]);
          const from = add(world, v3((Math.random() - 0.5) * 6, -2 - Math.random() * 3, -34 - Math.random() * 10));
          tiles.push({ p, el: tileEl, world, from, appear: { v: 0 }, dim: { v: 1 }, group: gi });
        });
        const lo = labelOffset(g.shape, plats.length);
        const labelEl = h('div.cluster-label', h('span.cluster-name', cl.label), cl.desc ? h('span.cluster-desc', cl.desc) : null);
        layer.append(labelEl);
        labels.push({ el: labelEl, world: offsetToWorld(g.anchor, lo[0], lo[1]), appear: { v: 0 } });
      });

      const destaqueEl = d.destaque
        ? h('p.const-destaque', { 'data-step': finalStep }, h('span.const-destaque-mark'), d.destaque.rotulo)
        : null;

      const el = shell(
        'constellation',
        layer,
        h(
          'header.const-head',
          h('h1.t-h1', { 'data-step': 0, 'data-delay': 0.2 }, d.titulo),
          d.subtitulo ? h('p.const-sub', { 'data-step': 0, 'data-delay': 0.35 }, d.subtitulo) : null,
        ),
        destaqueEl,
      );

      // Câmera estática para miniaturas/PDF (mesma geometria da cena 3D, sem Three.js).
      const staticCam = makeCamera();
      const refDepth = staticCam.position.z;
      const project = (p: V3) => (ctx.gl?.hasCamera ? ctx.gl.projectPoint(p) : staticCam.project(p));

      function layout() {
        for (const t of tiles) {
          const a = t.appear.v;
          const pr = project(lerp(t.from, t.world, a));
          const s = Math.min(1.25, Math.max(0.35, refDepth / pr.dist));
          const op = Math.min(1, a * 1.4) * t.dim.v;
          t.el.style.transform = `translate3d(${pr.x.toFixed(1)}px, ${pr.y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${s.toFixed(3)})`;
          t.el.style.opacity = op.toFixed(3);
          t.el.style.zIndex = String(Math.round(1000 - pr.dist * 10));
        }
        for (const l of labels) {
          const pr = project(l.world);
          l.el.style.transform = `translate3d(${pr.x.toFixed(1)}px, ${pr.y.toFixed(1)}px, 0) translate(-50%, -50%)`;
          l.el.style.opacity = l.appear.v.toFixed(3);
        }
      }

      let unhook: (() => void) | null = null;

      function applyStep(step: number, dir: 1 | -1 | 0) {
        const animate = dir === 1 && !motion.reduced && ctx.mode === 'live';
        tiles.forEach((t) => {
          const visible = step >= t.group + 1;
          gsap.killTweensOf(t.appear);
          if (visible && t.appear.v < 1 && animate && step === t.group + 1) {
            const order = tiles.filter((x) => x.group === t.group).indexOf(t);
            gsap.to(t.appear, { v: 1, duration: 2.0, ease: 'expo.out', delay: 0.15 + order * 0.12 });
          } else if (!animate || !visible) {
            if (dir === -1 && !visible && t.appear.v > 0) gsap.to(t.appear, { v: 0, duration: 0.4, ease: 'power2.in' });
            else t.appear.v = visible ? 1 : 0;
          }
          const highlight = d.destaque && step >= finalStep;
          const dimTarget = highlight && !highlightIds.has(t.p.id) ? 0.28 : 1;
          gsap.killTweensOf(t.dim);
          if (animate || dir === -1) gsap.to(t.dim, { v: dimTarget, duration: 0.8, ease: 'power2.inOut' });
          else t.dim.v = dimTarget;
          t.el.classList.toggle('is-focus', Boolean(highlight && highlightIds.has(t.p.id)));
        });
        labels.forEach((l, gi) => {
          const visible = step >= gi + 1;
          gsap.killTweensOf(l.appear);
          if (animate && visible && l.appear.v < 1) gsap.to(l.appear, { v: 1, duration: 0.8, ease: 'power2.out', delay: 0.6 });
          else if (dir === -1 && !visible) gsap.to(l.appear, { v: 0, duration: 0.3 });
          else l.appear.v = visible ? 1 : 0;
        });
        el.classList.toggle('is-highlight', Boolean(d.destaque && step >= finalStep));
        if (!ctx.gl) layout();
      }

      const inst = instance(el, {
        steps: finalStep,
        // A cena liga o núcleo a cada âncora na mesma ordem em que os grupos aparecem.
        scene: d.scene ?? { key: 'constellation', params: { order: clusters.map((c) => GROUPS.indexOf(c.slot)) } },
        onStep: applyStep,
        enter() {
          if (ctx.gl) unhook = ctx.gl.onFrame(layout);
        },
        leave() {
          unhook?.();
          unhook = null;
        },
        destroy() {
          unhook?.();
        },
      });
      return inst;
    },
    { chrome: false },
  );
}
