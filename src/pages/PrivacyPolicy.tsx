import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4">
          A NAZE (CNPJ: 58.204.061/0001-50) está comprometida com a proteção da sua privacidade. 
          Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais 
          de acordo com a Lei Geral de Proteção de Dados (LGPD).
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">1. Informações que Coletamos</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Informações de cadastro (nome, e-mail)</li>
          <li>Informações de pagamento (processadas de forma segura)</li>
          <li>Dados de uso do serviço</li>
          <li>Informações técnicas do dispositivo</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">2. Como Usamos suas Informações</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Fornecer e melhorar nossos serviços</li>
          <li>Processar pagamentos</li>
          <li>Enviar comunicações importantes</li>
          <li>Garantir a segurança da plataforma</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">3. Seus Direitos (LGPD)</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Acesso aos seus dados</li>
          <li>Correção de dados incompletos ou incorretos</li>
          <li>Eliminação dos dados</li>
          <li>Portabilidade dos dados</li>
          <li>Revogação do consentimento</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">4. Segurança dos Dados</h2>
        <p className="mb-4">
          Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados pessoais 
          contra acesso não autorizado, alteração, divulgação ou destruição.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">5. Contato</h2>
        <p className="mb-4">
          Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
          <br />
          E-mail: contato@naze.com.br
          <br />
          CNPJ: 58.204.061/0001-50
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">6. Atualizações da Política</h2>
        <p className="mb-4">
          Esta política pode ser atualizada periodicamente. A versão mais recente estará sempre 
          disponível em nosso site.
        </p>

        <p className="mt-8 text-sm text-gray-600">
          Última atualização: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 