import { BookOpen, Bug, FileBadge, FileJson, FlaskConical, GitBranch, GitCommitHorizontal, Globe, Hammer, History, Link, Lock } from 'lucide';
import { bulletsRich, chapter, comparison, demo, flow, imageFull, twoColumn } from '../../archetypes';
import type { SlideDef } from '../../engine/types';
import { comRevelacao, media } from './helpers';

/** Capítulo 2: Publicar, do dev ao live (S08–S15). Tour guiado no plano gratuito, nada vai ao ar. */
export const bloco2: SlideDef[] = [
  // S08
  chapter({
    title: 'S08 Bloco 2: Publicar',
    numero: 2,
    total: 9,
    titulo: 'Publicar:\ndo dev ao live',
    subtitulo: 'O que muda entre o app que só você vê e o app que o mundo usa.',
    cena: 'horizonte-avanco',
    notes: `Abertura do capítulo (15 s).
"O que significa, exatamente, colocar no ar?" Hoje vamos entender a resposta sem atravessar a porta: nada será publicado.`,
  }),

  // S09
  comparison({
    title: 'S09 Três ambientes',
    titulo: 'Software vive em três lugares',
    colunas: [
      {
        id: 'dev',
        nome: 'Desenvolvimento',
        icone: Hammer,
        sub: 'você constrói e quebra',
      },
      {
        id: 'teste',
        nome: 'Teste',
        icone: FlaskConical,
        sub: 'cópia fiel para conferir',
      },
      {
        id: 'prod',
        nome: 'Produção (live)',
        icone: Globe,
        sub: 'dados e pessoas reais',
      },
    ],
    linhas: [
      {
        criterio: 'Bubble',
        celulas: ['/version-test', 'o mesmo /version-test', 'Live, após Deploy to live'],
        passo: 1,
      },
      {
        criterio: 'Lovable',
        celulas: ['Editor e preview', 'Preview', 'Snapshot em .lovable.app'],
        passo: 1,
      },
      {
        criterio: 'Make',
        celulas: ['Cenário desligado', 'Run once, dado de teste', 'Cenário ativo'],
        passo: 1,
      },
      {
        criterio: 'Código',
        celulas: ['Branch', 'Staging', 'Ambiente de produção'],
        passo: 1,
      },
    ],
    foco: {
      coluna: 'prod',
      conclusao: 'Replit, jul/2025: a 1ª correção foi separar o banco de dev do de produção.',
    },
    cena: 'nevoa-suave',
    notes: `Passo 0: os três lugares. Desenvolvimento: você constrói e quebra, só você vê. Teste (staging): cópia fiel para conferir. Produção (live): o que o público usa, com dados e pessoas reais.
Passo 1: nas ferramentas da disciplina.
Bubble: o dev termina em /version-test; o live é outro, com banco separado, e se chega a ele com Deploy to live.
Lovable: editor e preview são o dev; publicar cria um snapshot num endereço .lovable.app, e mudanças posteriores NÃO vão ao ar sozinhas (Lovable Docs, Deploy).
Make: cenário desligado é dev; ligou o agendamento ou o webhook, é produção. Não existe "Make de teste": por isso exportamos o blueprint antes de mexer.
Código: branches e ambientes no provedor de hospedagem.
Passo 2: lembrar o Replit. O agente tinha acesso ao banco de produção a partir de onde trabalhava. A primeira correção anunciada foi separar os dois. "Não se testa no banco de verdade."`,
    fonte: 'Bubble Manual; Lovable Docs, Deploy; Make Help; The Register, 22/07/2025 (acesso em 04/10/2026).',
  }),

  // S10
  twoColumn({
    title: 'S10 version-test x live',
    titulo: 'O link de teste não é para o público',
    topicos: [
      {
        icone: FlaskConical,
        titulo: 'Banco de teste, não o de produção',
        texto: 'Funciona, salva e chama o Make, mas grava nos dados de desenvolvimento.',
        zoom: { x: 0, y: 0, w: 70, h: 45 },
      },
      {
        icone: Bug,
        titulo: 'Ferramentas de quem constrói',
        texto: 'O Bubble pode mostrar a barra de depuração nesse endereço.',
      },
      {
        icone: Link,
        titulo: 'Endereço que ninguém deveria divulgar',
        texto: 'Mandar esse link para 120 pessoas é abrir a cozinha do restaurante.',
      },
    ],
    visual: {
      tipo: 'midia',
      moldura: 'navegador',
      url: 'hackathon-seunome.bubbleapps.io/version-test',
      midia: {
        src: media('bubble-url-version-test.png'),
        descricao: 'App do Hackathon aberto no endereço /version-test do Bubble (plano Free)',
      },
    },
    cena: 'nevoa-suave',
    notes: `Captura: o nosso app no plano gratuito. Olhem a URL: hackathon-seunome.bubbleapps.io/version-test.
Passo 1: funciona, salva no banco, manda para o Make. Mas é a versão de desenvolvimento, com o banco de teste. A captura amplia a barra de endereço.
Passo 2: o Bubble pode mostrar a barra de depuração: é ferramenta de quem constrói.
Passo 3: o endereço não é para o público. Analogia: mandar esse link para 120 pessoas é como abrir a cozinha do restaurante para os clientes comerem lá dentro.
Ponte: "e por que eu não mostro a versão live? Porque o plano gratuito para aqui."`,
  }),

  // S11
  imageFull({
    title: 'S11 O plano gratuito para aqui',
    midia: {
      src: media('bubble-deploy-bloqueado.png'),
      descricao: 'Bubble Free: aviso de upgrade ao tentar o Deploy to live',
    },
    legenda: 'Bubble Free: “projetos em construção”. Sem live, sem domínio, sem lojas.',
    detalhe: 'O gratuito quase sempre acaba no momento de publicar.',
    fonte: 'bubble.io/pricing (acesso em 04/10/2026). Capturas do professor, plano Free.',
    notes: `Captura: ao tentar publicar, o Bubble pede upgrade. Com o domínio próprio acontece o mesmo (captura complementar: media/aula-04/bubble-dominio-bloqueado.png, mostrar na ferramenta se der tempo).
Não é defeito: é o modelo de negócio. O Free é descrito como para "projetos em construção": sem live, sem domínio, sem lojas de apps.
Dizer: "Nesta aula usamos só planos gratuitos e não vamos publicar nada, de propósito: o bloqueio também é conteúdo."
O que aconteceria do outro lado do botão: o Bubble copiaria o dev para o live, que tem banco próprio, e cada mudança depois exigiria um novo Deploy.
Frase do slide: toda plataforma no-code tem um momento em que o gratuito acaba, e quase sempre é o momento de publicar.
Ponte: onde cada plataforma põe essa catraca?`,
  }),

  // S12
  comparison({
    title: 'S12 Quanto custa publicar',
    titulo: 'Onde cada plataforma põe a catraca',
    colunas: [
      { id: 'bubble', nome: 'Bubble' },
      { id: 'lovable', nome: 'Lovable' },
      { id: 'make', nome: 'Make' },
      { id: 'appsheet', nome: 'AppSheet' },
    ],
    linhas: [
      {
        criterio: 'Grátis permite',
        celulas: ['Só desenvolvimento', 'Publicar em .lovable.app', '2 cenários ativos', 'Testar com 10 usuários'],
        passo: 1,
      },
      {
        criterio: 'Para publicar de verdade',
        celulas: ['Starter Web US$ 29/mês', 'Domínio próprio: pago', 'Core US$ 9/mês', 'US$ 5 por usuário/mês'],
        passo: 2,
      },
      {
        criterio: 'Limite do grátis',
        celulas: ['50 mil WU/mês', '5 créditos/dia', '1.000 créditos/mês', 'Sem deploy'],
        passo: 3,
      },
    ],
    foco: {
      coluna: 'lovable',
      conclusao: 'Saber onde está a catraca é critério de escolha.',
    },
    cena: 'nevoa-suave',
    notes: `Uma linha por passo.
Passo 1, o que o grátis permite: Bubble só desenvolvimento; Lovable deixa publicar num subdomínio .lovable.app (não faremos); Make, 2 cenários ativos; AppSheet, testar com até 10 usuários.
Passo 2, para publicar de verdade: Bubble Starter Web US$ 29/mês no anual (Web e Mobile US$ 59); Lovable, domínio próprio só em plano pago; Make Core US$ 9/mês (10 mil créditos); AppSheet Starter US$ 5 por usuário/mês.
Passo 3, limites do grátis: 50 mil WU/mês no Bubble; 5 créditos/dia no Lovable (máx. 30/mês); 1.000 créditos/mês no Make (intervalo de 15 min); AppSheet sem deploy.
Passo 4 (foco no Lovable): cada um põe a catraca num lugar diferente. Saber onde ela está é critério de escolha.
AppSheet aparece só como nome (regra de marca).`,
    fonte: 'Páginas de preço de Bubble (anual, aba Web), Lovable, Make e AppSheet; Lovable Docs, Deploy (acesso em 04/10/2026).',
  }),

  // S13
  flow({
    title: 'S13 Domínio, DNS e HTTPS',
    titulo: 'Do nome ao cadeado',
    nos: [
      {
        id: 'dominio',
        rotulo: 'Domínio',
        sub: 'hackathonnocode.com.br',
        icone: Globe,
        tag: 'Você registra',
      },
      {
        id: 'dns',
        rotulo: 'DNS',
        sub: 'aponta o nome',
        icone: BookOpen,
        tag: 'Você aponta',
      },
      {
        id: 'cert',
        rotulo: 'Certificado',
        sub: 'TLS automático',
        icone: FileBadge,
        tag: 'A plataforma faz',
      },
      {
        id: 'https',
        rotulo: 'HTTPS',
        sub: 'dados cifrados',
        icone: Lock,
        tag: 'A plataforma faz',
        tipo: 'gatilho',
      },
    ],
    ligacoes: [
      { de: 'dominio', para: 'dns', rotulo: 'nome' },
      { de: 'dns', para: 'cert', rotulo: 'servidor' },
      { de: 'cert', para: 'https', rotulo: 'cadeado' },
    ],
    passos: [['dominio'], ['dns'], ['cert'], ['https']],
    conclusao: 'A plataforma faz o 3 e o 4. Você precisa saber conferir.',
    cena: 'grafo',
    notes: `Um nó por passo.
Passo 0, domínio: você registra um nome, por exemplo hackathonnocode.com.br, no Registro.br, por cerca de R$ 40 por ano.
Passo 1, DNS: a lista telefônica da internet. Você cria um registro dizendo "esse nome aponta para os servidores do Bubble (ou do Lovable)". A plataforma mostra quais registros criar.
Passo 2, certificado: a plataforma emite o certificado TLS automaticamente. É ele que faz o https e o cadeado.
Passo 3, HTTPS: tudo o que a Camila digita no formulário viaja criptografado. Sem HTTPS, qualquer um na mesma rede Wi-Fi poderia ler.
Passo 4: a boa notícia é que a plataforma faz o 3 e o 4 sozinha. A má: você precisa saber que existem para conferir.`,
    fonte: 'Valor do domínio: estimativa de ~R$ 40/ano para .com.br no Registro.br (reconferir na véspera).',
  }),

  // S14
  comRevelacao(
    bulletsRich({
      title: 'S14 Versionamento',
      titulo: 'Publicar bem é poder voltar atrás',
      itens: [
        {
          icone: GitBranch,
          titulo: 'Bubble',
          texto: 'Free: só desenvolvimento. Live e savepoints nos pagos; branches a partir do Growth.',
        },
        {
          icone: History,
          titulo: 'Lovable',
          texto: 'Histórico de versões e sincronização com o GitHub, também no Free.',
        },
        {
          icone: FileJson,
          titulo: 'Make',
          texto: 'Versões do cenário e Export blueprint, um arquivo JSON.',
        },
        {
          icone: GitCommitHorizontal,
          titulo: 'Código',
          texto: 'Git: cada mudança com autor, data e motivo.',
        },
      ],
      fonte: 'bubble.io/pricing e manual do Bubble (version control); docs.lovable.dev; help.make.com; The Register, 21 e 22/07/2025. Acesso em 05/10/2026.',
      cena: 'nevoa-esquerda',
      notes: `Um item por passo.
Passo 1, Bubble: no Free só existe a versão de desenvolvimento (e backup de 6 horas). A versão live separada e o version control básico, com savepoints, começam no Starter; branches personalizados, no Growth (bubble.io/pricing, 05/10/2026).
Passo 2, Lovable: cada mudança vira uma versão (dá para ver, voltar e marcar) e o Git sync com o GitHub vale em todos os planos, inclusive o Free. Voltar uma versão restaura o código, não os dados do banco.
Passo 3, Make: histórico de versões do cenário (restaurar até 60 dias) e Export blueprint, um JSON que é backup e documentação ao mesmo tempo.
Passo 4, código: Git, o padrão do mercado. Cada commit tem autor, data e motivo.
Passo 5 (frase): o Replit tinha backup e restauração em um clique (The Register, 21/07/2025: o rollback funcionou; 22/07/2025: resposta do CEO). O que faltou não foi backup: foi impedir o agente de mexer onde não devia. "Segurem esse pensamento."
Ponte: agora o tour guiado, no Lovable, sem publicar.`,
    }),
    'O Replit tinha backup. Faltou impedir o agente de mexer onde não devia.',
    'left:120px;top:760px',
  ),

  // S15
  demo({
    title: 'S15 Tour guiado: publicar, sem publicar',
    plataforma: 'lovable',
    titulo: 'Tour guiado: publicar, sem publicar',
    passos: ['O dev: editor e preview', 'A porta: o diálogo Publish, aberto e cancelado', 'Domínio próprio e histórico de versões'],
    duracao: 'Cerca de 3 minutos. Plano gratuito: nada vai ao ar hoje.',
    url: 'lovable.dev/projects/hackathon-lovable-ensaio',
    captura: media('lovable-publish-dialog.png'),
    video: {
      src: media('v-lovable-tour-publicacao.mp4'),
      label: 'Backup: tour do fluxo de publicação no Lovable (sem publicar)',
    },
    cena: 'paineis',
    notes: `Dizer em voz alta antes de sair do deck: "Vou abrir cada porta e explicar o que tem do outro lado, sem atravessar. Hoje nada vai ao ar, e isso é uma escolha: publicar é uma decisão, não um reflexo."
Aba do Lovable, projeto hackathon-lovable-ensaio no editor. Nenhuma aba com URL publicada.
1 O dev: editor com preview ao lado. Trocar o subtítulo por "Inscrições abertas até 15/11" com a edição visual; o preview muda.
2 A porta: clicar em Publish só para abrir o diálogo. Ler o subdomínio sugerido em .lovable.app, as opções de visibilidade e o botão de confirmação. NÃO confirmar.
Explicar: se confirmasse, o Lovable tiraria um snapshot e o colocaria nesse endereço; no Free, qualquer pessoa com o link poderia abrir.
Ainda com o diálogo aberto: mudanças posteriores não vão ao ar sozinhas; o link mostraria a foto antiga até o Publish changes. É o version-test x live do Bubble com outro nome. Cancelar com Esc.
3 Domínio próprio: abrir as configurações de domínio (aviso de plano pago). O Lovable mostraria os registros DNS para o Registro.br e emitiria o certificado. Depois, o histórico de versões: desfazer a troca do subtítulo.
Saída: "Publicar é decidir qual versão o mundo vê, e quem decide a hora é você."
Cuidado: em clique acidental, despublicar em seguida e dizer em voz alta.
Se falhar: tecla V. Corte A: mostrar as capturas lovable-preview-editor.png, lovable-publish-dialog.png, lovable-dominio-pago.png e lovable-historico-versoes.png (pasta media/aula-04) em 45 s.
Fonte: Lovable Docs, Deploy (mudanças posteriores não vão ao ar sozinhas; domínio próprio em plano pago; no Free/Pro, qualquer pessoa com o link vê o app publicado), acesso em 04/10/2026.`,
  }),
];
