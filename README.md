# Vorion Code — landing page

Site institucional da Vorion Code. Next.js (App Router) + TypeScript + Tailwind CSS v4, com uma cena 3D em React Three Fiber atrás do hero e do CTA final.

## Rodar

```bash
npm install
cp .env.example .env.local   # opcional em desenvolvimento
npm run dev                  # http://localhost:3000
npm run build && npm start   # produção local
```

Para testar a versão leve da cena (a mesma dos celulares): `http://localhost:3000/?quality=low`.

## O que ainda é provisório

Tudo abaixo está marcado no código com `PLACEHOLDER` ou `placeholder: true`:

| Onde | O quê |
|---|---|
| `src/content/pt-BR.ts` → `work.projects` | Os 3 projetos são **demonstrativos** e aparecem com o selo "Projeto demonstrativo". Troque por cases reais (com autorização do cliente) e mude `placeholder` para `false`. Sem isso, o botão "Ver projeto" não aparece. |
| `src/content/pt-BR.ts` → `technologies.categories` | Stack de exemplo. Os sócios precisam confirmar. |
| `src/lib/site-config.ts` | E-mail de contato e links de redes sociais. Item com `href` vazio some do rodapé. |
| `src/components/brand/Logo.tsx` | Logo reconstruído em SVG (V + anel orbital + estrela). Se houver o vetor oficial, substitua os paths. O mesmo desenho está em `src/app/icon.svg`. |
| `src/content/pt-BR.ts` → `hero.coordinates` | Coordenadas decorativas (João Pessoa). Mude se a sede for outra. |
| `form.subtitle` | "Respondemos em até 2 dias úteis." Ajuste para o prazo real. |

Nenhum cliente, depoimento ou número foi inventado.

## Formulário de contato

`POST /api/contact` valida os dados, filtra bots (honeypot + limite de 5 envios por IP a cada 10 min) e envia o e-mail pelo [Resend](https://resend.com).

1. Crie uma conta no Resend e verifique o domínio `vorioncode.com`.
2. Defina `RESEND_API_KEY`, `CONTACT_TO_EMAIL` e `CONTACT_FROM_EMAIL` no servidor (na Vercel: Settings → Environment Variables).

Sem essas variáveis, o site **não finge** que enviou nada:
- em desenvolvimento, o formulário mostra "Modo de desenvolvimento: a mensagem não foi entregue";
- em produção, a API responde 503 e o formulário mostra o erro com o e-mail de contato como alternativa.

O limite por IP fica em memória. Em serverless ele vale por instância, o que basta para um site institucional. Se aparecer spam de verdade, troque por Upstash/Redis ou ative o Turnstile.

## Estrutura

```
src/
  app/                 layout, página, SEO (sitemap, robots, OG image, ícone), /api/contact
  content/pt-BR.ts     todo o texto do site (pronto para um en.ts com o mesmo formato)
  lib/                 config do site, GSAP, scroll (Lenis), estado da cena, validação do contato
  components/
    brand/Logo.tsx
    layout/            Nav, Footer, SmoothScroll
    sections/          Hero, Expertise, Work, Process, Mindset, Technologies, FinalCta, ContactForm
    three/             CosmicCanvas (camada fixa), CosmicScene (Canvas R3F), Starfield, Planet,
                       Terrain, OrbitalParticles, CameraRig, SceneLighting, ScrollSceneController,
                       SceneFallback, shaders/noise.ts
    visuals/NodeField  rede de nós da seção "Nossa essência" (Canvas 2D)
```

## Decisões técnicas

- **Um único canvas WebGL**, fixo atrás da página. Ele aparece no hero e volta no CTA final como um segundo "destino" (câmera baixa, planeta nascendo atrás das montanhas). As seções do meio têm fundo sólido, e o loop de render fica **pausado** (`frameloop="never"`) enquanto o hero e o CTA estão fora da tela.
- **Tudo é shader próprio, sem texturas nem modelos.** O céu (estrelas esparsas, halo e uma nebulosa contida) é uma esfera; o planeta tem bandas de nuvens em ruído e uma casca de atmosfera aditiva; as cordilheiras são planos com a silhueta calculada no shader, em 4 camadas com névoa nos vales. O brilho vem dos shaders, sem pós-processamento de bloom.
- **Qualidade adaptativa.** Telas estreitas, 4 núcleos ou menos e `saveData` usam a versão leve: menos oitavas de ruído, menos partículas, DPR ≤ 1,25 e sem antialias. O `PerformanceMonitor` derruba o DPR se a taxa de quadros cair.
- **O site funciona sem WebGL.** `SceneFallback` desenha a mesma paisagem em CSS e SVG. Ela aparece imediatamente e fica por baixo do canvas, que só entra com fade depois do primeiro frame. Sem WebGL, a cena estática é a definitiva. A página nunca fica em branco.
- **WebGL montado no `requestIdleCallback`**, para que a compilação dos shaders não dispute a thread principal com a hidratação.
- **Entrada do hero em CSS, não em JS**, porque animações de `opacity`/`transform` rodam no compositor. Assim o texto aparece no tempo certo mesmo se a thread principal estiver ocupada com a GPU. O GSAP cuida do que depende de scroll (afastamento do hero, máscaras de títulos, revelação dos projetos e a órbita do processo).
- **Lenis + GSAP** num único ticker. O Lenis fica desligado em telas de toque e com `prefers-reduced-motion`.
- **Movimento reduzido:** sem parallax, sem scroll-scrub e sem entrada animada. A cena renderiza estática e o processo aparece completo.
- **"Nossa essência" usa Canvas 2D**, não WebGL, para não abrir um segundo contexto de GPU. Também pausa fora da tela.
- Os cards de serviço levam ao formulário com o **tipo de projeto já selecionado**.

## Deploy

O caminho mais simples é a **Vercel**:

1. Suba o repositório no GitHub e importe na Vercel (framework detectado automaticamente).
2. Configure as variáveis do `.env.example`.
3. Em Domains, adicione `vorioncode.com` e `www.vorioncode.com` e aponte o DNS conforme as instruções.

Funciona também em qualquer Node 20+ (`npm run build && npm start`) atrás de um proxy (Nginx/Caddy).

## Não medido ainda

As metas de Lighthouse (90+ de performance, 95+ de acessibilidade e SEO) não foram medidas. O ambiente de desenvolvimento usa renderização WebGL por software, o que distorce o resultado. Rode o Lighthouse do Chrome numa máquina real, em modo mobile, depois do deploy.
