import {
  BadgeCheck,
  Database,
  Globe,
  KeyRound,
  LayoutTemplate,
  ListChecks,
  LogIn,
  MonitorSmartphone,
  MousePointerClick,
  Plug,
  Server,
  Shield,
  ShieldCheck,
  Smartphone,
  Store,
  User,
  UserCheck,
  WandSparkles,
} from 'lucide';
import { bulletsRich, chapter, checklist, code, comparison, demo, flow, grid, pause, showcase, statement, twoColumn } from '../../archetypes';
import type { SlideDef } from '../../engine/types';
import { TOTAL_BLOCOS } from './cap-0-1';

/** Capítulo 6 (Quem pode ver o quê, S41–S48) e capítulo 7 (Bubble AI Agent, S49–S56). */

export const cap67: SlideDef[] = [
  /* ------------------------- Capítulo 6: quem pode ver o quê ------------------------- */

  // S41
  chapter({
    title: 'S41 · Bloco 6: Quem pode ver o quê',
    numero: 6,
    total: TOTAL_BLOCOS,
    titulo: 'Quem pode\nver o quê',
    subtitulo: 'A terceira parte da resposta: regras de acesso.',
    cena: 'paineis-amplo',
    notes: `"A terceira parte da resposta: regras de acesso. Sem elas, o que construímos é perigoso."
Ponte: o erro clássico de quem esconde em vez de proteger.`,
  }),

  // S42
  statement({
    title: 'S42 · Esconder não é segurança',
    partes: ['Esconder um botão\nnão é segurança.', 'Segurança é o\nservidor dizer não.'],
    cena: 'blocos-centro',
    notes: `Erro clássico de iniciante, e de muito app feito por IA: esconder a página ou o link e achar que os dados estão protegidos.
Passo 1: "Segurança é o servidor dizer não."
Tudo o que chega ao navegador pode ser lido por quem souber apertar F12 e abrir as ferramentas do desenvolvedor.
Ponte: três palavras que não são sinônimos.`,
  }),

  // S43
  twoColumn({
    title: 'S43 · Autenticação, autorização, papel',
    titulo: 'Três palavras que não são sinônimos',
    topicos: [
      { icone: KeyRound, titulo: 'Autenticação: quem é você?', texto: 'Cadastro e login: Sign the user up e Log the user in.', realce: ['login'] },
      { icone: ShieldCheck, titulo: 'Autorização: o que você pode?', texto: 'Privacy rules, aplicadas no servidor do Bubble.', realce: ['regra', 'dados'] },
      { icone: BadgeCheck, titulo: 'Papel: que tipo de usuário?', texto: 'Um dado no User: o campo organizador (yes/no).', realce: ['papel'] },
    ],
    visual: {
      tipo: 'fluxo',
      nos: [
        { id: 'login', rotulo: 'Portaria', sub: 'login', icone: LogIn, tipo: 'gatilho', col: 0, linha: 0 },
        { id: 'papel', rotulo: 'Crachá', sub: 'papel', icone: BadgeCheck, col: 1, linha: 0 },
        { id: 'regra', rotulo: 'Sala', sub: 'privacy rule', icone: ShieldCheck, col: 2, linha: 0 },
        { id: 'dados', rotulo: 'Inscricao', sub: 'dados', icone: Database, tipo: 'dado', col: 2, linha: 1 },
      ],
      ligacoes: [
        { de: 'login', para: 'papel' },
        { de: 'papel', para: 'regra' },
        { de: 'regra', para: 'dados' },
      ],
    },
    cena: 'nevoa-suave',
    notes: `Analogia do evento presencial: autenticação é mostrar o documento na portaria; o papel é o crachá; a autorização é a sala que esse crachá abre.
Passo 1: autenticação, "quem é você?": Sign the user up e Log the user in.
Passo 2: autorização, "o que você pode?": as privacy rules, no servidor.
Passo 3: papel, "que tipo de usuário você é?": o campo organizador no User.
No nosso evento há dois papéis: visitante, que se inscreve, e organizador, que vê a lista.
O papel é só um dado: tudo continua começando no banco.
Fonte dos nomes das ações: manual do Bubble, "Account".
Ponte: o caminho que o organizador faz.`,
  }),

  // S44
  flow({
    title: 'S44 · O caminho do organizador',
    titulo: 'O caminho do organizador',
    nos: [
      { id: 'abre', rotulo: 'Abre a página', sub: '/organizacao', icone: Globe, tipo: 'gatilho', col: 0, linha: 0 },
      { id: 'carrega', tag: 'Only when', rotulo: 'Page is loaded', sub: 'confere o papel', icone: MonitorSmartphone, col: 1, linha: 0 },
      { id: 'login', rotulo: 'Go to page login', sub: 'redirecionamento', icone: LogIn, col: 2, linha: 0 },
      { id: 'entra', rotulo: 'Log the user in', sub: 'e-mail e senha', icone: KeyRound, col: 3, linha: 0 },
      { id: 'lista', rotulo: 'Lista aparece', sub: 'volta à organizacao', icone: ListChecks, tipo: 'dado', col: 3, linha: 1 },
    ],
    ligacoes: [
      { de: 'abre', para: 'carrega' },
      { de: 'carrega', para: 'login', rotulo: 'não é org.' },
      { de: 'login', para: 'entra' },
      { de: 'entra', para: 'lista' },
      { de: 'carrega', para: 'lista', rotulo: 'já é org.', tracejada: true },
    ],
    passos: [['abre', 'carrega'], ['login', 'entra'], ['lista']],
    conclusao: 'Isso é experiência de uso. Roda no navegador: sozinho, não protege nada.',
    cena: 'nevoa-suave',
    notes: `Os seis nós em três grupos.
Passo 0: o organizador abre /organizacao. Quando a página carrega, Only when Current User is logged out ou Current User's organizador is no.
Passo 1: se não for organizador (ou não estiver logado), vai para a página login e entra com Log the user in.
Passo 2: volta para /organizacao (Go to page organizacao) e a lista aparece. A seta tracejada: quem já é organizador vê a lista direto.
Passo 3: a síntese. O redirecionamento é ótimo para a experiência de uso: manda a pessoa ao lugar certo. Mas roda no navegador.
Ponte: onde está a proteção de verdade.`,
  }),

  // S45
  flow({
    title: 'S45 · Onde cada regra roda',
    titulo: 'Onde cada regra roda',
    nos: [
      { id: 'banco', tag: 'Servidor', rotulo: 'Banco', sub: 'todas as inscrições', icone: Database, tipo: 'dado', col: 0 },
      { id: 'privacy', tag: 'Servidor', rotulo: 'Privacy rules', sub: 'obedecem às regras', icone: Server, tipo: 'gatilho', col: 1 },
      { id: 'nav', tag: 'Navegador', rotulo: 'Página aberta', sub: 'obedece a você', icone: MonitorSmartphone, tipo: 'externo', col: 2 },
      { id: 'tela', tag: 'Navegador', rotulo: 'Telas e botões', sub: 'redirect, Conditional', icone: MousePointerClick, tipo: 'externo', col: 3 },
    ],
    ligacoes: [
      { de: 'banco', para: 'privacy' },
      { de: 'privacy', para: 'nav', rotulo: 'permitido' },
      { de: 'nav', para: 'tela' },
    ],
    passos: [['nav', 'tela'], ['banco', 'privacy']],
    conclusao: 'Se a regra diz não, o dado nem chega ao navegador.',
    cena: 'nevoa-suave',
    notes: `Passo 0: o navegador. Redirecionamento, condições da aba Conditional, botão escondido: tudo isso obedece a você, e qualquer um pode mexer nele.
Passo 1: o servidor do Bubble. As privacy rules são aplicadas antes de o dado sair do servidor.
Passo 2: a síntese. Se a regra diz não, o dado nem chega ao navegador.
Para quem é de ADS: é o equivalente ao Row Level Security de bancos como o PostgreSQL, segurança na linha, no banco.
Gancho: na Aula 4 vamos ver um app com esse erro e corrigir.
Fonte: manual do Bubble, "Privacy rules".
Ponte: como isso aparece no editor.`,
  }),

  // S46
  showcase({
    title: 'S46 · Privacy rules da Inscricao',
    titulo: 'Privacy rules da Inscricao',
    plataforma: 'bubble',
    midia: {
      src: 'media/aula-02/bubble-privacy-regra.png',
      descricao: 'Aba Data, Privacy: regra Organizador e regra Everyone else no data type Inscricao',
    },
    url: 'bubble.io/page?id=hackathon-aula02&tab=Data&subtab=Privacy',
    anotacoes: [
      { x: 20, y: 18, titulo: 'Antes: Publicly visible', texto: 'Sem regra, qualquer visitante recebe todos os campos.', zoom: { x: 0, y: 0, w: 55, h: 45 } },
      { x: 55, y: 40, titulo: 'Regra Organizador', texto: "When Current User's organizador is yes: tudo liberado.", zoom: { x: 25, y: 20, w: 60, h: 50 } },
      { x: 55, y: 72, titulo: 'Everyone else', texto: 'Só Find this in searches. O e-mail só como Constraint.', zoom: { x: 25, y: 50, w: 60, h: 50 } },
    ],
    fonte: 'Manual do Bubble, “Privacy rules”.',
    cena: 'paineis',
    notes: `Data > Privacy mostra cada data type como "Publicly visible" ou "Privacy rules applied".
Passo 1: hoje a Inscricao está Publicly visible. (Captura do estado anterior: bubble-privacy-antes.png, pendente; pode substituir esta no PDF.)
Passo 2: regra Organizador. Quando o usuário atual for organizador, pode tudo: encontrar nas buscas e ver todos os campos.
Passo 3: Everyone else. Só encontrar nas buscas, sem ver nenhum campo; o e-mail fica como Constraint: dá para buscar por ele, mas não para lê-lo.
Por quê? O contador de vagas e a checagem de duplicidade precisam contar e buscar, mesmo sem login.
Conferir no ensaio se o comportamento de Constraint se mantém na conta da aula (risco R4 do plano).
Ponte: mini-demo, na ordem certa.`,
  }),

  // S47
  demo({
    title: 'S47 · Mini-demo: protegendo a organização',
    plataforma: 'bubble',
    titulo: 'Mini-demo: protegendo a organização',
    passos: ['Ver o problema numa janela anônima', 'Criar a privacy rule', 'Redirecionar e entrar como organizador'],
    duracao: 'Cerca de 4 min 30 s',
    url: 'hackathon-aula02.bubbleapps.io/version-test/login',
    esquema: { titulo: 'Área da organização', campos: ['E-mail', 'Senha'], botao: 'Entrar' },
    video: {
      src: 'media/aula-02/demo3-login-privacy.mp4',
      poster: 'media/aula-02/demo3-login-privacy.jpg',
      label: 'Backup: mini-demo de login e privacy rules',
    },
    cena: 'paineis',
    notes: `A ordem importa: primeiro o vazamento, depois a regra no servidor, só no fim o redirecionamento. Assim fica provado que a proteção não depende da tela.
1. Janela anônima > version-test/organizacao: a lista inteira aparece. "Sem login, sem nada."
2. Data > Privacy > Inscricao > New rule "Organizador" (When Current User's organizador is yes, tudo marcado). Everyone else: só Find this in searches; email com Constraint.
Recarregar a janela anônima: linhas vazias, contador continua. "Ninguém mexeu na página. O servidor parou de entregar."
3. Página organizacao > Page is loaded > Only when logged out ou organizador is no > Go to page login. Entrar como organizador (credenciais só no monitor 2, nunca ditas nem mostradas).
Se Constraint não existir (risco R4): deixar Everyone else vazio e mostrar o efeito colateral: o contador zera. "Segurança tem custo."
Plano B: tecla V abre demo3-login-privacy.mp4.
Ponte: a mesma página, dois usuários.`,
  }),

  // S48
  comparison({
    title: 'S48 · A mesma página, dois usuários',
    titulo: 'A mesma página, dois usuários',
    colunas: [
      { id: 'visitante', nome: 'Visitante', icone: User, sub: 'sem login' },
      { id: 'organizador', nome: 'Organizador', icone: UserCheck, sub: 'organizador = yes' },
    ],
    linhas: [
      { criterio: 'Abre /organizacao', celulas: ['É levado ao login', 'Vê a página'], passo: 1 },
      { criterio: 'Contador de inscrições', celulas: ['Vê', 'Vê'], passo: 1 },
      { criterio: 'Nomes, e-mails, telefones', celulas: ['Não recebe do servidor', 'Vê'], passo: 2 },
      { criterio: 'Pode se inscrever', celulas: ['Sim', 'Sim'], passo: 3 },
    ],
    foco: { coluna: 'visitante', conclusao: 'A tela é a mesma. O que o servidor entrega, não.' },
    cena: 'nevoa-suave',
    notes: `Passo 1: abrir a página e o contador. O visitante é levado ao login; se der um jeito de abrir, vê o contador.
Passo 2: ler com ênfase: o visitante não "deixa de ver", ele nem recebe os dados pessoais.
Passo 3: os dois podem se inscrever: a segurança não quebrou a regra de negócio.
Passo 4: moldura no visitante e a síntese.
Ainda falta muito para um evento de verdade: consentimento da LGPD, quem pode apagar, registro de acesso. Isso é a Aula 4.
Miniatura opcional bubble-organizacao-visitante.png: pode entrar no PDF.
Ponte: "E se, em vez de clicar tudo isso, eu pedisse para uma IA?"`,
  }),

  /* ------------------------- Capítulo 7: construir conversando ------------------------- */

  // S49
  chapter({
    title: 'S49 · Bloco 7: Construir conversando',
    numero: 7,
    total: TOTAL_BLOCOS,
    titulo: 'Construir\nconversando',
    subtitulo: 'Fizemos à mão para entender. Agora, um agente de IA, e a leitura do que ele fez.',
    cena: 'blocos',
    notes: `"Fizemos tudo à mão para entender. Agora vamos pedir a um agente de IA e ler o que ele fez."
Os blocos ao fundo se montam sozinhos, sem cursor.
Ponte: o que é o Bubble AI Agent.`,
  }),

  // S50
  bulletsRich({
    title: 'S50 · Bubble AI Agent',
    titulo: 'Bubble AI Agent',
    subtitulo: 'Beta, gratuito. Lançado em out/2025; mobile e APIs desde ago/2026.',
    itens: [
      { icone: LayoutTemplate, titulo: 'Telas, workflows e data types', texto: 'Cria e edita, dentro do mesmo editor visual que usamos hoje.' },
      { icone: Shield, titulo: 'Privacy rules automáticas', texto: 'Gera regras de acesso junto com os dados. Precisam ser lidas.' },
      { icone: Plug, titulo: 'APIs, plugins e correções', texto: 'Conecta APIs, instala plugins e corrige problemas do issue checker.' },
      { icone: WandSparkles, titulo: 'Abre pela varinha', texto: 'Na barra superior; aceita voz e vários chats. Tem as suas permissões no app.' },
    ],
    fonte: 'BusinessWire, 16/10/2025; blog do Bubble, 04/08/2026 (beta, free to use); manual do Bubble, “Bubble AI Agent”.',
    cena: 'nevoa',
    notes: `Lançado em outubro de 2025, segundo o próprio Bubble, como o primeiro agente para desenvolvimento visual. Desde agosto de 2026 também constrói apps mobile e conexões de API.
Um item por passo.
Diferença para a Aula 1: lá, a IA gerou uma página em código que não editamos visualmente. Aqui, tudo o que o agente faz fica nas mesmas abas que acabamos de usar. Dá para conferir.
Detalhe do manual que importa: o agente tem as mesmas permissões que você no app.
A captura do painel do agente (bubble-ai-agent-painel.png) aparece no slide da demo, na moldura do navegador.
Ponte: como pedir.`,
  }),

  // S51
  code({
    title: 'S51 · Dois pedidos, um de cada vez',
    titulo: 'Dois pedidos, um de cada vez',
    arquivo: 'Bubble AI Agent, novo chat',
    linguagem: 'texto',
    codigo: `
      Prompt 1
      Crie um data type Equipe com os campos
      nome (text), trilha (option set Trilha) e
      membros (lista de Inscricao). Cada equipe pode
      ter no máximo 4 membros. Antes de aplicar,
      explique o que vai criar, incluindo as
      privacy rules.

      Prompt 2
      Crie uma página equipes com um Repeating
      Group de Equipe mostrando nome, trilha e a
      quantidade de membros.
    `,
    passos: [
      { linhas: '2-5', nota: 'Termos do Bubble e tipos explícitos. O limite de 4 é uma armadilha: onde vai parar?' },
      { linhas: '5-7', nota: 'Explicar antes de aplicar obriga o agente a mostrar o plano.' },
      { linhas: '9-12', nota: 'Só depois de conferir o primeiro: um recurso por pedido.' },
    ],
    cena: 'vazio',
    notes: `Os prompts usam os nomes do nosso banco, porque o manual do Bubble recomenda a terminologia dele, um recurso por pedido e detalhes explícitos.
Passo 1: termos do Bubble e tipos de campo. "No máximo 4" é uma armadilha didática: um limite de quantidade não é um tipo de campo. Veremos onde o agente o coloca.
Passo 2: pedir a explicação antes é deliberado: obriga o agente a mostrar o plano, inclusive as privacy rules.
Passo 3: o segundo pedido, só depois de conferir o primeiro.
Texto exato dos prompts em conteudo.md, 7.1, copiado no bloco de notas do monitor 2.
Fonte: manual do Bubble, "Bubble AI Agent" (dicas de prompt).
Ponte: agora, com o agente.`,
  }),

  // S52
  demo({
    title: 'S52 · Demo: o agente constrói a Equipe',
    plataforma: 'bubble',
    titulo: 'Agora, com o agente',
    passos: ['Pedir a Equipe', 'Ler o plano antes de aplicar', 'Inspecionar dados, regras e página'],
    duracao: 'Cerca de 5 minutos, no app irmão hackathon-agente',
    url: 'bubble.io/page?id=hackathon-agente',
    captura: 'media/aula-02/bubble-ai-agent-painel.png',
    video: { src: 'media/aula-02/demo4-ai-agent.mp4', poster: 'media/aula-02/demo4-ai-agent.jpg', label: 'Backup: demo do Bubble AI Agent' },
    cena: 'paineis',
    notes: `Dizer em voz alta que a demo roda num app irmão, hackathon-agente, cópia do ponto em que paramos. É prudência com qualquer agente, não desconfiança da plataforma.
1. Varinha na barra superior > novo chat (+) > colar o Prompt 1. Enquanto responde: "ele está lendo a estrutura do app".
2. Ler o plano em voz alta. O tipo de membros é lista de Inscricao? Mencionou privacy rules? O que disse sobre o máximo de 4? Aprovar.
3. Inspecionar: Data types > Equipe; Privacy > Equipe (quem vê o quê?); onde ficou o limite de 4. Prompt 2: página equipes, Repeating Group, Current cell's Equipe's membros:count.
Comentários possíveis: relação do outro lado ("ele decidiu por mim"); limite ignorado ("regra de negócio precisa de condição num workflow"); coisas a mais ("é por isso que estamos no app irmão").
Se o agente não responder em 90 s: tecla V abre demo4-ai-agent.mp4.
Ponte: o checklist de leitura.`,
  }),

  // S53
  checklist({
    title: 'S53 · Leia o que o agente fez',
    titulo: 'Leia o que o agente fez',
    itens: [
      { texto: 'Os tipos dos campos estão certos?', detalhe: 'membros é lista de Inscricao?' },
      { texto: 'A relação está do lado que você queria?' },
      { texto: 'Que privacy rules ele gerou?', detalhe: 'Quem vê o quê, campo por campo.' },
      { texto: 'Onde ficou a regra do máximo de 4?' },
      { texto: 'Testou no preview com dados fictícios?' },
    ],
    cena: 'nevoa-suave',
    notes: `Responder cada item com o que apareceu na demo. Um por passo.
O quarto item quase sempre revela algo: um limite de quantidade não é tipo de campo, é regra de negócio, e precisa de condição no workflow que adiciona membros.
"Esta lista vale para qualquer IA que construa por você: Bubble, Lovable, Bolt, um agente de código. Muda a ferramenta, a lista é a mesma."
Miniatura bubble-ai-agent-resultado.png: o arquétipo de checklist não tem coluna de mídia; mostrar a tela real na demo.
Ponte: então para que aprender o caminho manual?`,
  }),

  // S54
  pause({
    title: 'S54 · Pausa: para que o caminho manual?',
    pergunta: 'O agente fez em minutos o que levamos meia hora. Para que aprender o caminho manual?',
    resposta: 'Porque você responde pelo que ele fez. Sem entender dados, lógica e acesso, você não sabe o que conferir.',
    detalhe: 'Piloto automático: quem não sabe pilotar não percebe quando ele erra.',
    segundos: 20,
    chat: 'Se estiver ao vivo, responda no chat.',
    cena: 'nevoa-centro',
    notes: `Anel de 20 segundos. Pensar em voz alta: "se o resultado é o mesmo... mas é o mesmo?"
Opcional: ler 1 resposta do chat.
Revelação: um app de inscrições com a privacy rule errada vaza o telefone de 120 pessoas, e a responsabilidade é de quem publicou, não da IA.
Aceitar também: para corrigir quando o agente errar; para especificar melhor o prompt.
A Aula 4 volta a este ponto com agentes de código.
Ponte: o Bubble não é a única opção.`,
  }),

  // S55
  grid({
    title: 'S55 · Outros construtores visuais',
    titulo: 'Outros construtores visuais',
    cartoes: [
      { icone: Smartphone, titulo: 'FlutterFlow', itens: ['Apps Flutter: iOS, Android e web', 'Free: 2 projetos, sem exportar'] },
      { plataforma: 'weweb', titulo: 'WeWeb', itens: ['Front-end visual, backend livre', 'Free: subdomínio, 1.000 sessões'] },
      { plataforma: 'softr', titulo: 'Softr', itens: ['Portais sobre os seus dados', 'Free: 5 usuários, 5.000 registros'] },
      { icone: Store, titulo: 'Adalo', itens: ['Apps nativos para as lojas', 'Free: 500 registros, não publica'] },
    ],
    fonte: 'Páginas de preço oficiais de FlutterFlow, WeWeb, Softr (blog oficial, set/2026) e Adalo, acesso em 04/10/2026 (00-PESQUISA-ECOSSISTEMA.md §2.1).',
    cena: 'nevoa-suave',
    notes: `Bubble não é a única opção, e conhecer o mercado é parte do senso crítico que a ementa pede. Um cartão por passo.
FlutterFlow: apps Flutter para iOS, Android e web; o Free tem 2 projetos e não exporta código. O site diz ter mais de 3,3 milhões de usuários.
WeWeb: front-end visual com IA e backend à sua escolha; o Free publica num subdomínio até 1.000 sessões. Cita clientes como PwC, L'Oréal e Decathlon.
Softr: portais e ferramentas internas sobre seus dados; Free com 5 usuários de app e 5.000 registros. Mais de 1 milhão de times.
Adalo: apps nativos para as lojas; Free com 500 registros por app, sem publicar. Mais de 1 milhão de apps criados.
Logos: WeWeb e Softr dos kits oficiais; FlutterFlow e Adalo só como nome, com ícone neutro (sem kit oficial).
Limites mudam: conferir antes de escolher.
Ponte: quando cada um faz sentido.`,
  }),

  // S56
  comparison({
    title: 'S56 · Quando cada um faz sentido',
    titulo: 'Quando cada um faz sentido',
    colunas: [
      { id: 'bubble', nome: 'Bubble', sub: 'tudo num lugar' },
      { id: 'flutterflow', nome: 'FlutterFlow', sub: 'Flutter' },
      { id: 'weweb', nome: 'WeWeb', sub: 'front-end' },
      { id: 'softr', nome: 'Softr', sub: 'portais' },
    ],
    linhas: [
      { criterio: 'Constrói', celulas: ['Tela, banco e lógica juntos', 'App multiplataforma', 'Front-end sobre backend', 'Blocos sobre dados prontos'], passo: 1 },
      { criterio: 'Free publica?', celulas: ['Não', 'Sim, na web', 'Sim, em subdomínio', 'Sim, com limites'], passo: 2 },
      { criterio: 'Melhor para (avaliação do professor)', celulas: ['SaaS e marketplace web', 'App nas lojas', 'Interface sob medida', 'Portal interno'], passo: 3 },
    ],
    foco: { coluna: 'bubble', conclusao: 'Escolha pelo problema, não pela ferramenta da moda.' },
    cena: 'nevoa-suave',
    notes: `Passo 1: o que cada um constrói.
Passo 2: a linha do plano gratuito. O Bubble é generoso para construir e restritivo para publicar.
Passo 3: "Melhor para" é julgamento do professor, não ranking oficial: dizer isso em voz alta.
Passo 4: moldura no Bubble e a frase-síntese.
Na Aula 3, AppSheet e Softr aparecem de novo, para o app de check-in.
Slide cortável se a aula atrasar: dizer a frase-síntese no slide anterior.
Fontes: 00-PESQUISA-ECOSSISTEMA.md §2.1 (planos gratuitos); linha "Melhor para": avaliação do professor.
Ponte: "Vamos juntar as peças."`,
  }),
];
