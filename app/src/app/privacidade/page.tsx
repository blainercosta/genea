"use client";

import Link from "next/link";

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-stone-900">
            Genea
          </Link>
          <Link
            href="/"
            className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
          >
            Voltar ao início
          </Link>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          Política de Privacidade
        </h1>
        <p className="text-stone-500 mb-4">
          Última atualização: 30 de janeiro de 2025
        </p>
        <p className="text-stone-700 mb-8">
          Esta Política de Privacidade descreve como coletamos, usamos,
          armazenamos e protegemos seus dados pessoais quando você usa o Genea,
          em conformidade com a Lei Geral de Proteção de Dados (Lei nº
          13.709/2018 - LGPD) e o Marco Civil da Internet (Lei nº 12.965/2014).
        </p>

        <div className="prose prose-stone max-w-none">
          {/* 1. Controlador dos Dados */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              1. Controlador dos Dados
            </h2>
            <p className="text-stone-700 mb-4">
              O controlador responsável pelo tratamento dos seus dados pessoais
              é:
            </p>
            <div className="bg-stone-100 rounded-lg p-4 text-stone-700">
              <p>
                <strong>Razão Social:</strong> Blainer A. P. M. Costa LTDA
              </p>
              <p>
                <strong>Nome Fantasia:</strong> Dunk Labs Inovação e Tecnologia
              </p>
              <p>
                <strong>CNPJ:</strong> 61.418.642/0001-08
              </p>
              <p>
                <strong>Endereço:</strong> Rua Pais Leme, 215, Conj 1713,
                Pinheiros, São Paulo/SP, CEP 05424-150
              </p>
              <p>
                <strong>Email:</strong> hi@dunklabs.design
              </p>
              <p className="mt-2">
                <strong>Encarregado de Proteção de Dados (DPO):</strong> Blainer
                Costa
              </p>
              <p>
                <strong>Contato do DPO:</strong> hi@dunklabs.design
              </p>
            </div>
          </section>

          {/* 2. Dados que Coletamos */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              2. Dados que Coletamos
            </h2>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              2.1 Dados Fornecidos por Você
            </h3>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full bg-white border border-stone-200 rounded-lg">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-stone-700">Dado</th>
                    <th className="px-4 py-2 text-left text-stone-700">
                      Finalidade
                    </th>
                    <th className="px-4 py-2 text-left text-stone-700">
                      Obrigatório
                    </th>
                  </tr>
                </thead>
                <tbody className="text-stone-600">
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Email</td>
                    <td className="px-4 py-2">
                      Entrega das fotos restauradas, comunicações sobre o
                      serviço
                    </td>
                    <td className="px-4 py-2">Sim</td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Fotografias</td>
                    <td className="px-4 py-2">Processamento e restauração</td>
                    <td className="px-4 py-2">Sim</td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Chave PIX</td>
                    <td className="px-4 py-2">Processamento de reembolsos</td>
                    <td className="px-4 py-2">Apenas se solicitar reembolso</td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Instruções de ajuste</td>
                    <td className="px-4 py-2">
                      Personalização da restauração
                    </td>
                    <td className="px-4 py-2">Não</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              2.2 Dados Coletados Automaticamente
            </h3>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full bg-white border border-stone-200 rounded-lg">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-stone-700">Dado</th>
                    <th className="px-4 py-2 text-left text-stone-700">
                      Finalidade
                    </th>
                  </tr>
                </thead>
                <tbody className="text-stone-600">
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Endereço IP</td>
                    <td className="px-4 py-2">
                      Segurança, prevenção de fraudes, análise de uso
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Dados do dispositivo</td>
                    <td className="px-4 py-2">
                      Otimização do serviço para seu dispositivo
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Dados de navegação</td>
                    <td className="px-4 py-2">
                      Melhoria da experiência do usuário
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Cookies</td>
                    <td className="px-4 py-2">
                      Funcionamento do site, análise de uso
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              2.3 Dados de Pagamento
            </h3>
            <p className="text-stone-700 mb-4">
              Os dados de pagamento (número do cartão, dados bancários) são
              processados diretamente por nossos parceiros de pagamento (Stripe
              e Abacate Pay) e não são armazenados em nossos servidores. Para
              informações sobre como esses parceiros tratam seus dados, consulte
              suas respectivas políticas de privacidade.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              2.4 Dados Biométricos
            </h3>
            <p className="text-stone-700">
              As fotografias enviadas podem conter dados biométricos
              (características faciais). Esses dados são processados
              exclusivamente para a finalidade de restauração da imagem e não
              são utilizados para identificação pessoal, criação de perfis
              biométricos ou qualquer outra finalidade.
            </p>
          </section>

          {/* 3. Como Usamos Seus Dados */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              3. Como Usamos Seus Dados
            </h2>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              3.1 Finalidades do Tratamento
            </h3>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full bg-white border border-stone-200 rounded-lg">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-stone-700">
                      Finalidade
                    </th>
                    <th className="px-4 py-2 text-left text-stone-700">
                      Base Legal (LGPD)
                    </th>
                  </tr>
                </thead>
                <tbody className="text-stone-600">
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">
                      Prestar o serviço de restauração de fotos
                    </td>
                    <td className="px-4 py-2">
                      Execução de contrato (Art. 7º, V)
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">
                      Enviar fotos restauradas por email
                    </td>
                    <td className="px-4 py-2">
                      Execução de contrato (Art. 7º, V)
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Processar pagamentos</td>
                    <td className="px-4 py-2">
                      Execução de contrato (Art. 7º, V)
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Processar reembolsos</td>
                    <td className="px-4 py-2">
                      Execução de contrato (Art. 7º, V)
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">
                      Responder suas solicitações de suporte
                    </td>
                    <td className="px-4 py-2">
                      Execução de contrato (Art. 7º, V)
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Melhorar nosso serviço</td>
                    <td className="px-4 py-2">
                      Legítimo interesse (Art. 7º, IX)
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">
                      Análise de uso e estatísticas
                    </td>
                    <td className="px-4 py-2">
                      Legítimo interesse (Art. 7º, IX)
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Prevenção de fraudes</td>
                    <td className="px-4 py-2">
                      Legítimo interesse (Art. 7º, IX)
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">
                      Cumprimento de obrigações legais
                    </td>
                    <td className="px-4 py-2">
                      Cumprimento de obrigação legal (Art. 7º, II)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              3.2 O que Não Fazemos com Seus Dados
            </h3>
            <ul className="list-disc list-inside text-stone-700 space-y-2">
              <li>Não vendemos seus dados pessoais</li>
              <li>
                Não compartilhamos suas fotos com terceiros para fins de
                marketing
              </li>
              <li>
                Não usamos suas fotos para treinar modelos de inteligência
                artificial
              </li>
              <li>
                Não criamos perfis de comportamento para publicidade direcionada
              </li>
              <li>Não enviamos spam ou comunicações não solicitadas</li>
            </ul>
          </section>

          {/* 4. Compartilhamento de Dados */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              4. Compartilhamento de Dados
            </h2>
            <p className="text-stone-700 mb-4">
              Compartilhamos seus dados apenas nas seguintes situações:
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              4.1 Prestadores de Serviço
            </h3>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full bg-white border border-stone-200 rounded-lg">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-stone-700">
                      Parceiro
                    </th>
                    <th className="px-4 py-2 text-left text-stone-700">
                      Dados Compartilhados
                    </th>
                    <th className="px-4 py-2 text-left text-stone-700">
                      Finalidade
                    </th>
                  </tr>
                </thead>
                <tbody className="text-stone-600">
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">fal.ai</td>
                    <td className="px-4 py-2">Fotografias</td>
                    <td className="px-4 py-2">
                      Processamento de IA para restauração
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Amazon Web Services (AWS)</td>
                    <td className="px-4 py-2">Fotografias</td>
                    <td className="px-4 py-2">Armazenamento temporário</td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Stripe</td>
                    <td className="px-4 py-2">Dados de pagamento</td>
                    <td className="px-4 py-2">
                      Processamento de pagamentos com cartão
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Abacate Pay</td>
                    <td className="px-4 py-2">Dados de pagamento</td>
                    <td className="px-4 py-2">
                      Processamento de pagamentos via PIX
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Resend</td>
                    <td className="px-4 py-2">Email</td>
                    <td className="px-4 py-2">
                      Envio de emails transacionais
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">PostHog</td>
                    <td className="px-4 py-2">Dados de navegação</td>
                    <td className="px-4 py-2">Análise de uso</td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Vercel</td>
                    <td className="px-4 py-2">Dados de acesso</td>
                    <td className="px-4 py-2">Hospedagem do serviço</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-stone-700 mb-4">
              Todos os prestadores de serviço estão sujeitos a obrigações
              contratuais de confidencialidade e segurança.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              4.2 Obrigações Legais
            </h3>
            <p className="text-stone-700 mb-4">
              Podemos compartilhar dados quando exigido por lei, ordem judicial
              ou autoridade competente.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              4.3 Proteção de Direitos
            </h3>
            <p className="text-stone-700">
              Podemos compartilhar dados quando necessário para proteger nossos
              direitos, propriedade ou segurança, ou de terceiros.
            </p>
          </section>

          {/* 5. Transferência Internacional de Dados */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              5. Transferência Internacional de Dados
            </h2>
            <p className="text-stone-700 mb-4">
              Alguns de nossos prestadores de serviço estão localizados fora do
              Brasil (Estados Unidos e outros países). Ao usar o Serviço, você
              consente com a transferência de seus dados para esses países.
            </p>
            <p className="text-stone-700 mb-2">
              Garantimos que essas transferências são realizadas com salvaguardas
              adequadas, conforme exigido pela LGPD (Art. 33), incluindo:
            </p>
            <ul className="list-disc list-inside text-stone-700 space-y-2">
              <li>Cláusulas contratuais padrão</li>
              <li>
                Prestadores de serviço certificados em frameworks de proteção de
                dados
              </li>
              <li>Países com nível adequado de proteção de dados</li>
            </ul>
          </section>

          {/* 6. Armazenamento e Retenção */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              6. Armazenamento e Retenção
            </h2>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              6.1 Período de Retenção
            </h3>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full bg-white border border-stone-200 rounded-lg">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-stone-700">Dado</th>
                    <th className="px-4 py-2 text-left text-stone-700">
                      Período de Retenção
                    </th>
                  </tr>
                </thead>
                <tbody className="text-stone-600">
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Email</td>
                    <td className="px-4 py-2">
                      Enquanto você usar o serviço ou até solicitar exclusão
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Fotografias originais</td>
                    <td className="px-4 py-2">
                      Até 30 dias após o processamento
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Fotografias restauradas</td>
                    <td className="px-4 py-2">
                      Até 30 dias após o processamento
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Dados de pagamento</td>
                    <td className="px-4 py-2">
                      Conforme exigido por lei (5 anos para fins fiscais)
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Logs de acesso</td>
                    <td className="px-4 py-2">
                      6 meses (conforme Marco Civil da Internet)
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Dados de análise</td>
                    <td className="px-4 py-2">24 meses</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              6.2 Exclusão de Dados
            </h3>
            <p className="text-stone-700">
              Após os períodos de retenção, seus dados são excluídos de forma
              segura. Você pode solicitar a exclusão antecipada de seus dados a
              qualquer momento (veja seção 7).
            </p>
          </section>

          {/* 7. Seus Direitos */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              7. Seus Direitos
            </h2>
            <p className="text-stone-700 mb-4">
              A LGPD garante a você os seguintes direitos sobre seus dados
              pessoais:
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              7.1 Direitos Garantidos
            </h3>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full bg-white border border-stone-200 rounded-lg">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-stone-700">
                      Direito
                    </th>
                    <th className="px-4 py-2 text-left text-stone-700">
                      Descrição
                    </th>
                  </tr>
                </thead>
                <tbody className="text-stone-600">
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Confirmação</td>
                    <td className="px-4 py-2">
                      Saber se tratamos seus dados
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Acesso</td>
                    <td className="px-4 py-2">Obter cópia dos seus dados</td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Correção</td>
                    <td className="px-4 py-2">
                      Corrigir dados incompletos ou inexatos
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Anonimização</td>
                    <td className="px-4 py-2">
                      Solicitar anonimização de dados desnecessários
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Bloqueio</td>
                    <td className="px-4 py-2">
                      Solicitar bloqueio de dados desnecessários
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Eliminação</td>
                    <td className="px-4 py-2">
                      Solicitar exclusão dos seus dados
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Portabilidade</td>
                    <td className="px-4 py-2">
                      Receber seus dados em formato estruturado
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Informação</td>
                    <td className="px-4 py-2">
                      Saber com quem compartilhamos seus dados
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Revogação</td>
                    <td className="px-4 py-2">
                      Revogar consentimento a qualquer momento
                    </td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Oposição</td>
                    <td className="px-4 py-2">
                      Opor-se a tratamento que viole a LGPD
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              7.2 Como Exercer Seus Direitos
            </h3>
            <p className="text-stone-700 mb-4">
              Para exercer qualquer desses direitos, entre em contato:
            </p>
            <div className="bg-stone-100 rounded-lg p-4 text-stone-700 mb-4">
              <p>
                <strong>Email:</strong> hi@dunklabs.design
              </p>
              <p>
                <strong>Assunto:</strong> Solicitação de Titular de Dados
              </p>
            </div>
            <p className="text-stone-700 mb-4">
              Responderemos sua solicitação em até 15 dias, conforme a LGPD.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              7.3 Verificação de Identidade
            </h3>
            <p className="text-stone-700">
              Para proteger seus dados, podemos solicitar informações adicionais
              para verificar sua identidade antes de atender solicitações.
            </p>
          </section>

          {/* 8. Segurança dos Dados */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              8. Segurança dos Dados
            </h2>
            <p className="text-stone-700 mb-4">
              Implementamos medidas técnicas e organizacionais para proteger
              seus dados:
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              8.1 Medidas Técnicas
            </h3>
            <ul className="list-disc list-inside text-stone-700 space-y-2 mb-4">
              <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
              <li>Criptografia de dados em repouso</li>
              <li>Controle de acesso baseado em função</li>
              <li>Monitoramento de segurança</li>
              <li>Backups regulares</li>
            </ul>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              8.2 Medidas Organizacionais
            </h3>
            <ul className="list-disc list-inside text-stone-700 space-y-2 mb-4">
              <li>Acesso restrito a dados pessoais</li>
              <li>Treinamento de equipe em proteção de dados</li>
              <li>Políticas internas de segurança</li>
              <li>Avaliação regular de riscos</li>
            </ul>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              8.3 Incidentes de Segurança
            </h3>
            <p className="text-stone-700">
              Em caso de incidente de segurança que possa causar risco ou dano,
              notificaremos você e a Autoridade Nacional de Proteção de Dados
              (ANPD) conforme exigido pela LGPD.
            </p>
          </section>

          {/* 9. Cookies e Tecnologias Similares */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              9. Cookies e Tecnologias Similares
            </h2>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              9.1 O que São Cookies
            </h3>
            <p className="text-stone-700 mb-4">
              Cookies são pequenos arquivos de texto armazenados no seu
              dispositivo quando você acessa nosso site.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              9.2 Cookies que Utilizamos
            </h3>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full bg-white border border-stone-200 rounded-lg">
                <thead className="bg-stone-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-stone-700">Tipo</th>
                    <th className="px-4 py-2 text-left text-stone-700">
                      Finalidade
                    </th>
                    <th className="px-4 py-2 text-left text-stone-700">
                      Duração
                    </th>
                  </tr>
                </thead>
                <tbody className="text-stone-600">
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Essenciais</td>
                    <td className="px-4 py-2">Funcionamento básico do site</td>
                    <td className="px-4 py-2">Sessão</td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Funcionais</td>
                    <td className="px-4 py-2">Lembrar suas preferências</td>
                    <td className="px-4 py-2">1 ano</td>
                  </tr>
                  <tr className="border-t border-stone-200">
                    <td className="px-4 py-2">Analíticos</td>
                    <td className="px-4 py-2">
                      Entender como você usa o site
                    </td>
                    <td className="px-4 py-2">2 anos</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              9.3 Gerenciamento de Cookies
            </h3>
            <p className="text-stone-700 mb-4">
              Você pode configurar seu navegador para recusar cookies ou
              alertá-lo quando cookies estiverem sendo enviados. Note que
              algumas funcionalidades do site podem não funcionar corretamente
              sem cookies.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              9.4 Analytics
            </h3>
            <p className="text-stone-700">
              Utilizamos PostHog para análise de uso. O PostHog coleta dados
              anonimizados sobre como você interage com nosso site. Você pode
              optar por não participar dessa coleta através das configurações do
              seu navegador.
            </p>
          </section>

          {/* 10. Menores de Idade */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              10. Menores de Idade
            </h2>
            <p className="text-stone-700">
              O Serviço não é destinado a menores de 18 anos. Não coletamos
              intencionalmente dados de menores. Se você é pai ou responsável e
              acredita que seu filho nos forneceu dados pessoais, entre em
              contato conosco.
            </p>
          </section>

          {/* 11. Links para Terceiros */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              11. Links para Terceiros
            </h2>
            <p className="text-stone-700">
              Nosso site pode conter links para sites de terceiros. Esta
              Política de Privacidade não se aplica a esses sites. Recomendamos
              que você leia as políticas de privacidade de qualquer site que
              visitar.
            </p>
          </section>

          {/* 12. Alterações nesta Política */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              12. Alterações nesta Política
            </h2>
            <p className="text-stone-700 mb-2">
              Podemos atualizar esta Política de Privacidade periodicamente.
              Alterações significativas serão comunicadas por:
            </p>
            <ul className="list-disc list-inside text-stone-700 space-y-2 mb-4">
              <li>Aviso no site</li>
              <li>Email para usuários cadastrados</li>
            </ul>
            <p className="text-stone-700">
              A data da última atualização está indicada no topo desta página.
              Recomendamos que você revise esta Política periodicamente.
            </p>
          </section>

          {/* 13. Autoridade Nacional de Proteção de Dados */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              13. Autoridade Nacional de Proteção de Dados
            </h2>
            <p className="text-stone-700 mb-4">
              Se você acredita que seus direitos foram violados ou tem
              reclamações sobre o tratamento de seus dados, você pode entrar em
              contato com a Autoridade Nacional de Proteção de Dados (ANPD):
            </p>
            <div className="bg-stone-100 rounded-lg p-4 text-stone-700 mb-4">
              <p>
                <strong>Site:</strong>{" "}
                <a
                  href="https://www.gov.br/anpd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-800 underline"
                >
                  https://www.gov.br/anpd
                </a>
              </p>
              <p>
                <strong>Email:</strong> anpd@anpd.gov.br
              </p>
            </div>
            <p className="text-stone-700">
              Recomendamos que você entre em contato conosco primeiro para
              tentarmos resolver a questão diretamente.
            </p>
          </section>

          {/* 14. Contato */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              14. Contato
            </h2>
            <p className="text-stone-700 mb-4">
              Para dúvidas sobre esta Política de Privacidade ou sobre o
              tratamento de seus dados:
            </p>
            <div className="bg-stone-100 rounded-lg p-4 text-stone-700">
              <p>
                <strong>Controlador:</strong> Blainer A. P. M. Costa LTDA
              </p>
              <p>
                <strong>Encarregado (DPO):</strong> Blainer Costa
              </p>
              <p>
                <strong>Email:</strong> hi@dunklabs.design
              </p>
              <p>
                <strong>Endereço:</strong> Rua Pais Leme, 215, Conj 1713,
                Pinheiros, São Paulo/SP, CEP 05424-150
              </p>
            </div>
          </section>

          {/* 15. Consentimento */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              15. Consentimento
            </h2>
            <p className="text-stone-700 mb-2">
              Ao usar o Genea, você declara que:
            </p>
            <ul className="list-disc list-inside text-stone-700 space-y-2 mb-4">
              <li>Leu e compreendeu esta Política de Privacidade</li>
              <li>
                Concorda com a coleta e uso dos seus dados conforme descrito
              </li>
              <li>Tem pelo menos 18 anos de idade</li>
            </ul>
            <p className="text-stone-700">
              Para fotografias que contenham imagens de terceiros, você declara
              ter autorização dessas pessoas para o processamento.
            </p>
          </section>

          {/* Final */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
            <p className="text-stone-700 italic text-sm">
              Esta Política de Privacidade foi elaborada em conformidade com a
              Lei Geral de Proteção de Dados (Lei nº 13.709/2018), o Marco Civil
              da Internet (Lei nº 12.965/2014) e o Código de Defesa do
              Consumidor (Lei nº 8.078/1990).
            </p>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2025 Genea. Todos os direitos reservados.</p>
          <div className="mt-2 space-x-4">
            <Link href="/termos" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link
              href="/privacidade"
              className="hover:text-white transition-colors"
            >
              Política de Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
