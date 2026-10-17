"use client";

import { forwardRef, useEffect, useMemo } from "react";
import { AdditiveBlending, BackSide, Group, ShaderMaterial } from "three";
import { noiseGLSL, withOctaves } from "./shaders/noise";
import type { SceneUniforms } from "./SceneLighting";

const planetVertex = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vPosW;
varying vec3 vPosO;
void main(){
  vPosO = position;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPosW = w.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const planetFragment = /* glsl */ `
uniform float uTime;
uniform float uReveal;
uniform vec3 uLightDir;
uniform float uPlanetRadius;
varying vec3 vNormalW;
varying vec3 vPosW;
varying vec3 vPosO;
${noiseGLSL}

void main(){
  vec3 n = normalize(vNormalW);
  vec3 V = normalize(cameraPosition - vPosW);
  vec3 L = normalize(uLightDir);
  float ndl = dot(n, L);

  // superfície: faixas de nuvens em turbilhão, girando bem devagar
  vec3 sp = vPosO / uPlanetRadius;
  float a = uTime * 0.006;
  sp.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * sp.xz;
  float warp = fbm3(sp * 2.4 + 3.0);
  float bands = fbm3(vec3(sp.x * 1.6, sp.y * 5.5, sp.z * 1.6) + warp * 1.7);
  float storms = smoothstep(0.62, 0.8, fbm3(sp * 7.0 + warp));
  vec3 deep = vec3(0.07, 0.03, 0.17);
  vec3 mid = vec3(0.30, 0.12, 0.55);
  vec3 bright = vec3(0.62, 0.36, 0.92);
  vec3 surf = mix(deep, mid, smoothstep(0.32, 0.62, bands));
  surf = mix(surf, bright, smoothstep(0.6, 0.85, bands) * 0.7 + storms * 0.35);

  // terminador suave + luz ambiente fraca no lado escuro
  float day = smoothstep(-0.18, 0.55, ndl);
  vec3 col = surf * (0.16 + 1.25 * day);

  // borda iluminada (luz atravessando a atmosfera)
  float fres = pow(1.0 - max(dot(n, V), 0.0), 2.6);
  col += vec3(0.78, 0.62, 1.0) * fres * smoothstep(-0.35, 0.45, ndl) * 0.9;
  col += vec3(0.25, 0.35, 0.9) * fres * 0.18;

  gl_FragColor = vec4(col * uReveal, 1.0);
}
`;

const atmosphereVertex = /* glsl */ `
varying vec3 vNormalV;
varying vec3 vNormalW;
void main(){
  vNormalV = normalize(normalMatrix * normal);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const atmosphereFragment = /* glsl */ `
uniform float uReveal;
uniform float uGlow;
uniform vec3 uLightDir;
uniform float uInner;
varying vec3 vNormalV;
varying vec3 vNormalW;
void main(){
  // casca vista por dentro: forte junto ao planeta, some na borda externa
  float d = -vNormalV.z;
  float t = clamp(d / uInner, 0.0, 1.0);
  float glow = pow(t, 2.2);
  float lit = smoothstep(-0.45, 0.65, dot(normalize(vNormalW), normalize(uLightDir)));
  vec3 col = mix(vec3(0.30, 0.38, 1.0), vec3(0.82, 0.56, 1.0), lit);
  float intensity = glow * (0.18 + 1.1 * lit) * uReveal * uGlow;
  gl_FragColor = vec4(col * intensity, 1.0);
}
`;

type Props = { uniforms: SceneUniforms; octaves: number; segments: number };

export const Planet = forwardRef<Group, Props>(function Planet({ uniforms, octaves, segments }, ref) {
  const radius = uniforms.uPlanetRadius.value;
  const shell = 1.13;

  const planetMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: planetVertex,
        fragmentShader: withOctaves(planetFragment, octaves),
        uniforms: {
          uTime: uniforms.uTime,
          uReveal: uniforms.uReveal,
          uLightDir: uniforms.uLightDir,
          uPlanetRadius: uniforms.uPlanetRadius,
        },
      }),
    [uniforms, octaves],
  );

  const atmosphereMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        uniforms: {
          uReveal: uniforms.uReveal,
          uGlow: uniforms.uGlow,
          uLightDir: uniforms.uLightDir,
          // ângulo em que a linha de visão tangencia o planeta, visto da casca
          uInner: { value: Math.sqrt(1 - 1 / (shell * shell)) },
        },
        side: BackSide,
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    [uniforms],
  );
  useEffect(
    () => () => {
      planetMaterial.dispose();
      atmosphereMaterial.dispose();
    },
    [planetMaterial, atmosphereMaterial],
  );

  return (
    <group ref={ref} position={uniforms.uPlanetPos.value.toArray()}>
      <mesh material={planetMaterial}>
        <sphereGeometry args={[radius, segments, segments / 2]} />
      </mesh>
      <mesh material={atmosphereMaterial} scale={shell}>
        <sphereGeometry args={[radius, segments, segments / 2]} />
      </mesh>
    </group>
  );
});
