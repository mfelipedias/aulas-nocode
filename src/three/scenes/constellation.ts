import * as THREE from 'three';
import { gsap } from 'gsap';
import type { GLHost, Scene3D } from '../gl';
import { Backdrop, Dust } from '../shared';
import { motion } from '../../engine/motion';
import { CAM, CORE as CORE_V, GROUPS as GROUPS_V } from './constellation-layout';
import type { V3 } from '../../engine/geom';

const tv = (p: V3) => new THREE.Vector3(p.x, p.y, p.z);
const CORE = tv(CORE_V);
const GROUPS = GROUPS_V.map((g) => ({ ...g, anchor: tv(g.anchor) }));

/**
 * Constelação do ecossistema: núcleo luminoso, anéis próprios, uma órbita irregular passando pelos
 * aglomerados de categorias e ligações núcleo -> categoria com pulsos de luz.
 * Os logos são DOM (nítidos no Meet), posicionados pelo arquétipo via projeção desta câmera.
 *
 * Passos: 0 = núcleo + órbita; 1..N = liga a categoria N; N+1 = destaque (núcleo intensifica).
 */
export function createConstellation(host: GLHost): Scene3D {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050608, 0.012);
  const camera = new THREE.PerspectiveCamera(CAM.fov, 16 / 9, 0.1, 300);
  camera.position.set(CAM.position.x, CAM.position.y, CAM.position.z);
  const lookTarget = tv(CAM.target);
  const camOffset = new THREE.Vector3();

  const bg = new Backdrop(host);
  const dust = new Dust(host, 1600);
  scene.add(bg.mesh, dust.points);

  // Núcleo: esfera com fresnel na cor da aula.
  const coreMat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uColor: { value: host.accent.base.clone() },
      uTint: { value: host.accent.tint.clone() },
      uPower: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform vec3 uTint;
      uniform float uPower;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.2);
        vec3 col = mix(uColor * 0.10, uTint, f) * uPower;
        gl_FragColor = vec4(col, 0.35 + f * 0.65);
        #include <colorspace_fragment>
      }
    `,
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.0, 5), coreMat);
  core.position.copy(CORE);
  scene.add(core);

  const haloTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d')!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255,255,255,0.9)');
    grd.addColorStop(0.3, 'rgba(255,255,255,0.22)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: haloTex,
      color: host.accent.base.clone(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity: 0.55,
    }),
  );
  halo.scale.set(9, 9, 1);
  halo.position.copy(CORE);
  scene.add(halo);

  // Anéis do núcleo (tubos de ~2 px na tela, nunca linha de 1 px).
  const ringMat = new THREE.MeshBasicMaterial({
    color: host.accent.tint.clone(),
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const rings = [1.7, 2.2, 2.75].map((r, i) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.024, 8, 160), ringMat);
    m.position.copy(CORE);
    m.rotation.set(1.2 + i * 0.25, i * 0.6, i * 0.4);
    scene.add(m);
    return m;
  });

  // Órbita irregular que passa por todas as categorias.
  const orbitPts = [...GROUPS].map((g) => g.anchor.clone().lerp(CORE, 0.22).add(new THREE.Vector3(0, 0, -1.5)));
  const orbitCurve = new THREE.CatmullRomCurve3(orbitPts, true, 'centripetal', 0.5);
  const orbitMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#3d4454'),
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  });
  const orbitGeo = new THREE.TubeGeometry(orbitCurve, 400, 0.028, 6, true);
  const orbit = new THREE.Mesh(orbitGeo, orbitMat);
  scene.add(orbit);
  const orbitCount = orbitGeo.index!.count;

  // Ligações núcleo -> categoria.
  const linkMat = () =>
    new THREE.MeshBasicMaterial({
      color: host.accent.base.clone(),
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
  const links = GROUPS.map((g) => {
    // Termina na borda do aglomerado voltada para o núcleo (não atravessa os ladrilhos).
    const toCore = CORE.clone().sub(g.anchor).setZ(0).normalize();
    const end = g.anchor.clone().addScaledVector(toCore, 3.4).add(new THREE.Vector3(0, 0, -0.8));
    const mid = CORE.clone().lerp(end, 0.5).add(new THREE.Vector3(0, 0.8, 1.2));
    const curve = new THREE.QuadraticBezierCurve3(CORE.clone(), mid, end);
    const geo = new THREE.TubeGeometry(curve, 80, 0.03, 6, false);
    const mesh = new THREE.Mesh(geo, linkMat());
    const count = geo.index!.count;
    geo.setDrawRange(0, 0);
    scene.add(mesh);
    const pulses = Array.from({ length: 2 }, () => {
      const s = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: haloTex,
          color: host.accent.tint.clone(),
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
          opacity: 0,
        }),
      );
      s.scale.set(0.9, 0.9, 1);
      scene.add(s);
      return s;
    });
    return { mesh, geo, count, curve, pulses, state: { p: 0 } };
  });

  const orbitState = { p: 0 };
  let step = 0;
  /** Ordem de revelação das âncoras (índices de GROUPS); vem do arquétipo em params.order. */
  let order = GROUPS.map((_, i) => i);
  let N = GROUPS.length;

  function applyStep(s: number, instant: boolean) {
    step = s;
    links.forEach((l, i) => {
      const pos = order.indexOf(i);
      const target = pos >= 0 && s >= pos + 1 ? 1 : 0;
      gsap.killTweensOf(l.state);
      if (instant || motion.reduced) l.state.p = target;
      else gsap.to(l.state, { p: target, duration: target ? 1.1 : 0.4, ease: target ? 'power3.out' : 'power2.in' });
    });
    // Câmera: aproxima levemente da categoria recém-revelada; volta ao centro no destaque.
    const focusIdx = s >= 1 && s <= N ? order[s - 1] : -1;
    const off = focusIdx >= 0 ? GROUPS[focusIdx].anchor.clone().sub(CORE).multiplyScalar(0.06) : new THREE.Vector3();
    gsap.killTweensOf(camOffset);
    if (instant || motion.reduced) camOffset.copy(off);
    else gsap.to(camOffset, { x: off.x, y: off.y, z: off.z, duration: 2.2, ease: 'power2.inOut' });
    const power = s > N ? 1.35 : 1;
    gsap.to(coreMat.uniforms.uPower, { value: power, duration: instant ? 0 : 1.2 });
  }

  return {
    scene,
    camera,
    activate(params, s, instant) {
      const o = params.order as number[] | undefined;
      order = Array.isArray(o) && o.length ? o : GROUPS.map((_, i) => i);
      N = order.length;
      bg.setFocus(0.5, 0.5, instant);
      bg.setIntensity((params.intensity as number) ?? 0.85, instant);
      gsap.killTweensOf(orbitState);
      if (instant || motion.reduced) orbitState.p = 1;
      else {
        orbitState.p = 0;
        gsap.to(orbitState, { p: 1, duration: 2.6, ease: 'power2.inOut', delay: 0.3 });
      }
      applyStep(s, instant);
    },
    setStep(s, instant) {
      applyStep(s, instant);
    },
    update(t) {
      const frozen = motion.reduced;
      const tt = frozen ? 0 : t;
      bg.update(t, frozen);
      dust.update(t, frozen);
      core.rotation.y = tt * 0.1;
      rings.forEach((r, i) => {
        r.rotation.z = tt * (0.05 + i * 0.02) + i;
      });
      halo.material.opacity = 0.45 + (frozen ? 0 : Math.sin(t * 0.8) * 0.05);
      orbitGeo.setDrawRange(0, Math.floor((orbitCount * orbitState.p) / 3) * 3);
      links.forEach((l) => {
        l.geo.setDrawRange(0, Math.floor((l.count * l.state.p) / 3) * 3);
        l.pulses.forEach((s, k) => {
          const on = l.state.p >= 0.999 && !frozen;
          const u = (t * 0.22 + k * 0.5) % 1;
          s.position.copy(l.curve.getPointAt(u));
          s.material.opacity = on ? Math.sin(u * Math.PI) * 0.9 : 0;
        });
      });
      const drift = frozen ? 0 : 1;
      camera.position.set(
        CAM.position.x + camOffset.x + Math.sin(t * 0.05) * 0.35 * drift,
        CAM.position.y + camOffset.y + Math.cos(t * 0.04) * 0.2 * drift,
        CAM.position.z + camOffset.z,
      );
      lookTarget.set(CAM.target.x, CAM.target.y, CAM.target.z).add(camOffset);
      camera.lookAt(lookTarget);
      camera.updateMatrixWorld();
    },
    deactivate() {
      void step;
    },
  };
}
