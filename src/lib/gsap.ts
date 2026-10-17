"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out" });
}

export { gsap, ScrollTrigger };

/** Curvas usadas no site inteiro, equivalentes às do CSS (--ease-cinematic). */
export const EASE = {
  cinematic: "expo.out",
  soft: "power2.inOut",
};
