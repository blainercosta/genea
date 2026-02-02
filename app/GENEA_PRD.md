# GENEA - PRD v2.1

## CONTEXTO

Serviço web de restauração de fotos antigas via IA. Usuário envia foto deteriorada, recebe versão restaurada em ~2 minutos. Modelo: trial grátis (1 foto com marca d'água) + pacotes de créditos (R$9,90/foto avulsa, R$29,90/5 fotos, R$59,90/15 fotos). Custo por foto: R$0,30 (fal.ai). Margem: 92-97%.

---

## STACK

**Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion
**Backend:** Next.js API Routes, Vercel
**Database:** Supabase (PostgreSQL)
**Storage:** AWS S3

### Integrações

| Serviço | Uso | Status |
|---------|-----|--------|
| fal.ai (Nano Banana) | Restauração IA | ✅ |
| Abacate Pay | PIX | ✅ |
| Supabase | DB + Auth | ✅ |
| AWS S3 | Storage fotos | ✅ |
| Resend | Email transacional | ✅ |
| PostHog | Analytics | ✅ |
| Stripe | Cartão | ❌ Não implementado |

### Variáveis de Ambiente

```env
# AWS S3
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=

# fal.ai
FAL_KEY=

# Abacate Pay
ABACATE_API_KEY=abc_live_xxx
ABACATE_WEBHOOK_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Resend
RESEND_API_KEY=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# App
NEXT_PUBLIC_APP_URL=https://genea.cc
```

---

## SCHEMA

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  tax_id TEXT,
  credits INTEGER DEFAULT 0,
  is_trial_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  pix_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  credits INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE restorations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  original_url TEXT NOT NULL,
  restored_url TEXT,
  status TEXT DEFAULT 'pending',
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE auth_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## FLUXOS CRÍTICOS

### Autenticação
```
Email digitado → GET /api/user?email=xxx → Supabase retorna/cria user → localStorage sync → UI atualizada
```

### Pagamento PIX
```
1. POST /api/payment/pix {planId, email, name, phone, taxId}
2. API chama Abacate Pay POST /pixQrCode/create
3. Retorna {id, qrCode, brCode, expiresAt}
4. Frontend exibe QR, inicia polling GET /api/payment/pix?id=xxx
5. Usuário paga, Abacate envia webhook POST /api/payment/webhook
6. Webhook valida HMAC, adiciona créditos no Supabase, registra payment
7. Polling detecta COMPLETED, frontend chama syncCredits()
8. Redireciona para /payment-confirmed
```

### Restauração
```
1. Upload foto → POST /api/upload → S3 retorna URL
2. POST /api/restore {imageUrl, email} → fal.ai processa
3. Polling até status=completed ou timeout 5min
4. Resultado salvo em restorations, exibe comparação antes/depois
```

### Desbloqueio de Foto (Trial → Pago)
```
1. Usuário em /result (trial) clica "Desbloquear por R$9,90"
2. Redireciona /checkout?plan=1&restoration=xxx
3. Completa pagamento PIX
4. /payment-confirmed?restoration=xxx:
   - syncCredits() (aguarda)
   - getRestoration(xxx)
   - updateRestoration(xxx, {isTrial: false})
   - consumeCredit() ← consome 1 crédito aqui
5. Redireciona /result?id=xxx&autoDownload=true
```

---

## API REFERENCE

### POST /api/payment/pix
Request:
```json
{"planId": "3", "email": "user@email.com", "name": "Nome", "phone": "11999999999", "taxId": "12345678901"}
```
Response:
```json
{
  "pix": {"id": "pix_char_xxx", "qrCode": "00020126...", "qrCodeBase64": "data:image/png;base64,...", "copyPaste": "00020126...", "expiresAt": "2025-02-02T12:30:00Z", "amount": 59.90},
  "plan": {"id": "3", "name": "ACERVO", "photos": 15, "price": 59.90}
}
```

### GET /api/payment/pix?id=xxx
Response:
```json
{"id": "pix_char_xxx", "status": "COMPLETED", "amount": 59.90}
```

### POST /api/payment/webhook
Request (Abacate Pay):
```json
{
  "event": "billing.paid",
  "data": {
    "pixQrCode": {"id": "pix_char_xxx", "amount": 5990, "status": "PAID", "metadata": {"planId": "3", "photos": "15", "email": "user@email.com", "name": "Nome"}},
    "payment": {"amount": 5990, "fee": 80, "method": "PIX"}
  }
}
```
Response:
```json
{"received": true, "event": "billing.paid"}
```

### GET /api/user?email=xxx
Response:
```json
{"user": {"id": "uuid", "email": "user@email.com", "name": "Nome", "credits": 15, "isTrialUsed": true}, "source": "supabase"}
```

### POST /api/user
Actions: `sync`, `consumeCredit`, `useTrial`, `updateProfile`
```json
{"action": "consumeCredit", "email": "user@email.com"}
```

---

## REGRAS DE NEGÓCIO

1. Trial: 1 foto grátis por email, marca d'água, resolução 1K
2. Créditos não expiram, persistem entre dispositivos (Supabase)
3. Desbloquear foto consome 1 crédito no momento do unlock
4. Ajustes ilimitados por foto até aprovar (max 3 por restauração)
5. Timeout processamento: 5 minutos
6. Polling PIX: max 200 tentativas (~10 minutos)
7. Formatos aceitos: JPG, PNG, HEIC
8. Tamanho máximo: 20MB
9. Reembolso: até 24h via PIX (UI pronta, API básica)

---

## ESTRUTURA DE PASTAS

```
/src
  /app
    page.tsx                    # Landing
    /start/page.tsx             # Captura email
    /upload/page.tsx            # Upload foto
    /processing/page.tsx        # Processamento
    /result/page.tsx            # Resultado
    /adjust/page.tsx            # Pedir ajuste
    /checkout/page.tsx          # Planos
    /customer-info/page.tsx     # Dados PIX
    /pix/page.tsx               # Pagamento PIX
    /payment-confirmed/page.tsx # Confirmação
    /refund/page.tsx            # Reembolso
    /api
      /upload/route.ts
      /restore/route.ts
      /adjust/route.ts
      /download/route.ts
      /user/route.ts
      /auth/route.ts
      /email/route.ts
      /payment/pix/route.ts
      /payment/webhook/route.ts
      /refund/route.ts
  /components
    /ui                         # Componentes base
    /layout                     # Header, Stepper
    /screens                    # Telas completas
    /landing                    # Landing page
  /config
    /plans.ts                   # Planos e preços
  /lib
    /fal.ts                     # fal.ai
    /s3.ts                      # AWS S3
    /storage.ts                 # localStorage + Supabase sync
    /supabase.ts                # Supabase client
    /abacate.ts                 # Abacate Pay
    /resend.ts                  # Emails
    /analytics.ts               # PostHog
    /validation.ts              # Email, CPF, etc
    /watermark.ts               # Marca d'água trial
    /rateLimit.ts               # Rate limiting
  /hooks
    /useUser.ts                 # Estado usuário + sync
    /useUpload.ts               # Upload
    /useRestore.ts              # Restauração
    /useAdjust.ts               # Ajustes
  /types
    /index.ts
```

---

## CONSTRAINTS

- Webhook Abacate: validar HMAC-SHA256 ou query string `?webhookSecret=xxx`
- Evento webhook: `billing.paid` (não `BILLING_PAID`)
- Payload webhook: `data.pixQrCode` (não `data` direto)
- Crédito consumido no unlock, não no pagamento (evita race condition)
- Aguardar `syncCredits()` antes de redirecionar após pagamento
- Restoration ID preservado em fallback do checkout
- Header global: créditos visíveis, botão "Adicionar" quando credits=0
- Apenas PIX implementado (sem ícones de cartão)

---

## PLANOS

| ID | Nome | Fotos | Preço | Por Foto |
|----|------|-------|-------|----------|
| 1 | Uma Memória | 1 | R$9,90 | R$9,90 |
| 2 | Álbum | 5 | R$29,90 | R$5,98 |
| 3 | Acervo | 15 | R$59,90 | R$3,99 |