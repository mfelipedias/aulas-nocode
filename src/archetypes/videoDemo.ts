import { Play } from 'lucide';
import { h } from '../engine/dom';
import { icon } from '../engine/icons';
import { logoMark, markKind } from '../engine/logos';
import type { CommonFields } from '../engine/types';
import { platform } from '../content/platforms';
import { define, instance, shell } from './base';
import { mediaView } from './parts/media';
import { frame } from './parts/visual';

export interface VideoDemoData extends CommonFields {
  titulo: string;
  plataforma?: string;
  /** Vídeo em public/ (H.264 .mp4, 1920 x 1080 ou 1920 x 1200, até 3 min). */
  src: string;
  /** Quadro inicial (PNG/JPG em public/). Aparece antes de tocar, nas miniaturas e no PDF. */
  poster?: string;
  /** O que o vídeo mostra (texto alternativo e quadro "captura pendente"). */
  descricao: string;
  /** Legenda curta sob o vídeo (até ~90 caracteres). */
  legenda?: string;
  moldura?: 'navegador' | 'nenhuma';
  url?: string;
  /** Som do vídeo (padrão: mudo; o professor narra). */
  som?: boolean;
}

/**
 * Vídeo de demonstração embutido no slide. Passo 1 (ou clique no vídeo) toca; tecla K pausa/retoma.
 * O mesmo arquivo fica disponível na tecla V (tela cheia com controles).
 */
export function videoDemo(data: VideoDemoData) {
  return define(
    'videoDemo',
    data,
    data.titulo,
    (d, ctx) => {
      const mv = mediaView({ src: d.src, poster: d.poster, descricao: d.descricao, tipo: 'video', posicao: 'top center' }, ctx, { muted: !d.som });
      const p = d.plataforma ? platform(d.plataforma) : null;
      const playHint = h('div.vd-play', { 'aria-hidden': 'true' }, icon(Play, 40));
      const el = shell(
        'videoDemo',
        h(
          'header.vd-head',
          p ? h('div.sc-platform', { 'data-step': 0, 'data-delay': 0.1 }, logoMark(p, 40), markKind(p) === 'symbol' ? h('span', p.name) : null) : null,
          h('h1.t-h1.vd-title', { 'data-step': 0, 'data-delay': 0.15 }, d.titulo),
        ),
        h('div.vd-stage', { 'data-step': 0, 'data-reveal': 'fade', 'data-delay': 0.25 }, frame(d.moldura ?? 'navegador', h('div.vd-media', mv.el, playHint), d.url)),
        d.legenda ? h('p.vd-caption', { 'data-step': 0, 'data-delay': 0.5 }, d.legenda) : null,
      );
      const v = mv.video;
      const sync = () => el.classList.toggle('is-playing', Boolean(v && !v.paused));
      v?.addEventListener('play', sync);
      v?.addEventListener('pause', sync);
      v?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (v.paused) v.play().catch(() => undefined);
        else v.pause();
      });
      return instance(el, {
        steps: 1,
        scene: d.scene ?? { key: 'ambient', params: { focus: [0.5, 0.6], intensity: 0.6, dust: 0.4 } },
        onStep(step) {
          if (ctx.mode !== 'live' || !v) return;
          if (step >= 1) v.play().catch(() => undefined);
          else {
            v.pause();
            v.currentTime = 0;
          }
        },
        leave() {
          v?.pause();
        },
        onKey(key) {
          if (key.toLowerCase() !== 'k' || !v) return false;
          if (v.paused) v.play().catch(() => undefined);
          else v.pause();
          return true;
        },
      });
    },
    { video: { src: data.src, poster: data.poster, label: data.titulo } },
  );
}
