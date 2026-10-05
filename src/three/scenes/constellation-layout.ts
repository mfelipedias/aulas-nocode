import type { CategoryId } from '../../content/platforms';
import { SimpleCamera, v3, type V3 } from '../../engine/geom';

/**
 * Geometria compartilhada entre a cena 3D da constelação e o arquétipo (ladrilhos DOM).
 * Não importa o Three.js: funciona em miniaturas, PDF e na visão do apresentador sem WebGL.
 */

export const CAM = {
  fov: 34,
  position: v3(0, 0.6, 26),
  target: v3(0, -0.4, 0),
};

/** px por unidade de mundo em z = 0 (para converter offsets do layout). */
export const PX = 1080 / (2 * CAM.position.z * Math.tan(((CAM.fov / 2) * Math.PI) / 180));

export function makeCamera() {
  return new SimpleCamera(CAM.fov, CAM.position, CAM.target);
}

const REST = makeCamera();

/** Converte uma posição desejada no palco (px) + profundidade z em ponto do mundo (câmera em repouso). */
const fromScreen = (x: number, y: number, z: number) => REST.fromScreen(x, y, z);

export const CORE = fromScreen(960, 580, -2.5);

export interface GroupLayout {
  id: CategoryId;
  anchor: V3;
  shape: 'grid' | 'row';
}

/**
 * Âncoras definidas no espaço da tela (centro do aglomerado, px) + profundidade.
 * Pentágono irregular em volta do núcleo; o canto superior esquerdo fica para o título
 * e o superior direito (zona da câmera do Meet) fica livre.
 */
export const GROUPS: GroupLayout[] = [
  { id: 'sites', anchor: fromScreen(340, 700, 1.0), shape: 'grid' },
  { id: 'apps', anchor: fromScreen(1100, 335, -1.2), shape: 'grid' },
  { id: 'automacao', anchor: fromScreen(1610, 560, 0.2), shape: 'grid' },
  { id: 'dados', anchor: fromScreen(1330, 850, 1.4), shape: 'grid' },
  { id: 'ia', anchor: fromScreen(700, 850, 1.6), shape: 'grid' },
];

export const TILE_PITCH_X = 180;
export const TILE_PITCH_Y = 150;

/**
 * Offsets em px (centro do ladrilho) relativos à âncora do grupo.
 * `pitchX` alarga o espaçamento quando o grupo tem ladrilhos largos (wordmarks e nomes em texto).
 * Com 1 ou 2 ladrilhos (uma linha só), a linha fica centrada na âncora.
 */
export function tileOffsets(shape: 'grid' | 'row', n: number, pitchX = TILE_PITCH_X): Array<[number, number]> {
  if (shape === 'row') {
    const w = (n - 1) * pitchX;
    return Array.from({ length: n }, (_, i) => [i * pitchX - w / 2, 0]);
  }
  const rows = Math.ceil(n / 2);
  const out: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / 2);
    const inRow = Math.min(2, n - row * 2);
    const col = i % 2;
    const x = inRow === 1 ? 0 : (col - 0.5) * pitchX;
    out.push([x, (row - (rows - 1) / 2) * TILE_PITCH_Y]);
  }
  return out;
}

/** Offset em px do rótulo da categoria (acima do aglomerado). */
export function labelOffset(shape: 'grid' | 'row', n: number): [number, number] {
  if (shape === 'row') return [0, -104];
  const rows = Math.ceil(n / 2);
  return [0, -((rows - 1) * TILE_PITCH_Y) / 2 - 112];
}

export function offsetToWorld(anchor: V3, ox: number, oy: number): V3 {
  return v3(anchor.x + ox / PX, anchor.y - oy / PX, anchor.z);
}
