import { DatabaseZap, EyeOff, Image, KeyRound, ScrollText, ServerCog, Settings, ShieldCheck, Target, UserX, X, Scale, Siren } from 'lucide';
import { chapter, code, definition, demo, grid, stat, twoColumn } from '../../archetypes';
import type { SlideDef } from '../../engine/types';
import { media } from './helpers';

/** Capítulo 3: Segurança, o que o app entrega sem você ver (S16–S25). */
export const bloco3: SlideDef[] = [
  // S16
  chapter({
    title: 'S16 Bloco 3: Segurança',
    numero: 3,
    total: 9,
    titulo: 'O que o seu app\nentrega sem você ver',
    subtitulo: 'Segurança: o servidor entrega o que você deixa, não o que a tela mostra.',
    cena: 'horizonte-avanco',
    notes: `Abertura do capítulo de segurança (15 s).
"Antes de apertar esse botão um dia, a pergunta que separa um projeto de estudante de um produto: está seguro?"`,
  }),

  // S17
  stat({
    title: 'S17 170 de 1.645',
    contexto: 'Um pesquisador testou só as páginas iniciais de 1.645 apps feitos no Lovable.',
    valor: 10.3,
    casas: 1,
    sufixo: '%',
    descricao: 'dos projetos (170) devolviam dados que não deveriam: e-mails, pagamentos, chaves de API. Virou o CVE-2025-48757.',
    fonte: 'Matt Palmer, “Statement on CVE-2025-48757”, 29/05/2025 (acesso em 04/10/2026).',
    cena: 'nevoa',
    notes: `Passo 0: em março de 2025, o engenheiro Matt Palmer percebeu que, mexendo numa requisição normal do navegador, dava para ler a tabela inteira de usuários de um site feito no Lovable.
Com um colega, escreveu um script que visitou a página inicial de 1.645 projetos da vitrine e repetiu cada consulta pedindo "tudo".
Passo 1: 303 pontos de acesso em 170 projetos, cerca de 10,3%, devolviam e-mails, dados de pagamento e chaves de API de outros serviços. Virou o CVE-2025-48757, publicado em 29/05/2025.
Frisar: só as páginas iniciais, sem login. É o mínimo do mínimo.
Ponte: e não foi um caso isolado.`,
  }),

  // S18
  grid({
    title: 'S18 Quatro incidentes, uma causa',
    titulo: 'Quatro incidentes, uma causa',
    cartoes: [
      {
        plataforma: 'supabase',
        tag: '2025',
        titulo: 'Lovable + Supabase',
        texto: 'E-mails, pagamentos e chaves expostos. Causa: tabelas sem RLS.',
      },
      {
        icone: Image,
        tag: 'jul/2025',
        titulo: 'Tea',
        texto: '~72 mil imagens, ~13 mil selfies e documentos. Causa: armazenamento Firebase aberto.',
      },
      {
        icone: KeyRound,
        tag: 'jul/2025',
        titulo: 'Base44',
        texto: 'Apps privados acessíveis com o app_id. Falha de autenticação, corrigida em menos de 24 h.',
      },
      {
        icone: DatabaseZap,
        tag: 'jan/2026',
        titulo: 'Moltbook',
        texto: '1,5 mi de tokens de API e ~35 mil e-mails. Causa: Supabase sem RLS.',
      },
    ],
    conclusao: 'O servidor aceitava qualquer pedido. Ninguém escreveu a regra de quem pode ver o quê.',
    fonte: 'Matt Palmer, 29/05/2025; Engadget, 25/07/2025; Wiz Research, jul/2025 (Base44) e 2026 (Moltbook).',
    cena: 'nevoa-suave',
    notes: `Um caso por passo.
1 Lovable + Supabase (2025): tabelas sem RLS, a regra que diz quem pode ler cada linha. O que acabamos de ver.
2 Tea (jul/2025): app americano guardava selfies e fotos de documentos num armazenamento do Firebase aberto à internet. ~72 mil imagens vazaram, ~13 mil selfies e documentos (Engadget).
3 Base44 (jul/2025): plataforma de apps por IA comprada pela Wix. Bastava o app_id, que é público, para criar conta dentro de um app privado. A Wiz avisou, a Wix corrigiu em menos de 24 h, sem indício de exploração.
4 Moltbook (jan/2026): rede social de agentes de IA feita às pressas, Supabase sem RLS: 1,5 milhão de tokens de API e ~35 mil e-mails expostos; corrigido em horas.
Passo 5: três dos quatro têm a mesma causa. Nenhum exigiu "hacker de filme": bastou fazer a pergunta certa ao servidor.
Tea, Base44, Moltbook e Firebase aparecem só como nome.`,
  }),

  // S19
  definition({
    title: 'S19 Regra de privacidade',
    termo: 'Regra de privacidade',
    origem: 'privacy rule (Bubble); RLS, row level security (Supabase)',
    definicao: 'A condição que o servidor confere antes de entregar um dado ao navegador.',
    exemplo: {
      titulo: 'A frase para levar',
      texto: 'Esconder na tela não é proteger.',
    },
    fonte: 'Bubble Manual, “Protecting data with privacy rules” (acesso em 04/10/2026).',
    cena: 'nevoa-centro',
    notes: `Regra de privacidade: privacy rule no Bubble, Row Level Security (RLS) no Supabase e no Lovable Cloud.
É a condição que o SERVIDOR confere antes de entregar um dado ao navegador.
O manual do Bubble é explícito: sem regras, os dados de um tipo ficam acessíveis publicamente; as regras são aplicadas no servidor, antes de o dado sair.
Passo 1: a frase para levar. Esconder na tela não é proteger.
Ponte: vamos ver isso acontecer no nosso app.`,
  }),

  // S20
  demo({
    title: 'S20 Demo: o vazamento no nosso app',
    plataforma: 'bubble',
    titulo: 'O vazamento no nosso app',
    passos: ['Ver o vazamento numa página inofensiva', 'Fechar com uma privacy rule', 'Provar que o formulário continua salvando'],
    duracao: 'Cerca de 6 minutos. App próprio, dados fictícios.',
    url: 'hackathon-seguranca.bubbleapps.io/version-test/inscritos',
    captura: media('bubble-pagina-inscritos.png'),
    video: {
      src: media('v-vazamento-privacy.mp4'),
      label: 'Backup: o vazamento e a privacy rule no Bubble',
    },
    cena: 'paineis',
    notes: `Aviso de ética, em voz alta, antes de sair do deck: "Vou fazer isso no MEU app, com dados INVENTADOS. Fazer isso no app dos outros sem autorização é antiético e pode ser crime (Lei 12.737/2012). Achou uma falha num app alheio? Avise o responsável, como o Matt Palmer fez. Isso se chama divulgação responsável."
1 Aba anônima: .../version-test/inscritos. "Uma página de prova social. Parece inofensiva."
2 F12, Network já aberta, zoom 150%. Filtrar por msearch, Ctrl+R, abrir a resposta e expandir o primeiro resultado: nome, email, telefone de todos os 20. "A tela mostrou o primeiro nome. O servidor mandou tudo."
3 Editor: Data > Privacy > Inscricao. Regra "Organizador": Current User's papel is organizador, com View all fields, Find this in searches e View attached files.
Everyone else: só o campo nome; manter Find this in searches; desmarcar View attached files e Allow auto-binding. "Visitante vê só o nome. Organizador logado vê tudo."
4 Aba anônima: recarregar. email e telefone sumiram; a página continua igual.
5 Inscrição nova (Participante Teste 21, teste21@example.com, (00) 90000-0021): a confirmação aparece. "Ver e criar são permissões diferentes."
6 App data > Inscricao: o registro 21 está lá. Se houver tempo: logado como organizador, página organizacao com todos os campos.
Variantes (decidir na véspera): Data API ou página "relatorio" esquecida.
Se falhar: tecla V e seguir para S21.`,
  }),

  // S21
  code({
    title: 'S21 A resposta do servidor',
    titulo: 'Mesma página. Outra resposta.',
    arquivo: 'Resposta da busca, aba Network do DevTools',
    linguagem: 'js',
    codigo: `
      // antes: visitante anônimo
      { "nome": "Camila Persona",
        "email": "camila.persona@example.com",
        "telefone": "(00) 90000-0001",
        "trilha": "IA" }

      // depois: com a privacy rule
      { "nome": "Camila Persona" }
    `,
    passos: [
      {
        linhas: '3-4',
        nota: 'O que a tela não mostrava, mas o servidor entregava a qualquer visitante.',
      },
      {
        linhas: '7-8',
        nota: 'O que o servidor aceita entregar agora. A página continua igual.',
      },
    ],
    cena: 'vazio',
    notes: `De volta ao deck: a mesma resposta, ampliada e simplificada. Dados 100% fictícios (domínio example.com, DDD 00).
Passo 1: e-mail e telefone, que a tela não mostrava e o servidor entregava.
Passo 2: depois da privacy rule, só o nome.
Frase: "O que mudou não foi a página. Foi o que o servidor aceita entregar."
Se o DevTools ficou ilegível na demo, as capturas de apoio estão em media/aula-04: devtools-vazamento-antes.png, devtools-vazamento-depois.png, bubble-privacy-regra.png.`,
  }),

  // S22
  grid({
    title: 'S22 OWASP: seis riscos no nosso app',
    titulo: 'Seis riscos da OWASP no nosso app',
    cartoes: [
      {
        icone: EyeOff,
        tag: 'CD-SEC-01',
        titulo: 'Confiança cega',
        texto: 'Aceitar o que a IA gerou sem conferir.',
      },
      {
        icone: UserX,
        tag: 'CD-SEC-03',
        titulo: 'Autorização',
        texto: 'Organização sem exigir o papel certo.',
      },
      {
        icone: DatabaseZap,
        tag: 'CD-SEC-04',
        titulo: 'Vazamento de dados',
        texto: 'O que acabamos de ver na demo.',
      },
      {
        icone: KeyRound,
        tag: 'CD-SEC-05',
        titulo: 'Autenticação e HTTPS',
        texto: 'Senha fraca, app sem HTTPS.',
      },
      {
        icone: Settings,
        tag: 'CD-SEC-07',
        titulo: 'Configuração insegura',
        texto: 'Planilha aberta a quem tem o link.',
      },
      {
        icone: ScrollText,
        tag: 'CD-SEC-10',
        titulo: 'Logs e monitoramento',
        texto: 'Vazamento descoberto por terceiros.',
      },
    ],
    revelar: 'todos',
    conclusao: 'Pause o vídeo: liste os campos do seu app e quem deve ver cada um.',
    fonte: 'OWASP Citizen Development Top 10 (2022; ex-Low-Code/No-Code Top 10), repositório e página CD-SEC-01 (acesso em 04/10/2026).',
    cena: 'nevoa-suave',
    notes: `A OWASP, principal comunidade aberta de segurança de aplicações, mantém o Citizen Development Top 10 (antes Low-Code/No-Code Top 10), ampliado para código gerado por IA e agentes.
Seis itens no nosso app: confiança cega; autorização (organização sem papel); vazamento (a demo); autenticação e HTTPS; configuração insegura (Data API ligada sem necessidade, planilha "qualquer pessoa com o link"); logs e monitoramento (ninguém olha; vazamento descoberto por terceiros).
O primeiro se chama Blind Trust, confiança cega: tratar o que a plataforma gerou como seguro por padrão. Guardem o nome: é a ponte para a segunda metade da aula.
Passo 1, sala vazia: "Pause o vídeo. Tabela com os campos do seu app e, ao lado, quem deve ver: visitante, o próprio inscrito, organizador. Dois minutos."
Com alunos: mesmo exercício em 60 s no chat, com um campo só.
Corte B: dizer só os três primeiros riscos.`,
  }),

  // S23
  twoColumn({
    title: 'S23 Chave de API nunca no cliente',
    titulo: 'Tudo o que vai ao navegador é público',
    topicos: [
      {
        icone: X,
        titulo: 'Chave numa página ou num campo',
        texto: 'Qualquer visitante lê no código da página, com duas teclas.',
        zoom: { x: 0, y: 4, w: 56, h: 92 },
      },
      {
        icone: ServerCog,
        titulo: 'Chave no servidor',
        texto: 'API Connector privado no Bubble, conexão do Make, Secrets do Lovable.',
        zoom: { x: 44, y: 4, w: 56, h: 92 },
      },
      {
        icone: ShieldCheck,
        titulo: 'A chave pública do Supabase',
        texto: 'Só é segura com RLS ligada. Foi o que falhou no CVE e no Moltbook.',
      },
    ],
    visual: {
      tipo: 'midia',
      moldura: 'nenhuma',
      proporcao: '860 / 620',
      midia: {
        src: media('esquema-chave-navegador-servidor.svg'),
        descricao: 'Esquema: chave no navegador (pública) e chave no servidor (privada)',
        ajuste: 'conter',
        posicao: 'center',
      },
    },
    cena: 'nevoa-esquerda',
    notes: `Tudo o que vai para o navegador é público, inclusive o código. Na Aula 3 usamos chaves de API.
Passo 1, errado: chave colada numa página, num campo de texto, num código que roda no navegador. O esquema amplia o lado do navegador.
Passo 2, certo: chave no servidor. Bubble: chamada do API Connector marcada como privada. Make: a conexão fica no servidor do Make. Lovable: a área Secrets (o Lovable detecta chaves coladas no chat e orienta a guardá-las lá).
Passo 3, sutileza: Lovable e Supabase colocam uma chave PÚBLICA no navegador de propósito. Ela é segura só se a RLS estiver ligada. Foi exatamente o que falhou no CVE e no Moltbook.
Ponte: segurança também é lei. LGPD.`,
    fonte: 'Lovable Docs, Security; Bubble Manual, API Connector; Matt Palmer, 29/05/2025 (acesso em 04/10/2026).',
  }),

  // S24
  twoColumn({
    title: 'S24 LGPD no formulário',
    titulo: 'LGPD vira decisão de tela',
    topicos: [
      {
        icone: Target,
        titulo: 'Finalidade',
        texto: 'Para que eu quero o dado: gerenciar a inscrição e avisar sobre o evento.',
      },
      {
        icone: Scale,
        titulo: 'Necessidade',
        texto: 'Só o necessário. O telefone é mesmo preciso?',
      },
      {
        icone: ShieldCheck,
        titulo: 'Transparência e segurança',
        texto: 'Dizer na tela, em linguagem simples, e proteger no servidor, como na demo.',
      },
      {
        icone: Siren,
        titulo: 'Incidente',
        texto: 'Se vazar: comunicar a ANPD em 3 dias úteis.',
      },
    ],
    visual: {
      tipo: 'midia',
      moldura: 'navegador',
      url: 'hackathon-seunome.bubbleapps.io/version-test',
      midia: {
        src: media('bubble-form-aceite.png'),
        descricao: 'Formulário de inscrição com a caixa de aceite e o texto de consentimento',
      },
    },
    cena: 'nevoa-suave',
    notes: `A LGPD (Lei 13.709/2018) vale para qualquer app que guarde dado de pessoa. Princípios do art. 6º que viram decisão de tela.
Passo 1, finalidade: "gerenciar a inscrição e avisar sobre o evento".
Passo 2, necessidade: precisamos do telefone? Se é só para avisar no dia, talvez o e-mail baste.
Passo 3, transparência (dizer na tela) e segurança (o que fizemos na demo, art. 46). Base legal (art. 7º): na aula, consentimento; em projeto real, decide o controlador com apoio jurídico.
Passo 4, incidente: comunicar a ANPD em 3 dias úteis (Resolução CD/ANPD nº 15/2024; art. 48).
Captura: o texto do aceite. "Li e concordo que meus dados (nome, e-mail e telefone) sejam usados pela organização do Hackathon No-Code 2026 apenas para gerenciar minha inscrição e enviar avisos sobre o evento. Eles serão excluídos até 30 dias após o evento. Posso pedir acesso, correção ou exclusão pelo e-mail privacidade@hackathon-nocode.example."
No Bubble, o botão ganha a condição only when Checkbox aceite is checked, e o campo aceite é salvo junto.`,
    fonte: 'Lei 13.709/2018 (LGPD), arts. 6º, 7º, 46 e 48; Resolução CD/ANPD nº 15/2024 (acesso em 04/10/2026).',
  }),

  // S25
  stat({
    title: 'S25 45% do código gerado por IA',
    contexto: 'E se a IA escrever o app inteiro?',
    valor: 45,
    sufixo: '%',
    descricao: 'das amostras de código gerado por IA tinham falhas de segurança, em testes com mais de 100 modelos.',
    fonte: 'Veracode, GenAI Code Security Report, via BusinessWire, 30/07/2025 (acesso em 04/10/2026).',
    cena: 'nevoa',
    notes: `"E se, em vez de configurar, a gente pedir para a IA escrever o app inteiro?"
Passo 1: a Veracode testou código gerado por mais de 100 modelos de IA: 45% das amostras tinham falhas de segurança.
Frase: "não é motivo para não usar IA. É motivo para não usar sem verificar."
Ponte: seguro, conferido. Agora a pergunta de quem paga a conta: aguenta? Quanto custa?`,
  }),
];
