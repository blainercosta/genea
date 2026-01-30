import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
