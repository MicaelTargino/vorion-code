"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { detectQuality, hasWebGL, type Quality } from "@/lib/scene-store";
import { SceneFallback } from "./SceneFallback";
import { ScrollSceneController } from "./ScrollSceneController";

const CosmicScene = dynamic(() => import("./CosmicScene"), { ssr: false });

/**
 * Camada fixa atrás da página. Visível no hero e no CTA final; as seções do
 * meio têm fundo sólido e o loop de render fica pausado enquanto elas ocupam a tela.
 */
export function CosmicCanvas() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<{ webgl: boolean; quality: Quality } | null>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);

  // monta o WebGL só quando o navegador estiver ocioso: a compilação dos shaders
  // não disputa a thread principal com a hidratação e a entrada do hero
  useEffect(() => {
    const start = () => setMode({ webgl: hasWebGL(), quality: detectQuality() });
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 900 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(start, 300);
    return () => window.clearTimeout(t);
  }, []);

  // pausa o render quando nem o hero nem o CTA final estão na tela
  useEffect(() => {
    const targets = ["inicio", "contato"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const visible = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target, e.isIntersecting));
        setActive([...visible.values()].some(Boolean));
      },
      { rootMargin: "10% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <SceneFallback />
      {mode?.webgl && (
        <div
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-[var(--ease-soft)]"
          style={{ opacity: ready ? 1 : 0 }}
        >
          <CosmicScene quality={mode.quality} active={active} onReady={() => setReady(true)} />
        </div>
      )}
      {/* vinheta para legibilidade do texto */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,5,12,0.55) 0%, rgba(5,5,12,0) 22%, rgba(5,5,12,0) 70%, rgba(5,5,12,0.65) 100%)",
        }}
      />
      <ScrollSceneController wrapper={wrapper} webglReady={ready} />
    </div>
  );
}
