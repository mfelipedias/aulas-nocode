import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/hub.css';
import '../styles/aluno.css';

import { h } from '../engine/dom';
import type { AccentKey } from '../engine/types';

/**
 * Base das páginas dos alunos (mural.html e feedback.html): API, dados guardados no aparelho e utilidades de UI.
 * Metadados das aulas repetidos aqui de propósito: assim estas páginas não baixam o código dos decks.
 */

export interface AulaInfo {
  numero: 1 | 2 | 3 | 4;
  titulo: string;
  data: string;
  accent: AccentKey;
}

export const AULAS: AulaInfo[] = [
  { numero: 1, titulo: 'Do problema ao protótipo', data: '2026-10-08', accent: 'aula1' },
  { numero: 2, titulo: 'Dando vida às telas', data: '2026-10-15', accent: 'aula2' },
  { numero: 3, titulo: 'Conectando o mundo', data: '2026-10-22', accent: 'aula3' },
  { numero: 4, titulo: 'Publicar, avaliar e o que vem depois', data: '2026-10-29', accent: 'aula4' },
];

export const aulaInfo = (n: string | number | null | undefined) => AULAS.find((a) => String(a.numero) === String(n));

/** Aula de hoje ou, se não houver, a mais recente que já aconteceu (padrão dos formulários). */
export function aulaAtual(): AulaInfo {
  const hoje = new Date().toISOString().slice(0, 10);
  return [...AULAS].reverse().find((a) => a.data <= hoje) ?? AULAS[0];
}

/** Página rolável no mesmo visual do painel. */
export function iniciarPagina(titulo: string, pagina: string) {
  document.title = titulo;
  document.documentElement.dataset.mode = 'hub';
  document.documentElement.dataset.page = pagina;
}

/* ---------- Armazenamento local (tudo em try/catch: modo anônimo pode bloquear) ---------- */

function ler<T>(chave: string, padrao: T): T {
  try {
    const v = localStorage.getItem(chave);
    return v ? (JSON.parse(v) as T) : padrao;
  } catch {
    return padrao;
  }
}
function gravar(chave: string, valor: unknown) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* sem armazenamento: segue sem lembrar */
  }
}

export interface Identidade {
  nome: string;
  curso: string;
}
export const identidade = {
  get: () => ler<Identidade>('nocode-aluno', { nome: '', curso: '' }),
  set: (v: Identidade) => gravar('nocode-aluno', v),
};

/** Tokens dos envios feitos neste aparelho: permitem excluir o próprio envio. */
export const meusEnvios = {
  all: () => ler<Record<string, string>>('nocode-envios', {}),
  add(id: string, token: string) {
    gravar('nocode-envios', { ...meusEnvios.all(), [id]: token });
  },
  remove(id: string) {
    const t = meusEnvios.all();
    delete t[id];
    gravar('nocode-envios', t);
  },
};

/** Sessão do professor (criada no login da área do professor). */
export const sessao = {
  get: () => ler<string>('nocode-sessao', ''),
  set: (v: string) => gravar('nocode-sessao', v),
};

export const feedbackEnviado = {
  has: (aula: number) => ler<number[]>('nocode-feedback', []).includes(aula),
  add: (aula: number) => gravar('nocode-feedback', [...new Set([...ler<number[]>('nocode-feedback', []), aula])]),
};

/* ---------- API ---------- */

export class ErroApi extends Error {
  constructor(
    msg: string,
    public status: number,
  ) {
    super(msg);
  }
}

export async function api<T>(caminho: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  const headers = new Headers(init.headers);
  if (caminho.startsWith('/professor/') && sessao.get()) headers.set('authorization', `Bearer ${sessao.get()}`);
  if (typeof init.body === 'string' && !headers.has('content-type')) headers.set('content-type', 'application/json');
  try {
    res = await fetch(`api${caminho}`, { ...init, headers });
  } catch {
    throw new ErroApi('Sem conexão com o servidor. Confira sua internet e tente de novo.', 0);
  }
  const corpo = await res.json().catch(() => ({}));
  if (!res.ok) throw new ErroApi(corpo.erro ?? `Erro ${res.status}. Tente de novo.`, res.status);
  return corpo as T;
}

/** O que está aberto para envio e feedback (definido pelo professor). */
export interface ConfigPublica {
  moderacao: boolean;
  aulas: Record<string, { envios: boolean; feedback: boolean }>;
}
export const carregarConfig = () => api<ConfigPublica>('/config').catch(() => null);

/* ---------- UI ---------- */

let toastEl: HTMLElement | null = null;
let toastTimer = 0;
export function aviso(msg: string, tipo: 'ok' | 'erro' = 'ok') {
  if (!toastEl) {
    toastEl = h('div.al-toast', { role: 'status', 'aria-live': 'polite' });
    document.body.append(toastEl);
  }
  toastEl.textContent = msg;
  toastEl.dataset.tipo = tipo;
  toastEl.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl?.classList.remove('is-on'), tipo === 'erro' ? 5000 : 2800);
}

export function iniciais(nome: string) {
  const p = nome.trim().split(/\s+/);
  return ((p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
}

export function quando(iso: string) {
  const d = new Date(iso);
  const seg = (Date.now() - d.getTime()) / 1000;
  if (seg < 60) return 'agora mesmo';
  if (seg < 3600) return `há ${Math.floor(seg / 60)} min`;
  if (seg < 86400) return `há ${Math.floor(seg / 3600)} h`;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function tamanho(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
}

/** Campo de formulário com rótulo, dica e (opcional) contador de caracteres. */
export function campo(
  rotulo: string,
  controle: HTMLInputElement | HTMLTextAreaElement | HTMLElement,
  opts: { dica?: string; opcional?: boolean; contador?: number } = {},
) {
  const id = controle.id || `c-${Math.random().toString(36).slice(2, 8)}`;
  controle.id = id;
  const cont = opts.contador ? h('span.al-count', `0/${opts.contador}`) : null;
  if (cont && 'value' in controle) {
    const upd = () => (cont.textContent = `${(controle as HTMLInputElement).value.length}/${opts.contador}`);
    controle.addEventListener('input', upd);
    queueMicrotask(upd);
  }
  return h(
    'div.al-field',
    h('label.al-label', { for: id }, rotulo, opts.opcional ? h('span.al-opt', 'opcional') : null, cont),
    controle,
    opts.dica ? h('p.al-hint', opts.dica) : null,
  );
}

export function cabecalho(kicker: string, titulo: string, sub: string, ...extra: Array<Node | null>) {
  return h(
    'header.al-header',
    h('a.al-back', { href: 'index.html' }, 'Painel das aulas'),
    h('p.hub-kicker', kicker),
    h('h1.hub-h1', titulo),
    h('p.hub-sub', sub),
    ...extra,
  );
}
