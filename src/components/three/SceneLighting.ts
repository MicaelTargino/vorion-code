import { Vector3 } from "three";

/**
 * Uniforms compartilhados por todos os materiais da cena. Como os objetos
 * `{ value }` são os mesmos, atualizar um valor aqui atualiza todos os shaders.
 */
export function createSceneUniforms() {
  return {
    uTime: { value: 0 },
    uReveal: { value: 0 },
    /** direção da luz (estrela atrás do planeta), em espaço de mundo */
    uLightDir: { value: new Vector3(-0.5, 0.55, 0.3).normalize() },
    /** intensidade extra do brilho atmosférico (sobe no CTA final) */
    uGlow: { value: 1 },
    uPlanetPos: { value: new Vector3(70, 18, -420) },
    uPlanetRadius: { value: 84 },
  };
}

export type SceneUniforms = ReturnType<typeof createSceneUniforms>;

export const SCENE = {
  fov: 40,
  camera: new Vector3(0, 3, 14),
  lookAt: new Vector3(0, 6, -120),
  planet: new Vector3(70, 18, -420),
  planetRadius: 84,
};
