import { Boxes, KeyRound, Link2, Package, PlayCircle, Workflow } from 'lucide';
import { chapter, checklist, demo, grid, showcase } from '../../archetypes';
import type { SlideDef } from '../../engine/types';

/** Capítulo 3: Demo, o primeiro fluxo (S25 a S29, 19h24 a 19h36). */
export const bloco3: SlideDef[] = [
  // S25
  chapter({
    numero: 3,
    total: 8,
    titulo: 'Demo: o primeiro\nfluxo',
    subtitulo: 'Webhook, planilha e e-mail no Make, construídos do zero.',
    cena: 'grafo-amplo',
    notes: `Transição de 10 segundos. Marcador 24:00 da gravação.
"Começando pelo meio do mapa: o Make."`,
  }),

  // S26
  grid({
    titulo: 'Seis palavras do Make',
    subtitulo: 'A interface é só em inglês. Estes termos resolvem quase toda a demo.',
    cartoes: [
      { icone: Workflow, titulo: 'Scenario', texto: 'O fluxo inteiro.' },
      { icone: Boxes, titulo: 'Module', texto: 'Cada bolinha do fluxo: um app fazendo uma ação.' },
      { icone: PlayCircle, titulo: 'Trigger', texto: 'O módulo que começa tudo.' },
      { icone: Package, titulo: 'Bundle', texto: 'Um pacote de dados passando pelo fluxo. Uma inscrição é um bundle.' },
      { icone: Link2, titulo: 'Mapping', texto: 'Ligar um campo de um módulo a outro.' },
      { icone: KeyRound, titulo: 'Connection', texto: 'A autorização para o Make usar a sua conta de um app.' },
    ],
    revelar: 'todos',
    conclusao: 'Desde 27/08/2025, o Make cobra em créditos: 1 módulo executado = 1 crédito.',
    fonte: 'Make Help (vocabulário oficial); créditos desde 27/08/2025: aviso oficial do Make. Acesso em 04/10/2026.',
    notes: `Passo 0: os seis termos juntos. Ler cada um com o exemplo do hackathon.
Scenario: o fluxo inteiro. Module: cada bolinha. Trigger: o módulo que começa. Bundle: uma inscrição passando. Mapping: ligar campos, arrastando. Connection: a autorização que você dá para o Make usar a sua conta Google.
Passo 1: a cobrança. "No histórico ainda aparece a palavra operação: cada módulo executado é uma operação, e uma operação custa um crédito."
Vocabulário antecipado do capítulo 5 do plano geral para antes da demo.
Ponte: para a ferramenta.`,
  }),

  // S27
  demo({
    plataforma: 'make',
    titulo: 'Webhook, planilha, e-mail',
    passos: [
      'Criar o webhook e testar pelo navegador',
      'Gravar uma linha na planilha',
      'Enviar o e-mail de confirmação',
      'Ligar: imediatamente quando chegar',
    ],
    duracao: 'Cerca de 10 minutos',
    url: 'make.com · Scenario Builder',
    captura: 'media/aula-03/make-webhook-url.png',
    video: { src: 'media/aula-03/demo-make.mp4', label: 'Backup: primeiro fluxo no Make' },
    title: 'Demo: o primeiro fluxo no Make',
    notes: `Antes de trocar de aba: "Agora eu saio dos slides. Os quatro passos estão à esquerda."
Estado: cenário em branco "Hackathon — inscricao", conexões Google já autorizadas, planilha só com cabeçalho, Gmail vazio, Git Bash com fonte 24.
1. Custom webhook "hackathon-inscricao", copiar o endereço. Teste pelo navegador com a query string (linha pronta no aula03-comandos.txt): Accepted.
2. Google Sheets, Add a Row: mapear id (uuid), data_hora, nome, email, telefone, trilha, ideia; presente = FALSE.
3. Gmail, Send an Email: para 1.email, assunto "Inscrição confirmada", corpo com nome e trilha.
Filtro "dados minimos" (nome existe E email contém @), Run once, curl do Bruno; curl sem arroba (cortável).
4. Immediately as data arrives, ON, curl da Carla, aba History.
Cortes: B (só curl, sem navegador); C (filtro só no S36). Limite de 60 s para qualquer conserto: depois, cenário pronto ou tecla V.
Passo a passo completo: conteudo.md, seção 3.3. A URL do webhook nunca vai para o deck.
Ponte ao voltar: síntese do fluxo.`,
  }),

  // S28
  showcase({
    titulo: 'O fluxo que acabamos de montar',
    plataforma: 'make',
    midia: { src: 'media/aula-03/make-canvas-final.png', descricao: 'Canvas do Make: Custom webhook, filtro, Google Sheets Add a Row e Gmail Send an Email' },
    url: 'make.com · Scenario Builder',
    anotacoes: [
      { x: 16, y: 46, titulo: 'Custom webhook', texto: 'O endereço que recebe a inscrição.', zoom: { x: 0, y: 20, w: 50, h: 55 } },
      { x: 34, y: 46, titulo: 'Filtro', texto: 'Só passa com nome e um e-mail com arroba.', zoom: { x: 15, y: 20, w: 50, h: 55 } },
      { x: 54, y: 46, titulo: 'Add a Row', texto: 'Cada bundle vira uma linha na planilha.', zoom: { x: 32, y: 20, w: 50, h: 55 } },
      { x: 74, y: 46, titulo: 'Send an Email', texto: 'Mapeando nome e trilha. Agendado em Immediately as data arrives.', zoom: { x: 50, y: 20, w: 50, h: 55 } },
    ],
    notes: `Síntese de saída da demo, 40 segundos. Uma anotação por passo, com zoom no módulo.
1. Custom webhook: a campainha.
2. Filtro: o if do fluxo.
3. Add a Row: a linha que guarda.
4. Send an Email: o e-mail que avisa. E a chave Immediately que liga tudo.
"Gatilho, módulos, mapeamento. Repitam comigo mentalmente."
Mídia: make-canvas-final.png (versão sem IA). Conferir as posições x/y dos marcadores depois da captura.
A miniatura make-scheduling.png pedida no storyboard não cabe neste arquétipo: o agendamento está no texto da anotação 4.
Ponte: se não funcionou no seu.`,
  }),

  // S29
  checklist({
    titulo: 'Se não funcionou no seu',
    itens: [
      { texto: 'O webhook não “aprendeu” os campos', detalhe: 'Envie um teste antes de mapear.' },
      { texto: 'A linha chegou vazia na planilha', detalhe: 'O mapeamento aponta para o módulo 1? Cabeçalho na linha 1?' },
      { texto: 'Nada acontece', detalhe: 'O cenário está ligado e em Immediately as data arrives?' },
      { texto: 'O e-mail não chegou', detalhe: 'Olhe o Spam e a aba History do cenário.' },
      { texto: 'Erro de conexão com o Google', detalhe: 'Refaça a connection fora do horário de aula, na mesma conta.' },
    ],
    notes: `"Pause o vídeo se estiver replicando." Cada passo marca um item.
1. Sem estrutura determinada: mande um teste antes de mapear; se mudou, Redetermine data structure.
2. Linha vazia: mapeamento errado ou cabeçalho com acento, espaço ou linha em branco acima.
3. Accepted e nada acontece: cenário desligado; a requisição ficou na fila.
4. E-mail: Spam, endereço errado ou filtro barrou. O History mostra o módulo.
5. Autorização Google: connection expirada ou conta diferente da do navegador. Janela anônima resolve conflito de contas.
"Erro também é conteúdo: a mensagem de erro do Make diz o módulo e o motivo."
Com alunos: ler uma ou duas dúvidas do chat sobre a demo.
Ponte: "O curl fui eu fingindo ser um sistema. Agora o sistema de verdade: o Bubble da Aula 2."`,
  }),
];
