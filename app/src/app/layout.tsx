import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/providers/PostHogProvider";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {
  title: "Genea - Restauração de Fotos Antigas",
  description: "Restaure suas fotos antigas em minutos. Rasgos, manchas, rostos apagados pelo tempo - trazemos tudo de volta.",
  icons: {
    icon: "/images/logo-min.svg",
    shortcut: "/images/logo-min.svg",
    apple: "/images/logo-min.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={ibmPlexSans.variable}>
      <body className={ibmPlexSans.className}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
