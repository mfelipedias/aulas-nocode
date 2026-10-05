import {
  BadgeDollarSign,
  BrainCircuit,
  FlaskConical,
  LayoutGrid,
  Mail,
  MousePointerClick,
  Smartphone,
  Table2,
  TriangleAlert,
  Users,
} from 'lucide';
import { bulletsRich, chapter, dataModel, demo, flow, grid, pause, showcase } from '../../archetypes';
import type { SlideDef } from '../../engine/types';

/** Capítulo 7: O app nasce da tabela (S51 a S58, 20h04 a 20h18). */
export const bloco7: SlideDef[] = [
  // S51
  chapter({
    numero: 7,
    total: 8,
    titulo: 'O app nasce\nda tabela',
    subtitulo: 'Eu não desenho a tela: declaro os dados, e a ferramenta deduz o app.',
    cena: 'grafo-amplo',
    notes: `Transição de 10 segundos. Marcador 64:00.
"A organização do hackathon não vai abrir o Make na porta do evento. Ela precisa de um app no celular. E esse app vai nascer da planilha."`,
  }),

  // S52
  dataModel({
    titulo: 'Da planilha ao app',
    entidades: [
      {
        id: 'planilha',
        nome: 'inscricoes (planilha)',
        icone: Table2,
        campos: [
          { nome: 'id', tipo: 'text', chave: 'pk' },
          { nome: 'nome', tipo: 'text' },
          { nome: 'trilha', tipo: 'text' },
          { nome: 'presente', tipo: 'TRUE/FALSE' },
        ],
      },
      {
        id: 'app',
        nome: 'App de check-in',
        icone: Smartphone,
        campos: [
          { nome: 'identidade', tipo: 'KEY', chave: 'pk' },
          { nome: 'título do item', tipo: 'LABEL' },
          { nome: 'grupo da lista', tipo: 'Enum' },
          { nome: 'botão de marcar', tipo: 'Yes/No' },
        ],
      },
    ],
    relacoes: [
      { de: 'planilha.id', para: 'app.identidade', cardinalidade: '', rotulo: 'chave única' },
      { de: 'planilha.nome', para: 'app.título do item', cardinalidade: '', rotulo: 'cada linha' },
      { de: 'planilha.trilha', para: 'app.grupo da lista', cardinalidade: '', rotulo: 'cabeçalho' },
      { de: 'planilha.presente', para: 'app.botão de marcar', cardinalidade: '', rotulo: 'tipo da coluna' },
    ],
    passos: [['planilha'], ['app']],
    conclusao: 'Eu declaro os dados. A ferramenta deduz a tela.',
    notes: `"Aqui o paradigma muda de novo. No Bubble eu desenhei telas. Aqui eu não desenho nada."
Passo 0: a planilha, com os nomes exatos das colunas.
Passo 1: o app e as ligações. "O cabeçalho vira o nome dos campos. Cada linha vira um item da lista. O tipo da coluna vira o componente: uma coluna sim ou não vira um botão de marcar. E a chave única vira a identidade do registro. Sem chave, o app não sabe qual linha está editando."
Passo 2: a frase.
Adaptação: o storyboard pedia uma tabela e um telefone desenhados com 4 passos; o arquétipo dataModel mostra as duas estruturas e as 4 ligações de uma vez.
Ponte: quem faz app a partir de dados.`,
  }),

  // S53
  grid({
    titulo: 'Quem faz app a partir de dados',
    cartoes: [
      { icone: Smartphone, titulo: 'AppSheet (Google)', texto: 'Testar com até 10 usuários de graça; publicar é pago.' },
      { plataforma: 'glide', titulo: 'Glide', texto: 'GlideOS Free: 0 apps publicados.' },
      { plataforma: 'softr', titulo: 'Softr', texto: 'Free: 5 usuários de app e 5.000 registros. Lê Google Sheets.' },
      { icone: LayoutGrid, titulo: 'Power Apps (Microsoft)', texto: 'Developer Plan: criar e testar, sem ir para produção.' },
    ],
    conclusao: 'Todos deixam construir de graça. E cobram para publicar.',
    fonte: 'about.appsheet.com/pricing; glideapps.com/pricing; Softr blog (atualizado em 24/09/2026); Microsoft Power Apps pricing. Acesso em 04/10/2026.',
    notes: `Um cartão por passo.
Passo 1: AppSheet, do Google: cria e testa com até 10 usuários sem pagar; publicar é pago.
Passo 2: Glide virou GlideOS em agosto de 2026, e o plano gratuito novo publica zero apps.
Passo 3: Softr: o gratuito tem 5 usuários de app e 5 mil registros, e lê Google Sheets. É o plano B da demo.
Passo 4: Power Apps, da Microsoft: o plano de desenvolvedor cria e testa, mas não vai para produção.
Passo 5: "Reparem no padrão: todo mundo deixa construir de graça e cobra para publicar. Guardem isso para a Aula 4."
AppSheet e Power Apps aparecem com ícone genérico e nome (marcas restritas). Glide pelo simple-icons, Softr oficial.
Ponte: o que dá para fazer de graça no AppSheet.`,
  }),

  // S54
  bulletsRich({
    titulo: 'AppSheet: o que dá para fazer de graça',
    subtitulo: 'Não foi anunciado encerramento. Mas é um sinal de risco de plataforma.',
    itens: [
      { icone: Users, titulo: 'Até 10 usuários de teste', texto: 'Contando você. Cobre a equipe de check-in do hackathon.' },
      { icone: FlaskConical, titulo: 'O app fica em Prototype', texto: 'O estado aparece em Manage, Deploy.' },
      { icone: BadgeDollarSign, titulo: 'Publicar é pago', texto: 'A partir de US$ 5 por usuário por mês.' },
      { icone: TriangleAlert, titulo: '15/05/2026: menos recursos novos', texto: 'O Google anunciou que vai reduzir o desenvolvimento de novos recursos.' },
    ],
    fonte: 'about.appsheet.com/pricing; AppSheet Help, Deploy; Google Developer forums, AppSheet 2026 Product Strategy Update (15/05/2026). Acesso em 04/10/2026.',
    notes: `Um item por passo.
Passo 1: até 10 usuários de teste, contando você. "Dez usuários cobrem a equipe de check-in do hackathon com folga."
Passo 2: o app fica em estado de protótipo, e isso aparece em Manage, Deploy.
Passo 3: para publicar de verdade, a partir de 5 dólares por usuário por mês; o plano Core vem na maioria dos planos pagos do Google Workspace.
Passo 4: "Em maio de 2026, a equipe do AppSheet publicou que vai priorizar estabilidade e que o desenvolvimento de novos recursos seria significativamente reduzido. Não anunciaram encerramento. Mas é exatamente o tipo de sinal que vamos discutir na Aula 4: o que acontece com o seu app quando a plataforma para de evoluir?"
Sem captura do Google (decisão C7): a interface real aparece só na demo.
Ponte: para o AppSheet.`,
  }),

  // S55
  demo({
    plataforma: 'appsheet',
    titulo: 'App de check-in a partir da planilha',
    passos: [
      'Criar o app a partir da planilha',
      'Ajustar colunas: chave, presente como Yes/No',
      'View de check-in e ação “Fazer check-in”',
      'Testar no emulador e compartilhar',
    ],
    duracao: 'Cerca de 8 minutos',
    url: 'appsheet.com',
    captura: 'media/aula-03/esquema-planilha-para-app.svg',
    video: { src: 'media/aula-03/demo-appsheet.mp4', label: 'Backup: AppSheet a partir da planilha' },
    title: 'Demo: app de check-in no AppSheet',
    notes: `Antes de trocar: conferir se a planilha tem 5 linhas ou mais; se não, colar o seed (20 s).
1. Na planilha: Extensions, AppSheet, Create an app. Menu cinza: appsheet.com, Create, App, Start with existing data.
2. Data, inscricoes, Columns: KEY em id, LABEL em nome; email = Email, telefone = Phone, datas = DateTime, presente = Yes/No.
3. Views: Deck, agrupar por trilha, ordenar por nome, nome Check-in.
4. Actions: "Fazer check-in", set presente = TRUE e checkin_em = NOW(), só se NOT([presente]).
5. Emulador: check-in da Ana; a planilha muda. Share (cancelar), Manage, Deploy = Prototype. Não publicar.
Corte G (menos 1 min 45 s): pular a ação e marcar presença editando o registro.
Falha total: app pronto "Check-in Hackathon (pronto)" ou tecla V (demo-appsheet.mp4). Plano B Softr: demo-softr.mp4.
A moldura mostra um esquema desenhado (planilha que vira app), não captura do Google (decisão C7).
Passo a passo completo: conteudo.md, seção 7.5.`,
  }),

  // S56
  showcase({
    titulo: 'O app de check-in',
    midia: { src: 'media/aula-03/esquema-app-checkin.svg', descricao: 'Esquema do app de check-in: busca, lista agrupada por trilha e botão Fazer check-in' },
    moldura: 'celular',
    anotacoes: [
      { x: 84, y: 27, titulo: 'Lista agrupada por trilha', texto: 'A coluna trilha virou grupo; o nome virou o título do item.' },
      { x: 86, y: 19, titulo: 'Busca por nome', texto: 'Vem pronta: ninguém desenhou este campo.' },
      { x: 78, y: 52, titulo: 'Um toque', texto: 'Presença gravada na planilha, com a hora do check-in.' },
    ],
    notes: `Síntese de 40 segundos. Uma anotação por passo.
1. A lista agrupada por trilha.
2. A busca por nome.
3. Um toque em "Fazer check-in": presente vira TRUE e checkin_em recebe a hora, na planilha.
"Marquei presença no celular e a planilha mudou. É o padrão sincronização do capítulo 5."
A tela é um esquema desenhado (esquema-app-checkin.svg). Se a decisão C7 liberar capturas do Google, trocar por appsheet-emulador.png (1170 x 2532).
Ponte: a prova final, ao vivo.`,
  }),

  // S57
  flow({
    titulo: 'Prova final: ponta a ponta, ao vivo',
    nos: [
      { id: 'bubble', rotulo: 'Bubble salvou', sub: 'Marina, trilha Mobile', icone: MousePointerClick, tipo: 'gatilho', col: 0, linha: 0 },
      { id: 'make', rotulo: 'Make recebeu', sub: 'execução no History', plataforma: 'make', col: 1, linha: 0 },
      { id: 'ia', rotulo: 'IA escreveu', sub: 'classificou e escreveu', icone: BrainCircuit, col: 2, linha: 0 },
      { id: 'planilha', rotulo: 'Nova linha', sub: 'na planilha', icone: Table2, tipo: 'dado', col: 3, linha: 0 },
      { id: 'gmail', rotulo: 'E-mail chegou', sub: 'com a mensagem da IA', icone: Mail, col: 2, linha: 1 },
      { id: 'app', rotulo: 'Nome no app', sub: 'check-in na porta', icone: Smartphone, tipo: 'externo', col: 3, linha: 1 },
    ],
    ligacoes: [
      { de: 'bubble', para: 'make', rotulo: 'POST' },
      { de: 'make', para: 'ia' },
      { de: 'ia', para: 'planilha' },
      { de: 'ia', para: 'gmail', rotulo: 'mensagem' },
      { de: 'planilha', para: 'app', rotulo: 'sincroniza' },
    ],
    passos: [[], ['bubble'], ['make'], ['ia'], ['planilha'], ['gmail'], ['app']],
    cronometro: { inicio: 1, rotulo: 'desde o clique' },
    title: 'Prova final, ao vivo',
    notes: `Fecha o arco da abertura. Nunca cortar. O professor alterna entre ferramenta e deck: só avança quando a aba confirmar.
Preparação: cenário ligado com IA, AppSheet aberto no emulador; abas na ordem Bubble preview, Make History, planilha, Gmail, AppSheet.
"No começo da aula vocês viram isto num vídeo. Agora vocês sabem o que é cada peça." O cronômetro do canto (00:00) começa sozinho no passo 1, quando a Marina clica em "Quero minha vaga"; a tecla T pausa e retoma.
Passo 1: preview do Bubble, Marina Exemplo, trilha Mobile, ideia "Bot que avisa a turma quando sai nota nova no AVA". Confirmação na tela.
Passo 2: Make History, execução nova.
Passo 3: abrir a execução: categoria sugerida (esperado: IA) e a mensagem.
Passo 4: planilha, linha da Marina com trilha_sugerida e mensagem_ia.
Passo 5: Gmail, e-mail para +marina com a mensagem da IA.
Passo 6: AppSheet, sincronizar, Marina no grupo Mobile, tocar Fazer check-in.
"Nenhuma dessas etapas eu fiz à mão, a não ser o clique da Marina e o check-in na porta."
Se algo falhar: dizer onde parou ("o Make recebeu, a IA não respondeu: é o History que me conta") e tecla V (prova-final.mp4). Sincronizar o AppSheet não é falha.`,
    video: { src: 'media/aula-03/prova-final.mp4', label: 'Backup: prova final gravada na véspera' },
  }),

  // S58
  pause({
    pergunta: 'A presença foi marcada no app. O que mais o sistema poderia fazer sozinho a partir disso?',
    resposta: 'Enviar certificado por e-mail, atualizar o painel de presentes, avisar a equipe que falta alguém.',
    detalhe: 'É o padrão sincronização mais notificação.',
    segundos: 20,
    chat: 'Se estiver ao vivo, responda no chat.',
    notes: `Ler a pergunta e deixar o anel correr (20 s).
Com alunos: ler respostas do chat.
Gabarito: certificado de participação por e-mail; painel de presentes; aviso quando faltar alguém de um time. Padrão sincronização mais notificação.
Caminhos: Google Sheets, Watch Changes no Make; ou Automation (bots) dentro do próprio AppSheet. Fica como exercício.
Ponte: "Vamos olhar o que construímos."`,
  }),
];
