"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AlertCircle, Check, Loader2, Mail } from "lucide-react";
import { content } from "@/content";
import { Button } from "@/components/ui/Button";
import { LIMITS, SELECT_EVENT, validateContact, type ContactErrors } from "@/lib/contact";
import { siteConfig } from "@/lib/site-config";

const f = content.form;

type Status = "idle" | "submitting" | "success" | "mailto" | "error";

// Site estático (GitHub Pages): sem backend próprio. Com NEXT_PUBLIC_FORM_ENDPOINT
// (Formspree, Web3Forms, etc.) o formulário envia para lá; sem ele, abre o app de
// e-mail do visitante com a mensagem pronta para o endereço de contato.
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

function mailtoHref(d: Record<string, string>) {
  const subject = `[Site] ${d.projectType} — ${d.name}`;
  const body = [
    `Nome: ${d.name}`,
    `E-mail: ${d.email}`,
    d.company ? `Empresa: ${d.company}` : null,
    `Tipo de projeto: ${d.projectType}`,
    "",
    d.message,
  ]
    .filter((l) => l !== null)
    .join("\n");
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const fieldBase =
  "w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[0.98rem] text-star placeholder:text-cosmic outline-none transition-[border-color,background-color,box-shadow] duration-300 focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(146,108,216,0.18)]";

export function ContactForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [projectType, setProjectType] = useState("");

  // cards de serviço pré-selecionam o tipo de projeto
  useEffect(() => {
    const onSelect = (e: Event) => {
      const type = (e as CustomEvent<string>).detail;
      if (f.projectTypes.includes(type)) setProjectType(type);
    };
    window.addEventListener(SELECT_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_EVENT, onSelect);
  }, []);

  const id = (name: string) => `${uid}-${name}`;
  const border = (bad?: boolean) => (bad ? "border-rose-400/60" : "border-line-strong focus:border-white/35");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const found = validateContact(data);
    setErrors(found);
    setServerError(null);
    if (Object.keys(found).length) {
      const first = (["name", "email", "projectType", "message"] as const).find((k) => found[k]);
      if (first) (formRef.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    // honeypot preenchido: finge sucesso para não ensinar o bot
    if (data._gotcha) {
      setStatus("success");
      return;
    }

    if (!FORM_ENDPOINT) {
      window.location.href = mailtoHref(data);
      setStatus("mailto");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, _subject: `[Site] ${data.projectType} — ${data.name}` }),
      });
      if (res.ok) {
        setStatus("success");
        formRef.current?.reset();
        setProjectType("");
      } else {
        setStatus("error");
        setServerError(f.errors.generic);
      }
    } catch {
      setStatus("error");
      setServerError(f.errors.network);
    }
  }

  if (status === "success" || status === "mailto") {
    const dev = status === "mailto";
    return (
      <div role="status" className="flex flex-col items-start gap-4 py-6">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full ${
            dev ? "bg-violet-400/15 text-violet-200" : "bg-emerald-400/15 text-emerald-300"
          }`}
        >
          {dev ? <Mail size={20} aria-hidden /> : <Check size={20} aria-hidden />}
        </span>
        <h3 className="font-display text-[1.6rem] font-medium text-star">{dev ? f.mailto.title : f.success.title}</h3>
        <p className="max-w-[48ch] leading-relaxed text-cosmic">
          {dev ? (
            <>
              {f.mailto.copy}{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-star underline underline-offset-4">
                {siteConfig.email}
              </a>
              .
            </>
          ) : (
            f.success.copy
          )}
        </p>
        <Button variant="secondary" onClick={() => setStatus("idle")} className="mt-2">
          {f.success.again}
        </Button>
      </div>
    );
  }

  const errorText = (key: keyof ContactErrors) =>
    errors[key] ? (
      <p id={id(`${key}-err`)} className="mt-2 text-[0.85rem] text-rose-300">
        {f.errors[key]}
      </p>
    ) : null;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={serverError ? id("server-err") : undefined}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id("name")} className="mb-2 block text-[0.85rem] font-medium text-star/80">
            {f.fields.name.label}
          </label>
          <input
            id={id("name")}
            name="name"
            autoComplete="name"
            maxLength={LIMITS.name}
            placeholder={f.fields.name.placeholder}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? id("name-err") : undefined}
            className={`${fieldBase} ${border(errors.name)}`}
          />
          {errorText("name")}
        </div>
        <div>
          <label htmlFor={id("email")} className="mb-2 block text-[0.85rem] font-medium text-star/80">
            {f.fields.email.label}
          </label>
          <input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={LIMITS.email}
            placeholder={f.fields.email.placeholder}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? id("email-err") : undefined}
            className={`${fieldBase} ${border(errors.email)}`}
          />
          {errorText("email")}
        </div>
        <div>
          <label htmlFor={id("company")} className="mb-2 block text-[0.85rem] font-medium text-star/80">
            {f.fields.company.label}
          </label>
          <input
            id={id("company")}
            name="company"
            autoComplete="organization"
            maxLength={LIMITS.company}
            placeholder={f.fields.company.placeholder}
            className={`${fieldBase} ${border()}`}
          />
        </div>
        <div>
          <label htmlFor={id("projectType")} className="mb-2 block text-[0.85rem] font-medium text-star/80">
            {f.fields.projectType.label}
          </label>
          <select
            id={id("projectType")}
            name="projectType"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            aria-invalid={!!errors.projectType}
            aria-describedby={errors.projectType ? id("projectType-err") : undefined}
            className={`${fieldBase} ${border(errors.projectType)} appearance-none bg-[url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'><path d='M1 1.5 6 6.5 11 1.5' stroke='%239CA3AF' stroke-width='1.5'/></svg>")] bg-[length:12px_8px] bg-[position:right_1rem_center] bg-no-repeat pr-10 ${
              projectType ? "" : "text-cosmic"
            }`}
          >
            <option value="" disabled className="bg-surface text-cosmic">
              {f.fields.projectType.placeholder}
            </option>
            {f.projectTypes.map((t) => (
              <option key={t} value={t} className="bg-surface text-star">
                {t}
              </option>
            ))}
          </select>
          {errorText("projectType")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={id("message")} className="mb-2 block text-[0.85rem] font-medium text-star/80">
            {f.fields.message.label}
          </label>
          <textarea
            id={id("message")}
            name="message"
            rows={5}
            maxLength={LIMITS.message}
            placeholder={f.fields.message.placeholder}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? id("message-err") : undefined}
            className={`${fieldBase} ${border(errors.message)} resize-y`}
          />
          {errorText("message")}
        </div>
      </div>

      {/* honeypot anti-spam: escondido de pessoas e de leitores de tela */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>Website</label>
        <input id={id("website")} name="_gotcha" tabIndex={-1} autoComplete="off" />
      </div>

      {serverError && (
        <p id={id("server-err")} role="alert" className="mt-6 flex items-start gap-2 text-[0.92rem] text-rose-300">
          <AlertCircle size={17} aria-hidden className="mt-0.5 shrink-0" />
          <span>
            {serverError}{" "}
            <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-4">
              {siteConfig.email}
            </a>
          </span>
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[0.85rem] text-cosmic">{f.subtitle}</p>
        <Button type="submit" disabled={status === "submitting"} aria-live="polite">
          {status === "submitting" ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden /> {f.submitting}
            </>
          ) : (
            f.submit
          )}
        </Button>
      </div>
    </form>
  );
}
