import { CircleCheck, Database, Inbox, MousePointerClick } from 'lucide';
import { chapter, demo, flow, showcase } from '../../archetypes';
import type { SlideDef } from '../../engine/types';

/** Capítulo 4: O Bubble chama o Make (S30 a S33, 19h36 a 19h44). */
export const bloco4: SlideDef[] = [
  // S30
  chapter({
    numero: 4,
    total: 8,
    titulo: 'O Bubble chama\no Make',
    subtitulo: 'O app da Aula 2 avisa o fluxo a cada inscrição.',
    cena: 'grafo-amplo',
    notes: `Transição de 10 segundos. Marcador 36:00.
"O curl fui eu fingindo ser um sistema. Agora o sistema de verdade."`,
  }),

  // S31
  flow({
    titulo: 'O clique em “Quero minha vaga”',
    nos: [
      { id: 'clica', rotulo: 'Clica', sub: 'usuário', icone: MousePointerClick, tipo: 'gatilho', col: 0, linha: 0 },
      { id: 'salva', rotulo: 'Salva a Inscricao', sub: 'Bubble, dono do dado', icone: Database, tipo: 'dado', col: 1, linha: 0 },
      { id: 'recebe', rotulo: 'Recebe o POST', sub: 'webhook do Make', plataforma: 'make', col: 2, linha: 0 },
      { id: 'aceita', rotulo: '200 Accepted', sub: 'Make responde já', icone: CircleCheck, col: 2, linha: 1 },
      { id: 'fila', rotulo: 'Processa na fila', sub: 'IA, linha e e-mail', icone: Inbox, tipo: 'externo', col: 3, linha: 0 },
    ],
    ligacoes: [
      { de: 'clica', para: 'salva' },
      { de: 'salva', para: 'recebe', rotulo: 'POST JSON' },
      { de: 'recebe', para: 'aceita', rotulo: 'na hora' },
      { de: 'recebe', para: 'fila' },
    ],
    passos: [['clica'], ['salva'], ['recebe'], ['aceita'], ['fila']],
    title: 'O que acontece no clique',
    notes: `Passo 0: o clique.
Passo 1: "Primeiro o Bubble salva a inscrição no banco dele. O Bubble continua dono do dado."
Passo 2: "Depois ele faz um POST com JSON para o webhook do Make, exatamente o que eu fiz com o curl."
Passo 3: "O Make responde Accepted na hora, antes de terminar o trabalho."
Passo 4: "Ele coloca a inscrição na fila e processa: IA, planilha, e-mail."
"Isso se chama processamento assíncrono. É por isso que a pessoa vê a confirmação no Bubble na hora, sem esperar o e-mail sair."
Fonte: Make Help, Webhooks (resposta padrão 200 "Accepted" quando o dado entra na fila), acesso em 04/10/2026.
Adaptação: o storyboard pedia raias verticais por sistema; o sistema aparece na linha de apoio de cada nó.
Ponte: para o Bubble.`,
  }),

  // S32
  demo({
    plataforma: 'bubble',
    titulo: 'API Connector: o Bubble faz um POST',
    passos: [
      'Criar a chamada nova_inscricao (POST, JSON)',
      'Initialize call',
      'Pôr a chamada no workflow do botão',
      'Inscrever-se no preview e ver os dois logs',
    ],
    duracao: 'Cerca de 5 minutos',
    url: 'bubble.io/page?id=hackathon-aula03&tab=Plugins',
    captura: 'media/aula-03/bubble-api-connector.png',
    video: { src: 'media/aula-03/demo-bubble-make.mp4', label: 'Backup: Bubble chamando o Make' },
    title: 'Demo: o Bubble faz um POST',
    notes: `App hackathon-aula03, aba Plugins, API Connector instalado e vazio.
1. Add another API (ou + New) "Make", Authentication None. Chamada nova_inscricao: Use as Action, Data type Text, POST, URL do webhook, Body JSON com nome, email, telefone, trilha e ideia (ideia sem aspas). Desmarcar Private nos parâmetros.
2. Initialize call: resposta Accepted. A Carla aparece na planilha e recebe o e-mail: é uma inscrição real de teste.
3. Workflow do botão: depois de Create a new Inscricao, Plugins, Make - nova_inscricao. Mapear Result of step 1; trilha com Display; ideia com :formatted as JSON-safe.
4. Preview: Davi Amostra, trilha IA. Ver planilha, Gmail, History do Make e Server logs do Bubble.
Lembrar: Data type da resposta = Text. Se aparecer "non-object and you picked JSON", o erro vira conteúdo.
Bubble lento mais de 30 s: tecla V (demo-bubble-make.mp4). Nada chega: curl com os dados do Davi ("o contrato é o mesmo").
Passo a passo completo: conteudo.md, seção 4.3.`,
  }),

  // S33
  showcase({
    titulo: 'Dois logs, uma verdade',
    midia: {
      src: 'media/aula-03/bubble-logs.png',
      descricao: 'Server logs do Bubble com a chamada à API enviada ao Make',
    },
    url: 'bubble.io · Server logs',
    rotulo: 'Bubble: Server logs',
    par: {
      midia: {
        src: 'media/aula-03/make-history.png',
        descricao: 'History do cenário no Make com a execução e os três módulos verdes',
      },
      url: 'make.com · History',
      rotulo: 'Make: History',
    },
    anotacoes: [
      { x: 40, y: 40, titulo: 'A chamada saiu?', texto: 'Server logs do Bubble.' },
      { x: 40, y: 40, naPar: true, titulo: 'Chegou e foi processada?', texto: 'History do Make: três módulos verdes.' },
      { x: 50, y: 85, titulo: 'Se algo falhar', texto: 'Comece pelo log de quem enviou.' },
    ],
    notes: `"Depurar integração é procurar onde a mensagem parou."
1. Server logs do Bubble: a chamada saiu?
2. History do Make: chegou? Foi processada? Três módulos verdes.
3. A regra: comece pelo log de quem enviou.
Buffer 2: se a demo atrasou, este slide pode durar 30 s.
Mídia: duas capturas lado a lado, bubble-logs.png (Server logs) e make-history.png (History), cada uma em 1920 x 1200.
Ponte: "Temos um fluxo funcionando. Agora, o que as empresas fazem com isso, quanto custa e o que acontece quando dá errado."`,
  }),
];
