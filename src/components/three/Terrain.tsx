"use client";

import { useEffect, useMemo } from "react";
import { AdditiveBlending, Color, ShaderMaterial } from "three";
import { noiseGLSL, withOctaves } from "./shaders/noise";
import { SCENE, type SceneUniforms } from "./SceneLighting";

/**
 * Cordilheiras em camadas (silhuetas procedurais). Cada camada é um plano com
 * a linha das montanhas calculada no shader, o que custa quase nada e permite
 * parallax real entre as camadas quando a câmera se move.
 */
type Layer = {
  z: number;
  base: number;
  amp: number;
  /** picos por unidade de mundo; diminui com a distância para manter a escala na tela */
  freq: number;
  /** >1 deixa os picos mais agudos (agulhas) */
  sharp: number;
  /** quanto as bordas sobem, enquadrando a cena como penhascos */
  edgeRise: number;
  color: string;
  fog: string;
  fogY: number;
  fogH: number;
  rim: number;
  seed: number;
};

// Alturas pensadas em ângulo na tela (cada camada mais baixa que a de trás),
// para que todas apareçam em faixas, com névoa nos vales visíveis.
const LAYERS: Layer[] = [
  {
    z: -330,
    base: 4,
    amp: 64,
    freq: 0.0065,
    sharp: 1.6,
    edgeRise: 6,
    color: "#232c5e",
    fog: "#3d5290",
    fogY: 30,
    fogH: 10,
    rim: 0.3,
    seed: 3.1,
  },
  {
    z: -210,
    base: -2,
    amp: 32,
    freq: 0.011,
    sharp: 2.0,
    edgeRise: 10,
    color: "#121839",
    fog: "#273c74",
    fogY: 10,
    fogH: 7,
    rim: 0.22,
    seed: 7.7,
  },
  {
    z: -120,
    base: -6,
    amp: 15,
    freq: 0.019,
    sharp: 2.6,
    edgeRise: 12,
    color: "#090c24",
    fog: "#172652",
    fogY: 0.5,
    fogH: 4.5,
    rim: 0.16,
    seed: 13.2,
  },
  {
    z: -48,
    base: -4.8,
    amp: 3.4,
    freq: 0.07,
    sharp: 1.3,
    edgeRise: 16,
    color: "#04040e",
    fog: "#090e28",
    fogY: -7,
    fogH: 1.5,
    rim: 0.1,
    seed: 21.9,
  },
];

const vertex = /* glsl */ `
varying vec3 vW;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const fragment = /* glsl */ `
uniform float uReveal;
uniform float uBase, uAmp, uFreq, uSharp, uSeed, uEdgeRise, uHalfW, uRim, uFogY, uFogH, uRimK;
uniform vec3 uColor, uFog, uRimColor;
varying vec3 vW;
${noiseGLSL}

float ridge(float x){
  float s = 0.0, a = 0.62, f = 1.0;
  for (int i = 0; i < 4; i++) {
    float n = vnoise1(x * f + uSeed * float(i + 1));
    n = 1.0 - abs(n * 2.0 - 1.0);
    s += a * pow(n, uSharp + float(i) * 0.4);
    f *= 2.35; a *= 0.34;
  }
  return s;
}

void main(){
  float xn = vW.x / uHalfW;
  float h = uBase + uAmp * ridge(vW.x * uFreq) + uEdgeRise * pow(abs(xn) * 1.6, 2.4);
  float edge = h - vW.y;
  float aa = fwidth(edge) * 1.25;
  float alpha = smoothstep(-aa, aa, edge);
  if (alpha < 0.003) discard;

  // névoa acumulada nos vales (mais clara perto da base de cada camada)
  float fog = 1.0 - smoothstep(uFogY - uFogH * 0.4, uFogY + uFogH, vW.y);
  vec3 col = mix(uColor, uFog, fog * 0.55 * uReveal);

  // textura leve de rocha
  col *= 0.93 + 0.12 * vnoise3(vec3(vW.x * 0.2, vW.y * 0.5, uSeed));

  // contorno iluminado pela atmosfera do planeta
  col += uRimColor * exp(-edge * uRimK) * uRim * uReveal;

  gl_FragColor = vec4(col * mix(0.4, 1.0, uReveal), alpha);
}
`;

const hazeFragment = /* glsl */ `
uniform float uReveal;
uniform float uGlow;
uniform vec3 uColor;
uniform float uY, uH, uHalfW;
varying vec3 vW;
void main(){
  float v = exp(-abs(vW.y - uY) / uH);
  float side = 1.0 - smoothstep(0.35, 1.0, abs(vW.x) / uHalfW);
  float a = v * side * 0.35 * uReveal * (0.8 + 0.2 * uGlow);
  gl_FragColor = vec4(uColor * a, 1.0);
}
`;

export function Terrain({ uniforms, octaves }: { uniforms: SceneUniforms; octaves: number }) {
  const layers = useMemo(
    () =>
      LAYERS.map((l) => {
        const dist = Math.abs(l.z - SCENE.camera.z);
        const halfW = dist * 1.25 + 40;
        const top = l.base + l.amp * 1.3 + l.edgeRise * 3.2 + 4;
        const bottom = SCENE.camera.y - dist * 0.62 - 10;
        const material = new ShaderMaterial({
          vertexShader: vertex,
          fragmentShader: withOctaves(fragment, octaves),
          uniforms: {
            uReveal: uniforms.uReveal,
            uBase: { value: l.base },
            uAmp: { value: l.amp },
            uFreq: { value: l.freq },
            uSharp: { value: l.sharp },
            uSeed: { value: l.seed },
            uEdgeRise: { value: l.edgeRise },
            uHalfW: { value: halfW },
            uRim: { value: l.rim },
            uRimK: { value: 60 / dist },
            uFogY: { value: l.fogY },
            uFogH: { value: l.fogH },
            uColor: { value: new Color(l.color) },
            uFog: { value: new Color(l.fog) },
            uRimColor: { value: new Color("#6a5ae0") },
          },
          transparent: true,
        });
        return { ...l, halfW, top, bottom, material };
      }),
    [uniforms, octaves],
  );

  const haze = useMemo(() => {
    const z = -160;
    const halfW = Math.abs(z - SCENE.camera.z) * 1.3;
    return {
      z,
      halfW,
      material: new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: hazeFragment,
        uniforms: {
          uReveal: uniforms.uReveal,
          uGlow: uniforms.uGlow,
          uColor: { value: new Color("#3d6fe0") },
          uY: { value: 1.5 },
          uH: { value: 5 },
          uHalfW: { value: halfW },
        },
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    };
  }, [uniforms]);
  useEffect(
    () => () => {
      layers.forEach((l) => l.material.dispose());
      haze.material.dispose();
    },
    [layers, haze],
  );

  return (
    <group>
      {layers.map((l) => (
        <mesh key={l.z} position={[0, (l.top + l.bottom) / 2, l.z]} material={l.material}>
          <planeGeometry args={[l.halfW * 2, l.top - l.bottom]} />
        </mesh>
      ))}
      <mesh position={[0, 1.5, haze.z]} material={haze.material}>
        <planeGeometry args={[haze.halfW * 2, 40]} />
      </mesh>
    </group>
  );
}
