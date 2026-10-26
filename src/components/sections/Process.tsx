"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollTrigger } from "@/lib/gsap";

const proc = content.process;
const N = proc.steps.length;

// arco orbital (viewBox 600x600): uma elipse inclinada percorrida de baixo/esquerda para cima/direita
const ORBIT = "M70 470 C 40 300, 200 120, 380 90 S 600 160, 530 330";

export function Process() {
  const root = useRef<HTMLElement>(null);
  const steps = useRef<HTMLOListElement>(null);
  const path = useRef<SVGPathElement>(null);
  const dot = useRef<SVGGElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const mobileFill = useRef<HTMLSpanElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  // -1 = nenhum passo ativo ainda
  const [activeIndex, setActiveIndex] = useState(-1);

  // posição dos marcos ao longo do arco
  useEffect(() => {
    const p = path.current;
    if (!p) return;
    const len = p.getTotalLength();
    setPoints(proc.steps.map((_, i) => p.getPointAtLength((i / (N - 1)) * len)));
  }, []);

  useEffect(() => {
    const p = path.current;
    if (!p || !steps.current) return;
    const len = p.getTotalLength();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const apply = (t: number) => {
      const pt = p.getPointAtLength(t * len);
      dot.current?.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
      if (trail.current) trail.current.style.strokeDashoffset = String(len * (1 - t));
      if (mobileFill.current) mobileFill.current.style.transform = `scaleY(${t})`;
      // só re-renderiza quando o passo ativo muda
      setActiveIndex(t <= 0.001 ? -1 : Math.min(N - 1, Math.floor(t * (N - 1) + 0.15)));
    };

    if (trail.current) trail.current.style.strokeDasharray = String(len);
    if (reduced) {
      apply(1);
      return;
    }
    apply(0);
    const st = ScrollTrigger.create({
      trigger: steps.current,
      start: "top 60%",
      end: "bottom 60%",
      scrub: 0.6,
      onUpdate: (self) => apply(self.progress),
    });
    return () => st.kill();
  }, []);

  return (
    <section
      ref={root}
      id="processo"
      aria-labelledby="processo-title"
      className="relative z-10 border-t border-line bg-vorion py-24 sm:py-36"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeader id="processo-title" eyebrow={proc.eyebrow} title={proc.headline} />

        <div className="mt-16 grid gap-12 sm:mt-24 lg:grid-cols-12 lg:gap-16">
          {/* órbita fixa (desktop) */}
          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-[calc(var(--nav-h)+6vh)]">
              <svg viewBox="0 0 700 560" className="w-full" aria-hidden>
                <defs>
                  <linearGradient id="orbit-grad" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0" stopColor="#926CD8" />
                    <stop offset="1" stopColor="#B497E8" />
                  </linearGradient>
                  <radialGradient id="orbit-dot">
                    <stop offset="0" stopColor="#FFFCF3" />
                    <stop offset="0.35" stopColor="#a78bfa" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#926CD8" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* anéis de contexto */}
                <ellipse
                  cx="300"
                  cy="290"
                  rx="250"
                  ry="120"
                  transform="rotate(-28 300 290)"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                />
                <ellipse
                  cx="300"
                  cy="290"
                  rx="170"
                  ry="70"
                  transform="rotate(-28 300 290)"
                  fill="none"
                  stroke="rgba(255,255,255,0.04)"
                  strokeDasharray="2 6"
                />
                <circle cx="300" cy="290" r="3" fill="rgba(255,252,243,0.5)" />

                <path ref={path} d={ORBIT} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
                <path
                  ref={trail}
                  d={ORBIT}
                  fill="none"
                  stroke="url(#orbit-grad)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />

                {points.map((pt, i) => {
                  const on = i <= activeIndex;
                  return (
                    <g key={i} transform={`translate(${pt.x} ${pt.y})`}>
                      <circle
                        r={on ? 7 : 5}
                        fill="#0b0b14"
                        stroke={on ? "url(#orbit-grad)" : "rgba(255,255,255,0.25)"}
                        strokeWidth="1.5"
                        style={{ transition: "r 400ms" }}
                      />
                      <text
                        x={i === N - 1 ? -18 : 18}
                        y={i === 0 ? -14 : 5}
                        textAnchor={i === N - 1 ? "end" : "start"}
                        className="font-mono"
                        fontSize="13"
                        letterSpacing="1.5"
                        fill={on ? "rgba(255,252,243,0.9)" : "rgba(156,163,175,0.6)"}
                        style={{ transition: "fill 400ms" }}
                      >
                        {proc.steps[i].n} {proc.steps[i].title.toUpperCase()}
                      </text>
                    </g>
                  );
                })}

                <g ref={dot}>
                  <circle r="26" fill="url(#orbit-dot)" opacity="0.65" />
                  <circle r="4.5" fill="#FFFCF3" />
                </g>
              </svg>
            </div>
          </div>

          {/* passos */}
          <div className="relative lg:col-span-6">
            {/* linha vertical (mobile/tablet) */}
            <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-white/10 lg:hidden">
              <span
                ref={mobileFill}
                className="absolute inset-0 origin-top bg-gradient-to-b from-nebula to-orion"
                style={{ transform: "scaleY(0)" }}
              />
            </span>
            <ol ref={steps} className="flex flex-col gap-14 lg:gap-0">
              {proc.steps.map((s, i) => {
                const on = i <= activeIndex;
                return (
                  <li
                    key={s.n}
                    className={`relative pl-10 transition-opacity duration-500 lg:flex lg:min-h-[42vh] lg:flex-col lg:justify-center lg:pl-0 ${
                      on ? "opacity-100" : "opacity-35"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute left-0 top-2 h-[15px] w-[15px] rounded-full border bg-vorion transition-colors duration-500 lg:hidden ${
                        on ? "border-orion" : "border-white/25"
                      }`}
                    />
                    <p className="font-mono text-[0.75rem] tracking-[0.2em] text-cosmic">{s.n}</p>
                    <h3 className="mt-3 font-display text-[2rem] font-medium tracking-[-0.02em] text-star sm:text-[2.75rem]">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-[40ch] text-[1.075rem] leading-relaxed text-cosmic">{s.copy}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
