import { Check, ImagePlus, LockKeyhole } from 'lucide';
import {
  AULAS,
  api,
  aulaAtual,
  aulaInfo,
  cabecalho,
  campo,
  carregarConfig,
  feedbackEnviado,
  identidade,
  iniciarPagina,
  type AulaInfo,
} from './aluno/comum';
import { NOTAS, RITMOS, type Ritmo } from './aluno/resultados';
import { h } from './engine/dom';
import { icon } from './engine/icons';

/**
 * Feedback das aulas (feedback.html?aula=N): nota, ritmo e dois comentários opcionais; anônimo por padrão.
 * O professor abre e fecha o feedback de cada aula e vê os resultados na área do professor (professor.html).
 */

const params = new URLSearchParams(location.search);
const app = document.getElementById('app')!;

// Endereço antigo dos resultados: agora ficam na área do professor.
if (params.has('resultados')) location.replace('professor.html#feedback');
const config = await carregarConfig();
formulario(aulaInfo(params.get('aula')) ?? aulaAtual());

/* ====================== Formulário ====================== */

function formulario(aula: AulaInfo) {
  iniciarPagina(`Feedback da Aula ${aula.numero}`, 'feedback');
  document.documentElement.dataset.accent = aula.accent;
  let nota = 0;
  let ritmo: Ritmo | '' = '';

  const seletorAula = h(
    'div.al-chips.al-chips-center',
    { role: 'tablist', 'aria-label': 'Sobre qual aula?' },
    ...AULAS.map((a) => {
      const b = h('button.al-chip', { type: 'button', role: 'tab', 'data-accent': a.accent, 'aria-selected': String(a.numero === aula.numero) }, `Aula ${a.numero}`);
      b.addEventListener('click', () => {
        if (a.numero === aula.numero) return;
        history.replaceState(null, '', `?aula=${a.numero}`);
        formulario(a);
      });
      return b;
    }),
  );

  const faces = h(
    'div.fb-faces',
    { role: 'radiogroup', 'aria-label': 'Nota da aula' },
    ...NOTAS.map((o) => {
      const b = h('button.fb-face', { type: 'button', role: 'radio', 'aria-checked': 'false', 'aria-label': `${o.n}: ${o.rotulo}` }, h('span.fb-emoji', o.emoji), h('span.fb-face-label', o.rotulo));
      b.addEventListener('click', () => {
        nota = o.n;
        faces.querySelectorAll('.fb-face').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
        faces.dataset.nota = String(o.n);
        atualizar();
      });
      return b;
    }),
  );

  const ritmos = h(
    'div.fb-seg',
    { role: 'radiogroup', 'aria-label': 'Ritmo da aula' },
    ...RITMOS.map((o) => {
      const b = h('button.fb-seg-btn', { type: 'button', role: 'radio', 'aria-checked': 'false' }, o.rotulo);
      b.addEventListener('click', () => {
        ritmo = o.v;
        ritmos.querySelectorAll('.fb-seg-btn').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
        atualizar();
      });
      return b;
    }),
  );

  const ajudou = h('textarea.al-input.al-textarea.is-short', { maxlength: 1000, rows: 3, placeholder: 'Um exemplo, uma demo, uma explicação...' }) as HTMLTextAreaElement;
  const melhorar = h('textarea.al-input.al-textarea.is-short', { maxlength: 1000, rows: 3, placeholder: 'O que ficou confuso ou faltou?' }) as HTMLTextAreaElement;

  const quem = identidade.get();
  const comNome = h('input', { type: 'checkbox' }) as HTMLInputElement;
  const nome = h('input.al-input', { type: 'text', maxlength: 80, placeholder: 'Seu nome', value: quem.nome, autocomplete: 'name' }) as HTMLInputElement;
  const curso = h('input.al-input', { type: 'text', maxlength: 80, placeholder: 'Seu curso', value: quem.curso }) as HTMLInputElement;
  const camposNome = h('div.fb-ident', { hidden: true }, nome, curso);
  comNome.addEventListener('change', () => {
    camposNome.hidden = !comNome.checked;
    if (comNome.checked) nome.focus();
  });

  const enviar = h('button.al-cta.fb-submit', { type: 'submit' }) as HTMLButtonElement;
  const falta = h('p.fb-falta');
  const erro = h('p.al-error', { role: 'alert' });

  function atualizar() {
    const pend = [!nota && 'a nota', !ritmo && 'o ritmo'].filter(Boolean);
    enviar.disabled = pend.length > 0;
    enviar.replaceChildren('Enviar feedback', icon(Check, 20));
    falta.textContent = pend.length ? `Falta escolher ${pend.join(' e ')}.` : 'Pronto para enviar.';
    falta.classList.toggle('is-ok', !pend.length);
  }

  const form = h(
    'form.fb-card',
    { novalidate: true },
    feedbackEnviado.has(aula.numero) ? h('p.fb-ja', 'Você já respondeu sobre esta aula neste aparelho. Pode enviar de novo, se quiser.') : null,
    h('fieldset.fb-q', h('legend.fb-q-title', h('span.fb-q-n', '1'), 'Como foi a aula?'), faces),
    h('fieldset.fb-q', h('legend.fb-q-title', h('span.fb-q-n', '2'), 'E o ritmo?'), ritmos),
    h(
      'fieldset.fb-q',
      h('legend.fb-q-title', h('span.fb-q-n', '3'), 'Comentários', h('span.al-opt', 'opcional')),
      campo('O que mais ajudou você hoje?', ajudou),
      campo('O que dá para melhorar?', melhorar),
    ),
    h('label.fb-toggle', comNome, h('span.fb-switch'), h('span', 'Responder com meu nome ', h('span.fb-toggle-sub', '(senão, é anônimo)'))),
    camposNome,
    erro,
    h('div.fb-foot', falta, enviar),
  ) as HTMLFormElement;

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!nota || !ritmo) return;
    enviar.disabled = true;
    enviar.replaceChildren('Enviando...');
    erro.textContent = '';
    try {
      if (comNome.checked && nome.value.trim()) identidade.set({ nome: nome.value.trim(), curso: curso.value.trim() || quem.curso });
      await api('/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          aula: String(aula.numero),
          nota,
          ritmo,
          ajudou: ajudou.value,
          melhorar: melhorar.value,
          nome: comNome.checked ? nome.value : '',
          curso: comNome.checked ? curso.value : '',
        }),
      });
      feedbackEnviado.add(aula.numero);
      obrigado(aula, nota);
    } catch (err) {
      erro.textContent = (err as Error).message;
      atualizar();
    }
  });

  atualizar();
  const fechado = config && !config.aulas[String(aula.numero)]?.feedback;
  app.replaceChildren(
    h(
      'main.hub.al-page.fb-page',
      cabecalho(`Feedback  ·  Aula ${aula.numero}`, 'Como foi a aula de hoje?', `${aula.titulo}. Leva 30 segundos e ajuda a melhorar as próximas aulas.`, seletorAula),
      fechado
        ? h(
            'section.fb-card.al-done',
            h('span.al-done-check.is-muted', icon(LockKeyhole, 36)),
            h('h2.al-done-title', 'Feedback fechado'),
            h('p.al-done-sub', `O professor ainda não abriu (ou já encerrou) o feedback da Aula ${aula.numero}. Escolha outra aula acima ou volte mais tarde.`),
          )
        : form,
    ),
  );
}

function obrigado(aula: AulaInfo, nota: number) {
  const o = NOTAS[nota - 1];
  const outra = h('button.hub-btn', { type: 'button' }, 'Responder sobre outra aula');
  outra.addEventListener('click', () => formulario(aula));
  app.replaceChildren(
    h(
      'main.hub.al-page.fb-page',
      h(
        'section.fb-card.al-done',
        h('span.al-done-check', icon(Check, 44)),
        h('h1.al-done-title', `Obrigado! ${o.emoji}`),
        h('p.al-done-sub', `Seu feedback sobre a Aula ${aula.numero} foi registrado.`),
        h(
          'div.fb-next',
          h('p.fb-next-title', 'Fez alguma coisa na aula de hoje?'),
          h('p.fb-next-sub', 'Mostre no mural da turma: um print já basta.'),
          h('a.al-cta', { href: `mural.html?enviar&aula=${aula.numero}` }, icon(ImagePlus, 20), 'Enviar para o mural'),
        ),
        h('div.al-done-actions', outra, h('a.hub-btn', { href: 'mural.html' }, 'Ver o mural')),
      ),
    ),
  );
  window.scrollTo({ top: 0 });
}
