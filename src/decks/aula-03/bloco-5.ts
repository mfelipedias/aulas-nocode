import {
  Bell,
  CheckCheck,
  ListOrdered,
  RefreshCw,
  RotateCcw,
  Save,
  SkipForward,
  Split,
  Undo2,
  UserRoundCheck,
  Webhook,
  Workflow,
  Replace,
} from 'lucide';
import { bulletsRich, caseStudy, chapter, comparison, flow, grid, pause } from '../../archetypes';
import type { SlideDef } from '../../engine/types';

/** Capítulo 5: Automação de negócio (S34 a S42, 19h44 a 19h52). */
export const bloco5: SlideDef[] = [
  // S34
  chapter({
    numero: 5,
    total: 8,
    titulo: 'Automação de\nnegócio',
    subtitulo: 'Padrões, rotas, erros e custo: o que as empresas fazem com isso.',
    cena: 'grafo-amplo',
    notes: `Transição de 10 segundos. Marcador 44:00.
"Temos um fluxo funcionando. Agora, o que as empresas fazem com isso, quanto custa e o que acontece quando dá errado."`,
  }),

  // S35
  grid({
    titulo: 'Três padrões que pagam salários',
    cartoes: [
      { icone: Bell, titulo: 'Notificação', texto: 'Algo aconteceu, avise alguém. Exemplo: inscrição confirmada por e-mail.' },
      { icone: CheckCheck, titulo: 'Aprovação', texto: 'Alguém decide antes de seguir. Exemplo: mentor aprova a equipe antes da vaga.' },
      { icone: RefreshCw, titulo: 'Sincronização', texto: 'O mesmo dado em dois lugares. Exemplo: presença no app volta para a planilha.' },
    ],
    fonte: 'Ementa da disciplina No-Code Development Platforms, tópico 3.',
    notes: `Os três padrões da ementa, um exemplo do hackathon em cada. Um cartão por passo.
Passo 1: notificação. Nosso e-mail de confirmação.
Passo 2: aprovação. Um mentor aprova a equipe antes de liberar a vaga na trilha de IA.
Passo 3: sincronização. A presença marcada no app volta para a planilha: vocês vão ver no capítulo 7.
"Calendário e CRM entram do mesmo jeito: são só outros módulos. Um evento no Google Agenda para a abertura; um contato no CRM para quem pediu patrocínio."
Ponte: como o fluxo escolhe um caminho.`,
  }),

  // S36
  flow({
    titulo: 'Filtros e rotas: o if do fluxo',
    nos: [
      { id: 'webhook', rotulo: 'Webhook', sub: 'nova inscrição', icone: Webhook, tipo: 'gatilho', col: 0, linha: 1 },
      { id: 'router', rotulo: 'Router', sub: 'divide em rotas', icone: Split, col: 1, linha: 1 },
      { id: 'mentoria', rotulo: 'Avisar a mentoria', sub: 'rota 1', icone: UserRoundCheck, col: 2, linha: 0 },
      { id: 'espera', rotulo: 'Lista de espera', sub: 'rota 2', icone: ListOrdered, col: 2, linha: 1 },
      { id: 'normal', rotulo: 'Fluxo normal', sub: 'rota 3', icone: Workflow, col: 2, linha: 2 },
    ],
    ligacoes: [
      { de: 'webhook', para: 'router' },
      { de: 'router', para: 'mentoria', rotulo: 'trilha = IA' },
      { de: 'router', para: 'espera', rotulo: 'inscritos ≥ 120' },
      { de: 'router', para: 'normal', rotulo: 'as demais' },
    ],
    passos: [['webhook', 'router'], ['mentoria'], ['espera'], ['normal']],
    conclusao: 'Filtro é o if. Router é o switch. Mesma lógica de programação, desenhada.',
    title: 'Filtros e rotas',
    notes: `Passo 0: webhook e router. "Vocês já viram o filtro. O router divide o fluxo em rotas, e cada rota tem seu filtro."
Passo 1: rota 1, trilha igual a IA: avisa a mentoria.
Passo 2: rota 2, inscritos já chegaram a 120: lista de espera em vez de confirmar. (Um Google Sheets Search Rows conta as linhas antes do router: só no cenário pronto.)
Passo 3: rota 3, todas as outras: fluxo normal.
Passo 4: "Filtro é o if. Router é o switch." No Make, o filtro fica na linha entre os módulos.
Conferir no D-1, no History, se o filtro consome crédito (a documentação conta cada módulo executado) e ajustar a fala do S38.
A miniatura make-router.png do storyboard não cabe no arquétipo flow: mostrar o router do cenário pronto se sobrar tempo.
Ponte: e quando um módulo falha?`,
  }),

  // S37
  bulletsRich({
    titulo: 'Quando dá errado (e vai dar)',
    subtitulo: 'Nomes de 2026: Ignore virou Skip e Break virou Retry. Tutoriais antigos usam os nomes velhos.',
    itens: [
      { icone: RotateCcw, titulo: 'Retry', texto: 'Guarda a execução incompleta e tenta de novo.' },
      { icone: SkipForward, titulo: 'Skip', texto: 'Ignora o erro e segue com os próximos.' },
      { icone: Replace, titulo: 'Resume', texto: 'Usa um valor substituto e continua.' },
      { icone: Save, titulo: 'Commit', texto: 'Para e mantém o que já foi feito.' },
      { icone: Undo2, titulo: 'Rollback', texto: 'Para e desfaz o que der para desfazer.' },
    ],
    fonte: 'Make Help, Error handlers; Make Community, Error handlers update (2026). Acesso em 04/10/2026.',
    notes: `"Toda integração falha um dia. O Google pisca, um campo vem vazio, a API do outro lado sai do ar."
No Make: botão direito no módulo, Add error handler.
Um handler por passo. Destacar a mudança de nomes de 2026: cuidado com tutorial antigo.
Passo 1: Retry (antes Break). Passo 2: Skip (antes Ignore). Passos 3 a 5: Resume, Commit, Rollback.
"Para o hackathon: Retry no módulo da planilha. Se o Google piscar, a inscrição não se perde, fica guardada para tentar de novo. Em código, seria um try/catch com nova tentativa."
A captura make-error-handler.png do storyboard não cabe neste arquétipo; o menu aparece na demo, se houver tempo.
Ponte: quanto custa.`,
  }),

  // S38
  comparison({
    titulo: 'O mesmo fluxo, três jeitos de cobrar',
    colunas: [
      { id: 'make', nome: 'Make', sub: 'crédito' },
      { id: 'zapier', nome: 'Zapier', sub: 'tarefa' },
      { id: 'n8n', nome: 'n8n', sub: 'execução' },
    ],
    linhas: [
      { criterio: 'Unidade', celulas: ['Crédito por módulo', 'Tarefa por ação', 'Execução do fluxo'], passo: 1 },
      { criterio: 'O gatilho conta?', celulas: ['Sim, até checagem vazia', 'Não', 'Não (conta a execução)'], passo: 1 },
      { criterio: '120 inscrições', celulas: ['≈ 360 créditos', '240 tarefas', '120 execuções'], passo: 2 },
      { criterio: 'Plano gratuito', celulas: ['1.000 créditos, 2 cenários', '100 tarefas, 2 passos', 'Self-host grátis'], passo: 2 },
    ],
    foco: { coluna: 'make', conclusao: 'Ninguém é mais barato sempre: depende do formato do fluxo.' },
    notes: `"Agora custo, porque cada plataforma conta diferente."
Passo 1: unidade e gatilho. Make: crédito por módulo executado, inclusive o gatilho. Zapier: tarefa por ação bem-sucedida; gatilho e filtro não contam. n8n: execução do fluxo inteiro.
Passo 2: as 120 inscrições e o plano gratuito. Make: cerca de 360 créditos (3 módulos), cabe no Free. Zapier: 240 tarefas, mas o Free tem 100 tarefas e Zaps de 2 passos: não caberia. n8n: 120 execuções; Community Edition grátis no seu servidor (a nuvem é só trial).
Passo 3: foco no Make (a ferramenta da aula) e a frase.
"Com IA, o Make soma créditos por tokens: vamos medir no capítulo 6."
Estimativas do professor: o número real é o do History. Conferir no D-1 se o filtro consome crédito.
Logos não aparecem no cabeçalho (o arquétipo comparison só aceita ícones).
Ponte: dois casos reais.`,
    fonte: 'Make Help, Credits; Zapier Help, task usage; n8n.io/pricing. Estimativas do professor. Acesso em 04/10/2026.',
  }),

  // S39
  caseStudy({
    empresa: 'FranklinCovey',
    contexto: 'Treinamento corporativo',
    plataforma: 'make',
    problema: 'Um processo anual de RH levava 30 dias e um barramento de integração de 15 anos ligava as áreas.',
    solucao: 'Make conectando RH, finanças, operações e vendas, automatizando as ferramentas que já existiam.',
    resultados: [
      { texto: '30 dias', rotulo: 'processo anual de RH, antes' },
      { valor: 2, sufixo: ' h', rotulo: 'o mesmo processo, depois' },
      { prefixo: 'US$ ', valor: 60, sufixo: ' mil', rotulo: 'por ano em software evitado' },
    ],
    fonte: 'Make, success story FranklinCovey, 30/09/2025 (acesso em 04/10/2026).',
    notes: `Passo 0: empresa e problema. "A FranklinCovey, empresa de treinamento corporativo."
Passo 1: a solução. "Usa o Make para ligar RH, finanças, operações e vendas."
Passo 2: os números. "Um processo anual de RH caiu de 30 dias para 2 horas. E eles evitaram comprar um software de 60 mil dólares por ano, porque automatizaram as ferramentas que já tinham."
"O processo era o mesmo. O tempo, não."
Corte D (menos 1 min 40 s): fundir este caso e o próximo numa frase cada.
Logo da FranklinCovey não é usado (cliente citado só em texto).
Ponte: "E não é só empresa pequena."`,
  }),

  // S40
  caseStudy({
    empresa: 'Vodafone',
    contexto: 'Telecomunicações, Reino Unido',
    plataforma: 'n8n',
    problema: 'A operação de segurança precisa tratar bilhões de eventos por mês, com muito trabalho repetitivo.',
    solucao: '33 workflows no n8n desde ago/2024, automatizando etapas da resposta de segurança.',
    resultados: [
      { prefixo: '£ ', valor: 2.2, casas: 1, sufixo: ' mi', rotulo: 'em custos evitados' },
      { valor: 5000, sufixo: '+', rotulo: 'dias de trabalho poupados' },
      { valor: 33, rotulo: 'workflows desde ago/2024' },
    ],
    fonte: 'n8n, estudo de caso Vodafone (acesso em 04/10/2026).',
    notes: `Passo 0: "E não é só empresa pequena."
Passo 1: "A Vodafone usa o n8n na segurança: 33 workflows desde agosto de 2024, processando bilhões de eventos por mês."
Passo 2: "Resultado declarado: 2,2 milhões de libras em custos evitados e mais de 5 mil dias de trabalho poupados."
Logo da Vodafone não é usado (cliente citado só em texto).
Ponte: então, qual escolher?`,
  }),

  // S41
  comparison({
    titulo: 'Qual escolher?',
    colunas: [
      { id: 'make', nome: 'Make' },
      { id: 'zapier', nome: 'Zapier' },
      { id: 'n8n', nome: 'n8n' },
      { id: 'pa', nome: 'Power Automate' },
    ],
    linhas: [
      { criterio: 'Ponto forte', celulas: ['Canvas visual, várias rotas', 'Mais apps, mais simples', 'Controle, código, self-host', 'Microsoft 365 e RPA'], passo: 1 },
      { criterio: 'Onde roda', celulas: ['Nuvem', 'Nuvem', 'Nuvem ou seu servidor', 'Nuvem e desktop'], passo: 1 },
      {
        criterio: 'Curva de aprendizado',
        celulas: [
          { nivel: 2, rotulo: 'Média' },
          { nivel: 1, rotulo: 'Baixa' },
          { nivel: 3, rotulo: 'Alta' },
          { nivel: 2, rotulo: 'Média' },
        ],
        passo: 2,
      },
      { criterio: 'Bom para', celulas: ['MVP com fluxo ramificado', 'Ligar 2 apps rápido', 'Dado sensível, alto volume', 'Empresa que já é Microsoft'], passo: 2 },
    ],
    foco: { coluna: 'make', conclusao: 'Para o hackathon, Make. Mas escolha pelo contexto, não pela marca.' },
    notes: `Passo 1: ponto forte e onde roda. Make: canvas visual, ótimo para lógica com várias rotas. Zapier: o mais simples e com mais apps. n8n: controle total, aceita código, roda no seu servidor. Power Automate: para a empresa que já vive no Microsoft 365, e ainda automatiza o desktop (RPA).
Passo 2: curva de aprendizado e "bom para". Dizer: os medidores são avaliação minha, não pesquisa.
Passo 3: foco no Make e a frase. Gancho para o critério de lock-in da Aula 1: quanto mais da sua lógica mora numa plataforma, mais caro é sair dela.
Ponte: pausa para pensar.`,
    fonte: 'Avaliação do professor; características nas páginas oficiais. Acesso em 04/10/2026.',
  }),

  // S42
  pause({
    pergunta: 'Hackathon de 48 h com 120 inscrições. E um banco com dados de clientes. Mesma ferramenta?',
    resposta: 'Hackathon: Make ou Zapier, rápido e barato. Banco: n8n auto-hospedado ou a plataforma corporativa.',
    detalhe: 'O dado do banco não pode sair de casa. A Icatu, do começo da aula, usa o n8n Enterprise.',
    segundos: 25,
    chat: 'Se estiver ao vivo, responda no chat.',
    notes: `Ler a pergunta e pensar em voz alta durante o anel de 25 s: "O que pesa mais em cada caso: velocidade ou onde o dado fica?"
Com alunos: ler respostas do chat antes da revelação.
Gabarito: hackathon, Make ou Zapier. Banco, algo como n8n auto-hospedado ou a plataforma corporativa já aprovada, porque o dado não pode sair de casa. Citar a Icatu (n8n Enterprise).
Tecla T pausa a contagem.
Ponte: "Até aqui, o fluxo só executa. Agora, um fluxo que decide."`,
  }),
];
