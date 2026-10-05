import { Blocks, MessageSquareText, Workflow } from 'lucide';
import { caseStudy, chapter, comparison, constellation, flow, grid, stat } from '../../archetypes';
import type { SlideDef } from '../../engine/types';
import { TOTAL_CAPITULOS } from './comum';

/** Capítulo 2 — O mapa do ecossistema (S16–S28). */
export const bloco2: SlideDef[] = [
  chapter({
    title: 'S16 · Capítulo 02',
    numero: 2,
    total: TOTAL_CAPITULOS,
    titulo: 'O mapa do ecossistema',
    cena: 'constelacao',
    notes: `15 s. "No-code não é uma coisa só." O núcleo da constelação ao fundo prepara o próximo slide.`,
  }),

  constellation({
    title: 'S17 · Cinco famílias',
    titulo: 'O ecossistema no-code em 2026',
    subtitulo: 'Cinco famílias de ferramentas. Cada uma resolve um tipo de problema.',
    destaque: { rotulo: 'Em destaque: as ferramentas da ementa' },
    notes: `Uma família por passo, cerca de 20 s cada: o que resolve e um exemplo.
1 Sites e design: Webflow, Framer, Wix, Figma. A cara do produto, páginas e protótipos.
2 Apps visuais: Bubble, FlutterFlow, Glide, AppSheet. Telas, dados e lógica juntos.
3 Automação: Make, Zapier, n8n. "Quando acontecer X num sistema, faça Y em outro."
4 Dados e back-end: Airtable, Notion, Google Sheets, Supabase. Onde a informação mora.
5 Apps por IA: Lovable, Bolt.new, v0, Replit. O app a partir de uma descrição.
Último passo: as ferramentas da ementa. "Não decorem logos; reconheçam a que família pertence um problema."
Marcas em texto: AppSheet e Google Sheets (marcas Google pedem permissão), FlutterFlow e Bolt.new (sem kit oficial).
Classificação própria a partir da pesquisa do ecossistema (§2).`,
  }),

  grid({
    title: 'S18 · Família: sites e design',
    titulo: 'Sites e design',
    subtitulo: 'Quando o produto é a página.',
    revelar: 'todos',
    cartoes: [
      { plataforma: 'webflow', titulo: 'Webflow', itens: ['Sites com CMS; 300 mil+ empresas', 'Free: 2 páginas em webflow.io'] },
      { plataforma: 'framer', titulo: 'Framer', itens: ['Editor de designer; US$ 2 bi (2025)', 'Free: domínio framer.website'] },
      { plataforma: 'wix', titulo: 'Wix Studio', itens: ['Sites para agências', 'Free: workspace; domínio pago'] },
      { plataforma: 'figma', titulo: 'Figma', itens: ['Design de interfaces e Figma Make', 'Free: rascunhos ilimitados'] },
    ],
    conclusao: 'Poderia fazer a nossa landing page. Não guarda dados com regras.',
    fonte: 'Webflow pricing e help center (mai/2026); Framer pricing; SiliconANGLE, 28/08/2025; Wix Studio; Figma pricing.',
    cena: 'paineis',
    notes: `Os quatro ladrilhos entram juntos. Para cada um: o que faz, o plano gratuito e um número.
Webflow (2013): sites com CMS e hospedagem. Framer (2014): sites rápidos com IA. Wix Studio (2023): Wix para agências. Figma: design de interfaces; o Figma Make gera protótipos por prompt.
Passo 1: a frase. Esta família poderia fazer a nossa landing page; o que ela não faz bem é guardar dados com regras, e um sistema de inscrição precisa disso.
Figma volta como alternativa ao Excalidraw na Demo 1.
Wix aparece monocromático (diretriz da marca).`,
  }),

  grid({
    title: 'S19 · Família: apps visuais',
    titulo: 'Apps visuais',
    subtitulo: 'Tela, banco e lógica no mesmo lugar.',
    revelar: 'todos',
    cartoes: [
      { plataforma: 'bubble', titulo: 'Aula 2', destaque: true, itens: ['App web e mobile completo', '7,2 mi de apps lançados (2025)'] },
      { titulo: 'FlutterFlow', itens: ['Apps Flutter multiplataforma', 'Free: 2 projetos'] },
      { plataforma: 'glide', titulo: 'Glide', itens: ['Dados viram apps', 'GlideOS Free: 0 apps publicados'] },
      { titulo: 'AppSheet (Aula 3)', destaque: true, itens: ['App a partir de planilha', 'Free: teste até 10 usuários'] },
      { plataforma: 'softr', titulo: 'Softr', itens: ['Portais sobre seus dados', 'Free: 5 usuários de app'] },
    ],
    fonte: 'Bubble pricing e Bubble Wrapped 2025; FlutterFlow, Glide e AppSheet pricing; Softr blog. Acesso em 04/10/2026.',
    cena: 'paineis',
    notes: `Os cinco ladrilhos entram juntos.
O Bubble é a ferramenta central da disciplina porque faz as três coisas juntas: tela, banco e lógica. Agora com AI Agent.
FlutterFlow: apps Flutter para iOS, Android e web. Glide: o produto mudou em ago/2026 (GlideOS).
AppSheet: do Google desde 2020; volta na Aula 3 para o app de check-in. Softr: portais e ferramentas internas.
Passo 1: anel no Bubble e no AppSheet e a frase.
FlutterFlow e AppSheet aparecem só como nome (sem kit oficial / marca Google).`,
  }),

  caseStudy({
    title: 'S20 · Caso Teal',
    empresa: 'Teal',
    contexto: 'Busca de emprego, EUA',
    plataforma: 'bubble',
    problema: 'Validar e operar uma plataforma de apoio à busca de emprego sem um time grande de engenharia.',
    solucao: 'Produto construído no Bubble. O no-code comprou tempo para aprender o que os usuários queriam.',
    resultados: [
      { prefixo: 'US$ ', valor: 5, sufixo: ' mi', rotulo: 'captados' },
      { valor: 12, rotulo: 'pessoas na equipe' },
    ],
    fonte: 'Bubble blog, 2021 (fonte antiga).',
    cena: 'nevoa-esquerda',
    notes: `Passo 0: empresa e problema. Passo 1: a solução no Bubble. Passo 2: os números.
"O ponto não é 'ficou rica com no-code'. É que doze pessoas validaram e operaram um produto real sem um time grande de engenharia."
Dizer que o caso é de 2021, por isso o ano está no slide.`,
  }),

  grid({
    title: 'S21 · Família: automação',
    titulo: 'Automação e integração',
    subtitulo: 'Quando acontecer X aqui, faça Y lá.',
    revelar: 'todos',
    cartoes: [
      { plataforma: 'make', titulo: 'Make (Aula 3)', destaque: true, itens: ['Canvas visual; 400 mil+ organizações', 'Free: 1.000 créditos/mês'] },
      { plataforma: 'zapier', titulo: 'Zapier', itens: ['Gatilho e ação; 9.000+ apps', 'Free: 100 tarefas/mês'] },
      { plataforma: 'n8n', titulo: 'Auto-hospedável', itens: ['Nós visuais e código', 'US$ 5,2 bi (2026); Free: self-host'] },
      { titulo: 'Power Automate', itens: ['Fluxos no Microsoft 365', 'Free: conta de trabalho ou escola'] },
    ],
    fonte: 'Make pricing e Make Help 2025; Zapier pricing; n8n pricing e EQS, mai/2026; Microsoft Learn (licenças). Acesso em 04/10/2026.',
    cena: 'grafo',
    notes: `Família sem tela, que faz sistemas conversarem.
Make (ex-Integromat): 1.000 créditos/mês e 2 cenários ativos no Free; 3.000+ apps. Zapier: 100 tarefas/mês, Zaps de 2 passos.
n8n: Community Edition grátis para auto-hospedar; avaliação de US$ 5,2 bi com investimento da SAP.
Power Automate: aparece só como nome (marca Microsoft).
Passo 1: anel no Make (Aula 3) e o vocabulário: o Make cobra em créditos desde agosto de 2025.`,
  }),

  caseStudy({
    title: 'S22 · Caso Icatu Seguros + n8n',
    empresa: 'Icatu Seguros',
    contexto: 'Seguradora, Brasil',
    plataforma: 'n8n',
    problema: 'Corretores esperavam cerca de 5 minutos por uma cotação, com etapas manuais entre sistemas.',
    solucao: 'Assistente no WhatsApp ligando sistemas que já existiam. Em produção em 7 semanas; 1.000+ corretores por dia.',
    resultados: [
      { texto: '~5 min', rotulo: 'cotação antes' },
      { valor: 40, prefixo: '< ', sufixo: ' s', rotulo: 'cotação depois' },
      { valor: 85, sufixo: '%', rotulo: 'menos tempo por cotação' },
    ],
    fonte: 'n8n, estudo de caso Icatu Seguros. Acesso em 04/10/2026.',
    cena: 'nevoa-esquerda',
    notes: `Caso brasileiro, de empresa grande, com número antes e depois.
Passo 1: a solução. O ganho veio de ligar sistemas que já existiam, não de uma tela nova.
Passo 2: de cerca de 5 minutos para menos de 40 segundos, uma redução de 85%.
Recebeu o prêmio Gartner Eye on Innovation 2025.`,
  }),

  grid({
    title: 'S23 · Família: dados e back-end',
    titulo: 'Dados e back-end',
    subtitulo: 'Onde a informação mora.',
    revelar: 'todos',
    cartoes: [
      { plataforma: 'airtable', titulo: 'Airtable', itens: ['Planilha com alma de banco', 'Free: 1.000 registros por base'] },
      { plataforma: 'notion', titulo: 'Notion', itens: ['Docs e bancos com IA', 'Free: uso individual'] },
      { titulo: 'Google Sheets (Aula 3)', itens: ['Planilha colaborativa', 'Grátis com Conta Google'] },
      { plataforma: 'supabase', titulo: 'Supabase', destaque: true, itens: ['Postgres, login e APIs; Free: 2 projetos', '60%+ dos bancos novos: criados por IA'] },
    ],
    fonte: 'Airtable, Notion e Supabase pricing; Google Sheets; Supabase, Série F (2026). Acesso em 04/10/2026.',
    cena: 'nevoa-suave',
    notes: `Os quatro ladrilhos entram juntos. Google Sheets aparece só como nome (marca Google); volta na Aula 3.
Airtable: 1.000 registros por base no Free. Notion: blocos ilimitados para uso individual. Supabase: back-end open source em Postgres.
Passo 1: o dado do Supabase. Pergunta retórica: "Se a IA cria o banco, quem decide a estrutura desses dados?" Volta na Aula 2.`,
  }),

  flow({
    title: 'S24 · Caso Flexiple',
    titulo: 'Flexiple: três famílias, uma stack',
    subtitulo: 'Marketplace de freelancers de tecnologia (Índia).',
    nos: [
      { id: 'webflow', rotulo: 'Webflow', sub: 'o site', plataforma: 'webflow' },
      { id: 'bubble', rotulo: 'Bubble', sub: 'a aplicação', icone: Blocks },
      { id: 'airtable', rotulo: 'Airtable', sub: 'os dados', plataforma: 'airtable', tipo: 'dado' },
    ],
    ligacoes: [
      { de: 'webflow', para: 'bubble' },
      { de: 'bubble', para: 'airtable' },
    ],
    passos: [['webflow', 'bubble', 'airtable']],
    conclusao: '~US$ 3 mi de receita com uma stack de US$ 60–100 por mês (Makerpad/Zapier; ano não informado).',
    cena: 'nevoa-suave',
    notes: `O storyboard pede um caso com mini-diagrama; aqui o diagrama ocupa o slide e os números vêm na frase final.
Três famílias juntas: o site no Webflow, a aplicação no Bubble, os dados no Airtable.
Passo 1: os números. Cerca de US$ 3 milhões de receita; a stack custava de US$ 60 a 100 por mês.
"Na vida real o mapa se usa combinando famílias."
A fonte (Makerpad/Zapier) não informa o ano: dizer isso.`,
  }),

  grid({
    title: 'S25 · Família: apps por IA',
    titulo: 'Apps por IA',
    subtitulo: 'Você descreve. A IA escreve o código.',
    revelar: 'todos',
    cartoes: [
      { plataforma: 'lovable', titulo: 'Lovable', destaque: true, itens: ['Demo de hoje: app por conversa', 'Free: 5 créditos/dia'] },
      { titulo: 'Bolt.new', itens: ['Cria e publica no navegador', 'Free: 1 mi de tokens/mês'] },
      { plataforma: 'v0', titulo: 'v0', itens: ['Interfaces e apps Next.js', 'Free: créditos diários'] },
      { plataforma: 'replit', titulo: 'Replit Agent', itens: ['Agente que planeja e publica', 'Free: créditos diários'] },
      { titulo: 'Google AI Studio', itens: ['Build: vibe coding, gratuito', 'Substitui o Firebase Studio'] },
      { plataforma: 'figma', titulo: 'Figma Make', itens: ['Prompt vira protótipo', 'Free: em rascunhos'] },
    ],
    fonte: 'Lovable docs (créditos); Bolt, v0 e Replit pricing; Firebase blog, mar/2026; Figma Make GA. Acesso em 04/10/2026.',
    cena: 'paineis',
    notes: `Os seis ladrilhos entram juntos. Bolt.new e Google AI Studio aparecem só como nome.
Lovable (2023, Estocolmo): 5 créditos por dia, até 30 por mês; publica em lovable.app. É a ferramenta da Demo 2.
Google AI Studio (Build): gratuito; substitui o Firebase Studio, em desativação.
Passo 1: anel no Lovable e a frase. Figma e Bubble, de outras famílias, também ganharam IA.`,
  }),

  stat({
    title: 'S26 · O Brasil e a Lovable',
    contexto: 'Qual a posição do Brasil entre os mercados da Lovable?',
    valor: 2,
    sufixo: 'º',
    unidades: false,
    descricao: 'maior mercado da empresa: 500 mil+ usuários ativos e 100 mil+ projetos (set/2025).',
    fonte: 'Startupi, 30/09/2025. Lovable Day São Paulo em 16/10/2026: Central do Varejo.',
    cena: 'nevoa',
    notes: `"Não está acontecendo lá fora; está acontecendo aqui, com gente da idade de vocês."
O Lovable Day em São Paulo, em 16/10/2026, foi anunciado como o maior evento presencial da empresa.
Prompt de chat opcional, sem esperar: "Se estiver ao vivo, você já usou alguma ferramenta desta família?"`,
  }),

  caseStudy({
    title: 'S27 · Lock-in: Airtable',
    empresa: 'A Airtable mudou de dono',
    contexto: 'Caso: dependência de plataforma',
    problema: 'Comprada pela Bending Spoons. Quem usa a Airtable não participou da venda e herda as decisões do novo dono.',
    solucao: 'Lock-in é o custo de sair. Pergunte como se sai antes de entrar.',
    resultados: [
      { prefixo: 'US$ ', valor: 1.285, casas: 3, sufixo: ' bi', rotulo: 'valor da empresa na compra' },
      { texto: '04/09', rotulo: 'compra concluída, em 2026' },
    ],
    fonte: 'TechCrunch, 04/08/2026; conclusão da compra conforme pesquisa do ecossistema (§2.5).',
    cena: 'nevoa-esquerda',
    notes: `A Bending Spoons é conhecida por comprar produtos digitais consolidados (Evernote, WeTransfer).
"Imagine que a sua empresa guarda tudo no Airtable. Você vai conviver com as decisões do novo dono: preço, limites, prioridades."
Passo 1: a lição. Lock-in, ou dependência de fornecedor, é o custo de sair.
Não afirmar mudanças de preço ou produto: não aconteceram até 04/10/2026. Não é motivo para não usar; é motivo para perguntar como se sai.
O campo "Solução" do arquétipo aqui traz a lição.`,
  }),

  comparison({
    title: 'S28 · Critérios de seleção',
    titulo: 'Como escolher: quatro critérios',
    colunas: [
      { id: 'bubble', nome: 'Bubble', icone: Blocks, sub: 'Fonte: bubble.io/pricing' },
      { id: 'make', nome: 'Make', icone: Workflow, sub: 'Fonte: make.com/pricing' },
      { id: 'lovable', nome: 'Lovable', icone: MessageSquareText, sub: 'Fonte: docs.lovable.dev' },
    ],
    linhas: [
      { criterio: 'Custo para começar', celulas: ['Publicar: US$ 29/mês', 'Free: 1.000 créditos/mês', 'Free: 5 créditos/dia'], passo: 1 },
      { criterio: 'O que cresce com o uso', celulas: ['Workload units', 'Créditos por execução', 'Créditos por pedido'], passo: 2 },
      {
        criterio: 'Integrações',
        celulas: [
          { nivel: 3, rotulo: 'API Connector' },
          { nivel: 4, rotulo: '3.000+ apps' },
          { nivel: 3, rotulo: 'Cloud, GitHub, APIs' },
        ],
        passo: 3,
      },
      {
        criterio: 'Lock-in',
        celulas: [
          { nivel: 4, rotulo: 'Não exporta código' },
          { nivel: 3, rotulo: 'Blueprint só no Make' },
          { nivel: 2, rotulo: 'Código no GitHub' },
        ],
        passo: 3,
      },
    ],
    foco: {
      coluna: 'bubble',
      conclusao: 'E para o nosso evento? Validar: rápido e barato. Guardar com regras: app visual + automação.',
    },
    cena: 'nevoa-suave',
    notes: `Cada critério com a sua pergunta. Medidores: avaliação própria. Preços acessados em 04/10/2026.
Passo 1, custo: quanto custa no dia em que der certo? Bubble: Free só em desenvolvimento; publicar a partir de US$ 29/mês (web, plano anual). Lovable publica no Free em lovable.app.
Passo 2, escalabilidade: o que cresce na conta quando os usuários crescem?
Passo 3, integrações e lock-in: conversa com o que existe? Como se sai? O Bubble não exporta código (dados saem em CSV); o código da Lovable sincroniza com o GitHub.
Passo 4: "E para o nosso evento?" Depende da fase. Validar: rápido e barato. Guardar inscrições com regras: app visual + automação. Por isso Bubble e Make nas próximas aulas.
Com alunos: ler uma resposta do chat antes da conclusão.
Ponte: "Falei várias vezes em 'nosso evento'. Está na hora de apresentá-lo."`,
  }),
];
