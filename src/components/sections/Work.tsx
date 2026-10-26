"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { content, type Project } from "@/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { gsap } from "@/lib/gsap";
import { ProjectPreview } from "./ProjectPreview";

const work = content.work;

export function Work() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-project]").forEach((panel) => {
        const media = panel.querySelector("[data-media]");
        const img = panel.querySelector("[data-media-inner]");
        gsap.fromTo(
          media,
          { clipPath: "inset(14% 10% 14% 10% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: panel, start: "top 78%", once: true },
          },
        );
        gsap.fromTo(
          img,
          { scale: 1.12 },
          {
            scale: 1,
            duration: 1.6,
            ease: "expo.out",
            scrollTrigger: { trigger: panel, start: "top 78%", once: true },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="projetos"
      aria-labelledby="projetos-title"
      className="relative z-10 border-t border-line bg-vorion py-24 sm:py-36"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeader id="projetos-title" eyebrow={work.eyebrow} title={work.headline} copy={work.intro} />

        <ol className="mt-16 flex flex-col gap-20 sm:mt-24 sm:gap-32">
          {(work.projects as Project[]).map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <li key={p.slug} data-project className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                <div
                  data-media
                  className={`group/media relative aspect-[16/10] overflow-hidden rounded-[28px] border border-line lg:col-span-7 ${
                    flip ? "lg:order-2" : ""
                  }`}
                >
                  <div data-media-inner className="h-full w-full">
                    <div className="h-full w-full transition-transform duration-700 ease-[var(--ease-cinematic)] group-hover/media:scale-[1.03]">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={`Tela de ${p.name}`}
                          fill
                          sizes="(min-width: 1024px) 58vw, 100vw"
                          className="object-cover object-left-top"
                        />
                      ) : (
                        <ProjectPreview kind={p.preview ?? "dashboard"} />
                      )}
                    </div>
                  </div>
                  {p.image && (
                    <span className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/55 px-3 py-1 font-mono text-[0.66rem] tracking-[0.1em] text-star/70 backdrop-blur">
                      {(p.imageLabel ?? work.fictitious).toUpperCase()}
                    </span>
                  )}
                  {p.placeholder && (
                    <span className="absolute left-4 top-4 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 font-mono text-[0.68rem] tracking-[0.12em] text-amber-200 backdrop-blur">
                      {work.placeholderBadge.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                  <p className="font-mono text-[0.72rem] tracking-[0.18em] text-cosmic">
                    {String(i + 1).padStart(2, "0")} / {p.kind.toUpperCase()}
                  </p>
                  <h3 className="mt-4 font-display text-[2rem] font-medium leading-[1.08] tracking-[-0.02em] text-star sm:text-[2.6rem]">
                    {p.name}
                  </h3>
                  {p.by && <p className="mt-3 text-[0.92rem] text-cosmic">por {p.by}</p>}
                  <dl className="mt-8 space-y-6 border-t border-line pt-6">
                    <div>
                      <dt className="text-[0.8rem] font-medium text-star/50">{work.problemLabel}</dt>
                      <dd className="mt-1.5 max-w-[46ch] leading-relaxed text-cosmic">{p.problem}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.8rem] font-medium text-star/50">{work.solutionLabel}</dt>
                      <dd className="mt-1.5 max-w-[46ch] leading-relaxed text-star/85">{p.solution}</dd>
                    </div>
                  </dl>
                  <ul className="mt-7 flex flex-wrap gap-2" aria-label="Tecnologias">
                    {p.stack.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-line px-3 py-1 font-mono text-[0.72rem] text-star/70"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  {p.note && <p className="mt-5 max-w-[46ch] text-[0.82rem] leading-relaxed text-cosmic">{p.note}</p>}
                  {p.placeholder ? (
                    <p className="mt-8 text-[0.85rem] text-amber-200/70">{work.placeholderNote}</p>
                  ) : (
                    <a
                      href={p.href ?? `/projetos/${p.slug}`}
                      target={p.href ? "_blank" : undefined}
                      rel={p.href ? "noopener noreferrer" : undefined}
                      className="mt-8 inline-flex items-center gap-1.5 text-[0.95rem] text-star underline decoration-white/20 underline-offset-[6px] transition-colors hover:decoration-white/70"
                    >
                      {p.linkLabel ?? work.cta}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
