"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { scrollToId } from "@/lib/scroll";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans text-[0.95rem] font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-[var(--ease-cinematic)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "h-12 px-6 bg-star text-deep shadow-[0_0_0_1px_rgba(255,255,255,0.6)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.9),0_10px_40px_-8px_rgba(146,108,216,0.75),0_6px_30px_-10px_rgba(180,151,232,0.7)]",
  secondary:
    "h-12 px-6 border border-line-strong bg-white/[0.02] text-star backdrop-blur-sm hover:border-white/30 hover:bg-white/[0.06]",
  ghost: "h-10 px-4 text-star/90 hover:text-star hover:bg-white/[0.05]",
};

type Common = { variant?: Variant; children: ReactNode; className?: string };

/** Link de âncora: rola suavemente até a seção (`#id`) em vez de pular. */
export function ButtonLink({
  variant = "primary",
  className = "",
  href = "#",
  onClick,
  children,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (href.startsWith("#") && href.length > 1) {
      e.preventDefault();
      scrollToId(href.slice(1));
    }
  };
  return (
    <a href={href} onClick={handle} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
