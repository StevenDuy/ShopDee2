"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'flat' | 'elevated' | 'glass';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  variant = 'flat'
}) => {
  const variants = {
    flat: 'bg-[#f5f5f7] border-none',
    elevated: 'bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] border-none',
    glass: 'glass-card backdrop-blur-md',
  };

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.01 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      className={`p-6 ${variants[variant]} ${className}`}
      style={{ borderRadius: 'var(--border-radius-md)' }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
