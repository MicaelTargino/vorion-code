import { content } from "@/content";
import { Logo } from "@/components/brand/Logo";
import { siteConfig } from "@/lib/site-config";

const ft = content.footer;

export function Footer() {
  const year = new Date().getFullYear();
  const social = siteConfig.social.filter((s) => s.href);
  return (
    <footer className="relative z-10 overflow-hidden border-t border-line bg-deep">
      {/* linha orbital com uma estrela */}
      <svg
        aria-hidden
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-[120px] w-full"
      >
        <path d="M-20 110 C 380 10, 1060 10, 1460 110" fill="none" stroke="url(#ft-g)" strokeWidth="1" />
        <defs>
          <linearGradient id="ft-g" x1="0" x2="1">
            <stop offset="0" stopColor="#926CD8" stopOpacity="0" />
            <stop offset="0.5" stopColor="#8b7cf6" stopOpacity="0.55" />
            <stop offset="1" stopColor="#B497E8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="1012" cy="40.5" r="2" fill="#FFFCF3" />
      </svg>

      <div className="relative mx-auto max-w-[1440px] px-5 pb-10 pt-24 sm:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-5 max-w-[34ch] leading-relaxed text-cosmic">{ft.tagline}</p>
          </div>
          <nav aria-label="Rodapé" className="md:col-span-3">
            <h2 className="text-[0.85rem] font-medium text-star/60">{ft.navTitle}</h2>
            <ul className="mt-4 space-y-2.5">
              {content.nav.items.map((i) => (
                <li key={i.id}>
                  <a href={`#${i.id}`} className="text-star/80 transition-colors hover:text-star">
                    {i.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-2">
            <h2 className="text-[0.85rem] font-medium text-star/60">{ft.contactTitle}</h2>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-4 block break-all text-star/80 transition-colors hover:text-star"
            >
              {siteConfig.email}
            </a>
          </div>
          {social.length > 0 && (
            <div className="md:col-span-2">
              <h2 className="text-[0.85rem] font-medium text-star/60">{ft.socialTitle}</h2>
              <ul className="mt-4 space-y-2.5">
                {social.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-star/80 transition-colors hover:text-star"
                    >
                      {s.label} <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p className="mt-20 font-display text-[clamp(1.6rem,0.6rem+4.2vw,4.5rem)] font-medium leading-none tracking-[-0.03em] text-star/[0.12]">
          {ft.closing}
        </p>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-line pt-6 text-[0.82rem] text-cosmic sm:flex-row">
          <span>
            © {year} Vorion Code. {ft.rights}
          </span>
          <span className="font-mono text-[0.72rem] tracking-[0.14em]">{content.hero.coordinates}</span>
        </div>
      </div>
    </footer>
  );
}
