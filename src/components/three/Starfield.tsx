"use client";

import { useEffect, useMemo } from "react";
import { BackSide, ShaderMaterial } from "three";
import { noiseGLSL, withOctaves } from "./shaders/noise";
import type { SceneUniforms } from "./SceneLighting";

const vertex = /* glsl */ `
varying vec3 vDir;
void main(){
  vDir = normalize(position);
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww; // sempre no plano mais distante
}
`;

const fragment = /* glsl */ `
uniform float uTime;
uniform float uReveal;
uniform float uGlow;
uniform vec3 uPlanetPos;
uniform float uPlanetRadius;
uniform float uStarDensity;
varying vec3 vDir;
${noiseGLSL}

void main(){
  vec3 d = normalize(vDir);
  float h = d.y;

  // céu: preto profundo no alto, violeta muito discreto perto do horizonte
  vec3 top = vec3(0.010, 0.010, 0.026);
  vec3 hor = vec3(0.060, 0.034, 0.120);
  vec3 col = mix(hor, top, smoothstep(-0.02, 0.55, h));

  // halo do planeta no céu (espalhamento atmosférico)
  vec3 pdir = normalize(uPlanetPos);
  float ang = acos(clamp(dot(d, pdir), -1., 1.));
  float ar = asin(clamp(uPlanetRadius / length(uPlanetPos), 0., 1.));
  float halo = exp(-max(ang - ar, 0.) * 7.0);
  float haloWide = exp(-max(ang - ar, 0.) * 2.2);
  col += (vec3(0.42, 0.16, 0.62) * halo * 0.55 + vec3(0.20, 0.10, 0.42) * haloWide * 0.35) * uReveal * uGlow;

  // faixa luminosa do horizonte
  float band = exp(-abs(h - 0.012) * 26.0);
  col += vec3(0.16, 0.20, 0.50) * band * 0.55 * uReveal;

  // nebulosa contida, só nas laterais altas
  // (só calcula o ruído onde a máscara existe: economiza a maior parte dos pixels)
  float mask = smoothstep(0.05, 0.4, h) * smoothstep(0.15, 0.75, abs(d.x));
  if (mask > 0.002) {
    float n = fbm3(d * 2.6 + vec3(0.0, 0.0, uTime * 0.004));
    float n2 = fbm3(d * 6.0 + 4.0);
    float neb = smoothstep(0.52, 0.86, n) * (0.55 + 0.45 * n2);
    col += neb * mask * mix(vec3(0.34, 0.12, 0.58), vec3(0.12, 0.20, 0.58), n2) * 0.30 * uReveal;
  }

  // estrelas esparsas
  vec3 p = d * uStarDensity;
  vec3 cell = floor(p);
  vec3 f = fract(p) - 0.5;
  float r = hash13(cell);
  float star = 0.0;
  if (r > 0.9915) {
    vec3 off = (vec3(hash13(cell + 1.3), hash13(cell + 7.1), hash13(cell + 3.7)) - 0.5) * 0.5;
    float dist = length(f - off);
    float size = mix(0.035, 0.11, pow(hash13(cell + 11.0), 3.0));
    float tw = 0.78 + 0.22 * sin(uTime * (0.4 + r * 1.6) + r * 40.0);
    star = smoothstep(size, 0.0, dist) * tw * mix(0.35, 1.0, hash13(cell + 5.0));
    // poucas estrelas com um leve halo
    if (r > 0.9988) star += exp(-dist * 22.0) * 0.35;
  }
  float starMask = smoothstep(0.02, 0.22, h) * (1.0 - halo * 0.85);
  vec3 starCol = mix(vec3(0.80, 0.85, 1.0), vec3(1.0, 0.92, 1.0), hash13(cell + 2.0));
  col += starCol * star * starMask * smoothstep(0.25, 1.0, uReveal) * 1.15;

  gl_FragColor = vec4(col, 1.0);
}
`;

export function Starfield({
  uniforms,
  octaves,
  density,
}: {
  uniforms: SceneUniforms;
  octaves: number;
  density: number;
}) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: withOctaves(fragment, octaves),
        uniforms: {
          uTime: uniforms.uTime,
          uReveal: uniforms.uReveal,
          uGlow: uniforms.uGlow,
          uPlanetPos: uniforms.uPlanetPos,
          uPlanetRadius: uniforms.uPlanetRadius,
          uStarDensity: { value: density },
        },
        side: BackSide,
        depthWrite: false,
      }),
    [uniforms, octaves, density],
  );
  useEffect(() => () => material.dispose(), [material]);

  return (
    <mesh renderOrder={-10} frustumCulled={false} material={material}>
      <sphereGeometry args={[900, 48, 32]} />
    </mesh>
  );
}
