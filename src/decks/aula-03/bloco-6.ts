import { BrainCircuit, Filter, Scale, Table2, UserRoundCheck, Webhook } from 'lucide';
import { caseStudy, chapter, checklist, code, demo, showcase, stat, twoColumn } from '../../archetypes';
import type { SlideDef } from '../../engine/types';

/** Capítulo 6: Quando a automação decide (S43 a S50, 19h52 a 20h04). */
export const bloco6: SlideDef[] = [
  // S43
  chapter({
    numero: 6,
    total: 8,
    titulo: 'Quando a automação\ndecide',
    subtitulo: 'Uma IA no meio do fluxo: onde ela ajuda, quanto custa e quando não usar.',
    cena: 'grafo-amplo',
    notes: `Transição de 10 segundos. Marcador 52:00.
"Até aqui, o fluxo só executa. Agora, um fluxo que decide."`,
  }),

  // S44
  twoColumn({
    titulo: 'Regra ou julgamento?',
    topicos: [
      {
        icone: Filter,
        titulo: 'Regra: sempre a mesma resposta',
        texto: 'E-mail tem @? Vagas acabaram? Trilha = IA? Um filtro resolve, com custo zero.',
        realce: ['webhook', 'filtro'],
      },
      {
        icone: BrainCircuit,
        titulo: 'Julgamento: pode variar',
        texto: 'Esta ideia é de qual trilha? Escreva uma boas-vindas pessoal. Custa créditos.',
        realce: ['filtro', 'ia'],
      },
      {
        icone: Scale,
        titulo: 'Julgamento precisa de revisão',
        texto: 'Use IA só onde uma regra não resolve, e com alguém revisando o que importa.',
        realce: ['ia', 'revisao'],
      },
    ],
    visual: {
      tipo: 'fluxo',
      nos: [
        { id: 'webhook', rotulo: 'Webhook', sub: 'inscrição', icone: Webhook, tipo: 'gatilho', col: 0, linha: 0 },
        { id: 'filtro', rotulo: 'Filtro', sub: 'regra', icone: Filter, col: 1, linha: 0 },
        { id: 'ia', rotulo: 'IA', sub: 'julgamento', icone: BrainCircuit, col: 2, linha: 0 },
        { id: 'planilha', rotulo: 'Planilha', sub: 'guarda', icone: Table2, tipo: 'dado', col: 1, linha: 1 },
        { id: 'revisao', rotulo: 'Pessoa', sub: 'revisa', icone: UserRoundCheck, tipo: 'externo', col: 2, linha: 1 },
      ],
      ligacoes: [
        { de: 'webhook', para: 'filtro' },
        { de: 'filtro', para: 'ia' },
        { de: 'ia', para: 'revisao' },
        { de: 'filtro', para: 'planilha', tracejada: true },
      ],
    },
    notes: `Passo 1: regra. "Nem toda decisão precisa de IA. O e-mail tem arroba? É regra: sempre a mesma resposta, custo zero, um filtro resolve. As vagas acabaram? Regra."
Passo 2: julgamento. "Mas 'esta ideia é de qual trilha?', quando a pessoa escreveu em texto livre, é julgamento. 'Escreva uma boas-vindas que fale da ideia dela' é julgamento. Aí a IA ajuda."
Passo 3: "E julgamento pode variar, custa crédito e precisa de alguém revisando."
Frase-chave: "Automação que executa segue regra. Automação que decide usa julgamento. Use IA só onde uma regra não resolve."
Adaptação: o storyboard pedia duas listas lado a lado; aqui os tópicos acendem o pedaço do fluxo correspondente.
Ponte: um caso real com esse desenho.`,
  }),

  // S45
  caseStudy({
    empresa: 'Stellantis &You UK',
    contexto: 'Rede de concessionárias, Reino Unido',
    plataforma: 'make',
    problema: 'Mensagens de clientes do pós-venda precisavam ser triadas para saber quais pediam ação.',
    solucao: 'IA no Make classifica cada mensagem; regras decidem o caminho; insatisfação sutil vai para uma pessoa.',
    resultados: [
      { valor: 47, sufixo: ' mil+', rotulo: 'mensagens analisadas por IA em 12 meses' },
      { valor: 18, sufixo: ' mil+', rotulo: 'fechadas automaticamente' },
      { valor: 700, sufixo: '+', rotulo: 'cenários ativos no Make' },
    ],
    fonte: 'Make, success story Stellantis &You UK, 12/05/2025 (acesso em 04/10/2026).',
    notes: `Passo 0: "A Stellantis no Reino Unido, a rede de concessionárias da dona de Fiat, Peugeot e Jeep."
Passo 1: "Usa o Make com IA no atendimento."
Passo 2: "Em 12 meses, mais de 47 mil mensagens de clientes analisadas, mais de 18 mil fechadas automaticamente como 'não precisa de ação'. E mais de 700 cenários ativos."
"A IA não respondeu o cliente. Ela classificou. E marcava insatisfação sutil, mesmo quando o cliente não reclamava abertamente, para alguém do pós-venda agir."
"IA classifica, regra decide o caminho, humano cuida do que importa. É o que vamos fazer."
Logo da Stellantis não é usado (cliente citado só em texto).`,
  }),

  // S46
  demo({
    plataforma: 'make',
    titulo: 'IA dentro do fluxo',
    passos: [
      'Categorize Text: a ideia é de qual trilha?',
      'Simple Text Prompt: boas-vindas personalizada',
      'Mapear para a planilha e o e-mail',
      'Rodar e medir os créditos',
    ],
    duracao: 'Cerca de 6 minutos',
    url: 'make.com · Make AI Toolkit',
    captura: 'media/aula-03/make-ai-categorize.png',
    video: { src: 'media/aula-03/demo-ia.mp4', label: 'Backup: IA dentro do fluxo no Make' },
    title: 'Demo: IA dentro do fluxo',
    notes: `Desligar o cenário antes de editar (Scheduling OFF). Religar no fim.
Provedor: Make AI Toolkit com Make's AI Provider (decisão C5): nenhuma chave externa.
1. Insert module entre o filtro e o Sheets: Categorize Text, texto 1.ideia, categorias Web, Mobile, Automação, IA (descrições no aula03-comandos.txt). Uma categoria só.
2. Simple Text Prompt: colar o prompt e mapear nome, trilha e ideia.
3. Add a Row: trilha_sugerida e mensagem_ia. Send an Email: parágrafo da IA e a sugestão de trilha, com o aviso "Sugestão gerada por IA".
4. Run once com o curl da Gabi (Automação) e do Heitor (escolheu Web; a IA deve sugerir IA). Mostrar planilha, e-mail e créditos no History. Religar.
"A IA sugere, a pessoa decide."
IA demorando mais de 60 s ou com erro: tecla V (demo-ia.mp4). Resposta ruim vira conteúdo no S49.
Passo a passo completo: conteudo.md, seção 6.4.`,
  }),

  // S47
  code({
    titulo: 'O prompt é uma especificação',
    linguagem: 'texto',
    arquivo: 'Simple Text Prompt',
    codigo: `
      Você escreve pela organização do Hackathon
      No-Code 2026 (21 e 22/11/2026, online, gratuito).
      Escreva uma mensagem de boas-vindas em
      português do Brasil para {{nome}}, inscrita na
      trilha {{trilha}}, que quer construir: "{{ideia}}".
      Regras:
      - no máximo 2 frases e 300 caracteres;
      - tom direto e acolhedor, sem emojis;
      - não prometa prêmios, vagas, mentorias ou horários;
      - se a ideia estiver vazia, não invente uma.
      Responda só com o texto da mensagem.
    `,
    passos: [
      { linhas: '1-2', nota: 'O papel: quem escreve e em nome de quem.' },
      { linhas: '4-5', nota: 'Os dados mapeados do webhook: nome, trilha e ideia.' },
      { linhas: '6-10', nota: 'Os limites: o que a IA não pode fazer. É a parte mais importante.' },
      { linhas: 11, nota: 'O formato da saída: só o texto, porque ele vai direto para o e-mail.' },
    ],
    notes: `"É a frase da Aula 1 de volta: o prompt é uma especificação."
Passo 1: o papel. Passo 2: os dados mapeados do webhook.
Passo 3: os limites. "Não prometer prêmio, nem vaga, nem horário. Uma IA escrevendo e-mail em nome de uma organização pode prometer o que a organização não oferece."
Passo 4: o formato da saída.
"Os limites são a parte mais importante."
O texto do prompt foi quebrado em linhas mais curtas para caber no painel; o conteúdo é o mesmo do conteudo.md, seção 6.4.
Ponte: quanto isso custa.`,
  }),

  // S48
  stat({
    contexto: 'Quanto custa a IA no Make? Modelos pequenos e médios do Make’s AI Provider:',
    valor: 18080,
    descricao: 'tokens de entrada = 1 crédito. Saída: 2.260 tokens = 1 crédito. Free: até 200 mil tokens de entrada por semana.',
    unidades: false,
    fonte: 'Make Help, Credits (atualizado em 02/10/2026); Make Apps, Make AI Toolkit (limite do Free). Acesso em 04/10/2026.',
    notes: `Passo 0: a pergunta.
Passo 1: o número. "Nos modelos pequenos e médios, 18.080 tokens de entrada valem um crédito, e 2.260 tokens de saída valem um crédito. Modelos grandes custam umas cinco vezes mais por token. E no plano gratuito há um teto de 200 mil tokens de entrada por semana."
"Uma boas-vindas curta usa algumas centenas de tokens. O custo maior não é o token: é cada módulo a mais por inscrição."
"O History da demo mostra o número real: leiam de lá, não de mim." Ler o número anotado na demo.
"Multipliquem por 120, e depois por 50 mil: é a conta da Aula 4."
A miniatura make-ai-creditos.png do storyboard não cabe no arquétipo stat; o número real vem do History aberto na demo.
Ponte: e quando não usar IA.`,
  }),

  // S49
  checklist({
    titulo: 'Quando não usar IA no fluxo',
    itens: [
      { texto: 'Quando uma regra resolve', detalhe: 'Formato de e-mail, contagem de vagas.' },
      { texto: 'Quando o erro custa caro e ninguém revisa' },
      { texto: 'Quando o dado é sensível', detalhe: 'E o provedor não foi aprovado pela empresa.' },
      { texto: 'Quando precisa dar sempre a mesma resposta', detalhe: 'Uma nota, um valor de cobrança.' },
      { texto: 'Quando o volume torna o custo maior que o ganho' },
    ],
    notes: `Cinco casos, um por passo.
"Na nossa demo, a IA sugere uma trilha e escreve uma saudação. A trilha escolhida pela pessoa continua valendo. A IA não decide sozinha nada que importa."
Se apareceu resposta ruim ao vivo: em inglês, reforçar "em português do Brasil"; longa demais, limites numéricos funcionam melhor que "seja breve"; promessa inventada, é para isso que existe a regra "não prometa" e a revisão humana.
Ponte: o mesmo fluxo em outra ferramenta.`,
  }),

  // S50
  showcase({
    titulo: 'O mesmo fluxo no n8n',
    plataforma: 'n8n',
    midia: { src: 'media/aula-03/n8n-workflow.png', descricao: 'Workflow no n8n: Webhook, Google Sheets (Append Row) e Gmail' },
    url: 'n8n · Workflow',
    anotacoes: [
      { x: 20, y: 48, titulo: 'Webhook', texto: 'O mesmo gatilho, com outro nome: nó em vez de módulo.' },
      { x: 50, y: 48, titulo: 'Google Sheets: Append Row', texto: 'A linha na planilha. Cobrança por execução, não por passo.' },
      { x: 80, y: 48, titulo: 'Gmail', texto: 'O e-mail de confirmação. Community Edition roda grátis no seu servidor.' },
      { x: 86, y: 14, titulo: 'Próximo degrau: agentes', texto: 'A IA decide os próprios passos. Tema da Aula 4.' },
    ],
    fonte: 'n8n docs (Google Sheets node); n8n.io/pricing. Acesso em 04/10/2026.',
    video: { src: 'media/aula-03/demo-n8n.mp4', label: 'n8n: o mesmo fluxo (2 min)' },
    notes: `Tecla V: rodar o corte de 1 min 40 s do demo-n8n.mp4 narrando (decisão C6). Depois, as anotações.
1. "Nó Webhook, nó Google Sheets com a operação Append Row, nó Gmail. Os conceitos são os mesmos: gatilho, nós, mapeamento."
2. "Muda o nome e muda a cobrança: no n8n paga-se por execução."
3. "A versão Community roda de graça no seu servidor. Foi o que a Icatu e a Vodafone escolheram."
4. Ponte para a Aula 4: "O próximo degrau é o agente: em vez de eu desenhar os passos, a IA decide quais dar e quais ferramentas chamar. O Make tem os Make AI Agents, o n8n também tem agentes. A diferença entre workflow e agente é assunto da Aula 4."
Corte F (menos 1 min 20 s): só a captura, 20 s.
Ponte: "A organização do hackathon não vai abrir o Make na porta do evento. Ela precisa de um app no celular."`,
  }),
];
