import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/archetypes.css';
import './styles/print.css';

import './styles/content.css';
import './styles/hub.css';

import { ACCENTS, deckKey, loadDeck } from './decks';
import { h } from './engine/dom';
import { motion } from './engine/motion';
import { createHelp, createOverview, createVideoOverlay, toast } from './engine/overlays';
import { Presentation, parseHash, posterFor } from './engine/presentation';
import { fitStage } from './engine/stage';
import { channel, type DeckMeta } from './engine/sync';
import type { AccentKey, DeckDef, RenderMode } from './engine/types';
import type { GLHost } from './three/gl';

const params = new URLSearchParams(location.search);

/**
 * O Three.js só é carregado quando há WebGL de verdade (deck ao vivo ou exportação PDF).
 * Miniaturas do apresentador (?embed=1) e ?nogl=1 nunca baixam o pacote 3D.
 */
async function createGL(canvas: HTMLCanvasElement, accent: AccentKey, preserve = false): Promise<GLHost | null> {
  const [{ GLHost }, { FACTORIES }] = await Promise.all([import('./three/gl'), import('./three/registry')]);
  return GLHost.create(canvas, ACCENTS[accent], FACTORIES, { preserve });
}

async function boot() {
  // Sem ?aula= abre o painel principal com as quatro aulas.
  if (!params.has('aula')) return (await import('./hub')).renderHub();
  const key = deckKey(params.get('aula'));
  const deck = await loadDeck(key);
  // ?accent=aula3 troca a cor da aula (útil para revisar a galeria com as 4 paletas).
  const accentParam = params.get('accent');
  if (accentParam && accentParam in ACCENTS) deck.accent = accentParam as AccentKey;
  document.documentElement.dataset.accent = deck.accent;
  // ?rascunho=1 mostra avisos de mídia pendente também no palco (o apresentador sempre mostra).
  if (params.has('rascunho') || params.has('dev')) document.documentElement.dataset.draft = '1';
  document.title = `Aula ${deck.numero}: ${deck.titulo}`;
  await document.fonts.ready;

  if (params.has('print')) return bootPrint(deck);

  const mode: RenderMode = params.has('embed') ? 'preview' : 'live';
  document.documentElement.dataset.mode = mode;
  const app = document.getElementById('app')!;
  const stage = h('div.stage');
  const canvas = h('canvas.gl', { 'aria-hidden': 'true' }) as HTMLCanvasElement;
  stage.append(canvas);
  app.append(stage);

  const wantGL = mode === 'live' && !params.has('nogl');
  const gl = wantGL ? await createGL(canvas, deck.accent) : null;
  if (!gl) {
    canvas.remove();
    document.documentElement.dataset.gl = 'off';
  }
  fitStage(stage, (s) => gl?.setScale(s));

  const pres = new Presentation(deck, stage, mode, gl);
  const start = parseHash(location.hash) ?? { index: 0, step: 0 };
  pres.goTo(start.index, start.step, { instant: mode !== 'live' || start.index > 0 || start.step > 0 });
  gl?.start();

  // Hash = link direto para slide/passo (#/4/2).
  let writingHash = false;
  pres.onChange((s) => {
    writingHash = true;
    history.replaceState(null, '', `${location.pathname}${location.search}#/${s.index + 1}/${s.step}`);
    writingHash = false;
  });
  window.addEventListener('hashchange', () => {
    if (writingHash) return;
    const p = parseHash(location.hash);
    if (p) pres.goTo(p.index, p.step, { instant: true });
  });

  if (mode === 'preview') return; // iframe da visão do apresentador: só segue o hash.

  /* ---------- Sincronização com a visão do apresentador ---------- */
  const sync = channel(key);
  const meta: DeckMeta = {
    key,
    numero: deck.numero,
    titulo: deck.titulo,
    accent: deck.accent,
    duracaoMin: deck.duracaoMin,
    slides: deck.slides.map((s) => ({ title: s.title, notes: s.notes, video: s.video, media: s.media })),
  };
  pres.onChange((state) => sync.send({ type: 'state', state }));

  const overview = createOverview(deck, (i) => pres.goTo(i, 0));
  const video = createVideoOverlay();
  const help = createHelp();
  const hud = h('div.hud');
  document.body.append(hud);

  // Botão discreto de volta ao painel: só aparece quando o mouse se move e some após 2 s parado.
  const homeBtn = h('a.home-btn', { href: 'index.html', title: 'Voltar ao painel das aulas (tecla A)' }, 'Painel das aulas');
  document.body.append(homeBtn);
  let homeTimer = 0;
  window.addEventListener('mousemove', () => {
    homeBtn.classList.add('is-visible');
    clearTimeout(homeTimer);
    homeTimer = window.setTimeout(() => {
      if (!homeBtn.matches(':hover')) homeBtn.classList.remove('is-visible');
    }, 2000);
  });
  homeBtn.addEventListener('mouseleave', () => {
    homeTimer = window.setTimeout(() => homeBtn.classList.remove('is-visible'), 1200);
  });
  let hudOn = false;
  setInterval(() => {
    if (hudOn) hud.textContent = `${gl ? gl.fps : '--'} fps  |  cena: ${gl?.sceneKey ?? 'sem WebGL'}  |  movimento ${motion.reduced ? 'reduzido' : 'completo'}`;
  }, 500);

  const openVideo = () => {
    const v = pres.slide?.video;
    if (!v) return toast('Este slide não tem vídeo de backup.');
    video.show(v.src, v.label);
  };

  const openPresenter = () => {
    const url = `presenter.html?aula=${key}`;
    const w = window.open(url, `presenter-${deck.id}`, 'width=1440,height=900');
    if (!w) toast('O navegador bloqueou a janela. Permita pop-ups para este endereço.');
  };

  let numberBuffer = '';
  let numberTimer = 0;

  function handleKey(key: string, e?: KeyboardEvent): boolean {
    if (video.open) {
      if (key === 'Escape' || key === 'v' || key === 'V') video.hide();
      return true;
    }
    if (help.open && (key === 'Escape' || key === 'h' || key === '?')) {
      help.toggle(false);
      return true;
    }
    if (overview.open) {
      if (key === 'Escape' || key === 'o' || key === 'O') overview.toggle(false);
      return true;
    }
    if (/^[0-9]$/.test(key)) {
      numberBuffer += key;
      clearTimeout(numberTimer);
      numberTimer = window.setTimeout(() => (numberBuffer = ''), 1500);
      toast(`Ir para o slide ${numberBuffer}`);
      return true;
    }
    if (pres.instance?.onKey?.(key)) return true;
    switch (key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        pres.next();
        return true;
      case 'Enter':
        if (numberBuffer) {
          pres.goTo(Number(numberBuffer) - 1, 0);
          numberBuffer = '';
        } else pres.next();
        return true;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
      case 'Backspace':
        pres.prev();
        return true;
      case 'Home':
        pres.goTo(0, 0);
        return true;
      case 'End':
        pres.goTo(pres.total - 1, 0);
        return true;
      case 'o':
      case 'O':
      case 'Escape':
        overview.toggle(true, pres.index);
        return true;
      case 'p':
      case 'P':
        openPresenter();
        return true;
      case 'a':
      case 'A':
        location.href = 'index.html';
        return true;
      case 'f':
      case 'F':
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen().catch(() => undefined);
        return true;
      case 'b':
      case 'B':
      case '.':
        pres.toggleBlackout();
        return true;
      case 'v':
      case 'V':
        openVideo();
        return true;
      case 'm':
      case 'M':
        motion.toggle();
        toast(motion.reduced ? 'Movimento reduzido ativado' : 'Movimento completo ativado');
        sync.send({ type: 'state', state: pres.state() });
        return true;
      case 'd':
      case 'D':
        hudOn = !hudOn;
        hud.classList.toggle('is-on', hudOn);
        return true;
      case 'h':
      case 'H':
      case '?':
        help.toggle();
        return true;
    }
    void e;
    return false;
  }

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (handleKey(e.key, e)) e.preventDefault();
  });

  // Clique no palco avança (clicker que emula mouse); botão direito volta.
  stage.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a, button, video')) return;
    pres.next();
  });
  stage.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    pres.prev();
  });

  sync.on((msg) => {
    if (msg.type === 'hello') {
      sync.send({ type: 'meta', meta });
      sync.send({ type: 'state', state: pres.state() });
    }
    if (msg.type !== 'cmd') return;
    switch (msg.cmd) {
      case 'next':
        pres.next();
        break;
      case 'prev':
        pres.prev();
        break;
      case 'goto':
        pres.goTo(msg.index, msg.step);
        break;
      case 'blackout':
        pres.toggleBlackout();
        break;
      case 'reduced':
        motion.toggle();
        sync.send({ type: 'state', state: pres.state() });
        break;
      case 'video':
        openVideo();
        break;
      case 'key':
        if (msg.key) handleKey(msg.key);
        break;
    }
  });
  sync.send({ type: 'meta', meta });
  sync.send({ type: 'state', state: pres.state() });

  // Expõe para depuração no console.
  (window as unknown as { deck: unknown }).deck = { pres, gl, motion };
}

/** Exportação PDF: todos os slides no estado final, 3D congelado em imagem. */
async function bootPrint(deck: DeckDef) {
  document.documentElement.dataset.mode = 'print';
  motion.reduced = true; // sem persistir: só para congelar cenas
  const app = document.getElementById('app')!;
  const bar = h(
    'div.print-bar',
    h('span', 'Gerando quadros 3D...'),
  );
  document.body.append(bar);

  const canvas = h('canvas.gl') as HTMLCanvasElement;
  const gl = params.has('nogl') ? null : await createGL(canvas, deck.accent, true);
  gl?.setScale(1);

  for (let i = 0; i < deck.slides.length; i++) {
    const def = deck.slides[i];
    const page = h('div.print-page');
    const stage = h('div.stage.print-stage');
    page.append(stage);
    app.append(page);
    const inst = def.build({ deck, index: i, mode: 'print', reduced: true, gl: null });
    const scene = inst.scene ?? def.scene;
    if (gl && scene && scene.key !== 'none') {
      gl.setScene(scene, inst.steps, true);
      gl.setStep(inst.steps, true);
      for (let f = 0; f < 4; f++) gl.advance(1 / 60);
      const img = h('img.print-poster', { src: gl.snapshot('image/jpeg', 0.9), alt: '' });
      stage.append(img);
    } else stage.append(posterFor(scene?.key));
    stage.append(inst.el);
    inst.setStep(inst.steps, 0);
    if (def.chrome !== false) {
      stage.append(
        h(
          'footer.chrome',
          h('div.chrome-left', h('span.chrome-aula', `Aula ${deck.numero}`), h('span.chrome-title', deck.titulo)),
          h(
            'div.chrome-right',
            h('span.chrome-count', `${String(i + 1).padStart(2, '0')} / ${String(deck.slides.length).padStart(2, '0')}`),
            h('span.chrome-bar', h('span.chrome-bar-fill', { style: `transform: scaleX(${(i + 1) / deck.slides.length})` })),
          ),
        ),
      );
    }
  }
  bar.replaceChildren(h('span', 'Pronto. Ctrl+P e "Salvar como PDF" (sem margens, com gráficos de fundo).'));
}

boot().catch((err) => {
  console.error(err);
  document.body.append(h('pre.boot-error', String(err)));
});
