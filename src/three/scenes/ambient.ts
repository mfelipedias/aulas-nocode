import * as THREE from 'three';
import type { GLHost, Scene3D } from '../gl';
import { Backdrop, Dust } from '../shared';
import { motion } from '../../engine/motion';

/**
 * Cena ambiente: fundo padrão dos slides sem 3D próprio.
 * params.focus: [x, y] em 0..1 (onde a nebulosa se concentra); params.intensity: 0..1.
 */
export function createAmbient(host: GLHost): Scene3D {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 200);
  camera.position.set(0, 0, 14);
  const bg = new Backdrop(host);
  const dust = new Dust(host, 1400);
  scene.add(bg.mesh, dust.points);

  return {
    scene,
    camera,
    activate(params, _step, instant) {
      const focus = (params.focus as [number, number]) ?? [0.72, 0.42];
      bg.setFocus(focus[0], focus[1], instant);
      bg.setIntensity((params.intensity as number) ?? 1, instant);
      dust.setOpacity((params.dust as number) ?? 0.9, instant);
    },
    setStep() {},
    update(t) {
      const frozen = motion.reduced;
      bg.update(t, frozen);
      dust.update(t, frozen);
      if (!frozen) {
        camera.position.x = Math.sin(t * 0.03) * 0.8;
        camera.position.y = Math.cos(t * 0.025) * 0.4;
        camera.lookAt(0, 0, -20);
      }
    },
  };
}
