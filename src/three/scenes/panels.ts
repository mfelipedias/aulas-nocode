import * as THREE from 'three';
import { gsap } from 'gsap';
import type { GLHost, Scene3D } from '../gl';
import { Backdrop, Dust } from '../shared';
import { motion } from '../../engine/motion';

/**
 * "Painéis de vidro": planos escuros com borda luminosa (SDF de retângulo arredondado) e brilho de
 * fresnel, empilhados em profundidade. Dentro de cada painel, um esqueleto de interface desenhado no
 * shader (barra, menu, cartões, um botão aceso) — ou uma captura real, se `params.images` vier.
 *
 * params.side: 'right' (padrão) | 'wide'
 * params.images: string[] (opcional) caminhos de imagens em public/ para dentro dos painéis
 */

interface PanelSpec {
  w: number;
  h: number;
  kind: 0 | 1 | 2; // 0 = web, 1 = celular, 2 = painel de dados
  pos: [number, number, number];
  rot: [number, number, number];
}

const RIGHT: PanelSpec[] = [
  { w: 9.6, h: 6.0, kind: 0, pos: [7.4, 0.6, -9], rot: [0.04, -0.55, 0.0] },
  { w: 7.2, h: 4.6, kind: 2, pos: [9.6, 3.0, -4.5], rot: [0.06, -0.6, 0.01] },
  { w: 2.9, h: 6.0, kind: 1, pos: [12.2, -1.4, -1.0], rot: [0.02, -0.62, 0.0] },
  { w: 6.4, h: 4.0, kind: 0, pos: [8.8, -3.4, -2.6], rot: [0.08, -0.55, -0.01] },
];

// Amplo: fundo para declarações e aberturas. Pesa à direita e fica recuado (texto à esquerda).
const WIDE: PanelSpec[] = [
  { w: 8.6, h: 5.4, kind: 0, pos: [3.5, 3.4, -18], rot: [0.02, -0.28, 0.0] },
  { w: 9.6, h: 6.0, kind: 2, pos: [13.5, 0.8, -13], rot: [0.04, -0.5, 0.0] },
  { w: 2.8, h: 5.8, kind: 1, pos: [7.6, -3.4, -8], rot: [0.06, -0.34, 0.0] },
  { w: 7.2, h: 4.5, kind: 0, pos: [17.5, -5.0, -17], rot: [0.04, -0.55, 0.0] },
];

const VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform vec2 uSize;
  uniform vec3 uAccent;
  uniform vec3 uTint;
  uniform float uOpacity;
  uniform float uDim;
  uniform float uKind;
  uniform float uHasTex;
  uniform sampler2D uTex;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;

  float sdRound(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }
  // retângulo arredondado preenchido em coordenadas do painel (origem no canto superior esquerdo)
  float box(vec2 p, vec2 o, vec2 s, float r) {
    float d = sdRound(p - (o + s * 0.5), s * 0.5, r);
    return 1.0 - smoothstep(0.0, 0.02, d);
  }

  void main() {
    vec2 p = (vUv - 0.5) * uSize;            // centro = 0
    float radius = uKind > 0.5 && uKind < 1.5 ? 0.42 : 0.24;
    float d = sdRound(p, uSize * 0.5, radius);
    if (d > 0.0) discard;

    vec2 q = vec2(vUv.x, 1.0 - vUv.y) * uSize; // origem no canto superior esquerdo
    vec3 col = vec3(0.063, 0.075, 0.102);      // --n-2
    col += vec3(0.02, 0.025, 0.035) * (1.0 - vUv.y);
    float alpha = 0.72;

    // Esqueleto de interface (desenhado em vez de texto falso).
    vec3 c4 = vec3(0.125, 0.145, 0.184);  // --n-4
    vec3 c5 = vec3(0.172, 0.196, 0.251);  // --n-5
    float W = uSize.x;
    float H = uSize.y;
    if (uHasTex > 0.5) {
      float inset = 0.18;
      vec2 tuv = vec2((q.x - inset) / (W - inset * 2.0), 1.0 - (q.y - inset * 2.2) / (H - inset * 3.2));
      if (tuv.x > 0.0 && tuv.x < 1.0 && tuv.y > 0.0 && tuv.y < 1.0) {
        col = texture2D(uTex, tuv).rgb * 0.92;
        alpha = 0.96;
      }
      col = mix(col, c4, box(q, vec2(0.0), vec2(W, 0.42), 0.0) * 0.9);
    } else if (uKind < 0.5) {
      // web: barra, menu lateral, título, linhas, cartões, botão aceso
      col = mix(col, c4, box(q, vec2(0.0), vec2(W, 0.42), 0.0));
      col = mix(col, c5, box(q, vec2(0.18, 0.13), vec2(0.16), 0.08));
      col = mix(col, c5, box(q, vec2(0.42, 0.13), vec2(0.16), 0.08));
      col = mix(col, vec3(0.08, 0.09, 0.12), box(q, vec2(0.0, 0.42), vec2(W * 0.2, H - 0.42), 0.0));
      for (int i = 0; i < 5; i++) col = mix(col, c4, box(q, vec2(0.28, 0.8 + float(i) * 0.42), vec2(W * 0.12, 0.16), 0.08));
      float x0 = W * 0.26;
      col = mix(col, c5, box(q, vec2(x0, 0.8), vec2(W * 0.42, 0.46), 0.1));
      col = mix(col, c4, box(q, vec2(x0, 1.45), vec2(W * 0.56, 0.14), 0.07));
      col = mix(col, c4, box(q, vec2(x0, 1.72), vec2(W * 0.4, 0.14), 0.07));
      for (int i = 0; i < 3; i++) col = mix(col, c4, box(q, vec2(x0 + float(i) * W * 0.245, 2.25), vec2(W * 0.215, H - 2.25 - 0.95), 0.14));
      col = mix(col, uAccent * 0.85, box(q, vec2(x0, H - 0.72), vec2(W * 0.18, 0.4), 0.12));
    } else if (uKind < 1.5) {
      // celular: barra, cartão, lista, botão
      col = mix(col, c5, box(q, vec2(W * 0.36, 0.14), vec2(W * 0.28, 0.1), 0.05));
      col = mix(col, c4, box(q, vec2(0.22, 0.5), vec2(W - 0.44, 1.5), 0.18));
      for (int i = 0; i < 4; i++) {
        float y = 2.25 + float(i) * 0.6;
        col = mix(col, c5, box(q, vec2(0.22, y), vec2(0.4, 0.4), 0.2));
        col = mix(col, c4, box(q, vec2(0.76, y + 0.06), vec2(W - 1.1, 0.12), 0.06));
        col = mix(col, c4, box(q, vec2(0.76, y + 0.24), vec2(W * 0.4, 0.1), 0.05));
      }
      col = mix(col, uAccent * 0.85, box(q, vec2(0.22, H - 0.85), vec2(W - 0.44, 0.48), 0.24));
    } else {
      // painel de dados: barras de gráfico e linhas de tabela
      col = mix(col, c4, box(q, vec2(0.0), vec2(W, 0.42), 0.0));
      for (int i = 0; i < 7; i++) {
        float hgt = 0.5 + 1.4 * fract(sin(float(i) * 12.9898) * 43758.5453);
        vec3 bc = i == 4 ? uAccent * 0.85 : c5;
        col = mix(col, bc, box(q, vec2(0.4 + float(i) * 0.5, 2.6 - hgt), vec2(0.3, hgt), 0.06));
      }
      for (int i = 0; i < 4; i++) col = mix(col, c4, box(q, vec2(W * 0.56, 0.8 + float(i) * 0.46), vec2(W * 0.38, 0.22), 0.08));
      for (int i = 0; i < 3; i++) col = mix(col, c4, box(q, vec2(0.4, 3.0 + float(i) * 0.4), vec2(W - 0.8, 0.18), 0.06));
    }

    // Borda luminosa (~2 px) + fresnel suave.
    float edge = 1.0 - smoothstep(0.0, 0.045, abs(d));
    float fres = pow(1.0 - abs(dot(vN, vV)), 2.0);
    col += uTint * edge * 0.55;
    col += uAccent * fres * 0.12;
    alpha = max(alpha, edge * 0.9);
    gl_FragColor = vec4(col * mix(0.55, 1.0, uDim), alpha * uOpacity * uDim);
    #include <colorspace_fragment>
  }
`;

export function createPanels(host: GLHost): Scene3D {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050608, 0.016);
  const camera = new THREE.PerspectiveCamera(32, 16 / 9, 0.1, 300);
  camera.position.set(0, 0, 26);
  camera.lookAt(0, 0, 0);

  const bg = new Backdrop(host);
  const dust = new Dust(host, 900);
  scene.add(bg.mesh, dust.points);

  const group = new THREE.Group();
  scene.add(group);
  const loader = new THREE.TextureLoader();
  const blank = new THREE.Texture();

  interface Live {
    mesh: THREE.Mesh;
    mat: THREE.ShaderMaterial;
    spec: PanelSpec;
    p: { v: number };
    seed: number;
  }
  let live: Live[] = [];
  let currentLayout = '';
  let imagesKey = '';

  function build(specs: PanelSpec[], images: string[]) {
    live.forEach((l) => {
      group.remove(l.mesh);
      l.mesh.geometry.dispose();
      l.mat.dispose();
    });
    live = specs.map((spec, i) => {
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          uSize: { value: new THREE.Vector2(spec.w, spec.h) },
          uAccent: { value: host.accent.base.clone() },
          uTint: { value: host.accent.tint.clone() },
          uOpacity: { value: 1 },
          uDim: { value: 1 },
          uKind: { value: spec.kind },
          uHasTex: { value: 0 },
          uTex: { value: blank },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
      });
      const src = images[i];
      if (src) {
        loader.load(src, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          mat.uniforms.uTex.value = tex;
          mat.uniforms.uHasTex.value = 1;
        });
      }
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(spec.w, spec.h), mat);
      mesh.renderOrder = Math.round(spec.pos[2] * 10);
      group.add(mesh);
      return { mesh, mat, spec, p: { v: 1 }, seed: i * 1.7 };
    });
  }

  function place(t: number) {
    const breathe = motion.reduced ? 0 : 1;
    for (const l of live) {
      const s = l.spec;
      const a = l.p.v;
      const ease = 1 - Math.pow(1 - a, 3);
      l.mesh.position.set(s.pos[0] + (1 - ease) * 4, s.pos[1] + breathe * Math.sin(t * 0.35 + l.seed) * 0.12 - (1 - ease) * 1.5, s.pos[2] - (1 - ease) * 18);
      l.mesh.rotation.set(s.rot[0], s.rot[1] + (1 - ease) * -0.4 + breathe * Math.sin(t * 0.2 + l.seed) * 0.015, s.rot[2]);
      l.mat.uniforms.uOpacity.value = Math.min(1, a * 1.6);
    }
  }

  return {
    scene,
    camera,
    activate(params, _step, instant) {
      const side = (params.side as string) ?? 'right';
      const images = (params.images as string[] | undefined) ?? [];
      const key = images.join('|');
      if (side !== currentLayout || key !== imagesKey) {
        build(side === 'wide' ? WIDE : RIGHT, images);
        currentLayout = side;
        imagesKey = key;
      }
      // Sem capturas, os painéis são cenário: ficam mais apagados para não competir com o texto.
      const dim = images.length ? 1 : side === 'wide' ? 0.4 : 0.55;
      live.forEach((l) => (l.mat.uniforms.uDim.value = dim));
      bg.setFocus(side === 'wide' ? 0.5 : 0.74, 0.44, instant);
      bg.setIntensity(side === 'wide' ? 0.7 : 0.9, instant);
      dust.setOpacity(0.55, instant);
      live.forEach((l, i) => {
        gsap.killTweensOf(l.p);
        if (instant || motion.reduced) l.p.v = 1;
        else {
          l.p.v = 0;
          gsap.to(l.p, { v: 1, duration: 2.4, ease: 'expo.out', delay: 0.15 + i * 0.16 });
        }
      });
    },
    setStep() {},
    update(t) {
      const frozen = motion.reduced;
      bg.update(t, frozen);
      dust.update(t, frozen);
      place(frozen ? 0 : t);
      if (!frozen) {
        camera.position.x = Math.sin(t * 0.05) * 0.5;
        camera.position.y = Math.cos(t * 0.04) * 0.3;
        camera.lookAt(0, 0, 0);
      }
    },
  };
}
