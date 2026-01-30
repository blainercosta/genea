"use client";

import { useState } from "react";
import { User, Phone, CreditCard } from "lucide-react";
import { Header } from "@/components/layout";
import { Button, Input, Card } from "@/components/ui";
import { formatPrice } from "@/config/plans";

interface CustomerInfoProps {
  planName?: string;
  planPrice?: number;
  onSubmit?: (data: { name: string; phone: string; taxId: string }) => void;
}

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false; // All same digits

  // Validate check digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let check = (sum * 10) % 11;
  if (check === 10) check = 0;
  if (check !== parseInt(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  check = (sum * 10) % 11;
  if (check === 10) check = 0;
  if (check !== parseInt(digits[10])) return false;

  return true;
}

export function CustomerInfo({ planName, planPrice, onSubmit }: CustomerInfoProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [taxId, setTaxId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit && onSubmit) {
      onSubmit({
        name: name.trim(),
        phone: phone.replace(/\D/g, ""),
        taxId: taxId.replace(/\D/g, ""),
      });
    }
  };

  const isValidPhone = phone.replace(/\D/g, "").length >= 10;
  const isValidName = name.trim().length >= 3;
  const canSubmit = isValidName && isValidPhone && isValidCPF(taxId);

  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 md:p-10 flex flex-col items-center gap-8 shadow-card rounded-[20px]">
          {/* Plan info */}
          {planName && planPrice && (
            <div className="w-full text-center p-4 bg-genea-green/10 rounded-xl">
              <p className="text-sm text-ih-text-secondary">Plano selecionado</p>
              <p className="text-lg font-semibold text-ih-text">{planName}</p>
              <p className="text-2xl font-bold text-genea-green">
                {formatPrice(planPrice)}
              </p>
            </div>
          )}

          {/* Title */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-ih-text">
              Seus dados para o PIX
            </h1>
            <p className="text-ih-text-secondary">
              Precisamos dessas informações para gerar o pagamento.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="space-y-1">
              <label className="text-sm text-ih-text-secondary">Nome completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ih-text-muted" />
                <Input
                  type="text"
                  placeholder="Maria da Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-12"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-ih-text-secondary">Celular (WhatsApp)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ih-text-muted" />
                <Input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className="pl-12"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-ih-text-secondary">CPF</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ih-text-muted" />
                <Input
                  type="text"
                  placeholder="000.000.000-00"
                  value={taxId}
                  onChange={(e) => setTaxId(formatCPF(e.target.value))}
                  className="pl-12"
                />
              </div>
              {taxId && !isValidCPF(taxId) && (
                <p className="text-xs text-red-500">CPF inválido</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!canSubmit}
              className="w-full mt-4"
            >
              Gerar PIX
            </Button>
          </form>

          {/* Security note */}
          <p className="text-sm text-ih-text-muted text-center">
            Seus dados estão seguros e são usados apenas para o pagamento.
          </p>
        </Card>
      </main>
    </div>
  );
}
