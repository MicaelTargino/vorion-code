"use client";

import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { sceneState } from "@/lib/scene-store";

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

/**
 * Ponte entre o DOM e a cena: ponteiro, entrada do horizonte e progresso de
 * scroll do hero e do CTA final. Também controla a opacidade da camada fixa.
 */
export function ScrollSceneController({
  wrapper,
  webglReady,
}: {
  wrapper: RefObject<HTMLDivElement | null>;
  webglReady: boolean;
}) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sceneState.reducedMotion = reduced;

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const applyOpacity = () => {
      const el = wrapper.current;
      if (!el) return;
      const heroVis = 1 - smoothstep(0.72, 1, sceneState.heroProgress);
      const ctaVis = smoothstep(0, 0.35, sceneState.ctaProgress);
      const o = Math.max(heroVis, ctaVis);
      el.style.opacity = String(o);
      el.style.visibility = o < 0.01 ? "hidden" : "visible";
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#inicio",
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          sceneState.heroProgress = reduced ? Math.round(self.progress) : self.progress;
          applyOpacity();
        },
      });
      ScrollTrigger.create({
        trigger: "#contato",
        start: "top bottom",
        end: "top 10%",
        onUpdate: (self) => {
          sceneState.ctaProgress = reduced ? (self.progress > 0 ? 1 : 0) : self.progress;
          applyOpacity();
        },
      });
    });
    applyOpacity();

    return () => {
      window.removeEventListener("pointermove", onPointer);
      ctx.revert();
    };
  }, [wrapper]);

  // o horizonte acende quando o primeiro frame WebGL fica pronto
  useEffect(() => {
    if (!webglReady) return;
    if (sceneState.reducedMotion) {
      sceneState.reveal = 1;
      return;
    }
    const tween = gsap.fromTo(sceneState, { reveal: 0 }, { reveal: 1, duration: 2.4, ease: "power2.out" });
    return () => {
      tween.kill();
    };
  }, [webglReady]);

  return null;
}
