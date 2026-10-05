import { Blocks, Building2, Mail, MousePointerClick, Plug, Server, Webhook, Workflow } from 'lucide';
import { bulletsRich, chapter, definition, grid, stat, twoColumn } from '../../archetypes';
import type { SlideDef } from '../../engine/types';

/** Capítulo 1: O mundo já é conectado (S06 a S11, 19h04 a 19h10). */
export const bloco1: SlideDef[] = [
  // S06
  chapter({
    numero: 1,
    total: 8,
    titulo: 'O mundo já é\nconectado',
    subtitulo: 'Antes de construir, por que integrar sistemas vale dinheiro.',
    cena: 'grafo-amplo',
    notes: `Transição de 10 segundos. Deixar a câmera e o grafo assentarem.
"Antes de construir, um minuto para entender por que isso vale dinheiro."
Para a gravação: este é o marcador 04:00 do índice de capítulos.`,
  }),

  // S07
  bulletsRich({
    titulo: 'O que a Unidade III trouxe',
    subtitulo: 'Hoje, cada item vira algo funcionando no Hackathon No-Code 2026.',
    itens: [
      { icone: Plug, titulo: 'APIs REST', texto: 'Endpoint, método, payload e API key: como um sistema pede algo a outro.' },
      { icone: Webhook, titulo: 'Conectores nativos e webhooks', texto: 'Módulos prontos para cada app e endereços que recebem avisos.' },
      { icone: Mail, titulo: 'E-mail, planilha, calendário, CRM', texto: 'Os serviços do dia a dia como peças de um fluxo.' },
      { icone: Workflow, titulo: 'Automação de fluxos', texto: 'Notificar, aprovar, sincronizar: os padrões que se repetem.' },
    ],
    fonte: 'Ementa da disciplina No-Code Development Platforms, tópico 3 (Unidade III).',
    notes: `Um item por passo, ligando cada um a um capítulo de hoje.
Passo 1: APIs REST, no capítulo 2.
Passo 2: conectores e webhooks, nos capítulos 3 e 4.
Passo 3: e-mail, planilha, calendário e CRM: são só outros módulos do fluxo.
Passo 4: padrões de automação, no capítulo 5.
Com alunos: "Qual desses você já usou sem saber?" no chat. Não esperar a resposta.
Quando o PDF da Unidade III sair (até D-3), trocar os rótulos pelo vocabulário dele (decisão C10).
Ponte: "Quantos sistemas uma empresa grande usa?"`,
  }),

  // S08
  stat({
    contexto: 'Quantos sistemas uma empresa grande usa?',
    valor: 897,
    descricao: 'aplicações, em média, por empresa. Só 29% delas estão integradas.',
    unidades: false,
    fonte: 'MuleSoft/Salesforce, Connectivity Benchmark Report 2025 (1.050 líderes de TI), publicado em 29/01/2025.',
    notes: `Passo 0: ler a pergunta e fazer uma pausa curta.
Passo 1: o número conta até 897. "Segundo o relatório de conectividade da MuleSoft, da Salesforce, publicado em janeiro de 2025, com mais de mil líderes de TI: 897 aplicações, em média. E só 29% delas estão integradas."
"O resto é gente exportando planilha, copiando e colando, redigitando cadastro." Se der tempo: o mesmo relatório diz que TI gasta cerca de 39% do tempo criando integrações sob medida.
"É desse trabalho que estamos falando hoje."
Ponte: existe uma categoria inteira de software para isso.`,
  }),

  // S09
  definition({
    termo: 'iPaaS',
    origem: 'Integration Platform as a Service',
    definicao: 'Plataforma na nuvem para ligar sistemas e automatizar fluxos entre eles, com conectores prontos e editor visual.',
    exemplo: {
      titulo: 'Tamanho do mercado',
      texto: 'US$ 8,5 bi em 2024, +23,4% em um ano. Estimativas variam entre consultorias: guarde a ordem de grandeza.',
    },
    fonte: 'Gartner, Market Share Analysis: iPaaS, Worldwide, 2024 (21/07/2025), gartner.com/en/documents/6747734. Acesso em 05/10/2026.',
    cena: 'grafo',
    notes: `Passo 0: a definição. "Existe uma categoria de software inteira para resolver isso: iPaaS. Uma plataforma na nuvem que liga sistemas e automatiza fluxos, com conectores prontos e editor visual."
Passo 1: o número. "O Gartner estimou esse mercado em cerca de 8,5 bilhões de dólares em 2024, crescendo mais de 20% em um ano."
Cuidado com a fonte: estimativa de mercado varia por consultoria. Dizer isso em voz alta.
Texto do Gartner (resumo do relatório de 21/07/2025): o mercado de iPaaS cresceu 23,4% e chegou a US$ 8,5 bi em 2024. O Magic Quadrant de 2025 cita "mais de US$ 9 bi": não misturar os dois números; por isso "guarde a ordem de grandeza".
Ponte: quem vende integração.`,
  }),

  // S10
  twoColumn({
    titulo: 'Quem vende integração',
    topicos: [
      { icone: MousePointerClick, titulo: 'Visual, na nuvem', texto: 'Make e Zapier: fluxos montados arrastando, sem servidor para cuidar.', realce: ['make', 'zapier'] },
      { icone: Server, titulo: 'Código aberto, auto-hospedável', texto: 'n8n: roda no seu servidor, e o dado não sai de casa.', realce: ['n8n'] },
      { icone: Building2, titulo: 'Corporativo, Microsoft', texto: 'Power Automate: vem com o Microsoft 365 de muita empresa.', realce: ['powerautomate'] },
      { icone: Blocks, titulo: 'Dentro de outras plataformas', texto: 'API Connector do Bubble, automações do AppSheet, workflows do Softr.', realce: ['bubble', 'appsheet', 'softr'] },
    ],
    visual: { tipo: 'logos', ids: ['make', 'zapier', 'n8n', 'powerautomate', 'bubble', 'appsheet', 'softr'] },
    notes: `"Quatro famílias." Cada passo acende os logos da família à direita.
Passo 1: plataformas visuais na nuvem: Make e Zapier.
Passo 2: código aberto, que você roda no seu próprio servidor: o n8n é o principal.
Passo 3: corporativas, como o Power Automate, da Microsoft, que vem com o Microsoft 365 de muita empresa.
Passo 4: a integração que já vem dentro de outras plataformas: o API Connector do Bubble, as automações do AppSheet, os workflows do Softr.
"As duas primeiras famílias são as que vocês vão encontrar em vaga de emprego e em edital de startup. Hoje vamos usar o Make, que é a ferramenta citada na ementa e na Unidade I."
Logos: Make, Zapier e n8n pelo simple-icons; Bubble e Softr oficiais. Power Automate e AppSheet aparecem só como nome (marcas restritas).
Adaptação: o storyboard pedia a constelação. Ela já é usada na Aula 1 (o guia pede uma ou duas vezes por curso) e as categorias dela são fixas; aqui as quatro famílias do storyboard viram os quatro passos.
Ponte: um número para cada um.`,
  }),

  // S11
  grid({
    titulo: 'Os quatro nomes que você precisa conhecer',
    cartoes: [
      { plataforma: 'make', titulo: 'Make', itens: ['400 mil+ organizações, 3.000+ apps', 'Canvas visual; cobra por crédito'] },
      { plataforma: 'zapier', titulo: 'Zapier', itens: ['3 mi+ empresas, 9.000+ apps', 'Gatilho e ação; cobra por tarefa'] },
      { plataforma: 'n8n', titulo: 'n8n', itens: ['Avaliado em US$ 5,2 bi (mai/2026)', '206 mil+ estrelas no GitHub'] },
      { icone: Workflow, titulo: 'Power Automate', itens: ['Power Platform: 56 mi usuários/mês', 'Integrado ao Microsoft 365'] },
    ],
    fonte: 'Make: make.com (home e pricing); Zapier: pricing e Wikipedia [secundária]; n8n: comunicado SAP/EQS mai/2026 e n8n.io/pricing; Microsoft: earnings FY25 Q3. Acesso em 04/10/2026.',
    notes: `Um cartão por passo, um número por plataforma, sempre com o ano.
Passo 1: Make. Mais de 400 mil organizações e mais de 3 mil apps. Nasceu em Praga como Integromat e hoje pertence à Celonis.
Passo 2: Zapier. Mais de 3 milhões de empresas e 9 mil apps. O mais simples: gatilho e ação.
Passo 3: n8n. Alemão, código aberto. Valia 2,5 bilhões de dólares em outubro de 2025 e 5,2 bilhões em maio de 2026, com investimento da SAP. Mais de 200 mil estrelas no GitHub.
Passo 4: Power Automate. Parte da Power Platform da Microsoft, com 56 milhões de usuários ativos por mês. Aparece só com o nome (marca restrita).
Corte A (menos 1 min): ler só Make e n8n.
"No capítulo 5 eu volto a esses quatro com uma tabela de escolha."
Ponte: "Mas, para escolher ferramenta, primeiro é preciso entender o que todas elas fazem por baixo: chamar APIs."`,
  }),
];
