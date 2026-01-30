"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout";

const WHATSAPP_NUMBER = "5511992785756";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Vim pelo site do Genea.")}`;

export default function ContatoPage() {
  useEffect(() => {
    window.location.href = WHATSAPP_URL;
  }, []);

  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
        <Loader2 className="w-10 h-10 text-genea-green animate-spin" />
        <p className="text-ih-text-secondary">Redirecionando para o WhatsApp...</p>
        <a
          href={WHATSAPP_URL}
          className="text-genea-green hover:underline"
        >
          Clique aqui se não for redirecionado
        </a>
      </main>
    </div>
  );
}
