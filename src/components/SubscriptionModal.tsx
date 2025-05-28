import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { STRIPE_PRODUCTS } from '../stripe-config';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => Promise<void>;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onSubscribe();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar assinatura');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">Assine o Plano Premium</h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 rounded-lg border border-primary-100">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {STRIPE_PRODUCTS.MONTHLY_PLAN.name}
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-primary-600">
                    R${STRIPE_PRODUCTS.MONTHLY_PLAN.price}
                  </span>
                  <span className="text-gray-500 ml-2">/mês</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {STRIPE_PRODUCTS.MONTHLY_PLAN.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white py-3 px-4 rounded-lg font-medium transition duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                      <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                  </>
                ) : (
                  `Assinar por R$${STRIPE_PRODUCTS.MONTHLY_PLAN.price}/mês`
                )}
              </button>

              <p className="text-sm text-gray-500 text-center">
                Cancele a qualquer momento. Sem compromisso.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionModal;