import { Database, Gauge, LayoutDashboard, Leaf, Lock, PenLine, Rocket, Smartphone } from 'lucide';
import { agenda, cover, flow, grid, quote, statement, timeline } from '../../archetypes';
import type { SlideDef } from '../../engine/types';
import { comRevelacao } from './helpers';

/** Capítulo 0 (abertura a frio, S01–S04) e capítulo 1 (recap da Unidade IV, S05–S07). */
export const bloco01: SlideDef[] = [
  // S01
  timeline({
    title: 'S01 Julho de 2025: o caso Replit',
    titulo: 'Julho de 2025. Um agente de IA, um app em produção.',
    subtitulo: 'O agente do Replit e o fundador da SaaStr, Jason Lemkin.',
    marcos: [
      {
        data: 'A regra',
        titulo: 'Code freeze',
        texto: 'Nada muda sem autorização. Dito ao agente mais de uma vez.',
      },
      {
        data: 'O comando',
        titulo: 'Banco de produção apagado',
        texto: '1.200+ executivos e 1.190+ empresas.',
      },
      {
        data: 'O disfarce',
        titulo: '~4.000 registros falsos',
        texto: 'E relatórios de teste que não batiam com a realidade.',
      },
      { data: 'A resposta', titulo: '“Não dá para desfazer.”', texto: 'Dava.' },
    ],
    fonte: 'The Register, 21/07/2025; Fortune, 23/07/2025 (acesso em 04/10/2026).',
    cena: 'horizonte-avanco',
    chrome: false,
    notes: `Abertura a frio: a tela já abre aqui, sem capa e sem cumprimento. Câmera ligada.
Passo 0: "Julho de 2025. Jason Lemkin, fundador da SaaStr, passa mais de uma semana construindo um app conversando com o agente de IA do Replit. Ele não programa: o agente escreve, testa e publica."
Passo 1: ele declara um code freeze. Congelamento: nada muda sem autorização. Escreveu isso ao agente mais de uma vez.
Passo 2: o agente rodou comandos mesmo assim e apagou o banco de PRODUÇÃO: mais de 1.200 executivos e mais de 1.190 empresas.
Passo 3: gerou cerca de 4.000 registros falsos e relatórios de teste que não refletiam a realidade.
Passo 4: perguntado se dava para voltar atrás, o agente disse que não. Pausa de 1 s. "Dava."
Frases curtas, 1 s entre marcos, sem adjetivar. Dizer as fontes no fim: The Register e Fortune.
Ponte: "E olhem o que o próprio agente escreveu depois."`,
  }),

  // S02
  comRevelacao(
    quote({
      title: 'S02 A mensagem do agente',
      texto: 'Cometi um erro catastrófico de julgamento.',
      autor: 'Agente de IA do Replit',
      obra: 'a Jason Lemkin (SaaStr), jul/2025. No original: “I made a catastrophic error in judgment.”',
      traducao: true,
      cena: 'nevoa-centro',
      chrome: false,
      notes: `Ler primeiro o original em inglês, devagar: "I made a catastrophic error in judgment." Depois a tradução.
Em outra mensagem, o agente disse que "entrou em pânico" ao ver o banco vazio.
Passo 1 (revelação): o rollback funcionava, os dados foram recuperados.
O CEO do Replit, Amjad Masad, chamou o episódio de inaceitável e anunciou três correções: banco de dev separado do de produção, restauração em um clique e um modo só de planejamento.
Pedir: "guardem essas três correções. Elas voltam no fim da aula, quando a gente abrir o capô de um agente" (S55).
Fontes: Fortune, 23/07/2025; The Register, 22/07/2025.`,
    }),
    'Os dados foram recuperados. O rollback funcionava.',
    'left:50%;bottom:150px;transform:translateX(-50%)',
  ),

  // S03
  statement({
    title: 'S03 Publicar com responsabilidade',
    partes: ['Publicar é fácil.', 'Publicar bem\né o assunto de hoje.'],
    apoio: 'Com responsabilidade: segurança, custo, consumo e o que a IA e os agentes mudaram nisso tudo.',
    cena: 'blocos-centro',
    chrome: false,
    notes: `Parte 1 sozinha: "Publicar é fácil. Hoje, um clique publica um app."
Dois segundos de silêncio.
Passo 1: "Publicar com responsabilidade é o assunto de hoje."
Ponte para a capa: boas-vindas e a promessa da aula.`,
  }),

  // S04
  cover({
    title: 'S04 Capa',
    titulo: 'Publicar, avaliar\ne o que vem depois',
    subtitulo: 'Deploy, segurança, custo, consumo e o que a IA e os agentes mudaram nisso tudo.',
    dataExtenso: 'Quinta, 29 de outubro de 2026',
    notes: `Boas-vindas em 30 s: "Boa noite, eu sou o Marcos, e esta é a Aula 4 de 4 de No-Code Development Platforms: a última."
Ela fica gravada. Para quem assiste depois: o índice de capítulos está no AVA.
Contexto: em três semanas o Hackathon No-Code 2026 ganhou plano, telas, banco, automação e um app de celular.
Promessa: sair sabendo o que é publicar com responsabilidade (de propósito, sem publicar nada: tudo hoje roda em planos gratuitos), achar e fechar um vazamento de dados no próprio app, estimar o custo em três tamanhos e decidir com critério entre no-code, construtor por IA e agente de código.
Ponte: "e vamos fazer isso respondendo a seis perguntas."`,
  }),

  // S05
  agenda({
    title: 'S05 Seis perguntas',
    titulo: 'A pergunta de hoje tem seis partes',
    secoes: [
      { titulo: 'Pronto para publicar?', duracao: 'Publicar' },
      { titulo: 'É seguro?', duracao: 'Segurança' },
      { titulo: 'Aguenta? Quanto custa?', duracao: 'Limites e custo' },
      { titulo: 'Quanto consome?', duracao: 'Sustentabilidade' },
      {
        titulo: 'Eu deveria ter usado outra coisa?',
        duracao: 'IA, agentes, avaliação',
      },
      { titulo: 'E agora?', duracao: 'Fechamento' },
    ],
    cena: 'nevoa-esquerda',
    notes: `Ler as seis perguntas; cada uma é um capítulo.
1 Pronto para publicar? (publicar). 2 É seguro? (segurança). 3 Aguenta? Quanto custa? (limites e custo). 4 Quanto consome? (sustentabilidade).
5 Eu deveria ter usado outra coisa? Dizer que esta ocupa três capítulos: apps por IA, agentes de código e avaliação crítica.
6 E agora? Fechamento da disciplina.
Ponte: antes, um minuto para lembrar o que já construímos.`,
  }),

  // S06
  flow({
    title: 'S06 O projeto até aqui',
    titulo: 'Hackathon No-Code 2026: o que já existe',
    nos: [
      {
        id: 'a1',
        tag: 'Aula 1',
        rotulo: 'Planejamento',
        sub: 'persona, wireframe',
        icone: PenLine,
        col: 0,
        linha: 0,
      },
      {
        id: 'a1b',
        rotulo: 'Página por IA',
        sub: 'não guardava nada',
        plataforma: 'lovable',
        tipo: 'externo',
        col: 0,
        linha: 1,
      },
      {
        id: 'a2',
        tag: 'Aula 2',
        rotulo: 'App no Bubble',
        sub: 'Inscricao, workflow',
        icone: Database,
        tipo: 'gatilho',
        col: 1,
        linha: 0,
      },
      {
        id: 'a2b',
        rotulo: 'Organização',
        sub: 'página com contador',
        icone: LayoutDashboard,
        tipo: 'dado',
        col: 1,
        linha: 1,
      },
      {
        id: 'a3',
        tag: 'Aula 3',
        rotulo: 'Make',
        sub: 'planilha, e-mail, IA',
        plataforma: 'make',
        col: 2,
        linha: 0,
      },
      {
        id: 'a3b',
        rotulo: 'Check-in',
        sub: 'AppSheet + planilha',
        icone: Smartphone,
        col: 2,
        linha: 1,
      },
    ],
    ligacoes: [
      { de: 'a1', para: 'a2', rotulo: 'vira app' },
      { de: 'a1', para: 'a1b', tracejada: true },
      { de: 'a2', para: 'a2b' },
      { de: 'a2', para: 'a3', rotulo: 'webhook' },
      { de: 'a3', para: 'a3b' },
    ],
    passos: [
      ['a1', 'a1b'],
      ['a2', 'a2b'],
      ['a3', 'a3b'],
    ],
    conclusao: 'Tudo em desenvolvimento. Ninguém de fora usou ainda.',
    cena: 'grafo',
    notes: `Não explicar de novo; só lembrar (1 min).
Passo 0: Aula 1, persona Camila, MoSCoW, wireframe e uma página gerada por IA, bonita e que não guardava nada.
Passo 1: Aula 2, no Bubble: o tipo Inscricao, o option set Trilha, o workflow "crie uma inscrição só se o e-mail não existir" e a página de organização com contador.
Passo 2: Aula 3: o Bubble chama um webhook do Make, que grava na planilha, manda o e-mail e pede à IA a mensagem de boas-vindas; o app de check-in (AppSheet) lê a planilha.
Passo 3: a faixa. "Tudo isso roda em desenvolvimento. Ninguém de fora usou ainda."
AppSheet e Planilha Google aparecem só como nome (regra de marca).`,
  }),

  // S07
  grid({
    title: 'S07 A Unidade IV em quatro temas',
    titulo: 'Unidade IV: o que a ementa pede',
    cartoes: [
      {
        icone: Rocket,
        titulo: 'Deploy',
        texto: 'Domínio, ambientes e versionamento.',
      },
      {
        icone: Gauge,
        titulo: 'Limites',
        texto: 'Usuários simultâneos, volume de dados e latência.',
      },
      {
        icone: Lock,
        titulo: 'Segurança',
        texto: 'Autenticação, HTTPS e exposição de dados.',
      },
      {
        icone: Leaf,
        titulo: 'Recursos naturais',
        texto: 'A energia e a água que a computação consome.',
      },
    ],
    revelar: 'todos',
    conclusao: 'E o que a IA e os agentes mudaram em tudo isso.',
    fonte: 'Ementa da disciplina No-Code Development Platforms, Unidade IV.',
    cena: 'nevoa',
    notes: `A ementa pede quatro temas: deploy, limites, segurança e consumo de recursos naturais.
Hoje cada um vira um capítulo, com o nosso projeto no centro.
Passo 1: o acréscimo que a unidade não tinha como prever: o que a IA e os agentes mudaram nisso tudo.
Com alunos (opcional): "escreva no chat qual dos quatro mais te preocupa no seu app." Não esperar.
Ponte: "começando pelo mais óbvio: o que significa, exatamente, colocar no ar?"`,
  }),
];
