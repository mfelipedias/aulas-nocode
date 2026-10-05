import { gsap } from 'gsap';
import { h } from '../engine/dom';
import { logoMark, markKind } from '../engine/logos';
import { motion } from '../engine/motion';
import type { CommonFields } from '../engine/types';
import { platform } from '../content/platforms';
import { define, instance, shell, sourceLine } from './base';
import { mediaStack, type Midia, type Regiao } from './parts/media';
import { frame, type Moldura } from './parts/visual';

export interface ShowcaseNote {
  /** Posição do marcador numerado sobre a captura, em % (0–100) da área visível. */
  x: number;
  y: number;
  /** Título curto da anotação (até ~36 caracteres). */
  titulo: string;
  /** Explicação (até ~100 caracteres). */
  texto?: string;
  /** Amplia esta região da captura no passo da anotação (em %, ver Regiao). */
  zoom?: Regiao;
  /**
   * Troca a captura neste passo (dissolve). Vale só no passo da anotação, como o zoom:
   * no passo seguinte sem `midia`, volta a captura principal.
   */
  midia?: Midia;
  /** Com `par`: o marcador fica sobre a segunda captura. */
  naPar?: boolean;
}

export interface ShowcasePair {
  /** Segunda captura, lado a lado com a principal (mesma moldura). */
  midia: Midia;
  url?: string;
  /** Legenda curta sob a segunda captura (até ~32 caracteres). */
  rotulo?: string;
  /** Passo em que a segunda captura entra (padrão 0: junto com o slide). */
  passo?: number;
}

export interface ShowcaseData extends CommonFields {
  titulo: string;
  /** Plataforma mostrada (logo pequeno ao lado do título). */
  plataforma?: string;
  /** Captura real. Proporção recomendada: 16:10 (navegador, ex.: 1920 x 1200) ou 9:19,5 (celular). */
  midia: Midia;
  moldura?: Moldura;
  /** Endereço na barra do navegador. */
  url?: string;
  /** Legenda curta sob a captura principal, usada quando há `par` (até ~32 caracteres). */
  rotulo?: string;
  /** Segunda captura lado a lado (comparar antes/depois, A/B, dois logs). */
  par?: ShowcasePair;
  /** Proporção do quadro sem moldura (`moldura: 'nenhuma'`), ex.: '4 / 3'. */
  proporcao?: string;
  /** Até 4 anotações numeradas; cada uma é um passo (com zoom e troca de captura opcionais). */
  anotacoes?: ShowcaseNote[];
  /** Linha de fonte da imagem, quando não for captura do professor. */
  fonte?: string;
}

/**
 * Arquétipo 10 — Vitrine de tela: captura real em moldura, inclinada que gira até frontal, com anotações,
 * zoom, troca de captura por passo e, opcionalmente, duas capturas lado a lado (`par`).
 */
export function showcase(data: ShowcaseData) {
  return define('showcase', data, data.titulo, (d, ctx) => {
    const kind = d.moldura ?? 'navegador';
    const notes = d.anotacoes ?? [];
    const pair = d.par ?? null;

    // Camadas da captura principal: 0 = midia; 1.. = midias trocadas pelas anotações.
    const swaps = notes.map((n) => (n.midia && !n.naPar ? n.midia : null));
    const layers: Midia[] = [d.midia];
    const layerOfNote = swaps.map((m) => (m ? layers.push(m) - 1 : 0));
    const main = mediaStack(layers, ctx);
    const pairStack = pair ? mediaStack([pair.midia, ...notes.filter((n) => n.midia && n.naPar).map((n) => n.midia!)], ctx) : null;
    let pairSwap = 0;
    const pairLayerOfNote = notes.map((n) => (n.naPar && n.midia ? ++pairSwap : 0));

    const markers = notes.map((n, i) => {
      const m = h('span.sc-marker', { 'data-step': i + 1, 'data-reveal': 'fade', style: `left:${n.x}%;top:${n.y}%` }, h('span.sc-marker-n', String(i + 1)));
      const stack = n.naPar && pairStack ? pairStack : main;
      const layerIdx = n.naPar ? pairLayerOfNote[i] : layerOfNote[i];
      stack.views[layerIdx].layer.append(m);
      return m;
    });

    const framed = frame(kind, main.el, d.url, d.proporcao);
    const p = d.plataforma ? platform(d.plataforma) : null;
    const hasSide = notes.length > 0;
    const pairStep = pair?.passo ?? 0;

    const stageContent = pair
      ? h(
          'div.sc-pair',
          h('figure.sc-pair-item', h('div.sc-tilt', framed), d.rotulo ? h('figcaption.sc-pair-label', d.rotulo) : null),
          h(
            'figure.sc-pair-item.is-second',
            { 'data-step': pairStep, 'data-reveal': 'fade', 'data-delay': pairStep ? 0.1 : 0.35 },
            h('div.sc-tilt', frame(kind, pairStack!.el, pair.url, d.proporcao)),
            pair.rotulo ? h('figcaption.sc-pair-label', pair.rotulo) : null,
          ),
        )
      : h('div.sc-tilt', framed);

    const el = shell(
      'showcase',
      h(
        `div.sc-grid.is-${kind}${hasSide ? '.has-notes' : ''}${pair ? '.has-pair' : ''}`,
        h(
          'div.sc-side',
          h(
            'header.sc-head',
            p ? h('div.sc-platform', { 'data-step': 0, 'data-delay': 0.1 }, logoMark(p, 40), markKind(p) === 'symbol' ? h('span', p.name) : null) : null,
            h('h1.t-h1.sc-title', { 'data-step': 0, 'data-delay': 0.15 }, d.titulo),
          ),
          hasSide
            ? h(
                'ol.sc-notes',
                ...notes.map((n, i) =>
                  h('li.sc-note', { 'data-step': i + 1 }, h('span.sc-note-n', String(i + 1)), h('div', h('p.sc-note-title', n.titulo), n.texto ? h('p.sc-note-text', n.texto) : null)),
                ),
              )
            : null,
        ),
        h('div.sc-stage', { 'data-step': 0, 'data-reveal': 'fade', 'data-delay': 0.2 }, stageContent),
      ),
      sourceLine(d.fonte, 0, 'source-foot'),
    );
    const tilts = Array.from(el.querySelectorAll<HTMLElement>('.sc-tilt'));
    const noteEls = Array.from(el.querySelectorAll<HTMLElement>('.sc-note'));

    return instance(el, {
      scene: d.scene ?? { key: 'ambient', params: { focus: [0.68, 0.55], intensity: 0.8, dust: 0.5 } },
      enter() {
        if (ctx.mode !== 'live' || motion.reduced) return;
        gsap.fromTo(
          tilts,
          { rotateY: kind === 'celular' ? -18 : -12, rotateX: 6, z: -120 },
          { rotateY: 0, rotateX: 0, z: 0, duration: 2.0, ease: 'power3.out', delay: 0.25, stagger: 0.12 },
        );
      },
      onStep(step, dir) {
        const idx = step - 1;
        const cur = step > 0 ? notes[idx] : null;
        const anim = dir !== 0;
        main.show(cur && !cur.naPar ? layerOfNote[idx] : 0, anim);
        pairStack?.show(cur && cur.naPar ? pairLayerOfNote[idx] : 0, anim);
        // zoom: usa a região do passo atual na captura certa; sem zoom, volta ao quadro inteiro
        main.views.forEach((v, k) => v.zoomTo(cur && !cur.naPar && k === main.active ? (cur.zoom ?? null) : null, anim));
        pairStack?.views.forEach((v, k) => v.zoomTo(cur && cur.naPar && k === pairStack.active ? (cur.zoom ?? null) : null, anim));
        markers.forEach((m, i) => m.classList.toggle('is-current', i + 1 === step));
        noteEls.forEach((n, i) => {
          n.classList.toggle('is-current', i + 1 === step);
          n.classList.toggle('is-past', i + 1 < step);
        });
      },
    });
  });
}
