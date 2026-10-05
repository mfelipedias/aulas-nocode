import { KeyRound, PowerOff, Presentation, TriangleAlert, Wallet, Webhook } from 'lucide';
import { bulletsRich, chapter, checklist, closing, recap, statement, timeline } from '../../archetypes';
import type { SlideDef } from '../../engine/types';

/** Capítulo 8: O que conectamos hoje (S59 a S65, 20h18 a 20h30). */
export const bloco8: SlideDef[] = [
  // S59
  chapter({
    numero: 8,
    total: 8,
    titulo: 'O que conectamos\nhoje',
    subtitulo: 'O projeto até aqui, o que levar e o que preparar para a Aula 4.',
    cena: 'grafo-amplo',
    notes: `Transição de 10 segundos. Marcador 78:00.
"Vamos olhar o que construímos."`,
  }),

  // S60
  timeline({
    titulo: 'O Hackathon No-Code 2026 até aqui',
    marcos: [
      { data: '08/10', titulo: 'Aula 1', texto: 'Planejamento, wireframe e uma página gerada por IA.' },
      { data: '15/10', titulo: 'Aula 2', texto: 'Banco, workflow e login no Bubble.' },
      { data: '22/10', titulo: 'Aula 3', texto: 'Webhook, Make, IA, planilha, e-mail e app de check-in.' },
      { data: '29/10', titulo: 'Aula 4', texto: 'Publicar com segurança, custo e consumo.' },
    ],
    notes: `"Quatro semanas atrás, o Hackathon No-Code 2026 era uma ideia."
Passo 1: Aula 1, planejamento, wireframe e uma página gerada por IA.
Passo 2: Aula 2, banco, workflow e login no Bubble.
Passo 3: hoje, um webhook, uma automação com IA, uma planilha, um e-mail e um app de check-in. "Seis sistemas conversando."
Passo 4: "E falta a camada da Aula 4: publicar com segurança, saber quanto custa e quanto consome."
Adaptação: o storyboard pedia um grafo em camadas com a Aula 4 apagada; a linha do tempo mostra as quatro aulas e a Aula 4 acende por último, como a próxima.
Ponte: cinco coisas para levar.`,
  }),

  // S61
  recap({
    titulo: 'Cinco coisas para levar',
    itens: [
      'Requisição: método, endpoint, headers e body; resposta: status e JSON',
      'Webhook avisa; polling pergunta, e paga por perguntar',
      'Fluxo = gatilho, módulos e mapeamento; filtro e router são o if',
      'IA só onde há julgamento, com limites no prompt e custo medido',
      'Tabela com chave vira app; testar é grátis, publicar é pago',
    ],
    notes: `Nunca cortar. Um item por passo, devagar.
1. Uma requisição tem método, endpoint, headers e body; a resposta tem um código de status e, quase sempre, JSON.
2. Webhook avisa; polling pergunta, e paga por perguntar.
3. Um fluxo é gatilho, módulos e mapeamento; filtro e router são o if e o switch; tratamento de erro é o try/catch.
4. IA só onde há julgamento, com limites no prompt e custo medido no History.
5. Uma tabela com chave vira app; testar é grátis, publicar é pago.
Ponte: a resposta à pergunta do começo.`,
  }),

  // S62
  statement({
    partes: ['Sistemas conversam\npor contratos e eventos.', 'A IA entra onde uma\nregra não resolve.'],
    cena: 'nevoa',
    title: 'Resposta à pergunta central',
    notes: `Nunca cortar. Resposta explícita à pergunta do S05. Ler devagar.
"A pergunta era: como fazer sistemas diferentes conversarem sozinhos, e quando deixar uma IA decidir no meio do caminho?"
Passo 0: "Sistemas conversam por contratos: o endpoint, o método, o formato e a chave. E por eventos: quem tem a novidade avisa."
Passo 1: "E a IA entra onde uma regra não resolve. Nunca antes disso."
Ponte: até a Aula 4.`,
  }),

  // S63
  checklist({
    titulo: 'Até a Aula 4 (29/10)',
    itens: [
      { texto: 'Terminar seu cenário e desativá-lo depois de testar', detalhe: 'Cenário ligado à toa gasta créditos.' },
      { texto: 'Assistir à Unidade IV' },
      { texto: 'Escrever uma frase de pitch do seu app' },
      { texto: 'Listar 3 riscos do seu app', detalhe: 'Dados, custo e dependência de plataforma.' },
      { texto: 'Desafio opcional: CEP vira cidade', detalhe: 'Módulo HTTP, Make a request, com GET na ViaCEP; grave a cidade.' },
    ],
    notes: `Nunca cortar. Cada passo marca um item.
1. "Terminem o cenário de vocês e desliguem depois de testar, para não gastar créditos."
2. Assistir à Unidade IV.
3. Uma frase de pitch do app.
4. Três riscos: dados, custo e dependência de plataforma.
5. Desafio opcional: pedir o CEP no formulário e usar o módulo HTTP, Make a request, com GET, para chamar a ViaCEP e gravar a cidade na planilha. "É a API do capítulo 2 virando um módulo."
"Amanhã sai no AVA o PDF do deck e o blueprint do cenário, sem a minha URL e sem chave."
Ponte: perguntas.`,
  }),

  // S64
  bulletsRich({
    titulo: 'Perguntas que sempre aparecem',
    itens: [
      { icone: KeyRound, titulo: 'A autorização do Google falhou', texto: 'Refaça a connection na mesma conta do navegador. Janela anônima resolve conflito de contas.' },
      { icone: Wallet, titulo: 'Meus créditos acabaram', texto: 'Desative cenários parados e troque polling por webhook. O saldo renova no ciclo do plano.' },
      { icone: Webhook, titulo: 'O webhook não recebe nada', texto: 'O cenário está ligado? A URL está completa? O History mostra se chegou.' },
      { icone: TriangleAlert, titulo: 'O AppSheet pede para publicar', texto: 'Não precisa: o protótipo funciona com até 10 usuários de teste.' },
    ],
    notes: `Bloco elástico de perguntas (até 20h28): absorve atrasos.
Com alunos: ler o chat primeiro. O FAQ cobre o resto, um item por passo (respostas completas no conteudo.md, seção 8.5).
1. Autorização do Google: conta diferente da logada no navegador (janela anônima), conexão expirada (reautorizar em Connections) ou conta de organização que bloqueia apps de terceiros.
2. Créditos: ver no History o que gastou; quase sempre é polling ligado à toa.
3. Webhook: testar com navegador ou curl; Accepted quer dizer que chegou; se vem do Bubble, olhar primeiro o log do Bubble.
4. AppSheet: protótipo com até 10 usuários basta; publicar é pago.
Extras se sobrar tempo: Google Forms no lugar do Bubble (é polling); a IA pode errar (por isso só sugere); "minha URL está na gravação" (vou apagar e recriar amanhã; começo da Aula 4).
Ponte: encerramento.`,
  }),

  // S65
  closing({
    frase: 'Está tudo conectado.\nMas é seguro, aguenta e quanto custa?',
    proxima: { data: 'Quinta, 29 de outubro, 19h', tema: 'Publicar, avaliar e o que vem depois' },
    tarefas: [
      { texto: 'Traga a frase de pitch do seu app', icone: Presentation },
      { texto: 'Traga 3 riscos: dados, custo e plataforma', icone: TriangleAlert },
      { texto: 'Desative o cenário depois de testar', icone: PowerOff },
    ],
    contato: 'A gravação e o PDF do deck ficam no AVA. Dúvidas: fórum da disciplina.',
    notes: `Passo 0: a frase. "Está tudo conectado. Mas é seguro, aguenta e quanto custa?"
Passo 1: "Essa é a Aula 4, dia 29 de outubro: publicar, avaliar e o que vem depois. Tragam o pitch e os três riscos."
"Obrigado por ficarem até aqui. A gravação e o PDF ficam no AVA. Boa noite."
Parar a gravação ANTES de sair do Meet: três pontos, Gerenciar gravação, Parar gravação.`,
  }),
];
