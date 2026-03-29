"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'flex items-center justify-center font-bold transition-all active:scale-95 cursor-pointer';
  
  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800 shadow-xl shadow-black/10',
    secondary: 'bg-[#f2f2f7] text-black hover:bg-gray-200',
    glass: 'glass-form border-none text-black hover:bg-white/20',
  };

  const sizes = {
    sm: 'h-[40px] px-6 text-xs rounded-xl',
    md: 'h-[60px] px-10 text-base rounded-[32px]',
    lg: 'h-[72px] px-12 text-lg rounded-[36px]',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
};
