import { ArrowLeft, BookText, Check, Clock, Copy, Download, Eye, EyeOff, FileText, KeyRound, LayoutDashboard, LockKeyhole, LogOut, MessageSquareHeart, Search, Trash2, X, Images } from 'lucide';
import { marked } from 'marked';
import { AULAS, api, aulaInfo, aviso, cabecalho, campo, ErroApi, iniciais, iniciarPagina, quando, sessao, tamanho, type ConfigPublica } from './aluno/comum';
import { baixarCsv, painelFeedback, type Resposta } from './aluno/resultados';
import { h } from './engine/dom';
import { icon } from './engine/icons';

/**
 * Área do professor (professor.html), protegida por senha.
 * Abas: Visão geral (abrir/fechar envios e feedback por aula, moderação prévia), Envios (publicar, ocultar, excluir,
 * um a um ou em lote), Feedback (resultados, CSV, apagar respostas), Materiais (documentos .md de materiais-professor/,
 * só com login) e Conta (trocar senha, sair).
 * A senha inicial é SENHA_PROFESSOR do .env; depois de trocada aqui, vale a nova (guardada com hash em dados/config.json).
 */

type Status = 'publicado' | 'pendente' | 'oculto';
interface Arquivo {
  nome: string;
  original: string;
  tamanho: number;
  imagem: boolean;
}
interface Envio {
  id: string;
  status: Status;
  criadoEm: string;
  nome: string;
  curso: string;
  aula: string;
  titulo: string;
  texto: string;
  arquivos: Arquivo[];
}
interface Resumo {
  config: ConfigPublica;
  envios: { total: number; publicado: number; pendente: number; oculto: number };
  feedback: { total: number; porAula: Record<string, number> };
  enviosPorAula: Record<string, number>;
}

const STATUS_INFO: Record<Status, { rotulo: string; icone: typeof Eye }> = {
  publicado: { rotulo: 'Publicado', icone: Eye },
  pendente: { rotulo: 'Aguardando', icone: Clock },
  oculto: { rotulo: 'Oculto', icone: EyeOff },
};

const ABAS = [
  { id: 'geral', rotulo: 'Visão geral', icone: LayoutDashboard },
  { id: 'envios', rotulo: 'Envios', icone: Images },
  { id: 'feedback', rotulo: 'Feedback', icone: MessageSquareHeart },
  { id: 'materiais', rotulo: 'Materiais', icone: BookText },
  { id: 'conta', rotulo: 'Conta', icone: KeyRound },
] as const;
type Aba = (typeof ABAS)[number]['id'];

const app = document.getElementById('app')!;
iniciarPagina('Área do professor', 'professor');

let resumo: Resumo;
let envios: Envio[] = [];
const sel = new Set<string>();
const filtroEnvios = { status: '' as '' | Status, aula: '', busca: '' };
let filtroFeedback = '';

/** Chamada autenticada: sessão expirada volta para o login. */
async function prof<T>(caminho: string, init: RequestInit = {}): Promise<T> {
  try {
    return await api<T>(`/professor${caminho}`, init);
  } catch (err) {
    if ((err as ErroApi).status === 401) {
      sessao.set('');
      telaLogin('Sua sessão expirou. Entre de novo.');
    }
    throw err;
  }
}

const arquivoUrl = (e: Envio, a: Arquivo) => `api/arquivos/${e.id}/${encodeURIComponent(a.nome)}?s=${sessao.get()}`;

/* ====================== Login ====================== */

function telaLogin(msg = '') {
  const senha = h('input.al-input', { type: 'password', placeholder: 'Senha do professor', autocomplete: 'current-password', 'aria-label': 'Senha' }) as HTMLInputElement;
  const mostrar = h('button.al-link-btn.pf-show', { type: 'button' }, 'mostrar');
  mostrar.addEventListener('click', () => {
    senha.type = senha.type === 'password' ? 'text' : 'password';
    mostrar.textContent = senha.type === 'password' ? 'mostrar' : 'esconder';
    senha.focus();
  });
  const erro = h('p.al-error', { role: 'alert' }, msg);
  const entrar = h('button.al-cta', { type: 'submit' }, 'Entrar');
  const form = h(
    'form.fb-card.rs-login',
    h('span.al-done-check.is-muted', icon(LockKeyhole, 36)),
    h('h1.al-done-title', 'Área do professor'),
    h('p.al-done-sub', 'Gerencie o mural da turma, abra e feche envios e veja o feedback das aulas.'),
    h('div.pf-pass', senha, mostrar),
    erro,
    entrar,
    h('a.al-back.pf-login-back', { href: 'index.html' }, 'Painel das aulas'),
  );
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!senha.value) return senha.focus();
    entrar.setAttribute('disabled', '');
    try {
      const r = await api<{ sessao: string }>('/professor/entrar', { method: 'POST', body: JSON.stringify({ senha: senha.value }) });
      sessao.set(r.sessao);
      void iniciar();
    } catch (err) {
      erro.textContent = (err as Error).message;
      entrar.removeAttribute('disabled');
      senha.select();
    }
  });
  app.replaceChildren(h('main.hub.al-page.fb-page', form));
  senha.focus();
}

/* ====================== Estrutura ====================== */

const nav = h('nav.pf-tabs', { role: 'tablist' });
const conteudo = h('section.pf-body');

async function iniciar() {
  if (!sessao.get()) return telaLogin();
  try {
    await recarregar();
  } catch (err) {
    if ((err as ErroApi).status !== 401) app.replaceChildren(h('main.hub.al-page', h('div.al-empty', h('p.al-empty-title', 'Não deu para carregar.'), h('p', (err as Error).message))));
    return;
  }
  const sair = h('button.hub-btn', { type: 'button' }, icon(LogOut, 18), 'Sair');
  sair.addEventListener('click', async () => {
    await prof('/sair', { method: 'POST' }).catch(() => undefined);
    sessao.set('');
    telaLogin();
  });
  app.replaceChildren(
    h(
      'main.hub.al-page.pf-page',
      cabecalho(
        'Professor  ·  No-Code Development Platforms',
        'Área do professor',
        'Modere o mural da turma, abra e feche envios e feedback e acompanhe as respostas.',
        h('div.al-header-row', h('a.hub-btn', { href: 'mural.html', target: '_blank' }, icon(Images, 18), 'Abrir o mural'), sair),
      ),
      nav,
      conteudo,
    ),
  );
  window.addEventListener('hashchange', () => mostrar());
  mostrar();
}

async function recarregar() {
  [resumo, envios] = await Promise.all([prof<Resumo>('/resumo'), prof<{ envios: Envio[] }>('/envios').then((r) => r.envios)]);
  for (const id of [...sel]) if (!envios.some((e) => e.id === id)) sel.delete(id);
}

function abaAtual(): Aba {
  const a = location.hash.slice(1).split('/')[0] as Aba;
  return ABAS.some((x) => x.id === a) ? a : 'geral';
}

function desenharNav() {
  const atual = abaAtual();
  nav.replaceChildren(
    ...ABAS.map((a) => {
      const badge = a.id === 'envios' && resumo.envios.pendente ? h('span.pf-badge', String(resumo.envios.pendente)) : null;
      return h('a.pf-tab', { href: `#${a.id}`, role: 'tab', 'aria-selected': String(a.id === atual) }, icon(a.icone, 18), a.rotulo, badge);
    }),
  );
}

function mostrar() {
  desenharNav();
  const aba = abaAtual();
  conteudo.replaceChildren();
  if (aba === 'geral') abaGeral();
  else if (aba === 'envios') abaEnvios();
  else if (aba === 'feedback') void abaFeedback();
  else if (aba === 'materiais') void abaMateriais();
  else abaConta();
}

/** Recarrega os dados e redesenha a aba atual. */
async function atualizar() {
  await recarregar();
  mostrar();
}

function chave(rotulo: string, ligado: boolean, aoMudar: (v: boolean) => void, descricao?: string) {
  const input = h('input', { type: 'checkbox' }) as HTMLInputElement;
  input.checked = ligado;
  const estado = h('span.pf-switch-state', ligado ? 'Aberto' : 'Fechado');
  input.addEventListener('change', () => {
    estado.textContent = input.checked ? 'Aberto' : 'Fechado';
    aoMudar(input.checked);
  });
  return h('label.fb-toggle.pf-switch', { title: descricao }, input, h('span.fb-switch'), h('span.pf-switch-txt', rotulo ? h('span', rotulo) : null, estado));
}

/* ====================== Visão geral ====================== */

async function salvarConfig(parcial: Partial<{ moderacao: boolean; aulas: Record<string, Partial<{ envios: boolean; feedback: boolean }>> }>, msg: string) {
  try {
    resumo.config = (await prof<{ config: ConfigPublica }>('/config', { method: 'PUT', body: JSON.stringify(parcial) })).config;
    aviso(msg);
  } catch (err) {
    aviso((err as Error).message, 'erro');
  }
  mostrar();
}

function abaGeral() {
  const r = resumo;
  const tile = (n: number, rotulo: string, href: string, cls = '') =>
    h(`a.rs-tile.pf-tile${cls}`, { href }, h('span.rs-tile-n', String(n)), h('span.rs-tile-l', rotulo));

  const mod = h('input', { type: 'checkbox' }) as HTMLInputElement;
  mod.checked = r.config.moderacao;
  mod.addEventListener('change', () =>
    salvarConfig({ moderacao: mod.checked }, mod.checked ? 'Novos envios agora esperam sua aprovação.' : 'Novos envios agora são publicados direto.'),
  );

  const linhas = AULAS.map((a) => {
    const c = r.config.aulas[String(a.numero)];
    return h(
      'div.pf-row',
      { 'data-accent': a.accent },
      h('div.pf-row-aula', h('span.al-aula-n', String(a.numero).padStart(2, '0')), h('span.pf-row-txt', h('strong', a.titulo), h('span', `${r.enviosPorAula[a.numero] ?? 0} envios  ·  ${r.feedback.porAula[a.numero] ?? 0} respostas`))),
      h('div.pf-row-ctl', h('span.pf-col-label', 'Envios ao mural'), chave('', c.envios, (v) => salvarConfig({ aulas: { [a.numero]: { envios: v } } }, `Envios da Aula ${a.numero} ${v ? 'abertos' : 'fechados'}.`))),
      h('div.pf-row-ctl', h('span.pf-col-label', 'Feedback'), chave('', c.feedback, (v) => salvarConfig({ aulas: { [a.numero]: { feedback: v } } }, `Feedback da Aula ${a.numero} ${v ? 'aberto' : 'fechado'}.`))),
    );
  });

  const tudo = (campoCfg: 'envios' | 'feedback', v: boolean) => {
    const b = h('button.hub-btn', { type: 'button' }, `${v ? 'Abrir' : 'Fechar'} ${campoCfg === 'envios' ? 'todos os envios' : 'todo o feedback'}`);
    b.addEventListener('click', () =>
      salvarConfig({ aulas: Object.fromEntries(AULAS.map((a) => [a.numero, { [campoCfg]: v }])) }, `${campoCfg === 'envios' ? 'Envios' : 'Feedback'} ${v ? 'aberto' : 'fechado'} em todas as aulas.`),
    );
    return b;
  };

  conteudo.append(
    h(
      'div.rs-tiles.pf-tiles',
      tile(r.envios.pendente, 'aguardando aprovação', '#envios', r.envios.pendente ? '.is-alert' : ''),
      tile(r.envios.publicado, 'envios publicados', '#envios'),
      tile(r.envios.oculto, 'envios ocultos', '#envios'),
      tile(r.feedback.total, 'respostas de feedback', '#feedback'),
    ),
    h(
      'section.rs-panel.pf-panel',
      h('h2.rs-panel-title', 'Moderação'),
      h(
        'label.fb-toggle.pf-mod',
        mod,
        h('span.fb-switch'),
        h('span.pf-switch-txt', h('strong', 'Aprovar envios antes de aparecer no mural'), h('span', 'Ligado: cada envio novo fica "aguardando" até você publicar. Desligado: aparece na hora para a turma.')),
      ),
    ),
    h(
      'section.rs-panel.pf-panel',
      h('h2.rs-panel-title', 'O que está aberto para os alunos'),
      h('p.al-hint.pf-hint', 'Fechado: o aluno vê um aviso e não consegue enviar. O que já foi enviado continua no mural.'),
      h('div.pf-rows', ...linhas),
      h('div.pf-bulk-cfg', tudo('envios', true), tudo('envios', false), tudo('feedback', true), tudo('feedback', false)),
    ),
  );
}

/* ====================== Envios ====================== */

async function acaoLote(ids: string[], acao: Status | 'excluir') {
  if (!ids.length) return;
  if (acao === 'excluir' && !confirm(`Excluir ${ids.length === 1 ? 'este envio' : `${ids.length} envios`} de vez, com os arquivos? Não dá para desfazer.`)) return;
  try {
    const r = await prof<{ alterados: number }>('/envios/lote', { method: 'POST', body: JSON.stringify({ ids, acao }) });
    const verbo = { publicado: 'publicado', pendente: 'marcado como aguardando', oculto: 'ocultado', excluir: 'excluído' }[acao];
    aviso(`${r.alterados} ${r.alterados === 1 ? 'envio' : 'envios'} ${verbo}${r.alterados === 1 ? '' : 's'}.`.replace('aguardandos', 'aguardando'));
    ids.forEach((id) => sel.delete(id));
    await atualizar();
  } catch (err) {
    aviso((err as Error).message, 'erro');
  }
}

function abaEnvios() {
  const f = filtroEnvios;
  const lista = envios.filter(
    (e) =>
      (!f.status || e.status === f.status) &&
      (!f.aula || e.aula === f.aula) &&
      (!f.busca || `${e.nome} ${e.curso} ${e.titulo} ${e.texto}`.toLowerCase().includes(f.busca)),
  );

  const chipsStatus = h(
    'div.al-chips',
    ...([['', 'Todos'], ['pendente', 'Aguardando'], ['publicado', 'Publicados'], ['oculto', 'Ocultos']] as const).map(([v, rot]) => {
      const n = v ? envios.filter((e) => e.status === v).length : envios.length;
      const b = h(`button.al-chip${v === 'pendente' && n ? '.is-alert' : ''}`, { type: 'button', 'aria-selected': String(f.status === v) }, rot, h('span.al-chip-n', String(n)));
      b.addEventListener('click', () => {
        f.status = v;
        mostrar();
      });
      return b;
    }),
  );
  const chipsAula = h(
    'div.al-chips',
    ...[{ v: '', r: 'Todas as aulas', ac: '' }, ...AULAS.map((a) => ({ v: String(a.numero), r: `Aula ${a.numero}`, ac: a.accent }))].map((o) => {
      const b = h('button.al-chip', { type: 'button', 'data-accent': o.ac || undefined, 'aria-selected': String(f.aula === o.v) }, o.r);
      b.addEventListener('click', () => {
        f.aula = o.v;
        mostrar();
      });
      return b;
    }),
  );
  const busca = h('input.al-input.al-search-input', { type: 'search', placeholder: 'Buscar por nome, curso, título ou texto', value: f.busca }) as HTMLInputElement;
  busca.addEventListener('input', () => {
    f.busca = busca.value.trim().toLowerCase();
    const pos = busca.selectionStart;
    mostrar();
    const novo = conteudo.querySelector<HTMLInputElement>('.al-search-input');
    novo?.focus();
    novo?.setSelectionRange(pos, pos);
  });

  // Barra de ações em lote
  const visiveis = lista.map((e) => e.id);
  const marcados = visiveis.filter((id) => sel.has(id));
  const todos = h('input', { type: 'checkbox', 'aria-label': 'Selecionar todos os envios da lista' }) as HTMLInputElement;
  todos.checked = visiveis.length > 0 && marcados.length === visiveis.length;
  todos.indeterminate = marcados.length > 0 && !todos.checked;
  todos.addEventListener('change', () => {
    visiveis.forEach((id) => (todos.checked ? sel.add(id) : sel.delete(id)));
    mostrar();
  });
  const botaoLote = (rot: string, ic: typeof Eye, acao: Status | 'excluir', cls = '') => {
    const b = h(`button.hub-btn${cls}`, { type: 'button', disabled: !marcados.length }, icon(ic, 16), rot);
    b.addEventListener('click', () => acaoLote(marcados, acao));
    return b;
  };
  const pendentes = envios.filter((e) => e.status === 'pendente').map((e) => e.id);
  const aprovarTodos = pendentes.length ? h('button.hub-btn.is-primary', { type: 'button' }, icon(Check, 16), `Publicar os ${pendentes.length} aguardando`) : null;
  aprovarTodos?.addEventListener('click', () => acaoLote(pendentes, 'publicado'));

  const barra = h(
    'div.pf-bulk',
    h('label.pf-check', todos, h('span', marcados.length ? `${marcados.length} selecionado${marcados.length > 1 ? 's' : ''}` : 'Selecionar todos')),
    h('span.al-foot-gap'),
    botaoLote('Publicar', Eye, 'publicado'),
    botaoLote('Ocultar', EyeOff, 'oculto'),
    botaoLote('Excluir', Trash2, 'excluir', '.al-danger'),
  );

  conteudo.append(
    h('div.pf-filters', chipsStatus, h('label.al-search', icon(Search, 18), busca)),
    h('div.pf-filters', chipsAula, aprovarTodos),
    barra,
    lista.length
      ? h('ul.pf-list', ...lista.map(linhaEnvio))
      : h('div.al-empty', h('p.al-empty-title', envios.length ? 'Nenhum envio com esses filtros.' : 'Nenhum envio ainda.'), h('p', envios.length ? 'Mude os filtros acima.' : 'Os alunos enviam pelo mural da turma.')),
  );
}

function linhaEnvio(e: Envio) {
  const aula = aulaInfo(e.aula);
  const capa = e.arquivos.find((a) => a.imagem);
  const check = h('input', { type: 'checkbox', 'aria-label': `Selecionar "${e.titulo}"` }) as HTMLInputElement;
  check.checked = sel.has(e.id);
  check.addEventListener('change', () => {
    if (check.checked) sel.add(e.id);
    else sel.delete(e.id);
    mostrar();
  });
  const st = STATUS_INFO[e.status];
  const acoes = h('div.pf-actions');
  const acao = (rot: string, ic: typeof Eye, a: Status | 'excluir', cls = '') => {
    const b = h(`button.hub-btn.pf-act${cls}`, { type: 'button', title: rot }, icon(ic, 16), h('span', rot));
    b.addEventListener('click', () => acaoLote([e.id], a));
    acoes.append(b);
  };
  if (e.status !== 'publicado') acao('Publicar', Eye, 'publicado', '.is-primary');
  if (e.status !== 'oculto') acao('Ocultar', EyeOff, 'oculto');
  acao('Excluir', Trash2, 'excluir', '.al-danger');

  const abrir = h(
    'button.pf-item-main',
    { type: 'button', 'aria-label': `Ver "${e.titulo}"` },
    capa ? h('span.pf-thumb', h('img', { src: arquivoUrl(e, capa), alt: '', loading: 'lazy' })) : h('span.pf-thumb.is-empty', icon(FileText, 22)),
    h(
      'span.pf-item-txt',
      h('span.pf-item-top', h(`span.pf-status.is-${e.status}`, icon(st.icone, 14), st.rotulo), h('span.al-tag', `Aula ${e.aula}`)),
      h('span.al-card-title', e.titulo),
      h('span.al-author-sub', `${e.nome}  ·  ${e.curso}  ·  ${quando(e.criadoEm)}${e.arquivos.length ? `  ·  ${e.arquivos.length} arquivo${e.arquivos.length > 1 ? 's' : ''}` : ''}`),
    ),
  );
  abrir.addEventListener('click', () => verEnvio(e));
  return h(`li.pf-item.is-${e.status}${sel.has(e.id) ? '.is-sel' : ''}`, { 'data-accent': aula?.accent }, h('label.pf-check', check), abrir, acoes);
}

function verEnvio(e: Envio) {
  const d = h('dialog.al-dialog.al-viewer') as HTMLDialogElement;
  d.dataset.accent = aulaInfo(e.aula)?.accent;
  d.addEventListener('click', (ev) => ev.target === d && d.close());
  d.addEventListener('close', () => d.remove());
  const fechar = h('button.al-icon-btn', { type: 'button', 'aria-label': 'Fechar' }, icon(X, 22));
  fechar.addEventListener('click', () => d.close());
  const st = STATUS_INFO[e.status];
  const acoes = h('div.al-viewer-actions.pf-viewer-actions');
  const acao = (rot: string, ic: typeof Eye, a: Status | 'excluir', cls = '') => {
    const b = h(`button.hub-btn${cls}`, { type: 'button' }, icon(ic, 18), rot);
    b.addEventListener('click', async () => {
      d.close();
      await acaoLote([e.id], a);
    });
    acoes.append(b);
  };
  if (e.status !== 'publicado') acao('Publicar', Eye, 'publicado', '.is-primary');
  if (e.status !== 'oculto') acao('Ocultar', EyeOff, 'oculto');
  acao('Excluir', Trash2, 'excluir', '.al-danger');

  const imagens = e.arquivos.filter((a) => a.imagem);
  const outros = e.arquivos.filter((a) => !a.imagem);
  d.append(
    h(
      'div.al-viewer-head',
      h('div', h('span.pf-item-top', h(`span.pf-status.is-${e.status}`, icon(st.icone, 14), st.rotulo), h('span.al-tag', `Aula ${e.aula}`)), h('h2.al-viewer-title', e.titulo)),
      fechar,
    ),
    ...imagens.map((a) => h('a.al-viewer-stage', { href: arquivoUrl(e, a), target: '_blank', rel: 'noopener' }, h('img.al-viewer-main', { src: arquivoUrl(e, a), alt: a.original }))),
    h(
      'div.al-viewer-body',
      h('div.al-author', h('span.al-avatar', iniciais(e.nome)), h('span.al-author-txt', h('span.al-author-name', e.nome), h('span.al-author-sub', `${e.curso}  ·  ${new Date(e.criadoEm).toLocaleString('pt-BR')}`))),
      e.texto ? h('p.al-viewer-text', e.texto) : null,
      outros.length
        ? h('ul.al-files', ...outros.map((a) => h('li', h('a.al-file', { href: `${arquivoUrl(e, a)}&baixar`, download: a.original }, icon(FileText, 20), h('span.al-file-name', a.original), h('span.al-file-size', tamanho(a.tamanho)), icon(Download, 18)))))
        : null,
      acoes,
    ),
  );
  document.body.append(d);
  d.showModal();
}

/* ====================== Feedback ====================== */

async function abaFeedback() {
  conteudo.append(h('div.al-empty', h('p', 'Carregando respostas...')));
  let rs: Resposta[];
  try {
    rs = (await prof<{ respostas: Resposta[] }>('/feedback')).respostas;
  } catch (err) {
    conteudo.replaceChildren(h('div.al-empty', h('p.al-empty-title', 'Não deu para carregar.'), h('p', (err as Error).message)));
    return;
  }
  if (abaAtual() !== 'feedback') return;
  const lista = rs.filter((r) => !filtroFeedback || r.aula === filtroFeedback);
  const chips = h(
    'div.al-chips',
    ...[{ v: '', r: 'Todas', ac: '' }, ...AULAS.map((a) => ({ v: String(a.numero), r: `Aula ${a.numero}`, ac: a.accent }))].map((o) => {
      const b = h('button.al-chip', { type: 'button', 'data-accent': o.ac || undefined, 'aria-selected': String(filtroFeedback === o.v) }, o.r, h('span.al-chip-n', String(rs.filter((r) => !o.v || r.aula === o.v).length)));
      b.addEventListener('click', () => {
        filtroFeedback = o.v;
        mostrar();
      });
      return b;
    }),
  );
  const csv = h('button.hub-btn', { type: 'button', disabled: !lista.length }, icon(Download, 18), 'Baixar CSV');
  csv.addEventListener('click', () => baixarCsv(lista, `feedback-${filtroFeedback ? 'aula-' + filtroFeedback : 'todas'}.csv`));
  const apagar = async (r: Resposta) => {
    if (!confirm('Apagar esta resposta do feedback? (ex.: comentário ofensivo ou duplicado)')) return;
    try {
      await prof('/feedback', { method: 'DELETE', body: JSON.stringify({ ids: [r.id] }) });
      aviso('Resposta apagada.');
      await atualizar();
    } catch (err) {
      aviso((err as Error).message, 'erro');
    }
  };
  conteudo.replaceChildren(h('div.pf-filters', chips, csv), ...painelFeedback(lista, apagar));
}

/* ====================== Materiais ====================== */

interface Material {
  arquivo: string;
  titulo: string;
  atualizadoEm: string;
  tamanho: number;
}

/** #materiais lista os documentos; #materiais/<arquivo.md> abre um deles. */
async function abaMateriais() {
  const aberto = decodeURIComponent(location.hash.split('/')[1] ?? '');
  conteudo.append(h('div.al-empty', h('p', 'Carregando...')));
  try {
    if (aberto) await abrirMaterial(aberto);
    else await listarMateriais();
  } catch (err) {
    conteudo.replaceChildren(h('div.al-empty', h('p.al-empty-title', 'Não deu para carregar.'), h('p', (err as Error).message)));
  }
}

async function listarMateriais() {
  const { materiais } = await prof<{ materiais: Material[] }>('/materiais');
  if (abaAtual() !== 'materiais') return;
  conteudo.replaceChildren(
    h('p.al-hint.pf-hint', 'Documentos só seus: ficam na pasta materiais-professor/ do projeto e não aparecem no site para os alunos.'),
    materiais.length
      ? h(
          'div.pf-docs',
          ...materiais.map((m) =>
            h(
              'a.hub-aluno.pf-doc',
              { href: `#materiais/${encodeURIComponent(m.arquivo)}` },
              h('span.hub-aluno-ic', icon(BookText, 26)),
              h('span.hub-aluno-txt', h('span.hub-aluno-title', m.titulo), h('span.hub-aluno-sub', `${m.arquivo}  ·  atualizado ${quando(m.atualizadoEm)}`)),
            ),
          ),
        )
      : h('div.al-empty', h('p.al-empty-title', 'Nenhum material ainda.'), h('p', 'Coloque arquivos .md na pasta materiais-professor/ do projeto.')),
  );
}

async function abrirMaterial(arquivo: string) {
  const m = await prof<Material & { conteudo: string }>(`/materiais/${encodeURIComponent(arquivo)}`);
  if (abaAtual() !== 'materiais') return;
  const doc = h('article.md-doc', { html: await marked.parse(m.conteudo, { gfm: true }) });

  // Títulos com âncora + sumário lateral a partir dos h2.
  const usados = new Set<string>();
  const sumario = h('ol.md-toc-list');
  doc.querySelectorAll('h2, h3').forEach((t) => {
    let id = (t.textContent ?? '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w]+/g, '-')
      .replace(/^-|-$/g, '');
    while (usados.has(id)) id += '-2';
    usados.add(id);
    t.id = id;
    if (t.tagName === 'H2') {
      const a = h('a', { href: `#materiais/${encodeURIComponent(arquivo)}` }, t.textContent ?? '');
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      sumario.append(h('li', a));
    }
  });

  // Botão "Copiar" em cada bloco de código (os prompts).
  doc.querySelectorAll('pre').forEach((pre) => {
    const b = h('button.md-copy', { type: 'button' }, icon(Copy, 14), 'Copiar');
    b.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.querySelector('code')?.textContent ?? pre.textContent ?? '');
        b.replaceChildren(icon(Check, 14), 'Copiado');
        setTimeout(() => b.replaceChildren(icon(Copy, 14), 'Copiar'), 1800);
      } catch {
        aviso('Não deu para copiar. Selecione o texto e use Ctrl+C.', 'erro');
      }
    });
    pre.prepend(b);
  });
  // Links externos abrem em outra aba.
  doc.querySelectorAll<HTMLAnchorElement>('a[href^="http"]').forEach((a) => {
    a.target = '_blank';
    a.rel = 'noopener';
  });

  const baixar = h('button.hub-btn', { type: 'button' }, icon(Download, 18), 'Baixar .md');
  baixar.addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([m.conteudo], { type: 'text/markdown;charset=utf-8' }));
    const a = h('a', { href: url, download: m.arquivo }) as HTMLAnchorElement;
    a.click();
    URL.revokeObjectURL(url);
  });
  const imprimir = h('button.hub-btn', { type: 'button' }, icon(FileText, 18), 'Imprimir / PDF');
  imprimir.addEventListener('click', () => window.print());

  conteudo.replaceChildren(
    h('div.pf-filters.md-bar', h('a.hub-btn', { href: '#materiais' }, icon(ArrowLeft, 18), 'Todos os materiais'), h('span.md-bar-actions', baixar, imprimir)),
    h('div.md-layout', h('nav.md-toc', { 'aria-label': 'Sumário' }, h('p.md-toc-title', 'Sumário'), sumario), doc),
  );
}

/* ====================== Conta ====================== */

function abaConta() {
  const atual = h('input.al-input', { type: 'password', autocomplete: 'current-password' }) as HTMLInputElement;
  const nova = h('input.al-input', { type: 'password', autocomplete: 'new-password', minlength: 8 }) as HTMLInputElement;
  const conf = h('input.al-input', { type: 'password', autocomplete: 'new-password' }) as HTMLInputElement;
  const outros = h('input', { type: 'checkbox' }) as HTMLInputElement;
  outros.checked = true;
  const erro = h('p.al-error', { role: 'alert' });
  const salvar = h('button.al-cta', { type: 'submit' }, 'Trocar senha');
  const form = h(
    'form.rs-panel.pf-panel.pf-conta',
    h('h2.rs-panel-title', icon(KeyRound, 20), 'Trocar senha'),
    campo('Senha atual', atual),
    campo('Nova senha', nova, { dica: 'Pelo menos 8 caracteres.' }),
    campo('Repita a nova senha', conf),
    h('label.fb-toggle.pf-outros', outros, h('span.fb-switch'), h('span', 'Sair de todos os outros aparelhos')),
    erro,
    salvar,
  );
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    erro.textContent = '';
    if (nova.value.length < 8) return void (erro.textContent = 'A nova senha precisa ter pelo menos 8 caracteres.');
    if (nova.value !== conf.value) return void (erro.textContent = 'As duas senhas novas não são iguais.');
    salvar.setAttribute('disabled', '');
    try {
      await prof('/senha', { method: 'POST', body: JSON.stringify({ atual: atual.value, nova: nova.value, sairDosOutros: outros.checked }) });
      (form as HTMLFormElement).reset();
      aviso('Senha trocada.');
    } catch (err) {
      erro.textContent = (err as Error).message;
    }
    salvar.removeAttribute('disabled');
  });
  conteudo.append(
    form,
    h(
      'section.rs-panel.pf-panel',
      h('h2.rs-panel-title', 'Onde ficam os dados'),
      h(
        'p.al-hint',
        'Envios, arquivos, respostas e configurações ficam na pasta dados/ do projeto, no servidor. A sessão deste navegador dura 30 dias. Se esquecer a senha, apague "senha" de dados/config.json e reinicie o container: volta a valer SENHA_PROFESSOR do .env.',
      ),
    ),
  );
}

void iniciar();
