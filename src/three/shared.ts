import * as THREE from 'three';
import { gsap } from 'gsap';
import type { GLHost } from './gl';

const NOISE = /* glsl */ `
  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash12(i);
    float b = hash12(i + vec2(1.0, 0.0));
    float c = hash12(i + vec2(0.0, 1.0));
    float d = hash12(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * vnoise(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }
`;

/**
 * Fundo em tela cheia desenhado em shader: base quase preta, nebulosa suave na cor da aula,
 * vinheta e dithering de 1/255 (evita faixas e blocos na compressão do Meet).
 */
export class Backdrop {
  readonly mesh: THREE.Mesh;
  readonly uniforms: {
    uTime: { value: number };
    uFocus: { value: THREE.Vector2 };
    uIntensity: { value: number };
    uBase: { value: THREE.Color };
    uAccent: { value: THREE.Color };
    uDeep: { value: THREE.Color };
  };

  constructor(host: GLHost) {
    this.uniforms = {
      uTime: { value: 0 },
      uFocus: { value: new THREE.Vector2(0.7, 0.45) },
      uIntensity: { value: 1 },
      uBase: { value: new THREE.Color('#050608') },
      uAccent: { value: host.accent.base.clone() },
      uDeep: { value: host.accent.deep.clone() },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.9999, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec2 uFocus;
        uniform float uIntensity;
        uniform vec3 uBase;
        uniform vec3 uAccent;
        uniform vec3 uDeep;
        varying vec2 vUv;
        ${NOISE}
        void main() {
          vec2 aspect = vec2(16.0 / 9.0, 1.0);
          vec2 p = (vUv - 0.5) * aspect;
          vec2 f = (uFocus - 0.5) * aspect;
          float n = fbm(p * 1.4 + vec2(uTime * 0.012, -uTime * 0.008));
          float d = length((p - f) * vec2(0.85, 1.0));
          float glow = exp(-d * d * 4.2) * (0.6 + 0.55 * n);
          float d2 = length(p - f - vec2(0.42, -0.3));
          float glow2 = exp(-d2 * d2 * 6.0) * (0.5 + 0.5 * n);
          vec3 col = uBase;
          col = mix(col, uDeep, clamp(glow * 0.5, 0.0, 1.0) * uIntensity);
          col += uAccent * (glow * 0.03 + glow2 * 0.02) * uIntensity;
          float v = smoothstep(0.35, 1.25, length(p * vec2(0.78, 1.0)));
          col *= 1.0 - 0.55 * v;
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
          gl_FragColor.rgb += (hash12(gl_FragCoord.xy + fract(uTime * 7.0) * 61.0) - 0.5) / 255.0;
        }
      `,
    });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = -10;
  }

  setFocus(x: number, y: number, instant: boolean) {
    const f = this.uniforms.uFocus.value;
    gsap.killTweensOf(f);
    if (instant) f.set(x, y);
    else gsap.to(f, { x, y, duration: 2.2, ease: 'power2.inOut' });
  }

  setIntensity(v: number, instant: boolean) {
    const u = this.uniforms.uIntensity;
    gsap.killTweensOf(u);
    if (instant) u.value = v;
    else gsap.to(u, { value: v, duration: 1.6, ease: 'power2.inOut' });
  }

  update(t: number, frozen: boolean) {
    this.uniforms.uTime.value = frozen ? 40 : t;
  }
}

/** Poeira em profundidade: pontos suaves, aditivos, com leve deriva. */
export class Dust {
  readonly points: THREE.Points;
  private mat: THREE.ShaderMaterial;

  constructor(host: GLHost, count = 1600, spread = new THREE.Vector3(60, 34, 50)) {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const size = new Float32Array(count);
    const tint = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread.x;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread.y;
      pos[i * 3 + 2] = -Math.random() * spread.z + 6;
      seed[i] = Math.random() * 100;
      size[i] = Math.pow(Math.random(), 3) * 2.2 + 0.6;
      tint[i] = Math.random() < 0.28 ? 1 : 0;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aTint', new THREE.BufferAttribute(tint, 1));
    this.mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.9 },
        uScale: { value: host.renderer.getPixelRatio() },
        uAccent: { value: host.accent.tint.clone() },
        uNeutral: { value: new THREE.Color('#aab2c4') },
      },
      vertexShader: /* glsl */ `
        attribute float aSeed;
        attribute float aSize;
        attribute float aTint;
        uniform float uTime;
        uniform float uScale;
        varying float vAlpha;
        varying float vTint;
        void main() {
          vec3 p = position;
          p.x += sin(uTime * 0.07 + aSeed) * 0.6;
          p.y += cos(uTime * 0.05 + aSeed * 1.3) * 0.5;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          float depth = -mv.z;
          gl_PointSize = aSize * uScale * (48.0 / depth);
          vAlpha = smoothstep(70.0, 18.0, depth) * smoothstep(2.0, 8.0, depth);
          vAlpha *= 0.55 + 0.45 * sin(uTime * 0.4 + aSeed * 3.0);
          vTint = aTint;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uAccent;
        uniform vec3 uNeutral;
        uniform float uOpacity;
        varying float vAlpha;
        varying float vTint;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float a = smoothstep(0.5, 0.0, length(c));
          vec3 col = mix(uNeutral, uAccent, vTint);
          gl_FragColor = vec4(col, a * vAlpha * uOpacity * 0.55);
          #include <colorspace_fragment>
        }
      `,
    });
    this.points = new THREE.Points(geo, this.mat);
    this.points.frustumCulled = false;
  }

  update(t: number, frozen: boolean) {
    this.mat.uniforms.uTime.value = frozen ? 12 : t;
  }

  setOpacity(v: number, instant: boolean) {
    const u = this.mat.uniforms.uOpacity;
    gsap.killTweensOf(u);
    if (instant) u.value = v;
    else gsap.to(u, { value: v, duration: 1.2 });
  }
}

/** Textura radial suave (halo/brilho) gerada em canvas; compartilhada entre cenas. */
let glowTex: THREE.Texture | null = null;
export function glowTexture(): THREE.Texture {
  if (glowTex) return glowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.25, 'rgba(255,255,255,0.35)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  glowTex = new THREE.CanvasTexture(c);
  glowTex.colorSpace = THREE.SRGBColorSpace;
  return glowTex;
}
