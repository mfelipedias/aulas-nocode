import { C, doc, icon, rect, selo, text } from '../lib.mjs';
import { H, W, paginaIA } from './aula01-pagina-ia.mjs';

// S01, passo 3: a mesma página depois do clique, com dados fictícios. A tela agradece, mas nada foi guardado.
const aviso = [
  rect(580, 658, 610, 56, { r: 12, fill: C.greenBg, stroke: '#BDE5CF' }),
  icon('CircleCheck', 598, 674, 24, C.green),
  text(634, 694, 'Obrigado! Sua inscrição foi enviada.', { size: 20, weight: 600, fill: '#14663F' }),
].join('\n');

export default {
  arquivo: 'media/aula-02/tela-aula01-teste-envio.svg',
  svg: doc(W, H, paginaIA({ nome: 'Ana Exemplo', email: 'ana@example.com', telefone: '(11) 98765-4321', clique: true }) + aviso + selo(W, H), { fundo: '#FAF9FF' }),
};
