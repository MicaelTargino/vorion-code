import { NextResponse } from "next/server";
import { LIMITS, validateContact, type ContactPayload } from "@/lib/contact";

/**
 * Recebe o formulário de contato e envia por e-mail via Resend (https://resend.com).
 *
 * Variáveis de ambiente (só no servidor, nunca com prefixo NEXT_PUBLIC_):
 *   RESEND_API_KEY      chave da API do Resend
 *   CONTACT_TO_EMAIL    quem recebe as mensagens
 *   CONTACT_FROM_EMAIL  remetente verificado no Resend (ex.: "Vorion Code <site@vorioncode.com>")
 *
 * Sem configuração: em desenvolvimento responde `delivered: false` (o formulário
 * avisa que nada foi entregue); em produção responde 503.
 */

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const clean: ContactPayload = {
    name: String(body.name ?? "")
      .trim()
      .slice(0, LIMITS.name),
    email: String(body.email ?? "")
      .trim()
      .slice(0, LIMITS.email),
    company: String(body.company ?? "")
      .trim()
      .slice(0, LIMITS.company),
    projectType: String(body.projectType ?? "")
      .trim()
      .slice(0, LIMITS.projectType),
    message: String(body.message ?? "")
      .trim()
      .slice(0, LIMITS.message),
  };

  // honeypot preenchido: finge sucesso para não ensinar o bot
  if (body.website) return NextResponse.json({ ok: true, delivered: true });

  const errors = validateContact(clean);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "validation", fields: Object.keys(errors) }, { status: 422 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Vorion Code <onboarding@resend.dev>";

  if (!apiKey || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] envio não configurado; mensagem NÃO entregue:", clean);
      return NextResponse.json({ ok: true, delivered: false });
    }
    console.error("[contact] RESEND_API_KEY/CONTACT_TO_EMAIL ausentes em produção");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const html = `
    <h2>Novo contato pelo site</h2>
    <p><strong>Nome:</strong> ${esc(clean.name)}</p>
    <p><strong>E-mail:</strong> ${esc(clean.email)}</p>
    <p><strong>Empresa:</strong> ${esc(clean.company || "—")}</p>
    <p><strong>Tipo de projeto:</strong> ${esc(clean.projectType)}</p>
    <p><strong>Mensagem:</strong></p>
    <p style="white-space:pre-wrap">${esc(clean.message)}</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: clean.email,
        subject: `[Site] ${clean.projectType} — ${clean.name}`,
        html,
      }),
    });
    if (!res.ok) {
      console.error("[contact] Resend respondeu", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ ok: false, error: "provider_error" }, { status: 502 });
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] falha de rede ao chamar o Resend", err);
    return NextResponse.json({ ok: false, error: "provider_unreachable" }, { status: 502 });
  }
}
