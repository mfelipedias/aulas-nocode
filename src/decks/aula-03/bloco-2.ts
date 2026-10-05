import {
  AppWindow,
  BellRing,
  BookOpen,
  BrainCircuit,
  Braces,
  ChefHat,
  CircleCheck,
  CircleX,
  ConciergeBell,
  KeyRound,
  Link,
  MousePointerClick,
  Mail,
  Pencil,
  Plus,
  Route,
  Search,
  ServerCrash,
  Smartphone,
  Table2,
  Tags,
  Timer,
  Trash2,
  User,
  UtensilsCrossed,
} from 'lucide';
import { chapter, code, comparison, demo, flow, grid, pause, stat, statement, twoColumn } from '../../archetypes';
import type { SlideDef } from '../../engine/types';

/** Capítulo 2: APIs sem mistério (S12 a S24, 19h10 a 19h24). */
export const bloco2: SlideDef[] = [
  // S12
  chapter({
    numero: 2,
    total: 8,
    titulo: 'APIs sem mistério',
    subtitulo: 'O que todas as ferramentas de integração fazem por baixo: pedir e responder.',
    cena: 'grafo-amplo',
    notes: `Transição de 10 segundos.
"Para escolher ferramenta, primeiro é preciso entender o que todas elas fazem por baixo: chamar APIs."
Marcador 10:00 do índice da gravação.`,
  }),

  // S13
  flow({
    titulo: 'Uma API é um garçom com cardápio',
    nos: [
      { id: 'voce', rotulo: 'Você', sub: 'o app que pede', icone: User, tipo: 'gatilho', col: 0, linha: 0 },
      { id: 'cardapio', rotulo: 'Cardápio', sub: 'a documentação', icone: BookOpen, tipo: 'dado', col: 0, linha: 1 },
      { id: 'garcom', rotulo: 'Garçom', sub: 'a API', icone: ConciergeBell, col: 1, linha: 0 },
      { id: 'cozinha', rotulo: 'Cozinha', sub: 'o sistema com os dados', icone: ChefHat, tipo: 'externo', col: 2, linha: 0 },
      { id: 'prato', rotulo: 'Prato', sub: 'a resposta, de volta', icone: UtensilsCrossed, col: 3, linha: 0 },
    ],
    ligacoes: [
      { de: 'voce', para: 'cardapio', rotulo: 'consulta', tracejada: true },
      { de: 'voce', para: 'garcom', rotulo: 'pedido' },
      { de: 'garcom', para: 'cozinha' },
      { de: 'cozinha', para: 'prato', rotulo: 'resposta' },
    ],
    passos: [[], ['voce', 'cardapio'], ['garcom', 'cozinha'], ['prato']],
    title: 'API: o garçom com cardápio',
    notes: `Passo 0: só o título. "Imaginem um restaurante."
Passo 1: Você e o Cardápio. "Você é o cliente: no nosso caso, um aplicativo que precisa de alguma coisa. Você não entra na cozinha. Você olha o cardápio, que diz o que existe e como pedir."
Passo 2: Garçom e Cozinha. "O garçom é a API. Ele leva o pedido para a cozinha, que é o sistema que tem os dados."
Passo 3: o Prato. "E traz o prato, que é a resposta."
O detalhe que importa: "Se você pedir algo que não está no cardápio, o garçom volta e diz 'não temos'. Em API, até o 'não temos' vem num formato combinado. Guardem isso para os códigos de status."
Ponte: as quatro peças de toda requisição.`,
  }),

  // S14
  twoColumn({
    titulo: 'Anatomia de uma requisição',
    topicos: [
      { icone: Route, titulo: 'Método', texto: 'O que você quer fazer: buscar, criar, alterar, apagar.', linhas: '1' },
      { icone: Link, titulo: 'Endpoint', texto: 'O endereço do recurso: servidor e caminho.', linhas: '1-2' },
      { icone: Tags, titulo: 'Headers', texto: 'Informações sobre o pedido: o formato e a chave.', linhas: '3-4' },
      { icone: Braces, titulo: 'Body (payload)', texto: 'Os dados enviados, quase sempre em JSON.', linhas: '6' },
    ],
    visual: {
      tipo: 'codigo',
      linguagem: 'http',
      arquivo: 'Requisição HTTP (endereço fictício)',
      codigo: `
        POST /inscricoes HTTP/1.1
        Host: api.hackathon-exemplo.com
        Content-Type: application/json
        x-api-key: ••••••••

        { "nome": "Ana Exemplo", "trilha": "Web" }
      `,
    },
    notes: `"Toda requisição tem quatro peças." Cada passo destaca as linhas da peça no painel; o resto esmaece.
Passo 1: método. POST quer dizer criar.
Passo 2: endpoint. /inscricoes, num servidor de exemplo.
Passo 3: headers. "O que estou mandando é JSON" e "esta é a minha chave". A chave está mascarada de propósito.
Passo 4: body, também chamado de payload: os dados.
"Toda integração que vocês virem, do Make ao aplicativo do banco no celular, é isso aqui."
Avisar: o endereço é fictício, só para mostrar o formato.
Ponte: o método muda o significado.`,
  }),

  // S15
  grid({
    titulo: 'Os verbos do HTTP',
    cartoes: [
      { icone: Search, titulo: 'GET: buscar', itens: ['Buscar as inscrições', 'GET /inscricoes'] },
      { icone: Plus, titulo: 'POST: criar', itens: ['Criar uma inscrição', 'POST /inscricoes'] },
      { icone: Pencil, titulo: 'PUT e PATCH: alterar', itens: ['Marcar presença', 'PATCH /inscricoes/42'] },
      { icone: Trash2, titulo: 'DELETE: remover', itens: ['Cancelar a inscrição', 'DELETE /inscricoes/42'] },
    ],
    conclusao: 'O endereço é o mesmo; o verbo muda o significado.',
    notes: `Um cartão por passo.
Passo 1: GET busca. Passo 2: POST cria.
Passo 3: PUT e PATCH alteram. PUT troca o registro inteiro; PATCH só o que você mandou.
Passo 4: DELETE remove.
Passo 5: a frase. "Reparem que o endereço é praticamente o mesmo. O que muda o significado é o verbo. E o 42 no fim é o identificador do registro: a chave única que vimos na Aula 2."
"Quando vocês configurarem o Make ou o Bubble, vão escolher um desses verbos numa lista."
Ponte: "Chega de teoria: uma API de verdade, agora."`,
  }),

  // S16
  demo({
    plataforma: 'Navegador + ViaCEP',
    titulo: 'Uma API pública, sem conta e sem chave',
    passos: ['Pedir um CEP que existe', 'Pedir um CEP com formato errado', 'Pedir um CEP que não existe'],
    duracao: 'Cerca de 2 minutos',
    url: 'viacep.com.br/ws/01001000/json/',
    captura: 'media/aula-03/esquema-viacep-json.svg',
    video: { src: 'media/aula-03/demo-viacep.mp4', label: 'Backup: ViaCEP no navegador' },
    title: 'Demo: ViaCEP no navegador',
    notes: `Trocar para a aba do navegador (perfil da aula, zoom 150%). DevTools fechado.
1. Barra de endereço: viacep.com.br/ws/01001000/json/ e Enter. Marcar Pretty-print. "Acabei de fazer uma requisição GET. Sem conta, sem chave."
2. F12, aba Network, F5, clicar na linha json/. Mostrar Request Method GET, Status 200 OK, Content-Type application/json.
3. Trocar para 0100100 (7 dígitos): status 400. "A API nem tentou procurar: pedido mal formado. O erro foi meu."
4. Trocar para 99999999: 200 com "erro": "true". "Deu certo, mas com um campo erro. Decisão de quem fez a API: por isso documentação importa."
5. Fechar o DevTools e voltar ao deck no slide seguinte.
ViaCEP fora do ar: brasilapi.com.br/api/cep/v2/01001000 ("mesmo CEP, outra API, outros nomes de campo"). Sem internet: tecla V (demo-viacep.mp4).
Não fazer testes em lote na véspera: a ViaCEP avisa que uso massivo pode bloquear o acesso.
A moldura mostra um esquema desenhado da resposta, não uma captura.`,
  }),

  // S17
  code({
    titulo: 'O que voltou: JSON',
    subtitulo: 'Resposta real de viacep.com.br/ws/01001000/json/ em 04/10/2026.',
    linguagem: 'json',
    arquivo: 'GET /ws/01001000/json/',
    codigo: `
      {
        "cep": "01001-000",
        "logradouro": "Praça da Sé",
        "complemento": "lado ímpar",
        "unidade": "",
        "bairro": "Sé",
        "localidade": "São Paulo",
        "uf": "SP",
        "estado": "São Paulo",
        "regiao": "Sudeste",
        "ibge": "3550308",
        "gia": "1004",
        "ddd": "11",
        "siafi": "7107"
      }
    `,
    passos: [
      { linhas: 2, nota: 'Chave : valor. A chave sempre vem entre aspas.' },
      { linhas: 7, nota: 'A cidade se chama "localidade": decisão de quem fez a API.' },
      { linhas: 5, nota: 'Campo vazio continua sendo campo.' },
      { linhas: 11, nota: 'Número guardado como texto: ninguém faz conta com o IBGE.' },
    ],
    notes: `"JSON é só isso: pares de chave e valor entre chaves."
Passo 1: linha 2, chave e valor.
Passo 2: linha 7. "A cidade aqui se chama localidade. Não é cidade, não é city. Por isso existe documentação."
Passo 3: linha 5, unidade vazia.
Passo 4: linha 11, o IBGE entre aspas.
"O Make, o Bubble e o AppSheet leem e escrevem JSON. Quando vocês virem 'mapear um campo', é escolher uma dessas chaves."
Para a gravação: "Pause o vídeo e consulte o seu próprio CEP."
Ponte: e quando dá errado? A API responde com um número.`,
  }),

  // S18
  grid({
    titulo: 'Códigos de status: a API responde com um número',
    cartoes: [
      { icone: CircleCheck, titulo: '200 e 201', texto: 'Família 2: deu certo. 201 = criei.' },
      { icone: CircleX, titulo: '400', texto: 'Família 4, o erro foi seu: pedido mal formado.' },
      { icone: KeyRound, titulo: '401 e 403', texto: 'Sem chave ou sem permissão.' },
      { icone: Search, titulo: '404', texto: 'O recurso não existe.' },
      { icone: Timer, titulo: '429', texto: 'Muitas requisições. Make: até 300 a cada 10 s.' },
      { icone: ServerCrash, titulo: '500', texto: 'Família 5: o erro é do servidor.' },
    ],
    revelar: 'todos',
    conclusao: 'ViaCEP com CEP inexistente: status 200 com "erro": "true".',
    fonte: 'ViaCEP, chamadas reais em 04/10/2026; limite de 300 req/10 s: Make Help, Webhooks.',
    notes: `Passo 0: os seis cartões juntos. Ler por família.
"Família 2: deu certo. 200 é OK, 201 é 'criei'. Família 4: o erro foi seu. 400 pedido mal formado, como o CEP de sete dígitos. 401 e 403, sem chave ou sem permissão. 404, não existe. E 429, que vocês vão encontrar no Make: calma, muitas requisições. O webhook do Make aceita até 300 a cada 10 segundos. Família 5: o erro é do servidor."
Passo 1: a faixa. "A ViaCEP fez uma escolha de design: CEP inexistente volta 200 com um campo erro. Outra API poderia devolver 404. Nenhuma das duas está errada; só precisa estar documentado."
Capturas de apoio (viacep-devtools.png e viacep-400.png) não cabem neste arquétipo: se quiser mostrar, abrir na demo.
Ponte: e quando a API não é pública?`,
  }),

  // S19
  code({
    titulo: 'API key: quem está chamando?',
    subtitulo: 'Fonte: Make Apps Documentation, Webhooks (API key).',
    linguagem: 'bash',
    arquivo: 'Terminal',
    codigo: `
      curl -X POST "https://hook.us2.make.com/••••••" \\
        -H "Content-Type: application/json" \\
        -H "x-make-apikey: ••••••••" \\
        -d '{"nome":"Ana Exemplo","trilha":"Web"}'
    `,
    passos: [
      { linhas: 3, nota: 'A chave vai no header, não na URL: URL aparece em log, em histórico e em print.' },
      { linhas: 1, nota: 'Sem a chave, o Make responde 401: não autorizado.' },
      { linhas: '1-4', nota: 'Chave é senha de sistema: nunca no código da página, nunca no print.' },
    ],
    notes: `"Quando a API não é pública, ela precisa saber quem está chamando. A forma mais comum é uma chave, enviada num header."
Passo 1: linha 3. "Este é o header que o Make usa para proteger um webhook com chave: x-make-apikey."
Passo 2: linha 1. "Sem ele, 401."
Passo 3: as duas regras. A chave vai no header, não na URL. E chave é senha de sistema. Os pontinhos estão lá de propósito.
"Na Aula 4: onde a chave deve morar, e por que nunca no navegador do usuário."
Ponte: pausa para pensar.`,
  }),

  // S20
  pause({
    pergunta: 'O Bubble precisa da cidade a partir do CEP digitado. Quem chama quem, e com qual verbo?',
    resposta: 'O Bubble chama a ViaCEP com GET. Quem precisa do dado pergunta.',
    segundos: 20,
    chat: 'Se estiver ao vivo, responda no chat.',
    notes: `Ler a pergunta e pensar em voz alta durante o anel: "Quem tem o dado? A ViaCEP. Quem precisa? O Bubble. Vou buscar ou criar?"
Com alunos: ler uma ou duas respostas do chat antes da revelação.
A resposta aparece sozinha ao fim de 20 s. Tecla T pausa a contagem.
Ponte: "E se for o contrário? Se quem tem a novidade é o outro sistema, e você não sabe quando ela vai aparecer?"`,
  }),

  // S21
  statement({
    partes: ['Webhook é uma API\nao contrário.', 'Você é avisado.'],
    apoio: 'Você não pergunta. Quando algo acontece lá, o outro sistema faz um POST no seu endereço.',
    cena: 'grafo',
    notes: `Passo 0: "Webhook é uma API ao contrário."
Passo 1: "Você não pergunta. Você é avisado."
"Na prática, um webhook é um endereço seu, esperando. Quando algo acontece do outro lado, por exemplo uma inscrição nova, o outro sistema faz um POST nesse endereço com os dados."
"No Make, esse endereço tem a cara de hook.us2.make.com seguido de um código. Daqui a pouco eu crio um."
Ponte: dois jeitos de saber se chegou visita.`,
  }),

  // S22
  comparison({
    titulo: 'Olhar pela janela ou ouvir a campainha',
    colunas: [
      { id: 'polling', nome: 'Polling', icone: AppWindow, sub: 'olhar pela janela' },
      { id: 'webhook', nome: 'Webhook', icone: BellRing, sub: 'campainha' },
    ],
    linhas: [
      { criterio: 'Como funciona', celulas: ['Pergunta de tempos em tempos', 'O outro sistema avisa'], passo: 1 },
      { criterio: 'Atraso', celulas: ['Até 15 min (Make Free)', 'Segundos'], passo: 1 },
      { criterio: 'Custo no Make', celulas: ['1 crédito por checagem', 'Só quando há evento'], passo: 1 },
      {
        criterio: 'Servidor e energia',
        celulas: [
          { nivel: 4, rotulo: 'Alto, mesmo sem novidade' },
          { nivel: 1, rotulo: 'Baixo' },
        ],
        passo: 2,
      },
      { criterio: 'Quando usar', celulas: ['Sem webhook disponível', 'Sempre que puder'], passo: 2 },
    ],
    foco: { coluna: 'webhook', conclusao: 'Polling não é errado. Mas, quando dá para escolher, campainha.' },
    notes: `Passo 0: cabeçalho. "Dois jeitos de saber se chegou visita: olhar pela janela de tempos em tempos, que é polling, ou instalar uma campainha, que é webhook."
Passo 1: como funciona, atraso e custo. No Free do Make, o intervalo mínimo é 15 minutos: a inscrição pode esperar 15 minutos para virar e-mail. E cada checagem sem novidade já gasta um crédito.
Passo 2: servidor e energia, e quando usar. Menos requisição à toa é menos servidor trabalhando: o argumento volta na Aula 4, em consumo de recursos.
Passo 3: foco no webhook e a frase. "Muito sistema só oferece polling. Mas custa, mesmo quando nada acontece."
Buffer 1: se estiver atrasado, fundir os passos 2 e 3.
Ponte: vamos fazer a conta.`,
    fonte: 'Make Help: Operations e Pricing (Free: intervalo mínimo de 15 min). Acesso em 04/10/2026.',
  }),

  // S23
  stat({
    contexto: 'Polling a cada 15 minutos, durante um mês, sem nenhuma inscrição:',
    valor: 2880,
    descricao: 'checagens no mês, e cada uma é um crédito gasto. O plano Free tem 1.000.',
    unidades: false,
    fonte: 'Cálculo do professor a partir de Make Pricing (Free: 1.000 créditos/mês, intervalo mínimo 15 min) e Make Help, Operations. Acesso em 04/10/2026.',
    notes: `Passo 0: ler o contexto.
Passo 1: o número conta. Fazer a conta em voz alta: quatro por hora, vezes 24 horas, vezes 30 dias: 2.880.
"Quase três vezes o plano gratuito, para não acontecer nada."
"Com webhook, o mesmo mês com as 120 inscrições do hackathon custa cerca de 360 créditos: três módulos por inscrição. É por isso que a nossa automação começa com um webhook."
Ponte: o mapa do que vamos construir.`,
  }),

  // S24
  flow({
    titulo: 'O que vamos construir hoje',
    nos: [
      { id: 'bubble', rotulo: 'Bubble', sub: 'formulário', icone: MousePointerClick, tipo: 'gatilho', col: 0, linha: 0 },
      { id: 'make', rotulo: 'Webhook', sub: 'Make', plataforma: 'make', col: 1, linha: 0 },
      { id: 'ia', rotulo: 'IA', sub: 'classifica e escreve', icone: BrainCircuit, col: 2, linha: 0 },
      { id: 'planilha', rotulo: 'Planilha', sub: 'guarda a inscrição', icone: Table2, tipo: 'dado', col: 3, linha: 0 },
      { id: 'gmail', rotulo: 'Gmail', sub: 'confirma por e-mail', icone: Mail, col: 2, linha: 1 },
      { id: 'appsheet', rotulo: 'AppSheet', sub: 'check-in no celular', icone: Smartphone, tipo: 'externo', col: 3, linha: 1 },
    ],
    ligacoes: [
      { de: 'bubble', para: 'make', rotulo: 'POST (evento)' },
      { de: 'make', para: 'ia' },
      { de: 'ia', para: 'planilha' },
      { de: 'ia', para: 'gmail', rotulo: 'mensagem' },
      { de: 'planilha', para: 'appsheet', rotulo: 'lê a tabela' },
    ],
    passos: [[], ['bubble', 'make'], ['ia', 'planilha', 'gmail'], ['appsheet']],
    conclusao: 'Cada capítulo acende um pedaço deste mapa.',
    notes: `Este desenho é o índice do resto da aula. Ele volta na prova final (S57).
Passo 1: o Bubble faz um POST para um webhook do Make. Um evento.
Passo 2: o Make passa por uma IA, que classifica e escreve; grava uma linha na planilha; manda o e-mail.
Passo 3: o AppSheet lê a planilha e vira o app de check-in.
Passo 4: a frase. "Começando pelo meio: o Make."
Planilha, Gmail e AppSheet aparecem como nome e ícone genérico (marcas Google restritas, decisão C7).
Ponte: capítulo 3, a primeira demo.`,
  }),
];
