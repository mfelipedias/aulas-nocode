import {
  Briefcase,
  Database,
  Calendar,
  CircleHelp,
  GitBranch,
  Globe,
  GraduationCap,
  LayoutTemplate,
  Mail,
  MessagesSquare,
  MousePointerClick,
  Palette,
  ScanLine,
  Smartphone,
  Sparkles,
  Table2,
  Target,
  Users,
  Video,
} from 'lucide';
import {
  chapter,
  definition,
  flow,
  grid,
  imageFull,
  pause,
  quote,
  showcase,
  stat,
  statement,
  timeline,
  twoColumn,
} from '../../archetypes';
import type { SlideDef } from '../../engine/types';
import { TOTAL_CAPITULOS, m } from './comum';

/** Capítulo 3 — O projeto da disciplina (S29–S33) e capítulo 4 — Planejar antes de construir (S34–S45). */
export const bloco34: SlideDef[] = [
  // ---------------------------------------------------------------- Capítulo 3
  chapter({
    title: 'S29 · Capítulo 03',
    numero: 3,
    total: TOTAL_CAPITULOS,
    titulo: 'O projeto da disciplina',
    cena: 'blocos-centro',
    notes: `15 s. "Falei várias vezes em 'nosso evento'. Está na hora de apresentá-lo."`,
  }),

  imageFull({
    title: 'S30 · Hackathon No-Code 2026',
    midia: {
      src: m('hackathon-arte.svg'),
      descricao: 'Arte tipográfica do Hackathon No-Code 2026: grafite, azul elétrico e verde-limão',
      ajuste: 'cobrir',
    },
    legenda: '48 horas para tirar uma ideia do papel. Sem escrever código.',
    detalhe: 'O projeto que nos acompanha nas quatro aulas.',
    cena: 'vazio',
    notes: `A arte usa a identidade do evento (grafite, azul elétrico #2F5BFF, verde-limão #C6F432), não a da aula: exceção autorizada, porque é a identidade do produto.
Ligar ao exercício da Unidade I: a videoaula pediu a tela de inscrição de um evento fictício no papel. Vamos levar esse exercício até o fim.
Hackathon em uma frase: uma maratona, presencial ou online, em que equipes constroem um protótipo de solução para um desafio em prazo curto.
Fonte: projeto-âncora, 00-PLANO-GERAL.md §2.4.`,
  }),

  grid({
    title: 'S31 · A ficha do evento',
    titulo: 'A ficha do evento',
    revelar: 'todos',
    cartoes: [
      { icone: Calendar, titulo: '21 e 22 de novembro', texto: 'Sábado e domingo, em 2026. São 48 horas de evento.' },
      { icone: Globe, titulo: 'Online e gratuito', texto: 'Participação de qualquer lugar, sem custo de inscrição.' },
      { icone: Target, titulo: 'Desafio', texto: 'Soluções para a sua comunidade: bairro, escola ou trabalho.' },
      { icone: Users, titulo: '120 vagas', texto: 'Inscrição individual. Equipes de até 4, formadas na abertura.' },
      { icone: MessagesSquare, titulo: 'Mentoria', texto: 'Mentores acompanham as equipes durante o evento.' },
      { icone: GitBranch, titulo: 'Quatro trilhas', texto: 'Web, Mobile, Automação e IA.' },
    ],
    conclusao: 'Evento fictício. Problema real.',
    cena: 'nevoa',
    notes: `Ficha em 1 minuto: datas, formato, desafio, vagas, mentoria, trilhas.
Passo 1: "Evento fictício. Problema real."
Não usamos a marca da faculdade na página, para ninguém achar que é um evento oficial.
Toda inscrição online passa pelas mesmas perguntas: quem é o público, o que a página precisa ter, onde os dados ficam, quem pode vê-los, quanto custa manter.
Fonte: 00-PLANO-GERAL.md §2.4.`,
  }),

  flow({
    title: 'S32 · Onde vamos chegar',
    titulo: 'Onde vamos chegar',
    subtitulo: 'Na Aula 4: segurança, publicação, custo e consumo do sistema inteiro.',
    nos: [
      { id: 'pagina', rotulo: 'Página', sub: 'de inscrição', tag: 'Aula 1', icone: LayoutTemplate, tipo: 'gatilho', col: 0, linha: 1.5 },
      { id: 'bubble', rotulo: 'Banco e regras', sub: 'Bubble', tag: 'Aula 2', icone: Database, col: 1, linha: 1.5 },
      { id: 'make', rotulo: 'Automação', sub: 'Make', tag: 'Aula 3', plataforma: 'make', col: 2, linha: 1.5 },
      { id: 'planilha', rotulo: 'Planilha', sub: 'Google Sheets', icone: Table2, tipo: 'dado', col: 3, linha: 0 },
      { id: 'email', rotulo: 'E-mail', sub: 'de confirmação', icone: Mail, col: 3, linha: 1 },
      { id: 'ia', rotulo: 'Mensagem', sub: 'personalizada por IA', icone: Sparkles, col: 3, linha: 2 },
      { id: 'checkin', rotulo: 'Check-in', sub: 'app no AppSheet', icone: ScanLine, col: 3, linha: 3 },
    ],
    ligacoes: [
      { de: 'pagina', para: 'bubble' },
      { de: 'bubble', para: 'make' },
      { de: 'make', para: 'planilha' },
      { de: 'make', para: 'email' },
      { de: 'make', para: 'ia' },
      { de: 'make', para: 'checkin' },
    ],
    passos: [['pagina'], ['bubble'], ['make', 'planilha', 'email', 'ia', 'checkin']],
    cena: 'nevoa-suave',
    notes: `Passo 0: só a página, o nó desta aula (borda acesa). "Hoje construímos só o primeiro nó, e nem ele completo: a página que mostra, mas ainda não guarda."
Passo 1: Aula 2, banco de dados com regras no Bubble.
Passo 2: Aula 3, automação no Make: planilha, e-mail de confirmação, mensagem personalizada por IA e app de check-in no celular.
O subtítulo traz a Aula 4: segurança, publicação, custo e consumo.
"Cada aula acende um nó."
Fonte: 00-PLANO-GERAL.md §2.4.`,
  }),

  timeline({
    title: 'S33 · O caminho das quatro aulas',
    titulo: 'O caminho das quatro aulas',
    marcos: [
      { data: '08/10', titulo: 'Do problema ao protótipo', texto: 'Você está aqui: planejamento, wireframe, página por IA.' },
      { data: '15/10', titulo: 'Dando vida às telas', texto: 'Banco, workflow, organização e login.' },
      { data: '22/10', titulo: 'Conectando o mundo', texto: 'Webhook, planilha, e-mail, IA e app de check-in.' },
      { data: '29/10', titulo: 'Publicar e avaliar', texto: 'E o que vem depois: segurança, custo, consumo, IA e agentes.' },
    ],
    cena: 'horizonte',
    notes: `Rápido: o detalhe de cada aula fica para a própria aula.
08/10: planejamento, wireframe e duas versões geradas por IA.
15/10: banco de dados, workflow de inscrição, página da organização, login.
22/10: webhook, planilha, e-mail, IA na automação, app de check-in.
29/10: segurança, LGPD, publicação, custo, consumo, comparação com IA e agentes.
Ponte: "Antes de abrir qualquer ferramenta, a pergunta da Unidade I: por que tantos produtos morrem antes de nascer?"
Fonte: 00-PLANO-GERAL.md §2.4 e §4.`,
  }),

  // ---------------------------------------------------------------- Capítulo 4
  chapter({
    title: 'S34 · Capítulo 04',
    numero: 4,
    total: TOTAL_CAPITULOS,
    titulo: 'Planejar antes\nde construir',
    subtitulo: 'Quem é o público? Qual a identidade? Quais funcionalidades? O que é o MVP?',
    cena: 'horizonte-avanco',
    notes: `As quatro perguntas da videoaula 1 (Unidade I).
"Hoje respondemos as quatro para o nosso evento."`,
  }),

  stat({
    title: 'S35 · Por que produtos morrem',
    contexto: 'Startups que fecharam desde 2023: qual a causa mais citada além de o dinheiro acabar?',
    valor: 43,
    sufixo: '%',
    descricao: 'tinham produto sem aderência ao mercado: construíram algo que pouca gente queria.',
    fonte: 'CB Insights, 05/03/2026: 431 startups com venture capital fechadas desde 2023. Em 70% o dinheiro acabou, causa final e não raiz.',
    cena: 'nevoa',
    notes: `"A videoaula 1 se chama 'Por que 90% dos apps morrem antes de nascer'. O 90% é uma provocação conhecida, sem fonte única. Vamos a um dado com fonte."
Passo 1: 43 de cada 100.
Em 70% dos casos o dinheiro acabou, mas o próprio relatório chama isso de causa final, não de raiz.
"Não foi falta de tecnologia; foi falta de pergunta antes de construir. E o no-code, por ser rápido, aumenta a tentação de pular essa parte."`,
  }),

  grid({
    title: 'S36 · Persona: Camila',
    titulo: 'Persona: Camila, 22 anos',
    subtitulo: 'Uma pessoa representativa do público, com nome, contexto e objetivo.',
    revelar: 'todos',
    cartoes: [
      { icone: GraduationCap, titulo: '1º semestre de ADS', texto: 'Curso a distância. Nunca programou.' },
      { icone: Briefcase, titulo: 'Trabalha de dia', texto: 'Atendimento. Estuda à noite, com pouco tempo livre.' },
      { icone: Smartphone, titulo: 'Vive no celular', texto: 'Acessa quase tudo pelo celular, no ônibus e no intervalo.' },
      { icone: Target, titulo: 'Quer um portfólio', texto: 'Um primeiro projeto concreto para mostrar no LinkedIn.' },
      { icone: CircleHelp, titulo: 'Antes de se inscrever', texto: 'É pago? Preciso programar? Preciso ter equipe?' },
    ],
    conclusao: 'Não-público: desenvolvedores experientes procurando competição de alto nível.',
    cena: 'nevoa-esquerda',
    notes: `Persona transforma "o público é jovem" em "a Camila entenderia este botão no celular, no ônibus?".
Medo dela: não acompanhar quem já sabe programar.
Passo 1: o não-público. Dizer quem não é o público orienta o tom: nada de prêmio, ranking, stack técnica. Para a Camila, isso afasta.
Sem foto: não usamos banco de imagens.
Fonte: 00-PLANO-GERAL.md §2.4.`,
  }),

  definition({
    title: 'S37 · Frase-problema',
    termo: 'Frase-problema',
    origem: 'o modelo',
    definicao: 'Para [público], que [situação ou dor], o [produto] oferece [benefício].',
    exemplo: {
      titulo: 'O nosso evento',
      texto: 'Para iniciantes em tecnologia, que querem um primeiro projeto de portfólio mas não sabem por onde começar, o Hackathon No-Code 2026 oferece 48 horas online, equipe e mentoria.',
    },
    cena: 'nevoa-suave',
    notes: `Ler o modelo: para quem, que dor, qual produto, qual benefício.
Passo 1: a versão preenchida (o slide traz a forma curta). Frase completa para ler em voz alta:
"Para estudantes no início de tecnologia e pessoas sem experiência em programação, que querem um primeiro projeto de portfólio mas não sabem por onde começar, o Hackathon No-Code 2026 oferece 48 horas online, equipe e mentoria para tirar uma ideia do papel sem escrever código."
A frase vira o título, o apoio e o primeiro parágrafo do prompt.
"Se você não consegue escrevê-la, ainda não sabe o que está construindo."`,
  }),

  twoColumn({
    title: 'S38 · Identidade visual',
    titulo: 'A cor fala antes do texto',
    topicos: [
      { icone: Palette, titulo: 'Grafite', texto: 'Tecnologia sem formalidade: a base da página.', zoom: { x: 0, y: 0, w: 50, h: 52 } },
      { icone: MousePointerClick, titulo: 'Azul elétrico', texto: 'Só na ação principal: é onde o olho deve terminar.', zoom: { x: 33, y: 0, w: 67, h: 80 } },
      { icone: Sparkles, titulo: 'Verde-limão', texto: 'Só em detalhes. Nunca como texto sobre fundo claro.', zoom: { x: 50, y: 0, w: 50, h: 52 } },
    ],
    visual: {
      tipo: 'midia',
      moldura: 'navegador',
      url: 'identidade-visual',
      midia: {
        src: m('identidade-evento.svg'),
        descricao: 'Amostras de cor do evento (#1A1D24, #2F5BFF, #C6F432) e o botão Quero minha vaga',
        ajuste: 'conter',
        posicao: 'center',
      },
    },
    cena: 'vazio',
    notes: `Fundo vazio: as cores do evento não podem competir com a névoa azul da aula.
Um tópico por passo; a amostra correspondente se aproxima.
Cada cor tem função, não gosto. A cor do botão é a mais importante: é onde o olho deve terminar.
Verde-limão nunca como texto sobre fundo claro (contraste ruim).
Exemplo da Unidade I: sistema financeiro, cores sóbrias; app infantil, vibrantes. O nosso: moderno, sem parecer competição de elite.
Tipografia geométrica; tom jovem, direto e confiante.`,
  }),

  quote({
    title: 'S39 · Eric Ries',
    texto: 'O MVP é a menor entrega capaz de gerar aprendizado validado, com o menor esforço.',
    autor: 'Eric Ries',
    obra: 'A Startup Enxuta, 2011, paráfrase da Unidade I',
    cena: 'nevoa-centro',
    notes: `Paráfrase usada na Unidade I.
Enfatizar a palavra "aprendizado": MVP não é versão capenga. É um experimento.`,
  }),

  statement({
    title: 'S40 · Construir × aprender',
    partes: ['O que eu quero\nconstruir?', 'O que eu preciso\naprender?'],
    apoio: 'Steve Blank: “Não existem fatos dentro do escritório. Saia.” Nosso teste: a Camila se inscreve quando entende a proposta?',
    cena: 'blocos-centro',
    notes: `Parte 1 sozinha. Passo 1: a pergunta muda, e a primeira recua.
"Para o nosso evento, o que precisamos aprender primeiro? Não é se o formulário salva no banco. É se pessoas como a Camila se inscrevem quando entendem a proposta."
Métrica: inscrições divididas por visitas. Exemplo ilustrativo (não é referência de mercado): 60 inscrições em 1.000 visitas = 6%.
A própria landing page é o experimento. Blank: a resposta está com o público.
Fonte: Blank (2005), conforme a Unidade I.`,
  }),

  grid({
    title: 'S41 · Buffer e Dropbox',
    titulo: 'MVPs que nem eram o produto',
    cartoes: [
      { icone: LayoutTemplate, tag: '2010', titulo: 'Buffer', itens: ['Landing page de 2 páginas', 'Produto ainda não existia', '7 semanas para construir depois', '1º cliente pagante em 4 dias'] },
      { icone: Video, tag: '2007', titulo: 'Dropbox', itens: ['Vídeo de ~3 min do produto', 'Mostrava como funcionaria', 'Lista de espera: 5.000 a 75.000', 'Praticamente da noite para o dia'] },
    ],
    conclusao: 'A nossa página de inscrição é esse tipo de experimento.',
    fonte: 'Buffer, 16/02/2011 (antiga); Dropbox: Ries, A Startup Enxuta (2011), resumo em Shortform (secundária).',
    cena: 'paineis',
    notes: `Passo 1: Buffer. Joel Gascoigne publicou uma página explicando um produto que não existia; quem clicava em "Planos e preços" deixava o e-mail. Só depois construiu, em 7 semanas.
Passo 2: Dropbox. Drew Houston gravou um vídeo de cerca de 3 minutos. A lista de espera do beta foi de 5.000 para 75.000.
Passo 3: "Uma página e um vídeo. Nenhum dos dois era o produto, e os dois responderam: alguém quer isso?"
Casos antigos: dizer o ano.`,
  }),

  showcase({
    title: 'S42 · Skate e carro',
    titulo: 'Entregue algo usável a cada passo',
    midia: {
      src: m('mvp-skate-carro.svg'),
      descricao: 'Duas sequências: roda, eixo, carroceria e carro; skate, patinete, bicicleta, moto e carro',
      ajuste: 'conter',
      posicao: 'center',
    },
    moldura: 'navegador',
    anotacoes: [
      { x: 6, y: 9, titulo: 'Assim não', texto: 'Roda, eixo, carroceria: só a última etapa serve para alguma coisa.' },
      { x: 6, y: 57, titulo: 'Assim sim', texto: 'O skate do evento: a página que capta inscrições.' },
    ],
    fonte: 'Ideia de Henrik Kniberg, Crisp, 25/01/2016. Ilustração própria.',
    cena: 'nevoa-suave',
    notes: `É a imagem da videoaula 2, redesenhada aqui (não copiamos a original).
Passo 1: a linha de cima. A necessidade é se locomover; uma roda sozinha não serve.
Passo 2: a linha de baixo. Um skate já serve. Cada etapa entrega algo usável.
O próprio Kniberg avisa: é metáfora, não manual. Nunca deixar de entregar algo usável.
O skate do nosso evento é a página que capta inscrições; o carro é o sistema completo da Aula 4.`,
  }),

  grid({
    title: 'S43 · O MoSCoW do evento',
    titulo: 'O MoSCoW do evento',
    cartoes: [
      { titulo: 'Must: o MVP', destaque: true, itens: ['Título e apoio: o quê, quando, onde', 'Nome, E-mail e Telefone', 'Botão “Quero minha vaga”', 'Salvar e confirmar a inscrição'] },
      { titulo: 'Should', itens: ['Imagem do evento', 'E-mail de confirmação automático', 'Bloqueio de inscrição duplicada', 'Escolha de trilha'] },
      { titulo: 'Could', itens: ['“Como conheceu o evento?”', 'Contador de vagas restantes', 'App de check-in', 'Mensagem personalizada por IA'] },
      { titulo: 'Won’t (por enquanto)', itens: ['Pagamento', 'Login do participante', 'Ranking de equipes', 'Chat entre participantes'] },
    ],
    conclusao: 'Interessante não é o mesmo que necessário.',
    cena: 'nevoa-suave',
    notes: `Uma coluna por passo. O Must tem cinco itens no gabarito: "Salvar a inscrição" e "Mensagem de confirmação" estão juntos no último.
Por que Telefone é Must? O público vive no celular; o contato durante as 48 horas será por mensagem.
Por que a mensagem de confirmação é Must? Sem ela a pessoa não sabe se deu certo e se inscreve de novo, ou desiste.
Won't: pagamento (o evento é gratuito); login (atrito numa página de objetivo único); ranking (contradiz o não-público); chat (complexo e fora do objetivo).
"Could não é nunca; é quando ficar barato." Check-in e IA voltam na Aula 3.
Último passo: o erro clássico da Unidade I, confundir interessante com necessário.
Fonte: 00-PLANO-GERAL.md §2.4 (gabarito).`,
  }),

  quote({
    title: 'S44 · Reid Hoffman',
    texto: 'Se você não tem vergonha da primeira versão do seu produto, lançou tarde demais.',
    autor: 'Reid Hoffman',
    obra: 'cofundador do LinkedIn, frase citada na Unidade I',
    cena: 'nevoa-centro',
    notes: `30 s. A frase autoriza produto pequeno, não produto ruim.`,
  }),

  pause({
    title: 'S45 · Pause o vídeo: o seu MoSCoW',
    pergunta: 'Pense numa ideia sua de app. Liste 3 itens Must e 1 Won’t. Assistindo à gravação? Pause e faça em 3 minutos.',
    resposta: 'Tela de notas. Must: nomes, campo de nota, salvar. Should: Tab. Could: relatório. Won’t: trocar a cor.',
    detalhe: 'Exemplo da videoaula 2. Seus Must, sozinhos, já permitem a tarefa principal?',
    segundos: 60,
    chat: 'Se estiver ao vivo, escreva um Must no chat.',
    cena: 'nevoa',
    notes: `Anel de 60 s ao vivo. Para a gravação: "Pause o vídeo agora e faça em 3 minutos." Tecla T pausa.
Durante o anel, contar o que estaria fazendo no lugar do aluno.
Revelação: tela de lançamento de notas. Must: nomes dos alunos, campo de nota, botão salvar. Should: tecla Tab para pular de aluno. Could: relatório de notas não lançadas. Won't: trocar a cor do sistema.
Se um Must é dispensável para a tarefa principal, é Should. Mais de cinco Must? Talvez algum seja Should disfarçado.
Com alunos: classificar em voz alta dois Must do chat.
Fonte: Unidade I, videoaula 2 (exemplo da videoaula).
Ponte: "Sabemos o que entra. Agora, como isso vira uma tela que a Camila entende em segundos?"`,
  }),
];
