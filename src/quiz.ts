import QRCode from 'qrcode';
import { Check, Circle, Diamond, LockKeyhole, Maximize, Play, Square, Trophy, Triangle, Users, X } from 'lucide';
import { api, aviso, identidade, iniciarPagina, sessao } from './aluno/comum';
import { h } from './engine/dom';
import { icon } from './engine/icons';
import './styles/quiz.css';

/**
 * Quiz ao vivo no estilo Kahoot (quiz.html).
 * Sem parâmetro: o aluno entra com um apelido e responde pelo celular.
 * ?telao: a tela projetada, só com a sessão do professor. Mostra o QR, as perguntas, a revelação e o placar,
 * e avança as fases (Espaço ou →). As perguntas vêm de materiais-professor/quiz-*.json, pela API.
 * Os dois lados acompanham o jogo por long polling em /api/quiz/estado e /api/professor/quiz/estado.
 */

type Fase = 'fechado' | 'lobby' | 'pergunta' | 'revelacao' | 'placar' | 'fim';
interface Pergunta {
  texto: string;
  respostas: string[];
  tempo?: number;
  correta?: number;
  explicacao?: string;
  contagem?: number[];
}
interface Posicao {
  id: string;
  nome: string;
  pontos: number;
  acertos: number;
  posicao: number;
}
interface EstadoJogador {
  fase: Fase;
  versao: number;
  quizId?: string;
  titulo?: string;
  total?: number;
  atual?: number;
  jogadores?: number;
  pergunta?: Pergunta;
  restaMs?: number;
  podio?: Posicao[];
  eu?: {
    id: string;
    nome: string;
    pontos: number;
    acertos: number;
    sequencia: number;
    posicao: number;
    resposta: { escolha: number; pontos?: number; certa?: boolean } | null;
  };
}
interface EstadoTelao {
  fase: Fase;
  versao: number;
  titulo?: string;
  total?: number;
  atual?: number;
  jogadores?: Array<{ id: string; nome: string }>;
  pergunta?: Pergunta;
  restaMs?: number;
  responderam?: number;
  ranking?: Posicao[];
  quizzes?: Array<{ arquivo: string; titulo: string; perguntas: number }>;
}

/** As quatro alternativas: cor e forma, como no Kahoot. */
const FORMAS = [
  { cor: 'vermelho', icone: Triangle },
  { cor: 'azul', icone: Diamond },
  { cor: 'amarelo', icone: Circle },
  { cor: 'verde', icone: Square },
];

const app = document.getElementById('app')!;
const telao = new URLSearchParams(location.search).has('telao');
iniciarPagina(telao ? 'Quiz ao vivo: telão' : 'Quiz ao vivo', telao ? 'quiz-telao' : 'quiz');
document.documentElement.dataset.accent = 'aula4';

const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));
const pontos = (n: number) => n.toLocaleString('pt-BR');
const certas = (n: number) => `${n} ${n === 1 ? 'certa' : 'certas'}`;

/** Contagem regressiva a partir do tempo restante informado pelo servidor (sem depender do relógio do aparelho). */
function cronometro(restaMs: number, total: number, aoMudar: (seg: number, fracao: number) => void) {
  const fim = performance.now() + restaMs;
  let raf = 0;
  const passo = () => {
    const resta = Math.max(0, fim - performance.now());
    aoMudar(Math.ceil(resta / 1000), resta / (total * 1000));
    if (resta > 0) raf = requestAnimationFrame(passo);
  };
  passo();
  return () => cancelAnimationFrame(raf);
}

/* ====================== Celular do aluno ====================== */

interface Credencial {
  quizId: string;
  id: string;
  token: string;
}
const CHAVE = 'nocode-quiz';
const credencial = {
  get(): Credencial | null {
    try {
      return JSON.parse(localStorage.getItem(CHAVE) ?? 'null');
    } catch {
      return null;
    }
  },
  set(c: Credencial | null) {
    try {
      if (c) localStorage.setItem(CHAVE, JSON.stringify(c));
      else localStorage.removeItem(CHAVE);
    } catch {
      /* sem armazenamento: recarregar a página pede o nome de novo */
    }
  },
};
let cred = credencial.get();
const cabecalhosJogador = (): Record<string, string> => (cred ? { 'x-jogador': cred.id, 'x-token': cred.token } : {});

let estadoAluno: EstadoJogador | null = null;
let chaveTela = '';
let pararCronometro = () => {};

async function jogar() {
  let v = 0;
  for (;;) {
    const pedido = cred;
    try {
      const e = await api<EstadoJogador>(`/quiz/estado?v=${v}`, { headers: cabecalhosJogador() });
      // Entrou (ou saiu) enquanto esta espera estava aberta: a resposta veio sem o jogador certo. Pergunta de novo.
      if (pedido !== cred) {
        v = 0;
        continue;
      }
      v = e.versao;
      mostrarAluno(e);
    } catch {
      await espera(2500);
    }
  }
}

function mostrarAluno(e: EstadoJogador) {
  // Jogo novo, ou o professor tirou este nome da sala: volta para a entrada.
  if (cred && (e.fase === 'fechado' || e.quizId !== cred.quizId || !e.eu)) {
    cred = null;
    credencial.set(null);
  }
  estadoAluno = e;
  const chave = `${e.fase}:${e.atual}:${cred ? 'dentro' : 'fora'}:${e.eu?.resposta ? 'respondeu' : ''}`;
  if (chave === chaveTela) return;
  chaveTela = chave;
  pararCronometro();

  let corpo: HTMLElement;
  if (e.fase === 'fechado') corpo = telaAviso(LockKeyhole, 'Nenhum quiz aberto agora', 'Deixe esta página aberta: quando o professor abrir o quiz, ela atualiza sozinha.');
  else if (!cred) corpo = e.fase === 'fim' ? telaAviso(Trophy, 'O quiz acabou', 'Olhe o pódio no telão.') : telaEntrada(e);
  else if (e.fase === 'lobby') corpo = telaAviso(Check, `Você está dentro, ${e.eu!.nome}!`, 'Olhe para o telão. O quiz começa quando o professor mandar.', true);
  else if (e.fase === 'pergunta') corpo = e.eu!.resposta ? telaRespondida(e) : telaPergunta(e);
  else if (e.fase === 'revelacao') corpo = telaResultado(e);
  else if (e.fase === 'placar') corpo = telaPosicao(e);
  else corpo = telaFinal(e);

  const barra = cred && e.eu ? h('header.qz-barra', h('span.qz-barra-nome', e.eu.nome), h('span.qz-barra-pts', `${pontos(e.eu.pontos)} pts`)) : null;
  app.replaceChildren(h('main.qz-aluno', barra, corpo));
}

function telaAviso(ic: typeof Check, titulo: string, sub: string, destaque = false) {
  return h(
    'section.qz-centro',
    h(`span.al-done-check${destaque ? '' : '.is-muted'}`, icon(ic, 40)),
    h('h1.al-done-title', titulo),
    h('p.al-done-sub', sub),
  );
}

function telaEntrada(e: EstadoJogador) {
  const nome = h('input.al-input.qz-nome', { type: 'text', maxlength: 24, placeholder: 'Seu nome ou apelido', autocomplete: 'nickname', value: identidade.get().nome.split(' ')[0] ?? '', 'aria-label': 'Seu nome ou apelido' }) as HTMLInputElement;
  const erro = h('p.al-error', { role: 'alert' });
  const entrar = h('button.al-cta', { type: 'submit' }, 'Entrar no quiz', icon(Play, 20)) as HTMLButtonElement;
  const form = h(
    'form.qz-centro',
    h('p.hub-kicker', 'Quiz ao vivo'),
    h('h1.al-done-title', e.titulo ?? 'Quiz'),
    h('p.al-done-sub', e.fase === 'lobby' ? 'Escolha como você vai aparecer no telão.' : 'O quiz já começou, mas ainda dá para entrar.'),
    nome,
    erro,
    entrar,
  );
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!nome.value.trim()) return nome.focus();
    entrar.disabled = true;
    try {
      const r = await api<{ jogador: { id: string; token: string }; estado: EstadoJogador }>('/quiz/entrar', { method: 'POST', body: JSON.stringify({ nome: nome.value }) });
      cred = { quizId: r.estado.quizId!, ...r.jogador };
      credencial.set(cred);
      mostrarAluno(r.estado);
    } catch (err) {
      erro.textContent = (err as Error).message;
      entrar.disabled = false;
    }
  });
  queueMicrotask(() => nome.focus());
  return form;
}

const numero = (e: { atual?: number; total?: number }) => h('p.qz-num', `Pergunta ${(e.atual ?? 0) + 1} de ${e.total}`);

function telaPergunta(e: EstadoJogador) {
  const p = e.pergunta!;
  const seg = h('span.qz-seg');
  const barra = h('span.qz-tempo-barra');
  pararCronometro = cronometro(e.restaMs ?? 0, p.tempo ?? 20, (s, f) => {
    seg.textContent = String(s);
    barra.style.transform = `scaleX(${f})`;
  });
  const botoes = p.respostas.map((r, i) => {
    const b = h(`button.qz-opcao.is-${FORMAS[i].cor}`, { type: 'button' }, h('span.qz-forma', icon(FORMAS[i].icone, 26)), h('span.qz-opcao-txt', r)) as HTMLButtonElement;
    b.addEventListener('click', () => responder(e.atual!, i, botoes));
    return b;
  });
  return h(
    'section.qz-jogo',
    h('div.qz-tempo', barra),
    h('div.qz-topo', numero(e), seg),
    h('h1.qz-texto', p.texto),
    h('div.qz-opcoes', ...botoes),
  );
}

async function responder(pergunta: number, escolha: number, botoes: HTMLButtonElement[]) {
  botoes.forEach((b, i) => {
    b.disabled = true;
    b.classList.toggle('is-escolhida', i === escolha);
  });
  try {
    const r = await api<{ estado: EstadoJogador }>('/quiz/responder', { method: 'POST', headers: cabecalhosJogador(), body: JSON.stringify({ pergunta, escolha }) });
    mostrarAluno(r.estado);
  } catch (err) {
    aviso((err as Error).message, 'erro');
    if (estadoAluno?.fase === 'pergunta') botoes.forEach((b) => (b.disabled = false));
  }
}

function telaRespondida(e: EstadoJogador) {
  const i = e.eu!.resposta!.escolha;
  return h(
    'section.qz-centro',
    h(`span.qz-forma-grande.is-${FORMAS[i].cor}`, icon(FORMAS[i].icone, 44)),
    h('h1.al-done-title', 'Resposta enviada'),
    h('p.al-done-sub', `Você escolheu "${e.pergunta!.respostas[i]}". Espere o tempo acabar.`),
  );
}

function telaResultado(e: EstadoJogador) {
  const r = e.eu!.resposta;
  const p = e.pergunta!;
  const certa = Boolean(r?.certa);
  return h(
    `section.qz-centro.qz-resultado.${certa ? 'is-certa' : 'is-errada'}`,
    h('span.qz-resultado-ic', icon(certa ? Check : X, 48)),
    h('h1.al-done-title', certa ? 'Acertou!' : r ? 'Não foi dessa vez' : 'O tempo acabou'),
    certa ? h('p.qz-ganho', `+${pontos(r!.pontos ?? 0)}`) : null,
    certa && e.eu!.sequencia > 1 ? h('p.qz-sequencia', `${e.eu!.sequencia} acertos seguidos`) : null,
    h('p.qz-certa', h('span', 'Resposta certa'), p.respostas[p.correta!]),
    p.explicacao ? h('p.al-done-sub', p.explicacao) : null,
  );
}

function telaPosicao(e: EstadoJogador) {
  const eu = e.eu!;
  return h(
    'section.qz-centro',
    h('p.qz-posicao', `${eu.posicao}º`),
    h('h1.al-done-title', 'lugar'),
    h('p.al-done-sub', `${pontos(eu.pontos)} pontos  ·  ${eu.acertos} de ${(e.atual ?? 0) + 1} ${(e.atual ?? 0) + 1 === 1 ? 'certa' : 'certas'}`),
  );
}

function telaFinal(e: EstadoJogador) {
  const eu = e.eu!;
  const medalha = ['🥇', '🥈', '🥉'][eu.posicao - 1];
  return h(
    'section.qz-centro',
    h('p.qz-posicao', medalha ?? `${eu.posicao}º`),
    h('h1.al-done-title', medalha ? `${eu.posicao}º lugar!` : `Você ficou em ${eu.posicao}º`),
    h('p.al-done-sub', `${pontos(eu.pontos)} pontos  ·  ${eu.acertos} de ${e.total} certas. Obrigado por jogar!`),
    h('div.al-done-actions', h('a.hub-btn', { href: 'feedback.html?aula=4' }, 'Dar feedback da aula'), h('a.hub-btn', { href: 'mural.html' }, 'Ver o mural')),
  );
}

/* ====================== Telão do professor ====================== */

let estadoTelao: EstadoTelao | null = null;
let atualizarParcial: ((e: EstadoTelao) => void) | null = null;

async function acompanhar() {
  let v = 0;
  for (;;) {
    try {
      const e = await api<EstadoTelao>(`/professor/quiz/estado?v=${v}`);
      v = e.versao;
      mostrarTelao(e);
    } catch (err) {
      if ((err as { status?: number }).status === 401) {
        sessao.set('');
        return semSessao();
      }
      await espera(2500);
    }
  }
}

async function comando(acao: string, corpo: object = {}) {
  try {
    mostrarTelao(await api<EstadoTelao>(`/professor/quiz/${acao}`, { method: 'POST', body: JSON.stringify(corpo) }));
  } catch (err) {
    aviso((err as Error).message, 'erro');
  }
}

function semSessao() {
  app.replaceChildren(
    h(
      'main.hub.al-page.fb-page',
      h(
        'section.fb-card.al-done',
        h('span.al-done-check.is-muted', icon(LockKeyhole, 36)),
        h('h1.al-done-title', 'Telão do quiz'),
        h('p.al-done-sub', 'Entre na área do professor neste navegador e volte para esta página.'),
        h('a.al-cta', { href: 'professor.html#quiz' }, 'Ir para a área do professor'),
      ),
    ),
  );
}

function mostrarTelao(e: EstadoTelao) {
  estadoTelao = e;
  const chave = `${e.fase}:${e.atual}`;
  if (chave === chaveTela && atualizarParcial) return atualizarParcial(e);
  chaveTela = chave;
  pararCronometro();
  atualizarParcial = null;

  const ultima = (e.atual ?? 0) + 1 >= (e.total ?? 0);
  const proximo: Record<Fase, string> = {
    fechado: '',
    lobby: 'Começar',
    pergunta: 'Revelar agora',
    revelacao: 'Ver placar',
    placar: ultima ? 'Resultado final' : 'Próxima pergunta',
    fim: '',
  };
  let corpo: HTMLElement;
  if (e.fase === 'fechado') corpo = telaoEscolher(e);
  else if (e.fase === 'lobby') corpo = telaoLobby(e);
  else if (e.fase === 'pergunta' || e.fase === 'revelacao') corpo = telaoPergunta(e);
  else if (e.fase === 'placar') corpo = telaoPlacar(e);
  else corpo = telaoPodio(e);

  const avancar = proximo[e.fase] ? h('button.al-cta.qz-avancar', { type: 'button', title: 'Espaço ou →' }, proximo[e.fase]) : null;
  avancar?.addEventListener('click', () => comando('avancar'));
  const encerrar = e.fase !== 'fechado' ? h('button.hub-btn', { type: 'button' }, e.fase === 'fim' ? 'Fechar a sala' : 'Encerrar') : null;
  encerrar?.addEventListener('click', () => {
    if (e.fase === 'fim' || confirm('Encerrar o quiz agora? O placar deste jogo será perdido.')) void comando('encerrar');
  });
  const tela = h('button.hub-btn', { type: 'button', title: 'Tela cheia (F)' }, icon(Maximize, 18));
  tela.addEventListener('click', telaCheia);

  app.replaceChildren(
    h(
      `main.qz-telao.is-${e.fase}`,
      corpo,
      h('footer.qz-controles', h('span.qz-controles-info', e.titulo ?? ''), h('span.qz-controles-acoes', tela, encerrar, avancar)),
    ),
  );
}

function telaCheia() {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen().catch(() => undefined);
}

function telaoEscolher(e: EstadoTelao) {
  const lista = e.quizzes ?? [];
  return h(
    'section.qz-escolher',
    h('p.hub-kicker', 'Quiz ao vivo'),
    h('h1.hub-h1', 'Escolha o quiz'),
    lista.length
      ? h(
          'div.qz-escolher-lista',
          ...lista.map((q) => {
            const b = h('button.qz-escolher-item', { type: 'button' }, h('strong', q.titulo), h('span', `${q.perguntas} perguntas  ·  abrir a sala`));
            b.addEventListener('click', () => comando('abrir', { arquivo: q.arquivo }));
            return b;
          }),
        )
      : h('p.hub-sub', 'Nenhum quiz encontrado. Coloque um arquivo quiz-*.json em materiais-professor/ no servidor.'),
  );
}

function telaoLobby(e: EstadoTelao) {
  const url = new URL('quiz.html', location.href).href;
  const canvas = h('canvas.qz-qr') as HTMLCanvasElement;
  QRCode.toCanvas(canvas, url, { width: 420, margin: 1, color: { dark: '#050608', light: '#f2f4f9' } }).catch(() => canvas.remove());
  const n = h('span.qz-lobby-n');
  const nomes = h('div.qz-nomes');
  atualizarParcial = (x) => {
    const js = x.jogadores ?? [];
    n.replaceChildren(icon(Users, 28), `${js.length} ${js.length === 1 ? 'pessoa' : 'pessoas'}`);
    nomes.replaceChildren(
      ...(js.length
        ? js.map((j) => {
            const b = h('button.qz-nome-chip', { type: 'button', title: 'Clique para tirar da sala' }, j.nome);
            b.addEventListener('click', () => {
              if (confirm(`Tirar "${j.nome}" da sala?`)) void comando('remover', { id: j.id });
            });
            return b;
          })
        : [h('p.qz-nomes-vazio', 'Esperando a turma entrar...')]),
    );
  };
  atualizarParcial(e);
  return h(
    'section.qz-lobby',
    h(
      'div.qz-lobby-entrar',
      h('div.qz-qr-card', canvas),
      h('div', h('p.hub-kicker', 'Aponte a câmera do celular'), h('p.qz-url', url.replace(/^https?:\/\//, '')), h('h1.qz-lobby-titulo', e.titulo ?? 'Quiz'), h('p.hub-sub', `${e.total} perguntas. Quanto mais rápido você acertar, mais pontos ganha.`)),
    ),
    h('div.qz-lobby-sala', n, nomes),
  );
}

function telaoPergunta(e: EstadoTelao) {
  const p = e.pergunta!;
  const revelando = e.fase === 'revelacao';
  const total = p.contagem?.reduce((a, b) => a + b, 0) ?? 0;
  const relogio = h('span.qz-relogio');
  const resp = h('span.qz-responderam');
  if (!revelando) {
    pararCronometro = cronometro(e.restaMs ?? 0, p.tempo ?? 20, (s, f) => {
      relogio.textContent = String(s);
      relogio.style.setProperty('--f', String(f));
    });
    atualizarParcial = (x) => resp.replaceChildren(h('strong', String(x.responderam ?? 0)), ` de ${x.jogadores?.length ?? 0} responderam`);
    atualizarParcial(e);
  }
  const opcoes = p.respostas.map((r, i) => {
    const n = p.contagem?.[i] ?? 0;
    const certa = revelando && i === p.correta;
    return h(
      `div.qz-alt.is-${FORMAS[i].cor}${revelando ? (certa ? '.is-certa' : '.is-apagada') : ''}`,
      h('span.qz-forma', icon(FORMAS[i].icone, 34)),
      h('span.qz-alt-txt', r),
      revelando ? h('span.qz-alt-n', certa ? icon(Check, 30) : null, String(n)) : null,
      revelando ? h('span.qz-alt-barra', { style: `transform: scaleX(${total ? n / total : 0})` }) : null,
    );
  });
  return h(
    'section.qz-pergunta',
    h('div.qz-pergunta-topo', numero(e), revelando ? h('span.qz-responderam', `${total} ${total === 1 ? 'resposta' : 'respostas'}`) : resp),
    h('div.qz-pergunta-meio', h('h1.qz-pergunta-texto', p.texto), revelando ? null : relogio),
    revelando && p.explicacao ? h('p.qz-explicacao', p.explicacao) : null,
    h('div.qz-alts', ...opcoes),
  );
}

function telaoPlacar(e: EstadoTelao) {
  const top = (e.ranking ?? []).slice(0, 5);
  const max = Math.max(1, top[0]?.pontos ?? 1);
  return h(
    'section.qz-placar',
    h('p.hub-kicker', `Depois de ${(e.atual ?? 0) + 1} de ${e.total} perguntas`),
    h('h1.hub-h1', 'Placar'),
    h(
      'ol.qz-placar-lista',
      ...top.map((j) =>
        h(
          'li.qz-placar-item',
          { style: `--w: ${Math.max(0.12, j.pontos / max)}` },
          h('span.qz-placar-pos', String(j.posicao)),
          h('span.qz-placar-nome', j.nome),
          h('span.qz-placar-pts', pontos(j.pontos)),
        ),
      ),
    ),
    top.length ? null : h('p.hub-sub', 'Ninguém entrou na sala.'),
  );
}

function telaoPodio(e: EstadoTelao) {
  const r = e.ranking ?? [];
  const degrau = (j: Posicao | undefined, lugar: number) =>
    h(
      `div.qz-degrau.is-${lugar}`,
      h('span.qz-degrau-medalha', ['🥇', '🥈', '🥉'][lugar - 1]),
      h('span.qz-degrau-nome', j?.nome ?? '—'),
      h('span.qz-degrau-pts', j ? `${pontos(j.pontos)} pts  ·  ${certas(j.acertos)}` : ''),
      h('span.qz-degrau-bloco', String(lugar)),
    );
  return h(
    'section.qz-podio',
    h('p.hub-kicker', 'Resultado final'),
    h('h1.hub-h1', e.titulo ?? 'Quiz'),
    h('div.qz-degraus', degrau(r[1], 2), degrau(r[0], 1), degrau(r[2], 3)),
    r.length > 3
      ? h('ol.qz-resto', { start: 4 }, ...r.slice(3, 15).map((j) => h('li', h('span', j.nome), h('span', pontos(j.pontos)))))
      : null,
  );
}

/* ====================== Início ====================== */

if (telao) {
  if (!sessao.get()) semSessao();
  else {
    window.addEventListener('keydown', (ev) => {
      // Num botão em foco, Espaço já clica nele.
      if (ev.ctrlKey || ev.metaKey || ev.altKey || (ev.target as HTMLElement).closest('button, a, input, textarea')) return;
      const fase = estadoTelao?.fase;
      if ((ev.key === ' ' || ev.key === 'ArrowRight') && fase && !['fechado', 'fim'].includes(fase)) {
        ev.preventDefault();
        void comando('avancar');
      }
      if (ev.key === 'f' || ev.key === 'F') telaCheia();
    });
    void acompanhar();
  }
} else void jogar();
