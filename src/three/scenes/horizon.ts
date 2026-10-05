import * as THREE from 'three';
import { gsap } from 'gsap';
import type { GLHost, Scene3D } from '../gl';
import { Backdrop, Dust, glowTexture } from '../shared';
import { motion } from '../../engine/motion';

/**
 * "Horizonte": piso de pontos que some na névoa até uma linha de luz na cor da aula.
 * Fundo calmo e amplo para aberturas de capítulo; com params.dolly a câmera avança na entrada
 * ("entrando no próximo bloco da aula").
 *
 * params.dolly: boolean (padrão false)
 */
export function createHorizon(host: GLHost): Scene3D {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 300);
  const REST = new THREE.Vector3(0, 1.4, 12);
  camera.position.copy(REST);

  const bg = new Backdrop(host);
  const dust = new Dust(host, 700);
  scene.add(bg.mesh, dust.points);

  // Piso: grade de 64 x 56 pontos (3.584, dentro do orçamento de 4.000).
  const COLS = 64;
  const ROWS = 56;
  const pos = new Float32Array(COLS * ROWS * 3);
  let k = 0;
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      pos[k++] = (i - (COLS - 1) / 2) * 1.25;
      pos[k++] = -2.2;
      pos[k++] = 8 - j * 1.6;
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uScale: { value: host.renderer.getPixelRatio() },
      uNeutral: { value: new THREE.Color('#838ca1') },
      uAccent: { value: host.accent.tint.clone() },
      uReveal: { value: 1 },
    },
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uScale;
      uniform float uReveal;
      varying float vA;
      varying float vLane;
      void main() {
        vec3 p = position;
        p.y += sin(p.x * 0.18 + uTime * 0.25) * cos(p.z * 0.12 + uTime * 0.2) * 0.18;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float depth = -mv.z;
        gl_PointSize = uScale * clamp(70.0 / depth, 1.6, 6.0);
        float far = smoothstep(80.0, 20.0, depth);
        float near = smoothstep(1.0, 6.0, depth);
        // revelação: do primeiro plano para o horizonte
        float rv = smoothstep(uReveal * 95.0 - 10.0, uReveal * 95.0, depth);
        vA = far * near * (1.0 - rv);
        vLane = exp(-abs(p.x) * 0.22);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uNeutral;
      uniform vec3 uAccent;
      varying float vA;
      varying float vLane;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.15, d);
        vec3 col = mix(uNeutral, uAccent, vLane * 0.7);
        gl_FragColor = vec4(col, a * vA * 0.55);
        #include <colorspace_fragment>
      }
    `,
  });
  const floor = new THREE.Points(geo, mat);
  floor.frustumCulled = false;
  scene.add(floor);

  // Linha de luz do horizonte.
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTexture(), color: host.accent.base.clone(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.5 }),
  );
  glow.scale.set(140, 10, 1);
  glow.position.set(0, 1.2, -82);
  scene.add(glow);

  const cam = { z: REST.z, reveal: 1 };
  const look = new THREE.Vector3(0, 0.6, -40);

  return {
    scene,
    camera,
    activate(params, _step, instant) {
      bg.setFocus(0.5, 0.36, instant);
      bg.setIntensity(0.9, instant);
      dust.setOpacity(0.5, instant);
      gsap.killTweensOf(cam);
      const dolly = Boolean(params.dolly);
      if (instant || motion.reduced) {
        cam.z = REST.z;
        cam.reveal = 1;
      } else {
        cam.z = dolly ? REST.z + 16 : REST.z;
        cam.reveal = dolly ? 0.15 : 1;
        gsap.to(cam, { z: REST.z, reveal: 1, duration: dolly ? 2.6 : 0.01, ease: 'power2.out' });
      }
    },
    setStep() {},
    update(t) {
      const frozen = motion.reduced;
      bg.update(t, frozen);
      dust.update(t, frozen);
      mat.uniforms.uTime.value = frozen ? 0 : t;
      mat.uniforms.uReveal.value = cam.reveal;
      const drift = frozen ? 0 : 1;
      camera.position.set(Math.sin(t * 0.05) * 0.5 * drift, REST.y + Math.cos(t * 0.04) * 0.15 * drift, cam.z);
      camera.lookAt(look);
      glow.material.opacity = 0.42 + (frozen ? 0 : Math.sin(t * 0.3) * 0.04);
    },
  };
}
