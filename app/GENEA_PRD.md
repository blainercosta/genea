# PRD - Genea

## Product Requirements Document
**Versão:** 2.0
**Data:** Fevereiro 2025
**Status:** MVP Pronto para Produção
**Implementação:** ~95% completo

### Status de Implementação (Atualizado: 02/02/2025)

| Categoria | Status | Progresso |
|-----------|--------|-----------|
| Landing Page | ✅ Completo | 100% |
| Páginas Core | ✅ Completo | 100% |
| API Routes | ✅ Completo | 100% |
| Integrações | ✅ Completo | 95% |
| Hooks | ✅ Completo | 100% |
| Features | ✅ Completo | 95% |
| Banco de Dados | ✅ Completo | 100% |
| **Robustez/Segurança** | ✅ Completo | 95% |

**Progresso Geral:** ~95% pronto para produção

---

### ✅ CORREÇÕES APLICADAS (02/02/2025)

#### Integração Supabase (NOVO)
- [x] Banco de dados Supabase conectado e funcionando
- [x] Tabela `users` com créditos persistentes
- [x] Tabela `payments` para auditoria de pagamentos
- [x] Tabela `restorations` para histórico
- [x] Tabela `auth_codes` para autenticação via email
- [x] API `/api/user` para sincronização de créditos
- [x] Hook `useUser` sincroniza com Supabase automaticamente
- [x] Créditos persistem entre sessões e dispositivos

#### Webhook Abacate Pay (CORRIGIDO)
- [x] Validação de assinatura usando chave pública HMAC-SHA256
- [x] Suporte a validação via query string `?webhookSecret=xxx`
- [x] Formato de payload corrigido (`billing.paid` ao invés de `BILLING_PAID`)
- [x] Estrutura de dados corrigida (`data.pixQrCode` ao invés de `data`)
- [x] Créditos adicionados automaticamente no Supabase
- [x] Pagamentos registrados na tabela `payments`
- [x] Email de confirmação enviado ao cliente

#### Fluxo de Pagamento (CORRIGIDO)
- [x] PIX funcionando em produção com `ABACATE_API_KEY`
- [x] Frontend sincroniza créditos após pagamento confirmado
- [x] Página de confirmação sincroniza créditos do banco
- [x] Créditos recuperáveis ao fazer login com mesmo email

---

### ⚠️ Pendências Menores

| Item | Status | Prioridade |
|------|--------|------------|
| API de refund real | ⚠️ UI pronta, API básica | P2 |
| Rate limiting robusto | ⚠️ Básico implementado | P2 |
| Stripe (cartão) | ❌ Não implementado | P3 (opcional) |

---

## 1. Visão Geral

### 1.1 Descrição do Produto
Genea é um serviço web que restaura fotos antigas danificadas usando inteligência artificial. O usuário envia uma foto deteriorada e recebe a versão restaurada em até 2 minutos.

### 1.2 Problema
Fotos de família deterioram com o tempo: rasgos, manchas, mofo, desbotamento. Pessoas perdem memórias visuais de antepassados. Soluções profissionais custam caro (R$50-200 por foto) e demoram dias.

### 1.3 Por que agora
- IA generativa atingiu ponto de qualidade e custo viável (R$0,30/foto)
- Mercado de nostalgia e genealogia em crescimento
- Brasileiro valoriza família e memórias
- Timing técnico + cultural favorável

### 1.4 Diferencial Competitivo

| Concorrente | Limitação | Genea |
|-------------|-----------|-------|
| Remini | Grátis mas qualidade mediana | Qualidade superior |
| MyHeritage | Focado em animação, não restauração | Restauração profunda |
| Fotógrafos | R$50-200, dias de espera | R$9,90, 2 minutos |

**Proposta de valor:** Qualidade superior + ajustes ilimitados + garantia de devolução + preço acessível + velocidade.

---

## 2. Público-Alvo

### 2.1 Usuário Primário
- Brasileiros 35-65 anos
- Classe B/C
- Possuem fotos antigas guardadas
- Valorizam família e memórias
- Não são tech-savvy
- Decisão emocional, não racional

### 2.2 Usuário Secundário
- Pesquisadores de genealogia
- Qualquer idade
- Mais engajados e recorrentes
- Buscam fotos de antepassados
- Dispostos a pagar por qualidade

### 2.3 Cliente Pagante
Mesmo usuário final. Possibilidade de presente (filho paga, pai recebe).

### 2.4 Tamanho do Mercado
- Brasil: ~60 milhões de domicílios
- Estimativa conservadora: 30% têm fotos antigas guardadas
- Mercado potencial: 18 milhões de domicílios

### 2.5 Ticket
Low-ticket. Compra por impulso emocional. R$9,90 a R$59,90 por transação.

---

## 3. Modelo de Negócio

### 3.1 Monetização
Venda de pacotes de créditos (fotos). Créditos não expiram.

### 3.2 Estrutura de Preços

| Plano | Fotos | Preço | Por Foto | Custo | Margem |
|-------|-------|-------|----------|-------|--------|
| Uma Memória | 1 | R$9,90 | R$9,90 | R$0,30 | 97% |
| Álbum | 5 | R$29,90 | R$5,98 | R$1,50 | 95% |
| Acervo | 15 | R$59,90 | R$3,99 | R$4,50 | 92% |

### 3.3 Trial
1 foto grátis por email. Custo de aquisição: R$0,30 por lead qualificado.
- Download com marca d'água
- Resolução reduzida (1K)

### 3.4 Garantia
Reembolso total em até 24h via PIX. Sem burocracia.

### 3.5 Custos Variáveis

| Item | Custo |
|------|-------|
| IA (fal.ai) | R$0,30/foto |
| Storage (S3) | Desprezível |
| Supabase | Free tier |
| Suporte | ~R$0,50/ticket |

---

## 4. Arquitetura Técnica

### 4.1 Stack

**Frontend**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

**Backend**
- Next.js API Routes
- Vercel (deploy)

**Banco de Dados**
- Supabase (PostgreSQL)

**Storage**
- AWS S3

### 4.2 Integrações

| Serviço | Uso | Status |
|---------|-----|--------|
| fal.ai (Nano Banana) | IA restauração | ✅ Funcionando |
| Abacate Pay | Pagamento PIX | ✅ Funcionando |
| Supabase | Banco de dados | ✅ Funcionando |
| AWS S3 | Storage de fotos | ✅ Funcionando |
| Resend | Email transacional | ✅ Funcionando |
| PostHog | Analytics | ✅ Funcionando |
| Stripe | Pagamento cartão | ❌ Não implementado |

### 4.3 Variáveis de Ambiente

```env
# AWS S3
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=

# fal.ai
FAL_KEY=

# Abacate Pay (PIX)
ABACATE_API_KEY=abc_live_xxx  # Chave de PRODUÇÃO
ABACATE_WEBHOOK_SECRET=       # Opcional (query string ou HMAC)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Resend (emails)
RESEND_API_KEY=

# PostHog (analytics)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# App
NEXT_PUBLIC_APP_URL=https://genea.cc
```

---

## 5. Banco de Dados (Supabase)

### 5.1 Schema

```sql
-- Usuários
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

-- Pagamentos
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

-- Restaurações
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

-- Códigos de autenticação
CREATE TABLE auth_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.2 Fluxo de Dados

```
Usuário digita email
       │
       ▼
GET /api/user?email=xxx
       │
       ▼
Supabase retorna créditos
       │
       ▼
localStorage sincronizado
       │
       ▼
Interface atualizada
```

---

## 6. Fluxo de Pagamento

### 6.1 Geração do PIX

```
Frontend                    API                      Abacate Pay
   │                         │                            │
   │─── POST /api/payment/pix ──►│                        │
   │    {planId, email, ...}     │                        │
   │                             │─── POST /pixQrCode/create ──►│
   │                             │     {amount, customer, ...}   │
   │                             │◄── {id, qrCode, brCode} ─────│
   │◄── {pix: {...}} ────────────│                              │
   │                             │                              │
   │    (Mostra QR Code)         │                              │
```

### 6.2 Confirmação do Pagamento

```
Abacate Pay                  API                     Supabase
    │                          │                          │
    │─── POST /api/payment/webhook ──►│                   │
    │    {event: "billing.paid", ...} │                   │
    │                                 │                   │
    │    (Valida assinatura HMAC)     │                   │
    │                                 │─── getOrCreateUser ──►│
    │                                 │◄── {id, credits} ─────│
    │                                 │                       │
    │                                 │─── addUserCredits ────►│
    │                                 │◄── success ───────────│
    │                                 │                       │
    │                                 │─── insert payments ───►│
    │◄── {received: true} ────────────│                       │
```

### 6.3 Sincronização no Frontend

```
Frontend                     API                     Supabase
   │                          │                          │
   │   (Polling detecta COMPLETED)                       │
   │                          │                          │
   │─── syncCredits() ────────►│                         │
   │    GET /api/user?email=xxx│─── select users ────────►│
   │                           │◄── {credits: 15} ───────│
   │◄── {user: {credits: 15}} ─│                         │
   │                           │                         │
   │   (Atualiza localStorage) │                         │
   │   (Redireciona para /payment-confirmed)             │
```

---

## 7. APIs

### 7.1 Pagamento PIX

**POST /api/payment/pix**
```json
// Request
{
  "planId": "3",
  "email": "user@email.com",
  "name": "Nome do Usuário",
  "phone": "11999999999",
  "taxId": "12345678901"
}

// Response
{
  "pix": {
    "id": "pix_char_xxx",
    "qrCode": "00020126...",
    "qrCodeBase64": "data:image/png;base64,...",
    "copyPaste": "00020126...",
    "expiresAt": "2025-02-02T12:30:00Z",
    "amount": 59.90
  },
  "plan": {
    "id": "3",
    "name": "ACERVO",
    "photos": 15,
    "price": 59.90
  }
}
```

**GET /api/payment/pix?id=xxx**
```json
// Response
{
  "id": "pix_char_xxx",
  "status": "COMPLETED",
  "amount": 59.90
}
```

### 7.2 Webhook

**POST /api/payment/webhook**
```json
// Request (do Abacate Pay)
{
  "event": "billing.paid",
  "data": {
    "pixQrCode": {
      "id": "pix_char_xxx",
      "amount": 5990,
      "status": "PAID",
      "metadata": {
        "planId": "3",
        "photos": "15",
        "email": "user@email.com",
        "name": "Nome"
      }
    },
    "payment": {
      "amount": 5990,
      "fee": 80,
      "method": "PIX"
    }
  },
  "devMode": false
}

// Response
{
  "received": true,
  "event": "billing.paid"
}
```

### 7.3 Usuário

**GET /api/user?email=xxx**
```json
// Response
{
  "user": {
    "id": "uuid",
    "email": "user@email.com",
    "name": "Nome",
    "phone": "11999999999",
    "taxId": "12345678901",
    "credits": 15,
    "isTrialUsed": true
  },
  "source": "supabase"
}
```

**POST /api/user**
```json
// Sync user
{
  "action": "sync",
  "email": "user@email.com"
}

// Consume credit
{
  "action": "consumeCredit",
  "email": "user@email.com"
}

// Use trial
{
  "action": "useTrial",
  "email": "user@email.com"
}

// Update profile
{
  "action": "updateProfile",
  "email": "user@email.com",
  "name": "Novo Nome",
  "phone": "11988888888"
}
```

---

## 8. Estrutura de Pastas

```
/src
  /app
    /page.tsx                       # Landing page
    /start/page.tsx                 # Captura de email
    /upload/page.tsx                # Upload de foto
    /processing/page.tsx            # Tela de processamento
    /result/page.tsx                # Resultado da restauração
    /adjust/page.tsx                # Pedir ajuste
    /checkout/page.tsx              # Checkout/planos
    /customer-info/page.tsx         # Dados para PIX
    /pix/page.tsx                   # Pagamento PIX
    /payment-confirmed/page.tsx     # Confirmação pagamento
    /refund/page.tsx                # Solicitar reembolso
    /refund-confirmed/page.tsx      # Confirmação reembolso
    /error/page.tsx                 # Página de erro
    /termos/page.tsx                # Termos de Uso
    /privacidade/page.tsx           # Política de Privacidade
    /api
      /upload/route.ts              # Upload para S3
      /restore/route.ts             # Restauração via fal.ai
      /adjust/route.ts              # Ajustes via fal.ai
      /download/route.ts            # Proxy de download + watermark
      /user/route.ts                # ✅ NOVO: Gerenciamento de usuário
      /auth/route.ts                # Autenticação via código
      /email/route.ts               # Envio de emails
      /payment
        /pix/route.ts               # Geração PIX
        /webhook/route.ts           # Webhook Abacate Pay
      /refund/route.ts              # Solicitação de reembolso
  /components
    /ui                             # Componentes base
    /layout                         # Layout (Header, Stepper)
    /screens                        # Telas completas
    /landing                        # Componentes da landing
  /config
    /plans.ts                       # Configuração de planos
  /lib
    /fal.ts                         # Integração fal.ai
    /s3.ts                          # Integração AWS S3
    /storage.ts                     # LocalStorage (+ sync Supabase)
    /supabase.ts                    # ✅ Integração Supabase
    /abacate.ts                     # Integração Abacate Pay
    /resend.ts                      # Integração Resend
    /analytics.ts                   # PostHog analytics
    /validation.ts                  # Validações (email, CPF, etc)
    /watermark.ts                   # Watermark para trial
    /rateLimit.ts                   # Rate limiting
  /hooks
    /useUser.ts                     # ✅ Estado do usuário + sync Supabase
    /useUpload.ts                   # Upload de arquivos
    /useRestore.ts                  # Restauração
    /useAdjust.ts                   # Ajustes
  /types
    /index.ts                       # Tipos TypeScript
```

---

## 9. Regras de Negócio

| # | Regra | Implementação |
|---|-------|---------------|
| 1 | Trial: 1 foto grátis por email | ✅ `is_trial_used` no Supabase |
| 2 | Créditos não expiram | ✅ `credits` no Supabase |
| 3 | Ajustes ilimitados por foto até aprovar | ✅ Max 3 ajustes por restauração |
| 4 | Reembolso em até 24h via PIX | ⚠️ UI pronta, API básica |
| 5 | Tempo máximo processamento: 5 minutos | ✅ Timeout implementado |
| 6 | Formatos aceitos: JPG, PNG, HEIC | ✅ Validação no upload |
| 7 | Tamanho máximo: 20MB | ✅ Validação no upload |
| 8 | Trial: download com marca d'água | ✅ Watermark aplicado |
| 9 | Pago: download sem marca d'água, 2K | ✅ Resolução full |
| 10 | Créditos persistem entre dispositivos | ✅ Supabase sync |

---

## 10. Métricas de Sucesso

### 10.1 North Star Metric
**Trial → Paid Conversion Rate**

Meta: >20%

### 10.2 Métricas Secundárias

| Métrica | Meta |
|---------|------|
| Ticket médio | >R$25 |
| Taxa de reembolso | <5% |
| Tempo médio processamento | <90s |
| NPS | >50 |

### 10.3 Tracking de Eventos (PostHog)

| Evento | Descrição |
|--------|-----------|
| cta_click | Clica testar grátis |
| email_submit | Envia email |
| upload_complete | Completa upload |
| processing_complete | Processamento concluído |
| result_view | Visualiza resultado |
| download_click | Clica download |
| checkout_view | Acessa checkout |
| plan_select | Seleciona plano |
| payment_complete | Pagamento confirmado |
| adjustment_submit | Envia ajuste |

---

## 11. Checklist de Lançamento

### Configuração de Produção
- [x] `ABACATE_API_KEY` configurada (chave `abc_live_xxx`)
- [x] Webhook configurado no Abacate Pay (URL: `https://genea.cc/api/payment/webhook`)
- [x] `NEXT_PUBLIC_SUPABASE_URL` configurada
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurada
- [x] `RESEND_API_KEY` configurada
- [x] `FAL_KEY` configurada
- [x] AWS S3 configurado

### Funcionalidades
- [x] Landing page no ar
- [x] Fluxo de trial funcionando
- [x] Integração fal.ai testada
- [x] Pagamento PIX funcionando
- [x] Créditos persistindo no banco
- [x] Emails transacionais enviando
- [x] Analytics implementado
- [x] Termos de uso publicados
- [x] Política de privacidade publicada

### Pós-Lançamento
- [ ] Monitorar conversão trial → paid
- [ ] Monitorar taxa de erro
- [ ] Coletar feedback dos primeiros usuários

---

## 12. Histórico de Versões

### v2.0 (02/02/2025)
- ✅ Integração Supabase completa
- ✅ Créditos persistentes no banco de dados
- ✅ Webhook Abacate Pay corrigido e funcionando
- ✅ Sincronização frontend-backend
- ✅ API /api/user para gerenciamento de usuários

### v1.2 (30/01/2025)
- ✅ Correções de race conditions
- ✅ Validação de pagamentos
- ✅ Timeout em APIs

### v1.0 (Janeiro 2025)
- ✅ MVP inicial
- ✅ Fluxo de trial
- ✅ Pagamento PIX (código)
- ✅ Integração fal.ai

---

**Documento criado em:** Janeiro 2025
**Última atualização:** 02 Fevereiro 2025
**Status:** Pronto para Produção
