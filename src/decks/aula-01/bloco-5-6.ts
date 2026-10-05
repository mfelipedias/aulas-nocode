import { MousePointerClick, Quote, Route, SquareMousePointer, TextCursorInput } from 'lucide';
import { agenda, chapter, demo, showcase, stat, twoColumn } from '../../archetypes';
import type { SlideDef } from '../../engine/types';
import { CAPITULOS, TOTAL_CAPITULOS, m } from './comum';

/** Capítulo 5 — UX, UI e anatomia da landing page (S46–S50) e capítulo 6 — Demo 1 no Excalidraw (S51–S53). */
export const bloco56: SlideDef[] = [
  // ---------------------------------------------------------------- Capítulo 5
  chapter({
    title: 'S46 · Capítulo 05',
    numero: 5,
    total: TOTAL_CAPITULOS,
    titulo: 'UX, UI e a anatomia\nde uma landing page',
    cena: 'paineis-amplo',
    notes: `15 s. "Sabemos o que entra. Agora, como isso vira uma tela que a Camila entende em segundos."`,
  }),

  twoColumn({
    title: 'S47 · UI × UX',
    titulo: 'UI é o que se vê. UX é o que se vive.',
    topicos: [
      { icone: SquareMousePointer, titulo: 'UI: a interface', texto: 'Botões, cores, tipografia, disposição.' },
      { icone: Route, titulo: 'UX: a experiência', texto: 'Conseguiu se inscrever? Entendeu? Confiou?' },
      { icone: Quote, titulo: '“Design é como funciona.”', texto: 'Steve Jobs, NYT, 2003. Usabilidade: o quão fácil é usar (Jakob Nielsen, 2012).' },
    ],
    visual: {
      tipo: 'midia',
      moldura: 'navegador',
      url: 'ui-e-ux',
      midia: {
        src: m('ui-ux-esquema.svg'),
        descricao: 'Esquema: à esquerda, os elementos de interface de uma tela; à direita, a jornada chegou, entendeu, confiou, inscreveu-se',
        ajuste: 'conter',
        posicao: 'center',
      },
    },
    cena: 'paineis',
    notes: `Passo 1: UI, a camada visível. O esquema aproxima a tela.
Passo 2: UX, a experiência inteira: a pessoa conseguiu se inscrever? Entendeu? Confiou? Voltaria?
Passo 3: as duas referências da Unidade I. Jobs ao New York Times (Walker, 30/11/2003); Nielsen, NN/g, 04/01/2012.
"Uma tela pode ser linda e ser uma péssima experiência. Se a Camila não acha o botão no celular, a UI pode estar premiada que a UX falhou."`,
  }),

  stat({
    title: 'S48 · 50 milissegundos',
    contexto: 'Quanto tempo uma pessoa leva para julgar o visual de uma página?',
    valor: 50,
    sufixo: ' ms',
    unidades: false,
    descricao: 'e a primeira opinião se mantém quando ela olha por mais tempo. Para decidir se fica: muitas vezes 10 a 20 s.',
    fonte: 'Lindgaard et al., Behaviour & Information Technology, 2006; 10 a 20 s: Nielsen, NN/g, 2011. Fontes antigas e clássicas.',
    cena: 'nevoa',
    notes: `Passo 1: 50 milissegundos, menos que um piscar de olhos.
Lindgaard e colegas (2006): a opinião sobre o apelo visual se forma em cerca de 50 ms e se mantém.
NN/g (2011): usuários costumam abandonar páginas em 10 a 20 segundos; uma proposta de valor clara é o que segura.
Por isso o título e o apoio vêm primeiro: é a "primeira impressão" da Unidade I.
Dizer os anos: fontes antigas, ainda citadas como referência.`,
  }),

  showcase({
    title: 'S49 · Anatomia em cinco partes',
    titulo: 'Anatomia em cinco partes',
    midia: {
      src: m('anatomia-landing.svg'),
      descricao: 'Wireframe esquemático da landing page do evento: título, apoio, imagem, formulário, botão e confirmação',
      ajuste: 'conter',
      posicao: 'center',
    },
    moldura: 'navegador',
    url: 'hackathon-nocode-2026',
    anotacoes: [
      { x: 4, y: 17, titulo: 'Título e apoio', texto: 'A proposta de valor; depois o quê, quando, onde.' },
      { x: 52, y: 17, titulo: 'Imagem', texto: 'Reforça do que se trata.' },
      { x: 4, y: 48, titulo: 'Formulário e CTA', texto: 'Nome, E-mail, Telefone. O botão diz o que a pessoa ganha.' },
      { x: 52, y: 77, titulo: 'E depois do clique?', texto: 'Confirmação ou erro: o estado mais esquecido.' },
    ],
    fonte: 'Unidade I, “Estruturando sua primeira landing page”. Esquema próprio.',
    cena: 'nevoa-suave',
    notes: `As cinco partes: 1 título (a proposta de valor em uma frase); 2 apoio (o quê, quando, onde, em duas linhas); 3 imagem; 4 formulário (Nome, E-mail, Telefone, com rótulos visíveis); 5 CTA (o botão que diz o que a pessoa ganha).
O motor comporta 4 anotações por vitrine: título e apoio dividem o marcador 1; formulário e CTA, o marcador 3.
Passo 4: o estado depois do clique, confirmação ou erro, é o mais esquecido.
"Uma landing page tem um objetivo. Tudo nela conspira para esse objetivo." Um site institucional tem vários caminhos; a landing tem um.`,
  }),

  twoColumn({
    title: 'S50 · Cada palavra e cada campo custam',
    titulo: 'Cada palavra e cada campo custam',
    topicos: [
      { icone: MousePointerClick, titulo: 'O botão', texto: '“Enviar” diz o que o sistema faz. “Quero minha vaga” diz o que a pessoa ganha.' },
      { icone: TextCursorInput, titulo: 'Os campos', texto: 'Expedia, 2010: tirou o campo opcional “Empresa” do pagamento. As pessoas punham o banco e o cartão era recusado.' },
    ],
    visual: { tipo: 'numero', valor: '12 mi', rotulo: 'de dólares a mais de lucro por ano, após remover um único campo (segundo o relato)', fonte: 'The Mary Sue, 2010. Fonte secundária e antiga.' },
    cena: 'nevoa-suave',
    notes: `Passo 1: o botão. "Enviar" descreve o que o sistema faz; "Quero minha vaga", o que a pessoa ganha. CTA: Unidade I.
Passo 2: o caso Expedia. Segundo relato de 2010, as pessoas preenchiam "Empresa" com o nome do banco, depois o endereço do banco, e o pagamento era recusado. Sem o campo, o lucro anual subiu cerca de US$ 12 milhões.
Deixar claro: relato antigo, de fonte secundária.
"É por isso que o nosso formulário tem três campos, e não oito. Cada campo é uma pergunta a mais que a Camila responde no ônibus."
Buffer de 30 s. Pergunta de bolso: "qual foi a última página em que você desistiu de um cadastro?"
Ponte: "Chega de slides por um tempo. Vamos desenhar."`,
  }),

  // ---------------------------------------------------------------- Capítulo 6
  agenda({
    title: 'S51 · Capítulo 06 (agenda)',
    titulo: 'Onde estamos',
    secoes: CAPITULOS,
    atual: 5,
    chrome: false,
    cena: 'horizonte-avanco',
    notes: `Dizer: "Metade da aula. Agora, construir."
20 s. Serve de abertura do capítulo 06 e de "onde estamos" para quem assiste à gravação.
Capítulos 01 a 05 feitos; agora, do papel ao wireframe.`,
  }),

  demo({
    title: 'S52 · Demo 1: Excalidraw',
    plataforma: 'excalidraw',
    titulo: 'Do papel ao wireframe da página de inscrição',
    passos: [
      'Estrutura: título, apoio e imagem',
      'Formulário com Nome, E-mail e Telefone',
      'Botão “Quero minha vaga” e a versão celular',
    ],
    duracao: 'Cerca de 7 minutos. Sem conta, ou papel e caneta.',
    url: 'excalidraw.com',
    captura: m('excalidraw-vazio.png'),
    video: {
      src: m('demo-excalidraw-wireframe.mp4'),
      poster: m('demo-excalidraw-poster.png'),
      label: 'Backup: wireframe no Excalidraw',
    },
    cena: 'paineis',
    notes: `"Agora eu saio dos slides. Se você está ao vivo, abra excalidraw.com: não pede cadastro. Ou pegue o desenho da Unidade I. Se está vendo a gravação, pause e desenhe no seu ritmo."
Trocar para a aba do Excalidraw (tela inteira já compartilhada). Tema escuro, canvas vazio, zoom 125%.
Roteiro (7 min): F frame Desktop; R e T cabeçalho e título com texto real; apoio; imagem com X; 3 campos com rótulo (Alt+arrastar duplica); botão sólido "Quero minha vaga"; 3 destaques; rodapé; anotações de intenção em outra cor; frame Celular com o formulário subindo; Ctrl+Shift+E exporta PNG.
Erros a comentar: começar pela cor, detalhe demais, lorem ipsum, esquecer o celular, botão "Enviar", esquecer o depois do clique.
Plano B: arquivo wireframe-hackathon.excalidraw do ensaio, ou tecla V (vídeo de backup). Passo a passo completo em conteudo.md 6.3.`,
  }),

  showcase({
    title: 'S53 · O wireframe pronto',
    titulo: 'O wireframe pronto',
    plataforma: 'excalidraw',
    midia: { src: m('wireframe-hackathon-desktop.png'), descricao: 'Wireframe desktop da página de inscrição, exportado do Excalidraw no ensaio' },
    moldura: 'navegador',
    url: 'wireframe-hackathon-desktop.png',
    anotacoes: [
      { x: 10, y: 30, titulo: 'Hierarquia', texto: 'Título, apoio, formulário, botão.' },
      { x: 40, y: 70, titulo: 'Um único objetivo', texto: 'A inscrição. Nada de menu.' },
      {
        x: 50,
        y: 30,
        titulo: 'No celular, o formulário sobe',
        texto: 'A ação vem antes da imagem e dos destaques.',
        midia: { src: m('wireframe-hackathon-mobile.png'), descricao: 'Wireframe celular da página de inscrição, exportado do Excalidraw no ensaio', ajuste: 'conter', posicao: 'center' },
      },
    ],
    fonte: 'Captura própria (ensaio). Pause o vídeo e termine o seu.',
    cena: 'paineis',
    notes: `Volta ao deck. O slide não depende do desenho feito ao vivo: são os PNGs exportados no ensaio.
Passo 3: a moldura troca para a versão celular (wireframe-hackathon-mobile.png), inteira e centralizada.
Pergunta-guia da Unidade I: a tela permite a tarefa essencial com o mínimo de esforço e confusão?
"Pause o vídeo e termine o seu."
Buffer de 1 min. Pergunta de bolso: "o que vocês tirariam deste wireframe?"
Ponte: "Desenhar é uma forma de especificar. A outra é descrever."`,
  }),
];
