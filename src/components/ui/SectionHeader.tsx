"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Cabeçalho de seção. O título entra com uma revelação por máscara, uma vez,
 * quando chega a 80% da tela; o resto do texto aparece junto, sem cascata.
 */
export function SectionHeader({
  eyebrow,
  title,
  copy,
  id,
  align = "left",
  className = "",
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  id: string;
  align?: "left" | "center";
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-mask]", {
        yPercent: 105,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
      gsap.from("[data-fade]", {
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const center = align === "center";
  return (
    <div ref={root} className={`${center ? "mx-auto text-center" : ""} max-w-4xl ${className}`}>
      <p data-fade className="font-mono text-[0.72rem] tracking-[0.22em] text-cosmic">
        {eyebrow}
      </p>
      <h2 id={id} className="mt-6 font-display text-title font-medium tracking-[-0.025em] text-star">
        <span className="block overflow-hidden pb-[0.08em]">
          <span data-mask className="block">
            {title}
          </span>
        </span>
      </h2>
      {copy && (
        <p
          data-fade
          className={`mt-6 max-w-[58ch] text-[1.075rem] leading-relaxed text-cosmic ${center ? "mx-auto" : ""}`}
        >
          {copy}
        </p>
      )}
    </div>
  );
}
