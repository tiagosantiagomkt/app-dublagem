import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-light-200 border-t border-gray-200 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center">
          <Logo size="small" className="mb-4" />
          <p className="text-gray-600 text-sm max-w-2xl mb-6">
            Transforme seus vídeos com nossa tecnologia de dublagem de ponta. 
            Rápido, simples e poderoso.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <Link to="/privacy" className="text-gray-600 hover:text-primary-400 transition-colors text-sm">
              Política de Privacidade
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-primary-400 transition-colors text-sm">
              Termos de Uso
            </Link>
            <a href="mailto:contato@naze.com.br" className="text-gray-600 hover:text-primary-400 transition-colors text-sm">
              contato@naze.com.br
            </a>
          </div>

          <div className="text-gray-600 text-sm">
            <p>&copy; {new Date().getFullYear()} NAZE. Todos os direitos reservados.</p>
            <p className="mt-1">CNPJ: 58.204.061/0001-50</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;