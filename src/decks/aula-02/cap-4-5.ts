import { Bug, Database, EyeOff, MousePointerClick, PanelsTopLeft, RotateCcw, Search, TextCursorInput, UserRound, Zap, Workflow } from 'lucide';
import { bulletsRich, chapter, code, definition, demo, flow, grid, imageFull, pause, statement, twoColumn, videoDemo } from '../../archetypes';
import type { SlideDef } from '../../engine/types';
import { TOTAL_BLOCOS } from './cap-0-1';

/** Capítulo 4 (Lógica: eventos, ações e condições, S28–S37) e capítulo 5 (Demo 2, S38–S40). */

export const cap45: SlideDef[] = [
  /* ------------------------- Capítulo 4: lógica ------------------------- */

  // S28
  chapter({
    title: 'S28 · Bloco 4: Lógica',
    numero: 4,
    total: TOTAL_BLOCOS,
    titulo: 'Lógica: eventos,\nações e condições',
    subtitulo: 'Banco e tela existem. Agora, o que transforma os dois em aplicação.',
    cena: 'grafo-amplo',
    notes: `"Banco e tela existem. Agora a parte que transforma os dois em aplicação: a lógica."
Ponte: a frase que programa o Bubble.`,
  }),

  // S29
  statement({
    title: 'S29 · Quando, faça, só se',
    partes: ['Quando [evento],', 'faça [ação]\ncom [dados],', 'só se [condição].'],
    apoio: 'Quando o botão for clicado, crie uma Inscricao com os inputs, só se o e-mail não estiver vazio.',
    cena: 'grafo',
    notes: `Esta frase é o paradigma da aula: quem a domina programa no Bubble, no Make (Aula 3) e em qualquer automação.
Parte 1: o evento, o "quando".
Passo 1: a ação e os dados, o "faça".
Passo 2: a condição, o "só se". Ler o apoio em voz alta com o nosso exemplo.
"É a mesma estrutura de um if dentro de uma função, em qualquer linguagem."
Ponte: como essa frase aparece na aba Workflow.`,
  }),

  // S30
  flow({
    title: 'S30 · Anatomia de um workflow',
    titulo: 'Anatomia de um workflow',
    nos: [
      { id: 'evento', tag: 'Evento', rotulo: 'Botão clicado', sub: 'Quero minha vaga', icone: MousePointerClick, tipo: 'gatilho' },
      { id: 'cria', tag: 'Step 1', rotulo: 'Create a new thing', sub: 'Inscricao', icone: Database, tipo: 'dado' },
      { id: 'reset', tag: 'Step 2', rotulo: 'Reset inputs', sub: 'Reset relevant inputs', icone: RotateCcw },
      { id: 'mostra', tag: 'Step 3', rotulo: 'Show an element', sub: 'Texto confirmacao', icone: PanelsTopLeft },
    ],
    ligacoes: [
      { de: 'evento', para: 'cria', rotulo: 'Only when' },
      { de: 'cria', para: 'reset' },
      { de: 'reset', para: 'mostra' },
    ],
    conclusao: 'Um evento, passos numerados, executados em ordem. Only when no evento vale para todos.',
    cena: 'nevoa-suave',
    notes: `Na aba Workflow, a frase vira este desenho. Um nó por passo.
Passo 0: o evento, When Button Quero minha vaga is clicked, com o selo Only when.
Passo 1: Step 1, Create a new thing, do tipo Inscricao.
Passo 2: Step 2, Reset relevant inputs, limpar o formulário.
Passo 3: Step 3, Show an element, mostrar a confirmação.
Passo 4: a síntese. Os passos rodam em ordem, de cima para baixo. A condição Only when pode ficar no evento (vale para tudo) ou num passo específico.
Os nomes em inglês são exatamente os da aba Workflow (manual do Bubble, "Element actions").
Miniatura opcional bubble-workflow-inscricao.png: aparece no slide da Demo 2.
Ponte: os eventos e ações que mais vamos usar.`,
  }),

  // S31
  grid({
    title: 'S31 · Eventos e ações mais usados',
    titulo: 'Eventos e ações mais usados',
    cartoes: [
      { icone: MousePointerClick, titulo: 'Quando: na tela', itens: ['An element is clicked', "An input's value is changed"] },
      { icone: UserRound, titulo: 'Quando: página e usuário', itens: ['Page is loaded', 'User is logged in', 'Do when condition is true'] },
      { icone: Database, titulo: 'Faça: nos dados', itens: ['Create a new thing', 'Make changes to a thing'] },
      { icone: Zap, titulo: 'Faça: na tela e na conta', itens: ['Show / Hide an element', 'Log the user in', 'Go to page'] },
    ],
    fonte: 'Manual do Bubble, “Element actions”, “Account” e “Actions”.',
    cena: 'nevoa-suave',
    notes: `Os eventos são os "quandos"; as ações, os "faças". Um cartão por passo.
Passos 1 e 2: cinco eventos. Um elemento é clicado, o valor de um campo muda, a página carrega, o usuário entra, ou "faça quando esta condição for verdadeira".
Passos 3 e 4: cinco ações. Criar uma coisa, mudar uma coisa, mostrar ou esconder um elemento, fazer login, ir para outra página.
Com estes dez nomes fazemos a aula de hoje e boa parte da Aula 3.
No editor, as ações ficam em categorias: Account, Navigation, Data (Things), Element actions e outras.
Slide cortável se a aula atrasar: dizer só "eventos são os quandos, ações os faças".
Ponte: onde a condição pode morar.`,
  }),

  // S32
  twoColumn({
    title: 'S32 · Condição em dois lugares',
    titulo: 'Condição em dois lugares',
    topicos: [
      { icone: Workflow, titulo: 'No workflow: decide se acontece', texto: "Only when Input E-mail's value is not empty. É lógica.", realce: ['workflow', 'inscricao'] },
      { icone: EyeOff, titulo: 'No elemento: decide como aparece', texto: 'Aba Conditional: botão apagado enquanto o e-mail está vazio. É aparência.', realce: ['botao'] },
      { icone: TextCursorInput, titulo: 'Atalho de 2026: Make required', texto: 'No próprio input. Antes se chamava This input should not be empty.', realce: ['input'] },
    ],
    visual: {
      tipo: 'fluxo',
      nos: [
        { id: 'input', rotulo: 'E-mail', sub: 'input', icone: TextCursorInput, col: 0, linha: 0 },
        { id: 'botao', rotulo: 'Botão', sub: 'Conditional', icone: EyeOff, col: 1, linha: 0 },
        { id: 'workflow', rotulo: 'Workflow', sub: 'Only when', icone: Workflow, tipo: 'gatilho', col: 2, linha: 0 },
        { id: 'inscricao', rotulo: 'Inscricao', sub: 'só se ok', icone: Database, tipo: 'dado', col: 2, linha: 1 },
      ],
      ligacoes: [
        { de: 'input', para: 'botao' },
        { de: 'botao', para: 'workflow', rotulo: 'clique' },
        { de: 'workflow', para: 'inscricao' },
      ],
    },
    cena: 'nevoa-suave',
    notes: `A condição aparece em dois lugares, e eles fazem coisas diferentes.
Passo 1: no workflow, o Only when decide se a ação acontece. É lógica.
Passo 2: no elemento, a aba Conditional decide como ele aparece: o botão fica apagado enquanto o e-mail está vazio. É aparência.
Passo 3: o atalho do editor novo, Make required, no próprio input (antes "This input should not be empty").
As duas juntas dão boa experiência: o botão já avisa, e o workflow garante.
Fonte: manual do Bubble, guia de migração do property editor ("Make required").
Ponte: uma regra de negócio de verdade.`,
  }),

  // S33
  code({
    title: 'S33 · Sem inscrição duplicada',
    titulo: 'Sem inscrição duplicada',
    subtitulo: 'A primeira regra de negócio de verdade.',
    arquivo: 'Workflow › evento › Only when',
    linguagem: 'sql',
    codigo: `
      -- Bubble: Only when do evento
      Do a search for Inscricaos
        (email = Input E-mail's value)
        :count is 0

      -- O mesmo em SQL
      SELECT COUNT(*)
        FROM inscricao
       WHERE email = :email;
      -- o resultado precisa ser 0
    `,
    passos: [
      { linhas: '2,7-8', nota: 'Procure inscrições: Do a search for é um SELECT na tabela inscricao.' },
      { linhas: '3,9', nota: 'A restrição: só as inscrições com o e-mail digitado (WHERE).' },
      { linhas: '4,10', nota: 'Conte e só continue se for zero. Um e-mail, uma vaga.' },
    ],
    cena: 'vazio',
    notes: `A primeira regra de negócio de verdade: no MoSCoW da Aula 1, "bloqueio de inscrição duplicada" era Should.
A expressão se lê da esquerda para a direita.
Passo 1: faça uma busca por inscrições. Do lado, SELECT COUNT FROM inscricao.
Passo 2: com este e-mail. WHERE email igual ao digitado.
Passo 3: conte, e só continue se o resultado for zero.
"Quem fizer Banco de Dados no próximo semestre vai escrever isso na primeira semana."
Captura opcional bubble-only-when.png: a condição real aparece na Demo 2.
Ponte: um bug clássico, como pausa.`,
  }),

  // S34
  pause({
    title: 'S34 · Pausa: a tela mente',
    pergunta: 'Cliquei, a mensagem de confirmação apareceu, e o App data continua vazio. Por quê?',
    resposta: 'O workflow mostra a mensagem mas não cria a Inscricao, ou cria só quando a condição é verdadeira, e ela foi falsa.',
    detalhe: 'Mensagem na tela não prova que salvou. O App data prova.',
    segundos: 25,
    chat: 'Se estiver ao vivo, responda no chat.',
    cena: 'nevoa-centro',
    notes: `Anel de 25 segundos. Pensar em voz alta: "se a mensagem apareceu, o workflow rodou... pelo menos o passo 3".
Opcional: ler 1 hipótese do chat antes de revelar.
Revelação: ou o workflow nunca cria a Inscricao, ou a condição estava só no passo de criação, foi falsa, e o passo 3 rodou sem ela.
É o bug mais frustrante para iniciantes, porque a tela "mente". Lição: verificar no banco, não na tela.
Ponte: uma memória que não vai para o banco.`,
  }),

  // S35
  definition({
    title: 'S35 · Definição: custom state',
    termo: 'Custom state',
    origem: 'estado da página; ação Set state of an element',
    definicao: 'Uma memória temporária da página. Não vai para o banco e some ao recarregar.',
    exemplo: {
      titulo: 'No nosso formulário',
      texto: 'enviado (yes/no): depois da inscrição, esconde o formulário e mostra só a confirmação.',
    },
    fonte: 'Manual do Bubble, “Element actions” (Set state of an element).',
    cena: 'nevoa-esquerda',
    notes: `Estado é para o que a página precisa lembrar enquanto está aberta: a etapa de um formulário, se a pessoa já enviou.
Passo 1: o exemplo. Um estado "enviado", sim ou não. Depois da inscrição, Set state of an element muda para sim, e as condições escondem o formulário.
Em JavaScript seria uma variável; em React, o useState.
Regra: se precisa sobreviver a um recarregamento, é banco, não estado.
Encurtável para 30 s se a aula atrasar.
Ponte: o workflow inteiro, em JavaScript.`,
  }),

  // S36
  code({
    title: 'S36 · O mesmo workflow, em JavaScript',
    titulo: 'O mesmo workflow, em JavaScript',
    arquivo: 'inscricao.js (db é fictício)',
    linguagem: 'js',
    codigo: `
      // When Button Quero minha vaga is clicked
      botao.addEventListener('click', async () => {
        const email = inputEmail.value;
        // Only when: não vazio e sem duplicata
        if (!email) return;
        if (await db.count({ email }) > 0) return;
        // Step 1: Create a new thing
        await db.insert('inscricao', { email,
          nome: inputNome.value, telefone: inputTel.value,
          trilha: selectTrilha.value });
        // Step 2: Reset relevant inputs
        formulario.reset();
        // Step 3: Show an element
        textoConfirmacao.hidden = false;
      });
    `,
    passos: [
      { linhas: '1-2', nota: 'O evento: um addEventListener de clique no botão.' },
      { linhas: '4-6', nota: 'As condições do Only when: dois ifs que saem da função.' },
      { linhas: '7-10', nota: 'Create a new thing é um insert com os valores dos inputs.' },
      { linhas: '11-14', nota: 'Reset e Show: duas linhas no fim. Cada comentário é o nome exato no Bubble.' },
    ],
    cena: 'vazio',
    notes: `Para quem já viu um pouco de programação: o mesmo workflow em JavaScript.
Passo 1: o evento é um addEventListener de clique.
Passo 2: as condições são dois ifs que saem da função.
Passo 3: o Create a new thing é um insert.
Passo 4: reset e show, duas linhas no fim.
O db aqui é fictício: num sistema real, essa linha esconde um servidor, um banco, autenticação e validação, que o Bubble entrega pronto.
"A lógica é a mesma. A sintaxe é que sumiu." É a frase da Aula 1.
Ponte: os três bugs que mais aparecem.`,
  }),

  // S37
  bulletsRich({
    title: 'S37 · Os 3 bugs mais comuns',
    titulo: 'Os 3 bugs mais comuns',
    itens: [
      { icone: Bug, titulo: 'Campo ligado ao input errado', texto: "email = Input Nome's value. Salva, mas salva errado." },
      { icone: EyeOff, titulo: 'Mensagem visível antes do envio', texto: 'Visible on page load ficou ligado no texto de confirmação.' },
      { icone: MousePointerClick, titulo: 'Clique sem efeito', texto: 'Workflow ligado a outro botão, ou condição sempre falsa.' },
      { icone: Search, titulo: 'Para caçar os três', texto: 'Data › App data e o debugger do preview em modo Step-by-step.' },
    ],
    fonte: 'Manual do Bubble, “The debugger”; guia de migração do property editor (Visible on page load).',
    cena: 'nevoa-suave',
    notes: `Estes três respondem por quase todo "não funciona" da primeira semana com Bubble. Um por passo.
Passo 1: email recebendo o valor do Input Nome. Por isso renomeamos os inputs na demo.
Passo 2: a confirmação aparece antes do envio: Visible on page load ligado.
Passo 3: clico e nada: workflow no botão errado, ou condição sempre falsa.
Passo 4: as ferramentas. O App data mostra o que foi salvo de verdade; o debugger, no preview, executa o workflow passo a passo e mostra o valor de cada expressão.
Captura opcional bubble-debugger.png: mostrar ao vivo na Demo 2, se houver tempo.
Ponte: "Vamos ver tudo isso funcionando, e eu vou quebrar uma coisa de propósito."`,
  }),

  /* ------------------------- Capítulo 5: demo 2 ------------------------- */

  // S38
  demo({
    title: 'S38 · Demo 2: workflow e organização',
    plataforma: 'bubble',
    titulo: 'Agora, no Bubble: workflow e organização',
    passos: [
      'Workflow de inscrição com condição',
      'Testar no preview e conferir no App data',
      'Página organizacao: lista, contador e vagas',
    ],
    duracao: 'Cerca de 11 minutos',
    url: 'bubble.io/page?id=hackathon-aula02&tab=Workflow',
    captura: 'media/aula-02/bubble-workflow-inscricao.png',
    video: {
      src: 'media/aula-02/demo2-workflow-organizacao.mp4',
      poster: 'media/aula-02/demo2-workflow-organizacao.jpg',
      label: 'Backup: Demo 2, workflow e organização',
    },
    cena: 'grafo',
    notes: `Ler os objetivos (um por passo) e trocar para o Bubble.
Roteiro (conteudo.md, capítulo 5): workflow do botão com Create a new thing (4 campos ligados aos inputs), Reset relevant inputs, Show an element.
Preview: Ana Exemplo, ana@example.com. Confirmação aparece. Data > App data > All Inscricaos: a linha está lá. Pausa de 2 s: "a primeira inscrição que esta página lembra".
Only when no evento: e-mail não vazio e Do a search for Inscricaos (email = Input E-mail's value):count is 0. Repetir o e-mail: nada é criado. Inscrever Bruno e Carla Exemplo.
Página organizacao: textos com a contagem e as vagas restantes; Repeating Group de Inscricao ordenado por Created Date.
Regra: o teste no App data acontece antes de construir a página de organização, nunca depois.
Plano B: tecla V abre demo2-workflow-organizacao.mp4, ou hackathon-template > organizacao.
Ponte: a síntese da demo em 15 segundos.`,
  }),

  // S39
  videoDemo({
    title: 'S39 · Do clique ao banco em 15 segundos',
    titulo: 'Do clique ao banco em 15 segundos',
    plataforma: 'bubble',
    src: 'media/aula-02/clip-inscricao-appdata.mp4',
    poster: 'media/aula-02/bubble-app-data.png',
    descricao: 'Clipe de 15 s: preencher o formulário, clicar, confirmação e a nova linha no App data',
    legenda: 'Isto é uma aplicação: a tela pergunta, a lógica decide, o banco lembra.',
    url: 'hackathon-aula02.bubbleapps.io/version-test',
    cena: 'nevoa',
    notes: `Síntese visual da demo para quem assiste à gravação pulando trechos.
Passo 1: o clipe toca (mudo; K pausa).
Ler a legenda: é a resposta parcial da pergunta central.
Avançar logo em seguida.
Ponte: a página da organização em tela cheia.`,
  }),

  // S40
  imageFull({
    title: 'S40 · A página da organização, aberta',
    midia: {
      src: 'media/aula-02/bubble-organizacao.png',
      descricao: 'Página organizacao com 25 inscrições fictícias e o contador 25 inscrições, 95 vagas restantes',
    },
    legenda: 'Qualquer pessoa com o link vê esta página.',
    detalhe: 'Nome, e-mail e telefone de 25 inscrições de teste, sem senha e sem conta.',
    cena: 'vazio',
    notes: `Deixar a imagem falar por 5 segundos antes de ler a faixa.
"Esta é a página da organização com 25 inscrições de teste. Nome, e-mail, telefone."
Ler a legenda devagar: "E qualquer pessoa com este link vê tudo isso. Não precisa de senha, não precisa de conta."
"Isso não é uma aplicação pronta. É um vazamento esperando acontecer."
Ponte direta para o bloco 6.`,
  }),
];
