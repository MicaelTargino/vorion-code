"use client";

import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Rola até uma seção usando o Lenis quando ele existe; senão, rolagem nativa. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis) {
    lenis.scrollTo(el, { offset: id === "inicio" ? 0 : -8, duration: reduced ? 0 : 1.6 });
  } else {
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }
  history.replaceState(null, "", id === "inicio" ? window.location.pathname : `#${id}`);
}
