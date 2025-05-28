import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut } from 'lucide-react';
import Logo from './Logo';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import { authService, User } from '../services/auth';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
      setShowLoginModal(false);
    } catch (error) {
      throw error;
    }
  };

  const handleSignup = async (email: string, password: string) => {
    try {
      await authService.signup(email, password);
      setShowSignupModal(false);
      alert('Cadastro realizado com sucesso! Por favor, verifique seu email para confirmar sua conta.');
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  if (isLoading) {
    return null;
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-light-200 border-b border-gray-200 relative z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Menu para desktop */}
          <nav className="hidden md:flex md:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Acesso Gratuito
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Entrar
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSignupModal(true)}
                  className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  Cadastrar
                </motion.button>
              </div>
            )}
          </nav>

          {/* Botão do menu mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 hover:text-primary-400 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-light-200 border-t border-gray-200"
          >
            <div className="container mx-auto px-4 py-4">
              {user ? (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm text-gray-600">{user.email}</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block w-fit">
                      Acesso Gratuito
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Sair</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowLoginModal(true);
                    }}
                    className="block w-full text-left text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowSignupModal(true);
                    }}
                    className="block w-full text-center bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    Cadastrar
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSwitchToSignup={switchToSignup}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSubmit={handleSignup}
        onSwitchToLogin={switchToLogin}
      />
    </motion.header>
  );
};

export default Navbar;