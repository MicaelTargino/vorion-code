export const siteConfig = {
  name: "Vorion Code",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vorioncode.com",
  // PLACEHOLDER: troque pelo e-mail real assim que o domínio estiver configurado.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contato@vorioncode.com",
  // PLACEHOLDER: links das redes sociais. Deixe `href` vazio para esconder o item.
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/vorion-code" },
    { label: "GitHub", href: "https://github.com/vorion-code" },
    { label: "Instagram", href: "https://www.instagram.com/vorioncode" },
  ],
};
