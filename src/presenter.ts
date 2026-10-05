import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './styles/tokens.css';
import './styles/presenter.css';

import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, SquareX, Video } from 'lucide';
import { h } from './engine/dom';
import { icon } from './engine/icons';
import type { DeckState } from './engine/presentation';
import { channel, type DeckMeta } from './engine/sync';

const params = new URLSearchParams(location.search);

const fmtClock = (d: Date) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const fmtDur = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${hh > 0 ? hh + ':' : ''}${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
};

/** Chave do deck (mesma regra de decks/index.ts, sem importar os decks). */
function keyFromParam(param: string | null) {
  const raw = (param ?? '01').trim().toLowerCase();
  return /^\d+$/.test(raw) ? raw.padStart(2, '0') : raw;
}

/** Verifica (uma vez por caminho) se um arquivo de mídia existe em public/. */
const mediaCache = new Map<string, Promise<boolean>>();
function mediaExists(src: string) {
  let p = mediaCache.get(src);
  if (!p) {
    p = fetch(src, { method: 'HEAD', cache: 'no-store' })
      .then((r) => r.ok && !(r.headers.get('content-type') ?? '').includes('text/html'))
      .catch(() => false);
    mediaCache.set(src, p);
  }
  return p;
}

/**
 * Visão do apresentador. Não importa os decks nem o Three.js: espera a janela do deck enviar
 * os metadados (títulos, notas, vídeos, mídias) pelo BroadcastChannel.
 */
async function boot() {
  const key = keyFromParam(params.get('aula'));
  const sync = channel(key);
  const waiting = h('div.p-status', 'Aguardando a janela da apresentação. Abra index.html neste mesmo endereço e pressione P.');
  document.getElementById('app')!.append(waiting);
  const deck = await new Promise<DeckMeta>((resolve) => {
    sync.on((msg) => {
      if (msg.type === 'meta') resolve(msg.meta);
    });
    sync.send({ type: 'hello' });
    const retry = setInterval(() => sync.send({ type: 'hello' }), 1500);
    sync.on((msg) => {
      if (msg.type === 'meta') clearInterval(retry);
    });
  });
  waiting.remove();
  const aula = deck.key;
  document.documentElement.dataset.accent = deck.accent;
  document.title = `Apresentador: Aula ${deck.numero}`;

  const frameSrc = (index: number, step: number) => `index.html?aula=${aula}&embed=1#/${index + 1}/${step}`;
  const curFrame = h('iframe.p-frame', { title: 'Slide atual', src: frameSrc(0, 0), tabindex: '-1' }) as HTMLIFrameElement;
  const nextFrame = h('iframe.p-frame', { title: 'Próximo', src: frameSrc(0, 1), tabindex: '-1' }) as HTMLIFrameElement;

  const clockEl = h('span.p-clock');
  const elapsedEl = h('span.p-elapsed', '00:00');
  const remainEl = h('span.p-remain');
  const counterEl = h('span.p-counter', '--');
  const stepEl = h('span.p-step');
  const titleEl = h('span.p-slide-title');
  const nextLabel = h('span.p-label', 'Próximo');
  const notesEl = h('div.p-notes-body');
  const statusEl = h('div.p-status', 'Aguardando a janela da apresentação. Abra index.html neste mesmo endereço e pressione P.');
  const timerBtn = h('button.p-btn', { type: 'button' }, icon(Play, 32), h('span', 'Iniciar'));
  const resetBtn = h('button.p-btn.p-btn-ghost', { type: 'button', 'aria-label': 'Zerar cronômetro' }, icon(RotateCcw, 32));
  const prevBtn = h('button.p-btn', { type: 'button' }, icon(ChevronLeft, 32), h('span', 'Voltar'));
  const nextBtn = h('button.p-btn.p-btn-primary', { type: 'button' }, h('span', 'Avançar'), icon(ChevronRight, 32));
  const blackBtn = h('button.p-btn.p-btn-ghost', { type: 'button' }, icon(SquareX, 32), h('span', 'Tela preta'));
  const videoBtn = h('button.p-btn.p-btn-ghost', { type: 'button' }, icon(Video, 32), h('span', 'Vídeo de backup'));
  const strip = h('div.p-strip', ...deck.slides.map((s, i) => h('button.p-strip-item', { type: 'button', title: s.title, 'data-i': i }, String(i + 1))));

  document.getElementById('app')!.append(
    h(
      'div.presenter',
      h(
        'header.p-head',
        h('div.p-head-left', h('span.p-aula', `Aula ${deck.numero}`), h('span.p-deck-title', deck.titulo)),
        h(
          'div.p-head-right',
          h('div.p-timer', h('span.p-label', 'Decorrido'), elapsedEl, remainEl),
          timerBtn,
          resetBtn,
          h('div.p-timer', h('span.p-label', 'Agora'), clockEl),
        ),
      ),
      h(
        'main.p-main',
        h(
          'section.p-current',
          h('div.p-frame-wrap', curFrame),
          h('div.p-current-meta', h('div.p-current-info', counterEl, titleEl, stepEl), h('div.p-actions', prevBtn, nextBtn, blackBtn, videoBtn)),
          strip,
        ),
        h(
          'section.p-side',
          h('div.p-next', nextLabel, h('div.p-frame-wrap.p-frame-small', nextFrame)),
          h('div.p-notes', h('span.p-label', 'Notas (teclas + e - ajustam o tamanho)'), notesEl),
        ),
      ),
      statusEl,
    ),
  );

  /* ---------- Cronômetro ---------- */
  let startAt = 0;
  let accumulated = 0;
  let running = false;
  const planned = deck.duracaoMin * 60_000;
  const tick = () => {
    const now = Date.now();
    clockEl.textContent = fmtClock(new Date());
    const elapsed = accumulated + (running ? now - startAt : 0);
    elapsedEl.textContent = fmtDur(elapsed);
    const left = planned - elapsed;
    remainEl.textContent = left >= 0 ? `restam ${Math.ceil(left / 60000)} min` : `${Math.ceil(-left / 60000)} min além`;
    remainEl.classList.toggle('is-over', left < 0);
  };
  setInterval(tick, 250);
  tick();
  const setRunning = (v: boolean) => {
    if (v === running) return;
    if (v) startAt = Date.now();
    else accumulated += Date.now() - startAt;
    running = v;
    timerBtn.replaceChildren(icon(v ? Pause : Play, 32), h('span', v ? 'Pausar' : 'Retomar'));
  };
  timerBtn.addEventListener('click', () => setRunning(!running));
  resetBtn.addEventListener('click', () => {
    accumulated = 0;
    startAt = Date.now();
    tick();
  });

  /* ---------- Tamanho das notas (+ / -) ---------- */
  let noteSize = 21;
  try {
    noteSize = Number(localStorage.getItem('nocode-deck:notes-size')) || 21;
  } catch {
    /* armazenamento indisponível */
  }
  function setNoteSize(v: number) {
    noteSize = Math.max(16, Math.min(36, v));
    notesEl.style.fontSize = `${noteSize}px`;
    try {
      localStorage.setItem('nocode-deck:notes-size', String(noteSize));
    } catch {
      /* ignore */
    }
  }
  setNoteSize(noteSize);

  /* ---------- Estado recebido do deck ---------- */
  let state: DeckState | null = null;
  function render(s: DeckState) {
    state = s;
    statusEl.style.display = 'none';
    const def = deck.slides[s.index];
    counterEl.textContent = `${s.index + 1} / ${s.total}`;
    titleEl.textContent = def.title;
    stepEl.textContent = s.steps > 0 ? `passo ${s.step} de ${s.steps}` : '';
    curFrame.contentWindow?.location.replace(frameSrc(s.index, s.step));
    if (s.step < s.steps) {
      nextLabel.textContent = 'Próximo passo';
      nextFrame.contentWindow?.location.replace(frameSrc(s.index, s.step + 1));
    } else if (s.index + 1 < s.total) {
      nextLabel.textContent = 'Próximo slide';
      nextFrame.contentWindow?.location.replace(frameSrc(s.index + 1, 0));
    } else {
      nextLabel.textContent = 'Fim da apresentação';
    }
    notesEl.replaceChildren(...(def.notes ?? 'Sem notas para este slide.').split('\n').map((line) => h('p', line)));
    if (def.video) notesEl.append(h('p.p-note-video', `Vídeo de backup: public/${def.video.src} (tecla V)`));
    const renderIndex = s.index;
    for (const src of def.media ?? []) {
      const line = h('p.p-note-media', `Mídia: public/${src}`);
      notesEl.append(line);
      mediaExists(src).then((ok) => {
        if (state?.index !== renderIndex) return;
        line.classList.toggle('is-missing', !ok);
        line.textContent = ok ? `Mídia ok: public/${src}` : `Captura pendente: public/${src}`;
      });
    }
    strip.querySelectorAll('.p-strip-item').forEach((b, i) => {
      b.classList.toggle('is-current', i === s.index);
      b.classList.toggle('is-done', i < s.index);
    });
    blackBtn.classList.toggle('is-active', s.blackout);
    if (!running && accumulated === 0 && (s.index > 0 || s.step > 0)) setRunning(true);
  }

  sync.on((msg) => {
    if (msg.type === 'state') render(msg.state);
  });
  sync.send({ type: 'hello' });

  const cmd = (c: 'next' | 'prev' | 'blackout' | 'video') => sync.send({ type: 'cmd', cmd: c });
  prevBtn.addEventListener('click', () => cmd('prev'));
  nextBtn.addEventListener('click', () => cmd('next'));
  blackBtn.addEventListener('click', () => cmd('blackout'));
  videoBtn.addEventListener('click', () => cmd('video'));
  strip.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('.p-strip-item');
    if (b) sync.send({ type: 'cmd', cmd: 'goto', index: Number(b.dataset.i), step: 0 });
  });

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) cmd('next');
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) cmd('prev');
    else if (k === 'b' || k === 'B' || k === '.') cmd('blackout');
    else if (k === 'v' || k === 'V') cmd('video');
    else if (k === 't' || k === 'T') sync.send({ type: 'cmd', cmd: 'key', key: 't' });
    else if (k === 's' || k === 'S') setRunning(!running);
    else if (k === '+' || k === '=') setNoteSize(noteSize + 2);
    else if (k === '-') setNoteSize(noteSize - 2);
    else return;
    e.preventDefault();
  });

  void state;
}

boot().catch((err) => {
  console.error(err);
  document.body.append(h('pre', String(err)));
});
