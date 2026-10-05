import { BadgeCheck, Braces, FileVideo, MessageSquareText, MousePointerClick, PenLine, Plug, SearchCheck, SquareTerminal, Trophy } from 'lucide';
import { chapter, checklist, closing, comparison, grid, pause, recap, stat, statement, timeline, twoColumn } from '../../archetypes';
import type { SlideDef } from '../../engine/types';
import { comRevelacao } from './helpers';

/** Capítulo 8 (avaliação crítica e carreira, S57–S65) e 9 (fechamento da disciplina, S66–S70). */
export const bloco89: SlideDef[] = [
  // S57
  chapter({
    title: 'S57 Bloco 8: Avaliação crítica',
    numero: 8,
    total: 9,
    titulo: 'Eu deveria ter\nusado outra coisa?',
    subtitulo: 'Quatro caminhos, uma matriz de decisão e quatro cenários para treinar.',
    cena: 'horizonte-avanco',
    notes: `Abertura do capítulo (15 s).
"Depois de tudo isso: eu deveria ter usado outra coisa?"`,
  }),

  // S58
  grid({
    title: 'S58 Quatro caminhos',
    titulo: 'Onde cada caminho brilha',
    cartoes: [
      {
        icone: MousePointerClick,
        tag: 'Bubble, Make',
        titulo: 'No-code visual',
        itens: ['Brilha: MVP, interno, automação', 'Cuidado: lock-in, custo com uso'],
      },
      {
        icone: MessageSquareText,
        tag: 'Lovable, v0',
        titulo: 'Construtor por IA',
        itens: ['Brilha: protótipo em minutos', 'Cuidado: segurança não revisada'],
      },
      {
        icone: SquareTerminal,
        tag: 'Claude Code, Cursor',
        titulo: 'Agente de código',
        itens: ['Brilha: evoluir software com testes', 'Cuidado: exige saber verificar'],
      },
      {
        icone: Braces,
        tag: 'Git, equipe',
        titulo: 'Código tradicional',
        itens: ['Brilha: crítico, escala, regulação', 'Cuidado: tempo e custo de equipe'],
      },
    ],
    revelar: 'todos',
    cena: 'nevoa-suave',
    notes: `No-code visual (Bubble, Make, AppSheet): brilha em MVP, ferramentas internas, automações, equipe sem programador. Cuidado: lock-in, custo que cresce com uso, limites do plano.
Construtor por IA (Lovable, Bolt.new, v0): protótipo em minutos, primeira versão, código seu. Cuidado: segurança não revisada, manutenção sem quem entenda o código.
Agente de código (Claude Code, Cursor, Codex): evoluir software existente com testes, equipe que sabe revisar. Cuidado: exige saber verificar; permissões e ambientes bem configurados.
Código tradicional: sistemas críticos, alta escala, regulação, controle total. Cuidado: tempo e custo de equipe.
Ponte: como escolher sem achismo? Uma matriz.`,
  }),

  // S59
  comparison({
    title: 'S59 A matriz de decisão',
    titulo: 'Matriz de decisão: Hackathon No-Code 2026',
    colunas: [
      { id: 'peso', nome: 'Peso', sub: 'de 1 a 3' },
      { id: 'a', nome: 'A', sub: 'Bubble + Make' },
      { id: 'b', nome: 'B', sub: 'Lovable' },
      { id: 'c', nome: 'C', sub: 'Código + agente' },
    ],
    linhas: [
      {
        criterio: 'Prazo da 1ª versão',
        celulas: ['3', '4', '5', '3'],
        passo: 1,
      },
      {
        criterio: 'Custo (120 a 2.000)',
        celulas: ['2', '3', '4', '3'],
        passo: 1,
      },
      {
        criterio: 'Segurança de dados',
        celulas: ['3', '4', '3', '3'],
        passo: 1,
      },
      { criterio: 'Equipe verifica', celulas: ['3', '4', '3', '2'], passo: 1 },
      { criterio: 'Integrações', celulas: ['2', '5', '3', '3'], passo: 2 },
      { criterio: 'Lock-in', celulas: ['1', '2', '4', '5'], passo: 2 },
      {
        criterio: 'Escala além de 2.000',
        celulas: ['1', '3', '3', '4'],
        passo: 2,
      },
    ],
    foco: {
      coluna: 'a',
      conclusao: 'Totais (máx. 75): A 57, B 54, C 45. A matriz não decide: deixa a decisão explícita.',
    },
    cena: 'vazio',
    notes: `Como usar: 5 a 7 critérios; peso de 1 a 3 conforme o que importa NESTE projeto; nota de 1 a 5 para cada opção; some nota x peso.
Passo 1: prazo, custo, segurança de dados pessoais, a equipe consegue manter e verificar.
Passo 2: integrações (e-mail, planilha), lock-in e propriedade (nota alta = menos lock-in), escala além de 2.000.
Passo 3 (foco em A e totais na frase): A 57, B 54, C 45 (máximo 75). para ESTA equipe (iniciantes) e ESTE evento (120 vagas, 48 h), A vence por pouco. Mude um peso e o resultado muda: com alguém que revisa código na equipe, C sobe.
Antes de tudo, a pergunta: já existe pronto? Às vezes a melhor ferramenta é não construir.
Sala vazia: "Pause e preencha a matriz para o seu projeto. É parte do desafio final."
Exceção aprovada: 7 linhas na tabela por ser gabarito (o arquétipo recomenda até 5); o total foi para a frase final para caber.`,
  }),

  // S60
  pause({
    title: 'S60 Cenário 1: hackathon de 48 h',
    pergunta: 'Hackathon de 48 horas: protótipo para a banca. Qual caminho?',
    resposta: 'No-code ou construtor por IA. O prazo domina. Mesmo assim: regra de acesso desde o primeiro minuto.',
    segundos: 15,
    chat: 'Se estiver ao vivo, responda no chat.',
    cena: 'nevoa',
    notes: `Anel de 15 s; a resposta aparece sozinha. Tecla T pausa.
Resposta: no-code ou construtor por IA. O prazo domina e o app é descartável.
Mesmo assim: se coletar dados de pessoas, privacy rule ou RLS desde o primeiro minuto.`,
  }),

  // S61
  pause({
    title: 'S61 Cenário 2: prefeitura',
    pergunta: 'Prefeitura: serviço para 200 mil cidadãos, com login e dados pessoais.',
    resposta: 'Código ou low-code corporativo com governança: auditoria, acessibilidade, contrato de dados.',
    detalhe: 'Agentes, só dentro de um processo com revisão.',
    segundos: 15,
    cena: 'nevoa',
    notes: `Anel de 15 s.
Resposta: código tradicional ou low-code corporativo com governança (OutSystems, Mendix, Power Apps, citados só na fala), com equipe, auditoria, acessibilidade, contrato que diga onde os dados ficam e processo de compra pública.
Agentes podem acelerar a equipe DENTRO de um processo com revisão. Vibe coding sem revisão: não.`,
  }),

  // S62
  comRevelacao(
    stat({
      title: 'S62 Gartner: 40% e 40%',
      contexto: 'Agentes nas empresas: duas previsões do mesmo Gartner.',
      valor: 40,
      sufixo: '%',
      descricao: 'dos apps corporativos terão agentes de IA para tarefas específicas até o fim de 2026 (eram menos de 5% em 2025).',
      fonte: 'Gartner, 26/08/2025; Gartner, 25/06/2025, via Forbes, 07/07/2026 (secundária). Previsões, não medições.',
      cena: 'nevoa-esquerda',
      notes: `Passo 1: o Gartner prevê que 40% dos apps corporativos terão agentes de IA para tarefas específicas até o fim de 2026, contra menos de 5% em 2025 (26/08/2025).
Passo 2: o mesmo Gartner prevê que mais de 40% dos projetos de IA agêntica serão cancelados até o fim de 2027, por custo, valor incerto ou risco mal controlado (25/06/2025, via Forbes).
As duas são compatíveis: vai ter muito agente, e muito agente mal planejado. A diferença é o que fizemos nesta disciplina: planejar, medir custo, controlar acesso e verificar.
São previsões, não medições.`,
    }),
    'Mesmo Gartner: 40%+ dos projetos agênticos cancelados até 2027.',
    'left:120px;top:836px;max-width:1120px',
  ),

  // S63
  pause({
    title: 'S63 Cenário 3: clínica',
    pergunta: 'Clínica: agenda de consultas com dados de saúde.',
    resposta: 'Dado sensível (LGPD, art. 11). Primeiro: comprar antes de construir. Se construir: auditável, acesso por papel.',
    detalhe: 'E registro de quem acessou cada dado.',
    segundos: 15,
    cena: 'nevoa',
    notes: `Anel de 15 s.
Resposta: dado de saúde é dado pessoal sensível (LGPD, art. 5º, II, e art. 11), com regras mais rígidas.
Primeiro: comprar antes de construir. Existe software de agenda médica no mercado, com contrato e controles.
Se construir: low-code ou código auditável, controle de acesso por papel, registro de acessos. Protótipo de IA publicado sem revisão: nunca.`,
    fonte: 'Lei 13.709/2018 (LGPD), art. 5º, II, e art. 11.',
  }),

  // S64
  pause({
    title: 'S64 Cenário 4: RH',
    pergunta: 'RH: controle de férias para 40 funcionários.',
    resposta: 'No-code ou low-code interno, na suíte que a empresa já usa. Lock-in aceitável.',
    detalhe: 'Permissão por papel: cada um vê o seu; o gestor vê a equipe.',
    segundos: 15,
    cena: 'nevoa',
    notes: `Anel de 15 s.
Resposta: no-code ou low-code interno (Power Apps se a empresa usa Microsoft 365; AppSheet se usa Google Workspace; Retool ou Softr). Lock-in aceitável, usuários poucos e conhecidos.
Cuidado: são dados pessoais dos colegas. Permissão por papel: funcionário vê o seu, gestor vê a equipe.
Ponte: e o que isso tudo diz sobre carreira?`,
  }),

  // S65
  twoColumn({
    title: 'S65 Carreiras',
    titulo: 'Os papéis ficam',
    topicos: [
      {
        icone: PenLine,
        titulo: 'Quem especifica (Aula 1)',
        texto: 'Produto, requisitos, product builder.',
      },
      {
        icone: Plug,
        titulo: 'Quem integra (Aulas 2 e 3)',
        texto: 'No-code, automação, Power Platform.',
      },
      {
        icone: SearchCheck,
        titulo: 'Quem verifica (Aula 4)',
        texto: 'QA, segurança, revisão de código gerado por IA.',
      },
      {
        icone: BadgeCheck,
        titulo: 'Quem responde (Aula 4)',
        texto: 'Custo, disponibilidade, LGPD, incidente.',
      },
    ],
    visual: {
      tipo: 'numero',
      valor: '39%',
      rotulo: 'das habilidades centrais mudam até 2030. “IA e big data” é a de crescimento mais rápido.',
      fonte: 'WEF, Future of Jobs Report 2025, cap. 3.',
    },
    cena: 'nevoa-esquerda',
    notes: `Ferramentas mudam todo ano. Os papéis que elas exigem, não.
Passo 1, quem especifica (Aula 1): entende o problema e a pessoa. Analista de requisitos, produto, product builder.
Passo 2, quem integra (Aulas 2 e 3): modela dados e conecta sistemas. No-code e low-code, automação (Make, n8n, Power Automate), Power Platform.
Passo 3, quem verifica (Aula 4): testa, revisa, acha o vazamento antes do outro. QA, segurança de aplicações, revisão de código gerado por IA.
Passo 4, quem responde pelo sistema (Aula 4): custo, disponibilidade, LGPD, incidente.
Número: o WEF estima que 39% das habilidades centrais mudam até 2030; "IA e big data" cresce mais rápido. E o Stack Overflow 2025 mostrou o problema nº 1 de quem usa IA: respostas "quase certas". Quem sabe achar o "quase" vale mais.
Próximos passos de estudo: SQL e modelagem, HTTP e APIs, Git, testes, o básico de segurança (OWASP). Construir em público; participar de um hackathon de verdade.`,
  }),

  // S66
  recap({
    title: 'S66 A pergunta central, respondida',
    titulo: 'A pergunta central, respondida',
    itens: [
      'Publicar: dev separado do live, HTTPS e como voltar.',
      'Seguro: o servidor decide quem vê o quê.',
      'Aguenta e custa: trabalho por usuário × usuários.',
      'Consome: pouco por ação, muito em escala.',
      'Outra coisa? Uma matriz explícita ajuda a decidir.',
    ],
    cena: 'nevoa',
    notes: `Um item por passo.
1 Pronto para publicar: só com uma versão live separada do dev, domínio, HTTPS e um jeito de voltar atrás.
2 Seguro: quando o servidor decide quem vê o quê (privacy rule, RLS), as chaves estão fora do navegador e o formulário cumpre a LGPD.
3 Aguenta e custa: até onde as unidades deixam; o 1º gargalo costuma ser o e-mail ou os créditos. ~US$ 30 a 60/mês até 2.000 inscrições; centenas a 50 mil.
4 Consome: pouco por ação, muito em escala; evento em vez de polling, IA só onde decide.
5 Eu deveria ter usado outra coisa? Depende de prazo, dados, equipe e escala, e a matriz deixa isso explícito.`,
  }),

  // S67
  comRevelacao(
    timeline({
      title: 'S67 O arco das quatro aulas',
      titulo: 'Quatro aulas, quatro paradigmas',
      marcos: [
        {
          data: '08/10',
          cor: 'aula1',
          titulo: 'Aula 1: especificar',
          texto: 'Desenhar e descrever. “O prompt é uma especificação.”',
        },
        {
          data: '15/10',
          cor: 'aula2',
          titulo: 'Aula 2: dados e eventos',
          texto: '“Quando [evento], faça [ação].”',
        },
        {
          data: '22/10',
          cor: 'aula3',
          titulo: 'Aula 3: fluxos',
          texto: '“Gatilho, módulos, mapeamento.” E o app nasce da tabela.',
        },
        {
          data: '29/10',
          cor: 'aula4',
          titulo: 'Aula 4: delegar e verificar',
          texto: '“Quem não sabe verificar não pode delegar.”',
        },
      ],
      cena: 'horizonte',
      notes: `Um marco por passo.
Aula 1 (08/10): especificar desenhando e descrevendo. "O prompt é uma especificação. Planejamento ruim gera prompt ruim." Wireframe e página por IA.
Aula 2 (15/10): programação visual orientada a dados e eventos. "Quando [evento], faça [ação] com [dados], só se [condição]." App Bubble com banco e workflow.
Aula 3 (22/10): fluxos de integração e apps a partir dos dados. Make, planilha, e-mail, app de check-in.
Aula 4 (29/10): desenvolvimento assistido por IA e agentes. App seguro, custo estimado, matriz de decisão.
Passo 5: planejaram, construíram, integraram e avaliaram; e agora sabem quando e como publicar. O ciclo inteiro de um produto, em quatro semanas.
Cada marco acende na cor da sua aula (Ultramar, Violeta, Menta, Âmbar).`,
    }),
    'Planejar, construir, integrar, avaliar e decidir quando publicar.',
    'left:120px;bottom:150px',
  ),

  // S68
  statement({
    title: 'S68 A frase da disciplina',
    partes: ['Quem não sabe verificar', 'não pode delegar.'],
    recuar: false,
    apoio: 'A responsabilidade não vai junto. Ela fica com quem publica.',
    cena: 'blocos-centro',
    notes: `Parte 1 sozinha. Pausa.
Passo 1: "não pode delegar."
Delegar para uma plataforma, para uma IA ou para um agente é ótimo. Mas a responsabilidade não vai junto: ela fica com quem publica.`,
  }),

  // S69
  checklist({
    title: 'S69 Desafio final de portfólio',
    titulo: 'Desafio final, até 21/11/2026',
    subtitulo: 'Sem publicar e sem pagar: tudo cabe nos planos gratuitos que usamos.',
    itens: [
      {
        texto: 'Vídeo de 1 min do app em desenvolvimento',
        detalhe: 'Bubble em version-test ou Lovable no preview, dados fictícios.',
      },
      {
        texto: 'Checklist “pronto para publicar”, 10 itens',
        detalhe: 'Acesso, chaves, HTTPS, LGPD, backup, custo, teste e incidente.',
      },
      { texto: 'Matriz de decisão com pesos justificados' },
      { texto: 'Custo estimado em três escalas' },
      {
        texto: 'README ou post: problema, persona, decisões',
        detalhe: 'O que construiu, o que aprendeu, o que faria diferente.',
      },
    ],
    cena: 'vazio',
    notes: `Opcional, para o portfólio, até 21/11/2026 (data do Hackathon). Um item marcado por passo.
1 Vídeo de 1 minuto do projeto funcionando no ambiente de desenvolvimento, só com dados fictícios. Não é preciso publicar nem pagar nada.
2 Checklist de publicação, que prova que o app está PRONTO para ir ao ar no dia em que você decidir: (1) toda tabela com dado pessoal tem privacy rule ou RLS testada numa aba anônima; (2) páginas de organização exigem login e papel; (3) nenhuma chave secreta no navegador; (4) HTTPS; (5) finalidade, aceite e prazo de exclusão no formulário; (6) só os dados necessários; (7) dev separado do live, backup ou exportação; (8) custo em 3 escalas e alerta de consumo; (9) teste com 5 pessoas, incluindo o caminho de erro; (10) quem responde se cair ou vazar (ANPD em 3 dias úteis).
3 Matriz de decisão com pesos justificados.
4 Estimativa de custo em três escalas.
5 README ou post no LinkedIn: problema, persona, o que construiu, o que aprendeu, o que faria diferente.
O checklist e a matriz vão como tabela copiável no comunicado D+1 do AVA.`,
  }),

  // S70
  closing({
    title: 'S70 Encerramento',
    frase: 'Ferramentas mudam.\nO método fica.',
    tarefas: [
      {
        texto: 'No AVA: gravação com capítulos e PDF do deck',
        icone: FileVideo,
      },
      { texto: 'Desafio final de portfólio até 21/11/2026', icone: Trophy },
      { texto: 'Perguntas? Agora, no chat do Meet', icone: MessageSquareText },
    ],
    contato: 'Obrigado por estas quatro semanas. Dúvidas: fórum da disciplina no AVA.',
    notes: `Frase completa, dita em voz alta: "Ferramenta muda todo ano. Planejar, modelar, integrar, publicar e verificar, não."
Passo 1: "Muito obrigado por estas quatro semanas. A gravação, o PDF do deck e o desafio ficam no AVA. Se você está ao vivo, agora é a hora das perguntas."
Perguntas reais ou o FAQ preparado (conteudo.md, seção 10): preciso pagar para publicar? Bubble ou Lovable? Agentes acabam com o emprego? LGPD em app de colegas? O que estudar agora? A demo de segurança funciona no meu app?
Parar a gravação antes de sair.`,
  }),
];
