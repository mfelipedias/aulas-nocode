import { Building2, CircleCheck, CreditCard, Lock, MapPin } from 'lucide';
import { agenda, chapter, checklist, cover, grid, pause, showcase, stat, statement, timeline, twoColumn } from '../../archetypes';
import type { SlideDef } from '../../engine/types';

/**
 * Capítulo 0 (abertura a frio, S01–S05) e capítulo 1 (O Bubble e a Unidade II, S06–S14).
 * Fontes acessadas em 04/10/2026, salvo indicação (storyboard.md e conteudo.md, apêndice C).
 */

export const AGENDA = [
  { titulo: 'O Bubble e a Unidade II', duracao: '04:00' },
  { titulo: 'Pensar em dados', duracao: '12:00' },
  { titulo: 'Demo: página e banco', duracao: '24:00' },
  { titulo: 'Lógica: eventos, ações e condições', duracao: '36:00' },
  { titulo: 'Demo: workflow e organização', duracao: '46:00' },
  { titulo: 'Quem pode ver o quê', duracao: '58:00' },
  { titulo: 'Construir conversando', duracao: '68:00' },
  { titulo: 'Fechamento', duracao: '78:00' },
];

export const TOTAL_BLOCOS = 8;

export const cap01: SlideDef[] = [
  /* ------------------------- Capítulo 0: abertura a frio ------------------------- */

  // S01
  showcase({
    title: 'S01 · A página da Aula 1',
    titulo: 'Semana passada, esta página ficou pronta.',
    midia: {
      src: 'media/aula-02/aula01-pagina-ia.png',
      descricao: 'Página de inscrição do Hackathon No-Code 2026 gerada por IA na Aula 1, com formulário e botão',
    },
    url: 'hackathon-nocode-2026.lovable.app',
    anotacoes: [
      { x: 64, y: 50, titulo: 'Nome, e-mail, telefone', texto: 'O formulário que a Unidade I pediu, gerado a partir do wireframe.', zoom: { x: 40, y: 22, w: 58, h: 58 } },
      { x: 64, y: 78, titulo: 'Quero minha vaga', texto: 'O botão diz o que acontece com a pessoa, não “Enviar”.', zoom: { x: 40, y: 48, w: 58, h: 52 } },
      {
        x: 50,
        y: 50,
        titulo: 'Onde foi parar a inscrição?',
        texto: 'Eu preenchi e cliquei. Para onde foi?',
        midia: {
          src: 'media/aula-02/aula01-teste-envio.png',
          descricao: 'A mesma página depois do clique em Quero minha vaga, com os campos preenchidos com dados fictícios',
        },
      },
    ],
    fonte: 'Captura do professor, Aula 1 (08/10/2026).',
    chrome: false,
    cena: 'paineis',
    notes: `Começar sem boas-vindas: a cena fala primeiro. Deixar a moldura girar até ficar de frente (2 s).
"Esta é a página que uma IA gerou para o nosso Hackathon No-Code 2026 na Aula 1, a partir de persona, MoSCoW e wireframe."
Passo 1: o formulário com nome, e-mail e telefone. "Tem formulário, tem identidade visual."
Passo 2: o botão "Quero minha vaga", o texto de ação que a Unidade I pediu.
Passo 3: a captura troca para o teste de envio (aula01-teste-envio.png). Dizer em voz alta: "Eu preenchi e cliquei. A pergunta que dá nome à aula: para onde foi essa inscrição?"
Mídias: aula01-pagina-ia.png (passos 0 a 2) e aula01-teste-envio.png (passo 3).
Ponte: "Quantas inscrições essa página guardou desde a semana passada?"`,
  }),

  // S02
  stat({
    title: 'S02 · Zero inscrições guardadas',
    contexto: 'Quantas inscrições essa página guardou desde a Aula 1?',
    valor: 0,
    de: 120,
    descricao: 'O botão existe. O lugar onde a inscrição deveria ficar, não.',
    fonte: 'Teste do professor em 14/10/2026 na página gerada na Aula 1.',
    unidades: false,
    chrome: false,
    cena: 'nevoa-centro',
    notes: `Deixar a pergunta sozinha na tela por 2 segundos antes de avançar.
Passo 1: o número conta de 120 (as vagas do evento) até 0. "Zero. Não porque ninguém quis se inscrever: porque a página não tem onde guardar."
"Uma página mostra; ela não lembra de nada. Um evento com 120 vagas e uma página que esquece cada pessoa no instante do clique."
Conferir no D-2 se a página realmente não salva. Se salvar (o Lovable pode ter criado um backend), trocar a fala por: "Salvou. Mas onde? Com que estrutura? E quem pode ver o telefone dessas pessoas? A IA decidiu, não nós."
Ponte: a promessa da aula.`,
  }),

  // S03
  statement({
    title: 'S03 · A promessa',
    partes: ['Hoje esta página\npassa a lembrar.', 'E a decidir quem pode\nver o que ela lembra.'],
    cena: 'blocos-centro',
    notes: `Esta é a promessa da aula, em duas partes.
Parte 1: lembrar = banco de dados.
Passo 1: decidir = lógica; quem pode ver = regras de acesso.
"Até o fim desta aula vocês vão ver isso acontecer numa ferramenta real, o Bubble, sem uma linha de código, e entender o que acontece por baixo."
Ponte: a capa e as boas-vindas.`,
  }),

  // S04
  cover({
    title: 'S04 · Capa',
    titulo: 'Dando vida\nàs telas',
    subtitulo: 'Dados, lógica e regras de acesso no Bubble, do formulário à aplicação.',
    dataExtenso: 'Quinta, 15 de outubro de 2026',
    notes: `Deixar os blocos montarem antes de falar (3 s); o botão acende em violeta.
Boas-vindas em até 30 segundos: "Boa noite, esta é a Aula 2 de No-Code Development Platforms, Dando vida às telas. Eu sou o Marcos."
"Se você está ao vivo, o chat está aberto. Se assiste à gravação, os capítulos estão no índice do AVA, mas a aula foi pensada para ser vista em ordem."
Lembrar que é o mesmo projeto da semana passada: o Hackathon No-Code 2026.
Opcional, com alunos: cumprimentar 2 ou 3 pessoas do chat pelo nome.
Ponte: o roteiro e a pergunta central.`,
  }),

  // S05
  agenda({
    title: 'S05 · Roteiro da aula',
    titulo: 'O que transforma uma página bonita em uma aplicação?',
    secoes: AGENDA,
    cena: 'nevoa-esquerda',
    notes: `Ler só a pergunta do título. "A resposta tem três palavras, e elas aparecem no fim da aula."
O último item é o fechamento (78:00): "e, no fim, a resposta".
Os tempos ao lado de cada bloco são os da gravação, para quem quiser voltar a um trecho.
Apontar as duas demos grandes (blocos 3 e 5) e o agente de IA (bloco 7).
"Quem assiste depois pode pular pelos tempos, mas a aula foi feita para ser vista em ordem."
Ponte: "Antes de abrir a ferramenta: por que esta ferramenta?"`,
  }),

  /* ------------------------- Capítulo 1: O Bubble e a Unidade II ------------------------- */

  // S06
  chapter({
    title: 'S06 · Bloco 1: O Bubble e a Unidade II',
    numero: 1,
    total: TOTAL_BLOCOS,
    titulo: 'O Bubble\ne a Unidade II',
    subtitulo: 'Por que esta ferramenta, e o que vocês já viram dela.',
    notes: `Transição curta, 10 segundos.
"Antes de abrir a ferramenta: por que esta ferramenta, e o que vocês já viram dela na Unidade II."
Ponte: uma pergunta sobre cidades.`,
  }),

  // S07
  grid({
    title: 'S07 · Cidades que mais construíram no Bubble',
    titulo: 'Cidades que mais construíram no Bubble em 2025',
    cartoes: [
      { icone: MapPin, tag: '5º lugar', titulo: 'Londres', texto: 'Reino Unido' },
      { icone: MapPin, tag: '4º lugar', titulo: 'Tóquio', texto: 'Japão' },
      { icone: MapPin, tag: '3º lugar', titulo: 'Nova York', texto: 'Estados Unidos' },
      { icone: MapPin, tag: '2º lugar', titulo: 'Paris', texto: 'França' },
      { icone: MapPin, tag: '1º lugar', titulo: 'São Paulo', texto: 'Brasil', destaque: true },
    ],
    conclusao: 'Brasil: 2º país em tráfego desktop do bubble.io (9,9%, ago/2026).',
    fonte: 'Bubble Wrapped 2025 (bubble.io/blog, dez/2025); Similarweb, bubble.io, ago/2026.',
    notes: `Contagem regressiva: os cartões entram do 5º para o 1º, um por passo.
Abrir com a pergunta: "Qual foi a cidade do mundo onde mais se construiu no Bubble em 2025?"
Passos 1 a 4: Londres, Tóquio, Nova York, Paris.
Passo 5: São Paulo. "Não foi São Francisco nem Nova York. Foi São Paulo." Dado do relatório anual do próprio Bubble, o Bubble Wrapped 2025.
Passo 6: São Paulo ganha moldura e entra a linha do Brasil. "Segundo a Similarweb, em agosto de 2026 o Brasil era o 2º país em tráfego desktop do bubble.io, com 9,9%."
Tradução: a ferramenta de hoje tem comunidade, tutoriais, vagas e freelas em português.
Opcional: "Alguém aqui já viu vaga ou freela de Bubble?" (chat).
Ponte: a história em seis marcos.`,
  }),

  // S08
  timeline({
    title: 'S08 · Bubble em seis marcos',
    titulo: 'Bubble em seis marcos',
    marcos: [
      { data: '2012', titulo: 'Fundado em Nova York', texto: 'Por Josh Haas e Emmanuel Straschnov.' },
      { data: '2021', titulo: 'Série A de US$ 100 mi', texto: 'Rodada liderada pela Insight Partners.' },
      { data: 'jun/2025', titulo: 'Apps mobile nativos', texto: 'O mesmo editor passa a gerar apps para as lojas.' },
      { data: 'out/2025', titulo: 'Bubble AI Agent', texto: 'Um agente de IA dentro do editor visual.' },
      { data: 'dez/2025', titulo: 'Novo editor de propriedades', texto: 'Painel redesenhado, liberado por fases.' },
      { data: 'ago/2026', titulo: 'Agente para mobile e APIs', texto: 'O agente passa a construir apps mobile e conexões.' },
    ],
    fonte: 'TechCrunch, 27/07/2021; Bubble Wrapped 2025; BusinessWire, 16/10/2025; blog do Bubble (11/12/2025 e 04/08/2026).',
    cena: 'horizonte',
    notes: `Um marco por passo.
Passo 1: 2012, Nova York, Josh Haas e Emmanuel Straschnov: "muito mais gente quer criar software do que sabe programar".
Passo 2: 2021, Série A de US$ 100 milhões (TechCrunch). Mensagem: o Bubble não é novidade, tem 14 anos, dinheiro e base grande.
Passos 3 a 6: os três últimos marcos são os que importam hoje. A ferramenta mudou muito entre 2025 e 2026.
"Se um tutorial de 2024 mostrar uma tela diferente da sua, não é você: é a ferramenta que mudou."
O AI Agent (out/2025) volta no bloco 7.
Ponte: a palavra mais importante da aula.`,
  }),

  // S09
  stat({
    title: 'S09 · 28,6 bilhões de workflows',
    contexto: 'Quantos workflows os apps feitos no Bubble executaram em 2025?',
    valor: 28.6,
    casas: 1,
    sufixo: ' bi',
    descricao: '7,2 milhões de apps lançados, mais de US$ 1 bi transacionado e mais de 180 mil apps mobile desde junho.',
    fonte: 'Bubble Wrapped 2025 (bubble.io/blog/bubble-wrapped-2025-year-in-review), dados da própria empresa.',
    unidades: false,
    cena: 'grafo',
    notes: `"Workflow" é a palavra mais importante da aula e aparece aqui pela primeira vez: é cada vez que um app reage a algo, como um clique.
Cada pulso de luz no grafo ao fundo é um workflow rodando.
Passo 1: o número conta. "Vinte e oito bilhões e seiscentos milhões de vezes em um ano."
Ler a linha de apoio: 7,2 milhões de apps, mais de 1 bilhão de dólares, 180 mil apps mobile.
Dizer em voz alta: os números são do próprio Bubble, no relatório de fim de ano. Dados de empresa, não de auditoria.
Ponte: quem construiu negócio de verdade nele?`,
  }),

  // S10
  grid({
    title: 'S10 · Empresas que começaram no Bubble',
    titulo: 'Empresas que começaram no Bubble',
    cartoes: [
      {
        icone: Building2,
        tag: 'EUA, dado de 2022',
        titulo: 'Dividend Finance',
        itens: ['Financiamento de energia solar', 'US$ 330 mi+ captados', 'US$ 1 bi+ em empréstimos'],
      },
      {
        icone: Building2,
        tag: 'França, dado de 2022',
        titulo: 'Comet',
        itens: ['Marketplace de freelancers', 'US$ 800 mil de receita', 'antes de captar US$ 13 mi'],
      },
      {
        icone: Building2,
        tag: 'EUA, dado de 2021',
        titulo: 'Teal',
        itens: ['Plataforma de carreira', 'US$ 5 mi captados', 'com 12 pessoas no time'],
      },
    ],
    conclusao: 'Casos divulgados pelo próprio Bubble. Leia como vitrine, não como estudo independente.',
    fonte: 'Blog do Bubble, “Explaining Bubble to investors” (2022): Dividend Finance e Comet; blog do Bubble, “Teal” (2021).',
    cena: 'nevoa-suave',
    notes: `Um cartão por passo, com o ano em que o dado foi divulgado.
Passo 1: Dividend Finance, EUA, financiamento solar: mais de US$ 330 milhões captados e mais de US$ 1 bilhão em empréstimos (2022).
Passo 2: Comet, França, marketplace de freelancers: US$ 800 mil de receita no Bubble antes de captar US$ 13 milhões (2022).
Passo 3: Teal, plataforma de carreira: US$ 5 milhões captados com 12 pessoas (2021).
O padrão: o produto foi validado no Bubble antes de existir um time grande de engenharia. É o MVP da Aula 1.
Passo 4: ler a ressalva. São casos que o próprio Bubble escolheu contar, com ano, e não sabemos o que aconteceu com a stack depois.
Ponte: o que vocês já viram na Unidade II.`,
  }),

  // S11
  checklist({
    title: 'S11 · O que a Unidade II trouxe',
    titulo: 'O que a Unidade II trouxe',
    subtitulo: 'Hoje: tudo isso aplicado ao Hackathon No-Code 2026.',
    itens: [
      'Criar a conta e o primeiro app',
      'Navegar no editor',
      'Estruturar o banco a partir do formulário',
      { texto: 'Workflows', detalhe: 'Salvar dados, mostrar confirmação, ligar tela e lógica.' },
    ],
    cena: 'nevoa-esquerda',
    notes: `Um item marcado por passo. Recapitular sem repetir a videoaula.
"Vocês viram os conceitos na Unidade II; hoje vamos usá-los num projeto inteiro, o nosso hackathon."
Se o PDF da Unidade II trouxer outros exemplos, citá-los aqui.
"Se você ainda não assistiu, dá para acompanhar: vou mostrar tudo do zero."
Opcional: "Quem já criou a conta? Escreva 'criei' no chat."
Ponte: e quanto custa fazer tudo isso?`,
  }),

  // S12
  twoColumn({
    title: 'S12 · O que o plano gratuito permite',
    titulo: 'O que o plano gratuito permite',
    topicos: [
      { icone: CircleCheck, titulo: 'Dá para fazer', texto: 'Editor completo, testes em version-test, 50 mil workload units por mês e o AI Agent em beta.' },
      { icone: Lock, titulo: 'Fica para depois', texto: 'Versão live, domínio próprio, publicação nas lojas e mais de um editor.' },
      { icone: CreditCard, titulo: 'Publicar exige plano pago', texto: 'Starter Web a partir de US$ 29 por mês, no plano anual. Tema da Aula 4.' },
    ],
    visual: {
      tipo: 'numero',
      valor: 'US$ 0',
      rotulo: 'para construir e testar tudo o que faremos hoje',
      fonte: 'bubble.io/pricing; 00-PESQUISA-ECOSSISTEMA.md §3.1 (Starter Web US$ 29/mês, anual).',
    },
    cena: 'nevoa-suave',
    notes: `Tudo o que faremos hoje cabe no plano Free.
Passo 1: o que dá para fazer. Workload unit em uma frase: "é a medida de trabalho do servidor que o Bubble cobra; voltamos a ela na Aula 4".
Passo 2: o que fica para depois: versão live, domínio próprio, lojas e mais de um editor.
Passo 3: para publicar, o Starter Web começa em US$ 29 por mês no plano anual.
Aviso: a página de preços abre na aba Web & Mobile, que mostra US$ 59. "Não se assustem."
Miniatura opcional bubble-dashboard-create.png não usada aqui: o número US$ 0 ocupa a coluna direita.
Ponte: o mapa do editor.`,
  }),

  // S13
  showcase({
    title: 'S13 · O mapa do editor',
    titulo: 'O mapa do editor',
    plataforma: 'bubble',
    midia: {
      src: 'media/aula-02/bubble-editor-mapa.png',
      descricao: 'Editor do Bubble com a barra lateral (Design, Workflow, Data) e o property editor à direita',
    },
    url: 'bubble.io/page?id=hackathon-aula02&tab=Design',
    anotacoes: [
      { x: 3, y: 16, titulo: 'Design', texto: 'A página e seus elementos.', zoom: { x: 0, y: 0, w: 45, h: 45 } },
      { x: 3, y: 26, titulo: 'Workflow', texto: 'O que acontece quando alguém faz algo.', zoom: { x: 0, y: 8, w: 45, h: 45 } },
      { x: 3, y: 36, titulo: 'Data', texto: 'O que o app guarda.', zoom: { x: 0, y: 18, w: 45, h: 45 } },
      { x: 86, y: 30, titulo: 'Property editor (2026)', texto: 'Abas Visual, Interaction e Conditional.', zoom: { x: 58, y: 5, w: 42, h: 60 } },
    ],
    fonte: 'Blog e manual do Bubble: property editor.',
    cena: 'paineis',
    notes: `As três abas são as três partes da resposta da aula: Design é a tela, Data é o que lembra, Workflow é o que faz.
Passos 1 a 3: Design, Workflow, Data, com zoom na barra lateral.
Citar de passagem as outras abas (Styles, Plugins, Settings, Logs) sem se demorar.
Passo 4: o property editor redesenhado em 2025, liberado aos poucos. "Appearance virou Visual e Layout virou Interaction."
Recorte do property editor: bubble-property-editor.png (pendente). Enquanto não houver, o zoom do passo 4 mostra a região na captura principal.
Ponte: se é tão completo, por que nem tudo é feito nele?`,
  }),

  // S14
  pause({
    title: 'S14 · Pausa: por que nem tudo é Bubble?',
    pergunta: 'Se o Bubble faz tudo isso, por que nem todo software é feito nele?',
    resposta: 'Código não exportável (lock-in), custo que cresce com o uso e menos controle em escala muito grande.',
    detalhe: 'Ferramenta é escolha, não religião. Na Aula 4 fazemos essa conta com números.',
    segundos: 20,
    chat: 'Se estiver ao vivo, responda no chat.',
    cena: 'nevoa-centro',
    notes: `Ler a pergunta e deixar o anel correr (20 s; tecla T pausa).
Pensar em voz alta enquanto corre: "lembram dos critérios da Aula 1: custo, escalabilidade, integrações, lock-in..."
Se houver respostas no chat, ler uma antes de revelar.
Revelação: o código não sai do Bubble (lock-in); o custo cresce com o uso, porque se paga por workload; e em escala muito grande há menos controle de desempenho.
Aceitar também: dependência de uma empresa, editor só em inglês, requisitos regulatórios.
Ponte: "Agora, o que separa iniciantes de profissionais: começar pelos dados."`,
  }),
];
