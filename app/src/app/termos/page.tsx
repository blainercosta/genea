"use client";

import Link from "next/link";

export default function TermosPage() {
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
          Termos de Uso
        </h1>
        <p className="text-stone-500 mb-8">
          Última atualização: 30 de janeiro de 2025
        </p>

        <div className="prose prose-stone max-w-none">
          {/* 1. Identificação */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              1. Identificação
            </h2>
            <p className="text-stone-700 mb-4">
              Este serviço é oferecido por:
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
            </div>
          </section>

          {/* 2. Aceitação dos Termos */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              2. Aceitação dos Termos
            </h2>
            <p className="text-stone-700 mb-4">
              Ao acessar ou usar o Genea (&quot;Serviço&quot;), você concorda com
              estes Termos de Uso. Se não concordar, não use o Serviço.
            </p>
            <p className="text-stone-700">
              O uso do Serviço também está sujeito à nossa{" "}
              <Link
                href="/privacidade"
                className="text-amber-700 hover:text-amber-800 underline"
              >
                Política de Privacidade
              </Link>
              .
            </p>
          </section>

          {/* 3. Descrição do Serviço */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              3. Descrição do Serviço
            </h2>
            <p className="text-stone-700 mb-4">
              O Genea é um serviço de restauração digital de fotografias antigas
              usando inteligência artificial. O Serviço permite que você:
            </p>
            <ul className="list-disc list-inside text-stone-700 space-y-2">
              <li>Envie fotografias danificadas ou deterioradas</li>
              <li>Receba versões restauradas dessas fotografias</li>
              <li>Solicite ajustes nas restaurações</li>
              <li>Baixe as fotografias restauradas</li>
            </ul>
          </section>

          {/* 4. Cadastro e Acesso */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              4. Cadastro e Acesso
            </h2>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              4.1 Requisitos
            </h3>
            <p className="text-stone-700 mb-4">
              Para usar o Serviço, você deve:
            </p>
            <ul className="list-disc list-inside text-stone-700 space-y-2 mb-4">
              <li>Ter pelo menos 18 anos ou ser emancipado</li>
              <li>Fornecer um endereço de email válido</li>
              <li>Aceitar estes Termos de Uso e a Política de Privacidade</li>
            </ul>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              4.2 Veracidade das Informações
            </h3>
            <p className="text-stone-700">
              Você é responsável pela veracidade das informações fornecidas.
              Informações falsas podem resultar na suspensão do acesso ao
              Serviço.
            </p>
          </section>

          {/* 5. Uso do Serviço */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              5. Uso do Serviço
            </h2>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              5.1 Uso Permitido
            </h3>
            <p className="text-stone-700 mb-4">
              Você pode usar o Serviço para restaurar fotografias pessoais ou de
              família para uso próprio, não comercial.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              5.2 Uso Proibido
            </h3>
            <p className="text-stone-700 mb-2">
              É proibido usar o Serviço para:
            </p>
            <ul className="list-disc list-inside text-stone-700 space-y-2 mb-4">
              <li>Restaurar imagens que você não tem direito de usar</li>
              <li>
                Criar, distribuir ou armazenar conteúdo ilegal, ofensivo,
                difamatório ou que viole direitos de terceiros
              </li>
              <li>
                Restaurar imagens que contenham nudez de menores ou qualquer
                conteúdo de abuso infantil
              </li>
              <li>
                Restaurar imagens com finalidade de fraude, falsificação de
                documentos ou engano
              </li>
              <li>
                Sobrecarregar, danificar ou prejudicar o funcionamento do
                Serviço
              </li>
              <li>Tentar acessar áreas restritas ou sistemas não autorizados</li>
              <li>Revender ou sublicenciar o Serviço sem autorização</li>
            </ul>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              5.3 Conteúdo Enviado
            </h3>
            <p className="text-stone-700 mb-2">
              Ao enviar fotografias para restauração, você declara que:
            </p>
            <ul className="list-disc list-inside text-stone-700 space-y-2 mb-4">
              <li>É o proprietário da imagem ou tem autorização para usá-la</li>
              <li>A imagem não viola direitos de terceiros</li>
              <li>A imagem não contém conteúdo ilegal</li>
            </ul>
            <p className="text-stone-700">
              Reservamo-nos o direito de recusar ou remover qualquer conteúdo
              que viole estes Termos, sem aviso prévio.
            </p>
          </section>

          {/* 6. Propriedade Intelectual */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              6. Propriedade Intelectual
            </h2>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              6.1 Suas Fotografias
            </h3>
            <p className="text-stone-700 mb-4">
              Você mantém todos os direitos sobre as fotografias originais que
              envia. Não reivindicamos propriedade sobre seu conteúdo.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              6.2 Licença de Uso
            </h3>
            <p className="text-stone-700 mb-4">
              Ao enviar fotografias, você nos concede licença limitada, não
              exclusiva, para processar, armazenar temporariamente e restaurar
              as imagens com o único propósito de fornecer o Serviço.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              6.3 Nosso Serviço
            </h3>
            <p className="text-stone-700">
              O Serviço, incluindo sua tecnologia, design, marca e conteúdo, são
              de propriedade exclusiva de Blainer A. P. M. Costa LTDA e estão
              protegidos por leis de propriedade intelectual.
            </p>
          </section>

          {/* 7. Pagamentos e Reembolsos */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              7. Pagamentos e Reembolsos
            </h2>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              7.1 Preços
            </h3>
            <p className="text-stone-700 mb-4">
              Os preços dos pacotes de créditos estão disponíveis no site e
              podem ser alterados a qualquer momento, sem aviso prévio.
              Alterações não afetam créditos já adquiridos.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              7.2 Formas de Pagamento
            </h3>
            <p className="text-stone-700 mb-4">
              Aceitamos pagamento via PIX e cartão de crédito. O processamento é
              feito por terceiros (Stripe e Abacate Pay) e está sujeito aos
              termos desses serviços.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              7.3 Créditos
            </h3>
            <ul className="list-disc list-inside text-stone-700 space-y-2 mb-4">
              <li>Créditos adquiridos não expiram</li>
              <li>
                Créditos não são reembolsáveis, exceto conforme previsto na
                seção 7.4
              </li>
              <li>Créditos não são transferíveis entre contas</li>
            </ul>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              7.4 Política de Reembolso
            </h3>
            <p className="text-stone-700 mb-2">
              Oferecemos reembolso integral em até 24 horas via PIX nas
              seguintes situações:
            </p>
            <ul className="list-disc list-inside text-stone-700 space-y-2 mb-4">
              <li>
                Insatisfação com o resultado da restauração, mesmo após ajustes
              </li>
              <li>Falha técnica que impeça a entrega do serviço</li>
            </ul>
            <p className="text-stone-700 mb-4">
              Para solicitar reembolso, entre em contato pelo email
              hi@dunklabs.design ou através do próprio Serviço. O reembolso
              cancela todos os créditos restantes associados à compra.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              7.5 Direito de Arrependimento
            </h3>
            <p className="text-stone-700">
              Conforme o Código de Defesa do Consumidor (Art. 49), você pode
              desistir da compra em até 7 dias após a contratação, com reembolso
              integral dos valores pagos. Este direito não se aplica a créditos
              já utilizados.
            </p>
          </section>

          {/* 8. Disponibilidade e Suporte */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              8. Disponibilidade e Suporte
            </h2>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              8.1 Disponibilidade
            </h3>
            <p className="text-stone-700 mb-4">
              Nos esforçamos para manter o Serviço disponível 24 horas por dia,
              7 dias por semana, mas não garantimos disponibilidade
              ininterrupta. O Serviço pode ficar indisponível para manutenção ou
              por fatores fora de nosso controle.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              8.2 Suporte
            </h3>
            <p className="text-stone-700">
              Oferecemos suporte por email (hi@dunklabs.design) e WhatsApp. O
              tempo de resposta é de até 4 horas em dias úteis, horário
              comercial (9h às 18h, horário de Brasília).
            </p>
          </section>

          {/* 9. Limitação de Responsabilidade */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              9. Limitação de Responsabilidade
            </h2>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              9.1 Resultado das Restaurações
            </h3>
            <p className="text-stone-700 mb-4">
              A qualidade da restauração depende da qualidade e condição da
              imagem original. Não garantimos resultados específicos. Imagens
              muito danificadas podem ter resultados limitados.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              9.2 Limitações
            </h3>
            <p className="text-stone-700 mb-2">
              Na extensão máxima permitida por lei, não nos responsabilizamos
              por:
            </p>
            <ul className="list-disc list-inside text-stone-700 space-y-2 mb-4">
              <li>Danos indiretos, incidentais ou consequenciais</li>
              <li>
                Perda de dados ou imagens (recomendamos que você mantenha cópias
                dos originais)
              </li>
              <li>Interrupções ou falhas no Serviço</li>
              <li>Ações de terceiros</li>
              <li>Uso indevido do Serviço por você ou terceiros</li>
            </ul>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              9.3 Limite de Indenização
            </h3>
            <p className="text-stone-700">
              Nossa responsabilidade total perante você está limitada ao valor
              pago pelo Serviço nos últimos 12 meses.
            </p>
          </section>

          {/* 10. Modificações */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              10. Modificações
            </h2>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              10.1 Modificações no Serviço
            </h3>
            <p className="text-stone-700 mb-4">
              Podemos modificar, suspender ou descontinuar qualquer aspecto do
              Serviço a qualquer momento, com ou sem aviso prévio.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              10.2 Modificações nos Termos
            </h3>
            <p className="text-stone-700">
              Podemos alterar estes Termos a qualquer momento. Alterações
              significativas serão comunicadas por email ou aviso no site. O uso
              continuado do Serviço após alterações constitui aceitação dos
              novos Termos.
            </p>
          </section>

          {/* 11. Rescisão */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              11. Rescisão
            </h2>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              11.1 Por Você
            </h3>
            <p className="text-stone-700 mb-4">
              Você pode parar de usar o Serviço a qualquer momento. Para excluir
              seus dados, entre em contato pelo email hi@dunklabs.design.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              11.2 Por Nós
            </h3>
            <p className="text-stone-700 mb-4">
              Podemos suspender ou encerrar seu acesso ao Serviço, sem aviso
              prévio, se você violar estes Termos ou por qualquer outro motivo a
              nosso critério.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              11.3 Efeitos da Rescisão
            </h3>
            <p className="text-stone-700">
              Após a rescisão, você perde acesso ao Serviço e a quaisquer
              créditos não utilizados. As seções 6, 9 e 12 continuam vigentes
              após a rescisão.
            </p>
          </section>

          {/* 12. Disposições Gerais */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              12. Disposições Gerais
            </h2>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              12.1 Lei Aplicável
            </h3>
            <p className="text-stone-700 mb-4">
              Estes Termos são regidos pelas leis da República Federativa do
              Brasil.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              12.2 Foro
            </h3>
            <p className="text-stone-700 mb-4">
              Fica eleito o foro da Comarca de São Paulo/SP para dirimir
              quaisquer controvérsias, com renúncia a qualquer outro, por mais
              privilegiado que seja.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              12.3 Acordo Integral
            </h3>
            <p className="text-stone-700 mb-4">
              Estes Termos, junto com a Política de Privacidade, constituem o
              acordo integral entre você e nós sobre o uso do Serviço.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              12.4 Independência das Cláusulas
            </h3>
            <p className="text-stone-700 mb-4">
              Se qualquer disposição destes Termos for considerada inválida ou
              inexequível, as demais disposições permanecerão em pleno vigor.
            </p>

            <h3 className="text-lg font-medium text-stone-800 mb-2">
              12.5 Renúncia
            </h3>
            <p className="text-stone-700">
              A não exigência de qualquer direito ou disposição destes Termos
              não constitui renúncia a esse direito ou disposição.
            </p>
          </section>

          {/* 13. Contato */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              13. Contato
            </h2>
            <p className="text-stone-700 mb-4">
              Para dúvidas sobre estes Termos de Uso:
            </p>
            <div className="bg-stone-100 rounded-lg p-4 text-stone-700">
              <p>
                <strong>Email:</strong> hi@dunklabs.design
              </p>
              <p>
                <strong>Endereço:</strong> Rua Pais Leme, 215, Conj 1713,
                Pinheiros, São Paulo/SP, CEP 05424-150
              </p>
            </div>
          </section>

          {/* Final */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
            <p className="text-stone-700 italic">
              Ao usar o Genea, você confirma que leu, entendeu e concorda com
              estes Termos de Uso.
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
