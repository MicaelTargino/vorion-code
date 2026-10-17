/** Validação do formulário de contato (o site é estático; o envio é feito no cliente). */

export type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  message: string;
  /** honeypot: humanos não preenchem */
  _gotcha?: string;
};

export type ContactErrors = Partial<Record<"name" | "email" | "projectType" | "message", true>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = { name: 120, email: 200, company: 160, projectType: 80, message: 4000 };

export function validateContact(p: Partial<ContactPayload>): ContactErrors {
  const errors: ContactErrors = {};
  if (!p.name || p.name.trim().length < 2 || p.name.length > LIMITS.name) errors.name = true;
  if (!p.email || !EMAIL.test(p.email.trim()) || p.email.length > LIMITS.email) errors.email = true;
  if (!p.projectType || p.projectType.length > LIMITS.projectType) errors.projectType = true;
  if (!p.message || p.message.trim().length < 20 || p.message.length > LIMITS.message) errors.message = true;
  return errors;
}

/** Pré-seleciona o tipo de projeto no formulário (ex.: clique num card de serviço). */
export const SELECT_EVENT = "vorion:select-project-type";
export function selectProjectType(type: string) {
  window.dispatchEvent(new CustomEvent(SELECT_EVENT, { detail: type }));
}
