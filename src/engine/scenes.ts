import type { SceneRequest } from './types';

/**
 * Fundos 3D com nome. Os decks escolhem por slide com `cena: 'grafo'` (campo comum a todos os
 * arquétipos), sem escrever código de cena. Slides vizinhos com a mesma cena só animam parâmetros;
 * trocar de cena faz um dissolve curto. Use a troca para marcar mudança de assunto, não a cada slide.
 *
 * Regra de ritmo: em slides densos (tabelas, código, diagramas) prefira 'nevoa-suave' ou 'vazio'.
 */
export const CENAS = {
  /** Nebulosa na cor da aula, concentrada à direita (padrão da maioria dos arquétipos). */
  nevoa: { key: 'ambient', params: { focus: [0.72, 0.42], intensity: 1 } },
  /** Nebulosa à esquerda: equilibra slides com conteúdo pesado à direita. */
  'nevoa-esquerda': { key: 'ambient', params: { focus: [0.24, 0.55], intensity: 0.9 } },
  /** Nebulosa centralizada: citações, declarações centradas. */
  'nevoa-centro': { key: 'ambient', params: { focus: [0.5, 0.5], intensity: 0.85 } },
  /** Nebulosa baixa e pouca poeira: para slides densos (tabela, código, diagrama). */
  'nevoa-suave': { key: 'ambient', params: { focus: [0.62, 0.9], intensity: 0.5, dust: 0.35 } },
  /** "Blocos que montam" à direita (capa). */
  blocos: { key: 'hero', params: { side: 'right' } },
  /** Blocos montados ao centro, recuados (fundo para declaração curta). */
  'blocos-centro': { key: 'hero', params: { side: 'center' } },
  /** Blocos se dispersando (encerramento). */
  'blocos-dispersos': { key: 'hero', params: { side: 'center', state: 'scattered' } },
  /** Constelação de plataformas (usada pelo arquétipo constellation). */
  constelacao: { key: 'constellation' },
  /** Grafo de nós com pulsos, à direita: fluxos, APIs, automações. */
  grafo: { key: 'graph', params: { side: 'right' } },
  /** Grafo de nós ocupando a tela, mais recuado: abertura de capítulo de automação. */
  'grafo-amplo': { key: 'graph', params: { side: 'wide' } },
  /** Painéis de vidro empilhados à direita: telas, interfaces, comparativos de UI. */
  paineis: { key: 'panels', params: { side: 'right' } },
  /** Painéis de vidro ao centro, recuados: fundo de abertura de capítulo de interface. */
  'paineis-amplo': { key: 'panels', params: { side: 'wide' } },
  /** Piso de pontos até o horizonte, câmera parada. */
  horizonte: { key: 'horizon', params: { dolly: false } },
  /** Piso de pontos com a câmera avançando (abertura de capítulo). */
  'horizonte-avanco': { key: 'horizon', params: { dolly: true } },
  /** Só o fundo quase preto. */
  vazio: { key: 'none' },
} satisfies Record<string, SceneRequest>;

export type CenaNome = keyof typeof CENAS;

export const cenaRequest = (nome: CenaNome): SceneRequest => CENAS[nome] as SceneRequest;
