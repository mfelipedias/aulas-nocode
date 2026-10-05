import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { gsap } from 'gsap';
import type { GLHost, Scene3D } from '../gl';
import { Backdrop, Dust, glowTexture } from '../shared';
import { motion } from '../../engine/motion';

/**
 * "Grafo de nós": gatilho -> módulos -> ações. Camadas da esquerda para a direita, nós foscos,
 * ligações em tubo (nunca linha de 1 px) que se desenham na entrada, e pulsos de luz percorrendo
 * as ligações (o dado passando pelo fluxo). Aula 3: workflows, APIs, webhooks, automações.
 *
 * params.side: 'right' (padrão) | 'wide'
 */

// Gerador determinístico: o grafo é sempre o mesmo (gravações consistentes).
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

interface Node {
  pos: THREE.Vector3;
  layer: number;
  lit: boolean;
  size: number;
}

interface Edge {
  a: number;
  b: number;
  curve: THREE.CubicBezierCurve3;
  start: number;
  count: number;
}

const LAYERS = [1, 3, 4, 4, 3, 2];

function buildGraph() {
  const rand = rng(7);
  const nodes: Node[] = [];
  const byLayer: number[][] = [];
  const span = 20;
  LAYERS.forEach((n, li) => {
    const x = -span / 2 + (li / (LAYERS.length - 1)) * span;
    const ids: number[] = [];
    for (let i = 0; i < n; i++) {
      const y = (i - (n - 1) / 2) * 3.1 + (rand() - 0.5) * 0.9;
      const z = (rand() - 0.5) * 4;
      ids.push(nodes.length);
      nodes.push({ pos: new THREE.Vector3(x + (rand() - 0.5) * 1.2, y, z), layer: li, lit: li === 0, size: li === 0 ? 1.35 : 0.8 + rand() * 0.45 });
    }
    byLayer.push(ids);
  });
  // Um caminho principal aceso (o dado que percorre o fluxo).
  let cur = byLayer[0][0];
  const path = new Set([cur]);
  for (let li = 1; li < byLayer.length; li++) {
    const next = byLayer[li][Math.floor(rand() * byLayer[li].length)];
    path.add(next);
    nodes[next].lit = true;
    cur = next;
  }
  const pairs: Array<[number, number]> = [];
  for (let li = 0; li < byLayer.length - 1; li++) {
    const A = byLayer[li];
    const B = byLayer[li + 1];
    B.forEach((b, j) => {
      // cada nó recebe 1 ou 2 entradas da camada anterior
      const a1 = A[Math.min(A.length - 1, Math.floor((j / B.length) * A.length))];
      pairs.push([a1, b]);
      if (A.length > 1 && rand() < 0.45) {
        const a2 = A[Math.floor(rand() * A.length)];
        if (a2 !== a1) pairs.push([a2, b]);
      }
    });
  }
  return { nodes, pairs, path };
}

export function createGraph(host: GLHost): Scene3D {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050608, 0.02);
  const camera = new THREE.PerspectiveCamera(32, 16 / 9, 0.1, 300);
  camera.position.set(0, 0, 34);

  const bg = new Backdrop(host);
  const dust = new Dust(host, 1000);
  scene.add(bg.mesh, dust.points);

  const { nodes, pairs, path } = buildGraph();
  const group = new THREE.Group();
  scene.add(group);

  // Ligações: todos os tubos numa geometria só (1 draw call), desenhados em ordem de camada.
  const edges: Edge[] = [];
  const tubes: THREE.BufferGeometry[] = [];
  const litTubes: THREE.BufferGeometry[] = [];
  let cursor = 0;
  let litCursor = 0;
  const litEdges: Edge[] = [];
  pairs
    .slice()
    .sort((p, q) => nodes[p[0]].layer - nodes[q[0]].layer)
    .forEach(([a, b]) => {
      const A = nodes[a].pos;
      const B = nodes[b].pos;
      const dx = (B.x - A.x) * 0.55;
      const curve = new THREE.CubicBezierCurve3(A.clone(), A.clone().add(new THREE.Vector3(dx, 0, 0)), B.clone().sub(new THREE.Vector3(dx, 0, 0)), B.clone());
      const isLit = path.has(a) && path.has(b);
      const geo = new THREE.TubeGeometry(curve, 48, isLit ? 0.055 : 0.04, 6, false);
      const count = geo.index!.count;
      if (isLit) {
        litTubes.push(geo);
        litEdges.push({ a, b, curve, start: litCursor, count });
        litCursor += count;
      } else {
        tubes.push(geo);
        edges.push({ a, b, curve, start: cursor, count });
        cursor += count;
      }
    });
  const edgeGeo = mergeGeometries(tubes)!;
  const litGeo = mergeGeometries(litTubes)!;
  const edgeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#3d4454'), transparent: true, opacity: 0.85, depthWrite: false });
  const litMat = new THREE.MeshBasicMaterial({ color: host.accent.base.clone(), transparent: true, opacity: 0.9, depthWrite: false });
  const edgeMesh = new THREE.Mesh(edgeGeo, edgeMat);
  const litMesh = new THREE.Mesh(litGeo, litMat);
  group.add(edgeMesh, litMesh);
  const edgeTotal = cursor;
  const litTotal = litCursor;

  // Nós: esferas foscas (instâncias) + aneis nos nós acesos.
  const sphere = new THREE.IcosahedronGeometry(0.42, 3);
  const matNode = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1a2030'),
    metalness: 0.6,
    roughness: 0.42,
    envMap: host.envMap,
    envMapIntensity: 1.0,
  });
  const matLit = new THREE.MeshStandardMaterial({
    color: host.accent.base.clone().multiplyScalar(0.5),
    emissive: host.accent.base.clone(),
    emissiveIntensity: 0.55,
    metalness: 0.2,
    roughness: 0.5,
  });
  const neutralIdx = nodes.map((n, i) => (n.lit ? -1 : i)).filter((i) => i >= 0);
  const litIdx = nodes.map((n, i) => (n.lit ? i : -1)).filter((i) => i >= 0);
  const meshN = new THREE.InstancedMesh(sphere, matNode, neutralIdx.length);
  const meshL = new THREE.InstancedMesh(sphere, matLit, litIdx.length);
  group.add(meshN, meshL);

  const ringGeo = new THREE.TorusGeometry(0.72, 0.035, 8, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: host.accent.tint.clone(), transparent: true, opacity: 0.7, depthWrite: false });
  const rings = litIdx.map((i) => {
    const r = new THREE.Mesh(ringGeo, ringMat);
    r.position.copy(nodes[i].pos);
    r.scale.setScalar(nodes[i].size);
    group.add(r);
    return r;
  });

  const tex = glowTexture();
  const halos = litIdx.map((i) => {
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, color: host.accent.base.clone(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.5 }),
    );
    s.position.copy(nodes[i].pos);
    s.scale.setScalar(3.2 * nodes[i].size);
    group.add(s);
    return s;
  });

  // Pulsos: pontos de luz percorrendo as ligações acesas (e algumas neutras, mais fracos).
  const pulseEdges = [...litEdges, ...edges.filter((_, i) => i % 3 === 0)];
  const PULSES = pulseEdges.length;
  const pulsePos = new Float32Array(PULSES * 3);
  const pulseA = new Float32Array(PULSES);
  const pulseGeo = new THREE.BufferGeometry();
  pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));
  pulseGeo.setAttribute('aAlpha', new THREE.BufferAttribute(pulseA, 1));
  const pulseMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: host.accent.tint.clone() }, uScale: { value: host.renderer.getPixelRatio() } },
    vertexShader: /* glsl */ `
      attribute float aAlpha;
      uniform float uScale;
      varying float vA;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uScale * 900.0 / -mv.z;
        vA = aAlpha;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying float vA;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        a = a * a;
        gl_FragColor = vec4(uColor, a * vA);
        #include <colorspace_fragment>
      }
    `,
  });
  const pulses = new THREE.Points(pulseGeo, pulseMat);
  pulses.frustumCulled = false;
  group.add(pulses);
  const pulseSeed = pulseEdges.map((_, i) => (i * 0.37) % 1);

  // Luzes
  const key = new THREE.DirectionalLight(0xdfe6ff, 2.2);
  key.position.set(-8, 10, 14);
  const rim = new THREE.DirectionalLight(host.accent.base.clone(), 2.6);
  rim.position.set(10, -6, -8);
  scene.add(key, rim, new THREE.HemisphereLight(0x8090b0, 0x050608, 0.4));

  const state = { build: 1 };
  const dummy = new THREE.Object3D();
  let side: 'right' | 'wide' = 'right';

  function place() {
    if (side === 'right') {
      group.position.set(10.8, -0.5, 0);
      group.rotation.set(-0.12, -0.5, 0.02);
      group.scale.setScalar(0.54);
    } else {
      group.position.set(3.5, -0.6, -16);
      group.rotation.set(-0.18, -0.22, 0);
      group.scale.setScalar(1.3);
    }
  }
  place();

  function writeNodes(t: number) {
    const b = state.build;
    const breathe = motion.reduced ? 0 : 1;
    const write = (mesh: THREE.InstancedMesh, idx: number[]) => {
      idx.forEach((ni, k) => {
        const n = nodes[ni];
        const local = Math.min(1, Math.max(0, b * (LAYERS.length + 1) - n.layer));
        const s = n.size * (1 - Math.pow(1 - local, 3)) * (1 + breathe * 0.03 * Math.sin(t * 0.8 + ni));
        dummy.position.copy(n.pos);
        dummy.scale.setScalar(Math.max(0.0001, s));
        dummy.updateMatrix();
        mesh.setMatrixAt(k, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    };
    write(meshN, neutralIdx);
    write(meshL, litIdx);
    const litVis = Math.min(1, Math.max(0, (b - 0.6) / 0.4));
    rings.forEach((r, i) => {
      r.lookAt(camera.position);
      r.rotateZ(t * 0.2 + i);
      (r.material as THREE.MeshBasicMaterial).opacity = 0.7 * litVis;
    });
    halos.forEach((h) => ((h.material as THREE.SpriteMaterial).opacity = 0.45 * litVis));
  }

  return {
    scene,
    camera,
    activate(params, _step, instant) {
      side = (params.side as 'right' | 'wide') ?? 'right';
      place();
      bg.setFocus(side === 'right' ? 0.72 : 0.5, 0.46, instant);
      bg.setIntensity(side === 'right' ? 0.95 : 0.7, instant);
      dust.setOpacity(side === 'right' ? 0.7 : 0.5, instant);
      gsap.killTweensOf(state);
      if (instant || motion.reduced) state.build = 1;
      else {
        state.build = 0;
        gsap.to(state, { build: 1, duration: 2.8, ease: 'power2.out', delay: 0.2 });
      }
    },
    setStep() {},
    update(t) {
      const frozen = motion.reduced;
      bg.update(t, frozen);
      dust.update(t, frozen);
      const b = state.build;
      edgeGeo.setDrawRange(0, Math.floor((edgeTotal * Math.min(1, b * 1.05)) / 3) * 3);
      litGeo.setDrawRange(0, Math.floor((litTotal * Math.min(1, Math.max(0, b * 1.2 - 0.2))) / 3) * 3);
      writeNodes(t);
      const on = b >= 0.999 && !frozen;
      pulseEdges.forEach((e, i) => {
        const lit = i < litEdges.length;
        const u = (t * (lit ? 0.32 : 0.18) + pulseSeed[i]) % 1;
        const p = e.curve.getPointAt(u);
        pulsePos[i * 3] = p.x;
        pulsePos[i * 3 + 1] = p.y;
        pulsePos[i * 3 + 2] = p.z;
        pulseA[i] = on ? Math.sin(u * Math.PI) * (lit ? 1 : 0.4) : 0;
      });
      pulseGeo.attributes.position.needsUpdate = true;
      pulseGeo.attributes.aAlpha.needsUpdate = true;
      if (!frozen) {
        group.rotation.y += Math.sin(t * 0.1) * 0.0004;
        camera.position.x = Math.sin(t * 0.05) * 0.6;
        camera.position.y = Math.cos(t * 0.04) * 0.35;
      }
      camera.lookAt(0, 0, 0);
    },
  };
}
