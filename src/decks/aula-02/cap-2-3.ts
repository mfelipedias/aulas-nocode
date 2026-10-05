import { CalendarClock, Columns3, Hash, Link2, Paperclip, Rows3, Table2, ToggleLeft, Users } from 'lucide';
import { chapter, checklist, code, dataModel, definition, demo, grid, pause, quote, showcase, twoColumn } from '../../archetypes';
import type { SlideDef } from '../../engine/types';
import { TOTAL_BLOCOS } from './cap-0-1';

/** Capítulo 2 (Pensar em dados, S15–S25) e capítulo 3 (Demo 1: página e banco, S26–S27). */

export const cap23: SlideDef[] = [
  /* ------------------------- Capítulo 2: pensar em dados ------------------------- */

  // S15
  chapter({
    title: 'S15 · Bloco 2: Pensar em dados',
    numero: 2,
    total: TOTAL_BLOCOS,
    titulo: 'Pensar\nem dados',
    subtitulo: 'O que este sistema precisa lembrar?',
    cena: 'paineis-amplo',
    notes: `"Programadores experientes começam pela pergunta que iniciantes pulam: o que este sistema precisa lembrar?"
Ponte: uma frase de 1975 que explica por que o banco vem antes do botão.`,
  }),

  // S16
  quote({
    title: 'S16 · Citação: Fred Brooks',
    texto: 'Mostre-me suas tabelas, e não precisarei dos seus fluxogramas.',
    autor: 'Fred Brooks',
    obra: 'The Mythical Man-Month, 1975, cap. 9 (trecho)',
    traducao: true,
    cena: 'nevoa-centro',
    notes: `Brooks gerenciou o desenvolvimento do sistema operacional do IBM 360 e escreveu um dos livros clássicos da engenharia de software.
Ler a frase devagar, uma vez.
A ideia: se a estrutura dos dados está clara, a lógica quase se escreve sozinha. Por isso, hoje, o banco vem antes do botão.
Fonte: BROOKS, F. The Mythical Man-Month. Addison-Wesley, 1975, cap. 9 (trecho traduzido e encurtado).
Ponte: começar por algo que todo mundo conhece, a planilha.`,
  }),

  // S17
  twoColumn({
    title: 'S17 · Planilha, data type, field, thing',
    titulo: 'O que este sistema precisa lembrar?',
    topicos: [
      { icone: Table2, titulo: 'Tabela = data type', texto: 'A planilha inteira de inscrições vira o data type Inscricao.' },
      { icone: Columns3, titulo: 'Coluna = field', texto: 'Cada coluna (nome, email, telefone, trilha) é um campo, com tipo.', zoom: { x: 24, y: 22, w: 40, h: 56 } },
      { icone: Rows3, titulo: 'Linha = thing (registro)', texto: 'Cada pessoa inscrita é uma thing: um registro guardado no banco.', zoom: { x: 0, y: 36, w: 78, h: 40 } },
    ],
    visual: {
      tipo: 'midia',
      moldura: 'navegador',
      midia: {
        src: 'media/aula-02/esquema-planilha-inscricoes.svg',
        descricao: 'Esquema de planilha de inscrições com as colunas nome, email, telefone e trilha',
        ajuste: 'conter',
        posicao: 'center',
      },
    },
    cena: 'nevoa-suave',
    notes: `Todo mundo já usou planilha: começar por ela. Esquema próprio do deck, com dados fictícios.
Passo 1: "A planilha inteira, no Bubble, se chama data type."
Passo 2: zoom na coluna. "Cada coluna é um field, um campo."
Passo 3: zoom na linha. "Cada linha, cada pessoa inscrita, é uma thing, um registro."
A grande diferença: na planilha qualquer um digita qualquer coisa em qualquer célula. No banco, cada campo tem tipo e regras. É isso que impede alguém de escrever "amanhã" num campo de data.
Ponte: a definição exata de data type.`,
  }),

  // S18
  definition({
    title: 'S18 · Definição: data type',
    termo: 'Data type',
    origem: 'no editor: Data › Data types › New type',
    definicao: 'O molde de um tipo de coisa que o app guarda: inscrições, usuários, equipes.',
    exemplo: {
      titulo: 'Todo data type já nasce com',
      texto: 'Created Date, Modified Date, Created By, Slug e Unique ID. A data da inscrição não precisa de campo próprio.',
    },
    fonte: 'Manual do Bubble, “Data types and fields”.',
    cena: 'nevoa-esquerda',
    notes: `Data type é o molde; cada inscrição é uma cópia preenchida desse molde.
Nome no singular: o Bubble pluraliza sozinho. Nas buscas vai aparecer "Inscricaos", em português errado mesmo, e tudo bem.
Passo 1: os campos automáticos. A data e o autor da inscrição vêm de graça.
Por que "Inscricao" sem cedilha e sem til? Nome técnico sem acento evita problema quando o dado sair para outros sistemas, na Aula 3. O texto que o usuário vê pode ter acento.
Ponte: e de que tipo pode ser cada campo?`,
  }),

  // S19
  grid({
    title: 'S19 · Os tipos de campo do Bubble',
    titulo: 'Os tipos de campo do Bubble',
    cartoes: [
      { icone: Hash, titulo: 'Texto e número', itens: ['text', 'number', 'numeric range'] },
      { icone: CalendarClock, titulo: 'Tempo', itens: ['date', 'date range', 'date interval'] },
      { icone: ToggleLeft, titulo: 'Escolha e lugar', itens: ['yes / no', 'geographic address'] },
      { icone: Paperclip, titulo: 'Arquivos', itens: ['file', 'image'] },
      { icone: Link2, titulo: 'Relações', itens: ['outro data type', 'lista de…'], destaque: true },
    ],
    conclusao: 'Não existe tipo e-mail: e-mail é text, validado no input.',
    fonte: 'Manual do Bubble, “Data types and fields”.',
    cena: 'nevoa-suave',
    notes: `Não decorar: reconhecer. Um grupo por passo.
Passos 1 a 4: os dez tipos nativos, agrupados. Texto e número; tempo; sim ou não e endereço; arquivo e imagem.
Passo 5: as relações. Um campo pode ser do tipo de outro data type, ou uma lista dele. É assim que se faz relação sem escrever SQL.
Passo 6: as relações ganham moldura e entra a observação do e-mail. "Não existe tipo e-mail. E-mail é text; quem valida o formato é o campo de entrada da tela."
Ponte: um teste rápido com o telefone.`,
  }),

  // S20
  pause({
    title: 'S20 · Pausa: telefone, number ou text?',
    pergunta: 'Telefone: number ou text? Pense em +55 (11) 98765-4321.',
    resposta: 'Text. Tem parênteses, +55 e zero à esquerda, e ninguém soma telefones.',
    detalhe: 'Regra: só é number o que você vai calcular. Vale para CEP, CPF e matrícula.',
    segundos: 20,
    chat: 'Se estiver ao vivo, responda no chat.',
    cena: 'nevoa-centro',
    notes: `Mostrar também os formatos (11) 98765-4321 e 011 98765-4321 (dizer em voz alta).
Anel de 20 segundos. Pensar em voz alta: "telefone é feito de números... mas olhem os exemplos".
Se fosse number, o zero do 011 sumiria e o +55 daria erro.
Opcional: contar no chat quantos disseram number e quantos disseram text. Ler uma resposta antes de revelar.
Revelação: text. A regra geral vale para CEP, CPF e matrícula.
Ponte: montar a nossa Inscricao, campo por campo.`,
  }),

  // S21
  dataModel({
    title: 'S21 · A Inscricao do hackathon',
    titulo: 'A Inscricao do hackathon',
    entidades: [
      {
        id: 'inscricao',
        nome: 'Inscricao',
        icone: Table2,
        col: 0,
        campos: [
          { nome: 'nome', tipo: 'text' },
          { nome: 'email', tipo: 'text' },
          { nome: 'telefone', tipo: 'text' },
          { nome: 'trilha', tipo: 'Trilha' },
          { nome: 'Created Date', tipo: 'date, auto' },
          { nome: 'Created By', tipo: 'User, auto', chave: 'fk' },
        ],
      },
      {
        id: 'user',
        nome: 'User',
        icone: Users,
        col: 1,
        campos: [
          { nome: 'Unique ID', tipo: 'automático', chave: 'pk' },
          { nome: 'email', tipo: 'text' },
          { nome: 'organizador', tipo: 'yes / no' },
        ],
      },
    ],
    relacoes: [{ de: 'inscricao.Created By', para: 'user.Unique ID', cardinalidade: 'N:1', rotulo: 'quem criou' }],
    conclusao: 'Cada campo veio do wireframe da Aula 1: o formulário define o banco.',
    cena: 'nevoa-suave',
    notes: `Passo 0: a Inscricao inteira. Ler de cima para baixo.
nome, email e telefone, os três text: vieram direto do wireframe da Aula 1.
trilha não é texto livre, para não termos "web", "Web" e "WEB" como três trilhas diferentes: vem de uma lista fixa, o option set (próximo slide).
Created Date e Created By são automáticos, de graça.
Passo 1: o User aparece. Todo app Bubble já tem esse data type para quem faz login. Guardar o campo organizador: ele volta no bloco 6.
Passo 2: frase-síntese. O formulário define o banco.
A captura bubble-data-types.png volta no slide S27, ao lado da página index.
Ponte: o que é, exatamente, um option set?`,
  }),

  // S22
  twoColumn({
    title: 'S22 · Option set Trilha',
    titulo: 'Option set: a lista que não muda',
    subtitulo: 'Onde: Data › Option sets › New option set',
    topicos: [
      { titulo: 'Fica no código do app, não no banco', texto: 'Por isso carrega instantaneamente, sem consulta ao servidor.', realce: ['trilha'] },
      { titulo: 'Usuários não criam nem editam opções', texto: 'Só quem edita o app muda a lista. Equivale a um enum em programação.', realce: ['web', 'mobile', 'auto', 'ia'] },
      { titulo: 'Visível para todos', texto: 'Vai para o navegador de qualquer visitante: nunca guarde dado sensível aqui.', realce: ['trilha', 'web', 'mobile', 'auto', 'ia'] },
    ],
    visual: {
      tipo: 'fluxo',
      nos: [
        { id: 'trilha', rotulo: 'Trilha', sub: 'option set', icone: Rows3, tipo: 'dado', col: 0, linha: 1.5 },
        { id: 'web', rotulo: 'Web', sub: 'Display', col: 1, linha: 0 },
        { id: 'mobile', rotulo: 'Mobile', sub: 'Display', col: 1, linha: 1 },
        { id: 'auto', rotulo: 'Automação', sub: 'Display', col: 1, linha: 2 },
        { id: 'ia', rotulo: 'IA', sub: 'Display', col: 1, linha: 3 },
      ],
      ligacoes: [
        { de: 'trilha', para: 'web' },
        { de: 'trilha', para: 'mobile' },
        { de: 'trilha', para: 'auto' },
        { de: 'trilha', para: 'ia' },
      ],
    },
    cena: 'nevoa-suave',
    notes: `Regra prática: se a lista muda pelo uso do app (inscrições), é data type. Se muda só quando você decide (trilhas, status), é option set.
Passo 1: fica no código do app, não no banco: carrega instantâneo.
Passo 2: usuários não criam nem editam opções. Em programação, isso é um enum.
Passo 3: segurança. Option set vai junto com o app para o navegador de qualquer visitante. Nunca guarde nada sensível nele.
Captura opcional bubble-option-set-trilha.png: na demo do bloco 3 a tela real aparece.
Ponte: e como uma coisa se liga a outra?`,
  }),

  // S23
  dataModel({
    title: 'S23 · Relação um-para-muitos',
    titulo: 'Relação um-para-muitos',
    entidades: [
      {
        id: 'trilha',
        nome: 'Trilha',
        icone: Rows3,
        col: 0,
        campos: [
          { nome: 'Display', tipo: 'text', chave: 'pk' },
          { nome: 'Web, Mobile…', tipo: '4 opções' },
        ],
      },
      {
        id: 'inscricao',
        nome: 'Inscricao',
        icone: Table2,
        col: 1,
        campos: [
          { nome: 'Unique ID', tipo: 'automático', chave: 'pk' },
          { nome: 'nome', tipo: 'text' },
          { nome: 'trilha', tipo: 'Trilha', chave: 'fk' },
        ],
      },
      {
        id: 'equipe',
        nome: 'Equipe',
        icone: Users,
        col: 2,
        campos: [
          { nome: 'nome', tipo: 'text' },
          { nome: 'membros', tipo: 'lista Inscricao', chave: 'fk' },
        ],
      },
    ],
    relacoes: [
      { de: 'inscricao.trilha', para: 'trilha.Display', cardinalidade: 'N:1', rotulo: 'muitas' },
      { de: 'equipe.membros', para: 'inscricao.Unique ID', cardinalidade: '1:N', rotulo: 'até 4' },
    ],
    passos: [['trilha', 'inscricao'], ['equipe']],
    conclusao: 'No Bubble: um campo do tipo de outro data type, ou uma lista dele.',
    cena: 'nevoa-suave',
    notes: `Relação é o "relacional" do banco relacional.
Passo 0: Trilha e Inscricao. Uma trilha tem muitas inscrições; cada inscrição tem uma trilha. No Bubble, é o campo trilha dentro de Inscricao.
Passo 1: Equipe. Uma equipe tem até 4 membros: o campo membros, uma lista de Inscricao, dentro de Equipe.
Passo 2: a frase-síntese. Dá para guardar a relação dos dois lados (equipe em cada Inscricao, ou membros em Equipe). Escolher o lado é decisão de projeto.
A Equipe será criada pelo agente de IA no bloco 7: guardar este desenho para conferir o que ele fizer.
Ponte: o mesmo banco, escrito em SQL.`,
  }),

  // S24
  code({
    title: 'S24 · O mesmo banco, em SQL',
    titulo: 'O mesmo banco, em SQL',
    arquivo: 'inscricao.sql (tradução conceitual)',
    linguagem: 'sql',
    codigo: `
      CREATE TYPE trilha AS ENUM (
        'Web', 'Mobile', 'Automacao', 'IA'
      );

      CREATE TABLE inscricao (
        id           UUID PRIMARY KEY,
        nome         TEXT NOT NULL,
        email        TEXT NOT NULL,
        telefone     TEXT,
        trilha       trilha,
        equipe_id    UUID REFERENCES equipe(id),
        created_date TIMESTAMP DEFAULT now(),
        created_by   UUID REFERENCES usuario(id)
      );
    `,
    passos: [
      { linhas: '1-3', nota: 'O option set Trilha vira um tipo enumerado: a lista fixa.' },
      { linhas: '7-10', nota: 'Os fields do formulário viram colunas, cada uma com seu tipo.' },
      { linhas: 11, nota: 'A relação com a equipe é uma chave estrangeira: REFERENCES.' },
      { linhas: '12-13', nota: 'Os campos que o Bubble preenche sozinho: Created Date e Created By.' },
    ],
    cena: 'vazio',
    notes: `"Para quem é de ADS: vocês vão escrever isto em Banco de Dados. O Bubble faz o equivalente por baixo, só que com formulários."
Passo 1: a lista de trilhas é um tipo enumerado.
Passo 2: os campos do formulário são colunas de texto.
Passo 3: a relação com a equipe é uma chave estrangeira.
Passo 4: data de criação e autor, as colunas que o Bubble preenche sozinho.
Não é preciso entender cada palavra agora. O ponto: nada aqui é mágica. O Bubble não executa este SQL literalmente; é a tradução conceitual.
Ponte: agora é a sua vez de modelar.`,
  }),

  // S25
  checklist({
    title: 'S25 · Pause o vídeo: modele o seu',
    titulo: 'Modele o seu',
    subtitulo: 'Pause o vídeo por 2 minutos. Ao vivo: responda no chat um data type e dois campos.',
    itens: [
      { texto: 'O que o seu app precisa lembrar?', detalhe: 'Os data types, no singular.' },
      { texto: 'Que informação cada um guarda, e de que tipo?', detalhe: 'Os fields. Number só para o que você vai calcular.' },
      { texto: 'O que é lista fixa?', detalhe: 'Os option sets.' },
    ],
    cena: 'nevoa',
    notes: `Dar 30 segundos de silêncio real ao vivo. Quem assiste à gravação pausa e faz no papel.
Um passo por pergunta, devagar.
Exemplo do professor, depois do silêncio: um app de empréstimo de livros para a biblioteca do bairro. Data type Livro (titulo text, autor text, disponivel yes/no). Data type Emprestimo (livro do tipo Livro, que é a relação, e data_devolucao date). Option set Categoria: romance, didático, infantil.
Gabarito para o chat: data type no singular, tipos coerentes, ao menos uma relação ou option set. Erro comum: data type para algo que é lista fixa.
Opcional: ler 2 modelos do chat.
Ponte: "Chega de desenho. Vamos ver isso nascer no Bubble."`,
  }),

  /* ------------------------- Capítulo 3: demo 1 ------------------------- */

  // S26
  demo({
    title: 'S26 · Demo 1: página e banco',
    plataforma: 'bubble',
    titulo: 'Agora, no Bubble: página e banco',
    passos: [
      'Data type Inscricao e option set Trilha',
      'Página de inscrição a partir do wireframe',
      'Inputs prontos para o workflow',
    ],
    duracao: 'Cerca de 11 minutos',
    url: 'bubble.io · Data',
    captura: 'media/aula-02/bubble-index-design.png',
    video: { src: 'media/aula-02/demo1-pagina-e-banco.mp4', poster: 'media/aula-02/demo1-pagina-e-banco.jpg', label: 'Backup: Demo 1, página e banco' },
    cena: 'paineis',
    notes: `Ler os 3 objetivos (um por passo) e trocar para o navegador no monitor 1.
"O editor está em inglês; vou dizer o nome de cada botão exatamente como aparece na tela."
Roteiro (conteudo.md, capítulo 3): tour de 30 s; Data > Option sets > Trilha (Web, Mobile, Automação, IA); Data types > New type Inscricao com nome, email, telefone (text) e trilha (Trilha); App data vazio; Design da página index (Group em coluna, textos, imagem, 3 inputs renomeados, Dropdown Trilha dinâmico, botão "Quero minha vaga", Texto confirmacao com Visible on page load desligado); Preview: clicar e nada acontece.
Plano B: tecla V abre demo1-pagina-e-banco.mp4 (a partir de 03:00 se o editor travar). Ou trocar para a aba do hackathon-template.
Nunca consertar ao vivo por mais de 60 s.
Ao voltar: avançar para a síntese.`,
  }),

  // S27
  showcase({
    title: 'S27 · O que existe agora',
    titulo: 'O que existe agora',
    plataforma: 'bubble',
    midia: {
      src: 'media/aula-02/bubble-data-types.png',
      descricao: 'Aba Data do Bubble: data type Inscricao com seus campos e o option set Trilha',
    },
    url: 'bubble.io/page?id=hackathon-aula02&tab=Data',
    rotulo: 'Data: o que guardar',
    par: {
      midia: {
        src: 'media/aula-02/bubble-index-design.png',
        descricao: 'Página index no editor do Bubble: título, imagem, três inputs, dropdown de trilha e botão Quero minha vaga',
      },
      url: 'bubble.io · Design',
      rotulo: 'Design: o que perguntar',
    },
    anotacoes: [
      { x: 30, y: 40, titulo: 'O banco sabe o que guardar', texto: 'Data type Inscricao e option set Trilha.' },
      { x: 50, y: 55, naPar: true, titulo: 'A tela sabe o que perguntar', texto: 'Inputs renomeados e dropdown ligado ao option set.' },
      { x: 50, y: 85, naPar: true, titulo: 'Falta o que liga os dois', texto: 'Clicar em Quero minha vaga ainda não faz nada.', zoom: { x: 25, y: 55, w: 55, h: 45 } },
    ],
    cena: 'nevoa-suave',
    notes: `De volta ao deck. Sintetizar em 30 segundos. As duas capturas lado a lado: Data à esquerda, Design à direita.
Passo 1: o banco sabe o que guardar (bubble-data-types.png).
Passo 2: a tela sabe o que perguntar (bubble-index-design.png).
Passo 3: falta o que liga os dois. Se clicarmos agora em "Quero minha vaga", nada acontece: é a situação da página da Aula 1, só que agora o banco existe.
Opcional: no máximo 1 pergunta da demo, de 30 s.
Ponte: o que falta é a lógica, o próximo bloco.`,
  }),
];
