import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { content } from "@/content";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const poppins = localFont({
  src: [
    { path: "./fonts/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: content.meta.title,
  description: content.meta.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: siteConfig.name,
    title: content.meta.title,
    description: content.meta.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: content.meta.ogAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: content.meta.title,
    description: content.meta.description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05050c",
  colorScheme: "dark",
  viewportFit: "cover",
};

// Adiciona `js-anim` antes da primeira pintura para que a entrada do hero comece
// do escuro, sem piscar. Sem JS (ou com movimento reduzido), nada fica escondido.
const animBootstrap = `(function(){try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-anim')}}catch(e){}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/brand/mark-dimensional.png`,
  email: siteConfig.email,
  slogan: "Ideias em órbita. Soluções em escala.",
  description: content.meta.description,
  areaServed: "BR",
  sameAs: siteConfig.social.map((s) => s.href).filter(Boolean),
  founder: content.team.founders.map((f) => ({ "@type": "Person", name: f.name, sameAs: f.links.map((l) => l.href) })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: animBootstrap }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
