import { CircleDollarSign, Database, FilePenLine, Languages } from 'lucide';
import {
  agenda,
  bulletsRich,
  chapter,
  checklist,
  closing,
  code,
  demo,
  pause,
  recap,
  showcase,
  statement,
} from '../../archetypes';
import type { SlideDef } from '../../engine/types';
import { CAPITULOS, TOTAL_CAPITULOS, m } from './comum';

/** Capítulos 7 (Demo 2 no Lovable, S54–S59), 8 (leitura crítica, S60–S63) e 9 (fechamento, S64–S69). */
export const bloco79: SlideDef[] = [
  // ---------------------------------------------------------------- Capítulo 7
  chapter({
    title: 'S54 · Capítulo 07',
    numero: 7,
    total: TOTAL_CAPITULOS,
    titulo: 'Descrever em vez\nde desenhar',
    cena: 'horizonte-avanco',
    notes: `15 s. "Desenhar é uma forma de especificar. A outra é descrever. E é aqui que a inteligência artificial entra."`,
  }),

  statement({
    title: 'S55 · O prompt é uma especificação',
    partes: ['O prompt é uma\nespecificação.', 'Planejamento ruim\ngera prompt ruim.'],
    cena: 'blocos-centro',
    notes: `"Na engenharia de software, especificação é o documento que diz o que o sistema faz, para quem e com que restrições. Um prompt para gerar um app é exatamente isso, escrito em português."
Passo 1: "Planejamento ruim gera prompt ruim. E prompt ruim gera um resultado que parece pronto e não serve para o seu público."
É a frase-síntese que o aluno deve levar desta aula. Fonte: 00-PLANO-GERAL.md §2.3.`,
  }),

  checklist({
    title: 'S56 · Antes de pedir',
    titulo: 'Antes de pedir a uma IA',
    subtitulo: 'Guia de prompts da Lovable: ideias vagas produzem resultados vagos.',
    itens: [
      { texto: 'O que você está construindo?', detalhe: 'Frase-problema e MoSCoW' },
      { texto: 'Para quem?', detalhe: 'Persona e não-público' },
      { texto: 'Por que vão usar?', detalhe: 'Proposta de valor e identidade' },
      { texto: 'Qual é a ação principal?', detalhe: 'CTA e wireframe' },
    ],
    cena: 'nevoa-suave',
    notes: `O guia oficial de prompts da Lovable (docs.lovable.dev/prompting/prompting-one) recomenda planejar antes de pedir, respondendo a quatro perguntas.
Cada passo marca uma pergunta e mostra onde a resposta já está na nossa aula: S37 e S43; S36; S37 e S38; S49 e S53.
"O próprio fabricante da ferramenta pede o que a Unidade I ensinou. Não é coincidência."`,
  }),

  code({
    title: 'S57 · Os dois prompts',
    titulo: 'O prompt planejado, bloco a bloco',
    subtitulo: 'O prompt A tinha uma linha: “Crie uma landing page para um evento.”',
    arquivo: 'prompts-aula-01.txt (prompt B, resumido)',
    linguagem: 'texto',
    codigo: `
      Contexto: validar o Hackathon No-Code 2026,
      online e gratuito, 21 e 22 de novembro.
      Público: iniciantes em tecnologia, no celular.
      Persona: Camila, 22 anos, 1º semestre de ADS.
      Não é para devs experientes.
      Estrutura: siga o wireframe anexado. Título,
      apoio, Nome, E-mail, Telefone, “Quero minha vaga”.
      Identidade: grafite; azul #2F5BFF no botão;
      verde-limão #C6F432 só em detalhes.
      Restrições: sem banco, login ou pagamento.
      Não invente depoimentos nem números.
    `,
    passos: [
      { linhas: '1-2', nota: 'Da frase-problema.' },
      { linhas: '3-5', nota: 'Da persona e do não-público.' },
      { linhas: '6-7', nota: 'Do wireframe e do MoSCoW.' },
      { linhas: '8-9', nota: 'Das cores com função.' },
      { linhas: '10-11', nota: 'Do Won’t: o que não fazer.' },
    ],
    cena: 'vazio',
    notes: `Slide mais denso da aula: conferir legibilidade em 720p no ensaio.
O painel mostra o prompt B resumido; o texto exato (31 linhas) está em prompts-aula-01.txt e é colado na demo.
Um bloco por passo, ligado a uma decisão da aula: contexto e frase-problema; público e persona; estrutura, wireframe e MoSCoW; identidade e S38; restrições e Won't.
O wireframe (wireframe-hackathon-desktop.png) vai anexado ao prompt.
"O prompt B não é longo por enfeite. Cada linha responde a uma decisão que tomamos nesta aula. Dizer à IA o que não fazer é tão importante quanto dizer o que fazer."
Prompts próprios.`,
  }),

  demo({
    title: 'S58 · Demo 2: Lovable',
    plataforma: 'lovable',
    titulo: 'Da especificação à página pronta',
    passos: [
      'Ver o resultado do prompt de uma linha',
      'Gerar com o prompt planejado e o wireframe',
      'Ajustar com um pedido pontual e conferir no celular',
    ],
    duracao: 'Cerca de 9 minutos. Plano gratuito; nada é publicado.',
    url: 'lovable.dev',
    captura: m('lovable-home-prompt.png'),
    capturaDescricao: 'Lovable: tela inicial com o campo de prompt',
    trocas: [
      { passo: 2, captura: m('lovable-gerando.png'), descricao: 'Lovable gerando a página a partir do prompt planejado e do wireframe' },
      { passo: 3, captura: m('lovable-preview-mobile.png'), descricao: 'Preview do Lovable em modo celular, depois do ajuste pontual' },
    ],
    video: {
      src: m('demo-lovable-prompt-planejado.mp4'),
      poster: m('demo-lovable-poster.png'),
      label: 'Backup: Lovable, prompt planejado e ajuste',
    },
    cena: 'paineis',
    notes: `Plano gratuito: cerca de 3 dos 5 créditos do dia (prompt B ~2, ajuste C ~1); ~2 de reserva. Não usar o modo Plan.
A. Aba 2: o projeto do prompt de uma linha, gerado em D−3 (custo zero). Apontar título e botão genéricos, campos errados, conteúdo inventado. Vídeo curto: media/aula-01/demo-lovable-prompt-ruim.mp4 (abrir pelo apresentador).
B. Aba 3: colar o prompt B, anexar wireframe-hackathon-desktop.png, enviar. Narrar: React, TypeScript e Tailwind. O código existe; eu não escrevi. Mais de 3 min: abrir o projeto pré-gerado.
C. Conferir item a item contra o MoSCoW; alternar para celular; preencher com dados fictícios (Ana Teste); recarregar: os dados somem (guardar para S63).
D. Prompt C de ajuste pontual: só a ordem no celular e a largura do botão mudam.
E. Abrir o diálogo de publicar só para mostrar onde seria; NÃO confirmar. Mostrar o saldo de créditos. Apoio: lovable-publicar-dialogo.png.
Plano B, em ordem: projeto pré-gerado; Google AI Studio (Build); tecla V. Nunca esperar mais de 60 s.
Se o resultado ao vivo diferir da abertura: "Mesma especificação, outra execução."
A moldura troca de captura por passo: lovable-home-prompt.png (0 e 1), lovable-gerando.png (2), lovable-preview-mobile.png (3).`,
  }),

  showcase({
    title: 'S59 · As duas páginas, agora com nome',
    titulo: 'Mesma ferramenta. Outra especificação.',
    midia: { src: m('abertura-pagina-a-celular.png'), descricao: 'Página A no celular: gerada a partir do prompt de uma linha' },
    moldura: 'celular',
    rotulo: 'Prompt de uma linha',
    par: {
      midia: { src: m('abertura-pagina-b-celular.png'), descricao: 'Página B no celular: gerada com o prompt planejado e o wireframe' },
      rotulo: 'Prompt planejado + wireframe',
    },
    anotacoes: [
      { x: 50, y: 22, titulo: 'Uma linha', texto: 'A IA preencheu o que eu não disse com o que é mais comum na internet.' },
      { x: 50, y: 22, naPar: true, titulo: 'Vinte minutos de plano', texto: 'Público, prioridades, estrutura, identidade e restrições.' },
    ],
    fonte: 'Captura própria, Lovable, ensaio de D−2.',
    cena: 'paineis',
    notes: `Fecha o laço da abertura (este slide nunca é cortado).
"Na abertura perguntei qual veio de uma linha e por quê. Agora a resposta tem nome."
Passo 1: a página A. A IA preencheu tudo o que eu não disse com o que é mais comum na internet.
Passo 2: a página B teve público, prioridade, estrutura, identidade e restrições. "A ferramenta era a mesma. A especificação, não."
Fallback: se as versões celular faltarem, usar abertura-pagina-a.png e abertura-pagina-b.png (moldura navegador).
Ponte: "Antes de comemorar: o que essa página realmente é?"`,
  }),

  // ---------------------------------------------------------------- Capítulo 8
  chapter({
    title: 'S60 · Capítulo 08',
    numero: 8,
    total: TOTAL_CAPITULOS,
    titulo: 'Leitura crítica',
    cena: 'horizonte',
    notes: `15 s. "Antes de comemorar: o que essa página realmente é?"`,
  }),

  showcase({
    title: 'S61 · Acertou, inventou, esqueceu',
    titulo: 'Acertou, inventou, esqueceu',
    midia: { src: m('abertura-pagina-b.png'), descricao: 'Página B gerada pela IA, para leitura crítica' },
    moldura: 'navegador',
    url: 'pagina-b',
    anotacoes: [
      { x: 20, y: 30, titulo: 'Acertou', texto: 'Estrutura do wireframe, texto do botão, três campos, cores.' },
      { x: 70, y: 55, titulo: 'Inventou', texto: 'Números, depoimentos, patrocinadores que não pedimos.' },
      { x: 30, y: 80, titulo: 'Esqueceu', texto: 'Consentimento, validação, mensagem de erro, texto alternativo.' },
    ],
    fonte: 'Observação própria do ensaio. Atualizar os itens com o que o ensaio produziu.',
    cena: 'nevoa-suave',
    notes: `Uma categoria por passo; o marcador aponta o trecho na página. Ajustar posições e itens depois do ensaio de D−1.
Acertou: estrutura, texto do botão, três campos, cores e tom.
Inventou (mesmo com a restrição, às vezes): "+500 participantes", depoimentos, logos de patrocinadores, prêmio.
Esqueceu (porque não pedimos): consentimento LGPD (Aula 4), validação de e-mail e telefone, mensagem de erro, texto alternativo, contraste do verde.
"A página não foi publicada. Se fosse, o conteúdo inventado seria informação falsa com o nome do evento, e quem publica responde por ela."
"O que a IA esquece é quase sempre o que nós esquecemos de pedir."`,
  }),

  checklist({
    title: 'S62 · Revisar o que a IA entregou',
    titulo: 'Checklist de revisão',
    itens: [
      'Cada item Must está lá?',
      'Apareceu algo que não pedimos?',
      'Os fatos estão certos?',
      'Funciona no celular?',
      'Dá para usar com teclado e bom contraste?',
      { texto: 'O que acontece depois do clique?', detalhe: 'E para onde vão os dados?' },
    ],
    cena: 'nevoa-esquerda',
    notes: `Seis passos rápidos.
2: apague o inventado. 3: data, formato, gratuidade. 5: teclado, contraste e texto alternativo.
Vale para qualquer coisa gerada por IA, inclusive trabalhos da faculdade.
Sugerir que o aluno fotografe o slide, ou use o PDF no AVA. Checklist próprio.`,
  }),

  pause({
    title: 'S63 · O que esta página ainda não faz?',
    pergunta: 'O que esta página ainda não faz?',
    resposta: 'Não guarda nenhuma inscrição. É um protótipo.',
    detalhe: 'Protótipo mostra a ideia. MVP mede. Na Aula 2, no Bubble, a página passa a lembrar.',
    segundos: 20,
    chat: 'Se estiver ao vivo, responda no chat.',
    cena: 'nevoa',
    notes: `Pensar em voz alta: "Lembram do passo C da demo, quando recarreguei a página?" Os dados sumiram.
Outras respostas válidas: não envia e-mail, não bloqueia duplicata, não pede consentimento.
Objeção "e se pedíssemos banco à Lovable?": ela criaria. Mas, para verificar o que uma IA faz com os seus dados, é preciso saber como dados, regras e acessos se constroem. Na Aula 4 o mesmo projeto volta a ser feito por IA.
Ponte: "Vamos amarrar."`,
  }),

  // ---------------------------------------------------------------- Capítulo 9
  agenda({
    title: 'S64 · Capítulo 09 (agenda)',
    titulo: 'Onde estamos',
    secoes: CAPITULOS,
    atual: 8,
    chrome: false,
    cena: 'horizonte',
    notes: `Dizer: "Vamos amarrar." 20 s. Todos os capítulos percorridos; agora, o fechamento.`,
  }),

  recap({
    title: 'S65 · O que levar desta aula',
    titulo: 'O que levar desta aula',
    itens: [
      'No-code elimina a sintaxe, não a lógica.',
      'Cinco famílias; escolha por custo, escala, integrações e lock-in.',
      'Antes de construir: público, problema, o que aprender, MoSCoW.',
      'Wireframe em baixa fidelidade: hierarquia e um objetivo.',
      'O prompt é uma especificação.',
    ],
    cena: 'nevoa-esquerda',
    notes: `Um item a cada 15 s, citando o slide em que nasceu.
1: "Lembram do código lado a lado?" (S08). 2: a constelação e a tabela de critérios (S17, S28).
3: Camila, frase-problema, MoSCoW (S36–S43). 4: o Excalidraw (S53).
5: a IA executa o planejamento que você tem (S55–S59).`,
  }),

  statement({
    title: 'S66 · A resposta',
    partes: ['Entenda. Corte.\nDesenhe. Descreva.', 'Escolha pelos critérios,\nnão pela moda.'],
    apoio: 'A ferramenta muda a cada ano. O planejamento é o que faz qualquer uma servir.',
    cena: 'blocos-centro',
    notes: `Resposta explícita à pergunta central de S04. Ler devagar:
"Como sair de uma ideia e chegar a uma primeira tela que vale a pena construir? Entendendo para quem é; cortando o que não é essencial; desenhando antes de construir; descrevendo com precisão."
Passo 1: "E com qual ferramenta? A que os critérios indicam para a fase em que você está, não a da moda."
Apoio: a ferramenta muda a cada ano; o planejamento é o que faz qualquer uma servir.`,
  }),

  checklist({
    title: 'S67 · Antes da Aula 2',
    titulo: 'Antes de 15/10',
    subtitulo: 'O plano gratuito do Bubble basta. O editor é em inglês; os termos são explicados na aula.',
    itens: [
      { texto: 'Criar conta gratuita em bubble.io', detalhe: 'Plano Free' },
      { texto: 'Criar o app hackathon-seunome' },
      { texto: 'Assistir à Unidade II' },
      { texto: 'Terminar e guardar o seu wireframe' },
      { texto: 'Opcional: o MoSCoW de uma ideia sua', detalhe: 'Pelo menos dois itens em cada coluna' },
    ],
    cena: 'nevoa',
    notes: `Um passo marca cada tarefa.
O comunicado no AVA repete tudo. Quem não conseguir criar a conta acompanha pela gravação.
Fonte do plano Free: bubble.io/pricing (acesso em 04/10/2026).`,
  }),

  bulletsRich({
    title: 'S68 · Perguntas frequentes',
    titulo: 'Perguntas',
    subtitulo: 'Ao vivo: escreva no chat.',
    itens: [
      { icone: CircleDollarSign, titulo: 'Preciso pagar alguma ferramenta?', texto: 'Não. Todas as da disciplina têm plano gratuito suficiente.' },
      { icone: Database, titulo: 'Se a IA gera, por que aprender Bubble?', texto: 'Para guardar dados com regras, e para saber verificar.' },
      { icone: Languages, titulo: 'As ferramentas são em inglês. E agora?', texto: 'Tradução do navegador ajuda; os termos são explicados.' },
      { icone: FilePenLine, titulo: 'Posso usar outro evento no projeto?', texto: 'Pode. A estrutura é a mesma.' },
    ],
    fonte: 'Planos gratuitos conforme pesquisa do ecossistema (§3); Lovable pricing (desconto para estudante). Acesso em 04/10/2026.',
    cena: 'nevoa-suave',
    notes: `Buffer elástico de 3 min. Com alunos, perguntas reais primeiro; com perguntas reais, pular os passos.
Pagar: Excalidraw grátis; Bubble Free basta para as Aulas 2 e 3; Make Free com 1.000 créditos/mês; Lovable com 5 créditos/dia e desconto para estudante com e-mail acadêmico; Google AI Studio grátis.
Bubble: a página de hoje não guarda dados nem tem regras; quem não sabe verificar não pode delegar (tema da Aula 4).
Inglês: cada termo é mostrado em inglês e explicado em português.
Outras do Apêndice C: wireframe no Figma (pode, exige conta); a IA vai acabar com o no-code? (as famílias se misturam; quem especifica e verifica continua).`,
  }),

  closing({
    title: 'S69 · Encerramento',
    frase: 'Hoje a página mostra.\nNa semana que vem,\nela lembra.',
    proxima: { data: 'Quinta, 15 de outubro, 19h', tema: 'Aula 2: Dando vida às telas' },
    contato: 'Slides em PDF e índice da gravação no AVA.',
    notes: `"Hoje a página mostra. Na semana que vem, ela lembra."
Passo 1: próxima aula, quinta, 15 de outubro, às 19h: Dando vida às telas.
Agradecer a quem esteve ao vivo e a quem assiste depois.
Parar a gravação no Meet antes de sair (tecla B deixa a tela preta enquanto encerra).`,
  }),
];
