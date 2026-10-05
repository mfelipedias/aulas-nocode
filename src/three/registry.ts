import type { SceneFactory } from './gl';
import { createAmbient } from './scenes/ambient';
import { createConstellation } from './scenes/constellation';
import { createGraph } from './scenes/graph';
import { createHero } from './scenes/hero';
import { createHorizon } from './scenes/horizon';
import { createPanels } from './scenes/panels';

/** Fábricas de cena 3D por chave (SceneKey). Carregado só quando há WebGL. */
export const FACTORIES: Record<string, SceneFactory> = {
  ambient: createAmbient,
  hero: createHero,
  constellation: createConstellation,
  graph: createGraph,
  panels: createPanels,
  horizon: createHorizon,
};
