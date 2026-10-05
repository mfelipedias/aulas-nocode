/**
 * Catálogo de arquétipos (ver 00-DIRECAO-DE-ARTE.md, seção 10, e GUIA-DE-AUTORIA.md).
 * Cada função recebe dados tipados e devolve um SlideDef.
 */

// Abertura e estrutura
export { cover } from './cover';
export { chapter } from './chapter';
export { agenda } from './agenda';
export { recap } from './recap';
export { closing } from './closing';

// Ideias e texto
export { statement } from './statement';
export { quote } from './quote';
export { definition } from './definition';
export { bulletsRich } from './bulletsRich';
export { twoColumn } from './twoColumn';
export { checklist } from './checklist';
export { grid } from './grid';

// Dados e mercado
export { stat } from './stat';
export { comparison } from './comparison';
export { constellation } from './constellation';
export { caseStudy } from './caseStudy';
export { timeline } from './timeline';

// Técnica e diagramas
export { code } from './code';
export { flow } from './flow';
export { dataModel } from './dataModel';
export { requestResponse } from './requestResponse';

// Telas, mídia e demonstração
export { showcase } from './showcase';
export { imageFull } from './imageFull';
export { videoDemo } from './videoDemo';
export { demo } from './demo';
export { pause } from './pause';

// Tipos úteis para os decks
export type { Midia, Regiao } from './parts/media';
export type { Visual, VisualFoco } from './parts/visual';
export type { FlowNode, FlowEdge, Entidade, Campo, Relacao } from './parts/diagram';
export type { Linguagem } from './parts/code';
export { CENAS, type CenaNome } from '../engine/scenes';
