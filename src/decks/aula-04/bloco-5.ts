import { Bot, Building2, Cpu, Image, RefreshCw, Webhook } from 'lucide';
import { chapter, checklist, comparison, stat, twoColumn } from '../../archetypes';
import type { SlideDef } from '../../engine/types';
import { comRevelacao } from './helpers';

/** Capítulo 5: Quanto consome? (S34–S38). */
export const bloco5: SlideDef[] = [
  // S34
  chapter({
    title: 'S34 Bloco 5: Quanto consome?',
    numero: 5,
    total: 9,
    titulo: 'Toda nuvem fica\nem algum lugar',
    subtitulo: 'Energia e água: o custo que não aparece na sua fatura.',
    cena: 'horizonte-avanco',
    notes: `Abertura do capítulo (15 s).
"Agora o custo que não aparece na fatura de vocês, mas aparece na conta de alguém."`,
  }),

  // S35
  stat({
    title: 'S35 Data centers: 485 TWh',
    contexto: 'Quanta eletricidade os data centers do mundo usam?',
    valor: 485,
    sufixo: ' TWh',
    unidades: false,
    descricao: 'em 2025, +17% em um ano (415 TWh em 2024, ~1,5% da eletricidade mundial). Projeção 2030: ~950 TWh, ~3%.',
    fonte: 'IEA, Energy and AI (abr/2025) e Key Questions on Energy and AI (abr/2026), relatórios em PDF no iea.org. Acesso em 05/10/2026.',
    cena: 'nevoa',
    notes: `Todo app "na nuvem" roda num prédio cheio de servidores que consomem eletricidade e, muitas vezes, água para resfriamento.
Passo 1: em 2024, cerca de 415 TWh, perto de 1,5% da eletricidade mundial. Em abril de 2026 a IEA atualizou: +17% em 2025, para cerca de 485 TWh; data centers focados em IA cresceram 50%.
Projeção para 2030: cerca de 950 TWh, ~3% da eletricidade mundial. Projeção é projeção.
Escala: 17% num ano, enquanto a demanda mundial de eletricidade cresceu 3%.
Números conferidos nos PDFs da IEA em 05/10/2026: "approximately 415 TWh for 2024 ... around 1.5%" (Energy and AI); "from 485 TWh in 2025 to 950 TWh in 2030 ... around 3%" e crescimento de 17% em 2025 (Key Questions on Energy and AI). O relatório de 2025 projetava 945 TWh para 2030; o de 2026, 950 TWh.`,
  }),

  // S36
  comRevelacao(
    twoColumn({
      title: 'S36 0,24 Wh por prompt',
      titulo: 'O que esse número não conta',
      inverter: true,
      topicos: [
        {
          icone: Building2,
          titulo: 'Medição da própria empresa',
          texto: 'Com a metodologia dela, sobre o próprio produto.',
        },
        {
          icone: Image,
          titulo: 'Texto mediano',
          texto: 'Imagem, vídeo e respostas longas gastam mais.',
        },
        {
          icone: Bot,
          titulo: 'Agentes',
          texto: 'Fazem dezenas de chamadas por tarefa, com contextos grandes.',
        },
        {
          icone: Cpu,
          titulo: 'Sem o treinamento',
          texto: 'O número não inclui treinar o modelo.',
        },
      ],
      visual: {
        tipo: 'numero',
        valor: '0,24',
        rotulo: 'Wh por prompt de texto mediano do Gemini. 0,26 mL de água e 0,03 g de CO2e. 33 vezes menos energia em 12 meses.',
      },
      cena: 'nevoa-esquerda',
      notes: `Número: em agosto de 2025 o Google publicou a medição de um prompt de texto MEDIANO no app Gemini: 0,24 Wh, 0,03 g de CO2e e 0,26 mL de água. Comparação do próprio Google: menos que 9 segundos de TV e cerca de 5 gotas. A energia por prompt caiu 33 vezes em 12 meses.
Passos 1 a 4, o que o número NÃO conta (senso crítico):
1 é a medição de uma empresa sobre o próprio produto;
2 é o prompt mediano de texto; imagem, vídeo e respostas longas gastam mais;
3 agentes fazem dezenas de chamadas por tarefa; nenhum provedor que eu possa citar publicou número por sessão de agente;
4 não inclui o treinamento.
Passo 5, a conta do nosso projeto: 120 inscrições x 0,24 Wh = ~29 Wh, uma lâmpada LED de 10 W por 3 horas. A 50 mil inscrições, ~12 kWh: a mesma lâmpada por 50 dias.`,
      fonte: 'Google Cloud Blog, 21/08/2025; arXiv 2508.15734. Conta da lâmpada: 120 × 0,24 Wh, aritmética da aula.',
    }),
    'Nosso projeto: 120 chamadas ≈ 29 Wh, uma lâmpada LED de 10 W acesa por 3 horas.',
    'left:120px;bottom:150px',
  ),

  // S37
  comparison({
    title: 'S37 Polling x webhook',
    titulo: 'A decisão da Aula 3, em números',
    colunas: [
      { id: 'polling', nome: 'Polling a cada 15 min', icone: RefreshCw },
      { id: 'webhook', nome: 'Webhook', icone: Webhook },
    ],
    linhas: [
      {
        criterio: 'Execuções por mês',
        celulas: [
          { nivel: 4, rotulo: '2.880' },
          { nivel: 1, rotulo: '120' },
        ],
      },
      {
        criterio: 'Quando roda',
        celulas: ['Haja inscrição ou não', 'Uma vez por inscrição'],
      },
    ],
    foco: {
      coluna: 'webhook',
      conclusao: '24 vezes menos. Técnica, custo e energia apontam para o mesmo lado.',
    },
    cena: 'nevoa-suave',
    notes: `Na Aula 3 escolhemos webhook. Agora em números.
Passo 1: polling a cada 15 minutos (o mínimo do Make Free): 4 por hora x 24 x 30 = 2.880 execuções por mês, haja inscrição ou não. Cada checagem do gatilho consome crédito mesmo sem nada novo: a ajuda do Make diz que rodar a cada 5 minutos custa 288 créditos por dia só no módulo gatilho.
Webhook: 120 execuções, uma por inscrição.
Passo 2: 24 vezes menos execuções. Menos créditos, menos servidor ligado à toa, menos energia. Eficiência técnica, econômica e ambiental são a mesma decisão.`,
    fonte: 'Cálculo: 4 × 24 × 30. Make: pricing e Help Center ("Schedule your scenario", "Operations"), acesso em 05/10/2026.',
  }),

  // S38
  checklist({
    title: 'S38 Práticas de eficiência',
    titulo: 'Eficiência no nosso projeto',
    itens: [
      'Evento em vez de agendamento',
      'IA só onde decide',
      'Guardar só o necessário, apagar no prazo',
      'Imagens comprimidas, páginas leves',
      'Desligar o que não usa',
      'Escolher provedor e região com dados públicos de energia',
    ],
    cena: 'nevoa',
    notes: `Seis passos rápidos, um item marcado por clique.
1 Evento em vez de agendamento: webhook, não polling.
2 IA só onde decide: classificar a trilha, sim; formatar uma data, não.
3 Guardar só o necessário e apagar no prazo prometido: é LGPD e é menos armazenamento ao mesmo tempo.
4 Imagens comprimidas e páginas leves: menos WU, menos transferência, mais rápido no celular da Camila.
5 Desligar o que não usa: cenário do Make depois do evento, projetos de teste.
6 Escolher região e provedor com dados públicos de energia, quando houver opção.
Com alunos: "qual dessas você aplicaria no seu app?" (ler 1). Corte D: ler só 3.
Ponte: "até aqui avaliamos o que construímos. E se a gente tivesse construído de outro jeito?"`,
  }),
];
