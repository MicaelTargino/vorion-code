"use client";

import { content } from "@/content";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";
import { ContactForm } from "./ContactForm";

const cta = content.cta;
const form = content.form;

export function FinalCta() {
  const focusForm = () => {
    // depois da rolagem, leva o foco ao primeiro campo
    window.setTimeout(() => {
      document.querySelector<HTMLInputElement>("#formulario input[name='name']")?.focus({ preventScroll: true });
    }, 900);
  };

  return (
    <section id="contato" aria-labelledby="contato-title" className="relative z-10">
      {/* sai do fundo sólido e volta para a paisagem */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-vorion to-transparent"
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col items-center px-5 pt-[22vh] text-center sm:px-8 lg:px-12">
        <h2
          id="contato-title"
          className="max-w-[16ch] font-display text-title font-medium tracking-[-0.03em] text-star [text-shadow:0_2px_40px_rgba(5,5,12,0.7)] sm:text-[clamp(2.6rem,1.2rem+4.4vw,5.5rem)]"
        >
          {cta.headline}
        </h2>
        <p className="mt-6 max-w-[48ch] text-[1.075rem] leading-relaxed text-star/75">{cta.copy}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="#formulario" onClick={focusForm}>
            {cta.primaryCta}
          </ButtonLink>
          <ButtonLink href={`mailto:${siteConfig.email}`} variant="secondary">
            {cta.secondaryCta}
          </ButtonLink>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 pb-28 sm:px-8 lg:px-12">
        <div
          id="formulario"
          className="mx-auto max-w-3xl scroll-mt-28 rounded-[28px] border border-line-strong bg-[rgba(11,11,20,0.78)] p-6 shadow-[0_40px_120px_-40px_rgba(124,58,237,0.45)] backdrop-blur-xl sm:p-10"
        >
          <h3 className="font-display text-[1.75rem] font-medium tracking-[-0.015em] text-star">{form.title}</h3>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
