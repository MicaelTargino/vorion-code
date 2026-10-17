/**
 * Estado compartilhado entre o DOM (scroll, ponteiro, entrada) e a cena 3D.
 * É um objeto mutável de propósito: a cena lê a cada frame sem re-renderizar React.
 */
export const sceneState = {
  /** 0 → 1 enquanto o hero sai da tela */
  heroProgress: 0,
  /** 0 → 1 enquanto o CTA final entra na tela */
  ctaProgress: 0,
  /** ponteiro normalizado em -1..1 (já suavizado pela cena) */
  pointer: { x: 0, y: 0 },
  /** 0 → 1 na entrada: o horizonte acende */
  reveal: 0,
  /** desliga parallax e scroll-scrub */
  reducedMotion: false,
};

export type Quality = "high" | "low";

export function detectQuality(): Quality {
  if (typeof window === "undefined") return "high";
  // permite forçar pela URL para testes: ?quality=low | ?quality=high
  const forced = new URLSearchParams(window.location.search).get("quality");
  if (forced === "low" || forced === "high") return forced;
  const small = window.matchMedia("(max-width: 820px)").matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return small || cores <= 4 || saveData ? "low" : "high";
}

export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
