import { Building2 } from 'lucide';
import { chapter, checklist, constellation, demo, grid, showcase, stat } from '../../archetypes';
import type { SlideDef } from '../../engine/types';
import { media } from './helpers';

/** Capítulo 6: Apps por IA, o mesmo projeto em minutos (S39–S46). Demo no preview do Lovable Free. */
export const bloco6: SlideDef[] = [
  // S39
  chapter({
    title: 'S39 Bloco 6: Apps por IA',
    numero: 6,
    total: 9,
    titulo: 'O mesmo projeto,\nem minutos',
    subtitulo: 'Construtores de apps por IA: o que entregam e o que você ainda precisa conferir.',
    cena: 'blocos-centro',
    notes: `Abertura do capítulo (15 s). Os blocos montam rápido: contraste com a construção manual das aulas 2 e 3.
Checkpoint 2: se passar de 19h50, aplicar os Cortes E (pular S42) e F (encerrar a demo no minuto 6).`,
  }),

  // S40
  constellation({
    title: 'S40 Construtores por IA em 2026',
    titulo: 'Construtores por IA',
    subtitulo: 'Do texto ao app: quem faz o quê.',
    grupos: [
      { rotulo: 'Do prompt ao app completo', desc: 'Tela, banco, login, hospedagem', ids: ['lovable', 'bolt', 'replit', 'base44'], posicao: 'ia' },
      { rotulo: 'Interface e sites', desc: 'Prompt para tela ou site', ids: ['v0', 'figma', 'framer', 'webflow'], posicao: 'sites' },
      { rotulo: 'IA no no-code visual', desc: 'Telas, dados e lógica por prompt', ids: ['bubble', 'flutterflow', 'softr', 'airtable'], posicao: 'apps' },
      { rotulo: 'Big tech', desc: 'Google, com o Firebase', ids: ['aistudio', 'firebase'], posicao: 'automacao' },
      { rotulo: 'Por baixo de muitos', desc: 'Banco Postgres com RLS', ids: ['supabase'], posicao: 'dados' },
    ],
    destaque: {
      rotulo: 'Na demo de hoje: Lovable, com o Supabase por baixo',
      ids: ['lovable', 'supabase'],
    },
    notes: `Um grupo por passo.
1 Do prompt ao app completo (tela, banco, login, hospedagem): Lovable, Bolt.new, Replit Agent e Base44, da Wix.
2 Interface e sites: v0, da Vercel (prompt para interface); Figma Make (prompt dentro do Figma, disponível para todos desde 24/07/2025); o Wireframer do Framer gera páginas editáveis a partir de uma descrição; o AI site builder do Webflow (beta anunciado em 27/02/2025) gera o tema e a página inicial a partir de uma descrição.
3 IA dentro do no-code visual: o Bubble AI Agent, que vimos na Aula 2, gera telas, tipos de dados com privacy rules e workflows. DreamFlow, da equipe do FlutterFlow, gera apps Flutter a partir de linguagem natural. O AI Co-Builder do Softr (31/03/2026) cria banco, app e lógica a partir de uma descrição. O Omni, do Airtable, cria apps com dados, automações e interfaces a partir de prompts.
4 Big tech: Google AI Studio (modo Build), que desde 19/03/2026 configura Firestore e Firebase Auth sozinho quando o app precisa de dados e login. O Firebase Studio, que fazia esse papel, está sendo desligado: encerramento anunciado em 19/03/2026, novos workspaces bloqueados desde 22/06/2026 e desligamento em 22/03/2027.
5 Por baixo de muitos deles: o Supabase, banco Postgres com RLS. Na Série F (04/06/2026), mais de 60% dos bancos novos eram criados por ferramentas de IA; em 02/10/2026 a empresa já falava em 70%.
Passo 6: destaque em Lovable e Supabase, os da demo.
Bolt.new, Base44 e FlutterFlow aparecem só como nome (sem logo oficial); Google AI Studio e Firebase só como nome (marcas restritas).
Fontes (acesso em 05/10/2026): framer.com/wireframer; webflow.com/updates/ai-site-builder; dreamflow.app; softr.io/blog/introducing-softr-ai; airtable.com/platform/app-building; firebase.google.com/docs/studio/migrating-project; firebase.blog (AI Studio, 19/03/2026); figma.com/blog (Figma Make GA); supabase.com/blog/supabase-series-f; PR Newswire, Supabase, 02/10/2026.`,
  }),

  // S41
  stat({
    title: 'S41 Lovable: US$ 13,3 bi',
    contexto: 'Quanto vale um construtor de apps por IA fundado em 2023?',
    valor: 13.3,
    casas: 1,
    prefixo: 'US$ ',
    sufixo: ' bi',
    unidades: false,
    descricao: 'avaliação da Lovable em ago/2026 (era US$ 6,6 bi em dez/2025). Receita anualizada acima de US$ 600 mi em set/2026.',
    fonte: 'TechCrunch, 12/08/2026 e 24/09/2026 (acesso em 04/10/2026).',
    cena: 'nevoa',
    notes: `A Lovable, fundada em Estocolmo em 2023, foi avaliada em US$ 6,6 bi em dezembro de 2025 e em US$ 13,3 bi em agosto de 2026.
Em setembro de 2026 a receita anualizada passou de US$ 600 milhões.
Comparação: o Bubble, de 2012, é a referência do no-code visual há mais de uma década. A Lovable chegou a esse tamanho em três anos.`,
  }),

  // S42
  grid({
    title: 'S42 O mercado em números',
    titulo: 'Para onde o dinheiro foi',
    cartoes: [
      {
        plataforma: 'replit',
        titulo: 'Replit',
        texto: 'Avaliação de US$ 9 bi na Série D, mar/2026, com o Agent 4.',
      },
      {
        plataforma: 'vercel',
        titulo: 'Vercel (v0)',
        texto: 'Avaliação de US$ 9,3 bi.',
      },
      {
        icone: Building2,
        titulo: 'Base44',
        texto: 'Comprada pela Wix por ~US$ 80 mi (jun/2025); ~US$ 200 mi de ARR (ago/2026).',
      },
      {
        plataforma: 'supabase',
        titulo: 'Supabase',
        texto: 'Avaliação de ~US$ 10 bi na Série F, jun/2026.',
      },
      {
        plataforma: 'cursor',
        titulo: 'Cursor',
        texto: 'Mais de US$ 4 bi de receita anualizada, jun/2026.',
      },
    ],
    revelar: 'todos',
    conclusao: 'Dinheiro não é prova de qualidade. É prova de velocidade, e de risco de plataforma.',
    fonte:
      'Replit blog, 11/03/2026; Vercel; Wix, jun/2025; Supabase blog (Série F). ARR da Base44 e receita do Cursor (SEC 10-Q da SpaceX, Dealroom): secundárias.',
    cena: 'nevoa-suave',
    notes: `Replit: Série D de US$ 400 mi, avaliação de US$ 9 bi (11/03/2026), com o Agent 4.
Vercel, dona do v0: avaliação de US$ 9,3 bi.
Base44: comprada pela Wix por ~US$ 80 mi em jun/2025; ~US$ 200 mi de ARR em ago/2026 (fonte secundária).
Supabase: Série F a ~US$ 10 bi (jun/2026).
Cursor: mais de US$ 4 bi de receita anualizada (jun/2026; fonte secundária).
Passo 1: dinheiro não é prova de qualidade. É prova de que muita gente constrói assim, e de que essas empresas vão mudar preço e produto rápido: risco de plataforma, de novo.
Corte E: pular este slide e citar Replit e Supabase de passagem.`,
  }),

  // S43
  stat({
    title: 'S43 Brasil: +124%',
    contexto: 'E no Brasil?',
    valor: 124,
    prefixo: '+',
    sufixo: '%',
    unidades: false,
    descricao: 'nas buscas por “vibe coding” no Brasil em um ano (jul/2025 a jul/2026). O país é o 2º maior mercado da Lovable.',
    fonte: 'Locaweb, via Exame, 18/08/2026; Startupi, 30/09/2025 (500 mil+ usuários ativos); Collins, palavra do ano de 2025.',
    cena: 'nevoa-esquerda',
    notes: `As buscas por "vibe coding" no Brasil cresceram 124% entre jul/2025 e jul/2026 (Locaweb, via Exame).
O Brasil é o 2º maior mercado da Lovable: mais de 500 mil usuários ativos e 100 mil projetos em set/2025 (Startupi).
"Vibe coding" foi a palavra do ano de 2025 do dicionário Collins.
Ponte: vamos ver o que um desses construtores faz com o nosso planejamento.`,
  }),

  // S44
  demo({
    title: 'S44 Demo: do planejamento ao app pronto para publicar',
    plataforma: 'lovable',
    titulo: 'Do planejamento da Aula 1 ao app pronto para publicar',
    passos: [
      'Gerar o app a partir do planejamento da Aula 1',
      'Conferir banco, login e regras de acesso no preview',
      'O que aconteceria ao publicar, sem publicar',
    ],
    duracao: 'Cerca de 8 minutos. Plano gratuito, só preview.',
    url: 'lovable.dev/projects/hackathon-lovable-ensaio',
    captura: media('lovable-app-preview.png'),
    video: {
      src: media('v-lovable-app-completo.mp4'),
      label: 'Backup: o app completo gerado no Lovable (preview, sem publicar)',
    },
    cena: 'paineis',
    notes: `Nada é publicado. Plano Free: 5 créditos de construção por dia, no máximo 30 no mês no workspace (a Aula 1 já usou ~13). Uma geração ao vivo com os créditos do dia. Não usar o Lovable antes das 19h.
Se o painel não mostrar créditos em 29/10: gerar ao vivo no Google AI Studio (Build) com o mesmo prompt e mostrar o projeto hackathon-lovable-ensaio já pronto no Lovable.
1 Projeto novo: "este prompt não é mágico: persona, MoSCoW, wireframe, identidade, regra de acesso. É a Aula 1 inteira, mais a lição de segurança de hoje." Colar o prompt (prompt-a4-lovable.txt; texto completo em conteudo.md, S44) e enviar.
2 Enquanto gera, narrar o plano, os arquivos e a criação do banco. No minuto 2, abrir o projeto de ensaio hackathon-lovable-ensaio: "o bolo já assado, gerado com o mesmo prompt há alguns dias, tudo no preview".
3 No preview: inscrever Camila Persona / camila.persona@example.com; o contador cai. Repetir com CAMILA.PERSONA@example.com e espaço: deve bloquear. Se não bloquear, é conteúdo: "a IA esqueceu de normalizar; guardem para o agente".
4 Cloud > Database > inscricoes > políticas: ler em voz alta "insert para anônimo; select só para organizador".
5 Sem login, /organizacao pede login; com organizador@example.com, a lista aparece.
6 O que aconteceria ao publicar: no S45, captura do diálogo Publish aberto e não confirmado.
7 Voltar à geração ao vivo: mesmo prompt, resultado parecido, não idêntico. Mostrar o contador de créditos.
Se falhar: ficar no ensaio; tudo falhou, tecla V. Se gerar sem RLS: 1 min de comentário (é o CVE ao vivo). Corte F: parar depois do passo 4.
Fonte dos limites do Free: Lovable Docs, Plans and credits; lovable.dev/pricing (acesso em 04/10/2026).`,
  }),

  // S45
  showcase({
    title: 'S45 Por baixo do capô',
    titulo: 'O que a IA gerou por baixo',
    plataforma: 'lovable',
    midia: {
      src: media('lovable-rls-policies.png'),
      descricao: 'Lovable Cloud: políticas RLS da tabela inscricoes no projeto de ensaio',
    },
    url: 'lovable.dev/projects/hackathon-lovable-ensaio',
    anotacoes: [
      {
        x: 14,
        y: 22,
        titulo: 'Código seu, num repositório',
        texto: 'React e TypeScript, sincronizados com um GitHub seu.',
      },
      {
        x: 52,
        y: 46,
        titulo: 'A regra que protege',
        texto: 'Insert para visitante anônimo; leitura só para organizador.',
        zoom: { x: 25, y: 20, w: 60, h: 60 },
      },
      {
        x: 78,
        y: 74,
        titulo: 'Revisão útil, não garantia',
        texto: 'Ao publicar, um scan rápido rodaria antes. A regra tem de estar certa antes do botão.',
      },
    ],
    fonte: 'Lovable Docs, Security; Matt Palmer, 29/05/2025.',
    cena: 'paineis-amplo',
    notes: `Três achados do projeto de ensaio, sem publicar.
Passo 1, código: React e TypeScript num repositório Git. Diferente do Bubble, esse código é de vocês. (Captura complementar: media/aula-04/lovable-codigo.png.)
Passo 2, políticas RLS: a regra que protege. A chave pública do banco está no código do navegador, por projeto; o que protege é a política, não o segredo da chave.
Passo 3, revisão de segurança feita sob demanda no ensaio (captura complementar: lovable-revisao-seguranca.png) e o diálogo Publish aberto e não confirmado (lovable-publish-dialog.png).
Se publicasse, o Lovable rodaria um Quick scan automático antes e colocaria um snapshot num .lovable.app que qualquer pessoa com o link abriria. Por isso a regra tem de estar certa ANTES do botão.
A própria documentação diz que as ferramentas não garantem segurança completa. No caso do CVE, o pesquisador criticou a 1ª versão do scanner por conferir só se existia alguma política, não se estava certa.
Ajustar a posição dos marcadores (x, y) depois de inserir a captura real.`,
  }),

  // S46
  checklist({
    title: 'S46 Leitura crítica do app gerado',
    titulo: 'Seis perguntas para qualquer app gerado por IA',
    itens: [
      {
        texto: 'O que ela acertou?',
        detalhe: 'Layout, campos, fluxo principal.',
      },
      {
        texto: 'O que ela inventou?',
        detalhe: 'Textos, datas, números que ninguém pediu.',
      },
      {
        texto: 'O que ela esqueceu?',
        detalhe: 'Normalizar e-mail, mensagens de erro, prazo dos dados.',
      },
      {
        texto: 'Quem pode ler cada tabela?',
        detalhe: 'Abrir as políticas e ler, uma por uma.',
      },
      {
        texto: 'Onde estão as chaves?',
        detalhe: 'Nada secreto no código do navegador.',
      },
      {
        texto: 'Quem vai manter isso?',
        detalhe: 'Sem quem entenda o código, cada mudança é um risco.',
      },
    ],
    cena: 'nevoa',
    notes: `Usar o que aconteceu na demo como exemplo de cada item.
1 Acertou: layout, campos, fluxo principal.
2 Inventou: textos, datas, números, depoimentos que não pedimos.
3 Esqueceu: normalizar e-mail, mensagem de erro, acessibilidade, prazo de exclusão dos dados.
4 Quem pode ler cada tabela: abrir as políticas e ler uma por uma.
5 Onde estão as chaves: nada secreto no código do navegador.
6 Quem vai manter: se ninguém da equipe entende o código, cada mudança vira um novo pedido à IA, e cada pedido é um novo risco.
Com alunos: "o que a IA esqueceu?" (ler 1).
Ponte: o Lovable é um agente especializado em apps. E um agente que trabalha em qualquer projeto, dentro do nosso computador? Agentes de código.`,
  }),
];
