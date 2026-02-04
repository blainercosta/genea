const BASE_URL = "https://genea.cc";

// Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Genea",
  url: BASE_URL,
  logo: `${BASE_URL}/images/logo-min.svg`,
  description:
    "Restauração de fotos antigas com inteligência artificial. Recupere memórias em minutos.",
  foundingDate: "2024",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "contato@genea.cc",
    availableLanguage: ["Portuguese"],
  },
  sameAs: [],
};

// Service Schema
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Restauração de Fotos Antigas",
  description:
    "Serviço de restauração de fotos antigas usando inteligência artificial. Recupere fotos danificadas, rasgadas, manchadas ou desbotadas em minutos.",
  provider: {
    "@type": "Organization",
    name: "Genea",
  },
  serviceType: "Photo Restoration",
  areaServed: {
    "@type": "Country",
    name: "Brazil",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Pacotes de Restauração",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Uma Memória",
        description: "1 foto restaurada",
        price: "9.90",
        priceCurrency: "BRL",
      },
      {
        "@type": "Offer",
        name: "Álbum",
        description: "5 fotos restauradas",
        price: "29.90",
        priceCurrency: "BRL",
      },
      {
        "@type": "Offer",
        name: "Acervo",
        description: "15 fotos restauradas",
        price: "59.90",
        priceCurrency: "BRL",
      },
    ],
  },
};

// FAQ Schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "E se eu não gostar do resultado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A gente devolve seu dinheiro em 24h pelo PIX. Sem burocracia nenhuma.",
      },
    },
    {
      "@type": "Question",
      name: "Quanto tempo demora a restauração?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A maioria fica pronta em 2 minutos. No máximo 5 minutos para fotos mais difíceis.",
      },
    },
    {
      "@type": "Question",
      name: "A foto restaurada vem com marca d'água?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Não. Você baixa a foto limpa, pronta para imprimir ou colocar na parede.",
      },
    },
    {
      "@type": "Question",
      name: "Posso pedir ajustes na foto restaurada?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pode. Quantas vezes quiser, até ficar do jeito que você quer. Sem pagar mais.",
      },
    },
    {
      "@type": "Question",
      name: "Quais tipos de danos podem ser restaurados?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rasgos, manchas, dobras, desbotamento, rostos apagados pelo tempo. Nossa IA consegue restaurar a maioria dos danos em fotos antigas.",
      },
    },
  ],
};

// HowTo Schema
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Como Restaurar uma Foto Antiga Online",
  description:
    "Aprenda a restaurar suas fotos antigas em 3 passos simples usando inteligência artificial.",
  totalTime: "PT2M",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "BRL",
    value: "9.90",
  },
  step: [
    {
      "@type": "HowToStep",
      name: "Envie sua foto",
      text: "Faça upload da foto antiga que você quer restaurar. Aceita JPG, PNG ou HEIC.",
      position: 1,
    },
    {
      "@type": "HowToStep",
      name: "Aguarde o processamento",
      text: "Nossa inteligência artificial analisa e restaura sua foto em aproximadamente 2 minutos.",
      position: 2,
    },
    {
      "@type": "HowToStep",
      name: "Baixe o resultado",
      text: "Compare o antes e depois, peça ajustes se quiser, e baixe sua foto restaurada em alta qualidade.",
      position: 3,
    },
  ],
};

// WebSite Schema for Sitelinks Search Box
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Genea",
  url: BASE_URL,
  description: "Restauração de fotos antigas com inteligência artificial",
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
