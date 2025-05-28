import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4">
          Bem-vindo aos Termos de Uso da NAZE (CNPJ: 58.204.061/0001-50). Este documento estabelece 
          as condições para uso de nossa plataforma de dublagem de vídeos.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">1. Aceitação dos Termos</h2>
        <p className="mb-4">
          Ao acessar ou usar nossos serviços, você concorda com estes termos. Se você não concordar 
          com qualquer parte destes termos, não poderá usar nossos serviços.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">2. Descrição do Serviço</h2>
        <p className="mb-4">
          Oferecemos uma plataforma de dublagem de vídeos que permite aos usuários:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Fazer upload de vídeos</li>
          <li>Gerar dublagens automatizadas</li>
          <li>Baixar vídeos dublados</li>
          <li>Gerenciar projetos de dublagem</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">3. Responsabilidades do Usuário</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Fornecer informações verdadeiras e atualizadas</li>
          <li>Manter a segurança de suas credenciais de acesso</li>
          <li>Não violar direitos autorais ou de propriedade intelectual</li>
          <li>Não usar o serviço para fins ilegais ou não autorizados</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">4. Propriedade Intelectual</h2>
        <p className="mb-4">
          O usuário mantém os direitos sobre seus vídeos originais. Nossa tecnologia de dublagem 
          e plataforma são propriedade exclusiva da NAZE.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">5. Pagamentos e Reembolsos</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Os preços são estabelecidos em nossa página de preços</li>
          <li>Cobranças são feitas antecipadamente</li>
          <li>Reembolsos podem ser solicitados em até 7 dias</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">6. Limitação de Responsabilidade</h2>
        <p className="mb-4">
          A NAZE não se responsabiliza por:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Interrupções no serviço</li>
          <li>Perda de dados</li>
          <li>Danos indiretos</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">7. Contato</h2>
        <p className="mb-4">
          Para dúvidas sobre estes termos, entre em contato:
          <br />
          E-mail: contato@naze.com.br
          <br />
          CNPJ: 58.204.061/0001-50
        </p>

        <p className="mt-8 text-sm text-gray-600">
          Última atualização: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default Terms; 