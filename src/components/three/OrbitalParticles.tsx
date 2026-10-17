"use client";

import { useEffect, useMemo } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, ShaderMaterial } from "three";
import type { SceneUniforms } from "./SceneLighting";

/** Poeira suspensa entre a câmera e as montanhas: dá profundidade ao parallax. */
export function OrbitalParticles({ uniforms, count }: { uniforms: SceneUniforms; count: number }) {
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = -3 + Math.random() * 22;
      positions[i * 3 + 2] = -90 + Math.random() * 96;
      seeds[i] = Math.random();
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));

    const material = new ShaderMaterial({
      uniforms: { uTime: uniforms.uTime, uReveal: uniforms.uReveal },
      vertexShader: /* glsl */ `
        uniform float uTime;
        attribute float aSeed;
        varying float vAlpha;
        void main(){
          vec3 p = position;
          p.x += sin(uTime * 0.05 + aSeed * 40.0) * 1.6;
          p.y += sin(uTime * 0.08 + aSeed * 17.0) * 0.6 + uTime * 0.03 * (0.3 + aSeed);
          p.y = mod(p.y + 3.0, 22.0) - 3.0;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          float size = mix(1.0, 2.6, aSeed);
          gl_PointSize = size * (60.0 / -mv.z);
          vAlpha = smoothstep(120.0, 20.0, -mv.z) * mix(0.25, 0.8, fract(aSeed * 7.13));
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uReveal;
        varying float vAlpha;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d) * vAlpha * uReveal;
          gl_FragColor = vec4(vec3(0.72, 0.74, 1.0) * a, 1.0);
        }
      `,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    return { geometry, material };
  }, [uniforms, count]);
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
