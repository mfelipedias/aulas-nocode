import { gsap } from 'gsap';
import { h } from '../engine/dom';
import { motion } from '../engine/motion';
import type { AccentKey, CommonFields } from '../engine/types';
import { define, header, instance, shell, sourceLine } from './base';

export interface Milestone {
  /** Data curta em Geist Mono (ex.: "2012", "jul/2026", "Semana 3"). */
  data: string;
  /** Até ~28 caracteres. */
  titulo: string;
  /** Até ~80 caracteres. */
  texto?: string;
  /** Cor de destaque própria do marco (ex.: 'aula1' para lembrar a aula 1). Padrão: a cor da aula. */
  cor?: AccentKey;
}

export interface TimelineData extends CommonFields {
  titulo: string;
  subtitulo?: string;
  /** 3 a 6 marcos; cada um acende num passo. */
  marcos: Milestone[];
  fonte?: string;
}

/** Arquétipo 11 — Linha do tempo horizontal. O trilho desenha; os marcos acendem por passo. */
export function timeline(data: TimelineData) {
  return define('timeline', data, data.titulo, (d) => {
    const n = d.marcos.length;
    const fill = h('span.tl-fill');
    const items = d.marcos.map((m, i) =>
      h(
        'li.tl-item',
        { style: `--i:${i};--n:${n}`, 'data-accent': m.cor },
        h('span.tl-dot'),
        h('div.tl-copy', { 'data-step': i + 1 }, h('span.tl-date', m.data), h('p.tl-title', m.titulo), m.texto ? h('p.tl-text', m.texto) : null),
      ),
    );
    const el = shell(
      'timeline',
      header(d.titulo, d.subtitulo),
      h(`div.tl-wrap${n >= 5 ? '.is-alt' : ''}`, { 'data-step': 0, 'data-reveal': 'fade', 'data-delay': 0.3 }, h('span.tl-rail', fill), h('ol.tl-list', { style: `--n:${n}` }, ...items)),
      sourceLine(d.fonte, n),
    );
    return instance(el, {
      scene: d.scene ?? { key: 'horizon', params: { dolly: false } },
      onStep(step, dir) {
        // o trilho preenche até o centro do marco atual
        const frac = step === 0 ? 0 : Math.min(1, (step - 0.5) / n);
        gsap.killTweensOf(fill);
        if (dir === 1 && !motion.reduced) gsap.to(fill, { scaleX: frac, duration: 0.9, ease: 'power2.inOut' });
        else gsap.set(fill, { scaleX: frac });
        items.forEach((it, i) => {
          it.classList.toggle('is-lit', i + 1 <= step);
          it.classList.toggle('is-current', i + 1 === step);
        });
      },
    });
  });
}
