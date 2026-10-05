import {
  Database,
  FileCheck2,
  KeyRound,
  LayoutTemplate,
  Lock,
  Mail,
  MessageSquareText,
  MousePointerClick,
  ShieldCheck,
  Table2,
  Users,
  Webhook,
  Workflow,
  Zap,
} from 'lucide';
import {
  agenda,
  bulletsRich,
  caseStudy,
  chapter,
  checklist,
  closing,
  code,
  comparison,
  constellation,
  cover,
  dataModel,
  definition,
  demo,
  flow,
  grid,
  imageFull,
  pause,
  quote,
  recap,
  requestResponse,
  showcase,
  stat,
  statement,
  timeline,
  twoColumn,
  videoDemo,
} from '../../archetypes';
import type { DeckDef } from '../../engine/types';

/**
 * Galeria de QA: cada arquétipo aparece uma vez, com conteúdo realista da disciplina.
 * Abra com index.html?aula=galeria (e ?accent=aula2..4 para testar as outras cores).
 * As mídias em media/galeria/ propositalmente não existem (exceto exemplo-captura.png),
 * para mostrar o quadro "captura pendente". Nada aqui é material de aula: os números são
 * ilustrativos e marcados como TODO-fonte quando não têm citação.
 */
const AULA = [
  { titulo: 'Abertura e gancho', duracao: '10 min' },
  { titulo: 'Dados no Bubble: data types', duracao: '20 min' },
  { titulo: 'Telas e elementos', duracao: '15 min' },
  { titulo: 'Workflows: a lógica do app', duracao: '25 min' },
  { titulo: 'Privacidade e testes', duracao: '12 min' },
  { titulo: 'Recapitulação e próximos passos', duracao: '8 min' },
];

const deck: DeckDef = {
  id: 'galeria',
  numero: 2,
  titulo: 'Galeria de arquétipos',
  disciplina: 'No-Code Development Platforms',
  data: '2026-10-15',
  horario: '19h00 às 20h30, ao vivo no Google Meet',
  professor: 'Prof. Marcos',
  accent: 'aula2',
  duracaoMin: 90,
  slides: [
    cover({
      titulo: 'Dados, telas\ne lógica',
      subtitulo: 'Galeria de QA do motor de apresentação: todos os arquétipos, uma vez cada.',
      dataExtenso: 'Quinta, 15 de outubro de 2026',
      notes: 'Capa (cover). Cena "blocos". Sem passos.',
    }),

    agenda({
      secoes: AULA,
      atual: 1,
      notes: 'Agenda com o bloco 2 em destaque. Repetir este slide na entrada de cada bloco, mudando `atual`.',
    }),

    chapter({
      numero: 2,
      total: 6,
      titulo: 'Onde os dados\nmoram',
      subtitulo: 'Antes de desenhar telas, decidimos o que o app precisa guardar.',
      notes: 'Abertura de capítulo (chapter). Cena "horizonte-avanco": a câmera avança na entrada.',
    }),

    definition({
      termo: 'Data type',
      origem: 'no Bubble, o equivalente a uma tabela',
      definicao: 'Um tipo de coisa que o app guarda, com campos que descrevem cada registro.',
      exemplo: {
        titulo: 'No nosso projeto',
        texto: 'Inscricao, com os campos nome, e-mail, telefone e evento. Cada pessoa inscrita vira um registro.',
      },
      notes: 'Definição (definition). Passo 1 traz o exemplo.',
    }),

    dataModel({
      titulo: 'O modelo de dados do evento',
      entidades: [
        {
          id: 'evento',
          nome: 'Evento',
          icone: Table2,
          campos: [
            { nome: 'id', tipo: 'unique id', chave: 'pk' },
            { nome: 'titulo', tipo: 'text' },
            { nome: 'data', tipo: 'date' },
            { nome: 'vagas', tipo: 'number' },
          ],
        },
        {
          id: 'inscricao',
          nome: 'Inscricao',
          icone: Table2,
          campos: [
            { nome: 'id', tipo: 'unique id', chave: 'pk' },
            { nome: 'nome', tipo: 'text' },
            { nome: 'email', tipo: 'text' },
            { nome: 'telefone', tipo: 'text' },
            { nome: 'evento', tipo: 'Evento', chave: 'fk' },
          ],
        },
        {
          id: 'user',
          nome: 'User',
          icone: Users,
          campos: [
            { nome: 'id', tipo: 'unique id', chave: 'pk' },
            { nome: 'email', tipo: 'text' },
            { nome: 'papel', tipo: 'option set' },
          ],
        },
      ],
      relacoes: [{ de: 'inscricao.evento', para: 'evento.id', cardinalidade: 'N:1', rotulo: 'pertence a' }],
      notes: 'Modelo de dados (dataModel). Uma entidade por passo; a relação aparece quando as duas estão visíveis.',
    }),

    bulletsRich({
      titulo: 'Quatro decisões antes de criar um data type',
      itens: [
        { icone: Database, titulo: 'O que guardar', texto: 'Só o que alguma tela ou regra vai usar. Campo sobrando vira bagunça.' },
        { icone: KeyRound, titulo: 'Como identificar', texto: 'O Bubble cria um id único; e-mail duplicado precisa de regra sua.' },
        { icone: Lock, titulo: 'Quem pode ver', texto: 'Regras de privacidade valem desde o primeiro registro, não no fim.' },
        { icone: Workflow, titulo: 'Quem cria e altera', texto: 'Todo registro nasce de um workflow: saiba qual.' },
      ],
      notes: 'Tópicos ricos (bulletsRich), 4 itens = duas colunas, um por passo.',
    }),

    twoColumn({
      titulo: 'O editor do Bubble em três áreas',
      topicos: [
        { icone: LayoutTemplate, titulo: 'Design', texto: 'Onde as telas são montadas, elemento por elemento.', zoom: { x: 0, y: 0, w: 55, h: 55 } },
        { icone: Workflow, titulo: 'Workflow', texto: 'Quando algo acontece, o que o app faz em seguida.', zoom: { x: 45, y: 20, w: 55, h: 55 } },
        { icone: Database, titulo: 'Data', texto: 'Os tipos de dados, os campos e os registros salvos.', zoom: { x: 20, y: 45, w: 55, h: 55 } },
      ],
      visual: {
        tipo: 'midia',
        moldura: 'navegador',
        url: 'bubble.io/page?id=evento-inscricao',
        midia: { src: 'media/galeria/exemplo-captura.png', descricao: 'Editor do Bubble com a aba Design aberta' },
      },
      notes: 'Duas colunas (twoColumn) com visual de mídia: cada tópico amplia uma região da captura.',
    }),

    showcase({
      titulo: 'A tela de inscrição, anotada',
      plataforma: 'bubble',
      midia: { src: 'media/galeria/bubble-design.png', descricao: 'Editor do Bubble, aba Design, com a landing de inscrição montada' },
      url: 'bubble.io/page?id=evento-inscricao&tab=Design',
      anotacoes: [
        { x: 12, y: 30, titulo: 'Árvore de elementos', texto: 'Cada caixa da página aparece aqui, na ordem em que foi colocada.', zoom: { x: 0, y: 10, w: 45, h: 60 } },
        { x: 58, y: 44, titulo: 'Campos do formulário', texto: 'Nome, e-mail e telefone: três inputs com rótulo.', zoom: { x: 35, y: 25, w: 50, h: 50 } },
        { x: 60, y: 74, titulo: 'Botão com ação', texto: 'O clique dispara o workflow que cria a Inscricao.' },
      ],
      notes: 'Vitrine (showcase) com captura AUSENTE: mostra o quadro "captura pendente" (discreto no palco; em âmbar no apresentador e com ?rascunho=1).',
    }),

    flow({
      titulo: 'Do clique ao registro salvo',
      nos: [
        { id: 'clique', rotulo: 'Botão clicado', sub: '“Quero minha vaga”', icone: MousePointerClick, tipo: 'gatilho', tag: 'Gatilho' },
        { id: 'valida', rotulo: 'Validar dados', sub: 'e-mail não vazio', icone: ShieldCheck },
        { id: 'cria', rotulo: 'Criar Inscricao', sub: 'nome, e-mail, telefone', icone: Database, tipo: 'dado' },
        { id: 'email', rotulo: 'Enviar e-mail', sub: 'confirmação', icone: Mail },
        { id: 'make', rotulo: 'Avisar o Make', sub: 'webhook', plataforma: 'make', tipo: 'externo', col: 3, linha: 1 },
      ],
      ligacoes: [
        { de: 'clique', para: 'valida' },
        { de: 'valida', para: 'cria', rotulo: 'ok' },
        { de: 'cria', para: 'email' },
        { de: 'cria', para: 'make', tracejada: true, rotulo: 'aula 3' },
      ],
      passos: [['clique'], ['valida'], ['cria'], ['email', 'make']],
      conclusao: 'Um workflow é uma sequência de ações disparada por um evento.',
      notes: 'Fluxo (flow) com 5 nós, uma ligação tracejada para fora do Bubble e frase-síntese.',
    }),

    code({
      titulo: 'O que o Bubble envia ao Make',
      arquivo: 'POST /webhook/inscricao',
      linguagem: 'json',
      codigo: `
        {
          "evento": "Hackathon No-Code 2026",
          "inscricao": {
            "nome": "Ana Souza",
            "email": "ana@exemplo.com",
            "telefone": "+55 11 90000-0000"
          },
          "origem": "landing",
          "criado_em": "2026-10-15T19:42:00-03:00",
          "vagas_restantes": 37,
          "aceitou_termos": true
        }
      `,
      passos: [
        { linhas: '2', nota: 'Qual evento: um texto simples.' },
        { linhas: '3-7', nota: 'Os dados da pessoa ficam agrupados num objeto.' },
        { linhas: '9-11', nota: 'Data no padrão ISO, número e verdadeiro/falso: tipos diferentes de valor.' },
      ],
      notes: 'Código/JSON (code). Cada passo destaca linhas e acende a anotação.',
    }),

    requestResponse({
      titulo: 'Requisição e resposta',
      cliente: { rotulo: 'App no Bubble', sub: 'quem pede', plataforma: 'bubble' },
      servidor: { rotulo: 'Cenário no Make', sub: 'quem responde', plataforma: 'make' },
      requisicao: {
        metodo: 'POST',
        url: '/webhook/inscricao',
        cabecalhos: ['Content-Type: application/json'],
        corpo: '{ "nome": "Ana Souza", "email": "ana@exemplo.com" }',
      },
      resposta: { status: 200, texto: 'OK', corpo: '{ "recebido": true }' },
      notes: 'Requisição e resposta (requestResponse). Passo 1: pedido. Passo 2: resposta.',
    }),

    grid({
      titulo: 'Priorizando com MoSCoW',
      cartoes: [
        { tag: 'Must have', titulo: 'Obrigatório', itens: ['Formulário de inscrição', 'Salvar no banco', 'Confirmação na tela'], destaque: true },
        { tag: 'Should have', titulo: 'Importante', itens: ['E-mail de confirmação', 'Limite de vagas'] },
        { tag: 'Could have', titulo: 'Desejável', itens: ['Painel do organizador', 'Exportar CSV'] },
        { tag: "Won't have", titulo: 'Fora desta versão', itens: ['Pagamento', 'App nativo'] },
      ],
      conclusao: 'O MVP é a coluna Must have. O resto espera a ideia provar valor.',
      notes: 'Grade 2 x 2 (grid) com destaque e frase final.',
    }),

    checklist({
      titulo: 'Antes de publicar a primeira versão',
      itens: [
        { texto: 'Regras de privacidade no data type Inscricao', detalhe: 'Ninguém além do organizador vê os e-mails.' },
        { texto: 'Teste com três inscrições reais', detalhe: 'Incluindo um e-mail inválido.' },
        { texto: 'Mensagem de sucesso depois do envio' },
        { texto: 'Versão de teste conferida no celular' },
      ],
      notes: 'Checklist: itens visíveis, cada passo marca o próximo.',
    }),

    stat({
      contexto: 'Quantos apps foram criados no Bubble?',
      valor: 4.69,
      casas: 2,
      sufixo: ' mi',
      unidades: false,
      descricao: 'de aplicações criadas por usuários da plataforma, segundo a própria empresa.',
      fonte: 'TODO-fonte: confirmar número e data na página oficial do Bubble antes de gravar.',
      notes: 'Estatística (stat) sem gráfico de unidades; fonte TODO aparece em âmbar.',
    }),

    caseStudy({
      empresa: 'Icatu Seguros',
      contexto: 'Seguradora, Brasil',
      plataforma: 'n8n',
      problema: 'Cotações de seguro dependiam de etapas manuais entre sistemas e levavam minutos para sair.',
      solucao: 'Fluxos de automação conectando os sistemas de cotação, sem reescrever as aplicações existentes.',
      resultados: [
        { texto: '5 min', rotulo: 'tempo de cotação antes' },
        { valor: 40, prefixo: '< ', sufixo: ' s', rotulo: 'tempo de cotação depois' },
      ],
      fonte: 'TODO-fonte: case Icatu + n8n (00-PESQUISA-ECOSSISTEMA.md, seção 4). Conferir a página original.',
      notes: 'Caso (caseStudy): passo 1 solução, passo 2 resultados contando.',
    }),

    timeline({
      titulo: 'Do no-code ao app por IA',
      marcos: [
        { data: '1979', titulo: 'VisiCalc', texto: 'A planilha leva a programação a quem não programa.' },
        { data: '2012', titulo: 'Bubble', texto: 'Apps web completos montados visualmente.' },
        { data: '2014', titulo: 'AppSheet', texto: 'Planilha vira app de celular.' },
        { data: '2016', titulo: 'Integromat', texto: 'Hoje Make: automação visual entre apps.' },
        { data: '2024', titulo: 'Lovable e Bolt', texto: 'Do texto ao app publicado em minutos.' },
      ],
      fonte: 'TODO-fonte: datas de fundação a confirmar (00-PESQUISA-ECOSSISTEMA.md).',
      notes: 'Linha do tempo (timeline), 5 marcos alternando acima e abaixo do trilho.',
    }),

    comparison({
      titulo: 'Três jeitos de guardar os dados',
      colunas: [
        { id: 'bubble', nome: 'Bubble', icone: Database, sub: 'banco embutido' },
        { id: 'sheets', nome: 'Planilha', icone: Table2, sub: 'Sheets, Airtable' },
        { id: 'api', nome: 'Back-end externo', icone: Webhook, sub: 'Xano, Supabase' },
      ],
      linhas: [
        { criterio: 'Para começar', celulas: [{ nivel: 4, rotulo: 'Imediato' }, { nivel: 4, rotulo: 'Imediato' }, { nivel: 2, rotulo: 'Configurar API' }], passo: 1 },
        { criterio: 'Escala', celulas: [{ nivel: 3, rotulo: 'Boa, com custo' }, { nivel: 1, rotulo: 'Limitada' }, { nivel: 4, rotulo: 'Alta' }], passo: 1 },
        { criterio: 'Quem mais acessa', celulas: ['Só o app', 'Qualquer um com o link', 'Vários apps'], passo: 2 },
      ],
      foco: { coluna: 'bubble', conclusao: 'Para o MVP do evento, o banco do próprio Bubble basta.' },
      notes: 'Comparação (comparison) com 3 colunas.',
    }),

    constellation({
      titulo: 'Onde cada ferramenta entra',
      subtitulo: 'Constelação com os logos oficiais baixados dos kits de imprensa.',
      destaque: { rotulo: 'Em destaque: as ferramentas da ementa' },
      notes: 'Constelação (constellation). Logos oficiais: Bubble, Lovable, n8n; restritos (AppSheet, Sheets) como nome.',
    }),

    quote({
      texto: 'A unidade de progresso de uma startup é o aprendizado validado.',
      autor: 'Eric Ries',
      obra: 'A Startup Enxuta, 2011',
      traducao: true,
      notes: 'Citação (quote): Instrument Serif centralizada.',
    }),

    statement({
      partes: ['Todo app é feito de\ndados, telas e regras.', 'O resto é detalhe.'],
      cena: 'grafo',
      notes: 'Declaração com a cena "grafo" ao fundo (grafo de nós com pulsos).',
    }),

    imageFull({
      midia: { src: 'media/galeria/evento-palco.jpg', descricao: 'Foto do palco de um hackathon, plateia ao fundo' },
      legenda: 'Hackathon No-Code 2026: o evento que o nosso app vai atender.',
      detalhe: 'Imagem de tela cheia com legenda sobre degradê.',
      fonte: 'Foto: arquivo do professor.',
      notes: 'Imagem de tela cheia (imageFull) com mídia AUSENTE: o quadro discreto ocupa a tela.',
    }),

    videoDemo({
      titulo: 'O workflow funcionando',
      plataforma: 'bubble',
      src: 'media/galeria/workflow-bubble.mp4',
      poster: 'media/galeria/workflow-bubble.png',
      descricao: 'Gravação: clique em “Quero minha vaga” e o registro aparecendo em App data',
      legenda: 'Passo 1 toca o vídeo. K pausa. V abre em tela cheia.',
      url: 'evento-inscricao.bubbleapps.io/version-test',
      notes: 'Vídeo embutido (videoDemo) com arquivo ausente.',
    }),

    demo({
      plataforma: 'bubble',
      titulo: 'Criando o data type Inscricao',
      passos: ['Aba Data, em Data types, botão New type', 'Campos: nome, e-mail, telefone', 'Workflow do botão: Create a new thing'],
      duracao: 'Cerca de 15 minutos',
      url: 'bubble.io/page?id=evento-inscricao&tab=Data',
      esquema: { titulo: 'Inscricao', campos: ['nome (text)', 'email (text)', 'telefone (text)'], botao: 'Create a new thing' },
      video: { src: 'media/galeria/demo-bubble.mp4', label: 'Backup: data type no Bubble' },
      notes: 'Passagem para demo (demo), arquétipo do protótipo.',
    }),

    pause({
      pergunta: 'Se o e-mail já estiver inscrito, o que o app deveria fazer?',
      resposta: 'Avisar e não criar um registro duplicado.',
      detalhe: 'Isso é uma regra: no Bubble, vira uma condição “Only when” no workflow.',
      segundos: 15,
      chat: 'Se você está ao vivo, responda no chat.',
      notes: 'Pausa para pensar (pause).',
    }),

    statement({
      partes: ['Interface é o que\no usuário toca.'],
      apoio: 'Fundo "paineis": painéis de vidro à direita, com esqueletos de interface.',
      cena: 'paineis',
      notes: 'Declaração com a cena "paineis" (painéis de vidro à direita).',
    }),

    statement({
      partes: ['Telas, dados e regras\nconversando entre si.'],
      apoio: 'Fundo "paineis-amplo": recuado, para aberturas e declarações.',
      cena: 'paineis-amplo',
      notes: 'Declaração com a cena "paineis-amplo".',
    }),

    statement({
      partes: ['Uma automação é\num grafo de passos.'],
      apoio: 'Fundo "grafo-amplo": o grafo ocupa a tela, recuado na névoa.',
      cena: 'grafo-amplo',
      notes: 'Declaração com a cena "grafo-amplo".',
    }),

    recap({
      itens: [
        'Data type é a tabela; campo é a coluna.',
        'Workflow = evento + sequência de ações.',
        'Privacidade se configura desde o primeiro registro.',
        'Teste com dados reais antes de publicar.',
      ],
      notes: 'Recapitulação (recap).',
    }),

    closing({
      frase: 'Seu app já guarda dados.\nAgora ele vai conversar.',
      proxima: { data: 'Quinta, 22 de outubro, 19h', tema: 'APIs, webhooks e automação com Make' },
      tarefas: [
        { texto: 'Termine o data type Inscricao', icone: FileCheck2 },
        { texto: 'Crie sua conta gratuita no Make', icone: Zap },
        { texto: 'Traga uma dúvida para o chat', icone: MessageSquareText },
      ],
      contato: 'Dúvidas: fórum da disciplina no AVA.',
      notes: 'Encerramento (closing). Cena "blocos-dispersos".',
    }),
  ],
};

export default deck;
