import type { Projected, V3 } from './geom';
import type { CenaNome } from './scenes';

export type AccentKey = 'aula1' | 'aula2' | 'aula3' | 'aula4';

/**
 * Cenas 3D disponíveis. 'none' = só o fundo base.
 * Nos decks, prefira os nomes prontos de engine/scenes.ts (campo `cena`).
 */
export type SceneKey = 'none' | 'ambient' | 'hero' | 'constellation' | 'graph' | 'panels' | 'horizon';

/**
 * O que um arquétipo pode pedir ao renderizador 3D (implementado por three/gl.ts).
 * Interface própria para que os arquétipos não importem o Three.js.
 */
export interface GLApi {
  /** true quando há uma cena ativa com câmera. */
  readonly hasCamera: boolean;
  /** Projeta um ponto do mundo da cena ativa para px do palco. */
  projectPoint(p: V3): Projected;
  onFrame(hook: (t: number, dt: number) => void): () => void;
}

/**
 * live    = apresentação normal (animações + WebGL)
 * preview = iframe da visão do apresentador (sem WebGL, sem animação)
 * thumb   = miniatura da visão geral (estado final, sem WebGL)
 * print   = exportação PDF (estado final, 3D vira imagem estática)
 */
export type RenderMode = 'live' | 'preview' | 'thumb' | 'print';

export interface SceneRequest {
  key: SceneKey;
  /** Parâmetros livres repassados à cena (ex.: lado do foco, intensidade). */
  params?: Record<string, unknown>;
}

export interface SlideCtx {
  deck: DeckDef;
  index: number;
  mode: RenderMode;
  reduced: boolean;
  /** Presente apenas no modo live com WebGL disponível. */
  gl: GLApi | null;
  /** Pede ao deck para avançar um passo (ex.: fim da contagem da pausa). Só no modo live. */
  advance?: () => void;
}

export interface SlideInstance {
  el: HTMLElement;
  /** Quantidade de passos (fragmentos). 0 = slide sem passos. */
  steps: number;
  /** Mostra o estado do passo. dir: 1 avançando, -1 voltando, 0 instantâneo. */
  setStep(step: number, dir: 1 | -1 | 0): void;
  /** Animação de entrada (apenas live). */
  enter?(): void;
  /** Chamado antes de o slide sair. */
  leave?(): void;
  destroy?(): void;
  /** Cena 3D desejada (pode depender dos dados). */
  scene?: SceneRequest;
  /** Tecla tratada pelo slide (ex.: T pausa a contagem). Retorna true se consumiu. */
  onKey?(key: string): boolean;
}

export interface BackupVideo {
  /** Caminho relativo a public/, ex.: media/aula-01/demo-bubble.mp4 */
  src: string;
  poster?: string;
  label?: string;
}

export interface SlideDef {
  type: string;
  /** Título curto para visão geral e apresentador. */
  title: string;
  notes?: string;
  /** Mostra rodapé com aula/progresso (padrão: true). */
  chrome?: boolean;
  scene?: SceneRequest;
  video?: BackupVideo;
  /** Arquivos de mídia citados pelo slide (caminhos "media/..."), para checagem e para o apresentador. */
  media?: string[];
  build(ctx: SlideCtx): SlideInstance;
}

/** Campos comuns aceitos por todos os arquétipos. */
export interface CommonFields {
  /** Título curto (visão geral e apresentador). Padrão: derivado do conteúdo. */
  title?: string;
  /** Notas do apresentador. Uma ideia por linha. */
  notes?: string;
  /** Rodapé com aula e progresso. Padrão do arquétipo. */
  chrome?: boolean;
  /** Vídeo de backup (tecla V). */
  video?: BackupVideo;
  /** Fundo 3D por nome (ver engine/scenes.ts). Ex.: 'grafo', 'paineis', 'nevoa-suave'. */
  cena?: CenaNome;
  /** Pedido de cena 3D bruto (avançado). Tem precedência sobre `cena`. */
  scene?: SceneRequest;
  /** Cronômetro no canto inferior direito (demos, prova ao vivo). Tecla T pausa/retoma. */
  cronometro?: Cronometro;
}

/**
 * Cronômetro no slide (campo comum `cronometro`). Pensado para demos e para a "prova ao vivo":
 * o professor vê quanto tempo passou (ou falta) sem sair do deck.
 */
export interface Cronometro {
  /** 'progressivo' (padrão) conta 00:00 para cima; 'regressivo' conta de `segundos` até 00:00. */
  modo?: 'progressivo' | 'regressivo';
  /** Duração do modo regressivo, em segundos (ex.: 480 = 8 min). */
  segundos?: number;
  /** Passo em que começa sozinho ao avançar (padrão 0 = quando o slide entra). Tecla T pausa/retoma. */
  inicio?: number;
  /** Rótulo curto ao lado do tempo (até ~24 caracteres), ex.: "desde o clique". */
  rotulo?: string;
}


export interface DeckDef {
  id: string;
  numero: 1 | 2 | 3 | 4;
  titulo: string;
  disciplina: string;
  data: string;
  horario: string;
  professor: string;
  /** Opcional: quando vazio, a capa não mostra a marca da instituição. */
  instituicao?: string;
  accent: AccentKey;
  /** Duração planejada em minutos (para o timer do apresentador). */
  duracaoMin: number;
  slides: SlideDef[];
}
