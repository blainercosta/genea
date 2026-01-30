export function PrivacyContent() {
  return (
    <div className="prose prose-stone max-w-none text-sm">
      <p className="text-stone-500 mb-4">
        Última atualização: 30 de janeiro de 2025
      </p>
      <p className="text-stone-700 mb-6 text-sm">
        Esta Política descreve como coletamos, usamos e protegemos seus dados
        em conformidade com a LGPD (Lei nº 13.709/2018).
      </p>

      {/* 1. Controlador */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-3">
          1. Controlador dos Dados
        </h3>
        <div className="bg-stone-100 rounded-lg p-3 text-stone-700 text-xs">
          <p><strong>Razão Social:</strong> Blainer A. P. M. Costa LTDA</p>
          <p><strong>CNPJ:</strong> 61.418.642/0001-08</p>
          <p><strong>Email:</strong> hi@dunklabs.design</p>
          <p><strong>DPO:</strong> Blainer Costa (hi@dunklabs.design)</p>
        </div>
      </section>

      {/* 2. Dados Coletados */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-3">
          2. Dados que Coletamos
        </h3>
        <p className="text-stone-700 mb-2 font-medium text-sm">Dados fornecidos por você:</p>
        <ul className="list-disc list-inside text-stone-700 space-y-1 text-sm mb-3">
          <li>Email (obrigatório) - entrega das fotos</li>
          <li>Fotografias (obrigatório) - processamento</li>
          <li>Chave PIX - apenas para reembolsos</li>
        </ul>
        <p className="text-stone-700 mb-2 font-medium text-sm">Dados automáticos:</p>
        <ul className="list-disc list-inside text-stone-700 space-y-1 text-sm">
          <li>IP, dispositivo, navegação (segurança e melhoria)</li>
          <li>Cookies (funcionamento do site)</li>
        </ul>
      </section>

      {/* 3. Como Usamos */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-3">
          3. Como Usamos Seus Dados
        </h3>
        <ul className="list-disc list-inside text-stone-700 space-y-1 text-sm mb-3">
          <li>Prestar o serviço de restauração</li>
          <li>Enviar fotos restauradas por email</li>
          <li>Processar pagamentos e reembolsos</li>
          <li>Suporte ao cliente</li>
          <li>Melhoria do serviço e análise de uso</li>
        </ul>
        <p className="text-stone-700 font-medium text-sm mb-2">O que NÃO fazemos:</p>
        <ul className="list-disc list-inside text-stone-700 space-y-1 text-sm">
          <li>Não vendemos seus dados</li>
          <li>Não usamos fotos para treinar IA</li>
          <li>Não enviamos spam</li>
        </ul>
      </section>

      {/* 4. Compartilhamento */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-3">
          4. Compartilhamento
        </h3>
        <p className="text-stone-700 mb-2 text-sm">Compartilhamos dados apenas com:</p>
        <ul className="list-disc list-inside text-stone-700 space-y-1 text-sm">
          <li>fal.ai - processamento de IA</li>
          <li>AWS - armazenamento temporário</li>
          <li>Stripe/Abacate Pay - pagamentos</li>
          <li>Resend - envio de emails</li>
          <li>PostHog - análise de uso</li>
        </ul>
      </section>

      {/* 5. Retenção */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-3">
          5. Armazenamento e Retenção
        </h3>
        <ul className="list-disc list-inside text-stone-700 space-y-1 text-sm">
          <li>Fotografias: até 30 dias após processamento</li>
          <li>Email: enquanto usar o serviço</li>
          <li>Dados de pagamento: 5 anos (fiscal)</li>
          <li>Logs de acesso: 6 meses (Marco Civil)</li>
        </ul>
      </section>

      {/* 6. Seus Direitos */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-3">
          6. Seus Direitos (LGPD)
        </h3>
        <ul className="list-disc list-inside text-stone-700 space-y-1 text-sm mb-3">
          <li>Acesso - obter cópia dos seus dados</li>
          <li>Correção - corrigir dados inexatos</li>
          <li>Eliminação - solicitar exclusão</li>
          <li>Portabilidade - receber em formato estruturado</li>
          <li>Revogação - revogar consentimento</li>
        </ul>
        <p className="text-stone-700 text-sm">
          Para exercer: hi@dunklabs.design (resposta em até 15 dias)
        </p>
      </section>

      {/* 7. Segurança */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-3">
          7. Segurança
        </h3>
        <ul className="list-disc list-inside text-stone-700 space-y-1 text-sm">
          <li>Criptografia em trânsito (HTTPS/TLS)</li>
          <li>Criptografia em repouso</li>
          <li>Controle de acesso restrito</li>
          <li>Monitoramento contínuo</li>
        </ul>
      </section>

      {/* 8. Cookies */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-3">
          8. Cookies
        </h3>
        <ul className="list-disc list-inside text-stone-700 space-y-1 text-sm">
          <li>Essenciais - funcionamento básico</li>
          <li>Funcionais - suas preferências</li>
          <li>Analíticos - entender uso (PostHog)</li>
        </ul>
      </section>

      {/* 9. ANPD */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-3">
          9. Autoridade Nacional
        </h3>
        <p className="text-stone-700 text-sm mb-2">
          Se seus direitos foram violados, contate a ANPD:
        </p>
        <div className="bg-stone-100 rounded-lg p-3 text-stone-700 text-xs">
          <p><strong>Site:</strong> gov.br/anpd</p>
          <p><strong>Email:</strong> anpd@anpd.gov.br</p>
        </div>
      </section>

      {/* 10. Contato */}
      <section className="mb-4">
        <h3 className="text-lg font-semibold text-stone-900 mb-3">
          10. Contato
        </h3>
        <div className="bg-stone-100 rounded-lg p-3 text-stone-700 text-xs">
          <p><strong>Controlador:</strong> Blainer A. P. M. Costa LTDA</p>
          <p><strong>DPO:</strong> Blainer Costa</p>
          <p><strong>Email:</strong> hi@dunklabs.design</p>
        </div>
      </section>

      {/* Final */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
        <p className="text-stone-700 italic text-xs">
          Esta Política está em conformidade com a LGPD (Lei nº 13.709/2018),
          Marco Civil da Internet e CDC.
        </p>
      </div>
    </div>
  );
}
