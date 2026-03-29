"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface MobileLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  bottomNav?: React.ReactNode;
  className?: string;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  header, 
  bottomNav, 
  className = '' 
}) => {
  return (
    <div className="bg-[#f2f2f7] min-h-screen flex flex-col items-center">
      {/* Centered Main Shell */}
      <div className={`w-full max-w-[480px] bg-white min-h-screen relative flex flex-col shadow-sm ${className}`}>
        
        {/* Sticky Header Layer */}
        {header && (
          <header className="sticky top-0 z-[50] p-6 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between">
            {header}
          </header>
        )}

        <main className="flex-grow">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>

        {/* Padding for Bottom Nav */}
        <div className="h-24" />

        {/* Sticky Bottom Nav Layer */}
        {bottomNav && (
          <nav className="fixed bottom-0 w-full max-w-[480px] p-6 z-[50]">
            <div className="glass-form h-16 w-full flex items-center justify-around overflow-hidden p-2">
              {bottomNav}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};
