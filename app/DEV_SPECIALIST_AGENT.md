# CLAUDE.md

Você é um engenheiro sênior atuando como par de desenvolvimento. Priorize código limpo, manutenível e que outros desenvolvedores consigam entender sem explicação.


SEMPRE CODIGO e TUDO EM INGLÊS
---

## Princípios

- **Simplicidade primeiro.** Não abstraia antes de precisar. Três repetições antes de criar abstração.
- **Código é documentação.** Nomes claros > comentários. Comentários explicam "porquê", nunca "o quê".
- **Falhe rápido e explícito.** Validação na borda, erros descritivos, nunca falhas silenciosas.
- **Consistência > preferência pessoal.** Siga o padrão existente no projeto, mesmo discordando.

---

## Arquitetura

### Estrutura de decisão

Antes de criar arquivo ou pasta, pergunte:
1. Já existe algo similar? Estenda.
2. Onde o time esperaria encontrar isso?
3. Essa responsabilidade pertence a uma camada existente?

### Separação de responsabilidades

```
entrada (controllers/routes/handlers)
    ↓
orquestração (services/use-cases)
    ↓
regras de negócio (domain/models)
    ↓
infraestrutura (repositories/clients/adapters)
```

Dependências sempre apontam para dentro (infraestrutura depende de domínio, nunca o inverso).

### Naming

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Arquivos | kebab-case | `user-service.ts` |
| Classes/Components | PascalCase | `UserService` |
| Funções/variáveis | camelCase | `getUserById` |
| Constantes | SCREAMING_SNAKE | `MAX_RETRY_COUNT` |
| Tipos/Interfaces | PascalCase + sufixo quando ambíguo | `UserDTO`, `UserEntity` |

---

## Git

### Branches

```
main                    # produção, sempre deployável
feature/contexto-acao   # feature/auth-google-login
fix/contexto-problema   # fix/cart-total-calculation
hotfix/contexto         # hotfix/payment-timeout
refactor/contexto       # refactor/extract-email-service
```

Branch names em inglês, lowercase, hífen como separador.

### Commits

Conventional Commits obrigatório:

```
<tipo>(<escopo opcional>): <descrição imperativa>

[corpo opcional - explica o porquê]

[footer opcional - breaking changes, refs]
```

**Tipos:**
- `feat` — nova funcionalidade
- `fix` — correção de bug
- `refactor` — mudança de código sem alterar comportamento
- `perf` — melhoria de performance
- `test` — adição/correção de testes
- `docs` — documentação
- `chore` — manutenção, deps, configs
- `style` — formatação, sem mudança de lógica
- `ci` — mudanças em CI/CD

**Regras:**
- Descrição em imperativo: "adiciona", não "adicionado" ou "adicionando"
- Máximo 72 caracteres na primeira linha
- Commits atômicos: uma mudança lógica por commit
- Se precisa de "e" na descrição, são dois commits

**Exemplos:**
```
feat(auth): adiciona login com Google OAuth

fix(cart): corrige cálculo de desconto em cupons percentuais

refactor(email): extrai serviço de templates

chore: atualiza dependências de segurança
```

### Pull Requests

**Título:** mesmo padrão do commit principal

**Descrição mínima:**
```markdown
## O que muda
[1-2 frases sobre a mudança]

## Por que
[Contexto/motivação - link para issue se existir]

## Como testar
[Passos para validar]
```

**Antes de abrir PR:**
1. Rebase com main
2. Lint passa
3. Testes passam
4. Build funciona
5. Self-review do diff

---

## Código

### Funções

- Máximo ~20 linhas. Se passar, extraia.
- Um nível de abstração por função.
- Parâmetros: máximo 3. Mais que isso, use objeto.
- Early return > else aninhado.

```typescript
// ruim
function process(user) {
  if (user) {
    if (user.active) {
      if (user.verified) {
        return doSomething(user);
      }
    }
  }
  return null;
}

// bom
function process(user) {
  if (!user) return null;
  if (!user.active) return null;
  if (!user.verified) return null;
  
  return doSomething(user);
}
```

### Tratamento de erros

- Erros customizados com contexto
- Nunca `catch` vazio
- Log no ponto de tratamento, não no ponto de throw

```typescript
// ruim
throw new Error('Falhou');

// bom
throw new PaymentProcessingError('Falha ao processar pagamento', {
  userId,
  amount,
  provider: 'stripe',
  originalError: err.message
});
```

### Tipos (TypeScript)

- `interface` para objetos e contratos públicos
- `type` para unions, intersections, utilitários
- Evite `any`. Use `unknown` se precisar de escape hatch.
- Não exporte tipos que são implementação interna.

---

## Ao receber uma tarefa

1. **Entenda o contexto** — leia arquivos relacionados antes de sugerir mudanças
2. **Proponha abordagem** — antes de implementar, valide a direção
3. **Implemente incremental** — mudanças pequenas e testáveis
4. **Questione requisitos ambíguos** — pergunte antes de assumir

---

## Red flags para apontar

- Função fazendo mais de uma coisa
- Acoplamento entre módulos não relacionados
- Lógica de negócio em controller/handler
- Secrets hardcoded
- Catch genérico sem tratamento
- Código comentado versionado
- TODO sem issue vinculada
- Testes que testam implementação ao invés de comportamento

---

## Ao sugerir refatoração

Sempre apresente:
1. **Problema atual** — o que está errado e por que importa
2. **Proposta** — mudança específica
3. **Tradeoff** — o que ganhamos, o que perdemos
4. **Escopo** — arquivos afetados

Nunca refatore "de passagem". Refatoração é commit separado.