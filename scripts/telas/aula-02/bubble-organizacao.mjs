import { C, browser, doc, icon, rect, selo, table, text } from '../lib.mjs';

// S40 (tela cheia 1920x1080, legenda sobre degradê no canto inferior esquerdo):
// a página organizacao no preview, aberta sem login, com 25 inscrições fictícias e o contador.
const W = 1920;
const H = 1080;

const b = browser({ w: W, h: H, url: 'hackathon-aula02.bubbleapps.io/version-test/organizacao', aba: 'Organização · Hackathon' });
const x0 = 120;
const y0 = b.y;

const nomes = [
  ['Ana Exemplo', 'ana@example.com', '(11) 98765-4321', 'Web'],
  ['Bruno Exemplo', 'bruno@example.com', '(21) 99876-1234', 'Mobile'],
  ['Carla Exemplo', 'carla@example.com', '(31) 98123-4567', 'IA'],
  ['Diego Teste', 'diego.t@example.com', '(41) 99654-3210', 'Automação'],
  ['Elisa Teste', 'elisa@example.com', '(51) 98432-1098', 'Web'],
  ['Fábio Exemplo', 'fabio@example.com', '(61) 99321-8765', 'IA'],
  ['Gabriela Teste', 'gabi@example.com', '(71) 98210-6543', 'Mobile'],
  ['Hugo Exemplo', 'hugo@example.com', '(81) 99109-4321', 'Automação'],
  ['Iara Teste', 'iara@example.com', '(85) 98098-7654', 'Web'],
  ['João Exemplo', 'joao@example.com', '(92) 99987-6543', 'IA'],
  ['Karen Teste', 'karen@example.com', '(11) 98876-5432', 'Mobile'],
  ['Lucas Exemplo', 'lucas@example.com', '(19) 99765-4321', 'Web'],
];

const pagina = [
  rect(0, y0, W, H - y0, { fill: '#F7F8FB' }),
  // cabeçalho da página
  icon('Users', x0, y0 + 48, 40, C.blue),
  text(x0 + 60, y0 + 82, 'Organização · Hackathon No-Code 2026', { size: 40, weight: 750 }),
  text(x0, y0 + 130, 'Lista de inscrições, ordenada por data de inscrição.', { size: 24, fill: C.ink2 }),
  // contadores
  rect(1240, y0 + 36, 270, 112, { r: 16, fill: C.panel, stroke: C.line }),
  text(1266, y0 + 96, '25', { size: 52, weight: 750, fill: C.blue }),
  text(1346, y0 + 96, 'inscrições', { size: 24, fill: C.ink2 }),
  text(1266, y0 + 130, 'de 120 vagas', { size: 20, fill: C.ink3 }),
  rect(1530, y0 + 36, 270, 112, { r: 16, fill: C.panel, stroke: C.line }),
  text(1556, y0 + 96, '95', { size: 52, weight: 750, fill: C.green }),
  text(1636, y0 + 96, 'vagas', { size: 24, fill: C.ink2 }),
  text(1556, y0 + 130, 'restantes', { size: 20, fill: C.ink3 }),
  table(
    x0,
    y0 + 190,
    [
      { titulo: 'Nome', w: 420 },
      { titulo: 'E-mail', w: 520 },
      { titulo: 'Telefone', w: 380 },
      { titulo: 'Trilha', w: 360 },
    ],
    nomes.slice(0, 8),
    { rh: 56, size: 24 },
  ),
];

// paginação do Repeating Group (o restante fica sob a legenda do slide)
const rodape = text(x0, y0 + 190 + 56 * 9 + 44, 'Mostrando 8 de 25 · Próxima ›', { size: 22, fill: C.ink3 });

export default {
  arquivo: 'media/aula-02/tela-bubble-organizacao.svg',
  svg: doc(W, H, [b.svg, ...pagina, rodape, `<g transform="translate(0 ${-(H - y0 - 54)})">${selo(W, H)}</g>`].join('\n')),
};
