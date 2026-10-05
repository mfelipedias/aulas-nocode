import { Bot, Braces, Brain, Cpu, Database, Lock, Repeat, ShieldAlert, ShieldCheck, SquareTerminal, TestTube, UserCheck, Workflow, Wrench } from 'lucide';
import { chapter, code, comparison, definition, demo, flow, grid, twoColumn, videoDemo } from '../../archetypes';
import type { SlideDef } from '../../engine/types';
import { media } from './helpers';

/** Capítulo 7: Agentes de código e harness (S47–S56). Claude Code, Codex, Devin e Google só como nome. */
export const bloco7: SlideDef[] = [
  // S47
  chapter({
    title: 'S47 Bloco 7: Agentes e harness',
    numero: 7,
    total: 9,
    titulo: 'Agentes de código\ne harness',
    subtitulo: 'O modelo decide os passos. O software em volta decide o que ele pode fazer.',
    cena: 'grafo-amplo',
    notes: `Abertura do capítulo (15 s). "O meu assunto favorito."
Ponte com o caso Replit da abertura: agora vamos abrir o capô.`,
  }),

  // S48
  comparison({
    title: 'S48 Workflow x agente',
    titulo: 'Workflow ou agente?',
    colunas: [
      { id: 'workflow', nome: 'Workflow', icone: Workflow },
      { id: 'agente', nome: 'Agente', icone: Bot },
    ],
    linhas: [
      {
        criterio: 'Quem decide os passos',
        celulas: ['Quem montou o fluxo', 'O modelo, a cada passo'],
        passo: 1,
      },
      {
        criterio: 'Caminho',
        celulas: ['Definido antes', 'Descoberto no loop'],
        passo: 1,
      },
      {
        criterio: 'Exemplo da disciplina',
        celulas: ['Cenário do Make com IA (Aula 3)', 'Agente de código (hoje)'],
        passo: 2,
      },
      {
        criterio: 'Quando usar',
        celulas: ['Tarefa previsível', 'Tarefa aberta, com verificação'],
        passo: 2,
      },
    ],
    foco: {
      coluna: 'workflow',
      conclusao: 'Se um workflow resolve, use workflow.',
    },
    cena: 'grafo',
    notes: `A Anthropic, que faz os modelos Claude, publicou em dez/2024 uma distinção que virou referência.
Passo 1: no workflow, o modelo e as ferramentas seguem um caminho definido por quem montou. No agente, o modelo decide os próprios passos e as ferramentas, em loop, a partir do que o ambiente devolve.
Passo 2: exemplo. Nosso cenário da Aula 3 (webhook, IA classifica a trilha, planilha, e-mail) é workflow: a IA decide DENTRO de uma caixa. Um agente de código lê o projeto, escolhe o que editar, roda os testes e tenta de novo.
Passo 3: a própria Anthropic recomenda começar pelo mais simples: se um workflow resolve, use workflow.`,
    fonte: 'Anthropic, “Building effective agents”, 19/12/2024 (acesso em 04/10/2026).',
  }),

  // S49
  definition({
    title: 'S49 Agente',
    termo: 'Agente',
    definicao: 'Modelo + instruções + ferramentas, em loop, até cumprir um objetivo ou parar para pedir ajuda.',
    exemplo: {
      titulo: 'O quarto ingrediente',
      texto: 'Verificação: testes, tipos e revisão. É o que separa um brinquedo de uma ferramenta de trabalho.',
    },
    fonte: 'Anthropic, 19/12/2024; Cursor Docs, Agent overview (acesso em 04/10/2026).',
    cena: 'nevoa-centro',
    notes: `Agente = modelo + instruções + ferramentas, rodando em loop, até cumprir um objetivo ou parar para pedir ajuda.
A documentação do Cursor resume em três ingredientes: instruções, ferramentas e modelo.
Passo 1: eu acrescento o quarto, o que separa um brinquedo de uma ferramenta de trabalho: verificação.
Ponte: e onde ficam esses ingredientes? No harness.`,
  }),

  // S50
  flow({
    title: 'S50 O harness',
    titulo: 'O harness em volta do modelo',
    nos: [
      {
        id: 'loop',
        rotulo: 'Loop',
        sub: 'reunir, agir, verificar',
        icone: Repeat,
        col: 0,
        linha: 0,
      },
      {
        id: 'ferramentas',
        rotulo: 'Ferramentas',
        sub: 'ler, editar, rodar, MCP',
        icone: Wrench,
        col: 1,
        linha: 0,
      },
      {
        id: 'contexto',
        rotulo: 'Contexto e memória',
        sub: 'janela, CLAUDE.md',
        icone: Brain,
        col: 2,
        linha: 0,
      },
      {
        id: 'modelo',
        rotulo: 'Modelo',
        sub: 'o motor',
        icone: Cpu,
        tipo: 'gatilho',
        col: 1,
        linha: 1,
      },
      {
        id: 'permissoes',
        rotulo: 'Permissões',
        sub: 'allow e deny; deny vence',
        icone: ShieldCheck,
        col: 0,
        linha: 2,
      },
      {
        id: 'verificacao',
        rotulo: 'Verificação',
        sub: 'testes, tipos, lint',
        icone: TestTube,
        col: 1,
        linha: 2,
      },
      {
        id: 'humano',
        rotulo: 'Humano no circuito',
        sub: 'aprova, interrompe, revisa',
        icone: UserCheck,
        col: 2,
        linha: 2,
      },
    ],
    ligacoes: [
      { de: 'loop', para: 'modelo' },
      { de: 'modelo', para: 'ferramentas' },
      { de: 'modelo', para: 'contexto' },
      { de: 'permissoes', para: 'modelo' },
      { de: 'modelo', para: 'verificacao' },
      { de: 'modelo', para: 'humano' },
    ],
    passos: [['modelo'], ['loop'], ['ferramentas'], ['contexto'], ['permissoes'], ['verificacao'], ['humano']],
    conclusao: 'Checkpoint desfaz arquivos locais. Banco, API e deploy não têm checkpoint.',
    cena: 'nevoa-suave',
    notes: `Slide mais importante do capítulo: não cortar.
Passo 0: o modelo é o motor. Sozinho, um motor não leva ninguém a lugar nenhum. Harness é o software em volta do modelo que o transforma num agente útil (a documentação do Claude Code usa o termo "agentic harness").
Passo 1, loop: reunir contexto, agir, verificar, repetir. Cada resultado alimenta a próxima decisão.
Passo 2, ferramentas: ler e editar arquivos, buscar, rodar comandos, web e, via MCP (Model Context Protocol), outros sistemas. O MCP é um padrão aberto, a "porta USB-C para IA", doado à Agentic AI Foundation da Linux Foundation em 09/12/2025.
Passo 3, contexto e memória: a janela de contexto é a memória de trabalho e enche; o que vale sempre fica num arquivo do projeto (CLAUDE.md). Em tarefas longas: arquivo de progresso, lista de funcionalidades e commits (Anthropic, 26/11/2025).
Passo 4, permissões: modos (só planejar, pedir antes de editar, editar sozinho), listas allow e deny. Deny é avaliado primeiro e vence.
Passo 5, verificação: testes, tipos, lint, revisão. De "parece que funciona" para "eu sei que funciona".
Passo 6, humano no circuito: aprova o plano, interrompe, revisa o diff, decide o que vai para produção.
Passo 7 (frase): checkpoints desfazem arquivos locais; banco, APIs e deploy NÃO têm checkpoint. Foi exatamente onde o caso Replit aconteceu.
Ponte com a Aula 3: o Make é um harness para APIs. As perguntas são as mesmas: o que pode fazer, quem autoriza, como sei que deu certo, quanto custa.`,
    fonte: 'Claude Code Docs, “How Claude Code works” e “Permissions”; Anthropic, 26/11/2025; modelcontextprotocol.io.',
  }),

  // S51
  grid({
    title: 'S51 Agentes de código em 2026',
    titulo: 'Agentes de código',
    cartoes: [
      {
        icone: SquareTerminal,
        titulo: 'Claude Code',
        texto: 'Terminal, IDE, desktop e web; MCP, hooks e subagentes.',
      },
      {
        plataforma: 'cursor',
        titulo: 'Cursor',
        texto: 'Editor com agente. Mais de US$ 4 bi de receita anualizada.',
      },
      {
        icone: Braces,
        titulo: 'OpenAI Codex',
        texto: 'CLI de código aberto, IDE e ambientes na nuvem.',
      },
      {
        plataforma: 'copilot',
        titulo: 'GitHub Copilot',
        texto: 'Issue entra, pull request sai, para revisão.',
      },
      {
        icone: Bot,
        titulo: 'Devin, Jules, Antigravity',
        texto: 'Agentes autônomos e assíncronos; IDE agêntica do Google.',
      },
      {
        plataforma: 'replit',
        titulo: 'Replit Agent',
        texto: 'Do prompt ao app, com checkpoints.',
      },
    ],
    revelar: 'todos',
    fonte: 'Documentação oficial de cada ferramenta (acesso em 04/10/2026); receita do Cursor: SEC 10-Q da SpaceX e Dealroom (secundárias).',
    cena: 'nevoa-suave',
    notes: `Claude Code (Anthropic): terminal, IDE, desktop e web; MCP, hooks, subagentes.
Cursor: editor com agente; mais de US$ 4 bi de receita anualizada (jun/2026).
OpenAI Codex: CLI de código aberto, IDE, app e ambientes na nuvem.
GitHub Copilot cloud agent: recebe uma issue e devolve um pull request para revisão.
Devin (Cognition), Google Jules (assíncrono) e Antigravity (IDE agêntica).
Replit Agent: do prompt ao app, com checkpoints.
Nota de marca: Claude Code, Codex, Devin e Google só pelo nome, sem logo.
Fonte: 00-PESQUISA-ECOSSISTEMA.md, seção 7.`,
  }),

  // S52
  code({
    title: 'S52 Uma tarefa, passo a passo',
    titulo: 'Uma tarefa, passo a passo',
    arquivo: 'terminal: transcrição simplificada e ilustrativa',
    linguagem: 'texto',
    codigo: `
      > Impedir inscrição duplicada por e-mail.
      Plano: teste que falha, regra, migração
      [humano aprova o plano]
      Read   src/lib/inscricao.ts
      Edit   src/lib/inscricao.test.ts      +14
      Bash   npm test     1 falhou, 3 passaram
      Edit   src/lib/inscricao.ts           +8
      Bash   npm test     4 passaram
      Write  migrations/..._email_unico.sql
             (não aplicada)
      Bash   git diff --stat
    `,
    passos: [
      { linhas: '1-3', nota: 'Plano primeiro. Um humano aprova antes de qualquer edição.' },
      { linhas: '4-6', nota: 'O teste falha antes da regra: prova de que ele testa algo.' },
      { linhas: '7-8', nota: 'Implementação mínima e testes verdes.' },
      { linhas: '9-11', nota: 'Migração escrita, não aplicada: o projeto proíbe tocar o banco.' },
    ],
    cena: 'vazio',
    notes: `Transcrição simplificada do que vocês vão ver no vídeo. Tarefa: não permitir duas inscrições com o mesmo e-mail, mesmo com maiúsculas ou espaços diferentes; teste primeiro.
Passo 1: o plano e a aprovação humana.
Passo 2: leu os arquivos, escreveu o teste, rodou: 1 falhou. "O teste falhar primeiro é o que prova que ele testa alguma coisa."
Passo 3: implementou e ficou verde.
Passo 4: a migração escrita e NÃO aplicada, porque a regra do projeto proíbe tocar o banco. No fim, o agente diz: "a migração precisa ser aplicada por você".`,
  }),

  // S53
  demo({
    title: 'S53 Ao vivo: preparar e disparar o agente',
    plataforma: 'claudecode',
    titulo: 'Preparar e disparar o agente',
    passos: ['A memória do projeto: CLAUDE.md', 'As permissões: allow e deny', 'A tarefa em modo de planejamento'],
    duracao: '2 min ao vivo e 3 min de vídeo',
    url: 'terminal: ~/hackathon-lovable',
    captura: media('agente-permissoes.png'),
    video: {
      src: media('v-agente-sessao-acelerada.mp4'),
      label: 'Backup: sessão do agente, acelerada',
    },
    cena: 'paineis',
    notes: `Terminal com a tela limpa antes de compartilhar (sem banner com marca). Pasta clonada do repositório hackathon-lovable; npm test rodando com Vitest.
1 Editor: mostrar o CLAUDE.md. "Isto é a memória do projeto: o que vale em toda sessão." (Nunca executar comandos contra o banco nem deploy; mudança de banco = arquivo de migração; branch nova, sem push.)
2 Mostrar .claude/settings.json: "O que está em deny o agente não faz, mesmo que decida que precisa." (deny: git push, supabase, leitura do .env.)
3 Terminal, modo de planejamento: colar a tarefa (texto completo em conteudo.md, S53). Ler o plano em voz alta: "ele leu os arquivos antes de propor: é o passo reunir contexto do loop."
"Em vez de esperar 15 minutos, vejam a mesma tarefa gravada ontem, acelerada." Ir para o S54.
Se falhar (login, lentidão maior que 40 s, plano estranho): ir direto ao S54. Plano errado ao vivo é conteúdo: "vejam por que existe a aprovação do plano".
Capturas de apoio: agente-claude-md.png, agente-permissoes.png, agente-plano.png (media/aula-04).`,
  }),

  // S54
  videoDemo({
    title: 'S54 A mesma tarefa, acelerada',
    titulo: 'A mesma tarefa, acelerada',
    src: media('v-agente-sessao-acelerada.mp4'),
    poster: media('v-agente-sessao-acelerada.png'),
    descricao: 'Gravação acelerada: plano aprovado, teste vermelho, implementação, testes verdes, migração não aplicada, diff',
    legenda: '0:30 teste vermelho, 1:10 implementação, 2:00 verde, 2:20 migração, 2:40 diff',
    moldura: 'navegador',
    url: 'gravação: sessão do agente, acelerada',
    cena: 'vazio',
    notes: `Passo 1 toca o vídeo (K pausa). Comentar por cima, nesta ordem:
0:00 plano aprovado.
0:30 o teste novo: "Camila.Persona@Example.com " deve valer igual a "camila.persona@example.com". 1 falhou. "Ótimo: o teste pega a falta da regra."
1:10 a implementação: trim() e toLowerCase() antes de comparar.
2:00 testes verdes (Corte G: saltar para cá).
2:20 a migração escrita e não aplicada: índice único em lower(trim(email)). "Essa é a proteção de verdade, no servidor. Quem aplica no banco sou eu, depois de ler."
2:40 git diff: 2 arquivos de código, 1 de migração. Commit numa branch nova, sem push.
Rodapé do vídeo: "Gravado em DD/10/2026, acelerado".
Se o vídeo não carregar: capturas agente-testes-verdes.png e agente-diff.png (media/aula-04).`,
  }),

  // S55
  twoColumn({
    title: 'S55 Os controles que teriam evitado o caso Replit',
    titulo: 'Instrução é pedido. Permissão é regra.',
    topicos: [
      {
        icone: Database,
        titulo: 'Acesso ao banco de produção',
        texto: 'Controle: ambientes separados; o agente só vê o banco de dev.',
        linhas: '10',
      },
      {
        icone: Lock,
        titulo: 'Code freeze só na conversa',
        texto: 'Controle: regra deny ou modo de planejamento, aplicados pelo software.',
        linhas: '8-12',
      },
      {
        icone: ShieldAlert,
        titulo: 'Comando destrutivo sem perguntar',
        texto: 'Controle: o que não está na lista allow pede aprovação.',
        linhas: '3-7',
      },
      {
        icone: TestTube,
        titulo: 'Teste que não refletia a realidade',
        texto: 'Controle: verificação independente, resultado mostrado como saiu.',
        linhas: '4',
      },
    ],
    visual: {
      tipo: 'codigo',
      linguagem: 'json',
      arquivo: '.claude/settings.json',
      codigo: `
        {
          "permissions": {
            "allow": [
              "Bash(npm test)",
              "Bash(git diff *)",
              "Bash(git commit *)"
            ],
            "deny": [
              "Bash(git push *)",
              "Bash(supabase *)",
              "Read(./.env)"
            ]
          }
        }
      `,
    },
    cena: 'nevoa-esquerda',
    notes: `Os quatro pares, um por passo: o que aconteceu no Replit e o controle do harness. O arquivo à direita é o settings.json da demo.
Passo 1: agente com acesso ao banco de produção; controle: ambientes separados, o agente só vê o de dev (linha do supabase no deny).
Passo 2: code freeze dito em conversa, não aplicado; controle: regra deny ou modo só de planejamento, aplicados pelo software, não pela boa vontade do modelo.
Passo 3: comandos destrutivos sem perguntar; controle: aprovação para tudo fora da lista allow.
Passo 4: relatórios de teste que não refletiam a realidade; controle: os testes rodam no harness e o resultado aparece como saiu.
E o "não dá para desfazer": backups e checkpoints, sabendo que ação remota não tem checkpoint.
Frase: instrução é pedido; permissão é regra. Uma conversa não é um mecanismo de segurança.`,
    fonte: 'The Register, 21 e 22/07/2025; Fortune, 23/07/2025; Claude Code Docs, Permissions (acesso em 04/10/2026).',
  }),

  // S56
  grid({
    title: 'S56 O que os dados dizem',
    titulo: 'O que os dados dizem',
    cartoes: [
      {
        tag: 'Stack Overflow, 2025',
        titulo: '84% usam ou vão usar IA',
        texto: '46% desconfiam da precisão; 66% reclamam do “quase certo, mas não exatamente”.',
      },
      {
        tag: 'METR, jul/2025',
        titulo: '19% mais lentos',
        texto: 'Desenvolvedores experientes achavam estar 20% mais rápidos. Retrato daquele momento.',
      },
      {
        tag: 'OpenAI, fev/2026',
        titulo: '~1 milhão de linhas',
        texto: 'Sem código escrito à mão; o trabalho foi projetar o ambiente e a validação.',
      },
    ],
    conclusao: 'O trabalho humano não sumiu. Mudou de lugar.',
    fonte: 'survey.stackoverflow.co/2025/ai; METR, 10/07/2025; OpenAI (Codex), via InfoQ, fev/2026 (secundária).',
    cena: 'nevoa',
    notes: `Um cartão por passo.
1 Stack Overflow Survey 2025: 84% usam ou planejam usar IA; 46% desconfiam da precisão; 66% reclamam de respostas "quase certas"; 31% usam agentes regularmente.
2 METR (10/07/2025): em teste controlado, desenvolvedores experientes ficaram 19% mais lentos com IA, achando que estavam 20% mais rápidos. A própria METR trata o resultado como retrato daquele momento.
3 Na outra ponta: a equipe do Codex relatou ~1 milhão de linhas sem código escrito à mão em ~5 meses; o trabalho foi projetar o ambiente: documentação, restrições, validação automática.
Passo 4: as duas coisas são verdade. Agentes são poderosos quando o harness e a verificação são bem feitos. O trabalho humano não sumiu; mudou de lugar.
Ponte: então, depois de tudo isso: eu deveria ter usado outra coisa?`,
  }),
];
