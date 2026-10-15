import { ArrowLeft, ArrowRight, Check, Clock, Download, EyeOff, FileText, ImagePlus, Lock, Paperclip, Plus, Search, Trash2, X } from 'lucide';
import {
  AULAS,
  api,
  aulaAtual,
  aulaInfo,
  aviso,
  cabecalho,
  campo,
  carregarConfig,
  type ConfigPublica,
  ErroApi,
  identidade,
  iniciais,
  iniciarPagina,
  meusEnvios,
  quando,
  sessao,
  tamanho,
} from './aluno/comum';
import { h } from './engine/dom';
import { icon } from './engine/icons';

/**
 * Mural da turma (mural.html): os alunos publicam prints, anexos e um texto sobre o que fizeram em cada aula.
 * Fluxo de envio em 3 passos (Você → Trabalho → Anexos). O nome e o curso ficam salvos no aparelho.
 * Quem enviou pode excluir o próprio envio (token guardado no aparelho); o professor modera tudo em professor.html.
 * Com moderação ligada, o envio fica "pendente" até o professor publicar; o autor vê os próprios pendentes e ocultos.
 */

interface Arquivo {
  nome: string;
  original: string;
  tamanho: number;
  imagem: boolean;
}
interface Envio {
  id: string;
  status?: 'publicado' | 'pendente' | 'oculto';
  criadoEm: string;
  nome: string;
  curso: string;
  aula: string;
  titulo: string;
  texto: string;
  arquivos: Arquivo[];
}

const MAX_ARQUIVOS = 8;
const MAX_ARQUIVO = 20 * 1024 * 1024;
const MAX_TOTAL = 70 * 1024 * 1024;

const params = new URLSearchParams(location.search);
let envios: Envio[] = [];
/** Envios deste aparelho que ainda não aparecem para a turma (pendentes ou ocultos). */
let meusOcultos: Envio[] = [];
let config: ConfigPublica | null = null;
const aulaAberta = (n: string | number) => !config || config.aulas[String(n)]?.envios !== false;
let filtro = params.get('aula') ?? '';
let busca = '';

/** Arquivos de envios não publicados só abrem com o token do autor (?t=) ou a sessão do professor (?s=). */
function arquivoUrl(e: Envio, a: Arquivo, baixar = false) {
  const q = new URLSearchParams();
  if (baixar) q.set('baixar', '');
  if (e.status && e.status !== 'publicado') {
    const t = meusEnvios.all()[e.id];
    if (t) q.set('t', t);
    else if (sessao.get()) q.set('s', sessao.get());
  }
  const qs = q.toString().replace('baixar=', 'baixar');
  return `api/arquivos/${e.id}/${encodeURIComponent(a.nome)}${qs ? '?' + qs : ''}`;
}

const podeExcluir = (e: Envio) => Boolean(meusEnvios.all()[e.id] || sessao.get());

/* ====================== Página ====================== */

iniciarPagina('Mural da turma: No-Code Development Platforms', 'mural');

const contagem = h('p.al-stats');
const grade = h('section.al-wall', { 'aria-live': 'polite' });
const filtros = h('div.al-chips', { role: 'tablist', 'aria-label': 'Filtrar por aula' });
const buscaInput = h('input.al-input.al-search-input', {
  type: 'search',
  placeholder: 'Buscar por nome, curso ou título',
  'aria-label': 'Buscar no mural',
}) as HTMLInputElement;
buscaInput.addEventListener('input', () => {
  busca = buscaInput.value.trim().toLowerCase();
  desenharGrade();
});

const btnEnviar = h('button.al-cta', { type: 'button' }, icon(Plus, 22), 'Enviar meu trabalho');
const avisoFechado = h('p.al-closed', { hidden: true }, icon(Lock, 16), 'Os envios estão fechados no momento. O professor abre de novo na próxima atividade.');
btnEnviar.addEventListener('click', () => abrirEnvio());

document.getElementById('app')!.replaceChildren(
  h(
    'main.hub.al-page',
    cabecalho(
      'Hackathon No-Code 2026  ·  Mural da turma',
      'O que a turma está construindo',
      'Mostre o que você fez na aula: prints da tela, arquivos e um texto curto. Todo mundo vê, e você pode excluir o seu envio quando quiser.',
      h('div.al-header-row', btnEnviar, contagem),
      avisoFechado,
    ),
    h('div.al-toolbar', filtros, h('label.al-search', icon(Search, 18), buscaInput)),
    grade,
  ),
);

function desenharFiltros() {
  const opcoes = [{ v: '', rotulo: 'Todas', accent: '' }, ...AULAS.map((a) => ({ v: String(a.numero), rotulo: `Aula ${a.numero}`, accent: a.accent }))];
  filtros.replaceChildren(
    ...opcoes.map((o) => {
      const n = o.v ? envios.filter((e) => e.aula === o.v).length : envios.length;
      const fechada = o.v && !aulaAberta(o.v);
      const b = h(
        'button.al-chip',
        { type: 'button', role: 'tab', 'aria-selected': String(filtro === o.v), 'data-accent': o.accent || undefined },
        fechada ? icon(Lock, 14) : null,
        o.rotulo,
        h('span.al-chip-n', String(n)),
      );
      if (fechada) b.title = 'Envios fechados para esta aula';
      b.addEventListener('click', () => {
        filtro = o.v;
        const u = new URL(location.href);
        if (filtro) u.searchParams.set('aula', filtro);
        else u.searchParams.delete('aula');
        history.replaceState(null, '', u);
        desenharFiltros();
        desenharGrade();
      });
      return b;
    }),
  );
}

function desenharGrade(destaque?: string) {
  const pessoas = new Set(envios.map((e) => `${e.nome.toLowerCase()}|${e.curso.toLowerCase()}`)).size;
  contagem.textContent = envios.length
    ? `${envios.length} ${envios.length === 1 ? 'envio' : 'envios'} de ${pessoas} ${pessoas === 1 ? 'pessoa' : 'pessoas'}`
    : '';
  const lista = [...meusOcultos, ...envios].filter(
    (e) => (!filtro || e.aula === filtro) && (!busca || `${e.nome} ${e.curso} ${e.titulo}`.toLowerCase().includes(busca)),
  );
  if (!lista.length) {
    const vazio = h(
      'div.al-empty',
      icon(ImagePlus, 40),
      h('p.al-empty-title', busca ? 'Nada encontrado.' : 'Ainda não há envios aqui.'),
      h('p', busca ? 'Tente outro nome ou limpe a busca.' : 'Seja a primeira pessoa a mostrar o que fez.'),
    );
    if (!busca) {
      const b = h('button.hub-btn.is-primary', { type: 'button' }, 'Enviar meu trabalho');
      b.addEventListener('click', () => abrirEnvio());
      vazio.append(b);
    }
    grade.replaceChildren(vazio);
    return;
  }
  grade.replaceChildren(...lista.map((e) => cartao(e, e.id === destaque)));
}

function cartao(e: Envio, destaque: boolean) {
  const aula = aulaInfo(e.aula);
  const capa = e.arquivos.find((a) => a.imagem);
  const outros = e.arquivos.length - (capa ? 1 : 0);
  const status =
    e.status === 'pendente'
      ? h('span.al-status.is-pendente', icon(Clock, 14), 'Aguardando aprovação do professor')
      : e.status === 'oculto'
        ? h('span.al-status.is-oculto', icon(EyeOff, 14), 'Oculto pelo professor')
        : null;
  const el = h(
    `button.al-card${destaque ? '.is-new' : ''}${status ? '.is-mine-hidden' : ''}`,
    { type: 'button', 'data-accent': aula?.accent, 'aria-label': `Abrir "${e.titulo}", de ${e.nome}` },
    capa ? h('span.al-card-img', h('img', { src: arquivoUrl(e, capa), alt: '', loading: 'lazy' })) : null,
    h(
      'span.al-card-body',
      status,
      h('span.al-tag', `Aula ${e.aula}`),
      h('span.al-card-title', e.titulo),
      e.texto ? h('span.al-card-text', e.texto) : null,
      outros > 0 ? h('span.al-card-files', icon(Paperclip, 16), `${outros} ${outros === 1 ? 'anexo' : 'anexos'}`) : null,
      h(
        'span.al-author',
        h('span.al-avatar', iniciais(e.nome)),
        h('span.al-author-txt', h('span.al-author-name', e.nome), h('span.al-author-sub', `${e.curso}  ·  ${quando(e.criadoEm)}`)),
      ),
    ),
  );
  el.addEventListener('click', () => abrirDetalhe(e));
  return el;
}

async function carregar(destaque?: string) {
  try {
    const tokens = meusEnvios.all();
    const [pub, meus, cfg] = await Promise.all([
      api<{ envios: Envio[] }>('/envios'),
      Object.keys(tokens).length ? api<{ envios: Envio[] }>('/envios/meus', { method: 'POST', body: JSON.stringify({ tokens }) }).catch(() => ({ envios: [] })) : { envios: [] },
      carregarConfig(),
    ]);
    envios = pub.envios;
    meusOcultos = meus.envios.filter((e) => e.status !== 'publicado');
    config = cfg;
    const todasFechadas = AULAS.every((a) => !aulaAberta(a.numero));
    btnEnviar.toggleAttribute('disabled', todasFechadas);
    avisoFechado.hidden = !todasFechadas;
    desenharFiltros();
    desenharGrade(destaque);
  } catch (err) {
    if (!envios.length) grade.replaceChildren(h('div.al-empty', h('p.al-empty-title', 'Não deu para carregar o mural.'), h('p', (err as Error).message)));
  }
}

grade.replaceChildren(...Array.from({ length: 6 }, () => h('div.al-card.is-skeleton')));
void carregar();
// Durante a aula, novos envios aparecem sozinhos.
setInterval(() => {
  if (document.visibilityState === 'visible' && !document.querySelector('dialog[open]')) void carregar();
}, 20000);

/* ====================== Detalhe ====================== */

function dialogo(cls: string) {
  const d = h(`dialog.al-dialog.${cls}`) as HTMLDialogElement;
  d.addEventListener('click', (ev) => {
    if (ev.target === d) d.close();
  });
  d.addEventListener('close', () => setTimeout(() => d.remove(), 200));
  document.body.append(d);
  return d;
}

function botaoFechar(d: HTMLDialogElement) {
  const b = h('button.al-icon-btn', { type: 'button', 'aria-label': 'Fechar' }, icon(X, 22));
  b.addEventListener('click', () => d.close());
  return b;
}

function abrirDetalhe(e: Envio) {
  const aula = aulaInfo(e.aula);
  const d = dialogo('al-viewer');
  d.dataset.accent = aula?.accent;
  const imagens = e.arquivos.filter((a) => a.imagem);
  const outros = e.arquivos.filter((a) => !a.imagem);

  const principal = imagens.length ? (h('img.al-viewer-main', { src: arquivoUrl(e, imagens[0]), alt: imagens[0].original }) as HTMLImageElement) : null;
  const link = principal ? h('a.al-viewer-stage', { href: arquivoUrl(e, imagens[0]), target: '_blank', rel: 'noopener', title: 'Abrir em tamanho original' }, principal) : null;
  const thumbs =
    imagens.length > 1
      ? h(
          'div.al-thumbs',
          ...imagens.map((a, i) => {
            const t = h(`button.al-thumb${i === 0 ? '.is-on' : ''}`, { type: 'button', 'aria-label': `Ver ${a.original}` }, h('img', { src: arquivoUrl(e, a), alt: '', loading: 'lazy' }));
            t.addEventListener('click', () => {
              principal!.src = arquivoUrl(e, a);
              principal!.alt = a.original;
              link!.setAttribute('href', arquivoUrl(e, a));
              thumbs!.querySelectorAll('.al-thumb').forEach((x) => x.classList.toggle('is-on', x === t));
            });
            return t;
          }),
        )
      : null;

  const acoes = h('div.al-viewer-actions');
  if (podeExcluir(e)) {
    const del = h('button.hub-btn.al-danger', { type: 'button' }, icon(Trash2, 18), 'Excluir envio');
    del.addEventListener('click', async () => {
      if (!confirm('Excluir este envio do mural? Não dá para desfazer.')) return;
      try {
        await api(`/envios/${e.id}`, { method: 'DELETE', headers: { 'x-token': meusEnvios.all()[e.id] ?? '', ...(sessao.get() ? { authorization: `Bearer ${sessao.get()}` } : {}) } });
        meusEnvios.remove(e.id);
        d.close();
        aviso('Envio excluído.');
        void carregar();
      } catch (err) {
        aviso((err as Error).message, 'erro');
      }
    });
    acoes.append(del);
  }

  d.append(
    ...[
    h(
      'div.al-viewer-head',
      h('div', h('span.al-tag', `Aula ${e.aula}  ·  ${aula?.titulo ?? ''}`), h('h2.al-viewer-title', e.titulo)),
      botaoFechar(d),
    ),
    link,
    thumbs,
    h(
      'div.al-viewer-body',
      h('div.al-author', h('span.al-avatar', iniciais(e.nome)), h('span.al-author-txt', h('span.al-author-name', e.nome), h('span.al-author-sub', `${e.curso}  ·  ${quando(e.criadoEm)}`))),
      e.texto ? h('p.al-viewer-text', e.texto) : null,
      outros.length
        ? h(
            'ul.al-files',
            ...outros.map((a) =>
              h(
                'li',
                h('a.al-file', { href: arquivoUrl(e, a, true), download: a.original }, icon(FileText, 20), h('span.al-file-name', a.original), h('span.al-file-size', tamanho(a.tamanho)), icon(Download, 18)),
              ),
            ),
          )
        : null,
      acoes,
    ),
    ].filter((x): x is HTMLElement => Boolean(x)),
  );
  d.showModal();
}

/* ====================== Envio em 3 passos ====================== */

function abrirEnvio() {
  const quem = identidade.get();
  const d = dialogo('al-sheet');
  const PASSOS = ['Você', 'Trabalho', 'Anexos'];
  let passo = quem.nome && quem.curso ? 1 : 0;
  let arquivos: File[] = [];
  // Padrão: a aula do filtro ou a de hoje; se estiver fechada, a primeira aberta.
  let aula = String(filtro || aulaAtual().numero);
  if (!aulaAberta(aula)) aula = String(AULAS.find((a) => aulaAberta(a.numero))?.numero ?? aula);
  let enviando = false;

  /* --- Passo 1: identificação --- */
  const nome = h('input.al-input', { type: 'text', maxlength: 80, autocomplete: 'name', placeholder: 'Ex.: Ana Souza', value: quem.nome }) as HTMLInputElement;
  const curso = h('input.al-input', { type: 'text', maxlength: 80, list: 'al-cursos', placeholder: 'Ex.: Engenharia de Software', value: quem.curso }) as HTMLInputElement;
  const cursos = h('datalist', { id: 'al-cursos' }, ...[...new Set(envios.map((e) => e.curso))].map((c) => h('option', { value: c })));
  const p1 = h(
    'div.al-step-pane',
    h('h3.al-step-title', 'Quem está enviando?'),
    h('p.al-step-sub', 'Seu nome e curso aparecem no mural. Ficam salvos neste aparelho para os próximos envios.'),
    campo('Nome', nome),
    campo('Curso', curso),
    cursos,
  );

  /* --- Passo 2: o trabalho --- */
  const escolhaAula = h(
    'div.al-aulas',
    { role: 'radiogroup', 'aria-label': 'Aula' },
    ...AULAS.map((a) => {
      const b = h(
        'button.al-aula',
        { type: 'button', role: 'radio', 'data-accent': a.accent, 'aria-checked': String(aula === String(a.numero)), disabled: !aulaAberta(a.numero) },
        h('span.al-aula-n', String(a.numero).padStart(2, '0')),
        h('span.al-aula-t', a.titulo, aulaAberta(a.numero) ? null : h('span.al-aula-lock', icon(Lock, 12), 'envios fechados')),
      );
      b.addEventListener('click', () => {
        aula = String(a.numero);
        escolhaAula.querySelectorAll('.al-aula').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
      });
      return b;
    }),
  );
  const titulo = h('input.al-input', { type: 'text', maxlength: 120, placeholder: 'Ex.: Página de inscrição do hackathon' }) as HTMLInputElement;
  const texto = h('textarea.al-input.al-textarea', { maxlength: 5000, rows: 6, placeholder: 'O que você fez, o que funcionou e onde travou.' }) as HTMLTextAreaElement;
  const quemSou = h('p.al-whoami');
  const p2 = h(
    'div.al-step-pane',
    h('h3.al-step-title', 'O que você fez?'),
    quemSou,
    campo('De qual aula é?', escolhaAula),
    campo('Título', titulo, { contador: 120 }),
    campo('Texto', texto, { opcional: true, contador: 5000, dica: 'Se não escrever nada, anexe pelo menos um print no próximo passo.' }),
  );

  /* --- Passo 3: anexos --- */
  const seletor = h('input', { type: 'file', multiple: true, hidden: true }) as HTMLInputElement;
  const listaArq = h('div.al-previews');
  const resumo = h('p.al-hint');
  const zona = h(
    'button.al-drop',
    { type: 'button' },
    icon(ImagePlus, 36),
    h('span.al-drop-title', 'Arraste prints e arquivos para cá'),
    h('span.al-drop-sub', 'ou clique para escolher.  Também dá para colar um print com Ctrl+V.'),
  );
  zona.addEventListener('click', () => seletor.click());
  seletor.addEventListener('change', () => {
    adicionar([...(seletor.files ?? [])]);
    seletor.value = '';
  });
  zona.addEventListener('dragover', (ev) => {
    ev.preventDefault();
    zona.classList.add('is-over');
  });
  zona.addEventListener('dragleave', () => zona.classList.remove('is-over'));
  zona.addEventListener('drop', (ev) => {
    ev.preventDefault();
    zona.classList.remove('is-over');
    adicionar([...(ev.dataTransfer?.files ?? [])]);
  });
  const p3 = h(
    'div.al-step-pane',
    h('h3.al-step-title', 'Prints e anexos'),
    h('p.al-step-sub', `Até ${MAX_ARQUIVOS} arquivos, 20 MB cada. Imagens aparecem no mural; os outros ficam para baixar.`),
    zona,
    seletor,
    listaArq,
    resumo,
  );

  function adicionar(novos: File[]) {
    for (const f of novos) {
      if (arquivos.length >= MAX_ARQUIVOS) {
        aviso(`Máximo de ${MAX_ARQUIVOS} arquivos por envio.`, 'erro');
        break;
      }
      if (f.size > MAX_ARQUIVO) {
        aviso(`"${f.name}" passa de 20 MB.`, 'erro');
        continue;
      }
      arquivos.push(f);
    }
    desenharArquivos();
  }

  function desenharArquivos() {
    listaArq.querySelectorAll('img').forEach((i) => URL.revokeObjectURL(i.src));
    listaArq.replaceChildren(
      ...arquivos.map((f, i) => {
        const img = f.type.startsWith('image/');
        const rm = h('button.al-preview-rm', { type: 'button', 'aria-label': `Remover ${f.name}` }, icon(X, 16));
        rm.addEventListener('click', () => {
          arquivos.splice(i, 1);
          desenharArquivos();
        });
        return h(
          'div.al-preview',
          img ? h('img', { src: URL.createObjectURL(f), alt: '' }) : h('span.al-preview-file', icon(FileText, 28)),
          h('span.al-preview-name', f.name),
          h('span.al-preview-size', tamanho(f.size)),
          rm,
        );
      }),
    );
    const total = arquivos.reduce((s, f) => s + f.size, 0);
    resumo.textContent = arquivos.length ? `${arquivos.length} de ${MAX_ARQUIVOS} arquivos  ·  ${tamanho(total)} de 70 MB` : '';
    resumo.classList.toggle('is-warn', total > MAX_TOTAL);
  }

  // Colar print direto (Ctrl+V) em qualquer passo: já leva para os anexos.
  const colar = (ev: ClipboardEvent) => {
    const fs = [...(ev.clipboardData?.files ?? [])];
    if (!fs.length) return;
    ev.preventDefault();
    adicionar(
      fs.map((f, i) => (f.name && f.name !== 'image.png' ? f : new File([f], `print-${new Date().toISOString().slice(11, 19).replace(/:/g, '')}${i ? '-' + i : ''}.png`, { type: f.type }))),
    );
    if (passo !== 2) irPara(2);
    aviso('Print colado.');
  };
  document.addEventListener('paste', colar);
  d.addEventListener('close', () => document.removeEventListener('paste', colar));

  /* --- Estrutura do painel --- */
  const panes = [p1, p2, p3];
  const stepper = h(
    'ol.al-stepper',
    ...PASSOS.map((p, i) => {
      const li = h('li.al-stepper-item', h('span.al-stepper-dot', String(i + 1)), h('span.al-stepper-label', p));
      li.addEventListener('click', () => {
        if (i < passo || validar(passo, false)) irPara(Math.min(i, passo + 1));
      });
      return li;
    }),
  );
  const corpo = h('div.al-sheet-body', ...panes);
  const erro = h('p.al-error', { role: 'alert' });
  const voltar = h('button.hub-btn', { type: 'button' }, icon(ArrowLeft, 18), 'Voltar');
  const avancar = h('button.hub-btn.is-primary', { type: 'button' });
  const barra = h('div.al-progress', h('span.al-progress-fill'));
  const rodape = h('div.al-sheet-foot', voltar, h('span.al-foot-gap'), avancar);

  voltar.addEventListener('click', () => irPara(passo - 1));
  avancar.addEventListener('click', () => {
    if (!validar(passo, true)) return;
    if (passo < 2) irPara(passo + 1);
    else void enviar();
  });

  d.append(
    h('div.al-sheet-head', h('h2.al-sheet-title', 'Enviar trabalho'), botaoFechar(d)),
    stepper,
    corpo,
    erro,
    barra,
    rodape,
  );
  d.addEventListener('cancel', (ev) => {
    if (enviando) ev.preventDefault();
  });
  d.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && (ev.target as HTMLElement).tagName === 'INPUT') {
      ev.preventDefault();
      avancar.click();
    }
  });

  function validar(i: number, mostrar: boolean) {
    let msg = '';
    if (i === 0 && (!nome.value.trim() || !curso.value.trim())) msg = 'Preencha seu nome e seu curso.';
    if (i === 1 && !titulo.value.trim()) msg = 'Dê um título ao seu envio.';
    if (i === 2 && !texto.value.trim() && !arquivos.length) msg = 'Anexe pelo menos um print (ou volte e escreva um texto).';
    if (i === 2 && arquivos.reduce((s, f) => s + f.size, 0) > MAX_TOTAL) msg = 'Os anexos passam de 70 MB juntos. Remova algum.';
    if (mostrar) erro.textContent = msg;
    return !msg;
  }

  function irPara(i: number) {
    if (i === 1) identidade.set({ nome: nome.value.trim(), curso: curso.value.trim() });
    passo = Math.max(0, Math.min(2, i));
    erro.textContent = '';
    panes.forEach((p, k) => (p.hidden = k !== passo));
    stepper.querySelectorAll('.al-stepper-item').forEach((li, k) => {
      li.classList.toggle('is-on', k === passo);
      li.classList.toggle('is-done', k < passo);
      li.querySelector('.al-stepper-dot')!.replaceChildren(k < passo ? icon(Check, 16) : String(k + 1));
    });
    quemSou.replaceChildren(
      h('span.al-avatar.is-s', iniciais(nome.value)),
      h('span', 'Enviando como ', h('strong', nome.value.trim()), `  ·  ${curso.value.trim()}  `),
    );
    const trocar = h('button.al-link-btn', { type: 'button' }, 'trocar');
    trocar.addEventListener('click', () => irPara(0));
    quemSou.append(trocar);
    voltar.hidden = passo === 0;
    avancar.replaceChildren(...(passo < 2 ? ['Continuar', icon(ArrowRight, 18)] : ['Publicar no mural', icon(Check, 18)]));
    const foco = [nome.value ? curso : nome, titulo, zona][passo];
    setTimeout(() => (passo === 0 && nome.value && curso.value ? avancar : foco).focus(), 30);
  }

  function enviar() {
    enviando = true;
    avancar.setAttribute('disabled', '');
    voltar.setAttribute('disabled', '');
    d.classList.add('is-sending');
    const fill = barra.firstElementChild as HTMLElement;
    const form = new FormData();
    form.set('nome', nome.value.trim());
    form.set('curso', curso.value.trim());
    form.set('aula', aula);
    form.set('titulo', titulo.value.trim());
    form.set('texto', texto.value.trim());
    arquivos.forEach((f) => form.append('arquivos', f, f.name));

    return new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'api/envios');
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) fill.style.transform = `scaleX(${ev.loaded / ev.total})`;
        avancar.replaceChildren(`Enviando ${ev.lengthComputable ? Math.round((ev.loaded / ev.total) * 100) + '%' : '...'}`);
      };
      const falhou = (msg: string) => {
        enviando = false;
        d.classList.remove('is-sending');
        fill.style.transform = 'scaleX(0)';
        avancar.removeAttribute('disabled');
        voltar.removeAttribute('disabled');
        irPara(2);
        erro.textContent = msg;
        resolve();
      };
      xhr.onerror = () => falhou(new ErroApi('Sem conexão com o servidor. Confira sua internet e tente de novo.', 0).message);
      xhr.onload = () => {
        let r: { envio?: Envio; token?: string; erro?: string } = {};
        try {
          r = JSON.parse(xhr.responseText);
        } catch {
          /* resposta não-JSON (ex.: 413 do proxy) */
        }
        if (xhr.status !== 201 || !r.envio || !r.token) {
          return falhou(r.erro ?? (xhr.status === 413 ? 'Os anexos são grandes demais. Remova algum e tente de novo.' : `Erro ${xhr.status}. Tente de novo.`));
        }
        meusEnvios.add(r.envio.id, r.token);
        enviando = false;
        sucesso(r.envio);
        resolve();
      };
      xhr.send(form);
    });
  }

  function sucesso(e: Envio) {
    const ver = h('button.hub-btn.is-primary', { type: 'button' }, 'Ver no mural');
    const outro = h('button.hub-btn', { type: 'button' }, 'Enviar outro');
    ver.addEventListener('click', () => d.close());
    outro.addEventListener('click', () => {
      d.close();
      setTimeout(() => abrirEnvio(), 220);
    });
    d.classList.remove('is-sending');
    d.replaceChildren(
      h(
        'div.al-done',
        h('span.al-done-check', icon(Check, 44)),
        h('h2.al-done-title', e.status === 'pendente' ? 'Enviado!' : 'Publicado!'),
        h(
          'p.al-done-sub',
          e.status === 'pendente'
            ? `"${e.titulo}" foi recebido e aparece para a turma assim que o professor aprovar. Enquanto isso, só você vê no mural.`
            : `"${e.titulo}" já está no mural da Aula ${e.aula}. Você pode excluir quando quiser, por este aparelho.`,
        ),
        h('div.al-done-actions', ver, outro),
      ),
    );
    filtro = '';
    void carregar(e.id);
  }

  irPara(passo);
  d.showModal();
}

if (params.has('enviar')) abrirEnvio();
