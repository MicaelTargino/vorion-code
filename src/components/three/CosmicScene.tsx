"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import type { Group } from "three";
import type { Quality } from "@/lib/scene-store";
import { CameraRig } from "./CameraRig";
import { OrbitalParticles } from "./OrbitalParticles";
import { Planet } from "./Planet";
import { createSceneUniforms, SCENE } from "./SceneLighting";
import { Starfield } from "./Starfield";
import { Terrain } from "./Terrain";

const QUALITY = {
  high: { dpr: [1, 1.75] as [number, number], octaves: 5, particles: 420, segments: 96, stars: 130 },
  low: { dpr: [1, 1.25] as [number, number], octaves: 3, particles: 140, segments: 64, stars: 110 },
};

function FirstFrame({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    onReady();
  });
  return null;
}

function World({ quality, onReady }: { quality: Quality; onReady: () => void }) {
  const q = QUALITY[quality];
  const uniforms = useMemo(() => createSceneUniforms(), []);
  const planet = useRef<Group>(null);

  return (
    <>
      <Starfield uniforms={uniforms} octaves={q.octaves} density={q.stars} />
      <Planet ref={planet} uniforms={uniforms} octaves={q.octaves} segments={q.segments} />
      <Terrain uniforms={uniforms} octaves={q.octaves} />
      <OrbitalParticles uniforms={uniforms} count={q.particles} />
      <CameraRig uniforms={uniforms} planet={planet} />
      <FirstFrame onReady={onReady} />
    </>
  );
}

export default function CosmicScene({
  quality,
  active,
  onReady,
}: {
  quality: Quality;
  /** false pausa o loop de render (cena fora da tela) */
  active: boolean;
  onReady: () => void;
}) {
  const q = QUALITY[quality];
  const [dpr, setDpr] = useState<number>(
    Math.min(q.dpr[1], typeof window !== "undefined" ? window.devicePixelRatio : 1),
  );

  useEffect(() => {
    setDpr(Math.min(q.dpr[1], window.devicePixelRatio || 1));
  }, [q.dpr]);

  return (
    <Canvas
      aria-hidden
      tabIndex={-1}
      frameloop={active ? "always" : "never"}
      dpr={dpr}
      flat
      gl={{ antialias: quality === "high", alpha: false, powerPreference: "high-performance", stencil: false }}
      camera={{ fov: SCENE.fov, near: 0.5, far: 2000, position: SCENE.camera.toArray() }}
      onCreated={({ camera }) => camera.lookAt(SCENE.lookAt)}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#05050c"]} />
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <World quality={quality} onReady={onReady} />
    </Canvas>
  );
}
