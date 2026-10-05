import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { GLHost, Scene3D } from '../gl';
import { Backdrop, Dust } from '../shared';
import { motion } from '../../engine/motion';

/**
 * "Blocos que montam": centenas de blocos escuros se organizam numa interface de landing page
 * (barra da janela, menu lateral, título, campos Nome/E-mail/Telefone, botão aceso, área de imagem).
 * Metáfora visual da disciplina: construir sem código = montar blocos.
 *
 * params.side: 'right' (padrão) | 'center'
 * params.state: 'assembled' (padrão) | 'scattered' (para encerramento)
 */

const CELL = 0.5;
const GAP = 0.06;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  depth: number;
  lit?: boolean;
  relief?: number;
  /** Tamanho do bloco (0,5 padrão; 1 = bloco grande, dá hierarquia). */
  cell?: number;
}

// Interface de 18 x 12 unidades, origem no canto inferior esquerdo (recentrada depois).
const LAYOUT: Rect[] = [
  { x: 0, y: 11, w: 18, h: 0.5, depth: 0.3 }, // barra da janela
  { x: 0, y: 0, w: 3, h: 10, depth: 0.3, cell: 1 }, // menu lateral
  { x: 4, y: 8, w: 9, h: 2, depth: 0.95, cell: 1 }, // título
  { x: 4, y: 7, w: 7, h: 0.5, depth: 0.45 }, // texto de apoio
  { x: 4, y: 6.25, w: 5, h: 0.5, depth: 0.45 },
  { x: 4, y: 4.75, w: 6, h: 0.5, depth: 0.3 }, // campo Nome
  { x: 4, y: 3.75, w: 6, h: 0.5, depth: 0.3 }, // campo E-mail
  { x: 4, y: 2.75, w: 6, h: 0.5, depth: 0.3 }, // campo Telefone
  { x: 4, y: 1, w: 4, h: 1, depth: 1.1, lit: true }, // botão "Quero minha vaga"
  { x: 12, y: 1, w: 6, h: 6, depth: 0.4, relief: 0.7, cell: 1 }, // imagem
  { x: 14, y: 8, w: 4, h: 2, depth: 0.55, cell: 1 }, // cartão superior
];

interface Block {
  target: THREE.Vector3;
  depth: number;
  start: THREE.Vector3;
  startRot: THREE.Quaternion;
  delay: number;
  phase: number;
  lit: boolean;
  index: number;
  size: number;
}

function buildBlocks(): Block[] {
  const blocks: Block[] = [];
  let litIdx = 0;
  let idx = 0;
  for (const r of LAYOUT) {
    const cell = r.cell ?? CELL;
    const nx = Math.round(r.w / cell);
    const ny = Math.round(r.h / cell);
    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < ny; j++) {
        const x = r.x + i * cell + cell / 2 - 9;
        const y = r.y + j * cell + cell / 2 - 6;
        let depth = r.depth;
        if (r.relief) {
          const u = i / nx;
          const v = j / ny;
          // relevo suave sugerindo uma imagem (montanhas/sol), sem ruído aleatório
          depth += r.relief * (0.5 * Math.max(0, Math.sin(u * Math.PI * 1.6 + 0.4) * (1 - v)) + 0.35 * Math.exp(-((u - 0.72) ** 2 + (v - 0.7) ** 2) * 30));
        }
        const dir = new THREE.Vector3().randomDirection();
        const start = new THREE.Vector3(x * 1.6, y * 1.6, 0).addScaledVector(dir, 10 + Math.random() * 10);
        start.z -= 8 + Math.random() * 20;
        blocks.push({
          target: new THREE.Vector3(x, y, 0),
          depth,
          start,
          startRot: new THREE.Quaternion().setFromEuler(
            new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
          ),
          delay: ((x + 9) / 18) * 1.1 + (1 - (y + 6) / 12) * 0.35 + Math.random() * 0.45,
          phase: x * 0.32 + y * 0.18,
          lit: Boolean(r.lit),
          index: r.lit ? litIdx++ : idx++,
          size: cell / CELL,
        });
      }
    }
  }
  return blocks;
}

function glowTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.25, 'rgba(255,255,255,0.35)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));

export function createHero(host: GLHost): Scene3D {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050608, 0.018);
  const camera = new THREE.PerspectiveCamera(30, 16 / 9, 0.1, 300);
  camera.position.set(0, 0, 34);
  camera.lookAt(0, 0, 0);

  const bg = new Backdrop(host);
  const dust = new Dust(host, 1200);
  scene.add(bg.mesh, dust.points);

  const blocks = buildBlocks();
  const neutral = blocks.filter((b) => !b.lit);
  const litBlocks = blocks.filter((b) => b.lit);

  const geo = new RoundedBoxGeometry(CELL - GAP, CELL - GAP, 1, 2, 0.07);
  const matNeutral = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1a2030'),
    metalness: 0.7,
    roughness: 0.3,
    envMap: host.envMap,
    envMapIntensity: 1.1,
  });
  const matLit = new THREE.MeshStandardMaterial({
    color: host.accent.base.clone().multiplyScalar(0.6),
    emissive: host.accent.base.clone(),
    emissiveIntensity: 0.42,
    metalness: 0.1,
    roughness: 0.55,
    envMap: host.envMap,
    envMapIntensity: 0.15,
  });
  const meshN = new THREE.InstancedMesh(geo, matNeutral, neutral.length);
  const meshL = new THREE.InstancedMesh(geo, matLit, litBlocks.length);
  meshN.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  meshL.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  // Variação sutil de cor por instância (alguns blocos levemente mais claros = hierarquia).
  const tmpColor = new THREE.Color();
  neutral.forEach((b, i) => {
    const lift = b.depth > 0.9 ? 0.18 : b.depth > 0.55 ? 0.08 : 0;
    tmpColor.set('#ffffff').multiplyScalar(1 + lift);
    meshN.setColorAt(i, tmpColor);
  });

  // Blocos soltos orbitando: "ainda há peças para montar".
  const LOOSE = 46;
  const loose = new THREE.InstancedMesh(geo, matNeutral, LOOSE);
  const looseData = Array.from({ length: LOOSE }, () => ({
    r: 10 + Math.random() * 5,
    a: Math.random() * Math.PI * 2,
    y: (Math.random() - 0.5) * 13,
    z: -2 - Math.random() * 6,
    speed: 0.02 + Math.random() * 0.03,
    rot: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
    s: 0.6 + Math.random() * 0.7,
  }));

  const group = new THREE.Group();
  group.add(meshN, meshL);
  const pivot = new THREE.Group();
  pivot.add(group, loose);
  scene.add(pivot);

  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture(),
      color: host.accent.base.clone(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.55,
    }),
  );
  halo.scale.set(9, 9, 1);
  halo.position.set(-3, -4, 1.2);
  group.add(halo);

  // Luzes: chave fria, contorno na cor da aula, ponto aceso no botão.
  const key = new THREE.DirectionalLight(0xdfe6ff, 2.4);
  key.position.set(-8, 10, 14);
  const rim = new THREE.DirectionalLight(host.accent.base.clone(), 3.2);
  rim.position.set(12, -6, -6);
  const fill = new THREE.HemisphereLight(0x8090b0, 0x050608, 0.35);
  const buttonLight = new THREE.PointLight(host.accent.base.clone(), 26, 9, 2);
  buttonLight.position.set(-3, -4, 1.6);
  group.add(buttonLight);
  const top = new THREE.DirectionalLight(host.accent.tint.clone(), 0.9);
  top.position.set(6, 14, 6);
  scene.add(key, rim, fill, top);

  let assembleStart = -1;
  let scatterStart = -1;
  let assembled = true;
  let scattered = false;
  let side: 'right' | 'center' = 'right';
  const dummy = new THREE.Object3D();
  const qIdent = new THREE.Quaternion();
  const tmpV = new THREE.Vector3();

  function placePivot() {
    if (side === 'right') {
      pivot.position.set(7.9, -0.1, 0);
      pivot.rotation.set(-0.36, -0.74, -0.05);
      pivot.scale.setScalar(0.74);
    } else {
      pivot.position.set(0, -0.6, -2);
      pivot.rotation.set(-0.5, -0.25, -0.04);
      pivot.scale.setScalar(0.8);
    }
  }
  placePivot();

  function writeBlocks(t: number) {
    const animT = assembleStart < 0 ? Infinity : t - assembleStart;
    let done = true;
    const breathe = motion.reduced ? 0 : 1;
    for (const b of blocks) {
      let p = scattered ? 0 : 1;
      if (scattered && scatterStart >= 0) {
        // Encerramento: a interface se desmonta devagar, bloco a bloco.
        const local = Math.min(1, Math.max(0, (t - scatterStart - b.delay * 0.9) / 3.4));
        p = 1 - local * local * (3 - 2 * local);
      }
      if (!scattered && animT !== Infinity) {
        const local = (animT - b.delay) / 1.7;
        p = easeOutExpo(Math.min(1, Math.max(0, local)));
        if (local < 1) done = false;
      }
      const wave = breathe * p * 0.08 * Math.sin(t * 0.9 - b.phase);
      const depth = b.depth * (1 + wave) + (b.lit ? Math.sin(t * 1.2) * 0.05 * breathe : 0);
      tmpV.lerpVectors(b.start, b.target, p);
      // arco: blocos chegam pela frente
      tmpV.z += Math.sin(p * Math.PI) * 3.0 + depth / 2;
      // disperso: as peças recuam para a névoa (encerramento fica legível)
      if (scattered) tmpV.z -= (1 - p) * 16;
      dummy.position.copy(tmpV);
      dummy.quaternion.slerpQuaternions(b.startRot, qIdent, p);
      dummy.scale.set(b.size, b.size, depth);
      dummy.updateMatrix();
      (b.lit ? meshL : meshN).setMatrixAt(b.index, dummy.matrix);
    }
    meshN.instanceMatrix.needsUpdate = true;
    meshL.instanceMatrix.needsUpdate = true;
    if (done && assembleStart >= 0) {
      assembleStart = -1;
      assembled = true;
    }
    const litP = scattered ? (scatterStart >= 0 ? Math.max(0, 1 - (t - scatterStart) / 1.5) : 0) : assembled ? 1 : Math.min(1, Math.max(0, (animT - 1.2) / 1.2));
    (halo.material as THREE.SpriteMaterial).opacity = 0.5 * litP;
    buttonLight.intensity = 26 * litP;
  }

  function writeLoose(t: number) {
    const tt = motion.reduced ? 0 : t;
    looseData.forEach((d, i) => {
      const a = d.a + tt * d.speed;
      dummy.position.set(Math.cos(a) * d.r, d.y + Math.sin(tt * 0.2 + i) * 0.3, Math.sin(a) * d.r * 0.4 + d.z);
      dummy.rotation.set(d.rot.x + tt * 0.1, d.rot.y + tt * 0.07, d.rot.z);
      dummy.scale.set(d.s, d.s, d.s * 0.8);
      dummy.updateMatrix();
      loose.setMatrixAt(i, dummy.matrix);
    });
    loose.instanceMatrix.needsUpdate = true;
  }

  return {
    scene,
    camera,
    activate(params, _step, instant) {
      side = (params.side as 'right' | 'center') ?? 'right';
      scattered = params.state === 'scattered';
      placePivot();
      bg.setFocus(side === 'right' ? 0.72 : 0.5, 0.45, instant);
      bg.setIntensity(1, instant);
      scatterStart = scattered && !instant && !motion.reduced ? host.time + 0.6 : -1;
      if (instant || motion.reduced || scattered) {
        assembleStart = -1;
        assembled = true;
      } else {
        assembled = false;
        assembleStart = host.time + 0.15;
      }
    },
    setStep() {},
    update(t) {
      const frozen = motion.reduced;
      bg.update(t, frozen);
      dust.update(t, frozen);
      writeBlocks(t);
      writeLoose(t);
      if (!frozen) {
        group.rotation.y = Math.sin(t * 0.11) * 0.05;
        group.rotation.x = Math.sin(t * 0.08) * 0.025;
        camera.position.x = Math.sin(t * 0.05) * 0.6;
        camera.position.y = Math.cos(t * 0.04) * 0.3;
        camera.lookAt(0, 0, 0);
      }
    },
  };
}
