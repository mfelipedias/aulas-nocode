import { gsap } from 'gsap';
import QRCode from 'qrcode';
import { MessageSquareText } from 'lucide';
import { h } from '../engine/dom';
import { icon } from '../engine/icons';
import { motion } from '../engine/motion';
import type { CommonFields } from '../engine/types';
import { define, instance, shell, sourceLine } from './base';

export interface PauseData extends CommonFields {
  pergunta: string;
  resposta: string;
  /** Linha de apoio sob a resposta. */
  detalhe?: string;
  /** Duração da contagem antes da revelação automática (padrão 20 s). */
  segundos?: number;
  /** Convite opcional ao chat do Meet (a aula funciona sem ninguém responder). */
  chat?: string;
  /** QR opcional (ex.: Google Forms). Nunca obrigatório. */
  qr?: { url: string; rotulo: string };
  /** Fonte (veículo e data), no pé do slide (entra com a resposta), na mesma posição do stat. "TODO-fonte" aparece em âmbar. */
  fonte?: string;
}

const R = 104;
const C = 2 * Math.PI * R;

/**
 * Arquétipo 13 — Pausa para pensar.
 * Contagem regressiva visível; ao zerar, a própria apresentação revela a resposta (passo 1).
 * Avançar antes do fim revela na hora. Tecla T pausa/retoma a contagem.
 */
export function pause(data: PauseData) {
  return define('pause', data, 'Pausa para pensar', (d, ctx) => {
    const total = d.segundos ?? 20;
    const secEl = h('span.pause-sec', String(total));
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 240 240');
    svg.setAttribute('class', 'pause-ring');
    svg.innerHTML = `<circle cx="120" cy="120" r="${R}" class="ring-track"/><circle cx="120" cy="120" r="${R}" class="ring-progress" stroke-dasharray="${C}" stroke-dashoffset="0" transform="rotate(-90 120 120)"/>`;
    const progress = svg.querySelector('.ring-progress') as SVGCircleElement;

    const qrSlot = d.qr ? h('div.pause-qr', h('canvas.qr-canvas'), h('span.pause-qr-label', d.qr.rotulo)) : null;
    if (qrSlot && d.qr) {
      QRCode.toCanvas(qrSlot.querySelector('canvas') as HTMLCanvasElement, d.qr.url, {
        width: 200,
        margin: 1,
        color: { dark: '#050608', light: '#f2f4f9' },
      }).catch(() => qrSlot.remove());
    }

    const timerBox = h(
      'div.pause-timer',
      { 'data-step': 0, 'data-reveal': 'fade', 'data-delay': 0.6 },
      svg,
      h('div.pause-timer-center', secEl, h('span.pause-timer-label', 'segundos')),
    );

    const answer = h(
      'div.pause-answer',
      { 'data-step': 1 },
      h('span.pause-answer-bar'),
      h('div', h('p.pause-answer-text', d.resposta), d.detalhe ? h('p.pause-answer-detail', d.detalhe) : null),
    );

    const el = shell(
      'pause',
      h(
        'div.pause-main',
        h('p.pause-kicker', { 'data-step': 0, 'data-delay': 0.2 }, 'Pausa para pensar'),
        h('h1.t-h1.pause-question', { 'data-step': 0, 'data-delay': 0.3 }, d.pergunta),
        answer,
      ),
      h(
        'aside.pause-side',
        timerBox,
        d.chat ? h('p.pause-chat', { 'data-step': 0, 'data-delay': 1.0 }, icon(MessageSquareText, 32), h('span', d.chat)) : null,
        qrSlot,
      ),
      sourceLine(d.fonte, 1, 'source-foot'),
    );

    const clock = { left: total };
    let tween: gsap.core.Tween | null = null;
    let revealed = false;

    const paint = () => {
      const frac = clock.left / total;
      progress.setAttribute('stroke-dashoffset', String(C * (1 - frac)));
      secEl.textContent = String(Math.ceil(clock.left));
    };

    function stopTimer(final: boolean) {
      tween?.kill();
      tween = null;
      if (final) {
        clock.left = 0;
        paint();
      }
    }

    function startTimer() {
      stopTimer(false);
      clock.left = total;
      paint();
      if (ctx.mode !== 'live') return;
      tween = gsap.to(clock, {
        left: 0,
        duration: total,
        ease: 'none',
        delay: motion.reduced ? 0 : 1.0,
        onUpdate: paint,
        onComplete: () => {
          if (!revealed) ctx.advance?.();
        },
      });
    }

    return instance(el, {
      scene: d.scene ?? { key: 'ambient', params: { focus: [0.78, 0.4], intensity: 0.75 } },
      onStep(step, dir) {
        revealed = step >= 1;
        el.classList.toggle('is-revealed', revealed);
        if (revealed) stopTimer(true);
        else if (dir !== 0 || ctx.mode === 'live') startTimer();
        else {
          clock.left = total;
          paint();
        }
      },
      leave() {
        stopTimer(false);
      },
      destroy() {
        stopTimer(false);
      },
      onKey(key) {
        if (key.toLowerCase() !== 't' || !tween) return false;
        tween.paused(!tween.paused());
        el.classList.toggle('is-paused', tween.paused());
        return true;
      },
    });
  });
}
