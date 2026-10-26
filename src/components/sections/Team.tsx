import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { content } from "@/content";
import { SectionHeader } from "@/components/ui/SectionHeader";

const team = content.team;

export function Team() {
  return (
    <section
      id="time"
      aria-labelledby="time-title"
      className="relative z-10 border-t border-line bg-vorion pb-28 pt-24 sm:pb-36 sm:pt-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeader id="time-title" eyebrow={team.eyebrow} title={team.headline} copy={team.copy} />

        <ul className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:mt-20 md:grid-cols-3">
          {team.founders.map((f) => (
            <li key={f.name} className="flex flex-col bg-vorion p-7 sm:p-9">
              <div className="flex items-center gap-5">
                <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-line-strong bg-elevated">
                  {f.photo ? (
                    <Image src={f.photo} alt={`Foto de ${f.name}`} fill sizes="80px" className="object-cover" />
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-full w-full items-center justify-center font-display text-[1.4rem] font-medium tracking-[0.04em] text-star/80"
                      style={{ background: "linear-gradient(135deg, rgba(146,108,216,.35), rgba(180,151,232,.25))" }}
                    >
                      {f.initials}
                    </span>
                  )}
                </span>
                <div>
                  <h3 className="font-display text-[1.45rem] font-medium tracking-[-0.015em] text-star">{f.name}</h3>
                  <p className="mt-1 text-[0.95rem] text-cosmic">
                    {f.role}
                    {f.focus ? ` · ${f.focus}` : ""}
                  </p>
                </div>
              </div>
              <ul className="mt-8 flex flex-wrap gap-2" aria-label={`Links de ${f.name}`}>
                {f.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-line-strong px-3.5 py-1.5 text-[0.85rem] text-star/80 transition-colors hover:border-white/30 hover:text-star"
                    >
                      {l.label}
                      <ArrowUpRight size={13} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
