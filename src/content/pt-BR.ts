/**
 * Todo o texto do site fica aqui. Para lançar em inglês, crie `en.ts` com o
 * mesmo formato (`SiteContent`) e escolha o dicionário em `src/content/index.ts`.
 *
 * Itens marcados com `placeholder: true` ou comentários `PLACEHOLDER` são
 * conteúdo provisório e precisam ser substituídos pelos fundadores.
 */

export type ServiceIcon = "code" | "layers" | "smartphone" | "sparkles" | "cloud" | "pen";

export type Project = {
  slug: string;
  name: string;
  kind: string;
  problem: string;
  solution: string;
  stack: string[];
  /** true enquanto for um projeto demonstrativo, não um case real */
  placeholder: boolean;
  /** prévia em SVG usada quando não há imagem real */
  preview?: "dashboard" | "agent" | "mobile";
  /** screenshot real (em /public) */
  image?: string;
  /** quem do time liderou e onde */
  by?: string;
  /** link para o case completo */
  href?: string;
};

export type Founder = {
  name: string;
  role: string;
  focus?: string;
  photo?: string;
  initials: string;
  links: { label: "Site" | "LinkedIn" | "GitHub" | "Upwork"; href: string }[];
};

export const ptBR = {
  locale: "pt-BR",
  meta: {
    title: "Vorion Code — Engenharia de software para ideias que vão além",
    description:
      "Estúdio brasileiro de engenharia de software. Criamos produtos SaaS, sistemas inteligentes com IA, aplicações web e mobile e arquiteturas que escalam.",
    ogAlt: "Vorion Code — Ideias em órbita. Soluções em escala.",
  },
  nav: {
    items: [
      { id: "inicio", label: "Início" },
      { id: "solucoes", label: "Soluções" },
      { id: "projetos", label: "Projetos" },
      { id: "processo", label: "Processo" },
      { id: "sobre", label: "Sobre" },
      { id: "time", label: "Time" },
    ],
    cta: "Vamos conversar ↗",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    skipToContent: "Pular para o conteúdo",
  },
  hero: {
    eyebrow: "VORION CODE / SOFTWARE ENGINEERING STUDIO",
    headline: "Engenharia para o que vem além.",
    copy: "Criamos produtos digitais, sistemas inteligentes e soluções escaláveis para transformar grandes ideias em tecnologia real.",
    primaryCta: "Iniciar um projeto →",
    secondaryCta: "Explorar soluções ↗",
    label: "IDEIAS EM ÓRBITA · SOLUÇÕES EM ESCALA",
    scroll: "Role para explorar",
    coordinates: "07°06′S 34°51′W",
  },
  expertise: {
    eyebrow: "01 / O QUE FAZEMOS",
    headline: "Tecnologia complexa. Experiências simples.",
    copy: "Da primeira linha de código à arquitetura de sistemas escaláveis, construímos tecnologia preparada para evoluir.",
    services: [
      {
        n: "01",
        title: "Software sob medida",
        copy: "Sistemas projetados para resolver desafios específicos do seu negócio.",
        icon: "code" as ServiceIcon,
      },
      {
        n: "02",
        title: "Produtos SaaS",
        copy: "Plataformas digitais robustas, escaláveis e preparadas para crescer.",
        icon: "layers" as ServiceIcon,
      },
      {
        n: "03",
        title: "Web & Mobile",
        copy: "Aplicações modernas com interfaces intuitivas e alta performance.",
        icon: "smartphone" as ServiceIcon,
      },
      {
        n: "04",
        title: "Inteligência Artificial",
        copy: "Soluções inteligentes, automações e integrações com IA.",
        icon: "sparkles" as ServiceIcon,
      },
      {
        n: "05",
        title: "Cloud & Architecture",
        copy: "Arquiteturas confiáveis, infraestrutura moderna e engenharia escalável.",
        icon: "cloud" as ServiceIcon,
      },
      {
        n: "06",
        title: "UI/UX Engineering",
        copy: "Experiências digitais que equilibram estética, usabilidade e tecnologia.",
        icon: "pen" as ServiceIcon,
      },
    ],
    cardCta: "Conversar sobre isso",
  },
  work: {
    eyebrow: "02 / PROJETOS",
    headline: "Construído para fazer a diferença.",
    intro:
      "A Vorion é nova, mas o time não. Estes são sistemas que os sócios lideraram antes do estúdio, em produção. As telas foram recriadas com dados fictícios.",
    placeholderBadge: "Projeto demonstrativo",
    placeholderNote: "Exemplo ilustrativo de layout. Substituir por um case real antes de publicar.",
    problemLabel: "Desafio",
    solutionLabel: "Solução",
    cta: "Ver case completo ↗",
    ctaDisabled: "Case em breve",
    fictitious: "Dados fictícios",
    projects: [
      {
        slug: "01-adserver",
        name: "Ad server próprio",
        kind: "Ad tech · SaaS",
        problem:
          "Uma empresa de mídia dependia de um ad server de terceiros para entregar e medir campanhas de display e vídeo.",
        solution:
          "Ad server multi-tenant feito do zero: tags JavaScript, SDKs Android e iOS, vídeo VAST, filtro de tráfego inválido e relatórios sobre BigQuery. A decisão de anúncio leva ~5 ms no servidor.",
        stack: ["Laravel", "FastAPI", "BigQuery", "Kotlin", "Swift"],
        placeholder: false,
        image: "/work/01-adserver.jpg",
        by: "Micael Targino · Metrike",
        href: "https://micaeltargino.com/#01-adserver",
      },
      {
        slug: "02-faturadoc",
        name: "FaturaDoc",
        kind: "Compliance · SaaS",
        problem:
          "Pagamentos a fornecedores travavam na conferência manual de notas e certidões fiscais e trabalhistas.",
        solution:
          "Produto que lê PDFs escaneados por OCR, consulta as certidões nos órgãos do governo e gera um parecer de risco com IA antes de liberar o pagamento.",
        stack: ["FastAPI", "Celery", "PostgreSQL", "React", "Gemini"],
        placeholder: false,
        image: "/work/02-faturadoc.jpg",
        by: "Micael Targino · Metrike",
        href: "https://micaeltargino.com/#02-faturadoc",
      },
      {
        slug: "03-media-plan-agent",
        name: "Do plano de mídia à campanha no ar",
        kind: "IA · Automação",
        problem:
          "Planos de mídia chegavam em planilhas de formatos diferentes e cada campanha levava horas para ser montada à mão.",
        solution:
          "Um agente de IA converte qualquer planilha no padrão interno, e uma automação sobe a campanha inteira no ad server externo. O processo passou a levar 83% menos tempo.",
        stack: ["Claude", "Laravel", "Filas", "APIs REST"],
        placeholder: false,
        image: "/work/03-media-plan-agent.jpg",
        by: "Micael Targino · Metrike",
        href: "https://micaeltargino.com/#03-media-plan-agent",
      },
      {
        slug: "04-mrf-fixed-income",
        name: "Plataforma de renda fixa",
        kind: "Fintech · SaaS",
        problem:
          "Investidores de debêntures precisavam de preços atualizados e de cálculos de rentabilidade que respeitem dias úteis, inflação e amortização.",
        solution:
          "Plataforma completa com coleta contínua de dados de mercado, carteira atualizada ao vivo, calculadora de TIR e cronograma de pagamentos.",
        stack: ["Next.js", "FastAPI", "Airflow", "Redis", "GCP"],
        placeholder: false,
        image: "/work/04-mrf-fixed-income.jpg",
        by: "Micael Targino · freelance para MRF",
        href: "https://micaeltargino.com/#04-mrf-fixed-income",
      },
      {
        slug: "05-data-pipelines",
        name: "Pipelines e data warehouse",
        kind: "Engenharia de dados",
        problem: "Um ETL levava 16 horas para rodar e relatórios demoravam minutos para abrir.",
        solution:
          "ETL reescrito em Airflow (16 h → 1 h) e consultas migradas para BigQuery: relatórios de ~190 s para ~2 s e dashboards de ~30 s para ~5 s.",
        stack: ["Airflow", "BigQuery", "Airbyte", "Python", "SQL"],
        placeholder: false,
        image: "/work/05-data-pipelines.jpg",
        by: "Micael Targino · Metrike e SnapMagic (YC S15)",
        href: "https://micaeltargino.com/#05-data-pipelines",
      },
    ] satisfies Project[],
  },
  team: {
    eyebrow: "06 / TIME",
    headline: "Quem constrói a Vorion.",
    copy: "Um time pequeno de engenheiros que escreve o código, cuida da arquitetura e acompanha o produto depois do lançamento.",
    founders: [
      {
        name: "Micael Targino",
        role: "Sócio-fundador",
        focus: "Backend, dados e IA",
        photo: "/team/micael.jpg",
        initials: "MT",
        links: [
          { label: "Site", href: "https://micaeltargino.com/" },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/micaeltargino" },
          { label: "Upwork", href: "https://www.upwork.com/freelancers/~018675ba46f6a9f793" },
        ],
      },
      {
        name: "Lucas Vilhena",
        role: "Sócio-fundador",
        focus: "Full-stack",
        photo: "/team/lucas.jpg",
        initials: "LV",
        links: [
          { label: "LinkedIn", href: "https://www.linkedin.com/in/lucas-vilhena-9176a128b/" },
          { label: "GitHub", href: "https://github.com/fulanalok" },
        ],
      },
      {
        // PLACEHOLDER: falta a foto (public/team/pedro.jpg) e a área de atuação do Pedro.
        name: "Pedro Ribeiro",
        role: "Sócio-fundador",
        initials: "PR",
        links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/pedro-ribeiro-836786269/" }],
      },
    ] satisfies Founder[],
  },
  process: {
    eyebrow: "03 / COMO TRABALHAMOS",
    headline: "Da ideia ao lançamento. Sem perder a direção.",
    steps: [
      { n: "01", title: "Discovery", copy: "Entendemos o problema, o contexto e os objetivos." },
      { n: "02", title: "Strategy", copy: "Definimos arquitetura, escopo e prioridades." },
      { n: "03", title: "Design", copy: "Criamos experiências e interfaces orientadas ao usuário." },
      { n: "04", title: "Engineering", copy: "Desenvolvemos com qualidade, testes e escalabilidade." },
      { n: "05", title: "Evolution", copy: "Lançamos, monitoramos e evoluímos continuamente." },
    ],
  },
  mindset: {
    eyebrow: "04 / NOSSA ESSÊNCIA",
    headline: "Não escrevemos apenas código. Construímos possibilidades.",
    manifesto: [
      "Toda decisão de engenharia começa com uma pergunta simples: o que precisa ser verdade para isso funcionar daqui a dois anos?",
      "Medimos antes de otimizar, testamos antes de prometer e escrevemos código que outra pessoa consegue manter sem nós por perto.",
    ],
    principles: [
      { k: "Precisão", v: "Arquitetura pensada para o problema real, não para a moda do momento." },
      { k: "Clareza", v: "Entregas pequenas, visíveis e frequentes. Você sempre sabe onde estamos." },
      { k: "Escala", v: "Sistemas que crescem com o negócio, sem reescrever tudo no caminho." },
    ],
    visualLabel: "Sistema em órbita: serviços, dados e pessoas conectados.",
  },
  technologies: {
    eyebrow: "05 / NOSSO ECOSSISTEMA",
    headline: "A tecnologia certa para cada desafio.",
    // PLACEHOLDER: lista de exemplo. Os fundadores devem confirmar a stack real.
    categories: [
      { name: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Three.js"] },
      { name: "Backend", items: ["Node.js", "Python", "FastAPI", "Django", "Laravel", "Go"] },
      { name: "Cloud & Infra", items: ["AWS", "Google Cloud", "Docker", "Vercel", "Terraform"] },
      { name: "Dados & IA", items: ["PostgreSQL", "BigQuery", "Redis", "OpenAI", "Claude", "Gemini"] },
      { name: "Mobile", items: ["React Native", "Kotlin", "Swift"] },
    ],
  },
  cta: {
    headline: "O próximo grande projeto pode começar aqui.",
    copy: "Conte para nós o que você imagina. Vamos transformar essa ideia em algo extraordinário.",
    primaryCta: "Vamos construir juntos →",
    secondaryCta: "Enviar um e-mail ↗",
  },
  form: {
    title: "Conte sobre o seu projeto",
    subtitle: "Respondemos em até 2 dias úteis.",
    fields: {
      name: { label: "Nome", placeholder: "Seu nome" },
      email: { label: "E-mail", placeholder: "voce@empresa.com" },
      company: { label: "Empresa (opcional)", placeholder: "Nome da empresa" },
      projectType: { label: "Tipo de projeto", placeholder: "Selecione uma opção" },
      message: { label: "Mensagem", placeholder: "O que você quer construir? Prazo, contexto, links..." },
    },
    projectTypes: [
      "Software sob medida",
      "Produto SaaS",
      "Web & Mobile",
      "Inteligência Artificial",
      "Cloud & Architecture",
      "UI/UX Engineering",
      "Ainda não sei",
    ],
    errors: {
      name: "Informe seu nome.",
      email: "Informe um e-mail válido, como voce@empresa.com.",
      projectType: "Escolha o tipo de projeto.",
      message: "Escreva pelo menos 20 caracteres sobre o projeto.",
      generic: "A mensagem não foi enviada. Tente de novo ou escreva para o nosso e-mail.",
      network: "Sem conexão com o servidor. Verifique sua internet e tente de novo.",
    },
    submit: "Enviar mensagem",
    submitting: "Enviando…",
    success: {
      title: "Mensagem enviada.",
      copy: "Recebemos sua mensagem e respondemos em até 2 dias úteis.",
      again: "Enviar outra mensagem",
    },
    mailto: {
      title: "Sua mensagem está pronta no seu app de e-mail.",
      copy: "É só conferir e enviar. Se nada abriu, escreva direto para",
    },
  },
  footer: {
    tagline: "Engenharia de software para ideias que vão além.",
    navTitle: "Navegação",
    contactTitle: "Contato",
    socialTitle: "Redes",
    closing: "VORION CODE — IDEIAS EM ÓRBITA.",
    rights: "Todos os direitos reservados.",
  },
};

export type SiteContent = typeof ptBR;
