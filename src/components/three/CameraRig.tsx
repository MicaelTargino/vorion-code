"use client";

import { useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, PerspectiveCamera, Vector3, type Group } from "three";
import { sceneState } from "@/lib/scene-store";
import { SCENE, type SceneUniforms } from "./SceneLighting";

const ease = (t: number) => 1 - Math.pow(1 - MathUtils.clamp(t, 0, 1), 2.2);

/**
 * Dirige a câmera, o planeta e a luz a partir do scroll e do ponteiro.
 * Dois "destinos": o hero (avança em direção ao horizonte) e o CTA final
 * (câmera baixa, planeta nascendo atrás das montanhas).
 */
export function CameraRig({ uniforms, planet }: { uniforms: SceneUniforms; planet: RefObject<Group | null> }) {
  const camera = useThree((s) => s.camera);
  const pointer = useRef({ x: 0, y: 0 });
  const lookAt = useRef(SCENE.lookAt.clone());
  const target = useRef({ cam: new Vector3(), look: new Vector3(), planet: new Vector3(), glow: 1 });
  const baseLight = useRef(uniforms.uLightDir.value.clone());
  const lightOffset = useRef(new Vector3());

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 20);
    const reduced = sceneState.reducedMotion;
    if (!reduced) uniforms.uTime.value += delta;
    uniforms.uReveal.value = sceneState.reveal;

    // ponteiro suavizado (levemente atrasado, sensação física)
    const k = 1 - Math.exp(-delta * 2.2);
    const px = reduced ? 0 : sceneState.pointer.x;
    const py = reduced ? 0 : sceneState.pointer.y;
    pointer.current.x += (px - pointer.current.x) * k;
    pointer.current.y += (py - pointer.current.y) * k;
    const { x: mx, y: my } = pointer.current;

    const t = target.current;
    const c = sceneState.ctaProgress;
    if (c > 0.001) {
      const e = ease(c);
      t.cam.set(mx * 1.2, 1.2 + my * 0.4, 6);
      t.look.set(mx * 2.4, 10 - e * 1.5, -120);
      t.planet.set(0, -78 + e * 66, -420);
      t.glow = 1.15 + e * 0.6;
    } else {
      const h = ease(sceneState.heroProgress);
      // em telas estreitas (retrato) o planeta vem para o centro
      const aspect = camera instanceof PerspectiveCamera ? camera.aspect : 1.6;
      const side = MathUtils.clamp((aspect - 0.6) / 1.1, 0.12, 1);
      t.cam.set(mx * 1.4, 3 - h * 0.9 + my * 0.5, 14 - h * 30);
      t.look.set(mx * 3, 6 + h * 2.5 + my, -120);
      t.planet.set((70 - h * 20) * side, 18 + h * 14, -420);
      t.glow = 1 + h * 0.35;
    }

    const follow = 1 - Math.exp(-delta * 4.5);
    camera.position.lerp(t.cam, follow);
    lookAt.current.lerp(t.look, follow);
    camera.lookAt(lookAt.current);

    uniforms.uPlanetPos.value.lerp(t.planet, follow);
    if (planet.current) planet.current.position.copy(uniforms.uPlanetPos.value);
    uniforms.uGlow.value += (t.glow - uniforms.uGlow.value) * follow;

    // a luz acompanha discretamente o ponteiro
    uniforms.uLightDir.value
      .copy(baseLight.current)
      .add(lightOffset.current.set(mx * 0.12, my * 0.05, 0))
      .normalize();
  });

  return null;
}
