import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { StructuredData } from "@/components/seo";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ibm-plex-sans",
});

const BASE_URL = "https://genea.cc";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Restaurar Foto Antiga Online em 2 Min | Genea",
    template: "%s | Genea",
  },
  description:
    "Restaure suas fotos antigas em 2 minutos com IA. Rasgos, manchas, rostos apagados pelo tempo - trazemos tudo de volta. Primeira foto grátis.",
  keywords: [
    "restaurar foto antiga",
    "restauração de fotos",
    "recuperar foto danificada",
    "foto antiga",
    "restaurar foto online",
    "melhorar foto antiga",
    "consertar foto rasgada",
    "restauração de fotos antigas",
    "genealogia",
    "fotos de família",
  ],
  authors: [{ name: "Genea" }],
  creator: "Genea",
  publisher: "Genea",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/logo-min.svg",
    shortcut: "/images/logo-min.svg",
    apple: "/images/logo-min.svg",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BASE_URL,
    siteName: "Genea",
    title: "Restaurar Foto Antiga Online em 2 Min | Genea",
    description:
      "Restaure suas fotos antigas em 2 minutos com IA. Rasgos, manchas, rostos apagados pelo tempo - trazemos tudo de volta. Primeira foto grátis.",
    images: [
      {
        url: "https://genea-photos.s3.sa-east-1.amazonaws.com/landing/og-image.png",
        width: 1200,
        height: 630,
        alt: "Genea - Restauração de Fotos Antigas com IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restaurar Foto Antiga Online em 2 Min | Genea",
    description:
      "Restaure suas fotos antigas em 2 minutos com IA. Primeira foto grátis.",
    images: ["https://genea-photos.s3.sa-east-1.amazonaws.com/landing/og-image.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4a5d4a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={ibmPlexSans.variable}>
      <head>
        {/* Preconnect to S3 for faster image loading */}
        <link rel="dns-prefetch" href="https://genea-photos.s3.sa-east-1.amazonaws.com" />
        <link rel="preconnect" href="https://genea-photos.s3.sa-east-1.amazonaws.com" crossOrigin="anonymous" />
        {/* Structured Data for SEO */}
        <StructuredData />
      </head>
      <body className={ibmPlexSans.className}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
