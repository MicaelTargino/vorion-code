"use client";

import { useRef, type PointerEvent } from "react";
import { ArrowUpRight, Cloud, Code2, Layers, PenTool, Smartphone, Sparkles } from "lucide-react";
import { content, type ServiceIcon } from "@/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { scrollToId } from "@/lib/scroll";
import { selectProjectType } from "@/lib/contact";

const ex = content.expertise;

const icons: Record<ServiceIcon, typeof Code2> = {
  code: Code2,
  layers: Layers,
  smartphone: Smartphone,
  sparkles: Sparkles,
  cloud: Cloud,
  pen: PenTool,
};

export function Expertise() {
  const grid = useRef<HTMLUListElement>(null);

  // brilho que segue o cursor e "vaza" para os cards vizinhos
  const onMove = (e: PointerEvent<HTMLUListElement>) => {
    const cards = grid.current?.querySelectorAll<HTMLElement>("[data-card]");
    cards?.forEach((card) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  };

  return (
    <section
      id="solucoes"
      aria-labelledby="solucoes-title"
      className="relative z-10 bg-vorion pb-28 pt-24 sm:pb-36 sm:pt-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeader id="solucoes-title" eyebrow={ex.eyebrow} title={ex.headline} copy={ex.copy} />

        <ul
          ref={grid}
          onPointerMove={onMove}
          className="group/grid mt-16 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:mt-20 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ex.services.map((s) => {
            const Icon = icons[s.icon];
            return (
              <li key={s.n} className="bg-vorion">
                <a
                  href="#contato"
                  data-card
                  onClick={(e) => {
                    e.preventDefault();
                    selectProjectType(s.title);
                    scrollToId("contato");
                  }}
                  className="gradient-border group/card relative flex h-full min-h-[300px] flex-col overflow-hidden p-7 outline-none sm:p-9"
                >
                  {/* brilho de proximidade */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/grid:opacity-100"
                    style={{
                      background:
                        "radial-gradient(420px circle at var(--mx, -500px) var(--my, -500px), rgba(124,58,237,0.13), rgba(59,130,246,0.06) 40%, transparent 70%)",
                    }}
                  />
                  <div className="relative flex items-start justify-between">
                    <span className="font-display text-[4.25rem] font-medium leading-none tracking-[-0.05em] text-white/[0.07] transition-colors duration-500 group-hover/card:text-white/[0.14]">
                      {s.n}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white/[0.02] text-star/80 transition-colors duration-300 group-hover/card:border-white/20 group-hover/card:text-star">
                      <Icon size={19} strokeWidth={1.5} aria-hidden />
                    </span>
                  </div>
                  <div className="relative mt-auto pt-14">
                    <h3 className="font-display text-[1.5rem] font-medium tracking-[-0.015em] text-star">{s.title}</h3>
                    <p className="mt-3 max-w-[34ch] text-[0.98rem] leading-relaxed text-cosmic">{s.copy}</p>
                    <span className="mt-7 inline-flex items-center gap-1.5 text-[0.85rem] text-star/60 transition-colors duration-300 group-hover/card:text-star group-focus-visible/card:text-star">
                      {ex.cardCta}
                      <ArrowUpRight
                        size={15}
                        aria-hidden
                        className="transition-transform duration-300 ease-[var(--ease-cinematic)] group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5"
                      />
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
