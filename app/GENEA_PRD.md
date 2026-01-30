# PRD - Genea

## Product Requirements Document
**Versão:** 1.1
**Data:** Janeiro 2025
**Status:** MVP em Desenvolvimento
**Implementação:** ~70% completo

### Status de Implementação (Atualizado: 30/01/2025)

| Categoria | Status | Progresso |
|-----------|--------|-----------|
| Landing Page | ✅ Completo | 100% |
| Páginas Core | ✅ Completo | 100% |
| API Routes | ⚠️ Parcial | 70% |
| Integrações | ⚠️ Parcial | 50% |
| Hooks | ✅ Completo | 100% |
| Features | ⚠️ Parcial | 75% |
| Estrutura | ✅ Completo | 100% |

**Progresso Geral:** ~80% completo

**Bloqueadores para Produção:**
1. Integração Stripe (pagamento cartão) - placeholder criado
2. Integração Abacate Pay (pagamento PIX) - placeholder criado
3. Integração Resend (emails transacionais) - placeholder criado

**Últimas correções (30/01/2025):**
- ✅ Removido código morto (componentes órfãos, funções não usadas)
- ✅ Single source of truth para planos (config/plans.ts)
- ✅ Hook useHydrated para consistência de hydration
- ✅ Fluxo de adjustment-result completado
- ✅ Dados dinâmicos em payment-confirmed e refund-confirmed
- ✅ Validação de FAL_API_KEY adicionada
- ✅ Estrutura de API routes para pagamentos criada
- ✅ Termos de Uso publicados (/termos)
- ✅ Política de Privacidade publicada (/privacidade)

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

### 2.6 Onde Encontrar

| Canal | Uso |
|-------|-----|
| Facebook | Grupos de família, genealogia |
| WhatsApp | Compartilhamento familiar |
| Instagram | Nostalgia, throwback |
| Google | Busca "restaurar foto antiga" |
| Comunidades | FamilySearch, MyHeritage |

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

### 3.4 Garantia
Reembolso total em até 24h via PIX. Sem burocracia.

### 3.5 Custos Variáveis

| Item | Custo |
|------|-------|
| IA (fal.ai) | R$0,30/foto |
| Storage (S3) | Desprezível |
| Suporte | ~R$0,50/ticket |

### 3.6 Projeção de Receita

**Cenário Conservador (M3)**
- 1.000 trials/mês
- 15% conversão
- Ticket médio R$30
- Receita: R$4.500/mês
- Margem bruta: ~R$4.000

**Cenário Moderado (M6)**
- 3.000 trials/mês
- 20% conversão
- Ticket médio R$30
- Receita: R$18.000/mês
- Margem bruta: ~R$16.000

**Cenário Otimista (M12)**
- 10.000 trials/mês
- 25% conversão
- Ticket médio R$35
- Receita: R$87.500/mês
- Margem bruta: ~R$80.000

---

## 4. Funcionalidades Core

### 4.1 Ação Principal
Usuário envia foto antiga → IA processa → Usuário recebe foto restaurada.

### 4.2 Inputs
- Foto (upload da galeria ou câmera)
- Email para entrega
- Instruções de ajuste (opcional)

### 4.3 Outputs
- Foto restaurada em alta resolução
- Download em JPG/PNG
- Email com foto anexa

### 4.4 Processamento
Nuvem. IA roda em servidor externo (fal.ai).

### 4.5 Autenticação
Zero auth. Apenas email para entrega do resultado.

### 4.6 Acesso a Arquivos
- Galeria de fotos do dispositivo
- Câmera (para fotografar foto física)

### 4.7 Fluxo
Guiado linear. Usuário não pode pular passos.

---

## 5. Requisitos Técnicos

### 5.1 Plataforma
Web only. Responsivo. PWA básico para instalação no celular.

### 5.2 Offline
Não suportado. Depende de IA na nuvem.

### 5.3 Stack Técnico

**Frontend**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hook Form + Zod

**Backend**
- Next.js API Routes
- Vercel (deploy)

**Storage**
- AWS S3

### 5.4 Integrações

| Serviço | Uso |
|---------|-----|
| fal.ai (Nano Banana) | IA restauração |
| Stripe | Pagamento cartão |
| Abacate Pay | Pagamento PIX |
| Resend | Email transacional |
| PostHog | Analytics |
| WhatsApp API | Suporte |

### 5.5 Performance

| Requisito | Especificação |
|-----------|---------------|
| Upload máximo | 20MB |
| Tempo processamento | Máximo 2 min (ideal 60s) |
| Formatos aceitos | JPG, PNG, HEIC |
| Download | Instantâneo após processamento |

### 5.6 Dados Sensíveis
- Email
- Fotos (dados biométricos faciais indiretamente)
- Pagamento (via Stripe, não armazenado)

### 5.7 Regulamentação
- LGPD: consentimento para uso de imagem, política de retenção
- PCI: Stripe cuida da conformidade de pagamento

---

## 6. Fluxo do Usuário

### 6.1 Jornada Principal

```
Landing Page
    │
    ▼
Captura Email
    │
    ▼
Upload da Foto
    │
    ▼
Processamento IA
    │
    ▼
Resultado Trial
    │
    ├──► Download Grátis
    │
    └──► Checkout
            │
            ▼
        Pagamento
            │
            ▼
        Confirmação
            │
            ▼
        Loop Restauração
            │
            ├──► Download
            │
            └──► Pedir Ajuste
```

### 6.2 Telas do Produto

| # | Tela | Função |
|---|------|--------|
| 1 | Landing Page | Conversão, proposta de valor |
| 2 | Captura Email | Coletar email para entrega |
| 3 | Upload Foto | Enviar foto para restauração |
| 4 | Processamento | Loading enquanto IA trabalha |
| 5 | Resultado Trial | Mostrar antes/depois, download |
| 6 | Checkout | Escolher plano e pagar |
| 7 | Confirmação | Confirmar pagamento e créditos |
| 8 | Upload Pago | Restaurar com créditos |
| 9 | Resultado Pago | Download ou pedir ajuste |
| 10 | Pedir Ajuste | Solicitar modificações |
| 11 | Resultado Ajuste | Comparar versões |
| 12 | Reembolso | Solicitar devolução |
| 13 | Erro | Tratamento de falhas |

---

## 7. Especificação de Telas

### 7.1 Landing Page

**Navbar**
- Logo à esquerda
- Links: Como funciona, Preços, Dúvidas
- Botão: Testar Grátis
- Mobile: logo + botão, links somem

**Hero**
- Badge: "Primeira foto grátis"
- Título: "Sua foto antiga pode voltar a ficar bonita"
- Subtítulo: "Rasgos, manchas, rostos apagados pelo tempo. A gente traz tudo de volta em 2 minutos."
- CTA: "Quero ver minha foto restaurada"
- Garantia: "Não gostou? Devolvemos seu dinheiro em 24h."
- Prova social: "847 fotos restauradas essa semana"
- Imagem: Slider antes/depois

**Problema**
- Título: "Fotos velhas estragam cada vez mais"
- Timeline: 4 fotos mostrando deterioração (1950 → 2024)
- Callout: "Quanto mais tempo passa, mais difícil de recuperar."

**Resultados**
- Título: "Veja o que a gente já fez"
- 3 cards com histórias reais e sliders antes/depois

**Genealogia**
- Título: "Montando sua árvore genealógica?"
- Texto sobre recuperar fotos de antepassados
- Ilustração de árvore com fotos

**Como Funciona**
- Título: "Funciona assim"
- Vídeo demonstrativo
- 3 passos: Tire a foto → Espere 2 minutos → Baixe pronta

**História**
- Título: "Por que a gente faz isso"
- Citação do fundador sobre perder foto da avó
- Foto e nome do fundador

**Preços**
- Título: "Escolha quantas fotos quer restaurar"
- 3 cards de planos
- Ícones de pagamento
- Texto: "Seus créditos nunca vencem"

**Depoimentos**
- Título: "O que as pessoas falam"
- 3 cards com foto, texto, nome e cidade

**Dúvidas**
- Título: "Perguntas que todo mundo faz"
- 4 cards: E se não gostar? Demora? Marca d'água? Posso ajustar?

**CTA Final**
- Fundo escuro
- Título: "Não deixa essa foto estragar mais"
- CTA: "Restaurar minha foto de graça"

**Footer**
- Logo + tagline
- Links legais
- Redes sociais
- Copyright

**Mobile**
- Botão sticky "Testar Grátis" após scroll 400px

### 7.2 Captura de Email

- Ícone de envelope
- Título: "Pra onde enviamos sua foto restaurada?"
- Subtítulo: "Coloca seu melhor email aqui."
- Input de email
- Checkbox de termos
- Botão: "Continuar"
- Texto: "Não vamos enviar spam."

### 7.3 Upload da Foto

- Stepper: 1 > 2 > 3
- Título: "Agora manda a foto que você quer restaurar"
- Área de drag and drop
- Botão: "Escolher da galeria"
- Botão: "Tirar foto agora"
- Dica: "Quanto mais nítida, melhor o resultado."

Após selecionar:
- Preview da foto
- Link: "Trocar foto"
- Botão: "Restaurar essa foto"

### 7.4 Processamento

- Stepper: passo 2 ativo
- Preview com blur
- Barra de progresso
- Textos rotativos: "Analisando...", "Reconstruindo...", "Ajustando..."
- Texto: "Leva menos de 2 minutos."

### 7.5 Resultado Trial

- Título: "Olha como ficou!"
- Slider antes/depois interativo
- Botão: "Baixar minha foto"
- Bloco upsell: "Quer restaurar mais?"
- Botão: "Ver pacotes"

### 7.6 Checkout

- Título: "Escolhe quantas fotos quer restaurar"
- 3 cards de preço
- Toggle: PIX | Cartão
- PIX: QR code + copia/cola + timer
- Cartão: Form Stripe
- Botão: "Pagar R$ XX,90"

### 7.7 Confirmação

- Ícone de check animado
- Título: "Pagamento confirmado!"
- Resumo: Pacote, créditos, valor
- Botão: "Restaurar próxima foto"

### 7.8 Upload Pago

- Header com créditos restantes
- Mesmo layout de upload
- Botão: "Restaurar essa foto (1 crédito)"

### 7.9 Resultado Pago

- Título: "Mais uma memória salva!"
- Slider antes/depois
- Botão: "Baixar foto"
- Botão: "Pedir ajuste"
- Info de créditos restantes

### 7.10 Pedir Ajuste

- Título: "O que você quer ajustar?"
- Foto atual visível
- Chips de sugestões rápidas
- Campo de texto livre
- Botão: "Enviar pedido"
- Texto: "Ajustes ilimitados. Sem custo extra."

### 7.11 Resultado Ajuste

- Título: "Olha a nova versão"
- Comparativo: Original > V1 > V2
- Botão: "Aprovar e baixar"
- Botão: "Pedir outro ajuste"

### 7.12 Reembolso

- Título: "Que pena que não deu certo"
- Dropdown de motivo
- Input de chave PIX
- Botão: "Solicitar reembolso"
- Alternativa: "Quero tentar mais um ajuste"

### 7.13 Erro

- Ícone de erro
- Título: "Ops, algo deu errado"
- Mensagem específica por tipo de erro
- Botão: "Tentar de novo"
- Botão: "Falar com suporte"

---

## 8. Regras de Negócio

| # | Regra |
|---|-------|
| 1 | Trial: 1 foto grátis por email |
| 2 | Créditos não expiram |
| 3 | Ajustes ilimitados por foto até aprovar |
| 4 | Reembolso em até 24h via PIX |
| 5 | Tempo máximo processamento: 5 minutos |
| 6 | Formatos aceitos: JPG, PNG, HEIC |
| 7 | Tamanho máximo: 20MB |
| 8 | Download em alta resolução sem marca d'água |
| 9 | Email obrigatório para receber resultado |
| 10 | Pagamento via PIX ou cartão |

---

## 9. Métricas de Sucesso

### 9.1 North Star Metric
**Trial → Paid Conversion Rate**

Meta: >20%

### 9.2 Métricas Secundárias

| Métrica | Meta |
|---------|------|
| Ticket médio | >R$25 |
| Taxa de reembolso | <5% |
| Tempo médio processamento | <90s |
| NPS | >50 |

### 9.3 Metas por Período

| Período | Trials/mês | Conversão | Clientes | Receita |
|---------|------------|-----------|----------|---------|
| M3 | 1.000 | 15% | 150 | R$4.500 |
| M6 | 3.000 | 20% | 600 | R$18.000 |
| M12 | 10.000 | 25% | 2.500 | R$75.000 |

### 9.4 Tracking de Eventos ✅ Implementado (PostHog)

| Evento | Descrição | Status |
|--------|-----------|--------|
| cta_click | Clica testar grátis | ✅ |
| scroll_to_results | Scroll para resultados | ✅ |
| email_submit | Envia email | ✅ |
| upload_page_view | Acessa página upload | ✅ |
| upload_complete | Completa upload | ✅ |
| upload_error | Erro no upload | ✅ |
| processing_start | Inicia processamento | ✅ |
| processing_complete | Processamento concluído | ✅ |
| processing_error | Erro no processamento | ✅ |
| result_view | Visualiza resultado | ✅ |
| download_click | Clica download | ✅ |
| share_click | Clica compartilhar | ✅ |
| checkout_view | Acessa checkout | ✅ |
| plan_select | Seleciona plano | ✅ |
| payment_method_select | Seleciona método | ✅ |
| payment_complete | Pagamento confirmado | ✅ |
| adjust_page_view | Acessa página ajuste | ✅ |
| adjustment_submit | Envia ajuste | ✅ |
| adjustment_cancel | Cancela ajuste | ✅ |
| refund_submit | Solicita reembolso | ✅ |

---

## 10. Escopo e Priorização

### 10.1 MVP (Fase 1)

**Must Have:**
- [x] Landing page completa
- [x] Captura de email
- [x] Upload de foto (galeria + câmera)
- [x] Integração fal.ai funcionando
- [x] Tela de processamento
- [x] Resultado com slider antes/depois
- [x] Download da foto
- [ ] Checkout com PIX (Abacate Pay) ⚠️ UI pronta, integração pendente
- [x] Confirmação de pagamento (UI)
- [x] Sistema de créditos (localStorage)

### 10.2 Fase 2

**Should Have:**
- [ ] Checkout com cartão (Stripe) ⚠️ Não integrado
- [x] Loop de restauração paga
- [x] Fluxo de ajustes
- [ ] Emails transacionais (Resend) ❌ Não implementado
- [x] Analytics completo (PostHog)

### 10.3 Fase 3

**Nice to Have:**
- PWA completo
- Notificações push
- Histórico de restaurações
- Compartilhamento direto WhatsApp
- Programa de indicação

### 10.4 Futuro

**Won't Have (agora):**
- App nativo
- Colorização de P&B
- Animação de fotos
- Impressão em quadro
- Assinatura mensal
- Banco de dados (Supabase)
- Autenticação completa

---

## 11. Limitações e Riscos

### 11.1 Limitações Técnicas
- IA não faz milagre em fotos muito destruídas
- Rostos muito pequenos = resultado pior
- Fotos em grupo = mais complexo
- Depende de conexão com internet

### 11.2 Edge Cases

| Situação | Tratamento |
|----------|------------|
| Foto já digital | Aceita, mas resultado pode ser inferior |
| Foto muito pesada | Erro com sugestão de comprimir |
| Formato inválido | Erro com formatos aceitos |
| Processamento travou | Retry automático, depois erro |
| Foto com direitos autorais | Aceita (responsabilidade do usuário) |

### 11.3 Dependências Externas

| Dependência | Risco | Mitigação |
|-------------|-------|-----------|
| fal.ai | Se cair, produto para | Arquitetura que permita trocar |
| Stripe | Se cair, não processa cartão | PIX como alternativa |
| Abacate Pay | Se cair, não processa PIX | Cartão como alternativa |
| AWS S3 | Se cair, não armazena | CDN alternativa |

### 11.4 Riscos de Negócio

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Concorrente grande lança feature grátis | Média | Alto | Diferencial em qualidade e suporte |
| API de IA aumenta preço | Baixa | Médio | Margem alta absorve aumento |
| Baixa conversão do trial | Média | Alto | Otimizar landing e onboarding |
| Uso único (sem recompra) | Alta | Médio | Programa de indicação, pacotes família |

---

## 12. Distribuição e Lançamento

### 12.1 Canais de Aquisição

| Canal | Estratégia |
|-------|------------|
| Meta Ads | Público 35-65, interesse família/genealogia |
| Google Ads | "restaurar foto antiga", "recuperar foto" |
| SEO | Blog sobre preservação de memórias |
| WhatsApp | Viralização via compartilhamento |
| Facebook Groups | Genealogia, história da família |
| Parcerias | Influencers de genealogia |

### 12.2 Aprovação em Stores
Não necessário no MVP (web only).

### 12.3 Beta
Não terá. Lançamento direto.

### 12.4 Suporte Pós-Lançamento
- WhatsApp Business: atendimento 1:1
- FAQ na landing page
- Email para casos complexos
- SLA: resposta em até 4h (horário comercial)

---

## 13. UX Writing

### 13.1 Tom de Voz
Conversa de amigo que entende de tecnologia mas não fala difícil. Usa "a gente" em vez de "nós". Frases curtas. Sem jargão.

### 13.2 Princípios
- Clareza sobre criatividade
- Confiança através de transparência
- Empatia nos erros
- Celebração nos sucessos

### 13.3 Palavras a Evitar
Processamento, upload, download, plataforma, sistema, algoritmo, termos técnicos, linguagem corporativa.

### 13.4 Palavras a Usar
Foto, memória, família, restaurar, recuperar, salvar, enviar, receber, baixar, mandar.

---

## 14. Variáveis de Ambiente

```env
# fal.ai
FAL_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Abacate Pay
ABACATE_API_KEY=
ABACATE_WEBHOOK_SECRET=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=

# Resend
RESEND_API_KEY=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# App
NEXT_PUBLIC_APP_URL=
```

---

## 15. Estrutura de Pastas

```
/src
  /app                              # Páginas Next.js (App Router)
    /page.tsx                       # Landing page
    /start/page.tsx                 # Captura de email
    /upload/page.tsx                # Upload de foto
    /processing/page.tsx            # Tela de processamento
    /result/page.tsx                # Resultado da restauração
    /adjust/page.tsx                # Pedir ajuste
    /adjustment-result/page.tsx     # Resultado do ajuste
    /checkout/page.tsx              # Checkout/planos
    /payment-confirmed/page.tsx     # Confirmação pagamento
    /refund/page.tsx                # Solicitar reembolso
    /refund-confirmed/page.tsx      # Confirmação reembolso
    /error/page.tsx                 # Página de erro
    /termos/page.tsx                # ✅ Termos de Uso
    /privacidade/page.tsx           # ✅ Política de Privacidade
    /api
      /upload/route.ts              # ✅ Upload para S3
      /restore/route.ts             # ✅ Restauração via fal.ai
      /adjust/route.ts              # ✅ Ajustes via fal.ai
      /download/route.ts            # ✅ Proxy de download
      /payment
        /stripe/route.ts            # ⚠️ Placeholder - Stripe
        /pix/route.ts               # ⚠️ Placeholder - Abacate Pay
        /webhook/route.ts           # ⚠️ Placeholder - Webhooks
      /email/route.ts               # ⚠️ Placeholder - Resend
  /components
    /ui                             # Componentes base (Button, Input, Card)
    /layout                         # Layout (Header, Stepper)
    /screens                        # Telas completas
    /landing                        # Componentes da landing page
  /config
    /plans.ts                       # ✅ Configuração de planos (single source of truth)
    /index.ts
  /lib
    /fal.ts                         # ✅ Integração fal.ai
    /s3.ts                          # ✅ Integração AWS S3
    /storage.ts                     # ✅ LocalStorage utilities
    /analytics.ts                   # ✅ PostHog analytics
    /utils.ts                       # ✅ Utilitários
    /stripe.ts                      # ⚠️ Placeholder
    /abacate.ts                     # ⚠️ Placeholder
    /resend.ts                      # ⚠️ Placeholder
  /hooks
    /useUser.ts                     # ✅ Estado do usuário/créditos
    /useUpload.ts                   # ✅ Upload de arquivos
    /useRestore.ts                  # ✅ Restauração
    /useAdjust.ts                   # ✅ Ajustes
    /useHydrated.ts                 # ✅ Prevenção de hydration mismatch
    /index.ts
  /types
    /index.ts                       # ✅ Tipos TypeScript
```

**Legenda:** ✅ Implementado | ⚠️ Placeholder/Pendente

---

## 16. Modelo de Dados

```typescript
interface User {
  email: string
  credits: number
  restorations: Restoration[]
}

interface Restoration {
  id: string
  originalUrl: string
  restoredUrl: string
  status: 'processing' | 'completed' | 'failed'
  createdAt: Date
  adjustments: Adjustment[]
}

interface Adjustment {
  id: string
  instructions: string
  resultUrl: string
  createdAt: Date
}

interface Payment {
  id: string
  email: string
  amount: number
  credits: number
  method: 'pix' | 'card'
  status: 'pending' | 'completed' | 'failed'
  createdAt: Date
}
```

---

## 17. Checklist de Lançamento

### Pré-Lançamento
- [x] Landing page no ar
- [x] Fluxo de trial funcionando
- [x] Integração fal.ai testada
- [ ] Pagamento PIX funcionando ⚠️ Integração Abacate Pay pendente
- [ ] Pagamento Cartão funcionando ⚠️ Integração Stripe pendente
- [ ] Emails transacionais configurados ❌ Resend não integrado
- [x] Analytics implementado (PostHog completo)
- [x] Testes em mobile
- [x] Termos de uso publicados (/termos)
- [x] Política de privacidade publicada (/privacidade)
- [ ] WhatsApp de suporte ativo

### Pós-Lançamento
- [ ] Monitorar conversão trial → paid
- [ ] Monitorar taxa de erro
- [ ] Coletar feedback dos primeiros usuários
- [ ] Ajustar copy baseado em objeções
- [ ] Otimizar performance de processamento

---

## 18. Aprovações

| Papel | Nome | Data | Status |
|-------|------|------|--------|
| Product Owner | | | Pendente |
| Tech Lead | | | Pendente |
| Design | | | Pendente |

---

**Documento criado em:** Janeiro 2025
**Última atualização:** 30 Janeiro 2025
**Próxima revisão:** Após integração de pagamentos