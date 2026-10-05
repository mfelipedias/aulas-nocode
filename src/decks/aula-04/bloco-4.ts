import { Database, Mail, Server, Timer, Users, Workflow } from 'lucide';
import { chapter, code, comparison, grid, pause, timeline, twoColumn } from '../../archetypes';
import type { SlideDef } from '../../engine/types';
import { media } from './helpers';

/** Capítulo 4: Aguenta? Quanto custa? (S26–S33). Hipóteses H1–H4 explicadas nas notas de S30. */
export const bloco4: SlideDef[] = [
  // S26
  chapter({
    title: 'S26 Bloco 4: Aguenta? Quanto custa?',
    numero: 4,
    total: 9,
    titulo: 'Aguenta?\nQuanto custa?',
    subtitulo: 'Limites, unidades de cobrança e o custo da nossa stack em três escalas.',
    cena: 'horizonte-avanco',
    notes: `Abertura do capítulo (15 s).
Checkpoint 1: se passar de 19h34, aplicar o Corte C (S32 com só 3 marcos).`,
  }),

  // S27
  grid({
    title: 'S27 Cada plataforma cobra uma coisa',
    titulo: 'Grátis é uma faixa de uso, não uma propriedade',
    cartoes: [
      {
        plataforma: 'bubble',
        tag: 'WU',
        titulo: 'Bubble',
        texto: 'Trabalho do servidor. Grátis: 50 mil WU por mês.',
      },
      {
        plataforma: 'make',
        tag: 'Créditos',
        titulo: 'Make',
        texto: 'Cada módulo executado, desde 27/08/2025. Grátis: 1.000 por mês.',
      },
      {
        plataforma: 'lovable',
        tag: 'Créditos',
        titulo: 'Lovable',
        texto: 'Construir, Cloud e IA. Grátis: 5 por dia, até 30 por mês.',
      },
      {
        icone: Users,
        tag: 'Usuários',
        titulo: 'AppSheet',
        texto: 'Cada pessoa que usa o app. Grátis: 10 usuários de teste.',
      },
      {
        plataforma: 'airtable',
        tag: 'Registros',
        titulo: 'Airtable',
        texto: 'Linhas guardadas. Grátis: 1.000 por base.',
      },
      {
        icone: Mail,
        tag: 'E-mails por dia',
        titulo: 'Gmail',
        texto: 'Envios de uma conta pessoal: cerca de 500 por dia.',
      },
    ],
    revelar: 'todos',
    fonte: 'Páginas de preço oficiais de Bubble, Make, Lovable, AppSheet e Airtable; Make Help, 2025 (créditos); Ajuda do Gmail (acesso em 04/10/2026).',
    cena: 'nevoa-suave',
    notes: `Cada plataforma conta uma coisa diferente.
Bubble: WU (workload units), o trabalho do servidor: carregar página, buscar, rodar workflow, chamar API. Grátis: 50 mil por mês.
Make: créditos desde 27/08/2025; cada módulo executado, e a IA custa créditos variáveis. Grátis: 1.000 por mês.
Lovable: créditos para construir, conversar, Cloud e IA no app. Grátis: 5 por dia, máximo 30 no mês.
AppSheet: usuários do app publicado. Grátis: 10 usuários de teste.
Airtable: registros, 1.000 por base (AppSheet Database: 2.500 por tabela).
Gmail: cerca de 500 e-mails por dia numa conta pessoal.
Moral: "grátis" é uma faixa de uso. Para saber se cabe, é preciso saber O QUE cada plataforma conta.
AppSheet e Gmail aparecem só como nome (regra de marca).`,
  }),

  // S28
  twoColumn({
    title: 'S28 Simultâneos, volume, latência',
    titulo: 'Três jeitos de não aguentar',
    topicos: [
      {
        icone: Users,
        titulo: 'Simultâneos',
        texto: '800 pessoas no mesmo minuto, não 2.000 no mês.',
      },
      {
        icone: Database,
        titulo: 'Volume',
        texto: '500 registros não são nada; 500 mil mudam a arquitetura.',
      },
      {
        icone: Timer,
        titulo: 'Latência',
        texto: 'Cada ida e volta soma espera. O botão confirma na hora; o resto vem depois.',
      },
    ],
    visual: {
      tipo: 'midia',
      moldura: 'nenhuma',
      proporcao: '860 / 620',
      midia: {
        src: media('grafico-pico-inscricoes.svg'),
        descricao: 'Gráfico ilustrativo: inscrições por hora com um pico depois da divulgação',
        ajuste: 'conter',
        posicao: 'center',
      },
    },
    cena: 'nevoa-esquerda',
    notes: `O gráfico é desenho didático, não dado (está rotulado "ilustrativo").
Passo 1, simultâneos: o problema não é ter 2.000 inscritos; é 800 pessoas abrindo a página no mesmo minuto porque um influenciador postou o link. No Bubble vira pico de WU; no Make, fila de execuções; no Gmail, o limite diário.
Passo 2, volume: 500 registros não são nada; 500 mil exigem índices, buscas paginadas, talvez um banco externo (Supabase, Xano).
Passo 3, latência: Bubble chama o Make, que chama planilha, IA e e-mail, várias idas e voltas, muitas para fora do Brasil. Esperar segundos pelo e-mail, tudo bem; pelo botão, não. Por isso o botão confirma na hora e o resto acontece depois.
Ponte: pausa para pensar.`,
  }),

  // S29
  pause({
    title: 'S29 Pausa: o primeiro gargalo',
    pergunta: 'A divulgação viralizou: 2.000 inscrições em 2 dias. O que quebra primeiro?',
    resposta: 'O e-mail: ~500 envios por dia numa conta Gmail. Logo depois, os créditos do Make. O Bubble é o último a reclamar.',
    detalhe: 'O gargalo raramente está onde a gente olha.',
    segundos: 20,
    chat: 'Se estiver ao vivo, responda no chat.',
    cena: 'nevoa',
    notes: `Ler a pergunta e ficar em silêncio; o anel de 20 s roda sozinho. Tecla T pausa.
Sala vazia, pensar em voz alta: "Bubble? O Starter tem 175 mil WU... Make? 2.000 vezes 5 créditos dá 10 mil... Planilha? Aguenta..."
Com alunos: ler 1 ou 2 respostas antes de revelar.
Revelação: o e-mail. Numa conta Gmail pessoal, ~500 por dia. Com 800 inscrições por dia, metade fica sem confirmação. Logo atrás, os créditos do Make: 10 mil estouram o Free na primeira hora. O Bubble é o último a reclamar.
Lição: o gargalo raramente está onde a gente olha.
Ponte: como chegar a esses números com o seu app.`,
    fonte: 'Ajuda do Gmail (limite de envio); make.com/en/pricing; bubble.io/pricing (acesso em 04/10/2026).',
  }),

  // S30
  code({
    title: 'S30 A conta',
    titulo: 'Medir 10, multiplicar, somar folga',
    arquivo: 'estimativa.txt',
    linguagem: 'js',
    codigo: `
      créditos_make = inscrições × créditos_por_inscrição
        = 2.000 × 5 = 10.000                   (H1)

      wu_bubble = inscrições × wu_por_inscrição
        = 2.000 × 50 = 100.000                 (H2)

      emails_no_pico = inscrições × 40% ÷ 2 dias
        = 2.000 × 0,4 ÷ 2 = 400 por dia        (H4)
    `,
    passos: [
      {
        linhas: '1-2',
        nota: 'H1: webhook 1 + planilha 1 + e-mail 1 + IA ~2 = 5 créditos por inscrição.',
      },
      {
        linhas: '4-5',
        nota: 'H2: 50 WU por inscrição, incluindo ~4 visitas que não se inscrevem.',
      },
      {
        linhas: '7-8',
        nota: 'H4: 40% das inscrições nos 2 primeiros dias. Troque cada H pelo que você mediu.',
      },
    ],
    cena: 'vazio',
    notes: `Método em três passos, para qualquer stack.
1 Medir 10: faça 10 inscrições de teste e olhe o consumo real. Bubble: Logs > Workload (captura media/aula-04/bubble-workload.png). Make: o History mostra os créditos de cada execução (captura make-history-creditos.png, da Aula 3).
2 Multiplicar pelo número de inscrições esperado e pelas visitas que não viram inscrição.
3 Somar folga para o pico (eu uso 2x).
Passo 1: H1, 5 créditos por inscrição no Make (a IA varia por modelo e tamanho do texto).
Passo 2: H2, 50 WU por inscrição no Bubble.
Passo 3: H4, 40% das inscrições nos 2 primeiros dias: 400 e-mails por dia, no limite do Gmail. (H3: 4 organizadores no app de check-in.)
Sala vazia: "Pause e refaça a conta com os números do seu app."`,
    fonte: 'Hipóteses da aula (H1 a H4), para trocar pelas suas medições no Logs do Bubble e no History do Make.',
  }),

  // S31
  comparison({
    title: 'S31 Custo em três escalas',
    titulo: 'Quanto custa a nossa stack',
    colunas: [
      { id: 'c120', nome: '120', sub: 'inscrições, o evento' },
      { id: 'c2000', nome: '2.000', sub: 'edição regional' },
      { id: 'c50000', nome: '50.000', sub: 'edição nacional' },
    ],
    linhas: [
      {
        criterio: 'Bubble',
        celulas: ['Starter US$ 29', 'US$ 29 (cabe nos 175 mil WU)', '~US$ 727 (excedente de WU)'],
        passo: 1,
      },
      {
        criterio: 'Make',
        celulas: ['Free', 'Core US$ 9, sem folga', '~US$ 182 (300 mil créditos)'],
        passo: 1,
      },
      {
        criterio: 'E-mail',
        celulas: ['Gmail, US$ 0', 'Transacional, ~US$ 0,20', '~US$ 5'],
        passo: 2,
      },
      {
        criterio: 'Check-in',
        celulas: ['US$ 0 a 20', 'US$ 20', 'US$ 100'],
        passo: 2,
      },
      {
        criterio: 'Total por mês',
        celulas: ['~US$ 29 a 49', '~US$ 60', '~US$ 1.000 ou mais'],
        passo: 3,
      },
    ],
    foco: {
      coluna: 'c50000',
      conclusao: 'A conta não é o plano. É trabalho por usuário × usuários.',
    },
    cena: 'nevoa-suave',
    notes: `Passo 1, Bubble e Make. 120 inscrições: 6 mil WU, mas precisa de live: Starter US$ 29. 2.000: 100 mil WU, cabe nos 175 mil do Starter. 50.000: 2,5 mi WU, excedente de ~2,3 mi WU x US$ 0,30/mil, cerca de US$ 727.
Make: 600 créditos cabem no Free; 10 mil pedem o Core US$ 9 (anual), sem folga; 250 mil créditos caem na faixa de 300 mil do Core, ~US$ 182/mês no anual (não existe faixa de 250 mil). Alternativa: tirar o Make do caminho principal.
Passo 2, e-mail e check-in. Gmail US$ 0; no pico de 400/dia, e-mail transacional (SES, US$ 0,10 por mil) dá ~US$ 0,20; 50 mil e-mails, ~US$ 5. Check-in AppSheet: até 10 testadores US$ 0; uso real 4 x US$ 5 = US$ 20; 20 organizadores, US$ 100. Domínio ~R$ 40/ano nas três.
Passo 3, total: ~US$ 29 a 49; ~US$ 60; ~US$ 1.000 ou mais (727 + 182 + 5 + 100), antes de otimizar.
Passo 4 (foco nos 50 mil): o maior item deixa de ser a assinatura e vira o trabalho do servidor. Otimizando de 50 para 20 WU por inscrição, o Bubble cai de ~US$ 727 para ~US$ 277.
Frase: a conta não é o plano; é trabalho por usuário x usuários.`,
    fonte: 'bubble.io/pricing (Starter: 175 mil WU; excedente US$ 0,30 por mil WU); make.com/en/pricing; aws.amazon.com/ses/pricing. Acesso em 05/10/2026.',
  }),

  // S32
  timeline({
    title: 'S32 Risco de plataforma',
    titulo: 'Você aluga a plataforma',
    subtitulo: 'Doze meses que mudaram o mapa.',
    marcos: [
      {
        data: '27/08/2025',
        titulo: 'Make',
        texto: 'Operações viram créditos na cobrança.',
      },
      {
        data: '15/05/2026',
        titulo: 'AppSheet',
        texto: 'Novos recursos “significativamente reduzidos”.',
      },
      {
        data: '22/06/2026',
        titulo: 'Firebase Studio',
        texto: 'Fecha cadastros; desligamento em 22/03/2027.',
      },
      {
        data: '03/08/2026',
        titulo: 'Glide',
        texto: 'O GlideOS Free publica zero apps.',
      },
      {
        data: '04/09/2026',
        titulo: 'Airtable',
        texto: 'Vendida à Bending Spoons por US$ 1,285 bi.',
      },
    ],
    fonte: 'Make Help, 2025; Google Developer forums, 15/05/2026; Firebase blog; Glide community, 03/08/2026; TechCrunch, 04/08/2026 (acesso em 04/10/2026).',
    cena: 'horizonte',
    notes: `Um marco por passo.
27/08/2025: o Make troca a unidade de cobrança de operações para créditos.
15/05/2026: o Google anuncia que novos recursos do AppSheet serão "significativamente reduzidos".
22/06/2026: o Firebase Studio fecha novos cadastros; desligamento previsto para 22/03/2027.
03/08/2026: o Glide se divide em Glide Classic e GlideOS; o GlideOS Free publica zero apps.
04/09/2026: a Airtable passa à Bending Spoons, por US$ 1,285 bi.
Nenhum é um desastre; todos são lembretes: você aluga a plataforma. Isso tem nome: risco de plataforma.
Corte C: dizer só Make, Firebase Studio e Airtable.`,
  }),

  // S33
  comparison({
    title: 'S33 O que você leva se sair',
    titulo: 'Lock-in: o que você leva se sair',
    colunas: [
      { id: 'dados', nome: 'Os dados', icone: Database },
      { id: 'logica', nome: 'A lógica', icone: Workflow },
      { id: 'app', nome: 'O app rodando', icone: Server },
    ],
    linhas: [
      {
        criterio: 'Bubble',
        celulas: [
          { nivel: 4, rotulo: 'Sim, CSV' },
          { nivel: 1, rotulo: 'Não' },
          { nivel: 1, rotulo: 'Não' },
        ],
      },
      {
        criterio: 'Lovable',
        celulas: [
          { nivel: 4, rotulo: 'Sim' },
          { nivel: 4, rotulo: 'Sim, no GitHub' },
          { nivel: 3, rotulo: 'Sim, com trabalho' },
        ],
      },
      {
        criterio: 'Make',
        celulas: [
          { nivel: 2, rotulo: 'Parcial' },
          { nivel: 2, rotulo: 'Parcial, blueprint' },
          { nivel: 1, rotulo: 'Não' },
        ],
      },
      {
        criterio: 'n8n',
        celulas: [
          { nivel: 4, rotulo: 'Sim' },
          { nivel: 4, rotulo: 'Sim' },
          { nivel: 4, rotulo: 'Sim, auto-hospedável' },
        ],
      },
      {
        criterio: 'Código próprio',
        celulas: [
          { nivel: 4, rotulo: 'Sim' },
          { nivel: 4, rotulo: 'Sim' },
          { nivel: 4, rotulo: 'Sim' },
        ],
      },
    ],
    foco: { coluna: 'app', conclusao: 'Lock-in não é proibido. É um preço.' },
    cena: 'nevoa-suave',
    notes: `Passo 1, a tabela.
Bubble: leva os dados (CSV), não leva a lógica nem o app.
Lovable: dados no Supabase, código no seu GitHub; o app roda em outro lugar com trabalho (hospedagem e backend).
Make: dados que estiverem na planilha; o blueprint JSON só roda no Make.
n8n: leva tudo, inclusive hospedar você mesmo.
Código próprio: tudo.
Na fala: FlutterFlow exporta código só no plano pago.
Passo 2 (foco em "o app rodando"): lock-in não é proibido, é um preço. Para um evento de 48 horas, ótimo negócio. Para o sistema central de uma empresa, talvez não.
Ponte: agora o custo que não aparece na fatura de vocês, mas aparece na conta de alguém.`,
    fonte: 'Documentação de exportação de Bubble, Lovable, Make e n8n (acesso em 04/10/2026).',
  }),
];
