"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { content } from "@/content";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { scrollToId } from "@/lib/scroll";

const nav = content.nav;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("inicio");
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // seção ativa: a que cruza a faixa central da tela
  useEffect(() => {
    const ids = [...nav.items.map((i) => i.id), "contato"];
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // menu móvel: Esc fecha, scroll da página travado enquanto aberto
  useEffect(() => {
    if (!open) return;
    const menuLinks = () => Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
    const focusMenu = () => menuLinks()[0]?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const controls = [toggleRef.current, ...menuLinks()].filter((el): el is HTMLButtonElement | HTMLAnchorElement => !!el);
        const index = controls.findIndex((el) => el === document.activeElement);
        if (index === -1 || (e.shiftKey && index === 0) || (!e.shiftKey && index === controls.length - 1)) {
          e.preventDefault();
          controls[e.shiftKey ? controls.length - 1 : 0]?.focus();
        }
      }
    };
    const onFocus = (e: FocusEvent) => {
      if (e.target !== toggleRef.current && !menuRef.current?.contains(e.target as Node)) focusMenu();
    };
    const background = Array.from(document.querySelectorAll<HTMLElement>("main, footer"));
    const previousInert = background.map((el) => el.inert);
    background.forEach((el) => { el.inert = true; });
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocus);
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    focusMenu();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocus);
      background.forEach((el, i) => { el.inert = previousInert[i]; });
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // espera o menu fechar antes de rolar, para o scroll não brigar com o overlay
    window.setTimeout(() => scrollToId(id), open ? 280 : 0);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease-cinematic)] ${
          scrolled || open
            ? "border-b border-line bg-[rgba(8,8,16,0.72)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-star focus:px-4 focus:py-2 focus:text-deep"
        >
          {nav.skipToContent}
        </a>
        <div className="mx-auto flex h-[var(--nav-h)] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <a href="#inicio" onClick={go("inicio")} aria-label="Vorion Code, voltar ao início" className="shrink-0 rounded-md">
            <Logo compactWordmark />
          </a>

          <nav aria-label="Principal" className="hidden shrink-0 lg:block">
            <ul className="flex items-center gap-1">
              {nav.items.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={go(item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative inline-flex items-center whitespace-nowrap rounded-full px-3.5 py-2 text-[0.9rem] transition-colors duration-300 ${
                        isActive ? "text-star" : "text-cosmic hover:text-star"
                      }`}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={`absolute bottom-0.5 left-1/2 h-px w-4 -translate-x-1/2 bg-gradient-to-r from-nebula to-orion transition-opacity duration-300 ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden sm:inline-flex">
              <ButtonLink href="#contato" onClick={go("contato")} variant="secondary" className="!h-10 !px-5 text-[0.88rem]">
                {nav.cta}
              </ButtonLink>
            </span>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="menu-movel"
              aria-label={open ? nav.closeMenu : nav.openMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-star lg:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>
      {/* fora do <header>: o backdrop-filter dele viraria o "containing block" deste overlay fixo */}
      <AnimatePresence>
        {open && (
          <motion.nav
            ref={menuRef}
            id="menu-movel"
            aria-label="Menu"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 top-[var(--nav-h)] z-40 overflow-y-auto overscroll-contain bg-[rgba(5,5,12,0.96)] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col">
              {[...nav.items, { id: "contato", label: "Contato" }].map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i + 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-line"
                >
                  <a
                    href={`#${item.id}`}
                    onClick={go(item.id)}
                    aria-current={active === item.id ? "true" : undefined}
                    className="flex items-baseline justify-between py-5 font-display text-[2rem] font-medium tracking-[-0.02em] text-star"
                  >
                    {item.label}
                    <span className="font-mono text-xs text-cosmic">{String(i + 1).padStart(2, "0")}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
