import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Assinatura Confirmada!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Parabéns! Sua assinatura foi ativada com sucesso. Você agora tem acesso a todos os recursos premium da plataforma.
        </p>

        <p className="text-sm text-gray-500">
          Redirecionando para a página inicial em {countdown} segundos...
        </p>
      </motion.div>
    </div>
  );
};

export default Success;