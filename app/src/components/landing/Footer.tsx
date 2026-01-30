"use client";

import { Instagram, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "5511992785756";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Vim pelo site do Genea.")}`;

const footerLinks = [
  { label: "Termos de uso", href: "/termos" },
  { label: "Política de privacidade", href: "/privacidade" },
  { label: "Contato", href: WHATSAPP_URL, external: true },
];

export function Footer() {
  return (
    <footer className="bg-ih-text py-12 md:py-16 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Main Content */}
        <div className="grid gap-10 md:grid-cols-3 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="/images/logo-min.svg" alt="" className="h-8" />
              <span className="text-2xl font-bold text-white">Genea</span>
            </div>
            <p className="text-white/70">Salvando memórias de família</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-4">
              Links
            </h4>
            <ul className="space-y-1">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-block py-1 text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:text-white focus-visible:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-4">
              Fale com a gente
            </h4>
            <div className="flex items-center gap-3 mb-4">
              <a
                href="https://instagram.com/genea"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5 text-white" />
              </a>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-1 text-white/70 hover:text-white transition-colors text-sm focus:outline-none focus-visible:text-white focus-visible:underline"
            >
              Dúvida? Chama no WhatsApp
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-white/50 text-sm">
            © 2025 Genea. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
