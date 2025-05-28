import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'small' }) => {
  const sizes = {
    small: 'h-6',
    medium: 'h-8',
    large: 'h-10'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Link to="/">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center"
        >
          <img src="/logo.png" alt="Logo" className={`${sizes[size]} w-auto`} />
          <div className="ml-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-3 py-1 rounded-full font-bold text-sm">
            dub
          </div>
        </motion.div>
      </Link>
    </div>
  );
};

export default Logo; 