import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const Navbar: React.FC = () => {
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
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;