import { content } from "@/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NodeField } from "@/components/visuals/NodeField";

const m = content.mindset;

export function Mindset() {
  return (
    <section
      id="sobre"
      aria-labelledby="sobre-title"
      className="grain relative z-10 overflow-hidden border-t border-line bg-deep py-24 sm:py-36"
    >
      {/* luz lateral discreta: separa esta seção das demais sem cards */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20%] top-1/2 h-[90%] w-[70%] -translate-y-1/2 rounded-full opacity-60"
        style={{ background: "radial-gradient(closest-side, rgba(59,130,246,0.12), transparent)" }}
      />
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="lg:col-span-6">
          <SectionHeader id="sobre-title" eyebrow={m.eyebrow} title={m.headline} />
          <div className="mt-10 max-w-[52ch] space-y-5 text-[1.075rem] leading-relaxed text-cosmic">
            {m.manifesto.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            {m.principles.map((p) => (
              <div key={p.k} className="bg-deep p-6">
                <dt className="font-display text-[1.15rem] font-medium text-star">{p.k}</dt>
                <dd className="mt-2 text-[0.92rem] leading-relaxed text-cosmic">{p.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative aspect-square w-full lg:col-span-6">
          <NodeField label={m.visualLabel} />
        </div>
      </div>
    </section>
  );
}
