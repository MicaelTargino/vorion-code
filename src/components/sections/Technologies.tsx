import { content } from "@/content";
import { SectionHeader } from "@/components/ui/SectionHeader";

const tech = content.technologies;

export function Technologies() {
  return (
    <section
      id="tecnologias"
      aria-labelledby="tecnologias-title"
      className="relative z-10 border-t border-line bg-vorion pb-28 pt-24 sm:pb-40 sm:pt-36"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeader id="tecnologias-title" eyebrow={tech.eyebrow} title={tech.headline} />
        <div className="mt-16 grid grid-cols-2 border-t border-line sm:mt-20 md:grid-cols-3 lg:grid-cols-5">
          {tech.categories.map((c) => (
            <div
              key={c.name}
              className="border-b border-line py-8 pr-6 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
            >
              <h3 className="font-mono text-[0.72rem] tracking-[0.16em] text-cosmic">{c.name.toUpperCase()}</h3>
              <ul className="mt-6 space-y-2.5">
                {c.items.map((t) => (
                  <li
                    key={t}
                    className="font-display text-[1.25rem] font-normal tracking-[-0.01em] text-star/80 transition-colors duration-300 hover:text-star sm:text-[1.4rem]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
