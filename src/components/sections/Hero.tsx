"use client";

import { useEffect, useRef } from "react";
import { content } from "@/content";
import { ButtonLink } from "@/components/ui/Button";
import { gsap } from "@/lib/gsap";

const hero = content.hero;
const words = hero.headline.split(" ");

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  // a entrada é CSS (globals.css); aqui só o afastamento do texto durante o scroll
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to(inner.current, {
        opacity: 0,
        y: -90,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "65% top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="inicio"
      aria-labelledby="hero-title"
      className="relative z-10 flex min-h-[max(100svh,560px)] flex-col justify-end pt-[calc(var(--nav-h)+2rem)]"
    >
      {/* transição suave da paisagem para o fundo sólido da próxima seção (fica atrás do texto) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-vorion"
      />
      <div ref={inner} className="relative mx-auto w-full max-w-[1440px] px-5 pb-[max(4.5rem,11vh)] sm:px-8 lg:px-12">
        <p
          data-hero="eyebrow"
          className="font-mono text-[0.68rem] tracking-[0.16em] text-star/70 sm:text-[0.74rem] sm:tracking-[0.24em]"
        >
          {hero.eyebrow}
        </p>

        <h1
          id="hero-title"
          className="mt-6 max-w-[15ch] font-display text-display font-medium tracking-[-0.035em] text-star [text-shadow:0_2px_40px_rgba(5,5,12,0.6)]"
        >
          {/* máscara por palavra: a quebra de linha fica natural em qualquer largura */}
          {words.map((word, i) => (
            <span key={i}>
              <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                <span data-hero="word" className="inline-block" style={{ ["--i" as string]: i }}>
                  {word}
                </span>
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </h1>

        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[46ch]">
            <p data-hero="copy" className="text-[1.05rem] leading-relaxed text-star/75 sm:text-[1.125rem]">
              {hero.copy}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <span data-hero="cta" className="inline-flex">
                <ButtonLink href="#contato">{hero.primaryCta}</ButtonLink>
              </span>
              <span data-hero="cta" className="inline-flex">
                <ButtonLink href="#solucoes" variant="secondary">
                  {hero.secondaryCta}
                </ButtonLink>
              </span>
            </div>
          </div>

          <div
            data-hero="meta"
            className="hidden flex-col items-end gap-2 text-right font-mono text-[0.68rem] tracking-[0.22em] text-star/55 lg:flex"
          >
            <span>{hero.label}</span>
            <span className="text-star/35">{hero.coordinates}</span>
          </div>
        </div>
      </div>

      {/* indicador de scroll */}
      <div
        data-hero="meta"
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
      >
        <span className="font-mono text-[0.62rem] tracking-[0.3em] text-star/45">{hero.scroll.toUpperCase()}</span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent via-star/80 to-transparent [animation:scroll-cue_2.4s_var(--ease-soft)_infinite]" />
        </span>
      </div>
    </section>
  );
}
