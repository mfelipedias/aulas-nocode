import { Bot, Database, FileSpreadsheet, Languages, LayoutTemplate, PlayCircle, SearchX, ShieldCheck, Wallet, Zap } from 'lucide';
import { bulletsRich, chapter, checklist, closing, grid, recap, statement } from '../../archetypes';
import type { SlideDef } from '../../engine/types';
import { TOTAL_BLOCOS } from './cap-0-1';

/** Capítulo 8: fechamento (S57–S63). */

export const cap8: SlideDef[] = [
  // S57
  chapter({
    title: 'S57 · Bloco 8: Fechamento',
    numero: 8,
    total: TOTAL_BLOCOS,
    titulo: 'O que você\nconstruiu hoje',
    subtitulo: 'Juntar as peças e responder à pergunta do começo.',
    notes: `Desacelerar. "Vamos juntar as peças e responder à pergunta do começo."
Ponte: o mapa entre o Bubble e a programação.`,
  }),

  // S58
  grid({
    title: 'S58 · Bubble e programação',
    titulo: 'Bubble e programação: o mesmo raciocínio',
    cartoes: [
      {
        icone: Database,
        tag: 'Dados',
        titulo: 'O que o app lembra',
        itens: ['Data type: tabela / classe', 'Field: coluna / atributo', 'Thing: linha / objeto', 'Option set: enum'],
      },
      {
        icone: LayoutTemplate,
        tag: 'Tela e lógica',
        titulo: 'O que o app faz',
        itens: ['Element: componente de UI', 'Event: listener (onClick)', 'Action: função, INSERT', 'Only when: if'],
      },
      {
        icone: ShieldCheck,
        tag: 'Leitura e acesso',
        titulo: 'O que o app mostra',
        itens: ['Do a search for: SELECT…WHERE', 'Repeating Group: for / map', 'Custom state: variável', 'Privacy rule: RLS'],
      },
    ],
    cena: 'nevoa-suave',
    notes: `"Este é o slide para tirar print." À esquerda de cada linha, o que vocês fizeram no Bubble; à direita, o nome em programação. Um cartão por passo.
Passo 1, dados: data type é tabela ou classe; field é coluna ou atributo; thing é linha ou objeto; option set é enum.
Passo 2, tela e lógica: element é componente; event é listener, como o onClick; action é uma função, um INSERT, um UPDATE; Only when é um if.
Passo 3, leitura e acesso: Do a search for é SELECT com WHERE; Repeating Group é um laço for ou um map; custom state é variável de estado; privacy rule é autorização no servidor, o RLS.
Tudo o que vão estudar em Banco de Dados, Programação e Segurança tem um par aqui. No-code é o mesmo raciocínio com outra interface.
Ponte: cinco coisas para levar.`,
  }),

  // S59
  recap({
    title: 'S59 · Cinco coisas desta aula',
    titulo: 'Cinco coisas desta aula',
    itens: [
      'Dados antes da tela: data type, campos, tipos e relação',
      'A tela conversa com o banco pelos inputs',
      'Workflow: evento, ações e condição',
      'Ler dados: busca e Repeating Group',
      'Acesso: login, papel e privacy rule; o agente acelera, você verifica',
    ],
    cena: 'nevoa',
    notes: `Ler rápido, um por passo; o atual fica claro, os anteriores esmaecem.
Cada item corresponde a um bloco da aula, o que ajuda quem vai revisar pela gravação.
Ponte: a resposta da pergunta do começo.`,
  }),

  // S60
  statement({
    title: 'S60 · Dados, lógica, regras de acesso',
    partes: ['Dados.', 'Lógica.', 'Regras de acesso.'],
    apoio: 'É o que transforma uma página bonita em uma aplicação.',
    recuar: false,
    cena: 'blocos-centro',
    notes: `Resposta explícita da pergunta central. Antes de avançar: "O que transforma uma página bonita em uma aplicação?"
Parte 1: "Dados." Esperar 1 segundo.
Passo 1: "Lógica."
Passo 2: "Regras de acesso." O apoio fecha a frase.
"A página da Aula 1 tinha a camada de fora, a aparência. Hoje ela ganhou as três de dentro."
Ponte: o que preparar para a Aula 3.`,
  }),

  // S61
  checklist({
    title: 'S61 · Antes da Aula 3',
    titulo: 'Antes da Aula 3',
    subtitulo: 'Link do template e PDF desta aula no AVA amanhã.',
    itens: [
      { texto: 'Deixe a inscrição salvando no banco', detalhe: 'Ou reproduza o hackathon-template (somente leitura).' },
      'Crie uma conta gratuita no Make',
      'Tenha uma Conta Google com acesso ao Planilhas',
      { texto: 'Opcional: entre no AppSheet', detalhe: 'Com a mesma Conta Google.' },
      'Assista à Unidade III',
    ],
    cena: 'nevoa-esquerda',
    notes: `Ler devagar: é o slide que mais gera dúvida depois. Um item por passo.
O template é somente leitura: dá para ver cada configuração e reproduzir no próprio app.
Make e Conta Google são pré-requisito da Aula 3; AppSheet é opcional.
Ponte: perguntas que sempre aparecem.`,
  }),

  // S62
  bulletsRich({
    title: 'S62 · Perguntas que sempre aparecem',
    titulo: 'Perguntas que sempre aparecem',
    itens: [
      { icone: Languages, titulo: 'O editor é só em inglês?', texto: 'Sim. A tradução do navegador ajuda; os seus nomes de campo podem ser em português.' },
      { icone: SearchX, titulo: 'Cliquei e nada salvou.', texto: 'Confira os 3 bugs, o App data e o debugger em modo Step-by-step.' },
      { icone: Wallet, titulo: 'Preciso pagar?', texto: 'Não para construir e testar. Para publicar, sim: tema da Aula 4.' },
      { icone: Bot, titulo: 'Posso deixar o agente fazer tudo?', texto: 'Começar, sim. Deixar de conferir, não. Use o checklist do slide 53.' },
    ],
    cena: 'nevoa-suave',
    notes: `Com alunos: responder primeiro as perguntas reais do chat e usar este slide para o que faltar.
Sem alunos: ler os quatro pares, um por passo, com um exemplo cada.
Inglês: a tradução automática pode traduzir nomes de campos e confundir; melhor aprender os vinte termos da aula.
Nada salvou: App data, workflow (botão certo, condição), debugger.
Pagar: Starter Web a partir de US$ 29/mês no anual (bubble.io/pricing, acesso em 04/10/2026).
Reserva: "Por que não usar a planilha do Google como banco?" Planilha não tem tipos fortes, relação nem regra de acesso por linha.
Este bloco absorve atrasos: pode durar de 2 a 6 minutos.
Ponte: o encerramento.`,
  }),

  // S63
  closing({
    title: 'S63 · Encerramento',
    frase: 'Hoje a página lembra.\nSemana que vem, avisa.',
    proxima: { data: 'Quinta, 22 de outubro, 19h', tema: 'Aula 3: Conectando o mundo' },
    tarefas: [
      { texto: 'Crie sua conta gratuita no Make', icone: Zap },
      { texto: 'Tenha uma Conta Google com o Planilhas', icone: FileSpreadsheet },
      { texto: 'Assista à Unidade III', icone: PlayCircle },
    ],
    contato: 'Gravação e PDF desta aula no AVA.',
    notes: `Fala completa: "Hoje a página passou a lembrar. Semana que vem, ela passa a avisar."
Gancho: na Aula 3, cada inscrição vai virar uma linha numa planilha, um e-mail de confirmação e um nome num app de check-in no celular, sem ninguém clicar em nada.
Passo 1: a próxima aula e o que fazer até lá.
"Quinta, 22 de outubro, 19 horas: Conectando o mundo. A gravação e o PDF desta aula ficam no AVA. Obrigado, e até semana que vem."
Parar a gravação (três pontos > Parar gravação) antes de sair do Meet.`,
  }),
];
