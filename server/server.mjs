// API do mural da turma, do feedback das aulas e da área do professor. Node 22 puro, sem dependências.
// Tudo fica em DADOS (volume do Docker): envios.json, feedback.jsonl, config.json, sessoes.json e arquivos/<id>/.
import { createServer } from 'node:http';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync, appendFileSync, createReadStream } from 'node:fs';
import { join, extname } from 'node:path';

const PORTA = Number(process.env.PORT ?? 3000);
const DADOS = process.env.DADOS ?? '/dados';
/** Senha inicial do professor (.env). Depois de trocada pelo painel, vale a de config.json. */
const SENHA_ENV = (process.env.SENHA_PROFESSOR || process.env.CHAVE_PROFESSOR || '').trim();

const MAX_ARQUIVOS = 8;
const MAX_ARQUIVO = 20 * 1024 * 1024; // 20 MB cada
const MAX_CORPO = 70 * 1024 * 1024; // 70 MB por envio
const AULAS = ['1', '2', '3', '4'];
const RITMOS = ['devagar', 'na-medida', 'rapido'];
const STATUS = ['publicado', 'pendente', 'oculto'];
const SESSAO_DIAS = 30;

const ARQ_ENVIOS = join(DADOS, 'envios.json');
const ARQ_FEEDBACK = join(DADOS, 'feedback.jsonl');
const ARQ_CONFIG = join(DADOS, 'config.json');
const ARQ_SESSOES = join(DADOS, 'sessoes.json');
const DIR_ARQUIVOS = join(DADOS, 'arquivos');
/** Documentos .md só para o professor (pasta materiais-professor/ montada só-leitura). Nunca servidos sem login. */
const MATERIAIS = process.env.MATERIAIS ?? '/materiais';
mkdirSync(DIR_ARQUIVOS, { recursive: true });

/* ---------------- Armazenamento ---------------- */

const lerJson = (arq, padrao) => (existsSync(arq) ? JSON.parse(readFileSync(arq, 'utf8')) : padrao);
function gravarJson(arq, valor) {
  const tmp = `${arq}.tmp`;
  writeFileSync(tmp, JSON.stringify(valor, null, 1));
  renameSync(tmp, arq);
}

/** @type {Array<any>} */
let envios = lerJson(ARQ_ENVIOS, []).map((e) => ({ status: 'publicado', ...e }));
const salvarEnvios = () => gravarJson(ARQ_ENVIOS, envios);

/** Configuração editável pelo painel: o que está aberto e se há moderação prévia. */
const CONFIG_PADRAO = {
  moderacao: false,
  aulas: Object.fromEntries(AULAS.map((a) => [a, { envios: true, feedback: true }])),
  senha: null, // { sal, hash } depois de trocada pelo painel
};
let config = lerJson(ARQ_CONFIG, {});
config = { ...CONFIG_PADRAO, ...config, aulas: { ...CONFIG_PADRAO.aulas, ...(config.aulas ?? {}) } };
const salvarConfig = () => gravarJson(ARQ_CONFIG, config);
const configPublica = () => ({ moderacao: config.moderacao, aulas: config.aulas });

/** @type {Record<string, { criada: string, expira: number }>} */
let sessoes = lerJson(ARQ_SESSOES, {});
const salvarSessoes = () => gravarJson(ARQ_SESSOES, sessoes);

function lerFeedback() {
  if (!existsSync(ARQ_FEEDBACK)) return [];
  return readFileSync(ARQ_FEEDBACK, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

/* ---------------- Autenticação do professor ---------------- */

const iguais = (a, b) => a.length === b.length && timingSafeEqual(a, b);

function senhaConfere(senha) {
  if (config.senha) {
    const hash = scryptSync(senha, Buffer.from(config.senha.sal, 'hex'), 32);
    return iguais(hash, Buffer.from(config.senha.hash, 'hex'));
  }
  return Boolean(SENHA_ENV) && iguais(Buffer.from(senha), Buffer.from(SENHA_ENV));
}

function definirSenha(nova) {
  const sal = randomBytes(16);
  config.senha = { sal: sal.toString('hex'), hash: scryptSync(nova, sal, 32).toString('hex') };
  salvarConfig();
}

function sessaoValida(token) {
  const s = token && sessoes[token];
  if (!s) return false;
  if (s.expira < Date.now()) {
    delete sessoes[token];
    salvarSessoes();
    return false;
  }
  return true;
}

function ehProfessor(req, url) {
  const auth = String(req.headers.authorization ?? '');
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : (url?.searchParams.get('s') ?? '');
  return sessaoValida(token);
}

/** Limite simples de tentativas de login por IP: 8 por 10 minutos. */
const tentativas = new Map();
function podeTentar(ip) {
  const agora = Date.now();
  const lista = (tentativas.get(ip) ?? []).filter((t) => agora - t < 10 * 60 * 1000);
  tentativas.set(ip, lista);
  return lista.length < 8;
}
const ipDe = (req) => String(req.headers['cf-connecting-ip'] ?? req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? '').split(',')[0].trim();

/* ---------------- Utilidades ---------------- */

const novoId = () => Date.now().toString(36) + randomBytes(4).toString('hex');

function texto(v, max) {
  return typeof v === 'string' ? v.replace(/\r\n/g, '\n').trim().slice(0, max) : '';
}

function nomeSeguro(nome) {
  const base = String(nome || 'arquivo')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w.\- ]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/^\.+/, '')
    .slice(-80);
  return base || 'arquivo';
}

function json(res, status, corpo) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(corpo));
}

/** Lê o corpo inteiro com limite de tamanho. */
function lerCorpo(req, limite) {
  return new Promise((resolve, reject) => {
    const partes = [];
    let total = 0;
    req.on('data', (c) => {
      total += c.length;
      if (total > limite) {
        reject(Object.assign(new Error('Envio grande demais.'), { status: 413 }));
        req.destroy();
        return;
      }
      partes.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(partes)));
    req.on('error', reject);
  });
}

async function lerJsonCorpo(req) {
  const s = (await lerCorpo(req, 64 * 1024)).toString('utf8');
  try {
    return s ? JSON.parse(s) : {};
  } catch {
    throw Object.assign(new Error('Dados inválidos.'), { status: 400 });
  }
}

const publico = (e) => {
  const { token, ...resto } = e;
  return resto;
};

const IMAGENS = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif' };
const INLINE = { ...IMAGENS, '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.webm': 'video/webm', '.txt': 'text/plain; charset=utf-8' };

function apagarEnvio(id) {
  const i = envios.findIndex((e) => e.id === id);
  if (i < 0) return false;
  rmSync(join(DIR_ARQUIVOS, id), { recursive: true, force: true });
  envios.splice(i, 1);
  return true;
}

/* ---------------- Rotas públicas ---------------- */

async function criarEnvio(req, res) {
  const tamanho = Number(req.headers['content-length'] ?? 0);
  if (tamanho > MAX_CORPO) return json(res, 413, { erro: 'Envio grande demais (máximo de 70 MB no total).' });
  const corpo = await lerCorpo(req, MAX_CORPO);
  const form = await new Response(corpo, { headers: { 'content-type': req.headers['content-type'] ?? '' } }).formData();

  const nome = texto(form.get('nome'), 80);
  const curso = texto(form.get('curso'), 80);
  const aula = texto(form.get('aula'), 2);
  const titulo = texto(form.get('titulo'), 120);
  const descricao = texto(form.get('texto'), 5000);
  const arquivos = form.getAll('arquivos').filter((f) => typeof f === 'object' && f.size > 0);

  if (!nome || !curso) return json(res, 400, { erro: 'Informe seu nome e seu curso.' });
  if (!AULAS.includes(aula)) return json(res, 400, { erro: 'Escolha a aula.' });
  if (!config.aulas[aula].envios) return json(res, 403, { erro: `Os envios da Aula ${aula} estão fechados pelo professor.` });
  if (!titulo) return json(res, 400, { erro: 'Dê um título ao envio.' });
  if (!descricao && !arquivos.length) return json(res, 400, { erro: 'Escreva um texto ou anexe pelo menos um arquivo.' });
  if (arquivos.length > MAX_ARQUIVOS) return json(res, 400, { erro: `Máximo de ${MAX_ARQUIVOS} arquivos por envio.` });
  const grande = arquivos.find((f) => f.size > MAX_ARQUIVO);
  if (grande) return json(res, 400, { erro: `"${grande.name}" passa de 20 MB.` });

  const id = novoId();
  const dir = join(DIR_ARQUIVOS, id);
  mkdirSync(dir, { recursive: true });
  const usados = new Set();
  const lista = [];
  for (const f of arquivos) {
    let n = nomeSeguro(f.name);
    // Imagem sem extensão conhecida (ex.: print colado ou foto do celular): usa a do tipo do arquivo.
    const extTipo = Object.entries(IMAGENS).find(([, t]) => t === f.type)?.[0];
    if (extTipo && !(extname(n).toLowerCase() in IMAGENS)) n += extTipo;
    for (let i = 2; usados.has(n.toLowerCase()); i++) n = n.replace(/(\.[^.]*)?$/, (ext) => `-${i}${ext ?? ''}`);
    usados.add(n.toLowerCase());
    writeFileSync(join(dir, n), Buffer.from(await f.arrayBuffer()));
    lista.push({ nome: n, original: String(f.name).slice(0, 120), tamanho: f.size, imagem: extname(n).toLowerCase() in IMAGENS });
  }

  const envio = {
    id,
    token: randomBytes(16).toString('hex'),
    status: config.moderacao ? 'pendente' : 'publicado',
    criadoEm: new Date().toISOString(),
    nome,
    curso,
    aula,
    titulo,
    texto: descricao,
    arquivos: lista,
  };
  envios.unshift(envio);
  salvarEnvios();
  json(res, 201, { envio: publico(envio), token: envio.token });
}

/** Envios do próprio aluno (qualquer status), a partir dos tokens guardados no aparelho. */
async function meusEnvios(req, res) {
  const { tokens } = await lerJsonCorpo(req);
  const t = tokens && typeof tokens === 'object' ? tokens : {};
  json(res, 200, { envios: envios.filter((e) => t[e.id] === e.token).map(publico) });
}

function excluirProprio(req, res, id) {
  const e = envios.find((x) => x.id === id);
  if (!e) return json(res, 404, { erro: 'Envio não encontrado.' });
  if (String(req.headers['x-token'] ?? '') !== e.token && !ehProfessor(req)) return json(res, 403, { erro: 'Só quem enviou (ou o professor) pode excluir.' });
  apagarEnvio(id);
  salvarEnvios();
  json(res, 200, { ok: true });
}

function servirArquivo(req, res, url, id, nome) {
  if (!/^\w+$/.test(id) || nome.includes('/') || nome.startsWith('.')) return json(res, 400, { erro: 'Caminho inválido.' });
  const envio = envios.find((e) => e.id === id);
  if (!envio?.arquivos.some((a) => a.nome === nome)) return json(res, 404, { erro: 'Arquivo não encontrado.' });
  // Envio pendente ou oculto: só o autor (?t=token) ou o professor (?s=sessão) veem os arquivos.
  if (envio.status !== 'publicado' && url.searchParams.get('t') !== envio.token && !ehProfessor(req, url)) {
    return json(res, 404, { erro: 'Arquivo não encontrado.' });
  }
  const caminho = join(DIR_ARQUIVOS, id, nome);
  if (!existsSync(caminho)) return json(res, 404, { erro: 'Arquivo não encontrado.' });
  const ext = extname(nome).toLowerCase();
  const baixar = url.searchParams.has('baixar');
  const tipo = INLINE[ext] ?? 'application/octet-stream';
  res.writeHead(200, {
    'content-type': tipo,
    'content-length': statSync(caminho).size,
    'content-disposition': `${baixar || !(ext in INLINE) ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(nome)}`,
    // Anexos nunca rodam scripts no domínio do site.
    'content-security-policy': "sandbox; default-src 'none'; img-src 'self'; media-src 'self'; style-src 'unsafe-inline'",
    'x-content-type-options': 'nosniff',
    'cache-control': envio.status === 'publicado' ? 'public, max-age=86400' : 'private, no-store',
  });
  createReadStream(caminho).pipe(res);
}

async function criarFeedback(req, res) {
  const d = await lerJsonCorpo(req);
  const aula = String(d.aula ?? '');
  const nota = Number(d.nota);
  if (!AULAS.includes(aula)) return json(res, 400, { erro: 'Aula inválida.' });
  if (!config.aulas[aula].feedback) return json(res, 403, { erro: `O feedback da Aula ${aula} está fechado.` });
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) return json(res, 400, { erro: 'Escolha uma nota de 1 a 5.' });
  if (!RITMOS.includes(d.ritmo)) return json(res, 400, { erro: 'Escolha como foi o ritmo.' });
  const item = {
    id: novoId(),
    criadoEm: new Date().toISOString(),
    aula,
    nota,
    ritmo: d.ritmo,
    ajudou: texto(d.ajudou, 1000),
    melhorar: texto(d.melhorar, 1000),
    nome: texto(d.nome, 80),
    curso: texto(d.curso, 80),
  };
  appendFileSync(ARQ_FEEDBACK, JSON.stringify(item) + '\n');
  json(res, 201, { ok: true });
}

/* ---------------- Área do professor ---------------- */

function listarMateriais() {
  if (!existsSync(MATERIAIS)) return [];
  return readdirSync(MATERIAIS)
    .filter((f) => /^[\w.-]+\.md$/.test(f))
    .map((arquivo) => {
      const texto = readFileSync(join(MATERIAIS, arquivo), 'utf8');
      const titulo = /^#\s+(.+)$/m.exec(texto)?.[1].trim() ?? arquivo;
      return { arquivo, titulo, atualizadoEm: statSync(join(MATERIAIS, arquivo)).mtime.toISOString(), tamanho: texto.length };
    })
    .sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
}

async function login(req, res) {
  const ip = ipDe(req);
  if (!podeTentar(ip)) return json(res, 429, { erro: 'Muitas tentativas. Espere alguns minutos.' });
  const { senha } = await lerJsonCorpo(req);
  if (!SENHA_ENV && !config.senha) return json(res, 503, { erro: 'Senha do professor não configurada no servidor (SENHA_PROFESSOR no .env).' });
  if (typeof senha !== 'string' || !senhaConfere(senha)) {
    tentativas.get(ip)?.push(Date.now());
    return json(res, 401, { erro: 'Senha incorreta.' });
  }
  const token = randomBytes(24).toString('hex');
  sessoes[token] = { criada: new Date().toISOString(), expira: Date.now() + SESSAO_DIAS * 86400000 };
  salvarSessoes();
  json(res, 200, { sessao: token });
}

async function rotasProfessor(req, res, url, p, m) {
  if (m === 'POST' && p === '/sair') {
    const token = String(req.headers.authorization ?? '').slice(7);
    delete sessoes[token];
    salvarSessoes();
    return json(res, 200, { ok: true });
  }
  if (m === 'GET' && p === '/resumo') {
    const fb = lerFeedback();
    const cont = (s) => envios.filter((e) => e.status === s).length;
    return json(res, 200, {
      config: configPublica(),
      envios: { total: envios.length, publicado: cont('publicado'), pendente: cont('pendente'), oculto: cont('oculto') },
      feedback: { total: fb.length, porAula: Object.fromEntries(AULAS.map((a) => [a, fb.filter((r) => r.aula === a).length])) },
      enviosPorAula: Object.fromEntries(AULAS.map((a) => [a, envios.filter((e) => e.aula === a).length])),
    });
  }
  if (m === 'GET' && p === '/envios') return json(res, 200, { envios: envios.map(publico) });
  if (m === 'POST' && p === '/envios/lote') {
    const { ids, acao } = await lerJsonCorpo(req);
    if (!Array.isArray(ids) || !ids.length) return json(res, 400, { erro: 'Nenhum envio selecionado.' });
    if (acao !== 'excluir' && !STATUS.includes(acao)) return json(res, 400, { erro: 'Ação inválida.' });
    let n = 0;
    for (const id of ids) {
      if (acao === 'excluir') n += apagarEnvio(String(id)) ? 1 : 0;
      else {
        const e = envios.find((x) => x.id === id);
        if (e) {
          e.status = acao;
          n++;
        }
      }
    }
    salvarEnvios();
    return json(res, 200, { ok: true, alterados: n });
  }
  if (m === 'PUT' && p === '/config') {
    const d = await lerJsonCorpo(req);
    if (typeof d.moderacao === 'boolean') config.moderacao = d.moderacao;
    if (d.aulas && typeof d.aulas === 'object') {
      for (const a of AULAS) {
        const v = d.aulas[a];
        if (!v) continue;
        if (typeof v.envios === 'boolean') config.aulas[a].envios = v.envios;
        if (typeof v.feedback === 'boolean') config.aulas[a].feedback = v.feedback;
      }
    }
    salvarConfig();
    return json(res, 200, { config: configPublica() });
  }
  if (m === 'GET' && p === '/materiais') return json(res, 200, { materiais: listarMateriais() });
  const mat = /^\/materiais\/([\w.-]+\.md)$/.exec(p);
  if (m === 'GET' && mat) {
    const item = listarMateriais().find((x) => x.arquivo === mat[1]);
    if (!item) return json(res, 404, { erro: 'Material não encontrado.' });
    return json(res, 200, { ...item, conteudo: readFileSync(join(MATERIAIS, item.arquivo), 'utf8') });
  }
  if (m === 'GET' && p === '/feedback') return json(res, 200, { respostas: lerFeedback() });
  if (m === 'DELETE' && p === '/feedback') {
    const { ids } = await lerJsonCorpo(req);
    const fora = new Set(Array.isArray(ids) ? ids : []);
    const resto = lerFeedback().filter((r) => !fora.has(r.id));
    writeFileSync(ARQ_FEEDBACK, resto.map((r) => JSON.stringify(r) + '\n').join(''));
    return json(res, 200, { ok: true });
  }
  if (m === 'POST' && p === '/senha') {
    const { atual, nova, sairDosOutros } = await lerJsonCorpo(req);
    if (typeof atual !== 'string' || !senhaConfere(atual)) return json(res, 400, { erro: 'A senha atual está incorreta.' });
    if (typeof nova !== 'string' || nova.length < 8) return json(res, 400, { erro: 'A nova senha precisa ter pelo menos 8 caracteres.' });
    definirSenha(nova);
    if (sairDosOutros) {
      const atualToken = String(req.headers.authorization ?? '').slice(7);
      sessoes = { [atualToken]: sessoes[atualToken] };
      salvarSessoes();
    }
    return json(res, 200, { ok: true });
  }
  json(res, 404, { erro: 'Rota não encontrada.' });
}

/* ---------------- Quiz ao vivo ---------------- */
// Um jogo por vez, no estilo Kahoot: o telão (professor) avança as fases e os celulares acompanham por long polling.
// As perguntas ficam em materiais-professor/quiz-*.json (fora do git): o gabarito nunca vai para o navegador antes da hora.
// Fases: lobby → pergunta → revelacao → placar → pergunta... → fim. O estado vai para dados/quiz.json a cada mudança.

const ARQ_QUIZ = join(DADOS, 'quiz.json');
const ARQ_QUIZ_RESULTADOS = join(DADOS, 'quiz-resultados.jsonl');
const MAX_JOGADORES = 200;
const ESPERA_MS = 25000;

function listarQuizzes() {
  if (!existsSync(MATERIAIS)) return [];
  return readdirSync(MATERIAIS)
    .filter((f) => /^quiz-[\w.-]+\.json$/.test(f))
    .map((arquivo) => {
      try {
        const q = JSON.parse(readFileSync(join(MATERIAIS, arquivo), 'utf8'));
        const perguntas = (q.perguntas ?? []).filter(
          (p) => typeof p.texto === 'string' && Array.isArray(p.respostas) && p.respostas.length >= 2 && Number.isInteger(p.correta) && p.respostas[p.correta] != null,
        );
        return { arquivo, titulo: String(q.titulo ?? arquivo), perguntas };
      } catch {
        return null;
      }
    })
    .filter((q) => q?.perguntas.length)
    .sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
}

/** @type {any} */
let quiz = lerJson(ARQ_QUIZ, null);
/** Versões: os celulares só acordam em troca de fase; o telão acorda também a cada entrada e resposta. */
let versao = 1;
let versaoTelao = 1;
const esperando = new Set();
let timerQuiz = null;

function mudouQuiz(fase) {
  versaoTelao++;
  if (fase) versao++;
  if (quiz) gravarJson(ARQ_QUIZ, quiz);
  else rmSync(ARQ_QUIZ, { force: true });
  for (const w of [...esperando]) if (w.versaoAtual() !== w.v) w.enviar();
}

/** Responde na hora se a versão mudou; senão segura a requisição até mudar (ou 25 s). */
function aguardar(res, v, versaoAtual, montar) {
  if (v !== versaoAtual()) return json(res, 200, montar());
  const w = {
    v,
    versaoAtual,
    enviar() {
      clearTimeout(w.t);
      esperando.delete(w);
      if (!res.writableEnded) json(res, 200, montar());
    },
  };
  w.t = setTimeout(w.enviar, ESPERA_MS);
  esperando.add(w);
  res.on('close', () => {
    clearTimeout(w.t);
    esperando.delete(w);
  });
}

const perguntaAtual = () => quiz?.perguntas[quiz.atual];
const jogadores = () => Object.values(quiz?.jogadores ?? {});
const restaMs = () => Math.max(0, (quiz?.prazo ?? 0) - Date.now());

function ranking() {
  return jogadores()
    .sort((a, b) => b.pontos - a.pontos || b.acertos - a.acertos || a.entrouEm - b.entrouEm)
    .map((j, i) => ({ id: j.id, nome: j.nome, pontos: j.pontos, acertos: j.acertos, posicao: i + 1 }));
}

function contagem() {
  const p = perguntaAtual();
  const c = p.respostas.map(() => 0);
  for (const j of jogadores()) {
    const r = j.respostas[quiz.atual];
    if (r && r.escolha >= 0) c[r.escolha]++;
  }
  return c;
}

/** Tempo esgotado ou todos responderam: revela. */
function fecharPergunta() {
  clearTimeout(timerQuiz);
  if (quiz?.fase !== 'pergunta') return;
  quiz.fase = 'revelacao';
  // Quem não respondeu perde a sequência de acertos.
  for (const j of jogadores()) if (!j.respostas[quiz.atual]) j.sequencia = 0;
  mudouQuiz(true);
}

function armarTimer() {
  clearTimeout(timerQuiz);
  if (quiz?.fase === 'pergunta') timerQuiz = setTimeout(fecharPergunta, restaMs() + 300);
}
armarTimer(); // servidor reiniciado no meio de uma pergunta

function abrirQuiz(arquivo) {
  const q = listarQuizzes().find((x) => x.arquivo === arquivo);
  if (!q) return false;
  clearTimeout(timerQuiz);
  quiz = { id: novoId(), arquivo, titulo: q.titulo, perguntas: q.perguntas, fase: 'lobby', atual: -1, prazo: 0, abertoEm: new Date().toISOString(), jogadores: {} };
  mudouQuiz(true);
  return true;
}

function avancarQuiz() {
  const f = quiz.fase;
  if (f === 'pergunta') return fecharPergunta();
  if (f === 'revelacao') quiz.fase = 'placar';
  else if (f === 'lobby' || f === 'placar') {
    if (quiz.atual + 1 >= quiz.perguntas.length) return encerrarJogo();
    quiz.atual++;
    quiz.fase = 'pergunta';
    quiz.inicio = Date.now();
    quiz.prazo = quiz.inicio + (perguntaAtual().tempo ?? 20) * 1000;
    armarTimer();
  } else return;
  mudouQuiz(true);
}

function encerrarJogo() {
  quiz.fase = 'fim';
  appendFileSync(
    ARQ_QUIZ_RESULTADOS,
    JSON.stringify({ id: quiz.id, titulo: quiz.titulo, abertoEm: quiz.abertoEm, encerradoEm: new Date().toISOString(), perguntas: quiz.perguntas.length, ranking: ranking() }) + '\n',
  );
  mudouQuiz(true);
}

/** Pontos no estilo Kahoot: 500 a 1000 por acerto, conforme a rapidez, mais 100 por acerto seguido (até 500). */
function pontuar(j, escolha) {
  const p = perguntaAtual();
  const ms = Date.now() - quiz.inicio;
  const certa = escolha === p.correta;
  j.sequencia = certa ? (j.sequencia ?? 0) + 1 : 0;
  const pontos = certa ? Math.round(1000 * (1 - Math.min(1, ms / ((p.tempo ?? 20) * 1000)) / 2)) + Math.min(500, (j.sequencia - 1) * 100) : 0;
  j.respostas[quiz.atual] = { escolha, ms, pontos, certa };
  j.pontos += pontos;
  if (certa) j.acertos++;
}

/** O que o celular vê. Pergunta aberta: sem a resposta certa. */
function visaoJogador(j) {
  if (!quiz) return { fase: 'fechado', versao };
  const p = perguntaAtual();
  const base = { fase: quiz.fase, versao, quizId: quiz.id, titulo: quiz.titulo, total: quiz.perguntas.length, atual: quiz.atual, jogadores: jogadores().length };
  if (p && quiz.fase === 'pergunta') Object.assign(base, { pergunta: { texto: p.texto, respostas: p.respostas, tempo: p.tempo ?? 20 }, restaMs: restaMs() });
  if (p && quiz.fase === 'revelacao') Object.assign(base, { pergunta: { texto: p.texto, respostas: p.respostas, correta: p.correta, explicacao: p.explicacao ?? '' } });
  if (quiz.fase === 'fim') base.podio = ranking().slice(0, 3);
  if (j) {
    const r = ranking().find((x) => x.id === j.id);
    base.eu = { id: j.id, nome: j.nome, pontos: j.pontos, acertos: j.acertos, sequencia: j.sequencia ?? 0, posicao: r?.posicao ?? 0, resposta: j.respostas[quiz.atual] ?? null };
    // A resposta da pergunta aberta volta sem dizer se acertou.
    if (quiz.fase === 'pergunta' && base.eu.resposta) base.eu.resposta = { escolha: base.eu.resposta.escolha };
  }
  return base;
}

/** O que o telão vê: tudo, inclusive quem entrou e quantos já responderam. */
function visaoTelao() {
  if (!quiz) return { fase: 'fechado', versao: versaoTelao, quizzes: listarQuizzes().map(({ arquivo, titulo, perguntas }) => ({ arquivo, titulo, perguntas: perguntas.length })) };
  const p = perguntaAtual();
  const v = { fase: quiz.fase, versao: versaoTelao, titulo: quiz.titulo, total: quiz.perguntas.length, atual: quiz.atual, jogadores: jogadores().map((j) => ({ id: j.id, nome: j.nome })) };
  if (p) v.pergunta = { texto: p.texto, respostas: p.respostas, tempo: p.tempo ?? 20 };
  if (quiz.fase === 'pergunta') Object.assign(v, { restaMs: restaMs(), responderam: jogadores().filter((j) => j.respostas[quiz.atual]).length });
  if (quiz.fase === 'revelacao') Object.assign(v.pergunta, { correta: p.correta, explicacao: p.explicacao ?? '', contagem: contagem() });
  if (quiz.fase === 'placar' || quiz.fase === 'fim') v.ranking = ranking();
  return v;
}

function jogadorDe(req) {
  const j = quiz?.jogadores[String(req.headers['x-jogador'] ?? '')];
  return j && j.token === String(req.headers['x-token'] ?? '') ? j : null;
}

async function entrarNoQuiz(req, res) {
  if (!quiz || quiz.fase === 'fim') return json(res, 409, { erro: 'Não há quiz aberto agora.' });
  if (jogadores().length >= MAX_JOGADORES) return json(res, 409, { erro: 'A sala está cheia.' });
  let nome = texto((await lerJsonCorpo(req)).nome, 24).replace(/\s+/g, ' ');
  if (!nome) return json(res, 400, { erro: 'Escreva seu nome ou apelido.' });
  const usados = new Set(jogadores().map((j) => j.nome.toLowerCase()));
  for (let i = 2, base = nome; usados.has(nome.toLowerCase()); i++) nome = `${base} ${i}`;
  const j = { id: randomBytes(6).toString('hex'), token: randomBytes(16).toString('hex'), nome, pontos: 0, acertos: 0, sequencia: 0, entrouEm: Date.now(), respostas: {} };
  quiz.jogadores[j.id] = j;
  mudouQuiz(false);
  json(res, 201, { jogador: { id: j.id, token: j.token }, estado: visaoJogador(j) });
}

async function responderQuiz(req, res) {
  const j = jogadorDe(req);
  if (!j) return json(res, 403, { erro: 'Entre no quiz de novo.' });
  const { pergunta, escolha } = await lerJsonCorpo(req);
  const p = perguntaAtual();
  // Meio segundo de tolerância para a rede.
  if (quiz.fase !== 'pergunta' || pergunta !== quiz.atual || Date.now() > quiz.prazo + 500) return json(res, 409, { erro: 'O tempo acabou.', estado: visaoJogador(j) });
  if (j.respostas[quiz.atual]) return json(res, 200, { estado: visaoJogador(j) });
  if (!Number.isInteger(escolha) || escolha < 0 || escolha >= p.respostas.length) return json(res, 400, { erro: 'Resposta inválida.' });
  pontuar(j, escolha);
  if (jogadores().every((x) => x.respostas[quiz.atual])) fecharPergunta();
  else mudouQuiz(false);
  json(res, 200, { estado: visaoJogador(j) });
}

async function rotasQuizProfessor(req, res, url, p, m) {
  if (m === 'GET' && p === '/estado') return aguardar(res, Number(url.searchParams.get('v') ?? 0), () => versaoTelao, visaoTelao);
  if (m === 'GET' && p === '/resultados') {
    const linhas = existsSync(ARQ_QUIZ_RESULTADOS) ? readFileSync(ARQ_QUIZ_RESULTADOS, 'utf8').split('\n').filter(Boolean) : [];
    return json(res, 200, { quizzes: listarQuizzes().map(({ arquivo, titulo, perguntas }) => ({ arquivo, titulo, perguntas: perguntas.length })), resultados: linhas.flatMap((l) => { try { return [JSON.parse(l)]; } catch { return []; } }).reverse() });
  }
  if (m === 'POST' && p === '/abrir') {
    const { arquivo } = await lerJsonCorpo(req);
    if (!abrirQuiz(String(arquivo ?? ''))) return json(res, 404, { erro: 'Quiz não encontrado.' });
    return json(res, 200, visaoTelao());
  }
  if (!quiz) return json(res, 409, { erro: 'Nenhum quiz aberto.' });
  if (m === 'POST' && p === '/avancar') {
    avancarQuiz();
    return json(res, 200, visaoTelao());
  }
  if (m === 'POST' && p === '/encerrar') {
    clearTimeout(timerQuiz);
    quiz = null;
    mudouQuiz(true);
    return json(res, 200, visaoTelao());
  }
  if (m === 'POST' && p === '/remover') {
    const { id } = await lerJsonCorpo(req);
    delete quiz.jogadores[String(id)];
    mudouQuiz(true); // acorda o celular de quem saiu, que volta para a tela de entrada
    if (quiz.fase === 'pergunta' && jogadores().length && jogadores().every((x) => x.respostas[quiz.atual])) fecharPergunta();
    return json(res, 200, visaoTelao());
  }
  json(res, 404, { erro: 'Rota não encontrada.' });
}

/* ---------------- Roteamento ---------------- */

async function rotear(req, res) {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname.replace(/^\/api/, '');
  const m = req.method;

  if (m === 'GET' && p === '/saude') return json(res, 200, { ok: true });
  if (m === 'GET' && p === '/config') return json(res, 200, configPublica());
  if (m === 'GET' && p === '/envios') {
    const aula = url.searchParams.get('aula');
    return json(res, 200, { envios: envios.filter((e) => e.status === 'publicado' && (!aula || e.aula === aula)).map(publico) });
  }
  if (m === 'POST' && p === '/envios') return criarEnvio(req, res);
  if (m === 'POST' && p === '/envios/meus') return meusEnvios(req, res);
  let r = /^\/envios\/(\w+)$/.exec(p);
  if (m === 'DELETE' && r) return excluirProprio(req, res, r[1]);
  r = /^\/arquivos\/(\w+)\/([^/]+)$/.exec(p);
  if (m === 'GET' && r) return servirArquivo(req, res, url, r[1], decodeURIComponent(r[2]));
  if (m === 'POST' && p === '/feedback') return criarFeedback(req, res);
  if (m === 'GET' && p === '/quiz/estado') {
    return aguardar(res, Number(url.searchParams.get('v') ?? 0), () => versao, () => visaoJogador(jogadorDe(req)));
  }
  if (m === 'POST' && p === '/quiz/entrar') return entrarNoQuiz(req, res);
  if (m === 'POST' && p === '/quiz/responder') return responderQuiz(req, res);

  if (m === 'POST' && p === '/professor/entrar') return login(req, res);
  if (p.startsWith('/professor/')) {
    if (!ehProfessor(req)) return json(res, 401, { erro: 'Sessão expirada. Entre de novo.' });
    if (p.startsWith('/professor/quiz/')) return rotasQuizProfessor(req, res, url, p.slice('/professor/quiz'.length), m);
    return rotasProfessor(req, res, url, p.slice('/professor'.length), m);
  }

  json(res, 404, { erro: 'Rota não encontrada.' });
}

createServer((req, res) => {
  rotear(req, res).catch((err) => {
    console.error(err);
    if (!res.headersSent) json(res, err.status ?? 500, { erro: err.status ? err.message : 'Erro no servidor. Tente de novo.' });
    else res.end();
  });
}).listen(PORTA, () => {
  const origem = config.senha ? 'definida pelo painel' : SENHA_ENV ? 'do .env' : 'NÃO CONFIGURADA';
  console.log(`API na porta ${PORTA}. Dados em ${DADOS}. Senha do professor: ${origem}.`);
});
