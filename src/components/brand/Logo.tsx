import Image from "next/image";

type LogoProps = {
  variant?: "full" | "mark";
  tone?: "gradient" | "mono";
  className?: string;
  title?: string;
  compactWordmark?: boolean;
};

/** Official artwork supplied in the VorionCode identity folder. */
export function LogoMark({ tone = "gradient", className, title }: Omit<LogoProps, "variant">) {
  return (
    <Image
      src={tone === "mono" ? "/brand/mark-white.png" : "/brand/mark-dimensional.png"}
      width={256} height={178} alt={title ?? ""}
      aria-hidden={title ? undefined : true}
      className={`object-contain ${className ?? ""}`}
    />
  );
}

export function Logo({ variant = "full", tone = "gradient", className, title = "Vorion Code", compactWordmark = false }: LogoProps) {
  if (variant === "mark") return <LogoMark tone={tone} className={className} title={title} />;
  return (
    <span role="img" aria-label={title} className={`inline-flex shrink-0 items-center gap-3 ${className ?? ""}`}>
      <LogoMark tone={tone} className={compactWordmark ? "h-9 w-[52px] shrink-0 sm:h-10 sm:w-[60px]" : "h-10 w-14 shrink-0 sm:h-11 sm:w-16"} />
      <Image src="/brand/wordmark-white.png" width={140} height={78} alt="" aria-hidden className={compactWordmark ? "h-auto w-16 sm:w-[72px]" : "h-auto w-[88px] sm:w-[96px]"} priority />
    </span>
  );
}
