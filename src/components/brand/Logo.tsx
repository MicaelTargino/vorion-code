import { useId } from "react";

type LogoProps = {
  /** "full" = símbolo + nome, "mark" = só o símbolo */
  variant?: "full" | "mark";
  /** "gradient" usa o gradiente da marca; "mono" usa currentColor */
  tone?: "gradient" | "mono";
  className?: string;
  title?: string;
};

/**
 * Símbolo da Vorion Code reconstruído em SVG: um V cortado por um anel orbital
 * inclinado, com uma estrela de quatro pontas no alto do anel.
 * PLACEHOLDER: se existir um vetor oficial do logo, substitua os paths abaixo.
 */
export function LogoMark({ tone = "gradient", className, title }: Omit<LogoProps, "variant">) {
  const id = useId().replace(/:/g, "");
  const stroke = tone === "gradient" ? `url(#vg-${id})` : "currentColor";
  const fill = tone === "gradient" ? "#F8FAFC" : "currentColor";
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {tone === "gradient" && (
        <defs>
          <linearGradient id={`vg-${id}`} x1="6" y1="8" x2="42" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#7C3AED" />
            <stop offset="1" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      )}
      {/* parte de trás do anel (passa atrás do V) */}
      <path
        d="M8.2 30.4C4.9 26.6 9.6 20.4 18.7 16.9c9.1-3.5 18.2-3 21.1.8"
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* V */}
      <path
        d="M11 11.5 24 37.5 37 11.5"
        fill="none"
        stroke={stroke}
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* parte da frente do anel (passa na frente do V) */}
      <path
        d="M39.8 17.7c2.4 3.9-2.6 9.6-11.2 12.9-8.9 3.4-17.4 3.1-20.4-.2"
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* estrela */}
      <path
        d="M39.6 6.2c.3 1.9.9 2.5 2.8 2.8-1.9.3-2.5.9-2.8 2.8-.3-1.9-.9-2.5-2.8-2.8 1.9-.3 2.5-.9 2.8-2.8Z"
        fill={fill}
      />
    </svg>
  );
}

export function Logo({ variant = "full", tone = "gradient", className, title = "Vorion Code" }: LogoProps) {
  if (variant === "mark") return <LogoMark tone={tone} className={className} title={title} />;
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark tone={tone} className="h-8 w-8 shrink-0" />
      <span className="font-display text-[1.05rem] font-semibold tracking-[0.18em] text-star">
        VORION<span className="ml-[0.35em] font-normal text-cosmic">CODE</span>
      </span>
      <span className="sr-only">{title}</span>
    </span>
  );
}
