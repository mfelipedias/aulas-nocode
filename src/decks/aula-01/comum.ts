/**
 * Constantes compartilhadas pelos capítulos da Aula 1.
 * Os ids "Snn" nos títulos dos slides seguem o storyboard (aula-01-do-problema-ao-prototipo/storyboard.md).
 */

/** Total de capítulos numerados da aula (abertura a frio fica fora da contagem). */
export const TOTAL_CAPITULOS = 9;

/**
 * Capítulos da aula com a marca de tempo da gravação (serve de índice para quem assiste depois).
 * A agenda numera pela posição: o item 1 é o capítulo 01, e assim por diante.
 */
export const CAPITULOS = [
  { titulo: 'O que é no-code', duracao: '04:00' },
  { titulo: 'O mapa do ecossistema', duracao: '14:00' },
  { titulo: 'O projeto da disciplina', duracao: '28:00' },
  { titulo: 'Planejar antes de construir', duracao: '33:00' },
  { titulo: 'UX, UI e a landing page', duracao: '48:00' },
  { titulo: 'Demo: wireframe no Excalidraw', duracao: '53:00' },
  { titulo: 'Demo: página gerada por IA', duracao: '63:00' },
  { titulo: 'Leitura crítica', duracao: '77:00' },
  { titulo: 'Fechamento', duracao: '82:00' },
];

/** Caminho de mídia da aula (relativo a public/). */
export const m = (arquivo: string) => `media/aula-01/${arquivo}`;
