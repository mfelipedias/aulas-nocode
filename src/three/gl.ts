import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import type { GLApi, SceneKey, SceneRequest } from '../engine/types';
import { motion } from '../engine/motion';
import { STAGE_H, STAGE_W, type Projected, type V3 } from '../engine/geom';

export { STAGE_H, STAGE_W };

/** Contrato de uma cena 3D. Uma instância por tipo, reaproveitada entre slides. */
export interface Scene3D {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Slide entrou: configura parâmetros e anima a chegada (instant = sem animação). */
  activate(params: Record<string, unknown>, step: number, instant: boolean): void;
  setStep(step: number, instant: boolean): void;
  update(t: number, dt: number): void;
  deactivate?(): void;
}

export type SceneFactory = (host: GLHost) => Scene3D;

export interface AccentPalette {
  base: string;
  tint: string;
  deep: string;
}

type FrameHook = (t: number, dt: number) => void;

/**
 * Um único WebGLRenderer para o deck inteiro. Só a cena ativa renderiza.
 * O canvas fica dentro do palco (1920 x 1080 CSS) e o pixel ratio acompanha a escala real,
 * limitado a 1,5 (orçamento de desempenho da direção de arte).
 */
export class GLHost implements GLApi {
  readonly renderer: THREE.WebGLRenderer;
  readonly canvas: HTMLCanvasElement;
  readonly accent: { base: THREE.Color; tint: THREE.Color; deep: THREE.Color };
  readonly envMap: THREE.Texture;
  private factories: Partial<Record<SceneKey, SceneFactory>>;
  private instances = new Map<SceneKey, Scene3D>();
  private active: Scene3D | null = null;
  private activeKey: SceneKey = 'none';
  private hooks = new Set<FrameHook>();
  private last = 0;
  private running = false;
  private elapsed = 0;
  private swapToken = 0;
  fps = 0;

  static create(
    canvas: HTMLCanvasElement,
    accent: AccentPalette,
    factories: Partial<Record<SceneKey, SceneFactory>>,
    opts: { preserve?: boolean } = {},
  ): GLHost | null {
    try {
      const probe = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
      if (!probe) return null;
      return new GLHost(canvas, accent, factories, opts.preserve ?? false);
    } catch (err) {
      console.warn('[deck] WebGL indisponível, usando fundo estático.', err);
      return null;
    }
  }

  private constructor(
    canvas: HTMLCanvasElement,
    accent: AccentPalette,
    factories: Partial<Record<SceneKey, SceneFactory>>,
    preserve: boolean,
  ) {
    this.canvas = canvas;
    this.factories = factories;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: preserve,
    });
    this.renderer.setClearColor(0x050608, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.accent = {
      base: new THREE.Color(accent.base),
      tint: new THREE.Color(accent.tint),
      deep: new THREE.Color(accent.deep),
    };
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.setScale(1);
  }

  /** scale = escala CSS do palco na janela. */
  setScale(scale: number) {
    const ratio = Math.min(1.5, Math.max(0.5, scale * (window.devicePixelRatio || 1)));
    this.renderer.setPixelRatio(ratio);
    this.renderer.setSize(STAGE_W, STAGE_H, false);
  }

  get camera(): THREE.PerspectiveCamera | null {
    return this.active?.camera ?? null;
  }

  get hasCamera() {
    return Boolean(this.active?.camera);
  }

  private tmpV = new THREE.Vector3();

  /** GLApi: projeta um ponto (sem objetos do Three) para px do palco + distância à câmera. */
  projectPoint(p: V3): Projected {
    const cam = this.camera;
    if (!cam) return { x: -9999, y: -9999, dist: 1 };
    const v = this.tmpV.set(p.x, p.y, p.z);
    const d = cam.position.distanceTo(v);
    v.project(cam);
    return { x: (v.x * 0.5 + 0.5) * STAGE_W, y: (1 - (v.y * 0.5 + 0.5)) * STAGE_H, dist: d };
  }

  get sceneKey() {
    return this.activeKey;
  }

  get time() {
    return this.elapsed;
  }

  private instance(key: SceneKey): Scene3D | null {
    if (key === 'none') return null;
    let inst = this.instances.get(key);
    if (!inst) {
      const f = this.factories[key];
      if (!f) return null;
      inst = f(this);
      this.instances.set(key, inst);
    }
    return inst;
  }

  /** Troca de cena com dissolve do canvas; mesma cena = só atualiza parâmetros. */
  setScene(req: SceneRequest | undefined, step: number, instant: boolean) {
    const key = req?.key ?? 'none';
    const params = req?.params ?? {};
    const token = ++this.swapToken;
    if (key === this.activeKey && this.active) {
      this.active.activate(params, step, instant);
      return;
    }
    const next = this.instance(key);
    const swap = () => {
      if (token !== this.swapToken) return;
      this.active?.deactivate?.();
      this.active = next;
      this.activeKey = key;
      next?.activate(params, step, instant);
      this.renderFrame(0);
    };
    gsap.killTweensOf(this.canvas);
    if (instant || motion.reduced) {
      swap();
      gsap.set(this.canvas, { opacity: next ? 1 : 0 });
      return;
    }
    gsap.to(this.canvas, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        swap();
        if (next) gsap.to(this.canvas, { opacity: 1, duration: 0.9, ease: 'power2.out' });
      },
    });
  }

  setStep(step: number, instant: boolean) {
    this.active?.setStep(step, instant);
  }

  onFrame(hook: FrameHook) {
    this.hooks.add(hook);
    return () => this.hooks.delete(hook);
  }

  /** Projeta um ponto do mundo para coordenadas do palco (px). z > 1 = atrás da câmera. */
  project(v: THREE.Vector3, out = new THREE.Vector3()) {
    const cam = this.camera;
    if (!cam) return out.set(-9999, -9999, 2);
    out.copy(v).project(cam);
    out.x = (out.x * 0.5 + 0.5) * STAGE_W;
    out.y = (1 - (out.y * 0.5 + 0.5)) * STAGE_H;
    return out;
  }

  private renderFrame(dt: number) {
    if (!this.active) {
      this.renderer.clear();
      return;
    }
    this.active.update(this.elapsed, dt);
    this.hooks.forEach((h) => h(this.elapsed, dt));
    this.renderer.render(this.active.scene, this.active.camera);
  }

  /** Renderiza um quadro agora (usado na exportação/print). */
  renderNow() {
    this.renderFrame(0);
  }

  /** Avança o relógio sem esperar requestAnimationFrame (exportação). */
  advance(seconds: number) {
    this.elapsed += seconds;
    this.renderFrame(seconds);
  }

  snapshot(type = 'image/jpeg', quality = 0.92) {
    this.renderFrame(0);
    return this.canvas.toDataURL(type, quality);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    let acc = 0;
    let frames = 0;
    const loop = () => {
      if (!this.running) return;
      const now = performance.now();
      const dt = Math.min((now - this.last) / 1000, 0.05);
      this.last = now;
      this.elapsed += dt;
      acc += dt;
      frames++;
      if (acc >= 0.5) {
        this.fps = Math.round(frames / acc);
        acc = 0;
        frames = 0;
      }
      this.renderFrame(dt);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
  }
}
