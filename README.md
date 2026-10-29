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
| `src/content/pt-BR.ts` → `work.projects` | IngressosZ, de Lucas Vilhena (captura real da demo pública), e cases do Micael (telas recriadas com dados fictícios). |
| `src/content/pt-BR.ts` → `team.founders` | Falta a foto (`public/team/pedro.jpg`) e a área de atuação do Pedro. |
| `src/content/pt-BR.ts` → `technologies.categories` | Stack de exemplo. Os sócios precisam confirmar. |
| `src/lib/site-config.ts` | E-mail de contato e links de redes sociais (vazios até os perfis existirem; item com `href` vazio some do rodapé). |
| `src/content/pt-BR.ts` → `hero.coordinates` | Coordenadas decorativas (João Pessoa). Mude se a sede for outra. |
| `form.subtitle` | "Respondemos em até 2 dias úteis." Ajuste para o prazo real. |

Nenhum cliente, depoimento ou número foi inventado.

## Formulário de contato

O site é estático (GitHub Pages), então não há backend próprio. O formulário valida os campos no navegador e:

- **com `NEXT_PUBLIC_FORM_ENDPOINT` definido** (ex.: um formulário do [Formspree](https://formspree.io) ou do [Web3Forms](https://web3forms.com)), envia a mensagem para esse serviço, que repassa por e-mail;
- **sem ele**, abre o app de e-mail do visitante com assunto e corpo prontos para `NEXT_PUBLIC_CONTACT_EMAIL`, e avisa que é só conferir e enviar.

Em produção essas variáveis vêm de **Settings → Secrets and variables → Actions → Variables** do repositório (`CONTACT_EMAIL` e `FORM_ENDPOINT`). O endpoint de formulário é público por natureza; não coloque chaves secretas aqui.

O campo escondido `_gotcha` é o honeypot anti-spam reconhecido pelo Formspree.

## Estrutura

```
src/
  app/                 layout, página, SEO (sitemap, robots, ícone)
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
- **Shaders preparados com `compileAsync` antes do primeiro render.** A paisagem CSS/SVG continua visível durante a preparação; o navegador pode compilar os programas em paralelo quando oferece suporte.
- **Entrada do hero em CSS, não em JS**, porque animações de `opacity`/`transform` rodam no compositor. Assim o texto aparece no tempo certo mesmo se a thread principal estiver ocupada com a GPU. O GSAP cuida do que depende de scroll (afastamento do hero, máscaras de títulos, revelação dos projetos e a órbita do processo).
- **Lenis + GSAP** num único ticker. O Lenis fica desligado em telas de toque e com `prefers-reduced-motion`.
- **Movimento reduzido:** sem parallax, sem scroll-scrub e sem entrada animada. A cena renderiza estática e o processo aparece completo.
- **"Nossa essência" usa Canvas 2D**, não WebGL, para não abrir um segundo contexto de GPU. Também pausa fora da tela.
- Os cards de serviço levam ao formulário com o **tipo de projeto já selecionado**.

## Deploy (GitHub Pages)

`next build` gera o site estático em `out/` (`output: "export"` no `next.config.ts`). O workflow `.github/workflows/deploy.yml` faz o build e publica no GitHub Pages a cada push na `main`.

Antes do build, o workflow executa lint e auditoria das dependências de produção;
alertas moderados ou mais graves interrompem a publicação. O `overrides` no
`package.json` fixa o PostCSS usado pelo Next em 8.5.32 para corrigir os alertas
da versão 8.4.31. Ao atualizar o Next, reavalie esse override. Versione também
os quatro WebP em `public/brand`, pois o workflow usa esses arquivos já preparados.

- Domínio: `public/CNAME` (`vorioncode.com`). O DNS fica na Hostinger:
  - `A` em `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - `CNAME` em `www` → `micaeltargino.github.io`
- Depois que o DNS propagar, marque **Enforce HTTPS** em Settings → Pages.
- Imagem de compartilhamento: `public/og.png` (1200×630).

## Não medido ainda

As metas de Lighthouse (90+ de performance, 95+ de acessibilidade e SEO) não foram medidas. O ambiente de desenvolvimento usa renderização WebGL por software, o que distorce o resultado. Rode o Lighthouse do Chrome numa máquina real, em modo mobile, depois do deploy.


## Identidade visual

A marca oficial fornecida na pasta `../VorionCode` está integrada ao cabeçalho,
rodapé, favicon e imagem de compartilhamento. Os PNGs em `public/brand` são
cópias reduzidas com transparência; os originais foram preservados.

- Roxo oficial: `#926CD8`; branco oficial: `#FFFCF3`.
- Poppins local, pesos 400, 500, 600 e 700, com licença em `src/app/fonts/OFL.txt`.
- Cores e famílias tipográficas: `src/app/globals.css`.
- Componente da marca: `src/components/brand/Logo.tsx`.
- Cabeçalho e rodapé usam cópias WebP da marca, dimensionadas para até 3× a largura exibida; os PNGs continuam disponíveis para preparar os demais materiais.
- `prepare-brand.py` prepara novamente os arquivos web a partir dos originais
  (requer Python com Pillow).
