import { DECKS } from './decks';
import { h } from './engine/dom';
import type { DeckDef } from './engine/types';

/**
 * Painel principal (index.html sem ?aula=): escolhe a aula com um clique ou pelas teclas 1 a 4.
 * Não carrega Three.js; lê os metadados de cada deck para mostrar data e número de slides.
 */

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

function parseData(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function dataExtenso(iso: string): string {
  const d = parseData(iso);
  return `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`;
}

function hoje(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

function deckUrl(key: string, extra = ''): string {
  return `index.html?aula=${key}${extra}`;
}

/** Abre a visão do apresentador (gesto do usuário, então o pop-up é permitido) e troca esta aba para o deck. */
function apresentar(key: string, deckId: string) {
  window.open(`presenter.html?aula=${key}`, `presenter-${deckId}`, 'width=1440,height=900');
  location.href = deckUrl(key);
}

export async function renderHub() {
  document.title = 'Painel das aulas: No-Code Development Platforms';
  document.documentElement.dataset.mode = 'hub';

  const keys = Object.keys(DECKS).filter((k) => /^\d+$/.test(k));
  const decks = (await Promise.all(keys.map(async (k) => [k, (await DECKS[k]()).default] as const))).sort(
    ([, a], [, b]) => a.numero - b.numero,
  );

  const t = hoje().getTime();
  const proxima = decks.find(([, d]) => parseData(d.data).getTime() >= t)?.[0];

  const card = (key: string, d: DeckDef) => {
    const passada = parseData(d.data).getTime() < t;
    const estado = key === proxima ? 'Próxima aula' : passada ? 'Realizada' : 'Agendada';
    const el = h(
      `article.hub-card${key === proxima ? '.is-next' : ''}`,
      { 'data-accent': d.accent },
      h(
        'a.hub-main',
        { href: deckUrl(key), 'aria-label': `Abrir aula ${d.numero}: ${d.titulo}` },
        h(
          'div.hub-top',
          h('span.hub-num', String(d.numero).padStart(2, '0')),
          h(`span.hub-status${key === proxima ? '.is-next' : ''}`, estado),
        ),
        h('h2.hub-title', d.titulo),
        h(
          'p.hub-meta',
          h('span', dataExtenso(d.data)),
          h('span.hub-dot', '·'),
          h('span', `${d.slides.length} slides`),
          h('span.hub-dot', '·'),
          h('span', `${d.duracaoMin} min`),
        ),
      ),
      h(
        'div.hub-actions',
        h('button.hub-btn.is-primary', { type: 'button', 'data-act': 'apresentar' }, 'Apresentar'),
        h('a.hub-btn', { href: deckUrl(key) }, 'Só o deck'),
        h('a.hub-btn', { href: deckUrl(key, '&rascunho=1'), title: 'Destaca as capturas e vídeos que ainda faltam' }, 'Pendências'),
        h('a.hub-btn', { href: deckUrl(key, '&print=1'), title: 'Todos os slides para salvar em PDF' }, 'PDF'),
      ),
      h('span.hub-key', { 'aria-hidden': 'true' }, String(d.numero)),
    );
    el.querySelector('[data-act="apresentar"]')!.addEventListener('click', () => apresentar(key, d.id));
    return el;
  };

  const app = document.getElementById('app')!;
  app.replaceChildren(
    h(
      'main.hub',
      h(
        'header.hub-header',
        h('p.hub-kicker', 'Aulas ao vivo  ·  Prof. Marcos'),
        h('h1.hub-h1', 'No-Code Development Platforms'),
        h('p.hub-sub', 'Escolha a aula. Teclas 1 a 4 abrem o deck; dentro da aula, a tecla A volta para este painel.'),
      ),
      h('section.hub-grid', ...decks.map(([k, d]) => card(k, d))),
      h(
        'footer.hub-footer',
        h('span', '"Apresentar" abre a visão do apresentador numa janela e o deck nesta aba. No deck, F coloca em tela cheia.'),
        h('a.hub-link', { href: deckUrl('galeria') }, 'Galeria de modelos'),
      ),
    ),
  );

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const hit = decks.find(([, d]) => String(d.numero) === e.key);
    if (hit) location.href = deckUrl(hit[0]);
  });
}
