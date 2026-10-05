/**
 * Matemática 3D mínima, sem Three.js. Usada pelo DOM (constelação em miniatura/PDF/apresentador)
 * para projetar pontos com a mesma câmera da cena 3D, sem carregar o pacote do Three.
 */
export const STAGE_W = 1920;
export const STAGE_H = 1080;

export interface V3 {
  x: number;
  y: number;
  z: number;
}

export const v3 = (x = 0, y = 0, z = 0): V3 => ({ x, y, z });
export const add = (a: V3, b: V3): V3 => v3(a.x + b.x, a.y + b.y, a.z + b.z);
export const sub = (a: V3, b: V3): V3 => v3(a.x - b.x, a.y - b.y, a.z - b.z);
export const scale = (a: V3, s: number): V3 => v3(a.x * s, a.y * s, a.z * s);
export const dot = (a: V3, b: V3) => a.x * b.x + a.y * b.y + a.z * b.z;
export const cross = (a: V3, b: V3): V3 => v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
export const len = (a: V3) => Math.hypot(a.x, a.y, a.z);
export const norm = (a: V3): V3 => scale(a, 1 / (len(a) || 1));
export const lerp = (a: V3, b: V3, t: number): V3 => v3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
export const dist = (a: V3, b: V3) => len(sub(a, b));

/** Ponto projetado no palco (px) + distância até a câmera. */
export interface Projected {
  x: number;
  y: number;
  dist: number;
}

/** Câmera perspectiva equivalente à THREE.PerspectiveCamera + lookAt (up = +Y). */
export class SimpleCamera {
  readonly position: V3;
  readonly target: V3;
  private f: V3;
  private r: V3;
  private u: V3;
  private tanY: number;
  private aspect: number;

  constructor(fovDeg: number, position: V3, target: V3, aspect = STAGE_W / STAGE_H) {
    this.position = position;
    this.target = target;
    this.aspect = aspect;
    this.tanY = Math.tan((fovDeg * Math.PI) / 360);
    this.f = norm(sub(target, position));
    this.r = norm(cross(this.f, v3(0, 1, 0)));
    this.u = cross(this.r, this.f);
  }

  project(p: V3): Projected {
    const d = sub(p, this.position);
    const zc = dot(d, this.f);
    const nx = dot(d, this.r) / (zc * this.tanY * this.aspect);
    const ny = dot(d, this.u) / (zc * this.tanY);
    return { x: (nx * 0.5 + 0.5) * STAGE_W, y: (1 - (ny * 0.5 + 0.5)) * STAGE_H, dist: len(d) };
  }

  /** Ponto do mundo na profundidade z cujo reflexo na tela é (x, y) px. */
  fromScreen(x: number, y: number, z: number): V3 {
    const nx = (x / STAGE_W) * 2 - 1;
    const ny = 1 - (y / STAGE_H) * 2;
    const dir = add(add(this.f, scale(this.r, nx * this.tanY * this.aspect)), scale(this.u, ny * this.tanY));
    const t = (z - this.position.z) / dir.z;
    return add(this.position, scale(dir, t));
  }
}
