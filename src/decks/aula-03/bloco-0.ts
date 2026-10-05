import { agenda, caseStudy, cover, statement, videoDemo } from '../../archetypes';
import type { SlideDef } from '../../engine/types';

/** Capítulo 0: abertura a frio (S01 a S05, 19h00 a 19h04). */
export const bloco0: SlideDef[] = [
  // S01
  statement({
    partes: ['Uma inscrição.', 'Quatro sistemas.', 'Nenhum clique a mais.'],
    cena: 'grafo',
    title: 'Uma inscrição, quatro sistemas',
    notes: `Tirar a tela preta (tecla B). Sem "boa noite" ainda: a aula começa pela cena.
Passo 0: "Uma inscrição." Deixar o grafo montar ao fundo por 2 segundos.
Passo 1: "Quatro sistemas."
Passo 2: "Nenhum clique a mais." Falar: "Alguém acabou de se inscrever no Hackathon No-Code 2026. Uma pessoa, um formulário, um botão. Olhem o que acontece nos próximos 40 segundos."
Ponte: avançar direto para o vídeo, sem pausa.`,
  }),

  // S02
  videoDemo({
    titulo: '40 segundos, sem ninguém clicar',
    src: 'media/aula-03/abertura-cadeia.mp4',
    poster: 'media/aula-03/abertura-cadeia.jpg',
    descricao: 'Tela dividida em 4: formulário no Bubble, nova linha na planilha, e-mail de confirmação e check-in no celular',
    legenda: 'Formulário no Bubble, nova linha na planilha, e-mail de confirmação, check-in no celular.',
    notes: `Passo 1 (um clique) toca o vídeo. K pausa e retoma. V abre em tela cheia.
Narrar por cima, quadro a quadro: "Formulário enviado no Bubble, o app da semana passada. Dois segundos depois, uma linha nova na planilha. Agora o e-mail de confirmação, com um parágrafo escrito por uma IA a partir da ideia que a pessoa contou. E o nome dela já aparece no app de celular que a organização vai usar na porta do evento."
"Ninguém copiou nada de um lugar para outro. Quatro sistemas, de três empresas diferentes, conversando sozinhos."
Fechar: "Hoje vocês vão entender cada peça disso. E no fim da aula eu faço isso ao vivo."
Se o vídeo não carregar: digitar 24 e Enter (mapa do que vamos construir), narrar sobre ele e voltar.
Mídia: abertura-cadeia.mp4 (40 s, sem áudio) e pôster abertura-cadeia.jpg (primeiro quadro). Gravar no D-2.
Ponte: "Isso não é brincadeira de hackathon."`,
  }),

  // S03
  caseStudy({
    empresa: 'Icatu Seguros',
    contexto: 'Seguradora, Brasil',
    plataforma: 'n8n',
    problema: 'Corretores levavam cerca de 5 minutos para cotar um seguro, navegando entre sistemas internos.',
    solucao: 'Assistente no WhatsApp orquestrado no n8n: chama a API de cotação e usa IA para entender o pedido.',
    resultados: [
      { texto: '5 min', rotulo: 'por cotação, antes' },
      { valor: 40, prefixo: '< ', sufixo: ' s', rotulo: 'por cotação, depois' },
      { valor: 1000, sufixo: '+', rotulo: 'corretores por dia' },
    ],
    fonte: 'n8n, estudo de caso Icatu Seguros (acesso em 04/10/2026): de ~5 min para < 40 s (−85%), 7 semanas, 1.000+ corretores/dia.',
    notes: `Passo 0: empresa e problema. "A Icatu Seguros, aqui no Brasil, tinha um problema: uma cotação levava uns cinco minutos navegando em sistema."
Passo 1: a solução. "Montou um assistente no WhatsApp para os corretores. Por baixo, o n8n recebe a mensagem, chama a API interna de cotação e usa uma IA para entender o que o corretor escreveu."
Passo 2: os números contam. "Menos de 40 segundos. Em produção em sete semanas. Mais de mil corretores por dia."
Mensagem: sistemas conversando, com uma IA decidindo no meio do caminho. É o que vamos montar hoje, em escala de hackathon.
Logo da Icatu não é usado (cliente citado só em texto). n8n pelo simple-icons.
Ponte: boas-vindas na capa.`,
  }),

  // S04
  cover({
    titulo: 'Conectando\no mundo',
    subtitulo: 'APIs, webhooks e automação: sistemas que conversam sozinhos, e uma IA que decide no meio do caminho.',
    dataExtenso: 'Quinta, 22 de outubro de 2026',
    cena: 'grafo',
    notes: `Boas-vindas em até 30 segundos: "Boa noite. Eu sou o Marcos, e esta é a Aula 3 de No-Code Development Platforms: Conectando o mundo."
Aviso de gravação: "A aula está sendo gravada. Se você está ao vivo, o chat está aberto e eu leio nos pontos combinados. Se assiste depois, a descrição no AVA tem o índice dos capítulos."
Com alunos: cumprimentar quem chegou pelo nome do chat, numa frase.
O fundo é o grafo de nós: o símbolo desta aula. Cada nó é um sistema; cada pulso, um dado passando.
Ponte: a pergunta central.`,
  }),

  // S05
  agenda({
    titulo: 'Como sistemas conversam?',
    secoes: [
      { titulo: 'O mundo já é conectado', duracao: '6 min' },
      { titulo: 'APIs sem mistério', duracao: '14 min' },
      { titulo: 'Demo: o primeiro fluxo', duracao: '12 min' },
      { titulo: 'O Bubble chama o Make', duracao: '8 min' },
      { titulo: 'Automação de negócio', duracao: '8 min' },
      { titulo: 'Quando a automação decide', duracao: '12 min' },
      { titulo: 'O app nasce da tabela', duracao: '14 min' },
      { titulo: 'O que conectamos hoje', duracao: '12 min' },
    ],
    title: 'Pergunta central e roteiro',
    notes: `Ler a pergunta central devagar, por inteiro: "Como fazer sistemas diferentes conversarem sozinhos, e quando deixar uma IA decidir no meio do caminho?"
Paradigma: "Na Aula 1 a gente especificou desenhando e descrevendo. Na Aula 2, programou com eventos e dados dentro do Bubble. Hoje o paradigma é outro: programar por fluxos. Gatilho, módulos, mapeamento. E, no fim, um aplicativo que nasce de uma tabela, sem desenhar tela nenhuma."
Ler os oito capítulos rapidamente, sem explicar.
Ponte: "Antes de construir, um minuto para entender por que isso vale dinheiro."`,
  }),
];
