import { Blocks, Braces, MessageSquareText, MousePointerClick } from 'lucide';
import {
  agenda,
  bulletsRich,
  chapter,
  code,
  comparison,
  cover,
  grid,
  pause,
  showcase,
  stat,
  statement,
  timeline,
} from '../../archetypes';
import type { SlideDef } from '../../engine/types';
import { CAPITULOS, TOTAL_CAPITULOS, m } from './comum';

/** Capítulo 0 (abertura a frio, S01–S05) e capítulo 1 (o que é no-code, S06–S15). */
export const bloco01: SlideDef[] = [
  // ---------------------------------------------------------------- Capítulo 0 — Abertura a frio
  showcase({
    title: 'S01 · Duas páginas, a mesma IA',
    titulo: 'A mesma IA. A mesma noite.',
    midia: { src: m('abertura-pagina-a.png'), descricao: 'Página de inscrição A, gerada no Lovable (ensaio de D−2)' },
    moldura: 'navegador',
    url: 'pagina-a',
    par: {
      midia: { src: m('abertura-pagina-b.png'), descricao: 'Página de inscrição B, gerada no Lovable (ensaio de D−2)' },
      url: 'pagina-b',
      passo: 1,
    },
    cena: 'paineis',
    chrome: false,
    notes: `Começar sem boas-vindas. Página A entra sozinha, sem rótulo.
"Duas páginas de inscrição para o mesmo evento, geradas pela mesma IA, na mesma noite, por mim."
Comentar o que se vê sem julgar: título, botão, cores, campos.
Passo 1: a página B entra ao lado. "Numa eu escrevi uma linha. Na outra, entreguei vinte minutos de planejamento: para quem é, o que é essencial, como a tela se organiza e com que cara ela deve falar."
Comparar em voz alta: títulos, botões, cores e campos diferentes. Ainda sem dizer qual é qual.
A pergunta fica aberta até S59.
Ponte: a pausa do próximo slide.`,
  }),

  pause({
    title: 'S02 · Qual delas veio de uma linha?',
    pergunta: 'Qual delas veio de um pedido de uma linha? O que te fez perceber?',
    resposta: 'A da esquerda. A da direita recebeu público, prioridades, wireframe e identidade visual.',
    detalhe: 'Até o fim da aula você vai saber explicar a diferença e produzir a melhor.',
    segundos: 15,
    chat: 'Se estiver ao vivo, responda no chat.',
    cena: 'nevoa',
    notes: `Ler a pergunta e pensar em voz alta durante os 15 s: "Eu começaria pelo botão. Depois o título: ele diz para quem é o evento? Depois, o que a página afirma e eu nunca disse."
Tecla T pausa a contagem. A revelação entra sozinha.
"A da esquerda" = página A (primeiro slide); "a da direita" = página B.
Com alunos: ler uma resposta do chat antes da revelação.
Ponte: "Se acertou, ótimo. O importante é o porquê." Boas-vindas na capa.`,
  }),

  cover({
    title: 'S03 · Capa',
    titulo: 'Do problema\nao protótipo',
    subtitulo: 'O ecossistema no-code, como escolher a ferramenta certa e a primeira versão do nosso projeto.',
    dataExtenso: 'Quinta, 8 de outubro de 2026',
    notes: `Deixar os blocos terminarem antes de falar (3 s).
Boas-vindas em 30 s: "Eu sou o Marcos, esta é a primeira de quatro aulas ao vivo de No-Code Development Platforms."
A aula é gravada. Chat aberto, participação opcional. Capítulos marcados para quem assiste depois.
Hoje ninguém precisa instalar nada nem criar conta.
A cena mostra blocos montando uma landing page: é o que vamos construir nas quatro aulas.`,
  }),

  statement({
    title: 'S04 · A pergunta central',
    partes: ['Como sair de uma ideia\ne chegar a uma primeira\ntela que vale a pena\nconstruir?', 'E com qual ferramenta?'],
    cena: 'blocos-centro',
    notes: `Ler devagar: "Como sair de uma ideia e chegar a uma primeira tela que vale a pena construir?"
Passo 1: "E com qual ferramenta?"
"Todo mundo quer responder a segunda primeiro. A primeira decide se a ferramenta vai servir."
Esta pergunta é respondida explicitamente em S66, no fechamento.`,
  }),

  agenda({
    title: 'S05 · Mapa da aula',
    titulo: 'Hoje, em nove capítulos',
    chrome: false,
    secoes: CAPITULOS,
    cena: 'horizonte',
    notes: `Dizer: "Hoje, em nove capítulos." (o título fica na fala: com nove itens, a lista ocupa a tela). Percorrer em 40 s. Os horários servem de índice para quem assiste à gravação (a abertura vai de 00:00 a 04:00).
Ênfase nas duas demos: wireframe no Excalidraw (06) e página gerada por IA (07).
"Primeiro, o que é no-code de verdade e o tamanho desse mercado. Depois, o mapa das ferramentas, com casos reais. O projeto que nos acompanha. Planejamento. Anatomia da landing page. Duas demonstrações. Leitura crítica e fechamento."
Ponte: "Antes de abrir qualquer ferramenta, o vocabulário."`,
  }),

  // ---------------------------------------------------------------- Capítulo 1 — O que é no-code
  chapter({
    title: 'S06 · Capítulo 01',
    numero: 1,
    total: TOTAL_CAPITULOS,
    titulo: 'O que é no-code\n(e o que não é)',
    cena: 'horizonte-avanco',
    notes: `15 s. "Antes de qualquer ferramenta, o vocabulário."`,
  }),

  statement({
    title: 'S07 · Lógica × sintaxe',
    partes: ['No-code não elimina\na lógica.', 'Elimina a sintaxe.'],
    apoio: 'Você continua decidindo dados, regras e fluxos. Só não precisa digitar cada um deles.',
    cena: 'blocos-centro',
    notes: `Primeira parte entra sozinha. Pausa de 2 s.
Pergunta retórica: "Se não tem código, onde mora a lógica?"
Passo 1: a segunda parte responde. "Ela continua lá: quais dados existem, quais regras valem, o que acontece no clique."
"Arrastar um botão e dizer 'quando clicar, salve no banco' é programar, com outra interface."
Ponte: vamos ver a mesma regra escrita das duas formas.`,
  }),

  code({
    title: 'S08 · A mesma regra, duas formas',
    titulo: 'A mesma regra, duas formas',
    subtitulo: 'À direita, a mesma regra em blocos visuais, no estilo do Bubble.',
    arquivo: 'inscricao.js',
    linguagem: 'js',
    codigo: `
      botao.addEventListener("click", () => {
        if (campoEmail.value.trim() === "") {
          mostrarErro("Informe seu e-mail");
          return;
        }
        salvarInscricao({
          nome: campoNome.value,
          email: campoEmail.value,
          telefone: campoTelefone.value,
        });
        mostrarMensagem("Inscrição recebida!");
      });
    `,
    passos: [
      { linhas: 1, nota: 'Quando o botão é clicado' },
      { linhas: '2-5', nota: 'Só se o E-mail não estiver vazio' },
      { linhas: '6-10', nota: 'Passo 1: criar uma nova Inscrição' },
      { linhas: 11, nota: 'Passo 2: mostrar a mensagem' },
    ],
    cena: 'nevoa-suave',
    notes: `Ler as duas colunas na mesma linha. Cada passo acende o trecho do código e o bloco visual correspondente.
Passo 1: "quando clicar" está nas duas.
Passo 2: "se o e-mail estiver vazio, pare" está nas duas.
Passos 3 e 4: salvar a inscrição e mostrar a mensagem.
A lógica é idêntica; muda quem escreve a sintaxe. A coluna da direita é o que vamos montar no Bubble na Aula 2.
Antecipar o mito "no-code é só para coisas simples": a lógica é a mesma; muda o teto de controle (volta em S14).
Exemplo próprio.`,
  }),

  bulletsRich({
    title: 'S09 · Três definições',
    titulo: 'Três jeitos de não escrever o código',
    itens: [
      { icone: MousePointerClick, titulo: 'No-code', texto: 'Construir software configurando componentes visuais, em vez de escrever código-fonte.' },
      { icone: Blocks, titulo: 'Low-code', texto: 'Visual, com trechos de código quando o visual não alcança. Termo criado pela Forrester em 2014.' },
      { icone: MessageSquareText, titulo: 'App por IA', texto: 'Você descreve; a IA escreve o código. O código existe, você só não o escreveu.' },
    ],
    fonte: 'Low-code: Forrester, 2014 (Clay Richardson e John Rymer), via CIO Dive e Smartsheet (fontes secundárias).',
    cena: 'nevoa-esquerda',
    notes: `Uma definição por passo.
No-code: telas, dados e fluxos configurados visualmente.
Low-code: o termo nasceu na Forrester em 2014, quando os analistas perceberam que essas plataformas quase sempre exigiam algum código.
App por IA: enfatizar que o código existe, e alguém responde por ele: quem pediu. Volta na leitura crítica (capítulo 08) e na Aula 4.
Ponte: a vontade de construir sem programar é bem mais antiga que a IA.`,
  }),

  timeline({
    title: 'S10 · A ideia é antiga (1979–2014)',
    titulo: 'Construir sem programar: uma ideia de quase 50 anos',
    marcos: [
      { data: '1979', titulo: 'VisiCalc', texto: 'A planilha: lógica sem programador.' },
      { data: '1987', titulo: 'HyperCard', texto: 'Apps feitos com cartões e botões.' },
      { data: '1991', titulo: 'Visual Basic', texto: 'Arrastar o botão, escrever só o clique.' },
      { data: '2003', titulo: 'WordPress', texto: 'Sites publicados sem HTML.' },
      { data: '2011–2013', titulo: 'Zapier, Bubble, Webflow', texto: 'A geração que deu nome ao no-code.' },
      { data: '2014', titulo: 'Low-code ganha nome', texto: 'A Forrester batiza o mercado.' },
    ],
    fonte: 'Wikipedia (VisiCalc, HyperCard, Visual Basic, WordPress); Zapier 2011, Bubble 2012, Webflow 2013: pesquisa do ecossistema; Forrester: CIO Dive.',
    cena: 'horizonte',
    notes: `Uma frase por marco.
1979: a planilha foi o primeiro no-code de massa: milhões escrevendo fórmulas, ou seja, lógica, sem se chamar de programadores.
1987: HyperCard, da Apple. 1991: Visual Basic, o "visual + um pouco de código".
2003: WordPress. 2011–2013: automação, apps completos e sites profissionais.
2014: o mercado ganha nome e passa a ser medido.
"A vontade é antiga; o que muda é até onde dá para ir."`,
  }),

  timeline({
    title: 'S11 · A aceleração (2022–2026)',
    titulo: 'De décadas para meses',
    marcos: [
      { data: '30/11/2022', titulo: 'ChatGPT', texto: 'Linguagem natural vira interface, inclusive para gerar código.' },
      { data: '02/02/2025', titulo: 'Vibe coding', texto: 'Andrej Karpathy batiza o termo num post.' },
      { data: '16/10/2025', titulo: 'Bubble AI Agent', texto: 'O no-code visual e a IA se encontram.' },
      { data: 'nov/2025', titulo: 'Palavra do ano', texto: '“Vibe coding” é a palavra do ano do dicionário Collins.' },
      { data: 'ago/2026', titulo: 'Lovable', texto: 'Avaliada em US$ 13,3 bi. Empresa de 2023 que gera apps por conversa.' },
    ],
    fonte: 'OpenAI, 30/11/2022; Karpathy (X), 02/02/2025; BusinessWire, 16/10/2025; Collins, nov/2025; TechCrunch, 12/08/2026.',
    cena: 'horizonte-avanco',
    notes: `Comparar a distância entre os marcos dos dois slides: de 1979 a 2014 são décadas; de 2022 a 2026, meses.
Vibe coding: programar descrevendo e aceitando o que a IA gera, sem olhar o código.
Lovable: avaliada em US$ 13,3 bilhões em agosto de 2026.
"Vocês entram na área no meio dessa aceleração: é bom, e exige critério."`,
  }),

  stat({
    title: 'S12 · 80% fora da TI',
    contexto: 'Em 2026, quem estará construindo com ferramentas low-code?',
    valor: 80,
    sufixo: '%',
    descricao: 'dos usuários de tecnologias low-code estarão fora dos departamentos de TI. Em 2021, eram 60%.',
    fonte: 'Gartner, previsão publicada em dez/2022, via InfoWorld. Previsão, não medição.',
    cena: 'nevoa',
    notes: `Ler a pergunta e deixar a grade vazia por um instante.
Passo 1: o número conta e a grade acende, 80 de cada 100.
"Analistas, gente de marketing, de RH, empreendedores, professores. E vocês."
Dizer em voz alta: previsão de dez/2022, lida via InfoWorld porque a página do Gartner é fechada. Previsão não é medição.
Ponte: e quanto vale esse mercado?`,
  }),

  grid({
    title: 'S13 · Quanto vale o mercado',
    titulo: 'Quanto vale esse mercado? Depende de quem mede.',
    cartoes: [
      { tag: 'Gartner, 2022', titulo: 'US$ 44,5 bi', texto: 'Tecnologias low-code, em 2026.' },
      { tag: 'Gartner, 2025', titulo: 'US$ 58,2 bi', texto: 'Tecnologias low-code, em 2029.' },
      { tag: 'Mordor Intelligence, 2025', titulo: 'US$ 26,3 bi a 67,1 bi', texto: 'Plataformas low-code, de 2025 a 2030.' },
    ],
    conclusao: 'Cada consultoria define o mercado de um jeito. Pergunte quem mediu e o que contou.',
    fonte: 'Gartner via InfoWorld (dez/2022, antiga); Gartner, 04/11/2025, via Kissflow (secundária); Mordor Intelligence via PR Newswire.',
    cena: 'nevoa-suave',
    notes: `Um cartão por passo.
"Três números, três tamanhos. Cada consultoria define 'o mercado' de um jeito: umas somam só plataformas, outras incluem automação de processos e ferramentas para não programadores."
Não decorar o número: a direção é dezenas de bilhões de dólares por ano, crescendo dois dígitos ao ano.
Último passo: a lição de método. Pergunte quem mediu e o que contou.`,
  }),

  comparison({
    title: 'S14 · Quatro jeitos de construir software',
    titulo: 'Quatro jeitos de construir software',
    colunas: [
      { id: 'nocode', nome: 'No-code', icone: MousePointerClick, sub: 'Bubble, Glide' },
      { id: 'lowcode', nome: 'Low-code', icone: Blocks, sub: 'OutSystems, Mendix' },
      { id: 'ia', nome: 'Apps por IA', icone: MessageSquareText, sub: 'Lovable, v0' },
      { id: 'codigo', nome: 'Código', icone: Braces, sub: 'VS Code, Git' },
    ],
    linhas: [
      {
        criterio: 'Como se constrói',
        celulas: ['Arrastando e configurando', 'Visual + trechos de código', 'Descrevendo em texto', 'Escrevendo cada linha'],
        passo: 1,
      },
      {
        criterio: 'Quem costuma usar',
        celulas: ['Negócio, iniciantes', 'Times de TI', 'Qualquer pessoa, com revisão', 'Desenvolvedores'],
        passo: 1,
      },
      {
        criterio: 'Velocidade até o 1º protótipo',
        celulas: [
          { nivel: 4, rotulo: 'Horas' },
          { nivel: 3, rotulo: 'Dias' },
          { nivel: 4, rotulo: 'Minutos a horas' },
          { nivel: 1, rotulo: 'Semanas' },
        ],
        passo: 2,
      },
      {
        criterio: 'Controle e flexibilidade',
        celulas: [
          { nivel: 2, rotulo: 'Limitado à plataforma' },
          { nivel: 3, rotulo: 'Alto' },
          { nivel: 2, rotulo: 'Depende do que a IA gera' },
          { nivel: 4, rotulo: 'Total' },
        ],
        passo: 2,
      },
      {
        criterio: 'Dependência da plataforma',
        celulas: ['Alta', 'Média a alta', 'Média', 'Baixa'],
        passo: 3,
      },
    ],
    foco: {
      coluna: 'nocode',
      conclusao: 'Não existe o melhor. Existe o adequado para o problema, o prazo e o orçamento.',
    },
    cena: 'nevoa-suave',
    notes: `Cabeçalho primeiro: as quatro colunas em 20 s. Classificação própria, qualitativa.
Passo 1: como se constrói e quem usa.
Passo 2: velocidade × controle. Os medidores mostram uma troca, não um ranking: quem ganha velocidade cede controle.
Passo 3: dependência da plataforma (lock-in). Só antecipar: o caso Airtable tem slide próprio no capítulo 02 (S27).
Passo 4: moldura no no-code e a frase-síntese. "Vocês vão usar os quatro ao longo da carreira, às vezes no mesmo projeto."`,
  }),

  pause({
    title: 'S15 · Uma semana para testar',
    pergunta: 'Você tem uma semana para descobrir se alguém se inscreveria no seu evento. Qual dos quatro caminhos você escolhe?',
    resposta: 'No-code, ou IA com revisão. Na primeira versão, aprender rápido vale mais que controle total.',
    detalhe: 'MVP é a menor entrega que gera aprendizado validado (Eric Ries). Escala e flexibilidade entram na conta depois que a ideia provar valor.',
    segundos: 20,
    chat: 'Se você está ao vivo, escreva sua escolha no chat.',
    cena: 'nevoa',
    notes: `Ler a pergunta e ficar em silêncio. A contagem roda sozinha (20 s); a resposta aparece no fim. Tecla T pausa.
Pensar em voz alta eliminando caminhos: "Uma semana. Código do zero não cabe. Low-code exige equipe e licença. Sobram no-code e IA."
Com alunos: ler uma ou duas escolhas do chat. "Código" não está errado; só não cabe na semana.
Fonte do detalhe: Ries, A Startup Enxuta (2011).
"Guardem: isso volta no capítulo 04 com nome e sobrenome: MVP."
Ponte: "Falei 'no-code' como se fosse uma coisa só. Não é."`,
  }),
];
